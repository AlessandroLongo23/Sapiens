/**
 * Exercises for "Controllare i dati di un modulo" (informatica, third year). Spec:
 * specs/exercises/inf-validazione-moduli.md
 *
 * 1. what value, trim, length, Number and checked give for what is written in a field; 2. which of four values
 * passes a check (or is stopped by it); 3. which message a function with its checks in order gives; 4. whether the
 * form is sent, by where preventDefault is; 5. which condition does the check that is described.
 *
 * Every level is a multiple choice. What is written in a field is shown in the `value` attribute of its tag, so
 * that the spaces can be seen. The right answer is worked out here; the independent check builds the form, runs the
 * script and fires `submit` on its own.
 */
import type { ChoiceOption, Rng } from '../types';
import { choose, listingOption, makeCodeGenerator, printedOption, shuffle, textOption, type CodeBuilt } from '../inf-codice';
import { drawn, field, fragments, pick, register, rows, select, shown, STOPS, TooFew } from '../inf-g14-web';

export const ID = 'inf-validazione-moduli';

const IN_VALUE = "Nel campo c'è scritto quello che sta tra le virgolette di value, spazi compresi.";
const quote = (text: string) => `"${text}"`;

// ------------------------------------------------------------------ level 1

const WRITTEN = {
	nome: ['Anna', 'Samir', 'Giada', 'Luca', 'Noemi', 'Tommaso', 'Anna Rita', 'Gian Luca', 'Maria Pia'],
	citta: ['Roma', 'Bari', 'Torino', 'La Spezia', 'San Remo', 'Lecce']
} as const;

function lengths(rng: Rng): CodeBuilt {
	const id = rng.pick(['nome', 'citta'] as const);
	const text = rng.pick(WRITTEN[id]);
	const lead = rng.int(0, 3);
	const trail = lead === 0 ? rng.int(1, 2) : rng.int(0, 2);
	const trims = rng.int(0, 2) > 0;
	const value = ' '.repeat(lead) + text + ' '.repeat(trail);
	const html = rows(field(id, value));
	const script = rows(select(id, `#${id}`), `console.log(${id}.value${trims ? '.trim()' : ''}.length);`);
	const right = trims ? text.length : value.length;
	const letters = text.replace(/ /g, '').length;
	const spaces = (n: number, where: string) => (n === 0 ? `nessuno spazio ${where}` : n === 1 ? `uno spazio ${where}` : `${n} spazi ${where}`);
	return {
		prompt: 'Conta i caratteri uno alla volta, spazi compresi.',
		problem: `${IN_VALUE} Che cosa scrive la console?`,
		listing: shown(html, script),
		solution: String(right),
		steps: [
			`value è il testo del campo così com'è: ${spaces(lead, 'davanti')}, ${text} (${text.length} caratteri${text.includes(' ') ? ', contando lo spazio in mezzo' : ''}) e ${spaces(trail, 'dopo')}. In tutto ${value.length} caratteri.`,
			trims ? `trim() toglie gli spazi all'inizio e alla fine, non quelli in mezzo: restano ${text.length} caratteri, ed è quello che length conta.` : `Qui trim() non c'è: length conta tutti i caratteri, spazi compresi, e vale ${value.length}.`
		],
		answer: pick(
			rng,
			printedOption([String(right)]),
			[trims ? value.length : text.length, letters, lead + text.length, text.length + trail, right + 1, right - 1].map((n) => printedOption([String(n)]))
		),
		params: { case: 'lunghezza', html, script }
	};
}

