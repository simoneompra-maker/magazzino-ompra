import { useState, useEffect, useCallback } from 'react';
import { PackagePlus, ShoppingCart, Package, Wifi, WifiOff, History, FileText, Clock, ClipboardList, BookLock, BarChart2, UserCircle, LogOut, UserPlus, Trash2, AlertTriangle, ChevronDown, ChevronUp, ToggleLeft, ToggleRight, Leaf } from 'lucide-react';
import useStore from '../store';
import { supabase } from '../store';

export default function Dashboard({ onNavigate, onCambiaOperatore }) {
  const operatoreLoggato = (() => { try { return localStorage.getItem('ompra_ultimo_operatore') || ''; } catch { return ''; } })();
  const isAdmin = operatoreLoggato.toLowerCase() === 'admin';

  // Gestione operatori (solo Admin)
  const [showGestioneOp, setShowGestioneOp] = useState(false);
  const [operatori, setOperatori] = useState([]);
  const [nuovoOp, setNuovoOp] = useState('');
  const [loadingOp, setLoadingOp] = useState(false);

  const caricaOperatori = async () => {
    setLoadingOp(true);
    const { data } = await supabase.from('operatori').select('nome').order('nome');
    setOperatori(data || []);
    setLoadingOp(false);
  };

  const aggiungiOperatore = async () => {
    const nome = nuovoOp.trim();
    if (!nome) return;
    await supabase.from('operatori').insert({ nome });
    setNuovoOp('');
    caricaOperatori();
  };

  const eliminaOperatore = async (nome) => {
    if (nome === 'Admin') return;
    if (!confirm(`Eliminare l'operatore "${nome}"?`)) return;
    await supabase.from('operatori').delete().eq('nome', nome);
    caricaOperatori();
  };

  // Stock alerts (solo Admin)
  const [stockAlertsEnabled, setStockAlertsEnabled] = useState(false);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [allThresholds, setAllThresholds] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [showStockAlerts, setShowStockAlerts] = useState(false);
  const [showAllThresholds, setShowAllThresholds] = useState(false);
  const [editingThreshold, setEditingThreshold] = useState(null); // { brand, model }
  const [editingValue, setEditingValue] = useState('');

  const loadStockAlerts = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingAlerts(true);
    try {
      // Leggi toggle
      const { data: cfg } = await supabase
        .from('app_config')
        .select('value')
        .eq('key', 'stock_alerts_enabled')
        .single();
      const enabled = cfg?.value === 'true';
      setStockAlertsEnabled(enabled);

      if (!enabled) { setLoadingAlerts(false); return; }

      // Carica tutte le soglie con giacenze correnti
      const { data: thresholds } = await supabase
        .from('stock_thresholds')
        .select('brand, model, min_quantity')
        .order('brand').order('model');

      if (!thresholds?.length) { setLoadingAlerts(false); return; }

      // Carica giacenze available
      const { data: available } = await supabase
        .from('inventory')
        .select('brand, model')
        .eq('status', 'available');

      // Conta per brand+model
      const counts = {};
      (available || []).forEach(({ brand, model }) => {
        const key = `${brand}||${model}`;
        counts[key] = (counts[key] || 0) + 1;
      });

      const enriched = thresholds.map(t => ({
        ...t,
        giacenza: counts[`${t.brand}||${t.model}`] || 0
      }));

      setAllThresholds(enriched);
      setStockAlerts(enriched.filter(t => t.giacenza < t.min_quantity));
    } catch (err) {
      console.error('loadStockAlerts:', err);
    } finally {
      setLoadingAlerts(false);
    }
  }, [isAdmin]);

  const toggleStockAlerts = async () => {
    const newVal = (!stockAlertsEnabled).toString();
    await supabase.from('app_config')
      .update({ value: newVal })
      .eq('key', 'stock_alerts_enabled');
    setStockAlertsEnabled(!stockAlertsEnabled);
    if (newVal === 'true') loadStockAlerts();
    else { setStockAlerts([]); setAllThresholds([]); }
  };

  const saveThreshold = async (brand, model, qty) => {
    const val = parseInt(qty);
    if (isNaN(val) || val < 0) return;
    await supabase.from('stock_thresholds')
      .update({ min_quantity: val })
      .eq('brand', brand).eq('model', model);
    setEditingThreshold(null);
    setEditingValue('');
    loadStockAlerts();
  };

  useEffect(() => {
    if (isAdmin) loadStockAlerts();
  }, [isAdmin, loadStockAlerts]);


  const inventoryCount = useStore((state) =>
    state.inventory.filter(item => item.status === 'available').length
  );
  const salesCount = useStore((state) => {
    const commissioni = state.commissioni;
    if (isAdmin) return commissioni.filter(c => c.status === 'completed').length;
    return commissioni.filter(c => c.status === 'completed' && c.operatore === operatoreLoggato).length;
  });
  const pendingCommissioni = useStore((state) => {
    const commissioni = state.commissioni;
    if (isAdmin) return commissioni.filter(c => c.status === 'pending').length;
    return commissioni.filter(c => c.status === 'pending' && c.operatore === operatoreLoggato).length;
  });

  const getSyncIcon = () => {
    if (syncStatus === 'success') return <Wifi className="w-4 h-4" style={{ color: '#006B3F' }} />;
    if (syncStatus === 'error') return <WifiOff className="w-4 h-4 text-red-500" />;
    if (syncStatus === 'syncing') return <Wifi className="w-4 h-4 text-yellow-500 animate-pulse" />;
    return <Wifi className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="min-h-screen flex flex-col p-3 bg-gray-50">

      {/* Header */}
      <div className="rounded-xl px-4 py-3 mb-3 text-white flex items-center justify-between" style={{ backgroundColor: '#006B3F' }}>
        <div>
          <h1 className="text-2xl font-bold leading-none">OMPRA</h1>
          <p className="text-white/70 text-xs mt-0.5">Gestionale Magazzino</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-white/60">Giacenze</p>
            <p className="text-lg font-bold leading-none">{inventoryCount}</p>
          </div>
          <div className="w-px h-8 bg-white/30" />
          <div className="text-right">
            <p className="text-xs text-white/60">Vendite</p>
            <p className="text-lg font-bold leading-none">{salesCount}</p>
          </div>
          <div className="w-px h-8 bg-white/30" />
          <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
            {getSyncIcon()}
          </div>
          <button
            onClick={onCambiaOperatore}
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full text-xs text-white/80 active:scale-95 transition-transform"
            title="Cambia operatore"
          >
            <UserCircle className="w-3.5 h-3.5" />
            <span className="max-w-[60px] truncate">{operatoreLoggato}</span>
          </button>
        </div>
      </div>

      {/* Alert scorte sotto minimo — solo Admin, solo se attivo */}
      {isAdmin && stockAlertsEnabled && stockAlerts.length > 0 && (
        <button
          onClick={() => { setShowStockAlerts(true); document.querySelector('#stock-alerts-section')?.scrollIntoView({ behavior: 'smooth' }); }}
          className="mb-3 px-3 py-2 bg-red-50 border border-red-300 rounded-xl flex items-center gap-2"
        >
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="font-semibold text-red-800 text-sm flex-1 text-left">
            {stockAlerts.length} modell{stockAlerts.length > 1 ? 'i' : 'o'} sotto scorta minima
          </p>
          <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
            {stockAlerts.length}
          </span>
        </button>
      )}

      {/* Alert commissioni pendenti */}
      {pendingCommissioni > 0 && (
        <button
          onClick={() => onNavigate('archivio-commissioni')}
          className="mb-3 px-3 py-2 bg-yellow-50 border border-yellow-300 rounded-xl flex items-center gap-2"
        >
          <Clock className="w-5 h-5 text-yellow-600 shrink-0" />
          <p className="font-semibold text-yellow-800 text-sm flex-1 text-left">
            {pendingCommissioni} commissione{pendingCommissioni > 1 ? 'i' : ''} in attesa
          </p>
          <span className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold">
            {pendingCommissioni}
          </span>
        </button>
      )}

      {/* Pulsanti principali */}
      <div className="flex-1 flex flex-col gap-2">

        {/* Riga 1: CARICO + VENDITA */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onNavigate('carico')}
            className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl text-white font-semibold shadow-md active:scale-95 transition-transform"
            style={{ backgroundColor: '#006B3F' }}
          >
            <PackagePlus className="w-6 h-6" />
            <div className="text-sm font-bold">CARICO MERCE</div>
            <div className="text-xs opacity-70">Scansione OCR</div>
          </button>

          <button
            onClick={() => onNavigate('vendita')}
            className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl font-semibold shadow-md active:scale-95 transition-transform"
            style={{ backgroundColor: '#FFDD00', color: '#006B3F' }}
          >
            <ShoppingCart className="w-6 h-6" />
            <div className="text-sm font-bold">NUOVA VENDITA</div>
            <div className="text-xs opacity-70">Scarico e commissione</div>
          </button>
        </div>

        {/* ARCHIVIO COMMISSIONI — pulsante principale di cassa */}
        <button
          onClick={() => onNavigate('archivio-commissioni')}
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold shadow-md active:scale-95 transition-transform text-white"
          style={{ backgroundColor: '#004d2e' }}
        >
          <FileText className="w-6 h-6 shrink-0" />
          <div className="flex-1 text-left">
            <div className="text-base font-bold">ARCHIVIO COMMISSIONI</div>
            <div className="text-xs opacity-70">Gestisci ordini in attesa</div>
          </div>
          {pendingCommissioni > 0 && (
            <span className="bg-yellow-400 text-yellow-900 px-2.5 py-1 rounded-full text-sm font-bold shrink-0">
              {pendingCommissioni}
            </span>
          )}
        </button>

        {/* Riga 3: GIACENZE + STORICO */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onNavigate('giacenze')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-gray-700 text-white font-semibold shadow active:scale-95 transition-transform"
          >
            <Package className="w-5 h-5" />
            <div className="text-sm">GIACENZE</div>
            <div className="text-xs opacity-60">Magazzino</div>
          </button>

          <button
            onClick={() => onNavigate('storico')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-gray-600 text-white font-semibold shadow active:scale-95 transition-transform"
          >
            <History className="w-5 h-5" />
            <div className="text-sm">STORICO</div>
            <div className="text-xs opacity-60">Vendite</div>
          </button>
        </div>

        {/* Riga 4: LISTINI + POLITICHE */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onNavigate('listini')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold shadow-sm active:scale-95 transition-transform"
          >
            <ClipboardList className="w-5 h-5 text-gray-500" />
            <div className="text-sm">LISTINI</div>
            <div className="text-xs opacity-60">Prezzi</div>
          </button>

          <button
            onClick={() => onNavigate('politiche-commerciali')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold shadow-sm active:scale-95 transition-transform"
          >
            <BookLock className="w-5 h-5 text-gray-500" />
            <div className="text-sm">POLITICHE</div>
            <div className="text-xs opacity-60">Scontistiche</div>
          </button>
        </div>

        {/* PRATOVIVO */}
        <button
          onClick={() => onNavigate('pratovivo')}
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold shadow-sm active:scale-95 transition-transform border-2"
          style={{ borderColor: '#006B3F', backgroundColor: '#f0fdf4', color: '#006B3F' }}
        >
          <Leaf className="w-6 h-6 shrink-0" />
          <div className="flex-1 text-left">
            <div className="text-base font-bold">PRATOVIVO</div>
            <div className="text-xs opacity-60">Piani concimazione · Kit Express</div>
          </div>
          <span className="text-xs bg-green-700 text-white px-2 py-0.5 rounded-full font-medium">
            NUOVO
          </span>
        </button>

      </div>

      {/* Sezione Admin */}
      {isAdmin && (
        <div className="mt-2">
          {/* ── STOCK ALERTS ── */}
          <div className="mt-2">
            {/* Header toggle */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-100">
              <button
                onClick={() => { setShowStockAlerts(!showStockAlerts); }}
                className="flex items-center gap-2 flex-1 text-left"
              >
                <AlertTriangle className={`w-4 h-4 ${stockAlerts.length > 0 && stockAlertsEnabled ? 'text-red-500' : 'text-gray-400'}`} />
                <span className="text-xs font-medium text-gray-500">Scorte Minime</span>
                {stockAlertsEnabled && stockAlerts.length > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {stockAlerts.length}
                  </span>
                )}
              </button>
              {/* Toggle on/off */}
              <button
                onClick={toggleStockAlerts}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
                title={stockAlertsEnabled ? 'Disattiva alert' : 'Attiva alert'}
              >
                {stockAlertsEnabled
                  ? <ToggleRight className="w-5 h-5 text-green-600" />
                  : <ToggleLeft className="w-5 h-5 text-gray-400" />}
              </button>
              <button onClick={() => setShowStockAlerts(!showStockAlerts)} className="ml-1 text-gray-400">
                {showStockAlerts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showStockAlerts && (
              <div className="mt-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
                {!stockAlertsEnabled ? (
                  <div className="p-4 text-center text-gray-400 text-xs">
                    <ToggleLeft className="w-6 h-6 mx-auto mb-1 text-gray-300" />
                    Alert disattivati — attiva il toggle per monitorare le scorte
                  </div>
                ) : loadingAlerts ? (
                  <div className="p-3 text-center text-gray-400 text-xs">Caricamento...</div>
                ) : (
                  <>
                    {/* Prodotti sotto soglia */}
                    {stockAlerts.length > 0 && (
                      <div className="p-3 border-b border-gray-100">
                        <p className="text-xs font-bold text-red-600 mb-2 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> SOTTO SCORTA MINIMA
                        </p>
                        <div className="space-y-1.5">
                          {stockAlerts.map(t => (
                            <div key={`${t.brand}||${t.model}`}
                              className="flex items-center justify-between px-2 py-1.5 bg-red-50 rounded-lg border border-red-100">
                              <div>
                                <span className="text-xs font-semibold text-gray-800">{t.brand} {t.model}</span>
                                <span className="ml-2 text-xs text-red-600 font-bold">
                                  {t.giacenza} pz
                                </span>
                                <span className="text-xs text-gray-400"> / min {t.min_quantity}</span>
                              </div>
                              {/* Modifica soglia inline */}
                              {editingThreshold?.brand === t.brand && editingThreshold?.model === t.model ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    min="0"
                                    className="w-12 border rounded px-1 py-0.5 text-xs text-center"
                                    value={editingValue}
                                    onChange={e => setEditingValue(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && saveThreshold(t.brand, t.model, editingValue)}
                                    autoFocus
                                  />
                                  <button onClick={() => saveThreshold(t.brand, t.model, editingValue)}
                                    className="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">✓</button>
                                  <button onClick={() => setEditingThreshold(null)}
                                    className="text-xs text-gray-400">✕</button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => { setEditingThreshold({ brand: t.brand, model: t.model }); setEditingValue(t.min_quantity.toString()); }}
                                  className="text-xs text-blue-500 underline"
                                >
                                  modifica soglia
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {stockAlerts.length === 0 && (
                      <div className="p-3 text-center text-xs text-green-600 font-medium border-b border-gray-100">
                        ✓ Tutte le scorte sono sopra la soglia minima
                      </div>
                    )}

                    {/* Tutte le soglie — espandibile */}
                    <div className="p-3">
                      <button
                        onClick={() => setShowAllThresholds(!showAllThresholds)}
                        className="text-xs text-gray-400 flex items-center gap-1"
                      >
                        {showAllThresholds ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {showAllThresholds ? 'Nascondi' : 'Vedi tutte le soglie'}
                        {allThresholds.length > 0 && ` (${allThresholds.length})`}
                      </button>

                      {showAllThresholds && (
                        <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                          {allThresholds.map(t => (
                            <div key={`${t.brand}||${t.model}`}
                              className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs ${
                                t.giacenza < t.min_quantity ? 'bg-red-50' : 'bg-gray-50'
                              }`}>
                              <div>
                                <span className="font-medium text-gray-700">{t.brand} {t.model}</span>
                                <span className={`ml-2 font-bold ${t.giacenza < t.min_quantity ? 'text-red-600' : 'text-green-600'}`}>
                                  {t.giacenza} pz
                                </span>
                                <span className="text-gray-400"> / min {t.min_quantity}</span>
                              </div>
                              {editingThreshold?.brand === t.brand && editingThreshold?.model === t.model ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    min="0"
                                    className="w-12 border rounded px-1 py-0.5 text-xs text-center"
                                    value={editingValue}
                                    onChange={e => setEditingValue(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && saveThreshold(t.brand, t.model, editingValue)}
                                    autoFocus
                                  />
                                  <button onClick={() => saveThreshold(t.brand, t.model, editingValue)}
                                    className="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">✓</button>
                                  <button onClick={() => setEditingThreshold(null)}
                                    className="text-xs text-gray-400">✕</button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => { setEditingThreshold({ brand: t.brand, model: t.model }); setEditingValue(t.min_quantity.toString()); }}
                                  className="text-gray-400 hover:text-blue-500"
                                >
                                  ✎
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => { setShowGestioneOp(!showGestioneOp); if (!showGestioneOp) caricaOperatori(); }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gray-100 text-gray-500 text-xs font-medium active:scale-95 transition-transform"
          >
            <span>👥 Gestione Operatori</span>
            <span>{showGestioneOp ? '▲' : '▼'}</span>
          </button>

          {showGestioneOp && (
            <div className="mt-2 bg-white rounded-xl border border-gray-200 p-3">
              {loadingOp ? (
                <p className="text-gray-400 text-xs text-center py-2">Caricamento...</p>
              ) : (
                <div className="space-y-1.5 mb-3">
                  {operatori.map(({ nome }) => (
                    <div key={nome} className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: nome === 'Admin' ? '#374151' : '#006B3F' }}>
                          {nome.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-700">{nome}</span>
                      </div>
                      {nome !== 'Admin' && (
                        <button onClick={() => eliminaOperatore(nome)} className="text-red-400 hover:text-red-600 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nuovoOp}
                  onChange={e => setNuovoOp(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && aggiungiOperatore()}
                  placeholder="Nome operatore..."
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-green-500"
                />
                <button
                  onClick={aggiungiOperatore}
                  disabled={!nuovoOp.trim()}
                  className="px-3 py-1.5 rounded-lg text-white text-sm font-medium disabled:opacity-40"
                  style={{ backgroundColor: '#006B3F' }}
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between px-1">
        <p className="text-xs text-gray-400">v1.3.2 - OMPRA Gestionale</p>
        <button
          onClick={() => onNavigate('budget-admin')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-200 text-gray-600 text-xs font-semibold active:scale-95 transition-transform"
        >
          <BarChart2 className="w-3.5 h-3.5" />
          Budget
        </button>
      </div>
    </div>
  );
}
