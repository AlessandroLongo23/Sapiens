import { Rational, ZERO, q, gcd } from '@/lib/exercises/v2/rational';
import { Surd } from '@/lib/exercises/v2/surd';
import { polyScale, polySub, polyToLatex, type Poly } from '@/lib/exercises/v2/latex';
import { fail, type Outcome, type ResultRow, type Step } from './types';
import { intTex } from './numbers';
import { denominatorsLcm, expandSide, expansionStep, monoBody, monoLatex, parseConstant, parseEquation, scaleMonos, type Mono } from './equazione';
import { equazioneSecondoGrado, quadraticRoots } from './equazioni-secondo-grado';

/**
 * Inequalities of the first and second degree in x, solved as in the lessons (disequazioni-lineari/
 * disequazioni-primo-grado, parabola-disequazioni/disequazioni-secondo-grado). The inequality is read by the equation
 * parser of `equazione.ts`, with its sign swapped for "=" and remembered; the associated second-degree equation is
 * solved by the equation tool. Intervals are written as in the lessons, with the square brackets turned outwards for
 * an excluded end: ]2, +∞[. Each tool also returns the solutions as a number line, for the sketch under the inputs.
 */

export type Rel = '>' | '>=' | '<' | '<=';

export const RELS: Rel[] = ['>', '>=', '<', '<='];

const REL_TEX: Record<Rel, string> = { '>': '>', '>=': '\\geq', '<': '<', '<=': '\\leq' };
const REL_TEXT: Record<Rel, string> = { '>': '>', '>=': '≥', '<': '<', '<=': '≤' };
const FLIP: Record<Rel, Rel> = { '>': '<', '>=': '<=', '<': '>', '<=': '>=' };

export const isRel = (s: string): s is Rel => (RELS as string[]).includes(s);

const GROUP_OVER = 5;
const DIGITS = 4;

/**
 * The solutions on a number line, not to scale: the ends in increasing order, each in the set or not, and whether
 * each open stretch (before the first end, between two, after the last) is in the set.
 */
export interface NumberLine {
	points: { label: string; inSet: boolean }[];
	stretches: boolean[];
	/** The set in words, for screen readers. */
	caption: string;
}

// ---------------------------------------------------------------------------
// Reading the inequality

type Split = { ok: true; text: string; rel: Rel } | { ok: false; error: string };

/** "3x - 1 >= 2" → the equation "3x - 1 = 2" and the sign ">=". */
function splitRelation(input: string, example: string): Split {
	const s = input.replace(/>=|=>|≥|⩾/g, '≥').replace(/<=|=<|≤|⩽/g, '≤');
	const signs = s.match(/[<>≥≤]/g) ?? [];
	if (s.includes('=') || s.includes('≠')) {
		if (!signs.length) return { ok: false, error: `Questa è un'equazione: scrivi una disequazione con uno dei segni >, <, >= o <=. Per esempio ${example}.` };
		return { ok: false, error: `Una disequazione ha un solo segno tra i due membri: >, <, >= o <=. Scrivi per esempio ${example}.` };
	}
	if (!signs.length) return { ok: false, error: `Manca il segno: scrivi una disequazione con >, <, >= o <=, per esempio ${example}.` };
	if (signs.length > 1) return { ok: false, error: `C'è più di un segno di disuguaglianza: qui si risolve una disequazione sola, per esempio ${example}.` };
	const ch = signs[0];
	const rel: Rel = ch === '≥' ? '>=' : ch === '≤' ? '<=' : (ch as Rel);
	return { ok: true, text: s.replace(/[<>≥≤]/, '='), rel };
}

