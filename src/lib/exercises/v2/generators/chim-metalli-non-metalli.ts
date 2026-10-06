/**
 * Metalli, non metalli e semimetalli. Spec: specs/exercises/chim-metalli-non-metalli.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/61-chim-metalli-non-metalli.md), each one step harder:
 * the class of an element (metal, semimetal, non-metal); the properties of the three classes (facts of the lesson);
 * the metallic character along a period or down a group; the families (which family, which element, which outer
 * configuration); the ion an element forms, from its group; the formula of the compound of a metal with a non-metal,
 * from the two ions. Classes, families and ionisation energies from the site's periodic table (chim3-d.ts).
 */
import type { Generator, Rng } from '../types';
import { type Built, type El, EL, KJ, ORD, again, art, cap, checkSample, choose, generateWith, ionTex, numTex, pickRow, shuffle, symOpts, symTex, texOpt, textBlock, textOpt, toChoice } from '../chim3-d';

export const ID = 'chim-metalli-non-metalli';

type Classe = 'metallo' | 'semimetallo' | 'non metallo';
export const classOf = (e: El): Classe => (e.family === 'semimetalli' ? 'semimetallo' : ['non-metalli', 'alogeni', 'gas-nobili'].includes(e.family) ? 'non metallo' : 'metallo');
const nameOpt = (e: El) => textOpt(cap(e.nome), e.sym);

// ---------------------------------------------------------------------------
// Level 1: the class of an element

/** Elements whose class no book disputes (polonium and astatine are left out). */
const BY_CLASS: Record<Classe, string[]> = {
	metallo: ['Li', 'Na', 'K', 'Cs', 'Mg', 'Ca', 'Ba', 'Al', 'Sn', 'Pb', 'Fe', 'Cu', 'Zn', 'Ag', 'Au', 'Hg', 'Ni', 'Cr', 'Ti'],
	semimetallo: ['B', 'Si', 'Ge', 'As', 'Sb', 'Te'],
	'non metallo': ['H', 'C', 'N', 'O', 'P', 'S', 'Se', 'F', 'Cl', 'Br', 'I', 'He', 'Ne', 'Ar'],
};
const WHERE: Record<Classe, string> = {
	metallo: 'I metalli occupano la parte sinistra e il centro della tavola.',
	semimetallo: 'I semimetalli stanno lungo il confine a scala tra metalli e non metalli: boro, silicio, germanio, arsenico, antimonio, tellurio.',
	'non metallo': "I non metalli stanno in alto a destra nella tavola, più l'idrogeno.",
};
const UN: Record<Classe, string> = { metallo: 'un metallo', semimetallo: 'un semimetallo', 'non metallo': 'un non metallo' };

