/**
 * Confronto motore originale vs calcolo.js.
 * Uso:  node src/modules/antizanzare/__verifica__/confronto.mjs
 *
 * L'oracolo esegue il calc() vero preso dal Calcolatore_Impianto_Antizanzare.html
 * dentro un DOM finto. Non e' una riscrittura: e' il codice in uso.
 *
 * I casi sono definiti per LINEE, ognuna con la sua ripartizione per metodo.
 * Da li' ricavo sia le zone e le 5 quantita' globali che servono all'originale,
 * sia le voci con quantita' suggerite che servono al motore nuovo.
 *
 * DIVERGENZE VOLUTE, entrambe sui tappi fine linea:
 *
 * 1. QUANTITA'. L'originale ne metteva sempre uno per zona; nella pratica il
 *    circuito si chiude ad anello e non ne serve nessuno, e quando resta
 *    aperto ne servono due. Qui forzo la quantita' dell'originale.
 *
 * 2. ARTICOLO, solo Geyser. L'originale usava l'art. 4207, che nel listino
 *    Stocker e' "Raccordo dritto Ø6" — un manicotto — con il prezzo gia'
 *    diviso per 5. Il tappo vero e' il 4215. Per questo dal confronto sui
 *    totali sottraggo il contributo dei tappi da entrambe le parti: cosi'
 *    resta verificato tutto il resto senza chiudere un occhio sull'importo.
 *
 * La regola nuova sui tappi e' verificata in derivazione.mjs.
 */

import { eseguiOriginale } from './oracolo.mjs';
import { calcolaImpianto, suggerimenti } from '../calcolo.js';
import { C } from '../catalogo.js';

const HTML =
  process.env.AZ_HTML ||
  '/sessions/youthful-peaceful-faraday/mnt/ANTIZANZARE/Calcolatore_Impianto_Antizanzare.html';

const fmt = (n) => (n || 0).toFixed(2).padStart(11);

/**
 * I due motori sommano gli stessi addendi in ordine diverso, quindi possono
 * discostarsi di ~1e-12. Confronto i valori GREZZI con tolleranza relativa:
 * arrotondare prima del confronto farebbe scattare falsi allarmi da 1 centesimo
 * sui valori che cadono esatti sul mezzo centesimo (es. 6496,175).
 */
const TOLLERANZA = 1e-6;
const uguali = (a, b) => Math.abs((a || 0) - (b || 0)) <= TOLLERANZA * Math.max(1, Math.abs(a || 0));

function scenario(nome, brand, linee, idx, opz = {}) {
  return { nome, brand, linee, idx, ...opz };
}

