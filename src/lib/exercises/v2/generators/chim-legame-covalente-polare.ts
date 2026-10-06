/**
 * Legame covalente polare e legame dativo. Spec: specs/exercises/chim-legame-covalente-polare.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/64-chim-legame-covalente-polare.md), each one step
 * harder: the difference of electronegativity of a bond; the kind of bond from it, with the thresholds of the lesson
 * (below 0,4 pure covalent, from 0,4 to 1,9 polar covalent, above 1,9 ionic); the atom with the partial charge; the
 * most or the least polar of four bonds; the dative bond. Electronegativities: Pauling's with two decimals, from
 * src/lib/tools/elementi.json, always given in the problem.
 *
 * Pairs near a threshold, and pairs for which the rule of thumb gives the wrong kind (a metal and a non-metal below
 * 2,0, two metals, two non-metals above 1,85), are left out: see the spec.
 */
import type { Generator, Rng } from '../types';
import { type BuiltE, type El, ELEMENTS, art, bondTex, cap, checkE, choose, di, el, generateE, hund, t, texOpt, textBlock, textOpt, toChoiceE } from '../chim3-e';
import { shuffle } from '../insiemi';

export const ID = 'chim-legame-covalente-polare';

const delta = (a: El, b: El) => Math.abs(a.chi - b.chi);
const NON_METALS = ELEMENTS.filter((e) => !e.metal);
const METALS = ELEMENTS.filter((e) => e.metal);

/** Pairs of different non-metals the rule classifies safely: Δχ at most 0,35, or from 0,45 to 1,85. */
const pairs = (keep: (d: number) => boolean): [El, El][] => {
	const out: [El, El][] = [];
	for (let i = 0; i < NON_METALS.length; i++) for (let j = i + 1; j < NON_METALS.length; j++) if (keep(delta(NON_METALS[i], NON_METALS[j]))) out.push([NON_METALS[i], NON_METALS[j]]);
	return out;
};
export const PURE = pairs((d) => d <= 35);
export const POLAR = pairs((d) => d >= 45 && d <= 185);
/** A metal and a non-metal with Δχ of at least 2,0. */
export const IONIC: [El, El][] = METALS.flatMap((m) => NON_METALS.filter((n) => delta(m, n) >= 200).map((n): [El, El] => [m, n]));
/** Molecules of one element: a pure covalent bond with Δχ = 0. */
const SAME = ['H', 'N', 'O', 'F', 'Cl', 'Br', 'I'];

const given = (a: El, b: El) => `L'elettronegatività ${di(a.nome)} è $${hund(a.chi)}$, quella ${di(b.nome)} è $${hund(b.chi)}$.`;
const either = (rng: Rng, [a, b]: [El, El]): [El, El] => (rng.next() < 0.5 ? [a, b] : [b, a]);

// ---------------------------------------------------------------------------
// Level 1: Δχ

