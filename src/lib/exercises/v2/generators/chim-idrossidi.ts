/**
 * Gli idrossidi. Spec: specs/exercises/chim-idrossidi.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/79-chim-idrossidi.md), each one step harder: the
 * oxidation number of the metal from the formula (a whole number, it can be typed); the formula from the metal and
 * its oxidation number, with the brackets; from the formula to the name; from the name to the formula; the hydroxide
 * that goes with a basic oxide. Names from v2/chim3-i.ts.
 */
import type { Generator, Rng } from '../types';
import {
	type Built, type Compound, type Metal, type Nomenclatura, METALS, PREFIX, ROMAN,
	basicOxide, cap, checkSample, choose, del, formulaQuestion, generateWith, hydroxide, il, nameQuestion, numberAnswer, signed, texOpt, textBlock, textOpt, threeNames, toChoice, wrongKey,
} from '../chim3-i';

export const ID = 'chim-idrossidi';

const pickHydroxide = (rng: Rng): [Metal, number, Compound] => {
	const m = rng.pick(METALS);
	const n = rng.pick(m.ox);
	return [m, n, hydroxide(m, n)];
};
const groups = (n: number) => (n === 1 ? 'un gruppo $\\mathrm{OH}$' : `$${n}$ gruppi $\\mathrm{OH}$`);
const oh = (sym: string, n: number) => (n === 1 ? `${sym}OH` : `${sym}(OH)${n}`);

function suffixSentence(m: Metal, n: number): string {
	if (m.ox.length === 1) return `${cap(il(m.nome))} ha un solo numero di ossidazione: il nome non ha suffissi.`;
	return `${cap(il(m.nome))} ha ${m.ox.map((k) => `$${signed(k)}$`).join(' e ')}: $${signed(n)}$ è il più ${n === m.ox[0] ? 'basso, e il suffisso è -oso' : 'alto, e il suffisso è -ico'}.`;
}

/** Wrong formulas of a hydroxide: no brackets, the index on the metal, one group more or less, the oxide. */
function wrongHydroxides(m: Metal, n: number): [string, string][] {
	const s = m.sym;
	const other = m.ox.filter((k) => k !== n).map((k) => oh(s, k));
	const keys = n === 1 ? [...other, `${s}(OH)2`, `${s}2OH`, `${s}OH2`, `${s}2O`] : [...other, `${s}OH${n}`, `${s}${n}OH`, oh(s, n + 1), oh(s, n - 1), basicOxide(m, n).key];
	return keys.map(wrongKey);
}

// ---------------------------------------------------------------------------
// Level 1: the oxidation number of the metal

