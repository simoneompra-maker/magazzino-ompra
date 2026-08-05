import { Plus, Trash2 } from 'lucide-react';
import { METODI, DEFAULTS, supportaInline } from './catalogo';

/**
 * Righe-linea del progetto: una per ogni percorso disegnato su Google Earth.
 * La lunghezza affidabile e' quella dell'etichetta di Google Earth.
 */
export default function LineeEditor({ linee, brand, soloLettura, onChange, risultato }) {
  const inlineOk = supportaInline(brand);

  const aggiorna = (i, campo, valore) => {
    const nuove = linee.map((l, k) => (k === i ? { ...l, [campo]: valore } : l));
    onChange(nuove);
  };

  const aggiungi = () =>
    onChange([
      ...linee,
      { etichetta: '', metri: '', passo: DEFAULTS.passo, metodo: DEFAULTS.metodo },
    ]);

  const rimuovi = (i) => onChange(linee.filter((_, k) => k !== i));

  const ugelliDi = (l) => {
    const m = parseFloat(l.metri);
    const p = parseFloat(l.passo) || DEFAULTS.passo;
    return m > 0 ? Math.ceil(m / p) : 0;
  };

  const maxLinea = risultato?.macchina?.perLine || 0;
  const totMetri = linee.reduce((a, l) => a + (parseFloat(l.metri) || 0), 0);
  const totUgelli = linee.reduce((a, l) => a + ugelliDi(l), 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-700 text-sm">Linee</h2>
        {!soloLettura && (
          <button
            onClick={aggiungi}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-white"
            style={{ backgroundColor: '#006B3F' }}
          >
            <Plus className="w-3.5 h-3.5" /> Linea
          </button>
        )}
      </div>

      {linee.length === 0 && (
        <p className="text-xs text-gray-400 py-3 text-center">
          Nessuna linea. Aggiungine una per ogni percorso disegnato sulla foto.
        </p>
      )}

      <div className="space-y-2">
        {linee.map((l, i) => {
          const ug = ugelliDi(l);
          const oltre = maxLinea > 0 && ug > maxLinea;
          return (
            <div key={i} className="border border-gray-200 rounded-lg p-2.5 bg-gray-50/60">
              <div className="flex items-center gap-2 mb-2">
                <input
                  value={l.etichetta || ''}
                  onChange={(e) => aggiorna(i, 'etichetta', e.target.value)}
                  disabled={soloLettura}
                  placeholder={`Etichetta (es. Insetticida)`}
                  className="flex-1 min-w-0 border rounded-lg px-2 py-1.5 text-sm disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 ${
                    oltre ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
                  }`}
                  title={oltre ? `Oltre il massimo di ${maxLinea} ugelli per linea` : ''}
                >
                  {ug} ug.
                </span>
                {!soloLettura && (
                  <button
                    onClick={() => rimuovi(i)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 flex-shrink-0"
                    aria-label="Rimuovi linea"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-xs text-gray-500">Metri</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={l.metri ?? ''}
                    onChange={(e) => aggiorna(i, 'metri', e.target.value)}
                    disabled={soloLettura}
                    className="w-full border rounded-lg px-2 py-1.5 text-sm disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-500">Passo (m)</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0.5"
                    step="0.5"
                    value={l.passo ?? DEFAULTS.passo}
                    onChange={(e) => aggiorna(i, 'passo', e.target.value)}
                    disabled={soloLettura}
                    className="w-full border rounded-lg px-2 py-1.5 text-sm disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </label>
              </div>

              <label className="block mt-2">
                <span className="text-xs text-gray-500">Montaggio</span>
                <select
                  value={l.metodo || DEFAULTS.metodo}
                  onChange={(e) => aggiorna(i, 'metodo', e.target.value)}
                  disabled={soloLettura}
                  className="w-full border rounded-lg px-2 py-1.5 text-sm bg-white disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {METODI.map((m) => (
                    <option key={m.id} value={m.id} disabled={m.id === 'm2q' && !inlineOk}>
                      {m.label}
                      {m.id === 'm2q' && !inlineOk ? ' — non disponibile per questo brand' : ''}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          );
        })}
      </div>

      {linee.length > 0 && (
        <p className="text-xs text-gray-500 mt-3 pt-2 border-t">
          Totale <b>{totMetri.toLocaleString('it-IT')} m</b> · <b>{totUgelli}</b> ugelli
          {risultato?.macchina?.maxTot > 0 && (
            <>
              {' '}
              / max{' '}
              <b className={totUgelli > risultato.macchina.maxTot ? 'text-red-600' : 'text-green-700'}>
                {risultato.macchina.maxTot}
              </b>
              {risultato.macchina.lines > 1 && ` (${risultato.macchina.perLine}/linea × ${risultato.macchina.lines})`}
            </>
          )}
        </p>
      )}

      <p className="text-xs text-gray-400 mt-2">
        Usa la lunghezza riportata sull'etichetta di Google Earth: la foto non è ortogonale, quindi
        misurarla sull'immagine è meno affidabile.
      </p>
    </div>
  );
}
