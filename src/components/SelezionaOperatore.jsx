import { useState, useEffect } from 'react';
import { supabase } from '../store';

const OPERATORE_KEY = 'ompra_ultimo_operatore';

export default function SelezionaOperatore({ onSelezionato }) {
  const [operatori, setOperatori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState('');

  useEffect(() => {
    caricaOperatori();
  }, []);

  const caricaOperatori = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('operatori')
      .select('nome')
      .order('nome');
    if (error) {
      setErrore('Errore di connessione. Riprova.');
    } else {
      setOperatori(data || []);
    }
    setLoading(false);
  };

  const seleziona = (nome) => {
    try { localStorage.setItem(OPERATORE_KEY, nome); } catch {}
    onSelezionato(nome);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ backgroundColor: '#006B3F' }}>
          <span className="text-white text-2xl font-bold">O</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">OMPRA</h1>
        <p className="text-gray-400 text-sm mt-1">Gestionale Magazzino</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-700 mb-1">Chi sei?</h2>
        <p className="text-sm text-gray-400 mb-5">Seleziona il tuo nome per accedere</p>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {errore && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm mb-4">
            {errore}
            <button onClick={caricaOperatori} className="ml-2 underline">Riprova</button>
          </div>
        )}

        {!loading && !errore && (
          <div className="space-y-2">
            {operatori.map(({ nome }) => (
              <button
                key={nome}
                onClick={() => seleziona(nome)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 border-gray-100 hover:border-green-400 hover:bg-green-50 active:scale-95 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: nome === 'Admin' ? '#374151' : '#006B3F' }}>
                    {nome.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-700">{nome}</span>
                </div>
                {nome === 'Admin' && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Admin</span>
                )}
              </button>
            ))}
          </div>
        )}

        {!loading && operatori.length === 0 && !errore && (
          <p className="text-gray-400 text-sm text-center py-4">
            Nessun operatore configurato.<br />Contatta l'amministratore.
          </p>
        )}
      </div>

      <p className="text-gray-300 text-xs mt-8">v1.3.2 · OMPRA Gestionale</p>
    </div>
  );
}
