import type { AnswerForm, OpenGrading } from './types';

/**
 * Which levels of the maths lessons take an open answer, and what it is graded on: the value, or the value and the
 * form where the form is the exercise (vault/Decisioni/2026-09-30 Nella risposta aperta la forma conta solo dove è
 * l'esercizio.md). A level that is not here stays multiple choice, and so does a sample whose answer is a choice.
 *
 * Classified on 30 September 2026 from each level's prompts and samples. The general rules:
 * - numbers and sets of numbers: `V`, the value; a number must still be written as a number;
 * - an expression whose sample declares a form: `F`, that form;
 * - monomials and polynomials computed without a declared form: `expanded`, or the problem copied would pass;
 * - a lesson's "Calcola e semplifica" on algebraic fractions: `irreducible`, though the samples say `factored`: a
 *   denominator multiplied out is not the mistake the exercise is about;
 * - domains and conditions of existence: `EXCLUDED`, the values left out.
 * Levels whose writing is in doubt are in vault/Contenuti/Domande per Andrea.md.
 */
const V: OpenGrading = { grade: 'value' };
const F: OpenGrading = { grade: 'form' };
const EXCLUDED: OpenGrading = { grade: 'value', set: 'excluded' };
const form = (f: AnswerForm): OpenGrading => ({ grade: 'form', form: f });

