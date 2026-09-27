import { exactSqrt, gcd, lcm, q, type Rational } from '@/lib/exercises/v2/rational';
import type { Poly } from '@/lib/exercises/v2/latex';
import { binomialLatex, factorLatex, sameLatex, latexOf, orderStep, parsePolynomial, polyAt, polyDegree, polyMul, polyText, ruffiniScheme, ruffiniTable, term, trim } from './polinomi';
import { fail, type Outcome, type Step } from './types';

/**
 * Factoring a polynomial in x with rational coefficients, with the methods of the first two years of liceo, in the
 * order a textbook tries them: common factor (raccoglimento totale), then on each factor the special products
 * (difference of squares, square of a binomial, sum and difference of cubes), the "trinomio notevole" with sum and
 * product, and Ruffini's rule on the rational zeros. Each step names its method. When no method applies to a factor
 * of degree 4 or more, the tool says it could not factor it, and does not claim it is irreducible.
 */

export const EXAMPLE = 'x^3 - 2x^2 - 5x + 6';
const MAX_COEFFICIENT = 1e6;

/** An exact integer square root, or null. */
function isqrt(n: number): number | null {
	if (n < 0) return null;
	const r = exactSqrt(q(n));
	return r ? r.num : null;
}

/** An exact integer cube root (with sign), or null. */
function icbrt(n: number): number | null {
	const r = Math.round(Math.cbrt(Math.abs(n)));
	return r * r * r === Math.abs(n) ? (n < 0 ? -r : r) : null;
}

function divisors(n: number): number[] {
	const a = Math.abs(n);
	const small: number[] = [];
	const large: number[] = [];
	for (let d = 1; d * d <= a; d++)
		if (a % d === 0) {
			small.push(d);
			if (d * d !== a) large.unshift(a / d);
		}
	return [...small, ...large];
}

/** The non-zero terms: degree and integer coefficient. */
const terms = (p: Poly) => p.map((c, k) => ({ k, c: c.num })).filter((t) => t.c !== 0);

/** p/q is a zero of p, computed exactly as Σ a_k p^k q^(n-k). */
function isZeroAt(p: Poly, num: number, den: number): boolean {
	const n = p.length - 1;
	let s = 0n;
	p.forEach((c, k) => {
		s += BigInt(c.num) * BigInt(num) ** BigInt(k) * BigInt(den) ** BigInt(n - k);
	});
	return s === 0n;
}

const mono = (c: number | Rational, k: number): string => latexOf(term(typeof c === 'number' ? q(c) : c, k));
const pow = (k: number) => (k === 0 ? '' : k === 1 ? 'x' : `x^{${k}}`);
/** A monomial as the base of a power: "x", "3", "(2x)", "(x^{2})". */
function base(c: number, k: number): string {
	const s = mono(c, k);
	return (c === 1 && k === 1) || k === 0 ? s : `(${s})`;
}

interface Found {
	factors: Poly[];
	steps: Step[];
	/** Factors already known not to split further (the "falso quadrato"). */
	final?: boolean[];
}

// ---------------------------------------------------------------------------
// The methods, on a primitive polynomial with integer coefficients, positive leading coefficient, degree ≥ 2 and
// constant term not zero.

function differenceOfSquares(F: Poly): Found | null {
	const ts = terms(F);
	if (ts.length !== 2) return null;
	const [c, a] = ts;
	if (c.k !== 0 || a.k % 2 !== 0 || c.c >= 0) return null;
	const ra = isqrt(a.c);
	const rc = isqrt(-c.c);
	if (ra === null || rc === null) return null;
	const m = a.k / 2;
	const minus = trim([q(-rc), ...Array.from({ length: m - 1 }, () => q(0)), q(ra)]);
	const plus = trim([q(rc), ...Array.from({ length: m - 1 }, () => q(0)), q(ra)]);
	return {
		factors: [minus, plus],
		steps: [
			{
				group: 'Differenza di quadrati',
				say: `Differenza di quadrati: scrivi $${latexOf(F)}$ nella forma $a^2 - b^2$.`,
				math: ['a^2 - b^2 = (a - b)(a + b)', `${latexOf(F)} = ${base(ra, m)}^2 - ${rc}^2`, `= \\hl{${factorLatex(minus)}${factorLatex(plus)}}`]
			}
		]
	};
}

