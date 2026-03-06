import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, Leaf, Zap, BarChart2, ChevronRight, ChevronDown, ChevronUp,
  Package, AlertCircle, Loader2, AlertTriangle
} from 'lucide-react';
import { getPiani, getPianoCompleto, getRiepilogoProdotti, calcolaQuantita, getUnita, getMicosatNota, MICOSAT_SOGLIA_MQ } from '../services/pratoVivoService';

// ─────────────────────────────────────────────────────────────
// Costanti UI
// ─────────────────────────────────────────────────────────────
const VERDE  = '#006B3F';
const GIALLO = '#FFDD00';

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

// ── Periodi di semina per rigenerazione ──────────────────────
const PERIODI_SEMINA = [
  { value: 'mar',      label: 'Marzo',                doseVigor: 50, alert: 'ok' },
  { value: 'apr1',     label: 'Prima metà aprile',    doseVigor: 50, alert: 'ok' },
  { value: 'apr2',     label: 'Seconda metà aprile',  doseVigor: 40, alert: 'ridotta' },
  { value: 'mag_ini',  label: 'Inizio maggio (1-5)',   doseVigor: 30, alert: 'rischio' },
  { value: 'mag_oltre',label: 'Dopo 5 maggio',         doseVigor: 0,  alert: 'sconsigliato' },
];

// ── Preset % degradazione ────────────────────────────────────
const PERC_PRESETS = [10, 25, 50, 75, 100];

// ── Dose seme: sempre 40 g/m² sull'area degradata ───────────
const DOSE_SEME = 40; // g/m² — fisso

function descrizioneDiradamento(perc) {
  if (perc <= 20) return 'Ritocchi puntuali';
  if (perc <= 60) return 'Diradamento medio';
  return 'Diradamento grave';
}

