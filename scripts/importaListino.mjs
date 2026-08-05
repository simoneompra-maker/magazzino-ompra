/**
 * Importa Listino_Unificato_Antizanzare.xlsx nella tabella az_listino.
 *
 * Uso:
 *   node scripts/importaListino.mjs
 *   node scripts/importaListino.mjs "C:\\percorso\\Listino_Unificato_Antizanzare.xlsx"
 *
 * Rilancialo ogni volta che aggiorni i prezzi: sostituisce l'intero
 * contenuto della tabella, non lascia articoli orfani.
 *
 * Legge il foglio "Anagrafica" con queste colonne, nell'ordine:
 *   ID · Codice · Descrizione · Marca · Linea · Categoria · Sistema · U.M.
 *   Listino escl. IVA · Listino incl. IVA · Costo escl. IVA · Sconto % · Stato · Note
 */

import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createClient } from '@supabase/supabase-js';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const SUPABASE_URL = 'https://eoswkplehhmtxtattsha.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvc3drcGxlaGhtdHh0YXR0c2hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2MTY3NzcsImV4cCI6MjA4MjE5Mjc3N30.cUg61XjJf2fmTi6dAQ2EaBl49pRrtgBTN7A2EyMyvLI';

const PERCORSI_PREDEFINITI = [
  process.argv[2],
  'C:/Users/simon/OneDrive/OMPRA/LISTINI/ANTIZANZARE/Listino_Unificato_Antizanzare.xlsx',
  './Listino_Unificato_Antizanzare.xlsx',
].filter(Boolean);

const testo = (v) => {
  const s = String(v ?? '').trim();
  return s === '' ? null : s;
};

const numero = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const n = parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
};

function trovaFile() {
  const p = PERCORSI_PREDEFINITI.find((x) => existsSync(x));
  if (!p) {
    console.error('File non trovato. Percorsi provati:');
    PERCORSI_PREDEFINITI.forEach((x) => console.error('  ' + x));
    console.error('\nPassa il percorso come argomento:');
    console.error('  node scripts/importaListino.mjs "C:\\\\percorso\\\\Listino.xlsx"');
    process.exit(1);
  }
  return p;
}

function leggi(percorso) {
  const wb = XLSX.read(readFileSync(percorso), { type: 'buffer' });
  const nome = wb.SheetNames.includes('Anagrafica') ? 'Anagrafica' : wb.SheetNames[0];
  const righe = XLSX.utils.sheet_to_json(wb.Sheets[nome], { header: 1, blankrows: false });

  const intestazione = righe[0] || [];
  const atteso = ['ID', 'Codice', 'Descrizione'];
  const combacia = atteso.every((h, i) => String(intestazione[i] || '').trim() === h);
  if (!combacia) {
    console.error(`Foglio "${nome}": intestazione inattesa.`);
    console.error('  trovata: ' + intestazione.slice(0, 3).join(' · '));
    console.error('  attesa : ' + atteso.join(' · '));
    process.exit(1);
  }

  const articoli = [];
  const scartati = [];

  righe.slice(1).forEach((r, i) => {
    const codice = testo(r[1]);
    const descrizione = testo(r[2]);
    if (!codice || !descrizione) {
      if (r.some((c) => testo(c))) scartati.push(i + 2);
      return;
    }
    const marca = testo(r[3]);
    articoli.push({
      riga_id: testo(r[0]),
      codice,
      descrizione,
      marca,
      linea: testo(r[4]),
      categoria: testo(r[5]),
      sistema: testo(r[6]),
      um: testo(r[7]) || 'pz',
      listino: numero(r[8]),
      listino_iva: numero(r[9]),
      costo: numero(r[10]),
      stato: testo(r[12]),
      note: testo(r[13]),
      ricerca: [codice, descrizione, marca].filter(Boolean).join(' ').toLowerCase(),
    });
  });

  return { nome, articoli, scartati };
}

async function main() {
  const percorso = trovaFile();
  console.log('File:   ' + percorso);

  const { nome, articoli, scartati } = leggi(percorso);
  console.log(`Foglio: ${nome}`);
  console.log(`Letti:  ${articoli.length} articoli`);
  if (scartati.length) {
    console.log(`        ${scartati.length} righe saltate (codice o descrizione mancanti): ` +
      scartati.slice(0, 10).join(', ') + (scartati.length > 10 ? '…' : ''));
  }

  const conCosto = articoli.filter((a) => a.costo != null).length;
  const conListino = articoli.filter((a) => a.listino != null).length;
  console.log(`        ${conListino} con prezzo di listino, ${conCosto} con costo reale`);

  if (articoli.length === 0) {
    console.error('Niente da importare.');
    process.exit(1);
  }

  const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Sostituzione completa: il listino e' la fonte di verita'
  const { error: eDel } = await db.from('az_listino').delete().neq('codice', '___nessuno___');
  if (eDel) {
    console.error('Svuotamento fallito: ' + eDel.message);
    process.exit(1);
  }

  const BLOCCO = 200;
  let inseriti = 0;
  for (let i = 0; i < articoli.length; i += BLOCCO) {
    const parte = articoli.slice(i, i + BLOCCO);
    const { error } = await db.from('az_listino').insert(parte);
    if (error) {
      console.error(`\nInserimento fallito al blocco ${i / BLOCCO + 1}: ${error.message}`);
      process.exit(1);
    }
    inseriti += parte.length;
    process.stdout.write(`\rInseriti: ${inseriti}/${articoli.length}`);
  }

  const { count } = await db.from('az_listino').select('*', { count: 'exact', head: true });
  console.log(`\n\n✅ Importati ${inseriti} articoli. In tabella: ${count}.`);
}

main().catch((e) => {
  console.error('\nErrore: ' + (e?.message || e));
  process.exit(1);
});
