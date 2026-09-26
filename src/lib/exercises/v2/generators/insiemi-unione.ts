/**
 * Unione insiemistica. Spec: specs/exercises/insiemi-unione.md
 *
 * Six levels in the order of the lesson: the union of two listed sets, of two sets described in
 * words, of three sets (associative property), the properties (A ∪ ∅, A ∪ U, A ⊆ B), the formula
 * |A ∪ B| = |A| + |B| − |A ∩ B| and word problems like the lesson's examples 7 and 8.
 */
import type { ChoiceAnswer, Generator, NumberAnswer, Rng, Sample, SetAnswer } from '../types';
import {
	type El,
	assembleChoice,
	diff,
	fitSetChoice,
	inter,
	lines,
	norm,
	numberChoice,
	pickDistinct,
	range,
	sameSet,
	setOption,
	setTex,
	shuffle,
	subsetEq,
	symDiff,
	textBlock,
	union,
} from '../insiemi';

export const ID = 'insiemi-unione';

const strs = (xs: readonly El[]) => xs.map(String);
const nums = (xs: unknown): number[] => (xs as string[]).map(Number);

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: SetAnswer | NumberAnswer;
	params: Record<string, unknown>;
}

const setAnswer = (name: string, xs: El[]): SetAnswer => ({ kind: 'set', values: strs(norm(xs)), latex: `${name} = ${setTex(xs)}` });

/** Steps of a union of listed sets: the first set, then the new elements of the others. */
function unionSteps(names: string[], sets: El[][]): string[] {
	const out: string[] = [];
	let acc: El[] = [];
	sets.forEach((s, i) => {
		const fresh = diff(s, acc);
		const old = inter(s, acc);
		if (i === 0) out.push(`\\text{Si scrivono gli elementi di } ${names[0]}\\text{: } ${norm(s).join(', ')}`);
		else if (fresh.length === 0) out.push(`\\text{Tutti gli elementi di } ${names[i]} \\text{ ci sono già: non si aggiunge niente}`);
		else
			out.push(
				`\\text{Si aggiungono gli elementi di } ${names[i]} \\text{ che mancano: } ${fresh.join(', ')}` +
					(old.length ? `\\text{; } ${old.join(', ')} \\text{ ${old.length === 1 ? "c'è" : 'ci sono'} già}` : ''),
			);
		acc = union(acc, s);
	});
	return out;
}

// ---------------------------------------------------------------------------
// Level 2: sets described in words

/** A set described in words inside {1, ..., n}: even, odd, multiples of k, divisors of m. */
interface Desc {
	kind: 'pari' | 'dispari' | 'mult' | 'div';
	k: number;
	n: number;
}

function descElements(d: Desc): number[] {
	return range(1, d.n).filter((x) => (d.kind === 'pari' ? x % 2 === 0 : d.kind === 'dispari' ? x % 2 === 1 : d.kind === 'mult' ? x % d.k === 0 : d.k % x === 0));
}

function descText(d: Desc): string {
	if (d.kind === 'div') return `dei divisori di $${d.k}$`;
	const what = d.kind === 'pari' ? 'dei numeri pari' : d.kind === 'dispari' ? 'dei numeri dispari' : `dei multipli di $${d.k}$`;
	return `${what} da $1$ a $${d.n}$`;
}

// ---------------------------------------------------------------------------
// Level 6: word problems

interface Ctx {
	group: string;
	people: string;
	a: string;
	b: string;
	both: string;
	atLeast: string;
	none: string;
	everyone: string;
	A: string;
	B: string;
}

