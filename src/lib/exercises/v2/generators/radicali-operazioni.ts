/**
 * Operazioni con i radicali. Spec: specs/exercises/radicali-operazioni.md
 *
 * Seven levels in the order of lesson 73: product and quotient with the same index, a factor carried
 * out of a numeric radicand, the same with letters, a factor carried in and the comparison of radicals
 * with a coefficient, different indices with the power and the root of a radical, sums of radicals
 * that become similar, special products with radicals.
 *
 * Built backwards: the pieces of the answer (the factor that comes out, the radicand that stays in,
 * the coefficients of the similar radicals, the terms of the binomial) are chosen first, the text is
 * built from them. Letters stand for positive numbers, as in the lesson. Every result is reduced: no
 * factor with an exponent at least the index under the root, the index as small as it can be, similar
 * radicals summed. A result with the right value but not reduced (√12 for 2√3) is a distractor, never
 * a second right answer; the checker tells it apart by its form.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { gcd, lcm } from '../rational';
import { shuffle, weighted } from '../razionali';

export const ID = 'radicali-operazioni';

// ---------------------------------------------------------------------------
// Radicals: c · (letters outside) · ⁿ√(R · letters inside)

type Letters = Record<string, number>;

/** A reduced term. n = 1 means no radical (R = 1, rin empty). */
export interface Term {
	c: number;
	out: Letters;
	n: number;
	R: number;
	rin: Letters;
}

function primeFactors(n: number): [number, number][] {
	const out: [number, number][] = [];
	for (let p = 2; p * p <= n; p++) {
		let e = 0;
		while (n % p === 0) {
			n /= p;
			e++;
		}
		if (e > 0) out.push([p, e]);
	}
	if (n > 1) out.push([n, 1]);
	return out;
}

const clean = (l: Letters): Letters => Object.fromEntries(Object.entries(l).filter(([, e]) => e !== 0));

/** c · out · ⁿ√(R · rin), reduced: factors carried out, index lowered by the common divisor. */
export function rad(c: number, n: number, R: number, rin: Letters = {}, out: Letters = {}): Term {
	if (!Number.isSafeInteger(R) || !Number.isSafeInteger(c)) throw new Error('rad: unsafe integer');
	if (R === 0 || c === 0) return { c: 0, out: {}, n: 1, R: 1, rin: {} };
	if (R < 0) {
		if (n % 2 === 0) throw new Error('rad: negative radicand with even index');
		c = -c;
		R = -R;
	}
	const o: Letters = { ...out };
	const inside: [number | string, number][] = [];
	let coef = c;
	for (const [p, e] of primeFactors(R)) {
		coef *= p ** Math.floor(e / n);
		if (e % n) inside.push([p, e % n]);
	}
	for (const [l, e] of Object.entries(rin)) {
		o[l] = (o[l] ?? 0) + Math.floor(e / n);
		if (e % n) inside.push([l, e % n]);
	}
	if (!inside.length) return { c: coef, out: clean(o), n: 1, R: 1, rin: {} };
	const g = inside.reduce((acc, [, e]) => gcd(acc, e), n);
	let r = 1;
	const ri: Letters = {};
	for (const [f, e] of inside) {
		if (typeof f === 'number') r *= f ** (e / g);
		else ri[f] = e / g;
	}
	return { c: coef, out: clean(o), n: n / g, R: r, rin: ri };
}

const intTerm = (k: number): Term => ({ c: k, out: {}, n: 1, R: 1, rin: {} });

function lettersLatex(l: Letters): string {
	return Object.keys(l)
		.sort()
		.map((k) => (l[k] === 1 ? k : `${k}^{${l[k]}}`))
		.join('');
}

function lettersSympy(l: Letters): string[] {
	return Object.keys(l)
		.sort()
		.map((k) => (l[k] === 1 ? k : `${k}**${l[k]}`));
}

/** ⁿ√(body) in LaTeX. */
const rootLatex = (n: number, body: string) => (n === 2 ? `\\sqrt{${body}}` : `\\sqrt[${n}]{${body}}`);

function radicandLatex(R: number, rin: Letters): string {
	const l = lettersLatex(rin);
	return R === 1 && l ? l : `${R}${l}`;
}

/** A term alone, sign included: 2\sqrt{3}, -\sqrt[3]{2}, a^{2}b\sqrt{a}, 12. */
export function termLatex(t: Term): string {
	const l = lettersLatex(t.out);
	const radical = t.n > 1 ? rootLatex(t.n, radicandLatex(t.R, t.rin)) : '';
	const body = l + radical;
	if (!body) return `${t.c}`;
	if (t.c === 1) return body;
	if (t.c === -1) return `-${body}`;
	return `${t.c}${body}`;
}

export function termSympy(t: Term): string {
	const parts: string[] = [];
	if (t.c !== 1 || (!Object.keys(t.out).length && t.n === 1)) parts.push(t.c < 0 ? `(${t.c})` : `${t.c}`);
	parts.push(...lettersSympy(t.out));
	if (t.n > 1) {
		const inner = [...(t.R !== 1 || !Object.keys(t.rin).length ? [`${t.R}`] : []), ...lettersSympy(t.rin)].join('*');
		parts.push(t.n === 2 ? `sqrt(${inner})` : `(${inner})**(1/${t.n})`);
	}
	return parts.join('*');
}

const TEST: Record<string, number> = { a: 1.37, b: 1.71, x: 1.93, y: 2.29 };

function lettersValue(l: Letters): number {
	return Object.entries(l).reduce((acc, [k, e]) => acc * TEST[k] ** e, 1);
}

export function termValue(t: Term): number {
	return t.c * lettersValue(t.out) * (t.R * lettersValue(t.rin)) ** (1 / t.n);
}

const termKey = (t: Term) => `${lettersLatex(t.out)}|${t.n}|${t.R}|${lettersLatex(t.rin)}`;

/** Similar terms summed, zeros dropped; the rational term first, then by index and radicand. */
export function combine(ts: Term[]): Term[] {
	const m = new Map<string, Term>();
	for (const t of ts) {
		const k = termKey(t);
		const old = m.get(k);
		m.set(k, old ? { ...old, c: old.c + t.c } : { ...t });
	}
	return [...m.values()].filter((t) => t.c !== 0).sort((p, q) => p.n - q.n || p.R - q.R || termKey(p).localeCompare(termKey(q)));
}

export function sumLatex(ts: Term[]): string {
	if (!ts.length) return '0';
	return ts
		.map((t, i) => {
			const s = termLatex(t);
			if (i === 0) return s;
			return s.startsWith('-') ? ` - ${s.slice(1)}` : ` + ${s}`;
		})
		.join('');
}

function sumSympy(ts: Term[]): string {
	return ts.length ? ts.map((t) => `(${termSympy(t)})`).join(' + ') : '0';
}

const sumValue = (ts: Term[]) => ts.reduce((s, t) => s + termValue(t), 0);

/** True if the term is reduced: nothing left to carry out, index as low as it goes. */
function reducedTerm(t: Term): boolean {
	if (t.n === 1) return true;
	const r = rad(t.c, t.n, t.R, t.rin, t.out);
	return termKey(r) === termKey(t) && r.c === t.c;
}

const factorLatex = (n: number) =>
	primeFactors(n)
		.map(([p, e]) => (e === 1 ? `${p}` : `${p}^{${e}}`))
		.join(' \\cdot ');

// ---------------------------------------------------------------------------
// Options

interface Opt {
	latex: string;
	value: string;
	num: number;
	/** Written in reduced form (false for √12 in place of 2√3). */
	reduced: boolean;
}

