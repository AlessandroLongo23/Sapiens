/**
 * I raggi di luce e la propagazione rettilinea. Spec: specs/exercises/ottica-geometrica.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/31-ottica-geometrica.md): the time light takes over a
 * distance in metres (t = d/c); the same with kilometres or minutes to convert; the light-year; the shadow of a
 * card lit by a point source (H/h = D/d, from similar triangles); the image in a camera obscura (h'/h = d'/d); the
 * shadow problem backwards (where to put the card, or how tall it is). c = 3,00 · 10^8 m/s and 1 anno luce =
 * 9,46 · 10^15 m are given in the text. Results are rounded to the significant figures of the data, as the lesson
 * "Le cifre significative" teaches (3 with c, 2 with the other data); a value too close to a rounding boundary is
 * never used. Distractors are the lesson's mistakes: the division turned upside down, the powers of ten added, the
 * kilometres or the minutes not converted, the light-year taken for a time, the wrong distance in the proportion.
 * Levels 4-6 have a scene (source, card, screen; the camera obscura), with the answer only in `solutionScene`.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { BANNED, choiceOf, decTex, qOpt, qty, roundSig, t } from '../vettori';
import { ray, resultTex, scene, sciParts, sciTex, type El, type P } from '../raggi-specchi';

export const ID = 'ottica-geometrica';

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer;
	params: Record<string, unknown>;
	scene?: SceneRef;
	solutionScene?: SceneRef;
}

const C = 3.0e8;
const LY = 9.46e15;
const C_TEX = '$c = 3{,}00 \\cdot 10^{8}\\,\\text{m/s}$';
const LY_TEX = '$1\\,\\text{anno luce} = 9{,}46 \\cdot 10^{15}\\,\\text{m}$';

/** An option with n significant figures, plain or in scientific notation as the lesson writes it. */
function sOpt(x: number, n: number, unit: string): ChoiceOption | null {
	const r = resultTex(x, n);
	return r ? { latex: `${r[0]}\\,\\text{${unit}}`, values: [r[1]] } : null;
}
const some = (xs: (ChoiceOption | null)[]) => xs.filter((o): o is ChoiceOption => o !== null);
/** A datum in scientific notation with n figures, drawn in [lo, hi]. */
function sciDatum(rng: Rng, lo: number, hi: number, n: number): { x: number; tex: string } {
	for (;;) {
		const v = lo * (hi / lo) ** rng.next();
		const sp = sciParts(v, n);
		if (!sp) continue;
		const x = Number(sp[0]) * 10 ** sp[1];
		if (x < lo || x > hi) continue;
		return { x, tex: sciTex(sp[0], sp[1]) };
	}
}
/** 2 significant figures without ambiguous zeros: 1.1..9.9 or 11..99. */
function two(rng: Rng, small: boolean): number {
	for (;;) {
		const k = rng.int(11, 99);
		if (k % 10) return small ? k / 10 : k;
	}
}

// ---------------------------------------------------------------------------
// Levels 1-3: the speed of light

const PLACES = [
	{ phrase: 'Un segnale radio, che viaggia alla velocità della luce, va da un satellite alla Terra percorrendo', lo: 2.0e7, hi: 4.2e7 },
	{ phrase: 'La luce riflessa dalla Luna percorre, per arrivare fino a noi,', lo: 3.6e8, hi: 4.05e8 },
	{ phrase: 'La luce del Sole percorre, per arrivare sulla Terra,', lo: 1.47e11, hi: 1.52e11 },
	{ phrase: 'La luce riflessa da Marte percorre, per arrivare sulla Terra,', lo: 5.6e10, hi: 4.0e11 },
	{ phrase: 'La luce riflessa da Giove percorre, per arrivare sulla Terra,', lo: 5.9e11, hi: 9.6e11 },
];

