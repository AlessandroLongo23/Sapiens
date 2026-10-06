/**
 * I sali ternari. Spec: specs/exercises/chim-sali-ternari.md
 *
 * Six levels in the order of the lesson (docs/lezioni/chimica/riscritte/82-chim-sali-ternari.md), each one step
 * harder: from the oxoacid to its anion; from the two ions to the formula, with the brackets; from the formula to the
 * traditional and Stock names; the IUPAC name in both directions; the acid salts; the hydrates. Ions, formulas and
 * names from src/lib/exercises/v2/chim3-j.ts.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, checkChoice, choose, generateWith, textBlock, textOpt, texOpt } from '../chim-atomo';
import { AMMONIUM, METALS, MULT, OXOACIDS, PREFIX, ROMAN, SIMPLE, acidTex, acidTrad, counts, hydrateTex, hydrateWord, hydrogenSulfide, ionTex, mathrm, metal, osso, oxoanion, saltTex, ternarySalt, type Metal, type Oxoacid, type Oxoanion, type Salt } from '../chim3-j';

export const ID = 'chim-sali-ternari';

const shuffled = <T,>(rng: Rng, xs: T[]) => xs.map((x) => ({ x, k: rng.next() })).sort((a, b) => a.k - b.k).map((o) => o.x);
const formulaOpt = (tex: string) => texOpt(mathrm(tex), tex);
const nameOpt = (name: string) => textOpt(name);
const ion = (sym: string, q: number) => mathrm(ionTex(sym, q));

function il(nome: string) {
	if (nome === 'iodio' || /^(z|s[^aeiou])/.test(nome)) return `lo ${nome}`;
	if (/^[aeiou]/.test(nome)) return `l'${nome}`;
	return `il ${nome}`;
}
const del = (nome: string) => il(nome).replace(/^il /, 'del ').replace(/^lo /, 'dello ').replace(/^l'/, "dell'");
const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);

/** The fourteen acids whose salts the exercises use (lesson 82, first table, with bromate and iodate). */
const ACIDS = ['carbonico', 'nitroso', 'nitrico', 'solforoso', 'solforico', 'fosforico', 'ipocloroso', 'cloroso', 'clorico', 'perclorico', 'bromico', 'iodico', 'cromico', 'permanganico'].map((t) => OXOACIDS.find((a) => a.trad === t)!);
const CATIONS = [...METALS, AMMONIUM];

/**
 * Which anions go with a cation, so that the salts are compounds that exist (spec, "Sali ammessi"): every acid for
 * the cations not listed here.
 */
const ALLOWED: Record<string, string[]> = {
	'Cu1': ['solforico'],
	'Cu2': ['carbonico', 'nitroso', 'nitrico', 'solforico', 'fosforico', 'clorico', 'perclorico', 'cromico'],
	'Pb2': ['carbonico', 'nitrico', 'solforoso', 'solforico', 'fosforico', 'clorico', 'perclorico', 'bromico', 'iodico', 'cromico'],
	'Ag1': ['carbonico', 'nitroso', 'nitrico', 'solforoso', 'solforico', 'fosforico', 'clorico', 'perclorico', 'bromico', 'iodico', 'cromico', 'permanganico'],
	'Pb4': ['solforico'],
	'Sn4': ['solforico', 'nitrico'],
	'Sn2': ['solforico', 'nitrico', 'fosforico'],
	'Fe2': ['solforico', 'nitrico', 'carbonico', 'fosforico', 'solforoso', 'perclorico'],
	'Fe3': ['solforico', 'nitrico', 'fosforico', 'perclorico'],
	'Al3': ['solforico', 'nitrico', 'fosforico', 'clorico', 'perclorico'],
	'NH_41': ['carbonico', 'nitroso', 'nitrico', 'solforoso', 'solforico', 'fosforico', 'clorico', 'perclorico', 'cromico'],
};
export const allowed = (m: Metal, q: number, a: Oxoacid) => ALLOWED[`${m.sym}${q}`]?.includes(a.trad) ?? true;

