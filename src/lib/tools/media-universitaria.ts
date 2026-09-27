import { Rational, ZERO } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type ResultRow, type Step } from './types';
import { decimal, parseDecimal } from './numbers';
import { sumLines } from './media-mediana-moda';

/**
 * University averages and the degree mark. Exams are written one per line as "mark CFU" ("28 9", "30L 6",
 * "30 e lode 6"); a pass mark goes from 18 to 30. The weighted mean multiplies each mark by its credits (CFU) and
 * divides by the total credits. A 30 e lode counts 30 unless the student says otherwise: some universities count it
 * 31, 32 or 33, and the value is a field. The starting point of the degree mark (base di laurea) is the weighted mean
 * times 110/30; the points of the thesis, the bonuses, the rounding and the lode are set by each university's rules
 * (D.M. 270 of 22 October 2004, art. 12: the regolamento didattico sets the prova finale). The tool rounds to the
 * nearest whole number, half up, as many universities do, and says so.
 */

export interface Exam {
	mark: number;
	lode: boolean;
	cfu: Rational;
}

const MAX_EXAMS = 60;
const EXAMPLE = 'scrivi un esame per riga, voto e CFU: per esempio 28 9 oppure 30L 6.';
const t2 = (r: Rational) => decimal(r, 2);
/** "= 27{,}5" or "\approx 27{,}43", the result highlighted. */
const res = (r: Rational) => `${t2(r).exact ? '=' : '\\approx'} \\hl{${t2(r).tex}}`;
const approx = (r: Rational) => `${t2(r).exact ? '' : '\\approx '}${t2(r).tex}`;
const sum = (xs: Rational[]) => xs.reduce((a, b) => a.add(b), ZERO);

/** One exam per line (or separated by ";"): "28 9", "30L 6", "30 e lode 6", "28/30 9", "27 6 cfu". */
export function parseExams(input: string): Exam[] | string {
	const lines = input
		.split(/[\n;]+/)
		.map((l) => l.trim())
		.filter(Boolean);
	if (!lines.length) return `Scrivi i tuoi esami: ${EXAMPLE}`;
	if (lines.length > MAX_EXAMS) return `Al massimo ${MAX_EXAMS} esami alla volta: togline qualcuno.`;
	const out: Exam[] = [];
	for (const line of lines) {
		const s = line
			.toLowerCase()
			.replace(/\s*cfu\s*$/, '')
			.replace(/(\d)\s*\/\s*30\b/, '$1')
			.replace(/(\d)\s*(?:e\s*)?lode\b/, '$1l')
			.replace(/(\d)\s+l\b/, '$1l')
			.replace(/\s+/g, ' ');
		const m = /^(\d{1,2})(l?)\s(\d+(?:[.,]\d+)?)$/.exec(s);
		if (!m) return `"${line}" non si capisce: ${EXAMPLE}`;
		const mark = Number(m[1]);
		const lode = m[2] === 'l';
		if (mark < 18 || mark > 30) return `"${line}": un esame superato ha un voto da 18 a 30.`;
		if (lode && mark !== 30) return `"${line}": la lode si dà solo con 30. Scrivi 30L.`;
		const cfu = parseDecimal(m[3]);
		if (!cfu || cfu.sign() <= 0 || cfu.compare(Rational.of(60)) > 0) return `"${line}": i CFU sono un numero da 1 a 60, per esempio 6 o 9.`;
		out.push({ mark, lode, cfu });
	}
	return out;
}

/** The value a 30 e lode counts: "30" by default, up to 34. */
export function parseLode(input: string): Rational | string {
	if (!input.trim()) return Rational.of(30);
	const r = parseDecimal(input);
	if (!r || r.compare(Rational.of(30)) < 0 || r.compare(Rational.of(34)) > 0) return 'Scrivi quanto vale la lode nella media, un numero da 30 a 34: di solito 30.';
	return r;
}