function level1(rng: Rng): Built {
	const cls = rng.pick(['metallo', 'semimetallo', 'non metallo'] as Classe[]);
	const right = EL[rng.pick(BY_CLASS[cls])];
	const rest = (Object.keys(BY_CLASS) as Classe[]).filter((c) => c !== cls).flatMap((c) => BY_CLASS[c]);
	const others = shuffle(rng, rest).slice(0, 3).map((s) => EL[s]);
	if (classOf(right) !== cls || others.some((e) => classOf(e) === cls)) return again();
	return {
		prompt: 'Riconosci la classe.',
		problem: textBlock(`Quale di questi elementi è ${UN[cls]}?`),
		solution: nameOpt(right).latex,
		steps: [textBlock(WHERE[cls]), textBlock(`${cap(art(right.nome))} è ${UN[cls]}. Gli altri: ${others.map((e) => `${art(e.nome)} è ${UN[classOf(e)]}`).join(', ')}.`)],
		answer: choose(rng, nameOpt(right), others.map(nameOpt)),
		params: { case: cls, sym: right.sym },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the properties of the three classes

export const FACTS: { q: string; a: string; wrong: string[]; why: string }[] = [
	{ q: 'Che cosa vuol dire che un metallo è malleabile?', a: 'Si lascia ridurre in lamine', wrong: ['Si lascia tirare in fili', 'Riflette la luce', 'Conduce la corrente'], why: 'Malleabile: si lascia ridurre in lamine sottili senza rompersi. Duttile: si lascia tirare in fili.' },
	{ q: 'Che cosa vuol dire che un metallo è duttile?', a: 'Si lascia tirare in fili', wrong: ['Si lascia ridurre in lamine', 'Riflette la luce', 'Fonde a bassa temperatura'], why: 'Duttile: si lascia tirare in fili senza rompersi. Malleabile: si lascia ridurre in lamine.' },
	{ q: 'Quale metallo è liquido a temperatura ambiente?', a: 'Il mercurio', wrong: ['Il bromo', 'Il sodio', 'Il piombo'], why: 'Il mercurio fonde a $-38{,}8\\,^\\circ\\text{C}$. Il bromo è liquido, ma è un non metallo.' },
	{ q: 'Quale non metallo è liquido a temperatura ambiente?', a: 'Il bromo', wrong: ['Il mercurio', 'Il cloro', 'Lo iodio'], why: 'Il bromo, $\\mathrm{Br_2}$. Il cloro è un gas, lo iodio un solido; il mercurio è liquido, ma è un metallo.' },
	{ q: 'Come si comporta un non metallo solido sotto un colpo di martello?', a: 'Si rompe', wrong: ['Si schiaccia in una lamina', 'Si allunga in un filo', 'Diventa lucente'], why: 'I non metalli solidi sono fragili: sotto un colpo si rompono, non si deformano.' },
	{ q: 'Nelle reazioni, che cosa tendono a fare gli atomi dei metalli?', a: 'Perdono elettroni', wrong: ['Acquistano elettroni', 'Perdono protoni', 'Acquistano protoni'], why: "Hanno un'energia di ionizzazione bassa: perdono elettroni e diventano ioni positivi." },
	{ q: 'Con i metalli, che ioni formano i non metalli?', a: 'Ioni negativi', wrong: ['Ioni positivi', 'Nessuno ione', 'Ioni positivi e negativi'], why: 'I non metalli acquistano elettroni e diventano ioni negativi, come $\\mathrm{Cl^-}$ e $\\mathrm{O^{2-}}$.' },
	{ q: "Com'è l'energia di ionizzazione dei metalli rispetto a quella dei non metalli?", a: 'Più bassa', wrong: ['Più alta', 'Uguale', 'Più alta nei metalli pesanti'], why: "I metalli hanno un'energia di ionizzazione bassa e un'elettronegatività bassa; i non metalli le hanno alte." },
	{ q: 'Scaldando un metallo, come cambia la sua capacità di condurre la corrente?', a: 'Conduce peggio', wrong: ['Conduce meglio', 'Non cambia', 'Smette di condurre'], why: 'Un metallo scaldato conduce peggio. Un semimetallo, al contrario, conduce meglio.' },
	{ q: 'Scaldando un semimetallo come il silicio, come cambia la sua capacità di condurre la corrente?', a: 'Conduce meglio', wrong: ['Conduce peggio', 'Non cambia', 'Smette di condurre'], why: 'Un semimetallo scaldato conduce meglio, al contrario di un metallo: per questo si chiama anche semiconduttore.' },
	{ q: 'Un solido è lucente e fragile, e conduce poco la corrente. A quale classe appartiene?', a: 'Ai semimetalli', wrong: ['Ai metalli', 'Ai non metalli', 'Ai gas nobili'], why: 'Lucente come un metallo, fragile come un non metallo, conduttore mediocre: è un semimetallo, come il silicio.' },
	{ q: 'Un solido è lucente, conduce bene la corrente e sotto il martello si schiaccia. A quale classe appartiene?', a: 'Ai metalli', wrong: ['Ai semimetalli', 'Ai non metalli', 'Agli alogeni'], why: 'Lucentezza, buona conduzione e malleabilità insieme sono le proprietà dei metalli.' },
	{ q: 'Che tipo di ossidi formano i metalli con l\'ossigeno?', a: 'Ossidi basici', wrong: ['Ossidi acidi', 'Ossidi neutri', 'Nessun ossido'], why: 'I metalli formano ossidi basici, i non metalli ossidi acidi.' },
	{ q: 'Che tipo di ossidi formano i non metalli con l\'ossigeno?', a: 'Ossidi acidi', wrong: ['Ossidi basici', 'Ossidi metallici', 'Nessun ossido'], why: 'I non metalli formano ossidi acidi, i metalli ossidi basici.' },
	{ q: 'Quale di queste non è una proprietà dei metalli?', a: 'Sono fragili', wrong: ['Sono lucenti', 'Conducono il calore', 'Sono duttili'], why: 'I metalli sono malleabili e duttili: sotto un colpo si deformano. Fragili sono i non metalli solidi e i semimetalli.' },
	{ q: 'Quale forma del carbonio, un non metallo, conduce la corrente?', a: 'La grafite', wrong: ['Il diamante', 'Il carbone bianco', 'Nessuna'], why: "La grafite è l'eccezione tra i non metalli: conduce la corrente." },
];

function level2(rng: Rng): Built {
	const k = rng.int(0, FACTS.length - 1);
	const f = FACTS[k];
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(f.q),
		solution: textOpt(f.a).latex,
		steps: [textBlock(f.why)],
		answer: choose(rng, textOpt(f.a), f.wrong.map((x) => textOpt(x))),
		params: { case: 'fatto', k },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the metallic character

function level3(rng: Rng): Built {
	const { mode, which, els } = pickRow(rng, {
		prop: (e) => e.ei,
		periods: [2, 3, 4],
		groupsInPeriod: [1, 2, 13, 14, 15, 16, 17],
		groups: [1, 2, 14, 15, 16, 17],
		periodsInGroup: (g) => (g <= 2 ? [2, 3, 4, 5, 6] : [2, 3, 4, 5]),
		gap: 20,
	});
	// the ionisation energy rises along a period and falls down a group: the metallic character goes the other way
	if ((mode === 'periodo' ? els[3] : els[0]).ei! < (mode === 'periodo' ? els[0] : els[3]).ei!) return again();
	const strongest = rng.next() < 0.5;
	const right = mode === 'periodo' ? (strongest ? els[0] : els[3]) : strongest ? els[3] : els[0];
	const first = right === els[0];
	const place = mode === 'periodo' ? (first ? 'più a sinistra' : 'più a destra') : first ? 'più in alto' : 'più in basso';
	const pos = mode === 'periodo' ? `nel gruppo $${right.group}$` : `nel ${ORD[right.period]} periodo`;
	const [r, others] = symOpts(right, shuffle(rng, els.filter((e) => e !== right)));
	return {
		prompt: 'Confronta il carattere metallico.',
		problem: textBlock(`Quale di questi elementi ${mode === 'periodo' ? `del ${ORD[which]} periodo` : `del gruppo $${which}$`} ha il carattere metallico più ${strongest ? 'forte' : 'debole'}?`),
		solution: symTex(right.sym),
		steps: [
			textBlock(mode === 'periodo' ? 'Lungo un periodo il carattere metallico diminuisce da sinistra a destra: gli elettroni esterni sono trattenuti sempre di più.' : 'Lungo un gruppo il carattere metallico aumenta scendendo: gli elettroni esterni sono più lontani dal nucleo.'),
			textBlock(`L'elemento ${place} dei quattro è ${art(right.nome)}, ${pos}: ha il carattere metallico più ${strongest ? 'forte' : 'debole'}. La sua energia di prima ionizzazione, $${numTex(right.ei!)}${KJ}$, è la più ${strongest ? 'bassa' : 'alta'} delle quattro.`),
		],
		answer: choose(rng, r, others),
		params: { case: mode, which, ask: strongest ? 'forte' : 'debole' },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the families

type Fam = 'alcalini' | 'alcalino-terrosi' | 'transizione' | 'alogeni' | 'gas-nobili';
const FAMILY: Record<Fam, { name: string; un: string; dei: string; els: string[]; config?: string; why: string }> = {
	alcalini: { name: 'Metalli alcalini', un: 'un metallo alcalino', dei: 'dei metalli alcalini', els: ['Li', 'Na', 'K', 'Rb', 'Cs'], config: 'ns^1', why: "I metalli alcalini sono gli elementi del gruppo $1$, senza l'idrogeno." },
	'alcalino-terrosi': { name: 'Metalli alcalino-terrosi', un: 'un metallo alcalino-terroso', dei: 'dei metalli alcalino-terrosi', els: ['Be', 'Mg', 'Ca', 'Sr', 'Ba'], config: 'ns^2', why: 'I metalli alcalino-terrosi sono gli elementi del gruppo $2$.' },
	transizione: { name: 'Metalli di transizione', un: 'un metallo di transizione', dei: 'dei metalli di transizione', els: ['Fe', 'Cu', 'Zn', 'Ag', 'Au', 'Ni', 'Cr', 'Ti', 'Hg'], why: 'I metalli di transizione occupano i gruppi da $3$ a $12$, il blocco $d$.' },
	alogeni: { name: 'Alogeni', un: 'un alogeno', dei: 'degli alogeni', els: ['F', 'Cl', 'Br', 'I'], config: 'ns^2\\,np^5', why: 'Gli alogeni sono gli elementi del gruppo $17$.' },
	'gas-nobili': { name: 'Gas nobili', un: 'un gas nobile', dei: "dei gas nobili, tranne l'elio", els: ['He', 'Ne', 'Ar', 'Kr', 'Xe'], config: 'ns^2\\,np^6', why: 'I gas nobili sono gli elementi del gruppo $18$.' },
};
const FAMS = Object.keys(FAMILY) as Fam[];
/** Elements of no named family, as wrong options. */
const NO_FAMILY = ['H', 'C', 'N', 'O', 'S', 'P', 'Al', 'Si', 'Pb', 'Sn'];

function level4(rng: Rng): Built {
	const u = rng.next();
	const fam = rng.pick(FAMS);
	const F = FAMILY[fam];
	if (u < 0.4) {
		const e = EL[rng.pick(F.els)];
		if (e.family !== fam) return again();
		return {
			prompt: 'Riconosci la famiglia.',
			problem: textBlock(`A quale famiglia appartiene ${art(e.nome)}?`),
			solution: textOpt(F.name).latex,
			steps: [textBlock(`${cap(art(e.nome))} è nel gruppo $${e.group}$. ${F.why}`)],
			answer: choose(rng, textOpt(F.name), shuffle(rng, FAMS.filter((x) => x !== fam)).map((x) => textOpt(FAMILY[x].name))),
			params: { case: 'famiglia', sym: e.sym },
		};
	}
	if (u < 0.8) {
		const right = EL[rng.pick(F.els)];
		const pool = [...FAMS.filter((x) => x !== fam).flatMap((x) => FAMILY[x].els), ...NO_FAMILY];
		const others = shuffle(rng, pool).slice(0, 3).map((s) => EL[s]);
		return {
			prompt: 'Riconosci la famiglia.',
			problem: textBlock(`Quale di questi elementi è ${F.un}?`),
			solution: nameOpt(right).latex,
			steps: [textBlock(F.why), textBlock(`Dei quattro, solo ${art(right.nome)} è nel gruppo $${right.group}$.`)],
			answer: choose(rng, nameOpt(right), others.map(nameOpt)),
			params: { case: 'elemento', fam },
		};
	}
	if (!F.config) return again();
	const configs = FAMS.map((x) => FAMILY[x].config).filter((c): c is string => c !== undefined);
	return {
		prompt: 'Riconosci la famiglia.',
		problem: textBlock(`Qual è la configurazione elettronica esterna ${F.dei}?`),
		solution: F.config,
		steps: [textBlock(`${F.why} Gli elementi di un gruppo hanno la stessa configurazione esterna: $${F.config}$.`)],
		answer: choose(rng, texOpt(F.config, F.config), configs.filter((c) => c !== F.config).map((c) => texOpt(c, c))),
		params: { case: 'configurazione', fam },
	};
}

// ---------------------------------------------------------------------------
// Levels 5 and 6: ions and formulas

/** Elements that form one ion, with its charge, and how the exercise presents them. */
const ION_FORMERS: { syms: string[]; q: number; intro: string }[] = [
	{ syms: ['Li', 'Na', 'K', 'Rb', 'Cs'], q: 1, intro: 'è un metallo alcalino' },
	{ syms: ['Mg', 'Ca', 'Sr', 'Ba'], q: 2, intro: 'è un metallo alcalino-terroso' },
	{ syms: ['Al'], q: 3, intro: 'è un metallo del gruppo $13$' },
	{ syms: ['O', 'S'], q: -2, intro: 'è un non metallo del gruppo $16$' },
	{ syms: ['F', 'Cl', 'Br', 'I'], q: -1, intro: 'è un alogeno' },
];
const WRONG_Q: Record<number, number[]> = { 1: [-1, 2, -2], 2: [-2, 1, 3], 3: [-3, 2, 1], [-1]: [1, -2, 2], [-2]: [2, -1, 1] };
const electrons = (n: number) => (n === 1 ? 'un elettrone' : `${['', '', 'due', 'tre'][n]} elettroni`);

function ionStep(e: El, q: number) {
	const outer = q > 0 ? q : 8 + q;
	return q > 0
		? `${cap(art(e.nome))} ha ${electrons(outer).replace('un elettrone', 'un solo elettrone')} nel livello esterno e ${q === 1 ? 'lo' : 'li'} perde: forma lo ione $${ionTex(e.sym, q)}$.`
		: `${cap(art(e.nome))} ha $${outer}$ elettroni nel livello esterno e ne acquista ${-q === 1 ? 'uno' : 'due'} per completarlo: forma lo ione $${ionTex(e.sym, q)}$.`;
}

function level5(rng: Rng): Built {
	const f = rng.pick(ION_FORMERS);
	const e = EL[rng.pick(f.syms)];
	const opt = (q: number) => texOpt(ionTex(e.sym, q), String(q));
	return {
		prompt: 'Prevedi lo ione.',
		problem: textBlock(`${cap(art(e.nome))} ${f.intro}. Quale ione forma di solito?`),
		solution: ionTex(e.sym, f.q),
		steps: [textBlock(ionStep(e, f.q))],
		// the sign turned round; one charge more or less
		answer: choose(rng, opt(f.q), WRONG_Q[f.q].map(opt)),
		params: { case: f.q > 0 ? 'catione' : 'anione', sym: e.sym },
	};
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const sub = (s: string, k: number) => (k === 1 ? s : `${s}_${k}`);
const formula = (m: string, a: number, x: string, b: number) => `\\mathrm{${sub(m, a)}${sub(x, b)}}`;

function level6(rng: Rng): Built {
	const M = rng.pick(ION_FORMERS.filter((f) => f.q > 0));
	const X = rng.pick(ION_FORMERS.filter((f) => f.q < 0));
	const m = EL[rng.pick(M.syms)];
	const x = EL[rng.pick(X.syms)];
	const g = gcd(M.q, -X.q);
	const a = -X.q / g; // atoms of the metal
	const b = M.q / g;
	const opt = (i: number, j: number) => texOpt(formula(m.sym, i, x.sym, j), `${i}:${j}`);
	// the indices swapped; the charges written as indices without simplifying; one to one; other small indices
	const wrong: [number, number][] = [[b, a], [-X.q, M.q], [1, 1], [2, 1], [1, 2], [2, 3], [3, 2], [1, 3]];
	return {
		prompt: 'Scrivi la formula.',
		problem: textBlock(`Che formula ha il composto tra ${art(m.nome)} e ${art(x.nome)}?`),
		solution: formula(m.sym, a, x.sym, b),
		steps: [
			textBlock(ionStep(m, M.q)),
			textBlock(ionStep(x, X.q)),
			textBlock(`Il composto è neutro: con ${a === 1 ? 'uno ione' : `$${a}$ ioni`} $${ionTex(m.sym, M.q)}$ e ${b === 1 ? 'uno ione' : `$${b}$ ioni`} $${ionTex(x.sym, X.q)}$ la carica totale è $${a} \\cdot (+${M.q}) + ${b} \\cdot (${X.q}) = 0$. La formula è $${formula(m.sym, a, x.sym, b)}$.`),
		],
		answer: choose(rng, opt(a, b), wrong.filter(([i, j]) => i !== a || j !== b).map(([i, j]) => opt(i, j))),
		params: { case: `${M.q}:${-X.q}`, m: m.sym, x: x.sym },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

export const chimMetalliNonMetalli: Generator = {
	id: ID,
	title: 'Metalli, non metalli e semimetalli',
	levels: {
		1: { label: 'Metallo, semimetallo o non metallo', constraints: ['un elemento della classe chiesta e tre delle altre due'] },
		2: { label: 'Le proprietà delle tre classi', constraints: ['proprietà fisiche e chimiche della lezione'] },
		3: { label: 'Il carattere metallico', constraints: ['quattro elementi di un periodo o di un gruppo'] },
		4: { label: 'Le famiglie', constraints: ['famiglia di un elemento, elemento di una famiglia, configurazione esterna'] },
		5: { label: 'Lo ione dal gruppo', constraints: ['gruppi 1, 2, 13, 16 e 17'] },
		6: { label: 'La formula dai due ioni', constraints: ['un metallo dei gruppi 1, 2 o 13 e un non metallo dei gruppi 16 o 17'] },
	},
	generate: generateWith(ID, LEVELS, checkSample),
	check: checkSample,
	toChoice,
};

export default chimMetalliNonMetalli;
