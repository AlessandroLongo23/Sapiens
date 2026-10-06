/**
 * Il lavoro di una forza variabile. Spec: specs/exercises/fis-lavoro-forza-variabile.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/77-fis-lavoro-forza-variabile.md), each one step harder:
 * the work as the area under a force-displacement graph made of straight pieces; a graph that goes below the axis,
 * where the area counts as negative; the mean force W / Δx; the work of the elastic force between two deformations,
 * ½ k x1² − ½ k x2², with its sign; the final speed of a cart from the area, with the theorem of kinetic energy; the
 * compression of a spring that stops a cart, x = v √(m/k). Graphs have whole coordinates, so the areas are exact;
 * answers have two significant figures (src/lib/exercises/v2/fis-lavoro.ts) and never end with an ambiguous zero.
 * Distractors from the lesson's warnings: force times displacement with the largest force, the areas below the axis
 * added as positive, the mean of the end values, the square of the difference, the sign of the elastic work.
 */
import type { ChoiceOption, Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, t } from '../vettori';
import { type Built, checkCommon, generateWith } from '../fisica-equilibrio';
import { approx, around, decTex, pq, q2, qOpt2, qty, sig2, some, three, two } from '../fis-lavoro';
import { cut4 } from '../fis-forze-movimento';

export const ID = 'fis-lavoro-forza-variabile';

type Pt = [number, number];

/** An answer option, refused when the rounded value is a two-digit number ending in zero (20 J, 50 N: ambiguous). */
function ans(x: number, unit: string): ChoiceOption {
	const s = sig2(x);
	const o = qOpt2(x, unit);
	if (!s || !o || /^-?[1-9]0$/.test(s.value)) throw new Error('rounding');
	return o;
}
const opts = (xs: number[], unit: string) => some(xs.filter((x) => Number.isFinite(x) && x !== 0).map((x) => qOpt2(x, unit)));
const num = (x: number) => decTex(String(x));
const N = (x: number) => `${num(x)}\\,\\text{N}`;
const M = (x: number) => `${num(x)}\\,\\text{m}`;
const Jn = (x: number) => `${num(x)}\\,\\text{J}`;

function graph(alt: string, pts: Pt[], areas = false): SceneRef {
	const fs = pts.map((p) => p[1]);
	const step = fs.every((y) => y % 2 === 0) ? 2 : 1;
	const fMax = Math.max(...fs) + step;
	const fMin = Math.min(0, ...fs);
	return { type: 'grafico-forza-spostamento', data: { xMax: pts[pts.length - 1][0], xPasso: 1, fMin, fMax, fPasso: step, punti: pts, aree: areas }, alt };
}

/** The area under each straight piece, with the step that computes it. */
function pieces(pts: Pt[]): { W: number; steps: string[]; parts: number[] } {
	const steps: string[] = [];
	const parts: number[] = [];
	for (let i = 0; i + 1 < pts.length; i++) {
		const [x1, f1] = pts[i], [x2, f2] = pts[i + 1];
		const dx = x2 - x1;
		if (dx === 0) continue;
		const w = ((f1 + f2) * dx) / 2;
		const n = parts.length + 1;
		parts.push(w);
		if (f1 === f2) steps.push(`W_${n} = ${N(f1)} \\cdot ${M(dx)} = ${Jn(w)} \\quad \\text{(rettangolo)}`);
		else if (f1 === 0 || f2 === 0) steps.push(`W_${n} = \\tfrac{1}{2} \\cdot ${M(dx)} \\cdot ${f1 + f2 < 0 ? `(${N(f1 + f2)})` : N(f1 + f2)} = ${Jn(w)} \\quad \\text{(triangolo)}`);
		else steps.push(`W_${n} = \\tfrac{1}{2} \\cdot (${N(f1)} + ${N(f2)}) \\cdot ${M(dx)} = ${Jn(w)} \\quad \\text{(trapezio)}`);
	}
	return { W: parts.reduce((s, w) => s + w, 0), steps, parts };
}
const sumTex = (parts: number[]) => parts.map((w, i) => (i === 0 ? Jn(w) : w < 0 ? `- ${Jn(-w)}` : `+ ${Jn(w)}`)).join(' ');

