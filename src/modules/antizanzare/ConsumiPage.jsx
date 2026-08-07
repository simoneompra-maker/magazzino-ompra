import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { brandList, PRESSIONE_BAR, GIORNI_STAGIONE, portataUgello, C } from './catalogo';
import { rigaProdotto } from './consumi';
import CalcolatoreConsumi from './CalcolatoreConsumi';

const VERDE = '#006B3F';

/**
 * Calcolatore consumi indipendente dal preventivo.
 *
 * Serve in trattativa, quando il progetto non esiste ancora e il cliente
 * chiede "e poi quanto mi costa tenerlo acceso?". Stesso motore del blocco
 * dentro il progetto: qui i numeri si digitano tutti a mano.
 */
export default function ConsumiPage({ onEsci }) {
  const [brand, setBrand] = useState('gardheaven');
  const [prodotti, setProdotti] = useState([]);

  /** Cambio brand: prodotti e ugelli del vecchio catalogo non esistono piu'. */
  const cambiaBrand = (nuovo) => {
    setBrand(nuovo);
    setProdotti([]);
  };

  /** Riga vuota gia' agganciata al primo ugello del brand. */
  const nuovaRiga = () => {
    const ugello = (C.sys[C.brands[brand]?.sys]?.ugello || [])[0];
    const bar = PRESSIONE_BAR[brand] || 0;
    const { lMin, fonte } = portataUgello(ugello, bar);
    setProdotti([
      ...prodotti,
      rigaProdotto({
        ugelli: 0,
        portataLmin: Math.round(lMin * 10000) / 10000,
        giorni: GIORNI_STAGIONE,
        _ugello: ugello?.code,
        _pressione: bar,
        _fontePortata: fonte,
      }),
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="text-white px-4 py-3 flex items-center gap-3" style={{ backgroundColor: VERDE }}>
        {onEsci && (
          <button onClick={onEsci} className="p-1 -ml-1" aria-label="Indietro">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="font-semibold">Calcolatore consumi</h1>
      </header>

      <div className="p-4 space-y-3 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <label className="block">
            <span className="text-xs text-gray-500">Brand</span>
            <select
              value={brand}
              onChange={(e) => cambiaBrand(e.target.value)}
              className="w-full border rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {brandList().map((b) => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
          </label>
        </div>

        <CalcolatoreConsumi
          brand={brand}
          prodotti={prodotti}
          onChange={setProdotti}
        />

        {prodotti.length === 0 && (
          <button
            onClick={nuovaRiga}
            className="w-full py-2 rounded-lg text-white text-sm font-semibold"
            style={{ backgroundColor: VERDE }}
          >
            Comincia con un prodotto
          </button>
        )}
      </div>
    </div>
  );
}
