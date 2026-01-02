import { useState, useEffect } from 'react';
import useStore from './store';
import Dashboard from './components/Dashboard';
import CaricoMerce from './components/CaricoMerce';
import Vendita from './components/Vendita';
import Giacenze from './components/Giacenze';
import StoricoVendite from './components/StoricoVendite';
import ArchivioCommissioni from './components/ArchivioCommissioni';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const init = useStore((state) => state.init);
  const cleanup = useStore((state) => state.cleanup);

  useEffect(() => {
    init();
    return () => cleanup();
  }, []);

  const navigate = (page) => {
    setCurrentPage(page);
  };

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
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {renderPage()}
    </div>
  );
}

export default App;
