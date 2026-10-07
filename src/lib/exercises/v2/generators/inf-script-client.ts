/**
 * Exercises for "Gli script nella pagina web" (informatica, third year). Spec: specs/exercises/inf-script-client.md
 *
 * 1. where a script runs, and what it finds in the page when it starts; 2. what a script writes on the console
 * (console.log, a text plus a number, a const assigned again); 3. if, ===, && and ||; 4. for, while and functions;
 * 5. a fragment of Python and the JavaScript that does the same.
 *
 * Every level is a multiple choice. The JavaScript is text: the right answer is worked out here from the numbers of
 * the fragment, and the independent check reads the fragment with its own interpreter.
 */
import type { Rng } from '../types';
import { choose, listingOption, makeCodeGenerator, printedOption, shuffle, textOption, SHOWN_WIDTH, type CodeBuilt } from '../inf-codice';
import { drawn, fragments, pick, rows, select, shown, STOPS, weighted } from '../inf-g14-web';

export const ID = 'inf-script-client';

// ------------------------------------------------------------------ level 1

interface Claim {
	id: string;
	text: string;
	why: string;
}

const TRUE: Claim[] = [
	{ id: 't1', text: 'Lo esegue il browser, sul dispositivo di chi apre la pagina.', why: 'Il file arriva dal server, ma il programma lo esegue il browser, che nel modello client-server è il client.' },
	{ id: 't2', text: 'Chi apre la pagina può leggere il testo dello script.', why: 'Il file dello script arriva sul dispositivo di chi apre la pagina, che quindi può aprirlo e leggerlo.' },
	{ id: 't3', text: 'Per fare il conto lo script non aspetta una risposta dal server.', why: 'Lo script gira nel browser: per un conto non serve la rete, e la risposta è immediata.' },
	{ id: 't4', text: 'Lo script non può leggere i file sul disco di chi apre la pagina.', why: 'Il browser tiene lo script chiuso dentro la pagina: i file del disco restano fuori dalla sua portata.' },
	{ id: 't5', text: 'Il file dello script arriva dal server con una richiesta HTTP.', why: 'Il browser chiede il file .js al server come chiede il foglio di stile e le immagini, con una richiesta HTTP per ogni file.' },
	{ id: 't6', text: 'Lo script non può guardare le altre schede aperte nel browser.', why: 'Il browser tiene lo script chiuso dentro la sua pagina: le altre schede non le vede.' }
];

const FALSE: Claim[] = [
	{ id: 'f1', text: 'Lo esegue il server, che poi spedisce la pagina già pronta.', why: "È falsa: il server spedisce il file dello script così com'è, e a eseguirlo è il browser di chi apre la pagina." },
	{ id: 'f2', text: 'Il testo dello script resta sul server: chi apre la pagina non lo vede.', why: 'È falsa: il file dello script arriva sul dispositivo di chi apre la pagina, che può leggerlo.' },
	{ id: 'f3', text: 'Una password scritta nello script resta segreta.', why: 'È falsa: chiunque apra la pagina può leggere lo script, quindi dentro non si scrive niente di segreto.' },
	{ id: 'f4', text: 'Lo script può leggere i file sul disco di chi apre la pagina.', why: 'È falsa: il browser tiene lo script chiuso dentro la pagina, lontano dai file del disco.' },
	{ id: 'f5', text: 'Per ogni conto lo script chiede il risultato al server.', why: 'È falsa: il conto lo fa il browser, senza passare dalla rete, e per questo la risposta è immediata.' },
	{ id: 'f6', text: 'Lo script può leggere le altre schede aperte nel browser.', why: 'È falsa: uno script vede solo la sua pagina, non le altre schede.' },
	{ id: 'f7', text: 'Lo script è scritto in Java.', why: 'È falsa: il linguaggio degli script è JavaScript. Java è un altro linguaggio, e con le pagine web non ha a che fare.' },
	{ id: 'f8', text: 'Lo script gira una volta sola, sul computer di chi ha scritto la pagina.', why: 'È falsa: lo script gira ogni volta che un browser apre la pagina, sul dispositivo di chi la apre.' }
];

const SCRIPTS = [
	{ file: 'posti.js', page: 'dei biglietti', does: 'calcola i posti liberi' },
	{ file: 'conto.js', page: "dell'iscrizione", does: 'calcola il totale da pagare' },
	{ file: 'sito.js', page: 'del concerto', does: 'conta i giorni che mancano al concerto' },
	{ file: 'brani.js', page: 'della scaletta', does: 'conta i brani in scaletta' }
] as const;

function concept(rng: Rng): CodeBuilt {
	const script = rng.pick(SCRIPTS);
	const ask = rng.pick(['vera', 'falsa'] as const);
	const [same, other] = ask === 'vera' ? [TRUE, FALSE] : [FALSE, TRUE];
	const right = rng.pick(same);
	const wrong = shuffle(rng, other).slice(0, 3);
	return {
		prompt: 'Pensa a dove arriva il file dello script e a chi lo esegue.',
		problem: `La pagina ${script.page} dei Fuori Tempo ha uno script, ${script.file}, che ${script.does}. Quale di queste affermazioni è ${ask}?`,
		solution: right.text,
		steps: [
			right.why,
			ask === 'vera'
				? 'Il file dello script arriva dal server, ma il programma lo esegue il browser: per questo risponde subito, chiunque può leggerlo, e resta chiuso dentro la pagina.'
				: 'Le altre tre affermazioni sono vere: lo script arriva dal server come file e poi gira nel browser, chiuso dentro la sua pagina.'
		],
		answer: choose(
			rng,
			textOption(right.text, right.id),
			wrong.map((c) => textOption(c.text, c.id))
		),
		params: { case: 'concetto', ask, file: script.file, right: right.id, others: wrong.map((c) => c.id) }
	};
}

type Place = 'head' | 'defer' | 'fondo';

const COUNTS = [
	{ id: 'liberi', file: 'posti.js', title: 'Posti liberi', names: ['posti', 'venduti'], op: '-', draw: (rng: Rng) => [rng.int(10, 15) * 10, rng.int(60, 95)] },
	{ id: 'totale', file: 'conto.js', title: 'Totale in euro', names: ['prezzo', 'biglietti'], op: '*', draw: (rng: Rng) => [rng.int(5, 9), rng.int(2, 6)] },
	{ id: 'brani', file: 'brani.js', title: 'Brani in scaletta', names: ['brani', 'bis'], op: '+', draw: (rng: Rng) => [rng.int(6, 9), rng.int(2, 4)] }
] as const;

