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

const OPERATORE_KEY = 'ompra_ultimo_operatore';

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
