/**
 * La pressione atmosferica e la sua misura. Spec: specs/exercises/fis-pressione-atmosferica.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/29-fis-pressione-atmosferica.md): the units of pressure
 * (hPa, Pa, bar); millimetres of mercury and hectopascals (1 mmHg = 1,33 hPa); the force of the air on a surface,
 * F = p S; the height of a barometer's column with another liquid, h = p / (d g); the force on a suction cup or on
 * Magdeburg hemispheres, F = (p0 − p_int) π r² with π = 3,14. Numbers built backwards, never a tie in the rounding,
 * multiple choice with the unit in the option and the lesson's mistakes: hPa taken for Pa, cm² not converted, the
 * formula upside down, the pressure inside forgotten, the diameter taken for the radius.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { Rational, q } from '../rational';
import { type Built, type Format, type R, commonCheck, dec, fixed, generateWith, isTie, n, numberOptions, roundSig, sig } from '../fisica-forze';

export const ID = 'fis-pressione-atmosferica';

const G = q(98, 10);
const PI = q(314, 100);
const S2 = { kind: 'sig', s: 2 } as const;
const S3 = { kind: 'sig', s: 3 } as const;
const EXACT = { kind: 'exact' } as const;

/** A unit upright, with its power outside \text: cm^3 → \text{cm}^3. */
export function unitTex(u: string): string {
	const m = /^(.*?)(\^\d)?$/.exec(u)!;
	return `\\text{${m[1]}}${m[2] ?? ''}`;
}
/** A number and its unit with the thin space. */
export const wu = (num: string, u: string) => `${num}\\,${unitTex(u)}`;
/** The same between dollars, for prose. */
const pw = (num: string, u: string) => `$${wu(num, u)}$`;

/** The options of the answer: numberOptions without a unit, then the unit (which may have a power) on each. */
export function optionsWithUnit(rng: Rng, value: R, mistakes: R[], u: string, f: Format): ChoiceAnswer {
	const ch = numberOptions(rng, value, mistakes, '', f);
	return { ...ch, options: ch.options.map((o) => ({ ...o, latex: wu(o.latex, u) })) };
}

// ---------------------------------------------------------------------------
// Level 1: the units of pressure (exact conversions)

