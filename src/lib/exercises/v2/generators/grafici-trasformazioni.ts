/**
 * Trasformazioni dei grafici. Spec: specs/exercises/grafici-trasformazioni.md
 *
 * Seven levels in the order of the lesson: where a point goes in a vertical or horizontal translation; the
 * vertex or starting point of a translated graph; the symmetries; the dilations; from the description of a
 * transformation to the formula; the two absolute values; several transformations in a row. The exercises are on
 * points and formulas: no graph is drawn.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { assembleChoice } from '../insiemi';
import { type Fx, P, abs, commonCheck, fxOption, neg, plus, pointChoice, pointTex, power, prose, retry, say, sqrt } from '../funzioni';
import { type Rational, q } from '../rational';

export const ID = 'grafici-trasformazioni';

const nz = (rng: Rng, a: number, b: number): number => {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0) return v;
	}
};
type Pt = [Rational, Rational];
const pt = (x: number, y: number): Pt => [q(x), q(y)];
const tex = (p: Pt) => pointTex(p[0], p[1]);
const sg = (n: number) => `${n < 0 ? '-' : '+'} ${Math.abs(n)}`;

interface Built {
	case: string;
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer;
	params: Record<string, unknown>;
}

const DOVE = 'Trova il punto del nuovo grafico.';

/** "Il grafico di f passa per P(a, b). Per quale punto passa di sicuro il grafico di g?" with g under it. */
function pointProblem(rng: Rng, kase: string, P0: Pt, g: string, truth: Pt, wrong: Pt[], steps: string[], other = false): Built | null {
	const ch = pointChoice(rng, truth, wrong);
	if (!ch) return null;
	const ask = other ? `Oltre che per $P$, per quale punto passa di sicuro il grafico di $g$?` : `Per quale punto passa di sicuro il grafico di $g$?`;
	return {
		case: kase,
		prompt: DOVE,
		problem: prose(`Il grafico di $f$ passa per il punto $P${tex(P0)}$. ${ask}`, `g(x) = ${g}`),
		solution: tex(truth),
		steps: [...steps, tex(truth)],
		answer: ch,
		params: { P: P0.map(String), truth: truth.map(String) },
	};
}

function level1(rng: Rng): Built | null {
	const a = nz(rng, -7, 7);
	const b = nz(rng, -7, 7);
	const d = nz(rng, -6, 6);
	if (d === a || d === b || d === -a) return null;
	if (rng.next() < 0.5) {
		return pointProblem(rng, 'verticale', pt(a, b), `f(x) ${sg(d)}`, pt(a, b + d), [pt(a + d, b), pt(a, b - d), pt(a - d, b), pt(a + d, b + d)], [
			say(`Il numero è aggiunto fuori da $f$: cambiano le ordinate, e il grafico si sposta in ${d > 0 ? 'su' : 'giù'} di $${Math.abs(d)}$.`),
		]);
	}
	// f(x - d): d to the right
	return pointProblem(rng, 'orizzontale', pt(a, b), `f(x ${sg(-d)})`, pt(a + d, b), [pt(a - d, b), pt(a, b + d), pt(a, b - d), pt(a - d, b - d)], [
		say(`Il numero è dentro $f$, accanto alla $x$: cambiano le ascisse, nel verso contrario al segno. Il grafico si sposta a ${d > 0 ? 'destra' : 'sinistra'} di $${Math.abs(d)}$.`),
	]);
}

