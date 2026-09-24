import { numeriRazionaliConfrontoFrazioni } from './v2/generators/numeri-razionali-confronto-frazioni';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. Replaces numeri-razionali-confronto-frazioni.ts. */
export const NumeriRazionaliConfrontoFrazioniV2 = legacyExercise(numeriRazionaliConfrontoFrazioni);
