/**
 * Prodotto scalare e prodotto vettoriale. Spec: specs/exercises/fis-prodotto-scalare-vettoriale.md
 *
 * Seven levels from the lesson (docs/lezioni/fisica/riscritte/71-fis-prodotto-scalare-vettoriale.md), each one step
 * harder: the scalar product F s cos α with an acute angle (a work, in joules); with an obtuse angle, where it is
 * negative; from the components, a_x b_x + a_y b_y; the angle between two vectors from their components; the modulus
 * of the vector product r F sin α; its component along z for two vectors of the plane, a_x b_y − a_y b_x, whose sign
 * says whether it comes out of the page or goes into it; the three components in space. Data with two significant
 * figures or small whole components, answers with two significant figures (src/lib/exercises/v2/fis-lavoro.ts), whole
 * degrees, never ending with an ambiguous zero. Distractors from the lesson's warnings: sine for cosine, the sign of
 * an obtuse angle's cosine, the two products swapped, the order of the factors, the sign of c_y.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { BANNED, choiceOf, roundDeg, scene, t } from '../vettori';
import { type Built, degOpt, generateWith, lab, opts as someOpts } from '../fisica-equilibrio';
import { approx, around, pq, q2, qOpt2, qty, sig2, some, two } from '../fis-lavoro';
import { cut4 } from '../fis-forze-movimento';

export const ID = 'fis-prodotto-scalare-vettoriale';

const DEG = Math.PI / 180;
/** The unit N·m inside fis-lavoro's \text{…}: \text{N}\cdot\text{m}. */
const NM = 'N}\\cdot\\text{m';

/** An answer option, refused when the rounded value is a two-digit number ending in zero. */
function ans(x: number, unit: string): ChoiceOption {
	const s = sig2(x);
	const o = qOpt2(x, unit);
	if (!s || !o || /^-?[1-9]0$/.test(s.value)) throw new Error('rounding');
	return o;
}
const opts = (xs: number[], unit: string) => some(xs.filter((x) => Number.isFinite(x) && x !== 0).map((x) => qOpt2(x, unit)));
const par = (n: number) => (n < 0 ? `(${n})` : `${n}`);
/** A whole component from −9 to 9, not zero. */
const comp = (rng: Rng, max = 9) => rng.int(1, max) * (rng.next() < 0.5 ? 1 : -1);

// ---------------------------------------------------------------------------
// Levels 1 and 2: F · s from the moduli and the angle, acute and then obtuse

