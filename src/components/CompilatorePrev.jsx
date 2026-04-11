import { useState, useEffect, useMemo } from 'react';
import useStore, { supabase } from '../store';
import {
  ArrowLeft, Plus, Trash2, FileSpreadsheet, FileText, Save, ShoppingCart, X,
} from 'lucide-react';

// ─── Costanti e utilità ───────────────────────────────────────────────────────
const IVA = 1.22;
const round2 = (n) => Math.round((n || 0) * 100) / 100;
// Arrotonda prezzo vendita all'euro superiore, senza mai eccedere il listino
const arrotonda = (v, l) => {
  if (!v) return v;
  const ceil = Math.ceil(v);
  return l ? Math.min(ceil, l) : ceil;
};
const fmt = (n) =>
  new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);
const nuovaRiga = () => ({
  id: `r-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  descrizione: '',
  qty: 1,
  listino_ic: '',
  scontato_ic: '',
});

// ─── PDF ──────────────────────────────────────────────────────────────────────
async function generaPDF({ righe, cliente, indirizzo, citta, data, titolo, pagamento, garanzia, note }) {
  if (!window.jspdf) {
    await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const M = 14;
  let y = 14;

  // Intestazione OMPRA (sinistra)
  doc.setFontSize(11); doc.setFont('helvetica', 'bold');
  doc.text('OMPRA srl', M, y); y += 5;
  doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  doc.text('Via Roncade, 7 Nerbon \u2013 31048 S.Biagio di Callalta (TV)', M, y); y += 4;
  doc.text('Tel: +39-0422-892426  Fax: +39-0422-793042', M, y); y += 4;
  doc.text('http://www.ompra.it  \u2013  E-MAIL: info@ompra.it', M, y);

  // Cliente (destra)
  const xC = W - M - 65;
  doc.setFontSize(9);
  doc.text('Spett.le', xC, 14);
  if (cliente) {
    doc.setFont('helvetica', 'bold');
    doc.text(cliente, xC, 19);
    doc.setFont('helvetica', 'normal');
  }
  if (indirizzo) doc.text(indirizzo, xC, 24);
  if (citta) doc.text(citta, xC, 29);

  y = 40;
  const dStr = data
    ? new Date(data + 'T12:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('it-IT');
  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  doc.text('Nerbon, ' + dStr, M, y); y += 8;

  // Titolo preventivo
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
  doc.text(titolo || 'PREVENTIVO: ATTREZZATURA STIHL', M, y); y += 3;
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3); doc.line(M, y, W - M, y); y += 6;

  // Intestazione colonne
  const COL = { desc: M, nr: M + 103, imp: M + 126, lic: M + 149, sic: M + 166, sie: W - M };
  doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(80, 80, 80);
  doc.text('DESCRIZIONE', COL.desc, y);
  doc.text('NR', COL.nr, y, { align: 'right' });
  doc.text('IMPORTO', COL.imp, y, { align: 'right' });
  doc.text('LISTINO I.C.', COL.lic, y, { align: 'right' });
  doc.text('SC. I.C.', COL.sic, y, { align: 'right' });
  doc.text('SC. I.E.', COL.sie, y, { align: 'right' });
  y += 2;
  doc.setDrawColor(100, 100, 100); doc.setLineWidth(0.25); doc.line(M, y, W - M, y); y += 3;

  // Righe prodotti
  doc.setTextColor(0, 0, 0); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
  const righeValide = righe.filter(r => r.descrizione || r.scontato_ic);
  for (const riga of righeValide) {
    const sie = round2((+riga.scontato_ic || 0) / IVA);
    const imp = round2(sie * (+riga.qty || 1));
    if (y > 245) { doc.addPage(); y = 20; }
    const lines = doc.splitTextToSize(riga.descrizione || '', 96);
    doc.text(lines, COL.desc, y);
    doc.text(String(+riga.qty || 1), COL.nr, y, { align: 'right' });
    if (imp) doc.text(fmt(imp), COL.imp, y, { align: 'right' });
    if (riga.listino_ic) doc.text(fmt(+riga.listino_ic), COL.lic, y, { align: 'right' });
    if (riga.scontato_ic) doc.text(fmt(+riga.scontato_ic), COL.sic, y, { align: 'right' });
    if (sie) doc.text(fmt(sie), COL.sie, y, { align: 'right' });
    y += lines.length * 4.3 + 1.5;
    doc.setDrawColor(220, 220, 220); doc.setLineWidth(0.1); doc.line(M, y, W - M, y); y += 2;
  }

  // Totali
  const totImp = righeValide.reduce(
    (a, r) => a + round2(round2((+r.scontato_ic || 0) / IVA) * (+r.qty || 1)),
    0
  );
  const ivaAmt = round2(totImp * 0.22);
  const totIC = round2(totImp + ivaAmt);

  y += 2;
  doc.setDrawColor(0); doc.setLineWidth(0.35); doc.line(M + 55, y, W - M, y); y += 4;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
  doc.text('TOTALE IMPONIBILE', M + 57, y);
  doc.text(fmt(totImp), W - M, y, { align: 'right' }); y += 5;
  doc.setFont('helvetica', 'normal');
  doc.text('+I.V.A. del 22%', M + 57, y);
  doc.text(fmt(ivaAmt), W - M, y, { align: 'right' }); y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('TOTALE PREVENTIVO IVA COMPRESA', M + 57, y);
  doc.text(fmt(totIC), W - M, y, { align: 'right' }); y += 10;

  // Condizioni
  doc.setFontSize(8); doc.setFont('helvetica', 'bold');
  doc.text('CONDIZIONI DI FORNITURA:', M, y); y += 5;
  doc.setFont('helvetica', 'normal');
  doc.text('Validit\u00e0 offerta: 30 giorni', M, y); y += 4;
  if (pagamento) { doc.text('Pagamento: ' + pagamento, M, y); y += 4; }
  doc.text('Garanzia: ' + (garanzia || '12 mesi'), M, y); y += 4;
  if (note) {
    const nl = doc.splitTextToSize(note, W - M * 2);
    doc.text(nl, M, y); y += nl.length * 4 + 2;
  }
  y += 8;
  doc.setFontSize(8.5);
  doc.text(
    "Per qualsiasi ulteriore chiarimento, non esitate a contattarci. Cordiali saluti.",
    M, y
  ); y += 14;
  doc.text('OMPRA Srl', W / 2 + 25, y); y += 5;
  doc.text('Agr. Simone Taffarello', W / 2 + 14, y);

  // Footer
  y = Math.max(y + 20, 276);
  doc.setDrawColor(180, 180, 180); doc.setLineWidth(0.2); doc.line(M, y, W - M, y); y += 3;
  doc.setFont('helvetica', 'italic'); doc.setFontSize(7); doc.setTextColor(140, 140, 140);
  doc.text(
    'OMPRA Srl \u2013 Via Roncade, 7 Nerbon \u2013 31048 S.Biagio di Callalta (TV)',
    W / 2, y, { align: 'center' }
  );

  const blob = doc.output('blob');
  window.open(URL.createObjectURL(blob), '_blank');
}

// ─── Excel ────────────────────────────────────────────────────────────────────
// Converte indice colonna (0-based) in lettera Excel
function colLetter(n) {
  let s = '';
  n += 1;
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

async function esportaExcel({ righe, cliente, indirizzo, citta, data, titolo, pagamento, garanzia }) {
  if (!window.XLSX) {
    await import('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
  }
  const XLSX = window.XLSX;

  const righeValide = righe.filter(r => r.descrizione || r.scontato_ic);
  const totImp = righeValide.reduce(
    (a, r) => a + round2(round2((+r.scontato_ic || 0) / IVA) * (+r.qty || 1)), 0
  );
  const ivaAmt = round2(totImp * 0.22);
  const totIC  = round2(totImp + ivaAmt);
  const dStr = data
    ? new Date(data + 'T12:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('it-IT');

  // Costruzione foglio cella per cella
  const ws = {};
  const set = (row, col, v) => {
    const addr = colLetter(col) + row;
    ws[addr] = typeof v === 'number' ? { v, t: 'n', z: '#,##0.00' } : { v: v || '', t: 's' };
  };

  // Intestazione OMPRA
  set(5, 0, '     Tel: +39-0422-892426 r.a. \u2013 fax: +39-0422-793042');
  set(5, 1, 'Spett.le');
  set(6, 0, '       http//www.ompra.it  \u2013  E-MAIL:  info@ompra.it');
  set(6, 1, cliente || '');
  set(7, 1, indirizzo || '');
  set(8, 1, citta || '');
  set(11, 0, 'Nerbon, ' + dStr);
  set(13, 0, titolo || 'PREVENTIVO: ATTREZZATURA STIHL');
  set(15, 0, 'DESCRIZIONE');
  set(15, 1, '  NR ');
  set(15, 3, 'IMPORTO');
  set(15, 5, 'LISTINO I.C.');
  set(15, 6, 'SCONTATO I.C.');
  set(15, 7, 'SCONTATO I.E.');

  // Righe prodotti
  let r = 17;
  for (const riga of righeValide) {
    const sie = round2((+riga.scontato_ic || 0) / IVA);
    const imp = round2(sie * (+riga.qty || 1));
    set(r, 0, riga.descrizione || '');
    set(r, 1, +riga.qty || 1);
    if ((+riga.qty || 1) > 1) set(r, 2, sie);
    if (imp) set(r, 3, imp);
    if (+riga.listino_ic) set(r, 5, +riga.listino_ic);
    if (+riga.scontato_ic) set(r, 6, +riga.scontato_ic);
    if (sie) set(r, 7, sie);
    r++;
  }

  r++;
  set(r,   0, 'TOTALE IMPONIBILE');      set(r,   3, totImp);
  set(r+1, 0, '+I.V.A. del 22%');        set(r+1, 3, ivaAmt);
  set(r+2, 0, 'TOTALE PREVENTIVO IVA COMPRESA'); set(r+2, 3, totIC);
  r += 4;

  set(r,   0, 'CONDIZIONI DI FORNITURA:'); r++;
  set(r,   0, 'Validit\u00e0 offerta: 30 giorni'); r++;
  set(r,   0, 'Pagamento: ' + (pagamento || '')); r++;
  set(r,   0, 'Garanzia: ' + (garanzia || '12 mesi')); r += 2;
  set(r,   0, 'Per qualsiasi ulteriore chiarimento, non esitate a contattarci. Cordiali saluti.'); r += 2;
  set(r,   2, 'OMPRA Srl'); r += 2;
  set(r,   2, 'Agr. Simone Taffarello'); r += 15;
  set(r,   0, '    OMPRA  Srl    \u2013    Via Roncade, 7 Nerbon   \u2013   31048   S.Biagio di Callalta   (TV)');

  ws['!ref'] = 'A1:' + colLetter(7) + r;
  ws['!cols'] = [
    { wch: 74 }, { wch: 6 }, { wch: 13 }, { wch: 14 },
    { wch: 3 },  { wch: 14 }, { wch: 14 }, { wch: 14 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Preventivo');
  const nomeFile = 'Preventivo_' + (cliente || 'OMPRA').replace(/\s+/g, '_') + '_' + (data || new Date().toISOString().slice(0, 10)) + '.xlsx';
  XLSX.writeFile(wb, nomeFile);
}


// ─── Componente principale ────────────────────────────────────────────────────
export default function CompilatorePrev({ onNavigate }) {
  const preventivoCarrello = useStore(s => s.preventivoCarrello);
  const clearCarrello      = useStore(s => s.clearCarrello);

  const [righe, setRighe]       = useState([nuovaRiga()]);
  const [importato, setImportato] = useState(false);
  const [cliente, setCliente]   = useState('');
  const [indirizzo, setIndirizzo] = useState('');
  const [citta, setCitta]       = useState('');
  const [data, setData]         = useState(new Date().toISOString().slice(0, 10));
  const [titolo, setTitolo]     = useState('PREVENTIVO: ATTREZZATURA STIHL');
  const [pagamento, setPagamento] = useState('');
  const [garanzia, setGaranzia] = useState('12 mesi');
  const [note, setNote]         = useState('');
  const [saving, setSaving]     = useState(false);
  const [exporting, setExporting] = useState(null); // 'pdf' | 'excel' | null

  // Importa articoli dal carrello al primo render
  useEffect(() => {
    if (!importato) {
      if (preventivoCarrello.length > 0) {
        setRighe(preventivoCarrello.map(item => ({
          id: 'r-' + item.id + '-' + Date.now(),
          descrizione: item.descrizione || item.modello || '',
          qty: item.qty || 1,
          listino_ic: item.prezzo_listino || '',
          scontato_ic: item.prezzo_vendita
            ? arrotonda(item.prezzo_vendita, item.prezzo_listino)
            : '',
        })));
      }
      setImportato(true);
    }
  }, []); // eslint-disable-line

  // Totali calcolati
  const totImp = useMemo(
    () => righe.reduce((a, r) => a + round2(round2((+r.scontato_ic || 0) / IVA) * (+r.qty || 1)), 0),
    [righe]
  );
  const ivaAmt = useMemo(() => round2(totImp * 0.22), [totImp]);
  const totIC  = useMemo(() => round2(totImp + ivaAmt), [totImp, ivaAmt]);

  // Gestione righe
  const aggiungiRiga = () => setRighe(r => [...r, nuovaRiga()]);
  const rimuoviRiga  = (id) => setRighe(r => r.length > 1 ? r.filter(x => x.id !== id) : r);
  const aggiorna     = (id, campo, valore) =>
    setRighe(r => r.map(x => x.id === id ? { ...x, [campo]: valore } : x));

  const svuotaCarrello = () => {
    clearCarrello();
    setRighe([nuovaRiga()]);
    setImportato(false);
  };

  // Export
  const handlePDF = async () => {
    setExporting('pdf');
    try {
      await generaPDF({ righe, cliente, indirizzo, citta, data, titolo, pagamento, garanzia, note });
    } catch (e) {
      alert('Errore PDF: ' + e.message);
    } finally {
      setExporting(null);
    }
  };

  const handleExcel = async () => {
    setExporting('excel');
    try {
      await esportaExcel({ righe, cliente, indirizzo, citta, data, titolo, pagamento, garanzia });
    } catch (e) {
      alert('Errore Excel: ' + e.message);
    } finally {
      setExporting(null);
    }
  };

  const handleSalva = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('preventivi_catalogo').insert({
        cliente,
        righe: righe.filter(r => r.descrizione || r.scontato_ic),
        totale_imponibile: totImp,
        totale_ic: totIC,
        data_preventivo: data,
        titolo,
        pagamento,
        garanzia,
        note,
      });
      if (error) throw error;
      alert('Preventivo salvato!');
    } catch (e) {
      alert('Errore salvataggio: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  // Stili riutilizzati
  const IC = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400';
  const LC = 'block text-xs font-semibold text-gray-500 mb-1';
  const righeValide = righe.filter(r => r.descrizione || r.scontato_ic).length;

  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      {/* ── Header sticky ── */}
      <div className="sticky top-0 z-10 bg-white shadow-sm px-4 py-3 flex items-center gap-3">
        <button onClick={() => onNavigate('home')} className="p-1.5 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-gray-800 leading-tight">COMPILATORE PREVENTIVI</h1>
          <p className="text-xs text-gray-400 tabular-nums">
            {righeValide} {righeValide === 1 ? 'riga' : 'righe'} · Totale {fmt(totIC)} €
          </p>
        </div>
        {preventivoCarrello.length > 0 && (
          <button
            onClick={svuotaCarrello}
            className="flex items-center gap-1.5 bg-orange-100 text-orange-600 rounded-full px-2.5 py-1 text-xs font-bold shrink-0"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {preventivoCarrello.length}
            <X className="w-3 h-3 opacity-60" />
          </button>
        )}
      </div>

      <div className="max-w-xl mx-auto px-4 pt-4 space-y-4">

        {/* ── Cliente ── */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Cliente</p>
          <div>
            <label className={LC}>Nome / Ragione sociale</label>
            <input
              className={IC}
              value={cliente}
              onChange={e => setCliente(e.target.value)}
              placeholder="Es. Rossi Mario"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={LC}>Indirizzo</label>
              <input
                className={IC}
                value={indirizzo}
                onChange={e => setIndirizzo(e.target.value)}
                placeholder="Via..."
              />
            </div>
            <div>
              <label className={LC}>Citt\u00e0</label>
              <input
                className={IC}
                value={citta}
                onChange={e => setCitta(e.target.value)}
                placeholder="Treviso"
              />
            </div>
          </div>
        </div>

        {/* ── Preventivo ── */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Preventivo</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={LC}>Data</label>
              <input type="date" className={IC} value={data} onChange={e => setData(e.target.value)} />
            </div>
            <div>
              <label className={LC}>Garanzia</label>
              <input
                className={IC}
                value={garanzia}
                onChange={e => setGaranzia(e.target.value)}
                placeholder="12 mesi"
              />
            </div>
          </div>
          <div>
            <label className={LC}>Titolo preventivo</label>
            <input className={IC} value={titolo} onChange={e => setTitolo(e.target.value)} />
          </div>
          <div>
            <label className={LC}>Pagamento</label>
            <input
              className={IC}
              value={pagamento}
              onChange={e => setPagamento(e.target.value)}
              placeholder="Es. Bonifico 30gg, Contanti, Finanziamento..."
            />
          </div>
        </div>

        {/* ── Righe prodotti ── */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Prodotti</p>
            <span className="text-xs text-gray-400">
              {righe.length} {righe.length === 1 ? 'riga' : 'righe'}
            </span>
          </div>

          {/* Header colonne */}
          <div
            className="grid px-3 py-1.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400"
            style={{ gridTemplateColumns: '1fr 40px 76px 76px 28px' }}
          >
            <span>Descrizione</span>
            <span className="text-center">Nr</span>
            <span className="text-right">Listino IC</span>
            <span className="text-right">Scont. IC</span>
            <span />
          </div>

          {/* Righe */}
          <div className="divide-y divide-gray-50">
            {righe.map((riga) => {
              const sie = round2((+riga.scontato_ic || 0) / IVA);
              const imp = round2(sie * (+riga.qty || 1));
              return (
                <div key={riga.id} className="px-3 py-2.5 space-y-1.5">
                  <textarea
                    className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-orange-400 leading-snug"
                    rows={2}
                    value={riga.descrizione}
                    onChange={e => aggiorna(riga.id, 'descrizione', e.target.value)}
                    placeholder="Descrizione prodotto..."
                  />
                  <div
                    className="grid gap-1.5 items-center"
                    style={{ gridTemplateColumns: '1fr 40px 76px 76px 28px' }}
                  >
                    {/* Info calcolata (I.E. e importo) */}
                    <div className="text-xs text-gray-400 leading-tight tabular-nums">
                      {!!riga.scontato_ic && (
                        <span>
                          I.E. {fmt(sie)}
                          {(+riga.qty || 1) > 1 && (
                            <span className="ml-1 text-gray-500 font-medium">
                              &middot; Imp. {fmt(imp)}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    {/* Quantit\u00e0 */}
                    <input
                      type="number"
                      min="1"
                      className="border border-gray-200 rounded px-1 py-1.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-orange-400"
                      value={riga.qty}
                      onChange={e => aggiorna(riga.id, 'qty', Math.max(1, parseInt(e.target.value) || 1))}
                    />
                    {/* Listino IC */}
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="border border-gray-200 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-orange-400"
                      value={riga.listino_ic}
                      onChange={e => aggiorna(riga.id, 'listino_ic', e.target.value)}
                      placeholder="0,00"
                    />
                    {/* Scontato IC */}
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="border border-gray-200 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-orange-400"
                      value={riga.scontato_ic}
                      onChange={e => aggiorna(riga.id, 'scontato_ic', e.target.value)}
                      placeholder="0,00"
                    />
                    {/* Elimina */}
                    <button
                      onClick={() => rimuoviRiga(riga.id)}
                      className="flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Aggiungi riga */}
          <div className="px-3 py-2.5 border-t border-gray-100">
            <button
              onClick={aggiungiRiga}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 text-sm hover:border-orange-300 hover:text-orange-400 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Aggiungi riga manuale
            </button>
          </div>
        </div>

        {/* ── Totali ── */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Totale imponibile</span>
            <span className="font-semibold tabular-nums">{fmt(totImp)} &euro;</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">+ IVA 22%</span>
            <span className="font-semibold tabular-nums">{fmt(ivaAmt)} &euro;</span>
          </div>
          <div className="flex justify-between items-center text-base font-bold border-t border-gray-100 pt-2.5">
            <span>Totale IVA compresa</span>
            <span className="text-orange-600 tabular-nums text-lg">{fmt(totIC)} &euro;</span>
          </div>
        </div>

        {/* ── Note ── */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className={LC}>Note / condizioni aggiuntive</label>
          <textarea
            className={IC + ' resize-none'}
            rows={3}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Note speciali, condizioni di fornitura aggiuntive..."
          />
        </div>

        {/* ── Azioni ── */}
        <div className="grid grid-cols-3 gap-2 pb-6">
          <button
            onClick={handlePDF}
            disabled={!!exporting}
            className="flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-xl bg-white shadow-sm border-2 border-gray-200 text-gray-600 font-semibold text-xs active:scale-95 transition-transform disabled:opacity-50"
          >
            <FileText className="w-5 h-5" />
            {exporting === 'pdf' ? '...' : 'PDF'}
          </button>
          <button
            onClick={handleExcel}
            disabled={!!exporting}
            className="flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-xl bg-white shadow-sm border-2 border-green-200 text-green-700 font-semibold text-xs active:scale-95 transition-transform disabled:opacity-50"
          >
            <FileSpreadsheet className="w-5 h-5" />
            {exporting === 'excel' ? '...' : 'Excel'}
          </button>
          <button
            onClick={handleSalva}
            disabled={saving}
            className="flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-xl bg-orange-500 text-white font-semibold text-xs active:scale-95 transition-transform disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? '...' : 'Salva'}
          </button>
        </div>

      </div>
    </div>
  );
}
