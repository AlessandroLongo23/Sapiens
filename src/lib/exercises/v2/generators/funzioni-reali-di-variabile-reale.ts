/**
 * Funzioni reali e dominio. Spec: specs/exercises/funzioni-reali-di-variabile-reale.md
 *
 * Seven levels in the order of the lesson: the domain of a fraction with a second-degree denominator; of a
 * square root with a first-degree radicand; with a second-degree radicand; of a root with a denominator, or at
 * the denominator; of a root of a fraction; the zeros of a function; its sign. Every answer is chosen first
 * (the zeros of the denominator, the ends of the intervals), then the formula is written around it.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SetAnswer } from '../types';
import { assembleChoice, pickDistinct, range } from '../insiemi';
import { ALL, type Fx, type Iv, P, between, commonCheck, frac, from, ivChoice, ivsLatex, ivValue, mul, retry, say, sqrt, tx, upTo, without } from '../funzioni';
import { Rational, q } from '../rational';

export const ID = 'funzioni-reali-di-variabile-reale';

const nz = (rng: Rng, a: number, b: number, not: number[] = []): number => {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0 && !not.includes(v)) return v;
	}
};
const sortR = (xs: Rational[]) => [...xs].sort((a, b) => a.compare(b));
/** (x - r)(x - s), multiplied out, with the sign `sg` in front. */
const quad = (r: number, s: number, sg = 1) => P(sg * r * s, -sg * (r + s), sg);
const lin = (r: number) => P(-r, 1);
const R = (n: number) => q(n);

/** D = ℝ ∖ {…}: the option of a domain given by the values left out. */
function domOption(xs: Rational[]): ChoiceOption {
	const s = sortR(xs);
	return { latex: ivsLatex(s.length ? without(s) : ALL), values: s.map(String) };
}
function zeroOption(xs: Rational[]): ChoiceOption {
	const s = sortR(xs);
	return { latex: s.length ? s.map((v) => `x = ${v.toLatex()}`).join(',\\ ') : tx('nessuno zero'), values: s.map(String) };
}

interface Built {
	case: string;
	prompt: string;
	f: Fx;
	steps: string[];
	/** the answer as intervals (levels 2-5 and 7), or as a list of numbers (1: left out, 6: zeros) */
	ivs?: Iv[];
	list?: Rational[];
	wrongIvs?: Iv[][];
	wrongList?: Rational[][];
	extra?: Record<string, unknown>;
}

const DOMINIO = 'Trova il dominio della funzione.';

function level1(rng: Rng): Built | null {
	const [r, s] = pickDistinct(rng, range(-7, 7), 2).sort((a, b) => a - b);
	const n = rng.next() < 0.3 ? null : nz(rng, -6, 6, [-r, -s]);
	const num = n === null ? P(nz(rng, 1, 5)) : P(n, 1);
	const den = quad(r, s);
	const b = -(r + s);
	const c = r * s;
	const delta = b * b - 4 * c;
	return {
		case: c === 0 ? 'spuria' : b === 0 ? 'pura' : 'completa',
		prompt: DOMINIO,
		f: frac(num, den),
		list: [R(r), R(s)],
		steps: [
			`${tx('Il denominatore deve essere diverso da zero: risolvi ')} ${den.tex} = 0`,
			c === 0
				? `x(${lin(-b).tex}) = 0 \\ \\Rightarrow \\ x = ${r} ${tx(' oppure ')} x = ${s}`
				: b === 0
					? `x^2 = ${-c} \\ \\Rightarrow \\ x = ${r} ${tx(' oppure ')} x = ${s}`
					: `\\Delta = ${delta}, \\quad x = ${r} ${tx(' oppure ')} x = ${s}`,
			`D = ${ivsLatex(without([R(r), R(s)]))}`,
		],
		wrongList: [[R(-r), R(-s)], [R(r)], [R(s)], n === null ? [R(0), R(r), R(s)] : [R(-n)], n === null ? [] : [R(-n), R(r), R(s)], [R(b), R(c)], [], [R(r), R(-s)]],
	};
}

