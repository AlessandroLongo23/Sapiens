/**
 * I moduli. Spec: specs/exercises/inf-html-moduli.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/91-inf-html-moduli.md), all multiple choice. Every
 * question shows a fragment of a form or offers fragments as options, and asks to foresee: 1. the field for a kind
 * of datum, and what the browser does with it; 2. the label tied to its field by `for` and `id`; 3. the pairs of
 * name and value that are sent, where a field without `name` is left out; 4. checkboxes, radio buttons and menus;
 * 5. where the pairs travel with GET and with POST, and the address the browser asks for; 6. whether the browser
 * sends the form, with `required`, `min`, `max`, `minlength` and the type `email`.
 *
 * An <input> is written on two rows, so that it fits a phone: the type and the name on the first, the rest on the
 * second. The wrong options are the mistakes of the lesson's warnings: `for` that repeats the `name`, a field
 * without `name`, the label read in the place of the `value`, radio buttons with different names, a form without
 * `method`.
 */
import type { ChoiceOption, Rng } from '../types';
import { choose, listingOption, makeCodeGenerator, shuffle, textOption, type CodeBuilt } from '../inf-codice';

export const ID = 'inf-html-moduli';

const rows = (...parts: (string | readonly string[])[]) => parts.flat().join('\n') + '\n';
const some = <T>(rng: Rng, xs: readonly T[], n: number) => shuffle(rng, xs).slice(0, n);
const quote = (text: string) => `"${text}"`;
/** An <input> on two rows: `first` beside the tag, `second` under it. */
const input = (first: string, second: string, indent = 0) => [`${' '.repeat(indent)}<input ${first}`, `${' '.repeat(indent + 2)}${second}>`];

/** A multiple choice with the right option and three wrong ones: those of `first`, then the others shuffled. Says which were taken. */
function pick(rng: Rng, right: ChoiceOption, wrong: Record<string, ChoiceOption>, first: readonly string[] = []) {
	const keys = [...first, ...shuffle(rng, Object.keys(wrong).filter((k) => !first.includes(k)))];
	const taken: string[] = [];
	const seen = new Set([right.values.join('|')]);
	for (const key of keys) {
		if (taken.length === 3) break;
		const value = wrong[key].values.join('|');
		if (seen.has(value)) continue;
		seen.add(value);
		taken.push(key);
	}
	return {
		answer: choose(
			rng,
			right,
			taken.map((key) => wrong[key])
		),
		wrong: taken
	};
}
const optionsOf = (texts: Record<string, string>, option: (text: string) => ChoiceOption): Record<string, ChoiceOption> => Object.fromEntries(Object.entries(texts).map(([k, text]) => [k, option(text)]));
const listings = (texts: Record<string, string>) => optionsOf(texts, (text) => listingOption(text));
const sentences = (texts: Record<string, string>) => optionsOf(texts, (text) => textOption(text));

// ---------------------------------------------------------------------------
// Level 1: the right field

type Kind = 'text' | 'email' | 'number' | 'date' | 'password' | 'checkbox' | 'radio';

/** What is asked of the user, the type of the field for it and its name. */
const DATA: readonly (readonly [string, Kind, string])[] = [
	['l’indirizzo email', 'email', 'email'],
	['l’email di un genitore', 'email', 'genitore'],
	['la data di nascita', 'date', 'nascita'],
	['il giorno della gita', 'date', 'giorno'],
	['il numero di biglietti', 'number', 'biglietti'],
	['quanti posti prenotare', 'number', 'posti'],
	['l’età in anni', 'number', 'eta'],
	['la password', 'password', 'password'],
	['il codice segreto della tessera', 'password', 'codice'],
	['il cognome', 'text', 'cognome'],
	['la città in cui si abita', 'text', 'citta'],
	['il nome del proprio gruppo', 'text', 'gruppo'],
	['un sì o un no al regolamento', 'checkbox', 'accetto'],
	['un sì o un no alle notizie del gruppo', 'checkbox', 'notizie']
];

/** Types a student writes that do not exist: the browser shows a plain text field for them. */
const INVENTED: Record<Exclude<Kind, 'text' | 'radio'>, string> = { email: 'mail', number: 'numero', date: 'data', password: 'segreto', checkbox: 'spunta' };
/** The real types a student mixes each one up with. */
const MIXED: Record<Kind, readonly Kind[]> = {
	text: ['number', 'date', 'password', 'email', 'checkbox'],
	email: ['text', 'password', 'number'],
	number: ['text', 'date', 'checkbox'],
	date: ['text', 'number', 'email'],
	password: ['text', 'email', 'checkbox'],
	checkbox: ['radio', 'text', 'number'],
	radio: ['checkbox', 'text', 'number']
};

const DOES: Record<Kind, string> = {
	text: 'mostra quello che scrivi e non controlla niente',
	email: 'controlla che ci sia una chiocciola',
	number: 'rifiuta le lettere',
	date: 'apre un calendario',
	password: 'nasconde i caratteri che scrivi',
	checkbox: 'mostra una casella da spuntare',
	radio: 'mostra un pallino da accendere'
};
/** What a field of another type does that this one does too: not a wrong answer for it. */
const ALSO: Partial<Record<Kind, readonly Kind[]>> = { date: ['number'] };
const KINDS = Object.keys(DOES) as Kind[];

