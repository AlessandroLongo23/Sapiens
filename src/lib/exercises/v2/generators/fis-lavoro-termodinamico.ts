/**
 * Il lavoro in una trasformazione termodinamica. Spec: specs/exercises/fis-lavoro-termodinamico.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/109-fis-lavoro-termodinamico.md), each one step harder:
 * W = p ΔV with pascal and cubic metres; the same with litres and kilopascal or atmospheres to convert; a
 * compression, where the work of the gas is negative and that of the environment its opposite; the work read on the
 * pressure-volume plane as the trapezium under a segment; a path of two legs, an isobar and an isochore; a cycle,
 * whose work is the enclosed area with the sign of its direction. Levels 4 to 6 draw the plane with the scene
 * `piano-pv`, in litres and kilopascal (1 kPa · 1 L = 1 J). Answers in joule with two significant figures, never a
 * tie; multiple choice with the lesson's mistakes: units not converted, the final volume in place of ΔV, the sign,
 * the rectangle in place of the trapezium, the other path.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, type R, type StatoPV, type TrattoPV, ATM, SIG2, ambiguous, approx, checkCommon, fmt, fmtExact, generateWith, one, options, pd, pu, q, rel, scenaPV, sci, statoAlt, t, tenths, textBlock, tie, wu } from '../fis-termo-pv';

export const ID = 'fis-lavoro-termodinamico';

const ok = (W: R) => !tie(W, SIG2) && !ambiguous(W, SIG2) && W.abs().compare(q(20)) >= 0;
const sig = (r: R) => fmt(r, SIG2);
const K1000 = q(1000);
const E5 = q(100000);
const milli = (L: R) => L.div(K1000);

// ---------------------------------------------------------------------------
// Level 1: W = p ΔV, pascal and cubic metres

function level1(rng: Rng): Built {
	for (;;) {
		const pm = tenths(rng, 11, 59);
		const vi = tenths(rng, 10, 60);
		const vf = vi.add(tenths(rng, 10, 50));
		const dV = vf.sub(vi);
		const p = pm.mul(E5);
		const W = p.mul(milli(dV));
		if (!ok(W) || vf.compare(q(10)) >= 0) continue;
		return {
			prompt: 'Trova il lavoro compiuto dal gas.',
			problem: textBlock(`Un gas si espande alla pressione costante di $${sci(pm, 5)}\\,\\text{Pa}$: il suo volume passa da $${sci(vi, -3)}\\,\\text{m}^3$ a $${sci(vf, -3)}\\,\\text{m}^3$. Quanto lavoro compie?`),
			solution: `W ${rel(W, SIG2)} ${wu(sig(W), 'J')}`,
			steps: [
				`\\Delta V = V_f - V_i = ${sci(vf, -3)} - ${sci(vi, -3)} = ${sci(dV, -3)}\\,\\text{m}^3`,
				`W = p\\,\\Delta V = ${sci(pm, 5)} \\cdot ${sci(dV, -3)}\\,\\text{J} ${approx(W, SIG2, 'J')}`,
			],
			// the final volume, the initial one, their sum in place of ΔV
			answer: options(rng, W, [p.mul(milli(vf)), p.mul(milli(vi)), p.mul(milli(vf.add(vi)))], 'J', SIG2),
			params: { case: 'espansione', p: p.toString(), vi: milli(vi).toString(), vf: milli(vf).toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: litres, and kilopascal or atmospheres

function level2(rng: Rng): Built {
	const atm = rng.next() < 0.5;
	for (;;) {
		const vi = tenths(rng, 12, 60);
		const vf = vi.add(tenths(rng, 10, 50));
		const dV = vf.sub(vi);
		const volumes = `il suo volume passa da ${pu(one(vi), 'L')} a ${pu(one(vf), 'L')}`;
		const stepV = `\\Delta V = ${one(vf)} - ${one(vi)} = ${wu(one(dV), 'L')} = ${sci(dV, -3)}\\,\\text{m}^3`;
		if (atm) {
			const pa = tenths(rng, 11, 49);
			const p = pa.mul(ATM);
			const W = p.mul(milli(dV));
			if (!ok(W)) continue;
			return {
				prompt: 'Trova il lavoro compiuto dal gas.',
				problem: textBlock(`Un gas si espande alla pressione costante di ${pu(one(pa), 'atm')}: ${volumes}. Quanto lavoro compie? Usa $1\\,\\text{atm} = 1{,}01 \\cdot 10^{5}\\,\\text{Pa}$.`),
				solution: `W ${rel(W, SIG2)} ${wu(sig(W), 'J')}`,
				steps: [
					`p = ${one(pa)} \\cdot 1{,}01 \\cdot 10^{5}\\,\\text{Pa} = ${wu(fmtExact(p), 'Pa')}`,
					stepV,
					`W = p\\,\\Delta V = ${fmtExact(p)} \\cdot ${sci(dV, -3)}\\,\\text{J} ${approx(W, SIG2, 'J')}`,
				],
				// nothing converted; the litres not converted; the final volume in place of ΔV
				answer: options(rng, W, [pa.mul(dV), W.mul(K1000), p.mul(milli(vf))], 'J', SIG2),
				params: { case: 'atm', p: p.toString(), vi: milli(vi).toString(), vf: milli(vf).toString() },
			};
		}
		const pk = q(5 * rng.int(21, 99));
		if (pk.num % 10 === 0) continue;
		const W = pk.mul(dV);
		if (!ok(W)) continue;
		return {
			prompt: 'Trova il lavoro compiuto dal gas.',
			problem: textBlock(`Un gas si espande alla pressione costante di ${pd(pk, 'kPa')}: ${volumes}. Quanto lavoro compie?`),
			solution: `W ${rel(W, SIG2)} ${wu(sig(W), 'J')}`,
			steps: [
				`p = ${wu(fmtExact(pk), 'kPa')} = ${wu(fmtExact(pk.mul(K1000)), 'Pa')}`,
				stepV,
				`W = p\\,\\Delta V = ${fmtExact(pk.mul(K1000))} \\cdot ${sci(dV, -3)}\\,\\text{J} ${approx(W, SIG2, 'J')}`,
			],
			// the litres not converted (Pa · L); the kilopascal not converted (kPa · m³); the final volume
			answer: options(rng, W, [W.mul(K1000), W.div(K1000), pk.mul(vf)], 'J', SIG2),
			params: { case: 'kPa', p: pk.mul(K1000).toString(), vi: milli(vi).toString(), vf: milli(vf).toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: a compression, and whose work it is

function level3(rng: Rng): Built {
	const onGas = rng.next() < 0.5;
	for (;;) {
		const pm = tenths(rng, 11, 59);
		const vf = tenths(rng, 10, 50);
		const vi = vf.add(tenths(rng, 10, 50));
		const dV = vf.sub(vi);
		const p = pm.mul(E5);
		const W = p.mul(milli(dV));
		if (!ok(W)) continue;
		const answer = onGas ? W.neg() : W;
		return {
			prompt: onGas ? "Trova il lavoro compiuto dall'ambiente sul gas." : 'Trova il lavoro compiuto dal gas.',
			problem: textBlock(`Un gas viene compresso alla pressione costante di $${sci(pm, 5)}\\,\\text{Pa}$: il suo volume passa da ${pu(one(vi), 'L')} a ${pu(one(vf), 'L')}. Quanto lavoro compie ${onGas ? "l'ambiente sul gas" : 'il gas'}?`),
			solution: onGas ? `-W ${rel(W, SIG2)} ${wu(sig(answer), 'J')}` : `W ${rel(W, SIG2)} ${wu(sig(W), 'J')}`,
			steps: [
				`\\Delta V = V_f - V_i = ${one(vf)} - ${one(vi)} = ${wu(`-${one(dV.abs())}`, 'L')} = -${sci(dV.abs(), -3)}\\,\\text{m}^3`,
				`W = p\\,\\Delta V = ${sci(pm, 5)} \\cdot (-${sci(dV.abs(), -3)})\\,\\text{J} ${approx(W, SIG2, 'J')}`,
				onGas ? t("Il lavoro del gas è negativo: l'ambiente compie sul gas il lavoro opposto.") + ` \\; -W ${rel(W, SIG2)} ${wu(sig(answer), 'J')}` : t('Il volume diminuisce: il lavoro del gas è negativo.'),
			],
			// the opposite sign; the final volume in place of ΔV, with either sign
			answer: options(rng, answer, [answer.neg(), p.mul(milli(vf)).mul(q(onGas ? 1 : -1)), p.mul(milli(vi)).mul(q(onGas ? 1 : -1))], 'J', SIG2),
			params: { case: onGas ? 'ambiente' : 'gas', p: p.toString(), vi: milli(vi).toString(), vf: milli(vf).toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Levels 4 to 6: the plane, in litres and kilopascal

const AX_V = { unita: 'L', passo: 1, celle: 8, etichette: 1 };
const AX_P = { unita: 'kPa', passo: 50, celle: 8, etichette: 2 };
const alts = (stati: StatoPV[]) => stati.map((s) => statoAlt(s, 'litri', 'kilopascal')).join(', ');

/** Two states on the grid, B to the right of A and at another pressure. */
function twoStates(rng: Rng): [StatoPV, StatoPV] {
	for (;;) {
		const VA = rng.int(1, 4), VB = rng.int(VA + 2, 7);
		const pA = 50 * rng.int(1, 8), pB = 50 * rng.int(1, 8);
		if (pA !== pB) return [{ nome: 'A', V: VA, p: pA }, { nome: 'B', V: VB, p: pB }];
	}
}

