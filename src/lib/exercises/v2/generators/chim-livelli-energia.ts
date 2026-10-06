/**
 * Livelli e sottolivelli di energia. Spec: specs/exercises/chim-livelli-energia.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/50-chim-livelli-energia.md), each one step harder: the
 * jump in the successive ionisation energies (a pure number, also as an open answer); from the energies to the
 * element, its electrons level by level and its ion; how many electrons a level and a sublevel hold (a pure number);
 * which sublevels exist and their order of energy; the electrons of the first twenty elements level by level, with
 * 4s before 3d. The ionisation energies are IONIZATION of src/lib/exercises/v2/chim3-a.ts, the lesson's own.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { ELEMENTS } from '../chim-atomo';
import { shuffle } from '../insiemi';
import { type Built, IONIZATION, SUBLEVEL_CAPACITY, SUBLEVEL_ORDER, checkSample, choose, generateWith, intOpt, intTex, shells, textBlock, textOpt } from '../chim3-a';

export const ID = 'chim-livelli-energia';

/** The first `count` ionisation energies of Z as the text of a problem: $738$, $1451$, $7733$ e $10\,543$. */
function energies(z: number, count: number): string {
	const xs = IONIZATION[z - 1].slice(0, count).map((e) => `$${intTex(e)}$`);
	return `${xs.slice(0, -1).join(', ')} e ${xs.at(-1)}`;
}
/** The elements whose outer level has at most five electrons, among the first twenty: the list stays short. */
const SHORT = [3, 4, 5, 6, 7, 11, 12, 13, 14, 15, 19, 20];
const outer = (z: number) => shells(z).at(-1)!;
/** Electrons level by level as an option: 2, 8, 3. */
const shellOpt = (xs: number[]): ChoiceOption => ({ latex: xs.join(',\\ '), values: [xs.join(',')] });

// ---------------------------------------------------------------------------
// Level 1: where the jump is

function level1(rng: Rng): Built {
	const z = rng.pick(SHORT);
	const v = outer(z);
	const count = Math.min(z, v + rng.int(2, 3));
	const xs = IONIZATION[z - 1];
	return {
		prompt: 'Trova il salto.',
		problem: textBlock(`Le prime ${count === 3 ? 'tre' : count === 4 ? 'quattro' : count === 5 ? 'cinque' : count === 6 ? 'sei' : count === 7 ? 'sette' : 'otto'} energie di ionizzazione di un elemento sono, in $\\text{kJ/mol}$: ${energies(z, count)}. Quanti elettroni ha l'elemento nel livello più esterno?`),
		solution: String(v),
		steps: [
			textBlock(`Si confronta ogni energia con la precedente. Il rapporto più grande è tra la ${v}ª e la ${v + 1}ª: $${intTex(xs[v])} / ${intTex(xs[v - 1])} \\approx ${(xs[v] / xs[v - 1]).toFixed(1).replace('.', '{,}')}$.`),
			textBlock(`Lì si passa a un livello più interno: gli elettroni tolti prima del salto, cioè $${v}$, sono quelli del livello più esterno.`)
		],
		answer: choose(rng, intOpt(v), [intOpt(v + 1), intOpt(v === 1 ? 3 : v - 1), intOpt(count), intOpt(v + 2), intOpt(8)]),
		params: { case: 'salto', z, count },
		open: String(v)
	};
}

// ---------------------------------------------------------------------------
// Level 2: from the energies to the element, its levels, its ion

const PERIOD_START: Record<number, number> = { 2: 2, 3: 10, 4: 18 };
const ORDINAL: Record<number, string> = { 2: 'secondo', 3: 'terzo', 4: 'quarto' };

