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

import { C, UNIVERSAL, DEFAULTS, ALIQUOTA_IVA, consumabiliPerBrand } from './catalogo.js';

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
  { id: 'tubiLinea', label: 'Tubo Ø minore', um: 'm', fonte: 'tubo' },
  { id: 'tubiTronco', label: 'Tubo Ø maggiore', um: 'm', fonte: 'tubo' },
  { id: 'ugelli', label: 'Ugelli', um: 'pz', fonte: 'ugello' },
  { id: 'portaDritti', label: 'Portaugelli dritti', um: 'pz', fonte: 'porta:d' },
  { id: 'porta90', label: 'Portaugelli angolati', um: 'pz', fonte: 'porta:a' },
  { id: 'inLinea', label: 'Raccordi in linea', um: 'pz', fonte: 'inline' },
  { id: 'raccordiT', label: 'Raccordi a T', um: 'pz', fonte: 'tsel' },
  { id: 'riduzioni', label: 'Riduzioni 3/8-1/4', um: 'pz', fonte: 'riduzioni' },
  { id: 'tappi', label: 'Tappi fine linea', um: 'pz', fonte: 'tappo' },
  { id: 'accessori', label: 'Accessori', um: 'pz', fonte: 'accessori' },
];

/**
 * Il kit di prodotti di partenza — insetticida e repellente del brand.
 *
 * NON sta dentro CATEGORIE di proposito. Le categorie sono materiale
 * d'impianto: hanno una quantita' suggerita dalla geometria, finiscono
 * nella nota di carico del tecnico e concorrono al totale impianto. I
 * consumabili non hanno niente di tutto questo — la quantita' la decide
 * il commerciale, e nel preventivo compaiono su una riga loro, cosi'
 * togliere il kit non muove il prezzo dell'impianto.
 *
 * Tenendoli fuori dal ciclo delle categorie, inoltre, un progetto senza
 * kit da esattamente gli stessi numeri di prima.
 */
export const CATEGORIA_CONSUMABILI = { id: 'consumabili', label: 'Kit prodotti', um: 'pz' };

/**
 * Etichetta della categoria da mostrare, dato il brand.
 * I tubi si chiamano col loro diametro — Ø6 e Ø8 per Geyser, 1/4" e 3/8"
 * per gli altri — perche' e' cosi' che li chiamano in magazzino e in
 * cantiere: dire il ruolo senza dire il pezzo costringeva a tradurre.
 */
export function etichettaCategoria(brandId, categoriaId) {
  const cat = CATEGORIE.find((c) => c.id === categoriaId);
  if (!cat) return '';
  const pollici = brandId !== 'geyser';

  if (categoriaId === 'tubiLinea') return pollici ? 'Tubo 1/4"' : 'Tubo Ø6';
  if (categoriaId === 'tubiTronco') return pollici ? 'Tubo 3/8"' : 'Tubo Ø8';
  return cat.label;
}