/** A graph above the axis: a plateau and a ramp down to zero, a ramp up from zero and a plateau, or a plateau and a ramp to another value. */
function positive(rng: Rng): { kind: string; pts: Pt[]; desc: string } {
	const a = rng.int(1, 5), b = rng.int(a + 1, 8);
	const F0 = 2 * rng.int(1, 6);
	const r = rng.next();
	if (r < 0.4) return { kind: 'discesa', pts: [[0, F0], [a, F0], [b, 0]], desc: `vale ${F0} newton fino a ${a} metri, poi scende in linea retta fino a zero a ${b} metri` };
	if (r < 0.7) return { kind: 'salita', pts: [[0, 0], [a, F0], [b, F0]], desc: `sale in linea retta da zero a ${F0} newton a ${a} metri, poi resta costante fino a ${b} metri` };
	let F2 = F0;
	while (F2 === F0) F2 = 2 * rng.int(1, 6);
	return { kind: 'trapezio', pts: [[0, F0], [a, F0], [b, F2]], desc: `vale ${F0} newton fino a ${a} metri, poi cambia in linea retta fino a ${F2} newton a ${b} metri` };
}

const CART = 'Su un carrello che si muove lungo un binario rettilineo agisce una forza diretta lungo il binario, che cambia con la posizione come nel grafico.';
const ALT = (desc: string) => `Il grafico della forza in funzione della posizione: ${desc}.`;

// ---------------------------------------------------------------------------
// Level 1: the area under a graph above the axis

function level1(rng: Rng): Built {
	const g = positive(rng);
	const { W, steps, parts } = pieces(g.pts);
	const b = g.pts[g.pts.length - 1][0];
	const Fmax = Math.max(...g.pts.map((p) => p[1]));
	return {
		prompt: 'Trova il lavoro della forza dal grafico.',
		problem: textBlock(`${CART} Quanto lavoro compie la forza mentre il carrello va da $x = 0$ a $x = ${M(b)}$?`),
		solution: `W = ${q2(W, 'J')}`,
		steps: [t("Il lavoro è l'area sotto il grafico, divisa in figure semplici:"), ...steps, `W = ${sumTex(parts)} = ${q2(W, 'J')}`],
		// the largest force times the whole displacement; everything as one triangle; one piece alone
		answer: choiceOf(rng, ans(W, 'J'), opts([Fmax * b, (Fmax * b) / 2, parts[0], parts[parts.length - 1]], 'J'), around(W, 'J')),
		params: { case: g.kind, punti: g.pts },
		scene: graph(ALT(g.desc), g.pts),
		solutionScene: graph(`${ALT(g.desc)} L'area sotto il grafico è colorata.`, g.pts, true),
	};
}

// ---------------------------------------------------------------------------
// Level 2: a graph that goes below the axis

function level2(rng: Rng): Built {
	// The shape is drawn once, so the draws refused below do not change how often each one comes out.
	const line = rng.next() < 0.5;
	for (;;) {
		try {
			return crossing(rng, line);
		} catch {
			continue;
		}
	}
}

