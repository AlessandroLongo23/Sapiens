import { equazioniPrimoGrado } from './v2/generators/equazioni-primo-grado';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. Replaces equazioni-primo-grado.js. */
export const EquazioniPrimoGradoV2 = legacyExercise(equazioniPrimoGrado);