const sumOpt = (ts: Term[], reduced = true): Opt => ({ latex: sumLatex(ts), value: sumSympy(ts), num: sumValue(ts), reduced });
const termOpt = (t: Term): Opt => sumOpt([t], reducedTerm(t));
/** An unreduced radical written as it is: c·ⁿ√R. */
function rawOpt(c: number, n: number, R: number, rin: Letters = {}, out: Letters = {}): Opt {
	const t: Term = { c, out, n, R, rin };
	return { latex: termLatex(t), value: termSympy(t), num: termValue(t), reduced: reducedTerm(t) };
}

const close = (a: number, b: number) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

/**
 * Four options: the right one, then the mistakes in order, then the fallback. Distinct in LaTeX and in
 * value, except that one unreduced option may have the value of the right one.
 */
function pickOptions(rng: Rng, correct: Opt, cands: (Opt | null)[], fallback: (i: number) => Opt | null): ChoiceAnswer {
	const opts: Opt[] = [correct];
	let sameValue = 0;
	const add = (o: Opt | null) => {
		if (!o || opts.length >= 4 || !Number.isFinite(o.num)) return;
		if (opts.some((p) => p.latex === o.latex)) return;
		if (close(o.num, correct.num)) {
			if (o.reduced || sameValue > 0) return;
			if (opts.slice(1).some((p) => close(p.num, o.num))) return;
			sameValue++;
		} else if (opts.some((p) => close(p.num, o.num))) return;
		opts.push(o);
	};
	cands.forEach(add);
	for (let i = 1; opts.length < 4 && i < 60; i++) add(fallback(i));
	if (opts.length < 4) throw new Error('pickOptions: not enough options');
	const order = shuffle(
		rng,
		opts.map((_, i) => i),
	);
	const options: ChoiceOption[] = order.map((i) => ({ latex: opts[i].latex, values: [opts[i].value] }));
	return { kind: 'choice', options, correct: order.indexOf(0) };
}

/** Near misses of a sum of terms: one coefficient moved by ±k. */
function nearSum(ts: Term[], i: number): Opt | null {
	if (!ts.length) return sumOpt([intTerm(i % 2 ? i : -i)]);
	const j = i % ts.length;
	const k = Math.ceil(i / (2 * ts.length)) * (Math.floor(i / ts.length) % 2 ? -1 : 1);
	const out = combine(ts.map((t, h) => (h === j ? { ...t, c: t.c + k } : t)));
	return out.length ? sumOpt(out) : null;
}

// ---------------------------------------------------------------------------
// Built exercises

interface Built {
	case: string;
	prompt: string;
	problem: string;
	/** Expression answer: the reduced result. */
	result?: Term[];
	/** Choice answer (level 4). */
	choice?: { options: Opt[]; correct: number };
	steps: string[];
	wrong: Opt[];
	solution?: string;
}

const coefLatex = (c: number, body: string) => (c === 1 ? body : `${c}${body}`);
/** c·ⁿ√R as written in a problem, unreduced. */
const radLatex = (c: number, n: number, R: number | string) => coefLatex(c, rootLatex(n, `${R}`));

const SQF = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];

// Level 1 ---------------------------------------------------------------------

function buildL1(rng: Rng, kind: string): Built | null {
	const prompt = 'Calcola e riduci il risultato.';
	if (kind === 'prodotto intero') {
		const s = rng.pick([2, 3, 5, 6, 7]);
		const u = rng.int(1, 4), v = rng.int(1, 4);
		const a = s * u * u, b = s * v * v;
		if (u === v || a > 75 || b > 75) return null;
		const r = s * u * v;
		const problem = `${rootLatex(2, `${a}`)} \\cdot ${rootLatex(2, `${b}`)}`;
		return {
			case: kind,
			prompt,
			problem,
			result: [intTerm(r)],
			steps: [
				`\\text{Stesso indice: moltiplica i radicandi. } ${problem} = \\sqrt{${a} \\cdot ${b}} = \\sqrt{${a * b}}`,
				`\\sqrt{${a * b}} = ${r} \\text{, perché } ${r}^{2} = ${a * b}`,
			],
			wrong: [termOpt(rad(1, 2, a + b)), termOpt(intTerm(a * b)), (a * b) % 2 === 0 ? termOpt(intTerm((a * b) / 2)) : null, termOpt(rad(2, 2, a * b))].filter((o): o is Opt => o !== null),
		};
	}
	if (kind === 'prodotto') {
		const same = rng.next() < 0.25;
		const c1 = rng.int(1, 5), c2 = rng.int(same ? 2 : 1, 5);
		if (same && c1 === 1) return null;
		let a: number, b: number;
		if (same) a = b = rng.pick([2, 3, 5, 6, 7]);
		else {
			a = rng.pick(SQF);
			b = rng.pick(SQF);
			if (gcd(a, b) !== 1 || a * b > 105) return null;
			if (rng.next() < 0.75 && c1 === 1 && c2 === 1) return null;
		}
		const problem = `${radLatex(c1, 2, a)} \\cdot ${radLatex(c2, 2, b)}`;
		const res = rad(c1 * c2, 2, a * b);
		const steps = [
			`\\text{Moltiplica i coefficienti tra loro e i radicali tra loro: } ${problem} = ${c1 * c2 === 1 ? '' : `${c1} \\cdot ${c2}`}\\sqrt{${a} \\cdot ${b}} = ${coefLatex(c1 * c2, `\\sqrt{${a * b}}`)}`,
		];
		if (same) steps.push(`\\sqrt{${a * b}} = ${a} \\text{, quindi il risultato è } ${c1 * c2} \\cdot ${a} = ${res.c}`);
		if (c1 === 1 || c2 === 1) steps[0] = `\\text{Stesso indice: moltiplica i radicandi. } ${problem} = ${coefLatex(c1 * c2, `\\sqrt{${a} \\cdot ${b}}`)} = ${termLatex(res)}`;
		const wrong = same
			? [termOpt(rad(c1 * c2, 2, a)), termOpt(intTerm((c1 + c2) * a)), termOpt(intTerm(c1 * c2 * a * a)), termOpt(rad(1, 2, c1 * c2 * a * a))]
			: [c1 + c2 !== c1 * c2 ? termOpt(rad(c1 + c2, 2, a * b)) : null, termOpt(rad(c1 * c2, 2, a + b)), c1 * c2 > 1 ? termOpt(rad(1, 2, c1 * c2 * a * b)) : null, termOpt(intTerm(c1 * c2 * a * b))].filter(
					(o): o is Opt => o !== null,
				);
		return { case: kind, prompt, problem, result: [res], steps, wrong };
	}
	if (kind === 'quoziente') {
		const b = rng.pick([2, 3, 5, 6, 7, 10]);
		const t = rng.pick([2, 3, 5, 6, 7, 4, 9, 16, 25]);
		const a = b * t;
		if (a > 150 || (SQF.includes(t) && gcd(t, b) !== 1)) return null;
		const c2 = rng.int(1, 4), k = rng.int(1, 5);
		const c1 = c2 * k;
		const frac = rng.next() < 0.4;
		const problem = frac ? `\\frac{${radLatex(c1, 2, a)}}{${radLatex(c2, 2, b)}}` : `${radLatex(c1, 2, a)} : ${radLatex(c2, 2, b)}`;
		const res = rad(k, 2, t);
		const steps =
			c2 === 1 && c1 === 1
				? [`\\text{Stesso indice: dividi i radicandi. } ${problem} = \\sqrt{${a} : ${b}} = \\sqrt{${t}}`]
				: [`\\text{Dividi i coefficienti tra loro e i radicandi tra loro: } ${problem} = ${c1 === c2 ? '' : c2 === 1 ? `${c1}` : `(${c1} : ${c2})`}\\sqrt{${a} : ${b}} = ${coefLatex(k, `\\sqrt{${t}}`)}`];
		if (res.n === 1) steps.push(`\\sqrt{${t}} = ${Math.round(Math.sqrt(t))}\\text{, quindi il risultato è } ${res.c}`);
		return {
			case: kind,
			prompt,
			problem,
			result: [res],
			steps,
			wrong: [
				a - b > 1 ? termOpt(rad(k, 2, a - b)) : null,
				c2 > 1 ? termOpt(rad(c1 * c2, 2, t)) : null,
				termOpt(intTerm(k * t)),
				termOpt(rad(k, 2, a * b)),
				termOpt(rad(c1, 2, t)),
			].filter((o): o is Opt => o !== null),
		};
	}
	// index 3, product or quotient with an integer result
	if (rng.next() < 0.6) {
		const m = rng.int(2, 6);
		const M = m ** 3;
		const divs = [];
		for (let d = 2; d < M; d++) if (M % d === 0) divs.push(d);
		const a = rng.pick(divs), b = M / a;
		const isCube = (z: number) => Math.round(Math.cbrt(z)) ** 3 === z;
		if (isCube(a) || isCube(b) || a > 108 || b > 108) return null;
		const problem = `${rootLatex(3, `${a}`)} \\cdot ${rootLatex(3, `${b}`)}`;
		return {
			case: kind,
			prompt,
			problem,
			result: [intTerm(m)],
			steps: [`\\text{Stesso indice: moltiplica i radicandi. } ${problem} = \\sqrt[3]{${a} \\cdot ${b}} = \\sqrt[3]{${M}}`, `\\sqrt[3]{${M}} = ${m} \\text{, perché } ${m}^{3} = ${M}`],
			wrong: [termOpt(rad(1, 3, a + b)), termOpt(intTerm(M)), termOpt(rad(1, 6, M)), M % 3 === 0 ? termOpt(intTerm(M / 3)) : null].filter((o): o is Opt => o !== null),
		};
	}
	const m = rng.int(2, 5), b = rng.pick([2, 3, 4, 5]);
	const a = m ** 3 * b;
	if (a > 250) return null;
	const problem = `${rootLatex(3, `${a}`)} : ${rootLatex(3, `${b}`)}`;
	return {
		case: kind,
		prompt,
		problem,
		result: [intTerm(m)],
		steps: [`\\text{Stesso indice: dividi i radicandi. } ${problem} = \\sqrt[3]{${a} : ${b}} = \\sqrt[3]{${m ** 3}}`, `\\sqrt[3]{${m ** 3}} = ${m} \\text{, perché } ${m}^{3} = ${m ** 3}`],
		wrong: [termOpt(rad(1, 3, a - b)), termOpt(intTerm(m ** 3)), termOpt(rad(1, 3, a * b)), termOpt(rad(1, 6, m ** 3))],
	};
}

