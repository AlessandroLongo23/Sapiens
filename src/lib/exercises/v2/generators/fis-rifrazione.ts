/**
 * La rifrazione e la riflessione totale. Spec: specs/exercises/fis-rifrazione.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/34-fis-rifrazione.md): the index and the speed of light
 * (n = c/v); the angle of refraction from air into a medium; the index from the two angles; the angle of refraction
 * from a more refracting medium, sometimes with the angle given from the surface; the critical angle; whether the ray
 * gets out or is totally reflected. Angles are whole degrees, the results rounded to the degree (a value too close to
 * a half is never used); indices and speeds have three significant figures, like the lesson. The distractors are the
 * lesson's mistakes: the angle divided by the index instead of its sine, the ratio of the indices upside down, the
 * angle taken from the surface, v/c for c/v, total reflection towards the more refracting medium. The scene
 * (`raggio-due-mezzi`) draws the two media and the incident ray; the refracted or reflected ray goes in the solution.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { BANNED, choiceOf, decTex, roundDeg, roundSig, t } from '../vettori';

export const ID = 'fis-rifrazione';

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

/** A medium of the lesson's table: its index as written (two decimals) and the prepositions it takes. */
type Medium = { nome: string; n: string; da: string; a: string; il: string };
const ARIA: Medium = { nome: 'aria', n: '1.00', da: "dall'aria", a: "all'aria", il: "l'aria" };
const ACQUA: Medium = { nome: 'acqua', n: '1.33', da: "dall'acqua", a: "all'acqua", il: "l'acqua" };
const GHIACCIO: Medium = { nome: 'ghiaccio', n: '1.31', da: 'dal ghiaccio', a: 'al ghiaccio', il: 'il ghiaccio' };
const ALCOL: Medium = { nome: 'alcol etilico', n: '1.36', da: "dall'alcol etilico", a: "all'alcol etilico", il: "l'alcol etilico" };
const VETRO: Medium = { nome: 'vetro', n: '1.50', da: 'dal vetro', a: 'al vetro', il: 'il vetro' };
const DIAMANTE: Medium = { nome: 'diamante', n: '2.42', da: 'dal diamante', a: 'al diamante', il: 'il diamante' };
const DENSE = [ACQUA, GHIACCIO, ALCOL, VETRO, DIAMANTE];

/** A plastic with a drawn index from 1,40 to 1,70 (two decimals, no trailing zero). */
function plastic(rng: Rng): Medium {
	let k: number;
	do k = rng.int(140, 170);
	while (k % 10 === 0);
	const n = (k / 100).toFixed(2);
	return { nome: 'plastica', n, da: 'da una plastica', a: 'a una plastica', il: 'la plastica' };
}

const DEG = Math.PI / 180;
const sinD = (a: number) => Math.sin(a * DEG);
const asinD = (x: number) => Math.asin(x) / DEG;
const nTex = (s: string) => decTex(s);
/** "dal vetro ($n = 1{,}50$)". */
const withN = (phrase: string, m: Medium) => `${phrase} ($n = ${nTex(m.n)}$)`;
const deg = (x: string | number) => `${x}^\\circ`;
const degOpt = (s: string): ChoiceOption => ({ latex: deg(s), values: [s] });
const textOpt = (s: string, value: string): ChoiceOption => ({ latex: t(s), values: [value] });
const refrOpt = (s: string): ChoiceOption => ({ latex: `\\text{raggio rifratto a } ${deg(s)}`, values: [s] });
const TOTAL = textOpt('riflessione totale', 'totale');

/** A degree value for a distractor: whole degrees strictly between 0 and 90, or nothing. */
function dOpt(x: number | null): ChoiceOption[] {
	if (x === null || !Number.isFinite(x) || x <= 0.5 || x >= 89.5) return [];
	const r = roundDeg(x);
	return r === null ? [] : [degOpt(r)];
}
const safeAsin = (x: number) => (x > 0 && x < 1 ? asinD(x) : null);

/** The scene: the two media, the incident ray at theta1 and the arc of the given angle. */
function raySceneData(top: Medium, bottom: Medium, theta1: number, arc: { rif: 'normale' | 'superficie'; testo: string } | null, extra: Record<string, unknown> = {}) {
	return {
		sopra: { nome: top.nome, n: top.n.replace('.', ',') },
		sotto: { nome: bottom.nome, n: bottom.n.replace('.', ',') },
		incidente: theta1,
		...(arc ? { arco: arc } : {}),
		...extra,
	};
}
const scene = (alt: string, data: Record<string, unknown>): SceneRef => ({ type: 'raggio-due-mezzi', data, alt });
const medAlt = (m: Medium) => `${m.nome} con indice ${m.n.replace('.', ',')}`;

// ---------------------------------------------------------------------------
// Level 1: the index and the speed of light

function level1(rng: Rng): Built {
	if (rng.next() < 0.5) {
		// From n to v.
		const m = rng.next() < 0.5 ? rng.pick(DENSE) : plastic(rng);
		const n = Number(m.n);
		const v = 3.0 / n; // in 10^8 m/s
		const vS = roundSig(v, 3);
		if (vS === null) throw new Error('resample');
		const opt = (s: string | null, p = 8): ChoiceOption[] => (s === null ? [] : [{ latex: `${decTex(s)} \\cdot 10^${p}\\,\\text{m/s}`, values: [`${s}e${p}`] }]);
		const answer = choiceOf(rng, opt(vS)[0], [...opt(roundSig(3.0 * n, 3)), ...opt(vS, 7)], [...opt(roundSig(v * 1.1, 3)), ...opt(roundSig(v * 0.9, 3))]);
		const subject = m.nome === 'plastica' ? 'Una plastica trasparente ha' : `${m.il.charAt(0).toUpperCase()}${m.il.slice(1)} ha`;
		return {
			prompt: 'Trova la velocità della luce nel mezzo.',
			problem: textBlock(`${subject} indice di rifrazione $n = ${nTex(m.n)}$. A che velocità viaggia la luce al suo interno? Usa $c = 3{,}00 \\cdot 10^8\\,\\text{m/s}$.`),
			solution: `v \\approx ${decTex(vS)} \\cdot 10^8\\,\\text{m/s}`,
			steps: [t('Da n = c/v si ricava v = c/n:'), `v = \\frac{3{,}00 \\cdot 10^8\\,\\text{m/s}}{${nTex(m.n)}} = ${decTex(v.toFixed(4))}\\ldots \\cdot 10^8\\,\\text{m/s} \\approx ${decTex(vS)} \\cdot 10^8\\,\\text{m/s}`, t('La velocità è minore di c, come deve essere in un mezzo.')],
			answer,
			params: { case: 'velocita', n: m.n, medium: m.nome },
		};
	}
	// From v to n.
	let k: number;
	do k = rng.int(125, 230);
	while (k % 10 === 0);
	const vS = (k / 100).toFixed(2);
	const v = Number(vS);
	const n = 3.0 / v;
	const nS = roundSig(n, 3);
	if (nS === null) throw new Error('resample');
	const nOpt = (s: string | null): ChoiceOption[] => (s === null ? [] : [{ latex: `n = ${decTex(s)}`, values: [s] }]);
	const answer = choiceOf(rng, nOpt(nS)[0], [...nOpt(roundSig(v / 3.0, 3)), ...nOpt(roundSig(3.0 - v, 3))], [...nOpt(roundSig(n * 1.1, 3)), ...nOpt(roundSig(n * 0.9, 3))]);
	const where = rng.pick(['In un liquido trasparente', 'In un cristallo', 'In una plastica trasparente']);
	return {
		prompt: "Trova l'indice di rifrazione.",
		problem: textBlock(`${where} la luce viaggia a $${decTex(vS)} \\cdot 10^8\\,\\text{m/s}$. Quanto vale l'indice di rifrazione? Usa $c = 3{,}00 \\cdot 10^8\\,\\text{m/s}$.`),
		solution: `n \\approx ${decTex(nS)}`,
		steps: [t("L'indice è la velocità nel vuoto divisa per quella nel mezzo:"), `n = \\frac{c}{v} = \\frac{3{,}00 \\cdot 10^8}{${decTex(vS)} \\cdot 10^8} = ${decTex(n.toFixed(4))}\\ldots \\approx ${decTex(nS)}`, t("È un numero puro, maggiore di 1.")],
		answer,
		params: { case: 'indice', v: vS },
	};
}

// ---------------------------------------------------------------------------
// Levels 2 and 4: the angle of refraction

