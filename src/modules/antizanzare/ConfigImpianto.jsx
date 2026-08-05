import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import {
  C,
  DEFAULTS,
  brandList,
  macchinePerBrand,
  sysPerBrand,
  portaPerTipo,
  accessoriPerBrand,
} from './catalogo';

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
 * Configurazione impianto: brand, centralina, materiali, accessori, voci extra.
 * `cfg` e' l'oggetto config del progetto; ogni modifica risale con onChange.
 */
export default function ConfigImpianto({ cfg, soloLettura, onChange, mostraPrezzi }) {
  const [apriAcc, setApriAcc] = useState(false);
  const [apriExtra, setApriExtra] = useState(false);

  const brand = cfg.brand || 'geyser';
  const s = sysPerBrand(brand);
  const macchine = macchinePerBrand(brand);
  const accessori = accessoriPerBrand(brand);

  const set = (patch) => onChange({ ...cfg, ...patch });

  /** Cambio brand: azzero le scelte legate al vecchio catalogo. */
  const cambiaBrand = (nuovo) => {
    const ns = sysPerBrand(nuovo);
    onChange({
      ...cfg,
      brand: nuovo,
      macchinaCode: macchinePerBrand(nuovo)[0]?.code,
      tuboCode: ns.tubo[0]?.code,
      tuboTroncoCode: ns.tubo[ns.tubo.length - 1]?.code,
      ugelloCode: ns.ugello[0]?.code,
      portaDCode: portaPerTipo(nuovo, 'd')[0]?.code,
      porta9Code: portaPerTipo(nuovo, 'a')[0]?.code,
      tselCode: ns.tsel[0]?.code,
      scontoAcq: C.brands[nuovo].disc,
      accessori: [],
    });
  };

  const accSelezionati = cfg.accessori || [];
  const qtaAcc = (code) => accSelezionati.find((a) => a.code === code)?.q ?? 0;
  const setQtaAcc = (code, q) => {
    const n = Math.max(0, parseInt(q, 10) || 0);
    const altri = accSelezionati.filter((a) => a.code !== code);
    set({ accessori: n > 0 ? [...altri, { code, q: n }] : altri });
  };

  const extra = cfg.extra || [];
  const setExtra = (i, campo, v) =>
    set({ extra: extra.map((e, k) => (k === i ? { ...e, [campo]: v } : e)) });

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
        <Campo label="Centralina">
          <select
            value={cfg.macchinaCode || ''}
            onChange={(e) => set({ macchinaCode: e.target.value })}
            disabled={soloLettura}
            className={input}
          >
            {macchine.map((m) => (
              <option key={m.code} value={m.code}>
                {m.label}
              </option>
            ))}
          </select>
        </Campo>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Campo label="Tubo linea">
          <select
            value={cfg.tuboCode || ''}
            onChange={(e) => set({ tuboCode: e.target.value })}
            disabled={soloLettura}
            className={input}
          >
            {s.tubo.map((t) => (
              <option key={t.code} value={t.code}>
                {t.label}
              </option>
            ))}
          </select>
        </Campo>
        <Campo label="Tubo tronco">
          <select
            value={cfg.tuboTroncoCode || ''}
            onChange={(e) => set({ tuboTroncoCode: e.target.value })}
            disabled={soloLettura}
            className={input}
          >
            {s.tubo.map((t) => (
              <option key={t.code} value={t.code}>
                {t.label}
              </option>
            ))}
          </select>
        </Campo>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Campo label="Metri tubo tronco" hint="Tratto di alimentazione, escluso dal perimetro">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="1"
            value={cfg.mTronco ?? DEFAULTS.mTronco}
            onChange={(e) => set({ mTronco: e.target.value })}
            disabled={soloLettura}
            className={input}
          />
        </Campo>
        <Campo label="Metri riser per ugello" hint="Solo per il montaggio con prolunga">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.5"
            value={cfg.riserM ?? DEFAULTS.riserM}
            onChange={(e) => set({ riserM: e.target.value })}
            disabled={soloLettura}
            className={input}
          />
        </Campo>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Campo label="Ugello">
          <select
            value={cfg.ugelloCode || ''}
            onChange={(e) => set({ ugelloCode: e.target.value })}
            disabled={soloLettura}
            className={input}
          >
            {s.ugello.map((u) => (
              <option key={u.code} value={u.code}>
                {u.label}
              </option>
            ))}
          </select>
        </Campo>
        <Campo label="Raccordo a T">
          <select
            value={cfg.tselCode || ''}
            onChange={(e) => set({ tselCode: e.target.value })}
            disabled={soloLettura}
            className={input}
          >
            {s.tsel.map((t) => (
              <option key={t.code} value={t.code}>
                {t.label}
              </option>
            ))}
          </select>
        </Campo>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Campo label="Portaugello dritto">
          <select
            value={cfg.portaDCode || ''}
            onChange={(e) => set({ portaDCode: e.target.value })}
            disabled={soloLettura}
            className={input}
          >
            {portaPerTipo(brand, 'd').map((p) => (
              <option key={p.code} value={p.code}>
                {p.label}
              </option>
            ))}
          </select>
        </Campo>
        <Campo label="Portaugello 90°">
          <select
            value={cfg.porta9Code || ''}
            onChange={(e) => set({ porta9Code: e.target.value })}
            disabled={soloLettura}
            className={input}
          >
            {portaPerTipo(brand, 'a').map((p) => (
              <option key={p.code} value={p.code}>
                {p.label}
              </option>
            ))}
          </select>
        </Campo>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={cfg.usaTappo ?? DEFAULTS.usaTappo}
          onChange={(e) => set({ usaTappo: e.target.checked })}
          disabled={soloLettura}
          className="w-4 h-4 accent-green-700"
        />
        Tappo fine linea (uno per linea)
      </label>

      {/* ── Accessori ── */}
      <div className="border-t pt-3">
        <button
          onClick={() => setApriAcc(!apriAcc)}
          className="w-full flex items-center justify-between text-sm font-semibold text-gray-700"
        >
          <span>
            Accessori{' '}
            <span className="text-gray-400 font-normal">
              ({accSelezionati.length} su {accessori.length})
            </span>
          </span>
          {apriAcc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {apriAcc && (
          <div className="mt-2 max-h-72 overflow-y-auto space-y-1 pr-1">
            {accessori.map((a) => {
              const q = qtaAcc(a.code);
              return (
                <div
                  key={a.code}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border ${
                    q > 0 ? 'border-green-300 bg-green-50' : 'border-gray-100'
                  }`}
                >
                  <span className="flex-1 min-w-0 text-xs text-gray-700 truncate" title={a.label}>
                    {a.label}
                  </span>
                  {mostraPrezzi && (
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {(a.priceRaw / (a.div || 1)).toFixed(2)} €
                    </span>
                  )}
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={q || ''}
                    placeholder="0"
                    onChange={(e) => setQtaAcc(a.code, e.target.value)}
                    disabled={soloLettura}
                    className="w-14 border rounded px-1 py-1 text-xs text-center disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Voci extra ── */}
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
                  <input
                    value={e.desc || ''}
                    onChange={(ev) => setExtra(i, 'desc', ev.target.value)}
                    placeholder="Descrizione (es. Paletto PVC 1 m)"
                    disabled={soloLettura}
                    className={input}
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
                <div className="grid grid-cols-3 gap-1.5">
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
                    value={e.costo ?? ''}
                    onChange={(ev) => setExtra(i, 'costo', ev.target.value)}
                    placeholder="costo €"
                    disabled={soloLettura || !mostraPrezzi}
                    className={input}
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={e.prezzo ?? ''}
                    onChange={(ev) => setExtra(i, 'prezzo', ev.target.value)}
                    placeholder="vendita €"
                    disabled={soloLettura || !mostraPrezzi}
                    className={input}
                  />
                </div>
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
