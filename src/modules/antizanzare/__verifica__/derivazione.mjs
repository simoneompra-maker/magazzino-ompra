/**
 * Verifica del montaggio per derivazione dal tronco.
 * Uso:  node src/modules/antizanzare/__verifica__/derivazione.mjs
 *
 * Catena per ogni ugello derivato da una dorsale Ø8 / 3-8":
 *   T sul tubo grosso → (riduzione, dove il T non riduce da solo)
 *   → spezzone di tubo sottile → portaugello → ugello
 *
 * Lo spezzone NON si conteggia: in cantiere sono pochi centimetri ricavati
 * dagli sfridi delle bobine gia' aperte.
 *
 * Geyser non ha la riduzione separata perche' il T Ø8-6-8 riduce da solo.
 */

import { calcolaImpianto, suggerimenti, articoliCategoria } from '../calcolo.js';
import { C, supportaDerivazione, riduzioniPerBrand, METODI } from '../catalogo.js';

let ko = 0;
const t = (etichetta, atteso, ottenuto) => {
  const ok = atteso === ottenuto;
  if (!ok) ko += 1;
  console.log(
    `   ${ok ? ' ' : '✗'} ${etichetta.padEnd(46)}` + (ok ? `${ottenuto}` : `atteso ${atteso}, ottenuto ${ottenuto}`)
  );
};

console.log('\n■ Quali brand possono derivare dal tronco');
t('Geyser (T Ø8-6-8)', true, supportaDerivazione('geyser'));
t('Zanzero PRO (T 3/8" + riduzione)', true, supportaDerivazione('pro'));
t('Gardheaven (T 3/8" + riduzione)', true, supportaDerivazione('gardheaven'));
t('Zanzero SMART: solo 1/4", non deriva', false, supportaDerivazione('smart'));

console.log('\n■ Riduzioni disponibili');
t('Geyser: nessuna, il T riduce da solo', 0, riduzioniPerBrand('geyser').length);
t('Zanzero PRO', 2, riduzioniPerBrand('pro').length);
t('Gardheaven', 1, riduzioniPerBrand('gardheaven').length);
t('SMART', 0, riduzioniPerBrand('smart').length);

console.log('\n■ I metodi di derivazione esistono nel catalogo');
t('m4d presente', true, METODI.some((m) => m.id === 'm4d' && m.deriva));
t('m4a presente', true, METODI.some((m) => m.id === 'm4a' && m.deriva));

/* ── Zanzero PRO: dorsale 3/8" con 20 ugelli derivati ── */
console.log('\n■ Zanzero PRO — 60 m di dorsale 3/8", 20 ugelli derivati');
{
  const linee = [
    { etichetta: 'Dorsale', metri: 60, metriTronco: 60, passo: 3, anello: false, metodi: { m4d: 15, m4a: 5 } },
  ];
  const base = { brand: 'pro', linee, risalitaM: 2 };
  const s = suggerimenti(base);

  t('ugelli', 20, s.ugelli);
  t('portaugelli dritti', 15, s.portaDritti);
  t('portaugelli angolati', 5, s.porta90);
  t('raccordi a T (uno per derivazione)', 20, s.raccordiT);
  t('riduzioni 3/8-1/4', 20, s.riduzioni);
  t('tubo 3/8" (m)', 60, s.tubiTronco);
  t('tubo 1/4": gli spezzoni non si conteggiano', 0, s.tubiLinea);
  t('tappi: linea aperta, due estremita', 2, s.tappi);

  // distinta completa con le quantita' suggerite
  const sys = C.sys[C.brands.pro.sys];
  const voci = {
    macchine: [{ code: 'ZA200', q: 1 }],
    tubiTronco: [{ code: 'AI38100N', q: s.tubiTronco }],
    ugelli: [{ code: sys.ugello[0].code, q: s.ugelli }],
    portaDritti: [{ code: 'AI529014', q: s.portaDritti }],
    porta90: [{ code: 'AI519014', q: s.porta90 }],
    raccordiT: [{ code: 'AI193838', q: s.raccordiT }],
    riduzioni: [{ code: 'AI161438', q: s.riduzioni }],
    tappi: [{ code: 'AI300038', q: s.tappi }],
    accessori: [],
  };
  const r = calcolaImpianto({ ...base, voci, scontoAcq: 30, margine: 0, manoMode: 'manual', manoRate: 0 });

  t('nessun avviso di scostamento', 0, r.avvisi.filter((a) => a.includes('suggerisce')).length);
  t('righe in distinta', 8, r.bom.length);

  // costo atteso, calcolato a mano dal listino meno 30%
  const atteso =
    1040.98 * 0.7 + // ZA200
    60 * 3.95 * 0.7 + // tubo 3/8"
    20 * 5.1 * 0.7 + // ugelli standard
    15 * 4.47 * 0.7 + // portaugelli dritti
    5 * 4.3 * 0.7 + // portaugelli 90
    20 * 10.5 * 0.7 + // T 3/8"
    20 * 6.8 * 0.7 + // riduzioni
    2 * 6.8 * 0.7; // due tappi 3/8"
  const scarto = Math.abs(r.costi.totale - atteso);
  t('costo coincide col calcolo a mano', true, scarto < 0.005);
  console.log(`     costo motore ${r.costi.totale.toFixed(2)} € · a mano ${atteso.toFixed(2)} €`);
}

