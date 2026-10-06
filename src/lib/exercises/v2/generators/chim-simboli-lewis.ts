/**
 * Elettroni di valenza e simboli di Lewis. Spec: specs/exercises/chim-simboli-lewis.md
 *
 * Six levels in the order of the lesson (docs/lezioni/chimica/riscritte/58-chim-simboli-lewis.md), each one step
 * harder: the valence electrons from a configuration of the second or third period; with a full d sublevel in the
 * way; from the group alone; the pairs and the single dots of a Lewis symbol; the ion a main-group element forms;
 * the noble gas whose configuration the ion has. Only main-group elements, with the data of the periodic table of
 * the site (src/lib/tools/elementi.json).
 */
import type { ChoiceOption, Generator, Rng } from '../types';
import { type Built, type El, EL, ELS, art, cap, cfgTex, checkSample, choose, chooseNumber, di, generateWith, ionTex, textBlock, textOpt, texOpt, toChoice } from '../chim3-b';

export const ID = 'chim-simboli-lewis';

const isMain = (e: El) => e.group !== null && (e.group <= 2 || e.group >= 13);
const valence = (e: El) => (e.sym === 'He' ? 2 : e.group! <= 2 ? e.group! : e.group! - 10);
const ROMAN: Record<number, string> = { 1: 'IA', 2: 'IIA', 13: 'IIIA', 14: 'IVA', 15: 'VA', 16: 'VIA', 17: 'VIIA', 18: 'VIIIA' };
const el = (k: number) => (k === 1 ? '$1$ elettrone' : `$${k}$ elettroni`);

// ---------------------------------------------------------------------------
// Levels 1 and 2: from the configuration

function fromConfig(rng: Rng, pool: El[], withD: boolean): Built {
	const e = rng.pick(pool);
	const n = e.period;
	const s = e.outer.find(([name]) => name === `${n}s`)![1];
	const p = e.outer.find(([name]) => name === `${n}p`)?.[1] ?? 0;
	const v = s + p;
	const core = EL[e.core!].z;
	const cfg = cfgTex(e.outer, e.core);
	return {
		prompt: 'Conta gli elettroni di valenza.',
		problem: textBlock(`${cap(art(e.name))} ha configurazione $${cfg}$. Quanti elettroni di valenza ha?`),
		solution: String(v),
		steps: [
			textBlock(`Il livello più esterno è quello con $n = ${n}$: i suoi sottolivelli sono ${p ? `il $${n}s$ e il $${n}p$` : `il solo $${n}s$`}.`),
			...(withD ? [textBlock(`Il $${n - 1}d^{10}$ appartiene al livello $${n - 1}$: i suoi elettroni sono interni e non si contano.`)] : []),
			textBlock(p ? `Elettroni di valenza: $${s} + ${p} = ${v}$.` : `Elettroni di valenza: $${v}$.`)
		],
		// the last sublevel alone; everything after the noble gas; every electron; the noble gas's electrons; the d alone
		answer: chooseNumber(rng, v, withD ? [s + 10 + p, p, 10 + p, 10, e.z] : [p, e.z, core, e.z - 2, 8 - v], 1),
		number: v,
		params: { case: withD ? 'd-pieno' : 'semplice', sym: e.sym }
	};
}

const L1_POOL = ELS.filter((e) => isMain(e) && (e.period === 2 || e.period === 3));
const L2_POOL = ELS.filter((e) => isMain(e) && (e.period === 4 || e.period === 5) && e.group! >= 13);

// ---------------------------------------------------------------------------
// Level 3: from the group

const L3_POOL = ELS.filter((e) => isMain(e) && e.period >= 2 && e.period <= 6 && e.z <= 86 && e.z !== 84 && e.z !== 85);

function level3(rng: Rng): Built {
	const e = rng.pick(L3_POOL);
	const g = e.group!;
	const v = valence(e);
	return {
		prompt: 'Trova gli elettroni di valenza.',
		problem: textBlock(`${cap(art(e.name))} si trova nel gruppo $${g}$ della tavola periodica. Quanti elettroni di valenza ha?`),
		solution: String(v),
		steps: [textBlock(g <= 2 ? `Nei gruppi $1$ e $2$ gli elettroni di valenza sono quanti il numero del gruppo: $${v}$.` : `Nei gruppi da $13$ a $18$ gli elettroni di valenza sono il numero del gruppo meno $10$: $${g} - 10 = ${v}$.`), textBlock(`Nella numerazione tradizionale è il gruppo ${ROMAN[g]}.`)],
		// the group itself; twelve subtracted; the period; what is missing to eight
		answer: chooseNumber(rng, v, g >= 13 ? [g, g - 12, e.period, 8 - v, 18 - g] : [g + 10, e.period, 8 - v, e.z], 1),
		number: v,
		params: { case: g <= 2 ? 's' : 'p', sym: e.sym }
	};
}

