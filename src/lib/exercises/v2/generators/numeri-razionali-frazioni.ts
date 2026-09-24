/**
 * Frazioni e numeri razionali. Spec: specs/exercises/numeri-razionali-frazioni.md
 *
 * Six levels in the order of the lesson: the fraction of a number, from the part to the whole,
 * proper / improper / apparent fractions, equivalent fractions with the cross product, reduction
 * to lowest terms, reduction with signs. Built backwards: the result is chosen first (the whole,
 * the reduced fraction) and the data are obtained by multiplying.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { gcd, q } from '../rational';
import { buildChoice, factorLatex, primeFactors, weighted } from '../razionali';
import { textBlock } from '../insiemi';

export const ID = 'numeri-razionali-frazioni';

// ---------------------------------------------------------------------------
// Fractions as written (not reduced, denominator possibly negative)

interface F {
	n: number;
	d: number;
}

const str = (f: F) => `${f.n}/${f.d}`;

function parseF(s: unknown): F | null {
	if (typeof s !== 'string') return null;
	const m = /^(-?\d+)\/(-?\d+)$/.exec(s);
	if (!m || Number(m[2]) === 0) return null;
	return { n: Number(m[1]), d: Number(m[2]) };
}

/** Exactly as written: "\frac{-36}{-60}", "\frac{42}{-56}", "\frac{15}{35}". */
const writtenTex = (f: F) => `\\frac{${f.n}}{${f.d}}`;

/**
 * An answer fraction: the sign in front when only the numerator is negative ("-\frac{3}{4}"),
 * raw when the denominator is negative ("\frac{3}{-4}", "\frac{-3}{-4}"), an integer when d = 1.
 */
function answerTex(f: F): string {
	if (f.d < 0) return writtenTex(f);
	if (f.d === 1) return `${f.n}`;
	return `${f.n < 0 ? '-' : ''}\\frac{${Math.abs(f.n)}}{${f.d}}`;
}

const t = (s: string) => `\\text{${s}}`;
const fracOf = (a: number | string, b: number | string) => `\\frac{${a}}{${b}}`;

// ---------------------------------------------------------------------------
// Construction

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: Sample['answer'];
	params: Record<string, unknown>;
}

/** A reduced proper fraction a/b with a >= 2 (a = 1 would make "n : b" the right answer). */
function properFraction(rng: Rng, minB = 3, maxB = 10): F {
	for (;;) {
		const b = rng.int(minB, maxB);
		const a = rng.int(2, b - 1);
		if (gcd(a, b) === 1) return { n: a, d: b };
	}
}

function buildOperator(rng: Rng): Built {
	const { n: a, d: b } = properFraction(rng);
	const m = rng.int(2, 15);
	const N = b * m;
	const value = a * m;
	return {
		prompt: 'Calcola la frazione del numero.',
		problem: `${fracOf(a, b)} \\text{ di } ${N}`,
		solution: `${fracOf(a, b)} \\text{ di } ${N} = ${value}`,
		steps: [
			`${t('Dividi per il denominatore: ')} ${N} : ${b} = ${m}`,
			`${t('Moltiplica per il numeratore: ')} ${m} \\cdot ${a} = ${value}`,
		],
		answer: { kind: 'number', value: String(value) },
		params: { fraction: `${a}/${b}`, number: String(N), value: String(value) },
	};
}

type Story = 'classe' | 'somma' | 'libro' | 'percorso';

function storyText(s: Story, a: number, b: number, part: number): { prose: string; unit: string; whole: string } {
	const f = `$${fracOf(a, b)}$`;
	switch (s) {
		case 'classe':
			return { prose: `I ${f} degli studenti di una classe sono ${part}. Quanti sono gli studenti della classe?`, unit: '\\text{ studenti}', whole: 'la classe' };
		case 'somma':
			return { prose: `I ${f} di una somma di denaro sono ${part} euro. A quanto ammonta la somma?`, unit: '\\text{ euro}', whole: 'la somma' };
		case 'libro':
			return { prose: `Giulia ha letto i ${f} delle pagine di un libro, cioè ${part} pagine. Quante pagine ha il libro?`, unit: '\\text{ pagine}', whole: 'il libro' };
		case 'percorso':
			return { prose: `Un ciclista ha percorso i ${f} di un percorso, cioè ${part} km. Quanti chilometri è lungo il percorso?`, unit: '\\text{ km}', whole: 'il percorso' };
	}
}