const PLACEHOLDERS = ['?', '...', '0', 'tra poco'] as const;

function order(rng: Rng, place: Place): CodeBuilt {
	const count = rng.pick(COUNTS);
	const file = count.file;
	const placeholder = rng.pick(PLACEHOLDERS);
	const ask = rng.pick(['pagina', 'trova'] as const);
	const [a, b] = count.draw(rng);
	const value = count.op === '-' ? a - b : count.op === '*' ? a * b : a + b;
	const tag = `    <script src="${file}"${place === 'defer' ? ' defer' : ''}></script>`;
	const html = rows('<head>', '    <title>I Fuori Tempo</title>', place !== 'fondo' && tag, '</head>', '<body>', `    <h1>${count.title}</h1>`, `    <p id="${count.id}">${placeholder}</p>`, place === 'fondo' && tag, '</body>');
	const [first, second] = count.names;
	const script =
		ask === 'pagina' ? rows(`const ${first} = ${a};`, `const ${second} = ${b};`, select('voce', `#${count.id}`), `voce.textContent = ${first} ${count.op} ${second};`) : rows(select('voce', `#${count.id}`), 'console.log(voce);');
	const found = place !== 'head';
	const where =
		place === 'head'
			? "Il browser legge il file HTML dall'alto in basso. Il tag script è nella head e non ha defer: il browser si ferma lì ed esegue subito lo script."
			: place === 'defer'
				? 'Il tag script ha defer: il browser continua a leggere la pagina ed esegue lo script quando è stata costruita tutta.'
				: "Il tag script è l'ultima cosa del body: quando il browser ci arriva ha già letto e costruito tutto quello che sta sopra.";
	const finds = found ? `Quando lo script parte l'elemento con id ${count.id} esiste già, e querySelector lo trova.` : `In quel momento il body non è ancora stato letto: l'elemento con id ${count.id} non esiste, e querySelector restituisce null.`;
	if (ask === 'trova') {
		const element = textOption(`l'elemento p con id ${count.id}`, 'elemento');
		const nothing = textOption('null', 'null');
		return {
			prompt: 'Segui il browser mentre legge il file HTML dall\'alto in basso.',
			problem: `Il frammento mostra una pagina e, sotto il nome del file, il suo script ${file}. Quando lo script parte, che cosa c'è nella costante voce?`,
			listing: shown(html, script, file),
			solution: found ? `L'elemento p con id ${count.id}.` : 'null: quando lo script parte il paragrafo non esiste ancora.',
			steps: [where, finds],
			answer: choose(rng, found ? element : nothing, [found ? nothing : element, textOption('il testo scritto nel paragrafo', 'testo'), textOption('tutta la pagina', 'pagina')]),
			params: { case: place, ask, file, id: count.id, html, script }
		};
	}
	const right = found ? String(value) : placeholder;
	return {
		prompt: 'Segui il browser mentre legge il file HTML dall\'alto in basso.',
		problem: `Il frammento mostra una pagina e, sotto il nome del file, il suo script ${file}. Apri la pagina nel browser: che cosa si legge sotto il titolo?`,
		listing: shown(html, script, file),
		solution: found ? `Si legge ${value}.` : `Resta scritto ${placeholder}: lo script si ferma con un errore.`,
		steps: [where, finds, found ? `Lo script calcola ${a} ${count.op} ${b} = ${value} e lo mette nel paragrafo, al posto di quello che c'era.` : `La riga dopo prova a usare null: lo script si ferma con un errore, e nel paragrafo resta quello che dice l'HTML.`],
		answer: choose(rng, textOption(right), [textOption(found ? placeholder : String(value)), textOption('null'), textOption(`${first} ${count.op} ${second}`)]),
		params: { case: place, ask, file, id: count.id, html, script }
	};
}

function level1(rng: Rng): CodeBuilt {
	const kind = weighted(rng, { concetto: 4, head: 2, defer: 2, fondo: 2 });
	return kind === 'concetto' ? concept(rng) : order(rng, kind);
}

// ------------------------------------------------------------------ level 2

/** An argument of console.log: what it writes, whether it is a text between quotes, and how it is written in the script. */
interface Arg {
	out: string;
	text: boolean;
	source: string;
}

const lit = (text: string): Arg => ({ out: text, text: true, source: `"${text}"` });
const num = (source: string, value: number): Arg => ({ out: String(value), text: false, source });

/** What a student writes for a console.log who has not seen how it joins its arguments. */
const misread = (args: Arg[]) => [
	args.map((a) => a.out).join(''),
	args.map((a) => a.out).join(', '),
	args.map((a) => (a.text ? `"${a.out}"` : a.out)).join(' '),
	args.map((a) => (a.text ? a.out : a.source)).join(' ')
];

/** A row of a script, or two when it is too long: `const x =` and its value on the next row. */
function assign(head: string, value: string): string {
	const one = `${head} ${value};`;
	return one.length <= SHOWN_WIDTH ? one : `${head}\n    ${value};`;
}

function sums(rng: Rng): CodeBuilt {
	const form = rng.pick(['liberi', 'totale', 'persone'] as const);
	let script: string;
	let args: Arg[];
	let stale: Arg[];
	let follow: string;
	if (form === 'liberi') {
		const posti = rng.int(10, 15) * 10;
		const venduti = rng.int(60, 90);
		const c = rng.int(2, 9);
		script = rows(`const posti = ${posti};`, `let venduti = ${venduti};`, `venduti = venduti + ${c};`, 'console.log("Liberi:", posti - venduti);');
		args = [lit('Liberi:'), num('posti - venduti', posti - venduti - c)];
		stale = [lit('Liberi:'), num('posti - venduti', posti - venduti)];
		follow = `venduti parte da ${venduti} e la terza riga lo porta a ${venduti + c}: posti - venduti vale ${posti} - ${venduti + c} = ${posti - venduti - c}.`;
	} else if (form === 'totale') {
		const prezzo = rng.int(5, 9);
		const biglietti = rng.int(2, 6);
		const sconto = rng.int(2, 6);
		script = rows(`const prezzo = ${prezzo};`, `const biglietti = ${biglietti};`, 'let totale = prezzo * biglietti;', `totale = totale - ${sconto};`, 'console.log("Totale:", totale, "euro");');
		args = [lit('Totale:'), num('totale', prezzo * biglietti - sconto), lit('euro')];
		stale = [lit('Totale:'), num('totale', prezzo * biglietti), lit('euro')];
		follow = `totale parte da ${prezzo} * ${biglietti} = ${prezzo * biglietti} e la quarta riga lo porta a ${prezzo * biglietti - sconto}.`;
	} else {
		const interi = rng.int(2, 5);
		const ridotti = rng.int(1, 4);
		const altri = rng.int(1, 3);
		script = rows(`const interi = ${interi};`, `const ridotti = ${ridotti};`, 'let persone = interi + ridotti;', `persone = persone + ${altri};`, 'console.log(persone, "persone in tutto");');
		args = [num('persone', interi + ridotti + altri), lit('persone in tutto')];
		stale = [num('persone', interi + ridotti), lit('persone in tutto')];
		follow = `persone parte da ${interi} + ${ridotti} = ${interi + ridotti} e la quarta riga lo porta a ${interi + ridotti + altri}.`;
	}
	const right = args.map((a) => a.out).join(' ');
	const others = shuffle(rng, [...misread(args), stale.map((a) => a.out).join(' ')]);
	return {
		prompt: 'Segui le variabili una riga alla volta.',
		problem: 'Che cosa scrive questo script nella console?',
		listing: script,
		solution: right,
		steps: [follow, 'console.log scrive i suoi argomenti in ordine, separati da uno spazio; le virgolette dei testi non si vedono e al posto di un nome compare il suo valore.'],
		answer: pick(
			rng,
			printedOption([right]),
			others.map((row) => printedOption([row]))
		),
		params: { case: 'conto', form, script }
	};
}

