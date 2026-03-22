import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, Search, Filter, FileText, MessageCircle,
  CheckCircle, Trash2, Clock, ChevronDown, ChevronUp,
  AlertTriangle, RefreshCw, Calendar, User, Package
} from 'lucide-react';
import { supabase } from '../store';
import CommissioneModal from './CommissioneModal';

const OPERATORE_KEY = 'ompra_ultimo_operatore';

function getOperatoreLoggato() {
  try { return localStorage.getItem(OPERATORE_KEY) || ''; } catch { return ''; }
}

// Calcola stato effettivo del preventivo
function getStatoEffettivo(prev) {
  if (prev.stato_preventivo === 'confermato') return 'confermato';
  const creato = new Date(prev.data_vendita || prev.created_at);
  const oggi = new Date();
  const giorniPassati = Math.floor((oggi - creato) / (1000 * 60 * 60 * 24));
  if (giorniPassati >= 30) return 'scaduto';
  return 'in_attesa';
}

function getGiorniRimanenti(prev) {
  const creato = new Date(prev.data_vendita || prev.created_at);
  const oggi = new Date();
  const giorniPassati = Math.floor((oggi - creato) / (1000 * 60 * 60 * 24));
  return Math.max(0, 30 - giorniPassati);
}

function StatoBadge({ stato }) {
  if (stato === 'confermato') return (
    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">✅ Confermato</span>
  );
  if (stato === 'scaduto') return (
    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">🔴 Scaduto</span>
  );
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800">🟡 In attesa</span>
  );
}

// Mappa un record DB → formato CommissioneModal
function dbToModalData(prev) {
  const prodotti = Array.isArray(prev.prodotti) ? prev.prodotti : [];
  const accessori = Array.isArray(prev.accessori) ? prev.accessori : [];
  const isKit = prodotti.length > 1;

  if (isKit) {
    return {
      isPreventivo: true,
      confirmed: true,
      cliente: prev.cliente,
      clienteInfo: prev.cliente_info || null,
      telefono: prev.telefono || null,
      operatore: prev.operatore,
      prodotti,
      accessori,
      totale: prev.totale,
      caparra: prev.caparra || 0,
      metodoPagamento: prev.metodo_pagamento || null,
      note: prev.note || null,
      tipoDocumento: prev.tipo_documento || 'fattura',
      ivaCompresa: prev.iva_compresa !== false,
      dataVendita: prev.data_vendita,
    };
  }

  // singolo prodotto
  const p = prodotti[0] || {};
  return {
    isPreventivo: true,
    confirmed: true,
    cliente: prev.cliente,
    clienteInfo: prev.cliente_info || null,
    telefono: prev.telefono || null,
    operatore: prev.operatore,
    saleData: {
      brand: p.brand,
      model: p.model,
      serialNumber: p.serialNumber || null,
      prezzo: p.prezzo || 0,
      isOmaggio: p.isOmaggio || false,
      accessori,
      cliente: prev.cliente,
    },
    accessori,
    totale: prev.totale,
    caparra: prev.caparra || 0,
    metodoPagamento: prev.metodo_pagamento || null,
    note: prev.note || null,
    tipoDocumento: prev.tipo_documento || 'fattura',
    ivaCompresa: prev.iva_compresa !== false,
    dataVendita: prev.data_vendita,
  };
}

