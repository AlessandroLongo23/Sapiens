/**
 * Massa, volume e densità (chemistry, first year). Spec: specs/exercises/chim-massa-volume-densita.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/11-chim-massa-volume-densita.md), each one step harder:
 * the density from mass and volume; the mass or the volume from the density; the same with units that do not agree
 * (kg/m³, litres, kilograms); the density of a liquid weighed by difference in a beaker; the density of a metal
 * granule measured by immersion in a graduated cylinder; floating or sinking, comparing the density found with those
 * of the lesson's liquids. Results rounded to the significant figures of the datum with fewest (lesson 13), never at a
 * rounding tie. Distractors from the lesson's warnings: V/m for m/V, the beaker's mass left in, the volume read
 * after the immersion taken for the solid's, the units not converted.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { shuffle, textBlock } from '../insiemi';
import { type Built, type R, type Written, U, around, answerOf, checkCommon, choose, datum, dec, decimals, generateWith, pu, q, sigSafe, t, wu } from '../chim-misure';

export const ID = 'chim-massa-volume-densita';

/** Densities of the lesson's table, g/mL at 20 °C, three significant figures. */
const LIQUIDS = [
	{ nome: "l'etanolo", di: "dell'etanolo", d: q(789, 1000) },
	{ nome: 'la glicerina', di: 'della glicerina', d: q(126, 100) },
	{ nome: "l'acido solforico concentrato", di: "dell'acido solforico concentrato", d: q(184, 100) },
	{ nome: 'il mercurio', di: 'del mercurio', d: q(136, 10) },
];
const METALS = [
	{ nome: 'alluminio', d: q(270, 100) },
	{ nome: 'ferro', d: q(787, 100) },
	{ nome: 'rame', d: q(896, 100) },
	{ nome: 'piombo', d: q(113, 10) },
];

/** A datum with three significant figures from 10,0 to 99,9 (one decimal), never ending in 0. */
function three(rng: Rng): R {
	for (;;) {
		const k = rng.int(100, 999);
		if (k % 10) return datum(k, 1);
	}
}

/** The exact value rounded to n figures, refusing near-ties (the caller draws again). */
function must(x: R, n: number): Written {
	const w = sigSafe(x, n);
	if (!w) throw new Error('tie');
	return w;
}

/** A whole number ending in zero: its figures would be ambiguous as a datum. */
const ambiguous = (r: R) => r.den === 1 && r.num % 10 === 0;

/** The significant figures of a datum with d decimals. */
function sigOf(r: R, d: number): number {
	return dec(r, d).replace('{,}', '').replace(/\\,/g, '').replace(/^0+/, '').length;
}

// ---------------------------------------------------------------------------
// Level 1: the density

function level1(rng: Rng): Built {
	const solid = rng.next() < 0.4;
	const u = solid ? 'cm^3' : 'mL';
	const du = solid ? 'g/cm^3' : 'g/mL';
	const V = three(rng);
	// a density from 0,50 to 15 g/mL, the mass rounded to three figures
	const target = q(rng.int(50, 1500), 100);
	const mw = must(target.mul(V), 3);
	const m = mw.v;
	if (m.compare(q(1000)) >= 0 || ambiguous(m)) throw new Error('big');
	const d = m.div(V);
	const ans = must(d, 3);
	const what = solid ? 'Un campione di un solido' : 'Un campione di un liquido';
	return {
		prompt: 'Trova la densità.',
		problem: textBlock(`${what} ha la massa di ${pu(mw.tex, 'g')} e il volume di ${pu(dec(V), u)}. Quanto vale la sua densità?`),
		solution: `d \\approx ${wu(ans.tex, du)}`,
		steps: [`d = \\dfrac{m}{V} = \\dfrac{${wu(mw.tex, 'g')}}{${wu(dec(V), u)}} = ${decApprox(d)}\\,${U(du)}`, t('Tre cifre significative, come i dati.')],
		answer: answerOf(rng, ans, du, [V.div(m), m.mul(V)], around(d)),
		params: { case: solid ? 'solido' : 'liquido', m: m.toString(), V: V.toString() },
	};
}

