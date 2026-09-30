/**
 * Gli specchi sferici. Spec: specs/exercises/fis-specchi-sferici.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/33-fis-specchi-sferici.md): the focus of a concave
 * mirror from its radius of curvature (or the other way round); the real image of a concave mirror with the
 * conjugate points equation; its height and orientation with the magnification; the virtual image of an object
 * between the focus and the mirror (q < 0); the image of a convex mirror (f < 0); the focal length from the object's
 * distance and the kind of image. The sign convention is the lesson's: p > 0, q > 0 for a real image and < 0 for a
 * virtual one, f > 0 concave and < 0 convex, G = −q/p. Numbers are built backwards so every result is exact (whole
 * centimetres or halves, heights to the millimetre): no rounding. Distractors are the lesson's mistakes: the focus
 * at the centre, the sign lost or the wrong sign of f, the fractions added instead of subtracted, the orientation
 * reversed. The scene draws the mirror, the object and the data; rays, image and answer are in `solutionScene`.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { BANNED, choiceOf, decTex, qOpt, qty, t } from '../vettori';
import { exact, isDec, principalRays, ray, scene, mirrorX, type El, type P } from '../raggi-specchi';

export const ID = 'fis-specchi-sferici';

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer;
	params: Record<string, unknown>;
	scene?: SceneRef;
	solutionScene: SceneRef;
}

const H = 0.7; // drawn height of the object, cm
const cm = (x: number) => qty(exact(x), 'cm');
const opt = (x: number, extra = ''): ChoiceOption => qOpt(exact(x), 'cm', extra);
/** A height, to the millimetre with the zero kept: 3,0 cm. */
const hOpt = (x: number, extra = ''): ChoiceOption => qOpt(x.toFixed(1), 'cm', extra);
/** Options that are exact to the half centimetre, positive or negative as given, without the answer's value twice. */
const okOpt = (x: number) => Number.isFinite(x) && Math.abs(x) >= 0.5 && isDec(x, 1);
/** A mistake as the calculator gives it, rounded to the millimetre (null on a tie or when too small). */
function wrong(x: number): ChoiceOption | null {
	if (!Number.isFinite(x) || Math.abs(x) < 0.5) return null;
	const y = x * 10;
	if (Math.abs(Math.abs(y - Math.trunc(y)) - 0.5) < 1e-6) return null;
	return opt(Math.round(y) / 10);
}
const wrongs = (xs: number[]) => xs.map(wrong).filter((o): o is ChoiceOption => o !== null);
/** A height to the millimetre. */
const okH = (x: number) => Number.isFinite(x) && x >= 0.3 && isDec(x, 1);
const paren = (x: number) => (x < 0 ? `(${decTex(exact(x))})` : decTex(exact(x)));

