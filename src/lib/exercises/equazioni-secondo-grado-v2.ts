import { equazioniSecondoGrado } from './v2/generators/equazioni-secondo-grado';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. Replaces equazioni-secondo-grado.js. */
export const EquazioniSecondoGradoV2 = legacyExercise(equazioniSecondoGrado);
