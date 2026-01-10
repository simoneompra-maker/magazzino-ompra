import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Camera, Search, Plus, Trash2, Package, Clock, Gift, MapPin, User, X, ChevronRight, ChevronDown, UserCircle, Edit2, CreditCard, FileText, Phone } from 'lucide-react';
import useStore from '../store';
import CommissioneModal from './CommissioneModal';
import { scanMatricola } from '../services/ocrService';
import { loadClienti, searchClienti, formatIndirizzo, salvaTelefono } from '../services/clientiService';

// Gestione operatori in localStorage
const OPERATORI_KEY = 'ompra_operatori';
const ULTIMO_OPERATORE_KEY = 'ompra_ultimo_operatore';

function getOperatori() {
  try {
    const stored = localStorage.getItem(OPERATORI_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

function saveOperatori(operatori) {
  try {
    localStorage.setItem(OPERATORI_KEY, JSON.stringify(operatori));
  } catch (e) {}
}

function getUltimoOperatore() {
  try {
    return localStorage.getItem(ULTIMO_OPERATORE_KEY) || '';
  } catch (e) {
    return '';
  }
}

function saveUltimoOperatore(nome) {
  try {
    localStorage.setItem(ULTIMO_OPERATORE_KEY, nome);
  } catch (e) {}
}

function addOperatore(nome) {
  if (!nome.trim()) return;
  const operatori = getOperatori();
  const nomeNorm = nome.trim();
  if (!operatori.includes(nomeNorm)) {
    operatori.push(nomeNorm);
    saveOperatori(operatori);
  }
  saveUltimoOperatore(nomeNorm);
}

export default function Vendita({ onNavigate }) {
  const inventory = useStore((state) => state.inventory);
  const findBySerialNumber = useStore((state) => state.findBySerialNumber);
  const sellProduct = useStore((state) => state.sellProduct);
  const createCommissione = useStore((state) => state.createCommissione);
  const brands = useStore((state) => state.brands);

  // Stato principale
  const [cliente, setCliente] = useState('');
  const [clienteSelezionato, setClienteSelezionato] = useState(null);
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [prodotti, setProdotti] = useState([]);
  const [accessori, setAccessori] = useState([]);
  const [newAccessorio, setNewAccessorio] = useState({ nome: '', prezzo: '', quantita: '1' });
  const [totaleManuale, setTotaleManuale] = useState('');
  
  // Caparra e Note
  const [caparra, setCaparra] = useState('');
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [note, setNote] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('scontrino'); // 'scontrino' | 'fattura'
  
  // Modifica accessorio
  const [editingAccessorio, setEditingAccessorio] = useState(null);
  const [editAccessorioData, setEditAccessorioData] = useState({ nome: '', prezzo: '', quantita: '1' });
  
  // Modifica prezzo prodotto (MODAL invece di prompt)
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProductPrice, setEditProductPrice] = useState('');
  
  // Operatore
  const [operatore, setOperatore] = useState('');
  const [operatoriList, setOperatoriList] = useState([]);
  const [showOperatoriDropdown, setShowOperatoriDropdown] = useState(false);
  
  // Autocompletamento clienti
  const [tuttiClienti, setTuttiClienti] = useState([]);
  const [suggerimenti, setSuggerimenti] = useState([]);
  const [showSuggerimenti, setShowSuggerimenti] = useState(false);
  
  // Modal aggiungi prodotto
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [addMode, setAddMode] = useState('magazzino');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productPrice, setProductPrice] = useState('');
  const [showOmaggioOption, setShowOmaggioOption] = useState(false);
  const [isOmaggio, setIsOmaggio] = useState(false);
  
  // Per ordine
  const [orderBrand, setOrderBrand] = useState('');
  const [orderModel, setOrderModel] = useState('');
  
  // OCR
  const [scanning, setScanning] = useState(false);
  const [ocrError, setOcrError] = useState(null);
  
  // Commissione
  const [showCommissione, setShowCommissione] = useState(false);
  const [commissioneData, setCommissioneData] = useState(null);

  // Carica operatori e ultimo operatore
  useEffect(() => {
    setOperatoriList(getOperatori());
    setOperatore(getUltimoOperatore());
  }, []);

  useEffect(() => {
    loadClienti().then(setTuttiClienti);
  }, []);

  useEffect(() => {
    if (cliente.length >= 2 && !clienteSelezionato) {
      const risultati = searchClienti(cliente, tuttiClienti);
      setSuggerimenti(risultati);
      setShowSuggerimenti(risultati.length > 0);
    } else {
      setSuggerimenti([]);
      setShowSuggerimenti(false);
    }
  }, [cliente, tuttiClienti, clienteSelezionato]);

  // Filtra prodotti
  const filteredInventory = useMemo(() => {
    if (!searchQuery.trim()) return inventory;
    const query = searchQuery.toLowerCase();
    return inventory.filter(item => 
      item.brand?.toLowerCase().includes(query) ||
      item.model?.toLowerCase().includes(query) ||
      item.serialNumber?.toLowerCase().includes(query)
    );
  }, [inventory, searchQuery]);

  const handleSelectCliente = (c) => {
    setCliente(c.nome);
    setClienteSelezionato(c);
    setTelefonoCliente(c.telefono || '');
    setShowSuggerimenti(false);
  };

  const handleClienteChange = (value) => {
    setCliente(value);
    if (clienteSelezionato && value !== clienteSelezionato.nome) {
      setClienteSelezionato(null);
      setTelefonoCliente('');
    }
  };

  // Gestione telefono
  const handleTelefonoChange = (value) => {
    setTelefonoCliente(value);
    // Salva in localStorage se cliente selezionato
    if (clienteSelezionato && value.trim()) {
      salvaTelefono(clienteSelezionato.id, value.trim());
    }
  };

  // Gestione operatore
  const handleSelectOperatore = (nome) => {
    setOperatore(nome);
    setShowOperatoriDropdown(false);
    saveUltimoOperatore(nome);
  };

  const handleOperatoreChange = (value) => {
    setOperatore(value);
    setShowOperatoriDropdown(false);
  };

  // Calcola totale
  const calcolaTotaleAuto = () => {
    const totProdotti = prodotti.reduce((sum, p) => sum + (p.prezzo || 0), 0);
    const totAccessori = accessori.reduce((sum, a) => sum + ((parseFloat(a.prezzo) || 0) * (a.quantita || 1)), 0);
    return totProdotti + totAccessori;
  };

  useEffect(() => {
    const auto = calcolaTotaleAuto();
    if (auto > 0) {
      setTotaleManuale(auto.toFixed(2));
    }
  }, [prodotti, accessori]);

  const getTotaleFinale = () => {
    const manuale = parseFloat(totaleManuale);
    return !isNaN(manuale) && manuale >= 0 ? manuale : calcolaTotaleAuto();
  };

  // Calcola da saldare
  const getDaSaldare = () => {
    const totale = getTotaleFinale();
    const cap = parseFloat(caparra) || 0;
    return totale - cap;
  };

  // OCR
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    event.target.value = '';

    setScanning(true);
    setOcrError(null);

    try {
      const result = await scanMatricola(file);
      
      if (result.success && result.matricola) {
        const found = findBySerialNumber(result.matricola);
        if (found) {
          setSelectedProduct(found);
          setSearchQuery(result.matricola);
        } else {
          setSearchQuery(result.matricola);
          setOcrError('Matricola ' + result.matricola + ' non in magazzino');
        }
      } else {
        setOcrError(result.error || 'Non riesco a leggere. Cerca manualmente.');
      }
    } catch (error) {
      if (error.message?.includes('429') || error.message?.includes('limit')) {
        setOcrError('⏳ Troppe scansioni. Attendi 30 sec o cerca manualmente.');
      } else {
        setOcrError('Errore. Cerca manualmente.');
      }
    } finally {
      setScanning(false);
    }
  };

  const handleSelectProduct = (product) => {
    if (prodotti.find(p => p.serialNumber === product.serialNumber)) {
      alert('Prodotto già aggiunto!');
      return;
    }
    setSelectedProduct(product);
    setProductPrice('');
    setIsOmaggio(false);
    setShowOmaggioOption(false);
  };

  const handleConfirmProduct = () => {
    if (!selectedProduct) {
      alert('Seleziona un prodotto!');
      return;
    }

    const prezzo = isOmaggio ? 0 : (parseFloat(productPrice) || null);

    setProdotti([...prodotti, {
      id: Date.now(),
      brand: selectedProduct.brand,
      model: selectedProduct.model,
      serialNumber: selectedProduct.serialNumber,
      prezzo: prezzo,
      isOmaggio: isOmaggio
    }]);
    
    setSelectedProduct(null);
    setSearchQuery('');
    setProductPrice('');
    setIsOmaggio(false);
    setShowOmaggioOption(false);
  };

  const handleCloseModal = () => {
    resetAddForm();
  };

  const handleAddOrderProduct = () => {
    if (!orderBrand) {
      alert('Seleziona un brand!');
      return;
    }
    if (!orderModel.trim()) {
      alert('Inserisci il modello!');
      return;
    }

    const prezzo = isOmaggio ? 0 : (parseFloat(productPrice) || null);

    setProdotti([...prodotti, {
      id: Date.now(),
      brand: orderBrand,
      model: orderModel.trim(),
      serialNumber: null,
      prezzo: prezzo,
      isOmaggio: isOmaggio,
      isOrdered: true
    }]);
    
    setOrderBrand('');
    setOrderModel('');
    setProductPrice('');
    setIsOmaggio(false);
    setShowOmaggioOption(false);
  };

  const resetAddForm = () => {
    setShowAddProduct(false);
    setSearchQuery('');
    setSelectedProduct(null);
    setProductPrice('');
    setIsOmaggio(false);
    setShowOmaggioOption(false);
    setOrderBrand('');
    setOrderModel('');
    setOcrError(null);
    setAddMode('magazzino');
  };

  const handleRemoveProduct = (id) => {
    setProdotti(prodotti.filter(p => p.id !== id));
  };
  
  // Apri modal modifica prezzo prodotto
  const handleOpenEditPrice = (prod) => {
    setEditingProduct(prod);
    setEditProductPrice(prod.prezzo !== null ? prod.prezzo.toString() : '');
  };
  
  // Salva prezzo prodotto
  const handleSaveProductPrice = () => {
    if (!editingProduct) return;
    
    const prezzo = editProductPrice.trim() === '' ? null : parseFloat(editProductPrice);
    
    setProdotti(prodotti.map(p => 
      p.id === editingProduct.id ? { ...p, prezzo: prezzo, isOmaggio: false } : p
    ));
    
    setEditingProduct(null);
    setEditProductPrice('');
  };

  const handleAddAccessorio = () => {
    if (!newAccessorio.nome) {
      alert('Inserisci la descrizione!');
      return;
    }
    setAccessori([...accessori, { 
      ...newAccessorio, 
      id: Date.now(),
      prezzo: parseFloat(newAccessorio.prezzo) || 0,
      quantita: parseInt(newAccessorio.quantita) || 1
    }]);
    setNewAccessorio({ nome: '', prezzo: '', quantita: '1' });
  };

  const handleRemoveAccessorio = (id) => {
    setAccessori(accessori.filter(a => a.id !== id));
  };
  
  // Apri modifica accessorio
  const handleEditAccessorio = (acc) => {
    setEditingAccessorio(acc.id);
    setEditAccessorioData({ nome: acc.nome, prezzo: acc.prezzo.toString(), quantita: (acc.quantita || 1).toString() });
  };
  
  // Salva modifica accessorio
  const handleSaveAccessorio = () => {
    if (!editAccessorioData.nome.trim()) {
      alert('Inserisci la descrizione!');
      return;
    }
    
    setAccessori(accessori.map(a => 
      a.id === editingAccessorio 
        ? { ...a, nome: editAccessorioData.nome.trim(), prezzo: parseFloat(editAccessorioData.prezzo) || 0, quantita: parseInt(editAccessorioData.quantita) || 1 }
        : a
    ));
    
    setEditingAccessorio(null);
    setEditAccessorioData({ nome: '', prezzo: '', quantita: '1' });
  };

  const hasOrderedProducts = prodotti.some(p => !p.serialNumber);

  const handleConcludi = async () => {
    if (!cliente.trim()) {
      alert('Inserisci il nome del cliente!');
      return;
    }
    if (!operatore.trim()) {
      alert('Inserisci il nome dell\'operatore!');
      return;
    }
    if (prodotti.length === 0 && accessori.length === 0 && !note.trim()) {
      alert('Aggiungi almeno un prodotto, un accessorio o una nota!');
      return;
    }
    
    const totale = getTotaleFinale();
    if (totale <= 0 && !prodotti.every(p => p.isOmaggio)) {
      alert('Inserisci il totale della vendita!');
      return;
    }

    // Valida caparra se inserita
    const caparraValue = parseFloat(caparra) || 0;
    if (caparraValue > 0 && !metodoPagamento) {
      alert('Seleziona il metodo di pagamento della caparra!');
      return;
    }

    // Salva operatore nella lista
    addOperatore(operatore);
    setOperatoriList(getOperatori());

    const nomeCliente = cliente.trim();
    const nomeOperatore = operatore.trim();

    // Mostra anteprima commissione
    setCommissioneData({
      cliente: nomeCliente,
      clienteInfo: clienteSelezionato,
      telefono: telefonoCliente.trim() || null,
      operatore: nomeOperatore,
      prodotti: prodotti.map(p => ({
        id: p.id,
        brand: p.brand,
        model: p.model,
        serialNumber: p.serialNumber || null,
        prezzo: p.prezzo,
        isOmaggio: p.isOmaggio,
        isOrdered: p.isOrdered
      })),
      accessori: accessori,
      totale: totale,
      caparra: caparraValue > 0 ? caparraValue : null,
      metodoPagamento: caparraValue > 0 ? metodoPagamento : null,
      note: note.trim() || null,
      tipoDocumento: tipoDocumento,
      isPending: hasOrderedProducts
    });
    setShowCommissione(true);
  };
  
  // Torna indietro dalla commissione per modificare
  const handleBackFromCommissione = () => {
    setShowCommissione(false);
    setCommissioneData(null);
  };
  
  // Conferma definitiva commissione
  const handleConfirmCommissione = async () => {
    const nomeCliente = cliente.trim();
    const nomeOperatore = operatore.trim();
    const totale = getTotaleFinale();
    const caparraValue = parseFloat(caparra) || 0;
    
    if (hasOrderedProducts) {
      const commissione = createCommissione({
        cliente: nomeCliente,
        clienteInfo: clienteSelezionato,
        telefono: telefonoCliente.trim() || null,
        operatore: nomeOperatore,
        prodotti: prodotti.map(p => ({
          brand: p.brand,
          model: p.model,
          serialNumber: p.serialNumber || null,
          prezzo: p.prezzo,
          isOmaggio: p.isOmaggio
        })),
        accessori: accessori,
        totale: totale,
        caparra: caparraValue > 0 ? caparraValue : null,
        metodoPagamento: caparraValue > 0 ? metodoPagamento : null,
        note: note.trim() || null,
        tipoDocumento: tipoDocumento
      });
      
      setCommissioneData({ ...commissione, isPending: true, confirmed: true });
      return;
    }

    let allSuccess = true;
    for (const prod of prodotti) {
      const result = await sellProduct(prod.serialNumber, {
        cliente: nomeCliente,
        operatore: nomeOperatore,
        prezzo: prod.prezzo || 0,
        totale: totale
      });
      if (!result.success) allSuccess = false;
    }
    
    if (allSuccess) {
      const commissione = createCommissione({
        cliente: nomeCliente,
        clienteInfo: clienteSelezionato,
        telefono: telefonoCliente.trim() || null,
        operatore: nomeOperatore,
        prodotti: prodotti.map(p => ({
          brand: p.brand,
          model: p.model,
          serialNumber: p.serialNumber,
          prezzo: p.prezzo,
          isOmaggio: p.isOmaggio
        })),
        accessori: accessori,
        totale: totale,
        caparra: caparraValue > 0 ? caparraValue : null,
        metodoPagamento: caparraValue > 0 ? metodoPagamento : null,
        note: note.trim() || null,
        tipoDocumento: tipoDocumento
      });

      setCommissioneData({ ...commissione, confirmed: true });
    }
  };

  const handleReset = () => {
    setCliente('');
    setClienteSelezionato(null);
    setTelefonoCliente('');
    setProdotti([]);
    setAccessori([]);
    setTotaleManuale('');
    setCaparra('');
    setMetodoPagamento('');
    setNote('');
    setShowCommissione(false);
    setCommissioneData(null);
  };

  if (showCommissione && commissioneData) {
    return (
      <CommissioneModal
        data={commissioneData}
        isKit={true}
        onBack={handleBackFromCommissione}
        onConfirm={handleConfirmCommissione}
        onClose={() => {
          handleReset();
          onNavigate('home');
        }}
      />
    );
  }

  // Formatta prezzo per visualizzazione
  const formatPrezzo = (prod) => {
    if (prod.isOmaggio) {
      return <span className="text-xs text-green-600 font-medium">OMAGGIO</span>;
    }
    if (prod.prezzo === null || prod.prezzo === undefined) {
      return <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-medium">KIT</span>;
    }
    if (prod.prezzo === 0) {
      return <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-medium">KIT</span>;
    }
    return <span className="font-bold text-sm" style={{ color: '#006B3F' }}>€{prod.prezzo}</span>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center p-4 bg-white border-b">
        <button onClick={() => onNavigate('home')} className="mr-3">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Nuova Vendita</h1>
      </div>

      <input
        type="file"
        id="vendita-ocr-input"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <div className="flex-1 p-4 overflow-auto space-y-3">
        {/* Operatore */}
        <div className="bg-white rounded-lg p-3 relative">
          <label className="text-xs text-gray-500 flex items-center gap-1">
            <UserCircle className="w-3 h-3" /> Operatore
          </label>
          <div className="relative mt-1">
            <input
              type="text"
              placeholder="Nome operatore..."
              className="w-full p-2 pr-10 border rounded-lg"
              value={operatore}
              onChange={(e) => handleOperatoreChange(e.target.value)}
              onFocus={() => operatoriList.length > 0 && setShowOperatoriDropdown(true)}
            />
            {operatoriList.length > 0 && (
              <button 
                onClick={() => setShowOperatoriDropdown(!showOperatoriDropdown)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
              >
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
          
          {showOperatoriDropdown && operatoriList.length > 0 && (
            <div className="absolute left-3 right-3 top-full mt-1 bg-white border rounded-lg shadow-xl z-30 max-h-48 overflow-auto">
              {operatoriList.map((op) => (
                <button
                  key={op}
                  className={`w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 text-sm flex items-center justify-between ${
                    op === getUltimoOperatore() ? 'bg-green-50' : ''
                  }`}
                  onClick={() => handleSelectOperatore(op)}
                >
                  <span className="font-medium">{op}</span>
                  {op === getUltimoOperatore() && (
                    <span className="text-xs text-green-600">(ultimo)</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {showOperatoriDropdown && (
          <div className="fixed inset-0 z-20" onClick={() => setShowOperatoriDropdown(false)} />
        )}

        {/* Cliente */}
        <div className="bg-white rounded-lg p-3 relative">
          <label className="text-xs text-gray-500 flex items-center gap-1">
            <User className="w-3 h-3" /> Cliente
          </label>
          <input
            type="text"
            placeholder="Cerca cliente..."
            className="w-full p-2 border rounded-lg mt-1"
            value={cliente}
            onChange={(e) => handleClienteChange(e.target.value)}
            onFocus={() => suggerimenti.length > 0 && setShowSuggerimenti(true)}
          />
          
          {clienteSelezionato && (
            <div className="mt-2 space-y-2">
              {/* Indirizzo */}
              <div className="p-2 bg-green-50 rounded text-sm flex items-start gap-2">
                <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                <p className="text-green-800">{formatIndirizzo(clienteSelezionato)}</p>
              </div>
              
              {/* Telefono */}
              <div className="p-2 bg-blue-50 rounded text-sm flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <input
                  type="tel"
                  placeholder="Inserisci cellulare..."
                  className="flex-1 bg-transparent border-none outline-none text-blue-800 placeholder-blue-400"
                  value={telefonoCliente}
                  onChange={(e) => handleTelefonoChange(e.target.value)}
                />
                {telefonoCliente && (
                  <a 
                    href={`tel:${telefonoCliente}`}
                    className="text-blue-600 font-medium text-xs"
                  >
                    Chiama
                  </a>
                )}
              </div>
            </div>
          )}
          
          {showSuggerimenti && (
            <div className="absolute left-3 right-3 top-full mt-1 bg-white border rounded-lg shadow-xl z-30 max-h-64 overflow-auto">
              {suggerimenti.map((c, idx) => (
                <button
                  key={idx}
                  className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0"
                  onClick={() => handleSelectCliente(c)}
                >
                  <p className="font-semibold text-sm">{c.nome}</p>
                  <p className="text-xs text-gray-500">{formatIndirizzo(c)}</p>
                  {c.telefono && (
                    <p className="text-xs text-blue-600">📱 {c.telefono}</p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {showSuggerimenti && (
          <div className="fixed inset-0 z-20" onClick={() => setShowSuggerimenti(false)} />
        )}

        {/* Prodotti */}
        <div className="bg-white rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-gray-500 flex items-center gap-1">
              <Package className="w-3 h-3" /> Prodotti
            </label>
            <button
              onClick={() => setShowAddProduct(true)}
              className="text-white px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1"
              style={{ backgroundColor: '#006B3F' }}
            >
              <Plus className="w-4 h-4" /> Aggiungi
            </button>
          </div>

          {prodotti.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Nessun prodotto aggiunto</p>
          ) : (
            <div className="space-y-2">
              {prodotti.map((prod) => (
                <div 
                  key={prod.id} 
                  className={`p-2 rounded-lg border-l-4 flex items-center justify-between ${
                    prod.isOmaggio 
                      ? 'bg-green-50 border-green-500' 
                      : prod.isOrdered 
                        ? 'bg-yellow-50 border-yellow-400'
                        : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm truncate">{prod.brand} {prod.model}</p>
                      {prod.isOrdered && (
                        <span className="text-xs bg-yellow-200 text-yellow-800 px-1 rounded">⏳</span>
                      )}
                      {prod.isOmaggio && (
                        <Gift className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-mono truncate">
                      {prod.serialNumber || 'Matricola da inserire'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <button onClick={() => handleOpenEditPrice(prod)} className="p-1">
                      {formatPrezzo(prod)}
                    </button>
                    <button onClick={() => handleRemoveProduct(prod.id)} className="text-red-500 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accessori */}
        <div className="bg-white rounded-lg p-3">
          <label className="text-xs text-gray-500 mb-2 block">Accessori (opzionale)</label>
          
          {accessori.length > 0 && (
            <div className="mb-3 space-y-2">
              {accessori.map((acc) => (
                <div key={acc.id}>
                  {editingAccessorio === acc.id ? (
                    <div className="flex gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                      <input
                        type="text"
                        placeholder="Descrizione"
                        className="flex-1 p-2 border rounded text-sm"
                        value={editAccessorioData.nome}
                        onChange={(e) => setEditAccessorioData({ ...editAccessorioData, nome: e.target.value })}
                        autoFocus
                      />
                      <input
                        type="number"
                        placeholder="Qtà"
                        className="w-14 p-2 border rounded text-sm text-center"
                        min="1"
                        value={editAccessorioData.quantita}
                        onChange={(e) => setEditAccessorioData({ ...editAccessorioData, quantita: e.target.value })}
                      />
                      <input
                        type="number"
                        placeholder="€"
                        className="w-16 p-2 border rounded text-sm text-center"
                        value={editAccessorioData.prezzo}
                        onChange={(e) => setEditAccessorioData({ ...editAccessorioData, prezzo: e.target.value })}
                      />
                      <button 
                        onClick={handleSaveAccessorio} 
                        className="px-3 rounded text-white text-sm"
                        style={{ backgroundColor: '#006B3F' }}
                      >
                        ✓
                      </button>
                      <button 
                        onClick={() => setEditingAccessorio(null)} 
                        className="px-2 text-gray-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded text-sm">
                      <span className="flex-1 truncate">
                        {acc.quantita > 1 && <span className="font-medium text-blue-600 mr-1">{acc.quantita}x</span>}
                        {acc.nome}
                      </span>
                      <span className="text-gray-600 mx-2">
                        {acc.prezzo > 0 
                          ? (acc.quantita > 1 ? `€${(acc.prezzo * acc.quantita).toFixed(2)}` : `€${acc.prezzo}`)
                          : 'Incluso'}
                      </span>
                      <button onClick={() => handleEditAccessorio(acc)} className="text-blue-500 p-1">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleRemoveAccessorio(acc.id)} className="text-red-500 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Descrizione"
              className="flex-1 p-2 border rounded-lg text-sm"
              value={newAccessorio.nome}
              onChange={(e) => setNewAccessorio({ ...newAccessorio, nome: e.target.value })}
            />
            <input
              type="number"
              placeholder="Qtà"
              className="w-14 p-2 border rounded-lg text-sm text-center"
              min="1"
              value={newAccessorio.quantita}
              onChange={(e) => setNewAccessorio({ ...newAccessorio, quantita: e.target.value })}
            />
            <input
              type="number"
              placeholder="€"
              className="w-16 p-2 border rounded-lg text-sm text-center"
              value={newAccessorio.prezzo}
              onChange={(e) => setNewAccessorio({ ...newAccessorio, prezzo: e.target.value })}
            />
            <button onClick={handleAddAccessorio} className="p-2 rounded-lg text-white" style={{ backgroundColor: '#006B3F' }}>
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Totale */}
        <div className="bg-white rounded-lg p-3">
          <label className="text-xs text-gray-500">Totale vendita</label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold" style={{ color: '#006B3F' }}>€</span>
            <input
              type="number"
              placeholder="0.00"
              className="w-full p-2 pl-8 border-2 rounded-lg text-xl font-bold text-right"
              style={{ borderColor: '#006B3F' }}
              value={totaleManuale}
              onChange={(e) => setTotaleManuale(e.target.value)}
            />
          </div>
        </div>

        {/* Caparra */}
        <div className="bg-white rounded-lg p-3">
          <label className="text-xs text-gray-500 flex items-center gap-1">
            <CreditCard className="w-3 h-3" /> Caparra (opzionale)
          </label>
          <div className="flex gap-2 mt-1">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
              <input
                type="number"
                placeholder="0.00"
                className="w-full p-2 pl-8 border rounded-lg"
                value={caparra}
                onChange={(e) => setCaparra(e.target.value)}
              />
            </div>
            <select
              className="p-2 border rounded-lg text-sm"
              value={metodoPagamento}
              onChange={(e) => setMetodoPagamento(e.target.value)}
            >
              <option value="">Metodo...</option>
              <option value="contanti">Contanti</option>
              <option value="carta">Carta</option>
              <option value="bonifico">Bonifico</option>
            </select>
          </div>
          
          {parseFloat(caparra) > 0 && (
            <div className="mt-2 p-2 bg-yellow-50 rounded-lg flex justify-between items-center">
              <span className="text-sm text-yellow-800">Da saldare:</span>
              <span className="font-bold text-yellow-800">€ {getDaSaldare().toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Note */}
        <div className="bg-white rounded-lg p-3">
          <label className="text-xs text-gray-500 flex items-center gap-1">
            <FileText className="w-3 h-3" /> Note (opzionale)
          </label>
          <textarea
            placeholder="Es: Consegna venerdì, Ritiro in sede, Chiamare prima..."
            className="w-full p-2 border rounded-lg mt-1 text-sm"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Tipo Documento: Scontrino / Fattura */}
        <div className="bg-white rounded-lg p-3">
          <label className="text-xs text-gray-500 mb-2 block">Tipo documento</label>
          <div className="flex gap-2">
            <button
              onClick={() => setTipoDocumento('scontrino')}
              className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                tipoDocumento === 'scontrino'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🧾 Scontrino
            </button>
            <button
              onClick={() => setTipoDocumento('fattura')}
              className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                tipoDocumento === 'fattura'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📄 Fattura
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-white border-t">
        {hasOrderedProducts && (
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-300 rounded-lg text-sm text-yellow-800 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Commissione in attesa di consegna</span>
          </div>
        )}

        <button
          onClick={handleConcludi}
          disabled={(prodotti.length === 0 && accessori.length === 0 && !note.trim()) || !cliente.trim() || !operatore.trim()}
          className="w-full py-4 rounded-lg font-bold text-lg disabled:opacity-50"
          style={{ backgroundColor: '#FFDD00', color: '#006B3F' }}
        >
          {hasOrderedProducts ? '📋 ANTEPRIMA COMMISSIONE' : '✓ ANTEPRIMA VENDITA'}
        </button>
      </div>

      {/* MODAL MODIFICA PREZZO PRODOTTO */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Modifica Prezzo</h3>
              <button onClick={() => setEditingProduct(null)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold">{editingProduct.brand} {editingProduct.model}</p>
              <p className="text-xs text-gray-500 font-mono">{editingProduct.serialNumber || 'In ordine'}</p>
            </div>
            
            <div className="mb-4">
              <label className="text-sm text-gray-600">Prezzo (lascia vuoto per KIT)</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">€</span>
                <input
                  type="number"
                  placeholder="Vuoto = KIT"
                  className="w-full p-3 pl-8 border-2 rounded-lg text-lg"
                  value={editProductPrice}
                  onChange={(e) => setEditProductPrice(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setEditingProduct(null)}
                className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-600"
              >
                Annulla
              </button>
              <button
                onClick={handleSaveProductPrice}
                className="flex-1 py-3 rounded-lg text-white font-semibold"
                style={{ backgroundColor: '#006B3F' }}
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Aggiungi Prodotto */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-xl sm:rounded-xl w-full sm:max-w-md max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg">Aggiungi Prodotto</h3>
              <button onClick={handleCloseModal}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="flex border-b">
              <button
                onClick={() => setAddMode('magazzino')}
                className={`flex-1 py-3 text-sm font-medium ${
                  addMode === 'magazzino' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'
                }`}
              >
                📦 Da Magazzino
              </button>
              <button
                onClick={() => setAddMode('ordine')}
                className={`flex-1 py-3 text-sm font-medium ${
                  addMode === 'ordine' ? 'border-b-2 border-yellow-500 text-yellow-600' : 'text-gray-500'
                }`}
              >
                ⏳ Da Ordinare
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {addMode === 'magazzino' ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500">Cerca per brand, modello o matricola</label>
                    <div className="flex gap-2 mt-1">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Es: Stihl, RMA, 450163..."
                          className="w-full p-2 pl-9 border rounded-lg"
                          value={searchQuery}
                          onChange={(e) => { setSearchQuery(e.target.value); setSelectedProduct(null); }}
                        />
                      </div>
                      <button
                        onClick={() => document.getElementById('vendita-ocr-input')?.click()}
                        disabled={scanning}
                        className="px-3 rounded-lg text-white flex items-center"
                        style={{ backgroundColor: '#006B3F' }}
                      >
                        <Camera className="w-5 h-5" />
                        {scanning && <span className="ml-1 text-xs">...</span>}
                      </button>
                    </div>
                  </div>

                  {ocrError && (
                    <div className="p-2 bg-yellow-50 border border-yellow-300 rounded text-sm text-yellow-800">
                      ⚠️ {ocrError}
                    </div>
                  )}

                  {selectedProduct ? (
                    <div className="p-3 border-2 rounded-lg" style={{ borderColor: '#006B3F', backgroundColor: '#f0fdf4' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold" style={{ color: '#006B3F' }}>
                            {selectedProduct.brand} {selectedProduct.model}
                          </p>
                          <p className="text-xs font-mono text-gray-600">{selectedProduct.serialNumber}</p>
                        </div>
                        <button onClick={() => setSelectedProduct(null)} className="text-gray-400">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-lg max-h-64 overflow-auto">
                      {filteredInventory.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          {searchQuery ? 'Nessun prodotto trovato' : `${inventory.length} prodotti in magazzino`}
                        </div>
                      ) : (
                        filteredInventory.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSelectProduct(item)}
                            className="w-full text-left p-2 hover:bg-gray-50 border-b last:border-b-0 flex items-center"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.brand} {item.model}</p>
                              <p className="text-xs text-gray-500 font-mono">{item.serialNumber}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>
                        ))
                      )}
                    </div>
                  )}

                  {selectedProduct && (
                    <>
                      <div>
                        <label className="text-xs text-gray-500">Prezzo (lascia vuoto se fa parte di un KIT)</label>
                        <input
                          type="number"
                          placeholder="Vuoto = parte del kit"
                          className="w-full p-2 border rounded-lg mt-1"
                          value={productPrice}
                          onChange={(e) => setProductPrice(e.target.value)}
                        />
                      </div>

                      <div className="text-center">
                        {!showOmaggioOption ? (
                          <button 
                            onClick={() => setShowOmaggioOption(true)}
                            className="text-xs text-gray-400 underline"
                          >
                            È un omaggio?
                          </button>
                        ) : (
                          <label className="flex items-center justify-center gap-2 p-2 bg-green-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isOmaggio}
                              onChange={(e) => setIsOmaggio(e.target.checked)}
                              className="accent-green-500"
                            />
                            <Gift className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-700">Prodotto omaggio</span>
                          </label>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                    ⏳ Matricola da aggiungere alla consegna
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Brand *</label>
                    <select
                      className="w-full p-2 border rounded-lg mt-1"
                      value={orderBrand}
                      onChange={(e) => setOrderBrand(e.target.value)}
                    >
                      <option value="">Seleziona...</option>
                      {brands.filter(b => b !== 'Altro').map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                      <option value="Altro">Altro</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Modello *</label>
                    <input
                      type="text"
                      placeholder="Nome modello"
                      className="w-full p-2 border rounded-lg mt-1"
                      value={orderModel}
                      onChange={(e) => setOrderModel(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Prezzo (lascia vuoto se fa parte di un KIT)</label>
                    <input
                      type="number"
                      placeholder="Vuoto = parte del kit"
                      className="w-full p-2 border rounded-lg mt-1"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                    />
                  </div>

                  <div className="text-center">
                    {!showOmaggioOption ? (
                      <button 
                        onClick={() => setShowOmaggioOption(true)}
                        className="text-xs text-gray-400 underline"
                      >
                        È un omaggio?
                      </button>
                    ) : (
                      <label className="flex items-center justify-center gap-2 p-2 bg-green-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isOmaggio}
                          onChange={(e) => setIsOmaggio(e.target.checked)}
                          className="accent-green-500"
                        />
                        <Gift className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">Prodotto omaggio</span>
                      </label>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              {addMode === 'magazzino' ? (
                <button
                  onClick={handleConfirmProduct}
                  disabled={!selectedProduct}
                  className="w-full py-3 rounded-lg font-bold text-white disabled:opacity-50"
                  style={{ backgroundColor: '#006B3F' }}
                >
                  + AGGIUNGI
                </button>
              ) : (
                <button
                  onClick={handleAddOrderProduct}
                  disabled={!orderBrand || !orderModel.trim()}
                  className="w-full py-3 rounded-lg font-bold text-white bg-yellow-500 disabled:opacity-50"
                >
                  + AGGIUNGI IN ORDINE
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
