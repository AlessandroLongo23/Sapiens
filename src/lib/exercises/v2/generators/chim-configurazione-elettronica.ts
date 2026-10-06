/**
 * La configurazione elettronica. Spec: specs/exercises/chim-configurazione-elettronica.md
 *
 * Six levels in the order of the lesson (docs/lezioni/chimica/riscritte/53-chim-configurazione-elettronica.md), each
 * one step harder: counting the electrons of a written configuration; writing the configuration up to 3p; past 3p,
 * where 4s comes before 3d; the unpaired electrons of a box diagram filled by Hund's rule; the abbreviated
 * configuration, with chromium and copper; the ions, where the transition metals lose the 4s electrons first.
 * Configurations are those of the periodic table of the site (src/lib/tools/elementi.json).
 */
import type { ChoiceOption, Generator, Rng } from '../types';
import {
	type Built,
	type El,
	type Sub,
	EL,
	abbreviate,
	art,
	byZ,
	cap,
	capacity,
	cfgKey,
	cfgLines,
	cfgTex,
	checkSample,
	choose,
	chooseNumber,
	di,
	diagonal,
	electrons,
	full,
	generateWith,
	ionTex,
	texOpt,
	textBlock,
	toChoice,
	unpairedIn
} from '../chim3-b';

export const ID = 'chim-configurazione-elettronica';

/** The two exceptions of the lesson. */
const EXCEPTIONS = [24, 29];

/** A configuration as an option on one or two lines; null when a sublevel holds more than it can or nothing is left. */
const fullOpt = (subs: Sub[]): ChoiceOption => texOpt(cfgLines(subs), cfgKey(subs));
const shortOpt = (subs: Sub[], core: string | null): ChoiceOption => texOpt(cfgTex(subs, core), cfgKey([...(core ? full(EL[core]) : []), ...subs]));

/** Electrons poured into the sublevels in a given order, each up to a given maximum. */
function pour(n: number, order: string[], max: (name: string) => number = capacity): Sub[] | null {
	const out: Sub[] = [];
	let left = n;
	for (const name of order) {
		if (left <= 0) break;
		const k = Math.min(left, max(name));
		out.push([name, k]);
		left -= k;
	}
	return left > 0 ? null : out;
}
const BY_LEVEL = ['1s', '2s', '2p', '3s', '3p', '3d', '4s', '4p', '4d', '5s', '5p'];
const DIAG = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p'];

const sumTex = (subs: Sub[]) => subs.map(([, k]) => k).join(' + ');

// ---------------------------------------------------------------------------
// Level 1: the electrons of a configuration

function level1(rng: Rng): Built {
	const el = byZ(rng.int(3, 20));
	const subs = full(el);
	const last = subs.at(-1)![1];
	return {
		prompt: 'Conta gli elettroni.',
		problem: textBlock('Quanti elettroni ha in tutto un atomo con questa configurazione elettronica?', 46, [cfgTex(subs)]),
		solution: String(el.z),
		steps: [textBlock('Il numero di elettroni è la somma degli esponenti.'), `${sumTex(subs)} = ${el.z}`, textBlock(`Un atomo neutro con $${el.z}$ elettroni ha $Z = ${el.z}$: è ${art(el.name)}.`)],
		// the number of sublevels; the last exponent; the 1s forgotten; the highest level
		answer: chooseNumber(rng, el.z, [subs.length, last, el.z - 2, Number(subs.at(-1)![0][0])], 1),
		number: el.z,
		params: { case: 'somma', z: el.z }
	};
}

// ---------------------------------------------------------------------------
// Level 2: the configuration up to 3p

