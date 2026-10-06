/**
 * Le macchine termiche e il rendimento. Spec: specs/exercises/fis-macchine-termiche.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/114-fis-macchine-termiche.md), each one step harder: the
 * balance of a cycle, W = Q_c − Q_f (the work, or the heat given off); the efficiency from the work, η = W / Q_c;
 * the efficiency from the two heats, η = 1 − Q_f / Q_c; from the efficiency back to a heat (Q_c = W / η, or
 * Q_f = (1 − η) Q_c); an engine's power and the heat it absorbs in some minutes, Q_c = P Δt / η; a rectangular cycle
 * in the pressure-volume plane, whose work is the enclosed area. Q_c and Q_f are absolute values, as in the lesson.
 * Multiple choice with the unit in the option; an efficiency is a pure number with two decimals. Distractors from
 * the lesson's warnings: W = Q_c, the heat given off in the denominator, the fraction lost taken for the
 * efficiency, multiplying by η where one divides, minutes not converted, the area under the upper side.
 */
import type { Generator, Rng, Sample } from '../types';
import { decimals, fixed, sig } from '../fisica-forze';
import { type Built, type R, ETA, INT, SIG2, ambiguous, checkCommon, cut, engine, fmt, fmtExact, generateWith, lab, noZero, options, pd, q, roundTo, scenaMacchine, textBlock, tie, two, wu } from '../fis-macchine';

export const ID = 'fis-macchine-termiche';

const ONE = q(1);
const eta2 = (r: R) => fixed(r, 2);
const ratio = (a: R, b: R) => a.num / a.den / (b.num / b.den);
const J = (r: R) => `${lab(r)} J`;
const KJ = (r: R) => `${lab(r)} kJ`;
/** `= 0{,}354\ldots \approx 0{,}35`, or `= 0{,}35` when exact. */
const etaTail = (r: R) => (r.mul(q(100)).isInteger() ? `= ${fmt(r, ETA)}` : `= ${cut(r.num / r.den)} \\approx ${fmt(r, ETA)}`);
/** A heat in kilojoule with two significant figures: 1,1 to 9,9 kJ or 11 to 99 kJ. */
const heat = (rng: Rng) => two(rng, rng.next() < 0.5 ? 0 : 1);
/** The end of a step whose result is rounded to two figures: `= 12{,}5\,\text{kJ} \approx 13\,\text{kJ}`, `= 18\,\text{kJ}` when exact. */
function tail2(r: R, u: 'kJ' | 'J'): string {
	const rounded = wu(sig(r, 2), u);
	if (roundTo(r, SIG2).equals(r)) return `= ${rounded}`;
	const d = decimals(r);
	return Number.isFinite(d) && d <= 2 && r.compare(q(1000)) < 0 ? `= ${wu(fmtExact(r), u)} \\approx ${rounded}` : `= ${wu(cut(r.num / r.den, 2), u)} \\approx ${rounded}`;
}

// ---------------------------------------------------------------------------
// Level 1: the balance of a cycle

