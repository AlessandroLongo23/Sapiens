import { Rational, ZERO } from '@/lib/exercises/v2/rational';
import { paren, polyAdd, polyDegree, polyMul, polyScale, polySub, polyToLatex, type Poly } from '@/lib/exercises/v2/latex';
import { nodeLatex, parseEquation, polyAt, type Node } from './equazione';
import { fail, type Outcome, type Step } from './types';

/**
 * Polynomials in x as a student types them ("(2x - 3)^2", "x^3 - 7x + 6", "1/2 x^2 - 2"), read with the equation
 * parser of the equation tools (src/lib/tools/equazione.ts) and kept as exact rational coefficients. Shared by the
 * polynomial tools: special products, division (in column and with Ruffini's rule), factoring.
 */

const MAX_INPUT = 150;

export type ParsedPoly = { ok: true; p: Poly; node: Node; latex: string; calc: boolean } | { ok: false; error: string; latex?: string };

/** The equation parser's messages, reworded for a polynomial: no "equazione", no example with an "=". */
function reword(error: string, example: string): string {
	if (error.startsWith('La x compare in un denominatore')) return `La x non può stare in un denominatore: un polinomio non ha frazioni con la x sotto. Scrivi per esempio ${example}.`;
	if (error.startsWith('Usa la x come incognita')) return error.replace('Usa la x come incognita', 'Scrivi il polinomio con la lettera x');
	return error
		.replace("L'equazione è incompleta: manca qualcosa alla fine di un membro.", 'Il polinomio è incompleto: manca qualcosa alla fine.')
		.replace("in un'equazione", 'in un polinomio')
		.replace("Nell'equazione", 'Nel polinomio')
		.replace(/per esempio [^.]*= [^.]*\./, `per esempio ${example}.`);
}

/** A polynomial in x, typed as text. Constants are polynomials too (degree 0). */
export function parsePolynomial(input: string, example = 'x^2 - 5x + 6'): ParsedPoly {
	const text = input.trim();
	if (!text) return { ok: false, error: `Scrivi un polinomio in x, per esempio ${example}.` };
	if (text.length > MAX_INPUT) return { ok: false, error: `Il polinomio è troppo lungo: al massimo ${MAX_INPUT} caratteri.` };
	if (text.includes('=')) return { ok: false, error: `Scrivi solo il polinomio, senza il segno =. Per esempio ${example}.` };
	// "x = …" gives the parser an equation with an x in it; the right side is what the student typed.
	const r = parseEquation(`x = ${text}`);
	if (!r.ok) return { ok: false, error: reword(r.error, example), latex: r.latex?.replace(/^x = /, '') };
	const { brackets, fractionBrackets, products } = r.eq.has;
	return { ok: true, p: trim(r.eq.R), node: r.eq.rhs, latex: nodeLatex(r.eq.rhs), calc: brackets || fractionBrackets || products };
}

// ---------------------------------------------------------------------------
// Coefficients

export const trim = (p: Poly): Poly => {
	const d = polyDegree(p);
	return d < 0 ? [ZERO] : p.slice(0, d + 1);
};
export const coef = (p: Poly, k: number): Rational => p[k] ?? ZERO;
export const lead = (p: Poly): Rational => coef(p, Math.max(polyDegree(p), 0));
export const polyEq = (a: Poly, b: Poly): boolean => polyDegree(polySub(a, b)) < 0;
/** The monomial c·x^k as a polynomial. */
export const term = (c: Rational, k: number): Poly => trim([...Array.from({ length: k }, () => ZERO), c]);
export { polyAdd, polyMul, polyScale, polySub, polyDegree, polyAt };

/** LaTeX, highest degree first: "4x^2 - 12x + 9". */
export const latexOf = (p: Poly): string => polyToLatex(trim(p));

/** In brackets when it has more than one term, or a sign: for a product. */
export function factorLatex(p: Poly): string {
	const nz = trim(p).filter((c) => !c.isZero()).length;
	const s = latexOf(p);
	return nz > 1 || s.startsWith('-') ? `(${s})` : s;
}