function level4(rng: Rng): Built {
	for (;;) {
		const [A, B] = twoStates(rng);
		const dV = q(B.V - A.V);
		const W = q(A.p + B.p, 2).mul(dV);
		if (!ok(W)) continue;
		const tratti: TrattoPV[] = [{ da: 'A', a: 'B', tipo: 'retta' }];
		const alt = `Il piano pressione-volume, con il volume in litri e la pressione in kilopascal: un segmento con una freccia va dallo stato ${alts([A])} allo stato ${alts([B])}`;
		return {
			prompt: 'Trova il lavoro dal grafico.',
			problem: textBlock('Un gas passa dallo stato $A$ allo stato $B$ lungo il segmento del grafico. Quanto lavoro compie?'),
			solution: `W ${rel(W, SIG2)} ${wu(sig(W), 'J')}`,
			steps: [
				t('Il lavoro è l’area del trapezio sotto il segmento.'),
				`p_A = ${wu(String(A.p), 'kPa')}, \\quad p_B = ${wu(String(B.p), 'kPa')}, \\quad V_B - V_A = ${wu(fmtExact(dV), 'L')}`,
				`W = \\dfrac{p_A + p_B}{2}\\,(V_B - V_A) = \\dfrac{${A.p} + ${B.p}}{2} \\cdot ${fmtExact(dV)}\\,\\text{J} ${approx(W, SIG2, 'J')}`,
				t('Un kilopascal per un litro è un joule.'),
			],
			// the rectangle with one pressure or the other; the triangle alone
			answer: options(rng, W, [q(A.p).mul(dV), q(B.p).mul(dV), q(Math.abs(A.p - B.p), 2).mul(dV)], 'J', SIG2),
			params: { case: A.p > B.p ? 'scende' : 'sale', A, B },
			scene: scenaPV(AX_V, AX_P, [A, B], tratti, alt),
			solutionScene: scenaPV(AX_V, AX_P, [A, B], tratti, `${alt}. Il trapezio sotto il segmento è colorato`, 'sotto'),
		};
	}
}

