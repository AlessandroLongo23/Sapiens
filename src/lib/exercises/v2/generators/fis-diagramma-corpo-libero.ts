/**
 * Il diagramma delle forze. Spec: specs/exercises/fis-diagramma-corpo-libero.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/53-fis-diagramma-corpo-libero.md), each one step harder:
 * how many forces act on a body; the acceleration of a crate pulled by a slanted rope on a smooth floor (only the
 * horizontal component counts); the floor's reaction when the rope lifts or the handle pushes down (F_v = P ∓ F sin α);
 * the same crate with kinetic friction (the friction with that reaction); what a bathroom scale reads in an
 * accelerating lift; the lift's acceleration from what the scale reads. g = 9,8 m/s², data with two significant
 * figures, answers with two significant figures, never too close to a rounding boundary. Distractors from the lesson's
 * warnings: a "force of motion", the reaction taken equal to the weight, sine for cosine, the direction of the motion
 * taken for the direction of the acceleration.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { decTex, pq, qOpt, qty, t } from '../vettori';
import { coeff, cosD, generateWith, numOpt, sinD, two, weight } from '../fisica-equilibrio';
import { type Built, G, acc, accOpt, aOpts, around, blockScene, checkBasic, choiceOf, f3, kgOpts, nOpts, pacc, pointScene, r2 } from '../fis-dinamica';

export const ID = 'fis-diagramma-corpo-libero';

const N = (s: string) => qty(s, 'N');
const KG = (s: string) => qty(s, 'kg');
/** An inclination far from 45°, where sine and cosine would give almost the same number: 20°-35° or 55°-65°. */
const slant = (rng: Rng) => (rng.next() < 0.5 ? rng.int(20, 35) : rng.int(55, 65));
const P_STEP = (m: string, P: string) => `P = m\\,g = ${KG(m)} \\cdot 9{,}8\\,\\text{m/s}^2 = ${N(P)}`;

// ---------------------------------------------------------------------------
// Level 1: how many forces

const COUNTS = [
	{ key: 'libro', body: 'un libro fermo su un tavolo', n: 2, forces: 'il peso e la reazione del tavolo' },
	{ key: 'lampada', body: 'una lampada appesa al soffitto con un filo', n: 2, forces: 'il peso e la tensione del filo' },
	{ key: 'disco', body: "un disco da hockey che scivola sul ghiaccio, se l'attrito si trascura", n: 2, forces: 'il peso e la reazione del ghiaccio; nessuna forza lo spinge avanti' },
	{ key: 'sasso', body: "un sasso in volo dopo il lancio, se la resistenza dell'aria si trascura", n: 1, forces: 'solo il peso: la mano non lo tocca più' },
	{ key: 'cassa-liscio', body: 'una cassa tirata con una fune orizzontale su un pavimento senza attrito', n: 3, forces: 'il peso, la reazione del pavimento e la tensione della fune' },
	{ key: 'cassa-attrito', body: "una cassa trascinata sul pavimento con una fune orizzontale, con l'attrito", n: 4, forces: "il peso, la reazione del pavimento, la tensione della fune e l'attrito" },
	{ key: 'quadro', body: 'un quadro appeso a un chiodo con due fili', n: 3, forces: 'il peso e le tensioni dei due fili' },
	{ key: 'piano', body: "una cassa ferma su un piano inclinato, trattenuta dall'attrito", n: 3, forces: "il peso, la reazione del piano e l'attrito statico" },
	{ key: 'mano', body: "un libro fermo su un tavolo, premuto dall'alto da una mano", n: 3, forces: 'il peso, la spinta della mano e la reazione del tavolo' },
	{ key: 'ascensore', body: 'una persona in un ascensore che sale a velocità costante', n: 2, forces: 'il peso e la reazione del pavimento' },
];