export const openAnswers: Record<string, Record<number, OpenGrading>> = {
	'prime-definizioni': { 5: V },
	'insiemi-rappresentazione': { 1: V, 2: V, 3: V, 4: V },
	'sottoinsiemi-ugualianza': { 4: V },
	'insiemi-unione': { 1: V, 2: V, 3: V, 4: V, 5: V, 6: V },
	'insiemi-operazioni': { 1: V, 2: V, 3: V, 4: V, 5: V, 6: V },
	'numeri-naturali-operazioni': { 3: V, 4: V, 5: V, 6: V, 7: V },
	'numeri-naturali-mcm-mcd': { 3: V, 4: V, 5: V, 6: V },
	'numeri-naturali-potenze': { 1: V, 2: V, 3: V, 4: V, 5: V },
	'numeri-razionali-potenze': { 1: V, 2: V, 3: V, 4: V, 5: V, 6: V },
	'numeri-razionali-conversione': { 1: form('irreducible'), 2: form('irreducible'), 3: form('irreducible'), 5: form('decimal') },
	'monomi-grado': { 1: V, 2: V, 3: V, 4: V, 5: V, 6: V },
	'monomi-operazioni': { 1: form('expanded'), 2: form('expanded'), 3: form('expanded'), 4: form('expanded'), 5: form('expanded'), 6: form('expanded') },
	'monomi-mcm-mcd': { 1: form('expanded'), 2: form('expanded'), 3: form('expanded'), 4: form('expanded'), 5: form('expanded') },
	'monomi-espressioni': { 1: form('expanded'), 2: form('expanded'), 3: form('expanded'), 4: form('expanded'), 5: form('expanded') },
	'equazioni-primo-grado': { 1: V, 2: V, 3: V, 4: V, 5: V, 6: V, 7: V },
	'equazioni-secondo-grado': { 1: V, 2: V, 3: V, 4: V, 5: V, 6: V },
	'funzioni-iniettive-suriettive-biettive': { 1: V, 6: V },
	'numeri-naturali-divisibilita': { 3: V, 5: F, 6: V },
	'numeri-interi-valore-assoluto': { 6: V },
	'numeri-interi-operazioni': { 1: V, 2: V, 3: V, 4: V, 5: V, 6: V },
	'numeri-interi-potenze': { 1: V, 2: V, 3: V, 4: V, 5: V, 6: V },
	'numeri-razionali-frazioni': { 1: V, 2: V, 5: F, 6: F },
	'numeri-razionali-operazioni': { 1: V, 2: V, 3: V, 4: V, 5: V, 6: V, 7: V },
	'numeri-razionali-espressioni': { 1: V, 2: V, 3: V, 4: V, 5: V, 6: V },
	'numeri-razionali-proporzioni': { 1: form('irreducible'), 2: V, 3: V, 4: V, 5: V, 6: V, 7: V },
	'monomi': { 1: form('expanded'), 3: form('expanded'), 4: form('expanded'), 5: V, 6: V },
	'polinomi': { 1: F, 2: F, 3: F, 4: V, 5: V, 7: V },
	'polinomi-operazioni': { 1: F, 2: F, 3: F, 4: F, 5: F, 6: F, 7: F },
	'polinomi-prodotti-notevoli': { 1: F, 2: F, 3: F, 4: F, 5: F, 6: F, 7: F },
	'polinomi-espressioni': { 1: F, 2: F, 3: F, 4: F, 5: F, 6: F, 7: F },
	'polinomi-ruffini': { 5: V, 7: V },
	'scomposizione-raccoglimento': { 1: F, 2: F, 3: F, 4: F, 5: F, 6: F },
	'scomposizione-prodotti-notevoli': { 1: F, 2: F, 3: F, 4: F, 5: F, 6: F },
	'scomposizione-trinomio': { 1: F, 2: F, 3: F, 4: F, 5: F, 6: F, 7: F },
	'scomposizione-ruffini': { 2: F, 3: F, 4: F, 5: F, 6: F },
	'polinomi-mcd-mcm': { 1: F, 2: F, 3: F, 4: F, 5: F, 6: F, 7: F },
	'insiemi-prodotto-cartesiano': { 3: V },
	'relazioni-binarie': { 3: V },
	'definizione-funzione': { 2: V, 3: V, 4: V, 6: F },
	'dominio-codominio-immagine': { 1: V, 2: V, 3: V, 4: EXCLUDED, 5: EXCLUDED, 6: EXCLUDED },
	'composizione-di-funzioni': { 2: V, 3: F, 4: F, 5: V, 6: V },
	'funzioni-lineari': { 2: V, 3: V, 5: form('explicit'), 6: V, 7: V },
	'frazioni-algebriche-esistenza': { 1: V, 2: EXCLUDED, 3: EXCLUDED, 4: EXCLUDED, 5: EXCLUDED, 6: EXCLUDED, 7: EXCLUDED },
	'frazioni-algebriche-semplificazione': { 1: F, 2: F, 3: F, 4: F, 5: F, 6: F },
	'frazioni-algebriche-operazioni': { 1: form('irreducible'), 2: form('irreducible'), 3: form('irreducible'), 4: form('irreducible'), 5: form('irreducible'), 6: form('irreducible'), 7: form('irreducible') },
	'equazioni-fratte': { 1: V, 2: V, 3: V, 4: V, 5: V },
	'equazioni-letterali': { 1: V, 6: V, 7: V },
	'equazioni-problemi': { 1: V, 2: V, 3: V, 4: V, 5: V },
	'disequazioni-primo-grado': { 7: V },
	'statistica-dati': { 3: V, 4: V, 5: V, 6: V, 7: V },
	'statistica-medie': { 1: V, 2: V, 3: V, 4: V, 5: V, 7: V },
	'statistica-variabilita': { 1: V, 3: V, 4: V, 5: V, 6: V },
	'geometria-enti': { 1: V, 4: V, 6: V, 7: V },
	'angoli-e-lati-dei-triangoli': { 6: V, 7: V },
	'geometria-perpendicolari-parallele': { 2: V, 4: V, 5: V, 6: V, 7: V },
	'geometria-punti-notevoli': { 2: V, 4: V, 5: V, 6: V, 7: V },
	'geometria-quadrilateri': { 1: V, 2: V, 3: V, 4: V },
	'insiemi-intersezione': { 1: V, 2: V, 3: V, 4: V, 5: V, 6: V },
	'insiemi-differenza': { 1: V, 2: V, 3: V, 4: V, 5: V, 6: V, 7: V },
	'logica-proposizioni': { 4: V, 5: V },
	'logica-implicazione': { 6: V },
	'logica-quantificatori': { 2: V },
	'sistemi-cramer': { 1: V, 4: V, 6: V },
	'sistemi-problemi': { 4: V, 5: V },
	'numeri-reali-irrazionali': { 3: V, 4: V, 7: form('simplified') },
	'numeri-reali-radici': { 1: V, 3: form('simplified'), 4: F, 5: F },
	'radicali-operazioni': { 1: F, 2: F, 3: F, 5: F, 6: F, 7: F },
	'radicali-razionalizzazione': { 1: F, 2: F, 3: F, 4: F, 5: F, 6: F, 7: F },
	'numeri-reali-espressioni': { 1: F, 2: F, 3: F, 4: F, 5: F, 6: V },
	'radicali-esponente-razionale': { 1: F, 2: V, 3: V, 4: F, 5: V, 6: F, 7: F },
	'equazioni-secondo-grado-relazioni': { 2: V, 4: V, 5: F, 7: V },
	'equazioni-secondo-grado-problemi': { 1: V, 3: V, 5: V, 6: V, 7: V },
	'il-piano-cartesiano': { 2: V, 3: F, 7: V },
	'equazione-di-una-retta': { 2: F, 4: V, 7: V },
	'il-coefficiente-angolare': { 1: V, 2: V, 3: V, 4: form('explicit'), 6: form('explicit'), 7: V },
	'rette-parallele-tra-loro': { 2: V, 3: V, 4: form('explicit'), 6: form('explicit') },
	'intersezione-tra-due-rette': { 5: V, 6: V },
	'distanza-punto-retta': { 1: V, 2: V, 3: F, 4: F, 5: F, 6: F },
	'retta-fasci': { 1: form('explicit'), 2: form('explicit'), 5: V },
	'funzioni-quadratiche': { 5: V, 7: F },
	'concetti-probabilita': { 1: V, 3: V, 4: V, 5: V, 6: V, 7: V },
	'leggi-probabilita': { 1: V, 2: V, 3: V, 4: V, 5: V, 6: V },
	'equazioni-binomie-trinomie': { 1: V, 2: V, 3: V, 4: V, 5: V, 6: V },
	'valore-assoluto-equazioni': { 1: V, 2: V, 3: V, 4: V, 5: V, 6: V },
	'equazioni-irrazionali': { 1: V, 2: V, 3: V, 4: V, 5: V, 6: V },
	'circonferenza-cerchio': { 4: V, 5: V, 6: V, 7: V },
	'poligoni-inscritti': { 1: V, 3: V, 5: V, 6: F, 7: V },
	'equivalenza-aree': { 1: V, 2: V, 3: V, 4: V, 5: V, 6: V },
	'circonferenza-lunghezza-area': { 1: V, 2: V, 3: V, 4: V, 5: V, 6: V, 7: V, 8: V },
	'teorema-di-pitagora': { 1: V, 2: V, 3: F, 5: F, 6: F, 7: V },
	'teorema-di-talete': { 1: V, 2: V, 3: V, 4: V, 6: V, 7: V, 8: V },
	'similitudine': { 3: V, 5: V, 6: V, 7: V, 8: F },
	'triangolo-rettangolo-trigonometria': { 1: V, 3: F, 4: F, 5: V, 6: V, 7: V },
	'trasformazioni-geometriche': { 3: V, 4: F, 5: F },
	'funzioni-reali-di-variabile-reale': { 1: EXCLUDED, 6: V },
	'funzioni-dispari-pari': { 1: form('expanded'), 5: V },
	'funzioni-periodiche': { 2: V, 3: V, 4: V, 5: V, 6: V, 7: V },
	'successioni-numeriche': { 1: V, 2: V, 3: V, 4: V },
	'progressioni-aritmetiche': { 1: V, 2: V, 3: V, 4: V, 5: V, 6: V, 7: V },
	'progressioni-geometriche': { 1: V, 2: V, 4: V, 5: V, 6: V, 7: V },
	'principio-induzione': { 1: V, 2: V },
	'circonferenza-equazione': { 4: V, 6: V },
	'circonferenza-rette': { 3: F, 4: F, 5: V },
	'parabola-equazione': { 4: F, 6: F },
	'parabola-rette': { 2: V, 3: V, 4: F, 5: F, 6: V, 7: V },
	'ellisse': { 4: V },
	'iperbole': { 5: V },
	'funzioni-esponenziali': { 1: V, 4: V, 7: V, 8: EXCLUDED, 9: V },
	'equazioni-esponenziali': { 1: V, 2: V, 3: V, 4: V, 5: V, 6: V, 7: V },
	'logaritmi-proprieta': { 1: V, 2: V, 3: V, 4: V, 7: V },
	'funzioni-logaritmiche': { 1: V, 4: V },
	'equazioni-logaritmiche': { 1: V, 2: V, 3: V, 4: V, 5: V },
	'distribuzioni-doppie': { 1: V, 2: V, 3: V, 4: V, 5: V, 6: V },
	'regressione-correlazione': { 1: V, 2: V, 4: V, 5: V, 6: V },
};

