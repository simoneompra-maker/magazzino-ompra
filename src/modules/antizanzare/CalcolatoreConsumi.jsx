import { Plus, Trash2, Droplets, Wand2, Info } from 'lucide-react';
import {
  consumabiliPerBrand, PRESSIONE_BAR, PRESSIONE_RAFFRESCAMENTO,
  portataUgello, GIORNI_STAGIONE, C,
} from './catalogo';
import { calcolaConsumi, rigaProdotto } from './consumi';

const VERDE = '#006B3F';

const inputCls =
  'w-full border rounded-lg px-2 py-1.5 text-sm bg-white disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500';

const eur = (n) =>
  (Number(n) || 0).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

const litri = (n) =>
  (Number(n) || 0).toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const Campo = ({ label, children, hint }) => (
  <label className="block">
    <span className="text-xs text-gray-500">{label}</span>
    {children}
    {hint && <span className="block text-xs text-gray-400 mt-0.5">{hint}</span>}
  </label>
);

/**
 * Calcolatore dei consumi e dei costi di gestione.
 *
 * Lo stesso componente serve due posti: un blocco dentro il progetto, con
 * ugelli e prodotti gia' arrivati dall'impianto, e una pagina autonoma nel
 * menu per quando il preventivo non c'e' ancora. Cambia solo cosa arriva
 * precompilato: il conto e' identico, perche' e' lo stesso motore.
 *
 * MINUTI E GIORNI SONO PER PRODOTTO. Insetticida e repellente girano su
 * cicli diversi — la strategia Stocker prevede zanzaricida per i primi
 * dieci giorni e poi disabituante due volte al giorno — e un unico campo
 * "minuti totali" darebbe un consumo sbagliato su tutti e due.
 */
