import { sottoinsiemiUgualianza } from './v2/generators/sottoinsiemi-ugualianza';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. */
export const SottoinsiemiUgualianzaV2 = legacyExercise(sottoinsiemiUgualianza);