function level1(rng: Rng): Built {
	const c = rng.pick(COUNTS);
	const start = rng.int(Math.max(1, c.n - 3), Math.min(c.n, 2));
	const options: ChoiceOption[] = [0, 1, 2, 3].map((i) => numOpt(String(start + i)));
	return {
		prompt: 'Conta le forze.',
		problem: textBlock(`Quante forze agiscono su ${c.body}?`),
		solution: `${c.n}`,
		steps: [textBlock(`Le forze sono ${c.n === 1 ? 'una' : c.n}: ${c.forces}.`)],
		answer: { kind: 'choice', options, correct: c.n - start },
		params: { case: c.key },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the slanted rope, no friction

function level2(rng: Rng): Built {
	for (;;) {
		const m = two(rng, true);
		const P = Number(weight(m));
		const F = two(rng, false);
		const a = slant(rng);
		if (Number(F) * sinD(a) >= 0.8 * P) continue;
		const Fx = Number(F) * cosD(a);
		const exact = Fx / Number(m);
		const ans = r2(exact);
		if (ans === null) continue;
		return {
			prompt: "Trova l'accelerazione.",
			problem: textBlock(`Una cassa di ${pq(m, 'kg')} su un pavimento liscio, senza attrito, è tirata con una fune inclinata di $${a}^\\circ$ sull'orizzontale, con una forza di ${pq(F, 'N')}. Quanto vale l'accelerazione della cassa?`),
			solution: `a \\approx ${acc(ans)}`,
			steps: [
				t("Asse x orizzontale nel verso del moto: in orizzontale agisce solo la componente della forza della fune."),
				`F_x = F\\cos\\alpha = ${N(F)} \\cdot \\cos ${a}^\\circ = ${f3(Fx)}\\ldots\\,\\text{N}`,
				`a = \\dfrac{F_x}{m} = \\dfrac{${f3(Fx)}\\,\\text{N}}{${KG(m)}} = ${f3(exact)}\\ldots\\,\\text{m/s}^2 \\approx ${acc(ans)}`,
			],
			// the whole force; sine for cosine; divided by the cosine
			answer: choiceOf(rng, accOpt(ans), aOpts([r2(Number(F) / Number(m)), r2((Number(F) * sinD(a)) / Number(m)), r2(Number(F) / cosD(a) / Number(m))]), aOpts(around(exact))),
			params: { case: 'fune', m, F, angle: a },
			scene: blockScene(`Una cassa tirata da una forza di ${F} newton inclinata di ${a} gradi sopra l'orizzontale.`, [{ nome: 'F', modulo: Number(F), angolo: a }]),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the floor's reaction

function level3(rng: Rng): Built {
	const pull = rng.next() < 0.5;
	for (;;) {
		const m = two(rng, true);
		const P = weight(m), Pn = Number(P);
		const F = two(rng, rng.next() < 0.5);
		const a = slant(rng);
		const Fy = Number(F) * sinD(a);
		if (Fy < 0.15 * Pn || (pull && Fy > 0.8 * Pn)) continue;
		const exact = pull ? Pn - Fy : Pn + Fy;
		const ans = r2(exact);
		if (ans === null) continue;
		const problem = pull
			? `Una cassa di ${pq(m, 'kg')} è tirata sul pavimento con una fune inclinata di $${a}^\\circ$ sopra l'orizzontale, con una forza di ${pq(F, 'N')}. Quanto vale la reazione del pavimento?`
			: `Un carrello di ${pq(m, 'kg')} è spinto sul pavimento con un manico inclinato di $${a}^\\circ$ sotto l'orizzontale, con una forza di ${pq(F, 'N')}. Quanto vale la reazione del pavimento?`;
		return {
			prompt: 'Trova la reazione del pavimento.',
			problem: textBlock(problem),
			solution: `F_v \\approx ${N(ans)}`,
			steps: [
				P_STEP(m, P),
				`F_y = F\\sin\\alpha = ${N(F)} \\cdot \\sin ${a}^\\circ = ${f3(Fy)}\\ldots\\,\\text{N} ${pull ? "\\ \\text{verso l'alto}" : '\\ \\text{verso il basso}'}`,
				t('In verticale il corpo non si muove: la somma delle componenti verticali è zero.'),
				pull ? `F_v = P - F_y = ${f3(exact)}\\ldots\\,\\text{N} \\approx ${N(ans)}` : `F_v = P + F_y = ${f3(exact)}\\ldots\\,\\text{N} \\approx ${N(ans)}`,
			],
			// the reaction equal to the weight; the other sign; the cosine for the sine
			answer: choiceOf(rng, qOpt(ans, 'N'), nOpts([r2(Pn), r2(pull ? Pn + Fy : Pn - Fy), r2(pull ? Pn - Number(F) * cosD(a) : Pn + Number(F) * cosD(a))]), nOpts(around(exact))),
			params: { case: pull ? 'tira' : 'spinge', m, F, angle: a },
			// A push down would cross the floor of blocco-forze: the carrello is drawn as a point.
			scene: pull
				? blockScene(`Una cassa tirata da una forza di ${F.replace('.', ',')} newton inclinata di ${a} gradi sopra l'orizzontale.`, [{ nome: 'F', modulo: Number(F), angolo: a }])
				: pointScene(`Il carrello, come un punto, spinto da una forza di ${F.replace('.', ',')} newton inclinata di ${a} gradi sotto l'orizzontale.`, [{ nome: 'F', modulo: Number(F), angolo: -a }]),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the slanted rope with friction

function level4(rng: Rng): Built {
	for (;;) {
		const m = two(rng, true);
		const P = weight(m), Pn = Number(P);
		const F = two(rng, false);
		const a = rng.int(20, 35);
		const mu = coeff(rng, 10, 50);
		const Fx = Number(F) * cosD(a), Fy = Number(F) * sinD(a);
		if (Fy > 0.8 * Pn) continue;
		const Fv = Pn - Fy, Fd = Number(mu) * Fv;
		if (Fx - Fd < 0.25 * Fx) continue;
		const exact = (Fx - Fd) / Number(m);
		const ans = r2(exact);
		if (ans === null) continue;
		return {
			prompt: "Trova l'accelerazione.",
			problem: textBlock(`Una cassa di ${pq(m, 'kg')} è tirata sul pavimento con una fune inclinata di $${a}^\\circ$ sopra l'orizzontale, con una forza di ${pq(F, 'N')}; il coefficiente di attrito dinamico è $\\mu_d = ${decTex(mu)}$. Quanto vale l'accelerazione della cassa?`),
			solution: `a \\approx ${acc(ans)}`,
			steps: [
				P_STEP(m, P),
				`F_x = F\\cos\\alpha = ${f3(Fx)}\\ldots\\,\\text{N} \\qquad F_y = F\\sin\\alpha = ${f3(Fy)}\\ldots\\,\\text{N}`,
				`${t('Lungo y: ')} F_v = P - F_y = ${f3(Fv)}\\ldots\\,\\text{N} \\qquad F_d = \\mu_d\\,F_v = ${f3(Fd)}\\ldots\\,\\text{N}`,
				`${t('Lungo x: ')} a = \\dfrac{F_x - F_d}{m} = ${f3(exact)}\\ldots\\,\\text{m/s}^2 \\approx ${acc(ans)}`,
			],
			// the reaction equal to the weight; friction forgotten; the whole force along x
			answer: choiceOf(rng, accOpt(ans), aOpts([r2((Fx - Number(mu) * Pn) / Number(m)), r2(Fx / Number(m)), r2((Number(F) - Fd) / Number(m))]), aOpts(around(exact))),
			params: { case: 'attrito', m, F, angle: a, mu },
			scene: blockScene(`Una cassa tirata da una forza di ${F} newton inclinata di ${a} gradi sopra l'orizzontale.`, [{ nome: 'F', modulo: Number(F), angolo: a }]),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: what the scale reads

const PHASES = [
	{ key: 'parte-su', text: "parte verso l'alto", up: true },
	{ key: 'frena-su', text: 'sale e sta frenando', up: false },
	{ key: 'parte-giu', text: 'parte verso il basso', up: false },
	{ key: 'frena-giu', text: 'scende e sta frenando', up: true },
];

function person(rng: Rng): string {
	for (;;) {
		const m = two(rng, false);
		if (Number(m) >= 40) return m;
	}
}

function level5(rng: Rng): Built {
	const ph = rng.pick(PHASES);
	for (;;) {
		const m = person(rng);
		const a = two(rng, true);
		if (Number(a) > 3.9) continue;
		const s = ph.up ? 1 : -1;
		const exact = (Number(m) * (G + s * Number(a))) / G;
		const ans = r2(exact);
		if (ans === null) continue;
		return {
			prompt: 'Trova quanto segna la bilancia.',
			problem: textBlock(`Una persona di ${pq(m, 'kg')} sta su una bilancia pesapersone in un ascensore che ${ph.text}, con un'accelerazione di ${pacc(a)}. Quanto segna la bilancia?`),
			solution: `${ans}\\,\\text{kg}`,
			steps: [
				`${t(`L'accelerazione è verso ${ph.up ? "l'alto" : 'il basso'}; con l'asse y verso l'alto: `)} a = ${ph.up ? '+' : '-'}${acc(a)}`,
				`F_v - P = m\\,a \\quad\\Rightarrow\\quad F_v = m\\,(g ${ph.up ? '+' : '-'} ${decTex(a)}\\,\\text{m/s}^2) = ${f3(Number(m) * (G + s * Number(a)))}\\ldots\\,\\text{N}`,
				`${t('La bilancia segna ')} \\dfrac{F_v}{g} = ${f3(exact)}\\ldots\\,\\text{kg} \\approx ${KG(ans)}`,
			],
			// the mass; the other sign (the motion taken for the acceleration)
			answer: choiceOf(rng, qOpt(ans, 'kg'), kgOpts([r2(Number(m)), r2((Number(m) * (G - s * Number(a))) / G)]), kgOpts(around(exact))),
			params: { case: ph.key, m, a },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: the acceleration from the scale

function level6(rng: Rng): Built {
	const wantUp = rng.next() < 0.5;
	for (;;) {
		const m = person(rng);
		const r = two(rng, false);
		const d = Number(r) - Number(m);
		if (Math.abs(d) < 2 || Math.abs(d) > 20 || d > 0 !== wantUp) continue;
		const exact = (G * Math.abs(d)) / Number(m);
		const ans = r2(exact);
		const noG = r2(Math.abs(d) / Number(m));
		const total = r2((G * Number(r)) / Number(m));
		if (ans === null || noG === null || total === null) continue;
		const dir = d > 0 ? "verso l'alto" : 'verso il basso';
		const other = d > 0 ? 'verso il basso' : "verso l'alto";
		return {
			prompt: "Trova l'accelerazione dell'ascensore.",
			problem: textBlock(`Una persona di ${pq(m, 'kg')} sta su una bilancia pesapersone in un ascensore. Mentre l'ascensore si muove, la bilancia segna ${pq(r, 'kg')}. Quanto vale l'accelerazione dell'ascensore?`),
			solution: `a \\approx ${acc(ans)}\\ \\text{${dir}}`,
			steps: [
				`F_v = ${KG(r)} \\cdot 9{,}8\\,\\text{m/s}^2 = ${f3(Number(r) * G)}\\,\\text{N} \\qquad P = ${KG(m)} \\cdot 9{,}8\\,\\text{m/s}^2 = ${f3(Number(m) * G)}\\,\\text{N}`,
				`a = \\dfrac{F_v - P}{m} = ${d > 0 ? '' : '-'}${f3(exact)}\\ldots\\,\\text{m/s}^2`,
				t(d > 0 ? "La bilancia segna più della massa: l'accelerazione è verso l'alto." : "La bilancia segna meno della massa: l'accelerazione è verso il basso."),
			],
			// the opposite direction; g forgotten; the scale's whole force divided by the mass
			answer: choiceOf(rng, accOpt(ans, dir), [accOpt(ans, other), accOpt(noG, dir), accOpt(total, dir)]),
			params: { case: d > 0 ? 'su' : 'giu', m, r },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = checkBasic(sample);
	if ([2, 3, 4].includes(sample.level) && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisDiagrammaCorpoLibero: Generator = {
	id: ID,
	title: 'Il diagramma delle forze',
	levels: {
		1: { label: 'Quante forze', constraints: ['dieci situazioni della lezione'] },
		2: { label: 'La fune inclinata', constraints: ['pavimento liscio', 'inclinazione da 20° a 35° o da 55° a 65°'] },
		3: { label: 'La reazione del pavimento', constraints: ['fune che solleva o manico che spinge in giù'] },
		4: { label: "La fune inclinata con l'attrito", constraints: ['inclinazione da 20° a 35°', 'la reazione è P − F sin α'] },
		5: { label: 'Quanto segna la bilancia', constraints: ['ascensore che parte o frena, in salita o in discesa'] },
		6: { label: "L'accelerazione dell'ascensore", constraints: ['modulo e verso dalla lettura della bilancia'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisDiagrammaCorpoLibero;
