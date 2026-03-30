// src/hooks/useAgroListino.js
// Hook condiviso PratoVivo + Sopralluogo
// Carica agro_listino + agro_mapping da Supabase una volta per sessione
// Espone la stessa interfaccia di listino.js (retrocompatibile)

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../store';

// ── Cache in memoria per sessione ────────────────────────────
let _cache = null;
let _loading = false;
let _listeners = [];

async function _loadData() {
  if (_cache) return _cache;
  if (_loading) {
    return new Promise(resolve => _listeners.push(resolve));
  }
  _loading = true;
  try {
    const [{ data: listino, error: e1 }, { data: mapping, error: e2 }] = await Promise.all([
      supabase.from('agro_listino').select('*'),
      supabase.from('agro_mapping').select('*'),
    ]);
    if (e1) throw e1;
    if (e2) throw e2;

    // Trasforma in oggetti indicizzati (identici a LISTINO e PRODOTTO_CONFIG)
    const LISTINO = {};
    (listino || []).forEach(r => {
      LISTINO[r.sku] = {
        formato:    r.formato,
        kg:         parseFloat(r.kg_per_conf),
        prezzoA:    parseFloat(r.prezzo_a),
        prezzoB:    r.prezzo_b != null ? parseFloat(r.prezzo_b) : undefined,
        prezzoC:    r.prezzo_c != null ? parseFloat(r.prezzo_c) : undefined,
        prezzoD:    r.prezzo_d != null ? parseFloat(r.prezzo_d) : undefined,
        iva:        r.iva_pct,
      };
    });

    const PRODOTTO_CONFIG = {};
    (mapping || []).forEach(r => {
      PRODOTTO_CONFIG[r.label_intervento] = {
        piccolo: r.sku_piccolo,
        kgP:     parseFloat(r.kg_piccolo),
        grande:  r.sku_grande || null,
        kgG:     r.kg_grande != null ? parseFloat(r.kg_grande) : undefined,
        soglia:  r.soglia || undefined,
      };
    });

    _cache = { LISTINO, PRODOTTO_CONFIG };
    _listeners.forEach(fn => fn(_cache));
    _listeners = [];
    return _cache;
  } finally {
    _loading = false;
  }
}

// ── Fasce cliente (costanti, non in DB) ──────────────────────
export const FASCE_CLIENTE = {
  privato:     { label: 'Privato',     key: 'prezzoA' },
  giardiniere: { label: 'Giardiniere', key: 'prezzoB' },
  fidelizzato: { label: 'Fidelizzato', key: 'prezzoC' },
  speciale:    { label: 'Speciale',    key: 'prezzoD' },
};

// ── Mappatura suggerimenti noleggio → ID macchine reali ─────
// Basata su noleggio_macchine categoria=tappeto_erboso
export const SUGGERIMENTI_NOLEGGIO = {
  // compattamento elevato/medio → arieggiatori + carotatrice
  compattamento_elevato: [
    { id: 130, nome: 'Bucatrice Selvatici cm.160 - 12/18',    motivo: 'Compattamento elevato — bucatura profonda consigliata' },
    { id: 127, nome: 'Carotatrice 3 punti cm. 180',           motivo: 'Compattamento elevato — carotatura consigliata' },
    { id: 146, nome: 'Arieggiatore VR60 semov. lame mobili PROFESSIONALE', motivo: 'Compattamento elevato — arieggiatura professionale' },
  ],
  compattamento_medio: [
    { id: 144, nome: 'Arieggiatore a molle Classen 50',       motivo: 'Compattamento medio — arieggiatura consigliata' },
    { id: 145, nome: 'Arieggiatori HONDA S 35-45-60 E TORO 55', motivo: 'Compattamento medio — arieggiatura consigliata' },
  ],
  // drenaggio scarso/ristagni → scarificatura + spandisabbia
  drenaggio_scarso: [
    { id: 128, nome: 'Arieggiatore Verticutter cm. 152',       motivo: 'Drenaggio scarso — scarificatura verticale consigliata' },
    { id: 148, nome: 'Spandisabbia manuale cm 80 MINI TOPPER', motivo: 'Drenaggio scarso — sabbiatura consigliata' },
  ],
  drenaggio_ristagni: [
    { id: 128, nome: 'Arieggiatore Verticutter cm. 152',       motivo: 'Ristagni — scarificatura profonda necessaria' },
    { id: 149, nome: 'Spandisabbia Noblat lt. 350',            motivo: 'Ristagni — sabbiatura drenante consigliata' },
    { id: 130, nome: 'Bucatrice Selvatici cm.160 - 12/18',    motivo: 'Ristagni — bucatura per migliorare drenaggio' },
  ],
  // stato vegetativo critico/assente → rigeneratrice + seminatrice
  vegetativo_critico: [
    { id: 138, nome: 'Rigeneratrice RYAN cm. 60.',             motivo: 'Stato critico — rigenerazione consigliata' },
    { id: 157, nome: 'Seminatrice a spinta lt. 16 cm. 43 WOLF', motivo: 'Stato critico — trasemina necessaria' },
  ],
  vegetativo_assente: [
    { id: 131, nome: 'Erpice rottante MTZ 170 cm. 155',        motivo: 'Tappeto assente — preparazione terreno' },
    { id: 126, nome: 'Rigeneratrice Vredo cm. 140',            motivo: 'Tappeto assente — rigenerazione intensiva' },
    { id: 158, nome: 'Seminatrice a spinta lt. 50 cm.80 ROTA DAIRON', motivo: 'Tappeto assente — semina necessaria' },
  ],
};

