import * as XLSX from 'xlsx';

// Layout in stile foglio storico "VENDITE 2025".
// Colonna A = progressivo non nullo su ogni riga dati: senza, SheetJS sfalsa
// gli indici di sheet_to_json al reimport (vedi convenzioni progetto).
export function exportBudgetXlsx(righe, periodoLabel) {
  const dati = [
    ['#', 'DATA', 'CLIENTE', 'DESCRIZIONE', 'IMPORTO IVATO', 'IMPONIBILE',
      'TOT. IMP. MACCHINE', 'TOT. IMP. GEOGREEN', 'TOT. IMP. ANTIZANZARE', 'TOT. IMP. CONSULENZA', 'TOTALE'],
    ...righe.map((r, i) => [
      i + 1,
      r.data,
      r.cliente,
      r.descrizione,
      r.importo_ivato,
      r.imponibile_totale,
      r.imp_macchine || 0,
      r.imp_geogreen || 0,
      r.imp_antizanzare || 0,
      r.imp_consulenza || 0,
      r.imponibile_totale,
    ]),
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(dati);

  ws['!cols'] = [
    { wch: 5 }, { wch: 12 }, { wch: 24 }, { wch: 30 },
    { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 16 },
    { wch: 16 }, { wch: 16 }, { wch: 14 },
  ];

  const sheetName = `Budget ${periodoLabel}`.slice(0, 31);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `BUDGET_${periodoLabel}.xlsx`);
}
