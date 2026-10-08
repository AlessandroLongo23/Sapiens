/**
 * I linguaggi di markup. Spec: specs/exercises/inf-markup.md
 *
 * Five levels from the lesson (docs/lezioni/informatica/riscritte/87-inf-markup.md), all multiple choice, on
 * fragments shown in fixed width: the parts of an element (tags, content, attribute); the fragment whose tags are
 * closed and nested as they should be; the tree of a fragment (children, parent, how many elements); structure
 * against appearance, and a marked text against an instruction of a program; the HTML that a line of Markdown
 * stands for, and the other way round. The Python check reads every fragment again with its own parser.
 */
import { choose, listingOption, makeCodeGenerator, shuffle, textOption, type CodeBuilt } from '../inf-codice';
import type { ChoiceAnswer, ChoiceOption, Rng } from '../types';

export const ID = 'inf-markup';

const rightLabel = (answer: ChoiceAnswer) => answer.options[answer.correct].text ?? '';
const chance = (rng: Rng, p: number) => rng.next() < p;
/** Tries again until the fragments fit the widths of a phone. */
function fitting<T>(rng: Rng, build: (rng: Rng) => T | null): T {
	for (let i = 0; i < 200; i++) {
		const built = build(rng);
		if (built) return built;
	}
	throw new Error(`${ID}: no fragment fits`);
}
const widest = (text: string) => Math.max(...text.split('\n').map((row) => row.length));

// ---------------------------------------------------------------------------
// Level 1: the parts of an element

const VALUES = {
	href: ['concerti.html', 'foto.html', 'contatti.html', 'gruppo.html', 'video.html', 'testi.html'],
	lang: ['en', 'fr', 'es', 'de'],
	id: ['titolo', 'data', 'luogo', 'intro', 'scaletta'],
	class: ['nota', 'voce', 'avviso', 'grande'],
	title: ['Batterista', 'Sabato', 'Palestra', 'Gratis']
} as const;
type Attribute = keyof typeof VALUES;
const ELEMENTS: [string, Attribute[]][] = [
	['a', ['href']],
	['p', ['lang', 'id', 'class']],
	['h1', ['id', 'class']],
	['li', ['class', 'id']],
	['em', ['lang', 'title']],
	['strong', ['title', 'class']]
];
const CONTENTS = ['I concerti', 'Le foto', 'Chi siamo', 'Sabato sera', 'Fuori tempo', 'Leo, batteria', 'Sara, voce', 'Ingresso libero', 'La scaletta', 'Rock in aula', 'Prove aperte', 'Il gruppo'];

const ASKS = {
	apertura: 'Qual è il tag di apertura?',
	chiusura: 'Qual è il tag di chiusura?',
	contenuto: "Qual è il contenuto dell'elemento?",
	nome: "Qual è il nome dell'attributo?",
	valore: "Qual è il valore dell'attributo?",
	elemento: "Qual è il nome dell'elemento?"
} as const;
type Ask = keyof typeof ASKS;

function level1(rng: Rng): CodeBuilt {
	return fitting(rng, (rng) => {
		const [tag, attributes] = rng.pick(ELEMENTS);
		const attribute = rng.pick(attributes);
		const val = rng.pick(VALUES[attribute]);
		const content = rng.pick(CONTENTS);
		const ask = rng.pick(Object.keys(ASKS) as Ask[]);
		const open = `<${tag} ${attribute}="${val}">`;
		const close = `</${tag}>`;
		const whole = `${open}${content}${close}`;
		if (whole.length > 42 || content === val) return null;
		const parts: Record<Ask, string> = { apertura: open, chiusura: close, contenuto: content, nome: attribute, valore: val, elemento: tag };
		// the slips of each question first, then the other parts
		const near: Record<Ask, string[]> = {
			apertura: [`<${tag}>`, close, `${attribute}="${val}"`],
			chiusura: [`<${tag}>`, open, `<${tag}/>`],
			contenuto: [val, `${attribute}="${val}"`, open],
			nome: [val, tag, `${attribute}="${val}"`],
			valore: [attribute, content, `${attribute}="${val}"`],
			elemento: [attribute, open, content]
		};
		const others = [...near[ask], ...shuffle(rng, Object.values(parts))].filter((text) => text !== parts[ask] && text.length <= 34);
		const answer = choose(
			rng,
			listingOption(parts[ask]),
			others.map((text) => listingOption(text))
		);
		return {
			prompt: 'Riconosci le parti dell’elemento.',
			problem: `Guarda l'elemento HTML qui sotto. ${ASKS[ask]}`,
			listing: `${whole}\n`,
			solution: parts[ask],
			steps: [`Il tag di apertura è ${open}: il nome dell'elemento, ${tag}, e l'attributo ${attribute} con il suo valore ${val}.`, `Il contenuto è quello che sta tra i due tag: ${content}.`, `Il tag di chiusura è ${close}: lo stesso nome, con la barra davanti e senza attributi.`],
			solutionListing: `${parts[ask]}\n`,
			answer,
			params: { case: ask, tag, attribute, value: val, content }
		};
	});
}

// ---------------------------------------------------------------------------
// Level 2: tags closed and nested as they should be

const OUTER = ['p', 'li', 'h1'] as const;
const INNER = ['em', 'strong'] as const;
const PHRASES: [string, string, string][] = [
	['Suono ', 'rock', ' oggi.'],
	['Oggi ', 'jazz', ' dal vivo.'],
	['Prove ', 'aperte', ' sabato.'],
	['Ingresso ', 'libero', '.'],
	['Leo, ', 'batteria', '.'],
	['Sara, ', 'voce', '.'],
	['Si entra ', 'gratis', '.'],
	['Alle ', '21', ' in aula.'],
	['Solo ', 'tre', ' canzoni.'],
	['Niente ', 'bis', ' stasera.'],
	['Dario, ', 'basso', '.'],
	['Cerco un ', 'pianista', '.']
];

const fragment = (outer: string, body: string) => `<${outer}>\n  ${body}\n</${outer}>\n`;
/** The ways a student gets it wrong, each a fragment that a strict reader refuses. */
function broken(outer: string, inner: string, [a, w, b]: [string, string, string]): Record<string, string> {
	return {
		accavallati: `<${outer}>\n  ${a}<${inner}>${w}${b}\n</${outer}></${inner}>\n`,
		'non chiuso': fragment(outer, `${a}<${inner}>${w}${b}`),
		'senza barra': fragment(outer, `${a}<${inner}>${w}<${inner}>${b}`),
		'nome diverso': fragment(outer, `${a}<${inner}>${w}</${inner === 'em' ? 'strong' : 'em'}>${b}`),
		'barra in fondo': fragment(outer, `${a}<${inner}>${w}<${inner}/>${b}`),
		'esterno non chiuso': `<${outer}>\n  ${a}<${inner}>${w}</${inner}>${b}\n<${outer}>\n`
	};
}