function sums(rng: Rng): CodeBuilt {
	const a = rng.int(1, 9);
	const b = rng.int(1, 9);
	let html: string;
	let script: string;
	let glued: boolean;
	let said: string;
	let written = IN_VALUE;
	if (rng.int(0, 1) === 0) {
		const wraps = rng.int(0, 1) === 1;
		html = rows(field('biglietti', String(a)));
		script = rows(select('biglietti', '#biglietti'), `const n = ${wraps ? 'Number(biglietti.value)' : 'biglietti.value'};`, `console.log(n + ${b});`);
		glued = !wraps;
		said = wraps ? `n è il numero ${a}, perché il testo "${a}" è passato da Number()` : `n è il testo "${a}", e ${b} è un numero`;
	} else {
		// t: the value as it is, a text; N: the value through Number()
		const pattern = rng.pick(['tt', 'tt', 'NN', 'NN', 'Nt', 'tN'] as const);
		const taken = (kind: string, id: string) => (kind === 'N' ? `Number(${id}.value)` : `${id}.value`);
		html = rows(field('interi', String(a)), field('ridotti', String(b)));
		script = rows(select('interi', '#interi'), select('ridotti', '#ridotti'), `const a = ${taken(pattern[0], 'interi')};`, `const b = ${taken(pattern[1], 'ridotti')};`, 'console.log(a + b);');
		glued = pattern !== 'NN';
		const one = (kind: string, name: string, n: number) => (kind === 'N' ? `${name} è il numero ${n}` : `${name} è il testo "${n}"`);
		said = `${one(pattern[0], 'a', a)}, ${one(pattern[1], 'b', b)}`;
		written = "In ogni campo c'è scritto quello che sta tra le virgolette del suo value.";
	}
	const right = glued ? `${a}${b}` : String(a + b);
	return {
		prompt: 'Per ogni valore chiediti se è un testo o un numero.',
		problem: `${written} Che cosa scrive la console?`,
		listing: shown(html, script),
		solution: right,
		steps: [
			`value è sempre un testo, anche quando nel campo ci sono solo cifre; Number(...) lo trasforma in un numero. Qui ${said}.`,
			glued ? `Almeno uno dei due è un testo, quindi + li attacca uno all'altro: viene "${a}${b}".` : `Tutti e due sono numeri, quindi + fa la somma: ${a} + ${b} = ${a + b}.`
		],
		answer: choose(rng, printedOption([right]), [printedOption([glued ? String(a + b) : `${a}${b}`]), printedOption([`${a} + ${b}`]), STOPS]),
		params: { case: 'somma', html, script }
	};
}

const BOXES = ['foto', 'posta', 'socio', 'bis'] as const;

function boxes(rng: Rng): CodeBuilt {
	const [a, b] = shuffle(rng, BOXES);
	const on = [rng.int(0, 1) === 1, rng.int(0, 1) === 1];
	const not = [rng.int(0, 2) === 0, rng.int(0, 2) === 0];
	const html = rows(`<input id="${a}" type="checkbox"${on[0] ? ' checked' : ''}>`, `<input id="${b}" type="checkbox"${on[1] ? ' checked' : ''}>`);
	const script = rows(select(a, `#${a}`), select(b, `#${b}`), `console.log(${not[0] ? '!' : ''}${a}.checked);`, `console.log(${not[1] ? '!' : ''}${b}.checked);`);
	const out = (first: boolean, second: boolean) => printedOption([String(first), String(second)]);
	const right = [on[0] !== not[0], on[1] !== not[1]];
	const say = (id: string, checked: boolean, negated: boolean) =>
		`${id} ${checked ? 'ha checked, quindi è spuntata' : 'non ha checked, quindi non è spuntata'}: ${id}.checked vale ${checked}${negated ? `, e il punto esclamativo lo rovescia in ${!checked}` : ''}`;
	return {
		prompt: 'Guarda quale casella ha checked, poi se davanti c\'è un punto esclamativo.',
		problem: "Nella pagina una casella è spuntata quando il suo tag ha l'attributo checked. Che cosa scrive la console?",
		listing: shown(html, script),
		solution: `${right[0]}, ${right[1]}`,
		steps: [`La proprietà checked di una casella vale true quando è spuntata e false quando non lo è. La casella ${say(a, on[0], not[0])}.`, `La casella ${say(b, on[1], not[1])}.`],
		answer: choose(rng, out(right[0], right[1]), [out(!right[0], !right[1]), out(right[0], !right[1]), out(!right[0], right[1])]),
		params: { case: 'casella', html, script }
	};
}

const level1 = (rng: Rng, kind: 'lunghezza' | 'somma' | 'casella') => (kind === 'lunghezza' ? lengths(rng) : kind === 'somma' ? sums(rng) : boxes(rng));

// ------------------------------------------------------------------ level 2

/** One check on one field: the rows before the if, its condition, and whether it stops a value. */
interface Check {
	id: string;
	label: string;
	before: string[];
	condition: string;
	stops: (value: string) => boolean;
	/** Values to choose the options from; the first ones are the ones a student gets wrong. */
	values: string[];
	steps: string[];
}

const padded = (names: string[]) => names.flatMap((n) => [n, ` ${n} `, `  ${n}`, `${n}  `]);

