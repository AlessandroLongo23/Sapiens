/**
 * Le forze apparenti: forza centrifuga e forza di Coriolis. Spec: specs/exercises/fis-forze-apparenti.md
 *
 * Seven levels from the lesson (docs/lezioni/fisica/riscritte/75-fis-forze-apparenti.md), each one step harder: the
 * apparent force m A on a body in a braking or starting bus; the hardest braking a suitcase stands without sliding,
 * A = μs g, or the coefficient from it; the floor's force on a parcel in an accelerating lift, m (g ± A); the
 * centrifugal force m ω² r from the angular velocity; the same from the period or from the turns per minute; the
 * coin on a turntable, the greatest angular velocity or the greatest distance from the axis; which way the Coriolis
 * force deflects, on a platform and on the Earth. g = 9,8 m/s², two significant figures. Distractors from the
 * lesson's warnings: the weight for the apparent force, the mass left in where it cancels, the sign of A swapped,
 * ω not squared, the turns per minute not converted, the centrifugal force for the Coriolis force.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { type Built, G, checkBasic, cut, cutQ, dec2, decTex, generateWith, pick2, pickNum, pickWords, pqU, qu, r2, rel, res, t } from '../fis-riferimenti';

export const ID = 'fis-forze-apparenti';

const coeff = (rng: Rng, lo: number, hi: number) => (rng.int(lo, hi) / 100).toFixed(2);
const mu = (c: string) => `$\\mu_s = ${decTex(c)}$`;

// ---------------------------------------------------------------------------
// Level 1: the apparent force

function level1(rng: Rng): Built {
	const braking = rng.next() < 0.5;
	for (;;) {
		const A = dec2(rng, 1.1, 4.9), m = dec2(rng, 2.0, 9.9);
		const a = Number(A), M = Number(m);
		const x = M * a;
		const ans = r2(x);
		if (ans === null) continue;
		return {
			prompt: 'Trova la forza apparente.',
			problem: textBlock(`Un autobus ${braking ? 'frena' : 'parte'} con un'accelerazione di modulo ${pqU(A, 'm/s^2')}. Quanto vale, nel sistema dell'autobus, la forza apparente su uno zaino di ${pqU(m, 'kg')} appoggiato su un sedile?`),
			solution: `F_{app} ${rel(x, ans)} ${qu(ans, 'N')}`,
			steps: [
				t("In un sistema che ha accelerazione A la forza apparente ha modulo m A e verso opposto all'accelerazione del sistema."),
				`F_{app} = m\\,A = ${qu(m, 'kg')} \\cdot ${qu(A, 'm/s^2')} = ${res(x, ans, 'N')}`,
				t(braking ? "L'autobus frena, quindi la sua accelerazione è diretta all'indietro: la forza apparente è diretta in avanti." : "L'autobus parte, quindi la sua accelerazione è diretta in avanti: la forza apparente è diretta all'indietro."),
			],
			// the weight; the ratio; g − A and g + A for A
			answer: pick2(rng, ans, 'N', x, [M * G, M / a, M * (G - a), M * (G + a)]),
			params: { case: braking ? 'frena' : 'parte', A, m },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the suitcase that slides

function level2(rng: Rng): Built {
	if (rng.next() < 0.5) {
		for (;;) {
			const c = coeff(rng, 15, 60), m = dec2(rng, 5.0, 25);
			const k = Number(c), M = Number(m);
			const x = k * G;
			const ans = r2(x);
			if (ans === null) continue;
			return {
				prompt: 'Trova la frenata massima.',
				problem: textBlock(`Una valigia di ${pqU(m, 'kg')} è appoggiata sul pavimento di un autobus; il coefficiente di attrito statico è ${mu(c)}. Qual è la frenata più forte che l'autobus può fare senza che la valigia scivoli?`),
				solution: `A ${rel(x, ans)} ${qu(ans, 'm/s^2')}`,
				steps: [
					t("Nel sistema dell'autobus la valigia resta ferma finché l'attrito statico bilancia la forza apparente:"),
					`m\\,A \\le \\mu_s\\,m\\,g \\quad\\Rightarrow\\quad A \\le \\mu_s\\,g`,
					`A = ${decTex(c)} \\cdot 9{,}8\\,\\text{m/s}^2 = ${res(x, ans, 'm/s^2')}`,
					t('La massa si semplifica: non serve.'),
				],
				// the mass left in; g over μ; μ times the mass; μ over g
				answer: pick2(rng, ans, 'm/s^2', x, [k * M * G, G / k, k * M, k / G]),
				params: { case: 'frenata', mu: c, m },
			};
		}
	}
	for (;;) {
		const A = dec2(rng, 1.5, 5.9), m = dec2(rng, 5.0, 25);
		const a = Number(A), M = Number(m);
		const x = a / G;
		const ans = r2(x);
		if (ans === null) continue;
		return {
			prompt: 'Trova il coefficiente di attrito statico.',
			problem: textBlock(`Una valigia di ${pqU(m, 'kg')}, appoggiata sul pavimento di un autobus, comincia a scivolare quando la frenata supera ${pqU(A, 'm/s^2')}. Quanto vale il coefficiente di attrito statico tra la valigia e il pavimento?`),
			solution: `\\mu_s ${rel(x, ans)} ${decTex(ans)}`,
			steps: [
				t("Al limite la forza apparente è uguale al massimo attrito statico, e la massa si semplifica:"),
				`m\\,A = \\mu_s\\,m\\,g \\quad\\Rightarrow\\quad \\mu_s = \\dfrac{A}{g}`,
				`\\mu_s = \\dfrac{${qu(A, 'm/s^2')}}{9{,}8\\,\\text{m/s}^2} = ${cut(x)} ${Math.abs(x - Number(ans)) < 1e-9 ? '' : `\\approx ${decTex(ans)}`}`.trim(),
			],
			// the ratio upside down; the mass left in
			answer: pickNum(rng, ans, x, [G / a, (a * M) / G, a / M]),
			params: { case: 'coefficiente', A, m },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the parcel in the lift

function level3(rng: Rng): Built {
	const up = rng.next() < 0.5;
	for (;;) {
		const m = dec2(rng, 1.1, 7.9), A = dec2(rng, 1.1, 3.5);
		const M = Number(m), a = Number(A);
		const g1 = up ? G + a : G - a;
		const x = M * g1;
		const ans = r2(x);
		if (ans === null) continue;
		return {
			prompt: 'Trova la forza del pavimento.',
			problem: textBlock(`Un pacco di ${pqU(m, 'kg')} è sul pavimento di un ascensore che accelera verso ${up ? "l'alto" : 'il basso'} con ${pqU(A, 'm/s^2')}. Con quale forza il pavimento sostiene il pacco?`),
			solution: `F_v ${rel(x, ans)} ${qu(ans, 'N')}`,
			steps: [
				t(up ? "Nel sistema dell'ascensore il pacco è fermo. La forza apparente è verso il basso, opposta all'accelerazione, e si somma al peso:" : "Nel sistema dell'ascensore il pacco è fermo. La forza apparente è verso l'alto, opposta all'accelerazione, e aiuta il pavimento:"),
				up ? `F_v = m\\,g + m\\,A = m\\,(g + A)` : `F_v + m\\,A = m\\,g \\quad\\Rightarrow\\quad F_v = m\\,(g - A)`,
				`F_v = ${qu(m, 'kg')} \\cdot ${cutQ(g1, 'm/s^2')} = ${res(x, ans, 'N')}`,
			],
			// the sign of A swapped; the weight; the apparent force alone
			answer: pick2(rng, ans, 'N', x, [M * (up ? G - a : G + a), M * G, M * a]),
			params: { case: up ? 'alto' : 'basso', m, A },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the centrifugal force from ω

function level4(rng: Rng): Built {
	for (;;) {
		const w = dec2(rng, 1.5, 6.0), m = rng.next() < 0.5 ? dec2(rng, 0.11, 0.99) : dec2(rng, 1.1, 5.0), r = dec2(rng, 0.5, 3.0);
		const W = Number(w), M = Number(m), R = Number(r);
		if (R > 0.75 && R < 1.3) continue;
		const x = M * W * W * R;
		const ans = r2(x);
		if (ans === null) continue;
		return {
			prompt: 'Trova la forza centrifuga.',
			problem: textBlock(`Una piattaforma ruota con velocità angolare ${pqU(w, 'rad/s')}. Su di essa è fermo un oggetto di ${pqU(m, 'kg')}, a ${pqU(r, 'm')} dall'asse. Quanto vale la forza centrifuga sull'oggetto, nel sistema della piattaforma?`),
			solution: `F_{cf} ${rel(x, ans)} ${qu(ans, 'N')}`,
			steps: [t("Nel sistema che ruota la forza centrifuga è diretta verso l'esterno e vale"), `F_{cf} = m\\,\\omega^2\\,r = ${qu(m, 'kg')} \\cdot (${qu(w, 'rad/s')})^2 \\cdot ${qu(r, 'm')} = ${res(x, ans, 'N')}`],
			// ω not squared; divided by r; r squared for ω squared; both squared
			answer: pick2(rng, ans, 'N', x, [M * W * R, (M * W * W) / R, M * W * R * R, M * W * W * R * R]),
			params: { w, m, r },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the centrifugal force from the period or from the turns per minute

function level5(rng: Rng): Built {
	if (rng.next() < 0.5) {
		for (;;) {
			const T = dec2(rng, 3.0, 9.9), m = dec2(rng, 1.1, 9.9), r = dec2(rng, 1.5, 4.0);
			const P = Number(T), M = Number(m), R = Number(r);
			const W = (2 * Math.PI) / P;
			const x = M * W * W * R;
			const ans = r2(x);
			if (ans === null) continue;
			return {
				prompt: 'Trova la forza centrifuga.',
				problem: textBlock(`Una giostra fa un giro ogni ${pqU(T, 's')}. Su un sedile, a ${pqU(r, 'm')} dall'asse, è appoggiato uno zaino di ${pqU(m, 'kg')}. Quanto vale la forza centrifuga sullo zaino, nel sistema della giostra?`),
				solution: `F_{cf} ${rel(x, ans)} ${qu(ans, 'N')}`,
				steps: [`\\omega = \\dfrac{2\\pi}{T} = \\dfrac{2\\pi}{${qu(T, 's')}} = ${cutQ(W, 'rad/s')}`, `F_{cf} = m\\,\\omega^2\\,r = ${qu(m, 'kg')} \\cdot (${cutQ(W, 'rad/s')})^2 \\cdot ${qu(r, 'm')} = ${res(x, ans, 'N')}`],
				// 2π forgotten; ω not squared; divided by r; the period for ω
				answer: pick2(rng, ans, 'N', x, [(M * R) / (P * P), M * W * R, (M * W * W) / R, M * P * P * R]),
				params: { case: 'periodo', T, m, r },
			};
		}
	}
	for (;;) {
		const n = String(rng.pick([33, 45, 78, 24, 36, 54, 66, 72, 84, 96])), m = dec2(rng, 0.11, 0.99), r = dec2(rng, 0.11, 0.45);
		const N = Number(n), M = Number(m), R = Number(r);
		const f = N / 60;
		const W = 2 * Math.PI * f;
		const x = M * W * W * R;
		const ans = r2(x);
		if (ans === null) continue;
		return {
			prompt: 'Trova la forza centrifuga.',
			problem: textBlock(`Un piatto fa $${n}$ giri al minuto. Su di esso è fermo un oggetto di ${pqU(m, 'kg')}, a ${pqU(r, 'm')} dall'asse. Quanto vale la forza centrifuga sull'oggetto, nel sistema del piatto?`),
			solution: `F_{cf} ${rel(x, ans)} ${qu(ans, 'N')}`,
			steps: [
				`f = \\dfrac{${n}}{60\\,\\text{s}} = ${cutQ(f, 'Hz')} \\qquad \\omega = 2\\pi\\,f = ${cutQ(W, 'rad/s')}`,
				`F_{cf} = m\\,\\omega^2\\,r = ${qu(m, 'kg')} \\cdot (${cutQ(W, 'rad/s')})^2 \\cdot ${qu(r, 'm')} = ${res(x, ans, 'N')}`,
			],
			// 2π forgotten; the minutes not converted; ω not squared; the turns per minute as ω
			answer: pick2(rng, ans, 'N', x, [M * f * f * R, M * (2 * Math.PI * N) ** 2 * R, M * W * R, M * N * N * R]),
			params: { case: 'giri', n, m, r },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: the coin on the turntable

function level6(rng: Rng): Built {
	if (rng.next() < 0.5) {
		for (;;) {
			const c = coeff(rng, 15, 60), r = dec2(rng, 0.11, 0.45);
			const k = Number(c), R = Number(r);
			const x = Math.sqrt((k * G) / R);
			const ans = r2(x);
			if (ans === null) continue;
			return {
				prompt: 'Trova la velocità angolare massima.',
				problem: textBlock(`Una moneta è appoggiata su un piatto che ruota, a ${pqU(r, 'm')} dall'asse; il coefficiente di attrito statico è ${mu(c)}. Fino a quale velocità angolare la moneta resta ferma sul piatto?`),
				solution: `\\omega ${rel(x, ans)} ${qu(ans, 'rad/s')}`,
				steps: [
					t("Nel sistema del piatto la moneta resta ferma finché l'attrito statico bilancia la forza centrifuga:"),
					`m\\,\\omega^2\\,r \\le \\mu_s\\,m\\,g \\quad\\Rightarrow\\quad \\omega \\le \\sqrt{\\dfrac{\\mu_s\\,g}{r}}`,
					`\\omega = \\sqrt{\\dfrac{${decTex(c)} \\cdot 9{,}8\\,\\text{m/s}^2}{${qu(r, 'm')}}} = ${res(x, ans, 'rad/s')}`,
				],
				// r multiplied; the root forgotten; μ in the denominator; g in the denominator
				answer: pick2(rng, ans, 'rad/s', x, [Math.sqrt(k * G * R), (k * G) / R, Math.sqrt(G / (k * R)), Math.sqrt(k / (G * R))]),
				params: { case: 'omega', mu: c, r },
			};
		}
	}
	for (;;) {
		const c = coeff(rng, 15, 60), w = dec2(rng, 2.0, 9.9);
		const k = Number(c), W = Number(w);
		const x = (k * G) / (W * W);
		const ans = r2(x);
		if (ans === null) continue;
		return {
			prompt: "Trova la distanza massima dall'asse.",
			problem: textBlock(`Un piatto ruota a ${pqU(w, 'rad/s')}; tra il piatto e una moneta il coefficiente di attrito statico è ${mu(c)}. Fino a quale distanza dall'asse la moneta, appoggiata sul piatto, resta ferma?`),
			solution: `r ${rel(x, ans)} ${qu(ans, 'm')}`,
			steps: [
				t("Nel sistema del piatto la moneta resta ferma finché l'attrito statico bilancia la forza centrifuga, che cresce con la distanza dall'asse:"),
				`m\\,\\omega^2\\,r \\le \\mu_s\\,m\\,g \\quad\\Rightarrow\\quad r \\le \\dfrac{\\mu_s\\,g}{\\omega^2}`,
				`r = \\dfrac{${decTex(c)} \\cdot 9{,}8\\,\\text{m/s}^2}{(${qu(w, 'rad/s')})^2} = ${res(x, ans, 'm')}`,
			],
			// ω not squared; the ratio upside down; a root too many; g forgotten
			answer: pick2(rng, ans, 'm', x, [(k * G) / W, (W * W) / (k * G), Math.sqrt(k * G) / W, k / (W * W)]),
			params: { case: 'raggio', mu: c, w },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 7: which way the Coriolis force deflects

const SIDES: [string, string][] = [
	['destra', 'verso destra'],
	['sinistra', 'verso sinistra'],
	['nulla', 'è nulla'],
	['esterno', "verso l'esterno"],
];
const MOVERS = [
	{ name: 'Un vento', pron: 'lo' },
	{ name: 'Una corrente marina', pron: 'la' },
	{ name: 'Un proiettile a lunga gittata', pron: 'lo' },
];

function level7(rng: Rng): Built {
	const p = rng.next();
	const w = dec2(rng, 0.2, 0.9);
	if (p < 0.4) {
		const ccw = rng.next() < 0.5;
		return {
			prompt: 'Da che parte devia la palla?',
			problem: textBlock(`Una piattaforma ruota in senso ${ccw ? 'antiorario' : 'orario'}, vista dall'alto, a ${pqU(w, 'rad/s')}. Una palla viene lanciata sul suo piano liscio. Vista dalla piattaforma, da che parte la forza di Coriolis devia la palla, rispetto al verso del suo moto?`),
			solution: t(ccw ? 'Verso destra.' : 'Verso sinistra.'),
			steps: [
				t('In un sistema che ruota in senso antiorario la forza di Coriolis devia i corpi in moto verso destra rispetto al verso del moto; in senso orario, verso sinistra.'),
				t(ccw ? 'La piattaforma ruota in senso antiorario: la palla curva verso destra.' : 'La piattaforma ruota in senso orario: la palla curva verso sinistra.'),
			],
			answer: pickWords(rng, ccw ? 'destra' : 'sinistra', SIDES),
			params: { case: 'piattaforma' },
		};
	}
	if (p < 0.8) {
		const north = rng.next() < 0.5;
		const mover = rng.pick(MOVERS);
		const dir = rng.pick(['nord', 'sud', 'est', 'ovest']);
		return {
			prompt: 'Da che parte devia?',
			problem: textBlock(`${mover.name} si muove verso ${dir} nell'emisfero ${north ? 'nord' : 'sud'}, lontano dall'equatore. Da che parte ${mover.pron} devia la forza di Coriolis, rispetto al verso del moto?`),
			solution: t(north ? 'Verso destra.' : 'Verso sinistra.'),
			steps: [
				t("Vista da sopra il polo nord la Terra ruota in senso antiorario, vista da sopra il polo sud in senso orario: nell'emisfero nord i corpi in moto sono deviati verso destra, nell'emisfero sud verso sinistra."),
				t(north ? "Siamo nell'emisfero nord: la deviazione è verso destra, qualunque sia la direzione del moto." : "Siamo nell'emisfero sud: la deviazione è verso sinistra, qualunque sia la direzione del moto."),
			],
			answer: pickWords(rng, north ? 'destra' : 'sinistra', SIDES),
			params: { case: 'terra' },
		};
	}
	const ccw = rng.next() < 0.5;
	return {
		prompt: "Com'è diretta la forza di Coriolis sulla cassa?",
		problem: textBlock(`Una piattaforma ruota in senso ${ccw ? 'antiorario' : 'orario'}, vista dall'alto, a ${pqU(w, 'rad/s')}. Una cassa è ferma sulla piattaforma. Nel sistema della piattaforma, come è diretta la forza di Coriolis sulla cassa?`),
		solution: t('È nulla.'),
		steps: [
			t('La forza di Coriolis agisce solo sui corpi che si muovono rispetto al sistema che ruota.'),
			t("La cassa è ferma rispetto alla piattaforma: la forza di Coriolis è nulla. Verso l'esterno è diretta la forza centrifuga, che è un'altra forza apparente."),
		],
		answer: pickWords(rng, 'nulla', SIDES),
		params: { case: 'fermo' },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

const check = (sample: Sample): string[] => checkBasic(sample);

export const fisForzeApparenti: Generator = {
	id: ID,
	title: 'Le forze apparenti: forza centrifuga e forza di Coriolis',
	levels: {
		1: { label: 'La forza apparente', constraints: ['autobus che frena o che parte, metà ciascuno', 'zaino da 2,0 a 9,9 kg'] },
		2: { label: 'La valigia che scivola', constraints: ['frenata massima o coefficiente di attrito, metà ciascuno', 'la massa è un dato in più'] },
		3: { label: 'Il pacco in ascensore', constraints: ["accelerazione verso l'alto o verso il basso, metà ciascuno", 'forza sotto 100 N'] },
		4: { label: 'La forza centrifuga', constraints: ['velocità angolare da 1,5 a 6,0 rad/s', 'distanza non compresa tra 0,75 e 1,3 m'] },
		5: { label: 'La centrifuga dal periodo o dai giri al minuto', constraints: ['periodo o giri al minuto, metà ciascuno'] },
		6: { label: 'La moneta sul piatto che ruota', constraints: ['velocità angolare massima o distanza massima, metà ciascuno'] },
		7: { label: 'Da che parte devia la forza di Coriolis', constraints: ['piattaforma 40%, Terra 40%, corpo fermo 20%'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisForzeApparenti;
