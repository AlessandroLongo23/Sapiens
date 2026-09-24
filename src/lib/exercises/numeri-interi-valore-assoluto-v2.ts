import { numeriInteriValoreAssoluto } from './v2/generators/numeri-interi-valore-assoluto';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. */
export const NumeriInteriValoreAssolutoV2 = legacyExercise(numeriInteriValoreAssoluto);
