/**
 * Il teorema di Carnot e il ciclo di Carnot. Spec: specs/exercises/fis-ciclo-carnot.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/116-fis-ciclo-carnot.md), each one step harder: the
 * efficiency of a reversible engine with the temperatures in kelvin, η = 1 − T_f / T_c; the same with the
 * temperatures in degrees Celsius, to be converted; the work or the heat given off by a reversible engine that
 * absorbs Q_c; the temperature of a reservoir from the efficiency; whether a declared engine can exist (balance of
 * energy first, then its efficiency against the reversible one); the work of a Carnot cycle run by n moles of gas,
 * whose heat absorbed is n R T_c ln(V_B / V_A). R = 8,31 J/(mol·K), 0 °C = 273 K. Multiple choice; an efficiency is a
 * pure number with two decimals. Distractors from the lesson's warnings: degrees Celsius in the ratio, the fraction
 * T_f / T_c taken for the efficiency, the heat given off taken for the work, the logarithm in base ten.
 */
import type { Generator, Rng, Sample } from '../types';
import { fixed, sig } from '../fisica-forze';
import { type Built, type R, ETA, INT, SIG2, SIG3, ambiguous, checkCommon, checkWords, cut, engine, fmt, fmtExact, fromFloat, generateWith, lab, nearTie, options, pd, q, roundTo, scenaMacchine, textBlock, tie, two, wordChoice, wu } from '../fis-macchine';

export const ID = 'fis-ciclo-carnot';

const ONE = q(1);
const K0 = q(273);
const eta2 = (r: R) => fixed(r, 2);
const num = (r: R) => r.num / r.den;
const isHundredth = (r: R) => r.mul(q(100)).isInteger();
const etaRel = (r: R) => (isHundredth(r) ? '=' : '\\approx');
/** `1 - 0{,}576\ldots \approx 0{,}42`, the end of the efficiency's step. */
function etaSteps(Tf: R, Tc: R): string {
	const k = Tf.div(Tc);
	const eta = ONE.sub(k);
	const kTex = k.mul(q(1000)).isInteger() ? fmtExact(k) : cut(num(k));
	return `1 - \\dfrac{${wu(fmtExact(Tf), 'K')}}{${wu(fmtExact(Tc), 'K')}} = 1 - ${kTex} ${etaRel(eta)} ${fmt(eta, ETA)}`;
}
const heat = (rng: Rng) => two(rng, rng.next() < 0.5 ? 0 : 1);
const KJ = (r: R) => `${lab(r)} kJ`;
const rel2 = (r: R) => (roundTo(r, SIG2).equals(r) ? '=' : '\\approx');

// ---------------------------------------------------------------------------
// Level 1: the efficiency, temperatures in kelvin

