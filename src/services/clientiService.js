// Servizio per gestione clienti da CSV + Supabase
// Merge automatico: CSV (storico) + tabella clienti (nuovi aggiunti in app)

import { supabase } from '../store';

let clientiCache = null;

// Storage locale per numeri telefono aggiunti manualmente
const TELEFONI_KEY = 'ompra_telefoni_clienti';

const getTelefoniSalvati = () => {
  try {
    const stored = localStorage.getItem(TELEFONI_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    return {};
  }
};

export const salvaTelefono = (clienteId, telefono) => {
  try {
    const telefoni = getTelefoniSalvati();
    telefoni[clienteId] = telefono;
    localStorage.setItem(TELEFONI_KEY, JSON.stringify(telefoni));
  } catch (e) {
    console.error('Errore salvataggio telefono:', e);
  }
};

export const getTelefonoSalvato = (clienteId) => {
  const telefoni = getTelefoniSalvati();
  return telefoni[clienteId] || null;
};

// Carica clienti da CSV + Supabase (merge, deduplicato per searchText)
export const loadClienti = async (forceRefresh = false) => {
  if (clientiCache && !forceRefresh) {
    return clientiCache;
  }

  // ── 1. Carica CSV ──────────────────────────────────────────
  let clientiCSV = [];
  try {
    const response = await fetch('/database_clienti.csv');
    if (response.ok) {
      const csvText = await response.text();
      clientiCSV = parseCSV(csvText);
    } else {
      console.warn('File clienti CSV non trovato');
    }
  } catch (e) {
    console.warn('Errore caricamento CSV clienti:', e);
  }

  // ── 2. Carica da Supabase (escludi soft-deleted) ───────────
  let clientiDB = [];
  try {
    const { data, error } = await supabase
      .from('clienti')
      .select('id, nome, cognome, nome_completo, indirizzo, cap, localita, provincia, telefono, email, contatto, cf, piva, search_text, fonte, created_at')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (!error && data) {
      clientiDB = data.map(c => ({
        id:         c.id,
        nome:       c.nome_completo || `${c.cognome || ''} ${c.nome || ''}`.trim() || '',
        cognome:    c.cognome    || '',
        nomeP:      c.nome       || '',
        indirizzo:  c.indirizzo  || '',
        cap:        c.cap        || '',
        localita:   c.localita   || '',
        provincia:  c.provincia  || '',
        telefono:   c.telefono   || '',
        email:      c.email      || '',
        contatto:   c.contatto   || '',
        cf:         c.cf         || '',
        searchText: (c.search_text || c.nome_completo || '').toLowerCase(),
        _fonte:     'db',
      }));
    }
  } catch (e) {
    console.warn('Errore caricamento clienti DB:', e);
  }

  // ── 3. Merge: DB ha priorità su CSV per evitare duplicati ──
  const chiavi = new Set(clientiDB.map(c => c.searchText).filter(Boolean));
  const csvNonDuplicati = clientiCSV.filter(c => {
    const key = (c.searchText || c.nome || '').toLowerCase().trim();
    return !chiavi.has(key);
  });

  const merged = [...clientiDB, ...csvNonDuplicati];
  clientiCache = merged;
  console.log(`✅ Clienti caricati: ${clientiDB.length} da DB + ${csvNonDuplicati.length} da CSV = ${merged.length} totali`);

  return merged;
};

// Invalida la cache (chiamare dopo salvataggio nuovo cliente)
export const invalidaClienteCache = () => {
  clientiCache = null;
};

// Parser CSV con separatore ; (punto e virgola)
const parseCSV = (csvText) => {
  const lines = csvText.split('\n');
  if (lines.length < 2) return [];
  
  // Rimuovi BOM se presente
  let headerLine = lines[0];
  if (headerLine.charCodeAt(0) === 0xFEFF) {
    headerLine = headerLine.slice(1);
  }
  
  // Trova indici colonne dall'header (separatore ;)
  const header = parseCSVLine(headerLine, ';');
  const idx = {
    ragsoc: header.indexOf('des_ragsoc'),
    cognome: header.indexOf('des_cogn'),
    nome: header.indexOf('des_nome'),
    indirizzo: header.indexOf('des_indir_res'),
    cap: header.indexOf('cod_cap_res'),
    localita: header.indexOf('des_localita_res'),
    provincia: header.indexOf('sig_prov_res'),
    telefono: header.indexOf('sig_tel1_res'),
    email: header.indexOf('des_email1'),
    contatto: header.indexOf('des_contatto'),
    codice: header.indexOf('cod_anagra')
  };
  
  const clienti = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const cols = parseCSVLine(line, ';');
    
    const ragsoc = cols[idx.ragsoc]?.trim() || '';
    if (!ragsoc) continue; // Salta righe senza ragione sociale
    
    const clienteId = cols[idx.codice]?.trim() || i.toString();
    const telefonoCSV = cols[idx.telefono]?.trim() || '';
    
    // Controlla se c'è un telefono salvato localmente
    const telefonoSalvato = getTelefonoSalvato(clienteId);
    
    clienti.push({
      id: clienteId,
      nome: ragsoc,
      cognome: cols[idx.cognome]?.trim() || '',
      nomeP: cols[idx.nome]?.trim() || '',
      indirizzo: cols[idx.indirizzo]?.trim() || '',
      cap: cols[idx.cap]?.trim() || '',
      localita: cols[idx.localita]?.trim() || '',
      provincia: cols[idx.provincia]?.trim() || '',
      telefono: telefonoSalvato || telefonoCSV,
      telefonoOriginale: telefonoCSV, // Per sapere se era nel CSV
      email: cols[idx.email]?.trim() || '',
      contatto: cols[idx.contatto]?.trim() || '',
      // Campo ricerca combinato (per matching veloce)
      searchText: `${ragsoc} ${cols[idx.localita] || ''} ${cols[idx.contatto] || ''}`.toLowerCase()
    });
  }
  
  return clienti;
};

// Parser linea CSV (gestisce virgolette e separatore personalizzato)
const parseCSVLine = (line, separator = ',') => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === separator && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result;
};

// Cerca clienti (max 10 risultati per performance)
export const searchClienti = (query, clienti) => {
  if (!query || query.length < 2 || !clienti?.length) {
    return [];
  }
  
  const searchTerm = query.toLowerCase();
  
  // Prima cerca match esatti all'inizio
  const startsWithMatch = clienti
    .filter(c => c.nome.toLowerCase().startsWith(searchTerm))
    .slice(0, 5);
  
  // Poi cerca match parziali
  const containsMatch = clienti
    .filter(c => 
      !c.nome.toLowerCase().startsWith(searchTerm) && 
      c.searchText.includes(searchTerm)
    )
    .slice(0, 5);
  
  return [...startsWithMatch, ...containsMatch].slice(0, 10);
};

// Formatta indirizzo completo
export const formatIndirizzo = (cliente) => {
  const parts = [];
  if (cliente.indirizzo) parts.push(cliente.indirizzo);
  if (cliente.cap || cliente.localita) {
    parts.push(`${cliente.cap} ${cliente.localita}`.trim());
  }
  if (cliente.provincia) {
    parts.push(`(${cliente.provincia})`);
  }
  return parts.join(' - ');
};

// Formatta telefono per visualizzazione
export const formatTelefono = (telefono) => {
  if (!telefono) return '';
  // Rimuovi spazi e caratteri non numerici eccetto +
  return telefono.replace(/[^\d+]/g, '');
};
