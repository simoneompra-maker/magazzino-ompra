// src/services/ocrService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Configurazione Gemini
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// USA gemini-2.5-flash-lite - 1000 req/giorno nel piano gratuito!
// Molto meglio di gemini-2.5-flash che ha solo 20 req/giorno
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash-lite"
});

// Rate limiting info - salvato in localStorage per persistenza
const STORAGE_KEY = 'ocr_rate_limit';

function getRateLimitInfo() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Reset se è passato più di 1 giorno
      if (Date.now() - data.lastReset > 24 * 60 * 60 * 1000) {
        return { count: 0, lastReset: Date.now(), blocked: false, blockedUntil: null };
      }
      return data;
    }
  } catch (e) {}
  return { count: 0, lastReset: Date.now(), blocked: false, blockedUntil: null };
}

function saveRateLimitInfo(info) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  } catch (e) {}
}

// Converti file in base64
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Comprimi immagine
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

// OCR Matricola con Gemini Vision
export async function scanMatricola(imageFile) {
  try {
    // Controlla se siamo bloccati
    const rateInfo = getRateLimitInfo();
    
    if (rateInfo.blocked && rateInfo.blockedUntil) {
      const remainingMs = rateInfo.blockedUntil - Date.now();
      if (remainingMs > 0) {
        const remainingMin = Math.ceil(remainingMs / 60000);
        return {
          success: false,
          error: `⏳ Limite API raggiunto. Riprova tra ${remainingMin} minuti o usa inserimento manuale.`,
          needsWait: true,
          isRateLimited: true
        };
      } else {
        // Sblocca
        rateInfo.blocked = false;
        rateInfo.blockedUntil = null;
        saveRateLimitInfo(rateInfo);
      }
    }
    
    console.log('📸 Inizio scansione OCR...');
    console.log(`📊 Scansioni oggi: ${rateInfo.count}/1000`);
    
    // Comprimi immagine
    const compressed = await compressImage(imageFile);
    console.log('✓ Immagine compressa');
    
    // Converti in base64
    const base64Data = await fileToBase64(compressed);
    console.log('✓ Convertita in base64');
    
    // Prompt ottimizzato per OCR etichette - con supporto matricole alfanumeriche
    const prompt = `
Analizza questa immagine di un'etichetta di una macchina agricola.
Estrai le seguenti informazioni se presenti:

1. BRAND/MARCA (es: Stihl, Honda, Echo, Grillo, Husqvarna, Yamabiko)
2. MODELLO (es: MSA 140, HRX 476, RMA 443.3, GCV170)
3. MATRICOLA/SERIAL NUMBER - codice identificativo univoco

IMPORTANTE PER MATRICOLA:
- Le matricole possono contenere SIA LETTERE che NUMERI
- Honda: formato tipico 4 lettere + 7 numeri (es: GCARK1234567, GJNAK5678901)
- Stihl: principalmente numeri (es: 450163072)
- Echo/Yamabiko: mix lettere e numeri
- Grillo: può avere prefissi con lettere
- LEGGI TUTTI I CARATTERI, sia lettere che numeri, dall'inizio alla fine
- NON omettere le lettere iniziali o finali

RISPONDI ESATTAMENTE IN QUESTO FORMATO (una riga per campo):
BRAND: [marca trovata o SCONOSCIUTO]
MODELLO: [modello trovato o SCONOSCIUTO]
MATRICOLA: [matricola COMPLETA con tutte le lettere e numeri, o ILLEGGIBILE]

Se non riesci a leggere un campo, usa SCONOSCIUTO o ILLEGGIBILE.
`;
    
    console.log('⚡ Chiamata API Gemini (gemini-2.5-flash-lite)...');
    const startTime = Date.now();
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg"
        }
      }
    ]);
    
    const responseTime = Date.now() - startTime;
    console.log(`✓ Risposta ricevuta in ${responseTime}ms`);
    
    // Aggiorna contatore
    rateInfo.count++;
    saveRateLimitInfo(rateInfo);
    
    const text = result.response.text().trim();
    console.log('📝 Risposta:', text);
    
    // Parse risposta
    const lines = text.split('\n');
    let brand = null;
    let modello = null;
    let matricola = null;
    
    for (const line of lines) {
      const upperLine = line.toUpperCase();
      if (upperLine.startsWith('BRAND:')) {
        const val = line.substring(6).trim();
        if (val && val.toUpperCase() !== 'SCONOSCIUTO') brand = val;
      } else if (upperLine.startsWith('MODELLO:')) {
        const val = line.substring(8).trim();
        if (val && val.toUpperCase() !== 'SCONOSCIUTO') modello = val;
      } else if (upperLine.startsWith('MATRICOLA:')) {
        const val = line.substring(10).trim();
        if (val && val.toUpperCase() !== 'ILLEGGIBILE') {
          matricola = val.replace(/\s+/g, '').toUpperCase();
        }
      }
    }
    
    // Se non ha trovato niente nel formato standard, prova a estrarre la matricola raw
    if (!matricola && text.length > 5 && text.length < 30 && !text.includes(':')) {
      matricola = text.replace(/\s+/g, '').toUpperCase();
    }
    
    const hasData = brand || modello || matricola;
    
    if (!hasData) {
      return {
        success: false,
        error: "Non riesco a leggere l'etichetta. Riprova con foto più chiara o inserisci manualmente.",
        confidence: 0
      };
    }
    
    console.log('✅ OCR completato:', { brand, modello, matricola });
    
    return {
      success: true,
      brand: brand,
      modello: modello,
      matricola: matricola,
      confidence: 90,
      responseTime: responseTime,
      rawText: text
    };
    
  } catch (error) {
    console.error('❌ Errore OCR:', error);
    
    const rateInfo = getRateLimitInfo();
    
    // Gestione errore 429 (rate limit)
    if (error.message?.includes('429') || 
        error.message?.includes('quota') || 
        error.message?.includes('rate') ||
        error.message?.includes('RESOURCE_EXHAUSTED') ||
        error.message?.includes('Too Many Requests')) {
      
      // Blocca per 2 minuti (flash-lite ha limiti molto alti, quindi blocco breve)
      rateInfo.blocked = true;
      rateInfo.blockedUntil = Date.now() + (2 * 60 * 1000);
      saveRateLimitInfo(rateInfo);
      
      return {
        success: false,
        error: '⏳ Troppe richieste ravvicinate. Attendi 2 minuti o usa inserimento manuale.',
        needsWait: true,
        isRateLimited: true,
        waitMinutes: 2
      };
    }
    
    if (error.message?.includes('API_KEY') || error.message?.includes('401')) {
      return {
        success: false,
        error: '🔑 Errore API Key. Contatta amministratore.',
        needsConfig: true
      };
    }
    
    return {
      success: false,
      error: 'Errore durante scansione. Riprova o inserisci manualmente.',
      technical: error.message
    };
  }
}

