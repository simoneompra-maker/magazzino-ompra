# OMPRA Gestionale — Handoff per Claude Code: Modulo Budget

> Documento di passaggio di consegne. Contiene il contesto della PWA, le convenzioni
> da rispettare, lo stato del backend (già creato su Supabase) e il piano del modulo
> **Budget** da costruire ora. Leggi tutto prima di scrivere codice.

---

## 0. Regola di lavoro (NON NEGOZIABILE)

Il proprietario (Simone) approva **prima** di ogni modifica sostanziale.
Workflow da seguire sempre, in quest'ordine:

1. **Leggi** i file indicati (non andare a memoria).
2. **Mostra il piano**: cosa crei/modifichi, struttura, query, dove si aggancia.
3. **Attendi approvazione esplicita.**
4. Solo dopo, **scrivi i file completi** (mai snippet) con messaggio di commit.
5. Conferma che la struttura JSX sia valida prima di consegnare (conteggio tag, parser).

Per modifiche piccole → patch chirurgica. Per JSX con struttura accumulata di errori → riscrittura completa del file. Niente modifiche distruttive al DB senza discussione (principio **additivo-only**).

---

## 1. Cos'è la PWA

Gestionale mobile-first per **OMPRA srl** (macchine da giardino + servizi agronomici, San Biagio di Callalta TV). Usato ogni giorno per operatività interna: vendite, commissioni, noleggi, preventivi, pianificazione agronomica, anagrafiche, cataloghi.

### Stack
- **Frontend:** React 19 + Vite + Tailwind + Zustand + Lucide React
- **Backend:** Supabase (PostgreSQL, progetto `bvfxipapydhnviqbbcjk` / `ompra-magazzino`)
- **Deploy:** Vercel (auto-build su push GitHub). Repo: `simoneompra-maker/magazzino-ompra` → `magazzino-ompra.vercel.app`
- **Workflow deploy del proprietario:** commit via GitHub Desktop da PC → Vercel builda da solo.

### Moduli già in produzione (per contesto, NON toccarli)
Vendita (OCR scontrini Gemini, multi-operatore, IVA toggle, "Da Ordinare"), Commissioni / ArchivioCommissioni (PDF/WhatsApp, badge tipo operazione), Archivio Preventivi, PratoVivo (piano agronomico, idrosemina, archivio, PDF), Noleggio (carrello multi-macchina, PDF, consegna), Sopralluogo (dettatura vocale Gemini), STIHL Catalogo 2026, Listini, Rubrica Clienti.

---

## 2. Convenzioni di codice (RISPETTARE ALLA LETTERA)

- **Supabase client:** importa sempre `import { supabase } from '../store'`. **Mai** chiamare `createClient` direttamente nei moduli/componenti.
- **Admin detection (case-insensitive):**
  ```js
  const isAdmin = (localStorage.getItem('ompra_ultimo_operatore') || '').toLowerCase() === 'admin';
  ```
  Il modulo Budget è **admin-only**: se non admin, non mostrare la voce e blocca l'accesso alla schermata.
- **Scritture Supabase:** i blocchi `catch` devono **lanciare** (throw), mai fingere un salvataggio su stato locale. Mai inghiottire silenziosamente errori di insert/update.
- **DB additivo-only:** non rimuovere colonne/oggetti senza discussione esplicita.
- **PDF (jsPDF):** pattern `if (!window.jspdf) { await import(<cdn url>) }` poi `window.jspdf.jsPDF`. I PDF si aprono con `window.open(publicUrl, '_blank')` dopo upload su Supabase Storage.
- **Excel (SheetJS / `window.XLSX` da CDN) — REGOLA CRITICA:** scrivere SEMPRE un valore non nullo (intero progressivo) nella **colonna A** di ogni riga dati. Se la colonna A è vuota, `<dimension ref>` parte dalla prima colonna con dati e SheetJS sfalsa gli indici di `sheet_to_json` → import a 0 righe. Vale per la generazione lato openpyxl e va tenuto presente anche in export.
- **Aliquote IVA:** 22% macchine, 10% sementi, 4% concimi. Il campo riga è `aliquotaIva`.
- **Brand matching nelle query:** `ilike` con wildcard `%`.
- **Stato/UI:** Tailwind, icone Lucide React, coerenza con i moduli esistenti (guarda un modulo di riferimento prima di scrivere — vedi §6).

