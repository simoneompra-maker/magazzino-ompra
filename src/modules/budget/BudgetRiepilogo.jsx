const ORDINE_CATEGORIE = ['MACCHINE', 'GEOGREEN', 'ANTIZANZARE', 'CONSULENZA'];

const STILE_CATEGORIA = {
  MACCHINE:    { label: 'Macchine',    bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' },
  GEOGREEN:    { label: 'Geogreen',    bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
  ANTIZANZARE: { label: 'Antizanzare', bg: 'bg-red-50',   border: 'border-red-200',   text: 'text-red-700'   },
  CONSULENZA:  { label: 'Consulenza',  bg: 'bg-blue-50',  border: 'border-blue-200',  text: 'text-blue-700'  },
};

const fmt = (v) =>
  v == null ? '—' : v.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtPct = (v) =>
  v == null ? null : `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;

function valT(r, t) {
  if (t === 1) return r.t1;
  if (t === 2) return r.t2;
  if (t === 3) return r.t3;
  if (t === 4) return r.t4;
  return r.totale_anno;
}

// ── Modalità Intervallo date ──────────────────────────────────────────────────
function RiepilogoDate({ totaliPeriodo }) {
  const CATS = [
    { ...STILE_CATEGORIA.MACCHINE,    val: totaliPeriodo.macchine    },
    { ...STILE_CATEGORIA.GEOGREEN,    val: totaliPeriodo.geogreen    },
    { ...STILE_CATEGORIA.ANTIZANZARE, val: totaliPeriodo.antizanzare },
    { ...STILE_CATEGORIA.CONSULENZA,  val: totaliPeriodo.consulenza  },
  ];
  const totale = totaliPeriodo.macchine + totaliPeriodo.geogreen
    + totaliPeriodo.antizanzare + totaliPeriodo.consulenza;

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {CATS.map(c => (
          <div key={c.label} className={`rounded-xl p-3 shadow-sm border ${c.bg} ${c.border}`}>
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className={`font-bold text-sm mt-0.5 ${c.text}`}>€ {fmt(c.val)}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow border border-gray-100 p-3 text-center">
        <p className="text-xs text-gray-500">Totale periodo</p>
        <p className="font-bold text-gray-800 text-lg mt-0.5">€ {fmt(totale)}</p>
      </div>
    </div>
  );
}

// ── Modalità Anno / Trimestre ─────────────────────────────────────────────────
export default function BudgetRiepilogo({ righe, loading, error, periodoMode, trimestre, totaliPeriodo }) {
  if (error) {
    return <div className="p-4 text-center text-red-600 text-sm">Errore nel caricamento: {error.message}</div>;
  }
  if (loading) {
    return <div className="p-4 text-center text-gray-400 text-sm">Caricamento...</div>;
  }

  if (periodoMode === 'date') {
    return totaliPeriodo
      ? <RiepilogoDate totaliPeriodo={totaliPeriodo} />
      : <div className="p-4 text-center text-gray-400 text-sm">Nessun dato disponibile.</div>;
  }

  if (!righe.length) {
    return <div className="p-4 text-center text-gray-400 text-sm">Nessun dato disponibile per l'anno selezionato.</div>;
  }

  const ordinate = ORDINE_CATEGORIE.map(cat => righe.find(r => r.categoria === cat)).filter(Boolean);
  const getCardVal = (r) => periodoMode === 'trimestre' ? valT(r, trimestre) : r.totale_anno;

  return (
    <div className="p-4">
      {/* Card categoria */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {ordinate.map(r => {
          const stile = STILE_CATEGORIA[r.categoria];
          return (
            <div key={r.categoria} className={`rounded-xl p-3 shadow-sm border ${stile.bg} ${stile.border}`}>
              <p className="text-xs text-gray-500">{stile.label}</p>
              <p className={`font-bold text-sm mt-0.5 ${stile.text}`}>€ {fmt(getCardVal(r))}</p>
            </div>
          );
        })}
      </div>

      {/* Tabella trimestri */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-2 py-2 text-left">Categoria</th>
              {[1, 2, 3, 4].map(t => (
                <th
                  key={t}
                  className={`px-2 py-2 text-right ${periodoMode === 'trimestre' && trimestre === t ? 'bg-green-700' : ''}`}
                >
                  T{t}
                </th>
              ))}
              <th className="px-2 py-2 text-right font-bold">Totale</th>
              <th className="px-2 py-2 text-right">Var. % a/a</th>
            </tr>
          </thead>
          <tbody>
            {ordinate.map(r => (
              <tr key={r.categoria} className="border-t border-gray-100">
                <td className="px-2 py-1.5 font-medium text-gray-700">{STILE_CATEGORIA[r.categoria].label}</td>
                {[1, 2, 3, 4].map(t => (
                  <td
                    key={t}
                    className={`px-2 py-1.5 text-right font-mono ${
                      periodoMode === 'trimestre' && trimestre === t
                        ? 'bg-green-50 font-semibold text-green-700'
                        : ''
                    }`}
                  >
                    {fmt(valT(r, t))}
                  </td>
                ))}
                <td className="px-2 py-1.5 text-right font-mono font-bold">{fmt(r.totale_anno)}</td>
                <td className={`px-2 py-1.5 text-right font-mono ${
                  r.variazione_pct == null ? 'text-gray-300' : r.variazione_pct >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {fmtPct(r.variazione_pct) || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