/** The drawing of the mirror with the object: scale k (drawn cm per real cm), focus and centre when given. */
function mirrorScene(o: { p: number; f: number; k: number; showF: boolean; showC: boolean; quote: 'p' | 'pf' | 'pR'; solution: boolean; alt: string }): SceneRef {
	const { p, f, k } = o;
	const Pd = p * k, Fd = f * k;
	const concave = f > 0;
	const Rd = 6 * Math.abs(Fd);
	const q = (p * f) / (p - f);
	const G = -q / p;
	const Hi = G * H;
	const half = Math.max(1.2, H + 0.3, Math.abs(Hi) + 0.3);
	if (Rd < 2.5 * half || Pd < 1.1) throw new Error('resample');
	const xs = [-Pd, concave ? -2 * Fd : 0, o.solution ? -q * k : 0];
	const x0 = Math.min(...xs) - 0.7;
	const x1 = Math.max(0.6, concave ? 0.6 : -2 * Fd + 0.5, o.solution && q < 0 ? -q * k + 0.5 : 0.6);
	const yMax = Math.max(half, H, o.solution ? Math.abs(Hi) : 0) + 0.25;
	const els: El[] = [{ tipo: 'asse', x0, x1 }, { tipo: 'sferico', vertice: [0, 0], raggio: Rd, meta: half, concavo: concave }];
	const Fp: P = [-Fd, 0], Cp: P = [-2 * Fd, 0];
	if (o.showC || o.solution) els.push({ tipo: 'punto', at: Cp, nome: 'C' });
	if (o.showF || o.solution) els.push({ tipo: 'punto', at: Fp, nome: 'F' });
	els.push({ tipo: 'testo', at: [concave ? 0.15 : -0.15, -0.25], testo: 'V', dir: [concave ? 1 : -1, 0], corsivo: true });
	const low = -yMax - 0.1;
	els.push({ tipo: 'quota', da: [-Pd, low], a: [0, low], testo: `${exact(p).replace('.', ',')} cm` });
	if (o.quote === 'pf') els.push({ tipo: 'quota', da: [concave ? -Fd : 0, low - 0.75], a: [concave ? 0 : -Fd, low - 0.75], testo: `${exact(Math.abs(f)).replace('.', ',')} cm` });
	if (o.quote === 'pR') els.push({ tipo: 'quota', da: [0, low - 0.75], a: [-2 * Fd, low - 0.75], testo: `${exact(2 * Math.abs(f)).replace('.', ',')} cm` });
	if (o.solution) {
		const box = { x0, x1, y0: -yMax, y1: yMax };
		const { els: rays } = principalRays(Pd, H, Fd, Rd, box);
		els.push(...rays);
		els.push({ tipo: 'immagine', piede: [-q * k, 0], h: Hi, ...(q < 0 ? { virtuale: true } : {}) });
	}
	els.push({ tipo: 'oggetto', piede: [-Pd, 0], h: H });
	return scene(o.alt, els);
}

const eqSteps = (p: number, f: number, q: number) => [
	t("Dall'equazione dei punti coniugati:"),
	`\\frac{1}{q} = \\frac{1}{f} - \\frac{1}{p} = \\frac{1}{${paren(f)}} - \\frac{1}{${decTex(exact(p))}}`,
	`q = ${cm(q)}`,
];

// ---------------------------------------------------------------------------
// Level 1: the focus

function level1(rng: Rng): Built {
	const R = 2 * rng.int(6, 48);
	const f = R / 2;
	const askF = rng.next() < 0.5;
	const k = 5 / R;
	const Fd = f * k, Rdd = 6 * Fd;
	const els = (sol: boolean): El[] => {
		const out: El[] = [{ tipo: 'asse', x0: -R * k - 1.4, x1: 0.6 }, { tipo: 'sferico', vertice: [0, 0], raggio: Rdd, meta: 1.2, concavo: true }];
		out.push({ tipo: 'testo', at: [0.15, -0.25], testo: 'V', dir: [1, 0], corsivo: true });
		for (const y of [-0.8, 0.8]) {
			const A: P = [mirrorX(Rdd, true, y), y];
			out.push(ray([-R * k - 1.2, y], A, 1));
			if (sol) out.push(ray(A, [A[0] + 1.6 * (-Fd - A[0]), A[1] - 1.6 * A[1]], 1));
		}
		if (!askF || sol) out.push({ tipo: 'punto', at: [-Fd, 0], nome: 'F' });
		if (askF || sol) out.push({ tipo: 'punto', at: [-2 * Fd, 0], nome: 'C' });
		if (askF || sol) out.push({ tipo: 'quota', da: [0, -1.55], a: [-2 * Fd, -1.55], testo: `${R} cm` });
		if (!askF || sol) out.push({ tipo: 'quota', da: [0, -2.3], a: [-Fd, -2.3], testo: `${f} cm` });
		return out;
	};
	const problem = askF
		? textBlock(`Uno specchio concavo ha il raggio di curvatura di ${`$${cm(R)}$`}. È puntato verso il Sole, con l'asse ottico parallelo ai raggi. A quale distanza dal vertice si concentra la luce riflessa?`)
		: textBlock(`Uno specchio concavo è puntato verso il Sole, con l'asse ottico parallelo ai raggi, e concentra la luce riflessa in un punto a ${`$${cm(f)}$`} dal vertice. Quanto vale il suo raggio di curvatura?`);
	const right = askF ? f : R;
	const answer = choiceOf(rng, opt(right), askF ? [opt(R), opt(2 * R), opt(R / 4)].filter((o) => okOpt(Number(o.values[0]))) : [opt(f), opt(f / 2), opt(4 * f)].filter((o) => okOpt(Number(o.values[0]))), [opt(right + 5), opt(right * 3)]);
	const alt = askF ? `Due raggi del Sole, paralleli all'asse, arrivano su uno specchio concavo; sull'asse il centro di curvatura C, a ${R} centimetri dal vertice.` : `Due raggi del Sole, paralleli all'asse, arrivano su uno specchio concavo; sull'asse il punto F in cui si concentra la luce, a ${f} centimetri dal vertice.`;
	return {
		prompt: askF ? 'Trova la distanza del fuoco.' : 'Trova il raggio di curvatura.',
		problem,
		solution: askF ? `f = ${cm(f)}` : `R = ${cm(R)}`,
		steps: askF
			? [t('I raggi del Sole arrivano paralleli all’asse e vengono riflessi nel fuoco.'.replace('’', "'")), `f = \\frac{R}{2} = \\frac{${R}}{2} = ${cm(f)}`]
			: [t('I raggi paralleli all’asse vengono riflessi nel fuoco: la luce si concentra a f dal vertice.'.replace('’', "'")), `R = 2f = 2 \\cdot ${f} = ${cm(R)}`],
		answer,
		params: { case: askF ? 'fuoco' : 'raggio', R, f, k },
		scene: scene(alt, els(false)),
		solutionScene: scene(`${alt} I raggi riflessi passano per il fuoco F, a ${f} centimetri dal vertice, a metà tra il vertice e C.`, els(true)),
	};
}

