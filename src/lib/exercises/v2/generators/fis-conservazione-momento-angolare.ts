/**
 * La conservazione del momento angolare. Spec: specs/exercises/fis-conservazione-momento-angolare.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/91-fis-conservazione-momento-angolare.md), each one step
 * harder: I₁ ω₁ = I₂ ω₂ for a body that changes shape; the same with the moments of inertia to work out, two masses
 * moved along a light rod; a disc at rest dropped on a turning one, I₁ ω₁ = (I₁ + I₂) ω; a child who jumps on a
 * roundabout at rest, m v r = (I + m r²) ω with I = ½ M r²; the speed at the far point of an orbit, v_p r_p = v_a r_a
 * (with the scene); the kinetic energy after the body has changed shape, (I₁ ω₁)² / (2 I₂).
 * Data with two significant figures (the mass of the roundabout with three), answers with two. Distractors from the
 * lesson's warnings: the kinetic energy kept instead of L, the ratio upside down, the child's own m r² forgotten.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { t } from '../vettori';
import { type Built, checkCommon, generateWith } from '../fisica-equilibrio';
import { cut, data2, int3, lab } from '../fis-energia';
import { cmToM, pick4, pq, q } from '../fis-momento-angolare';

export const ID = 'fis-conservazione-momento-angolare';

const again = (): never => {
	throw new Error('resample');
};
const I_U = 'kg·m²';

const WHO = [
	{ key: 'pattinatrice', open: 'Una pattinatrice gira su se stessa con le braccia aperte', close: 'Stringe le braccia al corpo', far: 'Allarga le braccia' },
	{ key: 'tuffatore', open: 'Un tuffatore ruota in aria con il corpo disteso', close: 'Si raggomitola', far: 'Si distende ancora di più, con le braccia sopra la testa' },
	{ key: 'sgabello', open: 'Una ragazza gira su uno sgabello girevole con due pesi nelle mani e le braccia aperte', close: 'Porta i pesi al petto', far: 'Allunga le braccia del tutto' },
] as const;

/** I₁, ω₁ and I₂: closing, I₂ from a quarter to 70% of I₁; opening, from 1,3 to 2,5 times I₁. */
function shapeChange(rng: Rng) {
	const who = rng.pick(WHO);
	const closes = rng.next() < 0.7;
	const I1 = data2(rng, 1.1, 9.9);
	const I2 = data2(rng, 0.31, 15);
	const w1 = data2(rng, 1.1, 9.9);
	const a = Number(I1), b = Number(I2);
	if (closes ? b > 0.7 * a || b < 0.25 * a : b < 1.3 * a || b > 2.5 * a) again();
	const text = `${who.open}: il suo momento d'inerzia è ${pq(I1, I_U)} e la sua velocità angolare ${pq(w1, 'rad/s')}. ${closes ? who.close : who.far}, e il momento d'inerzia diventa ${pq(I2, I_U)}.`;
	return { who: who.key, closes, I1, I2, w1, a, b, o: Number(w1), text };
}

// Level 1: I₁ ω₁ = I₂ ω₂
function level1(rng: Rng): Built {
	const d = shapeChange(rng);
	const exact = (d.a * d.o) / d.b;
	const p = pick4(rng, exact, 'rad/s', [(d.b * d.o) / d.a, d.o * Math.sqrt(d.a / d.b), d.o * (d.a / d.b) ** 2]) ?? again();
	return {
		prompt: 'Trova la nuova velocità angolare.',
		problem: textBlock(`${d.text} Con che velocità angolare ruota adesso?`),
		solution: `\\omega_2 \\approx ${q(p.ans, 'rad/s')}`,
		steps: [
			t('Il momento esterno è trascurabile, quindi il momento angolare si conserva: ') + ' I_1\\,\\omega_1 = I_2\\,\\omega_2',
			`\\omega_2 = \\dfrac{I_1}{I_2}\\,\\omega_1 = \\dfrac{${q(d.I1, I_U)}}{${q(d.I2, I_U)}} \\cdot ${q(d.w1, 'rad/s')} = ${cut(exact)}\\,\\text{rad/s} \\approx ${q(p.ans, 'rad/s')}`,
		],
		answer: p.answer,
		params: { caso: d.closes ? 'chiude' : 'apre', I1: d.I1, I2: d.I2, omega1: d.w1 },
	};
}

