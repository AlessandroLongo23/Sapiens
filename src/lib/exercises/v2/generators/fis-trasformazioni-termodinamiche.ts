/**
 * Le trasformazioni isocora, isobara e isoterma. Spec: specs/exercises/fis-trasformazioni-termodinamiche.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/111-fis-trasformazioni-termodinamiche.md), each one step
 * harder, always with a perfect gas (monatomic where the internal energy is needed) and R = 8,31 J/(mol·K): the heat
 * at constant volume, Q = ΔU = 3/2 n R ΔT; the work at constant pressure, W = n R ΔT; the heat or the change of
 * internal energy at constant pressure, 5/2 and 3/2 n R ΔT; the work of an isothermal expansion, n R T ln(V_B/V_A);
 * an isothermal compression, from the volumes or from the pressures, with its negative sign; a cycle of three legs
 * (an isobar, an isochore and an isotherm) read on the pressure-volume plane, drawn by the scene `piano-pv` in
 * litres and kilopascal. Answers in joule with two significant figures, never near a tie; multiple choice with the
 * lesson's mistakes: the coefficient of another transformation, the final temperature in place of ΔT, the logarithm
 * forgotten or taken in base ten, the ratio upside down.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, type R, type StatoPV, type TrattoPV, R_GAS, SIG2, ambiguous, approx, checkCommon, cut1, fmt, fmtExact, fromFloat, generateWith, nearTie, noZero, one, options, pd, pu, q, scenaPV, sci, shown, statoAlt, t, tenths, textBlock, tie, wu } from '../fis-termo-pv';

export const ID = 'fis-trasformazioni-termodinamiche';

const USE_R = 'Usa $R = 8{,}31\\,\\text{J/(mol}\\cdot\\text{K)}$.';
const sig = (r: R) => fmt(r, SIG2);
const ok = (x: R) => !tie(x, SIG2) && !ambiguous(x, SIG2);
/** Moles with two significant figures: 0,11 to 0,99 or 1,1 to 3,9. */
const moles = (rng: Rng) => (rng.next() < 0.5 ? q(noZero(rng, 11, 99), 100) : q(noZero(rng, 11, 39), 10));
/** Two temperatures in kelvin, the second 20 to 200 K above the first. */
function heating(rng: Rng) {
	const TA = q(rng.int(250, 350));
	const dT = q(rng.int(20, 200));
	return { TA, TB: TA.add(dT), dT };
}
const stepDT = (h: { TA: R; TB: R; dT: R }) => `\\Delta T = ${fmtExact(h.TB)} - ${fmtExact(h.TA)} = ${wu(fmtExact(h.dT), 'K')}`;

// ---------------------------------------------------------------------------
// Level 1: constant volume

