/**
 * Motore di calcolo impianti antizanzare — funzione pura.
 *
 * Deriva da calc() + buildBOM() di Calcolatore_Impianto_Antizanzare.html.
 * Nessuna dipendenza dal DOM: input -> output, testabile.
 *
 * DIFFERENZE rispetto al calcolatore originale, entrambe volute:
 *
 * 1. I metodi di montaggio sono per linea, non globali. Ogni linea puo'
 *    ripartire i suoi ugelli su piu' metodi. Le quantita' globali che
 *    servono al calcolo sono la somma di quelle delle linee.
 *
 * 2. Ogni categoria di materiale e' una LISTA di voci con quantita', non
 *    un articolo unico. Si possono usare due tipi di tubo o due di ugello
 *    sullo stesso impianto. Le quantita' suggerite dalla geometria sono
 *    calcolate e restituite in `suggeriti`: l'interfaccia le precompila,
 *    l'utente puo' derogare e il motore segnala lo scostamento.
 *
 * Con le quantita' suggerite i risultati coincidono al centesimo con il
 * calcolatore originale: lo verifica __verifica__/confronto.mjs.
 */

import { C, UNIVERSAL, DEFAULTS } from './catalogo.js';

/* ─────────────────── util ─────────────────── */

const nz = (v, d = 0) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : d;
};

const findByCode = (arr, code) => (arr || []).find((x) => x.code === code) || null;

/**
 * Arrotondamento stabile al centesimo, half-up.
 * Math.round(x*100)/100 sbaglia sui valori che cadono esatti sul mezzo
 * centesimo: 6496.175 in virgola mobile puo' valere 6496.17499999999 e
 * arrotondare per difetto. toPrecision(12) ricompatta l'errore prima del round.
 * Il motore lavora sui valori pieni; questa serve a visualizzare e salvare.
 */
export const arrotonda = (n, decimali = 2) => {
  const f = 10 ** decimali;
  const v = (n || 0) * f;
  return Math.round(Number(v.toPrecision(12))) / f;
};

/** Categorie di materiale, nell'ordine in cui compaiono in distinta. */
export const CATEGORIE = [
  { id: 'macchine', label: 'Centralina', um: 'pz', fonte: 'machines' },
  { id: 'tubiLinea', label: 'Tubo linea', um: 'm', fonte: 'tubo' },
  { id: 'tubiTronco', label: 'Tubo tronco', um: 'm', fonte: 'tubo' },
  { id: 'ugelli', label: 'Ugelli', um: 'pz', fonte: 'ugello' },
  { id: 'portaDritti', label: 'Portaugelli dritti', um: 'pz', fonte: 'porta:d' },
  { id: 'porta90', label: 'Portaugelli angolati', um: 'pz', fonte: 'porta:a' },
  { id: 'inLinea', label: 'Raccordi in linea', um: 'pz', fonte: 'inline' },
  { id: 'raccordiT', label: 'Raccordi a T', um: 'pz', fonte: 'tsel' },
  { id: 'riduzioni', label: 'Riduzioni 3/8-1/4', um: 'pz', fonte: 'riduzioni' },
  { id: 'tappi', label: 'Tappi fine linea', um: 'pz', fonte: 'tappo' },
  { id: 'accessori', label: 'Accessori', um: 'pz', fonte: 'accessori' },
];

/** Articoli disponibili per una categoria, dato il brand. */
export function articoliCategoria(brandId, categoriaId) {
  const brand = C.brands[brandId];
  if (!brand) return [];
  const s = C.sys[brand.sys];
  const cat = CATEGORIE.find((c) => c.id === categoriaId);
  if (!cat) return [];

  switch (cat.fonte) {
    case 'machines':
      return C.machines[brandId] || [];
    case 'tubo':
      return s.tubo || [];
    case 'ugello':
      return s.ugello || [];
    case 'porta:d':
      return (s.porta || []).filter((p) => p.kind === 'd');
    case 'porta:a':
      return (s.porta || []).filter((p) => p.kind === 'a');
    case 'inline':
      return s.inline ? [s.inline] : [];
    case 'tsel':
      return s.tsel || [];
    case 'riduzioni':
      return s.riduzioni || [];
    case 'tappo':
      // tappoExtra raccoglie i fine linea di diametro diverso (3/8")
      return [s.tappo, ...(s.tappoExtra || [])].filter(Boolean);
    case 'accessori':
      return [...(s.accessori || []), ...UNIVERSAL];
    default:
      return [];
  }
}

