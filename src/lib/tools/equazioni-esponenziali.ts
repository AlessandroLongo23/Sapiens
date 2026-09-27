import { Rational, ONE, ZERO } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type Step } from './types';
import {
	E,
	InputError,
	XError,
	approx,
	argTex,
	baseWriter,
	commonBase,
	isOne,
	isolateX,
	linAt,
	linSub,
	linearLines,
	lnLine,
	lnOf,
	logTex,
	matchBracket,
	parseLinear,
	parseNumberNode,
	pdiv,
	pequal,
	pmul,
	pnumTex,
	ppow,
	ratio,
	rationalValue,
	splitEquation,
	timesLin,
	writtenTex,
	type Lin,
	type PNum,
	type Parsed
} from './logaritmi';

/**
 * Elementary exponential equations: k · a^(f(x)) = b with f of the first degree, and a^(f(x)) = c^(g(x)). When the
 * numbers are powers of the same base (2^(x+1) = 8, 9^x = 27, 4^x = 8^(x-1)) the exponents are equated and the
 * solution is exact; otherwise the logarithm gives it (3^x = 5 → x = log_3 5), with its decimal value.
 */

const EXAMPLE = '2^(x + 1) = 8';
const DIGITS = 4;

type Side = { kind: 'exp'; coef: Parsed | null; base: Parsed; f: Lin; tex: string } | { kind: 'const'; c: Parsed; tex: string };

const ONE_PNUM: PNum = { sign: 1, v: new Map() };

/** The base of a power as written: in brackets when it is a decimal, a fraction or a root. */
function baseTex(b: Parsed): string {
	const t = writtenTex(b.node);
	return /^[\d\\,]+$/.test(t) && !t.includes('{,}') ? t : t === 'e' || b.node.k === 'group' ? t : `\\left(${t}\\right)`;
}

const powTex = (b: Parsed, exp: string) => `${baseTex(b)}^{${exp.replace(/\\dfrac/g, '\\frac')}}`;

function sideTex(s: Side): string {
	if (s.kind === 'const') return writtenTex(s.c.node);
	return `${s.coef ? `${writtenTex(s.coef.node)} \\cdot ` : ''}${powTex(s.base, s.f.tex)}`;
}

/** Where the power with x in its exponent is: the caret, and the exponent's text and end. */
function findPower(s: string): { caret: number; exp: string; end: number } | null {
	let depth = 0;
	for (let i = 0; i < s.length; i++) {
		const ch = s[i];
		if ('([{'.includes(ch)) depth++;
		else if (')]}'.includes(ch)) depth--;
		else if (ch === '^' && depth === 0) {
			let j = i + 1;
			while (s[j] === ' ') j++;
			let exp: string;
			let end: number;
			if ('([{'.includes(s[j] ?? '')) {
				const close = matchBracket(s, j);
				if (close < 0) throw new InputError("Controlla le parentesi dell'esponente: chiudi ogni parentesi che apri, per esempio 2^(x + 1).");
				exp = s.slice(j + 1, close);
				end = close + 1;
			} else {
				const m = /^-?\s*(?:\d+(?:[.,]\d+)?\s*)?[xX]?/.exec(s.slice(j))!;
				exp = m[0];
				end = j + m[0].length;
			}
			if (/x/i.test(exp)) return { caret: i, exp, end };
		}
	}
	return null;
}