export default function ArchivioPreventivi({ onNavigate }) {
  const operatoreLoggato = getOperatoreLoggato();
  const isAdmin = operatoreLoggato.toLowerCase() === 'admin';

  const [preventivi, setPreventivi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtri
  const [cercaCliente, setCercaCliente] = useState('');
  const [filtroOperatore, setFiltroOperatore] = useState('');
  const [filtroStato, setFiltroStato] = useState('');
  const [dataDal, setDataDal] = useState('');
  const [dataAl, setDataAl] = useState('');
  const [showFiltri, setShowFiltri] = useState(false);

  // Operatori disponibili (per filtro)
  const [operatori, setOperatori] = useState([]);

  // Modal anteprima PDF
  const [modalData, setModalData] = useState(null);

  // Dialog conferma conversione
  const [convertendo, setConvertendo] = useState(null); // preventivo da convertire
  const [loadingConverti, setLoadingConverti] = useState(false);

  // Dialog conferma eliminazione
  const [eliminando, setEliminando] = useState(null);
  const [loadingElimina, setLoadingElimina] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (msg, tipo = 'success') => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const caricaPreventivi = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let q = supabase
        .from('commissioni')
        .select('*')
        .eq('is_preventivo', true)
        .order('data_vendita', { ascending: false });

      if (!isAdmin) {
        q = q.eq('operatore', operatoreLoggato);
      }

      const { data, error: err } = await q;
      if (err) throw err;
      setPreventivi(data || []);

      // Estrai operatori unici
      const ops = [...new Set((data || []).map(p => p.operatore).filter(Boolean))];
      setOperatori(ops.sort());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, operatoreLoggato]);

  useEffect(() => { caricaPreventivi(); }, [caricaPreventivi]);

  // Filtra lato client
  const preventiviFiltrati = preventivi.filter(p => {
    const stato = getStatoEffettivo(p);
    if (filtroStato && stato !== filtroStato) return false;
    if (filtroOperatore && p.operatore !== filtroOperatore) return false;
    if (cercaCliente && !p.cliente?.toLowerCase().includes(cercaCliente.toLowerCase())) return false;
    if (dataDal) {
      const data = new Date(p.data_vendita || p.created_at);
      if (data < new Date(dataDal)) return false;
    }
    if (dataAl) {
      const data = new Date(p.data_vendita || p.created_at);
      if (data > new Date(dataAl + 'T23:59:59')) return false;
    }
    return true;
  });

  // Preventivi in scadenza entro 3 giorni (in_attesa)
  const inScadenza = preventivi.filter(p => {
    const stato = getStatoEffettivo(p);
    if (stato !== 'in_attesa') return false;
    return getGiorniRimanenti(p) <= 3;
  });

  // ── Converti in Commissione ──────────────────────────────
  const handleConverti = async () => {
    if (!convertendo) return;
    setLoadingConverti(true);
    try {
      const { error: err } = await supabase
        .from('commissioni')
        .update({
          is_preventivo: false,
          stato_preventivo: 'confermato',
          data_vendita: new Date().toISOString(),
          status: 'completed',
        })
        .eq('id', convertendo.id);

      if (err) throw err;

      // Scarica inventario per prodotti con matricola
      const prodotti = Array.isArray(convertendo.prodotti) ? convertendo.prodotti : [];
      for (const prod of prodotti) {
        if (prod.serialNumber) {
          try {
            await supabase
              .from('inventory')
              .update({ status: 'sold', cliente: convertendo.cliente })
              .eq('serial_number', prod.serialNumber);
          } catch (e) {
            console.warn('Inventario non scaricato per SN:', prod.serialNumber, e);
          }
        }
      }

      setConvertendo(null);
      showToast('✅ Commissione registrata con successo!', 'success');
      caricaPreventivi();
    } catch (e) {
      showToast('Errore: ' + e.message, 'error');
    } finally {
      setLoadingConverti(false);
    }
  };

  // ── Elimina ──────────────────────────────────────────────
  const handleElimina = async () => {
    if (!eliminando) return;
    setLoadingElimina(true);
    try {
      const { error: err } = await supabase
        .from('commissioni')
        .delete()
        .eq('id', eliminando.id);
      if (err) throw err;
      setEliminando(null);
      showToast('Preventivo eliminato', 'info');
      caricaPreventivi();
    } catch (e) {
      showToast('Errore: ' + e.message, 'error');
    } finally {
      setLoadingElimina(false);
    }
  };

  // ── WhatsApp ─────────────────────────────────────────────
  const handleWhatsApp = (prev) => {
    const prodotti = Array.isArray(prev.prodotti) ? prev.prodotti : [];
    const telefono = prev.telefono?.replace(/\D/g, '');
    const totale = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(prev.totale || 0);
    const elenco = prodotti.map(p => `• ${p.brand} ${p.model}`).join('\n');
    const testo = `Gentile ${prev.cliente},\nle inviamo il preventivo OMPRA:\n\n${elenco}\n\nTotale: ${totale}\n\nIl preventivo è valido 30 giorni.\nPer info: OMPRA srl`;
    const url = telefono
      ? `https://wa.me/39${telefono}?text=${encodeURIComponent(testo)}`
      : `https://wa.me/?text=${encodeURIComponent(testo)}`;
    window.open(url, '_blank');
  };

  const formatData = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatValuta = (v) =>
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(v || 0);

  // ── Se modal PDF aperto ──────────────────────────────────
  if (modalData) {
    const isKit = Array.isArray(modalData.prodotti) && modalData.prodotti.length > 1;
    return (
      <CommissioneModal
        data={modalData}
        isKit={isKit}
        onBack={() => setModalData(null)}
        onClose={() => setModalData(null)}
        onConfirm={() => setModalData(null)}
        isSaving={false}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <div className="px-4 py-3 text-white flex items-center gap-3" style={{ backgroundColor: '#F97316' }}>
        <button onClick={() => onNavigate('home')} className="p-1.5 rounded-lg bg-white/20 active:bg-white/30">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold leading-none">Archivio Preventivi</h1>
          <p className="text-white/80 text-xs mt-0.5">{preventiviFiltrati.length} preventiv{preventiviFiltrati.length === 1 ? 'o' : 'i'}</p>
        </div>
        <button
          onClick={caricaPreventivi}
          className="p-1.5 rounded-lg bg-white/20 active:bg-white/30"
          disabled={loading}
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 px-3 py-3 flex flex-col gap-3">

        {/* Alert scadenza */}
        {inScadenza.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-red-700 text-sm font-medium">
              {inScadenza.length} preventiv{inScadenza.length > 1 ? 'i scadono' : 'o scade'} entro 3 giorni
            </p>
          </div>
        )}

        {/* Barra ricerca + toggle filtri */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca cliente..."
              value={cercaCliente}
              onChange={e => setCercaCliente(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
          <button
            onClick={() => setShowFiltri(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFiltri ? 'bg-orange-50 border-orange-300 text-orange-700' : 'bg-white border-gray-200 text-gray-600'}`}
          >
            <Filter className="w-4 h-4" />
            Filtri
            {showFiltri ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Pannello filtri espandibile */}
        {showFiltri && (
          <div className="bg-white rounded-xl border border-gray-200 p-3 flex flex-col gap-2.5">
            {/* Stato */}
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1 block">Stato</label>
              <div className="flex gap-2 flex-wrap">
                {['', 'in_attesa', 'confermato', 'scaduto'].map(s => (
                  <button
                    key={s}
                    onClick={() => setFiltroStato(s)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${filtroStato === s ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200'}`}
                  >
                    {s === '' ? 'Tutti' : s === 'in_attesa' ? '🟡 In attesa' : s === 'confermato' ? '✅ Confermato' : '🔴 Scaduto'}
                  </button>
                ))}
              </div>
            </div>

            {/* Operatore (solo admin) */}
            {isAdmin && operatori.length > 0 && (
              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1 block">Operatore</label>
                <select
                  value={filtroOperatore}
                  onChange={e => setFiltroOperatore(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-orange-400"
                >
                  <option value="">Tutti gli operatori</option>
                  {operatori.map(op => <option key={op} value={op}>{op}</option>)}
                </select>
              </div>
            )}

            {/* Range date */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1 block flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Dal
                </label>
                <input
                  type="date"
                  value={dataDal}
                  onChange={e => setDataDal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-orange-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1 block flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Al
                </label>
                <input
                  type="date"
                  value={dataAl}
                  onChange={e => setDataAl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-orange-400"
                />
              </div>
            </div>

            {/* Reset filtri */}
            {(filtroStato || filtroOperatore || dataDal || dataAl) && (
              <button
                onClick={() => { setFiltroStato(''); setFiltroOperatore(''); setDataDal(''); setDataAl(''); }}
                className="text-xs text-orange-600 font-semibold text-center py-1"
              >
                ✕ Rimuovi filtri
              </button>
            )}
          </div>
        )}

        {/* Loading / Error */}
        {loading && (
          <div className="flex items-center justify-center py-12 text-gray-400">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span className="text-sm">Caricamento...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
            Errore: {error}
          </div>
        )}

        {/* Lista vuota */}
        {!loading && !error && preventiviFiltrati.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
            <FileText className="w-12 h-12 opacity-30" />
            <p className="text-sm font-medium">Nessun preventivo trovato</p>
            {(filtroStato || filtroOperatore || cercaCliente || dataDal || dataAl) && (
              <p className="text-xs">Prova a modificare i filtri</p>
            )}
          </div>
        )}

        {/* Cards preventivi */}
        {!loading && preventiviFiltrati.map(prev => {
          const stato = getStatoEffettivo(prev);
          const prodotti = Array.isArray(prev.prodotti) ? prev.prodotti : [];
          const giorniRim = getGiorniRimanenti(prev);
          const isInAttesa = stato === 'in_attesa';

          return (
            <div
              key={prev.id}
              className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${stato === 'scaduto' ? 'border-red-200 opacity-75' : stato === 'confermato' ? 'border-green-200' : 'border-orange-100'}`}
            >
              {/* Card header */}
              <div className={`px-4 py-3 flex items-start justify-between ${stato === 'scaduto' ? 'bg-red-50' : stato === 'confermato' ? 'bg-green-50' : 'bg-orange-50'}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900 truncate">{prev.cliente}</span>
                    <StatoBadge stato={stato} />
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatData(prev.data_vendita)}
                    </span>
                    {isAdmin && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {prev.operatore}
                      </span>
                    )}
                    {isInAttesa && giorniRim <= 5 && (
                      <span className={`flex items-center gap-1 font-semibold ${giorniRim <= 3 ? 'text-red-600' : 'text-orange-600'}`}>
                        <Clock className="w-3 h-3" />
                        {giorniRim === 0 ? 'Scade oggi' : `Scade in ${giorniRim}gg`}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right ml-3 shrink-0">
                  <div className="text-lg font-bold text-gray-900">{formatValuta(prev.totale)}</div>
                  {prev.caparra > 0 && (
                    <div className="text-xs text-gray-500">cap. {formatValuta(prev.caparra)}</div>
                  )}
                </div>
              </div>

              {/* Prodotti */}
              <div className="px-4 py-2.5 border-t border-gray-100">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Package className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Prodotti</span>
                </div>
                {prodotti.slice(0, 3).map((p, i) => (
                  <div key={i} className="text-sm text-gray-700 flex items-center gap-1.5 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-300 shrink-0" />
                    <span className="font-medium">{p.brand}</span>
                    <span>{p.model}</span>
                    {p.serialNumber && <span className="text-xs text-gray-400">#{p.serialNumber}</span>}
                    <span className="ml-auto text-xs font-semibold text-gray-600">{formatValuta(p.prezzo)}</span>
                  </div>
                ))}
                {prodotti.length > 3 && (
                  <p className="text-xs text-gray-400 mt-0.5">+{prodotti.length - 3} altri prodotti</p>
                )}
                {prev.note && (
                  <p className="text-xs text-gray-400 mt-1.5 italic border-t border-gray-100 pt-1.5">📝 {prev.note}</p>
                )}
              </div>

              {/* Azioni */}
              <div className="px-3 pb-3 pt-1 grid grid-cols-2 gap-2">
                {/* Anteprima PDF */}
                <button
                  onClick={() => setModalData(dbToModalData(prev))}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 text-xs font-semibold active:scale-95 transition-transform"
                >
                  <FileText className="w-4 h-4" />
                  Anteprima PDF
                </button>

                {/* WhatsApp */}
                <button
                  onClick={() => handleWhatsApp(prev)}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-green-200 bg-green-50 text-green-700 text-xs font-semibold active:scale-95 transition-transform"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>

                {/* Converti (solo se in attesa) */}
                {isInAttesa && (
                  <button
                    onClick={() => setConvertendo(prev)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold active:scale-95 transition-transform"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Converti
                  </button>
                )}

                {/* Elimina */}
                <button
                  onClick={() => setEliminando(prev)}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 text-xs font-semibold active:scale-95 transition-transform ${isInAttesa ? '' : 'col-span-2'}`}
                >
                  <Trash2 className="w-4 h-4" />
                  Elimina
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Dialog Converti ─────────────────────────────────── */}
      {convertendo && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md mx-auto p-5 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-900">Converti in Commissione</h2>
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-sm font-semibold text-gray-800">{convertendo.cliente}</p>
              <p className="text-sm text-gray-600 mt-0.5">{(Array.isArray(convertendo.prodotti) ? convertendo.prodotti : []).map(p => `${p.brand} ${p.model}`).join(', ')}</p>
              <p className="text-base font-bold text-blue-800 mt-1">{formatValuta(convertendo.totale)}</p>
            </div>
            <p className="text-sm text-gray-600">
              Il preventivo diventerà una <strong>commissione completata</strong> con data odierna. L'inventario verrà aggiornato per i prodotti con matricola.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConvertendo(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm"
                disabled={loadingConverti}
              >
                Annulla
              </button>
              <button
                onClick={handleConverti}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
                disabled={loadingConverti}
              >
                {loadingConverti ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {loadingConverti ? 'Conversione...' : 'Conferma'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Dialog Elimina ──────────────────────────────────── */}
      {eliminando && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md mx-auto p-5 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-900">Elimina preventivo?</h2>
            <p className="text-sm text-gray-600">
              Stai per eliminare il preventivo per <strong>{eliminando.cliente}</strong> del {formatData(eliminando.data_vendita)}. L'operazione non è reversibile.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setEliminando(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm"
                disabled={loadingElimina}
              >
                Annulla
              </button>
              <button
                onClick={handleElimina}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
                disabled={loadingElimina}
              >
                {loadingElimina ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {loadingElimina ? 'Eliminazione...' : 'Elimina'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ───────────────────────────────────────────── */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full text-sm font-semibold shadow-lg z-50 transition-all ${toast.tipo === 'success' ? 'bg-green-600 text-white' : toast.tipo === 'error' ? 'bg-red-600 text-white' : 'bg-gray-700 text-white'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
