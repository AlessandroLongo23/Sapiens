/**
 * La natura elettrica della materia. Spec: specs/exercises/chim-natura-elettrica.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/39-chim-natura-elettrica.md), each one step harder: the
 * sign of a body from a chain of attractions and repulsions; conductors and insulators; what rubbing does (the charge
 * of the cloth, the way the electrons go); how many electrons a charge is (N = |Q|/e); two equal spheres that touch
 * (the charge each keeps, the electrons that pass). Distractors from the lesson's warnings: attraction read as
 * "opposite sign" without both bodies charged, positive charges that move, the charge multiplied by e, nanocoulombs
 * not converted, the charges summed without their sign.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, E_CHARGE, checkChoice, choose, decTex, generateWith, sig, t, textBlock, textOpt, texOpt } from '../chim-atomo';

export const ID = 'chim-natura-elettrica';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------------------------------------------------------------------------
// Level 1: attraction and repulsion

const SIGN_OPTS = ['Positiva', 'Negativa', 'Nessuna: è neutro', 'Non si può stabilire'];
const FORCE_OPTS = ['Si attraggono', 'Si respingono', 'Non si fanno forze', 'Dipende dalla distanza'];

function level1(rng: Rng): Built {
	const sA = rng.pick([1, -1]);
	const ab = rng.pick(['attraggono', 'respingono'] as const);
	const bc = rng.pick(['attraggono', 'respingono'] as const);
	const sB = ab === 'respingono' ? sA : -sA;
	const sC = bc === 'respingono' ? sB : -sB;
	const word = (s: number) => (s > 0 ? 'positiva' : 'negativa');
	const askSign = rng.next() < 0.5;
	const story = `Tre corpi $A$, $B$ e $C$ sono tutti elettrizzati. $A$ ha carica ${word(sA)}; $A$ e $B$ si ${ab}, $B$ e $C$ si ${bc}.`;
	const steps = [
		textBlock(`$A$ e $B$ si ${ab}: $B$ ha ${ab === 'respingono' ? 'lo stesso segno di' : 'segno opposto ad'} $A$, cioè carica ${word(sB)}.`),
		textBlock(`$B$ e $C$ si ${bc}: $C$ ha ${bc === 'respingono' ? 'lo stesso segno di' : 'segno opposto a'} $B$, cioè carica ${word(sC)}.`),
	];
	if (askSign) {
		const right = cap(word(sC));
		return {
			prompt: 'Trova il segno della carica.',
			problem: textBlock(`${story} Che carica ha $C$?`),
			solution: t(right),
			steps,
			answer: choose(rng, textOpt(right), SIGN_OPTS.filter((x) => x !== right).map((x) => textOpt(x))),
			params: { case: 'segno', sA, ab, bc },
		};
	}
	const right = sA === sC ? 'Si respingono' : 'Si attraggono';
	return {
		prompt: 'Prevedi la forza tra due corpi.',
		problem: textBlock(`${story} Che cosa succede avvicinando $A$ e $C$?`),
		solution: t(right),
		steps: [...steps, textBlock(`$A$ e $C$ hanno cariche ${sA === sC ? 'dello stesso segno: si respingono' : 'di segno opposto: si attraggono'}.`)],
		answer: choose(rng, textOpt(right), FORCE_OPTS.filter((x) => x !== right).map((x) => textOpt(x))),
		params: { case: 'forza', sA, ab, bc },
	};
}

// ---------------------------------------------------------------------------
// Level 2: conductors and insulators

export const CONDUCTORS = ['rame', 'ferro', 'alluminio', 'argento', 'grafite', 'acqua salata', 'corpo umano'];
export const INSULATORS = ['vetro', 'plastica', 'gomma', 'legno secco', 'aria secca'];

const ART: Record<string, string> = {
	rame: 'il rame',
	ferro: 'il ferro',
	alluminio: "l'alluminio",
	argento: "l'argento",
	grafite: 'la grafite',
	'acqua salata': "l'acqua salata",
	'corpo umano': 'il corpo umano',
	vetro: 'il vetro',
	plastica: 'la plastica',
	gomma: 'la gomma',
	'legno secco': 'il legno secco',
	'aria secca': "l'aria secca",
};

function level2(rng: Rng): Built {
	const askConductor = rng.next() < 0.5;
	const [good, bad] = askConductor ? [CONDUCTORS, INSULATORS] : [INSULATORS, CONDUCTORS];
	const right = rng.pick(good);
	const pool = [...bad];
	const picked: string[] = [];
	while (picked.length < 3) picked.push(...pool.splice(rng.int(0, pool.length - 1), 1));
	const rule = askConductor
		? "Nei conduttori le cariche si muovono liberamente: sono conduttori i metalli, la grafite, il corpo umano e l'acqua con i sali disciolti."
		: "Negli isolanti le cariche restano dove sono state messe: sono isolanti il vetro, la plastica, la gomma, il legno secco e l'aria secca.";
	return {
		prompt: `Riconosci ${askConductor ? 'il conduttore' : "l'isolante"}.`,
		problem: textBlock(`Quale di questi materiali è ${askConductor ? 'un conduttore' : 'un isolante'}?`),
		solution: t(cap(right)),
		steps: [textBlock(rule), textBlock(`Qui ${askConductor ? 'il conduttore' : "l'isolante"} è ${ART[right]}; gli altri tre materiali sono ${askConductor ? 'isolanti' : 'conduttori'}.`)],
		answer: choose(rng, textOpt(cap(right), right), picked.map((x) => textOpt(cap(x), x))),
		params: { case: askConductor ? 'conduttore' : 'isolante', right },
	};
}

// ---------------------------------------------------------------------------
// Level 3: rubbing

interface Pair {
	story: string; // "Una bacchetta di vetro strofinata con un panno di seta"
	obj: string; // "la bacchetta di vetro"
	cloth: string; // "il panno di seta"
	sign: 1 | -1; // the object's charge, as in reality
	fem: boolean; // the object's gender, for "positiva" or "positivo"
	pl: boolean; // the cloth is plural (i capelli)
	from: [string, string]; // "dal vetro", "dalla seta"
	to: [string, string]; // "al vetro", "alla seta"
}

export const PAIRS: Pair[] = [
	{ story: 'Una bacchetta di vetro strofinata con un panno di seta', obj: 'la bacchetta', cloth: 'il panno di seta', sign: 1, fem: true, pl: false, from: ['dal vetro', 'dalla seta'], to: ['al vetro', 'alla seta'] },
	{ story: 'Una bacchetta di plastica strofinata con un panno di lana', obj: 'la bacchetta', cloth: 'il panno di lana', sign: -1, fem: true, pl: false, from: ['dalla plastica', 'dalla lana'], to: ['alla plastica', 'alla lana'] },
	{ story: 'Un palloncino strofinato sui capelli', obj: 'il palloncino', cloth: 'i capelli', sign: -1, fem: false, pl: true, from: ['dal palloncino', 'dai capelli'], to: ['al palloncino', 'ai capelli'] },
	{ story: 'Un pettine di plastica passato tra i capelli asciutti', obj: 'il pettine', cloth: 'i capelli', sign: -1, fem: false, pl: true, from: ['dal pettine', 'dai capelli'], to: ['al pettine', 'ai capelli'] },
];

/** A charge in nC with its sign, one decimal: +3{,}2\,\text{nC}. */
const nC = (tenths: number) => `${tenths > 0 ? '+' : tenths < 0 ? '-' : ''}${decTex((Math.abs(tenths) / 10).toFixed(1))}\\,\\text{nC}`;
const nCopt = (tenths: number) => texOpt(nC(tenths), String(tenths / 10));