// Level 2 ---------------------------------------------------------------------

function buildL2(rng: Rng, kind: string): Built | null {
	const n = kind === 'indice 3' ? 3 : 2;
	const s = n === 2 ? rng.pick([...SQF, 17, 19, 21]) : rng.pick([2, 3, 4, 5, 6, 7, 9, 10]);
	const f = rng.int(2, n === 2 ? 8 : 5);
	const c = rng.next() < 0.6 ? 1 : rng.int(2, n === 2 ? 5 : 3);
	const N = f ** n * s;
	if (N > (c === 1 ? (n === 2 ? 300 : 400) : 200)) return null;
	const problem = radLatex(c, n, N);
	const res = rad(c, n, N);
	const fac = primeFactors(N);
	const outF = fac.filter(([, e]) => e >= n).map(([p, e]) => (Math.floor(e / n) === 1 ? `${p}` : `${p}^{${Math.floor(e / n)}}`));
	const idx = n === 2 ? '2' : '3';
	const steps = [
		`\\text{Scomponi il radicando in fattori primi: } ${N} = ${factorLatex(N)}`,
		`\\text{Dividi ogni esponente per l'indice } ${idx}\\text{: il quoziente dà l'esponente del fattore che esce, il resto quello del fattore che resta dentro.}`,
		`${rootLatex(n, `${N}`)} = ${rootLatex(n, factorLatex(N))} = ${outF.length > 1 || outF[0] !== `${f}` ? `${outF.join(' \\cdot ')}${rootLatex(n, `${s}`)} = ` : ''}${f}${rootLatex(n, `${s}`)}`,
	];
	if (c > 1) steps.push(`\\text{Moltiplica per il coefficiente: } ${c} \\cdot ${f}${rootLatex(n, `${s}`)} = ${termLatex(res)}`);
	const p = primeFactors(f)[0][0];
	const wrong: (Opt | null)[] = [
		// part of the factor left inside: right value, not reduced
		p < f ? rawOpt((c * f) / p, n, p ** n * s) : null,
		rawOpt(c * f * f, n, s), // the square carried out, not its root
		rawOpt(c * f, n, N / f), // divided by the factor instead of its power
		c > 1 ? rawOpt(f, n, s) : null, // coefficient forgotten
		c > 1 ? rawOpt(c + f, n, s) : null, // coefficients added
	];
	if (n === 3) {
		let q = 1;
		for (let k = 2; k * k <= N; k++) if (N % (k * k) === 0) q = k;
		if (q > 1) wrong.push(rawOpt(c * q, 3, N / (q * q))); // a square carried out of a cube root
		wrong.push(rawOpt(c * f, 2, s)); // the index lost
	}
	return { case: `indice ${n}`, prompt: 'Porta fuori dal segno di radice tutti i fattori possibili.', problem, result: [res], steps, wrong: wrong.filter((o): o is Opt => o !== null) };
}

// Level 3 ---------------------------------------------------------------------

function buildL3(rng: Rng, kind: string): Built | null {
	const n = kind === 'indice 3' ? 3 : 2;
	const numeric = rng.next() < 0.5;
	let f = 1, s = 1;
	if (numeric) {
		f = rng.pick(n === 2 ? [1, 2, 3, 5] : [1, 2, 3]);
		s = rng.pick(n === 2 ? [1, 2, 3, 5] : [1, 2, 3]);
		if (f === 1 && s === 1) return null;
		if (f ** n * s > 75) return null;
	}
	const pair = rng.pick([
		['a', 'b'],
		['x', 'y'],
	]);
	const count = rng.next() < 0.4 ? 1 : 2;
	const rin: Letters = {};
	for (const l of pair.slice(0, count)) rin[l] = rng.int(1, n === 2 ? 7 : 8);
	if (!Object.values(rin).some((e) => e >= n)) return null;
	const N = f ** n * s;
	const res = rad(1, n, N, rin);
	if (res.n === 1) return null; // something stays under the root
	const problem = rootLatex(n, radicandLatex(N, rin));
	const steps: string[] = [];
	if (N > 1 && f > 1) steps.push(`\\text{Scomponi il numero: } ${N} = ${factorLatex(N)}`);
	for (const [l, e] of Object.entries(rin).sort()) {
		if (e < n) steps.push(`${l}${e === 1 ? '' : `^{${e}}`}\\text{: l'esponente è minore di } ${n}\\text{, resta dentro}`);
		else {
			const qt = Math.floor(e / n), r = e % n;
			const outL = qt === 1 ? l : `${l}^{${qt}}`;
			const inL = r === 0 ? '' : r === 1 ? l : `${l}^{${r}}`;
			steps.push(`${l}^{${e}}\\text{: } ${e} : ${n} = ${qt} \\text{ con resto } ${r}\\text{, fuori } ${outL}${inL ? `\\text{, dentro } ${inL}` : '\\text{, dentro niente}'}`);
		}
	}
	steps.push(`${problem} = ${termLatex(res)}`);
	// Mistakes
	const qOf = (e: number) => Math.floor(e / n), rOf = (e: number) => e % n;
	const nf = primeFactors(N);
	const numOut = nf.reduce((acc, [p, e]) => acc * p ** qOf(e), 1);
	const numIn = nf.reduce((acc, [p, e]) => acc * p ** rOf(e), 1);
	const map = (fn: (e: number) => number) => clean(Object.fromEntries(Object.entries(rin).map(([l, e]) => [l, fn(e)])));
	const wrong: (Opt | null)[] = [];
	// quotient and remainder swapped
	wrong.push(rawOpt(numIn, n, numOut, map(qOf), map(rOf)));
	// remainder forgotten
	wrong.push(sumOpt([{ c: numOut, out: map(qOf), n: 1, R: 1, rin: {} }]));
	// one power of a letter left inside: right value, not reduced
	const big = Object.entries(rin).find(([, e]) => e >= n);
	if (big) {
		const [l] = big;
		const out = map(qOf);
		const inn = map(rOf);
		out[l] = (out[l] ?? 0) - 1;
		inn[l] = (inn[l] ?? 0) + n;
		wrong.push(rawOpt(numOut, n, numIn, inn, clean(out)));
	}
	// the quotient carried out but the whole exponent left inside
	wrong.push(rawOpt(numOut, n, N, rin, map(qOf)));
	// the number not carried out: right value, not reduced
	if (numOut > 1) wrong.push(rawOpt(1, n, N, map(rOf), map(qOf)));
	// exponent minus index outside
	wrong.push(rawOpt(numOut, n, numIn, map(rOf), map((e) => Math.max(0, e - n))));
	return { case: `indice ${n}`, prompt: 'Porta fuori dal segno di radice tutti i fattori possibili (le lettere sono positive).', problem, result: [res], steps, wrong: wrong.filter((o): o is Opt => o !== null) };
}