function level1(rng: Rng): Built {
	const pl = rng.pick(PLACES);
	const d = sciDatum(rng, pl.lo, pl.hi, 3);
	const tt = d.x / C;
	const right = sOpt(tt, 3, 's');
	if (!right) throw new Error('resample');
	const answer = choiceOf(rng, right, some([sOpt(tt * 1e16, 3, 's'), sOpt(d.x * C, 3, 's'), sOpt(C / d.x, 3, 's')]), some([sOpt(tt * 1000, 3, 's'), sOpt(tt / 1000, 3, 's')]));
	return {
		prompt: 'Trova il tempo.',
		problem: textBlock(`${pl.phrase} $${d.tex}\\,\\text{m}$. Quanto tempo impiega? Usa ${C_TEX}.`),
		solution: `t = ${right.latex}`,
		steps: [`t = \\frac{d}{c} = \\frac{${d.tex}\\,\\text{m}}{3{,}00 \\cdot 10^{8}\\,\\text{m/s}} = ${right.latex}`, t('Gli esponenti si sottraggono; il risultato ha tre cifre significative, come i dati.')],
		answer,
		params: { case: 'metri', d: d.x },
	};
}

const MINUTES = [
	{ phrase: 'La luce del Sole impiega', lo: 8.1, hi: 8.5, from: 'dal Sole' },
	{ phrase: 'La luce riflessa da Giove impiega', lo: 33, hi: 54, from: 'da Giove' },
	{ phrase: 'La luce riflessa da Saturno impiega', lo: 68, hi: 84, from: 'da Saturno' },
];

function level2(rng: Rng): Built {
	if (rng.next() < 0.5) {
		const pl = rng.pick(PLACES.slice(2));
		const d = sciDatum(rng, pl.lo / 1000, pl.hi / 1000, 3);
		const tt = (d.x * 1000) / C;
		const right = sOpt(tt, 3, 's');
		if (!right) throw new Error('resample');
		const answer = choiceOf(rng, right, some([sOpt(tt / 1000, 3, 's'), sOpt(tt * 1000, 3, 's'), sOpt(C / (d.x * 1000), 3, 's')]), some([sOpt(tt * 1e16, 3, 's')]));
		return {
			prompt: 'Trova il tempo.',
			problem: textBlock(`${pl.phrase} $${d.tex}\\,\\text{km}$. Quanto tempo impiega? Usa ${C_TEX}.`),
			solution: `t = ${right.latex}`,
			steps: [t('La distanza va in metri:'), `d = ${d.tex}\\,\\text{km} = ${sciTex(...(sciParts(d.x * 1000, 3) as [string, number]))}\\,\\text{m}`, `t = \\frac{d}{c} = ${right.latex}`],
			answer,
			params: { case: 'chilometri', d_km: d.x },
		};
	}
	const pl = rng.pick(MINUTES);
	let mins: number;
	do mins = pl.hi < 10 ? rng.int(pl.lo * 10, pl.hi * 10) / 10 : rng.int(pl.lo, pl.hi);
	while (mins >= 10 && mins % 10 === 0);
	const d = C * mins * 60;
	const right = sOpt(d, 2, 'm');
	if (!right) throw new Error('resample');
	const answer = choiceOf(rng, right, some([sOpt(C * mins, 2, 'm'), sOpt(C * mins * 3600, 2, 'm'), sOpt((mins * 60) / C, 2, 'm')]), some([sOpt(d * 1000, 2, 'm')]));
	const mTex = decTex(String(mins));
	return {
		prompt: 'Trova la distanza.',
		problem: textBlock(`${pl.phrase} $${mTex}$ minuti per arrivare sulla Terra. Quanti metri percorre? Usa ${C_TEX}.`),
		solution: `d = ${right.latex}`,
		steps: [t('Il tempo va in secondi:'), `t = ${mTex} \\cdot 60 = ${decTex(String(Math.round(mins * 600) / 10))}\\,\\text{s}`, `d = c \\cdot t = ${right.latex}`, t('Il tempo ha due cifre significative, e così il risultato.')],
		answer,
		params: { case: 'minuti', minutes: mins },
	};
}

