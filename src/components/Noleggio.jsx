import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, X, FileText, ChevronDown, ChevronUp, Upload, Check, AlertCircle, MessageCircle } from 'lucide-react';
import { supabase } from '../store';

// ─── Costanti ──────────────────────────────────────────────────────────────
const FASCE = [
  { key: 'mezzo_giorno',            label: '½ giornata',    giorni: 0.5 },
  { key: 'uno_giorno',              label: '1 giornata',    giorni: 1   },
  { key: 'due_tre_giorni',          label: '2 – 3 giorni',  giorni: 2   },
  { key: 'quattro_sette_giorni',    label: '4 – 7 giorni',  giorni: 4   },
  { key: 'oltre_sette_giorni',      label: 'Oltre 7 giorni',giorni: 8   },
];

const CATEGORIE = [
  { key: 'tutti',           label: '🌿 Tutti' },
  { key: 'tappeto_erboso',  label: '🌱 Tappeto erboso' },
  { key: 'attrezzi',        label: '🔧 Attrezzi' },
  { key: 'tagliaerba',      label: '🚜 Tagliaerba' },
  { key: 'escavatori',      label: '🦺 Escavatori' },
];

const LISTINI = [
  { key: 'std_iva',   label: 'Con IVA',    tipo: 'std', netto: false },
  { key: 'std_netto', label: 'Senza IVA',  tipo: 'std', netto: true  },
  { key: 'b_iva',     label: 'Abb. B',     tipo: 'b',   netto: false },
  { key: 'c_iva',     label: 'Abb. C',     tipo: 'c',   netto: false },
];

const fmt = (v) => v != null ? `€ ${Number(v).toFixed(2)}` : '—';

// ─── Carica dati da Supabase ────────────────────────────────────────────────
async function fetchMacchine() {
  const { data, error } = await supabase
    .from('noleggio_macchine')
    .select(`
      id, nome, note_tecniche, categoria, carburante, deposito_cauzionale, attiva,
      noleggio_listini ( fascia, tipo_listino, prezzo_iva, prezzo_netto )
    `)
    .eq('attiva', true)
    .order('nome');
  if (error) throw error;
  return data;
}

