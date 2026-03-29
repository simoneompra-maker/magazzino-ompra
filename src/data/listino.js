// src/data/listino.js
// Listino prezzi OMPRA 2026 — condiviso tra PratoVivo e Sopralluogo
// prezzoA: fino a 4 conf. | prezzoB: oltre 5 conf. | prezzoC: bancale | prezzoD: extra sconto

export const LISTINO = {
  // Linea Albatros
  'Eden 7 5kg':                 { formato: '5 kg',   kg: 5,   prezzoA: 14.90,  prezzoB: 14.20,  iva: 4  },
  'Eden 8 5kg':                 { formato: '5 kg',   kg: 5,   prezzoA: 17.30,  prezzoB: 16.50,  iva: 4  },
  'Green 7 25kg':               { formato: '25 kg',  kg: 25,  prezzoA: 45.30,  prezzoB: 43.00,  prezzoC: 38.70, prezzoD: 34.90, iva: 4  },
  'Green 8 25kg':               { formato: '25 kg',  kg: 25,  prezzoA: 57.70,  prezzoB: 54.80,  prezzoC: 49.30, prezzoD: 44.40, iva: 4  },
  'Vigor Active 5kg':           { formato: '5 kg',   kg: 5,   prezzoA: 13.80,  prezzoB: 13.10,  iva: 4  },
  'Vigor Active 25kg':          { formato: '25 kg',  kg: 25,  prezzoA: 50.40,  prezzoB: 47.90,  prezzoC: 43.00, prezzoD: 38.70, iva: 4  },
  // Linea Mivena
  'AllRound 20kg':              { formato: '20 kg',  kg: 20,  prezzoA: 61.30,  prezzoB: 58.30,  prezzoC: 54.20, prezzoD: 51.50, iva: 4  },
  'Universal Top 20kg':         { formato: '20 kg',  kg: 20,  prezzoA: 59.40,  prezzoB: 56.50,  prezzoC: 52.60, prezzoD: 50.00, iva: 4  },
  'Pro Starter 20kg':           { formato: '20 kg',  kg: 20,  prezzoA: 72.20,  prezzoB: 68.60,  prezzoC: 63.80, prezzoD: 60.60, iva: 4  },
  'Pro Slow 20kg':              { formato: '20 kg',  kg: 20,  prezzoA: 71.30,  prezzoB: 67.80,  prezzoC: 63.00, prezzoD: 59.90, iva: 4  },
  // Linea Kare / liquidi
  'Humifitos 5kg':              { formato: '5 kg',   kg: 5,   prezzoA: 34.20,  prezzoB: 30.80,  iva: 4  },
  'Humifitos 25kg':             { formato: '25 kg',  kg: 25,  prezzoA: 115.00, prezzoB: 103.00, iva: 4  },
  'Root Speed 5kg':             { formato: '5 kg',   kg: 5,   prezzoA: 49.00,  prezzoB: 44.10,  iva: 4  },
  'Algapark 1kg':               { formato: '1 kg',   kg: 1,   prezzoA: 32.90,  prezzoB: 29.60,  iva: 4  },
  'Algapark 5kg':               { formato: '5 kg',   kg: 5,   prezzoA: 140.00, prezzoB: 126.00, iva: 4  },
  'Wet Turf 1lt':               { formato: '1 lt',   kg: 1,   prezzoA: 65.90,  prezzoB: 62.60,  iva: 22 },
  'Wet Turf 5lt':               { formato: '5 lt',   kg: 5,   prezzoA: 230.60, prezzoB: 219.00, iva: 22 },
  // Micorrize
  'Micosat F MO 5kg':           { formato: '5 kg',   kg: 5,   prezzoA: 140.40, iva: 4  },
  'Micosat F PG 1kg':           { formato: '1 kg',   kg: 1,   prezzoA: 31.20,  iva: 4  },
  'Micosat F Uno 200g':         { formato: '200 g',  kg: 0.2, prezzoA: 10.00,  iva: 4  },
  'Micosat Tab Plus Mini 100g': { formato: '100 g',  kg: 0.1, prezzoA: 10.00,  iva: 4  },
  'Micosat Len Mini 100g':      { formato: '100 g',  kg: 0.1, prezzoA: 10.00,  iva: 4  },
};