function level1(rng: Rng): BuiltE {
	const [a, b] = either(rng, rng.pick([...PURE, ...POLAR, ...IONIC]));
	const d = delta(a, b);
	if (d === 0) throw new Error('equal electronegativities');
	const hi = Math.max(a.chi, b.chi), lo = Math.min(a.chi, b.chi);
	const opt = (k: number) => texOpt(hund(k), String(k));
	return {
		prompt: 'Calcola la differenza di elettronegatività.',
		problem: textBlock(`${given(a, b)} Quanto vale la differenza di elettronegatività $\\Delta\\chi$ del legame tra i due atomi?`),
		solution: hund(d),
		steps: [textBlock('Si toglie il valore più piccolo dal più grande, così il risultato è positivo.'), `\\Delta\\chi = ${hund(hi)} - ${hund(lo)} = ${hund(d)}`],
		// the sum; the difference with the wrong sign; the mean
		answer: choose(rng, opt(d), [opt(hi + lo), opt(-d), ...(((hi + lo) % 2 === 0) ? [opt((hi + lo) / 2)] : []), opt(d + 10), opt(d + 100)]),
		params: { case: 'delta', a: a.sym, b: b.sym },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the kind of bond

const KINDS = { puro: 'Covalente puro', polare: 'Covalente polare', ionico: 'Ionico' } as const;
type Kind = keyof typeof KINDS;

function level2(rng: Rng): BuiltE {
	const r = rng.next();
	const kind: Kind = r < 0.3 ? 'puro' : r < 0.7 ? 'polare' : 'ionico';
	let a: El, b: El;
	if (kind === 'puro' && rng.next() < 0.35) a = b = el(rng.pick(SAME));
	else [a, b] = either(rng, rng.pick(kind === 'puro' ? PURE : kind === 'polare' ? POLAR : IONIC));
	const d = delta(a, b);
	const same = a === b;
	const problem = same
		? `Nella molecola $\\mathrm{${a.sym}_2}$ sono legati due atomi di ${a.nome}, che ha elettronegatività $${hund(a.chi)}$. Che tipo di legame c'è tra i due atomi?`
		: `${given(a, b)} Che tipo di legame c'è tra ${art(a.nome)} e ${art(b.nome)}?`;
	const why = kind === 'puro' ? `minore di $0{,}4$: il legame è covalente puro${same ? '' : ', anche se gli atomi sono diversi'}` : kind === 'polare' ? 'compreso tra $0{,}4$ e $1{,}9$: il legame è covalente polare' : 'maggiore di $1{,}9$: il legame è ionico';
	return {
		prompt: 'Riconosci il tipo di legame.',
		problem: textBlock(problem),
		solution: t(KINDS[kind]),
		steps: [same ? '\\Delta\\chi = 0' : `\\Delta\\chi = ${hund(Math.max(a.chi, b.chi))} - ${hund(Math.min(a.chi, b.chi))} = ${hund(d)}`, textBlock(`Il valore è ${why}.`)],
		answer: choose(rng, textOpt(KINDS[kind], kind), [...(Object.keys(KINDS) as Kind[]).filter((k) => k !== kind).map((k) => textOpt(KINDS[k], k)), textOpt('Dativo', 'dativo')]),
		params: { case: kind, a: a.sym, b: b.sym },
	};
}

// ---------------------------------------------------------------------------
// Level 3: where the partial charges are

const su = (name: string) => art(name).replace(/^il /, 'Sul ').replace(/^lo /, 'Sullo ').replace(/^l'/, "Sull'");

function level3(rng: Rng): BuiltE {
	const [a, b] = either(rng, rng.pick(POLAR));
	const neg = a.chi > b.chi ? a : b;
	const pos = neg === a ? b : a;
	const minus = rng.next() < 0.6;
	const right = minus ? neg : pos;
	return {
		prompt: 'Trova la carica parziale.',
		problem: textBlock(`${given(a, b)} Nel legame covalente polare tra i due atomi, su quale si trova la carica parziale $\\delta^${minus ? '-' : '+'}$?`),
		solution: t(su(right.nome)),
		steps: [
			textBlock(`${cap(art(neg.nome))} è il più elettronegativo ($${hund(neg.chi)} > ${hund(pos.chi)}$) e attira verso di sé la coppia in comune.`),
			textBlock(`La carica $\\delta^-$ sta ${su(neg.nome).toLowerCase()}, la carica $\\delta^+$ ${su(pos.nome).toLowerCase()}.`),
		],
		answer: choose(rng, textOpt(su(right.nome), right.sym), [textOpt(su((right === neg ? pos : neg).nome), (right === neg ? pos : neg).sym), textOpt('Su tutti e due', 'entrambi'), textOpt('Su nessuno dei due', 'nessuno')]),
		params: { case: minus ? 'meno' : 'piu', a: a.sym, b: b.sym },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the most polar bond

function level4(rng: Rng): BuiltE {
	const most = rng.next() < 0.6;
	// written with the less electronegative atom first, as H-Cl
	const four = shuffle(rng, [...PURE, ...POLAR]).slice(0, 4).map(([a, b]): [El, El] => (a.chi <= b.chi ? [a, b] : [b, a]));
	const ds = four.map(([a, b]) => delta(a, b));
	const sorted = [...ds].sort((x, y) => x - y);
	// the four differences at least 0,05 apart, so that the order is clear
	for (let i = 1; i < 4; i++) if (sorted[i] - sorted[i - 1] < 5) throw new Error('too close');
	const best = most ? sorted[3] : sorted[0];
	const right = four[ds.indexOf(best)];
	const symbols = [...new Set(four.flat().map((e) => e.sym))];
	const table = `\\begin{array}{c|c} \\text{elemento} & \\chi \\\\ \\hline ${symbols.map((x) => `\\mathrm{${x}} & ${hund(el(x).chi)}`).join(' \\\\ ')} \\end{array}`;
	const btex = ([a, b]: [El, El]) => bondTex(a.sym, b.sym);
	return {
		prompt: 'Confronta la polarità dei legami.',
		problem: textBlock(`Quale di questi legami è il ${most ? 'più' : 'meno'} polare? Usa le elettronegatività della tabella.`, 46, [table]),
		solution: btex(right),
		steps: [
			...four.map(([a, b], i) => `${btex([a, b])}:\\ \\Delta\\chi = ${hund(Math.max(a.chi, b.chi))} - ${hund(Math.min(a.chi, b.chi))} = ${hund(ds[i])}`),
			textBlock(`Il legame ${most ? 'più' : 'meno'} polare è quello con $\\Delta\\chi$ ${most ? 'maggiore' : 'minore'}: $${btex(right)}$.`),
		],
		answer: choose(rng, texOpt(btex(right), `${right[0].sym}-${right[1].sym}`), four.filter((p) => p !== right).map((p) => texOpt(btex(p), `${p[0].sym}-${p[1].sym}`))),
		params: { case: most ? 'piu' : 'meno' },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the dative bond

export const FACTS: { q: string; a: string; wrong: string[]; why: string }[] = [
	{ q: 'In un legame dativo, da dove vengono i due elettroni della coppia in comune?', a: 'Tutti e due dallo stesso atomo', wrong: ['Uno da ciascun atomo', 'Da un terzo atomo', 'Dai due nuclei'], why: 'Nel legame dativo la coppia in comune viene tutta da un atomo solo, il donatore.' },
	{ q: "Che cosa deve avere l'atomo donatore di un legame dativo?", a: 'Una coppia solitaria', wrong: ['Un elettrone spaiato', 'Una carica positiva', 'Il livello esterno vuoto'], why: 'Il donatore mette in comune una coppia intera: deve avere una coppia solitaria.' },
	{ q: "Che cosa deve avere l'atomo accettore di un legame dativo?", a: 'Posto per due elettroni', wrong: ['Una coppia solitaria', "L'ottetto completo", 'Una carica negativa'], why: "L'accettore riceve la coppia: nel suo livello esterno deve esserci posto per due elettroni." },
	{ q: "Nella formazione dello ione ammonio da ammoniaca e ione idrogeno, chi è il donatore?", a: "L'azoto", wrong: ['Lo ione idrogeno', "Un idrogeno dell'ammoniaca", 'Nessuno dei due'], why: "L'azoto dell'ammoniaca ha una coppia solitaria e la mette in comune con lo ione $\\mathrm{H^+}$." },
	{ q: "Nella formazione dello ione ossonio da acqua e ione idrogeno, chi è l'accettore?", a: 'Lo ione idrogeno', wrong: ["L'ossigeno", "Un idrogeno dell'acqua", 'Nessuno dei due'], why: 'Lo ione $\\mathrm{H^+}$ ha il primo livello vuoto e riceve una coppia solitaria dell\'ossigeno.' },
	{ q: 'Quante coppie solitarie ha l\'azoto nello ione $\\mathrm{NH_4^+}$?', a: '0', wrong: ['1', '2', '4'], why: "La coppia solitaria dell'ammoniaca è diventata il quarto legame: all'azoto restano solo quattro coppie di legame." },
	{ q: 'Quante coppie solitarie ha l\'ossigeno nello ione $\\mathrm{H_3O^+}$?', a: '1', wrong: ['0', '2', '3'], why: "L'ossigeno dell'acqua ha due coppie solitarie: una diventa il legame con $\\mathrm{H^+}$, e ne resta una." },
	{ q: "Nello ione $\\mathrm{NH_4^+}$, com'è il legame dativo rispetto agli altri tre legami?", a: 'Identico agli altri', wrong: ['Più lungo', 'Più debole', 'Più corto'], why: 'Una volta formato, il legame dativo non si distingue dagli altri: i quattro legami sono identici.' },
	{ q: 'Quanti elettroni ha intorno l\'azoto nello ione $\\mathrm{NH_4^+}$?', a: '8', wrong: ['10', '6', '9'], why: "L'azoto ha quattro coppie di legame: $4 \\cdot 2 = 8$ elettroni, l'ottetto." },
	{ q: "Nel composto che si forma tra $\\mathrm{BF_3}$ e $\\mathrm{NH_3}$, chi è l'accettore?", a: 'Il boro', wrong: ["L'azoto", 'Il fluoro', "L'idrogeno"], why: 'Il boro di $\\mathrm{BF_3}$ ha solo sei elettroni intorno e ha posto per una coppia: la riceve dall\'azoto.' },
	{ q: 'Quanti elettroni ha intorno il boro in $\\mathrm{BF_3}$, prima di legarsi all\'ammoniaca?', a: '6', wrong: ['8', '3', '5'], why: 'Il boro ha tre coppie di legame, una per ogni fluoro: $3 \\cdot 2 = 6$ elettroni.' },
	{ q: 'Come si può disegnare un legame dativo in una formula?', a: "Con una freccia dal donatore all'accettore", wrong: ["Con una freccia dall'accettore al donatore", 'Con due trattini', 'Con una linea tratteggiata'], why: "La freccia va dal donatore all'accettore e ricorda da dove viene la coppia." },
	{ q: 'Perché lo ione $\\mathrm{H^+}$ può fare da accettore in un legame dativo?', a: 'Ha il primo livello vuoto', wrong: ['Ha una coppia solitaria', 'Ha otto elettroni', 'È uno ione negativo'], why: 'Lo ione $\\mathrm{H^+}$ è un protone, senza elettroni: nel primo livello ha posto per una coppia.' },
	{ q: "Quanti legami dativi si formano quando una molecola d'acqua lega uno ione $\\mathrm{H^+}$?", a: '1', wrong: ['2', '3', '0'], why: "L'ossigeno usa una delle sue due coppie solitarie per legare lo ione: un solo legame dativo, e si forma $\\mathrm{H_3O^+}$." },
];

function level5(rng: Rng): BuiltE {
	const k = rng.int(0, FACTS.length - 1);
	const f = FACTS[k];
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(f.q),
		solution: t(f.a),
		steps: [textBlock(f.why)],
		answer: choose(rng, textOpt(f.a), f.wrong.map((x) => textOpt(x))),
		params: { case: 'fatto', k },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => BuiltE> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

export const chimLegameCovalentePolare: Generator = {
	id: ID,
	title: 'Legame covalente polare e legame dativo',
	levels: {
		1: { label: 'La differenza di elettronegatività', constraints: ['il valore maggiore meno il minore, due decimali'] },
		2: { label: 'Il tipo di legame', constraints: ['soglie 0,4 e 1,9; coppie lontane dalle soglie e senza eccezioni'] },
		3: { label: 'Le cariche parziali', constraints: ['legami covalenti polari tra non metalli; delta meno sul più elettronegativo'] },
		4: { label: 'Il legame più polare', constraints: ['quattro legami covalenti con differenze distanti almeno 0,05'] },
		5: { label: 'Il legame dativo', constraints: ['fatti della lezione: donatore, accettore, ammonio, ossonio'] },
	},
	generate: generateE(ID, LEVELS),
	check: checkE,
	toChoice: toChoiceE,
};

export default chimLegameCovalentePolare;
