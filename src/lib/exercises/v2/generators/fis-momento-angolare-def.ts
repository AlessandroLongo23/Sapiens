/**
 * Il momento angolare. Spec: specs/exercises/fis-momento-angolare-def.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/90-fis-momento-angolare-def.md), each one step harder:
 * L = m v r of a particle on a circle; L = r m v sin φ with an angle (and the scene); L = I ω of a rigid body; the
 * same with I from the shape (c m r², the radius in centimetres); the torque from the change of angular momentum,
 * M = I (ω₂ − ω₁) / Δt; the time a braking torque takes to stop a wheel, Δt = I ω / M.
 * Data with two significant figures, answers with two. Distractors from the lesson's warnings: the sine forgotten or
 * the cosine in its place, L mistaken for the rotational energy, c of the wrong body, the formula upside down.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { t } from '../vettori';
import { type Built, checkCommon, generateWith, sinD, cosD } from '../fisica-equilibrio';
import { cut, data2, lab } from '../fis-energia';
import { SHAPES, cmToM, pick4, pq, q } from '../fis-momento-angolare';

export const ID = 'fis-momento-angolare-def';

const L_UNIT = 'kg·m²/s';
const again = (): never => {
	throw new Error('resample');
};
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

// Level 1: a particle on a circle
function level1(rng: Rng): Built {
	const m = data2(rng, 0.11, 9.9);
	const v = data2(rng, 1.1, 30);
	const r = data2(rng, 0.11, 9.9);
	const mn = Number(m), vn = Number(v), rn = Number(r);
	const exact = mn * vn * rn;
	if (exact < 0.1) again();
	const p = pick4(rng, exact, L_UNIT, [(mn * vn) / rn, mn * vn * rn * rn, 0.5 * mn * vn * vn * rn]) ?? again();
	const what = rng.pick(['Un sasso legato a una corda', 'Una pallina legata a un filo', 'Un modellino di aereo legato a un cavo']);
	return {
		prompt: 'Trova il momento angolare.',
		problem: textBlock(`${what}, di massa ${pq(m, 'kg')}, percorre una circonferenza di raggio ${pq(r, 'm')} alla velocità di ${pq(v, 'm/s')}. Quanto vale il suo momento angolare rispetto al centro?`),
		solution: `L \\approx ${q(p.ans, L_UNIT)}`,
		steps: [
			t('Nel moto circolare la velocità è perpendicolare al raggio: ') + ' L = m\\,v\\,r',
			`L = ${q(m, 'kg')} \\cdot ${q(v, 'm/s')} \\cdot ${q(r, 'm')} = ${cut(exact)}\\,\\text{kg}\\cdot\\text{m}^2/\\text{s} \\approx ${q(p.ans, L_UNIT)}`,
		],
		answer: p.answer,
		params: { m, v, r },
	};
}

// Level 2: with the angle between r and v
function level2(rng: Rng): Built {
	const m = data2(rng, 0.11, 9.9);
	const v = data2(rng, 1.1, 30);
	const r = data2(rng, 0.11, 9.9);
	const phi = rng.pick([20, 25, 30, 35, 40, 50, 55, 60, 65, 70]);
	const mn = Number(m), vn = Number(v), rn = Number(r);
	const exact = rn * mn * vn * sinD(phi);
	if (exact < 0.1) again();
	const p = pick4(rng, exact, L_UNIT, [rn * mn * vn * cosD(phi), rn * mn * vn, (rn * mn * vn) / sinD(phi)]) ?? again();
	return {
		prompt: 'Trova il momento angolare rispetto a O.',
		problem: textBlock(`Una particella di massa ${pq(m, 'kg')} si muove a ${pq(v, 'm/s')}. In un certo istante si trova a ${pq(r, 'm')} dal polo $O$, e la sua velocità forma un angolo di $${phi}^\\circ$ con il vettore $\\vec{r}$ che va da $O$ alla particella. Quanto vale il suo momento angolare rispetto a $O$?`),
		solution: `L \\approx ${q(p.ans, L_UNIT)}`,
		steps: [
			'L = r\\,m\\,v\\sin\\varphi',
			`L = ${q(r, 'm')} \\cdot ${q(m, 'kg')} \\cdot ${q(v, 'm/s')} \\cdot \\sin ${phi}^\\circ = ${cut(exact)}\\,\\text{kg}\\cdot\\text{m}^2/\\text{s} \\approx ${q(p.ans, L_UNIT)}`,
		],
		answer: p.answer,
		params: { m, v, r, phi },
		scene: {
			type: 'particella-polo',
			data: { angolo: phi, testoR: `${lab(r)} m`, testoV: `${lab(v)} m/s`, testoAngolo: `${phi}°` },
			alt: `Il polo O, il vettore r lungo ${lab(r)} metri che va da O alla particella, e la velocità della particella, di ${lab(v)} metri al secondo, che forma un angolo di ${phi} gradi con il prolungamento di r.`,
		},
	};
}

// Level 3: a rigid body, L = I ω
function level3(rng: Rng): Built {
	const I = data2(rng, 0.11, 9.9);
	const w = data2(rng, 1.1, 30);
	const i = Number(I), o = Number(w);
	const exact = i * o;
	const p = pick4(rng, exact, L_UNIT, [0.5 * i * o * o, i * o * o, o / i]) ?? again();
	const what = rng.pick(['Un volano', 'Una ruota', 'Una piattaforma girevole']);
	return {
		prompt: 'Trova il momento angolare.',
		problem: textBlock(`${what} ha momento d'inerzia ${pq(I, 'kg·m²')} e ruota a ${pq(w, 'rad/s')}. Quanto vale il suo momento angolare?`),
		solution: `L \\approx ${q(p.ans, L_UNIT)}`,
		steps: [`L = I\\,\\omega = ${q(I, 'kg·m²')} \\cdot ${q(w, 'rad/s')} = ${cut(exact)}\\,\\text{kg}\\cdot\\text{m}^2/\\text{s} \\approx ${q(p.ans, L_UNIT)}`],
		answer: p.answer,
		params: { I, omega: w },
	};
}

// Level 4: I from the shape
function level4(rng: Rng): Built {
	const s = rng.pick(SHAPES);
	const m = data2(rng, 0.11, 9.9);
	const r = data2(rng, 11, 45);
	const w = data2(rng, 1.1, 99);
	const rm = cmToM(r);
	const mn = Number(m), rn = Number(rm), o = Number(w);
	const inertia = s.c * mn * rn * rn;
	const exact = inertia * o;
	if (exact < 0.1) again();
	const other = s.c === 1 ? 0.5 : 1;
	const p = pick4(rng, exact, L_UNIT, [(exact / s.c) * other, s.c * mn * rn * o, 0.5 * inertia * o * o]) ?? again();
	return {
		prompt: 'Trova il momento angolare.',
		problem: textBlock(`${cap(s.nome)} di massa ${pq(m, 'kg')} e raggio ${pq(r, 'cm')} ruota intorno al suo asse a ${pq(w, 'rad/s')}. Quanto vale il suo momento angolare?`),
		solution: `L \\approx ${q(p.ans, L_UNIT)}`,
		steps: [
			`${t('Il raggio in metri: ')} r = ${q(r, 'cm')} = ${q(rm, 'm')}`,
			`I = ${s.inertia} = ${s.c === 1 ? '' : `${s.cTex} \\cdot `}${q(m, 'kg')} \\cdot (${q(rm, 'm')})^2 = ${cut(inertia)}\\,\\text{kg}\\cdot\\text{m}^2`,
			`L = I\\,\\omega = ${cut(inertia)}\\,\\text{kg}\\cdot\\text{m}^2 \\cdot ${q(w, 'rad/s')} = ${cut(exact)}\\,\\text{kg}\\cdot\\text{m}^2/\\text{s} \\approx ${q(p.ans, L_UNIT)}`,
		],
		answer: p.answer,
		params: { forma: s.key, m, r, omega: w },
	};
}

// Level 5: the torque from the change of angular momentum
function level5(rng: Rng): Built {
	const I = data2(rng, 0.11, 9.9);
	const w1 = data2(rng, 1.1, 30);
	const w2 = data2(rng, 1.1, 60);
	const dt = data2(rng, 1.1, 30);
	const i = Number(I), a = Number(w1), b = Number(w2), d = Number(dt);
	if (b < 1.5 * a) again();
	const exact = (i * (b - a)) / d;
	if (exact < 0.1) again();
	const p = pick4(rng, exact, 'N·m', [(i * b) / d, i * (b - a) * d, (b - a) / d, (i * (a + b)) / d]) ?? again();
	return {
		prompt: 'Trova il momento della forza.',
		problem: textBlock(`Un motore porta un volano con momento d'inerzia ${pq(I, 'kg·m²')} da ${pq(w1, 'rad/s')} a ${pq(w2, 'rad/s')} in ${pq(dt, 's')}. Quanto vale il momento medio applicato dal motore?`),
		solution: `M \\approx ${q(p.ans, 'N·m')}`,
		steps: [
			`\\Delta L = I\\,(\\omega_2 - \\omega_1) = ${q(I, 'kg·m²')} \\cdot (${q(w2, 'rad/s')} - ${q(w1, 'rad/s')}) = ${cut(i * (b - a))}\\,\\text{kg}\\cdot\\text{m}^2/\\text{s}`,
			`M = \\dfrac{\\Delta L}{\\Delta t} = \\dfrac{${cut(i * (b - a))}\\,\\text{kg}\\cdot\\text{m}^2/\\text{s}}{${q(dt, 's')}} = ${cut(exact)}\\,\\text{N}\\cdot\\text{m} \\approx ${q(p.ans, 'N·m')}`,
		],
		answer: p.answer,
		params: { I, omega1: w1, omega2: w2, dt },
	};
}

// Level 6: the time to stop
function level6(rng: Rng): Built {
	const I = data2(rng, 0.11, 9.9);
	const w = data2(rng, 1.1, 60);
	const M = data2(rng, 0.11, 9.9);
	const i = Number(I), o = Number(w), mo = Number(M);
	const exact = (i * o) / mo;
	if (exact < 0.5) again();
	const p = pick4(rng, exact, 's', [mo / (i * o), i * o * mo, o / mo, (0.5 * i * o * o) / mo]) ?? again();
	return {
		prompt: 'Trova il tempo di frenata.',
		problem: textBlock(`Una ruota con momento d'inerzia ${pq(I, 'kg·m²')} gira a ${pq(w, 'rad/s')}. Un freno le applica un momento costante di ${pq(M, 'N·m')}, contrario alla rotazione. In quanto tempo la ruota si ferma?`),
		solution: `\\Delta t \\approx ${q(p.ans, 's')}`,
		steps: [
			`${t('Il momento angolare da togliere: ')} L = I\\,\\omega = ${q(I, 'kg·m²')} \\cdot ${q(w, 'rad/s')} = ${cut(i * o)}\\,\\text{kg}\\cdot\\text{m}^2/\\text{s}`,
			`${t('Da ')} M = \\dfrac{\\Delta L}{\\Delta t}${t(', con ')} \\Delta L ${t(' e ')} M ${t(' tutti e due negativi:')}`,
			`\\Delta t = \\dfrac{L}{M} = \\dfrac{${cut(i * o)}\\,\\text{kg}\\cdot\\text{m}^2/\\text{s}}{${q(M, 'N·m')}} = ${cut(exact)}\\,\\text{s} \\approx ${q(p.ans, 's')}`,
		],
		answer: p.answer,
		params: { I, omega: w, M },
	};
}

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (sample.level === 2 && sample.scene?.type !== 'particella-polo') v.push('manca la scena');
	if (sample.level !== 2 && sample.scene) v.push('scena non prevista');
	return v;
}

export const fisMomentoAngolareDef: Generator = {
	id: ID,
	title: 'Il momento angolare',
	levels: {
		1: { label: 'Una particella in moto circolare', constraints: ['L = m v r rispetto al centro', 'risultato da 0,1 kg·m²/s'] },
		2: { label: "Con l'angolo tra posizione e velocità", constraints: ['angolo da 20° a 70°', 'con la scena del polo'] },
		3: { label: 'Un corpo rigido che ruota', constraints: ['L = I ω', 'I da 0,11 a 9,9 kg·m²'] },
		4: { label: 'Il momento angolare dalla forma del corpo', constraints: ['anello, cilindro pieno, sfera piena o sfera cava', 'raggio in centimetri'] },
		5: { label: 'Il momento che fa accelerare', constraints: ['ω₂ almeno una volta e mezza ω₁'] },
		6: { label: 'Il tempo di frenata', constraints: ['tempo di almeno 0,5 s'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisMomentoAngolareDef;