/** x for the steps: exact when it has at most four decimals, otherwise five figures and dots (0{,}78920\ldots). */
function decApprox(x: R): string {
	if (decimals(x) <= 4) return dec(x);
	const v = x.num / x.den;
	const k = Math.max(0, 4 - Math.floor(Math.log10(v)));
	const [i, f] = v.toFixed(k).split('.');
	const int = i.length >= 5 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : i;
	return `${int}${f ? `{,}${f}` : ''}\\ldots`;
}

// ---------------------------------------------------------------------------
// Level 2: mass or volume from the density

function level2(rng: Rng): Built {
	const findMass = rng.next() < 0.5;
	if (findMass) {
		const useMetal = rng.next() < 0.4;
		const s = useMetal ? rng.pick(METALS) : rng.pick(LIQUIDS);
		const u = useMetal ? 'cm^3' : 'mL';
		const du = useMetal ? 'g/cm^3' : 'g/mL';
		const V = three(rng);
		const m = s.d.mul(V);
		const ans = must(m, 3);
		const problem = useMetal
			? `Un pezzo di ${s.nome} ha il volume di ${pu(dec(V), u)}. La densità del ${s.nome} è ${pu(dec(s.d), du)}. Quanto vale la sua massa?`
			: `La densità ${(s as (typeof LIQUIDS)[number]).di} è ${pu(dec(s.d), du)}. Quanto vale la massa di ${pu(dec(V), u)}?`;
		return {
			prompt: 'Trova la massa.',
			problem: textBlock(problem),
			solution: `m \\approx ${wu(ans.tex, 'g')}`,
			steps: [`m = d \\cdot V = ${wu(dec(s.d), du)} \\cdot ${wu(dec(V), u)} = ${decApprox(m)}\\,\\text{g}`, t('Tre cifre significative, come i dati.')],
			answer: answerOf(rng, ans, 'g', [V.div(s.d), s.d.div(V)], around(m)),
			params: { case: 'massa', d: s.d.toString(), V: V.toString() },
		};
	}
	const s = rng.pick(LIQUIDS);
	const m = three(rng);
	const V = m.div(s.d);
	const ans = must(V, 3);
	return {
		prompt: 'Trova il volume.',
		problem: textBlock(`La densità ${s.di} è ${pu(dec(s.d), 'g/mL')}. Quanti millilitri bisogna prelevare per averne ${pu(dec(m), 'g')}?`),
		solution: `V \\approx ${wu(ans.tex, 'mL')}`,
		steps: [`V = \\dfrac{m}{d} = \\dfrac{${wu(dec(m), 'g')}}{${wu(dec(s.d), 'g/mL')}} = ${decApprox(V)}\\,\\text{mL}`, t('Tre cifre significative, come i dati.')],
		answer: answerOf(rng, ans, 'mL', [m.mul(s.d), s.d.div(m)], around(V)),
		params: { case: 'volume', d: s.d.toString(), m: m.toString() },
	};
}

// ---------------------------------------------------------------------------
// Level 3: units that do not agree

function level3(rng: Rng): Built {
	const kind = rng.pick(['kgm3-massa', 'litri-kg', 'densita-kgm3'] as const);
	if (kind === 'kgm3-massa') {
		const s = rng.pick(LIQUIDS);
		const dk = s.d.mul(q(1000)); // kg/m³
		const V = three(rng);
		const m = s.d.mul(V);
		const ans = must(m, 3);
		return {
			prompt: 'Trova la massa.',
			problem: textBlock(`La densità ${s.di} è ${pu(dec(dk), 'kg/m^3')}. Quanti grammi pesano ${pu(dec(V), 'mL')}?`),
			solution: `m \\approx ${wu(ans.tex, 'g')}`,
			steps: [`${wu(dec(dk), 'kg/m^3')} = ${wu(dec(s.d), 'g/mL')}`, `m = d \\cdot V = ${wu(dec(s.d), 'g/mL')} \\cdot ${wu(dec(V), 'mL')} = ${decApprox(m)}\\,\\text{g}`],
			// the density not converted; converted the wrong way; a factor ten off
			answer: answerOf(rng, ans, 'g', [dk.mul(V), m.div(q(1000)), m.mul(q(10))], around(m)),
			params: { case: kind, d: dk.toString(), V: V.toString() },
		};
	}
	if (kind === 'litri-kg') {
		const s = rng.pick(LIQUIDS);
		const k = rng.int(100, 999);
		if (k % 10 === 0) throw new Error('zero');
		const V = datum(k, 2); // litres, 1,00 to 9,99
		const m = s.d.mul(V); // kg
		const ans = must(m, 3);
		return {
			prompt: 'Trova la massa.',
			problem: textBlock(`La densità ${s.di} è ${pu(dec(s.d), 'g/mL')}. Quanti chilogrammi pesano ${pu(dec(V), 'L')}?`),
			solution: `m \\approx ${wu(ans.tex, 'kg')}`,
			steps: [`${wu(dec(V), 'L')} = ${wu(dec(V.mul(q(1000))), 'mL')}`, `m = ${wu(dec(s.d), 'g/mL')} \\cdot ${wu(dec(V.mul(q(1000))), 'mL')} = ${wu(decApprox(m.mul(q(1000))), 'g')} = ${wu(decApprox(m), 'kg')}`],
			// grams written as kilograms; a thousand the other way; a factor ten
			answer: answerOf(rng, ans, 'kg', [m.mul(q(1000)), m.div(q(1000)), m.mul(q(10))], around(m)),
			params: { case: kind, d: s.d.toString(), V: V.toString() },
		};
	}
	const V = three(rng);
	const target = q(rng.int(50, 1500), 100);
	const mw = must(target.mul(V), 3);
	const m = mw.v;
	if (m.compare(q(1000)) >= 0 || ambiguous(m)) throw new Error('big');
	const d = m.div(V).mul(q(1000));
	const ans = must(d, 3);
	return {
		prompt: 'Trova la densità.',
		problem: textBlock(`Un liquido ha la massa di ${pu(mw.tex, 'g')} e il volume di ${pu(dec(V), 'mL')}. Quanto vale la sua densità in $\\text{kg/m}^3$?`),
		solution: `d \\approx ${wu(ans.tex, 'kg/m^3')}`,
		steps: [`d = \\dfrac{m}{V} = \\dfrac{${wu(mw.tex, 'g')}}{${wu(dec(V), 'mL')}} = ${decApprox(m.div(V))}\\,\\text{g/mL}`, `1\\,\\text{g/mL} = 1000\\,\\text{kg/m}^3 \\quad\\Rightarrow\\quad d \\approx ${wu(ans.tex, 'kg/m^3')}`],
		// not converted; a million; a thousand the wrong way
		answer: answerOf(rng, ans, 'kg/m^3', [d.div(q(1000)), d.mul(q(1000)), d.div(q(1000000))], around(d)),
		params: { case: kind, m: m.toString(), V: V.toString() },
	};
}

// ---------------------------------------------------------------------------
// Level 4: weighing by difference

const PIPETTES = [10, 20, 25, 50];
const LIQ4 = [q(789, 1000), q(998, 1000), q(103, 100), q(107, 100), q(126, 100), q(184, 100)];

