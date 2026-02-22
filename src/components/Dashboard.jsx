import { PackagePlus, ShoppingCart, Package, Wifi, WifiOff, History, FileText, Clock, ClipboardList, BookLock } from 'lucide-react';
import useStore from '../store';

export default function Dashboard({ onNavigate }) {
  const syncStatus = useStore((state) => state.syncStatus);
  const inventoryCount = useStore((state) =>
    state.inventory.filter(item => item.status === 'available').length
  );
  const salesCount = useStore((state) =>
    state.commissioni.filter(c => c.status === 'completed').length
  );
  const pendingCommissioni = useStore((state) =>
    state.commissioni.filter(c => c.status === 'pending').length
  );

  const getSyncIcon = () => {
    if (syncStatus === 'success') return <Wifi className="w-4 h-4" style={{ color: '#006B3F' }} />;
    if (syncStatus === 'error') return <WifiOff className="w-4 h-4 text-red-500" />;
    if (syncStatus === 'syncing') return <Wifi className="w-4 h-4 text-yellow-500 animate-pulse" />;
    return <Wifi className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="min-h-screen flex flex-col p-3 bg-gray-50">

      {/* Header */}
      <div className="rounded-xl px-4 py-3 mb-3 text-white flex items-center justify-between" style={{ backgroundColor: '#006B3F' }}>
        <div>
          <h1 className="text-2xl font-bold leading-none">OMPRA</h1>
          <p className="text-white/70 text-xs mt-0.5">Gestionale Magazzino</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-white/60">Giacenze</p>
            <p className="text-lg font-bold leading-none">{inventoryCount}</p>
          </div>
          <div className="w-px h-8 bg-white/30" />
          <div className="text-right">
            <p className="text-xs text-white/60">Vendite</p>
            <p className="text-lg font-bold leading-none">{salesCount}</p>
          </div>
          <div className="w-px h-8 bg-white/30" />
          <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
            {getSyncIcon()}
          </div>
        </div>
      </div>

      {/* Alert commissioni pendenti */}
      {pendingCommissioni > 0 && (
        <button
          onClick={() => onNavigate('archivio-commissioni')}
          className="mb-3 px-3 py-2 bg-yellow-50 border border-yellow-300 rounded-xl flex items-center gap-2"
        >
          <Clock className="w-5 h-5 text-yellow-600 shrink-0" />
          <p className="font-semibold text-yellow-800 text-sm flex-1 text-left">
            {pendingCommissioni} commissione{pendingCommissioni > 1 ? 'i' : ''} in attesa
          </p>
          <span className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold">
            {pendingCommissioni}
          </span>
        </button>
      )}

      {/* Pulsanti principali */}
      <div className="flex-1 flex flex-col gap-2">

        {/* Riga 1: CARICO + VENDITA */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onNavigate('carico')}
            className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl text-white font-semibold shadow-md active:scale-95 transition-transform"
            style={{ backgroundColor: '#006B3F' }}
          >
            <PackagePlus className="w-6 h-6" />
            <div className="text-sm font-bold">CARICO MERCE</div>
            <div className="text-xs opacity-70">Scansione OCR</div>
          </button>

          <button
            onClick={() => onNavigate('vendita')}
            className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl font-semibold shadow-md active:scale-95 transition-transform"
            style={{ backgroundColor: '#FFDD00', color: '#006B3F' }}
          >
            <ShoppingCart className="w-6 h-6" />
            <div className="text-sm font-bold">NUOVA VENDITA</div>
            <div className="text-xs opacity-70">Scarico e commissione</div>
          </button>
        </div>

        {/* ARCHIVIO COMMISSIONI — pulsante principale di cassa */}
        <button
          onClick={() => onNavigate('archivio-commissioni')}
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold shadow-md active:scale-95 transition-transform text-white"
          style={{ backgroundColor: '#004d2e' }}
        >
          <FileText className="w-6 h-6 shrink-0" />
          <div className="flex-1 text-left">
            <div className="text-base font-bold">ARCHIVIO COMMISSIONI</div>
            <div className="text-xs opacity-70">Gestisci ordini in attesa</div>
          </div>
          {pendingCommissioni > 0 && (
            <span className="bg-yellow-400 text-yellow-900 px-2.5 py-1 rounded-full text-sm font-bold shrink-0">
              {pendingCommissioni}
            </span>
          )}
        </button>

        {/* Riga 3: GIACENZE + STORICO */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onNavigate('giacenze')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-gray-700 text-white font-semibold shadow active:scale-95 transition-transform"
          >
            <Package className="w-5 h-5" />
            <div className="text-sm">GIACENZE</div>
            <div className="text-xs opacity-60">Magazzino</div>
          </button>

          <button
            onClick={() => onNavigate('storico')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-gray-600 text-white font-semibold shadow active:scale-95 transition-transform"
          >
            <History className="w-5 h-5" />
            <div className="text-sm">STORICO</div>
            <div className="text-xs opacity-60">Vendite</div>
          </button>
        </div>

        {/* Riga 4: LISTINI + POLITICHE */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onNavigate('listini')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold shadow-sm active:scale-95 transition-transform"
          >
            <ClipboardList className="w-5 h-5 text-gray-500" />
            <div className="text-sm">LISTINI</div>
            <div className="text-xs opacity-60">Prezzi</div>
          </button>

          <button
            onClick={() => onNavigate('politiche-commerciali')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold shadow-sm active:scale-95 transition-transform"
          >
            <BookLock className="w-5 h-5 text-gray-500" />
            <div className="text-sm">POLITICHE</div>
            <div className="text-xs opacity-60">Scontistiche</div>
          </button>
        </div>

      </div>

      {/* Footer */}
      <div className="mt-3 text-center text-xs text-gray-400">
        <p>v1.3.1 - OMPRA Gestionale</p>
      </div>
    </div>
  );
}
