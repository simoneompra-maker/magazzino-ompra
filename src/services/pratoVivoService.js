import { supabase } from '../store';

// ─────────────────────────────────────────────────────────────
// PESO PER CONFEZIONE (kg o L)
// ─────────────────────────────────────────────────────────────
export const PESO_CONFEZIONE = {
  green7:        25,
  green8:        25,
  vigor_active:  25,
  allround:      20,
  pro_starter:   20,
  pro_slow:      20,
  universal_top: 20,
  iron_power:    20,
  granustar:     20,
  humifitos:     25,
  leokare:       5,
  algapark:      5,
  root_speed:    5,
  fe_ulk:        1,
  amino_k:       1,
  wet_turf:      1,
  micosat_pg:    1,
  micosat_mo:    5,
  micosat_tab:   1,
  micosat_len:   1,
};

export const UNITA_LIQUIDO = new Set(['leokare', 'humifitos', 'wet_turf', 'algapark', 'root_speed']);

export function getUnita(slug) {
  return UNITA_LIQUIDO.has(slug) ? 'L' : 'kg';
}

export function calcolaQuantita(slug, dose_gm2, mq) {
  const totale_kg = (dose_gm2 * mq) / 1000;
  const peso = PESO_CONFEZIONE[slug] || 1;
  const confezioni = Math.ceil(totale_kg / peso);
  return { totale_kg: Math.round(totale_kg * 100) / 100, confezioni, peso };
}

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
        id, dose_gm2, dose_fissa, dose_fissa_label, sort_order,
        pv_prodotti ( id, slug, listino_codice, listino_brand )
      )
    `)
    .eq('piano_id', pianoId)
    .order('sort_order');
  if (e2) throw e2;

  // Raccogli codici prodotto
  const codici = new Set();
  (interventi || []).forEach(i =>
    (i.pv_intervento_prodotti || []).forEach(ip => {
      if (ip.pv_prodotti?.listino_codice) codici.add(ip.pv_prodotti.listino_codice);
    })
  );

  // Fetch nomi da listini
  let nomiMap = {};
  if (codici.size > 0) {
    const { data: listiniData } = await supabase
      .from('listini')
      .select('codice, descrizione')
      .in('codice', [...codici]);
    (listiniData || []).forEach(r => { nomiMap[r.codice] = r.descrizione; });
  }

  // Arricchisci con nome
  const interventiArricchiti = (interventi || []).map(i => ({
    ...i,
    pv_intervento_prodotti: [...(i.pv_intervento_prodotti || [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(ip => ({
        ...ip,
        pv_prodotti: ip.pv_prodotti ? {
          ...ip.pv_prodotti,
          label: nomiMap[ip.pv_prodotti.listino_codice] || ip.pv_prodotti.slug,
        } : null,
      })),
  }));

  return { piano, interventi: interventiArricchiti };
}

// Soglia m² per scelta Micosat MO vs PG
export const MICOSAT_SOGLIA_MQ = 300;

export function getMicosatSlug(mq) {
  return mq <= MICOSAT_SOGLIA_MQ ? 'micosat_pg' : 'micosat_mo';
}

export function getMicosatNota(mq) {
  if (mq <= MICOSAT_SOGLIA_MQ) {
    return 'Micosat F PG — microgranulare, si distribuisce a secco con spandiconcime. Consigliato per questa superficie (≤ 300 m²): una confezione è sufficiente senza acquistare 5 kg.';
  }
  return 'Micosat F MO — si diluisce in acqua insieme a Humifitos in un solo passaggio. Confezione da 5 kg: stabile per 2 stagioni, conveniente su questa superficie.';
}

export function getRiepilogoProdotti(interventi, mq) {
  const map = {};
  const micosatSlug = getMicosatSlug(mq);

  interventi.forEach(intervento => {
    (intervento.pv_intervento_prodotti || []).forEach(ip => {
      const p = ip.pv_prodotti;
      if (!p) return;
      if (ip.dose_fissa) return;

      let slug = p.slug;
      let label = p.label || p.slug;
      if (slug === 'micosat_mo' || slug === 'micosat_pg') {
        slug = micosatSlug;
        label = micosatSlug === 'micosat_pg' ? 'Micosat F PG' : 'Micosat F MO';
      }

      if (!map[slug]) {
        map[slug] = {
          slug,
          label,
          codice: p.listino_codice,
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

// ─────────────────────────────────────────────────────────────
// ARCHIVIO PIANI — funzioni Supabase
// ─────────────────────────────────────────────────────────────
const ARCHIVIO_TABLE = 'pratovivo_archivio';

export async function salvaArchivio(record) {
  const { data, error } = await supabase
    .from(ARCHIVIO_TABLE)
    .insert([record])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getArchivio() {
  const { data, error } = await supabase
    .from(ARCHIVIO_TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function eliminaDaArchivio(id) {
  const { error } = await supabase
    .from(ARCHIVIO_TABLE)
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function getArchivioById(id) {
  const { data, error } = await supabase
    .from(ARCHIVIO_TABLE)
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}
