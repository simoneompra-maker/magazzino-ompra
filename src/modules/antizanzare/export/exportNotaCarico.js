/**
 * Nota di carico in Excel — il foglio che il tecnico porta in cantiere.
 *
 * Le colonne "Q.tà usata", "Extra" e "Note" restano vuote: si compilano
 * a mano a fine montaggio. Nessun costo e nessun prezzo: e' un documento
 * operativo, non commerciale.
 *
 * VINCOLO DI STAMPA: deve entrare in larghezza su un A4 VERTICALE.
 * Con i margini stretti impostati qui sotto restano circa 523 pt utili.
 * La larghezza di colonna di Excel si converte in punti con
 *     pt = 5,25 x width + 3,75
 * quindi le sette colonne insieme non possono superare ~94 unita'.
 * Il totale usato e' 90: sotto la soglia con un margine di sicurezza.
 * Verificato stampando davvero il file — vedi __verifica__/stampa.mjs.
 */

import * as XLSXns from 'xlsx-js-style';

// xlsx-js-style e' CommonJS: nel bundle del browser la namespace basta,
// sotto Node finisce in .default. Cosi' il modulo e' verificabile da riga
// di comando senza cambiare nulla per l'app.
const XLSX = XLSXns.default ?? XLSXns;

const VERDE = '006B3F';
const AMBRA = 'B45309';

/**
 * Larghezze in unita' Excel. Somma 90, dentro il limite dell'A4 verticale.
 * La colonna B e' l'unica larga: ci vanno le descrizioni degli articoli e,
 * nella tabella delle linee, la ripartizione per metodo. Tutte e due vanno
 * a capo invece di allargare la pagina.
 */
const LARGHEZZE = [13, 32, 5, 9, 9, 9, 13];
const ULTIMA_COL = LARGHEZZE.length - 1; // G

const ETICHETTE_METODO = {
  m1d: 'T+dritto',
  m1a: 'T+90°',
  m2q: 'in linea',
  m3d: 'riser dritto',
  m3a: 'riser 90°',
  m4d: 'deriv. dritto',
  m4a: 'deriv. 90°',
};

const bordo = {
  top: { style: 'thin', color: { rgb: 'C8C8C8' } },
  bottom: { style: 'thin', color: { rgb: 'C8C8C8' } },
  left: { style: 'thin', color: { rgb: 'C8C8C8' } },
  right: { style: 'thin', color: { rgb: 'C8C8C8' } },
};

const cella = (v, stile = {}) => ({ v: v ?? '', t: typeof v === 'number' ? 'n' : 's', s: stile });

const titolo = (v) => cella(v, { font: { bold: true, sz: 13, color: { rgb: VERDE } } });
const sottotitolo = (v) => cella(v, { font: { sz: 8, color: { rgb: '888888' } } });
const sezione = (v, colore = VERDE) => cella(v, { font: { bold: true, sz: 10, color: { rgb: colore } } });
const etichetta = (v) => cella(v, { font: { sz: 8, color: { rgb: '888888' } } });
const testo = (v) => cella(v, { font: { sz: 9 }, alignment: { wrapText: true } });

const intestazione = (v) =>
  cella(v, {
    font: { bold: true, sz: 8, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: VERDE } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: bordo,
  });

const datoTesto = (v) =>
  cella(v, { font: { sz: 9 }, border: bordo, alignment: { wrapText: true, vertical: 'center' } });

const datoNum = (v) =>
  cella(v, {
    font: { sz: 9 },
    border: bordo,
    alignment: { horizontal: 'center', vertical: 'center' },
    numFmt: '0.##',
  });

/** Casella grigia da compilare a penna in cantiere. */
const daCompilare = () => cella('', { border: bordo, fill: { fgColor: { rgb: 'FAFAFA' } } });

const dataIt = (d = new Date()) => d.toLocaleDateString('it-IT');

/**
 * Righe libere per il materiale non previsto: quante ne stanno nello
 * spazio rimasto, entro questi limiti. Riempire il foglio evita di
 * mandare la sola firma su una seconda pagina.
 */
const RIGHE_LIBERE_MIN = 4;
const RIGHE_LIBERE_MAX = 12;

/**
 * Altezze minime: una riga da compilare a penna vuole almeno 7 mm,
 * cioe' una ventina di punti. Sotto quella soglia si scrive male.
 */
const H_RIGA_DATI = 20;
const H_RIGA_LIBERA = 22;