function level5(rng: Rng): Built {
	const isobarFirst = rng.next() < 0.5;
	for (;;) {
		const [A, B] = twoStates(rng);
		const C: StatoPV = isobarFirst ? { nome: 'C', V: B.V, p: A.p } : { nome: 'C', V: A.V, p: B.p };
		const dV = q(B.V - A.V);
		const pIso = isobarFirst ? A.p : B.p;
		const W = q(pIso).mul(dV);
		if (!ok(W)) continue;
		const tratti: TrattoPV[] = [{ da: 'A', a: 'C', tipo: 'retta' }, { da: 'C', a: 'B', tipo: 'retta' }];
		const alt = `Il piano pressione-volume, con il volume in litri e la pressione in kilopascal: una spezzata con le frecce va dallo stato ${alts([A])} allo stato ${alts([C])} e poi allo stato ${alts([B])}`;
		const iso = isobarFirst ? 'A \\to C' : 'C \\to B';
		const cho = isobarFirst ? 'C \\to B' : 'A \\to C';
		const stepCho = `${cho}: \\; ` + t('il volume è costante, ') + `W = 0`;
		const stepIso = `${iso}: \\; ` + t('la pressione è costante, ') + `W = p\\,\\Delta V = ${pIso} \\cdot ${fmtExact(dV)}\\,\\text{J} ${approx(W, SIG2, 'J')}`;
		return {
			prompt: 'Trova il lavoro dal grafico.',
			problem: textBlock('Un gas passa dallo stato $A$ allo stato $B$ lungo i due tratti del grafico, passando per $C$. Quanto lavoro compie in tutto?'),
			solution: `W ${rel(W, SIG2)} ${wu(sig(W), 'J')}`,
			steps: [
				...(isobarFirst ? [stepIso, stepCho] : [stepCho, stepIso]),
				t('Un kilopascal per un litro è un joule.'),
			],
			// the isobar at the other pressure (the other path); the straight segment; the two rectangles added
			answer: options(rng, W, [q(isobarFirst ? B.p : A.p).mul(dV), q(A.p + B.p, 2).mul(dV), q(A.p + B.p).mul(dV)], 'J', SIG2),
			params: { case: isobarFirst ? 'isobara-prima' : 'isocora-prima', A, B, C },
			scene: scenaPV(AX_V, AX_P, [A, C, B], tratti, alt),
			solutionScene: scenaPV(AX_V, AX_P, [A, C, B], tratti, `${alt}. Il rettangolo sotto il tratto orizzontale è colorato`, 'sotto'),
		};
	}
}

