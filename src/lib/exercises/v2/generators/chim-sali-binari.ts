/**
 * I sali binari. Spec: specs/exercises/chim-sali-binari.md
 *
 * Five levels in the order of the lesson (docs/lezioni/chimica/riscritte/81-chim-sali-binari.md), each one step
 * harder: the ions and their names; from the two ions to the formula; from the formula to the name with a metal that
 * has one oxidation number; the same with a metal that has two (the oxidation number is to be found); from the name
 * to the formula, in the three nomenclatures. Ions, formulas and names from src/lib/exercises/v2/chim3-j.ts.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, checkChoice, choose, generateWith, textBlock, textOpt, texOpt } from '../chim-atomo';
import { METALS, PREFIX, ROMAN, SIMPLE, binarySalt, cationName, counts, ionTex, mathrm, saltTex, stable, type Metal, type Simple } from '../chim3-j';

export const ID = 'chim-sali-binari';

const shuffled = <T,>(rng: Rng, xs: T[]) => xs.map((x) => ({ x, k: rng.next() })).sort((a, b) => a.k - b.k).map((o) => o.x);
const formulaOpt = (tex: string) => texOpt(mathrm(tex), tex);
const nameOpt = (name: string) => textOpt(name);
const ion = (sym: string, q: number) => mathrm(ionTex(sym, q));

/** "il ferro", "lo stagno", "l'argento"; "del ferro", "dello zinco", "dell'alluminio" */
function il(nome: string) {
	if (/^(z|s[^aeiou])/.test(nome)) return `lo ${nome}`;
	if (/^[aeiou]/.test(nome)) return `l'${nome}`;
	return `il ${nome}`;
}
const del = (nome: string) => il(nome).replace(/^il /, 'del ').replace(/^lo /, 'dello ').replace(/^l'/, "dell'");
const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);

const ONE = METALS.filter((m) => m.charges.length === 1);
const TWO = METALS.filter((m) => m.charges.length === 2);

/** A metal ion and an anion that make a stable salt. */
function pair(rng: Rng, metals: Metal[]): [Metal, number, Simple] {
	for (;;) {
		const m = rng.pick(metals);
		const q = rng.pick(m.charges);
		const a = rng.pick(SIMPLE);
		if (stable(m, q, a)) return [m, q, a];
	}
}

/** The oxoanions' names a student gives to a simple anion: cloruro → clorato, clorito. */
const ato = (a: Simple) => `${a.nome.slice(0, -3)}ato`;
const ito = (a: Simple) => `${a.nome.slice(0, -3)}ito`;
const binary = (m: Metal, nCat: number, a: Simple, nAn: number) => saltTex(m.sym, nCat, false, a.sym, nAn, false);

// ---------------------------------------------------------------------------
// Level 1: the ions

