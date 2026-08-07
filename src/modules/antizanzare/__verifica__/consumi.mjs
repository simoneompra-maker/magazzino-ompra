/**
 * Verifica del calcolo consumi.
 * Uso:  node src/modules/antizanzare/__verifica__/consumi.mjs
 *
 * Ogni caso e' confrontato con un conto fatto a mano, scritto per esteso
 * nel commento: se il motore cambia e il numero non torna piu', si vede
 * subito quale passaggio e' saltato.
 */

import {
  calcolaConsumi, consumoProdotto, rigaProdotto, prodottiDaProgetto,
  righeRapide, ugelliDaMetri, metriDaUgelli,
} from '../consumi.js';
import { portataStimata, portataUgello, C, TARATURA_PORTATA, CONSUMABILI, consumabiliPerBrand } from '../catalogo.js';
import { calcolaImpianto } from '../calcolo.js';

let ko = 0;
const vicino = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;

const t = (etichetta, atteso, ottenuto, tol = 1e-9) => {
  const num = typeof atteso === 'number' && typeof ottenuto === 'number';
  const ok = num ? vicino(atteso, ottenuto, tol) : atteso === ottenuto;
  if (!ok) ko += 1;
  const mostra = (v) => (typeof v === 'number' ? Number(v.toFixed(6)) : v);
  console.log(
    `   ${ok ? ' ' : '✗'} ${etichetta.padEnd(52)}` +
      (ok ? `${mostra(ottenuto)}` : `atteso ${mostra(atteso)}, ottenuto ${mostra(ottenuto)}`)
  );
};

/* ── il modello di portata rispetta il dato dichiarato ── */
console.log('\n■ Portata: taratura sul dato Stocker');
{
  const { foroMm, bar, lMin } = TARATURA_PORTATA;
  t('0,3 mm a 12 bar = valore di targa', lMin, portataStimata(foroMm, bar), 1e-12);

  // Quadrato del diametro: raddoppiando il foro la portata quadruplica
  t('0,6 mm a 12 bar = 4x', lMin * 4, portataStimata(0.6, 12), 1e-12);
  // Radice della pressione: a pressione quadrupla la portata raddoppia
  t('0,3 mm a 48 bar = 2x', lMin * 2, portataStimata(0.3, 48), 1e-12);

  t('foro nullo', 0, portataStimata(0, 12));
  t('pressione nulla', 0, portataStimata(0.3, 0));
}

console.log('\n■ Portata: dichiarata batte stimata');
{
  const geyser = C.sys.geyser.ugello.find((u) => u.code === '4219');
  const gh = C.sys.gardheaven.ugello.find((u) => u.code === 'UGEL0015');

  const a = portataUgello(geyser, 12);
  t('Geyser 4219: fonte', 'dichiarata', a.fonte);
  t('Geyser 4219: 0,04 l/min', 0.04, a.lMin);

  // Il valore dichiarato non si muove nemmeno cambiando la pressione:
  // e' un dato di targa, non una formula
  t('Geyser 4219 a 20 bar: resta 0,04', 0.04, portataUgello(geyser, 20).lMin);

  const b = portataUgello(gh, 50);
  t('Gardheaven 0,15 mm: fonte', 'stimata', b.fonte);
  // 0,04 x (0,15/0,3)^2 x sqrt(50/12) = 0,04 x 0,25 x 2,0412 = 0,020412
  t('Gardheaven 0,15 mm a 50 bar', 0.04 * 0.25 * Math.sqrt(50 / 12), b.lMin, 1e-12);

  t('articolo assente', 'ignota', portataUgello(null, 12).fonte);
}

