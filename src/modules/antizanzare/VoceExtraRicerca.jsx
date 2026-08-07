import { useState, useEffect, useRef } from 'react';
import { Archive, BookOpen, Trash2 } from 'lucide-react';
import { cercaVociExtra, eliminaVoceExtra } from './antizanzareService';

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

  /** Toglie dall'archivio una voce digitata male. Il listino non si tocca. */
  const elimina = async (v, e) => {
    e.stopPropagation();
    if (v.fonte !== 'archivio') return;
    if (!window.confirm(`Togliere "${v.descrizione}" dall'archivio delle voci extra?`)) return;
    try {
      await eliminaVoceExtra(v.descrizione);
      setSuggerimenti((s) => s.filter((x) => x.id !== v.id));
    } catch (err) {
      console.error('Eliminazione voce fallita:', err);
    }
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
        title="Cerca nell'archivio delle voci usate e nel Listino Unificato"
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
        <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto">
          <p className="px-3 py-1 text-xs text-gray-400 border-b sticky top-0 bg-white">
            {(valore || '').trim().length >= 2
              ? 'Archivio e Listino Unificato'
              : 'Voci più usate — scrivi per cercare a listino'}
          </p>

          {suggerimenti.map((v, i) => (
            <div
              key={v.id}
              onMouseEnter={() => setEvidenziato(i)}
              className={`flex items-start border-b last:border-0 ${
                i === evidenziato ? 'bg-green-50' : 'hover:bg-green-50'
              }`}
            >
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => scegli(v)}
                className="flex-1 min-w-0 text-left px-3 py-2"
              >
                <p className="text-sm text-gray-800 flex items-start gap-1.5">
                  {v.fonte === 'archivio' ? (
                    <Archive className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <BookOpen className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="truncate">{v.descrizione}</span>
                </p>
                <p className="text-xs text-gray-400 pl-5">
                  {[
                    v.codice,
                    v.marca,
                    v.costo != null && `costo ${Number(v.costo).toFixed(2)} €`,
                    v.prezzo != null && `vendita ${Number(v.prezzo).toFixed(2)} €`,
                    v.fonte === 'archivio' && v.usi > 1 && `usata ${v.usi} volte`,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </button>

              {v.fonte === 'archivio' && (
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => elimina(v, e)}
                  className="p-2 mt-1 mr-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                  title="Togli dall'archivio"
                  aria-label={`Togli ${v.descrizione} dall'archivio`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