function level6(rng: Rng): Built {
	const triangle = rng.next() < 0.5;
	const clockwise = rng.next() < 0.5;
	for (;;) {
		const V1 = rng.int(1, 4), V2 = rng.int(V1 + 2, 7);
		const p1 = 50 * rng.int(1, 5), p2 = p1 + 50 * rng.int(2, 8 - p1 / 50);
		if (p2 > 400) continue;
		const corners = triangle ? [[V1, p2], [V2, p2], [V2, p1]] : [[V1, p2], [V2, p2], [V2, p1], [V1, p1]];
		const order = clockwise ? corners : [corners[0], ...corners.slice(1).reverse()];
		const stati: StatoPV[] = order.map(([V, p], i) => ({ nome: 'ABCD'[i], V, p }));
		const tratti: TrattoPV[] = stati.map((s, i) => ({ da: s.nome, a: stati[(i + 1) % stati.length].nome, tipo: 'retta' }));
		const dV = q(V2 - V1), dp = q(p2 - p1);
		const area = triangle ? dV.mul(dp).div(q(2)) : dV.mul(dp);
		const W = clockwise ? area : area.neg();
		if (!ok(W)) continue;
		const names = stati.map((s) => s.nome).join(' \\to ') + ' \\to A';
		const alt = `Il piano pressione-volume, con il volume in litri e la pressione in kilopascal: un ciclo ${triangle ? 'triangolare' : 'rettangolare'} percorso nel verso delle frecce, per gli stati ${alts(stati)}, e di nuovo ad A`;
		return {
			prompt: 'Trova il lavoro del ciclo.',
			problem: textBlock('Un gas percorre il ciclo del grafico nel verso delle frecce, partendo da $A$. Quanto lavoro compie in un ciclo?'),
			solution: `W ${rel(W, SIG2)} ${wu(sig(W), 'J')}`,
			steps: [
				t(`Il lavoro di un ciclo è l’area racchiusa: un ${triangle ? 'triangolo' : 'rettangolo'} con i lati di`) + ` \\; ${wu(fmtExact(dV), 'L')} \\; ` + t('e') + ` \\; ${wu(fmtExact(dp), 'kPa')}`,
				triangle ? `\\dfrac{${fmtExact(dV)} \\cdot ${fmtExact(dp)}}{2}\\,\\text{J} ${approx(area, SIG2, 'J')}` : `${fmtExact(dV)} \\cdot ${fmtExact(dp)}\\,\\text{J} ${approx(area, SIG2, 'J')}`,
				`${names}: \\; ` + t(clockwise ? 'il verso è orario, il lavoro è positivo.' : 'il verso è antiorario, il lavoro è negativo.') + ` \\; W ${rel(W, SIG2)} ${wu(sig(W), 'J')}`,
			],
			// the opposite sign; the rectangle for the triangle (or half the rectangle); the area under the upper side
			answer: options(rng, W, [W.neg(), triangle ? W.mul(q(2)) : W.div(q(2)), q(p2).mul(dV).mul(q(clockwise ? 1 : -1))], 'J', SIG2),
			params: { case: `${triangle ? 'triangolo' : 'rettangolo'}-${clockwise ? 'orario' : 'antiorario'}`, stati },
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

export const fisLavoroTermodinamico: Generator = {
	id: ID,
	title: 'Il lavoro in una trasformazione termodinamica',
	levels: {
		1: { label: 'Il lavoro a pressione costante', constraints: ['W = p ΔV', 'pascal e metri cubi', 'espansione'] },
		2: { label: 'Litri, kilopascal e atmosfere', constraints: ['volumi in litri', 'pressione in kilopascal o in atmosfere'] },
		3: { label: 'Una compressione: il segno del lavoro', constraints: ['ΔV negativo', 'lavoro del gas o lavoro sul gas'] },
		4: { label: 'Il lavoro dal grafico: un segmento', constraints: ['area del trapezio', 'kilopascal per litri'] },
		5: { label: 'Il lavoro dal grafico: due tratti', constraints: ['un tratto a pressione costante e uno a volume costante'] },
		6: { label: 'Il lavoro di un ciclo', constraints: ['area racchiusa', 'segno dal verso di percorrenza'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisLavoroTermodinamico;