/* ── una riga di prodotto ── */
console.log('\n■ Un prodotto: 60 ugelli, 2 min/giorno, 2%, 150 giorni');
{
  /* Conto a mano:
     miscela/giorno    = 60 x 0,04 x 2            = 4,8 l
     concentrato/giorno= 4,8 x 2%                 = 0,096 l
     stagione          = 0,096 x 150              = 14,4 l
     confezioni da 5 L = ceil(14,4 / 5) = ceil(2,88) = 3
     costo             = 3 x 174,59               = 523,77 € */
  const r = consumoProdotto(
    rigaProdotto({
      code: '45147',
      litriConf: 5,
      prezzoConf: 174.59,
      ugelli: 60,
      portataLmin: 0.04,
      minutiGiorno: 2,
      percentuale: 2,
      giorni: 150,
    })
  );

  t('miscela al giorno (l)', 4.8, r.miscelaGiorno, 1e-12);
  t('concentrato al giorno (l)', 0.096, r.concentratoGiorno, 1e-12);
  t('acqua al giorno (l)', 4.704, r.acquaGiorno, 1e-12);
  t('concentrato stagione (l)', 14.4, r.concentratoStagione, 1e-9);
  t('confezioni da 5 L', 3, r.confezioni);
  t('costo stagione (€)', 523.77, r.costo, 1e-9);
  t('residuo a fine stagione (l)', 0.6, r.residuo, 1e-9);
  t('€/litro di concentrato', 174.59 / 5, r.euroLitro, 1e-12);
}

console.log('\n■ Confezioni: si arrotonda sempre per eccesso');
{
  const base = { litriConf: 1, prezzoConf: 10, ugelli: 1, portataLmin: 1, percentuale: 100, giorni: 1 };
  // consumo = minutiGiorno litri esatti
  t('3 litri tondi -> 3 confezioni', 3, consumoProdotto({ ...base, minutiGiorno: 3 }).confezioni);
  t('3,01 litri -> 4 confezioni', 4, consumoProdotto({ ...base, minutiGiorno: 3.01 }).confezioni);
  t('0,1 litri -> 1 confezione', 1, consumoProdotto({ ...base, minutiGiorno: 0.1 }).confezioni);
  t('zero -> zero confezioni', 0, consumoProdotto({ ...base, minutiGiorno: 0 }).confezioni);

  /* Il caso che rompe un ceil ingenuo: 0,1 x 3 in virgola mobile fa
     0,30000000000000004, e ceil(0,300.../0,1) darebbe 4 invece di 3. */
  t('trappola virgola mobile (0,1 x 3)', 3, consumoProdotto({ ...base, litriConf: 0.1, minutiGiorno: 0.3 }).confezioni);
}

/* ── due prodotti con cicli diversi ── */
console.log('\n■ Due prodotti, minuti e giorni diversi');
{
  /* E' lo scenario della guida Stocker: insetticida una volta al giorno
     nei primi dieci giorni, poi repellente due volte al giorno.
     Con un unico campo "minuti totali" questo conto non si potrebbe fare. */
  const r = calcolaConsumi({
    prodotti: [
      rigaProdotto({ code: '45130', tipo: 'insetticida', litriConf: 1, prezzoConf: 38.4,
        ugelli: 60, portataLmin: 0.04, minutiGiorno: 1, percentuale: 2, giorni: 10 }),
      rigaProdotto({ code: '45124', tipo: 'repellente', litriConf: 1, prezzoConf: 31.6,
        ugelli: 60, portataLmin: 0.04, minutiGiorno: 2, percentuale: 1, giorni: 140 }),
    ],
  });

  // insetticida: 60 x 0,04 x 1 = 2,4 l/gg x 2% = 0,048 x 10 = 0,48 l -> 1 conf. -> 38,40 €
  // repellente:  60 x 0,04 x 2 = 4,8 l/gg x 1% = 0,048 x 140 = 6,72 l -> 7 conf. -> 221,20 €
  t('prodotti attivi', 2, r.nProdotti);
  t('insetticida: concentrato stagione', 0.48, r.righe[0].concentratoStagione, 1e-9);
  t('insetticida: confezioni', 1, r.righe[0].confezioni);
  t('repellente: concentrato stagione', 6.72, r.righe[1].concentratoStagione, 1e-9);
  t('repellente: confezioni', 7, r.righe[1].confezioni);
  t('costo prodotti (€)', 38.4 + 7 * 31.6, r.costoProdotti, 1e-9);
  t('giorni della riga piu lunga', 140, r.giorniMax);

  // La miscela totale NON e' la somma su giorni diversi: e' la somma dei
  // litri effettivi, 2,4 x 10 + 4,8 x 140 = 24 + 672 = 696
  t('miscela di stagione (l)', 696, r.miscelaStagione, 1e-9);
}

