/**
 * Entropia e disordine. Spec: specs/exercises/fis-entropia-disordine.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/119-fis-entropia-disordine.md), each one step harder:
 * counting the microstates of a macrostate of N molecules in a box of two halves, Ω = N!/(N_s! N_d!); its
 * probability, Ω/2^N; which of four macrostates of many molecules has the most (or the fewest) microstates, or the
 * highest (or lowest) entropy, without counting; the entropy of a macrostate from Boltzmann's equation, S = k_B ln Ω;
 * the entropy change of a free expansion, N k_B ln(V_B/V_A). Distractors from the lesson's warnings: all the
 * microstates instead of the macrostate's, a factorial forgotten, the share of molecules taken for the probability,
 * the logarithm forgotten or taken in base ten, the number of molecules forgotten.
 */
import type { ChoiceOption, Generator, Rng, Sample, SceneRef } from '../types';
import { type Built, type Num, K_B, answerOf, checkCommon, choiceOf, dec, decTex, generateWith, noZero, q, raw, sig, t, textBlock } from '../fis-frigo-entropia';

export const ID = 'fis-entropia-disordine';

const kB = 'k_B = 1{,}38 \\cdot 10^{-23}\\,\\text{J/K}';
const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const binom = (n: number, k: number) => Math.round(fact(n) / (fact(k) * fact(n - k)));
/** A whole number as an option, or null when it is not one worth showing. */
const whole = (x: number): Num | null => (Number.isInteger(x) && x > 0 && x < 1e5 ? { tex: String(x), value: String(x) } : null);

function box(left: number, right: number): SceneRef {
	return { type: 'scatola-molecole', data: { sinistra: left, destra: right }, alt: `Una scatola divisa in due metà, con ${left} molecole nella metà sinistra e ${right} nella metà destra.` };
}

/** The count written out: 10!/(4! 6!) = (10·9·8·7)/(4·3·2·1) = 210, cancelling the larger factorial. */
function counting(n: number, ns: number): string {
	const nd = n - ns;
	const small = Math.min(ns, nd);
	const omega = binom(n, ns);
	const head = `\\Omega = \\dfrac{${n}!}{${ns}!\\,${nd}!}`;
	if (small === 0) return `${head} = 1`;
	const top = Array.from({ length: small }, (_, i) => n - i).join(' \\cdot ');
	const bottom = Array.from({ length: small }, (_, i) => small - i).join(' \\cdot ');
	return small === 1 ? `${head} = ${n}` : `${head} = \\dfrac{${top}}{${bottom}} = ${omega}`;
}

// ---------------------------------------------------------------------------
// Level 1: counting the microstates

function level1(rng: Rng): Built {
	const n = rng.int(4, 10);
	const ns = rng.int(1, n - 1);
	const nd = n - ns;
	const omega = binom(n, ns);
	const ans = whole(omega);
	if (!ans) throw new Error('count');
	return {
		prompt: 'Conta i microstati.',
		problem: textBlock(`In una scatola divisa in due metà ci sono $${n}$ molecole. Quanti microstati ha il macrostato con $${ns}$ ${ns === 1 ? 'molecola' : 'molecole'} a sinistra e $${nd}$ a destra?`),
		solution: `\\Omega = ${omega}`,
		steps: [t('I modi di scegliere quali molecole stanno a sinistra:'), counting(n, ns)],
		// all the microstates of the box; one factorial forgotten; the two counts multiplied; N times N_s
		answer: answerOf(rng, ans, [whole(2 ** n), whole(fact(n) / fact(Math.max(ns, nd))), whole(ns * nd), whole(n * ns)], 'none', [whole(omega + n), whole(omega + 1), whole(omega * 2), whole(n + 1)]),
		params: { n, ns },
		scene: box(ns, nd),
	};
}

// ---------------------------------------------------------------------------
// Level 2: the probability of a macrostate

function level2(rng: Rng): Built {
	const n = rng.int(4, 10);
	const ns = rng.int(0, n);
	const nd = n - ns;
	const omega = binom(n, ns), all = 2 ** n;
	const exact = (100 * omega) / all;
	const ans = sig(exact, 3);
	if (!ans) throw new Error('tie');
	const share = (100 * omega) / (2 * n);
	return {
		prompt: 'Trova la probabilità del macrostato.',
		problem: textBlock(`In una scatola divisa in due metà ci sono $${n}$ molecole, che si muovono a caso. Qual è la probabilità di trovarne $${ns}$ a sinistra e $${nd}$ a destra?`),
		solution: `P \\approx ${q(ans.tex, 'pct')}`,
		steps: [
			`${t('I microstati del macrostato: ')} ${counting(n, ns)}`,
			`${t('I microstati in tutto: ')} 2^{${n}} = ${all}`,
			`P = \\dfrac{\\Omega}{2^N} = \\dfrac{${omega}}{${all}} = ${raw(omega / all)}\\ldots \\approx ${q(ans.tex, 'pct')}`,
		],
		// the share of molecules on the left; one microstate alone; 2N for 2^N; one over the multiplicity
		answer: answerOf(rng, ans, [sig((100 * ns) / n, 3), sig(100 / all, 3), share <= 100 ? sig(share, 3) : null, omega > 1 ? sig(100 / omega, 3) : null], 'pct', [sig(exact / 2, 3), sig(exact / 4, 3), sig(Math.min(99, exact * 1.5), 3), sig(50, 3)]),
		params: { n, ns },
		scene: box(ns, nd),
	};
}

// ---------------------------------------------------------------------------
// Level 3: which macrostate, without counting

const ASKS = [
	{ case: 'massimo', what: 'ha più microstati', why: 'Il macrostato con più microstati è quello più vicino alla divisione a metà.' },
	{ case: 'massimo', what: "ha l'entropia più grande", why: 'L’entropia cresce con il numero di microstati: è più grande nel macrostato più vicino alla divisione a metà.' },
	{ case: 'minimo', what: 'ha meno microstati', why: 'Il macrostato con meno microstati è quello più lontano dalla divisione a metà.' },
	{ case: 'minimo', what: "ha l'entropia più piccola", why: 'L’entropia cresce con il numero di microstati: è più piccola nel macrostato più lontano dalla divisione a metà.' },
];

function level3(rng: Rng): Built {
	const n = rng.pick([20, 30, 40, 50, 60, 80, 100]);
	const half = n / 2;
	const picked: number[] = [];
	const far = new Set<number>();
	while (picked.length < 4) {
		const ns = rng.int(0, n);
		const d = Math.abs(ns - half);
		if (far.has(d)) continue;
		far.add(d);
		picked.push(ns);
	}
	// Both sides of the middle, so that "the largest number" and "the smallest number" are not rules that work.
	if (picked.every((x) => x >= half) || picked.every((x) => x <= half)) throw new Error('one side');
	const ask = rng.pick(ASKS);
	const byDistance = [...picked].sort((a, b) => Math.abs(a - half) - Math.abs(b - half));
	const right = ask.case === 'massimo' ? byDistance[0] : byDistance[3];
	const option = (ns: number): ChoiceOption => ({ latex: `N_s = ${ns}`, values: [String(ns)] });
	const shown = [...picked].sort((a, b) => a - b);
	return {
		prompt: 'Scegli il macrostato.',
		problem: textBlock(`In una scatola divisa in due metà $${n}$ molecole si muovono a caso. Quale di questi macrostati, indicati con il numero $N_s$ di molecole a sinistra, ${ask.what}?`),
		solution: `N_s = ${right}`,
		steps: [
			t(ask.why),
			`${t(`La divisione a metà è a ${half} molecole per parte. Le distanze da ${half}: `)} ${shown.map((ns) => `|${ns} - ${half}| = ${Math.abs(ns - half)}`).join(', \\quad ')}`,
			`${t(ask.case === 'massimo' ? 'La distanza più piccola è quella di ' : 'La distanza più grande è quella di ')} N_s = ${right}`,
		],
		answer: choiceOf(rng, option(right), picked.filter((x) => x !== right).map(option)),
		params: { case: ask.case, n, ask: ask.what },
	};
}

// ---------------------------------------------------------------------------
// Level 4: S = k_B ln Ω

function level4(rng: Rng): Built {
	const mant = dec(noZero(rng, 11, 99), 1);
	const e = rng.int(10, 60);
	const lnOmega = Math.log(Number(mant)) + e * Math.LN10;
	const exact = K_B * lnOmega;
	const ans = sig(exact, 3);
	if (!ans) throw new Error('tie');
	const omegaT = `${decTex(mant)} \\cdot 10^{${e}}`;
	return {
		prompt: "Trova l'entropia del macrostato.",
		problem: textBlock(`Un macrostato di un sistema ha $\\Omega = ${omegaT}$ microstati. Quanto vale la sua entropia? Usa $${kB}$.`),
		solution: `S \\approx ${q(ans.tex, 'JK')}`,
		steps: [
			`${t('Il logaritmo naturale del numero di microstati: ')} \\ln(${omegaT}) = ${raw(lnOmega)}\\ldots`,
			`S = k_B \\ln \\Omega = 1{,}38 \\cdot 10^{-23}\\,\\text{J/K} \\cdot ${raw(lnOmega)}\\ldots \\approx ${q(ans.tex, 'JK')}`,
		],
		// the decimal logarithm; the constant forgotten; the logarithm forgotten
		answer: answerOf(rng, ans, [sig((K_B * lnOmega) / Math.LN10, 3), sig(lnOmega, 3), sig(K_B * Number(mant) * 10 ** e, 3)], 'JK', [sig(exact * 2, 3), sig(exact / 2, 3)]),
		params: { mant, e },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the free expansion

const GROWS = [
	{ r: 2, text: 'raddoppia' },
	{ r: 3, text: 'triplica' },
	{ r: 4, text: 'diventa $4$ volte più grande' },
	{ r: 5, text: 'diventa $5$ volte più grande' },
];

function level5(rng: Rng): Built {
	const mant = dec(noZero(rng, 11, 99), 1);
	const e = rng.int(20, 24);
	const g = rng.pick(GROWS);
	const N = Number(mant) * 10 ** e;
	const exact = N * K_B * Math.log(g.r);
	const ans = sig(exact, 2);
	if (!ans) throw new Error('tie');
	const NT = `${decTex(mant)} \\cdot 10^{${e}}`;
	return {
		prompt: 'Trova la variazione di entropia del gas.',
		problem: textBlock(`Un gas perfetto con $${NT}$ molecole si espande liberamente in un recipiente isolato, e il suo volume ${g.text}. Di quanto varia la sua entropia? Usa $${kB}$.`),
		solution: `\\Delta S \\approx ${q(ans.tex, 'JK')}`,
		steps: [
			`${t('Ogni molecola ha a disposizione uno spazio più grande: ')} \\dfrac{\\Omega_B}{\\Omega_A} = \\left(\\dfrac{V_B}{V_A}\\right)^N = ${g.r}^N`,
			`\\Delta S = N\\,k_B \\ln\\dfrac{V_B}{V_A} = ${NT} \\cdot 1{,}38 \\cdot 10^{-23} \\cdot \\ln ${g.r}\\,\\text{J/K} = ${raw(exact)}\\ldots\\,\\text{J/K} \\approx ${q(ans.tex, 'JK')}`,
		],
		// the logarithm forgotten; the decimal logarithm; the number of molecules forgotten; the ratio minus one
		answer: answerOf(rng, ans, [sig(N * K_B * g.r, 2), sig(N * K_B * Math.log10(g.r), 2), sig(K_B * Math.log(g.r), 2), sig(N * K_B * (g.r - 1), 2)], 'JK', [sig(exact * 2, 2), sig(exact / 2, 2)]),
		params: { mant, e, r: g.r },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (sample.level <= 2 && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisEntropiaDisordine: Generator = {
	id: ID,
	title: 'Entropia e disordine',
	levels: {
		1: { label: 'Contare i microstati', constraints: ['da 4 a 10 molecole, nessuna metà vuota'] },
		2: { label: 'La probabilità di un macrostato', constraints: ['la molteplicità divisa per 2^N, in percentuale'] },
		3: { label: 'Il macrostato più probabile', constraints: ['molte molecole, senza contare: la distanza dalla divisione a metà'] },
		4: { label: "L'entropia dai microstati", constraints: ['equazione di Boltzmann, logaritmo naturale'] },
		5: { label: "L'espansione libera", constraints: ['il numero di molecole per k_B per il logaritmo del rapporto tra i volumi'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisEntropiaDisordine;
