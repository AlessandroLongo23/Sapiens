/**
 * Il primo principio della termodinamica. Spec: specs/exercises/principi-termo.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/110-principi-termo.md), each one step harder:
 * ΔU = Q − W with a heat absorbed and a work done; the signs read from the words (heat given off, work done on the
 * gas); the heat or the work from the other two; the work to compute first, W = p ΔV at constant pressure, with the
 * isobar drawn by the scene `piano-pv`; the change of temperature of a monatomic gas, ΔT = 2 ΔU / (3 n R); the
 * simple cases of the lesson's table (a cycle, no heat exchanged, constant volume). Heats and works are whole joules
 * with three figures at levels 1-3 and 6, and the answers are exact; at levels 4 and 5 the answers have two
 * significant figures. Every answer carries its sign; multiple choice with the lesson's mistakes: the sign of the
 * work done on the gas, Q + W, the work forgotten.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, type R, INT, R_GAS, SIG2, ambiguous, approx, checkCommon, fmt, fmtExact, generateWith, noZero, one, options, par, pd, pu, q, rel, scenaPV, sci, t, tenths, textBlock, tie, wu } from '../fis-termo-pv';

export const ID = 'principi-termo';

const J = (r: R) => wu(fmtExact(r), 'J');
const int = (r: R) => fmt(r, INT);
const three = (rng: Rng) => q(noZero(rng, 105, 985));
const E5 = q(100000);
const K1000 = q(1000);

/** The heat and the work of a transformation in words, with their signed values. */
function exchange(rng: Rng, absorbs: boolean, does: boolean) {
	const Qa = three(rng), Wa = three(rng);
	return {
		Qa,
		Wa,
		Q: absorbs ? Qa : Qa.neg(),
		W: does ? Wa : Wa.neg(),
		heat: `${absorbs ? 'assorbe' : 'cede'} ${pd(Qa, 'J')} di calore`,
		work: does ? `compie ${pd(Wa, 'J')} di lavoro` : `l'ambiente compie su di esso un lavoro di ${pd(Wa, 'J')}`,
		signs: [absorbs ? t('Il calore è assorbito: ') + `Q = +${J(Qa)}` : t('Il calore è ceduto: ') + `Q = -${J(Qa)}`, does ? t('Il lavoro è compiuto dal gas: ') + `W = +${J(Wa)}` : t('Il lavoro è compiuto sul gas: ') + `W = -${J(Wa)}`],
	};
}

const first = (Q: R, W: R, dU: R) => `\\Delta U = Q - W = ${fmtExact(Q)} - ${par(fmtExact(W))} = ${J(dU)}`;

// ---------------------------------------------------------------------------
// Level 1: heat absorbed, work done

