import { numeriRazionaliFrazioni } from './v2/generators/numeri-razionali-frazioni';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. */
export const NumeriRazionaliFrazioniV2 = legacyExercise(numeriRazionaliFrazioni);
