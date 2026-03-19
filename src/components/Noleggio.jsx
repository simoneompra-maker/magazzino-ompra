import { useState, useEffect, useMemo } from 'react';
import { Search, X, FileText, Upload, Check, AlertCircle, MessageCircle, ChevronDown, ChevronRight, ArrowLeft, Trash2, RefreshCw } from 'lucide-react';
import { supabase } from '../store';

// ─── Costanti ────────────────────────────────────────────────────────────────
const FASCE = [
  { key: 'mezzo_giorno',           label: '½ giornata',     giorni: 0.5 },
  { key: 'uno_giorno',             label: '1 giornata',     giorni: 1   },
  { key: 'due_tre_giorni',         label: '2 – 3 giorni',   giorni: 2   },
  { key: 'quattro_sette_giorni',   label: '4 – 7 giorni',   giorni: 4   },
  { key: 'oltre_sette_giorni',     label: 'Oltre 7 giorni', giorni: 8   },
];
const LISTINI = [
  { key: 'std_iva',   label: 'Con IVA',   tipo: 'std', netto: false },
  { key: 'std_netto', label: 'Senza IVA', tipo: 'std', netto: true  },
  { key: 'b_iva',     label: 'Abb. B',    tipo: 'b',   netto: false },
  { key: 'c_iva',     label: 'Abb. C',    tipo: 'c',   netto: false },
];
const CATEGORIE = [
  { key: 'tutti',          label: '🌿 Tutti'          },
  { key: 'tappeto_erboso', label: '🌱 Tappeto erboso' },
  { key: 'attrezzi',       label: '🔧 Attrezzi'       },
  { key: 'tagliaerba',     label: '🚜 Tagliaerba'     },
  { key: 'escavatori',     label: '🦺 Escavatori'     },
];

const fmt = (v) => v != null ? `€ ${Number(v).toFixed(2)}` : '—';
const GREEN = '#006B3F';

// ─── Archivio Noleggio (Supabase) ────────────────────────────────────────────
async function salvaArchivioNoleggio({ carrello, cliente, dataDa, dataA, nGiorni, totaleCarrello, note }) {
  const { error } = await supabase.from('noleggio_archivio').insert({
    nome_cliente: cliente || null,
    data_da: dataDa || null,
    data_a: dataA || null,
    n_giorni: nGiorni || null,
    totale_preventivo: totaleCarrello || null,
    note: note || null,
    carrello: carrello,
  });
  if (error) console.error('Errore salvataggio archivio noleggio:', error);
}

async function getArchivioNoleggio() {
  const { data, error } = await supabase
    .from('noleggio_archivio')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data || [];
}

async function eliminaArchivioNoleggio(id) {
  const { error } = await supabase.from('noleggio_archivio').delete().eq('id', id);
  if (error) throw error;
}

function getPrezzoFascia(macchina, fasciaKey, listinoKey) {
  const lc = LISTINI.find(l => l.key === listinoKey);
  if (!lc || !macchina?.noleggio_listini) return null;
  const r = macchina.noleggio_listini.find(x => x.fascia === fasciaKey && x.tipo_listino === lc.tipo);
  if (!r) return null;
  return lc.netto ? r.prezzo_netto : r.prezzo_iva;
}

// ─── Fetch ───────────────────────────────────────────────────────────────────
async function fetchMacchine() {
  const { data, error } = await supabase
    .from('noleggio_macchine')
    .select(`id, nome, note_tecniche, categoria, carburante, famiglia, is_accessorio, deposito_cauzionale, attiva,
             noleggio_listini ( fascia, tipo_listino, prezzo_iva, prezzo_netto )`)
    .eq('attiva', true)
    .order('nome');
  if (error) throw error;
  return data;
}

