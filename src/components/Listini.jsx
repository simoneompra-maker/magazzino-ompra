import { useState } from 'react'
import * as XLSX from 'xlsx'
import { supabase } from '../store'

// ========== CARICAMENTO PDF.JS DA CDN ==========
let pdfJSLoaded = false
const loadPdfJS = () => {
  return new Promise((resolve, reject) => {
    if (pdfJSLoaded && window.pdfjsLib) return resolve(window.pdfjsLib)
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      pdfJSLoaded = true
      resolve(window.pdfjsLib)
    }
    script.onerror = () => reject(new Error('Impossibile caricare la libreria PDF'))
    document.head.appendChild(script)
  })
}

// ========== PARSER PDF (ECHO, WEIBANG, ecc.) ==========
async function parsePDFListino(arrayBuffer) {
  const pdfjsLib = await loadPdfJS()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  const allLines = []

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p)
    const tc = await page.getTextContent()
    const items = tc.items.filter(i => i.str.trim())

    // Raggruppa per riga (stessa Y con tolleranza 4px)
    const rows = []
    let currentRow = []
    let currentY = null

    // Ordina: dall'alto al basso, poi da sinistra a destra
    const sorted = [...items].sort((a, b) => {
      const dy = b.transform[5] - a.transform[5]
      if (Math.abs(dy) > 4) return dy
      return a.transform[4] - b.transform[4]
    })

    for (const item of sorted) {
      const y = item.transform[5]
      if (currentY === null || Math.abs(y - currentY) > 4) {
        if (currentRow.length > 0) rows.push(currentRow)
        currentRow = [item]
        currentY = y
      } else {
        currentRow.push(item)
      }
    }
    if (currentRow.length > 0) rows.push(currentRow)

    // Unisci ogni riga in una stringa
    for (const row of rows) {
      row.sort((a, b) => a.transform[4] - b.transform[4])
      const line = row.map(i => i.str).join(' ').trim()
      if (line) allLines.push(line)
    }
  }

  // Rileva il brand dal contenuto
  const fullText = allLines.join('\n')
  let brand = ''
  if (/\bECHO\b/i.test(fullText)) brand = 'ECHO'
  if (/\bWEIBANG\b/i.test(fullText)) brand = 'WEIBANG'
  if (/\bHONDA\b/i.test(fullText)) brand = 'HONDA'
  if (/\bSTIHL\b/i.test(fullText)) brand = 'STIHL'
  if (/\bSEGWAY\b/i.test(fullText)) brand = 'SEGWAY'
  if (/\bWORX\b/i.test(fullText)) brand = 'WORX'

  const prodotti = []
  let categoria = ''

  // Pattern per codici noti
  const codicePatterns = /\b(ECM\S+|ECA\S+|OFF\d+\S*|WBM\S+|WBA\S+|WBR\S+)\b/

  // Righe da ignorare
  const skipPatterns = [
    /ARTICOLO.*CODICE/i,
    /PREZZO\s+LISTINO/i,
    /IVA\s+INCLUSA/i,
    /PREZZI\s+CONSIGLIATI/i,
    /LISTINO\s+WEB\s+20/i,
    /VALIDITA/i,
    /PERFECTION\s+IS/i,
  ]

  // ── Parser specifico HONDA (formato: DESCRIZIONE € prezzo) ──────────────
  if (brand === 'HONDA') {
    const parseP = (str) => parseFloat(str.replace(/\./g,'').replace(',','.'))
    const hondaSkip = [/^2026/i, /^descrizione/i, /^HONDA/i, /MT\/q/i, /^SPINTA$/i, /^ex\./i, /^VENDITA$/i]
    // Pattern prezzo: € 500,00 oppure 500,00 € oppure € 1.050,00
    const priceRegex = /€\s*(\d{1,3}(?:\.\d{3})*,\d{2})|(\d{1,3}(?:\.\d{3})*,\d{2})\s*€/
    // Pattern codice modello Honda: HRG, HRX, HHB, HHT, HHC, DP, CV + numeri
    const modelRegex = /\b((?:HRG|HRX|HRA|HHB|HHT|HHC|HHD|DP|CV)\s*\d[\w\s]*?)\s+(?:\d{2}\s*CM|€|\d+\s*Ah)/i

    for (const line of allLines) {
      const trimmed = line.trim()
      if (!trimmed) continue
      if (hondaSkip.some(p => p.test(trimmed))) continue

      // Cerca prezzo nella riga
      const pm = trimmed.match(priceRegex)
      if (!pm) {
        // Potrebbe essere una categoria (tutto maiuscolo, no prezzi)
        const upper = trimmed.toUpperCase()
        if (upper === trimmed && upper.length > 3 && /^[A-ZÀÈÉÌÒÙ\s\+\-\/&0-9]+$/.test(upper) && !['HONDA','BATTERIA HONDA'].includes(upper.trim())) {
          categoria = upper.trim()
        }
        continue
      }

      const prezzo = parseP(pm[1] || pm[2])
      if (!prezzo || prezzo <= 0) continue

      // Rimuovi il prezzo dalla riga per ottenere la descrizione
      const descrizione = trimmed.replace(priceRegex, '').replace(/€/g, '').trim()
      if (!descrizione || descrizione.length < 3) continue

      // Estrai codice modello dalla descrizione
      // Prima cerca codice compatto (lettere+numeri senza spazi): HHB36AXB, DP3620XA, CV3680XA
      const compactMatch = descrizione.match(/\b((?:HH[BTCG]|DP|CV|IZY)\d+\w*)\b/i)
      // Poi cerca codice con spazi tipo HRG 416 XB PE, HRX 476 XB
      const modelMatch = !compactMatch && descrizione.match(/\b((?:HRG|HRX|HRA)\s+\d+[\w\s]*)(?=\s+\d{2}\s*CM|\s+\+|\s*$)/i)
      let codice
      if (compactMatch) {
        codice = compactMatch[1].toUpperCase()
      } else if (modelMatch) {
        codice = modelMatch[1].replace(/\s+/g, '').toUpperCase()
      } else {
        // Fallback: prende le prime parole significative
        codice = descrizione.replace(/\s+/g, '_').toUpperCase().substring(0, 20)
      }

      prodotti.push({
        brand: 'HONDA',
        categoria,
        codice,
        descrizione,
        confezione: null,
        prezzo_a: prezzo,
        prezzo_b: null,
        prezzo_c: null,
        prezzo_d: null,
        iva: 22,
      })
    }
    return Object.values(prodotti.reduce((acc, p) => { acc[`${p.brand}__${p.codice}`] = p; return acc; }, {}))
  }
  // ── Fine parser HONDA ────────────────────────────────────────────────────

  for (const line of allLines) {
    // Salta righe header/intestazione
    if (skipPatterns.some(p => p.test(line))) continue

    // Trova prezzi nella riga (formato: 1.234,56 o 234,56 seguite opzionalmente da €)
    const prezzi = []
    const priceRegexLocal = /(\d{1,3}(?:\.\d{3})*,\d{2})\s*€?/g
    let m
    while ((m = priceRegexLocal.exec(line)) !== null) {
      prezzi.push(m[1])
    }

    // Rileva categorie: righe tutto maiuscolo senza prezzi e senza codice
    if (prezzi.length === 0) {
      const upper = line.trim().toUpperCase()
      if (upper === line.trim() && upper.length > 3 && /^[A-Z\s\+\-\/&0-9]+$/.test(upper)) {
        // Escludi brand headers e titoli generici
        if (!upper.includes('ECHO') && !upper.includes('WEIBANG') && !upper.includes('GARDEN')) {
          categoria = upper
        }
        // Gestisci "GAMMA A BATTERIA..." come categoria
        if (upper.startsWith('GAMMA A BATTERIA')) {
          categoria = upper
        }
      }
      continue
    }

    // Una riga prodotto deve avere almeno 2 prezzi e un codice riconosciuto
    if (prezzi.length < 2) continue

    const codiceMatch = line.match(codicePatterns)
    if (!codiceMatch) continue

    const codice = codiceMatch[1]

    // Estrai articolo (prima del codice) e descrizione (dopo codice, prima dei prezzi)
    const codiceIdx = line.indexOf(codice)
    const articolo = line.substring(0, codiceIdx).trim()

    // Trova dove inizia il primo prezzo
    const firstPriceStr = prezzi[0]
    const priceStartIdx = line.indexOf(firstPriceStr)
    let descrizione = line.substring(codiceIdx + codice.length, priceStartIdx).trim()

    // Se la descrizione e vuota, usa l'articolo
    if (!descrizione) descrizione = articolo

    // Parsa i prezzi
    const parsePrezzo = (str) => {
      return parseFloat(str.replace(/\./g, '').replace(',', '.'))
    }

    const prezzoListino = parsePrezzo(prezzi[0])
    const prezzoWeb = parsePrezzo(prezzi[1])

    if (prezzoListino > 0 && codice.length > 3) {
      // Se il brand non è stato rilevato dal testo, inferisci dal prefisso codice
      let prodBrand = brand
      if (!prodBrand) {
        if (/^ECM|^ECA|^OFF\d/.test(codice)) prodBrand = 'ECHO'
        else if (/^WBM|^WBA|^WBR/.test(codice)) prodBrand = 'WEIBANG'
        else prodBrand = 'SCONOSCIUTO'
      }

      prodotti.push({
        brand: prodBrand,
        categoria,
        codice,
        descrizione,
        confezione: null,
        prezzo_a: prezzoListino,
        prezzo_b: prezzoWeb,
        prezzo_c: null,
        prezzo_d: null,
        iva: 22,
      })
    }
  }

  // Deduplica per brand+codice (tieni l'ultimo trovato)
  const unique = Object.values(
    prodotti.reduce((acc, p) => { acc[`${p.brand}__${p.codice}`] = p; return acc; }, {})
  )
  return unique
}

