/**
 * Il legame covalente. Spec: specs/exercises/legame-covalente.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/63-legame-covalente.md), each one step harder: the
 * facts about the covalent bond; how many bonds, or lone pairs, an atom usually has; the valence electrons and the
 * lone pairs of a molecule with single bonds only; the same with double and triple bonds, and the electrons around an
 * atom for a given number of shared pairs; bond order against length and energy. Levels 2, 3 and 4 ask for a whole
 * number, for the open answer.
 */
import type { Generator, Rng } from '../types';
import { type BuiltE, BONDS_63, art, bondTex, cap, checkE, choose, el, generateE, t, texOpt, textBlock, textOpt, toChoiceE, tx, valence } from '../chim3-e';

export const ID = 'legame-covalente';

// ---------------------------------------------------------------------------
// Level 1: facts

export const FACTS: { q: string; a: string; wrong: string[]; why: string }[] = [
	{ q: "Che cos'è un legame covalente?", a: 'Una coppia di elettroni in comune', wrong: ['Un elettrone ceduto a un altro atomo', "L'attrazione tra due ioni", 'Un protone in comune'], why: 'Nel legame covalente due atomi mettono in comune una coppia di elettroni, attratta da tutti e due i nuclei.' },
	{ q: 'Tra quali atomi si forma di solito il legame covalente?', a: 'Tra atomi di non metalli', wrong: ['Tra un metallo e un non metallo', 'Tra atomi di metalli', 'Tra atomi di gas nobili'], why: 'Il legame covalente si forma tra atomi di non metalli, uguali o diversi: atomi a cui mancano elettroni e che non li cedono facilmente.' },
	{ q: 'Quando un legame covalente si chiama puro?', a: 'Quando la coppia sta a metà tra i due atomi', wrong: ['Quando gli atomi sono di metalli', 'Quando ci sono due coppie in comune', 'Quando un atomo cede un elettrone'], why: 'Tra due atomi uguali la coppia in comune è attirata con la stessa forza e sta a metà: il legame è covalente puro.' },
	{ q: "Che cos'è una coppia solitaria?", a: 'Una coppia di elettroni di un atomo solo', wrong: ['Una coppia in comune tra due atomi', 'Un elettrone senza compagno', 'Una coppia di protoni'], why: 'Una coppia solitaria appartiene a un atomo solo e non forma legami.' },
	{ q: "Che cos'è una coppia di legame?", a: 'Una coppia in comune tra due atomi', wrong: ['Una coppia di elettroni di un atomo solo', 'Due elettroni spaiati lontani', 'Due atomi legati'], why: 'La coppia di legame è la coppia di elettroni messa in comune, che sta tra i due atomi.' },
	{ q: "Nel conto dell'ottetto, quanti elettroni vale una coppia di legame per ciascuno dei due atomi?", a: '2', wrong: ['1', '4', '0'], why: 'La coppia in comune conta per intero, due elettroni, nel livello esterno di tutti e due gli atomi.' },
	{ q: 'Quante coppie di elettroni sono in comune in un legame doppio?', a: '2', wrong: ['1', '4', '3'], why: 'Un legame doppio è fatto di due coppie in comune, cioè quattro elettroni.' },
	{ q: 'Quanti elettroni sono in comune in un legame triplo?', a: '6', wrong: ['3', '2', '4'], why: 'Un legame triplo è fatto di tre coppie in comune: sei elettroni.' },
	{ q: "Che cos'è l'ordine di legame?", a: 'Il numero di coppie in comune', wrong: ['Il numero di coppie solitarie', 'Il numero di atomi della molecola', 'La lunghezza del legame'], why: "L'ordine di legame è il numero di coppie di elettroni che due atomi mettono in comune: $1$, $2$ o $3$." },
	{ q: 'In una formula di Lewis, che cosa indica un trattino tra due atomi?', a: 'Una coppia di elettroni in comune', wrong: ['Un solo elettrone in comune', 'Una coppia solitaria', 'Uno ione'], why: 'Un trattino sostituisce i due puntini di una coppia di legame.' },
	{ q: 'Quanti elettroni ha intorno un atomo di idrogeno in una molecola?', a: '2', wrong: ['8', '1', '4'], why: "L'idrogeno ha il livello esterno completo con $2$ elettroni, quelli della sua coppia di legame." },
	{ q: 'La formula di Lewis di una molecola dice che forma ha la molecola?', a: 'No, solo quali atomi sono legati', wrong: ['Sì, sempre', 'Sì, se ci sono legami doppi', 'Solo per le molecole lineari'], why: 'La formula di Lewis dice quali atomi sono legati e con quante coppie; la forma si ricava con la teoria VSEPR.' },
	{ q: 'Che legame unisce i due atomi nella molecola di azoto?', a: 'Un legame triplo', wrong: ['Un legame singolo', 'Un legame doppio', 'Un legame ionico'], why: "All'azoto mancano tre elettroni: due atomi di azoto mettono in comune tre coppie." },
	{ q: 'Che legame unisce i due atomi nella molecola di ossigeno?', a: 'Un legame doppio', wrong: ['Un legame singolo', 'Un legame triplo', 'Un legame ionico'], why: "All'ossigeno mancano due elettroni: due atomi di ossigeno mettono in comune due coppie." },
];

