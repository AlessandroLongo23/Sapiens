/**
 * I solidi: ionici, molecolari, covalenti e metallici. Spec: specs/exercises/chim-stato-solido.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/75-chim-stato-solido.md), each one step harder: the facts
 * on crystalline and amorphous solids, the lattice and the cubic cells; the type of solid from the name and formula
 * (the lesson's rules "Dalla formula"); the type from the properties (the procedure "Dalle proprietà"); the particles
 * a cubic cell contains (vertex 1/8, edge 1/4, face 1/2, inside 1), also as an open answer; three solids of three
 * types in order of melting temperature; the facts on the allotropes of carbon.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, type Fact, cap, checkSample, choose, factLevel, fx, generateWith, intOpt, shuffled, textBlock, textOpt } from '../chim3-h';

export const ID = 'chim-stato-solido';

type Kind = 'ionico' | 'molecolare' | 'covalente' | 'metallico';
const KINDS: Kind[] = ['ionico', 'molecolare', 'covalente', 'metallico'];

/** The four types as options, the right one first. */
const kindChoice = (rng: Rng, right: Kind) =>
	choose(rng, textOpt(cap(right)), KINDS.filter((k) => k !== right).map((k) => textOpt(cap(k))));

// ---------------------------------------------------------------------------
// Level 1: crystalline and amorphous, lattice and cell

