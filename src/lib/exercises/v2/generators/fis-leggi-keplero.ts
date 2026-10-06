/**
 * Le leggi di Keplero. Spec: specs/exercises/fis-leggi-keplero.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/93-fis-leggi-keplero.md), in its order, each one step
 * harder. First law: the semi-major axis from the distances at perihelion and aphelion, a = (r_p + r_a)/2, then the
 * eccentricity e = (r_a − r_p)/(r_a + r_p). Second law: the speed at one end of the major axis from the speed at the
 * other, v_p r_p = v_a r_a. Third law around the Sun, with years and astronomical units: T = √(a³), then a = ∛(T²);
 * last, two moons of the same planet, (T₂/T₁)² = (a₂/a₁)³, where years and AU cannot be used. The first three levels
 * have the scene of the orbit with the two distances. Distractors from the lesson's warnings: the exponents swapped,
 * the ratio of the distances upside down or squared, the difference of the distances for their mean.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, t } from '../vettori';
import { type Built, checkCommon, generateWith } from '../fisica-equilibrio';
import { around, fmt, lab, mant2, opt, opts as allOpts, pu, puS, qu, quS, res, show, whole } from '../fis-keplero-newton';

/** The answers of this generator are never in scientific notation: neither are the other options. */
const opts = (xs: number[], n: number, u: Parameters<typeof allOpts>[2]) => allOpts(xs, n, u).filter((o) => !o.values[0].includes('e'));

export const ID = 'fis-leggi-keplero';

const BODIES = [
	{ name: 'Un asteroide', the: "dell'asteroide" },
	{ name: 'Una cometa', the: 'della cometa' },
	{ name: 'Una sonda', the: 'della sonda' },
] as const;

/** Distances at perihelion and aphelion in tenths of AU: r_p from 0,3 to 4,9 and r_a at least 1,3 times as far. */
function distances(rng: Rng, even: boolean): { p: number; a: number } {
	for (;;) {
		const p = rng.int(3, 49), a = rng.int(8, 99);
		if (a < 1.3 * p || a > 12 * p) continue;
		if (even && (p + a) % 2) continue;
		return { p, a };
	}
}
const tenths = (k: number) => (k / 10).toFixed(1);

function orbit(p: number, a: number, extra: Record<string, unknown> = {}, what = ''): SceneRef {
	const e = (a - p) / (a + p);
	return {
		type: 'orbita-perielio-afelio',
		data: { e: Math.round(e * 1000) / 1000, rp: `${lab(tenths(p))} UA`, ra: `${lab(tenths(a))} UA`, ...extra },
		alt: `Un'orbita ellittica con il Sole in un fuoco. Il perielio dista dal Sole ${lab(tenths(p))} unità astronomiche, l'afelio ${lab(tenths(a))}.${what}`,
	};
}

// ---------------------------------------------------------------------------
// Level 1: the semi-major axis