// ---------------------------------------------------------------------------
// Levels 2-5: the equation

/** A focal length and an object distance, both whole centimetres, that give an exact q (to the half centimetre). */
function pick(rng: Rng, kind: 'real' | 'virtual' | 'convex'): { f: number; p: number; q: number } {
	for (let n = 0; n < 200; n++) {
		const F = rng.int(kind === 'convex' ? 5 : 8, 60);
		const ps: number[] = [];
		if (kind === 'real') for (let p = F + 2; p <= 5 * F; p++) ps.push(p);
		else if (kind === 'virtual') for (let p = 2; p <= F - 2; p++) ps.push(p);
		else for (let p = 4; p <= 6 * F; p++) ps.push(p);
		const f = kind === 'convex' ? -F : F;
		const good = ps.filter((p) => {
			const q = (p * f) / (p - f);
			return isDec(2 * q, 0) && Math.abs(q) <= 250 && Math.abs(q) >= 2 && Math.abs(q - p) > 1e-9 && p <= 300 && Math.abs(q / p) <= 3 && Math.abs(q / p) >= 0.2;
		});
		if (good.length) {
			const p = rng.pick(good);
			return { f, p, q: (p * f) / (p - f) };
		}
	}
	throw new Error('resample');
}

function scaleFor(p: number, f: number, q: number) {
	return 5.5 / Math.max(p, 2 * Math.abs(f), Math.abs(q));
}