// Level 4 ---------------------------------------------------------------------

const perfectPower = (N: number, n: number) => Math.round(N ** (1 / n)) ** n === N;

/** ±ⁿ√N written with the factor inside. */
function insideOpt(sign: number, n: number, N: number): Opt {
	const latex = sign < 0 && n % 2 === 0 ? `-${rootLatex(n, `${N}`)}` : rootLatex(n, `${sign < 0 ? -N : N}`);
	const num = sign * N ** (1 / n);
	const value = n === 2 ? `${sign < 0 ? '-' : ''}sqrt(${N})` : `${sign < 0 ? '-' : ''}${N}**(1/${n})`;
	return { latex, value, num, reduced: true };
}

function buildL4(rng: Rng, kind: string): Built | null {
	if (kind === 'dentro') {
		const n = rng.next() < 0.7 ? 2 : 3;
		const c = rng.int(2, n === 2 ? 5 : 3);
		const s = rng.pick(n === 2 ? [2, 3, 5, 6, 7] : [2, 3, 4, 5]);
		const sign = rng.next() < 0.45 ? -1 : 1;
		const problem = `${sign < 0 ? '-' : ''}${c}${rootLatex(n, `${s}`)}`;
		const N = c ** n * s;
		const correct = insideOpt(sign, n, N);
		const steps: string[] = [];
		if (sign < 0 && n === 2) {
			steps.push(`\\text{Il segno meno resta fuori: con indice pari, sotto radice diventerebbe positivo. Entra solo il } ${c}\\text{, elevato all'indice.}`);
			steps.push(`${problem} = -\\sqrt{${c}^{2} \\cdot ${s}} = ${correct.latex}`);
		} else if (sign < 0) {
			steps.push(`\\text{Con indice dispari anche il segno meno può entrare: entra } -${c}\\text{, elevato all'indice.}`);
			steps.push(`${problem} = \\sqrt[3]{(-${c})^{3} \\cdot ${s}} = ${correct.latex}`);
		} else {
			steps.push(`\\text{Il fattore } ${c} \\text{ entra elevato all'indice } ${n}\\text{.}`);
			steps.push(`${problem} = ${rootLatex(n, `${c}^{${n}} \\cdot ${s}`)} = ${correct.latex}`);
		}
		const wrong = [
			sign < 0 ? insideOpt(1, n, N) : null, // the minus lost
			insideOpt(sign, n, c * s), // the factor not raised
			insideOpt(sign, n, c * s ** n), // the radicand raised instead
			n === 3 ? insideOpt(sign, n, c * c * s) : null, // squared instead of cubed
			insideOpt(sign, n, c ** n + s), // added instead of multiplied
		].filter((o): o is Opt => o !== null && !perfectPower(Math.round(Math.abs(o.num) ** n), n));
		return { case: 'dentro', prompt: 'Porta il fattore dentro il segno di radice.', problem, choice: { options: [correct, ...wrong], correct: 0 }, steps, wrong: [], solution: `${problem} = ${correct.latex}` };
	}
	// Comparison: four numbers c√s, carried inside to compare the radicands.
	const pool: { c: number; s: number; N: number }[] = [];
	for (let c = 1; c <= 6; c++) for (const s of [2, 3, 5, 6, 7, 10, 11]) if (c * c * s <= 120) pool.push({ c, s, N: c * c * s });
	const items: { c: number; s: number; N: number }[] = [];
	if (rng.next() < 0.3) {
		const k = rng.int(3, 10);
		items.push({ c: k, s: 1, N: k * k });
	}
	for (let i = 0; items.length < 4 && i < 50; i++) {
		const it = rng.pick(pool);
		if (items.some((o) => o.N === it.N)) continue;
		items.push(it);
	}
	if (items.length < 4) return null;
	const Ns = items.map((o) => o.N);
	if (Math.max(...Ns) / Math.min(...Ns) > 1.8) return null;
	if (items.filter((o) => o.c >= 2).length < 3) return null;
	const largest = rng.next() < 0.6;
	const target = largest ? Math.max(...Ns) : Math.min(...Ns);
	const ans = items.find((o) => o.N === target)!;
	// The trap: the extreme coefficient is not the answer.
	const cs = items.map((o) => o.c);
	const extremeC = largest ? Math.max(...cs) : Math.min(...cs);
	if (cs.filter((c) => c === extremeC).length === 1 && ans.c === extremeC) return null;
	const order = shuffle(rng, items);
	const lat = (o: { c: number; s: number }) => (o.s === 1 ? `${o.c}` : radLatex(o.c, 2, o.s));
	const opt = (o: { c: number; s: number; N: number }): Opt => ({ latex: lat(o), value: o.s === 1 ? `${o.c}` : `${o.c}*sqrt(${o.s})`, num: Math.sqrt(o.N), reduced: true });
	const steps = [`\\text{Porta ogni coefficiente dentro la radice e confronta i radicandi.}`];
	for (const o of order) steps.push(o.s === 1 ? `${o.c} = \\sqrt{${o.N}}` : o.c === 1 ? `\\sqrt{${o.s}}` : `${lat(o)} = \\sqrt{${o.c}^{2} \\cdot ${o.s}} = \\sqrt{${o.N}}`);
	steps.push(`\\text{Il radicando ${largest ? 'più grande' : 'più piccolo'} è } ${target}\\text{: il ${largest ? 'maggiore' : 'minore'} è } ${lat(ans)}`);
	const options = order.map(opt);
	return {
		case: 'confronto',
		prompt: largest ? 'Qual è il numero maggiore?' : 'Qual è il numero minore?',
		problem: order.map(lat).join(' \\quad '),
		choice: { options, correct: order.indexOf(ans) },
		steps,
		wrong: [],
		solution: `\\text{Il ${largest ? 'maggiore' : 'minore'} è } ${lat(ans)}`,
	};
}

// Level 5 ---------------------------------------------------------------------

