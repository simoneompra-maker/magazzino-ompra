import { useState, useEffect } from 'react';
import { supabase } from '../store';
import { ArrowLeft, Plus, Trash2, User } from 'lucide-react';

export default function GestioneOperatori({ onNavigate }) {
  const [operatori, setOperatori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuovoNome, setNuovoNome] = useState('');
  const [errore, setErrore] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carica();
  }, []);

  const carica = async () => {
    setLoading(true);
    const { data } = await supabase.from('operatori').select('*').order('nome');
    setOperatori(data || []);
    setLoading(false);
  };

  const aggiungi = async () => {
    const nome = nuovoNome.trim();
    if (!nome) return;
    setErrore('');
    setSalvando(true);
    const { error } = await supabase.from('operatori').insert({ nome });
    setSalvando(false);
    if (error) {
      setErrore(error.code === '23505' ? 'Nome già esistente.' : 'Errore: ' + error.message);
      return;
    }
    setNuovoNome('');
    await carica();
  };

  const rimuovi = async (id, nome) => {
    if (nome.toLowerCase() === 'admin') {
      alert('Non puoi rimuovere Admin.');
      return;
    }
    if (!confirm(`Rimuovere l'operatore "${nome}"?`)) return;
    await supabase.from('operatori').delete().eq('id', id);
    await carica();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="px-4 py-3 text-white flex items-center gap-3" style={{ backgroundColor: '#006B3F' }}>
        <button onClick={() => onNavigate('home')} className="p-1 rounded-lg hover:bg-white/20">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-bold text-lg leading-none">Gestione Operatori</h1>
          <p className="text-white/70 text-xs mt-0.5">Aggiungi o rimuovi account</p>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">

        {/* Aggiungi nuovo */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-gray-700 mb-3 text-sm">Nuovo operatore</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nome (es. Marco, Luca...)"
              value={nuovoNome}
              onChange={e => setNuovoNome(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && aggiungi()}
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={aggiungi}
              disabled={salvando || !nuovoNome.trim()}
              className="px-4 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-1"
              style={{ backgroundColor: '#006B3F' }}
            >
              <Plus className="w-4 h-4" />
              Aggiungi
            </button>
          </div>
          {errore && <p className="text-red-500 text-xs mt-2">{errore}</p>}
        </div>

        {/* Lista operatori */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-gray-700 mb-3 text-sm">Operatori attivi</h2>
          {loading ? (
            <p className="text-gray-400 text-sm">Caricamento...</p>
          ) : (
            <div className="space-y-2">
              {operatori.map(op => (
                <div key={op.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: op.nome.toLowerCase() === 'admin' ? '#374151' : '#006B3F' }}
                  >
                    {op.nome.charAt(0).toUpperCase()}
                  </div>
                  <span className="flex-1 font-medium text-gray-700">{op.nome}</span>
                  {op.nome.toLowerCase() === 'admin' ? (
                    <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">Protetto</span>
                  ) : (
                    <button
                      onClick={() => rimuovi(op.id, op.nome)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center px-4">
          Gli operatori rimossi non potranno più accedere. Le loro commissioni rimangono nel database.
        </p>
      </div>
    </div>
  );
}