// Mapping nome prodotto → SKU listino (formato consigliato per la superficie)
export const PRODOTTO_CONFIG = {
  'Green 7':        { piccolo: 'Eden 7 5kg',         kgP: 5,  grande: 'Green 7 25kg',      kgG: 25, soglia: 3 },
  'Green 8':        { piccolo: 'Eden 8 5kg',         kgP: 5,  grande: 'Green 8 25kg',      kgG: 25, soglia: 3 },
  'Green 8 Prestige':{ piccolo: 'Eden 8 5kg',        kgP: 5,  grande: 'Green 8 25kg',      kgG: 25, soglia: 3 },
  'Vigor Active':   { piccolo: 'Vigor Active 5kg',   kgP: 5,  grande: 'Vigor Active 25kg', kgG: 25, soglia: 3 },
  'AllRound':       { piccolo: 'AllRound 20kg',      kgP: 20, grande: null },
  'AllRound 19-5-14':{ piccolo: 'AllRound 20kg',     kgP: 20, grande: null },
  'Universal Top':  { piccolo: 'Universal Top 20kg', kgP: 20, grande: null },
  'Pro Starter':    { piccolo: 'Pro Starter 20kg',   kgP: 20, grande: null },
  'Pro Slow':       { piccolo: 'Pro Slow 20kg',      kgP: 20, grande: null },
  'Humifitos':      { piccolo: 'Humifitos 5kg',      kgP: 5,  grande: 'Humifitos 25kg',    kgG: 25, soglia: 3 },
  'Root Speed':     { piccolo: 'Root Speed 5kg',     kgP: 5,  grande: null },
  'Algapark':       { piccolo: 'Algapark 1kg',       kgP: 1,  grande: 'Algapark 5kg',      kgG: 5  },
  'Wet Turf':       { piccolo: 'Wet Turf 1lt',       kgP: 1,  grande: 'Wet Turf 5lt',      kgG: 5  },
  'Micosat F PG':   { piccolo: 'Micosat F PG 1kg',   kgP: 1,  grande: null },
  'Micosat F MO':   { piccolo: 'Micosat F MO 5kg',   kgP: 5,  grande: null },
  'Micosat F MO/PG':{ piccolo: 'Micosat F PG 1kg',   kgP: 1,  grande: 'Micosat F MO 5kg', kgG: 5, soglia: 2 },
  'Humifitos + Micosat F': { piccolo: 'Humifitos 5kg', kgP: 5, grande: 'Humifitos 25kg', kgG: 25, soglia: 3 },
};

// Fasce cliente
export const FASCE_CLIENTE = {
  privato:      { label: 'Privato',      key: 'prezzoA' },
  giardiniere:  { label: 'Giardiniere',  key: 'prezzoB' },
  fidelizzato:  { label: 'Fidelizzato',  key: 'prezzoC' },
  speciale:     { label: 'Speciale',     key: 'prezzoD' },
};

export function getPrezzoCliente(skuEntry, tipoCliente = 'privato') {
  if (!skuEntry) return null;
  const fascia = FASCE_CLIENTE[tipoCliente];
  if (!fascia) return skuEntry.prezzoA;
  return skuEntry[fascia.key] || skuEntry.prezzoA;
}

// Dato un label da pv_interventi, trova la SKU e il prezzo
export function risolviProdotto(label, kgTotali, tipoCliente = 'privato') {
  if (!label) return null;

  // Cerca match nel PRODOTTO_CONFIG (anche parziale)
  let cfg = PRODOTTO_CONFIG[label];
  if (!cfg) {
    // Prova match parziale sul nome
    const key = Object.keys(PRODOTTO_CONFIG).find(k =>
      label.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(label.toLowerCase().split(' ')[0])
    );
    cfg = key ? PRODOTTO_CONFIG[key] : null;
  }

  if (!cfg) return null;

  // Scegli formato in base ai kg totali
  let sku, kgPerConf;
  if (cfg.grande && cfg.kgG && cfg.soglia && kgTotali >= cfg.kgG * cfg.soglia) {
    sku = cfg.grande;
    kgPerConf = cfg.kgG;
  } else {
    sku = cfg.piccolo;
    kgPerConf = cfg.kgP;
  }

  const entry = LISTINO[sku];
  if (!entry) return null;

  const nConfezioni = Math.ceil(kgTotali / kgPerConf);
  const prezzoUnit = getPrezzoCliente(entry, tipoCliente);

  return {
    sku,
    formato: entry.formato,
    kgPerConf,
    nConfezioni,
    prezzoUnit,
    prezzoTot: +(prezzoUnit * nConfezioni).toFixed(2),
    iva: entry.iva,
  };
}

// Suggerimento noleggio in base alle condizioni rilevate
export function suggerisciNoleggio(compattamento, drenaggio, stato_vegetativo) {
  const suggerimenti = [];
  if (compattamento === 'elevato' || compattamento === 'medio') {
    suggerimenti.push({ macchina: 'Carotatrice', motivo: `Compattamento ${compattamento} rilevato — arieggiatura meccanica consigliata` });
  }
  if (drenaggio === 'scarso' || drenaggio === 'ristagni') {
    suggerimenti.push({ macchina: 'Vertidrain / Scarificatrice', motivo: `Drenaggio ${drenaggio} — scarificatura profonda consigliata` });
  }
  if (stato_vegetativo === 'critico' || stato_vegetativo === 'assente') {
    suggerimenti.push({ macchina: 'Seminatrice semovente', motivo: `Stato vegetativo ${stato_vegetativo} — trasemina necessaria` });
  }
  return suggerimenti;
}