function level4(rng: Rng): Built {
	const pipette = rng.next() < 0.5;
	const V = pipette ? q(rng.pick(PIPETTES)) : three(rng);
	const Vd = pipette ? 2 : 1;
	const d0 = rng.pick(LIQ4);
	const m1 = datum(rng.int(2500, 8000), 2);
	const mliq = q(Math.round((d0.num * V.num * 100) / (d0.den * V.den)), 100); // to the hundredth of a gram
	const m2 = m1.add(mliq);
	const n = Math.min(sigOf(mliq, 2), sigOf(V, Vd));
	const d = mliq.div(V);
	const ans = must(d, n);
	const tool = pipette ? 'con una pipetta tarata' : 'con un cilindro graduato';
	return {
		prompt: 'Trova la densità del liquido.',
		problem: textBlock(`Un becher vuoto ha la massa di ${pu(dec(m1, 2), 'g')}. Si prelevano ${tool} ${pu(dec(V, Vd), 'mL')} di un liquido e si versano nel becher, e la bilancia segna ${pu(dec(m2, 2), 'g')}. Quanto vale la densità del liquido?`),
		solution: `d \\approx ${wu(ans.tex, 'g/mL')}`,
		steps: [
			`m = ${wu(dec(m2, 2), 'g')} - ${wu(dec(m1, 2), 'g')} = ${wu(dec(mliq, 2), 'g')}`,
			`d = \\dfrac{m}{V} = \\dfrac{${wu(dec(mliq, 2), 'g')}}{${wu(dec(V, Vd), 'mL')}} = ${decApprox(d)}\\,\\text{g/mL}`,
			t(`${n === 3 ? 'Tre' : 'Quattro'} cifre significative, quelle del dato che ne ha meno.`),
		],
		// the beaker's mass left in; V/m; the empty beaker's mass
		answer: answerOf(rng, ans, 'g/mL', [m2.div(V), V.div(mliq), m1.div(V)], around(d)),
		params: { case: pipette ? 'pipetta' : 'cilindro', m1: m1.toString(), m2: m2.toString(), V: V.toString() },
	};
}

// ---------------------------------------------------------------------------
// Level 5: a metal by immersion

function level5(rng: Rng): Built {
	const metal = rng.pick(METALS);
	const V1 = q(rng.int(20, 60), 2); // 10,0 to 30,0 mL in half millilitres
	const V = q(rng.int(6, 36), 2); // 3,0 to 18,0 mL
	const V2 = V1.add(V);
	const m = q(Math.round((metal.d.num * V.num * 10) / (metal.d.den * V.den)), 10);
	if (m.compare(q(10)) < 0 || m.compare(q(1000)) >= 0) throw new Error('mass');
	const nV = V.compare(q(10)) >= 0 ? 3 : 2;
	const n = Math.min(nV, sigOf(m, 1));
	const d = m.div(V);
	const ans = must(d, n);
	return {
		prompt: 'Trova la densità del metallo.',
		problem: textBlock(`Un granulo di metallo ha la massa di ${pu(dec(m, 1), 'g')}. In un cilindro graduato l'acqua è a ${pu(dec(V1, 1), 'mL')}; si immerge il granulo, e l'acqua sale a ${pu(dec(V2, 1), 'mL')}. Quanto vale la densità del metallo?`),
		solution: `d \\approx ${wu(ans.tex, 'g/mL')}`,
		steps: [
			`V = ${wu(dec(V2, 1), 'mL')} - ${wu(dec(V1, 1), 'mL')} = ${wu(dec(V, 1), 'mL')}`,
			`d = \\dfrac{m}{V} = \\dfrac{${wu(dec(m, 1), 'g')}}{${wu(dec(V, 1), 'mL')}} = ${decApprox(d)}\\,\\text{g/mL} \\approx ${wu(ans.tex, 'g/mL')}`,
			t(`${n === 3 ? 'Tre' : 'Due'} cifre significative, come ${n === nV ? 'il volume' : 'la massa'}. Tra i metalli della lezione è il ${metal.nome}.`),
		],
		// the volume read after the immersion; the volume before; V/m
		answer: answerOf(rng, ans, 'g/mL', [m.div(V2), m.div(V1), V.div(m)], around(d)),
		params: { case: metal.nome, m: m.toString(), V1: V1.toString(), V2: V2.toString() },
	};
}

// ---------------------------------------------------------------------------
// Level 6: floating or sinking

