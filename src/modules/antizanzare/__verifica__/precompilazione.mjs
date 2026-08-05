/**
 * Verifica della precompilazione automatica delle quantita'.
 * Uso:  node src/modules/antizanzare/__verifica__/precompilazione.mjs
 *
 * Il rischio da escludere e' il ciclo infinito: l'effetto in ProgettoEdit
 * riscrive le quantita' a ogni render finche' non coincidono con i
 * suggerimenti. Se il confronto e l'assegnazione usassero arrotondamenti
 * diversi non convergerebbe mai e l'app si bloccherebbe.
 *
 * Qui simulo quel ciclo e verifico che si fermi, con metri frazionari,
 * riser decimali e piu' varianti in uso nella stessa categoria.
 */

import { calcolaImpianto, CATEGORIE, articoloPredefinito, arrotonda } from '../calcolo.js';

/* Copia fedele di allineaVociAuto da ProgettoEdit.jsx */
function allineaVociAuto(cfg, suggeriti) {
  if (!suggeriti) return null;
  const voci = cfg.voci || {};
  const auto = cfg.auto || {};
  const nuove = { ...voci };
  let cambiato = false;

  CATEGORIE.forEach((cat) => {
    if (auto[cat.id] === false) return;
    const sugg = suggeriti[cat.id];
    if (sugg == null) return;

    const q = cat.um === 'm' ? arrotonda(sugg, 2) : Math.round(sugg);
    const attuali = voci[cat.id] || [];
    const totale = attuali.reduce((a, v) => a + (Number(v.q) || 0), 0);
    if (Math.abs(totale - q) < 0.005) return;

    if (q <= 0) {
      if (attuali.length > 0) {
        nuove[cat.id] = [];
        cambiato = true;
      }
      return;
    }

    if (attuali.length <= 1) {
      const code = attuali[0]?.code || articoloPredefinito(cfg.brand, cat.id)?.code;
      if (!code) return;
      nuove[cat.id] = [{ code, q }];
      cambiato = true;
      return;
    }

    const tot = attuali.reduce((a, v) => a + (Number(v.q) || 0), 0) || 1;
    let residuo = q;
    nuove[cat.id] = attuali
      .map((v, i) => {
        if (i === attuali.length - 1) return { ...v, q: Math.max(0, arrotonda(residuo, 2)) };
        const parte =
          cat.um === 'm'
            ? arrotonda(((Number(v.q) || 0) / tot) * q, 2)
            : Math.round(((Number(v.q) || 0) / tot) * q);
        residuo = arrotonda(residuo - parte, 2);
        return { ...v, q: parte };
      })
      .filter((v) => v.q > 0);
    cambiato = true;
  });

  return cambiato ? nuove : null;
}

const MAX_GIRI = 20;

/**
 * @param {string[]} [derogheAttese] categorie che DEVONO discostarsi dal
 *   suggerimento, perche' forzate a mano. Per quelle lo scostamento e' l'esito
 *   corretto, non un difetto.
 */
function stabilizza(nome, cfgIniziale, linee, derogheAttese = []) {
  let cfg = cfgIniziale;
  let giri = 0;

  while (giri < MAX_GIRI) {
    const ris = calcolaImpianto({ ...cfg, linee });
    const nuove = allineaVociAuto(cfg, ris.suggeriti);
    if (!nuove) break;
    cfg = { ...cfg, voci: nuove };
    giri += 1;
  }

  const finale = calcolaImpianto({ ...cfg, linee });
  const convergiuto = giri < MAX_GIRI;

  console.log(`\n${convergiuto ? '✅' : '❌'} ${nome}`);
  console.log(`   giri fino alla stabilita': ${giri}${convergiuto ? '' : ' — NON CONVERGE'}`);

  CATEGORIE.forEach((cat) => {
    const t = finale.totali[cat.id];
    if (t.suggerito == null) return;
    const deroga = derogheAttese.includes(cat.id);
    const allineato = Math.abs(t.q - t.suggerito) < 0.01;
    const ok = deroga ? !allineato : allineato;
    console.log(
      `   ${ok ? ' ' : '✗'} ${cat.label.padEnd(22)} inserito ${String(t.q).padStart(9)} ${cat.um.padEnd(2)}` +
        ` · suggerito ${String(arrotonda(t.suggerito, 2)).padStart(9)}` +
        (deroga ? '   (deroga manuale, corretto)' : '')
    );
    if (!ok) {
      convergiutoKo.push(
        deroga
          ? `${nome} / ${cat.label}: la deroga manuale e' stata sovrascritta`
          : `${nome} / ${cat.label}`
      );
    }
  });

  // Gli avvisi di scostamento sono attesi solo dove c'e' una deroga voluta
  const avvisiQta = finale.avvisi.filter((a) => a.includes('suggerisce'));
  if (avvisiQta.length !== derogheAttese.length) {
    console.log('   ✗ avvisi di scostamento inattesi:');
    avvisiQta.forEach((a) => console.log(`       ${a}`));
    convergiutoKo.push(`${nome} / avvisi residui`);
  } else if (avvisiQta.length) {
    console.log('     avviso atteso: ' + avvisiQta[0]);
  }

  if (!convergiuto) convergiutoKo.push(`${nome} / ciclo infinito`);
  return finale;
}

