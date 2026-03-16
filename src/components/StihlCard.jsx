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

// Traduci codici tecnici in testo leggibile
function fmtSC(val) {
  if (!val) return null
  const s = String(val).trim().toUpperCase()
  if (s === 'SC 1' || s === 'SC1' || s === '1') return 'Smart Connector'
  if (s === 'SC 2A' || s === 'SC2A' || s === '2A') return 'Smart Connector 2A'
  if (s === 'SC 2' || s === 'SC2') return 'Smart Connector 2'
  if (val === true) return 'Smart Connector'
  return null
}

const DOTAZIONI_LABEL = {
  tendicatena_laterale:      'Tendicatena laterale',
  ergostart:                 'STIHL ErgoStart',
  elastostart:               'STIHL ElastoStart',
  m_tronic:                  'STIHL M-Tronic',
  antivibrante:              'Sistema antivibrante',
  pompa_olio_regolabile:     'Pompa olio regolabile',
  pompa_carburante_manuale:  'Pompa carburante manuale',
  tappo_no_utensili:         'Tappo senza utensili',
  valvola_decompressione:    'Valvola decompressione',
  filtro_hd2:                'Filtro HD2',
  filtro_prefiltraggio:      'Filtro con prefiltraggio',
  filtro_tessuto:            'Filtro in tessuto non tessuto',
  impugnatura_morbida:       'Impugnatura morbida',
  impugnatura_multifunzione: 'Impugnatura multifunzione',
  impugnatura_circolare:     'Impugnatura circolare',
  impugnatura_super_morbida: 'Impugnatura super morbida',
  protezione_sovraccarico:   'Protezione sovraccarico',
  constant_power:            'Constant Power',
  injection:                 'STIHL Injection',
  sensore_olio:              'Sensore olio',
  modalita_eco:              'Modalità Eco',
  mulching:                  'Funzione mulching',
  altezza_centralizzata:     'Regolazione altezza centralizzata',
  lama_flusso_ottimizzato:   'Lama a flusso ottimizzato',
  lama_multifunzione:        'Lama multifunzione',
  trazione_pedale:           'Trazione a 1 pedale',
  frizione_elettromagnetica: 'Frizione elettromagnetica',
  freno_frizione_lama:       'Freno-frizione-lama',
  svuotamento_cesto_facile:  'Svuotamento cesto facilitato',
  tracolla:                  'Tracolla inclusa',
  impugnatura_circolare:     'Impugnatura circolare',
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

  // Prezzo OMPRA: arrotondato all'euro superiore, non oltre listino
  const prezzoVendita  = p.prezzo_vendita
    ? Math.min(Math.ceil(p.prezzo_vendita), p.prezzo_listino ?? Infinity)
    : null
  const prezzoAttivo   = promo ? promo.prezzo_promo : prezzoVendita
  const prezzoBarrato  = promo ? prezzoVendita      : p.prezzo_listino
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
            <span className="font-bold text-xl text-gray-900">{p.modello}</span>
            {promo && (
              <span className="text-sm bg-red-100 text-red-700 border border-red-300 px-1.5 py-0.5 rounded font-semibold">
                🏷️ {promo.etichetta || 'PROMO'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className={`text-sm border px-2 py-0.5 rounded-full ${fc}`}>{p.alimentazione}</span>
            <span className="text-sm border border-gray-300 text-gray-800 px-2 py-0.5 rounded-full">{p.categoria}</span>
            {p.batteria_cons && (
              <span className="text-sm border border-green-400 text-green-800 px-2 py-0.5 rounded-full">
                ⚡ {p.batteria_cons}
              </span>
            )}
          </div>
        </div>

        {/* Prezzi */}
        <div className="flex flex-col items-end shrink-0">
          {prezzoBarrato && prezzoAttivo && (
            <span className="text-base text-gray-400 line-through">€ {fmt(prezzoBarrato, 0)}</span>
          )}
          {prezzoAttivo ? (
            <span className={`text-2xl font-bold ${promo ? 'text-red-600' : 'text-orange-400'}`}>
              € {fmt(prezzoAttivo)}
            </span>
          ) : soloListino ? (
            <span className="text-2xl font-bold text-gray-500">€ {fmt(soloListino, 0)}</span>
          ) : (
            <span className="text-sm text-gray-500 italic">su richiesta</span>
          )}
          {promo && (
            <span className="text-sm text-red-600">scade in {promo.giorni_rimasti}gg</span>
          )}
        </div>

        {/* Bottone confronto */}
        {onCompareToggle && (
          <button
            onClick={e => { e.stopPropagation(); onCompareToggle() }}
            disabled={compareDisabled}
            title={inCompare ? 'Rimuovi dal confronto' : compareDisabled ? 'Categoria diversa' : 'Aggiungi al confronto'}
            className={`shrink-0 text-sm px-2 py-1 rounded-lg border transition-colors
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
        <div className={`text-gray-400 text-base transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</div>
      </div>

      {/* ── Dettaglio espanso ────────────────────────────── */}
      {open && (
        <div className="px-4 pb-4 border-t border-gray-200 pt-3 space-y-3">

          {/* Codice articolo */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-gray-400">Codice</span>
            <code className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-gray-800 font-mono tracking-wide">
              {p.codice}
            </code>
          </div>

          {/* Specifiche tecniche */}
          {Object.keys(extra).length > 0 && (
            <div className="grid grid-cols-3 gap-1.5">
              {extra.tipo_motore        && <Spec label="Motore"         val={extra.tipo_motore} />}
              {extra.cilindrata_cc      && <Spec label="Cilindrata"     val={extra.cilindrata_cc + ' cm³'} />}
              {extra.potenza_kw         && <Spec label="Potenza"        val={extra.potenza_kw + ' kW'} />}
              {extra.potenza_cv         && <Spec label="Potenza"        val={extra.potenza_cv + ' CV'} />}
              {extra.peso_kg            && <Spec label="Peso"           val={extra.peso_kg + ' kg'} />}
              {extra.spranga_cm         && <Spec label="Spranga"        val={extra.spranga_cm + ' cm'} />}
              {extra.lama_cm            && <Spec label="Lama"           val={extra.lama_cm + ' cm'} />}
              {extra.asta_cm            && <Spec label="Asta"           val={extra.asta_cm + ' cm'} />}
              {extra.larghezza_taglio_cm && <Spec label="Largh. taglio" val={extra.larghezza_taglio_cm + ' cm'} />}
              {extra.cesto_l            && <Spec label="Cesto raccolta" val={extra.cesto_l + ' L'} />}
              {extra.altezza_regolazioni && <Spec label="Pos. altezza"  val={extra.altezza_regolazioni + ' livelli'} />}
              {extra.colpi_min          && <Spec label="Colpi/min"      val={extra.colpi_min.toLocaleString('it-IT')} />}
              {extra.passo_denti_mm     && <Spec label="Passo denti"    val={extra.passo_denti_mm + ' mm'} />}
              {extra.db_pressione       && <Spec label="Rumorosità"     val={extra.db_pressione + ' dB(A)'} />}
              {extra.vibrazioni_sx      && <Spec label="Vibr. sinistra" val={extra.vibrazioni_sx + ' m/s²'} />}
              {extra.vibrazioni_dx      && <Spec label="Vibr. destra"   val={extra.vibrazioni_dx + ' m/s²'} />}
              {extra.superfici_m2       && <Spec label="Superficie max" val={extra.superfici_m2.toLocaleString('it-IT') + ' m²'} />}
              {extra.durata_min         && <Spec label="Autonomia"      val={'≤ ' + extra.durata_min + ' min'} highlight />}
            </div>
          )}

          {/* Dotazioni */}
          {Object.keys(extra).some(k => DOTAZIONI_LABEL[k] && (extra[k] === true || fmtSC(extra.smart_connector))) && (
            <div className="space-y-1.5">
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Dotazioni di serie</div>
              <div className="flex flex-wrap gap-1.5">
                {extra.smart_connector && fmtSC(extra.smart_connector) && (
                  <DotBadge label={fmtSC(extra.smart_connector)} highlight />
                )}
                {Object.entries(DOTAZIONI_LABEL).map(([key, label]) => (
                  extra[key] === true ? <DotBadge key={key} label={label} /> : null
                ))}
              </div>
            </div>
          )}

          {/* Note / tag */}
          {p.note && (
            <div className="flex flex-wrap gap-1">
              {p.note.split(' · ').map((n, i) => {
                const isNew = /novit/i.test(n)
                return (
                  <span key={i} className={`text-sm px-2 py-0.5 rounded border ${
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
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
              <div className="font-semibold mb-0.5">🏷️ {promo.etichetta || 'Promozione attiva'}</div>
              <div>Scade il {new Date(promo.al).toLocaleDateString('it-IT')} ({promo.giorni_rimasti} giorni)</div>
            </div>
          )}

          {/* Riepilogo prezzi completo */}
          {(p.prezzo_listino || prezzoAttivo) && (
            <div className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5 space-y-1.5">
              {p.prezzo_listino && (
                <div className="flex justify-between text-base">
                  <span className="font-medium text-gray-700">Listino</span>
                  <span className="text-gray-400">€ {fmt(p.prezzo_listino)}</span>
                </div>
              )}
              {p.prezzo_vendita && !promo && (
                <div className="flex justify-between text-base">
                  <span className="font-medium text-gray-700">OMPRA</span>
                  <span className="font-semibold text-orange-400">€ {fmt(p.prezzo_vendita)}</span>
                </div>
              )}
              {promo && (
                <>
                  {p.prezzo_vendita && (
                    <div className="flex justify-between text-base">
                      <span className="font-medium text-gray-700">OMPRA</span>
                      <span className="text-gray-500 line-through">€ {fmt(p.prezzo_vendita)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base">
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
            className="w-full flex items-center justify-center gap-2 text-sm bg-gray-100
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

function DotBadge({ label, highlight }) {
  return (
    <span className={`text-sm px-2.5 py-1 rounded-lg border font-medium
      ${highlight
        ? 'bg-orange-50 text-orange-700 border-orange-200'
        : 'bg-green-50 text-green-800 border-green-200'
      }`}>
      ✓ {label}
    </span>
  )
}

function Spec({ label, val, highlight }) {
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-lg px-2 py-1.5">
      <div className="text-sm font-medium text-gray-600 mb-0.5">{label}</div>
      <div className={`text-base font-bold ${highlight ? 'text-orange-600' : 'text-gray-900'}`}>{val}</div>
    </div>
  )
}

function BatteryBlock({ data }) {
  if (!data?.batterie?.length) return null
  const maxVal = Math.max(...data.batterie.map(b => b.val || 0))
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5">
      <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2.5">
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
                <span className={`text-sm font-semibold ${rec ? 'text-orange-600' : 'text-gray-400'}`}>
                  {b.nome}
                </span>
                {rec && <span className="text-orange-500 text-sm">★</span>}
              </div>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${rec ? 'bg-orange-500' : 'bg-gray-400'}`}
                  style={{ width: pct + '%' }}
                />
              </div>
              <span className={`text-sm min-w-[72px] text-right tabular-nums
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
