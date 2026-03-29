// src/services/sopralluoghiService.js
import { supabase } from '../store';

const TABLE = 'sopralluoghi';

export async function salvaSopralluogo(record) {
  const { data, error } = await supabase.from(TABLE).insert([record]).select().single();
  if (error) throw error;
  return data;
}

export async function aggiornaSopralluogo(id, updates) {
  const { data, error } = await supabase.from(TABLE).update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function getSopralluoghi() {
  const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function eliminaSopralluogo(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function getPianiSopralluogo() {
  const { data, error } = await supabase
    .from('pv_piani')
    .select('id, slug, label, descrizione, fase, terreno, linea, sort_order')
    .eq('is_active', true)
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}

export async function getInterventiPiano(pianoId) {
  const { data, error } = await supabase
    .from('pv_interventi')
    .select('id, label, timing, tipo, nota, note_tecniche, dose_effettiva, numero_ordine, sort_order, periodo_bimestre')
    .eq('piano_id', pianoId)
    .order('numero_ordine');
  if (error) throw error;
  return data ?? [];
}

export function scegliPiani(tessitura, piani) {
  const isSabbioso = tessitura &&
    (tessitura.toLowerCase().includes('sabb') || tessitura.toLowerCase().includes('franco-sabb'));
  const terreno = isSabbioso ? 'sabbioso' : 'normale';

  const nutrizione = piani.find(p =>
    p.fase === 'nutrizione' && p.terreno === terreno &&
    (isSabbioso ? p.linea === 'eden' : p.linea === 'albatros')
  ) || piani.find(p => p.fase === 'nutrizione' && p.terreno === terreno);

  const prev_terreno = piani.find(p => p.fase === 'prevenzione_terreno' && p.terreno === terreno);
  const prev_fogliare = piani.find(p => p.fase === 'prevenzione_fogliare');

  return { nutrizione, prev_terreno, prev_fogliare, terreno };
}