function level3(rng: Rng): Built {
	if (rng.next() < 0.5) {
		const N = two(rng, rng.next() < 0.5);
		const d = N * LY;
		const right = sOpt(d, 2, 'm');
		if (!right) throw new Error('resample');
		const answer = choiceOf(rng, right, some([sOpt(N * 3.156e7, 2, 'm'), sOpt(N * C, 2, 'm'), sOpt(N / LY, 2, 'm')]), some([sOpt(d / 1000, 2, 'm')]));
		return {
			prompt: 'Trova la distanza in metri.',
			problem: textBlock(`Una stella dista $${decTex(String(N))}$ anni luce dalla Terra. Quanti metri sono? Usa ${LY_TEX}.`),
			solution: `d = ${right.latex}`,
			steps: [`d = ${decTex(String(N))} \\cdot 9{,}46 \\cdot 10^{15}\\,\\text{m} = ${right.latex}`, t('Il dato ha due cifre significative, e così il risultato.')],
			answer,
			params: { case: 'in metri', N },
		};
	}
	const dd = sciDatum(rng, 1.1e16, 9.0e17, 2);
	const N = dd.x / LY;
	const r = roundSig(N, 2);
	if (r === null) throw new Error('resample');
	const right = qOpt(r, 'anni luce');
	const alt = (x: number) => {
		const o = sOpt(x, 2, 'anni luce');
		return o;
	};
	const answer = choiceOf(rng, right, some([alt(dd.x / 3.156e7), alt(dd.x / C), alt(N * 1000)]), some([alt(N * 10), alt(N / 10)]));
	return {
		prompt: 'Trova la distanza in anni luce.',
		problem: textBlock(`Una stella dista dalla Terra $${dd.tex}\\,\\text{m}$. Quanti anni luce sono? Usa ${LY_TEX}.`),
		solution: `d = ${qty(r, 'anni luce')}`,
		steps: [`\\frac{${dd.tex}\\,\\text{m}}{9{,}46 \\cdot 10^{15}\\,\\text{m}} = ${qty(r, 'anni luce')}`, t('Si divide per la lunghezza di un anno luce; due cifre significative.')],
		answer,
		params: { case: 'in anni luce', d: dd.x },
	};
}

// ---------------------------------------------------------------------------
// Levels 4 and 6: the shadow; level 5: the camera obscura

const cmOpt = (x: number) => {
	const r = roundSig(x, 2);
	return r === null ? null : qOpt(r, 'cm');
};
const c1 = (x: number) => String(x).replace('.', ',');

/** Source at the origin, card at d, screen at D (drawn), the card drawn 0.8 high; what the problem gives. */
function shadowScene(o: { d: number; D: number; hT: string | null; HT: string | null; dT: string | null; DT: string; card: boolean; solution: boolean; alt: string }): SceneRef {
	const X = 6;
	const k = X / o.D;
	const xd = o.d * k;
	const w = 0.4;
	const W = (w * o.D) / o.d;
	const els: El[] = [];
	if (o.solution || o.HT) els.push({ tipo: 'zona', punti: o.card || o.solution ? [[xd, w], [X, W], [X, -W], [xd, -w]] : [[X - 0.02, W], [X, W], [X, -W], [X - 0.02, -W]] });
	if (o.solution) els.push(ray([0, 0], [X, W], 1), ray([0, 0], [X, -W], 1));
	els.push({ tipo: 'schermo', da: [X, -2.0], a: [X, 2.0] });
	if (o.card || o.solution) els.push({ tipo: 'ostacolo', da: [xd, -w], a: [xd, w] });
	els.push({ tipo: 'sorgente', at: [0, 0] }, { tipo: 'testo', at: [-0.05, 0], testo: 'S', dir: [-1, 0], corsivo: true });
	if (o.hT && (o.card || o.solution)) els.push({ tipo: 'quota', da: [xd + 0.25, -w], a: [xd + 0.25, w], testo: o.hT });
	if (o.HT) els.push({ tipo: 'quota', da: [X + 0.45, -W], a: [X + 0.45, W], testo: o.HT });
	if (o.dT) els.push({ tipo: 'quota', da: [0, -2.3], a: [xd, -2.3], testo: o.dT });
	els.push({ tipo: 'quota', da: [0, -2.95], a: [X, -2.95], testo: o.DT });
	return scene(o.alt, els);
}