function parseSide(text: string): Side {
	if (!/x/i.test(text)) {
		const c = parseNumberNode(text);
		if (!c) throw new InputError(`Scrivi qualcosa prima e dopo il segno =, per esempio ${EXAMPLE}.`);
		return { kind: 'const', c, tex: writtenTex(c.node) };
	}
	const found = findPower(text);
	if (!found) throw new InputError(`Qui la x deve stare all'esponente di una potenza: scrivi per esempio ${EXAMPLE}.`);
	const rest = text.slice(found.end).trim();
	if (rest)
		throw new InputError(
			/^[+-]/.test(rest)
				? "Scrivi ogni membro come una sola potenza. Se l'esponente ha più termini, mettilo tra parentesi: 2^(x + 1)."
				: 'Dopo la potenza non scrivere altro: la forma è k · a^(esponente) = numero.'
		);
	const before = text.slice(0, found.caret).trimEnd();
	let baseStart: number;
	if (/[)\]}]$/.test(before)) {
		let depth = 0;
		baseStart = -1;
		for (let i = before.length - 1; i >= 0; i--) {
			if (')]}'.includes(before[i])) depth++;
			else if ('([{'.includes(before[i])) {
				depth--;
				if (depth === 0) {
					baseStart = i;
					break;
				}
			}
		}
		if (baseStart < 0) throw new InputError('Controlla le parentesi della base: chiudi ogni parentesi che apri, per esempio (1/2)^x.');
	} else {
		const m = /(\d+(?:[.,]\d+)*|e)$/.exec(before);
		if (!m) throw new InputError(`Manca la base della potenza: scrivi per esempio ${EXAMPLE}.`);
		baseStart = before.length - m[0].length;
	}
	let coefText = before.slice(0, baseStart).trim();
	if (/(√|∛|∜|sqrt|rad|cbrt)$/i.test(coefText)) throw new InputError('Metti la base tra parentesi quando è una radice: (√2)^x.');
	if (/[/:]$/.test(coefText)) throw new InputError('Scrivi la potenza a numeratore: la forma è k · a^(esponente) = numero.');
	coefText = coefText.replace(/\*$/, '').trim();
	if (coefText === '-' || coefText === '+') throw new InputError('Il numero davanti alla potenza deve essere positivo: per esempio 3 · 2^x = 24.');
	const base = parseNumberNode(before.slice(baseStart))!;
	const coef = coefText ? parseNumberNode(coefText) : null;
	const f = parseLinear(found.exp, "l'esponente");
	const side: Side = { kind: 'exp', coef, base, f, tex: '' };
	side.tex = sideTex(side);
	return side;
}

function parse(input: string): { l: Side; r: Side; tex: string } | string {
	const split = splitEquation(input, EXAMPLE);
	if (typeof split === 'string') return split;
	try {
		const [l, r] = split.map(parseSide);
		return { l, r, tex: `${l.tex} = ${r.tex}` };
	} catch (e) {
		if (e instanceof XError) return `La x deve stare solo all'esponente: scrivi per esempio ${EXAMPLE}.`;
		if (e instanceof InputError) return e.message;
		return 'I numeri sono troppo grandi per fare i calcoli esatti: prova con numeri più piccoli.';
	}
}

/** The equation as typed, in LaTeX, for the preview under the field; null when it cannot be read. */
export function previewEsponenziale(input: string): string | null {
	const p = parse(input);
	return typeof p === 'string' ? null : p.tex;
}

export function equazioneEsponenziale(input: string): Outcome {
	const p = parse(input);
	if (typeof p === 'string') return fail(p);
	const { l, r } = p;
	if (l.kind === 'const' && r.kind === 'const') return fail(`Nell'equazione non c'è la x: scrivi per esempio ${EXAMPLE}.`);
	for (const s of [l, r])
		if (s.kind === 'exp') {
			if (s.base.val.sign <= 0) return fail("La base di una potenza con la x all'esponente deve essere positiva: per esempio 2^x oppure (1/2)^x.");
			if (s.coef && s.coef.val.sign <= 0) return fail('Il numero davanti alla potenza deve essere positivo: per esempio 3 · 2^x = 24.');
		}
	try {
		if (l.kind === 'exp' && r.kind === 'exp') return twoPowers(l, r, p.tex);
		const [e, c] = l.kind === 'exp' ? [l, r] : [r, l];
		return onePower(e as Extract<Side, { kind: 'exp' }>, (c as Extract<Side, { kind: 'const' }>).c, []);
	} catch (e) {
		return fail(e instanceof InputError ? e.message : 'I numeri sono troppo grandi per fare i calcoli esatti: prova con numeri più piccoli.');
	}
}

type ExpSide = Extract<Side, { kind: 'exp' }>;

const impossible = (steps: Step[]): Outcome => ({
	ok: true,
	rows: [
		{ label: 'Soluzioni', value: "Nessuna: l'equazione è impossibile" },
		{ label: 'Insieme delle soluzioni', value: '$S = \\emptyset$' }
	],
	copy: 'Impossibile: nessuna soluzione',
	steps
});