/**
 * Articolo con cui precompilare una categoria quando l'utente non ne ha
 * ancora scelto uno.
 *
 * Per il tubo tronco non va bene il primo dell'elenco — sarebbe il Ø6 —
 * ma il primo di diametro maggiore: Ø8 per Geyser, 3/8" per Zanzero e
 * Gardheaven. Fra due bobine dello stesso diametro vince quella da 100 m,
 * che e' il formato che usiamo.
 */
export function articoloPredefinito(brandId, categoriaId) {
  const articoli = articoliCategoria(brandId, categoriaId);
  if (articoli.length === 0) return null;

  if (categoriaId === 'tubiTronco') {
    const grossi = articoli.filter((a) => /3\/8|Ø8/i.test(a.label));
    if (grossi.length > 0) {
      return grossi.find((a) => /100\s*m/i.test(a.label)) || grossi[0];
    }
  }

  if (categoriaId === 'tubiLinea') {
    const sottili = articoli.filter((a) => !/3\/8|Ø8/i.test(a.label));
    if (sottili.length > 0) {
      return sottili.find((a) => /100\s*m/i.test(a.label)) || sottili[0];
    }
  }

  return articoli[0];
}

/* ─────────────────── prezzi ─────────────────── */

/** Prezzo di vendita unitario (listino diviso confezione). */
export const unitPrice = (it) => (it ? it.priceRaw / (it.div || 1) : 0);

/**
 * Costo unitario.
 * Se esiste costRaw (Geyser) e' il costo reale; altrimenti listino − sconto.
 * @param {number} sconto percentuale 0-100
 */
export const unitCost = (it, sconto) => {
  if (!it) return 0;
  if (it.costRaw !== null && it.costRaw !== undefined) return it.costRaw / (it.div || 1);
  const d = Math.max(0, Math.min(100, nz(sconto))) / 100;
  return unitPrice(it) * (1 - d);
};

/* ─────────────────── geometria ─────────────────── */

const METODI_ID = ['m1d', 'm1a', 'm2q', 'm3d', 'm3a', 'm4d', 'm4a'];

/** Ugelli previsti su una linea: metri / passo, arrotondato per eccesso. */
export function ugelliLinea(linea) {
  const m = Math.max(0, nz(linea?.metri));
  const p = Math.max(0.5, nz(linea?.passo, DEFAULTS.passo));
  return m > 0 ? Math.ceil(m / p) : 0;
}

/** Somma dei metodi dichiarati su una linea. */
export function montatiLinea(linea) {
  const met = linea?.metodi || {};
  return METODI_ID.reduce((a, k) => a + Math.max(0, parseInt(met[k], 10) || 0), 0);
}

/**
 * Quantita' suggerite dalla geometria. L'interfaccia le usa per precompilare
 * le caselle; restano modificabili.
 */
export function suggerimenti(input) {
  const linee = input?.linee || [];
  const attive = linee.filter((l) => nz(l.metri) > 0);
  const metriTot = attive.reduce((a, l) => a + nz(l.metri), 0);

  const q = { m1d: 0, m1a: 0, m2q: 0, m3d: 0, m3a: 0, m4d: 0, m4a: 0 };
  linee.forEach((l) => {
    const met = l.metodi || {};
    METODI_ID.forEach((k) => {
      q[k] += Math.max(0, parseInt(met[k], 10) || 0);
    });
  });

  const riserM = Math.max(0, nz(input?.riserM, DEFAULTS.riserM));
  const riserMetri = (q.m3d + q.m3a) * riserM;

  // Derivazione dal tronco: per ogni ugello un T, uno spezzone di tubo 1/4"
  // e, dove il T non riduce da solo, un raccordo di riduzione.
  const derivM = Math.max(0, nz(input?.derivM, DEFAULTS.derivM));
  const nDeriv = q.m4d + q.m4a;
  const derivMetri = nDeriv * derivM;
  const servonoRiduzioni = (C.sys[C.brands[input?.brand]?.sys]?.riduzioni || []).length > 0;

  // Il tronco e' una proprieta' della linea: quanti dei suoi metri corrono
  // in diametro maggiore. Sono COMPRESI nei metri della linea, non aggiuntivi.
  let mTronco = linee.reduce(
    (a, l) => a + Math.min(Math.max(0, nz(l.metriTronco)), Math.max(0, nz(l.metri))),
    0
  );

  // Compatibilita': i progetti salvati prima avevano un unico valore globale
  if (mTronco === 0 && nz(input?.mTronco) > 0) {
    mTronco = Math.min(Math.max(0, nz(input.mTronco)), metriTot);
  }

  return {
    macchine: attive.length > 0 || linee.length > 0 ? 1 : 0,
    tubiLinea: Math.max(0, metriTot - mTronco) + riserMetri + derivMetri,
    tubiTronco: mTronco,
    ugelli: q.m1d + q.m1a + q.m2q + q.m3d + q.m3a + q.m4d + q.m4a,
    portaDritti: q.m1d + q.m3d + q.m4d,
    porta90: q.m1a + q.m3a + q.m4a,
    inLinea: q.m2q,
    raccordiT: q.m1d + q.m1a + q.m3d + q.m3a + nDeriv,
    riduzioni: servonoRiduzioni ? nDeriv : 0,
    tappi: attive.length,
    accessori: null, // nessun suggerimento: sono scelte discrezionali
    _metodi: q,
    _metriTot: metriTot,
    _riserMetri: riserMetri,
    _derivMetri: derivMetri,
    _nDeriv: nDeriv,
    _mTronco: mTronco,
    _ugelliPrevisti: linee.reduce((a, l) => a + ugelliLinea(l), 0),
    _nLinee: attive.length,
  };
}