const PAIRS = [
	{ a: 'interi', b: 'ridotti', sum: 'persone', label: 'Persone:' },
	{ a: 'adulti', b: 'ragazzi', sum: 'posti', label: 'Posti:' },
	{ a: 'venerdi', b: 'sabato', sum: 'biglietti', label: 'Biglietti:' }
] as const;

function texts(rng: Rng): CodeBuilt {
	const names = rng.pick(PAIRS);
	// t: a text; n: a number; N: a text passed through Number()
	const pattern = weighted(rng, { tn: 2, tt: 2, Nn: 2, NN: 2, Nt: 1, nt: 1, nn: 1 });
	const a = rng.int(1, 9);
	const b = rng.int(1, 9);
	const value = (kind: string, n: number) => (kind === 'n' ? String(n) : `"${n}"`);
	const used = (kind: string, name: string) => (kind === 'N' ? `Number(${name})` : name);
	const script = rows(`const ${names.a} = ${value(pattern[0], a)};`, `const ${names.b} = ${value(pattern[1], b)};`, assign(`const ${names.sum} =`, `${used(pattern[0], names.a)} + ${used(pattern[1], names.b)}`), `console.log("${names.label}", ${names.sum});`);
	const glued = pattern.includes('t');
	const row = (text: string | number) => `${names.label} ${text}`;
	const right = row(glued ? `${a}${b}` : a + b);
	const said = (kind: string, name: string, n: number) => (kind === 't' ? `${name} è il testo "${n}"` : kind === 'N' ? `Number(${name}) è il numero ${n}` : `${name} è il numero ${n}`);
	return {
		prompt: 'Guarda che tipo hanno i due valori prima di sommarli.',
		problem: 'Che cosa scrive questo script nella console?',
		listing: script,
		solution: right,
		steps: [
			`Un valore tra virgolette è un testo, senza virgolette è un numero, e Number(...) trasforma un testo in un numero: ${said(pattern[0], names.a, a)}, ${said(pattern[1], names.b, b)}.`,
			glued ? `Almeno uno dei due è un testo, quindi + li attacca: viene "${a}${b}".` : `Tutti e due sono numeri, quindi + fa la somma: ${a} + ${b} = ${a + b}.`
		],
		answer: choose(rng, printedOption([right]), [printedOption([row(glued ? a + b : `${a}${b}`)]), ...shuffle(rng, [printedOption([row(`${a} ${b}`)]), STOPS, printedOption([row('NaN')])])]),
		params: { case: 'testo', pattern, script }
	};
}

function constants(rng: Rng): CodeBuilt {
	const form = rng.pick(['liberi', 'totale'] as const);
	const fails = rng.int(0, 1) === 0;
	let script: string;
	let label: string;
	let after: number;
	let before: number;
	let fixed: string;
	let free: string;
	if (form === 'liberi') {
		const posti = rng.int(10, 15) * 10;
		const venduti = rng.int(60, 90);
		const c = rng.int(1, 4) * 5;
		script = rows(`const posti = ${posti};`, `let venduti = ${venduti};`, fails ? `posti = posti - ${c};` : `venduti = venduti + ${c};`, 'console.log("Liberi:", posti - venduti);');
		[label, after, before, fixed, free] = ['Liberi:', posti - venduti - c, posti - venduti, 'posti', 'venduti'];
	} else {
		const prezzo = rng.int(5, 9);
		const biglietti = rng.int(2, 6);
		const c = rng.int(1, 3);
		script = rows(`const prezzo = ${prezzo};`, `let biglietti = ${biglietti};`, fails ? `prezzo = prezzo - ${c};` : `biglietti = biglietti + ${c};`, 'console.log("Euro:", prezzo * biglietti);');
		[label, after, before, fixed, free] = ['Euro:', fails ? (prezzo - c) * biglietti : prezzo * (biglietti + c), prezzo * biglietti, 'prezzo', 'biglietti'];
	}
	const worked = printedOption([`${label} ${after}`]);
	const others = [printedOption([`${label} ${before}`]), printedOption([`${label}${after}`])];
	return {
		prompt: 'Guarda come è dichiarata la variabile che la terza riga prova a cambiare.',
		problem: 'Che cosa scrive questo script nella console?',
		listing: script,
		solution: fails ? `Niente: ${fixed} è una const e non si può assegnare di nuovo.` : `${label} ${after}`,
		steps: fails
			? [`${fixed} è dichiarata con const: il suo valore non può più cambiare.`, 'La terza riga prova ad assegnarle un valore nuovo: è un errore, lo script si ferma lì e console.log non viene eseguita.']
			: [`La terza riga cambia ${free}, che è dichiarata con let: l'assegnamento è permesso. Non potrebbe cambiare ${fixed}, che è una const.`, `Con il valore nuovo di ${free} console.log scrive ${label} ${after}.`],
		answer: choose(rng, fails ? STOPS : worked, [fails ? worked : STOPS, ...others]),
		params: { case: 'const', form, fails, script }
	};
}

const level2 = (rng: Rng, kind: 'conto' | 'testo' | 'const') => (kind === 'conto' ? sums(rng) : kind === 'testo' ? texts(rng) : constants(rng));

// ------------------------------------------------------------------ level 3