function level2(rng: Rng): CodeBuilt {
	// drawn once: a fragment too wide is drawn again, the case is not
	const oneRight = chance(rng, 0.6);
	return fitting(rng, (rng) => {
		const outer = rng.pick(OUTER);
		const inner = rng.pick(INNER);
		const phrases = shuffle(rng, PHRASES).slice(0, 4);
		const good = (phrase: [string, string, string], o: string = outer, i: string = inner) => fragment(o, `${phrase[0]}<${i}>${phrase[1]}</${i}>${phrase[2]}`);
		const kinds = shuffle(rng, Object.keys(broken(outer, inner, phrases[0])));
		if (oneRight) {
			// one right fragment among three broken ones, all with the same words
			const wrong = broken(outer, inner, phrases[0]);
			const right = good(phrases[0]);
			const shown = kinds.slice(0, 3);
			if ([right, ...shown.map((k) => wrong[k])].some((text) => widest(text) > 34)) return null;
			return {
				prompt: 'Controlla che ogni tag sia chiuso, e nell’ordine giusto.',
				problem: 'Quale di questi frammenti HTML ha tutti i tag chiusi e annidati correttamente?',
				solution: 'Il frammento in cui l’elemento interno è chiuso prima di quello che lo contiene.',
				steps: [`L'elemento ${inner} è aperto dentro ${outer}: va chiuso con </${inner}> prima di </${outer}>.`, 'Un tag di chiusura ha la barra subito dopo <, e lo stesso nome del tag di apertura.', 'I tag si chiudono nell’ordine inverso a quello in cui sono stati aperti.'],
				solutionListing: right,
				answer: choose(
					rng,
					listingOption(right),
					shown.map((k) => listingOption(wrong[k]))
				),
				params: { case: 'giusto', outer, inner, phrase: phrases[0], errors: shown }
			};
		}
		// one broken fragment among three right ones, with different words
		const kind = kinds[0];
		const wrong = broken(outer, inner, phrases[0])[kind];
		const rights = [good(phrases[1]), good(phrases[2], outer, inner === 'em' ? 'strong' : 'em'), good(phrases[3], outer === 'p' ? 'li' : 'p')];
		if ([wrong, ...rights].some((text) => widest(text) > 34)) return null;
		return {
			prompt: 'Segui ogni tag di apertura fino al suo tag di chiusura.',
			problem: 'In uno di questi frammenti HTML i tag non sono chiusi o annidati correttamente. Quale?',
			solution: `Il frammento con l'errore: ${ERRORS[kind]}.`,
			steps: ['In un frammento scritto bene ogni tag di apertura ha il suo tag di chiusura, con la barra e lo stesso nome.', 'Un elemento aperto dentro un altro si chiude prima di quello che lo contiene.', `Qui l'errore è questo: ${ERRORS[kind]}.`],
			solutionListing: wrong,
			answer: choose(
				rng,
				listingOption(wrong),
				rights.map((text) => listingOption(text))
			),
			params: { case: 'sbagliato', outer, inner, phrase: phrases[0], errors: [kind] }
		};
	});
}
const ERRORS: Record<string, string> = {
	accavallati: 'i due elementi si accavallano, perché quello interno è chiuso dopo quello esterno',
	'non chiuso': 'l’elemento interno non viene mai chiuso',
	'senza barra': 'il tag che dovrebbe chiudere l’elemento interno non ha la barra',
	'nome diverso': 'il tag di chiusura ha un nome diverso da quello di apertura',
	'barra in fondo': 'nel tag di chiusura la barra è in fondo, e va subito dopo <',
	'esterno non chiuso': 'il tag che dovrebbe chiudere l’elemento esterno non ha la barra'
};

// ---------------------------------------------------------------------------
// Level 3: the tree of a fragment

const MEMBERS: [string, string][] = [
	['Sara', 'voce'],
	['Leo', 'batteria'],
	['Marta', 'chitarra'],
	['Dario', 'basso']
];
const number = (n: number): ChoiceOption => textOption(String(n));
const numbers = (rng: Rng, right: number, wrong: number[]) =>
	choose(
		rng,
		number(right),
		[...wrong, right + 1, right + 2, right + 3].filter((n) => n >= 0 && n !== right).map(number)
	);

function level3(rng: Rng): CodeBuilt {
	const roll = rng.next();
	return fitting(rng, (rng) => {
		const built = list3(rng, roll);
		return widest(built.listing ?? '') > 42 ? null : built;
	});
}

