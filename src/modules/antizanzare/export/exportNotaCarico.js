/**
 * Nota di carico in Excel — il foglio che il tecnico porta in cantiere.
 *
 * Le colonne "Q.tà usata", "Extra" e "Note" restano vuote: si compilano
 * a mano a fine montaggio. Nessun costo e nessun prezzo: e' un documento
 * operativo, non commerciale.
 */

import * as XLSXns from 'xlsx-js-style';

// xlsx-js-style e' CommonJS: nel bundle del browser la namespace basta,
// sotto Node finisce in .default. Cosi' il modulo e' verificabile da riga
// di comando senza cambiare nulla per l'app.
const XLSX = XLSXns.default ?? XLSXns;

const VERDE = '006B3F';

const ETICHETTE_METODO = {
  m1d: 'T+dritto',
  m1a: 'T+90°',
  m2q: 'in linea',
  m3d: 'riser dritto',
  m3a: 'riser 90°',
};


const bordo = {
  top: { style: 'thin', color: { rgb: 'D0D0D0' } },
  bottom: { style: 'thin', color: { rgb: 'D0D0D0' } },
  left: { style: 'thin', color: { rgb: 'D0D0D0' } },
  right: { style: 'thin', color: { rgb: 'D0D0D0' } },
};

const cella = (v, stile = {}) => ({ v: v ?? '', t: typeof v === 'number' ? 'n' : 's', s: stile });

const titolo = (v) => cella(v, { font: { bold: true, sz: 14, color: { rgb: VERDE } } });
const etichetta = (v) => cella(v, { font: { sz: 9, color: { rgb: '888888' } } });
const testo = (v) => cella(v, { font: { sz: 10 } });

const intestazione = (v) =>
  cella(v, {
    font: { bold: true, sz: 10, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: VERDE } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: bordo,
  });

const datoTesto = (v) => cella(v, { font: { sz: 10 }, border: bordo, alignment: { wrapText: true } });
const datoNum = (v) =>
  cella(v, { font: { sz: 10 }, border: bordo, alignment: { horizontal: 'center' }, numFmt: '0.##' });

/** Casella grigia da compilare a penna in cantiere. */
const daCompilare = () =>
  cella('', { border: bordo, fill: { fgColor: { rgb: 'FAFAFA' } } });

const dataIt = (d = new Date()) => d.toLocaleDateString('it-IT');

/**
 * @param {Object} p
 * @param {Object} p.progetto  testata: numero, cliente_nome, indirizzo, tecnico, data_montaggio
 * @param {Array}  p.bom       righe di distinta dal motore
 * @param {Array}  p.linee     linee con etichetta, metri, passo, ugelli
 * @param {Object} [p.risultato]
 * @returns {{filename:string, blob:Blob}}
 */
export function costruisciNotaCarico({ progetto, bom, linee, risultato }) {
  const aoa = [];
  const merges = [];
  let r = 0;

  const riga = (celle) => {
    aoa.push(celle);
    r += 1;
  };
  const vuota = () => riga([]);

  /* ── intestazione ── */
  riga([titolo('NOTA DI CARICO — IMPIANTO ANTIZANZARE')]);
  merges.push({ s: { r: r - 1, c: 0 }, e: { r: r - 1, c: 6 } });

  riga([cella('OMPRA Srl · San Biagio di Callalta (TV)', { font: { sz: 9, color: { rgb: '888888' } } })]);
  merges.push({ s: { r: r - 1, c: 0 }, e: { r: r - 1, c: 6 } });
  vuota();

  riga([etichetta('Progetto'), testo(progetto.numero || ''), etichetta('Data'), testo(dataIt())]);
  riga([etichetta('Cliente'), testo(progetto.cliente_nome || '')]);
  merges.push({ s: { r: r - 1, c: 1 }, e: { r: r - 1, c: 3 } });

  if (progetto.indirizzo) {
    riga([etichetta('Indirizzo'), testo(progetto.indirizzo)]);
    merges.push({ s: { r: r - 1, c: 1 }, e: { r: r - 1, c: 3 } });
  }
  riga([
    etichetta('Tecnico'),
    testo(progetto.tecnico || '________________'),
    etichetta('Montaggio'),
    testo(progetto.data_montaggio ? dataIt(new Date(progetto.data_montaggio)) : '____/____/______'),
  ]);

  if (risultato?.brand) {
    riga([etichetta('Impianto'), testo(`${risultato.brand} · ${risultato.macchina?.label || ''}`)]);
    merges.push({ s: { r: r - 1, c: 1 }, e: { r: r - 1, c: 3 } });
  }
  vuota();

  /* ── linee ── */
  if (linee?.length) {
    riga([cella('LINEE', { font: { bold: true, sz: 11, color: { rgb: VERDE } } })]);
    riga([
      intestazione('Etichetta'),
      intestazione('Metri'),
      intestazione('Passo'),
      intestazione('Ugelli'),
      intestazione('Montaggio'),
    ]);
    linee.forEach((l, i) => {
      const met = Object.entries(l.metodi || {})
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `${ETICHETTE_METODO[k] || k}: ${v}`)
        .join(' · ');
      riga([
        datoTesto(l.etichetta || `Linea ${i + 1}`),
        datoNum(Number(l.metri) || 0),
        datoNum(Number(l.passo) || 0),
        datoNum(l.ugelliPrevisti ?? Math.ceil((Number(l.metri) || 0) / (Number(l.passo) || 4))),
        datoTesto(met),
      ]);
    });
    vuota();
  }

  /* ── materiali ── */
  riga([cella('MATERIALE', { font: { bold: true, sz: 11, color: { rgb: VERDE } } })]);
  riga([
    intestazione('Codice'),
    intestazione('Descrizione'),
    intestazione('U.M.'),
    intestazione('Q.tà prevista'),
    intestazione('Q.tà usata'),
    intestazione('Extra usati'),
    intestazione('Note'),
  ]);

  const primaRigaMateriale = r;
  (bom || []).forEach((b) => {
    riga([
      datoTesto(b.code || ''),
      datoTesto(b.desc || ''),
      datoTesto(b.um || 'pz'),
      datoNum(b.q || 0),
      daCompilare(),
      daCompilare(),
      daCompilare(),
    ]);
  });

  /* ── righe libere per il materiale non previsto ── */
  vuota();
  riga([cella('MATERIALE NON PREVISTO', { font: { bold: true, sz: 11, color: { rgb: 'B45309' } } })]);
  riga([
    intestazione('Codice'),
    intestazione('Descrizione'),
    intestazione('U.M.'),
    intestazione('Q.tà prevista'),
    intestazione('Q.tà usata'),
    intestazione('Extra usati'),
    intestazione('Note'),
  ]);
  for (let i = 0; i < 8; i += 1) {
    riga([daCompilare(), daCompilare(), daCompilare(), daCompilare(), daCompilare(), daCompilare(), daCompilare()]);
  }

  /* ── firma ── */
  vuota();
  riga([etichetta('Firma del tecnico'), testo('_______________________________')]);
  merges.push({ s: { r: r - 1, c: 1 }, e: { r: r - 1, c: 3 } });

  /* ── foglio ── */
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!cols'] = [
    { wch: 16 }, // codice
    { wch: 48 }, // descrizione
    { wch: 7 }, // um
    { wch: 13 }, // prevista
    { wch: 12 }, // usata
    { wch: 12 }, // extra
    { wch: 26 }, // note
  ];
  ws['!merges'] = merges;
  ws['!freeze'] = { xSplit: 0, ySplit: primaRigaMateriale };
  ws['!rows'] = aoa.map(() => ({ hpt: 18 }));

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