const PAIRS: [number, number][] = [
	[2, 3],
	[3, 2],
	[2, 4],
	[4, 2],
	[3, 6],
	[6, 3],
	[2, 6],
	[6, 2],
];

function powLatex(base: number | string, e: number): string {
	return e === 1 ? `${base}` : `${base}^{${e}}`;
}

function buildL5(rng: Rng, kind: string): Built | null {
	const prompt = 'Calcola e riduci il risultato.';
	if (kind === 'indici diversi') {
		const [n1, n2] = rng.pick(PAIRS);
		const m = lcm(n1, n2);
		const flavour = weighted(rng, [
			['stessa base', 4],
			['basi diverse', 2],
			['lettere', 4],
		] as [string, number][]);
		const div = flavour !== 'basi diverse' && rng.next() < 0.4;
		const op = div ? ':' : '\\cdot';
		let i: number, j: number, A: number | string, B: number | string, p: number | string, pB: number | string;
		if (flavour === 'lettere') {
			p = pB = rng.pick(['a', 'x']);
			i = rng.int(1, n1 - 1);
			j = rng.int(1, n2 - 1);
			if (gcd(i, n1) !== 1 || gcd(j, n2) !== 1) return null;
			A = powLatex(p, i);
			B = powLatex(p, j);
		} else {
			p = rng.pick([2, 3, 5]);
			pB = flavour === 'basi diverse' ? rng.pick([2, 3, 5].filter((z) => z !== p)) : p;
			i = rng.int(1, n1 - 1);
			j = rng.int(1, n2 - 1);
			if (gcd(i, n1) !== 1 || gcd(j, n2) !== 1) return null;
			A = (p as number) ** i;
			B = (pB as number) ** j;
			if ((A as number) > 32 || (B as number) > 32) return null;
		}
		const ei = (i * m) / n1, ej = (j * m) / n2;
		let raw: Term;
		let rawLatex: string;
		if (flavour === 'basi diverse') {
			const R = (p as number) ** ei * (pB as number) ** ej;
			if (R > 500) return null;
			raw = { c: 1, out: {}, n: m, R, rin: {} };
			rawLatex = `${powLatex(p, ei)} \\cdot ${powLatex(pB, ej)}`;
		} else {
			const k = div ? ei - ej : ei + ej;
			if (k <= 0) return null;
			if (typeof p === 'number') {
				if (p ** k > 5000) return null;
				raw = { c: 1, out: {}, n: m, R: p ** k, rin: {} };
			} else raw = { c: 1, out: {}, n: m, R: 1, rin: { [p]: k } };
			rawLatex = `${powLatex(p, ei)} ${div ? ':' : '\\cdot'} ${powLatex(p, ej)}`;
		}
		const res = rad(1, raw.n, raw.R, raw.rin);
		if (res.n === 1 && res.c === 1 && !Object.keys(res.out).length) return null;
		const problem = `${rootLatex(n1, `${A}`)} ${op} ${rootLatex(n2, `${B}`)}`;
		const steps = [`\\text{Il mcm degli indici } ${n1} \\text{ e } ${n2} \\text{ è } ${m}\\text{: porta i due radicali all'indice } ${m}\\text{.}`];
		const conv = (n: number, base: number | string, e: number) => (n === m ? `${rootLatex(n, `${powLatex(base, e)}`)}` : `${rootLatex(n, `${powLatex(base, e)}`)} = ${rootLatex(m, `${powLatex(base, (e * m) / n)}`)}`);
		if (n1 !== m) steps.push(conv(n1, p, i));
		if (n2 !== m) steps.push(conv(n2, pB, j));
		const rawT = termLatex(raw);
		steps.push(`${rootLatex(m, rawLatex)} = ${rawT}`);
		if (termLatex(res) !== rawT) steps.push(`\\text{Riduci: } ${rawT} = ${termLatex(res)}`);
		const nA = typeof A === 'number' ? A : 1, nB = typeof B === 'number' ? B : 1;
		const wrong: (Opt | null)[] = [];
		if (flavour === 'lettere') {
			const l = p as string;
			if (!div || i > j) wrong.push(termOpt(rad(1, m, 1, { [l]: div ? i - j : i + j }))); // exponents not converted
			wrong.push(termOpt(rad(1, n1 + n2, 1, { [l]: div ? Math.abs(i - j) || 1 : i + j })));
			wrong.push(termOpt(rad(1, n1 * n2, 1, { [l]: div ? Math.abs(i - j) || 1 : i * j })));
		} else {
			if (!div) {
				wrong.push(termOpt(rad(1, m, nA * nB))); // radicands multiplied, not raised
				wrong.push(termOpt(rad(1, n1 + n2, nA * nB))); // indices added
				wrong.push(termOpt(rad(1, n1 * n2, nA * nB)));
			} else {
				if (nA % nB === 0 && nA > nB) wrong.push(termOpt(rad(1, m, nA / nB)));
				if (nB % nA === 0 && nB > nA) wrong.push(termOpt(rad(1, m, nB / nA)));
				wrong.push(termOpt(rad(1, Math.abs(n1 - n2) || 2, nA * nB)));
				wrong.push(termOpt(rad(1, m, nA * nB)));
			}
		}
		if (termLatex(res) !== rawT) wrong.unshift(rawOpt(raw.c, raw.n, raw.R, raw.rin));
		return { case: kind, prompt, problem, result: [res], steps, wrong: wrong.filter((o): o is Opt => o !== null) };
	}
	if (kind === 'potenza') {
		const n = weighted(rng, [
			[2, 4],
			[3, 4],
			[4, 2],
		] as [number, number][]);
		const c = rng.next() < 0.7 ? 1 : rng.int(2, 3);
		const s = rng.pick(n === 2 ? [2, 3, 5, 6, 7] : n === 3 ? [2, 3, 4, 5] : [2, 3]);
		const k = rng.int(2, c > 1 ? 3 : 5);
		if (c === 1 && k === n) return null;
		if (s ** k > 3200 || c ** k > 27) return null;
		const problem = `\\left(${radLatex(c, n, s)}\\right)^{${k}}`;
		const raw: Term = { c: c ** k, out: {}, n, R: s ** k, rin: {} };
		const res = rad(c ** k, n, s ** k);
		const steps: string[] = [];
		if (c > 1) steps.push(`\\text{Eleva alla } ${k} \\text{ il coefficiente e il radicale: } ${problem} = ${c}^{${k}} \\cdot \\left(${rootLatex(n, `${s}`)}\\right)^{${k}} = ${c ** k} \\cdot ${rootLatex(n, `${s}^{${k}}`)} = ${termLatex(raw)}`);
		else steps.push(`\\text{Per elevare un radicale a potenza si eleva il radicando: } ${problem} = ${rootLatex(n, `${s}^{${k}}`)} = ${termLatex(raw)}`);
		if (termLatex(res) !== termLatex(raw)) steps.push(`\\text{Riduci: } ${termLatex(raw)} = ${termLatex(res)}`);
		const wrong: (Opt | null)[] = [
			termLatex(res) !== termLatex(raw) ? rawOpt(raw.c, n, raw.R) : null,
			c > 1 ? termOpt(rad(c, n, s ** k)) : null, // coefficient not raised
			c > 1 ? termOpt(intTerm(c ** k * s ** k)) : null, // the root taken as its radicand
			termOpt(rad(c ** k, n, s * k)), // power done as a product
			termOpt(rad(c ** k, n * k, s)), // exponent into the index
			termOpt(rad(c * k, n, s ** k)),
		];
		return { case: kind, prompt, problem, result: [res], steps, wrong: wrong.filter((o): o is Opt => o !== null) };
	}
	// root of a radical
	const m = rng.pick([2, 3]), n = rng.pick([2, 3]);
	if (m * n === 9) return null; // indices up to 6, as in the lesson
	const withCoef = rng.next() < 0.45;
	let problem: string, X: number;
	const steps: string[] = [];
	const wrong: (Opt | null)[] = [];
	if (withCoef) {
		const c = rng.pick([2, 3]), s = rng.pick([2, 3, 5]);
		X = c ** n * s;
		if (X > 250) return null;
		problem = rootLatex(m, radLatex(c, n, s));
		steps.push(`\\text{Prima porta il } ${c} \\text{ dentro la radice interna: } ${radLatex(c, n, s)} = ${rootLatex(n, `${c}^{${n}} \\cdot ${s}`)} = ${rootLatex(n, `${X}`)}`);
		steps.push(`\\text{Poi moltiplica gli indici: } ${rootLatex(m, rootLatex(n, `${X}`))} = ${rootLatex(m * n, `${X}`)}`);
		wrong.push(termOpt(rad(c, m * n, s))); // the coefficient left out
		wrong.push(termOpt(rad(1, m * n, c * s))); // the coefficient in without its power
		wrong.push(termOpt(rad(1, m + n, X))); // indices added
	} else {
		const p = rng.pick([2, 3, 5, 6, 7]);
		const e = rng.int(1, p <= 3 ? 6 : 2);
		X = p ** e;
		if (X > 100) return null;
		problem = rootLatex(m, rootLatex(n, `${X}`));
		steps.push(`\\text{La radice di un radicale ha per indice il prodotto degli indici: } ${problem} = ${rootLatex(m * n, `${X}`)}`);
		wrong.push(termOpt(rad(1, m + n, X))); // indices added
		wrong.push(termOpt(rad(1, Math.max(m, n), X))); // one root only
		wrong.push(termOpt(rad(1, m * n, X * 2)));
	}
	const raw: Term = { c: 1, out: {}, n: m * n, R: X, rin: {} };
	const res = rad(1, m * n, X);
	if (termLatex(res) !== termLatex(raw)) {
		const fac = primeFactors(X);
		steps.push(`\\text{Riduci: } ${termLatex(raw)} = ${rootLatex(m * n, fac.map(([q, e]) => powLatex(q, e)).join(' \\cdot '))} = ${termLatex(res)}`);
		wrong.unshift(rawOpt(1, m * n, X));
	}
	return { case: kind, prompt, problem, result: [res], steps, wrong: wrong.filter((o): o is Opt => o !== null) };
}

