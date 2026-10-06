/**
 * Gruppi, periodi e blocchi. Spec: specs/exercises/gruppi-periodi.md
 *
 * Five levels in the order of the lesson (docs/lezioni/chimica/riscritte/57-gruppi-periodi.md), each one step
 * harder: the structure of the table (how long a period is, which sublevels fill in it, which block a group is in);
 * the outer configuration of a main group, both ways; from a configuration to period and group in the s and p
 * blocks; the same in the d block, where the period is read on the s sublevel; from period and group back to the
 * configuration. Configurations are those of the periodic table of the site (src/lib/tools/elementi.json).
 */
import type { ChoiceOption, Generator, Rng } from '../types';
import { type Built, type El, type Sub, ELS, NOBLE, EL, again, art, at, cfgKey, cfgTex, checkSample, choose, di, generateWith, textBlock, textOpt, texOpt, toChoice } from '../chim3-b';

export const ID = 'gruppi-periodi';

const subList = (names: string[]) => names.map((n) => `$${n}$`).join(', ');
const listOpt = (names: string[]): ChoiceOption => texOpt(names.join(',\\ '), names.join(' '));

/** The sublevels that fill in a period, in order. */
function fills(n: number): string[] {
	return [`${n}s`, ...(n >= 6 ? [`${n - 2}f`] : []), ...(n >= 4 ? [`${n - 1}d`] : []), ...(n >= 2 ? [`${n}p`] : [])];
}
const LENGTH = [0, 2, 8, 8, 18, 18, 32, 32];
const blockOf = (g: number) => (g <= 2 ? 's' : g <= 12 ? 'd' : 'p');

// ---------------------------------------------------------------------------
// Level 1: the structure of the table

function level1(rng: Rng): Built {
	const kind = rng.pick(['lunghezza', 'sottolivelli', 'blocco', 'd', 'colonne'] as const);
	if (kind === 'lunghezza') {
		const n = rng.int(1, 6);
		const names = fills(n);
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(`Quanti elementi ha il periodo $${n}$ della tavola periodica?`),
			solution: String(LENGTH[n]),
			steps: [textBlock(`Nel periodo $${n}$ ${names.length === 1 ? 'si riempie il sottolivello' : 'si riempiono i sottolivelli'} ${subList(names)}: ${names.map((s) => `$${{ s: 2, p: 6, d: 10, f: 14 }[s[1] as 's']}$`).join(' + ')} ${names.length > 1 ? `= $${LENGTH[n]}$ ` : ''}elementi.`)],
			// the capacity of the level with the same number; the other lengths
			answer: choose(rng, texOpt(String(LENGTH[n]), String(LENGTH[n])), [2 * n * n, ...rng.pick([[8, 18, 32, 2, 10], [18, 8, 2, 32, 6]])].map((x) => texOpt(String(x), String(x)))),
			params: { case: kind, n }
		};
	}
	if (kind === 'sottolivelli') {
		const n = rng.int(2, 6);
		const right = fills(n);
		const wrong = [
			[`${n}s`, `${n}p`, `${n}d`], // every sublevel of the level
			...(n >= 4 ? [[`${n}s`, `${n}d`, `${n}p`]] : []), // the d of the same level
			...(n >= 6 ? [[`${n}s`, `${n - 1}d`, `${n}p`]] : []), // the f forgotten
			...(n >= 4 ? [[`${n}s`, `${n}p`]] : []), // no d at all
			[`${n}s`, `${n}p`, `${n + 1}s`],
			n >= 3 ? [`${n - 1}s`, `${n - 1}p`] : ['1s', '2s', '2p'],
			[`${n}s`]
		];
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(`Quali sottolivelli si riempiono lungo il periodo $${n}$, nell'ordine?`),
			solution: right.join(',\\ '),
			steps: [textBlock(`Un periodo comincia con il sottolivello $s$ del suo livello e finisce con il $p$. ${n >= 4 ? `In mezzo si riempi${n >= 6 ? 'ono' : 'e'} ${n >= 6 ? `il $${n - 2}f$ e ` : ''}il $${n - 1}d$, di ${n >= 6 ? 'livelli più interni' : 'un livello più interno'}.` : `Nel periodo $${n}$ non ci sono sottolivelli $d$ da riempire.`}`), right.join(',\\ ')],
			answer: choose(rng, listOpt(right), wrong.map(listOpt)),
			params: { case: kind, n }
		};
	}
	if (kind === 'blocco') {
		const g = rng.int(1, 18);
		const b = blockOf(g);
		const where = { s: 'I gruppi $1$ e $2$ formano il blocco $s$', d: 'I gruppi da $3$ a $12$ formano il blocco $d$', p: 'I gruppi da $13$ a $18$ formano il blocco $p$' }[b];
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(`In quale blocco della tavola periodica si trova il gruppo $${g}$?`),
			solution: `\\text{Blocco }${b}`,
			steps: [textBlock(`${where}.`)],
			answer: choose(rng, texOpt(`\\text{Blocco }${b}`, b), ['s', 'p', 'd', 'f'].map((x) => texOpt(`\\text{Blocco }${x}`, x))),
			params: { case: kind, g }
		};
	}
	if (kind === 'd') {
		const n = rng.int(4, 6);
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(`Quale sottolivello si riempie negli elementi del blocco $d$ del periodo $${n}$?`),
			solution: `${n - 1}d`,
			steps: [textBlock(`Nel blocco $d$ il sottolivello che si riempie appartiene al livello precedente a quello del periodo: nel periodo $${n}$ è il $${n - 1}d$.`)],
			answer: choose(rng, texOpt(`${n - 1}d`, `${n - 1}d`), [`${n}d`, `${n - 2}d`, `${n - 1}p`, `${n + 1}d`].map((x) => texOpt(x, x))),
			params: { case: kind, n }
		};
	}
	const b = rng.pick(['s', 'p', 'd', 'f']);
	const cols = { s: 2, p: 6, d: 10, f: 14 }[b]!;
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(`Quante colonne occupa il blocco $${b}$ della tavola periodica?`),
		solution: String(cols),
		steps: [textBlock(`Un blocco è largo quanti sono gli elettroni che il suo sottolivello può contenere: un sottolivello $${b}$ ne contiene al massimo $${cols}$.`)],
		answer: choose(rng, texOpt(String(cols), String(cols)), [2, 6, 10, 14, 8, 18, cols / 2].map((x) => texOpt(String(x), String(x)))),
		params: { case: 'colonne', b }
	};
}

