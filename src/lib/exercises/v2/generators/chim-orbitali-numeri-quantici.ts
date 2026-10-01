/**
 * Orbitali e numeri quantici. Spec: specs/exercises/chim-orbitali-numeri-quantici.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/52-chim-orbitali-numeri-quantici.md), each one step
 * harder: the values of l and the name of an orbital; the values of m_l and how many orbitals a sublevel and a level
 * have; which triple (n, l, m_l) names an orbital, and which rule a wrong one breaks; the nodes of an orbital, radial
 * and angular; how many electrons an orbital, a sublevel and a level hold.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { type Built, checkChoice, choose, generateWith, textBlock, textOpt, texOpt } from '../chim-atomo';

export const ID = 'chim-orbitali-numeri-quantici';

const LETTERS = ['s', 'p', 'd', 'f'];
const shuffled = <T,>(rng: Rng, xs: T[]) => xs.map((x) => ({ x, k: rng.next() })).sort((a, b) => a.k - b.k).map((o) => o.x);

/** A whole number as an option. */
const num = (k: number): ChoiceOption => texOpt(String(k), String(k));
/** A list of integers as an option: "0,\ 1,\ 2", with the plus on the positive ones when `signed`. */
function list(xs: number[], signed = false): ChoiceOption {
	const tex = xs.map((x) => (signed && x > 0 ? `+${x}` : String(x))).join(',\\ ');
	return texOpt(tex, xs.join(','));
}
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
/** An orbital or a sublevel by name: 3d. */
const name = (n: number, l: number) => `${n}${LETTERS[l]}`;
/** A level and a sublevel of it, up to 4f. */
function pickOrbital(rng: Rng, minL = 0, minN = 1): [number, number] {
	const n = rng.int(Math.max(minN, minL + 1), 4);
	return [n, rng.int(minL, n - 1)];
}

// ---------------------------------------------------------------------------
// Level 1: the values of l, the name of an orbital

function level1(rng: Rng): Built {
	const kind = rng.pick(['valori-l', 'nome', 'sottolivelli'] as const);
	if (kind === 'valori-l') {
		const n = rng.int(2, 5);
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(`Quali valori può avere il numero quantico secondario $l$ in un orbitale del livello $n = ${n}$?`),
			solution: list(range(0, n - 1)).latex,
			steps: [textBlock(`Il numero $l$ va da $0$ a $n - 1$, cioè da $0$ a $${n - 1}$: è il numero dei nodi angolari, e i nodi sono in tutto $n - 1$.`)],
			answer: choose(rng, list(range(0, n - 1)), [list(range(0, n)), list(range(1, n)), list(range(1, n - 1).length ? range(1, n - 1) : [1]), list(range(-(n - 1), n - 1), true)]),
			params: { case: kind, n }
		};
	}
	if (kind === 'nome') {
		const [n, l] = pickOrbital(rng, 0, 2);
		const others = shuffled(rng, [0, 1, 2, 3].filter((x) => x !== l)).map((x) => texOpt(name(n, x), name(n, x)));
		return {
			prompt: "Dai il nome all'orbitale.",
			problem: textBlock(`Come si chiama un orbitale con $n = ${n}$ e $l = ${l}$?`),
			solution: name(n, l),
			steps: [textBlock(`Il nome è il numero $n$ seguito dalla lettera di $l$: a $l = ${l}$ corrisponde la lettera $${LETTERS[l]}$, quindi l'orbitale è $${name(n, l)}$.`)],
			answer: choose(rng, texOpt(name(n, l), name(n, l)), others),
			params: { case: kind, n, l }
		};
	}
	const n = rng.int(2, 5);
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(`Quanti sottolivelli ha il livello $n = ${n}$?`),
		solution: String(n),
		steps: [textBlock(`C'è un sottolivello per ogni valore di $l$, e $l$ va da $0$ a $${n - 1}$: sono $${n}$ valori, quindi $${n}$ sottolivelli.`)],
		answer: choose(rng, num(n), [num(n - 1), num(n * n), num(2 * n), num(n + 1), num(2 * n * n)]),
		params: { case: kind, n }
	};
}

// ---------------------------------------------------------------------------
// Level 2: the values of m_l, how many orbitals

