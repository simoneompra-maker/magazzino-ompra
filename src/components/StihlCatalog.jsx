// ============================================================
// StihlCatalog.jsx — Catalogo STIHL 2026 per OMPRA Gestionale
// /src/modules/stihl/StihlCatalog.jsx
// ============================================================
import React, { useState } from 'react'
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

// isAdmin → mostra pannello gestione promozioni
// onBack  → funzione per tornare alla Home (compatibile col routing OMPRA)
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

  const promoCount = results.filter(p => p.promo).length

  // ── Loading ──────────────────────────────────────────────
  if (loading) return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <Header onBack={onBack} isAdmin={isAdmin} />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Caricamento catalogo…</span>
        </div>
      </div>
    </div>
  )

  // ── Errore ───────────────────────────────────────────────
  if (error) return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <Header onBack={onBack} isAdmin={isAdmin} />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-red-950 border border-red-800 rounded-xl p-4 text-center max-w-sm">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-red-300 text-sm font-semibold mb-1">Errore caricamento</div>
          <div className="text-red-400/70 text-xs">{error.message}</div>
        </div>
      </div>
    </div>
  )

  // ── Vista principale ─────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="px-4 pt-safe-top pt-4 pb-2 border-b border-gray-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="text-gray-400 hover:text-white text-xl leading-none"
              >←</button>
            )}
            <div className="flex items-center gap-2">
              <div className="bg-orange-500 text-white text-xs font-black px-2.5 py-1 rounded tracking-wide">
                STIHL
              </div>
              <span className="text-gray-400 text-xs">2026</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {promoCount > 0 && (
              <span className="text-xs bg-red-950 text-red-400 border border-red-900 px-2 py-0.5 rounded-full">
                🏷️ {promoCount} promo
              </span>
            )}
            <span className="text-gray-500 text-xs">{results.length} art.</span>
            {isAdmin && (
              <button
                onClick={() => setShowPromoAdmin(true)}
                className="text-xs bg-gray-800 hover:bg-gray-700 px-2.5 py-1.5 rounded-lg border border-gray-700"
                title="Gestione promozioni"
              >
                🏷️
              </button>
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
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-9 py-2.5 text-sm
                       focus:outline-none focus:border-orange-500 placeholder-gray-600"
            autoComplete="off" autoCorrect="off" spellCheck="false"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >✕</button>
          )}
        </div>

        {/* Filtri rapidi — Alimentazione */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {alimentazioni.map(alim => (
            <button
              key={alim}
              onClick={() => setAlimentazione(alim)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                alimentazione === alim
                  ? 'bg-orange-500 border-orange-500 text-white font-semibold'
                  : 'border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {alim === 'Batteria' ? '🔋' : alim === 'Elettrico' ? '⚡' : alim === 'Miscela' ? '⛽' : ''}
              {' '}{alim}
            </button>
          ))}
        </div>

        {/* Filtro categoria — espandibile */}
        <div>
          <button
            onClick={() => setShowFiltri(f => !f)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <span>{showFiltri ? '▾' : '▸'}</span>
            Categoria
            {categoria !== 'Tutti' && (
              <span className="bg-orange-500 text-white px-1.5 py-0.5 rounded text-xs ml-1">{categoria}</span>
            )}
          </button>
          {showFiltri && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {categorie.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setCategoria(cat); setShowFiltri(false) }}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    categoria === cat
                      ? 'bg-orange-500 border-orange-500 text-white font-semibold'
                      : 'border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'
                  }`}
                >
                  {cat !== 'Tutti' ? (CAT_ICONS[cat] || '📦') + ' ' : ''}{cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lista prodotti */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 pb-safe-bottom pb-4">
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-600">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">Nessun articolo trovato</p>
            {(query || categoria !== 'Tutti' || alimentazione !== 'Tutti') && (
              <button
                onClick={() => { setQuery(''); setCategoria('Tutti'); setAlimentazione('Tutti') }}
                className="mt-3 text-xs text-orange-500 hover:text-orange-400 underline"
              >
                Azzera filtri
              </button>
            )}
          </div>
        ) : (
          results.map(p => <StihlCard key={p.codice} prodotto={p} />)
        )}
      </div>

      {/* Modal promo admin */}
      {showPromoAdmin && isAdmin && (
        <StihlPromoAdmin onClose={() => setShowPromoAdmin(false)} />
      )}
    </div>
  )
}

// ── Sotto-componente header (riutilizzato in loading/error) ──
function Header({ onBack, isAdmin }) {
  return (
    <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-800">
      {onBack && (
        <button onClick={onBack} className="text-gray-400 hover:text-white text-xl leading-none">←</button>
      )}
      <div className="bg-orange-500 text-white text-xs font-black px-2.5 py-1 rounded tracking-wide">STIHL</div>
      <span className="text-gray-400 text-xs">2026</span>
    </div>
  )
}
