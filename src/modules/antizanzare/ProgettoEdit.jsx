import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  ArrowLeft, Save, Camera, Image as ImageIcon, Trash2, AlertTriangle, ClipboardList, Loader2,
} from 'lucide-react';
import { calcolaImpianto } from './calcolo';
import { C, DEFAULTS, FISSAGGI, macchinePerBrand, sysPerBrand, portaPerTipo } from './catalogo';
import LineeEditor from './LineeEditor';
import ConfigImpianto from './ConfigImpianto';
import Consuntivo from './Consuntivo';
import { vedePrezzi } from '../../lib/permessi';
import {
  caricaProgetto, salvaProgetto, prossimoNumero, caricaFoto, urlFoto, eliminaFoto,
  cercaClienti, listaTecnici,
} from './antizanzareService';

const VERDE = '#006B3F';
const eur = (n) =>
  (Number(n) || 0).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

const inputCls =
  'w-full border rounded-lg px-2 py-1.5 text-sm bg-white disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500';

/** Configurazione di partenza per un progetto nuovo. */
function configIniziale(brand = 'gardheaven') {
  const s = sysPerBrand(brand);
  return {
    brand,
    macchinaCode: macchinePerBrand(brand)[0]?.code,
    tuboCode: s.tubo[0]?.code,
    tuboTroncoCode: s.tubo[s.tubo.length - 1]?.code,
    ugelloCode: s.ugello[0]?.code,
    portaDCode: portaPerTipo(brand, 'd')[0]?.code,
    porta9Code: portaPerTipo(brand, 'a')[0]?.code,
    tselCode: s.tsel[0]?.code,
    usaTappo: DEFAULTS.usaTappo,
    mTronco: DEFAULTS.mTronco,
    riserM: DEFAULTS.riserM,
    scontoAcq: C.brands[brand].disc,
    margine: DEFAULTS.margine,
    manoMode: DEFAULTS.manoMode,
    manoMac: DEFAULTS.manoMac,
    manoFix: DEFAULTS.manoFix,
    manoRate: DEFAULTS.manoRate,
    accessori: [],
    extra: [],
  };
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
            passo: l.passo,
            metodo: l.metodo,
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

  /* ── salvataggio ── */
  const salva = useCallback(
    async (silenzioso = false) => {
      if (!testata.cliente_nome.trim()) {
        if (!silenzioso) setErrore('Il nome cliente è obbligatorio.');
        return null;
      }
      setSalvando(true);
      setErrore('');
      try {
        const nuovoId = await salvaProgetto(
          {
            id,
            ...testata,
            data_montaggio: testata.data_montaggio || null,
            prezzo_cliente: testata.prezzo_cliente === '' ? null : Number(testata.prezzo_cliente),
            operatore: operatore?.nome,
            brand: cfg.brand,
            macchina_code: cfg.macchinaCode,
            config: cfg,
            risultato: risultato?.errore ? null : risultato,
          },
          linee
        );
        setId(nuovoId);
        setModificato(false);
        return nuovoId;
      } catch (e) {
        setErrore(e.message || 'Salvataggio fallito');
        return null;
      } finally {
        setSalvando(false);
      }
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

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setCaricandoFoto(true);
    setErrore('');
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
                <select
                  value={testata.tecnico}
                  onChange={(e) => setT({ tecnico: e.target.value })}
                  className={inputCls}
                >
                  <option value="">— nessuno —</option>
                  {tecnici.map((t) => (
                    <option key={t.nome} value={t.nome}>
                      {t.nome}
                      {t.ruolo === 'tecnico' ? ' (tecnico)' : ''}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">Data montaggio</span>
                <input
                  type="date"
                  value={testata.data_montaggio || ''}
                  onChange={(e) => setT({ data_montaggio: e.target.value })}
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
          <ConfigImpianto cfg={cfg} soloLettura={soloLettura} mostraPrezzi={mostraPrezzi} onChange={tocca(setCfg)} />
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
                  <option value="det">Macchina + ugelli</option>
                  <option value="perUg">€ per ugello</option>
                  <option value="manual">Importo manuale</option>
                </select>
              </label>

              {cfg.manoMode === 'det' && (
                <label className="block">
                  <span className="text-xs text-gray-500">Montaggio macchina €</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={cfg.manoMac ?? DEFAULTS.manoMac}
                    onChange={(e) => tocca(setCfg)({ ...cfg, manoMac: e.target.value })}
                    className={inputCls}
                  />
                </label>
              )}

              {cfg.manoMode !== 'manual' && (
                <label className="block">
                  <span className="text-xs text-gray-500">Fissaggio ugelli</span>
                  <select
                    value={cfg.manoFix || DEFAULTS.manoFix}
                    onChange={(e) => {
                      const f = FISSAGGI.find((x) => x.id === e.target.value);
                      tocca(setCfg)({ ...cfg, manoFix: e.target.value, manoRate: f?.eurUgello ?? cfg.manoRate });
                    }}
                    className={inputCls}
                  >
                    {FISSAGGI.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label} ({f.eurUgello} €/ug)
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="block">
                <span className="text-xs text-gray-500">
                  {cfg.manoMode === 'manual' ? 'Importo totale €' : '€ per ugello'}
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={cfg.manoRate ?? DEFAULTS.manoRate}
                  onChange={(e) => tocca(setCfg)({ ...cfg, manoRate: e.target.value })}
                  className={inputCls}
                />
              </label>

              <label className="block">
                <span className="text-xs text-gray-500">Sconto d'acquisto %</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={cfg.scontoAcq ?? 0}
                  onChange={(e) => tocca(setCfg)({ ...cfg, scontoAcq: e.target.value })}
                  className={inputCls}
                />
              </label>

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
              Manodopera calcolata: <b>{eur(risultato?.prezzi?.manodopera)}</b>. Riferimenti: ~10-12 ugelli
              mezza giornata, ~20-25 ugelli giornata intera.
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
                <dt>Totale</dt>
                <dd className="text-green-300">{eur(risultato.prezzi.totale)}</dd>
              </div>
            </dl>

            <label className="block mt-3">
              <span className="text-xs text-white/60">Prezzo al cliente (rieditabile)</span>
              <input
                type="number"
                min="0"
                step="10"
                value={testata.prezzo_cliente}
                onChange={(e) => setT({ prezzo_cliente: e.target.value })}
                placeholder={risultato.prezzi.totale.toFixed(2)}
                className="w-full mt-0.5 rounded-lg px-2 py-1.5 text-sm bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </label>
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
