/**
 * I calori molari dei gas. Spec: specs/exercises/fis-calori-molari.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/112-fis-calori-molari.md), each one step harder: the heat
 * at constant volume for a monatomic gas (C_V = 3/2 R); the heat at constant pressure (Mayer, C_p = C_V + R); the
 * diatomic gases (five degrees of freedom); the inverse formula for the rise in temperature; how the heat taken at
 * constant pressure splits into work and internal energy; the amount of gas given as a mass. Results have three
 * significant figures, never near a rounding boundary and never a whole number ending in zero. Distractors from the
 * lesson's warnings: C_V and C_p swapped, the wrong kind of gas, R alone, 273 added to a difference, grams read as
 * moles, work and internal energy swapped.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, type Gas, BI, CP, CV, GASES, MONO, R, R_TEXT, ambiguous, answerOf, checkCommon, cpTex, cvTex, generateWith, h3, kind, pq, q, shown, sig, t, tex, textBlock } from '../fis-calori-adiabatica';

export const ID = 'fis-calori-molari';

type Cond = 'V' | 'p';
const RIGID = (n: string, g: Gas) => `Una bombola rigida contiene ${pq(tex(n), 'mol')} di ${g.nome}, un gas ${kind(g)}`;
const PISTON = (n: string, g: Gas) => `Un cilindro chiuso da un pistone libero di muoversi contiene ${pq(tex(n), 'mol')} di ${g.nome}, un gas ${kind(g)}`;
const vessel = (c: Cond, n: string, g: Gas) => (c === 'V' ? RIGID(n, g) : PISTON(n, g));
const C = (c: Cond, g: Gas) => (c === 'V' ? CV(g) : CP(g));
const cTex = (c: Cond, g: Gas) => (c === 'V' ? cvTex(g) : cpTex(g));
const cName = (c: Cond) => (c === 'V' ? 'C_V' : 'C_p');
const why = (c: Cond, g: Gas) => t(`${c === 'V' ? 'Il volume è costante' : 'La pressione è costante'} e il gas è ${kind(g)}: `) + `${cName(c)} = ${cTex(c, g)}\\,R`;

/** Moles with three figures, 1,00 to 4,00 in steps of 0,05. */
const moles = (rng: Rng) => h3(rng.int(20, 80) * 5);

/** The heat to go from T1 to T2, for the first three levels. */
function heat(rng: Rng, g: Gas, c: Cond, mistakes: (n: number, dT: number, T2: number) => number[]): Built {
	for (;;) {
		const n = moles(rng);
		const T1 = rng.int(270, 320), dT = rng.int(15, 150), T2 = T1 + dT;
		const exact = Number(n) * C(c, g) * dT;
		const ans = sig(exact, 3);
		if (!ans || ambiguous(ans)) continue;
		return {
			prompt: 'Trova il calore.',
			problem: textBlock(`${vessel(c, n, g)}, a ${pq(String(T1), 'K')}. Quanto calore serve per portarlo a ${pq(String(T2), 'K')}${c === 'p' ? ' a pressione costante' : ''}? ${R_TEXT}`),
			solution: `Q \\approx ${q(ans.tex, 'J')}`,
			steps: [
				why(c, g),
				`\\Delta T = ${T2}\\,\\text{K} - ${T1}\\,\\text{K} = ${dT}\\,\\text{K}`,
				`Q = n\\,${cName(c)}\\,\\Delta T = ${tex(n)} \\cdot ${cTex(c, g)} \\cdot 8{,}31 \\cdot ${dT}\\,\\text{J} = ${shown(exact)}\\ldots\\,\\text{J} \\approx ${q(ans.tex, 'J')}`,
			],
			answer: answerOf(rng, ans, exact, mistakes(Number(n), dT, T2), 3, 'J'),
			params: { case: `${kind(g)} ${c}`, gas: g.nome, l: g.l, cond: c, n, T1, T2 },
		};
	}
}

// Level 1: constant volume, monatomic. Mistakes: C_p for C_V, R alone, the final temperature for the difference.
const level1 = (rng: Rng) => heat(rng, rng.pick(MONO), 'V', (n, dT, T2) => [n * 2.5 * R * dT, n * R * dT, n * 1.5 * R * T2]);

