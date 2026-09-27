import { Rational, ZERO } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type ResultRow, type Step } from './types';
import {
	E,
	InputError,
	XError,
	approx,
	argTex,
	groupSteps,
	isOne,
	isolateX,
	linAt,
	linSub,
	linearLines,
	logTex,
	matchBracket,
	normalize,
	parseLinear,
	parseNumberNode,
	pequal,
	pnumOf,
	pnumTex,
	ppow,
	rationalValue,
	splitEquation,
	toRational,
	valueOf,
	writtenTex,
	type Lin,
	type Parsed
} from './logaritmi';

/**
 * Elementary logarithmic equations: log_a(f(x)) = c and log_a(f(x)) = log_a(g(x)), with f and g of the first
 * degree. The steps start from the conditions of existence (every argument positive), solve the first-degree
 * equation that is left, and check the solution against the conditions.
 */

const EXAMPLE = 'log_2(x + 1) = 3';
const DIGITS = 4;

/** `log` without a base is the logarithm in base 10, as in Italian textbooks and on calculators. */
const TEN: Parsed = { node: { k: 'num', v: Rational.of(10), raw: '10' }, val: pnumOf(Rational.of(10)) };

type Arg = { x: true; f: Lin } | { x: false; c: Parsed };
type Side = { kind: 'log'; base: Parsed; plain10: boolean; arg: Arg; tex: string } | { kind: 'const'; c: Parsed; tex: string };

function logName(s: Extract<Side, { kind: 'log' }>): string {
	return s.plain10 ? '\\log' : logTex(s.base.val, s.base.node);
}

function argLatex(a: Arg): string {
	if (!a.x) return argTex(a.c.node);
	return a.f.node.k === 'x' ? 'x' : `\\left(${a.f.tex}\\right)`;
}

const OUT_OF_SCOPE = `Scrivi un solo logaritmo per membro, senza numeri davanti o somme di logaritmi: per esempio ${EXAMPLE}. Qui si risolvono solo questi casi.`;

function parseSide(raw: string): Side {
	const text = raw.trim();
	const m = /^(log|ln)/i.exec(text);
	if (!m) {
		if (/log|ln/i.test(text)) throw new InputError(OUT_OF_SCOPE);
		try {
			const c = parseNumberNode(text)!;
			return { kind: 'const', c, tex: writtenTex(c.node) };
		} catch (e) {
			if (e instanceof XError) throw new InputError(`La x deve stare dentro il logaritmo: scrivi per esempio ${EXAMPLE}.`);
			throw e;
		}
	}
	let rest = text.slice(m[0].length);
	let base: Parsed = TEN;
	let plain10 = false;
	if (m[0].toLowerCase() === 'ln') base = { node: { k: 'e' }, val: E };
	else if (/^\s*_/.test(rest)) {
		rest = rest.replace(/^\s*_\s*/, '');
		let baseText: string;
		if ('([{'.includes(rest[0] ?? '')) {
			const close = matchBracket(rest, 0);
			if (close < 0) throw new InputError('Controlla le parentesi della base: per esempio log_(1/2)(x) = 3.');
			baseText = rest.slice(1, close);
			rest = rest.slice(close + 1);
		} else {
			const b = /^(\d+(?:[.,]\d+)?|e)/.exec(rest);
			if (!b) throw new InputError(`Dopo log_ scrivi la base, per esempio ${EXAMPLE}.`);
			baseText = b[0];
			rest = rest.slice(b[0].length);
		}
		base = parseNumberNode(baseText) ?? TEN;
	} else if (/^\d+(?:[.,]\d+)?\s*\(/.test(rest)) {
		// "log2(x)", the base right after log.
		const b = /^\d+(?:[.,]\d+)?/.exec(rest)!;
		base = parseNumberNode(b[0])!;
		rest = rest.slice(b[0].length);
	} else plain10 = true;
	rest = rest.trim();
	if (!rest) throw new InputError(`Manca l'argomento del logaritmo: scrivi per esempio ${EXAMPLE}.`);
	let argText: string;
	if ('([{'.includes(rest[0])) {
		const close = matchBracket(rest, 0);
		if (close < 0) throw new InputError("Controlla le parentesi dell'argomento: chiudi ogni parentesi che apri.");
		if (rest.slice(close + 1).trim()) throw new InputError(OUT_OF_SCOPE);
		argText = rest.slice(1, close);
	} else {
		if (/[+\-*/:]/.test(rest.slice(1)) || /log|ln/i.test(rest)) throw new InputError(`Metti l'argomento tra parentesi: per esempio ${EXAMPLE}.`);
		argText = rest;
	}
	let arg: Arg;
	if (/x/i.test(argText)) arg = { x: true, f: parseLinear(argText, "l'argomento") };
	else {
		const c = parseNumberNode(argText);
		if (!c) throw new InputError(`Manca l'argomento del logaritmo: scrivi per esempio ${EXAMPLE}.`);
		arg = { x: false, c };
	}
	const side: Side = { kind: 'log', base, plain10, arg, tex: '' };
	side.tex = `${logName(side)} ${argLatex(arg)}`;
	return side;
}

function parse(input: string): { l: Side; r: Side; tex: string } | string {
	const split = splitEquation(input, EXAMPLE);
	if (typeof split === 'string') return split;
	try {
		const [l, r] = split.map((s) => parseSide(normalize(s)));
		return { l, r, tex: `${l.tex} = ${r.tex}` };
	} catch (e) {
		if (e instanceof InputError) return e.message;
		return 'I numeri sono troppo grandi per fare i calcoli esatti: prova con numeri più piccoli.';
	}
}

/** The equation as typed, in LaTeX, for the preview under the field; null when it cannot be read. */
export function previewLogaritmica(input: string): string | null {
	const p = parse(input);
	return typeof p === 'string' ? null : p.tex;
}

type LogSide = Extract<Side, { kind: 'log' }>;

/** What is left after the logarithms: f(x) = t, a number, or f(x) = g(x). */
type Reduced = { f: Lin; t: { val: ReturnType<typeof pnumOf>; tex: string }; g?: undefined } | { f: Lin; g: Lin; t?: undefined };

export function equazioneLogaritmica(input: string): Outcome {
	const p = parse(input);
	if (typeof p === 'string') return fail(p);
	const { l, r } = p;
	const logs = [l, r].filter((s): s is LogSide => s.kind === 'log');
	if (!logs.some((s) => s.arg.x)) return fail(`Nell'equazione non c'è la x dentro un logaritmo: scrivi per esempio ${EXAMPLE}.`);
	for (const s of logs) if (s.base.val.sign <= 0 || isOne(s.base.val)) return fail('La base di un logaritmo deve essere positiva e diversa da 1: per esempio log_2(x + 1) = 3.');
	if (logs.length === 2 && !pequal(logs[0].base.val, logs[1].base.val)) return fail('I due logaritmi devono avere la stessa base, come in log_2(x) = log_2(3x - 4). Con basi diverse qui l\'equazione non si risolve.');
	for (const s of logs) if (!s.arg.x && s.arg.c.val.sign <= 0) return fail(`Il logaritmo di un numero negativo o di zero non esiste: l'equazione non ha significato. Scrivi per esempio ${EXAMPLE}.`);
	try {
		return solve(l, r, p.tex);
	} catch (e) {
		return fail(e instanceof InputError ? e.message : 'I numeri sono troppo grandi per fare i calcoli esatti: prova con numeri più piccoli.');
	}
}

type Part = 'ce' | 'eq' | 'check';
const PARTS: Record<Part, string> = { ce: 'Le condizioni di esistenza', eq: "L'equazione", check: 'Il controllo' };

/** The condition f(x) > 0 as a bound on x. */
function bound(f: Lin): { dir: '>' | '<'; b: Rational } {
	return { dir: f.p.sign() > 0 ? '>' : '<', b: f.q.neg().div(f.p) };
}

function solve(l: Side, r: Side, eqTex: string): Outcome {
	const steps: (Step & { part: Part })[] = [];
	const [a, b] = l.kind === 'log' ? [l, r] : [r as LogSide, l];
	const args = [a, b].flatMap((s) => (s.kind === 'log' && s.arg.x ? [s.arg.f] : []));

	// The conditions of existence.
	const bounds = args.map(bound);
	steps.push({
		say: args.length > 1 ? 'Scrivi le condizioni di esistenza: gli argomenti devono essere positivi.' : "Scrivi la condizione di esistenza: l'argomento deve essere positivo.",
		math: args.map((f, i) => (f.node.k === 'x' ? 'x > 0' : `${f.tex} > 0 \\quad\\Rightarrow\\quad x ${bounds[i].dir} ${bounds[i].b.toLatex()}`)),
		part: 'ce'
	});
	const lows = bounds.filter((x) => x.dir === '>').map((x) => x.b);
	const highs = bounds.filter((x) => x.dir === '<').map((x) => x.b);
	const lo = lows.length ? lows.reduce((m, x) => (x.compare(m) > 0 ? x : m)) : null;
	const hi = highs.length ? highs.reduce((m, x) => (x.compare(m) < 0 ? x : m)) : null;
	const ce = lo && hi ? `${lo.toLatex()} < x < ${hi.toLatex()}` : lo ? `x > ${lo.toLatex()}` : `x < ${hi!.toLatex()}`;
	const inCE = (x: Rational) => (!lo || x.compare(lo) > 0) && (!hi || x.compare(hi) < 0);
	if (args.length > 1) {
		const empty = lo && hi && lo.compare(hi) >= 0;
		steps.push({
			say: 'Prendi i numeri che rispettano entrambe le condizioni.',
			math: empty ? undefined : [`\\hl{${ce}}`],
			then: empty ? "Nessun numero le rispetta tutte e due: l'equazione è impossibile." : undefined,
			part: 'ce'
		});
		if (empty) return finish(steps, impossibleRows(), 'Impossibile: nessuna soluzione');
	}
	const ceRow: ResultRow = { label: 'Condizioni di esistenza', value: `$${ce}$` };

	// The equation without logarithms.
	let red: Reduced;
	if (b.kind === 'const') {
		const c = toRational(b.c.val);
		if (!c) throw new InputError('Dopo il segno = scrivi un numero intero, decimale o una frazione, come 3 oppure 1/2.');
		const t = ppow(a.base.val, c);
		const baseT = writtenTex(a.base.node);
		const power = `${/^[\d\\,]+$|^e$/.test(baseT) && !baseT.includes('{,}') ? baseT : `\\left(${baseT}\\right)`}^{${c.toLatex()}}`;
		const f = (a.arg as { f: Lin }).f;
		const tTex = pnumTex(t);
		const lines = [eqTex, `${f.tex} = ${power}`, ...(tTex !== power ? [`${f.tex} = \\hl{${tTex}}`] : [])];
		steps.push({ say: `Usa la definizione: l'argomento è la base elevata a $${c.toLatex()}$.`, math: lines, part: 'eq' });
		red = { f, t: { val: t, tex: tTex } };
	} else {
		const af = a.arg;
		const bf = b.arg;
		const lines = [eqTex, `${af.x ? af.f.tex : writtenTex(af.c.node)} = ${bf.x ? bf.f.tex : writtenTex(bf.c.node)}`];
		steps.push({ say: 'Uguaglia gli argomenti: i logaritmi hanno la stessa base.', math: lines, part: 'eq' });
		if (af.x && bf.x) red = { f: af.f, g: bf.f };
		else {
			const f = af.x ? af.f : (bf as { f: Lin }).f;
			const c = (af.x ? bf : af) as { c: Parsed };
			red = { f, t: { val: c.c.val, tex: writtenTex(c.c.node) } };
		}
	}

	// Solve and check.
	if (red.g) {
		const { f, g } = red;
		const solved = linearLines(f.p, f.q, g.p, g.q);
		const lines = solved.lines.filter((line) => line !== `${f.tex} = ${g.tex}`);
		if (solved.kind !== 'una') {
			const all = solved.kind === 'indeterminata';
			steps.push({
				say: "Risolvi l'equazione di primo grado.",
				math: lines.length ? lines : undefined,
				then: all ? 'Ogni numero per $0$ dà $0$: vanno bene tutti i numeri delle condizioni di esistenza.' : "Nessun numero per $0$ dà un numero diverso da $0$: l'equazione è impossibile.",
				part: 'eq'
			});
			return all
				? finish(
						steps,
						[
							{ label: 'Soluzioni', value: 'Tutti i numeri che rispettano le condizioni di esistenza' },
							{ label: 'Insieme delle soluzioni', value: `$${ce}$` }
						],
						`Indeterminata: ${ce}`
					)
				: finish(steps, impossibleRows(), 'Impossibile: nessuna soluzione');
		}
		steps.push({ say: "Risolvi l'equazione di primo grado.", math: lines, part: 'eq' });
		return checkRational(steps, solved.x!, args, inCE(solved.x!), ceRow);
	}
	const { f, t } = red;
	const tr = toRational(t.val);
	if (tr) {
		const solved = linearLines(f.p, f.q, ZERO, tr);
		const lines = solved.lines.filter((line) => line !== `${f.tex} = ${t.tex}`);
		if (lines.length && f.node.k !== 'x') steps.push({ say: "Risolvi l'equazione di primo grado.", math: lines, part: 'eq' });
		return checkRational(steps, solved.x!, args, inCE(solved.x!), ceRow);
	}
	// The number is a root or a power of e: x stays written exactly, with its decimal value.
	const iso = isolateX(f.p, f.q, t.tex);
	const x = (valueOf(t.val) - f.q.num / f.q.den) / (f.p.num / f.p.den);
	if (iso.lines.length) steps.push({ say: 'Ricava la $x$.', math: iso.lines, part: 'eq' });
	steps.push({ say: 'Calcola il valore decimale.', math: [`${t.tex} \\approx ${approx(valueOf(t.val), 6).tex}`, `x \\approx \\hl{${approx(x, DIGITS).tex}}`], part: 'eq' });
	steps.push({
		say: 'Controlla che la soluzione rispetti la condizione di esistenza.',
		math: [`${f.tex} = ${t.tex} > 0`],
		then: "L'argomento vale un numero positivo: la soluzione è accettabile.",
		part: 'check'
	});
	return finish(steps, [{ label: 'Soluzione', value: `$x = ${iso.exact}$ $\\approx ${approx(x, DIGITS).tex}$` }, ceRow], `x ≈ ${approx(x, DIGITS).text}`);
}

function impossibleRows(): ResultRow[] {
	return [
		{ label: 'Soluzioni', value: "Nessuna: l'equazione è impossibile" },
		{ label: 'Insieme delle soluzioni', value: '$S = \\emptyset$' }
	];
}

/** The check of a rational solution: each argument with x replaced, and its sign. */
function checkRational(steps: (Step & { part: Part })[], x: Rational, args: Lin[], ok: boolean, ceRow: ResultRow): Outcome {
	const lines = args.map((f) => {
		const v = linAt(f, x);
		const sub = linSub(f, x);
		const rel = v.sign() > 0 ? '>' : v.sign() < 0 ? '<' : '=';
		return `${sub === v.toLatex() ? '' : `${sub} = `}${v.toLatex()} ${rel} 0`;
	});
	steps.push({
		say: args.length > 1 ? 'Controlla che la soluzione rispetti le condizioni di esistenza.' : 'Controlla che la soluzione rispetti la condizione di esistenza.',
		math: lines,
		then: ok
			? `${args.length > 1 ? 'Gli argomenti sono positivi' : "L'argomento è positivo"}: la soluzione è accettabile.`
			: `${args.length > 1 ? 'Un argomento non è positivo' : "L'argomento non è positivo"}: la soluzione non è accettabile e l'equazione è impossibile.`,
		part: 'check'
	});
	if (!ok)
		return finish(
			steps,
			[
				{ label: 'Soluzioni', value: `Nessuna: $x = ${x.toLatex()}$ non rispetta le condizioni di esistenza` },
				{ label: 'Insieme delle soluzioni', value: '$S = \\emptyset$' }
			],
			'Impossibile: nessuna soluzione'
		);
	return finish(steps, [{ label: 'Soluzione', value: rationalValue('x = ', x, DIGITS) }, ceRow], `x = ${x.toString()}`);
}

function finish(steps: (Step & { part: Part })[], rows: ResultRow[], copy: string): Outcome {
	return { ok: true, rows, copy, steps: groupSteps(steps, PARTS) };
}

/** The solution without the steps, for the tests. */
export function solveLogarithmic(input: string): { x?: Rational; approx?: number; kind: 'una' | 'impossibile' | 'indeterminata' } | null {
	const o = equazioneLogaritmica(input);
	if (!o.ok) return null;
	if (o.copy.startsWith('Impossibile')) return { kind: 'impossibile' };
	if (o.copy.startsWith('Indeterminata')) return { kind: 'indeterminata' };
	if (o.copy.startsWith('x = ')) return { kind: 'una', x: Rational.parse(o.copy.slice(4)) };
	return { kind: 'una', approx: Number(o.copy.slice(4).replace(/\s/g, '').replace(',', '.')) };
}
