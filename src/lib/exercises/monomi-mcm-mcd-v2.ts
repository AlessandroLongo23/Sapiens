import { monomiMcmMcd } from './v2/generators/monomi-mcm-mcd';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. Replaces monomi-mcm-mcd.js. */
export const MonomiMcmMcdV2 = legacyExercise(monomiMcmMcd);
