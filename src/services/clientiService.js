// Servizio per gestione clienti da CSV

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

// Carica e parsa il CSV dei clienti
export const loadClienti = async () => {
  if (clientiCache) {
    return clientiCache;
  }

  try {
    // Carica il file CSV dalla cartella public
    const response = await fetch('/database_clienti.csv');
    if (!response.ok) {
      console.warn('File clienti non trovato, autocompletamento disabilitato');
      return [];
    }
    
    const csvText = await response.text();
    const clienti = parseCSV(csvText);
    
    clientiCache = clienti;
    console.log(`✅ Caricati ${clienti.length} clienti`);
    
    return clienti;
  } catch (error) {
    console.error('Errore caricamento clienti:', error);
    return [];
  }
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
