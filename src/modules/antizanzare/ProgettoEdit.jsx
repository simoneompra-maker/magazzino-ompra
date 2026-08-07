import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  ArrowLeft, Save, Camera, Image as ImageIcon, Trash2, AlertTriangle, ClipboardList, Loader2,
  Wand2, ScanText,
} from 'lucide-react';
import { calcolaImpianto, CATEGORIE, articoloPredefinito, arrotonda } from './calcolo';
import { C, DEFAULTS, EUR_PER_UGELLO } from './catalogo';
import LineeEditor from './LineeEditor';
import ConfigImpianto from './ConfigImpianto';
import Consuntivo from './Consuntivo';
import { leggiLineeDaPiantina } from './leggiPiantina';
import { vedePrezzi } from '../../lib/permessi';
import {
  caricaProgetto, salvaProgetto, prossimoNumero, caricaFoto, urlFoto, eliminaFoto,
  cercaClienti, listaTecnici, registraVociExtra,
} from './antizanzareService';

const VERDE = '#006B3F';
const eur = (n) =>
  (Number(n) || 0).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

const inputCls =
  'w-full border rounded-lg px-2 py-1.5 text-sm bg-white disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500';

/** Configurazione di partenza per un progetto nuovo. */
function configIniziale(brand = 'gardheaven') {
  return {
    brand,
    voci: {}, // per categoria: [{code, q}] — riempite dai suggerimenti
    auto: {}, // categoria -> false quando l'utente forza le quantita'
    risalitaM: DEFAULTS.risalitaM,
    scontoAcq: C.brands[brand].disc, // dal catalogo, non si dichiara a schermo
    margine: DEFAULTS.margine,
    manoMode: DEFAULTS.manoMode,
    manoMac: DEFAULTS.manoMac,
    manoRate: DEFAULTS.manoRate,
    extra: [],
  };
}

/**
 * Riporta le quantita' delle categorie "automatiche" in linea con i
 * suggerimenti del calcolo. Restituisce null se non serve toccare nulla,
 * cosi' l'effetto che la richiama non entra in ciclo.
 */
function allineaVociAuto(cfg, suggeriti) {
  if (!suggeriti) return null;
  const voci = cfg.voci || {};
  const auto = cfg.auto || {};
  const nuove = { ...voci };
  let cambiato = false;

  CATEGORIE.forEach((cat) => {
    if (auto[cat.id] === false) return; // categoria forzata a mano
    const sugg = suggeriti[cat.id];
    if (sugg == null) return; // accessori: nessun suggerimento

    // Confronto contro il valore GIA' arrotondato: se confrontassi con il
    // suggerimento grezzo, un valore come 465,33 m non risulterebbe mai
    // allineato e l'effetto si riscriverebbe all'infinito.
    const q = cat.um === 'm' ? arrotonda(sugg, 2) : Math.round(sugg);

    const attuali = voci[cat.id] || [];
    const totale = attuali.reduce((a, v) => a + (Number(v.q) || 0), 0);
    if (Math.abs(totale - q) < 0.005) return;

    if (q <= 0) {
      if (attuali.length > 0) {
        nuove[cat.id] = [];
        cambiato = true;
      }
      return;
    }

    if (attuali.length <= 1) {
      const code = attuali[0]?.code || articoloPredefinito(cfg.brand, cat.id)?.code;
      if (!code) return;
      nuove[cat.id] = [{ code, q }];
      cambiato = true;
      return;
    }

    // Piu' varianti in uso: ridistribuisco in proporzione
    const tot = attuali.reduce((a, v) => a + (Number(v.q) || 0), 0) || 1;
    let residuo = q;
    nuove[cat.id] = attuali
      .map((v, i) => {
        if (i === attuali.length - 1) return { ...v, q: Math.max(0, arrotonda(residuo, 2)) };
        const parte = cat.um === 'm'
          ? arrotonda(((Number(v.q) || 0) / tot) * q, 2)
          : Math.round(((Number(v.q) || 0) / tot) * q);
        residuo = arrotonda(residuo - parte, 2);
        return { ...v, q: parte };
      })
      .filter((v) => v.q > 0);
    cambiato = true;
  });

  return cambiato ? nuove : null;
}