/** The polynomial with every power down to the constant, missing ones as "0x^k", highlighted. */
export function completedLatex(p: Poly): string {
	const d = polyDegree(p);
	const parts: string[] = [];
	for (let k = d; k >= 0; k--) {
		const c = coef(p, k);
		const x = k === 0 ? '' : k === 1 ? 'x' : `x^{${k}}`;
		if (c.isZero()) {
			parts.push(`${k === d ? '' : ' '}\\hl{{}+ 0${x}}`);
			continue;
		}
		const abs = c.abs();
		const body = k > 0 && abs.isOne() ? x : `${abs.toLatex()}${x}`;
		parts.push(k === d ? `${c.sign() < 0 ? '-' : ''}${body}` : `${c.sign() < 0 ? ' - ' : ' + '}${body}`);
	}
	return parts.join('');
}

export const isComplete = (p: Poly): boolean => trim(p).every((c) => !c.isZero());

/** Plain text for copying: "4x^2 - 12x + 9", fractions as "(1/2)x". */
export function polyText(p: Poly): string {
	const q = trim(p);
	let out = '';
	for (let k = q.length - 1; k >= 0; k--) {
		const c = q[k];
		if (c.isZero()) continue;
		const abs = c.abs();
		const x = k === 0 ? '' : k === 1 ? 'x' : `x^${k}`;
		const num = abs.isInteger() ? `${abs.num}` : k > 0 ? `(${abs.num}/${abs.den})` : `${abs.num}/${abs.den}`;
		const body = k > 0 && abs.isOne() ? x : `${num}${x}`;
		out += out ? (c.sign() < 0 ? ` - ${body}` : ` + ${body}`) : `${c.sign() < 0 ? '-' : ''}${body}`;
	}
	return (out || '0').replace(/\./g, ',');
}

/** The degrees as table headings: "$x^3$", "$x^2$", "$x$", "Termine noto". */
export function degreeHeads(n: number): string[] {
	return Array.from({ length: n + 1 }, (_, i) => n - i).map((k) => (k === 0 ? 'Termine noto' : k === 1 ? '$x$' : `$x^{${k}}$`));
}

/** Two formulas that print the same, whatever their braces and fraction commands. */
export const sameLatex = (a: string, b: string): boolean => {
	const norm = (s: string) => s.replace(/\\dfrac/g, '\\frac').replace(/\\left|\\right|[\s{}]/g, '');
	return norm(a) === norm(b);
};

/** Two factors side by side: juxtaposed when the second has brackets, else with a dot. */
export const timesLatex = (a: string, b: string): string => (b.startsWith('(') ? `${a}${b}` : `${a} \\cdot ${b}`);

/**
 * The first step, when what was typed is not already the polynomial in order: do the products, add like terms, and
 * write the terms from the highest power down. Null when there is nothing to do.
 */
export function orderStep(parsed: { p: Poly; latex: string; calc: boolean }, name: string): Step | null {
	const ordered = latexOf(parsed.p);
	if (sameLatex(parsed.latex, ordered)) return null;
	return {
		say: parsed.calc ? 'Svolgi i calcoli e ordina i termini dal grado più alto.' : 'Ordina i termini dal grado più alto al più basso.',
		math: [`${name} = ${parsed.latex}`, `= \\hl{${ordered}}`]
	};
}

// ---------------------------------------------------------------------------
// Division

export interface DivisionRow {
	/** The partial remainder whose first term is divided. */
	from: Poly;
	/** The term of the quotient. */
	t: Poly;
	/** The term times the divisor, subtracted. */
	product: Poly;
	/** What is left. */
	rest: Poly;
}

/** Long division A : B, one row per term of the quotient. B must not be zero. */
export function longDivision(A: Poly, B: Poly): { Q: Poly; R: Poly; rows: DivisionRow[] } {
	const dB = polyDegree(B);
	let R = trim(A);
	let Q: Poly = [ZERO];
	const rows: DivisionRow[] = [];
	while (polyDegree(R) >= dB && polyDegree(R) >= 0) {
		const dR = polyDegree(R);
		const t = term(lead(R).div(lead(B)), dR - dB);
		const product = trim(polyMul(t, B));
		const rest = trim(polySub(R, product));
		rows.push({ from: R, t, product, rest });
		Q = trim(polyAdd(Q, t));
		R = rest;
	}
	return { Q, R, rows };
}