function level2(rng: Rng): Built {
	const el = byZ(rng.int(3, 18));
	const subs = full(el);
	const [lastName, lastK] = subs.at(-1)!;
	const before = subs.slice(0, -1);
	const others: (ChoiceOption | null)[] = [];
	// p sublevels filled with eight electrons
	const p8 = pour(el.z, DIAG, (n) => (n[1] === 'p' ? 8 : capacity(n)));
	if (p8) others.push(fullOpt(p8));
	// the s sublevel of the last level skipped: 1s2 2s2 2p6 3p5
	if (lastName[1] === 'p') others.push(fullOpt([...before.slice(0, -1), [lastName, lastK + 2]]));
	// everything in the first sublevels, with no maximum for the last one written
	others.push(fullOpt([...before.slice(0, -1), [before.at(-1)?.[0] ?? '1s', (before.at(-1)?.[1] ?? 0) + lastK]]));
	// one electron more, one fewer
	others.push(fullOpt(diagonal(el.z + 1)), fullOpt(diagonal(el.z - 1)), fullOpt(diagonal(el.z + 2)));
	const done = electrons(before);
	return {
		prompt: 'Scrivi la configurazione elettronica.',
		problem: textBlock(`Qual è la configurazione elettronica ${di(el.name)} ($Z = ${el.z}$)?`),
		solution: cfgTex(subs),
		steps: [
			textBlock(`Gli elettroni sono $${el.z}$. Si riempiono i sottolivelli nell'ordine $1s$, $2s$, $2p$, $3s$, $3p$, con al massimo $2$ elettroni in un $s$ e $6$ in un $p$.`),
			...(before.length ? [textBlock(`I sottolivelli pieni contengono $${sumTex(before)}${before.length > 1 ? ` = ${done}` : ''}$ elettroni; ne ${el.z - done === 1 ? 'resta' : 'restano'} $${el.z - done}$ per il $${lastName}$.`)] : []),
			cfgTex(subs)
		],
		answer: choose(rng, fullOpt(subs), others),
		params: { case: 'fino-a-3p', z: el.z }
	};
}

// ---------------------------------------------------------------------------
// Level 3: past 3p, 4s before 3d

function level3(rng: Rng): Built {
	const z = rng.pick([19, 20, 21, 22, 23, 25, 26, 27, 28, 30, 31, 32, 33, 34, 35, 36]);
	const el = byZ(z);
	const subs = full(el);
	const others: (ChoiceOption | null)[] = [];
	// the third level filled before the fourth
	const byLevel = pour(z, BY_LEVEL);
	if (byLevel) others.push(fullOpt(byLevel));
	// no 3d at all
	const noD = pour(z, DIAG.filter((n) => n !== '3d'));
	if (noD && z <= 26) others.push(fullOpt(noD));
	// a d sublevel that holds six electrons, like a p
	const d6 = pour(z, DIAG, (n) => (n[1] === 'd' ? 6 : capacity(n)));
	if (d6) others.push(fullOpt(d6));
	// p sublevels with eight electrons
	const p8 = pour(z, DIAG, (n) => (n[1] === 'p' ? 8 : capacity(n)));
	if (p8) others.push(fullOpt(p8));
	others.push(fullOpt(diagonal(z + 1)), fullOpt(diagonal(z - 1)));
	const after = subs.slice(5);
	return {
		prompt: 'Scrivi la configurazione elettronica.',
		problem: textBlock(`Qual è la configurazione elettronica ${di(el.name)} ($Z = ${z}$)?`),
		solution: cfgLines(subs),
		steps: [
			textBlock(`Fino al $3p$ pieno gli elettroni sono $2 + 2 + 6 + 2 + 6 = 18$. Ne restano $${z} - 18 = ${z - 18}$.`),
			textBlock(`Dopo il $3p$ si riempie il $4s$, poi il $3d$, poi il $4p$: $${after.map(([n, k]) => `${k}$ nel $${n}`).join('$, $')}$.`),
			cfgLines(subs)
		],
		answer: choose(rng, fullOpt(subs), others),
		params: { case: 'oltre-3p', z }
	};
}

// ---------------------------------------------------------------------------
// Level 4: unpaired electrons