type Element = 'select' | 'textarea' | 'radio' | 'checkbox';
const ELEMENTS: Record<Element | 'text' | 'option', string> = { select: '<select>', textarea: '<textarea>', radio: '<input type="radio">', checkbox: '<input type="checkbox">', text: '<input type="text">', option: '<option>' };
const NEEDS: readonly (readonly [string, Element])[] = [
	['scegliere la provincia in un menu a tendina con più di cento voci', 'select'],
	['scegliere la classe in un menu a tendina con venti voci', 'select'],
	['scegliere la taglia della felpa in un menu a tendina', 'select'],
	['scrivere un messaggio di più righe', 'textarea'],
	['lasciare un commento lungo, su più righe', 'textarea'],
	['descrivere un problema in alcune righe di testo', 'textarea'],
	['scegliere una sola di tre risposte, tutte in vista sulla pagina', 'radio'],
	['dire se si è studente oppure ospite: le due risposte sono in vista, e ne vale una sola', 'radio'],
	['spuntare tutti gli strumenti che si suonano, anche più di uno', 'checkbox'],
	['accettare il regolamento con una spunta', 'checkbox']
];
const WHY: Record<Element, string> = {
	select: 'Un menu a tendina, per una scelta tra tante voci, è un <select>: ogni voce è un <option> al suo interno.',
	textarea: 'Un testo di più righe si scrive in un <textarea>: un <input> ha una riga sola.',
	radio: 'Per una scelta sola tra poche risposte in vista servono i pallini, <input type="radio">, con lo stesso name: ne resta acceso uno.',
	checkbox: 'Una spunta che si può mettere e togliere, anche su più voci insieme, è una casella: <input type="checkbox">.'
};

function level1(rng: Rng): CodeBuilt {
	const kind = rng.pick(['tipo', 'tipo', 'fa', 'fa', 'elemento'] as const);
	if (kind === 'tipo') {
		const [what, type, name] = rng.pick(DATA);
		const field = (t: string) => rows(input(`type="${t}"`, `name="${name}"`));
		const wrong: Record<string, ChoiceOption> = listings({
			...Object.fromEntries(MIXED[type].map((t) => [t, field(t)])),
			...(type === 'text' ? {} : { inventato: field(INVENTED[type as keyof typeof INVENTED]), elemento: `<${type}\n  name="${name}">\n` })
		});
		const { answer, wrong: taken } = pick(rng, listingOption(field(type)), wrong, [MIXED[type][0]]);
		return {
			prompt: 'Guarda l’attributo type di ogni campo.',
			problem: `In un modulo serve un campo per ${what}. Quale va bene?`,
			solution: `Il campo <input> con type="${type}".`,
			steps: [`Per questo dato serve un <input> con type="${type}": il browser ${DOES[type]}.`, type === 'text' ? 'Gli altri tipi sono fatti per altri dati, e rifiuterebbero o nasconderebbero quello che l’utente scrive.' : 'Un tipo che non esiste viene trattato come type="text", e il nome del tipo non è un elemento: l’elemento è sempre <input>.'],
			solutionListing: field(type),
			answer,
			params: { case: 'tipo', what, type, name, wrong: taken }
		};
	}
	if (kind === 'fa') {
		const type = rng.pick(KINDS);
		const [, , name] = rng.pick(DATA.filter((d) => d[1] === type).length ? DATA.filter((d) => d[1] === type) : [['', type, 'scelta'] as const]);
		const others = KINDS.filter((t) => t !== type && !ALSO[type]?.includes(t));
		const { answer, wrong: taken } = pick(rng, textOption(DOES[type]), sentences(Object.fromEntries(others.map((t) => [t, DOES[t]]))));
		return {
			prompt: 'Guarda l’attributo type.',
			problem: 'Che cosa fa di solito il browser con questo campo?',
			listing: rows(input(`type="${type}"`, `id="${name}" name="${name}"`)),
			solution: `Il browser ${DOES[type]}.`,
			steps: [`Il campo ha type="${type}".`, `Con questo tipo il browser ${DOES[type]}.`],
			answer,
			params: { case: 'fa', type, name, wrong: taken }
		};
	}
	const [need, element] = rng.pick(NEEDS);
	const others = (['select', 'textarea', 'radio', 'checkbox', 'text', 'option'] as const).filter((e) => e !== element);
	const { answer, wrong: taken } = pick(rng, listingOption(ELEMENTS[element]), listings(Object.fromEntries(others.map((e) => [e, ELEMENTS[e]]))));
	return {
		prompt: 'Non tutto si inserisce con una riga di testo.',
		problem: `In un modulo l’utente deve ${need}. Con quale elemento?`,
		solution: `Con ${ELEMENTS[element]}.`,
		steps: [WHY[element], element === 'radio' ? 'Una casella si può spuntare insieme alle altre, e un menu a tendina nasconde le risposte finché non lo apri.' : element === 'checkbox' ? 'I pallini servono quando la risposta è una sola: acceso uno, gli altri si spengono.' : 'Gli altri elementi servono per dati diversi: una riga di testo, un sì o un no, una scelta tra poche risposte in vista.'],
		answer,
		params: { case: 'elemento', need, element, wrong: taken }
	};
}

// ---------------------------------------------------------------------------
// Level 2: the label and its field

