/**
 * La caduta libera e il lancio verticale. Spec: specs/exercises/fis-caduta-libera.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/44-fis-caduta-libera.md), each one step harder: depth or
 * speed from the time of a fall (h = g t²/2, v = g t); the time of a fall from its height (√(2h/g)); the speed of
 * arrival (√(2gh)); the maximum height or the time of flight of a throw upwards (v0²/2g, 2v0/g); the signed velocity
 * of a throw after a time, on the way up or down (v0 − g t, axis upwards); the time of a throw upwards from a height
 * down to the ground (a quadratic). g = 9,8 m/s², air neglected, data with two significant figures, answers rounded
 * to two. Distractors from the lesson's warnings: the half or the square root forgotten, the 2 forgotten, the sign of
 * g, only the way up, the height or the throw ignored.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, decTex, pq, t } from '../vettori';
import { type Built, checkCommon, generateWith, opts, r2 } from '../fisica-equilibrio';
import { G, f3, gTex, mOpt, ms, msOpt, sOpt, two } from '../fis-moto-accelerato';

export const ID = 'fis-caduta-libera';

const AIR = "L'aria si trascura.";
const BODIES = [
	{ name: 'Un vaso', e: 'o' },
	{ name: 'Un sasso', e: 'o' },
	{ name: 'Una mela', e: 'a' },
	{ name: 'Una chiave', e: 'a' },
];
const THROWN = [
	{ name: 'Una palla', e: 'a' },
	{ name: 'Un sasso', e: 'o' },
	{ name: 'Una moneta', e: 'a' },
];
const fall = (x: number, make: (s: string) => ReturnType<typeof mOpt>) => opts([r2(x * 1.2), r2(x * 0.8), r2(x * 1.4), r2(x * 0.6)], make);
const dots = (x: number) => (Math.abs(x * 1000 - Math.round(x * 1000)) > 1e-6 ? '\\ldots' : '');

// ---------------------------------------------------------------------------
// Level 1: from the time of the fall

function level1(rng: Rng): Built {
	const askV = rng.next() < 0.5;
	for (;;) {
		const tt = rng.next() < 0.3 ? (rng.int(50, 99) / 100).toFixed(2) : two(rng, 1.1, 4.4), T = Number(tt);
		if (/0$/.test(tt)) continue;
		const bridge = rng.next() < 0.5;
		const x = askV ? G * T : 0.5 * G * T * T;
		const ans = r2(x);
		if (ans === null) continue;
		const lead = bridge ? `Un sasso lasciato cadere da fermo da un ponte arriva all'acqua dopo ${pq(tt, 's')}.` : `Un sasso lasciato cadere da fermo in un pozzo tocca l'acqua dopo ${pq(tt, 's')}.`;
		if (askV)
			return {
				prompt: "Trova la velocità d'arrivo.",
				problem: textBlock(`${lead} Con che velocità, in modulo, arriva all'acqua? ${AIR}`),
				solution: `v \\approx ${ms(ans)}`,
				steps: [t('Da fermo la velocità cresce di 9,8 m/s ogni secondo:'), `v = g\\,t = ${gTex} \\cdot ${decTex(tt)}\\,\\text{s} = ${f3(x)}\\,\\text{m/s} \\approx ${ms(ans)}`],
				// the half of the distance law; g t² ; g over t
				answer: choiceOf(rng, msOpt(ans), opts([r2(0.5 * G * T), r2(G * T * T), r2(G / T)], msOpt), fall(x, msOpt)),
				params: { case: 'velocita', t: tt, story: bridge ? 'ponte' : 'pozzo' },
			};
		return {
			prompt: 'Trova la profondità.',
			problem: textBlock(`${lead} ${bridge ? "Quanto è alto il ponte sull'acqua?" : "Quanto è profondo il pozzo, fino all'acqua?"} ${AIR} Si trascura anche il tempo del suono che risale.`),
			solution: `h \\approx ${decTex(ans)}\\,\\text{m}`,
			steps: [t('Il sasso parte da fermo: scende di ') + ` h = \\tfrac{1}{2}g\\,t^2`, `h = \\tfrac{1}{2} \\cdot ${gTex} \\cdot (${decTex(tt)}\\,\\text{s})^2 = ${f3(x)}\\,\\text{m} \\approx ${decTex(ans)}\\,\\text{m}`],
			// the half forgotten; the square forgotten; the velocity g t
			answer: choiceOf(rng, mOpt(ans), opts([r2(G * T * T), r2(0.5 * G * T), r2(G * T)], mOpt), fall(x, mOpt)),
			params: { case: 'altezza', t: tt, story: bridge ? 'ponte' : 'pozzo' },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the time of the fall

function level2(rng: Rng): Built {
	for (;;) {
		const h = two(rng, 1.1, 99), H = Number(h);
		const x = Math.sqrt((2 * H) / G);
		const ans = r2(x);
		if (ans === null) continue;
		const b = rng.pick(BODIES);
		return {
			prompt: 'Trova il tempo di caduta.',
			problem: textBlock(`${b.name} cade da ferm${b.e} da un'altezza di ${pq(h, 'm')}. Quanto tempo impiega ad arrivare al suolo? ${AIR}`),
			solution: `t \\approx ${decTex(ans)}\\,\\text{s}`,
			steps: [
				t('Da ') + ` h = \\tfrac{1}{2}g\\,t^2 ` + t(' si ricava il tempo:'),
				`t = \\sqrt{\\dfrac{2h}{g}} = \\sqrt{\\dfrac{2 \\cdot ${decTex(h)}\\,\\text{m}}{${gTex}}} = \\sqrt{${f3((2 * H) / G)}${dots((2 * H) / G)}\\,\\text{s}^2} = ${f3(x)}\\ldots\\,\\text{s} \\approx ${decTex(ans)}\\,\\text{s}`,
			],
			// the square root forgotten; the 2 forgotten; h over g
			answer: choiceOf(rng, sOpt(ans), opts([r2((2 * H) / G), r2(Math.sqrt(H / G)), r2(H / G)], sOpt), fall(x, sOpt)),
			params: { case: 'tempo', h },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the speed of arrival

function level3(rng: Rng): Built {
	for (;;) {
		const h = two(rng, 1.1, 99), H = Number(h);
		const x = Math.sqrt(2 * G * H);
		const ans = r2(x);
		if (ans === null) continue;
		const b = rng.pick(BODIES);
		return {
			prompt: "Trova la velocità d'arrivo.",
			problem: textBlock(`${b.name} cade da ferm${b.e} da un'altezza di ${pq(h, 'm')}. Con che velocità, in modulo, arriva al suolo? ${AIR}`),
			solution: `v \\approx ${ms(ans)}`,
			steps: [
				t('Dalla relazione senza il tempo, con ') + ` v_0 = 0` + t(':'),
				`v = \\sqrt{2g\\,h} = \\sqrt{2 \\cdot ${gTex} \\cdot ${decTex(h)}\\,\\text{m}} = ${f3(x)}\\ldots\\,\\text{m/s} \\approx ${ms(ans)}`,
			],
			// the square root forgotten; the 2 forgotten; g times the time without its square root
			answer: choiceOf(rng, msOpt(ans), opts([r2(2 * G * H), r2(Math.sqrt(G * H)), r2(2 * H)], msOpt), fall(x, msOpt)),
			params: { case: 'velocita', h },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: a throw upwards

function level4(rng: Rng): Built {
	const askH = rng.next() < 0.5;
	for (;;) {
		const v0 = two(rng, 1.1, 30), V = Number(v0);
		const x = askH ? (V * V) / (2 * G) : (2 * V) / G;
		const ans = r2(x);
		if (ans === null) continue;
		const b = rng.pick(THROWN);
		const lead = `${b.name} viene lanciat${b.e} verticalmente verso l'alto a ${pq(v0, 'm/s')}.`;
		if (askH)
			return {
				prompt: "Trova l'altezza massima.",
				problem: textBlock(`${lead} Quanto sale sopra il punto di lancio? ${AIR}`),
				solution: `h_{max} \\approx ${decTex(ans)}\\,\\text{m}`,
				steps: [t('In cima la velocità è zero: ') + ` 0 = v_0^2 - 2g\\,h_{max}`, `h_{max} = \\dfrac{v_0^2}{2g} = \\dfrac{(${ms(v0)})^2}{2 \\cdot ${gTex}} = ${f3(x)}${dots(x)}\\,\\text{m} \\approx ${decTex(ans)}\\,\\text{m}`],
				// the 2 forgotten; the square forgotten; g forgotten
				answer: choiceOf(rng, mOpt(ans), opts([r2((V * V) / G), r2(V / (2 * G)), r2((V * V) / 2)], mOpt), fall(x, mOpt)),
				params: { case: 'altezza', v0 },
			};
		return {
			prompt: 'Trova il tempo di volo.',
			problem: textBlock(`${lead} Dopo quanto tempo torna al punto di lancio? ${AIR}`),
			solution: `t_{volo} \\approx ${decTex(ans)}\\,\\text{s}`,
			steps: [
				t('La salita dura ') + ` v_0/g` + t(', e la discesa dura quanto la salita:'),
				`t_{volo} = \\dfrac{2v_0}{g} = \\dfrac{2 \\cdot ${ms(v0)}}{${gTex}} = ${f3(x)}${dots(x)}\\,\\text{s} \\approx ${decTex(ans)}\\,\\text{s}`,
			],
			// only the way up; the height's formula; the ratio upside down
			answer: choiceOf(rng, sOpt(ans), opts([r2(V / G), r2((V * V) / G), r2((2 * G) / V)], sOpt), fall(x, sOpt)),
			params: { case: 'volo', v0 },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the signed velocity after a time

function level5(rng: Rng): Built {
	const down = rng.next() < 0.5;
	for (;;) {
		const v0 = two(rng, 5, 30), tt = two(rng, 1.1, 6);
		const V = Number(v0), T = Number(tt);
		if (T >= (2 * V) / G) continue;
		const x = V - G * T;
		if (down ? x > -1 : x < 1) continue;
		const ans = r2(x);
		if (ans === null) continue;
		return {
			prompt: 'Trova la velocità, con il segno.',
			problem: textBlock(`Una palla viene lanciata verticalmente verso l'alto a ${pq(v0, 'm/s')}. Con l'asse rivolto verso l'alto, quanto vale la sua velocità dopo ${pq(tt, 's')}? ${AIR}`),
			solution: `v \\approx ${ms(ans)}`,
			steps: [
				t("Con l'asse verso l'alto l'accelerazione è ") + ` -g` + t(', in salita e in discesa:'),
				`v = v_0 - g\\,t = ${ms(v0)} - ${gTex} \\cdot ${decTex(tt)}\\,\\text{s} = ${f3(x)}\\,\\text{m/s} \\approx ${ms(ans)}`,
				down ? t('La velocità è negativa: la palla sta già scendendo.') : t('La velocità è positiva: la palla sta ancora salendo.'),
			],
			// the sign swapped; g with the wrong sign; the half of the distance law
			answer: choiceOf(rng, msOpt(ans), opts([r2(-x), r2(V + G * T), r2(V - 0.5 * G * T)], msOpt), fall(x, msOpt)),
			params: { case: down ? 'scende' : 'sale', v0, t: tt },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: a throw upwards from a height

function level6(rng: Rng): Built {
	for (;;) {
		const y0 = two(rng, 1.1, 40), v0 = two(rng, 1.1, 20);
		const Y = Number(y0), V = Number(v0);
		const root = Math.sqrt(V * V + 2 * G * Y);
		const x = (V + root) / G;
		const ans = r2(x);
		if (ans === null) continue;
		const up = V / G, top = Y + (V * V) / (2 * G), down = Math.sqrt((2 * top) / G);
		return {
			prompt: 'Trova il tempo di volo.',
			problem: textBlock(`Da un balcone alto ${pq(y0, 'm')} una palla viene lanciata verticalmente verso l'alto a ${pq(v0, 'm/s')}, e poi cade fino al suolo. Dopo quanto tempo tocca il suolo? ${AIR}`),
			solution: `t \\approx ${decTex(ans)}\\,\\text{s}`,
			steps: [
				t('Salita: ') + ` t_1 = \\dfrac{v_0}{g} = ${f3(up)}\\ldots\\,\\text{s}` + t(', fino a ') + ` ${decTex(y0)}\\,\\text{m} + \\dfrac{v_0^2}{2g} = ${f3(top)}\\ldots\\,\\text{m}`,
				t('Caduta da ferma dal punto più alto: ') + ` t_2 = \\sqrt{\\dfrac{2 \\cdot ${f3(top)}\\,\\text{m}}{${gTex}}} = ${f3(down)}\\ldots\\,\\text{s}`,
				`t = t_1 + t_2 = ${f3(x)}\\ldots\\,\\text{s} \\approx ${decTex(ans)}\\,\\text{s}`,
			],
			// the height ignored (back to the balcony); the throw ignored (dropped); the extra height of the way up ignored; a throw downwards
			answer: choiceOf(rng, sOpt(ans), opts([r2((2 * V) / G), r2(Math.sqrt((2 * Y) / G)), r2(up + Math.sqrt((2 * Y) / G)), r2((root - V) / G)], sOpt), fall(x, sOpt)),
			params: { case: 'balcone', y0, v0 },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const fisCadutaLibera: Generator = {
	id: ID,
	title: 'La caduta libera e il lancio verticale',
	levels: {
		1: { label: 'Dal tempo di caduta', constraints: ['h = g t²/2 o v = g t, metà ciascuno'] },
		2: { label: 'Il tempo di caduta', constraints: ['t = √(2h/g)'] },
		3: { label: "La velocità d'arrivo", constraints: ['v = √(2gh)'] },
		4: { label: "Il lancio verso l'alto", constraints: ['altezza massima o tempo di volo, metà ciascuno'] },
		5: { label: 'La velocità con il segno', constraints: ["asse verso l'alto", 'in salita o in discesa, metà ciascuno'] },
		6: { label: 'Il lancio da un balcone', constraints: ["lanciata verso l'alto, cade fino al suolo"] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisCadutaLibera;