console.log('\n■ Righe incomplete non contano');
{
  const r = calcolaConsumi({
    prodotti: [
      rigaProdotto({ ugelli: 60, portataLmin: 0.04, minutiGiorno: 2, percentuale: 0 }), // manca la %
      rigaProdotto({ ugelli: 60, portataLmin: 0.04, minutiGiorno: 0, percentuale: 2 }), // mancano i minuti
      rigaProdotto({}), // vuota
    ],
  });
  t('nessun prodotto attivo', 0, r.nProdotti);
  t('costo zero', 0, r.costoStagione);
}

console.log('\n■ Acqua conteggiata solo se le si da un prezzo');
{
  const prodotti = [
    rigaProdotto({ litriConf: 1, prezzoConf: 10, ugelli: 100, portataLmin: 0.04,
      minutiGiorno: 5, percentuale: 2, giorni: 150 }),
  ];
  // miscela stagione = 100 x 0,04 x 5 x 150 = 3000 l, acqua = 2940 l = 2,94 m³
  const senza = calcolaConsumi({ prodotti });
  const con = calcolaConsumi({ prodotti, prezzoAcquaMc: 2 });
  t('acqua di stagione (l)', 2940, senza.acquaStagione, 1e-9);
  t('senza prezzo: costo acqua nullo', 0, senza.costoAcqua);
  t('a 2 €/m³', 5.88, con.costoAcqua, 1e-9);
  t('entra nel totale', senza.costoProdotti + 5.88, con.costoStagione, 1e-9);
}

/* ── precompilazione dal progetto ── */
console.log('\n■ Precompilazione dal progetto');
{
  const ugelloGeyser = C.sys.geyser.ugello.find((u) => u.code === '4219');
  const kit = [
    CONSUMABILI.geyser.find((p) => p.code === '45130'), // Etokraft 1 L  -> 38,40 €/l
    CONSUMABILI.geyser.find((p) => p.code === '45147'), // Etokraft 5 L  -> 34,92 €/l
    CONSUMABILI.geyser.find((p) => p.code === '45128'), // Nebuzan 1 L
  ];

  const righe = prodottiDaProgetto({
    brandId: 'geyser',
    ugelli: 63,
    articoloUgello: ugelloGeyser,
    consumabili: kit,
  });

  t('una riga per tipo', 2, righe.length);
  t('primo: insetticida', 'insetticida', righe[0].tipo);
  // Fra i due formati di Etokraft vince la tanica: costa meno al litro
  t('sceglie il formato piu conveniente', '45147', righe[0].code);
  t('secondo: repellente', 'repellente', righe[1].tipo);
  t('ugelli dal progetto', 63, righe[0].ugelli);
  t('portata dichiarata Stocker', 0.04, righe[0].portataLmin);
  t('pressione predefinita Geyser', 12, righe[0]._pressione);
  t('insetticida: 1 min/giorno', 1, righe[0].minutiGiorno);
  t('insetticida: 1%', 1, righe[0].percentuale);
  t('repellente: 2 min/giorno', 2, righe[1].minutiGiorno);
  t('repellente: 5%', 5, righe[1].percentuale);
  t('giorni di stagione', 150, righe[0].giorni);

  // L'anticalcare e' 'altro': non e' un prodotto da nebulizzare a ciclo
  const conAltro = prodottiDaProgetto({
    brandId: 'gardheaven',
    ugelli: 40,
    articoloUgello: C.sys.gardheaven.ugello.find((u) => u.code === 'UGEL003'),
    consumabili: CONSUMABILI.gardheaven,
  });
  t('anticalcare escluso', 2, conAltro.length);
  t('Gardheaven: insetticida Firewall', 'FIREWALL-Inse5L', conAltro[0].code);
  // 0,3 mm a 17 bar: 0,04 x sqrt(17/12)
  t('portata stimata a 17 bar', 0.04 * Math.sqrt(17 / 12), conAltro[0].portataLmin, 1e-12);
}