---

## 3. Stato del BACKEND — GIÀ FATTO (non ricreare)

Su Supabase sono **già stati creati e validati** 1 funzione + 2 view (tutto additivo, sola lettura, nessun `ALTER`, nessuna scrittura). Il modulo Budget deve **solo leggerle**.

### 3.1 Funzione classificatrice
```
ompra_classifica_categoria(testo text) -> text
```
Cascata: **ANTIZANZARE → CONSULENZA → guard `spandiconcime` (=MACCHINE) → GEOGREEN → default MACCHINE**.
Le 4 categorie sono: `MACCHINE`, `GEOGREEN`, `ANTIZANZARE`, `CONSULENZA`.
Dizionari (estratti dai listini reali, già validati su 432 movimenti storici):
- **ANTIZANZARE:** stocker/stoker, freezanz/frezanz, geyser/gayser, zhalt/zhal, nebuzan, florifens, etokraft, pirekraft, tetrapi*, "natural green", "impianto antizanzar*", "antizanzar*".
- **GEOGREEN:** geogreen, albatros, mivena, micosat, meta-ge, humifitos, vigor active, alga park, amino k, fe ulk, leokare, sevenkare, root speed, paint/wet turf, npk enduring, granustar, iron power, pro starter/slow, universal top, allround, sustenium, eden, green 7/8, hurricane, blizzard, no-sun, renovate, twister, tornado, ecograss, winter sport, strong, sement*, micorriz*, biostimol*, "tappeto erboso".
- **CONSULENZA:** consulenza, sopralluogo, "piano agronomico", pratovivo, "analisi suolo", "relazione agronomica".

> Se in futuro serve aggiungere un brand mal classificato, si estende la regex della funzione (additivo). Non cambiare la logica a cascata.

### 3.2 View di dettaglio — una riga per commissione di vendita
```
v_vendite_dettaglio
```
Colonne: `commissione_id, data, anno, trimestre, settimana, cliente, descrizione,
tipo_operazione, segno, imp_macchine, imp_geogreen, imp_antizanzare, imp_consulenza,
imponibile_totale, importo_ivato`.

Logica già implementata dentro la view:
- Esplode `commissioni.prodotti` (testo classificato = `brand + ' ' + model`) e `commissioni.accessori` (testo = `nome`, con `quantita`).
- **Imponibile = `prezzo / (1 + aliquotaIva/100) * quantità`** (il `prezzo` è sempre **lordo/IVA inclusa**, anche con `iva_compresa=false`). Aliquote ammesse 4/10/22; **fallback 22%** se mancante.
- `isOmaggio=true` → imponibile 0.
- **Segno:** `vendita`/`cambio` = +, `reso` = −.
- Esclude i preventivi (`is_preventivo = false`).

### 3.3 View di riepilogo — categorie × trimestri
```
v_riepilogo_trimestrale
```
Colonne: `anno, categoria, t1, t2, t3, t4, totale_anno, totale_anno_prec, variazione_pct`.
`totale_anno_prec` e `variazione_pct` confrontano con l'anno-1 (sono `NULL` finché non c'è lo storico).

### 3.4 Fatti sui dati (IMPORTANTE per non confondersi)
- In `commissioni` ci sono **solo dati 2026** (dal 2026-01-01, ~346 commissioni). Lo storico 2025 stava nel vecchio Excel, **non** è in tabella.
- Quindi la dashboard di default deve mostrare **l'anno corrente** (2026); `variazione_pct` sarà NULL finché non c'è un anno precedente popolato nell'app.
- Valori 2026 a oggi (verifica di sanità): MACCHINE ~165k, GEOGREEN ~22,5k, ANTIZANZARE ~9k, CONSULENZA 0.

### Query di verifica (per controllare che le view rispondano)
```sql
select * from v_riepilogo_trimestrale where anno = 2026;
select data, cliente, descrizione, imp_macchine, imp_geogreen, imp_antizanzare, imponibile_totale
from v_vendite_dettaglio order by data desc limit 30;
```

---

## 4. TASK ORA: costruire il modulo Budget (React, admin-only)