export const FACTS_1: Fact[] = [
	{ q: 'Come sono disposte le particelle in un solido cristallino?', a: 'In ordine, con uno schema che si ripete', wrong: ['In disordine, come in un liquido bloccato', 'In ordine solo sulla superficie', 'Libere di muoversi in tutto il solido'], why: 'In un solido cristallino le particelle sono disposte in modo ordinato, secondo uno schema che si ripete uguale in tutte le direzioni.' },
	{ q: 'Come sono disposte le particelle in un solido amorfo?', a: 'In disordine, come in un liquido bloccato', wrong: ['In ordine, con uno schema che si ripete', 'In strati piani di esagoni', 'Sui vertici di tanti cubi uguali'], why: 'In un solido amorfo le particelle sono disposte in disordine, come in un liquido che sia stato bloccato.' },
	{ q: 'Che cosa succede alla temperatura mentre un solido cristallino fonde?', a: 'Resta costante', wrong: ['Sale un po\' alla volta', 'Scende un po\' alla volta', 'Prima sale e poi scende'], why: 'In un cristallo tutte le particelle si liberano alla stessa temperatura: il solido fonde a una temperatura precisa, che durante la fusione resta costante.' },
	{ q: 'Come si comporta un solido amorfo quando viene scaldato?', a: 'Rammollisce un po\' alla volta', wrong: ['Fonde a una temperatura precisa', 'Si spacca lungo piani precisi', 'Resta duro finché non bolle'], why: 'In un solido amorfo alcune particelle sono trattenute più debolmente di altre: il solido rammollisce un po\' alla volta, in un intervallo di temperature, senza un punto di fusione.' },
	{ q: 'Quale di questi solidi è amorfo?', a: 'Il vetro', wrong: ['Il sale', 'Il ghiaccio', 'Il quarzo'], why: 'Sono amorfi il vetro, la cera, la gomma e molte plastiche. Il sale, il ghiaccio e il quarzo sono cristallini.' },
	{ q: 'Quale di questi solidi è cristallino?', a: 'Il ghiaccio', wrong: ['Il vetro', 'La cera', 'La gomma'], why: 'Sono cristallini il sale, il ghiaccio, il quarzo, i metalli. Il vetro, la cera e la gomma sono amorfi.' },
	{ q: 'Quale di questi solidi ha le particelle disposte in modo ordinato?', a: 'Il ferro', wrong: ['Il vetro', 'La gomma', 'La cera'], why: 'I metalli sono solidi cristallini. Il vetro, la gomma e la cera sono amorfi.' },
	{ q: 'In chimica, che cosa indica la parola cristallino?', a: 'L\'ordine delle particelle', wrong: ['La trasparenza del solido', 'La lucentezza del solido', 'La durezza del solido'], why: 'In chimica "cristallino" indica l\'ordine delle particelle, non la trasparenza o la lucentezza.' },
	{ q: 'Il vetro "cristallo" dei bicchieri è un solido cristallino?', a: 'No, è un solido amorfo', wrong: ['Sì, perché è trasparente', 'Sì, perché è lucente', 'No, perché si rompe'], why: 'Il vetro "cristallo" dei bicchieri è un solido amorfo: le sue particelle sono in disordine. La trasparenza e la lucentezza non c\'entrano.' },
	{ q: 'Un pezzo di ferro, opaco e grigio, è un solido cristallino?', a: 'Sì, ha le particelle in ordine', wrong: ['No, perché è opaco', 'No, perché non è lucente', 'No, perché è un metallo'], why: 'Un pezzo di ferro è cristallino: conta l\'ordine delle particelle, non l\'aspetto.' },
	{ q: 'In quale di questi solidi il diossido di silicio è cristallino?', a: 'Nel quarzo', wrong: ['Nel vetro di silice', 'Nel ghiaccio secco', 'In nessuno: è sempre amorfo'], why: 'Il diossido di silicio è cristallino nel quarzo ed è amorfo nel vetro di silice.' },
	{ q: 'Come si ottiene il vetro di silice?', a: 'Raffreddando in fretta il quarzo fuso', wrong: ['Raffreddando piano il quarzo fuso', 'Sciogliendo il quarzo in acqua', 'Macinando il quarzo in polvere'], why: 'Il vetro di silice si ottiene raffreddando in fretta il quarzo fuso, senza dare agli atomi il tempo di ordinarsi.' },
	{ q: 'Come si rompe un cristallo?', a: 'Lungo piani precisi', wrong: ['In schegge dalle superfici curve', 'In granelli rotondi', 'Sempre in due parti uguali'], why: 'I cristalli si rompono lungo piani precisi; un pezzo di vetro, che è amorfo, si rompe in schegge dalle superfici curve.' },
	{ q: 'Come si chiama la disposizione ordinata delle particelle di un cristallo?', a: 'Reticolo cristallino', wrong: ['Cella elementare', 'Nodo', 'Forma allotropica'], why: 'La disposizione ordinata delle particelle di un cristallo si chiama reticolo cristallino.' },
	{ q: 'Che cosa sono i nodi di un reticolo cristallino?', a: 'I punti in cui stanno le particelle', wrong: ['I legami tra le particelle', 'Le facce piane del cristallo', 'I piani lungo cui si rompe'], why: 'I nodi del reticolo sono i punti in cui stanno le particelle.' },
	{ q: 'Che cos\'è la cella elementare di un cristallo?', a: 'Il pezzetto più piccolo che ripetuto dà il cristallo', wrong: ['Il punto in cui sta una particella', 'La particella più piccola del cristallo', 'La faccia più grande del cristallo'], why: 'La cella elementare è il pezzetto più piccolo che, ripetuto tante volte nelle tre direzioni, ricostruisce tutto il cristallo.' },
	{ q: 'Dove stanno le particelle nella cella cubica semplice?', a: 'Solo sui vertici', wrong: ['Sui vertici e al centro del cubo', 'Sui vertici e al centro delle facce', 'Solo al centro delle facce'], why: 'Nella cella cubica semplice c\'è una particella su ogni vertice del cubo, e nessun\'altra.' },
	{ q: 'Dove stanno le particelle nella cella cubica a corpo centrato?', a: 'Sui vertici e al centro del cubo', wrong: ['Solo sui vertici', 'Sui vertici e al centro delle facce', 'Solo al centro del cubo'], why: 'Nella cella cubica a corpo centrato, oltre alle particelle sui vertici, ce n\'è una al centro del cubo.' },
	{ q: 'Dove stanno le particelle nella cella cubica a facce centrate?', a: 'Sui vertici e al centro delle facce', wrong: ['Solo sui vertici', 'Sui vertici e al centro del cubo', 'Solo al centro delle facce'], why: 'Nella cella cubica a facce centrate c\'è una particella su ogni vertice e una al centro di ogni faccia.' },
	{ q: 'Che cella elementare ha il rame?', a: 'Cubica a facce centrate', wrong: ['Cubica a corpo centrato', 'Cubica semplice', 'Nessuna: è amorfo'], why: 'La cella cubica a facce centrate è la struttura del rame, dell\'alluminio, dell\'argento e dell\'oro.' },
	{ q: 'Che cella elementare ha il ferro a temperatura ambiente?', a: 'Cubica a corpo centrato', wrong: ['Cubica a facce centrate', 'Cubica semplice', 'Nessuna: è amorfo'], why: 'La cella cubica a corpo centrato è la struttura del ferro a temperatura ambiente e del sodio.' },
	{ q: 'Quale di questi metalli ha la cella cubica a corpo centrato?', a: 'Il sodio', wrong: ['Il rame', 'L\'argento', 'L\'oro'], why: 'Hanno la cella cubica a corpo centrato il ferro a temperatura ambiente e il sodio. Il rame, l\'argento e l\'oro hanno quella a facce centrate.' },
	{ q: 'Quale di questi metalli non ha la cella cubica a facce centrate?', a: 'Il ferro', wrong: ['Il rame', 'L\'alluminio', 'L\'oro'], why: 'Il ferro a temperatura ambiente ha la cella cubica a corpo centrato. Il rame, l\'alluminio, l\'argento e l\'oro hanno quella a facce centrate.' },
	{ q: 'In un cristallo, quanti cubi hanno in comune lo stesso vertice?', a: '8', wrong: ['4', '2', '6'], why: 'Un vertice è in comune a otto cubi: per questo a ciascuna cella spetta un ottavo della particella che ci sta sopra.' },
];

