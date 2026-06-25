import { useState } from 'react';
import { ArrowLeft, Download, RefreshCw, Lock } from 'lucide-react';
import { useRiepilogoCategorie, useDettaglioVendite } from './useBudget';
import BudgetRiepilogo from './BudgetRiepilogo';
import BudgetDettaglio from './BudgetDettaglio';
import { exportBudgetXlsx } from './exportBudgetXlsx';

export default function BudgetModule({ onNavigate }) {
  const operatoreLoggato = (() => {
    try { return localStorage.getItem('ompra_ultimo_operatore') || ''; } catch { return ''; }
  })();
  const isAdmin = operatoreLoggato.toLowerCase() === 'admin';

  const [tab, setTab] = useState('riepilogo');

  const {
    righeAnno, anni, anno, setAnno,
    loading: loadingRiepilogo, error: errorRiepilogo, refresh: refreshRiepilogo,
  } = useRiepilogoCategorie();

  const {
    righe: righeDettaglio,
    loading: loadingDettaglio, error: errorDettaglio, refresh: refreshDettaglio,
  } = useDettaglioVendite(anno);

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
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('home')} className="p-1 hover:bg-gray-100 rounded">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-gray-800">Budget</h1>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={anno || ''}
            onChange={e => setAnno(Number(e.target.value))}
            className="border-2 border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-green-500 bg-white"
          >
            {anni.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <button
            onClick={refresh}
            disabled={loading}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            title="Aggiorna dati"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => exportBudgetXlsx(righeDettaglio, anno)}
            disabled={!righeDettaglio.length}
            className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Esporta Excel</span>
          </button>
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
        <BudgetRiepilogo righe={righeAnno} loading={loadingRiepilogo} error={errorRiepilogo} />
      ) : (
        <BudgetDettaglio righe={righeDettaglio} loading={loadingDettaglio} error={errorDettaglio} />
      )}
    </div>
  );
}