function check2(rng: Rng, kind: 'vuoto' | 'lunghezza' | 'forma' | 'intervallo'): Check {
	if (kind === 'vuoto') {
		const trims = rng.int(0, 3) > 0;
		return {
			id: 'nome',
			label: 'Nome',
			before: [`const testo = nome.value${trims ? '.trim()' : ''};`],
			condition: 'testo === ""',
			stops: (v) => (trims ? v.trim() : v) === '',
			values: shuffle(rng, ['', ' ', '   ', '  ', 'Ada', ' Ada ', 'A', '  Leo']),
			steps: trims
				? ["trim() toglie gli spazi all'inizio e alla fine: di un valore fatto di soli spazi non resta niente.", 'La condizione testo === "" è vera per il campo vuoto e per i soli spazi, e allora preventDefault ferma l\'invio. Con una lettera almeno, il modulo parte.']
				: ['Qui il valore non passa da trim(): gli spazi restano nel testo.', 'La condizione testo === "" è vera solo per il campo davvero vuoto. Un valore di soli spazi non è il testo vuoto, e il modulo parte lo stesso.']
		};
	}
	if (kind === 'lunghezza') {
		const trims = rng.int(0, 3) > 0;
		const short = rng.int(0, 2) > 0;
		const bound = short ? rng.int(2, 4) : rng.int(5, 7);
		const names = short ? ['A', 'Al', 'Ada', 'Anna', 'Giada'] : ['Anna', 'Giada', 'Samira', 'Tommaso', 'Giovanna', 'Margherita'];
		return {
			id: 'nome',
			label: 'Nome',
			before: [`const testo = nome.value${trims ? '.trim()' : ''};`],
			condition: `testo.length ${short ? '<' : '>'} ${bound}`,
			stops: (v) => {
				const n = (trims ? v.trim() : v).length;
				return short ? n < bound : n > bound;
			},
			// first the values whose spaces change the verdict, then the ones on the boundary
			values: shuffle(rng, padded(names)).sort((x, y) => Number(y !== y.trim() && Math.abs(y.trim().length - bound) <= 1) - Number(x !== x.trim() && Math.abs(x.trim().length - bound) <= 1)),
			steps: [
				trims ? "trim() toglie gli spazi all'inizio e alla fine: i caratteri da contare sono quelli che restano." : 'Qui il valore non passa da trim(): anche gli spazi intorno contano come caratteri.',
				`La condizione testo.length ${short ? '<' : '>'} ${bound} è vera, e ferma l'invio, quando i caratteri sono ${short ? `meno di ${bound}` : `più di ${bound}`}: con ${bound} caratteri esatti il modulo parte.`
			]
		};
	}
	if (kind === 'forma') {
		if (rng.int(0, 1) === 0) {
			return {
				id: 'email',
				label: 'Email',
				before: ['const testo = email.value.trim();'],
				condition: '!testo.includes("@")',
				stops: (v) => !v.trim().includes('@'),
				values: shuffle(rng, ['samir@scuola.example', 'giada@scuola.example', 'samir.scuola.example', 'giada(at)scuola', '@', 'noemi@', 'scuola.example', 'luca chiocciola scuola', 'a@b']),
				steps: ['includes("@") dice se nel testo c\'è una chiocciola; il punto esclamativo davanti rovescia la risposta.', "La condizione è vera, e ferma l'invio, quando la chiocciola manca. Dove sta la chiocciola e che cosa ha intorno questo controllo non lo guarda."]
			};
		}
		return {
			id: 'nome',
			label: 'Nome e cognome',
			before: ['const testo = nome.value.trim();'],
			condition: '!testo.includes(" ")',
			stops: (v) => !v.trim().includes(' '),
			values: shuffle(rng, [' Giada ', 'Samir  ', 'Giada Neri', ' Luca Bassi', 'Noemi', 'ElenaRossi', 'Anna_Riva', 'A B', 'Samir De Luca']),
			steps: ["trim() toglie gli spazi all'inizio e alla fine; poi includes(\" \") dice se nel testo che resta c'è ancora uno spazio.", "La condizione è vera, e ferma l'invio, quando lo spazio in mezzo manca: gli spazi intorno non contano, perché trim() li ha già tolti."]
		};
	}
	const low = rng.int(1, 2);
	const high = rng.int(4, 8);
	return {
		id: 'biglietti',
		label: 'Biglietti',
		before: ['const n = Number(biglietti.value);'],
		condition: `n < ${low} || n > ${high}`,
		stops: (v) => Number(v) < low || Number(v) > high,
		values: [...shuffle(rng, [low, high, low - 1, high + 1]), ...shuffle(rng, [low + 1, high - 1, high + 3, high + 10, low + 2])].map(String),
		steps: [`Number(...) trasforma il testo del campo in un numero. La condizione è vera, e ferma l'invio, quando n è minore di ${low} oppure maggiore di ${high}.`, `Gli estremi passano: ${low} non è minore di ${low}, e ${high} non è maggiore di ${high}.`]
	};
}