const printedAll = (list: string[][]) => list.map((r) => printedOption(r));

function branch(rng: Rng): CodeBuilt {
	if (rng.int(0, 1) === 0) {
		const biglietti = rng.int(3, 8);
		const prezzo = rng.int(5, 9);
		const soglia = biglietti + rng.pick([-1, 0, 0, 1]);
		const op = rng.pick(['>=', '>'] as const);
		const sconto = rng.int(2, 6);
		const script = rows(`const biglietti = ${biglietti};`, `let totale = ${prezzo} * biglietti;`, `if (biglietti ${op} ${soglia}) {`, `    totale = totale - ${sconto};`, '}', 'console.log("Totale:", totale);');
		const full = prezzo * biglietti;
		const holds = op === '>=' ? biglietti >= soglia : biglietti > soglia;
		const right = holds ? full - sconto : full;
		const row = (n: number) => [`Totale: ${n}`];
		return {
			prompt: 'Decidi prima se la condizione è vera o falsa.',
			problem: 'Che cosa scrive questo script nella console?',
			listing: script,
			solution: `Totale: ${right}`,
			steps: [
				`biglietti vale ${biglietti}: la condizione biglietti ${op} ${soglia} è ${holds ? 'vera' : 'falsa'}${biglietti === soglia ? (op === '>=' ? ', perché >= comprende anche il caso in cui i due numeri sono uguali' : ', perché > non comprende il caso in cui i due numeri sono uguali') : ''}.`,
				holds ? `Il blocco tra le graffe viene eseguito: totale passa da ${full} a ${full - sconto}.` : `Il blocco tra le graffe viene saltato: totale resta ${prezzo} * ${biglietti} = ${full}.`
			],
			answer: pick(rng, printedOption(row(right)), printedAll([row(holds ? full : full - sconto), row(full + sconto), row(sconto), row(biglietti - sconto), row(prezzo - sconto)])),
			params: { case: 'se', form: 'sconto', script }
		};
	}
	const posti = rng.int(10, 15) * 10;
	const venduti = posti + rng.pick([-rng.int(5, 40), -rng.int(5, 40), 0, 0, rng.int(1, 9)]);
	const op = rng.pick(['>=', '>'] as const);
	const script = rows(`const posti = ${posti};`, `const venduti = ${venduti};`, 'const liberi = posti - venduti;', `if (venduti ${op} posti) {`, '    console.log("Esaurito");', '} else {', '    console.log("Liberi:", liberi);', '}');
	const holds = op === '>=' ? venduti >= posti : venduti > posti;
	const full = ['Esaurito'];
	const free = [`Liberi: ${posti - venduti}`];
	return {
		prompt: 'Decidi prima se la condizione è vera o falsa.',
		problem: 'Che cosa scrive questo script nella console?',
		listing: script,
		solution: (holds ? full : free)[0],
		steps: [
			`venduti vale ${venduti} e posti ${posti}: la condizione venduti ${op} posti è ${holds ? 'vera' : 'falsa'}${venduti === posti ? (op === '>=' ? ', perché >= comprende anche il caso in cui i due numeri sono uguali' : ', perché > non comprende il caso in cui i due numeri sono uguali') : ''}.`,
			holds ? 'Viene eseguito solo il primo blocco: il blocco dopo else viene saltato.' : 'Il primo blocco viene saltato e viene eseguito solo quello dopo else.'
		],
		answer: choose(rng, printedOption(holds ? full : free), printedAll([holds ? free : full, [...full, ...free], []])),
		params: { case: 'se', form: 'esaurito', script }
	};
}

const QUIZ = [
	{ a: 'risposta', b: 'giusta', yes: 'Giusto', no: 'Sbagliato' },
	{ a: 'scritto', b: 'codice', yes: 'Entra', no: 'Codice sbagliato' },
	{ a: 'scelta', b: 'fila', yes: 'Posto trovato', no: 'Fila diversa' }
] as const;

function equal(rng: Rng): CodeBuilt {
	const names = rng.pick(QUIZ);
	// the kinds of the two values (t text, n number, N text through Number) and whether the digits are the same
	const scene = weighted(rng, { 'tn=': 4, 'Nn=': 3, 'nt=': 1, 'tt=': 1, 'nn=': 1, 'tt!': 1, 'nn!': 1, 'Nn!': 1 });
	const n = rng.int(2, 9);
	const same = scene[2] === '=';
	const m = same ? n : n + rng.pick(n > 5 ? [-1, -2] : [1, 2]);
	const op = rng.pick(['===', '!=='] as const);
	const value = (kind: string, x: number) => (kind === 'n' ? String(x) : `"${x}"`);
	const left = scene[0] === 'N' ? `Number(${names.a})` : names.a;
	const [first, second] = op === '===' ? [names.yes, names.no] : [names.no, names.yes];
	const script = rows(`const ${names.a} = ${value(scene[0], n)};`, `const ${names.b} = ${value(scene[1], m)};`, `if (${left} ${op} ${names.b}) {`, `    console.log("${first}");`, '} else {', `    console.log("${second}");`, '}');
	const kinds = (scene[0] === 't' ? 't' : 'n') + scene[1];
	const identical = same && kinds[0] === kinds[1];
	const said = (kind: string, x: number) => (kind === 't' ? `il testo "${x}"` : `il numero ${x}`);
	const right = identical ? names.yes : names.no;
	return {
		prompt: 'Guarda il tipo dei due valori, poi il loro contenuto.',
		problem: 'Che cosa scrive questo script nella console?',
		listing: script,
		solution: right,
		steps: [
			`${left} è ${said(kinds[0], n)}, ${names.b} è ${said(kinds[1], m)}.`,
			kinds[0] !== kinds[1] ? 'Un testo e un numero hanno tipi diversi: per === non sono mai uguali, anche se le cifre sono le stesse.' : identical ? 'Hanno lo stesso tipo e lo stesso valore: per === sono uguali.' : 'Hanno lo stesso tipo ma valori diversi: per === non sono uguali.',
			`La condizione ${left} ${op} ${names.b} è quindi ${(op === '===') === identical ? 'vera' : 'falsa'}: viene eseguito ${(op === '===') === identical ? 'il primo blocco' : 'il blocco dopo else'}.`
		],
		answer: choose(rng, printedOption([right]), [printedOption([identical ? names.no : names.yes]), printedOption([first, second]), STOPS]),
		params: { case: 'uguale', scene, op, script }
	};
}

function logic(rng: Rng): CodeBuilt {
	const truth = rng.pick(['tt', 'tf', 'ft', 'ff'] as const);
	const op = rng.pick(['&&', '||'] as const);
	const soglia = rng.int(4, 5);
	const eta = truth[0] === 't' ? rng.int(10, 13) : rng.int(14, 18);
	const biglietti = truth[1] === 't' ? rng.int(soglia, soglia + 2) : rng.int(2, soglia - 1);
	const intero = rng.int(7, 9);
	const ridotto = rng.int(4, 6);
	const script = rows(`const eta = ${eta};`, `const biglietti = ${biglietti};`, `let prezzo = ${intero};`, `if (eta < 14 ${op} biglietti >= ${soglia}) {`, `    prezzo = ${ridotto};`, '}', 'console.log("Euro:", prezzo * biglietti);');
	const holds = op === '&&' ? truth === 'tt' : truth !== 'ff';
	const prezzo = holds ? ridotto : intero;
	const row = (n: number) => [`Euro: ${n}`];
	const word = (t: string) => (t === 't' ? 'vera' : 'falsa');
	return {
		prompt: 'Decidi le due condizioni una alla volta, poi mettile insieme.',
		problem: 'Che cosa scrive questo script nella console?',
		listing: script,
		solution: `Euro: ${prezzo * biglietti}`,
		steps: [
			`eta < 14 è ${word(truth[0])}, perché eta vale ${eta}; biglietti >= ${soglia} è ${word(truth[1])}, perché biglietti vale ${biglietti}.`,
			op === '&&' ? `Con && la condizione intera è vera solo quando lo sono tutte e due le parti: qui è ${holds ? 'vera' : 'falsa'}.` : `Con || la condizione intera è vera quando lo è almeno una delle due parti: qui è ${holds ? 'vera' : 'falsa'}.`,
			`Quindi prezzo vale ${prezzo}, e il totale è ${prezzo} * ${biglietti} = ${prezzo * biglietti}.`
		],
		answer: pick(rng, printedOption(row(prezzo * biglietti)), printedAll([row((holds ? intero : ridotto) * biglietti), row(prezzo), row((intero + ridotto) * biglietti), row(biglietti), row(intero * biglietti - ridotto)])),
		params: { case: 'logici', truth, op, script }
	};
}

const level3 = (rng: Rng, kind: 'se' | 'uguale' | 'logici') => (kind === 'se' ? branch(rng) : kind === 'uguale' ? equal(rng) : logic(rng));

// ------------------------------------------------------------------ level 4

const range = (from: number, to: number, step = 1) => {
	const out: number[] = [];
	for (let i = from; i <= to; i += step) out.push(i);
	return out;
};

function forLoop(rng: Rng): CodeBuilt {
	if (rng.int(0, 1) === 0) {
		const from = rng.int(1, 3);
		const to = from + rng.int(2, 5);
		const cmp = rng.pick(['<=', '<'] as const);
		const step = rng.pick([1, 1, 1, 2]);
		const script = rows('let somma = 0;', `for (let i = ${from}; i ${cmp} ${to}; ${step === 1 ? 'i++' : `i = i + ${step}`}) {`, '    somma = somma + i;', '}', 'console.log(somma);');
		const turns = range(from, cmp === '<=' ? to : to - 1, step);
		const other = range(from, cmp === '<=' ? to - 1 : to, step);
		const total = (xs: number[]) => xs.reduce((s, x) => s + x, 0);
		const right = total(turns);
		return {
			prompt: 'Scrivi i valori che prende i, uno per giro.',
			problem: 'Che cosa scrive questo script nella console?',
			listing: script,
			solution: String(right),
			steps: [
				`i parte da ${from}${step === 1 ? ' e cresce di 1 a ogni giro' : ` e cresce di ${step} a ogni giro`}; il ciclo continua finché i ${cmp} ${to}: i prende i valori ${turns.join(', ')}.`,
				`somma parte da 0 e a ogni giro cresce di i: ${turns.join(' + ')} = ${right}.`,
				'console.log sta dopo la graffa che chiude il ciclo: viene eseguita una volta sola, alla fine.'
			],
			answer: pick(rng, printedOption([String(right)]), printedAll([[String(total(other))], [String(turns.length)], [String(to)], [String(right + to + 1)], turns.map(String), [String(right - from)]])),
			params: { case: 'for', form: 'somma', script }
		};
	}
	const start = rng.int(0, 1);
	const cmp = rng.pick(['<=', '<'] as const);
	const count = rng.int(2, 4);
	const to = start + count - (cmp === '<=' ? 1 : 0);
	const k = rng.pick([8, 10, 12, 15]);
	const script = rows(`for (let i = ${start}; i ${cmp} ${to}; i++) {`, `    console.log(i, "file:", ${k} * i);`, '}');
	const line = (i: number) => `${i} file: ${k * i}`;
	const turns = range(start, start + count - 1);
	const right = turns.map(line);
	return {
		prompt: 'Scrivi i valori che prende i, uno per giro.',
		problem: 'Che cosa scrive questo script nella console?',
		listing: script,
		solution: right.join(', '),
		steps: [`i parte da ${start} e il ciclo continua finché i ${cmp} ${to}: i prende i valori ${turns.join(', ')}.`, `A ogni giro console.log scrive una riga con i, il testo "file:" e il risultato di ${k} * i, separati da uno spazio.`],
		answer: pick(rng, printedOption(right), printedAll([range(start, cmp === '<=' ? to - 1 : to).map(line), range(start + 1, start + count).map(line), range(1 - start, start + count - 1).map(line), [line(turns[turns.length - 1])], turns.map((i) => `${i} file: ${k}`)])),
		params: { case: 'for', form: 'righe', script }
	};
}

function whileLoop(rng: Rng): CodeBuilt {
	if (rng.int(0, 1) === 0) {
		const k = rng.pick([10, 12, 15]);
		const exact = rng.int(0, 2) === 0;
		const spettatori = exact ? k * rng.int(2, 5) : k * rng.int(1, 4) + rng.int(1, k - 1);
		const script = rows('let file = 0;', `while (file * ${k} < ${spettatori}) {`, '    file = file + 1;', '}', 'console.log(file);');
		const right = Math.ceil(spettatori / k);
		return {
			prompt: 'Controlla la condizione prima di ogni giro.',
			problem: 'Che cosa scrive questo script nella console?',
			listing: script,
			solution: String(right),
			steps: [
				`A ogni giro file cresce di 1, e prima di ogni giro si controlla se file * ${k} è ancora minore di ${spettatori}.`,
				`Con file = ${right - 1} il prodotto è ${(right - 1) * k}, minore di ${spettatori}: il ciclo fa un altro giro. Con file = ${right} il prodotto è ${right * k}, che non è minore di ${spettatori}: il ciclo finisce.`
			],
			answer: pick(rng, printedOption([String(right)]), printedAll([[String(right - 1)], [String(right + 1)], [String(spettatori)], [String(right * k)], [String(k)]])),
			params: { case: 'while', form: 'file', script }
		};
	}
	const soldi = rng.int(1, 4) * 5;
	const paga = rng.pick([5, 8, 10]);
	const meta = soldi + paga * rng.int(2, 4) + rng.pick([0, 0, -2, -3]);
	const script = rows(`let soldi = ${soldi};`, 'let settimane = 0;', `while (soldi < ${meta}) {`, `    soldi = soldi + ${paga};`, '    settimane = settimane + 1;', '}', 'console.log(settimane, soldi);');
	const weeks = Math.ceil((meta - soldi) / paga);
	const end = soldi + weeks * paga;
	return {
		prompt: 'Controlla la condizione prima di ogni giro.',
		problem: 'Che cosa scrive questo script nella console?',
		listing: script,
		solution: `${weeks} ${end}`,
		steps: [
			`A ogni giro soldi cresce di ${paga} e settimane di 1: soldi vale ${range(0, weeks)
				.map((w) => soldi + w * paga)
				.join(', ')}.`,
			`Quando soldi arriva a ${end} la condizione soldi < ${meta} è falsa e il ciclo finisce, dopo ${weeks} giri.`,
			'console.log scrive i due valori separati da uno spazio.'
		],
		answer: pick(rng, printedOption([`${weeks} ${end}`]), printedAll([[`${weeks - 1} ${end - paga}`], [`${weeks + 1} ${end + paga}`], [`${weeks} ${meta}`], [`${weeks}${end}`], [`${weeks} ${end - paga}`]])),
		params: { case: 'while', form: 'risparmi', script }
	};
}

function functions(rng: Rng): CodeBuilt {
	const form = rng.pick(['costo', 'listino', 'eta'] as const);
	if (form === 'costo') {
		const p = rng.int(6, 9);
		const q = rng.int(3, 5);
		const a = rng.int(1, 4);
		const b = a + rng.pick(a > 2 ? [-1, -2] : [1, 2]);
		const script = rows('function costo(interi, ridotti) {', `    return ${p} * interi + ${q} * ridotti;`, '}', `console.log(costo(${a}, ${b}));`);
		const right = p * a + q * b;
		return {
			prompt: 'Metti gli argomenti al posto dei parametri, nello stesso ordine.',
			problem: 'Che cosa scrive questo script nella console?',
			listing: script,
			solution: String(right),
			steps: [`La chiamata costo(${a}, ${b}) passa ${a} al parametro interi e ${b} al parametro ridotti, nell'ordine in cui sono scritti.`, `La funzione restituisce ${p} * ${a} + ${q} * ${b} = ${right}, ed è quello che console.log scrive.`],
			answer: pick(rng, printedOption([String(right)]), printedAll([[String(p * b + q * a)], [String((p + q) * (a + b))], [String(p * a)], [String(a + b)], [String(p + q)]])),
			params: { case: 'funzione', form, script }
		};
	}
	if (form === 'listino') {
		const p = rng.int(5, 9);
		const soglia = rng.int(3, 4);
		const sconto = rng.int(2, 4);
		const script = rows('function costo(n) {', `    if (n >= ${soglia}) {`, `        return ${p} * n - ${sconto};`, '    }', `    return ${p} * n;`, '}', 'for (let i = 2; i <= 4; i++) {', '    console.log(i, "posti:", costo(i));', '}');
		const lines = (cost: (n: number) => number) => [2, 3, 4].map((i) => `${i} posti: ${cost(i)}`);
		const right = lines((n) => (n >= soglia ? p * n - sconto : p * n));
		return {
			prompt: 'Per ogni giro del ciclo, segui la chiamata dentro la funzione.',
			problem: 'Che cosa scrive questo script nella console?',
			listing: script,
			solution: right.join(', '),
			steps: [
				'Il ciclo chiama costo(2), costo(3) e costo(4), e per ognuna scrive una riga.',
				`Dentro la funzione, quando n >= ${soglia} viene eseguito il primo return, che toglie ${sconto}, e la funzione finisce lì; altrimenti si arriva al secondo return.`,
				`Le tre chiamate restituiscono ${[2, 3, 4].map((n) => (n >= soglia ? p * n - sconto : p * n)).join(', ')}.`
			],
			answer: pick(rng, printedOption(right), printedAll([lines((n) => p * n), lines((n) => p * n - sconto), lines((n) => (n > soglia ? p * n - sconto : p * n)), lines((n) => (n >= soglia ? p * n : p * n - sconto)), [right[2]]])),
			params: { case: 'funzione', form, script }
		};
	}
	const ridotto = rng.int(4, 6);
	const intero = rng.int(7, 9);
	const a = rng.pick([rng.int(9, 13), rng.int(14, 17)]);
	const b = rng.pick([rng.int(10, 13), rng.int(14, 40)]);
	const script = rows('function prezzo(eta) {', '    if (eta < 14) {', `        return ${ridotto};`, '    }', `    return ${intero};`, '}', `console.log(prezzo(${a}) + prezzo(${b}));`);
	const price = (eta: number) => (eta < 14 ? ridotto : intero);
	const right = price(a) + price(b);
	return {
		prompt: 'Calcola le due chiamate una alla volta.',
		problem: 'Che cosa scrive questo script nella console?',
		listing: script,
		solution: String(right),
		steps: [
			`prezzo(${a}): ${a} < 14 è ${a < 14 ? 'vera' : 'falsa'}, quindi la funzione restituisce ${price(a)}.`,
			`prezzo(${b}): ${b} < 14 è ${b < 14 ? 'vera' : 'falsa'}, quindi la funzione restituisce ${price(b)}.`,
			`I due valori di ritorno sono numeri, e + li somma: ${price(a)} + ${price(b)} = ${right}.`
		],
		answer: pick(rng, printedOption([String(right)]), printedAll([[`${price(a)}${price(b)}`], [String(2 * ridotto)], [String(2 * intero)], [String(ridotto + intero)], [String(a + b)], [`${price(a)} ${price(b)}`]])),
		params: { case: 'funzione', form, script }
	};
}

const level4 = (rng: Rng, kind: 'for' | 'while' | 'funzione') => (kind === 'for' ? forLoop(rng) : kind === 'while' ? whileLoop(rng) : functions(rng));

// ------------------------------------------------------------------ level 5

/** A fragment of Python, the JavaScript that does the same, and the same JavaScript with one mistake each. */
interface Translation {
	python: string;
	right: string;
	wrong: { kind: string; text: string }[];
	/** What the right fragment has that a translation word for word has not. */
	notes: string[];
	/** The right fragment in one row, for the solution. */
	gist: string;
}

const NOTE = {
	log: 'print diventa console.log.',
	declare: 'Ogni variabile si dichiara, la prima volta, con let, oppure con const se non cambia più; il tipo non si scrive.',
	braces: 'La condizione va tra parentesi tonde e il blocco tra graffe: i due punti e il rientro di Python non contano.',
	logic: 'and e or si scrivono && e ||, e il confronto si scrive === oppure !==.',
	loop: 'Il for ha tre parti tra parentesi tonde: let i = ... per cominciare, la condizione per continuare, i++ per andare avanti.',
	fn: 'Una funzione si definisce con la parola function, senza tipi, e restituisce il risultato con return.'
};

function writing(rng: Rng): Translation {
	const t = rng.pick([
		{ a: 'prezzo', b: 'totale', label: 'Totale:', first: () => rng.int(5, 9), expr: (k: number) => `prezzo * ${k}`, k: () => rng.int(2, 6) },
		{ a: 'posti', b: 'liberi', label: 'Liberi:', first: () => rng.int(10, 15) * 10, expr: (k: number) => `posti - ${k}`, k: () => rng.int(60, 90) }
	] as const);
	const first = t.first();
	const k = t.k();
	const c = rng.int(2, 9);
	const js = (decl1: string, decl2: string, again: string, write: string) => rows(`${decl1} ${t.a} = ${first};`, `${decl2} ${t.b} = ${t.expr(k)};`, `${again}${t.b} = ${t.b} - ${c};`, write);
	const write = `console.log("${t.label}", ${t.b});`;
	return {
		python: rows(`${t.a} = ${first}`, `${t.b} = ${t.expr(k)}`, `${t.b} = ${t.b} - ${c}`, `print("${t.label}", ${t.b})`),
		right: js('const', 'let', '', write),
		wrong: [
			{ kind: 'print', text: js('const', 'let', '', `print("${t.label}", ${t.b});`) },
			{ kind: 'tipi', text: js('int', 'int', '', write) },
			{ kind: 'const', text: js('const', 'const', '', write) },
			{ kind: 'let-due-volte', text: js('const', 'let', 'let ', write) },
			{ kind: 'piu', text: js('const', 'let', '', `console.log("${t.label}" + ${t.b});`) }
		],
		notes: [NOTE.declare, `${t.b} cambia dopo la dichiarazione, quindi vuole let; l'assegnamento che segue non ripete let.`, `${NOTE.log} Gli argomenti restano separati dalla virgola, così tra l'uno e l'altro esce uno spazio.`],
		gist: `Il frammento con const per ${t.a}, let per ${t.b} e console.log con la virgola.`
	};
}

function selecting(rng: Rng): Translation {
	const words = rng.pick([
		['sconto', 'intero'],
		['aperto', 'chiuso'],
		['entra', 'aspetta']
	] as const);
	const n = rng.int(3, 12);
	if (rng.int(0, 2) === 0) {
		const low = rng.int(4, 6);
		const high = rng.int(8, 11);
		const body = (open: string, middle: string, other: string, close: string, write = 'console.log', first = `const n = ${n};`) => rows(first, open, `    ${write}("gruppo");`, middle, `    ${write}("${words[0]}");`, other, `    ${write}("${words[1]}");`, close);
		const good = [`if (n >= ${high}) {`, `} else if (n >= ${low}) {`, '} else {', '}'] as const;
		return {
			python: rows(`n = ${n}`, `if n >= ${high}:`, '    print("gruppo")', `elif n >= ${low}:`, `    print("${words[0]}")`, 'else:', `    print("${words[1]}")`),
			right: body(...good),
			wrong: [
				{ kind: 'elif', text: body(good[0], `} elif (n >= ${low}) {`, good[2], good[3]) },
				{ kind: 'elseif', text: body(good[0], `} elseif (n >= ${low}) {`, good[2], good[3]) },
				{ kind: 'due-punti', text: rows(`const n = ${n};`, `if (n >= ${high}):`, '    console.log("gruppo");', `else if (n >= ${low}):`, `    console.log("${words[0]}");`, 'else:', `    console.log("${words[1]}");`) },
				{ kind: 'print', text: body(...good, 'print') },
				{ kind: 'tipi', text: body(...good, 'console.log', `int n = ${n};`) }
			],
			notes: [NOTE.braces, 'elif in JavaScript si scrive con due parole, else if, tra la graffa che chiude un blocco e quella che apre il successivo.', NOTE.log],
			gist: 'Il frammento con le condizioni tra tonde, i blocchi tra graffe, else if e console.log.'
		};
	}
	const word = rng.pick(['and', 'or'] as const);
	const cmp = rng.pick(['!=', '=='] as const);
	const low = rng.int(4, 7);
	const other = rng.int(3, 12);
	const js = (cond: string, write = 'console.log', first = `const n = ${n};`) => rows(first, cond, `    ${write}("${words[0]}");`, '} else {', `    ${write}("${words[1]}");`, '}');
	const both = word === 'and' ? '&&' : '||';
	const good = `if (n >= ${low} ${both} n ${cmp}= ${other}) {`;
	return {
		python: rows(`n = ${n}`, `if n >= ${low} ${word} n ${cmp} ${other}:`, `    print("${words[0]}")`, 'else:', `    print("${words[1]}")`),
		right: js(good),
		wrong: [
			{ kind: 'and-or', text: js(`if (n >= ${low} ${word} n ${cmp}= ${other}) {`) },
			{ kind: 'due-punti', text: rows(`const n = ${n};`, `if (n >= ${low} ${both} n ${cmp}= ${other}):`, `    console.log("${words[0]}");`, 'else:', `    console.log("${words[1]}");`) },
			{ kind: 'senza-tonde', text: js(`if n >= ${low} ${both} n ${cmp}= ${other} {`) },
			{ kind: 'print', text: js(good, 'print') },
			{ kind: 'tipi', text: js(good, 'console.log', `int n = ${n};`) }
		],
		notes: [NOTE.braces, NOTE.logic, NOTE.log],
		gist: `Il frammento con la condizione tra tonde, ${both} al posto di ${word}, i blocchi tra graffe e console.log.`
	};
}

function looping(rng: Rng): Translation {
	if (rng.int(0, 1) === 0) {
		const from = rng.int(1, 3);
		const to = from + rng.int(3, 5);
		const js = (first: string, head: string, close = '}', write = 'console.log(somma);') => rows(first, head, '    somma = somma + i;', close, write).replace(/\n\n/g, '\n');
		const good = `for (let i = ${from}; i < ${to}; i++) {`;
		return {
			python: rows('somma = 0', `for i in range(${from}, ${to}):`, '    somma = somma + i', 'print(somma)'),
			right: js('let somma = 0;', good),
			wrong: [
				{ kind: 'fine-compresa', text: js('let somma = 0;', `for (let i = ${from}; i <= ${to}; i++) {`) },
				{ kind: 'tipi', text: js('let somma = 0;', `for (int i = ${from}; i < ${to}; i++) {`) },
				{ kind: 'range', text: js('let somma = 0;', `for i in range(${from}, ${to}) {`) },
				{ kind: 'const', text: js('const somma = 0;', good) },
				{ kind: 'due-punti', text: rows('let somma = 0;', `for (let i = ${from}; i < ${to}; i++):`, '    somma = somma + i;', 'console.log(somma);') },
				{ kind: 'print', text: js('let somma = 0;', good, '}', 'print(somma);') }
			],
			notes: [`${NOTE.loop} range(${from}, ${to}) si ferma prima di ${to}: la condizione è i < ${to}.`, 'somma cambia a ogni giro, quindi si dichiara con let.', NOTE.log],
			gist: `Il frammento con let somma, il for che comincia da ${from} e continua finché i < ${to}, e console.log.`
		};
	}
	const start = rng.int(4, 6) * 5;
	const step = rng.int(3, 7);
	const limit = rng.int(2, 6);
	const js = (first: string, head: string, close: string | false = '}', write = 'console.log(giri);') => rows(first, 'let giri = 0;', head, `    n = n - ${step};`, '    giri = giri + 1;', close, write);
	const good = `while (n > ${limit}) {`;
	return {
		python: rows(`n = ${start}`, 'giri = 0', `while n > ${limit}:`, `    n = n - ${step}`, '    giri = giri + 1', 'print(giri)'),
		right: js(`let n = ${start};`, good),
		wrong: [
			{ kind: 'senza-tonde', text: js(`let n = ${start};`, `while n > ${limit} {`) },
			{ kind: 'due-punti', text: js(`let n = ${start};`, `while (n > ${limit}):`, false) },
			{ kind: 'const', text: js(`const n = ${start};`, good) },
			{ kind: 'tipi', text: js(`int n = ${start};`, good) },
			{ kind: 'print', text: js(`let n = ${start};`, good, '}', 'print(giri);') }
		],
		notes: ['Il while è come in Python, ma con la condizione tra parentesi tonde e il blocco tra graffe.', 'n e giri cambiano a ogni giro, quindi si dichiarano con let.', NOTE.log],
		gist: 'Il frammento con let per n e per giri, la condizione tra tonde, il blocco tra graffe e console.log.'
	};
}

function defining(rng: Rng): Translation {
	const p = rng.int(6, 9);
	const q = rng.int(3, 5);
	const a = rng.int(1, 4);
	const b = rng.int(1, 4);
	const name = rng.pick(['costo', 'totale', 'incasso'] as const);
	const js = (head: string, body = `    return ${p} * a + ${q} * b;`, close: string | false = '}', write = 'console.log') => rows(head, body, close, `${write}(${name}(${a}, ${b}));`);
	const good = `function ${name}(a, b) {`;
	return {
		python: rows(`def ${name}(a, b):`, `    return ${p} * a + ${q} * b`, '', `print(${name}(${a}, ${b}))`),
		right: js(good),
		wrong: [
			{ kind: 'def', text: js(`def ${name}(a, b) {`) },
			{ kind: 'tipi-parametri', text: js(`function ${name}(int a, int b) {`) },
			{ kind: 'tipi', text: js(`int ${name}(int a, int b) {`) },
			{ kind: 'due-punti', text: js(`function ${name}(a, b):`, undefined, false) },
			{ kind: 'senza-return', text: js(good, `    ${p} * a + ${q} * b;`) },
			{ kind: 'print', text: js(good, undefined, '}', 'print') }
		],
		notes: [NOTE.fn, 'Il corpo sta tra graffe, e senza return la funzione non restituisce niente.', NOTE.log],
		gist: 'Il frammento con function, i parametri senza tipo, return dentro le graffe e console.log.'
	};
}

const TRANSLATIONS = { scrivere: writing, selezione: selecting, ciclo: looping, funzione: defining };

function level5(rng: Rng, kind: keyof typeof TRANSLATIONS): CodeBuilt {
	const t = TRANSLATIONS[kind](rng);
	const wrong = shuffle(rng, t.wrong).slice(0, 3);
	return {
		prompt: 'Confronta ogni frammento con quello in Python, una riga alla volta.',
		problem: 'Questo frammento è scritto in Python. Quale frammento JavaScript fa lo stesso?',
		listing: t.python,
		solution: t.gist,
		steps: t.notes,
		solutionListing: t.right,
		answer: choose(
			rng,
			listingOption(t.right),
			wrong.map((w) => listingOption(w.text))
		),
		params: { case: kind, python: t.python, wrong: wrong.map((w) => w.kind) }
	};
}

export default makeCodeGenerator(ID, 'Gli script nella pagina web', {
	1: { label: 'Dove gira lo script', constraints: ['who runs a script and what it can do, from interchangeable claims', 'a page with its script tag in the head, in the head with defer or at the end of the body'], build: level1, check: fragments },
	2: { label: 'Che cosa scrive la console', constraints: ['const, let and console.log with more arguments', 'a text plus a number', 'a const assigned again'], build: drawn(['conto', 'conto', 'conto', 'conto', 'testo', 'testo', 'testo', 'const', 'const', 'const'] as const, level2), check: fragments },
	3: { label: 'Selezione e confronti', constraints: ['one if, with or without else', '=== between a text and a number', '&& and ||'], build: drawn(['se', 'uguale', 'logici'] as const, level3), check: fragments },
	4: { label: 'Cicli e funzioni', constraints: ['one for, one while or one function with return', 'at most five rows written'], build: drawn(['for', 'while', 'funzione'] as const, level4), check: fragments },
	5: { label: 'Da Python a JavaScript', constraints: ['a fragment of Python under the question', 'four fragments of JavaScript, one right', 'each wrong one has one mistake'], build: drawn(['scrivere', 'selezione', 'ciclo', 'funzione'] as const, level5), check: fragments }
});
