import * as XLSX from 'xlsx-js-style';

// Layout in stile foglio storico "VENDITE 2025".
// Colonna A = progressivo non nullo su ogni riga dati: senza, SheetJS sfalsa
// gli indici di sheet_to_json al reimport (vedi convenzioni progetto).

const C = {
  hdrBg:    '166534', // green-800 — coordinato con riga totali
  totBg:    '166534', // green-800
  stripeBg: 'F0FDF4', // green-50
  white:    'FFFFFF',
  text:     '111827', // gray-900
};

const border = () => ({
  top:    { style: 'thin', color: { rgb: 'E5E7EB' } },
  bottom: { style: 'thin', color: { rgb: 'E5E7EB' } },
  left:   { style: 'thin', color: { rgb: 'E5E7EB' } },
  right:  { style: 'thin', color: { rgb: 'E5E7EB' } },
});

const hdrStyle = (align = 'center') => ({
  font:      { bold: true, color: { rgb: C.white }, sz: 10 },
  fill:      { fgColor: { rgb: C.hdrBg }, patternType: 'solid' },
  alignment: { horizontal: align, vertical: 'center', wrapText: true },
  border:    border(),
});

const dataStyle = (isEven, isNum, isCtr = false) => ({
  font:      { sz: 10, color: { rgb: C.text } },
  fill:      { fgColor: { rgb: isEven ? C.white : C.stripeBg }, patternType: 'solid' },
  alignment: { horizontal: isNum ? 'right' : isCtr ? 'center' : 'left', vertical: 'center' },
  border:    border(),
  numFmt:    isNum ? '#,##0.00' : undefined,
});

const totStyle = (isNum, isCtr = false) => ({
  font:      { bold: true, color: { rgb: C.white }, sz: 10 },
  fill:      { fgColor: { rgb: C.totBg }, patternType: 'solid' },
  alignment: { horizontal: isNum ? 'right' : isCtr ? 'center' : 'left', vertical: 'center' },
  border:    { top: { style: 'thin', color: { rgb: C.white } }, bottom: { style: 'thin', color: { rgb: C.white } }, left: { style: 'thin', color: { rgb: C.white } }, right: { style: 'thin', color: { rgb: C.white } } },
  numFmt:    isNum ? '#,##0.00' : undefined,
});

// Converte YYYY-MM-DD (o ISO timestamp) → GG/MM/AAAA senza problemi di timezone
function fmtData(iso) {
  if (!iso) return '';
  const parts = String(iso).slice(0, 10).split('-');
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : String(iso);
}

const NUM_COLS = new Set([4, 5, 6, 7, 8, 9, 10]);

export function exportBudgetXlsx(righe, periodoLabel) {
  const headers = [
    '#', 'DATA', 'CLIENTE', 'DESCRIZIONE',
    'IMPORTO IVATO', 'IMPONIBILE',
    'IMP. MACCHINE', 'IMP. GEOGREEN', 'IMP. ANTIZANZARE', 'IMP. CONSULENZA',
    'TOTALE',
  ];

  const tot = righe.reduce((acc, r) => ({
    importo_ivato:   acc.importo_ivato   + (r.importo_ivato    || 0),
    imponibile:      acc.imponibile      + (r.imponibile_totale || 0),
    imp_macchine:    acc.imp_macchine    + (r.imp_macchine      || 0),
    imp_geogreen:    acc.imp_geogreen    + (r.imp_geogreen      || 0),
    imp_antizanzare: acc.imp_antizanzare + (r.imp_antizanzare   || 0),
    imp_consulenza:  acc.imp_consulenza  + (r.imp_consulenza    || 0),
  }), { importo_ivato: 0, imponibile: 0, imp_macchine: 0, imp_geogreen: 0, imp_antizanzare: 0, imp_consulenza: 0 });

  const dataRows = righe.map((r, i) => [
    i + 1,
    fmtData(r.data),
    r.cliente,
    r.descrizione,
    r.importo_ivato    || 0,
    r.imponibile_totale || 0,
    r.imp_macchine     || 0,
    r.imp_geogreen     || 0,
    r.imp_antizanzare  || 0,
    r.imp_consulenza   || 0,
    r.imponibile_totale || 0,
  ]);

  const totRow = [
    '', `TOTALE (${righe.length})`, '', '',
    tot.importo_ivato, tot.imponibile,
    tot.imp_macchine, tot.imp_geogreen, tot.imp_antizanzare, tot.imp_consulenza,
    tot.imponibile,
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, ...dataRows, totRow]);

  // Header row (r=0)
  headers.forEach((_, c) => {
    const addr = XLSX.utils.encode_cell({ r: 0, c });
    if (ws[addr]) ws[addr].s = hdrStyle(NUM_COLS.has(c) ? 'center' : c <= 1 ? 'center' : 'left');
  });

  // Data rows
  dataRows.forEach((_, ri) => {
    headers.forEach((__, c) => {
      const addr = XLSX.utils.encode_cell({ r: ri + 1, c });
      if (!ws[addr]) return;
      ws[addr].s = dataStyle(ri % 2 === 0, NUM_COLS.has(c), c === 0);
      if (NUM_COLS.has(c)) ws[addr].t = 'n';
    });
  });

  // Totals row
  const totR = dataRows.length + 1;
  totRow.forEach((_, c) => {
    const addr = XLSX.utils.encode_cell({ r: totR, c });
    if (!ws[addr]) return;
    ws[addr].s = totStyle(NUM_COLS.has(c), c === 1);
    if (NUM_COLS.has(c)) ws[addr].t = 'n';
  });

  // Colonne numeriche dimensionate sul contenuto (es. "10.000,00" = ~10 car),
  // non sull'intestazione; wrapText sull'header compensa.
  ws['!cols'] = [
    { wch: 4  }, // #
    { wch: 11 }, // DATA  (GG/MM/AAAA)
    { wch: 22 }, // CLIENTE
    { wch: 28 }, // DESCRIZIONE
    { wch: 11 }, // IMPORTO IVATO
    { wch: 11 }, // IMPONIBILE
    { wch: 11 }, // IMP. MACCHINE
    { wch: 11 }, // IMP. GEOGREEN
    { wch: 11 }, // IMP. ANTIZANZARE
    { wch: 11 }, // IMP. CONSULENZA
    { wch: 11 }, // TOTALE
  ];

  // Altezza header: doppia per testo a capo sulle intestazioni corte
  ws['!rows'] = [{ hpt: 30 }];

  // Stampa: orizzontale, A4, tutte le colonne in una sola facciata, margini stretti
  ws['!pageSetup'] = {
    orientation: 'landscape',
    paperSize:   9,   // A4
    fitToPage:   true,
    fitToWidth:  1,
    fitToHeight: 0,   // righe su più pagine se necessario
  };
  ws['!margins'] = { left: 0.25, right: 0.25, top: 0.4, bottom: 0.4, header: 0.2, footer: 0.2 };

  const sheetName = `Budget ${periodoLabel}`.slice(0, 31);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `BUDGET_${periodoLabel}.xlsx`);
}
