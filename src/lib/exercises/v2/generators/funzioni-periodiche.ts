/**
 * Funzioni periodiche. Spec: specs/exercises/funzioni-periodiche.md
 *
 * Seven levels in the order of the lesson: the equalities a period gives; a value brought back to the first
 * period, from a positive number and then from a negative one; a value from the formula on one period; integer
 * and fractional part; the period of f(kx) and of the transformations that leave it alone; the zeros in an
 * interval. No trigonometry: it comes in the fourth year.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, NumberAnswer, Rng, Sample, SetAnswer } from '../types';
import { assembleChoice, shuffle } from '../insiemi';
import { type Fx, P, commonCheck, numTex, prose, ratChoice, retry, say, setOption } from '../funzioni';
import { Rational, q } from '../rational';

export const ID = 'funzioni-periodiche';

const mod = (n: number, t: number) => ((n % t) + t) % t;
const first = (t: number) => `[0, ${t}\\mathclose{[}`;

interface Built {
	case: string;
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer | NumberAnswer | SetAnswer;
	params: Record<string, unknown>;
	/** wrong numbers of a number answer, most likely first */
	wrong?: Rational[];
	wrongSets?: number[][];
	decimal?: boolean;
}

const num = (v: Rational): NumberAnswer => ({ kind: 'number', value: v.toString() });

function level1(rng: Rng): Built | null {
	const T = rng.int(2, 9);
	const k = rng.pick([2, 3, 4, -1, -2]);
	const shift = (n: number): ChoiceOption => ({ latex: `f(x ${n < 0 ? '-' : '+'} ${Math.abs(n)}) = f(x)`, values: [`sposta:${n}`] });
	const scale = (n: number): ChoiceOption => ({ latex: `f(${n}x) = f(x)`, values: [`scala:${n}`] });
	const add = (n: number): ChoiceOption => ({ latex: `f(x) + ${n} = f(x)`, values: [`somma:${n}`] });
	const good = shift(k * T);
	const bad = shuffle(rng, [shift(k * T + 1), shift(k * T - 1), shift(T + 1), ...(T % 2 === 0 ? [shift(T / 2)] : []), ...(T > 2 ? [shift(T - 1)] : [])]);
	const ch = assembleChoice(rng, good, [scale(rng.pick([2, 3, T])), bad[0], rng.next() < 0.5 ? add(T) : bad[1], bad[1], bad[2]]);
	if (!ch) return null;
	return {
		case: k < 0 ? "all'indietro" : 'in avanti',
		prompt: 'Quale uguaglianza vale di sicuro per ogni x?',
		problem: prose(`La funzione $f$ ha periodo $${T}$.`),
		solution: good.latex,
		steps: [say(`Con periodo $${T}$ si ha $f(x + ${T}k) = f(x)$ per ogni intero $k$: spostarsi di un multiplo di $${T}$ non cambia il valore.`), say(`$${Math.abs(k * T)} = ${Math.abs(k)} \\cdot ${T}$ è un multiplo del periodo${k < 0 ? ', e vale anche spostandosi all’indietro' : ''}.`), good.latex],
		answer: ch,
		params: { T },
	};
}

function reduce(rng: Rng, negative: boolean): Built | null {
	const T = rng.int(3, 8);
	const n = negative ? -rng.int(1, 5 * T) : rng.int(T + 1, 8 * T);
	const r = mod(n, T);
	const k = (n - r) / T;
	if (!negative && n < 2 * T && rng.next() < 0.5) return null;
	const wrong = negative ? [mod(-n, T), -mod(-n, T), n + T, T - r, Math.abs(k), r + 1, r - 1] : [Math.floor(n / T), n - T, T - r, r + 1, r - 1, n % (T + 1)];
	return {
		case: r === 0 ? 'multiplo del periodo' : negative ? 'negativo' : 'positivo',
		prompt: 'Riporta il numero nel primo periodo.',
		problem: prose(`La funzione $f$ ha periodo $${T}$. Per quale numero $x_0$ dell'intervallo $${first(T)}$ si ha $f(${n}) = f(x_0)$?`),
		solution: `x_0 = ${r}`,
		steps: [
			say(negative ? `Aggiungi $${T}$ a $${n}$ ${-k === 1 ? 'una volta' : `per $${-k}$ volte`}, fino a entrare nell'intervallo.` : `Dividi $${n}$ per $${T}$: il quoziente è $${k}$ e il resto è $${r}$.`),
			negative ? `${n} + ${-k} \\cdot ${T} = ${r}` : `${n} = ${k} \\cdot ${T} + ${r}`,
			`f(${n}) = f(${r})`,
		],
		answer: num(q(r)),
		params: { T, n },
		wrong: wrong.map((w) => q(w)),
	};
}

function level4(rng: Rng): Built | null {
	const T = rng.int(2, 6);
	const kind = rng.pick(['lineare', 'lineare', 'quadrato', 'discesa'] as const);
	let f: Fx;
	let at: (v: number) => number;
	if (kind === 'lineare') {
		const a = rng.pick([1, 2, 3, -1, -2]);
		const b = rng.int(-5, 5);
		if (a === 1 && b === 0) return null;
		f = P(b, a);
		at = (v) => a * v + b;
	} else if (kind === 'quadrato') {
		const b = rng.int(-3, 3);
		f = P(b, 0, 1);
		at = (v) => v * v + b;
	} else {
		f = P(T, -1);
		at = (v) => T - v;
	}
	const n = rng.int(T + 1, 7 * T);
	const r = mod(n, T);
	const k = (n - r) / T;
	const value = at(r);
	if (at(n) === value) return null;
	return {
		case: kind,
		prompt: 'Calcola il valore della funzione.',
		problem: prose(`La funzione $f$ ha periodo $${T}$ e per $0 \\leq x < ${T}$ vale $f(x) = ${f.tex}$. Calcola $f(${n})$.`),
		solution: `f(${n}) = ${value}`,
		steps: [say(`La formula vale solo per $0 \\leq x < ${T}$: prima riporta $${n}$ in quell'intervallo.`), `${n} = ${k} \\cdot ${T} + ${r} \\ \\Rightarrow \\ f(${n}) = f(${r})`, `f(${r}) = ${value}`],
		answer: num(q(value)),
		params: { T, n, fx: f.py },
		wrong: [at(n), r, at(n - T), at(T - r), value + T, k, value + 1, value - 1].map((w) => q(w)),
	};
}

function level5(rng: Rng): Built | null {
	const what = rng.pick(['intera', 'frazionaria'] as const);
	const negative = rng.next() < 0.5;
	const whole = rng.int(0, 9);
	const tenths = rng.int(1, 9);
	const x = q((negative ? -1 : 1) * (10 * whole + tenths), 10);
	const floor = negative ? -whole - 1 : whole;
	const mant = x.sub(q(floor));
	const xt = numTex(x, true);
	const value = what === 'intera' ? q(floor) : mant;
	const trunc = negative ? -whole : whole;
	const wrong = what === 'intera' ? [q(trunc), q(trunc + 1), q(floor - 1), q(tenths), q(-floor), q(floor + 2)] : [q(tenths, 10), q(-tenths, 10), q(10 - tenths, 10), x.abs(), q(tenths), q(1)];
	return {
		case: `${what}, ${negative ? 'negativo' : 'positivo'}`,
		prompt: what === 'intera' ? 'Calcola la parte intera.' : 'Calcola la parte frazionaria.',
		problem: what === 'intera' ? `\\lfloor ${xt} \\rfloor` : `\\operatorname{mant}(${xt})`,
		solution: `${what === 'intera' ? `\\lfloor ${xt} \\rfloor` : `\\operatorname{mant}(${xt})`} = ${numTex(value, true)}`,
		steps: [
			say(`La parte intera è il più grande intero che non supera $${xt}$: $\\lfloor ${xt} \\rfloor = ${floor}$${negative ? `, non $${trunc}$, perché $${trunc} > ${xt}$` : ''}.`),
			...(what === 'frazionaria' ? [`\\operatorname{mant}(${xt}) = ${xt} - ${floor < 0 ? `(${floor})` : floor} = ${numTex(mant, true)}`] : []),
		],
		answer: num(value),
		params: { x: x.toString(), what },
		wrong,
		decimal: true,
	};
}

