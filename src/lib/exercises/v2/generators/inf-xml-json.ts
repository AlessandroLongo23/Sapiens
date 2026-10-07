/**
 * Exercises for the lesson "Dati strutturati: XML e JSON" (informatica, third year, lesson 81).
 * Spec: specs/exercises/inf-xml-json.md
 *
 * 1. reading an XML document as a tree (root, children, attributes); 2. which XML fragment is well formed;
 * 3. reading a JSON value (a path, an array, the type of a value); 4. which fragment is valid JSON; 5. the same
 * data from one format to the other.
 *
 * Every level is a multiple choice on fragments in fixed width (`listing`): there is no program to run. The
 * independent check reads the fragments with Python's own XML and JSON parsers.
 */
import type { Rng } from '../types';
import { listingOption, makeCodeGenerator, textOption, type CodeBuilt } from '../inf-codice';
import { drawn, pick, some } from '../inf-file';

export const ID = 'inf-xml-json';

const PEOPLE = ['Anna', 'Luca', 'Sara', 'Marco', 'Elena', 'Dario', 'Marta', 'Piero', 'Irene', 'Fabio'] as const;
const lines = (...rows: string[]) => rows.join('\n') + '\n';

// ---------------------------------------------------------------- level 1: an XML document as a tree

/** A document of level 1: a root with one attribute, and items that each hold a name and some numbers. */
interface Shape {
	root: string;
	attribute: [string, readonly string[]];
	item: string;
	name: string;
	names: readonly string[];
	number: string;
	range: [number, number];
}
const SHAPES: readonly Shape[] = [
	{ root: 'classe', attribute: ['sezione', ['3B', '2A', '4C', '1D']], item: 'studente', name: 'nome', names: PEOPLE, number: 'voto', range: [4, 10] },
	{ root: 'squadra', attribute: ['sport', ['calcio', 'basket', 'rugby']], item: 'giocatore', name: 'nome', names: PEOPLE, number: 'gol', range: [1, 9] },
	{ root: 'playlist', attribute: ['genere', ['rock', 'pop', 'jazz']], item: 'brano', name: 'titolo', names: ['Onde', 'Alba', 'Neve', 'Luna', 'Mare', 'Vento'], number: 'voto', range: [1, 5] }
];

type Tree = 'figli' | 'attributo' | 'radice' | 'quanti';
const TREES: readonly Tree[] = ['figli', 'attributo', 'radice', 'quanti'];

