/**
 * Permessi: quali schermate vede un operatore.
 *
 * Due assi indipendenti:
 *  - RUOLO   governa COSA MOSTRANO le schermate (costi, prezzi, margini)
 *  - MODULI  governa QUALI schermate si vedono
 *
 * operatori.moduli = NULL  -> si applica il set di default del ruolo
 * operatori.moduli = [...] -> vale esattamente quell'elenco
 *
 * ATTENZIONE: questo e' un filtro di interfaccia, non una barriera di
 * sicurezza. L'app usa la anon key di Supabase, che e' pubblica. Chi la
 * conosce puo' interrogare il database direttamente. Per una protezione
 * reale servirebbero Supabase Auth e policy RLS per ruolo.
 */

/* ── Registro moduli, allineato ai case di App.jsx ── */
export const MODULI = [
  'carico',
  'vendita',
  'giacenze',
  'storico',
  'archivio-commissioni',
  'listini',
  'politiche-commerciali',
  'budget',
  'budget-admin',
  'pratovivo',
  'sopralluogo',
  'noleggio',
  'rubrica-clienti',
  'stihl',
  'preventivi',
  'compilatore-prev',
  'catalogo-prodotti',
  'antizanzare',
];

/* Sottomoduli antizanzare: match per prefisso.
   Chi ha 'antizanzare' ha tutto; chi ha 'antizanzare.consuntivo' solo quello. */
export const SOTTOMODULI = [
  'antizanzare.progetti',
  'antizanzare.impianto',
  'antizanzare.consuntivo',
  'antizanzare.preventivo',
  'antizanzare.listini',
];

export const RUOLI = ['admin', 'commerciale', 'tecnico'];

export const ETICHETTE_RUOLO = {
  admin: 'Admin',
  commerciale: 'Commerciale',
  tecnico: 'Tecnico montatore',
};

/* ── Default per ruolo ──
 * Attenzione alla semantica del match per prefisso: avere il modulo padre
 * ('antizanzare') concede automaticamente TUTTI i suoi sottomoduli. Per
 * escluderne uno non basta toglierlo dall'elenco: bisogna togliere anche il
 * padre ed elencare esplicitamente i figli consentiti. E' quello che serve al
 * commerciale, che deve restare fuori da 'antizanzare.listini'.
 */
const SOLO_ADMIN = ['budget-admin', 'antizanzare.listini'];

const DEFAULT_RUOLO = {
  admin: [...MODULI, ...SOTTOMODULI],

  commerciale: [
    ...MODULI.filter((m) => m !== 'antizanzare' && !SOLO_ADMIN.includes(m)),
    ...SOTTOMODULI.filter((m) => !SOLO_ADMIN.includes(m)),
  ],

  tecnico: ['antizanzare.progetti', 'antizanzare.consuntivo'],
};

/**
 * Elenco effettivo dei moduli di un operatore.
 * @param {{ruolo?:string, moduli?:string[]|null}} operatore
 */
export function moduliDi(operatore) {
  const ruolo = operatore?.ruolo || 'commerciale';
  const espliciti = operatore?.moduli;
  if (Array.isArray(espliciti) && espliciti.length > 0) return espliciti;
  return DEFAULT_RUOLO[ruolo] || DEFAULT_RUOLO.commerciale;
}

/**
 * L'operatore puo' aprire questo modulo?
 * Il match e' per prefisso puntato: 'antizanzare' abilita 'antizanzare.consuntivo',
 * e viceversa avere un sottomodulo abilita l'ingresso nel modulo padre.
 */
export function puoAccedere(operatore, moduloId) {
  if (!moduloId) return false;
  const consentiti = moduliDi(operatore);

  return consentiti.some(
    (m) =>
      m === moduloId ||
      moduloId.startsWith(`${m}.`) || // ha il padre, chiede un figlio
      m.startsWith(`${moduloId}.`) // ha un figlio, chiede il padre
  );
}

/** Il ruolo puo' vedere costi d'acquisto, prezzi di vendita e margini? */
export function vedePrezzi(operatore) {
  return (operatore?.ruolo || 'commerciale') !== 'tecnico';
}

/** Primo modulo da aprire al login. Per il tecnico non e' la Dashboard. */
export function paginaIniziale(operatore) {
  if ((operatore?.ruolo || '') === 'tecnico') return 'antizanzare';
  return 'home';
}

/** true se l'operatore non deve mai vedere la Dashboard generale. */
export function bloccatoSuModulo(operatore) {
  return !puoAccedere(operatore, 'vendita') && puoAccedere(operatore, 'antizanzare');
}
