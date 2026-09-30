/**
 * La dilatazione termica. Spec: specs/exercises/fis-dilatazione-termica.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/66-fis-dilatazione-termica.md), each one step harder:
 * the lengthening Δl = λ l0 Δt in millimetres from a length in metres; the final temperature from the lengthening;
 * the coefficient λ from a measurement; the liquid that overflows from a full container (ΔV = α V0 Δt, the container's
 * own expansion left out); the volume of a solid, with α = 3λ. The coefficients are the lesson's tables and are given
 * in the text. Data with two significant figures (the lengthening of levels 2 and 3 as measured, up to three),
 * answers rounded to two (a whole temperature at level 2), never a tie; multiple choice with the unit in the option
 * and the lesson's mistakes: the final temperature in place of Δt, millimetres and metres mixed, λ in place of 3λ.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { type Built, type R, type Unit, UNIT, INT, SIG2, checkCommon, fmt, fmtExact, generateWith, options, pd, pu, q, tie, two, wu } from '../fis-termologia';

export const ID = 'fis-dilatazione-termica';

const MICRO = q(1, 1000000);
const SOLIDS = {
	alluminio: { lam: q(23).mul(MICRO), of: "d'alluminio" },
	ottone: { lam: q(19).mul(MICRO), of: "d'ottone" },
	rame: { lam: q(17).mul(MICRO), of: 'di rame' },
	acciaio: { lam: q(12).mul(MICRO), of: "d'acciaio" },
	vetro: { lam: q(85, 10).mul(MICRO), of: 'di vetro' },
	pyrex: { lam: q(33, 10).mul(MICRO), of: 'di vetro pyrex' },
} as const;
type Solid = keyof typeof SOLIDS;
const LIQUIDS = {
	acqua: { alpha: q(21, 100000), name: "d'acqua", lo: 10, hi: 40 },
	mercurio: { alpha: q(18, 100000), name: 'di mercurio', lo: 0, hi: 100 },
} as const;
type Liquid = keyof typeof LIQUIDS;

const lamTex = (r: R) => `$\\lambda = ${wu(fmt(r, SIG2), 'perC')}$`;
const BARS = [
	{ noun: 'Una sbarra', e: 'a' },
	{ noun: 'Un tubo', e: 'o' },
	{ noun: 'Un filo', e: 'o' },
];
const GLASS_BAR = [{ noun: 'Una bacchetta', e: 'a' }];
const bar = (rng: Rng, m: Solid) => rng.pick(m === 'vetro' || m === 'pyrex' ? GLASS_BAR : BARS);
/** An exact value for a step: as it is with up to `d` decimals, otherwise cut and followed by dots. */
function stepTex(r: R, d = 3): string {
	const exact = fmtExact(r);
	const dec = exact.includes('{,}') ? exact.split('{,}')[1].length : 0;
	if (dec <= d) return exact;
	const k = 10 ** d;
	const cut = Math.trunc((r.num / r.den) * k) / k;
	return String(cut).replace('.', '{,}') + '\\ldots';
}
/** The last step: `= 2{,}3\,\text{mm}` when exact, else the value cut and `\approx` the answer. */
const toAnswer = (r: R, u: Unit, d = 3) => (fmtExact(r) === sigTex(r) ? `= ${wu(sigTex(r), u)}` : `= ${stepTex(r, d)}\\,${UNIT[u]} \\approx ${wu(sigTex(r), u)}`);
const K1000 = q(1000);
/** A length datum: 1,1 to 9,9 m or 11 to 99 m. */
const length = (rng: Rng) => two(rng, rng.next() < 0.5 ? 0 : 1);
const sigTex = (r: R) => fmt(r, SIG2);
/** In a product or after a minus: a negative value between parentheses. */
const par = (r: R) => (r.sign() < 0 ? `(${fmtExact(r)})` : fmtExact(r));
/** Significant figures of an exact positive terminating decimal. */
function sigCount(r: R): number {
	let s = fmtExact(r).replace(/\\,/g, '').replace('{,}', '').replace(/^0+/, '');
	if (!fmtExact(r).includes('{,}')) s = s.replace(/0+$/, '');
	return s.length;
}

