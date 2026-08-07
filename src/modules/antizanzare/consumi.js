/**
 * Calcolo dei consumi e dei costi di gestione — funzione pura.
 *
 * Risponde alla domanda che il cliente fa sempre dopo il preventivo:
 * "e poi quanto mi costa tenerlo acceso?".
 *
 * IL CONTO, riga per riga, per ogni prodotto:
 *
 *   miscela al giorno    = ugelli x portata(l/min) x minuti al giorno
 *   concentrato al giorno = miscela x percentuale / 100
 *   concentrato stagione  = concentrato al giorno x giorni d'uso
 *   confezioni            = concentrato stagione / litri per confezione,
 *                           arrotondato PER ECCESSO
 *   costo                 = confezioni x prezzo di listino
 *
 * PERCHE' I MINUTI SONO PER PRODOTTO E NON GLOBALI.
 * Insetticida e repellente non girano insieme: la guida Stocker prevede
 * per esempio Etokraft una volta al giorno per i primi dieci giorni e poi
 * Florifens due volte al giorno. Con un unico campo "minuti totali" il
 * conto sarebbe sbagliato su tutti e due. Per lo stesso motivo ogni
 * prodotto ha i suoi giorni d'uso e il suo numero di ugelli: sulle
 * centraline a due linee ogni prodotto serve la sua linea.
 *
 * IL COSTO E' SULLE CONFEZIONI INTERE, non sui litri consumati: il cliente
 * compra taniche, non decilitri. Il residuo di fine stagione lo riporto a
 * parte, perche' e' prodotto pagato che avanza e la stagione dopo si usa.
 */

import {
  GIORNI_STAGIONE, portataUgello, PRESSIONE_BAR, CICLO_PREDEFINITO, PASSO_PREDEFINITO,
  GIORNI_PER_MESE, C, consumabiliPerBrand,
} from './catalogo.js';

const nz = (v, d = 0) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : d;
};

const positivo = (v, d = 0) => Math.max(0, nz(v, d));

/**
 * Arrotondamento stabile, stesso criterio del motore di calcolo:
 * toPrecision(12) ricompatta l'errore in virgola mobile prima del round,
 * altrimenti i valori esattamente a meta' cadono dalla parte sbagliata.
 */
export const arrotonda = (n, decimali = 2) => {
  const f = 10 ** decimali;
  const v = (n || 0) * f;
  return Math.round(Number(v.toPrecision(12))) / f;
};

/**
 * Riga di prodotto vuota, da usare come punto di partenza in interfaccia.
 * @param {Object} [patch] campi da sovrascrivere
 */
export function rigaProdotto(patch = {}) {
  return {
    code: null,
    label: '',
    tipo: 'insetticida',
    litriConf: 1, // litri per confezione
    prezzoConf: 0, // prezzo di listino della confezione, IVA esclusa
    ugelli: 0,
    portataLmin: 0,
    minutiGiorno: 0,
    percentuale: 0, // % di prodotto nella miscela
    giorni: GIORNI_STAGIONE,
    ...patch,
  };
}

/**
 * Consumo e costo di UNA riga di prodotto.
 * @returns {Object} valori pieni, non arrotondati: arrotonda chi visualizza
 */
