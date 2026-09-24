import { monomiGrado } from './v2/generators/monomi-grado';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level. Replaces monomi-grado.ts. */
export const MonomiGradoV2 = legacyExercise(monomiGrado);