function work(rng: Rng, obtuse: boolean): Built {
	const F = two(rng, false), s = two(rng, true);
	const a = obtuse ? rng.int(100, 170) : rng.int(10, 80);
	if (a % 10 === 0 && a % 30 !== 0 && rng.next() < 0.5) throw new Error('fewer round angles');
	const f = Number(F), d = Number(s);
	const W = f * d * Math.cos(a * DEG);
	const steps = [t("Il prodotto scalare è il prodotto dei moduli per il coseno dell'angolo tra i due vettori:"), `W = \\vec F \\cdot \\vec s = F\\,s\\cos\\alpha = ${qty(F, 'N')} \\cdot ${qty(s, 'm')} \\cdot \\cos ${a}^\\circ = ${approx(W, 'J')}`];
	if (obtuse) steps.push(t("L'angolo è ottuso, il coseno è negativo: la forza si oppone allo spostamento."));
	return {
		prompt: 'Trova il prodotto scalare.',
		problem: textBlock(`Una forza di modulo ${pq(F, 'N')} agisce su un corpo che si sposta di ${pq(s, 'm')}. Forza e spostamento formano un angolo di $${a}^\\circ$. Quanto vale il lavoro $W = \\vec F \\cdot \\vec s$?`),
		solution: `W \\approx ${q2(W, 'J')}`,
		steps,
		// acute: sine for cosine, the product of the moduli; obtuse: the sign forgotten, the sine, minus the product
		answer: choiceOf(rng, ans(W, 'J'), obtuse ? opts([-W, f * d * Math.sin(a * DEG), -f * d], 'J') : opts([f * d * Math.sin(a * DEG), f * d, f * Math.cos(a * DEG)], 'J'), around(W, 'J')),
		params: { F, s, angle: a },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the scalar product from the components

function fromComponents(rng: Rng): Built {
	const fx = comp(rng), fy = comp(rng), sx = comp(rng), sy = comp(rng);
	if (fx > 0 && fy > 0 && sx > 0 && sy > 0) throw new Error('one negative component at least');
	const W = fx * sx + fy * sy;
	if (W === 0) throw new Error('zero');
	return {
		prompt: 'Trova il prodotto scalare dalle componenti.',
		problem: textBlock(`Una forza ha componenti $F_x = ${fx}\\,\\text{N}$ e $F_y = ${fy}\\,\\text{N}$. Il corpo su cui agisce compie uno spostamento di componenti $s_x = ${sx}\\,\\text{m}$ e $s_y = ${sy}\\,\\text{m}$. Quanto lavoro compie la forza?`),
		solution: `W = ${q2(W, 'J')}`,
		steps: [
			t('Con le componenti il prodotto scalare è la somma dei prodotti delle componenti omonime:'),
			`W = \\vec F \\cdot \\vec s = F_x\\,s_x + F_y\\,s_y = ${par(fx)} \\cdot ${par(sx)} + ${par(fy)} \\cdot ${par(sy)} = ${fx * sx} ${fy * sy < 0 ? '-' : '+'} ${Math.abs(fy * sy)} = ${W}\\,\\text{J}`,
		],
		// the vector product's formula; the minus sign between the products; the components crossed
		answer: choiceOf(rng, ans(W, 'J'), opts([fx * sy - fy * sx, fx * sx - fy * sy, fx * sy + fy * sx, -W], 'J'), around(W, 'J')),
		params: { fx, fy, sx, sy },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the angle between two vectors

function angleBetween(rng: Rng): Built {
	const ax = comp(rng, 6), ay = comp(rng, 6), bx = comp(rng, 6), by = comp(rng, 6);
	const d = ax * bx + ay * by;
	const a = Math.hypot(ax, ay), b = Math.hypot(bx, by);
	const cos = d / (a * b);
	const alpha = Math.acos(Math.max(-1, Math.min(1, cos))) / DEG;
	const ansDeg = roundDeg(alpha);
	if (ansDeg === null || alpha < 15 || alpha > 165 || d === 0) throw new Error('angle out of range');
	const n = Number(ansDeg);
	const mod = (x: number, y: number, name: string) => `${name} = \\sqrt{${par(x)}^2 + ${par(y)}^2} = ${Number.isInteger(Math.hypot(x, y)) ? Math.hypot(x, y) : cut4(Math.hypot(x, y))}`;
	return {
		prompt: "Trova l'angolo tra i due vettori.",
		problem: textBlock(`I vettori $\\vec a$ e $\\vec b$ hanno componenti $\\vec a = (${ax};\\ ${ay})$ e $\\vec b = (${bx};\\ ${by})$. Quanto vale l'angolo tra i due vettori?`),
		solution: `\\alpha \\approx ${ansDeg}^\\circ`,
		steps: [
			`\\vec a \\cdot \\vec b = a_x\\,b_x + a_y\\,b_y = ${par(ax)} \\cdot ${par(bx)} + ${par(ay)} \\cdot ${par(by)} = ${d}`,
			`${mod(ax, ay, 'a')} \\qquad ${mod(bx, by, 'b')}`,
			`\\cos\\alpha = \\dfrac{\\vec a \\cdot \\vec b}{a\\,b} = ${cut4(cos)} \\quad\\Rightarrow\\quad \\alpha = \\cos^{-1}(${cut4(cos)}) = ${cut4(alpha)}^\\circ \\approx ${ansDeg}^\\circ`,
		],
		// the sign of the scalar product lost (the supplementary angle); sine for cosine
		answer: choiceOf(
			rng,
			degOpt(ansDeg),
			someOpts([String(180 - n), String(Math.abs(90 - n))], degOpt).filter((o) => Number(o.values[0]) >= 5),
			[n + 12, n - 12, n + 25, n - 25].filter((y) => y >= 5 && y <= 175).map((y) => degOpt(String(y))),
		),
		params: { ax, ay, bx, by },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the modulus of the vector product

function crossModulus(rng: Rng): Built {
	const r = (rng.int(11, 99) / 100).toFixed(2), F = two(rng, false);
	if (r.endsWith('0')) throw new Error('ambiguous zero');
	const a = rng.int(2, 16) * 10 + (rng.next() < 0.5 ? 0 : 5);
	if (a === 90 || a > 160) throw new Error('angle');
	const R = Number(r), f = Number(F);
	const M = R * f * Math.sin(a * DEG);
	return {
		prompt: 'Trova il modulo del prodotto vettoriale.',
		problem: textBlock(`Il vettore $\\vec r$, di modulo ${pq(r, 'm')}, e la forza $\\vec F$, di modulo ${pq(F, 'N')}, partono dallo stesso punto e formano un angolo di $${a}^\\circ$. Quanto vale il modulo di $\\vec r \\times \\vec F$?`),
		solution: `|\\vec r \\times \\vec F| \\approx ${q2(M, NM)}`,
		steps: [
			t("Il modulo del prodotto vettoriale è il prodotto dei moduli per il seno dell'angolo tra i due vettori:"),
			`|\\vec r \\times \\vec F| = r\\,F\\sin\\alpha = ${qty(r, 'm')} \\cdot ${qty(F, 'N')} \\cdot \\sin ${a}^\\circ = ${approx(M, NM)}`,
		],
		// cosine for sine (without its sign); the product of the moduli; divided by the sine
		answer: choiceOf(rng, ans(M, NM), opts([Math.abs(R * f * Math.cos(a * DEG)), R * f, (R * f) / Math.sin(a * DEG)], NM), around(M, NM)),
		params: { r, F, angle: a },
		scene: scene(`Il vettore r, lungo ${lab(r)} metri, e la forza F, di ${lab(F)} newton, partono dallo stesso punto e formano un angolo di ${a} gradi.`, {
			u: 0.6,
			vettori: [
				{ da: [0, 0], a: [4, 0], nome: 'r', colore: 'vettore', etichetta: `${lab(r)} m` },
				{ da: [0, 0], a: [3 * Math.cos(a * DEG), 3 * Math.sin(a * DEG)], nome: 'F', colore: 'forza', etichetta: `${lab(F)} N` },
			],
			angoli: [{ vettore: 1, rif: 'x', testo: `${a}°`, antiorario: true }],
		}),
	};
}

// ---------------------------------------------------------------------------
// Level 6: the vector product of two vectors of the plane, with its direction

const sideOpt = (cz: number): ChoiceOption => ({ latex: `${Math.abs(cz)}\\text{, ${cz > 0 ? 'esce dal foglio' : 'entra nel foglio'}}`, values: [String(cz)] });

function crossPlane(rng: Rng): Built {
	const ax = comp(rng, 6), ay = comp(rng, 6), bx = comp(rng, 6), by = comp(rng, 6);
	const cz = ax * by - ay * bx;
	if (cz === 0) throw new Error('parallel');
	const d = ax * bx + ay * by, sum = ax * by + ay * bx;
	const seen = new Set([cz]);
	const mistakes: ChoiceOption[] = [];
	// the factors swapped; the scalar product's formula; the plus sign between the products
	for (const x of [-cz, d, sum, -sum, cz + 2, -(cz + 2), cz - 2]) {
		if (x === 0 || seen.has(x)) continue;
		seen.add(x);
		mistakes.push(sideOpt(x));
	}
	return {
		prompt: 'Trova il prodotto vettoriale e il suo verso.',
		problem: textBlock(`I vettori $\\vec a = (${ax};\\ ${ay})$ e $\\vec b = (${bx};\\ ${by})$ stanno nel piano del foglio, con l'asse $x$ verso destra e l'asse $y$ verso l'alto. Quanto vale il modulo di $\\vec a \\times \\vec b$, e il prodotto esce dal foglio o vi entra?`),
		solution: `|\\vec a \\times \\vec b| = ${Math.abs(cz)}\\text{, ${cz > 0 ? 'esce dal foglio' : 'entra nel foglio'}}`,
		steps: [
			t('Per due vettori del piano il prodotto vettoriale ha solo la componente lungo z:'),
			`c_z = a_x\\,b_y - a_y\\,b_x = ${par(ax)} \\cdot ${par(by)} - ${par(ay)} \\cdot ${par(bx)} = ${ax * by} ${ay * bx < 0 ? '+' : '-'} ${Math.abs(ay * bx)} = ${cz}`,
			t(cz > 0 ? 'La componente è positiva: il prodotto esce dal foglio, e da a verso b si ruota in senso antiorario.' : 'La componente è negativa: il prodotto entra nel foglio, e da a verso b si ruota in senso orario.'),
		],
		answer: choiceOf(rng, sideOpt(cz), mistakes),
		params: { ax, ay, bx, by },
	};
}

// ---------------------------------------------------------------------------
// Level 7: the three components in space

type V3 = [number, number, number];
const tripleOpt = (c: V3): ChoiceOption => ({ latex: `(${c[0]};\\ ${c[1]};\\ ${c[2]})`, values: c.map(String) });

function crossSpace(rng: Rng): Built {
	const c3 = (): V3 => [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)];
	const a = c3(), b = c3();
	if (a.filter((x) => x === 0).length + b.filter((x) => x === 0).length > 1) throw new Error('too many zeros');
	const c: V3 = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
	if (c[1] === 0 || c.filter((x) => x === 0).length > 1) throw new Error('degenerate');
	const seen = new Set([c.join()]);
	const mistakes: ChoiceOption[] = [];
	// the sign of c_y; the factors swapped; the components multiplied one by one; the components out of place
	for (const m of [[c[0], -c[1], c[2]], [-c[0], -c[1], -c[2]], [a[0] * b[0], a[1] * b[1], a[2] * b[2]], [c[2], c[0], c[1]], [-c[0], c[1], -c[2]]] as V3[]) {
		if (seen.has(m.join())) continue;
		seen.add(m.join());
		mistakes.push(tripleOpt(m));
	}
	const term = (p: number, q: number, r: number, s: number) => `${par(p)} \\cdot ${par(q)} - ${par(r)} \\cdot ${par(s)}`;
	return {
		prompt: 'Trova le componenti del prodotto vettoriale.',
		problem: textBlock(`Nello spazio i vettori $\\vec a$ e $\\vec b$ hanno componenti $\\vec a = (${a[0]};\\ ${a[1]};\\ ${a[2]})$ e $\\vec b = (${b[0]};\\ ${b[1]};\\ ${b[2]})$. Quali sono le componenti di $\\vec c = \\vec a \\times \\vec b$?`),
		solution: `\\vec c = (${c[0]};\\ ${c[1]};\\ ${c[2]})`,
		steps: [
			`c_x = a_y\\,b_z - a_z\\,b_y = ${term(a[1], b[2], a[2], b[1])} = ${c[0]}`,
			`c_y = a_z\\,b_x - a_x\\,b_z = ${term(a[2], b[0], a[0], b[2])} = ${c[1]}`,
			`c_z = a_x\\,b_y - a_y\\,b_x = ${term(a[0], b[1], a[1], b[0])} = ${c[2]}`,
			t('Controllo: il prodotto scalare di c con a e con b è zero, perché c è perpendicolare a tutti e due.'),
		],
		answer: choiceOf(rng, tripleOpt(c), mistakes),
		params: { a, b },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = {
	1: (rng) => work(rng, false),
	2: (rng) => work(rng, true),
	3: fromComponents,
	4: angleBetween,
	5: crossModulus,
	6: crossPlane,
	7: crossSpace,
};

/** The common checks of fisica-equilibrio, without the rule on the options' first value: level 7's options are triples. */
function check(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test([sample.problem, sample.solution, ...sample.steps].join(' '))) v.push('parole vietate');
	const a = sample.answer;
	if (a.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
	if (a.options.length !== 4 || new Set(a.options.map((o) => o.latex)).size !== 4) v.push('servono quattro opzioni diverse');
	if (new Set(a.options.map((o) => o.values.join())).size !== 4) v.push('due opzioni con lo stesso valore');
	if (!(a.correct >= 0 && a.correct < a.options.length)) v.push("indice dell'opzione giusta fuori dai limiti");
	if ((sample.level === 5) !== !!sample.scene) v.push(sample.level === 5 ? 'manca la scena' : 'scena di troppo');
	return v;
}

export const fisProdottoScalareVettoriale: Generator = {
	id: ID,
	title: 'Prodotto scalare e prodotto vettoriale',
	levels: {
		1: { label: 'Il prodotto scalare con un angolo acuto', constraints: ['angolo da 10° a 80°', 'F s cos α in joule'] },
		2: { label: "L'angolo ottuso e il segno", constraints: ['angolo da 100° a 170°', 'risultato negativo'] },
		3: { label: 'Il prodotto scalare dalle componenti', constraints: ['componenti intere non nulle, almeno una negativa', 'risultato diverso da zero'] },
		4: { label: "L'angolo tra due vettori", constraints: ['angolo tra 15° e 165°, al grado', 'prodotto scalare diverso da zero'] },
		5: { label: 'Il modulo del prodotto vettoriale', constraints: ['angolo da 20° a 160°, mai 90°', 'r F sin α in N·m'] },
		6: { label: 'Il prodotto vettoriale nel piano', constraints: ['c_z = a_x b_y − a_y b_x diverso da zero', 'il segno dà il verso'] },
		7: { label: 'Le componenti nello spazio', constraints: ['componenti intere da −4 a 4, al più uno zero', 'c_y diverso da zero'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisProdottoScalareVettoriale;
