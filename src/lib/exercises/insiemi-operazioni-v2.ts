import { insiemiOperazioni } from './v2/generators/insiemi-operazioni';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. Replaces insiemi-operazioni.js. */
export const InsiemiOperazioniV2 = legacyExercise(insiemiOperazioni);
