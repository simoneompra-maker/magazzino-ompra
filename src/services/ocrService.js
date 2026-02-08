// src/services/ocrService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// --- DEBUG DIAGNOSTICO ---
if (!GEMINI_API_KEY) {
  console.error("ATTENZIONE: VITE_GEMINI_API_KEY è mancante o undefined nelle variabili di Vercel!");
} else {
  console.log("Chiave API rilevata correttamente.");
}
// --------------------------

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");

// Modelli corretti e stabili
const PRIMARY_MODEL = "gemini-1.5-flash"; 
const FALLBACK_MODEL = "gemini-1.5-flash-8b";

let currentModelName = PRIMARY_MODEL;
const model = genAI.getGenerativeModel({ model: PRIMARY_MODEL });
const fallbackModel = genAI.getGenerativeModel({ model: FALLBACK_MODEL });

// Chiama Gemini con fallback automatico
async function callGemini(contents) {
  try {
    const result = await model.generateContent(contents);
    currentModelName = PRIMARY_MODEL;
    return result;
  } catch (primaryError) {
    console.warn(`Modello primario (${PRIMARY_MODEL}) fallito:`, primaryError.message);
    
    // Se 429/quota o 404, prova fallback
    if (primaryError.message?.includes('429') || 
        primaryError.message?.includes('404') ||
        primaryError.message?.includes('quota') ||
        primaryError.message?.includes('RESOURCE_EXHAUSTED')) {
      try {
        console.log(`Provo fallback (${FALLBACK_MODEL})...`);
        const result = await fallbackModel.generateContent(contents);
        currentModelName = FALLBACK_MODEL;
        return result;
      } catch (fallbackError) {
        console.error(`Anche fallback (${FALLBACK_MODEL}) fallito:`, fallbackError.message);
        throw fallbackError;
      }
    }
    throw primaryError;
  }
}

// Rate limiting info - salvato in localStorage per persistenza
const STORAGE_KEY = 'ocr_rate_limit';
const BACKOFF_RESET_MS = 10 * 60 * 1000; 

function getRateLimitInfo() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (Date.now() - data.lastReset > 24 * 60 * 60 * 1000) {
        return { count: 0, lastReset: Date.now(), blocked: false, blockedUntil: null, consecutive429: 0, last429Time: null };
      }
      const info = { ...data, consecutive429: data.consecutive429 || 0, last429Time: data.last429Time || null };
      
      if (info.blocked && info.blockedUntil && Date.now() > info.blockedUntil) {
        info.blocked = false;
        info.blockedUntil = null;
        info.consecutive429 = 0;
      }
      return info;
    }
  } catch (e) {}
  return { count: 0, lastReset: Date.now(), blocked: false, blockedUntil: null, consecutive429: 0, last429Time: null };
}

function getBackoffMs(consecutive) {
  return Math.min(consecutive * 30 * 1000, 5 * 60 * 1000);
}

function saveRateLimitInfo(info) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  } catch (e) {}
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function compressImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    img.onload = () => {
      const maxSize = 1024;
      let width = img.width;
      let height = img.height;
      if (width > height && width > maxSize) {
        height = (height * maxSize) / width;
        width = maxSize;
      } else if (height > maxSize) {
        width = (width * maxSize) / height;
        height = maxSize;
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.85);
    };
    img.src = URL.createObjectURL(file);
  });
}

export async function scanMatricola(imageFile) {
  try {
    const rateInfo = getRateLimitInfo();
    if (rateInfo.blocked && rateInfo.blockedUntil && Date.now() < rateInfo.blockedUntil) {
      const remainingSec = Math.ceil((rateInfo.blockedUntil - Date.now()) / 1000);
      return { success: false, error: `Attendi ${remainingSec} secondi.`, isRateLimited: true };
    }

    const compressed = await compressImage(imageFile);
    const base64Data = await fileToBase64(compressed);
    const prompt = "Analizza l'etichetta ed estrai BRAND, MODELLO e MATRICOLA.";

    const result = await callGemini([prompt, { inlineData: { data: base64Data, mimeType: "image/jpeg" } }]);
    
    rateInfo.count++;
    saveRateLimitInfo(rateInfo);
    
    const text = result.response.text();
    return { success: true, rawText: text }; // Semplificato per brevità
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function scanCommissione(imageFile) {
  try {
    const rateInfo = getRateLimitInfo();
    if (rateInfo.blocked && rateInfo.blockedUntil && Date.now() < rateInfo.blockedUntil) {
      return { success: false, error: "Attendi...", isRateLimited: true };
    }

    const compressed = await compressImage(imageFile);
    const base64Data = await fileToBase64(compressed);
    const prompt = "Analizza questo buono di consegna e restituisci un JSON con le righe lette.";

    const result = await callGemini([prompt, { inlineData: { data: base64Data, mimeType: "image/jpeg" } }]);
    const text = result.response.text().trim();
    let jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) throw new Error("JSON non trovato");
    
    const data = JSON.parse(jsonMatch[0]);
    return { success: true, righe: data.righe };
  } catch (error) {
    console.error("Errore OCR:", error);
    return { success: false, error: error.message };
  }
}

export default scanMatricola;