// ─── Genera PDF ─────────────────────────────────────────────────────────────
async function generaPDF({ macchina, listino, fasciaScelta, nGiorni, cliente, dataDa, dataA, note, totale, depositoCauzionale }) {
  const { default: jsPDF } = await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js').then(() => ({ default: window.jspdf.jsPDF }));
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = 20;

  // Intestazione OMPRA
  doc.setFillColor(0, 107, 63);
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16); doc.setFont('helvetica', 'bold');
  doc.text('OMPRA srl', margin, 12);
  doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  doc.text('Via Roncade 7 · San Biagio di Callalta (TV) · Tel. 0422 890300', margin, 19);
  doc.text('P.IVA 03584360262', margin, 24);

  y = 36;
  doc.setTextColor(0, 0, 0);

  // Titolo preventivo
  doc.setFontSize(14); doc.setFont('helvetica', 'bold');
  doc.text('PREVENTIVO NOLEGGIO', margin, y); y += 8;
  doc.setDrawColor(0, 107, 63); doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y); y += 6;

  // Data
  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  doc.text(`Data: ${new Date().toLocaleDateString('it-IT')}`, pageWidth - margin, y, { align: 'right' }); y += 8;

  // Dati cliente
  if (cliente) {
    doc.setFont('helvetica', 'bold'); doc.text('Cliente:', margin, y);
    doc.setFont('helvetica', 'normal'); doc.text(cliente, margin + 18, y); y += 6;
  }
  if (dataDa || dataA) {
    doc.setFont('helvetica', 'bold'); doc.text('Periodo:', margin, y);
    doc.setFont('helvetica', 'normal');
    const periodoText = `${dataDa ? new Date(dataDa).toLocaleDateString('it-IT') : ''}${dataA ? ' → ' + new Date(dataA).toLocaleDateString('it-IT') : ''}  (${nGiorni} giorn${nGiorni === 1 ? 'o' : 'i'})`;
    doc.text(periodoText, margin + 18, y); y += 6;
  }
  y += 2;

  // Macchina
  doc.setFillColor(240, 248, 240);
  doc.rect(margin, y, pageWidth - margin * 2, fasciaScelta.note_tecniche ? 18 : 12, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
  doc.setTextColor(0, 107, 63);
  doc.text(macchina.nome, margin + 3, y + 7);
  if (macchina.note_tecniche) {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(80, 80, 80);
    doc.text(macchina.note_tecniche, margin + 3, y + 14);
    y += 18;
  } else {
    y += 12;
  }
  y += 4;
  doc.setTextColor(0, 0, 0);

  // Tabella fasce
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
  doc.text('Listino: ' + (LISTINI.find(l => l.key === listino)?.label || listino), margin, y); y += 5;

  const colW = (pageWidth - margin * 2) / 2;
  doc.setFillColor(0, 107, 63); doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(8); doc.setFont('helvetica', 'bold');
  doc.text('Fascia', margin + 3, y + 5);
  doc.text('Prezzo/giorno', margin + colW + 3, y + 5);
  y += 7;

  FASCE.forEach((f) => {
    const prezzoVal = getPrezzoFascia(macchina, f.key, listino);
    const isSelected = f.key === fasciaScelta;
    if (isSelected) {
      doc.setFillColor(220, 245, 230);
    } else {
      doc.setFillColor(255, 255, 255);
    }
    doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
    doc.setTextColor(0, 0, 0); doc.setFont('helvetica', isSelected ? 'bold' : 'normal');
    doc.text(f.label + (isSelected ? '  ✓' : ''), margin + 3, y + 5);
    doc.text(prezzoVal != null ? fmt(prezzoVal) : '—', margin + colW + 3, y + 5);
    doc.setDrawColor(200, 200, 200); doc.line(margin, y + 7, pageWidth - margin, y + 7);
    y += 7;
  });

  y += 6;
  doc.setDrawColor(0, 107, 63); doc.line(margin, y, pageWidth - margin, y); y += 6;

  // Riepilogo economico
  const prezzoGiorno = getPrezzoFascia(macchina, fasciaScelta, listino);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
  doc.text(`Prezzo/giorno selezionato:`, margin, y);
  doc.text(fmt(prezzoGiorno), pageWidth - margin, y, { align: 'right' }); y += 6;

  doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
  doc.text(`Numero giorni:`, margin, y);
  doc.text(`${nGiorni}`, pageWidth - margin, y, { align: 'right' }); y += 5;

  doc.setDrawColor(0, 107, 63); doc.line(margin, y, pageWidth - margin, y); y += 4;

  doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
  doc.setTextColor(0, 107, 63);
  doc.text('TOTALE:', margin, y);
  doc.text(fmt(totale), pageWidth - margin, y, { align: 'right' }); y += 6;
  doc.setTextColor(0, 0, 0);

  if (depositoCauzionale) {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    doc.text('Deposito cauzionale:', margin, y);
    doc.text(fmt(depositoCauzionale), pageWidth - margin, y, { align: 'right' }); y += 5;
  }

  // Note
  if (note) {
    y += 4;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text('Note:', margin, y); y += 5;
    doc.setFont('helvetica', 'normal');
    const noteLines = doc.splitTextToSize(note, pageWidth - margin * 2);
    doc.text(noteLines, margin, y); y += noteLines.length * 5;
  }

  // Footer
  y = Math.max(y + 10, 260);
  doc.setDrawColor(200, 200, 200); doc.line(margin, y, pageWidth - margin, y); y += 5;
  doc.setFont('helvetica', 'italic'); doc.setFontSize(7); doc.setTextColor(120, 120, 120);
  doc.text('I prezzi sono IVA inclusa salvo diversa indicazione · Preventivo non vincolante · OMPRA srl', pageWidth / 2, y, { align: 'center' });

  doc.save(`Preventivo_Noleggio_${macchina.nome.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`);
}