function level3(rng: Rng): Built {
	const p = rng.int(0, PAIRS.length - 1);
	const P = PAIRS[p];
	const askCharge = rng.next() < 0.5;
	if (askCharge) {
		let k = 0; // tenths of nC, never a whole number of nC
		while (k % 10 === 0) k = rng.int(11, 99) * P.sign;
		return {
			prompt: 'Trova la carica.',
			problem: textBlock(`${P.story} acquista una carica di $${nC(k)}$. Quale carica ${P.pl ? 'acquistano' : 'acquista'} ${P.cloth}?`),
			solution: nC(-k),
			steps: [
				textBlock('Lo strofinio sposta elettroni da un corpo all\'altro, e la carica totale si conserva: era zero prima e resta zero dopo.'),
				textBlock(`Quindi ${P.cloth} ${P.pl ? 'hanno' : 'ha'} una carica uguale e opposta: $${nC(-k)}$.`),
			],
			// the same sign (charge "copied"); neutral (only the rubbed body charged); half of it, with the right sign
			answer: choose(rng, nCopt(-k), [nCopt(k), texOpt('0\\,\\text{nC}', '0'), nCopt(-Math.round(k / 2)), nCopt(-2 * k)]),
			params: { case: 'carica', pair: p, q: k / 10 },
		};
	}
	// the electrons go towards the body that becomes negative
	const [a, b] = P.sign > 0 ? [0, 1] : [1, 0];
	const right = `Gli elettroni passano ${P.from[a]} ${P.to[b]}`;
	const wrong = [`Gli elettroni passano ${P.from[b]} ${P.to[a]}`, `Le cariche positive passano ${P.from[b]} ${P.to[a]}`, 'Nessuna carica passa: lo strofinio crea le cariche'];
	return {
		prompt: 'Trova il verso in cui si spostano le cariche.',
		problem: textBlock(`${P.story} acquista una carica ${P.sign > 0 ? 'positiva' : 'negativa'}. Che cosa è successo durante lo strofinio?`),
		solution: textOpt(right).latex,
		steps: [
			textBlock('Nei solidi si spostano gli elettroni, negativi; le cariche positive restano negli atomi.'),
			textBlock(`${cap(P.obj)} è ${P.sign > 0 ? 'positiv' : 'negativ'}${P.fem ? 'a' : 'o'}: ha ${P.sign > 0 ? 'perso' : 'acquistato'} elettroni, quindi gli elettroni sono passati ${P.from[a]} ${P.to[b]}.`),
		],
		answer: choose(rng, textOpt(right, 'giusto'), wrong.map((x, i) => textOpt(x, `sbagliato${i}`))),
		params: { case: 'verso', pair: p, sign: P.sign },
	};
}