function realImage(rng: Rng, level: 2 | 3): Built {
	const { f, p, q } = pick(rng, 'real');
	const G = -q / p;
	const k = scaleFor(p, f, q);
	if (level === 2) {
		const mistakes = wrongs([(p * f) / (p + f), p - f, 2 * f, p + f]);
		const answer = choiceOf(rng, opt(q), mistakes, [opt(q + 5), opt(2 * q)]);
		const alt = `Uno specchio concavo con il fuoco F a ${f} centimetri dal vertice e il centro C; l'oggetto, una freccia, a ${exact(p)} centimetri dal vertice.`;
		return {
			prompt: "Trova la distanza dell'immagine.",
			problem: textBlock(`Un oggetto si trova a $${cm(p)}$ da uno specchio concavo con distanza focale $${cm(f)}$. A quale distanza dallo specchio si forma l'immagine?`),
			solution: `q = ${cm(q)}`,
			steps: [...eqSteps(p, f, q), t(`q è positiva: l'immagine è reale, davanti allo specchio.`)],
			answer,
			params: { case: p > 2 * f ? 'oltre C' : p < 2 * f ? 'tra C e F' : 'in C', p, f, k },
			scene: mirrorScene({ p, f, k, showF: true, showC: true, quote: 'pf', solution: false, alt }),
			solutionScene: mirrorScene({ p, f, k, showF: true, showC: true, quote: 'pf', solution: true, alt: `${alt} L'immagine è reale, a ${exact(q)} centimetri dal vertice.` }),
		};
	}
	// Level 3: height and orientation. The object's height, in centimetres to the millimetre, gives an exact image.
	const hs: number[] = [];
	for (let h10 = 10; h10 <= 99; h10++) {
		const h = h10 / 10;
		const hi = Math.abs(G * h);
		if (isDec(hi, 1) && hi >= 0.5 && hi <= 60 && h10 % 10 !== 0) hs.push(h);
	}
	if (!hs.length) throw new Error('resample');
	const h = rng.pick(hs);
	const hi = Math.abs(G * h);
	const inv = h / Math.abs(G); // the ratio upside down: h · p / q
	const mistakes: ChoiceOption[] = [hOpt(hi, 'diritta')];
	if (okH(inv) && Math.abs(inv - hi) > 1e-9) mistakes.push(hOpt(inv, 'capovolta'));
	if (Math.abs(h - hi) > 1e-9) mistakes.push(hOpt(h, 'capovolta'));
	if (okH(inv) && Math.abs(inv - hi) > 1e-9) mistakes.push(hOpt(inv, 'diritta'));
	const answer = choiceOf(rng, hOpt(hi, 'capovolta'), mistakes, [hOpt(2 * hi, 'capovolta'), hOpt(hi + 1, 'capovolta')]);
	const alt = `Uno specchio concavo con il fuoco F a ${f} centimetri dal vertice e il centro C; l'oggetto, alto ${exact(h).replace('.', ',')} centimetri, a ${exact(p)} centimetri dal vertice.`;
	return {
		prompt: "Trova l'altezza dell'immagine.",
		problem: textBlock(`Un oggetto alto $${cm(h)}$ si trova a $${cm(p)}$ da uno specchio concavo con distanza focale $${cm(f)}$. Quanto è alta la sua immagine, e com'è orientata?`),
		solution: `h' = ${qty((-hi).toFixed(1), 'cm')} \\ \\text{(capovolta)}`,
		steps: [...eqSteps(p, f, q), `G = -\\frac{q}{p} = -\\frac{${decTex(exact(q))}}{${decTex(exact(p))}} = ${decTex(exact(G, 4))}`, `h' = G \\cdot h = ${decTex(exact(G, 4))} \\cdot ${decTex(exact(h))} = ${qty((G * h).toFixed(1), 'cm')}`, t("G è negativo: l'immagine è capovolta.")],
		answer,
		params: { case: Math.abs(G) > 1 ? 'ingrandita' : 'rimpicciolita', p, f, h, k },
		scene: mirrorScene({ p, f, k, showF: true, showC: true, quote: 'pf', solution: false, alt }),
		solutionScene: mirrorScene({ p, f, k, showF: true, showC: true, quote: 'pf', solution: true, alt: `${alt} L'immagine è reale e capovolta, alta ${exact(hi).replace('.', ',')} centimetri.` }),
	};
}