/** The error of the equation parser, said of an inequality. */
function asInequality(message: string, example: string): string {
	return message
		.replace(/\b2x \+ 3 = 7\b|x\^2 - 5x \+ 6 = 0/g, example)
		.replace('3(x + 1) = 6', '3(x + 1) > 6')
		.replace('x/2 + 1 = 3', 'x/2 + 1 > 3')
		.replace("Nell'equazione", 'Nella disequazione')
		.replace(/L'equazione/g, 'La disequazione')
		.replace(/l'equazione/g, 'la disequazione')
		.replace(/un'equazione/g, 'una disequazione')
		.replace(/Un'equazione/g, 'Una disequazione')
		.replace('equazioni intere', 'disequazioni intere')
		.replace('il segno =', 'il segno');
}

const withRel = (latex: string, rel: Rel) => latex.replace(' = ', ` ${REL_TEX[rel]} `);

// ---------------------------------------------------------------------------
// Intervals

interface End {
	tex: string;
	text: string;
	incl: boolean;
}

/** "\left]-\infty, 2\right[", with the brackets of the lesson. */
function intervalTex(lo: End | null, hi: End | null): string {
	const open = lo ? (lo.incl ? '[' : ']') : ']';
	const close = hi ? (hi.incl ? ']' : '[') : '[';
	return `\\left${open} ${lo ? lo.tex : '-\\infty'}, ${hi ? hi.tex : '+\\infty'} \\right${close}`;
}

/** A rational for a caption: "−4", "7/3". */
const ratText = (r: Rational) => r.toString().replace('-', '−');

/** A root for a caption: "1 − √2", "(3 + √5)/2". */
function surdText(s: Surd): string {
	if (s.isRational()) return ratText(s.toRational());
	const k = Math.abs(s.b);
	const root = `${k === 1 ? '' : k}√${s.r}`;
	const numer = s.a === 0 ? `${s.b < 0 ? '−' : ''}${root}` : `${ratText(q(s.a))} ${s.b < 0 ? '−' : '+'} ${root}`;
	if (s.d === 1) return numer;
	return s.a === 0 ? `${numer}/${s.d}` : `(${numer})/${s.d}`;
}

function approxTex(s: Surd): string {
	const v = s.value();
	const r = Math.round(Math.abs(v) * 10 ** DIGITS) / 10 ** DIGITS;
	const [int, frac = ''] = r.toFixed(DIGITS).replace(/0+$/, '').split('.');
	return `${v < 0 && r !== 0 ? '-' : ''}${int}${frac ? `{,}${frac}` : ''}`;
}

type PartStep = Step & { part: string };

function grouped(steps: PartStep[], names: Record<string, string>): Step[] {
	const on = steps.length > GROUP_OVER;
	return steps.map(({ part, ...step }, i) => (on && (i === 0 || steps[i - 1].part !== part) ? { group: names[part], ...step } : step));
}

const TOO_BIG = 'I numeri sono troppo grandi per fare i calcoli esatti: prova con numeri più piccoli.';

// ---------------------------------------------------------------------------
// First degree

const EXAMPLE1 = '2x + 3 > 7';

const PARTS1 = { parentesi: 'Le parentesi', denominatori: 'I denominatori', incognita: "L'incognita da una parte", soluzioni: 'Le soluzioni' };

/** "5x", "-x", "0x". */
function coefX(a: Rational): string {
	if (a.isZero()) return '0x';
	if (a.isOne()) return 'x';
	if (a.equals(q(-1))) return '-x';
	return `${a.toLatex()}x`;
}

/** Each term of a side times m: "\hl{6} \cdot \frac{1}{2}x - \hl{6} \cdot 1". */
function timesTerms(m: number, items: Mono[]): string {
	if (!items.length) return `\\hl{${m}} \\cdot 0`;
	return items.map((t, i) => `${i === 0 ? (t.c.sign() < 0 ? '-' : '') : t.c.sign() < 0 ? ' - ' : ' + '}\\hl{${m}} \\cdot ${monoBody(t)}`).join('');
}

export interface Solved {
	outcome: Outcome;
	line: NumberLine | null;
}

export function risolviDisequazionePrimoGrado(input: string): Solved {
	const split = splitRelation(input, EXAMPLE1);
	if (!split.ok) return { outcome: fail(split.error), line: null };
	const parsed = parseEquation(split.text);
	if (!parsed.ok) return { outcome: fail(asInequality(parsed.error, EXAMPLE1)), line: null };
	const { eq } = parsed;
	if (eq.degree === 2) return { outcome: fail('È una disequazione di secondo grado: dopo aver portato tutto a primo membro resta un termine con x². Risolvila con il calcolatore delle disequazioni di secondo grado.'), line: null };
	if (eq.degree > 2) return { outcome: fail(`È una disequazione di grado ${eq.degree}: qui si risolvono solo le disequazioni di primo grado, per esempio ${EXAMPLE1}.`), line: null };
	try {
		return solveFirst(eq, split.rel);
	} catch {
		return { outcome: fail(TOO_BIG), line: null };
	}
}

export const disequazionePrimoGrado = (input: string): Outcome => risolviDisequazionePrimoGrado(input).outcome;

type Eq = Extract<ReturnType<typeof parseEquation>, { ok: true }>['eq'];

function solveFirst(eq: Eq, rel0: Rel): Solved {
	const steps: PartStep[] = [];
	let rel = rel0;
	const R = () => REL_TEX[rel];
	const expansion = expansionStep(eq);
	if (expansion) steps.push({ say: expansion.say, math: expansion.math.map((l) => withRel(l, rel)), part: 'parentesi' });

	let left = expandSide(eq.lhs);
	let right = expandSide(eq.rhs);
	const all = [...left, ...right].map((t) => t.c);
	const m = denominatorsLcm(all);
	if (m > 1) {
		const dens = [...new Set(all.filter((c) => c.den > 1).map((c) => c.den))].sort((a, b) => a - b);
		if (dens.length > 1) steps.push({ say: 'Calcola il mcm dei denominatori.', math: [`\\text{mcm}(${dens.join(',\\ ')}) = \\hl{${m}}`], part: 'denominatori' });
		const lines = [`${timesTerms(m, left)} ${R()} ${timesTerms(m, right)}`];
		left = scaleMonos(left, q(m));
		right = scaleMonos(right, q(m));
		lines.push(`${monoLatex(left)} ${R()} ${monoLatex(right)}`);
		steps.push({ say: `Moltiplica tutti i termini per $${m}$.`, math: lines, then: `Il $${m}$ è positivo: il verso non cambia.`, part: 'denominatori' });
	}

	const lx = left.filter((t) => t.deg > 0);
	const lc = left.filter((t) => t.deg === 0);
	const rx = right.filter((t) => t.deg > 0);
	const rc = right.filter((t) => t.deg === 0);
	const moveX: Mono[] = [...lx, ...rx.map((t) => ({ c: t.c.neg(), deg: t.deg, hl: true }))];
	const moveC: Mono[] = [...rc, ...lc.map((t) => ({ c: t.c.neg(), deg: 0, hl: true }))];
	if (lc.length || rx.length)
		steps.push({
			say: 'Porta i termini con la $x$ a sinistra e i numeri a destra.',
			math: [`${monoLatex(moveX)} ${R()} ${monoLatex(moveC)}`],
			then: "Un termine che passa dall'altra parte cambia segno. Il verso resta lo stesso.",
			part: 'incognita'
		});
	const A = moveX.reduce((s, t) => s.add(t.c), ZERO);
	const B = moveC.reduce((s, t) => s.add(t.c), ZERO);
	if (moveX.length !== 1 || moveC.length > 1) {
		const lhs = moveX.length !== 1 ? `\\hl{${coefX(A)}}` : coefX(A);
		const rhs = moveC.length > 1 ? `\\hl{${B.toLatex()}}` : B.toLatex();
		steps.push({ say: 'Somma i termini simili.', math: [`${lhs} ${R()} ${rhs}`], part: 'incognita' });
	}

	if (A.isZero()) {
		const holds = compare(ZERO, rel, B);
		steps.push({
			say: 'Guarda la disuguaglianza che resta.',
			math: [`0 ${R()} ${B.toLatex()}`],
			then: holds ? 'Non dipende da $x$ ed è vera: ogni numero è una soluzione.' : 'Non dipende da $x$ ed è falsa: nessun numero è una soluzione.',
			part: 'incognita'
		});
		const outcome: Outcome = {
			ok: true,
			rows: holds
				? [
						{ label: 'Soluzioni', value: 'Tutti i numeri reali' },
						{ label: 'Insieme delle soluzioni', value: '$S = \\mathbb{R}$' }
					]
				: [
						{ label: 'Soluzioni', value: 'Nessuna: la disequazione è impossibile' },
						{ label: 'Insieme delle soluzioni', value: '$S = \\emptyset$' }
					],
			copy: holds ? 'Ogni numero reale è una soluzione' : 'Nessuna soluzione',
			steps: grouped(steps, PARTS1)
		};
		return { outcome, line: { points: [], stretches: [holds], caption: holds ? 'Tutta la retta: ogni numero è una soluzione.' : 'Nessun punto: la disequazione non ha soluzioni.' } };
	}

	const x0 = B.div(A);
	if (!A.isOne()) {
		const old = rel;
		const negative = A.sign() < 0;
		if (negative) rel = FLIP[rel];
		const relHl = negative ? `\\mathrel{\\hl{${REL_TEX[rel]}}}` : REL_TEX[rel];
		steps.push({
			say: negative ? `Dividi entrambi i membri per $${A.toLatex()}$, che è negativo.` : `Dividi entrambi i membri per $${A.toLatex()}$.`,
			math: [`\\dfrac{${coefX(A)}}{\\hl{${A.toLatex()}}} ${relHl} \\dfrac{${B.toLatex()}}{\\hl{${A.toLatex()}}}`, `x ${relHl} \\hl{${x0.toLatex()}}`],
			then: negative ? `Hai diviso per un numero negativo: il verso cambia, da $${REL_TEX[old]}$ a $${REL_TEX[rel]}$.` : `Hai diviso per un numero positivo: il verso non cambia.`,
			part: 'incognita'
		});
	}
	const incl = rel === '>=' || rel === '<=';
	const up = rel === '>' || rel === '>=';
	const end: End = { tex: x0.toLatex(), text: ratText(x0), incl };
	const S = up ? intervalTex(end, null) : intervalTex(null, end);
	steps.push({
		say: 'Scrivi le soluzioni come intervallo.',
		math: [`x ${R()} ${x0.toLatex()}`, `S = ${S}`],
		then: incl ? `Il $${x0.toLatex()}$ è incluso: la sua parentesi è rivolta verso il numero.` : `Il $${x0.toLatex()}$ è escluso: la sua parentesi è rivolta verso l'esterno.`,
		part: 'soluzioni'
	});
	const outcome: Outcome = {
		ok: true,
		rows: [
			{ label: 'Soluzioni', value: `$x ${R()} ${x0.toLatex()}$` },
			{ label: 'Insieme delle soluzioni', value: `$S = ${S}$` }
		],
		copy: `x ${REL_TEXT[rel]} ${x0.toString()}`,
		steps: grouped(steps, PARTS1)
	};
	const words = { '>': 'maggiori di', '>=': 'maggiori o uguali a', '<': 'minori di', '<=': 'minori o uguali a' }[rel];
	return { outcome, line: { points: [{ label: ratText(x0), inSet: incl }], stretches: [!up, up], caption: `I numeri ${words} ${ratText(x0)}.` } };
}

/** a rel b for rationals. */
function compare(a: Rational, rel: Rel, b: Rational): boolean {
	const c = a.compare(b);
	return rel === '>' ? c > 0 : rel === '>=' ? c >= 0 : rel === '<' ? c < 0 : c <= 0;
}

// ---------------------------------------------------------------------------
// Second degree

export interface QuadIneqInput {
	mode: 'coef' | 'eq';
	a?: string;
	b?: string;
	c?: string;
	rel?: string;
	eq?: string;
}

const EXAMPLE2 = 'x^2 - 5x + 6 > 0';

const PARTS2 = { forma: 'La forma normale', associata: "L'equazione associata", segno: 'Il segno del trinomio' };

/** Why the input is not for this tool: its degree, or null when it does not parse. */
export function quadIneqDegree(input: QuadIneqInput): number | null {
	if (input.mode === 'coef') {
		const a = parseConstant(input.a ?? '');
		return a && a !== 'error' ? (a.isZero() ? 1 : 2) : null;
	}
	const split = splitRelation(input.eq ?? '', EXAMPLE2);
	if (!split.ok) return null;
	const parsed = parseEquation(split.text);
	return parsed.ok ? parsed.eq.degree : null;
}

export function risolviDisequazioneSecondoGrado(input: QuadIneqInput): Solved {
	try {
		return input.mode === 'coef' ? fromCoefficients(input) : fromText(input.eq ?? '');
	} catch {
		return { outcome: fail(TOO_BIG), line: null };
	}
}

export const disequazioneSecondoGrado = (input: QuadIneqInput): Outcome => risolviDisequazioneSecondoGrado(input).outcome;

const ineqLatex = (p: Poly, rel: Rel, hl = false) => `${polyToLatex(p)} ${hl ? `\\mathrel{\\hl{${REL_TEX[rel]}}}` : REL_TEX[rel]} 0`;

function fromCoefficients({ a = '', b = '', c = '', rel = '>' }: QuadIneqInput): Solved {
	const [A, B, C] = [a, b, c].map(parseConstant);
	if (A === null) return { outcome: fail('Scrivi il coefficiente a, il numero davanti a x². Per esempio 1.'), line: null };
	if (A === 'error' || B === 'error' || C === 'error') return { outcome: fail('Scrivi i coefficienti come numeri: interi, decimali con la virgola o frazioni. Per esempio 1,5 oppure 2/3.'), line: null };
	if (A.isZero()) return { outcome: fail('Con a = 0 manca il termine con x² e la disequazione è di primo grado. Scrivi un numero diverso da zero, oppure risolvila come disequazione di primo grado.'), line: null };
	if (!isRel(rel)) return { outcome: fail('Scegli il verso della disequazione: >, ≥, < oppure ≤.'), line: null };
	const p: Poly = [C ?? ZERO, B ?? ZERO, A];
	return solveSecond(p, rel, [{ say: 'Scrivi la disequazione in forma normale.', math: [ineqLatex(p, rel)], part: 'forma' }]);
}

function fromText(text: string): Solved {
	const split = splitRelation(text, EXAMPLE2);
	if (!split.ok) return { outcome: fail(split.error), line: null };
	const parsed = parseEquation(split.text);
	if (!parsed.ok) return { outcome: fail(asInequality(parsed.error, EXAMPLE2)), line: null };
	const { eq } = parsed;
	const rel = split.rel;
	if (eq.degree > 2) return { outcome: fail(`È una disequazione di grado ${eq.degree}: qui si risolvono solo le disequazioni di secondo grado, per esempio ${EXAMPLE2}.`), line: null };
	if (eq.degree < 2) return { outcome: fail("Dopo aver portato tutto a primo membro il termine con x² non c'è: la disequazione non è di secondo grado. Risolvila con il calcolatore delle disequazioni di primo grado."), line: null };
	const steps: PartStep[] = [];
	const expansion = expansionStep(eq);
	if (expansion) steps.push({ say: expansion.say, math: expansion.math.map((l) => withRel(l, rel)), part: 'forma' });
	const left = expandSide(eq.lhs);
	const right = expandSide(eq.rhs);
	const P = polySub(eq.L, eq.R);
	const moved: Mono[] = [...left, ...right.map((t) => ({ c: t.c.neg(), deg: t.deg, hl: true }))];
	if (right.length) steps.push({ say: 'Porta tutti i termini a sinistra.', math: [`${monoLatex(moved)} ${REL_TEX[rel]} 0`], then: "Un termine che passa dall'altra parte cambia segno. Il verso resta lo stesso.", part: 'forma' });
	const reduced = polyToLatex(P);
	if (monoLatex(moved.map(({ c, deg }) => ({ c, deg }))) !== reduced) {
		const count = (d: number) => moved.filter((t) => t.deg === d).length;
		const monos: Mono[] = [2, 1, 0].filter((d) => !(P[d] ?? ZERO).isZero()).map((d) => ({ c: P[d], deg: d, hl: count(d) > 1 }));
		steps.push({ say: 'Somma i termini simili e ordinali dal grado più alto.', math: [`${monoLatex(monos)} ${REL_TEX[rel]} 0`], part: 'forma' });
	}
	return solveSecond(P, rel, steps);
}

function solveSecond(p0: Poly, rel0: Rel, steps: PartStep[]): Solved {
	let cur = p0.slice(0, 3);
	while (cur.length < 3) cur.push(ZERO);
	let rel = rel0;
	const m = denominatorsLcm(cur);
	if (m > 1) {
		const before = polyToLatex(cur);
		cur = polyScale(cur, q(m));
		steps.push({
			say: `Moltiplica entrambi i membri per $${intTex(m)}$, il mcm dei denominatori.`,
			math: [`\\hl{${intTex(m)}} \\cdot \\left(${before}\\right) ${REL_TEX[rel]} \\hl{${intTex(m)}} \\cdot 0`, ineqLatex(cur, rel)],
			then: `Il $${intTex(m)}$ è positivo: il verso non cambia.`,
			part: 'forma'
		});
	}
	if (cur[2].sign() < 0) {
		const old = rel;
		cur = polyScale(cur, q(-1));
		rel = FLIP[rel];
		steps.push({
			say: 'Moltiplica entrambi i membri per $-1$.',
			math: [ineqLatex(cur, rel, true)],
			then: `Così il coefficiente di $x^2$ è positivo. Il $-1$ è negativo: il verso cambia, da $${REL_TEX[old]}$ a $${REL_TEX[rel]}$.`,
			part: 'forma'
		});
	}
	const g = gcd(gcd(Math.abs(cur[0].num), Math.abs(cur[1].num)), Math.abs(cur[2].num));
	if (g > 1) {
		cur = polyScale(cur, q(1, g));
		steps.push({ say: `Dividi entrambi i membri per $${intTex(g)}$.`, math: [ineqLatex(cur, rel)], then: `Il $${intTex(g)}$ è positivo: il verso non cambia.`, part: 'forma' });
	}

	// The associated equation, solved by the equation tool; its first step (the normal form) is already here.
	const [C, B, A] = cur.map((x) => x.num);
	const eqOut = equazioneSecondoGrado({ mode: 'coef', a: String(A), b: String(B), c: String(C) });
	if (!eqOut.ok) return { outcome: fail(TOO_BIG), line: null };
	steps.push({ say: "Scrivi l'equazione associata.", math: [`${polyToLatex(cur)} = 0`], then: 'Le sue soluzioni sono i punti in cui il trinomio vale zero.', part: 'associata' });
	for (const s of eqOut.steps.slice(1)) {
		const { group: _group, ...rest } = s;
		void _group;
		steps.push({ ...rest, part: 'associata' });
	}
	const roots = quadraticRoots(cur);

	// The sign of the trinomial, a > 0: positive outside the roots, negative between.
	const tex = roots.map((r) => r.toLatex());
	const head = ['$x$'];
	const signs = ['Segno'];
	if (roots.length === 2) {
		head.push(`$x < ${tex[0]}$`, `$${tex[0]}$`, `$${tex[0]} < x < ${tex[1]}$`, `$${tex[1]}$`, `$x > ${tex[1]}$`);
		signs.push('$+$', '$0$', '$-$', '$0$', '$+$');
	} else if (roots.length === 1) {
		head.push(`$x < ${tex[0]}$`, `$${tex[0]}$`, `$x > ${tex[0]}$`);
		signs.push('$+$', '$0$', '$+$');
	} else {
		head.push('ogni $x$');
		signs.push('$+$');
	}
	steps.push({
		say: 'Studia il segno del trinomio.',
		table: { head, rows: [signs] },
		then:
			roots.length === 2
				? "La parabola è rivolta verso l'alto e taglia l'asse $x$ in due punti: sotto l'asse sta solo tra le due radici."
				: roots.length === 1
					? "La parabola è rivolta verso l'alto e tocca l'asse $x$ in un punto solo: altrove sta sopra."
					: "La parabola è rivolta verso l'alto e non tocca l'asse $x$: sta tutta sopra.",
		part: 'segno'
	});

	const pick = { '>': 'Scegli dove il trinomio è positivo.', '>=': 'Scegli dove il trinomio è positivo o zero.', '<': 'Scegli dove il trinomio è negativo.', '<=': 'Scegli dove il trinomio è negativo o zero.' }[rel];
	const answer = answerFor(roots, rel);
	steps.push({ say: pick, math: [answer.math, `S = ${answer.set}`].filter((l, i, lines) => lines.indexOf(l) === i), then: answer.why, part: 'segno' });

	const rows: ResultRow[] = [
		{ label: 'Soluzioni', value: answer.words },
		{ label: 'Insieme delle soluzioni', value: `$S = ${answer.set}$` }
	];
	if (roots.some((r) => !r.isRational())) rows.push({ label: 'Valori approssimati delle radici', value: roots.map((r, i) => `$x_${i + 1} \\approx ${approxTex(r)}$`).join(' ') });
	return { outcome: { ok: true, rows, copy: answer.copy.replace(/−/g, '-'), steps: grouped(steps, PARTS2) }, line: answer.line };
}

interface Answer {
	/** The solutions as inequalities, for a line of the steps. */
	math: string;
	/** The set, with intervals. */
	set: string;
	/** The solutions for the result row, prose with formulas. */
	words: string;
	copy: string;
	why: string;
	line: NumberLine;
}

function answerFor(roots: Surd[], rel: Rel): Answer {
	const incl = rel === '>=' || rel === '<=';
	const positive = rel === '>' || rel === '>=';
	const R = REL_TEX[rel];
	const all: Omit<Answer, 'why'> = { math: 'S = \\mathbb{R}', set: '\\mathbb{R}', words: 'Tutti i numeri reali', copy: 'Ogni numero reale', line: { points: [], stretches: [true], caption: 'Tutta la retta: ogni numero è una soluzione.' } };
	const none: Omit<Answer, 'why'> = { math: 'S = \\emptyset', set: '\\emptyset', words: 'Nessuna: la disequazione è impossibile', copy: 'Nessuna soluzione', line: { points: [], stretches: [false], caption: 'Nessun punto: la disequazione non ha soluzioni.' } };
	if (roots.length === 0) {
		return positive ? { ...all, math: `x \\in \\mathbb{R}`, why: 'Il trinomio è sempre positivo: vanno bene tutti i numeri.' } : { ...none, math: 'S = \\emptyset', why: 'Il trinomio non è mai negativo: nessun numero va bene.' };
	}
	const t = roots.map((r) => r.toLatex());
	const txt = roots.map(surdText);
	if (roots.length === 1) {
		const [r] = t;
		if (rel === '>') {
			const set = `\\mathbb{R} \\setminus \\{${r}\\}`;
			return { math: `x \\neq ${r}`, set, words: `$x \\neq ${r}$`, copy: `x ≠ ${txt[0]}`, why: `Il trinomio è positivo ovunque, tranne in $${r}$, dove vale zero.`, line: { points: [{ label: txt[0], inSet: false }], stretches: [true, true], caption: `Tutti i numeri tranne ${txt[0]}.` } };
		}
		if (rel === '>=') return { ...all, math: 'x \\in \\mathbb{R}', why: 'Il trinomio non è mai negativo: vanno bene tutti i numeri.' };
		if (rel === '<') return { ...none, why: 'Il trinomio non è mai negativo: nessun numero va bene.' };
		return { math: `x = ${r}`, set: `\\{${r}\\}`, words: `$x = ${r}$`, copy: `x = ${txt[0]}`, why: `Il trinomio non è mai negativo, e vale zero solo in $${r}$.`, line: { points: [{ label: txt[0], inSet: true }], stretches: [false, false], caption: `Solo il numero ${txt[0]}.` } };
	}
	const [lo, hi] = roots.map((r, i) => ({ tex: t[i], text: txt[i], incl }));
	const ends = incl ? 'estremi inclusi' : 'estremi esclusi';
	const points = [
		{ label: txt[0], inSet: incl },
		{ label: txt[1], inSet: incl }
	];
	if (positive) {
		const RL = incl ? '\\leq' : '<';
		const RG = incl ? '\\geq' : '>';
		return {
			math: `x ${RL} ${t[0]} \\quad \\text{oppure} \\quad x ${RG} ${t[1]}`,
			set: `${intervalTex(null, lo)} \\cup ${intervalTex(hi, null)}`,
			words: `$x ${RL} ${t[0]}$ oppure $x ${RG} ${t[1]}$`,
			copy: `x ${incl ? '≤' : '<'} ${txt[0]} oppure x ${incl ? '≥' : '>'} ${txt[1]}`,
			why: `Sono i valori esterni alle radici, ${ends}.`,
			line: { points, stretches: [true, false, true], caption: `I numeri minori di ${txt[0]} e quelli maggiori di ${txt[1]}, ${ends}.` }
		};
	}
	return {
		math: `${t[0]} ${R} x ${R} ${t[1]}`,
		set: intervalTex(lo, hi),
		words: `$${t[0]} ${R} x ${R} ${t[1]}$`,
		copy: `${txt[0]} ${REL_TEXT[rel]} x ${REL_TEXT[rel]} ${txt[1]}`,
		why: `Sono i valori interni, tra le due radici, ${ends}.`,
		line: { points, stretches: [false, true, false], caption: `I numeri tra ${txt[0]} e ${txt[1]}, ${ends}.` }
	};
}

/** The LaTeX of a typed inequality, for the preview, or null. */
export function previewInequality(input: string): string | null {
	const split = splitRelation(input, EXAMPLE1);
	if (!split.ok) return null;
	const parsed = parseEquation(split.text);
	const latex = parsed.ok ? parsed.eq.latex : parsed.latex;
	return latex ? withRel(latex, split.rel) : null;
}