// ---------------------------------------------------------------------------
// Level 2: from the formula to the type of solid

interface Substance {
	kind: Kind;
	name: string; // with its article
	f?: string; // the formula, where the lesson writes one
	why: string;
}

const ionic = (name: string, f: string, metal: string, nonMetal: string): Substance => ({
	kind: 'ionico',
	name,
	f,
	why: `${cap(metal)} è un metallo, ${nonMetal} un non metallo: un composto tra un metallo e un non metallo forma un solido ionico.`,
});
const metal = (name: string, f: string): Substance => ({ kind: 'metallico', name, f, why: `${cap(name)} è un metallo: forma un solido metallico.` });
const network = (name: string, f?: string): Substance => ({
	kind: 'covalente',
	name,
	f,
	why: `${cap(name)} è uno dei pochi casi di rete covalente, da ricordare: tutti gli atomi del cristallo sono uniti da legami covalenti. È un solido covalente.`,
});
const molecular = (name: string, f: string | undefined, why: string): Substance => ({ kind: 'molecolare', name, f, why: `${why} Forma un solido molecolare.` });

export const SUBSTANCES: Substance[] = [
	ionic('il cloruro di sodio', 'NaCl', 'il sodio', 'il cloro'),
	ionic('il bromuro di potassio', 'KBr', 'il potassio', 'il bromo'),
	ionic('il cloruro di potassio', 'KCl', 'il potassio', 'il cloro'),
	ionic("l'ossido di magnesio", 'MgO', 'il magnesio', "l'ossigeno"),
	ionic('il fluoruro di calcio', 'CaF2', 'il calcio', 'il fluoro'),
	ionic("l'ossido di calcio", 'CaO', 'il calcio', "l'ossigeno"),
	ionic('il fluoruro di litio', 'LiF', 'il litio', 'il fluoro'),
	ionic('il bromuro di sodio', 'NaBr', 'il sodio', 'il bromo'),
	ionic('il cloruro di magnesio', 'MgCl2', 'il magnesio', 'il cloro'),
	molecular('il ghiaccio', 'H2O', "L'acqua è un composto tra non metalli, fatto di molecole."),
	molecular('il ghiaccio secco', 'CO2', 'Il diossido di carbonio è un composto tra non metalli, fatto di molecole.'),
	molecular('lo iodio', 'I2', `Lo iodio è un elemento non metallico, fatto di molecole $${fx('I2')}$.`),
	molecular("l'ammoniaca solida", 'NH3', "L'ammoniaca è un composto tra non metalli, fatto di molecole."),
	molecular('lo zolfo', 'S8', `Lo zolfo è un elemento non metallico, fatto di molecole $${fx('S8')}$.`),
	molecular('il metano solido', 'CH4', 'Il metano è un composto tra non metalli, fatto di molecole.'),
	molecular('lo zucchero', undefined, 'Lo zucchero è fatto di molecole, tenute insieme da forze intermolecolari.'),
	molecular('la naftalina', undefined, 'La naftalina è fatta di molecole, tenute insieme da forze intermolecolari.'),
	molecular("l'argon solido", 'Ar', "L'argon è un gas nobile: da solido ha nei nodi atomi singoli, tenuti insieme da forze intermolecolari."),
	network('il diamante'),
	network('il quarzo', 'SiO2'),
	network('il silicio', 'Si'),
	network('il carburo di silicio', 'SiC'),
	metal('il ferro', 'Fe'),
	metal('il rame', 'Cu'),
	metal("l'argento", 'Ag'),
	metal("l'oro", 'Au'),
	metal("l'alluminio", 'Al'),
	metal('il sodio', 'Na'),
	{ kind: 'metallico', name: "l'ottone", why: "L'ottone è una lega di metalli: forma un solido metallico." },
];