function level1(rng: Rng): Built {
	const r = rng.next();
	if (r < 0.3) {
		const m = rng.pick(TWO);
		const q = rng.pick(m.charges);
		const other = m.charges.find((c) => c !== q)!;
		const style = rng.next() < 0.5 ? 'trad' : 'stock';
		const right = cationName(m, q, style);
		const wrong =
			style === 'trad'
				? [cationName(m, other, 'trad'), `ione ${m.adj![0].replace(/oso$/, 'uro')}`, `ione ${m.adj![0].replace(/oso$/, 'ato')}`, `ione ${m.adj![0].replace(/oso$/, 'ito')}`]
				: [cationName(m, other, 'stock'), ...shuffled(rng, [1, 2, 3, 4, 5, 6].filter((c) => !m.charges.includes(c)).map((c) => `ione ${m.nome}(${ROMAN[c]})`))];
		return {
			prompt: 'Dai il nome allo ione.',
			problem: textBlock(`Come si chiama lo ione $${ion(m.sym, q)}$ ${style === 'trad' ? 'nella nomenclatura tradizionale' : 'nella notazione di Stock'}?`),
			solution: nameOpt(right).latex,
			steps: [
				textBlock(
					style === 'trad'
						? `${cap(il(m.nome))} forma gli ioni $${ion(m.sym, m.charges[0])}$ e $${ion(m.sym, m.charges[1])}$: il suffisso -oso va alla carica più bassa, -ico alla più alta.`
						: `Nella notazione di Stock la carica dello ione si scrive in numeri romani tra parentesi dopo il nome del metallo.`,
				),
			],
			answer: choose(rng, nameOpt(right), [wrong[0], ...shuffled(rng, wrong.slice(1))].map(nameOpt)),
			params: { case: 'catione-nome', ion: `${m.sym}${q}+`, style },
		};
	}
	if (r < 0.6) {
		const m = rng.pick(TWO);
		const q = rng.pick(m.charges);
		const other = m.charges.find((c) => c !== q)!;
		const style = rng.next() < 0.5 ? 'trad' : 'stock';
		const wrong = [ionTex(m.sym, other), ...shuffled(rng, [1, 2, 3, 4].filter((c) => !m.charges.includes(c)).map((c) => ionTex(m.sym, c))), ionTex(m.sym, -q)];
		return {
			prompt: 'Scrivi lo ione.',
			problem: textBlock(`Qual è la formula dello ${cationName(m, q, style)}?`),
			solution: ion(m.sym, q),
			steps: [
				textBlock(
					style === 'trad'
						? `${cap(il(m.nome))} ha le cariche $${m.charges[0]}+$ e $${m.charges[1]}+$: il suffisso ${q === m.charges[0] ? '-oso indica la più bassa' : '-ico indica la più alta'}.`
						: `Il numero romano è la carica dello ione: $${q}+$.`,
				),
			],
			answer: choose(rng, formulaOpt(ionTex(m.sym, q)), wrong.map(formulaOpt)),
			params: { case: 'catione-formula', name: cationName(m, q, style) },
		};
	}
	const a = rng.pick(SIMPLE);
	const why = textBlock(`Dall'${a.acid}, $${mathrm(a.acidTex)}$, che ha ${a.charge === 1 ? 'un atomo' : 'due atomi'} di idrogeno: il suffisso -idrico diventa -uro e la carica è $${a.charge}-$.`);
	if (r < 0.8) {
		const right = `ione ${a.nome}`;
		const wrong = shuffled(rng, [`ione ${ato(a)}`, `ione ${ito(a)}`, `ione ${a.acid.replace('acido ', '')}`, `ione ${a.elemento}`]);
		return {
			prompt: 'Dai il nome allo ione.',
			problem: textBlock(`Come si chiama lo ione $${ion(a.sym, -a.charge)}$?`),
			solution: nameOpt(right).latex,
			steps: [why],
			answer: choose(rng, nameOpt(right), wrong.map(nameOpt)),
			params: { case: 'anione-nome', ion: a.sym },
		};
	}
	const wrong = shuffled(rng, [ionTex(a.sym, a.charge === 1 ? -2 : -1), ionTex(a.sym, a.charge), ionTex(a.sym, -3), ionTex(`${a.sym}O_3`, -a.charge), ionTex(`${a.sym}O_4`, -a.charge)]);
	return {
		prompt: 'Scrivi lo ione.',
		problem: textBlock(`Qual è la formula dello ione ${a.nome}?`),
		solution: ion(a.sym, -a.charge),
		steps: [why],
		answer: choose(rng, formulaOpt(ionTex(a.sym, -a.charge)), wrong.map(formulaOpt)),
		params: { case: 'anione-formula', name: a.nome },
	};
}

// ---------------------------------------------------------------------------
// Level 2: from the ions to the formula

/** The formulas of who crosses badly: indices not reduced, swapped, left out, one too many. */
function wrongFormulas(rng: Rng, m: Metal, q: number, a: Simple): string[] {
	const [nCat, nAn] = counts(q, a.charge);
	const first: string[] = [];
	if (nCat !== a.charge || nAn !== q) first.push(binary(m, a.charge, a, q)); // crossed, not reduced
	if (nCat !== nAn) first.push(binary(m, nAn, a, nCat)); // indices swapped
	const rest = [binary(m, 1, a, 1), binary(m, nCat, a, nAn + 1), binary(m, nCat + 1, a, nAn), binary(m, 2, a, 1), binary(m, 1, a, 2), binary(m, 2, a, 3), binary(m, 3, a, 2)];
	return [...first, ...shuffled(rng, rest)].filter((f) => f !== binary(m, nCat, a, nAn));
}