// Controlla stato rate limit
export function checkRateLimitStatus() {
  const info = getRateLimitInfo();
  return {
    count: info.count,
    maxDaily: 1000,
    blocked: info.blocked,
    blockedUntil: info.blockedUntil,
    remainingMinutes: info.blocked && info.blockedUntil 
      ? Math.max(0, Math.ceil((info.blockedUntil - Date.now()) / 60000))
      : 0
  };
}

// OCR Commissione/Buono di consegna scritto a mano
export async function scanCommissione(imageFile) {
  try {
    // Controlla se siamo bloccati
    const rateInfo = getRateLimitInfo();
    
    if (rateInfo.blocked && rateInfo.blockedUntil) {
      const remainingMs = rateInfo.blockedUntil - Date.now();
      if (remainingMs > 0) {
        const remainingMin = Math.ceil(remainingMs / 60000);
        return {
          success: false,
          error: `⏳ Limite API raggiunto. Riprova tra ${remainingMin} minuti.`,
          needsWait: true,
          isRateLimited: true
        };
      } else {
        rateInfo.blocked = false;
        rateInfo.blockedUntil = null;
        saveRateLimitInfo(rateInfo);
      }
    }
    
    console.log('📸 Inizio scansione commissione manuale...');
    
    // Comprimi immagine
    const compressed = await compressImage(imageFile);
    const base64Data = await fileToBase64(compressed);
    
    // Prompt specifico per buoni di consegna scritti a mano
    const prompt = `
Analizza questa immagine di un BUONO DI CONSEGNA scritto a mano.
È un modulo pre-stampato con campi compilati a penna.

Estrai le seguenti informazioni:

1. CLIENTE - Nome del cliente/destinatario (campo "A" o simile in alto)
2. ARTICOLI - Lista degli articoli con:
   - Descrizione prodotto
   - Quantità (numero)
   - Prezzo unitario o totale (se presente)
3. FATTURA - Se è indicato "Segue Fattura: SÌ" o "NO"
4. DATA - Data del documento se leggibile
5. NOTE - Eventuali annotazioni aggiuntive

IMPORTANTE:
- La scrittura è a mano, fai del tuo meglio per interpretarla
- Se un campo non è leggibile, indica "ILLEGGIBILE"
- Se un campo è vuoto, indica "VUOTO"
- I prezzi possono essere scritti come "400,00" o "€ 400" ecc.

RISPONDI IN QUESTO FORMATO JSON:
{
  "cliente": "nome cliente",
  "articoli": [
    {
      "descrizione": "descrizione prodotto",
      "quantita": 1,
      "prezzo": 400.00
    }
  ],
  "fattura": true,
  "data": "gg/mm/aaaa",
  "note": "eventuali note",
  "confidenza": "alta"
}

Il campo "confidenza" può essere: "alta", "media", "bassa"
Se non riesci a leggere nulla, rispondi con:
{ "errore": "descrizione problema" }
`;
    
    console.log('⚡ Chiamata API Gemini per OCR commissione...');
    const startTime = Date.now();
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg"
        }
      }
    ]);
    
    const responseTime = Date.now() - startTime;
    console.log(`✓ Risposta ricevuta in ${responseTime}ms`);
    
    // Aggiorna contatore
    rateInfo.count++;
    saveRateLimitInfo(rateInfo);
    
    const text = result.response.text().trim();
    console.log('📝 Risposta OCR:', text);
    
    // Estrai JSON dalla risposta
    let jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        success: false,
        error: "Non riesco a interpretare il buono. Riprova con foto più chiara.",
        rawText: text
      };
    }
    
    try {
      const data = JSON.parse(jsonMatch[0]);
      
      if (data.errore) {
        return {
          success: false,
          error: data.errore,
          rawText: text
        };
      }
      
      console.log('✅ OCR commissione completato:', data);
      
      return {
        success: true,
        cliente: data.cliente !== 'ILLEGGIBILE' && data.cliente !== 'VUOTO' ? data.cliente : null,
        articoli: data.articoli || [],
        fattura: data.fattura === true,
        data: data.data !== 'ILLEGGIBILE' && data.data !== 'VUOTO' ? data.data : null,
        note: data.note !== 'ILLEGGIBILE' && data.note !== 'VUOTO' ? data.note : null,
        confidenza: data.confidenza || 'media',
        responseTime: responseTime,
        rawText: text
      };
      
    } catch (parseError) {
      console.error('Errore parsing JSON:', parseError);
      return {
        success: false,
        error: "Errore nell'elaborazione. Riprova.",
        rawText: text
      };
    }
    
  } catch (error) {
    console.error('❌ Errore OCR commissione:', error);
    
    const rateInfo = getRateLimitInfo();
    
    if (error.message?.includes('429') || 
        error.message?.includes('quota') || 
        error.message?.includes('rate') ||
        error.message?.includes('RESOURCE_EXHAUSTED')) {
      
      rateInfo.blocked = true;
      rateInfo.blockedUntil = Date.now() + (2 * 60 * 1000);
      saveRateLimitInfo(rateInfo);
      
      return {
        success: false,
        error: '⏳ Troppe richieste. Attendi 2 minuti.',
        needsWait: true,
        isRateLimited: true
      };
    }
    
    return {
      success: false,
      error: 'Errore durante scansione. Riprova.',
      technical: error.message
    };
  }
}

// Reset manuale rate limit (per debug)
export function resetRateLimit() {
  localStorage.removeItem(STORAGE_KEY);
  console.log('✓ Rate limit reset');
}

// Test connessione API
export async function testGeminiAPI() {
  try {
    if (!GEMINI_API_KEY) {
      return { 
        success: false, 
        error: 'API Key non configurata' 
      };
    }
    
    const result = await model.generateContent("Rispondi solo: OK");
    const text = result.response.text();
    
    return { 
      success: true, 
      message: 'API Gemini funzionante!',
      model: 'gemini-2.5-flash-lite',
      response: text
    };
    
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    };
  }
}

export default scanMatricola;