// ---------------------------------------------------------------------------
// Level 2: the outer configuration of a main group

const MAIN = [1, 2, 13, 14, 15, 16, 17, 18];
const ROMAN: Record<number, string> = { 1: 'IA', 2: 'IIA', 13: 'IIIA', 14: 'IVA', 15: 'VA', 16: 'VIA', 17: 'VIIA', 18: 'VIIIA' };
/** ns^2 np^3 for the group; the key is "s2 p3". */
function outerOf(s: number, p: number): ChoiceOption | null {
	if (s < 1 || s > 2 || p < 0 || p > 6) return null;
	return texOpt(`ns^${s}${p ? `\\,np^${p}` : ''}`, `s${s} p${p}`);
}
const outerGroup = (g: number): [number, number] => (g <= 2 ? [g, 0] : [2, g - 12]);

function level2(rng: Rng): Built {
	const g = rng.pick(MAIN);
	const [s, p] = outerGroup(g);
	const right = outerOf(s, p)!;
	if (rng.next() < 0.5) {
		// from the group to the configuration
		const others = [outerOf(2, g - 10), outerOf(2, p + 1), outerOf(2, p - 1), outerOf(1, p), outerOf(2, p + 2), outerOf(1, p + 1), outerOf(2, 6), outerOf(1, 0)];
		return {
			prompt: 'Scegli la configurazione esterna.',
			problem: textBlock(`Qual è la configurazione esterna degli elementi del gruppo $${g}$?`),
			solution: right.latex,
			steps: [
				textBlock(g <= 2 ? `Il gruppo $${g}$ è nel blocco $s$: gli elettroni del sottolivello $ns$ sono $${g}$.` : `Il gruppo $${g}$ è nel blocco $p$: il sottolivello $ns$ è pieno, e nel $np$ ci sono $${g} - 12 = ${p}$ ${p === 1 ? 'elettrone' : 'elettroni'}.`),
				right.latex
			],
			answer: choose(rng, right, others),
			params: { case: 'dal-gruppo', g }
		};
	}
	const n = (x: number) => (x >= 1 && x <= 18 ? texOpt(String(x), String(x)) : null);
	return {
		prompt: 'Trova il gruppo.',
		problem: textBlock(`A quale gruppo appartengono gli elementi con configurazione esterna $${right.latex}$?`),
		solution: String(g),
		steps: [
			textBlock(g <= 2 ? `L'ultimo sottolivello è un $s$ con $${g}$ ${g === 1 ? 'elettrone' : 'elettroni'}: blocco $s$, gruppo $${g}$.` : `L'ultimo sottolivello è un $p$ con $${p}$ ${p === 1 ? 'elettrone' : 'elettroni'}: blocco $p$, gruppo $12 + ${p} = ${g}$.`),
			textBlock(`Nella numerazione tradizionale è il gruppo ${ROMAN[g]}.`)
		],
		// the p electrons alone; s and p together (the traditional number); ten more than the p electrons
		answer: choose(rng, n(g)!, [n(p), n(s + p), n(10 + p), n(g + 1), n(g - 1), n(12 + s + p), n(3), n(8)]),
		params: { case: 'dalla-configurazione', g }
	};
}