function crossSteps(m: Metal, q: number, a: Simple): string[] {
	const [nCat, nAn] = counts(q, a.charge);
	const crossed = binary(m, a.charge, a, q);
	const final = binary(m, nCat, a, nAn);
	return [
		textBlock(`Gli ioni sono $${ion(m.sym, q)}$ e $${ion(a.sym, -a.charge)}$: il numero della carica di uno è l'indice dell'altro.`),
		crossed === final ? mathrm(final) : `${mathrm(crossed)} \\longrightarrow ${mathrm(final)}`,
		`${nCat} \\cdot (+${q}) + ${nAn} \\cdot (-${a.charge}) = 0`,
	];
}

function level2(rng: Rng): Built {
	const [m, q, a] = pair(rng, METALS);
	const salt = binarySalt(m, q, a);
	return {
		prompt: 'Scrivi la formula del sale.',
		problem: textBlock(`Qual è la formula del sale formato dagli ioni $${ion(m.sym, q)}$ e $${ion(a.sym, -a.charge)}$?`),
		solution: mathrm(salt.tex),
		steps: crossSteps(m, q, a),
		answer: choose(rng, formulaOpt(salt.tex), wrongFormulas(rng, m, q, a).map(formulaOpt)),
		params: { case: 'ioni', cation: `${m.sym}${q}+`, anion: a.sym },
	};
}

// ---------------------------------------------------------------------------
// Levels 3 and 4: from the formula to the name

function chargeSteps(m: Metal, q: number, a: Simple): string[] {
	const [nCat, nAn] = counts(q, a.charge);
	return [
		textBlock(`L'anione è lo ione ${a.nome}, $${ion(a.sym, -a.charge)}$${nAn === 1 ? '' : `, e ce ne sono $${nAn}$`}: la carica negativa totale è $-${nAn * a.charge}$.`),
		textBlock(`${nCat === 1 ? `${cap(il(m.nome))} è uno solo e vale` : `Gli atomi di ${m.nome} sono $${nCat}$, e ognuno vale`} $+${q}$.`),
	];
}

function level3(rng: Rng): Built {
	const [m, q, a] = pair(rng, ONE);
	const salt = binarySalt(m, q, a);
	const iupac = rng.next() < 0.5;
	const right = iupac ? salt.iupac : salt.trad;
	const wrong = iupac
		? shuffled(
				rng,
				// the prefixes on the wrong word, on both, one too many, mono- written out
				[`${PREFIX[salt.nCat]}${a.nome} di ${PREFIX[salt.nAn]}${m.nome}`, `${PREFIX[salt.nAn + 1]}${a.nome} di ${PREFIX[salt.nCat]}${m.nome}`, `${PREFIX[salt.nAn]}${a.nome} di ${PREFIX[salt.nCat + 1]}${m.nome}`, `${PREFIX[Math.max(2, salt.nAn)]}${a.nome} di ${PREFIX[Math.max(2, salt.nCat)]}${m.nome}`, `mono${a.nome} di mono${m.nome}`],
			)
		: shuffled(rng, [`${ato(a)} di ${m.nome}`, `${ito(a)} di ${m.nome}`, `${m.nome.replace(/[oae]$/, '')}uro di ${a.elemento}`, `${a.elemento} di ${m.nome}`]);
	return {
		prompt: 'Dai il nome al sale.',
		problem: textBlock(`Che nome ${iupac ? 'IUPAC' : 'tradizionale'} ha $${mathrm(salt.tex)}$?`),
		solution: nameOpt(right).latex,
		steps: iupac
			? [textBlock(`Il nome IUPAC conta gli atomi con i prefissi, e mono- non si scrive: ${salt.nAn === 1 ? 'un atomo' : `$${salt.nAn}$ atomi`} di ${a.elemento}, ${salt.nCat === 1 ? 'un atomo' : `$${salt.nCat}$ atomi`} di ${m.nome}.`)]
			: [textBlock(`Il non metallo prende il suffisso -uro: ${a.nome}. ${cap(il(m.nome))} ha un solo numero di ossidazione, e il nome è ${salt.trad}.`)],
		answer: choose(rng, nameOpt(right), wrong.filter((w) => w !== salt.trad && w !== salt.iupac).map(nameOpt)),
		params: { case: iupac ? 'iupac' : 'tradizionale', salt: salt.tex },
	};
}

