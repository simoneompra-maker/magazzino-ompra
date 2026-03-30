// src/components/WidgetConsegna.jsx
// Calcolo costo trasporto A/R — Nominatim + Haversine
// Tariffe persistite in localStorage, opzionale via checkbox

import { useState, useEffect, useCallback } from 'react';
import { Truck, MapPin, Edit2, Check, X, Loader } from 'lucide-react';

// ── Coordinate sede OMPRA ────────────────────────────────────
const OMPRA_LAT = 45.7074;
const OMPRA_LNG = 12.3642; // Via Roncade 7, San Biagio di Callalta (TV)

// ── Chiave localStorage ──────────────────────────────────────
const LS_KEY = 'ompra_tariffe_trasporto';

const TARIFFE_DEFAULT = {
  leggero: { nome: 'Autocarro ≤ 3.5t', tariffa: 0.50 },
  pesante:  { nome: 'Autocarro > 3.5t', tariffa: 0.75 },
};

function loadTariffe() {
  try {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validazione: tariffa deve essere tra 0.10 e 5 €/km
      const isValid = obj =>
        obj && typeof obj.tariffa === 'number' &&
        obj.tariffa >= 0.10 && obj.tariffa <= 5.00;
      if (isValid(parsed.leggero) && isValid(parsed.pesante)) {
        return { ...TARIFFE_DEFAULT, ...parsed };
      }
    }
  } catch {}
  return { ...TARIFFE_DEFAULT };
}

function resetTariffe() {
  try { localStorage.removeItem(LS_KEY); } catch {}
  return { ...TARIFFE_DEFAULT };
}

function saveTariffe(t) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(t)); } catch {}
}

// ── Haversine ────────────────────────────────────────────────
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Geocoding via Nominatim ──────────────────────────────────
async function geocodifica(indirizzo) {
  const url = `https://nominatim.openstreetmap.org/search?` +
    `q=${encodeURIComponent(indirizzo)}&format=json&limit=1&countrycodes=it`;
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'it', 'User-Agent': 'OMPRA-Gestionale/1.0' },
  });
  const data = await res.json();
  if (!data.length) throw new Error('Indirizzo non trovato. Prova ad essere più preciso.');
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), label: data[0].display_name };
}