// ========== PARSER EXCEL GEOGREEN (esistente) ==========
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

    let headerRow = -1
    for (let i = 0; i < Math.min(5, righe.length); i++) {
      const r = righe[i]
      if (r && r.some(c => typeof c === 'string' && (c.includes('Cod') || c.includes('Linea')))) {
        headerRow = i
        break
      }
    }

    for (let i = (headerRow >= 0 ? headerRow + 2 : 2); i < righe.length; i++) {
      const r = righe[i]
      if (!r) continue

      const codice = r[0]
      const descrizione = r[1]
      const prezzoA = r[3]

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

function parseHondaExcel(workbook) {
  const prodotti = []
  const parsePrezzo = (val) => {
    if (val == null) return 0
    const s = String(val).replace(/[€\s]/g, '').replace(/\./g, '').replace(',', '.')
    return parseFloat(s) || 0
  }

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null })
    let brand = 'HONDA'
    let categoria = ''

    for (const row of rows) {
      // Cerca brand nella riga
      const rowText = row.filter(Boolean).join(' ').toUpperCase()
      if (/\bHONDA\b/.test(rowText) && !row[4]) continue  // riga header brand
      if (/^descrizione/i.test(String(row[1] || ''))) continue  // riga intestazione colonne

      const descrizione = String(row[1] || '').trim()
      const dimensione = String(row[2] || '').trim()
      const prezzoRaw = row[4]

      // Riga categoria (testo senza prezzo, tutto maiuscolo)
      if (!prezzoRaw && descrizione && descrizione === descrizione.toUpperCase() && descrizione.length > 3) {
        categoria = descrizione
        continue
      }

      const prezzo = parsePrezzo(prezzoRaw)
      if (!prezzo || !descrizione || descrizione.length < 3) continue

      // Descrizione completa = descrizione + dimensione
      const descCompleta = dimensione ? `${descrizione} ${dimensione}`.trim() : descrizione

      // Estrai codice: prima cerca codice compatto (HHB36AXB, DP3620XA...)
      const compactMatch = descCompleta.match(/\b((?:HH[BTCGH]|DP|CV)\d+\w*)\b/i)
      const modelMatch = !compactMatch && descCompleta.match(/\b((?:HRG|HRX|HRA)\s+\d+[\w\s]*)(?=\s+\d{2}\s*CM|\s+\+|$)/i)
      let codice
      if (compactMatch) {
        codice = compactMatch[1].toUpperCase()
      } else if (modelMatch) {
        codice = modelMatch[1].trim().replace(/\s*(\d{2}\s*CM.*)$/i,'').replace(/\s+/g,'').toUpperCase()
      } else {
        codice = descCompleta.replace(/\s+/g,'_').toUpperCase().substring(0, 25)
      }

      prodotti.push({
        brand,
        categoria,
        codice,
        descrizione: descCompleta,
        confezione: null,
        prezzo_a: prezzo,
        prezzo_b: null,
        prezzo_c: null,
        prezzo_d: null,
        iva: 22,
      })
    }
  }

  return Object.values(prodotti.reduce((acc, p) => { acc[`${p.brand}__${p.codice}`] = p; return acc; }, {}))
}


