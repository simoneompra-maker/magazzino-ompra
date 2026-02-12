import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';

// CONFIGURAZIONE SUPABASE
const SUPABASE_URL = 'https://eoswkplehhmtxtattsha.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvc3drcGxlaGhtdHh0YXR0c2hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2MTY3NzcsImV4cCI6MjA4MjE5Mjc3N30.cUg61XjJf2fmTi6dAQ2EaBl49pRrtgBTN7A2EyMyvLI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const USERNAME = localStorage.getItem('ompra_user') || 'user_' + Date.now();
const LOCATION = 'main';

localStorage.setItem('ompra_user', USERNAME);

// Carica commissioni da localStorage
const loadCommissioni = () => {
  try {
    const saved = localStorage.getItem('ompra_commissioni');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Salva commissioni in localStorage
const saveCommissioni = (commissioni) => {
  localStorage.setItem('ompra_commissioni', JSON.stringify(commissioni));
};

const useStore = create((set, get) => ({
  // Stato
  inventory: [],
  sales: [],
  commissioni: loadCommissioni(), // Commissioni (pendenti e completate)
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
    
    const subscription = supabase
      .channel('inventory-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'inventory' },
        () => {
          console.log('📡 Real-time update received');
          get().fetchInventory();
          get().fetchSales();
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
  createCommissione: (data) => {
    const commissione = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      cliente: data.cliente,
      clienteInfo: data.clienteInfo || null, // Info cliente dal database
      telefono: data.telefono || null,
      operatore: data.operatore || null,
      prodotti: data.prodotti || [], // Array di { brand, model, tipo, serialNumber (opzionale), prezzo }
      accessori: data.accessori || [],
      totale: data.totale,
      caparra: data.caparra || null,
      metodoPagamento: data.metodoPagamento || null,
      note: data.note || null,
      tipoDocumento: data.tipoDocumento || 'scontrino', // 'scontrino' | 'fattura'
      status: data.prodotti?.some(p => !p.serialNumber) ? 'pending' : 'completed',
      completedAt: data.prodotti?.every(p => p.serialNumber) ? new Date().toISOString() : null,
      user: get().user
    };
    
    const commissioni = [...get().commissioni, commissione];
    saveCommissioni(commissioni);
    set({ commissioni });
    
    return commissione;
  },

  // Aggiorna commissione (es. aggiungi matricola)
  updateCommissione: (id, updates) => {
    const commissioni = get().commissioni.map(c => {
      if (c.id === id) {
        const updated = { ...c, ...updates };
        // Se tutti i prodotti hanno matricola, segna come completata
        if (updated.prodotti?.every(p => p.serialNumber)) {
          updated.status = 'completed';
          updated.completedAt = new Date().toISOString();
        }
        return updated;
      }
      return c;
    });
    
    saveCommissioni(commissioni);
    set({ commissioni });
  },

  // Completa commissione e registra vendita
  completeCommissione: async (id) => {
    const commissione = get().commissioni.find(c => c.id === id);
    if (!commissione) return { success: false, error: 'Commissione non trovata' };
    
    // Verifica che tutti i prodotti abbiano matricola
    if (commissione.prodotti.some(p => !p.serialNumber)) {
      return { success: false, error: 'Alcuni prodotti non hanno matricola' };
    }
    
    // Registra vendite per ogni prodotto
    for (const prod of commissione.prodotti) {
      // Prima carica il prodotto se non esiste
      const existing = get().findBySerialNumber(prod.serialNumber);
      if (!existing) {
        await get().bulkAddInventory([{
          brand: prod.brand,
          model: prod.model,
          serialNumber: prod.serialNumber
        }]);
      }
      
      // Poi vendi
      await get().sellProduct(prod.serialNumber, {
        cliente: commissione.cliente,
        prezzo: prod.prezzo,
        totale: commissione.totale
      });
    }
    
    // Aggiorna stato commissione
    get().updateCommissione(id, { 
      status: 'completed',
      completedAt: new Date().toISOString()
    });
    
    return { success: true };
  },

  // Elimina commissione
  deleteCommissione: (id) => {
    const commissioni = get().commissioni.filter(c => c.id !== id);
    saveCommissioni(commissioni);
    set({ commissioni });
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
