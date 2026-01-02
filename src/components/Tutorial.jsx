import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Package, ShoppingCart, ClipboardList, Camera, FileText } from 'lucide-react';

const TUTORIAL_KEY = 'ompra_tutorial_seen';

// Slides del tutorial
const slides = [
  {
    icon: Package,
    iconBg: '#006B3F',
    title: 'Benvenuto in OMPRA!',
    description: 'Il sistema gestionale per il magazzino. Questa breve guida ti mostrerà le funzioni principali.',
    tip: null
  },
  {
    icon: Camera,
    iconBg: '#006B3F',
    title: 'Carico Merce',
    description: 'Aggiungi prodotti al magazzino scansionando l\'etichetta con la fotocamera. L\'OCR riconosce automaticamente Brand, Modello e Matricola.',
    tip: '💡 Puoi anche inserire i dati manualmente'
  },
  {
    icon: ShoppingCart,
    iconBg: '#FFDD00',
    iconColor: '#006B3F',
    title: 'Vendita',
    description: 'Crea commissioni di vendita selezionando i prodotti dal magazzino. Supporta vendite KIT (più prodotti, un prezzo) e omaggi.',
    tip: '💡 Il cliente si autocompleta mentre digiti'
  },
  {
    icon: FileText,
    iconBg: '#2196F3',
    title: 'Commissioni',
    description: 'Genera PDF professionali e condividi via WhatsApp o Email. Puoi sempre reinviare dall\'archivio.',
    tip: '💡 Controlla l\'anteprima prima di confermare'
  },
  {
    icon: ClipboardList,
    iconBg: '#FF9800',
    title: 'Giacenze e Storico',
    description: 'Consulta l\'inventario in tempo reale, filtra per brand, cerca prodotti. Lo storico mostra tutte le vendite.',
    tip: '💡 I dati si sincronizzano su tutti i dispositivi'
  }
];

export default function Tutorial({ onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Controlla se il tutorial è già stato visto
    const seen = localStorage.getItem(TUTORIAL_KEY);
    if (!seen) {
      setVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(TUTORIAL_KEY, 'true');
    setVisible(false);
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem(TUTORIAL_KEY, 'true');
    setVisible(false);
    onComplete?.();
  };

  if (!visible) return null;

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
        {/* Header con skip */}
        <div className="flex justify-end p-3">
          <button 
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1"
          >
            Salta <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenuto slide */}
        <div className="px-6 pb-6 text-center">
          {/* Icona */}
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: slide.iconBg }}
          >
            <Icon 
              className="w-10 h-10" 
              style={{ color: slide.iconColor || 'white' }}
            />
          </div>

          {/* Titolo */}
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            {slide.title}
          </h2>

          {/* Descrizione */}
          <p className="text-gray-600 text-sm mb-4">
            {slide.description}
          </p>

          {/* Tip */}
          {slide.tip && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
              {slide.tip}
            </div>
          )}
        </div>

        {/* Footer con navigazione */}
        <div className="bg-gray-50 px-6 py-4">
          {/* Indicatori */}
          <div className="flex justify-center gap-2 mb-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-green-600 w-6' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Pulsanti */}
          <div className="flex gap-3">
            {currentSlide > 0 && (
              <button
                onClick={handlePrev}
                className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-600 font-medium flex items-center justify-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Indietro
              </button>
            )}
            
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-lg text-white font-bold flex items-center justify-center gap-1"
              style={{ backgroundColor: '#006B3F' }}
            >
              {currentSlide === slides.length - 1 ? (
                'Inizia!'
              ) : (
                <>
                  Avanti
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Funzione per resettare il tutorial (per test)
export function resetTutorial() {
  localStorage.removeItem(TUTORIAL_KEY);
  console.log('✓ Tutorial reset - apparirà al prossimo caricamento');
}

// Funzione per mostrare tutorial manualmente
export function showTutorial() {
  localStorage.removeItem(TUTORIAL_KEY);
  window.location.reload();
}
