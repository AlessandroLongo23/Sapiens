/**
 * Seno e coseno per scomporre un vettore. Spec: specs/exercises/fis-seno-coseno.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/15-fis-seno-coseno.md): a component of a vector in the
 * first quadrant from its modulus and its angle with the x axis; the same with the angle given from the y axis; a
 * component with its sign in the other quadrants (angle from the positive x semi-axis, counterclockwise); modulus
 * or angle from the components in the first quadrant; the angle from the components in the other quadrants (the
 * calculator's angle corrected); the modulus of the sum of two vectors by components. Results are rounded to the
 * significant figures of the moduli (angles to the degree), as the lesson "Le cifre significative" teaches; a value
 * too close to a rounding boundary is never used. Distractors are the lesson's mistakes: sine and cosine swapped,
 * the calculator in radians, the sign forgotten, the calculator's angle taken as it is, the moduli added. The scene
 * draws the data (the vector with its modulus and angle, or the components); what is asked goes in `solutionScene`.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { BANNED, DEG, choiceOf, decTex, modulus, pq, qOpt, qty, roundDeg, roundSig, scene, t, type SceneVec } from '../vettori';

export const ID = 'fis-seno-coseno';

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

const WHAT = [
	{ noun: 'Una forza', letter: 'F', unit: 'N', color: 'forza' as const },
	{ noun: 'Uno spostamento', letter: 's', unit: 'm', color: 'vettore' as const },
	{ noun: 'Una velocità', letter: 'v', unit: 'm/s', color: 'velocita' as const },
];
const L = 2.4; // centimetres, the drawn length of a vector given by modulus and angle
/** The axes around the points, reaching at least 1 cm past the origin on every side, for the arc and the names. */
const axesBox = (xs: number[], ys: number[]) => ({ x0: Math.min(-1.3, Math.min(...xs) - 0.6), x1: Math.max(1.3, Math.max(...xs) + 0.6), y0: Math.min(-1.3, Math.min(...ys) - 0.6), y1: Math.max(1.4, Math.max(...ys) + 0.6) });
/** A value for a label in the drawing: decimal comma and a true minus sign. */
const lab = (s: string) => s.replace('.', ',').replace('-', '−');

const opt = (s: string | null, unit: string) => (s === null ? [] : [qOpt(s, unit)]);
const degOpt = (s: string): ChoiceOption => ({ latex: `${decTex(s)}^\\circ`, values: [s] });
const cosT = (a: number) => Math.cos(a * DEG);
const sinT = (a: number) => Math.sin(a * DEG);
/** A datum as written in LaTeX: 4{,}5. */
const d = (s: string) => decTex(s);

/** The vector at `deg` from the x axis, drawn L long, with axes around it and, in the problem, its angle marked. */
function polarScene(alt: string, w: { letter: string; color: SceneVec['colore']; label: string }, deg: number, angle: { rif: 'x' | 'y'; text: string; ccw?: boolean } | null, extra: SceneVec[] = []): SceneRef {
	const tip: [number, number] = [L * cosT(deg), L * sinT(deg)];
	const xs = [0, tip[0], ...extra.flatMap((e) => [e.a[0], e.da[0]])], ys = [0, tip[1], ...extra.flatMap((e) => [e.a[1], e.da[1]])];
	const box = axesBox(xs, ys);
	return scene(alt, {
		u: 1,
		assi: box,
		vettori: [{ da: [0, 0], a: tip, nome: w.letter, colore: w.color, etichetta: w.label }, ...extra],
		angoli: angle ? [{ vettore: 0, rif: angle.rif, testo: angle.text, ...(angle.ccw ? { antiorario: true } : {}) }] : [],
	});
}

/** The dashed components of the vector at `deg`, labelled with their values, for the solution scene. */
function componentArrows(deg: number, color: SceneVec['colore'], lx: string, ly: string): SceneVec[] {
	const tip: [number, number] = [L * cosT(deg), L * sinT(deg)];
	return [
		{ da: [0, 0], a: [tip[0], 0], colore: color, tratteggiato: true, etichetta: lx },
		{ da: [0, 0], a: [0, tip[1]], colore: color, tratteggiato: true, etichetta: ly },
	];
}

