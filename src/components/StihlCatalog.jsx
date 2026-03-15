// ============================================================
// StihlCatalog.jsx — Catalogo STIHL 2026 per OMPRA Gestionale
// ============================================================
import React, { useState, useMemo } from 'react'
import { useStihlCatalog, useStihlPromo, useStihlSearch } from './useStihl'
import StihlCard from './StihlCard'
import StihlPromoAdmin from './StihlPromoAdmin'

const CAT_ICONS = {
  'Motoseghe':              '🪚',
  'Motoseghe edilizia':     '🏗️',
  'Potatori':               '✂️',
  'Potatori da giardino':   '🌿',
  'Cesoie a batteria':      '✂️',
  'Decespugliatori':        '🌾',
  'Tosasiepi':              '🌳',
  'Tagliasiepi allungati':  '📏',
  'Tosaerba':               '🟩',
  'Trattorini':             '🚜',
  'Arieggiatori':           '🍃',
  'Soffiatori':             '🌬️',
  'Soffiatori dorsali':     '🎒',
  'Motozappe':              '⛏️',
  'Irroratori':             '💧',
  'Pompe':                  '🔧',
  'Idropulitrici':          '💦',
  'Biotrituratori':         '♻️',
  'Troncatrici':            '🔩',
  'Sistema Kombi':          '🔗',
  'Sistema Multi':          '⚙️',
  'Trivelle':               '🕳️',
  'Raccoglitori speciali':  '🫒',
  'Aspiratori-trituratori': '🌀',
  'Aspiratori':             '🧹',
  'Spazzatrici':            '🫧',
  'Compressori':            '🔵',
}

// Raggruppa categorie simili per il confronto
function getCompareGroup(categoria) {
  const c = (categoria || '').toLowerCase()
  if (c.includes('motosega') || c.includes('motoseghe')) return 'motoseghe'
  if (c.includes('tosasiepe') || c.includes('tosasiepi')) return 'tosasiepi'
  if (c.includes('tosaerba'))  return 'tosaerba'
  if (c.includes('trattorino') || c.includes('trattorini')) return 'trattorini'
  if (c.includes('kombi') || c.includes('multi')) return 'kombi'
  if (c.includes('decespugliatore') || c.includes('decespugliatori')) return 'decespugliatori'
  if (c.includes('soffiatore') || c.includes('soffiatori')) return 'soffiatori'
  if (c.includes('potat')) return 'potatori'
  if (c.includes('cesoi')) return 'cesoie'
  if (c.includes('arieggiator')) return 'arieggiatori'
  return c
}

