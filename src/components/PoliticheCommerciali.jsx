import { useState, useEffect } from 'react';
import { supabase } from '../store';

export default function PoliticheCommerciali({ onNavigate }) {
  const [policies, setPolicies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null); // null | 'new' | {id, ...}
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form state
  const emptyForm = { brand: '', cliente_privato: '', professionista: '', promozioni: '', note: '' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pricing_policies')
      .select('*')
      .order('brand', { ascending: true });
    if (!error) setPolicies(data || []);
    setLoading(false);
  };

  const filtered = policies.filter(p =>
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  // Selezione rapida: click su brand → mostra dettaglio
  const handleSelect = (p) => {
    setSelected(selected?.id === p.id ? null : p);
    setEditing(null);
  };

  // Apri form modifica
  const handleEdit = (p, e) => {
    e.stopPropagation();
    setForm({ brand: p.brand, cliente_privato: p.cliente_privato || '', professionista: p.professionista || '', promozioni: p.promozioni || '', note: p.note || '' });
    setEditing(p);
    setSelected(null);
  };

  // Apri form nuovo
  const handleNew = () => {
    setForm(emptyForm);
    setEditing('new');
    setSelected(null);
  };

  const handleCancel = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.brand.trim()) return alert('Il nome del brand è obbligatorio.');
    setSaving(true);
    const payload = {
      brand: form.brand.trim().toUpperCase(),
      cliente_privato: form.cliente_privato.trim() || null,
      professionista: form.professionista.trim() || null,
      promozioni: form.promozioni.trim() || null,
      note: form.note.trim() || null,
      updated_at: new Date().toISOString()
    };
    let error;
    if (editing === 'new') {
      ({ error } = await supabase.from('pricing_policies').insert(payload));
    } else {
      ({ error } = await supabase.from('pricing_policies').update(payload).eq('id', editing.id));
    }
    setSaving(false);
    if (error) { alert('Errore: ' + error.message); return; }
    setEditing(null);
    setForm(emptyForm);
    await fetchPolicies();
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('pricing_policies').delete().eq('id', id);
    if (error) { alert('Errore: ' + error.message); return; }
    setDeleteConfirm(null);
    setSelected(null);
    await fetchPolicies();
  };

  // ─── RENDER ───

  const renderField = (label, value) => {
    if (!value) return null;
    return (
      <div className="mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-sm text-gray-800 bg-gray-50 rounded-lg p-3 leading-relaxed">{value}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => onNavigate('home')} className="text-gray-500 hover:text-gray-700 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">Politiche Commerciali</h1>
            <p className="text-xs text-gray-500">Scontistiche per brand — uso interno</p>
          </div>
          <button
            onClick={handleNew}
            className="bg-green-600 text-white text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
          >
            + Nuovo
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">

        {/* Ricerca */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cerca brand... (es. Honda, Stihl, Echo)"
            value={search}
            onChange={e => { setSearch(e.target.value); setSelected(null); setEditing(null); }}
            className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          />
          {search && (
            <button onClick={() => { setSearch(''); setSelected(null); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
          )}
        </div>

        {/* Form nuovo / modifica */}
        {editing && (
          <div className="bg-white rounded-xl shadow-sm border border-green-200 p-4 space-y-3">
            <h2 className="font-bold text-gray-900">{editing === 'new' ? 'Nuovo brand' : `Modifica — ${editing.brand}`}</h2>
            {editing === 'new' && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Brand *</label>
                <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="Es. HONDA" className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente Privato</label>
              <textarea value={form.cliente_privato} onChange={e => setForm(f => ({ ...f, cliente_privato: e.target.value }))} rows={3} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Professionista</label>
              <textarea value={form.professionista} onChange={e => setForm(f => ({ ...f, professionista: e.target.value }))} rows={3} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Promozioni</label>
              <textarea value={form.promozioni} onChange={e => setForm(f => ({ ...f, promozioni: e.target.value }))} rows={2} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Note</label>
              <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} rows={2} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-green-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
                {saving ? 'Salvataggio...' : '✓ Salva'}
              </button>
              <button onClick={handleCancel} className="flex-1 bg-gray-100 text-gray-700 text-sm font-semibold py-2 rounded-lg hover:bg-gray-200 transition-colors">
                Annulla
              </button>
            </div>
          </div>
        )}

        {/* Lista brand */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Caricamento...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Nessun brand trovato</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(p => (
              <div key={p.id}>
                {/* Card brand */}
                <div
                  onClick={() => handleSelect(p)}
                  className={`bg-white rounded-xl shadow-sm border transition-all cursor-pointer ${selected?.id === p.id ? 'border-green-400 ring-1 ring-green-300' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${p.cliente_privato || p.professionista ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="font-semibold text-gray-900 text-sm">{p.brand}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleEdit(p, e)}
                        className="text-xs text-blue-600 font-medium hover:underline px-2 py-1"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm(p.id); }}
                        className="text-xs text-red-500 font-medium hover:underline px-2 py-1"
                      >
                        Elimina
                      </button>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${selected?.id === p.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Dettaglio espanso */}
                {selected?.id === p.id && (
                  <div className="bg-white rounded-b-xl border border-t-0 border-green-200 px-4 pb-4 pt-3 -mt-1 shadow-sm">
                    {renderField('Cliente Privato', p.cliente_privato)}
                    {renderField('Professionista', p.professionista)}
                    {renderField('Promozioni', p.promozioni)}
                    {renderField('Note', p.note)}
                    {!p.cliente_privato && !p.professionista && !p.promozioni && !p.note && (
                      <p className="text-sm text-gray-400 italic">Nessuna condizione inserita.</p>
                    )}
                    {p.updated_at && (
                      <p className="text-xs text-gray-400 mt-2">
                        Aggiornato: {new Date(p.updated_at).toLocaleDateString('it-IT')}
                      </p>
                    )}
                  </div>
                )}

                {/* Conferma elimina */}
                {deleteConfirm === p.id && (
                  <div className="bg-red-50 border border-red-200 rounded-xl mt-1 px-4 py-3 flex items-center justify-between">
                    <p className="text-sm text-red-700 font-medium">Eliminare <strong>{p.brand}</strong>?</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleDelete(p.id)} className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-700">Sì, elimina</button>
                      <button onClick={() => setDeleteConfirm(null)} className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-200">Annulla</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-4">
          {filtered.length} brand — Uso interno OMPRA
        </p>
      </div>
    </div>
  );
}
