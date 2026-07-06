import { useState, useMemo } from 'react';
import { ArrowLeft, Download, RefreshCw, Lock } from 'lucide-react';
import { useRiepilogoCategorie, useDettaglioVendite } from './useBudget';
import BudgetRiepilogo from './BudgetRiepilogo';
import BudgetDettaglio from './BudgetDettaglio';
import { exportBudgetXlsx } from './exportBudgetXlsx';

const oggi = () => new Date().toISOString().slice(0, 10);
const inizioAnno = () => `${new Date().getFullYear()}-01-01`;
const trimestreCorrente = () => Math.ceil((new Date().getMonth() + 1) / 3);

const MODES = [
  { id: 'anno',      label: 'Anno' },
  { id: 'trimestre', label: 'Trimestre' },
  { id: 'date',      label: 'Intervallo' },
];

export default function BudgetModule({ onNavigate }) {
  const operatoreLoggato = (() => {
    try { return localStorage.getItem('ompra_ultimo_operatore') || ''; } catch { return ''; }
  })();
  const isAdmin = operatoreLoggato.toLowerCase() === 'admin';

  const [tab, setTab] = useState('riepilogo');
  const [periodoMode, setPeriodoMode] = useState('anno');
  const [trimestre, setTrimestre] = useState(trimestreCorrente());
  const [dateFrom, setDateFrom] = useState(inizioAnno());
  const [dateTo, setDateTo] = useState(oggi());

  const {
    righeAnno, anni, anno, setAnno,
    loading: loadingRiepilogo, error: errorRiepilogo, refresh: refreshRiepilogo,
  } = useRiepilogoCategorie();

  const {
    righe: righeDettaglio,
    loading: loadingDettaglio, error: errorDettaglio, refresh: refreshDettaglio,
  } = useDettaglioVendite(
    periodoMode !== 'date' ? anno : null,
    periodoMode === 'trimestre' ? trimestre : null,
    periodoMode === 'date' ? dateFrom : null,
    periodoMode === 'date' ? dateTo : null,
  );

  const totaliPeriodo = useMemo(() => {
    if (periodoMode !== 'date') return null;
    return righeDettaglio.reduce((acc, r) => ({
      macchine:    acc.macchine    + (r.imp_macchine    || 0),
      geogreen:    acc.geogreen    + (r.imp_geogreen    || 0),
      antizanzare: acc.antizanzare + (r.imp_antizanzare || 0),
      consulenza:  acc.consulenza  + (r.imp_consulenza  || 0),
    }), { macchine: 0, geogreen: 0, antizanzare: 0, consulenza: 0 });
  }, [periodoMode, righeDettaglio]);

  const periodoLabel = useMemo(() => {
    if (periodoMode === 'anno') return String(anno);
    if (periodoMode === 'trimestre') return `${anno}_T${trimestre}`;
    return `${dateFrom}_${dateTo}`;
  }, [periodoMode, anno, trimestre, dateFrom, dateTo]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
        <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-xs shadow-2xl text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Lock className="w-8 h-8 text-gray-300" />
          </div>
          <h1 className="text-white text-xl font-bold">Area Riservata</h1>
          <p className="text-gray-400 text-sm mt-1">Sezione disponibile solo per l'amministratore.</p>
          <button
            onClick={() => onNavigate('home')}
            className="w-full mt-6 py-2 text-gray-400 text-sm hover:text-gray-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Torna alla home
          </button>
        </div>
      </div>
    );
  }

  const loading = loadingRiepilogo || loadingDettaglio;
  const refresh = () => { refreshRiepilogo(); refreshDettaglio(); };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header + period bar — sticky insieme */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        {/* Row 1 */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('home')} className="p-1 hover:bg-gray-100 rounded">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-gray-800">Budget</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              disabled={loading}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              title="Aggiorna dati"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => exportBudgetXlsx(righeDettaglio, periodoLabel)}
              disabled={!righeDettaglio.length}
              className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Esporta Excel</span>
            </button>
          </div>
        </div>

        {/* Row 2 — selettore periodo */}
        <div className="px-4 pb-2.5 pt-0.5 flex flex-wrap items-center gap-2 border-t border-gray-100">
          {/* Toggle modalità */}
          <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs shrink-0">
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setPeriodoMode(m.id)}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  periodoMode === m.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Selettore anno (anno + trimestre) */}
          {periodoMode !== 'date' && (
            <select
              value={anno || ''}
              onChange={e => setAnno(Number(e.target.value))}
              className="border-2 border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-green-500 bg-white"
            >
              {anni.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          )}

          {/* Bottoni trimestre */}
          {periodoMode === 'trimestre' && (
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(t => (
                <button
                  key={t}
                  onClick={() => setTrimestre(t)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors ${
                    trimestre === t
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  T{t}
                </button>
              ))}
            </div>
          )}

          {/* Date da/a */}
          {periodoMode === 'date' && (
            <>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="border-2 border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-green-500 bg-white"
              />
              <span className="text-gray-400 text-xs">→</span>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="border-2 border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-green-500 bg-white"
              />
            </>
          )}
        </div>
      </div>

      {/* Tab */}
      <div className="flex border-b bg-white">
        <button
          onClick={() => setTab('riepilogo')}
          className={`flex-1 py-3 text-sm font-medium ${tab === 'riepilogo' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}
        >
          Riepilogo
        </button>
        <button
          onClick={() => setTab('dettaglio')}
          className={`flex-1 py-3 text-sm font-medium ${tab === 'dettaglio' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}
        >
          Dettaglio
        </button>
      </div>

      {tab === 'riepilogo' ? (
        <BudgetRiepilogo
          righe={righeAnno}
          loading={periodoMode === 'date' ? loadingDettaglio : loadingRiepilogo}
          error={periodoMode === 'date' ? errorDettaglio : errorRiepilogo}
          periodoMode={periodoMode}
          trimestre={trimestre}
          totaliPeriodo={totaliPeriodo}
        />
      ) : (
        <BudgetDettaglio
          righe={righeDettaglio}
          loading={loadingDettaglio}
          error={errorDettaglio}
          periodoMode={periodoMode}
          anno={anno}
          trimestre={trimestre}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
      )}
    </div>
  );
}