/** A field: its id (which is also its name), the text of its label and its type. All short, to fit an option. */
const FIELDS: readonly (readonly [string, string, string])[] = [
	['nome', 'Nome', 'text'],
	['email', 'Email', 'email'],
	['citta', 'Città', 'text'],
	['eta', 'Età', 'number'],
	['data', 'Data', 'date'],
	['posti', 'Posti', 'number'],
	['via', 'Via', 'text'],
	['voto', 'Voto', 'number'],
	['sport', 'Sport', 'text']
];
const OTHER_IDS = ['campo1', 'campo2', 'dato', 'f1', 'x'] as const;

function level2(rng: Rng): CodeBuilt {
	if (rng.int(0, 1) === 0) {
		const [id, text, type] = rng.pick(FIELDS);
		const other = rng.pick(OTHER_IDS);
		const label = (attributes: string) => `<label${attributes ? ` ${attributes}` : ''}>${text}</label>`;
		const right = rows(label(`for="${id}"`), input(`type="${type}"`, `id="${id}" name="${id}"`));
		const wrong = listings({
			// the field has the name the label looks for, and no id
			senzaId: rows(label(`for="${id}"`), input(`type="${type}"`, `name="${id}"`)),
			// for repeats the name, and the id is another
			name: rows(label(`for="${id}"`), input(`type="${type}"`, `id="${other}" name="${id}"`)),
			idSullEtichetta: rows(label(`id="${id}"`), input(`type="${type}"`, `name="${id}"`)),
			nameSullEtichetta: rows(label(`name="${id}"`), input(`type="${type}"`, `id="${id}" name="${id}"`)),
			// for repeats the text of the label, capital letter and accent included
			testo: rows(label(`for="${text}"`), input(`type="${type}"`, `id="${id}" name="${id}"`)),
			forSulCampo: rows(label(''), input(`type="${type}"`, `for="${id}" name="${id}"`))
		});
		const { answer, wrong: taken } = pick(rng, listingOption(right), wrong, rng.int(0, 1) ? ['name'] : ['senzaId']);
		return {
			prompt: 'Confronta il for dell’etichetta con l’id del campo.',
			problem: `In quale frammento un clic sulla parola ${quote(text)} porta il cursore nel campo?`,
			solution: `Nel frammento in cui il for dell’etichetta e l’id del campo sono uguali: ${quote(id)}.`,
			steps: ['Un’etichetta si lega al suo campo con for, che ripete l’id del campo.', 'Il name non c’entra: serve al server, e for non lo guarda.', `Qui for e id valgono tutti e due ${quote(id)}; negli altri frammenti l’id manca, è diverso, oppure for non è sull’etichetta.`],
			solutionListing: right,
			answer,
			params: { case: 'lega', id, text, type, other, wrong: taken }
		};
	}
	const [[id1, text1, type1], [id2, text2, type2]] = some(rng, FIELDS, 2);
	const variant = rng.pick(['giusto', 'giusto', 'incrociato', 'name', 'assente', 'sbagliato'] as const);
	const other = rng.pick(OTHER_IDS);
	// what the second label points at, and the id of the second field
	const target = { giusto: id2, incrociato: id1, name: id2, assente: null, sbagliato: `${id2}2` }[variant];
	const secondId = variant === 'name' ? other : id2;
	const listing = rows(`<label for="${id1}">${text1}</label>`, input(`type="${type1}"`, `id="${id1}" name="${id1}"`), `<label${target ? ` for="${target}"` : ''}>${text2}</label>`, input(`type="${type2}"`, `id="${secondId}" name="${id2}"`));
	const outcome = variant === 'giusto' ? 'secondo' : variant === 'incrociato' ? 'primo' : 'niente';
	const options = { primo: 'il cursore entra nel primo campo', secondo: 'il cursore entra nel secondo campo', niente: 'non succede niente', invia: 'il modulo viene inviato' };
	const { answer } = pick(rng, textOption(options[outcome]), sentences(Object.fromEntries(Object.entries(options).filter(([k]) => k !== outcome))));
	return {
		prompt: 'Cerca nella pagina il campo che ha come id il valore del for.',
		problem: `Fai clic sulla parola ${quote(text2)}. Che cosa succede?`,
		listing,
		solution: `${options[outcome][0].toUpperCase()}${options[outcome].slice(1)}.`,
		steps: [
			target ? `L’etichetta ${quote(text2)} ha for="${target}": il clic cerca il campo che ha id="${target}".` : `L’etichetta ${quote(text2)} non ha l’attributo for: non è legata a nessun campo.`,
			outcome === 'secondo' ? 'Quel campo è il secondo, e il cursore ci entra.' : outcome === 'primo' ? 'Quel campo è il primo: l’etichetta è legata al campo sbagliato, e il cursore entra lì.' : target ? `Nessun campo ha quell’id${variant === 'name' ? `: il secondo ha name="${id2}", ma for guarda l’id, che è ${quote(secondId)}` : ''}. Il clic non fa niente.` : 'Il clic non fa niente.'
		],
		answer,
		params: { case: 'clic', variant, text: text2, ids: [id1, secondId], target }
	};
}

// ---------------------------------------------------------------------------
// Level 3: what is sent

/** A field of a form with the values a user may have left in it. */
const VALUES: readonly (readonly [string, string, readonly string[]])[] = [
	['nome', 'text', ['Anna', 'Luca', 'Sara', 'Omar']],
	['classe', 'text', ['3B', '2A', '4C']],
	['posti', 'number', ['2', '3', '4']],
	['citta', 'text', ['Pisa', 'Bari', 'Lodi']],
	['eta', 'number', ['15', '16', '17']],
	['sport', 'text', ['nuoto', 'calcio', 'judo']],
	['voto', 'number', ['7', '8', '9']],
	['strumento', 'text', ['basso', 'flauto', 'piano']]
];
const ACTIONS = ['/cerca', '/gita', '/voti', '/iscrivi', '/prenota'] as const;

