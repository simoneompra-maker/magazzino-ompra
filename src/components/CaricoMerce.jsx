import { useState, useEffect } from 'react';
import { ArrowLeft, Camera, Plus, Trash2, Package, CheckCircle, X, Edit2, Image, AlertCircle, AlertTriangle } from 'lucide-react';
import useStore from '../store';
import { scanMatricola, checkRateLimitStatus } from '../services/ocrService';

// Categorie prodotto per il dropdown Tipo
const TIPI_PRODOTTO = [
  'Motosega', 'Decespugliatore', 'Tagliabordi', 'Tagliasiepi', 'Soffiatore',
  'Aspiratore', 'Tosaerba', 'Robot tosaerba', 'Trattorino', 'Biotrituratore',
  'Idropulitrice', 'Motozappa', 'Arieggiatore', 'Troncatrice', 'Atomizzatore',
  'Irroratore', 'Sramatore', 'Potatore', 'Trivella', 'Spazzatrice', 'Pompa acqua',
  'Motocoltivatore', 'Forbice elettronica', 'Motore multifunzione', 'Batteria',
  'Caricabatterie', 'Altro'
];

// Gestione brand personalizzati
const CUSTOM_BRANDS_KEY = 'ompra_custom_brands';

// Magazzini
const MAGAZZINI_DEFAULT = ['Sede', 'Coz'];
const CUSTOM_LOCATIONS_KEY = 'ompra_custom_locations';