function refraction(rng: Rng, level: 2 | 4): Built {
	let top: Medium, bottom: Medium;
	if (level === 2) {
		top = ARIA;
		bottom = rng.next() < 0.75 ? rng.pick(DENSE) : plastic(rng);
	} else {
		const pairs: [Medium, Medium][] = [[ACQUA, ARIA], [GHIACCIO, ARIA], [ALCOL, ARIA], [VETRO, ARIA], [DIAMANTE, ARIA], [VETRO, ACQUA], [DIAMANTE, ACQUA], [DIAMANTE, VETRO]];
		[top, bottom] = rng.next() < 0.8 ? rng.pick(pairs) : [plastic(rng), ARIA];
	}
	const n1 = Number(top.n), n2 = Number(bottom.n);
	const crit = n1 > n2 ? asinD(n2 / n1) : 90;
	const theta1 = level === 2 ? rng.int(15, 80) : rng.int(10, Math.floor(crit) - 3);
	if (level === 4 && theta1 < 10) throw new Error('resample');
	const fromSurface = level === 4 && rng.next() < 0.35;
	const alpha = 90 - theta1; // the angle with the surface, when the text gives that
	const exact = asinD((n1 * sinD(theta1)) / n2);
	const right = roundDeg(exact);
	if (right === null) throw new Error('resample');
	const mistakes: ChoiceOption[] = [];
	if (fromSurface) mistakes.push(...dOpt(safeAsin((n1 * sinD(alpha)) / n2))); // the surface angle used as incidence
	mistakes.push(...dOpt((theta1 * n1) / n2)); // the angle divided by the index, not its sine
	mistakes.push(...dOpt(safeAsin((n2 * sinD(theta1)) / n1))); // the ratio of the indices upside down
	mistakes.push(...dOpt(90 - exact)); // the angle from the surface given as answer
	mistakes.push(...dOpt(theta1)); // no deviation
	const answer = choiceOf(rng, degOpt(right), mistakes.filter((o) => o.values[0] !== right), [...dOpt(exact + 4), ...dOpt(exact - 4), ...dOpt(exact + 8)]);
	const given = fromSurface ? `e forma un angolo di $${deg(alpha)}$ con la superficie di separazione. Quanto vale l'angolo di rifrazione, misurato dalla normale?` : `con un angolo di incidenza di $${deg(theta1)}$. Quanto vale l'angolo di rifrazione?`;
	const problem = textBlock(`Un raggio di luce passa ${withN(top.da, top)} ${withN(bottom.a, bottom)} ${given}`);
	const steps: string[] = [];
	if (fromSurface) steps.push(t(`Gli angoli si misurano dalla normale: l'angolo di incidenza è 90° - ${alpha}° = ${theta1}°.`));
	steps.push(t('Dalla legge di Snell si ricava il seno dell’angolo di rifrazione:'.replace('’', "'")));
	steps.push(`\\sin\\theta_2 = \\frac{n_1 \\sin\\theta_1}{n_2} = \\frac{${nTex(top.n)} \\cdot \\sin ${deg(theta1)}}{${nTex(bottom.n)}} = ${decTex(((n1 * sinD(theta1)) / n2).toFixed(4))}\\ldots`);
	steps.push(`\\theta_2 = \\sin^{-1} ${decTex(((n1 * sinD(theta1)) / n2).toFixed(4))} = ${decTex(exact.toFixed(2))}\\ldots^\\circ \\approx ${deg(right)}`);
	steps.push(t(n2 > n1 ? 'Il raggio entra in un mezzo più rifrangente e si avvicina alla normale.' : 'Il raggio entra in un mezzo meno rifrangente e si allontana dalla normale.'));
	const alt = `Due mezzi separati da una superficie orizzontale: sopra ${medAlt(top)}, sotto ${medAlt(bottom)}. Il raggio incidente arriva da sopra ${fromSurface ? `e forma ${alpha} gradi con la superficie` : `con un angolo di incidenza di ${theta1} gradi`}.`;
	const arc = fromSurface ? { rif: 'superficie' as const, testo: `${alpha}°` } : { rif: 'normale' as const, testo: `${theta1}°` };
	return {
		prompt: "Trova l'angolo di rifrazione.",
		problem,
		solution: `\\theta_2 \\approx ${deg(right)}`,
		steps,
		answer,
		params: { case: level === 2 ? (bottom.nome === 'plastica' ? 'plastica' : 'tabella') : fromSurface ? 'dalla superficie' : 'dalla normale', n1: top.n, n2: bottom.n, theta1, fromSurface },
		scene: scene(alt, raySceneData(top, bottom, theta1, arc)),
		solutionScene: scene(`${alt} Il raggio rifratto forma ${right} gradi con la normale.`, raySceneData(top, bottom, theta1, arc, { rifratto: { angolo: Math.round(exact * 100) / 100, testo: `${right}°` } })),
	};
}

