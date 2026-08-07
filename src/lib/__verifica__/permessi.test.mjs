/**
 * Verifica dei permessi.
 * Uso:  node src/lib/__verifica__/permessi.test.mjs
 *
 * La regola piu' importante e' l'ultima sezione: dopo la migration nessun
 * operatore gia' esistente deve perdere l'accesso a moduli che usava.
 */

import {
  puoAccedere, vedePrezzi, paginaIniziale, bloccatoSuModulo, MODULI, SOTTOMODULI,
} from '../permessi.js';

const admin = { nome: 'Admin', ruolo: 'admin', moduli: null };
const comm = { nome: 'Simone', ruolo: 'commerciale', moduli: null };
const tec = { nome: 'Marco', ruolo: 'tecnico', moduli: null };
const misto = { nome: 'Luca', ruolo: 'tecnico', moduli: ['antizanzare.consuntivo', 'carico'] };

let ko = 0;
const t = (etichetta, atteso, ottenuto) => {
  const ok = atteso === ottenuto;
  if (!ok) ko++;
  console.log(
    (ok ? '  ' : '✗ ') + etichetta.padEnd(58) + (ok ? 'ok' : `ATTESO ${atteso}, OTTENUTO ${ottenuto}`)
  );
};

console.log('\n— Admin —');
t('vede tutti i moduli', true, MODULI.every((x) => puoAccedere(admin, x)));
t('vede tutti i sottomoduli', true, SOTTOMODULI.every((x) => puoAccedere(admin, x)));
t('vede prezzi', true, vedePrezzi(admin));
t('parte dalla home', 'home', paginaIniziale(admin));
t('non e bloccato su un modulo', false, bloccatoSuModulo(admin));

console.log('\n— Commerciale —');
t('vede listini', true, puoAccedere(comm, 'listini'));
t('vede politiche commerciali', true, puoAccedere(comm, 'politiche-commerciali'));
t('vede vendita', true, puoAccedere(comm, 'vendita'));
t('entra in antizanzare', true, puoAccedere(comm, 'antizanzare'));
t('usa i progetti antizanzare', true, puoAccedere(comm, 'antizanzare.progetti'));
t('NON vede budget-admin', false, puoAccedere(comm, 'budget-admin'));
t('NON aggiorna i listini antizanzare', false, puoAccedere(comm, 'antizanzare.listini'));
t('usa il calcolatore consumi', true, puoAccedere(comm, 'antizanzare.consumi'));
t('vede prezzi', true, vedePrezzi(comm));
t('parte dalla home', 'home', paginaIniziale(comm));
t('non e bloccato su un modulo', false, bloccatoSuModulo(comm));

console.log('\n— Tecnico —');
t('entra in antizanzare', true, puoAccedere(tec, 'antizanzare'));
t('vede il consuntivo', true, puoAccedere(tec, 'antizanzare.consuntivo'));
t('NON configura l impianto', false, puoAccedere(tec, 'antizanzare.impianto'));
/* Il calcolatore consumi parla di prezzi e costi di gestione: e' materia
   commerciale, non da cantiere. */
t('NON vede il calcolatore consumi', false, puoAccedere(tec, 'antizanzare.consumi'));
t('NON vede vendita', false, puoAccedere(tec, 'vendita'));
t('NON vede magazzino', false, puoAccedere(tec, 'giacenze'));
t('NON vede la rubrica', false, puoAccedere(tec, 'rubrica-clienti'));
t('NON vede prezzi', false, vedePrezzi(tec));
t('parte da antizanzare', 'antizanzare', paginaIniziale(tec));
t('e bloccato sul modulo', true, bloccatoSuModulo(tec));

console.log('\n— Whitelist per operatore (deroga sul singolo) —');
t('vede il consuntivo', true, puoAccedere(misto, 'antizanzare.consuntivo'));
t('entra nel modulo padre', true, puoAccedere(misto, 'antizanzare'));
t('vede carico', true, puoAccedere(misto, 'carico'));
t('NON vede i progetti', false, puoAccedere(misto, 'antizanzare.progetti'));
t('NON vede vendita', false, puoAccedere(misto, 'vendita'));
t('NON vede prezzi (resta tecnico)', false, vedePrezzi(misto));

console.log('\n— Casi limite —');
t('modulo inesistente negato', false, puoAccedere(admin, 'inventato'));
t('modulo vuoto negato', false, puoAccedere(admin, ''));
t('moduli array vuoto = default del ruolo', true, puoAccedere({ ruolo: 'commerciale', moduli: [] }, 'vendita'));
t('operatore null non vede budget-admin', false, puoAccedere(null, 'budget-admin'));

console.log('\n— Nessuna regressione per chi c era prima —');
// Admin e Simone/Stefano avevano accesso a tutto tranne le sezioni admin
const primaAvevanoAccesso = MODULI.filter((m) => m !== 'budget-admin' && m !== 'antizanzare');
t(
  'il commerciale conserva ogni modulo che usava',
  true,
  primaAvevanoAccesso.every((m) => puoAccedere(comm, m))
);
t('l admin conserva tutto', true, MODULI.every((m) => puoAccedere(admin, m)));

console.log('\n' + '─'.repeat(72));
console.log(ko === 0 ? '✅ PERMESSI OK' : `❌ ${ko} verifiche fallite`);
process.exit(ko === 0 ? 0 : 1);
