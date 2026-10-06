/**
 * Raggio atomico ed energia di ionizzazione. Spec: specs/exercises/proprieta-periodiche.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/59-proprieta-periodiche.md), each one step harder: the
 * effective nuclear charge of the simple model (Z minus the inner electrons); the atomic radius along a period or
 * down a group; atoms against their ions, and isoelectronic ions; the first ionisation energy along a period or down a
 * group; the two exceptions (groups 2 and 13, groups 15 and 16); the number of valence electrons, or the group, from
 * the successive ionisation energies. Data from the site's periodic table and from the lesson (chim3-d.ts).
 */
import type { Generator, Rng } from '../types';
import {
	type Built, type El, EL, IONS, KJ, ORD, PM, SUCCESSIVE, again, art, cap, checkSample, choose, configTex, generateWith, ionTex, numTex, pickRow, shuffle, symOpts, symTex, texOpt, textBlock, textOpt, toChoice,
} from '../chim3-d';

export const ID = 'proprieta-periodiche';

// ---------------------------------------------------------------------------
// Level 1: the effective nuclear charge

/** Main-group elements of periods 2 and 3, potassium and calcium: the inner electrons are those of a noble gas. */
const ZEFF_ELEMENTS = ['Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca'];
const CORE: Record<string, [string, number]> = { '[He]': ["dell'elio", 2], '[Ne]': ['del neon', 10], '[Ar]': ["dell'argon", 18] };
const charge = (n: number) => (n === 0 ? '0' : `+${n}`);

function level1(rng: Rng): Built {
	const e = EL[rng.pick(ZEFF_ELEMENTS)];
	const [coreName, inner] = CORE[e.config.split(' ')[0]];
	const zeff = e.z - inner;
	const opt = (n: number) => texOpt(charge(n), String(n));
	return {
		prompt: 'Calcola la carica nucleare efficace.',
		problem: textBlock(`${cap(art(e.nome))} ha numero atomico $Z = ${e.z}$ e configurazione elettronica $${configTex(e.config)}$. Contando come schermo solo gli elettroni interni, quanto vale la carica nucleare efficace $Z_{eff}$ sentita dagli elettroni esterni?`),
		solution: charge(zeff),
		steps: [textBlock(`Gli elettroni interni sono quelli ${coreName}: $S = ${inner}$.`), `Z_{eff} = Z - S = ${e.z} - ${inner} = ${charge(zeff)}`],
		// the charge of the whole nucleus; the inner electrons; all the electrons taken away; one more, one less
		answer: choose(rng, opt(zeff), [opt(e.z), opt(inner), opt(0), opt(zeff + 1), opt(zeff - 1)]),
		number: String(zeff),
		params: { case: 'zeff', sym: e.sym },
	};
}

// ---------------------------------------------------------------------------
// Levels 2 and 4: a property along a period or down a group

const P_BLOCK_PERIODS = [2, 3, 4, 5];