// Definisce le righe di confronto per gruppo
const COMPARE_ROWS = {
  motoseghe: [
    { key: 'alimentazione',   label: 'Alimentazione',   unit: '',    better: null,    from: 'root' },
    { key: 'prezzo',          label: 'Prezzo OMPRA',    unit: '€',   better: 'lower', from: 'price' },
    { key: 'peso_kg',         label: 'Peso',            unit: 'kg',  better: 'lower', from: 'extra' },
    { key: 'potenza_kw',      label: 'Potenza',         unit: 'kW',  better: 'higher',from: 'extra' },
    { key: 'potenza_cv',      label: 'Potenza',         unit: 'CV',  better: 'higher',from: 'extra' },
    { key: 'cilindrata_cc',   label: 'Cilindrata',      unit: 'cm³', better: null,    from: 'extra' },
    { key: 'spranga_cm',      label: 'Spranga max',     unit: 'cm',  better: null,    from: 'extra' },
    { key: 'db_pressione',    label: 'Rumorosità',      unit: 'dB(A)',better: 'lower',from: 'extra' },
    { key: 'vibrazioni_sx',   label: 'Vibrazioni sx',   unit: 'm/s²',better: 'lower',from: 'extra' },
    { key: 'vibrazioni_dx',   label: 'Vibrazioni dx',   unit: 'm/s²',better: 'lower',from: 'extra' },
    { key: 'batteria_cons',   label: 'Batteria cons.',  unit: '',    better: null,    from: 'root' },
  ],
  tosasiepi: [
    { key: 'alimentazione',   label: 'Alimentazione',   unit: '',    better: null,    from: 'root' },
    { key: 'prezzo',          label: 'Prezzo OMPRA',    unit: '€',   better: 'lower', from: 'price' },
    { key: 'peso_kg',         label: 'Peso',            unit: 'kg',  better: 'lower', from: 'extra' },
    { key: 'potenza_kw',      label: 'Potenza',         unit: 'kW',  better: 'higher',from: 'extra' },
    { key: 'cilindrata_cc',   label: 'Cilindrata',      unit: 'cm³', better: null,    from: 'extra' },
    { key: 'colpi_min',       label: 'Colpi/min',       unit: 'min⁻¹',better:'higher',from: 'extra' },
    { key: 'passo_denti_mm',  label: 'Passo denti',     unit: 'mm',  better: 'higher',from: 'extra' },
    { key: 'db_pressione',    label: 'Rumorosità',      unit: 'dB(A)',better: 'lower',from: 'extra' },
    { key: 'batteria_cons',   label: 'Batteria cons.',  unit: '',    better: null,    from: 'root' },
  ],
  tosaerba: [
    { key: 'alimentazione',   label: 'Alimentazione',   unit: '',    better: null,    from: 'root' },
    { key: 'prezzo',          label: 'Prezzo OMPRA',    unit: '€',   better: 'lower', from: 'price' },
    { key: 'peso_kg',         label: 'Peso',            unit: 'kg',  better: 'lower', from: 'extra' },
    { key: 'potenza_kw',      label: 'Potenza',         unit: 'kW',  better: 'higher',from: 'extra' },
    { key: 'cilindrata_cc',   label: 'Cilindrata',      unit: 'cm³', better: null,    from: 'extra' },
    { key: 'larghezza_taglio_cm', label: 'Largh. taglio', unit: 'cm', better: 'higher', from: 'extra' },
    { key: 'cesto_l',         label: 'Cesto raccolta',  unit: 'L',   better: 'higher',from: 'extra' },
    { key: 'altezza_regolazioni', label: 'Pos. altezza', unit: '',   better: 'higher',from: 'extra' },
    { key: 'altezza_taglio_mm',   label: 'Range altezza',unit: 'mm', better: null,    from: 'extra' },
    { key: 'superfici_m2',    label: 'Superficie max',  unit: 'm²',  better: 'higher',from: 'extra' },
    { key: 'db_pressione',    label: 'Rumorosità',      unit: 'dB(A)',better: 'lower',from: 'extra' },
    { key: 'batteria_cons',   label: 'Batteria cons.',  unit: '',    better: null,    from: 'root' },
  ],
  kombi: [
    { key: 'alimentazione',   label: 'Alimentazione',   unit: '',    better: null,    from: 'root' },
    { key: 'prezzo',          label: 'Prezzo OMPRA',    unit: '€',   better: 'lower', from: 'price' },
    { key: 'peso_kg',         label: 'Peso',            unit: 'kg',  better: 'lower', from: 'extra' },
    { key: 'potenza_kw',      label: 'Potenza',         unit: 'kW',  better: 'higher',from: 'extra' },
    { key: 'cilindrata_cc',   label: 'Cilindrata',      unit: 'cm³', better: null,    from: 'extra' },
    { key: 'lunghezza_cm',    label: 'Lunghezza',       unit: 'cm',  better: null,    from: 'extra' },
    { key: 'db_pressione',    label: 'Rumorosità',      unit: 'dB(A)',better: 'lower',from: 'extra' },
    { key: 'batteria_cons',   label: 'Batteria cons.',  unit: '',    better: null,    from: 'root' },
  ],
  _default: [
    { key: 'alimentazione',   label: 'Alimentazione',   unit: '',    better: null,    from: 'root' },
    { key: 'prezzo',          label: 'Prezzo OMPRA',    unit: '€',   better: 'lower', from: 'price' },
    { key: 'peso_kg',         label: 'Peso',            unit: 'kg',  better: 'lower', from: 'extra' },
    { key: 'potenza_kw',      label: 'Potenza',         unit: 'kW',  better: 'higher',from: 'extra' },
    { key: 'cilindrata_cc',   label: 'Cilindrata',      unit: 'cm³', better: null,    from: 'extra' },
    { key: 'db_pressione',    label: 'Rumorosità',      unit: 'dB(A)',better: 'lower',from: 'extra' },
    { key: 'batteria_cons',   label: 'Batteria cons.',  unit: '',    better: null,    from: 'root' },
  ],
}