const CASI = [
  scenario(
    'Di Lenardo — Gardheaven Comfort02, 250+230 m',
    'gardheaven',
    [
      { etichetta: 'Insetticida', metri: 250, passo: 4, metodi: { m1d: 63 } },
      { etichetta: 'Repellente', metri: 230, passo: 4, metodi: { m1d: 58 } },
    ],
    { macchina: 1, tubo: 0, tuboTronco: 2, ugello: 0, portaD: 0, porta9: 1, tsel: 0 },
    { scontoAcq: 50, margine: 0, mTronco: 15, riserM: 2, manoMode: 'det', manoMac: 200, manoRate: 9 }
  ),

  scenario(
    'Geyser Pro Dual — 3 linee 120/90/60 m, passi 4/3/5',
    'geyser',
    [
      { metri: 120, passo: 4, metodi: { m1d: 30 } },
      { metri: 90, passo: 3, metodi: { m1d: 30 } },
      { metri: 60, passo: 5, metodi: { m1d: 12 } },
    ],
    { macchina: 1, tubo: 0, tuboTronco: 3, ugello: 1, portaD: 0, porta9: 1, tsel: 1 },
    { scontoAcq: 0, margine: 10, mTronco: 25, riserM: 2, manoMode: 'perUg', manoRate: 12 }
  ),

  // Metodi MISTI SULLA STESSA LINEA — la novita' rispetto al calcolatore
  scenario(
    'Zanzero PRO ZA200 Dual — metodi misti dentro la stessa linea',
    'pro',
    [
      // 140 m / 3.5 = 40 ugelli: 25 su T+dritto, 10 su riser, 5 in linea
      { etichetta: 'Recinzione', metri: 140, passo: 3.5, metodi: { m1d: 25, m3d: 10, m2q: 5 } },
      // 105 m / 3.5 = 30 ugelli: 20 a 90 gradi, 10 su riser a 90
      { etichetta: 'Siepe', metri: 105, passo: 3.5, metodi: { m1a: 20, m3a: 10 } },
    ],
    { macchina: 10, tubo: 0, tuboTronco: 0, ugello: 1, portaD: 0, porta9: 2, tsel: 0 },
    { scontoAcq: 30, margine: 15, mTronco: 0, riserM: 1.5, manoMode: 'det', manoMac: 250, manoRate: 8 }
  ),

  scenario(
    'Gardheaven Comfort01 — 90° e riser su paletti',
    'gardheaven',
    [
      { etichetta: 'Siepe', metri: 100, passo: 4, metodi: { m1a: 25 } },
      { etichetta: 'Paletti', metri: 60, passo: 3, metodi: { m3a: 20 } },
    ],
    { macchina: 0, tubo: 1, tuboTronco: 2, ugello: 5, portaD: 0, porta9: 1, tsel: 1 },
    { scontoAcq: 50, margine: 25, mTronco: 20, riserM: 1.5, manoMode: 'det', manoMac: 200, manoRate: 12 }
  ),

  scenario(
    'Zanzero SMART ZA18 — con accessori e voci extra',
    'smart',
    [{ metri: 60, passo: 3, metodi: { m1d: 20 } }],
    { macchina: 1, tubo: 0, tuboTronco: 0, ugello: 0, portaD: 0, porta9: 1, tsel: 0 },
    {
      scontoAcq: 30,
      margine: 20,
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

  /* ---- input per l'originale: zone + 5 quantita' globali ---- */
  const zones = linee.map((l) => ({ m: l.metri, passo: l.passo }));
  const metodi = { m1d: 0, m1a: 0, m2q: 0, m3d: 0, m3a: 0 };
  linee.forEach((l) =>
    Object.entries(l.metodi).forEach(([k, v]) => {
      metodi[k] += v;
    })
  );

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
    extra: caso.margine,
    manoMode: caso.manoMode,
    manoMac: caso.manoMac ?? 200,
    manoRate: caso.manoRate,
    ...metodi,
  };

  const old = eseguiOriginale(HTML, {
    zones,
    campi,
    accessori: caso.accessori,
    extra: caso.vociExtra,
  });

  /* ---- input per il motore nuovo: voci con quantita' suggerite ---- */
  const base = { linee, mTronco: caso.mTronco, riserM: caso.riserM };
  const sugg = suggerimenti(base);
  const tuttiAcc = [...s.accessori, ...(await import('../catalogo.js')).UNIVERSAL];

  const voci = {
    macchine: [{ code: C.machines[brand][idx.macchina].code, q: 1 }],
    tubiLinea: [{ code: s.tubo[idx.tubo].code, q: sugg.tubiLinea }],
    tubiTronco: [{ code: s.tubo[idx.tuboTronco].code, q: sugg.tubiTronco }],
    ugelli: [{ code: s.ugello[idx.ugello].code, q: sugg.ugelli }],
    // idx.portaD e idx.porta9 sono indici assoluti in s.porta, come nell'originale
    portaDritti: [{ code: s.porta[idx.portaD]?.code, q: sugg.portaDritti }],
    porta90: [{ code: s.porta[idx.porta9]?.code, q: sugg.porta90 }],
    inLinea: s.inline ? [{ code: s.inline.code, q: sugg.inLinea }] : [],
    raccordiT: [{ code: s.tsel[idx.tsel].code, q: sugg.raccordiT }],
    // forzato al valore dell'originale: vedi nota in testa al file
    tappi: s.tappo ? [{ code: s.tappo.code, q: old.nTappo }] : [],
    accessori: (caso.accessori || []).map((a) => ({ code: tuttiAcc[a.i].code, q: a.q })),
  };

  const nuovo = calcolaImpianto({
    ...base,
    brand,
    voci,
    extra: (caso.vociExtra || []).map((e) => ({ desc: e.desc, q: e.q, costo: e.c, prezzo: e.p })),
    scontoAcq: caso.scontoAcq,
    margine: caso.margine,
    manoMode: caso.manoMode,
    manoMac: caso.manoMac ?? 200,
    manoRate: caso.manoRate,
  });

  /* ---- confronto ----
     I tappi escono dai totali su entrambi i lati: articolo diverso di
     proposito, vedi nota in testa al file. */
  const scontoCaso = caso.scontoAcq;
  const ucTappo = (it) =>
    it.costRaw != null ? it.costRaw / (it.div || 1) : (it.priceRaw / (it.div || 1)) * (1 - scontoCaso / 100);
  const upTappo = (it) => it.priceRaw / (it.div || 1);

  const tappiOldC = old.tappo ? old.nTappo * ucTappo(old.tappo) : 0;
  const tappiOldP = old.tappo ? old.nTappo * upTappo(old.tappo) : 0;
  const tappiNewC = nuovo.totali.tappi.costo;
  const tappiNewP = nuovo.totali.tappi.prezzo;
  const ric = 1 + caso.margine / 100;

  const oldCosto = old.costoTot - tappiOldC;
  const newCosto = nuovo.costi.totale - tappiNewC;
  const oldVendita = old.venditaMat - tappiOldP * ric;
  const newVendita = nuovo.prezzi.venditaMateriale - tappiNewP * ric;

  const confronti = [
    ['Ugelli montati', old.ugN, nuovo.ugelliMontati],
    ['Metri totali', old.metriTot, nuovo.metriTot],
    ['Tubo linea (m)', old.mLine, nuovo.tubo.linea],
    ['Tubo tronco (m)', old.mTr, nuovo.tubo.tronco],
    ['Raccordi T', old.Tn, nuovo.totali.raccordiT.q],
    ['Portaugelli dritti', old.drittoN, nuovo.totali.portaDritti.q],
    ['Portaugelli 90°', old.noveN, nuovo.totali.porta90.q],
    ['Raccordi in linea', old.inlineN, nuovo.totali.inLinea.q],
    ['Tappi', old.nTappo, nuovo.totali.tappi.q],
    ['Costo senza tappi', oldCosto, newCosto],
    ['Vendita senza tappi', oldVendita, newVendita],
    ['Manodopera', old.mano, nuovo.prezzi.manodopera],
    ['Prezzo senza tappi', oldVendita + old.mano, newVendita + nuovo.prezzi.manodopera],
    ['Margine € senza tappi', oldVendita - oldCosto, newVendita - newCosto],
  ];

  const ko = confronti.filter(([, a, b]) => !uguali(a, b));
  falliti += ko.length;

  console.log(`\n${ko.length === 0 ? '✅' : '❌'} ${caso.nome}`);
  (ko.length ? ko : confronti).forEach(([et, a, b]) => {
    console.log(`   ${uguali(a, b) ? ' ' : '✗'} ${et.padEnd(20)} orig ${fmt(a)}   nuovo ${fmt(b)}`);
  });
}

console.log(
  `\n${'─'.repeat(62)}\n${falliti === 0 ? '✅ TUTTI I CASI COINCIDONO' : `❌ ${falliti} differenze`}\n`
);
process.exit(falliti === 0 ? 0 : 1);
