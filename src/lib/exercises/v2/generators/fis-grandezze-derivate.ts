/**
 * Grandezze derivate: area, volume e densità. Spec: specs/exercises/fis-grandezze-derivate.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/03-fis-grandezze-derivate.md), all multiple choice with
 * the unit in the option: changing units of area and volume (litres too); the volume of a box or a cube with edges
 * in different units, and by immersion; the density from mass and volume; the density with units to convert first;
 * mass or volume from the density; the material of an object from its mass and the readings of a graduated
 * cylinder. Distractors are the lesson's warnings: the factor of the lengths used for areas and volumes, m and V
 * swapped, units mixed, 1 g/cm³ = 1000 kg/m³ used the wrong way.
 *
 * Numbers are built backwards: the density (from the lesson's table or with two or three significant digits) and the
 * volume first, then the mass.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { shuffle, textBlock } from '../insiemi';
import { Rational, q } from '../rational';
import { BANNED, choose, dec, decimals, pow10, pw, unitTex, withUnit, type R } from '../fis-grandezze';

export const ID = 'fis-grandezze-derivate';

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	choice: ChoiceAnswer;
	params: Record<string, unknown>;
}

const valOpt = (r: R, u: string): ChoiceOption => ({ latex: withUnit(dec(r), u), values: [r.toString()] });
const ok = (r: R, maxDec = 4) => r.sign() > 0 && decimals(r) <= maxDec && r.compare(q(1e8)) < 0;
/** A distractor with more decimals than the answer would give itself away. */
const fits = (r: R, ans: R) => ok(r, Math.max(2, decimals(ans)));
/** A wrong value, rounded to three significant digits when it does not terminate (m and V swapped). */
function rough(r: R): R {
	if (Number.isFinite(decimals(r)) && decimals(r) <= 4) return r;
	const x = r.num / r.den;
	const e = Math.floor(Math.log10(x)) - 2;
	return e >= 0 ? q(Math.round(x / 10 ** e) * 10 ** e) : q(Math.round(x * 10 ** -e), 10 ** -e);
}
function measure(rng: Rng, lo: number, hi: number, pDec: number): R {
	if (rng.next() >= pDec) return q(rng.int(lo, hi));
	for (;;) {
		const x = rng.int(lo * 10 + 1, hi * 10 - 1);
		if (x % 10) return q(x, 10);
	}
}
const U = unitTex;
/** A choice, or null when the distractors are not enough (the caller draws new numbers). */
function tryChoose(rng: Rng, right: ChoiceOption, others: ChoiceOption[]): ChoiceAnswer | null {
	try {
		return choose(rng, right, others);
	} catch {
		return null;
	}
}

// ---------------------------------------------------------------------------
// Level 1: units of area and volume

/** Units of area and volume as powers of ten of m² and m³ (a litre is a dm³). */
export const AREA: Record<string, number> = { 'km^2': 6, 'm^2': 0, 'dm^2': -2, 'cm^2': -4, 'mm^2': -6 };
export const VOLUME: Record<string, number> = { 'm^3': 0, 'dm^3': -3, 'cm^3': -6, 'mm^3': -9, L: -3, mL: -6, hL: -1 };