function cubes(F: Poly): Found | null {
	const ts = terms(F);
	if (ts.length !== 2) return null;
	const [c, a] = ts;
	if (c.k !== 0 || a.k % 3 !== 0) return null;
	const ra = icbrt(a.c);
	const rb = icbrt(c.c);
	if (ra === null || rb === null) return null;
	const m = a.k / 3;
	const sum = c.c > 0;
	const zeros = (n: number) => Array.from({ length: n }, () => q(0));
	const first = trim([q(rb), ...zeros(m - 1), q(ra)]);
	// a^2 - ab + b^2, with b signed.
	const second = trim([q(rb * rb), ...zeros(m - 1), q(-ra * rb), ...zeros(m - 1), q(ra * ra)]);
	return {
		factors: [first, second],
		final: [false, m === 1],
		steps: [
			{
				group: sum ? 'Somma di cubi' : 'Differenza di cubi',
				say: `${sum ? 'Somma di cubi' : 'Differenza di cubi'}: usa la regola del prodotto notevole.`,
				math: [
					sum ? 'a^3 + b^3 = (a + b)(a^2 - ab + b^2)' : 'a^3 - b^3 = (a - b)(a^2 + ab + b^2)',
					`${latexOf(F)} = ${base(ra, m)}^3 ${sum ? '+' : '-'} ${Math.abs(rb)}^3`,
					`= \\hl{${factorLatex(first)}${factorLatex(second)}}`
				],
				then: m === 1 ? 'Il secondo fattore è un falso quadrato: non si scompone.' : undefined
			}
		]
	};
}

/** a·t^2 + b·t + c with t = x^m: the three coefficients, or null. */
function trinomial(F: Poly): { a: number; b: number; c: number; m: number } | null {
	const ts = terms(F);
	if (ts.length !== 3) return null;
	const [c, b, a] = ts;
	if (c.k !== 0 || a.k !== 2 * b.k) return null;
	return { a: a.c, b: b.c, c: c.c, m: b.k };
}

function perfectSquare(F: Poly): Found | null {
	const t = trinomial(F);
	if (!t) return null;
	const ra = isqrt(t.a);
	const rc = isqrt(t.c);
	if (ra === null || rc === null || Math.abs(t.b) !== 2 * ra * rc) return null;
	const B = t.b > 0 ? rc : -rc;
	const G = trim([q(B), ...Array.from({ length: t.m - 1 }, () => q(0)), q(ra)]);
	return {
		factors: [G, G],
		steps: [
			{
				group: 'Quadrato di binomio',
				say: `Quadrato di binomio: $${latexOf(F)}$ è lo sviluppo di un quadrato.`,
				table: {
					head: ['Termine', 'Come si scrive'],
					rows: [
						[`$${mono(t.a, 2 * t.m)}$`, `$${base(ra, t.m)}^2$, quadrato del primo`],
						[`$${mono(t.c, 0)}$`, `$${rc}^2$, quadrato del secondo`],
						[`$${mono(t.b, t.m)}$`, `$${t.b < 0 ? '-' : ''}2 \\cdot ${mono(ra, t.m)} \\cdot ${rc}$, doppio prodotto`]
					]
				},
				math: [t.b > 0 ? '(a + b)^2 = a^2 + 2ab + b^2' : '(a - b)^2 = a^2 - 2ab + b^2', `${latexOf(F)} = \\hl{${factorLatex(G)}^2}`]
			}
		]
	};
}

function sumProduct(F: Poly): Found | null {
	const t = trinomial(F);
	if (!t || t.a !== 1) return null;
	const pairs: [number, number][] = [];
	for (const d of divisors(t.c)) {
		const e = t.c / d;
		if (Math.abs(d) > Math.abs(e)) continue;
		pairs.push([d, e], [-d, -e]);
	}
	const found = pairs.find(([r, s]) => r + s === t.b);
	if (!found) return null;
	const [r, s] = [...found].sort((u, v) => u - v);
	const zeros = Array.from({ length: t.m - 1 }, () => q(0));
	const f1 = trim([q(r), ...zeros, q(1)]);
	const f2 = trim([q(s), ...zeros, q(1)]);
	const shown = pairs.length <= 8 ? pairs : [found];
	return {
		factors: [f1, f2],
		steps: [
			{
				group: 'Trinomio notevole',
				say: `Trinomio notevole: cerca due numeri con somma $${t.b}$ e prodotto $${t.c}$.`,
				table: {
					head: ['Numeri', 'Prodotto', 'Somma'],
					rows: shown.map(([u, v]) => {
						const hit = u === found[0] && v === found[1];
						const cell = (x: string) => (hit ? `$\\hl{${x}}$` : `$${x}$`);
						return [`$${u}$ e $${v}$`, `$${u * v}$`, cell(`${u + v}`)];
					})
				},
				math: [`${latexOf(F)} = \\hl{${factorLatex(f1)}${factorLatex(f2)}}`],
				then: t.m > 1 ? `Qui la variabile del trinomio è $${pow(t.m)}$: nelle parentesi i due numeri vanno con $${pow(t.m)}$.` : pairs.length > 8 ? `Tra tutte le coppie con prodotto $${t.c}$, questa è quella con somma $${t.b}$.` : undefined
			}
		]
	};
}

