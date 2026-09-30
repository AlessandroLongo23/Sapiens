/**
 * Calore, capacità termica e calore specifico. Spec: specs/exercises/calore.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/67-calore.md), each one step harder: the heat to warm
 * some water, Q = c m Δt, with the mass in kilograms or in grams; other substances of the lesson's table, warming or
 * cooling (the heat given off asked without its sign); the final temperature from the heat received; the specific
 * heat from a measurement; a pot with water in it, whose heat capacities add up (the heat, or the heat capacity); the
 * calorie, with the specific heat of water 1 cal/(g·°C). The specific heats are the lesson's table and are given in
 * the text. Data with two significant figures, answers rounded to two (a whole temperature at level 3), never a tie;
 * multiple choice with the unit in the option and the lesson's mistakes: the grams not converted, the final
 * temperature in place of Δt, the kilojoules not converted, one of the two bodies forgotten, calorie and kilocalorie
 * swapped.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { decimals } from '../fisica-forze';
import { type Built, type R, INT, SIG2, checkCommon, fmt, fmtExact, generateWith, options, roundTo, pd, pu, q, t, tie, two, wu, UNIT, type Unit } from '../fis-termologia';

export const ID = 'calore';

const SUBST = {
	acqua: { c: 4186, name: 'acqua' },
	alcol: { c: 2440, name: 'alcol etilico' },
	olio: { c: 1970, name: "olio d'oliva" },
	alluminio: { c: 897, name: 'alluminio' },
	vetro: { c: 840, name: 'vetro' },
	ferro: { c: 449, name: 'ferro' },
	rame: { c: 385, name: 'rame' },
	piombo: { c: 129, name: 'piombo' },
} as const;
type Subst = keyof typeof SUBST;
const OTHERS = (Object.keys(SUBST) as Subst[]).filter((k) => k !== 'acqua');
const CW = q(4186);

const cTex = (c: number) => `$c = ${wu(String(c), 'c')}$`;
const sigTex = (r: R) => fmt(r, SIG2);
const K1000 = q(1000);
/** A mass: 0,11 to 0,99 kg or 1,1 to 9,9 kg. */
const mass = (rng: Rng) => two(rng, rng.next() < 0.5 ? -1 : 0);
/** The last step: `= 670\,000\,\text{J} \approx 6{,}7 \cdot 10^{5}\,\text{J}`, or `=` alone when exact. */
function toAnswer(r: R, u: Unit): string {
	const cut = `${String(Math.trunc((r.num / r.den) * 1000) / 1000).replace('.', '{,}')}\\ldots`;
	if (!Number.isFinite(decimals(r))) return `= ${cut}\\,${UNIT[u]} \\approx ${wu(sigTex(r), u)}`;
	const exact = fmtExact(r);
	const dec = exact.includes('{,}') ? exact.split('{,}')[1].length : 0;
	if (exact === sigTex(r)) return `= ${wu(exact, u)}`;
	return `= ${dec <= 3 ? exact : cut}\\,${UNIT[u]} \\approx ${wu(sigTex(r), u)}`;
}

// ---------------------------------------------------------------------------
// Level 1: warming water

const GRAMS = [120, 150, 180, 200, 250, 300, 350, 400, 450, 500, 750];

