import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';

// CONFIGURAZIONE SUPABASE
const SUPABASE_URL = 'https://eoswkplehhmtxtattsha.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvc3drcGxlaGhtdHh0YXR0c2hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2MTY3NzcsImV4cCI6MjA4MjE5Mjc3N30.cUg61XjJf2fmTi6dAQ2EaBl49pRrtgBTN7A2EyMyvLI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const USERNAME = localStorage.getItem('ompra_user') || 'user_' + Date.now();
const LOCATION = 'main';

localStorage.setItem('ompra_user', USERNAME);

// Mapping commissione: JS camelCase ↔ DB snake_case
const commToDb = (c) => ({
  id: c.id,
  created_at: c.createdAt,
  cliente: c.cliente,
  cliente_info: c.clienteInfo || null,
  telefono: c.telefono || null,
  operatore: c.operatore || null,
  prodotti: c.prodotti || [],
  accessori: c.accessori || [],
  totale: c.totale || 0,
  caparra: c.caparra || null,
  metodo_pagamento: c.metodoPagamento || null,
  note: c.note || null,
  tipo_documento: c.tipoDocumento || 'scontrino',
  status: c.status || 'pending',
  completed_at: c.completedAt || null,
  iva_compresa: c.ivaCompresa !== false,
  user_id: c.user || null
});

const commFromDb = (row) => ({
  id: row.id,
  createdAt: row.created_at,
  cliente: row.cliente,
  clienteInfo: row.cliente_info,
  telefono: row.telefono,
  operatore: row.operatore,
  prodotti: row.prodotti || [],
  accessori: row.accessori || [],
  totale: row.totale || 0,
  caparra: row.caparra || null,
  metodoPagamento: row.metodo_pagamento,
  note: row.note,
  tipoDocumento: row.tipo_documento || 'scontrino',
  status: row.status || 'pending',
  completedAt: row.completed_at,
  ivaCompresa: row.iva_compresa !== false,
  user: row.user_id
});

