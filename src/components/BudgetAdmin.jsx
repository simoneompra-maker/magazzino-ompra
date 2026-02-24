import { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { supabase } from '../store';
import { ArrowLeft, Lock, Download, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ─── PIN ─────────────────────────────────────────────────────────────────────
const PIN_KEY     = 'ompra_budget_pin';      // localStorage: PIN attivo
const SESSION_KEY = 'ompra_budget_admin_auth';
const MASTER_CODE = 'OMPRA2026';             // codice emergenza per reset PIN

const getPin = () => {
  try { return localStorage.getItem(PIN_KEY) || '1234'; } catch { return '1234'; }
};
const savePin = (p) => {
  try { localStorage.setItem(PIN_KEY, p); } catch {}
};

// ─── REALIZZATO 2025 (base per obiettivi 2026) ───────────────────────────────
const REALIZZATO_2025 = {
   1:  2260.66,   2:  1861.48,   3:  2895.90,   4:   346.72,
   5: 11661.48,   6:  1646.48,   7:  2551.64,   8:  2854.61,
   9: 10267.04,  10: 35143.43,  11:  5210.86,  12:  6593.04,
  13:  9393.74,  14:  8497.38,  15: 30445.80,  16: 26034.42,
  17:  7597.28,  18:  8100.97,  19: 24976.85,  20:  1108.13,
  21: 11323.69,  22:  3497.75,  23:  9698.46,  24: 11356.73,
  25:  4157.29,  26:  6962.31,  27:  1565.71,  28:  2728.27,
  29:  9143.24,  30:  6683.54,  31:  4836.62,  32:  4088.71,
  33:     0.00,  34:     0.00,  35:  3505.77,  36: 13772.86,
  37:  1911.42,  38:  5129.75,  39:  2762.69,  40:  2919.75,
  41:  8915.80,  42:  7277.22,  43:  5670.75,  44:  4644.08,
  45:  2830.93,  46:  7065.95,  47:  4581.43,  48:  2209.66,
  49:  3090.19,  50: 63282.46,  51:     0.00,  52:     0.00,
};

// ─── MOLTIPLICATORI 2026 ──────────────────────────────────────────────────────
const MULT_MINIMO  = 1.10;
const MULT_TARGET  = 1.15;
const MULT_ALLIN   = 1.20;

// ─── UTILITY: numero settimana ISO da una data ────────────────────────────────
function isoWeek(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  const jan4 = new Date(d.getFullYear(), 0, 4);
  const startOfWeek1 = new Date(jan4);
  startOfWeek1.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7));
  const diff = d - startOfWeek1;
  const week = Math.floor(diff / (7 * 24 * 3600 * 1000)) + 1;
  if (week < 1) return 52;
  if (week > 52) return 1;
  return week;
}

function isoYear(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  const w = isoWeek(dateStr);
  if (w === 52 && d.getMonth() === 0) return d.getFullYear() - 1;
  if (w === 1  && d.getMonth() === 11) return d.getFullYear() + 1;
  return d.getFullYear();
}

function currentIsoWeek() {
  return isoWeek(new Date().toISOString().split('T')[0]);
}

// ─── FORMATTA EURO ────────────────────────────────────────────────────────────
const fmt = (v) =>
  v == null || v === 0
    ? '—'
    : new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(v);

const fmtDelta = (v) => {
  if (v == null) return '—';
  const abs = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(Math.abs(v));
  return v >= 0 ? `+${abs}` : `-${abs}`;
};