// ---------------------------------------------------------------------------
// Level 3: the index from the two angles

function level3(rng: Rng): Built {
	const theta1 = rng.int(30, 80);
	const theta2 = rng.int(Math.max(10, Math.ceil(asinD(sinD(theta1) / 2.45))), Math.floor(asinD(sinD(theta1) / 1.25)));
	const n = sinD(theta1) / sinD(theta2);
	const nS = roundSig(n, 3);
	if (nS === null || theta2 >= theta1) throw new Error('resample');
	const nOpt = (x: number): ChoiceOption[] => {
		const s = roundSig(x, 3);
		return s === null || x <= 0 ? [] : [{ latex: `n = ${decTex(s)}`, values: [s] }];
	};
	const answer = choiceOf(
		rng,
		{ latex: `n = ${decTex(nS)}`, values: [nS] },
		[...nOpt(theta1 / theta2), ...nOpt(sinD(theta2) / sinD(theta1)), ...nOpt(Math.cos(theta2 * DEG) / Math.cos(theta1 * DEG))],
		[...nOpt(n * 1.1), ...nOpt(n * 0.9)],
	);
	const alt = `Un raggio passa dall'aria, sopra, a un materiale trasparente, sotto: l'angolo di incidenza è di ${theta1} gradi, l'angolo di rifrazione di ${theta2} gradi.`;
	const data = raySceneData(ARIA, { ...ARIA, nome: 'materiale', n: '?' }, theta1, { rif: 'normale', testo: `${theta1}°` }, { rifratto: { angolo: theta2, testo: `${theta2}°` } });
	return {
		prompt: "Trova l'indice di rifrazione.",
		problem: textBlock(`Un raggio di luce passa dall'aria ($n = 1{,}00$) a un materiale trasparente. L'angolo di incidenza è di $${deg(theta1)}$ e l'angolo di rifrazione è di $${deg(theta2)}$. Quanto vale l'indice di rifrazione del materiale?`),
		solution: `n \\approx ${decTex(nS)}`,
		steps: [t('Con n1 = 1,00 la legge di Snell dà:'), `n_2 = \\frac{\\sin\\theta_1}{\\sin\\theta_2} = \\frac{\\sin ${deg(theta1)}}{\\sin ${deg(theta2)}} = \\frac{${decTex(sinD(theta1).toFixed(4))}}{${decTex(sinD(theta2).toFixed(4))}} = ${decTex(n.toFixed(4))}\\ldots \\approx ${decTex(nS)}`, t('Si dividono i seni, non gli angoli.')],
		answer,
		params: { case: 'indice', theta1, theta2 },
		scene: scene(alt, data),
		solutionScene: scene(`${alt} L'indice del materiale è ${nS.replace('.', ',')}.`, { ...data, sotto: { nome: 'materiale', n: nS.replace('.', ',') } }),
	};
}

// ---------------------------------------------------------------------------
// Level 5: the critical angle

