/**
 * La riflessione e gli specchi piani. Spec: specs/exercises/riflessione.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/32-riflessione.md): the angle between the incident and
 * the reflected ray from the angle of incidence; the angle of reflection from the angle between the ray and the
 * mirror; the distance of your image in a plane mirror when you walk towards it; the shortest mirror to see yourself
 * whole and where its edges go; a ray reflected by two mirrors at an angle. Angles are whole degrees (multiples of 5
 * with two mirrors), lengths exact to the centimetre: nothing to round. Distractors are the lesson's mistakes: the
 * angle measured from the surface, the image on the mirror or at the same distance as the step, the whole height
 * for the mirror, the second mirror treated as if it were perpendicular. The scene draws the data; the reflected
 * rays, the image and the mirror found are in `solutionScene`.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { BANNED, choiceOf, qOpt, qty, t } from '../vettori';
import { isDec, ray, scene, type El, type P } from '../raggi-specchi';

export const ID = 'riflessione';

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer;
	params: Record<string, unknown>;
	scene: SceneRef;
	solutionScene: SceneRef;
}

const DEG = Math.PI / 180;
const deg = (x: number): ChoiceOption => ({ latex: `${x}^\\circ`, values: [String(x)] });
const okDeg = (x: number) => Number.isInteger(x) && x > 0 && x < 180;
const mOpt = (x: number, d = 2) => qOpt(x.toFixed(d), 'm');
const m1 = (x: number) => qty(x.toFixed(1), 'm');
const m2 = (x: number) => qty(x.toFixed(2), 'm');
const dir = (a: number): P => [Math.cos(a * DEG), Math.sin(a * DEG)];

// ---------------------------------------------------------------------------
// Levels 1-2: one mirror

function oneMirror(rng: Rng, level: 1 | 2): Built {
	let a: number;
	do a = rng.int(15, 75);
	while (a === 45 || (level === 1 && a < 20));
	const i = level === 1 ? a : 90 - a; // angle of incidence
	const L = 2.2;
	const S: P = [-L * Math.sin(i * DEG), L * Math.cos(i * DEG)];
	const R: P = [L * Math.sin(i * DEG), L * Math.cos(i * DEG)];
	const base = (): El[] => [
		{ tipo: 'specchio', da: [-2.5, 0], a: [2.5, 0] },
		{ tipo: 'linea', da: [0, 0], a: [0, 1.9] },
		ray(S, [0, 0], 1),
	];
	const given: El =
		level === 1
			? { tipo: 'angolo', o: [0, 0], da: [0, 1], a: [S[0] / L, S[1] / L], testo: `${i}°`, r: 0.6 }
			: { tipo: 'angolo', o: [0, 0], da: [S[0] / L, S[1] / L], a: [-1, 0], testo: `${a}°`, r: 0.6 };
	const sol: El[] = [...base(), given, ray([0, 0], R, 1), { tipo: 'angolo', o: [0, 0], da: [R[0] / L, R[1] / L], a: [0, 1], testo: `${i}°`, r: level === 1 ? 0.6 : 0.9 }];
	let right: number, mistakes: number[], problem: string, steps: string[];
	if (level === 1) {
		right = 2 * i;
		mistakes = [i, 90 - i, 180 - 2 * i];
		problem = textBlock(`Un raggio di luce colpisce uno specchio piano con un angolo di incidenza di $${i}^\\circ$. Quanto è ampio l'angolo tra il raggio incidente e il raggio riflesso?`);
		steps = [t("L'angolo di riflessione è uguale a quello di incidenza:"), `r = i = ${i}^\\circ`, t('I due angoli stanno ai due lati della normale, e si sommano:'), `${i}^\\circ + ${i}^\\circ = ${right}^\\circ`];
	} else {
		right = i;
		mistakes = [a, 2 * a, 180 - 2 * a];
		problem = textBlock(`Un raggio di luce forma un angolo di $${a}^\\circ$ con la superficie di uno specchio piano. Quanto vale l'angolo di riflessione?`);
		steps = [t("Gli angoli si misurano dalla normale, perpendicolare allo specchio:"), `i = 90^\\circ - ${a}^\\circ = ${i}^\\circ`, `r = i = ${i}^\\circ`];
	}
	const answer = choiceOf(rng, deg(right), mistakes.filter((x) => okDeg(x) && x !== right).map(deg), [deg(right + 10), deg(right - 5)].filter((o) => okDeg(Number(o.values[0]))));
	const alt = level === 1 ? `Uno specchio piano orizzontale, la normale tratteggiata e un raggio incidente con angolo di incidenza di ${i} gradi.` : `Uno specchio piano orizzontale e un raggio che forma ${a} gradi con la superficie dello specchio.`;
	return {
		prompt: level === 1 ? "Trova l'angolo tra i due raggi." : "Trova l'angolo di riflessione.",
		problem,
		solution: level === 1 ? `${right}^\\circ` : `r = ${right}^\\circ`,
		steps,
		answer,
		params: { case: i < 45 ? 'i < 45' : 'i > 45', angle: a },
		scene: scene(alt, [...base(), given]),
		solutionScene: scene(`${alt} Il raggio riflesso forma con la normale un angolo di ${i} gradi.`, sol),
	};
}

// ---------------------------------------------------------------------------
// Level 3: the image in a plane mirror

function planeImage(rng: Rng): Built {
	const c1 = (x: number) => x.toFixed(1).replace('.', ',');
	const d10 = rng.int(12, 49);
	const x10 = rng.int(2, Math.min(15, d10 - 5));
	const d = d10 / 10, x = x10 / 10;
	const askDistance = rng.next() < 0.5;
	const right = askDistance ? 2 * (d - x) : 2 * x;
	const mistakes = askDistance ? [d - x, 2 * d - x, 2 * d] : [x, 4 * x, 2 * (d - x)];
	const answer = choiceOf(rng, mOpt(right, 1), mistakes.filter((y) => y > 0 && Math.abs(y - right) > 1e-9).map((y) => mOpt(y, 1)), [mOpt(right + 0.5, 1), mOpt(right + 1, 1)]);
	const s = Math.min(1, 3.2 / d); // drawn cm per metre
	const hP = 1.7 * s, eP = 1.6 * s;
	const floor: El = { tipo: 'parete', da: [-d * s - 0.6, 0], a: [d * s + 0.6, 0] };
	const mirror: El = { tipo: 'specchio', da: [0, 0.2 * s], a: [0, 1.9 * s] };
	const els: El[] = [floor, mirror, { tipo: 'persona', piede: [-d * s, 0], h: hP, occhi: eP }, { tipo: 'quota', da: [-d * s, -0.45], a: [0, -0.45], testo: `${c1(d)} m` }, { tipo: 'quota', da: [-d * s, -1.15], a: [-(d - x) * s, -1.15], testo: `${c1(x)} m` }];
	const after = d - x;
	const sol: El[] = [floor, mirror, { tipo: 'persona', piede: [-after * s, 0], h: hP, occhi: eP }, { tipo: 'persona', piede: [after * s, 0], h: hP, occhi: eP, virtuale: true }, { tipo: 'quota', da: [-after * s, -0.45], a: [after * s, -0.45], testo: `${c1(2 * after)} m` }];
	const problem = textBlock(`Sei a $${m1(d)}$ da uno specchio piano verticale e fai un passo di $${m1(x)}$ verso lo specchio. ${askDistance ? 'Quanto dista, adesso, la tua immagine da te?' : 'Di quanto si è avvicinata a te la tua immagine?'}`);
	const steps = [t("L'immagine è dietro lo specchio, alla stessa distanza da esso."), `\\text{prima: } 2 \\cdot ${d.toFixed(1).replace('.', '{,}')} = ${m1(2 * d)}`, `\\text{dopo: } 2 \\cdot (${d.toFixed(1).replace('.', '{,}')} - ${x.toFixed(1).replace('.', '{,}')}) = ${m1(2 * after)}`];
	if (!askDistance) steps.push(`${(2 * d).toFixed(1).replace('.', '{,}')} - ${(2 * after).toFixed(1).replace('.', '{,}')} = ${m1(2 * x)}`, t('Il doppio del passo.'));
	const alt = `Una persona a ${c1(d)} metri da uno specchio verticale; sotto, il passo di ${c1(x)} metri verso lo specchio.`;
	return {
		prompt: askDistance ? "Trova la distanza dall'immagine." : 'Trova di quanto si avvicina.',
		problem,
		solution: m1(right),
		steps,
		answer,
		params: { case: askDistance ? 'distanza' : 'avvicinamento', d, x, s },
		scene: scene(alt, els),
		solutionScene: scene(`Dopo il passo la persona è a ${c1(after)} metri dallo specchio, e la sua immagine tratteggiata è ${c1(after)} metri dietro lo specchio: ${c1(2 * after)} metri in tutto.`, sol),
	};
}

// ---------------------------------------------------------------------------
// Level 4: the shortest mirror

function shortestMirror(rng: Rng): Built {
	const c2 = (x: number) => x.toFixed(2).replace('.', ',');
	const Hc = 2 * rng.int(75, 95); // height, even centimetres
	const Ec = Hc - 2 * rng.int(4, 6); // eyes
	const d = rng.int(8, 25) / 10;
	const dT = qty(d.toFixed(1), 'm');
	const H = Hc / 100, E = Ec / 100;
	const which = rng.pick(['lunghezza', 'bordo inferiore', 'bordo superiore'] as const);
	const right = which === 'lunghezza' ? H / 2 : which === 'bordo inferiore' ? E / 2 : (H + E) / 2;
	const mistakes = which === 'lunghezza' ? [H, E / 2, H / 4, (H + E) / 2] : which === 'bordo inferiore' ? [E, H / 2, E / 4, H - E / 2] : [H, E, H / 2, H - (H - E) / 4];
	const answer = choiceOf(rng, mOpt(right), mistakes.filter((y) => Math.abs(y - right) > 1e-9 && isDec(y, 2)).map((y) => mOpt(y)), [mOpt(right + 0.1), mOpt(right - 0.05)]);
	const s = 1.6;
	const px = -d * s;
	const person: El = { tipo: 'persona', piede: [px, 0], h: H * s, occhi: E * s };
	const floor: El = { tipo: 'parete', da: [px - 1.0, 0], a: [0.7, 0] };
	const wall: El = { tipo: 'parete', da: [0, 0], a: [0, H * s + 0.3] };
	const quotes: El[] = [{ tipo: 'quota', da: [px - 0.55, H * s], a: [px - 0.55, 0], testo: `${c2(H)} m` }];
	const bottom = (E / 2) * s, top = ((H + E) / 2) * s;
	const eye: P = [px, E * s];
	const sol: El[] = [
		floor,
		wall,
		{ tipo: 'specchio', da: [0, bottom], a: [0, top] },
		person,
		ray([px, 0], [0, bottom], 2),
		ray([0, bottom], eye, 2),
		ray([px, H * s], [0, top], 1),
		ray([0, top], eye, 1),
		...quotes,
		{ tipo: 'quota', da: [0.35, 0], a: [0.35, bottom], testo: `${c2(E / 2)} m` },
		{ tipo: 'quota', da: [0.35, bottom], a: [0.35, top], testo: `${c2(H / 2)} m` },
	];
	const q = which === 'lunghezza' ? 'Quanto deve essere lungo, al minimo, lo specchio perché si veda per intero?' : which === 'bordo inferiore' ? 'A quale altezza da terra deve stare, al massimo, il bordo inferiore dello specchio perché si veda i piedi?' : 'A quale altezza da terra deve arrivare, almeno, il bordo superiore dello specchio perché si veda la cima della testa?';
	const steps = [
		t('Il raggio dai piedi agli occhi si riflette a metà altezza degli occhi:'),
		`\\frac{${E.toFixed(2).replace('.', '{,}')}}{2} = ${m2(E / 2)}`,
		t('Quello dalla cima della testa, a metà tra testa e occhi:'),
		`\\frac{${H.toFixed(2).replace('.', '{,}')} + ${E.toFixed(2).replace('.', '{,}')}}{2} = ${m2((H + E) / 2)}`,
	];
	if (which === 'lunghezza') steps.push(`${((H + E) / 2).toFixed(2).replace('.', '{,}')} - ${(E / 2).toFixed(2).replace('.', '{,}')} = ${m2(H / 2)}`, t("La metà dell'altezza: la distanza dallo specchio non conta."));
	const alt = `Una persona alta ${c2(H)} metri, a ${d.toFixed(1).replace('.', ',')} metri da un muro; gli occhi sono a ${c2(E)} metri da terra.`;
	return {
		prompt: which === 'lunghezza' ? 'Trova la lunghezza minima.' : "Trova l'altezza del bordo.",
		problem: textBlock(`Una persona alta $${m2(H)}$ ha gli occhi a $${m2(E)}$ da terra e sta a $${dT}$ da uno specchio verticale appeso al muro. ${q}`),
		solution: m2(right),
		steps,
		answer,
		params: { case: which, H, E, d, s },
		scene: scene(alt, [floor, wall, person, ...quotes]),
		solutionScene: scene(`${alt} Lo specchio va da ${c2(E / 2)} a ${c2((H + E) / 2)} metri da terra, ed è lungo ${c2(H / 2)} metri.`, sol),
	};
}

// ---------------------------------------------------------------------------
// Level 5: two mirrors at an angle

function twoMirrors(rng: Rng): Built {
	const beta = rng.next() < 0.2 ? 90 : 5 * rng.int(12, 24);
	const i1 = 5 * rng.int(2, 16);
	const atQ = 180 - beta - (90 - i1); // angle between the ray and the second mirror
	const i2 = Math.abs(90 - atQ);
	if (i2 < 10 || atQ < 20 || atQ > 160 || i2 === i1) throw new Error('resample');
	// Geometry: M1 along x from O, M2 at beta; P on M1, Q where the reflected ray meets M2.
	const u2 = dir(beta);
	const rdir: P = [-Math.sin(i1 * DEG), Math.cos(i1 * DEG)];
	let P0: P | null = null, Q: P | null = null;
	for (const dp of [2.4, 2.0, 2.8, 1.6, 3.0]) {
		const det = rdir[0] * -u2[1] - rdir[1] * -u2[0];
		const tt = ((0 - dp) * -u2[1] - 0 * -u2[0]) / det;
		const q: P = [dp + tt * rdir[0], tt * rdir[1]];
		const oq = Math.hypot(q[0], q[1]);
		if (tt > 0 && oq > 0.8 && oq < 2.6) {
			P0 = [dp, 0];
			Q = q;
			break;
		}
	}
	if (!P0 || !Q) throw new Error('resample');
	const L2 = 3.0;
	const end2: P = [L2 * u2[0], L2 * u2[1]];
	const S: P = [P0[0] + 1.7 * Math.sin(i1 * DEG), 1.7 * Math.cos(i1 * DEG)];
	const n2: P = [u2[1], -u2[0]]; // normal to M2, into the opening
	const inc: P = [Q[0] - P0[0], Q[1] - P0[1]];
	const dotv = inc[0] * n2[0] + inc[1] * n2[1];
	const outd: P = [inc[0] - 2 * dotv * n2[0], inc[1] - 2 * dotv * n2[1]];
	const ol = Math.hypot(outd[0], outd[1]);
	const E: P = [Q[0] + (2.0 * outd[0]) / ol, Q[1] + (2.0 * outd[1]) / ol];
	const back: P = [P0[0] - Q[0], P0[1] - Q[1]];
	const bl = Math.hypot(back[0], back[1]);
	const mirrors: El[] = [
		{ tipo: 'specchio', da: [0, 0], a: [3.4, 0] },
		{ tipo: 'specchio', da: end2, a: [0, 0] },
		{ tipo: 'angolo', o: [0, 0], da: [1, 0], a: u2, testo: `${beta}°`, r: 0.45 },
		{ tipo: 'linea', da: P0, a: [P0[0], 1.3] },
		ray(S, P0, 1),
		{ tipo: 'angolo', o: P0, da: [Math.sin(i1 * DEG), Math.cos(i1 * DEG)], a: [0, 1], testo: `${i1}°`, r: 0.55 },
	];
	// The arc of i2 goes counterclockwise from the lower of the two directions to the other.
	const b: P = [back[0] / bl, back[1] / bl];
	const cr = n2[0] * b[1] - n2[1] * b[0];
	const sol: El[] = [
		...mirrors,
		ray(P0, Q, 1),
		{ tipo: 'linea', da: Q, a: [Q[0] + 0.9 * n2[0], Q[1] + 0.9 * n2[1]] },
		{ tipo: 'angolo', o: Q, da: cr > 0 ? n2 : b, a: cr > 0 ? b : n2, testo: `${i2}°`, r: 0.5 },
		ray(Q, E, 1),
	];
	const right = i2;
	const mistakes = [i1, 90 - i1, atQ > 90 ? 180 - atQ : atQ, Math.abs(beta - 90 + i1)].filter((x) => okDeg(x) && x !== right && x <= 90);
	const answer = choiceOf(rng, deg(right), mistakes.map(deg), [deg(right + 10), deg(Math.abs(right - 5) || 25)].filter((o) => okDeg(Number(o.values[0])) && o.values[0] !== String(right)));
	const alt = `Due specchi piani che formano un angolo di ${beta} gradi; un raggio colpisce il primo specchio con angolo di incidenza di ${i1} gradi.`;
	return {
		prompt: "Trova l'angolo di incidenza sul secondo specchio.",
		problem: textBlock(`Due specchi piani formano un angolo di $${beta}^\\circ$. Un raggio colpisce il primo specchio con un angolo di incidenza di $${i1}^\\circ$ e, riflesso, va a colpire il secondo. Con quale angolo di incidenza?`),
		solution: `i_2 = ${right}^\\circ`,
		steps: [
			t('Il raggio riflesso forma con il primo specchio l’angolo'.replace('’', "'")),
			`90^\\circ - ${i1}^\\circ = ${90 - i1}^\\circ`,
			t('Nel triangolo tra il raggio e i due specchi, l’angolo con il secondo specchio è'.replace('’', "'")),
			`180^\\circ - ${beta}^\\circ - ${90 - i1}^\\circ = ${atQ}^\\circ`,
			t('Dalla normale:'),
			`i_2 = ${atQ > 90 ? `${atQ}^\\circ - 90^\\circ` : `90^\\circ - ${atQ}^\\circ`} = ${right}^\\circ`,
		],
		answer,
		params: { case: beta === 90 ? 'perpendicolari' : beta < 90 ? 'acuto' : 'ottuso', beta, i1, P: P0 },
		scene: scene(alt, mirrors),
		solutionScene: scene(`${alt} Il raggio riflesso arriva sul secondo specchio con angolo di incidenza di ${right} gradi.`, sol),
	};
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = {
	1: (rng) => oneMirror(rng, 1),
	2: (rng) => oneMirror(rng, 2),
	3: planeImage,
	4: shortestMirror,
	5: twoMirrors,
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
		const sample: Sample = { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: b.params, scene: b.scene, solutionScene: b.solutionScene };
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
	if (!sample.scene || !sample.solutionScene) v.push('manca la scena');
	return v;
}

export const riflessione: Generator = {
	id: ID,
	title: 'La riflessione e gli specchi piani',
	levels: {
		1: { label: "L'angolo tra i due raggi", constraints: ['angolo di incidenza da 10° a 80°', 'r = i'] },
		2: { label: "Dall'angolo con lo specchio", constraints: ['angolo con la superficie da 10° a 80°, non 45°', 'i = 90° − angolo'] },
		3: { label: "L'immagine nello specchio piano", constraints: ['distanze al decimetro', 'immagine alla stessa distanza, dietro lo specchio'] },
		4: { label: 'Lo specchio per vedersi per intero', constraints: ['altezze al centimetro', 'metà altezza, a qualunque distanza'] },
		5: { label: 'Due specchi ad angolo', constraints: ['angoli multipli di 5°', 'triangolo tra raggio e specchi'] },
	},
	generate,
	check,
};

export default riflessione;