// ========== COMPONENTE PRINCIPALE ==========
export default function Listini({ onNavigate }) {
  const [tab, setTab] = useState('cerca')
  const [file, setFile] = useState(null)
  const [anteprima, setAnteprima] = useState([])
  const [loading, setLoading] = useState(false)
  const [messaggio, setMessaggio] = useState(null)
  const [query, setQuery] = useState('')
  const [risultati, setRisultati] = useState([])
  const [cercando, setCercando] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [cronologia, setCronologia] = useState([])
  const [loadingCronologia, setLoadingCronologia] = useState(false)
  const [cronologia, setCronologia] = useState([])
  const [loadingCronologia, setLoadingCronologia] = useState(false)

  // Gestione file (Excel o PDF)
  const handleFile = async (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setMessaggio(null)
    setAnteprima([])
    setParsing(true)

    const isPDF = f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf'

    try {
      const buffer = await f.arrayBuffer()

      if (isPDF) {
        const prodotti = await parsePDFListino(buffer)
        setAnteprima(prodotti)
        if (prodotti.length === 0) {
          setMessaggio({ tipo: 'errore', testo: 'Nessun prodotto trovato nel PDF. Verifica che il formato sia corretto (colonne: Articolo, Codice, Descrizione, Prezzo Listino, Listino Web).' })
        } else {
          setMessaggio({ tipo: 'ok', testo: `Trovati ${prodotti.length} prodotti ${prodotti[0]?.brand || ''} dal PDF. Controlla l'anteprima e premi Importa.` })
        }
      } else {
        const wb = XLSX.read(buffer, { type: 'array' })
        // Rileva tipo listino Excel: Honda (cerca HONDA in qualsiasi cella) o Geogreen
        const isHonda = wb.SheetNames.some(s => {
          const sheet = wb.Sheets[s]
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null })
          return rows.some(row => row.some(cell => cell && /HONDA/i.test(String(cell))))
        }) || /honda/i.test(f.name)
        const prodotti = isHonda ? parseHondaExcel(wb) : parseGeogreen(wb)
        setAnteprima(prodotti)
        if (prodotti.length === 0) {
          const hint = isHonda ? 'Verifica che il file contenga le colonne descrizione e prezzo.' : 'Verifica che il file sia il listino Geogreen corretto (fogli STAMPA SEME / STAMPA CONCIMI).'
          setMessaggio({ tipo: 'errore', testo: `Nessun prodotto trovato. ${hint}` })
        }
      }
    } catch (err) {
      setMessaggio({ tipo: 'errore', testo: 'Errore nella lettura del file: ' + err.message })
    } finally {
      setParsing(false)
    }
  }

  // Importa i prodotti su Supabase
  const handleImporta = async () => {
    if (anteprima.length === 0) return
    setLoading(true)
    setMessaggio(null)

    try {
      const batchSize = 100
      let importati = 0

      for (let i = 0; i < anteprima.length; i += batchSize) {
        const batch = anteprima.slice(i, i + batchSize)
        // Deduplica per brand+codice (tieni l'ultimo)
        const unique = Object.values(
          batch.reduce((acc, p) => { acc[`${p.brand}__${p.codice}`] = p; return acc; }, {})
        )
        const { error } = await supabase
          .from('listini')
          .upsert(
            unique.map(p => ({ ...p, data_aggiornamento: new Date().toISOString() })),
            { onConflict: 'brand,codice' }
          )
        if (error) throw error
        importati += unique.length
      }

      // Salva log per brand
      const brandsImportati = [...new Set(anteprima.map(p => p.brand).filter(Boolean))]
      const operatore = (() => { try { return localStorage.getItem('ompra_ultimo_operatore') || 'N/D' } catch { return 'N/D' } })()
      for (const brand of brandsImportati) {
        const nProdotti = anteprima.filter(p => p.brand === brand).length
        await supabase.from('listini_log').insert({
          nome_file: file?.name || 'N/D',
          brand,
          n_prodotti: nProdotti,
          caricato_da: operatore,
        })
      }

      const brandsImportati = [...new Set(anteprima.map(p => p.brand).filter(Boolean))]
      const operatore = (() => { try { return localStorage.getItem('ompra_ultimo_operatore') || 'N/D' } catch { return 'N/D' } })()
      for (const brand of brandsImportati) {
        const nProdotti = anteprima.filter(p => p.brand === brand).length
        await supabase.from('listini_log').insert({
          nome_file: file?.name || 'N/D',
          brand,
          n_prodotti: nProdotti,
          caricato_da: operatore,
        })
      }
      setMessaggio({ tipo: 'ok', testo: `✓ Importati ${importati} prodotti con successo.` })
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
    const parole = valore.trim().toLowerCase().split(/\s+/).filter(p => p.length >= 1)
    if (parole.length === 0 || (parole.length === 1 && parole[0].length < 2)) {
      setRisultati([])
      return
    }
    setCercando(true)

    // Ogni parola deve matchare in almeno uno dei campi (AND tra parole)
    let query = supabase.from('listini').select('*')
    for (const parola of parole) {
      query = query.or(`codice.ilike.%${parola}%,descrizione.ilike.%${parola}%,brand.ilike.%${parola}%,categoria.ilike.%${parola}%`)
    }
    const { data } = await query.order('brand').limit(50)
    setRisultati(data || [])
    setCercando(false)
  }

  const caricaCronologia = async () => {
    setLoadingCronologia(true)
    const { data } = await supabase
      .from('listini_log')
      .select('*')
      .order('caricato_il', { ascending: false })
      .limit(50)
    setCronologia(data || [])
    setLoadingCronologia(false)
  }

  // Carica cronologia upload
  const caricaCronologia = async () => {
    setLoadingCronologia(true)
    const { data } = await supabase
      .from('listini_log')
      .select('*')
      .order('caricato_il', { ascending: false })
      .limit(50)
    setCronologia(data || [])
    setLoadingCronologia(false)
  }

  // Colore badge brand
  const brandColor = (brand) => {
    const colors = {
      'ECHO': 'bg-orange-100 text-orange-800',
      'WEIBANG': 'bg-red-100 text-red-800',
      'GEOGREEN': 'bg-green-100 text-green-800',
      'STIHL': 'bg-orange-200 text-orange-900',
      'HONDA': 'bg-red-200 text-red-900',
      'SEGWAY': 'bg-blue-100 text-blue-800',
      'WORX': 'bg-yellow-100 text-yellow-800',
    }
    return colors[brand] || 'bg-gray-100 text-gray-800'
  }

  // Raggruppa anteprima per categoria
  const categorieAnteprima = anteprima.reduce((acc, p) => {
    const cat = p.categoria || 'Senza categoria'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(p)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">

        {/* Header con bottone indietro */}
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => onNavigate('home')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">📋 Listini Prezzi</h1>
        </div>

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
          <button
            onClick={() => { setTab('cronologia'); caricaCronologia(); }}
            className={`px-4 py-2 rounded-lg font-medium ${tab === 'cronologia' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border'}`}
          >
            🕓 Cronologia
          </button>
        </div>

        {/* TAB CERCA */}
        {tab === 'cerca' && (
          <div className="bg-white rounded-xl shadow p-4">
            <input
              type="text"
              placeholder="Cerca per codice o descrizione (es. CS-2511, Hurricane, WB537...)"
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
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${brandColor(p.brand)}`}>
                            {p.brand}
                          </span>
                          <span className="font-mono text-sm text-gray-500">{p.codice}</span>
                        </div>
                        <p className="font-medium text-gray-800">{p.descrizione}</p>
                        {p.categoria && <p className="text-xs text-gray-400 mt-0.5">{p.categoria}</p>}
                        {p.confezione && <p className="text-sm text-gray-500">Conf. {p.confezione}</p>}
                      </div>
                      <div className="text-right space-y-1 ml-4 flex-shrink-0">
                        {/* Brand con Listino/Web (ECHO, WEIBANG): mostra Web come prezzo principale */}
                        {['ECHO', 'WEIBANG'].includes(p.brand) && p.prezzo_b ? (
                          <>
                            <div>
                              <span className="text-xs text-gray-400">Vendita</span>
                              <p className="font-bold text-lg text-green-700">€ {p.prezzo_b.toFixed(2)}</p>
                            </div>
                            {p.prezzo_a && (
                              <p className="text-xs text-gray-400 line-through">Listino € {p.prezzo_a.toFixed(2)}</p>
                            )}
                          </>
                        ) : (
                          <>
                            {p.prezzo_a && (
                              <div>
                                <span className="text-xs text-gray-400">Prezzo A</span>
                                <p className="font-bold text-lg text-green-700">€ {p.prezzo_a.toFixed(2)}</p>
                              </div>
                            )}
                            {p.prezzo_b && <p className="text-sm text-gray-500">B: € {p.prezzo_b.toFixed(2)}</p>}
                          </>
                        )}
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

        {/* TAB CRONOLOGIA */}
        {tab === 'cronologia' && (
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-700">Storico caricamenti listini</h2>
              <button
                onClick={caricaCronologia}
                disabled={loadingCronologia}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                {loadingCronologia ? '⏳ Caricamento...' : '🔄 Aggiorna'}
              </button>
            </div>

            {loadingCronologia && <p className="text-gray-400 text-sm">Caricamento...</p>}

            {!loadingCronologia && cronologia.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-6">Nessun caricamento registrato.<br/>I prossimi upload appariranno qui.</p>
            )}

            {cronologia.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <th className="px-3 py-2 text-left">File</th>
                      <th className="px-3 py-2 text-left">Brand</th>
                      <th className="px-3 py-2 text-center">Prodotti</th>
                      <th className="px-3 py-2 text-left">Caricato da</th>
                      <th className="px-3 py-2 text-left">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cronologia.map((log, i) => (
                      <tr key={log.id} className={`border-t ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-3 py-2 text-gray-700 font-mono text-xs max-w-[200px] truncate" title={log.nome_file}>
                          📄 {log.nome_file}
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${brandColor(log.brand)}`}>
                            {log.brand}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center font-semibold text-gray-700">{log.n_prodotti}</td>
                        <td className="px-3 py-2 text-gray-500 text-xs">{log.caricato_da}</td>
                        <td className="px-3 py-2 text-gray-400 text-xs">
                          {new Date(log.caricato_il).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB CRONOLOGIA */}
        {tab === 'cronologia' && (
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-700">Storico caricamenti listini</h2>
              <button onClick={caricaCronologia} disabled={loadingCronologia} className="text-xs text-gray-500 hover:text-gray-700">
                {loadingCronologia ? '⏳' : '🔄 Aggiorna'}
              </button>
            </div>
            {loadingCronologia && <p className="text-gray-400 text-sm">Caricamento...</p>}
            {!loadingCronologia && cronologia.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-6">Nessun caricamento registrato.<br/>I prossimi upload appariranno qui.</p>
            )}
            {cronologia.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <th className="px-3 py-2 text-left">File</th>
                      <th className="px-3 py-2 text-left">Brand</th>
                      <th className="px-3 py-2 text-center">Prodotti</th>
                      <th className="px-3 py-2 text-left">Caricato da</th>
                      <th className="px-3 py-2 text-left">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cronologia.map((log, i) => (
                      <tr key={log.id} className={`border-t ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-3 py-2 text-gray-700 font-mono text-xs max-w-[200px] truncate" title={log.nome_file}>📄 {log.nome_file}</td>
                        <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${brandColor(log.brand)}`}>{log.brand}</span></td>
                        <td className="px-3 py-2 text-center font-semibold text-gray-700">{log.n_prodotti}</td>
                        <td className="px-3 py-2 text-gray-500 text-xs">{log.caricato_da}</td>
                        <td className="px-3 py-2 text-gray-400 text-xs">{new Date(log.caricato_il).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB UPLOAD */}
        {tab === 'upload' && (
          <div className="bg-white rounded-xl shadow p-4 space-y-4">
            <div>
              <p className="text-gray-600 mb-3">
                Carica un file listino prezzi. Formati supportati:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-sm">
                <div className="bg-orange-50 p-2 rounded-lg">
                  <span className="font-bold text-orange-800">📄 PDF</span>
                  <p className="text-orange-700 text-xs">ECHO, WEIBANG e altri con colonne Codice/Descrizione/Prezzi</p>
                </div>
                <div className="bg-green-50 p-2 rounded-lg">
                  <span className="font-bold text-green-800">📊 Excel</span>
                  <p className="text-green-700 text-xs">Geogreen (fogli STAMPA SEME e STAMPA CONCIMI)</p>
                </div>
              </div>

              <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-400 transition-colors">
                <input type="file" accept=".xlsx,.xls,.pdf" onChange={handleFile} className="hidden" />
                <div className="text-4xl mb-2">📁</div>
                <p className="text-gray-500">
                  {parsing ? '⏳ Lettura file in corso...' : file ? file.name : 'Clicca per selezionare il file (PDF o Excel)'}
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
                <div className="flex justify-between items-center mb-3 gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-700">
                      <strong>{anteprima.length}</strong> prodotti
                      {anteprima[0]?.brand && (
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${brandColor(anteprima[0].brand)}`}>
                          {anteprima[0].brand}
                        </span>
                      )}
                    </p>
                    {Object.keys(categorieAnteprima).length > 1 && (
                      <p className="text-xs text-gray-500 truncate">
                        {Object.entries(categorieAnteprima).map(([cat, items]) => 
                          `${cat}: ${items.length}`
                        ).join(' · ')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleImporta}
                    disabled={loading}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium disabled:opacity-50 hover:bg-green-700 flex-shrink-0"
                  >
                    {loading ? 'Importazione...' : '✓ Importa tutti'}
                  </button>
                </div>

                {/* Anteprima prime 15 righe */}
                <div className="border rounded-lg overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-3 py-2 text-gray-500">Codice</th>
                        <th className="text-left px-3 py-2 text-gray-500">Descrizione</th>
                        <th className="text-left px-3 py-2 text-gray-500">Cat.</th>
                        <th className="text-right px-3 py-2 text-gray-400">Listino</th>
                        <th className="text-right px-3 py-2 text-green-700 font-bold">Vendita</th>
                      </tr>
                    </thead>
                    <tbody>
                      {anteprima.slice(0, 15).map((p, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">{p.codice}</td>
                          <td className="px-3 py-2 text-xs">{p.descrizione}</td>
                          <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">{p.categoria}</td>
                          <td className="px-3 py-2 text-right text-gray-400 text-xs whitespace-nowrap">€ {p.prezzo_a?.toFixed(2) ?? '-'}</td>
                          <td className="px-3 py-2 text-right font-bold text-green-700 text-xs whitespace-nowrap">
                            {p.prezzo_b ? `€ ${p.prezzo_b.toFixed(2)}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {anteprima.length > 15 && (
                    <p className="text-center text-gray-400 text-xs py-2">
                      ... e altri {anteprima.length - 15} prodotti
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