export function consumoProdotto(riga) {
  const ugelli = positivo(riga?.ugelli);
  const portata = positivo(riga?.portataLmin);
  const minuti = positivo(riga?.minutiGiorno);
  const pct = Math.min(100, positivo(riga?.percentuale));
  const giorni = positivo(riga?.giorni, GIORNI_STAGIONE);
  const litriConf = positivo(riga?.litriConf);
  const prezzoConf = positivo(riga?.prezzoConf);

  const miscelaGiorno = ugelli * portata * minuti;
  const concentratoGiorno = (miscelaGiorno * pct) / 100;
  const acquaGiorno = miscelaGiorno - concentratoGiorno;

  const miscelaStagione = miscelaGiorno * giorni;
  const concentratoStagione = concentratoGiorno * giorni;
  const acquaStagione = acquaGiorno * giorni;

  /* Confezioni intere. Il ceil su un valore in virgola mobile e' insidioso:
     3 litri esatti divisi 1 litro possono valere 3.0000000000000004 e
     diventare 4 confezioni. toPrecision(12) toglie di mezzo il problema. */
  const confezioniEsatte = litriConf > 0 ? concentratoStagione / litriConf : 0;
  const confezioni =
    confezioniEsatte > 0 ? Math.ceil(Number(confezioniEsatte.toPrecision(12))) : 0;

  const costo = confezioni * prezzoConf;
  const residuo = confezioni * litriConf - concentratoStagione;

  return {
    code: riga?.code ?? null,
    label: riga?.label ?? '',
    tipo: riga?.tipo ?? 'altro',
    attiva: miscelaGiorno > 0 && pct > 0,

    ugelli,
    portataLmin: portata,
    minutiGiorno: minuti,
    percentuale: pct,
    giorni,

    miscelaGiorno,
    concentratoGiorno,
    acquaGiorno,
    miscelaStagione,
    concentratoStagione,
    acquaStagione,

    litriConf,
    prezzoConf,
    confezioni,
    residuo,
    costo,
    /* Quanto dura una confezione. E' il numero con cui si smaschera una
       percentuale sbagliata: se il calcolo dice tre settimane e il cliente
       racconta che una tanica gli e' durata due mesi, la diluizione
       impostata non e' quella che usa davvero. Molto piu' parlante dei
       litri di stagione, che nessuno sa verificare a occhio. */
    giorniPerConfezione: concentratoGiorno > 0 ? litriConf / concentratoGiorno : 0,
    costoGiorno: giorni > 0 ? costo / giorni : 0,
    /* Costo al litro di concentrato: serve a confrontare formati diversi,
       dove la tanica da 5 L costa meno al litro del flacone da 1 L. */
    euroLitro: litriConf > 0 ? prezzoConf / litriConf : 0,
  };
}

/**
 * Consumi dell'intero impianto.
 *
 * @param {Object} input
 * @param {Array}  input.prodotti righe come da rigaProdotto()
 * @param {number} [input.prezzoAcquaMc] €/m³ dell'acqua, 0 = non conteggiata
 * @returns {Object}
 */
export function calcolaConsumi(input) {
  const righe = (input?.prodotti || []).map(consumoProdotto);
  const attive = righe.filter((r) => r.attiva);

  const somma = (campo) => attive.reduce((a, r) => a + r[campo], 0);

  const acquaStagione = somma('acquaStagione');
  /* L'acqua di rete costa poco ma su un impianto grande non e' zero.
     Di norma il campo resta a zero e la voce non compare. */
  const prezzoAcquaMc = positivo(input?.prezzoAcquaMc);
  const costoAcqua = (acquaStagione / 1000) * prezzoAcquaMc;

  const costoProdotti = somma('costo');

  return {
    righe,
    nProdotti: attive.length,

    miscelaGiorno: somma('miscelaGiorno'),
    concentratoGiorno: somma('concentratoGiorno'),
    miscelaStagione: somma('miscelaStagione'),
    concentratoStagione: somma('concentratoStagione'),
    acquaStagione,

    costoProdotti,
    costoAcqua,
    costoStagione: costoProdotti + costoAcqua,
    /* Giorni della riga piu' lunga: il costo medio giornaliero su un
       periodo piu' corto darebbe un numero piu' alto del vero. */
    giorniMax: attive.reduce((a, r) => Math.max(a, r.giorni), 0),
  };
}

/**
 * Righe precompilate a partire da un progetto.
 *
 * Prende gli ugelli e la portata dall'impianto gia' configurato, propone
 * l'insetticida e il repellente scelti nel kit prodotti e applica i cicli
 * abituali: un minuto al giorno all'1% per l'insetticida, due minuti al 5%
 * per il repellente. Restano tutti modificabili — sono l'impostazione di
 * partenza, non una regola.
 *
 * @param {Object} p
 * @param {string} p.brandId
 * @param {number} p.ugelli numero di ugelli dell'impianto
 * @param {Object} p.articoloUgello articolo di catalogo dell'ugello montato
 * @param {Array}  p.consumabili articoli del kit prodotti gia' scelti
 * @param {number} [p.bar] pressione di esercizio
 */