export default function CalcolatoreConsumi({
  brand,
  prodotti,
  soloLettura,
  onChange,
  onPrecompila, // se presente, mostra il pulsante che rilegge i dati dal progetto
  compatto = false,
}) {
  const righe = prodotti || [];
  const articoli = consumabiliPerBrand(brand);
  const risultato = calcolaConsumi({ prodotti: righe });

  const set = (i, patch) => onChange(righe.map((r, k) => (k === i ? { ...r, ...patch } : r)));

  const scegliProdotto = (i, code) => {
    const a = articoli.find((x) => x.code === code);
    if (!a) {
      set(i, { code: null, label: '', litriConf: 1, prezzoConf: 0 });
      return;
    }
    set(i, { code: a.code, label: a.label, tipo: a.tipo, litriConf: a.litri, prezzoConf: a.priceRaw });
  };

  const aggiungi = () => onChange([...righe, rigaProdotto({ giorni: GIORNI_STAGIONE })]);
  const rimuovi = (i) => onChange(righe.filter((_, k) => k !== i));

  /** Ricalcola la portata dall'ugello scelto e dalla pressione digitata. */
  const applicaPortata = (i, ugelloCode, bar) => {
    const art = (C.sys[C.brands[brand]?.sys]?.ugello || []).find((u) => u.code === ugelloCode);
    const { lMin } = portataUgello(art, bar);
    if (lMin > 0) set(i, { portataLmin: Math.round(lMin * 10000) / 10000, _ugello: ugelloCode, _pressione: bar });
  };

  const ugelli = C.sys[C.brands[brand]?.sys]?.ugello || [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-semibold text-gray-700 text-sm flex items-center gap-1.5">
          <Droplets className="w-4 h-4" style={{ color: VERDE }} />
          Consumi e costi di gestione
        </h2>
        {onPrecompila && !soloLettura && (
          <button
            onClick={onPrecompila}
            className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded text-white"
            style={{ backgroundColor: VERDE }}
          >
            <Wand2 className="w-3 h-3" /> Riprendi dal progetto
          </button>
        )}
      </div>

      {righe.length === 0 && (
        <p className="text-xs text-gray-400">
          Nessun prodotto. Aggiungi una riga, oppure scegli il kit prodotti e premi
          &laquo;Riprendi dal progetto&raquo;.
        </p>
      )}

      {righe.map((r, i) => {
        const calc = risultato.righe[i];
        const pressione = Number(r._pressione) || PRESSIONE_BAR[brand] || 0;
        return (
          <div key={i} className="border border-gray-200 rounded-lg p-2.5 space-y-2">
            <div className="flex gap-2 items-start">
              <div className="flex-1 min-w-0">
                <Campo label={`Prodotto ${i + 1}`}>
                  <select
                    value={r.code || ''}
                    onChange={(e) => scegliProdotto(i, e.target.value)}
                    disabled={soloLettura}
                    className={inputCls}
                  >
                    <option value="">— scegli —</option>
                    {articoli.map((a) => (
                      <option key={a.code} value={a.code}>
                        {a.label} · {a.priceRaw.toFixed(2)} €
                      </option>
                    ))}
                  </select>
                </Campo>
              </div>
              {!soloLettura && (
                <button
                  onClick={() => rimuovi(i)}
                  className="mt-4 p-1.5 rounded-lg text-red-400 hover:bg-red-50 flex-shrink-0"
                  aria-label="Rimuovi prodotto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Campo label="Ugelli serviti">
                <input
                  type="number" inputMode="numeric" min="0" step="1"
                  value={r.ugelli ?? ''}
                  onChange={(e) => set(i, { ugelli: e.target.value })}
                  disabled={soloLettura} className={inputCls}
                />
              </Campo>
              <Campo label="Minuti al giorno" hint="Somma di tutti i cicli di questo prodotto">
                <input
                  type="number" inputMode="decimal" min="0" step="0.5"
                  value={r.minutiGiorno ?? ''}
                  onChange={(e) => set(i, { minutiGiorno: e.target.value })}
                  disabled={soloLettura} className={inputCls}
                />
              </Campo>
              <Campo label="Concentrazione %" hint="Prodotto sul totale della miscela">
                <input
                  type="number" inputMode="decimal" min="0" max="100" step="0.1"
                  value={r.percentuale ?? ''}
                  onChange={(e) => set(i, { percentuale: e.target.value })}
                  disabled={soloLettura} className={inputCls}
                />
              </Campo>
              <Campo label="Giorni d'uso">
                <input
                  type="number" inputMode="numeric" min="0" step="1"
                  value={r.giorni ?? ''}
                  onChange={(e) => set(i, { giorni: e.target.value })}
                  disabled={soloLettura} className={inputCls}
                />
              </Campo>
            </div>

            {/* Portata: si digita, oppure si ricava da ugello e pressione */}
            <div className="grid grid-cols-3 gap-2 items-end">
              <Campo label="Portata l/min per ugello">
                <input
                  type="number" inputMode="decimal" min="0" step="0.001"
                  value={r.portataLmin ?? ''}
                  onChange={(e) => set(i, { portataLmin: e.target.value, _fontePortata: 'manuale' })}
                  disabled={soloLettura} className={inputCls}
                />
              </Campo>
              <Campo label="Ugello">
                <select
                  value={r._ugello || ''}
                  onChange={(e) => applicaPortata(i, e.target.value, pressione)}
                  disabled={soloLettura} className={inputCls}
                >
                  <option value="">—</option>
                  {ugelli.map((u) => (
                    <option key={u.code} value={u.code}>{u.label}</option>
                  ))}
                </select>
              </Campo>
              <Campo label="Pressione bar">
                <input
                  type="number" inputMode="decimal" min="0" step="1"
                  value={pressione}
                  onChange={(e) => applicaPortata(i, r._ugello, e.target.value)}
                  disabled={soloLettura} className={inputCls}
                />
              </Campo>
            </div>

            {r._fontePortata === 'stimata' && (
              <p className="text-xs text-amber-700 flex items-start gap-1">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                Portata stimata dal diametro del foro, non dichiarata dal costruttore.
                Sotto i 0,2 mm lo scarto puo&apos; arrivare al doppio.
              </p>
            )}
            {r._fontePortata === 'dichiarata' && (
              <p className="text-xs text-gray-400">Portata dichiarata dal costruttore.</p>
            )}

            {calc?.attiva && (
              <div className="rounded-lg bg-gray-50 border border-gray-100 p-2 grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs">
                <span className="text-gray-500">Miscela al giorno</span>
                <span className="text-right tabular-nums">{litri(calc.miscelaGiorno)} l</span>
                <span className="text-gray-500">Prodotto in stagione</span>
                <span className="text-right tabular-nums">{litri(calc.concentratoStagione)} l</span>
                <span className="text-gray-500">Confezioni da {litri(calc.litriConf)} l</span>
                <span className="text-right tabular-nums font-semibold">{calc.confezioni}</span>
                <span className="text-gray-500">Costo</span>
                <span className="text-right tabular-nums font-semibold" style={{ color: VERDE }}>
                  {eur(calc.costo)}
                </span>
                {calc.residuo > 0.001 && (
                  <>
                    <span className="text-gray-400">Avanzo di fine stagione</span>
                    <span className="text-right tabular-nums text-gray-400">
                      {litri(calc.residuo)} l
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}

      {!soloLettura && (
        <button
          onClick={aggiungi}
          className="flex items-center gap-1 text-xs font-semibold text-green-700"
        >
          <Plus className="w-3.5 h-3.5" /> Aggiungi prodotto
        </button>
      )}

      {risultato.nProdotti > 0 && (
        <div className="rounded-lg p-3 text-white" style={{ backgroundColor: VERDE }}>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-white/70">Miscela nebulizzata in stagione</dt>
              <dd className="tabular-nums">{litri(risultato.miscelaStagione)} l</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/70">Prodotto concentrato</dt>
              <dd className="tabular-nums">{litri(risultato.concentratoStagione)} l</dd>
            </div>
            <div className="flex justify-between font-semibold pt-1 border-t border-white/20">
              <dt>Costo di gestione a stagione</dt>
              <dd className="tabular-nums">{eur(risultato.costoStagione)}</dd>
            </div>
            {risultato.giorniMax > 0 && (
              <div className="flex justify-between text-xs">
                <dt className="text-white/60">Media al giorno</dt>
                <dd className="tabular-nums text-white/80">
                  {eur(risultato.costoStagione / risultato.giorniMax)}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {!compatto && (
        <p className="text-xs text-gray-400">
          Il costo e&apos; calcolato su confezioni intere: il cliente compra taniche, non
          decilitri. Pressione di riferimento {PRESSIONE_BAR[brand] || '—'} bar; il
          raffrescamento Gardheaven gira intorno ai {PRESSIONE_RAFFRESCAMENTO} bar.
        </p>
      )}
    </div>
  );
}
