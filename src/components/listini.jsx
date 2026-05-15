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

    const rows = []
    let currentRow = []
    let currentY = null

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

    for (const row of rows) {
      row.sort((a, b) => a.transform[4] - b.transform[4])
      const line = row.map(i => i.str).join(' ').trim()
      if (line) allLines.push(line)
    }
  }

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

  const codicePatterns = /\b(ECM\S+|ECA\S+|OFF\d+\S*|WBM\S+|WBA\S+|WBR\S+)\b/

  const skipPatterns = [
    /ARTICOLO.*CODICE/i,
    /PREZZO\s+LISTINO/i,
    /IVA\s+INCLUSA/i,
    /PREZZI\s+CONSIGLIATI/i,
    /LISTINO\s+WEB\s+20/i,
    /VALIDITA/i,
    /PERFECTION\s+IS/i,
  ]

  if (brand === 'HONDA') {
    const parseP = (str) => parseFloat(str.replace(/\./g,'').replace(',','.'))
    const hondaSkip = [/^2026/i, /^descrizione/i, /^HONDA/i, /MT\/q/i, /^SPINTA$/i, /^ex\./i, /^VENDITA$/i]
    const priceRegex = /€\s*(\d{1,3}(?:\.\d{3})*,\d{2})|(\d{1,3}(?:\.\d{3})*,\d{2})\s*€/
    const modelRegex = /\b((?:HRG|HRX|HRA|HHB|HHT|HHC|HHD|DP|CV)\s*\d[\w\s]*?)\s+(?:\d{2}\s*CM|€|\d+\s*Ah)/i

    for (const line of allLines) {
      const trimmed = line.trim()
      if (!trimmed) continue
      if (hondaSkip.some(p => p.test(trimmed))) continue

      const pm = trimmed.match(priceRegex)
      if (!pm) {
        if (/^[A-Z][A-Z\s]{3,}$/.test(trimmed)) categoria = trimmed
        continue
      }

      const prezzo = parseP(pm[1] || pm[2])
      if (!prezzo || prezzo < 10) continue

      const beforePrice = trimmed.substring(0, pm.index).trim()
      const mm = beforePrice.match(modelRegex)
      const modello = mm ? mm[1].trim() : beforePrice.replace(/\s+\d+\s*$/, '').trim()
      if (!modello || modello.length < 3) continue

      prodotti.push({
        brand: 'HONDA',
        codice: modello.replace(/\s+/g, '').toUpperCase(),
        descrizione: beforePrice,
        categoria,
        prezzo_a: prezzo,
        prezzo_b: null,
        prezzo_c: null,
        prezzo_d: null,
        confezione: null,
        iva: null,
      })
    }
    const versione = (fullText.match(/2026\/\d+/) || [])[0] || ''
    return { prodotti, versione }
  }

  let i = 0
  while (i < allLines.length) {
    const line = allLines[i]
    if (skipPatterns.some(p => p.test(line))) { i++; continue }

    if (/^[A-Z][A-Z\s]{4,}$/.test(line) && !codicePatterns.test(line)) {
      categoria = line
      i++
      continue
    }

    const codiceMatch = line.match(codicePatterns)
    if (codiceMatch) {
      const codice = codiceMatch[1]
      let after = line.substring(codiceMatch.index + codice.length).trim()
      if (!after && i + 1 < allLines.length) {
        after = allLines[i + 1].trim()
        i++
      }

      const priceRegex = /(\d{1,3}(?:[.,]\d{3})*[.,]\d{2})/g
      const nums = [...after.matchAll(priceRegex)].map(m => parseFloat(m[1].replace(/\./g,'').replace(',','.')))
      const validPrices = nums.filter(n => n >= 0.1 && n < 99999)

      let descrizione = after.replace(priceRegex, '').replace(/€/g, '').replace(/\s+/g, ' ').trim()

      let confezione = null
      const confMatch = descrizione.match(/\b(\d+\s*(?:kg|gr|lt|ml|L)\b[^,]*)/i)
      if (confMatch) confezione = confMatch[1].trim()

      const prezzo_a = validPrices[0] || null
      const prezzo_b = validPrices[1] || null
      const prezzo_c = validPrices[2] || null
      const prezzo_d = validPrices[3] || null

      if (descrizione.length >= 3 && prezzo_a) {
        prodotti.push({
          brand,
          codice,
          descrizione,
          categoria,
          prezzo_a,
          prezzo_b,
          prezzo_c,
          prezzo_d,
          confezione,
          iva: null,
        })
      }
    }
    i++
  }

  return prodotti
}