function level1(rng: Rng): Built {
	const kind = rng.pick(['hpa-pa', 'pa-hpa', 'hpa-bar', 'bar-pa'] as const);
	if (kind === 'bar-pa') {
		const x = q(rng.int(4, 18), 2); // 2,0 to 9,0 bar
		const pa = x.mul(n(100000));
		return {
			prompt: 'Converti la pressione.',
			problem: textBlock(`Un manometro segna ${pw(fixed(x, 1), 'bar')}. Quanto vale la pressione in pascal?`),
			solution: `p = ${wu(dec(pa), 'Pa')}`,
			steps: [`1\\,\\text{bar} = 10^5\\,\\text{Pa}`, `${fixed(x, 1)}\\,\\text{bar} = ${fixed(x, 1)} \\cdot 10^5\\,\\text{Pa} = ${wu(dec(pa), 'Pa')}`],
			answer: pa,
			unit: 'Pa',
			format: EXACT,
			// bar taken as 1000 Pa, as 10 000 Pa, as 10^6 Pa
			mistakes: [x.mul(n(1000)), x.mul(n(10000)), x.mul(n(1000000))],
			params: { case: kind, bar: x.toString() },
		};
	}
	const p = n(rng.int(950, 1050));
	const pa = p.mul(n(100));
	if (kind === 'hpa-pa')
		return {
			prompt: 'Converti la pressione.',
			problem: textBlock(`Un barometro segna ${pw(dec(p), 'hPa')}. Quanto vale la pressione in pascal?`),
			solution: `p = ${wu(dec(pa), 'Pa')}`,
			steps: [`1\\,\\text{hPa} = 100\\,\\text{Pa}`, `${dec(p)}\\,\\text{hPa} = ${dec(p)} \\cdot 100\\,\\text{Pa} = ${wu(dec(pa), 'Pa')}`],
			answer: pa,
			unit: 'Pa',
			format: EXACT,
			// etto taken for ten, for a thousand; divided instead of multiplied
			mistakes: [p.mul(n(10)), p.mul(n(1000)), p.div(n(100))],
			params: { case: kind, hPa: p.toString() },
		};
	if (kind === 'pa-hpa')
		return {
			prompt: 'Converti la pressione.',
			problem: textBlock(`La pressione dell'aria è ${pw(dec(pa), 'Pa')}. Quanto vale in ettopascal?`),
			solution: `p = ${wu(dec(p), 'hPa')}`,
			steps: [`1\\,\\text{hPa} = 100\\,\\text{Pa}`, `${dec(pa)}\\,\\text{Pa} = \\dfrac{${dec(pa)}}{100}\\,\\text{hPa} = ${wu(dec(p), 'hPa')}`],
			answer: p,
			unit: 'hPa',
			format: EXACT,
			// divided by ten, by a thousand; multiplied
			mistakes: [pa.div(n(10)), pa.div(n(1000)), pa.mul(n(100))],
			params: { case: kind, Pa: pa.toString() },
		};
	const bar = p.div(n(1000));
	return {
		prompt: 'Converti la pressione.',
		problem: textBlock(`Un barometro segna ${pw(dec(p), 'hPa')}. Quanto vale la pressione in bar?`),
		solution: `p = ${wu(dec(bar), 'bar')}`,
		steps: [`1\\,\\text{bar} = 1000\\,\\text{hPa}`, `${dec(p)}\\,\\text{hPa} = \\dfrac{${dec(p)}}{1000}\\,\\text{bar} = ${wu(dec(bar), 'bar')}`],
		answer: bar,
		unit: 'bar',
		format: EXACT,
		// divided by a hundred, by ten; not divided
		mistakes: [p.div(n(100)), p.div(n(10)), p],
		params: { case: kind, hPa: p.toString() },
	};
}

// ---------------------------------------------------------------------------
// Level 2: millimetres of mercury and hectopascals

const MMHG = q(133, 100); // hPa per mmHg, as the lesson rounds it

