import { numeriNaturaliDivisibilita } from './v2/generators/numeri-naturali-divisibilita';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. */
export const NumeriNaturaliDivisibilitaV2 = legacyExercise(numeriNaturaliDivisibilita);