function level2(rng: Rng): Built {
	const kind = rng.pick(['valori-m', 'orbitali-sottolivello', 'orbitali-livello'] as const);
	if (kind === 'valori-m') {
		const [n, l] = pickOrbital(rng, 1);
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(`Quali valori può avere il numero quantico magnetico $m_l$ in un orbitale $${name(n, l)}$?`),
			solution: list(range(-l, l), true).latex,
			steps: [textBlock(`Un orbitale $${name(n, l)}$ ha $l = ${l}$. Il numero $m_l$ prende tutti i valori interi da $-l$ a $+l$, zero compreso: sono $${2 * l + 1}$ valori.`)],
			// No list longer than seven values: nine do not fit the answer button on a phone.
			answer: choose(rng, list(range(-l, l), true), [list(range(0, l), true), list(range(-l, l).filter((x) => x !== 0), true), list(l < 3 ? range(-(l + 1), l + 1) : range(-(l - 1), l - 1), true), list(range(1, l + 1), true), list(range(1, l), true)]),
			params: { case: kind, n, l }
		};
	}
	if (kind === 'orbitali-sottolivello') {
		const [n, l] = pickOrbital(rng);
		const right = 2 * l + 1;
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(`Quanti orbitali ha il sottolivello $${name(n, l)}$?`),
			solution: String(right),
			steps: [textBlock(`Il sottolivello $${name(n, l)}$ ha $l = ${l}$. C'è un orbitale per ogni valore di $m_l$, da $-l$ a $+l$: sono $2l + 1 = ${right}$ orbitali.`)],
			answer: choose(rng, num(right), [num(2 * right), num(l + 1), num(n * n), num(2 * l + 2), num(n), num(right + 2), num(right + 4)]),
			params: { case: kind, n, l }
		};
	}
	const n = rng.int(2, 5);
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(`Quanti orbitali ha in tutto il livello $n = ${n}$?`),
		solution: String(n * n),
		steps: [textBlock(`Il livello $n$ ha $n^2$ orbitali: $${range(0, n - 1).map((l) => 2 * l + 1).join(' + ')} = ${n * n}$.`)],
		answer: choose(rng, num(n * n), [num(2 * n * n), num(2 * n - 1), num(n), num(2 * n), num(n * n + 1)]),
		params: { case: kind, n }
	};
}

// ---------------------------------------------------------------------------
// Level 3: which triple names an orbital

type Triple = [number, number, number];
const tripleTex = ([n, l, m]: Triple) => `(${n},\\ ${l},\\ ${m > 0 ? `+${m}` : m})`;
const tripleOpt = (x: Triple) => texOpt(tripleTex(x), x.join(','));

export const RULES = {
	l: '$l$ deve essere minore di $n$',
	m: '$m_l$ non può superare $l$',
	n: '$n$ non può essere zero',
	zero: '$m_l$ non può essere zero'
};

/** A triple that breaks exactly one rule: l not below n, or |m_l| above l, or n = 0. */
function broken(rng: Rng, rule: 'l' | 'm' | 'n'): Triple {
	if (rule === 'n') return [0, 0, 0];
	const n = rng.int(1, 4);
	if (rule === 'l') {
		const l = rng.int(n, n + 1);
		return [n, l, rng.int(-l, l)];
	}
	const l = rng.int(0, n - 1);
	return [n, l, rng.pick([-1, 1]) * rng.int(l + 1, l + 2)];
}

function level3(rng: Rng): Built {
	if (rng.next() < 0.5) {
		const n = rng.int(2, 4);
		const l = rng.int(0, n - 1);
		const right: Triple = [n, l, rng.int(-l, l)];
		const wrong = [broken(rng, 'l'), broken(rng, 'm'), rng.next() < 0.3 ? broken(rng, 'n') : broken(rng, rng.pick(['l', 'm'] as const)), broken(rng, 'l'), broken(rng, 'm'), broken(rng, 'm'), broken(rng, 'l')];
		return {
			prompt: 'Scegli la terna giusta.',
			problem: textBlock(`Le terne sono scritte nell'ordine $(n,\\ l,\\ m_l)$. Quale indica un orbitale che esiste?`),
			solution: tripleTex(right),
			steps: [textBlock(`Serve $l$ tra $0$ e $n - 1$, e $m_l$ tra $-l$ e $+l$. Solo $${tripleTex(right)}$ rispetta le due regole: è un orbitale $${name(n, l)}$.`)],
			answer: choose(rng, tripleOpt(right), wrong.map(tripleOpt)),
			params: { case: 'terna' }
		};
	}
	const rule = rng.pick(['l', 'm', 'l', 'm', 'n'] as const);
	const x = broken(rng, rule);
	const why = { l: `Con $n = ${x[0]}$ il valore più grande di $l$ è $${x[0] - 1}$.`, m: `Con $l = ${x[1]}$ il numero $m_l$ sta tra $${-x[1]}$ e $${x[1] > 0 ? `+${x[1]}` : 0}$.`, n: 'Il numero $n$ parte da $1$.' }[rule];
	return {
		prompt: 'Trova la regola che non è rispettata.',
		problem: textBlock(`La terna $${tripleTex(x)}$, scritta nell'ordine $(n,\\ l,\\ m_l)$, non indica un orbitale. Perché?`),
		solution: textOpt(RULES[rule], rule).latex,
		steps: [textBlock(why)],
		answer: choose(rng, textOpt(RULES[rule], rule), (['l', 'm', 'n', 'zero'] as const).filter((r) => r !== rule).map((r) => textOpt(RULES[r], r))),
		params: { case: 'regola', rule }
	};
}

// ---------------------------------------------------------------------------
// Level 4: the nodes

function level4(rng: Rng): Built {
	const kind = rng.pick(['totali', 'angolari', 'radiali', 'radiali'] as const);
	const n = rng.int(1, 5);
	const l = rng.int(0, Math.min(3, n - 1));
	const right = { totali: n - 1, angolari: l, radiali: n - l - 1 }[kind];
	const what = { totali: 'nodi in tutto', angolari: 'nodi angolari', radiali: 'nodi radiali' }[kind];
	const why = {
		totali: `Un orbitale del livello $n$ ha in tutto $n - 1$ nodi: $${n} - 1 = ${n - 1}$.`,
		angolari: `I nodi angolari sono $l$, e un orbitale $${LETTERS[l]}$ ha $l = ${l}$.`,
		radiali: `I nodi sono in tutto $n - 1 = ${n - 1}$. Quelli angolari sono $l = ${l}$, quindi quelli radiali sono $${n - 1} - ${l} = ${n - l - 1}$.`
	}[kind];
	const others = [n - 1, l, n - l - 1, n, n - l, l + 1, n + l, right + 1, right + 2, right + 3].filter((k) => k >= 0 && k !== right);
	return {
		prompt: 'Conta i nodi.',
		problem: textBlock(`Quanti ${what} ha un orbitale $${name(n, l)}$?`),
		solution: String(right),
		steps: [textBlock(why)],
		answer: choose(rng, num(right), others.map(num)),
		params: { case: kind, n, l }
	};
}

// ---------------------------------------------------------------------------
// Level 5: the electrons

function level5(rng: Rng): Built {
	const kind = rng.pick(['orbitale', 'sottolivello', 'sottolivello', 'livello', 'livello'] as const);
	if (kind === 'livello') {
		const n = rng.int(1, 5);
		const right = 2 * n * n;
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(`Quanti elettroni può contenere al massimo il livello $n = ${n}$?`),
			solution: String(right),
			steps: [textBlock(`Il livello $n$ ha $n^2 = ${n * n}$ orbitali, e in ognuno stanno al massimo $2$ elettroni: $2 \\cdot ${n * n} = ${right}$.`)],
			answer: choose(rng, num(right), [num(n * n), num(2 * n), num(2 * (2 * n - 1)), num(n), num(right + 2), num(right + 4), num(right + 6)]),
			params: { case: kind, n }
		};
	}
	const [n, l] = pickOrbital(rng);
	if (kind === 'orbitale') {
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(`Quanti elettroni può contenere al massimo un solo orbitale $${name(n, l)}$?`),
			solution: '2',
			steps: [textBlock(`Per il principio di esclusione di Pauli in un orbitale stanno al massimo $2$ elettroni, con spin opposto, qualunque sia l'orbitale.`)],
			answer: choose(rng, num(2), [num(2 * (2 * l + 1)), num(2 * l + 1), num(2 * n * n), num(1), num(n), num(6), num(10)]),
			params: { case: kind, n, l }
		};
	}
	const right = 2 * (2 * l + 1);
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(`Quanti elettroni può contenere al massimo il sottolivello $${name(n, l)}$?`),
		solution: String(right),
		steps: [textBlock(`Il sottolivello $${name(n, l)}$ ha $2l + 1 = ${2 * l + 1}$ orbitali, e in ognuno stanno al massimo $2$ elettroni: $2 \\cdot ${2 * l + 1} = ${right}$.`)],
		answer: choose(rng, num(right), [num(2 * l + 1), num(2 * n * n), num(2 * l), num(2 * n), num(right + 2), num(right + 4), num(right + 6)]),
		params: { case: kind, n, l }
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkChoice(sample);
}

export const chimOrbitaliNumeriQuantici: Generator = {
	id: ID,
	title: 'Orbitali e numeri quantici',
	levels: {
		1: { label: 'Livelli, sottolivelli e nomi', constraints: ['l da 0 a n − 1, il nome da n e l'] },
		2: { label: 'Quanti orbitali', constraints: ['m_l da −l a +l, 2l + 1 orbitali, n² nel livello'] },
		3: { label: 'Terne che esistono', constraints: ['una sola regola violata per terna sbagliata'] },
		4: { label: 'I nodi di un orbitale', constraints: ['n − 1 in tutto, l angolari'] },
		5: { label: 'Quanti elettroni', constraints: ['2 per orbitale, 2(2l + 1), 2n²'] }
	},
	generate: generateWith(ID, LEVELS, check),
	check
};

export default chimOrbitaliNumeriQuantici;
