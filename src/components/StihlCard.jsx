// ============================================================
// StihlCard.jsx — Card prodotto STIHL con prezzi e specifiche
// /src/modules/stihl/StihlCard.jsx
// ============================================================
import React, { useState } from 'react'

const FUEL_BADGE = {
  batteria: 'bg-green-100 text-green-700 border-green-300',
  elettrico: 'bg-blue-100 text-blue-700 border-blue-300',
  miscela:   'bg-amber-100 text-amber-700 border-amber-300',
  benzina:   'bg-orange-100 text-orange-700 border-orange-300',
}

function fuelKey(alim) {
  const a = (alim || '').toLowerCase()
  if (a.includes('batteria') || /\bak\b|\bap\b|\bar\b|\bas\b/.test(a)) return 'batteria'
  if (a.includes('elettric')) return 'elettrico'
  if (a.includes('miscela') || a.includes('mix') || a.includes('injection')) return 'miscela'
  return 'benzina'
}

function fmt(n, dec = 2) {
  if (n == null) return null
  return n.toLocaleString('it-IT', { minimumFractionDigits: dec, maximumFractionDigits: dec })
}

export default function StihlCard({ prodotto: p, inCompare = false, compareDisabled = false, onCompareToggle }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const fk = fuelKey(p.alimentazione)
  const fc = FUEL_BADGE[fk] || FUEL_BADGE.benzina
  const extra = p.extra || {}
  const promo = p.promo

  function copyCode() {
    navigator.clipboard?.writeText(p.codice).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  const prezzoAttivo   = promo ? promo.prezzo_promo : p.prezzo_vendita
  const prezzoBarrato  = promo ? p.prezzo_vendita   : p.prezzo_listino
  const soloListino    = !prezzoAttivo && p.prezzo_listino

  return (
    <div
      className={`rounded-xl border transition-all cursor-pointer select-none
        ${open
          ? 'border-orange-600 bg-white shadow-lg shadow-orange-200/60'
          : 'border-gray-200 bg-white hover:border-gray-400'}`}
    >
      {/* ── Riga principale ─────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3" onClick={() => setOpen(o => !o)}>

        {/* Info sinistra */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-base text-gray-900">{p.modello}</span>
            {promo && (
              <span className="text-xs bg-red-100 text-red-600 border border-red-300 px-1.5 py-0.5 rounded font-semibold">
                🏷️ {promo.etichetta || 'PROMO'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className={`text-xs border px-2 py-0.5 rounded-full ${fc}`}>{p.alimentazione}</span>
            <span className="text-xs border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">{p.categoria}</span>
            {p.batteria_cons && (
              <span className="text-xs border border-green-300 text-green-700 px-2 py-0.5 rounded-full">
                ⚡ {p.batteria_cons}
              </span>
            )}
          </div>
        </div>

        {/* Prezzi */}
        <div className="flex flex-col items-end shrink-0">
          {prezzoBarrato && prezzoAttivo && (
            <span className="text-sm text-gray-500 line-through">€ {fmt(prezzoBarrato, 0)}</span>
          )}
          {prezzoAttivo ? (
            <span className={`text-lg font-bold ${promo ? 'text-red-600' : 'text-orange-400'}`}>
              € {fmt(prezzoAttivo)}
            </span>
          ) : soloListino ? (
            <span className="text-lg font-bold text-gray-500">€ {fmt(soloListino, 0)}</span>
          ) : (
            <span className="text-xs text-gray-400 italic">su richiesta</span>
          )}
          {promo && (
            <span className="text-xs text-red-500">scade in {promo.giorni_rimasti}gg</span>
          )}
        </div>

        {/* Bottone confronto */}
        {onCompareToggle && (
          <button
            onClick={e => { e.stopPropagation(); onCompareToggle() }}
            disabled={compareDisabled}
            title={inCompare ? 'Rimuovi dal confronto' : compareDisabled ? 'Categoria diversa' : 'Aggiungi al confronto'}
            className={`shrink-0 text-xs px-2 py-1 rounded-lg border transition-colors
              ${inCompare
                ? 'bg-orange-500 border-orange-500 text-gray-900'
                : compareDisabled
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-200 text-gray-500 hover:border-orange-500 hover:text-orange-400'
              }`}
          >
            {inCompare ? '⚖️ ✓' : '⚖️'}
          </button>
        )}
        <div className={`text-gray-400 text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</div>
      </div>

      {/* ── Dettaglio espanso ────────────────────────────── */}
      {open && (
        <div className="px-4 pb-4 border-t border-gray-200 pt-3 space-y-3">

          {/* Codice articolo */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="text-gray-400">Codice</span>
            <code className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-gray-200 font-mono tracking-wide">
              {p.codice}
            </code>
          </div>

          {/* Specifiche tecniche */}
          {Object.keys(extra).length > 0 && (
            <div className="grid grid-cols-3 gap-1.5">
              {extra.spranga_cm    && <Spec label="Spranga"    val={extra.spranga_cm + ' cm'} />}
              {extra.lama_cm       && <Spec label="Lama"       val={extra.lama_cm + ' cm'} />}
              {extra.asta_cm       && <Spec label="Asta"       val={extra.asta_cm + ' cm'} />}
              {extra.cilindrata_cc && <Spec label="Cilindrata" val={extra.cilindrata_cc + ' cc'} />}
              {extra.potenza_kw    && <Spec label="Potenza"    val={extra.potenza_kw + ' kW'} />}
              {extra.peso_kg       && <Spec label="Peso"       val={extra.peso_kg + ' kg'} />}
              {extra.durata_min    && <Spec label="Autonomia"  val={'≤ ' + extra.durata_min + ' min'} highlight />}
            </div>
          )}

          {/* Note / tag */}
          {p.note && (
            <div className="flex flex-wrap gap-1">
              {p.note.split(' · ').map((n, i) => {
                const isNew = /novit/i.test(n)
                return (
                  <span key={i} className={`text-xs px-2 py-0.5 rounded border ${
                    isNew
                      ? 'bg-red-950 text-red-600 border-red-900 font-bold'
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    {isNew ? '✨ Novità' : n}
                  </span>
                )
              })}
            </div>
          )}

          {/* Grafico autonomia batteria */}
          {p.battery_data && <BatteryBlock data={p.battery_data} />}

          {/* Badge promo scadenza */}
          {promo && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-600">
              <div className="font-semibold mb-0.5">🏷️ {promo.etichetta || 'Promozione attiva'}</div>
              <div>Scade il {new Date(promo.al).toLocaleDateString('it-IT')} ({promo.giorni_rimasti} giorni)</div>
            </div>
          )}

          {/* Riepilogo prezzi completo */}
          {(p.prezzo_listino || prezzoAttivo) && (
            <div className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5 space-y-1.5">
              {p.prezzo_listino && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Listino</span>
                  <span className="text-gray-400">€ {fmt(p.prezzo_listino)}</span>
                </div>
              )}
              {p.prezzo_vendita && !promo && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">OMPRA</span>
                  <span className="font-semibold text-orange-400">€ {fmt(p.prezzo_vendita)}</span>
                </div>
              )}
              {promo && (
                <>
                  {p.prezzo_vendita && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">OMPRA</span>
                      <span className="text-gray-500 line-through">€ {fmt(p.prezzo_vendita)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600 font-semibold">🏷️ Promo</span>
                    <span className="font-bold text-red-600">€ {fmt(promo.prezzo_promo)}</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Copia codice */}
          <button
            onClick={copyCode}
            className="w-full flex items-center justify-center gap-2 text-xs bg-gray-100
                       hover:bg-gray-200 border border-gray-200 rounded-lg py-2 transition-colors"
          >
            <span>{copied ? '✅' : '📋'}</span>
            {copied ? 'Codice copiato!' : `Copia: ${p.codice}`}
          </button>
        </div>
      )}
    </div>
  )
}

function Spec({ label, val, highlight }) {
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-lg px-2 py-1.5">
      <div className="text-sm text-gray-500 mb-0.5">{label}</div>
      <div className={`text-sm font-semibold ${highlight ? 'text-orange-400' : 'text-gray-900'}`}>{val}</div>
    </div>
  )
}

