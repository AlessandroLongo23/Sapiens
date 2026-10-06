/**
 * The perceptron of the lesson "Il percettrone": two inputs, a threshold unit, the learning rule. No React here, so
 * the numbers of the lesson (the table of the worked example, the cycle on XOR) can be recomputed from this file.
 */

export type Funzione = 'AND' | 'OR' | 'XOR';
export type Pesi = { w1: number; w2: number; b: number };

/** The four inputs, in the order the lesson presents them. */
export const INGRESSI: readonly (readonly [number, number])[] = [[0, 0], [0, 1], [1, 0], [1, 1]];

export const BERSAGLI: Record<Funzione, readonly number[]> = {
	AND: [0, 0, 0, 1],
	OR: [0, 1, 1, 1],
	XOR: [0, 1, 1, 0]
};

export const somma = (p: Pesi, x: readonly [number, number]) => p.w1 * x[0] + p.w2 * x[1] + p.b;
/** 1 when the weighted sum is strictly positive: on the line the answer is 0. */
export const uscita = (p: Pesi, x: readonly [number, number]) => (somma(p, x) > 0 ? 1 : 0);

/** How many of the four inputs the perceptron answers as the function asks. */
export const giusti = (p: Pesi, f: Funzione) => INGRESSI.filter((x, i) => uscita(p, x) === BERSAGLI[f][i]).length;

export type Passo = { x: readonly [number, number]; s: number; y: number; t: number; prima: Pesi; dopo: Pesi };

/** One example through the rule w ← w + η(t − y)x, b ← b + η(t − y). */
export function passo(p: Pesi, f: Funzione, i: number, eta = 1): Passo {
	const x = INGRESSI[i];
	const t = BERSAGLI[f][i];
	const s = somma(p, x);
	const y = s > 0 ? 1 : 0;
	const d = eta * (t - y);
	return { x, s, y, t, prima: p, dopo: { w1: p.w1 + d * x[0], w2: p.w2 + d * x[1], b: p.b + d } };
}

export type Epoca = { passi: Passo[]; errori: number; fine: Pesi };

/** The four examples in order, starting from p. */
export function epoca(p: Pesi, f: Funzione, eta = 1): Epoca {
	const passi: Passo[] = [];
	let q = p;
	for (let i = 0; i < INGRESSI.length; i++) {
		const r = passo(q, f, i, eta);
		passi.push(r);
		q = r.dopo;
	}
	return { passi, errori: passi.filter((r) => r.y !== r.t).length, fine: q };
}

export const stessi = (a: Pesi, b: Pesi) => a.w1 === b.w1 && a.w2 === b.w2 && a.b === b.b;
export const ZERO: Pesi = { w1: 0, w2: 0, b: 0 };

/** Weights and bias drawn between −1 and 1, where a training run starts. */
export const pesiCasuali = (rnd: () => number = Math.random): Pesi => ({ w1: 2 * rnd() - 1, w2: 2 * rnd() - 1, b: 2 * rnd() - 1 });

/** The four examples in a new random order (Fisher-Yates). */
export function ordineCasuale(rnd: () => number = Math.random): number[] {
	const a = INGRESSI.map((_, i) => i);
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(rnd() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
