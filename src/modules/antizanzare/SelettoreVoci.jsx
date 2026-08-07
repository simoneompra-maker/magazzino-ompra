import { useState } from 'react';
import { ChevronDown, ChevronUp, Wand2, AlertTriangle } from 'lucide-react';

const VERDE = '#006B3F';

const num = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

/**
 * Elenco di articoli di una categoria, ciascuno con la sua quantita'.
 * Sostituisce i menu a tendina: si possono usare piu' varianti insieme,
 * per esempio due tipi di tubo o due di ugello sullo stesso impianto.
 *
 * Le quantita' sono precompilate dal calcolo (`suggerito`) e restano
 * modificabili. Se il totale inserito si discosta dal suggerito compare
 * un avviso con il pulsante per riallinearlo.
 */
export default function SelettoreVoci({
  titolo,
  um = 'pz',
  articoli,
  predefinito, // articolo da usare quando la categoria e' ancora vuota
  valori, // [{code, q}]
  suggerito, // numero, oppure null se la categoria e' discrezionale
  soloLettura,
  mostraPrezzi,
  apertoDiDefault = false,
  onChange,
}) {
  const [aperto, setAperto] = useState(apertoDiDefault);

  const qtaDi = (code) => valori.find((v) => v.code === code)?.q ?? '';
  const totale = valori.reduce((a, v) => a + num(v.q), 0);

  const scarto = suggerito == null ? 0 : totale - suggerito;
  const allineato = Math.abs(scarto) < 0.005;

  // Una modifica a mano stacca la categoria dal ricalcolo automatico;
  // "Allinea" la riaggancia.
  const setQta = (code, q) => {
    const n = Math.max(0, num(q));
    const altri = valori.filter((v) => v.code !== code);
    onChange(n > 0 ? [...altri, { code, q: n }] : altri, { auto: false });
  };

  /** I metri ammettono i decimi, i pezzi no. */
  const arrotondaQ = (n) => (um === 'm' ? Math.round(n * 10) / 10 : Math.round(n));

  /** Mette tutto il suggerito sulla prima voce gia' usata, o sul primo articolo. */
  const applicaSuggerito = () => {
    if (suggerito == null) return;
    const codeTarget = valori[0]?.code || predefinito?.code || articoli[0]?.code;
    if (!codeTarget) return;
    if (valori.length <= 1) {
      onChange(suggerito > 0 ? [{ code: codeTarget, q: suggerito }] : [], { auto: true });
      return;
    }
    // Piu' varianti in uso: ridistribuisco in proporzione, il resto sulla prima
    const tot = valori.reduce((a, v) => a + num(v.q), 0) || 1;
    let residuo = suggerito;
    const nuovi = valori.map((v, i) => {
      if (i === valori.length - 1) return { ...v, q: Math.max(0, arrotondaQ(residuo)) };
      const parte = arrotondaQ((num(v.q) / tot) * suggerito);
      residuo -= parte;
      return { ...v, q: parte };
    });
    onChange(nuovi.filter((v) => v.q > 0), { auto: true });
  };

  const usati = valori.length;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setAperto(!aperto)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 text-left"
      >
        <span className="text-sm font-semibold text-gray-700">
          {titolo}
          {usati > 0 && (
            <span className="ml-2 text-xs font-normal text-gray-500">
              {usati === 1 ? '1 voce' : `${usati} voci`} · {totale.toLocaleString('it-IT')} {um}
            </span>
          )}
        </span>

        <span className="flex items-center gap-2 flex-shrink-0">
          {suggerito != null && !allineato && (
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
              suggerito {suggerito.toLocaleString('it-IT')}
            </span>
          )}
          {suggerito != null && allineato && totale > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700">ok</span>
          )}
          {aperto ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </span>
      </button>

      {aperto && (
        <div className="p-2 space-y-1 bg-white">
          {suggerito != null && !allineato && !soloLettura && (
            <div className="flex items-center gap-2 px-2 py-1.5 mb-1 rounded bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span className="text-xs text-amber-800 flex-1">
                Inseriti {totale.toLocaleString('it-IT')} {um}, il calcolo ne suggerisce{' '}
                {suggerito.toLocaleString('it-IT')}.
              </span>
              <button
                onClick={applicaSuggerito}
                className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded text-white flex-shrink-0"
                style={{ backgroundColor: VERDE }}
              >
                <Wand2 className="w-3 h-3" /> Allinea
              </button>
            </div>
          )}

          {articoli.length === 0 && (
            <p className="text-xs text-gray-400 py-2 text-center">
              Nessun articolo disponibile per questo brand.
            </p>
          )}

          <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
            {articoli.map((a) => {
              const q = qtaDi(a.code);
              const attivo = num(q) > 0;
              return (
                <div
                  key={a.code}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded border ${
                    attivo ? 'border-green-300 bg-green-50' : 'border-gray-100'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 truncate" title={a.label}>
                      {a.label}
                    </p>
                    <p className="text-xs text-gray-400">{a.code}</p>
                  </div>

                  {mostraPrezzi && (
                    <span className="text-xs text-gray-400 flex-shrink-0 tabular-nums">
                      {(a.priceRaw / (a.div || 1)).toFixed(2)} €
                    </span>
                  )}

                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step={um === 'm' ? '0.5' : '1'}
                    value={q}
                    placeholder="0"
                    onChange={(e) => setQta(a.code, e.target.value)}
                    disabled={soloLettura}
                    className="w-16 border rounded px-1 py-1 text-xs text-center tabular-nums disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label={`Quantità ${a.label}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