// ─── Testo WhatsApp ─────────────────────────────────────────────────────────
function generaWhatsApp({ macchina, listino, fasciaScelta, nGiorni, cliente, dataDa, dataA, note, totale, depositoCauzionale }) {
  const listinoLabel = LISTINI.find(l => l.key === listino)?.label || listino;
  const fasciaLabel = FASCE.find(f => f.key === fasciaScelta)?.label || fasciaScelta;
  const prezzoGiorno = getPrezzoFascia(macchina, fasciaScelta, listino);
  let testo = `🔑 *PREVENTIVO NOLEGGIO OMPRA*\n`;
  testo += `📅 ${new Date().toLocaleDateString('it-IT')}\n\n`;
  if (cliente) testo += `👤 *Cliente:* ${cliente}\n`;
  if (dataDa || dataA) {
    testo += `📆 *Periodo:* ${dataDa ? new Date(dataDa).toLocaleDateString('it-IT') : ''}`;
    if (dataA) testo += ` → ${new Date(dataA).toLocaleDateString('it-IT')}`;
    testo += ` _(${nGiorni} giorn${nGiorni === 1 ? 'o' : 'i'})_\n`;
  }
  testo += `\n🚜 *Macchina:* ${macchina.nome}\n`;
  if (macchina.note_tecniche) testo += `📌 _${macchina.note_tecniche}_\n`;
  testo += `\n📋 *Listino:* ${listinoLabel}\n`;
  testo += `📊 *Fascia:* ${fasciaLabel} — ${fmt(prezzoGiorno)}/gg\n`;
  testo += `\n💰 *TOTALE: ${fmt(totale)}*`;
  if (depositoCauzionale) testo += `\n🏦 *Deposito cauzionale:* ${fmt(depositoCauzionale)}`;
  if (note) testo += `\n\n📝 *Note:* ${note}`;
  testo += `\n\n_OMPRA srl · Via Roncade 7 · San Biagio di Callalta (TV) · Tel. 0422 890300_`;
  window.open(`https://wa.me/?text=${encodeURIComponent(testo)}`, '_blank');
}

// ─── Helper prezzo ────────────────────────────────────────────────────────────
function getPrezzoFascia(macchina, fasciaKey, listinoKey) {
  const listinoConf = LISTINI.find(l => l.key === listinoKey);
  if (!listinoConf || !macchina.noleggio_listini) return null;
  const riga = macchina.noleggio_listini.find(r => r.fascia === fasciaKey && r.tipo_listino === listinoConf.tipo);
  if (!riga) return null;
  return listinoConf.netto ? riga.prezzo_netto : riga.prezzo_iva;
}

// ─── Parser Excel per import ─────────────────────────────────────────────────
async function parseExcelNoleggio(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const XLSX = window.XLSX;
        if (!XLSX) { reject(new Error('XLSX non disponibile')); return; }
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]] || wb.Sheets['Foglio3'];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

        const SKIP_NAMES = new Set(['GIORNI','ABBONAMENTO','LISTINO NOLEGGIO','I PREZZI SONO AL GIORNO IVA INCLUSA']);
        const FASCE_KEYS = ['mezzo_giorno','uno_giorno','due_tre_giorni','quattro_sette_giorni','oltre_sette_giorni'];

        // Riconosci layout: con IVA = (carb, nome, ½gg, 1gg, 2-3, 4-7, oltre7)
        // senza IVA = (nome, ½gg, 1gg, 2-3, 4-7, oltre7)
        const header = data[3] || data[2] || [];
        const hasCarb = header[0] === 'GIORNI' ? false : true;
        const nomeCol = hasCarb ? 1 : 0;
        const prezziCols = hasCarb ? [2,3,4,5,6] : [1,2,3,4,5];

        const machines = [];
        data.forEach((row, i) => {
          if (i < 3) return;
          const nome = row[nomeCol];
          if (!nome || typeof nome !== 'string') return;
          const nomeTrim = nome.trim();
          if (!nomeTrim || SKIP_NAMES.has(nomeTrim)) return;
          const prezzi = prezziCols.map(c => typeof row[c] === 'number' ? row[c] : null);
          if (prezzi.every(p => p === null)) return;
          machines.push({ nome: nomeTrim, prezzi });
        });
        resolve(machines);
      } catch (err) { reject(err); }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// ─── Componente principale ───────────────────────────────────────────────────
