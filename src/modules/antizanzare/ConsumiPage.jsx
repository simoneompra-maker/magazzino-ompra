import { useState, useMemo } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Info } from 'lucide-react';
import {
  brandList, PRESSIONE_BAR, MESI_STAGIONE, GIORNI_PER_MESE, PASSO_PREDEFINITO,
  portataUgello, consumabiliPerBrand, C,
} from './catalogo';
import { calcolaConsumi, righeRapide, ugelliDaMetri, metriDaUgelli } from './consumi';

const VERDE = '#006B3F';

const inputCls =
  'w-full border rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500';

const eur = (n) =>
  (Number(n) || 0).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

const num = (n, dec = 1) =>
  (Number(n) || 0).toLocaleString('it-IT', { maximumFractionDigits: dec });

const Campo = ({ label, children, hint }) => (
  <label className="block">
    <span className="text-xs text-gray-500">{label}</span>
    {children}
    {hint && <span className="block text-xs text-gray-400 mt-0.5">{hint}</span>}
  </label>
);

const ETICHETTA_TIPO = { insetticida: 'Insetticida', repellente: 'Repellente' };

/**
 * Calcolatore consumi rapido, fuori dal preventivo.
 *
 * Serve in trattativa, quando il progetto non esiste ancora e il cliente
 * chiede quanto costera' tenere acceso l'impianto. L'obiettivo e' che ci
 * arrivi anche chi non conosce il sistema: si sceglie il brand, si dice
 * quanto e' lungo il perimetro, e il conto e' gia' fatto.
 *
 * PERIMETRO E UGELLI SONO LO STESSO DATO. Un ugello ogni quattro metri:
 * chi ha misurato il giardino scrive i metri, chi ha gia' contato gli
 * ugelli scrive quelli, e l'altro campo si aggiorna da solo.
 *
 * Tutto quello che un principiante non sa — portata, pressione, quale
 * ugello, quale formato di prodotto — sta sotto "Avanzate", precompilato
 * con i valori abituali.
 */