function level2(rng: Rng, kind: 'vuoto' | 'lunghezza' | 'forma' | 'intervallo'): CodeBuilt {
	const check = check2(rng, kind);
	const stopped = [...new Set(check.values.filter(check.stops))];
	const sent = [...new Set(check.values.filter((v) => !check.stops(v)))];
	// one of a kind and three of the other, in whichever of the two ways the values allow
	const ways = (['passa', 'fermato'] as const).filter((a) => (a === 'passa' ? sent.length >= 1 && stopped.length >= 3 : stopped.length >= 1 && sent.length >= 3));
	if (!ways.length) throw new TooFew('not enough values');
	const ask = rng.pick(ways);
	const [one, three] = ask === 'passa' ? [sent[0], stopped.slice(0, 3)] : [stopped[0], sent.slice(0, 3)];
	const script = rows('function controlla(event) {', ...check.before.map((r) => `    ${r}`), `    if (${check.condition}) {`, '        event.preventDefault();', '    }', '}', '', register('form', '"submit"', 'controlla'));
	return {
		prompt: 'Prova i quattro valori uno alla volta nella condizione.',
		problem: `Nello script form è il modulo e ${check.id} il campo ${check.label}, già presi con querySelector. ${ask === 'passa' ? 'Con quale di questi valori, scritti nel campo, il modulo parte?' : "Con quale di questi valori, scritti nel campo, l'invio viene fermato?"}`,
		listing: script,
		solution: `Con ${quote(one)}${one.trim() === '' ? (one === '' ? ', il campo vuoto' : ', fatto di soli spazi') : ''}.`,
		steps: check.steps,
		answer: choose(
			rng,
			listingOption(quote(one)),
			three.map((v) => listingOption(quote(v)))
		),
		params: { case: kind, ask, field: check.id, script, values: [one, ...three] }
	};
}

// ------------------------------------------------------------------ level 3

interface Ordered {
	id: string;
	fn: string;
	before: string;
	controls: { condition: string; message: string }[];
	/** Values written in the field that stop at each control, and after them the ones that pass all. */
	values: string[][];
	state: (value: string) => string;
	both?: boolean;
}

function ordered(rng: Rng, id: 'nome' | 'email' | 'biglietti'): Ordered {
	if (id === 'nome') {
		const low = rng.int(2, 3);
		const high = rng.int(8, 12);
		return {
			id,
			fn: 'controllaNome',
			before: 'const testo = nome.value.trim();',
			controls: [
				{ condition: 'testo === ""', message: 'Scrivi il tuo nome' },
				{ condition: `testo.length < ${low}`, message: `Almeno ${low} lettere` },
				{ condition: `testo.length > ${high}`, message: `Al massimo ${high} lettere` }
			],
			values: [['', ' ', '   ', '  '], low === 2 ? ['A', ' A ', '  L', 'N  '] : ['Al', ' Al ', 'A', '  Jo', ' L  '], ['Massimiliano', 'Mariangela Pia', 'Giovanni Maria', 'Pierfrancesco', 'Maria Antonietta'].filter((n) => n.length > high), ['Giada', ' Samir', 'Noemi  ', 'Tommaso', '  Luca ']],
			state: (v) => (v.trim() === '' ? 'Dopo trim() del valore non resta niente: testo è vuoto.' : `Dopo trim() testo vale "${v.trim()}", di ${v.trim().length} ${v.trim().length === 1 ? 'carattere' : 'caratteri'}.`)
		};
	}
	if (id === 'email') {
		return {
			id,
			fn: 'controllaEmail',
			before: 'const testo = email.value.trim();',
			controls: [
				{ condition: 'testo === ""', message: 'Scrivi la tua email' },
				{ condition: '!testo.includes("@")', message: 'Manca la chiocciola' }
			],
			values: [['', '   ', ' '], ['samir.scuola.example', 'giada(at)scuola', 'noemi.example', 'luca'], [], ['samir@scuola.example', 'giada@scuola.example', '@', 'noemi@scuola']],
			state: (v) => (v.trim() === '' ? 'Dopo trim() del valore non resta niente: testo è vuoto.' : `Dopo trim() testo vale "${v.trim()}", che ${v.includes('@') ? 'contiene' : 'non contiene'} la chiocciola.`),
			both: true
		};
	}
	const high = rng.int(4, 6);
	return {
		id,
		fn: 'controllaBiglietti',
		before: 'const n = Number(biglietti.value);',
		controls: [
			{ condition: 'biglietti.value === ""', message: 'Scrivi quanti biglietti' },
			{ condition: '!Number.isInteger(n)', message: 'Scrivi un numero intero' },
			{ condition: `n < 1 || n > ${high}`, message: `Da 1 a ${high} biglietti` }
		],
		values: [[''], ['2.5', '1.5', '3.5', 'due', 'tre'], ['0', String(high + 1), String(high + 3), '-1', '40'], ['1', String(high), '2', '3']],
		state: (v) => (v === '' ? 'Il campo è vuoto: value è il testo vuoto.' : Number.isNaN(Number(v)) ? `"${v}" non è scritto in cifre: Number non riesce a farne un numero, e n non è un intero.` : `value non è vuoto, e n vale ${Number(v)}.`)
	};
}

