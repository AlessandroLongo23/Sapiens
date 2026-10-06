/**
 * Circonferenza e rette. Spec: specs/exercises/circonferenza-rette.md
 *
 * Seven levels in the order of lesson 115: the position of a line from the distance of the centre, the points of
 * intersection, the length of the chord, the tangent at a point of the circle, the slopes of the tangents from an
 * external point, the circle with a given centre tangent to a line, the position of two circles.
 *
 * Built backwards. The lines whose distance from the centre is needed have coefficients from a Pythagorean
 * triple, so the distance is an integer; secants pass through two lattice points of the circle; the tangents
 * from a point are the tangents at two lattice points, and the point is where they meet.
 */
import type { ChoiceOption, Rng, Sample } from '../types';
import { Rational, gcd, q } from '../rational';
import { Surd } from '../surd';
import { shuffle } from '../insiemi';
import { type Built, type Level, circleCentre, circleGeneral, circleOption, lattice, lineExplicit, lineImplicit, lineOption, linPy, makeGenerator, nonZero, numOption, par, pt, root, pairOption, setAnswer, setOption, sum, surdAnswer, t, textOption, until, verticalOption } from '../circonferenza-parabola';

export const ID = 'circonferenza-rette';

const PYTH: [number, number, number][] = [
	[3, 4, 5],
	[4, 3, 5],
	[5, 12, 13],
	[12, 5, 13],
];
const R2_LATTICE = [5, 10, 13, 17, 25];
/** The circle as the lesson writes it: x² + y² = r² with the centre in the origin, the general form otherwise. */
const general = (al: number, be: number, r2: number) => (al === 0 && be === 0 ? `x^2 + y^2 = ${r2}` : circleGeneral(-2 * al, -2 * be, al * al + be * be - r2));
const centreOf = (al: number, be: number, r: number | string) => `${t('La circonferenza ha centro ')} ${pt('C', al, be)} ${t(' e raggio ')} r = ${r}`;

function centre(rng: Rng, m = 4): [number, number] {
	return [rng.int(-m, m), rng.int(-m, m)];
}

/** A line ax + by + c = 0 with Pythagorean a, b at distance n/h from (al, be). */
function lineAt(rng: Rng, al: number, be: number, n: number): { a: number; b: number; c: number; h: number } {
	const [pa, pb, h] = rng.pick(PYTH);
	const a = pa;
	const b = rng.next() < 0.5 ? pb : -pb;
	const c = (rng.next() < 0.5 ? 1 : -1) * n - a * al - b * be;
	return { a, b, c, h };
}

function distanceStep(a: number, b: number, c: number, al: number, be: number, h: number): string {
	const n = a * al + b * be + c;
	const body = [a, b].map((k, i) => `${i === 0 ? (k < 0 ? '-' : '') : k < 0 ? '- ' : '+ '}${Math.abs(k)} \\cdot ${par(i === 0 ? al : be)}`).join(' ');
	return `d = \\frac{|${body} ${c < 0 ? '-' : '+'} ${Math.abs(c)}|}{\\sqrt{${a * a} + ${b * b}}} = \\frac{${Math.abs(n)}}{${h}} = ${q(Math.abs(n), h).toLatex()}`;
}

// ---------------------------------------------------------------------------
// Level 1: position of a line, from the distance

const POSITIONS = ['secante', 'tangente', 'esterna'] as const;

function level1(rng: Rng): Built | null {
	const pos = rng.pick(POSITIONS);
	return until(() => level1of(rng, pos));
}

