/**
 * Motore di calcolo impianti antizanzare — funzione pura.
 *
 * Porting fedele di calc() + buildBOM() da Calcolatore_Impianto_Antizanzare.html.
 * Nessuna dipendenza dal DOM: input -> output, testabile.
 *
 * UNICA differenza funzionale rispetto all'originale: i metodi di montaggio
 * arrivano dalle singole linee invece che da 5 caselle globali. Le 5 quantita'
 * vengono sommate dalle linee prima del calcolo, quindi i numeri restano identici.
 */

import { C, UNIVERSAL, DEFAULTS } from './catalogo.js';

/* ─────────────────── util ─────────────────── */

const nz = (v, d = 0) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : d;
};

const findByCode = (arr, code) =>
  (arr || []).find((x) => x.code === code) || null;

/* ─────────────────── prezzi ─────────────────── */

/** Prezzo di vendita unitario (listino diviso confezione). */
export const unitPrice = (it) => (it ? it.priceRaw / (it.div || 1) : 0);

/**
 * Costo unitario.
 * Se esiste costRaw (Geyser) è il costo reale; altrimenti listino − sconto d'acquisto.
 * @param {number} sconto percentuale 0-100
 */
export const unitCost = (it, sconto) => {
  if (!it) return 0;
  if (it.costRaw !== null && it.costRaw !== undefined) {
    return it.costRaw / (it.div || 1);
  }
  const d = Math.max(0, Math.min(100, nz(sconto))) / 100;
  return unitPrice(it) * (1 - d);
};

/* ─────────────────── calcolo ─────────────────── */

/**
 * @typedef {Object} Linea
 * @property {string} [etichetta]
 * @property {number} metri
 * @property {number} passo
 * @property {string} metodo  m1d | m1a | m2q | m3d | m3a
 */

/**
 * @param {Object} input
 * @param {string} input.brand            geyser | pro | smart | gardheaven
 * @param {string} input.macchinaCode
 * @param {Linea[]} input.linee
 * @param {string} input.tuboCode         tubo linea
 * @param {string} [input.tuboTroncoCode] tubo tronco (default = tubo linea)
 * @param {string} input.ugelloCode
 * @param {string} [input.portaDCode]     portaugello dritto
 * @param {string} [input.porta9Code]     portaugello angolato
 * @param {string} input.tselCode         raccordo a T
 * @param {boolean} [input.usaTappo]
 * @param {number} [input.mTronco]        metri di tubo tronco
 * @param {number} [input.riserM]         metri di prolunga per ugello, metodo 3
 * @param {Array<{code:string,q:number}>} [input.accessori]
 * @param {Array<{desc:string,q:number,costo:number,prezzo:number}>} [input.extra]
 * @param {number} [input.scontoAcq]      % sconto d'acquisto
 * @param {number} [input.margine]        % ricarico sul materiale
 * @param {string} [input.manoMode]       det | perUg | manual
 * @param {number} [input.manoMac]
 * @param {number} [input.manoRate]
 */
