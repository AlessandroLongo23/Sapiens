/**
 * Funzioni pari e dispari. Spec: specs/exercises/funzioni-dispari-pari.md
 *
 * Six levels in the order of the lesson: f(-x) of a polynomial; a polynomial recognised from its exponents;
 * fractions, roots and absolute values on a symmetric domain; the functions whose domain decides; the values
 * the symmetry gives; products and sums of even and odd functions. The answer (even, odd, neither) is chosen
 * first and the formula is built to have it.
 */
import type { ChoiceAnswer, ChoiceOption, ExpressionAnswer, Generator, NumberAnswer, Rng, Sample } from '../types';
import { assembleChoice, pickDistinct, shuffle } from '../insiemi';
import { type Fx, P, abs, commonCheck, frac, fromPoly, intervalLatex, between, labelOption, mul, plus, polyPy, prose, ratChoice, retry, say, sqrt, tx } from '../funzioni';
import { type Poly, poly, polyToLatex } from '../latex';
import { Rational, q } from '../rational';

export const ID = 'funzioni-dispari-pari';

type Parity = 'pari' | 'dispari' | 'ne' | 'entrambe';
const NAMES: Record<Parity, string> = { pari: 'pari', dispari: 'dispari', ne: 'né pari né dispari', entrambe: 'sia pari sia dispari' };
const parityChoice = (rng: Rng, truth: Parity): ChoiceAnswer => {
	const order = shuffle(rng, ['pari', 'dispari', 'ne', 'entrambe'] as Parity[]);
	return { kind: 'choice', options: order.map((k) => labelOption(k, NAMES[k])), correct: order.indexOf(truth) };
};

const nz = (rng: Rng, a: number, b: number): number => {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0) return v;
	}
};

/** A polynomial with integer coefficients on the given degrees. */
function polyOn(rng: Rng, degrees: number[], big = 6): number[] {
	const out = [0, 0, 0, 0, 0, 0];
	for (const d of degrees) out[d] = d >= 3 ? nz(rng, -3, 3) : nz(rng, -big, big);
	return out;
}
const flip = (c: number[], which: (d: number) => boolean) => c.map((v, d) => (which(d) ? -v : v));
const polyOf = (c: number[]): Poly => poly(...c);

// ---------------------------------------------------------------------------

interface Built {
	case: string;
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer | ExpressionAnswer | NumberAnswer;
	params: Record<string, unknown>;
}

const RICONOSCI = 'La funzione è pari, dispari o nessuna delle due?';

function level1(rng: Rng): Built | null {
	const even = pickDistinct(rng, [0, 2, 4], rng.int(1, 2));
	const odd = pickDistinct(rng, [1, 3, 5], rng.int(1, 2));
	if (even.length + odd.length > 3) return null;
	const c = polyOn(rng, [...even, ...odd]);
	const truth = flip(c, (d) => d % 2 === 1);
	const top = Math.max(...even, ...odd);
	const wrong = [flip(c, () => true), c, flip(c, (d) => d % 2 === 0 && d > 0), flip(c, (d) => d === top), flip(c, (d) => d > 0), flip(c, (d) => d % 2 === 0)];
	const tp = polyOf(truth);
	const sub = [...c.keys()]
		.filter((d) => c[d] !== 0)
		.reverse()
		.map((d, i) => {
			const k = Math.abs(c[d]);
			const head = `${i === 0 ? (c[d] < 0 ? '-' : '') : c[d] < 0 ? ' - ' : ' + '}`;
			return d === 0 ? `${head}${k}` : `${head}${k === 1 ? '' : k}(-x)${d === 1 ? '' : `^${d}`}`;
		})
		.join('');
	const answer: ExpressionAnswer = { kind: 'expression', value: polyPy(tp), latex: polyToLatex(tp), form: 'expanded' };
	return {
		case: 'polinomio',
		prompt: 'Calcola f(-x) e scrivi il risultato in forma normale.',
		problem: `f(x) = ${polyToLatex(polyOf(c))}`,
		solution: `f(-x) = ${answer.latex}`,
		steps: [`${tx('Metti ')} -x ${tx(' al posto di ')} x${tx(', tra parentesi:')}`, `f(-x) = ${sub}`, tx('Le potenze con esponente pari non cambiano, quelle con esponente dispari cambiano segno.'), `f(-x) = ${answer.latex}`],
		answer,
		params: { coeffs: c, wrong },
	};
}

function level2(rng: Rng): Built | null {
	const truth = rng.pick(['pari', 'dispari', 'ne'] as const);
	const evens = pickDistinct(rng, [0, 2, 4], rng.int(2, 3));
	const odds = pickDistinct(rng, [1, 3, 5], rng.int(2, 3));
	const [ne, no] = rng.pick([
		[1, 1],
		[1, 2],
		[2, 1],
	]);
	const degrees = truth === 'pari' ? evens : truth === 'dispari' ? odds : [...evens.slice(0, ne), ...odds.slice(0, no)];
	const c = polyOn(rng, degrees);
	const f = fromPoly(polyOf(c));
	const list = [...degrees].sort((a, b) => b - a).join(', ');
	return {
		case: truth,
		prompt: RICONOSCI,
		problem: `f(x) = ${f.tex}`,
		solution: tx(NAMES[truth]),
		steps: [
			say(`Il dominio è $\\mathbb{R}$, simmetrico rispetto allo zero. I termini hanno grado $${list}$${degrees.includes(0) ? ' (il termine noto conta come grado $0$, pari)' : ''}.`),
			truth === 'pari' ? say('Tutti i gradi sono pari: $f(-x) = f(x)$, la funzione è pari.') : truth === 'dispari' ? say('Tutti i gradi sono dispari: $f(-x) = -f(x)$, la funzione è dispari.') : say('Ci sono gradi pari e gradi dispari: la funzione non è né pari né dispari.'),
		],
		answer: parityChoice(rng, truth),
		params: { fx: f.py },
	};
}

/** Functions on a symmetric domain, by parity. */
function symmetric(rng: Rng): { f: Fx; truth: Parity; why: string } {
	const a = rng.int(1, 5);
	const k = rng.int(1, 9);
	const n = nz(rng, -6, 6);
	const X = P(0, 1);
	const X2 = P(0, 0, 1);
	const table: { f: Fx; truth: Parity; why: string }[] = [
		{ f: frac(X, P(-a * a, 0, 1)), truth: 'dispari', why: 'numeratore dispari, denominatore pari' },
		{ f: frac(P(0, n), P(k, 0, 1)), truth: 'dispari', why: 'numeratore dispari, denominatore pari' },
		{ f: frac(X2, P(k, 0, 1)), truth: 'pari', why: 'numeratore e denominatore pari' },
		{ f: frac(P(n), P(-a * a, 0, 1)), truth: 'pari', why: 'la $x$ compare solo al quadrato' },
		{ f: frac(P(0, 1, 0, 1), P(k, 0, 1)), truth: 'dispari', why: 'numeratore dispari, denominatore pari' },
		{ f: frac(P(n, 1), P(k, 0, 1)), truth: 'ne', why: 'il numeratore ha un termine pari e uno dispari' },
		{ f: sqrt(P(a * a, 0, -1)), truth: 'pari', why: 'la $x$ compare solo al quadrato' },
		{ f: mul(X, sqrt(P(a * a, 0, -1))), truth: 'dispari', why: 'prodotto di $x$, dispari, e di una radice pari' },
		{ f: plus(abs(X), n), truth: 'pari', why: '$|-x| = |x|$' },
		{ f: mul(X, abs(X)), truth: 'dispari', why: 'prodotto di $x$, dispari, e di $|x|$, pari' },
		{ f: frac(abs(X), X), truth: 'dispari', why: 'numeratore pari, denominatore dispari' },
		{ f: { tex: `x^2 ${n < 0 ? '-' : '+'} ${Math.abs(n) === 1 ? '' : Math.abs(n)}\\lvert x \\rvert`, py: `x**2 + (${n})*Abs(x)`, sum: true }, truth: 'pari', why: 'somma di due funzioni pari' },
		{ f: { tex: 'x + \\lvert x \\rvert', py: 'x + Abs(x)', sum: true }, truth: 'ne', why: 'somma di una funzione dispari e di una pari' },
		{ f: abs(P(n, 1)), truth: 'ne', why: `$f(1)$ e $f(-1)$ non sono né uguali né opposti` },
		{ f: frac(P(k, 0, 1), X), truth: 'dispari', why: 'numeratore pari, denominatore dispari' },
	];
	return rng.pick(table);
}

function level3(rng: Rng): Built | null {
	const want = rng.pick(['pari', 'dispari', 'ne'] as const);
	let pick = symmetric(rng);
	for (let i = 0; i < 40 && pick.truth !== want; i++) pick = symmetric(rng);
	if (pick.truth !== want) return null;
	const { f, truth, why } = pick;
	return {
		case: truth,
		prompt: RICONOSCI,
		problem: `f(x) = ${f.tex}`,
		solution: tx(NAMES[truth]),
		steps: [
			say('Il dominio è simmetrico rispetto allo zero: si può calcolare $f(-x)$.'),
			say(`Mettendo $-x$ al posto di $x$: ${why}.`),
			truth === 'pari' ? `f(-x) = f(x)${tx(': la funzione è pari.')}` : truth === 'dispari' ? `f(-x) = -f(x)${tx(': la funzione è dispari.')}` : tx('La funzione non è né pari né dispari.'),
		],
		answer: parityChoice(rng, truth),
		params: { fx: f.py },
	};
}

function level4(rng: Rng): Built | null {
	const kase = rng.pick(['dominio dato', 'dominio dato', 'denominatore', 'radice'] as const);
	const X = P(0, 1);
	if (kase === 'dominio dato') {
		const base = rng.pick([
			{ f: P(0, 0, 1), truth: 'pari' as Parity },
			{ f: P(0, 0, 0, 1), truth: 'dispari' as Parity },
			{ f: abs(X), truth: 'pari' as Parity },
			{ f: P(0, nz(rng, -4, 4)), truth: 'dispari' as Parity },
			{ f: P(nz(rng, -5, 5), 0, 1), truth: 'pari' as Parity },
		]);
		const a = rng.int(1, 6);
		const sym = rng.next() < 0.4;
		const d = rng.int(1, 3);
		const [lo, hi] = sym ? [-a, a] : rng.pick([[-a, a + d], [-a - d, a], [0, a], [-a, 0]]);
		const closed = rng.next() < 0.5;
		// a number of the domain whose opposite is outside: the far end, or half a step inside it when the end is left out
		const far = Math.abs(lo) > Math.abs(hi) ? lo : hi;
		const witness = closed ? q(far) : q(2 * far - Math.sign(far), 2);
		const dom = intervalLatex(between(q(lo), closed, q(hi), closed));
		const truth: Parity = sym ? base.truth : 'ne';
		return {
			case: sym ? 'dominio dato simmetrico' : 'dominio dato non simmetrico',
			prompt: RICONOSCI,
			problem: `f(x) = ${base.f.tex}, \\quad D = ${dom}`,
			solution: tx(NAMES[truth]),
			steps: sym
				? [say(`Il dominio $${dom}$ è simmetrico rispetto allo zero.`), base.truth === 'pari' ? `f(-x) = f(x)${tx(': la funzione è pari.')}` : `f(-x) = -f(x)${tx(': la funzione è dispari.')}`]
				: [say(`Il dominio $${dom}$ non è simmetrico rispetto allo zero: contiene $${witness.toLatex()}$ ma non il suo opposto.`), tx('La funzione non è né pari né dispari, qualunque sia la formula.')],
			answer: parityChoice(rng, truth),
			params: { fx: base.f.py, D: [lo, hi, closed] },
		};
	}
	const a = nz(rng, -6, 6);
	const f = kase === 'denominatore' ? frac(rng.pick([P(0, 0, 1), P(0, 0, 0, 1), X]), P(-a, 1)) : rng.pick([sqrt(P(-a, 1)), mul(P(0, 0, 1), sqrt(P(-a, 1))), sqrt(P(a, -1))]);
	const text = kase === 'denominatore' ? `Il dominio è $\\mathbb{R} \\setminus \\{${a}\\}$: contiene $${-a}$ ma non $${a}$.` : 'Il dominio è una semiretta: non contiene gli opposti di tutti i suoi numeri.';
	return {
		case: kase,
		prompt: RICONOSCI,
		problem: `f(x) = ${f.tex}`,
		solution: tx(NAMES.ne),
		steps: [say(text), tx('Il dominio non è simmetrico rispetto allo zero: la funzione non è né pari né dispari.')],
		answer: parityChoice(rng, 'ne'),
		params: { fx: f.py },
	};
}