interface Filled {
	name: string;
	type: string;
	value: string;
}
const filled = (rng: Rng, n: number): Filled[] => some(rng, VALUES, n).map(([name, type, values]) => ({ name, type, value: rng.pick(values) }));
const pairs = (fields: readonly { name: string; value: string }[]) => rows(fields.map((f) => `${f.name}=${f.value}`));
const BUTTON = '  <button type="submit">Invia</button>';

function level3(rng: Rng): CodeBuilt {
	const fields = filled(rng, 3);
	const odd = rng.int(0, 2);
	const post = rng.int(0, 1) === 0;
	const form = (inside: string[][]) => rows(`<form action="${rng.pick(ACTIONS)}" method="${post ? 'post' : 'get'}">`, ...inside, BUTTON, '</form>');
	if (rng.int(0, 4) < 3) {
		// one field has an id where its name should be
		const listing = form(fields.map((f, i) => input(`type="${f.type}" ${i === odd ? 'id' : 'name'}="${f.name}"`, `value="${f.value}"`, 2)));
		const sent = fields.filter((_, i) => i !== odd);
		const wrong = listings({
			tutti: pairs(fields),
			soloQuello: pairs([fields[odd]]),
			valori: rows(sent.map((f) => f.value)),
			tipi: pairs(sent.map((f) => ({ name: f.type, value: f.value }))),
			tuttiValori: rows(fields.map((f) => f.value))
		});
		const { answer, wrong: taken } = pick(rng, listingOption(pairs(sent)), wrong, ['tutti']);
		return {
			prompt: 'Cerca l’attributo name di ogni campo.',
			problem: 'L’utente lascia nei campi i valori di partenza e preme il bottone. Quali coppie invia il browser?',
			listing,
			solution: `${sent.map((f) => `${f.name}=${f.value}`).join(' e ')}: il campo con id="${fields[odd].name}" non ha name e non parte.`,
			steps: ['Per ogni campo il browser prepara una coppia: il name del campo e il valore che contiene.', `Il campo con il valore ${quote(fields[odd].value)} ha un id ma non ha name: non viene inviato.`, `Partono gli altri due: ${sent.map((f) => `${f.name}=${f.value}`).join(' e ')}.`],
			answer,
			params: { case: 'senzaName', fields, odd, post, wrong: taken }
		};
	}
	// every field has a name, and one has an id that is another word
	const id = rng.pick(OTHER_IDS);
	const listing = form(fields.map((f, i) => (i === odd ? input(`type="${f.type}" id="${id}"`, `name="${f.name}" value="${f.value}"`, 2) : input(`type="${f.type}" name="${f.name}"`, `value="${f.value}"`, 2))));
	const wrong = listings({
		id: pairs(fields.map((f, i) => (i === odd ? { name: id, value: f.value } : f))),
		senza: pairs(fields.filter((_, i) => i !== odd)),
		valori: rows(fields.map((f) => f.value)),
		tipi: pairs(fields.map((f) => ({ name: f.type, value: f.value })))
	});
	const { answer, wrong: taken } = pick(rng, listingOption(pairs(fields)), wrong, ['id']);
	return {
		prompt: 'Cerca l’attributo name di ogni campo.',
		problem: 'L’utente lascia nei campi i valori di partenza e preme il bottone. Quali coppie invia il browser?',
		listing,
		solution: `${fields.map((f) => `${f.name}=${f.value}`).join(', ')}: ogni campo parte con il suo name.`,
		steps: ['Per ogni campo il browser prepara una coppia: il name del campo e il valore che contiene.', `Tutti e tre i campi hanno un name, quindi partono tutti e tre.`, `Il campo con id="${id}" parte con il suo name, ${quote(fields[odd].name)}: l’id serve dentro la pagina e al server non arriva.`],
		answer,
		params: { case: 'idDiverso', fields, odd, id, post, wrong: taken }
	};
}

// ---------------------------------------------------------------------------
// Level 4: checkboxes, radio buttons and menus

const BOXES: readonly (readonly [string, string])[] = [
	['notizie', 'si'],
	['socio', 'si'],
	['pranzo', 'si'],
	['foto', 'ok'],
	['pullman', 'si']
];
const PEOPLE = ['Leo', 'Anna', 'Luca', 'Sara', 'Omar', 'Irene'] as const;
/** A choice among three: the name, then for each answer its value and the text the user reads. */
const CHOICES: readonly (readonly [string, readonly (readonly [string, string])[]])[] = [
	[
		'chi',
		[
			['stu', 'Studente'],
			['osp', 'Ospite'],
			['doc', 'Docente']
		]
	],
	[
		'taglia',
		[
			['s', 'Piccola'],
			['m', 'Media'],
			['l', 'Grande']
		]
	],
	[
		'turno',
		[
			['mat', 'Mattina'],
			['pom', 'Pomeriggio'],
			['sera', 'Sera']
		]
	],
	[
		'pasto',
		[
			['car', 'Carne'],
			['pes', 'Pesce'],
			['veg', 'Verdure']
		]
	],
	[
		'mezzo',
		[
			['bus', 'Pullman'],
			['tre', 'Treno'],
			['bici', 'Bicicletta']
		]
	]
];