/** Degree 2 with no rational zero: the discriminant says why it does not split. */
function quadraticNoRoots(F: Poly): Step | null {
	if (polyDegree(F) !== 2) return null;
	const [c, b, a] = F.map((x) => x.num);
	const delta = b * b - 4 * a * c;
	if (delta >= 0 && isqrt(delta) !== null) return null;
	const bTex = b < 0 ? `(${b})` : `${b}`;
	const cTex = c < 0 ? `(${c})` : `${c}`;
	return {
		group: 'Un fattore che non si scompone',
		say: `Calcola il discriminante di $${latexOf(F)}$.`,
		math: [`\\Delta = b^2 - 4ac`, `= ${bTex}^2 - 4 \\cdot ${a} \\cdot ${cTex}`, `= \\hl{${delta}}`],
		then:
			b === 0 && c > 0
				? `È una somma di due quadrati: il discriminante è negativo e $${latexOf(F)}$ non si scompone.`
				: delta < 0
				? `Il discriminante è negativo: $${latexOf(F)}$ non si scompone.`
				: `Il discriminante non è un quadrato: $${latexOf(F)}$ si scompone solo con numeri irrazionali, e qui resta così.`
	};
}

/** Ruffini's rule on the first rational zero p/q, with p dividing the constant term and q the leading coefficient. */
function ruffini(F: Poly): Found | { none: Step } {
	const n = polyDegree(F);
	const c0 = F[0].num;
	const an = F[n].num;
	const candidates: [number, number][] = [];
	for (const qd of divisors(an)) for (const p of divisors(c0)) if (gcd(p, qd) === 1) candidates.push([p, qd], [-p, qd]);
	const tried: { r: Rational; zero: boolean }[] = [];
	let root: Rational | null = null;
	for (const [p, d] of candidates) {
		const zero = isZeroAt(F, p, d);
		tried.push({ r: q(p, d), zero });
		if (zero) {
			root = q(p, d);
			break;
		}
	}
	const value = (r: Rational) => {
		try {
			return polyAt(F, r).toLatex();
		} catch {
			return '\\neq 0';
		}
	};
	const where = an === 1 ? `Cerca uno zero di $${latexOf(F)}$ tra i divisori del termine noto.` : `Cerca uno zero tra i divisori di $${c0}$ divisi per quelli di $${an}$.`;
	const shown = tried.length <= 10 ? tried : tried.filter((t) => t.zero);
	const table = {
		head: ['Numero provato', 'Valore del polinomio'],
		rows: shown.map((t) => (t.zero ? [`$\\hl{${t.r.toLatex()}}$`, `$\\hl{0}$`] : [`$${t.r.toLatex()}$`, `$${value(t.r)}$`]))
	};
	const skipped = tried.length - shown.length;
	if (!root) {
		const then =
			n <= 3
				? `Nessun numero lo annulla: $${latexOf(F)}$ non ha zeri razionali, quindi non si scompone.`
				: `Nessun numero lo annulla: non ha fattori di primo grado. Potrebbe scomporsi in fattori di grado 2 o più, ma questo strumento non sa trovarli.`;
		return { none: { group: 'Regola di Ruffini', say: where, table: shown.length ? table : undefined, then: skipped ? `Hai provato ${tried.length} numeri. ${then}` : then } };
	}
	const s = ruffiniScheme(F, root);
	const linear = trim([root.neg(), q(1)]);
	const steps: Step[] = [
		{
			group: 'Regola di Ruffini',
			say: where,
			table,
			then: skipped ? `Prima di trovarlo hai provato altri ${skipped} numeri, e nessuno annullava il polinomio.` : undefined
		},
		{ say: `Dividi per $${binomialLatex(root)}$ con lo schema di Ruffini.`, table: ruffiniTable(s, root) }
	];
	let factors: Poly[] = [linear, s.Q];
	const math = [`${latexOf(F)} = \\hl{${factorLatex(linear)}}${factorLatex(s.Q)}`];
	let then: string | undefined;
	if (!root.isInteger()) {
		const d = q(root.den);
		const lin = trim([q(-root.num), d]);
		const Q = trim(s.Q.map((c) => c.div(d)));
		factors = [lin, Q];
		math.push(`= \\hl{${factorLatex(lin)}}${factorLatex(Q)}`);
		then = `Porta il $${root.den}$ del secondo fattore dentro il primo: così i coefficienti sono interi.`;
	}
	steps.push({ say: 'Scrivi il polinomio come prodotto: divisore per quoziente.', math, then });
	return { factors, steps };
}

