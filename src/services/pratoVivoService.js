// pratovivoService.js
// Funzioni Supabase per il modulo PratoVivo — Archivio piani
// Posizionare in: src/services/pratovivoService.js

import { supabase } from '../lib/supabase'; // adattare il path se necessario

const TABLE = 'pratovivo_archivio';

/**
 * Salva un piano nell'archivio.
 * @param {Object} record  - oggetto con tutti i campi del piano
 * @returns {Object} record salvato con id e created_at
 */
export async function salvaArchivio(record) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([record])
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Recupera tutti i piani, dal più recente.
 * @returns {Array} lista record
 */
export async function getArchivio() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/**
 * Elimina un piano per id.
 * @param {string} id - UUID del record
 */
export async function eliminaDaArchivio(id) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);
  if (error) throw error;
}

/**
 * Recupera un singolo piano per id (utile per dettagli o ri-download).
 * @param {string} id
 * @returns {Object} record
 */
export async function getArchivioById(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}
