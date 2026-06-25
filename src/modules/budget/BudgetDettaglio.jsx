import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

const fmt = (v) =>
  v == null ? '—' : v.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtCella = (v) => (!v ? '—' : fmt(v));

export default function BudgetDettaglio({ righe, loading, error }) {
  const [trimestre, setTrimestre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ricercaCliente, setRicercaCliente] = useState('');

  const filtrate = useMemo(() => {
    return righe.filter(r => {
      if (trimestre && String(r.trimestre) !== trimestre) return false;
      if (categoria === 'MACCHINE' && !r.imp_macchine) return false;
      if (categoria === 'GEOGREEN' && !r.imp_geogreen) return false;
      if (categoria === 'ANTIZANZARE' && !r.imp_antizanzare) return false;
      if (categoria === 'CONSULENZA' && !r.imp_consulenza) return false;
      if (ricercaCliente.trim()) {
        const term = ricercaCliente.trim().toLowerCase();
        if (!r.cliente?.toLowerCase().includes(term)) return false;
      }
      return true;
    });
  }, [righe, trimestre, categoria, ricercaCliente]);

  const totali = useMemo(() => filtrate.reduce((acc, r) => ({
    imp_macchine: acc.imp_macchine + (r.imp_macchine || 0),
    imp_geogreen: acc.imp_geogreen + (r.imp_geogreen || 0),
    imp_antizanzare: acc.imp_antizanzare + (r.imp_antizanzare || 0),
    imp_consulenza: acc.imp_consulenza + (r.imp_consulenza || 0),
    imponibile_totale: acc.imponibile_totale + (r.imponibile_totale || 0),
  }), { imp_macchine: 0, imp_geogreen: 0, imp_antizanzare: 0, imp_consulenza: 0, imponibile_totale: 0 }), [filtrate]);

  if (error) {
    return <div className="p-4 text-center text-red-600 text-sm">Errore nel caricamento: {error.message}</div>;
  }

  return (
    <div className="p-4">
      {/* Filtri */}
      <div className="flex flex-wrap gap-2 mb-3">
        <select value={trimestre} onChange={e => setTrimestre(e.target.value)} className="border-2 border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white">
          <option value="">— Tutti i trimestri —</option>
          <option value="1">T1</option>
          <option value="2">T2</option>
          <option value="3">T3</option>
          <option value="4">T4</option>
        </select>
        <select value={categoria} onChange={e => setCategoria(e.target.value)} className="border-2 border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white">
          <option value="">— Tutte le categorie —</option>
          <option value="MACCHINE">Macchine</option>
          <option value="GEOGREEN">Geogreen</option>
          <option value="ANTIZANZARE">Antizanzare</option>
          <option value="CONSULENZA">Consulenza</option>
        </select>
        <div className="relative flex-1 min-w-[160px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cerca cliente..."
            value={ricercaCliente}
            onChange={e => setRicercaCliente(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-lg pl-8 pr-2 py-1.5 text-sm bg-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-4 text-center text-gray-400 text-sm">Caricamento...</div>
      ) : !filtrate.length ? (
        <div className="p-4 text-center text-gray-400 text-sm">Nessuna commissione trovata.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-2 py-2 text-left">Data</th>
                <th className="px-2 py-2 text-left">Cliente</th>
                <th className="px-2 py-2 text-left">Descrizione</th>
                <th className="px-2 py-2 text-right">Macchine</th>
                <th className="px-2 py-2 text-right">Geogreen</th>
                <th className="px-2 py-2 text-right">Antizanzare</th>
                <th className="px-2 py-2 text-right">Consulenza</th>
                <th className="px-2 py-2 text-right font-bold">Imponibile</th>
              </tr>
            </thead>
            <tbody>
              {filtrate.map((r, i) => (
                <tr key={`${r.commissione_id}_${i}`} className="border-t border-gray-100">
                  <td className="px-2 py-1.5 whitespace-nowrap">{new Date(r.data).toLocaleDateString('it-IT')}</td>
                  <td className="px-2 py-1.5">{r.cliente}</td>
                  <td className="px-2 py-1.5">{r.descrizione}</td>
                  <td className="px-2 py-1.5 text-right font-mono">{fmtCella(r.imp_macchine)}</td>
                  <td className="px-2 py-1.5 text-right font-mono">{fmtCella(r.imp_geogreen)}</td>
                  <td className="px-2 py-1.5 text-right font-mono">{fmtCella(r.imp_antizanzare)}</td>
                  <td className="px-2 py-1.5 text-right font-mono">{fmtCella(r.imp_consulenza)}</td>
                  <td className="px-2 py-1.5 text-right font-mono font-bold">{fmt(r.imponibile_totale)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-800 text-white font-bold border-t-2 border-gray-600">
                <td colSpan={3} className="px-2 py-1.5 text-center text-xs">TOTALE ({filtrate.length})</td>
                <td className="px-2 py-1.5 text-right font-mono text-xs">{fmt(totali.imp_macchine)}</td>
                <td className="px-2 py-1.5 text-right font-mono text-xs">{fmt(totali.imp_geogreen)}</td>
                <td className="px-2 py-1.5 text-right font-mono text-xs">{fmt(totali.imp_antizanzare)}</td>
                <td className="px-2 py-1.5 text-right font-mono text-xs">{fmt(totali.imp_consulenza)}</td>
                <td className="px-2 py-1.5 text-right font-mono text-xs">{fmt(totali.imponibile_totale)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