export default function ConsumiPage({ onEsci }) {
  const [brand, setBrand] = useState('geyser');
  const [passo, setPasso] = useState(PASSO_PREDEFINITO);
  const [ugelli, setUgelli] = useState(63);
  const [mesi, setMesi] = useState(MESI_STAGIONE);
  const [avanzate, setAvanzate] = useState(false);

  /* Le righe si ricostruiscono da brand, ugelli e mesi; le modifiche fatte
     a mano stanno in `deroghe`, per tipo di prodotto, e sopravvivono a un
     cambio di perimetro. Ricalcolare tutto azzerando le deroghe sarebbe
     il modo piu' rapido di far riscrivere ogni volta gli stessi numeri. */
  const [deroghe, setDeroghe] = useState({});

  const righe = useMemo(() => {
    const base = righeRapide({ brandId: brand, ugelli, mesi });
    return base.map((r) => ({ ...r, ...(deroghe[r.tipo] || {}) }));
  }, [brand, ugelli, mesi, deroghe]);

  const risultato = useMemo(() => calcolaConsumi({ prodotti: righe }), [righe]);

  const deroga = (tipo, patch) =>
    setDeroghe((d) => ({ ...d, [tipo]: { ...(d[tipo] || {}), ...patch } }));

  /** Cambio brand: prodotti e ugelli del vecchio catalogo non esistono piu'. */
  const cambiaBrand = (nuovo) => {
    setBrand(nuovo);
    setDeroghe({});
  };

  const metri = metriDaUgelli(ugelli, passo);

  /** Scrivendo i metri si ricavano gli ugelli, e viceversa. */
  const setMetri = (v) => setUgelli(ugelliDaMetri(v, passo));

  const cambiaPasso = (v) => {
    // Il perimetro resta quello: cambiando il passo cambia il numero di ugelli
    const p = Math.max(0.5, parseFloat(v) || PASSO_PREDEFINITO);
    setUgelli(ugelliDaMetri(metri, p));
    setPasso(v);
  };

  const scegliProdotto = (tipo, code) => {
    const a = consumabiliPerBrand(brand).find((x) => x.code === code);
    if (a) deroga(tipo, { code: a.code, label: a.label, litriConf: a.litri, prezzoConf: a.priceRaw });
  };

  const cambiaUgelloOPressione = (tipo, ugelloCode, bar) => {
    const art = (C.sys[C.brands[brand]?.sys]?.ugello || []).find((u) => u.code === ugelloCode);
    const { lMin, fonte } = portataUgello(art, bar);
    deroga(tipo, {
      _ugello: ugelloCode,
      _pressione: bar,
      _fontePortata: fonte,
      portataLmin: Math.round(lMin * 10000) / 10000,
    });
  };

  const listaUgelli = C.sys[C.brands[brand]?.sys]?.ugello || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="text-white px-4 py-3 flex items-center gap-3" style={{ backgroundColor: VERDE }}>
        {onEsci && (
          <button onClick={onEsci} className="p-1 -ml-1" aria-label="Indietro">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="font-semibold leading-none">Calcolatore consumi</h1>
          <p className="text-white/70 text-xs mt-0.5">Costi di gestione, senza aprire un progetto</p>
        </div>
      </header>

      <div className="p-4 space-y-3 max-w-2xl mx-auto">
        {/* ── L'impianto in tre campi ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-2">
          <Campo label="Brand">
            <select value={brand} onChange={(e) => cambiaBrand(e.target.value)} className={inputCls}>
              {brandList().map((b) => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
          </Campo>

          <div className="grid grid-cols-2 gap-2">
            <Campo label="Perimetro in metri">
              <input
                type="number" inputMode="decimal" min="0" step="10"
                value={metri}
                onChange={(e) => setMetri(e.target.value)}
                className={inputCls}
              />
            </Campo>
            <Campo label="Ugelli" hint={`Uno ogni ${passo} m`}>
              <input
                type="number" inputMode="numeric" min="0" step="1"
                value={ugelli}
                onChange={(e) => setUgelli(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className={inputCls}
              />
            </Campo>
          </div>

          <Campo label="Mesi di funzionamento" hint={`${Math.round(mesi * GIORNI_PER_MESE)} giorni`}>
            <input
              type="number" inputMode="decimal" min="0" max="12" step="1"
              value={mesi}
              onChange={(e) => setMesi(Math.max(0, parseFloat(e.target.value) || 0))}
              className={inputCls}
            />
          </Campo>
        </div>

        {/* ── I due prodotti ── */}
        {righe.map((r, i) => {
          const calc = risultato.righe[i];
          return (
            <div key={r.tipo} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-2">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-semibold text-gray-700 text-sm">{ETICHETTA_TIPO[r.tipo]}</h2>
                <span className="text-xs text-gray-400 truncate">{r.label}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Campo label="Minuti al giorno">
                  <input
                    type="number" inputMode="decimal" min="0" step="0.5"
                    value={r.minutiGiorno}
                    onChange={(e) => deroga(r.tipo, { minutiGiorno: e.target.value })}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Concentrazione %">
                  <input
                    type="number" inputMode="decimal" min="0" max="100" step="0.5"
                    value={r.percentuale}
                    onChange={(e) => deroga(r.tipo, { percentuale: e.target.value })}
                    className={inputCls}
                  />
                </Campo>
              </div>

              {calc?.attiva && (
                <div className="rounded-lg bg-gray-50 border border-gray-100 p-2 grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs">
                  <span className="text-gray-500">Miscela al giorno</span>
                  <span className="text-right tabular-nums">{num(calc.miscelaGiorno, 2)} l</span>
                  <span className="text-gray-500">Confezioni da {num(calc.litriConf, 2)} l</span>
                  <span className="text-right tabular-nums font-semibold">{calc.confezioni}</span>
                  <span className="text-gray-500">Costo</span>
                  <span className="text-right tabular-nums font-semibold" style={{ color: VERDE }}>
                    {eur(calc.costo)}
                  </span>
                  {/* La controprova: se il cliente dice che gli dura molto
                      di piu', la percentuale impostata non e' quella vera */}
                  <span className="col-span-2 text-gray-400 pt-1 border-t border-gray-200 mt-1">
                    Una confezione dura {num(calc.giorniPerConfezione, 0)} giorni di
                    funzionamento.
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {righe.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-xs text-gray-400">
              Per questo brand non ci sono prodotti di consumo a catalogo.
            </p>
          </div>
        )}

        {/* ── Il totale ── */}
        {risultato.nProdotti > 0 && (
          <div className="rounded-xl p-4 text-white shadow" style={{ backgroundColor: '#0f2a22' }}>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-white/60">Miscela nebulizzata</dt>
                <dd className="tabular-nums">{num(risultato.miscelaStagione, 0)} l</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/60">Prodotto concentrato</dt>
                <dd className="tabular-nums">{num(risultato.concentratoStagione, 1)} l</dd>
              </div>
              <div className="flex justify-between pt-2 mt-1 border-t border-white/20 text-base font-bold">
                <dt>Costo di gestione</dt>
                <dd className="text-green-300 tabular-nums">{eur(risultato.costoStagione)}</dd>
              </div>
              {mesi > 0 && (
                <div className="flex justify-between text-xs">
                  <dt className="text-white/60">Al mese</dt>
                  <dd className="tabular-nums text-white/80">{eur(risultato.costoStagione / mesi)}</dd>
                </div>
              )}
            </dl>
            <p className="text-xs text-white/40 mt-2 leading-snug">
              Prezzi IVA esclusa, su confezioni intere. Stima sui parametri d&apos;uso
              impostati: il consumo reale dipende da come viene programmata la centralina.
            </p>
          </div>
        )}

        {/* ── Avanzate ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <button
            onClick={() => setAvanzate(!avanzate)}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-700"
          >
            <span>Avanzate</span>
            {avanzate ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {avanzate && (
            <div className="mt-3 space-y-3">
              <Campo label="Passo fra gli ugelli, in metri" hint="Il perimetro resta lo stesso">
                <input
                  type="number" inputMode="decimal" min="0.5" step="0.5"
                  value={passo}
                  onChange={(e) => cambiaPasso(e.target.value)}
                  className={inputCls}
                />
              </Campo>

              {righe.map((r) => {
                const pressione = Number(r._pressione) || PRESSIONE_BAR[brand] || 0;
                return (
                  <div key={r.tipo} className="border-t pt-3 space-y-2">
                    <p className="text-xs font-semibold text-gray-600">{ETICHETTA_TIPO[r.tipo]}</p>

                    <Campo label="Prodotto">
                      <select
                        value={r.code || ''}
                        onChange={(e) => scegliProdotto(r.tipo, e.target.value)}
                        className={inputCls}
                      >
                        {consumabiliPerBrand(brand, r.tipo).map((a) => (
                          <option key={a.code} value={a.code}>
                            {a.label} · {a.priceRaw.toFixed(2)} €
                          </option>
                        ))}
                      </select>
                    </Campo>

                    <div className="grid grid-cols-3 gap-2">
                      <Campo label="Ugello">
                        <select
                          value={r._ugello || ''}
                          onChange={(e) => cambiaUgelloOPressione(r.tipo, e.target.value, pressione)}
                          className={inputCls}
                        >
                          {listaUgelli.map((u) => (
                            <option key={u.code} value={u.code}>{u.label}</option>
                          ))}
                        </select>
                      </Campo>
                      <Campo label="Bar">
                        <input
                          type="number" inputMode="decimal" min="0" step="1"
                          value={pressione}
                          onChange={(e) => cambiaUgelloOPressione(r.tipo, r._ugello, e.target.value)}
                          className={inputCls}
                        />
                      </Campo>
                      <Campo label="l/min">
                        <input
                          type="number" inputMode="decimal" min="0" step="0.001"
                          value={r.portataLmin}
                          onChange={(e) =>
                            deroga(r.tipo, { portataLmin: e.target.value, _fontePortata: 'manuale' })
                          }
                          className={inputCls}
                        />
                      </Campo>
                    </div>

                    {/* Sulle centraline a due prodotti e due uscite ogni
                        prodotto ha la sua linea, quindi i suoi ugelli. */}
                    <Campo label="Ugelli su questa linea" hint="Diverso solo sulle centraline a 2 uscite">
                      <input
                        type="number" inputMode="numeric" min="0" step="1"
                        value={r.ugelli}
                        onChange={(e) => deroga(r.tipo, { ugelli: e.target.value })}
                        className={inputCls}
                      />
                    </Campo>

                    {r._fontePortata === 'stimata' && (
                      <p className="text-xs text-amber-700 flex items-start gap-1">
                        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        Portata stimata dal diametro del foro. Il costruttore non la dichiara.
                      </p>
                    )}
                    {r._fontePortata === 'dichiarata' && (
                      <p className="text-xs text-gray-400">Portata dichiarata dal costruttore.</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