// ---------------------------------------------------------------------------
// Level 4: the dots of the Lewis symbol

const dotsOpt = (pairs: number, singles: number): ChoiceOption | null => {
	if (pairs < 0 || singles < 0 || pairs + singles > 4 || pairs + singles === 0) return null;
	const a = pairs === 0 ? 'nessuna coppia' : pairs === 1 ? '1 coppia' : `${pairs} coppie`;
	const b = singles === 0 ? 'nessun puntino singolo' : singles === 1 ? '1 puntino singolo' : `${singles} puntini singoli`;
	return textOpt(`${a} e ${b}`, `${pairs}:${singles}`);
};
/** Pairs and single dots of a Lewis symbol with v dots: one per side first, then the pairs. */
const lewis = (v: number): [number, number] => (v <= 4 ? [0, v] : [v - 4, 8 - v]);

const L4_POOL = ELS.filter((e) => isMain(e) && e.period >= 2 && e.period <= 4);

function level4(rng: Rng): Built {
	const e = rng.pick(L4_POOL);
	const g = e.group!;
	const v = valence(e);
	const [pairs, singles] = lewis(v);
	const right = dotsOpt(pairs, singles)!;
	const [p1, s1] = lewis(Math.min(8, v + 1));
	const [p0, s0] = lewis(Math.max(1, v - 1));
	const others = [
		// paired as soon as possible, as in the box of the s sublevel
		dotsOpt(Math.floor(v / 2), v % 2),
		// the s pair first, then one per side
		v >= 2 && v <= 5 ? dotsOpt(1, v - 2) : null,
		dotsOpt(p1, s1),
		dotsOpt(p0, s0),
		// pairs and singles swapped
		dotsOpt(singles, pairs),
		dotsOpt(Math.max(0, pairs - 1), Math.min(4, singles + 1)),
		dotsOpt(1, 1),
		dotsOpt(2, 1)
	];
	return {
		prompt: 'Descrivi il simbolo di Lewis.',
		problem: textBlock(`${cap(art(e.name))} si trova nel gruppo $${g}$. Nel suo simbolo di Lewis quante coppie di puntini e quanti puntini singoli ci sono?`),
		solution: right.latex,
		steps: [
			textBlock(`Gli elettroni di valenza sono ${g <= 2 ? `$${v}$` : `$${g} - 10 = ${v}$`}: il simbolo ha $${v}$ ${v === 1 ? 'puntino' : 'puntini'}.`),
			textBlock(v <= 4 ? `Fino a quattro, i puntini vanno uno per lato: nessuna coppia.` : `I primi quattro puntini vanno uno per lato; gli altri $${v - 4}$ si aggiungono a ${v - 4 === 1 ? 'un lato e formano una coppia' : `$${v - 4}$ lati e formano $${v - 4}$ coppie`}. ${singles === 0 ? 'Non restano puntini singoli.' : singles === 1 ? 'Resta $1$ puntino singolo.' : `Restano $${singles}$ puntini singoli.`}`),
			right.latex
		],
		answer: choose(rng, right, others),
		params: { case: v <= 4 ? 'fino-a-quattro' : 'coppie', sym: e.sym }
	};
}

// ---------------------------------------------------------------------------
// Levels 5 and 6: the ions

/** The main-group elements of the lesson's table that form one simple ion. */
const ION_SYMS = ['Li', 'Na', 'K', 'Rb', 'Cs', 'Mg', 'Ca', 'Sr', 'Ba', 'Al', 'N', 'P', 'O', 'S', 'Se', 'F', 'Cl', 'Br', 'I'];
const charge = (e: El) => (e.group! <= 13 ? valence(e) : valence(e) - 8);
const ionOpt = (sym: string, q: number): ChoiceOption | null => (q === 0 || Math.abs(q) > 8 ? null : texOpt(ionTex(sym, q), String(q)));