function virtualImage(rng: Rng, level: 4 | 5): Built {
	const convex = level === 5;
	const { f, p, q } = pick(rng, convex ? 'convex' : 'virtual');
	const k = 5.5 / Math.max(p, 2 * Math.abs(f), Math.abs(q));
	const F = Math.abs(f);
	const mistakes: ChoiceOption[] = [opt(-q)]; // the sign lost
	if (convex) {
		const asConcave = (p * F) / (p - F); // f taken positive
		const withR = (p * -2 * F) / (p + 2 * F); // R used for f
		mistakes.push(...wrongs([asConcave, withR, -(p * F) / (p - F)]));
	} else {
		mistakes.push(...wrongs([(p * f) / (p + f), -(F - p), -(p * f) / (p + f)]));
	}
	const answer = choiceOf(rng, opt(q), mistakes, [opt(q - 5), opt(2 * q), opt(q / 2)].filter((o) => okOpt(Number(o.values[0]))));
	const R = 2 * F;
	const text = convex
		? `Un oggetto si trova a $${cm(p)}$ da uno specchio convesso con raggio di curvatura $${cm(R)}$. Qual è la distanza $q$ dell'immagine dallo specchio, con il suo segno?`
		: `Un oggetto si trova a $${cm(p)}$ da uno specchio concavo con distanza focale $${cm(f)}$. Qual è la distanza $q$ dell'immagine dallo specchio, con il suo segno?`;
	const alt = convex
		? `Uno specchio convesso con il fuoco F e il centro C dietro lo specchio, C a ${R} centimetri dal vertice; l'oggetto, una freccia, a ${exact(p)} centimetri dal vertice.`
		: `Uno specchio concavo con il fuoco F a ${f} centimetri dal vertice e il centro C; l'oggetto, una freccia, a ${exact(p)} centimetri dal vertice, tra il fuoco e lo specchio.`;
	const steps = convex ? [t('Lo specchio è convesso: la distanza focale è negativa.'), `f = -\\frac{R}{2} = -\\frac{${R}}{2} = ${cm(f)}`, ...eqSteps(p, f, q)] : eqSteps(p, f, q);
	steps.push(t(`q è negativa: l'immagine è virtuale, ${exact(-q).replace('.', ',')} cm dietro lo specchio.`));
	return {
		prompt: "Trova la distanza dell'immagine.",
		problem: textBlock(text),
		solution: `q = ${cm(q)}`,
		steps,
		answer,
		params: { case: convex ? (p > F ? 'oltre F' : 'dentro F') : 'virtuale', p, f, k, ...(convex ? { R } : {}) },
		scene: mirrorScene({ p, f, k, showF: !convex, showC: true, quote: convex ? 'pR' : 'pf', solution: false, alt }),
		solutionScene: mirrorScene({ p, f, k, showF: true, showC: true, quote: convex ? 'pR' : 'pf', solution: true, alt: `${alt} L'immagine è virtuale e diritta, ${exact(-q).replace('.', ',')} centimetri dietro lo specchio.` }),
	};
}

// ---------------------------------------------------------------------------
// Level 6: the focal length from the image

const SIZES: { g: number; words: string }[] = [
	{ g: 2, words: "alta il doppio dell'oggetto" },
	{ g: 3, words: "alta il triplo dell'oggetto" },
	{ g: 4, words: "alta quattro volte l'oggetto" },
	{ g: 1 / 2, words: "alta la metà dell'oggetto" },
	{ g: 1 / 3, words: "alta un terzo dell'oggetto" },
	{ g: 1 / 4, words: "alta un quarto dell'oggetto" },
];

function level6(rng: Rng): Built {
	const kind = rng.pick(['reale', 'virtuale ingrandita', 'virtuale rimpicciolita'] as const);
	// The kind is chosen once, so the three kinds keep their share when a draw has to be repeated.
	for (let n = 0; n < 100; n++) {
		try {
			return level6Of(rng, kind);
		} catch {
			continue;
		}
	}
	throw new Error('resample');
}

