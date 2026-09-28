/**
 * Teorema di Talete. Spec: specs/exercises/teorema-di-talete.md
 *
 * Eight levels, from the "Per il generatore" section of the lesson's note
 * (docs/lezioni/note/102-teorema-di-talete.md), in the order of the lesson: the fourth segment of a bundle of
 * parallels; the same with a whole segment (AC or A'C') and decimals, the unknown on either transversal; an
 * unknown in two segments (x and x + k); a parallel to a side of a triangle; the converse (is DE parallel to
 * BC?); the angle bisector theorem; the midpoint segment; problems of division into proportional parts. No
 * figures: every exercise stands on its text. Level 5 answers with a choice (yes or no); the others with an
 * exact number and a multiple-choice variant whose distractors are the mistakes the lesson warns about.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, q } from '../rational';
import { buildChoice, weighted } from '../razionali';
import { textBlock } from '../insiemi';

export const ID = 'teorema-di-talete';

const R = (s: string) => Rational.parse(s);
const t = (s: string) => `\\text{${s}}`;
const bar = (s: string) => `\\overline{${s}}`;
const hat = (v: string) => `\\hat{${v}}`;

// ---------------------------------------------------------------------------
// Numbers

/** Decimal places of a rational with a finite expansion, or null if periodic. */
function decimals(r: Rational): number | null {
	let d = r.den;
	let e2 = 0;
	let e5 = 0;
	for (; d % 2 === 0; e2++) d /= 2;
	for (; d % 5 === 0; e5++) d /= 5;
	return d === 1 ? Math.max(e2, e5) : null;
}

/** Positive, with a finite expansion of at most `max` decimals. */
const nice = (r: Rational, max: number) => r.sign() > 0 && decimals(r) !== null && (decimals(r) as number) <= max;

/** 12, 3{,}5, 0{,}25: a number with a finite expansion, as the lesson writes it. */
function numTex(r: Rational): string {
	const k = decimals(r);
	if (k === null) throw new Error(`${ID}: ${r} is not a finite decimal`);
	if (k === 0) return String(r.num);
	const neg = r.num < 0 ? '-' : '';
	const s = String(Math.round((Math.abs(r.num) * 10 ** k) / r.den)).padStart(k + 1, '0');
	return `${neg}${s.slice(0, s.length - k)}{,}${s.slice(s.length - k)}`;
}

type Unit = 'cm' | 'm' | '';
const withUnit = (r: Rational, unit: Unit) => (unit ? `${numTex(r)}\\text{ ${unit}}` : numTex(r));
/** A given in the prose: $\overline{AB} = 4$ cm. */
const givenTex = (name: string, v: Rational, unit: Unit) => `$${bar(name)} = ${numTex(v)}$${unit ? ` ${unit}` : ''}`;
/** "e" or "ed" before a segment name, as the lesson writes it ("ed $\overline{EC}$"). */
const conj = (name: string) => (/^[AE]/.test(name) ? 'ed' : 'e');

function listGivens(items: [string, Rational][], unit: Unit): string {
	const parts = items.map(([n, v]) => givenTex(n, v, unit));
	const last = parts.pop() as string;
	return `${parts.join(', ')} ${conj(items[items.length - 1][0])} ${last}`;
}

/** a·x with a ≠ 1 written without the 1. */
const coefX = (a: Rational) => (a.isOne() ? 'x' : `${numTex(a)}x`);

