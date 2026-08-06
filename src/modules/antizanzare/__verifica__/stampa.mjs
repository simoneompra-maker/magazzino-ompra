/**
 * Prova di stampa della nota di carico.
 * Uso:  node src/modules/antizanzare/__verifica__/stampa.mjs
 *
 * Genera il file, lo converte in PDF con LibreOffice e verifica che il
 * modulo entri in LARGHEZZA su un A4 verticale: se una colonna finisce
 * sulla pagina successiva, il tecnico si ritrova le caselle da compilare
 * su un foglio separato e il modulo e' inservibile.
 *
 * Il controllo non guarda il numero di pagine — scorrere in verticale va
 * bene — ma verifica che ogni pagina contenga TUTTE le intestazioni di
 * colonna della tabella materiali. Se ne mancano, c'e' stato uno sbordo
 * laterale.
 *
 * Richiede LibreOffice e poppler-utils (pdftotext, pdfinfo).
 */

import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { costruisciNotaCarico } from '../export/exportNotaCarico.js';

const LAVORO = '/tmp/az-stampa';

/* Colonne che devono stare tutte sullo stesso foglio */
const INTESTAZIONI = ['Codice', 'Descrizione', 'U.M.', 'Q.tà prevista', 'Q.tà usata', 'Extra usati', 'Note'];

const A4_LARGHEZZA_PT = 595.28;
const A4_ALTEZZA_PT = 841.89;

