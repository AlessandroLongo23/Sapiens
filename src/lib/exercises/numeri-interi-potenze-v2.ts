import { numeriInteriPotenze } from './v2/generators/numeri-interi-potenze';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. */
export const NumeriInteriPotenzeV2 = legacyExercise(numeriInteriPotenze);
