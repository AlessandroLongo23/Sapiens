import { primeDefinizioni } from './v2/generators/prime-definizioni';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. */
export const PrimeDefinizioniV2 = legacyExercise(primeDefinizioni);