// Level 2: two masses moved along a light rod
function level2(rng: Rng): Built {
	const m = data2(rng, 0.11, 2.5);
	const r1 = data2(rng, 21, 99);
	const r2 = data2(rng, 11, 99);
	const w1 = data2(rng, 1.1, 9.9);
	const a = Number(r1), b = Number(r2), o = Number(w1);
	if (b > 0.8 * a || b < 0.3 * a) again();
	const exact = o * (a / b) ** 2;
	const p = pick4(rng, exact, 'rad/s', [(o * a) / b, o * (b / a) ** 2, o * Math.sqrt(a / b), (o * b) / a]) ?? again();
	const m1 = cmToM(r1), m2 = cmToM(r2);
	return {
		prompt: 'Trova la nuova velocità angolare.',
		problem: textBlock(`Due masse di ${pq(m, 'kg')} sono fissate a un'asta leggera che ruota senza attrito intorno al suo centro a ${pq(w1, 'rad/s')}; ciascuna dista ${pq(r1, 'cm')} dall'asse. Un meccanismo le avvicina fino a ${pq(r2, 'cm')} dall'asse. Trascura la massa dell'asta: con che velocità angolare ruota adesso il sistema?`),
		solution: `\\omega_2 \\approx ${q(p.ans, 'rad/s')}`,
		steps: [
			`${t("Il momento d'inerzia delle due masse: ")} I = 2\\,m\\,r^2`,
			`I_1\\,\\omega_1 = I_2\\,\\omega_2 \\quad\\Rightarrow\\quad 2\\,m\\,r_1^2\\,\\omega_1 = 2\\,m\\,r_2^2\\,\\omega_2`,
			`\\omega_2 = \\left(\\dfrac{r_1}{r_2}\\right)^2 \\omega_1 = \\left(\\dfrac{${q(m1, 'm')}}{${q(m2, 'm')}}\\right)^2 \\cdot ${q(w1, 'rad/s')} = ${cut(exact)}\\,\\text{rad/s} \\approx ${q(p.ans, 'rad/s')}`,
			t('La massa si semplifica.'),
		],
		answer: p.answer,
		params: { m, r1, r2, omega1: w1 },
	};
}

// Level 3: a disc dropped on a turning one
function level3(rng: Rng): Built {
	const I1 = data2(rng, 0.011, 0.99);
	const I2 = data2(rng, 0.011, 0.99);
	const w1 = data2(rng, 1.1, 30);
	const a = Number(I1), b = Number(I2), o = Number(w1);
	if (b < 0.25 * a || b > 3 * a) again();
	const exact = (a * o) / (a + b);
	const p = pick4(rng, exact, 'rad/s', [(a * o) / b, (b * o) / (a + b), o * Math.sqrt(a / (a + b)), ((a + b) * o) / a]) ?? again();
	return {
		prompt: 'Trova la velocità angolare finale.',
		problem: textBlock(`Un disco con momento d'inerzia ${pq(I1, I_U)} gira a ${pq(w1, 'rad/s')} intorno al suo asse. Un secondo disco, fermo, con momento d'inerzia ${pq(I2, I_U)}, cade sul primo lungo lo stesso asse. Con che velocità angolare girano insieme?`),
		solution: `\\omega \\approx ${q(p.ans, 'rad/s')}`,
		steps: [
			t("L'attrito tra i dischi è una forza interna: ") + ' I_1\\,\\omega_1 = (I_1 + I_2)\\,\\omega',
			`I_1 + I_2 = ${q(I1, I_U)} + ${q(I2, I_U)} = ${cut(a + b)}\\,\\text{kg}\\cdot\\text{m}^2`,
			`\\omega = \\dfrac{I_1}{I_1 + I_2}\\,\\omega_1 = \\dfrac{${q(I1, I_U)}}{${cut(a + b)}\\,\\text{kg}\\cdot\\text{m}^2} \\cdot ${q(w1, 'rad/s')} = ${cut(exact)}\\,\\text{rad/s} \\approx ${q(p.ans, 'rad/s')}`,
		],
		answer: p.answer,
		params: { I1, I2, omega1: w1 },
	};
}

