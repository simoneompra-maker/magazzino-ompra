# OMPRA Gestionale — Handoff per Claude Code

> Documento di passaggio di consegne. Contesto della PWA, convenzioni, stato del lavoro,
> coda dei prossimi punti e **regole anti-bug** da non violare mai più.
> Aggiornato dopo la sessione del modulo Budget + fix focus/cliente.

---

## 0. Regola di lavoro (NON NEGOZIABILE)

Il proprietario (Simone) approva **prima** di ogni modifica sostanziale. Ordine sempre:

1. **Leggi** i file rilevanti (non andare a memoria).
2. **Mostra il piano** (file per file, query, dove si aggancia) o il **diff** proposto.
3. **Attendi conferma esplicita.**
4. Solo dopo, **scrivi file completi** (mai snippet) con messaggio di commit.
5. Valida la struttura JSX prima di consegnare.

Eccezione: solo se Simone scrive esplicitamente "fai tutto senza conferma" su un task circoscritto.

---

## 1. Cos'è la PWA

Gestionale mobile-first per **OMPRA srl** (macchine da giardino + servizi agronomici, San Biagio di Callalta TV): vendite, commissioni, noleggi, preventivi, pianificazione agronomica, anagrafiche, cataloghi.

**Stack:** React 19 + Vite + Tailwind + Zustand + Lucide React · Supabase (PostgreSQL, progetto `bvfxipapydhnviqbbcjk` / `ompra-magazzino`) · Vercel (auto-build su push). Repo `simoneompra-maker/magazzino-ompra` → `magazzino-ompra.vercel.app`. Deploy: commit via GitHub Desktop da PC → Vercel builda.

---

## 2. Convenzioni di codice (RISPETTARE ALLA LETTERA)

- **Supabase client:** `import { supabase } from '../store'`. Mai `createClient` nei moduli.
- **Admin detection:** `(localStorage.getItem('ompra_ultimo_operatore') || '').toLowerCase() === 'admin'`.
- **Scritture Supabase:** i `catch` devono **mostrare l'errore** (toast/alert) + loggare in console e rilanciare. **Mai catch muti.**
- **DB additivo-only:** niente rimozioni/ALTER distruttivi senza piano approvato.
- **PDF (jsPDF):** `if (!window.jspdf) { await import(<cdn>) }` poi `window.jspdf.jsPDF`; apri con `window.open(url,'_blank')`.
- **Excel:** import npm `import * as XLSX from 'xlsx'` (già in package.json, scelto per robustezza/offline). **REGOLA COLONNA A:** ogni riga dati deve avere un intero progressivo non nullo in colonna A, altrimenti SheetJS sfalsa gli indici.
- **Aliquote IVA:** 22% macchine, 10% sementi, 4% concimi. Campo riga `aliquotaIva`. Il `prezzo` nei JSONB è sempre **lordo (IVA inclusa)**, anche con `iva_compresa=false`.
- Tailwind + icone Lucide; coerenza con i moduli esistenti.

---

## 3. Modello dati commissioni (verificato)

Tabella `commissioni`: `id` (text; storico migrato = `recovered-*`), `created_at`, `cliente`, `cliente_info` jsonb, `operatore` text, `user_id` text, `prodotti` jsonb, `accessori` jsonb, `totale`, `tipo_operazione` (vendita/reso/cambio), `iva_compresa` bool, `is_preventivo` bool, ecc.

- **`prodotti[]`** keys: `brand`, `model`, `prezzo`, `aliquotaIva`, `serialNumber`, `isOmaggio`. **Niente campo nome** → testo da classificare = `brand + ' ' + model`.
- **`accessori[]`** keys: `nome`, `prezzo`, `quantita`, `aliquotaIva`, `matricola`, `id` (timestamp, NON codice catalogo).
- Le righe **non hanno** un id stabile né un riferimento certo al catalogo → classificazione **per nome**.
- Dati presenti: solo **2026** (lo storico 2025 era in Excel, non in tabella).

---

## 4. BACKEND BUDGET — FATTO E VALIDATO (non ricreare)

Su Supabase esistono già (additivi, sola lettura):

- **`ompra_classifica_categoria(testo text) → text`** — cascata: ANTIZANZARE → CONSULENZA → guard `spandiconcime`(=MACCHINE) → GEOGREEN → default MACCHINE. Dizionari arricchiti coi listini antizanzare (zhalt, geyser, zanzero, freezanz, nebuzan, ciper, perm plus, silver shield, garden extension, kit expanding, …).
- **`v_vendite_dettaglio`** — una riga per commissione di vendita (esclude preventivi). Colonne: `commissione_id, data, anno, trimestre, settimana, cliente, descrizione, tipo_operazione, segno, imp_macchine, imp_geogreen, imp_antizanzare, imp_consulenza, imponibile_totale, importo_ivato`. Imponibile = `prezzo/(1+aliquota/100)*qta`, fallback 22%, `isOmaggio→0`, segno reso=−. **Fallback `recovered-*`**: se le righe non hanno prezzo (somma 0) ma c'è un totale, scorpora il totale e lo attribuisce alla categoria della descrizione.
- **`v_riepilogo_trimestrale`** — categorie × T1·T2·T3·T4 + totale_anno + totale_anno_prec + variazione_pct (NULL finché manca lo storico anno precedente).

