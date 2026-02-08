// src/services/ocrService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Configurazione Gemini
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// USA gemini-2.5-flash-lite - 1000 req/giorno nel piano gratuito!
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash-lite"
});

// Rate limiting info - salvato in localStorage per persistenza
const STORAGE_KEY = 'ocr_rate_limit';
const BACKOFF_RESET_MS = 10 * 60 * 1000; // Reset backoff dopo 10 min senza errori

function getRateLimitInfo() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Reset giornaliero contatore
      if (Date.now() - data.lastReset > 24 * 60 * 60 * 1000) {
        return { count: 0, lastReset: Date.now(), blocked: false, blockedUntil: null, consecutive429: 0, last429Time: null };
      }
      const info = { ...data, consecutive429: data.consecutive429 || 0, last429Time: data.last429Time || null };
      
      // Se il blocco è scaduto, resetta tutto il backoff
      if (info.blocked && info.blockedUntil && Date.now() > info.blockedUntil) {
        info.blocked = false;
        info.blockedUntil = null;
        info.consecutive429 = 0;
        info.last429Time = null;
        saveRateLimitInfo(info);
      }
      // Se sono passati 10+ min dall'ultimo 429, resetta backoff
      else if (info.consecutive429 > 0 && info.last429Time && (Date.now() - info.last429Time > BACKOFF_RESET_MS)) {
        info.consecutive429 = 0;
        info.last429Time = null;
        saveRateLimitInfo(info);
      }
      
      return info;
    }
  } catch (e) {}
  return { count: 0, lastReset: Date.now(), blocked: false, blockedUntil: null, consecutive429: 0, last429Time: null };
}