// Level 2: constant pressure, monatomic. Mistakes: C_V for C_p, R alone, the diatomic C_p.
const level2 = (rng: Rng) => heat(rng, rng.pick(MONO), 'p', (n, dT) => [n * 1.5 * R * dT, n * R * dT, n * 3.5 * R * dT]);

// Level 3: a diatomic gas, at constant volume or pressure. Mistakes: the monatomic value, the other calore molare, R alone.
function level3(rng: Rng): Built {
	const c: Cond = rng.next() < 0.5 ? 'V' : 'p';
	return heat(rng, rng.pick(BI), c, (n, dT) => (c === 'V' ? [n * 1.5 * R * dT, n * 3.5 * R * dT, n * R * dT] : [n * 2.5 * R * dT, n * 1.5 * R * dT, n * R * dT]));
}

/** A heat of three figures that does not end in zero, 201 to 999 J. */
function heatGiven(rng: Rng) {
	for (;;) {
		const Q = rng.int(201, 999);
		if (Q % 10) return Q;
	}
}

// Level 4: the rise in temperature from the heat.
function level4(rng: Rng): Built {
	const c: Cond = rng.next() < 0.5 ? 'V' : 'p';
	for (;;) {
		const g = rng.pick(GASES);
		const n = h3(rng.int(20, 50) * 5);
		const Q = heatGiven(rng);
		const exact = Q / (Number(n) * C(c, g));
		const ans = sig(exact, 3);
		if (!ans || ambiguous(ans) || exact < 5 || exact > 150) continue;
		const other: Cond = c === 'V' ? 'p' : 'V';
		const otherGas: Gas = { ...g, l: g.l === 3 ? 5 : 3 };
		return {
			prompt: "Trova l'aumento di temperatura.",
			problem: textBlock(`${vessel(c, n, g)}. Il gas assorbe ${pq(String(Q), 'J')} di calore${c === 'p' ? ' a pressione costante' : ''}. Di quanto aumenta la sua temperatura? ${R_TEXT}`),
			solution: `\\Delta T \\approx ${q(ans.tex, 'K')}`,
			steps: [
				why(c, g),
				`\\Delta T = \\dfrac{Q}{n\\,${cName(c)}} = \\dfrac{${Q}}{${tex(n)} \\cdot ${cTex(c, g)} \\cdot 8{,}31}\\,\\text{K} = ${shown(exact)}\\ldots\\,\\text{K} \\approx ${q(ans.tex, 'K')}`,
			],
			// the other calore molare; the other kind of gas; R alone
			answer: answerOf(rng, ans, exact, [Q / (Number(n) * C(other, g)), Q / (Number(n) * C(c, otherGas)), Q / (Number(n) * R)], 3, 'K'),
			params: { case: `${kind(g)} ${c}`, gas: g.nome, l: g.l, cond: c, n, Q },
		};
	}
}

// Level 5: the heat taken at constant pressure, split into work and internal energy.
function level5(rng: Rng): Built {
	const askW = rng.next() < 0.5;
	for (;;) {
		const g = rng.pick(GASES);
		const n = h3(rng.int(20, 50) * 5);
		const Q = heatGiven(rng);
		const dT = Q / (Number(n) * CP(g));
		const W = (Q * 2) / (g.l + 2), dU = (Q * g.l) / (g.l + 2);
		const exact = askW ? W : dU;
		const ans = sig(exact, 3);
		if (!ans || ambiguous(ans) || dT < 5 || dT > 150) continue;
		const steps = [
			why('p', g),
			`\\Delta T = \\dfrac{Q}{n\\,C_p} = \\dfrac{${Q}}{${tex(n)} \\cdot ${cpTex(g)} \\cdot 8{,}31}\\,\\text{K} = ${shown(dT)}\\ldots\\,\\text{K}`,
			`W = n\\,R\\,\\Delta T = ${tex(n)} \\cdot 8{,}31 \\cdot ${shown(dT)}\\ldots\\,\\text{J} = ${shown(W)}\\ldots\\,\\text{J}`,
		];
		if (askW) steps[2] += ` \\approx ${q(ans.tex, 'J')}`;
		else steps.push(`\\Delta U = Q - W = ${Q}\\,\\text{J} - ${shown(W)}\\ldots\\,\\text{J} \\approx ${q(ans.tex, 'J')}`);
		return {
			prompt: askW ? 'Trova il lavoro.' : "Trova la variazione di energia interna.",
			problem: textBlock(`${PISTON(n, g)}. Il gas assorbe ${pq(String(Q), 'J')} di calore a pressione costante. ${askW ? 'Quanto lavoro compie?' : 'Di quanto aumenta la sua energia interna?'} ${R_TEXT}`),
			solution: `${askW ? 'W' : '\\Delta U'} \\approx ${q(ans.tex, 'J')}`,
			steps,
			// the other part of the heat; the whole heat; C_V in place of C_p in the ratio
			answer: answerOf(rng, ans, exact, askW ? [dU, Q, (Q * 2) / g.l] : [W, Q, (Q * g.l) / (g.l + 4)], 3, 'J'),
			params: { case: askW ? 'lavoro' : 'energia interna', gas: g.nome, l: g.l, n, Q },
		};
	}
}