/* ── il catalogo consumabili e' completo ── */
console.log('\n■ Catalogo consumabili');
{
  ['geyser', 'pro', 'smart', 'gardheaven'].forEach((b) => {
    const ins = consumabiliPerBrand(b, 'insetticida').length;
    const rep = consumabiliPerBrand(b, 'repellente').length;
    const ok = ins > 0 && rep > 0;
    if (!ok) ko += 1;
    console.log(
      `   ${ok ? ' ' : '✗'} ${b.padEnd(52)}${ins} insetticidi, ${rep} repellenti`
    );
  });

  // Ogni articolo deve avere litri e prezzo, altrimenti il €/litro esplode
  const rotti = Object.entries(CONSUMABILI).flatMap(([b, l]) =>
    l.filter((p) => !(p.litri > 0) || !(p.priceRaw > 0)).map((p) => `${b}/${p.code}`)
  );
  t('articoli senza litri o prezzo', 0, rotti.length);
  if (rotti.length) console.log('     ', rotti.join(', '));
}

/* ── calcolatore rapido ── */
console.log('\n■ Calcolatore rapido: dal perimetro al costo');
{
  t('250 m a passo 4 = 63 ugelli', 63, ugelliDaMetri(250, 4));
  t('252 m a passo 4 = 63 ugelli', 63, ugelliDaMetri(252, 4));
  t('253 m arrotonda per eccesso', 64, ugelliDaMetri(253, 4));
  t('passo 3', 84, ugelliDaMetri(250, 3));
  t('andata e ritorno: 63 ugelli = 252 m', 252, metriDaUgelli(63, 4));
  t('perimetro nullo', 0, ugelliDaMetri(0, 4));

  const righe = righeRapide({ brandId: 'geyser', ugelli: 63, mesi: 5 });
  t('due righe pronte', 2, righe.length);
  t('ugello standard da 0,3 mm', '4219', righe[0]._ugello);
  t('portata dichiarata', 0.04, righe[0].portataLmin);
  t('5 mesi = 150 giorni', 150, righe[0].giorni);
  t('insetticida 1 min all 1%', '1/1', `${righe[0].minutiGiorno}/${righe[0].percentuale}`);
  t('repellente 2 min al 5%', '2/5', `${righe[1].minutiGiorno}/${righe[1].percentuale}`);
  t('formato piu conveniente al litro', '45147', righe[0].code);

  const r = calcolaConsumi({ prodotti: righe });
  /* Controprova dichiarata a Simone: una tanica da 5 L al 5% fa 100 l di
     miscela; a 63 ugelli x 0,04 x 2 min = 5,04 l al giorno, dura tre
     settimane scarse. E' il numero che smaschera una diluizione sbagliata. */
  t('miscela repellente al giorno', 5.04, r.righe[1].miscelaGiorno, 1e-9);
  t('una tanica da 5 L dura ~20 giorni', 5 / 0.252, r.righe[1].giorniPerConfezione, 1e-9);
  t('taniche di repellente in stagione', 8, r.righe[1].confezioni);
  console.log(`     costo di stagione: ${r.costoStagione.toFixed(2)} €`);

  // Ugelli a zero: nessun consumo, nessun costo, nessuna divisione per zero
  const vuoto = calcolaConsumi({ prodotti: righeRapide({ brandId: 'geyser', ugelli: 0, mesi: 5 }) });
  t('senza ugelli non consuma', 0, vuoto.costoStagione);
  t('durata confezione non esplode', 0, vuoto.righe[0].giorniPerConfezione);

  // Gardheaven: 0,3 mm c'e' a catalogo, ma la portata e' stimata
  const gh = righeRapide({ brandId: 'gardheaven', ugelli: 40, mesi: 5 });
  t('Gardheaven usa lo 0,3 mm', 'UGEL003', gh[0]._ugello);
  t('portata stimata, non dichiarata', 'stimata', gh[0]._fontePortata);
}