// ---------------------------------------------------------------------------

interface Ctx {
	steps: Step[];
	/** The factors found, each with the note of whether it is fully split. */
	factors: { p: Poly; done: boolean }[];
}

function split(F: Poly, ctx: Ctx, final = false): void {
	const n = polyDegree(F);
	if (n <= 1 || final) {
		ctx.factors.push({ p: F, done: true });
		return;
	}
	const found = differenceOfSquares(F) ?? cubes(F) ?? perfectSquare(F) ?? sumProduct(F);
	if (found) {
		ctx.steps.push(...found.steps);
		found.factors.forEach((f, i) => split(f, ctx, found.final?.[i]));
		return;
	}
	const noRoots = quadraticNoRoots(F);
	if (noRoots) {
		ctx.steps.push(noRoots);
		ctx.factors.push({ p: F, done: true });
		return;
	}
	const r = ruffini(F);
	if ('none' in r) {
		ctx.steps.push(r.none);
		ctx.factors.push({ p: F, done: n <= 3 });
		return;
	}
	ctx.steps.push(...r.steps);
	r.factors.forEach((f) => split(f, ctx));
}

const polyKey = (p: Poly) => trim(p).map(String).join(',');

/** The factored form: content, power of x, factors with exponents. */
function productLatex(content: Rational, m: number, factors: { p: Poly; e: number }[]): string {
	const lead = content.isOne() ? '' : content.equals(q(-1)) ? '-' : content.toLatex();
	const alone = !lead && m === 0 && factors.length === 1 && factors[0].e === 1;
	const parts = factors.map(({ p, e }) => {
		const s = alone ? latexOf(p) : `(${latexOf(p)})`;
		return e > 1 ? `${s}^{${e}}` : s;
	});
	return `${lead}${pow(m)}${parts.join('')}` || '1';
}

function productText(content: Rational, m: number, factors: { p: Poly; e: number }[]): string {
	const lead = content.isOne() ? '' : content.equals(q(-1)) ? '-' : content.isInteger() ? `${content.num}` : `(${content.num}/${content.den})`;
	const x = m === 0 ? '' : m === 1 ? 'x' : `x^${m}`;
	const alone = !lead && m === 0 && factors.length === 1 && factors[0].e === 1;
	const parts = factors.map(({ p, e }) => {
		const s = alone ? polyText(p) : `(${polyText(p)})`;
		return e > 1 ? `${s}^${e}` : s;
	});
	return `${lead}${x}${parts.join('')}`;
}