function level2(rng: Rng): Built {
	const kind = rng.pick(KINDS);
	const s = rng.pick(SUBSTANCES.filter((x) => x.kind === kind));
	return {
		prompt: 'Scegli il tipo di solido.',
		problem: textBlock(`Che tipo di solido è ${s.name}${s.f ? `, $${fx(s.f)}$` : ''}?`),
		solution: textOpt(cap(kind)).latex,
		steps: [textBlock(s.why)],
		answer: kindChoice(rng, kind),
		params: { case: kind, name: s.name, formula: s.f ?? null },
	};
}

// ---------------------------------------------------------------------------
// Level 3: from the properties to the type of solid

const NEVER = ['Non conduce la corrente né da solido né da fuso.', 'Non conduce la corrente in nessun caso.'];

/** What the unknown solid of each type does: how it conducts, how hard it is, where it melts (°C). */
export const PROFILES: Record<Kind, { conducts: string[]; hard: string[]; melts: [number, number] }> = {
	metallico: {
		conducts: ['Allo stato solido conduce la corrente.', 'Conduce la corrente sia da solido sia da fuso.'],
		hard: ['Si lascia ridurre in lamine.', 'Si piega senza rompersi.', 'È malleabile.'],
		melts: [60, 1600],
	},
	ionico: {
		conducts: ['Allo stato solido non conduce la corrente; fuso la conduce.', 'Non conduce la corrente da solido, ma la conduce da fuso.', 'Allo stato solido non conduce la corrente; sciolto in acqua la conduce.'],
		hard: ['È duro ma fragile.', 'Sotto un colpo si spacca lungo un piano.'],
		melts: [600, 1000],
	},
	molecolare: { conducts: NEVER, hard: ['È tenero.', "Si scalfisce con un'unghia.", 'Si sbriciola con facilità.'], melts: [40, 190] },
	covalente: { conducts: NEVER, hard: ['È durissimo.', 'Riga il vetro.'], melts: [1450, 3500] },
};

function level3(rng: Rng): Built {
	const kind = rng.pick(KINDS);
	const p = PROFILES[kind];
	const temp = `$${rng.int(p.melts[0], p.melts[1])}\\,^\\circ\\text{C}$`;
	const conducts = rng.pick(p.conducts);
	const hard = rng.pick(p.hard);
	const [first, second] = rng.int(0, 1) ? [conducts, hard] : [hard, conducts];
	const dissolved = conducts.includes('sciolto');
	const steps: Record<Kind, string[]> = {
		metallico: ['Conduce la corrente allo stato solido: ha elettroni liberi di muoversi. È un solido metallico.'],
		ionico: [
			'Non conduce da solido, quindi non è metallico.',
			`Conduce ${dissolved ? 'sciolto in acqua' : 'da fuso'}: ci sono ioni, che nel solido erano fermi nei nodi e ora si muovono. È un solido ionico, e la temperatura di fusione alta, ${temp}, lo conferma.`,
		],
		molecolare: [
			'Non conduce in nessun caso: non ha cariche libere, quindi non è né metallico né ionico.',
			`È tenero e fonde a temperatura bassa, ${temp}: è tenuto insieme da forze deboli. È un solido molecolare.`,
		],
		covalente: [
			'Non conduce in nessun caso: non ha cariche libere, quindi non è né metallico né ionico.',
			`È durissimo e fonde a temperatura altissima, ${temp}: per fonderlo bisogna rompere legami covalenti. È un solido covalente.`,
		],
	};
	return {
		prompt: 'Scegli il tipo di solido.',
		problem: textBlock(`Un solido sconosciuto fonde a ${temp}. ${first} ${second} Che tipo di solido è?`),
		solution: textOpt(cap(kind)).latex,
		steps: steps[kind].map((s) => textBlock(s)),
		answer: kindChoice(rng, kind),
		params: { case: kind, conducts, hard },
	};
}