function level5(rng: Rng): Built {
	const pairs: [Medium, Medium][] = [[ACQUA, ARIA], [GHIACCIO, ARIA], [ALCOL, ARIA], [VETRO, ARIA], [DIAMANTE, ARIA], [VETRO, ACQUA], [DIAMANTE, ACQUA], [DIAMANTE, VETRO]];
	const [top, bottom] = rng.next() < 0.75 ? rng.pick(pairs) : [plastic(rng), ARIA];
	const n1 = Number(top.n), n2 = Number(bottom.n);
	const exact = asinD(n2 / n1);
	const right = roundDeg(exact);
	if (right === null) throw new Error('resample');
	const answer = choiceOf(
		rng,
		degOpt(right),
		[...dOpt(90 - exact), ...dOpt((n2 / n1) * 90), ...dOpt(Math.atan(n2 / n1) / DEG)].filter((o) => o.values[0] !== right),
		[...dOpt(exact + 5), ...dOpt(exact - 5), ...dOpt(exact + 10)],
	);
	const alt = `Due mezzi separati da una superficie orizzontale: sopra ${medAlt(top)}, sotto ${medAlt(bottom)}.`;
	const crit = Math.round(exact * 100) / 100;
	return {
		prompt: "Trova l'angolo limite.",
		problem: textBlock(`Qual è l'angolo limite per la luce che passa ${withN(top.da, top)} ${withN(bottom.a, bottom)}?`),
		solution: `\\theta_L \\approx ${deg(right)}`,
		steps: [t("L'angolo limite è l'angolo di incidenza per cui il raggio rifratto esce a 90°:"), `\\sin\\theta_L = \\frac{n_2}{n_1} = \\frac{${nTex(bottom.n)}}{${nTex(top.n)}} = ${decTex((n2 / n1).toFixed(4))}\\ldots`, `\\theta_L = ${decTex(exact.toFixed(2))}\\ldots^\\circ \\approx ${deg(right)}`],
		answer,
		params: { case: bottom === ARIA ? "verso l'aria" : 'tra due mezzi', n1: top.n, n2: bottom.n },
		solutionScene: scene(`${alt} Con un angolo di incidenza di ${right} gradi il raggio rifratto esce radente alla superficie.`, raySceneData(top, bottom, crit, { rif: 'normale', testo: `${right}°` }, { rifratto: { angolo: 90 } })),
	};
}

// ---------------------------------------------------------------------------
// Level 6: out, or totally reflected?