function level2(rng: Rng): Built | null {
	const a = nz(rng, -7, 7);
	const b = nz(rng, -7, 7);
	if (Math.abs(a) === Math.abs(b)) return null;
	const base = rng.pick(['assoluto', 'radice', 'parabola'] as const);
	const inner = P(-a, 1);
	const f = plus(base === 'assoluto' ? abs(inner) : base === 'radice' ? sqrt(inner) : power(inner, 2), b);
	const what = base === 'radice' ? 'punto da cui parte il grafico' : 'vertice';
	const baseTex = base === 'assoluto' ? '\\lvert x \\rvert' : base === 'radice' ? '\\sqrt{x}' : 'x^2';
	const truth = pt(a, b);
	const ch = pointChoice(rng, truth, [pt(-a, b), pt(a, -b), pt(b, a), pt(-a, -b), pt(-b, a)]);
	if (!ch) return null;
	return {
		case: base,
		prompt: base === 'radice' ? 'Trova il punto da cui parte il grafico.' : 'Trova il vertice del grafico.',
		problem: `y = ${f.tex}`,
		solution: tex(truth),
		steps: [
			say(`È il grafico di $y = ${baseTex}$ traslato: dentro c'è $x ${sg(-a)}$${a < 0 ? `, cioè $x - (${a})$` : ''}, fuori c'è $${sg(b)}$.`),
			say(`Il vettore della traslazione è $\\vec{v}${tex(truth)}$: il ${what}, che era nell'origine, va in $${tex(truth)}$.`),
		],
		answer: ch,
		params: { fx: f.py, truth: truth.map(String) },
	};
}

function level3(rng: Rng): Built | null {
	const a = nz(rng, -8, 8);
	const b = nz(rng, -8, 8);
	if (Math.abs(a) === Math.abs(b)) return null;
	const kind = rng.pick(['asse x', 'asse y', 'origine'] as const);
	const all: Record<string, Pt> = { 'asse x': pt(a, -b), 'asse y': pt(-a, b), origine: pt(-a, -b) };
	const g = kind === 'asse x' ? '-f(x)' : kind === 'asse y' ? 'f(-x)' : '-f(-x)';
	const why = kind === 'asse x' ? 'Il meno è fuori da $f$: cambia segno l’ordinata, e il grafico si ribalta rispetto all’asse $x$.' : kind === 'asse y' ? 'Il meno è dentro $f$: cambia segno l’ascissa, e il grafico si ribalta rispetto all’asse $y$.' : 'I meno sono due, dentro e fuori: cambiano segno tutte e due le coordinate, e il grafico si ribalta rispetto all’origine.';
	const wrong = [...Object.keys(all).filter((k) => k !== kind).map((k) => all[k]), pt(b, a), pt(-b, -a)];
	return pointProblem(rng, kind, pt(a, b), g, all[kind], wrong, [say(why)]);
}

function level4(rng: Rng): Built | null {
	const k = rng.int(2, 4);
	const kind = rng.pick(['k f(x)', 'f(kx)', 'f(x/k)', 'f(x)/k'] as const);
	const a = nz(rng, -4, 4) * (kind === 'f(kx)' ? k : 1);
	const b = nz(rng, -4, 4) * (kind === 'f(x)/k' ? k : 1);
	if (a === b) return null;
	if (kind === 'k f(x)')
		return pointProblem(rng, kind, pt(a, b), `${k}f(x)`, pt(a, k * b), [pt(k * a, b), [q(a), q(b, k)], [q(a, k), q(b)], pt(k * a, k * b)], [say(`Il fattore $${k}$ è fuori da $f$: le ordinate si moltiplicano per $${k}$.`)]);
	if (kind === 'f(x)/k')
		return pointProblem(rng, kind, pt(a, b), `\\dfrac{1}{${k}}f(x)`, pt(a, b / k), [[q(a, k), q(b)], pt(a, b * k), pt(a * k, b), [q(a, k), q(b, k)]], [say(`Il fattore $\\frac{1}{${k}}$ è fuori da $f$: le ordinate si dividono per $${k}$.`)]);
	if (kind === 'f(kx)')
		return pointProblem(rng, kind, pt(a, b), `f(${k}x)`, pt(a / k, b), [pt(a * k, b), pt(a, b * k), [q(a), q(b, k)], pt(a / k, b * k)], [say(`Il fattore $${k}$ è dentro $f$: le ascisse si dividono per $${k}$, e il grafico si stringe.`)]);
	return pointProblem(rng, kind, pt(a, b), `f\\left(\\dfrac{x}{${k}}\\right)`, pt(a * k, b), [[q(a, k), q(b)], pt(a, b * k), [q(a), q(b, k)], pt(a * k, b * k)], [say(`La $x$ è divisa per $${k}$, dentro $f$: le ascisse si moltiplicano per $${k}$, e il grafico si allarga.`)]);
}