function level5(rng: Rng): Built {
	const e = EL[rng.pick(ION_SYMS)];
	const g = e.group!;
	const v = valence(e);
	const q = charge(e);
	const metal = q > 0;
	return {
		prompt: "Trova lo ione.",
		problem: textBlock(`${cap(art(e.name))} si trova nel gruppo $${g}$. Quale ione forma per avere la configurazione di un gas nobile?`),
		solution: ionTex(e.sym, q),
		steps: [
			textBlock(`${cap(art(e.name))} ha ${el(v)} di valenza.`),
			textBlock(metal ? `È un metallo con pochi elettroni di valenza: li perde tutti e resta con ${v === 1 ? 'una carica positiva' : `$${v}$ cariche positive`}.` : `Gli ${8 - v === 1 ? 'manca $1$ elettrone' : `mancano $${8 - v}$ elettroni`} per arrivare a otto: ${8 - v === 1 ? 'lo' : 'li'} acquista, e ogni elettrone acquistato porta una carica negativa.`),
			ionTex(e.sym, q)
		],
		// the sign the wrong way; the valence electrons as the charge; what is missing to eight as a positive charge
		answer: choose(rng, ionOpt(e.sym, q)!, [ionOpt(e.sym, -q), ionOpt(e.sym, metal ? v - 8 : v), ionOpt(e.sym, metal ? 8 - v : -v), ionOpt(e.sym, q > 0 ? q + 1 : q - 1), ionOpt(e.sym, q > 0 ? q - 1 : q + 1), ionOpt(e.sym, -q + (q > 0 ? -1 : 1))]),
		params: { case: metal ? 'catione' : 'anione', sym: e.sym }
	};
}

const NOBLE_NAMES: [string, string][] = [['He', "elio"], ['Ne', 'neon'], ['Ar', 'argon'], ['Kr', 'kripton'], ['Xe', 'xeno'], ['Rn', 'radon']];

function level6(rng: Rng): Built {
	const e = EL[rng.pick(ION_SYMS)];
	const q = charge(e);
	const metal = q > 0;
	// a cation: the noble gas before the element; an anion: the one that closes its period
	const k = metal ? e.period - 2 : e.period - 1;
	const [, name] = NOBLE_NAMES[k];
	const n = e.z - q;
	const opt = (i: number) => (i < 0 || i > 5 ? null : textOpt(cap(art(NOBLE_NAMES[i][1])), NOBLE_NAMES[i][0]));
	return {
		prompt: 'Trova il gas nobile.',
		problem: textBlock(`Quale gas nobile ha la stessa configurazione elettronica dello ione $${ionTex(e.sym, q)}$?`),
		solution: `\\text{${cap(art(name))}}`,
		steps: [
			textBlock(metal ? `${cap(art(e.name))} ($Z = ${e.z}$) ha perso ${el(q)}: lo ione ne ha $${e.z} - ${q} = ${n}$.` : `${cap(art(e.name))} ($Z = ${e.z}$) ha acquistato ${el(-q)}: lo ione ne ha $${e.z} + ${-q} = ${n}$.`),
			textBlock(`Il gas nobile con $${n}$ elettroni è ${art(name)}, ${metal ? `che precede ${art(e.name)} nella tavola periodica` : `che chiude il periodo ${di(e.name)}`}.`)
		],
		// the gas on the other side of the element; the ones next to them
		answer: choose(rng, opt(k)!, [opt(metal ? k + 1 : k - 1), opt(metal ? k - 1 : k + 1), opt(k + 2), opt(k - 2), opt(k + 3), opt(k - 3)]),
		params: { case: metal ? 'catione' : 'anione', sym: e.sym }
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: (rng) => fromConfig(rng, L1_POOL, false), 2: (rng) => fromConfig(rng, L2_POOL, true), 3: level3, 4: level4, 5: level5, 6: level6 };

export const chimSimboliLewis: Generator = {
	id: ID,
	title: 'Elettroni di valenza e simboli di Lewis',
	levels: {
		1: { label: 'Elettroni di valenza dalla configurazione', constraints: ['gruppi principali, periodi 2 e 3'] },
		2: { label: 'Con un sottolivello d pieno', constraints: ['gruppi da 13 a 18, periodi 4 e 5'] },
		3: { label: 'Elettroni di valenza dal gruppo', constraints: ['gruppi principali, periodi da 2 a 6'] },
		4: { label: 'I puntini del simbolo di Lewis', constraints: ['gruppi principali, periodi da 2 a 4', 'coppie e puntini singoli'] },
		5: { label: 'Lo ione di un elemento', constraints: ['gruppi 1, 2, 13 (alluminio), 15, 16, 17'] },
		6: { label: 'Lo ione e il suo gas nobile', constraints: ['gli stessi elementi del livello 5'] }
	},
	generate: generateWith(ID, LEVELS, checkSample),
	check: checkSample,
	toChoice
};

export default chimSimboliLewis;
