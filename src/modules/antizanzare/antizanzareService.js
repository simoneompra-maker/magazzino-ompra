/**
 * Accesso ai dati del modulo antizanzare.
 * Tabelle: az_progetti, az_linee, az_consuntivo — bucket storage: az-foto.
 */

import { supabase } from '../../store';

const BUCKET = 'az-foto';

/* ─────────────────── progetti ─────────────────── */

/**
 * Elenco progetti. Il tecnico vede solo quelli assegnati a lui.
 * @param {{ruolo?:string, nome?:string}} operatore
 */
export async function listaProgetti(operatore) {
  let q = supabase
    .from('az_progetti')
    .select(
      'id, numero, cliente_nome, indirizzo, stato, operatore, tecnico, data_montaggio, brand, macchina_code, prezzo_cliente, created_at, updated_at'
    )
    .order('created_at', { ascending: false });

  if (operatore?.ruolo === 'tecnico') {
    q = q.eq('tecnico', operatore.nome);
  }

  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

/** Progetto completo con le sue linee. */
export async function caricaProgetto(id) {
  const [{ data: progetto, error: e1 }, { data: linee, error: e2 }] = await Promise.all([
    supabase.from('az_progetti').select('*').eq('id', id).single(),
    supabase.from('az_linee').select('*').eq('progetto_id', id).order('ordine'),
  ]);
  if (e1) throw e1;
  if (e2) throw e2;
  return { ...progetto, linee: linee || [] };
}

/** Prossimo numero progressivo AZ-<anno>-<nnn>, calcolato dal database. */
export async function prossimoNumero() {
  const { data, error } = await supabase.rpc('az_prossimo_numero');
  if (error) throw error;
  return data;
}

const CAMPI_PROGETTO = [
  'numero',
  'cliente_nome',
  'cliente_id',
  'indirizzo',
  'telefono',
  'riferimento',
  'stato',
  'operatore',
  'tecnico',
  'data_montaggio',
  'foto_path',
  'foto_scala',
  'brand',
  'macchina_code',
  'config',
  'risultato',
  'prezzo_cliente',
  'descrizione_prev',
  'note',
];

const soloCampiNoti = (p) =>
  Object.fromEntries(Object.entries(p).filter(([k]) => CAMPI_PROGETTO.includes(k)));

/**
 * Salva progetto e linee. Crea se manca l'id, altrimenti aggiorna.
 * Le linee vengono riscritte per intero: sono poche e cosi' non serve
 * inseguire quali sono state aggiunte, modificate o rimosse.
 * @returns {Promise<string>} id del progetto
 */
export async function salvaProgetto(progetto, linee) {
  const payload = soloCampiNoti(progetto);
  let id = progetto.id;

  if (!id) {
    if (!payload.numero) payload.numero = await prossimoNumero();
    const { data, error } = await supabase
      .from('az_progetti')
      .insert(payload)
      .select('id')
      .single();

    // Collisione sul numero: due salvataggi contemporanei. Riprovo una volta.
    if (error?.code === '23505') {
      payload.numero = await prossimoNumero();
      const retry = await supabase.from('az_progetti').insert(payload).select('id').single();
      if (retry.error) throw retry.error;
      id = retry.data.id;
    } else if (error) {
      throw error;
    } else {
      id = data.id;
    }
  } else {
    const { error } = await supabase.from('az_progetti').update(payload).eq('id', id);
    if (error) throw error;
  }

  await salvaLinee(id, linee);
  return id;
}

async function salvaLinee(progettoId, linee) {
  const { error: eDel } = await supabase.from('az_linee').delete().eq('progetto_id', progettoId);
  if (eDel) throw eDel;

  const righe = (linee || [])
    .filter((l) => Number(l.metri) > 0 || (l.etichetta || '').trim())
    .map((l, i) => {
      // Solo i metodi con quantita' positiva, come interi
      const metodi = Object.fromEntries(
        Object.entries(l.metodi || {})
          .map(([k, v]) => [k, Math.max(0, parseInt(v, 10) || 0)])
          .filter(([, v]) => v > 0)
      );
      return {
        progetto_id: progettoId,
        ordine: i,
        etichetta: l.etichetta || null,
        metri: Number(l.metri) || 0,
        passo: Number(l.passo) || 4,
        metodi,
        ugelli: Number(l.metri) > 0 ? Math.ceil(Number(l.metri) / (Number(l.passo) || 4)) : 0,
        polilinea: l.polilinea || null,
        note: l.note || null,
      };
    });

  if (righe.length === 0) return;
  const { error } = await supabase.from('az_linee').insert(righe);
  if (error) throw error;
}

export async function eliminaProgetto(id) {
  // Le linee e il consuntivo hanno on delete cascade
  const { error } = await supabase.from('az_progetti').delete().eq('id', id);
  if (error) throw error;
}

/* ─────────────────── foto ─────────────────── */

/** Carica la foto di progetto e restituisce il path salvato. */
export async function caricaFoto(progettoId, file) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `progetti/${progettoId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: true });
  if (error) throw error;

  return path;
}

export function urlFoto(path) {
  if (!path) return null;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data?.publicUrl || null;
}

export async function eliminaFoto(path) {
  if (!path) return;
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}

/* ─────────────────── consuntivo ─────────────────── */

export async function caricaConsuntivo(progettoId) {
  const { data, error } = await supabase
    .from('az_consuntivo')
    .select('*')
    .eq('progetto_id', progettoId)
    .order('ordine');
  if (error) throw error;
  return data || [];
}

/**
 * Genera le righe di consuntivo dalla distinta materiali, se non esistono gia'.
 * Non sovrascrive un consuntivo gia' compilato.
 */
export async function inizializzaConsuntivo(progettoId, bom) {
  const esistenti = await caricaConsuntivo(progettoId);
  if (esistenti.length > 0) return esistenti;

  const righe = (bom || []).map((r, i) => ({
    progetto_id: progettoId,
    ordine: i,
    codice: r.code,
    descrizione: r.desc,
    um: r.um,
    q_prevista: r.q,
    q_usata: null,
    extra: false,
  }));

  if (righe.length === 0) return [];
  const { data, error } = await supabase.from('az_consuntivo').insert(righe).select();
  if (error) throw error;
  return data || [];
}

/** Riscrive per intero il consuntivo, incluse le righe extra del tecnico. */
export async function salvaConsuntivo(progettoId, righe, operatoreNome) {
  const { error: eDel } = await supabase
    .from('az_consuntivo')
    .delete()
    .eq('progetto_id', progettoId);
  if (eDel) throw eDel;

  const payload = (righe || [])
    .filter((r) => (r.descrizione || '').trim())
    .map((r, i) => ({
      progetto_id: progettoId,
      ordine: i,
      codice: r.codice || null,
      descrizione: r.descrizione,
      um: r.um || 'pz',
      q_prevista: r.q_prevista ?? null,
      q_usata: r.q_usata === '' || r.q_usata === undefined ? null : Number(r.q_usata),
      extra: Boolean(r.extra),
      note: r.note || null,
      compilato_da: operatoreNome || null,
      compilato_at: new Date().toISOString(),
    }));

  if (payload.length === 0) return [];
  const { data, error } = await supabase.from('az_consuntivo').insert(payload).select();
  if (error) throw error;
  return data || [];
}

/* ─────────────────── rubrica clienti ─────────────────── */

/**
 * Suggerimenti per l'autocomplete del nome cliente.
 * Cerca su search_text, la colonna normalizzata gia' usata dalla rubrica.
 */
export async function cercaClienti(testo) {
  const q = (testo || '').trim();
  if (q.length < 2) return [];

  const { data, error } = await supabase
    .from('clienti')
    .select('id, nome, cognome, nome_completo, indirizzo, cap, localita, provincia, telefono')
    .is('deleted_at', null)
    .or(`search_text.ilike.%${q.toLowerCase()}%,nome_completo.ilike.%${q}%`)
    .order('nome_completo')
    .limit(8);

  if (error) {
    console.error('Ricerca clienti fallita:', error);
    return [];
  }

  return (data || []).map((c) => ({
    id: c.id,
    nome: c.nome_completo || `${c.cognome || ''} ${c.nome || ''}`.trim(),
    indirizzo: [c.indirizzo, [c.cap, c.localita].filter(Boolean).join(' '), c.provincia]
      .filter(Boolean)
      .join(', '),
    telefono: c.telefono || '',
  }));
}

/* ─────────────────── operatori ─────────────────── */

export async function listaTecnici() {
  const { data, error } = await supabase
    .from('operatori')
    .select('nome, ruolo')
    .order('nome');
  if (error) throw error;
  return data || [];
}