function level1(rng: Rng): Built {
	for (;;) {
		const n = moles(rng), h = heating(rng);
		const nR = n.mul(R_GAS);
		const Q = q(3, 2).mul(nR).mul(h.dT);
		if (!ok(Q)) continue;
		return {
			prompt: 'Trova il calore a volume costante.',
			problem: textBlock(`Una bombola rigida contiene ${pd(n, 'mol')} di gas perfetto monoatomico a ${pd(h.TA, 'K')}. Quanto calore serve per portare il gas a ${pd(h.TB, 'K')}? ${USE_R}`),
			solution: `Q \\approx ${wu(sig(Q), 'J')}`,
			steps: [
				t('Il volume è costante: il gas non compie lavoro, e tutto il calore diventa energia interna.'),
				stepDT(h),
				`Q = \\Delta U = \\dfrac{3}{2}\\,n\\,R\\,\\Delta T = \\dfrac{3}{2} \\cdot ${fmtExact(n)} \\cdot 8{,}31 \\cdot ${fmtExact(h.dT)}\\,\\text{J} ${approx(Q, SIG2, 'J')}`,
			],
			// the 3/2 forgotten; the coefficient of the isobar; the final temperature in place of ΔT
			answer: options(rng, Q, [nR.mul(h.dT), q(5, 2).mul(nR).mul(h.dT), q(3, 2).mul(nR).mul(h.TB)], 'J', SIG2),
			params: { case: 'isocora', n: n.toString(), TA: h.TA.toString(), TB: h.TB.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the work at constant pressure

function level2(rng: Rng): Built {
	for (;;) {
		const n = moles(rng), h = heating(rng);
		const nR = n.mul(R_GAS);
		const W = nR.mul(h.dT);
		if (!ok(W)) continue;
		return {
			prompt: 'Trova il lavoro a pressione costante.',
			problem: textBlock(`In un cilindro con il pistone libero ci sono ${pd(n, 'mol')} di gas perfetto, che viene scaldato a pressione costante da ${pd(h.TA, 'K')} a ${pd(h.TB, 'K')}. Quanto lavoro compie il gas? ${USE_R}`),
			solution: `W \\approx ${wu(sig(W), 'J')}`,
			steps: [stepDT(h), `W = p\\,\\Delta V = n\\,R\\,\\Delta T = ${fmtExact(n)} \\cdot 8{,}31 \\cdot ${fmtExact(h.dT)}\\,\\text{J} ${approx(W, SIG2, 'J')}`],
			// the change of internal energy; the heat; the final temperature in place of ΔT
			answer: options(rng, W, [q(3, 2).mul(W), q(5, 2).mul(W), nR.mul(h.TB)], 'J', SIG2),
			params: { case: 'isobara', n: n.toString(), TA: h.TA.toString(), TB: h.TB.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the heat, or the change of internal energy, at constant pressure

function level3(rng: Rng): Built {
	const askQ = rng.next() < 0.5;
	for (;;) {
		const n = moles(rng), h = heating(rng);
		const nR = n.mul(R_GAS);
		const W = nR.mul(h.dT), dU = q(3, 2).mul(W), Q = q(5, 2).mul(W);
		const answer = askQ ? Q : dU;
		if (!ok(answer)) continue;
		const head = `In un cilindro con il pistone libero ci sono ${pd(n, 'mol')} di gas perfetto monoatomico, che viene scaldato a pressione costante da ${pd(h.TA, 'K')} a ${pd(h.TB, 'K')}.`;
		const stepU = `\\Delta U = \\dfrac{3}{2}\\,n\\,R\\,\\Delta T = \\dfrac{3}{2} \\cdot ${fmtExact(n)} \\cdot 8{,}31 \\cdot ${fmtExact(h.dT)}\\,\\text{J} ${approx(dU, SIG2, 'J')}`;
		return {
			prompt: askQ ? 'Trova il calore a pressione costante.' : "Trova la variazione dell'energia interna.",
			problem: textBlock(`${head} ${askQ ? 'Quanto calore assorbe il gas?' : 'Di quanto varia la sua energia interna?'} ${USE_R}`),
			solution: askQ ? `Q \\approx ${wu(sig(Q), 'J')}` : `\\Delta U \\approx ${wu(sig(dU), 'J')}`,
			steps: askQ
				? [stepDT(h), t('Il calore è la variazione di energia interna più il lavoro:'), `Q = \\Delta U + W = \\dfrac{3}{2}\\,n\\,R\\,\\Delta T + n\\,R\\,\\Delta T = \\dfrac{5}{2}\\,n\\,R\\,\\Delta T`, `Q = \\dfrac{5}{2} \\cdot ${fmtExact(n)} \\cdot 8{,}31 \\cdot ${fmtExact(h.dT)}\\,\\text{J} ${approx(Q, SIG2, 'J')}`]
				: [stepDT(h), t("L'energia interna dipende solo dalla temperatura:"), stepU],
			// the other two of Q, ΔU and W; the final temperature in place of ΔT
			answer: options(rng, answer, askQ ? [dU, W, q(5, 2).mul(nR).mul(h.TB)] : [Q, W, q(3, 2).mul(nR).mul(h.TB)], 'J', SIG2),
			params: { case: askQ ? 'calore' : 'energia', n: n.toString(), TA: h.TA.toString(), TB: h.TB.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: the isotherm

const ln = (x: R) => Math.log(x.num / x.den);
const flt = (x: R) => x.num / x.den;

function level4(rng: Rng): Built {
	for (;;) {
		const n = moles(rng);
		const T = q(rng.int(250, 400));
		const VA = tenths(rng, 10, 40);
		const VB = VA.add(tenths(rng, 10, 60));
		const nRT = n.mul(R_GAS).mul(T);
		const ratio = VB.div(VA);
		const w = flt(nRT) * ln(ratio);
		if (nearTie(w, 2)) continue;
		const W = fromFloat(w);
		if (ambiguous(W, SIG2)) continue;
		return {
			prompt: "Trova il lavoro dell'espansione isoterma.",
			problem: textBlock(`Un campione di ${pd(n, 'mol')} di gas perfetto si espande alla temperatura costante di ${pd(T, 'K')}: il suo volume passa da ${pu(one(VA), 'L')} a ${pu(one(VB), 'L')}. Quanto lavoro compie il gas? ${USE_R}`),
			solution: `W \\approx ${wu(sig(W), 'J')}`,
			steps: [
				`n\\,R\\,T = ${fmtExact(n)} \\cdot 8{,}31 \\cdot ${fmtExact(T)}\\,\\text{J} = ${wu(shown(nRT), 'J')}`,
				`W = n\\,R\\,T\\,\\ln\\dfrac{V_B}{V_A} = ${shown(nRT)} \\cdot \\ln\\dfrac{${one(VB)}}{${one(VA)}}\\,\\text{J} = ${cut1(w)}\\,\\text{J} \\approx ${wu(sig(W), 'J')}`,
				t('La temperatura è costante: il gas assorbe un calore uguale al lavoro.'),
			],
			// the logarithm in base ten; the ratio without the logarithm; the relative change of volume
			answer: options(rng, W, [fromFloat(flt(nRT) * Math.log10(flt(ratio))), nRT.mul(ratio), nRT.mul(ratio.sub(q(1)))], 'J', SIG2),
			params: { case: 'espansione', n: n.toString(), T: T.toString(), VA: VA.toString(), VB: VB.toString() },
		};
	}
}

function level5(rng: Rng): Built {
	const byPressure = rng.next() < 0.5;
	for (;;) {
		const n = moles(rng);
		const T = q(rng.int(250, 400));
		const nRT = n.mul(R_GAS).mul(T);
		// the ratio final over initial of the volumes, below 1
		const big = tenths(rng, 20, 90);
		const small = big.sub(tenths(rng, 10, 70));
		if (small.compare(q(1)) < 0) continue;
		const ratio = small.div(big);
		const w = flt(nRT) * ln(ratio);
		if (nearTie(w, 2)) continue;
		const W = fromFloat(w);
		if (ambiguous(W, SIG2)) continue;
		const data = byPressure
			? `la sua pressione passa da $${sci(small, 5)}\\,\\text{Pa}$ a $${sci(big, 5)}\\,\\text{Pa}$`
			: `il suo volume passa da ${pu(one(big), 'L')} a ${pu(one(small), 'L')}`;
		const formula = byPressure
			? `W = n\\,R\\,T\\,\\ln\\dfrac{p_A}{p_B} = ${shown(nRT)} \\cdot \\ln\\dfrac{${one(small)}}{${one(big)}}\\,\\text{J} = ${cut1(w)}\\,\\text{J} \\approx ${wu(sig(W), 'J')}`
			: `W = n\\,R\\,T\\,\\ln\\dfrac{V_B}{V_A} = ${shown(nRT)} \\cdot \\ln\\dfrac{${one(small)}}{${one(big)}}\\,\\text{J} = ${cut1(w)}\\,\\text{J} \\approx ${wu(sig(W), 'J')}`;
		return {
			prompt: 'Trova il lavoro della compressione isoterma.',
			problem: textBlock(`Un campione di ${pd(n, 'mol')} di gas perfetto viene compresso lentamente alla temperatura costante di ${pd(T, 'K')}: ${data}. Quanto lavoro compie il gas? ${USE_R}`),
			solution: `W \\approx ${wu(sig(W), 'J')}`,
			steps: [
				`n\\,R\\,T = ${fmtExact(n)} \\cdot 8{,}31 \\cdot ${fmtExact(T)}\\,\\text{J} = ${wu(shown(nRT), 'J')}`,
				...(byPressure ? [t('Con le pressioni il rapporto è iniziale su finale.')] : []),
				formula,
				t('Il lavoro del gas è negativo: è una compressione. Il gas cede un calore uguale.'),
			],
			// the ratio upside down (the sign); the logarithm in base ten; the ratio without the logarithm
			answer: options(rng, W, [W.neg(), fromFloat(flt(nRT) * Math.log10(flt(ratio))), nRT.mul(ratio).neg()], 'J', SIG2),
			params: { case: byPressure ? 'pressioni' : 'volumi', n: n.toString(), T: T.toString(), ...(byPressure ? { pA: small.mul(q(100000)).toString(), pB: big.mul(q(100000)).toString() } : { VA: big.toString(), VB: small.toString() }) },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: a cycle of three legs, on the plane

const AX_V = { unita: 'L', passo: 0.5, celle: 16, etichette: 2 };
const AX_P = { unita: 'kPa', passo: 50, celle: 8, etichette: 2 };

function level6(rng: Rng): Built {
	const high = rng.next() < 0.5;
	for (;;) {
		const k = rng.pick([2, 2, 3, 4]);
		const V1 = q(rng.int(2, Math.floor(16 / k)), 2);
		const pHigh = 50 * k * rng.int(1, Math.floor(8 / k));
		const V2 = V1.mul(q(k));
		const pLow = pHigh / k;
		const v1 = flt(V1), v2 = flt(V2);
		// p V on the isotherm, in joule (kPa · L)
		const pV = q(pHigh).mul(V1);
		const iso = flt(pV) * Math.log(k);
		const isobar = high ? q(pHigh).mul(V2.sub(V1)) : q(pLow).mul(V2.sub(V1));
		const w = high ? flt(isobar) - iso : iso - flt(isobar);
		if (nearTie(w, 2)) continue;
		const W = fromFloat(w);
		if (ambiguous(W, SIG2) || W.compare(q(20)) < 0) continue;
		// high: A top left, isobar to B, isochore down to C, isotherm back; low: A top left, isotherm down to B, isobar back to C, isochore up
		const stati: StatoPV[] = high
			? [{ nome: 'A', V: v1, p: pHigh }, { nome: 'B', V: v2, p: pHigh }, { nome: 'C', V: v2, p: pLow }]
			: [{ nome: 'A', V: v1, p: pHigh }, { nome: 'B', V: v2, p: pLow }, { nome: 'C', V: v1, p: pLow }];
		const tratti: TrattoPV[] = high
			? [{ da: 'A', a: 'B', tipo: 'retta' }, { da: 'B', a: 'C', tipo: 'retta' }, { da: 'C', a: 'A', tipo: 'isoterma' }]
			: [{ da: 'A', a: 'B', tipo: 'isoterma' }, { da: 'B', a: 'C', tipo: 'retta' }, { da: 'C', a: 'A', tipo: 'retta' }];
		const alt = `Il piano pressione-volume, con il volume in litri e la pressione in kilopascal: un ciclo di tre tratti percorso in senso orario, per gli stati ${stati.map((s) => statoAlt(s, 'litri', 'kilopascal')).join(', ')}. ${high ? 'Da A a B un segmento orizzontale, da B a C un segmento verticale, da C ad A un ramo di iperbole' : 'Da A a B un ramo di iperbole, da B a C un segmento orizzontale, da C ad A un segmento verticale'}`;
		const vTex = (x: R) => fmtExact(x);
		const isoStep = high
			? `C \\to A: \\; W = p_A V_A\\,\\ln\\dfrac{V_A}{V_C} = ${pHigh} \\cdot ${vTex(V1)} \\cdot \\ln\\dfrac{${vTex(V1)}}{${vTex(V2)}}\\,\\text{J} = ${cut1(-iso)}\\,\\text{J}`
			: `A \\to B: \\; W = p_A V_A\\,\\ln\\dfrac{V_B}{V_A} = ${pHigh} \\cdot ${vTex(V1)} \\cdot \\ln\\dfrac{${vTex(V2)}}{${vTex(V1)}}\\,\\text{J} = ${cut1(iso)}\\,\\text{J}`;
		const barStep = high
			? `A \\to B: \\; W = p\\,\\Delta V = ${pHigh} \\cdot (${vTex(V2)} - ${vTex(V1)})\\,\\text{J} = ${wu(fmtExact(isobar), 'J')}`
			: `B \\to C: \\; W = p\\,\\Delta V = ${pLow} \\cdot (${vTex(V1)} - ${vTex(V2)})\\,\\text{J} = ${wu(fmtExact(isobar.neg()), 'J')}`;
		const choStep = `${high ? 'B \\to C' : 'C \\to A'}: \\; ` + t('il volume è costante, ') + `W = 0`;
		return {
			prompt: 'Trova il lavoro del ciclo.',
			problem: textBlock("Un gas perfetto percorre il ciclo del grafico nel verso delle frecce: il tratto curvo è un'isoterma. Quanto lavoro compie in un ciclo?"),
			solution: `W \\approx ${wu(sig(W), 'J')}`,
			steps: [
				...(high ? [barStep, choStep, isoStep] : [isoStep, barStep, choStep]),
				`W_{ciclo} = ${high ? `${fmtExact(isobar)} + 0 - ${cut1(iso)}` : `${cut1(iso)} - ${fmtExact(isobar)} + 0`}\\,\\text{J} \\approx ${wu(sig(W), 'J')}`,
				t('Un kilopascal per un litro è un joule.'),
			],
			// the isobar alone; the isotherm alone; the two added without their signs
			answer: options(rng, W, [isobar, fromFloat(iso), fromFloat(flt(isobar) + iso)], 'J', SIG2),
			params: { case: high ? 'isobara-alta' : 'isobara-bassa', stati, k },
			scene: scenaPV(AX_V, AX_P, stati, tratti, alt),
			solutionScene: scenaPV(AX_V, AX_P, stati, tratti, `${alt}. La regione racchiusa dal ciclo è colorata`, 'ciclo'),
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const fisTrasformazioniTermodinamiche: Generator = {
	id: ID,
	title: 'Le trasformazioni isocora, isobara e isoterma',
	levels: {
		1: { label: 'Il calore a volume costante', constraints: ['gas monoatomico', 'Q = ΔU = 3/2 n R ΔT'] },
		2: { label: 'Il lavoro a pressione costante', constraints: ['W = n R ΔT'] },
		3: { label: 'Calore ed energia interna a pressione costante', constraints: ['Q = 5/2 n R ΔT', 'ΔU = 3/2 n R ΔT'] },
		4: { label: "Il lavoro di un'espansione isoterma", constraints: ['W = n R T ln(V_B / V_A)'] },
		5: { label: 'La compressione isoterma', constraints: ['lavoro negativo', 'dai volumi o dalle pressioni'] },
		6: { label: 'Un ciclo con tre trasformazioni', constraints: ['isobara, isocora e isoterma sul grafico', 'W = p_A V_A ln(V_B / V_A) sul tratto curvo'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisTrasformazioniTermodinamiche;
