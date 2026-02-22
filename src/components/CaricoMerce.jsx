import { useState, useEffect } from 'react';
import { ArrowLeft, Camera, Plus, Trash2, Package, CheckCircle, X, Edit2, Image, AlertCircle } from 'lucide-react';
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
  
  // Campi form
  const [formBrand, setFormBrand] = useState('');
  const [formTipo, setFormTipo] = useState('');
  const [formTipoAltro, setFormTipoAltro] = useState('');
  const [formModel, setFormModel] = useState('');
  const [formSerial, setFormSerial] = useState('');
  
  // Lista brand combinata (standard + custom)
  const [allBrands, setAllBrands] = useState([]);
  
  // Carica brand all'avvio
  useEffect(() => {
    const customBrands = getCustomBrands();
    const standardBrands = brands.filter(b => b !== 'Altro');
    const combined = [...new Set([...standardBrands, ...customBrands])].sort();
    setAllBrands(combined);
  }, [brands]);
  
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
        // Mostra anteprima con dati pre-compilati
        setFormBrand(result.brand || '');
        setFormModel(result.modello || '');
        setFormSerial(result.matricola || '');
        // Il tipo resta vuoto, l'utente lo seleziona
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

    // Controlla duplicati
    const serialNorm = formSerial.trim().toUpperCase();
    if (prodotti.find(p => p.serialNumber === serialNorm)) {
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

    setProdotti([...prodotti, {
      id: Date.now(),
      brand: brandNorm,
      model: `${getTipoFinale()} ${formModel.trim()}`,
      serialNumber: serialNorm,
      tipo: getTipoFinale()
    }]);

    // Chiudi modal: torna alla schermata principale con OCR e Manuale pronti
    setShowModal(false);
    setFormModel("");
    setFormSerial("");
    setFormTipo("");
    setFormTipoAltro("");
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
    setFormBrand('');
    setFormTipo('');
    setFormTipoAltro('');
    setFormModel('');
    setFormSerial('');
    setScanPreview(null);
    setOcrError(null);
  };

  // Apri modal
  const openModal = (mode) => {
    setShowModal(true);
    setModalMode(mode);
    setFormBrand('');
    setFormTipo('');
    setFormTipoAltro('');
    setFormModel('');
    setFormSerial('');
    setScanPreview(null);
    setOcrError(null);
  };

  // Componente campo Brand (input semplice con suggerimenti)
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
                </div>
                <span className="text-xs text-gray-400 mr-3">#{index + 1}</span>
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
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                    ✏️ Verifica i dati riconosciuti e correggi se necessario
                  </div>
                  
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
                  
                  <p className="text-xs text-gray-400">
                    💡 Dopo aver aggiunto, i campi si svuotano per inserimento rapido (Brand resta)
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
                    ✓ AGGIUNGI ALLA LISTA
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