// ---------------------------------------------------------------------------
// Levels 1-3: from the vector to a component

function component(rng: Rng, level: 1 | 2 | 3): Built {
	const w = rng.pick(WHAT);
	const n = rng.next() < 0.7 ? 2 : 3;
	const vS = modulus(rng, n as 2 | 3, n === 2 && rng.next() < 0.3);
	const v = Number(vS);
	let deg: number, given: number;
	if (level === 1) deg = given = rng.int(10, 80);
	else if (level === 2) {
		given = rng.int(10, 80); // from the y axis
		deg = 90 - given;
	} else {
		do deg = rng.int(95, 355);
		while (deg % 90 === 0 || deg % 90 < 5 || deg % 90 > 85);
		given = deg;
	}
	const askX = rng.next() < 0.5;
	const exact = askX ? v * cosT(deg) : v * sinT(deg);
	const right = roundSig(exact, n);
	if (right === null || Math.abs(v * cosT(deg)) < 0.2 * v || Math.abs(v * sinT(deg)) < 0.2 * v) throw new Error('resample');
	const cx = roundSig(v * cosT(deg), n), cy = roundSig(v * sinT(deg), n);
	if (cx === null || cy === null) throw new Error('resample');
	const comp = `${w.letter}_${askX ? 'x' : 'y'}`;
	const unit = w.unit;
	// The mistakes.
	const swapped = askX ? v * sinT(deg) : v * cosT(deg); // sine and cosine swapped (level 2: the angle taken from x)
	const radians = askX ? v * Math.cos(given) : v * Math.sin(given); // the calculator in radians
	const divided = askX ? v / cosT(given) : v / sinT(given);
	const mistakes: ChoiceOption[] = [...opt(roundSig(swapped, n), unit)];
	if (level === 3) mistakes.push(...opt(roundSig(-exact, n), unit)); // the sign forgotten, or put the wrong way
	mistakes.push(...opt(roundSig(radians, n), unit));
	if (level !== 3) mistakes.push(...opt(roundSig(divided, n), unit));
	if (level === 3) mistakes.push(...opt(roundSig(-swapped, n), unit));
	const answer = choiceOf(rng, qOpt(right, unit), mistakes, [...opt(roundSig(exact * 1.1, n), unit), ...opt(roundSig(exact * 0.9, n), unit)]);
	const ref = level === 2 ? "con l'asse $y$" : level === 1 ? "con l'asse $x$" : "con il semiasse positivo delle $x$, misurato in senso antiorario";
	const where = level === 2 ? ', verso destra e verso l’alto' : '';
	const problem = textBlock(`${w.noun} di ${pq(vS, unit)} forma un angolo di $${given}^\\circ$ ${ref}${where.replace('’', "'")}. Quanto vale la componente $${comp}$?`);
	const fn = askX ? '\\cos' : '\\sin';
	const steps: string[] = [];
	if (level === 2) {
		steps.push(t(`L'angolo di ${given}° ha per lato l'asse y: con l'asse x il vettore forma ${90 - given}°.`));
		steps.push(t(askX ? 'La componente x è opposta all’angolo dato: si usa il seno di quell’angolo.'.replace(/’/g, "'") : 'La componente y è adiacente all’angolo dato: si usa il coseno di quell’angolo.'.replace(/’/g, "'")));
		steps.push(`${comp} = ${d(vS)} \\cdot ${askX ? '\\sin' : '\\cos'} ${given}^\\circ = ${decTex(exact.toFixed(n + 1))}\\ldots \\approx ${qty(right, unit)}`);
	} else {
		steps.push(t(askX ? 'La componente x è il modulo per il coseno dell’angolo con l’asse x:'.replace(/’/g, "'") : 'La componente y è il modulo per il seno dell’angolo con l’asse x:'.replace(/’/g, "'")));
		steps.push(`${comp} = ${d(vS)} \\cdot ${fn} ${deg}^\\circ = ${decTex(exact.toFixed(n + 1))}\\ldots \\approx ${qty(right, unit)}`);
		if (level === 3) steps.push(t(`Il vettore sta nel ${['', 'secondo', 'terzo', 'quarto'][Math.floor(deg / 90)]} quadrante: la componente è ${exact > 0 ? 'positiva' : 'negativa'}.`));
	}
	steps.push(t(`Il modulo ha ${n} cifre significative, e così il risultato.`));
	const alt = `Negli assi cartesiani il vettore ${w.letter}, di ${vS.replace('.', ',')} ${unit}, forma un angolo di ${given} gradi ${level === 2 ? "con l'asse y" : level === 1 ? "con l'asse x" : 'con il semiasse positivo delle x, in senso antiorario'}.`;
	const label = `${vS.replace('.', ',')} ${unit}`;
	const angle = level === 2 ? { rif: 'y' as const, text: `${given}°` } : { rif: 'x' as const, text: `${given}°`, ccw: level === 3 };
	return {
		prompt: 'Trova la componente.',
		problem,
		solution: `${comp} \\approx ${qty(right, unit)}`,
		steps,
		answer,
		params: { case: level === 3 ? `quadrante ${Math.floor(deg / 90) + 1}` : askX ? 'x' : 'y', v: vS, deg, given, ask: askX ? 'x' : 'y', unit },
		scene: polarScene(alt, { letter: w.letter, color: w.color, label }, deg, angle),
		solutionScene: polarScene(`${alt} Tratteggiate le componenti, ${cx.replace('.', ',')} e ${cy.replace('.', ',')} ${unit}.`, { letter: w.letter, color: w.color, label }, deg, null, componentArrows(deg, w.color, `${lab(cx)} ${unit}`, `${lab(cy)} ${unit}`)),
	};
}

