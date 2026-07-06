import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../store';

const ORDINE_CATEGORIE = ['MACCHINE', 'GEOGREEN', 'ANTIZANZARE', 'CONSULENZA'];

// ── Riepilogo: v_riepilogo_trimestrale (categorie × trimestri, tutti gli anni) ──
export function useRiepilogoCategorie() {
  const [righe, setRighe] = useState([]);
  const [anno, setAnno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('v_riepilogo_trimestrale')
      .select('*');
    if (error) { setError(error); setLoading(false); return; }
    const ordinate = (data || []).sort((a, b) => {
      if (a.anno !== b.anno) return b.anno - a.anno;
      return ORDINE_CATEGORIE.indexOf(a.categoria) - ORDINE_CATEGORIE.indexOf(b.categoria);
    });
    setRighe(ordinate);
    setAnno(prev => prev ?? (ordinate.length ? Math.max(...ordinate.map(r => r.anno)) : new Date().getFullYear()));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const anni = [...new Set(righe.map(r => r.anno))].sort((a, b) => b - a);
  const righeAnno = righe.filter(r => r.anno === anno);

  return { righeAnno, anni, anno, setAnno, loading, error, refresh: load };
}

// ── Dettaglio: v_vendite_dettaglio filtrato per anno, trimestre o intervallo date ──
export function useDettaglioVendite(anno, trimestre, dateFrom, dateTo) {
  const [righe, setRighe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!anno && !dateFrom) return;
    setLoading(true);
    setError(null);

    let query = supabase.from('v_vendite_dettaglio').select('*');

    if (dateFrom && dateTo) {
      query = query.gte('data', dateFrom).lte('data', dateTo);
    } else {
      query = query.eq('anno', anno);
      if (trimestre) query = query.eq('trimestre', trimestre);
    }

    query = query.order('data', { ascending: false });

    const { data, error } = await query;
    if (error) { setError(error); setLoading(false); return; }
    setRighe(data || []);
    setLoading(false);
  }, [anno, trimestre, dateFrom, dateTo]);

  useEffect(() => { load(); }, [load]);

  return { righe, loading, error, refresh: load };
}
