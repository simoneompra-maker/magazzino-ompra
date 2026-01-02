import { PackagePlus, ShoppingCart, Package, Wifi, WifiOff, History, FileText, Clock } from 'lucide-react';
import useStore from '../store';

export default function Dashboard({ onNavigate }) {
  const syncStatus = useStore((state) => state.syncStatus);
  const inventoryCount = useStore((state) => 
    state.inventory.filter(item => item.status === 'available').length
  );
  const salesCount = useStore((state) => state.sales.length);
  const pendingCommissioni = useStore((state) => 
    state.commissioni.filter(c => c.status === 'pending').length
  );

  const getSyncIcon = () => {
    if (syncStatus === 'success') return <Wifi className="w-5 h-5" style={{ color: '#006B3F' }} />;
    if (syncStatus === 'error') return <WifiOff className="w-5 h-5 text-red-500" />;
    if (syncStatus === 'syncing') return <Wifi className="w-5 h-5 text-yellow-500 animate-pulse" />;
    return <Wifi className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gray-50">
      {/* Header OMPRA */}
      <div 
        className="rounded-xl p-4 mb-4 text-white"
        style={{ backgroundColor: '#006B3F' }}
      >
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-3xl font-bold">OMPRA</h1>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
            {getSyncIcon()}
          </div>
        </div>
        <p className="text-white/80 text-sm">Gestionale Magazzino</p>
      </div>

      {/* Stats rapide */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-xl p-3 border-l-4" style={{ borderLeftColor: '#006B3F' }}>
          <p className="text-gray-500 text-xs">Giacenze</p>
          <p className="text-2xl font-bold" style={{ color: '#006B3F' }}>{inventoryCount}</p>
        </div>
        <div className="bg-white rounded-xl p-3 border-l-4" style={{ borderLeftColor: '#FFDD00' }}>
          <p className="text-gray-500 text-xs">Vendite</p>
          <p className="text-2xl font-bold text-gray-700">{salesCount}</p>
        </div>
      </div>

      {/* Alert commissioni pendenti */}
      {pendingCommissioni > 0 && (
        <button 
          onClick={() => onNavigate('archivio-commissioni')}
          className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-xl flex items-center gap-3"
        >
          <Clock className="w-6 h-6 text-yellow-600" />
          <div className="flex-1 text-left">
            <p className="font-semibold text-yellow-800">
              {pendingCommissioni} commissione{pendingCommissioni > 1 ? 'i' : ''} in attesa
            </p>
            <p className="text-xs text-yellow-600">Clicca per gestire</p>
          </div>
        </button>
      )}

      {/* Pulsanti Principali */}
      <div className="flex-1 flex flex-col gap-3">
        {/* CARICO MERCE */}
        <button
          onClick={() => onNavigate('carico')}
          className="flex items-center justify-center gap-3 p-5 rounded-xl text-white font-semibold shadow-lg active:scale-98 transition-transform"
          style={{ backgroundColor: '#006B3F' }}
        >
          <PackagePlus className="w-7 h-7" />
          <div className="text-left">
            <div className="text-xl">CARICO MERCE</div>
            <div className="text-sm opacity-80">Scansione OCR</div>
          </div>
        </button>

        {/* NUOVA VENDITA */}
        <button
          onClick={() => onNavigate('vendita')}
          className="flex items-center justify-center gap-3 p-5 rounded-xl font-semibold shadow-lg active:scale-98 transition-transform"
          style={{ backgroundColor: '#FFDD00', color: '#006B3F' }}
        >
          <ShoppingCart className="w-7 h-7" />
          <div className="text-left">
            <div className="text-xl">NUOVA VENDITA</div>
            <div className="text-sm opacity-80">Scarico e commissione</div>
          </div>
        </button>

        {/* Riga con 2 pulsanti */}
        <div className="grid grid-cols-2 gap-3">
          {/* GIACENZE */}
          <button
            onClick={() => onNavigate('giacenze')}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-700 text-white font-semibold shadow-lg active:scale-98 transition-transform"
          >
            <Package className="w-6 h-6" />
            <div className="text-center">
              <div className="text-base">GIACENZE</div>
              <div className="text-xs opacity-70">Magazzino</div>
            </div>
          </button>
          
          {/* STORICO */}
          <button
            onClick={() => onNavigate('storico')}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-600 text-white font-semibold shadow-lg active:scale-98 transition-transform"
          >
            <History className="w-6 h-6" />
            <div className="text-center">
              <div className="text-base">STORICO</div>
              <div className="text-xs opacity-70">Vendite</div>
            </div>
          </button>
        </div>

        {/* ARCHIVIO COMMISSIONI */}
        <button
          onClick={() => onNavigate('archivio-commissioni')}
          className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white border-2 font-semibold shadow active:scale-98 transition-transform"
          style={{ borderColor: '#006B3F', color: '#006B3F' }}
        >
          <FileText className="w-6 h-6" />
          <div className="text-left">
            <div className="text-base">ARCHIVIO COMMISSIONI</div>
            <div className="text-xs opacity-70">Gestisci ordini in attesa</div>
          </div>
          {pendingCommissioni > 0 && (
            <span className="ml-auto bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-bold">
              {pendingCommissioni}
            </span>
          )}
        </button>
      </div>

      {/* Footer */}
      <div className="mt-4 text-center text-xs text-gray-400">
        <p>v1.3.0 - OMPRA Gestionale</p>
      </div>
    </div>
  );
}