// ---------------------------------------------------------------------------
// Level 4: how many particles in the cell

const CELLS: [number, number, number, number][] = [];
for (const v of [0, 8]) for (const e of [0, 12]) for (const f of [0, 2, 6]) for (const i of [0, 1, 2, 4]) if (v + e + f > 0) CELLS.push([v, e, f, i]);
/** The three cells of the lesson: simple, body-centred, face-centred. */
const LESSON_CELLS: [number, number, number, number][] = [[8, 0, 0, 0], [8, 0, 0, 1], [8, 0, 6, 0]];

const RULE = 'Per una cella una particella vale $\\frac{1}{8}$ su un vertice, $\\frac{1}{4}$ su uno spigolo, $\\frac{1}{2}$ su una faccia e $1$ all\'interno.';

function level4(rng: Rng): Built {
	const [v, e, f, i] = rng.int(1, 4) === 1 ? rng.pick(LESSON_CELLS) : rng.pick(CELLS);
	const n = v / 8 + e / 4 + f / 2 + i;
	const places: [number, string][] = [[v, 'sui vertici'], [e, 'sugli spigoli'], [f, 'sulle facce'], [i, "all'interno"]];
	const items = places.filter(([k]) => k > 0).map(([k, where], j) => `$${k}$ ${j === 0 ? 'particelle ' : ''}${where}`);
	const list = items.length === 1 ? items[0] : `${items.slice(0, -1).join(', ')} e ${items.at(-1)}`;
	const terms: [string, number][] = [];
	if (v) terms.push(['8 \\cdot \\frac{1}{8}', 1]);
	if (e) terms.push(['12 \\cdot \\frac{1}{4}', 3]);
	if (f) terms.push([`${f} \\cdot \\frac{1}{2}`, f / 2]);
	if (i) terms.push([String(i), i]);
	const sum = terms.map(([s]) => s).join(' + ');
	const values = terms.map(([, x]) => x).join(' + ');
	const count = terms.length === 1 ? `${sum} = ${n}` : terms.length === 2 ? `${sum} = ${values} = ${n}` : `\\begin{aligned} &${sum} \\\\ &= ${values} = ${n} \\end{aligned}`;
	const wrong = [
		v + e + f + i, // every particle counted whole
		n + v / 8, // vertices counted a quarter each
		n + f / 2, // faces counted whole
		n + (3 * v) / 8, // vertices counted a half each
		n + e / 4, // edges counted a half each
		n - i, // the particles inside left out
		n + 1,
		n + 2,
		n - 1,
	].filter((x) => x > 0);
	return {
		prompt: 'Conta le particelle della cella.',
		problem: textBlock(`In una cella cubica ci sono ${list}. Quante particelle contiene la cella?`),
		solution: String(n),
		steps: [textBlock(RULE), count, textBlock(`La cella contiene $${n}$ ${n === 1 ? 'particella' : 'particelle'}.`)],
		answer: choose(rng, intOpt(n), wrong.map(intOpt)),
		params: { case: 'cella', vertici: v, spigoli: e, facce: f, interno: i },
		open: String(n),
	};
}

// ---------------------------------------------------------------------------
// Level 5: ordering the melting temperatures

