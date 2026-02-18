import { useState } from 'react'
import * as XLSX from 'xlsx'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://eoswkplehhmtxtattsha.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvc3drcGxlaGhtdHh0YXR0c2hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2MTY3NzcsImV4cCI6MjA4MjE5Mjc3N30.cUg61XjJf2fmTi6dAQ2EaBl49pRrtgBTN7A2EyMyvLI'
)

// Legge un foglio Excel e restituisce array di prodotti normalizzati
function parseFoglio(foglio, categoria) {
  const righe = XLSX.utils.sheet_to_json(foglio, { header: 1 })
  const prodotti = []

  for (let i = 0; i < righe.length; i++) {
    const riga = righe[i]
    // Identifica righe prodotto: colonna 0 deve essere un codice stringa non vuoto
    // e colonna 2 (prezzo A con IVA) deve essere un numero
    const codice = riga[0]
    const descrizione = riga[1]
    const prezzoA = riga[2]

    if (
      codice && typeof codice === 'string' && codice.trim() &&
      descrizione && typeof descrizione === 'string' &&
      typeof prezzoA === 'number' && prezzoA > 0
    ) {
      prodotti.push({
        brand: 'GEOGREEN',
        categoria,
        codice: codice.trim(),
        descrizione: descrizione.trim(),
        confezione: riga[2] && typeof righe[i][2] === 'string' ? null : null, // gestito sotto
        prezzo_a: typeof riga[3] === 'number' ? riga[3] : (typeof riga[2] === 'number' ? riga[2] : null),
        prezzo_b: null,
        prezzo_c: null,
        prezzo_d: null,
        iva: null,
      })
    }
  }
  return prodotti
}

// Parser specifico per i fogli STAMPA SEME e STAMPA CONCIMI
function parseGeogreen(workbook) {
  const prodotti = []

  const fogli = [
    { nome: 'STAMPA SEME', categoria: 'Sementi' },
    { nome: 'STAMPA CONCIMI', categoria: 'Concimi' },
  ]

  for (const { nome, categoria } of fogli) {
    const foglio = workbook.Sheets[nome]
    if (!foglio) continue

    const righe = XLSX.utils.sheet_to_json(foglio, { header: 1 })

    // Trova la riga header (quella con "Cod." o "Linea")
    let headerRow = -1
    for (let i = 0; i < Math.min(5, righe.length); i++) {
      const r = righe[i]
      if (r && r.some(c => typeof c === 'string' && (c.includes('Cod') || c.includes('Linea')))) {
        headerRow = i
        break
      }
    }

    // Struttura fogli STAMPA:
    // Col 0: Codice, Col 1: Linea/Descrizione, Col 2: conf.Kg, Col 3: Prezzo A (IVA), 
    // Col 4: Prezzo B, Col 5: Prezzo C, Col 6: Prezzo D, Col 7: Extra sconto, Col 8: IVA
    for (let i = (headerRow >= 0 ? headerRow + 2 : 2); i < righe.length; i++) {
      const r = righe[i]
      if (!r) continue

      const codice = r[0]
      const descrizione = r[1]
      const prezzoA = r[3]

      // Salta righe intestazione categoria (es. "ARES SEED", "LINEA ALBATROS")
      if (!codice || typeof codice !== 'string' || codice.trim() === '') continue
      if (typeof prezzoA !== 'number') continue

      prodotti.push({
        brand: 'GEOGREEN',
        categoria,
        codice: String(codice).trim(),
        descrizione: descrizione ? String(descrizione).trim() : '',
        confezione: r[2] ? String(r[2]).trim() : null,
        prezzo_a: typeof r[3] === 'number' ? r[3] : null,
        prezzo_b: typeof r[4] === 'number' ? r[4] : null,
        prezzo_c: typeof r[5] === 'number' ? r[5] : null,
        prezzo_d: typeof r[6] === 'number' ? r[6] : null,
        iva: typeof r[8] === 'number' ? r[8] * 100 : null,
      })
    }
  }

  return prodotti
}