/** The leading term of a polynomial, in LaTeX. */
export const leadLatex = (p: Poly): string => latexOf(term(lead(p), Math.max(polyDegree(p), 0)));

// ---------------------------------------------------------------------------
// Ruffini

export interface RuffiniScheme {
	/** Coefficients from the highest degree, zeros included. */
	coeffs: Rational[];
	/** products[i] = sums[i - 1] · a, for i ≥ 1. */
	products: Rational[];
	sums: Rational[];
	Q: Poly;
	R: Rational;
}

export function ruffiniScheme(p: Poly, a: Rational): RuffiniScheme {
	const coeffs = [...trim(p)].reverse();
	const sums: Rational[] = [];
	const products: Rational[] = [ZERO];
	coeffs.forEach((c, i) => {
		if (i === 0) sums.push(c);
		else {
			const prod = sums[i - 1].mul(a);
			products.push(prod);
			sums.push(c.add(prod));
		}
	});
	const R = sums[sums.length - 1];
	const Q = trim(sums.slice(0, -1).reverse());
	return { coeffs, products, sums, Q: Q.length ? Q : [ZERO], R };
}

/** The scheme as a table: coefficients, products by a, sums, with the remainder highlighted. */
export function ruffiniTable(s: RuffiniScheme, a: Rational): { head: string[]; rows: string[][] } {
	const n = s.coeffs.length - 1;
	return {
		head: ['', ...degreeHeads(n)],
		rows: [
			['Coefficienti', ...s.coeffs.map((c) => `$${c.toLatex()}$`)],
			[`Prodotti per $${a.toLatex()}$`, '', ...s.products.slice(1).map((c) => `$${c.toLatex()}$`)],
			['Somme', ...s.sums.map((c, i) => (i === n ? `$\\hl{${c.toLatex()}}$` : `$${c.toLatex()}$`))]
		]
	};
}

/** "x - 2", "x + 3", "x - \frac{1}{2}": the divisor x - a. */
export function binomialLatex(a: Rational): string {
	if (a.isZero()) return 'x';
	return a.sign() > 0 ? `x - ${a.toLatex()}` : `x + ${a.abs().toLatex()}`;
}

/**
 * P(a) by substitution, one line per stage: the powers written out, then the products, then the sum. Used for the
 * remainder theorem.
 */
export function substitutionLines(p: Poly, a: Rational, name = 'P'): string[] {
	const q = trim(p);
	const terms: { c: Rational; k: number }[] = [];
	for (let k = q.length - 1; k >= 0; k--) if (!q[k].isZero()) terms.push({ c: q[k], k });
	const aTex = a.sign() < 0 || !a.isInteger() ? `\\left(${a.toLatex()}\\right)` : a.toLatex();
	const join = (parts: { neg: boolean; body: string }[]) => parts.map((t, i) => (i === 0 ? (t.neg ? '-' : '') : t.neg ? ' - ' : ' + ') + t.body).join('');
	const first = join(
		terms.map(({ c, k }) => {
			const abs = c.abs();
			const pow = k === 0 ? '' : k === 1 ? aTex : `${aTex}^{${k}}`;
			const body = k === 0 ? abs.toLatex() : abs.isOne() ? pow : `${abs.toLatex()} \\cdot ${pow}`;
			return { neg: c.sign() < 0, body };
		})
	);
	const values = terms.map(({ c, k }) => {
		let v = c;
		for (let i = 0; i < k; i++) v = v.mul(a);
		return v;
	});
	const second = join(values.map((v) => ({ neg: v.sign() < 0, body: v.abs().toLatex() })));
	const total = values.reduce((s, v) => s.add(v), ZERO);
	const arg = a.isInteger() ? `(${a.toLatex()})` : `\\left(${a.toLatex()}\\right)`;
	const lines = [`${name}${arg} = ${first}`];
	if (second !== first) lines.push(`= ${second}`);
	if (values.length > 1 || second !== total.toLatex()) lines.push(`= \\hl{${total.toLatex()}}`);
	return lines;
}

// ---------------------------------------------------------------------------
// The two division tools

const EX_A = 'x^3 - 2x + 5';
const EX_B = 'x - 2';