function level1(rng: Rng): Built {
	const [m, n, c] = pickHydroxide(rng);
	const { answer, wrong } = numberAnswer(n, n === 1 ? [2, -1, 0, 3] : [1, -n, n + 1, 2 * n, n - 1]);
	return {
		prompt: 'Trova il numero di ossidazione.',
		problem: textBlock(`Qual è il numero di ossidazione ${del(m.nome)} in $${c.tex}$?`),
		solution: signed(n),
		steps: [textBlock(`Ogni gruppo $\\mathrm{OH}$ vale $-1$, perché l'ossigeno ha $-2$ e l'idrogeno $+1$. ${n === 1 ? 'Il gruppo è uno solo' : `I gruppi sono $${n}$`}:`, 46, [`x + ${n === 1 ? '' : `${n} \\cdot `}(-1) = 0`]), `x = ${signed(n)}`],
		answer,
		params: { case: n === 1 ? 'un gruppo' : 'più gruppi', key: c.key, wrong },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the formula from the metal and its oxidation number

function level2(rng: Rng): Built {
	const [m, n, c] = pickHydroxide(rng);
	return {
		prompt: 'Scegli la formula del composto.',
		problem: textBlock(`In un idrossido ${il(m.nome)} ha numero di ossidazione $${signed(n)}$. Qual è la formula dell'idrossido?`),
		solution: c.tex,
		steps: [textBlock(`Ogni ione idrossido ha carica $-1$: per pareggiare $${signed(n)}$ ${n === 1 ? 'serve' : 'servono'} ${groups(n)}.`), textBlock(n === 1 ? `Con un solo gruppo le parentesi non si mettono: $${c.tex}$.` : `Il gruppo va tra parentesi, con l'indice $${n}$ fuori: $${c.tex}$.`)],
		answer: choose(rng, texOpt(c.tex, c.key), wrongHydroxides(m, n).map(([tex, key]) => texOpt(`\\mathrm{${tex}}`, key))),
		params: { case: n === 1 ? 'senza parentesi' : 'con parentesi', sym: m.sym, n },
	};
}

// ---------------------------------------------------------------------------
// Levels 3 and 4: names

/** The nomenclatures worth asking: not the IUPAC name when it is the traditional one again. */
function askable(m: Metal, c: Compound): Nomenclatura[] {
	if (m.ox.length > 1) return ['trad', 'stock', 'iupac'];
	return c.iupac === c.trad ? ['trad'] : ['trad', 'iupac'];
}

function wrongNames(m: Metal, n: number, which: Nomenclatura): string[] {
	if (which === 'trad') {
		if (m.ox.length === 1) return [`ossido di ${m.nome}`, `idruro di ${m.nome}`, `perossido di ${m.nome}`, `anidride di ${m.nome}`];
		const [mine, other] = n === m.ox[0] ? ['oso', 'ico'] : ['ico', 'oso'];
		return [`idrossido ${m.root}${other}`, `ossido ${m.root}${mine}`, `idruro ${m.root}${mine}`, `perossido di ${m.nome}`, `anidride ${m.root}${mine.replace(/o$/, 'a')}`];
	}
	if (which === 'stock') {
		const ns = [...m.ox.filter((k) => k !== n), n + 1, n - 1, n + 2, 2 * n, 6].filter((k) => k >= 1 && k <= 7 && k !== n);
		return [...new Set(ns)].map((k) => `idrossido di ${m.nome}(${ROMAN[k]})`);
	}
	return [`idrossido di ${PREFIX[n === 1 ? 2 : n]}${m.nome}`, `${PREFIX[n + 1]}idrossido di ${m.nome}`, n > 2 ? `${PREFIX[n - 1]}idrossido di ${m.nome}` : `${PREFIX[n + 2]}idrossido di ${m.nome}`, `${PREFIX[n === 1 ? 2 : n]}ossido di ${m.nome}`, `${PREFIX[n === 1 ? 2 : n]}idruro di ${m.nome}`];
}

function level3(rng: Rng): Built {
	const [m, n, c] = pickHydroxide(rng);
	const which = rng.pick(askable(m, c));
	return nameQuestion(rng, c, which, wrongNames(m, n, which), [`${n === 1 ? 'Il gruppo $\\mathrm{OH}$ è uno solo' : `I gruppi $\\mathrm{OH}$ sono $${n}$`}: ${il(m.nome)} ha numero di ossidazione $${signed(n)}$.`, suffixSentence(m, n), threeNames(c)], which);
}

function level4(rng: Rng): Built {
	const [m, n, c] = pickHydroxide(rng);
	const which = rng.pick(askable(m, c));
	const first = which === 'iupac' ? `Nel nome IUPAC il prefisso dice quanti sono i gruppi $\\mathrm{OH}$: ${n === 1 ? 'senza prefisso, uno solo' : `$${n}$`}.` : which === 'stock' && m.ox.length > 1 ? `Il numero romano dice il numero di ossidazione ${del(m.nome)}: $${signed(n)}$.` : `${suffixSentence(m, n)} Il numero di ossidazione è $${signed(n)}$.`;
	return formulaQuestion(rng, c, which, wrongHydroxides(m, n), [first, n === 1 ? `Serve un solo gruppo $\\mathrm{OH}$, senza parentesi: $${c.tex}$.` : `Servono ${groups(n)}, tra parentesi: $${c.tex}$.`], which);
}

// ---------------------------------------------------------------------------
// Level 5: from the basic oxide to the hydroxide

function level5(rng: Rng): Built {
	const [m, n, c] = pickHydroxide(rng);
	const ox = basicOxide(m, n);
	const [a, b] = ox.count;
	const sum = `In $${ox.tex}$ ${il(m.nome)} ha numero di ossidazione $${signed(n)}$, perché $${a === 1 ? '' : a}x + ${b === 1 ? '' : `${b} \\cdot `}(-2) = 0$.`;
	if (rng.next() < 0.5) {
		const s = m.sym;
		// the indices of the oxide carried over; then the usual wrong formulas
		const carried = [`${s}${a === 1 ? '' : a}(OH)${b === 1 ? 2 : b}`, `${s}${a === 1 ? 2 : a}OH`].filter((k) => k !== c.key).map(wrongKey);
		return {
			prompt: 'Scegli la formula del composto.',
			problem: textBlock(`Quale idrossido corrisponde all'ossido $${ox.tex}$?`),
			solution: c.tex,
			steps: [textBlock(sum), textBlock(`Passando dall'ossido all'idrossido il numero di ossidazione non cambia: ${n === 1 ? 'serve' : 'servono'} ${groups(n)}. La formula è $${c.tex}$.`)],
			answer: choose(rng, texOpt(c.tex, c.key), [...carried, ...wrongHydroxides(m, n)].map(([tex, key]) => texOpt(`\\mathrm{${tex}}`, key))),
			params: { case: 'dalla formula', sym: m.sym, n },
		};
	}
	const which: Nomenclatura = m.ox.length > 1 && rng.next() < 0.5 ? 'stock' : 'trad';
	const valid = new Set([c.trad, c.stock, c.iupac]);
	const right = c[which];
	return {
		prompt: 'Scegli il nome del composto.',
		problem: textBlock(`Quale idrossido corrisponde all'${ox[which]}?`),
		solution: `\\text{${right}}`,
		steps: [textBlock(`${cap(ox[which])} è $${ox.tex}$: ${il(m.nome)} ha numero di ossidazione $${signed(n)}$.`), textBlock(`L'idrossido ha lo stesso numero di ossidazione, quindi ${which === 'stock' ? 'lo stesso numero romano' : m.ox.length > 1 ? 'lo stesso aggettivo' : 'lo stesso nome del metallo'}: ${right}, $${c.tex}$.`)],
		answer: choose(rng, textOpt(right), wrongNames(m, n, which).filter((w) => !valid.has(w)).map((w) => textOpt(w))),
		params: { case: 'dal nome', sym: m.sym, n, which },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

export const chimIdrossidi: Generator = {
	id: ID,
	title: 'Gli idrossidi',
	levels: {
		1: { label: 'Il numero di ossidazione del metallo', constraints: ['è il numero dei gruppi OH'] },
		2: { label: 'Dal metallo alla formula', constraints: ['tanti gruppi OH quanto vale il numero di ossidazione, con le parentesi da due in su'] },
		3: { label: 'Dalla formula al nome', constraints: ['una delle tre nomenclature'] },
		4: { label: 'Dal nome alla formula', constraints: ['una delle tre nomenclature'] },
		5: { label: "Dall'ossido basico all'idrossido", constraints: ['il numero di ossidazione del metallo non cambia'] },
	},
	generate: generateWith(ID, LEVELS, checkSample),
	check: checkSample,
	toChoice,
};

export default chimIdrossidi;