/* ── il kit prodotti nel preventivo ── */
console.log('\n■ Kit prodotti: effetto sul preventivo');
{
  const linee = [{ etichetta: 'Perimetro', metri: 120, passo: 4, metodi: { m1d: 30 } }];
  const voci = {
    macchine: [{ code: 'Comfort01', q: 1 }],
    tubiLinea: [{ code: 'TBPA30BAR1/4', q: 120 }],
    ugelli: [{ code: 'UGEL003', q: 30 }],
    portaDritti: [{ code: 'RACCPUD1/4', q: 30 }],
    raccordiT: [{ code: 'RACCT1/4', q: 30 }],
  };
  const base = { brand: 'gardheaven', linee, voci, margine: 0, manoMode: 'det', manoMac: 0 };

  const senza = calcolaImpianto(base);
  const con = calcolaImpianto({
    ...base,
    consumabili: [
      { code: 'FIREWALL-Inse1L', q: 1 }, // 32 €
      { code: 'CHEF-BarrArom1L', q: 1 }, // 49 €
    ],
  });

  /* Il punto piu' importante: senza kit il preventivo deve dare gli
     stessi identici numeri di prima che il kit esistesse. */
  t('senza kit: imponibile invariato', senza.prezzi.imponibile, senza.prezzi.impianto, 1e-9);
  t('senza kit: nessuna riga in distinta', 0, senza.bom.filter((r) => r.categoria === 'consumabili').length);
  t('senza kit: kit a zero', 0, senza.prezzi.kitProdotti);

  t('con kit: due righe in distinta', 2, con.bom.filter((r) => r.categoria === 'consumabili').length);
  t('con kit: prezzo del kit', 81, con.prezzi.kitProdotti, 1e-9);
  t('impianto identico al caso senza kit', senza.prezzi.impianto, con.prezzi.impianto, 1e-9);
  t('imponibile = impianto + kit', con.prezzi.impianto + 81, con.prezzi.imponibile, 1e-9);

  // IVA sul totale comprensivo del kit
  t('IVA al 22% sul totale', con.prezzi.imponibile * 0.22, con.prezzi.iva, 1e-9);
  t('totale IVA compresa', con.prezzi.imponibile * 1.22, con.prezzi.totaleIva, 1e-9);

  /* Il ricarico si applica al materiale d'impianto ma NON ai prodotti:
     quelli si rivendono al listino del fabbricante. */
  const conMargine = calcolaImpianto({
    ...base,
    margine: 20,
    consumabili: [{ code: 'FIREWALL-Inse1L', q: 1 }],
  });
  const senzaMargine = calcolaImpianto({ ...base, margine: 20 });
  t('il ricarico non tocca il kit', 32, conMargine.prezzi.kitProdotti, 1e-9);
  t('il ricarico resta sul materiale', senzaMargine.prezzi.impianto, conMargine.prezzi.impianto, 1e-9);

  // Il costo del kit entra nel margine, altrimenti il margine sarebbe gonfiato
  t('costo del kit conteggiato', con.costi.totale > senza.costi.totale, true);
  t('margine coerente', con.prezzi.venditaMateriale + 81 - con.costi.totale, con.margine, 1e-9);

  // Un codice inesistente non deve inquinare il totale
  const fasullo = calcolaImpianto({ ...base, consumabili: [{ code: 'NON_ESISTE', q: 3 }] });
  t('codice sconosciuto ignorato', 0, fasullo.prezzi.kitProdotti);

  // Il kit di un altro brand non deve passare
  const altroBrand = calcolaImpianto({ ...base, consumabili: [{ code: '45130', q: 1 }] });
  t('consumabile di un altro brand ignorato', 0, altroBrand.prezzi.kitProdotti);
}

console.log('\n' + '─'.repeat(72));
console.log(ko === 0 ? '✅ CONSUMI OK' : `❌ ${ko} verifiche fallite`);
process.exit(ko === 0 ? 0 : 1);