export default function Noleggio() {
  const [macchine, setMacchine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [cerca, setCerca] = useState('');
  const [catFiltro, setCatFiltro] = useState('tutti');
  const [macchinaSelezionata, setMacchinaSelezionata] = useState(null);
  const [listino, setListino] = useState('std_iva');
  const [fasciaScelta, setFasciaScelta] = useState(null);
  const [tab, setTab] = useState('listino'); // 'listino' | 'preventivo' | 'import'

  // Preventivo
  const [cliente, setCliente] = useState('');
  const [dataDa, setDataDa] = useState('');
  const [dataA, setDataA] = useState('');
  const [noteNoleggio, setNoteNoleggio] = useState('');

  // Import
  const [importFile, setImportFile] = useState(null);
  const [importTipo, setImportTipo] = useState('std_iva');
  const [importPreview, setImportPreview] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importMsg, setImportMsg] = useState(null);

  useEffect(() => {
    loadMacchine();
    // Carica XLSX per import
    if (!window.XLSX) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      document.head.appendChild(script);
    }
  }, []);

  async function loadMacchine() {
    try {
      setLoading(true);
      const data = await fetchMacchine();
      setMacchine(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // Calcolo giorni da date
  const nGiorni = useMemo(() => {
    if (!dataDa || !dataA) return 1;
    const diff = (new Date(dataA) - new Date(dataDa)) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.round(diff));
  }, [dataDa, dataA]);

  // Totale preventivo
  const totale = useMemo(() => {
    if (!macchinaSelezionata || !fasciaScelta) return null;
    const prezzo = getPrezzoFascia(macchinaSelezionata, fasciaScelta, listino);
    if (prezzo == null) return null;
    const g = fasciaScelta === 'mezzo_giorno' ? 0.5 : nGiorni;
    return prezzo * g;
  }, [macchinaSelezionata, fasciaScelta, listino, nGiorni]);

  // Macchine filtrate
  const macchineVis = useMemo(() => {
    return macchine.filter(m => {
      const matchCat = catFiltro === 'tutti' || m.categoria === catFiltro;
      const matchCerca = !cerca || m.nome.toLowerCase().includes(cerca.toLowerCase()) ||
        (m.note_tecniche && m.note_tecniche.toLowerCase().includes(cerca.toLowerCase()));
      return matchCat && matchCerca;
    });
  }, [macchine, cerca, catFiltro]);

  // Seleziona macchina
  function selezionaMacchina(m) {
    setMacchinaSelezionata(m);
    setFasciaScelta(null);
    setTab('listino');
  }

  // Import Excel
  async function handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImportFile(file);
    setImportMsg(null);
    try {
      const parsed = await parseExcelNoleggio(file);
      setImportPreview(parsed);
    } catch (err) {
      setImportMsg({ type: 'error', text: 'Errore lettura file: ' + err.message });
    }
  }

  async function eseguiImport() {
    if (!importPreview || importPreview.length === 0) return;
    setImportLoading(true);
    setImportMsg(null);
    const listinoConf = LISTINI.find(l => l.key === importTipo);
    let aggiornate = 0, nuove = 0, errori = 0;

    for (const m of importPreview) {
      try {
        // Cerca macchina esistente
        let { data: existing } = await supabase
          .from('noleggio_macchine')
          .select('id')
          .ilike('nome', m.nome)
          .limit(1);

        let macchId;
        if (existing && existing.length > 0) {
          macchId = existing[0].id;
          aggiornate++;
        } else {
          const { data: ins } = await supabase
            .from('noleggio_macchine')
            .insert({ nome: m.nome, attiva: true })
            .select('id')
            .single();
          macchId = ins?.id;
          nuove++;
        }

        // Upsert listini
        for (let j = 0; j < FASCE.length; j++) {
          const val = m.prezzi[j];
          if (val == null) continue;
          const record = {
            macchina_id: macchId,
            fascia: FASCE[j].key,
            tipo_listino: listinoConf.tipo,
          };
          if (listinoConf.netto) record.prezzo_netto = val;
          else record.prezzo_iva = val;

          await supabase.from('noleggio_listini').upsert(record, {
            onConflict: 'macchina_id,fascia,tipo_listino',
            ignoreDuplicates: false
          });
        }
      } catch (e) { errori++; }
    }

    setImportLoading(false);
    setImportMsg({ type: 'success', text: `✅ Import completato: ${aggiornate} aggiornate, ${nuove} nuove, ${errori} errori.` });
    setImportPreview(null);
    setImportFile(null);
    loadMacchine();
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-500">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2" style={{ borderColor: '#006B3F' }} />
        <p className="text-sm">Caricamento listino noleggio...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
      <AlertCircle className="w-4 h-4 inline mr-2" />Errore: {error}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="text-white p-4 shadow" style={{ backgroundColor: '#006B3F' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">🔑 Noleggio</h1>
            <p className="text-xs opacity-75">{macchine.length} macchine disponibili</p>
          </div>
          <button
            onClick={() => { setTab('import'); setMacchinaSelezionata(null); }}
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-medium"
          >
            <Upload className="w-3.5 h-3.5" /> Aggiorna listino
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Pannello sinistro: lista macchine ── */}
        <div className="w-72 flex flex-col border-r bg-white overflow-hidden shrink-0">
          {/* Cerca */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca macchina..."
                className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
                value={cerca}
                onChange={e => setCerca(e.target.value)}
              />
              {cerca && <button onClick={() => setCerca('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"><X className="w-4 h-4" /></button>}
            </div>
          </div>

          {/* Filtro categoria */}
          <div className="px-3 py-2 border-b flex gap-1 flex-wrap">
            {CATEGORIE.map(cat => (
              <button
                key={cat.key}
                onClick={() => setCatFiltro(cat.key)}
                className={`text-xs px-2 py-1 rounded-full border transition-colors ${catFiltro === cat.key ? 'text-white border-transparent' : 'bg-white text-gray-600 border-gray-200'}`}
                style={catFiltro === cat.key ? { backgroundColor: '#006B3F' } : {}}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Lista */}
          <div className="flex-1 overflow-auto">
            {macchineVis.length === 0 && (
              <p className="text-sm text-gray-400 text-center mt-8">Nessuna macchina trovata</p>
            )}
            {macchineVis.map(m => (
              <button
                key={m.id}
                onClick={() => selezionaMacchina(m)}
                className={`w-full text-left px-3 py-2.5 border-b hover:bg-green-50 transition-colors ${macchinaSelezionata?.id === m.id ? 'bg-green-50 border-l-4' : 'border-l-4 border-l-transparent'}`}
                style={macchinaSelezionata?.id === m.id ? { borderLeftColor: '#006B3F' } : {}}
              >
                <p className="text-sm font-medium text-gray-800 leading-tight">{m.nome}</p>
                {m.note_tecniche && (
                  <p className="text-xs text-gray-400 mt-0.5 leading-tight line-clamp-1">{m.note_tecniche}</p>
                )}
                <div className="flex gap-1 mt-1">
                  {m.carburante && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-1.5 rounded">{m.carburante}</span>
                  )}
                  <span className="text-xs bg-gray-100 text-gray-500 px-1.5 rounded">
                    {CATEGORIE.find(c => c.key === m.categoria)?.label.split(' ').slice(1).join(' ') || m.categoria}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Pannello destro ── */}
        <div className="flex-1 overflow-auto p-4">
          {/* Import Excel */}
          {tab === 'import' && (
            <div className="max-w-lg mx-auto">
              <h2 className="text-lg font-bold text-gray-800 mb-4">📥 Aggiorna listino noleggio</h2>
              <div className="bg-white rounded-xl shadow-sm border p-5 space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1">Tipo listino nel file</label>
                  <div className="flex gap-2 flex-wrap">
                    {LISTINI.map(l => (
                      <button
                        key={l.key}
                        onClick={() => setImportTipo(l.key)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${importTipo === l.key ? 'text-white border-transparent' : 'bg-white text-gray-600 border-gray-200'}`}
                        style={importTipo === l.key ? { backgroundColor: '#006B3F' } : {}}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1">File Excel</label>
                  <label className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-200 rounded-lg p-6 cursor-pointer hover:border-green-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-300" />
                    <span className="text-sm text-gray-500">{importFile ? importFile.name : 'Carica file Excel noleggio (.xlsx)'}</span>
                    <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImportFile} />
                  </label>
                </div>

                {importPreview && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm font-bold text-green-800 mb-2">Anteprima — {importPreview.length} macchine trovate:</p>
                    <div className="max-h-40 overflow-auto text-xs text-green-700 space-y-1">
                      {importPreview.slice(0, 20).map((m, i) => (
                        <div key={i} className="flex justify-between">
                          <span className="truncate flex-1">{m.nome}</span>
                          <span className="ml-2 text-green-500">{m.prezzi.filter(Boolean).length} fasce</span>
                        </div>
                      ))}
                      {importPreview.length > 20 && <p className="text-green-500">...e altre {importPreview.length - 20}</p>}
                    </div>
                    <button
                      onClick={eseguiImport}
                      disabled={importLoading}
                      className="mt-3 w-full py-2 rounded-lg text-white font-bold text-sm"
                      style={{ backgroundColor: '#006B3F' }}
                    >
                      {importLoading ? 'Importazione...' : `✅ Conferma import (${importPreview.length} macchine)`}
                    </button>
                  </div>
                )}

                {importMsg && (
                  <div className={`p-3 rounded-lg text-sm ${importMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {importMsg.text}
                  </div>
                )}
              </div>

              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                <p className="font-bold mb-1">ℹ️ Come funziona l'import:</p>
                <ul className="space-y-1 text-xs list-disc list-inside">
                  <li>Carica uno dei file Excel del listino OMPRA</li>
                  <li>Seleziona il tipo (Con IVA, Senza IVA, Abb. B, Abb. C)</li>
                  <li>Il sistema aggiorna i prezzi delle macchine esistenti</li>
                  <li>Le macchine nuove vengono create automaticamente</li>
                  <li>Il deposito cauzionale non viene modificato</li>
                </ul>
              </div>
            </div>
          )}

          {/* Nessuna macchina selezionata */}
          {tab !== 'import' && !macchinaSelezionata && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-6xl mb-4">🔑</div>
              <p className="text-lg font-medium">Seleziona una macchina</p>
              <p className="text-sm mt-1">Scegli dalla lista a sinistra per vedere il listino</p>
            </div>
          )}

          {/* Scheda macchina */}
          {tab !== 'import' && macchinaSelezionata && (
            <div className="max-w-2xl mx-auto">
              {/* Intestazione macchina */}
              <div className="bg-white rounded-xl shadow-sm border p-4 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{macchinaSelezionata.nome}</h2>
                    {macchinaSelezionata.note_tecniche && (
                      <p className="text-sm text-gray-500 mt-1">📌 {macchinaSelezionata.note_tecniche}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      {macchinaSelezionata.carburante && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">⛽ {macchinaSelezionata.carburante}</span>
                      )}
                      {macchinaSelezionata.deposito_cauzionale ? (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">🏦 Deposito: {fmt(macchinaSelezionata.deposito_cauzionale)}</span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">🏦 Deposito: da definire</span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setMacchinaSelezionata(null)} className="text-gray-400 hover:text-gray-600 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tab switcher */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setTab('listino')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'listino' ? 'text-white' : 'bg-white text-gray-600 border'}`}
                  style={tab === 'listino' ? { backgroundColor: '#006B3F' } : {}}
                >
                  📋 Listino
                </button>
                <button
                  onClick={() => setTab('preventivo')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'preventivo' ? 'text-white' : 'bg-white text-gray-600 border'}`}
                  style={tab === 'preventivo' ? { backgroundColor: '#006B3F' } : {}}
                >
                  📄 Preventivo
                </button>
              </div>

              {/* ── Tab Listino ── */}
              {tab === 'listino' && (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  {/* Selettore listino */}
                  <div className="p-3 border-b flex gap-2 flex-wrap">
                    {LISTINI.map(l => (
                      <button
                        key={l.key}
                        onClick={() => setListino(l.key)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${listino === l.key ? 'text-white border-transparent' : 'bg-white text-gray-600 border-gray-200'}`}
                        style={listino === l.key ? { backgroundColor: '#006B3F' } : {}}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>

                  {/* Tabella fasce */}
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="text-left text-xs font-bold text-gray-500 px-4 py-2.5">Fascia</th>
                        <th className="text-right text-xs font-bold text-gray-500 px-4 py-2.5">€/giorno</th>
                        <th className="w-8"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {FASCE.map(f => {
                        const prezzo = getPrezzoFascia(macchinaSelezionata, f.key, listino);
                        const isSelected = fasciaScelta === f.key;
                        return (
                          <tr
                            key={f.key}
                            onClick={() => prezzo != null && setFasciaScelta(f.key)}
                            className={`border-b transition-colors ${prezzo != null ? 'cursor-pointer hover:bg-green-50' : 'opacity-40'} ${isSelected ? 'bg-green-50' : ''}`}
                          >
                            <td className="px-4 py-3">
                              <span className={`text-sm ${isSelected ? 'font-bold' : 'font-medium'} text-gray-800`}>{f.label}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className={`text-sm font-bold ${isSelected ? '' : 'text-gray-700'}`} style={isSelected ? { color: '#006B3F' } : {}}>
                                {fmt(prezzo)}
                              </span>
                            </td>
                            <td className="pr-3">
                              {isSelected && <Check className="w-4 h-4" style={{ color: '#006B3F' }} />}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Azione rapida */}
                  {fasciaScelta && (
                    <div className="p-3 bg-green-50 border-t flex items-center justify-between">
                      <div>
                        <p className="text-xs text-green-600">Fascia selezionata</p>
                        <p className="text-sm font-bold" style={{ color: '#006B3F' }}>
                          {FASCE.find(f => f.key === fasciaScelta)?.label} — {fmt(getPrezzoFascia(macchinaSelezionata, fasciaScelta, listino))}/gg
                        </p>
                      </div>
                      <button
                        onClick={() => setTab('preventivo')}
                        className="text-white px-4 py-2 rounded-lg text-sm font-bold"
                        style={{ backgroundColor: '#006B3F' }}
                      >
                        Crea preventivo →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── Tab Preventivo ── */}
              {tab === 'preventivo' && (
                <div className="space-y-4">
                  {/* Selezione fascia nel preventivo */}
                  <div className="bg-white rounded-xl shadow-sm border p-4">
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Tipo listino</label>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {LISTINI.map(l => (
                        <button
                          key={l.key}
                          onClick={() => setListino(l.key)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${listino === l.key ? 'text-white border-transparent' : 'bg-white text-gray-600 border-gray-200'}`}
                          style={listino === l.key ? { backgroundColor: '#006B3F' } : {}}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Fascia giorni</label>
                    <div className="grid grid-cols-2 gap-2">
                      {FASCE.map(f => {
                        const prezzo = getPrezzoFascia(macchinaSelezionata, f.key, listino);
                        const isSelected = fasciaScelta === f.key;
                        return (
                          <button
                            key={f.key}
                            onClick={() => prezzo != null && setFasciaScelta(f.key)}
                            disabled={prezzo == null}
                            className={`p-2 rounded-lg border text-sm text-left transition-colors ${isSelected ? 'text-white border-transparent' : prezzo != null ? 'bg-white text-gray-700 border-gray-200 hover:border-green-300' : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'}`}
                            style={isSelected ? { backgroundColor: '#006B3F' } : {}}
                          >
                            <span className="font-medium block">{f.label}</span>
                            <span className={`text-xs ${isSelected ? 'text-green-100' : 'text-gray-400'}`}>{fmt(prezzo)}/gg</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dati cliente e periodo */}
                  <div className="bg-white rounded-xl shadow-sm border p-4 space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase block">Dati cliente</label>
                    <input
                      type="text"
                      placeholder="Nome cliente"
                      className="w-full p-2.5 border rounded-lg text-sm"
                      value={cliente}
                      onChange={e => setCliente(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-gray-400 block mb-1">Data inizio</label>
                        <input type="date" className="w-full p-2 border rounded-lg text-sm" value={dataDa} onChange={e => setDataDa(e.target.value)} />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-400 block mb-1">Data fine</label>
                        <input type="date" className="w-full p-2 border rounded-lg text-sm" value={dataA} onChange={e => setDataA(e.target.value)} />
                      </div>
                    </div>
                    {dataDa && dataA && (
                      <p className="text-sm text-green-700 font-medium">📅 {nGiorni} giorn{nGiorni === 1 ? 'o' : 'i'}</p>
                    )}
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Note / condizioni</label>
                      <textarea
                        rows={3}
                        className="w-full p-2.5 border rounded-lg text-sm resize-none"
                        placeholder="Condizioni particolari, istruzioni, attrezzatura inclusa..."
                        value={noteNoleggio}
                        onChange={e => setNoteNoleggio(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Riepilogo e pulsanti */}
                  {fasciaScelta && totale != null && (
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                      <div className="p-4 border-b">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-2">Riepilogo preventivo</p>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Macchina</span>
                            <span className="font-medium">{macchinaSelezionata.nome}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Listino</span>
                            <span>{LISTINI.find(l => l.key === listino)?.label}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fascia</span>
                            <span>{FASCE.find(f => f.key === fasciaScelta)?.label}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>€/giorno</span>
                            <span>{fmt(getPrezzoFascia(macchinaSelezionata, fasciaScelta, listino))}</span>
                          </div>
                          {nGiorni > 1 && (
                            <div className="flex justify-between">
                              <span>Giorni</span>
                              <span>{nGiorni}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t">
                          <span className="font-bold text-gray-800">TOTALE</span>
                          <span className="text-xl font-bold" style={{ color: '#006B3F' }}>{fmt(totale)}</span>
                        </div>
                        {macchinaSelezionata.deposito_cauzionale && (
                          <div className="flex justify-between items-center mt-1 text-sm text-blue-600">
                            <span>Deposito cauzionale</span>
                            <span className="font-medium">{fmt(macchinaSelezionata.deposito_cauzionale)}</span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex gap-3">
                        <button
                          onClick={() => generaPDF({
                            macchina: macchinaSelezionata,
                            listino,
                            fasciaScelta,
                            nGiorni,
                            cliente,
                            dataDa,
                            dataA,
                            note: noteNoleggio,
                            totale,
                            depositoCauzionale: macchinaSelezionata.deposito_cauzionale
                          })}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-white font-bold text-sm"
                          style={{ backgroundColor: '#006B3F' }}
                        >
                          <FileText className="w-4 h-4" /> PDF
                        </button>
                        <button
                          onClick={() => generaWhatsApp({
                            macchina: macchinaSelezionata,
                            listino,
                            fasciaScelta,
                            nGiorni,
                            cliente,
                            dataDa,
                            dataA,
                            note: noteNoleggio,
                            totale,
                            depositoCauzionale: macchinaSelezionata.deposito_cauzionale
                          })}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm bg-[#25D366] text-white"
                        >
                          <MessageCircle className="w-4 h-4" /> WhatsApp
                        </button>
                      </div>
                    </div>
                  )}

                  {!fasciaScelta && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
                      ⚠️ Seleziona una fascia giorni per generare il preventivo
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
