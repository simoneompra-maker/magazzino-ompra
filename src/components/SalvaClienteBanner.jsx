// ============================================================
// FILE: src/components/SalvaClienteBanner.jsx
// ============================================================

import { useState } from 'react';
import { supabase } from '../store';
import { invalidaClienteCache } from '../services/clientiService';

export default function SalvaClienteBanner({ clienteInfo, onClose }) {
  const [loading, setLoading]   = useState(false);
  const [salvato, setSalvato]   = useState(false);
  const [errore, setErrore]     = useState(null);

  if (!clienteInfo) return null;

  const nomeVisualizzato =
    clienteInfo.nomeP ||
    clienteInfo.nome  ||
    `${clienteInfo.cognome || ''} ${clienteInfo.nome_raw || ''}`.trim() ||
    'Cliente senza nome';

  const handleSalva = async () => {
    setLoading(true);
    setErrore(null);

    try {
      // ── search_text ─────────────────────────────────────────
      // clienteVirtuale da Vendita ha nome già unito (es. "Rossi Mario")
      // clienteInfo da OCR diretto può avere nome+cognome separati
      const searchKey = (
        clienteInfo.nomeP ||
        clienteInfo.nome  ||
        `${clienteInfo.cognome || ''} ${clienteInfo.nome || ''}`.trim()
      ).trim();

      if (!searchKey) {
        setErrore('Nessun nome identificativo. Inserisci il cliente manualmente.');
        setLoading(false);
        return;
      }

      // ── Controlla una seconda volta per sicurezza ────────────
      const { data: esistente, error: errCheck } = await supabase
        .from('clienti')
        .select('id')
        .ilike('nome_completo', searchKey)
        .is('deleted_at', null)
        .maybeSingle();

      if (errCheck) throw errCheck;

      if (esistente) {
        // Già presente — chiude senza errore
        setSalvato(true);
        setTimeout(() => onClose(), 1500);
        return;
      }

      // ── INSERT semplice (no upsert — evita problema UNIQUE) ──
      const { error: errInsert } = await supabase.from('clienti').insert({
        nome:          clienteInfo.nome       || null,
        cognome:       clienteInfo.cognome    || null,
        nome_completo: clienteInfo.nomeP      || clienteInfo.nome || null,
        indirizzo:     clienteInfo.indirizzo  || null,
        cap:           clienteInfo.cap        || null,
        localita:      clienteInfo.localita   || null,
        provincia:     clienteInfo.provincia  || null,
        telefono:      clienteInfo.telefono   || null,
        email:         clienteInfo.email      || null,
        codice_fiscale: clienteInfo.cf         || null,
        partita_iva:   clienteInfo.piva       || null,
        sdi:           clienteInfo.sdi        || null,
        contatto:      clienteInfo.contatto   || null,
        search_text:   searchKey,
        fonte:         'commissione',
      });

      if (errInsert) throw errInsert;

      invalidaClienteCache(); // forza ricaricamento autocompletamento
      setSalvato(true);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      console.error('Errore salvataggio cliente:', err);
      // Messaggio utile a seconda del tipo di errore
      if (err?.code === '23505') {
        // Unique violation — già presente, chiude
        setSalvato(true);
        setTimeout(() => onClose(), 1500);
      } else {
        setErrore(`Errore: ${err?.message || 'Riprova.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Stato: salvato ─────────────────────────────────────────
  if (salvato) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm">
        <span className="text-xl">✓</span>
        <span className="text-sm font-medium">
          <strong>{nomeVisualizzato}</strong> salvato in rubrica
        </span>
      </div>
    );
  }

  // ── Stato: banner ──────────────────────────────────────────
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm w-full">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-blue-500 text-lg">👤</span>
          <span className="text-sm font-semibold text-gray-800">
            Cliente non in rubrica
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          aria-label="Chiudi"
        >
          ×
        </button>
      </div>

      <p className="text-sm text-gray-800 font-bold mb-1">{nomeVisualizzato}</p>
      {(clienteInfo.localita || clienteInfo.telefono) && (
        <p className="text-xs text-gray-400 mb-3">
          {[clienteInfo.localita, clienteInfo.telefono].filter(Boolean).join(' · ')}
        </p>
      )}

      {errore && (
        <p className="text-xs text-red-500 bg-red-50 rounded p-2 mb-2">{errore}</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleSalva}
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
                     text-white text-sm font-medium py-2 px-3 rounded-md
                     transition-colors duration-150"
        >
          {loading ? 'Salvataggio...' : 'Salva in rubrica'}
        </button>
        <button
          onClick={onClose}
          disabled={loading}
          className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50
                     text-gray-700 text-sm font-medium py-2 px-3 rounded-md
                     transition-colors duration-150"
        >
          Non ora
        </button>
      </div>
    </div>
  );
}