function BatteryBlock({ data }) {
  if (!data?.batterie?.length) return null
  const maxVal = Math.max(...data.batterie.map(b => b.val || 0))
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2.5">
        ⚡ Autonomia — Serie {data.serie}
      </div>
      <div className="space-y-2">
        {data.batterie.map((b, i) => {
          const pct    = b.val && maxVal ? Math.round(b.val / maxVal * 100) : 0
          const rec    = !!b.raccomandata
          const incompat = !!b.incompatibile
          return (
            <div key={i} className={`flex items-center gap-2 ${incompat ? 'opacity-25' : ''}`}>
              <div className="flex items-center gap-1 min-w-[96px]">
                <span className={`text-xs font-semibold ${rec ? 'text-orange-400' : 'text-gray-400'}`}>
                  {b.nome}
                </span>
                {rec && <span className="text-orange-500 text-xs">★</span>}
              </div>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${rec ? 'bg-orange-500' : 'bg-gray-400'}`}
                  style={{ width: pct + '%' }}
                />
              </div>
              <span className={`text-xs min-w-[64px] text-right tabular-nums
                ${rec ? 'text-orange-400 font-bold' : incompat ? 'text-gray-400' : 'text-gray-500'}`}>
                {incompat ? '—' : b.val ? b.val + '\u00a0' + b.unita : '—'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