// ─────────────────────────────────────────────────────────────
// Componente principale
// ─────────────────────────────────────────────────────────────
export default function PratoVivo({ onNavigate }) {
  const [view, setView] = useState('home');
  // pianoSelezionato: { id, mq, percDegrado?, periodoSemina? }
  const [pianoSelezionato, setPianoSelezionato] = useState(null);

  const goBack = () => {
    if (view === 'pro-piano')  return setView('pro-scelta');
    if (view === 'pro-scelta') return setView('home');
    if (view === 'express')    return setView('home');
    onNavigate('home');
  };

  const handlePianoSelected = (id, mq, percDegrado, periodoSemina) => {
    setPianoSelezionato({ id, mq, percDegrado, periodoSemina });
    setView('pro-piano');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="px-4 py-3 text-white flex items-center gap-3 sticky top-0 z-10"
        style={{ backgroundColor: VERDE }}>
        <button onClick={goBack} className="p-1.5 rounded-lg bg-white/20 active:scale-95 transition-transform">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold leading-none">PratoVivo</h1>
          <p className="text-white/70 text-xs mt-0.5">Il Metodo Taffarello</p>
        </div>
        <Leaf className="w-6 h-6 text-white/40" />
      </div>

      <div className="flex-1 p-3">
        {view === 'home'       && <HomeScreen onExpress={() => setView('express')} onPro={() => setView('pro-scelta')} />}
        {view === 'express'    && <ExpressPlaceholder />}
        {view === 'pro-scelta' && <ProScelta onPianoSelected={handlePianoSelected} />}
        {view === 'pro-piano'  && pianoSelezionato && (
          <ProPiano
            pianoId={pianoSelezionato.id}
            mq={pianoSelezionato.mq}
            percDegrado={pianoSelezionato.percDegrado}
            periodoSemina={pianoSelezionato.periodoSemina}
          />
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
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <p className="text-xs text-gray-500 italic leading-relaxed">
          "Prima il terreno, poi l'erba." — Il tappeto erboso è la parte visibile di un sistema.
          Se il sistema suolo‑radici non funziona, qualsiasi intervento in superficie è un cerotto.
        </p>
      </div>

      <button onClick={onExpress}
        className="w-full flex items-center gap-4 p-5 rounded-xl font-semibold shadow-md active:scale-95 transition-transform"
        style={{ backgroundColor: GIALLO, color: VERDE }}>
        <div className="p-2.5 bg-white/40 rounded-xl"><Zap className="w-7 h-7" /></div>
        <div className="flex-1 text-left">
          <div className="text-lg font-bold">Modalità EXPRESS</div>
          <div className="text-sm opacity-70">Kit pronti per il banco</div>
          <div className="text-xs opacity-60 mt-0.5">Wizard rapido → prodotti + quantità</div>
        </div>
        <ChevronRight className="w-5 h-5 opacity-60" />
      </button>

      <button onClick={onPro}
        className="w-full flex items-center gap-4 p-5 rounded-xl font-semibold shadow-md active:scale-95 transition-transform text-white"
        style={{ backgroundColor: VERDE }}>
        <div className="p-2.5 bg-white/20 rounded-xl"><BarChart2 className="w-7 h-7" /></div>
        <div className="flex-1 text-left">
          <div className="text-lg font-bold">Modalità PRO</div>
          <div className="text-sm opacity-70">Piano annuale completo</div>
          <div className="text-xs opacity-60 mt-0.5">Calendario → dosi calcolate su superficie</div>
        </div>
        <ChevronRight className="w-5 h-5 opacity-60" />
      </button>

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
// EXPRESS PLACEHOLDER
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
// BANNER CONSIGLIO PREMIUM
// ─────────────────────────────────────────────────────────────
function BannerConsiglioPremium({ piano, piani, onSwitchPremium }) {
  const [visible, setVisible] = useState(true);
  if (!piano || piano.fase !== 'nuova_semina' || piano.livello === 'premium' || !visible) return null;

  const premiumEq = piani.find(
    p => p.tipo_prato === piano.tipo_prato && p.fase === 'nuova_semina' && p.livello === 'premium'
  );

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold text-amber-800">💡 Nuova semina: vale la pena il piano Premium</p>
        <button onClick={() => setVisible(false)} className="text-amber-400 text-lg leading-none shrink-0">×</button>
      </div>
      <p className="text-xs text-amber-700 leading-relaxed">
        Il suolo è vergine — è il momento in cui si imposta il sistema biologico per i prossimi anni.
        In questa fase il Premium tende a fare la differenza su:
      </p>
      <div className="space-y-1">
        {['Velocità di attecchimento','Profondità di radicamento','Riduzione delle fallanze',
          'Resistenza alla siccità estiva','Minor bisogno di concime negli anni successivi'
        ].map(v => (
          <div key={v} className="flex items-center gap-2">
            <span className="text-amber-500 text-xs">→</span>
            <span className="text-xs text-amber-700">{v}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-amber-600 italic leading-relaxed">
        Non è indispensabile, ma se il cliente vuole partire con il piede giusto è la scelta che raccomandiamo.
      </p>
      {premiumEq && (
        <button onClick={() => { onSwitchPremium(premiumEq); setVisible(false); }}
          className="w-full py-2.5 rounded-lg text-white text-sm font-bold active:scale-95 transition-transform"
          style={{ backgroundColor: '#92400e' }}>
          ⭐ Mostra piano Premium
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PANNELLO DIRADAMENTO — solo per rigenerazione
// ─────────────────────────────────────────────────────────────
function PannelloDiradamento({ mq, percDegrado, setPercDegrado, periodoSemina, setPeriodoSemina }) {
  const mqTot = parseFloat(mq) || 0;
  const mqDeg = Math.round(mqTot * percDegrado / 100);
  const desc  = descrizioneDiradamento(percDegrado);
  const periodo = PERIODI_SEMINA.find(p => p.value === periodoSemina) || PERIODI_SEMINA[0];

  const alertConfig = {
    ok:           { bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-800',  icon: '✓', msg: 'Periodo ideale per la rigenerazione.' },
    ridotta:      { bg: 'bg-amber-50',  border: 'border-amber-200', text: 'text-amber-800',  icon: '⚡', msg: 'Periodo accettabile. Vigor Active a dose ridotta (40 g/m²) per non accumulare troppo azoto.' },
    rischio:      { bg: 'bg-orange-50', border: 'border-orange-200',text: 'text-orange-800', icon: '⚠️', msg: 'Periodo rischioso. Le temperature in aumento non lasciano tempo alle radici di consolidarsi. Vigor Active a 30 g/m². Procedere solo se non è possibile rimandare.' },
    sconsigliato: { bg: 'bg-red-50',    border: 'border-red-200',   text: 'text-red-800',    icon: '🔴', msg: 'SCONSIGLIATO. Le temperature alte non permettono un attecchimento stabile. Se il cliente vuole procedere, lo fa a suo rischio e pericolo — informalo chiaramente.' },
  };
  const ac = alertConfig[periodo.alert];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4 shadow-sm">
      <p className="text-sm font-bold text-gray-700">🔄 Valutazione diradamento</p>

      {/* Percentuale degradazione */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 font-medium">Superficie degradata</p>
          <span className="text-sm font-bold" style={{ color: VERDE }}>{percDegrado}%</span>
        </div>

        {/* Slider */}
        <input
          type="range" min="5" max="100" step="5"
          value={percDegrado}
          onChange={e => setPercDegrado(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{ accentColor: VERDE }}
        />

        {/* Preset rapidi */}
        <div className="flex gap-1.5 flex-wrap">
          {PERC_PRESETS.map(v => (
            <button key={v}
              onClick={() => setPercDegrado(v)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                percDegrado === v ? 'text-white border-transparent' : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}
              style={percDegrado === v ? { backgroundColor: VERDE } : {}}>
              {v}%
            </button>
          ))}
        </div>

        {/* Riepilogo m² */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-gray-50 rounded-lg p-2.5 text-center">
            <p className="text-xs text-gray-400">Zona degradata</p>
            <p className="text-base font-bold text-gray-800">{mqDeg} m²</p>
            <p className="text-xs text-gray-400">{desc}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5 text-center">
            <p className="text-xs text-gray-400">Dose seme</p>
            <p className="text-base font-bold" style={{ color: VERDE }}>{DOSE_SEME} g/m²</p>
            <p className="text-xs text-gray-400">su {mqDeg} m²</p>
          </div>
        </div>

        {/* Seme totale stimato */}
        {mqDeg > 0 && (
          <div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-green-700">🌾 Seme da acquistare</span>
            <span className="text-sm font-bold text-green-800">
              {(mqDeg * DOSE_SEME / 1000).toFixed(1)} kg
            </span>
          </div>
        )}
      </div>

      {/* Periodo semina */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 font-medium">Periodo previsto di semina</p>
        <div className="flex flex-wrap gap-1.5">
          {PERIODI_SEMINA.map(p => (
            <button key={p.value}
              onClick={() => setPeriodoSemina(p.value)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                periodoSemina === p.value ? 'text-white border-transparent' : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}
              style={periodoSemina === p.value ? { backgroundColor: VERDE } : {}}>
              {p.label}
            </button>
          ))}
        </div>

        {/* Alert periodo */}
        <div className={`rounded-lg border p-3 ${ac.bg} ${ac.border}`}>
          <p className={`text-xs font-semibold ${ac.text}`}>{ac.icon} {ac.msg}</p>
          {periodo.doseVigor > 0 && (
            <p className={`text-xs mt-1 ${ac.text} opacity-80`}>
              Vigor Active: <strong>{periodo.doseVigor} g/m²</strong> su tutta la superficie ({mq} m²)
            </p>
          )}
        </div>
      </div>
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
  // Diradamento — solo per rigenerazione
  const [percDegrado, setPercDegrado]     = useState(50);
  const [periodoSemina, setPeriodoSemina] = useState('mar');

  const caricaPiani = useCallback(async () => {
    setLoading(true); setError(null);
    try { setPiani(await getPiani()); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { caricaPiani(); }, [caricaPiani]);

  const isRigen = pianoScelto?.fase === 'rigenerazione';
  const mqNum   = parseFloat(mq);
  const canProceed = pianoScelto && mq && !isNaN(mqNum) && mqNum > 0;

  const periodoSel = PERIODI_SEMINA.find(p => p.value === periodoSemina);

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
    if (!canProceed) return;
    onPianoSelected(
      pianoScelto.id,
      mqNum,
      isRigen ? percDegrado  : undefined,
      isRigen ? periodoSemina : undefined
    );
  };

  if (loading) return <LoadingSpinner label="Caricamento piani..." />;
  if (error)   return <ErrorCard msg={error} onRetry={caricaPiani} />;

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-gray-600">Seleziona il piano annuale</p>

      {/* Filtri */}
      <div className="space-y-2">
        <FilterRow label="Tipo prato" options={tipi}
          labels={{ ornamentale: '🌸 Ornamentale', sportivo: '⚽ Sportivo' }}
          value={filtroTipo} onChange={v => { setFiltroTipo(v); setPianoScelto(null); }} />
        <FilterRow label="Situazione" options={fasi}
          labels={{ nuova_semina: '🌱 Nuova semina', mantenimento: '🌿 Mantenimento', rigenerazione: '🔄 Rigenerazione' }}
          value={filtroFase} onChange={v => { setFiltroFase(v); setPianoScelto(null); }} />
        <FilterRow label="Livello" options={livelli}
          labels={{ base: 'Base', standard: 'Standard', premium: '⭐ Premium' }}
          value={filtroLiv} onChange={v => { setFiltroLiv(v); setPianoScelto(null); }} />
      </div>

      {/* Lista piani */}
      <div className="space-y-2">
        {pianiFiltrati.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-4">Nessun piano corrisponde ai filtri</p>
        )}
        {pianiFiltrati.map(piano => (
          <button key={piano.id} onClick={() => setPianoScelto(piano)}
            className={`w-full text-left p-3.5 rounded-xl border-2 transition-all active:scale-95 ${
              pianoScelto?.id === piano.id ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}>
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
              {pianoScelto?.id === piano.id && <span className="text-green-500 font-bold text-lg shrink-0">✓</span>}
            </div>
          </button>
        ))}
      </div>

      {/* Banner Premium */}
      {pianoScelto && (
        <BannerConsiglioPremium piano={pianoScelto} piani={piani} onSwitchPremium={setPianoScelto} />
      )}

      {/* Input m² */}
      {pianoScelto && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 shadow-sm">
          <p className="text-sm font-bold text-gray-700">📐 Superficie totale del prato</p>
          <div className="flex flex-wrap gap-2">
            {MQ_PRESETS.map(v => (
              <button key={v} onClick={() => setMq(String(v))}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                  mq === String(v) ? 'border-green-500 text-white' : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
                style={mq === String(v) ? { backgroundColor: VERDE, borderColor: VERDE } : {}}>
                {v} m²
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input type="number" value={mq} onChange={e => setMq(e.target.value)}
              placeholder="Inserisci m²"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500" />
            <span className="text-sm text-gray-500 font-medium">m²</span>
          </div>
        </div>
      )}

      {/* Pannello diradamento — solo rigenerazione con m² inseriti */}
      {isRigen && mq && !isNaN(mqNum) && mqNum > 0 && (
        <PannelloDiradamento
          mq={mq}
          percDegrado={percDegrado}
          setPercDegrado={setPercDegrado}
          periodoSemina={periodoSemina}
          setPeriodoSemina={setPeriodoSemina}
        />
      )}

      {/* CTA — blocca se periodo sconsigliato e mostra warning */}
      {canProceed && (
        <>
          {isRigen && periodoSel?.alert === 'sconsigliato' && (
            <div className="bg-red-50 border border-red-300 rounded-xl p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 font-medium">
                Periodo sconsigliato. Il cliente procede a suo rischio e pericolo — assicurati di averlo informato.
              </p>
            </div>
          )}
          <button onClick={procedi}
            className="w-full py-4 rounded-xl text-white font-bold text-base shadow-md active:scale-95 transition-transform"
            style={{ backgroundColor: isRigen && periodoSel?.alert === 'sconsigliato' ? '#dc2626' : VERDE }}>
            {isRigen && periodoSel?.alert === 'sconsigliato'
              ? '⚠️ Procedi a rischio del cliente →'
              : `Vedi piano per ${mqNum} m² →`}
          </button>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BANNER TERRENO SABBIOSO
// ─────────────────────────────────────────────────────────────
function BannerTerenoSabbioso({ livello }) {
  const [aperto, setAperto] = useState(false);
  const isPremium = livello === 'premium';

  return (
    <div className="rounded-xl border overflow-hidden"
      style={{ borderColor: aperto ? '#d97706' : '#e5e7eb', backgroundColor: aperto ? '#fffbeb' : '#fff' }}>
      <button onClick={() => setAperto(!aperto)}
        className="w-full flex items-center justify-between px-4 py-3 text-left">
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
        <div className="px-4 pb-4 space-y-4 border-t border-amber-100 pt-3">
          <p className="text-xs text-amber-800 leading-relaxed">
            La sabbia drena velocemente: i nutrienti si dilavano e l'acqua non viene trattenuta.
            Alcune accortezze per adattare questo piano:
          </p>

          {/* Granulari */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Granulari</p>
            <div className="flex gap-2.5">
              <span className="text-amber-500 text-xs mt-0.5 shrink-0">→</span>
              <div>
                <p className="text-xs font-semibold text-amber-800">
                  Allround CRF ogni 3-4 mesi &nbsp;—&nbsp; oppure &nbsp;—&nbsp; Proslow ogni 5-6 mesi
                </p>
                <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                  A scelta del cliente. Il rilascio controllato resiste al dilavamento: in suolo sabbioso i granulari standard vengono persi con le irrigazioni prima di essere assorbiti.
                </p>
              </div>
            </div>
          </div>

          {/* Biostimolanti */}
          <div className="space-y-2.5">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">
              Biostimolanti
              {isPremium && <span className="text-amber-500 font-normal normal-case ml-1">(piano Premium)</span>}
            </p>

            {isPremium ? (
              <>
                <div className="flex gap-2.5">
                  <span className="text-amber-500 text-xs mt-0.5 shrink-0">→</span>
                  <div>
                    <p className="text-xs font-semibold text-amber-800">🌿 Ogni 20-30 giorni: Humifitos + Micosat F PG + Algapark + Root Speed</p>
                    <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                      La sabbia ha poca vita biologica: il ciclo breve è indispensabile. Root Speed stimola l'approfondimento radicale, Algapark sostiene la pianta sotto stress idrico e termico.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <span className="text-amber-500 text-xs mt-0.5 shrink-0">→</span>
                  <div>
                    <p className="text-xs font-semibold text-amber-800">💧 Da giugno — 3 trattamenti mensili: Wet Turf</p>
                    <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                      Migliora la ritenzione idrica. In piano Premium l'Algapark è già incluso nei trattamenti biostimolanti mensili, non va duplicato.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-2.5">
                  <span className="text-amber-500 text-xs mt-0.5 shrink-0">→</span>
                  <div>
                    <p className="text-xs font-semibold text-amber-800">🌿 Ogni 20-30 giorni: Humifitos + Micosat F PG</p>
                    <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                      La sabbia ha poca vita biologica: il ciclo breve è indispensabile. Humifitos costruisce la CEC, Micosat F PG colonizza la materia organica e la rende disponibile alle radici. Vanno sempre in coppia.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <span className="text-amber-500 text-xs mt-0.5 shrink-0">→</span>
                  <div>
                    <p className="text-xs font-semibold text-amber-800">💧 Da giugno — 3 trattamenti mensili: Wet Turf + Algapark</p>
                    <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                      Abbinare sempre Algapark al Wet Turf: il tensioattivo migliora la penetrazione, Algapark fornisce betaine e citochinine per la resistenza allo stress idrico estivo.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Intervento annuale */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Intervento annuale</p>
            <div className="flex gap-2.5">
              <span className="text-amber-500 text-xs mt-0.5 shrink-0">→</span>
              <div>
                <p className="text-xs font-semibold text-amber-800">🪵 Carotatura + compost vegetale maturo inodore</p>
                <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                  1 volta all'anno. Il compost vegetale maturo migliora la struttura del suolo sabbioso e aumenta la capacità di ritenzione idrica. <span className="font-semibold">Assolutamente vietato lo stallatico</span>: su sabbia il rilascio è incontrollato e brucia le radici.
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-amber-500 italic">
            Questi adattamenti non cambiano i prodotti del piano — modificano dosi, frequenze e abbinamenti.
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BANNER RIEPILOGO RIGENERAZIONE — mostrato in ProPiano
// ─────────────────────────────────────────────────────────────
function BannerRigenerazione({ mq, percDegrado, periodoSemina }) {
  const mqDeg    = Math.round(mq * percDegrado / 100);
  const desc     = descrizioneDiradamento(percDegrado);
  const periodo  = PERIODI_SEMINA.find(p => p.value === periodoSemina) || PERIODI_SEMINA[0];

  const alertConfig = {
    ok:           { bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-800' },
    ridotta:      { bg: 'bg-amber-50',  border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' },
    rischio:      { bg: 'bg-orange-50', border: 'border-orange-200',text: 'text-orange-700',badge: 'bg-orange-100 text-orange-800' },
    sconsigliato: { bg: 'bg-red-50',    border: 'border-red-200',   text: 'text-red-700',   badge: 'bg-red-100 text-red-800' },
  };
  const ac = alertConfig[periodo.alert];

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${ac.bg} ${ac.border}`}>
      <div className="flex items-center justify-between">
        <p className={`text-sm font-bold ${ac.text}`}>🔄 Riepilogo rigenerazione</p>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ac.badge}`}>{periodo.label}</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white/60 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-400">Totale prato</p>
          <p className="text-sm font-bold text-gray-800">{mq} m²</p>
        </div>
        <div className="bg-white/60 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-400">Da trattare</p>
          <p className="text-sm font-bold text-gray-800">{mqDeg} m²</p>
          <p className="text-xs text-gray-400">{percDegrado}% — {desc}</p>
        </div>
        <div className="bg-white/60 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-400">Seme</p>
          <p className="text-sm font-bold" style={{ color: VERDE }}>{DOSE_SEME} g/m²</p>
          <p className="text-xs text-gray-400">{(mqDeg * DOSE_SEME / 1000).toFixed(1)} kg totali</p>
        </div>
      </div>

      <div className={`text-xs ${ac.text} leading-relaxed`}>
        <span className="font-semibold">Vigor Active:</span>{' '}
        {periodo.doseVigor > 0
          ? `${periodo.doseVigor} g/m² su tutta la superficie (${mq} m²) — tutti gli altri prodotti su ${mq} m²`
          : '⛔ Non applicare — periodo sconsigliato per le temperature'}
      </div>

      {periodo.alert === 'sconsigliato' && (
        <div className="flex items-start gap-2 bg-red-100 border border-red-300 rounded-lg p-2">
          <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
          <p className="text-xs text-red-800 font-semibold">
            PROCEDURA A RISCHIO DEL CLIENTE — temperature troppo alte per un attecchimento stabile.
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PRO — VISUALIZZA PIANO
// ─────────────────────────────────────────────────────────────
function ProPiano({ pianoId, mq, percDegrado, periodoSemina }) {
  const [dati, setDati]                             = useState(null);
  const [loading, setLoading]                       = useState(true);
  const [error, setError]                           = useState(null);
  const [showRiepilogo, setShowRiepilogo]           = useState(false);
  const [expandedInterventi, setExpandedInterventi] = useState({});

  const carica = useCallback(async () => {
    setLoading(true); setError(null);
    try { setDati(await getPianoCompleto(pianoId)); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [pianoId]);

  useEffect(() => { carica(); }, [carica]);

  if (loading) return <LoadingSpinner label="Caricamento piano..." />;
  if (error)   return <ErrorCard msg={error} onRetry={carica} />;
  if (!dati)   return null;

  const { piano, interventi } = dati;
  const isRigen = piano.fase === 'rigenerazione';
  const riepilogo = getRiepilogoProdotti(interventi, mq);

  // Dose vigor override per rigenerazione
  const periodo    = PERIODI_SEMINA.find(p => p.value === periodoSemina);
  const doseVigor  = periodo?.doseVigor ?? 50;
  const mqDeg      = isRigen && percDegrado ? Math.round(mq * percDegrado / 100) : null;

  const toggleIntervento = (id) =>
    setExpandedInterventi(prev => ({ ...prev, [id]: !prev[id] }));

  // Calcola quantità prodotto — con override per vigor in rigenerazione
  const calcolaConOverride = (slug, doseBase, mqSurface) => {
    if (isRigen && slug === 'vigor_active' && doseVigor > 0) {
      return calcolaQuantita(slug, doseVigor, mq); // vigor su tutto il prato
    }
    return calcolaQuantita(slug, doseBase, mqSurface);
  };

  return (
    <div className="space-y-4">
      {/* Header piano */}
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

      {/* Banner rigenerazione */}
      {isRigen && percDegrado != null && periodoSemina && (
        <BannerRigenerazione mq={mq} percDegrado={percDegrado} periodoSemina={periodoSemina} />
      )}

      {/* Banner terreno sabbioso */}
      <BannerTerenoSabbioso livello={piano.livello} />

      {/* Interventi */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1">
          Calendario — {interventi.length} interventi
        </p>

        {interventi.map((intervento, idx) => {
          const tipo = TIPO_COLORS[intervento.tipo] || { bg: 'bg-gray-100', text: 'text-gray-700', label: intervento.tipo };
          const isExpanded = expandedInterventi[intervento.id] ?? true;
          // Per rigenerazione: semina usa mqDeg per info, preparazione usa mq intero
          const isSemina = intervento.tipo === 'semina';

          return (
            <div key={intervento.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <button onClick={() => toggleIntervento(intervento.id)}
                className="w-full flex items-center gap-3 p-3.5 text-left">
                <div className="flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: VERDE }}>{idx + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm">{intervento.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{intervento.timing}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tipo.bg} ${tipo.text}`}>{tipo.label}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100">
                  {/* Info seme per rigenerazione */}
                  {isRigen && isSemina && mqDeg != null && (
                    <div className="px-4 py-3 bg-yellow-50 border-b border-yellow-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-yellow-800">🌾 Quantità seme</p>
                          <p className="text-xs text-yellow-600">{DOSE_SEME} g/m² su {mqDeg} m² degradati ({percDegrado}%)</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-yellow-800">
                            {(mqDeg * DOSE_SEME / 1000).toFixed(1)} kg
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(intervento.pv_intervento_prodotti || []).length === 0 ? (
                    <p className="px-4 py-3 text-xs text-gray-400 italic">Nessun prodotto — intervento meccanico</p>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {(intervento.pv_intervento_prodotti || []).map(ip => {
                        const p = ip.pv_prodotti;
                        if (!p) return null;

                        // Override dose vigor per rigenerazione
                        const isVigor = isRigen && p.slug === 'vigor_active';
                        const doseDisplay = isVigor ? doseVigor : ip.dose_gm2;
                        const { totale_kg, confezioni, peso } = calcolaConOverride(p.slug, ip.dose_gm2, mq);
                        const unita = getUnita(p.slug);

                        return (
                          <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isVigor ? 'bg-amber-400' : 'bg-green-400'}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-700 truncate">{p.label}</p>
                              <p className="text-xs text-gray-400">
                                {ip.dose_fissa ? 'dose fissa' : `${doseDisplay} g/m²`}
                                {isVigor && <span className="text-amber-600 ml-1">(adattata al periodo)</span>}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              {ip.dose_fissa ? (
                                <p className="text-sm font-bold text-amber-700">{ip.dose_fissa_label}</p>
                              ) : isVigor && doseVigor === 0 ? (
                                <p className="text-xs text-red-600 font-semibold">⛔ Non usare</p>
                              ) : (
                                <>
                                  <p className="text-sm font-bold text-gray-800">{totale_kg} {unita}</p>
                                  <p className="text-xs text-gray-400">{confezioni} × {peso}{unita}</p>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {intervento.nota && (
                    <div className="px-4 py-3 bg-amber-50 border-t border-amber-100">
                      <p className="text-xs text-amber-800 leading-relaxed">💡 {intervento.nota}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lista acquisti */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <button onClick={() => setShowRiepilogo(!showRiepilogo)}
          className="w-full flex items-center justify-between p-4 text-left">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5" style={{ color: VERDE }} />
            <span className="font-bold text-gray-800">Lista acquisti annuale</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              {riepilogo.length} prodotti
            </span>
            {showRiepilogo ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
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
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 space-y-1.5">
              <p className="text-xs text-gray-400 italic">
                Quantità calcolate per {mq} m². Arrotondate alla confezione intera superiore.
                {isRigen && mqDeg && ` Seme: ${DOSE_SEME} g/m² su ${mqDeg} m² (${percDegrado}% degradato) = ${(mqDeg * DOSE_SEME / 1000).toFixed(1)} kg.`}
              </p>
              {riepilogo.some(p => p.slug === 'micosat_mo' || p.slug === 'micosat_pg') && (
                <p className="text-xs text-amber-600 italic">
                  💡 {getMicosatNota(mq)}
                </p>
              )}
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
        <button onClick={() => onChange('')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            value === '' ? 'text-white border-transparent' : 'bg-white border-gray-200 text-gray-500'
          }`}
          style={value === '' ? { backgroundColor: VERDE } : {}}>
          Tutti
        </button>
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt === value ? '' : opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
              value === opt ? 'text-white border-transparent' : 'bg-white border-gray-200 text-gray-500'
            }`}
            style={value === opt ? { backgroundColor: VERDE } : {}}>
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
      <button onClick={onRetry} className="px-4 py-2 rounded-lg text-white text-sm font-semibold"
        style={{ backgroundColor: VERDE }}>
        Riprova
      </button>
    </div>
  );
}