function buildInverse(rng: Rng): Built {
	const story = rng.pick<Story>(['classe', 'somma', 'libro', 'percorso']);
	let a: number, b: number, m: number;
	for (;;) {
		({ n: a, d: b } = properFraction(rng));
		m = story === 'classe' ? rng.int(2, 6) : rng.int(3, 30);
		if (story === 'classe' && (b * m < 12 || b * m > 32)) continue;
		if (b * m <= 400) break;
	}
	const part = a * m, whole = b * m;
	const st = storyText(story, a, b, part);
	return {
		prompt: 'Risolvi il problema.',
		problem: textBlock(st.prose),
		solution: `${whole}${st.unit}`,
		steps: [
			`${t(`Si conosce la parte e si cerca l'intero: ${a} parti su ${b} valgono ${part}.`)}`,
			`${t('Una parte: ')} ${part} : ${a} = ${m}`,
			`${t(`Tutte le ${b} parti: `)} ${m} \\cdot ${b} = ${whole}`,
			`${t('Controllo: ')} ${fracOf(a, b)} \\text{ di } ${whole} = ${whole} : ${b} \\cdot ${a} = ${part}`,
		],
		answer: { kind: 'number', value: String(whole) },
		params: { fraction: `${a}/${b}`, part: String(part), story, value: String(whole) },
	};
}

type Kind = 'propria' | 'impropria' | 'apparente';

/** Option values: ["propria"], ["impropria", "k"] (between k and k + 1), ["apparente", "k"] (equal to k). */
function kindOption(kind: Kind, k = 0): ChoiceOption {
	if (kind === 'propria') return { latex: t('propria'), values: ['propria'] };
	if (kind === 'impropria') return { latex: `${t('impropria, tra ')}${k}${t(' e ')}${k + 1}`, values: ['impropria', String(k)] };
	return { latex: `${t('apparente, uguale a ')}${k}`, values: ['apparente', String(k)] };
}

function classify(f: F): { kind: Kind; k: number } {
	if (f.n < f.d) return { kind: 'propria', k: 0 };
	const k = Math.floor(f.n / f.d);
	return { kind: f.n % f.d === 0 ? 'apparente' : 'impropria', k };
}

