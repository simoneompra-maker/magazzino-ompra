import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Camera, Search, Plus, Trash2, Package, Clock, Gift, MapPin, User, X, ChevronRight, ChevronDown, UserCircle, Edit2, CreditCard, FileText, Phone, Image as ImageIcon } from 'lucide-react';
import useStore from '../store';
import CommissioneModal from './CommissioneModal';
import { scanMatricola, scanCommissione } from '../services/ocrService';
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
  const addGenericSale = useStore((state) => state.addGenericSale);
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
  const [isPreventivo, setIsPreventivo] = useState(false);
  const [dataVendita, setDataVendita] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  
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
  const [orderTipo, setOrderTipo] = useState('');
  const [orderTipoAltro, setOrderTipoAltro] = useState('');
  const [orderModel, setOrderModel] = useState('');
  
  // Lista tipologie macchine
  const tipiMacchina = [
    'Motosega', 'Decespugliatore', 'Tagliabordi', 'Tagliasiepi', 'Soffiatore',
    'Aspiratore', 'Tosaerba', 'Robot tosaerba', 'Trattorino', 'Biotrituratore',
    'Idropulitrice', 'Motozappa', 'Arieggiatore', 'Troncatrice', 'Atomizzatore',
    'Irroratore', 'Sramatore', 'Potatore', 'Trivella', 'Spazzatrice', 'Pompa acqua',
    'Motocoltivatore', 'Forbice elettronica', 'Motore multifunzione', 'Altro'
  ];
  
  // OCR
  const [scanning, setScanning] = useState(false);
  const [ocrError, setOcrError] = useState(null);
  
  // Scansione commissione manuale
  const [scanningCommissione, setScanningCommissione] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [showScanBuonoModal, setShowScanBuonoModal] = useState(false);
  const [showOcrChoice, setShowOcrChoice] = useState(false);
  const [ocrRighe, setOcrRighe] = useState([]); // righe lette dall'OCR per revisione
  const [showOcrReview, setShowOcrReview] = useState(false); // modale revisione righe
  const [ocrPreview, setOcrPreview] = useState(null); // preview rapido dopo scan
  
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
    if (!orderTipo) {
      alert('Seleziona un tipo di macchina!');
      return;
    }
    if (orderTipo === 'Altro' && !orderTipoAltro.trim()) {
      alert('Inserisci il tipo di macchina!');
      return;
    }
    if (!orderModel.trim()) {
      alert('Inserisci il modello!');
      return;
    }

    const prezzo = isOmaggio ? 0 : (parseFloat(productPrice) || null);
    const tipoFinale = orderTipo === 'Altro' ? orderTipoAltro.trim() : orderTipo;
    const modelCompleto = `${tipoFinale} ${orderModel.trim()}`;

    setProdotti([...prodotti, {
      id: Date.now(),
      brand: orderBrand,
      model: modelCompleto,
      serialNumber: null,
      prezzo: prezzo,
      isOmaggio: isOmaggio,
      isOrdered: true
    }]);
    
    setOrderBrand('');
    setOrderTipo('');
    setOrderTipoAltro('');
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
    setOrderTipo('');
    setOrderTipoAltro('');
    setOrderModel('');
    setOcrError(null);
    setAddMode('magazzino');
  };

  // Scansione commissione/buono di consegna manuale
  const handleScanCommissione = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setScanningCommissione(true);
    setScanResult(null);
    setOcrRighe([]);
    setOcrPreview(null);
    
    try {
      const result = await scanCommissione(file);
      
      if (result.success && result.righe?.length > 0) {
        const righe = result.righe.filter(r => r.campo !== 'ignora');
        setOcrRighe(righe);
        
        // Costruisci preview rapido
        const preview = {
          cliente: righe.find(r => r.campo === 'cliente')?.testo || null,
          macchine: righe.filter(r => r.campo === 'macchina').map(r => ({
            testo: `${r.brand ? r.brand + ' ' : ''}${r.testo}`,
            prezzo: r.prezzo
          })),
          accessori: righe.filter(r => r.campo === 'accessorio').map(r => ({
            testo: r.testo,
            prezzo: r.prezzo
          })),
          prezzoTotale: righe.find(r => r.campo === 'prezzo_totale')?.prezzo || null,
          caparra: righe.find(r => r.campo === 'caparra')?.prezzo || null,
          fattura: righe.find(r => r.campo === 'fattura')?.testo || null,
          data: righe.find(r => r.campo === 'data')?.testo || null
        };
        setOcrPreview(preview);
      } else {
        setScanResult({
          success: false,
          message: result.error || 'Nessuna riga letta dal buono'
        });
      }
    } catch (error) {
      console.error('Errore scansione commissione:', error);
      setScanResult({
        success: false,
        message: 'Errore durante la scansione. Riprova.'
      });
    } finally {
      setScanningCommissione(false);
      e.target.value = '';
    }
  };

  // Cambia campo di una riga OCR
  const handleOcrCampoChange = (id, newCampo) => {
    setOcrRighe(prev => prev.map(r => r.id === id ? { ...r, campo: newCampo } : r));
  };

  // Modifica testo di una riga OCR
  const handleOcrTestoChange = (id, newTesto) => {
    setOcrRighe(prev => prev.map(r => r.id === id ? { ...r, testo: newTesto } : r));
  };

  // Modifica prezzo di una riga OCR
  const handleOcrPrezzoChange = (id, newPrezzo) => {
    const val = newPrezzo === '' ? null : parseFloat(newPrezzo);
    setOcrRighe(prev => prev.map(r => r.id === id ? { ...r, prezzo: isNaN(val) ? null : val } : r));
  };

  // Unisci riga con quella sopra
  const handleOcrMergeUp = (id) => {
    setOcrRighe(prev => {
      const idx = prev.findIndex(r => r.id === id);
      if (idx <= 0) return prev;
      const above = prev[idx - 1];
      const current = prev[idx];
      const merged = {
        ...above,
        testo: `${above.testo} ${current.testo}`.trim(),
        // Se la riga corrente ha un prezzo e quella sopra no, prendi il prezzo
        prezzo: above.prezzo != null ? above.prezzo : current.prezzo,
        // Se la riga corrente ha un brand e quella sopra no, prendi il brand
        brand: above.brand || current.brand
      };
      return prev.filter(r => r.id !== id).map(r => r.id === above.id ? merged : r);
    });
  };

  // Conferma righe OCR e compila il form
  const handleConfirmOcrRighe = () => {
    const righe = ocrRighe.filter(r => r.campo !== 'ignora');
    
    let nuoveMacchine = [];
    let nuoviAccessori = [];
    
    righe.forEach((riga, idx) => {
      switch (riga.campo) {
        case 'cliente':
          setCliente(riga.testo);
          break;
        case 'macchina':
          nuoveMacchine.push({
            id: Date.now() + idx,
            brand: riga.brand || '',
            model: riga.testo || '',
            serialNumber: null,
            prezzo: riga.prezzo || 0,
            isOmaggio: false,
            isOrdered: false
          });
          break;
        case 'accessorio':
          nuoviAccessori.push({
            id: Date.now() + 1000 + idx,
            nome: riga.testo || '',
            quantita: 1,
            prezzo: riga.prezzo || 0
          });
          break;
        case 'prezzo_totale': {
          const val = typeof riga.prezzo === 'number' ? riga.prezzo : 
            parseFloat(riga.testo.replace(/[^\d.,]/g, '').replace(',', '.'));
          if (!isNaN(val) && val > 0) {
            setTotaleManuale(val.toFixed(2));
          }
          break;
        }
        case 'caparra': {
          const val = typeof riga.prezzo === 'number' ? riga.prezzo :
            parseFloat(riga.testo.replace(/[^\d.,]/g, '').replace(',', '.'));
          if (!isNaN(val) && val > 0) {
            setCaparra(val.toFixed(2));
          }
          break;
        }
        case 'fattura':
          if (riga.testo.toUpperCase().includes('SI') || riga.testo.toUpperCase() === 'S') {
            setTipoDocumento('fattura');
          } else {
            setTipoDocumento('scontrino');
          }
          break;
        case 'data':
          try {
            const parts = riga.testo.split('/');
            if (parts.length === 3) {
              const [dd, mm, yyyy] = parts;
              const year = yyyy.length === 2 ? `20${yyyy}` : yyyy;
              const dataFormattata = `${year}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
              setDataVendita(dataFormattata);
            }
          } catch (e) {
            console.log('Data non parsabile:', riga.testo);
          }
          break;
        case 'note':
          setNote(prev => prev ? `${prev}\n${riga.testo}` : riga.testo);
          break;
      }
    });
    
    if (nuoveMacchine.length > 0) {
      setProdotti(prev => [...prev, ...nuoveMacchine]);
    }
    if (nuoviAccessori.length > 0) {
      setAccessori(prev => [...prev, ...nuoviAccessori]);
    }
    
    const totItems = nuoveMacchine.length + nuoviAccessori.length;
    setScanResult({
      success: true,
      message: `Importati: ${righe.filter(r => r.campo === 'cliente').length ? 'cliente, ' : ''}${nuoveMacchine.length} macchine, ${nuoviAccessori.length} accessori`
    });
    
    setShowOcrReview(false);
    setOcrRighe([]);
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
      dataVendita: dataVendita,
      isPending: hasOrderedProducts,
      isPreventivo: isPreventivo
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
    
    // Se è un preventivo, non salva nulla - solo conferma per condivisione
    if (isPreventivo) {
      setCommissioneData({
        ...commissioneData,
        confirmed: true,
        isPreventivo: true
      });
      return;
    }
    
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
    
    // Converti data in formato ISO
    const dataISO = new Date(dataVendita + 'T12:00:00').toISOString();
    
    // Gestisci ogni prodotto
    for (const prod of prodotti) {
      if (prod.serialNumber) {
        // Prodotto CON matricola → vendi da magazzino
        const result = await sellProduct(prod.serialNumber, {
          cliente: nomeCliente,
          operatore: nomeOperatore,
          prezzo: prod.prezzo || 0,
          totale: totale,
          dataVendita: dataISO
        });
        if (!result.success) allSuccess = false;
      } else {
        // Prodotto SENZA matricola → registra vendita generica
        const result = await addGenericSale({
          cliente: nomeCliente,
          operatore: nomeOperatore,
          brand: prod.brand,
          model: prod.model,
          prezzo: prod.prezzo || 0,
          totale: totale,
          dataVendita: dataISO
        });
        if (!result.success) allSuccess = false;
      }
    }
    
    // Se ci sono accessori, registra anche quelli
    for (const acc of accessori) {
      const result = await addGenericSale({
        cliente: nomeCliente,
        operatore: nomeOperatore,
        brand: 'ACCESSORI',
        model: acc.descrizione,
        prezzo: acc.prezzo * (acc.quantita || 1),
        totale: totale,
        dataVendita: dataISO
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
    setIsPreventivo(false);
    setDataVendita(new Date().toISOString().split('T')[0]);
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
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center">
          <button onClick={() => onNavigate('home')} className="mr-3">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Nuova Vendita</h1>
        </div>
        
        {/* Pulsante Scansiona Buono */}
        <button 
          onClick={() => setShowScanBuonoModal(true)}
          disabled={scanningCommissione}
          className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
        >
          <Camera className="w-4 h-4" />
          <span className="hidden sm:inline">Scansiona Buono</span>
          <span className="sm:hidden">📷</span>
        </button>
      </div>

      {/* Input file nascosti per Scansiona Buono */}
      <input
        type="file"
        id="buono-camera"
        accept="image/*"
        capture="environment"
        onChange={(e) => { setShowScanBuonoModal(false); handleScanCommissione(e); }}
        style={{ display: 'none' }}
        disabled={scanningCommissione}
      />
      <input
        type="file"
        id="buono-gallery"
        accept="image/*"
        onChange={(e) => { setShowScanBuonoModal(false); handleScanCommissione(e); }}
        style={{ display: 'none' }}
        disabled={scanningCommissione}
      />

      {/* Input file nascosti per scansione matricola */}
      <input
        type="file"
        id="vendita-ocr-input"
        accept="image/*"
        capture="environment"
        onChange={(e) => { setShowOcrChoice(false); handleFileSelect(e); }}
        style={{ display: 'none' }}
      />
      <input
        type="file"
        id="vendita-ocr-input-gallery"
        accept="image/*"
        onChange={(e) => { setShowOcrChoice(false); handleFileSelect(e); }}
        style={{ display: 'none' }}
      />

      {/* Box risultato scansione commissione */}
      {/* Preview rapido OCR */}
      {ocrPreview && (
        <div className="mx-4 mt-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="space-y-1 text-sm">
            {ocrPreview.cliente && (
              <div className="flex items-center gap-2">
                <span className="text-blue-400 w-5 text-center">👤</span>
                <span className="font-medium">{ocrPreview.cliente}</span>
              </div>
            )}
            {ocrPreview.macchine.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-green-500 w-5 text-center">⚙️</span>
                <span className="flex-1">{m.testo}</span>
                {m.prezzo > 0 && <span className="text-gray-600 font-mono text-xs">€{m.prezzo.toFixed(2)}</span>}
              </div>
            ))}
            {ocrPreview.accessori.map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-yellow-500 w-5 text-center">🔧</span>
                <span className="flex-1">{a.testo}</span>
                {a.prezzo > 0 && <span className="text-gray-600 font-mono text-xs">€{a.prezzo.toFixed(2)}</span>}
              </div>
            ))}
            <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
              {ocrPreview.prezzoTotale && <span>Tot: €{ocrPreview.prezzoTotale.toFixed(2)}</span>}
              {ocrPreview.caparra && <span>Caparra: €{ocrPreview.caparra.toFixed(2)}</span>}
              {ocrPreview.fattura && <span>Fatt: {ocrPreview.fattura}</span>}
              {ocrPreview.data && <span>Data: {ocrPreview.data}</span>}
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => { handleConfirmOcrRighe(); setOcrPreview(null); }}
              className="flex-[2] py-2 rounded-lg font-bold text-white text-sm"
              style={{ backgroundColor: '#006B3F' }}
            >
              ✓ Conferma
            </button>
            <button
              onClick={() => { setShowOcrReview(true); setOcrPreview(null); }}
              className="flex-1 py-2 rounded-lg font-medium text-sm border-2 border-gray-300 text-gray-600"
            >
              ✏️ Correggi
            </button>
            <button
              onClick={() => { setOcrPreview(null); setOcrRighe([]); }}
              className="px-3 py-2 rounded-lg text-gray-400 text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Errore/successo scansione */}
      {!ocrPreview && (scanningCommissione || scanResult) && (
        <div className={`mx-4 mt-2 p-3 rounded-lg ${
          scanningCommissione ? 'bg-blue-50 border border-blue-200' :
          scanResult?.success ? 'bg-green-50 border border-green-200' :
          'bg-red-50 border border-red-200'
        }`}>
          {scanningCommissione ? (
            <div className="flex items-center gap-2 text-blue-700">
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
              <span className="text-sm">Analizzo il buono...</span>
            </div>
          ) : (
            <div className={`flex items-center justify-between ${scanResult?.success ? 'text-green-700' : 'text-red-700'}`}>
              <span className="text-sm font-medium">{scanResult?.message}</span>
              <button 
                onClick={() => setScanResult(null)}
                className="opacity-50 hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex-1 p-4 overflow-auto space-y-3">
        {/* Operatore e Data */}
        <div className="flex gap-2">
          {/* Operatore */}
          <div className="flex-1 bg-white rounded-lg p-3 relative">
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
          
          {/* Data Vendita */}
          <div className="w-32 bg-white rounded-lg p-3">
            <label className="text-xs text-gray-500">📅 Data</label>
            <input
              type="date"
              className="w-full p-2 border rounded-lg mt-1 text-sm"
              value={dataVendita}
              onChange={(e) => setDataVendita(e.target.value)}
            />
          </div>
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
          
          {/* Checkbox Preventivo */}
          <label className="flex items-center gap-3 mt-3 p-3 bg-orange-50 rounded-lg cursor-pointer border-2 border-transparent hover:border-orange-300 transition-all">
            <input
              type="checkbox"
              checked={isPreventivo}
              onChange={(e) => setIsPreventivo(e.target.checked)}
              className="w-5 h-5 accent-orange-500"
            />
            <div>
              <span className="font-medium text-orange-800">È un preventivo</span>
              <p className="text-xs text-orange-600">Non registra la vendita, genera solo il documento</p>
            </div>
          </label>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-white border-t">
        {hasOrderedProducts && !isPreventivo && (
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-300 rounded-lg text-sm text-yellow-800 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Commissione in attesa di consegna</span>
          </div>
        )}
        
        {isPreventivo && (
          <div className="mb-3 p-2 bg-orange-50 border border-orange-300 rounded-lg text-sm text-orange-800 flex items-center gap-2">
            📝 <span>Preventivo - non verrà registrata la vendita</span>
          </div>
        )}

        <button
          onClick={handleConcludi}
          disabled={(prodotti.length === 0 && accessori.length === 0 && !note.trim()) || !cliente.trim() || !operatore.trim()}
          className="w-full py-4 rounded-lg font-bold text-lg disabled:opacity-50"
          style={{ 
            backgroundColor: isPreventivo ? '#F97316' : '#FFDD00', 
            color: isPreventivo ? 'white' : '#006B3F' 
          }}
        >
          {isPreventivo 
            ? '📝 ANTEPRIMA PREVENTIVO' 
            : hasOrderedProducts 
              ? '📋 ANTEPRIMA COMMISSIONE' 
              : '✓ ANTEPRIMA VENDITA'}
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
                        onClick={() => setShowOcrChoice(true)}
                        disabled={scanning}
                        className="px-3 rounded-lg text-white flex items-center"
                        style={{ backgroundColor: '#006B3F' }}
                        title="Scansiona matricola"
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
                    <label className="text-xs text-gray-500">Tipo macchina *</label>
                    <select
                      className="w-full p-2 border rounded-lg mt-1"
                      value={orderTipo}
                      onChange={(e) => {
                        setOrderTipo(e.target.value);
                        if (e.target.value !== 'Altro') setOrderTipoAltro('');
                      }}
                    >
                      <option value="">Seleziona...</option>
                      {tipiMacchina.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>

                  {orderTipo === 'Altro' && (
                    <div>
                      <label className="text-xs text-gray-500">Specifica tipo *</label>
                      <input
                        type="text"
                        placeholder="Es: Aspirafoglie"
                        className="w-full p-2 border rounded-lg mt-1"
                        value={orderTipoAltro}
                        onChange={(e) => setOrderTipoAltro(e.target.value)}
                      />
                    </div>
                  )}

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
                  disabled={!orderBrand || !orderTipo || (orderTipo === 'Altro' && !orderTipoAltro.trim()) || !orderModel.trim()}
                  className="w-full py-3 rounded-lg font-bold text-white bg-yellow-500 disabled:opacity-50"
                >
                  + AGGIUNGI IN ORDINE
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODALE Revisione Righe OCR */}
      {showOcrReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-xl sm:rounded-xl w-full sm:max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="font-bold text-lg">Verifica Righe</h3>
                <p className="text-xs text-gray-500">{ocrRighe.length} righe lette - correggi se necessario</p>
              </div>
              <button onClick={() => { setShowOcrReview(false); setOcrRighe([]); }}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-3 space-y-2">
              {ocrRighe.map((riga) => (
                <div key={riga.id} className={`p-3 rounded-lg border ${
                  riga.campo === 'ignora' ? 'bg-gray-50 border-gray-200 opacity-50' :
                  riga.campo === 'cliente' ? 'bg-blue-50 border-blue-200' :
                  riga.campo === 'macchina' ? 'bg-green-50 border-green-200' :
                  riga.campo === 'accessorio' ? 'bg-yellow-50 border-yellow-200' :
                  riga.campo === 'prezzo_totale' ? 'bg-purple-50 border-purple-200' :
                  riga.campo === 'caparra' ? 'bg-orange-50 border-orange-200' :
                  riga.campo === 'fattura' ? 'bg-indigo-50 border-indigo-200' :
                  riga.campo === 'data' ? 'bg-cyan-50 border-cyan-200' :
                  riga.campo === 'note' ? 'bg-pink-50 border-pink-200' :
                  'bg-white border-gray-200'
                }`}>
                  <div className="flex items-start gap-2">
                    {/* Pulsante unisci con riga sopra */}
                    {ocrRighe.indexOf(riga) > 0 && (
                      <button
                        onClick={() => handleOcrMergeUp(riga.id)}
                        className="shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded"
                        title="Unisci con riga sopra"
                      >
                        ↑
                      </button>
                    )}
                    {ocrRighe.indexOf(riga) === 0 && (
                      <div className="shrink-0 w-6" />
                    )}
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={riga.testo}
                        onChange={(e) => handleOcrTestoChange(riga.id, e.target.value)}
                        className="w-full text-sm font-medium bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                      />
                      {riga.brand && (
                        <span className="text-xs text-green-600 font-medium">Brand: {riga.brand}</span>
                      )}
                    </div>
                    {/* Campo prezzo per macchine e accessori */}
                    {(riga.campo === 'macchina' || riga.campo === 'accessorio') && (
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-xs text-gray-400">€</span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={riga.prezzo != null && riga.prezzo !== 0 ? riga.prezzo : ''}
                          onChange={(e) => handleOcrPrezzoChange(riga.id, e.target.value)}
                          className="w-20 text-sm text-right bg-white border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-300"
                        />
                      </div>
                    )}
                    <select
                      value={riga.campo}
                      onChange={(e) => handleOcrCampoChange(riga.id, e.target.value)}
                      className="text-xs font-medium border rounded-md px-2 py-1 bg-white min-w-[100px] shrink-0"
                    >
                      <option value="cliente">Cliente</option>
                      <option value="macchina">Macchina</option>
                      <option value="accessorio">Accessorio</option>
                      <option value="prezzo_totale">Prezzo tot.</option>
                      <option value="caparra">Caparra</option>
                      <option value="fattura">Fattura</option>
                      <option value="data">Data</option>
                      <option value="note">Note</option>
                      <option value="ignora">Ignora</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t flex gap-2">
              <button
                onClick={() => { setShowOcrReview(false); setOcrRighe([]); }}
                className="flex-1 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-500"
              >
                Annulla
              </button>
              <button
                onClick={handleConfirmOcrRighe}
                className="flex-[2] py-3 rounded-lg font-bold text-white"
                style={{ backgroundColor: '#3b82f6' }}
              >
                Conferma e compila
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE Scansiona Buono - stile CaricoMerce */}
      {showScanBuonoModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg">📷 Scansione OCR</h3>
              <button onClick={() => setShowScanBuonoModal(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <button
                onClick={() => document.getElementById('buono-camera')?.click()}
                className="w-full py-4 rounded-lg font-bold text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: '#3b82f6' }}
              >
                <Camera className="w-5 h-5" />
                📷 SCATTA FOTO
              </button>
              <button
                onClick={() => document.getElementById('buono-gallery')?.click()}
                className="w-full py-4 rounded-lg font-bold border-2 flex items-center justify-center gap-2"
                style={{ borderColor: '#3b82f6', color: '#3b82f6' }}
              >
                <ImageIcon className="w-5 h-5" />
                🖼️ DA GALLERIA
              </button>
              <button
                onClick={() => setShowScanBuonoModal(false)}
                className="w-full py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-500"
              >
                CHIUDI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE Scansione Matricola - stile CaricoMerce */}
      {showOcrChoice && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg">📷 Scansione OCR</h3>
              <button onClick={() => setShowOcrChoice(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <button
                onClick={() => document.getElementById('vendita-ocr-input')?.click()}
                className="w-full py-4 rounded-lg font-bold text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: '#006B3F' }}
              >
                <Camera className="w-5 h-5" />
                📷 SCATTA FOTO
              </button>
              <button
                onClick={() => document.getElementById('vendita-ocr-input-gallery')?.click()}
                className="w-full py-4 rounded-lg font-bold border-2 flex items-center justify-center gap-2"
                style={{ borderColor: '#006B3F', color: '#006B3F' }}
              >
                <ImageIcon className="w-5 h-5" />
                🖼️ DA GALLERIA
              </button>
              <button
                onClick={() => setShowOcrChoice(false)}
                className="w-full py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-500"
              >
                CHIUDI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