function level2(rng: Rng): Built | null {
	const a = rng.pick([1, 1, -1, 2, -2, 3]);
	const b = nz(rng, -9, 9);
	const z = q(-b, a);
	const up = a > 0;
	const truth = [up ? from(z, true) : upTo(z, true)];
	return {
		case: up ? 'coefficiente positivo' : 'coefficiente negativo',
		prompt: DOMINIO,
		f: sqrt(P(b, a)),
		ivs: truth,
		steps: [
			`${tx('Il radicando deve essere positivo o nullo: ')} ${P(b, a).tex} \\geq 0`,
			up ? `x \\geq ${z.toLatex()}` : `${P(0, a).tex} \\geq ${-b} \\ \\Rightarrow \\ x \\leq ${z.toLatex()} ${tx(' (il verso cambia)')}`,
			`D = ${ivsLatex(truth)}`,
		],
		wrongIvs: [[up ? from(z, false) : upTo(z, false)], [up ? upTo(z, true) : from(z, true)], [up ? from(z.neg(), true) : upTo(z.neg(), true)], without([z]), [up ? upTo(z, false) : from(z, false)]],
	};
}

/** The two sets a trinomial with zeros r < s gives: outside or between, ends in or out. */
const outside = (r: number, s: number, c: boolean): Iv[] => [upTo(R(r), c), from(R(s), c)];
const inside = (r: number, s: number, c: boolean): Iv[] => [between(R(r), c, R(s), c)];

function level3(rng: Rng): Built | null {
	const [r, s] = pickDistinct(rng, range(-7, 7), 2).sort((a, b) => a - b);
	const sg = rng.next() < 0.5 ? 1 : -1;
	const rad = quad(r, s, sg);
	const truth = sg > 0 ? outside(r, s, true) : inside(r, s, true);
	return {
		case: sg > 0 ? 'esterni' : 'interni',
		prompt: DOMINIO,
		f: sqrt(rad),
		ivs: truth,
		steps: [
			`${tx('Il radicando deve essere positivo o nullo: ')} ${rad.tex} \\geq 0`,
			`${tx("L'equazione associata ha le soluzioni ")} ${r} ${tx(' e ')} ${s}${tx('.')}`,
			`${tx('Coefficiente di ')} x^2 ${tx(sg > 0 ? ' positivo e verso ' : ' negativo e verso ')} \\geq ${tx(sg > 0 ? ': valori esterni, estremi compresi.' : ': valori interni, estremi compresi.')}`,
			`D = ${ivsLatex(truth)}`,
		],
		wrongIvs: [sg > 0 ? inside(r, s, true) : outside(r, s, true), sg > 0 ? outside(r, s, false) : inside(r, s, false), without([R(r), R(s)]), sg > 0 ? inside(r, s, false) : outside(r, s, false), [from(R(s), true)], [from(R(r), true)]],
	};
}

function level4(rng: Rng): Built | null {
	const kase = rng.pick(['radice e denominatore', 'denominatore fuori', 'radice al denominatore'] as const);
	if (kase !== 'radice al denominatore') {
		const a = rng.int(-6, 5);
		const b = kase === 'radice e denominatore' ? rng.int(a + 1, a + 6) : rng.int(a - 6, a - 1);
		const f = frac(sqrt(lin(a)), lin(b));
		const inDomain = b > a;
		const truth = inDomain ? [between(R(a), true, R(b), false), from(R(b), false)] : [from(R(a), true)];
		return {
			case: kase,
			prompt: DOMINIO,
			f,
			ivs: truth,
			steps: [
				`${tx('Due condizioni, che devono valere insieme: ')} ${lin(a).tex} \\geq 0 ${tx(' e ')} ${lin(b).tex} \\neq 0`,
				`x \\geq ${a} ${tx(' e ')} x \\neq ${b}`,
				inDomain ? say(`Il numero $${b}$ sta nella semiretta e va tolto.`) : say(`Il numero $${b}$ è già fuori dalla semiretta: non c'è altro da togliere.`),
				`D = ${ivsLatex(truth)}`,
			],
			wrongIvs: inDomain
				? [[from(R(a), true)], without([R(b)]), [between(R(a), false, R(b), false), from(R(b), false)], [from(R(b), false)], without([R(a), R(b)])]
				: [[between(R(b), false, R(a), true)], without([R(b)]), [from(R(a), false)], [from(R(b), false)], without([R(a), R(b)]), [upTo(R(b), false), from(R(a), true)]],
		};
	}
	const [r, s] = pickDistinct(rng, range(-6, 6), 2).sort((a, b) => a - b);
	const sg = rng.next() < 0.5 ? 1 : -1;
	const rad = quad(r, s, sg);
	const n = rng.next() < 0.5 ? P(nz(rng, 1, 5)) : P(nz(rng, -5, 5, [-r, -s]), 1);
	const truth = sg > 0 ? outside(r, s, false) : inside(r, s, false);
	return {
		case: kase,
		prompt: DOMINIO,
		f: frac(n, sqrt(rad)),
		ivs: truth,
		steps: [
			tx('La radice deve esistere e, stando al denominatore, non può valere zero:'),
			`${rad.tex} > 0`,
			`${tx("L'equazione associata ha le soluzioni ")} ${r} ${tx(' e ')} ${s}${tx(sg > 0 ? ': valori esterni, estremi esclusi.' : ': valori interni, estremi esclusi.')}`,
			`D = ${ivsLatex(truth)}`,
		],
		wrongIvs: [sg > 0 ? outside(r, s, true) : inside(r, s, true), sg > 0 ? inside(r, s, false) : outside(r, s, false), without([R(r), R(s)]), sg > 0 ? inside(r, s, true) : outside(r, s, true)],
	};
}

