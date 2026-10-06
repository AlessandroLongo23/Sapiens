/**
 * Il legame a idrogeno. Spec: specs/exercises/chim-legame-idrogeno.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/73-chim-legame-idrogeno.md), each one step harder: which
 * of four substances forms hydrogen bonds between its molecules (or which one does not); how many hydrogens are bonded
 * to F, O, N and how many lone pairs sit on F, O, N; in which direction two different molecules bond (donor and
 * acceptor); which of two substances boils higher, and why; the hydrogen bonds of a stretch of DNA. Levels 2 and 5 also
 * give their answer as a number.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { type Built, cap, checkSample, choose, fx, generateWith, intOpt, redraw, shuffled, t, textBlock, textOpt } from '../chim3-h';

export const ID = 'chim-legame-idrogeno';

// ---------------------------------------------------------------------------
// The molecules of the lesson

interface Mol {
	f: string;
	/** The name with its article: "l'acqua", "il metanolo". */
	art: string;
	/** Hydrogens bonded to F, O, N; all the hydrogens. */
	h: number;
	allH: number;
	/** Lone pairs on F, O, N; lone pairs counted on S, Cl, Br too; atoms of F, O, N. */
	lp: number;
	lpAll: number;
	fon: number;
	/** After "In $f$ ": to which atom the hydrogens are bonded, and the lone pairs. */
	why: string;
}

const MOLS: Mol[] = [
	{ f: 'H2O', art: "l'acqua", h: 2, allH: 2, lp: 2, lpAll: 2, fon: 1, why: "gli idrogeni sono legati all'ossigeno, che ha due coppie solitarie" },
	{ f: 'NH3', art: "l'ammoniaca", h: 3, allH: 3, lp: 1, lpAll: 1, fon: 1, why: "gli idrogeni sono legati all'azoto, che ha una coppia solitaria" },
	{ f: 'HF', art: 'il fluoruro di idrogeno', h: 1, allH: 1, lp: 3, lpAll: 3, fon: 1, why: "l'idrogeno è legato al fluoro, che ha tre coppie solitarie" },
	{ f: 'CH3OH', art: 'il metanolo', h: 1, allH: 4, lp: 2, lpAll: 2, fon: 1, why: "un idrogeno è legato all'ossigeno, che ha due coppie solitarie" },
	{ f: 'CH3CH2OH', art: "l'etanolo", h: 1, allH: 6, lp: 2, lpAll: 2, fon: 1, why: "un idrogeno è legato all'ossigeno, che ha due coppie solitarie" },
	{ f: 'CH4', art: 'il metano', h: 0, allH: 4, lp: 0, lpAll: 0, fon: 0, why: 'gli idrogeni sono legati al carbonio, e non ci sono coppie solitarie' },
	{ f: 'H2S', art: 'il solfuro di idrogeno', h: 0, allH: 2, lp: 0, lpAll: 2, fon: 0, why: 'gli idrogeni sono legati allo zolfo, che non è tra i tre elementi' },
	{ f: 'HCl', art: 'il cloruro di idrogeno', h: 0, allH: 1, lp: 0, lpAll: 3, fon: 0, why: "l'idrogeno è legato al cloro, che non è tra i tre elementi" },
	{ f: 'HBr', art: 'il bromuro di idrogeno', h: 0, allH: 1, lp: 0, lpAll: 3, fon: 0, why: "l'idrogeno è legato al bromo, che non è tra i tre elementi" },
	{ f: 'PH3', art: 'la fosfina', h: 0, allH: 3, lp: 0, lpAll: 1, fon: 0, why: 'gli idrogeni sono legati al fosforo, che non è tra i tre elementi' },
	{ f: 'SiH4', art: 'il silano', h: 0, allH: 4, lp: 0, lpAll: 0, fon: 0, why: 'gli idrogeni sono legati al silicio, che non è tra i tre elementi' },
	{ f: 'CH3OCH3', art: "l'etere dimetilico", h: 0, allH: 6, lp: 2, lpAll: 2, fon: 1, why: "l'ossigeno ha due coppie solitarie, ma tutti gli idrogeni sono legati al carbonio" },
	{ f: 'CH3COCH3', art: "l'acetone", h: 0, allH: 6, lp: 2, lpAll: 2, fon: 1, why: "l'ossigeno ha due coppie solitarie, ma tutti gli idrogeni sono legati al carbonio" },
	{ f: 'C3H8', art: 'il propano', h: 0, allH: 8, lp: 0, lpAll: 0, fon: 0, why: 'gli idrogeni sono legati al carbonio, e non ci sono coppie solitarie' },
];
const mol = (f: string): Mol => {
	const m = MOLS.find((x) => x.f === f);
	if (!m) throw new Error(`${ID}: no molecule ${f}`);
	return m;
};

