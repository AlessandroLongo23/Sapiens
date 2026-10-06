/**
 * Funzioni crescenti e decrescenti. Spec: specs/exercises/funzioni-monotone.md
 *
 * Seven levels in the order of the lesson: the definition, in the strict and in the wide sense; the line; the
 * parabola with a > 0; the parabola with a < 0; the absolute value; the functions that are monotonic on their
 * whole domain (and 1/x, which is not); the inequalities a monotonic function lets you solve.
 *
 * The intervals of monotonicity are closed at the turning point, as the lesson writes them; no wrong option is
 * the right interval with the end left out, because many books write it that way.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { assembleChoice, shuffle } from '../insiemi';
import { type Fx, type Iv, P, abs, commonCheck, from, fxOption, ivChoice, ivsLatex, ivValue, labelOption, neg, plus, prose, retry, say, sqrt, times, tx, upTo } from '../funzioni';
import { q } from '../rational';

export const ID = 'funzioni-monotone';

const nz = (rng: Rng, a: number, b: number): number => {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0) return v;
	}
};
const R = (n: number) => q(n);
const X = P(0, 1);

interface Built {
	case: string;
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer;
	params: Record<string, unknown>;
}

const DEF = {
	crescente: 'crescente',
	decrescente: 'decrescente',
	'crescente-lato': 'crescente in senso lato',
	'decrescente-lato': 'decrescente in senso lato',
} as const;
type DefKey = keyof typeof DEF;

function labels<K extends string>(rng: Rng, names: Record<K, string>, truth: K): ChoiceAnswer {
	const order = shuffle(rng, Object.keys(names) as K[]);
	return { kind: 'choice', options: order.map((k) => labelOption(k, names[k])), correct: order.indexOf(truth) };
}

function level1(rng: Rng): Built | null {
	const truth = rng.pick(Object.keys(DEF) as DefKey[]);
	const diff = rng.next() < 0.4;
	const up = truth.startsWith('crescente');
	const wide = truth.endsWith('lato');
	// f(x1) ? f(x2), or f(x2) - f(x1) ? 0
	const rel = diff ? (up ? (wide ? '\\geq' : '>') : wide ? '\\leq' : '<') : up ? (wide ? '\\leq' : '<') : wide ? '\\geq' : '>';
	const formula = diff ? `f(x_2) - f(x_1) ${rel} 0` : `f(x_1) ${rel} f(x_2)`;
	return {
		case: `${truth}, ${diff ? 'differenza' : 'confronto'}`,
		prompt: "Com'è la funzione nell'intervallo I?",
		problem: prose('Per ogni coppia di numeri $x_1 < x_2$ di un intervallo $I$ si ha', formula),
		solution: tx(DEF[truth]),
		steps: [
			diff ? say(`La differenza $f(x_2) - f(x_1)$ è ${up ? (wide ? 'positiva o nulla' : 'positiva') : wide ? 'negativa o nulla' : 'negativa'}: al numero più grande corrisponde un valore ${up ? (wide ? 'non più piccolo' : 'più grande') : wide ? 'non più grande' : 'più piccolo'}.`) : say(`Al numero più grande, $x_2$, corrisponde un valore ${up ? (wide ? 'non più piccolo' : 'più grande') : wide ? 'non più grande' : 'più piccolo'}.`),
			say(wide ? `C'è anche l'uguale: la funzione è ${DEF[truth]}.` : `Non c'è l'uguale: la funzione è ${DEF[truth]} (in senso stretto).`),
		],
		answer: labels(rng, DEF, truth),
		params: {},
	};
}

const LINE = ['crescente', 'decrescente', 'costante', 'meta'] as const;
type Line = (typeof LINE)[number];

function level2(rng: Rng): Built | null {
	const kase = rng.next() < 0.12 ? 'costante' : rng.next() < 0.5 ? 'crescente' : 'decrescente';
	const qq = rng.int(-9, 9);
	let f: Fx;
	let mTex = '0';
	if (kase === 'costante') {
		if (qq === 0) return null;
		f = P(qq);
	} else {
		const half = rng.next() < 0.25;
		const k = rng.int(1, half ? 3 : 5) * (kase === 'crescente' ? 1 : -1);
		const m = half ? q(k, 2) : q(k);
		mTex = m.toLatex();
		const reversed = qq !== 0 && rng.next() < 0.4;
		const mx = `${m.abs().isOne() ? '' : m.abs().toLatex()}x`;
		const py = `(${m.num})*x/${m.den} + (${qq})`;
		f = reversed ? { tex: `${qq} ${m.sign() < 0 ? '-' : '+'} ${mx}`, py, sum: true } : { tex: `${m.sign() < 0 ? '-' : ''}${mx}${qq === 0 ? '' : ` ${qq < 0 ? '-' : '+'} ${Math.abs(qq)}`}`, py, sum: true };
	}
	const order = shuffle(rng, [...LINE]);
	const texOf = (k: Line) => (k === 'costante' ? tx('costante') : k === 'meta' ? say('crescente solo per $x > 0$') : say(`${k} su tutto $\\mathbb{R}$`));
	const answer: ChoiceAnswer = { kind: 'choice', options: order.map((k) => ({ latex: texOf(k), values: [k] })), correct: order.indexOf(kase) };
	return {
		case: kase,
		prompt: 'Stabilisci se la funzione è crescente, decrescente o costante.',
		problem: `f(x) = ${f.tex}`,
		solution: texOf(kase),
		steps:
			kase === 'costante'
				? [say('La $x$ non compare: il coefficiente angolare è $0$ e la funzione è costante.')]
				: [say(`È una retta con coefficiente angolare $m = ${mTex}$, il numero che moltiplica la $x$.`), say(kase === 'crescente' ? '$m > 0$: la funzione è crescente su tutto $\\mathbb{R}$.' : '$m < 0$: la funzione è decrescente su tutto $\\mathbb{R}$.')],
		answer,
		params: { fx: f.py },
	};
}

/** The interval asked for, and the wrong ones, around the turning point t of a function that goes `after` to its right. */
function turning(rng: Rng, f: Fx, t: number, after: 'crescente' | 'decrescente', lures: number[], why: string[], kase: string): Built | null {
	const ask = rng.pick(['crescente', 'decrescente'] as const);
	const right = ask === after;
	const side = (v: number, r: boolean): Iv[] => [r ? from(R(v), true) : upTo(R(v), true)];
	const truth = side(t, right);
	const cands = [side(t, !right), ...lures.filter((v) => v !== t).flatMap((v) => [side(v, right), side(v, !right)])];
	const ch = ivChoice(rng, truth, cands);
	if (!ch) return null;
	return {
		case: `${kase}, ${ask}`,
		prompt: `In quale intervallo la funzione è ${ask}?`,
		problem: `f(x) = ${f.tex}`,
		solution: ivsLatex(truth),
		steps: [...why, say(`La funzione è ${ask} in $${ivsLatex(truth)}$.`)],
		answer: ch,
		params: { fx: f.py, truth: truth.map(ivValue), ask },
	};
}