export default function ProgettoEdit({ operatore, progettoId, onIndietro }) {
  const mostraPrezzi = vedePrezzi(operatore);
  const soloLettura = operatore?.ruolo === 'tecnico';

  const [caricamento, setCaricamento] = useState(Boolean(progettoId));
  const [salvando, setSalvando] = useState(false);
  const [errore, setErrore] = useState('');
  const [modificato, setModificato] = useState(false);
  const [vistaConsuntivo, setVistaConsuntivo] = useState(false);

  const [id, setId] = useState(progettoId || null);
  const [testata, setTestata] = useState({
    numero: '',
    cliente_nome: '',
    cliente_id: null,
    indirizzo: '',
    telefono: '',
    riferimento: '',
    stato: 'bozza',
    tecnico: '',
    data_preventivo: new Date().toISOString().slice(0, 10),
    data_montaggio: '',
    prezzo_cliente: '',
    note: '',
    foto_path: null,
  });
  const [cfg, setCfg] = useState(configIniziale());
  const [linee, setLinee] = useState([]);
  const [tecnici, setTecnici] = useState([]);

  /* ── caricamento iniziale ── */
  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        const t = await listaTecnici();
        if (vivo) setTecnici(t);
      } catch { /* elenco tecnici non critico */ }

      if (!progettoId) {
        try {
          const n = await prossimoNumero();
          if (vivo) setTestata((p) => ({ ...p, numero: n }));
        } catch { /* il numero viene assegnato al salvataggio */ }
        return;
      }

      try {
        const p = await caricaProgetto(progettoId);
        if (!vivo) return;
        setTestata({
          numero: p.numero || '',
          cliente_nome: p.cliente_nome || '',
          cliente_id: p.cliente_id,
          indirizzo: p.indirizzo || '',
          telefono: p.telefono || '',
          riferimento: p.riferimento || '',
          stato: p.stato || 'bozza',
          tecnico: p.tecnico || '',
          data_preventivo: p.data_preventivo || (p.created_at || '').slice(0, 10),
          data_montaggio: p.data_montaggio || '',
          prezzo_cliente: p.prezzo_cliente ?? '',
          note: p.note || '',
          foto_path: p.foto_path,
        });
        setCfg({ ...configIniziale(p.brand || 'gardheaven'), ...(p.config || {}) });
        setLinee(
          (p.linee || []).map((l) => ({
            etichetta: l.etichetta || '',
            metri: l.metri,
            metriTronco: l.metri_tronco ?? 0,
            passo: l.passo,
            anello: l.anello !== false,
            metodi: l.metodi || {},
          }))
        );
      } catch (e) {
        if (vivo) setErrore(e.message || 'Progetto non caricato');
      } finally {
        if (vivo) setCaricamento(false);
      }
    })();
    return () => {
      vivo = false;
    };
  }, [progettoId]);

  /* ── calcolo live ── */
  const risultato = useMemo(() => {
    try {
      return calcolaImpianto({ ...cfg, linee });
    } catch (e) {
      return { errore: e.message };
    }
  }, [cfg, linee]);

  /* Le categorie non forzate a mano seguono i suggerimenti del calcolo */
  useEffect(() => {
    if (soloLettura || risultato?.errore) return;
    const nuove = allineaVociAuto(cfg, risultato.suggeriti);
    if (nuove) setCfg((c) => ({ ...c, voci: nuove }));
  }, [risultato, cfg, soloLettura]);

  /* Il prezzo scritto a mano, se c'e', sostituisce il totale calcolato:
     l'IVA va calcolata su quello che il cliente paga davvero. */
  const imponibile =
    testata.prezzo_cliente === '' || testata.prezzo_cliente == null
      ? risultato?.prezzi?.imponibile ?? 0
      : Number(testata.prezzo_cliente) || 0;
  const iva = imponibile * ((risultato?.prezzi?.aliquotaIva ?? 22) / 100);

  /* Finche' e' bozza o preventivo la data che conta e' quella del
     documento; la data di montaggio serve da quando diventa ordine */
  const montaggioRilevante = ['ordine', 'montato', 'chiuso'].includes(testata.stato);

  /* ── salvataggio ──
     Due salvataggi contemporanei su un progetto ancora senza id creerebbero
     due progetti: il secondo troverebbe il numero occupato e ne prenderebbe
     uno nuovo invece di aggiornare il primo. Capita piu' facilmente di
     quanto sembri — l'autosave che parte mentre si carica la foto, un doppio
     clic su Salva — quindi le chiamate sovrapposte condividono la stessa
     promessa. */
  const salvataggioInCorso = useRef(null);

  const salva = useCallback(
    (silenzioso = false) => {
      if (salvataggioInCorso.current) return salvataggioInCorso.current;

      if (!testata.cliente_nome.trim()) {
        if (!silenzioso) setErrore('Il nome cliente è obbligatorio.');
        return Promise.resolve(null);
      }
      setSalvando(true);
      setErrore('');

      const lavoro = salvaProgetto(
        {
          id,
          ...testata,
          data_preventivo: testata.data_preventivo || null,
          data_montaggio: testata.data_montaggio || null,
          prezzo_cliente: testata.prezzo_cliente === '' ? null : Number(testata.prezzo_cliente),
          operatore: operatore?.nome,
          brand: cfg.brand,
          macchina_code: (cfg.voci?.macchine || [])[0]?.code || null,
          config: cfg,
          risultato: risultato?.errore ? null : risultato,
        },
        linee
      )
        .then((nuovoId) => {
          setId(nuovoId);
          setModificato(false);
          // Alimenta l'archivio delle voci fuori listino, senza bloccare il salvataggio
          registraVociExtra(cfg.extra, operatore?.nome).catch(() => {});
          return nuovoId;
        })
        .catch((e) => {
          setErrore(e.message || 'Salvataggio fallito');
          return null;
        })
        .finally(() => {
          setSalvando(false);
          salvataggioInCorso.current = null;
        });

      salvataggioInCorso.current = lavoro;
      return lavoro;
    },
    [id, testata, cfg, linee, risultato, operatore]
  );

  /* autosave silenzioso ogni 30 s se ci sono modifiche */
  const salvaRef = useRef(salva);
  salvaRef.current = salva;
  useEffect(() => {
    if (!modificato || soloLettura) return;
    const t = setTimeout(() => salvaRef.current(true), 30000);
    return () => clearTimeout(t);
  }, [modificato, soloLettura]);

  const tocca = (fn) => (...args) => {
    setModificato(true);
    fn(...args);
  };

  const setT = (patch) => {
    setModificato(true);
    setTestata((p) => ({ ...p, ...patch }));
  };

  /* ── foto ── */
  const fileRef = useRef(null);
  const [caricandoFoto, setCaricandoFoto] = useState(false);
  const [fileFoto, setFileFoto] = useState(null); // tenuto per rileggere senza riscaricare
  const [leggendo, setLeggendo] = useState(false);
  const [propostaLinee, setPropostaLinee] = useState(null);

  /**
   * Legge le etichette della piantina — "Insetticida 250 m" — invece di
   * farle ribattere a mano. Il risultato e' una proposta da confermare:
   * il modello puo' sbagliare e i metri di Google Earth sono il dato su
   * cui si costruisce tutto il preventivo.
   */
  const leggiPiantina = async () => {
    setErrore('');
    setLeggendo(true);
    try {
      let sorgente = fileFoto;
      if (!sorgente && foto) {
        const risposta = await fetch(foto);
        if (!risposta.ok) throw new Error('Foto non scaricabile');
        sorgente = await risposta.blob();
      }
      if (!sorgente) throw new Error('Carica prima una foto.');

      const lette = await leggiLineeDaPiantina(sorgente);
      if (lette.length === 0) {
        setErrore('Nessuna etichetta con i metri trovata sulla piantina. Aggiungi le linee a mano.');
        return;
      }
      setPropostaLinee(lette);
    } catch (e) {
      setErrore('Lettura della piantina non riuscita: ' + (e.message || e));
    } finally {
      setLeggendo(false);
    }
  };

  const confermaProposta = (sostituisci) => {
    setModificato(true);
    setLinee((attuali) => (sostituisci ? propostaLinee : [...attuali, ...propostaLinee]));
    setPropostaLinee(null);
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setCaricandoFoto(true);
    setErrore('');
    setFileFoto(file);
    try {
      let pid = id;
      if (!pid) {
        pid = await salva(true); // serve un id per il path della foto
        if (!pid) throw new Error('Salva prima il progetto: serve il nome cliente.');
      }
      const path = await caricaFoto(pid, file);
      setTestata((p) => ({ ...p, foto_path: path }));
      setModificato(true);
    } catch (err) {
      setErrore(err.message || 'Caricamento foto fallito');
    } finally {
      setCaricandoFoto(false);
    }
  };

  const rimuoviFoto = async () => {
    if (!testata.foto_path) return;
    try {
      await eliminaFoto(testata.foto_path);
    } catch { /* il file potrebbe non esserci piu' */ }
    setT({ foto_path: null });
  };

  /* ── autocomplete cliente ── */
  const [suggerimenti, setSuggerimenti] = useState([]);
  const [mostraSugg, setMostraSugg] = useState(false);

  useEffect(() => {
    const q = testata.cliente_nome;
    if (!mostraSugg || q.trim().length < 2) {
      setSuggerimenti([]);
      return;
    }
    const t = setTimeout(async () => setSuggerimenti(await cercaClienti(q)), 250);
    return () => clearTimeout(t);
  }, [testata.cliente_nome, mostraSugg]);

  const scegliCliente = (c) => {
    setT({
      cliente_nome: c.nome,
      cliente_id: c.id,
      indirizzo: c.indirizzo || testata.indirizzo,
      telefono: c.telefono || testata.telefono,
    });
    setMostraSugg(false);
    setSuggerimenti([]);
  };

  /* ── consuntivo ── */
  if (vistaConsuntivo && id) {
    return (
      <Consuntivo
        operatore={operatore}
        progettoId={id}
        titolo={testata.cliente_nome}
        numero={testata.numero}
        bom={risultato?.bom || []}
        progetto={testata}
        linee={risultato?.linee || linee}
        risultato={risultato}
        onIndietro={() => setVistaConsuntivo(false)}
      />
    );
  }

  if (caricamento) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-green-700" />
      </div>
    );
  }

  const foto = urlFoto(testata.foto_path);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div
        className="px-4 py-3 text-white flex items-center gap-3 sticky top-0 z-10"
        style={{ backgroundColor: VERDE }}
      >
        <button onClick={onIndietro} className="p-1 rounded-lg hover:bg-white/20" aria-label="Indietro">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-base leading-none truncate">
            {testata.cliente_nome || 'Nuovo progetto'}
          </h1>
          <p className="text-white/70 text-xs mt-0.5">
            {testata.numero}
            {modificato && ' · non salvato'}
          </p>
        </div>
        {!soloLettura && (
          <button
            onClick={() => salva(false)}
            disabled={salvando}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50"
          >
            {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salva
          </button>
        )}
      </div>

      <div className="p-4 space-y-3 max-w-3xl mx-auto">
        {errore && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errore}</span>
          </div>
        )}

        {/* ── CLIENTE ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-2">
          <h2 className="font-semibold text-gray-700 text-sm mb-1">Cliente</h2>

          <div className="relative">
            <label className="block">
              <span className="text-xs text-gray-500">Nome *</span>
              <input
                value={testata.cliente_nome}
                onChange={(e) => {
                  setT({ cliente_nome: e.target.value, cliente_id: null });
                  setMostraSugg(true);
                }}
                onFocus={() => setMostraSugg(true)}
                onBlur={() => setTimeout(() => setMostraSugg(false), 150)}
                disabled={soloLettura}
                placeholder="Digita almeno 2 lettere per cercare in rubrica"
                className={inputCls}
              />
            </label>

            {mostraSugg && suggerimenti.length > 0 && (
              <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                {suggerimenti.map((c) => (
                  <button
                    key={c.id}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => scegliCliente(c)}
                    className="w-full text-left px-3 py-2 hover:bg-green-50 border-b last:border-0"
                  >
                    <p className="text-sm font-medium text-gray-800">{c.nome}</p>
                    {(c.indirizzo || c.telefono) && (
                      <p className="text-xs text-gray-400 truncate">
                        {[c.indirizzo, c.telefono].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="text-xs text-gray-500">Indirizzo</span>
              <input
                value={testata.indirizzo}
                onChange={(e) => setT({ indirizzo: e.target.value })}
                disabled={soloLettura}
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="text-xs text-gray-500">Telefono</span>
              <input
                value={testata.telefono}
                onChange={(e) => setT({ telefono: e.target.value })}
                disabled={soloLettura}
                className={inputCls}
              />
            </label>
          </div>

          {!soloLettura && (
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="text-xs text-gray-500">Riferimento</span>
                <input
                  value={testata.riferimento}
                  onChange={(e) => setT({ riferimento: e.target.value })}
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">Stato</span>
                <select
                  value={testata.stato}
                  onChange={(e) => setT({ stato: e.target.value })}
                  className={inputCls}
                >
                  <option value="bozza">Bozza</option>
                  <option value="preventivo">Preventivo</option>
                  <option value="ordine">Ordine</option>
                  <option value="montato">Montato</option>
                  <option value="chiuso">Chiuso</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">Tecnico assegnato</span>
                {/* Campo libero con suggerimenti: il montatore puo' essere
                    anche un esterno che non e' fra gli operatori dell'app */}
                <input
                  list="az-tecnici"
                  value={testata.tecnico}
                  onChange={(e) => setT({ tecnico: e.target.value })}
                  placeholder="Nome del montatore"
                  className={inputCls}
                />
                <datalist id="az-tecnici">
                  {tecnici.map((t) => (
                    <option key={t.nome} value={t.nome} />
                  ))}
                </datalist>
              </label>
              {/* La data di montaggio serve solo da quando il lavoro e'
                  confermato: prima conta quella del documento */}
              <label className="block">
                <span className="text-xs text-gray-500">
                  {montaggioRilevante ? 'Data montaggio' : 'Data preventivo'}
                </span>
                <input
                  type="date"
                  value={
                    (montaggioRilevante ? testata.data_montaggio : testata.data_preventivo) || ''
                  }
                  onChange={(e) =>
                    setT(
                      montaggioRilevante
                        ? { data_montaggio: e.target.value }
                        : { data_preventivo: e.target.value }
                    )
                  }
                  className={inputCls}
                />
              </label>
            </div>
          )}
        </div>

        {/* ── FOTO ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-700 text-sm mb-2">Foto progetto</h2>

          {foto ? (
            <div className="relative">
              <img src={foto} alt="Planimetria del progetto" className="w-full rounded-lg border border-gray-200" />
              {!soloLettura && (
                <button
                  onClick={rimuoviFoto}
                  className="absolute top-2 right-2 bg-white/90 p-2 rounded-lg text-red-500 shadow"
                  aria-label="Rimuovi foto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-lg py-8 text-center text-gray-400">
              <ImageIcon className="w-8 h-8 mx-auto mb-1 text-gray-300" />
              <p className="text-xs">Nessuna foto. Carica la piantina di Google Earth.</p>
            </div>
          )}

          {!soloLettura && (
            <div className="flex gap-2 mt-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={onFile}
                className="hidden"
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={caricandoFoto}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border-2 text-sm font-semibold disabled:opacity-50"
                style={{ borderColor: VERDE, color: VERDE }}
              >
                {caricandoFoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                {foto ? 'Sostituisci' : 'Scatta o carica'}
              </button>

              {foto && (
                <button
                  onClick={leggiPiantina}
                  disabled={leggendo}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-50"
                  style={{ backgroundColor: VERDE }}
                  title="Legge le etichette con i metri scritte sulla piantina"
                >
                  {leggendo ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanText className="w-4 h-4" />}
                  Leggi le linee
                </button>
              )}
            </div>
          )}

          {/* Proposta letta dalla piantina, da confermare */}
          {propostaLinee && (
            <div className="mt-3 border-2 rounded-lg p-3" style={{ borderColor: VERDE }}>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Trovate {propostaLinee.length} linee sulla piantina
              </p>
              <p className="text-xs text-gray-500 mb-2">
                Controlla i metri prima di confermare: sono quelli scritti sull'etichetta di
                Google Earth.
              </p>

              <ul className="text-sm text-gray-700 mb-3 space-y-0.5">
                {propostaLinee.map((l, i) => (
                  <li key={i} className="flex justify-between gap-2 border-b last:border-0 py-1">
                    <span className="truncate">
                      {l.etichetta}
                      {l.colore && <span className="text-gray-400"> · {l.colore}</span>}
                    </span>
                    <b className="flex-shrink-0">{l.metri} m</b>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => confermaProposta(true)}
                  className="px-3 py-1.5 rounded-lg text-white text-sm font-semibold"
                  style={{ backgroundColor: VERDE }}
                >
                  {linee.length > 0 ? 'Sostituisci le linee' : 'Usa queste linee'}
                </button>
                {linee.length > 0 && (
                  <button
                    onClick={() => confermaProposta(false)}
                    className="px-3 py-1.5 rounded-lg border-2 text-sm font-semibold"
                    style={{ borderColor: VERDE, color: VERDE }}
                  >
                    Aggiungi a quelle esistenti
                  </button>
                )}
                <button
                  onClick={() => setPropostaLinee(null)}
                  className="px-3 py-1.5 rounded-lg text-sm text-gray-500"
                >
                  Annulla
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── LINEE ── */}
        <LineeEditor
          linee={linee}
          brand={cfg.brand}
          soloLettura={soloLettura}
          risultato={risultato}
          onChange={tocca(setLinee)}
        />

        {/* ── IMPIANTO ── */}
        {!soloLettura && (
          <ConfigImpianto
            cfg={cfg}
            risultato={risultato}
            soloLettura={soloLettura}
            mostraPrezzi={mostraPrezzi}
            onChange={tocca(setCfg)}
          />
        )}

        {/* ── MANODOPERA E MARGINE ── */}
        {mostraPrezzi && !soloLettura && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-2">
            <h2 className="font-semibold text-gray-700 text-sm">Manodopera e margine</h2>

            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="text-xs text-gray-500">Modalità</span>
                <select
                  value={cfg.manoMode}
                  onChange={(e) => tocca(setCfg)({ ...cfg, manoMode: e.target.value })}
                  className={inputCls}
                >
                  <option value="det">Per ugello</option>
                  <option value="manual">Importo manuale</option>
                </select>
              </label>

              {cfg.manoMode === 'det' ? (
                <>
                  <label className="block">
                    <span className="text-xs text-gray-500">€ per ugello</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={cfg.manoRate ?? EUR_PER_UGELLO}
                      onChange={(e) => tocca(setCfg)({ ...cfg, manoRate: e.target.value })}
                      className={inputCls}
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-gray-500">Programmazione centralina €</span>
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={cfg.manoMac ?? 0}
                      onChange={(e) => tocca(setCfg)({ ...cfg, manoMac: e.target.value })}
                      className={inputCls}
                    />
                  </label>
                </>
              ) : (
                <label className="block">
                  <span className="text-xs text-gray-500">Importo totale €</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={cfg.manoRate ?? 0}
                    onChange={(e) => tocca(setCfg)({ ...cfg, manoRate: e.target.value })}
                    className={inputCls}
                  />
                </label>
              )}

              <label className="block">
                <span className="text-xs text-gray-500">Margine sul materiale %</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={cfg.margine ?? 0}
                  onChange={(e) => tocca(setCfg)({ ...cfg, margine: e.target.value })}
                  className={inputCls}
                />
              </label>
            </div>

            <p className="text-xs text-gray-400">
              Manodopera calcolata: <b>{eur(risultato?.prezzi?.manodopera)}</b>
              {cfg.manoMode === 'det' && risultato?.ugelliMontati > 0 && (
                <> — {risultato.ugelliMontati} ugelli × {eur(cfg.manoRate ?? EUR_PER_UGELLO)}</>
              )}
              . Tariffa unica per ugello, indipendente dal tipo di fissaggio: le ore di montaggio
              risultano circa la metà del numero di ugelli, centralina e tubi compresi.
            </p>
          </div>
        )}

        {/* ── AVVISI ── */}
        {risultato?.avvisi?.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-xs space-y-1">
            {risultato.avvisi.map((a, i) => (
              <p key={i} className="flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                {a}
              </p>
            ))}
          </div>
        )}

        {risultato?.errore && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-xs">
            Calcolo non riuscito: {risultato.errore}
          </div>
        )}

        {/* ── RIEPILOGO ── */}
        {mostraPrezzi && !risultato?.errore && (
          <div className="rounded-xl p-4 text-white shadow" style={{ backgroundColor: '#0f2a22' }}>
            <h2 className="font-semibold text-sm mb-2 text-white/80">Riepilogo</h2>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-white/60">Costo materiali</dt>
                <dd>{eur(risultato.costi.totale)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/60">Vendita materiali</dt>
                <dd>{eur(risultato.prezzi.venditaMateriale)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/60">Margine</dt>
                <dd className="text-green-300">
                  {eur(risultato.margine)} · {risultato.marginePct.toFixed(1)}%
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/60">Manodopera</dt>
                <dd>{eur(risultato.prezzi.manodopera)}</dd>
              </div>
              <div className="flex justify-between pt-2 mt-1 border-t border-white/20 text-base font-bold">
                <dt>Totale imponibile</dt>
                <dd className="text-green-300">{eur(imponibile)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/60">IVA {risultato.prezzi.aliquotaIva}%</dt>
                <dd>{eur(iva)}</dd>
              </div>
              <div className="flex justify-between text-base font-bold">
                <dt>Totale IVA compresa</dt>
                <dd className="text-green-300">{eur(imponibile + iva)}</dd>
              </div>
            </dl>

            <label className="block mt-3">
              <span className="text-xs text-white/60">
                Prezzo al cliente, imponibile (rieditabile)
              </span>
              <input
                type="number"
                min="0"
                step="10"
                value={testata.prezzo_cliente}
                onChange={(e) => setT({ prezzo_cliente: e.target.value })}
                placeholder={risultato.prezzi.imponibile.toFixed(2)}
                className="w-full mt-0.5 rounded-lg px-2 py-1.5 text-sm bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </label>
            <p className="text-xs text-white/50 mt-1">
              Tutti i prezzi del catalogo sono IVA esclusa. Se scrivi un prezzo qui, l'IVA sopra
              viene ricalcolata su quello.
            </p>
          </div>
        )}

        {/* ── NOTE ── */}
        {!soloLettura && (
          <label className="block bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <span className="text-xs text-gray-500">Note</span>
            <textarea
              rows={3}
              value={testata.note}
              onChange={(e) => setT({ note: e.target.value })}
              className={inputCls}
            />
          </label>
        )}

        {/* ── CONSUNTIVO ── */}
        <button
          onClick={async () => {
            const pid = id || (await salva(false));
            if (pid) setVistaConsuntivo(true);
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm"
          style={{ borderColor: VERDE, color: VERDE }}
        >
          <ClipboardList className="w-5 h-5" />
          Nota di carico e consuntivo
        </button>
      </div>
    </div>
  );
}