function level4(rng: Rng): CodeBuilt {
	const kind = rng.pick(['casella', 'pallini', 'menu', 'gruppo'] as const);
	if (kind === 'casella') {
		const [name, value] = rng.pick(BOXES);
		const who = rng.pick(PEOPLE);
		const ticked = rng.int(0, 1) === 0;
		const base = `nome=${who}`;
		const right = rows(base, ...(ticked ? [`${name}=${value}`] : []));
		const wrong = listings(
			ticked
				? { senza: rows(base), spuntata: rows(base, `${name}=spuntata`), tipo: rows(base, `checkbox=${value}`), sola: rows(`${name}=${value}`), nomeValore: rows(base, `${value}=${name}`) }
				: { no: rows(base, `${name}=no`), vuota: rows(base, `${name}=`), lostesso: rows(base, `${name}=${value}`), falso: rows(base, `${name}=false`) }
		);
		const { answer, wrong: taken } = pick(rng, listingOption(right), wrong, ticked ? ['senza'] : ['no']);
		return {
			prompt: 'Una casella parte solo se è spuntata.',
			problem: `Nel primo campo c’è scritto ${who}. L’utente ${ticked ? 'spunta' : 'non spunta'} la casella e preme il bottone di invio. Quali coppie partono?`,
			listing: rows(input('type="text" name="nome"', `value="${who}"`), input(`type="checkbox" name="${name}"`, `value="${value}"`)),
			solution: ticked ? `nome=${who} e ${name}=${value}: la casella spuntata manda il suo value.` : `Solo nome=${who}: una casella non spuntata non viene inviata.`,
			steps: [`Il campo di testo ha un name e parte: nome=${who}.`, ticked ? `La casella è spuntata, quindi parte anche lei, con il suo name e il suo value: ${name}=${value}.` : 'La casella non è spuntata: il browser non la invia per niente, nemmeno con un "no" o con un valore vuoto.'],
			answer,
			params: { case: 'casella', ticked, who, name, wrong: taken }
		};
	}
	const [name, answers] = rng.pick(CHOICES);
	if (kind === 'gruppo') {
		const [[v1], [v2]] = some(rng, answers, 2);
		const two = (a: [string, string], b: [string, string]) => rows(input(a[0], a[1]), input(b[0], b[1]));
		const right = two([`type="radio" name="${name}"`, `value="${v1}"`], [`type="radio" name="${name}"`, `value="${v2}"`]);
		const wrong = listings({
			// each radio button with a name of its own
			nomi: two([`type="radio" name="${v1}"`, 'value="si"'], [`type="radio" name="${v2}"`, 'value="si"']),
			// the same id, which ties nothing together
			id: two([`type="radio" id="${name}"`, `name="${v1}" value="si"`], [`type="radio" id="${name}"`, `name="${v2}" value="si"`]),
			// the same value, different names
			value: two([`type="radio" name="${v1}"`, `value="${name}"`], [`type="radio" name="${v2}"`, `value="${name}"`]),
			senzaName: two(['type="radio"', `value="${v1}"`], ['type="radio"', `value="${v2}"`]),
			// checkboxes with the same name can all be ticked
			caselle: two(['type="checkbox"', `name="${name}" value="${v1}"`], ['type="checkbox"', `name="${name}" value="${v2}"`])
		});
		const { answer, wrong: taken } = pick(rng, listingOption(right), wrong, ['nomi']);
		return {
			prompt: 'Guarda che cosa hanno in comune i due campi.',
			problem: 'In quale frammento, acceso un pallino, l’altro si spegne da solo?',
			solution: `Nel frammento con due <input type="radio"> che hanno lo stesso name, ${quote(name)}.`,
			steps: ['I pallini formano un gruppo quando hanno lo stesso name: in un gruppo ne resta acceso uno solo.', 'Con due name diversi sono due domande separate, e si accendono tutti e due.', 'Avere lo stesso id o lo stesso value non li lega; due caselle con lo stesso name si possono spuntare insieme.'],
			solutionListing: right,
			answer,
			params: { case: 'gruppo', name, values: [v1, v2], wrong: taken }
		};
	}
	const chosen = rng.int(0, 2);
	const [value, text] = answers[chosen];
	const ids = ['a', 'b', 'c'];
	if (kind === 'pallini') {
		const wrong = listings({
			// the text of the label, which is what the user reads
			etichetta: rows(`${name}=${text}`),
			id: rows(`${ids[chosen]}=${value}`),
			idValore: rows(`${name}=${ids[chosen]}`),
			tipo: rows(`radio=${value}`),
			tutti: rows(answers.map(([v]) => `${name}=${v}`))
		});
		const { answer, wrong: taken } = pick(rng, listingOption(rows(`${name}=${value}`)), wrong, ['etichetta']);
		return {
			prompt: 'Di un gruppo di pallini parte solo quello acceso, con il suo value.',
			problem: `L’utente accende il pallino ${quote(text)} e preme il bottone di invio. Quale coppia parte?`,
			listing: rows(...answers.map(([v, t], i) => [...input(`type="radio" name="${name}"`, `id="${ids[i]}" value="${v}"`), `<label for="${ids[i]}">${t}</label>`])),
			solution: `${name}=${value}: il name del gruppo e il value del pallino acceso.`,
			steps: [`I tre pallini hanno lo stesso name, ${quote(name)}: sono un gruppo, e ne parte uno solo.`, `Quello acceso ha l’etichetta ${quote(text)} e value="${value}": parte ${name}=${value}.`, 'Il testo dell’etichetta lo legge l’utente, e l’id serve a legarla: al server arriva il value.'],
			answer,
			params: { case: 'pallini', name, text, wrong: taken }
		};
	}
	const wrong = listings({
		testo: rows(`${name}=${text}`),
		valoreTesto: rows(`${value}=${text}`),
		option: rows(`option=${value}`),
		posto: rows(`${name}=${chosen + 1}`),
		select: rows(`select=${text}`)
	});
	const { answer, wrong: taken } = pick(rng, listingOption(rows(`${name}=${value}`)), wrong, ['testo']);
	return {
		prompt: 'Di un menu parte il value dell’opzione scelta.',
		problem: `L’utente sceglie ${quote(text)} nel menu e preme il bottone di invio. Quale coppia parte?`,
		listing: rows(`<select name="${name}">`, answers.map(([v, t]) => `  <option value="${v}">${t}</option>`), '</select>'),
		solution: `${name}=${value}: il name del menu e il value dell’opzione scelta.`,
		steps: [`Il name è quello del <select>: ${quote(name)}.`, `L’opzione scelta mostra il testo ${quote(text)}, ma ha value="${value}": parte ${name}=${value}.`],
		answer,
		params: { case: 'menu', name, text, wrong: taken }
	};
}