// Level 4: a child jumps on a roundabout
function level4(rng: Rng): Built {
	const M = int3(rng, 101, 199);
	const r = data2(rng, 1.1, 2.5);
	const m = data2(rng, 21, 49);
	const v = data2(rng, 1.5, 6.5);
	const Mn = Number(M), rn = Number(r), mn = Number(m), vn = Number(v);
	const I = 0.5 * Mn * rn * rn;
	const L = mn * vn * rn;
	const child = mn * rn * rn;
	const exact = L / (I + child);
	const p = pick4(rng, exact, 'rad/s', [L / I, (mn * vn) / (I + child), L / (Mn * rn * rn + child), vn / rn]) ?? again();
	return {
		prompt: 'Trova la velocità angolare della giostra.',
		problem: textBlock(`Una giostra è un disco pieno di ${pq(M, 'kg')} e raggio ${pq(r, 'm')}, fermo, libero di ruotare senza attrito intorno al centro. Un bambino di ${pq(m, 'kg')} corre a ${pq(v, 'm/s')} lungo la tangente al bordo e ci salta sopra. Con che velocità angolare parte la giostra?`),
		solution: `\\omega \\approx ${q(p.ans, 'rad/s')}`,
		steps: [
			`${t('La giostra: ')} I = \\tfrac{1}{2} M r^2 = \\tfrac{1}{2} \\cdot ${q(M, 'kg')} \\cdot (${q(r, 'm')})^2 = ${cut(I, 4)}\\,\\text{kg}\\cdot\\text{m}^2`,
			`${t('Prima del salto: ')} L = m\\,v\\,r = ${q(m, 'kg')} \\cdot ${q(v, 'm/s')} \\cdot ${q(r, 'm')} = ${cut(L, 4)}\\,\\text{kg}\\cdot\\text{m}^2/\\text{s}`,
			`${t('Dopo il salto gira anche il bambino: ')} I + m\\,r^2 = ${cut(I, 4)}\\,\\text{kg}\\cdot\\text{m}^2 + ${q(m, 'kg')} \\cdot (${q(r, 'm')})^2 = ${cut(I + child, 4)}\\,\\text{kg}\\cdot\\text{m}^2`,
			`\\omega = \\dfrac{L}{I + m\\,r^2} = \\dfrac{${cut(L, 4)}\\,\\text{kg}\\cdot\\text{m}^2/\\text{s}}{${cut(I + child, 4)}\\,\\text{kg}\\cdot\\text{m}^2} = ${cut(exact)}\\,\\text{rad/s} \\approx ${q(p.ans, 'rad/s')}`,
		],
		answer: p.answer,
		params: { M, r, m, v },
	};
}

// Level 5: the two ends of an orbit
function level5(rng: Rng): Built {
	const rp = data2(rng, 11, 99);
	const ra = data2(rng, 15, 99);
	const vp = data2(rng, 11, 99);
	const a = Number(rp), b = Number(ra), o = Number(vp);
	if (b < 1.3 * a || b > 4 * a) again();
	const exact = (o * a) / b;
	const p = pick4(rng, exact, 'km/s', [(o * b) / a, o * Math.sqrt(a / b), o * (a / b) ** 2]) ?? again();
	const body = rng.pick(['Un asteroide', 'Una cometa']);
	return {
		prompt: "Trova la velocità all'afelio.",
		problem: textBlock(`${body} percorre un'orbita ellittica intorno al Sole. Al perielio, a $${rp}$ milioni di chilometri dal Sole, ha una velocità di ${pq(vp, 'km/s')}. Che velocità ha all'afelio, a $${ra}$ milioni di chilometri dal Sole?`),
		solution: `v_a \\approx ${q(p.ans, 'km/s')}`,
		steps: [
			t('La forza del Sole è centrale: il momento angolare rispetto al Sole si conserva.'),
			t("Al perielio e all'afelio la velocità è perpendicolare al raggio: ") + ' v_p\\,r_p = v_a\\,r_a',
			`v_a = \\dfrac{r_p}{r_a}\\,v_p = \\dfrac{${rp}}{${ra}} \\cdot ${q(vp, 'km/s')} = ${cut(exact)}\\,\\text{km/s} \\approx ${q(p.ans, 'km/s')}`,
		],
		answer: p.answer,
		params: { rp, ra, vp },
		scene: {
			type: 'orbita-ellisse',
			data: { rp: a, ra: b, testoRp: rp, testoRa: ra, testoVp: `${lab(vp)} km/s`, nota: 'distanze in milioni di km' },
			alt: `Un'orbita ellittica con il Sole in un fuoco: il perielio è a ${rp} milioni di chilometri dal Sole, l'afelio a ${ra} milioni; al perielio è disegnata la velocità, di ${lab(vp)} chilometri al secondo, perpendicolare all'asse dell'orbita.`,
		},
	};
}

