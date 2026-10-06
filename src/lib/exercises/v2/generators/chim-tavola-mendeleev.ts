/**
 * La tavola periodica di Mendeleev. Spec: specs/exercises/chim-tavola-mendeleev.md
 *
 * Four levels from the lesson (docs/lezioni/chimica/riscritte/43-chim-tavola-mendeleev.md), each one step harder: the
 * facts of the history and of the table (criteria, names, dates, the eka-elements, groups and periods); a missing mass
 * estimated as the mean of the elements above and below, as in Döbereiner's triads; the pairs of elements whose order by
 * atomic number is the opposite of their order by mass; the formula of a compound predicted from the element above or
 * below in the same group. Masses from IUPAC with two decimals (those of lesson 01 where it has them).
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, checkChoice, choose, decTex, generateWith, t, textBlock, textOpt, texOpt } from '../chim-atomo';

export const ID = 'chim-tavola-mendeleev';

const shuffled = <T,>(rng: Rng, xs: T[]) => xs.map((x) => ({ x, k: rng.next() })).sort((a, b) => a.k - b.k).map((o) => o.x);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------------------------------------------------------------------------
// Level 1: facts

export const FACTS: { q: string; a: string; wrong: string[]; why: string }[] = [
	{ q: 'Con quale criterio Mendeleev ordinava gli elementi?', a: 'Per massa atomica crescente', wrong: ['Per numero atomico crescente', 'In ordine alfabetico', 'Per anno di scoperta'], why: 'Nel 1869 non si conoscevano i protoni: Mendeleev ordinò gli elementi per massa atomica, mettendo quelli simili nella stessa colonna.' },
	{ q: 'Con quale criterio è ordinata la tavola periodica moderna?', a: 'Per numero atomico crescente', wrong: ['Per massa atomica crescente', 'In ordine alfabetico', 'Per densità crescente'], why: "Dal lavoro di Moseley, nel 1913, gli elementi si ordinano per numero atomico, il numero di protoni." },
	{ q: 'In che anno Mendeleev presentò la sua tavola periodica?', a: '1869', wrong: ['1829', '1865', '1913'], why: 'Nel 1869. Il 1829 è l\'anno delle triadi di Döbereiner, il 1865 delle ottave di Newlands, il 1913 del lavoro di Moseley.' },
	{ q: 'Chi scoprì che gli elementi vanno ordinati per numero atomico?', a: 'Moseley', wrong: ['Mendeleev', 'Döbereiner', 'Newlands'], why: 'Henry Moseley, nel 1913, studiando i raggi X emessi dagli elementi.' },
	{ q: 'Chi osservò per primo le triadi di elementi simili?', a: 'Döbereiner', wrong: ['Mendeleev', 'Moseley', 'Newlands'], why: 'Johann Wolfgang Döbereiner, nel 1829.' },
	{ q: "Quale elemento era l'eka-silicio previsto da Mendeleev?", a: 'Il germanio', wrong: ['Il gallio', 'Lo scandio', 'Lo stagno'], why: "L'eka-silicio, un posto sotto il silicio, è il germanio, scoperto da Winkler nel 1886." },
	{ q: "Quale elemento era l'eka-alluminio previsto da Mendeleev?", a: 'Il gallio', wrong: ['Il germanio', 'Lo scandio', 'Il boro'], why: "L'eka-alluminio, un posto sotto l'alluminio, è il gallio, scoperto da Lecoq de Boisbaudran nel 1875." },
	{ q: "Quale elemento era l'eka-boro previsto da Mendeleev?", a: 'Lo scandio', wrong: ['Il gallio', 'Il germanio', "L'alluminio"], why: "L'eka-boro è lo scandio, scoperto da Nilson nel 1879." },
	{ q: 'Che cosa sono i gruppi della tavola periodica?', a: 'Le colonne', wrong: ['Le righe', 'Le caselle vuote', 'Gli elementi della stessa massa'], why: 'I gruppi sono le colonne: elementi con proprietà chimiche simili. Le righe sono i periodi.' },
	{ q: 'Che cosa sono i periodi della tavola periodica?', a: 'Le righe', wrong: ['Le colonne', 'Le caselle vuote', 'Gli elementi della stessa massa'], why: 'I periodi sono le righe; le colonne sono i gruppi.' },
	{ q: 'Perché Mendeleev lasciò delle caselle vuote nella sua tavola?', a: 'Per elementi non ancora scoperti', wrong: ['Per i gas nobili', 'Per gli elementi radioattivi', 'Per un errore nelle masse'], why: 'Erano i posti di elementi che si sarebbero scoperti, e di cui Mendeleev previde le proprietà.' },
	{ q: 'Perché Mendeleev mise il tellurio prima dello iodio, anche se è più pesante?', a: 'Lo iodio somiglia al cloro', wrong: ['Il tellurio è più leggero', 'Per ordine alfabetico', 'Lo iodio fu scoperto dopo'], why: 'Lo iodio somiglia al cloro e al bromo, il tellurio all\'ossigeno e allo zolfo: le proprietà contavano più dell\'ordine delle masse.' },
	{ q: 'Come si chiamano gli elementi del gruppo 18?', a: 'Gas nobili', wrong: ['Alogeni', 'Metalli alcalini', 'Metalli alcalino-terrosi'], why: 'Il gruppo 18 è quello dei gas nobili.' },
	{ q: 'Come si chiamano gli elementi del gruppo 17?', a: 'Alogeni', wrong: ['Gas nobili', 'Metalli alcalini', 'Metalli alcalino-terrosi'], why: 'Il gruppo 17 è quello degli alogeni.' },
	{ q: "Come si chiamano gli elementi del gruppo 1, tranne l'idrogeno?", a: 'Metalli alcalini', wrong: ['Metalli alcalino-terrosi', 'Alogeni', 'Gas nobili'], why: "Il gruppo 1, senza l'idrogeno, è quello dei metalli alcalini." },
	{ q: 'Come si chiamano gli elementi del gruppo 2?', a: 'Metalli alcalino-terrosi', wrong: ['Metalli alcalini', 'Alogeni', 'Gas nobili'], why: 'Il gruppo 2 è quello dei metalli alcalino-terrosi.' },
	{ q: 'Quanti gruppi ha la tavola periodica moderna?', a: '18', wrong: ['7', '8', '10'], why: 'Diciotto gruppi, numerati da 1 a 18, e sette periodi.' },
	{ q: 'Quanti periodi ha la tavola periodica moderna?', a: '7', wrong: ['18', '8', '9'], why: 'Sette periodi e diciotto gruppi.' },
];

function level1(rng: Rng): Built {
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
// Level 2: a missing mass from the elements above and below

/** Three elements of a group, one above the other, with their atomic masses in hundredths (IUPAC, two decimals). */
export const TRIADS: [string, number][][] = [
	// only the triads where the mean is within 3% of the real mass: from the third period down (see the notes)
	[['litio', 694], ['sodio', 2299], ['potassio', 3910]],
	[['potassio', 3910], ['rubidio', 8547], ['cesio', 13291]],
	[['berillio', 901], ['magnesio', 2431], ['calcio', 4008]],
	[['calcio', 4008], ['stronzio', 8762], ['bario', 13733]],
	[['alluminio', 2698], ['gallio', 6972], ['indio', 11482]],
	[['silicio', 2809], ['germanio', 7263], ['stagno', 11871]],
	[['fosforo', 3097], ['arsenico', 7492], ['antimonio', 12176]],
	[['zolfo', 3207], ['selenio', 7897], ['tellurio', 12760]],
	[['cloro', 3545], ['bromo', 7990], ['iodio', 12690]],
	[['argon', 3995], ['kripton', 8380], ['xeno', 13129]],
];