export function scomposizionePolinomi(input: string): Outcome {
	const parsed = parsePolynomial(input, EXAMPLE);
	if (!parsed.ok) return fail(parsed.error);
	const P = parsed.p;
	const n = polyDegree(P);
	if (n < 1) return fail(`Scrivi un polinomio con la x, di grado almeno 1: per esempio ${EXAMPLE}.`);
	try {
		const steps: Step[] = [];
		const ord = orderStep(parsed, 'P(x)');
		if (ord) steps.push({ group: 'Il polinomio', ...ord });

		// Raccoglimento totale: the rational content with the sign of the leading coefficient, and the lowest power of x.
		const m = P.findIndex((c) => !c.isZero());
		const nz = P.filter((c) => !c.isZero());
		let content = q(nz.reduce((g, c) => gcd(g, c.num), 0), nz.reduce((l, c) => lcm(l, c.den), 1));
		if (P[n].sign() < 0) content = content.neg();
		const Q = trim(P.slice(m).map((c) => c.div(content)));
		if (Q.some((c) => Math.abs(c.num) > MAX_COEFFICIENT)) return fail('I coefficienti sono troppo grandi: prova con numeri più piccoli.');
		if (nz.length === 1) {
			steps.push({ say: 'È un monomio: non c’è niente da scomporre.', math: [`P(x) = ${latexOf(P)}`] });
			return { ok: true, rows: [{ label: 'Polinomio scomposto', value: `$${latexOf(P)}$` }], copy: polyText(P), steps };
		}
		if (!content.isOne() || m > 0) {
			const common = `${content.isOne() ? '' : content.equals(q(-1)) ? '-' : content.toLatex()}${pow(m)}`;
			const notes: string[] = [];
			if (!content.abs().isOne()) notes.push(content.isInteger() ? `$${content.abs().toLatex()}$ è il MCD dei coefficienti.` : `Con $${content.abs().toLatex()}$ fuori, dentro la parentesi i coefficienti sono interi.`);
			if (m > 0) notes.push(m === 1 ? 'Ogni termine contiene $x$.' : `Ogni termine contiene almeno $${pow(m)}$.`);
			if (content.sign() < 0) notes.push('Il segno meno si raccoglie perché il primo termine sia positivo.');
			steps.push({
				group: 'Raccoglimento totale',
				say: `Raccoglimento totale: metti in evidenza $${common === '-' ? '-1' : common}$.`,
				math: [`P(x) = ${latexOf(P)}`, polyDegree(Q) === 0 ? `= \\hl{${common === '-' ? '-1' : common}}` : `= \\hl{${common}}${factorLatex(Q)}`],
				then: notes.join(' ')
			});
		}

		const ctx: Ctx = { steps, factors: [] };
		if (polyDegree(Q) >= 1) split(Q, ctx);

		// Equal factors become a power, in the order they were found.
		const grouped: { p: Poly; e: number; done: boolean }[] = [];
		for (const f of ctx.factors) {
			const g = grouped.find((x) => polyKey(x.p) === polyKey(f.p));
			if (g) g.e++;
			else grouped.push({ ...f, e: 1 });
		}
		grouped.sort((u, v) => polyDegree(u.p) - polyDegree(v.p));
		const result = productLatex(content, m, grouped);

		// The check: the product gives back the polynomial.
		let back: Poly = [content];
		back = polyMul(back, term(q(1), m));
		for (const g of grouped) for (let i = 0; i < g.e; i++) back = polyMul(back, g.p);
		if (polyKey(back) !== polyKey(P)) return fail('Qualcosa non torna nella scomposizione: prova a scrivere il polinomio in un altro modo.');

		const pending = grouped.filter((g) => !g.done);
		const irreducibleStart = grouped.length === 1 && m === 0 && content.abs().isOne() && grouped[0].done && polyDegree(grouped[0].p) >= 2;
		steps.push({
			group: 'Il risultato',
			say: grouped.length + (m > 0 ? 1 : 0) > 1 || !content.abs().isOne() ? 'Scrivi il polinomio come prodotto di tutti i fattori trovati.' : 'Scrivi il risultato.',
			math: [`P(x) = \\hl{${result}}`],
			then: pending.length
				? `Il fattore $${latexOf(pending[0].p)}$ non è scomposto: con i metodi della scuola non si trova come dividerlo.`
				: n === 1
					? 'Un polinomio di primo grado non si scompone oltre.'
					: irreducibleStart
						? 'Il polinomio non si scompone in fattori con coefficienti razionali.'
						: undefined
		});
		return {
			ok: true,
			rows: !pending.length
				? [{ label: 'Polinomio scomposto', value: `$${result}$` }]
				: sameLatex(result, latexOf(pending[0].p))
					? [{ label: 'Polinomio che lo strumento non sa scomporre', value: `$${result}$` }]
					: [
							{ label: 'Scomposizione trovata, non completa', value: `$${result}$` },
							{ label: 'Fattore che lo strumento non sa scomporre', value: `$${latexOf(pending[0].p)}$` }
						],
			copy: productText(content, m, grouped),
			steps
		};
	} catch {
		return fail('I numeri sono troppo grandi per fare i calcoli esatti: prova con coefficienti più piccoli.');
	}
}