function level1(rng: Rng): Built {
	for (;;) {
		const Tf = q(rng.int(255, 345));
		const Tc = q(rng.int(420, 900));
		const eta = ONE.sub(Tf.div(Tc));
		if (num(eta) < 0.15 || num(eta) > 0.7 || tie(eta, ETA)) continue;
		return {
			prompt: 'Trova il rendimento della macchina reversibile.',
			problem: textBlock(`Una macchina reversibile lavora tra una sorgente a ${pd(Tc, 'K')} e una a ${pd(Tf, 'K')}. Qual è il suo rendimento?`),
			solution: `\\eta_{rev} ${etaRel(eta)} ${fmt(eta, ETA)}`,
			steps: [textBlock('Il rendimento di una macchina reversibile dipende solo dalle temperature assolute delle due sorgenti.'), `\\eta_{rev} = 1 - \\dfrac{T_f}{T_c} = ${etaSteps(Tf, Tc)}`],
			// the ratio taken for the efficiency; the difference over the cold temperature; degrees Celsius in the ratio
			answer: options(rng, eta, [Tf.div(Tc), Tc.sub(Tf).div(Tf), ONE.sub(Tf.sub(K0).div(Tc.sub(K0)))], 'none', ETA, ONE),
			params: { case: 'kelvin', Tc: Tc.toString(), Tf: Tf.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: temperatures in degrees Celsius

function level2(rng: Rng): Built {
	for (;;) {
		const tf = q(rng.int(5, 60));
		const tc = q(rng.int(150, 650));
		const Tf = tf.add(K0), Tc = tc.add(K0);
		const eta = ONE.sub(Tf.div(Tc));
		const wrong = ONE.sub(tf.div(tc));
		if (num(eta) < 0.15 || num(eta) > 0.7 || tie(eta, ETA)) continue;
		return {
			prompt: 'Trova il rendimento della macchina reversibile.',
			problem: textBlock(`Una macchina reversibile lavora tra una sorgente a ${pd(tc, 'C')} e una a ${pd(tf, 'C')}. Qual è il suo rendimento?`),
			solution: `\\eta_{rev} ${etaRel(eta)} ${fmt(eta, ETA)}`,
			steps: [
				textBlock('Nella formula del rendimento le temperature vanno in kelvin.'),
				`T_c = ${fmtExact(tc)} + 273 = ${wu(fmtExact(Tc), 'K')}, \\quad T_f = ${fmtExact(tf)} + 273 = ${wu(fmtExact(Tf), 'K')}`,
				`\\eta_{rev} = 1 - \\dfrac{T_f}{T_c} = ${etaSteps(Tf, Tc)}`,
			],
			// degrees Celsius in the ratio; the ratio taken for the efficiency; only the hot temperature converted
			answer: options(rng, eta, [wrong, Tf.div(Tc), ONE.sub(tf.div(Tc))], 'none', ETA, ONE),
			params: { case: 'celsius', tc: tc.toString(), tf: tf.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the work or the heat given off

function level3(rng: Rng): Built {
	const askW = rng.next() < 0.5;
	for (;;) {
		const Tf = q(rng.int(255, 345));
		const Tc = q(rng.int(420, 900));
		const eta = ONE.sub(Tf.div(Tc));
		if (num(eta) < 0.15 || num(eta) > 0.7) continue;
		const Qc = heat(rng);
		const W = Qc.mul(eta), Qf = Qc.sub(W);
		const ans = askW ? W : Qf;
		if (tie(ans, SIG2) || ambiguous(ans, SIG2) || roundTo(W, SIG2).equals(roundTo(Qf, SIG2))) continue;
		const sorgenti = { calda: `${lab(Tc)} K`, fredda: `${lab(Tf)} K` };
		const head = `Una macchina reversibile lavora tra una sorgente a ${pd(Tc, 'K')} e una a ${pd(Tf, 'K')}, e in ogni ciclo assorbe ${pd(Qc, 'kJ')} dalla sorgente calda.`;
		if (askW) {
			return {
				prompt: 'Trova il lavoro compiuto in un ciclo.',
				problem: textBlock(`${head} Quanto lavoro compie in un ciclo?`),
				solution: `W ${rel2(W)} ${wu(sig(W, 2), 'kJ')}`,
				steps: [
					`\\eta_{rev} = 1 - \\dfrac{T_f}{T_c} = 1 - \\dfrac{${fmtExact(Tf)}}{${fmtExact(Tc)}} = ${isHundredth(eta) ? fmt(eta, ETA) : cut(num(eta))}`,
					`W = \\eta_{rev}\\,Q_c = ${isHundredth(eta) ? fmt(eta, ETA) : cut(num(eta))} \\cdot ${wu(fmtExact(Qc), 'kJ')} ${rel2(W)} ${wu(sig(W, 2), 'kJ')}`,
				],
				// the heat given off; the difference over the cold temperature; divided by the efficiency
				answer: options(rng, W, [Qf, Qc.mul(Tc.sub(Tf)).div(Tf), Qc.div(eta)], 'kJ', SIG2),
				params: { case: 'lavoro', Tc: Tc.toString(), Tf: Tf.toString(), Qc: Qc.toString() },
				scene: scenaMacchine([engine(`Qc = ${KJ(Qc)}`, '', 'W = ?')], `Lo schema di una macchina termica tra una sorgente calda a ${lab(Tc)} K e una fredda a ${lab(Tf)} K: assorbe ${KJ(Qc)} e compie un lavoro da trovare.`, sorgenti),
			};
		}
		return {
			prompt: 'Trova il calore ceduto in un ciclo.',
			problem: textBlock(`${head} Quanto calore cede alla sorgente fredda in un ciclo?`),
			solution: `Q_f ${rel2(Qf)} ${wu(sig(Qf, 2), 'kJ')}`,
			steps: [
				textBlock('In una macchina reversibile i calori stanno tra loro come le temperature assolute delle sorgenti.'),
				`\\dfrac{Q_f}{Q_c} = \\dfrac{T_f}{T_c} \\quad\\Rightarrow\\quad Q_f = Q_c\\,\\dfrac{T_f}{T_c} = ${wu(fmtExact(Qc), 'kJ')} \\cdot \\dfrac{${fmtExact(Tf)}}{${fmtExact(Tc)}} ${rel2(Qf)} ${wu(sig(Qf, 2), 'kJ')}`,
			],
			// the work; the ratio upside down; degrees Celsius in the ratio
			answer: options(rng, Qf, [W, Qc.mul(Tc).div(Tf), Qc.mul(Tf.sub(K0)).div(Tc.sub(K0))], 'kJ', SIG2),
			params: { case: 'ceduto', Tc: Tc.toString(), Tf: Tf.toString(), Qc: Qc.toString() },
			scene: scenaMacchine([engine(`Qc = ${KJ(Qc)}`, 'Qf = ?', '')], `Lo schema di una macchina termica tra una sorgente calda a ${lab(Tc)} K e una fredda a ${lab(Tf)} K: assorbe ${KJ(Qc)} e cede un calore da trovare.`, sorgenti),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: a temperature from the efficiency

function level4(rng: Rng): Built {
	const askHot = rng.next() < 0.5;
	for (;;) {
		const eta = q(rng.int(20, 68), 100);
		if (askHot) {
			const Tf = q(rng.int(265, 325));
			const Tc = Tf.div(ONE.sub(eta));
			if (tie(Tc, INT) || ambiguous(Tc, INT)) continue;
			return {
				prompt: 'Trova la temperatura della sorgente calda.',
				problem: textBlock(`Una macchina reversibile ha un rendimento di $${eta2(eta)}$ e cede calore a una sorgente a ${pd(Tf, 'K')}. Qual è la temperatura della sorgente calda?`),
				solution: `T_c ${Tc.isInteger() ? '=' : '\\approx'} ${wu(fmt(Tc, INT), 'K')}`,
				steps: [
					`\\eta_{rev} = 1 - \\dfrac{T_f}{T_c} \\quad\\Rightarrow\\quad \\dfrac{T_f}{T_c} = 1 - \\eta_{rev} = ${eta2(ONE.sub(eta))}`,
					`T_c = \\dfrac{T_f}{1 - \\eta_{rev}} = \\dfrac{${wu(fmtExact(Tf), 'K')}}{${eta2(ONE.sub(eta))}} ${Tc.isInteger() ? '=' : `= ${cut(num(Tc), 1)}\\,\\text{K} \\approx`} ${wu(fmt(Tc, INT), 'K')}`,
				],
				// divided by η; multiplied by 1 + η; multiplied by 1 − η
				answer: options(rng, Tc, [Tf.div(eta), Tf.mul(ONE.add(eta)), Tf.mul(ONE.sub(eta))], 'K', INT),
				params: { case: 'calda', eta: eta.toString(), Tf: Tf.toString() },
			};
		}
		const Tc = q(rng.int(450, 900));
		const Tf = Tc.mul(ONE.sub(eta));
		if (tie(Tf, INT) || ambiguous(Tf, INT)) continue;
		return {
			prompt: 'Trova la temperatura della sorgente fredda.',
			problem: textBlock(`Una macchina reversibile ha un rendimento di $${eta2(eta)}$ e assorbe calore da una sorgente a ${pd(Tc, 'K')}. Qual è la temperatura della sorgente fredda?`),
			solution: `T_f ${Tf.isInteger() ? '=' : '\\approx'} ${wu(fmt(Tf, INT), 'K')}`,
			steps: [
				`\\eta_{rev} = 1 - \\dfrac{T_f}{T_c} \\quad\\Rightarrow\\quad \\dfrac{T_f}{T_c} = 1 - \\eta_{rev} = ${eta2(ONE.sub(eta))}`,
				`T_f = (1 - \\eta_{rev})\\,T_c = ${eta2(ONE.sub(eta))} \\cdot ${wu(fmtExact(Tc), 'K')} ${Tf.isInteger() ? '=' : `= ${wu(fmtExact(Tf), 'K')} \\approx`} ${wu(fmt(Tf, INT), 'K')}`,
			],
			// multiplied by η; divided by 1 + η; divided by 1 − η
			answer: options(rng, Tf, [Tc.mul(eta), Tc.div(ONE.add(eta)), Tc.div(ONE.sub(eta))], 'K', INT),
			params: { case: 'fredda', eta: eta.toString(), Tc: Tc.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: can the engine exist?

const VERDICTS = [
	{ key: 'irreversibile', text: 'Sì, ed è irreversibile' },
	{ key: 'reversibile', text: 'Sì, ed è reversibile' },
	{ key: 'secondo', text: 'No: viola il secondo principio' },
	{ key: 'primo', text: 'No: viola il primo principio' },
] as const;
type Verdict = (typeof VERDICTS)[number]['key'];

function level5(rng: Rng): Built {
	const kind: Verdict = rng.pick(['irreversibile', 'reversibile', 'secondo', 'primo']);
	for (;;) {
		// T_f = 5a, T_c = 5b: a reversible engine then has whole heats b·m and a·m.
		const a = rng.int(50, 70), b = rng.int(84, 180);
		const Tf = 5 * a, Tc = 5 * b;
		const rev = 1 - a / b;
		if (rev < 0.2 || rev > 0.7) continue;
		let Qc: number, W: number, Qf: number;
		if (kind === 'reversibile') {
			const m = rng.int(3, 12);
			Qc = b * m;
			Qf = a * m;
			W = Qc - Qf;
		} else {
			Qc = rng.int(400, 1500);
			const shift = rng.int(5, 15) / 100;
			const claimed = kind === 'irreversibile' ? rev - shift : kind === 'secondo' ? rev + shift : rev + rng.pick([-1, 1]) * shift;
			W = Math.round(Qc * claimed);
			Qf = Qc - W;
			if (kind === 'primo') Qf += rng.pick([-1, 1]) * rng.int(20, 90);
			if (W <= 20 || Qf <= 20 || W >= Qc) continue;
			// the declared efficiency stays clear of the reversible one, so the comparison needs no third decimal
			if (kind !== 'primo' && Math.abs(W / Qc - rev) < 0.03) continue;
		}
		const J = (n: number) => pd(q(n), 'J');
		const eta = q(W, Qc), etaRev = q(b - a, b);
		const etaTex = (r: R) => (r.mul(q(1000)).isInteger() ? fmtExact(r) : cut(num(r)));
		const balance = `Q_c - Q_f = ${Qc} - ${Qf} = ${wu(String(Qc - Qf), 'J')}`;
		const steps =
			kind === 'primo'
				? [balance, textBlock(`La macchina potrebbe compiere ${J(Qc - Qf)} di lavoro, non ${J(W)}: l'energia non si conserverebbe. È violato il primo principio.`)]
				: [
						balance,
						textBlock("Il bilancio dell'energia è in pari. Resta da confrontare il rendimento con quello di una macchina reversibile."),
						`\\eta = \\dfrac{W}{Q_c} = \\dfrac{${W}}{${Qc}} = ${etaTex(eta)}, \\quad \\eta_{rev} = 1 - \\dfrac{T_f}{T_c} = 1 - \\dfrac{${Tf}}{${Tc}} = ${etaTex(etaRev)}`,
						textBlock(
							kind === 'reversibile'
								? 'I due rendimenti sono uguali: la macchina può esistere, ed è reversibile.'
								: kind === 'irreversibile'
									? 'Il rendimento è minore di quello di una macchina reversibile: la macchina può esistere, ed è irreversibile.'
									: 'Il rendimento supera quello di una macchina reversibile: lo vieta il teorema di Carnot, cioè il secondo principio.',
						),
					];
		return {
			prompt: 'Di’ se la macchina può esistere.',
			problem: textBlock(`Un costruttore dichiara che la sua macchina termica, lavorando tra una sorgente a ${pd(q(Tc), 'K')} e una a ${pd(q(Tf), 'K')}, in ogni ciclo assorbe ${J(Qc)}, cede ${J(Qf)} e compie ${J(W)} di lavoro. Può esistere?`),
			solution: `\\text{${VERDICTS.find((v) => v.key === kind)!.text}}`,
			steps,
			answer: wordChoice(rng, VERDICTS, kind),
			params: { case: kind, Tc, Tf, Qc, Qf, W },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: a Carnot cycle run by n moles of gas

const MOLES = [100, 150, 200, 250, 300, 400, 500, 600, 750, 800];
const R_GAS = 8.31;
const V_STEPS = [0.5, 1, 2, 5, 10, 20];
const P_STEPS = [10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000];

function level6(rng: Rng): Built {
	for (;;) {
		const n = q(rng.pick(MOLES), 1000);
		const Tc = rng.int(400, 650), Tf = rng.int(250, 350);
		const VA = q(rng.pick([100, 150, 200, 250]), 100);
		const r = rng.pick([2, 3, 4]);
		const VB = VA.mul(q(r));
		const eta = 1 - Tf / Tc;
		if (eta < 0.15) continue;
		const nR = num(n) * R_GAS;
		const Qc = nR * Tc * Math.log(r), Qf = nR * Tf * Math.log(r);
		const W = Qc - Qf;
		if (nearTie(W, 3) || W < 100 || W >= 10000) continue;
		const Wr = fromFloat(W);
		if (ambiguous(Wr, SIG3)) continue;
		// The cycle to scale, for a monatomic gas: V_C = V_B k and V_D = V_A k, with k = (T_c / T_f)^(3/2).
		const k = (Tc / Tf) ** 1.5;
		const va = num(VA), vb = num(VB);
		const r4 = (x: number) => Math.round(x * 10000) / 10000;
		const states = [
			{ nome: 'A', V: va, p: r4((nR * Tc) / va) },
			{ nome: 'B', V: vb, p: r4((nR * Tc) / vb) },
			{ nome: 'C', V: r4(vb * k), p: r4((nR * Tf) / (vb * k)) },
			{ nome: 'D', V: r4(va * k), p: r4((nR * Tf) / (va * k)) },
		];
		const vStep = V_STEPS.find((s) => (vb * k) / s <= 8.5) ?? 50;
		const pStep = P_STEPS.find((s) => states[0].p / s <= 8.5) ?? 5000;
		const three = (x: R) => fixed(x, x.compare(q(10)) >= 0 ? 1 : 2);
		return {
			prompt: 'Trova il lavoro compiuto in un ciclo.',
			problem: textBlock(
				`Un ciclo di Carnot è percorso da $${fixed(n, 3)}\\,\\text{mol}$ di gas perfetto tra le temperature di ${pd(q(Tc), 'K')} e ${pd(q(Tf), 'K')}. Nell'espansione isoterma il volume del gas passa da $${three(VA)}\\,\\text{L}$ a $${three(VB)}\\,\\text{L}$. Quanto lavoro compie il gas in un ciclo? Usa $R = 8{,}31\\,\\text{J/(mol}\\cdot\\text{K)}$.`,
			),
			solution: `W \\approx ${wu(sig(Wr, 3), 'J')}`,
			steps: [
				textBlock("Il calore assorbito lungo l'isoterma alla temperatura più alta è uguale al lavoro compiuto in quel tratto."),
				`Q_c = n R\\,T_c \\ln\\dfrac{V_B}{V_A} = ${fixed(n, 3)} \\cdot 8{,}31 \\cdot ${Tc} \\cdot \\ln ${r}\\,\\text{J} = ${cut(Qc, 1)}\\,\\text{J}`,
				`\\eta = 1 - \\dfrac{T_f}{T_c} = 1 - \\dfrac{${Tf}}{${Tc}} = ${cut(eta, 4)}`,
				`W = \\eta\\,Q_c = ${cut(eta, 4)} \\cdot ${cut(Qc, 1)}\\,\\text{J} \\approx ${wu(sig(Wr, 3), 'J')}`,
			],
			// the heat absorbed; the heat given off; the logarithm in base ten
			answer: options(rng, Wr, [fromFloat(Qc), fromFloat(Qf), fromFloat(W / Math.LN10)], 'J', SIG3),
			params: { case: 'gas', n: n.toString(), Tc, Tf, VA: VA.toString(), VB: VB.toString() },
			scene: {
				type: 'ciclo-carnot',
				data: {
					V: { unita: 'L', passo: vStep, celle: Math.ceil((vb * k) / vStep) + 1, etichette: 2 },
					p: { unita: 'kPa', passo: pStep, celle: Math.ceil(states[0].p / pStep) + 1, etichette: 2 },
					stati: states,
					temperature: { calda: `${Tc} K`, fredda: `${Tf} K` },
				},
				alt: `Un ciclo di Carnot nel piano pressione-volume, percorso in senso orario: l'isoterma a ${Tc} K da A a B, dove il volume passa da ${lab(VA)} L a ${lab(VB)} L, un'adiabatica da B a C, l'isoterma a ${Tf} K da C a D e un'adiabatica da D ad A.`,
			},
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return sample.level === 5 ? checkWords(sample) : checkCommon(sample);
}

export const fisCicloCarnot: Generator = {
	id: ID,
	title: 'Il teorema di Carnot e il ciclo di Carnot',
	levels: {
		1: { label: 'Il rendimento con le temperature in kelvin', constraints: ['η = 1 − T_f / T_c', 'due decimali'] },
		2: { label: 'Le temperature in gradi Celsius', constraints: ['T = t + 273', 'η = 1 − T_f / T_c'] },
		3: { label: 'Lavoro e calore ceduto', constraints: ['W = η Q_c', 'Q_f = Q_c T_f / T_c'] },
		4: { label: 'La temperatura di una sorgente', constraints: ['T_c = T_f / (1 − η)', 'T_f = (1 − η) T_c'] },
		5: { label: 'La macchina può esistere?', constraints: ["prima il bilancio dell'energia", 'poi η contro η di Carnot'] },
		6: { label: 'Il lavoro di un ciclo di Carnot', constraints: ['Q_c = n R T_c ln(V_B / V_A)', 'W = η Q_c'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisCicloCarnot;
