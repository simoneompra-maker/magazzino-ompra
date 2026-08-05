import { useState, useEffect, useRef } from 'react';
import { Archive } from 'lucide-react';
import { cercaVociExtra } from './antizanzareService';

/**
 * Campo descrizione di una voce extra, con ricerca incrementale
 * nell'archivio delle voci gia' usate. Scegliendo un suggerimento
 * si riempiono anche codice, unita' di misura, costo e prezzo.
 */
export default function VoceExtraRicerca({ valore, disabled, onScegli, onDigita, className }) {
  const [suggerimenti, setSuggerimenti] = useState([]);
  const [aperto, setAperto] = useState(false);
  const [evidenziato, setEvidenziato] = useState(-1);
  const chiusuraRef = useRef(null);

  useEffect(() => {
    if (!aperto) return undefined;
    const t = setTimeout(async () => {
      setSuggerimenti(await cercaVociExtra(valore));
      setEvidenziato(-1);
    }, 200);
    return () => clearTimeout(t);
  }, [valore, aperto]);

  const scegli = (v) => {
    onScegli(v);
    setAperto(false);
    setSuggerimenti([]);
  };

  const onKeyDown = (e) => {
    if (!aperto || suggerimenti.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setEvidenziato((i) => Math.min(i + 1, suggerimenti.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setEvidenziato((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && evidenziato >= 0) {
      e.preventDefault();
      scegli(suggerimenti[evidenziato]);
    } else if (e.key === 'Escape') {
      setAperto(false);
    }
  };

  return (
    <div className="relative flex-1 min-w-0">
      <input
        value={valore || ''}
        onChange={(e) => {
          onDigita(e.target.value);
          setAperto(true);
        }}
        onFocus={() => setAperto(true)}
        onBlur={() => {
          clearTimeout(chiusuraRef.current);
          chiusuraRef.current = setTimeout(() => setAperto(false), 150);
        }}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder="Descrizione — digita per cercare in archivio"
        className={className}
      />

      {aperto && suggerimenti.length > 0 && (
        <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
          <p className="px-3 py-1 text-xs text-gray-400 border-b flex items-center gap-1">
            <Archive className="w-3 h-3" />
            {(valore || '').trim().length >= 2 ? 'Dall’archivio' : 'Le più usate'}
          </p>
          {suggerimenti.map((v, i) => (
            <button
              key={v.id}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setEvidenziato(i)}
              onClick={() => scegli(v)}
              className={`w-full text-left px-3 py-2 border-b last:border-0 ${
                i === evidenziato ? 'bg-green-50' : 'hover:bg-green-50'
              }`}
            >
              <p className="text-sm text-gray-800 truncate">{v.descrizione}</p>
              <p className="text-xs text-gray-400">
                {[
                  v.codice,
                  v.costo != null && `costo ${Number(v.costo).toFixed(2)} €`,
                  v.prezzo != null && `vendita ${Number(v.prezzo).toFixed(2)} €`,
                  v.usi > 1 && `usata ${v.usi} volte`,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
