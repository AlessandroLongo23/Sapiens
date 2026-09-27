import { q, type Rational } from '@/lib/exercises/v2/rational';
import { evaluate, monoLatex, unwrap, type Mono, type Node } from './equazione';
import { latexOf, parsePolynomial, polyText, trim } from './polinomi';
import { fail, type Outcome, type Step } from './types';
import type { Poly } from '@/lib/exercises/v2/latex';

/**
 * Special products expanded with their rule, the way the lesson names them: the square of a binomial, the square
 * of a trinomial, the cube of a binomial, the sum of two terms times their difference. The terms are the monomials
 * the student wrote, in x, with their signs: in (2x - 3)^2 the terms are 2x and 3, with the rule (a - b)^2.
 */

export const EXAMPLE = '(2x - 3)^2';
const WHAT = 'Scrivi un prodotto notevole, per esempio (2x - 3)^2, (x + 5)(x - 5) o (x + 1)^3.';

export type Kind = 'quadrato-binomio' | 'quadrato-trinomio' | 'cubo-binomio' | 'somma-differenza';

const KIND_NAMES: Record<Kind, string> = {
	'quadrato-binomio': 'Quadrato di un binomio',
	'quadrato-trinomio': 'Quadrato di un trinomio',
	'cubo-binomio': 'Cubo di un binomio',
	'somma-differenza': 'Somma per differenza'
};

/** The name in a sentence, with its article: "è il quadrato di un binomio". */
const KIND_PHRASES: Record<Kind, string> = {
	'quadrato-binomio': 'il quadrato di un binomio',
	'quadrato-trinomio': 'il quadrato di un trinomio',
	'cubo-binomio': 'il cubo di un binomio',
	'somma-differenza': 'una somma per una differenza'
};

/** The signed terms of a bracket that holds a sum of monomials; null when it is not a sum, a message when a term is not a monomial. */
function monomials(n: Node): Mono[] | string | null {
	const inner = unwrap(n);
	if (inner.k !== 'sum') return null;
	const out: Mono[] = [];
	for (const t of inner.terms) {
		const p = trim(evaluate(t.n));
		const nz = p.map((c, deg) => ({ c, deg })).filter((m) => !m.c.isZero());
		if (nz.length === 0) return 'Un termine della parentesi vale 0: toglilo e scrivi solo i monomi, per esempio (2x - 3)^2.';
		if (nz.length > 1) return 'Dentro la parentesi scrivi solo monomi, come 2x, x^2 o 3: per esempio (2x - 3)^2.';
		out.push({ c: t.neg ? nz[0].c.neg() : nz[0].c, deg: nz[0].deg });
	}
	return out;
}

const same = (a: Mono, b: Mono) => a.deg === b.deg && a.c.equals(b.c);
const opposite = (a: Mono, b: Mono) => a.deg === b.deg && a.c.equals(b.c.neg());
const times = (k: number, ...ms: Mono[]): Mono => ({ c: ms.reduce((c, m) => c.mul(m.c), q(k)), deg: ms.reduce((d, m) => d + m.deg, 0) });
const negate = (m: Mono): Mono => ({ c: m.c.neg(), deg: m.deg });

/** A monomial in LaTeX, with its sign: "2x", "-3", "\frac{1}{2}x^2". */
const mono = (m: Mono): string => monoLatex([{ c: m.c, deg: m.deg }]);

/** A monomial as a base of a power: bare when it is x or a positive whole number, in brackets otherwise. */
function base(m: Mono): string {
	const s = mono(m);
	const bare = (m.deg === 1 && m.c.isOne()) || (m.deg === 0 && m.c.isInteger() && m.c.sign() > 0);
	if (bare) return s;
	return m.c.isInteger() ? `(${s})` : `\\left(${s}\\right)`;
}

/** A monomial as a factor after "\cdot": in brackets when negative. */
const factor = (m: Mono): string => (m.c.sign() < 0 ? `(${mono(m)})` : mono(m));

/** "2 \cdot 2x \cdot 3" with the leading number, then the factors. */
const product = (k: number, ...ms: Mono[]): string => [k === 1 ? null : `${k}`, ...ms.map((m, i) => (i === 0 && k === 1 ? mono(m) : factor(m)))].filter(Boolean).join(' \\cdot ');
const power = (m: Mono, e: number) => `${base(m)}^{${e}}`;

interface Recognized {
	kind: Kind;
	/** The rule, in letters. */
	rule: string;
	/** Which monomial each letter stands for. */
	letters: [string, Mono][];
	/** Each part of the rule: name, calculation, result. */
	parts: { name: string; calc: string; value: Mono }[];
}

