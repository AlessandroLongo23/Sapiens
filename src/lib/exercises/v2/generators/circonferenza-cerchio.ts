/**
 * Circonferenza e cerchio. Spec: specs/exercises/circonferenza-cerchio.md
 *
 * Seven levels, from the "Per il generatore" section of the lesson's note
 * (docs/lezioni/note/96-circonferenza-cerchio.md), in the order of the lesson: which of four points is
 * inside, on or outside a circle; which of four lines is secant, tangent or external; the relative
 * position of two circles; chord, distance from the centre and radius with Pythagorean triples; central and
 * inscribed angles, the obtuse one with a reflex central angle; the two tangents from an external point;
 * the triangle inscribed in a semicircle. No figures: every exercise stands on its text. Levels 1-3 answer
 * with a choice; levels 4-7 with an exact number (cm or degrees) and a multiple-choice variant whose
 * distractors are the mistakes the lesson warns about.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import { buildChoice, shuffle } from '../razionali';
import { textBlock } from '../insiemi';

export const ID = 'circonferenza-cerchio';

const R = (s: string) => Rational.parse(s);
const t = (s: string) => `\\text{${s}}`;
const deg = (n: number) => `${n}^\\circ`;
const hat = (v: string) => `\\hat{${v}}`;
const wide = (a: string, b: string, c: string) => `\\widehat{${a}${b}${c}}`;
const bar = (s: string) => `\\overline{${s}}`;

// ---------------------------------------------------------------------------
// Numbers

/** 12, 3{,}5: a positive length with at most one decimal, as the lesson writes it. */
function numTex(r: Rational): string {
	if (r.isInteger()) return String(r.num);
	if (r.den !== 2) throw new Error(`${ID}: length ${r} is not a half`);
	return `${(r.num - 1) / 2}{,}5`;
}

/** A value of a length option: a rational, or k·√m with m square-free. */
type Val = { r: Rational } | { k: number; m: number };

/** √x as a Val, or null when it is k/n·√m with n > 1 or a large radicand (options nobody would write). */
function sqrtVal(x: Rational): Val | null {
	if (x.sign() <= 0) return null;
	// √(p/q) = √(p·q) / q
	let m = x.num * x.den;
	let k = 1;
	for (let i = 2; i * i <= m; i++) {
		while (m % (i * i) === 0) {
			m /= i * i;
			k *= i;
		}
	}
	const coef = q(k, x.den);
	if (m === 1) return { r: coef };
	// Radicands up to 99: √1801 among the options would be dropped at a glance.
	if (!coef.isInteger() || m > 99) return null;
	return { k: coef.num, m };
}

function valOption(v: Val): ChoiceOption {
	if ('r' in v) return { latex: `${numTex(v.r)}\\text{ cm}`, values: [v.r.toString()] };
	return { latex: `${v.k === 1 ? '' : v.k}\\sqrt{${v.m}}\\text{ cm}`, values: [`${v.k}*sqrt(${v.m})`] };
}

const degOption = (n: number): ChoiceOption => ({ latex: deg(n), values: [String(n)] });

/** A length of `lo` to `hi` cm, one time in four with the half. */
function length(rng: Rng, lo: number, hi: number): Rational {
	return rng.next() < 0.25 ? q(2 * rng.int(lo, hi - 1) + 1, 2) : q(rng.int(lo, hi));
}

/** A random multiple of 1/2 in the open interval (lo, hi), or null if there is none. */
function halfBetween(rng: Rng, lo: Rational, hi: Rational): Rational | null {
	const a = Math.floor(lo.num * 2 / lo.den) + 1;
	const b = Math.ceil(hi.num * 2 / hi.den) - 1;
	if (b < a) return null;
	return q(rng.int(a, b), 2);
}

/** Pythagorean triples [leg, leg, hypotenuse], scaled, hypotenuse at most `max`; 3-4-5 also by halves. */
const TRIPLES: [number, number, number][] = [
	[3, 4, 5],
	[5, 12, 13],
	[8, 15, 17],
	[7, 24, 25],
	[20, 21, 29],
	[12, 35, 37],
	[9, 40, 41],
];

function triple(rng: Rng, max: number, halves: boolean): [Rational, Rational, Rational] {
	const [a, b, c] = rng.pick(TRIPLES.filter((x) => x[2] <= max));
	const kmax = Math.floor(max / c);
	const k = halves && c === 5 ? q(rng.int(2, 2 * kmax), 2) : q(rng.int(1, kmax));
	const legs: [Rational, Rational] = rng.next() < 0.5 ? [q(a).mul(k), q(b).mul(k)] : [q(b).mul(k), q(a).mul(k)];
	return [legs[0], legs[1], q(c).mul(k)];
}

