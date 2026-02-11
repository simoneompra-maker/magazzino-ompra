import { useState, useMemo } from 'react';
import { ArrowLeft, Search, Package, CheckCircle, XCircle, Trash2, AlertTriangle, Download, FileSpreadsheet, Filter, X, ChevronUp, ChevronDown, CheckSquare, Square } from 'lucide-react';
import useStore from '../store';

export default function Giacenze({ onNavigate }) {
  const inventory = useStore((state) => state.inventory);
  const brands = useStore((state) => state.brands);
  const deleteItem = useStore((state) => state.deleteItem);
  const clearInventory = useStore((state) => state.clearInventory);
  const deleteMultipleItems = useStore((state) => state.deleteMultipleItems);
  const markAsSold = useStore((state) => state.markAsSold);
  
  // Filtri
  const [filters, setFilters] = useState({
    dataFrom: '',
    dataTo: '',
    brand: '',
    modello: '',
    matricola: '',
    stato: 'all',
    operatore: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearConfirmText, setClearConfirmText] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Stati per selezione multipla
  const [selectMode, setSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteMultipleModal, setShowDeleteMultipleModal] = useState(false);

  // Stato per segna come venduta
  const [markSoldItem, setMarkSoldItem] = useState(null);
  const [markingSold, setMarkingSold] = useState(false);

  // Operatori unici
  const operators = useMemo(() => {
    const ops = [...new Set(inventory.map(i => i.user).filter(Boolean))];
    return ops.sort();
  }, [inventory]);

  // Filtra e ordina
  const filteredInventory = useMemo(() => {
    let result = [...inventory];
    
    if (filters.dataFrom) {
      const from = new Date(filters.dataFrom);
      result = result.filter(i => new Date(i.timestamp) >= from);
    }
    if (filters.dataTo) {
      const to = new Date(filters.dataTo);
      to.setHours(23, 59, 59);
      result = result.filter(i => new Date(i.timestamp) <= to);
    }
    if (filters.brand) {
      result = result.filter(i => i.brand === filters.brand);
    }
    if (filters.modello) {
      result = result.filter(i => 
        i.model?.toLowerCase().includes(filters.modello.toLowerCase())
      );
    }
    if (filters.matricola) {
      result = result.filter(i => 
        i.serialNumber?.toLowerCase().includes(filters.matricola.toLowerCase())
      );
    }
    if (filters.stato !== 'all') {
      result = result.filter(i => i.status === filters.stato);
    }
    if (filters.operatore) {
      result = result.filter(i => i.user === filters.operatore);
    }
    
    // Ordina
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      
      if (sortField === 'timestamp') {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      
      if (typeof valA === 'string') {
        valA = valA?.toLowerCase() || '';
        valB = valB?.toLowerCase() || '';
      }
      
      if (sortDirection === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
    
    return result;
  }, [inventory, filters, sortField, sortDirection]);

  // Statistiche
  const stats = useMemo(() => ({
    total: filteredInventory.length,
    available: filteredInventory.filter(i => i.status === 'available').length,
    sold: filteredInventory.filter(i => i.status === 'sold').length
  }), [filteredInventory]);

  // Conta filtri attivi
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.dataFrom) count++;
    if (filters.dataTo) count++;
    if (filters.brand) count++;
    if (filters.modello) count++;
    if (filters.matricola) count++;
    if (filters.stato !== 'all') count++;
    if (filters.operatore) count++;
    return count;
  }, [filters]);

  // Reset filtri
  const resetFilters = () => {
    setFilters({
      dataFrom: '',
      dataTo: '',
      brand: '',
      modello: '',
      matricola: '',
      stato: 'all',
      operatore: ''
    });
  };

  // Toggle ordinamento
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Icona ordinamento
  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 inline" />
      : <ChevronDown className="w-4 h-4 inline" />;
  };

  // Gestione eliminazione singola
  const handleDeleteClick = (item) => {
    setDeleteConfirm(item);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm) {
      await deleteItem(deleteConfirm.serialNumber);
      setDeleteConfirm(null);
    }
  };

  // Gestione azzeramento
  const handleClearConfirm = async () => {
    if (clearConfirmText === 'AZZERA') {
      await clearInventory();
      setShowClearModal(false);
      setClearConfirmText('');
    }
  };

  // Gestione selezione multipla
  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedItems([]);
  };

  const toggleSelectItem = (serialNumber) => {
    setSelectedItems(prev => 
      prev.includes(serialNumber) 
        ? prev.filter(s => s !== serialNumber)
        : [...prev, serialNumber]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === filteredInventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredInventory.map(i => i.serialNumber));
    }
  };

  const handleDeleteMultiple = async () => {
    if (selectedItems.length > 0) {
      await deleteMultipleItems(selectedItems);
      setSelectedItems([]);
      setSelectMode(false);
      setShowDeleteMultipleModal(false);
    }
  };

  // Segna come venduta (elimina record CARICO)
  const handleMarkSold = async () => {
    if (!markSoldItem) return;
    setMarkingSold(true);
    try {
      const result = await markAsSold(markSoldItem.serialNumber);
      if (result.success) {
        setMarkSoldItem(null);
      } else {
        alert('Errore: ' + (result.error || 'impossibile aggiornare'));
      }
    } catch (e) {
      alert('Errore: ' + e.message);
    } finally {
      setMarkingSold(false);
    }
  };

  // EXPORT CSV
  const exportCSV = () => {
    const headers = ['Data Carico', 'Brand', 'Modello', 'Matricola', 'Stato', 'Operatore'];
    
    const rows = filteredInventory.map(item => {
      const date = new Date(item.dateAdded || item.timestamp);
      return [
        date.toLocaleDateString('it-IT'),
        item.brand || '',
        item.model || '',
        item.serialNumber || '',
        item.status === 'available' ? 'Disponibile' : 'Venduta',
        item.user || ''
      ];
    });
    
    rows.push([]);
    rows.push(['TOTALE:', filteredInventory.length + ' articoli', '', '', '', '']);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(';'))
      .join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `giacenze_ompra_${formatDateForFilename()}.csv`);
    setShowExportMenu(false);
  };

  // EXPORT EXCEL
  const exportExcel = () => {
    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="UTF-8">
      <style>
        table { border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 8px; }
        th { background-color: #006B3F; color: white; font-weight: bold; }
        .totale { font-weight: bold; background-color: #FFDD00; }
        .disponibile { color: #006B3F; font-weight: bold; }
        .venduta { color: #666; }
      </style>
      </head>
      <body>
      <h2>OMPRA - Giacenze Magazzino</h2>
      <p>Esportato il: ${new Date().toLocaleString('it-IT')}</p>
      <p>Totale: ${filteredInventory.length} articoli | Disponibili: ${stats.available} | Vendute: ${stats.sold}</p>
      <table>
        <thead>
          <tr>
            <th>Data Carico</th>
            <th>Brand</th>
            <th>Modello</th>
            <th>Matricola</th>
            <th>Stato</th>
            <th>Operatore</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    filteredInventory.forEach(item => {
      const date = new Date(item.dateAdded || item.timestamp);
      const statusClass = item.status === 'available' ? 'disponibile' : 'venduta';
      html += `
        <tr>
          <td>${date.toLocaleDateString('it-IT')}</td>
          <td>${item.brand || ''}</td>
          <td>${item.model || ''}</td>
          <td>${item.serialNumber || ''}</td>
          <td class="${statusClass}">${item.status === 'available' ? 'Disponibile' : 'Venduta'}</td>
          <td>${item.user || ''}</td>
        </tr>
      `;
    });
    
    html += `
        <tr class="totale">
          <td><strong>TOTALE</strong></td>
          <td colspan="5"><strong>${filteredInventory.length} articoli</strong></td>
        </tr>
        </tbody>
      </table>
      </body>
      </html>
    `;
    
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    downloadFile(blob, `giacenze_ompra_${formatDateForFilename()}.xls`);
    setShowExportMenu(false);
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDateForFilename = () => {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white border-b sticky top-0 z-10" style={{ backgroundColor: '#006B3F' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-white">
            <button onClick={() => onNavigate('home')} className="mr-3">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Giacenze</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Pulsante Seleziona */}
            <button 
              onClick={toggleSelectMode}
              className={`p-2 rounded-lg ${selectMode ? 'bg-yellow-400 text-green-800' : 'bg-white/20 text-white'}`}
            >
              {selectMode ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
            </button>
            
            {/* Pulsante Export */}
            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-2 rounded-lg bg-white/20 text-white"
              >
                <Download className="w-5 h-5" />
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl py-2 min-w-[160px] z-20 border">
                  <button
                    onClick={exportExcel}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                  >
                    <FileSpreadsheet className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">Excel (.xls)</div>
                      <div className="text-xs text-gray-500">Per Excel</div>
                    </div>
                  </button>
                  <button
                    onClick={exportCSV}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                  >
                    <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">CSV</div>
                      <div className="text-xs text-gray-500">Universale</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
            
            {/* Pulsante Filtri */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="relative p-2 rounded-lg bg-white/20 text-white"
            >
              <Filter className="w-5 h-5" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-green-800 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            
            {/* Pulsante Azzera */}
            {inventory.length > 0 && (
              <button
                onClick={() => setShowClearModal(true)}
                className="p-2 rounded-lg bg-red-500/80 text-white"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        {/* Riepilogo */}
        <div className="mt-3 flex justify-between text-sm text-white/90">
          <span>{stats.total} articoli ({stats.available} disp.)</span>
        </div>
      </div>

      {/* Click fuori per chiudere menu export */}
      {showExportMenu && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowExportMenu(false)}
        />
      )}

      {/* Pannello Filtri */}
      {showFilters && (
        <div className="bg-white border-b shadow-lg p-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold" style={{ color: '#006B3F' }}>Filtri</h3>
            {activeFiltersCount > 0 && (
              <button 
                onClick={resetFilters}
                className="text-sm text-red-500 flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Azzera
              </button>
            )}
          </div>
          
          {/* Data */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Data da</label>
              <input
                type="date"
                className="input-field text-sm py-2"
                value={filters.dataFrom}
                onChange={(e) => setFilters({...filters, dataFrom: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Data a</label>
              <input
                type="date"
                className="input-field text-sm py-2"
                value={filters.dataTo}
                onChange={(e) => setFilters({...filters, dataTo: e.target.value})}
              />
            </div>
          </div>
          
          {/* Brand */}
          <div>
            <label className="text-xs text-gray-500">Brand</label>
            <select
              className="input-field text-sm py-2"
              value={filters.brand}
              onChange={(e) => setFilters({...filters, brand: e.target.value})}
            >
              <option value="">Tutti</option>
              {brands.filter(b => b !== 'Altro').map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          
          {/* Modello e Matricola */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Modello</label>
              <input
                type="text"
                className="input-field text-sm py-2"
                placeholder="Cerca..."
                value={filters.modello}
                onChange={(e) => setFilters({...filters, modello: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Matricola</label>
              <input
                type="text"
                className="input-field text-sm py-2"
                placeholder="Cerca..."
                value={filters.matricola}
                onChange={(e) => setFilters({...filters, matricola: e.target.value})}
              />
            </div>
          </div>
          
          {/* Stato */}
          <div>
            <label className="text-xs text-gray-500">Stato</label>
            <select
              className="input-field text-sm py-2"
              value={filters.stato}
              onChange={(e) => setFilters({...filters, stato: e.target.value})}
            >
              <option value="all">Tutti</option>
              <option value="available">Disponibili</option>
              <option value="sold">Vendute</option>
            </select>
          </div>
          
          {/* Operatore */}
          {operators.length > 0 && (
            <div>
              <label className="text-xs text-gray-500">Operatore</label>
              <select
                className="input-field text-sm py-2"
                value={filters.operatore}
                onChange={(e) => setFilters({...filters, operatore: e.target.value})}
              >
                <option value="">Tutti</option>
                {operators.map(op => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Intestazioni colonne */}
      <div className="bg-gray-100 px-4 py-2 flex text-xs font-semibold text-gray-600 sticky top-[100px] z-5 border-b">
        <button 
          className="flex-none w-16 text-left flex items-center gap-1"
          onClick={() => toggleSort('timestamp')}
        >
          Data <SortIcon field="timestamp" />
        </button>
        <button 
          className="flex-1 text-left flex items-center gap-1"
          onClick={() => toggleSort('brand')}
        >
          Prodotto <SortIcon field="brand" />
        </button>
        <button 
          className="flex-none w-20 text-right flex items-center justify-end gap-1"
          onClick={() => toggleSort('status')}
        >
          Stato <SortIcon field="status" />
        </button>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-auto">
        {filteredInventory.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Nessun articolo trovato</p>
            {activeFiltersCount > 0 && (
              <button 
                onClick={resetFilters}
                className="mt-2 text-sm"
                style={{ color: '#006B3F' }}
              >
                Rimuovi filtri
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {filteredInventory.map((item) => (
              <div key={item.id} className={`px-4 py-3 bg-white hover:bg-gray-50 ${selectedItems.includes(item.serialNumber) ? 'bg-green-50' : ''}`}>
                <div className="flex items-start">
                  {/* Checkbox in modalità selezione */}
                  {selectMode && (
                    <button 
                      onClick={() => toggleSelectItem(item.serialNumber)}
                      className="flex-none mr-3 mt-1"
                    >
                      {selectedItems.includes(item.serialNumber) ? (
                        <CheckSquare className="w-5 h-5" style={{ color: '#006B3F' }} />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  )}
                  
                  {/* Data */}
                  <div className="flex-none w-16">
                    <div className="text-sm font-medium">
                      {new Date(item.timestamp).toLocaleDateString('it-IT', { 
                        day: '2-digit', 
                        month: '2-digit' 
                      })}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(item.timestamp).getFullYear()}
                    </div>
                  </div>
                  
                  {/* Prodotto */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">
                      <span style={{ color: '#006B3F' }}>{item.brand}</span> {item.model}
                    </div>
                    <div className="text-xs text-gray-500 font-mono truncate">
                      {item.serialNumber}
                    </div>
                  </div>
                  
                  {/* Stato e Azioni */}
                  <div className="flex-none flex items-center gap-1">
                    {item.status === 'available' ? (
                      <CheckCircle className="w-5 h-5" style={{ color: '#006B3F' }} />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                    {!selectMode && (
                      <>
                        {item.status === 'available' && (
                          <button
                            onClick={() => setMarkSoldItem(item)}
                            className="text-orange-400 hover:text-orange-600 p-1"
                            title="Segna come venduta"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="text-red-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Riga extra info */}
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>Op: {item.user || 'N/D'}</span>
                  <span 
                    className="font-medium"
                    style={item.status === 'available' ? { color: '#006B3F' } : {}}
                  >
                    {item.status === 'available' ? 'Disponibile' : 'Venduta'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Conferma Eliminazione Singola */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold">Eliminare questo articolo?</h3>
              <p className="text-gray-600 mt-2">
                {deleteConfirm.brand} {deleteConfirm.model}
              </p>
              <p className="text-sm font-mono text-gray-500">
                {deleteConfirm.serialNumber}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 bg-gray-200 rounded-lg font-semibold"
              >
                Annulla
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 bg-red-500 text-white rounded-lg font-semibold"
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Azzera Magazzino */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-red-600">⚠️ ATTENZIONE</h3>
              <p className="text-gray-600 mt-2">
                Stai per eliminare <strong>TUTTI</strong> i {inventory.length} articoli.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Azione irreversibile!
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">
                Scrivi <strong>AZZERA</strong> per confermare:
              </label>
              <input
                type="text"
                value={clearConfirmText}
                onChange={(e) => setClearConfirmText(e.target.value.toUpperCase())}
                className="w-full p-3 border rounded-lg text-center font-bold text-lg"
                placeholder="AZZERA"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowClearModal(false);
                  setClearConfirmText('');
                }}
                className="flex-1 py-3 bg-gray-200 rounded-lg font-semibold"
              >
                Annulla
              </button>
              <button
                onClick={handleClearConfirm}
                disabled={clearConfirmText !== 'AZZERA'}
                className={`flex-1 py-3 rounded-lg font-semibold ${
                  clearConfirmText === 'AZZERA'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Conferma
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra azioni selezione multipla */}
      {selectMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <button
              onClick={selectAll}
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: '#006B3F' }}
            >
              {selectedItems.length === filteredInventory.length ? (
                <>
                  <CheckSquare className="w-5 h-5" />
                  Deseleziona tutti
                </>
              ) : (
                <>
                  <Square className="w-5 h-5" />
                  Seleziona tutti ({filteredInventory.length})
                </>
              )}
            </button>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {selectedItems.length} selezionati
              </span>
              <button
                onClick={() => setShowDeleteMultipleModal(true)}
                disabled={selectedItems.length === 0}
                className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                  selectedItems.length > 0 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Conferma Eliminazione Multipla */}
      {showDeleteMultipleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-red-600">⚠️ ATTENZIONE</h3>
              <p className="text-gray-600 mt-2">
                Stai per eliminare <strong>{selectedItems.length}</strong> articoli.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Questa azione è irreversibile!
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteMultipleModal(false)}
                className="flex-1 py-3 bg-gray-200 rounded-lg font-semibold"
              >
                Annulla
              </button>
              <button
                onClick={handleDeleteMultiple}
                className="flex-1 py-3 bg-red-500 text-white rounded-lg font-semibold"
              >
                Elimina {selectedItems.length}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Segna come venduta */}
      {markSoldItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-1">📦 Rimuovi da giacenze</h3>
            <p className="text-sm text-gray-600 mb-1">
              <span style={{ color: '#006B3F' }} className="font-bold">{markSoldItem.brand}</span> {markSoldItem.model}
            </p>
            <p className="text-xs text-gray-400 font-mono mb-4">{markSoldItem.serialNumber}</p>
            
            <p className="text-sm text-gray-500 mb-4">
              Il record di carico verrà eliminato. La vendita (se già registrata nello storico) non viene toccata.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setMarkSoldItem(null)}
                className="flex-1 py-3 bg-gray-200 rounded-lg font-semibold"
              >
                Annulla
              </button>
              <button
                onClick={handleMarkSold}
                disabled={markingSold}
                className="flex-1 py-3 text-white rounded-lg font-semibold bg-orange-500"
              >
                {markingSold ? '⏳...' : '✓ Rimuovi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