/** The square or the cube of a binomial with terms A and B0, signed as written. */
function binomial(A: Mono, B0: Mono, e: 2 | 3): Recognized {
	// (a - b): b is written without its sign, and the rule has the minus.
	const minus = B0.c.sign() < 0 && A.c.sign() > 0;
	const B = minus ? negate(B0) : B0;
	const s = minus ? '-' : '+';
	const letters: [string, Mono][] = [
		['a', A],
		['b', B]
	];
	if (e === 2)
		return {
			kind: 'quadrato-binomio',
			rule: `(a ${s} b)^2 = a^2 ${s} 2ab + b^2`,
			letters,
			parts: [
				{ name: 'Quadrato del primo termine', calc: power(A, 2), value: times(1, A, A) },
				{ name: 'Doppio prodotto', calc: `${minus ? '-' : ''}${product(2, A, B)}`, value: times(minus ? -2 : 2, A, B) },
				{ name: 'Quadrato del secondo termine', calc: power(B, 2), value: times(1, B, B) }
			]
		};
	return {
		kind: 'cubo-binomio',
		rule: `(a ${s} b)^3 = a^3 ${s} 3a^2b + 3ab^2 ${s} b^3`,
		letters,
		parts: [
			{ name: 'Cubo del primo termine', calc: power(A, 3), value: times(1, A, A, A) },
			{ name: 'Triplo prodotto del quadrato del primo per il secondo', calc: `${minus ? '-' : ''}3 \\cdot ${power(A, 2)} \\cdot ${factor(B)}`, value: times(minus ? -3 : 3, A, A, B) },
			{ name: 'Triplo prodotto del primo per il quadrato del secondo', calc: `${product(3, A)} \\cdot ${power(B, 2)}`, value: times(3, A, B, B) },
			{ name: 'Cubo del secondo termine', calc: `${minus ? '-' : ''}${power(B, 3)}`, value: times(minus ? -1 : 1, B, B, B) }
		]
	};
}

function recognize(node: Node): Recognized | string {
	const n = unwrap(node);
	if (n.k === 'pow' && n.e > 3 && monomials(n.b)) return 'Con esponente 4 o più serve il triangolo di Tartaglia: qui ci sono quadrati e cubi, come (x + 1)^3.';
	if (n.k === 'pow' && (n.e === 2 || n.e === 3)) {
		const ts = monomials(n.b);
		if (typeof ts === 'string') return ts;
		if (!ts || ts.length < 2) return WHAT;
		if (ts.length === 2) return binomial(ts[0], ts[1], n.e as 2 | 3);
		if (ts.length === 3 && n.e === 2) {
			const [A, B, C] = ts;
			return {
				kind: 'quadrato-trinomio',
				rule: '(a + b + c)^2 = a^2 + b^2 + c^2 + 2ab + 2ac + 2bc',
				letters: [
					['a', A],
					['b', B],
					['c', C]
				],
				parts: [
					{ name: 'Quadrato del primo termine', calc: power(A, 2), value: times(1, A, A) },
					{ name: 'Quadrato del secondo termine', calc: power(B, 2), value: times(1, B, B) },
					{ name: 'Quadrato del terzo termine', calc: power(C, 2), value: times(1, C, C) },
					{ name: 'Doppio prodotto del primo per il secondo', calc: product(2, A, B), value: times(2, A, B) },
					{ name: 'Doppio prodotto del primo per il terzo', calc: product(2, A, C), value: times(2, A, C) },
					{ name: 'Doppio prodotto del secondo per il terzo', calc: product(2, B, C), value: times(2, B, C) }
				]
			};
		}
		return n.e === 3
			? 'Il cubo che conosce questo strumento è quello di un binomio, come (x + 1)^3.'
			: 'Il quadrato che conosce questo strumento è quello di un binomio o di un trinomio, come (x - 3)^2 o (x^2 + x - 1)^2.';
	}
	if (n.k === 'mul' && n.f.length === 2) {
		const p = monomials(n.f[0]);
		const r = monomials(n.f[1]);
		if (typeof p === 'string') return p;
		if (typeof r === 'string') return r;
		if (!p || !r || p.length !== 2 || r.length !== 2) return WHAT;
		// One term equal in both brackets, the other opposite.
		for (const [i, j] of [
			[0, 0],
			[0, 1],
			[1, 0],
			[1, 1]
		]) {
			const oi = 1 - i;
			const oj = 1 - j;
			if (same(p[i], r[j]) && opposite(p[oi], r[oj])) {
				const A = p[i];
				const B = p[oi].c.sign() > 0 ? p[oi] : r[oj];
				return {
					kind: 'somma-differenza',
					rule: '(a + b)(a - b) = a^2 - b^2',
					letters: [
						['a', A],
						['b', B]
					],
					parts: [
						{ name: 'Quadrato del termine uguale', calc: power(A, 2), value: times(1, A, A) },
						{ name: 'Meno il quadrato del termine opposto', calc: `-${power(B, 2)}`, value: times(-1, B, B) }
					]
				};
			}
		}
		// Two equal brackets: the square of a binomial written as a product.
		if ((same(p[0], r[0]) && same(p[1], r[1])) || (same(p[0], r[1]) && same(p[1], r[0]))) return binomial(p[0], p[1], 2);
		return 'Per la somma per differenza le due parentesi hanno un termine uguale e uno opposto, come (x + 5)(x - 5). Queste no: moltiplica termine per termine.';
	}
	return WHAT;
}