function buildClassify(rng: Rng): Built {
	const kind = weighted<Kind>(rng, [
		['propria', 25],
		['impropria', 45],
		['apparente', 30],
	]);
	const d = rng.int(2, 12);
	let n: number;
	if (kind === 'propria') n = rng.int(1, d - 1);
	else if (kind === 'apparente') n = d * (rng.next() < 0.15 ? 1 : rng.int(2, 9));
	else {
		do n = rng.int(d + 1, 8 * d);
		while (n % d === 0);
	}
	const f = { n, d };
	const c = classify(f);
	const steps: string[] = [];
	if (c.kind === 'propria') steps.push(`${n} < ${d}${t(': il numeratore è minore del denominatore, la frazione è propria e vale meno di 1')}`);
	else {
		steps.push(`${n} ${n === d ? '=' : '>'} ${d}${t(': il numeratore non è minore del denominatore, la frazione è impropria')}`);
		if (c.kind === 'apparente') steps.push(`${n} = ${d} \\cdot ${c.k}${t(': il numeratore è multiplo del denominatore, la frazione è apparente e vale ')}${c.k}`);
		else steps.push(`${n} = ${d} \\cdot ${c.k} + ${n % d}${t(': non è apparente e sta tra ')}${c.k}${t(' e ')}${c.k + 1}`);
	}
	const right = kindOption(c.kind, c.k);
	const rev = classify({ n: d, d: n }); // numerator and denominator read the other way round
	const cands: ChoiceOption[] = [];
	if (c.kind === 'propria') {
		cands.push(kindOption(rev.kind, rev.k), kindOption('impropria', 0), kindOption('impropria', 1), kindOption('apparente', 1));
	} else if (c.kind === 'impropria') {
		cands.push(kindOption('apparente', c.k), kindOption('propria'), kindOption('impropria', c.k > 1 ? c.k - 1 : c.k + 1), kindOption('impropria', c.k + 1));
	} else {
		cands.push(kindOption('impropria', c.k), c.k === 1 ? kindOption('propria') : kindOption('impropria', c.k - 1), kindOption('propria'), kindOption('apparente', c.k + 1));
	}
	const answer = buildChoice(rng, right, cands);
	return {
		prompt: 'Che tipo di frazione è?',
		problem: fracOf(n, d),
		solution:
			c.kind === 'propria'
				? `${fracOf(n, d)}${t(' è propria')}`
				: c.kind === 'apparente'
					? `${fracOf(n, d)} = ${c.k}${t(': è apparente')}`
					: `${c.k} < ${fracOf(n, d)} < ${c.k + 1}${t(': è impropria')}`,
		steps,
		answer,
		params: { fraction: str(f), case: c.kind, k: String(c.k) },
	};
}

/** A reduced positive fraction p/q, not an integer, with p != q. */
function reducedBase(rng: Rng, maxQ = 9): F {
	for (;;) {
		const d = rng.int(2, maxQ);
		const n = rng.int(1, d + 4);
		if (gcd(n, d) === 1) return { n, d };
	}
}

const pairTex = (x: F, y: F) => `${writtenTex(x)} ${t(' e ')} ${writtenTex(y)}`;
const pairOption = (x: F, y: F): ChoiceOption => ({ latex: pairTex(x, y), values: [str(x), str(y)] });
const crossEqual = (x: F, y: F) => x.n * y.d === x.d * y.n;

function buildEquivalence(rng: Rng): Built | null {
	const scaled = (b: F, k: number): F => ({ n: b.n * k, d: b.d * k });
	const twoK = (): [number, number] => {
		const k1 = rng.int(1, 5);
		let k2 = rng.int(2, 6);
		if (k2 === k1) k2 = k1 + 1;
		return [k1, k2];
	};
	// The equivalent pair: the same reduced fraction multiplied by two different numbers.
	const base = reducedBase(rng);
	const [k1, k2] = twoK();
	const right = pairOption(scaled(base, k1), scaled(base, k2));
	const wrong: (ChoiceOption | null)[] = [];
	// Same number added above and below.
	{
		const b = reducedBase(rng);
		const k = rng.int(2, 4);
		const x = scaled(b, k), j = rng.int(1, 4);
		wrong.push(pairOption(x, { n: x.n + j, d: x.d + j }));
	}
	// Numerator and denominator multiplied by different numbers.
	{
		const b = reducedBase(rng);
		const [h1, h2] = twoK();
		const x = scaled(b, h1);
		wrong.push(pairOption(x, { n: b.n * h2, d: b.d * (h2 + 1) }));
	}
	// Cross products that differ by a little.
	{
		const b = reducedBase(rng);
		const [h1, h2] = twoK();
		const y = scaled(b, h2);
		wrong.push(pairOption(scaled(b, h1), { n: y.n + (rng.int(0, 1) ? 1 : -1), d: y.d }));
	}
	for (const o of wrong) {
		if (!o) return null;
		const [x, y] = o.values.map(parseF) as F[];
		if (x.n < 1 || y.n < 1 || x.d < 2 || y.d < 2 || crossEqual(x, y)) return null;
	}
	const fallback = () => {
		const b = reducedBase(rng);
		const [h1, h2] = twoK();
		const y = scaled(b, h2);
		return pairOption(scaled(b, h1), { n: y.n, d: y.d + 1 });
	};
	let answer: ChoiceAnswer;
	try {
		answer = buildChoice(rng, right, wrong, fallback);
	} catch {
		return null;
	}
	const steps = answer.options.map((o) => {
		const [x, y] = o.values.map(parseF) as F[];
		const l = x.n * y.d, r = x.d * y.n;
		return `${pairTex(x, y)}${t(': ')} ${x.n} \\cdot ${y.d} = ${l},\\ ${x.d} \\cdot ${y.n} = ${r}${t(l === r ? ', equivalenti' : ', non equivalenti')}`;
	});
	const [rx, ry] = right.values.map(parseF) as F[];
	return {
		prompt: 'Quale coppia è formata da due frazioni equivalenti?',
		problem: '',
		solution: `${writtenTex(rx)} = ${writtenTex(ry)}`,
		steps,
		answer,
		params: { pairs: answer.options.map((o) => o.values), equivalent: right.values },
	};
}