// Funzione suggerimenti (compatibile con listino.js)
export function suggerisciNoleggio(compattamento, drenaggio, stato_vegetativo) {
  const ids = new Set();
  const result = [];

  const add = (lista) => {
    lista.forEach(m => {
      if (!ids.has(m.id)) {
        ids.add(m.id);
        result.push(m);
      }
    });
  };

  if (compattamento === 'elevato') add(SUGGERIMENTI_NOLEGGIO.compattamento_elevato);
  if (compattamento === 'medio')   add(SUGGERIMENTI_NOLEGGIO.compattamento_medio);
  if (drenaggio === 'scarso')      add(SUGGERIMENTI_NOLEGGIO.drenaggio_scarso);
  if (drenaggio === 'ristagni')    add(SUGGERIMENTI_NOLEGGIO.drenaggio_ristagni);
  if (stato_vegetativo === 'critico') add(SUGGERIMENTI_NOLEGGIO.vegetativo_critico);
  if (stato_vegetativo === 'assente') add(SUGGERIMENTI_NOLEGGIO.vegetativo_assente);

  return result; // Array di { id, nome, motivo }
}

// ── Funzioni prezzo ──────────────────────────────────────────
export function getPrezzoCliente(skuEntry, tipoCliente = 'privato') {
  if (!skuEntry) return null;
  const fascia = FASCE_CLIENTE[tipoCliente];
  const key = fascia?.key || 'prezzoA';
  return skuEntry[key] || skuEntry.prezzoA;
}

// ── Hook principale ──────────────────────────────────────────
export function useAgroListino() {
  const [stato, setStato] = useState({ listino: null, mapping: null, loading: true, error: null });

  useEffect(() => {
    _loadData()
      .then(({ LISTINO, PRODOTTO_CONFIG }) => {
        setStato({ listino: LISTINO, mapping: PRODOTTO_CONFIG, loading: false, error: null });
      })
      .catch(err => {
        setStato(s => ({ ...s, loading: false, error: err.message }));
      });
  }, []);

  const risolviProdotto = useCallback((label, kgTotali, tipoCliente = 'privato') => {
    if (!stato.listino || !stato.mapping || !label) return null;
    const { listino: LISTINO, mapping: PRODOTTO_CONFIG } = stato;

    // Match esatto o parziale
    let cfg = PRODOTTO_CONFIG[label];
    if (!cfg) {
      const key = Object.keys(PRODOTTO_CONFIG).find(k =>
        label.toLowerCase().includes(k.toLowerCase()) ||
        k.toLowerCase().includes(label.toLowerCase().split(' ')[0])
      );
      cfg = key ? PRODOTTO_CONFIG[key] : null;
    }
    if (!cfg) return null;

    // Formato
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

    const nConfezioni  = Math.ceil(kgTotali / kgPerConf);
    const prezzoUnit   = getPrezzoCliente(entry, tipoCliente);

    return {
      sku,
      formato:     entry.formato,
      kgPerConf,
      nConfezioni,
      prezzoUnit,
      prezzoTot:   +(prezzoUnit * nConfezioni).toFixed(2),
      iva:         entry.iva,
    };
  }, [stato]);

  // Invalida cache (chiamare dopo aggiornamento prezzi in admin)
  const invalidaCache = useCallback(() => { _cache = null; }, []);

  return {
    ...stato,
    risolviProdotto,
    invalidaCache,
    FASCE_CLIENTE,
    suggerisciNoleggio,
  };
}

export default useAgroListino;
