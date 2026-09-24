import { funzioniIniettiveSuriettiveBiettive } from './v2/generators/funzioni-iniettive-suriettive-biettive';
import { legacyExercise } from './v2/legacy';

/** The v2 generator behind the multiple-choice page; config.ts passes the level (1-6). */
export const FunzioniIniettiveSuriettiveBiettiveV2 = legacyExercise(funzioniIniettiveSuriettiveBiettive);