/** "il sodio", "l'argon", "lo zolfo", "lo stagno", "lo iodio", "lo xeno" */
export function art(name: string) {
	if (name === 'iodio' || /^(z|x|s[^aeiou])/.test(name)) return `lo ${name}`;
	if (/^[aeiou]/.test(name)) return `l'${name}`;
	return `il ${name}`;
}
/** "del sodio", "dell'argon", "dello zolfo" */
const di = (name: string) => art(name).replace(/^il /, 'del ').replace(/^lo /, 'dello ').replace(/^l'/, "dell'");

const h2 = (k: number) => decTex((k / 100).toFixed(2));
/** A mass in hundredths rounded to the tenth, as an option; null on a tie. */
function tenthOpt(hundredths: number) {
	const x = hundredths / 10;
	if (Math.abs(x - Math.floor(x) - 0.5) < 1e-9) return null;
	const r = Math.round(x);
	return texOpt(decTex((r / 10).toFixed(1)), (r / 10).toFixed(1));
}

function level2(rng: Rng): Built {
	for (;;) {
		const k = rng.int(0, TRIADS.length - 1);
		const [[up, mu], [mid], [down, md]] = TRIADS[k];
		const mean = (mu + md) / 2; // hundredths, maybe with a half
		const right = tenthOpt(mean);
		if (!right) continue;
		const others = [tenthOpt(mu + md), tenthOpt((md - mu) / 2), tenthOpt(md - mu), tenthOpt((mu + md) / 3)].filter((o): o is NonNullable<typeof o> => o !== null);
		return {
			prompt: 'Stima la massa atomica.',
			problem: textBlock(
				`Immagina di non conoscere ${art(mid)}. Nella tavola periodica, sopra la sua casella c'è ${art(up)}, con massa atomica $${h2(mu)}$, e sotto ${art(down)}, con massa atomica $${h2(md)}$. Quale massa atomica stimi per l'elemento che manca, con la media dei due?`,
			),
			solution: right.latex,
			steps: [`\\dfrac{${h2(mu)} + ${h2(md)}}{2} \\approx ${right.latex}`, textBlock(`La massa atomica vera ${di(mid)} è $${h2(TRIADS[k][1][1])}$.`)],
			// the sum not halved; half the difference; the difference; divided by three
			answer: choose(rng, right, others),
			params: { case: 'triade', k },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: order by mass and order by atomic number

/** Consecutive elements: [name, symbol, Z, mass in hundredths]. The first three pairs are inverted. */
type El = [string, string, number, number];
export const INVERTED: [El, El][] = [
	[['argon', 'Ar', 18, 3995], ['potassio', 'K', 19, 3910]],
	[['cobalto', 'Co', 27, 5893], ['nichel', 'Ni', 28, 5869]],
	[['tellurio', 'Te', 52, 12760], ['iodio', 'I', 53, 12690]],
];
export const NORMAL: [El, El][] = [
	[['sodio', 'Na', 11, 2299], ['magnesio', 'Mg', 12, 2431]],
	[['magnesio', 'Mg', 12, 2431], ['alluminio', 'Al', 13, 2698]],
	[['zolfo', 'S', 16, 3207], ['cloro', 'Cl', 17, 3545]],
	[['cloro', 'Cl', 17, 3545], ['argon', 'Ar', 18, 3995]],
	[['potassio', 'K', 19, 3910], ['calcio', 'Ca', 20, 4008]],
	[['ferro', 'Fe', 26, 5585], ['cobalto', 'Co', 27, 5893]],
	[['nichel', 'Ni', 28, 5869], ['rame', 'Cu', 29, 6355]],
	[['rame', 'Cu', 29, 6355], ['zinco', 'Zn', 30, 6538]],
	[['selenio', 'Se', 34, 7897], ['bromo', 'Br', 35, 7990]],
	[['bromo', 'Br', 35, 7990], ['kripton', 'Kr', 36, 8380]],
	[['antimonio', 'Sb', 51, 12176], ['tellurio', 'Te', 52, 12760]],
	[['iodio', 'I', 53, 12690], ['xeno', 'Xe', 54, 13129]],
	[['azoto', 'N', 7, 1401], ['ossigeno', 'O', 8, 1600]],
	[['ossigeno', 'O', 8, 1600], ['fluoro', 'F', 9, 1900]],
];

const pairLabel = ([a, b]: [El, El]) => `${cap(a[0])} e ${b[0]}`;

function level3(rng: Rng): Built {
	if (rng.next() < 0.5) {
		const inv = rng.pick(INVERTED);
		// three normal pairs that share no element with each other or with the inverted one
		const used = new Set([inv[0][1], inv[1][1]]);
		const normals: [El, El][] = [];
		for (const p of shuffled(rng, NORMAL)) {
			if (normals.length === 3) break;
			if (used.has(p[0][1]) || used.has(p[1][1])) continue;
			normals.push(p);
			used.add(p[0][1]);
			used.add(p[1][1]);
		}
		const rows = shuffled(rng, [inv, ...normals].flat()).sort((x, y) => x[2] - y[2]);
		const table = `\\begin{array}{c|c|c} Z & \\text{elemento} & \\text{massa atomica} \\\\ \\hline ${rows.map((e) => `${e[2]} & \\mathrm{${e[1]}} & ${h2(e[3])}`).join(' \\\\ ')} \\end{array}`;
		return {
			prompt: "Trova la coppia in ordine inverso.",
			problem: textBlock('In quale coppia di elementi, uno dopo l\'altro nella tavola periodica, il primo ha massa atomica maggiore del secondo?', 46, [table]),
			solution: t(pairLabel(inv)),
			steps: [textBlock(`${cap(art(inv[0][0]))} ha $Z = ${inv[0][2]}$ e massa $${h2(inv[0][3])}$, ${art(inv[1][0])} ha $Z = ${inv[1][2]}$ e massa $${h2(inv[1][3])}$: in ordine di numero atomico la massa diminuisce. È una delle coppie che Mendeleev dovette invertire.`)],
			answer: choose(rng, textOpt(pairLabel(inv)), normals.map((p) => textOpt(pairLabel(p)))),
			params: { case: 'coppia', pair: inv[0][1] },
		};
	}
	const pair = rng.next() < 0.6 ? rng.pick(INVERTED) : rng.pick(NORMAL);
	const [a, b] = rng.next() < 0.5 ? pair : [pair[1], pair[0]];
	const first = a[2] < b[2] ? a : b;
	return {
		prompt: 'Metti in ordine i due elementi.',
		problem: textBlock(`${cap(art(a[0]))} ha numero atomico $${a[2]}$ e massa atomica $${h2(a[3])}$; ${art(b[0])} ha numero atomico $${b[2]}$ e massa atomica $${h2(b[3])}$. Quale dei due viene prima nella tavola periodica moderna?`),
		solution: t(cap(art(first[0]))),
		steps: [textBlock(`La tavola moderna è ordinata per numero atomico: viene prima ${art(first[0])}, con $Z = ${first[2]}$${first[3] > (first === a ? b : a)[3] ? ', anche se ha la massa atomica maggiore' : ''}.`)],
		answer: choose(rng, textOpt(cap(art(first[0])), first[1]), [textOpt(cap(art((first === a ? b : a)[0])), (first === a ? b : a)[1]), textOpt('Hanno lo stesso posto', 'stesso'), textOpt('Dipende dalla densità', 'densita')]),
		params: { case: 'ordine', a: a[1], b: b[1] },
	};
}

// ---------------------------------------------------------------------------
// Level 4: formulas by analogy

interface Family {
	els: [string, string][]; // name, symbol
	with: string; // the partner, "con l'ossigeno"
	count: [number, number]; // atoms of the element, atoms of the partner
	partner: string; // the partner's symbol
	hFirst?: boolean; // write the partner first (H2O, NaCl, MgCl2)
}

const G1: [string, string][] = [['litio', 'Li'], ['sodio', 'Na'], ['potassio', 'K'], ['rubidio', 'Rb']];
const G2: [string, string][] = [['magnesio', 'Mg'], ['calcio', 'Ca'], ['stronzio', 'Sr'], ['bario', 'Ba']];
const G13: [string, string][] = [['boro', 'B'], ['alluminio', 'Al'], ['gallio', 'Ga']];
const G16: [string, string][] = [['ossigeno', 'O'], ['zolfo', 'S'], ['selenio', 'Se'], ['tellurio', 'Te']];
const G17: [string, string][] = [['fluoro', 'F'], ['cloro', 'Cl'], ['bromo', 'Br'], ['iodio', 'I']];

export const FAMILIES: Family[] = [
	{ els: G1, with: "con l'ossigeno", count: [2, 1], partner: 'O' },
	{ els: G1, with: 'con il cloro', count: [1, 1], partner: 'Cl' },
	{ els: G1, with: "con l'idrogeno", count: [1, 1], partner: 'H' },
	{ els: G2, with: "con l'ossigeno", count: [1, 1], partner: 'O' },
	{ els: G2, with: 'con il cloro', count: [1, 2], partner: 'Cl' },
	{ els: G2, with: 'con lo zolfo', count: [1, 1], partner: 'S' },
	{ els: G13, with: "con l'ossigeno", count: [2, 3], partner: 'O' },
	{ els: G13, with: 'con il cloro', count: [1, 3], partner: 'Cl' },
	{ els: [['silicio', 'Si'], ['germanio', 'Ge']], with: "con l'ossigeno", count: [1, 2], partner: 'O' },
	{ els: [['carbonio', 'C'], ['silicio', 'Si'], ['germanio', 'Ge']], with: 'con il cloro', count: [1, 4], partner: 'Cl' },
	{ els: [['carbonio', 'C'], ['silicio', 'Si'], ['germanio', 'Ge']], with: "con l'idrogeno", count: [1, 4], partner: 'H' },
	{ els: [['azoto', 'N'], ['fosforo', 'P'], ['arsenico', 'As']], with: "con l'idrogeno", count: [1, 3], partner: 'H' },
	{ els: G16, with: "con l'idrogeno", count: [1, 2], partner: 'H', hFirst: true },
	{ els: G16, with: 'con il sodio', count: [1, 2], partner: 'Na', hFirst: true },
	{ els: G17, with: "con l'idrogeno", count: [1, 1], partner: 'H', hFirst: true },
	{ els: G17, with: 'con il sodio', count: [1, 1], partner: 'Na', hFirst: true },
	{ els: G17, with: 'con il magnesio', count: [2, 1], partner: 'Mg', hFirst: true },
];

/** A formula in LaTeX: \mathrm{Na_2O}, \mathrm{H_2S}, \mathrm{MgCl_2}. */
export function formula(sym: string, n: number, partner: string, m: number, partnerFirst = false) {
	const part = (s: string, k: number) => (k === 1 ? s : `${s}_${k}`);
	return `\\mathrm{${partnerFirst ? part(partner, m) + part(sym, n) : part(sym, n) + part(partner, m)}}`;
}

const COUNTS: [number, number][] = [[1, 1], [2, 1], [1, 2], [2, 3], [1, 3], [1, 4], [3, 1], [3, 2]];

function level4(rng: Rng): Built {
	const f = rng.pick(FAMILIES);
	const [a, b] = shuffled(rng, f.els).slice(0, 2);
	const [n, m] = f.count;
	const known = formula(a[1], n, f.partner, m, f.hFirst);
	const right = formula(b[1], n, f.partner, m, f.hFirst);
	const wrong = shuffled(rng, COUNTS.filter(([x, y]) => x !== n || y !== m)).map(([x, y]) => texOpt(formula(b[1], x, f.partner, y, f.hFirst), `${x}:${y}`));
	return {
		prompt: 'Prevedi la formula per analogia.',
		problem: textBlock(`${cap(art(a[0]))} forma ${f.with} il composto $${known}$. ${cap(art(b[0]))} sta nello stesso gruppo. Che formula ha il composto ${di(b[0])} ${f.with}?`),
		solution: right,
		steps: [textBlock(`Gli elementi dello stesso gruppo si combinano con gli altri elementi nelle stesse proporzioni: come $${known}$, il composto è $${right}$.`)],
		answer: choose(rng, texOpt(right, `${n}:${m}`), wrong),
		params: { case: f.partner, a: a[1], b: b[1] },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4 };

function check(sample: Sample): string[] {
	return checkChoice(sample);
}

export const chimTavolaMendeleev: Generator = {
	id: ID,
	title: 'La tavola periodica di Mendeleev',
	levels: {
		1: { label: 'Storia e struttura della tavola', constraints: ['criteri, date, eka-elementi, gruppi e periodi'] },
		2: { label: 'Una massa che manca', constraints: ['media tra sopra e sotto, al decimo'] },
		3: { label: 'Massa e numero atomico', constraints: ['la coppia invertita, o chi viene prima'] },
		4: { label: 'Formule per analogia', constraints: ['stesso gruppo, stesse proporzioni'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimTavolaMendeleev;