export function calcolaImpianto(input) {
  const brandId = input.brand;
  const brand = C.brands[brandId];
  if (!brand) throw new Error(`Brand sconosciuto: ${brandId}`);

  const s = C.sys[brand.sys];
  const mac = findByCode(C.machines[brandId], input.macchinaCode);
  if (!mac) throw new Error(`Centralina sconosciuta: ${input.macchinaCode}`);

  const sconto = input.scontoAcq ?? brand.disc;
  const uc = (it) => unitCost(it, sconto);
  const up = (it) => unitPrice(it);

  /* ── linee e ugelli ─────────────────────────── */
  const linee = (input.linee || []).map((l) => ({
    etichetta: l.etichetta || '',
    metri: Math.max(0, nz(l.metri)),
    passo: Math.max(0.5, nz(l.passo, DEFAULTS.passo)),
    metodo: l.metodo || DEFAULTS.metodo,
  }));

  const perLineaN = linee.map((l) => (l.metri > 0 ? Math.ceil(l.metri / l.passo) : 0));
  const attive = linee.filter((l) => l.metri > 0);
  const nZone = attive.length;
  const metriTot = attive.reduce((a, l) => a + l.metri, 0);
  const N = perLineaN.reduce((a, b) => a + b, 0);

  /* ── ripartizione sui 5 metodi, sommata dalle linee ── */
  const q = { m1d: 0, m1a: 0, m2q: 0, m3d: 0, m3a: 0 };
  linee.forEach((l, i) => {
    if (perLineaN[i] > 0 && q[l.metodo] !== undefined) q[l.metodo] += perLineaN[i];
  });

  const inline = s.inline;
  const avvisi = [];
  if (!inline && q.m2q > 0) {
    avvisi.push(
      `${brand.label} non ha il raccordo in linea: le linee con Metodo 2 non producono ugelli montati.`
    );
    q.m2q = 0; // stesso comportamento del calcolatore originale
  }

  const riserM = Math.max(0, nz(input.riserM, DEFAULTS.riserM));
  const riserMeters = (q.m3d + q.m3a) * riserM;

  const drittoN = q.m1d + q.m3d;
  const noveN = q.m1a + q.m3a;
  const inlineN = q.m2q;
  const Tn = q.m1d + q.m1a + q.m3d + q.m3a; // metodi 1 e 3 usano il T
  const ugN = q.m1d + q.m1a + q.m2q + q.m3d + q.m3a;

  /* ── materiali selezionati ──────────────────── */
  const tubo = findByCode(s.tubo, input.tuboCode) || s.tubo[0];
  const tuboTr = findByCode(s.tubo, input.tuboTroncoCode) || tubo;
  const ug = findByCode(s.ugello, input.ugelloCode) || s.ugello[0];
  const paD = findByCode(s.porta, input.portaDCode);
  const pa9 = findByCode(s.porta, input.porta9Code);
  const t = findByCode(s.tsel, input.tselCode) || s.tsel[0];
  const usaTappo = input.usaTappo ?? DEFAULTS.usaTappo;
  const tappo = usaTappo ? s.tappo : null;

  /* ── tubo: tronco (Ø8) + linea (Ø6 + riser) ─── */
  let mTr = Math.max(0, nz(input.mTronco, DEFAULTS.mTronco));
  if (mTr > metriTot) mTr = metriTot;
  const mPerim = Math.max(0, metriTot - mTr);
  const mLine = mPerim + riserMeters;

  const tuboC = mLine * uc(tubo) + mTr * uc(tuboTr);
  const tuboP = mLine * up(tubo) + mTr * up(tuboTr);

  /* ── materiale ──────────────────────────────── */
  const nTappo = tappo ? nZone : 0;
  const portaC = drittoN * uc(paD) + noveN * uc(pa9) + inlineN * uc(inline);
  const portaP = drittoN * up(paD) + noveN * up(pa9) + inlineN * up(inline);

  const matC = tuboC + Tn * uc(t) + ugN * uc(ug) + portaC + nTappo * uc(tappo);
  const matP = tuboP + Tn * up(t) + ugN * up(ug) + portaP + nTappo * up(tappo);

  /* ── accessori ──────────────────────────────── */
  const tuttiAcc = [...(s.accessori || []), ...UNIVERSAL];
  let accC = 0;
  let accP = 0;
  const accBOM = [];
  (input.accessori || []).forEach(({ code, q: qty }) => {
    const a = findByCode(tuttiAcc, code);
    const n = Math.max(0, parseInt(qty, 10) || 0);
    if (!a || n <= 0) return;
    accC += uc(a) * n;
    accP += up(a) * n;
    accBOM.push({ code: a.code, label: a.label, q: n, um: 'pz', uC: uc(a), uP: up(a) });
  });

  /* ── voci extra fuori listino ───────────────── */
  let extraC = 0;
  let extraP = 0;
  const exBOM = [];
  (input.extra || []).forEach((e) => {
    const n = Math.max(0, parseInt(e.q, 10) || 0);
    const c = Math.max(0, nz(e.costo));
    const p = Math.max(0, nz(e.prezzo));
    if (n > 0 && (c > 0 || p > 0)) {
      extraC += c * n;
      extraP += p * n;
      exBOM.push({
        code: e.codice || '—',
        label: (e.desc || '').trim() || 'Voce extra',
        q: n,
        um: 'pz',
        uC: c,
        uP: p,
      });
    }
  });

  /* ── manodopera ─────────────────────────────── */
  const manoMode = input.manoMode || DEFAULTS.manoMode;
  const manoMac = Math.max(0, nz(input.manoMac, DEFAULTS.manoMac));
  const manoRate = Math.max(0, nz(input.manoRate, DEFAULTS.manoRate));
  let mano = 0;
  if (manoMode === 'det') mano = manoMac + N * manoRate;
  else if (manoMode === 'perUg') mano = manoRate * N;
  else mano = manoRate; // importo manuale

  /* ── totali ─────────────────────────────────── */
  const macC = uc(mac);
  const macP = up(mac);
  const ricarico = Math.max(0, nz(input.margine, DEFAULTS.margine)) / 100;

  const costoTot = macC + matC + accC + extraC;
  const venditaMat = (macP + matP + accP + extraP) * (1 + ricarico);
  const prezzoTot = venditaMat + mano;
  const margine = venditaMat - costoTot;
  const marginePct = venditaMat > 0 ? (margine / venditaMat) * 100 : 0;

  /* ── controlli capacita' centralina ─────────── */
  const perLine = mac.perLine || 0;
  const lines = mac.lines || 1;
  const maxTot = perLine * lines;
  const overLinea = linee.some((l, i) => l.metri > 0 && perLine && perLineaN[i] > perLine);
  const overNumLinee = nZone > lines;
  const overTot = Boolean(perLine) && N > maxTot;

  if (perLine && overLinea) avvisi.push(`Una linea supera ${perLine} ugelli.`);
  if (overNumLinee)
    avvisi.push(`${nZone} linee attive ma la centralina ne gestisce ${lines}.`);
  if (overTot && !overLinea && !overNumLinee)
    avvisi.push(`${N} ugelli oltre il massimo di ${maxTot}.`);
  if (ugN !== N)
    avvisi.push(`Ugelli montati ${ugN} su ${N} previsti.`);

  /* ── distinta materiali ─────────────────────── */
  const bom = [];
  const add = (code, desc, qty, um, uCost, uPrice) => {
    if (qty > 0)
      bom.push({
        code,
        desc,
        q: qty,
        um,
        uC: uCost,
        uP: uPrice,
        tC: uCost * qty,
        tP: uPrice * qty,
      });
  };

  add(mac.code, `Centralina ${mac.label}`, 1, 'pz', macC, macP);
  if (mLine > 0) add(tubo.code, `Tubo linea — ${tubo.label}`, mLine, 'm', uc(tubo), up(tubo));
  if (mTr > 0) add(tuboTr.code, `Tubo tronco — ${tuboTr.label}`, mTr, 'm', uc(tuboTr), up(tuboTr));
  add(ug.code, `Ugello — ${ug.label}`, ugN, 'pz', uc(ug), up(ug));
  if (paD) add(paD.code, `Portaugello dritto — ${paD.label}`, drittoN, 'pz', uc(paD), up(paD));
  if (pa9) add(pa9.code, `Portaugello 90° — ${pa9.label}`, noveN, 'pz', uc(pa9), up(pa9));
  if (inline)
    add(inline.code, `Raccordo in linea — ${inline.label}`, inlineN, 'pz', uc(inline), up(inline));
  add(t.code, `Raccordo a T — ${t.label}`, Tn, 'pz', uc(t), up(t));
  if (tappo) add(tappo.code, `Tappo fine linea — ${tappo.label}`, nTappo, 'pz', uc(tappo), up(tappo));
  accBOM.forEach((a) => add(a.code, a.label, a.q, a.um, a.uC, a.uP));
  exBOM.forEach((a) => add(a.code, a.label, a.q, a.um, a.uC, a.uP));

  /* ── risultato ──────────────────────────────── */
  return {
    brand: brand.label,
    brandId,
    macchina: { code: mac.code, label: mac.label, perLine, lines, maxTot },

    linee: linee.map((l, i) => ({ ...l, ugelli: perLineaN[i] })),
    nZone,
    metriTot,
    N,
    ugelliMontati: ugN,

    tubo: { linea: mLine, tronco: mTr, perimetro: mPerim, riser: riserMeters },
    pezzi: { dritti: drittoN, novanta: noveN, inLinea: inlineN, T: Tn, tappi: nTappo },
    metodi: { ...q },

    costi: {
      macchina: macC,
      materiale: matC,
      accessori: accC,
      extra: extraC,
      totale: costoTot,
    },
    prezzi: {
      macchina: macP,
      materiale: matP,
      accessori: accP,
      extra: extraP,
      venditaMateriale: venditaMat,
      manodopera: mano,
      totale: prezzoTot,
    },
    margine,
    marginePct,
    scontoApplicato: sconto,
    ricaricoPct: ricarico * 100,

    bom,
    avvisi,
    capacita: { overLinea, overNumLinee, overTot },
  };
}

export default calcolaImpianto;