**Modulo React Budget**: in `src/modules/budget/` (rinominato dai vecchi `VenditeCategoria*`). Due tab (Riepilogo / Dettaglio), export Excel, admin-only. La tile "Budget" punta a questo. Esiste ancora il vecchio **tracker settimanale** `BudgetAdmin.jsx` come "Budget Settimanale" (PIN, dati 2025 hardcoded) — tenuto separato, NON è il modulo a categorie.

---

## 5. CODA LAVORI (in ordine)

### 5.1 — Bug modale modifica commissione, opzione B (PROSSIMO)
Oggi i prodotti esistenti sono read-only; i nuovi (`_isNew`) editabili. Serve poter **modificare anche gli esistenti**, ma con protezione:
- pulsante ✏️ **"Modifica"** per riga che sblocca i campi **descrizione (brand/model) + matricola/serialNumber** (ed eventualmente prezzo/quantità);
- lo stato "riga in modifica" deve essere un **flag stabile** (es. `editingRowId`), MAI una condizione sul contenuto dei campi (vedi regola anti-bug R3);
- default resta read-only (evita modifiche accidentali su commissioni chiuse).

### 5.2 — Formato ripetuto nella tendina prodotti
La tendina (alimentata da Supabase `listini`) mostra il formato due volte: "Albatros Green 8 Kg 25 **25 kg**", "Natural Green - Lt. 1 **Lt. 1**". **Verificato: `listini.descrizione` è PULITA** → il raddoppio lo aggiunge il **codice**, concatenando `descrizione` con una colonna formato/kg/conf già contenuta nella descrizione. Fix solo frontend: mostrare solo `descrizione`, o appendere il formato solo se non già presente. **Non toccare i dati.** Le commissioni già salvate restano col doppione nel JSONB (cosmetico, eventuale pulizia dopo).

### 5.3 — Budget: sezione "Da rivedere" + override
Per i casi dubbi (raccorderia/ricambi dal nome generico: tubolare, raccordo, ugello, tubo). Regola di business: la raccorderia di solito è materiale antizanzare; i ricambi macchina espliciti sono `catena`, `filo dece/decespugliatore`, `lama`. Soluzione concordata = **revisione dal Budget** (non dal form vendita):
- nuova **tabella override** (additiva): `commissione_id` + riferimento riga + `categoria_scelta` + operatore + timestamp;
- `v_vendite_dettaglio` legge **prima** l'override, poi il classificatore;
- UI Budget: lista righe "in default dubbio" con selettore categoria, salva nell'override.
- Nodo tecnico da progettare insieme: **identificare in modo stabile la singola riga** nel JSONB (non ha id univoco).

### 5.4 — Filtro per venditore (solo comodità)
Budget filtrato per `operatore`/`user_id` loggato; admin vede tutto + selettore venditore. **NON è sicurezza**: la RLS è ancora permissiva, un filtro lato app si aggira. Per riservatezza vera serve la migrazione Auth (vedi §7).

---

## 6. REGOLE ANTI-BUG (emerse da bug reali — applicare sempre)

- **R1 — Liste editabili: `key` stabile.** Ogni elemento di una lista editabile usa un id **immutabile** generato all'inserimento (`crypto.randomUUID()`). Mai `key={index}`, mai una key che dipende da un campo modificabile (brand/model). Se le righe esistenti non hanno id stabile, assegnarne uno all'apertura del modale, una volta sola.
- **R2 — Niente componenti/input definiti dentro il render** di un altro componente: vengono ricreati a ogni render → perdita focus. Definirli a livello di modulo, dati via props.
- **R3 — Mai input/testo legato a condizione dinamica.** Non scegliere tra `<input>` editabile e `<p>` read-only con una condizione che cambia mentre l'utente digita (es. `!campo`): smonta l'input al primo carattere → focus perso. Usare un flag stabile (`_isNew`, `editingRowId`, "modalità modifica") indipendente dal contenuto.
- **R4 — Salvataggi mai muti.** Ogni insert/update/upload in try/catch che **mostra l'errore a schermo** + console. Un fallimento non deve mai sembrare "non succede nulla".
- **R5 — Campi form sempre inizializzati a `''`.** Mai `.trim()`/accessi diretti su valori potenzialmente `undefined`: usare `(campo || '').trim()` o `campo?.trim() ?? ''`.

---

## 7. Follow-up annotati (NON ora)

- **`aliquotaIva` obbligatoria** nel form di Vendita (elimina il fallback 22% a monte).
- **Migrazione Supabase Auth + RLS reale**: oggi RLS permissiva (`USING(true)`), admin-gating solo lato `localStorage`. Necessaria prima di dare riservatezza vera per venditore. Ricordarla ogni volta che si toccano tabelle sensibili o si parla di accessi.
- **Catalogo antizanzare completo** in tabella `zz_materiali` (codici/descrizioni) per il futuro modulo antizanzare e per coprire la raccorderia in modo deterministico.

---

## 8. Primo passo operativo
Per il task in corso (5.1), leggi il modale di modifica commissione, mostra il `.map()` dei prodotti e dove si decide input/read-only, proponi il piano dell'opzione B (toggle ✏️ + `editingRowId`), attendi conferma, poi scrivi. Rispetta R1–R5.
