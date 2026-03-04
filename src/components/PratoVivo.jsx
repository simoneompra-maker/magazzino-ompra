import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, Leaf, Zap, BarChart2, ChevronRight, ChevronDown, ChevronUp,
  Package, AlertCircle, Loader2
} from 'lucide-react';
import { getPiani, getPianoCompleto, getRiepilogoProdotti, calcolaQuantita, getUnita } from '../services/pratoVivoService';

// ─────────────────────────────────────────────────────────────
// Costanti UI
// ─────────────────────────────────────────────────────────────
const VERDE       = '#006B3F';
const VERDE_SCURO = '#004d2e';
const GIALLO      = '#FFDD00';

const TIPO_COLORS = {
  granulare:    { bg: 'bg-green-100',  text: 'text-green-800',  label: '🌱 Granulare' },
  fogliare:     { bg: 'bg-blue-100',   text: 'text-blue-800',   label: '💧 Fogliare' },
  preparazione: { bg: 'bg-amber-100',  text: 'text-amber-800',  label: '🔧 Preparazione' },
  semina:       { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '🌾 Semina' },
  trattamento:  { bg: 'bg-purple-100', text: 'text-purple-800', label: '⚗️ Trattamento' },
};

const LIVELLO_COLORS = {
  base:     'bg-gray-100 text-gray-700',
  standard: 'bg-blue-100 text-blue-700',
  premium:  'bg-amber-100 text-amber-800',
};

const MQ_PRESETS = [50, 100, 200, 300, 500, 1000];