function crossing(rng: Rng, line: boolean): Built {
	let pts: Pt[], kind: string, desc: string;
	if (line) {
		const m = rng.int(1, 3);
		const x0 = rng.int(1, 5), b = rng.int(x0 + 1, 8);
		if (m * x0 > 12 || m * (b - x0) > 8) throw new Error('too tall');
		pts = [[0, m * x0], [b, -m * (b - x0)]];
		kind = 'retta';
		desc = `scende in linea retta da ${m * x0} newton nella posizione zero a meno ${m * (b - x0)} newton a ${b} metri, e attraversa l'asse a ${x0} metri`;
	} else {
		const a = rng.int(1, 5), b = rng.int(a + 1, 8);
		const F1 = 2 * rng.int(1, 6), F2 = 2 * rng.int(1, 4);
		pts = [[0, F1], [a, F1], [a, -F2], [b, -F2]];
		kind = 'gradino';
		desc = `vale ${F1} newton fino a ${a} metri, poi meno ${F2} newton fino a ${b} metri`;
	}
	const b = pts[pts.length - 1][0];
	// each piece cut where it crosses the axis
	const cut: Pt[] = [];
	for (let i = 0; i < pts.length; i++) {
		cut.push(pts[i]);
		if (i + 1 < pts.length && pts[i][1] * pts[i + 1][1] < 0 && pts[i][0] !== pts[i + 1][0]) {
			const [x1, f1] = pts[i], [x2, f2] = pts[i + 1];
			cut.push([x1 + ((x2 - x1) * f1) / (f1 - f2), 0]);
		}
	}
	const { W, steps, parts } = pieces(cut);
	if (W === 0) throw new Error('zero');
	const pos = parts.filter((w) => w > 0).reduce((s, w) => s + w, 0);
	const neg = parts.filter((w) => w < 0).reduce((s, w) => s + w, 0);
	return {
		prompt: 'Trova il lavoro totale della forza dal grafico.',
		problem: textBlock(`${CART} Quanto lavoro compie in tutto la forza mentre il carrello va da $x = 0$ a $x = ${M(b)}$?`),
		solution: `W = ${q2(W, 'J')}`,
		steps: [t("Sopra l'asse la forza aiuta il moto e l'area è un lavoro positivo; sotto l'asse lo ostacola e l'area conta con il segno meno:"), ...steps, `W = ${sumTex(parts)} = ${q2(W, 'J')}`],
		// the areas added as positive; the positive one alone; the negative one alone; the opposite sign
		answer: choiceOf(rng, ans(W, 'J'), opts([pos - neg, pos, neg, -W], 'J'), around(W, 'J')),
		params: { case: kind, punti: pts },
		scene: graph(ALT(desc), pts),
		solutionScene: graph(`${ALT(desc)} Le aree sopra e sotto l'asse sono colorate con due colori diversi.`, pts, true),
	};
}

// ---------------------------------------------------------------------------
// Level 3: the mean force

function level3(rng: Rng): Built {
	const g = positive(rng);
	const { W, steps, parts } = pieces(g.pts);
	const b = g.pts[g.pts.length - 1][0];
	const Fm = W / b;
	const first = g.pts[0][1], last = g.pts[g.pts.length - 1][1];
	const Fmax = Math.max(...g.pts.map((p) => p[1]));
	return {
		prompt: 'Trova la forza media dal grafico.',
		problem: textBlock(`${CART} Quanto vale la forza media tra $x = 0$ e $x = ${M(b)}$?`),
		solution: `F_m ${Number(sig2(Fm)?.value) === Fm ? '=' : '\\approx'} ${q2(Fm, 'N')}`,
		steps: [
			t("Prima il lavoro, cioè l'area sotto il grafico:"),
			...steps,
			`W = ${sumTex(parts)} = ${Jn(W)}`,
			t('La forza media è la forza costante che compie lo stesso lavoro sullo stesso spostamento:'),
			`F_m = \\dfrac{W}{\\Delta x} = \\dfrac{${Jn(W)}}{${M(b)}} = ${approx(Fm, 'N')}`,
		],
		// the mean of the first and last values; the largest force; half the largest; the work divided by the first stretch
		answer: choiceOf(rng, ans(Fm, 'N'), opts([(first + last) / 2, Fmax, Fmax / 2, W / g.pts[1][0]], 'N'), around(Fm, 'N')),
		params: { case: g.kind, punti: g.pts },
		scene: graph(ALT(g.desc), g.pts),
		solutionScene: graph(`${ALT(g.desc)} L'area sotto il grafico è colorata.`, g.pts, true),
	};
}