function level4(rng: Rng): Built {
	const h = two(rng, true);
	let d: number;
	do d = two(rng, false);
	while (d < 30);
	let D10: number;
	do D10 = rng.int(11, 49);
	while (D10 % 10 === 0 || D10 * 10 < 1.5 * d || D10 * 10 > 4 * d);
	const D = D10 / 10;
	const H = (h * D * 100) / d;
	const r = roundSig(H, 2);
	if (r === null) throw new Error('resample');
	const right = qOpt(r, 'cm');
	const answer = choiceOf(rng, right, some([cmOpt((h * d) / (D * 100)), cmOpt((h * (D * 100 - d)) / d), cmOpt((h * D) / d), cmOpt(h)]), some([cmOpt(H * 2), cmOpt(H / 2)]));
	const hT = `${c1(h)} cm`, dT = `${d} cm`, DT = `${c1(D)} m`;
	const alt = `Una sorgente puntiforme S, un cartoncino alto ${c1(h)} centimetri a ${d} centimetri da essa e uno schermo a ${c1(D)} metri dalla sorgente.`;
	return {
		prompt: "Trova l'altezza dell'ombra.",
		problem: textBlock(`Una lampadina puntiforme illumina un cartoncino alto $${qty(decTex(String(h)), 'cm')}$, a $${qty(String(d), 'cm')}$ da essa. Uno schermo parallelo al cartoncino è a $${qty(decTex(String(D)), 'm')}$ dalla lampadina. Quanto è alta l'ombra del cartoncino sullo schermo?`),
		solution: `H = ${qty(decTex(r), 'cm')}`,
		steps: [t('Le distanze nella stessa unità:'), `D = ${qty(decTex(String(D)), 'm')} = ${qty(String(D10 * 10), 'cm')}`, t('Dai triangoli simili:'), `H = h \\cdot \\frac{D}{d} = ${decTex(String(h))} \\cdot \\frac{${D10 * 10}}{${d}} = ${decTex(H.toFixed(3))}\\ldots \\approx ${qty(decTex(r), 'cm')}`, t('Due cifre significative, come i dati.')],
		answer,
		params: { case: D10 * 10 <= 2.5 * d ? 'vicino' : 'lontano', h, d, D },
		scene: shadowScene({ d, D: D * 100, hT, HT: null, dT, DT, card: true, solution: false, alt }),
		solutionScene: shadowScene({ d, D: D * 100, hT, HT: `${decTex(r).replace('{,}', ',')} cm`, dT, DT, card: true, solution: true, alt: `${alt} I raggi che sfiorano i bordi del cartoncino delimitano sullo schermo un'ombra alta ${r.replace('.', ',')} centimetri.` }),
	};
}

function level6(rng: Rng): Built {
	const askD = rng.next() < 0.5;
	// The case is drawn once, so both keep their share when the numbers have to be drawn again.
	for (let n = 0; n < 200; n++) {
		try {
			return level6Of(rng, askD);
		} catch {
			continue;
		}
	}
	throw new Error('resample');
}