function level1(rng: Rng): Built {
	for (;;) {
		const area = rng.next() < 0.4;
		const table = area ? AREA : VOLUME;
		const [u1, u2] = shuffle(rng, Object.keys(table)).slice(0, 2);
		const d = table[u1] - table[u2];
		if (d === 0 || Math.abs(d) > 9) continue;
		const sig = rng.int(1, 3);
		const x = q(rng.int(sig === 1 ? 1 : sig === 2 ? 10 : 100, sig === 1 ? 9 : sig === 2 ? 99 : 999)).mul(pow10(rng.int(-2, 1)));
		if (!ok(x, 3)) continue;
		const ans = x.mul(pow10(d));
		if (!ok(ans, 4) || ans.compare(q(1e7)) > 0) continue;
		const pw2 = area ? 2 : 3;
		// the factor of the lengths (d/2 or d/3 steps of 10), the wrong direction, one step of 10 too few for volumes
		const wrong = [d / pw2, -d, (2 * d) / 3, d > 0 ? d - pw2 : d + pw2, d > 0 ? d + pw2 : d - pw2].filter((k) => Number.isInteger(k) && k !== d && Math.abs(k) <= 12).map((k) => x.mul(pow10(k))).filter((r) => ok(r, 9) && r.compare(q(1e10)) < 0);
		const from = withUnit(dec(x), u1);
		const lit = (u: string) => (u === 'L' ? '1\\,\\text{L} = 1\\,\\text{dm}^3' : u === 'mL' ? '1\\,\\text{mL} = 1\\,\\text{cm}^3' : u === 'hL' ? '1\\,\\text{hL} = 100\\,\\text{L} = 0{,}1\\,\\text{m}^3' : '');
		const steps = [
			[lit(u1), lit(u2)].filter(Boolean).join(' \\qquad '),
			`1\\,${U(u1)} = ${dec(pow10(d))}\\,${U(u2)}`,
			`${from} = ${dec(x)} \\cdot ${dec(pow10(d))}\\,${U(u2)} = ${withUnit(dec(ans), u2)}`,
		].filter(Boolean);
		try {
			return {
				prompt: 'Cambia unità di misura.',
				problem: textBlock(`Esprimi $${from}$ in $${U(u2)}$.`),
				solution: withUnit(dec(ans), u2),
				steps,
				choice: choose(
					rng,
					valOpt(ans, u2),
					wrong.map((r) => valOpt(r, u2)),
				),
				params: { case: area ? 'area' : 'volume', from: u1, to: u2 },
			};
		} catch {
			continue;
		}
	}
}

// ---------------------------------------------------------------------------
// Level 2: a volume from the data

function level2(rng: Rng): Built {
	const kind = rng.pick(['parallelepipedo', 'cubo', 'immersione'] as const);
	if (kind === 'immersione') {
		const div = rng.pick([1, 2, 5]);
		const v1 = div * rng.int(10, 60);
		const v = div * rng.int(3, 30);
		const v2 = v1 + v;
		const o = (x: number) => valOpt(q(x), 'cm^3');
		return {
			prompt: 'Trova il volume.',
			problem: textBlock(`In un cilindro graduato l'acqua arriva a ${pw(String(v1), 'mL')}. Dopo aver immerso del tutto un sasso arriva a ${pw(String(v2), 'mL')}. Qual è il volume del sasso?`),
			solution: withUnit(String(v), 'cm^3'),
			steps: [`V = V_2 - V_1 = ${v2}\\,\\text{mL} - ${v1}\\,\\text{mL} = ${v}\\,\\text{mL}`, textBlock(`e $1\\,\\text{mL} = 1\\,\\text{cm}^3$, quindi ${pw(String(v), 'cm^3')}.`)],
			// the second reading; the first; the sum
			choice: choose(rng, o(v), shuffle(rng, [o(v2), o(v1), o(v1 + v2), o(v + div), o(Math.max(1, v - div))])),
			params: { case: kind, v1, v2 },
		};
	}
	for (;;) {
		if (kind === 'cubo') {
			const l = measure(rng, 2, 20, 0.3); // cm
			const V = l.mul(l).mul(l); // cm³
			const inL = rng.next() < 0.5;
			const ans = inL ? V.div(q(1000)) : V;
			const u = inL ? 'L' : 'cm^3';
			if (!ok(ans, 4)) continue;
			const wrong = [l.mul(l).mul(q(6)), l.mul(q(3)), inL ? V.div(q(100)) : V.div(q(1000)), inL ? V : l.mul(l), inL ? V.div(q(10)) : V.mul(q(10))].filter((r) => fits(r, ans)).map((r) => valOpt(r, u));
			const ch = tryChoose(rng, valOpt(ans, u), wrong);
			if (!ch) continue;
			return {
				prompt: 'Trova il volume.',
				problem: textBlock(`Un cubo ha lo spigolo di ${pw(dec(l), 'cm')}. Qual è il suo volume in $${U(u)}$?`),
				solution: withUnit(dec(ans), u),
				steps: [`V = \\ell^3 = (${dec(l)}\\,\\text{cm})^3 = ${withUnit(dec(V), 'cm^3')}`, ...(inL ? [`1\\,\\text{L} = 1000\\,\\text{cm}^3 \\text{, quindi } V = ${dec(V)} : 1000 = ${withUnit(dec(ans), 'L')}`] : [])],
				choice: ch,
				params: { case: kind, inL },
			};
		}
		// a box: two edges in cm, one in m (or mm), the volume in cm³, dm³, L or m³
		const a = measure(rng, 10, 80, 0.2);
		const b = measure(rng, 5, 60, 0.2);
		const other = rng.pick(['m', 'mm'] as const);
		const c = other === 'm' ? measure(rng, 1, 3, 0.8) : q(rng.int(2, 9) * 10 + rng.int(0, 9)); // m or mm
		const cCm = other === 'm' ? c.mul(q(100)) : c.div(q(10));
		const Vcm = a.mul(b).mul(cCm);
		const target = rng.pick(['cm^3', 'dm^3', 'L', 'm^3'] as const);
		const f = target === 'cm^3' ? q(1) : target === 'm^3' ? q(1, 1000000) : q(1, 1000);
		const ans = Vcm.mul(f);
		if (!ok(ans, 4) || ans.compare(q(1e7)) > 0 || !ok(a.mul(b).mul(c), 6)) continue;
		const wrong = [a.mul(b).mul(c).mul(f), Vcm.mul(f).mul(q(10)), Vcm.mul(f).div(q(10)), Vcm.mul(f).mul(q(1000)), Vcm.mul(f).div(q(1000))].filter((r) => fits(r, ans)).map((r) => valOpt(r, target));
		const ch = tryChoose(rng, valOpt(ans, target), wrong);
		if (!ch) continue;
		return {
			prompt: 'Trova il volume.',
			problem: textBlock(
				`Una scatola ha la forma di un parallelepipedo con gli spigoli di ${pw(dec(a), 'cm')}, ${pw(dec(b), 'cm')} e ${pw(dec(c), other)}. Qual è il suo volume in $${U(target)}$?`,
			),
			solution: withUnit(dec(ans), target),
			steps: [
				`${withUnit(dec(c), other)} = ${withUnit(dec(cCm), 'cm')}`,
				`V = ${dec(a)}\\,\\text{cm} \\cdot ${dec(b)}\\,\\text{cm} \\cdot ${dec(cCm)}\\,\\text{cm} = ${withUnit(dec(Vcm), 'cm^3')}`,
				...(target === 'cm^3' ? [] : [`${withUnit(dec(Vcm), 'cm^3')} = ${withUnit(dec(ans), target)}`]),
			],
			choice: ch,
			params: { case: kind, other, target },
		};
	}
}