function level1(rng: Rng, family: Tree): CodeBuilt {
	const s = rng.pick(SHAPES);
	const value = rng.pick(s.attribute[1]);
	// two or three items, with a different number of numbers each: at most 17 rows
	const k = rng.int(2, 3);
	const counts = some(rng, [1, 2, 3], k);
	const names = some(rng, s.names, k);
	const xml = lines(`<${s.root} ${s.attribute[0]}="${value}">`, ...names.flatMap((name, i) => [`  <${s.item}>`, `    <${s.name}>${name}</${s.name}>`, ...Array.from({ length: counts[i] }, () => `    <${s.number}>${rng.int(...s.range)}</${s.number}>`), `  </${s.item}>`]), `</${s.root}>`);
	const total = counts.reduce((a, b) => a + b, 0);
	const base = { listing: xml };
	if (family === 'radice')
		return {
			...base,
			prompt: "La radice è l'elemento che contiene tutti gli altri.",
			problem: "Qual è l'elemento radice di questo documento XML?",
			solution: s.root,
			steps: [`Il documento si apre con il tag <${s.root}> e si chiude con </${s.root}>: tutto il resto sta tra i due.`, `L'elemento radice è ${s.root}; ${s.attribute[0]} è un suo attributo, non un elemento.`],
			answer: pick(rng, textOption(s.root), [s.item, s.attribute[0], s.name, value, s.number].map((x) => textOption(x))),
			params: { case: family, ask: 'root' }
		};
	if (family === 'attributo')
		return {
			...base,
			prompt: "Un attributo sta dentro il tag di apertura, con il valore tra virgolette.",
			problem: `In questo documento XML, qual è il valore dell'attributo ${s.attribute[0]}?`,
			solution: value,
			steps: [`L'attributo ${s.attribute[0]} è scritto nel tag di apertura dell'elemento ${s.root}.`, `Il suo valore è quello tra virgolette dopo il segno di uguale: ${value}.`],
			answer: pick(rng, textOption(value), [s.root, s.attribute[0], names[0], s.item, ...s.attribute[1].filter((x) => x !== value).slice(0, 1)].map((x) => textOption(x))),
			params: { case: family, ask: 'attribute', attribute: s.attribute[0] }
		};
	if (family === 'quanti')
		return {
			...base,
			prompt: 'Conta gli elementi con quel nome, in tutto il documento.',
			problem: `Quanti elementi ${s.number} ci sono in tutto in questo documento XML?`,
			solution: String(total),
			steps: [`Gli elementi ${s.number} stanno dentro gli elementi ${s.item}: ${counts.join(', ')}.`, `In tutto sono ${counts.join(' + ')} = ${total}.`],
			answer: pick(rng, textOption(String(total)), [counts[0], k, total + k, total + 1, total - 1, 2 * total].map((x) => textOption(String(x)))),
			params: { case: family, ask: 'count', tag: s.number }
		};
	// the children of the root, or of one of the items
	const which = rng.int(0, k);
	if (which === k)
		return {
			...base,
			prompt: 'I figli di un elemento sono quelli scritti direttamente dentro di lui, un livello sotto.',
			problem: `In questo documento XML, quanti figli ha l'elemento radice ${s.root}?`,
			solution: String(k),
			steps: [`Direttamente dentro ${s.root} ci sono solo gli elementi ${s.item}: sono ${k}.`, `Gli elementi ${s.name} e ${s.number} stanno un livello più sotto: sono figli di ${s.item}, non della radice.`],
			answer: pick(rng, textOption(String(k)), [k + total, 2 * k + total, total, k + 1, 1, 2 * k].map((x) => textOption(String(x)))),
			params: { case: family, ask: 'children', of: null }
		};
	const mine = 1 + counts[which];
	return {
		...base,
		prompt: 'I figli di un elemento sono quelli scritti direttamente dentro di lui, un livello sotto.',
		problem: `In questo documento XML, quanti figli ha l'elemento ${s.item} che contiene ${names[which]}?`,
		solution: String(mine),
		steps: [`L'elemento ${s.item} di ${names[which]} si apre prima di <${s.name}>${names[which]}</${s.name}> e si chiude con il primo </${s.item}> che segue.`, `Tra i due tag ci sono un elemento ${s.name} e ${counts[which]} ${counts[which] === 1 ? 'elemento' : 'elementi'} ${s.number}: ${mine} figli.`],
		answer: pick(rng, textOption(String(mine)), [counts[which], mine + 1, k, k + total, total, mine + 2].map((x) => textOption(String(x)))),
		params: { case: family, ask: 'children', of: names[which] }
	};
}

// ---------------------------------------------------------------- level 2: well formed or not

/** A small flat document: a root with an attribute and two or three children with a text. */
const FLAT = [
	{ root: 'gita', attribute: 'meta', values: ['Roma', 'Pisa', 'Bari'], child: 'iscritto', texts: PEOPLE },
	{ root: 'spesa', attribute: 'negozio', values: ['forno', 'bar', 'edicola'], child: 'voce', texts: ['pane', 'latte', 'uova', 'riso', 'mele'] },
	{ root: 'orario', attribute: 'giorno', values: ['lunedi', 'sabato'], child: 'materia', texts: ['storia', 'fisica', 'arte', 'latino'] }
] as const;
type Flat = (typeof FLAT)[number]['root'];
const FLATS: readonly Flat[] = FLAT.map((f) => f.root);

