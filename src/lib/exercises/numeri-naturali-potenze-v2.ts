import { numeriNaturaliPotenze } from './v2/generators/numeri-naturali-potenze';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. Replaces numeri-naturali-potenze.ts. */
export const NumeriNaturaliPotenzeV2 = legacyExercise(numeriNaturaliPotenze);
