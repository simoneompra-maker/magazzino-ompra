import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Camera, Search, Plus, Trash2, Package, Clock, Gift, MapPin, User, X, ChevronRight, ChevronDown, UserCircle, Edit2, CreditCard, FileText, Phone, Image as ImageIcon } from 'lucide-react';
import useStore from '../store';
import { supabase } from '../store';
import CommissioneModal from './CommissioneModal';
import { scanMatricola, scanCommissione, scanDocumentoIdentita } from '../services/ocrService';
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

// ========== HELPER PROMO ==========
const isPromoAttiva = (p) => {
  if (!p.prezzo_promo) return false;
  const oggi = new Date().toISOString().split('T')[0];
  if (p.promo_dal && oggi < p.promo_dal) return false;
  if (p.promo_al && oggi > p.promo_al) return false;
  return true;
};

export default function Vendita({ onNavigate }) {
  const inventory = useStore((state) => state.inventory);
  const findBySerialNumber = useStore((state) => state.findBySerialNumber);
  const dischargeInventory = useStore((state) => state.dischargeInventory);
  const autoAddToInventory = useStore((state) => state.autoAddToInventory);
  const createCommissione = useStore((state) => state.createCommissione);
  const brands = useStore((state) => state.brands);

  // Stato principale
  const [cliente, setCliente] = useState('');
  const [clienteSelezionato, setClienteSelezionato] = useState(null);
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [prodotti, setProdotti] = useState([]);
  const [accessori, setAccessori] = useState([]);
  const [newAccessorio, setNewAccessorio] = useState({ nome: '', prezzo: '', quantita: '1', matricola: '', aliquotaIva: 22 });
  const [totaleManuale, setTotaleManuale] = useState('');
  const [ivaCompresa, setIvaCompresa] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Ricerca listino accessori
  const [listiniSuggerimenti, setListiniSuggerimenti] = useState([]);
  const [showListiniDropdown, setShowListiniDropdown] = useState(false);
  const [listiniLoading, setListiniLoading] = useState(false);
  const [fasceProdottoListino, setFasceProdottoListino] = useState([]); // fasce prezzo da scegliere
  
  // Caparra e Note
  const [caparra, setCaparra] = useState('');
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [note, setNote] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('scontrino'); // 'scontrino' | 'fattura'
  const [isPreventivo, setIsPreventivo] = useState(false);
  const [tipoOperazione, setTipoOperazione] = useState('vendita'); // 'vendita' | 'reso' | 'cambio'
  const [dataVendita, setDataVendita] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  
  // Modifica accessorio
  const [editingAccessorio, setEditingAccessorio] = useState(null);
  const [editAccessorioData, setEditAccessorioData] = useState({ nome: '', prezzo: '', quantita: '1', matricola: '' });
  
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
  const [orderModel, setOrderModel] = useState('');
  
  
  // Per inserimento diretto
  const [directSerial, setDirectSerial] = useState('');
  const [directBrand, setDirectBrand] = useState('');
  const [directModel, setDirectModel] = useState('');
  const [directPrice, setDirectPrice] = useState('');
  const [directAdding, setDirectAdding] = useState(false);

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
  // Stato popup auto-carico macchina non trovata
  const [showAutoAdd, setShowAutoAdd] = useState(false);
  const [autoAddData, setAutoAddData] = useState({ brand: '', model: '', serialNumber: '', tipo: '' });
  const [autoAdding, setAutoAdding] = useState(false);
  
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

  // Modal Nuovo Cliente manuale
  const [showNuovoCliente, setShowNuovoCliente] = useState(false);
  const [nuovoClienteForm, setNuovoClienteForm] = useState({
    nome: '', cognome: '', indirizzo: '', cap: '', localita: '', provincia: '', telefono: '', email: ''
  });
  const [scanningDocumento, setScanningDocumento] = useState(false);

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

  // Apri modal nuovo cliente
  const handleAprirNuovoCliente = () => {
    setNuovoClienteForm({ nome: '', cognome: '', indirizzo: '', cap: '', localita: '', provincia: '', telefono: '', email: '' });
    setShowNuovoCliente(true);
  };

  // Scansiona documento identità con Gemini
  const handleScanDocumento = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ''; // reset input per permettere riscan
    setScanningDocumento(true);
    try {
      const result = await scanDocumentoIdentita(file);
      if (result.success && result.data) {
        const d = result.data;
        setNuovoClienteForm(prev => ({
          nome:      d.nome      || prev.nome,
          cognome:   d.cognome   || prev.cognome,
          indirizzo: d.indirizzo || prev.indirizzo,
          cap:       d.cap       || prev.cap,
          localita:  d.localita  || prev.localita,
          provincia: d.provincia || prev.provincia,
          telefono:  d.telefono  || prev.telefono,
          email:     d.email     || prev.email,
        }));
      } else {
        alert(result.error || 'Errore nella lettura del documento. Inserisci i dati manualmente.');
      }
    } catch (err) {
      console.error('Errore scan documento:', err);
      alert('Errore imprevisto. Inserisci i dati manualmente.');
    } finally {
      setScanningDocumento(false);
    }
  };

  // Conferma nuovo cliente dal form manuale
  const handleConfermaClienteManuale = () => {
    const f = nuovoClienteForm;
    const nomeCompleto = [f.cognome.trim(), f.nome.trim()].filter(Boolean).join(' ');
    if (!nomeCompleto) {
      alert('Inserisci almeno nome o cognome!');
      return;
    }
    const clienteVirtuale = {
      id: null,
      nome: nomeCompleto,
      indirizzo: f.indirizzo.trim() || null,
      cap: f.cap.trim() || null,
      localita: f.localita.trim() || null,
      provincia: f.provincia.trim() || null,
      telefono: f.telefono.trim() || null,
      email: f.email.trim() || null,
    };
    setCliente(nomeCompleto);
    setClienteSelezionato(clienteVirtuale);
    setTelefonoCliente(f.telefono.trim() || '');
    setShowNuovoCliente(false);
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
          // Apre popup auto-carico invece di mostrare solo errore
          setAutoAddData({
            brand: result.brand || '',
            model: result.modello || '',
            serialNumber: result.matricola,
            tipo: ''
          });
          setShowAutoAdd(true);
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

  // Handler conferma auto-carico macchina non trovata
  const handleAutoAdd = async () => {
    if (!autoAddData.brand.trim() || !autoAddData.serialNumber.trim()) return;
    setAutoAdding(true);
    const tipoFinale = autoAddData.tipo || 'Altro';
    const modelCompleto = autoAddData.tipo
      ? autoAddData.tipo + (autoAddData.model ? ' ' + autoAddData.model : '')
      : (autoAddData.model || 'N/D');
    const item = await autoAddToInventory({
      brand: autoAddData.brand.trim(),
      model: modelCompleto,
      serialNumber: autoAddData.serialNumber.trim().toUpperCase()
    });
    setAutoAdding(false);
    if (item) {
      setShowAutoAdd(false);
      setSelectedProduct(item);
      setSearchQuery(item.serialNumber);
      setOcrError(null);
    } else {
      alert('Errore durante il carico automatico. Riprova.');
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
      isOmaggio: isOmaggio,
      aliquotaIva: 22
    }]);
    
    setSelectedProduct(null);
    setSearchQuery('');
    setProductPrice('');
    setIsOmaggio(false);
    setShowOmaggioOption(false);
  };

  const handleConfirmProductAndClose = () => {
    handleConfirmProduct();
    setShowAddProduct(false);
  };

  // Auto-compila brand e modello quando la matricola corrisponde a un prodotto in magazzino
  useEffect(() => {
    if (!directSerial.trim()) return;
    const found = findBySerialNumber(directSerial.trim().toUpperCase());
    if (found) {
      setDirectBrand(found.brand || '');
      setDirectModel(found.model || '');
    }
  }, [directSerial]);

  const handleAddDirectProduct = async () => {
    if (!directBrand.trim()) {
      alert('Inserisci il brand!');
      return;
    }
    setDirectAdding(true);
    const serialClean = directSerial.trim().toUpperCase();
    const prezzo = parseFloat(directPrice) || null;

    // Cerca in magazzino
    let prodotto = serialClean ? findBySerialNumber(serialClean) : null;

    // Non trovato ma matricola presente → carico automatico silenzioso
    if (!prodotto && serialClean) {
      prodotto = await autoAddToInventory({
        brand: directBrand.trim(),
        model: directModel.trim() || 'N/D',
        serialNumber: serialClean
      });
    }

    if (prodotto) {
      if (prodotti.find(p => p.serialNumber && p.serialNumber === prodotto.serialNumber)) {
        alert('Prodotto già aggiunto!');
        setDirectAdding(false);
        return;
      }
      setProdotti(prev => [...prev, {
        id: Date.now(),
        brand: prodotto.brand,
        model: prodotto.model,
        serialNumber: prodotto.serialNumber,
        prezzo,
        isOmaggio: false,
        aliquotaIva: 22
      }]);
    } else {
      setProdotti(prev => [...prev, {
        id: Date.now(),
        brand: directBrand.trim(),
        model: directModel.trim() || 'N/D',
        serialNumber: null,
        prezzo,
        isOmaggio: false,
        aliquotaIva: 22
      }]);
    }

    setDirectSerial('');
    setDirectBrand('');
    setDirectModel('');
    setDirectPrice('');
    setDirectAdding(false);
    setShowAddProduct(false);
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
    if (!orderModel.trim()) {
      alert('Inserisci il modello!');
      return;
    }

    const prezzo = isOmaggio ? 0 : (parseFloat(productPrice) || null);
    const tipoFinale = orderTipo.trim();
    const modelCompleto = `${tipoFinale} ${orderModel.trim()}`;

    setProdotti([...prodotti, {
      id: Date.now(),
      brand: orderBrand,
      model: modelCompleto,
      serialNumber: null,
      prezzo: prezzo,
      isOmaggio: isOmaggio,
      isOrdered: true,
      aliquotaIva: 22
    }]);
    
    setOrderBrand('');
    setOrderTipo('');
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
    setOrderModel('');
    setOcrError(null);
    setAddMode('magazzino');
    setDirectSerial('');
    setDirectBrand('');
    setDirectModel('');
    setDirectPrice('');
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
          macchine: righe.filter(r => r.campo === 'macchina').map((r, i) => {
            // Cerca matricola subito dopo questa macchina
            const rigaIdx = righe.indexOf(r);
            const nextMatricola = righe[rigaIdx + 1]?.campo === 'matricola' ? righe[rigaIdx + 1].testo : null;
            return {
              testo: `${r.brand ? r.brand + ' ' : ''}${r.testo}`,
              prezzo: r.prezzo,
              matricola: nextMatricola
            };
          }),
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
        // Auto-dismiss errore dopo 10 secondi
        setTimeout(() => setScanResult(null), 10000);
      }
    } catch (error) {
      console.error('Errore scansione commissione:', error);
      setScanResult({
        success: false,
        message: 'Errore durante la scansione. Riprova.'
      });
      // Auto-dismiss errore dopo 10 secondi
      setTimeout(() => setScanResult(null), 10000);
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
            isOrdered: false,
            aliquotaIva: 22
          });
          break;
        case 'matricola': {
          // Associa la matricola all'ultima macchina aggiunta
          const matricolaVal = riga.testo.replace(/^MATR\.?\s*/i, '').trim();
          if (nuoveMacchine.length > 0) {
            nuoveMacchine[nuoveMacchine.length - 1].serialNumber = matricolaVal;
          }
          break;
        }
        case 'accessorio':
          nuoviAccessori.push({
            id: Date.now() + 1000 + idx,
            nome: riga.testo || '',
            quantita: 1,
            prezzo: riga.prezzo || 0,
            aliquotaIva: 22
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
          // Estrai metodo pagamento dal testo caparra
          const testoUp = riga.testo.toUpperCase();
          if (testoUp.includes('BANCOMAT') || testoUp.includes('POS')) {
            setMetodoPagamento('pos');
          } else if (testoUp.includes('CARTA') || testoUp.includes('CARD')) {
            setMetodoPagamento('carta');
          } else if (testoUp.includes('CONTANT') || testoUp.includes('CASH')) {
            setMetodoPagamento('contanti');
          } else if (testoUp.includes('BONIFIC') || testoUp.includes('IBAN')) {
            setMetodoPagamento('bonifico');
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
            // Rimuovi prefisso non numerico (es. "Data ", "data:")
            const dataTesto = riga.testo.replace(/^[^0-9]*/i, '').trim();
            const parts = dataTesto.split('/');
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
          setNote(prev => {
            // Se è la prima nota nel batch, sostituisci
            const isFirst = !righe.slice(0, righe.indexOf(riga)).some(r => r.campo === 'note');
            return isFirst ? riga.testo : `${prev}\n${riga.testo}`;
          });
          break;
      }
    });
    
    if (nuoveMacchine.length > 0) {
      setProdotti(nuoveMacchine);
    }
    if (nuoviAccessori.length > 0) {
      setAccessori(nuoviAccessori);
    } else if (nuoveMacchine.length > 0) {
      // Se ci sono macchine ma non accessori, resetta comunque gli accessori OCR
      setAccessori([]);
    }
    
    const totItems = nuoveMacchine.length + nuoviAccessori.length;
    setScanResult({
      success: true,
      message: `Importati: ${righe.filter(r => r.campo === 'cliente').length ? 'cliente, ' : ''}${nuoveMacchine.length} macchine, ${nuoviAccessori.length} accessori`
    });
    
    setShowOcrReview(false);
    // NON svuotiamo ocrRighe — serve per riaprire la revisione
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

  // Cicla aliquota IVA prodotto: 22 → 10 → 4 → 22
  const cycleIvaProdotto = (id) => {
    setProdotti(prodotti.map(p => {
      if (p.id !== id) return p;
      const current = p.aliquotaIva || 22;
      const next = current === 22 ? 10 : current === 10 ? 4 : 22;
      return { ...p, aliquotaIva: next };
    }));
  };

  // Cicla aliquota IVA accessorio: 22 → 10 → 4 → 22
  const cycleIvaAccessorio = (id) => {
    setAccessori(accessori.map(a => {
      if (a.id !== id) return a;
      const current = a.aliquotaIva || 22;
      const next = current === 22 ? 10 : current === 10 ? 4 : 22;
      return { ...a, aliquotaIva: next };
    }));
  };

  // Stile badge IVA
  const getIvaBadgeStyle = (aliquota) => {
    if (aliquota === 4) return 'bg-green-100 text-green-700 border-green-300';
    if (aliquota === 10) return 'bg-amber-100 text-amber-700 border-amber-300';
    return 'bg-gray-100 text-gray-400 border-gray-200';
  };

  // Cerca prodotto nel listino Supabase
  const cercaNelListino = async (query) => {
    if (!query || query.trim().length < 2) {
      setListiniSuggerimenti([]);
      setShowListiniDropdown(false);
      return;
    }
    setListiniLoading(true);
    try {
      const { data, error } = await supabase
        .from('listini')
        .select('descrizione, brand, codice, confezione, prezzo_a, prezzo_b, prezzo_c, prezzo_d, iva, prezzo_promo, promo_dal, promo_al')
        .ilike('descrizione', `%${query.trim()}%`)
        .limit(8);
      if (error) throw error;
      setListiniSuggerimenti(data || []);
      setShowListiniDropdown((data || []).length > 0);
    } catch (e) {
      console.error('Errore ricerca listino:', e);
      setListiniSuggerimenti([]);
      setShowListiniDropdown(false);
    } finally {
      setListiniLoading(false);
    }
  };

  // Compila nome e IVA; se più fasce disponibili le mostra per scelta, altrimenti compila prezzo_a direttamente
  const selezionaDaListino = (prodotto) => {
    const ivaRaw = prodotto.iva;
    const iva = ivaRaw == null ? 22 : ivaRaw < 1 ? Math.round(ivaRaw * 100) : Math.round(ivaRaw);
    const nome = `${prodotto.descrizione}${prodotto.confezione ? ' ' + prodotto.confezione : ''}`;

    const promoAttiva = isPromoAttiva(prodotto);

    const fasce = [
      // Se c'è promo attiva, inseriscila come prima voce speciale
      promoAttiva && { label: '🏷️ PROMO', prezzo: prodotto.prezzo_promo, isPromo: true },
      prodotto.prezzo_a != null && { label: 'A', prezzo: prodotto.prezzo_a },
      prodotto.prezzo_b != null && { label: 'B', prezzo: prodotto.prezzo_b },
      prodotto.prezzo_c != null && { label: 'C', prezzo: prodotto.prezzo_c },
      prodotto.prezzo_d != null && { label: 'D', prezzo: prodotto.prezzo_d },
    ].filter(Boolean);

    setListiniSuggerimenti([]);
    setShowListiniDropdown(false);

    if (fasce.length > 1) {
      // Più fasce: compila nome e IVA, mostra pulsanti scelta prezzo
      setNewAccessorio(prev => ({ ...prev, nome, prezzo: '', aliquotaIva: iva }));
      setFasceProdottoListino(fasce);
    } else {
      // Fascia unica (o promo unica): compila tutto direttamente
      const prezzo = fasce.length === 1 ? fasce[0].prezzo.toString() : '';
      setNewAccessorio(prev => ({ ...prev, nome, prezzo, aliquotaIva: iva }));
      setFasceProdottoListino([]);
    }
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
      quantita: parseInt(newAccessorio.quantita) || 1,
      matricola: newAccessorio.matricola?.trim() || null,
      aliquotaIva: newAccessorio.aliquotaIva || 22
    }]);
    setNewAccessorio({ nome: '', prezzo: '', quantita: '1', matricola: '', aliquotaIva: 22 });
    setFasceProdottoListino([]);
  };

  const handleRemoveAccessorio = (id) => {
    setAccessori(accessori.filter(a => a.id !== id));
  };
  
  // Apri modifica accessorio
  const handleEditAccessorio = (acc) => {
    setEditingAccessorio(acc.id);
    setEditAccessorioData({ nome: acc.nome, prezzo: acc.prezzo.toString(), quantita: (acc.quantita || 1).toString(), matricola: acc.matricola || '' });
  };
  
  // Salva modifica accessorio
  const handleSaveAccessorio = () => {
    if (!editAccessorioData.nome.trim()) {
      alert('Inserisci la descrizione!');
      return;
    }
    
    setAccessori(accessori.map(a => 
      a.id === editingAccessorio 
        ? { ...a, nome: editAccessorioData.nome.trim(), prezzo: parseFloat(editAccessorioData.prezzo) || 0, quantita: parseInt(editAccessorioData.quantita) || 1, matricola: editAccessorioData.matricola?.trim() || null }
        : a
    ));
    
    setEditingAccessorio(null);
    setEditAccessorioData({ nome: '', prezzo: '', quantita: '1', matricola: '' });
  };

  const hasOrderedProducts = prodotti.some(p => p.isOrdered === true);

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
    if (totale <= 0 && !prodotti.every(p => p.isOmaggio) && tipoOperazione === 'vendita') {
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
        isOrdered: p.isOrdered,
        aliquotaIva: p.aliquotaIva || 22
      })),
      accessori: accessori,
      totale: totale,
      caparra: caparraValue > 0 ? caparraValue : null,
      metodoPagamento: caparraValue > 0 ? metodoPagamento : null,
      note: note.trim() || null,
      tipoDocumento: tipoDocumento,
      tipoOperazione: tipoOperazione,
      dataVendita: dataVendita,
      isPending: hasOrderedProducts,
      isPreventivo: isPreventivo,
      ivaCompresa: ivaCompresa
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
    if (isSaving) return; // Previeni doppio click
    setIsSaving(true);
    
    try {
      const nomeCliente = cliente.trim();
      const nomeOperatore = operatore.trim();
      const totale = getTotaleFinale();
      const caparraValue = parseFloat(caparra) || 0;
      
      // Se è un preventivo, non salva nulla
      if (isPreventivo) {
        setCommissioneData({ ...commissioneData, confirmed: true, isPreventivo: true });
        return;
      }
      
      if (hasOrderedProducts) {
        const commissione = await createCommissione({
          cliente: nomeCliente, clienteInfo: clienteSelezionato,
          telefono: telefonoCliente.trim() || null, operatore: nomeOperatore,
          prodotti: prodotti.map(p => ({ brand: p.brand, model: p.model, serialNumber: p.serialNumber || null, prezzo: p.prezzo, isOmaggio: p.isOmaggio, aliquotaIva: p.aliquotaIva || 22 })),
          accessori, totale, caparra: caparraValue > 0 ? caparraValue : null,
          metodoPagamento: caparraValue > 0 ? metodoPagamento : null,
          note: note.trim() || null, tipoDocumento
        });
        setCommissioneData({ ...commissione, isPending: true, confirmed: true });
        return;
      }

      const dataISO = (() => {
        const today = new Date().toISOString().split('T')[0];
        if (dataVendita === today) {
          // Oggi: usa ora reale per ordinamento corretto
          return new Date().toISOString();
        }
        // Data passata (backdate): usa mezzogiorno
        const d = new Date(dataVendita + 'T12:00:00');
        return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
      })();
      
      // Scarica inventario per ogni prodotto con matricola
      for (const prod of prodotti) {
        if (prod.serialNumber) {
          try {
            await dischargeInventory(prod.serialNumber, nomeCliente);
          } catch (e) {
            console.warn('Inventario non scaricato per SN:', prod.serialNumber, e);
          }
        }
      }
      
      // La commissione è l'unica fonte di verità
      const commissione = await createCommissione({
        cliente: nomeCliente, clienteInfo: clienteSelezionato,
        telefono: telefonoCliente.trim() || null, operatore: nomeOperatore,
        prodotti: prodotti.map(p => ({ brand: p.brand, model: p.model, serialNumber: p.serialNumber, prezzo: p.prezzo, isOmaggio: p.isOmaggio, aliquotaIva: p.aliquotaIva || 22 })),
        accessori, totale, caparra: caparraValue > 0 ? caparraValue : null,
        metodoPagamento: caparraValue > 0 ? metodoPagamento : null,
        note: note.trim() || null, tipoDocumento, ivaCompresa,
        dataVendita: dataISO
      });
      setCommissioneData({ ...commissione, confirmed: true, ivaCompresa });
    } catch (error) {
      console.error('Errore conferma commissione:', error);
      alert('⚠️ Errore durante il salvataggio della vendita. Riprova.');
      // NON settiamo confirmed: true — la vendita non è stata salvata
    } finally {
      setIsSaving(false);
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
    setIvaCompresa(false);
    setDataVendita(new Date().toISOString().split('T')[0]);
    setShowCommissione(false);
    setCommissioneData(null);
    setOcrRighe([]);
    setOcrPreview(null);
    setScanResult(null);
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
        isSaving={isSaving}
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
                <div className="flex-1">
                  <span>{m.testo}</span>
                  {m.matricola && <span className="text-xs text-gray-400 ml-1 font-mono">({m.matricola})</span>}
                </div>
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
              <div className="flex items-center gap-2">
                {scanResult?.success && ocrRighe.length > 0 && (
                  <button
                    onClick={() => setShowOcrReview(true)}
                    className="text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded px-2 py-1 hover:bg-blue-100"
                  >
                    ✏️ Modifica OCR
                  </button>
                )}
                <button 
                  onClick={() => setScanResult(null)}
                  className="opacity-50 hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pulsante Modifica OCR persistente (visibile anche dopo dismiss del banner) */}
      {!ocrPreview && !scanResult && !scanningCommissione && ocrRighe.length > 0 && (
        <div className="mx-4 mt-2">
          <button
            onClick={() => setShowOcrReview(true)}
            className="text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 hover:bg-blue-100 flex items-center gap-1"
          >
            ✏️ Modifica dati OCR
          </button>
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
          <div className="relative mt-1">
            <input
              type="text"
              placeholder="Cerca cliente..."
              className="w-full p-2 pr-20 border rounded-lg"
              value={cliente}
              onChange={(e) => handleClienteChange(e.target.value)}
              onFocus={() => suggerimenti.length > 0 && setShowSuggerimenti(true)}
            />
            <button
              onClick={handleAprirNuovoCliente}
              className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs px-2 py-1.5 rounded-md text-white font-medium"
              style={{ backgroundColor: '#006B3F' }}
              title="Inserisci cliente manualmente o scansiona documento"
            >
              <Plus className="w-3 h-3" /> Nuovo
            </button>
          </div>
          
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
                    <button 
                      onClick={() => cycleIvaProdotto(prod.id)}
                      className={`text-xs px-1.5 py-0.5 rounded border font-medium ${getIvaBadgeStyle(prod.aliquotaIva || 22)}`}
                      title="Tocca per cambiare aliquota IVA"
                    >
                      {prod.aliquotaIva || 22}%
                    </button>
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
                    <div className="p-2 bg-blue-50 rounded border border-blue-200 space-y-2">
                      <div className="flex gap-2">
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
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Matricola (opzionale)"
                          className="flex-1 p-2 border rounded text-sm font-mono"
                          value={editAccessorioData.matricola}
                          onChange={(e) => setEditAccessorioData({ ...editAccessorioData, matricola: e.target.value })}
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
                    </div>
                  ) : (
                    <div className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded text-sm">
                      <div className="flex-1 min-w-0">
                        <span className="truncate block">
                          {acc.quantita > 1 && <span className="font-medium text-blue-600 mr-1">{acc.quantita}x</span>}
                          {acc.nome}
                        </span>
                        {acc.matricola && (
                          <span className="text-xs text-gray-500 font-mono block truncate">SN: {acc.matricola}</span>
                        )}
                      </div>
                      <button 
                        onClick={() => cycleIvaAccessorio(acc.id)}
                        className={`text-xs px-1.5 py-0.5 rounded border font-medium mx-1 shrink-0 ${getIvaBadgeStyle(acc.aliquotaIva || 22)}`}
                        title="Tocca per cambiare aliquota IVA"
                      >
                        {acc.aliquotaIva || 22}%
                      </button>
                      <span className="text-gray-600 mx-1 shrink-0">
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
          
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Descrizione"
                  className="w-full p-2 border rounded-lg text-sm"
                  value={newAccessorio.nome}
                  onChange={(e) => {
                    setNewAccessorio({ ...newAccessorio, nome: e.target.value });
                    setFasceProdottoListino([]);
                    cercaNelListino(e.target.value);
                  }}
                  onBlur={() => setTimeout(() => setShowListiniDropdown(false), 150)}
                  onFocus={() => { if (listiniSuggerimenti.length > 0) setShowListiniDropdown(true); }}
                />
                {showListiniDropdown && (
                  <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                    {listiniLoading && (
                      <div className="px-3 py-2 text-xs text-gray-400">Ricerca...</div>
                    )}
                    {listiniSuggerimenti.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onMouseDown={() => selezionaDaListino(p)}
                        className={`w-full text-left px-3 py-2 hover:bg-green-50 border-b last:border-0 border-gray-100 ${isPromoAttiva(p) ? 'bg-orange-50 hover:bg-orange-100' : ''}`}
                      >
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-sm font-medium text-gray-800 truncate">
                            {p.descrizione}{p.confezione ? ` ${p.confezione}` : ''}
                          </span>
                          {isPromoAttiva(p) && (
                            <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-orange-500 text-white shrink-0">🏷️ PROMO</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {p.brand && <span className="text-xs text-gray-400">{p.brand}</span>}
                          {isPromoAttiva(p) ? (
                            <>
                              <span className="text-xs font-bold text-orange-600">€{p.prezzo_promo.toFixed(2)}</span>
                              {p.prezzo_a != null && <span className="text-xs text-gray-400 line-through">€{p.prezzo_a.toFixed(2)}</span>}
                            </>
                          ) : (
                            p.prezzo_a != null && <span className="text-xs font-semibold text-green-700">€{p.prezzo_a.toFixed(2)}</span>
                          )}
                          {p.iva != null && (
                            <span className={`text-xs px-1 py-0.5 rounded border font-medium ${
                              (p.iva < 1 ? Math.round(p.iva * 100) : Math.round(p.iva)) === 4 ? 'bg-green-100 text-green-700 border-green-300' :
                              (p.iva < 1 ? Math.round(p.iva * 100) : Math.round(p.iva)) === 10 ? 'bg-amber-100 text-amber-700 border-amber-300' :
                              'bg-gray-100 text-gray-400 border-gray-200'
                            }`}>
                              IVA {p.iva < 1 ? Math.round(p.iva * 100) : Math.round(p.iva)}%
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
            {/* Pulsanti selezione fascia prezzo */}
            {fasceProdottoListino.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs text-gray-500 self-center">Scegli fascia:</span>
                {fasceProdottoListino.map((fascia) => (
                  <button
                    key={fascia.label}
                    type="button"
                    onClick={() => {
                      setNewAccessorio(prev => ({ ...prev, prezzo: fascia.prezzo.toString() }));
                      setFasceProdottoListino([]);
                    }}
                    className={`px-3 py-1.5 rounded-lg border-2 text-sm font-semibold ${
                      fascia.isPromo
                        ? 'border-orange-500 text-orange-700 bg-orange-50 hover:bg-orange-100 active:bg-orange-200'
                        : 'border-green-500 text-green-700 hover:bg-green-50 active:bg-green-100'
                    }`}
                  >
                    {fascia.label} · €{fascia.prezzo.toFixed(2)}
                  </button>
                ))}
              </div>
            )}
            {newAccessorio.nome && (
              <input
                type="text"
                placeholder="Matricola (opzionale)"
                className="w-full p-2 border rounded-lg text-sm font-mono"
                value={newAccessorio.matricola}
                onChange={(e) => setNewAccessorio({ ...newAccessorio, matricola: e.target.value })}
              />
            )}
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
          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={ivaCompresa}
              onChange={(e) => setIvaCompresa(e.target.checked)}
              className="w-4 h-4 accent-green-600 rounded"
            />
            <span className="text-sm text-gray-600">I.C. (IVA compresa)</span>
          </label>
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
              <option value="pos">POS</option>
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

          {/* Checkbox Reso / Cambio */}
          <label className="flex items-center gap-3 mt-2 p-3 bg-red-50 rounded-lg cursor-pointer border-2 border-transparent hover:border-red-300 transition-all">
            <input
              type="checkbox"
              checked={tipoOperazione !== 'vendita'}
              onChange={(e) => setTipoOperazione(e.target.checked ? 'reso' : 'vendita')}
              className="w-5 h-5 accent-red-500"
            />
            <div className="flex-1">
              <span className="font-medium text-red-800">Reso / Cambio merce</span>
              <p className="text-xs text-red-600">Permette importi a zero o negativi</p>
            </div>
          </label>

          {/* Toggle Reso / Cambio */}
          {tipoOperazione !== 'vendita' && (
            <div className="flex gap-2 mt-1 px-1">
              <button
                onClick={() => setTipoOperazione('reso')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                  tipoOperazione === 'reso'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-red-600 border-red-300'
                }`}
              >
                🔄 Reso
              </button>
              <button
                onClick={() => setTipoOperazione('cambio')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                  tipoOperazione === 'cambio'
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-orange-500 border-orange-300'
                }`}
              >
                🔃 Cambio
              </button>
            </div>
          )}
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
            backgroundColor: isPreventivo ? '#F97316' : tipoOperazione !== 'vendita' ? '#DC2626' : '#FFDD00', 
            color: isPreventivo || tipoOperazione !== 'vendita' ? 'white' : '#006B3F' 
          }}
        >
          {isPreventivo 
            ? '📝 ANTEPRIMA PREVENTIVO'
            : tipoOperazione === 'reso'
              ? '🔄 ANTEPRIMA RESO'
              : tipoOperazione === 'cambio'
                ? '🔃 ANTEPRIMA CAMBIO'
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
              <button
                onClick={() => setAddMode('diretto')}
                className={`flex-1 py-3 text-sm font-medium ${
                  addMode === 'diretto' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
                }`}
              >
                ✏️ Diretto
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
                      <div className="flex items-center justify-between gap-2">
                        <span>⚠️ {ocrError}</span>
                        {ocrError.includes('non in magazzino') && (
                          <button
                            onClick={() => {
                              setAutoAddData({
                                brand: '',
                                model: '',
                                serialNumber: searchQuery.trim().toUpperCase(),
                                tipo: ''
                              });
                              setShowAutoAdd(true);
                            }}
                            className="shrink-0 text-xs font-bold px-2 py-1 rounded text-white"
                            style={{ backgroundColor: '#006B3F' }}
                          >
                            + Aggiungi
                          </button>
                        )}
                      </div>
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
              ) : addMode === 'ordine' ? (
                <div className="space-y-3">
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                    ⏳ Matricola da aggiungere alla consegna
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Brand *</label>
                    <input
                      type="text"
                      list="order-brand-list"
                      placeholder="Seleziona o digita il brand..."
                      className="w-full p-2 border rounded-lg mt-1"
                      value={orderBrand}
                      onChange={(e) => setOrderBrand(e.target.value)}
                    />
                    <datalist id="order-brand-list">
                      {brands.map(b => (
                        <option key={b} value={b} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Tipo macchina *</label>
                    <input
                      type="text"
                      list="order-tipo-list"
                      placeholder="Seleziona o digita il tipo..."
                      className="w-full p-2 border rounded-lg mt-1"
                      value={orderTipo}
                      onChange={(e) => setOrderTipo(e.target.value)}
                    />
                    <datalist id="order-tipo-list">
                      {tipiMacchina.filter(t => t !== 'Altro').map(tipo => (
                        <option key={tipo} value={tipo} />
                      ))}
                    </datalist>
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
              ) : (
                <div className="space-y-3">
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                    ✏️ Inserisci i dati a mano. Se la matricola è in magazzino, brand e modello si compilano da soli.
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Matricola (opzionale)</label>
                    <input
                      type="text"
                      placeholder="Es: EC016812024"
                      className="w-full p-2 border rounded-lg mt-1 font-mono uppercase"
                      value={directSerial}
                      onChange={(e) => setDirectSerial(e.target.value.toUpperCase())}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Brand *</label>
                    <input
                      type="text"
                      list="direct-brand-list"
                      placeholder="Es: Stihl, Honda..."
                      className="w-full p-2 border rounded-lg mt-1"
                      value={directBrand}
                      onChange={(e) => setDirectBrand(e.target.value)}
                    />
                    <datalist id="direct-brand-list">
                      {brands.map(b => (
                        <option key={b} value={b} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Modello</label>
                    <input
                      type="text"
                      placeholder="Es: MS 231, HRX 476..."
                      className="w-full p-2 border rounded-lg mt-1"
                      value={directModel}
                      onChange={(e) => setDirectModel(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Prezzo (lascia vuoto se fa parte di un KIT)</label>
                    <input
                      type="number"
                      placeholder="Vuoto = parte del kit"
                      className="w-full p-2 border rounded-lg mt-1"
                      value={directPrice}
                      onChange={(e) => setDirectPrice(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              {addMode === 'magazzino' ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleConfirmProduct}
                    disabled={!selectedProduct}
                    className="flex-1 py-3 rounded-lg font-bold border-2 disabled:opacity-50"
                    style={{ borderColor: '#006B3F', color: '#006B3F' }}
                  >
                    + Aggiungi un altro
                  </button>
                  <button
                    onClick={handleConfirmProductAndClose}
                    disabled={!selectedProduct}
                    className="flex-1 py-3 rounded-lg font-bold text-white disabled:opacity-50"
                    style={{ backgroundColor: '#006B3F' }}
                  >
                    + AGGIUNGI
                  </button>
                </div>
              ) : addMode === 'ordine' ? (
                <button
                  onClick={handleAddOrderProduct}
                  disabled={!orderBrand.trim() || !orderTipo.trim() || !orderModel.trim()}
                  className="w-full py-3 rounded-lg font-bold text-white bg-yellow-500 disabled:opacity-50"
                >
                  + AGGIUNGI IN ORDINE
                </button>
              ) : (
                <button
                  onClick={handleAddDirectProduct}
                  disabled={!directBrand.trim() || directAdding}
                  className="w-full py-3 rounded-lg font-bold text-white disabled:opacity-50"
                  style={{ backgroundColor: '#3b82f6' }}
                >
                  {directAdding ? '⏳ Aggiungo...' : '+ AGGIUNGI'}
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
                  riga.campo === 'matricola' ? 'bg-emerald-50 border-emerald-300' :
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
                        className="shrink-0 w-7 h-7 flex items-center justify-center text-blue-500 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 active:bg-blue-200 text-base font-bold"
                        title="Unisci con riga sopra"
                      >
                        ↑
                      </button>
                    )}
                    {ocrRighe.indexOf(riga) === 0 && (
                      <div className="shrink-0 w-7" />
                    )}
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={riga.testo}
                        onChange={(e) => handleOcrTestoChange(riga.id, e.target.value)}
                        className="w-full text-sm font-medium bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                      />
                      {riga.brand && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-xs text-green-600">Brand:</span>
                          <input
                            type="text"
                            value={riga.brand}
                            onChange={(e) => {
                              const newBrand = e.target.value;
                              setOcrRighe(prev => prev.map(r => r.id === riga.id ? { ...r, brand: newBrand } : r));
                            }}
                            className="text-xs text-green-700 font-medium bg-green-50 border border-green-200 rounded px-1.5 py-0.5 w-24 focus:outline-none focus:ring-1 focus:ring-green-300"
                          />
                          <button
                            onClick={() => setOcrRighe(prev => prev.map(r => r.id === riga.id ? { ...r, brand: '' } : r))}
                            className="text-xs text-red-400 hover:text-red-600"
                            title="Rimuovi brand"
                          >✕</button>
                        </div>
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
                      <option value="matricola">Matricola</option>
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
                onClick={() => setShowOcrReview(false)}
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

      {/* MODALE Auto-carico macchina non trovata */}
      {showAutoAdd && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg">📦 Macchina non in magazzino</h3>
              <button onClick={() => setShowAutoAdd(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-sm text-yellow-800">
                Questa macchina non risulta caricata. Compila i dati e verrà aggiunta automaticamente al magazzino prima di procedere con la vendita. Sarà segnata come <strong>carico automatico</strong> per un controllo successivo.
              </div>

              <div>
                <label className="text-xs text-gray-500">Matricola</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg mt-1 font-mono bg-gray-50"
                  value={autoAddData.serialNumber}
                  onChange={(e) => setAutoAddData(p => ({ ...p, serialNumber: e.target.value.toUpperCase() }))}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Brand *</label>
                <input
                  type="text"
                  list="auto-add-brand-list"
                  placeholder="Es: Stihl, Honda..."
                  className="w-full p-2 border rounded-lg mt-1"
                  value={autoAddData.brand}
                  onChange={(e) => setAutoAddData(p => ({ ...p, brand: e.target.value }))}
                />
                <datalist id="auto-add-brand-list">
                  {brands.map(b => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="text-xs text-gray-500">Tipo macchina</label>
                <select
                  className="w-full p-2 border rounded-lg mt-1"
                  value={autoAddData.tipo}
                  onChange={(e) => setAutoAddData(p => ({ ...p, tipo: e.target.value }))}
                >
                  <option value="">-- Non specificato --</option>
                  {['Motosega','Decespugliatore','Tagliabordi','Tagliasiepi','Soffiatore',
                    'Aspiratore','Tosaerba','Robot tosaerba','Trattorino','Biotrituratore',
                    'Idropulitrice','Motozappa','Arieggiatore','Troncatrice','Atomizzatore',
                    'Irroratore','Sramatore','Potatore','Trivella','Spazzatrice',
                    'Motocoltivatore','Forbice elettronica','Motore multifunzione','Altro'
                  ].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500">Modello</label>
                <input
                  type="text"
                  placeholder="Es: MS 231, HRX 476..."
                  className="w-full p-2 border rounded-lg mt-1"
                  value={autoAddData.model}
                  onChange={(e) => setAutoAddData(p => ({ ...p, model: e.target.value }))}
                />
              </div>
            </div>
            <div className="p-4 border-t flex gap-2">
              <button
                onClick={() => setShowAutoAdd(false)}
                className="flex-1 py-3 rounded-lg border-2 border-gray-300 text-gray-600 font-semibold"
              >
                Annulla
              </button>
              <button
                onClick={handleAutoAdd}
                disabled={!autoAddData.brand.trim() || !autoAddData.serialNumber.trim() || autoAdding}
                className="flex-[2] py-3 rounded-lg text-white font-bold disabled:opacity-50"
                style={{ backgroundColor: '#006B3F' }}
              >
                {autoAdding ? '⏳ Carico in corso...' : '✓ Aggiungi e continua'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE Nuovo Cliente */}
      {showNuovoCliente && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <User className="w-5 h-5" style={{ color: '#006B3F' }} />
                Nuovo Cliente
              </h3>
              <button onClick={() => setShowNuovoCliente(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {/* Pulsante scansione documento */}
              <div className="flex gap-2">
                <label className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed cursor-pointer font-medium text-sm transition-colors ${
                  scanningDocumento
                    ? 'border-gray-300 text-gray-400 bg-gray-50'
                    : 'border-green-400 text-green-700 bg-green-50 hover:bg-green-100'
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleScanDocumento}
                    disabled={scanningDocumento}
                    className="hidden"
                  />
                  {scanningDocumento ? (
                    <>
                      <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                      Lettura documento...
                    </>
                  ) : (
                    <>📷 Scansiona Documento</>
                  )}
                </label>
                <label className={`flex items-center justify-center gap-1 px-3 py-3 rounded-xl border-2 border-dashed cursor-pointer text-sm transition-colors ${
                  scanningDocumento
                    ? 'border-gray-300 text-gray-400'
                    : 'border-blue-300 text-blue-600 bg-blue-50 hover:bg-blue-100'
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScanDocumento}
                    disabled={scanningDocumento}
                    className="hidden"
                  />
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-xs">Gallery</span>
                </label>
              </div>

              <p className="text-xs text-gray-400 text-center -mt-1">
                Scansiona carta d'identità, patente o permesso di soggiorno per compilare automaticamente
              </p>

              {/* Divider */}
              <div className="flex items-center gap-2 py-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">oppure inserisci manualmente</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Form campi */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 font-medium">Cognome *</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2 mt-1 text-sm"
                    placeholder="Rossi"
                    value={nuovoClienteForm.cognome}
                    onChange={e => setNuovoClienteForm(p => ({ ...p, cognome: e.target.value }))}
                    autoCapitalize="words"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Nome *</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2 mt-1 text-sm"
                    placeholder="Mario"
                    value={nuovoClienteForm.nome}
                    onChange={e => setNuovoClienteForm(p => ({ ...p, nome: e.target.value }))}
                    autoCapitalize="words"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium">Indirizzo</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2 mt-1 text-sm"
                  placeholder="Via Roma 10"
                  value={nuovoClienteForm.indirizzo}
                  onChange={e => setNuovoClienteForm(p => ({ ...p, indirizzo: e.target.value }))}
                  autoCapitalize="words"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-500 font-medium">CAP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="w-full border rounded-lg p-2 mt-1 text-sm"
                    placeholder="31100"
                    maxLength={5}
                    value={nuovoClienteForm.cap}
                    onChange={e => setNuovoClienteForm(p => ({ ...p, cap: e.target.value }))}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 font-medium">Città</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2 mt-1 text-sm"
                    placeholder="Treviso"
                    value={nuovoClienteForm.localita}
                    onChange={e => setNuovoClienteForm(p => ({ ...p, localita: e.target.value }))}
                    autoCapitalize="words"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium">Provincia</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2 mt-1 text-sm uppercase"
                  placeholder="TV"
                  maxLength={2}
                  value={nuovoClienteForm.provincia}
                  onChange={e => setNuovoClienteForm(p => ({ ...p, provincia: e.target.value.toUpperCase() }))}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Telefono
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  className="w-full border rounded-lg p-2 mt-1 text-sm"
                  placeholder="340 1234567"
                  value={nuovoClienteForm.telefono}
                  onChange={e => setNuovoClienteForm(p => ({ ...p, telefono: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium">Email</label>
                <input
                  type="email"
                  inputMode="email"
                  className="w-full border rounded-lg p-2 mt-1 text-sm"
                  placeholder="mario@email.com"
                  value={nuovoClienteForm.email}
                  onChange={e => setNuovoClienteForm(p => ({ ...p, email: e.target.value }))}
                  autoCapitalize="none"
                />
              </div>

              {/* Anteprima nome che verrà usato */}
              {(nuovoClienteForm.cognome || nuovoClienteForm.nome) && (
                <div className="p-2 rounded-lg bg-green-50 border border-green-200 text-sm">
                  <span className="text-gray-500 text-xs">Verrà salvato come: </span>
                  <span className="font-bold text-green-800">
                    {[nuovoClienteForm.cognome, nuovoClienteForm.nome].filter(Boolean).join(' ')}
                  </span>
                </div>
              )}

              {/* Azioni */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowNuovoCliente(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium text-sm"
                >
                  Annulla
                </button>
                <button
                  onClick={handleConfermaClienteManuale}
                  className="flex-[2] py-3 rounded-xl text-white font-bold text-sm"
                  style={{ backgroundColor: '#006B3F' }}
                >
                  ✓ Conferma Cliente
                </button>
              </div>
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
