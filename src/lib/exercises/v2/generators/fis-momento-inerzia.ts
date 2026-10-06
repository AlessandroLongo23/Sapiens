/**
 * Il momento d'inerzia. Spec: specs/exercises/fis-momento-inerzia.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/87-fis-momento-inerzia.md), each one step harder: one point
 * mass, I = mr² (half the times with the distance in centimetres); two or three point masses on a light rod; the same
 * two masses at the ends of a rod with the axis moved (through one of them, or at a given distance from it); a
 * homogeneous body of the lesson's table; the theorem of Huygens-Steiner; a body made of parts. Levels 2 and 3 carry
 * the scene `masse-asse` (src/components/content/exercises/scenes/MasseAsse.tsx). Data with two significant figures,
 * answers with two. Distractors from the lesson's warnings: the distance not squared, the centimetres not converted,
 * the distances taken from the wrong point, the formula of another body or of another axis, I_cm or Md² alone.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { type Built, checkCommon, choiceOf, cutQ, dec2, generateWith, lab, near, pq, qOpt, qu, r2, rel, res, t, tenths, textBlock, unitOpts } from '../fis-rotazioni';

export const ID = 'fis-momento-inerzia';

const U = 'kg·m^2';
const KGM2 = unitOpts(U);

type SMass = { x: number; valore: string };
type SQuote = { da: number; a: number; testo: string; livello?: number };

function scene(alt: string, lunghezza: number, asse: number, masse: SMass[], quote: SQuote[]): SceneRef {
	return { type: 'masse-asse', data: { lunghezza, asse, masse, quote }, alt };
}
const kgText = (m: string) => `${lab(m)} kg`;
const mText = (x: string) => `${lab(x)} m`;
const round1 = (x: number) => Math.round(x * 10) / 10;

// ---------------------------------------------------------------------------
// Level 1: one point mass

function level1(rng: Rng): Built {
	const cm = rng.next() < 0.5;
	for (;;) {
		const m = dec2(rng, 0.11, 9.9), r = cm ? dec2(rng, 11, 99) : dec2(rng, 0.11, 2.0);
		const M = Number(m), R = cm ? Number(r) / 100 : Number(r);
		const I = M * R * R;
		const ans = r2(I);
		if (ans === null || I < 0.001) continue;
		const rq = cm ? qu(R.toFixed(2), 'm') : qu(r, 'm');
		return {
			prompt: "Trova il momento d'inerzia.",
			problem: textBlock(`Una pallina di massa ${pq(m, 'kg')} è fissata all'estremità di un'asticella leggera e gira a ${pq(r, cm ? 'cm' : 'm')} dall'asse di rotazione. Quanto vale il suo momento d'inerzia rispetto all'asse?`),
			solution: `I ${rel(I, ans)} ${qu(ans, U)}`,
			steps: [...(cm ? [`r = ${qu(r, 'cm')} = ${rq}`] : []), `I = m\\,r^2 = ${qu(m, 'kg')} \\cdot (${rq})^2 = ${res(I, ans, U)}`],
			// the distance not squared; the mass squared instead; the centimetres converted once (÷100, not ÷10000), or the half of a disc
			answer: choiceOf(rng, qOpt(ans, U), KGM2([r2(M * R), r2(M * M * R), cm ? r2(I * 100) : r2(I / 2)]), near(I, U)),
			params: { case: cm ? 'cm' : 'm', m, r },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: two or three point masses

function level2(rng: Rng): Built {
	const three = rng.next() < 0.5;
	for (;;) {
		const m1 = dec2(rng, 0.5, 9.9), m2 = dec2(rng, 0.5, 9.9), m3 = dec2(rng, 0.5, 9.9);
		const k1 = rng.int(2, 12), k2 = rng.int(2, 12), k3 = rng.int(k2 + 3, k2 + 10);
		if (k1 === k2) continue;
		const r1 = tenths(k1), r2s = tenths(k2), r3 = tenths(k3);
		const M1 = Number(m1), M2 = Number(m2), M3 = Number(m3), R1 = k1 / 10, R2 = k2 / 10, R3 = k3 / 10;
		const I = M1 * R1 * R1 + M2 * R2 * R2 + (three ? M3 * R3 * R3 : 0);
		const ans = r2(I);
		if (ans === null) continue;
		const sumM = M1 + M2 + (three ? M3 : 0);
		const lin = M1 * R1 + M2 * R2 + (three ? M3 * R3 : 0);
		const mean = (R1 + R2 + (three ? R3 : 0)) / (three ? 3 : 2);
		const far = three ? R3 : R2;
		const masses: SMass[] = [{ x: 0, valore: kgText(m1) }, { x: round1(R1 + R2), valore: kgText(m2) }];
		const quotes: SQuote[] = [{ da: 0, a: R1, testo: mText(r1) }, { da: R1, a: round1(R1 + R2), testo: mText(r2s) }];
		if (three) {
			masses.push({ x: round1(R1 + R3), valore: kgText(m3) });
			quotes.push({ da: R1, a: round1(R1 + R3), testo: mText(r3), livello: 1 });
		}
		const text = three
			? `Tre sfere di massa ${pq(m1, 'kg')}, ${pq(m2, 'kg')} e ${pq(m3, 'kg')} sono fissate a un'asta leggera perpendicolare all'asse di rotazione, a ${pq(r1, 'm')}, ${pq(r2s, 'm')} e ${pq(r3, 'm')} dall'asse. Quanto vale il momento d'inerzia del sistema rispetto all'asse?`
			: `Due sfere di massa ${pq(m1, 'kg')} e ${pq(m2, 'kg')} sono fissate a un'asta leggera perpendicolare all'asse di rotazione, a ${pq(r1, 'm')} e a ${pq(r2s, 'm')} dall'asse. Quanto vale il momento d'inerzia del sistema rispetto all'asse?`;
		const terms = [`${qu(m1, 'kg')} \\cdot (${qu(r1, 'm')})^2`, `${qu(m2, 'kg')} \\cdot (${qu(r2s, 'm')})^2`, ...(three ? [`${qu(m3, 'kg')} \\cdot (${qu(r3, 'm')})^2`] : [])];
		return {
			prompt: "Trova il momento d'inerzia.",
			problem: textBlock(text),
			solution: `I ${rel(I, ans)} ${qu(ans, U)}`,
			steps: [
				t("Ogni sfera contribuisce con la sua massa per il quadrato della sua distanza dall'asse:"),
				`I = ${three ? 'm_1 r_1^2 + m_2 r_2^2 + m_3 r_3^2' : 'm_1 r_1^2 + m_2 r_2^2'}`,
				...terms.map((x, i) => `${i ? '+' : 'I ='} ${x}`),
				`I = ${res(I, ans, U)}`,
			],
			// the distances not squared; all the mass at the mean distance; all the mass at the farthest distance
			answer: choiceOf(rng, qOpt(ans, U), KGM2([r2(lin), r2(sumM * mean * mean), r2(sumM * far * far)]), near(I, U)),
			params: three ? { case: 'tre', m: [m1, m2, m3], r: [r1, r2s, r3] } : { case: 'due', m: [m1, m2], r: [r1, r2s] },
			scene: scene(
				three
					? `Un'asta con tre sfere di ${lab(m1)}, ${lab(m2)} e ${lab(m3)} chilogrammi; l'asse di rotazione è perpendicolare all'asta, a ${lab(r1)} metri dalla prima sfera, a ${lab(r2s)} metri dalla seconda e a ${lab(r3)} metri dalla terza.`
					: `Un'asta con due sfere di ${lab(m1)} e ${lab(m2)} chilogrammi; l'asse di rotazione è perpendicolare all'asta, a ${lab(r1)} metri dalla prima sfera e a ${lab(r2s)} metri dalla seconda.`,
				round1(R1 + far),
				R1,
				masses,
				quotes,
			),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the axis moved

function level3(rng: Rng): Built {
	const onSphere = rng.next() < 0.5;
	for (;;) {
		const m1 = dec2(rng, 0.5, 9.9), m2 = dec2(rng, 0.5, 9.9);
		const kL = rng.int(6, 20), kd = onSphere ? 0 : rng.int(1, kL - 1);
		if (!onSphere && 2 * kd === kL) continue;
		const L = tenths(kL), d = tenths(kd), rest = tenths(kL - kd);
		const M1 = Number(m1), M2 = Number(m2), LL = kL / 10, D = kd / 10, R = (kL - kd) / 10;
		const I = M1 * D * D + M2 * R * R;
		const ans = r2(I);
		if (ans === null) continue;
		const start = `Due sfere di massa ${pq(m1, 'kg')} e ${pq(m2, 'kg')} sono fissate alle estremità di un'asta leggera lunga ${pq(L, 'm')}. L'asse di rotazione è perpendicolare all'asta e passa `;
		const end = ' Quanto vale il momento d\'inerzia del sistema rispetto all\'asse?';
		const masses: SMass[] = [{ x: 0, valore: kgText(m1) }, { x: LL, valore: kgText(m2) }];
		if (onSphere) {
			return {
				prompt: "Trova il momento d'inerzia.",
				problem: textBlock(`${start}per la prima sfera.${end}`),
				solution: `I ${rel(I, ans)} ${qu(ans, U)}`,
				steps: [
					t("La prima sfera sta sull'asse: la sua distanza è zero e non contribuisce. La seconda dista dall'asse tutta l'asta."),
					`I = m_1 r_1^2 + m_2 r_2^2 = 0 + ${qu(m2, 'kg')} \\cdot (${qu(L, 'm')})^2 = ${res(I, ans, U)}`,
				],
				// both masses at the distance L; both at half the rod (the axis taken at the centre); the wrong mass
				answer: choiceOf(rng, qOpt(ans, U), KGM2([r2((M1 + M2) * LL * LL), r2(((M1 + M2) * LL * LL) / 4), r2(M1 * LL * LL)]), near(I, U)),
				params: { case: 'su una sfera', m: [m1, m2], L, d: '0' },
				scene: scene(`Un'asta lunga ${lab(L)} metri con due sfere di ${lab(m1)} e ${lab(m2)} chilogrammi alle estremità; l'asse di rotazione, perpendicolare all'asta, passa per la sfera di ${lab(m1)} chilogrammi.`, LL, 0, masses, [{ da: 0, a: LL, testo: mText(L) }]),
			};
		}
		return {
			prompt: "Trova il momento d'inerzia.",
			problem: textBlock(`${start}a ${pq(d, 'm')} dalla prima sfera.${end}`),
			solution: `I ${rel(I, ans)} ${qu(ans, U)}`,
			steps: [
				t("Le distanze si misurano dall'asse:"),
				`r_1 = ${qu(d, 'm')} \\qquad r_2 = ${qu(L, 'm')} - ${qu(d, 'm')} = ${qu(rest, 'm')}`,
				`I = m_1 r_1^2 + m_2 r_2^2 = ${qu(m1, 'kg')} \\cdot (${qu(d, 'm')})^2 + ${qu(m2, 'kg')} \\cdot (${qu(rest, 'm')})^2`,
				`I = ${res(I, ans, U)}`,
			],
			// the two distances swapped; the axis taken at the centre; the second distance not subtracted (the whole rod)
			answer: choiceOf(rng, qOpt(ans, U), KGM2([r2(M1 * R * R + M2 * D * D), r2(((M1 + M2) * LL * LL) / 4), r2(M1 * D * D + M2 * LL * LL)]), near(I, U)),
			params: { case: 'interno', m: [m1, m2], L, d },
			scene: scene(
				`Un'asta lunga ${lab(L)} metri con due sfere di ${lab(m1)} e ${lab(m2)} chilogrammi alle estremità; l'asse di rotazione, perpendicolare all'asta, passa a ${lab(d)} metri dalla sfera di ${lab(m1)} chilogrammi.`,
				LL,
				D,
				masses,
				[{ da: 0, a: D, testo: mText(d) }, { da: 0, a: LL, testo: mText(L), livello: 1 }],
			),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: a body of the table

type Body = { case: string; text: (M: string, x: string) => string; k: number; kTex: string; sym: 'R' | 'L'; lo: number; hi: number; wrong: [number, number] };
const BODIES: Body[] = [
	{ case: 'disco', text: (M, R) => `Un disco pieno di massa ${M} e raggio ${R} ruota attorno al suo asse.`, k: 1 / 2, kTex: '\\dfrac{1}{2}\\,', sym: 'R', lo: 0.11, hi: 0.99, wrong: [1, 2 / 5] },
	{ case: 'anello', text: (M, R) => `Un anello sottile di massa ${M} e raggio ${R} ruota attorno al suo asse.`, k: 1, kTex: '', sym: 'R', lo: 0.11, hi: 0.99, wrong: [1 / 2, 2 / 5] },
	{ case: 'sfera', text: (M, R) => `Una sfera piena di massa ${M} e raggio ${R} ruota attorno a un asse che passa per il suo centro.`, k: 2 / 5, kTex: '\\dfrac{2}{5}\\,', sym: 'R', lo: 0.11, hi: 0.99, wrong: [1 / 2, 2 / 3] },
	{ case: 'asta centro', text: (M, L) => `Un'asta sottile di massa ${M} e lunga ${L} ruota attorno a un asse perpendicolare che passa per il suo centro.`, k: 1 / 12, kTex: '\\dfrac{1}{12}\\,', sym: 'L', lo: 0.5, hi: 2.0, wrong: [1 / 3, 1 / 2] },
	{ case: 'asta estremo', text: (M, L) => `Un'asta sottile di massa ${M} e lunga ${L} ruota attorno a un asse perpendicolare che passa per un suo estremo.`, k: 1 / 3, kTex: '\\dfrac{1}{3}\\,', sym: 'L', lo: 0.5, hi: 2.0, wrong: [1 / 12, 1 / 2] },
];

function level4(rng: Rng): Built {
	const b = rng.pick(BODIES);
	for (;;) {
		const m = dec2(rng, 0.5, 9.9), x = dec2(rng, b.lo, b.hi);
		const M = Number(m), X = Number(x);
		const I = b.k * M * X * X;
		const ans = r2(I);
		if (ans === null || I < 0.001) continue;
		return {
			prompt: "Trova il momento d'inerzia.",
			problem: textBlock(`${b.text(pq(m, 'kg'), pq(x, 'm'))} Quanto vale il suo momento d'inerzia rispetto a questo asse?`),
			solution: `I ${rel(I, ans)} ${qu(ans, U)}`,
			steps: [`I = ${b.kTex}M ${b.sym}^2 = ${b.kTex.replace('\\,', '')}${b.kTex ? ' \\cdot ' : ''}${qu(m, 'kg')} \\cdot (${qu(x, 'm')})^2 = ${res(I, ans, U)}`],
			// the formula of another body or of the other axis, twice; the length not squared
			answer: choiceOf(rng, qOpt(ans, U), KGM2([r2(b.wrong[0] * M * X * X), r2(b.wrong[1] * M * X * X), r2(b.k * M * X)]), near(I, U)),
			params: { case: b.case, M: m, x },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: Huygens-Steiner

type Shifted = { case: string; text: (M: string, R: string) => string; k: number; kTex: string };
const SHIFTED: Shifted[] = [
	{ case: 'disco', text: (M, R) => `Un disco pieno di massa ${M} e raggio ${R} ruota attorno a un asse perpendicolare al disco che passa per un punto del bordo.`, k: 1 / 2, kTex: '\\dfrac{1}{2}\\,' },
	{ case: 'anello', text: (M, R) => `Un anello sottile di massa ${M} e raggio ${R} ruota attorno a un asse perpendicolare al suo piano che passa per un punto dell'anello.`, k: 1, kTex: '' },
	{ case: 'sfera', text: (M, R) => `Una sfera piena di massa ${M} e raggio ${R} ruota attorno a un asse tangente alla sua superficie.`, k: 2 / 5, kTex: '\\dfrac{2}{5}\\,' },
];

function level5(rng: Rng): Built {
	const pickCase = rng.int(0, 3);
	for (;;) {
		const m = dec2(rng, 0.5, 9.9);
		const M = Number(m);
		if (pickCase < 3) {
			const b = SHIFTED[pickCase];
			const r = dec2(rng, 0.11, 0.99);
			const R = Number(r);
			const Icm = b.k * M * R * R, I = Icm + M * R * R;
			const ans = r2(I);
			if (ans === null || I < 0.001) continue;
			return {
				prompt: "Trova il momento d'inerzia.",
				problem: textBlock(`${b.text(pq(m, 'kg'), pq(r, 'm'))} Quanto vale il suo momento d'inerzia rispetto a questo asse?`),
				solution: `I ${rel(I, ans)} ${qu(ans, U)}`,
				steps: [
					t("L'asse è parallelo a quello per il centro di massa, a distanza d uguale al raggio:"),
					`I_{cm} = ${b.kTex}M R^2 = ${cutQ(Icm, U)}`,
					`I = I_{cm} + M\\,d^2 = ${cutQ(Icm, U)} + ${qu(m, 'kg')} \\cdot (${qu(r, 'm')})^2 = ${res(I, ans, U)}`,
				],
				// I_cm alone; M d² alone (when it differs); the distance not squared
				answer: choiceOf(rng, qOpt(ans, U), KGM2([r2(Icm), r2(M * R * R), r2(Icm + M * R)]), near(I, U)),
				params: { case: b.case, M: m, R: r },
			};
		}
		const kL = rng.int(6, 20), kd = rng.int(1, 9);
		if (2 * kd >= kL) continue;
		const L = tenths(kL), d = tenths(kd);
		const LL = kL / 10, D = kd / 10;
		const Icm = (M * LL * LL) / 12, I = Icm + M * D * D;
		const ans = r2(I);
		if (ans === null || I < 0.001) continue;
		return {
			prompt: "Trova il momento d'inerzia.",
			problem: textBlock(`Un'asta sottile di massa ${pq(m, 'kg')} e lunga ${pq(L, 'm')} ruota attorno a un asse perpendicolare che passa a ${pq(d, 'm')} dal suo centro. Quanto vale il suo momento d'inerzia rispetto a questo asse?`),
			solution: `I ${rel(I, ans)} ${qu(ans, U)}`,
			steps: [
				t("L'asse è parallelo a quello per il centro di massa, che è il centro dell'asta:"),
				`I_{cm} = \\dfrac{1}{12}\\,M L^2 = \\dfrac{1}{12} \\cdot ${qu(m, 'kg')} \\cdot (${qu(L, 'm')})^2 = ${cutQ(Icm, U)}`,
				`I = I_{cm} + M\\,d^2 = ${cutQ(Icm, U)} + ${qu(m, 'kg')} \\cdot (${qu(d, 'm')})^2 = ${res(I, ans, U)}`,
			],
			// I_cm alone; started from the end (ML²/3 + Md²); M d² alone
			answer: choiceOf(rng, qOpt(ans, U), KGM2([r2(Icm), r2((M * LL * LL) / 3 + M * D * D), r2(M * D * D)]), near(I, U)),
			params: { case: 'asta', M: m, L, d },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: a body made of parts

function level6(rng: Rng): Built {
	const carousel = rng.next() < 0.5;
	for (;;) {
		if (carousel) {
			const M = dec2(rng, 41, 99), R = dec2(rng, 1.1, 1.6), m = dec2(rng, 11, 45), r = dec2(rng, 0.5, 1.6);
			const MM = Number(M), RR = Number(R), mm = Number(m), rr = Number(r);
			if (rr > RR) continue;
			const Id = 0.5 * MM * RR * RR, Ib = mm * rr * rr, I = Id + Ib;
			const ans = r2(I);
			if (ans === null) continue;
			return {
				prompt: "Trova il momento d'inerzia.",
				problem: textBlock(`La piattaforma di una giostra è un disco pieno di massa ${pq(M, 'kg')} e raggio ${pq(R, 'm')}, che gira attorno al suo asse. Un bambino di ${pq(m, 'kg')} è seduto a ${pq(r, 'm')} dal centro. Quanto vale il momento d'inerzia della giostra con il bambino?`),
				solution: `I ${rel(I, ans)} ${qu(ans, U)}`,
				steps: [
					`I_{disco} = \\dfrac{1}{2}\\,M R^2 = \\dfrac{1}{2} \\cdot ${qu(M, 'kg')} \\cdot (${qu(R, 'm')})^2 = ${cutQ(Id, U)}`,
					t('Il bambino è una massa puntiforme sullo stesso asse:'),
					`I_{bambino} = m\\,r^2 = ${qu(m, 'kg')} \\cdot (${qu(r, 'm')})^2 = ${cutQ(Ib, U)}`,
					`I = I_{disco} + I_{bambino} = ${res(I, ans, U)}`,
				],
				// the disc alone; the child counted as part of the disc; the child with the factor of the disc
				answer: choiceOf(rng, qOpt(ans, U), KGM2([r2(Id), r2(0.5 * (MM + mm) * RR * RR), r2(Id + 0.5 * Ib)]), near(I, U)),
				params: { case: 'giostra', M, R, m, r },
			};
		}
		const M = dec2(rng, 0.5, 5.0), m = dec2(rng, 0.5, 9.9);
		const kL = rng.int(3, 10) * 2;
		const L = tenths(kL), half = tenths(kL / 2);
		const MM = Number(M), mm = Number(m), LL = kL / 10;
		const Ia = (MM * LL * LL) / 12, Is = 2 * mm * (LL / 2) ** 2, I = Ia + Is;
		const ans = r2(I);
		if (ans === null) continue;
		return {
			prompt: "Trova il momento d'inerzia.",
			problem: textBlock(`Un manubrio è fatto di un'asta sottile di massa ${pq(M, 'kg')} e lunga ${pq(L, 'm')}, con due sfere di ${pq(m, 'kg')} ciascuna alle estremità. Ruota attorno a un asse perpendicolare all'asta che passa per il suo centro. Quanto vale il suo momento d'inerzia?`),
			solution: `I ${rel(I, ans)} ${qu(ans, U)}`,
			steps: [
				`I_{asta} = \\dfrac{1}{12}\\,M L^2 = \\dfrac{1}{12} \\cdot ${qu(M, 'kg')} \\cdot (${qu(L, 'm')})^2 = ${cutQ(Ia, U)}`,
				t("Ogni sfera dista dall'asse metà dell'asta:"),
				`I_{sfere} = 2\\,m\\,r^2 = 2 \\cdot ${qu(m, 'kg')} \\cdot (${qu(half, 'm')})^2 = ${cutQ(Is, U)}`,
				`I = I_{asta} + I_{sfere} = ${res(I, ans, U)}`,
			],
			// the spheres alone (the rod forgotten); one sphere only; the spheres at the whole length from the axis
			answer: choiceOf(rng, qOpt(ans, U), KGM2([r2(Is), r2(Ia + Is / 2), r2(Ia + 2 * mm * LL * LL)]), near(I, U)),
			params: { case: 'manubrio', M, L, m },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if ((sample.level === 2 || sample.level === 3) && sample.scene?.type !== 'masse-asse') v.push('manca la scena');
	return v;
}

export const fisMomentoInerzia: Generator = {
	id: ID,
	title: "Il momento d'inerzia",
	levels: {
		1: { label: 'Una massa puntiforme', constraints: ['I = mr²', 'metà dei casi con la distanza in centimetri'] },
		2: { label: 'Più masse puntiformi', constraints: ["due o tre sfere su un'asta leggera, a distanze diverse dall'asse", 'scena masse-asse'] },
		3: { label: 'Un altro asse', constraints: ["due sfere alle estremità di un'asta, asse per una sfera o a una distanza data", 'scena masse-asse'] },
		4: { label: 'Corpi estesi', constraints: ['disco, anello, sfera piena, asta per il centro, asta per un estremo'] },
		5: { label: 'Teorema di Huygens-Steiner', constraints: ['disco, anello o sfera con asse a distanza R dal centro, asta con asse a distanza d'] },
		6: { label: 'Corpi composti', constraints: ['disco con una massa puntiforme, o asta con due sfere alle estremità'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisMomentoInerzia;