export function prodottiDaProgetto({ brandId, ugelli, articoloUgello, consumabili, bar }) {
  const pressione = positivo(bar, PRESSIONE_BAR[brandId] ?? 0);
  const { lMin, fonte } = portataUgello(articoloUgello, pressione);

  /* Un prodotto per tipo: se nel kit ci sono due formati dello stesso
     insetticida, il consumo si calcola una volta sola, sul formato che
     costa meno al litro — e' quello che si ricompra a stagione avviata. */
  const perTipo = new Map();
  (consumabili || []).forEach((art) => {
    if (!art || art.tipo === 'altro') return;
    const euroLitro = art.litri > 0 ? art.priceRaw / art.litri : Infinity;
    const gia = perTipo.get(art.tipo);
    if (!gia || euroLitro < gia.euroLitro) perTipo.set(art.tipo, { art, euroLitro });
  });

  return ['insetticida', 'repellente']
    .filter((t) => perTipo.has(t))
    .map((t) => {
      const { art } = perTipo.get(t);
      return rigaProdotto({
        code: art.code,
        label: art.label,
        tipo: t,
        litriConf: art.litri,
        prezzoConf: art.priceRaw,
        ugelli: positivo(ugelli),
        portataLmin: lMin,
        ...CICLO_PREDEFINITO[t],
        _fontePortata: fonte,
        _pressione: pressione,
      });
    });
}

/* ─────────────── calcolatore rapido ─────────────── */

/** Ugelli che stanno su un perimetro, uno ogni `passo` metri. */
export const ugelliDaMetri = (metri, passo = PASSO_PREDEFINITO) => {
  const m = positivo(metri);
  const p = Math.max(0.5, nz(passo, PASSO_PREDEFINITO));
  return m > 0 ? Math.ceil(m / p) : 0;
};

/** Metri di perimetro corrispondenti a un numero di ugelli. */
export const metriDaUgelli = (ugelli, passo = PASSO_PREDEFINITO) =>
  positivo(ugelli) * Math.max(0.5, nz(passo, PASSO_PREDEFINITO));

/**
 * Due righe pronte all'uso, senza bisogno di un progetto.
 *
 * E' il punto di partenza del calcolatore autonomo: scelto il brand e detto
 * quanti ugelli, il conto e' gia' fatto. Prodotti, ugello e cicli sono
 * quelli abituali; chi vuole cambiarli apre le impostazioni avanzate.
 *
 * L'ugello predefinito e' quello da 0,3 mm, la misura standard su tutti e
 * quattro i brand. Se il catalogo del brand non ce l'ha, si prende il primo.
 */
export function righeRapide({ brandId, ugelli, mesi, bar }) {
  const sys = C.sys[C.brands[brandId]?.sys];
  const listaUgelli = sys?.ugello || [];
  const ugello = listaUgelli.find((u) => u.foroMm === 0.3) || listaUgelli[0] || null;

  const pressione = positivo(bar, PRESSIONE_BAR[brandId] ?? 0);
  const { lMin, fonte } = portataUgello(ugello, pressione);
  const giorni = Math.round(positivo(mesi) * GIORNI_PER_MESE);

  /* Formato piu' conveniente al litro per ciascun tipo: e' quello che si
     ricompra a stagione avviata, e quindi quello su cui ha senso stimare
     la spesa. */
  const migliore = (tipo) =>
    consumabiliPerBrand(brandId, tipo).reduce((best, a) => {
      if (!(a.litri > 0)) return best;
      const el = a.priceRaw / a.litri;
      return !best || el < best.priceRaw / best.litri ? a : best;
    }, null);

  return ['insetticida', 'repellente']
    .map((tipo) => {
      const art = migliore(tipo);
      if (!art) return null;
      return rigaProdotto({
        code: art.code,
        label: art.label,
        tipo,
        litriConf: art.litri,
        prezzoConf: art.priceRaw,
        ugelli: positivo(ugelli),
        portataLmin: lMin,
        giorni,
        ...CICLO_PREDEFINITO[tipo],
        _ugello: ugello?.code ?? null,
        _pressione: pressione,
        _fontePortata: fonte,
      });
    })
    .filter(Boolean);
}

export default calcolaConsumi;