// ---------------------------------------------------------------------------
// Level 5: GET and POST

const WHERE = { indirizzo: 'nell’indirizzo, dopo un punto interrogativo', corpo: 'nel corpo della richiesta', action: 'dentro l’attributo action', browser: 'da nessuna parte: restano nel browser' } as const;
const USES: readonly (readonly [string, 'get' | 'post'])[] = [
	['un modulo di accesso, con nome utente e password', 'post'],
	['l’iscrizione a un concerto, che il server deve registrare', 'post'],
	['un messaggio da lasciare al gruppo', 'post'],
	['il cambio della propria password', 'post'],
	['una ricerca tra i concerti, il cui risultato vuoi mandare a un’amica come link', 'get'],
	['un filtro che mostra solo i concerti di maggio, da salvare tra i preferiti', 'get'],
	['la ricerca di una canzone per titolo, da ritrovare nella cronologia', 'get']
];

function level5(rng: Rng): CodeBuilt {
	const kind = rng.pick(['indirizzo', 'indirizzo', 'corpo', 'dove', 'metodo'] as const);
	if (kind === 'metodo') {
		const [use, method] = rng.pick(USES);
		const other = method === 'get' ? 'post' : 'get';
		const { answer, wrong: taken } = pick(rng, textOption(`method="${method}"`), sentences({ altro: `method="${other}"`, https: 'method="https"', send: 'method="send"', link: 'method="link"', action: `action="${method}"` }), ['altro']);
		return {
			prompt: 'Chiediti se i dati possono restare scritti nell’indirizzo.',
			problem: `Quale attributo scrivi nel <form> per ${use}?`,
			solution: `method="${method}".`,
			steps: [method === 'get' ? 'Qui si chiede qualcosa al server, e fa comodo che i dati restino nell’indirizzo: così si può copiare, salvare e ritrovare.' : 'Qui si consegna al server qualcosa da registrare, o un dato che non deve restare scritto nell’indirizzo e nella cronologia.', method === 'get' ? 'Con method="get" le coppie finiscono nell’indirizzo, dopo il punto interrogativo.' : 'Con method="post" le coppie viaggiano nel corpo della richiesta e l’indirizzo resta quello di action.', 'I valori di method sono due, get e post: https è il protocollo della pagina, non un metodo.'],
			answer,
			params: { case: 'metodo', use, method, wrong: taken }
		};
	}
	// two fields and an action short enough for the address to fit an option
	let fields: Filled[], action: string;
	do {
		fields = filled(rng, 2);
		action = rng.pick(ACTIONS);
	} while (`${action}?${fields.map((f) => `${f.name}=${f.value}`).join('&')}`.length > 34);
	const [a, b] = fields.map((f) => `${f.name}=${f.value}`);
	const method = kind === 'corpo' ? 'post' : kind === 'dove' ? rng.pick(['get', 'post', null] as const) : rng.pick(['get', 'get', 'post'] as const);
	const listing = rows(`<form action="${action}"${method ? ` method="${method}"` : ''}>`, ...fields.map((f) => input(`type="${f.type}" name="${f.name}"`, `value="${f.value}"`, 2)), BUTTON, '</form>');
	const sent = 'L’utente lascia nei campi i valori di partenza e preme il bottone.';
	if (kind === 'dove') {
		const right = method === 'post' ? 'corpo' : 'indirizzo';
		const { answer } = pick(rng, textOption(WHERE[right]), sentences(Object.fromEntries(Object.entries(WHERE).filter(([k]) => k !== right))));
		return {
			prompt: 'Cerca l’attributo method del modulo.',
			problem: `${sent} Dove viaggiano i dati?`,
			listing,
			solution: `${WHERE[right][0].toUpperCase()}${WHERE[right].slice(1)}.`,
			steps: [method ? `Il modulo ha method="${method}".` : 'Il modulo non ha l’attributo method: in questo caso il browser usa get.', method === 'post' ? 'Con post le coppie viaggiano nel corpo della richiesta, e l’indirizzo resta quello di action.' : 'Con get le coppie si attaccano all’indirizzo di action, dopo un punto interrogativo.'],
			answer,
			params: { case: 'dove', method: method ?? 'assente', action, fields }
		};
	}
	if (kind === 'corpo') {
		const wrong = listings({ indirizzo: `${action}?${a}&${b}`, valori: `${fields[0].value}&${fields[1].value}`, virgola: `${a}, ${b}`, duePunti: `${a.replace('=', ':')}&${b.replace('=', ':')}`, interrogativo: `${a}?${b}` });
		const { answer, wrong: taken } = pick(rng, listingOption(`${a}&${b}`), wrong, ['indirizzo']);
		return {
			prompt: 'Le coppie sono nome=valore, unite da &.',
			problem: `${sent} Che cosa c’è nel corpo della richiesta?`,
			listing,
			solution: `${a}&${b}`,
			steps: ['Il modulo ha method="post": le coppie viaggiano nel corpo della richiesta.', `Ogni coppia è il name, un segno di uguale e il valore: ${a} e ${b}.`, 'Le coppie si uniscono con &. L’indirizzo, con il suo punto interrogativo, nel corpo non c’è.'],
			answer,
			params: { case: 'corpo', action, fields, wrong: taken }
		};
	}
	const get = method === 'get';
	const query = `${action}?${a}&${b}`;
	const wrong = listings(
		get
			? { senza: action, valori: `${action}?${fields[0].value}&${fields[1].value}`, scambiati: `${action}&${a}?${b}`, barre: `${action}/${a}/${b}`, virgola: `${action}?${a},${b}` }
			: { query, valori: `${action}?${fields[0].value}&${fields[1].value}`, metodo: `${action}?method=post`, post: `${action}/post` }
	);
	const { answer, wrong: taken } = pick(rng, listingOption(get ? query : action), wrong, [get ? 'senza' : 'query']);
	return {
		prompt: 'Guarda il method: decide se le coppie finiscono nell’indirizzo.',
		problem: `${sent} Quale indirizzo chiede il browser?`,
		listing,
		solution: get ? `${query}: con get le coppie sono nell’indirizzo.` : `${action}: con post l’indirizzo resta quello di action.`,
		steps: get
			? ['Il modulo ha method="get": le coppie si attaccano all’indirizzo di action.', `Dopo ${action} c’è un punto interrogativo, poi le coppie nome=valore unite da &.`, `L’indirizzo è ${query}.`]
			: ['Il modulo ha method="post": le coppie viaggiano nel corpo della richiesta.', `L’indirizzo resta quello scritto in action, ${action}, senza punto interrogativo.`],
		answer,
		params: { case: 'indirizzo', method, action, fields, wrong: taken }
	};
}