function trend(rng: Rng, what: 'raggio' | 'ionizzazione'): Built {
	const radius = what === 'raggio';
	const { mode, which, els } = pickRow(rng, {
		prop: (e) => (radius ? e.radius : e.ei),
		periods: [2, 3, 4],
		groupsInPeriod: radius ? [1, 2, 13, 14, 15, 16, 17] : [1, 2, 13, 14, 15, 16, 17, 18],
		groups: radius ? [1, 2, 14, 15, 16, 17] : [1, 2, 15, 16, 17, 18],
		periodsInGroup: (g) => (g <= 2 ? [2, 3, 4, 5, 6] : P_BLOCK_PERIODS),
		gap: radius ? 3 : 20,
	});
	const max = rng.next() < 0.5;
	const val = (e: El) => (radius ? e.radius! : e.ei!);
	const sorted = [...els].sort((a, b) => val(a) - val(b));
	const right = max ? sorted[3] : sorted[0];
	const name = radius ? 'il raggio atomico' : "l'energia di prima ionizzazione";
	const where = mode === 'periodo' ? `del ${ORD[which]} periodo` : `del gruppo $${which}$`;
	const grows = radius ? mode === 'gruppo' : mode === 'periodo';
	const rule =
		mode === 'periodo'
			? radius
				? 'Lungo un periodo il raggio atomico diminuisce da sinistra a destra: $Z_{eff}$ cresce e il livello esterno resta lo stesso.'
				: "Lungo un periodo l'energia di prima ionizzazione aumenta da sinistra a destra: $Z_{eff}$ cresce e l'elettrone esterno è più vicino al nucleo."
			: radius
				? 'Lungo un gruppo il raggio atomico aumenta scendendo: a ogni periodo gli elettroni esterni occupano un livello in più.'
				: "Lungo un gruppo l'energia di prima ionizzazione diminuisce scendendo: l'elettrone esterno è sempre più lontano dal nucleo.";
	// where the right element sits among the four: first or last in the row
	const first = right === els[0];
	const place = mode === 'periodo' ? (first ? 'più a sinistra' : 'più a destra') : first ? 'più in alto' : 'più in basso';
	const pos = mode === 'periodo' ? `nel gruppo $${right.group}$` : `nel ${ORD[right.period]} periodo`;
	const value = `$${numTex(val(right))}${radius ? PM : KJ}$`;
	const [r, others] = symOpts(right, shuffle(rng, els.filter((e) => e !== right)));
	if ((grows ? els[3] : els[0]) !== sorted[3]) return again();
	return {
		prompt: radius ? 'Confronta i raggi atomici.' : 'Confronta le energie di ionizzazione.',
		problem: textBlock(`Quale di questi elementi ${where} ha ${name} ${max ? 'maggiore' : 'minore'}?`),
		solution: symTex(right.sym),
		steps: [textBlock(rule), textBlock(`L'elemento ${place} dei quattro è ${art(right.nome)}, ${pos}: ha ${name} ${max ? 'maggiore' : 'minore'}, ${value}.`)],
		answer: choose(rng, r, others),
		params: { case: mode, what, which, ask: max ? 'max' : 'min' },
	};
}

// ---------------------------------------------------------------------------
// Level 3: ions

const ION_SYMS = Object.keys(IONS);
/** Isoelectronic series: the ions with the electrons of neon and of argon. */
const SERIES: { n: number; ions: string[] }[] = [
	{ n: 10, ions: ['O', 'F', 'Na', 'Mg', 'Al'] },
	{ n: 18, ions: ['S', 'Cl', 'K', 'Ca'] },
];