function parabola(rng: Rng, sign: 1 | -1): Built | null {
	const a = sign * rng.pick([1, 1, 1, 2, 3]);
	const xv = nz(rng, -5, 5);
	const b = -2 * a * xv;
	const c = rng.int(-9, 9);
	const yv = a * xv * xv + b * xv + c;
	const f = P(c, b, a);
	return turning(
		rng,
		f,
		xv,
		sign > 0 ? 'crescente' : 'decrescente',
		[-xv, yv, c, 2 * xv, -b],
		[
			`x_V = -\\dfrac{b}{2a} = -\\dfrac{${b}}{${2 * a}} = ${xv}`,
			say(sign > 0 ? '$a > 0$: la parabola scende fino al vertice e poi sale.' : '$a < 0$: la parabola sale fino al vertice e poi scende.'),
		],
		sign > 0 ? 'a positivo' : 'a negativo',
	);
}

function level5(rng: Rng): Built | null {
	const a = nz(rng, -7, 7);
	const b = rng.int(-6, 6);
	const down = rng.next() < 0.45;
	const inner = abs(P(-a, 1));
	const f = plus(down ? neg(inner) : inner, b);
	return turning(
		rng,
		f,
		a,
		down ? 'decrescente' : 'crescente',
		[-a, b, a + b, 0],
		[
			say(`L'argomento del valore assoluto si annulla in $x = ${a}$: lì il grafico ha il vertice.`),
			say(down ? 'Con il meno davanti la V è rovesciata: sale fino al vertice e poi scende.' : 'Il grafico è una V: scende fino al vertice e poi sale.'),
		],
		down ? 'V rovesciata' : 'V',
	);
}

