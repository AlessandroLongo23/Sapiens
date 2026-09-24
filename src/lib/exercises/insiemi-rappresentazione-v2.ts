import { insiemiRappresentazione } from './v2/generators/insiemi-rappresentazione';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. */
export const InsiemiRappresentazioneV2 = legacyExercise(insiemiRappresentazione);