// ========== PARSER GEOGREEN EXCEL ==========
function parseGeogreen(workbook) {
  const prodotti = []
  const sheets = ['STAMPA SEME', 'STAMPA CONCIMI'].filter(s => workbook.Sheets[s])

  for (const sheetName of sheets) {
    const sheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null })

    let categoria = ''
    let headerFound = false
    const headerMap = { codice: -1, descrizione: -1, confezione: -1, a: -1, b: -1, c: -1, d: -1 }

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r]
      if (!row || row.length === 0) continue

      const firstCell = String(row[0] || '').trim()
      if (firstCell && row.slice(1).every(c => c === null || c === '')) {
        categoria = firstCell
        continue
      }

      if (!headerFound) {
        const lowerCells = row.map(c => String(c || '').toLowerCase().trim())
        const codiceIdx = lowerCells.findIndex(c => c.includes('codice'))
        const descIdx = lowerCells.findIndex(c => c.includes('descrizione') || c.includes('articolo') || c === 'nome')
        if (codiceIdx >= 0 && descIdx >= 0) {
          headerMap.codice = codiceIdx
          headerMap.descrizione = descIdx
          headerMap.confezione = lowerCells.findIndex(c => c.includes('confezione') || c.includes('conf'))
          const aIdx = lowerCells.findIndex(c => c === 'a' || c.endsWith(' a'))
          const bIdx = lowerCells.findIndex(c => c === 'b' || c.endsWith(' b'))
          const cIdx = lowerCells.findIndex(c => c === 'c' || c.endsWith(' c'))
          const dIdx = lowerCells.findIndex(c => c === 'd' || c.endsWith(' d'))
          headerMap.a = aIdx
          headerMap.b = bIdx
          headerMap.c = cIdx
          headerMap.d = dIdx
          headerFound = true
        }
        continue
      }

      const codice = row[headerMap.codice]
      const desc = row[headerMap.descrizione]
      if (!codice || !desc) continue

      const num = (v) => {
        const n = parseFloat(v)
        return isNaN(n) ? null : n
      }

      prodotti.push({
        brand: 'GEOGREEN',
        codice: String(codice).trim(),
        descrizione: String(desc).trim(),
        categoria,
        confezione: headerMap.confezione >= 0 ? String(row[headerMap.confezione] || '').trim() || null : null,
        prezzo_a: headerMap.a >= 0 ? num(row[headerMap.a]) : null,
        prezzo_b: headerMap.b >= 0 ? num(row[headerMap.b]) : null,
        prezzo_c: headerMap.c >= 0 ? num(row[headerMap.c]) : null,
        prezzo_d: headerMap.d >= 0 ? num(row[headerMap.d]) : null,
        iva: null,
      })
    }
  }

  return prodotti
}

// ========== PARSER HONDA EXCEL ==========
function parseHondaExcel(workbook) {
  const prodotti = []
  let versione = ''

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null })

    let categoria = sheetName
    let headerFound = false
    const headerMap = { codice: -1, descrizione: -1, prezzo: -1 }

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r]
      if (!row || row.length === 0) continue

      const joined = row.map(c => String(c || '')).join(' ')
      const verMatch = joined.match(/2026\/\d+/)
      if (verMatch) versione = verMatch[0]

      if (!headerFound) {
        const lowerCells = row.map(c => String(c || '').toLowerCase().trim())
        const codiceIdx = lowerCells.findIndex(c => c.includes('codice') || c.includes('cod.'))
        const descIdx = lowerCells.findIndex(c => c.includes('descrizione') || c.includes('modello') || c.includes('articolo'))
        const prezzoIdx = lowerCells.findIndex(c => c.includes('prezzo') || c.includes('listino'))
        if (descIdx >= 0 && prezzoIdx >= 0) {
          headerMap.codice = codiceIdx
          headerMap.descrizione = descIdx
          headerMap.prezzo = prezzoIdx
          headerFound = true
        }
        continue
      }

      const desc = row[headerMap.descrizione]
      const prezzo = parseFloat(row[headerMap.prezzo])
      if (!desc || isNaN(prezzo) || prezzo < 1) continue

      const codice = headerMap.codice >= 0 && row[headerMap.codice]
        ? String(row[headerMap.codice]).trim()
        : String(desc).replace(/\s+/g, '').toUpperCase().substring(0, 30)

      prodotti.push({
        brand: 'HONDA',
        codice,
        descrizione: String(desc).trim(),
        categoria,
        prezzo_a: prezzo,
        prezzo_b: null,
        prezzo_c: null,
        prezzo_d: null,
        confezione: null,
        iva: null,
      })
    }
  }

  return { prodotti, versione }
}

