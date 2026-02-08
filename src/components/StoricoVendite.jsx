import { useState, useMemo } from 'react';
import { ArrowLeft, Search, Filter, X, ChevronUp, ChevronDown, Download, FileSpreadsheet, Trash2, AlertTriangle, CheckSquare, Square } from 'lucide-react';
import useStore from '../store';

// Funzione per normalizzare la ricerca (rimuove spazi, trattini, converte in minuscolo)
const normalizeSearch = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[\s\-_\.]/g, '') // Rimuove spazi, trattini, underscore, punti
    .trim();
};

export default function StoricoVendite({ onNavigate }) {
  const sales = useStore((state) => state.sales);
  const brands = useStore((state) => state.brands);
  const deleteSale = useStore((state) => state.deleteSale);
  const deleteMultipleSales = useStore((state) => state.deleteMultipleSales);
  
  const [filters, setFilters] = useState({
    dataFrom: '',
    dataTo: '',
    brand: '',
    modello: '',
    matricola: '',
    cliente: '',
    prezzoFrom: '',
    prezzoTo: '',
    operatore: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Stati per eliminazione
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteMultipleModal, setShowDeleteMultipleModal] = useState(false);

  // Operatori unici
  const operators = useMemo(() => {
    const ops = [...new Set(sales.map(s => s.user).filter(Boolean))];
    return ops.sort();
  }, [sales]);

  // Filtra e ordina vendite
  const filteredSales = useMemo(() => {
    let result = [...sales];
    
    if (filters.dataFrom) {
      const from = new Date(filters.dataFrom);
      result = result.filter(s => new Date(s.timestamp) >= from);
    }
    if (filters.dataTo) {
      const to = new Date(filters.dataTo);
      to.setHours(23, 59, 59);
      result = result.filter(s => new Date(s.timestamp) <= to);
    }
    if (filters.brand) {
      result = result.filter(s => s.brand === filters.brand);
    }
    
    // MODELLO - Ricerca normalizzata (ignora spazi e maiuscole)
    if (filters.modello) {
      const searchTerm = normalizeSearch(filters.modello);
      result = result.filter(s => {
        const modelNorm = normalizeSearch(s.model);
        return modelNorm.includes(searchTerm);
      });
    }
    
    // MATRICOLA - Ricerca normalizzata
    if (filters.matricola) {
      const searchTerm = normalizeSearch(filters.matricola);
      result = result.filter(s => {
        const serialNorm = normalizeSearch(s.serialNumber);
        return serialNorm.includes(searchTerm);
      });
    }
    
    // CLIENTE - Ricerca case-insensitive ma mantiene spazi
    if (filters.cliente) {
      const searchTerm = filters.cliente.toLowerCase().trim();
      result = result.filter(s => 
        s.cliente?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.prezzoFrom) {
      result = result.filter(s => (s.prezzo || 0) >= parseFloat(filters.prezzoFrom));
    }
    if (filters.prezzoTo) {
      result = result.filter(s => (s.prezzo || 0) <= parseFloat(filters.prezzoTo));
    }
    if (filters.operatore) {
      result = result.filter(s => s.user === filters.operatore);
    }
    
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      
      if (sortField === 'timestamp') {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      
      if (sortField === 'totale' || sortField === 'prezzo') {
        valA = parseFloat(valA) || 0;
        valB = parseFloat(valB) || 0;
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
  }, [sales, filters, sortField, sortDirection]);

  // Totale vendite filtrate
  const totaleSales = useMemo(() => {
    return filteredSales.reduce((sum, s) => sum + (s.prezzo || s.totale || 0), 0);
  }, [filteredSales]);

  // Conta filtri attivi
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(v => v !== '').length;
  }, [filters]);

  // Reset filtri
  const resetFilters = () => {
    setFilters({
      dataFrom: '',
      dataTo: '',
      brand: '',
      modello: '',
      matricola: '',
      cliente: '',
      prezzoFrom: '',
      prezzoTo: '',
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
  const handleDeleteClick = (sale) => {
    setDeleteConfirm(sale);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm) {
      await deleteSale(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  // Gestione selezione multipla
  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedItems([]);
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === filteredSales.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredSales.map(s => s.id));
    }
  };

  const handleDeleteMultiple = async () => {
    if (selectedItems.length > 0) {
      await deleteMultipleSales(selectedItems);
      setSelectedItems([]);
      setSelectMode(false);
      setShowDeleteMultipleModal(false);
    }
  };

  // EXPORT CSV
  const exportCSV = () => {
    const headers = ['Data', 'Ora', 'Brand', 'Modello', 'Matricola', 'Cliente', 'Prezzo', 'Operatore'];
    
    const rows = filteredSales.map(sale => {
      const date = new Date(sale.timestamp);
      return [
        date.toLocaleDateString('it-IT'),
        date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
        sale.brand || '',
        sale.model || '',
        sale.serialNumber || '',
        sale.cliente || '',
        (sale.prezzo || 0).toFixed(2),
        sale.user || ''
      ];
    });
    
    // Aggiungi riga totale
    rows.push([]);
    rows.push(['', '', '', '', '', 'TOTALE:', totaleSales.toFixed(2), '']);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(';'))
      .join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `vendite_ompra_${formatDateForFilename()}.csv`);
    setShowExportMenu(false);
  };

  // EXPORT EXCEL (formato semplice compatibile)
  const exportExcel = () => {
    // Creiamo un HTML table che Excel può aprire
    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="UTF-8">
      <style>
        table { border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 8px; }
        th { background-color: #006B3F; color: white; font-weight: bold; }
        .totale { font-weight: bold; background-color: #FFDD00; }
        .prezzo { text-align: right; }
      </style>
      </head>
      <body>
      <h2>OMPRA - Storico Vendite</h2>
      <p>Esportato il: ${new Date().toLocaleString('it-IT')}</p>
      <p>Vendite: ${filteredSales.length} | Totale: € ${totaleSales.toFixed(2)}</p>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Ora</th>
            <th>Brand</th>
            <th>Modello</th>
            <th>Matricola</th>
            <th>Cliente</th>
            <th>Prezzo €</th>
            <th>Operatore</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    filteredSales.forEach(sale => {
      const date = new Date(sale.timestamp);
      html += `
        <tr>
          <td>${date.toLocaleDateString('it-IT')}</td>
          <td>${date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</td>
          <td>${sale.brand || ''}</td>
          <td>${sale.model || ''}</td>
          <td>${sale.serialNumber || ''}</td>
          <td>${sale.cliente || ''}</td>
          <td class="prezzo">${(sale.prezzo || 0).toFixed(2)}</td>
          <td>${sale.user || ''}</td>
        </tr>
      `;
    });
    
    html += `
        <tr class="totale">
          <td colspan="6" style="text-align: right;"><strong>TOTALE</strong></td>
          <td class="prezzo"><strong>€ ${totaleSales.toFixed(2)}</strong></td>
          <td></td>
        </tr>
        </tbody>
      </table>
      </body>
      </html>
    `;
    
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    downloadFile(blob, `vendite_ompra_${formatDateForFilename()}.xls`);
    setShowExportMenu(false);
  };

  // Funzione download
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

  // Formatta data per nome file
  const formatDateForFilename = () => {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-ompra-green text-white p-4 sticky top-0 z-10" style={{ backgroundColor: '#006B3F' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => onNavigate('home')} className="mr-3">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Storico Vendite</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Pulsante Seleziona */}
            <button 
              onClick={toggleSelectMode}
              className={`p-2 rounded-lg ${selectMode ? 'bg-yellow-400 text-green-800' : 'bg-white/20'}`}
            >
              {selectMode ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
            </button>
            
            {/* Pulsante Export */}
            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-2 rounded-lg bg-white/20"
              >
                <Download className="w-5 h-5" />
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl py-2 min-w-[160px] z-20">
                  <button
                    onClick={exportExcel}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                  >
                    <FileSpreadsheet className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">Excel (.xls)</div>
                      <div className="text-xs text-gray-500">Per Microsoft Excel</div>
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
              className="relative p-2 rounded-lg bg-white/20"
            >
              <Filter className="w-5 h-5" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-green-800 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Riepilogo */}
        <div className="mt-3 flex justify-between text-sm">
          <span>{filteredSales.length} vendite</span>
          <span className="font-bold">Totale: € {totaleSales.toFixed(2)}</span>
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
          
          {/* Hint ricerca */}
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            💡 La ricerca ignora spazi e maiuscole: "fs 131 r" = "FS131R"
          </div>
          
          {/* Data */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Da</label>
              <input
                type="date"
                className="input-field text-sm py-2"
                value={filters.dataFrom}
                onChange={(e) => setFilters({...filters, dataFrom: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">A</label>
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
                placeholder="es: fs131r, MSA 140..."
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
          
          {/* Cliente */}
          <div>
            <label className="text-xs text-gray-500">Cliente</label>
            <input
              type="text"
              className="input-field text-sm py-2"
              placeholder="Nome..."
              value={filters.cliente}
              onChange={(e) => setFilters({...filters, cliente: e.target.value})}
            />
          </div>
          
          {/* Prezzo */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Prezzo da €</label>
              <input
                type="number"
                className="input-field text-sm py-2"
                placeholder="Min"
                value={filters.prezzoFrom}
                onChange={(e) => setFilters({...filters, prezzoFrom: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Prezzo a €</label>
              <input
                type="number"
                className="input-field text-sm py-2"
                placeholder="Max"
                value={filters.prezzoTo}
                onChange={(e) => setFilters({...filters, prezzoTo: e.target.value})}
              />
            </div>
          </div>
          
          {/* Operatore */}
          {operators.length > 1 && (
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
      <div className="bg-gray-100 px-4 py-2 flex text-xs font-semibold text-gray-600 sticky top-[108px] z-5 border-b">
        <button 
          className="flex-none w-16 text-left flex items-center gap-1"
          onClick={() => toggleSort('timestamp')}
        >
          Data <SortIcon field="timestamp" />
        </button>
        <button 
          className="flex-1 min-w-0 text-left flex items-center gap-1"
          onClick={() => toggleSort('brand')}
        >
          Prodotto <SortIcon field="brand" />
        </button>
        <button 
          className="flex-1 min-w-0 text-left flex items-center gap-1 pl-2"
          onClick={() => toggleSort('cliente')}
        >
          Cliente <SortIcon field="cliente" />
        </button>
        <button 
          className="flex-none w-16 text-right flex items-center justify-end gap-1"
          onClick={() => toggleSort('totale')}
        >
          € <SortIcon field="totale" />
        </button>
      </div>

      {/* Lista vendite */}
      <div className="flex-1 overflow-auto">
        {filteredSales.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Nessuna vendita trovata</p>
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
            {filteredSales.map((sale) => (
              <div key={sale.id} className={`px-4 py-3 bg-white hover:bg-gray-50 ${selectedItems.includes(sale.id) ? 'bg-green-50' : ''}`}>
                <div className="flex items-start">
                  {/* Checkbox in modalità selezione */}
                  {selectMode && (
                    <button 
                      onClick={() => toggleSelectItem(sale.id)}
                      className="flex-none mr-3 mt-1"
                    >
                      {selectedItems.includes(sale.id) ? (
                        <CheckSquare className="w-5 h-5" style={{ color: '#006B3F' }} />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  )}
                  
                  <div className="flex-none w-16">
                    <div className="text-sm font-medium">
                      {new Date(sale.timestamp).toLocaleDateString('it-IT', { 
                        day: '2-digit', 
                        month: '2-digit' 
                      })}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(sale.timestamp).toLocaleTimeString('it-IT', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="font-semibold text-sm truncate">
                      <span style={{ color: '#006B3F' }}>{sale.brand}</span> {sale.model}
                    </div>
                    <div className="text-xs text-gray-500 font-mono truncate">
                      {sale.serialNumber}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0 text-sm truncate pl-2">
                    {sale.cliente || '-'}
                  </div>
                  
                  <div className="flex-none w-16 text-right">
                    {(sale.prezzo === 0 || sale.prezzo === null || sale.prezzo === undefined) ? (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-medium">KIT</span>
                    ) : (
                      <span className="font-bold" style={{ color: '#006B3F' }}>
                        €{sale.prezzo?.toFixed(0) || '0'}
                      </span>
                    )}
                  </div>
                  
                  {/* Pulsante elimina (solo se non in modalità selezione) */}
                  {!selectMode && (
                    <button
                      onClick={() => handleDeleteClick(sale)}
                      className="flex-none ml-2 text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>Op: {sale.user || 'N/D'}</span>
                  <span>{new Date(sale.timestamp).getFullYear()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Barra azioni selezione multipla */}
      {selectMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <button
              onClick={selectAll}
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: '#006B3F' }}
            >
              {selectedItems.length === filteredSales.length ? (
                <>
                  <CheckSquare className="w-5 h-5" />
                  Deseleziona tutti
                </>
              ) : (
                <>
                  <Square className="w-5 h-5" />
                  Seleziona tutti ({filteredSales.length})
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

      {/* Modal Conferma Eliminazione Singola */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold">Eliminare questa vendita?</h3>
              <p className="text-gray-600 mt-2">
                {deleteConfirm.brand} {deleteConfirm.model}
              </p>
              <p className="text-sm font-mono text-gray-500">
                {deleteConfirm.serialNumber}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Cliente: {deleteConfirm.cliente || 'N/D'}
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

      {/* Modal Conferma Eliminazione Multipla */}
      {showDeleteMultipleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-red-600">⚠️ ATTENZIONE</h3>
              <p className="text-gray-600 mt-2">
                Stai per eliminare <strong>{selectedItems.length}</strong> vendite.
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
    </div>
  );
}
