import { useState } from 'react';
import { Info, X } from 'lucide-react';

// Tooltip con icona ⓘ - funziona su mobile (tap) e desktop (hover)
export default function Tooltip({ text, children, position = 'top' }) {
  const [show, setShow] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-flex items-center">
      {children}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShow(!show);
        }}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="ml-1 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-label="Informazioni"
      >
        <Info className="w-4 h-4" />
      </button>
      
      {show && (
        <>
          {/* Overlay per chiudere su mobile */}
          <div 
            className="fixed inset-0 z-40 md:hidden" 
            onClick={() => setShow(false)}
          />
          
          {/* Tooltip */}
          <div 
            className={`absolute z-50 ${positionClasses[position]} w-48 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg`}
          >
            <button 
              onClick={() => setShow(false)}
              className="absolute top-1 right-1 text-gray-400 hover:text-white md:hidden"
            >
              <X className="w-3 h-3" />
            </button>
            {text}
            {/* Freccia */}
            <div className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${
              position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
              position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
              position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
              'right-full top-1/2 -translate-y-1/2 -mr-1'
            }`} />
          </div>
        </>
      )}
    </div>
  );
}

// Versione semplice: solo icona che mostra testo
export function InfoIcon({ text, size = 'sm' }) {
  const [show, setShow] = useState(false);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShow(!show);
        }}
        className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none rounded-full hover:bg-gray-100"
        aria-label="Informazioni"
      >
        <Info className={sizeClasses[size]} />
      </button>
      
      {show && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShow(false)}
          />
          <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg">
            <button 
              onClick={() => setShow(false)}
              className="absolute top-1 right-1 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="pr-4">{text}</p>
          </div>
        </>
      )}
    </div>
  );
}
