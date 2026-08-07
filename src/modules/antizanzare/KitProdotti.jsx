import { Sparkles } from 'lucide-react';
import { consumabiliPerBrand } from './catalogo';
import { CATEGORIA_CONSUMABILI } from './calcolo';
import SelettoreVoci from './SelettoreVoci';

const VERDE = '#006B3F';

/**
 * Formato da proporre nel kit di partenza: il piu' vicino al litro.
 * Il flacone da 1 L e' quello che si consegna col montaggio — la tanica
 * da 5 L conviene al litro ma e' una scorta, non un kit d'avvio, e il
 * flaconcino da 250 ml finisce in due settimane.
 */
function formatoDiPartenza(articoli) {
  if (articoli.length === 0) return null;
  return articoli.reduce((migliore, a) =>
    Math.abs((a.litri ?? 0) - 1) < Math.abs((migliore.litri ?? 0) - 1) ? a : migliore
  );
}

/**
 * Kit di prodotti di consumo incluso nel preventivo.
 *
 * Un insetticida e un repellente del brand della centralina, in modo che
 * il cliente parta con qualcosa in mano. Sta in una sezione sua e in una
 * riga sua del riepilogo: toglierlo non cambia il prezzo dell'impianto.
 */
export default function KitProdotti({ brand, valori, soloLettura, mostraPrezzi, onChange }) {
  const articoli = consumabiliPerBrand(brand);
  const scelti = valori || [];

  const proponi = () => {
    const kit = ['insetticida', 'repellente']
      .map((t) => formatoDiPartenza(articoli.filter((a) => a.tipo === t)))
      .filter(Boolean)
      .map((a) => ({ code: a.code, q: 1 }));
    onChange(kit);
  };

  if (articoli.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h2 className="font-semibold text-gray-700 text-sm mb-1">Kit prodotti</h2>
        <p className="text-xs text-gray-400">
          Per questo brand non ci sono prodotti di consumo a catalogo.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-semibold text-gray-700 text-sm">Kit prodotti</h2>
        {!soloLettura && (
          <button
            onClick={proponi}
            className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded text-white"
            style={{ backgroundColor: VERDE }}
          >
            <Sparkles className="w-3 h-3" /> Kit di partenza
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Insetticida e repellente consegnati col montaggio. Nel preventivo restano su una
        riga a parte, fuori dal prezzo dell&apos;impianto.
      </p>

      <SelettoreVoci
        titolo="Prodotti di consumo"
        um={CATEGORIA_CONSUMABILI.um}
        articoli={articoli}
        predefinito={formatoDiPartenza(articoli)}
        valori={scelti}
        suggerito={null}
        soloLettura={soloLettura}
        mostraPrezzi={mostraPrezzi}
        apertoDiDefault={scelti.length > 0}
        onChange={(lista) => onChange(lista)}
      />
    </div>
  );
}