function level3(rng: Rng): Built {
	if (rng.next() < 0.5) {
		const four = shuffle(rng, ION_SYMS).slice(0, 4);
		const stmt = (sym: string, truth: boolean) => {
			const smaller = IONS[sym].r < EL[sym].radius!;
			const word = smaller === truth ? 'piccolo' : 'grande';
			return textOpt(`$${ionTex(sym, IONS[sym].q)}$ è più ${word} di $${symTex(sym)}$`, `${sym}:${word}`);
		};
		const s = four[0];
		const ion = IONS[s];
		const e = EL[s];
		const why =
			ion.q > 0
				? `Lo ione $${ionTex(s, ion.q)}$ è un catione: ha perso ${ion.q === 1 ? 'un elettrone' : `${ion.q} elettroni`}, e gli stessi $${e.z}$ protoni trattengono meno elettroni. È più piccolo dell'atomo: $${ion.r}${PM}$ contro $${e.radius}${PM}$.`
				: `Lo ione $${ionTex(s, ion.q)}$ è un anione: ha acquistato ${ion.q === -1 ? 'un elettrone' : `${-ion.q} elettroni`}, che si respingono con gli altri, mentre i protoni restano $${e.z}$. È più grande dell'atomo: $${ion.r}${PM}$ contro $${e.radius}${PM}$.`;
		const right = stmt(s, true);
		return {
			prompt: 'Confronta atomi e ioni.',
			problem: textBlock('Quale di queste affermazioni è corretta?'),
			solution: right.latex,
			steps: [textBlock('Un catione è più piccolo del suo atomo, un anione è più grande.'), textBlock(why)],
			answer: choose(rng, right, four.slice(1).map((x) => stmt(x, false))),
			params: { case: 'affermazione', sym: s },
		};
	}
	const series = rng.pick(SERIES);
	const four = shuffle(rng, series.ions).slice(0, 4).sort((a, b) => EL[a].z - EL[b].z);
	const smallest = rng.next() < 0.5;
	const right = smallest ? four[3] : four[0];
	const opt = (s: string) => texOpt(ionTex(s, IONS[s].q), `${s}${IONS[s].q > 0 ? '+' : '-'}`);
	return {
		prompt: 'Confronta ioni isoelettronici.',
		problem: textBlock(`Questi ioni hanno tutti $${series.n}$ elettroni. Qual è il più ${smallest ? 'piccolo' : 'grande'}?`),
		solution: ionTex(right, IONS[right].q),
		steps: [
			textBlock(`I protoni sono: ${four.map((s) => `$${EL[s].z}$ in $${ionTex(s, IONS[s].q)}$`).join(', ')}.`),
			textBlock(`Con gli stessi elettroni, più protoni vuol dire uno ione più piccolo: il più ${smallest ? 'piccolo' : 'grande'} è $${ionTex(right, IONS[right].q)}$, con $Z = ${EL[right].z}$ e raggio $${IONS[right].r}${PM}$.`),
		],
		answer: choose(rng, opt(right), shuffle(rng, four.filter((s) => s !== right)).map(opt)),
		params: { case: 'isoelettronici', n: series.n, ask: smallest ? 'min' : 'max' },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the two exceptions

/** Neighbours in periods 2 and 3, left to right. */
const ROWS = [
	['Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'],
	['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'],
];
const PAIRS: [El, El][] = ROWS.flatMap((r) => r.slice(1).map((s, i) => [EL[r[i]], EL[s]] as [El, El]));
const pairOpt = ([a, b]: [El, El]) => textOpt(`${cap(a.nome)} e ${b.nome}`, `${a.sym}-${b.sym}`);

function level5(rng: Rng): Built {
	const inverted = PAIRS.filter(([a, b]) => a.ei! > b.ei!);
	const normal = PAIRS.filter(([a, b]) => a.ei! < b.ei!);
	const inv = rng.pick(inverted);
	const [a, b] = inv;
	const why =
		a.group === 2
			? `Sono i gruppi $2$ e $13$: l'elettrone che si toglie ${art(b.nome).replace(/^il /, 'al ').replace(/^lo /, 'allo ').replace(/^l'/, "all'")} è il primo elettrone $p$, più alto in energia e schermato dai due elettroni $s$.`
			: `Sono i gruppi $15$ e $16$: ${art(b.nome)} ha un orbitale $p$ con due elettroni, che si respingono, e uno dei due si toglie più facilmente.`;
	return {
		prompt: "Trova l'eccezione.",
		problem: textBlock("In quale di queste coppie di elementi vicini nello stesso periodo il primo ha l'energia di prima ionizzazione maggiore del secondo?"),
		solution: pairOpt(inv).latex,
		steps: [
			textBlock("Lungo un periodo l'energia di prima ionizzazione di solito aumenta: il secondo elemento della coppia ha l'energia maggiore, tranne che tra i gruppi $2$ e $13$ e tra i gruppi $15$ e $16$."),
			textBlock(why),
			textBlock(`${cap(a.nome)}: $${numTex(a.ei!)}${KJ}$; ${b.nome}: $${numTex(b.ei!)}${KJ}$.`),
		],
		answer: choose(rng, pairOpt(inv), shuffle(rng, normal).map(pairOpt)),
		params: { case: a.group === 2 ? '2-13' : '15-16', pair: `${a.sym}-${b.sym}` },
	};
}

// ---------------------------------------------------------------------------
// Level 6: successive ionisation energies

const NTH = ['prima', 'seconda', 'terza', 'quarta', 'quinta'];
const SUCC_SYMS = Object.keys(SUCCESSIVE);

function level6(rng: Rng): Built {
	const e = EL[rng.pick(SUCC_SYMS)];
	const xs = SUCCESSIVE[e.sym];
	const n = e.group! <= 2 ? e.group! : e.group! - 10; // valence electrons
	const askGroup = rng.next() < 0.5;
	// one energy per row: five columns would not fit a phone
	const table = `\\begin{array}{l|r} ${xs.map((x, i) => `\\text{${NTH[i]}} & ${numTex(x)}`).join(' \\\\ ')} \\end{array}`;
	const answer = askGroup ? e.group! : n;
	const opt = (k: number) => texOpt(String(k), String(k));
	// the jump read one place late or one early, the first increase taken for the jump, the number of energies listed;
	// for the group, the valence electrons written as the group
	const wrong = askGroup ? [...(n >= 3 ? [n] : []), ...[13, 14, 2, 1].filter((g) => g !== e.group)] : [n + 1, n - 1, 1, xs.length, n + 2];
	return {
		prompt: 'Leggi le energie di ionizzazione successive.',
		problem: textBlock(`Un elemento del ${ORD[e.period]} periodo ha queste energie di ionizzazione successive, in kJ/mol. ${askGroup ? 'In quale gruppo della tavola periodica si trova?' : 'Quanti elettroni di valenza ha?'}`, 46, [table]),
		solution: String(answer),
		steps: [
			textBlock(`Il salto più grande è tra la ${NTH[n - 1]} e la ${NTH[n]} energia: da $${numTex(xs[n - 1])}$ a $${numTex(xs[n])}${KJ}$, cioè $${numTex(xs[n] - xs[n - 1])}${KJ}$ in più.`),
			textBlock(`Prima del salto ${n === 1 ? 'viene via un solo elettrone: l\'elettrone di valenza è $1$' : `vengono via $${n}$ elettroni: gli elettroni di valenza sono $${n}$`}.`),
			textBlock(`L'elemento è nel gruppo $${e.group}$: è ${art(e.nome)}.`),
		],
		answer: choose(rng, opt(answer), wrong.filter((k) => k > 0).map(opt)),
		number: String(answer),
		params: { case: askGroup ? 'gruppo' : 'valenza', sym: e.sym },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = {
	1: level1,
	2: (rng) => trend(rng, 'raggio'),
	3: level3,
	4: (rng) => trend(rng, 'ionizzazione'),
	5: level5,
	6: level6,
};

export const proprietaPeriodiche: Generator = {
	id: ID,
	title: 'Raggio atomico ed energia di ionizzazione',
	levels: {
		1: { label: 'La carica nucleare efficace', constraints: ['Z meno gli elettroni interni, elementi fino al calcio'] },
		2: { label: 'Il raggio atomico nella tavola', constraints: ['quattro elementi di un periodo o di un gruppo, il maggiore o il minore'] },
		3: { label: 'Il raggio degli ioni', constraints: ['atomo e ione a confronto, ioni isoelettronici'] },
		4: { label: "L'energia di ionizzazione nella tavola", constraints: ['quattro elementi di un periodo o di un gruppo, senza le coppie che fanno eccezione'] },
		5: { label: 'Le due eccezioni', constraints: ['la coppia tra i gruppi 2 e 13 o tra i gruppi 15 e 16'] },
		6: { label: 'Le energie di ionizzazione successive', constraints: ['il salto dà gli elettroni di valenza e il gruppo'] },
	},
	generate: generateWith(ID, LEVELS, checkSample),
	check: checkSample,
	toChoice,
};

export default proprietaPeriodiche;