// ---------------------------------------------------------------------------
// Level 4: the work of the elastic force between two deformations

function level4(rng: Rng): Built {
	const k = two(rng, false);
	const lo = rng.int(11, 25), hi = rng.int(lo + 6, 39);
	if (lo % 10 === 0 || hi % 10 === 0) throw new Error('ambiguous zero');
	const grows = rng.next() < 0.5;
	const x1 = grows ? lo : hi, x2 = grows ? hi : lo;
	const a = x1 / 100, b = x2 / 100;
	const K = Number(k);
	const W = 0.5 * K * (a * a - b * b);
	const text = grows
		? `Una molla di costante elastica $k = ${k}\\,\\text{N/m}$, già allungata di ${pq(String(x1), 'cm')}, viene allungata fino a ${pq(String(x2), 'cm')}. Quanto lavoro compie la forza elastica?`
		: `Una molla di costante elastica $k = ${k}\\,\\text{N/m}$, allungata di ${pq(String(x1), 'cm')}, si accorcia fino a restare allungata di ${pq(String(x2), 'cm')}. Quanto lavoro compie la forza elastica?`;
	return {
		prompt: 'Trova il lavoro della forza elastica.',
		problem: textBlock(text),
		solution: `W_{el} \\approx ${q2(W, 'J')}`,
		steps: [
			t('Le deformazioni in metri:') + ` x_1 = ${num(a)}\\,\\text{m} \\qquad x_2 = ${num(b)}\\,\\text{m}`,
			`W_{el} = \\tfrac{1}{2}\\,k\\,x_1^2 - \\tfrac{1}{2}\\,k\\,x_2^2 = \\tfrac{1}{2} \\cdot ${qty(k, 'N/m')} \\cdot \\left[(${num(a)}\\,\\text{m})^2 - (${num(b)}\\,\\text{m})^2\\right] = ${approx(W, 'J')}`,
			t(grows ? 'La deformazione aumenta: la forza elastica si oppone e il suo lavoro è negativo.' : 'La deformazione diminuisce: la forza elastica ha il verso del moto e il suo lavoro è positivo.'),
		],
		// the opposite sign; the square of the difference, with either sign; the larger triangle alone
		answer: choiceOf(rng, ans(W, 'J'), opts([-W, Math.sign(W) * 0.5 * K * (b - a) ** 2, -Math.sign(W) * 0.5 * K * (b - a) ** 2, Math.sign(W) * 0.5 * K * (hi / 100) ** 2], 'J'), around(W, 'J')),
		params: { case: grows ? 'aumenta' : 'diminuisce', k, x1, x2 },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the final speed from the area

function level5(rng: Rng): Built {
	const g = positive(rng);
	const { W, steps, parts } = pieces(g.pts);
	const b = g.pts[g.pts.length - 1][0];
	const m = two(rng, true);
	const mm = Number(m);
	const v = Math.sqrt((2 * W) / mm);
	const Fmax = Math.max(...g.pts.map((p) => p[1]));
	return {
		prompt: 'Trova la velocità finale del carrello.',
		problem: textBlock(`Un carrello di ${pq(m, 'kg')}, fermo in $x = 0$ su un binario rettilineo senza attrito, è spinto da una forza diretta lungo il binario, che cambia con la posizione come nel grafico. Con quale velocità passa per $x = ${M(b)}$?`),
		solution: `v \\approx ${q2(v, 'm/s')}`,
		steps: [
			t("Il lavoro della forza è l'area sotto il grafico:"),
			...steps,
			`W = ${sumTex(parts)} = ${Jn(W)}`,
			t("Per il teorema dell'energia cinetica, con il carrello che parte da fermo:"),
			`W = \\tfrac{1}{2}\\,m\\,v^2 \\quad\\Rightarrow\\quad v = \\sqrt{\\dfrac{2\\,W}{m}} = \\sqrt{\\dfrac{2 \\cdot ${Jn(W)}}{${qty(m, 'kg')}}} = ${approx(v, 'm/s')}`,
		],
		// the half forgotten; no square root; the largest force times the whole displacement
		answer: choiceOf(rng, ans(v, 'm/s'), opts([Math.sqrt(W / mm), (2 * W) / mm, Math.sqrt((2 * Fmax * b) / mm)], 'm/s'), around(v, 'm/s')),
		params: { case: g.kind, punti: g.pts, m },
		scene: graph(ALT(g.desc), g.pts),
		solutionScene: graph(`${ALT(g.desc)} L'area sotto il grafico è colorata.`, g.pts, true),
	};
}

// ---------------------------------------------------------------------------
// Level 6: a spring stops a cart

function level6(rng: Rng): Built {
	const m = two(rng, true), v = two(rng, true), k = three(rng);
	const mm = Number(m), vv = Number(v), K = Number(k);
	const x = 100 * vv * Math.sqrt(mm / K); // cm
	if (x < 2 || x > 60) throw new Error('compression out of range');
	return {
		prompt: 'Trova la compressione massima della molla.',
		problem: textBlock(`Un carrello di ${pq(m, 'kg')} arriva a ${pq(v, 'm/s')}, senza attrito, contro una molla a riposo di costante elastica $k = ${k}\\,\\text{N/m}$. Di quanti centimetri si comprime la molla prima che il carrello si fermi?`),
		solution: `x \\approx ${q2(x, 'cm')}`,
		steps: [
			t('La forza elastica cresce durante la compressione: si usa il lavoro, non il moto uniformemente accelerato.'),
			`W_{el} = \\Delta K \\quad\\Rightarrow\\quad -\\tfrac{1}{2}\\,k\\,x^2 = 0 - \\tfrac{1}{2}\\,m\\,v^2`,
			`x = v\\sqrt{\\dfrac{m}{k}} = ${qty(v, 'm/s')} \\cdot \\sqrt{\\dfrac{${qty(m, 'kg')}}{${qty(k, 'N/m')}}} = ${cut4(x / 100)}\\,\\text{m}`,
			t('In centimetri:') + ` x \\approx ${q2(x, 'cm')}`,
		],
		// no square root on m/k; the square not undone; the half kept on one side only
		answer: choiceOf(rng, ans(x, 'cm'), opts([(100 * vv * mm) / K, (100 * mm * vv * vv) / K, 100 * vv * Math.sqrt(mm / (2 * K)), 100 * vv * Math.sqrt((2 * mm) / K)], 'cm'), around(x, 'cm')),
		params: { m, v, k },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };
const WITH_GRAPH = new Set([1, 2, 3, 5]);

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (WITH_GRAPH.has(sample.level) !== !!sample.scene) v.push(WITH_GRAPH.has(sample.level) ? 'manca la scena' : 'scena di troppo');
	if (sample.answer.kind === 'choice' && sample.answer.options.some((o) => o.values[0] === '0')) v.push('opzione zero');
	return v;
}

export const fisLavoroForzaVariabile: Generator = {
	id: ID,
	title: 'Il lavoro di una forza variabile',
	levels: {
		1: { label: "L'area sotto il grafico", constraints: ["grafico a tratti rettilinei sopra l'asse, coordinate intere"] },
		2: { label: "Le aree sotto l'asse", constraints: ['una retta che attraversa l’asse o due tratti costanti di segno opposto, metà ciascuno', 'lavoro totale diverso da zero'] },
		3: { label: 'La forza media', constraints: ['F_m = W / Δx'] },
		4: { label: 'Il lavoro della forza elastica', constraints: ['deformazione che aumenta o che diminuisce, metà ciascuno', 'deformazioni da 11 a 39 cm'] },
		5: { label: 'La velocità dal grafico', constraints: ["teorema dell'energia cinetica, carrello che parte da fermo"] },
		6: { label: 'La molla che ferma il carrello', constraints: ['compressione tra 2 e 60 cm'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisLavoroForzaVariabile;