function level5(rng: Rng): Built | null {
	const parity = rng.pick(['pari', 'dispari'] as const);
	const kase = rng.next() < 0.2 && parity === 'dispari' ? 'zero' : rng.next() < 0.5 ? 'da positivo' : 'da negativo';
	const a = rng.int(1, 9);
	const v = nz(rng, -9, 9);
	if (Math.abs(v) === a) return null;
	const given = kase === 'da negativo' ? -a : a;
	const asked = kase === 'zero' ? 0 : -given;
	const value = kase === 'zero' ? 0 : parity === 'pari' ? v : -v;
	const answer: NumberAnswer = { kind: 'number', value: String(value) };
	const text = `La funzione $f$ è ${parity}, è definita su tutto $\\mathbb{R}$ e $f(${given}) = ${v}$. Quanto vale $f(${asked})$?`;
	return {
		case: `${parity}, ${kase}`,
		prompt: 'Usa la simmetria della funzione.',
		problem: prose(text),
		solution: `f(${asked}) = ${value}`,
		steps:
			kase === 'zero'
				? [say('Una funzione dispari definita in $0$ lì vale $0$: da $f(0) = -f(0)$ segue $f(0) = 0$.'), 'f(0) = 0']
				: [say(parity === 'pari' ? 'In una funzione pari numeri opposti hanno la stessa immagine.' : 'In una funzione dispari numeri opposti hanno immagini opposte.'), `f(${asked}) = ${parity === 'pari' ? '' : '-'}f(${given}) = ${value}`],
		answer,
		params: { parity, given, v, asked, wrong: kase === 'zero' ? [v, -v, given, 1, -given] : [-value, 0, asked, given, value + 1] },
	};
}

type Op = 'prodotto' | 'somma' | 'opposto' | 'assoluto' | 'quadrato';
function level6(rng: Rng): Built | null {
	const op = rng.pick(['prodotto', 'prodotto', 'somma', 'somma', 'opposto', 'assoluto', 'quadrato'] as Op[]);
	const pf = rng.pick(['pari', 'dispari'] as const);
	const pg = rng.pick(['pari', 'dispari'] as const);
	let truth: Parity;
	let h: string;
	let why: string;
	const two = op === 'prodotto' || op === 'somma';
	if (op === 'prodotto') {
		truth = pf === pg ? 'pari' : 'dispari';
		h = 'f(x) \\cdot g(x)';
		why = `Per il prodotto vale la regola dei segni, con pari al posto del più e dispari al posto del meno: ${pf} per ${pg} dà ${truth}.`;
	} else if (op === 'somma') {
		truth = pf === pg ? pf : 'ne';
		h = 'f(x) + g(x)';
		why = pf === pg ? `La somma di due funzioni ${pf} è ${pf}.` : 'La somma di una funzione pari e di una dispari, se nessuna delle due è nulla, non è né pari né dispari.';
	} else if (op === 'opposto') {
		truth = pf;
		h = '-f(x)';
		why = `Cambiare segno a tutti i valori non cambia la simmetria: $h(-x) = -f(-x)$, e la funzione resta ${pf}.`;
	} else if (op === 'assoluto') {
		truth = 'pari';
		h = '\\lvert f(x) \\rvert';
		why = pf === 'pari' ? '$h(-x) = |f(-x)| = |f(x)|$: la funzione è pari.' : '$h(-x) = |f(-x)| = |-f(x)| = |f(x)|$: la funzione è pari.';
	} else {
		truth = 'pari';
		h = '[f(x)]^2';
		why = pf === 'pari' ? '$h(-x) = [f(-x)]^2 = [f(x)]^2$: la funzione è pari.' : '$h(-x) = [f(-x)]^2 = [-f(x)]^2 = [f(x)]^2$: la funzione è pari.';
	}
	const text = two
		? `Le funzioni $f$ e $g$ sono definite su tutto $\\mathbb{R}$ e nessuna delle due vale sempre zero; $f$ è ${pf} e $g$ è ${pg}. Com'è la funzione $h$?`
		: `La funzione $f$ è definita su tutto $\\mathbb{R}$, non vale sempre zero ed è ${pf}. Com'è la funzione $h$?`;
	return {
		case: op,
		prompt: 'Stabilisci se h è pari, dispari o nessuna delle due.',
		problem: prose(text, `h(x) = ${h}`),
		solution: tx(NAMES[truth]),
		steps: [say(why)],
		answer: parityChoice(rng, truth),
		params: { op, pf, pg: two ? pg : null },
	};
}