export const CONTEXTS: Ctx[] = [
	{
		group: 'In una classe di',
		people: 'studenti',
		a: 'giocano a calcio',
		b: 'giocano a pallavolo',
		both: 'fanno tutti e due gli sport',
		atLeast: 'fanno almeno uno dei due sport',
		none: 'non fanno nessuno dei due sport',
		everyone: 'ogni studente fa almeno uno dei due sport',
		A: 'C',
		B: 'P',
	},
	{
		group: 'In una classe di',
		people: 'studenti',
		a: 'studiano inglese',
		b: 'studiano spagnolo',
		both: 'studiano tutte e due le lingue',
		atLeast: 'studiano almeno una delle due lingue',
		none: 'non studiano nessuna delle due lingue',
		everyone: 'ogni studente studia almeno una delle due lingue',
		A: 'I',
		B: 'S',
	},
	{
		group: 'In una palestra con',
		people: 'iscritti',
		a: 'fanno nuoto',
		b: 'giocano a tennis',
		both: 'fanno tutti e due gli sport',
		atLeast: 'fanno almeno uno dei due sport',
		none: 'non fanno nessuno dei due sport',
		everyone: 'ogni iscritto fa almeno uno dei due sport',
		A: 'N',
		B: 'T',
	},
	{
		group: 'In un gruppo di',
		people: 'ragazzi',
		a: 'hanno un cane',
		b: 'hanno un gatto',
		both: 'hanno sia un cane sia un gatto',
		atLeast: 'hanno almeno uno dei due animali',
		none: 'non hanno né un cane né un gatto',
		everyone: 'ognuno ha almeno uno dei due animali',
		A: 'C',
		B: 'G',
	},
	{
		group: 'In una scuola di musica con',
		people: 'allievi',
		a: 'suonano la chitarra',
		b: 'suonano il pianoforte',
		both: 'suonano tutti e due gli strumenti',
		atLeast: 'suonano almeno uno dei due strumenti',
		none: 'non suonano nessuno dei due strumenti',
		everyone: 'ogni allievo suona almeno uno dei due strumenti',
		A: 'C',
		B: 'P',
	},
];

// ---------------------------------------------------------------------------
// Construction