// ─── PDF ─────────────────────────────────────────────────────────────────────
// ─── PDF carrello multiplo ──────────────────────────────────────────────────
async function generaPDFCarrello({ carrello, cliente, dataDa, dataA, note, totaleCarrello }) {
  if (!window.jspdf) {
    await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  }
  const jsPDF = window.jspdf.jsPDF;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth(), M = 14;
  let y = 20;

  doc.setFillColor(0,107,63); doc.rect(0,0,W,28,'F');
  doc.setTextColor(255,255,255); doc.setFontSize(16); doc.setFont('helvetica','bold');
  doc.text('OMPRA srl', M, 12);
  doc.setFontSize(8); doc.setFont('helvetica','normal');
  doc.text('Via Roncade 7 · San Biagio di Callalta (TV) · Tel. 0422 890300', M, 19);
  doc.text('P.IVA 03584360262', M, 24); y = 36;

  doc.setTextColor(0,0,0); doc.setFontSize(14); doc.setFont('helvetica','bold');
  doc.text('PREVENTIVO NOLEGGIO', M, y); y += 6;
  doc.setDrawColor(0,107,63); doc.setLineWidth(0.5); doc.line(M, y, W-M, y); y += 5;

  doc.setFontSize(9); doc.setFont('helvetica','normal');
  doc.text(`Data: ${new Date().toLocaleDateString('it-IT')}`, W-M, y, {align:'right'}); y += 6;
  if (cliente) { doc.setFont('helvetica','bold'); doc.text('Cliente:', M, y); doc.setFont('helvetica','normal'); doc.text(cliente, M+18, y); y+=6; }
  if (dataDa||dataA) {
    const nGiorni = dataDa && dataA ? Math.max(1, Math.round((new Date(dataA)-new Date(dataDa))/(1000*60*60*24))) : 1;
    doc.setFont('helvetica','bold'); doc.text('Periodo:', M, y); doc.setFont('helvetica','normal');
    doc.text(`${dataDa?new Date(dataDa).toLocaleDateString('it-IT'):''}${dataA?' → '+new Date(dataA).toLocaleDateString('it-IT'):''} (${nGiorni} giorni)`, M+18, y); y+=6;
  }
  y += 2;

  // Una sezione per ogni voce del carrello
  carrello.forEach((voce, idx) => {
    if (y > 240) { doc.addPage(); y = 20; }
    const fasciaLabel = FASCE.find(f=>f.key===voce.fasciaScelta)?.label||voce.fasciaScelta;

    doc.setFillColor(240,248,240); doc.rect(M, y, W-M*2, 12, 'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(0,107,63);
    doc.text(`${idx+1}. ${voce.macchina.nome}`, M+3, y+8);
    y += 12; doc.setTextColor(0,0,0);

    doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(80,80,80);
    doc.text(`Fascia: ${fasciaLabel} · ${voce.nGiorni} giorno/i`, M+3, y+4); y += 6;

    if (voce.accessori.length > 0) {
      doc.setFont('helvetica','italic');
      voce.accessori.forEach(acc => {
        const p = getPrezzoFascia(acc, voce.fasciaScelta, voce.listino);
        doc.text(`↳ ${acc.nome}  ${fmt(p)}`, M+6, y+4); y+=4;
      });
    }
    doc.setTextColor(0,0,0);
    doc.setFont('helvetica','bold'); doc.setFontSize(9);
    doc.text(`Subtotale: ${fmt(voce.subtotale)}`, W-M, y+4, {align:'right'}); y += 8;
    doc.setDrawColor(220,220,220); doc.line(M, y, W-M, y); y += 5;
  });

  // Totale complessivo
  y += 2;
  doc.setDrawColor(0,107,63); doc.setLineWidth(0.8); doc.line(M, y, W-M, y); y += 5;
  doc.setFont('helvetica','bold'); doc.setFontSize(13); doc.setTextColor(0,107,63);
  doc.text('TOTALE COMPLESSIVO:', M, y);
  doc.text(fmt(totaleCarrello), W-M, y, {align:'right'}); y += 8;
  doc.setTextColor(0,0,0);

  if (note) {
    y+=3; doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.text('Note:', M, y); y+=5;
    doc.setFont('helvetica','normal');
    const nl = doc.splitTextToSize(note, W-M*2); doc.text(nl, M, y);
  }

  y = Math.max(y+10, 260);
  doc.setDrawColor(200,200,200); doc.line(M, y, W-M, y); y+=5;
  doc.setFont('helvetica','italic'); doc.setFontSize(7); doc.setTextColor(120,120,120);
  doc.text('I prezzi sono IVA inclusa salvo diversa indicazione · Preventivo non vincolante · OMPRA srl', W/2, y, {align:'center'});
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Preventivo_Noleggio_${new Date().toISOString().slice(0,10)}.pdf`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
}

// ─── WhatsApp carrello multiplo ──────────────────────────────────────────────
function generaWhatsAppCarrello({ carrello, cliente, dataDa, dataA, note, totaleCarrello }) {
  let t = `🔑 *PREVENTIVO NOLEGGIO OMPRA*\n📅 ${new Date().toLocaleDateString('it-IT')}\n\n`;
  if (cliente) t += `👤 *Cliente:* ${cliente}\n`;
  if (dataDa||dataA) {
    const nGiorni = dataDa && dataA ? Math.max(1, Math.round((new Date(dataA)-new Date(dataDa))/(1000*60*60*24))) : 1;
    t += `📆 *Periodo:* ${dataDa?new Date(dataDa).toLocaleDateString('it-IT'):''}${dataA?' → '+new Date(dataA).toLocaleDateString('it-IT'):''} _(${nGiorni} giorni)_\n`;
  }
  carrello.forEach((voce, idx) => {
    const fasciaLabel = FASCE.find(f=>f.key===voce.fasciaScelta)?.label||voce.fasciaScelta;
    t += `\n${idx+1}. 🚜 *${voce.macchina.nome}*\n`;
    if (voce.macchina.note_tecniche) t += `   📌 _${voce.macchina.note_tecniche}_\n`;
    t += `   📋 ${fasciaLabel} · ${voce.nGiorni} giorno/i\n`;
    if (voce.accessori.length>0) {
      t += `   🔩 Accessori:\n`;
      voce.accessori.forEach(a => t += `     ↳ ${a.nome}\n`);
    }
    t += `   💶 Subtotale: ${fmt(voce.subtotale)}\n`;
  });
  t += `\n💰 *TOTALE COMPLESSIVO: ${fmt(totaleCarrello)}*`;
  if (note) t += `\n📝 *Note:* ${note}`;
  t += `\n\n_OMPRA srl · Via Roncade 7 · San Biagio di Callalta (TV) · Tel. 0422 890300_`;
  window.open(`https://wa.me/?text=${encodeURIComponent(t)}`, '_blank');
}

async function generaPDF({ macchina, accessoriSelezionati, listino, fasciaScelta, nGiorni, cliente, dataDa, dataA, note, totale }) {
  if (!window.jspdf) {
    await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  }
  const jsPDF = window.jspdf.jsPDF;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth(), M = 14;
  let y = 20;

  doc.setFillColor(0,107,63); doc.rect(0,0,W,28,'F');
  doc.setTextColor(255,255,255); doc.setFontSize(16); doc.setFont('helvetica','bold');
  doc.text('OMPRA srl', M, 12);
  doc.setFontSize(8); doc.setFont('helvetica','normal');
  doc.text('Via Roncade 7 · San Biagio di Callalta (TV) · Tel. 0422 890300', M, 19);
  doc.text('P.IVA 03584360262', M, 24); y = 36;

  doc.setTextColor(0,0,0); doc.setFontSize(14); doc.setFont('helvetica','bold');
  doc.text('PREVENTIVO NOLEGGIO', M, y); y += 6;
  doc.setDrawColor(0,107,63); doc.setLineWidth(0.5); doc.line(M, y, W-M, y); y += 5;

  doc.setFontSize(9); doc.setFont('helvetica','normal');
  doc.text(`Data: ${new Date().toLocaleDateString('it-IT')}`, W-M, y, {align:'right'}); y += 6;
  if (cliente) { doc.setFont('helvetica','bold'); doc.text('Cliente:', M, y); doc.setFont('helvetica','normal'); doc.text(cliente, M+18, y); y+=6; }
  if (dataDa||dataA) {
    doc.setFont('helvetica','bold'); doc.text('Periodo:', M, y); doc.setFont('helvetica','normal');
    doc.text(`${dataDa?new Date(dataDa).toLocaleDateString('it-IT'):''}${dataA?' → '+new Date(dataA).toLocaleDateString('it-IT'):''} (${nGiorni} giorni)`, M+18, y); y+=6;
  }
  y+=2;

  // Macchina principale
  doc.setFillColor(240,248,240); doc.rect(M, y, W-M*2, 12, 'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(0,107,63);
  doc.text(macchina.nome, M+3, y+8);
  y += 12; doc.setTextColor(0,0,0);

  // Accessori selezionati
  if (accessoriSelezionati.length > 0) {
    doc.setFontSize(8); doc.setFont('helvetica','italic'); doc.setTextColor(80,80,80);
    doc.text('Accessori inclusi:', M+3, y+4);
    y += 4;
    accessoriSelezionati.forEach(acc => {
      const p = getPrezzoFascia(acc, fasciaScelta, listino);
      doc.text(`↳ ${acc.nome}  ${fmt(p)}`, M+6, y+4); y+=4;
    });
    doc.setTextColor(0,0,0);
  }
  y += 4;

  // Fascia e totale
  const listinoLabel = LISTINI.find(l=>l.key===listino)?.label||'';
  const fasciaLabel = FASCE.find(f=>f.key===fasciaScelta)?.label||'';
  doc.setFont('helvetica','normal'); doc.setFontSize(9);
  doc.text(`Listino: ${listinoLabel}  ·  Fascia: ${fasciaLabel}`, M, y); y+=6;
  doc.setDrawColor(0,107,63); doc.line(M, y, W-M, y); y+=4;
  doc.setFont('helvetica','bold'); doc.setFontSize(12); doc.setTextColor(0,107,63);
  doc.text('TOTALE:', M, y); doc.text(fmt(totale), W-M, y, {align:'right'}); y+=6;
  doc.setTextColor(0,0,0);
  if (macchina.deposito_cauzionale) {
    doc.setFont('helvetica','normal'); doc.setFontSize(9);
    doc.text('Deposito cauzionale:', M, y); doc.text(fmt(macchina.deposito_cauzionale), W-M, y, {align:'right'}); y+=5;
  }
  if (note) {
    y+=3; doc.setFont('helvetica','bold'); doc.text('Note:', M, y); y+=5;
    doc.setFont('helvetica','normal');
    const nl = doc.splitTextToSize(note, W-M*2); doc.text(nl, M, y);
  }

  y = Math.max(y+10,260);
  doc.setDrawColor(200,200,200); doc.line(M, y, W-M, y); y+=5;
  doc.setFont('helvetica','italic'); doc.setFontSize(7); doc.setTextColor(120,120,120);
  doc.text('I prezzi sono IVA inclusa salvo diversa indicazione · Preventivo non vincolante · OMPRA srl', W/2, y, {align:'center'});
  doc.save(`Preventivo_Noleggio_${macchina.nome.replace(/[^a-zA-Z0-9]/g,'_')}_${new Date().toISOString().slice(0,10)}.pdf`);
}

// ─── WhatsApp ────────────────────────────────────────────────────────────────
function generaWhatsApp({ macchina, accessoriSelezionati, listino, fasciaScelta, nGiorni, cliente, dataDa, dataA, note, totale }) {
  const listinoLabel = LISTINI.find(l=>l.key===listino)?.label||'';
  const fasciaLabel = FASCE.find(f=>f.key===fasciaScelta)?.label||'';
  const prezzoGiorno = getPrezzoFascia(macchina, fasciaScelta, listino);
  let t = `🔑 *PREVENTIVO NOLEGGIO OMPRA*\n📅 ${new Date().toLocaleDateString('it-IT')}\n\n`;
  if (cliente) t += `👤 *Cliente:* ${cliente}\n`;
  if (dataDa||dataA) t += `📆 *Periodo:* ${dataDa?new Date(dataDa).toLocaleDateString('it-IT'):''}${dataA?' → '+new Date(dataA).toLocaleDateString('it-IT'):''} _(${nGiorni} giorni)_\n`;
  t += `\n🚜 *Macchina:* ${macchina.nome}\n`;
  if (macchina.note_tecniche) t += `📌 _${macchina.note_tecniche}_\n`;
  if (accessoriSelezionati.length>0) {
    t += `🔩 *Accessori:*\n`;
    accessoriSelezionati.forEach(a => t += `  ↳ ${a.nome}  ${fmt(getPrezzoFascia(a,fasciaScelta,listino))}\n`);
  }
  t += `\n📋 *Listino:* ${listinoLabel} · *Fascia:* ${fasciaLabel}\n`;
  t += `💰 *TOTALE: ${fmt(totale)}*`;
  if (macchina.deposito_cauzionale) t += `\n🏦 *Deposito:* ${fmt(macchina.deposito_cauzionale)}`;
  if (note) t += `\n📝 *Note:* ${note}`;
  t += `\n\n_OMPRA srl · Via Roncade 7 · San Biagio di Callalta (TV) · Tel. 0422 890300_`;
  window.open(`https://wa.me/?text=${encodeURIComponent(t)}`, '_blank');
}

// ─── Archivio Supabase ──────────────────────────────────────────────────────
async function salvaArchivioNoleggio(record) {
  const { error } = await supabase.from('noleggio_archivio').insert(record);
  if (error) console.error('Errore salvataggio archivio noleggio:', error);
}
async function getArchivioNoleggio() {
  const { data, error } = await supabase.from('noleggio_archivio').select('*').order('created_at', { ascending: false }).limit(100);
  if (error) throw error;
  return data || [];
}
async function eliminaArchivioNoleggio(id) {
  const { error } = await supabase.from('noleggio_archivio').delete().eq('id', id);
  if (error) throw error;
}

// ─── Componente principale ───────────────────────────────────────────────────
export default function Noleggio({ onNavigate }) {
  const [macchine, setMacchine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cerca, setCerca] = useState('');
  const [catFiltro, setCatFiltro] = useState('tutti');
  const [famiglieFold, setFamiglieFold] = useState({});
  const [macchinaSelezionata, setMacchinaSelezionata] = useState(null);
  const [accessoriSelezionati, setAccessoriSelezionati] = useState([]);
  const [listino, setListino] = useState('std_iva');
  const [fasciaScelta, setFasciaScelta] = useState(null);
  const [tab, setTab] = useState('listino');
  const [cliente, setCliente] = useState('');
  const [dataDa, setDataDa] = useState('');
  const [dataA, setDataA] = useState('');
  const [noteNoleggio, setNoteNoleggio] = useState('');
  const [carrello, setCarrello] = useState([]); // [{macchina, accessori, listino, fasciaScelta, nGiorni, subtotale}]
  const [importFile, setImportFile] = useState(null);
  const [importTipo, setImportTipo] = useState('std_iva');
  const [importPreview, setImportPreview] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importMsg, setImportMsg] = useState(null);
  const [archivioData, setArchivioData] = useState([]);
  const [archivioLoading, setArchivioLoading] = useState(false);
  const [mainTab, setMainTab] = useState('noleggio'); // 'noleggio' | 'archivio'
  const [archivioData, setArchivioData] = useState([]);
  const [archivioLoading, setArchivioLoading] = useState(false);
  const [archivioTab, setArchivioTab] = useState(false);

  useEffect(() => {
    loadMacchine();
    if (!window.XLSX) {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      document.head.appendChild(s);
    }
  }, []);

  async function loadMacchine() {
    try { setLoading(true); setMacchine(await fetchMacchine()); }
    catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }

  const nGiorni = useMemo(() => {
    if (!dataDa||!dataA) return 1;
    return Math.max(1, Math.round((new Date(dataA)-new Date(dataDa))/(1000*60*60*24)));
  }, [dataDa, dataA]);

  // Accessori disponibili per la macchina selezionata
  const accessoriDisponibili = useMemo(() => {
    if (!macchinaSelezionata) return [];
    return macchine.filter(m => m.is_accessorio && m.famiglia === macchinaSelezionata.famiglia);
  }, [macchine, macchinaSelezionata]);

  // Fratelli: altre macchine della stessa famiglia
  const fratelli = useMemo(() => {
    if (!macchinaSelezionata?.famiglia) return [];
    return macchine.filter(m => !m.is_accessorio && m.famiglia === macchinaSelezionata.famiglia && m.id !== macchinaSelezionata.id);
  }, [macchine, macchinaSelezionata]);

  // Calcolo totale
  const totale = useMemo(() => {
    if (!macchinaSelezionata || !fasciaScelta) return null;
    const g = fasciaScelta === 'mezzo_giorno' ? 0.5 : nGiorni;
    const pMacch = getPrezzoFascia(macchinaSelezionata, fasciaScelta, listino);
    if (pMacch == null) return null;
    let tot = pMacch * g;
    accessoriSelezionati.forEach(acc => {
      const p = getPrezzoFascia(acc, fasciaScelta, listino);
      if (p != null) tot += p * g;
    });
    return tot;
  }, [macchinaSelezionata, fasciaScelta, listino, nGiorni, accessoriSelezionati]);

  const totaleCarrello = useMemo(() => {
    return carrello.reduce((s, v) => s + (v.subtotale || 0), 0);
  }, [carrello]);

  function aggiungiAlCarrello() {
    if (!macchinaSelezionata || !fasciaScelta || totale == null) return;
    const voce = {
      id: Date.now(),
      macchina: macchinaSelezionata,
      accessori: [...accessoriSelezionati],
      listino,
      fasciaScelta,
      nGiorni,
      subtotale: totale,
    };
    setCarrello(prev => [...prev, voce]);
    // Reset solo fascia e accessori — la macchina rimane selezionata
    setAccessoriSelezionati([]);
    setFasciaScelta(null);
  }

  function rimuoviDalCarrello(id) {
    setCarrello(prev => prev.filter(v => v.id !== id));
  }

  async function loadArchivio() {
    setArchivioLoading(true);
    try { setArchivioData(await getArchivioNoleggio()); } catch(e) { console.error(e); } finally { setArchivioLoading(false); }
  }

  async function handleEliminaArchivio(id) {
    if (!window.confirm('Eliminare questo preventivo?')) return;
    try { await eliminaArchivioNoleggio(id); setArchivioData(prev => prev.filter(r => r.id !== id)); } catch { alert('Errore eliminazione.'); }
  }

  async function rigenePDF(record) {
    await generaPDFCarrello({ carrello: record.carrello||[], cliente: record.nome_cliente||'', dataDa: record.data_da||'', dataA: record.data_a||'', note: record.note||'', totaleCarrello: record.totale_preventivo||0 });
  }

  // Macchine (solo principali) filtrate, raggruppate per famiglia
  const { standalone, perFamiglia } = useMemo(() => {
    const macchPrincipali = macchine.filter(m => !m.is_accessorio).filter(m => {
      const matchCat = catFiltro === 'tutti' || m.categoria === catFiltro;
      const matchCerca = !cerca || m.nome.toLowerCase().includes(cerca.toLowerCase());
      return matchCat && matchCerca;
    });
    const con_famiglia = {};
    const senza = [];
    macchPrincipali.forEach(m => {
      if (m.famiglia) {
        if (!con_famiglia[m.famiglia]) con_famiglia[m.famiglia] = [];
        con_famiglia[m.famiglia].push(m);
      } else {
        senza.push(m);
      }
    });
    return { standalone: senza, perFamiglia: con_famiglia };
  }, [macchine, cerca, catFiltro]);

  async function loadArchivio() {
    setArchivioLoading(true);
    try {
      const data = await getArchivioNoleggio();
      setArchivioData(data);
    } catch(e) {
      console.error('Errore caricamento archivio:', e);
    } finally {
      setArchivioLoading(false);
    }
  }

  async function handleEliminaArchivio(id) {
    if (!window.confirm('Eliminare questo preventivo dall\'archivio?')) return;
    try {
      await eliminaArchivioNoleggio(id);
      setArchivioData(prev => prev.filter(r => r.id !== id));
    } catch(e) {
      alert('Errore durante l\'eliminazione.');
    }
  }

  async function handleRidownload(record) {
    await generaPDFCarrello({
      carrello: record.carrello,
      cliente: record.nome_cliente || '',
      dataDa: record.data_da || '',
      dataA: record.data_a || '',
      note: record.note || '',
      totaleCarrello: record.totale_preventivo,
    });
  }

  function selezionaMacchina(m) {
    setMacchinaSelezionata(m);
    setAccessoriSelezionati([]);
    setFasciaScelta(null);
    setTab('listino');
  }

  function toggleAccessorio(acc) {
    setAccessoriSelezionati(prev =>
      prev.find(a => a.id === acc.id) ? prev.filter(a => a.id !== acc.id) : [...prev, acc]
    );
  }

  function toggleFamiglia(fam) {
    setFamiglieFold(prev => ({ ...prev, [fam]: !prev[fam] }));
  }

  // Import Excel
  async function handleImportFile(e) {
    const file = e.target.files[0]; if (!file) return;
    setImportFile(file); setImportMsg(null);
    try {
      const parsed = await parseExcelNoleggio(file);
      setImportPreview(parsed);
    } catch(err) { setImportMsg({type:'error', text:'Errore: '+err.message}); }
  }

  async function parseExcelNoleggio(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const wb = window.XLSX.read(e.target.result, {type:'array'});
          const ws = wb.Sheets[wb.SheetNames[0]] || wb.Sheets['Foglio3'];
          const data = window.XLSX.utils.sheet_to_json(ws, {header:1, defval:null});
          const SKIP = new Set(['GIORNI','ABBONAMENTO','LISTINO NOLEGGIO','I PREZZI SONO AL GIORNO IVA INCLUSA']);
          const machines = [];
          data.forEach((row, i) => {
            if (i < 3) return;
            const nome = row[1]; if (!nome||typeof nome!=='string') return;
            const nt = nome.trim(); if (!nt||SKIP.has(nt)) return;
            const prezzi = [2,3,4,5,6].map(c => typeof row[c]==='number' ? row[c] : null);
            if (prezzi.every(p=>p===null)) return;
            machines.push({nome:nt, prezzi});
          });
          res(machines);
        } catch(err) { rej(err); }
      };
      reader.onerror = rej;
      reader.readAsArrayBuffer(file);
    });
  }

  async function eseguiImport() {
    if (!importPreview?.length) return;
    setImportLoading(true); setImportMsg(null);
    const lc = LISTINI.find(l=>l.key===importTipo);
    let aggiornate=0, nuove=0, errori=0;
    for (const m of importPreview) {
      try {
        let { data: ex } = await supabase.from('noleggio_macchine').select('id').ilike('nome',m.nome).limit(1);
        let mid;
        if (ex?.length) { mid=ex[0].id; aggiornate++; }
        else {
          const { data: ins } = await supabase.from('noleggio_macchine').insert({nome:m.nome,attiva:true}).select('id').single();
          mid=ins?.id; nuove++;
        }
        for (let j=0;j<FASCE.length;j++) {
          const val=m.prezzi[j]; if (val==null) continue;
          const rec = {macchina_id:mid, fascia:FASCE[j].key, tipo_listino:lc.tipo};
          if (lc.netto) rec.prezzo_netto=val; else rec.prezzo_iva=val;
          await supabase.from('noleggio_listini').upsert(rec,{onConflict:'macchina_id,fascia,tipo_listino'});
        }
      } catch(e) { errori++; }
    }
    setImportLoading(false);
    setImportMsg({type:'success', text:`✅ Import: ${aggiornate} aggiornate, ${nuove} nuove, ${errori} errori`});
    setImportPreview(null); setImportFile(null);
    loadMacchine();
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-500">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2" style={{borderColor:GREEN}}/>
        <p className="text-sm">Caricamento...</p>
      </div>
    </div>
  );
  if (error) return <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"><AlertCircle className="w-4 h-4 inline mr-2"/>Errore: {error}</div>;

  const renderListaMacchine = () => {
    const allStandalone = standalone;
    const famiglie = Object.keys(perFamiglia).sort();

    return (
      <div className="flex-1 overflow-auto">
        {/* Macchine senza famiglia */}
        {allStandalone.map(m => <MacchinaRow key={m.id} m={m} selezionata={macchinaSelezionata?.id===m.id} onSelect={selezionaMacchina}/>)}

        {/* Famiglie */}
        {famiglie.map(fam => {
          const items = perFamiglia[fam];
          const open = !famiglieFold[fam];
          const hasAccessori = macchine.some(m => m.is_accessorio && m.famiglia===fam);
          return (
            <div key={fam}>
              {/* Header famiglia */}
              <button
                onClick={() => toggleFamiglia(fam)}
                className="w-full flex items-center justify-between px-3 py-1.5 bg-gray-100 border-y border-gray-200 hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  {open ? <ChevronDown className="w-3.5 h-3.5 text-gray-500"/> : <ChevronRight className="w-3.5 h-3.5 text-gray-500"/>}
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{fam}</span>
                  {hasAccessori && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">+accessori</span>}
                </div>
                <span className="text-xs text-gray-400">{items.length}</span>
              </button>
              {open && items.map(m => <MacchinaRow key={m.id} m={m} selezionata={macchinaSelezionata?.id===m.id} onSelect={selezionaMacchina} indent/>)}
            </div>
          );
        })}

        {allStandalone.length===0 && famiglie.length===0 && (
          <p className="text-sm text-gray-400 text-center mt-8">Nessuna macchina trovata</p>
        )}
      </div>
    );
  };

  return (
    <div className="relative flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="text-white p-4 shadow" style={{backgroundColor:GREEN}}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('home')}
              className="bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-lg font-bold">🔑 Noleggio</h1>
              <p className="text-xs opacity-75">{macchine.filter(m=>!m.is_accessorio).length} macchine · {macchine.filter(m=>m.is_accessorio).length} accessori</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>{ setArchivioTab(true); loadArchivio(); }}
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-medium">
              📂 Archivio
            </button>
            <button onClick={()=>{setTab('import');setMacchinaSelezionata(null);}}
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-medium">
              <Upload className="w-3.5 h-3.5"/> Aggiorna listino
            </button>
          </div>
        </div>
      </div>

      {/* Tab Archivio */}
      {mainTab === 'archivio' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-gray-700">📋 Preventivi salvati</p>
            <button onClick={()=>setMainTab('noleggio')} className="text-xs text-green-700 hover:underline">← Torna al noleggio</button>
          </div>
          {archivioLoading && <p className="text-sm text-gray-400 text-center py-8">Caricamento...</p>}
          {!archivioLoading && archivioData.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Archive className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nessun preventivo salvato</p>
              <p className="text-xs mt-1">I preventivi PDF vengono salvati automaticamente</p>
            </div>
          )}
          {archivioData.map(record => (
            <div key={record.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b bg-gray-50 flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-gray-800 text-sm">{record.nome_cliente || 'Cliente non specificato'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(record.created_at).toLocaleDateString('it-IT', {day:'2-digit',month:'long',year:'numeric'})}
                    {record.data_da && ` · ${new Date(record.data_da).toLocaleDateString('it-IT')}${record.data_a?' → '+new Date(record.data_a).toLocaleDateString('it-IT'):''}`}
                  </p>
                </div>
                <p className="font-bold text-sm shrink-0" style={{color:GREEN}}>{fmt(record.totale_preventivo)}</p>
              </div>
              <div className="px-4 py-2 space-y-0.5">
                {(record.carrello || []).map((voce, i) => (
                  <p key={i} className="text-xs text-gray-600">• {voce.macchina?.nome} — {FASCE.find(f=>f.key===voce.fasciaScelta)?.label||voce.fasciaScelta} · {fmt(voce.subtotale)}</p>
                ))}
              </div>
              <div className="px-4 py-3 border-t flex gap-2">
                <button onClick={()=>handleRidownload(record)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-white text-xs font-bold" style={{backgroundColor:GREEN}}>
                  <FileText className="w-3.5 h-3.5"/> Scarica PDF
                </button>
                <button onClick={()=>handleEliminaArchivio(record.id)}
                  className="px-3 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-3.5 h-3.5"/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {mainTab === 'noleggio' && <div className="flex flex-1 overflow-hidden">
        {/* Pannello sinistro */}
        <div className="w-72 flex flex-col border-r bg-white overflow-hidden shrink-0">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
              <input type="text" placeholder="Cerca macchina..." className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
                value={cerca} onChange={e=>setCerca(e.target.value)}/>
              {cerca && <button onClick={()=>setCerca('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"><X className="w-4 h-4"/></button>}
            </div>
          </div>
          <div className="px-3 py-2 border-b flex gap-1 flex-wrap">
            {CATEGORIE.map(cat=>(
              <button key={cat.key} onClick={()=>setCatFiltro(cat.key)}
                className={`text-xs px-2 py-1 rounded-full border transition-colors ${catFiltro===cat.key?'text-white border-transparent':'bg-white text-gray-600 border-gray-200'}`}
                style={catFiltro===cat.key?{backgroundColor:GREEN}:{}}>
                {cat.label}
              </button>
            ))}
          </div>
          {renderListaMacchine()}
        </div>

        {/* Pannello destro */}
        <div className="flex-1 overflow-auto p-4">

          {/* Import */}
          {tab==='import' && (
            <div className="max-w-lg mx-auto">
              <h2 className="text-lg font-bold text-gray-800 mb-4">📥 Aggiorna listino noleggio</h2>
              <div className="bg-white rounded-xl shadow-sm border p-5 space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1">Tipo listino nel file</label>
                  <div className="flex gap-2 flex-wrap">
                    {LISTINI.map(l=>(
                      <button key={l.key} onClick={()=>setImportTipo(l.key)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${importTipo===l.key?'text-white border-transparent':'bg-white text-gray-600 border-gray-200'}`}
                        style={importTipo===l.key?{backgroundColor:GREEN}:{}}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1">File Excel</label>
                  <label className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-200 rounded-lg p-6 cursor-pointer hover:border-green-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-300"/>
                    <span className="text-sm text-gray-500">{importFile?importFile.name:'Carica file Excel noleggio (.xlsx)'}</span>
                    <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImportFile}/>
                  </label>
                </div>
                {importPreview && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm font-bold text-green-800 mb-2">{importPreview.length} macchine trovate</p>
                    <div className="max-h-36 overflow-auto text-xs text-green-700 space-y-0.5">
                      {importPreview.slice(0,20).map((m,i)=>(
                        <div key={i} className="flex justify-between">
                          <span className="truncate flex-1">{m.nome}</span>
                          <span className="ml-2 text-green-500">{m.prezzi.filter(Boolean).length} fasce</span>
                        </div>
                      ))}
                      {importPreview.length>20&&<p className="text-green-500">...+{importPreview.length-20}</p>}
                    </div>
                    <button onClick={eseguiImport} disabled={importLoading}
                      className="mt-3 w-full py-2 rounded-lg text-white font-bold text-sm"
                      style={{backgroundColor:GREEN}}>
                      {importLoading?'Importazione...':`✅ Conferma (${importPreview.length} macchine)`}
                    </button>
                  </div>
                )}
                {importMsg && (
                  <div className={`p-3 rounded-lg text-sm ${importMsg.type==='success'?'bg-green-50 text-green-700 border border-green-200':'bg-red-50 text-red-700 border border-red-200'}`}>
                    {importMsg.text}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Vuoto */}
          {tab!=='import' && !macchinaSelezionata && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-6xl mb-4">🔑</div>
              <p className="text-lg font-medium">Seleziona una macchina</p>
              <p className="text-sm mt-1">Scegli dalla lista a sinistra</p>
            </div>
          )}

          {/* Scheda macchina */}
          {tab!=='import' && macchinaSelezionata && (
            <div className="max-w-2xl mx-auto">
              {/* Famiglia: sorelle */}
              {fratelli.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide px-1 mb-1.5">
                    📁 Famiglia {macchinaSelezionata.famiglia}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {/* Macchina corrente */}
                    <div className="flex flex-col px-3 py-2 rounded-lg text-white text-sm font-bold shadow-sm" style={{backgroundColor:'#006B3F'}}>
                      <span className="text-xs text-green-200 mb-0.5">Selezionata</span>
                      {macchinaSelezionata.nome}
                    </div>
                    {/* Sorelle */}
                    {fratelli.map(f => (
                      <button key={f.id}
                        onClick={() => selezionaMacchina(f)}
                        className="flex flex-col px-3 py-2 rounded-lg border-2 border-green-200 bg-green-50 text-green-800 text-sm font-medium hover:border-green-400 hover:bg-green-100 transition-colors text-left">
                        <span className="text-xs text-green-400 mb-0.5">Passa a →</span>
                        {f.nome}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Info macchina */}
              <div className="bg-white rounded-xl shadow-sm border p-4 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{macchinaSelezionata.nome}</h2>
                    {macchinaSelezionata.note_tecniche && <p className="text-sm text-gray-500 mt-1">📌 {macchinaSelezionata.note_tecniche}</p>}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {macchinaSelezionata.carburante && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">⛽ {macchinaSelezionata.carburante}</span>}
                      {macchinaSelezionata.famiglia && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">📁 {macchinaSelezionata.famiglia}</span>}
                      {macchinaSelezionata.deposito_cauzionale
                        ? <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">🏦 Dep. {fmt(macchinaSelezionata.deposito_cauzionale)}</span>
                        : <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">🏦 Deposito: da definire</span>}
                    </div>
                  </div>
                  <button onClick={()=>setMacchinaSelezionata(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
                </div>

                {/* Accessori disponibili */}
                {accessoriDisponibili.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Accessori disponibili</p>
                    <div className="flex flex-wrap gap-2">
                      {accessoriDisponibili.map(acc => {
                        const sel = accessoriSelezionati.find(a=>a.id===acc.id);
                        const p = getPrezzoFascia(acc, fasciaScelta||'uno_giorno', listino);
                        return (
                          <button key={acc.id} onClick={()=>toggleAccessorio(acc)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors ${sel?'text-white border-transparent':'bg-white text-gray-600 border-gray-200 hover:border-green-300'}`}
                            style={sel?{backgroundColor:GREEN}:{}}>
                            {sel && <Check className="w-3.5 h-3.5"/>}
                            <span>{acc.nome}</span>
                            {p && <span className={`text-xs ${sel?'text-green-100':'text-gray-400'}`}>{fmt(p)}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Tab */}
              <div className="flex gap-2 mb-4">
                <button onClick={()=>setTab('listino')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab==='listino'?'text-white':'bg-white text-gray-600 border'}`}
                  style={tab==='listino'?{backgroundColor:GREEN}:{}}>
                  📋 Listino
                </button>
                <button onClick={()=>setTab('preventivo')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab==='preventivo'?'text-white':'bg-white text-gray-600 border'}`}
                  style={tab==='preventivo'?{backgroundColor:GREEN}:{}}>
                  📄 Preventivo
                </button>
              </div>

              {/* Tab Listino */}
              {tab==='listino' && (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="p-3 border-b flex gap-2 flex-wrap">
                    {LISTINI.map(l=>(
                      <button key={l.key} onClick={()=>setListino(l.key)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${listino===l.key?'text-white border-transparent':'bg-white text-gray-600 border-gray-200'}`}
                        style={listino===l.key?{backgroundColor:GREEN}:{}}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                  <table className="w-full">
                    <thead><tr className="bg-gray-50 border-b">
                      <th className="text-left text-xs font-bold text-gray-500 px-4 py-2.5">Fascia</th>
                      <th className="text-right text-xs font-bold text-gray-500 px-4 py-2.5">Macchina</th>
                      {accessoriSelezionati.length>0 && <th className="text-right text-xs font-bold text-gray-500 px-4 py-2.5">+Accessori</th>}
                      <th className="w-8"></th>
                    </tr></thead>
                    <tbody>
                      {FASCE.map(f=>{
                        const p = getPrezzoFascia(macchinaSelezionata, f.key, listino);
                        const pAcc = accessoriSelezionati.reduce((s,a)=>{const ap=getPrezzoFascia(a,f.key,listino);return s+(ap||0);},0);
                        const sel = fasciaScelta===f.key;
                        return (
                          <tr key={f.key} onClick={()=>p!=null&&setFasciaScelta(f.key)}
                            className={`border-b transition-colors ${p!=null?'cursor-pointer hover:bg-green-50':'opacity-40'} ${sel?'bg-green-50':''}`}>
                            <td className="px-4 py-3"><span className={`text-sm ${sel?'font-bold':'font-medium'} text-gray-800`}>{f.label}</span></td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-sm font-bold" style={sel?{color:GREEN}:{color:'#374151'}}>{fmt(p)}</span>
                            </td>
                            {accessoriSelezionati.length>0 && (
                              <td className="px-4 py-3 text-right">
                                <span className="text-xs text-green-600">{pAcc>0?fmt(pAcc):''}</span>
                              </td>
                            )}
                            <td className="pr-3">{sel&&<Check className="w-4 h-4" style={{color:GREEN}}/>}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {fasciaScelta && (
                    <div className="p-3 bg-green-50 border-t flex items-center justify-between">
                      <div>
                        <p className="text-xs text-green-600">Fascia selezionata</p>
                        <p className="text-sm font-bold" style={{color:GREEN}}>
                          {FASCE.find(f=>f.key===fasciaScelta)?.label} — {fmt(getPrezzoFascia(macchinaSelezionata,fasciaScelta,listino))}/gg
                          {accessoriSelezionati.length>0 && ` + ${accessoriSelezionati.length} accessori`}
                        </p>
                      </div>
                      <button onClick={()=>setTab('preventivo')} className="text-white px-4 py-2 rounded-lg text-sm font-bold" style={{backgroundColor:GREEN}}>
                        Preventivo →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tab Preventivo */}
              {tab==='preventivo' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl shadow-sm border p-4">
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Listino</label>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {LISTINI.map(l=>(
                        <button key={l.key} onClick={()=>setListino(l.key)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${listino===l.key?'text-white border-transparent':'bg-white text-gray-600 border-gray-200'}`}
                          style={listino===l.key?{backgroundColor:GREEN}:{}}>
                          {l.label}
                        </button>
                      ))}
                    </div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Fascia giorni</label>
                    <div className="grid grid-cols-2 gap-2">
                      {FASCE.map(f=>{
                        const p = getPrezzoFascia(macchinaSelezionata,f.key,listino);
                        const sel = fasciaScelta===f.key;
                        return (
                          <button key={f.key} onClick={()=>p!=null&&setFasciaScelta(f.key)} disabled={p==null}
                            className={`p-2 rounded-lg border text-sm text-left transition-colors ${sel?'text-white border-transparent':p!=null?'bg-white text-gray-700 border-gray-200 hover:border-green-300':'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'}`}
                            style={sel?{backgroundColor:GREEN}:{}}>
                            <span className="font-medium block">{f.label}</span>
                            <span className={`text-xs ${sel?'text-green-100':'text-gray-400'}`}>{fmt(p)}/gg</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border p-4 space-y-3">
                    <input type="text" placeholder="Nome cliente" className="w-full p-2.5 border rounded-lg text-sm" value={cliente} onChange={e=>setCliente(e.target.value)}/>
                    <div className="flex gap-2">
                      <div className="flex-1"><label className="text-xs text-gray-400 block mb-1">Data inizio</label><input type="date" className="w-full p-2 border rounded-lg text-sm" value={dataDa} onChange={e=>setDataDa(e.target.value)}/></div>
                      <div className="flex-1"><label className="text-xs text-gray-400 block mb-1">Data fine</label><input type="date" className="w-full p-2 border rounded-lg text-sm" value={dataA} onChange={e=>setDataA(e.target.value)}/></div>
                    </div>
                    {dataDa&&dataA&&<p className="text-sm font-medium" style={{color:GREEN}}>📅 {nGiorni} giorn{nGiorni===1?'o':'i'}</p>}
                    <textarea rows={3} className="w-full p-2.5 border rounded-lg text-sm resize-none" placeholder="Note / condizioni..." value={noteNoleggio} onChange={e=>setNoteNoleggio(e.target.value)}/>
                  </div>

                  {fasciaScelta && totale!=null && (
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                      <div className="p-4 border-b">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-2">Riepilogo</p>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex justify-between"><span>{macchinaSelezionata.nome}</span><span className="font-medium">{fmt(getPrezzoFascia(macchinaSelezionata,fasciaScelta,listino))}/gg</span></div>
                          {accessoriSelezionati.map(a=>(
                            <div key={a.id} className="flex justify-between text-green-700">
                              <span className="pl-3">↳ {a.nome}</span>
                              <span>{fmt(getPrezzoFascia(a,fasciaScelta,listino))}/gg</span>
                            </div>
                          ))}
                          {nGiorni>1 && fasciaScelta!=='mezzo_giorno' && <div className="flex justify-between"><span>Giorni</span><span>{nGiorni}</span></div>}
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t">
                          <span className="font-bold text-gray-800">TOTALE</span>
                          <span className="text-xl font-bold" style={{color:GREEN}}>{fmt(totale)}</span>
                        </div>
                        {macchinaSelezionata.deposito_cauzionale && (
                          <div className="flex justify-between text-sm text-blue-600 mt-1">
                            <span>Deposito cauzionale</span>
                            <span className="font-medium">{fmt(macchinaSelezionata.deposito_cauzionale)}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <button onClick={aggiungiAlCarrello}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white font-bold text-sm" style={{backgroundColor:GREEN}}>
                          ➕ Aggiungi al preventivo
                        </button>
                      </div>
                    </div>
                  )}
                  {!fasciaScelta && <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">⚠️ Seleziona una fascia giorni</div>}
                </div>
              )}

            </div>
          )}

          {/* ── Carrello preventivo — sempre visibile se ci sono voci ── */}
          {tab!=='import' && carrello.length > 0 && (
            <div className="max-w-2xl mx-auto space-y-3 pb-6">
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">📋 Preventivo ({carrello.length} voc{carrello.length===1?'e':'i'})</p>
                <button onClick={() => setCarrello([])} className="text-xs text-red-500 hover:text-red-700">Svuota tutto</button>
              </div>

              {carrello.map((voce, idx) => {
                const fasciaLabel = FASCE.find(f=>f.key===voce.fasciaScelta)?.label||voce.fasciaScelta;
                return (
                  <div key={voce.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50">
                      <span className="text-sm font-bold text-gray-800">{idx+1}. {voce.macchina.nome}</span>
                      <button onClick={() => rimuoviDalCarrello(voce.id)} className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
                    </div>
                    <div className="px-3 py-2 text-xs text-gray-500 space-y-0.5">
                      <p>{fasciaLabel} · {voce.nGiorni} giorno/i</p>
                      {voce.accessori.map(a => <p key={a.id} className="pl-2 text-green-700">↳ {a.nome}</p>)}
                    </div>
                    <div className="px-3 py-2 border-t flex justify-between items-center">
                      <span className="text-xs text-gray-400">Subtotale</span>
                      <span className="font-bold text-sm" style={{color:GREEN}}>{fmt(voce.subtotale)}</span>
                    </div>
                  </div>
                );
              })}

              <div className="bg-white rounded-xl border overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <span className="font-bold text-gray-800">TOTALE COMPLESSIVO</span>
                  <span className="text-2xl font-bold" style={{color:GREEN}}>{fmt(totaleCarrello)}</span>
                </div>
                <div className="p-4 flex gap-3">
                  <button onClick={async()=>{
                      await generaPDFCarrello({carrello,cliente,dataDa,dataA,note:noteNoleggio,totaleCarrello});
                      const ng = dataDa&&dataA ? Math.max(1,Math.round((new Date(dataA)-new Date(dataDa))/(1000*60*60*24))) : 1;
                      await salvaArchivioNoleggio({ nome_cliente:cliente||null, data_da:dataDa||null, data_a:dataA||null, n_giorni:ng, totale_preventivo:totaleCarrello, note:noteNoleggio||null, carrello });
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-white font-bold text-sm" style={{backgroundColor:GREEN}}>
                    <FileText className="w-4 h-4"/> PDF
                  </button>
                  <button onClick={()=>generaWhatsAppCarrello({carrello,cliente,dataDa,dataA,note:noteNoleggio,totaleCarrello})}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm bg-[#25D366] text-white">
                    <MessageCircle className="w-4 h-4"/> WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Overlay Archivio ───────────────────────────────────────────── */}
      {archivioTab && (
        <div className="absolute inset-0 bg-gray-50 z-20 flex flex-col">
          <div className="text-white p-4 shadow flex items-center justify-between" style={{backgroundColor:GREEN}}>
            <div className="flex items-center gap-3">
              <button onClick={()=>setArchivioTab(false)} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-lg">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="font-bold">📂 Archivio preventivi noleggio</h2>
            </div>
            <button onClick={loadArchivio} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-lg" title="Aggiorna">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {archivioLoading && <p className="text-center text-gray-400 py-8">Caricamento...</p>}
            {!archivioLoading && archivioData.length === 0 && (
              <p className="text-center text-gray-400 py-8">Nessun preventivo salvato</p>
            )}
            {archivioData.map(record => {
              const voci = record.carrello || [];
              return (
                <div key={record.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{record.nome_cliente || 'Cliente non specificato'}</p>
                      <p className="text-xs text-gray-400">{new Date(record.created_at).toLocaleDateString('it-IT', {day:'2-digit',month:'long',year:'numeric'})}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg" style={{color:GREEN}}>{fmt(record.totale_preventivo)}</p>
                      {record.data_da && <p className="text-xs text-gray-400">{new Date(record.data_da).toLocaleDateString('it-IT')} → {record.data_a ? new Date(record.data_a).toLocaleDateString('it-IT') : '?'}</p>}
                    </div>
                  </div>
                  <div className="px-4 py-2 space-y-1">
                    {voci.map((voce, i) => {
                      const fasciaLabel = FASCE.find(f=>f.key===voce.fasciaScelta)?.label||voce.fasciaScelta||'';
                      return (
                        <div key={i} className="text-sm text-gray-600 flex justify-between">
                          <span>{voce.macchina?.nome}</span>
                          <span className="text-gray-400">{fasciaLabel} · {fmt(voce.subtotale)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="px-4 py-3 border-t flex gap-2">
                    <button onClick={()=>rigenePDF(record)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-white text-sm font-bold" style={{backgroundColor:GREEN}}>
                      <FileText className="w-4 h-4"/> PDF
                    </button>
                    <button onClick={()=>handleEliminaArchivio(record.id)}
                      className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      )}
    </div>
  );
}

// ─── Componente riga macchina ────────────────────────────────────────────────
function MacchinaRow({ m, selezionata, onSelect, indent }) {
  return (
    <button onClick={()=>onSelect(m)}
      className={`w-full text-left px-3 py-2.5 border-b hover:bg-green-50 transition-colors border-l-4 ${selezionata?'bg-green-50':'border-l-transparent'} ${indent?'pl-5':''}`}
      style={selezionata?{borderLeftColor:'#006B3F'}:{}}>
      <p className="text-sm font-medium text-gray-800 leading-tight">{m.nome}</p>
      {m.note_tecniche && <p className="text-xs text-gray-400 mt-0.5 leading-tight line-clamp-1">{m.note_tecniche}</p>}
      <div className="flex gap-1 mt-1">
        {m.carburante && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 rounded">{m.carburante}</span>}
      </div>
    </button>
  );
}
