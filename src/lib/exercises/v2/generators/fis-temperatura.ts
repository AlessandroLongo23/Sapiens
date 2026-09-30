/**
 * La temperatura e le scale termometriche. Spec: specs/exercises/fis-temperatura.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/65-fis-temperatura.md), each one step harder: Celsius
 * to kelvin and back (T = t + 273, the data are whole degrees); a difference of temperature, the same in the two
 * scales, also between a temperature in kelvin and one in degrees Celsius; Celsius to Fahrenheit, t_F = 9/5 t + 32;
 * Fahrenheit to Celsius, t = 5/9 (t_F − 32); the calibration of a thermometer from the two fixed points. Numbers are
 * built backwards so that every answer is a whole number of degrees (or a length with one decimal); multiple choice
 * with the unit in the option, distractors from the lesson's warnings: 273 added to a difference, the sign of a
 * negative temperature lost, the 32 in the wrong place, the column measured from the base of the capillary.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { type Built, type R, INT, checkCommon, fmt, fmtExact, generateWith, options, pd, pu, q, t, wu } from '../fis-termologia';

export const ID = 'fis-temperatura';

const K273 = q(273);
const tex = (r: R) => fmtExact(r);
/** In a product or after a minus: a negative value between parentheses. */
const par = (r: R) => (r.sign() < 0 ? `(${tex(r)})` : tex(r));

// ---------------------------------------------------------------------------
// Level 1: Celsius and kelvin