/* ── Geyser: nessuna riduzione, il T Ø8-6-8 riduce da solo ── */
console.log('\n■ Geyser — dorsale Ø8, 12 ugelli derivati');
{
  const linee = [{ etichetta: 'Dorsale', metri: 48, metriTronco: 48, passo: 4, metodi: { m4d: 12 } }];
  const base = { brand: 'geyser', linee };
  const s = suggerimenti(base);

  t('ugelli', 12, s.ugelli);
  t('raccordi a T', 12, s.raccordiT);
  t('riduzioni: nessuna, il T riduce', 0, s.riduzioni);
  t('tubo Ø6: gli spezzoni non si conteggiano', 0, s.tubiLinea);
  t('categoria riduzioni vuota', 0, articoliCategoria('geyser', 'riduzioni').length);
}

/* ── Metodi misti: derivazione + perimetro normale ── */
console.log('\n■ Gardheaven — dorsale derivata + linea perimetrale');
{
  const linee = [
    { etichetta: 'Dorsale', metri: 40, metriTronco: 40, passo: 4, metodi: { m4d: 10 } },
    { etichetta: 'Perimetro', metri: 120, metriTronco: 0, passo: 4, metodi: { m1d: 30 } },
  ];
  const base = { brand: 'gardheaven', linee };
  const s = suggerimenti(base);

  t('ugelli totali', 40, s.ugelli);
  t('portaugelli dritti (10 deriv + 30 perim)', 40, s.portaDritti);
  t('raccordi a T (10 deriv + 30 perim)', 40, s.raccordiT);
  t('riduzioni solo per le derivazioni', 10, s.riduzioni);
  t('tubo 3/8"', 40, s.tubiTronco);
  t('tubo 1/4" = solo il perimetro', 120, s.tubiLinea);
  t('tappi: entrambe ad anello chiuso', 0, s.tappi);
}

/* ── Chiusura del circuito ── */
console.log('\n■ Tappi: anello chiuso o linea aperta');
{
  const conAnello = suggerimenti({
    brand: 'gardheaven',
    linee: [
      { metri: 250, passo: 4, anello: true, metodi: { m1d: 63 } },
      { metri: 230, passo: 4, anello: true, metodi: { m1d: 58 } },
    ],
  });
  const aperte = suggerimenti({
    brand: 'gardheaven',
    linee: [
      { metri: 250, passo: 4, anello: false, metodi: { m1d: 63 } },
      { metri: 230, passo: 4, anello: false, metodi: { m1d: 58 } },
    ],
  });
  const mista = suggerimenti({
    brand: 'gardheaven',
    linee: [
      { metri: 250, passo: 4, anello: true, metodi: { m1d: 63 } },
      { metri: 230, passo: 4, anello: false, metodi: { m1d: 58 } },
    ],
  });
  const predefinito = suggerimenti({
    brand: 'gardheaven',
    linee: [{ metri: 250, passo: 4, metodi: { m1d: 63 } }],
  });

  t('due anelli chiusi: nessun tappo', 0, conAnello.tappi);
  t('due linee aperte: quattro tappi', 4, aperte.tappi);
  t('una chiusa e una aperta: due tappi', 2, mista.tappi);
  t('senza indicazione vale anello chiuso', 0, predefinito.tappi);
}

console.log('\n' + '─'.repeat(72));
console.log(ko === 0 ? '✅ DERIVAZIONE E CHIUSURA CIRCUITO OK' : `❌ ${ko} verifiche fallite`);
process.exit(ko === 0 ? 0 : 1);