function getCustomLocations() {
  try {
    const stored = localStorage.getItem(CUSTOM_LOCATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function saveCustomLocation(mag) {
  const custom = getCustomLocations();
  const norm = mag.trim();
  if (norm && !MAGAZZINI_DEFAULT.includes(norm) && !custom.includes(norm)) {
    custom.push(norm);
    custom.sort();
    localStorage.setItem(CUSTOM_LOCATIONS_KEY, JSON.stringify(custom));
  }
}

function parseLocation(loc) {
  if (!loc || loc === 'main') return { magazzino: '', postazione: '' };
  const parts = loc.split(' | ');
  return { magazzino: parts[0] || '', postazione: parts[1] || '' };
}

function formatLocation(magazzino, postazione) {
  const mag = magazzino.trim();
  const pos = postazione.trim();
  if (!mag) return '';
  return pos ? `${mag} | ${pos}` : mag;
}

function getCustomBrands() {
  try {
    const stored = localStorage.getItem(CUSTOM_BRANDS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCustomBrand(brand) {
  const customBrands = getCustomBrands();
  const brandNorm = brand.trim();
  if (brandNorm && !customBrands.includes(brandNorm)) {
    customBrands.push(brandNorm);
    customBrands.sort();
    localStorage.setItem(CUSTOM_BRANDS_KEY, JSON.stringify(customBrands));
  }
}

export default function CaricoMerce({ onNavigate }) {
  const bulkAddInventory = useStore((state) => state.bulkAddInventory);
  const brands = useStore((state) => state.brands);

  // Lista prodotti da caricare
  const [prodotti, setProdotti] = useState([]);
  
  // Modal inserimento
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('manual'); // 'manual' | 'ocr' | 'preview'
  const [editingProductId, setEditingProductId] = useState(null);
  
  // Campi form
  const [formBrand, setFormBrand] = useState('');
  const [formTipo, setFormTipo] = useState('');
  const [formTipoAltro, setFormTipoAltro] = useState('');
  const [formModel, setFormModel] = useState('');
  const [formSerial, setFormSerial] = useState('');
  const [formMagazzino, setFormMagazzino] = useState('Sede');
  const [formMagazzinoCustom, setFormMagazzinoCustom] = useState('');
  const [formPostazione, setFormPostazione] = useState('');

  // Lista brand combinata (standard + custom)
  const [allBrands, setAllBrands] = useState([]);
  const [allMagazzini, setAllMagazzini] = useState([...MAGAZZINI_DEFAULT]);

  // Carica brand e magazzini all'avvio
  useEffect(() => {
    const customBrands = getCustomBrands();
    const standardBrands = brands.filter(b => b !== 'Altro');
    const combined = [...new Set([...standardBrands, ...customBrands])].sort();
    setAllBrands(combined);
  }, [brands]);

  useEffect(() => {
    const custom = getCustomLocations();
    setAllMagazzini([...new Set([...MAGAZZINI_DEFAULT, ...custom])].sort());
  }, []);
  
  // OCR
  const [scanning, setScanning] = useState(false);
  const [scanPreview, setScanPreview] = useState(null);
  const [ocrError, setOcrError] = useState(null);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);

  // Controlla rate limit all'avvio
  useEffect(() => {
    const info = checkRateLimitStatus();
    setRateLimitInfo(info);
  }, []);

  // OCR Scansione
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    event.target.value = '';

    setScanning(true);
    setOcrError(null);
    setScanPreview(URL.createObjectURL(file));

    try {
      const result = await scanMatricola(file);
      
      // Aggiorna rate limit info
      const info = checkRateLimitStatus();
      setRateLimitInfo(info);
      
      if (result.success || result.matricola) {
        setFormBrand(result.brand || '');
        setFormModel(result.modello || '');
        setFormSerial(result.matricola || '');
        if (result.matricolaIncompleta) {
          setOcrError('⚠️ Honda: trovati solo i numeri finali. Cerca la matricola completa (4 lettere + 7 cifre) sotto il codice a barre in alto sull\'etichetta.');
        }
        setModalMode('preview');
      } else {
        setOcrError(result.error || 'Non riesco a leggere. Inserisci manualmente.');
        setModalMode('manual');
      }
    } catch (error) {
      setOcrError('Errore durante scansione. Inserisci manualmente.');
      setModalMode('manual');
    } finally {
      setScanning(false);
    }
  };

  // Ottieni il tipo finale (dalla selezione o dal campo "Altro")
  const getTipoFinale = () => {
    if (formTipo === 'Altro' && formTipoAltro.trim()) {
      return formTipoAltro.trim();
    }
    return formTipo || null;
  };

  // Ottieni il magazzino finale (dalla selezione o dal campo custom)
  const getMagazzinoFinale = () => {
    if (formMagazzino === 'altro') return formMagazzinoCustom.trim() || null;
    return formMagazzino.trim() || null;
  };

  // Conferma e aggiungi alla lista
  const handleConfirmAdd = () => {
    if (!formBrand.trim()) {
      alert('Inserisci un brand!');
      return;
    }
    if (!formTipo) {
      alert('Seleziona un tipo di macchina!');
      return;
    }
    if (formTipo === 'Altro' && !formTipoAltro.trim()) {
      alert('Inserisci il tipo di macchina!');
      return;
    }
    if (!formModel.trim()) {
      alert('Inserisci il modello!');
      return;
    }
    if (!formSerial.trim()) {
      alert('Inserisci la matricola!');
      return;
    }

    // Controlla duplicati (escludi l'articolo in modifica)
    const serialNorm = formSerial.trim().toUpperCase();
    if (prodotti.find(p => p.serialNumber === serialNorm && p.id !== editingProductId)) {
      alert('Matricola già presente nella lista!');
      return;
    }

    // Normalizza brand
    let brandNorm = formBrand.trim();
    if (brandNorm.toLowerCase() === 'yamabiko') {
      brandNorm = 'Echo';
    }
    
    // Se è un brand nuovo, salvalo per riutilizzarlo
    const standardBrands = brands.filter(b => b !== 'Altro');
    if (!standardBrands.includes(brandNorm)) {
      saveCustomBrand(brandNorm);
      // Aggiorna la lista locale
      setAllBrands(prev => [...new Set([...prev, brandNorm])].sort());
    }

    // Salva magazzino custom se nuovo
    const magFinale = getMagazzinoFinale();
    if (magFinale && !MAGAZZINI_DEFAULT.includes(magFinale)) {
      saveCustomLocation(magFinale);
      setAllMagazzini(prev => [...new Set([...prev, magFinale])].sort());
    }

    const updatedProduct = {
      id: editingProductId || Date.now(),
      brand: brandNorm,
      model: `${getTipoFinale()} ${formModel.trim()}`,
      serialNumber: serialNorm,
      tipo: getTipoFinale(),
      location: formatLocation(magFinale || '', formPostazione)
    };

    if (editingProductId) {
      setProdotti(prodotti.map(p => p.id === editingProductId ? updatedProduct : p));
    } else {
      setProdotti([...prodotti, updatedProduct]);
    }

    setShowModal(false);
    setEditingProductId(null);
    setFormModel('');
    setFormSerial('');
    setFormTipo('');
    setFormTipoAltro('');
    setScanPreview(null);
    setOcrError(null);
    // Il brand NON viene resettato: rimane per inserimenti multipli dello stesso marchio
  };

  // Nuova scansione
  const handleNewScan = () => {
    setFormBrand('');
    setFormTipo('');
    setFormTipoAltro('');
    setFormModel('');
    setFormSerial('');
    setScanPreview(null);
    setOcrError(null);
    setModalMode('ocr');
  };

  // Rimuovi prodotto dalla lista
  const handleRemove = (id) => {
    setProdotti(prodotti.filter(p => p.id !== id));
  };

  // Carica tutti in magazzino
  const handleCaricaTutti = async () => {
    if (prodotti.length === 0) {
      alert('Nessun prodotto da caricare!');
      return;
    }

    try {
      const success = await bulkAddInventory(prodotti);
      if (success) {
        alert(`✅ ${prodotti.length} prodotti caricati in magazzino!`);
        setProdotti([]);
        onNavigate('home');
      } else {
        alert('⚠️ Errore durante il caricamento');
      }
    } catch (error) {
      alert('Errore: ' + error.message);
    }
  };

  // Chiudi modal
  const handleCloseModal = () => {
    setShowModal(false);
    setModalMode('manual');
    setEditingProductId(null);
    setFormBrand('');
    setFormTipo('');
    setFormTipoAltro('');
    setFormModel('');
    setFormSerial('');
    setFormMagazzino('Sede');
    setFormMagazzinoCustom('');
    setFormPostazione('');
    setScanPreview(null);
    setOcrError(null);
  };

  // Apri modal (nuovo inserimento)
  const openModal = (mode) => {
    setShowModal(true);
    setModalMode(mode);
    setEditingProductId(null);
    setFormBrand('');
    setFormTipo('');
    setFormTipoAltro('');
    setFormModel('');
    setFormSerial('');
    setScanPreview(null);
    setOcrError(null);
  };

  // Apri modal in modalità modifica (articolo già in lista)
  const openModalForEdit = (prod) => {
    const tiposStandard = TIPI_PRODOTTO.filter(t => t !== 'Altro');
    const tipoIsStandard = tiposStandard.includes(prod.tipo);
    const tipoPrefix = prod.tipo ? prod.tipo + ' ' : '';
    const modelWithoutTipo = prod.model.startsWith(tipoPrefix)
      ? prod.model.slice(tipoPrefix.length)
      : prod.model;

    const loc = parseLocation(prod.location);
    const magIsKnown = allMagazzini.includes(loc.magazzino);

    setShowModal(true);
    setModalMode('manual');
    setEditingProductId(prod.id);
    setFormBrand(prod.brand);
    setFormTipo(tipoIsStandard ? prod.tipo : (prod.tipo ? 'Altro' : ''));
    setFormTipoAltro(tipoIsStandard ? '' : (prod.tipo || ''));
    setFormModel(modelWithoutTipo);
    setFormSerial(prod.serialNumber);
    setFormMagazzino(magIsKnown ? loc.magazzino : (loc.magazzino ? 'altro' : 'Sede'));
    setFormMagazzinoCustom(magIsKnown ? '' : loc.magazzino);
    setFormPostazione(loc.postazione);
    setScanPreview(null);
    setOcrError(null);
  };

  // Campo Magazzino + Postazione
  const MagazzinoField = () => (
    <div className="space-y-2">
      <div>
        <label className="text-xs text-gray-500">Magazzino</label>
        <select
          className="w-full p-3 border rounded-lg mt-1"
          value={formMagazzino}
          onChange={(e) => {
            setFormMagazzino(e.target.value);
            if (e.target.value !== 'altro') setFormMagazzinoCustom('');
          }}
        >
          {allMagazzini.map(m => <option key={m} value={m}>{m}</option>)}
          <option value="altro">+ Nuovo magazzino...</option>
        </select>
        {formMagazzino === 'altro' && (
          <input
            type="text"
            placeholder="Nome magazzino..."
            className="w-full p-3 border rounded-lg mt-2"
            value={formMagazzinoCustom}
            onChange={(e) => setFormMagazzinoCustom(e.target.value)}
          />
        )}
      </div>
      <div>
        <label className="text-xs text-gray-500">Postazione (opzionale)</label>
        <input
          type="text"
          placeholder="Es: Scaffale A3, Zona esterna..."
          className="w-full p-3 border rounded-lg mt-1"
          value={formPostazione}
          onChange={(e) => setFormPostazione(e.target.value)}
        />
      </div>
    </div>
  );

  // Componente campo Tipo (riutilizzabile per preview e manual)
  const TipoField = () => (
    <div className="space-y-2">
      <div>
        <label className="text-xs text-gray-500">Tipo prodotto (opzionale)</label>
        <select
          className="w-full p-3 border rounded-lg mt-1"
          value={formTipo}
          onChange={(e) => {
            setFormTipo(e.target.value);
            if (e.target.value !== 'Altro') {
              setFormTipoAltro('');
            }
          }}
        >
          <option value="">-- Non specificato --</option>
          {TIPI_PRODOTTO.map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
      </div>
      
      {formTipo === 'Altro' && (
        <div>
          <label className="text-xs text-gray-500">Specifica tipo</label>
          <input
            type="text"
            placeholder="Es: Generatore, Pompa..."
            className="w-full p-3 border rounded-lg mt-1"
            value={formTipoAltro}
            onChange={(e) => setFormTipoAltro(e.target.value)}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div 
        className="p-4 text-white sticky top-0 z-10"
        style={{ backgroundColor: '#006B3F' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => onNavigate('home')} className="mr-3">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Carico Merce</h1>
          </div>
          <div className="flex items-center gap-2">
            {prodotti.length > 0 && (
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {prodotti.length} in lista
              </span>
            )}
          </div>
        </div>
        
        {/* Rate limit info */}
        {rateLimitInfo && (
          <div className="mt-2 text-xs text-white/70">
            📊 Scansioni: {rateLimitInfo.count}/1000
            {rateLimitInfo.blocked && (
              <span className="text-yellow-300 ml-2">
                ⏳ Attendi {rateLimitInfo.remainingMinutes} min
              </span>
            )}
          </div>
        )}
      </div>

      {/* Input file nascosti */}
      <input
        type="file"
        id="ocr-camera"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <input
        type="file"
        id="ocr-gallery"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Pulsanti azione principali */}
      <div className="p-4 bg-white border-b flex gap-3">
        <button
          onClick={() => openModal('ocr')}
          disabled={rateLimitInfo?.blocked}
          className="flex-1 py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ backgroundColor: '#006B3F' }}
        >
          <Camera className="w-5 h-5" />
          Scansiona OCR
        </button>
        
        <button
          onClick={() => openModal('manual')}
          className="flex-1 py-3 rounded-lg font-semibold border-2 flex items-center justify-center gap-2"
          style={{ borderColor: '#006B3F', color: '#006B3F' }}
        >
          <Plus className="w-5 h-5" />
          Manuale
        </button>
      </div>

      {/* Lista prodotti */}
      <div className="flex-1 p-4 overflow-auto">
        {prodotti.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Package className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <p className="text-lg">Nessun prodotto in lista</p>
            <p className="text-sm mt-1">Scansiona o inserisci manualmente</p>
          </div>
        ) : (
          <div className="space-y-2">
            {prodotti.map((prod, index) => (
              <div 
                key={prod.id} 
                className="flex items-center p-3 bg-white rounded-lg border-l-4"
                style={{ borderLeftColor: '#006B3F' }}
              >
                <div className="flex-1">
                  <div className="font-semibold">
                    {prod.brand} {prod.model}
                  </div>
                  {prod.tipo && (
                    <div className="text-xs text-blue-600 font-medium">
                      {prod.tipo}
                    </div>
                  )}
                  <div className="text-sm text-gray-500 font-mono">
                    {prod.serialNumber}
                  </div>
                  {prod.location && (
                    <div className="text-xs text-gray-400 mt-0.5">
                      📍 {prod.location}
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-400 mr-1">#{index + 1}</span>
                <button
                  onClick={() => openModalForEdit(prod)}
                  className="p-2 text-blue-500"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleRemove(prod.id)}
                  className="p-2 text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer - Carica tutti */}
      {prodotti.length > 0 && (
        <div className="p-4 bg-white border-t">
          <button
            onClick={handleCaricaTutti}
            className="w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2"
            style={{ backgroundColor: '#FFDD00', color: '#006B3F' }}
          >
            <CheckCircle className="w-6 h-6" />
            CARICA {prodotti.length} PRODOTTI
          </button>
        </div>
      )}

      {/* MODAL INSERIMENTO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] flex flex-col">
            {/* Header modal */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg">
                {modalMode === 'preview' ? '📷 Verifica e Conferma' :
                 modalMode === 'ocr' ? '📷 Scansione OCR' :
                 editingProductId ? '✏️ Modifica Articolo' :
                 '✏️ Inserimento Manuale'}
              </h3>
              <button onClick={handleCloseModal}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            {/* Contenuto modal */}
            <div className="flex-1 overflow-auto p-4">
              
              {/* MODALITÀ OCR - scelta fotocamera/galleria */}
              {modalMode === 'ocr' && !scanning && !scanPreview && (
                <div className="space-y-3">
                  <button
                    onClick={() => document.getElementById('ocr-camera')?.click()}
                    className="w-full py-4 rounded-lg font-bold text-white flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#006B3F' }}
                  >
                    <Camera className="w-5 h-5" />
                    📷 SCATTA FOTO
                  </button>
                  
                  <button
                    onClick={() => document.getElementById('ocr-gallery')?.click()}
                    className="w-full py-4 rounded-lg font-bold border-2 flex items-center justify-center gap-2"
                    style={{ borderColor: '#006B3F', color: '#006B3F' }}
                  >
                    <Image className="w-5 h-5" />
                    🖼️ DA GALLERIA
                  </button>
                  
                  <button
                    onClick={() => setModalMode('manual')}
                    className="w-full py-3 text-gray-500 text-sm"
                  >
                    oppure inserisci manualmente →
                  </button>
                </div>
              )}
              
              {/* SCANSIONE IN CORSO */}
              {scanning && (
                <div className="text-center py-8">
                  {scanPreview && (
                    <img 
                      src={scanPreview} 
                      alt="Scansione" 
                      className="w-full rounded-lg max-h-40 object-contain bg-gray-100 mb-4"
                    />
                  )}
                  <div className="text-4xl mb-2">⏳</div>
                  <p className="font-semibold" style={{ color: '#006B3F' }}>Lettura in corso...</p>
                </div>
              )}
              
              {/* ANTEPRIMA OCR - modifica e conferma */}
              {modalMode === 'preview' && !scanning && (
                <div className="space-y-4">
                  {scanPreview && (
                    <img 
                      src={scanPreview} 
                      alt="Scansione" 
                      className="w-full rounded-lg max-h-32 object-contain bg-gray-100"
                    />
                  )}
                  
                  {ocrError ? (
                    <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-sm text-yellow-800 flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{ocrError}</span>
                    </div>
                  ) : (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                      ✏️ Verifica i dati riconosciuti e correggi se necessario
                    </div>
                  )}
                  
                  {/* Campo Brand */}
                  <div>
                    <label className="text-xs text-gray-500">Brand *</label>
                    <input
                      type="text"
                      list="brand-list"
                      placeholder="Digita o seleziona brand..."
                      className="w-full p-3 border rounded-lg mt-1"
                      value={formBrand}
                      onChange={(e) => setFormBrand(e.target.value)}
                    />
                    <datalist id="brand-list">
                      {allBrands.map(brand => (
                        <option key={brand} value={brand} />
                      ))}
                    </datalist>
                  </div>
                  
                  {/* Campo Tipo */}
                  <TipoField />

                  <div>
                    <label className="text-xs text-gray-500">Modello *</label>
                    <input
                      type="text"
                      placeholder="Es: MSA 140, HRX 476..."
                      className="w-full p-3 border rounded-lg mt-1"
                      value={formModel}
                      onChange={(e) => setFormModel(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Matricola *</label>
                    <input
                      type="text"
                      placeholder="Numero di serie"
                      className="w-full p-3 border rounded-lg mt-1 font-mono"
                      value={formSerial}
                      onChange={(e) => setFormSerial(e.target.value.toUpperCase())}
                    />
                  </div>

                  {/* Campo Magazzino + Postazione */}
                  <MagazzinoField />
                </div>
              )}

              {/* INSERIMENTO MANUALE */}
              {modalMode === 'manual' && !scanning && (
                <div className="space-y-4">
                  {ocrError && (
                    <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-sm text-yellow-800 flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span>{ocrError}</span>
                    </div>
                  )}

                  {/* Campo Brand */}
                  <div>
                    <label className="text-xs text-gray-500">Brand *</label>
                    <input
                      type="text"
                      list="brand-list-manual"
                      placeholder="Digita o seleziona brand..."
                      className="w-full p-3 border rounded-lg mt-1"
                      value={formBrand}
                      onChange={(e) => setFormBrand(e.target.value)}
                    />
                    <datalist id="brand-list-manual">
                      {allBrands.map(brand => (
                        <option key={brand} value={brand} />
                      ))}
                    </datalist>
                  </div>

                  {/* Campo Tipo */}
                  <TipoField />

                  <div>
                    <label className="text-xs text-gray-500">Modello *</label>
                    <input
                      type="text"
                      placeholder="Es: MSA 140, HRX 476..."
                      className="w-full p-3 border rounded-lg mt-1"
                      value={formModel}
                      onChange={(e) => setFormModel(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Matricola *</label>
                    <input
                      type="text"
                      placeholder="Numero di serie"
                      className="w-full p-3 border rounded-lg mt-1 font-mono"
                      value={formSerial}
                      onChange={(e) => setFormSerial(e.target.value.toUpperCase())}
                    />
                  </div>

                  {/* Campo Magazzino + Postazione */}
                  <MagazzinoField />

                  <p className="text-xs text-gray-400">
                    💡 Dopo aver aggiunto, i campi si svuotano per inserimento rapido (Brand e Magazzino restano)
                  </p>
                </div>
              )}
            </div>
            
            {/* Footer modal */}
            <div className="p-4 border-t space-y-2">
              {(modalMode === 'preview' || modalMode === 'manual') && !scanning && (
                <>
                  <button
                    onClick={handleConfirmAdd}
                    disabled={!formBrand || !formTipo || (formTipo === 'Altro' && !formTipoAltro.trim()) || !formModel.trim() || !formSerial.trim()}
                    className="w-full py-3 rounded-lg font-bold text-white disabled:opacity-50"
                    style={{ backgroundColor: '#006B3F' }}
                  >
                    {editingProductId ? '✓ SALVA MODIFICHE' : '✓ AGGIUNGI ALLA LISTA'}
                  </button>
                  
                  {modalMode === 'preview' && (
                    <button
                      onClick={handleNewScan}
                      className="w-full py-2 text-sm text-gray-500"
                    >
                      🔄 Nuova scansione
                    </button>
                  )}
                </>
              )}
              
              {modalMode === 'ocr' && !scanning && !scanPreview && (
                <button
                  onClick={handleCloseModal}
                  className="w-full py-3 rounded-lg font-bold border-2"
                  style={{ borderColor: '#006B3F', color: '#006B3F' }}
                >
                  CHIUDI
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

