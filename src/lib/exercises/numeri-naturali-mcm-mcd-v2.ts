import { numeriNaturaliMcmMcd } from './v2/generators/numeri-naturali-mcm-mcd';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. Replaces numeri-naturali-mcm-mcd.ts. */
export const NumeriNaturaliMcmMcdV2 = legacyExercise(numeriNaturaliMcmMcd);