// ---------------------------------------------------------------------------
// Density: the lesson's table

/** The lesson's table, in g/cm³, with "della densità del …" joined to the article. */
export const MATERIALS: [string, R, string][] = [
	["olio d'oliva", q(92, 100), "dell'"],
	['ghiaccio', q(917, 1000), 'del '],
	['acqua', q(1), "dell'"],
	['vetro', q(25, 10), 'del '],
	['alluminio', q(27, 10), "dell'"],
	['ferro', q(787, 100), 'del '],
	['rame', q(896, 100), 'del '],
	['piombo', q(113, 10), 'del '],
	['oro', q(193, 10), "dell'"],
];
const G_CM3 = 'g/cm^3';
const KG_M3 = 'kg/m^3';

/** A density in g/cm³: a material of the table or a random one with two or three significant digits. */
function density(rng: Rng): { d: R; name: string | null } {
	if (rng.next() < 0.5) {
		const [name, d] = rng.pick(MATERIALS);
		return { d, name };
	}
	const sig = rng.int(2, 3);
	const x = sig === 2 ? rng.int(11, 99) : rng.int(101, 999);
	const e = rng.pick([0, 1]); // 1,1 to 9,99 or 0,11 to 0,999
	return { d: q(x, 10 ** (sig - 1 + e)), name: null };
}

function level3(rng: Rng): Built {
	for (;;) {
		const { d } = density(rng);
		const si = rng.next() < 0.5;
		const V = si ? q(rng.int(2, 60), rng.pick([10, 100, 1000])) : q(rng.int(5, 400)); // m³ or cm³
		const dd = si ? d.mul(q(1000)) : d; // kg/m³ or g/cm³
		const m = dd.mul(V); // kg or g
		if (!ok(m, 3) || !ok(dd, 3)) continue;
		const mu = si ? 'kg' : 'g';
		const vu = si ? 'm^3' : 'cm^3';
		const du = si ? KG_M3 : G_CM3;
		const wrong = [rough(V.div(m)), rough(m.mul(V)), si ? dd.div(q(1000)) : dd.mul(q(1000)), dd.mul(q(10)), dd.div(q(10))].filter((r) => fits(r, dd)).map((r) => valOpt(r, du));
		try {
			return {
				prompt: 'Calcola la densità.',
				problem: textBlock(`Un oggetto ha la massa di ${pw(dec(m), mu)} e il volume di ${pw(dec(V), vu)}. Qual è la sua densità?`),
				solution: withUnit(dec(dd), du),
				steps: [`d = \\dfrac{m}{V} = \\dfrac{${withUnit(dec(m), mu)}}{${withUnit(dec(V), vu)}} = ${withUnit(dec(dd), du)}`],
				choice: choose(rng, valOpt(dd, du), wrong),
				params: { case: si ? 'kg-m3' : 'g-cm3' },
			};
		} catch {
			continue;
		}
	}
}

// ---------------------------------------------------------------------------
// Level 4: density with units to change

function level4(rng: Rng): Built {
	const kind = rng.pick(['converti', 'mista'] as const);
	for (;;) {
		const { d } = density(rng);
		if (kind === 'converti') {
			const toSI = rng.next() < 0.5;
			const from = toSI ? d : d.mul(q(1000));
			const ans = toSI ? d.mul(q(1000)) : d;
			const fu = toSI ? G_CM3 : KG_M3;
			const tu = toSI ? KG_M3 : G_CM3;
			const wrong = [toSI ? from.div(q(1000)) : from.mul(q(1000)), toSI ? from.mul(q(100)) : from.div(q(100)), toSI ? from.mul(q(1000000)) : from.div(q(1000000)), toSI ? from.mul(q(10)) : from.div(q(10))].filter((r) => ok(r, 6)).map((r) => valOpt(r, tu));
			try {
				return {
					prompt: 'Cambia unità di misura.',
					problem: textBlock(`Esprimi in $${U(tu)}$ la densità ${pw(dec(from), fu)}.`),
					solution: withUnit(dec(ans), tu),
					steps: [`1\\,\\text{g/cm}^3 = \\dfrac{10^{-3}\\,\\text{kg}}{10^{-6}\\,\\text{m}^3} = 1000\\,\\text{kg/m}^3`, `${withUnit(dec(from), fu)} = ${withUnit(dec(ans), tu)}`],
					choice: choose(rng, valOpt(ans, tu), wrong),
					params: { case: toSI ? 'in-kg-m3' : 'in-g-cm3' },
				};
			} catch {
				continue;
			}
		}
		// the mass in grams and the volume in litres, or the mass in kilograms and the volume in cm³: the density in kg/m³
		const gramsLitres = rng.next() < 0.5;
		const dSI = d.mul(q(1000)); // kg/m³
		if (gramsLitres) {
			const VL = measure(rng, 1, 5, 0.6); // L
			const mg = d.mul(VL.mul(q(1000))); // g
			if (!ok(mg, 2)) continue;
			// g and L divided as they are (that is g/L = kg/m³: the right number!) -> use g and dm³ with the right way
			const wrong = [dSI.div(q(1000)), dSI.mul(q(1000)), rough(VL.div(mg)), dSI.div(q(100))].filter((r) => fits(r, dSI)).map((r) => valOpt(r, KG_M3));
			try {
				return {
					prompt: 'Calcola la densità.',
					problem: textBlock(`Un liquido ha la massa di ${pw(dec(mg), 'g')} e il volume di ${pw(dec(VL), 'L')}. Qual è la sua densità in $${U(KG_M3)}$?`),
					solution: withUnit(dec(dSI), KG_M3),
					steps: [
						`m = ${withUnit(dec(mg), 'g')} = ${withUnit(dec(mg.div(q(1000))), 'kg')} \\qquad V = ${withUnit(dec(VL), 'L')} = ${withUnit(dec(VL.div(q(1000))), 'm^3')}`,
						`d = \\dfrac{${dec(mg.div(q(1000)))}\\,\\text{kg}}{${dec(VL.div(q(1000)))}\\,\\text{m}^3} = ${withUnit(dec(dSI), KG_M3)}`,
					],
					choice: choose(rng, valOpt(dSI, KG_M3), wrong),
					params: { case: 'g-L' },
				};
			} catch {
				continue;
			}
		}
		const Vc = q(rng.int(5, 80) * 10); // cm³
		const mk = d.mul(Vc).div(q(1000)); // kg
		if (!ok(mk, 3)) continue;
		const wrong = [mk.div(Vc), mk.div(Vc).mul(q(1000)), dSI.mul(q(1000)), dSI.div(q(10))].filter((r) => fits(r, dSI)).map((r) => valOpt(r, KG_M3));
		try {
			return {
				prompt: 'Calcola la densità.',
				problem: textBlock(`Un oggetto ha la massa di ${pw(dec(mk), 'kg')} e il volume di ${pw(dec(Vc), 'cm^3')}. Qual è la sua densità in $${U(KG_M3)}$?`),
				solution: withUnit(dec(dSI), KG_M3),
				steps: [`V = ${withUnit(dec(Vc), 'cm^3')} = ${dec(Vc)} \\cdot 10^{-6}\\,\\text{m}^3`, `d = \\dfrac{${dec(mk)}\\,\\text{kg}}{${dec(Vc)} \\cdot 10^{-6}\\,\\text{m}^3} = ${withUnit(dec(dSI), KG_M3)}`],
				choice: choose(rng, valOpt(dSI, KG_M3), wrong),
				params: { case: 'kg-cm3' },
			};
		} catch {
			continue;
		}
	}
}

