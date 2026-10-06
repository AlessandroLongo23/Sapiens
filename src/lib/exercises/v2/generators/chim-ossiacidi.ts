/**
 * Gli ossiacidi. Spec: specs/exercises/chim-ossiacidi.md
 *
 * Five levels in the order of the lesson (docs/lezioni/chimica/riscritte/80-chim-ossiacidi.md), each one step harder:
 * the oxidation number of the non-metal from the formula; from the formula to the traditional name; from the
 * traditional name to the formula; the IUPAC name in both directions; the acids with meta-, piro- and orto-.
 * Formulas and names from the tables of src/lib/exercises/v2/chim3-j.ts, the same the lesson's figures read.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { type Built, checkChoice, choose, generateWith, textBlock, textOpt, texOpt } from '../chim-atomo';
import { FAMILIES, OXOACIDS, PREFIX, ROMAN, SIMPLE, acidIupac, acidTex, acidTrad, mathrm, osso, type Oxoacid } from '../chim3-j';

export const ID = 'chim-ossiacidi';

const shuffled = <T,>(rng: Rng, xs: T[]) => xs.map((x) => ({ x, k: rng.next() })).sort((a, b) => a.k - b.k).map((o) => o.x);
const idx = (n: number) => (n === 1 ? '' : `_${n}`);
const hxo = (h: number, x: string, nX: number, o: number) => `H${idx(h)}${x}${idx(nX)}O${idx(o)}`;
const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`);
const noOpt = (n: number) => texOpt(signed(n), `${n}`);
const formulaOpt = (tex: string) => texOpt(mathrm(tex), tex);

/** "dello zolfo", "dell'azoto", "del cloro", "dello iodio" */
function di(elemento: string) {
	if (elemento === 'iodio' || /^(z|s[^aeiou])/.test(elemento)) return `dello ${elemento}`;
	if (/^[aeiou]/.test(elemento)) return `dell'${elemento}`;
	return `del ${elemento}`;
}

/** The acids of one element among the seventeen of the lesson's tables. */
const siblings = (a: Oxoacid) => OXOACIDS.filter((b) => b.x === a.x && b !== a);

const noSteps = (a: Oxoacid) => [
	textBlock(`L'idrogeno ha numero di ossidazione $+1$, l'ossigeno $-2$, e la somma su tutti gli atomi è zero.`),
	a.nX === 1 ? `${a.h} \\cdot (+1) + x + ${a.o} \\cdot (-2) = 0` : `${a.h} \\cdot (+1) + ${a.nX}x + ${a.o} \\cdot (-2) = 0`,
	a.nX === 1 ? `x = ${2 * a.o} - ${a.h} = ${signed(a.no)}` : `x = (${2 * a.o} - ${a.h}) : ${a.nX} = ${signed(a.no)}`,
];

// ---------------------------------------------------------------------------
// Level 1: the oxidation number of the non-metal

function level1(rng: Rng): Built {
	const a = rng.pick(OXOACIDS);
	// oxygen counted once; hydrogen forgotten; hydrogen added; the sign lost; the index of oxygen
	const wrong = shuffled(rng, [2 * a.o, 2 * a.o + a.h, a.o - a.h, -a.no, a.o, a.no + 2, a.no - 2].filter((n) => n !== a.no && n !== 0 && Math.abs(n) <= 9));
	return {
		prompt: 'Calcola il numero di ossidazione.',
		problem: textBlock(`Quanto vale il numero di ossidazione ${di(a.elemento)} in $${mathrm(acidTex(a))}$?`),
		solution: signed(a.no),
		steps: noSteps(a),
		answer: choose(rng, noOpt(a.no), wrong.map(noOpt)),
		params: { case: 'no', acid: acidTex(a) },
	};
}

// ---------------------------------------------------------------------------
// Level 2: from the formula to the traditional name

/** The names a student may give to an acid of this element: every prefix and suffix, and the hydracid's -idrico. */
function tradVariants(a: Oxoacid): string[] {
	const r = a.root;
	const hydr = SIMPLE.find((s) => s.elemento === a.elemento);
	const out = [`acido ipo${r}oso`, `acido ${r}oso`, `acido ${r}ico`, `acido per${r}ico`];
	if (hydr) out.push(hydr.acid);
	return out;
}