function level1(rng: Rng): Built {
	for (;;) {
		const { p, a } = distances(rng, true);
		const body = rng.pick(BODIES);
		const rp = tenths(p), ra = tenths(a);
		const half = (p + a) / 20;
		const ans = half.toFixed(1);
		const o = (x: number) => ({ latex: qu(x.toFixed(1), 'UA'), values: [x.toFixed(1)] });
		const c = (a - p) / 20;
		if (!Number.isInteger((a - p) / 2)) continue;
		return {
			prompt: "Trova il semiasse maggiore dell'orbita.",
			problem: textBlock(`${body.name} gira attorno al Sole su un'orbita ellittica: al perielio dista dal Sole ${pu(rp, 'UA')}, all'afelio ${pu(ra, 'UA')}. Quanto vale il semiasse maggiore dell'orbita?`),
			solution: `a = ${qu(ans, 'UA')}`,
			steps: [
				t("Perielio e afelio sono gli estremi dell'asse maggiore, lungo 2a:"),
				`a = \\dfrac{r_p + r_a}{2} = \\dfrac{${qu(rp, 'UA')} + ${qu(ra, 'UA')}}{2} = ${qu(ans, 'UA')}`,
			],
			// the whole axis; the difference (the distance between the foci); half the difference (c)
			answer: choiceOf(rng, o(half), [o((p + a) / 10), o((a - p) / 10), o(c)], [o(a / 10), o(p / 10)]),
			params: { rp, ra },
			scene: orbit(p, a),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the eccentricity

function level2(rng: Rng): Built {
	for (;;) {
		const { p, a } = distances(rng, false);
		const body = rng.pick(BODIES);
		const rp = tenths(p), ra = tenths(a);
		const e = (a - p) / (a + p);
		const ans = fmt(e, 2);
		if (!ans) continue;
		return {
			prompt: "Trova l'eccentricità dell'orbita.",
			problem: textBlock(`${body.name} gira attorno al Sole su un'orbita ellittica: al perielio dista dal Sole ${pu(rp, 'UA')}, all'afelio ${pu(ra, 'UA')}. Quanto vale l'eccentricità dell'orbita?`),
			solution: `e \\approx ${ans.tex}`,
			steps: [
				t("Dalle distanze al perielio e all'afelio, sottraendo e sommando:"),
				`r_p = a\\,(1 - e) \\qquad r_a = a\\,(1 + e)`,
				`e = \\dfrac{r_a - r_p}{r_a + r_p} = \\dfrac{${qu(tenths(a - p), 'UA')}}{${qu(tenths(a + p), 'UA')}} = ${show(e)} \\approx ${ans.tex}`,
			],
			// the ratio of the two distances; the difference over the aphelion; the difference over the semi-major axis
			answer: choiceOf(rng, opt(e, 2, '')!, opts([p / a, (a - p) / a, (2 * (a - p)) / (a + p) < 1 ? (2 * (a - p)) / (a + p) : NaN, 1 - e], 2, ''), around(e, 2, '').filter((x) => Number(x.values[0]) < 1 && !x.values[0].includes('e'))),
			params: { rp, ra },
			scene: orbit(p, a),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the speeds at perihelion and aphelion

function level3(rng: Rng): Built {
	const toAphelion = rng.next() < 0.5;
	for (;;) {
		const { p, a } = distances(rng, false);
		const body = rng.pick(BODIES);
		const rp = tenths(p), ra = tenths(a);
		const vs = toAphelion ? whole(rng, 11, 99) : mant2(rng);
		const v = Number(vs);
		const out = toAphelion ? (v * p) / a : (v * a) / p;
		const ans = fmt(out, 2);
		if (!ans || out < 0.5 || out > 99 || ans.value.includes('e')) continue;
		const from = toAphelion ? 'p' : 'a', to = toAphelion ? 'a' : 'p';
		const rFrom = toAphelion ? rp : ra, rTo = toAphelion ? ra : rp;
		const wrong = toAphelion ? (v * a) / p : (v * p) / a;
		const squared = toAphelion ? v * (p / a) ** 2 : v * (a / p) ** 2;
		const root = toAphelion ? v * Math.sqrt(p / a) : v * Math.sqrt(a / p);
		const plain = (x: number) => (x >= 0.1 && x < 100 ? x : NaN);
		return {
			prompt: toAphelion ? "Trova la velocità all'afelio." : 'Trova la velocità al perielio.',
			problem: textBlock(
				toAphelion
					? `${body.name} gira attorno al Sole: al perielio dista dal Sole ${pu(rp, 'UA')} e ha una velocità di ${pu(vs, 'km/s')}; all'afelio dista ${pu(ra, 'UA')}. Con quale velocità passa all'afelio?`
					: `${body.name} gira attorno al Sole: all'afelio dista dal Sole ${pu(ra, 'UA')} e ha una velocità di ${pu(vs, 'km/s')}; al perielio dista ${pu(rp, 'UA')}. Con quale velocità passa al perielio?`,
			),
			solution: `v_${to} \\approx ${res(ans, 'km/s')}`,
			steps: [
				t("Per la seconda legge, al perielio e all'afelio:"),
				`v_p\\,r_p = v_a\\,r_a`,
				`v_${to} = v_${from} \\cdot \\dfrac{r_${from}}{r_${to}} = ${qu(vs, 'km/s')} \\cdot \\dfrac{${qu(rFrom, 'UA')}}{${qu(rTo, 'UA')}} = ${show(out)}\\,\\text{km/s} \\approx ${res(ans, 'km/s')}`,
				t(toAphelion ? "All'afelio il corpo è più lontano dal Sole, e più lento." : 'Al perielio il corpo è più vicino al Sole, e più veloce.'),
			],
			// the ratio of the distances upside down; squared; under a root
			answer: choiceOf(rng, opt(out, 2, 'km/s')!, opts([plain(wrong), plain(squared), plain(root)], 2, 'km/s'), opts([plain(out * 1.5), plain(out * 0.6), plain(out * 2.5)], 2, 'km/s')),
			params: { case: toAphelion ? 'afelio' : 'perielio', rp, ra, v: vs },
			scene: orbit(p, a, toAphelion ? { vp: `${lab(vs)} km/s` } : { va: `${lab(vs)} km/s` }, toAphelion ? ` Al perielio è disegnata la velocità, ${lab(vs)} kilometri al secondo.` : ` All'afelio è disegnata la velocità, ${lab(vs)} kilometri al secondo.`),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the period from the semi-major axis (years and AU)

function level4(rng: Rng): Built {
	for (;;) {
		const as = rng.next() < 0.6 ? mant2(rng) : whole(rng, 11, 21);
		const a = Number(as);
		const T = Math.sqrt(a ** 3);
		const ans = fmt(T, 2);
		if (!ans || T > 99 || ans.value.includes('e')) continue;
		const body = rng.pick(BODIES);
		const plain = (x: number) => (x >= 0.1 && x < 100 ? x : NaN);
		return {
			prompt: 'Trova il periodo di rivoluzione.',
			problem: textBlock(`${body.name} gira attorno al Sole su un'orbita con il semiasse maggiore di ${pu(as, 'UA')}. Quanto dura un suo giro attorno al Sole?`),
			solution: `T \\approx ${res(ans, 'anni')}`,
			steps: [
				t('Attorno al Sole, con T in anni e a in unità astronomiche, la terza legge è:'),
				`T^2 = a^3`,
				`T = \\sqrt{a^3} = \\sqrt{${qu(as, '')}^3} = \\sqrt{${show(a ** 3, 5)}} = ${show(T)} \\approx ${res(ans, 'anni')}`,
			],
			// the exponents swapped (T³ = a²); T = a; T = a²
			answer: choiceOf(rng, opt(T, 2, 'anni')!, opts([plain(a ** (2 / 3)), plain(a), plain(a * a)], 2, 'anni'), opts([plain(T * 1.5), plain(T * 0.6), plain(T * 0.4)], 2, 'anni')),
			params: { a: as },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the semi-major axis from the period

function level5(rng: Rng): Built {
	for (;;) {
		const Ts = rng.next() < 0.4 ? mant2(rng) : whole(rng, 11, 99);
		const T = Number(Ts);
		const a = Math.cbrt(T * T);
		const ans = fmt(a, 2);
		if (!ans) continue;
		const body = rng.pick(BODIES);
		const plain = (x: number) => (x >= 0.1 && x < 100 ? x : NaN);
		return {
			prompt: "Trova il semiasse maggiore dell'orbita.",
			problem: textBlock(`${body.name} impiega ${pu(Ts, 'anni')} a compiere un giro attorno al Sole. Quanto vale il semiasse maggiore della sua orbita?`),
			solution: `a \\approx ${res(ans, 'UA')}`,
			steps: [
				t('Attorno al Sole, con T in anni e a in unità astronomiche, la terza legge è:'),
				`T^2 = a^3`,
				`a = \\sqrt[3]{T^2} = \\sqrt[3]{${qu(Ts, '')}^2} = \\sqrt[3]{${show(T * T, 5)}} = ${show(a)} \\approx ${res(ans, 'UA')}`,
			],
			// the exponents swapped (a = √(T³)); a = T; the square root of T
			answer: choiceOf(rng, opt(a, 2, 'UA')!, opts([plain(Math.sqrt(T ** 3)), plain(T), plain(Math.sqrt(T))], 2, 'UA'), opts([plain(a * 1.5), plain(a * 0.6), plain(a * 2.5)], 2, 'UA')),
			params: { T: Ts },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: two moons of the same planet

function level6(rng: Rng): Built {
	for (;;) {
		const a1 = mant2(rng), a2 = mant2(rng), T1 = mant2(rng);
		const q = Number(a2) / Number(a1);
		if (q < 1.25 && q > 0.8) continue;
		const T2 = Number(T1) * Math.sqrt(q ** 3);
		const ans = fmt(T2, 2);
		if (!ans || T2 < 0.2 || T2 > 99 || ans.value.includes('e')) continue;
		const plain = (x: number) => (x >= 0.1 && x < 100 ? x : NaN);
		return {
			prompt: 'Trova il periodo della seconda luna.',
			problem: textBlock(
				`Due lune girano attorno allo stesso pianeta su orbite circolari. La prima ha un'orbita di raggio ${puS(a1, 5, 'km')} e un periodo di ${pu(T1, 'd')}. La seconda ha un'orbita di raggio ${puS(a2, 5, 'km')}. Quanto vale il periodo della seconda luna?`,
			),
			solution: `T_2 \\approx ${res(ans, 'd')}`,
			steps: [
				t('Le due lune girano attorno allo stesso corpo: il rapporto tra il quadrato del'),
				t('periodo e il cubo del raggio è lo stesso.'),
				`\\left(\\dfrac{T_2}{T_1}\\right)^2 = \\left(\\dfrac{a_2}{a_1}\\right)^3`,
				`\\dfrac{a_2}{a_1} = \\dfrac{${quS(a2, 5, 'km')}}{${quS(a1, 5, 'km')}} = ${show(q)}`,
				`T_2 = T_1 \\cdot \\sqrt{\\left(\\dfrac{a_2}{a_1}\\right)^3} = ${qu(T1, 'd')} \\cdot \\sqrt{${show(q ** 3)}} = ${show(T2)}\\,\\text{d} \\approx ${res(ans, 'd')}`,
			],
			// periods in proportion to the radii; the ratio upside down; the exponents swapped
			answer: choiceOf(rng, opt(T2, 2, 'd')!, opts([plain(Number(T1) * q), plain(Number(T1) / Math.sqrt(q ** 3)), plain(Number(T1) * Math.cbrt(q * q))], 2, 'd'), opts([plain(T2 * 1.5), plain(T2 * 0.6), plain(T2 * 2.5)], 2, 'd')),
			params: { a1, a2, T1 },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

const check = (sample: Sample): string[] => {
	const v = checkCommon(sample);
	if (sample.level <= 3 && sample.scene?.type !== 'orbita-perielio-afelio') v.push("manca la scena dell'orbita");
	return v;
};

export const fisLeggiKeplero: Generator = {
	id: ID,
	title: 'Le leggi di Keplero',
	levels: {
		1: { label: 'Il semiasse maggiore', constraints: ['a = (r_p + r_a)/2', 'distanze con un decimale, in UA'] },
		2: { label: "L'eccentricità", constraints: ['e = (r_a − r_p)/(r_a + r_p)'] },
		3: { label: 'Più veloce al perielio', constraints: ['v_p r_p = v_a r_a', "verso l'afelio o verso il perielio, metà ciascuno"] },
		4: { label: 'Il periodo dal semiasse', constraints: ['T = √(a³), anni e UA', 'T sotto 100 anni'] },
		5: { label: 'Il semiasse dal periodo', constraints: ['a = ∛(T²), anni e UA'] },
		6: { label: 'Le lune di un pianeta', constraints: ['(T₂/T₁)² = (a₂/a₁)³', 'raggi diversi almeno del 25%'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisLeggiKeplero;
