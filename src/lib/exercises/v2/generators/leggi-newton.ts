/**
 * Il secondo principio della dinamica. Spec: specs/exercises/leggi-newton.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/51-leggi-newton.md), each one step harder: the
 * acceleration from one force and the mass; the force or the mass from the other two; two opposite forces (the
 * acceleration has the direction of the larger); two perpendicular forces (Pythagoras first); the kinetic friction in
 * the total force; the force from how the velocity changes (v = v0 + a t, with km/h to convert and the result in
 * scientific notation). g = 9,8 m/s², data with two significant figures, answers with two significant figures, never
 * too close to a rounding boundary. Distractors from the lesson's warnings: the formula upside down, forces added as
 * numbers, the friction forgotten or added, the mass for the weight, km/h not converted.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { decTex, pq, qOpt, qty, t } from '../vettori';
import { coeff, generateWith, two, weight } from '../fisica-equilibrio';
import { type Built, G, acc, accOpt, aOpts, around, blockScene, checkBasic, choiceOf, f3, kgOpts, nOpts, pacc, pointScene, r2, sci2, sciOpt, sciOpts } from '../fis-dinamica';

export const ID = 'leggi-newton';

const N = (s: string) => qty(s, 'N');
const KG = (s: string) => qty(s, 'kg');

const CARTS = [
	{ name: 'Un carrello', lower: 'un carrello', e: 'o' },
	{ name: 'Una slitta', lower: 'una slitta', e: 'a' },
	{ name: 'Una cassa', lower: 'una cassa', e: 'a' },
];

// ---------------------------------------------------------------------------
// Level 1: the acceleration

function level1(rng: Rng): Built {
	for (;;) {
		const m = two(rng, true);
		const F = two(rng, rng.next() < 0.5);
		const exact = Number(F) / Number(m);
		const ans = r2(exact);
		if (ans === null) continue;
		const c = rng.pick(CARTS);
		return {
			prompt: "Trova l'accelerazione.",
			problem: textBlock(`${c.name} di ${pq(m, 'kg')} è tirat${c.e} su un piano orizzontale senza attrito da una forza orizzontale di ${pq(F, 'N')}. Quanto vale la sua accelerazione?`),
			solution: `a \\approx ${acc(ans)}`,
			steps: [t('Il peso e la reazione del piano si bilanciano: la forza totale è la forza orizzontale.'), `a = \\dfrac{F}{m} = \\dfrac{${N(F)}}{${KG(m)}} = ${f3(exact)}\\ldots\\,\\text{m/s}^2 \\approx ${acc(ans)}`],
			// force times mass; the formula upside down; divided by the weight
			answer: choiceOf(rng, accOpt(ans), aOpts([r2(Number(F) * Number(m)), r2(Number(m) / Number(F)), r2(Number(F) / Number(weight(m)))]), aOpts(around(exact))),
			params: { case: 'accelerazione', m, F },
			scene: blockScene(`${c.name} tirat${c.e} verso destra da una forza di ${F.replace('.', ',')} newton.`, [{ nome: 'F', modulo: Number(F), angolo: 0 }]),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the force or the mass

function level2(rng: Rng): Built {
	const askForce = rng.next() < 0.5;
	for (;;) {
		const c = rng.pick(CARTS);
		const a = two(rng, true);
		if (askForce) {
			const m = two(rng, true);
			const exact = Number(m) * Number(a);
			const ans = r2(exact);
			if (ans === null) continue;
			return {
				prompt: 'Trova la forza.',
				problem: textBlock(`Quale forza orizzontale serve per dare a ${c.lower} di ${pq(m, 'kg')}, su un piano senza attrito, un'accelerazione di ${pacc(a)}?`),
				solution: `F \\approx ${N(ans)}`,
				steps: [`F = m\\,a = ${KG(m)} \\cdot ${acc(a)} = ${f3(exact)}\\ldots\\,\\text{N} \\approx ${N(ans)}`],
				// the mass divided by the acceleration; the other way round; times g too
				answer: choiceOf(rng, qOpt(ans, 'N'), nOpts([r2(Number(m) / Number(a)), r2(Number(a) / Number(m)), r2(exact * G)]), nOpts(around(exact))),
				params: { case: 'forza', m, a },
			};
		}
		const F = two(rng, rng.next() < 0.5);
		const exact = Number(F) / Number(a);
		const ans = r2(exact);
		if (ans === null || exact < 0.5) continue;
		return {
			prompt: 'Trova la massa.',
			problem: textBlock(`${c.name}, tirat${c.e} su un piano orizzontale senza attrito da una forza orizzontale di ${pq(F, 'N')}, ha un'accelerazione di ${pacc(a)}. Quanto vale la sua massa?`),
			solution: `m \\approx ${KG(ans)}`,
			steps: [`F = m\\,a \\quad\\Rightarrow\\quad m = \\dfrac{F}{a} = \\dfrac{${N(F)}}{${acc(a)}} = ${f3(exact)}\\ldots\\,\\text{kg} \\approx ${KG(ans)}`],
			// force times acceleration; the ratio upside down; the force divided by g (the mass from a weight)
			answer: choiceOf(rng, qOpt(ans, 'kg'), kgOpts([r2(Number(F) * Number(a)), r2(Number(a) / Number(F)), r2(Number(F) / G)]), kgOpts(around(exact))),
			params: { case: 'massa', F, a },
			scene: blockScene(`${c.name} tirat${c.e} verso destra da una forza di ${F.replace('.', ',')} newton.`, [{ nome: 'F', modulo: Number(F), angolo: 0 }]),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: two opposite forces

function level3(rng: Rng): Built {
	for (;;) {
		const m = two(rng, true);
		const Fr = two(rng, false), Fl = two(rng, false);
		const r = Number(Fr), l = Number(Fl);
		if (Math.abs(r - l) < 5) continue;
		const exact = Math.abs(r - l) / Number(m);
		const ans = r2(exact);
		if (ans === null) continue;
		const dir = r > l ? 'verso destra' : 'verso sinistra';
		const other = r > l ? 'verso sinistra' : 'verso destra';
		const sum = r2((r + l) / Number(m));
		const big = r2(Math.max(r, l) / Number(m));
		if (sum === null || big === null) continue;
		return {
			prompt: "Trova l'accelerazione.",
			problem: textBlock(`Una cassa di ${pq(m, 'kg')} sta su una lastra di ghiaccio, dove l'attrito si trascura. È tirata verso destra con una forza di ${pq(Fr, 'N')} e verso sinistra con una forza di ${pq(Fl, 'N')}. Quanto vale la sua accelerazione?`),
			solution: `a \\approx ${acc(ans)}\\ \\text{${dir}}`,
			steps: [
				`${t(`La forza totale è ${dir}, di modulo`)} F_{tot} = ${N(String(Math.max(r, l)))} - ${N(String(Math.min(r, l)))} = ${N(String(Math.abs(r - l)))}`,
				`a = \\dfrac{F_{tot}}{m} = \\dfrac{${N(String(Math.abs(r - l)))}}{${KG(m)}} = ${f3(exact)}\\ldots\\,\\text{m/s}^2 \\approx ${acc(ans)}`,
				t("L'accelerazione ha il verso della forza totale, cioè della forza più grande."),
			],
			// the opposite direction; the forces added; the larger force alone
			answer: choiceOf(rng, accOpt(ans, dir), [accOpt(ans, other), accOpt(sum, dir), accOpt(big, dir)]),
			params: { case: r > l ? 'destra' : 'sinistra', m, Fr, Fl },
			scene: blockScene(`Una cassa tirata verso destra con ${Fr} newton e verso sinistra con ${Fl} newton.`, [
				{ nome: 'F', sub: '1', modulo: r, angolo: 0 },
				{ nome: 'F', sub: '2', modulo: l, angolo: 180 },
			]),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: two perpendicular forces

function level4(rng: Rng): Built {
	for (;;) {
		const m = two(rng, true);
		const F1 = two(rng, false), F2 = two(rng, false);
		const a1 = Number(F1), a2 = Number(F2);
		if (a1 === a2 || Math.min(a1, a2) < 0.4 * Math.max(a1, a2)) continue;
		const Ft = Math.hypot(a1, a2);
		const exact = Ft / Number(m);
		const ans = r2(exact);
		if (ans === null) continue;
		return {
			prompt: "Trova l'accelerazione.",
			problem: textBlock(`Una slitta di ${pq(m, 'kg')} sul ghiaccio, dove l'attrito si trascura, è tirata da due funi orizzontali perpendicolari tra loro, con forze di ${pq(F1, 'N')} e ${pq(F2, 'N')}. Quanto vale la sua accelerazione?`),
			solution: `a \\approx ${acc(ans)}`,
			steps: [
				`F_{tot} = \\sqrt{${F1}^2 + ${F2}^2}\\,\\text{N} = ${f3(Ft)}\\ldots\\,\\text{N}`,
				`a = \\dfrac{F_{tot}}{m} = \\dfrac{${f3(Ft)}\\,\\text{N}}{${KG(m)}} = ${f3(exact)}\\ldots\\,\\text{m/s}^2 \\approx ${acc(ans)}`,
			],
			// the moduli added; subtracted; the larger force alone
			answer: choiceOf(rng, accOpt(ans), aOpts([r2((a1 + a2) / Number(m)), r2(Math.abs(a1 - a2) / Number(m)), r2(Math.max(a1, a2) / Number(m))]), aOpts(around(exact))),
			params: { case: 'perpendicolari', m, F1, F2 },
			scene: pointScene(`La slitta vista dall'alto: una fune la tira verso destra con ${F1} newton, l'altra verso l'alto nel disegno con ${F2} newton.`, [
				{ nome: 'F', sub: '1', modulo: a1, angolo: 0 },
				{ nome: 'F', sub: '2', modulo: a2, angolo: 90 },
			]),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: with friction

function level5(rng: Rng): Built {
	for (;;) {
		const m = two(rng, true);
		const P = weight(m), Pn = Number(P);
		const mu = coeff(rng, 10, 50);
		const F = two(rng, false);
		const Fd = Number(mu) * Pn;
		if (Number(F) < 1.3 * Fd || Number(F) > 3 * Fd) continue;
		const exact = (Number(F) - Fd) / Number(m);
		const ans = r2(exact);
		if (ans === null) continue;
		return {
			prompt: "Trova l'accelerazione.",
			problem: textBlock(`Una cassa di ${pq(m, 'kg')} striscia sul pavimento, tirata con una forza orizzontale di ${pq(F, 'N')}; il coefficiente di attrito dinamico è $\\mu_d = ${decTex(mu)}$. Quanto vale l'accelerazione della cassa?`),
			solution: `a \\approx ${acc(ans)}`,
			steps: [
				`${t("L'attrito dinamico, con la forza premente uguale al peso: ")} F_d = \\mu_d\\,m\\,g = ${decTex(mu)} \\cdot ${KG(m)} \\cdot 9{,}8\\,\\text{m/s}^2 = ${f3(Fd)}\\ldots\\,\\text{N}`,
				`F_{tot} = F - F_d = ${f3(Number(F) - Fd)}\\ldots\\,\\text{N}`,
				`a = \\dfrac{F_{tot}}{m} = ${f3(exact)}\\ldots\\,\\text{m/s}^2 \\approx ${acc(ans)}`,
			],
			// friction forgotten; friction added; the mass for the weight in the friction
			answer: choiceOf(rng, accOpt(ans), aOpts([r2(Number(F) / Number(m)), r2((Number(F) + Fd) / Number(m)), r2((Number(F) - Number(mu) * Number(m)) / Number(m))]), aOpts(around(exact))),
			params: { case: 'attrito', m, F, mu },
			scene: blockScene(`Una cassa tirata verso destra da una forza di ${F} newton.`, [{ nome: 'F', modulo: Number(F), angolo: 0 }]),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: the force from the change of velocity

const SPEEDS = [36, 45, 54, 63, 72, 81]; // km/h, two significant figures

function level6(rng: Rng): Built {
	const brake = rng.next() < 0.5;
	for (;;) {
		const mm = (rng.int(10, 25) / 10).toFixed(1); // mantissa of the mass, · 10^3 kg
		const mass = Number(mm) * 1000;
		const kmh = rng.pick(SPEEDS);
		const v = kmh / 3.6;
		const T = two(rng, true);
		const tn = Number(T);
		const exact = (mass * v) / tn;
		const s = sci2(exact);
		if (s === null) continue;
		const mTex = `${decTex(mm)} \\cdot 10^3\\,\\text{kg}`;
		const vTex = `${kmh}\\,\\text{km/h}`;
		const problem = brake
			? `Un'auto di $${mTex}$ viaggia a $${vTex}$ e si ferma in ${pq(T, 's')} con accelerazione costante. Quanto vale la forza frenante?`
			: `Un'auto di $${mTex}$ parte da ferma e raggiunge $${vTex}$ in ${pq(T, 's')} con accelerazione costante. Quanto vale la forza totale sull'auto?`;
		const a = v / tn;
		const right = sciOpt(exact, 'N');
		if (!right) continue;
		return {
			prompt: brake ? 'Trova la forza frenante.' : 'Trova la forza totale.',
			problem: textBlock(problem),
			solution: `F \\approx ${s.tex}\\,\\text{N}`,
			steps: [
				`v = ${vTex} = \\dfrac{${kmh}}{3{,}6}\\,\\text{m/s} = ${f3(v)}\\ldots\\,\\text{m/s}`,
				brake ? `a = \\dfrac{0 - v_0}{t} = -\\dfrac{${f3(v)}\\,\\text{m/s}}{${qty(T, 's')}} = -${f3(a)}\\ldots\\,\\text{m/s}^2` : `a = \\dfrac{v - 0}{t} = \\dfrac{${f3(v)}\\,\\text{m/s}}{${qty(T, 's')}} = ${f3(a)}\\ldots\\,\\text{m/s}^2`,
				`${brake ? 'F = m\\,|a|' : 'F_{tot} = m\\,a'} = ${mTex} \\cdot ${f3(a)}\\ldots\\,\\text{m/s}^2 \\approx ${s.tex}\\,\\text{N}`,
				brake ? t('La forza è opposta al moto, come l\'accelerazione.') : t("La forza ha il verso del moto, come l'accelerazione."),
			],
			// km/h not converted; times the time; the time forgotten
			answer: choiceOf(rng, right, sciOpts([(mass * kmh) / tn, mass * v * tn, mass * v], 'N'), sciOpts([exact * 1.2, exact * 0.8, exact * 1.4], 'N')),
			params: { case: brake ? 'frenata' : 'partenza', m: mm, kmh, t: T },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = checkBasic(sample);
	const needsScene = [1, 3, 4, 5].includes(sample.level) || sample.params.case === 'massa';
	if (needsScene && !sample.scene) v.push('manca la scena');
	return v;
}

export const leggiNewton: Generator = {
	id: ID,
	title: 'Il secondo principio della dinamica',
	levels: {
		1: { label: "L'accelerazione", constraints: ['una forza orizzontale, senza attrito', 'a = F / m'] },
		2: { label: 'La forza o la massa', constraints: ['F = m a, oppure m = F / a'] },
		3: { label: 'Due forze opposte', constraints: ["l'accelerazione ha il verso della forza più grande"] },
		4: { label: 'Due forze perpendicolari', constraints: ['la forza totale con il teorema di Pitagora'] },
		5: { label: "Con l'attrito", constraints: ['attrito dinamico con la forza premente uguale al peso', 'la forza tra 1,3 e 3 volte l\'attrito'] },
		6: { label: 'Forza e velocità', constraints: ['frenata o partenza con accelerazione costante', 'velocità in km/h, massa e risultato in notazione scientifica'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default leggiNewton;