// ---------------------------------------------------------------------------
// Level 5: mass or volume from the density

function level5(rng: Rng): Built {
	const askMass = rng.next() < 0.5;
	for (;;) {
		const [name, d, art] = rng.pick(askMass ? MATERIALS : MATERIALS.filter(([n]) => n !== 'acqua' && n !== "olio d'oliva"));
		const dSI = d.mul(q(1000));
		const liquid = ['olio d\'oliva', 'acqua'].includes(name);
		if (askMass) {
			// the volume in litres (liquids) or cm³, the density in kg/m³, the mass in kg
			const inL = liquid || rng.next() < 0.3;
			const V = inL ? measure(rng, 1, 20, 0.5) : q(rng.int(2, 60) * 10);
			const Vm3 = inL ? V.div(q(1000)) : V.div(q(1000000));
			const m = dSI.mul(Vm3);
			if (!ok(m, 3)) continue;
			const vu = inL ? 'L' : 'cm^3';
			const wrong = [dSI.mul(V), rough(dSI.div(V)), m.mul(q(1000)), m.div(q(1000)), rough(V.div(dSI))].filter((r) => fits(r, m)).map((r) => valOpt(r, 'kg'));
			try {
				return {
					prompt: 'Calcola la massa.',
					problem: textBlock(`Qual è la massa di ${pw(dec(V), vu)} di ${name}, che ha la densità di ${pw(dec(dSI), KG_M3)}?`),
					solution: withUnit(dec(m), 'kg'),
					steps: [`V = ${withUnit(dec(V), vu)} = ${withUnit(dec(Vm3), 'm^3')}`, `m = d \\cdot V = ${dec(dSI)}\\,\\dfrac{\\text{kg}}{\\text{m}^3} \\cdot ${dec(Vm3)}\\,\\text{m}^3 = ${withUnit(dec(m), 'kg')}`],
					choice: choose(rng, valOpt(m, 'kg'), wrong),
					params: { case: 'massa', material: name },
				};
			} catch {
				continue;
			}
		}
		// the volume in cm³ from the mass in g and the density in g/cm³
		const V = q(rng.int(2, 200));
		const m = d.mul(V);
		if (!ok(m, 2)) continue;
		const wrong = [m.mul(d), rough(d.div(m)), V.mul(q(1000)), V.div(q(10))].filter((r) => fits(r, V)).map((r) => valOpt(r, 'cm^3'));
		try {
			return {
				prompt: 'Calcola il volume.',
				problem: textBlock(`Un oggetto di ${name} ha la massa di ${pw(dec(m), 'g')}. La densità ${art}${name} è ${pw(dec(d), G_CM3)}. Qual è il suo volume?`),
				solution: withUnit(dec(V), 'cm^3'),
				steps: [`V = \\dfrac{m}{d} = \\dfrac{${withUnit(dec(m), 'g')}}{${withUnit(dec(d), G_CM3)}} = ${withUnit(dec(V), 'cm^3')}`],
				choice: choose(rng, valOpt(V, 'cm^3'), wrong),
				params: { case: 'volume', material: name },
			};
		} catch {
			continue;
		}
	}
}

