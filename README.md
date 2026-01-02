# 📦 OMPRA - Gestionale Magazzino & Commissioni

**PWA veloce e moderna per la gestione magazzino macchine e generazione istantanea commissioni di vendita.**

## 🚀 Stack Tecnologico

- **Framework**: React 19 + Vite
- **UI**: Tailwind CSS
- **Icons**: Lucide React
- **State**: Zustand (persistente con LocalStorage)
- **AI/OCR**: Google Gemini Flash API
- **Backend**: Google Sheets via Apps Script

## 📋 Funzionalità Principali

### 1. Dashboard
- **3 pulsanti giganti** per azioni rapide
- Indicatore stato sincronizzazione (Verde/Rosso)
- Contatore giacenze in tempo reale

### 2. Carico Merce (Modalità Raffica)
✨ **Obiettivo: 10 macchine in 30 secondi**

- Selezione Brand/Modello una sola volta
- Scan OCR continuo delle matricole
- Beep di conferma ad ogni scan
- Fotocamera sempre attiva tra una scan e l'altra
- Salvataggio batch al click finale

### 3. Vendita & Commissione
- **Step 1**: Identificazione matricola (OCR o manuale)
- **Step 2**: Dati transazione (cliente, prezzo, accessori)
- **Step 3**: OUTPUT commissione screenshot-ready

### 4. Commissione Screenshot-Ready
📱 **Ottimizzata per WhatsApp**

- Sfondo BIANCO, testo NERO (alto contrasto)
- Layout pulito tipo "foglio di carta"
- Logo OMPRA + Data/Ora
- Box cliente ben visibile
- Tabella prodotti con matricola monospaziata
- TOTALE grande in basso
- **Pinch-to-Zoom** abilitato
- Pulsante X flottante (fuori dall'area screenshot)

### 5. Giacenze
- Lista consultabile e filtrabile
- Ricerca per brand/modello/matricola
- Filtri: Tutti | Disponibili | Vendute
- Statistiche rapide

## 🛠️ Setup e Installazione

### Prerequisiti
- Node.js 18+
- npm o yarn

### Installazione

```bash
# 1. Installa dipendenze
npm install

# 2. Configura API (opzionale per demo)
# Modifica src/store.js:
# - GOOGLE_SHEETS_WEBHOOK: URL del tuo Google Apps Script
# - GEMINI_API_KEY: La tua chiave API Gemini

# 3. Avvia dev server
npm run dev

# 4. Build per produzione
npm run build
```

## 🔧 Configurazione Google Sheets (Backend)

### 1. Crea un Google Sheet
Struttura colonne suggerita:
- Timestamp
- Action (carico/vendita)
- Brand
- Model
- SerialNumber
- Cliente
- Prezzo
- Totale
- Status

### 2. Crea Apps Script

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  if (data.action === 'carico_bulk') {
    data.data.forEach(item => {
      sheet.appendRow([
        data.timestamp,
        'CARICO',
        item.brand,
        item.model,
        item.serialNumber,
        '',
        '',
        '',
        'available'
      ]);
    });
  } else if (data.action === 'vendita') {
    sheet.appendRow([
      data.timestamp,
      'VENDITA',
      data.data.brand,
      data.data.model,
      data.data.serialNumber,
      data.data.saleData.cliente,
      data.data.saleData.prezzo,
      data.data.saleData.totale,
      'sold'
    ]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: true }));
}
```

### 3. Deploy come Web App
- Deploy > New deployment
- Execute as: Me
- Who has access: Anyone
- Copia URL e incollalo in `src/store.js`

## 🤖 Integrazione Gemini API (OCR)

Per abilitare l'OCR reale delle matricole:

1. Ottieni API key da [Google AI Studio](https://aistudio.google.com/)
2. Modifica `src/store.js`:

```javascript
scanSerialNumber: async (imageData) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Estrai SOLO il numero di matricola da questa immagine. Rispondi solo con il numero, niente altro." },
            { inline_data: { mime_type: "image/jpeg", data: imageData } }
          ]
        }]
      })
    }
  );
  
  const data = await response.json();
  return data.candidates[0].content.parts[0].text.trim();
}
```

## 📱 PWA Setup

### Manifest.json
Già configurato in `public/manifest.json`

### Service Worker (Opzionale)
Per cache offline completa, aggiungi in `public/sw.js`:

```javascript
const CACHE_NAME = 'ompra-v1';
const urlsToCache = ['/', '/index.html', '/src/main.jsx'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

E registralo in `src/main.jsx`:

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

## 🎨 Personalizzazione UI

### Colori (tailwind.config.js)
```javascript
colors: {
  success: '#10b981',  // Verde azioni positive
  danger: '#ef4444',   // Rosso errori
  primary: '#1f2937'   // Grigio scuro UI base
}
```

### Logo
Sostituisci "OMPRA" nel componente `CommissioneModal.jsx` con:
```jsx
<img src="/logo.png" alt="OMPRA" className="h-16 mx-auto mb-4" />
```

## 🐛 Troubleshooting

### OCR non funziona
- Verifica la chiave API Gemini
- Controlla la console per errori CORS
- Usa simulazione per sviluppo

### Sincronizzazione fallisce
- Verifica URL Google Apps Script
- Controlla permessi dello script
- Imposta `mode: 'no-cors'` nella fetch

### LocalStorage pieno
- Implementa pulizia periodica dati vecchi
- Sposta su IndexedDB per storage maggiore

## 📊 Metriche Performance

- **First Load**: < 2s
- **Carico 10 macchine**: < 30s
- **Generazione commissione**: Istantanea
- **Size bundle**: ~200KB (gzipped)

## 🔐 Sicurezza

⚠️ **Importante**:
- Non committare API keys nel codice
- Usa variabili d'ambiente per produzione
- Implementa autenticazione per deployment pubblico
- Le commissioni NON sono documenti fiscali

## 📄 Licenza

Uso interno OMPRA. Tutti i diritti riservati.

## 🤝 Supporto

Per supporto tecnico o feature requests, contatta il team di sviluppo.

---

**Versione**: 1.0.0  
**Build**: React 19 + Vite  
**Ottimizzato per**: Mobile-first, Touch-friendly, Screenshot-ready