function readPair(a: string, b: string): { A: ParsedPoly & { ok: true }; B: ParsedPoly & { ok: true } } | string {
	const A = parsePolynomial(a, EX_A);
	if (!A.ok) return `Dividendo: ${A.error}`;
	const B = parsePolynomial(b, EX_B);
	if (!B.ok) return `Divisore: ${B.error}`;
	if (polyDegree(B.p) < 0) return 'Non si può dividere per zero: scrivi un divisore diverso da 0, per esempio x - 2.';
	if (polyDegree(B.p) === 0) return 'Il divisore deve contenere la x, per esempio x - 2. Per dividere per un numero basta dividere ogni coefficiente.';
	if (polyDegree(A.p) < 0) return 'Il dividendo è 0: anche il quoziente e il resto sono 0. Scrivi un altro dividendo, per esempio x^3 - 2x + 5.';
	return { A, B };
}

const tooBig = () => fail('I numeri sono troppo grandi per fare i calcoli esatti: prova con coefficienti più piccoli.');

function guard(run: () => Outcome): Outcome {
	try {
		return run();
	} catch {
		return tooBig();
	}
}

/** The check A = B · Q + R, expanded. */
function checkLines(A: Poly, B: Poly, Q: Poly, R: Poly): string[] {
	const BQ = trim(polyMul(B, Q));
	const single = trim(R).filter((c) => !c.isZero()).length === 1;
	const r = latexOf(R);
	const rest = polyDegree(R) < 0 ? '' : r.startsWith('-') ? (single ? ` - ${r.slice(1)}` : ` + (${r})`) : ` + ${r}`;
	const lines = [`${timesLatex(factorLatex(B), factorLatex(Q))}${rest}`];
	if (rest) lines.push(`= ${latexOf(BQ)}${rest}`);
	lines.push(`= \\hl{${latexOf(A)}}`);
	return lines;
}

/** Division of two polynomials in column: quotient, remainder and the check. */
export function divisionePolinomi(a: string, b: string): Outcome {
	const read = readPair(a, b);
	if (typeof read === 'string') return fail(read);
	return guard(() => {
		const { A, B } = read;
		const steps: Step[] = [];
		const ordA = orderStep(A, 'A(x)');
		const ordB = orderStep(B, 'B(x)');
		steps.push({
			say: ordA || ordB ? 'Svolgi i calcoli e ordina dividendo e divisore dal grado più alto.' : 'Scrivi dividendo e divisore in ordine, dal grado più alto.',
			math: [`A(x) = ${ordA ? `\\hl{${latexOf(A.p)}}` : latexOf(A.p)}`, `B(x) = ${ordB ? `\\hl{${latexOf(B.p)}}` : latexOf(B.p)}`],
			then: isComplete(A.p) || polyDegree(A.p) < polyDegree(B.p) ? undefined : 'Nel dividendo mancano delle potenze di $x$: sulla carta lascia il loro posto vuoto, o scrivi 0.'
		});
		const { Q, R, rows } = longDivision(A.p, B.p);
		if (!rows.length) {
			steps.push({
				say: 'Il dividendo ha grado minore del divisore: non puoi dividere.',
				then: 'Il quoziente è $0$ e il resto è il dividendo stesso.'
			});
		} else {
			steps.push({
				say: 'Dividi il primo termine del resto per il primo termine del divisore.',
				table: {
					head: ['Dividi', 'Quoziente', 'Per il divisore', 'Resto parziale'],
					rows: rows.map((r) => [`$${leadLatex(r.from)} : ${leadLatex(B.p)}$`, `$\\hl{${latexOf(r.t)}}$`, `$${latexOf(r.product)}$`, `$${latexOf(r.rest)}$`])
				},
				then: 'Ogni riga sottrae il prodotto dal resto precedente. Ti fermi quando il resto ha grado minore del divisore.'
			});
			const linear = polyDegree(B.p) === 1 && lead(B.p).isOne();
			steps.push({
				say: 'Somma i termini della colonna del quoziente.',
				math: [`Q(x) = \\hl{${latexOf(Q)}}`, `R(x) = ${latexOf(R)}`],
				then: linear ? `Il divisore è della forma $x - a$: puoi usare anche la regola di Ruffini.` : undefined
			});
		}
		steps.push({ say: 'Controlla: divisore per quoziente, più il resto, deve dare il dividendo.', math: checkLines(A.p, B.p, Q, R) });
		return {
			ok: true,
			rows: [
				{ label: 'Quoziente', value: `$${latexOf(Q)}$` },
				{ label: 'Resto', value: `$${latexOf(R)}$` }
			],
			copy: `Q(x) = ${polyText(Q)}; R(x) = ${polyText(R)}`,
			steps
		};
	});
}