// Calcola tempo di attesa con backoff: 60s, 120s, 180s...
function getBackoffMs(consecutive) {
  return Math.min((consecutive + 1) * 60 * 1000, 5 * 60 * 1000); // max 5 minuti
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
    const rateInfo = getRateLimitInfo();
    
    // Blocco gestito da getRateLimitInfo(), qui controlliamo solo se ancora attivo
    if (rateInfo.blocked && rateInfo.blockedUntil) {
      const remainingSec = Math.ceil((rateInfo.blockedUntil - Date.now()) / 1000);
      if (remainingSec > 0) {
        return {
          success: false,
          error: `Attendi ${remainingSec} secondi prima di riprovare.`,
          needsWait: true,
          isRateLimited: true
        };
      }
    }
    
    console.log('Inizio scansione OCR...');
    console.log(`Scansioni oggi: ${rateInfo.count}/1000`);
    
    const compressed = await compressImage(imageFile);
    const base64Data = await fileToBase64(compressed);
    
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
- Grillo: puo avere prefissi con lettere
- LEGGI TUTTI I CARATTERI, sia lettere che numeri, dall'inizio alla fine
- NON omettere le lettere iniziali o finali

RISPONDI ESATTAMENTE IN QUESTO FORMATO (una riga per campo):
BRAND: [marca trovata o SCONOSCIUTO]
MODELLO: [modello trovato o SCONOSCIUTO]
MATRICOLA: [matricola COMPLETA con tutte le lettere e numeri, o ILLEGGIBILE]

Se non riesci a leggere un campo, usa SCONOSCIUTO o ILLEGGIBILE.
`;
    
    console.log('Chiamata API Gemini (gemini-2.5-flash-lite)...');
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
    console.log(`Risposta ricevuta in ${responseTime}ms`);
    
    rateInfo.count++;
    rateInfo.consecutive429 = 0;
    rateInfo.last429Time = null;
    saveRateLimitInfo(rateInfo);
    
    const text = result.response.text().trim();
    console.log('Risposta:', text);
    
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
    
    if (!matricola && text.length > 5 && text.length < 30 && !text.includes(':')) {
      matricola = text.replace(/\s+/g, '').toUpperCase();
    }
    
    const hasData = brand || modello || matricola;
    
    if (!hasData) {
      return {
        success: false,
        error: "Non riesco a leggere l'etichetta. Riprova con foto piu chiara o inserisci manualmente.",
        confidence: 0
      };
    }
    
    console.log('OCR completato:', { brand, modello, matricola });
    
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
    console.error('Errore OCR:', error);
    
    const rateInfo = getRateLimitInfo();
    
    if (error.message?.includes('429') || 
        error.message?.includes('quota') || 
        error.message?.includes('rate') ||
        error.message?.includes('RESOURCE_EXHAUSTED') ||
        error.message?.includes('Too Many Requests')) {
      
      rateInfo.consecutive429 = (rateInfo.consecutive429 || 0) + 1;
      rateInfo.last429Time = Date.now();
      const waitMs = getBackoffMs(rateInfo.consecutive429);
      const waitSec = Math.ceil(waitMs / 1000);
      rateInfo.blocked = true;
      rateInfo.blockedUntil = Date.now() + waitMs;
      saveRateLimitInfo(rateInfo);
      
      return {
        success: false,
        error: `Limite API. Riprova tra ${waitSec >= 60 ? Math.ceil(waitSec/60) + ' minuti' : waitSec + ' secondi'}.`,
        needsWait: true,
        isRateLimited: true,
        waitSeconds: waitSec
      };
    }
    
    if (error.message?.includes('API_KEY') || error.message?.includes('401')) {
      return {
        success: false,
        error: 'Errore API Key. Contatta amministratore.',
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
    remainingSeconds: info.blocked && info.blockedUntil 
      ? Math.max(0, Math.ceil((info.blockedUntil - Date.now()) / 1000))
      : 0
  };
}

// OCR Commissione/Buono di consegna scritto a mano
// Approccio: legge righe e suggerisce categoria, l'utente corregge
export async function scanCommissione(imageFile) {
  try {
    const rateInfo = getRateLimitInfo();
    
    // Blocco gestito da getRateLimitInfo(), qui controlliamo solo se ancora attivo
    if (rateInfo.blocked && rateInfo.blockedUntil) {
      const remainingSec = Math.ceil((rateInfo.blockedUntil - Date.now()) / 1000);
      if (remainingSec > 0) {
        return {
          success: false,
          error: `Attendi ${remainingSec} secondi prima di riprovare.`,
          needsWait: true,
          isRateLimited: true
        };
      }
    }
    
    console.log('Inizio scansione commissione manuale...');
    
    const compressed = await compressImage(imageFile);
    const base64Data = await fileToBase64(compressed);
    
    const prompt = `
Analizza questa immagine di un BUONO DI CONSEGNA scritto a mano.

LEGGI OGNI RIGA scritta nel documento e per ognuna suggerisci a quale CAMPO appartiene.

CAMPI POSSIBILI:
- "cliente" = nome del cliente/destinatario (di solito dopo "A:" in alto)
- "macchina" = macchina/attrezzo con brand riconoscibile (Stihl, Honda, Echo, Husqvarna, Grillo, Viking, Kawasaki, Makita, Oleo-Mac, Bosch, John Deere, ARS, Pellenc, Infaco, Campagnola, Zanon, Cifarelli, Shindaiwa, Maruyama, Benassi). Se riconosci il brand, aggiungilo.
- "matricola" = numero di matricola/serial number di una macchina (es: "MATR. 450906088", "S/N: GCARK1234567"). Va SEMPRE dopo la riga macchina a cui si riferisce.
- "accessorio" = accessori, ricambi, consumabili (olio, filo, cinture, zaini, manici, ecc.)
- "prezzo_totale" = importo TOTALE della vendita (di solito in fondo al documento)
- "caparra" = acconto/caparra versata
- "fattura" = indicazione se serve fattura (SI/NO)
- "data" = data del documento
- "note" = altre annotazioni
- "ignora" = intestazione modulo, campi vuoti, cose irrilevanti

IMPORTANTE PER I PREZZI:
- Se accanto a una macchina o accessorio c'e un prezzo, INCLUDILO nel campo "prezzo" della stessa riga
- Il campo "prezzo_totale" e SOLO per l'importo totale finale in fondo al documento
- NON creare righe separate per i prezzi degli articoli - mettili nel campo "prezzo" dell'articolo

RISPONDI IN JSON:
{
  "righe": [
    { "testo": "Mario Rossi", "campo": "cliente", "brand": null, "prezzo": null },
    { "testo": "Segaccio 470mm", "campo": "macchina", "brand": "ARS", "prezzo": 150.00 },
    { "testo": "MATR. 450906088", "campo": "matricola", "brand": null, "prezzo": null },
    { "testo": "Manico telescopico", "campo": "accessorio", "brand": null, "prezzo": 40.00 },
    { "testo": "190,00", "campo": "prezzo_totale", "brand": null, "prezzo": 190.00 },
    { "testo": "50,00", "campo": "caparra", "brand": null, "prezzo": 50.00 },
    { "testo": "SI", "campo": "fattura", "brand": null, "prezzo": null },
    { "testo": "07/01/2025", "campo": "data", "brand": null, "prezzo": null }
  ]
}

REGOLE:
- Leggi TUTTE le righe scritte a mano, dall'alto in basso
- NON saltare nessuna riga
- Per le macchine: se riconosci il brand mettilo nel campo "brand"
- Se trovi un numero di matricola (MATR., S/N, serial), mettilo come riga separata con campo "matricola" SUBITO DOPO la riga macchina corrispondente
- ASSOCIA i prezzi agli articoli: se una riga ha sia descrizione che prezzo, metti il prezzo nel campo "prezzo" di quella riga
- Se un prezzo e chiaramente il totale complessivo, usa "prezzo_totale"
- Se un importo sembra un acconto/caparra, usa "caparra"  
- Ignora le parti pre-stampate del modulo
- RISPONDI SOLO CON IL JSON, nessun altro testo
`;
    
    console.log('Chiamata API Gemini per OCR commissione...');
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
    console.log(`Risposta ricevuta in ${responseTime}ms`);
    
    rateInfo.count++;
    rateInfo.consecutive429 = 0;
    rateInfo.last429Time = null;
    saveRateLimitInfo(rateInfo);
    
    const text = result.response.text().trim();
    console.log('Risposta OCR:', text);
    
    // Estrai JSON dalla risposta
    let jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        success: false,
        error: "Non riesco a leggere il buono. Riprova con foto piu chiara.",
        rawText: text
      };
    }
    
    try {
      const data = JSON.parse(jsonMatch[0]);
      
      if (!data.righe || data.righe.length === 0) {
        return {
          success: false,
          error: "Nessuna riga letta. Riprova con foto piu chiara.",
          rawText: text
        };
      }
      
      // Mappa le righe con id univoco
      const righe = data.righe.map((r, i) => ({
        id: i,
        testo: r.testo || '',
        campo: r.campo || 'ignora',
        brand: r.brand || null,
        prezzo: r.prezzo != null ? r.prezzo : null
      }));
      
      console.log('OCR commissione completato:', righe);
      
      return {
        success: true,
        righe: righe,
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
    console.error('Errore OCR commissione:', error);
    
    const rateInfo = getRateLimitInfo();
    
    if (error.message?.includes('429') || 
        error.message?.includes('quota') || 
        error.message?.includes('rate') ||
        error.message?.includes('RESOURCE_EXHAUSTED')) {
      
      rateInfo.consecutive429 = (rateInfo.consecutive429 || 0) + 1;
      rateInfo.last429Time = Date.now();
      const waitMs = getBackoffMs(rateInfo.consecutive429);
      const waitSec = Math.ceil(waitMs / 1000);
      rateInfo.blocked = true;
      rateInfo.blockedUntil = Date.now() + waitMs;
      saveRateLimitInfo(rateInfo);
      
      return {
        success: false,
        error: `Limite API. Riprova tra ${waitSec >= 60 ? Math.ceil(waitSec/60) + ' minuti' : waitSec + ' secondi'}.`,
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
  console.log('Rate limit reset');
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