function comando(cmd, args) {
  return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function disponibile(cmd) {
  try {
    comando('which', [cmd]);
    return true;
  } catch {
    return false;
  }
}

/** Caso di prova realistico: descrizioni lunghe e piu' metodi per linea. */
function datiProva() {
  const linee = [
    {
      etichetta: 'Insetticida perimetro nord',
      metri: 250,
      metriTronco: 15,
      passo: 4,
      metodi: { m1d: 63 },
      ugelliPrevisti: 63,
    },
    {
      etichetta: 'Repellente siepe',
      metri: 230,
      metriTronco: 0,
      passo: 4,
      metodi: { m1a: 40, m3d: 18 },
      ugelliPrevisti: 58,
    },
    {
      etichetta: 'Dorsale pergolato',
      metri: 60,
      metriTronco: 60,
      passo: 3,
      metodi: { m4d: 15, m4a: 5 },
      ugelliPrevisti: 20,
    },
  ];

  // Descrizioni volutamente lunghe: sono il caso peggiore per la larghezza
  const bom = [
    { code: 'Comfort02', desc: 'Centralina — Comfort 02 Dual — 2 linee (150 ug./linea)', um: 'pz', q: 1 },
    { code: 'TBPA30BAR1/4', desc: 'Tubo linea — Tubo PA 1/4" 30 bar 100 m', um: 'm', q: 501 },
    { code: 'TBPA80BAR3/8', desc: 'Tubo tronco — Tubo PA 3/8" 80 bar 100 m', um: 'm', q: 75 },
    { code: 'UGEL0015C', desc: 'Ugelli — Ugello 0,015 mm ceramico', um: 'pz', q: 141 },
    { code: 'RACCPUD1/4', desc: 'Portaugelli dritti — Porta ugello dritto 1/4"', um: 'pz', q: 96 },
    { code: 'BASINXUG1/4', desc: 'Portaugelli angolati — Base innesto 90° ugello 1/4"', um: 'pz', q: 45 },
    { code: 'RACCT3/8', desc: 'Raccordi a T — Raccordo T 3/8"', um: 'pz', q: 141 },
    { code: 'RIDDRI3/8-1/4', desc: 'Riduzioni 3/8-1/4 — Riduzione dritta 3/8→1/4', um: 'pz', q: 20 },
    { code: 'RACCFL3/8', desc: 'Tappi fine linea — Fine linea cieco 3/8"', um: 'pz', q: 3 },
    { code: 'PROXUGUNI15', desc: 'Accessori — Prolunga pieghevole ugello 15 cm', um: 'pz', q: 30 },
    { code: 'AC101110', desc: 'Accessori — Tubolare PVC tipo bambù 100 cm', um: 'pz', q: 12 },
    { code: '—', desc: 'Paletto PVC 1 m con staffa di fissaggio rinforzata', um: 'pz', q: 8 },
  ];

  return {
    progetto: {
      numero: 'AZ-2026-001',
      cliente_nome: 'Di Lenardo Marco',
      indirizzo: 'Via Roma 12, San Biagio di Callalta (TV)',
      tecnico: 'Stefano',
      data_montaggio: '2026-09-15',
    },
    bom,
    linee,
    risultato: {
      brand: 'Gardheaven',
      macchina: { label: 'Comfort 02 Dual — 2 linee (150 ug./linea)' },
    },
  };
}

/** Distinta lunga: costringe il modulo su piu' pagine. */
function datiProvaLunga() {
  const base = datiProva();
  const bom = [];
  for (let i = 0; i < 34; i += 1) {
    bom.push({
      code: `ART${String(i + 1).padStart(4, '0')}`,
      desc:
        i % 3 === 0
          ? `Accessori — Articolo di prova numero ${i + 1} con descrizione lunga che deve andare a capo`
          : `Accessori — Articolo di prova numero ${i + 1}`,
      um: 'pz',
      q: (i + 1) * 3,
    });
  }
  return { ...base, bom };
}

/** Converte in PDF e restituisce il testo di ogni pagina. */
function stampa(dati, nomeProva) {
  return (async () => {
    const { filename, blob } = costruisciNotaCarico(dati);
    const xlsx = `${LAVORO}/${nomeProva}_${filename}`;
    writeFileSync(xlsx, Buffer.from(await blob.arrayBuffer()));
    comando('soffice', ['--headless', '--convert-to', 'pdf', '--outdir', LAVORO, xlsx]);
    const pdf = xlsx.replace(/\.xlsx$/, '.pdf');
    if (!existsSync(pdf)) throw new Error('LibreOffice non ha prodotto il PDF');

    const info = comando('pdfinfo', [pdf]);
    const pagine = Number(/Pages:\s+(\d+)/.exec(info)?.[1] || 0);
    const dim = /Page size:\s+([\d.]+) x ([\d.]+)/.exec(info);
    const testi = [];
    for (let p = 1; p <= pagine; p += 1) {
      testi.push(comando('pdftotext', ['-f', String(p), '-l', String(p), '-layout', pdf, '-']));
    }
    return {
      pdf,
      pagine,
      larghezza: Number(dim?.[1] || 0),
      altezza: Number(dim?.[2] || 0),
      testi,
    };
  })();
}

async function main() {
  for (const c of ['soffice', 'pdftotext', 'pdfinfo']) {
    if (!disponibile(c)) {
      console.error(`Manca ${c}: la prova di stampa richiede LibreOffice e poppler-utils.`);
      process.exit(2);
    }
  }

  if (existsSync(LAVORO)) rmSync(LAVORO, { recursive: true, force: true });
  mkdirSync(LAVORO, { recursive: true });

  const { filename, blob } = costruisciNotaCarico(datiProva());
  const xlsx = `${LAVORO}/${filename}`;
  writeFileSync(xlsx, Buffer.from(await blob.arrayBuffer()));

  comando('soffice', ['--headless', '--convert-to', 'pdf', '--outdir', LAVORO, xlsx]);
  const pdf = xlsx.replace(/\.xlsx$/, '.pdf');
  if (!existsSync(pdf)) {
    console.error('LibreOffice non ha prodotto il PDF.');
    process.exit(1);
  }

  const info = comando('pdfinfo', [pdf]);
  const pagine = Number(/Pages:\s+(\d+)/.exec(info)?.[1] || 0);
  const dim = /Page size:\s+([\d.]+) x ([\d.]+)/.exec(info);
  const larghezza = Number(dim?.[1] || 0);
  const altezza = Number(dim?.[2] || 0);

  console.log(`\nFile:    ${filename}`);
  console.log(`Formato: ${larghezza.toFixed(0)} x ${altezza.toFixed(0)} pt`);
  console.log(`Pagine:  ${pagine}`);

  let ko = 0;
  const esito = (etichetta, ok, dettaglio = '') => {
    if (!ok) ko += 1;
    console.log(`   ${ok ? '✅' : '❌'} ${etichetta}${dettaglio ? ' — ' + dettaglio : ''}`);
  };

  console.log('\nControlli');
  esito(
    'formato A4 verticale',
    Math.abs(larghezza - A4_LARGHEZZA_PT) < 3 && Math.abs(altezza - A4_ALTEZZA_PT) < 3,
    `${larghezza.toFixed(0)}x${altezza.toFixed(0)}`
  );

  // Su ogni pagina che contiene la tabella materiali devono esserci
  // TUTTE le colonne: se ne manca una, e' sbordata di lato.
  const testoPagine = [];
  for (let p = 1; p <= pagine; p += 1) {
    testoPagine.push(comando('pdftotext', ['-f', String(p), '-l', String(p), '-layout', pdf, '-']));
  }

  const pagineConTabella = testoPagine
    .map((t, i) => ({ n: i + 1, t }))
    .filter(({ t }) => t.includes('Codice') || t.includes('Q.tà usata') || t.includes('Descrizione'));

  esito('la tabella materiali compare nel PDF', pagineConTabella.length > 0);

  pagineConTabella.forEach(({ n, t }) => {
    const mancanti = INTESTAZIONI.filter((h) => !t.includes(h));
    esito(
      `pagina ${n}: tutte e ${INTESTAZIONI.length} le colonne presenti`,
      mancanti.length === 0,
      mancanti.length ? `mancano: ${mancanti.join(', ')}` : ''
    );
  });

  // Nessuna pagina deve contenere SOLO le colonne di destra: e' il sintomo
  // classico dello sbordo laterale.
  const sbordo = testoPagine.some(
    (t, i) => i > 0 && t.includes('Q.tà usata') && !t.includes('Codice') && !t.includes('Descrizione')
  );
  esito('nessuno sbordo laterale su pagine successive', !sbordo);

  // Le descrizioni lunghe devono andare a capo, non essere troncate
  const tutto = testoPagine.join('\n');
  esito(
    'le descrizioni lunghe restano leggibili',
    tutto.includes('Base innesto') || tutto.includes('Portaugelli angolati')
  );

  console.log(`\nPDF: ${pdf}`);

  /* ── seconda prova: distinta lunga, deve impaginare bene ── */
  const lunga = await stampa(datiProvaLunga(), 'lunga');
  console.log(`\nDistinta lunga (34 articoli): ${lunga.pagine} pagine`);

  esito('la distinta lunga occupa piu' + String.fromCharCode(39) + ' pagine', lunga.pagine >= 2,
    `${lunga.pagine}`);

  lunga.testi.forEach((t, i) => {
    const haDati = /ART\d{4}/.test(t);
    if (!haDati) return;
    const mancanti = INTESTAZIONI.filter((h) => !t.includes(h));
    esito(
      `pagina ${i + 1} della distinta lunga: intestazioni ripetute`,
      mancanti.length === 0,
      mancanti.length ? `mancano: ${mancanti.join(', ')}` : ''
    );
  });

  esito(
    'nessun articolo perso fra le pagine',
    lunga.testi.join('').match(/ART\d{4}/g)?.length === 34,
    `trovati ${lunga.testi.join('').match(/ART\d{4}/g)?.length ?? 0} su 34`
  );

  console.log(`PDF: ${lunga.pdf}`);

  /* ── terza prova: tante lunghezze diverse, nessun titolo orfano ──
     Un titolo di sezione in fondo al foglio con la tabella sulla pagina
     dopo e' il difetto tipico dell'impaginazione automatica. */
  console.log('\nTitoli di sezione mai orfani, al variare della lunghezza');
  const TITOLI = ['MATERIALE', 'MATERIALE NON PREVISTO', 'LINEE'];
  for (const n of [14, 18, 22, 24, 26, 28, 30, 32]) {
    const base = datiProva();
    const bom = Array.from({ length: n }, (_, i) => ({
      code: `ART${String(i + 1).padStart(4, '0')}`,
      desc: `Accessori — Articolo di prova numero ${i + 1}`,
      um: 'pz',
      q: i + 1,
    }));
    const res = await stampa({ ...base, bom }, `n${n}`);

    const orfani = [];
    res.testi.forEach((t, i) => {
      const righeTesto = t.split('\n').map((x) => x.trim()).filter(Boolean);
      const ultime = righeTesto.slice(-2).join(' ');
      TITOLI.forEach((titolo) => {
        // titolo fra le ultime righe della pagina e nessuna riga di tabella dopo
        if (ultime.includes(titolo) && !ultime.includes('Codice')) {
          orfani.push(`"${titolo}" in fondo a pagina ${i + 1}`);
        }
      });
    });

    // Una pagina quasi vuota — tipicamente la sola firma — e' spreco di carta
    const quasiVuote = res.testi
      .map((t, i) => ({ n: i + 1, righe: t.split('\n').filter((x) => x.trim()).length }))
      .filter((x) => x.righe > 0 && x.righe < 3);
    if (quasiVuote.length) {
      orfani.push(`pagina ${quasiVuote.map((x) => x.n).join(',')} quasi vuota`);
    }

    const articoli = res.testi.join('').match(/ART\d{4}/g)?.length ?? 0;
    esito(
      `distinta da ${String(n).padStart(2)} articoli: ${res.pagine} pag., nessun orfano`,
      orfani.length === 0 && articoli === n,
      [orfani.join('; '), articoli !== n ? `articoli ${articoli}/${n}` : ''].filter(Boolean).join(' · ')
    );
  }
  console.log('─'.repeat(64));
  console.log(ko === 0 ? '✅ STAMPA A4 VERTICALE OK' : `❌ ${ko} problemi di impaginazione`);
  process.exit(ko === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('Errore: ' + (e?.message || e));
  process.exit(1);
});