function level1of(rng: Rng, pos: (typeof POSITIONS)[number]): Built | null {
	const [al, be] = centre(rng);
	const r = rng.int(2, 5);
	const [, , h] = PYTH[0];
	const k = pos === 'tangente' ? r : pos === 'secante' ? rng.int(0, r - 1) : rng.int(r + 1, r + 4);
	const l = lineAt(rng, al, be, k * (rng.next() < 0.5 ? h : 13));
	const n = Math.abs(l.a * al + l.b * be + l.c);
	// the multiple was drawn before the triple: keep the sample only when the distance is the integer k
	if (n !== k * l.h || l.c === 0 || Math.abs(l.c) > 99) return null;
	const sign = k < r ? '<' : k > r ? '>' : '=';
	return {
		prompt: 'Stabilisci la posizione della retta r rispetto alla circonferenza.',
		problem: `${general(al, be, r * r)} \\quad r\\colon ${lineImplicit(l.a, l.b, l.c)}`,
		solution: t(pos),
		steps: [centreOf(al, be, r), distanceStep(l.a, l.b, l.c, al, be, l.h), `${k} ${sign} ${r}${t(`: la retta è ${pos}.`)}`],
		correct: textOption(pos),
		distractors: POSITIONS.filter((p) => p !== pos).map(textOption),
		n: 3,
		params: { case: pos, centre: [`${al}`, `${be}`], r: `${r}`, line: [`${l.a}`, `${l.b}`, `${l.c}`] },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the points of intersection

function level2(rng: Rng): Built | null {
	const [al, be] = centre(rng, 3);
	const r2 = rng.pick(R2_LATTICE);
	const [p1, p2] = shuffle(rng, lattice(r2)).slice(0, 2).map(([dx, dy]) => [al + dx, be + dy]);
	if (p1[0] === p2[0] || (p2[1] - p1[1]) % (p2[0] - p1[0]) !== 0) return null;
	const m = (p2[1] - p1[1]) / (p2[0] - p1[0]);
	const k = p1[1] - m * p1[0];
	if (m === 0 || Math.abs(m) > 3 || k === 0) return null;
	const [A, B] = p1[0] < p2[0] ? [p1, p2] : [p2, p1];
	const pair = (P: number[], Q: number[]): ChoiceOption => {
		const [u, v] = [P, Q].sort((s, w) => s[0] - w[0] || s[1] - w[1]);
		return { latex: `${pt('', u[0], u[1])},\\ ${pt('', v[0], v[1])}`, values: [`${u[0]}`, `${u[1]}`, `${v[0]}`, `${v[1]}`] };
	};
	// resolvent: (1 + m²)x² + … = 0, divided by 1 + m²
	const [s, p] = [A[0] + B[0], A[0] * B[0]];
	return {
		prompt: 'Trova i punti in cui la retta r incontra la circonferenza.',
		problem: `${general(al, be, r2)} \\quad r\\colon ${lineExplicit(m, k)}`,
		solution: pair(A, B).latex,
		steps: [
			`${t('Sostituisci ')} ${lineExplicit(m, k)} ${t(" nell'equazione della circonferenza e semplifica:")}`,
			`x^2 ${s === 0 ? '' : `${s > 0 ? '-' : '+'} ${Math.abs(s) === 1 ? '' : Math.abs(s)}x `}${p === 0 ? '' : `${p > 0 ? '+' : '-'} ${Math.abs(p)} `}= 0`,
			`x_1 = ${A[0]}, \\quad x_2 = ${B[0]}`,
			`${t('Dalla retta: ')} y_1 = ${A[1]}, \\quad y_2 = ${B[1]}`,
		],
		correct: pair(A, B),
		distractors: [pair([A[0], m * A[0] - k], [B[0], m * B[0] - k]), pair([A[1], A[0]], [B[1], B[0]]), pair([A[0], -A[1]], [B[0], -B[1]]), pair([-A[0], A[1]], [-B[0], B[1]]), pair([A[0], B[1]], [B[0], A[1]]), pair([A[0], A[1] + 1], [B[0], B[1] + 1])],
		params: { centre: [`${al}`, `${be}`], r2: `${r2}`, line: [`${m}`, `${k}`], points: [A, B].map((P) => P.map(String)) },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the length of the chord

function level3(rng: Rng): Built | null {
	const [al, be] = centre(rng);
	const r = rng.int(2, 6);
	const d = rng.int(1, r - 1);
	const l = lineAt(rng, al, be, d * rng.pick([5, 13]));
	if (Math.abs(l.a * al + l.b * be + l.c) !== d * l.h || l.c === 0 || Math.abs(l.c) > 99) return null;
	const half = r * r - d * d;
	const chord = Surd.of(0, 2, half, 1);
	return {
		prompt: 'Calcola la lunghezza della corda che la circonferenza stacca sulla retta r.',
		problem: `${general(al, be, r * r)} \\quad r\\colon ${lineImplicit(l.a, l.b, l.c)}`,
		solution: `\\overline{AB} = ${chord.toLatex()}`,
		steps: [
			centreOf(al, be, r),
			distanceStep(l.a, l.b, l.c, al, be, l.h),
			`\\overline{AB} = 2\\sqrt{r^2 - d^2} = 2\\sqrt{${r * r} - ${d * d}} = 2\\sqrt{${half}}${chord.toLatex() === `2\\sqrt{${half}}` ? '' : ` = ${chord.toLatex()}`}`,
		],
		correct: numOption(chord),
		distractors: [numOption(root(half)), numOption(Surd.of(0, 2, r * r + d * d, 1)), numOption(q(2 * (r - d))), numOption(q(2 * half)), numOption(q(half)), numOption(Surd.of(0, 2, r - d, 1)), numOption(q(2 * r))],
		open: surdAnswer(chord),
		params: { centre: [`${al}`, `${be}`], r: `${r}`, line: [`${l.a}`, `${l.b}`, `${l.c}`], d: `${d}` },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the tangent at a point of the circle

function level4(rng: Rng): Built | null {
	const axis = rng.next() < 0.25;
	return until(() => level4of(rng, axis));
}

function level4of(rng: Rng, axis: boolean): Built | null {
	const [al, be] = centre(rng, 3);
	if (axis) {
		const r = rng.int(2, 6);
		const vertical = rng.next() < 0.5;
		const s = rng.next() < 0.5 ? r : -r;
		const [x0, y0] = vertical ? [al + s, be] : [al, be + s];
		if (x0 === y0 || x0 === 0 || y0 === 0) return null;
		const hor = (k: number): ChoiceOption => lineOption(0, k);
		return {
			prompt: 'Scrivi la tangente alla circonferenza nel suo punto P.',
			problem: `${general(al, be, r * r)} \\quad ${pt('P', x0, y0)}`,
			solution: vertical ? `x = ${x0}` : `y = ${y0}`,
			steps: [
				`${t('Il centro è ')} ${pt('C', al, be)}${t(': il raggio ')} CP ${t(vertical ? ' è orizzontale, perché ' : ' è verticale, perché ')} ${vertical ? `y_P = y_C = ${be}` : `x_P = x_C = ${al}`}`,
				t(vertical ? 'La tangente è perpendicolare al raggio: è la retta verticale per P.' : 'La tangente è perpendicolare al raggio: è la retta orizzontale per P.'),
				vertical ? `x = ${x0}` : `y = ${y0}`,
			],
			correct: vertical ? verticalOption(x0) : hor(y0),
			distractors: vertical ? [hor(y0), verticalOption(al), hor(x0), verticalOption(y0), verticalOption(-x0)] : [verticalOption(x0), hor(be), verticalOption(y0), hor(x0), hor(-y0)],
			params: { case: vertical ? 'verticale' : 'orizzontale', centre: [`${al}`, `${be}`], r2: `${r * r}`, P: [`${x0}`, `${y0}`] },
		};
	}
	const r2 = rng.pick(R2_LATTICE);
	const [dx, dy] = rng.pick(lattice(r2).filter(([u, v]) => u !== 0 && v !== 0));
	const [x0, y0] = [al + dx, be + dy];
	const mr = q(dy, dx);
	const m = q(-dx, dy);
	const k = q(y0).sub(m.mul(q(x0)));
	const through = (slope: Rational): ChoiceOption => lineOption(slope, q(y0).sub(slope.mul(q(x0))));
	return {
		prompt: 'Scrivi la tangente alla circonferenza nel suo punto P.',
		problem: `${general(al, be, r2)} \\quad ${pt('P', x0, y0)}`,
		solution: lineExplicit(m, k),
		steps: [
			`${t('Il centro è ')} ${pt('C', al, be)}${t('. Coefficiente angolare del raggio: ')} m_{CP} = \\frac{${y0} - ${par(be)}}{${x0} - ${par(al)}} = ${mr.toLatex()}`,
			`${t('La tangente è perpendicolare al raggio: ')} m = -\\frac{1}{m_{CP}} = ${m.toLatex()}`,
			`y - ${par(y0)} = ${m.toLatex()}(x - ${par(x0)})`,
			lineExplicit(m, k),
		],
		correct: lineOption(m, k),
		distractors: [through(mr), through(m.neg()), through(mr.neg()), lineOption(m, q(be).sub(m.mul(q(al)))), lineOption(m, k.neg()), lineOption(m, q(y0))],
		open: { kind: 'expression', value: linPy(m, k), latex: lineExplicit(m, k), form: 'explicit' },
		params: { case: 'obliqua', centre: [`${al}`, `${be}`], r2: `${r2}`, P: [`${x0}`, `${y0}`] },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the slopes of the tangents from an external point

function level5(rng: Rng): Built | null {
	const origin = rng.next() < 0.6;
	const [al, be] = origin ? [0, 0] : centre(rng, 2);
	const r2 = rng.pick(R2_LATTICE);
	const [t1, t2] = shuffle(
		rng,
		lattice(r2).filter(([, v]) => v !== 0),
	).slice(0, 2);
	// tangent at (dx, dy), from the centre: dx·X + dy·Y = r2. The two meet where both hold.
	const det = t1[0] * t2[1] - t2[0] * t1[1];
	if (det === 0) return null;
	const X = q(r2 * (t2[1] - t1[1]), det);
	const Y = q(r2 * (t1[0] - t2[0]), det);
	if (!X.isInteger() || !Y.isInteger()) return null;
	const [x0, y0] = [al + X.num, be + Y.num];
	if (Math.abs(x0) > 12 || Math.abs(y0) > 12) return null;
	const ms = [q(-t1[0], t1[1]), q(-t2[0], t2[1])];
	if (ms[0].equals(ms[1]) || ms.some((m) => m.den > 4)) return null;
	const [u, v] = [al - x0, be - y0];
	// (u² - r²)m² - 2uv·m + (v² - r²) = 0
	const [A, B, C] = [u * u - r2, -2 * u * v, v * v - r2];
	if (A === 0) return null;
	const g = gcd(gcd(A, B), C) * (A < 0 ? -1 : 1);
	const quad = `${sum([[A / g, 'm^2'], [B / g, 'm'], [C / g, '']])} = 0`;
	const fascio = `${sum([[1, 'mx'], [-1, 'y'], [y0, ''], [-x0, 'm']])} = 0`;
	const inv = ms.every((m) => !m.isZero()) ? pairOption(ms.map((m) => q(1).div(m))) : null;
	const negInv = ms.every((m) => !m.isZero()) ? pairOption(ms.map((m) => q(-1).div(m))) : null;
	return {
		prompt: 'Trova i coefficienti angolari delle due tangenti alla circonferenza condotte dal punto P.',
		problem: `${general(al, be, r2)} \\quad ${pt('P', x0, y0)}`,
		solution: `m_1 = ${[...ms].sort((a, b) => a.compare(b))[0].toLatex()}, \\quad m_2 = ${[...ms].sort((a, b) => a.compare(b))[1].toLatex()}`,
		steps: [
			`${centreOf(al, be, root(r2).toLatex())}`,
			`${t('Fascio di centro ')} P${t(': ')} ${fascio}`,
			`${t('Condizione di tangenza, distanza del centro uguale al raggio: ')} \\frac{|${sum([[u, 'm'], [-v, '']])}|}{\\sqrt{m^2 + 1}} = ${root(r2).toLatex()}`,
			`${t('Eleva al quadrato e ordina: ')} ${quad}`,
			`m_1 = ${[...ms].sort((a, b) => a.compare(b))[0].toLatex()}, \\quad m_2 = ${[...ms].sort((a, b) => a.compare(b))[1].toLatex()}`,
		],
		correct: setOption(ms),
		distractors: [pairOption(ms.map((m) => m.neg())), negInv, inv, pairOption([ms[0], ms[1].neg()]), pairOption([ms[0].neg(), ms[1]]), pairOption(ms.map((m) => m.add(q(1)))), pairOption(ms.map((m) => m.mul(q(2))))],
		open: setAnswer(ms),
		params: { centre: [`${al}`, `${be}`], r2: `${r2}`, P: [`${x0}`, `${y0}`], slopes: [...ms].sort((a, b) => a.compare(b)).map(String) },
	};
}

// ---------------------------------------------------------------------------
// Level 6: the circle with a given centre tangent to a line

function level6(rng: Rng): Built | null {
	const onAxis = rng.next() < 0.3;
	return until(() => level6of(rng, onAxis));
}

function level6of(rng: Rng, onAxis: boolean): Built | null {
	const al = nonZero(rng, -5, 5);
	const be = nonZero(rng, -5, 5);
	const s = al * al + be * be;
	const eq = (r2: number) => circleOption(-2 * al, -2 * be, s - r2);
	if (onAxis) {
		const onX = rng.next() < 0.5;
		if (Math.abs(al) === Math.abs(be)) return null;
		const r = Math.abs(onX ? be : al);
		const other = Math.abs(onX ? al : be);
		return {
			prompt: `Scrivi in forma generale l'equazione della circonferenza di centro C tangente all'asse ${onX ? 'x' : 'y'}.`,
			problem: pt('C', al, be),
			solution: eq(r * r).latex,
			steps: [
				`${t(`Il raggio è la distanza del centro dall'asse ${onX ? 'x' : 'y'}: `)} r = |${onX ? be : al}| = ${r}`,
				circleCentre(al, be, r * r),
				`${t('In forma generale: ')} ${eq(r * r).latex}`,
			],
			correct: eq(r * r),
			distractors: [eq(other * other), circleOption(2 * al, 2 * be, s - r * r), eq(r), circleOption(-2 * al, -2 * be, -r * r), eq(-r * r), eq(r * r + 1)],
			params: { case: 'asse', axis: onX ? 'x' : 'y', centre: [`${al}`, `${be}`] },
		};
	}
	const r = rng.int(1, 5);
	const l = lineAt(rng, al, be, r * rng.pick([5, 13]));
	if (Math.abs(l.a * al + l.b * be + l.c) !== r * l.h || l.c === 0 || Math.abs(l.c) > 99) return null;
	const noC = Math.abs(l.a * al + l.b * be);
	return {
		prompt: "Scrivi in forma generale l'equazione della circonferenza di centro C tangente alla retta r.",
		problem: `${pt('C', al, be)} \\quad r\\colon ${lineImplicit(l.a, l.b, l.c)}`,
		solution: eq(r * r).latex,
		steps: [
			`${t('Il raggio è la distanza del centro dalla retta: ')} ${distanceStep(l.a, l.b, l.c, al, be, l.h).replace('d =', 'r =')}`,
			circleCentre(al, be, r * r),
			`${t('In forma generale: ')} ${eq(r * r).latex}`,
		],
		correct: eq(r * r),
		distractors: [eq(r), circleOption(2 * al, 2 * be, s - r * r), noC % l.h === 0 && noC > 0 ? eq((noC / l.h) ** 2) : null, circleOption(-2 * al, -2 * be, -r * r), eq(-r * r), eq((r + 1) * (r + 1)), eq(r * r + 1)],
		params: { case: 'retta', centre: [`${al}`, `${be}`], line: [`${l.a}`, `${l.b}`, `${l.c}`] },
	};
}

// ---------------------------------------------------------------------------
// Level 7: two circles

const TWO = ['esterne', 'tangenti esternamente', 'secanti', 'tangenti internamente', "una interna all'altra"] as const;

function level7(rng: Rng): Built | null {
	const kind = rng.pick(TWO);
	return until(() => level7of(rng, kind));
}

function level7of(rng: Rng, kind: (typeof TWO)[number]): Built | null {
	const [a1, b1] = centre(rng, 3);
	const [ux, uy, d] = rng.pick([
		[3, 4, 5],
		[4, 3, 5],
		[6, 8, 10],
		[8, 6, 10],
		[5, 0, 5],
		[0, 6, 6],
		[2, 0, 2],
		[0, 3, 3],
		[4, 0, 4],
		[0, 1, 1],
		[1, 0, 1],
	] as [number, number, number][]);
	const [a2, b2] = [a1 + (rng.next() < 0.5 ? ux : -ux), b1 + (rng.next() < 0.5 ? uy : -uy)];
	const r1 = rng.int(1, 8);
	const r2 = rng.int(1, 8);
	if (r1 === r2) return null;
	const [big, small] = r1 > r2 ? [r1, r2] : [r2, r1];
	const got = d > big + small ? TWO[0] : d === big + small ? TWO[1] : d > big - small ? TWO[2] : d === big - small ? TWO[3] : TWO[4];
	if (got !== kind) return null;
	const [c1, c2] = [a1 * a1 + b1 * b1 - r1 * r1, a2 * a2 + b2 * b2 - r2 * r2];
	if ([a2, b2, c1, c2].some((v) => Math.abs(v) > 70)) return null;
	const why = {
		esterne: `${d} > ${big + small}${t(', la somma dei raggi')}`,
		'tangenti esternamente': `${d} = ${big} + ${small}${t(', la somma dei raggi')}`,
		secanti: `${big - small} < ${d} < ${big + small}${t(': tra la differenza e la somma dei raggi')}`,
		'tangenti internamente': `${d} = ${big} - ${small}${t(', la differenza dei raggi')}`,
		"una interna all'altra": `${d} < ${big - small}${t(', la differenza dei raggi')}`,
	}[kind];
	const i = TWO.indexOf(kind);
	const near = [i - 1, i + 1, i - 2, i + 2, i + 3, i - 3, i + 4, i - 4].filter((j) => j >= 0 && j < TWO.length).map((j) => textOption(TWO[j]));
	return {
		prompt: 'Stabilisci la posizione delle due circonferenze.',
		problem: `${general(a1, b1, r1 * r1)} \\quad ${general(a2, b2, r2 * r2)}`,
		solution: t(kind),
		steps: [
			`${t('La prima ha centro ')} ${pt('C', a1, b1)} ${t(' e raggio ')} ${r1}${t('; la seconda ha centro ')} ${pt("C'", a2, b2)} ${t(' e raggio ')} ${r2}`,
			`d = \\overline{CC'} = \\sqrt{${par(a2 - a1)}^2 + ${par(b2 - b1)}^2} = ${d}`,
			`${why}${t(`: le circonferenze sono ${kind === "una interna all'altra" ? "una interna all'altra" : kind}.`)}`,
		],
		correct: textOption(kind),
		distractors: near,
		params: { case: kind, c1: [`${a1}`, `${b1}`, `${r1}`], c2: [`${a2}`, `${b2}`, `${r2}`] },
	};
}

// ---------------------------------------------------------------------------

const small = (s: Sample): string[] => {
	const coords = [s.params.centre, s.params.P].filter(Boolean).flat() as string[];
	return coords.some((v) => Math.abs(Number(v)) > 12) ? ['coordinata oltre 12'] : [];
};

const levels: Record<number, Level> = {
	1: { label: 'Posizione di una retta con la distanza', constraints: ['centro intero, raggio intero da 2 a 5', 'retta con a, b da una terna pitagorica: la distanza è intera', 'secante, tangente, esterna con la stessa frequenza'], build: level1, check: small },
	2: { label: 'Punti di intersezione', constraints: ['retta y = mx + q con m intero non nullo, |m| <= 3', 'due punti a coordinate intere'], build: level2, check: small },
	3: { label: 'Lunghezza della corda', constraints: ['distanza intera, minore del raggio e non nulla', 'risultato intero o radicale semplificato'], build: level3, check: small },
	4: { label: 'Tangente in un punto della circonferenza', constraints: ['punto a coordinate intere', 'tangente obliqua (75%) oppure parallela a un asse (25%)'], build: level4, check: small },
	5: { label: 'Tangenti da un punto esterno', constraints: ['due tangenti non verticali con coefficienti angolari razionali, denominatore <= 4', 'punto a coordinate intere'], build: level5, check: small },
	6: { label: 'Circonferenza tangente a una retta', constraints: ['centro intero con coordinate non nulle', 'tangente a una retta con distanza intera (70%) o a un asse (30%)'], build: level6, check: small },
	7: { label: 'Posizione di due circonferenze', constraints: ['centri interi, raggi interi diversi, distanza tra i centri intera', 'i cinque casi con la stessa frequenza'], build: level7 },
};

export const circonferenzaRette = makeGenerator(ID, 'Circonferenza e rette', levels);
export default circonferenzaRette;