const indeterminate = (steps: Step[]): Outcome => ({
	ok: true,
	rows: [
		{ label: 'Soluzioni', value: "Tutti i numeri reali: l'equazione è indeterminata" },
		{ label: 'Insieme delle soluzioni', value: '$S = \\mathbb{R}$' }
	],
	copy: 'Indeterminata: ogni numero reale è soluzione',
	steps
});

/** c written without display fractions, for a sentence. */
const inline = (t: string) => t.replace(/\\dfrac/g, '\\frac');

/** k · a^(f(x)) = b. */
function onePower(e: ExpSide, b: Parsed, pre: Step[]): Outcome {
	const steps = [...pre];
	const power = powTex(e.base, e.f.tex);
	let target = b.val;
	let targetTex = writtenTex(b.node);
	let targetNode: Parsed | null = b;
	if (e.coef) {
		const k = writtenTex(e.coef.node);
		target = pdiv(target, e.coef.val);
		const t = pnumTex(target);
		steps.push({ say: `Dividi entrambi i membri per $${inline(k)}$.`, math: [`${power} = \\dfrac{${targetTex}}{${k}}`, `${power} = \\hl{${t}}`] });
		targetTex = t;
		targetNode = null;
	}
	if (target.sign <= 0) {
		steps.push({ say: 'Guarda il segno dei due membri.', math: [`${power} > 0`], then: `Una potenza con base positiva è sempre positiva: non può valere $${inline(targetTex)}$. L'equazione è impossibile.` });
		return impossible(steps);
	}
	if (isOne(e.base.val)) {
		const one = isOne(target);
		steps.push({
			say: 'Guarda la base: è $1$, e ogni potenza di $1$ vale $1$.',
			math: [`1^{${e.f.tex}} = 1`],
			then: one ? "Il secondo membro vale $1$: l'equazione è vera per ogni $x$." : `Non può valere $${inline(targetTex)}$: l'equazione è impossibile.`
		});
		return one ? indeterminate(steps) : impossible(steps);
	}
	const { w, r } = commonBase(e.base.val);
	const s = ratio(target, w);
	const { tex: c, pow } = baseWriter(w);
	if (s) {
		const cPow = (t: Rational) => (t.isZero() ? `${c}^{0}` : pow(t));
		const aC = r.isOne() ? c : `\\left(${pow(r)}\\right)`;
		const exps = timesLin(r, e.f);
		const lines = [`${power} = ${targetTex}`, `${aC}^{${e.f.tex}} = ${cPow(s)}`, ...(r.isOne() ? [] : [`${c}^{\\hl{${exps}}} = ${cPow(s)}`])];
		const unique = lines.filter((line, i) => i === 0 || line !== lines[i - 1]);
		if (unique.length > 1) steps.push({ say: `Scrivi i due membri come potenze di $${inline(c)}$.`, math: unique });
		const equate = `${exps} = ${s.toLatex()}`;
		steps.push({ say: 'Uguaglia gli esponenti: le basi sono uguali.', math: [equate] });
		const solved = linearLines(r.mul(e.f.p), r.mul(e.f.q), ZERO, s);
		const solveLines = solved.lines.filter((line) => line !== equate);
		const x = solved.x!;
		if (solveLines.length) steps.push({ say: "Risolvi l'equazione di primo grado.", math: solveLines });
		steps.push(checkStep([{ side: e, x }], targetNode ? targetTex : pnumTex(pmul(target, e.coef?.val ?? ONE_PNUM))));
		return { ok: true, rows: [{ label: 'Soluzione', value: rationalValue('x = ', x, DIGITS) }], copy: `x = ${x.toString()}`, steps };
	}
	// Not a power of the same base: the logarithm in base a.
	const log = `${logTex(e.base.val, e.base.node)} ${targetNode ? argTex(targetNode.node) : pnumTex(target).includes('\\') ? `\\left(${targetTex}\\right)` : targetTex}`;
	const baseName = inline(writtenTex(e.base.node));
	steps.push({
		say: pequal(e.base.val, E) ? 'Prendi il logaritmo naturale dei due membri.' : `Prendi il logaritmo in base $${baseName}$ dei due membri.`,
		math: [`${e.f.tex} = ${log}`],
		then: 'Le basi non si possono rendere uguali: per questo serve il logaritmo.'
	});
	const iso = isolateX(e.f.p, e.f.q, log);
	if (iso.lines.length) steps.push({ say: 'Ricava la $x$.', math: iso.lines });
	const L = lnOf(target) / lnOf(e.base.val);
	const x = (L - e.f.q.num / e.f.q.den) / (e.f.p.num / e.f.p.den);
	const lines = pequal(e.base.val, E)
		? [`${log} \\approx ${approx(L, 6).tex}`]
		: [`${log} = \\dfrac{\\ln ${targetNode ? argTex(targetNode.node) : targetTex}}{\\ln ${argTex(e.base.node)}}`, `\\approx ${approx(L, 6).tex}`];
	lines.push(`x \\approx \\hl{${approx(x, DIGITS).tex}}`);
	steps.push({ say: pequal(e.base.val, E) ? 'Calcola il valore con la calcolatrice, tasto ln.' : 'Calcola il logaritmo con la formula del cambiamento di base.', math: lines });
	return { ok: true, rows: [{ label: 'Soluzione', value: `$x = ${iso.exact}$ $\\approx ${approx(x, DIGITS).tex}$` }], copy: `x ≈ ${approx(x, DIGITS).text}`, steps };
}

/** The check by substitution: each power with the solution in its exponent, and its value. */
function checkStep(sides: { side: ExpSide; x: Rational }[], other: string | null): Step {
	const lines = sides.map(({ side, x }) => {
		const e0 = linAt(side.f, x);
		const sub = linSub(side.f, x);
		const k = side.coef ? `${writtenTex(side.coef.node)} \\cdot ` : '';
		const value = pnumTex(pmul(side.coef?.val ?? ONE_PNUM, ppow(side.base.val, e0)));
		const first = `${k}${powTex(side.base, sub)}`;
		const second = `${k}${powTex(side.base, e0.toLatex())}`;
		return [first, second, value].filter((t, i, all) => i === 0 || t !== all[i - 1]).join(' = ');
	});
	const value = pnumTex(pmul(sides[0].side.coef?.val ?? ONE_PNUM, ppow(sides[0].side.base.val, linAt(sides[0].side.f, sides[0].x))));
	return {
		say: "Controlla: sostituisci la soluzione nell'equazione di partenza.",
		math: lines,
		then: other !== null ? `Vale $${inline(value)}$, come il secondo membro: la soluzione è giusta.` : `I due membri valgono entrambi $${inline(value)}$: la soluzione è giusta.`
	};
}

/** A sum of terms k · t, where t is a logarithm ("\ln 2") or null for a number: "x\ln 2 - \ln 3". */
function lnCombo(terms: { k: Rational; t: string | null }[]): string {
	let num = ZERO;
	const sym = terms.filter((t) => {
		if (t.t === null) num = num.add(t.k);
		return t.t !== null && !t.k.isZero();
	});
	// Positive terms first: ln 3 - ln 2, not -ln 2 + ln 3.
	const all = [...sym.map((t) => ({ k: t.k, body: t.t! })), ...(num.isZero() ? [] : [{ k: num, body: '' }])].sort((a, b) => (b.k.sign() > 0 ? 1 : 0) - (a.k.sign() > 0 ? 1 : 0));
	if (!all.length) return '0';
	return all
		.map(({ k, body }, i) => {
			const sign = k.sign() < 0 ? (i === 0 ? '-' : ' - ') : i === 0 ? '' : ' + ';
			const abs = k.abs();
			return `${sign}${body ? (abs.isOne() ? '' : abs.toLatex()) + body : abs.toLatex()}`;
		})
		.join('');
}

/** ln of a base: a symbol, or a number when the base is a power of e. */
function lnTerm(b: Parsed): { t: string | null; k: Rational } {
	const onlyE = b.val.v.size === 1 && b.val.v.has('e');
	return onlyE ? { t: null, k: b.val.v.get('e')! } : { t: `\\ln ${argTex(b.node)}`, k: ONE };
}

/** a^(f(x)) = c^(g(x)), each maybe with a number in front. */
function twoPowers(l: ExpSide, r: ExpSide, eqTex: string): Outcome {
	// A base 1: that side is just its number.
	for (const [one, other] of [
		[l, r],
		[r, l]
	] as const)
		if (isOne(one.base.val)) {
			if (isOne(other.base.val)) throw new InputError("Con due basi uguali a 1 la x sparisce: ogni potenza di 1 vale 1. Scrivi per esempio 2^x = 8.");
			const k: Parsed = one.coef ?? { node: { k: 'num', v: ONE, raw: '1' }, val: ONE_PNUM };
			const pre: Step = { say: 'Una potenza di $1$ vale sempre $1$.', math: [`1^{${one.f.tex}} = 1`] };
			return onePower(other, k, [pre]);
		}
	const { w, r: rl } = commonBase(l.base.val);
	const rr = ratio(r.base.val, w);
	const tl = l.coef ? ratio(l.coef.val, w) : ZERO;
	const tr = r.coef ? ratio(r.coef.val, w) : ZERO;
	const steps: Step[] = [];
	if (rr && tl && tr) {
		const { tex: c, pow } = baseWriter(w);
		const form = (s: ExpSide, t: Rational, rs: Rational) => `${s.coef ? `${t.isZero() ? '1' : pow(t)} \\cdot ` : ''}${rs.isOne() ? c : `\\left(${pow(rs)}\\right)`}^{${s.f.tex}}`;
		const expo = (s: ExpSide, t: Rational, rs: Rational) => {
			const lin = timesLin(rs, s.f);
			if (t.isZero()) return lin;
			return `${t.toLatex()} ${lin.startsWith('-') ? `- ${lin.slice(1)}` : `+ ${lin}`}`;
		};
		const el = expo(l, tl, rl);
		const er = expo(r, tr, rr);
		const lines = [eqTex, `${form(l, tl, rl)} = ${form(r, tr, rr)}`, `${c}^{\\hl{${el}}} = ${c}^{\\hl{${er}}}`];
		const unique = lines.filter((line, i) => i === 0 || line.replace(/\\hl\{(.*)\}/g, '$1') !== lines[i - 1]);
		if (unique.length > 1) steps.push({ say: l.coef || r.coef ? `Scrivi tutti i numeri come potenze di $${inline(c)}$.` : `Scrivi le due basi come potenze di $${inline(c)}$.`, math: unique });
		const equate = `${el} = ${er}`;
		steps.push({ say: 'Uguaglia gli esponenti: le basi sono uguali.', math: [equate] });
		const solved = linearLines(rl.mul(l.f.p), tl.add(rl.mul(l.f.q)), rr.mul(r.f.p), tr.add(rr.mul(r.f.q)));
		const solveLines = solved.lines.filter((line) => line !== equate);
		if (solved.kind !== 'una') {
			const zero = solved.kind === 'indeterminata';
			steps.push({
				say: "Risolvi l'equazione di primo grado.",
				math: solveLines.length ? solveLines : [equate],
				then: zero ? "Ogni numero per $0$ dà $0$: l'equazione è indeterminata." : "Nessun numero per $0$ dà un numero diverso da $0$: l'equazione è impossibile."
			});
			return zero ? indeterminate(steps) : impossible(steps);
		}
		const x = solved.x!;
		if (solveLines.length) steps.push({ say: "Risolvi l'equazione di primo grado.", math: solveLines });
		steps.push(
			checkStep(
				[
					{ side: l, x },
					{ side: r, x }
				],
				null
			)
		);
		return { ok: true, rows: [{ label: 'Soluzione', value: rationalValue('x = ', x, DIGITS) }], copy: `x = ${x.toString()}`, steps };
	}
	if (l.coef || r.coef)
		throw new InputError('Con un numero davanti alle potenze, qui le basi devono essere potenze dello stesso numero, come 3 · 2^x = 4^(x - 1). Questa equazione non è tra i casi che lo strumento risolve.');
	// Different bases: the natural logarithm of both sides.
	const L = lnTerm(l.base);
	const R = lnTerm(r.base);
	const fTimes = (s: ExpSide) => (s.f.tex === 'x' ? 'x' : `\\left(${s.f.tex}\\right)`);
	const lnSide = (s: ExpSide, t: { t: string | null; k: Rational }) => (t.t === null ? (t.k.isOne() ? s.f.tex : `${t.k.toLatex()}${fTimes(s)}`) : `${fTimes(s)}${t.t}`);
	steps.push({
		say: 'Prendi il logaritmo naturale dei due membri.',
		math: [`\\ln ${powTex(l.base, l.f.tex)} = \\ln ${powTex(r.base, r.f.tex)}`, `${lnSide(l, L)} = ${lnSide(r, R)}`],
		then: "Le basi non sono potenze dello stesso numero. L'esponente passa davanti al logaritmo."
	});
	const lnL = lnOf(l.base.val);
	const lnR = lnOf(r.base.val);
	const A = (l.f.p.num / l.f.p.den) * lnL - (r.f.p.num / r.f.p.den) * lnR;
	const B = (r.f.q.num / r.f.q.den) * lnR - (l.f.q.num / l.f.q.den) * lnL;
	const numTerms = [
		{ k: r.f.q.mul(R.k), t: R.t },
		{ k: l.f.q.mul(L.k).neg(), t: L.t }
	];
	const denTerms = [
		{ k: l.f.p.mul(L.k), t: L.t },
		{ k: r.f.p.mul(R.k).neg(), t: R.t }
	];
	const num = lnCombo(numTerms);
	const den = lnCombo(denTerms);
	// -ln 3 / (ln 2 - ln 3) is written ln 3 / (ln 3 - ln 2): the signs are changed when most terms are negative.
	const signs = [...numTerms, ...denTerms].filter((t) => !t.k.isZero()).map((t) => t.k.sign());
	const flip = signs.filter((x) => x < 0).length > signs.filter((x) => x > 0).length;
	const flipped = (terms: typeof numTerms) => lnCombo(terms.map((t) => ({ k: t.k.neg(), t: t.t })));
	if (num === '0') {
		steps.push({ say: 'Porta i termini con la $x$ a sinistra.', math: [`x\\left(${den}\\right) = 0`, 'x = \\hl{0}'], then: 'Il numero tra parentesi non è zero: allora è zero la $x$.' });
		steps.push(
			checkStep(
				[
					{ side: l, x: ZERO },
					{ side: r, x: ZERO }
				],
				null
			)
		);
		return { ok: true, rows: [{ label: 'Soluzione', value: '$x = 0$' }], copy: 'x = 0', steps };
	}
	const exact = flip ? `\\dfrac{${flipped(numTerms)}}{${flipped(denTerms)}}` : `\\dfrac{${num}}{${den}}`;
	steps.push({
		say: 'Porta i termini con la $x$ a sinistra e ricava la $x$.',
		math: [`x\\left(${den}\\right) = ${num}`, `x = \\dfrac{${num}}{${den}}`, ...(flip ? [`x = ${exact}`] : [])],
		then: flip ? "Nell'ultima riga cambi segno sopra e sotto la frazione." : undefined
	});
	const x = B / A;
	const calc = [...(L.t ? [lnLine(l.base.val, argTex(l.base.node), 6)] : []), ...(R.t ? [lnLine(r.base.val, argTex(r.base.node), 6)] : []), `x \\approx \\hl{${approx(x, DIGITS).tex}}`];
	steps.push({ say: 'Calcola il valore con la calcolatrice, tasto ln.', math: calc });
	return { ok: true, rows: [{ label: 'Soluzione', value: `$x = ${exact}$ $\\approx ${approx(x, DIGITS).tex}$` }], copy: `x ≈ ${approx(x, DIGITS).text}`, steps };
}

/** The solution without the steps, for the tests: exact when rational, else a decimal. */
export function solveExponential(input: string): { x?: Rational; approx?: number; kind: 'una' | 'impossibile' | 'indeterminata' } | null {
	const o = equazioneEsponenziale(input);
	if (!o.ok) return null;
	if (o.copy.startsWith('Impossibile')) return { kind: 'impossibile' };
	if (o.copy.startsWith('Indeterminata')) return { kind: 'indeterminata' };
	if (o.copy.startsWith('x = ')) return { kind: 'una', x: Rational.parse(o.copy.slice(4)) };
	return { kind: 'una', approx: Number(o.copy.slice(4).replace(/\s/g, '').replace(',', '.')) };
}