// ---------------------------------------------------------------------------
// Level 4: how many electrons

/** N as the option writes it, with the direction: "5{,}0 \cdot 10^{10}\text{ in più}". */
const nOpt = (x: number, more: boolean) => {
	const r = sig(x, 2);
	if (!r) return null;
	return texOpt(`${r.tex}\\text{ in ${more ? 'più' : 'meno'}}`, `${r.value} ${more ? 'piu' : 'meno'}`);
};

function level4(rng: Rng): Built {
	const inNano = rng.next() < 0.5;
	const m = rng.int(10, 99); // two significant figures
	if (m % 10 === 0) throw new Error('round');
	const neg = rng.next() < 0.5;
	let Qc: number, qTex: string, qNum: string;
	if (inNano) {
		const e = rng.int(0, 1); // 1,0-9,9 nC or 10-99 nC
		const val = m / 10 ** (1 - e);
		qNum = e === 1 ? String(m) : decTex((m / 10).toFixed(1));
		qTex = `${neg ? '-' : '+'}${qNum}\\,\\text{nC}`;
		Qc = val * 1e-9;
	} else {
		const k = rng.int(10, 14); // 10^-k C
		qNum = `${decTex((m / 10).toFixed(1))} \\cdot 10^{-${k}}`;
		qTex = `${neg ? '-' : '+'}${qNum}\\,\\text{C}`;
		Qc = (m / 10) * 10 ** -k;
	}
	const N = Qc / E_CHARGE;
	const r = sig(N, 2);
	if (!r) throw new Error('tie');
	const more = neg;
	const right = nOpt(N, more)!;
	const others = [nOpt(N, !more), inNano ? nOpt(N / 1e-9, more) : nOpt(N * 10, more), nOpt(Qc * E_CHARGE, more), nOpt(N / 10, more), nOpt(N * 100, !more)].filter((o): o is NonNullable<typeof o> => o !== null);
	return {
		prompt: 'Conta gli elettroni.',
		problem: textBlock(`Un oggetto ha una carica di $${qTex}$. Quanti elettroni ha in più o in meno di quando era neutro? La carica elementare è $e = 1{,}60 \\cdot 10^{-19}\\,\\text{C}$.`),
		solution: right.latex,
		steps: [
			textBlock(`La carica è ${neg ? 'negativa: l\'oggetto ha elettroni in più' : 'positiva: l\'oggetto ha elettroni in meno'}.`),
			...(inNano ? [textBlock(`In coulomb: $${qNum}\\,\\text{nC} = ${qNum} \\cdot 10^{-9}\\,\\text{C}$.`)] : []),
			`N = \\dfrac{|Q|}{e} = \\dfrac{${inNano ? `${qNum} \\cdot 10^{-9}` : qNum}\\,\\text{C}}{1{,}60 \\cdot 10^{-19}\\,\\text{C}} \\approx ${r.tex}`,
		],
		answer: choose(rng, right, others),
		params: { case: inNano ? 'nC' : 'C', Q: (neg ? -1 : 1) * Qc },
	};
}

// ---------------------------------------------------------------------------
// Level 5: two equal spheres that touch

function level5(rng: Rng): Built {
	const askCharge = rng.next() < 0.5;
	for (;;) {
		const a = rng.int(-12, 12), b = rng.int(-12, 12);
		if (a === 0 || b === 0 || a === b || (a + b) % 2 !== 0) continue;
		if (Math.sign(a) === Math.sign(b) && rng.next() < 0.5) continue; // more pairs of opposite sign
		const fin = (a + b) / 2;
		if (!askCharge && !sig(((Math.abs(a - fin) * 1e-9) / E_CHARGE), 2)) continue;
		return spheres(rng, a, b, fin, askCharge);
	}
}

function spheres(rng: Rng, a: number, b: number, fin: number, askCharge: boolean): Built {
	const story = `Due sfere di metallo uguali, su supporti isolanti, hanno cariche $Q_A = ${nC(a * 10)}$ e $Q_B = ${nC(b * 10)}$. Si fanno toccare e poi si separano.`;
	const sumStep = textBlock(`La carica totale si conserva: $Q_A + Q_B = ${nC((a + b) * 10)}$, e si divide a metà tra le due sfere uguali: $${nC(fin * 10)}$ ciascuna.`);
	if (askCharge) {
		const bigger = Math.abs(a) >= Math.abs(b) ? a : b;
		return {
			prompt: 'Trova la carica dopo il contatto.',
			problem: textBlock(`${story} Quale carica ha ciascuna sfera?`),
			solution: nC(fin * 10),
			steps: [sumStep],
			// the sizes summed without the signs; the sum not halved; the difference halved; the charges unchanged
			answer: choose(rng, nCopt(fin * 10), [nCopt(Math.sign(bigger) * ((Math.abs(a) + Math.abs(b)) / 2) * 10), nCopt((a + b) * 10), nCopt(((a - b) / 2) * 10), nCopt(((b - a) / 2) * 10), nCopt(a * 10)]),
			params: { case: 'carica', a, b },
		};
	}
	const moved = Math.abs(a - fin); // nC
	const N = (moved * 1e-9) / E_CHARGE;
	const r = sig(N, 2);
	if (!r) throw new Error('tie');
	const opt = (x: number) => {
		const s = sig(x, 2);
		return s ? texOpt(s.tex, s.value) : null;
	};
	const others = [opt(((Math.abs(a + b) / 2) * 1e-9) / E_CHARGE), opt((Math.abs(a - b) * 1e-9) / E_CHARGE), opt(moved / E_CHARGE), opt(N * 10)].filter((o): o is NonNullable<typeof o> => o !== null);
	return {
		prompt: 'Conta gli elettroni che passano.',
		problem: textBlock(`${story} Quanti elettroni passano da una sfera all'altra? La carica elementare è $e = 1{,}60 \\cdot 10^{-19}\\,\\text{C}$.`),
		solution: r.tex,
		steps: [
			sumStep,
			textBlock(`La sfera $A$ passa da $${nC(a * 10)}$ a $${nC(fin * 10)}$: la sua carica cambia di $${decTex(moved.toFixed(1))}\\,\\text{nC}$, portati dagli elettroni.`),
			`N = \\dfrac{${decTex(moved.toFixed(1))} \\cdot 10^{-9}\\,\\text{C}}{1{,}60 \\cdot 10^{-19}\\,\\text{C}} \\approx ${r.tex}`,
		],
		answer: choose(rng, texOpt(r.tex, r.value), others),
		params: { case: 'elettroni', a, b },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkChoice(sample);
}

export const chimNaturaElettrica: Generator = {
	id: ID,
	title: 'La natura elettrica della materia',
	levels: {
		1: { label: 'Attrazione e repulsione', constraints: ['tre corpi carichi in catena', 'il segno del terzo o la forza tra il primo e il terzo'] },
		2: { label: 'Conduttori e isolanti', constraints: ['un conduttore tra tre isolanti, o il contrario'] },
		3: { label: 'Lo strofinio', constraints: ['la carica del panno, o il verso degli elettroni'] },
		4: { label: 'Contare gli elettroni', constraints: ['N = |Q|/e, due cifre significative', 'in più o in meno'] },
		5: { label: 'Due sfere a contatto', constraints: ['la carica di ciascuna, o gli elettroni che passano'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimNaturaElettrica;
