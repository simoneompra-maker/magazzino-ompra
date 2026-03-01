// ============================================================
// FILE: src/components/PrivacyModal.jsx
// Modal bloccante privacy GDPR — appare in Archivio Commissioni
// quando privacy_required=true e privacy_acknowledged=false
// ============================================================

import { useState } from 'react';
import { supabase } from '../store'; // aggiusta il path se necessario

/**
 * Modal bloccante per raccolta consenso privacy.
 * Non ha X di chiusura — l'unica uscita è la conferma.
 *
 * Props:
 *   commissioneId  - uuid della commissione
 *   nomeCliente    - stringa nome cliente da mostrare
 *   onConfirmed    - callback chiamato dopo conferma su Supabase
 */
export default function PrivacyModal({ commissioneId, nomeCliente, onConfirmed }) {
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState(null);

  const handleConferma = async () => {
    setLoading(true);
    setErrore(null);
    try {
      const { error } = await supabase
        .from('commissioni')
        .update({ privacy_acknowledged: true })
        .eq('id', commissioneId);

      if (error) throw error;
      onConfirmed(); // chiude il modal nel parent
    } catch (err) {
      console.error('Errore conferma privacy:', err);
      setErrore('Errore nel salvataggio. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Overlay — copre tutto, nessun click-through
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4"
         style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>

      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">

        {/* Header rosso — cattura attenzione */}
        <div className="bg-red-600 px-5 py-4 flex items-center gap-3">
          <span className="text-3xl">⚠️</span>
          <div>
            <p className="text-white font-bold text-lg leading-tight">
              CLIENTE NUOVO
            </p>
            <p className="text-red-100 text-sm font-medium">
              Modulo privacy obbligatorio
            </p>
          </div>
        </div>

        {/* Corpo */}
        <div className="px-5 py-5 space-y-4">

          {/* Nome cliente in evidenza */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-center">
            <p className="text-xs text-red-500 font-medium uppercase tracking-wide mb-1">
              Cliente
            </p>
            <p className="text-gray-900 font-bold text-lg leading-tight">
              {nomeCliente || '—'}
            </p>
          </div>

          {/* Istruzione */}
          <p className="text-gray-700 text-sm text-center leading-relaxed">
            Questo cliente non è ancora in rubrica.{'\n'}
            <strong>Fai firmare il modulo privacy</strong> prima di procedere con il pagamento.
          </p>

          {/* Errore */}
          {errore && (
            <p className="text-red-500 text-xs text-center">{errore}</p>
          )}

          {/* Pulsante conferma — unica uscita */}
          <button
            onClick={handleConferma}
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-white text-base
                       transition-colors duration-150 disabled:opacity-60"
            style={{ backgroundColor: loading ? '#9ca3af' : '#15803d' }}
          >
            {loading
              ? 'Salvataggio...'
              : '✓ Ho fatto firmare il modulo privacy'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Non è possibile procedere senza conferma
          </p>
        </div>

      </div>
    </div>
  );
}


// ============================================================
// ISTRUZIONI DI INTEGRAZIONE IN Archivio.jsx (o nome equivalente)
// ============================================================

/*
── 1. IMPORT ──────────────────────────────────────────────────

import PrivacyModal from './PrivacyModal';


── 2. STATE ───────────────────────────────────────────────────
   Dentro il componente Archivio, con gli altri useState:

const [privacyCommissione, setPrivacyCommissione] = useState(null);
// Conterrà { id, cliente } quando una commissione necessita conferma privacy


── 3. CONTROLLO QUANDO SI APRE UNA COMMISSIONE ───────────────
   Nel punto dove l'utente seleziona/apre una commissione
   (es. onClick di una riga lista, o dentro handleOpenCommissione):

const handleOpenCommissione = (commissione) => {
  // Controlla se serve conferma privacy
  if (commissione.privacy_required && !commissione.privacy_acknowledged) {
    setPrivacyCommissione({
      id: commissione.id,
      cliente: commissione.cliente
    });
    return; // blocca — non aprire i dettagli finché non confermato
  }
  // ... resto del tuo codice per aprire la commissione
};


── 4. JSX — modal bloccante ───────────────────────────────────
   Nel return del componente Archivio, prima della chiusura del tag principale:

{privacyCommissione && (
  <PrivacyModal
    commissioneId={privacyCommissione.id}
    nomeCliente={privacyCommissione.cliente}
    onConfirmed={() => {
      // Aggiorna lo stato locale della commissione senza ricaricare tutto
      setCommissioni(prev =>
        prev.map(c =>
          c.id === privacyCommissione.id
            ? { ...c, privacy_acknowledged: true }
            : c
        )
      );
      setPrivacyCommissione(null);
      // Ora il cassiere può aprire la commissione normalmente
    }}
  />
)}


── 5. BADGE nella lista commissioni (opzionale ma consigliato) ──
   Nella riga che mostra ogni commissione in lista, aggiungi un badge
   rosso visibile se la privacy non è ancora confermata:

{commissione.privacy_required && !commissione.privacy_acknowledged && (
  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
    PRIVACY
  </span>
)}

*/