function level1(rng: Rng): Built {
	for (;;) {
		const e = exchange(rng, true, true);
		const dU = e.Q.sub(e.W);
		if (ambiguous(dU, INT)) continue;
		return {
			prompt: "Trova la variazione dell'energia interna.",
			problem: textBlock(`Un gas ${e.heat} e, espandendosi, ${e.work}. Di quanto varia la sua energia interna?`),
			solution: `\\Delta U = ${wu(int(dU), 'J')}`,
			steps: [...e.signs, first(e.Q, e.W, dU)],
			// Q + W; W − Q
			answer: options(rng, dU, [e.Q.add(e.W), e.W.sub(e.Q)], 'J', INT),
			params: { case: dU.sign() > 0 ? 'aumenta' : 'diminuisce', Q: e.Q.toString(), W: e.W.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the signs from the words

const CASES2 = [
	{ id: 'cede-compie', absorbs: false, does: true },
	{ id: 'assorbe-subisce', absorbs: true, does: false },
	{ id: 'cede-subisce', absorbs: false, does: false },
] as const;

function level2(rng: Rng): Built {
	const c = rng.pick(CASES2);
	for (;;) {
		const e = exchange(rng, c.absorbs, c.does);
		const dU = e.Q.sub(e.W);
		if (ambiguous(dU, INT) || e.Qa.equals(e.Wa)) continue;
		// every other choice of the two signs
		const wrong = [e.Qa.sub(e.Wa), e.Qa.add(e.Wa), e.Qa.neg().sub(e.Wa), e.Wa.sub(e.Qa)].filter((x) => !x.equals(dU));
		return {
			prompt: "Trova la variazione dell'energia interna.",
			problem: textBlock(`Un gas ${e.heat}, mentre ${e.work}. Di quanto varia la sua energia interna?`),
			solution: `\\Delta U = ${wu(int(dU), 'J')}`,
			steps: [...e.signs, first(e.Q, e.W, dU)],
			answer: options(rng, dU, wrong, 'J', INT),
			params: { case: c.id, Q: e.Q.toString(), W: e.W.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the heat or the work from the other two

function level3(rng: Rng): Built {
	const askQ = rng.next() < 0.5;
	const up = rng.next() < 0.5;
	const positive = rng.next() < 0.5;
	for (;;) {
		const Da = three(rng), Xa = three(rng);
		const dU = up ? Da : Da.neg();
		const change = `L'energia interna di un gas ${up ? 'aumenta' : 'diminuisce'} di ${pd(Da, 'J')}`;
		const stepU = (up ? t("L'energia interna aumenta: ") : t("L'energia interna diminuisce: ")) + `\\Delta U = ${up ? '+' : '-'}${J(Da)}`;
		if (askQ) {
			const W = positive ? Xa : Xa.neg();
			const Q = dU.add(W);
			if (ambiguous(Q, INT)) continue;
			return {
				prompt: 'Trova il calore scambiato, positivo se assorbito.',
				problem: textBlock(`${change}, mentre ${positive ? `il gas compie ${pd(Xa, 'J')} di lavoro` : `l'ambiente compie sul gas un lavoro di ${pd(Xa, 'J')}`}. Quanto calore scambia il gas?`),
				solution: `Q = ${wu(int(Q), 'J')}`,
				steps: [
					stepU,
					positive ? t('Il lavoro è compiuto dal gas: ') + `W = +${J(Xa)}` : t('Il lavoro è compiuto sul gas: ') + `W = -${J(Xa)}`,
					`Q = \\Delta U + W = ${fmtExact(dU)} + ${par(fmtExact(W))} = ${J(Q)}`,
					t(Q.sign() > 0 ? 'Q è positivo: il gas assorbe calore.' : 'Q è negativo: il gas cede calore.'),
				],
				// ΔU − W; the opposite sign; the two without their signs
				answer: options(rng, Q, [dU.sub(W), Q.neg(), W.sub(dU)], 'J', INT),
				params: { case: 'calore', dU: dU.toString(), W: W.toString() },
			};
		}
		const Q = positive ? Xa : Xa.neg();
		const W = Q.sub(dU);
		if (ambiguous(W, INT)) continue;
		return {
			prompt: 'Trova il lavoro del gas, negativo se lo subisce.',
			problem: textBlock(`${change}, mentre il gas ${positive ? 'assorbe' : 'cede'} ${pd(Xa, 'J')} di calore. Quanto lavoro compie il gas?`),
			solution: `W = ${wu(int(W), 'J')}`,
			steps: [
				stepU,
				positive ? t('Il calore è assorbito: ') + `Q = +${J(Xa)}` : t('Il calore è ceduto: ') + `Q = -${J(Xa)}`,
				`W = Q - \\Delta U = ${fmtExact(Q)} - ${par(fmtExact(dU))} = ${J(W)}`,
				t(W.sign() > 0 ? 'W è positivo: il gas compie lavoro.' : "W è negativo: è l'ambiente a compiere lavoro sul gas."),
			],
			// Q + ΔU; the opposite sign; ΔU + Q with the other sign
			answer: options(rng, W, [Q.add(dU), W.neg(), Q.add(dU).neg()], 'J', INT),
			params: { case: 'lavoro', dU: dU.toString(), Q: Q.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the work has to be computed

const AX_V = { unita: 'L', passo: 1, celle: 10, etichette: 1 };
const AX_P = { unita: '10⁵ Pa', passo: 1, celle: 6, etichette: 1 };

function level4(rng: Rng): Built {
	for (;;) {
		const pm = tenths(rng, 11, 55);
		const vi = tenths(rng, 10, 50);
		const vf = vi.add(tenths(rng, 10, 40));
		const dV = vf.sub(vi);
		const W = pm.mul(E5).mul(dV).div(K1000);
		const e = rng.pick([2, 3]);
		const qm = tenths(rng, 11, 99);
		const Q = qm.mul(q(10 ** e));
		const dU = Q.sub(W);
		// an expansion at constant pressure of a perfect gas takes between 2 and 4 times its work as heat
		if (Q.compare(W.mul(q(2))) < 0 || Q.compare(W.mul(q(4))) > 0) continue;
		if (tie(dU, SIG2) || ambiguous(dU, SIG2) || tie(W, SIG2)) continue;
		const stati = [{ nome: 'A', V: vi.num / vi.den, p: pm.num / pm.den }, { nome: 'B', V: vf.num / vf.den, p: pm.num / pm.den }];
		return {
			prompt: "Trova la variazione dell'energia interna.",
			problem: textBlock(`Un gas in un cilindro con il pistone libero, alla pressione costante di $${sci(pm, 5)}\\,\\text{Pa}$, assorbe $${sci(qm, e)}\\,\\text{J}$ di calore e si espande da ${pu(one(vi), 'L')} a ${pu(one(vf), 'L')}. Di quanto varia la sua energia interna?`),
			solution: `\\Delta U ${rel(dU, SIG2)} ${wu(fmt(dU, SIG2), 'J')}`,
			steps: [
				`\\Delta V = ${one(vf)} - ${one(vi)} = ${wu(one(dV), 'L')} = ${sci(dV, -3)}\\,\\text{m}^3`,
				`W = p\\,\\Delta V = ${sci(pm, 5)} \\cdot ${sci(dV, -3)}\\,\\text{J} = ${J(W)}`,
				`\\Delta U = Q - W = ${fmtExact(Q)} - ${fmtExact(W)}\\,\\text{J} ${approx(dU, SIG2, 'J')}`,
			],
			// the work added; the work forgotten; the work alone
			answer: options(rng, dU, [Q.add(W), Q, W], 'J', SIG2),
			params: { case: 'isobara', p: pm.mul(E5).toString(), vi: vi.div(K1000).toString(), vf: vf.div(K1000).toString(), Q: Q.toString() },
			scene: scenaPV(AX_V, AX_P, stati, [{ da: 'A', a: 'B', tipo: 'retta' }], `Il piano pressione-volume: un segmento orizzontale con una freccia verso destra, alla pressione di ${one(pm).replace('{,}', ',')} per dieci alla quinta pascal, va dallo stato A, a ${one(vi).replace('{,}', ',')} litri, allo stato B, a ${one(vf).replace('{,}', ',')} litri`),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the change of temperature of a monatomic gas

function level5(rng: Rng): Built {
	const absorbs = rng.next() < 0.5, does = rng.next() < 0.5;
	for (;;) {
		const n = rng.next() < 0.5 ? q(noZero(rng, 11, 99), 100) : q(noZero(rng, 11, 39), 10);
		const e = exchange(rng, absorbs, does);
		const dU = e.Q.sub(e.W);
		if (dU.sign() === 0) continue;
		const k = q(3, 2).mul(n).mul(R_GAS);
		const dT = dU.div(k);
		if (dT.abs().compare(q(5)) < 0 || dT.abs().compare(q(400)) > 0) continue;
		if (tie(dT, SIG2) || ambiguous(dT, SIG2)) continue;
		const nTex = fmtExact(n);
		return {
			prompt: 'Trova la variazione di temperatura.',
			problem: textBlock(`Un campione di ${pu(nTex, 'mol')} di gas perfetto monoatomico ${e.heat}, mentre ${e.work}. Di quanto varia la sua temperatura? Usa $R = 8{,}31\\,\\text{J/(mol}\\cdot\\text{K)}$.`),
			solution: `\\Delta T \\approx ${wu(fmt(dT, SIG2), 'K')}`,
			steps: [
				...e.signs,
				first(e.Q, e.W, dU),
				`\\Delta T = \\dfrac{2\\,\\Delta U}{3\\,n\\,R} = \\dfrac{2 \\cdot ${par(fmtExact(dU))}}{3 \\cdot ${nTex} \\cdot 8{,}31}\\,\\text{K} \\approx ${wu(fmt(dT, SIG2), 'K')}`,
			],
			// the 3/2 forgotten; the work with the wrong sign; the opposite sign
			answer: options(rng, dT, [dU.div(n.mul(R_GAS)), e.Q.add(e.W).div(k), dT.neg()], 'K', SIG2),
			params: { case: `${absorbs ? 'assorbe' : 'cede'}-${does ? 'compie' : 'subisce'}`, n: n.toString(), Q: e.Q.toString(), W: e.W.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: the simple cases

function level6(rng: Rng): Built {
	const kind = rng.pick(['ciclo', 'adiabatica', 'isocora'] as const);
	const positive = rng.next() < 0.5;
	for (;;) {
		if (kind === 'ciclo') {
			const a = three(rng), b = three(rng);
			const W = a.sub(b);
			if (ambiguous(W, INT)) continue;
			return {
				prompt: 'Trova il lavoro del ciclo.',
				problem: textBlock(`In una trasformazione ciclica un gas assorbe in tutto ${pd(a, 'J')} di calore e ne cede in tutto ${pd(b, 'J')}. Quanto lavoro compie in un ciclo?`),
				solution: `W = ${wu(int(W), 'J')}`,
				steps: [
					t("Il gas torna nello stato iniziale: l'energia interna non cambia.") + ` \\; \\Delta U = 0`,
					`W = Q = ${fmtExact(a)} - ${fmtExact(b)} = ${J(W)}`,
					t(W.sign() > 0 ? 'Il lavoro è positivo: in un ciclo il gas compie lavoro.' : "Il lavoro è negativo: in un ciclo è l'ambiente a compiere lavoro sul gas."),
				],
				// the heats added; the opposite sign; the heat absorbed alone
				answer: options(rng, W, [a.add(b), W.neg(), a], 'J', INT),
				params: { case: 'ciclo', assorbito: a.toString(), ceduto: b.toString() },
			};
		}
		const x = three(rng);
		if (kind === 'adiabatica') {
			const dU = positive ? x : x.neg();
			return {
				prompt: "Trova la variazione dell'energia interna.",
				problem: textBlock(positive ? `Un gas viene compresso senza scambiare calore con l'ambiente, che compie su di esso un lavoro di ${pd(x, 'J')}. Di quanto varia la sua energia interna?` : `Un gas si espande senza scambiare calore con l'ambiente e compie ${pd(x, 'J')} di lavoro. Di quanto varia la sua energia interna?`),
				solution: `\\Delta U = ${wu(int(dU), 'J')}`,
				steps: [`Q = 0, \\quad W = ${positive ? '-' : '+'}${J(x)}`, `\\Delta U = Q - W = 0 - ${par(fmtExact(dU.neg()))} = ${J(dU)}`],
				answer: options(rng, dU, [dU.neg()], 'J', INT),
				params: { case: 'adiabatica', W: dU.neg().toString() },
			};
		}
		const dU = positive ? x : x.neg();
		return {
			prompt: "Trova la variazione dell'energia interna.",
			problem: textBlock(`Un gas chiuso in un recipiente rigido ${positive ? 'assorbe' : 'cede'} ${pd(x, 'J')} di calore. Di quanto varia la sua energia interna?`),
			solution: `\\Delta U = ${wu(int(dU), 'J')}`,
			steps: [t('Il volume è costante: il gas non compie lavoro.') + ` \\; W = 0`, `\\Delta U = Q - W = ${fmtExact(dU)} - 0 = ${J(dU)}`],
			answer: options(rng, dU, [dU.neg()], 'J', INT),
			params: { case: 'isocora', Q: dU.toString() },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const principiTermo: Generator = {
	id: ID,
	title: 'Il primo principio della termodinamica',
	levels: {
		1: { label: 'Calore assorbito e lavoro compiuto', constraints: ['ΔU = Q − W', 'Q e W positivi'] },
		2: { label: 'I segni di calore e lavoro', constraints: ['calore ceduto', 'lavoro compiuto sul gas'] },
		3: { label: 'Trovare il calore o il lavoro', constraints: ['Q = ΔU + W', 'W = Q − ΔU'] },
		4: { label: 'Il lavoro va calcolato', constraints: ['W = p ΔV a pressione costante', 'litri da convertire'] },
		5: { label: 'La variazione di temperatura', constraints: ['gas monoatomico', 'ΔT = 2 ΔU / (3 n R)'] },
		6: { label: 'Cicli, recipienti rigidi, nessuno scambio di calore', constraints: ['ΔU = 0 in un ciclo', 'W = 0 a volume costante', 'Q = 0'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default principiTermo;