function list3(rng: Rng, roll: number): CodeBuilt {
	const n = rng.int(2, 4);
	const members = shuffle(rng, MEMBERS).slice(0, n);
	const list = 'ul';
	// which items have an element inside, and which one
	const inline: ('em' | 'strong' | null)[] = members.map(() => (chance(rng, 0.5) ? rng.pick(['em', 'strong'] as const) : null));
	if (!inline.some((x) => x !== null)) inline[rng.int(0, n - 1)] = rng.pick(['em', 'strong'] as const);
	const rows = members.map(([name, part], i) => (inline[i] ? `  <li>${name}, <${inline[i]}>${part}</${inline[i]}></li>` : `  <li>${name}, ${part}</li>`));
	const listing = `<${list}>\n${rows.join('\n')}\n</${list}>\n`;
	const inside = inline.filter(Boolean).length;
	const total = 1 + n + inside;
	const params = { list, members, inline };
	if (roll < 0.35) {
		const answer = numbers(rng, n, [n + inside, total, 2 * n, n - 1, 1]);
		return {
			prompt: 'Conta solo gli elementi che stanno direttamente dentro.',
			problem: `Nel frammento HTML qui sotto, quanti figli ha l'elemento ${list}?`,
			listing,
			solution: rightLabel(answer),
			steps: [`I figli di ${list} sono gli elementi aperti direttamente dentro di lui: i ${n} elementi li.`, `Gli elementi dentro un li (${inside === 1 ? 'ce n’è uno' : `ce ne sono ${inside}`}) sono figli di quel li, non di ${list}.`],
			answer,
			params: { case: 'figli', ...params }
		};
	}
	if (roll < 0.7) {
		const answer = numbers(rng, total, [2 * total, n, n + 1, n + inside, 1 + inside]);
		return {
			prompt: 'Conta un elemento per ogni coppia di tag.',
			problem: 'Nel frammento HTML qui sotto, quanti elementi ci sono in tutto?',
			listing,
			solution: rightLabel(answer),
			steps: [`C'è un elemento ${list}, con dentro ${n} elementi li.`, `Dentro i li ${inside === 1 ? 'c’è un altro elemento' : `ci sono altri ${inside} elementi`}: in tutto 1 + ${n} + ${inside} = ${total}.`, 'Un tag di apertura e il suo tag di chiusura fanno un elemento solo, non due.'],
			answer,
			params: { case: 'elementi', ...params }
		};
	}
	// the parent of an inline element, or of an item
	const which = rng.int(0, n - 1);
	const child = inline[which] && chance(rng, 0.75) ? inline[which]! : 'li';
	const parent = child === 'li' ? list : 'li';
	const where = child === 'li' ? `dell'elemento li con ${members[which][0]}` : `dell'elemento ${child} con la parola ${members[which][1]}`;
	const tag = (name: string) => textOption(name);
	const answer = choose(rng, tag(parent), shuffle(rng, [list, 'li', 'em', 'strong', 'body', 'p']).map(tag));
	return {
		prompt: 'Cerca l’elemento che lo contiene direttamente.',
		problem: `Nel frammento HTML qui sotto, qual è il genitore ${where}?`,
		listing,
		solution: rightLabel(answer),
		steps: [child === 'li' ? `Ogni li è aperto e chiuso tra <${list}> e </${list}>: il suo genitore è ${list}.` : `L'elemento ${child} è aperto e chiuso dentro un li: il suo genitore è quel li.`, 'Il genitore è l’elemento che contiene direttamente: non quello ancora più esterno.'],
		answer,
		params: { case: 'genitore', ...params, which, child }
	};
}

// ---------------------------------------------------------------------------
// Level 4: structure against appearance, a marked text against an instruction

const STRUCTURE = ['Questa riga è il titolo della pagina.', 'Queste tre righe sono le voci di un elenco.', 'Questo blocco di testo è un paragrafo.', 'Questa frase è un link alla pagina dei concerti.', 'Questa riga è il titolo di una sezione.', 'Queste parole sono una citazione.', 'Questa parola è il nome di chi ha scritto la pagina.'];
const LOOK = ['Questa riga è in grassetto.', 'Questa riga è scritta in rosso.', 'Questa riga è centrata.', 'Questa riga ha corpo 32.', 'Questa frase è in un font senza grazie.', 'Queste parole sono sottolineate.', 'Questo blocco ha un margine di due centimetri.', 'Questa parola è scritta più grande delle altre.'];
const INSTRUCTIONS = ['x = x + 1', 'print(somma)', 'if voto >= 6:', 'while i < n:', 'cout << media;', 'n = int(input())', 'totale = a * b', 'for i in range(5):'];
const MARKED = ['<p>Somma: 12</p>', '# Risultati', '<li>voto: 6</li>', '*importante*', '<h1>x = x + 1</h1>', '<em>if</em>', '**print**', '- while i < n', '<p>totale = 30</p>', '<strong>for</strong>'];

