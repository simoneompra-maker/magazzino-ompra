/**
 * Confronto motore originale vs calcolo.js.
 * Uso:  node src/modules/antizanzare/__verifica__/confronto.mjs
 */

import { eseguiOriginale } from './oracolo.mjs';
import { calcolaImpianto } from '../calcolo.js';
import { C, UNIVERSAL } from '../catalogo.js';

const HTML =
  process.env.AZ_HTML ||
  '/sessions/youthful-peaceful-faraday/mnt/ANTIZANZARE/Calcolatore_Impianto_Antizanzare.html';

const r2 = (n) => Math.round((n || 0) * 100) / 100;
const eur = (n) => r2(n).toFixed(2).padStart(11);

/** Dato un brand e gli indici usati dall'originale, ricava i codici per il motore nuovo. */
function codici(brand, idx) {
  const s = C.sys[C.brands[brand].sys];
  return {
    macchinaCode: C.machines[brand][idx.macchina].code,
    tuboCode: s.tubo[idx.tubo].code,
    tuboTroncoCode: s.tubo[idx.tuboTronco].code,
    ugelloCode: s.ugello[idx.ugello].code,
    portaDCode: s.porta[idx.portaD]?.code,
    porta9Code: s.porta[idx.porta9]?.code,
    tselCode: s.tsel[idx.tsel].code,
  };
}

/**
 * Costruisce un caso di prova partendo dalle LINEE, come fa l'app.
 * Da quelle derivo poi le zone e le 5 quantita' globali che serve
 * dare in pasto al calcolatore originale.
 */
function scenario(nome, brand, linee, idx, opz = {}) {
  return { nome, brand, linee, idx, ...opz };
}

const CASI = [
  // ── Di Lenardo: Gardheaven Comfort02, 250 + 230 m ──────────
  scenario(
    'Di Lenardo — Gardheaven Comfort02, 250+230 m',
    'gardheaven',
    [
      { etichetta: 'Insetticida', metri: 250, passo: 4, metodo: 'm1d' },
      { etichetta: 'Repellente', metri: 230, passo: 4, metodo: 'm1d' },
    ],
    { macchina: 1, tubo: 0, tuboTronco: 2, ugello: 0, portaD: 0, porta9: 1, tsel: 0 },
    { scontoAcq: 50, extra: 0, mTronco: 15, riserM: 2, manoMode: 'det', manoMac: 200, manoRate: 9 }
  ),

  // ── Geyser Pro Dual, 3 linee, passi diversi ────────────────
  scenario(
    'Geyser Pro Dual — 3 linee 120/90/60 m, passi 4/3/5',
    'geyser',
    [
      { metri: 120, passo: 4, metodo: 'm1d' },
      { metri: 90, passo: 3, metodo: 'm1d' },
      { metri: 60, passo: 5, metodo: 'm1d' },
    ],
    { macchina: 1, tubo: 0, tuboTronco: 3, ugello: 1, portaD: 0, porta9: 1, tsel: 1 },
    { scontoAcq: 0, extra: 10, mTronco: 25, riserM: 2, manoMode: 'perUg', manoRate: 12 }
  ),

  // ── Zanzero PRO: metodi misti 1-dritto / 2 in linea / 3 riser ──
  scenario(
    'Zanzero PRO ZA200 Dual — metodi misti 1/2/3',
    'pro',
    [
      { etichetta: 'Recinzione', metri: 140, passo: 3.5, metodo: 'm1d' },
      { etichetta: 'Pergolato', metri: 52.5, passo: 3.5, metodo: 'm2q' },
      { etichetta: 'Aiuola', metri: 52.5, passo: 3.5, metodo: 'm3d' },
    ],
    { macchina: 10, tubo: 0, tuboTronco: 0, ugello: 1, portaD: 0, porta9: 2, tsel: 0 },
    { scontoAcq: 30, extra: 15, mTronco: 0, riserM: 1.5, manoMode: 'det', manoMac: 250, manoRate: 8 }
  ),

  // ── Gardheaven: portaugelli 90° + riser (esercita noveN e riserMeters) ──
  scenario(
    'Gardheaven Comfort01 — 90° e riser su paletti',
    'gardheaven',
    [
      { etichetta: 'Siepe', metri: 100, passo: 4, metodo: 'm1a' },
      { etichetta: 'Paletti', metri: 60, passo: 3, metodo: 'm3a' },
    ],
    { macchina: 0, tubo: 1, tuboTronco: 2, ugello: 5, portaD: 0, porta9: 1, tsel: 1 },
    { scontoAcq: 50, extra: 25, mTronco: 20, riserM: 1.5, manoMode: 'det', manoMac: 200, manoRate: 12 }
  ),

  // ── Zanzero SMART con accessori e voci extra ───────────────
  scenario(
    'Zanzero SMART ZA18 — con accessori e voci extra',
    'smart',
    [{ metri: 60, passo: 3, metodo: 'm1d' }],
    { macchina: 1, tubo: 0, tuboTronco: 0, ugello: 0, portaD: 0, porta9: 1, tsel: 0 },
    {
      scontoAcq: 30,
      extra: 20,
      mTronco: 0,
      riserM: 2,
      manoMode: 'manual',
      manoRate: 450,
      accessori: [
        { i: 0, q: 1 },
        { i: 1, q: 2 },
      ],
      vociExtra: [{ desc: 'Paletto PVC 1 m', q: 8, c: 3.2, p: 9 }],
    }
  ),
];