function pair(rng: Rng, cations: Metal[] = CATIONS): [Metal, number, Oxoanion] {
	for (;;) {
		const m = rng.pick(cations);
		const q = rng.pick(m.charges);
		const a = rng.pick(ACIDS);
		if (allowed(m, q, a)) return [m, q, oxoanion(a)];
	}
}

const URO: Record<string, string> = { C: 'carburo', N: 'nitruro', S: 'solfuro', P: 'fosfuro', Cl: 'cloruro', Br: 'bromuro', I: 'ioduro' };

/** The names a student may give to the anion of an acid: the four prefix and suffix pairs, -uro, the long root. */
function anionVariants(a: Oxoacid): string[] {
	const r = a.anionRoot;
	const out = [`ipo${r}ito`, `${r}ito`, `${r}ato`, `per${r}ato`];
	if (URO[a.x]) out.push(URO[a.x]);
	if (a.root !== r) out.push(`${a.root}${a.anion.endsWith('ato') ? 'ato' : 'ito'}`);
	return out.filter((n) => n !== a.anion);
}

/** The suffix swapped, keeping the prefix: solfato ↔ solfito, ipoclorito ↔ ipoclorato. */
const swapped = (name: string) => (name.endsWith('ato') ? `${name.slice(0, -3)}ito` : `${name.slice(0, -3)}ato`);

const metalName = (m: Metal, q: number, style: 'trad' | 'stock') => (m.charges.length === 1 ? `di ${m.nome}` : style === 'trad' ? m.adj![m.charges.indexOf(q)] : `di ${m.nome}(${ROMAN[q]})`);

// ---------------------------------------------------------------------------
// Level 1: from the acid to the anion

const suffixWhy = (a: Oxoacid) => `il suffisso ${a.trad.endsWith('ico') ? '-ico diventa -ato' : '-oso diventa -ito'}`;
const hydrogens = (a: Oxoacid) => (a.h === 1 ? 'un atomo' : `$${a.h}$ atomi`);

function level1(rng: Rng): Built {
	const a = rng.pick(ACIDS);
	const an = oxoanion(a);
	const why = textBlock(`L'${acidTrad(a)} è $${mathrm(acidTex(a))}$. Perde ${hydrogens(a)} di idrogeno come $${mathrm('H^+')}$ e resta $${ion(an.tex, -an.charge)}$; nel nome ${suffixWhy(a)}: ione ${an.trad}.`);
	const r = rng.next();
	if (r < 0.34) {
		const v = anionVariants(a);
		const wrong = [swapped(a.anion), ...shuffled(rng, v.filter((n) => n !== swapped(a.anion)))];
		return {
			prompt: "Dai il nome all'anione.",
			problem: textBlock(`Come si chiama l'anione che deriva dall'${acidTrad(a)}?`),
			solution: nameOpt(`ione ${a.anion}`).latex,
			steps: [why],
			answer: choose(rng, nameOpt(`ione ${a.anion}`), wrong.map((n) => nameOpt(`ione ${n}`))),
			params: { case: 'nome', acid: acidTrad(a) },
		};
	}
	if (r < 0.67) {
		const sib = ACIDS.filter((b) => b.x === a.x && b !== a).map((b) => ionTex(oxoanion(b).tex, -oxoanion(b).charge));
		const simple = SIMPLE.find((s) => s.sym === a.x);
		const rest = [ionTex(an.tex, -(an.charge + 1)), ...(an.charge > 1 ? [ionTex(an.tex, -(an.charge - 1))] : []), ionTex(an.tex, an.charge), ...(simple ? [ionTex(simple.sym, -simple.charge)] : [])];
		return {
			prompt: "Scrivi la formula dell'anione.",
			problem: textBlock(`Qual è la formula dello ione ${a.anion}?`),
			solution: ion(an.tex, -an.charge),
			steps: [why],
			answer: choose(rng, formulaOpt(ionTex(an.tex, -an.charge)), [...shuffled(rng, sib).slice(0, 1), ...shuffled(rng, [...rest, ...sib])].map(formulaOpt)),
			params: { case: 'formula', name: a.anion },
		};
	}
	const r0 = a.root;
	const hydr = SIMPLE.find((s) => s.sym === a.x);
	const acids = [`acido ipo${r0}oso`, `acido ${r0}oso`, `acido ${r0}ico`, `acido per${r0}ico`, ...(hydr ? [hydr.acid] : [])].filter((n) => n !== acidTrad(a));
	const swap = `acido ${a.trad.endsWith('ico') ? `${a.trad.slice(0, -3)}oso` : `${a.trad.slice(0, -3)}ico`}`;
	return {
		prompt: "Risali all'acido.",
		problem: textBlock(`Da quale acido deriva lo ione ${a.anion}?`),
		solution: nameOpt(acidTrad(a)).latex,
		steps: [textBlock(`Il suffisso ${a.anion.endsWith('ato') ? '-ato rimanda a un acido in -ico' : '-ito rimanda a un acido in -oso'}, e i prefissi restano: ${acidTrad(a)}, $${mathrm(acidTex(a))}$.`)],
		answer: choose(rng, nameOpt(acidTrad(a)), [swap, ...shuffled(rng, acids.filter((n) => n !== swap))].map(nameOpt)),
		params: { case: 'acido', name: a.anion },
	};
}

