import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { C, DEFAULTS, brandList } from './catalogo';
import { CATEGORIE, articoliCategoria, articoloPredefinito, etichettaCategoria } from './calcolo';
import SelettoreVoci from './SelettoreVoci';
import VoceExtraRicerca from './VoceExtraRicerca';

const input =
  'w-full border rounded-lg px-2 py-1.5 text-sm bg-white disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500';

const Campo = ({ label, children, hint }) => (
  <label className="block">
    <span className="text-xs text-gray-500">{label}</span>
    {children}
    {hint && <span className="block text-xs text-gray-400 mt-0.5">{hint}</span>}
  </label>
);

/**
 * Configurazione impianto.
 * Ogni categoria di materiale — centralina compresa — e' un elenco di articoli
 * con la quantita' a fianco: si possono usare piu' varianti insieme.
 * Le quantita' sono precompilate dal calcolo e restano modificabili.
 */
export default function ConfigImpianto({ cfg, risultato, soloLettura, mostraPrezzi, onChange }) {
  const [apriExtra, setApriExtra] = useState(false);

  const brand = cfg.brand || 'geyser';
  const voci = cfg.voci || {};
  const sugg = risultato?.suggeriti || {};

  const set = (patch) => onChange({ ...cfg, ...patch });

  /**
   * `auto[catId] === false` significa che l'utente ha messo mano alle quantita'
   * di quella categoria: da quel momento il ricalcolo automatico la lascia
   * stare, finche' non preme "Allinea".
   */
  const setVoci = (catId, lista, opz = {}) =>
    set({
      voci: { ...voci, [catId]: lista },
      auto: { ...(cfg.auto || {}), [catId]: opz.auto !== false },
    });

  /** Cambio brand: i codici del vecchio catalogo non esistono piu'. */
  const cambiaBrand = (nuovo) => {
    onChange({
      ...cfg,
      brand: nuovo,
      scontoAcq: C.brands[nuovo].disc,
      voci: {}, // svuoto: le quantita' vengono riproposte dai suggerimenti
      auto: {}, // e tutte le categorie tornano automatiche
    });
  };

  const extra = cfg.extra || [];
  const setExtra = (i, campo, v) =>
    set({ extra: extra.map((e, k) => (k === i ? { ...e, [campo]: v } : e)) });

  const scontoBrand = Number(cfg.scontoAcq ?? C.brands[brand].disc) || 0;

  /**
   * Digitando il prezzo si ricava anche il costo, con lo stesso sconto
   * d'acquisto usato per il catalogo. Se la voce arriva dal listino con un
   * costo reale — i codici Stocker ce l'hanno — quello non si tocca.
   */
  const setPrezzoExtra = (i, valore) => {
    const prezzo = valore;
    const p = parseFloat(String(valore).replace(',', '.'));
    set({
      extra: extra.map((e, k) => {
        if (k !== i) return e;
        if (e.costoDaListino) return { ...e, prezzo };
        const costo = Number.isFinite(p) ? Math.round(p * (1 - scontoBrand / 100) * 100) / 100 : '';
        return { ...e, prezzo, costo };
      }),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
      <h2 className="font-semibold text-gray-700 text-sm">Impianto</h2>

      <div className="grid grid-cols-2 gap-2">
        <Campo label="Brand">
          <select value={brand} onChange={(e) => cambiaBrand(e.target.value)} disabled={soloLettura} className={input}>
            {brandList().map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </Campo>
        <Campo
          label="Metri di tubo di risalita per ugello"
          hint="Il tratto che alza l'ugello da terra, su paletto o tubolare"
        >
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.5"
            value={cfg.risalitaM ?? DEFAULTS.risalitaM}
            onChange={(e) => set({ risalitaM: e.target.value })}
            disabled={soloLettura}
            className={input}
          />
        </Campo>
      </div>

      <p className="text-xs text-gray-400">
        I metri di tubo di diametro maggiore si dichiarano riga per riga, nella sezione Linee.
      </p>

      {/* ── Materiali: una lista per categoria ── */}
      <div className="space-y-1.5 pt-1">
        {CATEGORIE.map((cat) => {
          const articoli = articoliCategoria(brand, cat.id);
          if (articoli.length === 0) return null;
          return (
            <SelettoreVoci
              key={cat.id}
              titolo={etichettaCategoria(brand, cat.id)}
              um={cat.um}
              articoli={articoli}
              predefinito={articoloPredefinito(brand, cat.id)}
              valori={voci[cat.id] || []}
              suggerito={sugg[cat.id] ?? null}
              soloLettura={soloLettura}
              mostraPrezzi={mostraPrezzi}
              onChange={(lista, opz) => setVoci(cat.id, lista, opz)}
            />
          );
        })}
      </div>

      {/* ── Voci extra fuori listino ── */}
      <div className="border-t pt-3">
        <button
          onClick={() => setApriExtra(!apriExtra)}
          className="w-full flex items-center justify-between text-sm font-semibold text-gray-700"
        >
          <span>
            Voci extra <span className="text-gray-400 font-normal">({extra.length})</span>
          </span>
          {apriExtra ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {apriExtra && (
          <div className="mt-2 space-y-2">
            {extra.map((e, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-2 space-y-1.5">
                <div className="flex gap-2">
                  <VoceExtraRicerca
                    valore={e.desc}
                    disabled={soloLettura}
                    className={input}
                    onDigita={(v) => setExtra(i, 'desc', v)}
                    onScegli={(v) =>
                      set({
                        extra: extra.map((x, k) =>
                          k === i
                            ? {
                                ...x,
                                desc: v.descrizione,
                                codice: v.codice || '',
                                um: v.um || 'pz',
                                costo: v.costo ?? x.costo ?? '',
                                prezzo: v.prezzo ?? x.prezzo ?? '',
                                costoDaListino: v.costo != null,
                              }
                            : x
                        ),
                      })
                    }
                  />
                  {!soloLettura && (
                    <button
                      onClick={() => set({ extra: extra.filter((_, k) => k !== i) })}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 flex-shrink-0"
                      aria-label="Rimuovi voce"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {/* Si digita solo il prezzo di vendita: il costo si ricava
                    dallo sconto d'acquisto del fornitore, come per tutti gli
                    altri articoli. Resta a vista per non far sparire il dato
                    su cui si calcola il margine. */}
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={e.q ?? ''}
                    onChange={(ev) => setExtra(i, 'q', ev.target.value)}
                    placeholder="q.tà"
                    disabled={soloLettura}
                    className={input}
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={e.prezzo ?? ''}
                    onChange={(ev) => setPrezzoExtra(i, ev.target.value)}
                    placeholder="prezzo €"
                    disabled={soloLettura || !mostraPrezzi}
                    className={input}
                  />
                </div>
                {mostraPrezzi && Number(e.prezzo) > 0 && (
                  <p className="text-xs text-gray-400">
                    Costo {Number(e.costo || 0).toFixed(2)} €
                    {e.costoDaListino ? ' (dal listino)' : ` (prezzo − ${scontoBrand}%)`}
                  </p>
                )}
              </div>
            ))}

            {!soloLettura && (
              <button
                onClick={() => set({ extra: [...extra, { desc: '', q: '', costo: '', prezzo: '' }] })}
                className="flex items-center gap-1 text-xs font-semibold text-green-700"
              >
                <Plus className="w-3.5 h-3.5" /> Aggiungi voce
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
