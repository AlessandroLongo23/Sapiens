import { numeriRazionaliPotenze } from './v2/generators/numeri-razionali-potenze';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. Replaces numeri-razionali-potenze.ts. */
export const NumeriRazionaliPotenzeV2 = legacyExercise(numeriRazionaliPotenze);