function getRows(gruppo) {
  return COMPARE_ROWS[gruppo] || COMPARE_ROWS._default
}

function getVal(p, row, prezzoVendita) {
  if (row.from === 'root')  return p[row.key] ?? null
  if (row.from === 'price') return prezzoVendita
  if (row.from === 'extra') return (p.extra || {})[row.key] ?? null
  return null
}

function fmtVal(val, row) {
  if (val == null) return null
  if (row.key === 'prezzo') return `€ ${Math.ceil(val).toLocaleString('it-IT')}`
  if (typeof val === 'number') return `${val.toLocaleString('it-IT')} ${row.unit}`.trim()
  return String(val)
}

function calcPrezzoVendita(p) {
  if (!p.prezzo_vendita) return null
  return Math.min(Math.ceil(p.prezzo_vendita), p.prezzo_listino ?? Infinity)
}

// ── Modal confronto ──────────────────────────────────────────
function CompareModal({ prodotti, onClose }) {
  if (!prodotti.length) return null
  const gruppo = getCompareGroup(prodotti[0].categoria)
  const rows = getRows(gruppo)
  const prezzi = prodotti.map(p => calcPrezzoVendita(p))

  // Per ogni riga, calcola il best value tra i prodotti
  function getBestIdx(row) {
    if (!row.better) return null
    const vals = prodotti.map((p, i) => getVal(p, row, prezzi[i]))
    const nums  = vals.map(v => typeof v === 'number' ? v : null)
    const valid = nums.filter(n => n != null)
    if (valid.length < 2) return null
    const best = row.better === 'lower' ? Math.min(...valid) : Math.max(...valid)
    return nums.indexOf(best)
  }

  // Filtra righe che hanno almeno un valore nei prodotti selezionati
  const visibleRows = rows.filter(row =>
    prodotti.some((p, i) => getVal(p, row, prezzi[i]) != null)
  )

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl border border-gray-200
                      max-h-[92vh] flex flex-col overflow-hidden rounded-t-2xl">

        {/* Header modale */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
          <span className="text-base font-bold text-gray-900">⚖️ Confronto prodotti</span>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-xl leading-none">✕</button>
        </div>

        {/* Intestazioni prodotti */}
        <div className="grid border-b border-gray-200 shrink-0"
             style={{ gridTemplateColumns: `140px repeat(${prodotti.length}, 1fr)` }}>
          <div className="p-2" />
          {prodotti.map((p, i) => (
            <div key={i} className="p-2 border-l border-gray-200 text-center">
              <div className="text-sm font-bold text-orange-600 leading-tight">{p.modello}</div>
              <div className="text-sm text-gray-400 mt-0.5">{p.categoria}</div>
              {p.promo && (
                <span className="text-xs bg-red-100 text-red-600 border border-red-300 px-1 rounded">
                  🏷️ PROMO
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Righe specs */}
        <div className="overflow-y-auto flex-1">
          {visibleRows.map((row, ri) => {
            const bestIdx = getBestIdx(row)
            return (
              <div key={ri}
                   className={`grid border-b border-gray-200/50 ${ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                   style={{ gridTemplateColumns: `140px repeat(${prodotti.length}, 1fr)` }}>
                {/* Label */}
                <div className="px-3 py-2.5 flex items-center">
                  <span className="text-sm text-gray-500">{row.label}</span>
                </div>
                {/* Valori */}
                {prodotti.map((p, i) => {
                  const val = getVal(p, row, prezzi[i])
                  const display = fmtVal(val, row)
                  const isBest = bestIdx === i
                  return (
                    <div key={i} className="px-2 py-2.5 border-l border-gray-200 text-center flex items-center justify-center">
                      {display != null ? (
                        <span className={`text-sm font-semibold rounded px-1.5 py-0.5 ${
                          isBest
                            ? 'bg-green-950 text-green-400 border border-green-800'
                            : 'text-gray-400'
                        }`}>
                          {display}
                          {isBest && <span className="ml-1 text-green-500">★</span>}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-sm">—</span>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* Footer prezzi */}
        <div className="border-t border-gray-200 px-4 py-3 shrink-0">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${prodotti.length}, 1fr)` }}>
            {prodotti.map((p, i) => {
              const pv = prezzi[i]
              const pl = p.prezzo_listino
              return (
                <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg px-2 py-2 text-center">
                  <div className="text-xs text-gray-500 truncate mb-0.5">{p.modello}</div>
                  {pl && <div className="text-xs text-gray-400 line-through">€ {pl.toLocaleString('it-IT')}</div>}
                  {pv
                    ? <div className="text-sm font-bold text-orange-400">€ {Math.ceil(pv).toLocaleString('it-IT')}</div>
                    : <div className="text-xs text-gray-500 italic">su richiesta</div>
                  }
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Barra confronto fissa in basso ───────────────────────────
function CompareBar({ selected, onRemove, onCompare, onClear }) {
  if (!selected.length) return null
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200
                    px-3 py-2 flex items-center gap-2 shadow-2xl">
      <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-none">
        {selected.map(p => (
          <div key={p.codice}
               className="flex items-center gap-1.5 bg-orange-50 border border-orange-200
                          rounded-lg px-2 py-1 shrink-0 text-sm">
            <span className="text-orange-400 font-semibold max-w-[80px] truncate">{p.modello}</span>
            <button onClick={() => onRemove(p.codice)}
                    className="text-gray-500 hover:text-red-600 leading-none">✕</button>
          </div>
        ))}
        {/* Slot vuoti */}
        {Array.from({ length: 3 - selected.length }).map((_, i) => (
          <div key={`empty-${i}`}
               className="flex items-center border border-dashed border-gray-200
                          rounded-lg px-3 py-1 shrink-0 text-sm text-gray-300">
            + prodotto
          </div>
        ))}
      </div>
      <button onClick={onClear}
              className="text-xs text-gray-500 hover:text-gray-400 px-2 shrink-0">
        ✕
      </button>
      <button
        onClick={onCompare}
        disabled={selected.length < 2}
        className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors
                   disabled:opacity-40 disabled:cursor-not-allowed
                   bg-orange-500 hover:bg-orange-400 text-gray-900"
      >
        ⚖️ Confronta {selected.length > 0 ? `(${selected.length})` : ''}
      </button>
    </div>
  )
}

// ── Componente principale ─────────────────────────────────────
export default function StihlCatalog({ isAdmin = false, onBack }) {
  const { prodotti, loading, error } = useStihlCatalog()
  const promoMap = useStihlPromo()
  const {
    results, query, setQuery,
    categoria, setCategoria, categorie,
    alimentazione, setAlimentazione, alimentazioni,
  } = useStihlSearch(prodotti, promoMap)

  const [showPromoAdmin, setShowPromoAdmin] = useState(false)
  const [showFiltri, setShowFiltri]         = useState(false)

  // ── Confronto ──────────────────────────────────────────────
  const [compareList, setCompareList] = useState([])   // array di prodotti selezionati
  const [showCompare, setShowCompare] = useState(false)

  const compareGroup = compareList.length ? getCompareGroup(compareList[0].categoria) : null

  function toggleCompare(prodotto) {
    setCompareList(prev => {
      const già = prev.find(p => p.codice === prodotto.codice)
      if (già) return prev.filter(p => p.codice !== prodotto.codice)
      if (prev.length >= 3) return prev   // max 3
      return [...prev, prodotto]
    })
  }

  function canCompare(prodotto) {
    if (compareList.length === 0) return true
    if (compareList.find(p => p.codice === prodotto.codice)) return true  // già selezionato
    if (compareList.length >= 3) return false
    // stesso gruppo
    return getCompareGroup(prodotto.categoria) === compareGroup
  }
  // ──────────────────────────────────────────────────────────

  const promoCount = results.filter(p => p.promo).length

  if (loading) return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900">
      <Header onBack={onBack} isAdmin={isAdmin} />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Caricamento catalogo…</span>
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900">
      <Header onBack={onBack} isAdmin={isAdmin} />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-red-950 border border-red-800 rounded-xl p-4 text-center max-w-sm">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-red-600 text-sm font-semibold mb-1">Errore caricamento</div>
          <div className="text-red-600/70 text-xs">{error.message}</div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900">

      {/* Header */}
      <div className="px-4 pt-safe-top pt-4 pb-2 border-b border-gray-200 space-y-3 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="text-gray-500 hover:text-gray-900 text-xl leading-none">←</button>
            )}
            <div className="flex items-center gap-2">
              <div className="bg-orange-500 text-gray-900 text-xs font-black px-2.5 py-1 rounded tracking-wide">STIHL</div>
              <span className="text-gray-400 text-xs">2026</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {promoCount > 0 && (
              <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
                🏷️ {promoCount} promo
              </span>
            )}
            <span className="text-gray-400 text-sm">{results.length} art.</span>
            {isAdmin && (
              <button
                onClick={() => setShowPromoAdmin(true)}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg border border-gray-200"
                title="Gestione promozioni"
              >🏷️</button>
            )}
          </div>
        </div>

        {/* Ricerca */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            type="search"
            placeholder="Modello, codice, categoria…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-9 py-2.5 text-sm
                       focus:outline-none focus:border-orange-500 placeholder-gray-400 text-gray-900"
            autoComplete="off" autoCorrect="off" spellCheck="false"
          />
          {query && (
            <button onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900">✕</button>
          )}
        </div>

        {/* Filtri alimentazione */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {alimentazioni.map(alim => (
            <button key={alim} onClick={() => setAlimentazione(alim)}
                    className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      alimentazione === alim
                        ? 'bg-orange-500 border-orange-500 text-gray-900 font-semibold'
                        : 'border-gray-200 text-gray-500 hover:border-gray-400'
                    }`}>
              {alim === 'Batteria' ? '🔋' : alim === 'Elettrico' ? '⚡' : alim === 'Miscela' ? '⛽' : ''}
              {' '}{alim}
            </button>
          ))}
        </div>

        {/* Filtro categoria */}
        <div>
          <button onClick={() => setShowFiltri(f => !f)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors">
            <span>{showFiltri ? '▾' : '▸'}</span>
            Categoria
            {categoria !== 'Tutti' && (
              <span className="bg-orange-500 text-gray-900 px-1.5 py-0.5 rounded text-xs ml-1">{categoria}</span>
            )}
          </button>
          {showFiltri && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {categorie.map(cat => (
                <button key={cat} onClick={() => { setCategoria(cat); setShowFiltri(false) }}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          categoria === cat
                            ? 'bg-orange-500 border-orange-500 text-gray-900 font-semibold'
                            : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-400'
                        }`}>
                  {cat !== 'Tutti' ? (CAT_ICONS[cat] || '📦') + ' ' : ''}{cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lista prodotti — padding bottom per barra confronto */}
      <div className={`flex-1 overflow-y-auto px-3 py-2 space-y-2 ${compareList.length ? 'pb-20' : 'pb-4'}`}>
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-base text-gray-500">Nessun articolo trovato</p>
            {(query || categoria !== 'Tutti' || alimentazione !== 'Tutti') && (
              <button onClick={() => { setQuery(''); setCategoria('Tutti'); setAlimentazione('Tutti') }}
                      className="mt-3 text-xs text-orange-500 hover:text-orange-400 underline">
                Azzera filtri
              </button>
            )}
          </div>
        ) : (
          results.map(p => (
            <StihlCard
              key={p.codice}
              prodotto={p}
              inCompare={!!compareList.find(c => c.codice === p.codice)}
              compareDisabled={!canCompare(p)}
              onCompareToggle={() => toggleCompare(p)}
            />
          ))
        )}
      </div>

      {/* Barra confronto fissa */}
      <CompareBar
        selected={compareList}
        onRemove={cod => setCompareList(prev => prev.filter(p => p.codice !== cod))}
        onCompare={() => setShowCompare(true)}
        onClear={() => setCompareList([])}
      />

      {/* Modal confronto */}
      {showCompare && (
        <CompareModal
          prodotti={compareList}
          onClose={() => setShowCompare(false)}
        />
      )}

      {/* Modal promo admin */}
      {showPromoAdmin && isAdmin && (
        <StihlPromoAdmin onClose={() => setShowPromoAdmin(false)} />
      )}
    </div>
  )
}

function Header({ onBack, isAdmin }) {
  return (
    <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 bg-white">
      {onBack && (
        <button onClick={onBack} className="text-gray-500 hover:text-gray-900 text-xl leading-none">←</button>
      )}
      <div className="bg-orange-500 text-gray-900 text-xs font-black px-2.5 py-1 rounded tracking-wide">STIHL</div>
      <span className="text-gray-400 text-xs">2026</span>
    </div>
  )
}