function level4(rng: Rng): Built {
	const [m, q, a] = pair(rng, TWO);
	const salt = binarySalt(m, q, a);
	const other = m.charges.find((c) => c !== q)!;
	const stock = rng.next() < 0.5;
	const right = stock ? salt.stock : salt.trad;
	const otherName = stock ? `${a.nome} di ${m.nome}(${ROMAN[other]})` : `${a.nome} ${m.adj![m.charges.indexOf(other)]}`;
	// the other oxidation number first; then the index read as oxidation number, -ato for -uro, no distinction at all
	const rest = stock
		? [...[salt.nAn, salt.nCat, 1, 3, 6].filter((c) => !m.charges.includes(c)).map((c) => `${a.nome} di ${m.nome}(${ROMAN[c]})`), `${ato(a)} di ${m.nome}(${ROMAN[q]})`]
		: [`${ato(a)} ${m.adj![m.charges.indexOf(q)]}`, `${ito(a)} ${m.adj![m.charges.indexOf(other)]}`, `${a.nome} di ${m.nome}`, `${ato(a)} ${m.adj![m.charges.indexOf(other)]}`];
	return {
		prompt: 'Dai il nome al sale.',
		problem: textBlock(`Che nome ha $${mathrm(salt.tex)}$ ${stock ? 'nella notazione di Stock' : 'nella nomenclatura tradizionale'}?`),
		solution: nameOpt(right).latex,
		steps: [...chargeSteps(m, q, a), textBlock(stock ? `Notazione di Stock: ${salt.stock}.` : `$+${q}$ è il numero di ossidazione più ${q === m.charges[0] ? 'basso' : 'alto'} ${del(m.nome)}: ${salt.trad}.`)],
		answer: choose(rng, nameOpt(right), [otherName, ...shuffled(rng, rest)].filter((w) => w !== salt.iupac && w !== salt.trad && w !== salt.stock).map(nameOpt)),
		params: { case: stock ? 'stock' : 'tradizionale', salt: salt.tex },
	};
}

// ---------------------------------------------------------------------------
// Level 5: from the name to the formula

const STYLE = { trad: 'tradizionale', stock: 'di Stock', iupac: 'IUPAC' } as const;

function level5(rng: Rng): Built {
	const [m, q, a] = pair(rng, rng.next() < 0.7 ? TWO : ONE);
	const salt = binarySalt(m, q, a);
	const style = rng.pick(['trad', 'stock', 'iupac'] as const);
	const name = salt[style];
	const others = m.charges.filter((c) => c !== q).map((c) => binarySalt(m, c, a).tex);
	const steps =
		style === 'iupac'
			? [textBlock(`I prefissi sono gli indici: ${salt.nAn === 1 ? 'un atomo' : `$${salt.nAn}$ atomi`} di ${a.elemento} e ${salt.nCat === 1 ? 'un atomo' : `$${salt.nCat}$ atomi`} di ${m.nome}.`), mathrm(salt.tex)]
			: [textBlock(m.charges.length === 1 ? `${cap(il(m.nome))} forma solo lo ione $${ion(m.sym, q)}$.` : style === 'trad' ? `Il suffisso ${q === m.charges[0] ? '-oso indica la carica più bassa' : '-ico indica la carica più alta'} ${del(m.nome)}: $${ion(m.sym, q)}$.` : `Il numero romano dà lo ione $${ion(m.sym, q)}$.`), ...crossSteps(m, q, a)];
	return {
		prompt: 'Scrivi la formula del sale.',
		problem: textBlock(`Il nome ${STYLE[style]} di un sale è ${name}. Qual è la sua formula?`),
		solution: mathrm(salt.tex),
		steps,
		answer: choose(rng, formulaOpt(salt.tex), [...others, ...wrongFormulas(rng, m, q, a)].map(formulaOpt)),
		params: { case: style, name },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkChoice(sample);
}

export const chimSaliBinari: Generator = {
	id: ID,
	title: 'I sali binari',
	levels: {
		1: { label: 'Gli ioni e i loro nomi', constraints: ['cationi con due cariche, tradizionale e Stock; anioni degli idracidi'] },
		2: { label: 'Dagli ioni alla formula', constraints: ['incrocio e semplificazione; sali stabili'] },
		3: { label: 'Dalla formula al nome, metallo con un solo numero di ossidazione', constraints: ['nome tradizionale o IUPAC'] },
		4: { label: 'Dalla formula al nome, metallo con due numeri di ossidazione', constraints: ['nome tradizionale o di Stock, dalla carica dell’anione'] },
		5: { label: 'Dal nome alla formula', constraints: ['tradizionale, Stock o IUPAC'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimSaliBinari;