function level1(rng: Rng): Built {
	const grams = rng.next() < 0.5;
	for (;;) {
		const m = grams ? q(rng.pick(GRAMS), 1000) : two(rng);
		const ti = q(rng.int(5, 30));
		const tf = q(rng.int(ti.num + 10, 100));
		const dt = tf.sub(ti);
		const Q = CW.mul(m).mul(dt);
		if (tie(Q, SIG2)) continue;
		const mTex = grams ? pu(fmtExact(m.mul(K1000)), 'g') : pu(sigTex(m), 'kg');
		return {
			prompt: "Trova il calore per scaldare l'acqua.",
			problem: textBlock(`Quanto calore serve per scaldare ${mTex} d'acqua (${cTex(4186)}) da ${pd(ti, 'C')} a ${pd(tf, 'C')}?`),
			solution: `Q \\approx ${wu(sigTex(Q), 'J')}`,
			steps: [
				...(grams ? [`m = ${wu(fmtExact(m.mul(K1000)), 'g')} = ${wu(fmtExact(m), 'kg')}`] : []),
				`\\Delta t = ${fmtExact(tf)} - ${fmtExact(ti)} = ${wu(fmtExact(dt), 'C')}`,
				`Q = c\\,m\\,\\Delta t = 4186 \\cdot ${fmtExact(m)} \\cdot ${fmtExact(dt)}\\,\\text{J} ${toAnswer(Q, 'J')}`,
			],
			// the final temperature in place of Δt; c forgotten; the grams not converted (or the mass taken in grams)
			answer: options(rng, Q, [CW.mul(m).mul(tf), m.mul(dt), Q.mul(K1000)], 'J', SIG2),
			params: { case: grams ? 'grammi' : 'chilogrammi', m: m.toString(), ti: ti.toString(), tf: tf.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: other substances, warming or cooling

function level2(rng: Rng): Built {
	const cooling = rng.next() < 0.5;
	for (;;) {
		const s = rng.pick(OTHERS);
		const { c, name } = SUBST[s];
		const m = mass(rng);
		const lo = q(rng.int(5, 40));
		const hi = q(rng.int(lo.num + 10, s === 'olio' || s === 'alcol' ? 70 : 250));
		const [ti, tf] = cooling ? [hi, lo] : [lo, hi];
		const dt = hi.sub(lo);
		const Q = q(c).mul(m).mul(dt);
		if (tie(Q, SIG2) || Q.compare(q(10)) < 0) continue;
		return {
			prompt: cooling ? 'Trova il calore ceduto.' : 'Trova il calore assorbito.',
			problem: textBlock(`Un campione di ${name} (${cTex(c)}) ha la massa di ${pu(sigTex(m), 'kg')}. Quanto calore ${cooling ? 'cede' : 'assorbe'} passando da ${pd(ti, 'C')} a ${pd(tf, 'C')}?`),
			solution: `|Q| \\approx ${wu(sigTex(Q), 'J')}`,
			steps: [
				`\\Delta t = t_f - t_i = ${fmtExact(tf)} - ${fmtExact(ti)} = ${wu(fmtExact(tf.sub(ti)), 'C')}`,
				`Q = c\\,m\\,\\Delta t = ${c} \\cdot ${fmtExact(m)} \\cdot ${cooling ? `(${fmtExact(tf.sub(ti))})` : fmtExact(tf.sub(ti))}\\,\\text{J} ${toAnswer(Q.mul(q(cooling ? -1 : 1)), 'J')}`,
				cooling ? t('Il segno meno dice che il campione cede calore: la risposta si dà senza segno.') : t('Q è positivo: il campione assorbe calore.'),
			],
			// the specific heat of water; the final temperature in place of Δt; the initial one
			answer: options(rng, Q, [CW.mul(m).mul(dt), q(c).mul(m).mul(tf), q(c).mul(m).mul(ti)], 'J', SIG2),
			params: { case: cooling ? 'raffreddamento' : 'riscaldamento', substance: s, m: m.toString(), ti: ti.toString(), tf: tf.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the final temperature

function level3(rng: Rng): Built {
	for (;;) {
		const s = rng.pick(Object.keys(SUBST) as Subst[]);
		const { c, name } = SUBST[s];
		const m = mass(rng);
		const ti = q(rng.int(10, 30));
		const QkJ = two(rng, rng.next() < 0.5 ? 0 : 1);
		const dt = QkJ.mul(K1000).div(q(c).mul(m));
		if (dt.compare(q(5)) < 0 || dt.compare(q(s === 'olio' || s === 'alcol' ? 50 : 150)) > 0) continue;
		const tf = ti.add(dt);
		if (tie(tf, INT) || tie(dt, INT)) continue;
		const dtR = q(Math.round(dt.num / dt.den));
		return {
			prompt: 'Trova la temperatura finale.',
			problem: textBlock(`Un campione di ${name} (${cTex(c)}) ha la massa di ${pu(sigTex(m), 'kg')} ed è a ${pd(ti, 'C')}. Riceve ${pu(sigTex(QkJ), 'kJ')} di calore. A quale temperatura arriva?`),
			solution: `t_f \\approx ${wu(fmt(tf, INT), 'C')}`,
			steps: [
				`\\Delta t = \\dfrac{Q}{c\\,m} = \\dfrac{${fmtExact(QkJ.mul(K1000))}\\,\\text{J}}{${c} \\cdot ${fmtExact(m)}\\,\\text{J}/^\\circ\\text{C}} = ${String(Math.trunc((dt.num / dt.den) * 100) / 100).replace('.', '{,}')}\\ldots\\,^\\circ\\text{C}`,
				`t_f = t_i + \\Delta t \\approx ${fmtExact(ti)} + ${fmtExact(dtR)} = ${wu(fmt(tf, INT), 'C')}`,
			],
			// Δt given as the final temperature; the kilojoules not converted; Δt taken away
			answer: options(rng, tf, [dt, ti.add(dt.div(K1000)), ti.sub(dt)], 'C', INT, true, q(3)),
			params: { case: s, m: m.toString(), ti: ti.toString(), QkJ: QkJ.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the specific heat from a measurement

function level4(rng: Rng): Built {
	for (;;) {
		const s = rng.pick(Object.keys(SUBST) as Subst[]);
		const m = mass(rng);
		const ti = q(rng.int(10, 30));
		const dt = q(rng.int(10, 80));
		const tf = ti.add(dt);
		const Qexact = q(SUBST[s].c).mul(m).mul(dt).div(K1000);
		if (tie(Qexact, SIG2)) continue;
		const QkJ = roundTo(Qexact, SIG2);
		const cm = QkJ.mul(K1000).div(m.mul(dt));
		if (tie(cm, SIG2)) continue;
		return {
			prompt: 'Trova il calore specifico.',
			problem: textBlock(`Un campione di massa ${pu(sigTex(m), 'kg')} riceve ${pu(sigTex(QkJ), 'kJ')} di calore e passa da ${pd(ti, 'C')} a ${pd(tf, 'C')}. Quanto vale il calore specifico del suo materiale?`),
			solution: `c \\approx ${wu(sigTex(cm), 'c')}`,
			steps: [`\\Delta t = ${fmtExact(tf)} - ${fmtExact(ti)} = ${wu(fmtExact(dt), 'C')}, \\quad Q = ${wu(fmtExact(QkJ.mul(K1000)), 'J')}`, `c = \\dfrac{Q}{m\\,\\Delta t} = \\dfrac{${fmtExact(QkJ.mul(K1000))}}{${fmtExact(m)} \\cdot ${fmtExact(dt)}} ${toAnswer(cm, 'c')}`],
			// the kilojoules not converted; the final temperature in place of Δt; the mass forgotten
			answer: options(rng, cm, [cm.div(K1000), QkJ.mul(K1000).div(m.mul(tf)), QkJ.mul(K1000).div(dt)], 'c', SIG2),
			params: { case: s, m: m.toString(), ti: ti.toString(), tf: tf.toString(), QkJ: QkJ.toString() },
		};
	}
}
// ---------------------------------------------------------------------------
// Level 5: a pot with water

const POTS = ['alluminio', 'ferro', 'rame'] as const;

function level5(rng: Rng): Built {
	const askQ = rng.next() < 0.5;
	for (;;) {
		const p = rng.pick(POTS);
		const cp = q(SUBST[p].c);
		const mp = two(rng, -1);
		const mw = two(rng);
		if (mw.compare(q(5)) > 0) continue;
		const C = cp.mul(mp).add(CW.mul(mw));
		const head = `Una pentola di ${SUBST[p].name} (${cTex(SUBST[p].c)}) ha la massa di ${pu(sigTex(mp), 'kg')} e contiene ${pu(sigTex(mw), 'kg')} d'acqua (${cTex(4186)}).`;
		const stepC = `C = c_p\\,m_p + c_a\\,m_a = ${SUBST[p].c} \\cdot ${fmtExact(mp)} + 4186 \\cdot ${fmtExact(mw)} = ${wu(fmtExact(C), 'JC')}`;
		if (!askQ) {
			if (tie(C, SIG2)) continue;
			return {
				prompt: 'Trova la capacità termica.',
				problem: textBlock(`${head} Quanto vale la capacità termica della pentola con l'acqua?`),
				solution: `C \\approx ${wu(sigTex(C), 'JC')}`,
				steps: [t('Pentola e acqua si scaldano insieme: le capacità termiche si sommano.'), stepC, `C \\approx ${wu(sigTex(C), 'JC')}`],
				// the water only; the masses forgotten; all of it taken as water
				answer: options(rng, C, [CW.mul(mw), cp.add(CW), CW.mul(mp.add(mw))], 'JC', SIG2),
				params: { case: 'capacita', pot: p, mp: mp.toString(), mw: mw.toString() },
			};
		}
		const dt = q(rng.int(20, 80));
		const Q = C.mul(dt);
		if (tie(Q, SIG2)) continue;
		return {
			prompt: 'Trova il calore.',
			problem: textBlock(`${head} Quanto calore serve per scaldare di ${pd(dt, 'C')} la pentola con l'acqua?`),
			solution: `Q \\approx ${wu(sigTex(Q), 'J')}`,
			steps: [t('Pentola e acqua si scaldano insieme: le capacità termiche si sommano.'), stepC, `Q = C\\,\\Delta t = ${fmtExact(C)} \\cdot ${fmtExact(dt)}\\,\\text{J} ${toAnswer(Q, 'J')}`],
			// the water only; the pot only; all of it taken as water
			answer: options(rng, Q, [CW.mul(mw).mul(dt), cp.mul(mp).mul(dt), CW.mul(mp.add(mw)).mul(dt)], 'J', SIG2),
			params: { case: 'calore', pot: p, mp: mp.toString(), mw: mw.toString(), dt: dt.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: calories

function level6(rng: Rng): Built {
	const food = rng.next() < 0.5;
	for (;;) {
		if (food) {
			const E = q(10 * rng.int(8, 60)); // 80 to 600 kcal
			const dt = q(rng.int(10, 80));
			const m = E.div(dt);
			if (tie(m, SIG2)) continue;
			const what = rng.pick(['uno snack', 'uno yogurt', 'una barretta di cioccolato', 'un panino']);
			return {
				prompt: "Trova la massa d'acqua.",
				problem: textBlock(`Sull'etichetta di ${what} c'è scritto ${pd(E, 'kcal')}. Quanti chilogrammi d'acqua potrebbe scaldare di ${pd(dt, 'C')}, se tutta l'energia andasse nell'acqua?`),
				solution: `m \\approx ${wu(sigTex(m), 'kg')}`,
				steps: [
					t("Una chilocaloria scalda di un grado un chilogrammo d'acqua:") + ` \\; c = 1\\,\\text{kcal/(kg}\\cdot{}^\\circ\\text{C)}`,
					`m = \\dfrac{Q}{c\\,\\Delta t} = \\dfrac{${fmtExact(E)}\\,\\text{kcal}}{1\\,\\text{kcal/(kg}\\cdot{}^\\circ\\text{C)} \\cdot ${wu(fmtExact(dt), 'C')}} ${toAnswer(m, 'kg')}`,
				],
				// the kilocalories taken as calories; the joules without the specific heat; divided by 4,186
				answer: options(rng, m, [m.div(K1000), m.mul(q(4186, 1000)), m.div(q(4186, 1000))], 'kg', SIG2),
				params: { case: 'etichetta', E: E.toString(), dt: dt.toString() },
			};
		}
		const m = two(rng);
		const ti = q(rng.int(5, 30));
		const tf = q(rng.int(ti.num + 10, 100));
		const dt = tf.sub(ti);
		const E = m.mul(dt);
		if (tie(E, SIG2)) continue;
		return {
			prompt: 'Trova le chilocalorie.',
			problem: textBlock(`Quante chilocalorie servono per scaldare ${pu(sigTex(m), 'kg')} d'acqua da ${pd(ti, 'C')} a ${pd(tf, 'C')}?`),
			solution: `Q \\approx ${wu(sigTex(E), 'kcal')}`,
			steps: [
				t("Per l'acqua") + ` \\; c = 1\\,\\text{cal/(g}\\cdot{}^\\circ\\text{C)} = 1\\,\\text{kcal/(kg}\\cdot{}^\\circ\\text{C)}`,
				`Q = c\\,m\\,\\Delta t = 1 \\cdot ${fmtExact(m)} \\cdot ${fmtExact(dt)}\\,\\text{kcal} ${toAnswer(E, 'kcal')}`,
			],
			// the calories (times 1000); the kilojoules (times 4,186); the final temperature in place of Δt
			answer: options(rng, E, [E.mul(K1000), E.mul(q(4186, 1000)), m.mul(tf)], 'kcal', SIG2),
			params: { case: 'acqua', m: m.toString(), ti: ti.toString(), tf: tf.toString() },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const calore: Generator = {
	id: ID,
	title: 'Calore, capacità termica e calore specifico',
	levels: {
		1: { label: "Scaldare l'acqua", constraints: ['Q = c m Δt', 'massa in chilogrammi o in grammi'] },
		2: { label: 'Altre sostanze, anche che si raffreddano', constraints: ['calore specifico della tabella', 'il calore ceduto senza segno'] },
		3: { label: 'La temperatura finale', constraints: ['Δt = Q / (c m)', 'calore in kilojoule'] },
		4: { label: 'Il calore specifico da una misura', constraints: ['c = Q / (m Δt)'] },
		5: { label: 'La pentola e l’acqua', constraints: ['le capacità termiche si sommano', 'il calore o la capacità termica'] },
		6: { label: 'Le calorie', constraints: ["c dell'acqua = 1 kcal/(kg·°C)", "chilocalorie di un'etichetta, o per scaldare l'acqua"] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default calore;