// ---------------------------------------------------------------------------
// Levels 3 and 4: from the configuration to the place

const posOpt = (period: number, group: number): ChoiceOption | null => (period < 1 || period > 7 || group < 1 || group > 18 ? null : textOpt(`Periodo ${period}, gruppo ${group}`, `${period}:${group}`));

const SP = ELS.filter((e) => e.period >= 2 && e.period <= 5 && e.group !== null && (e.group <= 2 || e.group >= 13));
const D_BLOCK = [...ELS.filter((e) => e.period === 4 && e.block === 'd'), EL.Y, EL.Zr, EL.Tc, EL.Cd];

function level3(rng: Rng): Built {
	const el = rng.pick(SP);
	const n = el.period;
	const g = el.group!;
	const s = el.outer.find(([name]) => name === `${n}s`)?.[1] ?? 0;
	const p = el.outer.find(([name]) => name === `${n}p`)?.[1] ?? 0;
	const cfg = cfgTex(el.outer, el.core);
	const block = g <= 2 ? 's' : 'p';
	return {
		prompt: 'Trova periodo e gruppo.',
		problem: textBlock(`Un elemento ha configurazione $${cfg}$. In quale periodo e in quale gruppo si trova?`),
		solution: `\\text{Periodo ${n}, gruppo ${g}}`,
		steps: [
			textBlock(`Il valore più grande di $n$ è $${n}$: periodo $${n}$.`),
			textBlock(block === 's' ? `L'ultimo sottolivello è il $${n}s$, con $${s}$ ${s === 1 ? 'elettrone' : 'elettroni'}: blocco $s$, gruppo $${g}$.` : `L'ultimo sottolivello è il $${n}p$, con $${p}$ ${p === 1 ? 'elettrone' : 'elettroni'}: blocco $p$, gruppo $12 + ${p} = ${g}$.`),
			textBlock(`È ${art(el.name)}.`)
		],
		// the p electrons as the group; s and p together; ten more than the p electrons; the period one off
		answer: choose(rng, posOpt(n, g)!, block === 'p' ? [posOpt(n, p), posOpt(n, s + p), posOpt(n, 10 + p), posOpt(n - 1, g), posOpt(n + 1, g), posOpt(n, g + 1)] : [posOpt(n - 1, g), posOpt(n, g + 10), posOpt(n + 1, g), posOpt(g, n), posOpt(n, g === 1 ? 2 : 1), posOpt(n - 1, g + 10)]),
		params: { case: block, sym: el.sym }
	};
}

function level4(rng: Rng): Built {
	const el = rng.pick(D_BLOCK);
	const n = el.period;
	const g = el.group!;
	const s = el.outer[0][1];
	const d = el.outer[1][1];
	const cfg = cfgTex(el.outer, el.core);
	return {
		prompt: 'Trova periodo e gruppo.',
		problem: textBlock(`Un elemento ha configurazione $${cfg}$. In quale periodo e in quale gruppo si trova?`),
		solution: `\\text{Periodo ${n}, gruppo ${g}}`,
		steps: [
			textBlock(`Il valore più grande di $n$ è $${n}$, quello del $${n}s$: periodo $${n}$.`),
			textBlock(`L'ultimo sottolivello è il $${n - 1}d$: blocco $d$. Il gruppo è la somma degli elettroni di $${n}s$ e $${n - 1}d$: $${s} + ${d} = ${g}$.`),
			textBlock(`È ${art(el.name)}.`)
		],
		// the period read on the d; the d electrons alone as the group; both mistakes; twelve more, as in the p block
		answer: choose(rng, posOpt(n, g)!, [posOpt(n - 1, g), posOpt(n, d), posOpt(n - 1, d), posOpt(n, 12 + d), posOpt(n, 10 + d), posOpt(n, g + 1), posOpt(n, g - 1), posOpt(n + 1, g)]),
		params: { case: 'd', sym: el.sym }
	};
}

// ---------------------------------------------------------------------------
// Level 5: from the place to the configuration

/** The elements whose real configuration is the one the lesson's procedure gives: periods 2 to 5, no exceptions. */
const REGULAR = ELS.filter((e) => e.period >= 2 && e.period <= 5 && e.group !== null && ![24, 29, 41, 42, 44, 45, 46, 47].includes(e.z));

const shortOpt = (outer: Sub[], core: string): ChoiceOption | null => (outer.some(([name, k]) => k < 1 || k > { s: 2, p: 6, d: 10, f: 14 }[name[1] as 's']) ? null : texOpt(cfgTex(outer, core), `${core}+${cfgKey(outer)}`));