function level6Of(rng: Rng, askD: boolean): Built {
	let D10: number;
	do D10 = rng.int(11, 49);
	while (D10 % 10 === 0);
	const D = D10 / 10;
	const DT = `${c1(D)} m`;
	if (askD) {
		const h = two(rng, true);
		const H = two(rng, false);
		const d = (h * D * 100) / H;
		const r = roundSig(d, 2);
		if (r === null || d < 0.2 * D * 100 || d > 0.67 * D * 100) throw new Error('resample');
		const answer = choiceOf(rng, qOpt(r, 'cm'), some([cmOpt((H * D * 100) / h), cmOpt((h * D) / H), cmOpt(D * 100 - (h * D * 100) / H)]), some([cmOpt(d * 2), cmOpt(d / 2)]));
		const alt = `Una sorgente puntiforme S e uno schermo a ${c1(D)} metri, su cui l'ombra del cartoncino deve essere alta ${H} centimetri.`;
		return {
			prompt: 'Trova dove mettere il cartoncino.',
			problem: textBlock(`Una lampadina puntiforme è a $${qty(decTex(String(D)), 'm')}$ da uno schermo. A quale distanza dalla lampadina va messo un cartoncino alto $${qty(decTex(String(h)), 'cm')}$, parallelo allo schermo, perché la sua ombra sia alta $${qty(String(H), 'cm')}$?`),
			solution: `d = ${qty(decTex(r), 'cm')}`,
			steps: [`D = ${qty(String(D10 * 10), 'cm')}`, t('Dalla proporzione H/h = D/d:'), `d = h \\cdot \\frac{D}{H} = ${decTex(String(h))} \\cdot \\frac{${D10 * 10}}{${H}} = ${decTex(d.toFixed(3))}\\ldots \\approx ${qty(decTex(r), 'cm')}`],
			answer,
			params: { case: 'distanza', h, H, D },
			scene: shadowScene({ d, D: D * 100, hT: null, HT: `${H} cm`, dT: null, DT, card: false, solution: false, alt }),
			solutionScene: shadowScene({ d, D: D * 100, hT: `${c1(h)} cm`, HT: `${H} cm`, dT: `${decTex(r).replace('{,}', ',')} cm`, DT, card: true, solution: true, alt: `${alt} Il cartoncino va a ${r.replace('.', ',')} centimetri dalla lampadina.` }),
		};
	}
	const d = two(rng, false);
	if (d > 0.67 * D * 100 || d < 0.2 * D * 100) throw new Error('resample');
	const H = two(rng, false);
	const h = (H * d) / (D * 100);
	const r = roundSig(h, 2);
	if (r === null) throw new Error('resample');
	const answer = choiceOf(rng, qOpt(r, 'cm'), some([cmOpt((H * D * 100) / d), cmOpt((H * d) / D), cmOpt(H)]), some([cmOpt(h * 2), cmOpt(h / 2)]));
	const alt = `Una sorgente puntiforme S, un cartoncino a ${d} centimetri da essa e uno schermo a ${c1(D)} metri, con l'ombra alta ${H} centimetri.`;
	return {
		prompt: "Trova l'altezza del cartoncino.",
		problem: textBlock(`Una lampadina puntiforme illumina un cartoncino a $${qty(String(d), 'cm')}$ da essa, e sullo schermo, parallelo al cartoncino e a $${qty(decTex(String(D)), 'm')}$ dalla lampadina, l'ombra è alta $${qty(String(H), 'cm')}$. Quanto è alto il cartoncino?`),
		solution: `h = ${qty(decTex(r), 'cm')}`,
		steps: [`D = ${qty(String(D10 * 10), 'cm')}`, t('Dalla proporzione H/h = D/d:'), `h = H \\cdot \\frac{d}{D} = ${H} \\cdot \\frac{${d}}{${D10 * 10}} = ${decTex(h.toFixed(3))}\\ldots \\approx ${qty(decTex(r), 'cm')}`],
		answer,
		params: { case: 'altezza', d, H, D },
		scene: shadowScene({ d, D: D * 100, hT: null, HT: `${H} cm`, dT: `${d} cm`, DT, card: true, solution: false, alt }),
		solutionScene: shadowScene({ d, D: D * 100, hT: `${decTex(r).replace('{,}', ',')} cm`, HT: `${H} cm`, dT: `${d} cm`, DT, card: true, solution: true, alt: `${alt} Il cartoncino è alto ${r.replace('.', ',')} centimetri.` }),
	};
}