// Level 6: the kinetic energy after the change
function level6(rng: Rng): Built {
	const d = shapeChange(rng);
	const w2 = (d.a * d.o) / d.b;
	const exact = 0.5 * d.b * w2 * w2;
	const K1 = 0.5 * d.a * d.o * d.o;
	if (exact < 1) again();
	const p = pick4(rng, exact, 'J', [K1, 0.5 * d.b * d.o * d.o, 2 * exact, 0.5 * d.a * w2 * w2]) ?? again();
	return {
		prompt: "Trova l'energia cinetica finale.",
		problem: textBlock(`${d.text} Quanto vale adesso la sua energia cinetica di rotazione?`),
		solution: `K_2 \\approx ${q(p.ans, 'J')}`,
		steps: [
			t("Si conserva il momento angolare, non l'energia cinetica: ") + ' I_1\\,\\omega_1 = I_2\\,\\omega_2',
			`\\omega_2 = \\dfrac{I_1}{I_2}\\,\\omega_1 = \\dfrac{${q(d.I1, I_U)}}{${q(d.I2, I_U)}} \\cdot ${q(d.w1, 'rad/s')} = ${cut(w2, 4)}\\,\\text{rad/s}`,
			`K_2 = \\tfrac{1}{2} I_2\\,\\omega_2^2 = \\tfrac{1}{2} \\cdot ${q(d.I2, I_U)} \\cdot (${cut(w2, 4)}\\,\\text{rad/s})^2 = ${cut(exact)}\\,\\text{J} \\approx ${q(p.ans, 'J')}`,
			`${t("Prima l'energia era ")} K_1 = \\tfrac{1}{2} I_1\\,\\omega_1^2 = ${cut(K1)}\\,\\text{J}${t(d.closes ? ': è aumentata, per il lavoro delle forze interne.' : ': è diminuita.')}`,
		],
		answer: p.answer,
		params: { caso: d.closes ? 'chiude' : 'apre', I1: d.I1, I2: d.I2, omega1: d.w1 },
	};
}

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (sample.level === 5 && sample.scene?.type !== 'orbita-ellisse') v.push('manca la scena');
	if (sample.level !== 5 && sample.scene) v.push('scena non prevista');
	return v;
}

export const fisConservazioneMomentoAngolare: Generator = {
	id: ID,
	title: 'La conservazione del momento angolare',
	levels: {
		1: { label: 'Un corpo che cambia forma', constraints: ['chiudendosi I₂ è tra un quarto e il 70% di I₁, aprendosi tra 1,3 e 2,5 volte', 'il corpo si chiude più spesso di quanto si apra'] },
		2: { label: "Due masse che si avvicinano all'asse", constraints: ["r₂ tra il 30% e l'80% di r₁", 'distanze in centimetri'] },
		3: { label: 'Un disco cade su un altro', constraints: ['I₂ tra un quarto e il triplo di I₁'] },
		4: { label: 'Un salto sulla giostra', constraints: ['giostra come disco pieno, da 101 a 199 kg', 'il bambino arriva in tangente'] },
		5: { label: "Dal perielio all'afelio", constraints: ['afelio tra 1,3 e 4 volte il perielio', "con la scena dell'orbita"] },
		6: { label: "L'energia cinetica dopo il cambio di forma", constraints: ['risultato tra 1 e 99 J'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisConservazioneMomentoAngolare;
