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
import BudgetModule from './modules/budget/BudgetModule';
import SelezionaOperatore from './components/SelezionaOperatore';
import PratoVivo from './components/PratoVivo';
import Sopralluogo from './components/Sopralluogo';
import Noleggio from './components/Noleggio';
import RubricaClienti from './components/RubricaClienti';
import StihlCatalog from './components/StihlCatalog';
import ArchivioPreventivi from './components/ArchivioPreventivi';
import CompilatorePrev from './components/CompilatorePrev';
import CatalogoProdotti from './components/CatalogoProdotti';
import AntizanzareModule from './modules/antizanzare/AntizanzareModule';
import { puoAccedere, paginaIniziale, bloccatoSuModulo } from './lib/permessi';

const OPERATORE_KEY = 'ompra_ultimo_operatore';
const OPERATORE_FULL_KEY = 'ompra_operatore';

/** Legge l'operatore salvato. Chi ha fatto login prima dei ruoli ha solo il nome. */
function leggiOperatore() {
  try {
    const raw = localStorage.getItem(OPERATORE_FULL_KEY);
    if (raw) return JSON.parse(raw);
    const nome = localStorage.getItem(OPERATORE_KEY);
    if (nome) return { nome, ruolo: nome.toLowerCase() === 'admin' ? 'admin' : 'commerciale', moduli: null };
  } catch { /* localStorage non disponibile */ }
  return null;
}

// Versione iniettata da vite.config.js al momento del build
const CURRENT_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [operatore, setOperatore] = useState(leggiOperatore);
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

  // Blocca la navigazione verso moduli non consentiti all'operatore
  const navigate = (page) => {
    if (page !== 'home' && !puoAccedere(operatore, page)) return;
    setCurrentPage(page);
  };

  const handleSelezionaOperatore = (op) => {
    setOperatore(op);
    setCurrentPage(paginaIniziale(op));
  };

  const handleCambiaOperatore = () => {
    try {
      localStorage.removeItem(OPERATORE_KEY);
      localStorage.removeItem(OPERATORE_FULL_KEY);
    } catch {}
    setOperatore(null);
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

  // Il tecnico non ha una dashboard: vive dentro il suo unico modulo
  if (bloccatoSuModulo(operatore)) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AntizanzareModule operatore={operatore} onEsci={null} />
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
      case 'budget':
        return <BudgetModule onNavigate={navigate} />;
      case 'pratovivo':
        return <PratoVivo onNavigate={navigate} />;
      case 'sopralluogo':
        return <Sopralluogo onNavigate={navigate} />;
      case 'noleggio':
        return <Noleggio onNavigate={navigate} />;
      case 'rubrica-clienti':
        return <RubricaClienti onBack={() => navigate('home')} />;
      case 'stihl':
        return <StihlCatalog isAdmin={true} onBack={() => navigate('home')} />;
      case 'preventivi':
        return <ArchivioPreventivi onNavigate={navigate} />;
      case 'compilatore-prev':
        return <CompilatorePrev onNavigate={navigate} />;
      case 'catalogo-prodotti':
        return <CatalogoProdotti onNavigate={navigate} />;
      case 'antizanzare':
        return <AntizanzareModule operatore={operatore} onEsci={() => navigate('home')} />;
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