// ---------------------------------------------------------------------------
// Level 6: which material?

const SINKING: [string, R][] = MATERIALS.filter(([n]) => ['vetro', 'alluminio', 'ferro', 'rame', 'piombo', 'oro'].includes(n)).map(([n, d]) => [n, d]);

function level6(rng: Rng): Built {
	for (;;) {
		const [name, d] = rng.pick(SINKING);
		const div = rng.pick([1, 2]);
		const v1 = div * rng.int(20, 60);
		const V = div * rng.int(5, 25);
		const v2 = v1 + V;
		// the mass in grams with one decimal, as a scale gives it, within 0,8% of density times volume
		const m = q(Math.round((d.num / d.den) * V * 10 * (1 + (rng.next() - 0.5) * 0.016)), 10);
		const dm = m.div(q(V));
		const dmx = dm.num / dm.den;
		if (Math.abs(dmx / (d.num / d.den) - 1) > 0.01) continue;
		// the other options: at least 10% away from the measured density
		const others = shuffle(
			rng,
			SINKING.filter(([n, x]) => n !== name && Math.abs(x.num / x.den / dmx - 1) >= 0.1),
		);
		if (others.length < 3) continue;
		const o = ([n, x]: [string, R]): ChoiceOption => ({ latex: `\\text{${n} } (${withUnit(dec(x), G_CM3)})`, values: [n] });
		const exact = Number.isFinite(decimals(dm)) && decimals(dm) <= 3;
		const shown = exact ? dec(dm) : dec(rough(dm));
		return {
			prompt: 'Riconosci il materiale.',
			problem: textBlock(
				`Un oggetto di metallo o di vetro ha la massa di ${pw(dec(m), 'g')}. In un cilindro graduato l'acqua passa da ${pw(String(v1), 'mL')} a ${pw(String(v2), 'mL')} quando lo si immerge. Di che materiale è fatto?`,
			),
			solution: o([name, d]).latex,
			steps: [
				`V = ${v2}\\,\\text{mL} - ${v1}\\,\\text{mL} = ${V}\\,\\text{mL} = ${V}\\,\\text{cm}^3`,
				`d = \\dfrac{${withUnit(dec(m), 'g')}}{${V}\\,\\text{cm}^3} ${exact ? '=' : '\\approx'} ${withUnit(shown, G_CM3)}`,
				textBlock(`È la densità del materiale più vicino: ${name}.`),
			],
			choice: choose(rng, o([name, d]), others.map(o)),
			params: { case: name },
		};
	}
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 200; attempt++) {
		let b: Built;
		try {
			b = make(rng);
		} catch (e) {
			if (/only \d distinct options/.test(String(e))) continue;
			throw e;
		}
		const sample: Sample = { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.choice, params: b.params };
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test(sample.problem + sample.steps.join(' ') + sample.solution)) v.push('parole vietate');
	if (sample.answer.kind !== 'choice') return ['la risposta deve essere una scelta'];
	const ch = sample.answer;
	if (ch.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni ripetute');
	for (const o of ch.options) if (/^\d+(\/\d+)?$/.test(o.values[0]) && !Number.isFinite(decimals(Rational.parse(o.values[0])))) v.push('opzione non decimale');
	return v;
}

export const fisGrandezzeDerivate: Generator = {
	id: ID,
	title: 'Grandezze derivate: area, volume e densità',
	levels: {
		1: { label: 'Unità di area e volume', constraints: ['area (40%) o volume con litri (60%), da una a tre cifre significative'] },
		2: { label: 'Il volume dai dati', constraints: ['parallelepipedo con spigoli in unità diverse, cubo, volume per immersione'] },
		3: { label: 'La densità', constraints: ['massa e volume in g e cm³ o in kg e m³, densità d = m/V'] },
		4: { label: 'Densità e unità', constraints: ['da g/cm³ a kg/m³ e viceversa, massa e volume da convertire prima di dividere'] },
		5: { label: 'Massa e volume dalla densità', constraints: ['m = d·V con il volume in litri o cm³, V = m/d'] },
		6: { label: 'Riconoscere il materiale', constraints: ['massa e letture del cilindro graduato, il materiale con la densità più vicina'] },
	},
	generate,
	check,
};

export default fisGrandezzeDerivate;