// Level 6: the gas given as a mass.
function level6(rng: Rng): Built {
	const c: Cond = rng.next() < 0.5 ? 'V' : 'p';
	for (;;) {
		const g = rng.pick(GASES);
		const m = (rng.int(50, 500) / 100 * Number(g.M)).toPrecision(3);
		if (m.includes('e') || (!m.includes('.') && m.endsWith('0'))) continue;
		const dT = rng.int(15, 150);
		if (dT % 10 === 0) continue;
		const n = Number(m) / Number(g.M);
		const exact = n * C(c, g) * dT;
		const ans = sig(exact, 3);
		const n3 = sig(n, 3);
		if (!ans || !n3 || ambiguous(ans)) continue;
		// the answer must not depend on rounding the moles to three figures first
		const viaRounded = sig(Number(n3.value) * C(c, g) * dT, 3);
		if (!viaRounded || viaRounded.value !== ans.value) continue;
		const other: Cond = c === 'V' ? 'p' : 'V';
		return {
			prompt: 'Trova il calore.',
			problem: textBlock(
				`${c === 'V' ? 'Una bombola rigida contiene' : 'Un cilindro chiuso da un pistone libero di muoversi contiene'} ${pq(tex(m), 'g')} di ${g.nome}, un gas ${kind(g)} con massa molare ${pq(tex(g.M), 'gmol')}. Quanto calore serve per aumentare la sua temperatura di ${pq(String(dT), 'K')}${c === 'p' ? ' a pressione costante' : ''}? ${R_TEXT}`,
			),
			solution: `Q \\approx ${q(ans.tex, 'J')}`,
			steps: [
				`${t('Le moli: ')} n = \\dfrac{m}{M} = \\dfrac{${tex(m)}\\,\\text{g}}{${tex(g.M)}\\,\\text{g/mol}} \\approx ${q(n3.tex, 'mol')}`,
				why(c, g),
				`Q = n\\,${cName(c)}\\,\\Delta T = ${n3.tex} \\cdot ${cTex(c, g)} \\cdot 8{,}31 \\cdot ${dT}\\,\\text{J} \\approx ${q(ans.tex, 'J')}`,
			],
			// grams read as moles; the other calore molare; R alone
			answer: answerOf(rng, ans, exact, [Number(m) * C(c, g) * dT, n * C(other, g) * dT, n * R * dT], 3, 'J'),
			params: { case: `${kind(g)} ${c}`, gas: g.nome, l: g.l, cond: c, m, M: g.M, dT },
		};
	}
}

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const fisCaloriMolari: Generator = {
	id: ID,
	title: 'I calori molari dei gas',
	levels: {
		1: { label: 'Il calore a volume costante', constraints: ['gas monoatomico in una bombola rigida', 'risultato in joule con tre cifre significative'] },
		2: { label: 'Il calore a pressione costante', constraints: ['gas monoatomico, pistone libero', 'relazione di Mayer'] },
		3: { label: 'I gas biatomici', constraints: ['azoto, ossigeno o idrogeno', 'a volume o a pressione costante'] },
		4: { label: "L'aumento di temperatura", constraints: ['formula inversa', 'aumento tra 5 e 150 K'] },
		5: { label: 'Lavoro ed energia interna', constraints: ['a pressione costante', 'il lavoro o la variazione di energia interna'] },
		6: { label: 'Dai grammi alle moli', constraints: ['massa e massa molare', 'il risultato non dipende dall’arrotondamento delle moli'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisCaloriMolari;