function level2(rng: Rng, family: Flat): CodeBuilt {
	const f = FLAT.find((x) => x.root === family)!;
	const value = rng.pick(f.values);
	const texts = some(rng, f.texts, rng.int(2, 3));
	const at = rng.int(0, texts.length - 1);
	const open = (quoted = true) => `<${f.root} ${f.attribute}=${quoted ? `"${value}"` : value}>`;
	const child = (text: string) => `  <${f.child}>${text}</${f.child}>`;
	/** The document with the child `at` written as `row` (or as more rows), and the rest as it should be. */
	const doc = (rows: string[] | null, first = open(), last: string[] = [`</${f.root}>`]) => lines(first, ...texts.flatMap((text, i) => (i === at && rows ? rows : [child(text)])), ...last);
	const capital = f.child[0].toUpperCase() + f.child.slice(1);
	const right = doc(null);
	const wrong = [
		{ text: doc([`  <${f.child}>${texts[at]}<${f.child}>`]), why: `il tag di chiusura di ${texts[at]} non ha la barra, quindi apre un altro elemento` },
		{ text: doc([`  <${capital}>${texts[at]}</${f.child}>`]), why: `<${capital}> e </${f.child}> sono due nomi diversi, perché le maiuscole contano` },
		{ text: doc(null, open(false)), why: `il valore dell'attributo ${f.attribute} non è tra virgolette` },
		{ text: lines(...texts.map((text) => child(text).trim())), why: "non c'è un solo elemento radice che contiene gli altri" },
		{ text: doc([`  <${f.child}>${texts[at]}`]), why: `l'elemento di ${texts[at]} non viene mai chiuso` },
		{ text: lines(open(), ...texts.slice(0, -1).map(child), `  <${f.child}>${texts[texts.length - 1]}`, `</${f.root}>`, `  </${f.child}>`), why: `l'ultimo elemento ${f.child} si chiude dopo ${f.root}: i due elementi si accavallano` },
		{ text: doc([`  <${f.child}>${texts[at]}</${f.root}>`]), why: `l'elemento di ${texts[at]} è chiuso con il nome sbagliato` }
	];
	const chosen = some(rng, wrong, 3);
	return {
		prompt: 'Controlla che ogni tag aperto sia chiuso, nel giusto ordine e con lo stesso nome.',
		problem: 'Quale di questi frammenti XML è ben formato?',
		solution: "Quello con una sola radice, ogni elemento chiuso con lo stesso nome con cui è aperto, e il valore dell'attributo tra virgolette.",
		steps: chosen.map((w) => `In uno dei frammenti ${w.why}.`),
		solutionListing: right,
		answer: pick(
			rng,
			listingOption(right),
			chosen.map((w) => listingOption(w.text))
		),
		params: { case: family }
	};
}

// ---------------------------------------------------------------- level 3: reading JSON

type Value = string | number | boolean | Value[] | { [name: string]: Value };
const word = (v: Value): string => (typeof v === 'string' ? `"${v}"` : Array.isArray(v) ? `[${v.map(word).join(', ')}]` : typeof v === 'object' ? `{ ${Object.entries(v).map(([n, x]) => `"${n}": ${word(x)}`).join(', ')} }` : String(v));
/** An object as the lessons write it: one pair per row, arrays and inner objects on their row. */
const json = (object: { [name: string]: Value }) => lines('{', ...Object.entries(object).map(([name, v], i, all) => `  "${name}": ${word(v)}${i < all.length - 1 ? ',' : ''}`), '}');

type Json = 'valore' | 'quanti' | 'coppie' | 'tipo';
const JSONS: readonly Json[] = ['valore', 'quanti', 'coppie', 'tipo'];
const TYPE = { testo: 'un testo', numero: 'un numero', array: 'un array', oggetto: 'un oggetto', logico: 'vero o falso' } as const;
const typeOf = (v: Value): keyof typeof TYPE => (typeof v === 'string' ? 'testo' : typeof v === 'number' ? 'numero' : typeof v === 'boolean' ? 'logico' : Array.isArray(v) ? 'array' : 'oggetto');