const whyTrad = (a: Oxoacid) => {
	const all = [...new Set(OXOACIDS.filter((b) => b.x === a.x).map((b) => b.no))].sort((p, q) => p - q);
	const list = all.map((n) => `$${signed(n)}$`).join(', ');
	const where =
		all.length === 1
			? `Negli ossiacidi ${di(a.elemento)} c'è un solo numero di ossidazione, e il suffisso è -ico.`
			: `Negli ossiacidi ${di(a.elemento)} i numeri di ossidazione sono ${list}: a $${signed(a.no)}$ corrisponde l'${acidTrad(a)}.`;
	return textBlock(where);
};

function level2(rng: Rng): Built {
	const a = rng.pick(OXOACIDS);
	const right = acidTrad(a);
	const wrong = shuffled(rng, tradVariants(a).filter((n) => n !== right));
	return {
		prompt: "Dai il nome tradizionale all'acido.",
		problem: textBlock(`Che nome tradizionale ha $${mathrm(acidTex(a))}$?`),
		solution: textOpt(right).latex,
		steps: [...noSteps(a), whyTrad(a)],
		answer: choose(rng, textOpt(right), wrong.map((n) => textOpt(n))),
		params: { case: 'nome', acid: acidTex(a) },
	};
}

// ---------------------------------------------------------------------------
// Level 3: from the traditional name to the formula

/** The sum of the atoms of one oxide and its water, before any simplification. */
function rawSum(a: Oxoacid): string {
	const m = /^[A-Z][a-z]?(?:_(\d))?O(?:_(\d))?$/.exec(a.oxide)!;
	return hxo(2 * a.water, a.x, Number(m[1] ?? 1), Number(m[2] ?? 1) + a.water);
}

const waterTex = (n: number) => (n === 1 ? '\\mathrm{H_2O}' : `${n}\\,\\mathrm{H_2O}`);

function buildSteps(a: Oxoacid): string[] {
	const raw = rawSum(a);
	const eq = `${mathrm(a.oxide)} + ${waterTex(a.water)} \\longrightarrow ${raw === acidTex(a) ? mathrm(acidTex(a)) : `${mathrm(raw)} \\longrightarrow ${a.made}\\,${mathrm(acidTex(a))}`}`;
	return [
		textBlock(`Nell'${acidTrad(a)} il numero di ossidazione ${di(a.elemento)} è $${signed(a.no)}$: l'anidride è $${mathrm(a.oxide)}$.`),
		eq,
		textBlock(raw === acidTex(a) ? 'Gli indici non sono tutti divisibili per uno stesso numero: la formula resta così.' : `Tutti gli indici sono divisibili per $${a.made}$, e la formula si semplifica.`),
	];
}

function formulaWrong(a: Oxoacid): string[] {
	const out = siblings(a).map(acidTex);
	const raw = rawSum(a);
	if (raw !== acidTex(a)) out.push(raw);
	out.push(a.oxide);
	out.push(hxo(a.h === 1 ? 2 : a.h - 1, a.x, a.nX, a.o)); // one hydrogen more or fewer
	out.push(hxo(a.h, a.x, a.nX, a.o + 1));
	if (a.o > 1) out.push(hxo(a.h, a.x, a.nX, a.o - 1));
	const hydr = SIMPLE.find((s) => s.elemento === a.elemento);
	if (hydr) out.push(hydr.acidTex);
	return out;
}

/** The acids made with one molecule of water: the orthophosphoric acid, with three, is of level 5. */
const ONE_WATER = OXOACIDS.filter((a) => a.water === 1);

function level3(rng: Rng): Built {
	const a = rng.pick(ONE_WATER);
	const sib = shuffled(rng, siblings(a).map(acidTex));
	const rest = shuffled(rng, formulaWrong(a).filter((x) => !sib.includes(x)));
	// one acid of the same element first, when there is one: -oso and -ico swapped is the mistake to catch
	const wrong = [...sib.slice(0, 1), ...shuffled(rng, [...sib.slice(1), ...rest])];
	return {
		prompt: "Scrivi la formula dell'acido.",
		problem: textBlock(`Qual è la formula dell'${acidTrad(a)}?`),
		solution: mathrm(acidTex(a)),
		steps: buildSteps(a),
		answer: choose(rng, formulaOpt(acidTex(a)), wrong.map(formulaOpt)),
		params: { case: 'formula', name: acidTrad(a) },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the IUPAC name

const iupacName = (o: number, nX: number, root: string, suffix: string, no: number) => `acido ${osso(o)}${PREFIX[nX]}${root}${suffix}(${ROMAN[no]})`;

function iupacSteps(a: Oxoacid): string[] {
	return [
		textBlock(`Gli atomi di ossigeno sono $${a.o}$: il prefisso è ${osso(a.o)}.`),
		a.nX === 1 ? `x = ${2 * a.o} - ${a.h} = ${signed(a.no)}` : `x = (${2 * a.o} - ${a.h}) : ${a.nX} = ${signed(a.no)}`,
		textBlock(`Il suffisso è sempre -ico, e il numero di ossidazione va in numeri romani: ${acidIupac(a)}.`),
	];
}

function level4(rng: Rng): Built {
	const a = rng.pick(OXOACIDS);
	if (rng.next() < 0.5) {
		const others = [1, 2, 3, 4, 5, 6, 7].filter((n) => n !== a.no);
		// the Roman numeral that counts the oxygens or the hydrogens; another oxidation number; -oso; the wrong prefix
		const wrong = shuffled(rng, [
			...(a.o !== a.no ? [iupacName(a.o, a.nX, a.root, 'ico', a.o)] : []),
			iupacName(a.o, a.nX, a.root, 'ico', rng.pick(others)),
			iupacName(a.o, a.nX, a.root, 'oso', a.no),
			iupacName(a.o === 4 ? 3 : a.o + 1, a.nX, a.root, 'ico', a.no),
			...(a.o > 1 ? [iupacName(a.o - 1, a.nX, a.root, 'ico', a.no)] : []),
		]);
		return {
			prompt: "Dai il nome IUPAC all'acido.",
			problem: textBlock(`Che nome IUPAC ha $${mathrm(acidTex(a))}$?`),
			solution: textOpt(acidIupac(a)).latex,
			steps: iupacSteps(a),
			answer: choose(rng, textOpt(acidIupac(a)), wrong.map((n) => textOpt(n))),
			params: { case: 'nome-iupac', acid: acidTex(a) },
		};
	}
	const wrong = shuffled(rng, [
		hxo(a.h === 1 ? 2 : a.h - 1, a.x, a.nX, a.o),
		hxo(a.h + 1, a.x, a.nX, a.o),
		hxo(a.h, a.x, a.nX, a.o + 1),
		...(a.o > 1 ? [hxo(a.h, a.x, a.nX, a.o - 1)] : []),
		...siblings(a).map(acidTex),
	]);
	return {
		prompt: "Scrivi la formula dell'acido.",
		problem: textBlock(`Qual è la formula dell'${acidIupac(a)}?`),
		solution: mathrm(acidTex(a)),
		steps: [
			textBlock(`Il prefisso ${osso(a.o)} dice $${a.o}$ ${a.o === 1 ? 'atomo' : 'atomi'} di ossigeno, che ${a.o === 1 ? 'vale' : 'valgono'} $${-2 * a.o}$; il numero romano dà $${signed(a.no)}$.`),
			`${-2 * a.o} + ${a.no} = ${a.no - 2 * a.o}`,
			textBlock(`Per arrivare a zero ${a.h === 1 ? 'serve $1$ atomo' : `servono $${a.h}$ atomi`} di idrogeno.`),
		],
		answer: choose(rng, formulaOpt(acidTex(a)), wrong.map(formulaOpt)),
		params: { case: 'formula-iupac', name: acidIupac(a) },
	};
}

// ---------------------------------------------------------------------------
// Level 5: meta-, piro-, orto-

const FAMILY_PREFIX = ['meta', 'piro', 'orto'] as const;

function familyNames(a: Oxoacid): string[] {
	const bare = a.trad.replace(/^(meta|piro|orto)/, '');
	const other = bare.endsWith('ico') ? `${bare.slice(0, -3)}oso` : `${bare.slice(0, -3)}ico`;
	return [...FAMILY_PREFIX.map((p) => `acido ${p}${bare}`), ...FAMILY_PREFIX.map((p) => `acido ${p}${other}`), `acido ipo${bare}`, `acido per${bare}`];
}

function level5(rng: Rng): Built {
	const a = rng.pick(FAMILIES);
	const kin = FAMILIES.filter((b) => b.x === a.x && b !== a);
	const water = `${a.water === 1 ? 'una molecola' : `${a.water} molecole`} d'acqua`;
	const why = textBlock(`Il prefisso ${a.family}- indica ${water} per ogni molecola di ${a.oxideName}, $${mathrm(a.oxide)}$.`);
	const raw = rawSum(a);
	const eq = `${mathrm(a.oxide)} + ${waterTex(a.water)} \\longrightarrow ${raw === acidTex(a) ? mathrm(acidTex(a)) : `${a.made}\\,${mathrm(acidTex(a))}`}`;
	const r = rng.next();
	if (r < 0.3) {
		const same = shuffled(rng, kin.filter((b) => b.no === a.no).map(acidTex));
		const rest = shuffled(rng, [...kin.filter((b) => b.no !== a.no).map(acidTex), hxo(a.h, a.x, a.nX, a.o + 1), hxo(a.h + 1, a.x, a.nX, a.o), ...(a.o > 2 ? [hxo(a.h, a.x, a.nX, a.o - 1)] : [])]);
		return {
			prompt: "Scrivi la formula dell'acido.",
			problem: textBlock(`Qual è la formula dell'${acidTrad(a)}?`),
			solution: mathrm(acidTex(a)),
			steps: [why, eq],
			answer: choose(rng, formulaOpt(acidTex(a)), [...same, ...rest].map(formulaOpt)),
			params: { case: 'famiglia-formula', name: acidTrad(a) },
		};
	}
	if (r < 0.6) {
		const right = acidTrad(a);
		const names = familyNames(a).filter((n) => n !== right);
		// the other prefixes with the same suffix first: they are the answers of who miscounts the water
		const wrong = [...shuffled(rng, names.slice(0, 2)), ...shuffled(rng, names.slice(2))];
		return {
			prompt: "Dai il nome tradizionale all'acido.",
			problem: textBlock(`Che nome tradizionale ha $${mathrm(acidTex(a))}$, con il prefisso che dice quanta acqua contiene?`),
			solution: textOpt(right).latex,
			steps: [...noSteps(a), eq, why],
			answer: choose(rng, textOpt(right), wrong.map((n) => textOpt(n))),
			params: { case: 'famiglia-nome', acid: acidTex(a) },
		};
	}
	if (r < 0.8) {
		const wrong = shuffled(rng, [1, 2, 3, 4, 5, 6].filter((n) => n !== a.water));
		const count = (n: number): ChoiceOption => texOpt(`${n}`, `${n}`);
		return {
			prompt: "Conta le molecole d'acqua.",
			problem: textBlock(`Quante molecole d'acqua si aggiungono a una molecola di ${a.oxideName}, $${mathrm(a.oxide)}$, per ottenere l'${acidTrad(a)}?`),
			solution: `${a.water}`,
			steps: [why, eq],
			answer: choose(rng, count(a.water), wrong.map(count)),
			params: { case: 'famiglia-acqua', name: acidTrad(a) },
		};
	}
	const wrong = shuffled(rng, [2 * a.o - a.h, 2 * a.o, a.no + 2, a.no - 2, a.no + 1, -a.no, a.h].filter((n) => n !== a.no && n !== 0 && Math.abs(n) <= 9));
	return {
		prompt: 'Calcola il numero di ossidazione.',
		problem: textBlock(`Quanto vale il numero di ossidazione ${di(a.elemento)} nell'${acidTrad(a)}, $${mathrm(acidTex(a))}$?`),
		solution: signed(a.no),
		steps: [...noSteps(a), textBlock('I prefissi meta-, piro- e orto- cambiano il numero di molecole di acqua, non il numero di ossidazione.')],
		answer: choose(rng, noOpt(a.no), wrong.map(noOpt)),
		params: { case: 'famiglia-no', acid: acidTex(a) },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkChoice(sample);
}

export const chimOssiacidi: Generator = {
	id: ID,
	title: 'Gli ossiacidi',
	levels: {
		1: { label: 'Il numero di ossidazione del non metallo', constraints: ['idrogeno +1, ossigeno −2, somma zero; un solo atomo di non metallo'] },
		2: { label: 'Dalla formula al nome tradizionale', constraints: ['i diciassette acidi delle tabelle; distrattori con gli altri prefissi e suffissi'] },
		3: { label: 'Dal nome tradizionale alla formula', constraints: ['anidride più acqua, con la semplificazione'] },
		4: { label: 'Il nome IUPAC', constraints: ['nei due sensi: prefisso dell’ossigeno, -ico, numero romano'] },
		5: { label: 'Meta, piro e orto', constraints: ['fosforo, boro e silicio: formula, nome, molecole d’acqua, numero di ossidazione'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimOssiacidi;