function build(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1: {
			const U = range(1, 12);
			const u = rng.next();
			const kind = u < 0.6 ? 'in comune' : u < 0.8 ? 'disgiunti' : 'uno incluso';
			let A: number[], B: number[];
			if (kind === 'in comune') {
				const common = pickDistinct(rng, U, rng.int(1, 2));
				const rest = pickDistinct(rng, diff(U, common) as number[], rng.int(3, 6));
				const cut = rng.int(1, rest.length - 1);
				A = norm([...common, ...rest.slice(0, cut)]) as number[];
				B = norm([...common, ...rest.slice(cut)]) as number[];
			} else if (kind === 'disgiunti') {
				const all = pickDistinct(rng, U, rng.int(5, 8));
				const cut = rng.int(2, all.length - 2);
				A = norm(all.slice(0, cut)) as number[];
				B = norm(all.slice(cut)) as number[];
			} else {
				const big = norm(pickDistinct(rng, U, rng.int(4, 6))) as number[];
				const small = norm(pickDistinct(rng, big, rng.int(2, big.length - 1))) as number[];
				[A, B] = rng.int(0, 1) ? [small, big] : [big, small];
			}
			const res = union(A, B);
			const steps = unionSteps(['A', 'B'], [A, B]);
			if (kind === 'disgiunti') steps.push('\\text{I due insiemi sono disgiunti: l’unione li mette uno accanto all’altro}');
			steps.push(`A \\cup B = ${setTex(res)}`);
			return {
				prompt: "Scrivi l'unione per elencazione.",
				problem: lines([`A = ${setTex(A)} \\qquad B = ${setTex(B)}`, 'A \\cup B = \\ ?']),
				solution: `A \\cup B = ${setTex(res)}`,
				steps,
				answer: setAnswer('A \\cup B', res),
				params: { A: strs(A), B: strs(B), case: kind, wrong: [inter(A, B), symDiff(A, B), A, B].map((w) => strs(w)) },
			};
		}
		case 2: {
			const n = rng.int(10, 20);
			const kinds: [Desc['kind'], number][] = [
				['pari', 0],
				['dispari', 0],
				['mult', 3],
				['mult', 4],
				['mult', 5],
				['div', rng.pick([6, 8, 10, 12, 18, 20].filter((m) => m <= n))],
			];
			const [ka, kb] = pickDistinct(rng, kinds, 2);
			if ((ka[0] === 'pari' && kb[0] === 'dispari') || (ka[0] === 'dispari' && kb[0] === 'pari')) return null;
			const da: Desc = { kind: ka[0], k: ka[1], n },
				db: Desc = { kind: kb[0], k: kb[1], n };
			const A = descElements(da),
				B = descElements(db);
			const res = union(A, B);
			if (inter(A, B).length === 0 || res.length > 12 || subsetEq(A, B) || subsetEq(B, A)) return null;
			const common = inter(A, B);
			return {
				prompt: "Scrivi l'unione per elencazione.",
				problem: textBlock(`Siano $A$ l'insieme ${descText(da)} e $B$ l'insieme ${descText(db)}.`, 46, ['A \\cup B = \\ ?']),
				solution: `A \\cup B = ${setTex(res)}`,
				steps: [
					`\\text{Per elencazione: } A = ${setTex(A)}\\text{, } B = ${setTex(B)}`,
					`${common.join(', ')} \\text{ ${common.length === 1 ? 'sta' : 'stanno'} in tutti e due gli insiemi e si ${common.length === 1 ? 'scrive' : 'scrivono'} una volta sola}`,
					`A \\cup B = ${setTex(res)}`,
				],
				answer: setAnswer('A \\cup B', res),
				params: {
					A: { kind: da.kind, k: String(da.k), n: String(n) },
					B: { kind: db.kind, k: String(db.k), n: String(n) },
					wrong: [symDiff(A, B), inter(A, B), A, B].map((w) => strs(w)),
				},
			};
		}
		case 3: {
			const U = range(1, 12);
			const sets = [0, 1, 2].map(() => norm(pickDistinct(rng, U, rng.int(2, 4))) as number[]);
			const [A, B, C] = sets;
			const res = union(union(A, B), C);
			const pairs = [inter(A, B), inter(B, C), inter(A, C)];
			if (res.length > 10 || pairs.filter((p) => p.length).length < 2) return null;
			if (subsetEq(C, union(A, B)) || subsetEq(A, union(B, C))) return null; // each set adds something
			const atLeastTwo = union(union(pairs[0], pairs[1]), pairs[2]);
			return {
				prompt: "Scrivi l'unione per elencazione.",
				problem: lines([`A = ${setTex(A)} \\qquad B = ${setTex(B)}`, `C = ${setTex(C)}`, 'A \\cup B \\cup C = \\ ?']),
				solution: `A \\cup B \\cup C = ${setTex(res)}`,
				steps: ['\\text{Per la proprietà associativa si può unire un insieme alla volta}', ...unionSteps(['A', 'B', 'C'], sets), `A \\cup B \\cup C = ${setTex(res)}`],
				answer: setAnswer('A \\cup B \\cup C', res),
				params: { A: strs(A), B: strs(B), C: strs(C), wrong: [union(A, B), atLeastTwo, diff(res, atLeastTwo), union(A, C), union(B, C)].map((w) => strs(w)) },
			};
		}
		case 4: {
			const u = rng.next();
			const U = range(1, rng.int(7, 10));
			if (u < 0.45) {
				const B = norm(pickDistinct(rng, range(1, 12), rng.int(4, 6))) as number[];
				const A = norm(pickDistinct(rng, B, rng.int(2, B.length - 1))) as number[];
				return {
					prompt: "Scrivi l'unione per elencazione.",
					problem: lines([`A = ${setTex(A)} \\qquad B = ${setTex(B)}`, 'A \\cup B = \\ ?']),
					solution: `A \\cup B = B = ${setTex(B)}`,
					steps: [`\\text{Ogni elemento di } A \\text{ sta già in } B\\text{: } A \\subseteq B`, `\\text{Quindi l'unione non aggiunge niente: } A \\cup B = B = ${setTex(B)}`],
					answer: setAnswer('A \\cup B', B),
					params: { variant: 'incluso', A: strs(A), B: strs(B), wrong: [A, diff(B, A), diff(B, [A[0]])].map((w) => strs(w)) },
				};
			}
			const A = norm(pickDistinct(rng, U, rng.int(2, U.length - 2))) as number[];
			if (u < 0.75) {
				return {
					prompt: "Scrivi l'unione per elencazione.",
					problem: lines([`U = ${setTex(U)} \\qquad A = ${setTex(A)}`, 'A \\cup U = \\ ?']),
					solution: `A \\cup U = U = ${setTex(U)}`,
					steps: [`A \\text{ è contenuto nell'universo } U\\text{, quindi non aggiunge niente a } U`, `A \\cup U = U = ${setTex(U)}`],
					answer: setAnswer('A \\cup U', U),
					params: { variant: 'universo', U: strs(U), A: strs(A), wrong: [A, diff(U, A), U.slice(0, -1)].map((w) => strs(w)) },
				};
			}
			return {
				prompt: "Scrivi l'unione per elencazione.",
				problem: lines([`A = ${setTex(A)}`, 'A \\cup \\emptyset = \\ ?']),
				solution: `A \\cup \\emptyset = A = ${setTex(A)}`,
				steps: ['\\text{L’insieme vuoto è l’elemento neutro dell’unione: non aggiunge elementi}', `A \\cup \\emptyset = A = ${setTex(A)}`],
				answer: setAnswer('A \\cup \\emptyset', A),
				params: { variant: 'vuoto', A: strs(A), wrong: [[], union(A, [0]), A.slice(1)].map((w) => strs(w)) },
			};
		}
		case 5: {
			const u = rng.next();
			const a = rng.int(6, 30),
				b = rng.int(6, 30);
			const i = rng.int(1, Math.min(a, b) - 1);
			const un = a + b - i;
			const given = (xs: [string, number][]) => xs.map(([k, v]) => `${k} = ${v}`).join(' \\qquad ');
			if (u < 0.5) {
				return {
					prompt: "Calcola il numero di elementi dell'unione.",
					problem: `\\begin{array}{l} ${given([
						['|A|', a],
						['|B|', b],
						['|A \\cap B|', i],
					])} \\\\ |A \\cup B| = \\ ? \\end{array}`,
					solution: `|A \\cup B| = ${un}`,
					steps: [
						'|A \\cup B| = |A| + |B| - |A \\cap B|',
						`|A \\cup B| = ${a} + ${b} - ${i} = ${un}`,
						`\\text{Sommando solo } ${a} + ${b} \\text{ gli elementi comuni si conterebbero due volte}`,
					],
					answer: { kind: 'number', value: String(un) },
					params: { variant: 'unione', a: String(a), b: String(b), i: String(i), mistakes: strs([a + b, a + b - 2 * i, a + b + i]) },
				};
			}
			if (u < 0.8) {
				return {
					prompt: "Calcola il numero di elementi dell'intersezione.",
					problem: `\\begin{array}{l} ${given([
						['|A|', a],
						['|B|', b],
						['|A \\cup B|', un],
					])} \\\\ |A \\cap B| = \\ ? \\end{array}`,
					solution: `|A \\cap B| = ${i}`,
					steps: ['|A \\cup B| = |A| + |B| - |A \\cap B|', `${un} = ${a} + ${b} - |A \\cap B|`, `|A \\cap B| = ${a + b} - ${un} = ${i}`],
					answer: { kind: 'number', value: String(i) },
					params: { variant: 'intersezione', a: String(a), b: String(b), u: String(un), mistakes: strs([un - a, un - b, a + b]) },
				};
			}
			return {
				prompt: 'Calcola il numero di elementi di B.',
				problem: `\\begin{array}{l} ${given([
					['|A \\cup B|', un],
					['|A|', a],
					['|A \\cap B|', i],
				])} \\\\ |B| = \\ ? \\end{array}`,
				solution: `|B| = ${b}`,
				steps: ['|A \\cup B| = |A| + |B| - |A \\cap B|', `${un} = ${a} + |B| - ${i}`, `|B| = ${un} - ${a} + ${i} = ${b}`],
				answer: { kind: 'number', value: String(b) },
				params: { variant: 'B', u: String(un), a: String(a), i: String(i), mistakes: strs([un - a, un - a - i, un + i]) },
			};
		}
		case 6: {
			const c = rng.pick(CONTEXTS);
			const u = rng.next();
			const both = rng.int(2, 9);
			const a = both + rng.int(3, 14),
				b = both + rng.int(3, 14);
			const atLeast = a + b - both;
			let prose: string, value: number, variant: string, mistakes: number[], total: number, none: number;
			if (u < 0.3) {
				none = rng.int(1, 8); // with none = 0 the answer would be the total given in the text
				total = atLeast + none;
				variant = 'almeno uno';
				value = atLeast;
				prose = `${c.group} ${total} ${c.people}, ${a} ${c.a}, ${b} ${c.b} e ${both} ${c.both}. Quanti ${c.people} ${c.atLeast}?`;
				mistakes = [a + b, a + b - 2 * both, none];
			} else if (u < 0.6) {
				none = rng.int(1, 8);
				total = atLeast + none;
				variant = 'nessuno';
				value = none;
				prose = `${c.group} ${total} ${c.people}, ${a} ${c.a}, ${b} ${c.b} e ${both} ${c.both}. Quanti ${c.people} ${c.none}?`;
				mistakes = [total - a - b, atLeast, total - a - b + 2 * both].filter((m) => m >= 0);
			} else if (u < 0.8) {
				none = 0;
				total = atLeast;
				variant = 'entrambi';
				value = both;
				prose = `${c.group} ${total} ${c.people} ${c.everyone}: ${a} ${c.a} e ${b} ${c.b}. Quanti ${c.people} ${c.both}?`;
				mistakes = [a + b, total - a, total - b];
			} else {
				none = rng.int(1, 8);
				total = atLeast + none;
				variant = 'entrambi con nessuno';
				value = both;
				prose = `${c.group} ${total} ${c.people}, ${a} ${c.a}, ${b} ${c.b} e ${none} ${c.none}. Quanti ${c.people} ${c.both}?`;
				mistakes = [a + b - total, both + none, a + b - atLeast + none];
			}
			const A = c.A,
				B = c.B;
			const steps = [`${A} = \\text{quelli che ${c.a}}\\text{, } ${B} = \\text{quelli che ${c.b}}`, `|${A}| = ${a} \\qquad |${B}| = ${b}`];
			if (variant === 'almeno uno') steps.push(`|${A} \\cup ${B}| = |${A}| + |${B}| - |${A} \\cap ${B}| = ${a} + ${b} - ${both} = ${atLeast}`);
			else if (variant === 'nessuno') steps.push(`|${A} \\cup ${B}| = ${a} + ${b} - ${both} = ${atLeast}`, `\\text{Nessuno dei due: } ${total} - ${atLeast} = ${none}`);
			else if (variant === 'entrambi')
				steps.push(
					`\\text{Ognuno sta in almeno un insieme: } |${A} \\cup ${B}| = ${total}`,
					`${total} = ${a} + ${b} - |${A} \\cap ${B}|\\text{, quindi } |${A} \\cap ${B}| = ${a + b} - ${total} = ${both}`,
				);
			else
				steps.push(
					`|${A} \\cup ${B}| = ${total} - ${none} = ${atLeast}`,
					`${atLeast} = ${a} + ${b} - |${A} \\cap ${B}|\\text{, quindi } |${A} \\cap ${B}| = ${a + b} - ${atLeast} = ${both}`,
				);
			steps.push(
				`\\text{Controllo: solo } ${A}\\text{: } ${a - both}\\text{, solo } ${B}\\text{: } ${b - both}\\text{, tutti e due: } ${both}\\text{, nessuno: } ${none}\\text{; in tutto } ${total}`,
			);
			return {
				prompt: 'Risolvi il problema.',
				problem: textBlock(prose),
				solution: `\\text{${value} ${c.people}}`,
				steps,
				answer: { kind: 'number', value: String(value) },
				params: {
					variant,
					context: String(CONTEXTS.indexOf(c)),
					total: String(total),
					a: String(a),
					b: String(b),
					both: String(both),
					none: String(none),
					mistakes: strs(mistakes),
				},
			};
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Check and choice

function truthOf(sample: Sample): El[] | number {
	const p = sample.params;
	switch (sample.level) {
		case 1:
		case 3:
			return [p.A, p.B, p.C].filter(Boolean).reduce<El[]>((acc, s) => union(acc, nums(s)), []);
		case 2: {
			const d = (x: unknown): Desc => {
				const o = x as Record<string, string>;
				return { kind: o.kind as Desc['kind'], k: Number(o.k), n: Number(o.n) };
			};
			return union(descElements(d(p.A)), descElements(d(p.B)));
		}
		case 4:
			return p.variant === 'universo' ? union(nums(p.A), nums(p.U)) : p.variant === 'vuoto' ? nums(p.A) : union(nums(p.A), nums(p.B));
		case 5:
			return p.variant === 'unione'
				? Number(p.a) + Number(p.b) - Number(p.i)
				: p.variant === 'intersezione'
					? Number(p.a) + Number(p.b) - Number(p.u)
					: Number(p.u) - Number(p.a) + Number(p.i);
		case 6:
			return p.variant === 'almeno uno' ? Number(p.a) + Number(p.b) - Number(p.both) : p.variant === 'nessuno' ? Number(p.none) : Number(p.both);
		default:
			throw new Error(`${ID}: unknown level ${sample.level}`);
	}
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const truth = truthOf(sample);
	const a = sample.answer;
	if (typeof truth === 'number') {
		if (a.kind !== 'number' || Number(a.value) !== truth || truth < 0) v.push('conteggio sbagliato');
	} else if (a.kind !== 'set' || !sameSet(a.values.map(Number), truth)) v.push('unione sbagliata');
	const p = sample.params;
	if (sample.level === 6) {
		const total = Number(p.total),
			x = Number(p.a),
			y = Number(p.b),
			both = Number(p.both),
			none = Number(p.none);
		if (x + y - both + none !== total || both > Math.min(x, y) || both < 1 || total > 60) v.push('numeri del problema incoerenti');
		const given = p.variant === 'entrambi' ? [total, x, y] : p.variant === 'entrambi con nessuno' ? [total, x, y, none] : [total, x, y, both];
		if (given.includes(truth as number)) v.push('la risposta è già un numero del testo');
	}
	if (sample.level === 5 && typeof truth === 'number' && truth <= 0) v.push('conteggio non positivo');
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const a = sample.answer;
	if (a.kind === 'number') return numberChoice(rng, Number(a.value), ((sample.params.mistakes ?? []) as string[]).map(Number));
	if (a.kind !== 'set') throw new Error(`${ID}: no choice for ${a.kind}`);
	const truth = a.values.map(Number);
	const wrong = ((sample.params.wrong ?? []) as string[][]).map((w) => w.map(Number));
	// last resort: the union without one element, as if a common element had been dropped
	const fallback = truth.map((x) => truth.filter((y) => y !== x));
	const ch = assembleChoice(rng, setOption(truth), [...wrong, ...shuffle(rng, fallback)].map(setOption));
	if (!ch) throw new Error(`${ID}: not enough distractors for seed ${sample.seed}`);
	return fitSetChoice(ch);
}

export const insiemiUnione: Generator = {
	id: ID,
	title: 'Unione insiemistica',
	levels: {
		1: { label: 'Unione di due insiemi elencati', constraints: ['numeri da 1 a 12', 'circa 60% con elementi in comune, 20% disgiunti, 20% uno incluso nell’altro'] },
		2: { label: 'Insiemi descritti a parole', constraints: ['pari, dispari, multipli di k da 1 a n, divisori di m', 'almeno un elemento in comune, nessuno incluso nell’altro'] },
		3: { label: 'Unione di tre insiemi', constraints: ['A ∪ B ∪ C con al massimo 10 elementi', 'ogni insieme aggiunge qualcosa'] },
		4: { label: 'Proprietà dell’unione', constraints: ['A ⊆ B quindi A ∪ B = B; A ∪ U = U; A ∪ ∅ = A'] },
		5: { label: 'Quanti elementi ha l’unione', constraints: ['|A ∪ B| = |A| + |B| − |A ∩ B|, anche al contrario'] },
		6: { label: 'Problemi', constraints: ['almeno uno, nessuno, tutti e due', 'i numeri tornano: solo A + solo B + tutti e due + nessuno = totale'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 1000; attempt++) {
			const b = build(rng, level);
			if (!b) continue;
			const sample: Sample = { generatorId: ID, level, seed: rng.seed, ...b };
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default insiemiUnione;