interface Solid {
	name: string; // as the problem writes it
	plain: string; // the name alone
	art: string; // the name with its article
	short: string; // as the options write it
	temp: string; // what the lesson says of its melting
	lo: number; // the temperature, or the least it can be (°C)
	won?: string; // what is overcome to melt it, where the lesson names it
}

const C = (x: string) => `$${x}\\,^\\circ\\text{C}$`;

export const MOLECULAR: Solid[] = [
	{ name: `iodio $${fx('I2')}$`, plain: 'iodio', art: 'lo iodio', short: `$${fx('I2')}$`, temp: C('114'), lo: 114, won: 'forze di London' },
	{ name: 'ghiaccio', plain: 'ghiaccio', art: 'il ghiaccio', short: 'ghiaccio', temp: C('0'), lo: 0, won: 'legami a idrogeno' },
	{ name: 'naftalina', plain: 'naftalina', art: 'la naftalina', short: 'naftalina', temp: C('80'), lo: 80 },
	{ name: 'zucchero', plain: 'zucchero', art: 'lo zucchero', short: 'zucchero', temp: C('186'), lo: 186 },
];
export const IONIC: Solid[] = [
	{ name: `cloruro di sodio $${fx('NaCl')}$`, plain: 'cloruro di sodio', art: 'il cloruro di sodio', short: `$${fx('NaCl')}$`, temp: C('801'), lo: 801 },
	{ name: `cloruro di potassio $${fx('KCl')}$`, plain: 'cloruro di potassio', art: 'il cloruro di potassio', short: `$${fx('KCl')}$`, temp: C('770'), lo: 770 },
	{ name: `ossido di magnesio $${fx('MgO')}$`, plain: 'ossido di magnesio', art: "l'ossido di magnesio", short: `$${fx('MgO')}$`, temp: C('2852'), lo: 2852 },
];
export const NETWORK: Solid[] = [
	{ name: 'diamante', plain: 'diamante', art: 'il diamante', short: 'diamante', temp: `oltre ${C('3500')}`, lo: 3500 },
	{ name: `quarzo $${fx('SiO2')}$`, plain: 'quarzo', art: 'il quarzo', short: 'quarzo', temp: `circa ${C('1700')}`, lo: 1700 },
	{ name: `carburo di silicio $${fx('SiC')}$`, plain: 'carburo di silicio', art: 'il carburo di silicio', short: `$${fx('SiC')}$`, temp: `sopra i ${C('2500')}`, lo: 2500 },
];

function level5(rng: Rng): Built {
	const m = rng.pick(MOLECULAR);
	const io = rng.pick(IONIC);
	// the ionic solid must melt below the covalent one: magnesium oxide goes with diamond only
	const c = rng.pick(NETWORK.filter((x) => x.lo > io.lo));
	const order = (xs: Solid[]) => textOpt(xs.map((x) => x.short).join(', '));
	const others = shuffled(rng, [[io, m, c], [m, c, io], [c, m, io], [io, c, m]]);
	return {
		prompt: "Scegli l'ordine giusto.",
		problem: textBlock(`Metti in ordine di temperatura di fusione crescente: ${shuffled(rng, [m, io, c]).map((x) => x.name).join(', ')}.`),
		solution: order([m, io, c]).latex,
		steps: [
			textBlock(`${cap(m.art)} è un solido molecolare, ${io.art} è ionico, ${c.art} è covalente.`),
			textBlock(`Per fondere il primo si vincono ${m.won ?? 'forze intermolecolari'}, che sono deboli; per il secondo l'attrazione tra ioni; per il terzo si rompono legami covalenti.`),
			textBlock(`L'ordine è ${m.plain} (${m.temp}), ${io.plain} (${io.temp}), ${c.plain} (${c.temp}).`),
		],
		answer: choose(rng, order([m, io, c]), [order([c, io, m]), ...others.map(order)]),
		params: { case: 'ordine', molecolare: m.plain, ionico: io.plain, covalente: c.plain },
	};
}

// ---------------------------------------------------------------------------
// Level 6: the forms of carbon

