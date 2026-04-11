import { useState, useEffect, useMemo, useCallback } from 'react';
import useStore, { supabase } from '../store';
import {
  ArrowLeft, Search, ShoppingCart, Plus, Minus, Check,
  ChevronDown, ChevronUp, X, Tag, Filter,
} from 'lucide-react';

// ─── Utilità ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
  n ? new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) : '–';

// Normalizza stringa per ricerca: rimuove spazi, trattini, punti → tutto uppercase
const norm = (s) => (s || '').toUpperCase().replace(/[\s\-\.]/g, '');

// ─── Componente Card prodotto ─────────────────────────────────────────────────
function ProdottoCard({ prodotto, inCarrello, qtyCarrello, onAdd, onRemove }) {
  const [espanso, setEspanso] = useState(false);
  const haDesc = !!prodotto.descrizione;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border-2 transition-colors ${
        inCarrello ? 'border-orange-300' : 'border-transparent'
      }`}
    >
      {/* Header card */}
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Badge brand + categoria */}
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                {prodotto.brand}
              </span>
              {prodotto.categoria && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-500">
                  {prodotto.categoria}
                </span>
              )}
            </div>
            {/* Modello */}
            <p className="text-base font-bold text-gray-800 leading-tight">
              {prodotto.modello}
            </p>
            {/* Codice */}
            {prodotto.codice && (
              <p className="text-xs text-gray-400 font-mono mt-0.5">{prodotto.codice}</p>
            )}
          </div>
          {/* Prezzi */}
          <div className="text-right shrink-0">
            {prodotto.prezzo_listino && (
              <p className="text-xs text-gray-400 line-through">{fmt(prodotto.prezzo_listino)} €</p>
            )}
            {prodotto.prezzo_vendita && (
              <p className="text-base font-bold text-orange-600">{fmt(prodotto.prezzo_vendita)} €</p>
            )}
          </div>
        </div>

        {/* Descrizione collassabile */}
        {haDesc && (
          <div className="mt-2">
            <p className={`text-xs text-gray-500 leading-relaxed ${espanso ? '' : 'line-clamp-2'}`}>
              {prodotto.descrizione}
            </p>
            <button
              onClick={() => setEspanso(v => !v)}
              className="text-xs text-blue-500 mt-0.5 flex items-center gap-0.5"
            >
              {espanso ? (
                <><ChevronUp className="w-3 h-3" /> Meno</>
              ) : (
                <><ChevronDown className="w-3 h-3" /> Leggi tutto</>
              )}
            </button>
          </div>
        )}
        {!haDesc && (
          <p className="text-xs text-gray-300 italic mt-1">Descrizione non disponibile</p>
        )}
      </div>

      {/* Footer azioni */}
      <div className="px-4 pb-3 flex items-center justify-between">
        {!inCarrello ? (
          <button
            onClick={() => onAdd(prodotto)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
            Aggiungi al preventivo
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRemove(prodotto.id)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 active:scale-95 transition-transform"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-orange-600 w-6 text-center tabular-nums">
              {qtyCarrello}
            </span>
            <button
              onClick={() => onAdd(prodotto)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-500 text-white active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4" />
            </button>
            <span className="text-xs text-orange-500 font-semibold ml-1 flex items-center gap-0.5">
              <Check className="w-3.5 h-3.5" /> Nel preventivo
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Componente principale ────────────────────────────────────────────────────
export default function CatalogoProdotti({ onNavigate }) {
  const preventivoCarrello = useStore(s => s.preventivoCarrello);
  const addToCarrello      = useStore(s => s.addToCarrello);
  const removeFromCarrello = useStore(s => s.removeFromCarrello);
  const clearCarrello      = useStore(s => s.clearCarrello);

  const [prodotti, setProdotti]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [errore, setErrore]         = useState(null);
  const [cerca, setCerca]           = useState('');
  const [brandFiltro, setBrandFiltro] = useState('tutti');
  const [catFiltro, setCatFiltro]   = useState('tutti');
  const [mostraFiltri, setMostraFiltri] = useState(false);
  const [mostraCarrello, setMostraCarrello] = useState(false);

  // Carica catalogo da Supabase
  const caricaProdotti = useCallback(async () => {
    setLoading(true);
    setErrore(null);
    try {
      const { data, error } = await supabase
        .from('catalogo_prodotti')
        .select('*')
        .eq('attivo', true)
        .order('brand')
        .order('categoria')
        .order('modello');
      if (error) throw error;
      setProdotti(data || []);
    } catch (e) {
      setErrore('Errore caricamento catalogo: ' + e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { caricaProdotti(); }, [caricaProdotti]);

  // Elenchi unici per filtri
  const brands = useMemo(() => {
    const b = [...new Set(prodotti.map(p => p.brand).filter(Boolean))].sort();
    return b;
  }, [prodotti]);

  const categorie = useMemo(() => {
    const src = brandFiltro === 'tutti' ? prodotti : prodotti.filter(p => p.brand === brandFiltro);
    const c = [...new Set(src.map(p => p.categoria).filter(Boolean))].sort();
    return c;
  }, [prodotti, brandFiltro]);

  // Reset categoria quando cambia brand
  useEffect(() => { setCatFiltro('tutti'); }, [brandFiltro]);

  // Prodotti filtrati
  const prodottiFiltrati = useMemo(() => {
    const q = norm(cerca);
    return prodotti.filter(p => {
      if (brandFiltro !== 'tutti' && p.brand !== brandFiltro) return false;
      if (catFiltro !== 'tutti' && p.categoria !== catFiltro) return false;
      if (!q) return true;
      return (
        norm(p.modello).includes(q) ||
        norm(p.codice).includes(q) ||
        norm(p.descrizione).includes(q) ||
        norm(p.categoria).includes(q)
      );
    });
  }, [prodotti, brandFiltro, catFiltro, cerca]);

  // Gruppi per categoria
  const gruppi = useMemo(() => {
    const map = {};
    for (const p of prodottiFiltrati) {
      const k = p.categoria || 'Altro';
      if (!map[k]) map[k] = [];
      map[k].push(p);
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [prodottiFiltrati]);

  // Helpers carrello
  const carrelloMap = useMemo(() => {
    const m = {};
    for (const i of preventivoCarrello) m[i.id] = i.qty || 1;
    return m;
  }, [preventivoCarrello]);

  const totCarrello = preventivoCarrello.reduce((a, i) => a + (i.qty || 1), 0);
  const totaleCarrello = preventivoCarrello.reduce(
    (a, i) => a + (i.prezzo_vendita || 0) * (i.qty || 1), 0
  );

  const handleAdd = (prodotto) => addToCarrello(prodotto);
  const handleRemove = (id) => removeFromCarrello(id);

  const vadoAlPreventivo = () => onNavigate('compilatore-prev');

  const IC = 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white';

  return (
    <div className="min-h-screen bg-gray-100 pb-32">

      {/* ── Header sticky ── */}
      <div className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => onNavigate('home')} className="p-1.5 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-gray-800 leading-tight">CATALOGO PRODOTTI</h1>
            <p className="text-xs text-gray-400">
              {loading ? 'Caricamento...' : prodottiFiltrati.length + ' prodotti'}
            </p>
          </div>
          {/* Bottone carrello */}
          {totCarrello > 0 && (
            <button
              onClick={() => setMostraCarrello(v => !v)}
              className="relative flex items-center gap-1.5 bg-orange-500 text-white rounded-full px-3 py-1.5 text-sm font-bold active:scale-95 transition-transform"
            >
              <ShoppingCart className="w-4 h-4" />
              {totCarrello}
            </button>
          )}
        </div>

        {/* Barra ricerca */}
        <div className="px-4 pb-3 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Cerca modello, codice, categoria..."
              value={cerca}
              onChange={e => setCerca(e.target.value)}
            />
            {cerca && (
              <button
                onClick={() => setCerca('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setMostraFiltri(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              mostraFiltri || brandFiltro !== 'tutti' || catFiltro !== 'tutti'
                ? 'border-blue-400 bg-blue-50 text-blue-600'
                : 'border-gray-300 text-gray-500'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtri
            {(brandFiltro !== 'tutti' || catFiltro !== 'tutti') && (
              <span className="bg-blue-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                {(brandFiltro !== 'tutti' ? 1 : 0) + (catFiltro !== 'tutti' ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Filtri brand + categoria */}
        {mostraFiltri && (
          <div className="px-4 pb-3 space-y-2 border-t border-gray-100 pt-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1 font-semibold">Brand</p>
                <select
                  className={IC + ' w-full'}
                  value={brandFiltro}
                  onChange={e => setBrandFiltro(e.target.value)}
                >
                  <option value="tutti">Tutti i brand</option>
                  {brands.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1 font-semibold">Categoria</p>
                <select
                  className={IC + ' w-full'}
                  value={catFiltro}
                  onChange={e => setCatFiltro(e.target.value)}
                >
                  <option value="tutti">Tutte le categorie</option>
                  {categorie.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            {(brandFiltro !== 'tutti' || catFiltro !== 'tutti') && (
              <button
                onClick={() => { setBrandFiltro('tutti'); setCatFiltro('tutti'); }}
                className="text-xs text-red-400 flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Azzera filtri
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Contenuto ── */}
      <div className="max-w-xl mx-auto px-4 pt-4">

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Caricamento catalogo...</p>
          </div>
        )}

        {errore && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
            {errore}
            <button onClick={caricaProdotti} className="ml-2 underline">Riprova</button>
          </div>
        )}

        {!loading && !errore && prodottiFiltrati.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400">
            <Tag className="w-10 h-10 opacity-30" />
            <p className="text-sm">Nessun prodotto trovato</p>
            {(cerca || brandFiltro !== 'tutti' || catFiltro !== 'tutti') && (
              <button
                onClick={() => { setCerca(''); setBrandFiltro('tutti'); setCatFiltro('tutti'); }}
                className="text-xs text-blue-500 underline"
              >
                Azzera ricerca
              </button>
            )}
          </div>
        )}

        {!loading && !errore && gruppi.map(([categoria, items]) => (
          <div key={categoria} className="mb-4">
            {/* Header gruppo */}
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{categoria}</p>
              <span className="text-xs text-gray-400">({items.length})</span>
            </div>
            <div className="space-y-2">
              {items.map(p => (
                <ProdottoCard
                  key={p.id}
                  prodotto={p}
                  inCarrello={!!carrelloMap[p.id]}
                  qtyCarrello={carrelloMap[p.id] || 0}
                  onAdd={handleAdd}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </div>
        ))}

      </div>

      {/* ── Drawer carrello ── */}
      {mostraCarrello && totCarrello > 0 && (
        <div className="fixed inset-0 z-30 flex flex-col justify-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMostraCarrello(false)}
          />
          {/* Pannello */}
          <div className="relative bg-white rounded-t-2xl shadow-2xl max-h-[70vh] flex flex-col">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>
            <div className="px-4 pb-2 flex items-center justify-between">
              <p className="font-bold text-gray-800">
                Preventivo ({totCarrello} {totCarrello === 1 ? 'articolo' : 'articoli'})
              </p>
              <button onClick={() => setMostraCarrello(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            {/* Lista articoli */}
            <div className="flex-1 overflow-y-auto px-4 pb-2 divide-y divide-gray-50">
              {preventivoCarrello.map(item => (
                <div key={item.id} className="py-2.5 flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 leading-tight truncate">
                      {item.modello}
                    </p>
                    <p className="text-xs text-gray-400">{item.brand} · {item.categoria}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold tabular-nums w-5 text-center">
                      {item.qty || 1}
                    </span>
                    <button
                      onClick={() => handleAdd(item)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-orange-100 text-orange-500"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold tabular-nums text-right shrink-0 w-20">
                    {fmt(item.prezzo_vendita)} €
                  </p>
                </div>
              ))}
            </div>
            {/* Footer carrello */}
            <div className="px-4 pt-2 pb-5 border-t border-gray-100 space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-gray-500">Totale stimato (I.C.)</span>
                <span className="text-orange-600 tabular-nums">{fmt(totaleCarrello)} €</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { clearCarrello(); setMostraCarrello(false); }}
                  className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 text-sm font-semibold active:scale-95 transition-transform"
                >
                  Svuota
                </button>
                <button
                  onClick={vadoAlPreventivo}
                  className="flex-2 flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-bold active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Compila preventivo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FAB carrello (fisso in basso) ── */}
      {totCarrello > 0 && !mostraCarrello && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-10 px-4">
          <div className="flex items-center gap-3 bg-orange-500 text-white rounded-full px-5 py-3 shadow-lg">
            <button
              onClick={() => setMostraCarrello(true)}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-bold text-sm">
                {totCarrello} {totCarrello === 1 ? 'articolo' : 'articoli'}
              </span>
              <span className="text-orange-200 text-sm">·</span>
              <span className="font-bold text-sm tabular-nums">{fmt(totaleCarrello)} €</span>
            </button>
            <div className="w-px h-5 bg-orange-400" />
            <button
              onClick={vadoAlPreventivo}
              className="text-sm font-bold active:scale-95 transition-transform"
            >
              Preventivo →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
