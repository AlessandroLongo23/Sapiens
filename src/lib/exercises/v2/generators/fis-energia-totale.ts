/**
 * Forze dissipative e conservazione dell'energia totale. Spec: specs/exercises/fis-energia-totale.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/64-fis-energia-totale.md), each one step harder: the work
 * of kinetic friction on a level floor, −μd m g d; the speed after a stretch of floor, √(v² − 2 μd g d) (the stopping
 * distance is level 5 of fis-energia-cinetica, lesson 61); the energy dissipated on a
 * curved ramp, m g h − ½ m v²; the speed at the foot of an incline with friction, √(2 g l (sin α − μd cos α)); the
 * efficiency of a winch, m g h / E; the energy spent from the efficiency, E_utile / η. g = 9,8 m/s², data with two
 * significant figures, coefficients with two decimals, angles in whole degrees; answers with two significant figures
 * (efficiencies as whole percentages). Distractors from the lesson's warnings: the sign of the work, the pressing force
 * on the incline taken as m g, the ratio upside down, multiplying by η instead of dividing.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { decTex, pq, qOpt, qty, t } from '../vettori';
import { type Built, checkCommon, coeff, cosD, generateWith, r2, sinD, tanD } from '../fisica-equilibrio';
import { G, J, choose, cut, data2, fallback, lab, pista, r2s, uOpts } from '../fis-energia';

export const ID = 'fis-energia-totale';

const MS = (s: string) => qty(s, 'm/s');
const MG = (m: string) => `${qty(m, 'kg')} \\cdot 9{,}8\\,\\text{m/s}^2`;
const inRange = (x: number) => Math.abs(x) >= 1 && Math.abs(x) < 99.5;
const pct = (s: string): ChoiceOption => ({ latex: `${s}\\%`, values: [s] });
/** Whole percentages (a ratio upside down may go over 100%), skipping those under 1% or too close to a half. */
const pcts = (xs: number[]) => xs.filter((x) => x * 100 >= 1 && Math.abs(((x * 100) % 1) - 0.5) > 1e-6).map((x) => pct(String(Math.round(x * 100))));

// ---------------------------------------------------------------------------
// Level 1: the work of friction

