import { q, type Rational } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type ResultRow, type Step } from './types';
import { decimal, parseDecimal, parseNatural } from './numbers';

/**
 * The school credit of the last three years of upper secondary school, from the table in Allegato A of D.Lgs.
 * 62/2017: a band of two points for each year, chosen by the average of the final marks (M). Since the reform of
 * law 150/2024 (art. 15, comma 2-bis, of D.Lgs. 62/2017) the higher point of the band can be given only with at
 * least 9 in behaviour. Inside the band the class council decides: the tool gives the band, never a promised score.
 * Rules checked on the ministerial order for the 2025/2026 exam (OM 54 of 26 March 2026, art. 11).
 */

export type Year = 3 | 4 | 5;

export const YEARS: { year: Year; name: string; max: number }[] = [
	{ year: 3, name: 'terzo', max: 12 },
	{ year: 4, name: 'quarto', max: 13 },
	{ year: 5, name: 'quinto', max: 15 }
];

export interface Band {
	/** The condition on M, in LaTeX: "7 < M \le 8". */
	tex: string;
	/** The points for the third, fourth and fifth year; null where the band does not exist. */
	points: Record<Year, [number, number] | null>;
}

/** Allegato A of D.Lgs. 62/2017, as in force for the 2026 exam. */
export const BANDS: Band[] = [
	{ tex: 'M < 6', points: { 3: null, 4: null, 5: [7, 8] } },
	{ tex: 'M = 6', points: { 3: [7, 8], 4: [8, 9], 5: [9, 10] } },
	{ tex: '6 < M \\le 7', points: { 3: [8, 9], 4: [9, 10], 5: [10, 11] } },
	{ tex: '7 < M \\le 8', points: { 3: [9, 10], 4: [10, 11], 5: [11, 12] } },
	{ tex: '8 < M \\le 9', points: { 3: [10, 11], 4: [11, 12], 5: [13, 14] } },
	{ tex: '9 < M \\le 10', points: { 3: [11, 12], 4: [12, 13], 5: [14, 15] } }
];

/** The band of an average: 0 for M < 6, 1 for M = 6, then one per whole mark. */
export function bandOf(m: Rational): Band {
	if (m.compare(q(6)) < 0) return BANDS[0];
	if (m.compare(q(6)) === 0) return BANDS[1];
	if (m.compare(q(7)) <= 0) return BANDS[2];
	if (m.compare(q(8)) <= 0) return BANDS[3];
	if (m.compare(q(9)) <= 0) return BANDS[4];
	return BANDS[5];
}

const mTex = (m: Rational) => decimal(m, 2).tex;
const points = ([lo, hi]: [number, number]) => (lo === hi ? `$${lo}$` : `$${lo}$ o $${hi}$`);

export interface YearInput {
	media: string;
	condotta: string;
}

interface YearResult {
	year: Year;
	name: string;
	m: Rational;
	band: Band;
	range: [number, number];
	possible: [number, number];
	condotta: number | null;
}

function readYear(year: Year, input: YearInput): YearResult | string | null {
	const { name } = YEARS.find((y) => y.year === year)!;
	if (!input.media.trim() && !input.condotta.trim()) return null;
	if (!input.media.trim()) return `Scrivi la media del ${name} anno, per esempio 7,4.`;
	const m = parseDecimal(input.media);
	if (!m || m.compare(q(1)) < 0 || m.compare(q(10)) > 0) return `La media del ${name} anno deve essere un numero da 1 a 10, con la virgola: per esempio 7,4.`;
	let condotta: number | null = null;
	if (input.condotta.trim()) {
		condotta = parseNatural(input.condotta, 10);
		if (condotta === null || condotta < 1) return `Il voto di comportamento del ${name} anno è un numero intero da 1 a 10, per esempio 9.`;
		if (condotta < 6)
			return `Con meno di 6 in comportamento il consiglio di classe non promuove e non ammette all’esame: il ${name} anno non dà credito.`;
	}
	const band = bandOf(m);
	const range = band.points[year];
	if (!range)
		return `Con la media sotto 6 al ${name} anno non c’è una fascia di credito: per la promozione serve almeno 6 in ogni materia.`;
	const possible: [number, number] = condotta !== null && condotta < 9 ? [range[0], range[0]] : range;
	return { year, name, m, band, range, possible, condotta };
}

export function creditiScolastici(inputs: Record<Year, YearInput>): Outcome {
	const years: YearResult[] = [];
	for (const y of [3, 4, 5] as Year[]) {
		const r = readYear(y, inputs[y]);
		if (typeof r === 'string') return fail(r);
		if (r) years.push(r);
	}
	if (!years.length) return fail('Scrivi la media dei voti di almeno un anno, per esempio 7,4 per il terzo anno.');

	const steps: Step[] = [
		{
			say: 'Trova la fascia di ogni anno nella tabella del ministero.',
			table: {
				head: ['Anno', 'Media', 'Fascia', 'Punti'],
				rows: years.map((y) => [y.name, `$${mTex(y.m)}$`, `$${y.band.tex}$`, points(y.range)])
			},
			then: years.some((y) => y.year === 5 && y.band === BANDS[0]) ? 'Al quinto anno la fascia sotto il 6 vale per chi è ammesso all’esame con un’insufficienza.' : undefined
		}
	];
	const known = years.filter((y) => y.condotta !== null);
	if (known.length) {
		steps.push({
			say: 'Guarda il voto di comportamento di ogni anno.',
			table: {
				head: ['Anno', 'Comportamento', 'Punti possibili'],
				rows: known.map((y) => [y.name, `$${y.condotta}$`, y.condotta! >= 9 ? points(y.possible) : `$\\hl{${y.possible[0]}}$`])
			},
			then: 'Il punto più alto della fascia si può dare solo con almeno 9 in comportamento.'
		});
	} else {
		steps.push({
			say: 'Ricorda il voto di comportamento.',
			then: 'Il punto più alto della fascia si può dare solo con almeno 9 in comportamento. Con 8 o meno resta il punto più basso.'
		});
	}
	const lo = years.reduce((s, y) => s + y.possible[0], 0);
	const hi = years.reduce((s, y) => s + y.possible[1], 0);
	const all = years.length === 3;
	if (years.length > 1) {
		const sum = (i: 0 | 1) => years.map((y) => y.possible[i]).join(' + ');
		steps.push({
			say: all ? 'Somma i crediti dei tre anni.' : 'Somma i crediti degli anni che hai.',
			math: lo === hi ? [`${sum(0)} = \\hl{${lo}}`] : [`\\text{minimo} = ${sum(0)} = \\hl{${lo}}`, `\\text{massimo} = ${sum(1)} = \\hl{${hi}}`],
			then: all ? 'Il massimo possibile nei tre anni è 40 punti: 12, 13 e 15.' : 'Mancano degli anni: il totale è parziale. Nei tre anni si arriva al massimo a 40 punti.'
		});
	}
	const sixInBehaviour = years.filter((y) => y.condotta === 6);
	steps.push({
		say: 'Ricorda chi decide il punteggio dentro la fascia.',
		then: (
			(lo === hi ? 'Qui la fascia lascia un solo punteggio. ' : 'Tra il punto più basso e il più alto sceglie il consiglio di classe, nello scrutinio finale. ') +
			(sixInBehaviour.length
				? sixInBehaviour.some((y) => y.year === 5)
					? 'Con 6 in comportamento al quinto anno porti all’esame un elaborato di cittadinanza attiva.'
					: 'Con 6 in comportamento il giudizio è sospeso: a settembre porti un elaborato di cittadinanza attiva.'
				: '')
		).trim()
	});

	const range = (a: number, b: number) => (a === b ? `$${a}$ punti` : `da $${a}$ a $${b}$ punti`);
	const rows: ResultRow[] = years.map((y) => ({ label: `Credito del ${y.name} anno`, value: `${points(y.possible)} punti` }));
	if (years.length > 1) rows.push({ label: all ? 'Credito totale dei tre anni' : 'Totale degli anni inseriti', value: `${range(lo, hi)} su $${all ? 40 : years.reduce((s, y) => s + YEARS.find((x) => x.year === y.year)!.max, 0)}$` });
	return {
		ok: true,
		rows,
		copy: lo === hi ? `${lo}` : `da ${lo} a ${hi}`,
		steps
	};
}