// ========== GEMINI VISION — ANALISI VOLANTINI PROMO ==========
const GEMINI_MODEL = 'gemini-3-flash-preview'

function getGeminiApiKey() {
  const k = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) || ''
  return k.trim()
}

const PROMO_PROMPT = `Analizza questo volantino promozionale e estrai SOLO i prodotti principali (macchine intere come motoseghe, decespugliatori, tosaerba, trattorini, biotrituratori, idropulitrici, batterie, motori kombi, set kit-energia, ecc.). NON estrarre accessori secondari (oli, detergenti, guanti, occhiali, fili, catene, spranghe singole) a meno che non siano riportati come prodotto principale autonomo con il proprio prezzo evidenziato.

Per ogni prodotto, restituisci un oggetto JSON con questi campi:
- "modello" (string, OBBLIGATORIO): nome modello compatto come scritto nel volantino. Esempi: "MS 194 T", "DSRM-2400L", "FS 120 R", "LR2 ES76", "KIT ENERGIA 1"
- "codice_articolo" (string opzionale, default null): codice articolo se visibile (es. "25C-262E603")
- "prezzo_catalogo" (number opzionale, default null): prezzo barrato o "catalogo"/"listino" in euro. Se non presente, lascia null
- "prezzo_promo" (number OBBLIGATORIO): prezzo evidenziato come offerta/promo in euro
- "note_promo" (string opzionale, default ""): testo libero per omaggi ("IN OMAGGIO: 1x Catena"), bundle ("+ SG11 + Guanti"), coupon ("Coupon KIT primavera"), finanziamenti ("Tasso zero 12 rate"), condizioni speciali ("Disponibile da: Aprile 2026"). Stringa vuota se nulla del genere è presente.

REGOLE FLESSIBILI:
- Se prezzo_catalogo manca, includi comunque il prodotto con catalogo null
- Se sei in dubbio se è un prodotto principale, INCLUDILO (può essere scartato manualmente in review)
- Estrai TUTTI i prodotti del volantino, anche se sono molti (decine)

OUTPUT: solo un array JSON puro. Niente markdown, niente backtick, niente testo prima o dopo. Solo l'array.

Esempio output:
[{"modello":"MS 194 T","codice_articolo":null,"prezzo_catalogo":479,"prezzo_promo":339,"note_promo":"IN OMAGGIO: 1x Catena. Tasso zero 12 rate"},{"modello":"MS 162","codice_articolo":null,"prezzo_catalogo":199,"prezzo_promo":169,"note_promo":""}]`

async function analizzaPromoPDFconGemini(pdfBase64) {
  const apiKey = getGeminiApiKey()
  if (!apiKey) {
    throw new Error('Chiave Gemini non configurata. Imposta VITE_GEMINI_API_KEY su Vercel (Environment Variables) e rifai il deploy.')
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { inline_data: { mime_type: 'application/pdf', data: pdfBase64 } },
          { text: PROMO_PROMPT }
        ]
      }],
    }),
  })
  if (!res.ok) {
    const errBody = await res.text()
    throw new Error(`Gemini API error ${res.status}: ${errBody.slice(0, 300)}`)
  }
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]'
  const clean = text.replace(/```json|```/g, '').trim()
  let parsed
  try {
    parsed = JSON.parse(clean)
  } catch {
    const match = clean.match(/\[[\s\S]*\]/)
    if (match) parsed = JSON.parse(match[0])
    else throw new Error('Risposta Gemini non parsabile come JSON: ' + clean.slice(0, 200))
  }
  if (!Array.isArray(parsed)) throw new Error('Risposta Gemini non è un array')
  return parsed
}

// Cerca in listini il record che potrebbe corrispondere a un prodotto estratto da Gemini
async function trovaMatchListino(brand, modello, codice) {
  if (codice) {
    const { data } = await supabase
      .from('listini')
      .select('id, brand, codice, descrizione, prezzo_a, prezzo_promo')
      .ilike('brand', `%${brand}%`)
      .ilike('codice', `%${codice}%`)
      .limit(1)
    if (data?.[0]) return data[0]
  }
  const cleanModel = (modello || '').trim()
  if (!cleanModel) return null
  const { data } = await supabase
    .from('listini')
    .select('id, brand, codice, descrizione, prezzo_a, prezzo_promo')
    .ilike('brand', `%${brand}%`)
    .ilike('descrizione', `%${cleanModel}%`)
    .limit(1)
  return data?.[0] || null
}

