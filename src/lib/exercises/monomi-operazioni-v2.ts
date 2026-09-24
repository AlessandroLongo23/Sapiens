import { monomiOperazioni } from './v2/generators/monomi-operazioni';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. Replaces monomi-operazioni.js. */
export const MonomiOperazioniV2 = legacyExercise(monomiOperazioni);
