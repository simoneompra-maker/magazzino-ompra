import { useState, useMemo } from 'react';
import { ArrowLeft, Search, Filter, X, ChevronUp, ChevronDown, Download, FileSpreadsheet, Trash2, AlertTriangle, CheckSquare, Square, FileDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import useStore from '../store';

const normalizeSearch = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/[\s\-_\.]/g, '').trim();
};

const getCommBrand = (comm) => {
  if (!comm.prodotti?.length) return comm.accessori?.length ? 'ACCESSORI' : '';
  return comm.prodotti[0].brand || '';
};

const getCommDescription = (comm) => {
  const parts = [];
  (comm.prodotti || []).forEach(p => {
    const modelUp = (p.model || '').toUpperCase();
    const brandUp = (p.brand || '').toUpperCase();
    const needsBrand = p.brand && !modelUp.startsWith(brandUp + ' ');
    const label = needsBrand ? `${p.brand} ${p.model}` : (p.model || '');
    parts.push(p.serialNumber ? `${label} (SN: ${p.serialNumber})` : label);
  });
  (comm.accessori || []).forEach(a => {
    const qta = (a.quantita || 1) > 1 ? ` x${a.quantita}` : '';
    parts.push(`${a.nome}${qta}`);
  });
  return parts.join(' + ');
};

const getCommSerials = (comm) => {
  return (comm.prodotti || []).map(p => p.serialNumber).filter(Boolean).join(', ');
};

const getCommImponibile = (comm) => {
  let imponibile = 0;
  (comm.prodotti || []).forEach(p => {
    const prezzo = p.prezzo || 0;
    const aliquota = p.aliquotaIva || 22;
    imponibile += prezzo / (1 + aliquota / 100);
  });
  (comm.accessori || []).forEach(a => {
    const prezzo = (a.prezzo || 0) * (a.quantita || 1);
    const aliquota = a.aliquotaIva || 22;
    imponibile += prezzo / (1 + aliquota / 100);
  });
  if (imponibile === 0 && comm.totale) imponibile = comm.totale / 1.22;
  return imponibile;
};

