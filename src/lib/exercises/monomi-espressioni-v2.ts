import { monomiEspressioni } from './v2/generators/monomi-espressioni';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. Replaces monomi-espressioni.js. */
export const MonomiEspressioniV2 = legacyExercise(monomiEspressioni);
