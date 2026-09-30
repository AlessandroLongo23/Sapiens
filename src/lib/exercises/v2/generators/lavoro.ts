/**
 * Il lavoro di una forza. Spec: specs/exercises/lavoro.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/59-lavoro.md), each one step harder: a force along the
 * displacement, W = F s; a rope at an angle, W = F s cos α; the sign of the work (friction, the weight going up or
 * down, the weight of a body moving horizontally, which does none); the total work of a horizontal pull and friction;
 * the same with the rope at an angle, which lightens the crate on the floor; the work to stretch a spring, the area
 * under F = k x. g = 9,8 m/s², data with two significant figures, answers with two (scientific notation from 100 J,
 * src/lib/exercises/v2/fis-lavoro.ts). Distractors from the lesson's warnings: the weight doing work on a horizontal
 * path, sine for cosine, the sign forgotten, the mass for the weight, friction added to the pull, the rope's lift
 * forgotten, the ½ forgotten, centimetres not converted.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, t } from '../vettori';
import { type Built, checkCommon, coeff, generateWith } from '../fisica-equilibrio';
import { approx, around, decTex, pq, q2, qOpt2, qty, some, step, two } from '../fis-lavoro';

export const ID = 'lavoro';

const G = 9.8;
const DEG = Math.PI / 180;
const cosD = (a: number) => Math.cos(a * DEG);
const sinD = (a: number) => Math.sin(a * DEG);
const J = (x: number) => qOpt2(x, 'J');
const opts = (xs: number[]) => some(xs.map(J));

const CRATES = [
	{ name: 'Una cassa', e: 'a' },
	{ name: 'Uno scatolone', e: 'o' },
	{ name: 'Un baule', e: 'o' },
	{ name: 'Una valigia', e: 'a' },
];
const SMALL = [
	{ name: 'Uno zaino', e: 'o' },
	{ name: 'Una borsa', e: 'a' },
	{ name: 'Un vaso', e: 'o' },
	{ name: 'Una scatola di libri', e: 'a' },
];

function crate(alt: string, d: { angolo: number; forza: string; spostamento: string }): SceneRef {
	const data: Record<string, unknown> = { angolo: d.angolo, forza: d.forza, spostamento: d.spostamento };
	if (d.angolo > 0) data.testoAngolo = `${d.angolo}°`;
	return { type: 'cassa-fune', data, alt };
}
const lab = (s: string) => s.replace('.', ',');
const answer = (x: number) => {
	const o = J(x);
	if (!o) throw new Error('rounding');
	return o;
};
const approxJ = (x: number) => approx(x, 'J');

// ---------------------------------------------------------------------------
// Level 1: force along the displacement

function level1(rng: Rng): Built {
	const b = rng.pick(CRATES);
	const m = two(rng, false), F = two(rng, false), s = two(rng, true);
	const W = Number(F) * Number(s);
	return {
		prompt: 'Trova il lavoro della forza.',
		problem: textBlock(`${b.name} di ${pq(m, 'kg')} viene spint${b.e} sul pavimento con una forza orizzontale di ${pq(F, 'N')}, per un tratto rettilineo di ${pq(s, 'm')}. Quanto lavoro compie la forza?`),
		solution: `W \\approx ${q2(W, 'J')}`,
		steps: [t('Forza e spostamento hanno la stessa direzione e lo stesso verso:'), `W = F \\cdot s = ${qty(F, 'N')} \\cdot ${qty(s, 'm')} = ${approxJ(W)}`, t('La massa non serve: il peso è perpendicolare allo spostamento.')],
		// the weight's work (m g s), then the fallbacks
		answer: choiceOf(rng, answer(W), opts([Number(m) * G * Number(s)]), around(W, 'J')),
		params: { case: 'parallela', m, F, s },
		scene: crate(`${b.name} spint${b.e} da una forza orizzontale di ${lab(F)} newton, che si sposta di ${lab(s)} metri.`, { angolo: 0, forza: `F = ${lab(F)} N`, spostamento: `s = ${lab(s)} m` }),
	};
}

// ---------------------------------------------------------------------------
// Level 2: the rope at an angle

function level2(rng: Rng): Built {
	const b = rng.pick(CRATES);
	const F = two(rng, false), s = two(rng, true);
	const a = rng.int(10, 80);
	const W = Number(F) * Number(s) * cosD(a);
	return {
		prompt: 'Trova il lavoro della forza della fune.',
		problem: textBlock(`${b.name} viene trascinat${b.e} sul pavimento per ${pq(s, 'm')} con una fune inclinata di $${a}^\\circ$ rispetto all'orizzontale, che tira con una forza di ${pq(F, 'N')}. Quanto lavoro compie la forza della fune?`),
		solution: `W \\approx ${q2(W, 'J')}`,
		steps: [
			t("Lavora solo la componente lungo lo spostamento, ") + ' F\\cos\\alpha' + t(', con ') + '\\alpha' + t(" l'angolo tra la fune e il pavimento:"),
			`W = F\\,s\\cos\\alpha = ${qty(F, 'N')} \\cdot ${qty(s, 'm')} \\cdot \\cos ${a}^\\circ = ${approxJ(W)}`,
		],
		// sine in place of cosine; the whole force
		answer: choiceOf(rng, answer(W), opts([Number(F) * Number(s) * sinD(a), Number(F) * Number(s)]), around(W, 'J')),
		params: { case: 'inclinata', F, s, angle: a },
		scene: crate(`${b.name} tirat${b.e} da una fune inclinata di ${a} gradi, con una forza di ${lab(F)} newton, che si sposta di ${lab(s)} metri.`, { angolo: a, forza: `F = ${lab(F)} N`, spostamento: `s = ${lab(s)} m` }),
	};
}

// ---------------------------------------------------------------------------
// Level 3: the sign of the work

function level3(rng: Rng): Built {
	const r = rng.next();
	if (r < 1 / 3) {
		const b = rng.pick(CRATES);
		const m = two(rng, false), s = two(rng, true), mu = coeff(rng, 10, 60);
		const Fd = Number(mu) * Number(m) * G;
		const W = -Fd * Number(s);
		return {
			prompt: "Trova il lavoro dell'attrito.",
			problem: textBlock(`${b.name} di ${pq(m, 'kg')} scivola per ${pq(s, 'm')} su un pavimento orizzontale; il coefficiente di attrito dinamico è $\\mu_d = ${decTex(mu)}$. Quanto vale il lavoro della forza di attrito?`),
			solution: `W_{att} \\approx ${q2(W, 'J')}`,
			steps: [
				`F_d = \\mu_d \\, m g = ${decTex(mu)} \\cdot ${qty(m, 'kg')} \\cdot 9{,}8\\,\\text{m/s}^2 = ${step(Fd)}\\,\\text{N}`,
				t("L'attrito è opposto allo spostamento: il suo lavoro è negativo."),
				`W_{att} = -F_d \\cdot s = -${step(Fd)}\\,\\text{N} \\cdot ${qty(s, 'm')} = ${approxJ(W)}`,
			],
			// the sign forgotten; mu forgotten; the mass for the weight
			answer: choiceOf(rng, answer(W), opts([-W, -Number(m) * G * Number(s), -Number(mu) * Number(m) * Number(s)]), around(W, 'J')),
			params: { case: 'attrito', m, s, mu },
		};
	}
	if (r < 2 / 3) {
		const b = rng.pick(SMALL);
		const m = two(rng, true), h = two(rng, true);
		const up = rng.next() < 0.5;
		const W = (up ? -1 : 1) * Number(m) * G * Number(h);
		return {
			prompt: 'Trova il lavoro del peso.',
			problem: textBlock(
				up
					? `${b.name} di ${pq(m, 'kg')} viene portat${b.e} su per le scale, fino a un piano ${pq(h, 'm')} più in alto. Quanto lavoro compie il peso?`
					: `${b.name} di ${pq(m, 'kg')} cade da un'altezza di ${pq(h, 'm')}. Quanto lavoro compie il peso?`,
			),
			solution: `W_P \\approx ${q2(W, 'J')}`,
			steps: [
				up ? t('Il corpo sale e il peso punta in basso: il lavoro del peso è negativo, qualunque sia il percorso.') : t('Il corpo scende nel verso del peso: il lavoro del peso è positivo.'),
				`W_P = ${up ? '-' : ''}m g h = ${up ? '-' : ''}${qty(m, 'kg')} \\cdot 9{,}8\\,\\text{m/s}^2 \\cdot ${qty(h, 'm')} = ${approxJ(W)}`,
			],
			// the sign; the mass for the weight
			answer: choiceOf(rng, answer(W), opts([-W, (up ? -1 : 1) * Number(m) * Number(h)]), around(W, 'J')),
			params: { case: 'peso', dir: up ? 'salita' : 'discesa', m, h },
		};
	}
	const b = rng.pick(CRATES);
	const m = two(rng, false), F = two(rng, false), s = two(rng, true);
	const mgs = Number(m) * G * Number(s);
	return {
		prompt: 'Trova il lavoro del peso.',
		problem: textBlock(`${b.name} di ${pq(m, 'kg')} viene spint${b.e} per ${pq(s, 'm')} su un pavimento orizzontale, con una forza orizzontale di ${pq(F, 'N')}. Quanto lavoro compie il peso?`),
		solution: 'W_P = 0\\,\\text{J}',
		steps: [t('Il peso è verticale e lo spostamento orizzontale: sono perpendicolari, e cos 90° = 0.'), 'W_P = m g \\, s \\cos 90^\\circ = 0\\,\\text{J}'],
		// the weight taken as doing work, with either sign; the pushing force's work
		answer: choiceOf(rng, { latex: '0\\,\\text{J}', values: ['0'] }, opts([mgs, -mgs, Number(F) * Number(s)]), around(mgs, 'J')),
		params: { case: 'nullo', m, F, s },
		scene: crate(`${b.name} spint${b.e} da una forza orizzontale di ${lab(F)} newton, che si sposta di ${lab(s)} metri.`, { angolo: 0, forza: `F = ${lab(F)} N`, spostamento: `s = ${lab(s)} m` }),
	};
}

// ---------------------------------------------------------------------------
// Level 4: the total work, horizontal pull and friction

function level4(rng: Rng): Built {
	for (;;) {
		const b = rng.pick(CRATES);
		const m = two(rng, false), F = two(rng, false), s = two(rng, true), mu = coeff(rng, 10, 60);
		const Fd = Number(mu) * Number(m) * G;
		if (Number(F) < 1.2 * Fd) continue;
		const W = (Number(F) - Fd) * Number(s);
		return {
			prompt: 'Trova il lavoro totale.',
			problem: textBlock(
				`${b.name} di ${pq(m, 'kg')} viene tirat${b.e} per ${pq(s, 'm')} sul pavimento con una forza orizzontale di ${pq(F, 'N')}; il coefficiente di attrito dinamico è $\\mu_d = ${decTex(mu)}$. Quanto vale il lavoro totale delle forze?`,
			),
			solution: `W_{tot} \\approx ${q2(W, 'J')}`,
			steps: [
				t('Peso e reazione del pavimento sono perpendicolari allo spostamento: non compiono lavoro.'),
				`W_F = F \\cdot s = ${qty(F, 'N')} \\cdot ${qty(s, 'm')} = ${step(Number(F) * Number(s))}\\,\\text{J}`,
				`W_{att} = -\\mu_d \\, m g \\, s = -${decTex(mu)} \\cdot ${qty(m, 'kg')} \\cdot 9{,}8\\,\\text{m/s}^2 \\cdot ${qty(s, 'm')} = -${step(Fd * Number(s))}\\,\\text{J}`,
				`W_{tot} = W_F + W_{att} = ${approxJ(W)}`,
			],
			// only the pull; friction added; only friction
			answer: choiceOf(rng, answer(W), opts([Number(F) * Number(s), (Number(F) + Fd) * Number(s), -Fd * Number(s)]), around(W, 'J')),
			params: { case: 'totale', m, F, s, mu },
			scene: crate(`${b.name} tirat${b.e} da una forza orizzontale di ${lab(F)} newton, che si sposta di ${lab(s)} metri.`, { angolo: 0, forza: `F = ${lab(F)} N`, spostamento: `s = ${lab(s)} m` }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the rope at an angle, with friction

function level5(rng: Rng): Built {
	for (;;) {
		const b = rng.pick(CRATES);
		const m = two(rng, false), F = two(rng, false), s = two(rng, true), mu = coeff(rng, 10, 50);
		const a = rng.int(10, 60);
		const Fn = Number(F), P = Number(m) * G;
		const Fy = Fn * sinD(a), Fx = Fn * cosD(a);
		if (Fy > 0.8 * P) continue;
		const Fperp = P - Fy;
		const Fd = Number(mu) * Fperp;
		if (Fx - Fd < 0.2 * Fx) continue;
		const W = (Fx - Fd) * Number(s);
		return {
			prompt: 'Trova il lavoro totale.',
			problem: textBlock(
				`${b.name} di ${pq(m, 'kg')} viene trascinat${b.e} per ${pq(s, 'm')} sul pavimento con una fune inclinata di $${a}^\\circ$ rispetto all'orizzontale, che tira con ${pq(F, 'N')}; il coefficiente di attrito dinamico è $\\mu_d = ${decTex(mu)}$. Quanto vale il lavoro totale delle forze?`,
			),
			solution: `W_{tot} \\approx ${q2(W, 'J')}`,
			steps: [
				`W_F = F\\,s\\cos\\alpha = ${qty(F, 'N')} \\cdot ${qty(s, 'm')} \\cdot \\cos ${a}^\\circ = ${step(Fx * Number(s))}\\,\\text{J}`,
				t('La fune tira anche verso l\'alto e alleggerisce il carico sul pavimento:') + ` F_\\perp = m g - F\\sin\\alpha = ${step(P)}\\,\\text{N} - ${step(Fy)}\\,\\text{N} = ${step(Fperp)}\\,\\text{N}`,
				`W_{att} = -\\mu_d \\, F_\\perp \\, s = -${decTex(mu)} \\cdot ${step(Fperp)}\\,\\text{N} \\cdot ${qty(s, 'm')} = -${step(Fd * Number(s))}\\,\\text{J}`,
				`W_{tot} = W_F + W_{att} = ${approxJ(W)}`,
			],
			// the rope's lift forgotten; only the rope; the lift added to the weight
			answer: choiceOf(rng, answer(W), opts([(Fx - Number(mu) * P) * Number(s), Fx * Number(s), (Fx - Number(mu) * (P + Fy)) * Number(s)]), around(W, 'J')),
			params: { case: 'fune-attrito', m, F, s, mu, angle: a },
			scene: crate(`${b.name} tirat${b.e} da una fune inclinata di ${a} gradi, con una forza di ${lab(F)} newton, che si sposta di ${lab(s)} metri.`, { angolo: a, forza: `F = ${lab(F)} N`, spostamento: `s = ${lab(s)} m` }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: the area under the graph of a spring

/** A stretch in centimetres with two significant figures: 11 to 39, not a multiple of ten. */
function cm(rng: Rng, lo: number, hi: number): number {
	for (;;) {
		const x = rng.int(lo, hi);
		if (x % 10) return x;
	}
}