// ---------------------------------------------------------------------------
// Level 2: from the ions to the formula

const st = (m: Metal, nCat: number, an: Oxoanion | { tex: string }, nAn: number) => saltTex(m.sym, nCat, !!m.poly, an.tex, nAn, true);

/** The anion taken n times with the brackets multiplied out: (NO_3)_2 → N_2O_6. */
function merged(tex: string, n: number) {
	return tex.replace(/([A-Z][a-z]?)(?:_(\d))?/g, (_, s: string, k?: string) => `${s}_${Number(k ?? 1) * n}`.replace(/_(\d\d)$/, '_{$1}'));
}

function wrongFormulas(rng: Rng, m: Metal, q: number, an: Oxoanion): string[] {
	const [nCat, nAn] = counts(q, an.charge);
	const right = st(m, nCat, an, nAn);
	const first: string[] = [];
	if (nAn > 1) first.push(`${saltTex(m.sym, nCat, !!m.poly, '', 1, false)}${merged(an.tex, nAn)}`); // brackets multiplied out
	if (nCat !== an.charge || nAn !== q) first.push(st(m, an.charge, an, q)); // crossed, not reduced
	if (nCat !== nAn) first.push(st(m, nAn, an, nCat)); // indices swapped
	const rest = [st(m, 1, an, 1), st(m, nCat, an, nAn + 1), st(m, nCat + 1, an, nAn), st(m, 1, an, 2), st(m, 2, an, 1), st(m, 2, an, 3), st(m, 3, an, 2)];
	return [...shuffled(rng, first), ...shuffled(rng, rest)].filter((f) => f !== right);
}

function crossSteps(m: Metal, q: number, an: Oxoanion): string[] {
	const [nCat, nAn] = counts(q, an.charge);
	const crossed = st(m, an.charge, an, q);
	const final = st(m, nCat, an, nAn);
	return [
		textBlock(`Gli ioni sono $${ion(m.sym, q)}$ e $${ion(an.tex, -an.charge)}$: il numero della carica di uno è l'indice dell'altro${nAn > 1 ? ', e lo ione poliatomico preso più volte va tra parentesi' : ''}.`),
		crossed === final ? mathrm(final) : `${mathrm(crossed)} \\longrightarrow ${mathrm(final)}`,
		`${nCat} \\cdot (+${q}) + ${nAn} \\cdot (-${an.charge}) = 0`,
	];
}

function level2(rng: Rng): Built {
	const [m, q, an] = pair(rng);
	const salt = ternarySalt(m, q, an);
	return {
		prompt: 'Scrivi la formula del sale.',
		problem: textBlock(`Qual è la formula del sale formato dagli ioni $${ion(m.sym, q)}$ e $${ion(an.tex, -an.charge)}$?`),
		solution: mathrm(salt.tex),
		steps: crossSteps(m, q, an),
		answer: choose(rng, formulaOpt(salt.tex), wrongFormulas(rng, m, q, an).map(formulaOpt)),
		params: { case: 'ioni', cation: `${m.sym}${q}+`, anion: an.tex },
	};
}

// ---------------------------------------------------------------------------
// Level 3: from the formula to the traditional and Stock names