function level5(rng: Rng): Built | null {
	const [a, b] = pickDistinct(rng, range(-7, 7), 2);
	const flipped = rng.next() < 0.35;
	// numerator x - a (or a - x), denominator x - b: the fraction is ≥ 0 outside the two numbers, or between them
	const num = flipped ? P(a, -1) : lin(a);
	const lo = Math.min(a, b);
	const hi = Math.max(a, b);
	const cl = (v: number) => v === a;
	const truth = flipped ? [between(R(lo), cl(lo), R(hi), cl(hi))] : [upTo(R(lo), cl(lo)), from(R(hi), cl(hi))];
	const both = flipped ? [between(R(lo), true, R(hi), true)] : [upTo(R(lo), true), from(R(hi), true)];
	const swapped = flipped ? [upTo(R(lo), cl(lo)), from(R(hi), cl(hi))] : [between(R(lo), cl(lo), R(hi), cl(hi))];
	// the two conditions taken one by one: numerator ≥ 0 and denominator > 0
	const separate = flipped ? (a > b ? [between(R(b), false, R(a), true)] : []) : [a > b ? from(R(a), true) : from(R(b), false)];
	return {
		case: flipped ? 'tra i due numeri' : 'fuori dai due numeri',
		prompt: DOMINIO,
		f: sqrt(frac(num, lin(b))),
		ivs: truth,
		steps: [
			`${tx('Il radicando è una frazione: deve esistere ed essere positiva o nulla.')}`,
			`\\dfrac{${num.tex}}{${lin(b).tex}} \\geq 0`,
			`${tx('Il numeratore è positivo per ')} x ${flipped ? '<' : '>'} ${a}${tx(', il denominatore per ')} x > ${b}${tx('.')}`,
			say(`Segni concordi ${flipped ? 'tra' : 'fuori da'} $${lo}$ e $${hi}$; $${a}$ è incluso (la frazione vale zero), $${b}$ è escluso.`),
			`D = ${ivsLatex(truth)}`,
		],
		wrongIvs: [separate, both, swapped, without([R(b)]), flipped ? [between(R(lo), !cl(lo), R(hi), !cl(hi))] : [upTo(R(lo), !cl(lo)), from(R(hi), !cl(hi))], [from(R(hi), true)], [from(R(lo), false)]].filter((w) => w.length > 0),
	};
}

function level6(rng: Rng): Built | null {
	const kase = rng.pick(['fratta', 'zero escluso', 'radice', 'nessuno'] as const);
	const ZERI = 'Trova gli zeri della funzione.';
	if (kase === 'fratta') {
		const a = rng.int(1, 6);
		const b = nz(rng, -7, 7, [a, -a]);
		return {
			case: kase,
			prompt: ZERI,
			f: frac(P(-a * a, 0, 1), lin(b)),
			list: [R(-a), R(a)],
			steps: [`${tx('Dominio: ')} x \\neq ${b}`, `${tx('Una frazione vale zero dove si annulla il numeratore:')} x^2 - ${a * a} = 0`, `x = ${-a} ${tx(' oppure ')} x = ${a}${tx(', tutti e due nel dominio.')}`],
			wrongList: [[R(a)], [R(b)], [R(-a), R(a), R(b)], [R(a * a)], [], [R(-a)]],
		};
	}
	if (kase === 'zero escluso') {
		const [r, s] = pickDistinct(rng, range(-6, 6), 2);
		return {
			case: kase,
			prompt: ZERI,
			f: frac(quad(r, s), lin(r)),
			list: [R(s)],
			steps: [
				`${tx('Dominio: ')} x \\neq ${r}`,
				`${tx('Il numeratore si annulla per ')} x = ${Math.min(r, s)} ${tx(' e per ')} x = ${Math.max(r, s)}${tx('.')}`,
				say(`Ma $${r}$ non è nel dominio: lo zero è uno solo.`),
				`x = ${s}`,
			],
			wrongList: [[R(r), R(s)], [R(r)], [], [R(-s)], [R(-r), R(-s)]],
		};
	}
	if (kase === 'radice') {
		const b = rng.int(-5, 5);
		const m = nz(rng, -7, 7, [b]); // the zero of the first factor
		const inD = m > b;
		const list = inD ? [R(b), R(m)] : [R(b)];
		return {
			case: inD ? 'radice, due zeri' : 'radice, zero escluso',
			prompt: ZERI,
			f: mul(lin(m), sqrt(lin(b))),
			list,
			steps: [
				`${tx('Dominio: ')} x \\geq ${b}`,
				`${tx('Il prodotto si annulla se si annulla un fattore:')} x = ${m} ${tx(' oppure ')} x = ${b}`,
				inD ? tx('Tutti e due i valori sono nel dominio.') : say(`Ma $${m}$ non è nel dominio: lo zero è uno solo.`),
				list.map((v) => `x = ${v.toLatex()}`).join(',\\ '),
			],
			wrongList: inD ? [[R(m)], [R(b)], [R(-m), R(-b)], [], [R(-m)]] : [[R(b), R(m)], [R(m)], [], [R(-b)], [R(-m), R(-b)]],
		};
	}
	const k = rng.int(1, 9);
	const b = nz(rng, -7, 7);
	return {
		case: kase,
		prompt: ZERI,
		f: frac(P(k, 0, 1), lin(b)),
		list: [],
		steps: [`${tx('Dominio: ')} x \\neq ${b}`, `${tx('Il numeratore ')} x^2 + ${k} ${say(` vale almeno $${k}$ e non si annulla mai.`)}`, tx('La funzione non ha zeri.')],
		wrongList: [[R(b)], [R(-k)], [R(-k), R(k)], [R(0)], [R(-b)]],
	};
}

