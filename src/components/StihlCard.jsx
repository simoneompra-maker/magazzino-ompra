// ============================================================
// StihlCard.jsx — Card prodotto STIHL con prezzi e specifiche
// /src/modules/stihl/StihlCard.jsx
// ============================================================
import React, { useState } from 'react'

const FUEL_BADGE = {
  batteria: 'bg-green-950 text-green-300 border-green-800',
  elettrico: 'bg-blue-950 text-blue-300 border-blue-800',
  miscela:   'bg-amber-950 text-amber-300 border-amber-800',
  benzina:   'bg-orange-950 text-orange-300 border-orange-800',
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

export default function StihlCard({ prodotto: p }) {
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
          ? 'border-orange-600 bg-gray-900 shadow-lg shadow-orange-950/20'
          : 'border-gray-800 bg-gray-900 hover:border-gray-600'}`}
    >
      {/* ── Riga principale ─────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3" onClick={() => setOpen(o => !o)}>

        {/* Info sinistra */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-white">{p.modello}</span>
            {promo && (
              <span className="text-xs bg-red-950 text-red-300 border border-red-800 px-1.5 py-0.5 rounded font-semibold">
                🏷️ {promo.etichetta || 'PROMO'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className={`text-xs border px-2 py-0.5 rounded-full ${fc}`}>{p.alimentazione}</span>
            <span className="text-xs border border-gray-700 text-gray-500 px-2 py-0.5 rounded-full">{p.categoria}</span>
            {p.batteria_cons && (
              <span className="text-xs border border-green-900 text-green-400 px-2 py-0.5 rounded-full">
                ⚡ {p.batteria_cons}
              </span>
            )}
          </div>
        </div>

        {/* Prezzi */}
        <div className="flex flex-col items-end shrink-0">
          {prezzoBarrato && prezzoAttivo && (
            <span className="text-xs text-gray-500 line-through">€ {fmt(prezzoBarrato, 0)}</span>
          )}
          {prezzoAttivo ? (
            <span className={`text-base font-bold ${promo ? 'text-red-400' : 'text-orange-400'}`}>
              € {fmt(prezzoAttivo)}
            </span>
          ) : soloListino ? (
            <span className="text-base font-bold text-gray-400">€ {fmt(soloListino, 0)}</span>
          ) : (
            <span className="text-xs text-gray-600 italic">su richiesta</span>
          )}
          {promo && (
            <span className="text-xs text-red-500">scade in {promo.giorni_rimasti}gg</span>
          )}
        </div>

        <div className={`text-gray-600 text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</div>
      </div>

      {/* ── Dettaglio espanso ────────────────────────────── */}
      {open && (
        <div className="px-4 pb-4 border-t border-gray-800 pt-3 space-y-3">

          {/* Codice articolo */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="text-gray-600">Codice</span>
            <code className="bg-gray-800 border border-gray-700 px-2 py-0.5 rounded text-gray-200 font-mono tracking-wide">
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
                      ? 'bg-red-950 text-red-400 border-red-900 font-bold'
                      : 'bg-gray-800 text-gray-400 border-gray-700'
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
            <div className="bg-red-950 border border-red-900 rounded-lg px-3 py-2 text-xs text-red-300">
              <div className="font-semibold mb-0.5">🏷️ {promo.etichetta || 'Promozione attiva'}</div>
              <div>Scade il {new Date(promo.al).toLocaleDateString('it-IT')} ({promo.giorni_rimasti} giorni)</div>
            </div>
          )}

          {/* Riepilogo prezzi completo */}
          {(p.prezzo_listino || prezzoAttivo) && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 space-y-1.5">
              {p.prezzo_listino && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Listino</span>
                  <span className="text-gray-300">€ {fmt(p.prezzo_listino)}</span>
                </div>
              )}
              {p.prezzo_vendita && !promo && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">OMPRA</span>
                  <span className="font-semibold text-orange-400">€ {fmt(p.prezzo_vendita)}</span>
                </div>
              )}
              {promo && (
                <>
                  {p.prezzo_vendita && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">OMPRA</span>
                      <span className="text-gray-400 line-through">€ {fmt(p.prezzo_vendita)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs">
                    <span className="text-red-400 font-semibold">🏷️ Promo</span>
                    <span className="font-bold text-red-400">€ {fmt(promo.prezzo_promo)}</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Copia codice */}
          <button
            onClick={copyCode}
            className="w-full flex items-center justify-center gap-2 text-xs bg-gray-800
                       hover:bg-gray-700 border border-gray-700 rounded-lg py-2 transition-colors"
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
    <div className="bg-gray-800 border border-gray-700/50 rounded-lg px-2 py-1.5">
      <div className="text-xs text-gray-500 mb-0.5">{label}</div>
      <div className={`text-xs font-semibold ${highlight ? 'text-orange-400' : 'text-white'}`}>{val}</div>
    </div>
  )
}

function BatteryBlock({ data }) {
  if (!data?.batterie?.length) return null
  const maxVal = Math.max(...data.batterie.map(b => b.val || 0))
  return (
    <div className="bg-gray-800 border border-gray-700/50 rounded-xl px-3 py-2.5">
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
                <span className={`text-xs font-semibold ${rec ? 'text-orange-400' : 'text-gray-300'}`}>
                  {b.nome}
                </span>
                {rec && <span className="text-orange-500 text-xs">★</span>}
              </div>
              <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${rec ? 'bg-orange-500' : 'bg-gray-500'}`}
                  style={{ width: pct + '%' }}
                />
              </div>
              <span className={`text-xs min-w-[64px] text-right tabular-nums
                ${rec ? 'text-orange-400 font-bold' : incompat ? 'text-gray-600' : 'text-gray-400'}`}>
                {incompat ? '—' : b.val ? b.val + '\u00a0' + b.unita : '—'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