// ─── COMPONENTE PRINCIPALE ────────────────────────────────────────────────────
export default function BudgetAdmin({ onNavigate }) {
  const [autenticato, setAutenticato] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === 'ok'; } catch { return false; }
  });
  const [pin, setPin]           = useState('');
  const [pinError, setPinError] = useState(false);
  const [shaking, setShaking]   = useState(false);

  // Cambio PIN
  const [showCambioPin, setShowCambioPin]   = useState(false);
  const [vecchioPin, setVecchioPin]         = useState('');
  const [nuovoPin, setNuovoPin]             = useState('');
  const [confermaNuovoPin, setConfermaNuovoPin] = useState('');
  const [cambioPinMsg, setCambioPinMsg]     = useState(null);

  // Reset PIN dimenticato
  const [showReset, setShowReset]           = useState(false);
  const [masterCode, setMasterCode]         = useState('');
  const [resetMsg, setResetMsg]             = useState(null);

  // Operatore loggato (da localStorage, stesso meccanismo di Vendita.jsx)
  const operatoreLoggato = (() => {
    try { return localStorage.getItem('ompra_ultimo_operatore') || ''; } catch { return ''; }
  })();
  const isAdmin = operatoreLoggato.toLowerCase() === 'admin';

  // Filtro venditore (solo per admin)
  const [venditori, setVenditori] = useState([]);
  const [filtroVenditore, setFiltroVenditore] = useState('');

  // Dati 2026
  const [realizzato2026, setRealizzato2026] = useState({});
  const [loading, setLoading]               = useState(false);
  const [lastUpdate, setLastUpdate]         = useState(null);

  const settimanaCorrente = currentIsoWeek();

  // ── Carica realizzato 2026 da Supabase ────────────────────────────────────
  const caricaDati = async () => {
    setLoading(true);
    try {
      // Carica lista venditori (solo admin)
      if (isAdmin && venditori.length === 0) {
        const { data: vData } = await supabase
          .from('commissioni')
          .select('operatore')
          .not('operatore', 'is', null);
        if (vData) {
          const unici = [...new Set(vData.map(r => r.operatore).filter(Boolean))].sort();
          setVenditori(unici);
        }
      }

      // Query con filtro operatore
      let query = supabase
        .from('commissioni')
        .select('created_at, totale')
        .gte('created_at', '2026-01-01')
        .lt('created_at',  '2027-01-01')
        .not('totale', 'is', null);

      if (isAdmin && filtroVenditore) {
        query = query.eq('operatore', filtroVenditore);
      } else if (!isAdmin) {
        query = query.eq('operatore', operatoreLoggato);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Raggruppa per settimana ISO
      const per_settimana = {};
      for (const c of (data || [])) {
        const w = isoWeek(c.created_at);
        const y = isoYear(c.created_at);
        if (!w || y !== 2026) continue;
        per_settimana[w] = (per_settimana[w] || 0) + (parseFloat(c.totale) || 0);
      }

      setRealizzato2026(per_settimana);
      setLastUpdate(new Date().toLocaleTimeString('it-IT'));
    } catch (e) {
      console.error('Errore caricamento budget:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autenticato) caricaDati();
  }, [autenticato, filtroVenditore]);

  // ── Righe tabella ─────────────────────────────────────────────────────────
  const righe = useMemo(() => {
    const tot_semane = 52;
    let rolling = 0;
    return Array.from({ length: tot_semane }, (_, i) => {
      const w     = i + 1;
      const base  = REALIZZATO_2025[w] || 0;
      const min   = base * MULT_MINIMO;
      const tgt   = base * MULT_TARGET;
      const allin = base * MULT_ALLIN;
      const real  = realizzato2026[w] || null;
      const passata = w < settimanaCorrente;
      const corrente = w === settimanaCorrente;

      rolling += real || 0;

      return {
        w,
        base,
        min,   delta_min:   real != null ? real - min   : null,
        tgt,   delta_tgt:   real != null ? real - tgt   : null,
        perc_tgt: real != null && tgt ? ((real / tgt - 1) * 100) : null,
        allin, delta_allin: real != null ? real - allin : null,
        real,
        rolling: real != null || passata ? rolling : null,
        passata,
        corrente,
      };
    });
  }, [realizzato2026, settimanaCorrente]);

  // Totali riga finale
  const totali = useMemo(() => {
    const tot_base  = Object.values(REALIZZATO_2025).reduce((a, b) => a + b, 0);
    const tot_min   = tot_base * MULT_MINIMO;
    const tot_tgt   = tot_base * MULT_TARGET;
    const tot_allin = tot_base * MULT_ALLIN;
    const tot_real  = Object.values(realizzato2026).reduce((a, b) => a + b, 0);
    return { tot_base, tot_min, tot_tgt, tot_allin, tot_real };
  }, [realizzato2026]);

  // ── Export Excel ──────────────────────────────────────────────────────────
  const esportaExcel = () => {
    const ws_data = [
      ['SETTIMANA', '2025', 'MINIMO', 'DELTA MINIMO', 'TARGET', 'DELTA TARGET', 'ALLIN', 'DELTA ALLIN', 'REALIZZATO', 'ROLLING', 'NOTE'],
      ...righe.map(r => [
        r.w,
        r.base  || 0,
        r.min,
        r.delta_min,
        r.tgt,
        r.delta_tgt,
        r.allin,
        r.delta_allin,
        r.real  || '',
        r.rolling || '',
        '',
      ]),
      // Riga totali
      [
        '',
        totali.tot_base,
        totali.tot_min,
        totali.tot_real ? totali.tot_real - totali.tot_min : '',
        totali.tot_tgt,
        totali.tot_real ? totali.tot_real - totali.tot_tgt : '',
        totali.tot_allin,
        totali.tot_real ? totali.tot_real - totali.tot_allin : '',
        totali.tot_real || '',
      ],
      // Percentuali
      ['', '2025', `${((MULT_MINIMO - 1) * 100).toFixed(0)}%`, '', `${((MULT_TARGET - 1) * 100).toFixed(0)}%`, '', `${((MULT_ALLIN - 1) * 100).toFixed(0)}%`, '',
        totali.tot_real ? `${((totali.tot_real / totali.tot_base - 1) * 100).toFixed(2)}%` : ''],
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Larghezze colonne
    ws['!cols'] = [
      { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 16 },
      { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 16 },
      { wch: 14 }, { wch: 16 }, { wch: 30 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Budget 2026');
    XLSX.writeFile(wb, 'BUDGET_2026.xlsx');
  };

  // ── PIN screen ────────────────────────────────────────────────────────────
  const verificaPin = (tentativo) => tentativo === getPin();

  const handlePinInput = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    setPin(clean);
    setPinError(false);
    if (clean.length === 4) {
      if (verificaPin(clean)) {
        try { sessionStorage.setItem(SESSION_KEY, 'ok'); } catch {}
        setAutenticato(true);
        setPin('');
      } else {
        setShaking(true);
        setPinError(true);
        setTimeout(() => { setShaking(false); setPinError(false); setPin(''); }, 800);
      }
    }
  };

  const handleCambioPin = () => {
    setCambioPinMsg(null);
    if (!verificaPin(vecchioPin)) {
      setCambioPinMsg({ ok: false, testo: 'PIN attuale non corretto' });
      return;
    }
    if (nuovoPin.length < 4) {
      setCambioPinMsg({ ok: false, testo: 'Il nuovo PIN deve essere di 4 cifre' });
      return;
    }
    if (nuovoPin !== confermaNuovoPin) {
      setCambioPinMsg({ ok: false, testo: 'I due PIN non coincidono' });
      return;
    }
    savePin(nuovoPin);
    setCambioPinMsg({ ok: true, testo: '✓ PIN aggiornato con successo' });
    setVecchioPin(''); setNuovoPin(''); setConfermaNuovoPin('');
    setTimeout(() => { setShowCambioPin(false); setCambioPinMsg(null); }, 1500);
  };

  const handleResetPin = () => {
    setResetMsg(null);
    if (masterCode.trim() !== MASTER_CODE) {
      setResetMsg({ ok: false, testo: 'Codice di emergenza non corretto' });
      return;
    }
    savePin('1234');
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
    setResetMsg({ ok: true, testo: '✓ PIN reimpostato a 1234' });
    setTimeout(() => {
      setShowReset(false); setMasterCode(''); setResetMsg(null);
      setAutenticato(false);
    }, 1800);
  };

  // ── Render PIN ────────────────────────────────────────────────────────────
  if (!autenticato) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
        <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-xs shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-gray-300" />
            </div>
            <h1 className="text-white text-xl font-bold">Area Riservata</h1>
            <p className="text-gray-400 text-sm mt-1">Inserisci il PIN per accedere</p>
          </div>

          {/* Indicatori cifre */}
          <div className={`flex justify-center gap-4 mb-8 ${shaking ? 'animate-bounce' : ''}`}>
            {[0,1,2,3].map(i => (
              <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all ${
                pin.length > i
                  ? pinError ? 'bg-red-500 border-red-500' : 'bg-white border-white'
                  : 'border-gray-500 bg-transparent'
              }`} />
            ))}
          </div>

          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={pin}
            onChange={e => handlePinInput(e.target.value)}
            autoFocus
            className="w-full text-center text-2xl tracking-widest bg-gray-700 text-white rounded-lg p-3 border-2 border-gray-600 focus:outline-none focus:border-blue-400"
            placeholder="• • • •"
          />

          {pinError && <p className="text-red-400 text-sm text-center mt-3">PIN non corretto</p>}

          <button
            onClick={() => setShowReset(true)}
            className="w-full mt-4 text-gray-500 text-xs hover:text-gray-300 underline text-center"
          >
            Hai dimenticato il PIN?
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="w-full mt-3 py-2 text-gray-400 text-sm hover:text-gray-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Torna alla home
          </button>
        </div>

        {/* Modale reset PIN */}
        {showReset && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl">
              <h2 className="font-bold text-lg mb-1">🔑 Reset PIN</h2>
              <p className="text-sm text-gray-500 mb-4">
                Inserisci il codice di emergenza per reimpostare il PIN a <strong>1234</strong>.
              </p>
              <input
                type="text"
                placeholder="Codice di emergenza"
                className="w-full border-2 rounded-lg p-3 text-sm font-mono focus:outline-none focus:border-blue-400"
                value={masterCode}
                onChange={e => { setMasterCode(e.target.value); setResetMsg(null); }}
              />
              {resetMsg && (
                <p className={`text-sm mt-2 ${resetMsg.ok ? 'text-green-600' : 'text-red-500'}`}>
                  {resetMsg.testo}
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => { setShowReset(false); setMasterCode(''); setResetMsg(null); }}
                  className="flex-1 py-2 rounded-lg border-2 border-gray-300 text-gray-500 text-sm font-medium"
                >
                  Annulla
                </button>
                <button
                  onClick={handleResetPin}
                  className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-bold"
                >
                  Reimposta
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Render tabella ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('home')} className="p-1 hover:bg-gray-100 rounded">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-gray-800">📊 Budget 2026</h1>
            {lastUpdate && <p className="text-xs text-gray-400">Aggiornato: {lastUpdate}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCambioPin(true)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs text-gray-500 font-medium flex items-center gap-1"
            title="Cambia PIN"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PIN</span>
          </button>
          <button
            onClick={caricaDati}
            disabled={loading}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            title="Aggiorna dati"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={esportaExcel}
            className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Scarica Excel</span>
          </button>
        </div>
      </div>

      {/* Modale Cambia PIN */}
      {showCambioPin && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl">
            <h2 className="font-bold text-lg mb-4">🔑 Cambia PIN</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">PIN attuale</label>
                <input
                  type="tel" inputMode="numeric" maxLength={4}
                  placeholder="••••"
                  className="w-full border-2 rounded-lg p-2.5 mt-1 text-center tracking-widest font-mono text-lg focus:outline-none focus:border-blue-400"
                  value={vecchioPin}
                  onChange={e => { setVecchioPin(e.target.value.replace(/\D/g,'').slice(0,4)); setCambioPinMsg(null); }}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Nuovo PIN (4 cifre)</label>
                <input
                  type="tel" inputMode="numeric" maxLength={4}
                  placeholder="••••"
                  className="w-full border-2 rounded-lg p-2.5 mt-1 text-center tracking-widest font-mono text-lg focus:outline-none focus:border-blue-400"
                  value={nuovoPin}
                  onChange={e => { setNuovoPin(e.target.value.replace(/\D/g,'').slice(0,4)); setCambioPinMsg(null); }}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Conferma nuovo PIN</label>
                <input
                  type="tel" inputMode="numeric" maxLength={4}
                  placeholder="••••"
                  className="w-full border-2 rounded-lg p-2.5 mt-1 text-center tracking-widest font-mono text-lg focus:outline-none focus:border-blue-400"
                  value={confermaNuovoPin}
                  onChange={e => { setConfermaNuovoPin(e.target.value.replace(/\D/g,'').slice(0,4)); setCambioPinMsg(null); }}
                />
              </div>
            </div>
            {cambioPinMsg && (
              <p className={`text-sm mt-3 ${cambioPinMsg.ok ? 'text-green-600' : 'text-red-500'}`}>
                {cambioPinMsg.testo}
              </p>
            )}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { setShowCambioPin(false); setVecchioPin(''); setNuovoPin(''); setConfermaNuovoPin(''); setCambioPinMsg(null); }}
                className="flex-1 py-2.5 rounded-lg border-2 border-gray-300 text-gray-500 font-medium"
              >
                Annulla
              </button>
              <button
                onClick={handleCambioPin}
                className="flex-1 py-2.5 rounded-lg font-bold text-white"
                style={{ backgroundColor: '#006B3F' }}
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtro venditore (solo admin) */}
      {isAdmin && (
        <div className="px-4 pt-3 pb-1 flex items-center gap-3">
          <label className="text-sm text-gray-500 font-medium">Venditore:</label>
          <select
            value={filtroVenditore}
            onChange={e => setFiltroVenditore(e.target.value)}
            className="border-2 border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-green-500 bg-white"
          >
            <option value="">— Tutti —</option>
            {venditori.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          {filtroVenditore && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              {filtroVenditore}
            </span>
          )}
        </div>
      )}

      {/* Intestazione venditore (non admin) */}
      {!isAdmin && operatoreLoggato && (
        <div className="px-4 pt-3 pb-1">
          <span className="text-sm text-gray-500">Dati di: <strong className="text-gray-700">{operatoreLoggato}</strong></span>
        </div>
      )}

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4">
        {[
          { label: 'Base 2025', val: totali.tot_base, color: 'text-gray-700' },
          { label: 'Target 2026', val: totali.tot_tgt, color: 'text-blue-700' },
          { label: 'Realizzato', val: totali.tot_real, color: 'text-green-700' },
          {
            label: 'Δ vs Target',
            val: totali.tot_real ? totali.tot_real - totali.tot_tgt : null,
            color: totali.tot_real >= totali.tot_tgt ? 'text-green-600' : 'text-red-600',
            delta: true,
          },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl p-3 shadow-sm border">
            <p className="text-xs text-gray-400">{k.label}</p>
            <p className={`font-bold text-sm mt-0.5 ${k.color}`}>
              {k.val != null && k.val !== 0
                ? k.delta ? fmtDelta(k.val) : fmt(k.val)
                : '—'}
            </p>
          </div>
        ))}
      </div>

      {/* Tabella */}
      <div className="px-4 pb-8 overflow-x-auto">
        <table className="w-full text-xs bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-1 py-2 text-center w-8">S.</th>
              <th className="px-1 py-2 text-right">2025</th>
              <th className="px-1 py-2 text-right">Min</th>
              <th className="px-1 py-2 text-right">Δ Min</th>
              <th className="px-1 py-2 text-right">Target</th>
              <th className="px-1 py-2 text-right">Δ Tgt</th>
              <th className="px-1 py-2 text-right">All-In</th>
              <th className="px-1 py-2 text-right">Δ AI</th>
              <th className="px-1 py-2 text-right font-bold">Reale</th>
              <th className="px-1 py-2 text-right">Rolling</th>
              <th className="px-1 py-2 text-right">%YoY</th>
            </tr>
          </thead>
          <tbody>
            {righe.map(r => {
              const isFutura = !r.passata && !r.corrente;
              const rowClass = r.corrente
                ? 'bg-yellow-50 font-semibold border-l-4 border-yellow-400'
                : r.passata
                ? 'hover:bg-gray-50'
                : 'opacity-60 hover:opacity-80';

              const deltaColor = (v) => {
                if (v == null) return 'text-gray-300';
                return v >= 0 ? 'text-green-600' : 'text-red-600';
              };

              const DeltaIcon = ({ v }) => {
                if (v == null) return null;
                if (v > 0) return <TrendingUp className="w-3 h-3 inline ml-0.5" />;
                if (v < 0) return <TrendingDown className="w-3 h-3 inline ml-0.5" />;
                return <Minus className="w-3 h-3 inline ml-0.5" />;
              };

              return (
                <tr key={r.w} className={`border-t border-gray-100 ${rowClass}`}>
                  <td className="px-1 py-1 text-center font-mono text-gray-500 text-xs">
                    {r.corrente ? <span className="bg-yellow-400 text-gray-800 px-1.5 rounded font-bold">{r.w}</span> : r.w}
                  </td>
                  <td className="px-1 py-1 text-right text-gray-500 font-mono text-xs">{r.base ? fmt(r.base) : '—'}</td>
                  <td className="px-1 py-1 text-right text-blue-700 font-mono text-xs">{r.min ? fmt(r.min) : '—'}</td>
                  <td className={`px-1 py-1 text-right font-mono text-xs ${deltaColor(r.delta_min)}`}>
                    {r.delta_min != null ? <>{fmtDelta(r.delta_min)}<DeltaIcon v={r.delta_min} /></> : '—'}
                  </td>
                  <td className="px-1 py-1 text-right text-blue-800 font-mono font-medium text-xs">{r.tgt ? fmt(r.tgt) : '—'}</td>
                  <td className={`px-1 py-1 text-right font-mono text-xs ${deltaColor(r.delta_tgt)}`}>
                    {r.delta_tgt != null ? <>{fmtDelta(r.delta_tgt)}<DeltaIcon v={r.delta_tgt} /></> : '—'}
                  </td>
                  <td className="px-1 py-1 text-right text-indigo-700 font-mono text-xs">{r.allin ? fmt(r.allin) : '—'}</td>
                  <td className={`px-1 py-1 text-right font-mono text-xs ${deltaColor(r.delta_allin)}`}>
                    {r.delta_allin != null ? <>{fmtDelta(r.delta_allin)}<DeltaIcon v={r.delta_allin} /></> : '—'}
                  </td>
                  <td className="px-1 py-1 text-right font-mono font-bold text-gray-800 text-xs">
                    {r.real != null ? fmt(r.real) : isFutura ? '' : <span className="text-orange-400 font-normal text-xs">n.d.</span>}
                  </td>
                  <td className="px-1 py-1 text-right font-mono text-gray-600 text-xs">
                    {r.rolling != null ? fmt(r.rolling) : ''}
                  </td>
                  <td className={`px-1 py-1 text-right font-mono font-semibold text-xs ${r.perc_yoy != null ? (r.perc_yoy >= 0 ? 'text-green-600' : 'text-red-600') : 'text-gray-300'}`}>
                    {r.perc_yoy != null ? `${r.perc_yoy >= 0 ? '+' : ''}${r.perc_yoy.toFixed(1)}%` : '—'}
                  </td>
                </tr>
              );
            })}
            {/* Riga totali */}
            <tr className="bg-gray-800 text-white font-bold border-t-2 border-gray-600">
              <td className="px-1 py-1.5 text-center text-xs">TOT</td>
              <td className="px-1 py-1.5 text-right font-mono text-xs">{fmt(totali.tot_base)}</td>
              <td className="px-1 py-1.5 text-right font-mono text-xs">{fmt(totali.tot_min)}</td>
              <td className="px-1 py-1.5 text-right font-mono text-xs">
                {totali.tot_real ? <span className={totali.tot_real >= totali.tot_min ? 'text-green-300' : 'text-red-300'}>{fmtDelta(totali.tot_real - totali.tot_min)}</span> : '—'}
              </td>
              <td className="px-1 py-1.5 text-right font-mono text-xs">{fmt(totali.tot_tgt)}</td>
              <td className="px-1 py-1.5 text-right font-mono text-xs">
                {totali.tot_real ? <span className={totali.tot_real >= totali.tot_tgt ? 'text-green-300' : 'text-red-300'}>{fmtDelta(totali.tot_real - totali.tot_tgt)}</span> : '—'}
              </td>
              <td className="px-1 py-1.5 text-right font-mono text-xs">{fmt(totali.tot_allin)}</td>
              <td className="px-1 py-1.5 text-right font-mono text-xs">
                {totali.tot_real ? <span className={totali.tot_real >= totali.tot_allin ? 'text-green-300' : 'text-red-300'}>{fmtDelta(totali.tot_real - totali.tot_allin)}</span> : '—'}
              </td>
              <td className="px-1 py-1.5 text-right font-mono text-xs">{totali.tot_real ? fmt(totali.tot_real) : '—'}</td>
              <td className="px-1 py-1.5 text-right font-mono text-xs">{totali.tot_real ? fmt(totali.tot_real) : '—'}</td>
              <td className={`px-2 py-2 text-right font-mono font-bold ${totali.tot_real && totali.tot_base ? (totali.tot_real >= totali.tot_base ? 'text-green-300' : 'text-red-300') : ''}`}>
                {totali.tot_real && totali.tot_base ? `${((totali.tot_real / totali.tot_base - 1) * 100) >= 0 ? '+' : ''}${((totali.tot_real / totali.tot_base - 1) * 100).toFixed(1)}%` : '—'}
              </td>
            </tr>
            {/* Riga percentuali */}
            <tr className="bg-gray-700 text-gray-300 text-xs">
              <td className="px-1 py-1.5 text-center text-xs">%</td>
              <td className="px-1 py-1.5 text-right text-xs">2025</td>
              <td className="px-1 py-1.5 text-right text-xs">+10,0%</td>
              <td></td>
              <td className="px-1 py-1.5 text-right text-xs">+15,0%</td>
              <td></td>
              <td className="px-1 py-1.5 text-right text-xs">+20,0%</td>
              <td></td>
              <td className="px-1 py-1.5 text-right font-mono text-white text-xs">
                {totali.tot_real && totali.tot_base
                  ? `${((totali.tot_real / totali.tot_base - 1) * 100).toFixed(2)}%`
                  : '—'}
              </td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>

        {/* Legenda */}
        <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded inline-block" /> Settimana corrente</span>
          <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-green-600" /> Sopra obiettivo</span>
          <span className="flex items-center gap-1"><TrendingDown className="w-3 h-3 text-red-600" /> Sotto obiettivo</span>
          <span className="flex items-center gap-1"><span className="text-orange-400">n.d.</span> = settimana passata senza dati in app</span>
        </div>
      </div>
    </div>
  );
}
