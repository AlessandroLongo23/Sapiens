/**
 * Iperbole (lesson 119, slug iperbole). Spec: specs/exercises/iperbole.md
 *
 * Seven levels in the order of the lesson: the real vertices; the foci; the asymptotes; an equation to bring to
 * the canonical form; the eccentricity; the position of a line, with the lines parallel to an asymptote; the
 * hyperbola from two conditions. The foci are on the x axis when the second member is 1 and on the y axis when
 * it is -1, with a always under x^2, as in the lesson.
 */
import type { ChoiceOption, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { poly, polyToLatex } from '../latex';
import { type Axis, type Built, assemble, axisOption, choiceOf, conicLatex, fixedChoice, lineLatex, onAxis, other, pair, quadLatex, rootLatex, t } from '../ellisse-iperbole';

export const ID = 'iperbole';

const sq = (n: number) => n * n;
const axisOf = (rhs: number): Axis => (rhs === 1 ? 'x' : 'y');
const pickRhs = (rng: Rng): 1 | -1 => (rng.next() < 0.5 ? 1 : -1);

function distinctPair(rng: Rng, lo: number, hi: number): [number, number] {
	const a = rng.int(lo, hi);
	let b = rng.int(lo, hi);
	while (b === a) b = rng.int(lo, hi);
	return [a, b];
}

const axisStep = (rhs: number) => `${t('Il secondo membro è ')} ${rhs}${t(": i fuochi e i vertici reali stanno sull'asse ")} ${axisOf(rhs)}`;

function fociSteps(A: number, B: number, rhs: number): string[] {
	const c2 = A + B;
	const plain = rootLatex(c2) === `\\sqrt{${c2}}`;
	return [axisStep(rhs), `c^2 = a^2 + b^2 = ${A} + ${B} = ${c2}${t(', quindi ')} c = ${plain ? rootLatex(c2) : `\\sqrt{${c2}} = ${rootLatex(c2)}`}`, `${t('I fuochi sono ')} F${onAxis(axisOf(rhs), c2)}`];
}

function fociChoice(rng: Rng, A: number, B: number, rhs: number, extra: ChoiceOption[] = []) {
	const axis = axisOf(rhs);
	const c2 = A + B;
	return choiceOf(ID, rng, axisOption('F', axis, c2), [...extra, axisOption('F', other(axis), c2), axisOption('F', axis, Math.abs(A - B)), axisOption('F', axis, c2 * c2), axisOption('F', other(axis), Math.abs(A - B))]);
}

// ---------------------------------------------------------------------------
// Levels 1 and 2: real vertices, foci

function level1(rng: Rng): Built {
	const [a, b] = distinctPair(rng, 2, 9);
	const [A, B] = [sq(a), sq(b)];
	const rhs = pickRhs(rng);
	const axis = axisOf(rhs);
	const [own, oth] = axis === 'x' ? [A, B] : [B, A];
	const answer = choiceOf(ID, rng, axisOption('', axis, own), [axisOption('', other(axis), oth), axisOption('', axis, own * own), axisOption('', other(axis), oth * oth)]);
	const [name, val] = axis === 'x' ? ['a', a] : ['b', b];
	return {
		prompt: "Trova i vertici reali dell'iperbole.",
		problem: conicLatex(A, B, true, rhs),
		solution: onAxis(axis, own),
		steps: [axisStep(rhs), `${name}^2 = ${own}${t(', quindi ')} ${name} = ${val}`, `${t('I vertici reali sono ')} ${onAxis(axis, own)}${t(`: l'iperbole non incontra l'asse `)} ${other(axis)}`],
		answer,
		params: { case: `asse ${axis}`, A, B, rhs },
	};
}

function level2(rng: Rng): Built {
	const [a, b] = distinctPair(rng, 2, 9);
	const [A, B] = [sq(a), sq(b)];
	const rhs = pickRhs(rng);
	return {
		prompt: "Trova i fuochi dell'iperbole.",
		problem: conicLatex(A, B, true, rhs),
		solution: `F${onAxis(axisOf(rhs), A + B)}`,
		steps: fociSteps(A, B, rhs),
		answer: fociChoice(rng, A, B, rhs),
		params: { case: `asse ${axisOf(rhs)}`, A, B, rhs },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the asymptotes

const slopeLatex = (r: Rational) => `y = \\pm ${r.isInteger() ? r.num : r.toLatex()}x`;
const slopeOption = (r: Rational): ChoiceOption => ({ latex: slopeLatex(r), values: [r.toString()] });

function level3(rng: Rng): Built {
	const [a, b] = distinctPair(rng, 1, 9);
	const [A, B] = [sq(a), sq(b)];
	const rhs = pickRhs(rng);
	const m = q(b, a);
	const answer = choiceOf(ID, rng, slopeOption(m), [slopeOption(q(a, b)), slopeOption(q(B, A)), slopeOption(q(A, B))]);
	return {
		prompt: "Trova gli asintoti dell'iperbole.",
		problem: conicLatex(A, B, true, rhs),
		solution: slopeLatex(m),
		steps: [
			`a^2 = ${A},\\ b^2 = ${B}${t(', quindi ')} a = ${a},\\ b = ${b}`,
			`${t('Gli asintoti sono ')} y = \\pm\\frac{b}{a}x${t(', qualunque sia il secondo membro: ')} ${gcd(a, b) === 1 && a !== 1 ? slopeLatex(m) : `y = \\pm\\frac{${b}}{${a}}x${t(', cioè ')} ${slopeLatex(m)}`}`,
		],
		answer,
		params: { case: `asse ${axisOf(rhs)}`, A, B, rhs },
	};
}

// ---------------------------------------------------------------------------
// Level 4: an equation to bring to the canonical form

function level4(rng: Rng): Built {
	const [a, b] = distinctPair(rng, 1, 6);
	const [A, B] = [sq(a), sq(b)];
	const rhs = pickRhs(rng);
	const g = gcd(A, B);
	const [p, k, r] = [B / g, A / g, (rhs * A * B) / g];
	const axis = axisOf(rhs);
	const wrong = [axisOption('F', axis, p + k), axisOption('F', other(axis), p + k)];
	return {
		prompt: "Trova i fuochi dell'iperbole.",
		problem: quadLatex(p, -k, r),
		solution: `F${onAxis(axis, A + B)}`,
		steps: [`${t('Nella forma canonica il secondo membro è ')} 1 ${t(' oppure ')} -1${t(`: dividi tutto per ${Math.abs(r)}.`)}`, conicLatex(A, B, true, rhs), ...fociSteps(A, B, rhs)],
		answer: fociChoice(rng, A, B, rhs, wrong),
		params: { case: `asse ${axis}`, p, q: -k, r, A, B, rhs },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the eccentricity

/** [transverse semi-axis, the other semi-axis, c], all integers. */
const TRIPLES: [number, number, number][] = [
	[3, 4, 5],
	[4, 3, 5],
	[6, 8, 10],
	[8, 6, 10],
	[5, 12, 13],
	[12, 5, 13],
	[9, 12, 15],
	[12, 9, 15],
	[8, 15, 17],
	[15, 8, 17],
];

function level5(rng: Rng): Built {
	const [tr, o, c] = rng.pick(TRIPLES);
	const rhs = pickRhs(rng);
	const axis = axisOf(rhs);
	const [A, B] = axis === 'x' ? [sq(tr), sq(o)] : [sq(o), sq(tr)];
	const e = q(c, tr);
	const num = (r: Rational): ChoiceOption => ({ latex: r.toLatex(), values: [r.toString()] });
	const choice = choiceOf(ID, rng, num(e), [num(q(c, o)), num(q(tr, c)), num(q(o, tr)), num(e.mul(e)), num(q(o, c))]);
	const name = axis === 'x' ? 'a' : 'b';
	return {
		prompt: "Calcola l'eccentricità dell'iperbole.",
		problem: conicLatex(A, B, true, rhs),
		solution: `e = ${e.toLatex()}`,
		steps: [
			`${axisStep(rhs)}${t(', e il semiasse trasverso è ')} ${name} = ${tr}`,
			`c = \\sqrt{${A} + ${B}} = \\sqrt{${sq(c)}} = ${c}`,
			`e = \\frac{c}{${name}} = ${gcd(c, tr) === 1 ? e.toLatex() : `\\frac{${c}}{${tr}} = ${e.toLatex()}`}`,
		],
		answer: { kind: 'number', value: e.toString() },
		choice,
		params: { case: `asse ${axis}`, A, B, rhs },
	};
}

// ---------------------------------------------------------------------------
// Level 6: a line and the hyperbola

const POSITIONS = ['secante', 'tangente', 'esterna', 'parallela'] as const;
type Position = (typeof POSITIONS)[number];
const POSITION_TEXT: Record<Position, string> = { secante: 'secante', tangente: 'tangente', esterna: 'esterna', parallela: 'parallela a un asintoto' };
const positionOptions = (): ChoiceOption[] => POSITIONS.map((k) => ({ latex: t(POSITION_TEXT[k]), values: [k] }));

/** Hyperbolas with square denominators and a slope m for which A m^2 - B is a square: [a, m, b, t] with (am)^2 = b^2 + t^2. */
const SQUARE_TANGENTS: [number, number, number, number][] = [];
for (let a = 1; a <= 13; a++) for (let m = 1; m <= 3; m++) for (let b = 1; b < a * m; b++) if (b !== a && b <= 12 && Number.isInteger(Math.sqrt(sq(a * m) - sq(b)))) SQUARE_TANGENTS.push([a, m, b, Math.sqrt(sq(a * m) - sq(b))]);

function level6(rng: Rng): Built {
	const kind: Position = POSITIONS[rng.int(0, 3)];
	const co = (n: number) => (n === 1 ? '' : String(n));
	if (kind === 'parallela') {
		const [a, b] = distinctPair(rng, 1, 6);
		const [A, B] = [sq(a), sq(b)];
		const m = q(b, a).mul(q(rng.next() < 0.5 ? -1 : 1));
		const k = (rng.next() < 0.5 ? -1 : 1) * rng.int(1, 6);
		const x0 = q(-(k * k + B)).div(m.mul(q(2 * k)));
		const y0 = m.mul(x0).add(q(k));
		return {
			prompt: "Stabilisci la posizione della retta rispetto all'iperbole.",
			problem: `${conicLatex(A, B, true)} \\qquad ${lineLatex(m, q(k))}`,
			solution: t(POSITION_TEXT.parallela),
			steps: [
				`a = ${a},\\ b = ${b}${t(': gli asintoti sono ')} y = \\pm ${q(b, a).isInteger() ? q(b, a).num : q(b, a).toLatex()}x`,
				`${t('La retta ha lo stesso coefficiente angolare di un asintoto, ')} ${m.toLatex()}${t(', e non passa per il centro: è parallela a un asintoto.')}`,
				`${t('Nella risolvente i termini con ')} x^2 ${t(' si cancellano e resta un\'equazione di primo grado: un solo punto comune, ')} ${pair(x0, y0)}${t(', in cui la retta attraversa l\'iperbole senza essere tangente.')}`,
			],
			answer: fixedChoice(positionOptions(), kind),
			params: { case: kind, A, B, m: m.toString(), q: k },
		};
	}
	for (;;) {
		let A: number, B: number, m: number, tt: number;
		if (rng.next() < 0.5) {
			const [a, m0, b, t0] = rng.pick(SQUARE_TANGENTS);
			[A, B, m, tt] = [sq(a), sq(b), m0 * (rng.next() < 0.5 ? -1 : 1), t0];
		} else {
			m = rng.pick([1, -1, 2, -2, 3, -3]);
			tt = rng.int(2, 8);
			A = rng.int(2, 30);
			B = A * m * m - tt * tt;
			if (B > 40 || (B >= 2 && lcm(A, B) > 200)) continue;
		}
		if (B < 2 || B > 150 || A > 170 || B === A || tt < 2 || lcm(A, B) > 900) continue;
		const s = rng.next() < 0.5 ? -1 : 1;
		const k = s * (kind === 'tangente' ? tt : kind === 'esterna' ? rng.int(1, tt - 1) : rng.int(tt + 1, tt + 4));
		const L = lcm(A, B);
		const [u, v] = [L / A, L / B];
		let [P, Q, R] = [u - v * m * m, -2 * v * m * k, -v * k * k - L];
		if (P < 0) [P, Q, R] = [-P, -Q, -R];
		const line = polyToLatex(poly(k, m));
		const steps = [
			`${t(`Moltiplica l'equazione dell'iperbole per ${L}: `)} ${quadLatex(u, -v, L)}`,
			`${t('Sostituisci ')} y = ${line}${t(': ')} ${co(u)}x^2 - ${co(v)}(${line})^2 = ${L}`,
			`${t('Svolgi i conti e ordina: ')} ${polyToLatex(poly(R, Q, P))} = 0`,
		];
		const g = gcd(gcd(P, Math.abs(Q)), Math.abs(R));
		if (g > 1) {
			[P, Q, R] = [P / g, Q / g, R / g];
			steps.push(`${t(`Dividi per ${g}: `)} ${polyToLatex(poly(R, Q, P))} = 0`);
		}
		const delta = Q * Q - 4 * P * R;
		if (Math.abs(Q) > 400 || Math.abs(R) > 2000 || P > 400) continue;
		steps.push(`${t('La risolvente è di secondo grado: ')} \\Delta = ${Q < 0 ? `(${Q})` : Q}^2 - 4 \\cdot ${P} \\cdot ${R < 0 ? `(${R})` : R} = ${delta}`);
		if (kind === 'secante') steps.push(`\\Delta > 0${t(': la retta ha due punti in comune con l\'iperbole, è secante.')}`);
		else if (kind === 'esterna') steps.push(`\\Delta < 0${t(': la retta non ha punti in comune con l\'iperbole, è esterna.')}`);
		else {
			const x0 = q(-Q, 2 * P);
			const y0 = q(m).mul(x0).add(q(k));
			steps.push(`\\Delta = 0${t(': la retta è tangente, e tocca l\'iperbole nel punto ')} ${pair(x0, y0)}`);
		}
		return {
			prompt: "Stabilisci la posizione della retta rispetto all'iperbole.",
			problem: `${conicLatex(A, B, true)} \\qquad ${lineLatex(q(m), q(k))}`,
			solution: t(POSITION_TEXT[kind]),
			steps,
			answer: fixedChoice(positionOptions(), kind),
			params: { case: kind, A, B, m: String(m), q: k },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 7: the hyperbola from two conditions

function level7(rng: Rng): Built {
	const withAsymptote = rng.next() < 0.5;
	const rhs = pickRhs(rng);
	const axis = axisOf(rhs);
	const opt = (A: number, B: number, r: number): ChoiceOption => ({ latex: conicLatex(A, B, true, r as 1 | -1), values: [String(A), String(B), String(r)] });
	const [name, oname] = axis === 'x' ? ['a', 'b'] : ['b', 'a'];
	const vertexOf = (v: number) => (axis === 'x' ? `A_2(${v}, 0)` : `B_2(0, ${v})`);
	if (withAsymptote) {
		const [a, b] = distinctPair(rng, 1, 8);
		const [A, B] = [sq(a), sq(b)];
		const m = q(b, a);
		const tr = axis === 'x' ? a : b;
		const answer = choiceOf(ID, rng, opt(A, B, rhs), [opt(A, B, -rhs), opt(B, A, rhs), opt(a, b, rhs), opt(B, A, -rhs)]);
		const slope = `y = \\pm ${m.isInteger() ? m.num : m.toLatex()}x`;
		return {
			prompt: "Trova l'equazione dell'iperbole con il centro nell'origine che ha il vertice reale e gli asintoti indicati.",
			problem: `${vertexOf(tr)} \\qquad ${slope}`,
			solution: conicLatex(A, B, true, rhs),
			steps: [
				`${t(`Il vertice reale è sull'asse `)} ${axis}${t(`: i fuochi sono sull'asse `)} ${axis}${t(', il secondo membro è ')} ${rhs} ${t(' e ')} ${name} = ${tr}`,
				`${t('Dagli asintoti ')} \\frac{b}{a} = ${m.toLatex()}${t(', quindi ')} ${axis === 'x' ? `b = ${m.toLatex()} \\cdot ${a} = ${b}` : `a = ${b} : ${m.isInteger() ? m.toLatex() : m.toLatex()} = ${a}`}`,
				`${t("L'iperbole è ")} ${conicLatex(A, B, true, rhs)}`,
			],
			answer,
			params: { case: 'asintoti', axis, rhs, vertex: tr, slope: m.toString() },
		};
	}
	const tr = rng.int(1, 8);
	const c = rng.int(tr + 1, 10);
	const [T2, O2, C2] = [sq(tr), sq(c) - sq(tr), sq(c)];
	const or = (own: number, oth: number): [number, number] => (axis === 'x' ? [own, oth] : [oth, own]);
	const right = or(T2, O2);
	const answer = choiceOf(ID, rng, opt(...right, rhs), [opt(...or(T2, C2 + T2), rhs), opt(...right, -rhs), opt(...or(T2, C2), rhs), opt(right[1], right[0], rhs), opt(...or(T2, C2 + T2), -rhs)].filter((o) => o.values[0] !== o.values[1]));
	return {
		prompt: "Trova l'equazione dell'iperbole con il centro nell'origine che ha i fuochi e il vertice reale indicati.",
		problem: `F${onAxis(axis, C2)} \\qquad ${vertexOf(tr)}`,
		solution: conicLatex(...right, true, rhs),
		steps: [
			`${t(`I fuochi sono sull'asse `)} ${axis}${t(': il secondo membro è ')} ${rhs}${t(', e il vertice reale dà ')} ${name} = ${tr}`,
			`${t('I fuochi danno ')} c = ${c}${t(', e ')} ${oname}^2 = c^2 - ${name}^2 = ${C2} - ${T2} = ${O2}`,
			`${t("L'iperbole è ")} ${conicLatex(...right, true, rhs)}`,
		],
		answer,
		params: { case: 'fuochi', axis, rhs, vertex: tr, c },
	};
}

// ---------------------------------------------------------------------------
// Checks

function check(s: Sample): string[] {
	const v: string[] = [];
	const p = s.params as Record<string, number | string>;
	const ch = s.answer.kind === 'choice' ? s.answer : s.choice;
	const right = ch?.options[ch.correct]?.values.join('|');
	const [A, B, rhs] = [Number(p.A), Number(p.B), Number(p.rhs)];
	const axis = axisOf(rhs);
	switch (s.level) {
		case 1:
			if (right !== `${axis}|${axis === 'x' ? A : B}`) v.push('vertici sbagliati');
			break;
		case 2:
		case 4:
			if (right !== `${axis}|${A + B}`) v.push('fuochi sbagliati');
			break;
		case 3:
			if (right !== q(Math.sqrt(B), Math.sqrt(A)).toString()) v.push('asintoti sbagliati');
			break;
		case 5: {
			const e = q(Math.sqrt(A + B), Math.sqrt(axis === 'x' ? A : B)).toString();
			if (s.answer.kind !== 'number' || s.answer.value !== e || right !== e) v.push('eccentricità sbagliata');
			break;
		}
		case 6: {
			const m = Rational.parse(String(p.m));
			const k = Number(p.q);
			const d = q(k * k + Number(p.B)).sub(m.mul(m).mul(q(Number(p.A))));
			const par = m.mul(m).equals(q(Number(p.B), Number(p.A)));
			const pos = par ? 'parallela' : d.sign() > 0 ? 'secante' : d.sign() === 0 ? 'tangente' : 'esterna';
			if (k === 0 || right !== pos || p.case !== pos) v.push('posizione sbagliata');
			break;
		}
		case 7: {
			const tr = Number(p.vertex);
			let want: string;
			if (p.case === 'fuochi') {
				const o2 = sq(Number(p.c)) - sq(tr);
				want = p.axis === 'x' ? `${sq(tr)}|${o2}|1` : `${o2}|${sq(tr)}|-1`;
			} else {
				const m = Rational.parse(String(p.slope));
				const oth = p.axis === 'x' ? m.mul(q(tr)) : q(tr).div(m);
				if (!oth.isInteger()) v.push('semiasse non intero');
				want = p.axis === 'x' ? `${sq(tr)}|${sq(oth.num)}|1` : `${sq(oth.num)}|${sq(tr)}|-1`;
			}
			if (right !== want) v.push('equazione sbagliata');
			break;
		}
		default:
			v.push(`livello sconosciuto ${s.level}`);
	}
	return v;
}

export const iperbole = assemble(
	ID,
	'Iperbole',
	{
		1: { label: 'Vertici reali', constraints: ['a e b interi distinti tra 2 e 9', 'metà con il secondo membro -1: i vertici reali sono sull\'asse y'] },
		2: { label: 'Fuochi', constraints: ['c^2 = a^2 + b^2, c anche irrazionale', 'distrattori: la differenza al posto della somma, l\'asse sbagliato'] },
		3: { label: 'Asintoti', constraints: ['a e b interi distinti tra 1 e 9', 'distrattori: a/b, i rapporti tra i denominatori'] },
		4: { label: 'Equazione da portare in forma canonica', constraints: ['px^2 - qy^2 = r con coefficienti interi primi tra loro, r positivo o negativo', 'a e b interi distinti tra 1 e 6'] },
		5: { label: 'Eccentricità', constraints: ['semiassi e c interi (terne pitagoriche)', 'si divide per il semiasse trasverso'] },
		6: { label: 'Posizione di una retta', constraints: ['secante, tangente, esterna, parallela a un asintoto: un quarto ciascuna', 'fuochi sull\'asse x'] },
		7: { label: "Equazione dell'iperbole da due condizioni", constraints: ['metà fuochi e vertice reale, metà vertice reale e asintoti', "metà con i fuochi sull'asse y"] },
	},
	{ 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 },
	check,
);

export default iperbole;
