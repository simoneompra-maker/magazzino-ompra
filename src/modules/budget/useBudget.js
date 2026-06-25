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

// ── Dettaglio: v_vendite_dettaglio (per commissione, filtrato per anno) ──
export function useDettaglioVendite(anno) {
  const [righe, setRighe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!anno) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('v_vendite_dettaglio')
      .select('*')
      .eq('anno', anno)
      .order('data', { ascending: false });
    if (error) { setError(error); setLoading(false); return; }
    setRighe(data || []);
    setLoading(false);
  }, [anno]);

  useEffect(() => { load(); }, [load]);

  return { righe, loading, error, refresh: load };
}
