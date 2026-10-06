/**
 * Successioni numeriche (lesson slug successioni-numeriche). Spec: specs/exercises/successioni-numeriche.md
 *
 * Six levels in the order of the lesson: a term from the general term; alternating signs with (-1)^n; a term
 * of a sequence defined by recursion; the place of a given number; monotonic or not; bounded or not. The first
 * term is a_1, as in the lesson. Every exercise starts from its answer (the index, the roots of the equation,
 * the behaviour) and builds the sequence from it.
 */
import type { ChoiceOption, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import { joinSigned, poly, polyToLatex } from '../latex';
import { type Built, chapterGenerator, choiceOf, correctValues, lin, nonZero, numberAnswer, numberChoice, numberCheck, par, t } from '../successioni';

export const ID = 'successioni-numeriche';

const N = (x: unknown) => Number(x);

/** c0 + c1 n + c2 n^2 at n. */
const evalPoly = (c: number[], n: number): number => c.reduce((s, k, i) => s + k * n ** i, 0);

/** The substitution written out: "2 \cdot 7^2 - 3 \cdot 7 + 1". */
function substPoly(c: number[], n: number): string {
	let out = '';
	for (let deg = c.length - 1; deg >= 0; deg--) {
		const k = c[deg];
		if (!k) continue;
		const a = Math.abs(k);
		const x = deg === 2 ? `${n}^2` : `${n}`;
		const body = deg === 0 ? `${a}` : a === 1 ? x : `${a} \\cdot ${x}`;
		out += out === '' ? (k < 0 ? '-' : '') + body : (k < 0 ? ' - ' : ' + ') + body;
	}
	return out || '0';
}

const polyN = (c: number[]): string => polyToLatex(poly(...c), 'n');

// ---------------------------------------------------------------------------
// Level 1: a term from the general term

function level1(rng: Rng): Built {
	const k = rng.int(3, 10);
	const u = rng.next();
	const prompt = 'Calcola il termine indicato della successione.';
	if (u < 0.6) {
		const quad = u >= 0.3;
		const c = quad ? [rng.int(-9, 9), nonZero(rng, -6, 6), rng.pick([1, 1, 1, 2, -1])] : [nonZero(rng, -9, 9), nonZero(rng, -6, 6)];
		const f = (n: number) => q(evalPoly(c, n));
		const value = f(k);
		return {
			prompt,
			problem: `\\begin{array}{l} a_n = ${polyN(c)} \\\\ a_{${k}} = \\ ? \\end{array}`,
			solution: `a_{${k}} = ${value.toLatex()}`,
			steps: [`${t('Sostituisci ')} n = ${k} ${t(' nel termine generale')}`, `a_{${k}} = ${substPoly(c, k)} = ${value.toLatex()}`],
			answer: numberAnswer(value),
			choice: numberChoice(ID, rng, value, [f(k + 1), value.add(q(1)), f(k - 1)]),
			params: { case: quad ? 'quadratica' : 'lineare', num: c.map(String), den: null, k },
		};
	}
	const [p, c, r] = [rng.int(1, 5), nonZero(rng, -6, 6), rng.int(1, 4)];
	if (c === p * r) return level1(rng);
	const f = (n: number) => Rational.of(p * n + c, n + r);
	const value = f(k);
	const raw = `\\frac{${p * k + c}}{${k + r}}`;
	return {
		prompt,
		problem: `\\begin{array}{l} a_n = \\frac{${lin(p, c)}}{${lin(1, r)}} \\\\ a_{${k}} = \\ ? \\end{array}`,
		solution: `a_{${k}} = ${value.toLatex()}`,
		steps: [
			`${t('Sostituisci ')} n = ${k} ${t(' al numeratore e al denominatore')}`,
			`a_{${k}} = \\frac{${substPoly([c, p], k)}}{${k} + ${r}} = ${raw}${raw === value.toLatex() ? '' : ` = ${value.toLatex()}`}`,
		],
		answer: numberAnswer(value),
		choice: numberChoice(ID, rng, value, [f(k + 1), value.add(q(1)), q(p * k + c), f(k - 1)]),
		params: { case: 'fratta', num: [c, p].map(String), den: [r, 1].map(String), k },
	};
}

// ---------------------------------------------------------------------------
// Level 2: alternating signs

function level2(rng: Rng): Built {
	const shift = rng.int(0, 1);
	const k = rng.int(2, 9);
	const exp = shift ? '{n+1}' : 'n';
	const e = k + shift;
	const sign = e % 2 === 0 ? 1 : -1;
	const parity = `${t("L'esponente ")} ${shift ? `${k} + 1 = ${e}` : `${k}`} ${t(` è ${sign > 0 ? 'pari' : 'dispari'}: `)}(-1)^{${e}} = ${sign}`;
	const prompt = 'Calcola il termine indicato della successione.';
	if (rng.next() < 0.6) {
		const [p, c] = [rng.int(1, 4), rng.int(-5, 5)];
		const g = (n: number) => p * n + c;
		if (g(k) === 0 || g(k + 1) === 0) return level2(rng);
		const body = c === 0 ? lin(p, 0) : `(${lin(p, c)})`;
		const value = q(sign * g(k));
		return {
			prompt,
			problem: `\\begin{array}{l} a_n = (-1)^${exp} \\cdot ${body} \\\\ a_{${k}} = \\ ? \\end{array}`,
			solution: `a_{${k}} = ${value.toLatex()}`,
			steps: [parity, `a_{${k}} = ${par(q(sign))} \\cdot ${c === 0 && p === 1 ? k : `(${substPoly([c, p], k)})`} = ${par(q(sign))} \\cdot ${par(q(g(k)))} = ${value.toLatex()}`],
			answer: numberAnswer(value),
			choice: numberChoice(ID, rng, value, [value.neg(), q(-sign * g(k + 1)), q(sign * g(k + 1))]),
			params: { case: 'prodotto', shift, p, c, k },
		};
	}
	const p = rng.int(1, 3);
	const c = rng.int(-p + 1, 4);
	const g = (n: number) => p * n + c;
	const value = Rational.of(sign, g(k));
	return {
		prompt,
		problem: `\\begin{array}{l} a_n = \\frac{(-1)^${exp}}{${lin(p, c)}} \\\\ a_{${k}} = \\ ? \\end{array}`,
		solution: `a_{${k}} = ${value.toLatex()}`,
		steps: [parity, `a_{${k}} = \\frac{${sign}}{${substPoly([c, p], k)}} = ${value.toLatex()}`],
		answer: numberAnswer(value),
		choice: numberChoice(ID, rng, value, [value.neg(), Rational.of(-sign, g(k + 1)), q(sign * g(k)), Rational.of(sign, g(k + 1))]),
		params: { case: 'fratta', shift, p, c, k },
	};
}

// ---------------------------------------------------------------------------
// Level 3: recursion

function level3(rng: Rng): Built {
	const prompt = 'Calcola il termine indicato della successione definita per ricorsione.';
	if (rng.next() < 0.7) {
		const p = rng.pick([2, 2, 3, -1, -2, 1]);
		const r = p === 1 ? nonZero(rng, -6, 6) : rng.int(-5, 5);
		const a1 = rng.int(-4, 6);
		const k = rng.int(3, Math.abs(p) === 3 ? 4 : 5);
		const next = (x: number) => p * x + r;
		if (next(a1) === a1) return level3(rng);
		const xs = [a1];
		for (let i = 1; i <= k; i++) xs.push(next(xs[i - 1]));
		if (xs.some((x) => Math.abs(x) > 500)) return level3(rng);
		const head = p === 1 ? 'a_n' : p === -1 ? '-a_n' : `${p}a_n`;
		const stepOf = (prev: number) => joinSigned(p === 1 ? `${prev}` : p === -1 ? `-${par(q(prev))}` : `${p} \\cdot ${par(q(prev))}`, q(r));
		const value = q(xs[k - 1]);
		return {
			prompt,
			problem: `\\begin{array}{l} \\begin{cases} a_1 = ${a1} \\\\ a_{n+1} = ${joinSigned(head, q(r))} \\end{cases} \\\\ a_{${k}} = \\ ? \\end{array}`,
			solution: `a_{${k}} = ${value.toLatex()}`,
			steps: [t('Parti dal primo termine e applica la legge di ricorrenza un passo alla volta'), ...xs.slice(1, k).map((x, i) => `a_{${i + 2}} = ${stepOf(xs[i])} = ${x}`)],
			answer: numberAnswer(value),
			choice: numberChoice(ID, rng, value, [q(xs[k - 2]), q(xs[k]), q(p * k + r)]),
			params: { case: 'un termine', a1, p, r, k },
		};
	}
	const [a1, a2, k] = [rng.int(1, 5), rng.int(1, 5), rng.int(5, 7)];
	const xs = [a1, a2];
	for (let i = 2; i <= k; i++) xs.push(xs[i - 1] + xs[i - 2]);
	const value = q(xs[k - 1]);
	return {
		prompt,
		problem: `\\begin{array}{l} \\begin{cases} a_1 = ${a1}, \\quad a_2 = ${a2} \\\\ a_{n+2} = a_{n+1} + a_n \\end{cases} \\\\ a_{${k}} = \\ ? \\end{array}`,
		solution: `a_{${k}} = ${value.toLatex()}`,
		steps: [t('Ogni termine, dal terzo in poi, è la somma dei due che lo precedono'), ...xs.slice(2, k).map((x, i) => `a_{${i + 3}} = ${xs[i + 1]} + ${xs[i]} = ${x}`)],
		answer: numberAnswer(value),
		choice: numberChoice(ID, rng, value, [q(xs[k - 2]), q(xs[k]), q(xs[k - 1] + xs[0])]),
		params: { case: 'due termini', a1, a2, k },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the place of a number

function level4(rng: Rng): Built {
	const prompt = 'Per quale indice n il termine della successione vale il numero dato?';
	if (rng.next() < 0.4) {
		const p = rng.pick([1, -1]) * rng.int(2, 9);
		const c = nonZero(rng, -9, 9);
		const n0 = rng.int(5, 30);
		const value = p * n0 + c;
		return {
			prompt,
			problem: `\\begin{array}{l} a_n = ${lin(p, c)} \\\\ a_n = ${value} \\\\ n = \\ ? \\end{array}`,
			solution: `n = ${n0}`,
			steps: [`${lin(p, c)} = ${value}`, `${lin(p, 0)} = ${value - c}`, `n = ${n0}${t(', che è un numero naturale: il numero è il termine di posto ')}${n0}`],
			answer: numberAnswer(q(n0)),
			choice: numberChoice(ID, rng, q(n0), [q(n0 - 1), q(n0 + 1), Rational.of(value, p)]),
			params: { case: 'lineare', coefs: [c, p].map(String), value },
		};
	}
	const [n0, m, c] = [rng.int(3, 12), -rng.int(1, 6), rng.int(-9, 9)];
	const b = -(n0 + m);
	if (b === 0) return level4(rng);
	const value = c - n0 * m;
	const delta = b * b - 4 * (c - value);
	const root = Math.round(Math.sqrt(delta));
	return {
		prompt,
		problem: `\\begin{array}{l} a_n = ${polyN([c, b, 1])} \\\\ a_n = ${value} \\\\ n = \\ ? \\end{array}`,
		solution: `n = ${n0}`,
		steps: [
			`${polyN([c, b, 1])} = ${value} \\ \\Rightarrow \\ ${polyN([c - value, b, 1])} = 0`,
			`\\Delta = ${par(q(b))}^2 - 4 \\cdot ${par(q(c - value))} = ${delta} = ${root}^2`,
			`n = \\frac{${-b} \\pm ${root}}{2}${t(': le soluzioni sono ')}${m}${t(' e ')}${n0}`,
			`${t('Un indice è un numero naturale maggiore o uguale a ')}1${t(': si accetta solo ')}n = ${n0}`,
		],
		answer: numberAnswer(q(n0)),
		choice: numberChoice(ID, rng, q(n0), [q(-m), q(n0 + 1), q(n0 - 1)]),
		params: { case: 'quadratica', coefs: [c, b, 1].map(String), value },
	};
}

// ---------------------------------------------------------------------------
// Levels 5 and 6: a sequence of a known family, and how it behaves

type Monotony = 'crescente' | 'decrescente' | 'costante' | 'non monotona';
type Bounds = 'limitata' | 'inferiormente' | 'superiormente' | 'nessuna';

const MONOTONY_LATEX: Record<Monotony, string> = {
	crescente: t('crescente'),
	decrescente: t('decrescente'),
	costante: t('costante'),
	'non monotona': t('non monotona'),
};
const BOUNDS_LATEX: Record<Bounds, string> = {
	limitata: t('limitata'),
	inferiormente: t('limitata solo inferiormente'),
	superiormente: t('limitata solo superiormente'),
	nessuna: `\\begin{gathered} ${t('non limitata né superiormente')} \\\\ ${t('né inferiormente')} \\end{gathered}`,
};

const labelOptions = <K extends string>(table: Record<K, string>): Record<K, ChoiceOption> =>
	Object.fromEntries(Object.entries<string>(table).map(([k, latex]) => [k, { latex, values: [k] }])) as Record<K, ChoiceOption>;

interface Family {
	latex: string;
	params: Record<string, unknown>;
	steps: string[];
}

function linear(rng: Rng, sign: 1 | -1): Family {
	const [p, c] = [sign * rng.int(1, 6), rng.int(-9, 9)];
	return {
		latex: lin(p, c),
		params: { family: 'lineare', p, c },
		steps: [`a_{n+1} - a_n = ${p}${t(`: la differenza è sempre ${p > 0 ? 'positiva' : 'negativa'}`)}`],
	};
}

function fraction(rng: Rng, sign: 1 | -1 | 0): Family {
	const p = rng.int(1, 5);
	const c = (sign === 0 ? rng.pick([1, -1]) : -sign) * rng.int(1, 6);
	const diff = c < 0 ? `\\frac{${-c}}{n(n + 1)} > 0` : `-\\frac{${c}}{n(n + 1)} < 0`;
	return {
		latex: `\\frac{${lin(p, c)}}{n}`,
		params: { family: 'fratta', p, c },
		steps: [`a_n = ${p} ${c < 0 ? '-' : '+'} \\frac{${Math.abs(c)}}{n}`, `a_{n+1} - a_n = ${diff} ${t(' per ogni ')} n \\geq 1`],
	};
}

/** a n^2 + b n + c with a = ±1: monotonic when the difference keeps its sign from n = 1 on. */
function quadratic(rng: Rng, a: 1 | -1, monotonic: boolean): Family {
	// Not monotonic: b even, so that the difference 2an + a + b is never zero and the change of sign is clean.
	const b = a * (monotonic ? rng.int(-2, 6) : -2 * rng.int(2, 6));
	const c = rng.int(-9, 9);
	const d = [a + b, 2 * a];
	const flip = Math.floor((-d[0] / d[1])) + 1;
	const word = (positive: boolean) => (positive ? 'positiva' : 'negativa');
	const sign = monotonic
		? `${t(`La differenza è ${word(a > 0)} per ogni `)} n \\geq 1`
		: `${t(`La differenza è ${word(a < 0)} per `)} n < ${flip} ${t(` e ${word(a > 0)} per `)} n \\geq ${flip}${t(': cambia segno')}`;
	return { latex: polyN([c, b, a]), params: { family: 'quadratica', a, b, c }, steps: [`a_{n+1} - a_n = ${lin(d[1], d[0])}`, sign] };
}

function alternating(rng: Rng, growing: boolean): Family {
	const c = rng.int(1, 6);
	const g = growing ? rng.pick(['n', 'n^2', 'pn']) : rng.pick(['c', 'c', '1/n']);
	const latex = g === '1/n' ? '\\frac{(-1)^n}{n}' : `(-1)^n \\cdot ${g === 'c' ? c : g === 'pn' ? lin(c + 1, 0) : g}`;
	return { latex, params: { family: 'alterna', g, c }, steps: [`${t('Il fattore ')} (-1)^n ${t(' cambia il segno a ogni passo: i termini sono alternativamente negativi e positivi')}`] };
}

function constant(rng: Rng): Family {
	const c = nonZero(rng, -9, 9);
	const plain = rng.next() < 0.4;
	return {
		latex: plain ? `${c}` : `(-1)^{2n} \\cdot ${par(q(c))}`,
		params: { family: 'costante', c, forma: plain ? 'numero' : 'potenza' },
		steps: plain ? [`${t('Tutti i termini valgono ')} ${c}`] : [`${t("L'esponente ")} 2n ${t(' è sempre pari: ')}(-1)^{2n} = 1 ${t(' e tutti i termini valgono ')} ${c}`],
	};
}

function level5(rng: Rng): Built {
	const u = rng.next();
	const target: Monotony = u < 0.3 ? 'crescente' : u < 0.6 ? 'decrescente' : u < 0.9 ? 'non monotona' : 'costante';
	const kind = rng.int(0, 2);
	const fam =
		target === 'costante'
			? constant(rng)
			: target === 'non monotona'
				? kind === 0
					? alternating(rng, rng.next() < 0.5)
					: quadratic(rng, kind === 1 ? 1 : -1, false)
				: kind === 0
					? linear(rng, target === 'crescente' ? 1 : -1)
					: kind === 1
						? fraction(rng, target === 'crescente' ? 1 : -1)
						: quadratic(rng, target === 'crescente' ? 1 : -1, true);
	const opts = labelOptions(MONOTONY_LATEX);
	const closing: Record<Monotony, string> = {
		crescente: 'Ogni termine è maggiore del precedente: la successione è crescente',
		decrescente: 'Ogni termine è minore del precedente: la successione è decrescente',
		costante: 'La successione è costante',
		'non monotona': 'I termini non vanno sempre nello stesso verso: la successione non è monotona',
	};
	return {
		prompt: 'Stabilisci se la successione è crescente, decrescente, costante o non monotona.',
		problem: `a_n = ${fam.latex}`,
		solution: MONOTONY_LATEX[target],
		steps: [...fam.steps, t(closing[target])],
		answer: choiceOf(
			ID,
			rng,
			opts[target],
			(Object.keys(opts) as Monotony[]).filter((k) => k !== target).map((k) => opts[k]),
		),
		params: { case: target, ...fam.params },
	};
}

function level6(rng: Rng): Built {
	const target = rng.pick<Bounds>(['limitata', 'inferiormente', 'superiormente', 'nessuna']);
	const kind = rng.int(0, 1);
	const fam =
		target === 'limitata'
			? kind === 0
				? fraction(rng, 0)
				: alternating(rng, false)
			: target === 'nessuna'
				? alternating(rng, true)
				: kind === 0
					? linear(rng, target === 'inferiormente' ? 1 : -1)
					: quadratic(rng, target === 'inferiormente' ? 1 : -1, rng.next() < 0.5);
	const f = fam.params.family;
	const why: string[] =
		target === 'limitata'
			? f === 'fratta'
				? [`a_n = ${N(fam.params.p)} ${N(fam.params.c) < 0 ? '-' : '+'} \\frac{${Math.abs(N(fam.params.c))}}{n}${t(': la frazione sta tra ')}0${t(' e ')}${Math.abs(N(fam.params.c))}`, t('Tutti i termini stanno tra due numeri: la successione è limitata')]
				: [fam.params.g === '1/n' ? `${t('Tutti i termini stanno tra ')} -1 ${t(' e ')} 1` : `${t('I termini valgono soltanto ')} ${-N(fam.params.c)} ${t(' e ')} ${N(fam.params.c)}`, t('La successione è limitata')]
			: target === 'nessuna'
				? [t('I termini di posto pari diventano grandi quanto si vuole, quelli di posto dispari piccoli quanto si vuole'), t('La successione non è limitata né superiormente né inferiormente')]
				: target === 'inferiormente'
					? [t('Al crescere di n i termini superano qualunque numero: la successione non è limitata superiormente'), t('Nessun termine scende sotto il più piccolo dei primi termini: è limitata inferiormente')]
					: [t('Al crescere di n i termini scendono sotto qualunque numero: la successione non è limitata inferiormente'), t('Nessun termine supera il più grande dei primi termini: è limitata superiormente')];
	const opts = labelOptions(BOUNDS_LATEX);
	return {
		prompt: 'Stabilisci se la successione è limitata.',
		problem: `a_n = ${fam.latex}`,
		solution: BOUNDS_LATEX[target],
		steps: why,
		answer: choiceOf(
			ID,
			rng,
			opts[target],
			(Object.keys(opts) as Bounds[]).filter((k) => k !== target).map((k) => opts[k]),
		),
		params: { case: target, ...fam.params },
	};
}

// ---------------------------------------------------------------------------
// Checks

/** The first 60 terms of a family, exact. */
function familyTerms(p: Record<string, unknown>): Rational[] {
	const out: Rational[] = [];
	for (let n = 1; n <= 60; n++) {
		const s = n % 2 === 0 ? 1 : -1;
		if (p.family === 'lineare') out.push(q(N(p.p) * n + N(p.c)));
		else if (p.family === 'fratta') out.push(Rational.of(N(p.p) * n + N(p.c), n));
		else if (p.family === 'quadratica') out.push(q(N(p.a) * n * n + N(p.b) * n + N(p.c)));
		else if (p.family === 'costante') out.push(q(N(p.c)));
		else if (p.g === '1/n') out.push(Rational.of(s, n));
		else out.push(q(s * (p.g === 'c' ? N(p.c) : p.g === 'n' ? n : p.g === 'n^2' ? n * n : (N(p.c) + 1) * n)));
	}
	return out;
}

function monotonyOf(xs: Rational[]): Monotony {
	const signs = new Set(xs.slice(1).map((x, i) => x.compare(xs[i])));
	if (signs.size === 1) return signs.has(1) ? 'crescente' : signs.has(-1) ? 'decrescente' : 'costante';
	return 'non monotona';
}

/** From the first 60 terms: a bound holds if the last terms do not pass the first ones. Enough for these families. */
function boundsOf(xs: Rational[]): Bounds {
	const head = xs.slice(0, 20);
	const tail = xs.slice(40);
	const up = tail.every((x) => head.some((h) => h.compare(x) >= 0)) || xs.every((x) => x.abs().compare(q(20)) <= 0);
	const down = tail.every((x) => head.some((h) => h.compare(x) <= 0)) || xs.every((x) => x.abs().compare(q(20)) <= 0);
	return up && down ? 'limitata' : down ? 'inferiormente' : up ? 'superiormente' : 'nessuna';
}

function check(s: Sample): string[] {
	const p = s.params;
	const k = N(p.k);
	switch (s.level) {
		case 1: {
			const num = (p.num as string[]).map(Number);
			const den = p.den ? (p.den as string[]).map(Number) : [1];
			return numberCheck(s, Rational.of(evalPoly(num, k), evalPoly(den, k)));
		}
		case 2: {
			const sign = (k + N(p.shift)) % 2 === 0 ? 1 : -1;
			const g = N(p.p) * k + N(p.c);
			return numberCheck(s, p.case === 'prodotto' ? q(sign * g) : Rational.of(sign, g));
		}
		case 3: {
			const xs = p.case === 'un termine' ? [N(p.a1)] : [N(p.a1), N(p.a2)];
			while (xs.length < k) xs.push(p.case === 'un termine' ? N(p.p) * xs[xs.length - 1] + N(p.r) : xs[xs.length - 1] + xs[xs.length - 2]);
			return numberCheck(s, q(xs[k - 1]));
		}
		case 4: {
			const c = (p.coefs as string[]).map(Number);
			const hits = [];
			for (let n = 1; n <= 200; n++) if (evalPoly(c, n) === N(p.value)) hits.push(n);
			return hits.length === 1 ? numberCheck(s, q(hits[0])) : [`${hits.length} indici danno ${p.value}`];
		}
		case 5: {
			const m = monotonyOf(familyTerms(p));
			return m === p.case && correctValues(s)?.[0] === m ? [] : [`la successione è ${m}`];
		}
		case 6: {
			const b = boundsOf(familyTerms(p));
			return b === p.case && correctValues(s)?.[0] === b ? [] : [`la successione è ${b}`];
		}
		default:
			return [`livello sconosciuto ${s.level}`];
	}
}

export const successioniNumeriche = chapterGenerator({
	id: ID,
	title: 'Successioni numeriche',
	levels: {
		1: { label: 'Un termine dal termine generale', constraints: ['a_n lineare, di secondo grado o fratta, indice tra 3 e 10', 'tre su dieci lineari, tre quadratiche, quattro fratte'] },
		2: { label: 'Segni alterni con (-1)^n', constraints: ['fattore (-1)^n oppure (-1)^(n+1)', 'sei su dieci un prodotto, quattro una frazione'] },
		3: { label: 'Un termine di una successione ricorsiva', constraints: ['sette su dieci a_(n+1) = p·a_n + r, tre su dieci la somma dei due termini precedenti', 'termini in valore assoluto fino a 500'] },
		4: { label: 'Il posto di un numero', constraints: ['quattro su dieci a_n di primo grado, sei di secondo grado', "un solo indice naturale; l'altra soluzione dell'equazione è negativa"] },
		5: { label: 'Crescente, decrescente o non monotona', constraints: ['crescente 30%, decrescente 30%, non monotona 30%, costante 10%', 'lineare, fratta, di secondo grado o con (-1)^n'] },
		6: { label: 'Limitata o no', constraints: ['limitata, solo inferiormente, solo superiormente, né l’una né l’altra: un quarto ciascuna'] },
	},
	builders: { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 },
	check,
});

export default successioniNumeriche;