function level2(rng: Rng): Built {
	const kind = rng.pick(['elemento', 'disposizione', 'ione'] as const);
	if (kind === 'elemento') {
		const z = rng.pick(SHORT);
		const v = outer(z);
		const period = shells(z).length;
		const count = Math.min(z, v + 2);
		const sym = (k: number) => ({ latex: `\\mathrm{${ELEMENTS[k - 1].sym}}`, values: [ELEMENTS[k - 1].sym] });
		const start = PERIOD_START[period];
		const others = shuffle(rng, [z - 1, z + 1, z - 2, z + 2, z + 3].filter((k) => k > start && k <= start + (period === 4 ? 2 : 8) && k !== z));
		const fill = shuffle(rng, [z + 8, z - 8, z + 1, z + 2, z + 3, z + 4].filter((k) => k >= 3 && k <= 20 && k !== z));
		return {
			prompt: "Riconosci l'elemento.",
			problem: textBlock(`Un elemento del ${ORDINAL[period]} periodo ha queste prime energie di ionizzazione, in $\\text{kJ/mol}$: ${energies(z, count)}. Qual è l'elemento?`),
			solution: sym(z).latex,
			steps: [
				textBlock(`Il salto più grande è tra la ${v}ª e la ${v + 1}ª energia: nel livello più esterno ${thereAre(v)}.`),
				textBlock(`Nel ${ORDINAL[period]} periodo i livelli interni contengono $${start}$ elettroni: in tutto $${start} + ${v} = ${z}$ elettroni. L'elemento con $Z = ${z}$ è ${named(z).replace(/^./, (c) => c.toLowerCase())}.`)
			],
			answer: choose(rng, sym(z), [...others, ...fill].map(sym)),
			params: { case: kind, z, period, count }
		};
	}
	if (kind === 'disposizione') {
		const z = rng.pick(SHORT.filter((k) => k >= 5));
		const s = shells(z);
		const v = outer(z);
		const count = Math.min(z, v + 2);
		const inner = z - v;
		return {
			prompt: 'Trova la disposizione degli elettroni.',
			problem: textBlock(`${named(z)} ha $${z}$ elettroni. Le sue prime energie di ionizzazione, in $\\text{kJ/mol}$, sono: ${energies(z, count)}. Come sono disposti gli elettroni nei livelli, a partire dal nucleo?`),
			solution: shellOpt(s).latex,
			steps: [
				textBlock(`Il salto più grande è dopo la ${v}ª energia: nel livello più esterno ${thereAre(v)}.`),
				textBlock(`Gli altri $${inner}$ riempiono i livelli interni${s.length === 2 ? '' : s.length === 3 ? ', $2$ nel primo e $8$ nel secondo' : ', $2$ nel primo, $8$ nel secondo e $8$ nel terzo'}: la disposizione è $${s.join(',\\ ')}$.`)
			],
			answer: choose(rng, shellOpt(s), [shellOpt([...s].reverse()), shellOpt([...s.slice(0, -1), v + 1]), shellOpt(v > 1 ? [...s.slice(0, -1), v - 1] : [...s.slice(0, -2), s.at(-2)! + 1]), shellOpt([2, z - 2]), shellOpt([inner, v])]),
			params: { case: kind, z, count }
		};
	}
	const z = rng.pick([3, 4, 11, 12, 13, 19, 20]);
	const v = outer(z);
	const count = Math.min(z, v + 2);
	const ion = (q: number) => ({ latex: `\\mathrm{X^{${q === 1 ? '' : q}+}}`, values: [`${q}+`] });
	return {
		prompt: 'Trova lo ione.',
		problem: textBlock(`Un metallo, che indichiamo con $\\mathrm{X}$, ha queste prime energie di ionizzazione, in $\\text{kJ/mol}$: ${energies(z, count)}. Quale ione forma più facilmente?`),
		solution: ion(v).latex,
		steps: [
			textBlock(`Il salto più grande è tra la ${v}ª e la ${v + 1}ª energia: ${v === 1 ? 'il primo elettrone si toglie' : `i primi $${v}$ elettroni si tolgono`} con relativamente poca energia, il successivo costa molto di più.`),
			textBlock(`Il metallo perde $${v}$ ${v === 1 ? 'elettrone' : 'elettroni'} e si ferma lì: forma lo ione $${ion(v).latex}$.`)
		],
		answer: choose(rng, ion(v), [1, 2, 3, 4].filter((q) => q !== v).map(ion)),
		params: { case: kind, z, count }
	};
}

/** The element's name with its article, to open a sentence: "Il boro", "L'azoto", "Lo zolfo". */
const named = (z: number) => {
	const name = ELEMENTS[z - 1].nome;
	return /^[aeiou]/.test(name) ? `L'${name}` : name === 'zolfo' ? 'Lo zolfo' : `Il ${name}`;
};
/** "c'è $1$ elettrone", "ci sono $3$ elettroni". */
const thereAre = (v: number) => (v === 1 ? "c'è $1$ elettrone" : `ci sono $${v}$ elettroni`);

// ---------------------------------------------------------------------------
// Level 3: how many electrons (a pure number)

const KINDS = ['s', 'p', 'd', 'f'];

function level3(rng: Rng): Built {
	const kind = rng.pick(['livello', 'sottolivello', 'sottolivelli', 'somma'] as const);
	if (kind === 'livello') {
		const n = rng.int(1, 5);
		const right = 2 * n * n;
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(`Quanti elettroni può contenere al massimo il livello $n = ${n}$?`),
			solution: String(right),
			steps: [textBlock(`Il livello $n$ contiene al massimo $2n^2$ elettroni: $2 \\cdot ${n}^2 = ${right}$.`)],
			answer: choose(rng, intOpt(right), [intOpt(n * n), intOpt(2 * n), intOpt(right + 8), intOpt(8), intOpt(right + 2), intOpt(4 * n)]),
			params: { case: kind, n },
			open: String(right)
		};
	}
	if (kind === 'sottolivello') {
		const n = rng.int(1, 5);
		const l = rng.int(0, Math.min(3, n - 1));
		const right = SUBLEVEL_CAPACITY[KINDS[l]];
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(`Quanti elettroni può contenere al massimo il sottolivello $${n}${KINDS[l]}$?`),
			solution: String(right),
			steps: [textBlock(`La capienza dipende solo dal tipo di sottolivello: $2$ elettroni per un $s$, $6$ per un $p$, $10$ per un $d$, $14$ per un $f$. Il $${n}${KINDS[l]}$ ne contiene al massimo $${right}$.`)],
			answer: choose(rng, intOpt(right), [intOpt(2 * n * n), intOpt(right + 4), intOpt(right === 2 ? 8 : right - 4), intOpt(n), intOpt(18), intOpt(8)]),
			params: { case: kind, n, type: KINDS[l] },
			open: String(right)
		};
	}
	if (kind === 'sottolivelli') {
		const n = rng.int(1, 5);
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(`Quanti sottolivelli ha il livello $n = ${n}$?`),
			solution: String(n),
			steps: [textBlock(`Il livello $n$ ha $n$ sottolivelli: il livello $${n}$ ne ha $${n}$${n <= 4 ? ` ($${KINDS.slice(0, n).map((k) => `${n}${k}`).join('$, $')}$)` : ''}.`)],
			answer: choose(rng, intOpt(n), [intOpt(n + 1), intOpt(n * n), intOpt(2 * n * n), intOpt(2 * n), intOpt(n + 2), intOpt(n + 3)]),
			params: { case: kind, n },
			open: String(n)
		};
	}
	const n = rng.int(2, 5);
	const upTo = rng.int(1, Math.min(3, n - 1));
	const types = KINDS.slice(0, upTo + 1);
	const right = types.reduce((sum, k) => sum + SUBLEVEL_CAPACITY[k], 0);
	const names = types.map((k) => `$${n}${k}$`);
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(`Quanti elettroni possono contenere al massimo, in tutto, i sottolivelli ${names.slice(0, -1).join(', ')} e ${names.at(-1)}?`),
		solution: String(right),
		steps: [textBlock(`Si sommano le capienze: $${types.map((k) => SUBLEVEL_CAPACITY[k]).join(' + ')} = ${right}$.`)],
		answer: choose(rng, intOpt(right), [intOpt(2 * n * n === right ? right + 2 : 2 * n * n), intOpt(right + 4), intOpt(right - 2), intOpt(types.length * 2), intOpt(right + 10), intOpt(right + 6)]),
		params: { case: kind, n, types },
		open: String(right)
	};
}

// ---------------------------------------------------------------------------
// Level 4: which sublevels exist, and their order of energy

const sub = (name: string): ChoiceOption => ({ latex: name, values: [name] });
const exists = (name: string) => KINDS.indexOf(name[1]) < Number(name[0]);
const REAL = SUBLEVEL_ORDER.filter((s) => Number(s[0]) <= 5);
const FAKE = ['1p', '1d', '2d', '2f', '3f', '1f'];
/** Pairs where the level and the order of energy disagree, or agree: the lower one first. */
const PAIRS: [string, string][] = [['4s', '3d'], ['5s', '4d'], ['6s', '4f'], ['3p', '4s'], ['3d', '4p'], ['2p', '3s'], ['4p', '5s'], ['4d', '5p'], ['5p', '6s'], ['4f', '5d'], ['3s', '3p'], ['4s', '4p']];