interface Built {
	case: string;
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: { kind: 'number'; value: Rational; wrong: Rational[]; unit: Unit } | { kind: 'choice'; choice: ChoiceAnswer };
	params: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Two lines cut by parallels: the three segments of each (first part, second part, whole)

type Idx = 0 | 1 | 2;
interface Line {
	names: [string, string, string];
	vals: [Rational, Rational, Rational];
}
const mkLine = (names: [string, string, string], p: Rational, qq: Rational): Line => ({ names, vals: [p, qq, p.add(qq)] });

const R_NAMES: [string, string, string] = ['AB', 'BC', 'AC'];
const S_NAMES: [string, string, string] = ["A'B'", "B'C'", "A'C'"];
const AB_SIDE: [string, string, string] = ['AD', 'DB', 'AB'];
const AC_SIDE: [string, string, string] = ['AE', 'EC', 'AC'];

const FASCIO = "Un fascio di parallele $a$, $b$, $c$ taglia la trasversale $r$ nei punti $A$, $B$, $C$ e la trasversale $s$ nei punti $A'$, $B'$, $C'$.";

/**
 * L has two known segments, O one known (oKnown) and one asked (oAsk). Steps as in the lesson: the missing
 * segment of L by sum or difference if needed, the proportion by names, then with numbers, then the product
 * of the extremes equal to the product of the means.
 */
function solveProportion(L: Line, O: Line, lKnown: Idx[], oKnown: Idx, oAsk: Idx, unit: Unit) {
	const steps: string[] = [];
	const missing = ([0, 1, 2] as Idx[]).find((i) => !lKnown.includes(i)) as Idx;
	if (missing === oKnown || missing === oAsk) {
		const v = L.vals;
		steps.push(
			missing === 2
				? `${bar(L.names[2])} = ${numTex(v[0])} + ${numTex(v[1])} = ${withUnit(v[2], unit)}`
				: `${bar(L.names[missing])} = ${numTex(v[2])} - ${numTex(v[1 - missing])} = ${withUnit(v[missing], unit)}`,
		);
	}
	const a = L.vals[oKnown];
	const b = L.vals[oAsk];
	const K = O.vals[oKnown];
	const value = O.vals[oAsk];
	if (!K.mul(b).div(a).equals(value)) throw new Error(`${ID}: inconsistent proportion`);
	const prod = b.mul(K);
	steps.push(`${L.names[oKnown]} : ${L.names[oAsk]} = ${O.names[oKnown]} : ${O.names[oAsk]}`);
	steps.push(`${numTex(a)} : ${numTex(b)} = ${numTex(K)} : x`);
	steps.push(`${coefX(a)} = ${numTex(b)} \\cdot ${numTex(K)} = ${numTex(prod)}`);
	if (!a.isOne()) steps.push(`x = ${numTex(prod)} : ${numTex(a)} = ${numTex(value)}`);
	const m3 = ([0, 1, 2] as Idx[]).find((i) => i !== oKnown && i !== oAsk) as Idx;
	const wrong = [
		K.mul(a).div(b), // the corresponding segments in the other order: a : b = x : K
		K.mul(L.vals[m3]).div(a), // the wrong corresponding segment (a part for the whole, or the other part)
		O.vals[m3], // the other segment of O
		K.add(b).sub(a), // the same difference on both lines
		a.mul(b).div(K), // means and extremes mixed up
		K.mul(b).div(L.vals[m3]),
	];
	return { value, steps, wrong, solution: `${bar(O.names[oAsk])} = ${withUnit(value, unit)}` };
}

/** p and q integers, k = O / L: all six segments with at most one decimal, whole of L and of O ≤ 40. */
function twoLines(rng: Rng, denoms: number[], pMax: number): { p: Rational; qq: Rational; k: Rational } {
	for (;;) {
		const p = rng.int(2, pMax);
		const qq = rng.int(2, pMax);
		if (p === qq || p + qq > 40) continue;
		const k = q(rng.int(1, 40), rng.pick(denoms));
		if (k.isOne() || k.compare(q(1, 3)) < 0 || k.compare(q(3)) > 0) continue;
		const o = [q(p), q(qq), q(p + qq)].map((x) => x.mul(k));
		if (o.some((x) => !nice(x, 1) || x.compare(q(40)) > 0 || x.compare(q(1)) < 0)) continue;
		return { p: q(p), qq: q(qq), k };
	}
}

// ---------------------------------------------------------------------------
// Level 1: the fourth segment

function level1(rng: Rng): Built {
	for (;;) {
		const g = rng.int(1, 4);
		const h = rng.int(1, 12);
		if (gcd(g, h) !== 1 || g === h) continue;
		const p0 = rng.int(1, 10);
		const q0 = rng.int(1, 10);
		if (p0 === q0) continue;
		const vals = [g * p0, g * q0, h * p0, h * q0];
		if (Math.min(...vals) < 2 || Math.max(...vals) > 40) continue;
		const L = mkLine(R_NAMES, q(vals[0]), q(vals[1]));
		const O = mkLine(S_NAMES, q(vals[2]), q(vals[3]));
		const oAsk = rng.pick([0, 1] as const);
		const oKnown = (1 - oAsk) as Idx;
		const s = solveProportion(L, O, [0, 1], oKnown, oAsk, 'cm');
		const givens: [string, Rational][] = [
			[L.names[0], L.vals[0]],
			[L.names[1], L.vals[1]],
			[O.names[oKnown], O.vals[oKnown]],
		];
		return {
			case: oAsk === 1 ? 'seconda parte' : 'prima parte',
			prompt: 'Risolvi il problema.',
			problem: textBlock(`${FASCIO} Sai che ${listGivens(givens, 'cm')}. Trova $${O.names[oAsk]}$.`),
			solution: s.solution,
			steps: [t('Per il teorema di Talete'), ...s.steps],
			answer: { kind: 'number', value: s.value, wrong: s.wrong, unit: 'cm' },
			params: { r: [L.vals[0], L.vals[1]].map(String), s: [O.vals[0], O.vals[1]].map(String), known: [...givens.map((x) => x[0])], asked: O.names[oAsk] },
		};
	}
}

// ---------------------------------------------------------------------------
// Levels 2 and 4: a whole segment among the data, decimals; the fascio or the triangle

/** Configurations: two known on L, one known and one asked on O. `needWhole`: the whole appears somewhere. */
function configs(needWhole: boolean): { lKnown: Idx[]; oKnown: Idx; oAsk: Idx }[] {
	const out: { lKnown: Idx[]; oKnown: Idx; oAsk: Idx }[] = [];
	const pairs: Idx[][] = [
		[0, 1],
		[0, 2],
		[1, 2],
	];
	for (const lKnown of pairs)
		for (const oKnown of [0, 1, 2] as Idx[])
			for (const oAsk of [0, 1, 2] as Idx[]) {
				if (oKnown === oAsk) continue;
				if (needWhole && !lKnown.includes(2) && oKnown !== 2 && oAsk !== 2) continue;
				out.push({ lKnown, oKnown, oAsk });
			}
	return out;
}

function level2(rng: Rng): Built {
	const cfg = rng.pick(configs(true));
	const lOnR = rng.next() < 0.5;
	const wantDecimal = rng.next() < 0.6;
	for (;;) {
		const { p, qq, k } = twoLines(rng, [1, 2, 2, 5], 20);
		const L = mkLine(lOnR ? R_NAMES : S_NAMES, p, qq);
		const O = mkLine(lOnR ? S_NAMES : R_NAMES, p.mul(k), qq.mul(k));
		const value = O.vals[cfg.oAsk];
		if (!value.isInteger() !== wantDecimal) continue;
		const s = solveProportion(L, O, cfg.lKnown, cfg.oKnown, cfg.oAsk, 'cm');
		const lGiv: [string, Rational][] = cfg.lKnown.map((i) => [L.names[i], L.vals[i]]);
		const oGiv: [string, Rational][] = [[O.names[cfg.oKnown], O.vals[cfg.oKnown]]];
		const givens = lOnR ? [...lGiv, ...oGiv] : [...oGiv, ...lGiv];
		return {
			case: lOnR ? 'incognita su s' : 'incognita su r',
			prompt: 'Risolvi il problema.',
			problem: textBlock(`${FASCIO} Sai che ${listGivens(givens, 'cm')}. Trova $${O.names[cfg.oAsk]}$.`),
			solution: s.solution,
			steps: [t('Per il teorema di Talete'), ...s.steps],
			answer: { kind: 'number', value: s.value, wrong: s.wrong, unit: 'cm' },
			params: { r: (lOnR ? L : O).vals.map(String), s: (lOnR ? O : L).vals.map(String), known: givens.map((x) => x[0]), asked: O.names[cfg.oAsk] },
		};
	}
}

function level4(rng: Rng): Built {
	const oAsk: Idx = rng.next() < 0.45 ? 2 : rng.pick([0, 1] as const);
	const oKnown = rng.pick(([0, 1, 2] as Idx[]).filter((i) => i !== oAsk));
	const lKnown = rng.pick([
		[0, 1],
		[0, 2],
		[1, 2],
	] as Idx[][]);
	const lOnAB = rng.next() < 0.5;
	const wantDecimal = rng.next() < 0.5;
	for (;;) {
		const { p, qq, k } = twoLines(rng, [1, 2, 2, 5], 18);
		const L = mkLine(lOnAB ? AB_SIDE : AC_SIDE, p, qq);
		const O = mkLine(lOnAB ? AC_SIDE : AB_SIDE, p.mul(k), qq.mul(k));
		if (!O.vals[oAsk].isInteger() !== wantDecimal) continue;
		const s = solveProportion(L, O, lKnown, oKnown, oAsk, 'cm');
		const lGiv: [string, Rational][] = lKnown.map((i) => [L.names[i], L.vals[i]]);
		const oGiv: [string, Rational][] = [[O.names[oKnown], O.vals[oKnown]]];
		const givens = lOnAB ? [...lGiv, ...oGiv] : [...oGiv, ...lGiv];
		const ask = oAsk === 2 ? `il lato $${O.names[oAsk]}$` : `$${O.names[oAsk]}$`;
		return {
			case: oAsk === 2 ? 'lato' : 'parte',
			prompt: 'Risolvi il problema.',
			problem: textBlock(
				`Nel triangolo $ABC$ il segmento $DE$ è parallelo a $BC$, con $D$ su $AB$ ed $E$ su $AC$. Sai che ${listGivens(givens, 'cm')}. Trova ${ask}.`,
			),
			solution: s.solution,
			steps: [t('Una parallela a un lato divide gli altri due lati in parti proporzionali'), ...s.steps],
			answer: { kind: 'number', value: s.value, wrong: s.wrong, unit: 'cm' },
			params: { ab: (lOnAB ? L : O).vals.map(String), ac: (lOnAB ? O : L).vals.map(String), known: givens.map((x) => x[0]), asked: O.names[oAsk] },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: an unknown in two segments

const lin = (beta: number) => (beta === 0 ? 'x' : `x ${beta > 0 ? '+' : '-'} ${Math.abs(beta)}`);
const paren = (beta: number) => (beta === 0 ? 'x' : `(${lin(beta)})`);
const linTex = (a: number, b: number) => (b === 0 ? `${a}x` : `${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)}`);

function level3(rng: Rng): Built {
	const ask = rng.pick(['x', 'altro', 'intero'] as const);
	for (;;) {
		const x = rng.int(2, 15);
		const k = rng.int(1, 9);
		const beta = rng.next() < 0.3 ? -k : k;
		const xAt = rng.pick([0, 1] as const);
		const betas: [number, number] = xAt === 0 ? [0, beta] : [beta, 0];
		const e: [number, number] = [x + betas[0], x + betas[1]];
		if (Math.min(...e) < 1) continue;
		const g = gcd(e[0], e[1]);
		const m = rng.int(1, 8);
		const o: [number, number] = [(m * e[0]) / g, (m * e[1]) / g];
		if (o[0] === e[0] && o[1] === e[1]) continue;
		if (Math.max(...o, ...e) > 40 || Math.min(...o) < 2) continue;
		const xOnR = rng.next() < 0.6;
		const XN = xOnR ? R_NAMES : S_NAMES;
		const ON = xOnR ? S_NAMES : R_NAMES;
		const askIdx: Idx = ask === 'x' ? xAt : ask === 'altro' ? ((1 - xAt) as Idx) : 2;
		const value = askIdx === 2 ? e[0] + e[1] : e[askIdx];
		const steps = [
			t('Per il teorema di Talete'),
			`${XN[0]} : ${XN[1]} = ${ON[0]} : ${ON[1]}`,
			`${paren(betas[0])} : ${paren(betas[1])} = ${o[0]} : ${o[1]}`,
			`${o[1]}${paren(betas[0])} = ${o[0]}${paren(betas[1])}`,
			`${linTex(o[1], o[1] * betas[0])} = ${linTex(o[0], o[0] * betas[1])}`,
		];
		let c = o[1] - o[0];
		let d = o[0] * betas[1] - o[1] * betas[0];
		if (c < 0) {
			c = -c;
			d = -d;
		}
		if (d !== c * x) throw new Error(`${ID}: level 3 equation`);
		steps.push(c === 1 ? `x = ${d}` : `${c}x = ${d}`);
		if (c !== 1) steps.push(`x = ${x}`);
		if (askIdx === 2) steps.push(`${bar(XN[2])} = ${e[0]} + ${e[1]} = ${value}`);
		else if (betas[askIdx] !== 0) steps.push(`${bar(XN[askIdx])} = ${x} ${betas[askIdx] > 0 ? '+' : '-'} ${k} = ${value}`);
		else steps.push(`${bar(XN[askIdx])} = ${x}`);
		// Mistakes: x itself, the other segment or a part for the whole, the parentheses dropped, the proportion upside down.
		const segOf = (xx: Rational): Rational => (askIdx === 2 ? xx.mul(q(2)).add(q(betas[0] + betas[1])) : xx.add(q(betas[askIdx])));
		const wrong: Rational[] = [q(x), q(e[0]), q(e[1]), q(e[0] + e[1])];
		if (o[1] !== o[0]) wrong.push(segOf(q(betas[1] - betas[0], o[1] - o[0])));
		if (o[0] !== o[1]) wrong.push(segOf(q(o[1] * betas[1] - o[0] * betas[0], o[0] - o[1])));
		const xl = xOnR ? 'r' : 's';
		const ol = xOnR ? 's' : 'r';
		const askName = XN[askIdx];
		return {
			case: ask,
			prompt: 'Risolvi il problema.',
			problem: textBlock(
				`Un fascio di parallele taglia la trasversale $r$ nei punti $A$, $B$, $C$ e la trasversale $s$ nei punti $A'$, $B'$, $C'$. ` +
					`Su $${xl}$ il segmento $${XN[0]}$ misura $${lin(betas[0])}$ e $${XN[1]}$ misura $${lin(betas[1])}$; ` +
					`su $${ol}$, ${givenTex(ON[0], q(o[0]), '')} ${conj(ON[1])} ${givenTex(ON[1], q(o[1]), '')}. Trova $${askName}$.`,
			),
			solution: `${bar(askName)} = ${value}`,
			steps,
			answer: { kind: 'number', value: q(value), wrong, unit: '' },
			params: { xLine: xl, betas, other: o, x, asked: askName },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the converse

function level5(rng: Rng): Built {
	const kase = weighted(rng, [
		['parallelo', 5],
		['quasi', 3],
		['rovesciato', 2],
	] as [string, number][]);
	for (;;) {
		const u = rng.int(1, 6);
		const v = rng.int(1, 6);
		if (gcd(u, v) !== 1 || (kase === 'rovesciato' && u === v)) continue;
		const s1 = rng.int(1, 6);
		const s2 = rng.int(1, 6);
		if (s1 === s2) continue;
		const ad = s1 * u;
		const db = s1 * v;
		let ae = s2 * u;
		let ec = s2 * v;
		if (kase === 'rovesciato') [ae, ec] = [ec, ae];
		if (kase === 'quasi') {
			// One of AE, EC moved by 1 when it is at least 4: the two ratios differ by at most a third.
			const d = rng.pick([-1, 1]);
			if (rng.next() < 0.5) {
				if (ec < 4) continue;
				ec += d;
			} else {
				if (ae < 4) continue;
				ae += d;
			}
		}
		if (Math.min(ad, db, ae, ec) < 2 || Math.max(ad, db, ae, ec) > 30) continue;
		const par = ad * ec === db * ae;
		if (par !== (kase === 'parallelo')) continue;
		if (kase === 'quasi' && ad * ae === db * ec) continue;
		const whole = rng.next() < 0.35 ? rng.pick(['AB', 'AC'] as const) : null;
		const dGiv = whole === 'AB' ? givenTex('AB', q(ad + db), '') : givenTex('DB', q(db), '');
		const eGiv = whole === 'AC' ? givenTex('AC', q(ae + ec), '') : givenTex('EC', q(ec), '');
		const steps: string[] = [];
		if (whole === 'AB') steps.push(`${bar('DB')} = ${ad + db} - ${ad} = ${db}`);
		if (whole === 'AC') steps.push(`${bar('EC')} = ${ae + ec} - ${ae} = ${ec}`);
		steps.push(t('La proporzione da controllare: ') + `AD : DB = AE : EC${t(', cioè ')}${ad} : ${db} = ${ae} : ${ec}`);
		steps.push(t('Prodotto dei medi: ') + `${db} \\cdot ${ae} = ${db * ae}${t('; prodotto degli estremi: ')}${ad} \\cdot ${ec} = ${ad * ec}`);
		steps.push(
			par
				? t('Sono uguali: la proporzione vale e, per il teorema inverso, ') + 'DE \\parallel BC'
				: t('Sono diversi: la proporzione non vale, quindi ') + `DE${t(' non è parallelo a ')}BC`,
		);
		const yes: ChoiceOption = { latex: `${t('sì, ')}DE \\parallel BC`, values: ['parallelo'] };
		const no: ChoiceOption = { latex: `${t('no, ')}DE \\nparallel BC`, values: ['non parallelo'] };
		const choice = buildChoice(rng, par ? yes : no, [par ? no : yes], () => null, 2);
		return {
			case: kase,
			prompt: 'Rispondi sì o no.',
			problem: textBlock(
				`Nel triangolo $ABC$ il punto $D$ sta su $AB$ con ${givenTex('AD', q(ad), '')} ${conj(whole === 'AB' ? 'AB' : 'DB')} ${dGiv}, ` +
					`il punto $E$ sta su $AC$ con ${givenTex('AE', q(ae), '')} ${conj(whole === 'AC' ? 'AC' : 'EC')} ${eGiv}. Il segmento $DE$ è parallelo a $BC$?`,
			),
			solution: par ? 'DE \\parallel BC' : `DE${t(' non è parallelo a ')}BC`,
			steps,
			answer: { kind: 'choice', choice },
			params: { ad, db, ae, ec, whole, parallel: par },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: the angle bisector theorem

const seg = (a: string, b: string) => [a, b].sort().join('');

function level6(rng: Rng): Built {
	for (;;) {
		const V = rng.pick(['A', 'B', 'C']);
		const [X, Y] = ['A', 'B', 'C'].filter((c) => c !== V);
		const sx = rng.int(3, 20); // VX
		const sy = rng.int(3, 20); // VY
		if (sx === sy) continue;
		const a = rng.int(Math.abs(sx - sy) + 1, Math.min(sx + sy - 1, 30));
		const xd = q(a * sx, sx + sy);
		if (!nice(xd, 1)) continue;
		const dy = q(a).sub(xd);
		const askX = rng.next() < 0.5;
		const ask = askX ? `${X}D` : `D${Y}`;
		const other = askX ? `D${Y}` : `${X}D`;
		const adj = askX ? sx : sy;
		const non = askX ? sy : sx;
		const value = askX ? xd : dy;
		const sides: Record<string, number> = { [seg(V, X)]: sx, [seg(V, Y)]: sy, [seg(X, Y)]: a };
		const givens: [string, Rational][] = ['AB', 'AC', 'BC'].map((n) => [n, q(sides[n])]);
		const steps = [
			t('Chiama ') + `x${t(' la misura di ')}${ask}${t(': allora ')}${bar(other)} = ${a} - x`,
			t('Per il teorema della bisettrice ') + `${ask} : ${other} = ${seg(V, askX ? X : Y)} : ${seg(V, askX ? Y : X)}`,
			`x : (${a} - x) = ${adj} : ${non}`,
			`${non}x = ${adj}(${a} - x)`,
			`${non}x = ${adj * a} - ${adj}x`,
			`${adj + non}x = ${adj * a}`,
			value.isInteger() ? `x = ${value.num}` : `x = ${adj * a} : ${adj + non} = ${numTex(value)}`,
		];
		// Mistakes: the other part (the long part next to the short side), the midpoint, x : BC = AB : AC.
		const wrong = [askX ? dy : xd, q(a, 2), q(a * adj, non)].filter((w) => w.compare(q(a)) < 0);
		return {
			case: adj > non ? 'parte lunga' : 'parte corta',
			prompt: 'Risolvi il problema.',
			problem: textBlock(
				`Nel triangolo $ABC$ i lati misurano ${listGivens(givens, 'cm')}. La bisettrice dell'angolo $${hat(V)}$ incontra $${X}${Y}$ in $D$. Trova $${ask}$.`,
			),
			solution: `${bar(ask)} = ${withUnit(value, 'cm')}`,
			steps,
			answer: { kind: 'number', value, wrong, unit: 'cm' },
			params: { vertex: V, sides, asked: ask },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 7: the midpoint segment

/** Three distinct integer sides of a proper triangle: [AB, AC, BC]. */
function scalene(rng: Rng, lo: number, hi: number): [number, number, number] {
	for (;;) {
		const s = [rng.int(lo, hi), rng.int(lo, hi), rng.int(lo, hi)];
		if (new Set(s).size < 3) continue;
		const [x, y, z] = [...s].sort((u, v) => u - v);
		if (x + y <= z) continue;
		return s as [number, number, number];
	}
}

/** Midpoints: M of AB, N of AC, P of BC. Each pair and the side it is parallel to. */
const MID_PAIRS: { pair: string; sides: [string, string]; third: string }[] = [
	{ pair: 'MN', sides: ['AB', 'AC'], third: 'BC' },
	{ pair: 'NP', sides: ['AC', 'BC'], third: 'AB' },
	{ pair: 'MP', sides: ['AB', 'BC'], third: 'AC' },
];

function level7(rng: Rng): Built {
	const kase = rng.pick(['lato', 'inverso', 'perimetro'] as const);
	const mp = rng.pick(MID_PAIRS);
	const midText = `I punti $${mp.pair[0]}$ e $${mp.pair[1]}$ sono i punti medi di $${mp.sides[0]}$ e $${mp.sides[1]}$`;
	const theorem = (pair: string, third: string) =>
		t('Il segmento ') + `${pair}${t(' unisce i punti medi di due lati: è parallelo a ')}${third}${t(' ed è la sua metà')}`;
	if (kase === 'inverso') {
		const side = q(rng.int(3, 40));
		const v = side.mul(q(1, 2));
		return {
			case: kase,
			prompt: 'Risolvi il problema.',
			problem: textBlock(`Nel triangolo $ABC$ i punti $${mp.pair[0]}$ e $${mp.pair[1]}$ sono i punti medi di $${mp.sides[0]}$ e $${mp.sides[1]}$, e ${givenTex(mp.pair, v, 'cm')}. Trova $${mp.third}$.`),
			solution: `${bar(mp.third)} = ${withUnit(side, 'cm')}`,
			steps: [theorem(mp.pair, mp.third), `${bar(mp.third)} = 2 \\cdot ${numTex(v)} = ${withUnit(side, 'cm')}`],
			answer: { kind: 'number', value: side, wrong: [v.mul(q(1, 2)), v, v.mul(q(4)), v.mul(q(3))], unit: 'cm' },
			params: { pair: mp.pair, given: v.toString() },
		};
	}
	const [ab, ac, bc] = scalene(rng, 4, 30);
	const S: Record<string, number> = { AB: ab, AC: ac, BC: bc };
	const givens: [string, Rational][] = ['AB', 'AC', 'BC'].map((n) => [n, q(S[n])]);
	if (kase === 'lato') {
		const value = q(S[mp.third], 2);
		const others = mp.sides.map((n) => q(S[n], 2));
		return {
			case: kase,
			prompt: 'Risolvi il problema.',
			problem: textBlock(`Nel triangolo $ABC$ i lati misurano ${listGivens(givens, 'cm')}. ${midText}. Trova $${mp.pair}$.`),
			solution: `${bar(mp.pair)} = ${withUnit(value, 'cm')}`,
			steps: [theorem(mp.pair, mp.third), `${bar(mp.pair)} = ${S[mp.third]} : 2 = ${withUnit(value, 'cm')}`],
			answer: { kind: 'number', value, wrong: [q(S[mp.third]), ...others, q(S[mp.third] * 2)], unit: 'cm' },
			params: { sides: S, pair: mp.pair },
		};
	}
	const per = q(ab + ac + bc);
	const value = per.mul(q(1, 2));
	const half = (n: string) => q(S[n], 2);
	return {
		case: kase,
		prompt: 'Risolvi il problema.',
		problem: textBlock(
			`Il triangolo $ABC$ ha ${listGivens(givens, 'cm')}; $M$, $N$ e $P$ sono i punti medi di $AB$, $AC$ e $BC$. Trova il perimetro del triangolo $MNP$.`,
		),
		solution: `${t('perimetro di ')}MNP = ${withUnit(value, 'cm')}`,
		steps: [
			t('Ogni lato di ') + `MNP${t(' unisce i punti medi di due lati di ')}ABC${t(': è la metà del terzo lato')}`,
			`${bar('MN')} = ${bc} : 2 = ${numTex(half('BC'))}${t(', ')}${bar('NP')} = ${ab} : 2 = ${numTex(half('AB'))}${t(', ')}${bar('MP')} = ${ac} : 2 = ${numTex(half('AC'))}`,
			`${t('perimetro di ')}MNP = ${numTex(half('BC'))} + ${numTex(half('AB'))} + ${numTex(half('AC'))} = ${withUnit(value, 'cm')}`,
		],
		answer: { kind: 'number', value, wrong: [per, per.mul(q(1, 4)), per.mul(q(2)), per.mul(q(1, 3))], unit: 'cm' },
		params: { sides: S },
	};
}

// ---------------------------------------------------------------------------
// Level 8: division into proportional parts

const ORD = ['primo', 'secondo', 'terzo'];

function level8(rng: Rng): Built {
	if (rng.next() < 0.5) {
		for (;;) {
			const f = [5 * rng.int(2, 16), 5 * rng.int(2, 16), 5 * rng.int(2, 16)];
			if (new Set(f).size < 3) continue;
			const T = f[0] + f[1] + f[2];
			const k = q(rng.int(1, 20), rng.pick([1, 2, 4, 5, 10]));
			if (k.isOne() || k.compare(q(1, 2)) < 0 || k.compare(q(2)) > 0) continue;
			const Sv = k.mul(q(T));
			if (!Sv.isInteger() || Sv.num > 400) continue;
			const i = rng.int(0, 2);
			const value = k.mul(q(f[i]));
			if (!nice(value, 1)) continue;
			const fi = q(f[i]);
			return {
				case: 'lotti',
				prompt: 'Risolvi il problema.',
				problem: textBlock(
					`Tre lotti di terreno stanno tra due strade rettilinee $r$ e $s$, e i confini tra un lotto e l'altro sono paralleli. ` +
						`Sulla strada $r$ i lotti hanno i fronti di $${f[0]}$ m, $${f[1]}$ m e $${f[2]}$ m; sulla strada $s$ i tre fronti insieme misurano $${Sv.num}$ m. ` +
						`Trova il fronte del ${ORD[i]} lotto sulla strada $s$.`,
				),
				solution: `x = ${withUnit(value, 'm')}`,
				steps: [
					t('I confini sono un fascio di parallele e le strade sono trasversali: su ') + `r${t(' i fronti insieme misurano ')}${f[0]} + ${f[1]} + ${f[2]} = ${T}${t(' m')}`,
					t('Chiama ') + `x${t(' il fronte cercato. Il rapporto tra un fronte su ')}s${t(' e quello su ')}r${t(' è lo stesso per tutti: ')}x : ${f[i]} = ${Sv.num} : ${T}`,
					`x = \\frac{${f[i]} \\cdot ${Sv.num}}{${T}} = ${withUnit(value, 'm')}`,
				],
				// Mistakes: equal parts, the same difference added to each lot, the ratio upside down, the front unchanged.
				answer: { kind: 'number', value, wrong: [Sv.mul(q(1, 3)), fi.add(Sv.sub(q(T)).mul(q(1, 3))), fi.mul(q(T)).div(Sv), fi], unit: 'm' },
				params: { fronts: f, total: Sv.num, lot: i + 1 },
			};
		}
	}
	for (;;) {
		const bd = rng.int(2, 15);
		const dc = rng.int(2, 15);
		if (bd === dc) continue;
		const a = bd + dc;
		const k = q(rng.int(3, 12), rng.pick([1, 2]));
		if (k.compare(q(1)) <= 0 || k.compare(q(3)) > 0) continue;
		const ab = k.mul(q(bd));
		const ac = k.mul(q(dc));
		if (!nice(ab, 1) || !nice(ac, 1)) continue;
		if (ab.sub(ac).abs().compare(q(a)) >= 0) continue;
		const per = ab.add(ac).add(q(a));
		if (!per.isInteger() || per.num > 100) continue;
		const askAB = rng.next() < 0.5;
		const sum = per.sub(q(a));
		const part = askAB ? bd : dc;
		const value = askAB ? ab : ac;
		const name = askAB ? 'AB' : 'AC';
		return {
			case: 'bisettrice',
			prompt: 'Risolvi il problema.',
			problem: textBlock(
				`Il triangolo $ABC$ ha perimetro $${per.num}$ cm. La bisettrice dell'angolo $${hat('A')}$ divide il lato $BC$ in ${givenTex('BD', q(bd), 'cm')} e ${givenTex('DC', q(dc), 'cm')}. Trova $${name}$.`,
			),
			solution: `${bar(name)} = ${withUnit(value, 'cm')}`,
			steps: [
				`${bar('BC')} = ${bd} + ${dc} = ${a}${t(' cm')}`,
				`${bar('AB')} + ${bar('AC')} = ${per.num} - ${a} = ${withUnit(sum, 'cm')}`,
				t('Per il teorema della bisettrice ') + `AB : AC = BD : DC = ${bd} : ${dc}`,
				t('Per la proprietà del comporre ') + `${numTex(sum)} : ${bar(name)} = ${a} : ${part}`,
				`${bar(name)} = ${numTex(sum)} \\cdot ${part} : ${a} = ${withUnit(value, 'cm')}`,
			],
			// Mistakes: equal parts, the other side, the whole perimeter divided, the ratio of the parts upside down.
			answer: { kind: 'number', value, wrong: [sum.mul(q(1, 2)), askAB ? ac : ab, per.mul(q(part, a)), sum.mul(q(part, askAB ? dc : bd))], unit: 'cm' },
			params: { perimeter: per.num, bd, dc, asked: name },
		};
	}
}

// ---------------------------------------------------------------------------

function build(rng: Rng, level: number): Built {
	switch (level) {
		case 1:
			return level1(rng);
		case 2:
			return level2(rng);
		case 3:
			return level3(rng);
		case 4:
			return level4(rng);
		case 5:
			return level5(rng);
		case 6:
			return level6(rng);
		case 7:
			return level7(rng);
		case 8:
			return level8(rng);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

const numberOption = (r: Rational, unit: Unit): ChoiceOption => ({ latex: withUnit(r, unit), values: [r.toString()] });

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const lvl = sample.level;
	if (!sample.steps.length) v.push('nessun passaggio');
	if (/—|piuttosto che/.test(sample.problem + sample.steps.join(' '))) v.push('trattino lungo o "piuttosto che"');
	if (lvl === 5) {
		const a = sample.answer;
		if (a.kind !== 'choice' || a.options.length !== 2) return ['servono due opzioni'];
		const par = (p.ad as number) * (p.ec as number) === (p.db as number) * (p.ae as number);
		if (par !== p.parallel) v.push('parallelismo sbagliato');
		if (a.options[a.correct].values[0] !== (par ? 'parallelo' : 'non parallelo')) v.push('opzione giusta sbagliata');
		return v;
	}
	if (sample.answer.kind !== 'number') return ['risposta non numerica'];
	const value = R(sample.answer.value);
	if (!nice(value, 1)) v.push(`risposta ${value} non decimale a una cifra`);
	if (lvl === 1 && !value.isInteger()) v.push('livello 1 con risposta non intera');
	if (lvl === 1 || lvl === 2) {
		const r = (p.r as string[]).map(R);
		const s = (p.s as string[]).map(R);
		if (r[0].mul(s[1]).compare(r[1].mul(s[0])) !== 0) v.push('segmenti non proporzionali');
		if (r[0].equals(r[1])) v.push('segmenti congruenti su r');
		if (r[0].equals(s[0])) v.push('rapporto 1 tra le trasversali');
	}
	if (lvl === 4) {
		const ab = (p.ab as string[]).map(R);
		const ac = (p.ac as string[]).map(R);
		if (ab[0].mul(ac[1]).compare(ab[1].mul(ac[0])) !== 0) v.push('DE non parallelo a BC');
	}
	if (lvl === 6) {
		const S = p.sides as Record<string, number>;
		const [x, y, z] = [S.AB, S.AC, S.BC].sort((m, n) => m - n);
		if (x + y <= z) v.push('triangolo inesistente');
		const V = p.vertex as string;
		const others = ['A', 'B', 'C'].filter((c) => c !== V);
		if (S[seg(V, others[0])] === S[seg(V, others[1])]) v.push('triangolo isoscele sulla base');
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const value = R((sample.answer as { value: string }).value);
	const unit = sample.params.unit as Unit;
	const wrong = ((sample.params.wrong as string[]) ?? []).map(R);
	const step = value.isInteger() ? q(1) : q(1, 2);
	const fallback = (i: number) => {
		const k = Math.floor(i / 2) + 1;
		const w = value.add(step.mul(q(i % 2 ? -k : k)));
		return w.sign() > 0 ? numberOption(w, unit) : null;
	};
	return buildChoice(
		rng,
		numberOption(value, unit),
		wrong.filter((w) => !w.equals(value) && nice(w, 1)).map((w) => numberOption(w, unit)),
		fallback,
	);
}

export const teoremaDiTalete: Generator = {
	id: ID,
	title: 'Teorema di Talete',
	levels: {
		1: { label: 'Il quarto segmento', constraints: ['tre parallele, AB e BC dati su r, una parte su s', 'misure intere fino a 40 cm, risposta intera'] },
		2: { label: 'Il segmento intero e i decimali', constraints: ['un segmento intero (AC o A\'C\') tra i dati o chiesto', "metà con l'incognita su r, metà su s", 'dati e risposta con al più un decimale'] },
		3: { label: "Un'incognita in due segmenti", constraints: ['x e x + k (o x - k) su una trasversale, due numeri interi sull\'altra', 'chiesto il segmento x, l\'altro o l\'intero'] },
		4: { label: 'Una parallela a un lato del triangolo', constraints: ['DE parallelo a BC, tre dati sui lati AB e AC', 'chiesta una parte o un lato intero'] },
		5: { label: 'Il teorema inverso', constraints: ['quattro misure intere, sì o no', 'metà parallelo, il resto quasi proporzione o proporzione rovesciata'] },
		6: { label: 'Il teorema della bisettrice', constraints: ['tre lati interi, triangolo non isoscele sulla base', 'parti con al più un decimale'] },
		7: { label: 'Il segmento dei punti medi', constraints: ['un lato del triangolo dei punti medi, il lato dal segmento, o il perimetro'] },
		8: { label: 'Parti proporzionali', constraints: ['tre lotti tra due strade, o la bisettrice con il perimetro'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 1000; attempt++) {
			const b = build(rng, level);
			const answer = b.answer;
			const sample: Sample = {
				generatorId: ID,
				level,
				seed: rng.seed,
				prompt: b.prompt,
				problem: b.problem,
				solution: b.solution,
				steps: b.steps,
				answer: answer.kind === 'choice' ? answer.choice : { kind: 'number', value: answer.value.toString() },
				params: { case: b.case, ...b.params },
			};
			if (answer.kind === 'number') {
				sample.params.unit = answer.unit;
				sample.params.wrong = answer.wrong.filter((w) => !w.equals(answer.value) && w.sign() > 0).map((w) => w.toString());
			}
			if (check(sample).length > 0) continue;
			try {
				toChoice(sample, rng);
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

export default teoremaDiTalete;
