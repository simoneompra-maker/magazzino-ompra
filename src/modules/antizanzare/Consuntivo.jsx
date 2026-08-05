import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Loader2, CheckCheck, FileSpreadsheet } from 'lucide-react';
import { caricaConsuntivo, inizializzaConsuntivo, salvaConsuntivo } from './antizanzareService';
import { scaricaNotaCarico } from './export/exportNotaCarico';

const VERDE = '#006B3F';
const inputCls =
  'w-full border rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500';

/**
 * Nota di carico compilabile in cantiere.
 * Le quantita' previste arrivano dalla distinta; il tecnico segna quelle
 * realmente usate e puo' aggiungere righe libere per il materiale non previsto.
 */
export default function Consuntivo({
  operatore,
  progettoId,
  titolo,
  numero,
  bom,
  progetto,
  linee,
  risultato,
  onIndietro,
}) {
  const [righe, setRighe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [errore, setErrore] = useState('');
  const [salvato, setSalvato] = useState(false);

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        let dati = await caricaConsuntivo(progettoId);
        if (dati.length === 0 && bom?.length > 0) {
          dati = await inizializzaConsuntivo(progettoId, bom);
        }
        if (vivo) setRighe(dati);
      } catch (e) {
        if (vivo) setErrore(e.message || 'Caricamento fallito');
      } finally {
        if (vivo) setLoading(false);
      }
    })();
    return () => {
      vivo = false;
    };
  }, [progettoId, bom]);

  const set = (i, campo, v) => {
    setSalvato(false);
    setRighe((r) => r.map((x, k) => (k === i ? { ...x, [campo]: v } : x)));
  };

  const aggiungiExtra = () => {
    setSalvato(false);
    setRighe((r) => [
      ...r,
      { codice: '', descrizione: '', um: 'pz', q_prevista: null, q_usata: '', extra: true, note: '' },
    ]);
  };

  const rimuovi = (i) => {
    setSalvato(false);
    setRighe((r) => r.filter((_, k) => k !== i));
  };

  /** Copia tutte le quantità previste nella colonna "usata". */
  const confermaTutto = () => {
    setSalvato(false);
    setRighe((r) => r.map((x) => (x.extra ? x : { ...x, q_usata: x.q_prevista })));
  };

  /**
   * Esporta la nota di carico in Excel. Usa le righe a schermo, cosi' il file
   * contiene anche il materiale extra aggiunto in cantiere e le quantita' gia'
   * segnate, senza bisogno di salvare prima.
   */
  const esporta = () => {
    setErrore('');
    try {
      const righeExport = righe.map((x) => ({
        code: x.codice || '',
        desc: x.descrizione,
        um: x.um || 'pz',
        q: x.q_prevista ?? '',
      }));
      scaricaNotaCarico({
        progetto: { numero, cliente_nome: titolo, ...(progetto || {}) },
        bom: righeExport.length > 0 ? righeExport : bom,
        linee: linee || [],
        risultato,
      });
    } catch (e) {
      setErrore('Export non riuscito: ' + (e.message || e));
    }
  };

  const salva = async () => {
    setSalvando(true);
    setErrore('');
    try {
      const dati = await salvaConsuntivo(progettoId, righe, operatore?.nome);
      setRighe(dati);
      setSalvato(true);
    } catch (e) {
      setErrore(e.message || 'Salvataggio fallito');
    } finally {
      setSalvando(false);
    }
  };

  const previste = righe.filter((r) => !r.extra);
  const compilate = previste.filter((r) => r.q_usata !== null && r.q_usata !== '').length;
  const extra = righe.filter((r) => r.extra);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div
        className="px-4 py-3 text-white flex items-center gap-3 sticky top-0 z-10"
        style={{ backgroundColor: VERDE }}
      >
        <button onClick={onIndietro} className="p-1 rounded-lg hover:bg-white/20" aria-label="Indietro">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-base leading-none truncate">Nota di carico</h1>
          <p className="text-white/70 text-xs mt-0.5 truncate">
            {numero} · {titolo}
          </p>
        </div>
        <button
          onClick={esporta}
          className="p-2 rounded-lg bg-white/20 hover:bg-white/30"
          title="Scarica la nota di carico in Excel"
          aria-label="Scarica in Excel"
        >
          <FileSpreadsheet className="w-4 h-4" />
        </button>
        <button
          onClick={salva}
          disabled={salvando}
          className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50"
        >
          {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salva
        </button>
      </div>

      <div className="p-4 space-y-3 max-w-3xl mx-auto">
        {errore && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">{errore}</div>
        )}
        {salvato && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm">
            Consuntivo salvato.
          </div>
        )}

        {loading ? (
          <p className="text-gray-400 text-sm text-center py-8">Caricamento…</p>
        ) : righe.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            Nessun materiale in distinta. Configura prima l'impianto.
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-xs text-gray-500 px-1">
              <span>
                Compilate <b>{compilate}</b> di {previste.length}
              </span>
              <button onClick={confermaTutto} className="flex items-center gap-1 font-semibold text-green-700">
                <CheckCheck className="w-3.5 h-3.5" /> Tutto come previsto
              </button>
            </div>

            {/* Righe previste */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
              {righe.map((r, i) =>
                r.extra ? null : (
                  <div key={i} className="p-3">
                    <p className="text-sm text-gray-800 leading-snug">{r.descrizione}</p>
                    <p className="text-xs text-gray-400 mb-2">
                      {r.codice} · previsti <b>{r.q_prevista}</b> {r.um}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block">
                        <span className="text-xs text-gray-500">Q.tà usata</span>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          value={r.q_usata ?? ''}
                          onChange={(e) => set(i, 'q_usata', e.target.value)}
                          placeholder={String(r.q_prevista ?? '')}
                          className={inputCls}
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs text-gray-500">Note</span>
                        <input value={r.note || ''} onChange={(e) => set(i, 'note', e.target.value)} className={inputCls} />
                      </label>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Righe extra aggiunte in cantiere */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-700 text-sm">
                  Materiale extra <span className="text-gray-400 font-normal">({extra.length})</span>
                </h2>
                <button
                  onClick={aggiungiExtra}
                  className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-white"
                  style={{ backgroundColor: VERDE }}
                >
                  <Plus className="w-3.5 h-3.5" /> Riga
                </button>
              </div>

              {extra.length === 0 && (
                <p className="text-xs text-gray-400 py-2 text-center">
                  Nessun materiale fuori distinta.
                </p>
              )}

              {righe.map((r, i) =>
                !r.extra ? null : (
                  <div key={i} className="border border-orange-200 bg-orange-50/50 rounded-lg p-2 mb-2 space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        value={r.descrizione || ''}
                        onChange={(e) => set(i, 'descrizione', e.target.value)}
                        placeholder="Descrizione materiale"
                        className={inputCls}
                      />
                      <button
                        onClick={() => rimuovi(i)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-100 flex-shrink-0"
                        aria-label="Rimuovi riga"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <input
                        value={r.codice || ''}
                        onChange={(e) => set(i, 'codice', e.target.value)}
                        placeholder="codice"
                        className={inputCls}
                      />
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="any"
                        value={r.q_usata ?? ''}
                        onChange={(e) => set(i, 'q_usata', e.target.value)}
                        placeholder="q.tà"
                        className={inputCls}
                      />
                      <input
                        value={r.um || 'pz'}
                        onChange={(e) => set(i, 'um', e.target.value)}
                        placeholder="u.m."
                        className={inputCls}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