function level4(rng: Rng): CodeBuilt {
	const roll = rng.next();
	if (roll < 0.5) {
		const structure = roll < 0.3;
		const [from, others] = structure ? [STRUCTURE, LOOK] : [LOOK, STRUCTURE];
		const right = rng.pick(from);
		const wrong = shuffle(rng, others).slice(0, 3);
		const answer = choose(
			rng,
			textOption(right),
			wrong.map((text) => textOption(text))
		);
		return {
			prompt: 'Chiediti se la frase dice che cos’è il testo o come viene mostrato.',
			problem: structure ? 'Quale di queste frasi descrive la struttura di un testo, e non il suo aspetto?' : 'Quale di queste frasi descrive l’aspetto di un testo, e non la sua struttura?',
			solution: rightLabel(answer),
			steps: ['La struttura dice che cos’è un pezzo di testo: un titolo, un paragrafo, una voce di un elenco, un link.', 'L’aspetto dice come viene mostrato: colore, grassetto, dimensione, posizione.', 'L’HTML marca la struttura; l’aspetto si decide nel foglio di stile.'],
			answer,
			params: { case: structure ? 'struttura' : 'aspetto', right, wrong }
		};
	}
	const program = roll < 0.8;
	const [from, others] = program ? [INSTRUCTIONS, MARKED] : [MARKED, INSTRUCTIONS];
	const right = rng.pick(from);
	const wrong = shuffle(rng, others).slice(0, 3);
	const answer = choose(
		rng,
		listingOption(right),
		wrong.map((text) => listingOption(text))
	);
	return {
		prompt: 'Chiediti se la riga dice che cosa fare o che cosa c’è.',
		problem: program ? 'Quale di queste righe è un’istruzione di un linguaggio di programmazione, e non un testo marcato?' : 'Quale di queste righe è un testo marcato, e non un’istruzione di un linguaggio di programmazione?',
		solution: `${right}: ${program ? 'è un’istruzione, che il computer esegue' : 'è un testo con i suoi marcatori, che il computer legge e mostra'}.`,
		steps: ['Un’istruzione dice al computer che cosa fare: assegnare un valore, scrivere, scegliere, ripetere.', 'Un testo marcato dice che cosa c’è: del testo, e attorno i marcatori (i tag dell’HTML, il cancelletto, gli asterischi e il trattino del Markdown).', 'Un testo che parla di un programma, chiuso tra due tag, resta un testo: nessuno lo esegue.'],
		solutionListing: `${right}\n`,
		answer,
		params: { case: program ? 'istruzione' : 'marcato', right, wrong }
	};
}

// ---------------------------------------------------------------------------
// Level 5: Markdown and HTML

const TITLES = ['Concerti', 'La scaletta', 'Chi siamo', 'Prove aperte', 'Il gruppo', 'Contatti', 'Le foto', 'Sabato sera'];
const WORDS = ['rock', 'gratis', 'sabato', 'oggi', 'tutti', 'subito', 'forte', 'piano'];
const ITEMS = ['voce', 'basso', 'batteria', 'chitarra', 'tastiere', 'sax', 'tromba', 'cori'];