function level6(rng: Rng): Built | null {
	const ask = rng.pick(['crescente', 'decrescente'] as const);
	const k = () => nz(rng, -6, 6);
	const m = () => rng.int(1, 4);
	const inc: Fx[] = [P(k(), 0, 0, 1), sqrt(P(k(), 1)), P(k(), m()), P(0, m(), 0, 1), times(2, sqrt(X)), plus(sqrt(X), k())];
	const dec: Fx[] = [P(k(), 0, 0, -1), P(k(), -m()), sqrt(P(k(), -1)), neg(sqrt(X)), P(0, -m(), 0, -1)];
	const none: Fx[] = [P(k(), 0, 1), plus(abs(X), k()), P(k(), 0, -1), abs(P(k(), 1)), P(0, -3, 0, 1)];
	const hyper = (sgn: number): Fx => {
		const n = rng.int(1, 4);
		return { tex: `${sgn < 0 ? '-' : ''}\\dfrac{${n}}{x}`, py: `(${sgn * n})/x`, sum: sgn < 0 };
	};
	const good = rng.pick(ask === 'crescente' ? inc : dec);
	// the hyperbola that goes the asked way on each branch, but not on its whole domain
	const trap = hyper(ask === 'crescente' ? -1 : 1);
	const others = shuffle(rng, [rng.pick(ask === 'crescente' ? dec : inc), ...shuffle(rng, none).slice(0, 2), hyper(ask === 'crescente' ? 1 : -1)]);
	const cands = rng.next() < 0.75 ? [trap, ...others] : others;
	const ch = assembleChoice(
		rng,
		fxOption(good),
		cands.map((c) => fxOption(c)),
	);
	if (!ch) return null;
	const hasTrap = ch.options.some((o) => o.values[0] === trap.py);
	return {
		case: `${ask}${hasTrap ? ', con iperbole' : ''}`,
		prompt: `Quale funzione è ${ask} in tutto il suo dominio?`,
		problem: tx(`Una sola delle quattro funzioni è ${ask} in tutto il suo dominio.`),
		solution: `y = ${good.tex}`,
		steps: [
			say(`$y = ${good.tex}$ è ${ask} in tutto il suo dominio.`),
			hasTrap ? say(`$y = ${trap.tex}$ è ${ask} per $x < 0$ e per $x > 0$, ma non in tutto il dominio: passando da un ramo all'altro il valore ${ask === 'crescente' ? 'diminuisce' : 'aumenta'}.`) : tx('Le altre cambiano verso, oppure vanno nel verso contrario.'),
		],
		answer: ch,
		params: { ask },
	};
}