function level1(rng: Rng): Built {
	for (;;) {
		const m = data2(rng, 1.1, 9.9);
		const d = data2(rng, 0.5, 9.9);
		const mu = coeff(rng, 10, 90);
		const exact = -Number(mu) * Number(m) * G * Number(d);
		const ans = r2(exact);
		if (ans === null || !inRange(exact)) continue;
		return {
			prompt: "Trova il lavoro dell'attrito.",
			problem: textBlock(`Una cassa di ${pq(m, 'kg')} scivola per ${pq(d, 'm')} su un pavimento orizzontale; tra la cassa e il pavimento $\\mu_d = ${decTex(mu)}$. Quanto lavoro compie l'attrito?`),
			solution: `W_{attrito} \\approx ${J(ans)}`,
			steps: [
				`F_d = \\mu_d\\, m g = ${decTex(mu)} \\cdot ${MG(m)} = ${cut(Number(mu) * Number(m) * G)}\\,\\text{N}`,
				`W_{attrito} = -F_d \\cdot d = -${cut(Number(mu) * Number(m) * G)}\\,\\text{N} \\cdot ${qty(d, 'm')} = ${J(cut(exact))} \\approx ${J(ans)}`,
				t("Negativo: l'attrito è opposto allo spostamento."),
			],
			// the sign; g forgotten; the mass forgotten
			answer: choose(rng, qOpt(ans, 'J'), uOpts(r2s([-exact, -Number(mu) * Number(m) * Number(d), -Number(mu) * G * Number(d)]), 'J'), fallback(exact, 'J')),
			params: { m, d, mu },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the speed after a stretch with friction

function level2(rng: Rng): Built {
	for (;;) {
		const v = data2(rng, 2.0, 15);
		const mu = coeff(rng, 10, 90);
		const d = data2(rng, 0.5, 30);
		const vn = Number(v), un = Number(mu), dn = Number(d);
		const lost = 2 * un * G * dn;
		if (lost > 0.91 * vn * vn || lost < 0.19 * vn * vn) continue;
		const exact = Math.sqrt(vn * vn - lost);
		const ans = r2(exact);
		if (ans === null) continue;
		return {
			prompt: 'Trova la velocità.',
			problem: textBlock(`Una cassa scivola sul pavimento a ${pq(v, 'm/s')}; tra la cassa e il pavimento $\\mu_d = ${decTex(mu)}$. Con che velocità si muove dopo ${pq(d, 'm')}?`),
			solution: `v_f \\approx ${MS(ans)}`,
			steps: [
				t('Sul piano orizzontale: ') + ' \\tfrac{1}{2} m v_f^2 = \\tfrac{1}{2} m v^2 - \\mu_d\\, m g\\, d',
				t('La massa si semplifica: ') + ' v_f^2 = v^2 - 2 \\mu_d\\, g\\, d',
				`v_f = \\sqrt{(${MS(v)})^2 - 2 \\cdot ${decTex(mu)} \\cdot 9{,}8\\,\\text{m/s}^2 \\cdot ${qty(d, 'm')}} = ${MS(cut(exact))} \\approx ${MS(ans)}`,
			],
			// the speeds subtracted; the sign of the work; the 2 forgotten
			answer: choose(rng, qOpt(ans, 'm/s'), uOpts(r2s([vn - Math.sqrt(lost), Math.sqrt(vn * vn + lost), Math.sqrt(vn * vn - lost / 2)]), 'm/s'), fallback(exact, 'm/s')),
			params: { v, mu, d },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the energy dissipated on a ramp

function level3(rng: Rng): Built {
	for (;;) {
		const m = data2(rng, 0.11, 9.9);
		const h = data2(rng, 0.3, 4.9);
		const v = data2(rng, 1.1, 9.9);
		const mn = Number(m), hn = Number(h), vn = Number(v);
		const vmax = Math.sqrt(2 * G * hn);
		if (vn > 0.9 * vmax || vn < 0.3 * vmax) continue;
		const Ei = mn * G * hn, Kf = 0.5 * mn * vn * vn;
		const exact = Ei - Kf;
		const ans = r2(exact);
		if (ans === null || !inRange(exact)) continue;
		const noHalf = Ei - mn * vn * vn;
		return {
			prompt: "Trova l'energia dissipata.",
			problem: textBlock(`Un blocco di ${pq(m, 'kg')} parte da fermo dalla cima di una rampa curva alta ${pq(h, 'm')} e arriva in fondo a ${pq(v, 'm/s')}. Quanta energia è stata dissipata dagli attriti?`),
			solution: `E_i - E_f \\approx ${J(ans)}`,
			steps: [
				`E_i = m g h = ${MG(m)} \\cdot ${qty(h, 'm')} = ${J(cut(Ei))}`,
				`E_f = \\tfrac{1}{2} m v^2 = \\tfrac{1}{2} \\cdot ${qty(m, 'kg')} \\cdot (${MS(v)})^2 = ${J(cut(Kf))}`,
				`E_i - E_f = ${J(cut(exact))} \\approx ${J(ans)}`,
			],
			// the final kinetic energy; the initial energy; the half forgotten (or, if that is negative, the two energies added)
			answer: choose(rng, qOpt(ans, 'J'), uOpts(r2s([Kf, Ei, noHalf > 0 ? noHalf : Ei + Kf]).map((s) => (s !== null && inRange(Number(s)) ? s : null)), 'J'), fallback(exact, 'J')),
			params: { m, h, v },
			scene: pista(`Una rampa curva alta ${lab(h)} metri: il blocco parte da fermo dal punto A, in cima, e arriva in fondo, nel punto B.`, { hA: h, hB: '0' }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: an incline with friction

function level4(rng: Rng): Built {
	for (;;) {
		const l = data2(rng, 0.5, 9.9);
		const a = rng.int(20, 60);
		const mu = coeff(rng, 10, 60);
		const un = Number(mu), ln = Number(l);
		if (tanD(a) < 1.3 * un) continue;
		const net = sinD(a) - un * cosD(a);
		const exact = Math.sqrt(2 * G * ln * net);
		const ans = r2(exact);
		if (ans === null) continue;
		const swapped = cosD(a) - un * sinD(a);
		return {
			prompt: 'Trova la velocità in fondo.',
			problem: textBlock(`Un blocco parte da fermo e scivola per ${pq(l, 'm')} lungo un piano inclinato di $${a}^\\circ$, con $\\mu_d = ${decTex(mu)}$. Con che velocità arriva in fondo?`),
			solution: `v \\approx ${MS(ans)}`,
			steps: [
				`${t('Il blocco scende di ')} h = l \\sin\\alpha${t('; la forza premente è ')} m g \\cos\\alpha`,
				'\\tfrac{1}{2} m v^2 = m g\\, l \\sin\\alpha - \\mu_d\\, m g \\cos\\alpha \\cdot l',
				`v = \\sqrt{2 g\\, l\\, (\\sin\\alpha - \\mu_d \\cos\\alpha)} = \\sqrt{2 \\cdot 9{,}8\\,\\text{m/s}^2 \\cdot ${qty(l, 'm')} \\cdot (\\sin ${a}^\\circ - ${decTex(mu)} \\cos ${a}^\\circ)} = ${MS(cut(exact))} \\approx ${MS(ans)}`,
				t('La massa si semplifica.'),
			],
			// friction forgotten; the pressing force taken as m g; sine and cosine swapped
			answer: choose(
				rng,
				qOpt(ans, 'm/s'),
				uOpts(r2s([Math.sqrt(2 * G * ln * sinD(a)), sinD(a) > un ? Math.sqrt(2 * G * ln * (sinD(a) - un)) : NaN, swapped > 0 ? Math.sqrt(2 * G * ln * swapped) : NaN]), 'm/s'),
				fallback(exact, 'm/s'),
			),
			params: { l, angle: a, mu },
			scene: { type: 'piano-inclinato', data: { angolo: a, testoAngolo: `${a}°`, lunghezza: `${lab(l)} m` }, alt: `Un blocco su un piano inclinato di ${a} gradi, lungo ${lab(l)} metri.` },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the efficiency

function level5(rng: Rng): Built {
	for (;;) {
		const m = data2(rng, 11, 99);
		const h = data2(rng, 1.1, 30);
		const E = data2(rng, 1.1, 99);
		const Eu = Number(m) * G * Number(h);
		const Es = Math.round(Number(E) * 1000);
		const eta = Eu / Es;
		if (eta < 0.2 || eta > 0.95) continue;
		const ans = r2(eta * 100);
		if (ans === null || ans.includes('.')) continue;
		return {
			prompt: 'Trova il rendimento.',
			problem: textBlock(`Un argano elettrico solleva un carico di ${pq(m, 'kg')} di ${pq(h, 'm')}, consumando ${pq(E, 'kJ')} di energia elettrica. Qual è il suo rendimento?`),
			solution: `\\eta \\approx ${ans}\\%`,
			steps: [
				`E_{utile} = m g h = ${MG(m)} \\cdot ${qty(h, 'm')} = ${J(cut(Eu, 4))}`,
				`\\eta = \\dfrac{E_{utile}}{E_{spesa}} = \\dfrac{${J(cut(Eu, 4))}}{${qty(String(Es), 'J')}} = ${cut(eta)} \\approx ${ans}\\%`,
			],
			// the ratio upside down; g forgotten; the dissipated share
			answer: choose(rng, pct(ans), pcts([1 / eta, (Number(m) * Number(h)) / Es, 1 - eta]), pcts([eta * 1.2, eta * 0.8, eta * 0.6, eta * 1.4].filter((x) => x < 1))),
			params: { m, h, E },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: the energy spent

function level6(rng: Rng): Built {
	for (;;) {
		const p = rng.int(15, 95);
		if (p % 10 === 0) continue;
		const Eu = data2(rng, 1.1, 99);
		const eta = p / 100;
		const exact = Number(Eu) / eta;
		const ans = r2(exact);
		if (ans === null || exact >= 99.5) continue;
		const machine = rng.pick(['Un motore elettrico', 'Un motore a benzina', 'Una pompa', 'Un montacarichi']);
		return {
			prompt: "Trova l'energia spesa.",
			problem: textBlock(`${machine} con un rendimento del $${p}\\%$ deve fornire ${pq(Eu, 'kJ')} di energia utile. Quanta energia consuma?`),
			solution: `E_{spesa} \\approx ${qty(ans, 'kJ')}`,
			steps: [`E_{spesa} = \\dfrac{E_{utile}}{\\eta} = \\dfrac{${qty(Eu, 'kJ')}}{${decTex(eta.toFixed(2))}} = ${cut(exact)}\\,\\text{kJ} \\approx ${qty(ans, 'kJ')}`, t("Si divide per il rendimento: l'energia spesa è più grande di quella utile.")],
			// multiplied by eta; the dissipated energy only; the lost share added to the useful energy
			answer: choose(rng, qOpt(ans, 'kJ'), uOpts(r2s([Number(Eu) * eta, exact - Number(Eu), Number(Eu) * (2 - eta)]), 'kJ'), fallback(exact, 'kJ')),
			params: { p, Eu },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if ((sample.level === 3 || sample.level === 4) && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisEnergiaTotale: Generator = {
	id: ID,
	title: "Forze dissipative e conservazione dell'energia totale",
	levels: {
		1: { label: "Il lavoro dell'attrito", constraints: ['piano orizzontale', 'lavoro negativo, tra 1 e 99 J'] },
		2: { label: "La velocità dopo un tratto con attrito", constraints: ['piano orizzontale', "l'attrito toglie tra il 19% e il 91% dell'energia cinetica"] },
		3: { label: "L'energia dissipata", constraints: ['la velocità in fondo tra il 30% e il 90% di quella senza attriti'] },
		4: { label: "La rampa con l'attrito", constraints: ['inclinazione da 20° a 60°', 'tan α almeno 1,3 volte μd'] },
		5: { label: 'Il rendimento', constraints: ['rendimento tra il 20% e il 95%, in percentuale intera'] },
		6: { label: "L'energia spesa", constraints: ['rendimento in percentuale intera, non multiplo di 10'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisEnergiaTotale;
