import { Rational } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type ResultRow, type Step } from './types';
import { decimal, parseNatural } from './numbers';

/**
 * The final mark of the esame di Stato del primo ciclo (terza media). The rule, D.Lgs. 62/2017 art. 8 c. 7 and
 * DM 741 of 3 October 2017 art. 13, unchanged for the 2026 exam (MIM page "Esame di Stato conclusivo del primo ciclo",
 * esami 2025-2026): the four tests (Italian, maths, foreign languages, interview) get a whole mark in tenths; their
 * mean is taken without rounding; the final mark is the mean of that and the admission mark (a whole number in
 * tenths, possibly under 6: D.Lgs. 62/2017 art. 6 c. 5), rounded up from 0.5. Passed from 6; with 10 the commission
 * may give the lode, unanimously. External candidates (privatisti) have no admission mark: the page says so.
 */

export interface TerzaMediaInput {
	ammissione: string;
	italiano: string;
	matematica: string;
	lingue: string;
	colloquio: string;
}

const TESTS: { key: Exclude<keyof TerzaMediaInput, 'ammissione'>; name: string; what: string }[] = [
	{ key: 'italiano', name: 'Italiano', what: 'il voto della prova di italiano' },
	{ key: 'matematica', name: 'Matematica', what: 'il voto della prova di matematica' },
	{ key: 'lingue', name: 'Lingue straniere', what: 'il voto della prova di lingue' },
	{ key: 'colloquio', name: 'Colloquio', what: 'il voto del colloquio' }
];

const tx = (r: Rational) => decimal(r, 4).tex;

function mark(raw: string, what: string): number | string {
	if (!raw.trim()) return `Scrivi ${what}, un voto intero da 1 a 10.`;
	const n = parseNatural(raw, 10);
	if (n === null || n < 1) return `Scrivi ${what} come voto intero da 1 a 10, per esempio 7: all’esame non si danno mezzi voti.`;
	return n;
}

export function votoTerzaMedia(input: TerzaMediaInput): Outcome {
	const a = mark(input.ammissione, 'il voto di ammissione');
	if (typeof a === 'string') return fail(a);
	const marks: number[] = [];
	for (const t of TESTS) {
		const m = mark(input[t.key], t.what);
		if (typeof m === 'string') return fail(m);
		marks.push(m);
	}
	const sum = marks.reduce((x, y) => x + y, 0);
	const tests = Rational.of(sum, 4);
	const total = Rational.of(a).add(tests);
	const mean = total.div(Rational.of(2));
	// Rounded half up: 7,5 → 8, 7,375 → 7.
	const final = Math.floor((2 * mean.num + mean.den) / (2 * mean.den));
	const passed = final >= 6;

	const steps: Step[] = [
		{
			say: 'Scrivi i voti delle quattro prove.',
			table: { head: ['Prova', 'Voto'], rows: TESTS.map((t, i) => [t.name, `$${marks[i]}$`]) }
		},
		{
			say: 'Calcola la media delle prove, senza arrotondare.',
			math: [`\\dfrac{${marks.join(' + ')}}{4} = \\dfrac{${sum}}{4}`, `= \\hl{${tx(tests)}}`]
		},
		{
			say: 'Fai la media tra il voto di ammissione e la media delle prove.',
			math: [`\\dfrac{${a} + ${tx(tests)}}{2} = \\dfrac{${tx(total)}}{2}`, `= \\hl{${tx(mean)}}`]
		},
		{
			say: mean.isInteger() ? 'Il voto è già intero: non serve arrotondare.' : 'Arrotonda all’intero: da $0{,}5$ in su si sale.',
			math: mean.isInteger() ? undefined : [`${tx(mean)} \\to \\hl{${final}}`],
			then: passed ? `Il voto finale è ${final} decimi: l’esame è superato.` : `Il voto finale è ${final} decimi: servono almeno 6 decimi per superare l’esame.`
		}
	];
	const rows: ResultRow[] = [
		{ label: 'Voto finale', value: `$${final}$ su $10$` },
		{ label: 'Media delle quattro prove', value: `$${tx(tests)}$` }
	];
	if (!passed) rows.push({ label: 'Esito', value: 'non superato: servono almeno $6$ decimi' });
	if (final === 10) {
		steps.push({
			say: 'Con 10 la commissione può dare la lode.',
			then: 'Decide all’unanimità, guardando anche i risultati dei tre anni.'
		});
		rows.push({ label: 'Lode', value: 'possibile, se la commissione è unanime' });
	}
	return { ok: true, rows, copy: `${final}/10`, steps };
}
