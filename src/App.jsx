import { useState, useEffect } from 'react';
import useStore from './store';
import Dashboard from './components/Dashboard';
import CaricoMerce from './components/CaricoMerce';
import Vendita from './components/Vendita';
import Giacenze from './components/Giacenze';
import StoricoVendite from './components/StoricoVendite';
import ArchivioCommissioni from './components/ArchivioCommissioni';
import Listini from './components/Listini';
import PoliticheCommerciali from './components/PoliticheCommerciali';
import BudgetAdmin from './components/BudgetAdmin';
import SelezionaOperatore from './components/SelezionaOperatore';
import PratoVivo from './components/PratoVivo';

const OPERATORE_KEY = 'ompra_ultimo_operatore';

// Versione iniettata da vite.config.js al momento del build
const CURRENT_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [operatore, setOperatore] = useState(() => {
    try { return localStorage.getItem(OPERATORE_KEY) || ''; } catch { return ''; }
  });
  const init = useStore((state) => state.init);
  const cleanup = useStore((state) => state.cleanup);

  useEffect(() => {
    init();
    return () => cleanup();
  }, []);

  // ── Version check ──────────────────────────────────────────
  // Controlla se è disponibile una nuova versione ogni volta che
  // la finestra torna in focus (es. cassiere riapre il browser)
  useEffect(() => {
    const checkVersion = async () => {
      try {
        // Cache-busting: aggiunge timestamp per evitare risposte cached
        const res = await fetch(`/version.json?t=${Date.now()}`);
        if (!res.ok) return;
        const { version } = await res.json();
        if (version && version !== CURRENT_VERSION) {
          // Nuova versione disponibile — ricarica silenziosamente
          window.location.reload();
        }
      } catch {
        // Errore di rete — non fare nulla, riproverà al prossimo focus
      }
    };

    // Controlla subito all'avvio
    checkVersion();

    // Ricontrolla ogni volta che la finestra torna in focus
    window.addEventListener('focus', checkVersion);
    return () => window.removeEventListener('focus', checkVersion);
  }, []);
  // ───────────────────────────────────────────────────────────

  const navigate = (page) => setCurrentPage(page);

  const handleSelezionaOperatore = (nome) => {
    setOperatore(nome);
    setCurrentPage('home');
  };

  const handleCambiaOperatore = () => {
    try { localStorage.removeItem(OPERATORE_KEY); } catch {}
    setOperatore('');
    setCurrentPage('home');
  };

  // Mostra selezione operatore se non loggato
  if (!operatore) {
    return (
      <div className="min-h-screen bg-gray-100">
        <SelezionaOperatore onSelezionato={handleSelezionaOperatore} />
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'carico':
        return <CaricoMerce onNavigate={navigate} />;
      case 'vendita':
        return <Vendita onNavigate={navigate} />;
      case 'giacenze':
        return <Giacenze onNavigate={navigate} />;
      case 'storico':
        return <StoricoVendite onNavigate={navigate} />;
      case 'archivio-commissioni':
        return <ArchivioCommissioni onNavigate={navigate} />;
      case 'listini':
        return <Listini onNavigate={navigate} />;
      case 'politiche-commerciali':
        return <PoliticheCommerciali onNavigate={navigate} />;
      case 'budget-admin':
        return <BudgetAdmin onNavigate={navigate} />;
      case 'pratovivo':
        return <PratoVivo onNavigate={navigate} />;
      default:
        return <Dashboard onNavigate={navigate} onCambiaOperatore={handleCambiaOperatore} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {renderPage()}
    </div>
  );
}

export default App;