const convergiutoKo = [];

const cfgBase = (brand, patch = {}) => ({
  brand,
  voci: {},
  auto: {},
  mTronco: 0,
  riserM: 2,
  scontoAcq: undefined,
  margine: 0,
  manoMode: 'det',
  manoMac: 200,
  manoRate: 8,
  extra: [],
  ...patch,
});

/* 1 — caso pulito, metri interi */
stabilizza(
  'Metri interi, un solo metodo',
  cfgBase('gardheaven', { mTronco: 15 }),
  [
    { etichetta: 'Insetticida', metri: 250, passo: 4, metodi: { m1d: 63 } },
    { etichetta: 'Repellente', metri: 230, passo: 4, metodi: { m1d: 58 } },
  ]
);

/* 2 — metri frazionari e riser decimale: il caso che faceva ciclare */
stabilizza(
  'Metri frazionari 137,5 + riser 1,5 m',
  cfgBase('pro', { mTronco: 12.5, riserM: 1.5 }),
  [
    { etichetta: 'Recinzione', metri: 137.5, passo: 3.5, metodi: { m1d: 25, m3d: 15 } },
    { etichetta: 'Pergolato', metri: 62.3, passo: 2.7, metodi: { m2q: 24 } },
  ]
);

/* 3 — riser che genera decimali ricorrenti */
stabilizza(
  'Riser 0,3 m su 37 ugelli (decimali ricorrenti)',
  cfgBase('geyser', { mTronco: 7.7, riserM: 0.3 }),
  [{ etichetta: 'Siepe', metri: 111, passo: 3, metodi: { m3d: 37 } }]
);

/* 4 — due varianti nella stessa categoria, da ridistribuire */
stabilizza(
  'Due tipi di tubo e due di ugello sulla stessa commessa',
  {
    ...cfgBase('geyser', { mTronco: 20 }),
    voci: {
      tubiLinea: [
        { code: '4213', q: 100 },
        { code: '4224', q: 50 },
      ],
      ugelli: [
        { code: '4219', q: 20 },
        { code: '4253', q: 10 },
      ],
    },
  },
  [
    { etichetta: 'Nord', metri: 180, passo: 4, metodi: { m1d: 45 } },
    { etichetta: 'Sud', metri: 96, passo: 3, metodi: { m1a: 32 } },
  ]
);

/* 5 — categoria forzata a mano: non deve essere toccata */
const forzato = stabilizza(
  'Categoria forzata a mano (auto=false) resta com e',
  {
    ...cfgBase('gardheaven'),
    voci: { ugelli: [{ code: 'UGEL0015', q: 5 }] },
    auto: { ugelli: false },
  },
  [{ etichetta: 'Prova', metri: 100, passo: 4, metodi: { m1d: 25 } }],
  ['ugelli']
);
if (forzato.totali.ugelli.q !== 5) {
  convergiutoKo.push('La categoria forzata a mano e stata sovrascritta');
}

/* 6 — nessuna linea: tutto a zero, nessun ciclo */
stabilizza('Progetto vuoto', cfgBase('smart'), []);

console.log('\n' + '─'.repeat(72));
if (convergiutoKo.length === 0) {
  console.log('✅ PRECOMPILAZIONE OK — converge sempre e rispetta le forzature manuali');
} else {
  console.log(`❌ ${convergiutoKo.length} problemi:`);
  convergiutoKo.forEach((p) => console.log(`   · ${p}`));
}
process.exit(convergiutoKo.length === 0 ? 0 : 1);