/**
 * The levels of the informatica lessons whose answer is a flowchart to build or a program to write
 * (`ChartAnswer`, `ProgramAnswer` in types.ts). They are graded by running what the student made, not by reading a
 * formula, so they are kept apart from the table above, which the checks of the formula grader walk.
 */
export const runAnswers: Record<string, number[]> = {
	'algoritmi': [6],
	'inf-problema-algoritmo': [6],
	'diagrammi-flusso': [6],
	'inf-pseudocodice': [6],
	'inf-bohm-jacopini': [6],
	'scratch': [5],
	'inf-input-output': [4, 5],
	'inf-variabili-tipi': [5, 6],
	'inf-espressioni': [5, 6],
	'inf-errori-debug': [5, 6],
	'inf-condizioni': [5, 6],
	'inf-selezione-due-vie': [5, 6],
	'inf-operatori-logici': [5, 6],
	'inf-selezione-multipla': [5, 6],
	'inf-ciclo-while': [5, 6],
	'inf-ciclo-for': [5, 6],
	'inf-contatori-accumulatori': [5, 6],
	'inf-cicli-annidati': [5, 6],
	'inf-massimo-minimo-media': [5, 6],
	'inf-definire-funzioni': [5],
	'inf-parametri-ritorno': [6],
	'inf-visibilita': [5],
	'inf-passaggio-parametri': [5],
	'inf-top-down': [6],
	'inf-vettori': [6],
	'inf-ricerca-sequenziale': [5],
	'inf-matrici': [6],
	'inf-stringhe': [6],
	'inf-ricerca-binaria': [5],
	'inf-selection-sort': [6],
	'inf-bubble-sort': [5],
	'inf-insertion-sort': [5],
	'inf-confronto-algoritmi': [6],
	'inf-file-testo': [5],
	'inf-file-csv': [6]
};

/** How a level's open answer is graded, or null when the level stays multiple choice. */
export function openGrading(generatorId: string, level: number): OpenGrading | null {
	return openAnswers[generatorId]?.[level] ?? (runAnswers[generatorId]?.includes(level) ? { grade: 'run' } : null);
}