function level1(rng: Rng): Built {
	const askW = rng.next() < 0.5;
	for (;;) {
		const Qc = q(noZero(rng, 300, 1500));
		const Qf = q(noZero(rng, 120, 1300));
		const W = Qc.sub(Qf);
		const e = ratio(W, Qc);
		if (e < 0.15 || e > 0.6 || W.num % 10 === 0) continue;
		if (askW) {
			return {
				prompt: 'Trova il lavoro compiuto in un ciclo.',
				problem: textBlock(`In ogni ciclo una macchina termica assorbe ${pd(Qc, 'J')} dalla sorgente calda e cede ${pd(Qf, 'J')} alla sorgente fredda. Quanto lavoro compie in un ciclo?`),
				solution: `W = ${wu(fmtExact(W), 'J')}`,
				steps: [textBlock('In un ciclo il lavoro è il calore assorbito meno quello ceduto.'), `W = Q_c - Q_f = ${fmtExact(Qc)} - ${fmtExact(Qf)} = ${wu(fmtExact(W), 'J')}`],
				// W = Q_c (the lesson's warning); the two heats added; the heat given off
				answer: options(rng, W, [Qc, Qc.add(Qf), Qf], 'J', INT),
				params: { case: 'lavoro', Qc: Qc.toString(), Qf: Qf.toString() },
				scene: scenaMacchine([engine(`Qc = ${J(Qc)}`, `Qf = ${J(Qf)}`, 'W = ?')], `Lo schema di una macchina termica: assorbe ${J(Qc)} dalla sorgente calda, cede ${J(Qf)} alla sorgente fredda e compie un lavoro da trovare.`),
			};
		}
		return {
			prompt: 'Trova il calore ceduto in un ciclo.',
			problem: textBlock(`In ogni ciclo una macchina termica assorbe ${pd(Qc, 'J')} dalla sorgente calda e compie un lavoro di ${pd(W, 'J')}. Quanto calore cede alla sorgente fredda in un ciclo?`),
			solution: `Q_f = ${wu(fmtExact(Qf), 'J')}`,
			steps: [textBlock('In un ciclo il lavoro è il calore assorbito meno quello ceduto.'), 'W = Q_c - Q_f', `Q_f = Q_c - W = ${fmtExact(Qc)} - ${fmtExact(W)} = ${wu(fmtExact(Qf), 'J')}`],
			// the work added; the work itself; the heat absorbed
			answer: options(rng, Qf, [Qc.add(W), W, Qc], 'J', INT),
			params: { case: 'ceduto', Qc: Qc.toString(), W: W.toString() },
			scene: scenaMacchine([engine(`Qc = ${J(Qc)}`, 'Qf = ?', `W = ${J(W)}`)], `Lo schema di una macchina termica: assorbe ${J(Qc)} dalla sorgente calda, compie un lavoro di ${J(W)} e cede alla sorgente fredda un calore da trovare.`),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the efficiency from the work

function level2(rng: Rng): Built {
	for (;;) {
		const Qc = heat(rng);
		const W = heat(rng);
		const e = ratio(W, Qc);
		if (e < 0.12 || e > 0.6) continue;
		const eta = W.div(Qc);
		if (tie(eta, ETA)) continue;
		return {
			prompt: 'Trova il rendimento.',
			problem: textBlock(`In ogni ciclo una macchina termica assorbe ${pd(Qc, 'kJ')} dalla sorgente calda e compie un lavoro di ${pd(W, 'kJ')}. Qual è il suo rendimento?`),
			solution: `\\eta ${eta.mul(q(100)).isInteger() ? '=' : '\\approx'} ${fmt(eta, ETA)}`,
			steps: [textBlock('Il rendimento è il lavoro diviso il calore assorbito.'), `\\eta = \\dfrac{W}{Q_c} = \\dfrac{${wu(fmtExact(W), 'kJ')}}{${wu(fmtExact(Qc), 'kJ')}} ${etaTail(eta)}`],
			// the fraction lost; the heat given off in the denominator; the ratio upside down
			answer: options(rng, eta, [ONE.sub(eta), W.div(Qc.sub(W)), Qc.div(W)], 'none', ETA),
			params: { case: 'lavoro', Qc: Qc.toString(), W: W.toString() },
			scene: scenaMacchine([engine(`Qc = ${KJ(Qc)}`, '', `W = ${KJ(W)}`)], `Lo schema di una macchina termica: assorbe ${KJ(Qc)} dalla sorgente calda e compie un lavoro di ${KJ(W)}.`),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the efficiency from the two heats

function level3(rng: Rng): Built {
	for (;;) {
		const Qc = heat(rng);
		const Qf = heat(rng);
		const k = ratio(Qf, Qc);
		if (k < 0.4 || k > 0.88) continue;
		const lost = Qf.div(Qc);
		const eta = ONE.sub(lost);
		if (tie(eta, ETA) || tie(lost, ETA)) continue;
		const W = Qc.sub(Qf);
		const lostTex = lost.mul(q(100)).isInteger() ? fmt(lost, ETA) : cut(lost.num / lost.den);
		return {
			prompt: 'Trova il rendimento.',
			problem: textBlock(`In ogni ciclo una macchina termica assorbe ${pd(Qc, 'kJ')} dalla sorgente calda e cede ${pd(Qf, 'kJ')} alla sorgente fredda. Qual è il suo rendimento?`),
			solution: `\\eta ${eta.mul(q(100)).isInteger() ? '=' : '\\approx'} ${fmt(eta, ETA)}`,
			steps: [
				textBlock('Con i due calori il rendimento è uno meno il rapporto tra il calore ceduto e quello assorbito.'),
				`\\eta = 1 - \\dfrac{Q_f}{Q_c} = 1 - \\dfrac{${wu(fmtExact(Qf), 'kJ')}}{${wu(fmtExact(Qc), 'kJ')}} = 1 - ${lostTex} ${eta.mul(q(100)).isInteger() ? '=' : '\\approx'} ${fmt(eta, ETA)}`,
			],
			// the fraction lost taken for the efficiency; the work over the heat given off
			answer: options(rng, eta, [lost, W.div(Qf)], 'none', ETA, ONE),
			params: { case: 'calori', Qc: Qc.toString(), Qf: Qf.toString() },
			scene: scenaMacchine([engine(`Qc = ${KJ(Qc)}`, `Qf = ${KJ(Qf)}`, '')], `Lo schema di una macchina termica: assorbe ${KJ(Qc)} dalla sorgente calda e cede ${KJ(Qf)} alla sorgente fredda.`),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: from the efficiency back to a heat

function level4(rng: Rng): Built {
	const askQc = rng.next() < 0.5;
	for (;;) {
		const eta = q(rng.int(15, 55), 100);
		if (askQc) {
			const W = heat(rng);
			const Qc = W.div(eta);
			if (tie(Qc, SIG2) || ambiguous(Qc, SIG2)) continue;
			return {
				prompt: 'Trova il calore assorbito in un ciclo.',
				problem: textBlock(`Una macchina termica ha un rendimento di $${eta2(eta)}$ e in ogni ciclo compie un lavoro di ${pd(W, 'kJ')}. Quanto calore assorbe dalla sorgente calda in un ciclo?`),
				solution: `Q_c ${roundTo(Qc, SIG2).equals(Qc) ? '=' : '\\approx'} ${wu(sig(Qc, 2), 'kJ')}`,
				steps: [
					textBlock('Dalla definizione del rendimento, il calore assorbito è il lavoro diviso il rendimento.'),
					`Q_c = \\dfrac{W}{\\eta} = \\dfrac{${wu(fmtExact(W), 'kJ')}}{${eta2(eta)}} ${tail2(Qc, 'kJ')}`,
				],
				// multiplied where one divides; divided by 1 − η; the heat given off's formula
				answer: options(rng, Qc, [W.mul(eta), W.div(ONE.sub(eta)), W.mul(ONE.sub(eta))], 'kJ', SIG2),
				params: { case: 'assorbito', eta: eta.toString(), W: W.toString() },
				scene: scenaMacchine([engine('Qc = ?', '', `W = ${KJ(W)}`)], `Lo schema di una macchina termica: compie un lavoro di ${KJ(W)} e assorbe dalla sorgente calda un calore da trovare.`),
			};
		}
		const Qc = heat(rng);
		const Qf = Qc.mul(ONE.sub(eta));
		if (tie(Qf, SIG2) || ambiguous(Qf, SIG2)) continue;
		return {
			prompt: 'Trova il calore ceduto in un ciclo.',
			problem: textBlock(`Una macchina termica ha un rendimento di $${eta2(eta)}$ e in ogni ciclo assorbe ${pd(Qc, 'kJ')} dalla sorgente calda. Quanto calore cede alla sorgente fredda in un ciclo?`),
			solution: `Q_f ${roundTo(Qf, SIG2).equals(Qf) ? '=' : '\\approx'} ${wu(sig(Qf, 2), 'kJ')}`,
			steps: [
				textBlock('Il lavoro è la frazione del calore assorbito data dal rendimento; il resto è il calore ceduto.'),
				`Q_f = (1 - \\eta)\\,Q_c = (1 - ${eta2(eta)}) \\cdot ${wu(fmtExact(Qc), 'kJ')} = ${eta2(ONE.sub(eta))} \\cdot ${wu(fmtExact(Qc), 'kJ')} ${tail2(Qf, 'kJ')}`,
			],
			// the work in place of the heat given off; divided by 1 − η; divided by η
			answer: options(rng, Qf, [Qc.mul(eta), Qc.div(ONE.sub(eta)), Qc.div(eta)], 'kJ', SIG2),
			params: { case: 'ceduto', eta: eta.toString(), Qc: Qc.toString() },
			scene: scenaMacchine([engine(`Qc = ${KJ(Qc)}`, 'Qf = ?', '')], `Lo schema di una macchina termica: assorbe ${KJ(Qc)} dalla sorgente calda e cede alla sorgente fredda un calore da trovare.`),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the power

const MINUTES = [2, 3, 4, 5, 6, 8, 12, 15, 25];

function level5(rng: Rng): Built {
	for (;;) {
		const P = q(noZero(rng, 11, 99));
		const eta = q(rng.int(20, 45), 100);
		const min = q(rng.pick(MINUTES));
		const s = min.mul(q(60));
		const W = P.mul(q(1000)).mul(s);
		const Qc = W.div(eta);
		if (tie(Qc, SIG2) || tie(W, SIG2)) continue;
		return {
			prompt: 'Trova il calore assorbito.',
			problem: textBlock(`Un motore termico ha una potenza di ${pd(P, 'kW')} e un rendimento di $${eta2(eta)}$. Quanto calore assorbe in ${pd(min, 'min')}?`),
			solution: `Q_c ${roundTo(Qc, SIG2).equals(Qc) ? '=' : '\\approx'} ${wu(sig(Qc, 2), 'J')}`,
			steps: [
				`\\Delta t = ${fmtExact(min)}\\,\\text{min} = ${fmtExact(s)}\\,\\text{s}, \\quad P = ${wu(fmtExact(P), 'kW')} = ${sig(P.mul(q(1000)), 2)}\\,\\text{W}`,
				`W = P\\,\\Delta t = ${sig(P.mul(q(1000)), 2)}\\,\\text{W} \\cdot ${fmtExact(s)}\\,\\text{s} ${roundTo(W, SIG2).equals(W) ? '=' : '\\approx'} ${wu(sig(W, 2), 'J')}`,
				`Q_c = \\dfrac{W}{\\eta} = \\dfrac{P\\,\\Delta t}{\\eta} = \\dfrac{${sig(P.mul(q(1000)), 2)} \\cdot ${fmtExact(s)}}{${eta2(eta)}}\\,\\text{J} ${roundTo(Qc, SIG2).equals(Qc) ? '=' : '\\approx'} ${wu(sig(Qc, 2), 'J')}`,
			],
			// minutes not converted; multiplied by η; the work, without the efficiency
			answer: options(rng, Qc, [Qc.div(q(60)), W.mul(eta), W], 'J', SIG2),
			params: { case: 'potenza', P: P.toString(), eta: eta.toString(), min: min.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: a rectangular cycle

function level6(rng: Rng): Built {
	for (;;) {
		const p1 = rng.pick([100, 150, 200]);
		const dp = 50 * rng.int(1, 6);
		const V1 = rng.int(1, 4);
		const dV = rng.int(1, 5);
		const p2 = p1 + dp, V2 = V1 + dV;
		if (p2 > 500 || V2 > 8) continue;
		const W = q(dp * dV);
		const Qc = q(3 * V1 * dp, 2).add(q(5 * p2 * dV, 2));
		const eta = W.div(Qc);
		if (ratio(W, Qc) < 0.1 || tie(eta, ETA)) continue;
		const pa = (x: number) => `${sig(q(x * 1000), 2)}\\,\\text{Pa}`;
		const states = [
			{ nome: 'A', V: V1, p: p2 },
			{ nome: 'B', V: V2, p: p2 },
			{ nome: 'C', V: V2, p: p1 },
			{ nome: 'D', V: V1, p: p1 },
		];
		return {
			prompt: 'Trova il rendimento del ciclo.',
			problem: textBlock(`Un gas perfetto compie in senso orario il ciclo rettangolare $ABCD$ della figura, tra le pressioni di ${pd(q(p1), 'kPa')} e ${pd(q(p2), 'kPa')} e tra i volumi di ${pd(q(V1), 'L')} e ${pd(q(V2), 'L')}. In ogni ciclo assorbe ${pd(Qc, 'J')} di calore. Qual è il rendimento del ciclo?`),
			solution: `\\eta ${eta.mul(q(100)).isInteger() ? '=' : '\\approx'} ${fmt(eta, ETA)}`,
			steps: [
				textBlock("Il lavoro di un ciclo è l'area che racchiude: per un rettangolo, base per altezza."),
				`p_A - p_D = ${fmtExact(q(dp))}\\,\\text{kPa} = ${pa(dp)}, \\quad V_B - V_A = ${fmtExact(q(dV))}\\,\\text{L} = ${fmtExact(q(dV))} \\cdot 10^{-3}\\,\\text{m}^3`,
				`W = (p_A - p_D)(V_B - V_A) = ${pa(dp)} \\cdot ${fmtExact(q(dV))} \\cdot 10^{-3}\\,\\text{m}^3 = ${wu(fmtExact(W), 'J')}`,
				`\\eta = \\dfrac{W}{Q_c} = \\dfrac{${wu(fmtExact(W), 'J')}}{${wu(fmtExact(Qc), 'J')}} ${etaTail(eta)}`,
			],
			// the area under the upper side, not the enclosed one; the whole volume as the base; the fraction lost
			answer: options(rng, eta, [q(p2 * dV).div(Qc), q(dp * V2).div(Qc), ONE.sub(eta)], 'none', ETA, ONE),
			params: { case: 'rettangolo', p1, p2, V1, V2, Qc: Qc.toString() },
			scene: {
				type: 'piano-pv',
				data: {
					V: { unita: 'L', passo: 1, celle: V2 + 1, etichette: 1 },
					p: { unita: 'kPa', passo: 50, celle: p2 / 50 + 1, etichette: 2 },
					stati: states,
					tratti: [
						{ da: 'A', a: 'B', tipo: 'retta' },
						{ da: 'B', a: 'C', tipo: 'retta' },
						{ da: 'C', a: 'D', tipo: 'retta' },
						{ da: 'D', a: 'A', tipo: 'retta' },
					],
				},
				alt: `Nel piano pressione-volume un ciclo rettangolare percorso in senso orario: A a ${V1} L e ${p2} kPa, B a ${V2} L e ${p2} kPa, C a ${V2} L e ${p1} kPa, D a ${V1} L e ${p1} kPa.`,
			},
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const fisMacchineTermiche: Generator = {
	id: ID,
	title: 'Le macchine termiche e il rendimento',
	levels: {
		1: { label: 'Il bilancio di un ciclo', constraints: ['W = Q_c − Q_f', 'il lavoro o il calore ceduto'] },
		2: { label: 'Il rendimento dal lavoro', constraints: ['η = W / Q_c', 'due decimali'] },
		3: { label: 'Il rendimento dai due calori', constraints: ['η = 1 − Q_f / Q_c'] },
		4: { label: 'Dal rendimento ai calori', constraints: ['Q_c = W / η', 'Q_f = (1 − η) Q_c'] },
		5: { label: 'La potenza del motore', constraints: ['Q_c = P Δt / η', 'tempo in minuti'] },
		6: { label: 'Il ciclo rettangolare', constraints: ["il lavoro è l'area del rettangolo", 'η = W / Q_c'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisMacchineTermiche;