/** Articoli disponibili per una categoria, dato il brand. */
export function articoliCategoria(brandId, categoriaId) {
  const brand = C.brands[brandId];
  if (!brand) return [];
  const s = C.sys[brand.sys];
  if (categoriaId === CATEGORIA_CONSUMABILI.id) return consumabiliPerBrand(brandId);
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
 * Per il tubo di diametro maggiore non va bene il primo dell'elenco —
 * sarebbe il Ø6 — ma il primo grosso: Ø8 per Geyser, 3/8" per Zanzero e
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

  // Risalita: il tubo che alza l'ugello da terra, su paletto o tubolare
  const risalitaM = Math.max(0, nz(input?.risalitaM ?? input?.riserM, DEFAULTS.risalitaM));
  const risalitaMetri = (q.m3d + q.m3a) * risalitaM;

  /* Derivazione dal tronco: per ogni ugello un T, un raccordo di riduzione
     dove il T non riduce da solo, e uno spezzone di tubo che in cantiere si
     ricava dagli sfridi — pochi centimetri, non si conteggia. */
  const nDeriv = q.m4d + q.m4a;
  const servonoRiduzioni = (C.sys[C.brands[input?.brand]?.sys]?.riduzioni || []).length > 0;

  /* Una linea che corre in parte su tronco 3/8" e in parte su 1/4" ha un
     punto di passaggio fra i due diametri, e li' serve una riduzione anche
     se su quella linea non c'e' nessuna derivazione. */
  const cambiDiametro = linee.filter((l) => {
    const m = Math.max(0, nz(l.metri));
    const t = Math.min(Math.max(0, nz(l.metriTronco)), m);
    return t > 0 && t < m;
  }).length;

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
    tubiLinea: Math.max(0, metriTot - mTronco) + risalitaMetri,
    tubiTronco: mTronco,
    ugelli: q.m1d + q.m1a + q.m2q + q.m3d + q.m3a + q.m4d + q.m4a,
    portaDritti: q.m1d + q.m3d + q.m4d,
    porta90: q.m1a + q.m3a + q.m4a,
    inLinea: q.m2q,
    raccordiT: q.m1d + q.m1a + q.m3d + q.m3a + nDeriv,
    riduzioni: servonoRiduzioni ? nDeriv + cambiDiametro : 0,
    /* Tappi: quando la linea torna alla centralina formando un anello il
       circuito e' gia' chiuso e non serve nulla. Una linea aperta invece ha
       due estremita' libere, quindi due tappi. L'anello e' il caso normale,
       percio' e' il valore predefinito. */
    tappi: attive.reduce((a, l) => a + (l.anello === false ? 2 : 0), 0),
    accessori: null, // nessun suggerimento: sono scelte discrezionali
    _metodi: q,
    _metriTot: metriTot,
    _risalitaMetri: risalitaMetri,
    _nDeriv: nDeriv,
    _cambiDiametro: cambiDiametro,
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
 * @param {number} [input.mTronco] metri di tubo grosso, solo per i progetti vecchi
 * @param {number} [input.risalitaM] metri di tubo di risalita per ugello
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
        desc: `${etichettaCategoria(brandId, cat.id)} — ${art.label}`,
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

  /* ── kit prodotti di consumo ──
   * Insetticida e repellente del brand, di norma inclusi come scorta di
   * partenza. Si vendono al listino: nessun ricarico sopra, a differenza
   * del materiale d'impianto, perche' il prezzo del prodotto e' pubblico
   * e il cliente lo ritrova sul sito del fabbricante. */
  const disponibiliKit = consumabiliPerBrand(brandId);
  let kitQ = 0;
  let kitC = 0;
  let kitP = 0;
  (input.consumabili || []).forEach((v) => {
    const art = findByCode(disponibiliKit, v.code);
    const n = Math.max(0, nz(v.q));
    if (!art || n <= 0) return;
    const c = uc(art);
    const p = up(art);
    kitQ += n;
    kitC += c * n;
    kitP += p * n;
    bom.push({
      categoria: CATEGORIA_CONSUMABILI.id,
      code: art.code,
      desc: `${CATEGORIA_CONSUMABILI.label} — ${art.label}`,
      q: n,
      um: CATEGORIA_CONSUMABILI.um,
      uC: c,
      uP: p,
      tC: c * n,
      tP: p * n,
    });
  });
  totali[CATEGORIA_CONSUMABILI.id] = { q: kitQ, costo: kitC, prezzo: kitP, suggerito: null };

  const materialeC = CATEGORIE.reduce((a, c) => a + totali[c.id].costo, 0);
  const materialeP = CATEGORIE.reduce((a, c) => a + totali[c.id].prezzo, 0);

  /* ── manodopera ──
   * Tariffa unica per ugello, indipendente dal tipo di fissaggio: la
   * differenza fra recinzione, siepe e paletti si compensa sul cantiere
   * e distinguerla in preventivo dava prezzi disomogenei.
   *
   * 'det'    programmazione centralina + ugelli x tariffa
   * 'perUg'  solo ugelli x tariffa (resta per i progetti gia' salvati)
   * 'manual' importo secco
   */
  const N = sugg.ugelli;
  const manoMode = input.manoMode || DEFAULTS.manoMode;
  const manoMac = Math.max(0, nz(input.manoMac, DEFAULTS.manoMac));
  const manoRate = Math.max(0, nz(input.manoRate, DEFAULTS.manoRate));

  let mano = 0;
  if (manoMode === 'det') mano = manoMac + N * manoRate;
  else if (manoMode === 'perUg') mano = N * manoRate;
  else mano = manoRate;

  /* ── totali ── */
  const ricarico = Math.max(0, nz(input.margine, DEFAULTS.margine)) / 100;
  const costoTot = materialeC + extraC + kitC;
  const venditaMat = (materialeP + extraP) * (1 + ricarico);
  /* Il ricarico NON si applica al kit: quei prodotti si rivendono al
     listino del fabbricante. */
  const venditaTot = venditaMat + kitP;
  const prezzoTot = venditaTot + mano; // imponibile: i prezzi sono IVA esclusa
  const margine = venditaTot - costoTot;
  const marginePct = venditaTot > 0 ? (margine / venditaTot) * 100 : 0;

  const aliquota = nz(input.aliquotaIva, ALIQUOTA_IVA);
  const iva = prezzoTot * (aliquota / 100);

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
        `${etichettaCategoria(brandId, cat.id)}: inseriti ${t.q} ${cat.um}, il calcolo ne suggerisce ${t.suggerito}.`
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
      risalita: sugg._risalitaMetri,
      perimetro: Math.max(0, sugg._metriTot - sugg._mTronco),
    },
    metodi: { ...sugg._metodi },

    suggeriti: sugg,
    totali,
    manodopera: {
      modo: manoMode,
      programmazione: manoMode === 'det' ? manoMac : 0,
      tariffaUgello: manoRate,
      ugelli: N,
      totale: mano,
    },

    costi: { materiale: materialeC, extra: extraC, kit: kitC, totale: costoTot },
    prezzi: {
      materiale: materialeP,
      extra: extraP,
      venditaMateriale: venditaMat,
      /* Impianto = materiale + manodopera, senza i prodotti di consumo.
         E' la cifra che il cliente confronta con gli altri preventivi. */
      impianto: venditaMat + mano,
      kitProdotti: kitP,
      manodopera: mano,
      totale: prezzoTot, // imponibile
      imponibile: prezzoTot,
      aliquotaIva: aliquota,
      iva,
      totaleIva: prezzoTot + iva,
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