function level6Of(rng: Rng, kind: 'reale' | 'virtuale ingrandita' | 'virtuale rimpicciolita'): Built {
	const sizes = SIZES.filter((s) => (kind === 'virtuale ingrandita' ? s.g > 1 : kind === 'virtuale rimpicciolita' ? s.g < 1 : true));
	const s = rng.pick(sizes);
	const G = kind === 'reale' ? -s.g : s.g;
	const ps: number[] = [];
	for (let p = 6; p <= 90; p++) {
		const q = -G * p;
		const f = (p * q) / (p + q);
		if (isDec(q * 2, 0) && isDec(f * 2, 0) && Math.abs(f) >= 4 && Math.abs(q) >= 2 && p % 10 !== 0) ps.push(p);
	}
	if (!ps.length) throw new Error('resample');
	const p = rng.pick(ps);
	const q = -G * p;
	const f = (p * q) / (p + q);
	const qWrong = Math.abs(q); // the virtual image with q > 0
	const mistakes: ChoiceOption[] = [opt(-f)];
	mistakes.push(...wrongs([(p * qWrong) / (p + qWrong), 2 * f, (p * q) / (q - p)]));
	const answer = choiceOf(rng, opt(f), mistakes, [opt(f + 5), opt(2 * f + 1)].filter((o) => okOpt(Number(o.values[0]))));
	const orient = kind === 'reale' ? 'reale e capovolta' : 'virtuale e diritta';
	const k = 5.5 / Math.max(p, 2 * Math.abs(f), Math.abs(q));
	const alt = `Uno specchio ${f > 0 ? 'concavo' : 'convesso'} con l'oggetto, una freccia, a ${p} centimetri dal vertice.`;
	return {
		prompt: 'Trova la distanza focale.',
		problem: textBlock(`Un oggetto si trova a $${cm(p)}$ da uno specchio sferico. La sua immagine è ${orient}, ${s.words}. Qual è la distanza focale $f$ dello specchio, con il suo segno?`),
		solution: `f = ${cm(f)}`,
		steps: [
			t(`L'immagine è ${orient}: G = ${G > 0 ? '+' : '−'}${s.g < 1 ? `1/${Math.round(1 / s.g)}` : s.g}.`),
			`q = -G \\cdot p = ${cm(q)}`,
			t(`q è ${q > 0 ? 'positiva' : 'negativa'}: l'immagine è ${q > 0 ? 'reale' : 'virtuale'}.`),
			`\\frac{1}{f} = \\frac{1}{p} + \\frac{1}{q} = \\frac{1}{${decTex(exact(p))}} + \\frac{1}{${paren(q)}}`,
			`f = ${cm(f)}`,
			t(`f è ${f > 0 ? 'positiva: lo specchio è concavo' : 'negativa: lo specchio è convesso'}.`),
		],
		answer,
		params: { case: kind, p, G: G > 1 || G < -1 ? String(G) : `${G < 0 ? '-' : ''}1/${Math.round(1 / Math.abs(G))}`, k },
		solutionScene: mirrorScene({ p, f, k, showF: true, showC: true, quote: 'p', solution: true, alt: `${alt} L'immagine è ${orient}; la distanza focale è ${exact(f).replace('.', ',').replace('-', 'meno ')} centimetri.` }),
	};
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = {
	1: level1,
	2: (rng) => realImage(rng, 2),
	3: (rng) => realImage(rng, 3),
	4: (rng) => virtualImage(rng, 4),
	5: (rng) => virtualImage(rng, 5),
	6: level6,
};

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 1000; attempt++) {
		let b: Built;
		try {
			b = make(rng);
		} catch {
			continue;
		}
		const sample: Sample = { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: b.params, ...(b.scene ? { scene: b.scene } : {}), solutionScene: b.solutionScene };
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test([sample.problem, sample.solution, ...sample.steps].join(' '))) v.push('parole vietate');
	const a = sample.answer;
	if (a.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
	if (a.options.length !== 4 || new Set(a.options.map((o) => o.latex)).size !== 4) v.push('servono quattro opzioni diverse');
	if (!sample.solutionScene) v.push('manca la scena della soluzione');
	if (sample.level !== 6 && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisSpecchiSferici: Generator = {
	id: ID,
	title: 'Gli specchi sferici',
	levels: {
		1: { label: 'Il fuoco e il raggio di curvatura', constraints: ['specchio concavo, f = R/2', 'raggio di curvatura pari, in centimetri'] },
		2: { label: "L'immagine reale di uno specchio concavo", constraints: ['oggetto oltre il fuoco', 'q esatta, al mezzo centimetro'] },
		3: { label: "Altezza e verso dell'immagine", constraints: ['immagine reale', 'ingrandimento G = −q/p'] },
		4: { label: "L'immagine virtuale dello specchio concavo", constraints: ['oggetto tra il fuoco e lo specchio', 'q negativa'] },
		5: { label: 'Lo specchio convesso', constraints: ['f = −R/2', 'q negativa'] },
		6: { label: "La distanza focale dall'immagine", constraints: ['p e il tipo di immagine', 'f con il segno'] },
	},
	generate,
	check,
};

export default fisSpecchiSferici;