/** A student, or a player, with a list of numbers, a list of texts, a number written as a text, a truth value and an inner object. */
function record(rng: Rng): { [name: string]: Value } {
	const numbers = Array.from({ length: rng.int(3, 4) }, () => rng.int(4, 10));
	const extra: [string, Value][] = [
		['eta', rng.int(14, 18)],
		['classe', rng.pick(['3B', '2A', '4C'])],
		['anno', String(rng.int(1, 5))],
		['sport', some(rng, ['nuoto', 'judo', 'corsa', 'vela'], rng.int(2, 3))],
		['iscritto', rng.int(0, 1) === 1],
		['casa', { citta: rng.pick(['Pisa', 'Bari', 'Lodi']), piano: rng.int(1, 6) }]
	];
	const chosen = some(rng, extra, rng.int(2, 3));
	const pairs: [string, Value][] = [['nome', rng.pick(PEOPLE)], ...chosen];
	pairs.splice(rng.int(1, pairs.length), 0, ['voti', numbers]);
	return Object.fromEntries(pairs);
}

function level3(rng: Rng, family: Json): CodeBuilt {
	for (;;) {
		const data = record(rng);
		const text = json(data);
		const names = Object.keys(data);
		const voti = data.voti as number[];
		const base = { listing: text };
		if (family === 'coppie') {
			const inner = Object.values(data).reduce((s: number, v) => s + (typeof v === 'object' && !Array.isArray(v) ? Object.keys(v).length : 0), 0);
			const leaves = Object.values(data).reduce((s: number, v) => s + (Array.isArray(v) ? v.length : typeof v === 'object' ? Object.keys(v).length : 1), 0);
			return {
				...base,
				prompt: "Una coppia è fatta di un nome, dei due punti e di un valore; anche un array intero è un valore solo.",
				problem: "Quante coppie di nome e valore ha l'oggetto più esterno di questo JSON?",
				solution: String(names.length),
				steps: [`Le coppie dell'oggetto più esterno sono quelle separate dalle virgole a fine riga: ${names.join(', ')}.`, `Sono ${names.length}. Un array conta come un valore solo, qualunque sia il numero dei suoi elementi.`],
				answer: pick(rng, textOption(String(names.length)), [leaves, names.length + inner, names.length + 1, names.length - 1, voti.length, 2 * names.length].map((x) => textOption(String(x)))),
				params: { case: family, ask: 'pairs' }
			};
		}
		if (family === 'quanti') {
			const sum = voti.reduce((a, b) => a + b, 0);
			return {
				...base,
				prompt: 'Gli elementi di un array stanno tra le parentesi quadre, separati dalle virgole.',
				problem: "In questo JSON, quanti elementi ha l'array voti?",
				solution: String(voti.length),
				steps: [`L'array voti è ${word(voti)}.`, `Tra le parentesi quadre ci sono ${voti.length} valori, separati da ${voti.length - 1} virgole.`],
				answer: pick(rng, textOption(String(voti.length)), [voti.length - 1, voti.length + 1, names.length, sum, 1, voti[0]].map((x) => textOption(String(x)))),
				params: { case: family, ask: 'length', path: ['voti'] }
			};
		}
		if (family === 'tipo') {
			const name = rng.pick(names.filter((n) => n !== 'nome'));
			const type = typeOf(data[name]);
			const why = { testo: 'è tra virgolette doppie, quindi è un testo, anche quando contiene delle cifre', numero: 'è scritto senza virgolette ed è fatto di cifre: è un numero', array: 'sta tra parentesi quadre: è un array', oggetto: 'sta tra parentesi graffe: è un oggetto', logico: 'è true oppure false, senza virgolette: vale vero o falso' }[type];
			return {
				...base,
				prompt: 'Guarda come è scritto il valore: virgolette, cifre, parentesi quadre o graffe.',
				problem: `In questo JSON, di che tipo è il valore di ${name}?`,
				solution: TYPE[type],
				steps: [`Il valore di ${name} è ${word(data[name])}.`, `Il valore ${why}.`],
				answer: pick(
					rng,
					textOption(TYPE[type], type),
					(Object.keys(TYPE) as (keyof typeof TYPE)[]).filter((t) => t !== type).map((t) => textOption(TYPE[t], t))
				),
				params: { case: family, ask: 'type', path: [name] }
			};
		}
		// a path of two steps: an element of an array, or a pair of the inner object
		const deep = names.filter((n) => typeof data[n] === 'object');
		const name = rng.pick(deep);
		const inside = data[name] as Value[] | { [k: string]: Value };
		const key = Array.isArray(inside) ? rng.int(0, inside.length - 1) : rng.pick(Object.keys(inside));
		const got = (inside as Record<string | number, Value>)[key];
		const path = `dati["${name}"][${typeof key === 'number' ? key : `"${key}"`}]`;
		const all = Array.isArray(inside) ? inside : Object.values(inside);
		const others = [...all.filter((x) => x !== got), ...(typeof key === 'number' ? [key, inside.length] : [key]), data.nome, name];
		if (new Set(all.map(String)).size !== all.length) continue;
		return {
			...base,
			prompt: 'Segui le parentesi quadre una alla volta, da sinistra.',
			problem: `Un programma in Python legge questo file con json.load e mette il risultato nella variabile dati. Quanto vale ${path}?`,
			solution: String(got),
			steps: [
				`dati["${name}"] è il valore della coppia ${name}: ${word(inside)}.`,
				typeof key === 'number' ? `È un array, e i suoi elementi si contano da 0: quello di indice ${key} è ${word(got)}.` : `È un oggetto, e il valore si prende con il suo nome: quello di ${key} è ${word(got)}.`
			],
			answer: pick(
				rng,
				textOption(String(got)),
				others.map((x) => textOption(String(x)))
			),
			params: { case: family, ask: 'value', path: [name, key] }
		};
	}
}

// ---------------------------------------------------------------- level 4: valid JSON or not

const OBJECTS = ['studente', 'brano', 'gita'] as const;
type Thing = (typeof OBJECTS)[number];

function level4(rng: Rng, family: Thing): CodeBuilt {
	const [text, number, list] = {
		studente: [['nome', rng.pick(PEOPLE)], ['eta', rng.int(14, 18)], ['voti', some(rng, [5, 6, 7, 8, 9], 3)]],
		brano: [['titolo', rng.pick(['Onde', 'Alba', 'Neve', 'Luna'])], ['durata', rng.int(150, 290)], ['voti', some(rng, [1, 2, 3, 4, 5], 3)]],
		gita: [['meta', rng.pick(['Roma', 'Pisa', 'Bari'])], ['euro', rng.int(12, 40)], ['giorni', some(rng, [3, 4, 5, 10, 11, 12], 3)]]
	}[family] as [[string, string], [string, number], [string, number[]]];
	const rows = (a: string, b: string, c: string) => lines('{', `  ${a}`, `  ${b}`, `  ${c}`, '}');
	const first = `"${text[0]}": "${text[1]}",`;
	const second = `"${number[0]}": ${number[1]},`;
	const third = `"${list[0]}": [${list[1].join(', ')}]`;
	const right = rows(first, second, third);
	const wrong = [
		{ text: rows(first, second, third + ','), why: "dopo l'ultima coppia c'è una virgola di troppo" },
		{ text: rows(`'${text[0]}': '${text[1]}',`, second, third), why: 'il nome e il testo sono tra apici singoli, mentre JSON vuole le virgolette doppie' },
		{ text: rows(`${text[0]}: "${text[1]}",`, second, third), why: `il nome ${text[0]} è scritto senza virgolette` },
		{ text: rows(first, `"${number[0]}" = ${number[1]},`, third), why: 'tra il nome e il valore ci va il segno dei due punti, non quello di uguale' },
		{ text: rows(first, `"${number[0]}": ${number[1]}`, third), why: 'tra due coppie manca la virgola' },
		{ text: rows(first, second, `"${list[0]}": [${list[1].join(', ')},]`), why: "nell'array c'è una virgola dopo l'ultimo elemento" },
		{ text: rows(first, second, `"${list[0]}": (${list[1].join(', ')})`), why: "l'array è tra parentesi tonde, mentre vuole le quadre" },
		{ text: rows(`"${text[0]}": ${text[1]},`, second, third), why: `il testo ${text[1]} è scritto senza virgolette` },
		{ text: rows(first, `"${number[0]}": ${number[1]},5,`, third), why: 'il numero ha la virgola decimale, mentre JSON vuole il punto' }
	];
	const chosen = some(rng, wrong, 3);
	return {
		prompt: 'Controlla virgolette, due punti e virgole, una coppia alla volta.',
		problem: 'Quale di questi frammenti è scritto in JSON valido?',
		solution: "Quello con i nomi e i testi tra virgolette doppie, i due punti tra nome e valore, e una virgola tra una coppia e la successiva ma non dopo l'ultima.",
		steps: chosen.map((w) => `In uno dei frammenti ${w.why}.`),
		solutionListing: right,
		answer: pick(
			rng,
			listingOption(right),
			chosen.map((w) => listingOption(w.text))
		),
		params: { case: family }
	};
}

