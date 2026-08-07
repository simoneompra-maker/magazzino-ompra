/**
 * Lettura delle linee dalla piantina Google Earth.
 *
 * Sulle piantine i percorsi sono tracciati a colori e ogni percorso ha
 * un'etichetta del tipo "Insetticida 250 m". Quella lunghezza e' misurata
 * da Google Earth ed e' il dato affidabile: leggerla a mano e ribatterla
 * e' lavoro inutile e una fonte di errori di trascrizione.
 *
 * Qui l'immagine va a Gemini, che restituisce le etichette con i metri.
 * Il risultato e' una PROPOSTA: l'utente la conferma prima che diventi
 * righe del progetto.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { DEFAULTS } from './catalogo';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Stessi modelli usati dall'OCR del magazzino: il primo e' piu' economico,
// il secondo interviene quando il primo e' sovraccarico o a quota esaurita
const MODELLO = 'gemini-2.5-flash-lite';
const MODELLO_RISERVA = 'gemini-2.5-flash';

const PROMPT = `Questa e' la planimetria di un giardino, presa da Google Earth, su cui
sono tracciati i percorsi di un impianto antizanzare.

Ogni percorso e' una linea colorata con accanto un'etichetta di testo che ne indica
il nome e la lunghezza, per esempio "Insetticida 250 m" oppure "Repellente 230 m".

Leggi SOLO le etichette scritte sull'immagine. Non stimare le lunghezze dal disegno
e non inventare valori: se un percorso non ha l'etichetta con i metri, non includerlo.

Ignora le etichette che non indicano un percorso, per esempio "Centralina", le date
o le coordinate.

Rispondi esclusivamente con un array JSON, senza testo attorno e senza blocchi di
codice. Ogni elemento:
{"etichetta": "<nome del percorso>", "metri": <numero>, "colore": "<colore della linea, se riconoscibile>"}

Se non trovi nessuna etichetta valida rispondi con [].`;

/** Converte un File o Blob nella forma che vuole Gemini. */
async function inlineData(file) {
  const buf = await file.arrayBuffer();
  let binario = '';
  const bytes = new Uint8Array(buf);
  const BLOCCO = 0x8000; // a pezzi: String.fromCharCode ha un limite di argomenti
  for (let i = 0; i < bytes.length; i += BLOCCO) {
    binario += String.fromCharCode(...bytes.subarray(i, i + BLOCCO));
  }
  return {
    inlineData: {
      data: btoa(binario),
      mimeType: file.type || 'image/png',
    },
  };
}

/** Estrae l'array JSON anche se il modello lo incarta in un blocco di codice. */
function estraiJson(testo) {
  const pulito = String(testo || '')
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
  const inizio = pulito.indexOf('[');
  const fine = pulito.lastIndexOf(']');
  if (inizio < 0 || fine < inizio) return [];
  try {
    return JSON.parse(pulito.slice(inizio, fine + 1));
  } catch {
    return [];
  }
}

/**
 * Legge le linee dalla piantina.
 * @param {File|Blob} file immagine della planimetria
 * @returns {Promise<Array<{etichetta:string, metri:number, passo:number, metriTronco:number, metodi:Object}>>}
 *          linee pronte da proporre, gia' nella forma usata dal progetto
 */
export async function leggiLineeDaPiantina(file) {
  if (!API_KEY) {
    throw new Error(
      'Chiave Gemini non configurata: imposta VITE_GEMINI_API_KEY nel file .env.local e su Vercel.'
    );
  }
  if (!file) throw new Error('Nessuna immagine da leggere.');

  const genAI = new GoogleGenerativeAI(API_KEY);
  const immagine = await inlineData(file);
  const contenuto = [PROMPT, immagine];

  let risposta;
  try {
    risposta = await genAI.getGenerativeModel({ model: MODELLO }).generateContent(contenuto);
  } catch (e) {
    const msg = e?.message || '';
    const sovraccarico = /429|503|quota|overloaded|RESOURCE_EXHAUSTED/i.test(msg);
    if (!sovraccarico) throw e;
    risposta = await genAI
      .getGenerativeModel({ model: MODELLO_RISERVA })
      .generateContent(contenuto);
  }

  const grezze = estraiJson(risposta?.response?.text?.() ?? '');

  return grezze
    .map((r) => ({
      etichetta: String(r?.etichetta ?? '').trim(),
      metri: Number(r?.metri),
      colore: r?.colore ? String(r.colore) : null,
    }))
    .filter((r) => r.etichetta && Number.isFinite(r.metri) && r.metri > 0)
    .map((r) => ({
      etichetta: r.etichetta,
      metri: r.metri,
      metriTronco: 0,
      passo: DEFAULTS.passo,
      metodi: {}, // la ripartizione per metodo la decide chi fa il preventivo
      colore: r.colore,
    }));
}
