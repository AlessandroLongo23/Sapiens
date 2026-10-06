/**
 * Il bilancio dell'energia con le forze non conservative. Spec: specs/exercises/fis-bilancio-energia.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/79-fis-bilancio-energia.md), each one step harder: the
 * final mechanical energy from the works of a rope and of friction, E_f = E_i + W_nc; a smooth descent followed by a
 * floor with friction, d = h / μd; a spring that launches a block on a floor with friction, d = k x² / (2 μd m g); an
 * incline with friction and a spring at its foot, ½ k x² = m g l (sin α − μd cos α); a crate pulled up an incline with
 * friction, ½ m v² = F l − μd m g cos α · l − m g l sin α; the mean force that stops a diver in the water,
 * F = m g (h + d) / d. g = 9,8 m/s², data with two significant figures (spring constants and the pulling force with
 * three), answers with two. Distractors from the lesson's warnings: the sign of each work, the pressing force on the
 * incline taken as m g, the height that stops at the water's surface.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, decTex, pq, qOpt, qty, t } from '../vettori';
import { type Built, checkCommon, coeff, cosD, generateWith, r2, sinD, tanD } from '../fisica-equilibrio';
import { G, J, choose, cut, data2, fallback, int3, lab, pista, r2s, uOpts } from '../fis-energia';

export const ID = 'fis-bilancio-energia';

const MG = (m: string) => `${qty(m, 'kg')} \\cdot 9{,}8\\,\\text{m/s}^2`;
const signed = (x: number) => (x < 0 ? `- ${J(String(-x))}` : `+ ${J(String(x))}`);

// ---------------------------------------------------------------------------
// Level 1: the balance with the works given

function level1(rng: Rng): Built {
	for (;;) {
		const Ei = rng.int(21, 79), Wf = rng.int(11, 59), Wa = -rng.int(11, 59);
		const Ef = Ei + Wf + Wa;
		const wrong = [Ei - Wf - Wa, Ei + Wf - Wa, Ei - Wf + Wa];
		if ([Ei, Wf, Wa, Ef, ...wrong].some((x) => x % 10 === 0) || Ef < 11 || Ef > 99 || wrong.some((x) => x < 11 || x > 199) || Wf === -Wa) continue;
		const [body, puller] = rng.pick([
			['Una cassa', 'una fune'],
			['Un carrello', 'un motore'],
			['Una slitta', 'una fune'],
		]);
		return {
			prompt: "Trova l'energia meccanica finale.",
			problem: textBlock(`${body} ha un'energia meccanica di ${pq(String(Ei), 'J')}. Poi ${puller} compie un lavoro di ${pq(String(Wf), 'J')} e l'attrito un lavoro di ${pq(String(Wa), 'J')}. Quanto vale ora l'energia meccanica?`),
			solution: `E_f = ${J(String(Ef))}`,
			steps: [
				`W_{nc} = ${J(String(Wf))} ${signed(Wa)} = ${J(String(Wf + Wa))}`,
				`E_f = E_i + W_{nc} = ${J(String(Ei))} ${signed(Wf + Wa)} = ${J(String(Ef))}`,
				t(Wf + Wa > 0 ? "Il lavoro totale delle forze non conservative è positivo: l'energia meccanica aumenta." : "Il lavoro totale delle forze non conservative è negativo: l'energia meccanica diminuisce."),
			],
			// both signs wrong; the sign of friction; the sign of the pull
			answer: choiceOf(rng, qOpt(String(Ef), 'J'), wrong.map((x) => qOpt(String(x), 'J'))),
			params: { Ei, Wf, Wa },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: a smooth descent, then friction

function level2(rng: Rng): Built {
	for (;;) {
		const h = data2(rng, 0.5, 9.9);
		const mu = coeff(rng, 10, 60);
		if (mu.endsWith('0')) continue;
		const hn = Number(h), un = Number(mu);
		const exact = hn / un;
		const ans = r2(exact);
		if (ans === null || exact < 1) continue;
		const body = rng.pick(['Una slitta', 'Un blocco', 'Uno slittino']);
		return {
			prompt: 'Trova la distanza di arresto.',
			problem: textBlock(`${body} parte da fermo dal punto $A$, in cima a una discesa liscia alta ${pq(h, 'm')}. In fondo, dal punto $B$, prosegue su un tratto orizzontale con $\\mu_d = ${decTex(mu)}$. Quanta strada percorre sul tratto orizzontale prima di fermarsi?`),
			solution: `d \\approx ${qty(ans, 'm')}`,
			steps: [
				t('Dalla partenza al punto in cui si ferma: ') + ' m g h - \\mu_d\\, m g\\, d = 0',
				`d = \\dfrac{h}{\\mu_d} = \\dfrac{${qty(h, 'm')}}{${decTex(mu)}} = ${qty(cut(exact), 'm')} \\approx ${qty(ans, 'm')}`,
				t('La massa si semplifica.'),
			],
			// multiplied by the coefficient; the speed at the foot read as a distance; g left in
			answer: choose(rng, qOpt(ans, 'm'), uOpts(r2s([hn * un, Math.sqrt(2 * G * hn), hn / (un * G)]), 'm'), fallback(exact, 'm')),
			params: { h, mu },
			scene: pista(`Una discesa curva alta ${lab(h)} metri: il corpo parte da fermo dal punto A, in cima, e arriva in fondo, nel punto B, dove comincia il tratto orizzontale.`, { hA: h, hB: '0' }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: a spring and a floor with friction

function level3(rng: Rng): Built {
	for (;;) {
		const k = int3(rng, 101, 999);
		const x = data2(rng, 2.0, 25);
		const m = data2(rng, 0.11, 5.0);
		const mu = coeff(rng, 10, 60);
		if (mu.endsWith('0')) continue;
		const kn = Number(k), xn = Number(x) / 100, mn = Number(m), un = Number(mu);
		const Uel = 0.5 * kn * xn * xn, Fd = un * mn * G;
		const exact = Uel / Fd;
		const ans = r2(exact);
		// the block must leave the spring behind: more than three times the compression
		if (ans === null || exact < 3 * xn || exact < 0.1) continue;
		return {
			prompt: 'Trova la strada percorsa.',
			problem: textBlock(`Una molla con costante elastica ${pq(k, 'N/m')}, compressa di ${pq(x, 'cm')}, lancia un blocco di ${pq(m, 'kg')} su un pavimento orizzontale con $\\mu_d = ${decTex(mu)}$. Quanta strada fa il blocco, dal punto in cui viene lasciato a quello in cui si ferma?`),
			solution: `d \\approx ${qty(ans, 'm')}`,
			steps: [
				`\\tfrac{1}{2} k x^2 = \\tfrac{1}{2} \\cdot ${qty(k, 'N/m')} \\cdot (${qty(cut(xn), 'm')})^2 = ${J(cut(Uel))}`,
				`F_d = \\mu_d\\, m g = ${decTex(mu)} \\cdot ${MG(m)} = ${cut(Fd)}\\,\\text{N}`,
				`\\tfrac{1}{2} k x^2 - F_d \\cdot d = 0 \\quad\\Rightarrow\\quad d = \\dfrac{${J(cut(Uel))}}{${cut(Fd)}\\,\\text{N}} = ${qty(cut(exact), 'm')} \\approx ${qty(ans, 'm')}`,
			],
			// the half forgotten; the mass forgotten in the friction; g forgotten
			answer: choose(rng, qOpt(ans, 'm'), uOpts(r2s([2 * exact, Uel / (un * G), Uel / (un * mn)]), 'm'), fallback(exact, 'm')),
			params: { k, x, m, mu },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: an incline with friction, then a spring

function level4(rng: Rng): Built {
	for (;;) {
		const m = data2(rng, 0.5, 9.9);
		const l = data2(rng, 0.5, 5.0);
		const a = rng.int(20, 50);
		const mu = coeff(rng, 10, 40);
		const k = int3(rng, 201, 999);
		const mn = Number(m), ln = Number(l), un = Number(mu), kn = Number(k);
		if (mu.endsWith('0') || tanD(a) < 1.5 * un) continue;
		const Ui = mn * G * ln * sinD(a);
		const Wa = -un * mn * G * cosD(a) * ln;
		const x = (E: number) => (E > 0 ? 100 * Math.sqrt((2 * E) / kn) : NaN);
		const exact = x(Ui + Wa);
		const ans = r2(exact);
		if (ans === null || exact < 2 || exact > 60) continue;
		return {
			prompt: 'Trova la compressione della molla.',
			problem: textBlock(`Un blocco di ${pq(m, 'kg')} parte da fermo e scivola per ${pq(l, 'm')} lungo un piano inclinato di $${a}^\\circ$, con $\\mu_d = ${decTex(mu)}$. In fondo prosegue su un piano orizzontale liscio e comprime una molla con costante elastica ${pq(k, 'N/m')}. Di quanti centimetri si comprime la molla?`),
			solution: `x \\approx ${qty(ans, 'cm')}`,
			steps: [
				`U_i = m g\\, l \\sin\\alpha = ${MG(m)} \\cdot ${qty(l, 'm')} \\cdot \\sin ${a}^\\circ = ${J(cut(Ui))}`,
				`W_{nc} = -\\mu_d\\, m g \\cos\\alpha \\cdot l = -${decTex(mu)} \\cdot ${MG(m)} \\cdot \\cos ${a}^\\circ \\cdot ${qty(l, 'm')} = ${J(cut(Wa))}`,
				`\\tfrac{1}{2} k x^2 = U_i + W_{nc} = ${J(cut(Ui + Wa))}`,
				`x = \\sqrt{\\dfrac{2 \\cdot ${J(cut(Ui + Wa))}}{${qty(k, 'N/m')}}} = ${qty(cut(exact / 100), 'm')} \\approx ${qty(ans, 'cm')}`,
			],
			// friction forgotten; the pressing force taken as m g; sine and cosine swapped
			answer: choose(rng, qOpt(ans, 'cm'), uOpts(r2s([x(Ui), x(Ui - un * mn * G * ln), x(mn * G * ln * (cosD(a) - un * sinD(a)))]), 'cm'), fallback(exact, 'cm')),
			params: { m, l, angle: a, mu, k },
			scene: { type: 'piano-inclinato', data: { angolo: a, testoAngolo: `${a}°`, lunghezza: `${lab(l)} m` }, alt: `Un blocco su un piano inclinato di ${a} gradi, lungo ${lab(l)} metri.` },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: a force that adds energy

function level5(rng: Rng): Built {
	for (;;) {
		const m = data2(rng, 2.0, 25);
		const l = data2(rng, 1.1, 9.9);
		const a = rng.int(15, 40);
		const mu = coeff(rng, 10, 40);
		const mn = Number(m), ln = Number(l), un = Number(mu);
		if (mu.endsWith('0')) continue;
		const need = mn * G * (sinD(a) + un * cosD(a));
		const Fn = Math.round(need * (1.2 + rng.int(0, 80) / 100));
		if (Fn % 10 === 0 || Fn < 101 || Fn > 999) continue;
		const F = String(Fn);
		const WF = Fn * ln, Wa = -un * mn * G * cosD(a) * ln, Uf = mn * G * ln * sinD(a);
		const v = (K: number) => (K > 0 ? Math.sqrt((2 * K) / mn) : NaN);
		const K = WF + Wa - Uf;
		const exact = v(K);
		const ans = r2(exact);
		if (ans === null || K < 0.15 * WF) continue;
		return {
			prompt: 'Trova la velocità.',
			problem: textBlock(`Una cassa di ${pq(m, 'kg')}, ferma ai piedi di un piano inclinato di $${a}^\\circ$, viene tirata verso l'alto da una fune parallela al piano con una forza di ${pq(F, 'N')}. Tra la cassa e il piano $\\mu_d = ${decTex(mu)}$. Con che velocità si muove la cassa dopo ${pq(l, 'm')} di salita?`),
			solution: `v \\approx ${qty(ans, 'm/s')}`,
			steps: [
				`W_F = F \\cdot l = ${qty(F, 'N')} \\cdot ${qty(l, 'm')} = ${J(cut(WF, 4))}`,
				`W_{attrito} = -\\mu_d\\, m g \\cos\\alpha \\cdot l = -${decTex(mu)} \\cdot ${MG(m)} \\cdot \\cos ${a}^\\circ \\cdot ${qty(l, 'm')} = ${J(cut(Wa, 4))}`,
				`U_f = m g\\, l \\sin\\alpha = ${MG(m)} \\cdot ${qty(l, 'm')} \\cdot \\sin ${a}^\\circ = ${J(cut(Uf, 4))}`,
				`K_f = W_F + W_{attrito} - U_f = ${J(cut(K, 4))}`,
				`v = \\sqrt{\\dfrac{2 K_f}{m}} = \\sqrt{\\dfrac{2 \\cdot ${J(cut(K, 4))}}{${qty(m, 'kg')}}} = ${qty(cut(exact), 'm/s')} \\approx ${qty(ans, 'm/s')}`,
			],
			// friction forgotten; the potential energy forgotten; the work of friction added
			answer: choose(rng, qOpt(ans, 'm/s'), uOpts(r2s([v(WF - Uf), v(WF + Wa), v(WF - Wa - Uf)]), 'm/s'), fallback(exact, 'm/s')),
			params: { m, l, angle: a, mu, F },
			scene: {
				type: 'piano-inclinato',
				data: { angolo: a, testoAngolo: `${a}°`, forze: [{ nome: 'F', direzione: 'su-piano', modulo: Fn }], scala: Math.round((1.6 / Fn) * 1e5) / 1e5 },
				alt: `Una cassa su un piano inclinato di ${a} gradi, tirata verso l'alto da una forza F parallela al piano.`,
			},
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: the mean force of a resistance

function level6(rng: Rng): Built {
	for (;;) {
		const m = String(rng.int(41, 95));
		if (m.endsWith('0')) continue;
		const h = data2(rng, 3.0, 9.9);
		const d = data2(rng, 1.5, 4.5);
		const mn = Number(m), hn = Number(h), dn = Number(d);
		const exact = (mn * G * (hn + dn)) / dn / 1000;
		const ans = r2(exact);
		if (ans === null) continue;
		const who = rng.pick(['Un tuffatore', 'Una tuffatrice']);
		return {
			prompt: "Trova la forza media dell'acqua.",
			problem: textBlock(`${who} di ${pq(m, 'kg')} si lascia cadere da una piattaforma alta ${pq(h, 'm')} sopra l'acqua e si ferma a ${pq(d, 'm')} di profondità. Con quale forza media l'acqua frena la caduta? La resistenza dell'aria si trascura.`),
			solution: `F \\approx ${qty(ans, 'kN')}`,
			steps: [
				t('Dalla piattaforma al punto in cui si ferma: ') + ' m g\\,(h + d) - F \\cdot d = 0',
				`F = \\dfrac{m g\\,(h + d)}{d} = \\dfrac{${MG(m)} \\cdot ${qty(cut(hn + dn), 'm')}}{${qty(d, 'm')}} = ${qty(cut(exact * 1000, 4), 'N')} \\approx ${qty(ans, 'kN')}`,
				t("Il peso lavora anche sott'acqua: il dislivello arriva fino al punto di arresto."),
			],
			// the depth left out of the drop; the weight alone; g forgotten
			answer: choose(rng, qOpt(ans, 'kN'), uOpts(r2s([(mn * G * hn) / dn / 1000, (mn * G) / 1000, (mn * (hn + dn)) / dn / 1000]), 'kN'), fallback(exact, 'kN')),
			params: { m, h, d },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };
const WITH_SCENE = new Set([2, 4, 5]);

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (WITH_SCENE.has(sample.level) && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisBilancioEnergia: Generator = {
	id: ID,
	title: "Il bilancio dell'energia con le forze non conservative",
	levels: {
		1: { label: 'Il bilancio con i lavori dati', constraints: ['un lavoro positivo e uno negativo', 'energie intere, non multiple di 10'] },
		2: { label: 'Discesa liscia e tratto con attrito', constraints: ['distanza di arresto di almeno 1 m'] },
		3: { label: 'La molla e il pavimento con attrito', constraints: ['strada percorsa almeno tre volte la compressione'] },
		4: { label: 'La rampa con attrito e la molla', constraints: ['inclinazione da 20° a 50°', 'tan α almeno 1,5 volte μd', 'compressione tra 2 e 60 cm'] },
		5: { label: 'La cassa tirata in salita', constraints: ['forza tra 1,2 e 2 volte quella che serve a salire', "energia cinetica almeno il 15% del lavoro della fune"] },
		6: { label: 'La forza media di una resistenza', constraints: ['forza in kilonewton, con due cifre significative'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisBilancioEnergia;