interface Means {
	weighted: Rational;
	plain: Rational;
	cfu: Rational;
	steps: Step[];
}

function means(exams: Exam[], lode: Rational): Means {
	const values = exams.map((e) => (e.lode ? lode : Rational.of(e.mark)));
	const products = values.map((v, i) => v.mul(exams[i].cfu));
	const S = sum(products);
	const W = sum(exams.map((e) => e.cfu));
	const V = sum(values);
	const weighted = S.div(W);
	const plain = V.div(Rational.of(exams.length));
	const anyLode = exams.some((e) => e.lode);
	const steps: Step[] = [
		{
			say: 'Moltiplica ogni voto per i suoi CFU.',
			table: {
				head: ['Voto', 'CFU', 'Voto per CFU'],
				rows: exams.map((e, i) => [e.lode ? `$30$ e lode` : `$${e.mark}$`, `$${t2(e.cfu).tex}$`, `$${t2(products[i]).tex}$`])
			},
			then: anyLode ? `Nella media il 30 e lode vale $${t2(lode).tex}$.` : undefined
		},
		{ say: 'Somma i prodotti.', math: sumLines(products, 2) },
		{ say: 'Somma i CFU.', math: sumLines(exams.map((e) => e.cfu), 2) },
		{ say: 'Dividi la somma dei prodotti per il totale dei CFU.', math: [`\\dfrac{${t2(S).tex}}{${t2(W).tex}} ${res(weighted)}`], then: 'È la media ponderata: un esame da 12 CFU conta il doppio di uno da 6.' }
	];
	return { weighted, plain, cfu: W, steps: exams.length === 1 ? [steps[0], { ...steps[3], then: 'Con un esame solo, la media è il suo voto.' }] : steps };
}

const BASE_FACTOR = Rational.of(110, 30);

function baseStep(weighted: Rational): { base: Rational; step: Step } {
	const base = weighted.mul(BASE_FACTOR);
	return {
		base,
		step: {
			say: 'Porta la media ponderata in centodecimi.',
			math: [`${t2(weighted).tex} \\cdot \\dfrac{110}{30} ${res(base)}`],
			then: t2(weighted).exact ? undefined : 'Il calcolo parte dalla media esatta, non da quella arrotondata.'
		}
	};
}

export function mediaUniversitaria(esami: string, lode = ''): Outcome {
	const exams = parseExams(esami);
	if (typeof exams === 'string') return fail(exams);
	const l = parseLode(lode);
	if (typeof l === 'string') return fail(l);
	const m = means(exams, l);
	const steps = [...m.steps];
	if (exams.length > 1) {
		const V = m.plain.mul(Rational.of(exams.length));
		steps.push({
			say: 'Per confronto, calcola la media aritmetica dei voti.',
			math: [`\\dfrac{${t2(V).tex}}{${exams.length}} ${res(m.plain)}`],
			then: 'La media aritmetica conta ogni esame allo stesso modo, qualunque sia il numero di CFU.'
		});
	}
	const { base, step } = baseStep(m.weighted);
	steps.push(step);
	const rows: ResultRow[] = [{ label: 'Media ponderata', value: `$${approx(m.weighted)}$` }];
	if (exams.length > 1) rows.push({ label: 'Media aritmetica', value: `$${approx(m.plain)}$` });
	rows.push({ label: 'CFU con voto', value: `$${t2(m.cfu).tex}$` }, { label: 'Base di laurea in centodecimi', value: `$${approx(base)}$` });
	const groups: Record<number, string> = { 0: 'La media ponderata', [steps.length - 2]: 'La media aritmetica', [steps.length - 1]: 'La base di laurea' };
	return {
		ok: true,
		rows,
		copy: t2(m.weighted).text,
		steps: steps.length > 5 ? steps.map((s, i) => (groups[i] ? { ...s, group: groups[i] } : s)) : steps
	};
}

export type LaureaMode = 'esami' | 'media';

