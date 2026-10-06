/**
 * Momento torcente e dinamica delle rotazioni. Spec: specs/exercises/fis-dinamica-rotazionale.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/88-fis-dinamica-rotazionale.md), each one step harder:
 * M = Iα with the three quantities given or asked; a force tangent to a disc, whose moment and moment of inertia are
 * to be found first; a force at an angle on a door (scene `asta-forze`); a wheel braked or started, with the laws of
 * lesson 86; the bucket hanging from a pulley that has a mass; the Atwood machine with a heavy pulley (scene
 * `corpi-collegati`). Data with two significant figures, answers with two, g = 9,8 m/s². Distractors from the
 * lesson's warnings: the arm forgotten, the cosine for the sine, the weight taken for the tension, the ideal pulley,
 * the whole mass of the pulley instead of half.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { type Built, G, checkCommon, choiceOf, cutQ, dec2, generateWith, lab, near, pq, qOpt, qu, r2, rel, res, t, textBlock, unitOpts } from '../fis-rotazioni';

export const ID = 'fis-dinamica-rotazionale';

const RADS2 = unitOpts('rad/s^2');
const RADS = unitOpts('rad/s');
const NM = unitOpts('N·m');
const MS2 = unitOpts('m/s^2');
const NEWTON = unitOpts('N');
const I_U = 'kg·m^2';
const sinD = (a: number) => Math.sin((a * Math.PI) / 180);
const cosD = (a: number) => Math.cos((a * Math.PI) / 180);

// ---------------------------------------------------------------------------
// Level 1: M = Iα

function level1(rng: Rng): Built {
	const askAlpha = rng.next() < 0.5;
	for (;;) {
		const I = dec2(rng, 0.11, 9.9);
		const II = Number(I);
		if (askAlpha) {
			const M = dec2(rng, 0.5, 60);
			const MM = Number(M);
			const a = MM / II;
			const ans = r2(a);
			if (ans === null || a < 0.1) continue;
			return {
				prompt: "Trova l'accelerazione angolare.",
				problem: textBlock(`Su una ruota con momento d'inerzia ${pq(I, I_U)} agisce un momento totale di ${pq(M, 'N·m')}. Quanto vale la sua accelerazione angolare?`),
				solution: `\\alpha ${rel(a, ans)} ${qu(ans, 'rad/s^2')}`,
				steps: [`\\alpha = \\dfrac{M_{tot}}{I} = \\dfrac{${qu(M, 'N·m')}}{${qu(I, I_U)}} = ${res(a, ans, 'rad/s^2')}`],
				// the product; the ratio upside down; the moment of inertia squared
				answer: choiceOf(rng, qOpt(ans, 'rad/s^2'), RADS2([r2(MM * II), r2(II / MM), r2(MM / (II * II))]), near(a, 'rad/s^2')),
				params: { case: 'accelerazione', I, M },
			};
		}
		const al = dec2(rng, 0.5, 40);
		const A = Number(al);
		const M = II * A;
		const ans = r2(M);
		if (ans === null || M < 0.1) continue;
		return {
			prompt: 'Trova il momento totale.',
			problem: textBlock(`Un volano con momento d'inerzia ${pq(I, I_U)} deve prendere un'accelerazione angolare di ${pq(al, 'rad/s^2')}. Quale momento totale serve?`),
			solution: `M_{tot} ${rel(M, ans)} ${qu(ans, 'N·m')}`,
			steps: [`M_{tot} = I\\,\\alpha = ${qu(I, I_U)} \\cdot ${qu(al, 'rad/s^2')} = ${res(M, ans, 'N·m')}`],
			// α over I; I over α; α squared
			answer: choiceOf(rng, qOpt(ans, 'N·m'), NM([r2(A / II), r2(II / A), r2(II * A * A)]), near(M, 'N·m')),
			params: { case: 'momento', I, alpha: al },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: a force tangent to a disc

function level2(rng: Rng): Built {
	for (;;) {
		const m = dec2(rng, 0.5, 9.9), R = dec2(rng, 0.11, 0.99), F = dec2(rng, 1.1, 40);
		const mm = Number(m), RR = Number(R), FF = Number(F);
		const I = 0.5 * mm * RR * RR, M = FF * RR;
		const a = M / I;
		const ans = r2(a);
		if (ans === null || a < 0.5) continue;
		return {
			prompt: "Trova l'accelerazione angolare.",
			problem: textBlock(`Un disco pieno di massa ${pq(m, 'kg')} e raggio ${pq(R, 'm')} può ruotare senza attrito attorno al suo asse. Una forza di ${pq(F, 'N')} agisce sul bordo, tangente al disco. Quanto vale l'accelerazione angolare del disco?`),
			solution: `\\alpha ${rel(a, ans)} ${qu(ans, 'rad/s^2')}`,
			steps: [
				t('La forza è tangente: il braccio è il raggio.'),
				`M = F\\,R = ${qu(F, 'N')} \\cdot ${qu(R, 'm')} = ${cutQ(M, 'N·m')}`,
				`I = \\dfrac{1}{2}\\,m R^2 = \\dfrac{1}{2} \\cdot ${qu(m, 'kg')} \\cdot (${qu(R, 'm')})^2 = ${cutQ(I, I_U)}`,
				`\\alpha = \\dfrac{M}{I} = ${res(a, ans, 'rad/s^2')}`,
			],
			// the arm forgotten (F over I); the half of the disc forgotten; the force over the mass
			answer: choiceOf(rng, qOpt(ans, 'rad/s^2'), RADS2([r2(FF / I), r2(M / (mm * RR * RR)), r2(FF / mm)]), near(a, 'rad/s^2')),
			params: { m, R, F },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: a force at an angle on a door

// From 30 degrees: under that the scene writes the angle over the arrow.
const ANGLES = [30, 35, 40, 50, 55, 60, 65, 70];

function doorScene(r: string, F: string, phi: number): SceneRef {
	return {
		type: 'asta-forze',
		data: {
			lunghezza: 1,
			appoggi: [{ x: 0, tipo: 'perno' }],
			forze: [{ x: Number(r), angolo: phi, nome: 'F', valore: `${lab(F)} N`, arco: `${phi}°` }],
			quote: [{ da: 0, a: Number(r), testo: `${lab(r)} m`, lato: 'sotto' }],
		},
		alt: `Una porta vista dall'alto, con i cardini all'estremità sinistra; a ${lab(r)} metri dai cardini una forza di ${lab(F)} newton forma un angolo di ${phi} gradi con la porta.`,
	};
}

function level3(rng: Rng): Built {
	for (;;) {
		const I = dec2(rng, 1.1, 9.9), r = dec2(rng, 0.31, 0.95), F = dec2(rng, 5.0, 60), phi = rng.pick(ANGLES);
		const II = Number(I), RR = Number(r), FF = Number(F);
		const M = RR * FF * sinD(phi);
		const a = M / II;
		const ans = r2(a);
		if (ans === null || a < 0.2) continue;
		return {
			prompt: "Trova l'accelerazione angolare.",
			problem: textBlock(`Una porta ha momento d'inerzia ${pq(I, I_U)} rispetto ai cardini. La spingi a ${pq(r, 'm')} dai cardini con una forza di ${pq(F, 'N')}, che forma un angolo di $${phi}^\\circ$ con il piano della porta. Con quale accelerazione angolare parte la porta?`),
			solution: `\\alpha ${rel(a, ans)} ${qu(ans, 'rad/s^2')}`,
			steps: [
				t('Conta solo la componente della forza perpendicolare alla porta:'),
				`M = r\\,F \\sin\\varphi = ${qu(r, 'm')} \\cdot ${qu(F, 'N')} \\cdot \\sin ${phi}^\\circ = ${cutQ(M, 'N·m')}`,
				`\\alpha = \\dfrac{M}{I} = \\dfrac{${cutQ(M, 'N·m')}}{${qu(I, I_U)}} = ${res(a, ans, 'rad/s^2')}`,
			],
			// the cosine for the sine; the angle forgotten; the distance forgotten
			answer: choiceOf(rng, qOpt(ans, 'rad/s^2'), RADS2([r2((RR * FF * cosD(phi)) / II), r2((RR * FF) / II), r2((FF * sinD(phi)) / II)]), near(a, 'rad/s^2')),
			params: { I, r, F, phi },
			scene: doorScene(r, F, phi),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: braking and starting a wheel

function level4(rng: Rng): Built {
	const braking = rng.next() < 0.5;
	for (;;) {
		const I = dec2(rng, 0.11, 5.0), time = dec2(rng, 1.1, 20);
		const II = Number(I), T = Number(time);
		if (braking) {
			const w0 = dec2(rng, 5.0, 60);
			const W0 = Number(w0);
			const al = W0 / T, M = II * al;
			const ans = r2(M);
			if (ans === null || M < 0.05) continue;
			return {
				prompt: 'Trova il momento frenante.',
				problem: textBlock(`Una ruota con momento d'inerzia ${pq(I, I_U)} gira a ${pq(w0, 'rad/s')}. Un freno la ferma in ${pq(time, 's')} con accelerazione angolare costante. Quanto vale, in modulo, il momento frenante?`),
				solution: `|M| ${rel(M, ans)} ${qu(ans, 'N·m')}`,
				steps: [
					`\\alpha = \\dfrac{\\omega - \\omega_0}{t} = \\dfrac{0 - ${qu(w0, 'rad/s')}}{${qu(time, 's')}} = -${cutQ(al, 'rad/s^2')}`,
					`M = I\\,\\alpha = ${qu(I, I_U)} \\cdot (-${cutQ(al, 'rad/s^2')}) = -${cutQ(M, 'N·m')}`,
					t('Il segno meno dice che il momento è opposto alla rotazione.'),
					`|M| ${rel(M, ans)} ${qu(ans, 'N·m')}`,
				],
				// the time forgotten (I·ω0); multiplied by the time; the acceleration alone
				answer: choiceOf(rng, qOpt(ans, 'N·m'), NM([r2(II * W0), r2(II * W0 * T), r2(al)]), near(M, 'N·m')),
				params: { case: 'frenata', I, w0, t: time },
			};
		}
		const M = dec2(rng, 0.5, 40);
		const MM = Number(M);
		const al = MM / II, w = al * T;
		const ans = r2(w);
		if (ans === null) continue;
		return {
			prompt: 'Trova la velocità angolare finale.',
			problem: textBlock(`Un motore applica un momento costante di ${pq(M, 'N·m')} a un volano fermo, che ha momento d'inerzia ${pq(I, I_U)}. Quale velocità angolare ha il volano dopo ${pq(time, 's')}?`),
			solution: `\\omega ${rel(w, ans)} ${qu(ans, 'rad/s')}`,
			steps: [
				`\\alpha = \\dfrac{M}{I} = \\dfrac{${qu(M, 'N·m')}}{${qu(I, I_U)}} = ${cutQ(al, 'rad/s^2')}`,
				`\\omega = \\omega_0 + \\alpha\\,t = 0 + ${cutQ(al, 'rad/s^2')} \\cdot ${qu(time, 's')} = ${res(w, ans, 'rad/s')}`,
			],
			// the acceleration taken for the velocity; M·I·t; the law of the angle
			answer: choiceOf(rng, qOpt(ans, 'rad/s'), RADS([r2(al), r2(MM * II * T), r2(0.5 * al * T * T)]), near(w, 'rad/s')),
			params: { case: 'avvio', I, M, t: time },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the bucket and the pulley with a mass

function level5(rng: Rng): Built {
	const askT = rng.next() < 0.5;
	for (;;) {
		const m = dec2(rng, 0.5, 9.9), M = dec2(rng, 0.5, 9.9);
		const mm = Number(m), MM = Number(M);
		const a = (mm * G) / (mm + MM / 2);
		const T = (MM * a) / 2;
		const exact = askT ? T : a;
		const ans = r2(exact);
		if (ans === null || a > 9.3) continue;
		const intro = `Un secchio di massa ${pq(m, 'kg')} è appeso a una fune avvolta attorno a una carrucola, un disco pieno di massa ${pq(M, 'kg')} che ruota senza attrito attorno al suo asse. Il secchio viene lasciato libero.`;
		const aStep = `a = \\dfrac{m\\,g}{m + \\frac{1}{2}M} = \\dfrac{${qu(m, 'kg')} \\cdot 9{,}8\\,\\text{m/s}^2}{${qu(m, 'kg')} + \\frac{1}{2} \\cdot ${qu(M, 'kg')}}`;
		const head = [t('Secchio: m g meno T uguale m a. Carrucola: T R uguale I alfa, con alfa uguale ad a diviso R.'), `T = \\dfrac{1}{2}\\,M\\,a \\qquad m\\,g - \\dfrac{1}{2}\\,M\\,a = m\\,a`];
		if (askT) {
			return {
				prompt: 'Trova la tensione della fune.',
				problem: textBlock(`${intro} Quanto vale la tensione della fune?`),
				solution: `T ${rel(T, ans)} ${qu(ans, 'N')}`,
				steps: [...head, aStep, `a = ${cutQ(a, 'm/s^2')}`, `T = \\dfrac{1}{2}\\,M\\,a = \\dfrac{1}{2} \\cdot ${qu(M, 'kg')} \\cdot ${cutQ(a, 'm/s^2')} = ${res(T, ans, 'N')}`],
				// the weight of the bucket; half the pulley's mass times g; the bucket's mass times a
				answer: choiceOf(rng, qOpt(ans, 'N'), NEWTON([r2(mm * G), r2((MM * G) / 2), r2(mm * a)]), near(T, 'N')),
				params: { case: 'tensione', m, M },
			};
		}
		return {
			prompt: "Trova l'accelerazione del secchio.",
			problem: textBlock(`${intro} Con quale accelerazione scende?`),
			solution: `a ${rel(a, ans)} ${qu(ans, 'm/s^2')}`,
			steps: [...head, aStep, `a = ${res(a, ans, 'm/s^2')}`],
			// free fall; the whole mass of the pulley; the bucket's mass left out of the denominator
			answer: choiceOf(rng, qOpt(ans, 'm/s^2'), MS2(['9.8', r2((mm * G) / (mm + MM)), r2((mm * G) / (MM / 2))]), near(a, 'm/s^2')),
			params: { case: 'accelerazione', m, M },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: the Atwood machine with a heavy pulley

function level6(rng: Rng): Built {
	const askT = rng.next() < 0.5;
	for (;;) {
		const m1 = dec2(rng, 0.5, 5.0), m2 = dec2(rng, 0.5, 9.9), M = dec2(rng, 0.5, 5.0);
		const M1 = Number(m1), M2 = Number(m2), MM = Number(M);
		if (M2 < 1.2 * M1 || M2 > 3 * M1) continue;
		const a = ((M2 - M1) * G) / (M1 + M2 + MM / 2);
		const T2 = M2 * (G - a);
		const exact = askT ? T2 : a;
		const ans = r2(exact);
		if (ans === null || a < 0.2) continue;
		const intro = `Una macchina di Atwood porta due masse di ${pq(m1, 'kg')} e ${pq(m2, 'kg')}. La carrucola è un disco pieno di massa ${pq(M, 'kg')}, senza attrito sull'asse, e il filo non slitta.`;
		const aStep = `a = \\dfrac{(m_2 - m_1)\\,g}{m_1 + m_2 + \\frac{1}{2}M} = \\dfrac{(${qu(m2, 'kg')} - ${qu(m1, 'kg')}) \\cdot 9{,}8\\,\\text{m/s}^2}{${qu(m1, 'kg')} + ${qu(m2, 'kg')} + \\frac{1}{2} \\cdot ${qu(M, 'kg')}}`;
		const head = [t('Massa leggera: T1 meno m1 g uguale m1 a. Massa pesante: m2 g meno T2 uguale m2 a.'), t('Carrucola: T2 meno T1 uguale un mezzo di M per a.')];
		const scene: SceneRef = {
			type: 'corpi-collegati',
			data: { tipo: 'atwood', m1: `${lab(m1)} kg`, m2: `${lab(m2)} kg` },
			alt: `Una macchina di Atwood con una massa di ${lab(m1)} chilogrammi a sinistra e una di ${lab(m2)} chilogrammi a destra.`,
		};
		if (askT) {
			return {
				prompt: 'Trova la tensione dal lato della massa più pesante.',
				problem: textBlock(`${intro} Quanto vale la tensione del tratto di filo che regge la massa più pesante?`),
				solution: `T_2 ${rel(T2, ans)} ${qu(ans, 'N')}`,
				steps: [...head, aStep, `a = ${cutQ(a, 'm/s^2')}`, `T_2 = m_2\\,(g - a) = ${qu(m2, 'kg')} \\cdot (9{,}8\\,\\text{m/s}^2 - ${cutQ(a, 'm/s^2')}) = ${res(T2, ans, 'N')}`],
				// the weight of the heavier mass; the tension on the other side; the sign of a
				answer: choiceOf(rng, qOpt(ans, 'N'), NEWTON([r2(M2 * G), r2(M1 * (G + a)), r2(M2 * (G + a))]), near(T2, 'N')),
				params: { case: 'tensione', m1, m2, M },
				scene,
			};
		}
		return {
			prompt: "Trova l'accelerazione.",
			problem: textBlock(`${intro} Quanto vale l'accelerazione delle due masse?`),
			solution: `a ${rel(a, ans)} ${qu(ans, 'm/s^2')}`,
			steps: [...head, aStep, `a = ${res(a, ans, 'm/s^2')}`],
			// the ideal pulley; the whole mass of the pulley; the weight of the heavier mass alone at the numerator
			answer: choiceOf(rng, qOpt(ans, 'm/s^2'), MS2([r2(((M2 - M1) * G) / (M1 + M2)), r2(((M2 - M1) * G) / (M1 + M2 + MM)), r2((M2 * G) / (M1 + M2 + MM / 2))]), near(a, 'm/s^2')),
			params: { case: 'accelerazione', m1, m2, M },
			scene,
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (sample.level === 3 && sample.scene?.type !== 'asta-forze') v.push('manca la scena della porta');
	if (sample.level === 6 && sample.scene?.type !== 'corpi-collegati') v.push('manca la scena della macchina di Atwood');
	return v;
}

export const fisDinamicaRotazionale: Generator = {
	id: ID,
	title: 'Momento torcente e dinamica delle rotazioni',
	levels: {
		1: { label: 'Il secondo principio per le rotazioni', constraints: ['M = Iα', 'accelerazione angolare o momento totale, metà ciascuno'] },
		2: { label: 'Una forza tangente a un disco', constraints: ['M = FR e I = mR²/2 da calcolare'] },
		3: { label: 'Una forza obliqua', constraints: ['M = rF sin φ, angolo diverso da 45 gradi', 'scena asta-forze'] },
		4: { label: 'Frenare e avviare una ruota', constraints: ['momento frenante da ω0 e t, o velocità angolare da M, I e t'] },
		5: { label: 'Il secchio e la carrucola con massa', constraints: ['a = mg/(m + M/2), T = Ma/2', 'accelerazione o tensione'] },
		6: { label: 'La macchina di Atwood con la carrucola pesante', constraints: ['la seconda massa tra 1,2 e 3 volte la prima', 'accelerazione o tensione dal lato pesante', 'scena corpi-collegati'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisDinamicaRotazionale;