function level7(rng: Rng): Built | null {
	const want = rng.next() < 0.5 ? 1 : -1;
	const quadNum = rng.next() < 0.55;
	const b = rng.int(-6, 6);
	let zeros: number[];
	let num: Fx;
	if (quadNum) {
		const a = rng.int(1, 6);
		if (Math.abs(b) === a) return null;
		zeros = [-a, a];
		num = P(-a * a, 0, 1);
	} else {
		const a = nz(rng, -7, 7, [b]);
		zeros = [a];
		num = lin(a);
	}
	const pts = [...zeros, b].sort((u, v) => u - v);
	// monic numerator and denominator, simple zeros: positive at the far right, then the signs alternate
	const sel = (sign: number, closedAt: number[]): Iv[] => {
		const out: Iv[] = [];
		for (let i = 0; i <= pts.length; i++) {
			const s = (pts.length - i) % 2 === 0 ? 1 : -1;
			if (s !== sign) continue;
			const lo = i === 0 ? null : R(pts[i - 1]);
			const hi = i === pts.length ? null : R(pts[i]);
			out.push({ lo, hi, loC: !!lo && closedAt.includes(pts[i - 1]), hiC: !!hi && closedAt.includes(pts[i]) });
		}
		return out;
	};
	const truth = sel(want, []);
	// the sign of the numerator alone: the denominator forgotten
	const numOnly: Iv[] = quadNum ? (want > 0 ? outside(zeros[0], zeros[1], false) : inside(zeros[0], zeros[1], false)) : [want > 0 ? from(R(zeros[0]), false) : upTo(R(zeros[0]), false)];
	const word = want > 0 ? 'positiva' : 'negativa';
	return {
		case: `${quadNum ? 'numeratore di secondo grado' : 'numeratore di primo grado'}, ${word}`,
		prompt: `Per quali x la funzione è ${word}?`,
		f: frac(num, lin(b)),
		ivs: truth,
		steps: [
			`${tx('Dominio: ')} x \\neq ${b}`,
			quadNum ? `${tx('Numeratore positivo per ')} x < ${zeros[0]} ${tx(' oppure ')} x > ${zeros[1]}${tx(', denominatore positivo per ')} x > ${b}${tx('.')}` : `${tx('Numeratore positivo per ')} x > ${zeros[0]}${tx(', denominatore positivo per ')} x > ${b}${tx('.')}`,
			tx(`Nella tabella dei segni la frazione è ${word} dove i due segni sono ${want > 0 ? 'concordi' : 'discordi'}.`),
			ivsLatex(truth),
		],
		wrongIvs: [sel(-want, []), sel(want, zeros), numOnly, sel(want, pts), sel(-want, zeros), without([R(b)])],
		extra: { want },
	};
}

const LEVELS: Record<number, (rng: Rng) => Built | null> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

function assemble(rng: Rng, level: number): Sample | null {
	const b = LEVELS[level](rng);
	if (!b) return null;
	const base = { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: `f(x) = ${b.f.tex}`, steps: b.steps };
	if (b.ivs) {
		const ch = ivChoice(rng, b.ivs, b.wrongIvs ?? []);
		if (!ch) return null;
		return {
			...base,
			solution: `${level === 7 ? '' : 'D = '}${ivsLatex(b.ivs)}`,
			answer: ch,
			params: { case: b.case, fx: b.f.py, truth: b.ivs.map(ivValue), ...b.extra },
		};
	}
	const list = sortR(b.list ?? []);
	const opt = level === 1 ? domOption(list) : zeroOption(list);
	const answer: SetAnswer = { kind: 'set', values: list.map(String), latex: level === 1 ? `D = ${opt.latex}` : opt.latex };
	return {
		...base,
		solution: answer.latex,
		answer,
		params: { case: b.case, fx: b.f.py, list: list.map(String), wrong: (b.wrongList ?? []).map((w) => sortR(w).map(String)) },
	};
}

function toChoice(s: Sample, rng: Rng): ChoiceAnswer {
	if (s.answer.kind === 'choice') return s.answer;
	const p = s.params as { list: string[]; wrong: string[][] };
	const mk = s.level === 1 ? domOption : zeroOption;
	const parse = (xs: string[]) => xs.map((v) => Rational.parse(v));
	const cands = p.wrong.map(parse);
	const first = p.list.length ? Rational.parse(p.list[0]) : q(0);
	for (let d = 1; d < 6; d++) cands.push([first.add(q(d))], [first.sub(q(d))]);
	const ch = assembleChoice(rng, mk(parse(p.list)), cands.map(mk));
	if (!ch) throw new Error(`${ID}: livello ${s.level} senza abbastanza distrattori`);
	return ch;
}

function check(s: Sample): string[] {
	if (!LEVELS[s.level]) return [`livello ${s.level} sconosciuto`];
	const errs = commonCheck(s, s.choice);
	const p = s.params as { truth?: string[]; list?: string[] };
	if (s.level >= 2 && s.level !== 6) {
		if (s.answer.kind !== 'choice') return [...errs, 'la risposta deve essere a scelta multipla'];
		if (s.answer.options[s.answer.correct].values.join('|') !== (p.truth ?? []).join('|')) errs.push('opzione giusta diversa dalla risposta');
		if (!p.truth?.length) errs.push('la risposta non può essere vuota');
	} else {
		if (s.answer.kind !== 'set') return [...errs, 'la risposta deve essere un insieme di numeri'];
		if (s.answer.values.join('|') !== (p.list ?? []).join('|')) errs.push('risposta diversa dai parametri');
		if (s.level === 1 && s.answer.values.length !== 2) errs.push('livello 1: due valori esclusi');
		if (s.choice && s.choice.options[s.choice.correct].values.join('|') !== s.answer.values.join('|')) errs.push('opzione giusta diversa dalla risposta');
	}
	return errs;
}

const generator: Generator = {
	id: ID,
	title: 'Funzioni reali e dominio',
	levels: {
		1: { label: 'Dominio di una funzione fratta', constraints: ['denominatore di secondo grado con due zeri interi distinti tra -7 e 7', 'la risposta sono i due valori esclusi'] },
		2: { label: 'Radice con radicando di primo grado', constraints: ['radicando ax + b con a tra -2 e 3, a ≠ 0', 'una semiretta con l’estremo incluso'] },
		3: { label: 'Radice con radicando di secondo grado', constraints: ['radicando ±(x - r)(x - s) sviluppato, r e s interi distinti', 'valori esterni o interni, estremi compresi'] },
		4: { label: 'Radice e denominatore insieme', constraints: ['radice al numeratore con un denominatore di primo grado, oppure radice al denominatore', 'estremi esclusi quando la radice è al denominatore'] },
		5: { label: 'Frazione sotto radice', constraints: ['radicando (x - a)/(x - b) oppure (a - x)/(x - b)', 'lo zero del numeratore incluso, quello del denominatore escluso'] },
		6: { label: 'Zeri di una funzione', constraints: ['frazione o prodotto con una radice', 'uno zero conta solo se sta nel dominio'] },
		7: { label: 'Segno di una funzione fratta', constraints: ['numeratore di primo o secondo grado, denominatore di primo grado, zeri semplici', 'intervalli aperti'] },
	},
	generate: (rng, level) => {
		if (!LEVELS[level]) throw new Error(`${ID}: livello ${level} sconosciuto`);
		return retry(ID, level, () => assemble(rng, level));
	},
	check,
	toChoice,
};

export default generator;