// ---------------------------------------------------------------- level 5: from one format to the other

/** A datum with two texts and a list of numbers, and the names XML gives to the list and to its elements. */
interface Datum {
	root: string;
	first: [string, string];
	second: [string, string];
	list: [string, string, number[]];
}

const xmlOf = (d: Datum, list = d.list[2], first = d.first[1], second = d.second[1]) => lines(`<${d.root}>`, `  <${d.first[0]}>${first}</${d.first[0]}>`, `  <${d.second[0]}>${second}</${d.second[0]}>`, `  <${d.list[0]}>`, ...list.map((x) => `    <${d.list[1]}>${x}</${d.list[1]}>`), `  </${d.list[0]}>`, `</${d.root}>`);
const jsonOf = (d: Datum, list = d.list[2], first = d.first[1], second = d.second[1]) => json({ [d.first[0]]: first, [d.second[0]]: second, [d.list[0]]: list });

type Turn = 'xml-json' | 'json-xml';
const TURNS: readonly Turn[] = ['xml-json', 'json-xml'];

function level5(rng: Rng, family: Turn): CodeBuilt {
	const d: Datum = rng.pick([
		(): Datum => ({ root: 'studente', first: ['nome', rng.pick(PEOPLE)], second: ['classe', rng.pick(['3B', '2A', '4C', '1D'])], list: ['voti', 'voto', some(rng, [4, 5, 6, 7, 8, 9, 10], 3)] }),
		(): Datum => ({ root: 'playlist', first: ['titolo', rng.pick(['Estate', 'Viaggio', 'Studio'])], second: ['genere', rng.pick(['rock', 'pop', 'jazz'])], list: ['durate', 'durata', some(rng, [154, 187, 204, 231, 268], 3)] }),
		(): Datum => ({ root: 'squadra', first: ['nome', rng.pick(['Leoni', 'Falchi', 'Orsi'])], second: ['citta', rng.pick(['Pisa', 'Bari', 'Lodi'])], list: ['punti', 'punto', some(rng, [0, 1, 2, 3, 4, 6], 3)] })
	])();
	const [a, b, c] = d.list[2];
	const toJson = family === 'xml-json';
	const of = toJson ? jsonOf : xmlOf;
	const right = of(d);
	// every wrong option is written correctly and says something else
	const wrong = [
		{ text: of(d, [a, b]), why: `manca l'ultimo elemento della lista, ${c}` },
		{ text: of(d, [b, a, c]), why: `i primi due elementi della lista sono scambiati, e in una lista l'ordine conta` },
		{ text: of(d, d.list[2], d.second[1], d.first[1]), why: `i valori di ${d.first[0]} e di ${d.second[0]} sono scambiati` },
		{ text: of(d, [a, b, c, c]), why: `l'ultimo elemento della lista, ${c}, compare due volte` },
		toJson
			? { text: lines('{', `  "${d.first[0]}": "${d.first[1]}",`, `  "${d.second[0]}": "${d.second[1]}",`, ...d.list[2].map((x, i) => `  "${d.list[1]}": ${x}${i < 2 ? ',' : ''}`), '}'), why: `la coppia ${d.list[1]} è ripetuta tre volte al posto di un array: in un oggetto ogni nome compare una volta sola, e chi legge tiene un valore solo` }
			: { text: lines(`<${d.root}>`, `  <${d.first[0]}>${d.first[1]}</${d.first[0]}>`, `  <${d.second[0]}>${d.second[1]}</${d.second[0]}>`, `  <${d.list[0]}>${d.list[2].join('')}</${d.list[0]}>`, `</${d.root}>`), why: `i numeri della lista sono attaccati in un solo testo, ${d.list[2].join('')}, e non si distinguono più` }
	];
	const chosen = [wrong[4], ...some(rng, wrong.slice(0, 4), 2)];
	const [from, to] = toJson ? ['XML', 'JSON'] : ['JSON', 'XML'];
	return {
		prompt: `Confronta un valore alla volta, e nella lista anche quanti sono e in che ordine.`,
		problem: `Questo dato è scritto in ${from}. Quale frammento ${to} contiene gli stessi dati? I quattro frammenti sono tutti scritti senza errori.`,
		listing: toJson ? xmlOf(d) : jsonOf(d),
		solution: toJson ? `L'oggetto con le coppie ${d.first[0]} e ${d.second[0]} e l'array ${d.list[0]} con ${a}, ${b}, ${c} in quest'ordine.` : `L'elemento ${d.root} con ${d.first[0]}, ${d.second[0]} e, dentro ${d.list[0]}, tre elementi ${d.list[1]} con ${a}, ${b}, ${c} in quest'ordine.`,
		steps: [
			toJson ? `L'elemento ${d.list[0]} contiene tre elementi ${d.list[1]}: in JSON diventano un array, ${word(d.list[2])}, e il nome ${d.list[1]} non serve più.` : `L'array ${d.list[0]} ha tre valori: in XML diventano tre elementi ${d.list[1]} dentro un elemento ${d.list[0]}.`,
			...chosen.map((w) => `In uno dei frammenti sbagliati ${w.why}.`)
		],
		solutionListing: right,
		answer: pick(
			rng,
			listingOption(right),
			chosen.map((w) => listingOption(w.text))
		),
		params: { case: family, root: d.root, list: d.list[0], item: d.list[1] }
	};
}

