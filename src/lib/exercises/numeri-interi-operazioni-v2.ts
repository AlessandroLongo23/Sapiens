import { numeriInteriOperazioni } from './v2/generators/numeri-interi-operazioni';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. */
export const NumeriInteriOperazioniV2 = legacyExercise(numeriInteriOperazioni);