function level5(rng: Rng): Built | null {
	const base = rng.pick(['assoluto', 'radice', 'parabola'] as const);
	const X = P(0, 1);
	const mk = (inner: Fx): Fx => (base === 'assoluto' ? abs(inner) : base === 'radice' ? sqrt(inner) : power(inner, 2));
	const baseF = mk(X);
	const kind = rng.pick(base === 'radice' ? (['traslazione', 'traslazione', 'asse x', 'asse y', 'ribaltata e alzata'] as const) : (['traslazione', 'traslazione', 'asse x', 'ribaltata e alzata'] as const));
	const h = nz(rng, -6, 6);
	const k = nz(rng, -6, 6);
	if (Math.abs(h) === Math.abs(k)) return null;
	let text: string;
	let good: Fx;
	let bad: Fx[];
	let why: string;
	if (kind === 'traslazione') {
		text = `viene traslato del vettore $\\vec{v}(${h}, ${k})$`;
		good = plus(mk(P(-h, 1)), k);
		bad = [plus(mk(P(h, 1)), k), plus(mk(P(-k, 1)), h), plus(mk(P(-h, 1)), -k), plus(mk(P(h, 1)), -k)];
		why = `Sostituisci $x$ con $x ${sg(-h)}$${h < 0 ? `, cioè $x - (${h})$,` : ''} e aggiungi $${k}$ al risultato.`;
	} else if (kind === 'asse x') {
		text = 'viene ribaltato rispetto all’asse $x$';
		good = neg(baseF);
		bad = base === 'radice' ? [mk(P(0, -1)), neg(mk(P(0, -1))), plus(baseF, -1)] : [plus(baseF, -1), neg(plus(mk(P(-1, 1)), 0)), mk(P(-1, 1)), plus(neg(baseF), 1)];
		why = 'Ribaltare rispetto all’asse $x$ cambia segno alle ordinate: il meno va davanti a tutta la funzione.';
	} else if (kind === 'asse y') {
		text = 'viene ribaltato rispetto all’asse $y$';
		good = mk(P(0, -1));
		bad = [neg(baseF), neg(mk(P(0, -1))), plus(baseF, -1), mk(P(-1, 1))];
		why = 'Ribaltare rispetto all’asse $y$ cambia segno alle ascisse: il meno va dentro, davanti alla $x$.';
	} else {
		const up = Math.abs(k);
		text = `viene ribaltato rispetto all’asse $x$ e poi spostato in su di $${up}$`;
		good = plus(neg(baseF), up);
		bad = [plus(neg(baseF), -up), neg(mk(P(up, 1))), neg(mk(P(-up, 1))), plus(baseF, up)];
		why = `Prima il meno davanti alla funzione, poi $+ ${up}$ al risultato.`;
	}
	const ch = assembleChoice(
		rng,
		fxOption(good),
		bad.map((c) => fxOption(c)),
	);
	if (!ch) return null;
	return {
		case: kind,
		prompt: 'Scrivi l’equazione del nuovo grafico.',
		problem: prose(`Il grafico di $y = ${baseF.tex}$ ${text}. Qual è l'equazione del nuovo grafico?`),
		solution: `y = ${good.tex}`,
		steps: [say(why), `y = ${good.tex}`],
		answer: ch,
		params: { base, kind, h, k },
	};
}

function level6(rng: Rng): Built | null {
	const outside = rng.next() < 0.5;
	if (outside) {
		const a = nz(rng, -8, 8);
		const b = -rng.int(1, 8);
		if (Math.abs(a) === Math.abs(b)) return null;
		return pointProblem(rng, 'fuori', pt(a, b), '\\lvert f(x) \\rvert', pt(a, -b), [pt(-a, b), pt(-a, -b), pt(a, b), pt(-b, a)], [
			say(`Il valore assoluto è fuori da $f$: l'ordinata $${b}$ è negativa e cambia segno, l'ascissa resta.`),
		]);
	}
	const a = rng.int(1, 8);
	const b = nz(rng, -8, 8);
	if (a === Math.abs(b)) return null;
	return pointProblem(
		rng,
		'dentro',
		pt(a, b),
		'f(\\lvert x \\rvert)',
		pt(-a, b),
		[pt(a, -b), pt(-a, -b), pt(b, a), pt(-b, a), pt(a, Math.abs(b) === b ? b + 1 : -b + 1)],
		[say(`Il valore assoluto è dentro $f$: la parte del grafico con $x \\geq 0$ resta e si copia a sinistra, simmetrica rispetto all'asse $y$.`), say(`$g(${-a}) = f(|${-a}|) = f(${a}) = ${b}$.`)],
		true,
	);
}