function level6(rng: Rng): Built | null {
	const kind = rng.pick(['f(kx)', 'f(kx)', 'f(x/k)', 'f(x/k)', 'af+b', 'f(x-a)'] as const);
	const k = rng.int(2, 5);
	const T = kind === 'f(kx)' && rng.next() < 0.6 ? k * rng.int(1, 4) : rng.int(2, 12);
	const a = rng.int(2, 6);
	const b = rng.int(1, 6);
	let g: string;
	let value: Rational;
	let why: string;
	if (kind === 'f(kx)') {
		g = `f(${k}x)`;
		value = q(T, k);
		why = `La $x$ è moltiplicata per $${k}$: il periodo si divide per $${k}$.`;
	} else if (kind === 'f(x/k)') {
		g = `f\\left(\\dfrac{x}{${k}}\\right)`;
		value = q(T * k);
		why = `La $x$ è moltiplicata per $\\frac{1}{${k}}$: il periodo si divide per $\\frac{1}{${k}}$, cioè si moltiplica per $${k}$.`;
	} else if (kind === 'af+b') {
		g = `${a}f(x) ${rng.next() < 0.5 ? '+' : '-'} ${b}`;
		value = q(T);
		why = 'La $x$ non è moltiplicata per niente: cambiare i valori non cambia il periodo.';
	} else {
		g = `f(x ${rng.next() < 0.5 ? '+' : '-'} ${b})`;
		value = q(T);
		why = 'Spostare il grafico in orizzontale non cambia il periodo.';
	}
	const n = kind === 'af+b' ? a : kind === 'f(x-a)' ? b : k;
	return {
		case: kind,
		prompt: 'Trova il periodo della funzione g.',
		problem: prose(`La funzione $f$ ha periodo $${T}$. Qual è il periodo di $g$?`, `g(x) = ${g}`),
		solution: `T = ${value.toLatex()}`,
		steps: [say(why), `T = ${value.toLatex()}`],
		answer: num(value),
		params: { T, g },
		wrong: [q(T * n), q(T, n), q(T + n), q(T), q(Math.abs(T - n) || 1), q(n), q(T + 1)],
	};
}

function level7(rng: Rng): Built | null {
	const T = rng.int(3, 8);
	const a = rng.int(0, T - 1);
	const m = rng.int(-2 * T, 4 * T);
	const len = rng.int(T, 3 * T);
	const n = m + len;
	const zeros: number[] = [];
	for (let v = m; v <= n; v++) if (mod(v - a, T) === 0) zeros.push(v);
	if (zeros.length < 2 || zeros.length > 4) return null;
	const z0 = zeros[0];
	const wrongSets = [
		zeros.slice(1),
		zeros.slice(0, -1),
		[...zeros, zeros[zeros.length - 1] + T],
		[z0 - T, ...zeros],
		zeros.map((_, i) => z0 + i * (T + 1)),
		zeros.map((v) => v + 1),
		zeros.map((_, i) => m + i * T),
		[z0],
		zeros.map((v) => v - 1),
	];
	const answer: SetAnswer = { kind: 'set', values: zeros.map(String), latex: setOption(zeros.map((v) => q(v))).latex };
	return {
		case: `${zeros.length} zeri`,
		prompt: 'Trova gli zeri nell’intervallo indicato.',
		problem: prose(`La funzione $f$ ha periodo $${T}$ e nell'intervallo $${first(T)}$ si annulla solo per $x = ${a}$. Quali sono i suoi zeri nell'intervallo $[${m}, ${n}]$?`),
		solution: answer.latex,
		steps: [say(`Gli zeri sono i numeri $${a === 0 ? '' : `${a} + `}${T}k$, con $k$ intero: da uno zero all'altro si avanza di un periodo.`), say(`Tra $${m}$ e $${n}$, estremi compresi, ci sono: $${zeros.join(',\\ ')}$.`)],
		answer,
		params: { T, a, m, n },
		wrongSets,
	};
}