// ---------------------------------------------------------------------------
// Level 1: the lengthening

function level1(rng: Rng): Built {
	for (;;) {
		const mat = rng.pick(Object.keys(SOLIDS) as Solid[]);
		const { lam, of } = SOLIDS[mat];
		const l0 = length(rng);
		const ti = q(rng.int(-20, 30));
		const dt = q(5 * rng.int(2, 40));
		const tf = ti.add(dt);
		const dlm = lam.mul(l0).mul(dt);
		const dl = dlm.mul(K1000);
		if (dl.compare(q(1, 10)) < 0 || dl.compare(q(999)) > 0 || tie(dl, SIG2)) continue;
		const b = bar(rng, mat);
		return {
			prompt: "Trova l'allungamento.",
			problem: textBlock(`${b.noun} ${of} (${lamTex(lam)}) è lung${b.e} ${pu(sigTex(l0), 'm')} a ${pd(ti, 'C')}. Di quanti millimetri si allunga se l${b.e} si scalda fino a ${pd(tf, 'C')}?`),
			solution: `\\Delta l \\approx ${wu(sigTex(dl), 'mm')}`,
			steps: [
				`\\Delta t = ${fmtExact(tf)} - ${par(ti)} = ${wu(fmtExact(dt), 'C')}`,
				`\\Delta l = \\lambda\\, l_0\\, \\Delta t = ${sigTex(lam)}\\,^\\circ\\text{C}^{-1} \\cdot ${wu(sigTex(l0), 'm')} \\cdot ${wu(fmtExact(dt), 'C')} = ${stepTex(dlm, 6)}\\,\\text{m}`,
				`\\Delta l ${toAnswer(dl, 'mm')}`,
			],
			// the final temperature in place of Δt; the metres not converted; Δt forgotten
			answer: options(rng, dl, [tf.sign() > 0 && !tf.equals(dt) ? lam.mul(l0).mul(tf).mul(K1000) : null, dlm, lam.mul(l0).mul(K1000)], 'mm', SIG2),
			params: { case: mat, l0: l0.toString(), ti: ti.toString(), tf: tf.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the final temperature

const L2 = [10, 15, 20, 25, 30, 40, 50, 60, 80].map((n) => q(n, 10)).concat([12, 15, 18, 24, 25, 36, 45].map((n) => q(n)));

function level2(rng: Rng): Built {
	for (;;) {
		const mat = rng.pick(Object.keys(SOLIDS) as Solid[]);
		const { lam, of } = SOLIDS[mat];
		const l0 = rng.pick(L2);
		const ti = q(rng.int(-10, 30));
		const dt = q(10 * rng.int(2, 20));
		const dl = lam.mul(l0).mul(dt).mul(K1000);
		if (dl.compare(q(1, 10)) < 0 || sigCount(dl) > 3) continue;
		const tf = ti.add(dt);
		const b = bar(rng, mat);
		return {
			prompt: 'Trova la temperatura finale.',
			problem: textBlock(`${b.noun} ${of} (${lamTex(lam)}) è lung${b.e} ${pu(sigTex(l0), 'm')} a ${pd(ti, 'C')}. Scaldandol${b.e} si allunga di ${pd(dl, 'mm')}. A quale temperatura è arrivat${b.e}?`),
			solution: `t_f = ${wu(fmtExact(tf), 'C')}`,
			steps: [
				`\\Delta l = ${fmtExact(dl)}\\,\\text{mm} = ${fmtExact(dl.div(K1000))}\\,\\text{m}`,
				`\\Delta t = \\dfrac{\\Delta l}{\\lambda\\, l_0} = \\dfrac{${fmtExact(dl.div(K1000))}\\,\\text{m}}{${sigTex(lam)}\\,^\\circ\\text{C}^{-1} \\cdot ${wu(sigTex(l0), 'm')}} = ${wu(fmtExact(dt), 'C')}`,
				`t_f = t_i + \\Delta t = ${fmtExact(ti)} + ${fmtExact(dt)} = ${wu(fmtExact(tf), 'C')}`,
			],
			// Δt given as the final temperature; Δt taken away; the starting temperature counted twice
			answer: options(rng, tf, [dt, ti.sub(dt), dt.add(ti.mul(q(2)))], 'C', INT, true, q(10)),
			params: { case: mat, l0: l0.toString(), ti: ti.toString(), dl: dl.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the coefficient

function level3(rng: Rng): Built {
	for (;;) {
		const mat = rng.pick(Object.keys(SOLIDS) as Solid[]);
		const { lam, of } = SOLIDS[mat];
		const l0 = rng.pick(L2);
		const ti = q(rng.int(10, 30));
		const dt = q(10 * rng.int(2, 20));
		const tf = ti.add(dt);
		const dl = lam.mul(l0).mul(dt).mul(K1000);
		if (dl.compare(q(1, 10)) < 0 || sigCount(dl) > 3) continue;
		const b = bar(rng, mat);
		return {
			prompt: 'Trova il coefficiente di dilatazione lineare.',
			problem: textBlock(`${b.noun} ${of} lung${b.e} ${pu(sigTex(l0), 'm')} a ${pd(ti, 'C')} viene scaldat${b.e} fino a ${pd(tf, 'C')}, e si allunga di ${pd(dl, 'mm')}. Quanto vale il coefficiente di dilatazione lineare?`),
			solution: `\\lambda = ${wu(sigTex(lam), 'perC')}`,
			steps: [
				`\\Delta t = ${fmtExact(tf)} - ${fmtExact(ti)} = ${wu(fmtExact(dt), 'C')}, \\quad \\Delta l = ${fmtExact(dl.div(K1000))}\\,\\text{m}`,
				`\\lambda = \\dfrac{\\Delta l}{l_0\\,\\Delta t} = \\dfrac{${fmtExact(dl.div(K1000))}\\,\\text{m}}{${wu(sigTex(l0), 'm')} \\cdot ${wu(fmtExact(dt), 'C')}} = ${wu(sigTex(lam), 'perC')}`,
			],
			// the millimetres not converted; Δt forgotten; the final temperature in place of Δt
			answer: options(rng, lam, [lam.mul(K1000), lam.mul(dt), lam.mul(dt).div(tf)], 'perC', SIG2),
			params: { case: mat, l0: l0.toString(), ti: ti.toString(), tf: tf.toString(), dl: dl.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: a liquid overflows

function level4(rng: Rng): Built {
	for (;;) {
		const liq = rng.pick(Object.keys(LIQUIDS) as Liquid[]);
		const { alpha, name, lo, hi } = LIQUIDS[liq];
		const V0 = two(rng);
		const ti = q(rng.int(lo, hi - 10));
		const tf = q(rng.int(ti.num + 5, hi));
		const dt = tf.sub(ti);
		const dVL = alpha.mul(V0).mul(dt);
		const dV = dVL.mul(K1000);
		if (dV.compare(q(1, 10)) < 0 || tie(dV, SIG2)) continue;
		return {
			prompt: 'Trova il volume che trabocca.',
			problem: textBlock(
				`Un recipiente è pieno fino all'orlo di ${pu(sigTex(V0), 'L')} ${name} ($\\alpha = ${wu(sigTex(alpha), 'perC')}$) a ${pd(ti, 'C')}. Lo si scalda fino a ${pd(tf, 'C')}. Quanti millilitri di liquido traboccano? Trascura la dilatazione del recipiente.`,
			),
			solution: `\\Delta V \\approx ${wu(sigTex(dV), 'mL')}`,
			steps: [
				`\\Delta t = ${fmtExact(tf)} - ${fmtExact(ti)} = ${wu(fmtExact(dt), 'C')}`,
				`\\Delta V = \\alpha\\, V_0\\, \\Delta t = ${sigTex(alpha)}\\,^\\circ\\text{C}^{-1} \\cdot ${wu(sigTex(V0), 'L')} \\cdot ${wu(fmtExact(dt), 'C')} = ${stepTex(dVL, 6)}\\,\\text{L}`,
				`\\Delta V ${toAnswer(dV, 'mL')}`,
			],
			// three times α (as for a solid); the litres not converted; the final temperature in place of Δt
			answer: options(rng, dV, [dV.mul(q(3)), dVL, alpha.mul(V0).mul(tf).mul(K1000)], 'mL', SIG2),
			params: { case: liq, V0: V0.toString(), ti: ti.toString(), tf: tf.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the volume of a solid

const SHAPES = [
	{ noun: 'Una sfera', e: 'a' },
	{ noun: 'Un cubo', e: 'o' },
	{ noun: 'Un cilindro', e: 'o' },
];

function level5(rng: Rng): Built {
	for (;;) {
		const mat = rng.pick(Object.keys(SOLIDS) as Solid[]);
		const { lam, of } = SOLIDS[mat];
		const V0 = two(rng, 1);
		const ti = q(rng.int(10, 30));
		const dt = q(10 * rng.int(5, 40));
		const tf = ti.add(dt);
		const alpha = lam.mul(q(3));
		const dV = alpha.mul(V0).mul(dt);
		if (dV.compare(q(1, 100)) < 0 || tie(dV, SIG2)) continue;
		const s = rng.pick(SHAPES);
		return {
			prompt: "Trova l'aumento di volume.",
			problem: textBlock(`${s.noun} ${of} (${lamTex(lam)}) ha il volume di ${pu(sigTex(V0), 'cm3')} a ${pd(ti, 'C')}. Di quanto aumenta il suo volume a ${pd(tf, 'C')}?`),
			solution: `\\Delta V \\approx ${wu(sigTex(dV), 'cm3')}`,
			steps: [
				`\\alpha \\approx 3\\lambda = 3 \\cdot ${sigTex(lam)} = ${wu(fmt(alpha, { kind: 'sig', s: 3 }).replace(/(\{,\}\d)0 /, '$1 '), 'perC')}`,
				`\\Delta t = ${fmtExact(tf)} - ${fmtExact(ti)} = ${wu(fmtExact(dt), 'C')}`,
				`\\Delta V = \\alpha\\, V_0\\, \\Delta t ${toAnswer(dV, 'cm3', 4)}`,
			],
			// λ in place of 3λ; 2λ (the surface); the final temperature in place of Δt
			answer: options(rng, dV, [lam.mul(V0).mul(dt), lam.mul(q(2)).mul(V0).mul(dt), alpha.mul(V0).mul(tf)], 'cm3', SIG2),
			params: { case: mat, V0: V0.toString(), ti: ti.toString(), tf: tf.toString() },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const fisDilatazioneTermica: Generator = {
	id: ID,
	title: 'La dilatazione termica',
	levels: {
		1: { label: "L'allungamento", constraints: ['Δl = λ l0 Δt', 'lunghezza in metri, allungamento in millimetri'] },
		2: { label: 'La temperatura finale', constraints: ["dall'allungamento a Δt", 't_f = t_i + Δt'] },
		3: { label: 'Il coefficiente di dilatazione', constraints: ['λ = Δl / (l0 Δt)', 'millimetri da convertire'] },
		4: { label: 'Un liquido che trabocca', constraints: ['ΔV = α V0 Δt', 'volume in litri, risposta in millilitri'] },
		5: { label: 'Il volume di un solido', constraints: ['α ≈ 3λ', 'volume in centimetri cubi'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisDilatazioneTermica;