const ORDINALS = ['primo', 'secondo', 'terzo'] as const;
type Stop = (typeof ORDINALS)[number] | 'nessuno';

function level3(rng: Rng, kind: Stop): CodeBuilt {
	const at = kind === 'nessuno' ? 3 : ORDINALS.indexOf(kind);
	const o = ordered(rng, rng.pick(kind === 'terzo' ? (['nome', 'biglietti'] as const) : (['nome', 'email', 'biglietti'] as const)));
	const value = rng.pick(o.values[at]);
	const html = rows(field(o.id, value));
	const script = rows(`function ${o.fn}() {`, `    ${o.before}`, ...o.controls.flatMap((c) => [`    if (${c.condition}) {`, `        return "${c.message}";`, '    }']), '    return "";', '}', `errore.textContent = ${o.fn}();`);
	const none = textOption('Niente: il messaggio resta vuoto', '');
	const messages = o.controls.map((c) => textOption(c.message));
	const options: ChoiceOption[] = [...messages, none, ...(o.both ? [textOption("Tutti e due i messaggi, uno dopo l'altro", 'tutti')] : [])];
	const right = at < 3 ? messages[at] : none;
	return {
		prompt: 'Fai i controlli in ordine, e fermati al primo return che viene eseguito.',
		problem: `Nello script ${o.id} è il campo che vedi ed errore è l'elemento accanto, dove compare il messaggio. ${IN_VALUE} Che cosa compare nell'elemento errore?`,
		listing: shown(html, script),
		solution: at < 3 ? o.controls[at].message : 'Niente: nessun controllo ferma il valore.',
		steps: [
			'I controlli si fanno in ordine, e il primo return che viene eseguito chiude la funzione: i controlli che vengono dopo non sono nemmeno guardati.',
			o.state(value),
			at < 3 ? `${at === 0 ? 'La condizione del primo controllo è vera' : `Il ${ORDINALS[at]} controllo è il primo che ha la condizione vera`}: la funzione restituisce "${o.controls[at].message}", ed è quello che compare.` : "Nessuna condizione è vera: la funzione arriva all'ultimo return e restituisce il testo vuoto, quindi non compare niente."
		],
		answer: choose(
			rng,
			right,
			options.filter((x) => x !== right)
		),
		params: { case: kind, field: o.id, html, script }
	};
}

// ------------------------------------------------------------------ level 4

type Sent = 'parte' | 'fermato' | 'lo-stesso' | 'mai';
type Place = 'giusto' | 'manca' | 'sempre';

interface Control {
	name: string;
	id: string;
	before?: string;
	condition: string;
	message: string;
	valid: string[];
	invalid: string[];
}