const nome = (m: Mol) => m.art.replace(/^(il |la |l')/, '');
/** "d'acqua" as the lesson writes it, "di metanolo". */
const di = (m: Mol) => (m.f === 'H2O' ? "d'acqua" : `di ${nome(m)}`);
/** "all'acqua", "al metanolo". */
const a = (m: Mol) => m.art.replace(/^il /, 'al ').replace(/^la /, 'alla ').replace(/^l'/, "all'");
/** The substance forms hydrogen bonds between its own molecules: both conditions. */
const bonds = (m: Mol) => m.h > 0 && m.lp > 0;
const FON = '$\\mathrm{F}$, $\\mathrm{O}$ o $\\mathrm{N}$';

// ---------------------------------------------------------------------------
// Level 1: which substance forms hydrogen bonds

function level1(rng: Rng): Built {
	const yes = shuffled(rng, MOLS.filter(bonds));
	const no = shuffled(rng, MOLS.filter((m) => !bonds(m)));
	const forma = rng.next() < 0.6;
	const right = forma ? yes[0] : no[0];
	const others = forma ? no.slice(0, 3) : yes.slice(0, 3);
	const opt = (m: Mol) => textOpt(`$${fx(m.f)}$, ${nome(m)}`, m.f);
	return {
		prompt: forma ? 'Trova la sostanza che forma legami a idrogeno.' : 'Trova la sostanza che non forma legami a idrogeno.',
		problem: textBlock(`Tra le molecole di quale di queste sostanze ${forma ? '' : 'non '}si formano legami a idrogeno?`),
		solution: opt(right).latex,
		steps: forma
			? [
					textBlock(`In $${fx(right.f)}$ ${right.why}: tra le sue molecole si formano legami a idrogeno.`),
					textBlock(`Nelle altre tre sostanze nessun idrogeno è legato a ${FON}.`),
				]
			: [
					textBlock(`In $${fx(right.f)}$ ${right.why}: tra le sue molecole non si formano legami a idrogeno.`),
					textBlock(`Le altre tre hanno un idrogeno legato a ${FON}, e quell'atomo ha almeno una coppia solitaria.`),
				],
		answer: choose(rng, opt(right), others.map(opt)),
		params: { case: forma ? 'forma' : 'non-forma', right: right.f, others: others.map((m) => m.f) },
	};
}

// ---------------------------------------------------------------------------
// Level 2: hydrogens that count, lone pairs that count

/** The molecules of the lesson's table, with ethanol and acetone: why the hydrogens count or not, and the lone pairs. */
const COUNTED: Record<string, { h: string; lp: string }> = {
	H2O: { h: "I due idrogeni sono legati all'ossigeno: contano tutti e due.", lp: "L'ossigeno ha due coppie solitarie." },
	NH3: { h: "I tre idrogeni sono legati all'azoto: contano tutti e tre.", lp: "L'azoto ha una coppia solitaria." },
	HF: { h: "L'unico idrogeno è legato al fluoro.", lp: 'Il fluoro ha tre coppie solitarie.' },
	CH3OH: { h: 'Il metanolo ha quattro idrogeni, ma tre sono legati al carbonio: conta solo quello del gruppo $\\mathrm{OH}$.', lp: "L'ossigeno ha due coppie solitarie, il carbonio nessuna." },
	CH3CH2OH: { h: "L'etanolo ha sei idrogeni, ma cinque sono legati ai due carboni: conta solo quello del gruppo $\\mathrm{OH}$.", lp: "L'ossigeno ha due coppie solitarie, i carboni nessuna." },
	CH4: { h: 'I quattro idrogeni sono legati al carbonio: non ne conta nessuno.', lp: `Nel metano non ci sono atomi di ${FON}, e il carbonio non ha coppie solitarie.` },
	H2S: { h: 'I due idrogeni sono legati allo zolfo, che non è tra i tre elementi: non ne conta nessuno.', lp: 'Lo zolfo ha due coppie solitarie, ma non è tra i tre elementi: non contano.' },
	CH3OCH3: { h: 'Tutti e sei gli idrogeni sono legati al carbonio: non ne conta nessuno.', lp: "L'ossigeno ha due coppie solitarie, i carboni nessuna." },
	CH3COCH3: { h: 'Tutti e sei gli idrogeni sono legati ai carboni: non ne conta nessuno.', lp: "L'ossigeno ha due coppie solitarie, i carboni nessuna." },
};

function level2(rng: Rng): Built {
	const m = mol(rng.pick(Object.keys(COUNTED)));
	const idrogeni = rng.next() < 0.5;
	const form = rng.int(0, 1);
	const who = `${di(m)}, $${fx(m.f)}$`;
	const n = idrogeni ? m.h : m.lp;
	const prose = idrogeni
		? form === 0
			? `Quanti atomi di idrogeno della molecola ${who}, sono legati a un atomo di fluoro, ossigeno o azoto?`
			: `Nella molecola ${who}, quanti atomi di idrogeno possono formare un legame a idrogeno con un'altra molecola?`
		: form === 0
			? `Quante coppie solitarie ci sono in tutto sugli atomi di fluoro, ossigeno o azoto della molecola ${who}?`
			: `Nella molecola ${who}, quante coppie solitarie possono ricevere l'idrogeno di un'altra molecola in un legame a idrogeno?`;
	// all the hydrogens, the other count, the atoms of F, O, N; the lone pairs on S too, the electrons of the pairs
	const errors = idrogeni ? [m.allH, m.lp, m.fon] : [m.lpAll, m.h, 2 * m.lp, m.fon];
	const fillers = [...shuffled(rng, [n + 1, n + 2, n - 1].filter((x) => x >= 0)), 0, 1, 2, 3, 4];
	return {
		prompt: idrogeni ? 'Conta gli idrogeni legati a F, O o N.' : 'Conta le coppie solitarie su F, O o N.',
		problem: textBlock(prose),
		solution: String(n),
		steps: [
			textBlock(idrogeni ? COUNTED[m.f].h : COUNTED[m.f].lp),
			textBlock(idrogeni ? `Gli idrogeni legati a ${FON} sono $${n}$.` : `Le coppie solitarie su ${FON} sono $${n}$.`),
		],
		answer: choose(rng, intOpt(n), [...errors, ...fillers].map(intOpt)),
		params: { case: idrogeni ? 'idrogeni' : 'coppie', formula: m.f, form },
		open: String(n),
	};
}

// ---------------------------------------------------------------------------
// Level 3: between two different molecules

const PAIRED = ['H2O', 'NH3', 'HF', 'CH3OH', 'CH3OCH3', 'CH3COCH3', 'CH4', 'H2S'];
/** What makes each one a donor, and an acceptor. */
const DONOR: Record<string, string> = { H2O: "idrogeni legati all'ossigeno", NH3: "idrogeni legati all'azoto", HF: 'un idrogeno legato al fluoro', CH3OH: "un idrogeno legato all'ossigeno" };
const ACCEPTOR: Record<string, string> = {
	H2O: "due coppie solitarie sull'ossigeno",
	NH3: "una coppia solitaria sull'azoto",
	HF: 'tre coppie solitarie sul fluoro',
	CH3OH: "due coppie solitarie sull'ossigeno",
	CH3OCH3: "due coppie solitarie sull'ossigeno",
	CH3COCH3: "due coppie solitarie sull'ossigeno",
};

function role(m: Mol): string {
	const name = cap(m.art);
	if (m.h > 0 && m.lp > 0) return `${name} ha ${DONOR[m.f]} e ${ACCEPTOR[m.f]}: può fare da donatore e da accettore.`;
	if (m.lp > 0) return `${name} ha ${ACCEPTOR[m.f]}, ma i suoi idrogeni sono tutti legati al carbonio: può fare solo da accettore.`;
	return `${name} ha ${m.why.replace(/^gli idrogeni sono legati/, 'gli idrogeni legati').replace(', e non ci sono coppie solitarie', ' e nessuna coppia solitaria')}: non può fare né da donatore né da accettore.`;
}

type Verso = 'due' | 'A' | 'B' | 'nessuno';
function verso(x: Mol, y: Mol): Verso {
	const xy = x.h > 0 && y.lp > 0;
	const yx = y.h > 0 && x.lp > 0;
	return xy && yx ? 'due' : xy ? 'A' : yx ? 'B' : 'nessuno';
}

function level3(rng: Rng): Built {
	const r = rng.next();
	const want = r < 0.3 ? 'due-versi' : r < 0.7 ? 'un-verso' : 'nessun-verso';
	const kind = (v: Verso) => (v === 'due' ? 'due-versi' : v === 'nessuno' ? 'nessun-verso' : 'un-verso');
	const pairs = PAIRED.flatMap((x) => PAIRED.filter((y) => y !== x).map((y) => [mol(x), mol(y)] as const)).filter(([x, y]) => kind(verso(x, y)) === want);
	const [x, y] = rng.pick(pairs);
	const v = verso(x, y);
	const opts: Record<Verso, ChoiceOption> = {
		due: textOpt('In tutti e due i versi', 'due'),
		A: textOpt(`Solo con ${x.art} come donatore`, 'A'),
		B: textOpt(`Solo con ${y.art} come donatore`, 'B'),
		nessuno: textOpt('In nessuno dei due versi', 'nessuno'),
	};
	const [don, acc] = v === 'A' ? [x, y] : [y, x];
	const end =
		v === 'due'
			? 'Il legame a idrogeno si può formare in tutti e due i versi.'
			: v === 'nessuno'
				? "In ogni verso manca il donatore o l'accettore: tra le due non si forma nessun legame a idrogeno."
				: `Il legame a idrogeno si forma solo quando ${don.art} dona l'idrogeno ${a(acc)}.`;
	return {
		prompt: 'Trova chi fa da donatore e chi da accettore.',
		problem: textBlock(`Una molecola ${di(x)}, $${fx(x.f)}$, è vicina a una ${di(y)}, $${fx(y.f)}$. In quale verso si può formare un legame a idrogeno tra le due?`),
		solution: opts[v].latex,
		steps: [textBlock(role(x)), textBlock(role(y)), textBlock(end)],
		answer: choose(rng, opts[v], (['due', 'A', 'B', 'nessuno'] as Verso[]).filter((k) => k !== v).map((k) => opts[k])),
		params: { case: want, a: x.f, b: y.f, verso: v },
	};
}

// ---------------------------------------------------------------------------
// Level 4: which one boils higher, and why

/** Boiling temperatures in °C and electrons, from the lesson's table of the four groups and its second example. */
const BOIL: Record<string, [number, number]> = {
	H2O: [100, 10], H2S: [-60, 18], H2Se: [-41, 36], H2Te: [-2, 54], CH4: [-162, 10],
	NH3: [-33, 10], PH3: [-88, 18], AsH3: [-62, 36],
	HF: [20, 10], HCl: [-85, 18], HBr: [-67, 36], HI: [-35, 54],
	CH3CH2OH: [78, 26], CH3OCH3: [-25, 26], C3H8: [-42, 26],
};
/** The substance with hydrogen bonds, then the one without. */
const BOILING_PAIRS: [string, string][] = [
	['H2O', 'H2S'], ['H2O', 'H2Se'], ['H2O', 'H2Te'], ['H2O', 'CH4'],
	['NH3', 'PH3'], ['NH3', 'AsH3'], ['NH3', 'CH4'],
	['HF', 'HCl'], ['HF', 'HBr'], ['HF', 'HI'],
	['CH3CH2OH', 'CH3OCH3'], ['CH3CH2OH', 'C3H8'],
];

/** An option on more lines: the formula, then the reason, 24 characters a line. */
function reasonOpt(formula: string, reason: string, value: string): ChoiceOption {
	const lines: string[] = [];
	for (const w of reason.split(' ')) {
		const last = lines.at(-1);
		if (last !== undefined && last.length + 1 + w.length <= 24) lines[lines.length - 1] = `${last} ${w}`;
		else lines.push(w);
	}
	return { latex: `\\begin{gathered} ${[fx(formula), ...lines.map(t)].join(' \\\\ ')} \\end{gathered}`, values: [value] };
}

const celsius = (x: number) => `$${x}\\,^\\circ\\text{C}$`;

function level4(rng: Rng): Built {
	const k = rng.int(0, BOILING_PAIRS.length - 1);
	const [hb, other] = BOILING_PAIRS[k];
	const [tHb, eHb] = BOIL[hb];
	const [tOther, eOther] = BOIL[other];
	if (tHb - tOther < 20) redraw();
	const [first, second] = rng.next() < 0.5 ? [hb, other] : [other, hb];
	const form = rng.int(0, 1);
	const right = reasonOpt(hb, 'perché forma legami a idrogeno', 'legami a idrogeno');
	return {
		prompt: 'Scegli la sostanza e la ragione.',
		problem: textBlock(
			form === 0
				? `Quale delle due sostanze bolle a temperatura più alta, $${fx(first)}$ o $${fx(second)}$, e perché?`
				: `Tra $${fx(first)}$ e $${fx(second)}$, quale sostanza ha la temperatura di ebollizione più alta, e perché?`,
		),
		solution: right.latex,
		steps: [
			textBlock(`$${fx(hb)}$ bolle a ${celsius(tHb)}, $${fx(other)}$ a ${celsius(tOther)}.`),
			textBlock(`Tra le molecole di $${fx(hb)}$ si formano legami a idrogeno, tra quelle di $${fx(other)}$ no: per far bollire $${fx(hb)}$ bisogna romperli, e serve una temperatura più alta.`),
			textBlock('I legami covalenti non contano: quando una sostanza bolle le sue molecole restano intere.'),
		],
		answer: choose(rng, right, [
			eOther > eHb ? reasonOpt(other, 'perché ha più elettroni', 'elettroni') : textOpt('Nessuna delle due: hanno gli stessi elettroni', 'stessi elettroni'),
			reasonOpt(other, 'perché è più polare', 'polare'),
			reasonOpt(hb, 'perché i suoi legami covalenti sono più forti', 'covalenti'),
		]),
		params: { case: 'ebollizione', hb, other, first, form },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the hydrogen bonds of a stretch of DNA

function level5(rng: Rng): Built {
	const numeri = rng.next() < 0.5;
	let at: number;
	let gc: number;
	let prose: string;
	let count: string;
	let seq = '';
	if (numeri) {
		do {
			at = rng.int(2, 15);
			gc = rng.int(2, 15);
		} while (at === gc);
		prose = `Un tratto di DNA è lungo $${at + gc}$ coppie di basi: $${at}$ sono coppie adenina-timina e $${gc}$ guanina-citosina. Quanti legami a idrogeno tengono uniti i due filamenti in quel tratto?`;
		count = 'Ogni coppia A-T ha $2$ legami a idrogeno, ogni coppia G-C ne ha $3$.';
	} else {
		let bases: string[];
		do {
			bases = Array.from({ length: rng.int(4, 8) }, () => rng.pick(['A', 'T', 'G', 'C']));
			at = bases.filter((b) => b === 'A' || b === 'T').length;
			gc = bases.length - at;
		} while (at === gc || at === 0 || gc === 0);
		seq = bases.join('');
		prose = `Su un filamento di un tratto di DNA si leggono, in ordine, le basi $\\mathrm{${bases.join('\\,')}}$. Ogni base è appaiata a una base dell'altro filamento. Quanti legami a idrogeno tengono uniti i due filamenti in quel tratto?`;
		count = `Basi A o T: $${at}$, ognuna in una coppia A-T con $2$ legami a idrogeno. Basi G o C: $${gc}$, ognuna in una coppia G-C con $3$.`;
	}
	const n = 2 * at + 3 * gc;
	const pairs = at + gc;
	return {
		prompt: 'Conta i legami a idrogeno tra i due filamenti.',
		problem: textBlock(prose),
		solution: String(n),
		steps: [textBlock(count), `${at} \\cdot 2 + ${gc} \\cdot 3 = ${2 * at} + ${3 * gc} = ${n}`],
		// 2 and 3 swapped; then 2 for every pair, 3 for every pair, the number of pairs
		answer: choose(rng, intOpt(n), [3 * at + 2 * gc, ...shuffled(rng, [2 * pairs, 3 * pairs, pairs])].map(intOpt)),
		params: numeri ? { case: 'numeri', at, gc } : { case: 'sequenza', seq, at, gc },
		open: String(n),
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };
const OPEN = new Set([2, 5]);

function check(sample: Sample): string[] {
	const v = checkSample(sample);
	if ((sample.answer.kind === 'number') !== OPEN.has(sample.level)) v.push('tipo di risposta diverso da quello del livello');
	return v;
}

export const chimLegameIdrogeno: Generator = {
	id: ID,
	title: 'Il legame a idrogeno',
	levels: {
		1: { label: 'Quale sostanza forma legami a idrogeno', constraints: ['quattro sostanze, una sola li forma (o una sola non li forma)'] },
		2: { label: 'Idrogeni che contano e coppie solitarie', constraints: ['idrogeni legati a F, O, N; coppie solitarie su F, O, N', 'anche a risposta aperta'] },
		3: { label: 'Tra due molecole diverse', constraints: ['donatore e accettore: due versi, uno solo, nessuno'] },
		4: { label: 'Chi bolle più in alto, e perché', constraints: ['una con legami a idrogeno e una senza, almeno 20 gradi di distanza'] },
		5: { label: 'I legami a idrogeno nel DNA', constraints: ['2 per A-T, 3 per G-C; coppie A-T e G-C in numero diverso', 'anche a risposta aperta'] },
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

export default chimLegameIdrogeno;