// ---------------------------------------------------------------------------
// Level 6: the checks of the browser

const YES = 'Sì, il modulo parte';
const NUMBERS = ['posti', 'biglietti', 'eta', 'voto', 'ospiti'] as const;
const WORDS = ['io', 'Leo', 'Anna', 'Marta', 'Davide', 'Roberto', 'Giovanna'] as const;
const MAILS = ['anna', 'luca.rossi', 'sara99', 'omar'] as const;

function level6(rng: Rng): CodeBuilt {
	const kind = rng.pick(['numero', 'numero', 'obbligatorio', 'email', 'lunghezza'] as const);
	const press = 'e preme il bottone di invio. Il modulo parte?';
	if (kind === 'numero') {
		const name = rng.pick(NUMBERS);
		const min = rng.int(1, 3);
		const max = min + rng.int(3, 9);
		const where = rng.pick(['sotto', 'sopra', 'dentro', 'bordoMin', 'bordoMax'] as const);
		const v = { sotto: min - 1, sopra: max + rng.int(1, 5), dentro: rng.int(min + 1, max - 1), bordoMin: min, bordoMax: max }[where];
		const options = { si: YES, min: `No: ${v} è più piccolo di min`, max: `No: ${v} è più grande di max`, vuoto: 'No: il campo è obbligatorio' };
		const right = where === 'sotto' ? 'min' : where === 'sopra' ? 'max' : 'si';
		const { answer } = pick(rng, textOption(options[right]), sentences(Object.fromEntries(Object.entries(options).filter(([k]) => k !== right))));
		return {
			prompt: 'Confronta il numero scritto con min e con max.',
			problem: `Nel campo l’utente scrive ${v} ${press}`,
			listing: rows(input(`type="number" name="${name}"`, `min="${min}" max="${max}" required`)),
			solution: `${options[right]}.`,
			steps: [`Il campo accetta i numeri da ${min} a ${max}, estremi compresi.`, right === 'si' ? `${v} sta tra ${min} e ${max}${where.startsWith('bordo') ? ', perché gli estremi sono accettati' : ''}, e il campo non è vuoto: il browser invia il modulo.` : `${v} è ${right === 'min' ? `più piccolo di ${min}` : `più grande di ${max}`}: il browser non invia il modulo e mostra un messaggio accanto al campo.`],
			answer,
			params: { case: 'numero', where, value: v, name, min, max }
		};
	}
	if (kind === 'obbligatorio') {
		const [name, , type] = rng.pick(FIELDS.filter((f) => f[2] !== 'date'));
		const required = rng.int(0, 1) === 0;
		const extra = type === 'number' ? 'min="1" max="9"' : type === 'text' ? `minlength="${rng.int(2, 4)}"` : '';
		const second = [`id="${name}"`, extra, required ? 'required' : ''].filter(Boolean).join(' ');
		const options = { si: YES, vuoto: 'No: il campo è obbligatorio ed è vuoto', sempre: 'No: un campo vuoto blocca sempre il modulo', controlli: 'No: un campo vuoto non supera gli altri controlli' };
		const right = required ? 'vuoto' : 'si';
		const { answer } = pick(rng, textOption(options[right]), sentences(Object.fromEntries(Object.entries(options).filter(([k]) => k !== right))));
		return {
			prompt: 'Cerca l’attributo required.',
			problem: `L’utente lascia vuoto questo campo ${press}`,
			listing: rows(input(`type="${type}" name="${name}"`, second)),
			solution: `${options[right]}.`,
			steps: [required ? 'Il campo ha l’attributo required: è obbligatorio.' : 'Il campo non ha l’attributo required: può restare vuoto.', required ? 'Vuoto, il browser non invia il modulo.' : 'Gli altri controlli valgono solo per quello che viene scritto: su un campo vuoto non hanno niente da controllare, e il modulo parte.'],
			answer,
			params: { case: 'obbligatorio', required, type, name, extra }
		};
	}
	if (kind === 'email') {
		const whole = rng.int(0, 1) === 0;
		const typed = whole ? `${rng.pick(MAILS)}@${rng.pick(['esempio.it', 'scuola.example'])}` : rng.pick(MAILS);
		const required = rng.int(0, 1) === 0;
		const options = { si: YES, chiocciola: 'No: nel testo manca la chiocciola', vuoto: 'No: il campo è obbligatorio', corto: 'No: il testo è troppo corto' };
		const right = whole ? 'si' : 'chiocciola';
		const { answer } = pick(rng, textOption(options[right]), sentences(Object.fromEntries(Object.entries(options).filter(([k]) => k !== right))));
		return {
			prompt: 'Il tipo del campo è già un controllo.',
			problem: `Nel campo l’utente scrive ${typed} ${press}`,
			listing: rows(input('type="email" name="email"', `id="email"${required ? ' required' : ''}`)),
			solution: `${options[right]}.`,
			steps: ['Un campo di tipo email accetta solo un testo con la forma di un indirizzo: una chiocciola con qualcosa prima e qualcosa dopo.', whole ? `${typed} ha la chiocciola al suo posto: il browser invia il modulo.` : `In ${typed} la chiocciola non c’è: il browser non invia il modulo.`],
			answer,
			params: { case: 'email', typed, required }
		};
	}
	const word = rng.pick(WORDS);
	const n = rng.int(Math.max(2, word.length - 2), word.length + 2);
	const short = word.length < n;
	const options = { si: YES, corto: `No: ${word.length} caratteri sono meno di minlength`, lungo: `No: ${word.length} caratteri sono più di minlength`, vuoto: 'No: il campo è obbligatorio' };
	const right = short ? 'corto' : 'si';
	const { answer } = pick(rng, textOption(options[right]), sentences(Object.fromEntries(Object.entries(options).filter(([k]) => k !== right))));
	return {
		prompt: 'Conta i caratteri scritti e confrontali con minlength.',
		problem: `Nel campo l’utente scrive ${word} ${press}`,
		listing: rows(input('type="text" name="nome"', `minlength="${n}" required`)),
		solution: `${options[right]}.`,
		steps: [`minlength="${n}" chiede almeno ${n} caratteri, e ${word} ne ha ${word.length}.`, short ? `${word.length} è meno di ${n}: il browser non invia il modulo.` : `${word.length} ${word.length === n ? `è proprio ${n}, e il minimo è accettato` : `è più di ${n}`}: il browser invia il modulo.`],
		answer,
		params: { case: 'lunghezza', word, minlength: n }
	};
}

