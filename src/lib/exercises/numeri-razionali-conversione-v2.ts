import { numeriRazionaliConversione } from './v2/generators/numeri-razionali-conversione';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. Replaces numeri-razionali-conversione.js. */
export const NumeriRazionaliConversioneV2 = legacyExercise(numeriRazionaliConversione);