function level4(rng: Rng): Built {
	// more often an element with a sublevel half-way, where Hund's rule decides
	const open = Array.from({ length: 36 }, (_, i) => i + 1).filter((z) => !EXCEPTIONS.includes(z));
	const partial = open.filter((z) => {
		const [n, k] = full(byZ(z)).at(-1)!;
		return n[1] !== 's' && k < capacity(n);
	});
	const el = byZ(rng.next() < 0.75 ? rng.pick(partial) : rng.pick(open));
	const subs = full(el);
	const [name, k] = subs.at(-1)!;
	const boxes = capacity(name) / 2;
	const right = unpairedIn([name, k]);
	const how =
		k === capacity(name)
			? `Il $${name}$ è pieno: tutti gli elettroni sono appaiati.`
			: boxes === 1
				? `Nel $${name}$ c'è un solo elettrone, in una casella: è spaiato.`
				: k <= boxes
					? `Il $${name}$ ha $${boxes}$ caselle e $${k}$ ${k === 1 ? 'elettrone' : 'elettroni'}: per la regola di Hund ${k === 1 ? 'occupa una casella da solo' : 'vanno uno per casella'}.`
					: `Il $${name}$ ha $${boxes}$ caselle e $${k}$ elettroni: i primi $${boxes}$ vanno uno per casella, gli altri $${k - boxes}$ si appaiano. Restano $${boxes} - ${k - boxes} = ${right}$ caselle con un solo elettrone.`;
	return {
		prompt: 'Conta gli elettroni spaiati.',
		problem: textBlock(`${cap(art(el.name))} ha questa configurazione elettronica. Quanti elettroni spaiati ha nello stato fondamentale?`, 46, subs.length <= 6 ? [cfgTex(subs)] : [cfgTex(subs.slice(0, 5)), cfgTex(subs.slice(5))]),
		solution: String(right),
		steps: [...(subs.length > 1 ? [textBlock(`I sottolivelli prima del $${name}$ sono pieni: i loro elettroni sono tutti appaiati.`)] : []), textBlock(how), textBlock(`Elettroni spaiati: $${right}$.`)],
		// the electrons of the last sublevel; its boxes; its pairs; the empty places
		answer: chooseNumber(rng, right, [k, boxes, Math.floor(k / 2), capacity(name) - k, k % 2]),
		number: right,
		params: { case: k === capacity(name) || boxes === 1 ? 'semplice' : 'hund', z: el.z }
	};
}

// ---------------------------------------------------------------------------
// Level 5: the abbreviated configuration, with the exceptions

const L5_POOL = [...Array.from({ length: 28 }, (_, i) => i + 11), 49, 50, 51, 52, 53, 54];