function control(rng: Rng): Control {
	const name = rng.pick(['vuoto', 'corto', 'email', 'biglietti'] as const);
	if (name === 'vuoto') return { name, id: 'nome', condition: 'nome.value.trim() === ""', message: 'Scrivi il tuo nome', valid: ['Giada', ' Samir ', 'Noemi', 'Luca', '  Elena'], invalid: ['', '   ', ' ', '  '] };
	if (name === 'corto') {
		const low = rng.int(2, 3);
		return { name, id: 'nome', condition: `nome.value.trim().length < ${low}`, message: `Almeno ${low} lettere`, valid: ['Giada', ' Samir ', 'Noemi', 'Luca', low === 2 ? 'Al' : 'Ada'], invalid: low === 2 ? ['A', ' A ', 'L  ', ''] : ['Al', ' Al ', 'A', '  Jo'] };
	}
	if (name === 'email') return { name, id: 'email', condition: '!email.value.includes("@")', message: 'Manca la chiocciola', valid: ['samir@scuola.example', 'giada@scuola.example', 'noemi@scuola.example'], invalid: ['samir.scuola.example', 'giada(at)scuola', 'noemi', ''] };
	const high = rng.int(4, 6);
	return { name, id: 'biglietti', before: 'const n = Number(biglietti.value);', condition: `n < 1 || n > ${high}`, message: `Da 1 a ${high} biglietti`, valid: ['1', String(high), '2', '3'], invalid: ['0', String(high + 1), String(high + 3), '12'] };
}

const SENT: Record<Sent, ChoiceOption> = {
	parte: textOption('Il modulo parte, senza nessun messaggio.', 'parte'),
	fermato: textOption('Compare il messaggio e il modulo non parte.', 'fermato'),
	'lo-stesso': textOption('Compare il messaggio, ma il modulo parte lo stesso.', 'lo-stesso'),
	mai: textOption('Non compare nessun messaggio, ma il modulo non parte.', 'mai')
};

function level4(rng: Rng, kind: Sent): CodeBuilt {
	const c = control(rng);
	const ok = kind === 'parte' || kind === 'mai';
	const place: Place = kind === 'parte' ? rng.pick(['giusto', 'manca'] as const) : kind === 'fermato' ? rng.pick(['giusto', 'sempre'] as const) : kind === 'mai' ? 'sempre' : 'manca';
	const value = rng.pick(ok ? c.valid : c.invalid);
	const html = rows(field(c.id, value));
	const script = rows(
		'function controlla(event) {',
		c.before && `    ${c.before}`,
		'    let messaggio = "";',
		`    if (${c.condition}) {`,
		`        messaggio = "${c.message}";`,
		place === 'giusto' && '        event.preventDefault();',
		'    }',
		place === 'sempre' && '    event.preventDefault();',
		'    errore.textContent = messaggio;',
		'}',
		'',
		register('form', '"submit"', 'controlla')
	);
	const where: Record<Place, string> = {
		giusto: `event.preventDefault() sta dentro le graffe dell'if: viene eseguita solo quando la condizione è vera, cioè quando il dato è sbagliato. Qui ${ok ? 'non viene eseguita, e il modulo parte' : "viene eseguita, e ferma l'invio"}.`,
		manca: `Nella funzione non c'è nessuna event.preventDefault(): niente chiede al browser di fermarsi, e dopo l'evento submit il modulo parte in ogni caso${ok ? '' : ', anche con il messaggio a schermo'}.`,
		sempre: `event.preventDefault() sta fuori dalle graffe dell'if: viene eseguita a ogni invio, qualunque sia il dato${ok ? ', e ferma anche un modulo compilato bene' : ''}.`
	};
	return {
		prompt: 'Guarda prima se la condizione è vera, poi dove sta preventDefault.',
		problem: `Nello script form è il modulo, ${c.id} il campo che vedi ed errore l'elemento accanto. ${IN_VALUE} Premi Iscriviti: che cosa succede?`,
		listing: shown(html, script),
		solution: SENT[kind].latex,
		steps: [
			ok ? `Con ${quote(value)} la condizione ${c.condition} è falsa: messaggio resta il testo vuoto, e nell'elemento errore non compare niente.` : `Con ${quote(value)} la condizione ${c.condition} è vera: messaggio riceve "${c.message}", che l'ultima riga della funzione scrive nell'elemento errore.`,
			where[place]
		],
		answer: choose(
			rng,
			SENT[kind],
			(Object.keys(SENT) as Sent[]).filter((k) => k !== kind).map((k) => SENT[k])
		),
		params: { case: kind, control: c.name, place, field: c.id, html, script }
	};
}

// ------------------------------------------------------------------ level 5

interface Wanted {
	fields: string[];
	before?: string;
	asks: string;
	right: string;
	wrong: { kind: string; text: string }[];
	steps: string[];
	extra: Record<string, unknown>;
}