function level1(rng: Rng): Built {
	const toK = rng.next() < 0.5;
	for (;;) {
		if (toK) {
			const tc = q(rng.int(-60, 300));
			if (tc.sign() === 0) continue;
			const T = tc.add(K273);
			return {
				prompt: 'Converti in kelvin.',
				problem: textBlock(`Un termometro segna ${pd(tc, 'C')}. Quanto vale la temperatura assoluta?`),
				solution: `T = ${wu(tex(T), 'K')}`,
				steps: [t('Con i gradi interi basta 273:'), `T = t + 273 = ${tex(tc)} + 273 = ${wu(tex(T), 'K')}`],
				// 273 minus t; the sign of a negative temperature lost; 373 in place of 273; no conversion
				answer: options(rng, T, [K273.sub(tc), tc.sign() < 0 ? tc.abs().add(K273) : null, tc.add(q(373)), tc], 'K', INT, false, q(10)),
				params: { case: 'celsius-kelvin', t: tc.toString() },
			};
		}
		const T = q(rng.int(150, 600));
		const tc = T.sub(K273);
		if (tc.sign() === 0) continue;
		return {
			prompt: 'Converti in gradi Celsius.',
			problem: textBlock(`Un corpo è alla temperatura assoluta di ${pd(T, 'K')}. Quanto vale la sua temperatura in gradi Celsius?`),
			solution: `t = ${wu(tex(tc), 'C')}`,
			steps: [t('Con i gradi interi basta 273:'), `t = T - 273 = ${tex(T)} - 273 = ${wu(tex(tc), 'C')}`],
			// 273 added; the sign flipped; 373; no conversion
			answer: options(rng, tc, [T.add(K273), K273.sub(T), T.sub(q(373)), T], 'C', INT, true, q(10)),
			params: { case: 'kelvin-celsius', T: T.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: differences of temperature

function level2(rng: Rng): Built {
	const mixed = rng.next() < 0.5;
	for (;;) {
		const d = q(rng.int(5, 120));
		if (!mixed) {
			const t1 = q(rng.int(-30, 60));
			const t2 = t1.add(d);
			const who = rng.pick(['Un liquido', "Un blocco d'alluminio", "L'aria di una stanza", 'Un gas']);
			return {
				prompt: 'Trova la differenza di temperatura.',
				problem: textBlock(`${who} passa da ${pd(t1, 'C')} a ${pd(t2, 'C')}. Di quanti kelvin è aumentata la sua temperatura?`),
				solution: `\\Delta T = ${wu(tex(d), 'K')}`,
				steps: [`\\Delta t = ${tex(t2)} - ${par(t1)} = ${wu(tex(d), 'C')}`, t('Il grado Celsius e il kelvin sono larghi uguali: la differenza ha lo stesso numero.'), `\\Delta T = \\Delta t = ${wu(tex(d), 'K')}`],
				// 273 added to the difference; the final temperature in kelvin; the two temperatures added
				answer: options(rng, d, [d.add(K273), t2.add(K273), t2.add(t1).abs()], 'K', INT, false, q(5)),
				params: { case: 'stessa-scala', t1: t1.toString(), t2: t2.toString() },
			};
		}
		const T1 = q(rng.int(250, 330));
		const t2 = T1.sub(K273).add(d);
		const who = rng.pick(['Un liquido', 'Un gas', "Un campione d'acqua"]);
		return {
			prompt: 'Trova la differenza di temperatura.',
			problem: textBlock(`${who} passa da ${pd(T1, 'K')} a ${pd(t2, 'C')}. Di quanti gradi Celsius è aumentata la sua temperatura?`),
			solution: `\\Delta t = ${wu(tex(d), 'C')}`,
			steps: [
				t('Prima la temperatura iniziale in gradi Celsius:') + ` \\; t_1 = ${tex(T1)} - 273 = ${wu(tex(T1.sub(K273)), 'C')}`,
				`\\Delta t = ${tex(t2)} - ${par(T1.sub(K273))} = ${wu(tex(d), 'C')}`,
			],
			// kelvin and Celsius subtracted without converting; 273 added to the difference; 273 added the wrong way
			answer: options(rng, d, [T1.sub(t2).abs(), d.add(K273), t2.sub(T1.add(K273)).abs()], 'C', INT, false, q(5)),
			params: { case: 'scale-diverse', T1: T1.toString(), t2: t2.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Levels 3 and 4: Fahrenheit

/** Where the temperature comes from, by its value in degrees Celsius. */
const whereC = (c: number) => (c >= 150 ? 'La ricetta di una torta dice di scaldare il forno a' : c >= -20 && c <= 40 ? 'Le previsioni del tempo di Roma danno' : 'Un termometro segna');
const whereF = (c: number) => (c >= 120 ? 'Una ricetta americana dice di scaldare il forno a' : c >= -20 && c <= 40 ? 'A New York le previsioni danno' : 'Un termometro americano segna');

function level3(rng: Rng): Built {
	for (;;) {
		const k = rng.int(-8, 50);
		if (k === 0) continue;
		const tc = q(5 * k);
		const tf = q(9 * k + 32);
		if (tf.sign() === 0) continue;
		const where = whereC(5 * k);
		return {
			prompt: 'Converti in gradi Fahrenheit.',
			problem: textBlock(`${where} ${pd(tc, 'C')}. Quanto vale questa temperatura in gradi Fahrenheit?`),
			solution: `t_F = ${wu(tex(tf), 'F')}`,
			steps: [`t_F = \\dfrac{9}{5}\\,t + 32 = \\dfrac{9}{5} \\cdot ${par(tc)} + 32 = ${tex(q(9 * k))} + 32 = ${wu(tex(tf), 'F')}`],
			// the 32 forgotten; 5/9 in place of 9/5; the 32 added before multiplying; only 32 added
			answer: options(rng, tf, [q(9 * k), tc.mul(q(5, 9)).add(q(32)), tc.add(q(32)).mul(q(9, 5)), tc.add(q(32))], 'F', INT, true, q(5)),
			params: { case: 'celsius-fahrenheit', t: tc.toString() },
		};
	}
}

function level4(rng: Rng): Built {
	for (;;) {
		const k = rng.int(-8, 30);
		if (k === 0) continue;
		const tf = q(9 * k + 32);
		const tc = q(5 * k);
		if (tf.sign() === 0) continue;
		const where = whereF(5 * k);
		return {
			prompt: 'Converti in gradi Celsius.',
			problem: textBlock(`${where} ${pd(tf, 'F')}. Quanto vale questa temperatura in gradi Celsius?`),
			solution: `t = ${wu(tex(tc), 'C')}`,
			steps: [`t = \\dfrac{5}{9}\\,(t_F - 32) = \\dfrac{5}{9} \\cdot (${tex(tf)} - 32) = \\dfrac{5}{9} \\cdot ${par(q(9 * k))} = ${wu(tex(tc), 'C')}`],
			// the 32 taken away after multiplying; the 32 forgotten; only 32 taken away; 9/5 in place of 5/9
			answer: options(rng, tc, [tf.mul(q(5, 9)).sub(q(32)), tf.mul(q(5, 9)), tf.sub(q(32)), tf.sub(q(32)).mul(q(9, 5))], 'C', INT, true, q(5)),
			params: { case: 'fahrenheit-celsius', tF: tf.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the calibration

const D_TENTHS = [100, 120, 150, 160, 200, 250];
const F1 = { kind: 'fixed', d: 1 } as const;
const cm1 = (r: R) => fmt(r, F1);

function level5(rng: Rng): Built {
	const reading = rng.next() < 0.5;
	for (;;) {
		const L0 = q(rng.int(10, 50), 10);
		const D = q(rng.pick(D_TENTHS), 10);
		const tc = rng.int(5, 95);
		const rise = D.mul(q(tc, 100));
		if (rise.mul(q(10)).den !== 1) continue;
		const L100 = L0.add(D);
		const L = L0.add(rise);
		const intro = `Nel ghiaccio fondente la colonna di un termometro è lunga ${pu(cm1(L0), 'cm')}, nell'acqua bollente ${pu(cm1(L100), 'cm')}, misurate dalla base del capillare.`;
		if (reading) {
			return {
				prompt: 'Trova la temperatura.',
				problem: textBlock(`${intro} In una stanza la colonna è lunga ${pu(cm1(L), 'cm')}. Che temperatura c'è nella stanza?`),
				solution: `t = ${wu(String(tc), 'C')}`,
				steps: [
					`L_{100} - L_0 = ${cm1(L100)} - ${cm1(L0)} = ${wu(cm1(D), 'cm')} \\quad ${t('per')} \\quad ${wu('100', 'C')}`,
					`L - L_0 = ${cm1(L)} - ${cm1(L0)} = ${wu(cm1(rise), 'cm')}`,
					`t = \\dfrac{${cm1(rise)}\\,\\text{cm}}{${cm1(D)}\\,\\text{cm}} \\cdot ${wu('100', 'C')} = ${wu(String(tc), 'C')}`,
				],
				// the column from the base of the capillary; only the zero forgotten below; L over the stretch
				answer: options(rng, q(tc), [L.div(L100).mul(q(100)), rise.div(L100).mul(q(100)), L.div(D).mul(q(100))], 'C', INT, false, q(5)),
				params: { case: 'lettura', L0: L0.toString(), L100: L100.toString(), L: L.toString() },
			};
		}
		return {
			prompt: 'Trova la lunghezza della colonna.',
			problem: textBlock(`${intro} Quanto è lunga la colonna a ${pu(String(tc), 'C')}?`),
			solution: `L = ${wu(cm1(L), 'cm')}`,
			steps: [
				`${t('Ogni grado vale')} \\; \\dfrac{${cm1(D)}\\,\\text{cm}}{100}`,
				`L - L_0 = \\dfrac{${tc}}{100} \\cdot ${wu(cm1(D), 'cm')} = ${wu(cm1(rise), 'cm')}`,
				`L = ${cm1(L0)} + ${cm1(rise)} = ${wu(cm1(L), 'cm')}`,
			],
			// the whole column taken as the scale; the zero's length forgotten; the whole column plus the zero
			answer: options(rng, L, [L100.mul(q(tc, 100)), rise, L0.add(L100.mul(q(tc, 100)))], 'cm', F1, false, q(5, 10)),
			params: { case: 'colonna', L0: L0.toString(), L100: L100.toString(), t: String(tc) },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const fisTemperatura: Generator = {
	id: ID,
	title: 'La temperatura e le scale termometriche',
	levels: {
		1: { label: 'Celsius e kelvin', constraints: ['T = t + 273, gradi interi', 'da Celsius a kelvin o da kelvin a Celsius, metà ciascuno'] },
		2: { label: 'Le differenze di temperatura', constraints: ['ΔT = Δt', 'due temperature Celsius, o una in kelvin e una in Celsius'] },
		3: { label: 'Da Celsius a Fahrenheit', constraints: ['t_F = 9/5 t + 32', 't multiplo di 5, da −40 a 250 °C'] },
		4: { label: 'Da Fahrenheit a Celsius', constraints: ['t = 5/9 (t_F − 32)', 'risultato intero, da −40 a 150 °C'] },
		5: { label: 'La taratura del termometro', constraints: ['i due punti fissi e una lettura', 'la temperatura dalla colonna, o la colonna dalla temperatura'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisTemperatura;
