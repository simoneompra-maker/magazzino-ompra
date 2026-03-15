// ============================================================
// StihlPromoAdmin.jsx — Pannello gestione promozioni
// Visibile solo agli admin, si apre come modal
// ============================================================
import React, { useState } from 'react'
import { useStihlPromoAdmin, useStihlCatalog } from './useStihl'

export default function StihlPromoAdmin({ onClose }) {
  const { promo, addPromo, togglePromo, deletePromo } = useStihlPromoAdmin()
  const { prodotti } = useStihlCatalog()
  const [form, setForm] = useState({
    codice: '', prezzo_promo: '', dal: today(), al: '', etichetta: ''
  })
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function today() {
    return new Date().toISOString().split('T')[0]
  }

  // Suggerimento prodotto per il campo codice
  const suggestions = search.length >= 2
    ? prodotti.filter(p =>
        p.modello.toLowerCase().includes(search.toLowerCase()) ||
        p.codice.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 6)
    : []

  async function handleAdd(e) {
    e.preventDefault()
    setError('')
    if (!form.codice || !form.prezzo_promo || !form.dal || !form.al) {
      setError('Compila tutti i campi obbligatori')
      return
    }
    if (form.al < form.dal) { setError('La data fine deve essere dopo la data inizio'); return }
    setSaving(true)
    const err = await addPromo({
      codice: form.codice,
      prezzo_promo: parseFloat(form.prezzo_promo),
      dal: form.dal,
      al: form.al,
      etichetta: form.etichetta || null
    })
    setSaving(false)
    if (err) { setError(err.message); return }
    setForm({ codice: '', prezzo_promo: '', dal: today(), al: '', etichetta: '' })
    setSearch('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <div className="font-semibold text-sm">🏷️ Gestione Promozioni STIHL</div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-lg">✕</button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">

          {/* Form nuova promo */}
          <form onSubmit={handleAdd} className="bg-gray-800 rounded-xl p-3 space-y-3">
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Nuova promozione</div>

            {/* Ricerca prodotto */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cerca modello o codice…"
                value={search}
                onChange={e => { setSearch(e.target.value); setForm(f => ({...f, codice: ''})) }}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:border-orange-500 placeholder-gray-500"
              />
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 bg-gray-800 border border-gray-700
                                rounded-lg mt-1 overflow-hidden shadow-xl">
                  {suggestions.map(p => (
                    <button
                      key={p.codice}
                      type="button"
                      onClick={() => {
                        setForm(f => ({...f, codice: p.codice,
                          prezzo_promo: p.prezzo_vendita ? String(p.prezzo_vendita) : ''
                        }))
                        setSearch(p.modello + ' — ' + p.codice)
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-700 flex justify-between"
                    >
                      <span className="font-medium">{p.modello}</span>
                      <span className="text-gray-500">{p.codice}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {form.codice && (
              <div className="text-xs text-green-400 bg-green-950 border border-green-900 rounded px-2 py-1">
                ✓ Selezionato: {form.codice}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400">Prezzo promo (€) *</label>
                <input
                  type="number" step="0.01" min="0"
                  placeholder="es. 169.00"
                  value={form.prezzo_promo}
                  onChange={e => setForm(f => ({...f, prezzo_promo: e.target.value}))}
                  className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm
                             focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Etichetta</label>
                <input
                  type="text"
                  placeholder="es. Promo Maggio"
                  value={form.etichetta}
                  onChange={e => setForm(f => ({...f, etichetta: e.target.value}))}
                  className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm
                             focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Dal *</label>
                <input
                  type="date"
                  value={form.dal}
                  onChange={e => setForm(f => ({...f, dal: e.target.value}))}
                  className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm
                             focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Al *</label>
                <input
                  type="date"
                  value={form.al}
                  onChange={e => setForm(f => ({...f, al: e.target.value}))}
                  className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm
                             focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {error && <div className="text-xs text-red-400">{error}</div>}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white
                         text-sm font-semibold py-2 rounded-lg transition-colors"
            >
              {saving ? 'Salvo…' : '+ Aggiungi promozione'}
            </button>
          </form>

          {/* Lista promo esistenti */}
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">
              Promozioni ({promo.length})
            </div>
            {promo.length === 0 ? (
              <div className="text-xs text-gray-600 text-center py-4">Nessuna promozione</div>
            ) : (
              <div className="space-y-2">
                {promo.map(p => (
                  <div key={p.id}
                    className={`flex items-start justify-between bg-gray-800 rounded-xl px-3 py-2.5
                      border ${p.attiva ? 'border-orange-900' : 'border-gray-700 opacity-60'}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white">
                        {p.stihl_prodotti?.modello || p.codice}
                        {p.etichetta && (
                          <span className="ml-1.5 text-orange-400">— {p.etichetta}</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        €{p.prezzo_promo?.toLocaleString('it-IT',{minimumFractionDigits:2})}
                        {' · '}
                        {new Date(p.dal).toLocaleDateString('it-IT')} →{' '}
                        {new Date(p.al).toLocaleDateString('it-IT')}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 ml-2 shrink-0">
                      <button
                        onClick={() => togglePromo(p.id, !p.attiva)}
                        className={`text-xs px-2 py-1 rounded border transition-colors ${
                          p.attiva
                            ? 'border-green-800 text-green-400 hover:bg-green-950'
                            : 'border-gray-700 text-gray-500 hover:bg-gray-700'
                        }`}
                      >
                        {p.attiva ? 'Attiva' : 'Off'}
                      </button>
                      <button
                        onClick={() => deletePromo(p.id)}
                        className="text-xs px-2 py-1 rounded border border-red-900 text-red-500
                                   hover:bg-red-950 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