const LEVELS: Record<number, (rng: Rng) => Built | null> = { 1: level1, 2: (rng) => reduce(rng, false), 3: (rng) => reduce(rng, true), 4: level4, 5: level5, 6: level6, 7: level7 };

function assemble(rng: Rng, level: number): Sample | null {
	const b = LEVELS[level](rng);
	if (!b) return null;
	const params: Record<string, unknown> = { case: b.case, ...b.params };
	if (b.wrong) params.wrong = b.wrong.map(String);
	if (b.wrongSets) params.wrongSets = b.wrongSets;
	if (b.decimal) params.decimal = true;
	const s: Sample = { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params };
	// a level whose wrong answers run out is built again
	try {
		toChoice(s, rng);
	} catch {
		return null;
	}
	return s;
}

function toChoice(s: Sample, rng: Rng): ChoiceAnswer {
	if (s.answer.kind === 'choice') return s.answer;
	const p = s.params as { wrong?: string[]; wrongSets?: number[][]; decimal?: boolean };
	let ch: ChoiceAnswer | null;
	if (s.answer.kind === 'set') {
		const set = (xs: number[]) => setOption(xs.map((v) => q(v)));
		ch = assembleChoice(rng, set(s.answer.values.map(Number)), (p.wrongSets ?? []).map(set));
	} else {
		const v = Rational.parse((s.answer as NumberAnswer).value);
		ch = ratChoice(rng, v, (p.wrong ?? []).map((w) => Rational.parse(w)), !!p.decimal);
	}
	if (!ch) throw new Error(`${ID}: livello ${s.level} senza abbastanza distrattori`);
	return ch;
}

function check(s: Sample): string[] {
	if (!LEVELS[s.level]) return [`livello ${s.level} sconosciuto`];
	const errs = commonCheck(s, s.choice);
	const want = s.level === 1 ? 'choice' : s.level === 7 ? 'set' : 'number';
	if (s.answer.kind !== want) errs.push(`la risposta deve essere di tipo ${want}`);
	if (s.choice && s.answer.kind === 'number' && s.choice.options[s.choice.correct].values[0] !== s.answer.value) errs.push('opzione giusta diversa dalla risposta');
	if (s.choice && s.answer.kind === 'set' && s.choice.options[s.choice.correct].values.join('|') !== s.answer.values.join('|')) errs.push('opzione giusta diversa dalla risposta');
	if ((s.level === 2 || s.level === 3) && s.answer.kind === 'number') {
		const p = s.params as { T: number };
		const v = Number(s.answer.value);
		if (!(v >= 0 && v < p.T)) errs.push('la risposta deve stare nel primo periodo');
	}
	return errs;
}

const generator: Generator = {
	id: ID,
	title: 'Funzioni periodiche',
	levels: {
		1: { label: 'Le uguaglianze del periodo', constraints: ['periodo intero tra 2 e 9', 'una sola uguaglianza con un multiplo del periodo, anche negativo'] },
		2: { label: 'Riportare un numero positivo nel primo periodo', constraints: ['periodo tra 3 e 8, numero intero fino a otto periodi'] },
		3: { label: 'Riportare un numero negativo', constraints: ['come il livello 2, con un numero negativo'] },
		4: { label: 'Un valore dalla formula su un periodo', constraints: ['formula di primo grado, x² + b oppure T - x su [0, T[', 'il valore non coincide con la formula applicata al numero dato'] },
		5: { label: 'Parte intera e parte frazionaria', constraints: ['numero con una cifra decimale, positivo o negativo'] },
		6: { label: 'Il periodo dopo una trasformazione', constraints: ['f(kx), f(x/k), a·f(x) ± b oppure f(x ± b)'] },
		7: { label: 'Gli zeri in un intervallo', constraints: ['un solo zero nel primo periodo', 'da due a quattro zeri nell’intervallo chiuso dato'] },
	},
	generate: (rng, level) => {
		if (!LEVELS[level]) throw new Error(`${ID}: livello ${level} sconosciuto`);
		return retry(ID, level, () => assemble(rng, level));
	},
	check,
	toChoice,
};

export default generator;