function level1(rng: Rng): BuiltE {
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
// Level 2: how many bonds, how many lone pairs

export const BONDERS = ['H', 'C', 'Si', 'N', 'P', 'O', 'S', 'Se', 'F', 'Cl', 'Br', 'I'];

function level2(rng: Rng): BuiltE {
	const e = el(rng.pick(BONDERS));
	const v = valence(e);
	const bonds = e.sym === 'H' ? 1 : 8 - v;
	const lone = (v - bonds) / 2;
	const intro = `${cap(art(e.nome))} è nel gruppo $${e.group}$.`;
	const stepV = textBlock(`${cap(art(e.nome))} ha $${v}$ ${v === 1 ? 'elettrone' : 'elettroni'} di valenza.`);
	const stepB = e.sym === 'H' ? textBlock("Gli manca un elettrone per arrivare a $2$, come l'elio: forma $1$ legame.") : textBlock(`Gli ${bonds === 1 ? 'manca' : 'mancano'} $8 - ${v} = ${bonds}$ ${bonds === 1 ? 'elettrone' : 'elettroni'} per l'ottetto: forma $${bonds}$ ${bonds === 1 ? 'legame' : 'legami'}.`);
	if (e.sym !== 'H' && rng.next() < 0.4) {
		return {
			prompt: 'Scrivi il numero di coppie solitarie.',
			problem: textBlock(`${intro} Quante coppie solitarie ha di solito un suo atomo in una molecola, dopo aver formato i suoi legami covalenti?`),
			solution: String(lone),
			steps: [stepV, stepB, textBlock(`Nei legami mette $${bonds}$ ${bonds === 1 ? 'elettrone' : 'elettroni'}: gliene restano $${v} - ${bonds} = ${v - bonds}$, cioè $${lone}$ ${lone === 1 ? 'coppia solitaria' : 'coppie solitarie'}.`)],
			// the electrons left, not halved; the bonds; the valence electrons
			numbers: [lone, v - bonds, bonds, v, lone + 1, 8 - v + 1, 5],
			params: { case: 'solitarie', el: e.sym },
		};
	}
	return {
		prompt: 'Scrivi il numero di legami.',
		problem: textBlock(`${intro} Quanti legami covalenti forma di solito un suo atomo?`),
		solution: String(bonds),
		steps: [stepV, stepB],
		// the valence electrons; the octet; the lone pairs
		numbers: [bonds, v, 8, e.sym === 'H' ? 2 : lone, bonds + 1, 7, 3, 5],
		params: { case: 'legami', el: e.sym },
	};
}

// ---------------------------------------------------------------------------
// Levels 3 and 4: counting electrons in a molecule

interface Mol {
	tex: string;
	nome: string;
	/** Atoms with their count. */
	atoms: [string, number][];
	/** How the atoms are bound, as the problem says it. */
	bonds: string;
	/** Bonding pairs in all. */
	pairs: number;
}

export const SINGLE: Mol[] = [
	{ tex: '\\mathrm{F_2}', nome: 'fluoro', atoms: [['F', 2]], bonds: 'i due atomi sono uniti da un legame singolo', pairs: 1 },
	{ tex: '\\mathrm{Cl_2}', nome: 'cloro', atoms: [['Cl', 2]], bonds: 'i due atomi sono uniti da un legame singolo', pairs: 1 },
	{ tex: '\\mathrm{Br_2}', nome: 'bromo', atoms: [['Br', 2]], bonds: 'i due atomi sono uniti da un legame singolo', pairs: 1 },
	{ tex: '\\mathrm{HF}', nome: 'fluoruro di idrogeno', atoms: [['H', 1], ['F', 1]], bonds: 'i due atomi sono uniti da un legame singolo', pairs: 1 },
	{ tex: '\\mathrm{HCl}', nome: 'cloruro di idrogeno', atoms: [['H', 1], ['Cl', 1]], bonds: 'i due atomi sono uniti da un legame singolo', pairs: 1 },
	{ tex: '\\mathrm{HBr}', nome: 'bromuro di idrogeno', atoms: [['H', 1], ['Br', 1]], bonds: 'i due atomi sono uniti da un legame singolo', pairs: 1 },
	{ tex: '\\mathrm{H_2O}', nome: 'acqua', atoms: [['H', 2], ['O', 1]], bonds: "l'ossigeno è legato a ciascun idrogeno con un legame singolo", pairs: 2 },
	{ tex: '\\mathrm{H_2S}', nome: 'solfuro di idrogeno', atoms: [['H', 2], ['S', 1]], bonds: 'lo zolfo è legato a ciascun idrogeno con un legame singolo', pairs: 2 },
	{ tex: '\\mathrm{NH_3}', nome: 'ammoniaca', atoms: [['N', 1], ['H', 3]], bonds: "l'azoto è legato a ciascun idrogeno con un legame singolo", pairs: 3 },
	{ tex: '\\mathrm{PH_3}', nome: 'fosfina', atoms: [['P', 1], ['H', 3]], bonds: 'il fosforo è legato a ciascun idrogeno con un legame singolo', pairs: 3 },
	{ tex: '\\mathrm{NF_3}', nome: 'trifluoruro di azoto', atoms: [['N', 1], ['F', 3]], bonds: "l'azoto è legato a ciascun fluoro con un legame singolo", pairs: 3 },
	{ tex: '\\mathrm{PCl_3}', nome: 'tricloruro di fosforo', atoms: [['P', 1], ['Cl', 3]], bonds: 'il fosforo è legato a ciascun cloro con un legame singolo', pairs: 3 },
	{ tex: '\\mathrm{CH_4}', nome: 'metano', atoms: [['C', 1], ['H', 4]], bonds: 'il carbonio è legato a ciascun idrogeno con un legame singolo', pairs: 4 },
	{ tex: '\\mathrm{SiH_4}', nome: 'silano', atoms: [['Si', 1], ['H', 4]], bonds: 'il silicio è legato a ciascun idrogeno con un legame singolo', pairs: 4 },
	{ tex: '\\mathrm{CCl_4}', nome: 'tetraclorometano', atoms: [['C', 1], ['Cl', 4]], bonds: 'il carbonio è legato a ciascun cloro con un legame singolo', pairs: 4 },
	{ tex: '\\mathrm{CF_4}', nome: 'tetrafluorometano', atoms: [['C', 1], ['F', 4]], bonds: 'il carbonio è legato a ciascun fluoro con un legame singolo', pairs: 4 },
	{ tex: '\\mathrm{OF_2}', nome: 'difluoruro di ossigeno', atoms: [['O', 1], ['F', 2]], bonds: "l'ossigeno è legato a ciascun fluoro con un legame singolo", pairs: 2 },
];

export const MULTIPLE: Mol[] = [
	{ tex: '\\mathrm{O_2}', nome: 'ossigeno', atoms: [['O', 2]], bonds: 'i due atomi sono uniti da un legame doppio', pairs: 2 },
	{ tex: '\\mathrm{N_2}', nome: 'azoto', atoms: [['N', 2]], bonds: 'i due atomi sono uniti da un legame triplo', pairs: 3 },
	{ tex: '\\mathrm{CO_2}', nome: 'diossido di carbonio', atoms: [['C', 1], ['O', 2]], bonds: 'il carbonio è legato a ciascun ossigeno con un legame doppio', pairs: 4 },
	{ tex: '\\mathrm{C_2H_4}', nome: 'etene', atoms: [['C', 2], ['H', 4]], bonds: 'i due atomi di carbonio sono uniti da un legame doppio, e ognuno è legato a due idrogeni con legami singoli', pairs: 6 },
	{ tex: '\\mathrm{C_2H_2}', nome: 'etino', atoms: [['C', 2], ['H', 2]], bonds: 'i due atomi di carbonio sono uniti da un legame triplo, e ognuno è legato a un idrogeno con un legame singolo', pairs: 5 },
	{ tex: '\\mathrm{HCN}', nome: 'cianuro di idrogeno', atoms: [['H', 1], ['C', 1], ['N', 1]], bonds: "il carbonio è legato all'idrogeno con un legame singolo e all'azoto con un legame triplo", pairs: 4 },
	{ tex: '\\mathrm{CH_2O}', nome: 'metanale', atoms: [['C', 1], ['H', 2], ['O', 1]], bonds: "il carbonio è legato a ciascun idrogeno con un legame singolo e all'ossigeno con un legame doppio", pairs: 4 },
];

const total = (m: Mol) => m.atoms.reduce((s, [sym, n]) => s + n * valence(el(sym)), 0);
const sum = (m: Mol) => m.atoms.map(([sym, n]) => (n === 1 ? String(valence(el(sym))) : `${n} \\cdot ${valence(el(sym))}`)).join(' + ');

function count(m: Mol, kind: 'valenza' | 'solitarie'): BuiltE {
	const tot = total(m);
	const lone = tot / 2 - m.pairs;
	const stepTot = `\\text{elettroni di valenza: } ${sum(m)} = ${tot}`;
	const head = `Nella molecola di ${m.nome}, $${m.tex}$, ${m.bonds}.`;
	if (kind === 'valenza') {
		return {
			prompt: 'Scrivi il numero di elettroni.',
			problem: textBlock(`Quanti elettroni di valenza ha in tutto la molecola di ${m.nome}, $${m.tex}$?`),
			solution: String(tot),
			steps: [textBlock("Si sommano gli elettroni di valenza di tutti gli atomi: $1$ per l'idrogeno, $4$, $5$, $6$ e $7$ per i gruppi 14, 15, 16 e 17."), stepTot],
			// one atom of each kind only; eight per atom; the pairs
			numbers: [tot, m.atoms.reduce((s, [sym]) => s + valence(el(sym)), 0), tot / 2, tot + 2, tot - 2, 8 * m.atoms.reduce((s, [, n]) => s + n, 0), tot + 1],
			params: { case: kind, mol: m.tex },
		};
	}
	return {
		prompt: 'Scrivi il numero di coppie solitarie.',
		problem: textBlock(`${head} Quante coppie solitarie ci sono in tutto nella molecola?`),
		solution: String(lone),
		steps: [
			stepTot,
			textBlock(`Le coppie sono $${tot} : 2 = ${tot / 2}$. Le coppie di legame sono $${m.pairs}$: le coppie solitarie sono $${tot / 2} - ${m.pairs} = ${lone}$.`),
		],
		// all the pairs; the bonding pairs; the electrons instead of the pairs; one bond counted as one electron
		numbers: [lone, tot / 2, m.pairs, 2 * lone, tot - m.pairs, lone + 1, lone + 2, 3, 5],
		params: { case: kind, mol: m.tex },
	};
}

function level3(rng: Rng): BuiltE {
	return count(rng.pick(SINGLE), rng.next() < 0.4 ? 'valenza' : 'solitarie');
}

const X2: { sym: string; pairs: number }[] = [
	{ sym: 'H', pairs: 1 },
	{ sym: 'F', pairs: 1 },
	{ sym: 'Cl', pairs: 1 },
	{ sym: 'Br', pairs: 1 },
	{ sym: 'O', pairs: 2 },
	{ sym: 'N', pairs: 3 },
];
const ORDER = ['', 'singolo', 'doppio', 'triplo'];

function level4(rng: Rng): BuiltE {
	const r = rng.next();
	if (r < 0.4) return count(rng.pick(MULTIPLE), 'solitarie');
	if (r < 0.7) {
		const x = rng.pick(X2);
		const e = el(x.sym);
		const v = valence(e);
		return {
			prompt: 'Scrivi il numero di coppie in comune.',
			problem: textBlock(`${cap(art(e.nome))} è nel gruppo $${e.group}$. Quante coppie di elettroni mettono in comune i due atomi della molecola $\\mathrm{${e.sym}_2}$?`),
			solution: String(x.pairs),
			steps: [
				textBlock(e.sym === 'H' ? "A ogni atomo di idrogeno manca $1$ elettrone per arrivare a $2$." : `A ogni atomo ${x.pairs === 1 ? 'manca' : 'mancano'} $8 - ${v} = ${x.pairs}$ ${x.pairs === 1 ? 'elettrone' : 'elettroni'} per l'ottetto.`),
				textBlock(`Ogni coppia in comune ne porta uno a ciascun atomo: ${x.pairs === 1 ? 'serve $1$ coppia, un legame singolo' : `servono $${x.pairs}$ coppie, un legame ${ORDER[x.pairs]}`}.`),
			],
			// the electrons in common; the valence electrons; the lone pairs of one atom
			numbers: [x.pairs, 2 * x.pairs, v, (v - x.pairs) / 2, x.pairs + 1, 4, 0],
			params: { case: 'coppie', el: e.sym },
		};
	}
	// the electrons around an atom of O2 or N2 with a bond of a given order
	const e = el(rng.pick(['O', 'N']));
	const v = valence(e);
	const k = rng.int(1, 8 - v);
	return {
		prompt: 'Scrivi il numero di elettroni.',
		problem: textBlock(`${cap(art(e.nome))} ha $${v}$ elettroni di valenza. Se nella molecola $\\mathrm{${e.sym}_2}$ i due atomi fossero uniti da un legame ${ORDER[k]}, quanti elettroni avrebbe intorno ogni atomo, contando per intero le coppie in comune?`),
		solution: String(v + k),
		steps: [
			textBlock(`Ogni atomo mette in comune $${k}$ ${k === 1 ? 'elettrone' : 'elettroni'} e ne tiene $${v} - ${k} = ${v - k}$ per sé.`),
			textBlock(`Le coppie in comune sono $${k}$, cioè $${2 * k}$ elettroni: in tutto $${v - k} + ${2 * k} = ${v + k}$${v + k === 8 ? ", l'ottetto" : `, meno di $8$: il legame ${ORDER[k]} non è sufficiente`}.`),
		],
		// the shared pairs counted once; the valence electrons; the octet; the electrons kept
		numbers: [v + k, v, v + k === 8 ? 7 : 8, v - k, v + 2 * k, v + k + 1, 9, 10],
		params: { case: 'intorno', el: e.sym, k },
	};
}

// ---------------------------------------------------------------------------
// Level 5: order, length, energy

const FAMILY: Record<string, string> = { C: 'carbonio', N: 'azoto' };

function level5(rng: Rng): BuiltE {
	const sym = rng.pick(['C', 'N']);
	const three = BONDS_63.filter((b) => b.a === sym);
	const r = rng.next();
	if (r < 0.45) {
		const kind = rng.pick(['corto', 'lungo', 'forte', 'debole'] as const);
		const right = kind === 'corto' || kind === 'forte' ? three[2] : three[0];
		const q = { corto: 'il più corto', lungo: 'il più lungo', forte: 'quello con energia di legame maggiore', debole: 'quello con energia di legame minore' }[kind];
		const opt = (o: 1 | 2 | 3) => texOpt(bondTex(sym, sym, o), String(o));
		return {
			prompt: 'Confronta i legami.',
			problem: textBlock(`Tra due atomi di ${FAMILY[sym]} ci può essere un legame singolo, doppio o triplo. Quale dei tre è ${q}?`),
			solution: bondTex(sym, sym, right.order),
			steps: [textBlock(`Tra gli stessi due atomi, al crescere dell'ordine di legame il legame diventa più corto e più forte: ${q} è il ${ORDER[right.order]}, $${bondTex(sym, sym, right.order)}$, con $${right.length}\\,\\text{pm}$ e $${right.energy}\\,\\text{kJ/mol}$.`)],
			answer: choose(rng, opt(right.order), [opt(right.order === 3 ? 1 : 3), opt(2), textOpt('Sono tutti uguali', 'uguali')]),
			params: { case: kind, el: sym },
		};
	}
	if (r < 0.8) {
		// two lengths: which one is the bond of higher order, or the stronger
		const i = rng.int(0, 1);
		const j = rng.int(i + 1, 2);
		const lo = three[i], hi = three[j];
		const ask = rng.pick(['ordine', 'energia'] as const);
		const flip = rng.next() < 0.5;
		const [first, second] = flip ? [hi, lo] : [lo, hi];
		const opt = (pm: number) => textOpt(`Quello di $${pm}\\,\\text{pm}$`, String(pm));
		return {
			prompt: 'Riconosci il legame dai dati.',
			problem: textBlock(
				`Due legami tra atomi di ${FAMILY[sym]} hanno lunghezza $${first.length}\\,\\text{pm}$ e $${second.length}\\,\\text{pm}$: uno è ${ORDER[lo.order]}, l'altro ${ORDER[hi.order]}. ${ask === 'ordine' ? `Quale dei due è il legame ${ORDER[hi.order]}?` : "Quale dei due ha l'energia di legame maggiore?"}`,
			),
			solution: tx(`Quello di $${hi.length}\\,\\text{pm}$`),
			steps: [textBlock(`Tra gli stessi due atomi il legame di ordine maggiore è più corto e più forte: il legame ${ORDER[hi.order]} è quello di $${hi.length}\\,\\text{pm}$${ask === 'energia' ? ", ed è quello con l'energia maggiore" : ''}.`)],
			answer: choose(rng, opt(hi.length), [opt(lo.length), textOpt('Non si può sapere', 'boh'), textOpt('Sono uguali', 'uguali')]),
			params: { case: `dati-${ask}`, el: sym },
		};
	}
	// a double bond is not twice as strong: carbon only (for nitrogen the double is more than twice the single)
	const cc = BONDS_63.filter((b) => b.a === 'C');
	const k = rng.pick([2, 3] as const);
	const right = cc[k - 1].energy;
	const kjmol = (x: number) => texOpt(`${x}\\,\\text{kJ/mol}`, String(x));
	return {
		prompt: "Scegli l'energia di legame.",
		problem: textBlock(`L'energia del legame $${bondTex('C', 'C', 1)}$ è $${cc[0].energy}\\,\\text{kJ/mol}$. Quale di questi valori è l'energia del legame $${bondTex('C', 'C', k)}$?`),
		solution: `${right}\\,\\text{kJ/mol}`,
		steps: [
			textBlock(`Il legame ${ORDER[k]} è più forte del singolo, ma non ${k === 2 ? 'il doppio' : 'il triplo'}: ogni coppia in più lega meno della prima.`),
			textBlock(`Il valore è maggiore di $${cc[0].energy}$ e minore di $${k} \\cdot ${cc[0].energy} = ${k * cc[0].energy}$: $${right}\\,\\text{kJ/mol}$.`),
		],
		// k times the single; the single itself; the single divided by k
		answer: choose(rng, kjmol(right), [kjmol(k * cc[0].energy), kjmol(cc[0].energy), kjmol(cc[0].energy / k)]),
		params: { case: 'energia-doppio', k },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => BuiltE> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

export const legameCovalente: Generator = {
	id: ID,
	title: 'Il legame covalente',
	levels: {
		1: { label: "Che cos'è il legame covalente", constraints: ['fatti della lezione: coppie di legame e solitarie, ordine, formula di Lewis'] },
		2: { label: 'Quanti legami forma un atomo', constraints: ['8 meno gli elettroni di valenza, 1 per l’idrogeno; coppie solitarie'] },
		3: { label: 'Contare gli elettroni di una molecola', constraints: ['molecole con soli legami singoli: elettroni di valenza, coppie solitarie'] },
		4: { label: 'Legami doppi e tripli', constraints: ['coppie in comune, elettroni intorno a un atomo, coppie solitarie con legami multipli'] },
		5: { label: 'Ordine, lunghezza ed energia', constraints: ['più ordine, più corto e più forte; il doppio non è forte il doppio'] },
	},
	generate: generateE(ID, LEVELS),
	check: checkE,
	toChoice: toChoiceE,
};

export default legameCovalente;