/** MCD at levels 5 and 6: composite, so dividing by one prime is not enough. */
const MCDS = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24, 28, 30, 35, 36, 42, 45];

function reduceSteps(a: number, b: number, g: number): string[] {
	const out: string[] = [];
	out.push(`${t('Scomponi: ')} ${a} = ${factorLatex(a)},\\quad ${b} = ${factorLatex(b)}`);
	out.push(`\\text{MCD}(${a}, ${b}) = ${factorLatex(g)} = ${g}`);
	out.push(`${fracOf(a, b)} = ${fracOf(`${a} : ${g}`, `${b} : ${g}`)} = ${answerTex({ n: a / g, d: b / g })}`);
	return out;
}

type SignCase = 'positiva' | 'numeratore negativo' | 'denominatore negativo' | 'entrambi negativi';

function buildReduce(rng: Rng, signed: boolean): Built | null {
	const base = reducedBase(rng, 15);
	const g = rng.pick(MCDS);
	const A = base.n * g, B = base.d * g;
	if (A > 400 || B > 400 || Math.max(A, B) < 30) return null;
	const sc: SignCase = signed ? rng.pick<SignCase>(['numeratore negativo', 'denominatore negativo', 'entrambi negativi']) : 'positiva';
	const shown: F = {
		n: sc === 'numeratore negativo' || sc === 'entrambi negativi' ? -A : A,
		d: sc === 'denominatore negativo' || sc === 'entrambi negativi' ? -B : B,
	};
	const sign = sc === 'numeratore negativo' || sc === 'denominatore negativo' ? -1 : 1;
	const p = base.n, qq = base.d;
	const right: F = { n: sign * p, d: qq };
	const opt = (f: F): ChoiceOption => ({ latex: answerTex(f), values: [str(f)] });
	const s = primeFactors(g)[0][0];
	const partial = (div: number, sg: number): F => ({ n: (sg * A) / div, d: B / div });
	const cands: ChoiceOption[] = [];
	if (!signed) {
		cands.push(opt(partial(s, 1))); // stopped after dividing by one prime
		cands.push(opt({ n: p, d: B / (g / s) })); // denominator divided by a different number
		cands.push(opt(partial(g / s, 1))); // stopped after another partial division
		cands.push(opt({ n: qq, d: p })); // upside down
	} else {
		cands.push(opt({ n: -sign * p, d: qq })); // wrong sign
		if (sc === 'entrambi negativi') cands.push(opt({ n: -p, d: -qq })); // reduced, signs left below
		else cands.push(opt({ n: p, d: -qq })); // negative denominator left
		cands.push(opt(partial(s, sign))); // right sign, stopped too early
		cands.push(opt(partial(s, -sign))); // both mistakes
	}
	const fallback = (i: number) => opt({ n: sign * (p + 1 + i), d: qq });
	let answer: ChoiceAnswer;
	try {
		answer = buildChoice(rng, opt(right), cands, fallback);
	} catch {
		return null;
	}
	const steps: string[] = [];
	if (signed) {
		const why =
			sc === 'entrambi negativi'
				? 'Numeratore e denominatore sono tutti e due negativi: la frazione è positiva.'
				: 'Numeratore e denominatore hanno segni diversi: la frazione è negativa, il segno va davanti.';
		steps.push(t(why));
		steps.push(`${writtenTex(shown)} = ${sign < 0 ? '-' : ''}${fracOf(A, B)}`);
	}
	steps.push(...reduceSteps(A, B, g));
	if (signed) steps.push(`${writtenTex(shown)} = ${answerTex(right)}`);
	return {
		prompt: signed ? 'Riduci ai minimi termini, con il denominatore positivo.' : 'Riduci ai minimi termini.',
		problem: writtenTex(shown),
		solution: `${writtenTex(shown)} = ${answerTex(right)}`,
		steps,
		answer: { kind: 'expression', value: right.d === 1 ? String(right.n) : str(right), latex: answerTex(right), form: 'irriducibile' },
		params: { fraction: str(shown), mcd: String(g), value: str(right), case: sc, options: answer.options.map((o) => o.values[0]), correct: String(answer.correct) },
	};
}

