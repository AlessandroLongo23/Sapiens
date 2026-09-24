import { insiemiUnione } from './v2/generators/insiemi-unione';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. */
export const InsiemiUnioneV2 = legacyExercise(insiemiUnione);