// Level 6 ---------------------------------------------------------------------

interface SumTerm {
	sign: 1 | -1;
	k: number;
	f: number;
	s: number;
	letter?: string;
}

function buildL6(rng: Rng, flavour: string): Built | null {
	const n = flavour === 'indice 3' ? 3 : 2;
	const groups = flavour === 'numeri' && rng.next() < 0.45 ? 2 : 1;
	const bases = n === 3 ? [rng.pick([2, 3])] : shuffle(rng, flavour === 'lettere' ? [1, 2, 3] : [2, 3, 5, 6, 7]).slice(0, groups);
	const letter = flavour === 'lettere' ? rng.pick(['a', 'x']) : undefined;
	const terms: SumTerm[] = [];
	const counts = groups === 2 ? rng.pick([[2, 1], [1, 2], [2, 2]]) : [n === 3 ? rng.int(2, 3) : 3];
	bases.forEach((s, g) => {
		for (let i = 0; i < counts[g]; i++) {
			const f = rng.int(1, n === 3 ? 4 : 5);
			const k = n === 2 && rng.next() < 0.2 ? rng.int(2, 3) : 1;
			terms.push({ sign: rng.next() < 0.4 ? -1 : 1, k, f, s, letter });
		}
	});
	const order = shuffle(rng, terms);
	order[0].sign = rng.next() < 0.85 ? 1 : -1;
	const N = (t: SumTerm) => t.f ** n * t.s;
	if (order.some((t) => N(t) > (n === 3 ? 250 : letter ? 50 : 150))) return null;
	if (order.filter((t) => t.f > 1).length < 2) return null;
	// no two terms written the same way
	const keys = order.map((t) => `${t.k}|${N(t)}`);
	if (new Set(keys).size !== keys.length) return null;
	// in each group the radicands differ (otherwise the radicals are already similar)
	for (const s of bases) if (new Set(order.filter((t) => t.s === s).map(N)).size < Math.min(2, order.filter((t) => t.s === s).length)) return null;
	const rin = (t: SumTerm): Letters => (t.letter ? { [t.letter]: 1 } : {});
	const negInside = n === 3 && rng.next() < 0.4;
	const written = order.map((t, i) => {
		const body = radicandLatex(N(t), rin(t));
		if (negInside && i === 0 && t.sign < 0) return `\\sqrt[3]{-${body}}`;
		return `${i === 0 ? (t.sign < 0 ? '-' : '') : t.sign < 0 ? ' - ' : ' + '}${coefLatex(t.k, rootLatex(n, body))}`;
	});
	const problem = written.join('');
	const reduced = order.map((t) => rad(t.sign * t.k, n, N(t), rin(t)));
	const res = combine(reduced);
	if (!res.length) return null;
	if (res.some((t) => Math.abs(t.c) > 30)) return null;
	const steps = [`\\text{Porta fuori da ogni radicale tutti i fattori possibili.}`];
	order.forEach((t, i) => {
		const w = coefLatex(t.k, rootLatex(n, radicandLatex(N(t), rin(t))));
		const rr = rad(t.k, n, N(t), rin(t));
		if (t.f === 1) return;
		steps.push(t.k > 1 ? `${w} = ${t.k} \\cdot ${termLatex(rad(1, n, N(t), rin(t)))} = ${termLatex(rr)}` : negInside && i === 0 && t.sign < 0 ? `\\sqrt[3]{-${radicandLatex(N(t), rin(t))}} = ${termLatex(rad(-1, n, N(t)))}` : `${w} = ${termLatex(rr)}`);
	});
	steps.push(`\\text{Somma i radicali simili: } ${sumLatex(reduced)} = ${sumLatex(res)}`);
	// Mistakes
	const wrong: (Opt | null)[] = [];
	const total = order.reduce((acc, t) => acc + t.sign * t.k * t.k * N(t), 0);
	if (n === 2 && !letter && total > 1 && order.every((t) => t.k === 1)) wrong.push(termOpt(rad(1, 2, total))); // radicands added
	if (res.length === 1 && Math.abs(res[0].c) > 1 && !letter) wrong.push(rawOpt(res[0].c < 0 ? -1 : 1, n, res[0].c ** n * res[0].R)); // right value, not reduced
	for (let i = 0; i < order.length; i++) {
		const flipped = order.map((t, h) => rad((h === i ? -t.sign : t.sign) * t.k, n, N(t), rin(t)));
		wrong.push(sumOpt(combine(flipped))); // one sign wrong
	}
	if (order.some((t) => t.k > 1)) wrong.push(sumOpt(combine(order.map((t) => rad(t.sign, n, N(t), rin(t)))))); // coefficient forgotten
	if (res.length === 2) wrong.push(sumOpt(combine([{ ...res[0], c: res[1].c }, { ...res[1], c: res[0].c }]))); // coefficients swapped
	if (res.length === 2) wrong.push(sumOpt([{ ...res[1], c: res[0].c + res[1].c }]));
	wrong.push(sumOpt(combine(order.map((t) => ({ ...rad(t.sign * t.k, n, N(t), rin(t)), c: t.sign * t.k * t.f * t.f })))));
	return {
		case: flavour === 'numeri' ? (groups === 2 ? 'due gruppi' : 'un gruppo') : flavour,
		prompt: letter ? 'Calcola la somma e riduci il risultato (le lettere sono positive).' : 'Calcola la somma e riduci il risultato.',
		problem,
		result: res,
		steps,
		wrong: wrong.filter((o): o is Opt => o !== null),
	};
}