/**
 * Altezza utile di un A4 verticale con i margini impostati sopra:
 * 841,89 pt di foglio meno 0,5 pollici sopra e sotto.
 *
 * Tutte le righe hanno un'altezza esplicita, quindi so esattamente dove
 * cadra' il salto pagina e posso ristampare l'intestazione della tabella
 * in cima al foglio successivo. Senza, il tecnico si troverebbe una
 * griglia di caselle senza sapere quale colonna e' quale.
 */
const ALTEZZA_UTILE = 841.89 - 2 * 36;

/** Spazio riservato in fondo alla firma del tecnico. */
const H_FIRMA = 26;

/**
 * @param {Object} p
 * @param {Object} p.progetto  numero, cliente_nome, indirizzo, tecnico, data_montaggio
 * @param {Array}  p.bom       righe di distinta dal motore
 * @param {Array}  p.linee     linee con etichetta, metri, metriTronco, passo, metodi
 * @param {Object} [p.risultato]
 * @returns {{filename:string, blob:Blob}}
 */
export function costruisciNotaCarico({ progetto, bom, linee, risultato }) {
  const aoa = [];
  const merges = [];
  const righe = []; // altezze, una per riga
  let r = 0;

  let y = 0; // punti occupati sulla pagina corrente

  const push = (celle, altezza = 14) => {
    aoa.push(celle);
    righe.push({ hpt: altezza });
    y += altezza;
    r += 1;
  };
  const vuota = (altezza = 6) => push([], altezza);

  /**
   * Manda avanti alla pagina successiva se il blocco alto `h` non ci sta.
   * Serve a non lasciare orfani il titolo di una sezione e la sua
   * intestazione in fondo al foglio, con le righe sulla pagina dopo.
   * Riempie lo spazio residuo con righe vuote: l'altezza massima di una
   * riga in Excel e' 409 pt, quindi lo spazio si copre a pezzi.
   */
  const nuovaPaginaSeNonCi = (h) => {
    if (y + h <= ALTEZZA_UTILE) return;
    let residuo = ALTEZZA_UTILE - y;
    while (residuo > 0.5) {
      const fetta = Math.min(residuo, 400);
      aoa.push([]);
      righe.push({ hpt: fetta });
      r += 1;
      residuo -= fetta;
    }
    y = 0;
  };

  /**
   * Riga di tabella consapevole del salto pagina: se non ci sta,
   * riparte dalla pagina nuova ristampando l'intestazione.
   */
  const pushConIntestazione = (celle, altezza, intestazione, hIntestazione) => {
    if (y + altezza > ALTEZZA_UTILE) {
      y = 0;
      aoa.push(intestazione);
      righe.push({ hpt: hIntestazione });
      y += hIntestazione;
      r += 1;
    }
    push(celle, altezza);
  };

  /** Unisce da colonna `da` fino a `a` sulla riga appena inserita. */
  const unisci = (da, a) => merges.push({ s: { r: r - 1, c: da }, e: { r: r - 1, c: a } });

  /* ── intestazione ── */
  push([titolo('NOTA DI CARICO — IMPIANTO ANTIZANZARE')], 20);
  unisci(0, ULTIMA_COL);
  push([sottotitolo('OMPRA Srl · San Biagio di Callalta (TV)')], 12);
  unisci(0, ULTIMA_COL);
  vuota();

  /* Testata su due colonne logiche: etichetta in A, valore in B:C,
     seconda etichetta in D:E, secondo valore in F:G */
  const testata = (et1, v1, et2, v2) => {
    push([etichetta(et1), testo(v1), null, etichetta(et2), null, testo(v2), null], 14);
    unisci(1, 2);
    unisci(3, 4);
    unisci(5, 6);
  };

  testata('Progetto', progetto.numero || '', 'Data', dataIt());
  testata('Cliente', progetto.cliente_nome || '', 'Tecnico', progetto.tecnico || '_______________');
  testata(
    'Indirizzo',
    progetto.indirizzo || '',
    'Montaggio',
    progetto.data_montaggio ? dataIt(new Date(progetto.data_montaggio)) : '___/___/______'
  );
  if (risultato?.brand) {
    push([etichetta('Impianto'), testo(`${risultato.brand} · ${risultato.macchina?.label || ''}`)], 14);
    unisci(1, ULTIMA_COL);
  }
  vuota();

  /* ── linee ──
     La colonna larga (B) porta la ripartizione per metodo, che e' l'unico
     testo lungo. I numeri stanno nelle colonne strette. */
  if (linee?.length) {
    nuovaPaginaSeNonCi(14 + 24 + H_RIGA_DATI);
    push([sezione('LINEE')], 14);
    push(
      [
        intestazione('Etichetta'),
        intestazione('Montaggio'),
        intestazione('Metri'),
        intestazione('Tronco m'),
        intestazione('Passo'),
        intestazione('Ugelli'),
        null,
      ],
      24
    );
    unisci(5, ULTIMA_COL); // Ugelli occupa le ultime due colonne: niente orfane
    linee.forEach((l, i) => {
      const met = Object.entries(l.metodi || {})
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `${ETICHETTE_METODO[k] || k}: ${v}`)
        .join(' · ');
      push(
        [
          datoTesto(l.etichetta || `Linea ${i + 1}`),
          datoTesto(met),
          datoNum(Number(l.metri) || 0),
          datoNum(Number(l.metriTronco) || 0),
          datoNum(Number(l.passo) || 0),
          datoNum(l.ugelliPrevisti ?? Math.ceil((Number(l.metri) || 0) / (Number(l.passo) || 4))),
          null,
        ],
        H_RIGA_DATI
      );
      unisci(5, ULTIMA_COL);
    });
    vuota();
  }

  /* ── materiali ── */
  const H_INTESTAZIONE = 26;
  const celleIntestazione = () => [
    intestazione('Codice'),
    intestazione('Descrizione'),
    intestazione('U.M.'),
    intestazione('Q.tà prevista'),
    intestazione('Q.tà usata'),
    intestazione('Extra usati'),
    intestazione('Note'),
  ];
  const intestazioneMateriale = () => push(celleIntestazione(), H_INTESTAZIONE);

  nuovaPaginaSeNonCi(14 + H_INTESTAZIONE + H_RIGA_DATI);
  push([sezione('MATERIALE')], 14);
  intestazioneMateriale();

  (bom || []).forEach((b) => {
    // Le descrizioni lunghe vanno a capo: due righe di testo vogliono
    // piu' spazio, altrimenti Excel taglia
    const alta = (b.desc || '').length > 46;
    pushConIntestazione(
      [
        datoTesto(b.code || ''),
        datoTesto(b.desc || ''),
        datoTesto(b.um || 'pz'),
        datoNum(b.q || 0),
        daCompilare(),
        daCompilare(),
        daCompilare(),
      ],
      alta ? H_RIGA_DATI + 8 : H_RIGA_DATI,
      celleIntestazione(),
      H_INTESTAZIONE
    );
  });

  /* ── righe libere per il materiale non previsto ── */
  vuota();
  nuovaPaginaSeNonCi(14 + H_INTESTAZIONE + RIGHE_LIBERE_MIN * H_RIGA_LIBERA + H_FIRMA);
  push([sezione('MATERIALE NON PREVISTO', AMBRA)], 14);
  intestazioneMateriale();

  // Tante righe quante ne stanno, lasciando posto alla firma
  const spazioResiduo = ALTEZZA_UTILE - y - H_FIRMA;
  const quante = Math.min(
    RIGHE_LIBERE_MAX,
    Math.max(RIGHE_LIBERE_MIN, Math.floor(spazioResiduo / H_RIGA_LIBERA))
  );

  for (let i = 0; i < quante; i += 1) {
    pushConIntestazione(
      [daCompilare(), daCompilare(), daCompilare(), daCompilare(), daCompilare(), daCompilare(), daCompilare()],
      H_RIGA_LIBERA,
      celleIntestazione(),
      H_INTESTAZIONE
    );
  }

  /* ── firma ── */
  vuota(10);
  nuovaPaginaSeNonCi(16);
  push([etichetta('Firma del tecnico'), testo('___________________________')], 16);
  unisci(1, 3);

  /* ── foglio ── */
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!cols'] = LARGHEZZE.map((wch) => ({ wch }));
  ws['!rows'] = righe;
  ws['!merges'] = merges;

  // Margini stretti: servono per far stare le sette colonne in A4 verticale
  ws['!margins'] = {
    left: 0.4,
    right: 0.4,
    top: 0.5,
    bottom: 0.5,
    header: 0.2,
    footer: 0.2,
  };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Nota di carico');

  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const nomeCliente = (progetto.cliente_nome || 'progetto')
    .replace(/[^A-Za-z0-9À-ÿ ]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 40);
  const filename = `Nota_carico_${progetto.numero || ''}_${nomeCliente}.xlsx`.replace(/__+/g, '_');

  return { filename, blob };
}

/** Genera il file e lo fa scaricare dal browser. */
export function scaricaNotaCarico(dati) {
  const { filename, blob } = costruisciNotaCarico(dati);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return filename;
}