/** No level of this generator has a program to run: its fragments are read, not executed. */
const fragmentsOnly = (sample: { params: Record<string, unknown> }) => (sample.params.program ? ['a level of fragments has no program'] : []);

export default makeCodeGenerator(ID, 'I moduli', {
	1: { label: 'Il campo giusto', constraints: ['the type of an input for a kind of datum', 'what the browser does with a type', 'select, textarea, radio or checkbox'], build: level1, check: fragmentsOnly },
	2: { label: 'Etichetta e campo', constraints: ['a label is tied to a field when its for is the id of the field', 'four different options'], build: level2, check: fragmentsOnly },
	3: { label: 'Che cosa viene inviato', constraints: ['a form of three fields', 'a field without name is not sent', 'options are pairs name=value'], build: level3, check: fragmentsOnly },
	4: { label: 'Caselle, pallini e menu', constraints: ['a checkbox is sent only when ticked', 'of a group of radio buttons the one chosen, with its value', 'of a select the value of the option'], build: level4, check: fragmentsOnly },
	5: { label: 'GET e POST', constraints: ['with get the pairs are in the address, with post in the body', 'a form without method uses get', 'an address of at most 34 characters'], build: level5, check: fragmentsOnly },
	6: { label: 'I controlli del browser', constraints: ['required, min and max, minlength, the type email', 'the bounds of min and max are accepted', 'an empty field without required passes'], build: level6, check: fragmentsOnly }
});
