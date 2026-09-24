import { numeriNaturaliOperazioni } from './v2/generators/numeri-naturali-operazioni';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. Replaces numeri-naturali-operazioni.ts. */
export const NumeriNaturaliOperazioniV2 = legacyExercise(numeriNaturaliOperazioni);
