/** The exercises of one lesson: its generator (an id under v2/generators) and the levels the page offers, easiest first. */
export interface LessonExercises {
	generator: string;
	levels: number[];
}

/**
 * Exercises by lesson, keyed by the lesson's database path. A lesson can offer a subset of its generator's
 * levels: MCD e MCM leaves criteria and factorisation to Divisibilità. The page picks the level from the
 * student's attempts (vault/Decisioni/2026-09-24 Il livello degli esercizi lo sceglie la pagina.md).
 */
export const configs: Record<string, LessonExercises> = {
	'high_school/math/insiemi-e-logica/prime-definizioni': { generator: 'prime-definizioni', levels: [1, 2, 3, 4, 5, 6] },
	'high_school/math/insiemi-e-logica/insiemi-rappresentazione': { generator: 'insiemi-rappresentazione', levels: [1, 2, 3, 4, 5] },
	'high_school/math/insiemi-e-logica/sottoinsiemi-ugualianza': { generator: 'sottoinsiemi-ugualianza', levels: [1, 2, 3, 4, 5] },
	'high_school/math/insiemi-e-logica/insiemi-unione': { generator: 'insiemi-unione', levels: [1, 2, 3, 4, 5, 6] },
	'high_school/math/insiemi-e-logica/insiemi-operazioni': { generator: 'insiemi-operazioni', levels: [1, 2, 3, 4, 5, 6] },
	'high_school/math/numeri-naturali/numeri-naturali-operazioni': { generator: 'numeri-naturali-operazioni', levels: [1, 2, 3, 4, 5, 6, 7] },
	'high_school/math/numeri-naturali/numeri-naturali-mcm-mcd': { generator: 'numeri-naturali-mcm-mcd', levels: [3, 4, 5, 6] },
	'high_school/math/numeri-naturali/numeri-naturali-potenze': { generator: 'numeri-naturali-potenze', levels: [1, 2, 3, 4, 5] },
	'high_school/math/numeri-razionali/numeri-razionali-confronto-frazioni': { generator: 'numeri-razionali-confronto-frazioni', levels: [1, 2, 3, 4, 5, 6] },
	'high_school/math/numeri-razionali/numeri-razionali-potenze': { generator: 'numeri-razionali-potenze', levels: [1, 2, 3, 4, 5, 6] },
	'high_school/math/numeri-razionali/numeri-razionali-conversione': { generator: 'numeri-razionali-conversione', levels: [1, 2, 3, 4, 5] },
	'high_school/math/monomi-polinomi/monomi-grado': { generator: 'monomi-grado', levels: [1, 2, 3, 4, 5, 6] },
	'high_school/math/monomi-polinomi/monomi-operazioni': { generator: 'monomi-operazioni', levels: [1, 2, 3, 4, 5, 6] },
	'high_school/math/monomi-polinomi/monomi-mcm-mcd': { generator: 'monomi-mcm-mcd', levels: [1, 2, 3, 4, 5] },
	'high_school/math/monomi-polinomi/monomi-espressioni': { generator: 'monomi-espressioni', levels: [1, 2, 3, 4, 5] },
	'high_school/math/equazioni-sistemi/equazioni-primo-grado': { generator: 'equazioni-primo-grado', levels: [1, 2, 3, 4, 5, 6, 7] },
	'high_school/math/equazioni-di-secondo-grado/equazioni-secondo-grado': { generator: 'equazioni-secondo-grado', levels: [1, 2, 3, 4, 5, 6] },
	'high_school/math/funzioni/funzioni-iniettive-suriettive-biettive': { generator: 'funzioni-iniettive-suriettive-biettive', levels: [1, 2, 3, 4, 5, 6] },
	'high_school/math/numeri-naturali/numeri-naturali-divisibilita': { generator: 'numeri-naturali-divisibilita', levels: [1, 2, 3, 4, 5, 6] },
	'high_school/math/numeri-interi/numeri-interi-valore-assoluto': { generator: 'numeri-interi-valore-assoluto', levels: [1, 2, 3, 4, 5, 6] },
	'high_school/math/numeri-interi/numeri-interi-operazioni': { generator: 'numeri-interi-operazioni', levels: [1, 2, 3, 4, 5, 6] },
	'high_school/math/numeri-interi/numeri-interi-potenze': { generator: 'numeri-interi-potenze', levels: [1, 2, 3, 4, 5, 6] },
	'high_school/math/numeri-razionali/numeri-razionali-frazioni': { generator: 'numeri-razionali-frazioni', levels: [1, 2, 3, 4, 5, 6] },
	'high_school/math/numeri-razionali/numeri-razionali-operazioni': { generator: 'numeri-razionali-operazioni', levels: [1, 2, 3, 4, 5, 6, 7] },
	'high_school/math/numeri-razionali/numeri-razionali-espressioni': { generator: 'numeri-razionali-espressioni', levels: [1, 2, 3, 4, 5, 6] },
	'high_school/math/numeri-razionali/numeri-razionali-proporzioni': { generator: 'numeri-razionali-proporzioni', levels: [1, 2, 3, 4, 5, 6, 7] },
	// Chemistry: pools drawn and verified in Python (src/lib/exercises/chimica/pool.ts).
	'high_school/chemistry/chim-quantita-sostanza/mole-massa-molare': { generator: 'mole-massa-molare', levels: [1, 2, 3, 4, 5] },
	'high_school/chemistry/chim-forma-molecole/geometria-molecolare-vsepr': { generator: 'geometria-molecolare-vsepr', levels: [1, 2, 3, 4, 5] },
	'high_school/chemistry/chim-idrocarburi/alcani-nomenclatura': { generator: 'alcani-nomenclatura', levels: [1, 2, 3, 4, 5] },
	'high_school/chemistry/chimica-organica/isomeria': { generator: 'isomeria', levels: [1, 2, 3, 4, 5] },
	'high_school/chemistry/chimica-organica/gruppi-funzionali': { generator: 'gruppi-funzionali', levels: [1, 2, 3, 4, 5] },
	'high_school/chemistry/biochimica/amminoacidi-legame-peptidico': { generator: 'amminoacidi-legame-peptidico', levels: [1, 2, 3, 4, 5] }
};

/** Questions in one exercise session; the start card and the paywall preview say the same. */
export const SESSION_LENGTH = 10;

/** About a minute and a half per question, never under five minutes. */
export const estimatedTime = (questions: number) => `${Math.max(5, Math.ceil(questions * 1.5))} min`;