const LIQ6 = [
	{ key: 'etanolo', nome: 'etanolo', art: "l'etanolo", d: q(789, 1000) },
	{ key: 'olio', nome: "olio d'oliva", art: "l'olio d'oliva", d: q(92, 100) },
	{ key: 'acqua', nome: 'acqua', art: "l'acqua", d: q(100, 100) },
	{ key: 'glicerina', nome: 'glicerina', art: 'la glicerina', d: q(126, 100) },
	{ key: 'mercurio', nome: 'mercurio', art: 'il mercurio', d: q(136, 10) },
];

function level6(rng: Rng): Built {
	const floats = rng.next() < 0.5;
	// the object's density between two neighbours of the list: `i` liquids are lighter than it
	const i = floats ? rng.pick([3, 4]) : rng.pick([1, 2]);
	const lo = LIQ6[i - 1].d, hi = LIQ6[i].d;
	const V = three(rng);
	const dT = lo.add(hi.sub(lo).mul(q(rng.int(20, 80), 100)));
	const mw = must(dT.mul(V), 3);
	const m = mw.v;
	if (ambiguous(m)) throw new Error('zero');
	const d = m.div(V);
	// at least 0,02 g/mL from both neighbours, so the rounded density is not on the edge
	if (d.sub(lo).compare(q(2, 100)) < 0 || hi.sub(d).compare(q(2, 100)) < 0) throw new Error('edge');
	const lighter = LIQ6.slice(0, i), heavier = LIQ6.slice(i);
	const right = floats ? rng.pick(heavier) : rng.pick(lighter);
	const others = shuffle(rng, floats ? lighter : heavier).slice(0, 3);
	if (others.length < 3) throw new Error('few');
	const opt = (l: (typeof LIQ6)[number]): ChoiceOption => ({ latex: `\\text{${l.nome}, }${wu(dec(l.d, l.key === 'acqua' ? 2 : undefined), 'g/mL')}`, values: [l.key] });
	const ans = must(d, 3);
	const verb = floats ? 'galleggia' : 'affonda';
	return {
		prompt: floats ? 'Scegli il liquido in cui galleggia.' : 'Scegli il liquido in cui affonda.',
		problem: textBlock(`Un oggetto ha la massa di ${pu(mw.tex, 'g')} e il volume di ${pu(dec(V), 'cm^3')}. In quale di questi liquidi ${verb}?`),
		solution: `\\text{${right.nome}}`,
		steps: [
			`d = \\dfrac{m}{V} = \\dfrac{${wu(mw.tex, 'g')}}{${wu(dec(V), 'cm^3')}} \\approx ${wu(ans.tex, 'g/cm^3')} = ${wu(ans.tex, 'g/mL')}`,
			t(floats ? `Galleggia nei liquidi più densi di lui: tra quelli proposti solo ${right.art}.` : `Affonda nei liquidi meno densi di lui: tra quelli proposti solo ${right.art}.`),
		],
		answer: choose(rng, opt(right), others.map(opt)),
		params: { case: floats ? 'galleggia' : 'affonda', m: m.toString(), V: V.toString() },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const chimMassaVolumeDensita: Generator = {
	id: ID,
	title: 'Massa, volume e densità',
	levels: {
		1: { label: 'La densità', constraints: ['massa e volume con tre cifre significative', 'risultato con tre cifre'] },
		2: { label: 'Massa o volume', constraints: ['liquidi e metalli della tabella della lezione', 'm = d V oppure V = m/d'] },
		3: { label: 'Unità diverse', constraints: ['densità in kg/m³, volumi in litri, masse in chilogrammi'] },
		4: { label: 'La pesata per differenza', constraints: ['becher vuoto e pieno, volume da pipetta o cilindro', 'cifre del dato che ne ha meno'] },
		5: { label: 'Il volume per immersione', constraints: ['due letture del cilindro', 'il metallo dalla densità'] },
		6: { label: 'Galleggia o affonda', constraints: ['la densità di un oggetto confrontata con quella di cinque liquidi'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimMassaVolumeDensita;