export default function Listini() {
  const [tab, setTab] = useState('cerca') // 'cerca' | 'upload'
  const [file, setFile] = useState(null)
  const [anteprima, setAnteprima] = useState([])
  const [loading, setLoading] = useState(false)
  const [messaggio, setMessaggio] = useState(null)
  const [query, setQuery] = useState('')
  const [risultati, setRisultati] = useState([])
  const [cercando, setCercando] = useState(false)

  // Legge il file Excel e mostra anteprima
  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setMessaggio(null)

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const wb = XLSX.read(ev.target.result, { type: 'array' })
        const prodotti = parseGeogreen(wb)
        setAnteprima(prodotti)
        if (prodotti.length === 0) {
          setMessaggio({ tipo: 'errore', testo: 'Nessun prodotto trovato. Verifica che il file sia il listino Geogreen corretto.' })
        }
      } catch (err) {
        setMessaggio({ tipo: 'errore', testo: 'Errore nella lettura del file: ' + err.message })
      }
    }
    reader.readAsArrayBuffer(f)
  }

  // Importa i prodotti su Supabase
  const handleImporta = async () => {
    if (anteprima.length === 0) return
    setLoading(true)
    setMessaggio(null)

    try {
      const { error } = await supabase
        .from('listini')
        .upsert(
          anteprima.map(p => ({ ...p, data_aggiornamento: new Date().toISOString() })),
          { onConflict: 'brand,codice' }
        )

      if (error) throw error

      setMessaggio({ tipo: 'ok', testo: `✓ Importati ${anteprima.length} prodotti Geogreen con successo.` })
      setAnteprima([])
      setFile(null)
    } catch (err) {
      setMessaggio({ tipo: 'errore', testo: 'Errore durante il salvataggio: ' + err.message })
    } finally {
      setLoading(false)
    }
  }

  // Ricerca prodotti
  const handleCerca = async (valore) => {
    setQuery(valore)
    if (valore.trim().length < 2) {
      setRisultati([])
      return
    }
    setCercando(true)
    const { data } = await supabase
      .from('listini')
      .select('*')
      .or(`codice.ilike.%${valore}%,descrizione.ilike.%${valore}%`)
      .order('brand')
      .limit(20)
    setRisultati(data || [])
    setCercando(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">📋 Listini Prezzi</h1>

        {/* Tab */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('cerca')}
            className={`px-4 py-2 rounded-lg font-medium ${tab === 'cerca' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border'}`}
          >
            🔍 Cerca Prodotto
          </button>
          <button
            onClick={() => setTab('upload')}
            className={`px-4 py-2 rounded-lg font-medium ${tab === 'upload' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border'}`}
          >
            📤 Aggiorna Listino
          </button>
        </div>

        {/* TAB CERCA */}
        {tab === 'cerca' && (
          <div className="bg-white rounded-xl shadow p-4">
            <input
              type="text"
              placeholder="Cerca per codice o descrizione (es. SHUR701, Hurricane...)"
              value={query}
              onChange={e => handleCerca(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {cercando && <p className="text-gray-400 mt-3 text-sm">Ricerca in corso...</p>}

            {risultati.length > 0 && (
              <div className="mt-4 space-y-2">
                {risultati.map(p => (
                  <div key={p.id} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-sm text-gray-500">{p.brand} · {p.codice}</span>
                        <p className="font-medium text-gray-800">{p.descrizione}</p>
                        {p.confezione && <p className="text-sm text-gray-500">Conf. {p.confezione}</p>}
                      </div>
                      <div className="text-right space-y-1 ml-4">
                        {p.prezzo_a && (
                          <div>
                            <span className="text-xs text-gray-400">Listino</span>
                            <p className="font-bold text-green-700">€ {p.prezzo_a.toFixed(2)}</p>
                          </div>
                        )}
                        {p.prezzo_b && <p className="text-sm text-gray-500">B: € {p.prezzo_b.toFixed(2)}</p>}
                        {p.prezzo_c && <p className="text-sm text-gray-500">C: € {p.prezzo_c.toFixed(2)}</p>}
                        {p.prezzo_d && <p className="text-sm text-gray-500">D: € {p.prezzo_d.toFixed(2)}</p>}
                        {p.iva && <p className="text-xs text-gray-400">IVA {p.iva}%</p>}
                      </div>
                    </div>
                    {p.data_aggiornamento && (
                      <p className="text-xs text-gray-300 mt-1">
                        Aggiornato: {new Date(p.data_aggiornamento).toLocaleDateString('it-IT')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {query.length >= 2 && !cercando && risultati.length === 0 && (
              <p className="text-gray-400 mt-4 text-center">Nessun prodotto trovato per "{query}"</p>
            )}
          </div>
        )}

        {/* TAB UPLOAD */}
        {tab === 'upload' && (
          <div className="bg-white rounded-xl shadow p-4 space-y-4">
            <div>
              <p className="text-gray-600 mb-3">
                Carica il file Excel Geogreen aggiornato. Il sistema leggerà automaticamente i fogli
                <strong> STAMPA SEME</strong> e <strong>STAMPA CONCIMI</strong> e aggiornerà i prezzi.
              </p>

              <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-400 transition-colors">
                <input type="file" accept=".xlsx,.xls" onChange={handleFile} className="hidden" />
                <div className="text-4xl mb-2">📁</div>
                <p className="text-gray-500">
                  {file ? file.name : 'Clicca per selezionare il file Excel'}
                </p>
              </label>
            </div>

            {messaggio && (
              <div className={`rounded-lg p-3 ${messaggio.tipo === 'ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {messaggio.testo}
              </div>
            )}

            {anteprima.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="font-medium text-gray-700">
                    Trovati <strong>{anteprima.length}</strong> prodotti —{' '}
                    {anteprima.filter(p => p.categoria === 'Sementi').length} sementi,{' '}
                    {anteprima.filter(p => p.categoria === 'Concimi').length} concimi
                  </p>
                  <button
                    onClick={handleImporta}
                    disabled={loading}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium disabled:opacity-50 hover:bg-green-700"
                  >
                    {loading ? 'Importazione...' : '✓ Importa tutti'}
                  </button>
                </div>

                {/* Anteprima prime 10 righe */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-3 py-2 text-gray-500">Codice</th>
                        <th className="text-left px-3 py-2 text-gray-500">Descrizione</th>
                        <th className="text-left px-3 py-2 text-gray-500">Cat.</th>
                        <th className="text-right px-3 py-2 text-gray-500">Prezzo A</th>
                        <th className="text-right px-3 py-2 text-gray-500">Prezzo D</th>
                      </tr>
                    </thead>
                    <tbody>
                      {anteprima.slice(0, 10).map((p, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-3 py-2 font-mono text-xs">{p.codice}</td>
                          <td className="px-3 py-2">{p.descrizione}</td>
                          <td className="px-3 py-2 text-gray-500">{p.categoria}</td>
                          <td className="px-3 py-2 text-right">€ {p.prezzo_a?.toFixed(2) ?? '-'}</td>
                          <td className="px-3 py-2 text-right text-gray-400">{p.prezzo_d ? `€ ${p.prezzo_d.toFixed(2)}` : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {anteprima.length > 10 && (
                    <p className="text-center text-gray-400 text-xs py-2">
                      ... e altri {anteprima.length - 10} prodotti
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