function level6(rng: Rng): Built {
	const r = rng.next();
	const kind = r < 0.4 ? 'totale' : r < 0.75 ? 'esce' : 'verso il più rifrangente';
	let top: Medium, bottom: Medium;
	const down: [Medium, Medium][] = [[ACQUA, ARIA], [VETRO, ARIA], [DIAMANTE, ARIA], [ALCOL, ARIA], [VETRO, ACQUA], [DIAMANTE, VETRO]];
	const up: [Medium, Medium][] = [[ARIA, ACQUA], [ARIA, VETRO], [ACQUA, VETRO], [ARIA, DIAMANTE], [ACQUA, DIAMANTE]];
	if (kind === 'verso il più rifrangente') [top, bottom] = rng.pick(up);
	else [top, bottom] = rng.pick(down);
	const n1 = Number(top.n), n2 = Number(bottom.n);
	const crit = n1 > n2 ? asinD(n2 / n1) : 90;
	let theta1: number;
	if (kind === 'totale') theta1 = rng.int(Math.ceil(crit) + 3, 85);
	else if (kind === 'esce') theta1 = rng.int(10, Math.floor(crit) - 3);
	else theta1 = rng.int(45, 85);
	if (theta1 < 10 || theta1 > 85) throw new Error('resample');
	const sin2 = (n1 * sinD(theta1)) / n2;
	const out = sin2 < 1 ? asinD(sin2) : null;
	const outS = out === null ? null : roundDeg(out);
	if (out !== null && outS === null) throw new Error('resample');
	const rOpt = (x: number | null): ChoiceOption[] => dOpt(x).map((o) => refrOpt(o.values[0]));
	const right = out === null ? TOTAL : refrOpt(outS!);
	const mistakes: ChoiceOption[] = [];
	if (out === null) {
		mistakes.push(...rOpt(safeAsin((n2 * sinD(theta1)) / n1)), ...rOpt((theta1 * n1) / n2), ...rOpt(theta1));
		mistakes.push(refrOpt('90'));
	} else {
		mistakes.push(TOTAL, ...rOpt(safeAsin((n2 * sinD(theta1)) / n1)), ...rOpt(theta1), ...rOpt(90 - out));
	}
	const answer = choiceOf(rng, right, mistakes.filter((o) => o.latex !== right.latex), [...rOpt((out ?? theta1) + 6), ...rOpt((out ?? theta1) - 6)]);
	const problem = textBlock(`Un raggio di luce va ${withN(top.da, top)} verso ${withN(bottom.il, bottom)} e arriva sulla superficie di separazione con un angolo di incidenza di $${deg(theta1)}$. Che cosa succede?`);
	const steps: string[] = [];
	if (n1 > n2) {
		steps.push(t('La luce va verso un mezzo meno rifrangente: c’è un angolo limite.'.replace('’', "'")));
		steps.push(`\\sin\\theta_L = \\frac{${nTex(bottom.n)}}{${nTex(top.n)}} = ${decTex((n2 / n1).toFixed(4))}\\ldots \\qquad \\theta_L \\approx ${decTex(crit.toFixed(1))}^\\circ`);
		if (out === null) {
			steps.push(t(`${theta1}° è più grande dell'angolo limite: il raggio rifratto non esiste.`));
			steps.push(`n_1 \\sin\\theta_1 / n_2 = ${decTex(sin2.toFixed(3))} > 1`);
			steps.push(t('Tutta la luce si riflette: è la riflessione totale.'));
		} else {
			steps.push(t(`${theta1}° è più piccolo dell'angolo limite: il raggio esce.`));
			steps.push(`\\sin\\theta_2 = \\frac{${nTex(top.n)} \\cdot \\sin ${deg(theta1)}}{${nTex(bottom.n)}} = ${decTex(sin2.toFixed(4))}\\ldots \\qquad \\theta_2 \\approx ${deg(outS!)}`);
		}
	} else {
		steps.push(t('La luce va verso un mezzo più rifrangente: la riflessione totale non può succedere.'));
		steps.push(`\\sin\\theta_2 = \\frac{${nTex(top.n)} \\cdot \\sin ${deg(theta1)}}{${nTex(bottom.n)}} = ${decTex(sin2.toFixed(4))}\\ldots \\qquad \\theta_2 \\approx ${deg(outS!)}`);
	}
	const alt = `Due mezzi separati da una superficie orizzontale: sopra ${medAlt(top)}, sotto ${medAlt(bottom)}. Il raggio incidente arriva da sopra con un angolo di incidenza di ${theta1} gradi.`;
	const arc = { rif: 'normale' as const, testo: `${theta1}°` };
	return {
		prompt: 'Scegli che cosa succede al raggio.',
		problem,
		solution: out === null ? '\\text{riflessione totale}' : `\\theta_2 \\approx ${deg(outS!)}`,
		steps,
		answer,
		params: { case: kind, n1: top.n, n2: bottom.n, theta1 },
		scene: scene(alt, raySceneData(top, bottom, theta1, arc)),
		solutionScene: scene(out === null ? `${alt} Il raggio si riflette tutto nel primo mezzo.` : `${alt} Il raggio rifratto forma ${outS} gradi con la normale.`, raySceneData(top, bottom, theta1, arc, out === null ? { riflesso: true } : { rifratto: { angolo: Math.round(out * 100) / 100, testo: `${outS}°` } })),
	};
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = {
	1: level1,
	2: (rng) => refraction(rng, 2),
	3: level3,
	4: (rng) => refraction(rng, 4),
	5: level5,
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
	if (sample.level !== 1 && !sample.solutionScene) v.push('manca la scena della soluzione');
	if (![1, 5].includes(sample.level) && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisRifrazione: Generator = {
	id: ID,
	title: 'La rifrazione e la riflessione totale',
	levels: {
		1: { label: "L'indice e la velocità della luce", constraints: ['n = c/v con tre cifre significative', 'c = 3,00 · 10^8 m/s'] },
		2: { label: "L'angolo di rifrazione", constraints: ["dall'aria a un mezzo più rifrangente", 'angolo di incidenza da 15° a 80°, risultato al grado'] },
		3: { label: "L'indice dagli angoli", constraints: ["dall'aria, con i due angoli interi", 'indice con tre cifre significative'] },
		4: { label: 'Verso un mezzo meno rifrangente', constraints: ["angolo di incidenza sotto l'angolo limite", "a volte l'angolo è dato dalla superficie"] },
		5: { label: "L'angolo limite", constraints: ['da un mezzo più rifrangente a uno meno rifrangente', 'risultato al grado'] },
		6: { label: 'Esce o si riflette tutto?', constraints: ['riflessione totale, raggio che esce, o luce verso il mezzo più rifrangente', 'scegli che cosa succede'] },
	},
	generate,
	check,
};

export default fisRifrazione;