const useStore = create((set, get) => ({
  // Stato
  inventory: [],
  sales: [],
  commissioni: [], // Loaded from Supabase via fetchCommissioni
  brands: [
    'Archman', 'Bluebird', 'Captain', 'Cutman', 'Echo', 'Forest', 'GGP', 'Grillo',
    'Honda', 'Negri', 'Pasquali', 'Segway', 'Snapper', 'Stihl', 'Volpi',
    'Weibang', 'Wortex', 'Worx', 'Altro'
  ],
  syncStatus: 'idle',
  lastSync: null,
  user: USERNAME,
  location: LOCATION,
  syncSubscription: null,

  // Inizializza app
  init: async () => {
    console.log('🚀 OMPRA Multi-Utente - Supabase');
    console.log('👤 User:', USERNAME);
    
    await get().fetchInventory();
    await get().fetchSales();
    await get().fetchCommissioni();
    
    // Migra commissioni da localStorage a Supabase (una tantum)
    await get().migrateLocalCommissioni();
    
    const subscription = supabase
      .channel('inventory-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'inventory' },
        () => {
          console.log('📡 Real-time update inventory');
          get().fetchInventory();
          get().fetchSales();
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'commissioni' },
        () => {
          console.log('📡 Real-time update commissioni');
          get().fetchCommissioni();
        }
      )
      .subscribe();
    
    set({ syncSubscription: subscription });
    console.log('✅ Real-time sync attivo');
  },

  cleanup: () => {
    const subscription = get().syncSubscription;
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  },

  // FETCH INVENTORY
  fetchInventory: async () => {
    set({ syncStatus: 'syncing' });
    
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      const latestItems = {};
      (data || []).forEach(item => {
        if (!latestItems[item.serialNumber] || 
            new Date(item.timestamp) > new Date(latestItems[item.serialNumber].timestamp)) {
          latestItems[item.serialNumber] = item;
        }
      });
      
      const inventory = Object.values(latestItems).filter(item => item.status === 'available');
      
      set({ 
        inventory,
        lastSync: new Date().toISOString(),
        syncStatus: 'success'
      });
      
      setTimeout(() => set({ syncStatus: 'idle' }), 2000);
      
    } catch (error) {
      console.error('❌ Fetch error:', error);
      set({ syncStatus: 'error' });
      setTimeout(() => set({ syncStatus: 'idle' }), 5000);
    }
  },

  // FETCH SALES
  fetchSales: async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('action', 'VENDITA')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      set({ sales: data || [] });
      
    } catch (error) {
      console.error('❌ Fetch sales error:', error);
    }
  },

  // FETCH COMMISSIONI da Supabase
  fetchCommissioni: async () => {
    try {
      const { data, error } = await supabase
        .from('commissioni')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      const commissioni = (data || []).map(commFromDb);
      set({ commissioni });
      
    } catch (error) {
      console.error('❌ Fetch commissioni error:', error);
    }
  },

  // Migrazione una tantum: localStorage → Supabase
  migrateLocalCommissioni: async () => {
    try {
      const saved = localStorage.getItem('ompra_commissioni');
      if (!saved) return;
      
      const local = JSON.parse(saved);
      if (!local || local.length === 0) return;
      
      // Controlla se sono già migrate (confronto ID)
      const existing = get().commissioni;
      const existingIds = new Set(existing.map(c => c.id));
      const toMigrate = local.filter(c => !existingIds.has(c.id));
      
      if (toMigrate.length === 0) {
        // Tutte già migrate, pulisci localStorage
        localStorage.removeItem('ompra_commissioni');
        console.log('✅ Commissioni già migrate, localStorage pulito');
        return;
      }
      
      console.log(`📦 Migrazione ${toMigrate.length} commissioni da localStorage a Supabase...`);
      
      const rows = toMigrate.map(commToDb);
      const { error } = await supabase
        .from('commissioni')
        .upsert(rows, { onConflict: 'id' });
      
      if (error) throw error;
      
      // Pulisci localStorage e ricarica
      localStorage.removeItem('ompra_commissioni');
      await get().fetchCommissioni();
      console.log(`✅ Migrazione completata: ${toMigrate.length} commissioni`);
      
    } catch (error) {
      console.error('❌ Migrazione commissioni error:', error);
      // Non cancellare localStorage se la migrazione fallisce
    }
  },

  findBySerialNumber: (serialNumber) => {
    return get().inventory.find(
      (item) => item.serialNumber === serialNumber && item.status === 'available'
    );
  },

  // CARICO BULK
  bulkAddInventory: async (products) => {
    set({ syncStatus: 'syncing' });
    
    try {
      const timestamp = new Date().toISOString();
      const rows = products.map(product => ({
        timestamp,
        action: 'CARICO',
        brand: product.brand,
        model: product.model,
        serialNumber: product.serialNumber,
        cliente: null,
        prezzo: null,
        totale: null,
        status: 'available',
        user: get().user,
        location: get().location
      }));
      
      const { error } = await supabase
        .from('inventory')
        .insert(rows);
      
      if (error) throw error;
      
      await get().fetchInventory();
      return true;
      
    } catch (error) {
      console.error('❌ Carico error:', error);
      set({ syncStatus: 'error' });
      alert('Errore durante il carico: ' + error.message);
      return false;
    }
  },

  // Scarica prodotto da inventario SENZA creare una vendita nello storico
  // Crea record SCARICO (non VENDITA) - serve solo per aggiornare lo stato inventario
  dischargeInventory: async (serialNumber, cliente) => {
    try {
      const product = get().inventory.find(i => i.serialNumber === serialNumber);
      
      await supabase
        .from('inventory')
        .insert({
          timestamp: new Date().toISOString(),
          action: 'SCARICO',
          brand: product?.brand || '',
          model: product?.model || '',
          serialNumber: serialNumber,
          cliente: cliente || '',
          prezzo: 0,
          totale: 0,
          status: 'sold',
          user: get().user,
          location: get().location
        });
      
      // Non aspettiamo fetchInventory qui - viene fatto dopo addGenericSale
    } catch (error) {
      console.warn('⚠️ Inventario non scaricato per SN:', serialNumber, error);
    }
  },

  // VENDITA
  sellProduct: async (serialNumber, saleData) => {
    const product = get().findBySerialNumber(serialNumber);

    set({ syncStatus: 'syncing' });
    
    try {
      const { error } = await supabase
        .from('inventory')
        .insert({
          timestamp: saleData.dataVendita || new Date().toISOString(),
          action: 'VENDITA',
          brand: product?.brand || saleData.brand || '',
          model: product?.model || saleData.model || '',
          serialNumber: serialNumber,
          cliente: saleData.cliente,
          prezzo: parseFloat(saleData.prezzo),
          totale: parseFloat(saleData.totale),
          status: 'sold',
          user: saleData.operatore || get().user,
          location: get().location
        });
      
      if (error) throw error;
      
      await get().fetchInventory();
      await get().fetchSales();
      return { success: true, product: { ...(product || {}), saleData } };
      
    } catch (error) {
      console.error('❌ Vendita error:', error);
      set({ syncStatus: 'error' });
      return { success: false, error: error.message };
    }
  },

  // Vendita generica senza matricola (accessori o macchine senza seriale)
  addGenericSale: async (saleData) => {
    set({ syncStatus: 'syncing' });
    
    try {
      const { error } = await supabase
        .from('inventory')
        .insert({
          timestamp: saleData.dataVendita || new Date().toISOString(),
          action: 'VENDITA',
          brand: saleData.brand || 'VARIE',
          model: saleData.model || saleData.descrizione || 'Vendita',
          serialNumber: saleData.serialNumber || `NOMAT-${Date.now()}`,
          cliente: saleData.cliente,
          prezzo: parseFloat(saleData.prezzo || saleData.totale),
          totale: parseFloat(saleData.totale),
          status: 'sold',
          user: saleData.operatore || get().user,
          location: get().location
        });
      
      if (error) throw error;
      
      await get().fetchSales();
      set({ syncStatus: 'success' });
      return { success: true };
      
    } catch (error) {
      console.error('❌ Vendita generica error:', error);
      set({ syncStatus: 'error' });
      return { success: false, error: error.message };
    }
  },

  // Modifica campi di una vendita
  updateSale: async (saleId, updates) => {
    set({ syncStatus: 'syncing' });
    
    try {
      // Mappa i campi del form ai campi Supabase
      const dbUpdates = {};
      if (updates.timestamp !== undefined) dbUpdates.timestamp = updates.timestamp;
      if (updates.brand !== undefined) dbUpdates.brand = updates.brand;
      if (updates.model !== undefined) dbUpdates.model = updates.model;
      if (updates.serialNumber !== undefined) dbUpdates.serialNumber = updates.serialNumber;
      if (updates.cliente !== undefined) dbUpdates.cliente = updates.cliente;
      if (updates.prezzo !== undefined) dbUpdates.prezzo = parseFloat(updates.prezzo) || 0;
      if (updates.totale !== undefined) dbUpdates.totale = parseFloat(updates.totale) || 0;
      if (updates.user !== undefined) dbUpdates.user = updates.user;
      
      const { error } = await supabase
        .from('inventory')
        .update(dbUpdates)
        .eq('id', saleId);
      
      if (error) throw error;
      
      await get().fetchSales();
      await get().fetchInventory();
      set({ syncStatus: 'success' });
      return { success: true };
      
    } catch (error) {
      console.error('❌ Errore modifica vendita:', error);
      set({ syncStatus: 'error' });
      return { success: false, error: error.message };
    }
  },

  // Elimina singola vendita
  deleteSale: async (saleId) => {
    set({ syncStatus: 'syncing' });
    
    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', saleId);
      
      if (error) throw error;
      
      await get().fetchSales();
      set({ syncStatus: 'success' });
      return { success: true };
      
    } catch (error) {
      console.error('❌ Errore eliminazione vendita:', error);
      set({ syncStatus: 'error' });
      return { success: false, error: error.message };
    }
  },

  // Elimina vendite multiple
  deleteMultipleSales: async (saleIds) => {
    set({ syncStatus: 'syncing' });
    
    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .in('id', saleIds);
      
      if (error) throw error;
      
      await get().fetchSales();
      set({ syncStatus: 'success' });
      return { success: true };
      
    } catch (error) {
      console.error('❌ Errore eliminazione vendite multiple:', error);
      set({ syncStatus: 'error' });
      return { success: false, error: error.message };
    }
  },

  // ============ COMMISSIONI ============

  // Crea nuova commissione (può essere senza matricola = in attesa)
  createCommissione: async (data) => {
    const createdAt = data.dataVendita || new Date().toISOString();
    const isCompleted = data.prodotti?.every(p => p.serialNumber);
    const commissione = {
      id: Date.now().toString(),
      createdAt,
      cliente: data.cliente,
      clienteInfo: data.clienteInfo || null,
      telefono: data.telefono || null,
      operatore: data.operatore || null,
      prodotti: data.prodotti || [],
      accessori: data.accessori || [],
      totale: data.totale,
      caparra: data.caparra || null,
      metodoPagamento: data.metodoPagamento || null,
      note: data.note || null,
      tipoDocumento: data.tipoDocumento || 'scontrino',
      ivaCompresa: data.ivaCompresa !== false,
      status: isCompleted ? 'completed' : 'pending',
      completedAt: isCompleted ? createdAt : null,
      user: get().user
    };
    
    try {
      const { error } = await supabase
        .from('commissioni')
        .insert(commToDb(commissione));
      
      if (error) throw error;
      
      // Aggiorna stato locale
      set({ commissioni: [commissione, ...get().commissioni] });
    } catch (error) {
      console.error('❌ Errore creazione commissione:', error);
      // Fallback: salva comunque localmente
      set({ commissioni: [commissione, ...get().commissioni] });
    }
    
    return commissione;
  },

  // Aggiorna commissione (es. aggiungi matricola)
  updateCommissione: async (id, updates) => {
    const commissioni = get().commissioni.map(c => {
      if (c.id === id) {
        const updated = { ...c, ...updates };
        if (updated.prodotti?.every(p => p.serialNumber)) {
          updated.status = 'completed';
          updated.completedAt = new Date().toISOString();
        }
        return updated;
      }
      return c;
    });
    
    // Aggiorna stato locale subito
    set({ commissioni });
    
    // Sync con Supabase
    const updated = commissioni.find(c => c.id === id);
    if (updated) {
      try {
        const { error } = await supabase
          .from('commissioni')
          .update(commToDb(updated))
          .eq('id', id);
        
        if (error) throw error;
      } catch (error) {
        console.error('❌ Errore update commissione:', error);
      }
    }
  },

  // Completa commissione e registra vendita
  completeCommissione: async (id) => {
    const commissione = get().commissioni.find(c => c.id === id);
    if (!commissione) return { success: false, error: 'Commissione non trovata' };
    
    // Verifica che tutti i prodotti abbiano matricola
    if (commissione.prodotti?.some(p => !p.serialNumber)) {
      return { success: false, error: 'Alcuni prodotti non hanno matricola' };
    }
    
    const dataISO = new Date().toISOString();
    
    // Scarica inventario per ogni prodotto con matricola
    for (const prod of commissione.prodotti || []) {
      if (prod.serialNumber) {
        try {
          await get().dischargeInventory(prod.serialNumber, commissione.cliente);
        } catch (e) {
          console.warn('Inventario non scaricato per SN:', prod.serialNumber, e);
        }
      }
    }
    
    // Aggiorna stato commissione (è l'unica fonte di verità)
    await get().updateCommissione(id, { 
      status: 'completed',
      completedAt: dataISO
    });
    
    return { success: true };
  },

  // Elimina commissione + vendita associata dallo storico
  deleteCommissione: async (id) => {
    const comm = get().commissioni.find(c => c.id === id);
    const commissioni = get().commissioni.filter(c => c.id !== id);
    set({ commissioni });
    
    try {
      // Elimina commissione da Supabase
      const { error } = await supabase
        .from('commissioni')
        .delete()
        .eq('id', id);
      if (error) throw error;
      
      // Elimina anche la vendita associata dallo storico
      if (comm && comm.cliente) {
        // Cerca vendita con stesso cliente e data simile (±1 giorno)
        const commDate = comm.completedAt || comm.createdAt;
        if (commDate) {
          const d = new Date(commDate);
          const dayStart = new Date(d);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(d);
          dayEnd.setHours(23, 59, 59, 999);
          
          const { data: matches } = await supabase
            .from('inventory')
            .select('id, serialNumber, cliente, timestamp')
            .eq('action', 'VENDITA')
            .eq('cliente', comm.cliente)
            .gte('timestamp', dayStart.toISOString())
            .lte('timestamp', dayEnd.toISOString());
          
          if (matches && matches.length > 0) {
            // Elimina i record VENDITA trovati (NOMAT e non)
            const ids = matches.map(m => m.id);
            await supabase
              .from('inventory')
              .delete()
              .in('id', ids);
            
            // Elimina anche eventuali record SCARICO associati
            const { data: scarichi } = await supabase
              .from('inventory')
              .select('id')
              .eq('action', 'SCARICO')
              .eq('cliente', comm.cliente)
              .gte('timestamp', dayStart.toISOString())
              .lte('timestamp', dayEnd.toISOString());
            
            if (scarichi && scarichi.length > 0) {
              await supabase
                .from('inventory')
                .delete()
                .in('id', scarichi.map(s => s.id));
            }
            
            console.log(`🗑️ Eliminati ${ids.length} record vendita + ${scarichi?.length || 0} scarichi per ${comm.cliente}`);
          }
        }
        
        await get().fetchSales();
        await get().fetchInventory();
      }
    } catch (error) {
      console.error('❌ Errore delete commissione:', error);
    }
  },

  // Elimina commissioni multiple
  deleteMultipleCommissioni: async (ids) => {
    const commissioni = get().commissioni.filter(c => !ids.includes(c.id));
    set({ commissioni });
    
    try {
      const { error } = await supabase
        .from('commissioni')
        .delete()
        .in('id', ids);
      if (error) throw error;
      await get().fetchCommissioni();
    } catch (error) {
      console.error('❌ Errore delete multiple commissioni:', error);
    }
  },

  // Recupera commissioni mancanti dallo storico vendite
  recoverMissingCommissioni: async () => {
    const sales = get().sales;
    await get().fetchCommissioni(); // Refresh prima
    const comms = get().commissioni;
    let recovered = 0;
    
    // Build set di commissioni esistenti per matching flessibile
    // Match per: cliente + totale (arrotondato) oppure cliente + data ±1 giorno
    const existingKeys = new Set();
    comms.forEach(c => {
      const clienteKey = (c.cliente || '').trim().toUpperCase();
      const totKey = Math.round((c.totale || 0) * 100);
      existingKeys.add(`${clienteKey}|${totKey}`);
      
      // Aggiungi anche match per date multiple (createdAt, completedAt)
      [c.createdAt, c.completedAt].filter(Boolean).forEach(d => {
        const dateStr = d.slice(0, 10);
        existingKeys.add(`${clienteKey}|${dateStr}`);
      });
    });
    
    for (const sale of sales) {
      if (!sale.cliente) continue;
      
      const clienteKey = sale.cliente.trim().toUpperCase();
      const totKey = Math.round((sale.prezzo || 0) * 100);
      const saleDateStr = (sale.timestamp || '').slice(0, 10);
      
      // Skip se esiste già (per totale O per data)
      if (existingKeys.has(`${clienteKey}|${totKey}`) || 
          existingKeys.has(`${clienteKey}|${saleDateStr}`)) {
        continue;
      }
      
      // Crea commissione da dati vendita
      const modelStr = sale.model || '';
      const items = modelStr.split(' + ').map(s => s.trim()).filter(Boolean);
      const prodotti = [];
      const accessori = [];
      
      items.forEach(item => {
        const snMatch = item.match(/\(SN:\s*([^)]+)\)/);
        const sn = snMatch ? snMatch[1].trim() : null;
        const cleanItem = item.replace(/\s*\(SN:\s*[^)]+\)/, '').trim();
        const qtaMatch = cleanItem.match(/\s+[x×](\d+)$/i);
        const qta = qtaMatch ? parseInt(qtaMatch[1]) : 1;
        const name = qtaMatch ? cleanItem.replace(/\s+[x×]\d+$/i, '').trim() : cleanItem;
        
        if (sn) {
          prodotti.push({
            brand: sale.brand || '',
            model: name.replace(new RegExp('^' + (sale.brand || '') + '\\s*', 'i'), ''),
            serialNumber: sn,
            prezzo: prodotti.length === 0 && items.length === 1 ? (sale.prezzo || 0) : 0,
            aliquotaIva: 22
          });
        } else {
          accessori.push({
            nome: name,
            prezzo: 0,
            quantita: qta,
            aliquotaIva: 22
          });
        }
      });
      
      if (prodotti.length === 0 && accessori.length === 0) {
        prodotti.push({
          brand: sale.brand || '',
          model: modelStr || 'Vendita',
          serialNumber: null,
          prezzo: sale.prezzo || 0,
          aliquotaIva: 22
        });
      }
      
      const newComm = {
        id: `recovered-${sale.id}`,
        createdAt: sale.timestamp,
        cliente: sale.cliente,
        clienteInfo: null,
        telefono: null,
        operatore: sale.user || null,
        prodotti,
        accessori,
        totale: sale.prezzo || 0,
        caparra: null,
        metodoPagamento: null,
        note: null,
        tipoDocumento: 'scontrino',
        ivaCompresa: true,
        status: 'completed',
        completedAt: sale.timestamp,
        user: sale.user || null
      };
      
      try {
        const { error } = await supabase
          .from('commissioni')
          .upsert(commToDb(newComm), { onConflict: 'id' });
        
        if (!error) {
          recovered++;
          // Aggiungi alla set per evitare doppi nella stessa sessione
          existingKeys.add(`${clienteKey}|${totKey}`);
          existingKeys.add(`${clienteKey}|${saleDateStr}`);
        }
      } catch (e) {
        console.warn('Skip recovery per:', sale.cliente, e);
      }
    }
    
    if (recovered > 0) {
      await get().fetchCommissioni();
      console.log(`✅ Recuperate ${recovered} commissioni dallo storico`);
    }
    
    return recovered;
  },

  // Pulisci commissioni duplicate (solo tra completate, MAI tocca le pending)
  cleanDuplicateCommissioni: async () => {
    await get().fetchCommissioni();
    const comms = get().commissioni;
    const seen = new Map(); // key → first commission id
    const toDelete = [];
    
    // Solo completate, ordinate per createdAt ASC (tieni la più vecchia)
    const completed = comms.filter(c => c.status === 'completed');
    const sorted = [...completed].sort((a, b) => 
      (a.createdAt || '').localeCompare(b.createdAt || '')
    );
    
    sorted.forEach(c => {
      const key = `${(c.cliente || '').trim().toUpperCase()}|${Math.round((c.totale || 0) * 100)}`;
      if (seen.has(key)) {
        toDelete.push(c.id);
      } else {
        seen.set(key, c.id);
      }
    });
    
    if (toDelete.length === 0) return 0;
    
    // Elimina duplicati in batch
    for (const id of toDelete) {
      try {
        await supabase.from('commissioni').delete().eq('id', id);
      } catch (e) {
        console.warn('Errore pulizia:', id, e);
      }
    }
    
    await get().fetchCommissioni();
    console.log(`🧹 Eliminati ${toDelete.length} duplicati`);
    return toDelete.length;
  },

  // Getter commissioni pendenti
  getPendingCommissioni: () => {
    return get().commissioni.filter(c => c.status === 'pending');
  },

  // Getter commissioni completate
  getCompletedCommissioni: () => {
    return get().commissioni.filter(c => c.status === 'completed');
  },

  // ============ FINE COMMISSIONI ============

  // Segna manualmente un prodotto come venduto (pulizia giacenze fantasma)
  // Rimuove il record CARICO dalla giacenza — la vendita vera esiste già nello storico
  markAsSold: async (serialNumber) => {
    set({ syncStatus: 'syncing' });
    
    try {
      // Elimina tutti i record con questa matricola (CARICO)
      // Se esiste già una VENDITA con questa matricola, la manteniamo
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('serialNumber', serialNumber)
        .eq('action', 'CARICO');
      
      if (error) throw error;
      
      await get().fetchInventory();
      set({ syncStatus: 'success' });
      return { success: true };
      
    } catch (error) {
      console.error('❌ Mark as sold error:', error);
      set({ syncStatus: 'error' });
      return { success: false, error: error.message };
    }
  },

  // Elimina multipli prodotti da inventario (per serialNumber)
  deleteMultipleItems: async (serialNumbers) => {
    set({ syncStatus: 'syncing' });
    
    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .in('serialNumber', serialNumbers);
      
      if (error) throw error;
      
      await get().fetchInventory();
      await get().fetchSales();
      set({ syncStatus: 'success' });
      return true;
      
    } catch (error) {
      console.error('❌ Delete multiple items error:', error);
      set({ syncStatus: 'error' });
      alert('Errore durante eliminazione: ' + error.message);
      return false;
    }
  },

  // ELIMINA SINGOLO PRODOTTO
  deleteItem: async (serialNumber) => {
    set({ syncStatus: 'syncing' });
    
    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('serialNumber', serialNumber);
      
      if (error) throw error;
      
      await get().fetchInventory();
      await get().fetchSales();
      return true;
      
    } catch (error) {
      console.error('❌ Delete error:', error);
      set({ syncStatus: 'error' });
      alert('Errore durante eliminazione: ' + error.message);
      return false;
    }
  },

  // AZZERA TUTTO IL MAGAZZINO
  clearInventory: async () => {
    set({ syncStatus: 'syncing' });
    
    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .neq('id', 0);
      
      if (error) throw error;
      
      set({ inventory: [], sales: [], syncStatus: 'success' });
      return true;
      
    } catch (error) {
      console.error('❌ Clear error:', error);
      set({ syncStatus: 'error' });
      alert('Errore durante azzeramento: ' + error.message);
      return false;
    }
  }
}));

export default useStore;