export const FACTS_6: Fact[] = [
	{ q: 'Che cosa sono le forme allotropiche di un elemento?', a: 'Forme dello stesso elemento con gli atomi legati in modi diversi', wrong: ['Atomi dello stesso elemento con un numero diverso di neutroni', 'Composti diversi con la stessa formula', 'Ioni dello stesso elemento con carica diversa'], why: 'Uno stesso elemento può esistere in forme diverse, con gli atomi legati in modi diversi: si chiamano forme allotropiche.' },
	{ q: 'A quanti atomi è legato ogni atomo di carbonio nel diamante?', a: '4', wrong: ['3', '2', '6'], why: 'Nel diamante ogni atomo di carbonio è legato con quattro legami covalenti ad altri quattro atomi.' },
	{ q: 'A quanti atomi è legato ogni atomo di carbonio nella grafite?', a: '3', wrong: ['4', '2', '6'], why: 'Nella grafite ogni atomo è legato a tre soli atomi, e forma strati piani di esagoni.' },
	{ q: 'Nel diamante, come sono disposti i quattro atomi legati a un atomo di carbonio?', a: 'Ai vertici di un tetraedro', wrong: ['Ai vertici di un quadrato', 'Ai vertici di un esagono', 'In fila, uno dopo l\'altro'], why: 'Nel diamante i quattro atomi legati a ogni atomo di carbonio sono disposti ai vertici di un tetraedro.' },
	{ q: 'Che struttura ha la grafite?', a: 'Strati piani di esagoni', wrong: ['Una rete in tre dimensioni', 'Molecole chiuse a gabbia', 'Uno strato arrotolato a cilindro'], why: 'Nella grafite gli atomi formano strati piani di esagoni, sovrapposti. La rete in tre dimensioni è quella del diamante.' },
	{ q: 'Perché la grafite conduce la corrente?', a: 'Un elettrone per atomo è libero nello strato', wrong: ['Contiene ioni liberi di muoversi', 'Gli strati scorrono uno sull\'altro', 'Contiene atomi di un metallo'], why: 'Nella grafite il quarto elettrone di valenza di ogni atomo non è bloccato in un legame: è libero di muoversi lungo tutto lo strato.' },
	{ q: 'Perché il diamante non conduce la corrente?', a: 'Tutti gli elettroni di valenza sono nei legami', wrong: ['È troppo duro', 'È trasparente', 'Ha gli ioni fermi nei nodi'], why: 'Nel diamante tutti e quattro gli elettroni di valenza di ogni atomo sono impegnati nei legami: non ci sono cariche libere.' },
	{ q: 'Che cosa tiene uniti tra loro gli strati della grafite?', a: 'Forze di London', wrong: ['Legami covalenti', 'Legami ionici', 'Legami a idrogeno'], why: 'Tra uno strato e l\'altro della grafite ci sono solo forze di London. I legami covalenti uniscono gli atomi dentro uno strato.' },
	{ q: 'Che cosa unisce gli atomi dentro uno strato di grafite?', a: 'Legami covalenti', wrong: ['Forze di London', 'Legami ionici', 'Legami a idrogeno'], why: 'Dentro uno strato gli atomi sono uniti da legami covalenti. Le forze di London agiscono tra uno strato e l\'altro.' },
	{ q: 'Perché la grafite è tenera?', a: 'Gli strati scorrono uno sull\'altro', wrong: ['I legami dentro gli strati sono deboli', 'Ha un elettrone libero per atomo', 'È fatta di molecole a gabbia'], why: 'Tra gli strati ci sono solo forze di London, e gli strati scorrono con facilità l\'uno sull\'altro: per questo la grafite è tenera.' },
	{ q: 'Quale forma del carbonio è la mina delle matite?', a: 'La grafite', wrong: ['Il diamante', 'Il fullerene', 'Il nanotubo'], why: 'La grafite è tenera e lascia il segno sulla carta: è la mina delle matite.' },
	{ q: 'Che aspetto ha la grafite?', a: 'Nera e opaca', wrong: ['Trasparente e incolore', 'Bianca e opaca', 'Gialla e lucente'], why: 'La grafite è nera e opaca; il diamante è trasparente e incolore.' },
	{ q: 'Quale ha la densità maggiore, il diamante o la grafite?', a: 'Il diamante', wrong: ['La grafite', 'Hanno la stessa densità', 'Dipende dal pezzo'], why: 'Il diamante ha densità $3{,}51\\,\\text{g/cm}^3$, la grafite $2{,}26\\,\\text{g/cm}^3$.' },
	{ q: 'Che tipo di solido è il fullerene?', a: 'Molecolare', wrong: ['Covalente', 'Ionico', 'Metallico'], why: 'Nei fullereni gli atomi formano molecole chiuse a gabbia: essendo fatto di molecole, il fullerene solido è un solido molecolare.' },
	{ q: 'Quanti atomi di carbonio ha la molecola del fullerene più noto?', a: '60', wrong: ['12', '20', '32'], why: 'Il fullerene più noto è $\\mathrm{C_{60}}$: ha $60$ atomi, disposti in $12$ pentagoni e $20$ esagoni.' },
	{ q: 'Come sono disposti gli atomi nella molecola del fullerene più noto?', a: 'In pentagoni ed esagoni', wrong: ['Solo in esagoni', 'Solo in pentagoni', 'In tetraedri'], why: 'Nella molecola $\\mathrm{C_{60}}$ gli atomi sono disposti in $12$ pentagoni e $20$ esagoni, come le cuciture di un pallone da calcio.' },
	{ q: 'Quale di queste forme del carbonio è fatta di molecole?', a: 'Il fullerene', wrong: ['Il diamante', 'La grafite', 'Il grafene'], why: 'Nei fullereni gli atomi formano molecole chiuse a gabbia. Nel diamante e nella grafite i legami covalenti proseguono da un atomo all\'altro.' },
	{ q: 'Che cos\'è il grafene?', a: 'Un singolo strato di grafite', wrong: ['Uno strato di grafite arrotolato', 'Una molecola chiusa a gabbia', 'Una lamina sottile di diamante'], why: 'Il grafene è un singolo strato di grafite, spesso un solo atomo.' },
	{ q: 'Che cos\'è un nanotubo di carbonio?', a: 'Uno strato arrotolato a cilindro', wrong: ['Un singolo strato piano', 'Una molecola chiusa a gabbia', 'Un filo sottile di diamante'], why: 'Un nanotubo è uno strato di grafite arrotolato a formare un cilindro.' },
	{ q: 'Quale di queste è una forma allotropica dell\'ossigeno?', a: 'L\'ozono', wrong: ['L\'acqua', 'Il ghiaccio secco', 'Il quarzo'], why: 'L\'ossigeno esiste come $\\mathrm{O_2}$ e come ozono, $\\mathrm{O_3}$: sono due forme allotropiche dello stesso elemento.' },
];

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = {
	1: factLevel(FACTS_1),
	2: level2,
	3: level3,
	4: level4,
	5: level5,
	6: factLevel(FACTS_6),
};