// ========== UTIL: è oggi nel range promo? ==========
const isPromoAttivaOra = (p) => {
  if (!p?.prezzo_promo) return false
  const today = new Date().toISOString().slice(0, 10)
  if (p.promo_dal && today < p.promo_dal) return false
  if (p.promo_al && today > p.promo_al) return false
  return true
}

const formatDateIT = (iso) => {
  if (!iso) return ''
  try {
    const [y, m, d] = iso.slice(0, 10).split('-')
    return `${d}/${m}/${y}`
  } catch { return iso }
}

// ========== COMPONENTE PRINCIPALE ==========
export default function Listini({ onNavigate }) {
  // Detect admin (consente di accedere a tab Upload / Promo PDF / Cronologia)
  // Match case-insensitive, coerente con Dashboard.jsx
  const isAdmin = (() => {
    try { return (localStorage.getItem('ompra_ultimo_operatore') || '').toLowerCase() === 'admin' } catch { return false }
  })()

  const [tab, setTab] = useState('cerca')
  const [file, setFile] = useState(null)
  const [anteprima, setAnteprima] = useState([])
  const [loading, setLoading] = useState(false)
  const [messaggio, setMessaggio] = useState(null)
  const [query, setQuery] = useState('')
  const [risultati, setRisultati] = useState([])
  const [cercando, setCercando] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [versioneListino, setVersioneListino] = useState('')
  const [cronologia, setCronologia] = useState([])
  const [loadingCronologia, setLoadingCronologia] = useState(false)

  // ---- STATE per la nuova tab "Promo PDF" ----
  const [promoFile, setPromoFile] = useState(null)
  const [promoBrand, setPromoBrand] = useState('')
  const [promoDal, setPromoDal] = useState('')
  const [promoAl, setPromoAl] = useState('')
  const [promoRows, setPromoRows] = useState([])
  const [promoAnalizzando, setPromoAnalizzando] = useState(false)
  const [promoImportando, setPromoImportando] = useState(false)
  const [promoMessaggio, setPromoMessaggio] = useState(null)

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
        const result = await parsePDFListino(buffer)
        const prodotti = Array.isArray(result) ? result : (result.prodotti || [])
        const versione = Array.isArray(result) ? '' : (result.versione || '')
        setVersioneListino(versione)
        setAnteprima(prodotti)
        if (prodotti.length === 0) {
          setMessaggio({ tipo: 'errore', testo: 'Nessun prodotto trovato nel PDF. Verifica che il formato sia corretto (colonne: Articolo, Codice, Descrizione, Prezzo Listino, Listino Web).' })
        } else {
          setMessaggio({ tipo: 'ok', testo: `Trovati ${prodotti.length} prodotti ${prodotti[0]?.brand || ''} dal PDF. Controlla l'anteprima e premi Importa.` })
        }
      } else {
        const wb = XLSX.read(buffer, { type: 'array' })
        const isHonda = wb.SheetNames.some(s => {
          const sheet = wb.Sheets[s]
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null })
          return rows.some(row => row.some(cell => cell && /HONDA/i.test(String(cell))))
        }) || /honda/i.test(f.name || '')
        const hondaResult = isHonda ? parseHondaExcel(wb) : null
        const prodotti = isHonda ? hondaResult.prodotti : parseGeogreen(wb)
        setVersioneListino(isHonda ? (hondaResult.versione || '') : '')
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

  const handleImporta = async () => {
    if (anteprima.length === 0) return
    setLoading(true)
    setMessaggio(null)

    try {
      const batchSize = 100
      let importati = 0

      for (let i = 0; i < anteprima.length; i += batchSize) {
        const batch = anteprima.slice(i, i + batchSize)
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

      const brandsImportati = [...new Set(anteprima.map(p => p.brand).filter(Boolean))]
      const operatore = (() => { try { return localStorage.getItem('ompra_ultimo_operatore') || 'N/D' } catch { return 'N/D' } })()
      for (const brand of brandsImportati) {
        const nProdotti = anteprima.filter(p => p.brand === brand).length
        await supabase.from('listini_log').insert({
          nome_file: file?.name || 'N/D',
          brand,
          n_prodotti: nProdotti,
          caricato_da: operatore,
          versione: versioneListino || null,
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

  const handleCerca = async (valore) => {
    setQuery(valore)
    const parole = valore.trim().toLowerCase().split(/\s+/).filter(p => p.length >= 1)
    if (parole.length === 0 || (parole.length === 1 && parole[0].length < 2)) {
      setRisultati([])
      return
    }
    setCercando(true)
    let queryBuilder = supabase.from('listini').select('*')
    for (const parola of parole) {
      queryBuilder = queryBuilder.or(`codice.ilike.%${parola}%,descrizione.ilike.%${parola}%,brand.ilike.%${parola}%,categoria.ilike.%${parola}%`)
    }
    const { data } = await queryBuilder.order('brand').limit(50)
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

  // ============== HANDLERS NUOVA TAB PROMO PDF ==============
  const handlePromoFile = async (e) => {
    const f = e.target.files[0]
    if (!f) return
    setPromoFile(f)
    setPromoMessaggio(null)
    setPromoRows([])
  }

  const analizzaPromoOra = async () => {
    if (!promoFile) { setPromoMessaggio({ tipo: 'errore', testo: 'Seleziona un PDF.' }); return }
    if (!promoBrand.trim()) { setPromoMessaggio({ tipo: 'errore', testo: 'Indica il brand.' }); return }
    if (!promoDal || !promoAl) { setPromoMessaggio({ tipo: 'errore', testo: 'Indica le date di inizio e fine promo.' }); return }
    if (promoDal > promoAl) { setPromoMessaggio({ tipo: 'errore', testo: 'La data di inizio deve essere prima della data di fine.' }); return }

    setPromoAnalizzando(true)
    setPromoMessaggio(null)
    setPromoRows([])

    try {
      // 1. Leggi PDF in base64
      const buffer = await promoFile.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      let binary = ''
      const chunkSize = 0x8000
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize))
      }
      const base64 = btoa(binary)

      // 2. Chiamata Gemini
      const estratti = await analizzaPromoPDFconGemini(base64)

      if (!estratti || estratti.length === 0) {
        setPromoMessaggio({ tipo: 'errore', testo: 'Gemini non ha trovato prodotti nel volantino. Controlla che il PDF sia leggibile.' })
        setPromoAnalizzando(false)
        return
      }

      // 3. Per ogni prodotto cerca match in listini
      const rowsConMatch = []
      for (let idx = 0; idx < estratti.length; idx++) {
        const r = estratti[idx]
        const match = await trovaMatchListino(promoBrand, r.modello, r.codice_articolo)
        rowsConMatch.push({
          _idx: idx,
          _includi: true,
          _match: match,
          modello: r.modello || '',
          codice_articolo: r.codice_articolo || '',
          prezzo_catalogo: r.prezzo_catalogo != null ? Number(r.prezzo_catalogo) : null,
          prezzo_promo: r.prezzo_promo != null ? Number(r.prezzo_promo) : null,
          note_promo: r.note_promo || '',
        })
      }

      setPromoRows(rowsConMatch)
      const nuovi = rowsConMatch.filter(r => !r._match).length
      setPromoMessaggio({ tipo: 'ok', testo: `Trovati ${rowsConMatch.length} prodotti (${rowsConMatch.length - nuovi} esistenti, ${nuovi} nuovi). Controlla e correggi prima di importare.` })
    } catch (err) {
      setPromoMessaggio({ tipo: 'errore', testo: 'Errore analisi: ' + err.message })
    } finally {
      setPromoAnalizzando(false)
    }
  }

  const togglePromoRow = (idx) => {
    setPromoRows(rows => rows.map(r => r._idx === idx ? { ...r, _includi: !r._includi } : r))
  }

  const editPromoCell = (idx, field, value) => {
    setPromoRows(rows => rows.map(r => {
      if (r._idx !== idx) return r
      if (field === 'prezzo_catalogo' || field === 'prezzo_promo') {
        const n = value === '' ? null : Number(value)
        return { ...r, [field]: isNaN(n) ? null : n }
      }
      return { ...r, [field]: value }
    }))
  }

  const importaPromo = async () => {
    const daImportare = promoRows.filter(r => r._includi && r.modello && r.prezzo_promo != null)
    if (daImportare.length === 0) {
      setPromoMessaggio({ tipo: 'errore', testo: 'Nessuna riga valida da importare. Servono almeno modello e prezzo promo.' })
      return
    }

    setPromoImportando(true)
    setPromoMessaggio(null)

    try {
      let aggiornati = 0
      let inseriti = 0
      const errori = []

      for (const r of daImportare) {
        const payload = {
          prezzo_promo: r.prezzo_promo,
          promo_dal: promoDal,
          promo_al: promoAl,
          note_promo: r.note_promo?.trim() || null,
          data_aggiornamento: new Date().toISOString(),
        }

        if (r._match?.id) {
          const { error } = await supabase
            .from('listini')
            .update(payload)
            .eq('id', r._match.id)
          if (error) errori.push(`${r.modello}: ${error.message}`)
          else aggiornati++
        } else {
          const { error } = await supabase
            .from('listini')
            .insert({
              brand: promoBrand.toUpperCase().trim(),
              codice: r.codice_articolo?.trim() || `PROMO_${Date.now()}_${r._idx}`,
              descrizione: r.modello.trim(),
              prezzo_a: r.prezzo_catalogo,
              ...payload,
            })
          if (error) errori.push(`${r.modello}: ${error.message}`)
          else inseriti++
        }
      }

      // Log nello storico
      const operatore = (() => { try { return localStorage.getItem('ompra_ultimo_operatore') || 'N/D' } catch { return 'N/D' } })()
      await supabase.from('listini_log').insert({
        nome_file: `PROMO ${promoFile?.name || 'PDF'}`,
        brand: promoBrand.toUpperCase().trim(),
        n_prodotti: aggiornati + inseriti,
        caricato_da: operatore,
        versione: `Promo ${promoDal}_${promoAl}`,
      })

      if (errori.length === 0) {
        setPromoMessaggio({ tipo: 'ok', testo: `✓ Importate ${aggiornati + inseriti} promo (${aggiornati} aggiornate, ${inseriti} nuove).` })
        setPromoRows([])
        setPromoFile(null)
      } else {
        setPromoMessaggio({ tipo: 'errore', testo: `Completato con ${errori.length} errori. ${aggiornati + inseriti} ok. Primi errori: ${errori.slice(0, 3).join(' · ')}` })
      }
    } catch (err) {
      setPromoMessaggio({ tipo: 'errore', testo: 'Errore durante il salvataggio: ' + err.message })
    } finally {
      setPromoImportando(false)
    }
  }

  // ============== STILI / UTILS ==============
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

  const categorieAnteprima = anteprima.reduce((acc, p) => {
    const cat = p.categoria || 'Senza categoria'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(p)
    return acc
  }, {})

  // Tab non-cerca solo per admin; se non admin forziamo cerca
  const tabSafe = (tab === 'cerca' || isAdmin) ? tab : 'cerca'

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => onNavigate('home')} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">📋 Listini Prezzi</h1>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button onClick={() => setTab('cerca')} className={`px-4 py-2 rounded-lg font-medium ${tabSafe === 'cerca' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border'}`}>
            🔍 Cerca Prodotto
          </button>
          {isAdmin && (
            <>
              <button onClick={() => setTab('upload')} className={`px-4 py-2 rounded-lg font-medium ${tabSafe === 'upload' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border'}`}>
                📤 Aggiorna Listino
              </button>
              <button onClick={() => setTab('promo')} className={`px-4 py-2 rounded-lg font-medium ${tabSafe === 'promo' ? 'bg-red-600 text-white' : 'bg-white text-gray-600 border'}`}>
                🔴 Promo PDF
              </button>
              <button onClick={() => { setTab('cronologia'); caricaCronologia(); }} className={`px-4 py-2 rounded-lg font-medium ${tabSafe === 'cronologia' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border'}`}>
                🕓 Cronologia
              </button>
            </>
          )}
        </div>

        {/* TAB CERCA */}
        {tabSafe === 'cerca' && (
          <div className="bg-white rounded-xl shadow p-4">
            <input
              type="text"
              placeholder="Cerca per codice o descrizione (es. CS-2511, MS 194, Hurricane, WB537...)"
              value={query}
              onChange={e => handleCerca(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            />
            {cercando && <p className="text-gray-400 mt-3 text-sm">Ricerca in corso...</p>}
            {risultati.length > 0 && (
              <div className="mt-4 space-y-2">
                {risultati.map(p => {
                  const promoOra = isPromoAttivaOra(p)
                  return (
                    <div key={p.id} className={`border rounded-lg p-3 hover:bg-gray-50 ${promoOra ? 'border-red-200 bg-red-50/30' : ''}`}>
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${brandColor(p.brand)}`}>{p.brand}</span>
                            <span className="font-mono text-sm text-gray-500">{p.codice}</span>
                          </div>
                          <p className="font-medium text-gray-800">{p.descrizione}</p>
                          {p.categoria && <p className="text-xs text-gray-400 mt-0.5">{p.categoria}</p>}
                          {p.confezione && <p className="text-sm text-gray-500">Conf. {p.confezione}</p>}
                          {p.note_promo && (
                            <p className="text-sm text-red-700 bg-red-50 rounded px-2 py-1 mt-2 inline-block">
                              📌 {p.note_promo}
                            </p>
                          )}
                        </div>
                        <div className="text-right space-y-1 ml-2 flex-shrink-0">
                          {promoOra && (
                            <>
                              <div className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold inline-block">🔴 PROMO</div>
                              <p className="font-bold text-xl text-red-700">€ {Number(p.prezzo_promo).toFixed(2)}</p>
                              {p.prezzo_a && <p className="text-xs text-gray-400 line-through">Listino € {Number(p.prezzo_a).toFixed(2)}</p>}
                              {p.promo_al && <p className="text-xs text-gray-500">fino al {formatDateIT(p.promo_al)}</p>}
                            </>
                          )}
                          {!promoOra && ['ECHO', 'WEIBANG'].includes(p.brand) && p.prezzo_b ? (
                            <>
                              <div>
                                <span className="text-xs text-gray-400">Vendita</span>
                                <p className="font-bold text-lg text-green-700">€ {p.prezzo_b.toFixed(2)}</p>
                              </div>
                              {p.prezzo_a && <p className="text-xs text-gray-400 line-through">Listino € {p.prezzo_a.toFixed(2)}</p>}
                            </>
                          ) : !promoOra && (
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
                          {!promoOra && p.prezzo_c && <p className="text-sm text-gray-500">C: € {p.prezzo_c.toFixed(2)}</p>}
                          {!promoOra && p.prezzo_d && <p className="text-sm text-gray-500">D: € {p.prezzo_d.toFixed(2)}</p>}
                          {p.iva && <p className="text-xs text-gray-400">IVA {p.iva}%</p>}
                        </div>
                      </div>
                      {p.data_aggiornamento && (
                        <p className="text-xs text-gray-300 mt-1">Aggiornato: {new Date(p.data_aggiornamento).toLocaleDateString('it-IT')}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            {query.length >= 2 && !cercando && risultati.length === 0 && (
              <p className="text-gray-400 mt-4 text-center">Nessun prodotto trovato per "{query}"</p>
            )}
          </div>
        )}

        {/* TAB CRONOLOGIA */}
        {tabSafe === 'cronologia' && (
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
                      <th className="px-3 py-2 text-left">Ver.</th>
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
                        <td className="px-3 py-2 text-gray-500 text-xs font-mono">{log.versione || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB UPLOAD */}
        {tabSafe === 'upload' && (
          <div className="bg-white rounded-xl shadow p-4 space-y-4">
            <div>
              <p className="text-gray-600 mb-3">Carica un file listino prezzi. Formati supportati:</p>
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
                        {Object.entries(categorieAnteprima).map(([cat, items]) => `${cat}: ${items.length}`).join(' · ')}
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
                    <p className="text-center text-gray-400 text-xs py-2">... e altri {anteprima.length - 15} prodotti</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB PROMO PDF (Gemini Vision) */}
        {tabSafe === 'promo' && isAdmin && (
          <div className="bg-white rounded-xl shadow p-4 space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
              <p className="font-medium mb-1">🔴 Importa Promo da Volantino PDF</p>
              <p className="text-xs">Carica il volantino, Gemini estrae automaticamente modelli, prezzi e note (omaggi, coupon, finanziamenti). Tu rivedi, correggi, confermi. Aggiorna solo i campi promo dei prodotti esistenti, oppure crea nuovi record se non li trova.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Brand *</label>
                <input
                  type="text"
                  list="promo-brands"
                  value={promoBrand}
                  onChange={e => setPromoBrand(e.target.value)}
                  placeholder="Es: STIHL"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
                <datalist id="promo-brands">
                  <option value="STIHL" />
                  <option value="ECHO" />
                  <option value="HONDA" />
                  <option value="WEIBANG" />
                  <option value="SEGWAY" />
                  <option value="WORX" />
                  <option value="GEOGREEN" />
                  <option value="VOLPI" />
                  <option value="GGP" />
                  <option value="NEGRI" />
                  <option value="WORTEX" />
                  <option value="GRILLO" />
                </datalist>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Valida dal *</label>
                <input type="date" value={promoDal} onChange={e => setPromoDal(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Valida al *</label>
                <input type="date" value={promoAl} onChange={e => setPromoAl(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>

            <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-red-400 transition-colors">
              <input type="file" accept=".pdf" onChange={handlePromoFile} className="hidden" />
              <div className="text-3xl mb-1">📎</div>
              <p className="text-gray-500 text-sm">
                {promoFile ? `📄 ${promoFile.name}` : 'Clicca per selezionare il volantino PDF'}
              </p>
            </label>

            <div className="flex justify-end">
              <button
                onClick={analizzaPromoOra}
                disabled={!promoFile || promoAnalizzando}
                className="bg-red-600 text-white px-5 py-2 rounded-lg font-medium disabled:opacity-50 hover:bg-red-700"
              >
                {promoAnalizzando ? '⏳ Gemini sta analizzando...' : '🔍 Analizza con Gemini'}
              </button>
            </div>

            {promoMessaggio && (
              <div className={`rounded-lg p-3 text-sm ${promoMessaggio.tipo === 'ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {promoMessaggio.testo}
              </div>
            )}

            {promoRows.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3 gap-2">
                  <p className="text-sm text-gray-600">
                    <strong>{promoRows.filter(r => r._includi).length}</strong> di {promoRows.length} prodotti selezionati
                  </p>
                  <button
                    onClick={importaPromo}
                    disabled={promoImportando}
                    className="bg-red-600 text-white px-5 py-2 rounded-lg font-medium disabled:opacity-50 hover:bg-red-700"
                  >
                    {promoImportando ? 'Importazione...' : `✓ Importa ${promoRows.filter(r => r._includi).length} promo`}
                  </button>
                </div>
                <div className="border rounded-lg overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-center w-8">✓</th>
                        <th className="px-2 py-2 text-left">Modello *</th>
                        <th className="px-2 py-2 text-left">Codice</th>
                        <th className="px-2 py-2 text-right">Cat. €</th>
                        <th className="px-2 py-2 text-right">Promo € *</th>
                        <th className="px-2 py-2 text-left">Note</th>
                        <th className="px-2 py-2 text-center">Match</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promoRows.map(r => (
                        <tr key={r._idx} className={`border-t ${r._includi ? '' : 'opacity-40'}`}>
                          <td className="px-2 py-1 text-center">
                            <input type="checkbox" checked={r._includi} onChange={() => togglePromoRow(r._idx)} />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="text"
                              value={r.modello}
                              onChange={e => editPromoCell(r._idx, 'modello', e.target.value)}
                              className="w-full border rounded px-1 py-0.5 text-xs"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="text"
                              value={r.codice_articolo}
                              onChange={e => editPromoCell(r._idx, 'codice_articolo', e.target.value)}
                              className="w-full border rounded px-1 py-0.5 text-xs font-mono"
                            />
                          </td>
                          <td className="px-2 py-1 text-right">
                            <input
                              type="number"
                              step="0.01"
                              value={r.prezzo_catalogo ?? ''}
                              onChange={e => editPromoCell(r._idx, 'prezzo_catalogo', e.target.value)}
                              className="w-20 border rounded px-1 py-0.5 text-xs text-right"
                            />
                          </td>
                          <td className="px-2 py-1 text-right">
                            <input
                              type="number"
                              step="0.01"
                              value={r.prezzo_promo ?? ''}
                              onChange={e => editPromoCell(r._idx, 'prezzo_promo', e.target.value)}
                              className="w-20 border rounded px-1 py-0.5 text-xs text-right font-bold text-red-700"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              type="text"
                              value={r.note_promo}
                              onChange={e => editPromoCell(r._idx, 'note_promo', e.target.value)}
                              placeholder="omaggi, coupon, finanziamenti..."
                              className="w-full border rounded px-1 py-0.5 text-xs"
                            />
                          </td>
                          <td className="px-2 py-1 text-center">
                            {r._match ? (
                              <span className="text-green-700 text-xs" title={`Match con: ${r._match.descrizione}`}>✅</span>
                            ) : (
                              <span className="text-blue-600 text-xs" title="Verrà creato un nuovo record">🆕</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  ✅ aggiorna record esistente (solo prezzo_promo / date / note_promo) · 🆕 crea nuovo record con brand e codice indicati
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