const sq = (r: Rational) => r.mul(r);
const cm = (r: Rational) => `${numTex(r)}\\text{ cm}`;

interface Built {
	case: string;
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: { kind: 'length'; value: Rational; wrong: (Val | null)[] } | { kind: 'deg'; value: number; wrong: number[] } | { kind: 'choice'; choice: ChoiceAnswer };
	params: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Levels 1 and 2: four points or four lines against the radius

type Pos = 'in' | 'on' | 'out';

function levelFour(rng: Rng, lines: boolean): Built {
	const asked = rng.pick(['in', 'on', 'out'] as const);
	const byDiameter = rng.next() < 0.5;
	const r = byDiameter ? q(rng.int(4, 24), 2) : length(rng, 2, 12);
	const D = r.mul(q(2));
	const others: Pos[] = asked === 'in' ? ['on', 'out', 'out'] : asked === 'out' ? ['on', 'in', 'in'] : ['in', 'out', rng.pick(['in', 'out'] as const)];
	for (;;) {
		const pos: Pos[] = [asked, ...others];
		const dist: Rational[] = [];
		let ok = true;
		pos.forEach((p, i) => {
			let d: Rational | null;
			// With the diameter given, one distance is the trap: compared with the diameter it looks like the answer.
			const trap = byDiameter && i === 1 + others.indexOf('out');
			if (p === 'on') d = r;
			else if (p === 'in') d = halfBetween(rng, q(0), r);
			else if (trap && asked === 'on') d = D;
			else if (trap && asked === 'in') d = halfBetween(rng, r, D);
			else d = halfBetween(rng, r, r.add(q(9)));
			if (!d) ok = false;
			else dist.push(d);
		});
		if (!ok || new Set(dist.map(String)).size !== 4) continue;
		const names = lines ? ['s', 't', 'u', 'v'] : ['A', 'B', 'C', 'D'];
		const order = shuffle(rng, [0, 1, 2, 3]);
		const items = order.map((j, i) => ({ name: names[i], dist: dist[j], pos: pos[j] }));
		const right = items.find((x) => x.pos === asked)!;
		const label = (n: string) => (lines ? `d_${n}` : bar(`O${n}`));
		const word = lines
			? { in: 'secante', on: 'tangente', out: 'esterna' }
			: { in: 'interno alla circonferenza', on: 'sulla circonferenza', out: 'esterno alla circonferenza' };
		const verb = !lines && asked === 'on' ? 'sta' : 'è';
		const noun = lines ? 'la retta ' : 'il punto ';
		const opt = (n: string): ChoiceOption => ({ latex: `${t(noun)}${n}`, values: [n] });
		const choice = buildChoice(rng, opt(right.name), items.filter((x) => x !== right).map((x) => opt(x.name)));
		const given = byDiameter ? `diametro $${numTex(D)}$ cm` : `raggio $${numTex(r)}$ cm`;
		const intro = lines
			? `Una circonferenza di centro $O$ ha ${given}. Le rette $s$, $t$, $u$, $v$ hanno dal centro le distanze scritte sotto. Quale retta è ${word[asked]} alla circonferenza?`
			: `Una circonferenza di centro $O$ ha ${given}. Quale di questi punti ${verb} ${word[asked]}?`;
		const givens = items.map((x) => `${label(x.name)} = ${cm(x.dist)}`).join(' \\quad ');
		const steps: string[] = [];
		if (byDiameter) steps.push(`${t('Il raggio è metà del diametro: ')}r = ${numTex(D)} : 2 = ${cm(r)}`);
		const rel = { in: '<', on: '=', out: '>' };
		for (const x of items) {
			steps.push(`${label(x.name)} = ${numTex(x.dist)} ${rel[x.pos]} ${numTex(r)}${t(`: ${noun}`)}${x.name}${t(` è ${word[x.pos]}`.replace('è sulla', 'sta sulla'))}`);
		}
		return {
			case: asked,
			prompt: lines ? 'Scegli la retta giusta.' : 'Scegli il punto giusto.',
			problem: textBlock(intro, 46, [givens]),
			solution: `${t(noun.charAt(0).toUpperCase() + noun.slice(1))}${right.name}${t(` ${verb} ${word[asked]}`)}`,
			steps,
			answer: { kind: 'choice', choice },
			params: {
				given: byDiameter ? 'diametro' : 'raggio',
				r: r.toString(),
				items: items.map((x) => ({ name: x.name, dist: x.dist.toString(), pos: x.pos })),
				right: right.name,
			},
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: two circles

type TwoPos = 'esterne' | 'tangenti esternamente' | 'secanti' | 'tangenti internamente' | 'interna';
const TWO_LABEL: Record<TwoPos, string> = {
	esterne: 'esterne',
	'tangenti esternamente': 'tangenti esternamente',
	secanti: 'secanti',
	'tangenti internamente': 'tangenti internamente',
	interna: "una interna all'altra",
};
// Distractors in order: the lesson's mistakes first (only the sum compared, external and internal swapped).
const TWO_WRONG: Record<TwoPos, TwoPos[]> = {
	esterne: ['interna', 'tangenti esternamente', 'secanti'],
	'tangenti esternamente': ['tangenti internamente', 'secanti', 'esterne'],
	secanti: ['tangenti esternamente', 'esterne', 'interna'],
	'tangenti internamente': ['tangenti esternamente', 'secanti', 'interna'],
	interna: ['secanti', 'esterne', 'tangenti internamente'],
};

function level3(rng: Rng): Built {
	const pos = rng.pick(['esterne', 'tangenti esternamente', 'secanti', 'tangenti internamente', 'interna'] as const);
	for (;;) {
		const r2 = length(rng, 1, 10);
		const r1 = r2.add(length(rng, 1, 8));
		const sum = r1.add(r2);
		const diff = r1.sub(r2);
		let d: Rational | null;
		const concentric = pos === 'interna' && rng.next() < 0.2;
		if (pos === 'esterne') d = halfBetween(rng, sum, sum.add(q(9)));
		else if (pos === 'tangenti esternamente') d = sum;
		else if (pos === 'secanti') d = halfBetween(rng, diff, sum);
		else if (pos === 'tangenti internamente') d = diff;
		else d = concentric ? q(0) : halfBetween(rng, q(0), diff);
		if (!d || sum.compare(q(25)) > 0) continue;
		const radii = rng.next() < 0.5 ? [r1, r2] : [r2, r1];
		const choice = buildChoice(
			rng,
			{ latex: t(TWO_LABEL[pos]), values: [pos] },
			TWO_WRONG[pos].map((p) => ({ latex: t(TWO_LABEL[p]), values: [p] })),
		);
		const problem = concentric
			? `Due circonferenze hanno lo stesso centro e raggi $${numTex(radii[0])}$ cm e $${numTex(radii[1])}$ cm. Come sono le due circonferenze?`
			: `Due circonferenze hanno raggi $${numTex(radii[0])}$ cm e $${numTex(radii[1])}$ cm, e i loro centri distano $${numTex(d)}$ cm. Come sono le due circonferenze?`;
		const cmp = (a: Rational, b: Rational) => (a.compare(b) < 0 ? '<' : a.compare(b) > 0 ? '>' : '=');
		const steps = [
			`${t('Somma dei raggi: ')}${numTex(r1)} + ${numTex(r2)} = ${cm(sum)}${t(', differenza: ')}${numTex(r1)} - ${numTex(r2)} = ${cm(diff)}`,
		];
		const why: Record<TwoPos, string> = {
			esterne: `d = ${numTex(d)} ${cmp(d, sum)} ${numTex(sum)}${t(': maggiore della somma, le circonferenze sono esterne')}`,
			'tangenti esternamente': `d = ${numTex(d)} = ${numTex(sum)}${t(': uguale alla somma, tangenti esternamente')}`,
			secanti: `${numTex(diff)} < ${numTex(d)} < ${numTex(sum)}${t(': tra la differenza e la somma, secanti')}`,
			'tangenti internamente': `d = ${numTex(d)} = ${numTex(diff)}${t(': uguale alla differenza, tangenti internamente')}`,
			interna: `d = ${numTex(d)} < ${numTex(diff)}${t(": minore della differenza, la più piccola è interna all'altra")}`,
		};
		if (concentric) steps.push(t('Lo stesso centro vuol dire distanza dei centri ') + `d = 0`);
		steps.push(why[pos]);
		return {
			case: pos,
			prompt: 'Scegli la posizione giusta.',
			problem: textBlock(problem),
			solution: t(`Le circonferenze sono ${TWO_LABEL[pos]}`),
			steps,
			answer: { kind: 'choice', choice },
			params: { radii: radii.map(String), d: d.toString(), concentric },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: chord, distance from the centre, radius

const CHORDS = ['AB', 'CD', 'MN', 'PQ'];

function level4(rng: Rng): Built {
	const ask = rng.pick(['corda', 'distanza', 'raggio'] as const);
	const [d, h, r] = triple(rng, 45, true); // distance, half chord, radius
	const c = h.mul(q(2));
	const AB = rng.pick(CHORDS);
	const B = AB[1];
	const tri = `${t('Nel triangolo ')}OH${B}${t(', rettangolo in ')}H`;
	const steps: string[] = [t('La perpendicolare ') + `OH${t(' dal centro alla corda la divide a metà, e ')}${bar('OH')}${t(' è la distanza della corda dal centro')}`];
	let problem: string;
	let value: Rational;
	let wrong: (Val | null)[];
	if (ask === 'corda') {
		problem = `Una circonferenza di centro $O$ ha raggio $${numTex(r)}$ cm, e la corda $${AB}$ ha distanza $${numTex(d)}$ cm dal centro. Quanto è lunga la corda $${AB}$?`;
		steps.push(`${tri}${t(': ')}${bar(`H${B}`)} = \\sqrt{${numTex(r)}^2 - ${numTex(d)}^2} = ${cm(h)}`);
		steps.push(`${bar(AB)} = 2 \\cdot ${numTex(h)} = ${cm(c)}`);
		value = c;
		// Half the chord; the squares added; 2(r - d); the diameter.
		wrong = [{ r: h }, sqrtVal(sq(r).add(sq(d)).mul(q(4))), { r: r.sub(d).mul(q(2)) }, { r: r.mul(q(2)) }];
	} else if (ask === 'distanza') {
		problem = `In una circonferenza di centro $O$ e raggio $${numTex(r)}$ cm la corda $${AB}$ è lunga $${numTex(c)}$ cm. Quanto dista la corda dal centro?`;
		steps.push(`${bar(`H${B}`)} = ${numTex(c)} : 2 = ${cm(h)}`);
		steps.push(`${tri}${t(': ')}${bar('OH')} = \\sqrt{${numTex(r)}^2 - ${numTex(h)}^2} = ${cm(d)}`);
		value = d;
		// The whole chord in the triangle (only when it is shorter than the radius); r - h; h and d swapped; 2d.
		wrong = [c.compare(r) < 0 ? sqrtVal(sq(r).sub(sq(c))) : null, { r: r.sub(h) }, { r: h }, { r: d.mul(q(2)) }];
	} else {
		problem = `In una circonferenza di centro $O$ la corda $${AB}$ è lunga $${numTex(c)}$ cm e ha distanza $${numTex(d)}$ cm dal centro. Quanto misura il raggio?`;
		steps.push(`${bar(`H${B}`)} = ${numTex(c)} : 2 = ${cm(h)}`);
		steps.push(`${tri}${t(', il raggio ')}O${B}${t(" è l'ipotenusa: ")}${bar(`O${B}`)} = \\sqrt{${numTex(h)}^2 + ${numTex(d)}^2} = ${cm(r)}`);
		value = r;
		// The whole chord in the triangle; the diameter; h + d.
		wrong = [sqrtVal(sq(c).add(sq(d))), { r: r.mul(q(2)) }, { r: h.add(d) }, { r: c }];
	}
	return {
		case: ask,
		prompt: 'Risolvi il problema.',
		problem: textBlock(problem),
		solution: `${ask === 'corda' ? bar(AB) : ask === 'distanza' ? bar('OH') : 'r'} = ${cm(value)}`,
		steps,
		answer: { kind: 'length', value, wrong },
		params: { ask, chord: AB, r: r.toString(), d: d.toString(), c: c.toString() },
	};
}

// ---------------------------------------------------------------------------
// Level 5: central and inscribed angles

function level5(rng: Rng): Built {
	const kind = rng.pick(['dal centro', 'dalla circonferenza', 'ottuso', 'altro arco'] as const);
	const AOB = wide('A', 'O', 'B');
	const AVB = wide('A', 'V', 'B');
	let problem: string;
	let value: number;
	let wrong: number[];
	let steps: string[];
	if (kind === 'dal centro') {
		const x = 2 * rng.int(10, 85);
		problem = `L'angolo al centro $${AOB}$ misura $${deg(x)}$. Quanto misura l'angolo alla circonferenza $${AVB}$ che insiste sullo stesso arco?`;
		value = x / 2;
		steps = [t("L'angolo alla circonferenza è la metà dell'angolo al centro corrispondente"), `${AVB} = ${deg(x)} : 2 = ${deg(value)}`];
		wrong = [2 * x, 180 - x / 2, x, 90 - x / 2];
	} else if (kind === 'dalla circonferenza' || kind === 'ottuso') {
		const y = kind === 'ottuso' ? 5 * rng.int(19, 35) : rng.int(10, 88);
		problem = `L'angolo alla circonferenza $${AVB}$ misura $${deg(y)}$. Quanto misura l'angolo al centro corrispondente?`;
		value = 2 * y;
		steps = [t("L'angolo al centro corrispondente è il doppio dell'angolo alla circonferenza"), `${AOB} = 2 \\cdot ${deg(y)} = ${deg(value)}`];
		if (kind === 'ottuso') {
			steps.unshift(t("L'angolo è ottuso: il vertice ") + `V${t(" sta sull'arco minore ")}AB${t(" e l'angolo insiste sull'arco maggiore")}`);
			steps.push(t("È un angolo concavo: l'angolo al centro convesso misura ") + `360^\\circ - ${deg(value)} = ${deg(360 - value)}`);
			wrong = [360 - 2 * y, y / 2, y, 180 - y];
		} else wrong = [y / 2, 360 - 2 * y, y, 180 - 2 * y];
	} else {
		const x = 2 * rng.int(10, 85);
		problem = `L'angolo al centro convesso $${AOB}$ misura $${deg(x)}$, e il punto $V$ sta sull'arco minore $AB$. Quanto misura l'angolo alla circonferenza $${AVB}$?`;
		value = 180 - x / 2;
		steps = [
			t('Con il vertice sull\'arco minore, ') + `${AVB}${t(" insiste sull'arco maggiore, e l'angolo al centro corrispondente è quello concavo")}`,
			`360^\\circ - ${deg(x)} = ${deg(360 - x)}`,
			`${AVB} = ${deg(360 - x)} : 2 = ${deg(value)}`,
		];
		wrong = [x / 2, 360 - x, 180 - x, 2 * x];
	}
	return {
		case: kind,
		prompt: 'Risolvi il problema.',
		problem: textBlock(problem),
		solution: `${kind === 'dal centro' || kind === 'altro arco' ? AVB : AOB} = ${deg(value)}`,
		steps,
		answer: { kind: 'deg', value, wrong },
		params: {},
	};
}

// ---------------------------------------------------------------------------
// Level 6: the two tangents from an external point

function level6(rng: Rng): Built {
	const kind = rng.pick(['angolo tra i raggi', 'angolo tra le tangenti', 'bisettrice', 'segmento di tangente'] as const);
	const APB = wide('A', 'P', 'B');
	const AOB = wide('A', 'O', 'B');
	const intro = 'Da un punto $P$ esterno a una circonferenza di centro $O$ si conducono le tangenti $PA$ e $PB$';
	const right = t('Le tangenti sono perpendicolari ai raggi nei punti di contatto: ') + `${wide('O', 'A', 'P')} = ${wide('O', 'B', 'P')} = 90^\\circ`;
	if (kind === 'segmento di tangente') {
		const [r, pa, op] = triple(rng, 45, true);
		const askPA = rng.next() < 2 / 3;
		const problem = askPA
			? `Da un punto $P$ si conduce la tangente $PA$ a una circonferenza di centro $O$ e raggio $${numTex(r)}$ cm, e $${bar('OP')} = ${numTex(op)}$ cm. Quanto è lungo il segmento di tangente $PA$?`
			: `Da un punto $P$ si conduce la tangente $PA$ a una circonferenza di centro $O$ e raggio $${numTex(r)}$ cm, e il segmento di tangente $PA$ è lungo $${numTex(pa)}$ cm. Quanto dista $P$ dal centro?`;
		const tri = `${t('Il triangolo ')}OAP${t(' è rettangolo in ')}A${t(', perché la tangente è perpendicolare al raggio ')}OA`;
		const steps = askPA
			? [tri, `${bar('PA')} = \\sqrt{${numTex(op)}^2 - ${numTex(r)}^2} = ${cm(pa)}`]
			: [tri, `${bar('OP')} = \\sqrt{${numTex(pa)}^2 + ${numTex(r)}^2} = ${cm(op)}`];
		// The squares added the wrong way; the difference of the lengths; the other leg.
		const wrong: (Val | null)[] = askPA
			? [sqrtVal(sq(op).add(sq(r))), { r: op.sub(r) }, { r: pa.mul(q(2)) }, { r: op }]
			: [sqrtVal(sq(pa).sub(sq(r)).abs()), { r: pa.add(r) }, { r: r.mul(q(2)) }, { r: pa }];
		return {
			case: kind,
			prompt: 'Risolvi il problema.',
			problem: textBlock(problem),
			solution: `${bar(askPA ? 'PA' : 'OP')} = ${cm(askPA ? pa : op)}`,
			steps,
			answer: { kind: 'length', value: askPA ? pa : op, wrong },
			params: { ask: askPA ? 'PA' : 'OP', r: r.toString(), pa: pa.toString(), op: op.toString() },
		};
	}
	const x = 2 * rng.int(10, 80);
	let problem: string;
	let value: number;
	let wrong: number[];
	let steps: string[];
	if (kind === 'angolo tra i raggi') {
		problem = `${intro}, e $${APB} = ${deg(x)}$. Quanto misura l'angolo $${AOB}$?`;
		value = 180 - x;
		steps = [right, t('Nel quadrilatero ') + `OAPB${t(' la somma degli angoli è ')}360^\\circ`, `${AOB} = 360^\\circ - 90^\\circ - 90^\\circ - ${deg(x)} = ${deg(value)}`];
		wrong = [360 - x, x, 90 - x / 2, 180 - x / 2];
	} else if (kind === 'angolo tra le tangenti') {
		problem = `${intro}, e $${AOB} = ${deg(x)}$. Quanto misura l'angolo $${APB}$ tra le tangenti?`;
		value = 180 - x;
		steps = [right, t('Nel quadrilatero ') + `OAPB${t(' la somma degli angoli è ')}360^\\circ`, `${APB} = 360^\\circ - 90^\\circ - 90^\\circ - ${deg(x)} = ${deg(value)}`];
		wrong = [360 - x, x, 90 - x / 2, 180 - x / 2];
	} else {
		const AOP = wide('A', 'O', 'P');
		const APO = wide('A', 'P', 'O');
		problem = `${intro}, e $${APB} = ${deg(x)}$. Quanto misura l'angolo $${AOP}$?`;
		value = 90 - x / 2;
		steps = [
			t('Il segmento ') + `OP${t(' è bisettrice di ')}${APB}${t(': ')}${APO} = ${deg(x)} : 2 = ${deg(x / 2)}`,
			t('Il triangolo ') + `OAP${t(' è rettangolo in ')}A${t(', perché la tangente è perpendicolare al raggio')}`,
			`${AOP} = 90^\\circ - ${deg(x / 2)} = ${deg(value)}`,
		];
		wrong = [180 - x, x / 2, 90 - x, 90 + x / 2];
	}
	return {
		case: kind,
		prompt: 'Risolvi il problema.',
		problem: textBlock(problem),
		solution: `${kind === 'angolo tra i raggi' ? AOB : kind === 'angolo tra le tangenti' ? APB : wide('A', 'O', 'P')} = ${deg(value)}`,
		steps,
		answer: { kind: 'deg', value, wrong },
		params: { x },
	};
}

// ---------------------------------------------------------------------------
// Level 7: the triangle inscribed in a semicircle

function level7(rng: Rng): Built {
	const kind = rng.pick(['angolo', 'cateto', 'raggio'] as const);
	const V = shuffle(rng, ['A', 'B', 'C']);
	const [X, Y, Z] = V; // XY is the diameter, Z the vertex of the right angle
	const diam = [X, Y].sort().join('');
	const leg = (u: string) => [u, Z].sort().join('');
	if (kind === 'angolo') {
		let a = rng.int(10, 80);
		if (a === 45) a = 46;
		const problem = `Il triangolo $ABC$ è inscritto in una circonferenza e il lato $${diam}$ è un diametro. Se $${hat(X)} = ${deg(a)}$, quanto misura $${hat(Y)}$?`;
		const value = 90 - a;
		return {
			case: kind,
			prompt: 'Risolvi il problema.',
			problem: textBlock(problem),
			solution: `${hat(Y)} = ${deg(value)}`,
			steps: [
				t("L'angolo in ") + `${Z}${t(' insiste su una semicirconferenza, quindi è retto: ')}${hat(Z)} = 90^\\circ`,
				t('Gli angoli acuti di un triangolo rettangolo sono complementari: ') + `${hat(Y)} = 90^\\circ - ${deg(a)} = ${deg(value)}`,
			],
			answer: { kind: 'deg', value, wrong: [180 - a, a, 180 - 2 * a, 90 + a] },
			params: { diameter: diam, given: X, a, ask: Y },
		};
	}
	const [c1, c2, D] = triple(rng, 40, kind === 'cateto');
	if (kind === 'cateto') {
		const byRadius = rng.next() < 0.4 && D.den === 1;
		const r = D.mul(q(1, 2));
		const data = byRadius
			? `In una circonferenza di raggio $${numTex(r)}$ cm il lato $${diam}$ del triangolo $ABC$ è un diametro, e il vertice $${Z}$ sta sulla circonferenza.`
			: `Il triangolo $ABC$ ha il vertice $${Z}$ su una circonferenza di diametro $${bar(diam)} = ${numTex(D)}$ cm.`;
		const problem = `${data} Se $${bar(leg(X))} = ${numTex(c1)}$ cm, quanto è lungo $${leg(Y)}$?`;
		const steps = [t("L'angolo in ") + `${Z}${t(' insiste su una semicirconferenza, quindi è retto, e il diametro ')}${diam}${t(" è l'ipotenusa")}`];
		if (byRadius) steps.unshift(`${bar(diam)} = 2 \\cdot ${numTex(r)} = ${cm(D)}`);
		steps.push(`${bar(leg(Y))} = \\sqrt{${numTex(D)}^2 - ${numTex(c1)}^2} = ${cm(c2)}`);
		return {
			case: kind,
			prompt: 'Risolvi il problema.',
			problem: textBlock(problem),
			solution: `${bar(leg(Y))} = ${cm(c2)}`,
			steps,
			// The diameter as a leg; the difference; the radius as the hypotenuse; the diameter itself.
			answer: { kind: 'length', value: c2, wrong: [sqrtVal(sq(D).add(sq(c1))), { r: D.sub(c1) }, byRadius ? sqrtVal(sq(r).sub(sq(c1)).abs()) : { r: c1 }, { r: D }] },
			params: { diameter: diam, vertex: Z, given: byRadius ? 'raggio' : 'diametro', D: D.toString(), leg: c1.toString() },
		};
	}
	const r = D.mul(q(1, 2));
	const problem = `Il triangolo $ABC$ ha i lati $${bar(leg(X))} = ${numTex(c1)}$ cm e $${bar(leg(Y))} = ${numTex(c2)}$ cm, ed è inscritto in una semicirconferenza di diametro $${diam}$. Quanto misura il raggio della circonferenza?`;
	return {
		case: kind,
		prompt: 'Risolvi il problema.',
		problem: textBlock(problem),
		solution: `r = ${cm(r)}`,
		steps: [
			t("L'angolo in ") + `${Z}${t(' insiste su una semicirconferenza, quindi è retto, e il diametro ')}${diam}${t(" è l'ipotenusa")}`,
			`${bar(diam)} = \\sqrt{${numTex(c1)}^2 + ${numTex(c2)}^2} = ${cm(D)}`,
			`r = ${numTex(D)} : 2 = ${cm(r)}`,
		],
		// The diameter taken for the radius; half the sum of the legs; the sum of the legs.
		answer: { kind: 'length', value: r, wrong: [{ r: D }, { r: c1.add(c2).mul(q(1, 2)) }, { r: c1.add(c2) }, { r: D.mul(q(1, 4)) }] },
		params: { diameter: diam, vertex: Z, legs: [c1.toString(), c2.toString()] },
	};
}

// ---------------------------------------------------------------------------

function build(rng: Rng, level: number): Built {
	switch (level) {
		case 1:
			return levelFour(rng, false);
		case 2:
			return levelFour(rng, true);
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
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

const valKey = (v: Val) => ('r' in v ? v.r.toString() : `${v.k}*sqrt(${v.m})`);
const valNum = (v: Val) => ('r' in v ? v.r.num / v.r.den : v.k * Math.sqrt(v.m));

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const lvl = sample.level;
	if (!sample.steps.length) v.push('nessun passaggio');
	if (/—|piuttosto che/.test(sample.problem + sample.steps.join(' '))) v.push('parole vietate');
	if (lvl <= 3) {
		const a = sample.answer;
		if (a.kind !== 'choice') return ['risposta non a scelta'];
		if (a.options.length !== 4) v.push('servono 4 opzioni');
		if (lvl <= 2) {
			const items = p.items as { name: string; dist: string; pos: Pos }[];
			const r = R(p.r as string);
			const pos = (d: Rational): Pos => (d.compare(r) < 0 ? 'in' : d.equals(r) ? 'on' : 'out');
			const hits = items.filter((x) => pos(R(x.dist)) === p.case);
			if (hits.length !== 1) v.push(`${hits.length} oggetti nella posizione chiesta`);
			if (a.options[a.correct].values[0] !== p.right || hits[0]?.name !== p.right) v.push('opzione giusta sbagliata');
			if (new Set(items.map((x) => x.dist)).size !== 4) v.push('distanze ripetute');
			if (items.some((x) => R(x.dist).sign() <= 0)) v.push('distanza non positiva');
		} else {
			const [ra, rb] = (p.radii as string[]).map(R);
			const d = R(p.d as string);
			const big = ra.compare(rb) > 0 ? ra : rb;
			const small = ra.compare(rb) > 0 ? rb : ra;
			if (big.equals(small)) v.push('raggi uguali');
			const s = big.add(small);
			const df = big.sub(small);
			const truth: TwoPos = d.compare(s) > 0 ? 'esterne' : d.equals(s) ? 'tangenti esternamente' : d.compare(df) > 0 ? 'secanti' : d.equals(df) ? 'tangenti internamente' : 'interna';
			if (truth !== p.case || a.options[a.correct].values[0] !== truth) v.push('posizione sbagliata');
		}
		return v;
	}
	const unit = p.unit as string;
	const value = R((sample.answer as { value: string }).value);
	if (value.sign() <= 0) v.push('risposta non positiva');
	if (unit === 'deg') {
		if (!value.isInteger() || value.num >= 360) v.push('angolo fuori dai limiti');
		if (lvl === 7 && value.num >= 90) v.push('angolo acuto non acuto');
		if (lvl === 6 && value.num >= 180) v.push('angolo del quadrilatero non convesso');
	} else {
		if (value.den > 2) v.push('lunghezza con più di un decimale');
		if (value.compare(q(100)) > 0) v.push('lunghezza troppo grande');
		if (lvl === 4) {
			const r = R(p.r as string);
			const d = R(p.d as string);
			const c = R(p.c as string);
			if (!sq(r).equals(sq(d).add(sq(c.mul(q(1, 2)))))) v.push('corda, distanza e raggio incoerenti');
			if (c.compare(r.mul(q(2))) >= 0) v.push('corda non minore del diametro');
		}
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const value = R((sample.answer as { value: string }).value);
	const unit = sample.params.unit as string;
	const wrong = (sample.params.wrong as string[]) ?? [];
	if (unit === 'deg') {
		const fallback = (i: number) => {
			const k = Math.floor(i / 2) + 1;
			const w = value.num + 10 * (i % 2 ? -k : k);
			return w <= 0 || w >= 360 ? null : degOption(w);
		};
		return buildChoice(rng, degOption(value.num), wrong.map((w) => degOption(Number(w))), fallback);
	}
	const step = value.isInteger() ? q(1) : q(1, 2);
	const parse = (s: string): Val => {
		const m = /^(\d+)\*sqrt\((\d+)\)$/.exec(s);
		return m ? { k: Number(m[1]), m: Number(m[2]) } : { r: R(s) };
	};
	const fallback = (i: number) => {
		const k = Math.floor(i / 2) + 1;
		const w = value.add(step.mul(q(i % 2 ? -k : k)));
		return w.sign() <= 0 ? null : valOption({ r: w });
	};
	return buildChoice(rng, valOption({ r: value }), wrong.map((w) => valOption(parse(w))), fallback);
}

export const circonferenzaCerchio: Generator = {
	id: ID,
	title: 'Circonferenza e cerchio',
	levels: {
		1: { label: 'Punti interni ed esterni', constraints: ['quattro punti, uno solo nella posizione chiesta', 'metà delle volte è dato il diametro'] },
		2: { label: 'Retta e circonferenza', constraints: ['quattro rette, una sola secante, tangente o esterna', 'metà delle volte è dato il diametro'] },
		3: { label: 'Due circonferenze', constraints: ['cinque posizioni, un quinto ciascuna', 'raggi diversi, somma al massimo 25 cm'] },
		4: { label: 'Corda, distanza e raggio', constraints: ['terne pitagoriche', 'chiesta la corda, la distanza o il raggio'] },
		5: { label: 'Angolo al centro e alla circonferenza', constraints: ["dall'angolo al centro, dall'angolo alla circonferenza, ottuso con l'angolo al centro concavo, vertice sull'arco minore"] },
		6: { label: 'Le tangenti da un punto esterno', constraints: ['angolo tra i raggi, tra le tangenti, bisettrice, segmento di tangente'] },
		7: { label: 'Il triangolo nella semicirconferenza', constraints: ["l'angolo acuto mancante, un cateto, il raggio"] },
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
				answer: answer.kind === 'choice' ? answer.choice : { kind: 'number', value: answer.kind === 'deg' ? String(answer.value) : answer.value.toString() },
				params: { case: b.case, ...b.params },
			};
			if (answer.kind === 'deg') {
				sample.params.unit = 'deg';
				sample.params.wrong = [...new Set(answer.wrong.filter((w) => Number.isInteger(w) && w > 0 && w < 360 && w !== answer.value))].map(String);
			} else if (answer.kind === 'length') {
				const truth = answer.value.num / answer.value.den;
				const ws = answer.wrong.filter((w): w is Val => w !== null && ('r' in w ? w.r.sign() > 0 && w.r.den <= 2 : true) && Math.abs(valNum(w) - truth) > 1e-9);
				sample.params.unit = 'cm';
				sample.params.wrong = [...new Set(ws.map(valKey))];
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

export default circonferenzaCerchio;
