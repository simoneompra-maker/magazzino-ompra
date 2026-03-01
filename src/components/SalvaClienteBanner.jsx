// ============================================================
// FILE: src/components/SalvaClienteBanner.jsx
// Componente banner non-bloccante per salvare un nuovo cliente in rubrica
// Da importare in Vendita.jsx
// ============================================================

import { useState } from 'react';
import { supabase } from '../supabaseClient'; // aggiusta il path se necessario

/**
 * Banner che appare dopo la conferma commissione se il cliente non è in rubrica.
 * Non blocca il flusso — la commissione è già salvata quando questo appare.
 *
 * Props:
 *   clienteInfo  - oggetto con i dati cliente dal form (stesso formato del JSONB)
 *   onClose      - callback per chiudere/nascondere il banner
 */
export default function SalvaClienteBanner({ clienteInfo, onClose }) {
  const [loading, setLoading] = useState(false);
  const [salvato, setSalvato] = useState(false);
  const [errore, setErrore] = useState(null);

  if (!clienteInfo) return null;

  const nomeVisualizzato =
    clienteInfo.nomeP ||
    `${clienteInfo.nome || ''} ${clienteInfo.cognome || ''}`.trim() ||
    'Cliente senza nome';

  const handleSalva = async () => {
    setLoading(true);
    setErrore(null);

    try {
      const searchKey =
        clienteInfo.searchText ||
        `${clienteInfo.nome || ''} ${clienteInfo.cognome || ''}${clienteInfo.nomeP || ''}`.trim();

      // Upsert: se esiste aggiorna, se no inserisce
      const { error } = await supabase.from('clienti').upsert(
        {
          nome:          clienteInfo.nome      || null,
          cognome:       clienteInfo.cognome   || null,
          nome_completo: clienteInfo.nomeP     || null,
          indirizzo:     clienteInfo.indirizzo || null,
          cap:           clienteInfo.cap       || null,
          localita:      clienteInfo.localita  || null,
          provincia:     clienteInfo.provincia || null,
          telefono:      clienteInfo.telefono  || null,
          email:         clienteInfo.email     || null,
          contatto:      clienteInfo.contatto  || null,
          search_text:   searchKey             || null,
          fonte:         'commissione',
        },
        {
          onConflict:       'search_text', // evita duplicati
          ignoreDuplicates: false,         // aggiorna se esiste
        }
      );

      if (error) throw error;

      setSalvato(true);
      setTimeout(() => onClose(), 2000); // chiude da solo dopo 2 secondi
    } catch (err) {
      console.error('Errore salvataggio cliente:', err);
      setErrore('Errore nel salvataggio. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  // Stato: salvato con successo
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

  // Stato: banner con scelta
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm w-full">
      {/* Header */}
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

      {/* Nome cliente */}
      <p className="text-sm text-gray-600 mb-1">
        <strong className="text-gray-800">{nomeVisualizzato}</strong>
      </p>
      {(clienteInfo.localita || clienteInfo.telefono) && (
        <p className="text-xs text-gray-400 mb-3">
          {[clienteInfo.localita, clienteInfo.telefono]
            .filter(Boolean)
            .join(' · ')}
        </p>
      )}

      {/* Errore */}
      {errore && (
        <p className="text-xs text-red-500 mb-2">{errore}</p>
      )}

      {/* Azioni */}
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


// ============================================================
// ISTRUZIONI DI INTEGRAZIONE IN Vendita.jsx
// Aggiungi questi blocchi nei punti indicati
// ============================================================

/*
── 1. IMPORT (in cima a Vendita.jsx) ──────────────────────────

import SalvaClienteBanner from './SalvaClienteBanner';


── 2. STATE (dentro il componente Vendita, con gli altri useState) ──

const [showSalvaClienteBanner, setShowSalvaClienteBanner] = useState(false);
const [pendingCliente, setPendingCliente] = useState(null);


── 3. FUNZIONE DA AGGIUNGERE (prima di handleSubmit o dove gestisci il salvataggio) ──

const checkEsalvaCliente = async (clienteInfo) => {
  if (!clienteInfo) return;

  const chiave =
    clienteInfo.searchText ||
    `${clienteInfo.nome || ''}${clienteInfo.cognome || ''}${clienteInfo.nomeP || ''}`.trim();

  if (!chiave) return; // nessun dato identificativo, skip silenzioso

  const { data: esistente } = await supabase
    .from('clienti')
    .select('id')
    .eq('search_text', chiave)
    .maybeSingle();

  if (!esistente) {
    setPendingCliente(clienteInfo);
    setShowSalvaClienteBanner(true);
  }
};


── 4. CHIAMATA (dentro la tua funzione di conferma/salvataggio commissione) ──
   Aggiungi questa riga DOPO che la commissione è già stata salvata su Supabase:

  await checkEsalvaCliente(clienteInfo); // clienteInfo = l'oggetto dati cliente del form


── 5. RENDER (nel JSX di Vendita.jsx, prima della chiusura del return) ──

  {showSalvaClienteBanner && pendingCliente && (
    <SalvaClienteBanner
      clienteInfo={pendingCliente}
      onClose={() => {
        setShowSalvaClienteBanner(false);
        setPendingCliente(null);
      }}
    />
  )}

*/
