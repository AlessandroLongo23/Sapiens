/**
 * Ellisse (lesson 118, slug ellisse). Spec: specs/exercises/ellisse.md
 *
 * Seven levels in the order of the lesson: the semi-axes from the canonical equation; the foci; an equation to
 * bring to the canonical form; the eccentricity; the position of a line; the tangent at a point of the ellipse
 * (formula di sdoppiamento); the ellipse from two conditions. Every exercise starts from the answer (the
 * semi-axes, the point of contact, the value of q that makes the line tangent) and builds the ellipse from it.
 */
import type { ChoiceOption, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { poly, polyToLatex } from '../latex';
import { type Axis, type Built, assemble, axisOption, choiceOf, conicLatex, fixedChoice, implicitLatex, lineLatex, onAxis, other, pair, quadLatex, rootLatex, t } from '../ellisse-iperbole';

export const ID = 'ellisse';

const sq = (n: number) => n * n;
const axisOf = (A: number, B: number): Axis => (A > B ? 'x' : 'y');
const isSquare = (n: number) => Number.isInteger(Math.sqrt(n));

/** The steps from the denominators to the foci, shared by levels 2 and 3. */
function fociSteps(A: number, B: number): string[] {
	const axis = axisOf(A, B);
	const [big, small] = A > B ? [A, B] : [B, A];
	const c2 = big - small;
	const steps = [
		`${t('I denominatori sono ')} a^2 = ${A} ${t(' e ')} b^2 = ${B}${t(`: il più grande è sotto `)} ${axis}^2${t(', quindi i fuochi stanno sull\'asse ')} ${axis}`,
		`c^2 = ${big} - ${small} = ${c2}${t(', quindi ')} c = ${isSquare(c2) || rootLatex(c2) === `\\sqrt{${c2}}` ? rootLatex(c2) : `\\sqrt{${c2}} = ${rootLatex(c2)}`}`,
		`${t('I fuochi sono ')} F${onAxis(axis, c2)}`,
	];
	return steps;
}

// ---------------------------------------------------------------------------
// Level 1: the semi-axes

function level1(rng: Rng): Built {
	const a = rng.int(2, 9);
	let b = rng.int(2, 9);
	while (b === a) b = rng.int(2, 9);
	const [A, B] = [sq(a), sq(b)];
	const opt = (x: number, y: number): ChoiceOption => ({ latex: `a = ${x},\\ b = ${y}`, values: [String(x), String(y)] });
	const answer = choiceOf(ID, rng, opt(a, b), [opt(A, B), opt(b, a), opt(B, A)]);
	const axis = axisOf(A, B);
	return {
		prompt: "Trova i semiassi a e b dell'ellisse.",
		problem: conicLatex(A, B),
		solution: `a = ${a},\\ b = ${b}`,
		steps: [
			`${t('I denominatori sono i quadrati dei semiassi: ')} a^2 = ${A},\\ b^2 = ${B}`,
			`a = \\sqrt{${A}} = ${a},\\quad b = \\sqrt{${B}} = ${b}`,
			`${t(`Il semiasse più lungo è `)} ${axis === 'x' ? 'a' : 'b'}${t(`: l'asse maggiore sta sull'asse `)} ${axis} ${t(' ed è lungo ')} ${2 * Math.max(a, b)}`,
		],
		answer,
		params: { case: `asse ${axis}`, A, B },
	};
}

// ---------------------------------------------------------------------------
// Levels 2 and 3: the foci

function fociChoice(rng: Rng, A: number, B: number, extra: ChoiceOption[] = []) {
	const axis = axisOf(A, B);
	const c2 = Math.abs(A - B);
	return choiceOf(ID, rng, axisOption('F', axis, c2), [...extra, axisOption('F', other(axis), c2), axisOption('F', axis, A + B), axisOption('F', axis, c2 * c2), axisOption('F', other(axis), A + B)]);
}

function level2(rng: Rng): Built {
	const a = rng.int(2, 9);
	let b = rng.int(2, 9);
	while (b === a) b = rng.int(2, 9);
	const [A, B] = [sq(a), sq(b)];
	const axis = axisOf(A, B);
	return {
		prompt: "Trova i fuochi dell'ellisse.",
		problem: conicLatex(A, B),
		solution: `F${onAxis(axis, Math.abs(A - B))}`,
		steps: fociSteps(A, B),
		answer: fociChoice(rng, A, B),
		params: { case: `asse ${axis}`, A, B },
	};
}

function level3(rng: Rng): Built {
	for (;;) {
		const a = rng.int(1, 6);
		const b = rng.int(1, 6);
		if (a === b) continue;
		const [A, B] = [sq(a), sq(b)];
		const g = gcd(A, B);
		const [p, k, r] = [B / g, A / g, (A * B) / g];
		const axis = axisOf(A, B);
		// the mistake of reading the coefficients as the denominators: the larger coefficient is taken as a^2
		const wrong = [axisOption('F', other(axis), Math.abs(p - k)), axisOption('F', axis, Math.abs(p - k))];
		return {
			prompt: "Trova i fuochi dell'ellisse.",
			problem: quadLatex(p, k, r),
			solution: `F${onAxis(axis, Math.abs(A - B))}`,
			steps: [`${t(`Nella forma canonica il secondo membro è 1: dividi tutto per ${r}.`)}`, conicLatex(A, B), ...fociSteps(A, B)],
			answer: fociChoice(rng, A, B, wrong),
			params: { case: `asse ${axis}`, p, q: k, r, A, B },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the eccentricity

/** [semi-major axis, semi-minor axis, c], all integers. */
const TRIPLES: [number, number, number][] = [
	[5, 3, 4],
	[5, 4, 3],
	[10, 6, 8],
	[10, 8, 6],
	[13, 5, 12],
	[13, 12, 5],
	[15, 9, 12],
	[15, 12, 9],
	[17, 8, 15],
	[17, 15, 8],
];

function level4(rng: Rng): Built {
	const [M, n, c] = rng.pick(TRIPLES);
	const axis: Axis = rng.next() < 0.5 ? 'x' : 'y';
	const [A, B] = axis === 'x' ? [sq(M), sq(n)] : [sq(n), sq(M)];
	const e = q(c, M);
	const num = (r: Rational): ChoiceOption => ({ latex: r.toLatex(), values: [r.toString()] });
	const choice = choiceOf(ID, rng, num(e), [num(q(c, n)), num(q(n, M)), num(q(M, c)), num(e.mul(e)), num(q(n, c))]);
	const major = axis === 'x' ? 'a' : 'b';
	return {
		prompt: "Calcola l'eccentricità dell'ellisse.",
		problem: conicLatex(A, B),
		solution: `e = ${e.toLatex()}`,
		steps: [
			`a^2 = ${A},\\ b^2 = ${B}${t(': il semiasse maggiore è ')} ${major} = ${M}${t(", e i fuochi stanno sull'asse ")} ${axis}`,
			`c = \\sqrt{${sq(M)} - ${sq(n)}} = \\sqrt{${sq(c)}} = ${c}`,
			`e = \\frac{c}{${major}} = ${c % M === 0 || gcd(c, M) === 1 ? e.toLatex() : `\\frac{${c}}{${M}} = ${e.toLatex()}`}`,
		],
		answer: { kind: 'number', value: e.toString() },
		choice,
		params: { case: `asse ${axis}`, A, B },
	};
}

// ---------------------------------------------------------------------------
// Level 5: a line and the ellipse

const POSITIONS = ['secante', 'tangente', 'esterna'] as const;
type Position = (typeof POSITIONS)[number];
const positionOptions = (): ChoiceOption[] => POSITIONS.map((k) => ({ latex: t(k), values: [k] }));

function level5(rng: Rng): Built {
	const kind: Position = POSITIONS[rng.int(0, 2)];
	for (;;) {
		const m = rng.pick([1, -1, 1, -1, 2, -2]);
		const tt = rng.int(3, 9);
		const A = rng.int(2, 30);
		const B = tt * tt - A * m * m;
		if (B < 2 || B > 40 || B === A) continue;
		const s = rng.next() < 0.5 ? -1 : 1;
		const k = s * (kind === 'tangente' ? tt : kind === 'secante' ? rng.int(1, tt - 1) : rng.int(tt + 1, tt + 3));
		const L = lcm(A, B);
		const [u, v] = [L / A, L / B];
		let [P, Q, R] = [u + v * m * m, 2 * v * m * k, v * k * k - L];
		const line = polyToLatex(poly(k, m));
		const co = (n: number) => (n === 1 ? '' : String(n));
		const steps = [
			`${t(`Moltiplica l'equazione dell'ellisse per ${L}: `)} ${quadLatex(u, v, L)}`,
			`${t('Sostituisci ')} y = ${line}${t(': ')} ${co(u)}x^2 + ${co(v)}(${line})^2 = ${L}`,
			`${t('Svolgi i conti e ordina: ')} ${polyToLatex(poly(R, Q, P))} = 0`,
		];
		const g = gcd(gcd(P, Math.abs(Q)), Math.abs(R));
		if (g > 1) {
			[P, Q, R] = [P / g, Q / g, R / g];
			steps.push(`${t(`Dividi per ${g}: `)} ${polyToLatex(poly(R, Q, P))} = 0`);
		}
		const delta = Q * Q - 4 * P * R;
		if (!Number.isSafeInteger(delta) || Math.abs(Q) > 400 || Math.abs(R) > 2000) continue;
		steps.push(`\\Delta = ${Q < 0 ? `(${Q})` : Q}^2 - 4 \\cdot ${P} \\cdot ${R < 0 ? `(${R})` : R} = ${delta}`);
		if (kind === 'secante') steps.push(`\\Delta > 0${t(': la retta ha due punti in comune con l\'ellisse, è secante.')}`);
		else if (kind === 'esterna') steps.push(`\\Delta < 0${t(': la retta non ha punti in comune con l\'ellisse, è esterna.')}`);
		else {
			const x0 = q(-Q, 2 * P);
			const y0 = q(m).mul(x0).add(q(k));
			steps.push(`\\Delta = 0${t(': la retta è tangente, e tocca l\'ellisse nel punto ')} ${pair(x0, y0)}`);
		}
		return {
			prompt: "Stabilisci la posizione della retta rispetto all'ellisse.",
			problem: `${conicLatex(A, B)} \\qquad ${lineLatex(q(m), q(k))}`,
			solution: t(kind),
			steps,
			answer: fixedChoice(positionOptions(), kind),
			params: { case: kind, A, B, m, q: k },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: the tangent at a point of the ellipse

/** Ellipses x^2/A + y^2/B = 1 with a point of positive integer coordinates: [A, B, x0, y0]. */
const WITH_POINT: [number, number, number, number][] = [];
for (let A = 2; A <= 60; A++) for (let B = 2; B <= 60; B++) if (A !== B) for (let x = 1; x <= 7; x++) for (let y = 1; y <= 7; y++) if (B * x * x + A * y * y === A * B) WITH_POINT.push([A, B, x, y]);

/** The line p x + q y = r with integer coefficients, reduced, r > 0 (or p > 0 when r = 0). */
function reduced(p: number, k: number, r: number): [number, number, number] {
	const g = gcd(gcd(Math.abs(p), Math.abs(k)), Math.abs(r)) || 1;
	const s = r < 0 || (r === 0 && p < 0) ? -1 : 1;
	return [(s * p) / g, (s * k) / g, (s * r) / g];
}

const lineOption = (p: number, k: number, r: number): ChoiceOption => {
	const [a, b, c] = reduced(p, k, r);
	return { latex: implicitLatex(a, b, c), values: [String(a), String(b), String(c)] };
};

function level6(rng: Rng): Built {
	const [A, B, ax, ay] = rng.pick(WITH_POINT);
	const x0 = ax * (rng.next() < 0.5 ? -1 : 1);
	const y0 = ay * (rng.next() < 0.5 ? -1 : 1);
	const correct = lineOption(B * x0, A * y0, A * B);
	const answer = choiceOf(ID, rng, correct, [lineOption(x0, y0, 1), ...[lineOption(A * x0, B * y0, A * B), lineOption(B * x0, -A * y0, A * B), lineOption(B * x0 * x0, A * y0 * y0, A * B)]]);
	const fr = (n: number, d: number) => q(n, d).toLatex();
	const xt = `\\frac{${x0 < 0 ? `(${x0})` : x0} \\cdot x}{${A}}`;
	const yt = `\\frac{${y0 < 0 ? `(${y0})` : y0} \\cdot y}{${B}}`;
	return {
		prompt: "Scrivi l'equazione della tangente all'ellisse nel suo punto P.",
		problem: `${conicLatex(A, B)} \\qquad P(${x0}, ${y0})`,
		solution: correct.latex,
		steps: [
			`${t('Il punto sta sull\'ellisse: ')} \\frac{${x0 * x0}}{${A}} + \\frac{${y0 * y0}}{${B}} = ${fr(x0 * x0, A)} + ${fr(y0 * y0, B)} = 1`,
			`${t('Formula di sdoppiamento, con ')} x_0 = ${x0} ${t(' e ')} y_0 = ${y0}${t(': ')} ${xt} + ${yt} = 1`,
			`${t(`Moltiplica per ${lcm(A, B)} e semplifica: `)} ${correct.latex}`,
		],
		answer,
		params: { case: 'tangente', A, B, x0, y0 },
	};
}

// ---------------------------------------------------------------------------
// Level 7: the ellipse from two conditions

function level7(rng: Rng): Built {
	const withE = rng.next() < 0.5;
	const axis: Axis = rng.next() < 0.5 ? 'x' : 'y';
	const M = rng.int(3, 9);
	const c = rng.int(1, M - 1);
	const [M2, n2, c2] = [sq(M), sq(M) - sq(c), sq(c)];
	const oriented = (major: number, minor: number): [number, number] => (axis === 'x' ? [major, minor] : [minor, major]);
	const opt = ([A, B]: [number, number]): ChoiceOption => ({ latex: conicLatex(A, B), values: [String(A), String(B)] });
	const right = oriented(M2, n2);
	const answer = choiceOf(ID, rng, opt(right), [opt(oriented(M2, M2 + c2)), opt([right[1], right[0]]), opt(oriented(M2, c2)), opt(oriented(M2 + c2, M2)), opt(oriented(n2, c2))].filter((o) => o.values[0] !== o.values[1]));
	const [major, minor] = axis === 'x' ? ['a', 'b'] : ['b', 'a'];
	const vertex = axis === 'x' ? `A_2(${M}, 0)` : `B_2(0, ${M})`;
	const e = q(c, M);
	const steps = [`${t(`I fuochi sono sull'asse `)} ${axis}${t(': il semiasse maggiore è ')} ${major}${t(', e il vertice dà ')} ${major} = ${M}`];
	if (withE) steps.push(`${t('Dall\'eccentricità: ')} c = e \\cdot ${major} = ${e.toLatex()} \\cdot ${M} = ${c}`);
	else steps.push(`${t('I fuochi danno ')} c = ${c}`);
	steps.push(`${minor}^2 = ${major}^2 - c^2 = ${M2} - ${c2} = ${n2}`, `${t("L'ellisse è ")} ${conicLatex(...right)}`);
	return {
		prompt: withE ? `Trova l'equazione dell'ellisse con il centro nell'origine e i fuochi sull'asse ${axis}, che ha il vertice e l'eccentricità indicati.` : "Trova l'equazione dell'ellisse con il centro nell'origine che ha i fuochi e il vertice indicati.",
		problem: withE ? `${vertex} \\qquad e = ${e.toLatex()}` : `F${onAxis(axis, c2)} \\qquad ${vertex}`,
		solution: conicLatex(...right),
		steps,
		answer,
		params: { case: withE ? 'eccentricità' : 'fuochi', axis, M, c },
	};
}

// ---------------------------------------------------------------------------
// Checks

function check(s: Sample): string[] {
	const v: string[] = [];
	const p = s.params as Record<string, number | string>;
	const ch = s.answer.kind === 'choice' ? s.answer : s.choice;
	const right = ch?.options[ch.correct]?.values.join('|');
	const [A, B] = [Number(p.A), Number(p.B)];
	switch (s.level) {
		case 1:
			if (right !== `${Math.sqrt(A)}|${Math.sqrt(B)}`) v.push('semiassi sbagliati');
			break;
		case 2:
		case 3:
			if (A === B || right !== `${axisOf(A, B)}|${Math.abs(A - B)}`) v.push('fuochi sbagliati');
			break;
		case 4: {
			const M = Math.sqrt(Math.max(A, B));
			const c = Math.sqrt(Math.abs(A - B));
			if (s.answer.kind !== 'number' || s.answer.value !== q(c, M).toString() || right !== q(c, M).toString()) v.push('eccentricità sbagliata');
			break;
		}
		case 5: {
			const d = A * sq(Number(p.m)) + B - sq(Number(p.q));
			const pos = d > 0 ? 'secante' : d === 0 ? 'tangente' : 'esterna';
			if (right !== pos || p.case !== pos) v.push('posizione sbagliata');
			break;
		}
		case 6: {
			const [x0, y0] = [Number(p.x0), Number(p.y0)];
			if (B * x0 * x0 + A * y0 * y0 !== A * B) v.push("il punto non sta sull'ellisse");
			if (right !== reduced(B * x0, A * y0, A * B).join('|')) v.push('tangente sbagliata');
			break;
		}
		case 7: {
			const [M2, n2] = [sq(Number(p.M)), sq(Number(p.M)) - sq(Number(p.c))];
			if (right !== (p.axis === 'x' ? `${M2}|${n2}` : `${n2}|${M2}`)) v.push('equazione sbagliata');
			break;
		}
		default:
			v.push(`livello sconosciuto ${s.level}`);
	}
	return v;
}

export const ellisse = assemble(
	ID,
	'Ellisse',
	{
		1: { label: "Semiassi dall'equazione canonica", constraints: ['a e b interi distinti tra 2 e 9', 'distrattori: i denominatori presi come semiassi, i semiassi scambiati'] },
		2: { label: 'Fuochi', constraints: ['a e b interi distinti tra 2 e 9, c anche irrazionale, scritto con il radicale semplificato', "metà circa con i fuochi sull'asse y"] },
		3: { label: 'Equazione da portare in forma canonica', constraints: ['px^2 + qy^2 = r con coefficienti interi primi tra loro', 'a e b interi distinti tra 1 e 6'] },
		4: { label: 'Eccentricità', constraints: ['semiassi e c interi (terne pitagoriche)', "metà con i fuochi sull'asse y: si divide per il semiasse maggiore"] },
		5: { label: 'Posizione di una retta', constraints: ['secante, tangente, esterna: un terzo ciascuna', 'retta y = mx + q con m in {±1, ±2}'] },
		6: { label: "Tangente in un punto dell'ellisse", constraints: ['punto con coordinate intere non nulle', 'risposta nella forma px + qy = r con coefficienti interi primi tra loro'] },
		7: { label: "Equazione dell'ellisse da due condizioni", constraints: ['metà fuochi e vertice, metà vertice ed eccentricità', "metà con i fuochi sull'asse y"] },
	},
	{ 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 },
	check,
);

export default ellisse;