function build(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1:
			return buildOperator(rng);
		case 2:
			return buildInverse(rng);
		case 3:
			return buildClassify(rng);
		case 4:
			return buildEquivalence(rng);
		case 5:
			return buildReduce(rng, false);
		case 6:
			return buildReduce(rng, true);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Checks

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const lvl = sample.level;
	const ans = sample.answer;
	if (lvl === 1 || lvl === 2) {
		const f = parseF(p.fraction);
		if (!f || f.n < 2 || f.n >= f.d || f.d > 10 || gcd(f.n, f.d) !== 1) v.push('frazione non propria e ridotta con denominatore fino a 10');
		if (ans.kind !== 'number') return [...v, 'risposta non numerica'];
		if (!f) return v;
		if (lvl === 1) {
			const N = Number(p.number);
			if (N % f.d !== 0 || N > 150) v.push('numero non multiplo del denominatore o troppo grande');
			if (ans.value !== String((N / f.d) * f.n)) v.push('risposta sbagliata');
		} else {
			const part = Number(p.part), whole = Number(ans.value);
			if (!Number.isInteger(whole) || whole * f.n !== part * f.d || whole % f.d !== 0) v.push('risposta sbagliata');
			if (whole > 400) v.push('intero troppo grande');
			if (p.story === 'classe' && (whole < 12 || whole > 32)) v.push('classe con un numero di studenti strano');
		}
	} else if (lvl === 3) {
		const f = parseF(p.fraction);
		if (!f || f.n < 1 || f.d < 2 || f.d > 12) return ['frazione fuori intervallo'];
		if (ans.kind !== 'choice' || ans.options.length !== 4) return ['servono 4 opzioni'];
		const c = classify(f);
		const right = kindOption(c.kind, c.k).values.join('|');
		if (ans.options[ans.correct]?.values.join('|') !== right) v.push('opzione corretta sbagliata');
		if (ans.options.filter((o) => o.values.join('|') === right).length !== 1) v.push('opzione corretta ripetuta');
		if (p.case !== c.kind) v.push('params.case non corrisponde');
	} else if (lvl === 4) {
		if (ans.kind !== 'choice' || ans.options.length !== 4) return ['servono 4 opzioni'];
		const eq = ans.options.map((o) => {
			const [x, y] = o.values.map(parseF);
			if (!x || !y || x.n < 1 || y.n < 1 || x.d < 2 || y.d < 2) v.push('coppia non valida');
			return !!x && !!y && crossEqual(x, y);
		});
		if (eq.filter(Boolean).length !== 1 || !eq[ans.correct]) v.push('non esattamente una coppia equivalente, quella giusta');
	} else if (lvl === 5 || lvl === 6) {
		const f = parseF(p.fraction);
		if (!f) return ['frazione non valida'];
		const g = gcd(f.n, f.d);
		if (g < 4 || primeFactors(g).reduce((s, [, e]) => s + e, 0) < 2) v.push('MCD non composto');
		if (Math.max(Math.abs(f.n), Math.abs(f.d)) > 400) v.push('termini troppo grandi');
		if (Math.abs(f.d) / g < 2) v.push('la frazione ridotta è un intero');
		const truth = q(f.n, f.d);
		if (ans.kind !== 'expression' || ans.value !== truth.toString()) v.push('risposta sbagliata');
		if (lvl === 5 && (f.n < 0 || f.d < 0)) v.push('livello 5 senza segni');
		if (lvl === 6 && f.n > 0 && f.d > 0) v.push('livello 6 senza segno meno');
	} else v.push(`livello sconosciuto ${lvl}`);
	if (!sample.steps.length) v.push('mancano i passaggi');
	return v;
}