export interface LaureaInput {
	modo: LaureaMode;
	esami: string;
	lode: string;
	/** The weighted mean in thirtieths, when the student already has it. */
	media: string;
	/** Points for the thesis and any bonus, as the university gives them. Empty is none. */
	tesi: string;
}

export function votoLaurea({ modo, esami, lode, media, tesi }: LaureaInput): Outcome {
	let weighted: Rational;
	const steps: Step[] = [];
	if (modo === 'esami') {
		const exams = parseExams(esami);
		if (typeof exams === 'string') return fail(exams);
		const l = parseLode(lode);
		if (typeof l === 'string') return fail(l);
		const m = means(exams, l);
		weighted = m.weighted;
		steps.push(...m.steps.map((s, i) => (i === 0 ? { ...s, group: 'La media ponderata' } : s)));
	} else {
		if (!media.trim()) return fail('Scrivi la tua media ponderata in trentesimi, per esempio 27,5.');
		const r = parseDecimal(media);
		if (!r || r.compare(Rational.of(18)) < 0 || r.compare(Rational.of(34)) > 0) return fail('Scrivi la media in trentesimi, un numero da 18 a 30: per esempio 27,5.');
		weighted = r;
	}
	let points = ZERO;
	if (tesi.trim()) {
		const p = parseDecimal(tesi);
		if (!p || p.sign() < 0 || p.compare(Rational.of(30)) > 0) return fail('Scrivi i punti della tesi come li dà il tuo ateneo, un numero da 0 a 30: per esempio 5. Lascia vuoto se non li sai.');
		points = p;
	}
	const { base, step } = baseStep(weighted);
	const firstLaurea = steps.length;
	steps.push(step);
	const rows: ResultRow[] = [{ label: 'Base di laurea', value: `$${approx(base)}$ su $110$` }];
	let copy = `${t2(base).text}/110`;

	if (!tesi.trim()) {
		steps.push({
			say: 'Aggiungi i punti della tesi, quando li conosci.',
			then: 'Li decide la commissione, con le regole del tuo ateneo: scrivili nel campo dei punti della tesi.'
		});
	} else {
		const total = base.add(points);
		const final = Math.min(110, Math.floor((2 * total.num + total.den) / (2 * total.den)));
		steps.push({ say: 'Aggiungi i punti della tesi e gli eventuali bonus.', math: [`${t2(base).tex} + ${t2(points).tex} ${res(total)}`] });
		const over = total.compare(Rational.of(110)) > 0;
		const lodeNote = final === 110 ? 'Con 110 la commissione può dare la lode, se il regolamento lo prevede.' : undefined;
		if (over) steps.push({ say: 'Il voto di laurea non supera mai $110$.', math: [`${t2(total).tex} \\to \\hl{110}`], then: lodeNote });
		else if (total.isInteger()) steps.push({ say: 'Il voto è già intero: non serve arrotondare.', then: lodeNote });
		else
			steps.push({
				say: 'Arrotonda all’intero più vicino, come fanno molti atenei.',
				math: [`${t2(total).tex} \\to \\hl{${final}}`],
				then: `Da $0{,}5$ in su si sale. Alcuni atenei arrotondano in altro modo.${lodeNote ? ` ${lodeNote}` : ''}`
			});
		rows.push({ label: 'Voto di laurea', value: `$${final}$ su $110$` });
		copy = `${final}/110`;
		if (final === 110) rows.push({ label: 'Lode', value: 'possibile, la decide la commissione' });
	}
	steps.push({
		say: 'Controlla il regolamento del tuo corso di laurea.',
		then: 'Ogni ateneo decide i punti della tesi, i bonus, come conta la lode e come si arrotonda.'
	});
	const grouped = steps.length > 5 ? steps.map((s, i) => (i === firstLaurea ? { ...s, group: 'Il voto di laurea' } : s)) : steps.map((s) => ({ ...s, group: undefined }));
	return { ok: true, rows, copy, steps: grouped };
}