function level2(rng: Rng): Built {
	for (;;) {
		if (rng.next() < 0.5) {
			const h = n(rng.int(700, 751));
			const exact = h.mul(MMHG);
			if (isTie(exact, 3)) continue;
			const p = roundSig(exact, 3);
			return {
				prompt: 'Converti la pressione.',
				problem: textBlock(`Un barometro a mercurio segna ${pw(dec(h), 'mmHg')}. Quanto vale la pressione in ettopascal? ($${wu('1', 'mmHg')} = ${wu('1{,}33', 'hPa')}$)`),
				solution: `p = ${wu(sig(p, 3), 'hPa')}`,
				steps: [`p = ${dec(h)} \\cdot 1{,}33\\,\\text{hPa} = ${wu(dec(exact), 'hPa')} \\approx ${wu(sig(p, 3), 'hPa')}`],
				answer: p,
				unit: 'hPa',
				format: S3,
				// divided instead of multiplied; the same number; the value in pascal
				mistakes: [h.div(MMHG), h, exact.mul(n(100))],
				params: { case: 'mmhg-hpa', mmHg: h.toString() },
			};
		}
		const p = n(rng.int(940, 1040));
		const exact = p.div(MMHG);
		if (isTie(exact, 3)) continue;
		const h = roundSig(exact, 3);
		return {
			prompt: 'Converti la pressione.',
			problem: textBlock(`Le previsioni del tempo danno una pressione di ${pw(dec(p), 'hPa')}. A quanti millimetri di mercurio corrisponde? ($${wu('1', 'mmHg')} = ${wu('1{,}33', 'hPa')}$)`),
			solution: `p = ${wu(sig(h, 3), 'mmHg')}`,
			steps: [`p = \\dfrac{${dec(p)}}{1{,}33}\\,\\text{mmHg} \\approx ${wu(sig(h, 3), 'mmHg')}`],
			answer: h,
			unit: 'mmHg',
			format: S3,
			// multiplied instead of divided; the same number; centimetres of mercury
			mistakes: [p.mul(MMHG), p, exact.div(n(10))],
			params: { case: 'hpa-mmhg', hPa: p.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the force of the air on a surface

const BIG = [
	{ what: 'Il piano di un tavolo', face: 'sulla sua faccia superiore' },
	{ what: 'Una porta', face: 'su una delle sue facce' },
	{ what: 'Il vetro di una finestra', face: 'su una delle sue facce' },
];
const SMALL = [
	{ what: 'La copertina di un libro', face: 'sulla copertina' },
	{ what: 'Una piastrella', face: 'sulla piastrella' },
	{ what: 'Lo schermo di un tablet', face: 'sullo schermo' },
];

function level3(rng: Rng): Built {
	for (;;) {
		const p = n(rng.int(990, 1030));
		const pa = p.mul(n(100));
		const inCm = rng.next() < 0.5;
		if (inCm) {
			const a = n(rng.int(10, 40)), b = n(rng.int(10, 40));
			if (a.equals(b)) continue;
			const S = a.mul(b).div(n(10000));
			const exact = pa.mul(S);
			if (isTie(exact, 2)) continue;
			const F = roundSig(exact, 2);
			const o = rng.pick(SMALL);
			return {
				prompt: 'Calcola la forza.',
				problem: textBlock(`${o.what} misura ${pw(dec(a), 'cm')} per ${pw(dec(b), 'cm')}. Con quale forza l'aria preme ${o.face}, se la pressione è ${pw(dec(p), 'hPa')}?`),
				solution: `F = ${wu(sig(F, 2), 'N')}`,
				steps: [
					`S = ${dec(a)}\\,\\text{cm} \\cdot ${dec(b)}\\,\\text{cm} = ${wu(dec(a.mul(b)), 'cm^2')} = ${wu(dec(S), 'm^2')}`,
					`p = ${dec(p)}\\,\\text{hPa} = ${wu(dec(pa), 'Pa')}`,
					`F = p \\cdot S = ${dec(pa)}\\,\\text{Pa} \\cdot ${dec(S)}\\,\\text{m}^2 = ${wu(dec(exact), 'N')} \\approx ${wu(sig(F, 2), 'N')}`,
				],
				answer: F,
				unit: 'N',
				format: S2,
				// hPa not converted; cm² not converted; the perimeter for the area
				mistakes: [exact.div(n(100)), exact.mul(n(10000)), pa.mul(a.add(b).mul(n(2))).div(n(100))],
				params: { case: 'cm2', hPa: p.toString(), a: a.toString(), b: b.toString() },
			};
		}
		const a = q(rng.int(10, 25), 10), b = q(rng.int(50, 99), 100);
		const S = a.mul(b);
		const exact = pa.mul(S);
		if (isTie(exact, 2)) continue;
		const F = roundSig(exact, 2);
		const o = rng.pick(BIG);
		return {
			prompt: 'Calcola la forza.',
			problem: textBlock(`${o.what} misura ${pw(fixed(a, 1), 'm')} per ${pw(fixed(b, 2), 'm')}. Con quale forza l'aria preme ${o.face}, se la pressione è ${pw(dec(p), 'hPa')}?`),
			solution: `F = ${wu(sig(F, 2), 'N')}`,
			steps: [
				`S = ${fixed(a, 1)}\\,\\text{m} \\cdot ${fixed(b, 2)}\\,\\text{m} = ${wu(dec(S), 'm^2')}`,
				`p = ${dec(p)}\\,\\text{hPa} = ${wu(dec(pa), 'Pa')}`,
				`F = p \\cdot S = ${dec(pa)}\\,\\text{Pa} \\cdot ${dec(S)}\\,\\text{m}^2 = ${wu(dec(exact), 'N')} \\approx ${wu(sig(F, 2), 'N')}`,
			],
			answer: F,
			unit: 'N',
			format: S2,
			// hPa not converted; the perimeter for the area; hPa taken for a thousand pascal
			mistakes: [exact.div(n(100)), pa.mul(a.add(b).mul(n(2))), exact.mul(n(10))],
			params: { case: 'm2', hPa: p.toString(), a: a.toString(), b: b.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the height of a barometer's column

export const LIQUIDS = {
	acqua: { d: n(1000), name: "l'acqua" },
	olio: { d: n(920), name: "l'olio d'oliva" },
	alcol: { d: n(790), name: "l'alcol etilico" },
	glicerina: { d: n(1260), name: 'la glicerina' },
	mercurio: { d: n(13600), name: 'il mercurio' },
} as const;
type Liquid = keyof typeof LIQUIDS;

function level4(rng: Rng): Built {
	for (;;) {
		const liq = rng.pick(Object.keys(LIQUIDS) as Liquid[]);
		const d = LIQUIDS[liq].d;
		const p = n(rng.int(950, 1040));
		const pa = p.mul(n(100));
		const exact = pa.div(d.mul(G));
		if (isTie(exact, 2)) continue;
		const h = roundSig(exact, 2);
		const other = liq === 'mercurio' ? LIQUIDS.acqua.d : LIQUIDS.mercurio.d;
		return {
			prompt: "Calcola l'altezza della colonna.",
			problem: textBlock(`Quanto sarebbe alta la colonna di un barometro fatto con ${LIQUIDS[liq].name} (densità ${pw(dec(d), 'kg/m^3')}), quando la pressione atmosferica è ${pw(dec(p), 'hPa')}?`),
			solution: `h = ${wu(sig(h, 2), 'm')}`,
			steps: [
				`p = ${dec(p)}\\,\\text{hPa} = ${wu(dec(pa), 'Pa')}`,
				`p = d \\cdot g \\cdot h \\quad\\Rightarrow\\quad h = \\dfrac{p}{d \\cdot g} = \\dfrac{${dec(pa)}\\,\\text{Pa}}{${dec(d)}\\,\\text{kg/m}^3 \\cdot 9{,}8\\,\\text{N/kg}} \\approx ${wu(sig(h, 2), 'm')}`,
			],
			answer: h,
			unit: 'm',
			format: S2,
			// hPa not converted; the formula upside down; the column of the other liquid (mercury, or water)
			mistakes: [exact.div(n(100)), d.mul(G).div(pa), pa.div(other.mul(G))],
			params: { case: liq, hPa: p.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: a suction cup and Magdeburg hemispheres

function level5(rng: Rng): Built {
	for (;;) {
		const p0 = n(rng.int(990, 1030));
		if (rng.next() < 0.5) {
			const r = q(rng.int(15, 45), 10); // cm
			const pin = n(10 * rng.int(20, 70));
			const dp = p0.sub(pin).mul(n(100));
			const S = PI.mul(r.mul(r)).div(n(10000));
			const exact = dp.mul(S);
			if (isTie(exact, 2)) continue;
			const F = roundSig(exact, 2);
			return {
				prompt: 'Calcola la forza.',
				problem: textBlock(
					`Una ventosa ha il raggio di ${pw(fixed(r, 1), 'cm')}. Sotto la ventosa la pressione è ${pw(dec(pin), 'hPa')}, fuori è ${pw(dec(p0), 'hPa')}. Con quale forza bisogna tirarla per staccarla? (usa $\\pi = 3{,}14$)`,
				),
				solution: `F = ${wu(sig(F, 2), 'N')}`,
				steps: [
					`p_0 - p_{int} = ${dec(p0)}\\,\\text{hPa} - ${dec(pin)}\\,\\text{hPa} = ${wu(dec(p0.sub(pin)), 'hPa')} = ${wu(dec(dp), 'Pa')}`,
					`S = \\pi r^2 = 3{,}14 \\cdot (${dec(r.div(n(100)))}\\,\\text{m})^2 \\approx ${wu(sig(S, 3), 'm^2')}`,
					`F = (p_0 - p_{int}) \\cdot S \\approx ${dec(dp)}\\,\\text{Pa} \\cdot ${sig(S, 3)}\\,\\text{m}^2 \\approx ${wu(sig(F, 2), 'N')}`,
				],
				answer: F,
				unit: 'N',
				format: S2,
				// the pressure inside forgotten; the two pressures added; the circumference for the area
				mistakes: [p0.mul(n(100)).mul(S), p0.add(pin).mul(n(100)).mul(S), dp.mul(PI).mul(r).mul(n(2)).div(n(100))],
				params: { case: 'ventosa', hPa: p0.toString(), pin: pin.toString(), r: r.toString() },
			};
		}
		const diam = n(2 * rng.int(10, 30)); // cm, even
		const pin = n(10 * rng.int(1, 10));
		const dp = p0.sub(pin).mul(n(100));
		const r = diam.div(n(200)); // m
		const S = PI.mul(r.mul(r));
		const exact = dp.mul(S);
		if (isTie(exact, 2)) continue;
		const F = roundSig(exact, 2);
		return {
			prompt: 'Calcola la forza.',
			problem: textBlock(
				`Due emisferi di Magdeburgo hanno il diametro di ${pw(dec(diam), 'cm')}. Dentro la sfera è rimasta aria alla pressione di ${pw(dec(pin), 'hPa')}, fuori la pressione è ${pw(dec(p0), 'hPa')}. Con quale forza bisogna tirare un emisfero per staccarlo? (usa $\\pi = 3{,}14$)`,
			),
			solution: `F = ${wu(sig(F, 2), 'N')}`,
			steps: [
				`p_0 - p_{int} = ${dec(p0)}\\,\\text{hPa} - ${dec(pin)}\\,\\text{hPa} = ${wu(dec(p0.sub(pin)), 'hPa')} = ${wu(dec(dp), 'Pa')}`,
				`r = \\dfrac{${dec(diam)}\\,\\text{cm}}{2} = ${wu(dec(r), 'm')} \\qquad S = \\pi r^2 = 3{,}14 \\cdot (${dec(r)}\\,\\text{m})^2 \\approx ${wu(sig(S, 3), 'm^2')}`,
				`F = (p_0 - p_{int}) \\cdot S \\approx ${dec(dp)}\\,\\text{Pa} \\cdot ${sig(S, 3)}\\,\\text{m}^2 \\approx ${wu(sig(F, 2), 'N')}`,
			],
			answer: F,
			unit: 'N',
			format: S2,
			// the diameter taken for the radius; the pressure inside forgotten; the two pressures added
			mistakes: [exact.mul(n(4)), p0.mul(n(100)).mul(S), p0.add(pin).mul(n(100)).mul(S)],
			params: { case: 'emisferi', hPa: p0.toString(), pin: pin.toString(), diametro: diam.toString() },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = commonCheck(sample);
	const ans = sample.answer.kind === 'number' ? sample.answer.value : '';
	if (((sample.params.mistakes as string[]) ?? []).filter((m) => m !== ans).length < 2) v.push('meno di due errori tipici');
	return v;
}

export const fisPressioneAtmosferica: Generator = {
	id: ID,
	title: 'La pressione atmosferica e la sua misura',
	levels: {
		1: { label: 'Le unità della pressione', constraints: ['hPa, Pa e bar', 'conversioni esatte'] },
		2: { label: 'Millimetri di mercurio ed ettopascal', constraints: ['1 mmHg = 1,33 hPa', 'tre cifre significative'] },
		3: { label: "La forza dell'aria su una superficie", constraints: ['F = p · S, pressione in hPa', 'lati in m o in cm'] },
		4: { label: 'La colonna di un barometro', constraints: ['h = p / (d · g)', 'acqua, olio, alcol, glicerina, mercurio'] },
		5: { label: 'La ventosa e gli emisferi', constraints: ['F = (p0 − pint) · π r², π = 3,14', 'raggio o diametro in cm'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
	toChoice: (sample, rng) => {
		if (sample.answer.kind !== 'number') throw new Error(`${ID}: no choice for ${sample.answer.kind}`);
		const mistakes = ((sample.params.mistakes ?? []) as string[]).map((s) => Rational.parse(s));
		return optionsWithUnit(rng, Rational.parse(sample.answer.value), mistakes, sample.params.unit as string, sample.params.format as Format);
	},
};


export default fisPressioneAtmosferica;