const LEVELS: Record<number, (rng: Rng) => Built | null> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function assemble(rng: Rng, level: number): Sample | null {
	const b = LEVELS[level](rng);
	if (!b) return null;
	return { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: { case: b.case, ...b.params } };
}

function toChoice(s: Sample, rng: Rng): ChoiceAnswer {
	if (s.answer.kind === 'choice') return s.answer;
	if (s.answer.kind === 'number') {
		const p = s.params as { wrong: number[] };
		const v = Rational.parse(s.answer.value);
		const ch = ratChoice(rng, v, [...p.wrong, v.num + 2, v.num - 2, v.num + 3].map((w) => q(w)));
		if (!ch) throw new Error(`${ID}: livello ${s.level} senza abbastanza distrattori`);
		return ch;
	}
	const p = s.params as { coeffs: number[]; wrong: number[][] };
	const opt = (c: number[]): ChoiceOption => ({ latex: polyToLatex(polyOf(c)), values: [polyPy(polyOf(c))] });
	const ch = assembleChoice(rng, opt(flip(p.coeffs, (d) => d % 2 === 1)), p.wrong.map(opt));
	if (!ch) throw new Error(`${ID}: livello 1 senza abbastanza distrattori`);
	return ch;
}

function check(s: Sample): string[] {
	if (!LEVELS[s.level]) return [`livello ${s.level} sconosciuto`];
	const errs = commonCheck(s, s.choice);
	const want = s.level === 1 ? 'expression' : s.level === 5 ? 'number' : 'choice';
	if (s.answer.kind !== want) errs.push(`la risposta deve essere di tipo ${want}`);
	if (s.level === 1) {
		const c = (s.params as { coeffs: number[] }).coeffs;
		if (!c.some((v, d) => v !== 0 && d % 2 === 0) || !c.some((v, d) => v !== 0 && d % 2 === 1)) errs.push('livello 1: servono termini di grado pari e di grado dispari');
	}
	if (s.choice && s.answer.kind !== 'choice') {
		const right = s.choice.options[s.choice.correct].values[0];
		if (right !== (s.answer as ExpressionAnswer | NumberAnswer).value) errs.push('opzione giusta diversa dalla risposta');
	}
	return errs;
}

const generator: Generator = {
	id: ID,
	title: 'Funzioni pari e dispari',
	levels: {
		1: { label: 'Calcolare f(-x)', constraints: ['polinomio con due o tre termini, di grado pari e di grado dispari', 'risposta in forma normale'] },
		2: { label: 'Riconoscere un polinomio', constraints: ['soli gradi pari, soli gradi dispari o gradi misti, in parti uguali'] },
		3: { label: 'Frazioni, radici e valore assoluto', constraints: ['dominio simmetrico rispetto allo zero', 'pari, dispari e né pari né dispari in parti uguali'] },
		4: { label: 'Il dominio decide', constraints: ['dominio dato come intervallo, oppure un denominatore o una radice che lo rendono non simmetrico'] },
		5: { label: 'Valori con la simmetria', constraints: ['un valore dato e uno da trovare nel punto opposto, oppure f(0) per una funzione dispari'] },
		6: { label: 'Operazioni tra funzioni pari e dispari', constraints: ['prodotto, somma, opposto, valore assoluto o quadrato'] },
	},
	generate: (rng, level) => {
		if (!LEVELS[level]) throw new Error(`${ID}: livello ${level} sconosciuto`);
		return retry(ID, level, () => assemble(rng, level));
	},
	check,
	toChoice,
};

export default generator;