// ---------------------------------------------------------------------------
// Multiple choice

const numOpt = (x: number): ChoiceOption => ({ latex: String(x), values: [String(x)] });

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const p = sample.params;
	const lvl = sample.level;
	if (sample.answer.kind === 'choice') return sample.answer;
	if (lvl === 5 || lvl === 6) {
		// Built together with the exercise: the options are in params.
		const values = p.options as string[];
		return { kind: 'choice', options: values.map((s) => ({ latex: answerTex(parseF(s)!), values: [s] })), correct: Number(p.correct) };
	}
	const f = parseF(p.fraction)!;
	const a = f.n, b = f.d;
	const cands: (ChoiceOption | null)[] = [];
	let value: number;
	if (lvl === 1) {
		const N = Number(p.number);
		value = (N / b) * a;
		cands.push(numOpt(N / b)); // divided only
		if (N % a === 0) cands.push(numOpt((N / a) * b)); // divided by the numerator, multiplied by the denominator
		cands.push(numOpt(N - value)); // the part left over
		cands.push(numOpt(N * a)); // multiplied only
	} else {
		const part = Number(p.part);
		value = (part / a) * b;
		if (part % b === 0) cands.push(numOpt((part / b) * a)); // the fraction of the part
		cands.push(numOpt(part / a)); // a single part
		cands.push(numOpt(value - part)); // the rest
		cands.push(numOpt(part * b)); // multiplied only
	}
	const fallback = (i: number) => {
		const d = Math.floor(i / 2) + 1;
		const x = i % 2 ? value - d : value + d;
		return x > 0 ? numOpt(x) : null;
	};
	return buildChoice(rng, numOpt(value), cands.filter((o) => o && Number(o.values[0]) > 0 && o.values[0] !== String(value)), fallback);
}

export const numeriRazionaliFrazioni: Generator = {
	id: ID,
	title: 'Frazioni e numeri razionali',
	levels: {
		1: { label: 'Frazione di un numero', constraints: ['a/b propria e ridotta, a ≥ 2, b fino a 10', 'il numero è un multiplo di b fino a 150'] },
		2: { label: "Dalla parte all'intero", constraints: ['problema con a/b propria e ridotta', "l'intero è un multiplo di b fino a 400"] },
		3: { label: 'Propria, impropria, apparente', constraints: ['termini positivi, denominatore da 2 a 12', 'circa 25% proprie, 45% improprie, 30% apparenti'] },
		4: { label: 'Frazioni equivalenti', constraints: ['quattro coppie, una sola con i prodotti in croce uguali'] },
		5: { label: 'Riduzione ai minimi termini', constraints: ['MCD composto tra 4 e 45', 'termini fino a 400', 'risultato non intero'] },
		6: { label: 'Riduzione con il segno', constraints: ['come il livello 5, con numeratore, denominatore o entrambi negativi', 'risultato con il denominatore positivo'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
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

export default numeriRazionaliFrazioni;

