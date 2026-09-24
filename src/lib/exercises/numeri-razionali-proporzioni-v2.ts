import { numeriRazionaliProporzioni } from './v2/generators/numeri-razionali-proporzioni';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. */
export const NumeriRazionaliProporzioniV2 = legacyExercise(numeriRazionaliProporzioni);
