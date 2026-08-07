import { Plus, Trash2, Wand2 } from 'lucide-react';
import { METODI, DEFAULTS, supportaInline, supportaDerivazione } from './catalogo';
import { ugelliLinea, montatiLinea, etichettaCategoria } from './calcolo';

const VERDE = '#006B3F';

/**
 * Righe-linea del progetto: una per ogni percorso disegnato su Google Earth.
 * Ogni linea ripartisce i suoi ugelli su piu' metodi di montaggio: la stessa
 * linea puo' avere una parte su T+dritto e una parte su risalita.
 */
export default function LineeEditor({ linee, brand, soloLettura, onChange, risultato }) {
  const inlineOk = supportaInline(brand);
  // "Tubo 3/8"" oppure "Tubo Ø8" a seconda del brand
  const nomeGrosso = etichettaCategoria(brand, 'tubiTronco').replace(/^Tubo\s*/, '');
  const derivaOk = supportaDerivazione(brand);
  const metodiUsabili = METODI.filter((m) => {
    if (m.id === 'm2q') return inlineOk;
    if (m.deriva) return derivaOk;
    return true;
  });

  const aggiorna = (i, patch) => onChange(linee.map((l, k) => (k === i ? { ...l, ...patch } : l)));

  const setMetodo = (i, metodoId, valore) => {
    const l = linee[i];
    const n = Math.max(0, parseInt(valore, 10) || 0);
    const metodi = { ...(l.metodi || {}) };
    if (n > 0) metodi[metodoId] = n;
    else delete metodi[metodoId];
    aggiorna(i, { metodi });
  };

  /** Mette tutti gli ugelli previsti sul primo metodo gia' usato. */
  const allinea = (i) => {
    const l = linee[i];
    const previsti = ugelliLinea(l);
    const usati = Object.keys(l.metodi || {}).filter((k) => (l.metodi[k] || 0) > 0);
    const target = usati[0] || DEFAULTS.metodo;

    if (usati.length <= 1) {
      aggiorna(i, { metodi: previsti > 0 ? { [target]: previsti } : {} });
      return;
    }
    // Piu' metodi in uso: ridistribuisco in proporzione
    const tot = usati.reduce((a, k) => a + l.metodi[k], 0) || 1;
    const metodi = {};
    let residuo = previsti;
    usati.forEach((k, idx) => {
      const q = idx === usati.length - 1 ? residuo : Math.round((l.metodi[k] / tot) * previsti);
      residuo -= q;
      if (q > 0) metodi[k] = q;
    });
    aggiorna(i, { metodi });
  };

  const aggiungi = () =>
    onChange([
      ...linee,
      { etichetta: '', metri: '', passo: DEFAULTS.passo, metodi: {} },
    ]);

  const rimuovi = (i) => onChange(linee.filter((_, k) => k !== i));

  const maxLinea = risultato?.macchina?.perLine || 0;
  const totMetri = linee.reduce((a, l) => a + (parseFloat(l.metri) || 0), 0);
  const totTronco = linee.reduce(
    (a, l) => a + Math.min(parseFloat(l.metriTronco) || 0, parseFloat(l.metri) || 0),
    0
  );
  const totPrevisti = linee.reduce((a, l) => a + ugelliLinea(l), 0);
  const totMontati = linee.reduce((a, l) => a + montatiLinea(l), 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-700 text-sm">Linee</h2>
        {!soloLettura && (
          <button
            onClick={aggiungi}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-white"
            style={{ backgroundColor: VERDE }}
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

      <div className="space-y-3">
        {linee.map((l, i) => {
          const previsti = ugelliLinea(l);
          const montati = montatiLinea(l);
          const coincide = previsti === montati;
          const oltre = maxLinea > 0 && previsti > maxLinea;
          const troncoEccessivo =
            (parseFloat(l.metriTronco) || 0) > (parseFloat(l.metri) || 0);

          return (
            <div key={i} className="border border-gray-200 rounded-lg p-2.5 bg-gray-50/60">
              {/* Etichetta e riepilogo */}
              <div className="flex items-center gap-2 mb-2">
                <input
                  value={l.etichetta || ''}
                  onChange={(e) => aggiorna(i, { etichetta: e.target.value })}
                  disabled={soloLettura}
                  placeholder="Etichetta (es. Insetticida)"
                  className="flex-1 min-w-0 border rounded-lg px-2 py-1.5 text-sm disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 ${
                    oltre ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
                  }`}
                  title={oltre ? `Oltre il massimo di ${maxLinea} ugelli per linea` : ''}
                >
                  {previsti} ug.
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

              <div className="grid grid-cols-3 gap-2">
                <label className="block">
                  <span className="text-xs text-gray-500">Metri</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={l.metri ?? ''}
                    onChange={(e) => aggiorna(i, { metri: e.target.value })}
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
                    onChange={(e) => aggiorna(i, { passo: e.target.value })}
                    disabled={soloLettura}
                    className="w-full border rounded-lg px-2 py-1.5 text-sm disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </label>
                <label className="block">
                  <span
                    className="text-xs text-gray-500"
                    title={`Quanti di questi metri corrono in ${nomeGrosso}. Sono compresi nei metri, non si aggiungono.`}
                  >
                    di cui {nomeGrosso}
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    max={l.metri || undefined}
                    value={l.metriTronco ?? ''}
                    placeholder="0"
                    onChange={(e) => aggiorna(i, { metriTronco: e.target.value })}
                    disabled={soloLettura}
                    className={`w-full border rounded-lg px-2 py-1.5 text-sm disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      troncoEccessivo ? 'border-red-400 bg-red-50' : ''
                    }`}
                  />
                </label>
              </div>

              {troncoEccessivo && (
                <p className="text-xs text-red-600 mt-1">
                  I metri in {nomeGrosso} non possono superare i metri della linea.
                </p>
              )}

              {/* Ripartizione sui metodi di montaggio */}
              <div className="mt-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Montaggio</span>
                  <span
                    className={`text-xs font-semibold ${coincide ? 'text-green-700' : 'text-amber-600'}`}
                  >
                    {montati} / {previsti}
                    {!coincide && !soloLettura && (
                      <button
                        onClick={() => allinea(i)}
                        className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: VERDE }}
                      >
                        <Wand2 className="w-3 h-3" /> allinea
                      </button>
                    )}
                  </span>
                </div>

                <div className="space-y-1">
                  {metodiUsabili.map((m) => {
                    const q = l.metodi?.[m.id] ?? '';
                    const attivo = Number(q) > 0;
                    return (
                      <div
                        key={m.id}
                        className={`flex items-center gap-2 px-2 py-1 rounded border ${
                          attivo ? 'border-green-300 bg-green-50' : 'border-gray-100 bg-white'
                        }`}
                      >
                        <span className="flex-1 min-w-0 text-xs text-gray-700 truncate">{m.label}</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          min="0"
                          step="1"
                          value={q}
                          placeholder="0"
                          onChange={(e) => setMetodo(i, m.id, e.target.value)}
                          disabled={soloLettura}
                          className="w-14 border rounded px-1 py-1 text-xs text-center tabular-nums disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                          aria-label={`Ugelli con ${m.label}`}
                        />
                      </div>
                    );
                  })}
                </div>

                {(!inlineOk || !derivaOk) && (
                  <p className="text-xs text-gray-400 mt-1">
                    {!inlineOk && 'Il montaggio in linea senza T non è disponibile per questo brand. '}
                    {!derivaOk && `Questo brand non ha tubo ${nomeGrosso} da cui derivare.`}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {linee.length > 0 && (
        <p className="text-xs text-gray-500 mt-3 pt-2 border-t">
          Totale <b>{totMetri.toLocaleString('it-IT')} m</b>
          {totTronco > 0 && (
            <> · di cui <b>{totTronco.toLocaleString('it-IT')} m</b> in {nomeGrosso}</>
          )} · <b>{totPrevisti}</b> ugelli previsti ·{' '}
          <b className={totMontati === totPrevisti ? 'text-green-700' : 'text-amber-600'}>
            {totMontati}
          </b>{' '}
          ripartiti
          {risultato?.macchina?.maxTot > 0 && (
            <>
              {' '}
              / max{' '}
              <b className={totPrevisti > risultato.macchina.maxTot ? 'text-red-600' : 'text-green-700'}>
                {risultato.macchina.maxTot}
              </b>
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
