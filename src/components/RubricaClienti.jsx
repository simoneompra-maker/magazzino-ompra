// ============================================================
// FILE: src/components/RubricaClienti.jsx
// Gestione rubrica clienti — solo admin
// Funzioni: ricerca, visualizzazione, soft delete
// ============================================================

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../store';
import { invalidaClienteCache } from '../services/clientiService';
import { Search, Trash2, X, User, Phone, Mail, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

const VERDE = '#006B3F';

export default function RubricaClienti({ onBack }) {
  const [clienti, setClienti]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [searchTerm, setSearchTerm]     = useState('');
  const [clienteDettaglio, setClienteDettaglio] = useState(null);
  const [confermaDelete, setConfermaDelete]     = useState(null); // cliente da eliminare
  const [deleting, setDeleting]         = useState(false);
  const [feedback, setFeedback]         = useState(null); // { tipo: 'ok'|'err', msg }

  // Verifica admin
  const operatoreLoggato = (() => {
    try { return localStorage.getItem('ompra_ultimo_operatore') || ''; } catch { return ''; }
  })();
  const isAdmin = operatoreLoggato.toLowerCase() === 'admin';

  // Carica clienti (escludi soft-deleted)
  const loadClienti = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clienti')
        .select('*')
        .is('deleted_at', null)
        .order('nome_completo', { ascending: true });
      if (error) throw error;
      setClienti(data || []);
    } catch (err) {
      console.error('Errore caricamento clienti:', err);
      setFeedback({ tipo: 'err', msg: 'Errore caricamento rubrica.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadClienti(); }, []);

  // Filtro ricerca
  const clientiFiltrati = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return clienti;
    return clienti.filter(c => {
      const nome = (c.nome_completo || `${c.cognome || ''} ${c.nome || ''}`).toLowerCase();
      const tel  = (c.telefono || '').toLowerCase();
      const loc  = (c.localita || '').toLowerCase();
      const cf   = (c.cf || '').toLowerCase();
      return nome.includes(term) || tel.includes(term) || loc.includes(term) || cf.includes(term);
    });
  }, [clienti, searchTerm]);

  // Soft delete
  const handleDelete = async (cliente) => {
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('clienti')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', cliente.id);
      if (error) throw error;
      setClienti(prev => prev.filter(c => c.id !== cliente.id));
      invalidaClienteCache(); // forza ricaricamento autocompletamento
      setConfermaDelete(null);
      setClienteDettaglio(null);
      setFeedback({ tipo: 'ok', msg: `${nomeVisualizzato(cliente)} rimosso dalla rubrica.` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error('Errore eliminazione cliente:', err);
      setFeedback({ tipo: 'err', msg: 'Errore durante l\'eliminazione. Riprova.' });
    } finally {
      setDeleting(false);
    }
  };

  const nomeVisualizzato = (c) =>
    c.nome_completo ||
    `${c.cognome || ''} ${c.nome || ''}`.trim() ||
    c.telefono ||
    'Cliente senza nome';

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <span className="text-4xl mb-4">🔒</span>
        <p className="text-gray-600 font-medium">Accesso riservato agli amministratori.</p>
        <button onClick={onBack} className="mt-4 text-sm text-gray-500 underline">Torna indietro</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-gray-100">
          <X className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex-1">
          <h2 className="font-bold text-gray-800">Rubrica Clienti</h2>
          <p className="text-xs text-gray-400">{clienti.length} clienti in archivio</p>
        </div>
      </div>

      {/* Barra ricerca */}
      <div className="px-4 py-3 bg-white border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cerca per nome, telefono, città, CF..."
            className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : clientiFiltrati.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <User className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">{searchTerm ? 'Nessun cliente trovato' : 'Nessun cliente in rubrica'}</p>
          </div>
        ) : (
          clientiFiltrati.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Riga principale */}
              <div
                className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => setClienteDettaglio(clienteDettaglio?.id === c.id ? null : c)}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ backgroundColor: VERDE }}>
                  {nomeVisualizzato(c).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{nomeVisualizzato(c)}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {c.telefono && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Phone className="w-3 h-3" />{c.telefono}
                      </span>
                    )}
                    {c.localita && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{c.localita}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {/* Fonte badge */}
                  {c.fonte && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full hidden sm:block">
                      {c.fonte}
                    </span>
                  )}
                  {clienteDettaglio?.id === c.id
                    ? <ChevronUp className="w-4 h-4 text-gray-400" />
                    : <ChevronDown className="w-4 h-4 text-gray-400" />
                  }
                </div>
              </div>

              {/* Dettaglio espandibile */}
              {clienteDettaglio?.id === c.id && (
                <div className="border-t bg-gray-50 px-4 py-3 space-y-2">
                  {(c.indirizzo || c.cap || c.localita || c.provincia) && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <span>
                        {[c.indirizzo, [c.cap, c.localita].filter(Boolean).join(' '), c.provincia].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                  {c.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{c.email}</span>
                    </div>
                  )}
                  {c.cf && (
                    <div className="text-sm text-gray-600">
                      <span className="text-xs text-gray-400 mr-1">CF:</span>
                      <span className="font-mono">{c.cf}</span>
                    </div>
                  )}
                  {c.piva && (
                    <div className="text-sm text-gray-600">
                      <span className="text-xs text-gray-400 mr-1">P.IVA:</span>
                      <span className="font-mono">{c.piva}</span>
                    </div>
                  )}
                  {c.created_at && (
                    <div className="text-xs text-gray-400">
                      Aggiunto il {new Date(c.created_at).toLocaleDateString('it-IT')}
                    </div>
                  )}

                  {/* Bottone elimina */}
                  <div className="pt-2 border-t mt-2">
                    <button
                      onClick={() => setConfermaDelete(c)}
                      className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium py-1.5 px-3 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Rimuovi dalla rubrica
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal conferma eliminazione */}
      {confermaDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="text-center mb-4">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Rimuovi cliente</h3>
              <p className="text-sm text-gray-500 mt-1">
                Vuoi rimuovere <strong>{nomeVisualizzato(confermaDelete)}</strong> dalla rubrica?
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Il cliente verrà nascosto dalla rubrica. Le commissioni già registrate non saranno modificate.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfermaDelete(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm"
              >
                Annulla
              </button>
              <button
                onClick={() => handleDelete(confermaDelete)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold text-sm transition-colors"
              >
                {deleting ? 'Rimozione...' : 'Rimuovi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback toast */}
      {feedback && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm text-white text-sm font-medium ${
          feedback.tipo === 'ok' ? 'bg-green-600' : 'bg-red-500'
        }`}>
          <span>{feedback.tipo === 'ok' ? '✓' : '⚠️'}</span>
          <span>{feedback.msg}</span>
        </div>
      )}
    </div>
  );
}