const two = (first: string, second: string) => `${first}\n    ${second}`;

function wanted(rng: Rng, kind: 'uguali' | 'vuoto' | 'intervallo' | 'somma'): Wanted {
	if (kind === 'uguali') {
		const [a, b] = rng.pick([
			['email', 'conferma'],
			['password', 'ripeti'],
			['codice', 'copia']
		] as const);
		const trims = rng.int(0, 1) === 1;
		const plain = `${b}.value !== ${a}.value`;
		const nodes = { kind: 'nodi', text: `${b} !== ${a}` };
		const assigns = { kind: 'assegna', text: `${b}.value = ${a}.value` };
		const warning = `${b} e ${a} sono due nodi del DOM, sempre diversi tra loro: vanno confrontati i testi che contengono, ${b}.value e ${a}.value.`;
		if (trims) {
			return {
				fields: [a, b],
				asks: `${a} e ${b} sono due campi del modulo. L'invio va fermato quando i due testi, tolti gli spazi all'inizio e alla fine, non sono uguali.`,
				right: two(`${b}.value.trim() !==`, `${a}.value.trim()`),
				wrong: [{ kind: 'senza-trim', text: plain }, nodes, { kind: 'rovescio', text: two(`${b}.value.trim() ===`, `${a}.value.trim()`) }, { kind: 'trim-sui-nodi', text: `${b}.trim() !== ${a}.trim()` }, assigns],
				steps: [warning, 'trim() si chiama sul testo, cioè dopo value, e su tutti e due i campi: senza, uno spazio in fondo farebbe sembrare diversi due testi uguali.', '"Non sono uguali" si scrive !==. Un solo = è un assegnamento, non un confronto.'],
				extra: { trims }
			};
		}
		return {
			fields: [a, b],
			asks: `${a} e ${b} sono due campi del modulo. L'invio va fermato quando nei due campi non c'è scritto lo stesso testo.`,
			right: plain,
			wrong: [nodes, { kind: 'rovescio', text: `${b}.value === ${a}.value` }, assigns, { kind: 'nome-tra-virgolette', text: `${b}.value !== "${a}"` }, { kind: 'length-sui-nodi', text: `${b}.length !== ${a}.length` }],
			steps: [warning, '"Non è lo stesso testo" si scrive !==. Con === la condizione sarebbe vera proprio quando i due testi sono uguali, e un solo = è un assegnamento.'],
			extra: { trims }
		};
	}
	if (kind === 'vuoto') {
		const f = rng.pick(['nome', 'cognome', 'citta', 'gruppo'] as const);
		return {
			fields: [f],
			asks: `${f} è un campo del modulo. L'invio va fermato quando nel campo non c'è scritto niente, oppure ci sono solo spazi.`,
			right: `${f}.value.trim() === ""`,
			wrong: [
				{ kind: 'senza-trim', text: `${f}.value === ""` },
				{ kind: 'nodo', text: `${f} === ""` },
				{ kind: 'rovescio', text: `${f}.value.trim() !== ""` },
				{ kind: 'trim-sul-nodo', text: `${f}.trim() === ""` },
				{ kind: 'assegna', text: `${f}.value.trim() = ""` },
				{ kind: 'length', text: `${f}.value.length === ""` }
			],
			steps: [`Quello che c'è scritto nel campo è ${f}.value: ${f} da solo è il nodo, e un nodo non è mai uguale a un testo.`, 'trim() toglie gli spazi intorno, così anche un valore di soli spazi diventa il testo vuoto; senza trim() quei valori passerebbero.', 'Il confronto con il testo vuoto si scrive === "".'],
			extra: {}
		};
	}
	if (kind === 'intervallo') {
		const low = rng.int(1, 3);
		const high = low + rng.int(2, 6);
		return {
			fields: ['biglietti'],
			before: 'const n = Number(biglietti.value);',
			asks: `n è il numero scritto nel campo dei biglietti. L'invio va fermato quando n non è tra ${low} e ${high}, estremi compresi.`,
			right: `n < ${low} || n > ${high}`,
			wrong: [
				{ kind: 'e', text: `n < ${low} && n > ${high}` },
				{ kind: 'dentro', text: `n >= ${low} && n <= ${high}` },
				{ kind: 'versi-scambiati', text: `n > ${low} || n < ${high}` },
				{ kind: 'estremi', text: `n <= ${low} || n >= ${high}` },
				{ kind: 'solo-sotto', text: `n < ${low}` },
				{ kind: 'solo-estremi', text: `n === ${low} || n === ${high}` }
			],
			steps: [
				`Il numero è sbagliato quando è troppo piccolo oppure troppo grande: minore di ${low}, o maggiore di ${high}. Tra le due parti ci vuole ||.`,
				`Con && la condizione chiederebbe un numero minore di ${low} e insieme maggiore di ${high}, che non esiste: non fermerebbe mai niente.`,
				`Gli estremi sono giusti, quindi si usano < e >, non <= e >=.`
			],
			extra: { low, high }
		};
	}
	const max = rng.int(4, 8);
	const sum = (cmp: string) => two('Number(interi.value) +', `Number(ridotti.value) ${cmp} ${max}`);
	return {
		fields: ['interi', 'ridotti'],
		asks: `interi e ridotti sono due campi del modulo, con il numero dei biglietti di ogni tipo. L'invio va fermato quando i biglietti, in tutto, sono più di ${max}.`,
		right: sum('>'),
		wrong: [
			{ kind: 'senza-number', text: `interi.value + ridotti.value > ${max}` },
			{ kind: 'number-fuori', text: two('Number(interi.value +', `ridotti.value) > ${max}`) },
			{ kind: 'nodi', text: `interi + ridotti > ${max}` },
			{ kind: 'rovescio', text: sum('<') },
			{ kind: 'compreso', text: sum('>=') }
		],
		steps: [
			'value è sempre un testo: tra due testi + attacca, e "2" + "1" fa "21". Ogni valore va passato da Number() prima della somma, non dopo.',
			`"Più di ${max}" si scrive > ${max}: con >= verrebbe fermato anche chi ne chiede ${max} esatti.`
		],
		extra: { max }
	};
}