function check(sample: Sample): string[] {
	return checkSample(sample);
}

export const chimStatoSolido: Generator = {
	id: ID,
	title: 'I solidi: ionici, molecolari, covalenti e metallici',
	levels: {
		1: { label: 'Cristallini e amorfi, reticolo e cella', constraints: ['domande fisse della lezione'] },
		2: { label: 'Dalla formula al tipo di solido', constraints: ['le regole "Dalla formula"; la grafite non compare'] },
		3: { label: 'Dalle proprietà al tipo di solido', constraints: ['conduzione, durezza, temperatura di fusione in intervalli separati'] },
		4: { label: 'Quante particelle nella cella', constraints: ['vertice 1/8, spigolo 1/4, faccia 1/2, interno 1', 'almeno una posizione condivisa occupata'] },
		5: { label: 'Ordinare le temperature di fusione', constraints: ['un molecolare, uno ionico, un covalente', "l'ossido di magnesio solo con il diamante"] },
		6: { label: 'Le forme del carbonio', constraints: ['domande fisse della lezione'] },
	},
	generate: generateWith(ID, LEVELS, check),
	// a level answered with a number keeps its four options in the sample
	toChoice: (sample) => {
		if (sample.answer.kind === 'choice') return sample.answer;
		if (!sample.choice) throw new Error(`${ID}: the sample has no multiple-choice form`);
		return sample.choice;
	},
	check,
};

export default chimStatoSolido;
