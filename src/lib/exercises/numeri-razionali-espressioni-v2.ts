import { numeriRazionaliEspressioni } from './v2/generators/numeri-razionali-espressioni';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. Replaces numeri-razionali-espressioni.js, which was never finished. */
export const NumeriRazionaliEspressioniV2 = legacyExercise(numeriRazionaliEspressioni);