/* ─────────────────── calcolo ─────────────────── */

/**
 * @param {Object} input
 * @param {string} input.brand
 * @param {Array<{etichetta?:string, metri:number, passo:number, metodi:Object}>} input.linee
 * @param {Object<string, Array<{code:string,q:number}>>} input.voci per categoria
 * @param {Array} [input.extra] voci fuori listino
 * @param {number} [input.mTronco] metri di tubo tronco
 * @param {number} [input.riserM]  metri di prolunga per ugello, metodo 3
 * @param {number} [input.scontoAcq] %
 * @param {number} [input.margine]   % di ricarico sul materiale
 * @param {string} [input.manoMode]  det | perUg | manual
 */
export function calcolaImpianto(input) {
  const brandId = input.brand;
  const brand = C.brands[brandId];
  if (!brand) throw new Error(`Brand sconosciuto: ${brandId}`);

  const sconto = input.scontoAcq ?? brand.disc;
  const uc = (it) => unitCost(it, sconto);
  const up = (it) => unitPrice(it);

  const sugg = suggerimenti(input);
  const voci = input.voci || {};
  const avvisi = [];

  /* ── righe di distinta, categoria per categoria ── */
  const bom = [];
  const totali = {}; // per categoria: {q, costo, prezzo}

  CATEGORIE.forEach((cat) => {
    const disponibili = articoliCategoria(brandId, cat.id);
    let q = 0;
    let costo = 0;
    let prezzo = 0;

    (voci[cat.id] || []).forEach((v) => {
      const art = findByCode(disponibili, v.code);
      const n = Math.max(0, nz(v.q));
      if (!art || n <= 0) return;
      const c = uc(art);
      const p = up(art);
      q += n;
      costo += c * n;
      prezzo += p * n;
      bom.push({
        categoria: cat.id,
        code: art.code,
        desc: `${cat.label} — ${art.label}`,
        q: n,
        um: cat.um,
        uC: c,
        uP: p,
        tC: c * n,
        tP: p * n,
      });
    });

    totali[cat.id] = { q, costo, prezzo, suggerito: sugg[cat.id] };
  });

  /* ── voci extra fuori listino ── */
  let extraC = 0;
  let extraP = 0;
  (input.extra || []).forEach((e) => {
    const n = Math.max(0, parseInt(e.q, 10) || 0);
    const c = Math.max(0, nz(e.costo));
    const p = Math.max(0, nz(e.prezzo));
    if (n <= 0 || (c <= 0 && p <= 0)) return;
    extraC += c * n;
    extraP += p * n;
    bom.push({
      categoria: 'extra',
      code: e.codice || '—',
      desc: (e.desc || '').trim() || 'Voce extra',
      q: n,
      um: 'pz',
      uC: c,
      uP: p,
      tC: c * n,
      tP: p * n,
    });
  });

  const materialeC = CATEGORIE.reduce((a, c) => a + totali[c.id].costo, 0);
  const materialeP = CATEGORIE.reduce((a, c) => a + totali[c.id].prezzo, 0);

  /* ── manodopera ──
   * 'det'    montaggio macchina + righe di fissaggio, ognuna con la sua
   *          quantita' di ugelli e la sua tariffa (recinzione, siepe, paletti…).
   *          Se non ci sono righe si ricade su tutti gli ugelli alla tariffa base,
   *          che e' il comportamento del calcolatore originale.
   * 'perUg'  tariffa unica per ugello
   * 'manual' importo secco
   */
  const N = sugg.ugelli;
  const manoMode = input.manoMode || DEFAULTS.manoMode;
  const manoMac = Math.max(0, nz(input.manoMac, DEFAULTS.manoMac));
  const manoRate = Math.max(0, nz(input.manoRate, DEFAULTS.manoRate));

  const fissaggi = (input.fissaggi || [])
    .map((f) => ({
      id: f.id,
      label: f.label,
      q: Math.max(0, parseInt(f.q, 10) || 0),
      eur: Math.max(0, nz(f.eur)),
    }))
    .filter((f) => f.q > 0);

  const ugelliFissati = fissaggi.reduce((a, f) => a + f.q, 0);
  const costoFissaggi = fissaggi.reduce((a, f) => a + f.q * f.eur, 0);

  let mano = 0;
  if (manoMode === 'det') {
    mano = manoMac + (fissaggi.length > 0 ? costoFissaggi : N * manoRate);
  } else if (manoMode === 'perUg') {
    mano = manoRate * N;
  } else {
    mano = manoRate;
  }

  if (manoMode === 'det' && fissaggi.length > 0 && ugelliFissati !== N) {
    avvisi.push(`Fissaggio: ${ugelliFissati} ugelli ripartiti, ${N} montati.`);
  }

  /* ── totali ── */
  const ricarico = Math.max(0, nz(input.margine, DEFAULTS.margine)) / 100;
  const costoTot = materialeC + extraC;
  const venditaMat = (materialeP + extraP) * (1 + ricarico);
  const prezzoTot = venditaMat + mano;
  const margine = venditaMat - costoTot;
  const marginePct = venditaMat > 0 ? (margine / venditaMat) * 100 : 0;

  /* ── controlli ── */
  const linee = input.linee || [];

  linee.forEach((l, i) => {
    const prev = ugelliLinea(l);
    const mont = montatiLinea(l);
    if (prev !== mont) {
      const nome = l.etichetta?.trim() || `Linea ${i + 1}`;
      avvisi.push(`${nome}: ${mont} ugelli ripartiti sui metodi, ${prev} previsti dai metri.`);
    }
  });

  if (!C.sys[brand.sys].inline && sugg._metodi.m2q > 0) {
    avvisi.push(`${brand.label} non ha il raccordo in linea: il Metodo 2 non è utilizzabile.`);
  }

  CATEGORIE.forEach((cat) => {
    const t = totali[cat.id];
    if (t.suggerito == null) return;
    const scarto = Math.abs(t.q - t.suggerito);
    if (scarto > 0.005) {
      avvisi.push(
        `${cat.label}: inseriti ${t.q} ${cat.um}, il calcolo ne suggerisce ${t.suggerito}.`
      );
    }
  });

  /* ── capacita' della centralina ── */
  const macSelezionate = (voci.macchine || [])
    .map((v) => findByCode(C.machines[brandId], v.code))
    .filter(Boolean);
  const mac = macSelezionate[0] || null;
  const perLine = mac?.perLine || 0;
  const lines = macSelezionate.reduce((a, m) => a + (m.lines || 1), 0) || 0;
  const maxTot = perLine * lines;

  const overLinea = linee.some((l) => perLine && ugelliLinea(l) > perLine);
  const overNumLinee = lines > 0 && sugg._nLinee > lines;
  const overTot = Boolean(maxTot) && sugg._ugelliPrevisti > maxTot;

  if (perLine && overLinea) avvisi.push(`Una linea supera ${perLine} ugelli.`);
  if (overNumLinee)
    avvisi.push(`${sugg._nLinee} linee attive ma le centraline ne gestiscono ${lines}.`);
  if (overTot && !overLinea && !overNumLinee)
    avvisi.push(`${sugg._ugelliPrevisti} ugelli oltre il massimo di ${maxTot}.`);

  return {
    brand: brand.label,
    brandId,
    macchina: mac
      ? { code: mac.code, label: mac.label, perLine, lines, maxTot }
      : { code: null, label: '—', perLine: 0, lines: 0, maxTot: 0 },

    linee: linee.map((l, i) => ({
      ...l,
      ugelliPrevisti: ugelliLinea(l),
      ugelliMontati: montatiLinea(l),
      _i: i,
    })),
    nLinee: sugg._nLinee,
    metriTot: sugg._metriTot,
    N: sugg._ugelliPrevisti,
    ugelliMontati: sugg.ugelli,

    tubo: {
      linea: totali.tubiLinea.q,
      tronco: totali.tubiTronco.q,
      riser: sugg._riserMetri,
      derivazioni: sugg._derivMetri,
      perimetro: Math.max(0, sugg._metriTot - sugg._mTronco),
    },
    metodi: { ...sugg._metodi },

    suggeriti: sugg,
    totali,
    manodopera: {
      modo: manoMode,
      macchina: manoMode === 'det' ? manoMac : 0,
      fissaggi,
      ugelliFissati,
      costoFissaggi,
      totale: mano,
    },

    costi: { materiale: materialeC, extra: extraC, totale: costoTot },
    prezzi: {
      materiale: materialeP,
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