/**
 * The fragment under the question and the right one go in `params` too: they are what the check reads, and what
 * tells one exercise from another where the rest of `params` is only the case.
 */
const carried =
	(build: (rng: Rng) => CodeBuilt) =>
	(rng: Rng): CodeBuilt => {
		const built = build(rng);
		return { ...built, params: { ...built.params, shown: built.listing ?? null, right: built.solutionListing ?? null } };
	};

/** No level has a program to run: what each asks is read from the fragments. */
const worded = (sample: { params: Record<string, unknown> }) => (sample.params.program ? ['a level of fragments has no program'] : []);

export default makeCodeGenerator(ID, 'Dati strutturati: XML e JSON', {
	1: { label: "Leggere l'albero di un XML", constraints: ['a document of at most 17 rows: a root with an attribute, two or three items', 'one right answer read from the tree'], build: carried(drawn(TREES, level1)), check: worded },
	2: { label: 'XML ben formato', constraints: ['four fragments, one well formed', 'each wrong one breaks one rule'], build: carried(drawn(FLATS, level2)), check: worded },
	3: { label: 'Leggere un JSON', constraints: ['an object of four or five pairs with an array of numbers', 'one right answer read from the value'], build: carried(drawn(JSONS, level3)), check: worded },
	4: { label: 'JSON valido', constraints: ['four fragments, one valid', 'each wrong one has one mistake'], build: carried(drawn(OBJECTS, level4)), check: worded },
	5: { label: "Da un formato all'altro", constraints: ['four fragments written without mistakes', 'only one holds the same data'], build: carried(drawn(TURNS, level5)), check: worded }
});