function level5(rng: Rng): CodeBuilt {
	const kind = rng.pick(['titolo', 'evidenza', 'importante', 'elenco'] as const);
	const toHtml = chance(rng, 0.65);
	let markdown: string, html: string, wrongHtml: string[], wrongMarkdown: string[], why: string;
	if (kind === 'titolo') {
		const title = rng.pick(TITLES);
		markdown = `# ${title}`;
		html = `<h1>${title}</h1>`;
		wrongHtml = [`<#>${title}</#>`, `<p># ${title}</p>`, `<li>${title}</li>`, `<em>${title}</em>`, `<strong>${title}</strong>`];
		wrongMarkdown = [`*${title}*`, `- ${title}`, `**${title}**`, `<# ${title}>`, `${title} #`];
		why = 'In Markdown il cancelletto a inizio riga marca un titolo, che in HTML è un elemento h1.';
	} else if (kind === 'evidenza' || kind === 'importante') {
		const word = rng.pick(WORDS);
		const [mark, tag, otherMark, otherTag] = kind === 'evidenza' ? ['*', 'em', '**', 'strong'] : ['**', 'strong', '*', 'em'];
		markdown = `${mark}${word}${mark}`;
		html = `<${tag}>${word}</${tag}>`;
		wrongHtml = [`<${otherTag}>${word}</${otherTag}>`, `<h1>${word}</h1>`, `<li>${word}</li>`, `<${mark}>${word}</${mark}>`, `<${tag}>${word}<${tag}>`];
		wrongMarkdown = [`${otherMark}${word}${otherMark}`, `# ${word}`, `- ${word}`, `${mark}${word}`, `<${word}>`];
		why = 'In Markdown un asterisco per parte mette in evidenza, come em; due asterischi per parte marcano un testo importante, come strong.';
	} else {
		const [a, b] = shuffle(rng, ITEMS);
		const list = (outer: string, inner: string) => `<${outer}>\n  <${inner}>${a}</${inner}>\n  <${inner}>${b}</${inner}>\n</${outer}>`;
		markdown = `- ${a}\n- ${b}`;
		html = list('ul', 'li');
		wrongHtml = [`<li>${a}</li>\n<li>${b}</li>`, `<ul>\n  ${a}\n  ${b}\n</ul>`, list('ul', 'p'), list('li', 'ul'), `<p>- ${a}</p>\n<p>- ${b}</p>`];
		wrongMarkdown = [`* ${a} *\n* ${b} *`, `# ${a}\n# ${b}`, `- ${a} - ${b}`, `*${a}*\n*${b}*`, `**${a}**\n**${b}**`];
		why = 'In Markdown ogni riga che comincia con il trattino è una voce di un elenco: in HTML un li per voce, tutti dentro ul.';
	}
	const [shown, right, wrong] = toHtml ? [markdown, html, wrongHtml] : [html, markdown, wrongMarkdown];
	const answer = choose(
		rng,
		listingOption(right),
		shuffle(rng, wrong).map((text) => listingOption(text))
	);
	return {
		prompt: toHtml ? 'Riconosci il segno del Markdown e cerca il suo elemento.' : 'Riconosci l’elemento e cerca il suo segno in Markdown.',
		problem: toHtml ? 'Qui sotto c’è un testo in Markdown. Quale frammento HTML gli corrisponde?' : 'Qui sotto c’è un frammento HTML. Quale testo in Markdown gli corrisponde?',
		listing: `${shown}\n`,
		solution: 'Il frammento che marca la stessa struttura con i segni dell’altro linguaggio.',
		steps: [why, 'I due linguaggi marcano la stessa struttura con segni diversi: l’albero degli elementi è lo stesso.'],
		solutionListing: `${right}\n`,
		answer,
		params: { case: kind, to: toHtml ? 'html' : 'markdown', markdown, html }
	};
}

const worded = (sample: { params: Record<string, unknown> }) => (sample.params.program ? ['a level of fragments has no program'] : []);

export default makeCodeGenerator(ID, 'I linguaggi di markup', {
	1: { label: 'Le parti di un elemento', constraints: ['one element with one attribute', 'opening tag, closing tag, content, name or value of the attribute, name of the element'], build: level1, check: worded },
	2: { label: 'Tag chiusi e annidati', constraints: ['an element inside another', 'one fragment well formed among three that are not, or the other way round'], build: level2, check: worded },
	3: { label: 'L’albero degli elementi', constraints: ['a list of two to four items, some with an element inside', 'children, parent, or number of elements'], build: level3, check: worded },
	4: { label: 'Struttura, aspetto e istruzioni', constraints: ['structure against appearance', 'a marked text against an instruction of a program'], build: level4, check: worded },
	5: { label: 'Da Markdown a HTML', constraints: ['a title, an emphasis, a strong text or a list of two items', 'from Markdown to HTML or back'], build: level5, check: worded }
});