// ─────────────────────────────────────────────────────────────
// Componente principale
// ─────────────────────────────────────────────────────────────
export default function PratoVivo({ onNavigate }) {
  const [view, setView] = useState('home');
  const [pianoSelezionato, setPianoSelezionato] = useState(null); // { id, mq }

  const goBack = () => {
    if (view === 'pro-piano')  return setView('pro-scelta');
    if (view === 'pro-scelta') return setView('home');
    if (view === 'express')    return setView('home');
    onNavigate('home');
  };

  const handlePianoSelected = (id, mq) => {
    setPianoSelezionato({ id, mq });
    setView('pro-piano');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="px-4 py-3 text-white flex items-center gap-3 sticky top-0 z-10"
        style={{ backgroundColor: VERDE }}>
        <button
          onClick={goBack}
          className="p-1.5 rounded-lg bg-white/20 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold leading-none">PratoVivo</h1>
          <p className="text-white/70 text-xs mt-0.5">Il Metodo Taffarello</p>
        </div>
        <Leaf className="w-6 h-6 text-white/40" />
      </div>

      {/* Contenuto */}
      <div className="flex-1 p-3">
        {view === 'home'       && <HomeScreen onExpress={() => setView('express')} onPro={() => setView('pro-scelta')} />}
        {view === 'express'    && <ExpressPlaceholder />}
        {view === 'pro-scelta' && <ProScelta onPianoSelected={handlePianoSelected} />}
        {view === 'pro-piano'  && pianoSelezionato && (
          <ProPiano pianoId={pianoSelezionato.id} mq={pianoSelezionato.mq} />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HOME SCREEN
// ─────────────────────────────────────────────────────────────
function HomeScreen({ onExpress, onPro }) {
  return (
    <div className="space-y-4">
      {/* Intro */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <p className="text-xs text-gray-500 italic leading-relaxed">
          "Prima il terreno, poi l'erba." — Il tappeto erboso è la parte visibile di un sistema.
          Se il sistema suolo‑radici non funziona, qualsiasi intervento in superficie è un cerotto.
        </p>
      </div>

      {/* EXPRESS */}
      <button
        onClick={onExpress}
        className="w-full flex items-center gap-4 p-5 rounded-xl font-semibold shadow-md active:scale-95 transition-transform"
        style={{ backgroundColor: GIALLO, color: VERDE }}
      >
        <div className="p-2.5 bg-white/40 rounded-xl">
          <Zap className="w-7 h-7" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-lg font-bold">Modalità EXPRESS</div>
          <div className="text-sm opacity-70">Kit pronti per il banco</div>
          <div className="text-xs opacity-60 mt-0.5">Wizard rapido → prodotti + quantità</div>
        </div>
        <ChevronRight className="w-5 h-5 opacity-60" />
      </button>

      {/* PRO */}
      <button
        onClick={onPro}
        className="w-full flex items-center gap-4 p-5 rounded-xl font-semibold shadow-md active:scale-95 transition-transform text-white"
        style={{ backgroundColor: VERDE }}
      >
        <div className="p-2.5 bg-white/20 rounded-xl">
          <BarChart2 className="w-7 h-7" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-lg font-bold">Modalità PRO</div>
          <div className="text-sm opacity-70">Piano annuale completo</div>
          <div className="text-xs opacity-60 mt-0.5">Calendario → dosi calcolate su superficie</div>
        </div>
        <ChevronRight className="w-5 h-5 opacity-60" />
      </button>

      {/* Info fasi */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Le 3 situazioni</p>
        <div className="space-y-2">
          {[
            { icon: '🌱', fase: 'Nuova semina',  desc: 'Terreno nudo — parto da zero' },
            { icon: '🌿', fase: 'Mantenimento',  desc: 'Prato formato — lo nutro e lo mantengo' },
            { icon: '🔄', fase: 'Rigenerazione', desc: 'Prato degradato — lo recupero' },
          ].map(f => (
            <div key={f.fase} className="flex items-center gap-3">
              <span className="text-lg">{f.icon}</span>
              <div>
                <span className="text-sm font-semibold text-gray-700">{f.fase}</span>
                <span className="text-xs text-gray-400 ml-2">{f.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// EXPRESS — PLACEHOLDER (Step 5)
// ─────────────────────────────────────────────────────────────
function ExpressPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
      <div className="p-5 rounded-full" style={{ backgroundColor: GIALLO }}>
        <Zap className="w-10 h-10" style={{ color: VERDE }} />
      </div>
      <div>
        <p className="text-xl font-bold text-gray-800">Wizard Express</p>
        <p className="text-sm text-gray-500 mt-1">In arrivo — Step 5</p>
      </div>
      <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
        Il wizard rapido per il banco: genera kit con quantità calcolate e prezzo listino.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BANNER CONSIGLIO PREMIUM — nuova semina base/standard
// ─────────────────────────────────────────────────────────────
function BannerConsiglioPremiun({ piano, piani, onSwitchPremium }) {
  const [visible, setVisible] = useState(true);

  // Mostro solo se fase = nuova_semina e livello != premium
  if (!piano) return null;
  if (piano.fase !== 'nuova_semina') return null;
  if (piano.livello === 'premium') return null;
  if (!visible) return null;

  // Trova il piano premium equivalente (stesso tipo_prato, stessa fase)
  const premiumEquivalente = piani.find(
    p => p.tipo_prato === piano.tipo_prato && p.fase === 'nuova_semina' && p.livello === 'premium'
  );

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold text-amber-800">
          💡 Nuova semina: vale la pena considerare il piano Premium
        </p>
        <button
          onClick={() => setVisible(false)}
          className="text-amber-400 text-lg leading-none shrink-0"
        >×</button>
      </div>

      <p className="text-xs text-amber-700 leading-relaxed">
        Il suolo è vergine — è il momento in cui si imposta il sistema biologico per i prossimi anni.
        In questa fase il Premium tende a fare la differenza su:
      </p>

      <div className="space-y-1">
        {[
          'Velocità di attecchimento',
          'Profondità di radicamento',
          'Riduzione delle fallanze',
          'Resistenza alla siccità nei mesi estivi',
          'Minor bisogno di concime negli anni successivi',
        ].map(v => (
          <div key={v} className="flex items-center gap-2">
            <span className="text-amber-500 text-xs">→</span>
            <span className="text-xs text-amber-700">{v}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-amber-600 italic leading-relaxed">
        Non è indispensabile, ma se il cliente vuole partire con il piede giusto
        è la scelta che raccomandiamo. A prato formato si può sempre scendere di livello.
      </p>

      {premiumEquivalente && (
        <button
          onClick={() => { onSwitchPremium(premiumEquivalente); setVisible(false); }}
          className="w-full py-2.5 rounded-lg text-white text-sm font-bold active:scale-95 transition-transform"
          style={{ backgroundColor: '#92400e' }}
        >
          ⭐ Mostra piano Premium
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PRO — SELEZIONE PIANO
// ─────────────────────────────────────────────────────────────
function ProScelta({ onPianoSelected }) {
  const [piani, setPiani]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [filtroTipo, setFiltroTipo]   = useState('');
  const [filtroFase, setFiltroFase]   = useState('');
  const [filtroLiv, setFiltroLiv]     = useState('');
  const [mq, setMq]                   = useState('');
  const [pianoScelto, setPianoScelto] = useState(null);

  const caricaPiani = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPiani();
      setPiani(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { caricaPiani(); }, [caricaPiani]);

  const pianiFiltrati = piani.filter(p => {
    if (filtroTipo && p.tipo_prato !== filtroTipo) return false;
    if (filtroFase && p.fase !== filtroFase)       return false;
    if (filtroLiv  && p.livello !== filtroLiv)     return false;
    return true;
  });

  const fasi    = [...new Set(piani.map(p => p.fase))];
  const tipi    = [...new Set(piani.map(p => p.tipo_prato))];
  const livelli = [...new Set(piani.filter(p => p.livello).map(p => p.livello))];

  const procedi = () => {
    if (!pianoScelto || !mq || isNaN(parseFloat(mq))) return;
    onPianoSelected(pianoScelto.id, parseFloat(mq));
  };

  const handleSwitchPremium = (pianoPremium) => {
    setPianoScelto(pianoPremium);
  };

  if (loading) return <LoadingSpinner label="Caricamento piani..." />;
  if (error)   return <ErrorCard msg={error} onRetry={caricaPiani} />;

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-gray-600">Seleziona il piano annuale</p>

      {/* Filtri */}
      <div className="space-y-2">
        <FilterRow
          label="Tipo prato"
          options={tipi}
          labels={{ ornamentale: '🌸 Ornamentale', sportivo: '⚽ Sportivo' }}
          value={filtroTipo}
          onChange={v => { setFiltroTipo(v); setPianoScelto(null); }}
        />
        <FilterRow
          label="Situazione"
          options={fasi}
          labels={{ nuova_semina: '🌱 Nuova semina', mantenimento: '🌿 Mantenimento', rigenerazione: '🔄 Rigenerazione' }}
          value={filtroFase}
          onChange={v => { setFiltroFase(v); setPianoScelto(null); }}
        />
        <FilterRow
          label="Livello"
          options={livelli}
          labels={{ base: 'Base', standard: 'Standard', premium: '⭐ Premium' }}
          value={filtroLiv}
          onChange={v => { setFiltroLiv(v); setPianoScelto(null); }}
        />
      </div>

      {/* Lista piani */}
      <div className="space-y-2">
        {pianiFiltrati.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-4">Nessun piano corrisponde ai filtri</p>
        )}
        {pianiFiltrati.map(piano => (
          <button
            key={piano.id}
            onClick={() => setPianoScelto(piano)}
            className={`w-full text-left p-3.5 rounded-xl border-2 transition-all active:scale-95 ${
              pianoScelto?.id === piano.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-800 text-sm">{piano.label}</span>
                  {piano.livello && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LIVELLO_COLORS[piano.livello] || 'bg-gray-100 text-gray-600'}`}>
                      {piano.livello}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{piano.descrizione}</p>
              </div>
              {pianoScelto?.id === piano.id && (
                <span className="text-green-500 font-bold text-lg shrink-0">✓</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Banner consiglio Premium */}
      {pianoScelto && (
        <BannerConsiglioPremiun
          piano={pianoScelto}
          piani={piani}
          onSwitchPremium={handleSwitchPremium}
        />
      )}

      {/* Input m² */}
      {pianoScelto && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 shadow-sm">
          <p className="text-sm font-bold text-gray-700">📐 Superficie del prato</p>
          <div className="flex flex-wrap gap-2">
            {MQ_PRESETS.map(v => (
              <button
                key={v}
                onClick={() => setMq(String(v))}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                  mq === String(v) ? 'border-green-500 text-white' : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
                style={mq === String(v) ? { backgroundColor: VERDE, borderColor: VERDE } : {}}
              >
                {v} m²
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={mq}
              onChange={e => setMq(e.target.value)}
              placeholder="Inserisci m²"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
            />
            <span className="text-sm text-gray-500 font-medium">m²</span>
          </div>
        </div>
      )}

      {/* CTA */}
      {pianoScelto && mq && !isNaN(parseFloat(mq)) && parseFloat(mq) > 0 && (
        <button
          onClick={procedi}
          className="w-full py-4 rounded-xl text-white font-bold text-base shadow-md active:scale-95 transition-transform"
          style={{ backgroundColor: VERDE }}
        >
          Vedi piano per {parseFloat(mq)} m² →
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BANNER TERRENO SABBIOSO
// ─────────────────────────────────────────────────────────────
function BannerTerenoSabbioso() {
  const [aperto, setAperto] = useState(false);

  return (
    <div className="rounded-xl border overflow-hidden"
      style={{ borderColor: aperto ? '#d97706' : '#e5e7eb', backgroundColor: aperto ? '#fffbeb' : '#fff' }}>
      <button
        onClick={() => setAperto(!aperto)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">🏖️</span>
          <span className="text-sm font-semibold text-gray-700">Terreno sabbioso?</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${aperto ? 'bg-amber-200 text-amber-800' : 'bg-gray-100 text-gray-500'}`}>
            {aperto ? 'Sì' : 'No'}
          </span>
          {aperto ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {aperto && (
        <div className="px-4 pb-4 space-y-3 border-t border-amber-100">
          <p className="text-xs text-amber-800 leading-relaxed pt-3">
            La sabbia drena velocemente: i nutrienti si dilavano prima di essere assorbiti
            e l'acqua non viene trattenuta. Alcune accortezze per adattare questo piano:
          </p>

          <div className="space-y-2.5">
            {[
              {
                titolo: 'Sostituire Green 7 con AllRound CRF',
                desc: 'Il rilascio controllato resiste al dilavamento — Green 7 in suolo sabbioso viene perso con le irrigazioni.',
              },
              {
                titolo: 'Raddoppiare la dose di Humifitos (40 g/m²) + Micosat F PG',
                desc: 'La sabbia ha poca sostanza organica e quasi nessuna vita batterica. Humifitos costruisce la CEC, Micosat F PG colonizza la materia organica e la rende disponibile alle radici. Vanno sempre in coppia.',
              },
              {
                titolo: 'Aggiungere Wet Turf ad ogni irrigazione',
                desc: 'Migliora la ritenzione idrica nel suolo sabbioso e riduce la frequenza delle irrigazioni necessarie.',
              },
              {
                titolo: 'Frazionare i granulari',
                desc: 'Dosi più piccole ogni 4-5 settimane invece di dosi grandi: la sabbia non tampona e non trattiene i nutrienti a lungo termine.',
              },
            ].map(item => (
              <div key={item.titolo} className="flex gap-2.5">
                <span className="text-amber-500 text-xs mt-0.5 shrink-0">→</span>
                <div>
                  <p className="text-xs font-semibold text-amber-800">{item.titolo}</p>
                  <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-amber-500 italic">
            Questi adattamenti non cambiano i prodotti del piano — modificano dosi e frequenze.
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PRO — VISUALIZZA PIANO
// ─────────────────────────────────────────────────────────────
function ProPiano({ pianoId, mq }) {
  const [dati, setDati]                         = useState(null);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState(null);
  const [showRiepilogo, setShowRiepilogo]       = useState(false);
  const [expandedInterventi, setExpandedInterventi] = useState({});

  const carica = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await getPianoCompleto(pianoId);
      setDati(d);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [pianoId]);

  useEffect(() => { carica(); }, [carica]);

  if (loading) return <LoadingSpinner label="Caricamento piano..." />;
  if (error)   return <ErrorCard msg={error} onRetry={carica} />;
  if (!dati)   return null;

  const { piano, interventi } = dati;
  const riepilogo = getRiepilogoProdotti(interventi, mq);

  const toggleIntervento = (id) =>
    setExpandedInterventi(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-4">
      {/* Piano header */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-gray-800">{piano.label}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{piano.descrizione}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-400">Superficie</p>
            <p className="text-xl font-bold" style={{ color: VERDE }}>{mq} m²</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {piano.tipo_prato && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
              {piano.tipo_prato === 'ornamentale' ? '🌸' : '⚽'} {piano.tipo_prato}
            </span>
          )}
          {piano.fase && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {piano.fase === 'nuova_semina' ? '🌱 Nuova semina' : piano.fase === 'mantenimento' ? '🌿 Mantenimento' : '🔄 Rigenerazione'}
            </span>
          )}
          {piano.livello && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LIVELLO_COLORS[piano.livello] || ''}`}>
              {piano.livello}
            </span>
          )}
        </div>
      </div>

      {/* Banner terreno sabbioso */}
      <BannerTerenoSabbioso />

      {/* Interventi */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1">
          Calendario — {interventi.length} interventi
        </p>

        {interventi.map((intervento, idx) => {
          const tipo = TIPO_COLORS[intervento.tipo] || { bg: 'bg-gray-100', text: 'text-gray-700', label: intervento.tipo };
          const isExpanded = expandedInterventi[intervento.id] ?? true;

          return (
            <div key={intervento.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Header intervento */}
              <button
                onClick={() => toggleIntervento(intervento.id)}
                className="w-full flex items-center gap-3 p-3.5 text-left"
              >
                <div className="flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: VERDE }}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm">{intervento.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{intervento.timing}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tipo.bg} ${tipo.text}`}>
                    {tipo.label}
                  </span>
                  {isExpanded
                    ? <ChevronUp className="w-4 h-4 text-gray-400" />
                    : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {/* Prodotti */}
              {isExpanded && (
                <div className="border-t border-gray-100">
                  {(intervento.pv_intervento_prodotti || []).length === 0 ? (
                    <p className="px-4 py-3 text-xs text-gray-400 italic">Nessun prodotto — intervento meccanico</p>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {(intervento.pv_intervento_prodotti || []).map(ip => {
                        const p = ip.pv_prodotti;
                        if (!p) return null;
                        const { totale_kg, confezioni, peso } = calcolaQuantita(p.slug, ip.dose_gm2, mq);
                        const unita = getUnita(p.slug);
                        return (
                          <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-700 truncate">{p.label}</p>
                              <p className="text-xs text-gray-400">{ip.dose_gm2} g/m²</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-bold text-gray-800">{totale_kg} {unita}</p>
                              <p className="text-xs text-gray-400">{confezioni} × {peso}{unita}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {/* Nota agronomica */}
                  {intervento.nota && (
                    <div className="px-4 py-3 bg-amber-50 border-t border-amber-100">
                      <p className="text-xs text-amber-800 leading-relaxed">
                        💡 {intervento.nota}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Riepilogo totale */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowRiepilogo(!showRiepilogo)}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5" style={{ color: VERDE }} />
            <span className="font-bold text-gray-800">Lista acquisti annuale</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              {riepilogo.length} prodotti
            </span>
            {showRiepilogo
              ? <ChevronUp className="w-4 h-4 text-gray-400" />
              : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </button>

        {showRiepilogo && (
          <div className="border-t border-gray-100">
            <div className="divide-y divide-gray-50">
              {riepilogo.map(p => (
                <div key={p.slug} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 truncate">{p.label}</p>
                    <p className="text-xs text-gray-400">
                      {p.n_applicazioni} applicazion{p.n_applicazioni > 1 ? 'i' : 'e'} · {p.peso_confezione}{p.unita}/conf.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold" style={{ color: VERDE }}>{p.confezioni} conf.</p>
                    <p className="text-xs text-gray-400">{p.totale_kg} {p.unita} totali</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-400 italic">
                Quantità calcolate per {mq} m². Arrotondate alla confezione intera superiore.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="h-4" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPONENTI UI CONDIVISI
// ─────────────────────────────────────────────────────────────
function FilterRow({ label, options, labels, value, onChange }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-1.5 font-medium">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => onChange('')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            value === '' ? 'text-white border-transparent' : 'bg-white border-gray-200 text-gray-500'
          }`}
          style={value === '' ? { backgroundColor: VERDE } : {}}
        >
          Tutti
        </button>
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt === value ? '' : opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
              value === opt ? 'text-white border-transparent' : 'bg-white border-gray-200 text-gray-500'
            }`}
            style={value === opt ? { backgroundColor: VERDE } : {}}
          >
            {labels?.[opt] || opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function LoadingSpinner({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: VERDE }} />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function ErrorCard({ msg, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col items-center gap-3">
      <AlertCircle className="w-8 h-8 text-red-500" />
      <p className="text-sm text-red-700 text-center">{msg}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-lg text-white text-sm font-semibold"
        style={{ backgroundColor: VERDE }}
      >
        Riprova
      </button>
    </div>
  );
}