function level5(rng: Rng): Built {
	// the three blocks about as often
	const block = rng.pick(['s', 'p', 'p', 'd', 'd']);
	const el: El = rng.pick(REGULAR.filter((e) => e.block === block));
	const n = el.period;
	const g = el.group!;
	const core = el.core!;
	if (at(n, g) !== el) again();
	const right = shortOpt(el.outer, core)!;
	const next = NOBLE[n - 1];
	const others: (ChoiceOption | null)[] = [];
	let how: string;
	if (block === 's') {
		how = `Il gruppo $${g}$ è nel blocco $s$: nel $${n}s$ ci sono $${g}$ ${g === 1 ? 'elettrone' : 'elettroni'}.`;
		// the noble gas of the same period; the level one off; a p instead of the s; the other group
		others.push(shortOpt(el.outer, next), shortOpt([[`${n - 1}s`, g]], core), shortOpt([[`${n}p`, g]], core), shortOpt([[`${n}s`, 3 - g]], core), shortOpt([[`${n + 1}s`, g]], core));
	} else if (block === 'p') {
		const p = g - 12;
		const d: Sub[] = n >= 4 ? [[`${n - 1}d`, 10]] : [];
		how = `Il gruppo $${g}$ è nel blocco $p$: il $${n}s$ è pieno${n >= 4 ? `, il $${n - 1}d$ anche,` : ''} e nel $${n}p$ ci sono $${g} - 12 = ${p}$ ${p === 1 ? 'elettrone' : 'elettroni'}.`;
		// the full d forgotten; ten subtracted instead of twelve; the group's last digit; the gas of the same period
		others.push(n >= 4 ? shortOpt([[`${n}s`, 2], [`${n}p`, p]], core) : null, shortOpt([[`${n}s`, 2], ...d, [`${n}p`, g - 10]], core), shortOpt([[`${n}s`, 2], ...d, [`${n}p`, p + 1]], core), shortOpt([[`${n}s`, 2], ...d, [`${n}p`, p - 1]], core), shortOpt(el.outer, next), n >= 4 ? shortOpt([[`${n}s`, 2], [`${n}d`, 10], [`${n}p`, p]], core) : null);
	} else {
		const d = g - 2;
		how = `Il gruppo $${g}$ è nel blocco $d$: il $${n}s$ è pieno e nel $${n - 1}d$ ci sono $${g} - 2 = ${d}$ ${d === 1 ? 'elettrone' : 'elettroni'}.`;
		// the 2 not subtracted; the d of the same level; one off; the gas of the same period
		others.push(shortOpt([[`${n}s`, 2], [`${n - 1}d`, g]], core), shortOpt([[`${n}s`, 2], [`${n}d`, d]], core), shortOpt([[`${n}s`, 2], [`${n - 1}d`, d + 1]], core), shortOpt([[`${n}s`, 2], [`${n - 1}d`, d - 1]], core), shortOpt(el.outer, next), shortOpt([[`${n - 1}d`, g]], core));
	}
	return {
		prompt: 'Scrivi la configurazione.',
		problem: textBlock(`Qual è la configurazione elettronica dell'elemento del periodo $${n}$ e del gruppo $${g}$?`),
		solution: right.latex,
		steps: [textBlock(`Il gas nobile che chiude il periodo $${n - 1}$ è $\\mathrm{${core}}$: va tra parentesi quadre.`), textBlock(how), right.latex, textBlock(`È la configurazione ${di(el.name)}.`)],
		answer: choose(rng, right, others),
		params: { case: block, n, g }
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

export const gruppiPeriodi: Generator = {
	id: ID,
	title: 'Gruppi, periodi e blocchi',
	levels: {
		1: { label: 'Periodi, gruppi e blocchi', constraints: ['lunghezza dei periodi, sottolivelli che si riempiono, blocco di un gruppo'] },
		2: { label: 'La configurazione esterna di un gruppo', constraints: ['gruppi principali', 'dal gruppo alla configurazione e ritorno, metà e metà'] },
		3: { label: 'Dalla configurazione alla posizione: blocchi s e p', constraints: ['periodi da 2 a 5', 'gruppi 1, 2 e da 13 a 18'] },
		4: { label: 'Dalla configurazione alla posizione: blocco d', constraints: ['quarto periodo, più ittrio, zirconio, tecnezio e cadmio'] },
		5: { label: 'Dalla posizione alla configurazione', constraints: ['periodi da 2 a 5', 'senza le eccezioni alla regola della diagonale'] }
	},
	generate: generateWith(ID, LEVELS, checkSample),
	check: checkSample,
	toChoice
};

export default gruppiPeriodi;