function graph(alt: string, k: number, xmax: number): SceneRef {
	const cells = Math.ceil(xmax / 5) + 1;
	const Fmax = (k * cells * 5) / 100;
	const passo = [1, 2, 5, 10].find((p) => Fmax / p <= 10) ?? 10;
	return {
		type: 'grafico-dati',
		data: {
			x: { nome: 'x', unita: 'cm', passo: 5, celle: cells, etichette: 1 },
			y: { nome: 'F', unita: 'N', passo, celle: Math.ceil(Fmax / passo), etichette: 1 },
			linea: { tipo: 'retta', m: k / 100, q: 0 },
		},
		alt,
	};
}

function level6(rng: Rng): Built {
	const k = Number(two(rng, false));
	const from0 = rng.next() < 0.5;
	if (from0) {
		const x = cm(rng, 11, 39);
		const xm = x / 100;
		const W = 0.5 * k * xm * xm;
		return {
			prompt: 'Trova il lavoro per allungare la molla.',
			problem: textBlock(`Una molla ha costante elastica $k = ${k}\\,\\text{N/m}$. Quanto lavoro serve per allungarla di ${pq(String(x), 'cm')}, partendo dalla sua lunghezza a riposo?`),
			solution: `W \\approx ${q2(W, 'J')}`,
			steps: [
				t("L'allungamento in metri:") + ` x = ${x}\\,\\text{cm} = ${decTex(String(xm))}\\,\\text{m}`,
				t("Il lavoro è l'area del triangolo sotto la retta ") + ' F = k\\,x:',
				`W = \\frac{1}{2} k \\, x^2 = \\frac{1}{2} \\cdot ${k}\\,\\text{N/m} \\cdot (${decTex(String(xm))}\\,\\text{m})^2 = ${approxJ(W)}`,
			],
			// the half forgotten; the centimetres left; the force k x taken for the work
			answer: choiceOf(rng, answer(W), opts([k * xm * xm, 0.5 * k * x * x, k * xm]), around(W, 'J')),
			params: { case: 'da-riposo', k, x },
			scene: graph(`Il grafico della forza che allunga una molla di costante ${k} newton al metro, in funzione dell'allungamento in centimetri: una retta che passa per l'origine.`, k, x),
		};
	}
	const x1 = cm(rng, 11, 25);
	const x2 = cm(rng, x1 + 6, 39);
	const a = x1 / 100, bb = x2 / 100;
	const W = 0.5 * k * (bb * bb - a * a);
	return {
		prompt: 'Trova il lavoro per allungare la molla.',
		problem: textBlock(`Una molla ha costante elastica $k = ${k}\\,\\text{N/m}$ ed è già allungata di ${pq(String(x1), 'cm')}. Quanto lavoro serve per allungarla fino a ${pq(String(x2), 'cm')}?`),
		solution: `W \\approx ${q2(W, 'J')}`,
		steps: [
			t("Il lavoro è l'area del trapezio sotto la retta ") + ' F = k\\,x' + t(', tra i due allungamenti: il triangolo grande meno quello piccolo.'),
			`W = \\frac{1}{2} k \\, x_2^2 - \\frac{1}{2} k \\, x_1^2 = \\frac{1}{2} \\cdot ${k}\\,\\text{N/m} \\cdot \\left[(${decTex(String(bb))}\\,\\text{m})^2 - (${decTex(String(a))}\\,\\text{m})^2\\right] = ${approxJ(W)}`,
		],
		// the square of the difference; the whole triangle; the half forgotten
		answer: choiceOf(rng, answer(W), opts([0.5 * k * (bb - a) ** 2, 0.5 * k * bb * bb, k * (bb * bb - a * a)]), around(W, 'J')),
		params: { case: 'tra-due', k, x1, x2 },
		scene: graph(`Il grafico della forza che allunga una molla di costante ${k} newton al metro, in funzione dell'allungamento in centimetri: una retta che passa per l'origine.`, k, x2),
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	const c = sample.params.case;
	const needsScene = sample.level !== 3 || c === 'nullo';
	if (needsScene && !sample.scene) v.push('manca la scena');
	if (!needsScene && sample.scene) v.push('scena di troppo');
	if (sample.answer.kind === 'choice' && c !== 'nullo' && sample.answer.options.some((o) => o.values[0] === '0')) v.push('opzione zero');
	return v;
}

export const lavoro: Generator = {
	id: ID,
	title: 'Il lavoro di una forza',
	levels: {
		1: { label: 'Forza e spostamento paralleli', constraints: ['forza orizzontale lungo lo spostamento'] },
		2: { label: 'La forza inclinata', constraints: ['fune inclinata da 10° a 80°'] },
		3: { label: 'Il segno del lavoro', constraints: ['attrito, peso in salita o in discesa, peso in orizzontale: un terzo ciascuno'] },
		4: { label: 'Il lavoro totale', constraints: ['forza orizzontale e attrito, lavoro totale positivo'] },
		5: { label: "La fune inclinata con l'attrito", constraints: ['la fune alleggerisce la cassa: F⊥ = mg − F sin α'] },
		6: { label: "L'area sotto il grafico", constraints: ['molla da riposo o tra due allungamenti, metà ciascuno'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default lavoro;