function level4(rng: Rng): Built {
	const kind = rng.pick(['esiste', 'dopo', 'minore', 'ordine'] as const);
	if (kind === 'esiste') {
		const wantFake = rng.next() < 0.6;
		const right = rng.pick(wantFake ? FAKE : REAL);
		const others = shuffle(rng, wantFake ? REAL : FAKE).slice(0, 3);
		const n = Number(right[0]);
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(wantFake ? 'Quale di questi sottolivelli non esiste?' : 'Quale di questi sottolivelli esiste?'),
			solution: right,
			steps: [
				textBlock(
					wantFake
						? `Il livello $n$ ha solo $n$ sottolivelli, nell'ordine $s$, $p$, $d$, $f$. Il livello $${n}$ ne ha $${n}$: ${n === 1 ? 'solo $1s$' : n === 2 ? '$2s$ e $2p$' : '$3s$, $3p$ e $3d$'}. Il sottolivello $${right}$ non esiste.`
						: `Il livello $n$ ha solo $n$ sottolivelli, nell'ordine $s$, $p$, $d$, $f$: il primo $p$ è il $2p$, il primo $d$ è il $3d$, il primo $f$ è il $4f$. Tra questi esiste solo $${right}$.`
				)
			],
			answer: choose(rng, sub(right), others.map(sub)),
			params: { case: kind, wantFake }
		};
	}
	const SEQ = SUBLEVEL_ORDER.map((s) => `$${s}$`).slice(0, 12).join(', ');
	if (kind === 'dopo') {
		const i = rng.int(0, 9);
		const right = SUBLEVEL_ORDER[i + 1];
		const cur = SUBLEVEL_ORDER[i];
		const n = Number(cur[0]);
		const guesses = [`${n}${KINDS[KINDS.indexOf(cur[1]) + 1] ?? 's'}`, `${n + 1}s`, `${n + 1}${cur[1]}`, SUBLEVEL_ORDER[i + 2], i > 0 ? SUBLEVEL_ORDER[i - 1] : '3s', `${n}d`].filter((s) => s !== right && s !== cur && exists(s));
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(`In ordine di energia crescente, quale sottolivello viene subito dopo il $${cur}$?`),
			solution: right,
			steps: [textBlock(`L'ordine di energia dei sottolivelli è ${SEQ}, e così via. Dopo il $${cur}$ viene il $${right}$.`)],
			answer: choose(rng, sub(right), guesses.map(sub)),
			params: { case: kind, after: cur }
		};
	}
	if (kind === 'minore') {
		const [low, high] = rng.pick(PAIRS);
		const lower = rng.next() < 0.5;
		const right = lower ? low : high;
		const [a, b] = rng.next() < 0.5 ? [low, high] : [high, low];
		const opt = (s: string) => ({ latex: `\\text{il } ${s}`, values: [s] });
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(`In un atomo con molti elettroni, quale sottolivello ha l'energia più ${lower ? 'bassa' : 'alta'}: $${a}$ oppure $${b}$?`),
			solution: opt(right).latex,
			steps: [textBlock(`Nell'ordine di energia, ${SEQ}, il $${low}$ viene prima del $${high}$: ha l'energia più bassa. La risposta è il $${right}$.`)],
			answer: choose(rng, opt(right), [opt(lower ? high : low), textOpt('hanno la stessa energia', 'uguale'), textOpt('dipende dal livello', 'dipende')]),
			params: { case: kind, a, b, lower }
		};
	}
	const start = rng.int(0, 8);
	const window = SUBLEVEL_ORDER.slice(start, start + 4);
	const three = shuffle(rng, window).slice(0, 3);
	const right = [...three].sort((x, y) => SUBLEVEL_ORDER.indexOf(x) - SUBLEVEL_ORDER.indexOf(y));
	const opt = (xs: string[]) => ({ latex: xs.join(' < '), values: [xs.join('<')] });
	const byName = [...three].sort(); // by level, then by letter: the order of someone who ignores the overlap
	const [a, b, c] = right;
	return {
		prompt: 'Metti in ordine i sottolivelli.',
		problem: textBlock(`Metti in ordine di energia crescente i sottolivelli $${three[0]}$, $${three[1]}$ e $${three[2]}$.`),
		solution: opt(right).latex,
		steps: [textBlock(`L'ordine di energia dei sottolivelli è ${SEQ}, e così via. I tre sottolivelli vi compaiono in quest'ordine: $${right.join('$, $')}$.`)],
		answer: choose(rng, opt(right), [opt(byName), opt([c, b, a]), opt([b, a, c]), opt([a, c, b]), opt([c, a, b])]),
		params: { case: kind, three }
	};
}

// ---------------------------------------------------------------------------
// Level 5: the electrons of the first twenty elements, level by level

function level5(rng: Rng): Built {
	const kind = rng.pick(['disposizione', 'disposizione', 'esterno'] as const);
	const z = rng.next() < 0.45 ? rng.pick([19, 20]) : rng.int(3, 18);
	const s = shells(z);
	const why =
		z > 18
			? `I primi due livelli contengono $2$ e $8$ elettroni. Nel terzo si riempiono $3s$ e $3p$, con $2 + 6 = 8$ elettroni; poi il sottolivello con l'energia più bassa è il $4s$, non il $3d$: ${z === 19 ? "l'ultimo elettrone va" : 'gli ultimi due elettroni vanno'} nel quarto livello.`
			: z > 10
				? `I primi due livelli contengono $2$ e $8$ elettroni: ne restano $${z} - 10 = ${z - 10}$ per il terzo.`
				: `Il primo livello contiene $2$ elettroni: ne restano $${z} - 2 = ${z - 2}$ per il secondo.`;
	if (kind === 'disposizione') {
		// The mistakes: a level filled beyond its capacity (2, 8, 9 for potassium), the order reversed, one electron more or less outside.
		const full = z > 18 ? [2, 8, z - 10] : z > 10 ? [2, z - 2] : [z];
		const last = s.at(-1)!;
		const wrongs = [full, [...s].reverse(), [...s.slice(0, -1), last + 1], last > 1 ? [...s.slice(0, -1), last - 1] : [...s, 1], z > 8 ? [8, z - 8] : [1, z - 1]];
		return {
			prompt: 'Trova la disposizione degli elettroni.',
			problem: textBlock(`${named(z)} ha $${z}$ elettroni. Come sono disposti nei livelli di energia, a partire dal nucleo?`),
			solution: shellOpt(s).latex,
			steps: [textBlock(why), textBlock(`La disposizione è $${s.join(',\\ ')}$.`)],
			answer: choose(rng, shellOpt(s), wrongs.map(shellOpt)),
			params: { case: kind, z }
		};
	}
	const v = s.at(-1)!;
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(`${named(z)} ha $${z}$ elettroni. Quanti ne ha nel livello più esterno?`),
		solution: String(v),
		steps: [textBlock(why), textBlock(`La disposizione è $${s.join(',\\ ')}$: nel livello più esterno ${thereAre(v)}.`)],
		answer: choose(rng, intOpt(v), [intOpt(z > 18 ? z - 10 : v + 1), intOpt(v === 1 ? 2 : v - 1), intOpt(8 === v ? 2 : 8), intOpt(z), intOpt(v + 2), intOpt(s.length)]),
		params: { case: kind, z }
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkSample(sample);
}

export const chimLivelliEnergia: Generator = {
	id: ID,
	title: 'Livelli e sottolivelli di energia',
	levels: {
		1: { label: 'Il salto nelle energie di ionizzazione', constraints: ['elementi con al massimo 5 elettroni esterni; risposta: un numero'] },
		2: { label: "Dalle energie all'elemento", constraints: ["l'elemento dal periodo, la disposizione nei livelli, lo ione"] },
		3: { label: 'Quanti elettroni in un livello', constraints: ['2n², capienza dei sottolivelli; risposta: un numero'] },
		4: { label: 'Sottolivelli e ordine di energia', constraints: ['quali esistono, chi viene dopo, 4s prima di 3d'] },
		5: { label: 'Gli elettroni nei livelli', constraints: ['primi venti elementi; potassio e calcio quasi metà delle volte'] }
	},
	generate: generateWith(ID, LEVELS, check),
	// a level answered with a number keeps its four options in the sample
	toChoice: (sample) => {
		if (sample.answer.kind === 'choice') return sample.answer;
		if (!sample.choice) throw new Error(`${ID}: the sample has no multiple-choice form`);
		return sample.choice;
	},
	check
};

export default chimLivelliEnergia;