function level5(rng: Rng): Built {
	const exception = rng.next() < 0.2;
	const el = byZ(exception ? rng.pick(EXCEPTIONS) : rng.pick(L5_POOL.filter((z) => !EXCEPTIONS.includes(z))));
	const z = el.z;
	const core = el.core!;
	const coreZ = EL[core].z;
	const rule = abbreviate(diagonal(z));
	const others: (ChoiceOption | null)[] = [];
	if (exception) {
		others.push(shortOpt(rule.outer, rule.core));
		// the electron moved the wrong way; the d before the s
		others.push(shortOpt([['4s', 2], ['3d', el.outer[1][1] - 2]], core));
		if (z - coreZ <= 10) others.push(shortOpt([['3d', z - coreZ]], core));
		others.push(shortOpt(abbreviate(diagonal(z + 1)).outer, core), shortOpt(abbreviate(diagonal(z - 1)).outer, core));
	} else {
		// the noble gas of the element's own period
		const next = EL[['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn'][el.period - 1]];
		if (next.z !== z) others.push(texOpt(cfgTex(el.outer, next.sym), `${next.sym}+${cfgKey(el.outer)}`));
		// the full d forgotten before the p
		if (el.block === 'p' && el.period >= 4) others.push(shortOpt(el.outer.filter(([n]) => n[1] !== 'd'), core));
		// the d before the s, with nothing in the s
		if (el.block === 'd' && z - coreZ <= 10) others.push(shortOpt([[`${el.period - 1}d`, z - coreZ]], core));
		// an exception that is not one: an s electron moved to the d
		if (el.block === 'd' && el.outer.length === 2 && el.outer[1][1] < 10) others.push(shortOpt([[el.outer[0][0], 1], [el.outer[1][0], el.outer[1][1] + 1]], core));
		const more = abbreviate(diagonal(z + 1));
		const less = abbreviate(diagonal(z - 1));
		if (more.core === core) others.push(shortOpt(more.outer, core));
		if (less.core === core && less.outer.length) others.push(shortOpt(less.outer, core));
		// the previous noble gas with the same sublevels
		const prev = ['He', 'Ne', 'Ar', 'Kr', 'Xe'][el.period - 3];
		if (prev) others.push(texOpt(cfgTex(el.outer, prev), `${prev}+${cfgKey(el.outer)}`));
	}
	const steps = [
		textBlock(`Il gas nobile che precede ${art(el.name)} è $\\mathrm{${core}}$, con $${coreZ}$ elettroni. Ne restano $${z} - ${coreZ} = ${z - coreZ}$, da mettere a partire dal $${el.period}s$.`),
		...(exception
			? [textBlock(`La regola della diagonale darebbe $${cfgTex(rule.outer, rule.core)}$, ma ${art(el.name)} è un'eccezione: un elettrone del $4s$ sta nel $3d$, che così è ${el.outer[1][1] === 5 ? 'pieno a metà' : 'pieno'}.`)]
			: []),
		cfgTex(el.outer, core)
	];
	return {
		prompt: 'Scrivi la configurazione abbreviata.',
		problem: textBlock(`Qual è la configurazione elettronica abbreviata ${di(el.name)} ($Z = ${z}$)?`),
		solution: cfgTex(el.outer, core),
		steps,
		answer: choose(rng, shortOpt(el.outer, core), others),
		params: { case: exception ? 'eccezione' : 'regola', z }
	};
}

// ---------------------------------------------------------------------------
// Level 6: the ions

/** [symbol, charge] */
const MAIN_IONS: [string, number][] = [['Li', 1], ['N', -3], ['O', -2], ['F', -1], ['Na', 1], ['Mg', 2], ['Al', 3], ['P', -3], ['S', -2], ['Cl', -1], ['K', 1], ['Ca', 2], ['Se', -2], ['Br', -1], ['Rb', 1], ['Sr', 2]];
const TRANSITION_IONS: [string, number][] = [['Sc', 3], ['Ti', 2], ['V', 2], ['V', 3], ['Cr', 2], ['Cr', 3], ['Mn', 2], ['Fe', 2], ['Fe', 3], ['Co', 2], ['Co', 3], ['Ni', 2], ['Cu', 1], ['Cu', 2], ['Zn', 2]];

/** The configuration of a cation of a transition metal of the fourth period: the 4s electrons leave first. */
function transitionIon(el: El, q: number): Sub[] {
	let s = el.outer[0][1];
	let d = el.outer[1][1];
	for (let i = 0; i < q; i++) {
		if (s > 0) s--;
		else d--;
	}
	return [...(s ? ([['4s', s]] as Sub[]) : []), ...(d ? ([['3d', d]] as Sub[]) : [])];
}

/** An ion's configuration as an option; with `whole` one that is a noble gas's is written as the gas alone. */
const ionOpt = (subs: Sub[], whole: boolean): ChoiceOption => {
	const a = abbreviate(subs, whole);
	return texOpt(cfgTex(a.outer, a.core), cfgKey(subs));
};

