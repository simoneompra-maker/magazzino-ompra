import { supabase } from '../store';

// ─────────────────────────────────────────────────────────────
// PESO PER CONFEZIONE (kg o L) — usato per calcolo n° sacchi
// ─────────────────────────────────────────────────────────────
export const PESO_CONFEZIONE = {
  green7:       25,
  green8:       25,
  vigor_active: 25,
  allround:     20,
  pro_starter:  20,
  pro_slow:     20,
  universal_top:20,
  iron_power:   20,
  granustar:    20,
  humifitos:    25,
  leokare:      5,
  algapark:     5,
  root_speed:   5,
  fe_ulk:       1,
  amino_k:      1,
  wet_turf:     1,
  micosat_pg:   1,
  micosat_mo:   5,
  micosat_tab:  1,
  micosat_len:  1,
};

// Unità di misura per prodotto
export const UNITA = {
  leokare:     'L',
  humifitos:   'L',
  wet_turf:    'L',
  algapark:    'L',
  root_speed:  'L',
};

export function getUnita(slug) {
  return UNITA[slug] || 'kg';
}

// ─────────────────────────────────────────────────────────────
// Calcola quantità e confezioni necessarie
// ─────────────────────────────────────────────────────────────
export function calcolaQuantita(slug, dose_gm2, mq) {
  const totale_kg = (dose_gm2 * mq) / 1000;
  const peso = PESO_CONFEZIONE[slug] || 1;
  const confezioni = Math.ceil(totale_kg / peso);
  return { totale_kg: Math.round(totale_kg * 100) / 100, confezioni, peso };
}

// ─────────────────────────────────────────────────────────────
// QUERY
// ─────────────────────────────────────────────────────────────

/**
 * Carica tutti i piani attivi, con filtri opzionali.
 * @param {Object} filters — { tipo_prato, fase, livello }
 */
export async function getPiani(filters = {}) {
  let query = supabase
    .from('pv_piani')
    .select('id, slug, label, descrizione, tipo_prato, fase, livello, sort_order')
    .eq('is_active', true);

  if (filters.tipo_prato) query = query.eq('tipo_prato', filters.tipo_prato);
  if (filters.fase)       query = query.eq('fase', filters.fase);
  if (filters.livello)    query = query.eq('livello', filters.livello);

  const { data, error } = await query.order('sort_order');
  if (error) throw error;
  return data || [];
}

/**
 * Carica piano + interventi + prodotti per ogni intervento.
 * @param {string} pianoId — UUID del piano
 */
export async function getPianoCompleto(pianoId) {
  const { data: piano, error: e1 } = await supabase
    .from('pv_piani')
    .select('*')
    .eq('id', pianoId)
    .single();
  if (e1) throw e1;

  const { data: interventi, error: e2 } = await supabase
    .from('pv_interventi')
    .select(`
      id, label, timing, tipo, nota, sort_order,
      pv_intervento_prodotti (
        dose_gm2, sort_order,
        pv_prodotti ( id, slug, label, codice_listino )
      )
    `)
    .eq('piano_id', pianoId)
    .order('sort_order');
  if (e2) throw e2;

  // Ordina i prodotti per sort_order all'interno di ogni intervento
  const interventiOrdinati = (interventi || []).map(i => ({
    ...i,
    pv_intervento_prodotti: [...(i.pv_intervento_prodotti || [])].sort(
      (a, b) => a.sort_order - b.sort_order
    ),
  }));

  return { piano, interventi: interventiOrdinati };
}

/**
 * Riepilogo aggregato di tutti i prodotti di un piano per una data superficie.
 * Raggruppa per prodotto e somma le dosi/confezioni.
 * @param {Array}  interventi — da getPianoCompleto()
 * @param {number} mq         — superficie in m²
 */
export function getRiepilogoProdotti(interventi, mq) {
  const map = {};

  interventi.forEach(intervento => {
    (intervento.pv_intervento_prodotti || []).forEach(ip => {
      const p = ip.pv_prodotti;
      if (!p) return;
      const slug = p.slug;
      if (!map[slug]) {
        map[slug] = {
          slug,
          label: p.label,
          codice: p.codice_listino,
          dose_totale_g: 0,
          n_applicazioni: 0,
        };
      }
      map[slug].dose_totale_g += ip.dose_gm2 * mq;
      map[slug].n_applicazioni += 1;
    });
  });

  return Object.values(map).map(p => {
    const totale_kg = Math.round(p.dose_totale_g / 1000 * 100) / 100;
    const peso = PESO_CONFEZIONE[p.slug] || 1;
    return {
      ...p,
      totale_kg,
      confezioni: Math.ceil(totale_kg / peso),
      peso_confezione: peso,
      unita: getUnita(p.slug),
    };
  });
}