function level5(rng: Rng, kind: 'uguali' | 'vuoto' | 'intervallo' | 'somma'): CodeBuilt {
	const w = wanted(rng, kind);
	const script = rows('function controlla(event) {', w.before && `    ${w.before}`, '    if (/* condizione */) {', '        event.preventDefault();', '    }', '}');
	const wrong = shuffle(rng, w.wrong).slice(0, 3);
	return {
		prompt: 'Per ogni condizione chiediti con quali valori è vera.',
		problem: `Nello script ${w.asks} Quale condizione va scritta al posto del commento?`,
		listing: script,
		solution: w.right.replace(/\n\s+/, ' '),
		steps: w.steps,
		solutionListing: rows(w.right),
		answer: choose(
			rng,
			listingOption(w.right),
			wrong.map((x) => listingOption(x.text))
		),
		params: { case: kind, fields: w.fields, script, ...w.extra, wrong: wrong.map((x) => x.kind) }
	};
}

export default makeCodeGenerator(ID, 'Controllare i dati di un modulo', {
	1: { label: 'Leggere un campo', constraints: ['what is written in a field is its value attribute', 'trim and length, value plus a number, checked'], build: drawn(['lunghezza', 'lunghezza', 'lunghezza', 'lunghezza', 'lunghezza', 'lunghezza', 'lunghezza', 'lunghezza', 'somma', 'somma', 'somma', 'somma', 'somma', 'somma', 'somma', 'casella', 'casella', 'casella', 'casella', 'casella'] as const, level1), check: fragments },
	2: { label: 'Quale valore passa il controllo', constraints: ['one check in a listener of submit', 'four values written in the field, one passes or one is stopped'], build: drawn(['vuoto', 'lunghezza', 'forma', 'intervallo'] as const, level2), check: fragments },
	3: { label: 'Quale messaggio compare', constraints: ['a function with two or three checks in order', 'one value written in the field'], build: drawn(['primo', 'secondo', 'terzo', 'nessuno'] as const, level3), check: fragments },
	4: { label: 'Il modulo parte?', constraints: ['a listener of submit with one check', 'preventDefault inside the if, missing, or outside it'], build: drawn(['parte', 'fermato', 'lo-stesso', 'mai'] as const, level4), check: fragments },
	5: { label: 'Scrivere il controllo', constraints: ['four conditions, one does the check described', 'each wrong one has one mistake'], build: drawn(['uguali', 'uguali', 'uguali', 'vuoto', 'vuoto', 'intervallo', 'intervallo', 'intervallo', 'somma', 'somma'] as const, level5), check: fragments }
});