// Level 7 ---------------------------------------------------------------------

/** c√s, or the integer c when s = 1. */
interface Q {
	c: number;
	s: number;
}

const qLatex = (x: Q) => (x.s === 1 ? `${x.c}` : radLatex(x.c, 2, x.s).replace(/^-1\\/, '-\\'));
const qSq = (x: Q) => x.c * x.c * x.s;
const qMul = (x: Q, y: Q): Term => rad(x.c * y.c, 2, x.s * y.s);

/** (x + y) with the sign of y shown: "\sqrt{5} - \sqrt{3}". */
function binLatex(x: Q, y: Q): string {
	const ly = qLatex(y);
	return `${qLatex(x)} ${ly.startsWith('-') ? `- ${ly.slice(1)}` : `+ ${ly}`}`;
}

const sqLatex = (x: Q) => (x.s === 1 ? (x.c < 0 ? `(${x.c})^{2}` : `${x.c}^{2}`) : `\\left(${qLatex(x)}\\right)^{2}`);

function randomQ(rng: Rng, radical: boolean): Q {
	if (!radical) return { c: rng.pick([1, 2, 3, 4, 5]), s: 1 };
	return { c: rng.next() < 0.7 ? 1 : rng.int(2, 3), s: rng.pick([2, 3, 5, 6, 7, 10]) };
}

function buildL7(rng: Rng, kind: string): Built | null {
	const prompt = 'Calcola e riduci il risultato.';
	if (kind === 'quadrato' || kind === 'quadrato e somma') {
		const two = rng.next() < 0.5;
		let x = randomQ(rng, true), y = randomQ(rng, two);
		if (!two && rng.next() < 0.5) [x, y] = [y, x];
		if (x.s === y.s) return null;
		if (rng.next() < 0.5) y = { ...y, c: -y.c };
		if (qSq(x) > 30 || qSq(y) > 30) return null;
		const dp = qMul(x, y);
		const dp2 = { ...dp, c: 2 * dp.c };
		const sq = qSq(x) + qSq(y);
		let problem = `\\left(${binLatex(x, y)}\\right)^{2}`;
		let res = combine([intTerm(sq), dp2]);
		let extra: Term | null = null;
		if (kind === 'quadrato e somma') {
			if (dp2.n === 1) return null;
			const unit = { ...dp2, c: 1 };
			const kk = rng.pick([-3, -2, -1, 1, 2, 3].filter((z) => z !== 0));
			const mult = rng.next() < 0.5 ? -dp2.c : kk; // half the time the radical cancels, as in the lesson
			if (mult === 0) return null;
			extra = { ...unit, c: mult };
			problem += ` ${mult < 0 ? '-' : '+'} ${termLatex({ ...extra, c: Math.abs(mult) })}`;
			res = combine([intTerm(sq), dp2, extra]);
		}
		if (!res.length) return null;
		const steps = [
			`\\text{Quadrato di un binomio: il quadrato del primo, il doppio prodotto, il quadrato del secondo.}`,
			`${sqLatex(x)} = ${qSq(x)} \\qquad ${sqLatex(y)} = ${qSq(y)}`,
			`2 \\cdot ${x.s === 1 ? `${x.c}` : qLatex(x)} \\cdot ${y.c < 0 ? `\\left(${qLatex(y)}\\right)` : qLatex(y)} = ${termLatex(dp2)}`,
		];
		const expanded = sumLatex([intTerm(qSq(x)), dp2, intTerm(qSq(y))]);
		steps.push(extra ? `${expanded} ${extra.c < 0 ? '-' : '+'} ${termLatex({ ...extra, c: Math.abs(extra.c) })} = ${sumLatex(res)}` : `${expanded} = ${sumLatex(res)}`);
		const add = (ts: Term[]) => sumOpt(combine(extra ? [...ts, extra] : ts));
		const wrong: (Opt | null)[] = [
			add([intTerm(qSq(x) - qSq(y))]), // (a - b)^2 = a^2 - b^2
			add([intTerm(sq)]), // double product forgotten
			add([intTerm(sq), dp]), // double product without the 2
			add([intTerm(sq), { ...dp2, c: -dp2.c }]), // sign of the double product
			add([intTerm(x.c * x.s + y.c * y.s * Math.sign(y.c)), dp2]), // coefficient not squared
		];
		return { case: kind, prompt, problem, result: res, steps, wrong: wrong.filter((o): o is Opt => o !== null) };
	}
	if (kind === 'somma per differenza') {
		const both = rng.next() < 0.5;
		let x = randomQ(rng, true), y = randomQ(rng, both);
		if (!both && rng.next() < 0.5) [x, y] = [y, x];
		if (x.s === y.s && x.s !== 1) return null;
		if (qSq(x) > 50 || qSq(y) > 50 || qSq(x) === qSq(y)) return null;
		const plusFirst = rng.next() < 0.5;
		const neg = { ...y, c: -y.c };
		const problem = plusFirst ? `\\left(${binLatex(x, y)}\\right)\\left(${binLatex(x, neg)}\\right)` : `\\left(${binLatex(x, neg)}\\right)\\left(${binLatex(x, y)}\\right)`;
		const r = qSq(x) - qSq(y);
		const steps = [
			`\\text{Somma per differenza: il quadrato del primo meno il quadrato del secondo. I radicali spariscono.}`,
			`${sqLatex(x)} - ${sqLatex(y)} = ${qSq(x)} - ${qSq(y)} = ${r}`,
		];
		const wrong: (Opt | null)[] = [
			sumOpt([intTerm(qSq(x) + qSq(y))]),
			sumOpt([intTerm(-r)]),
			sumOpt([intTerm(x.c * x.s - y.c * y.s)]), // coefficients not squared
			sumOpt(combine([intTerm(r), { ...qMul(x, y), c: -2 * qMul(x, y).c }])), // a square of a binomial instead
		];
		return { case: kind, prompt, problem, result: [intTerm(r)], steps, wrong: wrong.filter((o): o is Opt => o !== null) };
	}
	// (c1√s + m1)(c2√s + m2)
	const s = rng.pick([2, 3, 5, 6, 7]);
	const c1 = rng.next() < 0.7 ? 1 : rng.int(2, 3), c2 = rng.next() < 0.7 ? 1 : 2;
	const m1 = rng.pick([-3, -2, -1, 1, 2, 3, 4]), m2 = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
	if (c1 === c2 && m1 === -m2) return null; // that is a sum times a difference
	if (c1 === c2 && m1 === m2) return null; // that is a square
	const lin = c1 * m2 + c2 * m1;
	if (lin === 0) return null;
	const x1: Q = { c: c1, s }, x2: Q = { c: c2, s };
	const f1 = rng.next() < 0.7 ? binLatex(x1, { c: m1, s: 1 }) : binLatex({ c: m1, s: 1 }, x1);
	const f2 = rng.next() < 0.7 ? binLatex(x2, { c: m2, s: 1 }) : binLatex({ c: m2, s: 1 }, x2);
	const problem = `\\left(${f1}\\right)\\left(${f2}\\right)`;
	const R = c1 * c2 * s + m1 * m2;
	const res = combine([intTerm(R), rad(lin, 2, s)]);
	const pieces = [intTerm(c1 * c2 * s), rad(c1 * m2, 2, s), rad(c2 * m1, 2, s), intTerm(m1 * m2)];
	const steps = [`\\text{Moltiplica ogni termine del primo per ogni termine del secondo.}`, `${problem} = ${sumLatex(pieces)}`, `\\text{Somma i termini simili: } ${sumLatex(pieces)} = ${sumLatex(res)}`];
	const wrong: (Opt | null)[] = [
		sumOpt(combine([intTerm(c1 * c2 * s + m1 * m2)])), // cross terms forgotten
		sumOpt(combine([intTerm(R), rad(c1 * m2 - c2 * m1, 2, s)])), // sign of a cross term
		sumOpt(combine([intTerm(c1 * c2 + m1 * m2), rad(lin, 2, s)])), // √s·√s taken as √s... as 1
		sumOpt(combine([intTerm(c1 * c2 * s * s + m1 * m2), rad(lin, 2, s)])),
		sumOpt(combine([intTerm(R), rad(-lin, 2, s)])),
	];
	return { case: kind, prompt, problem, result: res, steps, wrong: wrong.filter((o): o is Opt => o !== null) };
}