function level7(rng: Rng): Built | null {
	const a = nz(rng, -6, 6);
	const b = nz(rng, -5, 5);
	if (rng.next() < 0.6) {
		const c = rng.pick([-1, 2, -2, 3]);
		const h = nz(rng, -5, 5);
		const k = nz(rng, -6, 6);
		const g = `${c === -1 ? '-' : c}f(x ${sg(-h)}) ${sg(k)}`;
		return pointProblem(rng, 'fuori e dentro', pt(a, b), g, pt(a + h, c * b + k), [pt(a - h, c * b + k), pt(a + h, c * (b + k)), pt(a + h, c * b - k), pt(a - h, c * (b + k)), pt(a + h, b + k)], [
			say(`Dentro: $x ${sg(-h)}$ sposta le ascisse di $${h}$: $${a} ${sg(h)} = ${a + h}$.`),
			say(`Fuori: prima la moltiplicazione per $${c}$, poi $${sg(k)}$: $${c} \\cdot ${b < 0 ? `(${b})` : b} ${sg(k)} = ${c * b + k}$.`),
		]);
	}
	// f(kx - m) = f(k(x - m/k)): the new abscissa solves kx - m = a
	const k = rng.int(2, 3);
	const h = nz(rng, -4, 4);
	const m = k * h;
	const a2 = k * nz(rng, -3, 3);
	const x = (a2 + m) / k;
	if (x === a2 || x === a2 / k + m || x === a2 * k + m) return null;
	return pointProblem(rng, 'due operazioni dentro', pt(a2, b), `f(${k}x ${sg(-m)})`, pt(x, b), [pt(a2 / k + m, b), pt(a2 * k + m, b), pt((a2 - m) / k, b), pt(a2 * k - m, b), pt(a2, b)].filter((p) => !p[0].equals(q(x))), [
		say(`Raccogli il coefficiente della $x$: $${k}x ${sg(-m)} = ${k}(x ${sg(-h)})$.`),
		say(`Il nuovo punto ha l'ascissa per cui l'argomento vale $${a2}$: $${k}x ${sg(-m)} = ${a2}$, cioè $x = ${x}$. L'ordinata resta $${b}$.`),
	]);
}

const LEVELS: Record<number, (rng: Rng) => Built | null> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

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
	if (p.truth && s.answer.options[s.answer.correct].values.join('|') !== p.truth.join('|')) errs.push('opzione giusta diversa dalla risposta');
	return errs;
}

const generator: Generator = {
	id: ID,
	title: 'Trasformazioni dei grafici',
	levels: {
		1: { label: 'Traslazioni di un punto', constraints: ['f(x) ± d oppure f(x ± d), d intero non nullo', 'punto a coordinate intere non nulle'] },
		2: { label: 'Vertice di un grafico traslato', constraints: ['|x - a| + b, √(x - a) + b oppure (x - a)² + b, con a e b interi non nulli'] },
		3: { label: 'Simmetrie', constraints: ['-f(x), f(-x) oppure -f(-x)'] },
		4: { label: 'Dilatazioni', constraints: ['k f(x), f(kx), f(x/k) oppure f(x)/k con k tra 2 e 4', 'coordinate intere'] },
		5: { label: 'Dalla trasformazione alla formula', constraints: ['basi |x|, √x, x²', 'traslazione di un vettore, simmetria, simmetria e spostamento verticale'] },
		6: { label: 'Valore assoluto fuori e dentro', constraints: ['|f(x)| con un punto di ordinata negativa, f(|x|) con un punto di ascissa positiva'] },
		7: { label: 'Più trasformazioni', constraints: ['c·f(x - h) + k, oppure f(kx - m) con m multiplo di k'] },
	},
	generate: (rng, level) => {
		if (!LEVELS[level]) throw new Error(`${ID}: livello ${level} sconosciuto`);
		return retry(ID, level, () => assemble(rng, level));
	},
	check,
};

export default generator;