/** The camera obscura, not to scale: object at x = 0, hole at 3, back wall at 5. */
function cameraScene(o: { hT: string; dT: string; dpT: string; hiT: string | null; solution: boolean; alt: string }): SceneRef {
	const top: P = [0, 0.9], foot: P = [0, -0.6], hole: P = [3, 0];
	const back = 5;
	const it: P = [back - 0.06, -0.6], ifoot: P = [back - 0.06, 0.4];
	const els: El[] = [{ tipo: 'scatola', x0: 3, x1: back, y0: -1, y1: 1, foro: 0 }];
	if (o.solution) els.push(ray(top, [back, -0.6], 1), ray(foot, [back, 0.4], 2), { tipo: 'immagine', piede: ifoot, h: it[1] - ifoot[1] });
	els.push({ tipo: 'oggetto', piede: foot, h: top[1] - foot[1] });
	els.push({ tipo: 'quota', da: [-0.35, 0.9], a: [-0.35, -0.6], testo: o.hT });
	els.push({ tipo: 'quota', da: [0, -1.35], a: [hole[0], -1.35], testo: o.dT }, { tipo: 'quota', da: [hole[0], -1.35], a: [back, -1.35], testo: o.dpT });
	if (o.hiT) els.push({ tipo: 'quota', da: [back + 0.3, -0.6], a: [back + 0.3, 0.4], testo: o.hiT });
	return scene(o.alt, els);
}