// ---------------------------------------------------------------------------

/** The case of each level, drawn once per exercise so that rejections do not change the shares. */
const KINDS: Record<number, [string, number][]> = {
	1: [
		['prodotto intero', 3],
		['prodotto', 3],
		['quoziente', 2.5],
		['indice 3', 2],
	],
	2: [
		['indice 2', 7],
		['indice 3', 3],
	],
	3: [
		['indice 2', 6.5],
		['indice 3', 3.5],
	],
	4: [
		['dentro', 1],
		['confronto', 1],
	],
	5: [
		['indici diversi', 4],
		['potenza', 3],
		['radice di radicale', 3],
	],
	6: [
		['numeri', 7],
		['lettere', 1.5],
		['indice 3', 1.5],
	],
	7: [
		['quadrato', 3.5],
		['somma per differenza', 2.5],
		['prodotto', 2.5],
		['quadrato e somma', 1.5],
	],
};

function build(rng: Rng, level: number, kind: string): Built | null {
	switch (level) {
		case 1:
			return buildL1(rng, kind);
		case 2:
			return buildL2(rng, kind);
		case 3:
			return buildL3(rng, kind);
		case 4:
			return buildL4(rng, kind);
		case 5:
			return buildL5(rng, kind);
		case 6:
			return buildL6(rng, kind);
		case 7:
			return buildL7(rng, kind);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

const FORBIDDEN: [string, RegExp][] = [
	['+ -', /\+\s*-/],
	['- -', /-\s*-(?!\d)/],
	['1\\sqrt', /(?<![\d])1\\sqrt/],
	['^{1}', /\^\{1\}/],
	['\\sqrt{1}', /\\sqrt(\[\d\])?\{1\}/],
	['0\\sqrt', /(?<![\d])0\\sqrt/],
];

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params as { result?: string[]; case?: string };
	for (const [name, rx] of FORBIDDEN) if (rx.test(sample.problem)) v.push(`testo con '${name}'`);
	if (!sample.steps.length || !sample.solution) v.push('passaggi o soluzione mancanti');
	if (sample.level === 4) {
		if (sample.answer.kind !== 'choice') v.push('il livello 4 è a scelta');
		else if (sample.answer.options.length !== 4) v.push('servono quattro opzioni');
		return v;
	}
	if (sample.answer.kind !== 'expression' || sample.answer.form !== 'simplified') v.push('risposta: expression ridotta');
	if (!p.result?.length) v.push('params.result mancante');
	const c = sample.choice;
	if (c) {
		if (c.options.length !== 4) v.push('servono quattro opzioni');
		if (c.options[c.correct]?.latex !== (sample.answer as { latex?: string }).latex) v.push("l'opzione giusta non è la risposta");
	}
	return v;
}

export const radicaliOperazioni: Generator = {
	id: ID,
	title: 'Operazioni con i radicali',
	levels: {
		1: { label: 'Prodotto e quoziente con lo stesso indice', constraints: ['indice 2 o 3', 'risultato intero o radicale già ridotto'] },
		2: { label: 'Trasporto fuori, radicandi numerici', constraints: ['indice 2 (7 su 10) o 3', 'radicando fino a 300 (400 con indice 3)', 'a volte un coefficiente davanti'] },
		3: { label: 'Trasporto fuori con le lettere', constraints: ['lettere positive', 'almeno un esponente non minore dell’indice', 'qualcosa resta sotto radice'] },
		4: { label: 'Trasporto dentro e confronto', constraints: ['metà trasporto dentro, anche con il segno meno', 'metà confronto di quattro radicali con il coefficiente'] },
		5: { label: 'Indici diversi, potenza e radice di un radicale', constraints: ['indici con mcm fino a 6', 'risultato ridotto, anche con l’indice abbassato'] },
		6: { label: 'Somma di radicali che diventano simili', constraints: ['tre o quattro termini', 'uno o due gruppi di radicali simili', 'a volte lettere o indice 3'] },
		7: { label: 'Prodotti notevoli con i radicali', constraints: ['quadrato di un binomio, somma per differenza, prodotto di binomi', 'risultato intero più un radicale'] },
	},
	generate(rng: Rng, level: number): Sample {
		// With consecutive seeds the first draws of rng.ts are not uniform: skip two before the case.
		rng.next();
		rng.next();
		const kind = KINDS[level] ? weighted(rng, KINDS[level]) : '';
		for (let attempt = 0; attempt < 20_000; attempt++) {
			const b = build(rng, level, kind);
			if (!b) continue;
			let sample: Sample;
			if (b.choice) {
				const order = shuffle(
					rng,
					b.choice.options.map((_, i) => i),
				);
				const opts = b.choice.options;
				// keep the right one and three distractors distinct in value
				const kept: number[] = [b.choice.correct];
				for (const i of order) if (kept.length < 4 && !kept.includes(i) && !kept.some((k) => close(opts[k].num, opts[i].num))) kept.push(i);
				if (kept.length < 4) continue;
				const shown = shuffle(rng, kept);
				const options: ChoiceOption[] = shown.map((i) => ({ latex: opts[i].latex, values: [opts[i].value] }));
				sample = {
					generatorId: ID,
					level,
					seed: rng.seed,
					prompt: b.prompt,
					problem: b.problem,
					solution: b.solution ?? '',
					steps: b.steps,
					answer: { kind: 'choice', options, correct: shown.indexOf(b.choice.correct) },
					params: { case: b.case },
				};
			} else {
				const res = b.result!;
				const latex = sumLatex(res);
				sample = {
					generatorId: ID,
					level,
					seed: rng.seed,
					prompt: b.prompt,
					problem: b.problem,
					solution: `${b.problem} = ${latex}`,
					steps: b.steps,
					answer: { kind: 'expression', value: sumSympy(res), latex, form: 'simplified' },
					params: {
						case: b.case,
						result: res.map(termSympy),
						resultTerms: res,
						wrong: b.wrong.map((o) => ({ latex: o.latex, value: o.value, num: o.num, reduced: o.reduced })),
					},
				};
			}
			if (check(sample).length) continue;
			try {
				if (sample.answer.kind !== 'choice') toChoice(sample, rng);
			} catch {
				continue;
			}
			return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const ans = sample.answer as { value: string; latex: string };
	const wrong = (sample.params.wrong as Opt[]) ?? [];
	const num = sumValueFromWrong(sample);
	const correct: Opt = { latex: ans.latex, value: ans.value, num, reduced: true };
	const res = (sample.params.resultTerms as Term[] | undefined) ?? null;
	return pickOptions(rng, correct, wrong, (i) => (res ? nearSum(res, i) : null));
}

/** The numeric value of the answer, from the terms kept in params. */
function sumValueFromWrong(sample: Sample): number {
	const ts = sample.params.resultTerms as Term[] | undefined;
	if (!ts) throw new Error('resultTerms missing');
	return sumValue(ts);
}

export default radicaliOperazioni;