let falliti = 0;

for (const caso of CASI) {
  const { brand, linee, idx } = caso;
  const s = C.sys[C.brands[brand].sys];

  // Dalle linee derivo cio' che serve al calcolatore originale:
  // le zone (metri + passo) e le 5 quantita' globali per metodo.
  const zones = linee.map((l) => ({ m: l.metri, passo: l.passo }));
  const metodi = { m1d: 0, m1a: 0, m2q: 0, m3d: 0, m3a: 0 };
  linee.forEach((l) => {
    const n = l.metri > 0 ? Math.ceil(l.metri / l.passo) : 0;
    metodi[l.metodo] += n;
  });

  /* ---- originale ---- */
  const campi = {
    brand,
    macchina: idx.macchina,
    tubo: idx.tubo,
    tuboTronco: idx.tuboTronco,
    ugello: idx.ugello,
    portaD: idx.portaD,
    porta9: idx.porta9,
    tsel: idx.tsel,
    usaTappo: true,
    mTronco: caso.mTronco,
    riserM: caso.riserM,
    scontoAcq: caso.scontoAcq,
    extra: caso.extra,
    manoMode: caso.manoMode,
    manoMac: caso.manoMac ?? 200,
    manoRate: caso.manoRate,
    m1d: metodi.m1d,
    m1a: metodi.m1a,
    m2q: metodi.m2q,
    m3d: metodi.m3d,
    m3a: metodi.m3a,
  };

  const old = eseguiOriginale(HTML, {
    zones,
    campi,
    accessori: caso.accessori,
    extra: caso.vociExtra,
  });

  /* ---- motore nuovo: riceve direttamente le linee ---- */
  const tuttiAcc = [...s.accessori, ...UNIVERSAL];
  const nuovo = calcolaImpianto({
    brand,
    ...codici(brand, idx),
    linee,
    usaTappo: true,
    mTronco: caso.mTronco,
    riserM: caso.riserM,
    scontoAcq: caso.scontoAcq,
    margine: caso.extra,
    manoMode: caso.manoMode,
    manoMac: caso.manoMac ?? 200,
    manoRate: caso.manoRate,
    accessori: (caso.accessori || []).map((a) => ({ code: tuttiAcc[a.i].code, q: a.q })),
    extra: (caso.vociExtra || []).map((e) => ({
      desc: e.desc,
      q: e.q,
      costo: e.c,
      prezzo: e.p,
    })),
  });

  /* ---- confronto ---- */
  const confronti = [
    ['Ugelli totali', old.N, nuovo.N],
    ['Metri totali', old.metriTot, nuovo.metriTot],
    ['Tubo linea (m)', old.mLine, nuovo.tubo.linea],
    ['Tubo tronco (m)', old.mTr, nuovo.tubo.tronco],
    ['Raccordi T', old.Tn, nuovo.pezzi.T],
    ['Portaugelli dritti', old.drittoN, nuovo.pezzi.dritti],
    ['Portaugelli 90°', old.noveN, nuovo.pezzi.novanta],
    ['Tappi', old.nTappo, nuovo.pezzi.tappi],
    ['Costo totale', r2(old.costoTot), r2(nuovo.costi.totale)],
    ['Vendita materiali', r2(old.venditaMat), r2(nuovo.prezzi.venditaMateriale)],
    ['Manodopera', r2(old.mano), r2(nuovo.prezzi.manodopera)],
    ['Prezzo totale', r2(old.prezzoTot), r2(nuovo.prezzi.totale)],
    ['Margine €', r2(old.margine), r2(nuovo.margine)],
    ['Margine %', r2(old.margPct), r2(nuovo.marginePct)],
  ];

  const ko = confronti.filter(([, a, b]) => Math.abs((a || 0) - (b || 0)) > 0.005);
  falliti += ko.length;

  console.log(`\n${ko.length === 0 ? '✅' : '❌'} ${caso.nome}`);
  const righe = ko.length ? ko : confronti;
  righe.forEach(([et, a, b]) => {
    const ok = Math.abs((a || 0) - (b || 0)) <= 0.005;
    console.log(`   ${ok ? ' ' : '✗'} ${et.padEnd(20)} orig ${eur(a)}   nuovo ${eur(b)}`);
  });
}

console.log(
  `\n${'─'.repeat(60)}\n${falliti === 0 ? '✅ TUTTI I CASI COINCIDONO' : `❌ ${falliti} differenze`}\n`
);
process.exit(falliti === 0 ? 0 : 1);