/** Adds the like terms of a list of monomials: the polynomial, highest degree first. */
function collect(ms: Mono[]): Poly {
	const out: Poly = [];
	for (const m of ms) {
		while (out.length <= m.deg) out.push(q(0));
		out[m.deg] = out[m.deg].add(m.c);
	}
	return trim(out);
}

/** The expansion of a special product typed by the student, with the rule and each of its parts. */
export function prodottiNotevoli(input: string): Outcome {
	const parsed = parsePolynomial(input, EXAMPLE);
	if (!parsed.ok) return fail(parsed.error);
	let rec: Recognized | string;
	try {
		rec = recognize(parsed.node);
	} catch {
		return fail('I numeri sono troppo grandi per fare i calcoli esatti: prova con coefficienti più piccoli.');
	}
	if (typeof rec === 'string') return fail(rec);
	try {
		const values = rec.parts.map((p) => p.value);
		const result = collect(values);
		if (!polyEqual(result, parsed.p)) return fail('Qualcosa non torna nel calcolo: controlla come hai scritto il prodotto.');
		const steps: Step[] = [
			{
				say: `Riconosci il prodotto notevole: è ${KIND_PHRASES[rec.kind]}.`,
				math: [parsed.latex, rec.rule]
			},
			{
				say: rec.letters.length === 2 ? 'Individua i due termini $a$ e $b$.' : 'Individua i tre termini $a$, $b$ e $c$.',
				table: { head: ['Lettera', 'Monomio'], rows: rec.letters.map(([l, m]) => [`$${l}$`, `$${mono(m)}$`]) },
				then:
					rec.kind === 'quadrato-binomio' || rec.kind === 'cubo-binomio'
						? rec.rule.startsWith('(a -')
							? 'Il segno meno è già nella regola: $b$ si scrive senza segno.'
							: undefined
						: rec.kind === 'quadrato-trinomio' && rec.letters.some(([, m]) => m.c.sign() < 0)
							? 'Ogni termine si prende con il suo segno.'
							: undefined
			},
			{
				say: 'Calcola ogni parte della regola.',
				table: { head: ['Parte', 'Calcolo', 'Risultato'], rows: rec.parts.map((p) => [p.name, `$${p.calc}$`, `$\\hl{${mono(p.value)}}$`]) }
			}
		];
		const sum = monoLatex(values);
		const ordered = latexOf(result);
		const needsCollect = sum.replace(/\s+/g, '') !== ordered.replace(/\s+/g, '');
		const similar = new Set(values.map((v) => v.deg)).size < values.length;
		steps.push({
			say: 'Scrivi la somma dei risultati.',
			math: [`${parsed.latex} = ${sum}`, ...(needsCollect ? [`= \\hl{${ordered}}`] : [])],
			then: needsCollect ? (similar ? 'Nell’ultima riga i termini simili sono sommati e ordinati dal grado più alto.' : 'Nell’ultima riga i termini sono ordinati dal grado più alto.') : undefined
		});
		return {
			ok: true,
			rows: [
				{ label: 'Sviluppo', value: `$${ordered}$` },
				{ label: 'Prodotto notevole', value: `${KIND_NAMES[rec.kind]}: $${rec.rule}$` }
			],
			copy: polyText(result),
			steps
		};
	} catch {
		return fail('I numeri sono troppo grandi per fare i calcoli esatti: prova con coefficienti più piccoli.');
	}
}

function polyEqual(a: Poly, b: Poly): boolean {
	const x = trim(a);
	const y = trim(b);
	return x.length === y.length && x.every((c: Rational, i) => c.equals(y[i]));
}