function level6(rng: Rng): Built {
	const transition = rng.next() < 0.5;
	const [sym, q] = rng.pick(transition ? TRANSITION_IONS : MAIN_IONS);
	const el = EL[sym];
	const atom = full(el);
	const n = el.z - q;
	const ion = ionTex(sym, q);
	const many = (k: number) => (k === 1 ? 'un elettrone' : `$${k}$ elettroni`);
	let right: ChoiceOption;
	let rightTex: string;
	const others: (ChoiceOption | null)[] = [];
	const steps: string[] = [];
	if (transition) {
		const outer = transitionIon(el, q);
		const subs = [...full(EL.Ar), ...outer];
		right = ionOpt(subs, true);
		rightTex = cfgTex(outer, 'Ar');
		const [s, d] = [el.outer[0][1], el.outer[1][1]];
		// taken from the 3d, the 4s left as it is
		if (d >= q) others.push(shortOpt([['4s', s], ...(d - q ? ([['3d', d - q]] as Sub[]) : [])], 'Ar'));
		// written again from the start with fewer electrons: the rule of the diagonal, and the real atom
		others.push(ionOpt(diagonal(n), true), ionOpt(full(byZ(n)), true));
		// the atom itself; electrons added
		others.push(ionOpt(atom, true), ionOpt(diagonal(el.z + q), true), ionOpt(diagonal(n - 1), true));
		const fromS = Math.min(q, s);
		steps.push(
			textBlock(`Lo ione $${ion}$ ha ${many(q)} in meno dell'atomo: $${el.z} - ${q} = ${n}$.`),
			textBlock(`In un metallo di transizione gli elettroni si tolgono prima dal $4s$, il livello più esterno, poi dal $3d$: ${fromS === q ? `${q === 1 ? 'esce' : 'escono'} ${many(q)} dal $4s$` : `${fromS === 1 ? 'esce' : 'escono'} ${many(fromS)} dal $4s$ e ${many(q - fromS)} dal $3d$`}.`)
		);
	} else {
		const subs = diagonal(n);
		const whole = q > 0;
		right = ionOpt(subs, whole);
		const a = abbreviate(subs, whole);
		rightTex = cfgTex(a.outer, a.core);
		// the charge read the wrong way; the atom; one electron off
		others.push(ionOpt(diagonal(el.z + q), whole), ionOpt(atom, whole), ionOpt(diagonal(n + (q > 0 ? 1 : -1)), whole), ionOpt(diagonal(n + (q > 0 ? -1 : 1)), whole), ionOpt(diagonal(el.z + 2 * q), whole));
		steps.push(
			q > 0
				? textBlock(`Lo ione $${ion}$ ha ${many(q)} in meno dell'atomo: $${el.z} - ${q} = ${n}$. Gli elettroni si tolgono dal livello più esterno.`)
				: textBlock(`Lo ione $${ion}$ ha ${many(-q)} in più dell'atomo: $${el.z} + ${-q} = ${n}$. Gli elettroni in più continuano l'ordine di riempimento.`)
		);
	}
	steps.push(rightTex);
	return {
		prompt: 'Scrivi la configurazione dello ione.',
		problem: textBlock(`L'atomo di ${el.name} ha configurazione $${cfgTex(el.outer, el.core)}$. Qual è la configurazione dello ione $${ion}$?`),
		solution: rightTex,
		steps,
		answer: choose(rng, right, others),
		params: { case: transition ? 'transizione' : 'principali', sym, q }
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

export const chimConfigurazioneElettronica: Generator = {
	id: ID,
	title: 'La configurazione elettronica',
	levels: {
		1: { label: 'Gli elettroni di una configurazione', constraints: ['Z da 3 a 20', 'somma degli esponenti'] },
		2: { label: 'La configurazione fino al 3p', constraints: ['Z da 3 a 18', 'configurazione completa'] },
		3: { label: 'Dopo il 3p: il 4s e il 3d', constraints: ['Z da 19 a 36, senza cromo e rame', 'configurazione completa su due righe'] },
		4: { label: 'Gli elettroni spaiati', constraints: ['Z da 1 a 36, senza cromo e rame', 'regola di Hund'] },
		5: { label: 'La configurazione abbreviata', constraints: ['Z da 11 a 38 e da 49 a 54', 'cromo e rame nel 20% dei casi'] },
		6: { label: 'Gli ioni', constraints: ['ioni dei gruppi principali e dei metalli di transizione del quarto periodo, metà e metà'] }
	},
	generate: generateWith(ID, LEVELS, checkSample),
	check: checkSample,
	toChoice
};

export default chimConfigurazioneElettronica;