function level7(rng: Rng): Built | null {
	const mono = rng.pick(['crescente', 'decrescente'] as const);
	const a = rng.int(-8, 8);
	const k = rng.next() < 0.5 ? 0 : nz(rng, -6, 6);
	if (k === a) return null;
	const rel = rng.pick(['>', '<'] as const);
	const right = (mono === 'crescente') === (rel === '>');
	const ray = (v: number, r: boolean, c: boolean): Iv[] => [r ? from(R(v), c) : upTo(R(v), c)];
	const truth = ray(a, right, false);
	const lure = k !== 0 ? k : -a;
	const ch = ivChoice(rng, truth, [ray(a, !right, false), ray(a, right, true), ray(lure, right, false), ray(a, !right, true), ray(lure, !right, false), ray(a + 1, right, false)]);
	if (!ch) return null;
	return {
		case: `${mono}, ${rel === '>' ? 'maggiore' : 'minore'}`,
		prompt: 'Risolvi la disequazione usando la monotonia.',
		problem: prose(`La funzione $f$ è ${mono} su tutto $\\mathbb{R}$ e $f(${a}) = ${k}$. Per quali $x$ si ha $f(x) ${rel} ${k}$?`),
		solution: ivsLatex(truth),
		steps: [
			say(`Scrivi $${k}$ come valore della funzione: $f(x) ${rel} f(${a})$.`),
			say(mono === 'crescente' ? 'La funzione è crescente: tra gli argomenti il verso resta lo stesso.' : 'La funzione è decrescente: tra gli argomenti il verso si rovescia.'),
			`x ${right ? '>' : '<'} ${a}`,
		],
		answer: ch,
		params: { mono, a, k, rel, truth: truth.map(ivValue) },
	};
}

const LEVELS: Record<number, (rng: Rng) => Built | null> = { 1: level1, 2: level2, 3: (rng) => parabola(rng, 1), 4: (rng) => parabola(rng, -1), 5: level5, 6: level6, 7: level7 };

function assemble(rng: Rng, level: number): Sample | null {
	const b = LEVELS[level](rng);
	if (!b) return null;
	return { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: { case: b.case, ...b.params } };
}

function check(s: Sample): string[] {
	if (!LEVELS[s.level]) return [`livello ${s.level} sconosciuto`];
	const errs = commonCheck(s, undefined);
	if (s.answer.kind !== 'choice') return [...errs, 'la risposta deve essere a scelta multipla'];
	const p = s.params as { truth?: string[] };
	if (p.truth) {
		const right = s.answer.options[s.answer.correct].values;
		if (right.join('|') !== p.truth.join('|')) errs.push('opzione giusta diversa dalla risposta');
		// the same interval with the end left out is how many books write it: never a wrong option
		const open = p.truth.map((t) => t.replace('[', '(').replace(']', ')')).join('|');
		if ([3, 4, 5].includes(s.level) && s.answer.options.some((o) => o.values.join('|') === open)) errs.push("un distrattore è l'intervallo giusto scritto aperto");
	}
	return errs;
}

const generator: Generator = {
	id: ID,
	title: 'Funzioni crescenti e decrescenti',
	levels: {
		1: { label: 'La definizione', constraints: ['le quattro disuguaglianze, come confronto o come segno della differenza'] },
		2: { label: 'La retta', constraints: ['coefficiente angolare intero o con denominatore 2, anche scritto dopo il termine noto', 'una retta orizzontale ogni otto circa'] },
		3: { label: 'La parabola con a positivo', constraints: ['vertice di ascissa intera non nulla tra -5 e 5', 'intervallo chiuso nel vertice'] },
		4: { label: 'La parabola con a negativo', constraints: ['come il livello 3, con a negativo'] },
		5: { label: 'Il valore assoluto', constraints: ['±|x - a| + b con a intero non nullo'] },
		6: { label: 'Monotona in tutto il dominio', constraints: ['quattro funzioni, una sola con la proprietà', 'in tre casi su quattro tra le opzioni c’è un’iperbole che va nel verso chiesto solo ramo per ramo'] },
		7: { label: 'Disequazioni con la monotonia', constraints: ['f crescente o decrescente su ℝ, un valore noto, verso > o <', 'semiretta aperta'] },
	},
	generate: (rng, level) => {
		if (!LEVELS[level]) throw new Error(`${ID}: livello ${level} sconosciuto`);
		return retry(ID, level, () => assemble(rng, level));
	},
	check,
};

export default generator;