function level5(rng: Rng): Built {
	const askImage = rng.next() < 0.5;
	const d = two(rng, rng.next() < 0.5); // metres
	const dp = rng.int(11, 49); // centimetres
	if (dp % 10 === 0) throw new Error('resample');
	if (askImage) {
		const h = two(rng, true); // metres
		const hi = (h * dp) / d; // centimetres
		const r = roundSig(hi, 2);
		if (r === null || hi < 0.5) throw new Error('resample');
		const answer = choiceOf(rng, qOpt(r, 'cm'), some([cmOpt((h * d) / dp), cmOpt((h * dp) / (d * 100)), cmOpt((h * d * 100) / dp)]), some([cmOpt(hi * 2), cmOpt(hi / 2)]));
		const alt = `Un oggetto alto ${c1(h)} metri a ${c1(d)} metri dal foro di una camera oscura profonda ${dp} centimetri; disegno non in scala.`;
		return {
			prompt: "Trova l'altezza dell'immagine.",
			problem: textBlock(`Un albero alto $${qty(decTex(String(h)), 'm')}$ si trova a $${qty(decTex(String(d)), 'm')}$ dal foro di una camera oscura profonda $${qty(String(dp), 'cm')}$. Quanto è alta la sua immagine sulla parete di fondo?`),
			solution: `h' = ${qty(decTex(r), 'cm')}`,
			steps: [t('Dai triangoli simili con il vertice nel foro:'), `h' = h \\cdot \\frac{d'}{d} = ${decTex(String(h))}\\,\\text{m} \\cdot \\frac{${dp}\\,\\text{cm}}{${decTex(String(d))}\\,\\text{m}} = ${decTex(hi.toFixed(3))}\\ldots\\,\\text{cm} \\approx ${qty(decTex(r), 'cm')}`, t('I metri si semplificano e resta il centimetro; due cifre significative.')],
			answer,
			params: { case: 'immagine', h, d, dp },
			scene: cameraScene({ hT: `${c1(h)} m`, dT: `${c1(d)} m`, dpT: `${dp} cm`, hiT: null, solution: false, alt }),
			solutionScene: cameraScene({ hT: `${c1(h)} m`, dT: `${c1(d)} m`, dpT: `${dp} cm`, hiT: `${r.replace('.', ',')} cm`, solution: true, alt: `${alt} L'immagine è capovolta e alta ${r.replace('.', ',')} centimetri.` }),
		};
	}
	const hi = two(rng, true); // centimetres
	const h = (hi * d) / dp; // metres
	const r = roundSig(h, 2);
	if (r === null || h < 0.5 || h > 60) throw new Error('resample');
	const mOpt = (x: number) => {
		const s = roundSig(x, 2);
		return s === null ? null : qOpt(s, 'm');
	};
	const answer = choiceOf(rng, qOpt(r, 'm'), some([mOpt((hi * dp) / d), mOpt((hi * d) / (dp * 100)), mOpt((hi * d * 100) / dp)]), some([mOpt(h * 2), mOpt(h / 2)]));
	const alt = `Un edificio a ${c1(d)} metri dal foro di una camera oscura profonda ${dp} centimetri, con l'immagine alta ${c1(hi)} centimetri; disegno non in scala.`;
	return {
		prompt: "Trova l'altezza dell'oggetto.",
		problem: textBlock(`Un edificio si trova a $${qty(decTex(String(d)), 'm')}$ dal foro di una camera oscura profonda $${qty(String(dp), 'cm')}$, e la sua immagine sulla parete di fondo è alta $${qty(decTex(String(hi)), 'cm')}$. Quanto è alto l'edificio?`),
		solution: `h = ${qty(decTex(r), 'm')}`,
		steps: [t('Dalla proporzione tra immagine e oggetto:'), `h = h' \\cdot \\frac{d}{d'} = ${decTex(String(hi))}\\,\\text{cm} \\cdot \\frac{${decTex(String(d))}\\,\\text{m}}{${dp}\\,\\text{cm}} = ${decTex(h.toFixed(3))}\\ldots\\,\\text{m} \\approx ${qty(decTex(r), 'm')}`],
		answer,
		params: { case: 'oggetto', hi, d, dp },
		scene: cameraScene({ hT: 'h', dT: `${c1(d)} m`, dpT: `${dp} cm`, hiT: `${c1(hi)} cm`, solution: false, alt }),
		solutionScene: cameraScene({ hT: `${r.replace('.', ',')} m`, dT: `${c1(d)} m`, dpT: `${dp} cm`, hiT: `${c1(hi)} cm`, solution: true, alt: `${alt} L'edificio è alto ${r.replace('.', ',')} metri.` }),
	};
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

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
		const sample: Sample = { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: b.params, ...(b.scene ? { scene: b.scene } : {}), ...(b.solutionScene ? { solutionScene: b.solutionScene } : {}) };
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
	if (new Set(a.options.map((o) => o.values[0])).size !== 4) v.push('due opzioni con lo stesso valore');
	if (sample.level >= 4 && (!sample.scene || !sample.solutionScene)) v.push('manca la scena');
	return v;
}

export const otticaGeometrica: Generator = {
	id: ID,
	title: 'I raggi di luce e la propagazione rettilinea',
	levels: {
		1: { label: 'Il tempo della luce', constraints: ['t = d/c, distanza in metri', 'tre cifre significative'] },
		2: { label: 'Chilometri e minuti', constraints: ['distanza in chilometri o tempo in minuti da convertire'] },
		3: { label: "L'anno luce", constraints: ['1 anno luce = 9,46 · 10^15 m', 'due cifre significative'] },
		4: { label: "L'ombra di un cartoncino", constraints: ['sorgente puntiforme, H/h = D/d', 'distanze in cm e in m'] },
		5: { label: 'La camera oscura', constraints: ["h'/h = d'/d", 'altezza dell’immagine o dell’oggetto'] },
		6: { label: "L'ombra al contrario", constraints: ['dove mettere il cartoncino, o quanto è alto'] },
	},
	generate,
	check,
};

export default otticaGeometrica;