/** Division by x - a with Ruffini's rule: the scheme as a table, quotient, remainder, and the remainder theorem. */
export function regolaRuffini(a: string, b: string): Outcome {
	const read = readPair(a, b);
	if (typeof read === 'string') return fail(read);
	const { A, B } = read;
	if (polyDegree(B.p) !== 1) return fail('Con la regola di Ruffini il divisore è un binomio di primo grado, come x - 2 o x + 3. Per altri divisori usa la divisione in colonna.');
	if (!lead(B.p).isOne())
		return fail('Qui il divisore deve essere della forma x - a, con 1 davanti alla x: per esempio x - 2. Se è 2x - 1, dividi prima tutto per 2 oppure usa la divisione in colonna.');
	if (polyDegree(A.p) < 1) return fail('Il dividendo deve contenere la x, per esempio x^3 - 2x + 5.');
	return guard(() => {
		const r = B.p[0].neg();
		const s = ruffiniScheme(A.p, r);
		const steps: Step[] = [];
		const ord = orderStep(A, 'P(x)');
		const n = polyDegree(A.p);
		steps.push({
			group: 'Lo schema',
			say: isComplete(A.p) ? 'Ordina $P(x)$ e scrivi i suoi coefficienti.' : 'Ordina $P(x)$ e completalo: le potenze che mancano hanno coefficiente 0.',
			math: [...(ord ? ord.math!.slice(0, 1) : []), isComplete(A.p) ? `P(x) = ${latexOf(A.p)}` : `P(x) = ${completedLatex(A.p)}`],
			table: { head: degreeHeads(n), rows: [s.coeffs.map((c) => `$${c.toLatex()}$`)] }
		});
		steps.push({
			say: 'Dal divisore ricava il numero $a$ da scrivere a sinistra.',
			math: [`${binomialLatex(r)} = x - ${r.sign() < 0 ? `(\\hl{${r.toLatex()}})` : `\\hl{${r.toLatex()}}`}`, `a = ${r.toLatex()}`]
		});
		const heads = degreeHeads(n);
		steps.push({
			say: 'Abbassa il primo coefficiente. Poi moltiplica per $a$ e somma, colonna per colonna.',
			table: {
				head: ['Colonna', 'Moltiplica', 'Somma'],
				rows: s.coeffs.map((c, i) =>
					i === 0
						? [heads[0], 'abbassa', `$${c.toLatex()}$`]
						: [heads[i], `$${s.sums[i - 1].toLatex()} \\cdot ${paren(r)} = ${s.products[i].toLatex()}$`, `$${c.toLatex()} + ${paren(s.products[i])} = \\hl{${s.sums[i].toLatex()}}$`]
				)
			}
		});
		steps.push({ say: "Ecco lo schema completo: l'ultima somma è il resto.", table: ruffiniTable(s, r) });
		steps.push({
			group: 'Il risultato',
			say: 'Le altre somme sono i coefficienti del quoziente, di un grado più basso.',
			math: [`Q(x) = \\hl{${latexOf(s.Q)}}`, `R = ${s.R.toLatex()}`]
		});
		steps.push({
			group: 'La verifica',
			say: 'Controlla con il teorema del resto: $P(a)$ deve essere uguale al resto.',
			math: substitutionLines(A.p, r),
			then: s.R.isZero() ? `Il resto è $0$: $P(x)$ è divisibile per $${binomialLatex(r)}$.` : undefined
		});
		return {
			ok: true,
			rows: [
				{ label: 'Quoziente', value: `$${latexOf(s.Q)}$` },
				{ label: 'Resto', value: `$${s.R.toLatex()}$` }
			],
			copy: `Q(x) = ${polyText(s.Q)}; R = ${polyText([s.R])}`,
			steps
		};
	});
}