export default function StoricoVendite({ onNavigate }) {
  const commissioni = useStore((state) => state.commissioni);
  const brands = useStore((state) => state.brands);
  const deleteCommissione = useStore((state) => state.deleteCommissione);
  const deleteMultipleCommissioni = useStore((state) => state.deleteMultipleCommissioni);
  
  const completedComms = useMemo(() => commissioni.filter(c => c.status === 'completed'), [commissioni]);

  const [filters, setFilters] = useState({ dataFrom: '', dataTo: '', brand: '', modello: '', matricola: '', cliente: '', prezzoFrom: '', prezzoTo: '', operatore: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteMultipleModal, setShowDeleteMultipleModal] = useState(false);

  const operators = useMemo(() => {
    return [...new Set(completedComms.map(c => c.operatore).filter(Boolean))].sort();
  }, [completedComms]);

  const filteredComms = useMemo(() => {
    let result = [...completedComms];
    
    if (filters.dataFrom) {
      const from = new Date(filters.dataFrom);
      result = result.filter(c => new Date(c.completedAt || c.createdAt) >= from);
    }
    if (filters.dataTo) {
      const to = new Date(filters.dataTo); to.setHours(23, 59, 59);
      result = result.filter(c => new Date(c.completedAt || c.createdAt) <= to);
    }
    if (filters.brand) {
      result = result.filter(c => (c.prodotti || []).some(p => p.brand === filters.brand));
    }
    if (filters.modello) {
      const term = normalizeSearch(filters.modello);
      result = result.filter(c => normalizeSearch(getCommDescription(c)).includes(term));
    }
    if (filters.matricola) {
      const term = normalizeSearch(filters.matricola);
      result = result.filter(c => normalizeSearch(getCommSerials(c)).includes(term));
    }
    if (filters.cliente) {
      const term = filters.cliente.toLowerCase().trim();
      result = result.filter(c => c.cliente?.toLowerCase().includes(term));
    }
    if (filters.prezzoFrom) result = result.filter(c => (c.totale || 0) >= parseFloat(filters.prezzoFrom));
    if (filters.prezzoTo) result = result.filter(c => (c.totale || 0) <= parseFloat(filters.prezzoTo));
    if (filters.operatore) result = result.filter(c => c.operatore === filters.operatore);
    
    result.sort((a, b) => {
      let valA, valB;
      if (sortField === 'date') { valA = new Date(a.completedAt || a.createdAt); valB = new Date(b.completedAt || b.createdAt); }
      else if (sortField === 'totale') { valA = a.totale || 0; valB = b.totale || 0; }
      else if (sortField === 'brand') { valA = getCommBrand(a).toLowerCase(); valB = getCommBrand(b).toLowerCase(); }
      else if (sortField === 'cliente') { valA = (a.cliente || '').toLowerCase(); valB = (b.cliente || '').toLowerCase(); }
      return sortDirection === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
    return result;
  }, [completedComms, filters, sortField, sortDirection]);

  const totaleSales = useMemo(() => filteredComms.reduce((sum, c) => sum + (c.totale || 0), 0), [filteredComms]);
  const totaleImponibile = useMemo(() => filteredComms.reduce((sum, c) => sum + getCommImponibile(c), 0), [filteredComms]);
  const activeFiltersCount = useMemo(() => Object.values(filters).filter(v => v !== '').length, [filters]);

  const resetFilters = () => setFilters({ dataFrom: '', dataTo: '', brand: '', modello: '', matricola: '', cliente: '', prezzoFrom: '', prezzoTo: '', operatore: '' });

  const toggleSort = (field) => {
    if (sortField === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('desc'); }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 inline" /> : <ChevronDown className="w-4 h-4 inline" />;
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm) { await deleteCommissione(deleteConfirm.id); setDeleteConfirm(null); }
  };

  const toggleSelectMode = () => { setSelectMode(!selectMode); setSelectedItems([]); };
  const toggleSelectItem = (id) => setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const selectAll = () => setSelectedItems(selectedItems.length === filteredComms.length ? [] : filteredComms.map(c => c.id));

  const handleDeleteMultiple = async () => {
    if (selectedItems.length > 0) {
      await deleteMultipleCommissioni(selectedItems);
      setSelectedItems([]); setSelectMode(false); setShowDeleteMultipleModal(false);
    }
  };

  // PDF da commissione strutturata
  const generateCommPDF = (comm) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pw = doc.internal.pageSize.getWidth();
    const m = 15;
    let y = 15;

    doc.setDrawColor(0,107,63); doc.setLineWidth(0.5);
    doc.rect(m, y, pw-2*m, 25);
    doc.setTextColor(0,107,63); doc.setFontSize(22); doc.setFont('helvetica','bold');
    doc.text('OMPRA', pw/2, y+10, {align:'center'});
    doc.setFontSize(10); doc.setFont('helvetica','normal'); doc.setTextColor(80,80,80);
    doc.text('Commissione di Vendita', pw/2, y+17, {align:'center'});
    const cd = new Date(comm.completedAt || comm.createdAt);
    doc.text(cd.toLocaleDateString('it-IT',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'}), pw/2, y+22, {align:'center'});
    y += 32;

    if (comm.tipoDocumento === 'fattura') {
      doc.setFillColor(59,130,246); doc.roundedRect(m,y,22,6,1,1,'F');
      doc.setTextColor(255,255,255); doc.setFontSize(7); doc.setFont('helvetica','bold');
      doc.text('FATTURA', m+11, y+4.2, {align:'center'}); y += 9;
    }

    const commAddr = (() => { const i=comm.clienteInfo; if(!i) return null; const p=[]; if(i.indirizzo)p.push(i.indirizzo); if(i.cap||i.localita)p.push(`${i.cap||''} ${i.localita||''}`.trim()); if(i.provincia)p.push(`(${i.provincia})`); return p.length?p.join(' - '):null; })();
    let cLines = 1; if(comm.telefono) cLines++; if(commAddr) cLines++;
    const bH = 12 + (cLines * 5);
    doc.setDrawColor(200,200,200); doc.setLineWidth(0.3); doc.rect(m, y, pw-2*m, bH);
    doc.setFontSize(8); doc.setTextColor(120,120,120); doc.setFont('helvetica','normal');
    doc.text('CLIENTE', m+3, y+5);
    doc.setFontSize(12); doc.setTextColor(0,0,0); doc.setFont('helvetica','bold');
    doc.text(comm.cliente||'N/D', m+3, y+12);
    let cY = y+12;
    if (comm.telefono) { cY+=5; doc.setFontSize(8); doc.setTextColor(80,80,80); doc.setFont('helvetica','normal'); doc.text(`Tel: ${comm.telefono}`, m+3, cY); }
    if (commAddr) { cY+=5; doc.setFontSize(8); doc.setTextColor(80,80,80); doc.setFont('helvetica','normal'); doc.text(commAddr, m+3, cY); }
    if (comm.operatore) {
      doc.setFontSize(8); doc.setTextColor(120,120,120); doc.setFont('helvetica','normal');
      doc.text('OPERATORE', pw-m-35, y+5);
      doc.setFontSize(10); doc.setTextColor(60,60,60); doc.text(comm.operatore, pw-m-35, y+12);
    }
    y += bH + 7;

    const cQ=m, cD=m+14, cU=pw-m-58, cT=pw-m-26, rE=pw-m;

    doc.setFillColor(245,245,245); doc.rect(m,y,pw-2*m,7,'F');
    doc.setDrawColor(200,200,200); doc.setLineWidth(0.3); doc.line(m,y+7,rE,y+7);
    doc.setFontSize(7); doc.setTextColor(100,100,100); doc.setFont('helvetica','bold');
    doc.text('QTÀ',cQ+1,y+5); doc.text('DESCRIZIONE',cD,y+5); doc.text('P.ZO UNIT.',cU,y+5); doc.text('TOTALE',cT,y+5);
    y += 9;

    (comm.prodotti||[]).forEach(p => {
      const hasSN = p.serialNumber && !p.serialNumber.startsWith('NOMAT');
      const rH = hasSN ? 13 : 8;
      doc.setDrawColor(230,230,230); doc.setLineWidth(0.15); doc.line(m,y+rH,rE,y+rH);
      doc.setFontSize(9); doc.setTextColor(60,60,60); doc.setFont('helvetica','normal');
      doc.text('1', cQ+4, y+5, {align:'center'});
      doc.setTextColor(0,0,0); doc.setFont('helvetica','bold');
      const mUp=(p.model||'').toUpperCase(), bUp=(p.brand||'').toUpperCase();
      const nb = p.brand && !mUp.startsWith(bUp+' ');
      const desc = nb ? `${p.brand} ${p.model}` : (p.model||'');
      doc.text(desc.substring(0,60), cD, y+5);
      if (hasSN) { doc.setFontSize(7); doc.setTextColor(100,100,100); doc.setFont('courier','normal'); doc.text(`SN: ${p.serialNumber}`, cD, y+10); }
      const pr = p.prezzo||0;
      if (p.isOmaggio) { doc.setFontSize(8); doc.setTextColor(34,139,34); doc.setFont('helvetica','bold'); doc.text('OMAGGIO',cT,y+5); }
      else if (pr > 0) { doc.setFontSize(9); doc.setTextColor(0,0,0); doc.setFont('helvetica','normal'); doc.text(`€ ${pr.toFixed(2)}`,cU,y+5); doc.setFont('helvetica','bold'); doc.text(`€ ${pr.toFixed(2)}`,cT,y+5); }
      if (p.aliquotaIva && p.aliquotaIva !== 22) { doc.setFontSize(6); doc.setTextColor(100,100,100); doc.text(`IVA ${p.aliquotaIva}%`,cU,y+(hasSN?14:9)); }
      y += rH + 1;
    });

    if (comm.accessori?.length > 0) {
      doc.setFillColor(250,250,250); doc.rect(m,y,pw-2*m,6,'F');
      doc.setFontSize(7); doc.setTextColor(120,120,120); doc.setFont('helvetica','bold');
      doc.text('ACCESSORI', cD, y+4.2); y += 7;
      comm.accessori.forEach(a => {
        const rH=8; doc.setDrawColor(230,230,230); doc.setLineWidth(0.15); doc.line(m,y+rH,rE,y+rH);
        const q=a.quantita||1;
        doc.setFontSize(9); doc.setTextColor(60,60,60); doc.setFont('helvetica','normal');
        doc.text(q.toString(), cQ+4, y+5, {align:'center'});
        doc.setTextColor(0,0,0); doc.setFont('helvetica','normal');
        doc.text((a.nome||'').substring(0,55), cD, y+5);
        const up=a.prezzo||0, tp=up*q;
        if (up>0) { doc.text(`€ ${up.toFixed(2)}`,cU,y+5); doc.setFont('helvetica','bold'); doc.text(`€ ${tp.toFixed(2)}`,cT,y+5); }
        y += rH + 1;
      });
    }

    y += 5;
    doc.setDrawColor(0,107,63); doc.setLineWidth(0.8); doc.line(m,y,rE,y); y+=5;
    doc.setFontSize(14); doc.setTextColor(0,107,63); doc.setFont('helvetica','bold');
    doc.text('TOTALE', m+3, y+2); doc.text(`€ ${(comm.totale||0).toFixed(2)}`, rE-3, y+2, {align:'right'}); y+=8;

    if (comm.caparra && comm.caparra > 0) {
      doc.setFontSize(10); doc.setTextColor(80,80,80); doc.setFont('helvetica','normal');
      const met = comm.metodoPagamento==='contanti'?'Contanti':comm.metodoPagamento==='carta'?'Carta':comm.metodoPagamento==='bonifico'?'Bonifico':'';
      doc.text(`Caparra: € ${comm.caparra.toFixed(2)}${met?' ('+met+')':''}`, m+3, y); y+=5;
      doc.setFont('helvetica','bold'); doc.text(`Da saldare: € ${(comm.totale-comm.caparra).toFixed(2)}`, m+3, y); y+=8;
    }
    if (comm.note) { doc.setFontSize(9); doc.setTextColor(80,80,80); doc.setFont('helvetica','italic'); doc.text(`Note: ${comm.note}`, m+3, y); }

    doc.save(`OMPRA_${comm.cliente?.replace(/\s+/g,'_')}_${cd.toLocaleDateString('it-IT').replace(/\//g,'-')}.pdf`);
  };

  // EXPORT
  const exportCSV = () => {
    const headers = ['Data','Ora','Brand','Descrizione','Matricole','Cliente','Telefono','Prezzo','Imponibile','Caparra','Note','Tipo Doc','Operatore'];
    const rows = filteredComms.map(c => {
      const d = new Date(c.completedAt||c.createdAt);
      return [d.toLocaleDateString('it-IT'),d.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'}),getCommBrand(c),getCommDescription(c),getCommSerials(c),c.cliente||'',c.telefono||'',(c.totale||0).toFixed(2),getCommImponibile(c).toFixed(2),c.caparra?c.caparra.toFixed(2):'',c.note||'',c.tipoDocumento||'scontrino',c.operatore||''];
    });
    rows.push([]); rows.push(['','','','','','','TOTALE:',totaleSales.toFixed(2),totaleImponibile.toFixed(2),'','','','']);
    const csv = [headers,...rows].map(r=>r.map(c=>`"${c}"`).join(';')).join('\n');
    downloadFile(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'}), `vendite_ompra_${fmtDate()}.csv`);
    setShowExportMenu(false);
  };

  const exportExcel = () => {
    let h = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"><style>table{border-collapse:collapse}th,td{border:1px solid #000;padding:8px}th{background-color:#006B3F;color:white;font-weight:bold}.totale{font-weight:bold;background-color:#FFDD00}.prezzo{text-align:right}</style></head><body>`;
    h += `<h2>OMPRA - Storico Vendite</h2><p>Esportato: ${new Date().toLocaleString('it-IT')}</p>`;
    h += `<p>Vendite: ${filteredComms.length} | Totale: € ${totaleSales.toFixed(2)} | Imponibile: € ${totaleImponibile.toFixed(2)}</p>`;
    h += '<table><thead><tr><th>Data</th><th>Ora</th><th>Brand</th><th>Descrizione</th><th>Matricole</th><th>Cliente</th><th>Telefono</th><th>Prezzo €</th><th>Imponibile €</th><th>Caparra €</th><th>Note</th><th>Tipo Doc</th><th>Operatore</th></tr></thead><tbody>';
    filteredComms.forEach(c => {
      const d = new Date(c.completedAt||c.createdAt);
      h += `<tr><td>${d.toLocaleDateString('it-IT')}</td><td>${d.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})}</td><td>${getCommBrand(c)}</td><td>${getCommDescription(c)}</td><td>${getCommSerials(c)}</td><td>${c.cliente||''}</td><td>${c.telefono||''}</td><td class="prezzo">${(c.totale||0).toFixed(2)}</td><td class="prezzo">${getCommImponibile(c).toFixed(2)}</td><td class="prezzo">${c.caparra?c.caparra.toFixed(2):''}</td><td>${c.note||''}</td><td>${c.tipoDocumento||'scontrino'}</td><td>${c.operatore||''}</td></tr>`;
    });
    h += `<tr class="totale"><td colspan="7" style="text-align:right"><strong>TOTALE</strong></td><td class="prezzo"><strong>€ ${totaleSales.toFixed(2)}</strong></td><td class="prezzo"><strong>€ ${totaleImponibile.toFixed(2)}</strong></td><td colspan="4"></td></tr></tbody></table></body></html>`;
    downloadFile(new Blob([h],{type:'application/vnd.ms-excel;charset=utf-8;'}), `vendite_ompra_${fmtDate()}.xls`);
    setShowExportMenu(false);
  };

  const downloadFile = (blob, fn) => { const u=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=u; a.download=fn; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(u); };
  const fmtDate = () => { const n=new Date(); return `${n.getFullYear()}${String(n.getMonth()+1).padStart(2,'0')}${String(n.getDate()).padStart(2,'0')}`; };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="text-white p-4 sticky top-0 z-10" style={{ backgroundColor: '#006B3F' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => onNavigate('home')} className="mr-3"><ArrowLeft className="w-6 h-6" /></button>
            <h1 className="text-xl font-bold">Storico Vendite</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleSelectMode} className={`p-2 rounded-lg ${selectMode ? 'bg-yellow-400 text-green-800' : 'bg-white/20'}`}>
              {selectMode ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
            </button>
            <div className="relative">
              <button onClick={() => setShowExportMenu(!showExportMenu)} className="p-2 rounded-lg bg-white/20"><Download className="w-5 h-5" /></button>
              {showExportMenu && (
                <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl py-2 min-w-[160px] z-20">
                  <button onClick={exportExcel} className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-3">
                    <FileSpreadsheet className="w-5 h-5 text-green-600" /><div><div className="font-medium">Excel (.xls)</div><div className="text-xs text-gray-500">Per Microsoft Excel</div></div>
                  </button>
                  <button onClick={exportCSV} className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-3">
                    <FileSpreadsheet className="w-5 h-5 text-blue-600" /><div><div className="font-medium">CSV</div><div className="text-xs text-gray-500">Universale</div></div>
                  </button>
                </div>
              )}
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="relative p-2 rounded-lg bg-white/20">
              <Filter className="w-5 h-5" />
              {activeFiltersCount > 0 && <span className="absolute -top-1 -right-1 bg-yellow-400 text-green-800 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{activeFiltersCount}</span>}
            </button>
          </div>
        </div>
        <div className="mt-3 flex justify-between text-sm">
          <span>{filteredComms.length} vendite</span>
          <div className="text-right">
            <span className="font-bold">Totale: € {totaleSales.toFixed(2)}</span>
            <span className="block text-xs text-white/70">Imponibile: € {totaleImponibile.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {showExportMenu && <div className="fixed inset-0 z-5" onClick={() => setShowExportMenu(false)} />}

      {/* Filtri */}
      {showFilters && (
        <div className="bg-white border-b shadow-lg p-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold" style={{ color: '#006B3F' }}>Filtri</h3>
            {activeFiltersCount > 0 && <button onClick={resetFilters} className="text-sm text-red-500 flex items-center gap-1"><X className="w-4 h-4" /> Azzera</button>}
          </div>
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">💡 La ricerca ignora spazi e maiuscole</div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-xs text-gray-500">Da</label><input type="date" className="w-full p-2 border rounded-lg text-sm" value={filters.dataFrom} onChange={(e) => setFilters({...filters, dataFrom: e.target.value})} /></div>
            <div><label className="text-xs text-gray-500">A</label><input type="date" className="w-full p-2 border rounded-lg text-sm" value={filters.dataTo} onChange={(e) => setFilters({...filters, dataTo: e.target.value})} /></div>
          </div>
          <div><label className="text-xs text-gray-500">Brand</label>
            <select className="w-full p-2 border rounded-lg text-sm" value={filters.brand} onChange={(e) => setFilters({...filters, brand: e.target.value})}>
              <option value="">Tutti</option>
              {brands.filter(b => b !== 'Altro').map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-xs text-gray-500">Modello</label><input type="text" placeholder="es. MS 261" className="w-full p-2 border rounded-lg text-sm" value={filters.modello} onChange={(e) => setFilters({...filters, modello: e.target.value})} /></div>
            <div><label className="text-xs text-gray-500">Matricola</label><input type="text" placeholder="es. 193545" className="w-full p-2 border rounded-lg text-sm font-mono" value={filters.matricola} onChange={(e) => setFilters({...filters, matricola: e.target.value})} /></div>
          </div>
          <div><label className="text-xs text-gray-500">Cliente</label><input type="text" placeholder="Nome cliente" className="w-full p-2 border rounded-lg text-sm" value={filters.cliente} onChange={(e) => setFilters({...filters, cliente: e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-xs text-gray-500">Prezzo da €</label><input type="number" className="w-full p-2 border rounded-lg text-sm" value={filters.prezzoFrom} onChange={(e) => setFilters({...filters, prezzoFrom: e.target.value})} /></div>
            <div><label className="text-xs text-gray-500">Prezzo a €</label><input type="number" className="w-full p-2 border rounded-lg text-sm" value={filters.prezzoTo} onChange={(e) => setFilters({...filters, prezzoTo: e.target.value})} /></div>
          </div>
          {operators.length > 1 && (
            <div><label className="text-xs text-gray-500">Operatore</label>
              <select className="w-full p-2 border rounded-lg text-sm" value={filters.operatore} onChange={(e) => setFilters({...filters, operatore: e.target.value})}>
                <option value="">Tutti</option>
                {operators.map(op => <option key={op} value={op}>{op}</option>)}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Intestazioni */}
      <div className="bg-gray-100 px-4 py-2 flex text-xs font-semibold text-gray-600 sticky top-[108px] z-5 border-b">
        <button className="flex-none w-16 text-left flex items-center gap-1" onClick={() => toggleSort('date')}>Data <SortIcon field="date" /></button>
        <button className="flex-1 min-w-0 text-left flex items-center gap-1" onClick={() => toggleSort('brand')}>Prodotto <SortIcon field="brand" /></button>
        <button className="flex-1 min-w-0 text-left flex items-center gap-1 pl-2" onClick={() => toggleSort('cliente')}>Cliente <SortIcon field="cliente" /></button>
        <button className="flex-none w-20 text-right flex items-center justify-end gap-1" onClick={() => toggleSort('totale')}>€ <SortIcon field="totale" /></button>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-auto">
        {filteredComms.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>Nessuna vendita trovata</p>
            {activeFiltersCount > 0 && <button onClick={resetFilters} className="mt-2 text-sm" style={{ color: '#006B3F' }}>Rimuovi filtri</button>}
          </div>
        ) : (
          <div className="divide-y">
            {filteredComms.map((comm) => {
              const commDate = new Date(comm.completedAt || comm.createdAt);
              return (
                <div key={comm.id} className={`px-4 py-3 bg-white hover:bg-gray-50 ${selectedItems.includes(comm.id) ? 'bg-green-50' : ''}`}>
                  <div className="flex items-start">
                    {selectMode && (
                      <button onClick={() => toggleSelectItem(comm.id)} className="flex-none mr-3 mt-1">
                        {selectedItems.includes(comm.id) ? <CheckSquare className="w-5 h-5" style={{ color: '#006B3F' }} /> : <Square className="w-5 h-5 text-gray-400" />}
                      </button>
                    )}
                    <div className="flex-none w-16">
                      <div className="text-sm font-medium text-gray-700">{commDate.toLocaleDateString('it-IT',{day:'2-digit',month:'2-digit'})}</div>
                      <div className="text-xs text-gray-400">{commDate.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})}</div>
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      {(comm.prodotti||[]).map((p, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="font-semibold" style={{ color: '#006B3F' }}>{p.brand}</span>{' '}
                          <span className="font-medium">{p.model}</span>
                          {p.serialNumber && !p.serialNumber.startsWith('NOMAT') && <div className="text-xs text-gray-500 font-mono">{p.serialNumber}</div>}
                        </div>
                      ))}
                      {(comm.accessori||[]).length > 0 && (
                        <div className="text-xs text-gray-500 mt-0.5">+ {comm.accessori.map(a => `${a.nome}${(a.quantita||1)>1?` x${a.quantita}`:''}`).join(', ')}</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-sm truncate pl-2">
                      {comm.cliente || '-'}
                      {comm.telefono && <div className="text-xs text-blue-500">{comm.telefono}</div>}
                    </div>
                    <div className="flex-none w-20 text-right">
                      <span className="font-bold block" style={{ color: '#006B3F' }}>€{(comm.totale||0).toFixed(0)}</span>
                      <span className="text-xs text-gray-400 block">imp. €{getCommImponibile(comm).toFixed(0)}</span>
                      {comm.caparra > 0 && <span className="text-xs text-yellow-600 block">cap. €{comm.caparra.toFixed(0)}</span>}
                    </div>
                    {!selectMode && (
                      <div className="flex-none flex flex-col ml-1">
                        <button onClick={() => generateCommPDF(comm)} className="text-green-500 hover:text-green-700 p-1" title="Scarica PDF"><FileDown className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteConfirm(comm)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-400">
                    <span>Op: {comm.operatore || 'N/D'}</span>
                    <div className="flex items-center gap-2">
                      {comm.tipoDocumento === 'fattura' && <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs">Fattura</span>}
                      <span>{commDate.getFullYear()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Barra selezione multipla */}
      {selectMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <button onClick={selectAll} className="flex items-center gap-2 text-sm font-medium" style={{ color: '#006B3F' }}>
              {selectedItems.length === filteredComms.length ? <><CheckSquare className="w-5 h-5" /> Deseleziona tutti</> : <><Square className="w-5 h-5" /> Seleziona tutti ({filteredComms.length})</>}
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{selectedItems.length} selezionati</span>
              <button onClick={() => setShowDeleteMultipleModal(true)} disabled={selectedItems.length===0}
                className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${selectedItems.length>0?'bg-red-500 text-white':'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                <Trash2 className="w-4 h-4" /> Elimina
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Elimina Singola */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold">Eliminare questa commissione?</h3>
              <p className="text-gray-600 mt-2">{getCommDescription(deleteConfirm)}</p>
              <p className="text-sm text-gray-500 mt-1">Cliente: {deleteConfirm.cliente || 'N/D'}</p>
              <p className="text-sm font-bold mt-1" style={{ color: '#006B3F' }}>€ {(deleteConfirm.totale||0).toFixed(2)}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 bg-gray-200 rounded-lg font-semibold">Annulla</button>
              <button onClick={handleDeleteConfirm} className="flex-1 py-3 bg-red-500 text-white rounded-lg font-semibold">Elimina</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Elimina Multipla */}
      {showDeleteMultipleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-red-600">⚠️ ATTENZIONE</h3>
              <p className="text-gray-600 mt-2">Stai per eliminare <strong>{selectedItems.length}</strong> commissioni.</p>
              <p className="text-sm text-gray-500 mt-2">Questa azione è irreversibile!</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteMultipleModal(false)} className="flex-1 py-3 bg-gray-200 rounded-lg font-semibold">Annulla</button>
              <button onClick={handleDeleteMultiple} className="flex-1 py-3 bg-red-500 text-white rounded-lg font-semibold">Elimina {selectedItems.length}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