// ═══════════════════════════════════════════════════════════════
export default function WidgetConsegna({ onChange }) {
  // onChange(costoTotale) — chiamato ogni volta che il costo cambia

  const [attivo, setAttivo]           = useState(false);
  const [indirizzo, setIndirizzo]     = useState('');
  const [distKm, setDistKm]           = useState(null);   // km lineari × 1.3
  const [indirizzoLabel, setLabel]    = useState('');
  const [loading, setLoading]         = useState(false);
  const [errore, setErrore]           = useState('');
  const [mezzo, setMezzo]             = useState('leggero');
  const [consegna, setConsegna]       = useState(true);
  const [ritiro, setRitiro]           = useState(true);
  const [tariffe, setTariffe]         = useState(loadTariffe);
  const [editando, setEditando]       = useState(false);
  const [editTemp, setEditTemp]       = useState({});

  // Calcola km totali e costo
  const kmViaggi = distKm
    ? ((consegna ? distKm * 2 : 0) + (ritiro ? distKm * 2 : 0))
    : 0;
  const tariffaKm = tariffe[mezzo]?.tariffa || 0;
  const costo = attivo && distKm ? +(kmViaggi * tariffaKm).toFixed(2) : 0;

  // Notifica il parent
  useEffect(() => { onChange?.(costo); }, [costo]);

  // Geocoding
  async function calcola() {
    if (!indirizzo.trim()) return;
    setLoading(true);
    setErrore('');
    setDistKm(null);
    try {
      const { lat, lng, label } = await geocodifica(indirizzo);
      const lineare = haversineKm(OMPRA_LAT, OMPRA_LNG, lat, lng);
      setDistKm(+(lineare * 1.3).toFixed(1)); // fattore correttivo stradale
      setLabel(label.split(',').slice(0, 3).join(','));
    } catch (e) {
      setErrore(e.message);
    } finally {
      setLoading(false);
    }
  }

  // Salva tariffe modificate
  function salvaEdit() {
    const parseT = (v) => {
      // Accetta sia virgola che punto come separatore decimale
      const n = parseFloat(String(v).replace(',', '.'));
      if (isNaN(n) || n < 0.10 || n > 5.00) return null;
      return Math.round(n * 100) / 100; // arrotonda a 2 decimali
    };
    const t1 = parseT(editTemp.leggero);
    const t2 = parseT(editTemp.pesante);
    if (!t1 || !t2) {
      alert('Inserisci valori validi tra € 0.10 e € 5.00 per km');
      return;
    }
    const nuove = {
      leggero: { ...tariffe.leggero, tariffa: t1 },
      pesante: { ...tariffe.pesante, tariffa: t2 },
    };
    setTariffe(nuove);
    saveTariffe(nuove);
    setEditando(false);
  }

  function handleReset() {
    const def = resetTariffe();
    setTariffe(def);
    setEditando(false);
  }

  function apriEdit() {
    setEditTemp({ leggero: tariffe.leggero.tariffa, pesante: tariffe.pesante.tariffa });
    setEditando(true);
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Header — toggle principale */}
      <button
        onClick={() => { setAttivo(v => !v); if (attivo) onChange?.(0); }}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">Costi di trasporto</span>
          {costo > 0 && (
            <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              + € {costo.toFixed(2)}
            </span>
          )}
        </div>
        <div className={`w-10 h-5 rounded-full transition-colors relative ${attivo ? 'bg-green-600' : 'bg-gray-300'}`}>
          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${attivo ? 'left-5' : 'left-0.5'}`} />
        </div>
      </button>

      {/* Corpo — solo se attivo */}
      {attivo && (
        <div className="px-4 py-3 space-y-3 bg-white">

          {/* Indirizzo cliente */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1.5">Indirizzo destinazione</p>
            <div className="flex gap-2">
              <input
                value={indirizzo}
                onChange={e => { setIndirizzo(e.target.value); setDistKm(null); setErrore(''); }}
                onKeyDown={e => e.key === 'Enter' && calcola()}
                placeholder="es. Via Roma 5, Treviso"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600"
              />
              <button
                onClick={calcola}
                disabled={loading || !indirizzo.trim()}
                className="px-3 py-2 bg-green-700 text-white rounded-lg text-xs font-bold disabled:opacity-50 flex items-center gap-1">
                {loading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                {loading ? '' : 'Calcola'}
              </button>
            </div>
            {errore && <p className="text-xs text-red-500 mt-1">{errore}</p>}
            {distKm && (
              <p className="text-xs text-gray-500 mt-1">
                📍 {indirizzoLabel} — <span className="font-semibold text-green-700">~{distKm} km</span> (stima stradale)
              </p>
            )}
          </div>

          {/* Consegna / Ritiro */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1.5">Viaggi A/R inclusi</p>
            <div className="flex gap-3">
              {[
                { key: 'consegna', label: '📦 Consegna', val: consegna, set: setConsegna },
                { key: 'ritiro',   label: '🔁 Ritiro',   val: ritiro,   set: setRitiro   },
              ].map(({ key, label, val, set }) => (
                <button key={key} onClick={() => set(v => !v)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    val ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-300'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
            {distKm && kmViaggi > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                {[consegna && 'consegna A/R', ritiro && 'ritiro A/R'].filter(Boolean).join(' + ')} = <span className="font-semibold">{kmViaggi} km totali</span>
              </p>
            )}
          </div>

          {/* Mezzo */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-semibold text-gray-600">Mezzo di trasporto</p>
              {!editando ? (
                <button onClick={apriEdit} className="text-xs text-blue-600 underline flex items-center gap-0.5">
                  <Edit2 className="w-3 h-3" /> modifica tariffe
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={salvaEdit} className="text-xs text-green-700 underline flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> salva
                  </button>
                  <button onClick={() => setEditando(false)} className="text-xs text-gray-400 underline flex items-center gap-0.5">
                    <X className="w-3 h-3" /> annulla
                  </button>
                  <button onClick={handleReset} className="text-xs text-red-400 underline">
                    reset
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              {Object.entries(tariffe).map(([key, t]) => (
                <button key={key} onClick={() => setMezzo(key)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-all ${
                    mezzo === key ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-700 border-gray-200'
                  }`}>
                  <span className="font-medium">{t.nome}</span>
                  <span className="flex items-center gap-2">
                    {editando ? (
                      <span onClick={e => e.stopPropagation()} className="flex items-center gap-1">
                        <span className={mezzo === key ? 'text-green-200' : 'text-gray-400'}>€</span>
                        <input
                          type="number"
                          step="0.05"
                          value={editTemp[key]}
                          onChange={e => setEditTemp(p => ({ ...p, [key]: e.target.value }))}
                          className="w-14 text-right text-xs px-1 py-0.5 rounded border border-gray-300 text-gray-800 bg-white"
                        />
                        <span className={`text-xs ${mezzo === key ? 'text-green-200' : 'text-gray-400'}`}>/km</span>
                      </span>
                    ) : (
                      <span className={`text-xs font-bold ${mezzo === key ? 'text-green-200' : 'text-gray-500'}`}>
                        € {t.tariffa.toFixed(2)}/km
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Riepilogo costo */}
          {distKm && kmViaggi > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-green-800">Costo trasporto</p>
                  <p className="text-xs text-green-600">
                    {kmViaggi} km × € {tariffaKm.toFixed(2)}/km
                  </p>
                </div>
                <p className="text-lg font-black text-green-700">€ {costo.toFixed(2)}</p>
              </div>
            </div>
          )}

          {!distKm && !loading && (
            <p className="text-xs text-gray-400 text-center py-1">
              Inserisci l'indirizzo e premi Calcola per stimare il costo.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
