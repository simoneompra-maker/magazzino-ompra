/**
 * Oracolo di verifica.
 *
 * Estrae il <script> dal Calcolatore_Impianto_Antizanzare.html originale,
 * lo esegue in Node con un DOM finto e restituisce l'oggetto LAST prodotto
 * da calc(). Serve a confrontare i numeri del motore nuovo con quelli
 * effettivamente prodotti dal calcolatore in uso — non con una mia
 * riscrittura degli stessi.
 */

import { readFileSync } from 'node:fs';
import vm from 'node:vm';

/** Nodo DOM finto: accetta qualsiasi scrittura senza errori. */
function fakeEl(value = '', checked = false) {
  return {
    value: String(value),
    checked,
    innerHTML: '',
    textContent: '',
    style: {},
    classList: { toggle() {}, add() {}, remove() {} },
    addEventListener() {},
    querySelector: () => fakeEl(),
    querySelectorAll: () => [],
  };
}

/**
 * @param {string} htmlPath percorso del calcolatore originale
 * @param {Object} scenario
 * @param {Array<{m:number,passo:number}>} scenario.zones
 * @param {Object} scenario.campi  valori per gli id degli input
 * @param {Array<{i:number,q:number}>} [scenario.accessori] indici in ACC
 * @param {Array<{desc:string,q:number,c:number,p:number}>} [scenario.extra]
 */
export function eseguiOriginale(htmlPath, scenario) {
  const html = readFileSync(htmlPath, 'utf8');
  const m = html.match(/<script>([\s\S]*)<\/script>/);
  if (!m) throw new Error('Script non trovato nell\'HTML');

  // Prendo dall'inizio dello script fino alla chiusura di calc(), escludendo
  // export xlsx, stampa, upload listino e wiring degli eventi.
  const full = m[1];
  const fine = full.indexOf('/* ============ distinta materiali');
  if (fine < 0) throw new Error('Delimitatore di fine calc() non trovato');
  // `const C` e `let ZS` vivono nello scope lessicale dello script, non sul
  // global object: espongo dei ponti per leggerli e scriverli dall'esterno.
  const codice =
    full.slice(0, fine) +
    `
let LAST = null;
globalThis.__catalogo = () => ({ C, UNIVERSAL });
globalThis.__setup = (zones, acc) => { ZS = zones; ACC = acc; };
globalThis.__run = () => { calc(); return LAST; };
`;

  const campi = { ...scenario.campi };
  const cache = new Map();

  const documentStub = {
    getElementById(id) {
      if (!cache.has(id)) {
        const v = campi[id];
        cache.set(
          id,
          fakeEl(v === undefined ? '' : v, id === 'usaTappo' ? Boolean(v) : false)
        );
      }
      return cache.get(id);
    },
    querySelector(sel) {
      const mm = sel.match(/\.accQty\[data-i="(\d+)"\]/);
      if (mm) {
        const acc = (scenario.accessori || []).find((a) => a.i === +mm[1]);
        return fakeEl(acc ? acc.q : 0);
      }
      return fakeEl();
    },
    querySelectorAll(sel) {
      if (sel === '.zrow') return []; // uso la variabile globale ZS
      if (sel === '.exrow') {
        return (scenario.extra || []).map((e) => ({
          querySelector: (s2) =>
            fakeEl(
              s2 === '.exDesc' ? e.desc : s2 === '.exQty' ? e.q : s2 === '.exC' ? e.c : e.p
            ),
        }));
      }
      if (sel === '.accChk') {
        return (scenario.accessori || []).map((a) => ({
          dataset: { i: String(a.i) },
          checked: true,
        }));
      }
      return [];
    },
  };

  const sandbox = {
    document: documentStub,
    console,
    Math,
    Number,
    parseFloat,
    parseInt,
    isNaN,
    Date,
    String,
    Array,
    Object,
    JSON,
  };
  vm.createContext(sandbox);
  vm.runInContext(codice, sandbox);

  const { C, UNIVERSAL } = sandbox.__catalogo();

  // ZS = stato zone (il calcolatore legge .zrow solo se presenti nel DOM)
  // ACC = accessori del brand corrente + universali, come fa fillMaterials()
  const sysKey = C.brands[campi.brand].sys;
  sandbox.__setup(
    scenario.zones.map((z) => ({ m: z.m, passo: z.passo })),
    [...C.sys[sysKey].accessori, ...UNIVERSAL]
  );

  return sandbox.__run();
}
