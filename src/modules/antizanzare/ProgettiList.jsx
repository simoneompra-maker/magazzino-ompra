import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, Search, Bug, RefreshCw, Trash2, Loader2 } from 'lucide-react';
import { listaProgetti, eliminaProgetto } from './antizanzareService';
import { vedePrezzi } from '../../lib/permessi';

const VERDE = '#006B3F';

const STATI = {
  bozza: { label: 'Bozza', cls: 'bg-gray-100 text-gray-600' },
  preventivo: { label: 'Preventivo', cls: 'bg-orange-100 text-orange-700' },
  ordine: { label: 'Ordine', cls: 'bg-blue-100 text-blue-700' },
  montato: { label: 'Montato', cls: 'bg-green-100 text-green-700' },
  chiuso: { label: 'Chiuso', cls: 'bg-gray-200 text-gray-500' },
};

const eur = (n) =>
  n == null ? '—' : Number(n).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

const dataIt = (s) => (s ? new Date(s).toLocaleDateString('it-IT') : '');

export default function ProgettiList({ operatore, onApri, onNuovo, onEsci }) {
  const [progetti, setProgetti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState('');
  const [filtro, setFiltro] = useState('');
  const [statoFiltro, setStatoFiltro] = useState('');

  const mostraPrezzi = vedePrezzi(operatore);

  const carica = useCallback(async () => {
    setLoading(true);
    setErrore('');
    try {
      setProgetti(await listaProgetti(operatore));
    } catch (e) {
      setErrore(e.message || 'Errore di caricamento');
    } finally {
      setLoading(false);
    }
  }, [operatore]);

  useEffect(() => {
    carica();
  }, [carica]);

  /* Il tecnico non cancella niente: vede solo i progetti che deve montare */
  const puoEliminare = operatore?.ruolo !== 'tecnico';
  const [inCancellazione, setInCancellazione] = useState(null);

  const elimina = async (p, e) => {
    e.stopPropagation();
    const conferma = window.confirm(
      `Eliminare ${p.numero || 'il progetto'} di ${p.cliente_nome}?\n\n` +
        'Spariscono anche le linee, la nota di carico e la foto. Non si torna indietro.'
    );
    if (!conferma) return;

    setInCancellazione(p.id);
    setErrore('');
    try {
      await eliminaProgetto(p.id);
      setProgetti((elenco) => elenco.filter((x) => x.id !== p.id));
    } catch (err) {
      setErrore('Eliminazione non riuscita: ' + (err.message || err));
    } finally {
      setInCancellazione(null);
    }
  };

  const q = filtro.trim().toLowerCase();
  const visibili = progetti.filter((p) => {
    if (statoFiltro && p.stato !== statoFiltro) return false;
    if (!q) return true;
    return [p.numero, p.cliente_nome, p.indirizzo, p.brand]
      .filter(Boolean)
      .some((v) => v.toLowerCase().includes(q));
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="px-4 py-3 text-white flex items-center gap-3" style={{ backgroundColor: VERDE }}>
        {onEsci && (
          <button onClick={onEsci} className="p-1 rounded-lg hover:bg-white/20" aria-label="Torna alla dashboard">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <Bug className="w-6 h-6 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-lg leading-none">Impianti antizanzare</h1>
          <p className="text-white/70 text-xs mt-0.5 truncate">
            {operatore?.nome}
            {operatore?.ruolo === 'tecnico' && ' · progetti assegnati a te'}
          </p>
        </div>
        <button onClick={carica} className="p-1.5 rounded-lg hover:bg-white/20" aria-label="Ricarica">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="p-4 space-y-3 max-w-3xl mx-auto">
        {/* Ricerca e filtro */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Cerca cliente, numero, indirizzo…"
              className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={statoFiltro}
            onChange={(e) => setStatoFiltro(e.target.value)}
            className="border rounded-lg px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Tutti</option>
            {Object.entries(STATI).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </div>

        {errore && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
            {errore}
            <button onClick={carica} className="ml-2 underline">
              Riprova
            </button>
          </div>
        )}

        {/* Elenco */}
        {loading ? (
          <p className="text-gray-400 text-sm text-center py-8">Caricamento…</p>
        ) : visibili.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Bug className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">
              {progetti.length === 0 ? 'Nessun progetto. Creane uno.' : 'Nessun progetto con questi filtri.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {visibili.map((p) => {
              const st = STATI[p.stato] || STATI.bozza;
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-3"
                >
                  <button onClick={() => onApri(p.id)} className="w-full text-left">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{p.cliente_nome}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {p.numero}
                        {p.indirizzo && ` · ${p.indirizzo}`}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${st.cls}`}>
                      {st.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span className="truncate">
                      {p.brand || '—'}
                      {p.macchina_code && ` · ${p.macchina_code}`}
                      {p.tecnico && ` · 🔧 ${p.tecnico}`}
                    </span>
                    <span className="flex-shrink-0 ml-2">
                      {mostraPrezzi && p.prezzo_cliente != null ? (
                        <b className="text-gray-700">{eur(p.prezzo_cliente)}</b>
                      ) : (
                        dataIt(p.created_at)
                      )}
                    </span>
                  </div>
                  </button>

                  {puoEliminare && (
                    <div className="flex justify-end mt-1 -mb-1">
                      <button
                        onClick={(e) => elimina(p, e)}
                        disabled={inCancellazione === p.id}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-50"
                        title="Elimina il progetto"
                        aria-label={`Elimina ${p.numero || p.cliente_nome}`}
                      >
                        {inCancellazione === p.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Nuovo progetto — il tecnico non crea progetti */}
      {operatore?.ruolo !== 'tecnico' && (
        <button
          onClick={onNuovo}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center active:scale-95 transition-transform"
          style={{ backgroundColor: VERDE }}
          aria-label="Nuovo progetto"
        >
          <Plus className="w-7 h-7" />
        </button>
      )}
    </div>
  );
}
