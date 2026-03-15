// ============================================================
// useStihl.js — Hook Supabase per catalogo STIHL + promo
// /src/modules/stihl/useStihl.js
// ============================================================
import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../../store'

// ── Catalogo completo ────────────────────────────────────────
export function useStihlCatalog() {
  const [prodotti, setProdotti] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('stihl_prodotti')
        .select('*')
        .order('categoria')
        .order('modello')
      if (cancelled) return
      if (error) { setError(error); setLoading(false); return }
      setProdotti(data || [])
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { prodotti, loading, error }
}

// ── Promo attive oggi (realtime) ─────────────────────────────
export function useStihlPromo() {
  const [promo, setPromo] = useState({})

  async function fetchPromo() {
    const { data } = await supabase.rpc('stihl_promo_attive')
    if (!data) return
    const map = {}
    data.forEach(p => { map[p.codice] = p })
    setPromo(map)
  }

  useEffect(() => {
    fetchPromo()
    const channel = supabase
      .channel('stihl_promo_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stihl_promo' }, fetchPromo)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  return promo
}

// ── Gestione promo (admin) ───────────────────────────────────
export function useStihlPromoAdmin() {
  const [promo, setPromo] = useState([])

  async function fetchAll() {
    const { data } = await supabase
      .from('stihl_promo')
      .select('*, stihl_prodotti(modello)')
      .order('created_at', { ascending: false })
    setPromo(data || [])
  }

  async function addPromo({ codice, prezzo_promo, dal, al, etichetta }) {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('stihl_promo').insert({
      codice, prezzo_promo, dal, al, etichetta,
      created_by: user?.email || 'admin'
    })
    if (!error) fetchAll()
    return error
  }

  async function togglePromo(id, attiva) {
    const { error } = await supabase.from('stihl_promo').update({ attiva }).eq('id', id)
    if (!error) fetchAll()
    return error
  }

  async function deletePromo(id) {
    const { error } = await supabase.from('stihl_promo').delete().eq('id', id)
    if (!error) fetchAll()
    return error
  }

  useEffect(() => { fetchAll() }, [])
  return { promo, addPromo, togglePromo, deletePromo, refresh: fetchAll }
}

// ── Ricerca + filtri ─────────────────────────────────────────
export function useStihlSearch(prodotti, promoMap) {
  const [query, setQuery]         = useState('')
  const [categoria, setCategoria] = useState('Tutti')
  const [alimentazione, setAlimentazione] = useState('Tutti')

  const categorie = useMemo(() => {
    const s = new Set(prodotti.map(p => p.categoria).filter(Boolean))
    return ['Tutti', ...Array.from(s).sort()]
  }, [prodotti])

  const alimentazioni = useMemo(() => {
    const s = new Set(prodotti.map(p => {
      const a = p.alimentazione || ''
      if (a.toLowerCase().includes('batteria') || a.startsWith('Batteria')) return 'Batteria'
      if (a.toLowerCase().includes('elettric')) return 'Elettrico'
      if (a.toLowerCase().includes('miscela') || a.toLowerCase().includes('mix')) return 'Miscela'
      return null
    }).filter(Boolean))
    return ['Tutti', ...Array.from(s).sort()]
  }, [prodotti])

  const normalize = s => (s || '').toLowerCase().replace(/[-_\s]/g, '')

  const results = useMemo(() => {
    let list = prodotti
    if (categoria !== 'Tutti') list = list.filter(p => p.categoria === categoria)
    if (alimentazione !== 'Tutti') {
      list = list.filter(p => {
        const a = p.alimentazione || ''
        if (alimentazione === 'Batteria') return a.toLowerCase().includes('batteria')
        if (alimentazione === 'Elettrico') return a.toLowerCase().includes('elettric')
        if (alimentazione === 'Miscela') return a.toLowerCase().includes('miscela') || a.toLowerCase().includes('mix')
        return true
      })
    }
    if (query.trim()) {
      const tokens = query.toLowerCase().replace(/[-_]/g, ' ').split(/\s+/).filter(Boolean)
      const qn = normalize(query)
      list = list.filter(p => {
        const hay = [p.modello, p.codice, p.categoria, p.batteria_cons, p.alimentazione, p.note].join(' ').toLowerCase()
        const hayn = normalize(hay)
        if (qn && hayn.includes(qn)) return true
        return tokens.every(t => hay.includes(t))
      })
    }
    return list.map(p => ({ ...p, promo: promoMap[p.codice] || null }))
  }, [prodotti, promoMap, query, categoria, alimentazione])

  return { results, query, setQuery, categoria, setCategoria, categorie, alimentazione, setAlimentazione, alimentazioni }
}