function chargeSteps(m: Metal, q: number, an: Oxoanion, salt: Salt): string[] {
	return [
		textBlock(`L'anione è lo ione ${an.trad}, $${ion(an.tex, -an.charge)}$${salt.nAn === 1 ? '' : `, e compare $${salt.nAn}$ volte`}: la carica negativa totale è $-${salt.nAn * an.charge}$.`),
		textBlock(m.poly ? `Lo ione ammonio ha carica $1+$, e ne ${salt.nCat === 1 ? 'serve uno' : `servono $${salt.nCat}$`}.` : `${salt.nCat === 1 ? `${cap(il(m.nome))} è uno solo e vale` : `Gli atomi di ${m.nome} sono $${salt.nCat}$, e ognuno vale`} $+${q}$.`),
	];
}

function level3(rng: Rng): Built {
	const [m, q, an] = pair(rng, rng.next() < 0.6 ? METALS.filter((x) => x.charges.length === 2) : CATIONS.filter((x) => x.charges.length === 1));
	const salt = ternarySalt(m, q, an);
	const variable = m.charges.length === 2;
	const stock = variable && rng.next() < 0.5;
	const style = stock ? 'stock' : 'trad';
	const right = stock ? salt.stock : salt.trad;
	const other = m.charges.find((c) => c !== q) ?? q;
	const v = anionVariants(an.acid);
	const sw = swapped(an.trad);
	const wrong = variable
		? [
				`${an.trad} ${metalName(m, other, style)}`, // the other oxidation number of the metal
				`${sw} ${metalName(m, q, style)}`, // -ato and -ito swapped
				...shuffled(rng, [`${sw} ${metalName(m, other, style)}`, ...v.filter((n) => n !== sw).map((n) => `${n} ${metalName(m, q, style)}`), ...(stock ? [salt.nAn, salt.nCat, an.acid.no].filter((c) => c <= 7 && !m.charges.includes(c)).map((c) => `${an.trad} di ${m.nome}(${ROMAN[c]})`) : [])]),
			]
		: [`${sw} di ${m.nome}`, ...shuffled(rng, v.filter((n) => n !== sw).map((n) => `${n} di ${m.nome}`))];
	const names = new Set([salt.trad, salt.stock, salt.iupac]);
	return {
		prompt: 'Dai il nome al sale.',
		problem: textBlock(`Che nome ha $${mathrm(salt.tex)}$ ${stock ? 'nella notazione di Stock' : 'nella nomenclatura tradizionale'}?`),
		solution: nameOpt(right).latex,
		steps: [...chargeSteps(m, q, an, salt), textBlock(`${stock ? 'Notazione di Stock' : 'Nome tradizionale'}: ${right}.`)],
		answer: choose(rng, nameOpt(right), wrong.filter((w) => !names.has(w)).map(nameOpt)),
		params: { case: stock ? 'stock' : variable ? 'tradizionale-due' : 'tradizionale-uno', salt: salt.tex },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the IUPAC name

const iupacAnion = (o: number, a: Oxoacid, no: number) => `${osso(o)}${PREFIX[a.nX]}${a.anionRoot}ato(${ROMAN[no]})`;
const iupacSalt = (anion: string, nAn: number, nCat: number, m: Metal) => `${nAn === 1 ? anion : `${MULT[nAn]}[${anion}]`} di ${PREFIX[nCat]}${m.nome}`;

function level4(rng: Rng): Built {
	const [m, q, an] = pair(rng);
	const salt = ternarySalt(m, q, an);
	const a = an.acid;
	const count = (n: number, one: string, many: string) => (n === 1 ? `un ${one}` : `$${n}$ ${many}`);
	const reading = textBlock(`Nel nome ci sono ${count(a.o, 'atomo', 'atomi')} di ossigeno per ogni anione, ${del(a.elemento)} con numero di ossidazione $+${a.no}$, ${count(salt.nAn, 'anione', 'anioni')} e ${m.poly ? count(salt.nCat, 'ione ammonio', 'ioni ammonio') : `${count(salt.nCat, 'atomo', 'atomi')} di ${m.nome}`}.`);
	if (rng.next() < 0.5) {
		const others = [1, 2, 3, 4, 5, 6, 7].filter((n) => n !== a.no);
		const wrong = shuffled(rng, [
			iupacSalt(iupacAnion(a.o, a, rng.pick(others)), salt.nAn, salt.nCat, m), // another oxidation number
			...(a.o !== a.no ? [iupacSalt(iupacAnion(a.o, a, a.o), salt.nAn, salt.nCat, m)] : []), // the Roman numeral counts the oxygens
			iupacSalt(iupacAnion(a.o === 4 ? 3 : a.o + 1, a, a.no), salt.nAn, salt.nCat, m), // the wrong count of oxygens
			...(salt.nAn > 1 ? [iupacSalt(iupacAnion(a.o, a, a.no), 1, salt.nCat, m)] : [iupacSalt(iupacAnion(a.o, a, a.no), 2, salt.nCat, m)]), // bis, tris forgotten or added
			iupacSalt(iupacAnion(a.o, a, a.no), salt.nAn, salt.nCat === 1 ? 2 : 1, m), // the prefix of the metal
			iupacSalt(iupacAnion(a.o, a, a.no).replace(/ato\(/, 'ito('), salt.nAn, salt.nCat, m), // -ito in a IUPAC name
		]);
		return {
			prompt: 'Dai il nome IUPAC al sale.',
			problem: textBlock(`Che nome IUPAC ha $${mathrm(salt.tex)}$?`),
			solution: nameOpt(salt.iupac).latex,
			steps: [reading, textBlock(`Nome IUPAC: ${salt.iupac}.`)],
			answer: choose(rng, nameOpt(salt.iupac), wrong.map(nameOpt)),
			params: { case: 'nome-iupac', salt: salt.tex },
		};
	}
	const sib = ACIDS.filter((b) => b.x === a.x && b !== a).map((b) => st(m, salt.nCat, oxoanion(b), salt.nAn));
	const wrong = [...shuffled(rng, sib).slice(0, 1), ...wrongFormulas(rng, m, q, an).slice(0, 2), ...shuffled(rng, [...sib, ...wrongFormulas(rng, m, q, an)])];
	return {
		prompt: 'Scrivi la formula del sale.',
		problem: textBlock(`Il nome IUPAC di un sale è ${salt.iupac}. Qual è la sua formula?`),
		solution: mathrm(salt.tex),
		steps: [reading, mathrm(salt.tex)],
		answer: choose(rng, formulaOpt(salt.tex), wrong.map(formulaOpt)),
		params: { case: 'formula-iupac', name: salt.iupac },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the acid salts

/** Acid salts that exist: [metal, acid or 'solfidrico', hydrogens kept]. */
export const ACID_SALTS: [string, string, number][] = [
	['Na', 'carbonico', 1], ['K', 'carbonico', 1], ['Ca', 'carbonico', 1], ['Mg', 'carbonico', 1], ['Ba', 'carbonico', 1], ['NH_4', 'carbonico', 1],
	['Na', 'solforoso', 1], ['K', 'solforoso', 1], ['Ca', 'solforoso', 1], ['NH_4', 'solforoso', 1],
	['Na', 'solforico', 1], ['K', 'solforico', 1], ['NH_4', 'solforico', 1],
	['Na', 'fosforico', 1], ['K', 'fosforico', 1], ['Ca', 'fosforico', 1], ['Mg', 'fosforico', 1], ['NH_4', 'fosforico', 1],
	['Na', 'fosforico', 2], ['K', 'fosforico', 2], ['Ca', 'fosforico', 2], ['NH_4', 'fosforico', 2],
	['Na', 'solfidrico', 1], ['K', 'solfidrico', 1], ['NH_4', 'solfidrico', 1],
];

function level5(rng: Rng): Built {
	const [sym, acidName, kept] = rng.pick(ACID_SALTS);
	const m = metal(sym);
	const q = m.charges[0];
	const sulfide = acidName === 'solfidrico';
	const acid = sulfide ? null : OXOACIDS.find((a) => a.trad === acidName)!;
	const an = acid ? oxoanion(acid, kept) : null;
	const salt = an ? ternarySalt(m, q, an) : hydrogenSulfide(m, q);
	const anTex = an ? an.tex : 'HS';
	const charge = an ? an.charge : 1;
	const anTrad = an ? an.trad : 'idrogenosolfuro';
	const full = acid ? oxoanion(acid) : { tex: 'S', charge: 2, trad: 'solfuro' };
	const acidLabel = acid ? `l'${acidTrad(acid)}, $${mathrm(acidTex(acid))}$` : `l'acido solfidrico, $${mathrm('H_2S')}$`;
	const lost = (acid ? acid.h : 2) - kept;
	const why = textBlock(`L'anione è ${acidLabel}, che ha perso ${lost === 1 ? 'un solo ione' : `$${lost}$ ioni`} $${mathrm('H^+')}$: $${ion(anTex, -charge)}$, ione ${anTrad}.`);
	const balance = `${salt.nCat} \\cdot (+${q}) + ${salt.nAn} \\cdot (-${charge}) = 0`;
	const f = (nCat: number, tex: string, nAn: number) => saltTex(m.sym, nCat, !!m.poly, tex, nAn, true);
	if (rng.next() < 0.5) {
		// the neutral salt; the anion with the charge of the neutral one; one hydrogen more or fewer; the indices not balanced
		const [fc, fa] = counts(q, full.charge);
		const otherH = acid && acid.h === 3 ? oxoanion(acid, kept === 1 ? 2 : 1) : null;
		const wrong = [
			acid ? f(fc, full.tex, fa) : saltTex(m.sym, fc, !!m.poly, 'S', fa, false),
			f(fc, anTex, fa),
			...(otherH ? [f(counts(q, otherH.charge)[0], otherH.tex, counts(q, otherH.charge)[1])] : []),
			...shuffled(rng, [f(salt.nCat, anTex, salt.nAn + 1), f(salt.nCat + 1, anTex, salt.nAn), f(salt.nCat, `H_2${anTex.replace(/^H(_\d)?/, '')}`, salt.nAn), f(2, anTex, 3)]),
		];
		return {
			prompt: 'Scrivi la formula del sale.',
			problem: textBlock(`Il nome tradizionale di un sale è ${salt.trad}. Qual è la sua formula?`),
			solution: mathrm(salt.tex),
			steps: [why, balance],
			answer: choose(rng, formulaOpt(salt.tex), wrong.filter((w) => w !== salt.tex).map(formulaOpt)),
			params: { case: 'formula', name: salt.trad },
		};
	}
	const tail = `di ${m.nome}`;
	const bare = anTrad.replace(/^(di)?idrogeno/, '');
	const wrong = [
		`${bare} ${tail}`, // the hydrogen forgotten
		`${kept === 1 ? 'di' : ''}idrogeno${bare} ${tail}`, // one hydrogen more or fewer in the name
		// -ato for -ito (or for -uro); idrossi- for idrogeno-; the hydrogen read as water; -uro (or -ito) for the anion
		...shuffled(rng, [`${anTrad.replace(bare, swapped(bare))} ${tail}`, `idrossi${bare} ${tail}`, `${bare} ${tail} monoidrato`, `${anTrad.replace(bare, sulfide ? 'solfito' : URO[acid!.x])} ${tail}`]),
	];
	return {
		prompt: 'Dai il nome al sale.',
		problem: textBlock(`Che nome tradizionale ha $${mathrm(salt.tex)}$?`),
		solution: nameOpt(salt.trad).latex,
		steps: [why, textBlock(`Il nome dell'anione è seguito da quello del catione: ${salt.trad}.`)],
		answer: choose(rng, nameOpt(salt.trad), wrong.map(nameOpt)),
		params: { case: 'nome', salt: salt.tex },
	};
}

// ---------------------------------------------------------------------------
// Level 6: the hydrates

/** Hydrates that exist: [metal, its charge, acid, molecules of water]. */
export const HYDRATES: [string, number, string, number][] = [
	['Cu', 2, 'solforico', 5], ['Ca', 2, 'solforico', 2], ['Na', 1, 'carbonico', 10], ['Mg', 2, 'solforico', 7], ['Fe', 2, 'solforico', 7], ['Zn', 2, 'solforico', 7],
	['Na', 1, 'solforico', 10], ['Cu', 2, 'nitrico', 3], ['Ca', 2, 'nitrico', 4], ['Mg', 2, 'nitrico', 6], ['Zn', 2, 'nitrico', 6], ['Na', 1, 'solforoso', 7], ['Na', 1, 'cromico', 4],
];
const STYLE = { trad: 'tradizionale', stock: 'di Stock', iupac: 'IUPAC' } as const;
const WATERS = [2, 3, 4, 5, 6, 7, 10];

function level6(rng: Rng): Built {
	const [sym, q, acidName, n] = rng.pick(HYDRATES);
	const m = metal(sym);
	const an = oxoanion(OXOACIDS.find((a) => a.trad === acidName)!);
	const salt = ternarySalt(m, q, an);
	const style = rng.pick(['trad', 'stock', 'iupac'] as const);
	const name = `${salt[style]} ${hydrateWord(n)}`;
	const tex = hydrateTex(salt.tex, n);
	const why = textBlock(`${cap(hydrateWord(n))} vuol dire $${n}$ molecole d'acqua di cristallizzazione per ogni unità formula, scritte dopo un punto.`);
	const near = shuffled(rng, WATERS.filter((w) => w !== n));
	if (rng.next() < 0.5) {
		const other = m.charges.find((c) => c !== q);
		const wrong = [
			hydrateTex(salt.tex, near[0]),
			...shuffled(rng, [
				salt.tex, // the water forgotten
				...(other ? [hydrateTex(ternarySalt(m, other, an).tex, n)] : [hydrateTex(st(m, salt.nCat === 1 ? 2 : 1, an, salt.nAn), n)]), // the other charge of the metal, or a wrong index
				hydrateTex(salt.tex, near[1]),
				`${salt.tex} \\cdot H_${2 * n >= 10 ? `{${2 * n}}` : 2 * n}O`, // the coefficient moved onto the hydrogen
			]),
		];
		return {
			prompt: "Scrivi la formula dell'idrato.",
			problem: textBlock(`Il nome ${STYLE[style]} di un sale idrato è ${name}. Qual è la sua formula?`),
			solution: mathrm(tex),
			steps: [textBlock(`Il sale anidro è $${mathrm(salt.tex)}$: ioni $${ion(m.sym, q)}$ e $${ion(an.tex, -an.charge)}$.`), why],
			answer: choose(rng, formulaOpt(tex), wrong.map(formulaOpt)),
			params: { case: 'formula', name, style },
		};
	}
	const wrong = [`${salt[style]} ${hydrateWord(near[0])}`, ...shuffled(rng, [`${salt[style]} ${hydrateWord(near[1])}`, `${salt[style]} anidro`, `${salt[style]} ${PREFIX[n] || 'mono'}idrossido`, `${salt[style]} ${hydrateWord(2 * n > 10 ? near[2] : 2 * n)}`])];
	return {
		prompt: "Dai il nome all'idrato.",
		problem: textBlock(`Che nome ${STYLE[style]} ha $${mathrm(tex)}$?`),
		solution: nameOpt(name).latex,
		steps: [textBlock(`Il sale anidro, $${mathrm(salt.tex)}$, è ${salt[style]}.`), why],
		answer: choose(rng, nameOpt(name), wrong.map(nameOpt)),
		params: { case: 'nome', salt: tex, style },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkChoice(sample);
}

export const chimSaliTernari: Generator = {
	id: ID,
	title: 'I sali ternari',
	levels: {
		1: { label: "Dall'acido all'anione", constraints: ['nome, formula con la carica, acido di partenza'] },
		2: { label: 'Dagli ioni alla formula', constraints: ['incrocio, semplificazione, parentesi; sali ammessi'] },
		3: { label: 'Dalla formula al nome tradizionale e di Stock', constraints: ['la carica del metallo dalla carica dell’anione'] },
		4: { label: 'Il nome IUPAC', constraints: ['nei due sensi, con bis e tris'] },
		5: { label: 'I sali acidi', constraints: ['idrogeno- e diidrogeno-, nei due sensi; sali che esistono'] },
		6: { label: 'I sali idrati', constraints: ['nei due sensi, nelle tre nomenclature; idrati che esistono'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimSaliTernari;