Una **sola voce di menu "Budget"** con **due tab interne** (Riepilogo / Dettaglio), sullo stile degli altri moduli (es. tab "Da Ordinare" in Vendita). Export Excel **incluso da subito**, dietro bottone on-demand.

### 4.1 Struttura file proposta
```
src/modules/budget/
  useBudget.js         → hook: fetch da v_riepilogo_trimestrale + v_vendite_dettaglio, gestione anno/filtri/loading/errori
  BudgetModule.jsx     → container con le due tab (Riepilogo | Dettaglio) + guard admin
  BudgetRiepilogo.jsx  → selettore anno, card per categoria, tabella categorie × T1·T2·T3·T4·Totale (+ variazione % se presente)
  BudgetDettaglio.jsx  → tabella per-commissione in stile "VENDITE 2025": data, cliente, descrizione, imp per categoria, imponibile_totale; filtri trimestre/categoria/cliente; totali in fondo
  exportBudgetXlsx.js  → export Excel col layout del foglio storico (REGOLA COLONNA A obbligatoria)
```
+ wiring in `App.jsx` (routing/menu) e `Dashboard.jsx` (tile/voce), **solo se admin**.

### 4.2 Comportamento per tab
**Riepilogo**
- Selettore anno (default = anno corrente / max anno disponibile in `v_riepilogo_trimestrale`).
- 4 card categoria con `totale_anno`.
- Tabella: righe = categorie (ordine MACCHINE, GEOGREEN, ANTIZANZARE, CONSULENZA), colonne = T1·T2·T3·T4·Totale.
- Riga/colonna variazione % vs anno precedente quando `variazione_pct` non è NULL.

**Dettaglio**
- Elenco commissioni da `v_vendite_dettaglio` (filtrato per anno).
- Colonne imponibile per categoria affiancate (i misti sono già splittati lato view).
- Filtri: trimestre, categoria, ricerca cliente.
- Totali in fondo (somma colonne, coerenti col riepilogo).

**Export Excel**
- Bottone "Esporta Excel" → genera on-demand con `window.XLSX`.
- Layout simile al foglio storico "VENDITE 2025": DATA, CLIENTE, MACCHINA/DESCRIZIONE, IMPORTO IVATO, IMPONIBILE, TOT. IMP. MACCHINE, TOT. IMP. GEOGREEN, TOT. IMP. ANTIZANZARE, TOT. IMP. CONSULENZA, TOTALE.
- **Colonna A = intero progressivo non nullo su ogni riga** (regola SheetJS, vedi §2).

### 4.3 Vincoli
- `supabase` da `'../store'`.
- Admin-only (vedi §2). Niente accesso/voce per non-admin.
- Gestione errori reale (mostra stato di errore; non inghiottire le eccezioni).
- Numeri sempre arrotondati a 2 decimali in UI; formato € italiano (`toLocaleString('it-IT')`).
- Nessuna modifica al DB (le view ci sono già). Nessun tocco ai moduli esistenti se non il wiring minimo in App.jsx/Dashboard.jsx.

---

## 5. Follow-up annotati (NON in questo giro, ma da ricordare)
- **`aliquotaIva` obbligatoria nel form di Vendita** (così il fallback 22% non serve più a monte). Modifica separata, futura.
- **Debito sicurezza Supabase Auth:** la RLS è ancora permissiva (`USING(true)`). Le view ereditano la RLS di `commissioni`. L'admin-gating del Budget è solo lato `localStorage`. Da migrare a vera auth in futuro — ricordarlo quando si toccano tabelle sensibili.
- **Storico 2025 in commissioni:** se un giorno si vuole il confronto anno-su-anno, va importato lo storico (oggi assente).

---

## 6. PRIMO PASSO OPERATIVO PER TE (Claude Code)
1. Leggi `src/App.jsx` (routing/menu) e **un modulo di riferimento** che faccia query Supabase + tabella + export, idealmente `src/modules/.../ArchivioCommissioni.jsx` (o `Noleggio.jsx` se più snello). Replica da lì: import `supabase`, stile Tailwind, pattern admin, struttura componenti.
2. Verifica che le view rispondano (query §3.4).
3. **Presenta il piano dettagliato** del modulo (file per file, query, dove si aggancia in App.jsx/Dashboard.jsx) e **attendi l'OK** prima di scrivere.
4. Consegna i file completi con messaggio di commit; conferma la validità JSX.