// ---------------------------------------------------------------------------
// Levels 4-5: from the components to the vector

function datum(rng: Rng): string {
	return rng.next() < 0.5 ? modulus(rng, 2, true) : modulus(rng, 2);
}

function fromComponents(rng: Rng, level: 4 | 5): Built {
	const w = rng.pick(WHAT);
	const unit = w.unit;
	let xS: string, yS: string;
	do {
		xS = datum(rng);
		yS = datum(rng);
	} while (xS === yS || Number(xS) / Number(yS) > 3 || Number(yS) / Number(xS) > 3);
	let sx = 1, sy = 1;
	if (level === 5) {
		const q = rng.int(1, 3); // second, third, fourth quadrant
		sx = q === 3 ? 1 : -1;
		sy = q === 1 ? 1 : -1;
	}
	const x = sx * Number(xS), y = sy * Number(yS);
	const xT = (sx < 0 ? '-' : '') + xS, yT = (sy < 0 ? '-' : '') + yS;
	const mod = Math.hypot(x, y);
	let deg = (Math.atan2(y, x) * 180) / Math.PI;
	if (deg < 0) deg += 360;
	const raw = (Math.atan(y / x) * 180) / Math.PI; // what tan^-1 gives
	const askAngle = level === 5 || rng.next() < 0.5;
	const modS = roundSig(mod, 2), degS = roundDeg(deg);
	if (modS === null || degS === null) throw new Error('resample');
	const cx = `${w.letter}_x`, cy = `${w.letter}_y`;
	const vecTip: [number, number] = [x, y];
	const scaleCm = 2.4 / Math.max(Math.abs(x), Math.abs(y));
	const tipCm: [number, number] = [vecTip[0] * scaleCm, vecTip[1] * scaleCm];
	const comps: SceneVec[] = [
		{ da: [0, 0], a: [tipCm[0], 0], colore: w.color, tratteggiato: true, etichetta: `${lab(xT)} ${unit}` },
		{ da: [0, 0], a: [0, tipCm[1]], colore: w.color, tratteggiato: true, etichetta: `${lab(yT)} ${unit}` },
	];
	const box = axesBox([0, tipCm[0]], [0, tipCm[1]]);
	const alt = `Negli assi cartesiani le componenti tratteggiate del vettore ${w.letter}: ${xT.replace('.', ',')} ${unit} lungo x e ${yT.replace('.', ',')} ${unit} lungo y.`;
	const sc = scene(alt, { u: 1, assi: box, vettori: comps });
	const solSc = scene(`${alt} Il vettore ha modulo ${modS.replace('.', ',')} ${unit} e forma ${degS} gradi con il semiasse positivo delle x.`, {
		u: 1,
		assi: box,
		vettori: [{ da: [0, 0], a: tipCm, nome: w.letter, colore: w.color, etichetta: `${modS.replace('.', ',')} ${unit}` }, ...comps],
	});
	const problem = textBlock(`${w.noun} ha le componenti $${cx} = ${qty(xT, unit)}$ e $${cy} = ${qty(yT, unit)}$. ${askAngle ? "Quale angolo forma con il semiasse positivo delle $x$, misurato in senso antiorario?" : 'Quanto vale il suo modulo?'}`);
	const modSteps = [t('Il modulo è l’ipotenusa del triangolo rettangolo che ha per cateti le componenti:'.replace('’', "'")), `${w.letter} = \\sqrt{${par(xT)}^2 + ${par(yT)}^2} = ${decTex(mod.toFixed(3))}\\ldots \\approx ${qty(modS, unit)}`];
	if (!askAngle) {
		const sumS = roundSig(Math.abs(x) + Math.abs(y), 2), diffS = roundSig(Math.abs(Math.abs(x) - Math.abs(y)), 2);
		const answer = choiceOf(rng, qOpt(modS, unit), [...opt(sumS, unit), ...opt(diffS, unit), ...opt(roundSig(Math.sqrt(Math.abs(x) + Math.abs(y)), 2), unit)], [...opt(roundSig(mod * 1.1, 2), unit), ...opt(roundSig(mod * 0.9, 2), unit)]);
		return {
			prompt: 'Trova il modulo.',
			problem,
			solution: `${w.letter} \\approx ${qty(modS, unit)}`,
			steps: [...modSteps, t('Le componenti hanno due cifre significative, e così il risultato.')],
			answer,
			params: { case: 'modulo', x: xT, y: yT, unit },
			scene: sc,
			solutionScene: solSc,
		};
	}
	const quadrant = x > 0 && y > 0 ? 1 : x < 0 && y > 0 ? 2 : x < 0 ? 3 : 4;
	const rawS = roundDeg(raw);
	const mistakes: ChoiceOption[] = [];
	if (level === 4) {
		mistakes.push(degOpt(String(90 - Number(degS)))); // the angle with the y axis
		const r = Math.abs(y) / Math.abs(x);
		if (r < 1) mistakes.push(degOpt(roundDeg((Math.asin(r) * 180) / Math.PI)!)); // sin^-1 of the ratio
		if (r < 1) mistakes.push(degOpt(roundDeg((Math.acos(r) * 180) / Math.PI)!));
		if (r > 1) mistakes.push(degOpt(roundDeg((Math.asin(1 / r) * 180) / Math.PI)!));
	} else {
		if (rawS !== null) mistakes.push(degOpt(rawS)); // the calculator's angle as it is
		// The wrong correction: 180° in the fourth quadrant, 360° in the second.
		if (rawS !== null && quadrant !== 3) mistakes.push(degOpt(String(Number(rawS) + (quadrant === 4 ? 180 : 360))));
		mistakes.push(degOpt(String(180 - Number(degS) > 0 ? 180 - Number(degS) : 540 - Number(degS)))); // mirrored
		mistakes.push(degOpt(String((Number(degS) + 180) % 360))); // the opposite vector
	}
	const answer = choiceOf(rng, degOpt(degS), mistakes.filter((o) => o.values[0] !== degS), [degOpt(String(Number(degS) + 5)), degOpt(String(Number(degS) - 5)), degOpt(String(Number(degS) + 10))]);
	const steps = [t('La tangente dell’angolo è il rapporto tra le componenti:'.replace('’', "'")), `\\tan^{-1}\\frac{${d(yT)}}{${d(xT)}} = ${decTex(raw.toFixed(2))}\\ldots^\\circ`];
	if (level === 5) {
		steps.push(t(`Il vettore sta nel ${['', 'primo', 'secondo', 'terzo', 'quarto'][quadrant]} quadrante: ${quadrant === 4 ? 'si aggiunge 360°' : 'si aggiunge 180°'}.`));
		steps.push(`${decTex(raw.toFixed(2))}^\\circ + ${quadrant === 4 ? 360 : 180}^\\circ = ${decTex(deg.toFixed(2))}\\ldots^\\circ \\approx ${degS}^\\circ`);
	} else steps.push(t(`L'angolo arrotondato al grado è ${degS}°.`));
	return {
		prompt: "Trova l'angolo.",
		problem,
		solution: `\\alpha \\approx ${degS}^\\circ`,
		steps,
		answer,
		params: { case: level === 5 ? `quadrante ${quadrant}` : 'angolo', x: xT, y: yT, unit },
		scene: sc,
		solutionScene: solSc,
	};
}

const par = (s: string) => (s.startsWith('-') ? `(${decTex(s)})` : decTex(s));

// ---------------------------------------------------------------------------
// Level 6: the sum by components

function level6(rng: Rng): Built {
	const w = rng.pick(WHAT);
	const unit = w.unit;
	let aS: string, bS: string;
	do {
		aS = modulus(rng, 2);
		bS = modulus(rng, 2);
	} while (Number(aS) > 2 * Number(bS) || Number(bS) > 2 * Number(aS));
	const a = Number(aS), b = Number(bS);
	const t1 = rng.next() < 0.4 ? 0 : rng.int(1, 17) * 5;
	let t2: number;
	do t2 = rng.int(2, 34) * 5;
	while (Math.abs(t2 - t1) < 30 || Math.abs(t2 - t1) > 120 || Math.abs(t2 - t1) === 90);
	const ax = a * cosT(t1), ay = a * sinT(t1), bx = b * cosT(t2), by = b * sinT(t2);
	const Rx = ax + bx, Ry = ay + by;
	const R = Math.hypot(Rx, Ry);
	const RS = roundSig(R, 2);
	if (RS === null || R < 5) throw new Error('resample');
	// The same result from components rounded to three figures, as a student would keep them.
	const r3 = (x: number) => (Math.abs(x) < 1e-9 ? 0 : Number(roundSig(x, 3) ?? NaN));
	const R3 = Math.hypot(r3(ax) + r3(bx), r3(ay) + r3(by));
	if (roundSig(R3, 2) !== RS) throw new Error('resample');
	const answer = choiceOf(
		rng,
		qOpt(RS, unit),
		[...opt(roundSig(a + b, 2), unit), ...opt(roundSig(Math.abs(a - b), 2), unit), ...opt(roundSig(Math.hypot(a, b), 2), unit), ...opt(roundSig(Math.abs(Rx) + Math.abs(Ry), 2), unit)],
		[...opt(roundSig(R * 1.1, 2), unit), ...opt(roundSig(R * 0.9, 2), unit)],
	);
	const k = 2.4 / Math.max(a, b);
	const tipA: [number, number] = [ax * k, ay * k], tipB: [number, number] = [bx * k, by * k];
	const vecs: SceneVec[] = [
		{ da: [0, 0], a: tipA, nome: w.letter, sub: '1', colore: w.color, etichetta: `${aS} ${unit}` },
		{ da: [0, 0], a: tipB, nome: w.letter, sub: '2', colore: w.color, etichetta: `${bS} ${unit}` },
	];
	const pts = [[0, 0], tipA, tipB, [tipA[0] + tipB[0], tipA[1] + tipB[1]]];
	const box = axesBox(pts.map((p) => p[0]), pts.map((p) => p[1]));
	const angoli = [
		...(t1 === 0 ? [] : [{ vettore: 0, rif: 'x' as const, testo: `${t1}°`, antiorario: true }]),
		{ vettore: 1, rif: 'x' as const, testo: `${t2}°`, antiorario: true },
	];
	const V1 = `\\vec{${w.letter}}_1`, V2 = `\\vec{${w.letter}}_2`;
	const dir1 = t1 === 0 ? "lungo l'asse $x$" : `a $${t1}^\\circ$ dall'asse $x$`;
	const alt = `Negli assi cartesiani due vettori che partono dall'origine: ${w.letter}1 di ${aS} ${unit} ${t1 === 0 ? "lungo l'asse x" : `a ${t1} gradi dall'asse x`}, ${w.letter}2 di ${bS} ${unit} a ${t2} gradi dall'asse x.`;
	const f3 = (x: number) => decTex((Math.abs(x) < 5e-4 ? 0 : x).toFixed(2));
	return {
		prompt: 'Trova il modulo della risultante.',
		problem: textBlock(`Due vettori partono dall'origine: $${V1}$ di ${pq(aS, unit)} ${dir1} e $${V2}$ di ${pq(bS, unit)} a $${t2}^\\circ$ dall'asse $x$, in senso antiorario. Quanto vale il modulo della loro somma $\\vec{R}$?`),
		solution: `R \\approx ${qty(RS, unit)}`,
		steps: [
			t('Le componenti dei due vettori:'),
			`${w.letter}_{1x} = ${d(aS)} \\cdot \\cos ${t1}^\\circ = ${f3(ax)} \\qquad ${w.letter}_{1y} = ${d(aS)} \\cdot \\sin ${t1}^\\circ = ${f3(ay)}`,
			`${w.letter}_{2x} = ${d(bS)} \\cdot \\cos ${t2}^\\circ = ${f3(bx)} \\qquad ${w.letter}_{2y} = ${d(bS)} \\cdot \\sin ${t2}^\\circ = ${f3(by)}`,
			t('Le componenti della risultante sono le somme:'),
			`R_x = ${f3(Rx)} \\qquad R_y = ${f3(Ry)}`,
			`R = \\sqrt{R_x^2 + R_y^2} = ${decTex(R.toFixed(3))}\\ldots \\approx ${qty(RS, unit)}`,
		],
		answer,
		params: { case: t1 === 0 ? 'uno sull’asse'.replace('’', "'") : 'due inclinati', a: aS, b: bS, t1, t2, unit },
		scene: scene(alt, { u: 1, assi: box, vettori: vecs, angoli }),
		solutionScene: scene(`${alt} La risultante R ha modulo ${RS.replace('.', ',')} ${unit}.`, {
			u: 1,
			assi: box,
			// The angles are in the text; here the arcs would cross the resultant.
			vettori: [...vecs, { da: [0, 0], a: [tipA[0] + tipB[0], tipA[1] + tipB[1]], nome: 'R', colore: 'risultante', etichetta: `${RS.replace('.', ',')} ${unit}` }],
		}),
	};
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = {
	1: (rng) => component(rng, 1),
	2: (rng) => component(rng, 2),
	3: (rng) => component(rng, 3),
	4: (rng) => fromComponents(rng, 4),
	5: (rng) => fromComponents(rng, 5),
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
	if (new Set(a.options.map((o) => Number(o.values[0].split(' ')[0]))).size !== 4) v.push('due opzioni con lo stesso numero');
	if (!sample.scene || !sample.solutionScene) v.push('manca la scena');
	return v;
}

export const fisSenoCoseno: Generator = {
	id: ID,
	title: 'Seno e coseno per scomporre un vettore',
	levels: {
		1: { label: "Le componenti con l'angolo dall'asse x", constraints: ['primo quadrante, angolo da 10° a 80°', 'risultato con le cifre significative del modulo'] },
		2: { label: "L'angolo dall'asse y", constraints: ["angolo con l'asse y da 10° a 80°", 'seno e coseno si scambiano'] },
		3: { label: 'I segni nei quattro quadranti', constraints: ['angolo da 95° a 355° dal semiasse positivo delle x', 'componente con il segno'] },
		4: { label: 'Dalle componenti al vettore', constraints: ['componenti positive con due cifre significative', "modulo, o angolo arrotondato al grado"] },
		5: { label: "L'angolo negli altri quadranti", constraints: ['secondo, terzo o quarto quadrante', "l'angolo della calcolatrice corretto"] },
		6: { label: 'La somma per componenti', constraints: ['due vettori con modulo e angolo', 'modulo della risultante con due cifre significative'] },
	},
	generate,
	check,
};

export default fisSenoCoseno;
