/**
 * Regole e selettori CSS. Spec: specs/exercises/inf-css-regole.md
 *
 * Five levels from the lesson (docs/lezioni/informatica/riscritte/92-inf-css-regole.md), all multiple choice on real
 * fragments of HTML and CSS: writing a rule, counting what a selector takes, choosing the selector for some
 * elements, the colour a text inherits, and the rule that wins the cascade. What a selector takes and which rule
 * wins come from the functions the figures of the lesson use (src/lib/informatica/css.ts); the independent check
 * reads the fragments again by itself.
 */
import type { Rng } from '../types';
import { choose, listingOption, makeCodeGenerator, shuffle, textOption, type CodeBuilt } from '../inf-codice';
import { cascata, presi, type Nodo, type Regola } from '../../../informatica/css';

export const ID = 'inf-css-regole';

const COLOURS = ['red', 'navy', 'teal', 'crimson', 'purple', 'green', 'orange', 'gray', 'maroon', 'olive'] as const;
const CLASSES = ['nota', 'avviso', 'prossimo', 'data', 'firma', 'nuovo'] as const;
const SHORT_CLASSES = ['nota', 'data', 'firma', 'nuovo'] as const;
const IDS = ['date', 'elenco', 'tappe', 'scaletta'] as const;
const SHORT_IDS = ['primo', 'testa', 'guida'] as const;

const few = <T>(rng: Rng, xs: readonly T[], n: number): T[] => shuffle(rng, xs).slice(0, n);

// ---------------------------------------------------------------------------
// Level 1: writing a rule

const SELECTORS = ['h1', 'h2', 'p', 'li', 'body', 'nav a', '.nota', '.avviso', '#date', '.prossimo'] as const;
const SIZES = ['14px', '18px', '20px', '24px'] as const;

/** What a rule must do, the declaration that does it, and declarations a student writes in its place. */
function effect(rng: Rng) {
	const colour = rng.pick(COLOURS);
	const size = rng.pick(SIZES);
	const number = size.slice(0, -2);
	return rng.pick([
		{ id: 'testo', what: `scrive il testo in colore ${colour}`, right: `color: ${colour}`, wrong: [`background-color: ${colour}`, `font-color: ${colour}`, `text-color: ${colour}`, `colour: ${colour}`], why: `Il colore del testo è la proprietà color. background-color colora lo sfondo; font-color, text-color e colour non esistono, e il browser le salta.` },
		{ id: 'sfondo', what: `dà uno sfondo di colore ${colour}`, right: `background-color: ${colour}`, wrong: [`color: ${colour}`, `back-color: ${colour}`, `font-color: ${colour}`, `text-align: ${colour}`], why: `Lo sfondo è la proprietà background-color. color cambia il colore del testo; le altre due non sono proprietà che danno uno sfondo.` },
		{ id: 'grassetto', what: 'scrive il testo in grassetto', right: 'font-weight: bold', wrong: ['font-size: bold', 'text-align: bold', 'font-family: bold', 'color: bold'], why: 'Lo spessore delle lettere è la proprietà font-weight, con il valore bold. Le altre proprietà esistono, ma bold non è un loro valore: il browser salta la dichiarazione.' },
		{ id: 'centro', what: 'mette il testo al centro della riga', right: 'text-align: center', wrong: ['font-align: center', 'align: center', 'font-weight: center', 'text-center: on'], why: 'L’allineamento delle righe è la proprietà text-align, con il valore center. font-align, align e text-center non esistono; font-weight è lo spessore delle lettere.' },
		{ id: 'grandezza', what: `scrive il testo grande ${number} pixel`, right: `font-size: ${size}`, wrong: [`font-size: ${number}`, `font-size: ${number} px`, `font-weight: ${size}`, `text-size: ${size}`], why: `La grandezza del testo è la proprietà font-size, e il valore porta l’unità attaccata al numero: ${size}. Senza unità, o con uno spazio prima di px, la dichiarazione viene saltata.` }
	]);
}

const rule = (selector: string, ...declarations: string[]) => `${selector} {\n${declarations.map((d) => `  ${d};\n`).join('')}}\n`;

function level1(rng: Rng): CodeBuilt {
	const selector = rng.pick(SELECTORS);
	if (rng.next() < 0.5) {
		const e = effect(rng);
		const right = rule(selector, e.right);
		return {
			prompt: 'Guarda il nome della proprietà e come è scritto il valore.',
			problem: `Quale regola ${e.what} negli elementi presi dal selettore "${selector}"?`,
			solution: `La regola con la dichiarazione ${e.right};`,
			steps: [e.why, 'Una dichiarazione che il browser non capisce non dà errori: non succede niente, e l’elemento resta com’era.'],
			solutionListing: right,
			answer: choose(rng, listingOption(right), few(rng, e.wrong, 3).map((d) => listingOption(rule(selector, d)))),
			params: { case: 'effetto', effect: e.id, selector, declaration: e.right }
		};
	}
	// the same rule written well once and with one mistake of syntax in each of the others
	const colour = rng.pick(COLOURS);
	const [first, second] = few(rng, [`color: ${colour}`, `font-size: ${rng.pick(SIZES)}`, 'font-weight: bold', 'text-align: center', `background-color: ${rng.pick(COLOURS.filter((c) => c !== colour))}`], 2);
	const right = rule(selector, first, second);
	const wrong = [
		`${selector} {\n  ${first.replace(':', '')};\n  ${second.replace(':', '')};\n}\n`,
		`${selector} {\n  ${first.replace(':', ' =')};\n  ${second.replace(':', ' =')};\n}\n`,
		`${selector} (\n  ${first};\n  ${second};\n)\n`,
		`${selector} {\n  ${first}\n  ${second};\n}\n`,
		`${selector}\n  ${first};\n  ${second};\n`,
		`${selector} {\n  ${first},\n  ${second},\n}\n`
	];
	return {
		prompt: 'Controlla un segno alla volta: graffe, due punti, punto e virgola.',
		problem: 'Quale di queste regole CSS è scritta bene?',
		solution: 'La regola con le dichiarazioni tra parentesi graffe, i due punti tra proprietà e valore e il punto e virgola alla fine di ogni dichiarazione.',
		steps: [
			'Le dichiarazioni stanno tra parentesi graffe, dopo il selettore.',
			'In ogni dichiarazione tra la proprietà e il valore ci sono i due punti, e alla fine il punto e virgola: senza, il browser attacca la riga a quella dopo e le salta tutte e due.',
			'Il browser non segnala nessuno di questi errori: la regola scritta male non ha effetto.'
		],
		solutionListing: right,
		answer: choose(rng, listingOption(right), few(rng, wrong, 3).map((text) => listingOption(text))),
		params: { case: 'scritta', selector, declarations: [first, second] }
	};
}

// ---------------------------------------------------------------------------
// The small page of levels 2 and 3

const open = (n: Nodo) => `<${n.tag}${n.id ? ` id="${n.id}"` : ''}${n.classi?.length ? ` class="${n.classi.join(' ')}"` : ''}>`;
const inline = (n: Nodo): string => `${open(n)}${n.testo ?? ''}${(n.figli ?? []).map((c) => `${n.testo ? ' ' : ''}${inline(c)}`).join('')}</${n.tag}>`;
/** The rows of an element as it is written in a page: one row when it holds text, its children indented otherwise. */
function rows(n: Nodo, indent = 0): string[] {
	const pad = ' '.repeat(indent);
	if (!n.figli || n.testo !== undefined) return [pad + inline(n)];
	return [pad + open(n), ...n.figli.flatMap((c) => rows(c, indent + 2)), `${pad}</${n.tag}>`];
}
const listing = (root: Nodo) => (root.figli ?? []).flatMap((c) => rows(c)).join('\n') + '\n';

interface Page {
	root: Nodo;
	name: string; // the class
	id: string; // the id of the list
}

/** A page with a menu, one or two paragraphs and a list: the class is on a paragraph, on some items, or on both. */
function page(rng: Rng, both = false): Page {
	const name = rng.pick(CLASSES);
	const id = rng.pick(IDS);
	const links = few(rng, ['Home', 'Foto', 'Date', 'Video', 'Contatti'], rng.int(2, 3)).map((testo): Nodo => ({ tag: 'a', testo }));
	const onParagraph = both || rng.next() < 0.5;
	const items = rng.int(2, 3);
	const marked = both ? rng.int(1, 2) : onParagraph ? rng.int(0, 2) : rng.int(1, 2);
	const texts = few(rng, ['Ingresso libero', 'Porta un amico', 'Posti limitati', 'Si parte alle 9'], 2);
	const paragraphs: Nodo[] = [{ tag: 'p', ...(onParagraph ? { classi: [name] } : {}), testo: texts[0] }];
	if (both || rng.next() < 0.6) paragraphs.push({ tag: 'p', testo: 'Vedi', figli: [{ tag: 'a', testo: 'la mappa' }] });
	const dates = few(rng, ['12 dicembre', '20 gennaio', '7 marzo', '4 aprile'], items);
	const list: Nodo = { tag: 'ul', id, figli: dates.map((testo, i): Nodo => ({ tag: 'li', ...(i < marked ? { classi: [name] } : {}), testo })) };
	if (list.figli && marked) list.figli = shuffle(rng, list.figli);
	const main: Nodo = { tag: 'main', figli: rng.next() < 0.5 ? [...paragraphs, list] : [list, ...paragraphs] };
	return { root: { tag: 'body', figli: [{ tag: 'nav', figli: links }, main] }, name, id };
}

const taken = (root: Nodo, selector: string) => presi(root, selector);

// ---------------------------------------------------------------------------
// Level 2: how many elements a selector takes

function level2(rng: Rng): CodeBuilt {
	const { root, name, id } = page(rng);
	const draw = rng.next();
	const kind = draw < 0.2 ? 'elemento' : draw < 0.45 ? 'classe' : draw < 0.8 ? 'discendente' : 'niente';
	const selector =
		kind === 'elemento' ? rng.pick(['a', 'li', 'p']) : kind === 'classe' ? `.${name}` : kind === 'discendente' ? rng.pick(['nav a', 'main a', 'main p', `#${id} li`, 'ul li', `main .${name}`, `ul .${name}`]) : rng.pick([name, `#${name}`, `.${id}`, id]);
	const right = taken(root, selector).length;
	const count = (s: string) => taken(root, s).length;
	// what a student counts who reads the selector in another way, then the numbers nearby
	const last = selector.split(' ').pop()!;
	const meant = selector.includes(name) ? count(`.${name}`) : 1; // the elements the student meant to take
	const misread = kind === 'niente' ? [meant, meant + 1] : [count(last), count(selector.split(' ')[0]), count(last.replace(/^[.#]/, ''))];
	const others = [...misread, right + 1, right - 1, right + 2, right + 3].filter((n) => n >= 0 && n !== right);
	const why =
		kind === 'elemento'
			? `Il nome da solo prende tutti gli elementi <${selector}> della pagina, dovunque siano: sono ${right}.`
			: kind === 'classe'
				? `Il punto vuol dire classe: contano gli elementi con class="${name}", di qualunque tipo. Sono ${right}.`
				: kind === 'discendente'
					? `Lo spazio vuol dire "dentro": si contano gli elementi presi dall'ultima parte, "${last}", ma solo quelli che stanno dentro un elemento preso dalla prima. ${right === 0 ? 'Non ce ne sono.' : right === 1 ? 'Ce n’è uno.' : `Sono ${right}.`}`
					: selector.startsWith('#')
						? `Il cancelletto cerca un id, e nella pagina ${name} è una classe: nessun elemento ha id="${name}".`
						: selector.startsWith('.')
							? `Il punto cerca una classe, e nella pagina ${id} è un id: nessun elemento ha class="${id}".`
							: `Senza punto e senza cancelletto il selettore è il nome di un elemento, e nella pagina non c’è nessun elemento <${selector}>.`;
	return {
		prompt: 'Leggi il selettore un pezzo alla volta e conta gli elementi nella pagina.',
		problem: `Quanti elementi di questa pagina prende il selettore "${selector}"?`,
		listing: listing(root),
		solution: right === 0 ? 'Nessuno.' : `${right}.`,
		steps: [why, kind === 'niente' ? 'Una regola con questo selettore è scritta bene ma non si applica a niente, e il browser non lo segnala.' : 'Un nome è un elemento, un punto una classe, un cancelletto un id.'],
		answer: choose(rng, textOption(String(right)), others.map((n) => textOption(String(n)))),
		params: { case: kind, selector, count: right, page: listing(root) }
	};
}

// ---------------------------------------------------------------------------
// Level 3: the selector that takes some elements and no others

function level3(rng: Rng): CodeBuilt {
	const { root, name, id } = page(rng, true);
	const target = rng.pick([
		{ id: 'menu', what: 'i link del menu, cioè quelli dentro nav, e nessun altro elemento', right: 'nav a', wrong: ['a', 'nav', 'nav, a', 'a nav', 'main a', '.nav a'], why: 'I link sono elementi a, e quelli del menu stanno dentro nav: lo spazio tra i due nomi vuol dire "dentro". Il selettore a da solo prenderebbe anche il link dentro main.' },
		{ id: 'link-main', what: 'il link che sta dentro main, e nessun altro elemento', right: 'main a', wrong: ['a', 'main', 'main, a', 'a main', 'nav a', 'p'], why: 'Il link è un elemento a dentro main: "main a". Con la virgola, "main, a" prende main e tutti i link; "a main" cerca un main dentro un link.' },
		{ id: 'classe', what: `tutti gli elementi con la classe ${name}, e nessun altro`, right: `.${name}`, wrong: [name, `#${name}`, `ul .${name}`, 'p', 'li', `main ${name}`], why: `Una classe si sceglie con il punto: ".${name}" prende ogni elemento con class="${name}", di qualunque tipo. Senza punto cerca un elemento <${name}>, con il cancelletto un id.` },
		{ id: 'id', what: `l'elemento con id ${id}, e nessun altro`, right: `#${id}`, wrong: [`.${id}`, id, `#${id} li`, 'li', `ul ${id}`, 'main'], why: `Un id si sceglie con il cancelletto: "#${id}". Con il punto si cerca una classe; "#${id} li" prende le voci che stanno dentro l'elemento, non l'elemento.` },
		{ id: 'classe-dentro', what: `le voci dell'elenco con la classe ${name}, ma non il paragrafo con la stessa classe`, right: `ul .${name}`, wrong: [`.${name}`, 'ul li', `ul, .${name}`, `.${name} ul`, 'li', `ul ${name}`], why: `Servono gli elementi con class="${name}" che stanno dentro l'elenco: "ul .${name}". Da solo ".${name}" prende anche il paragrafo; "ul li" prende tutte le voci, anche quelle senza la classe.` }
	]);
	const wanted = taken(root, target.right).join(',');
	const kept = shuffle(rng, target.wrong).filter((s) => taken(root, s).join(',') !== wanted);
	return {
		prompt: 'Per ogni selettore, segna nella pagina gli elementi che prende.',
		problem: `Quale selettore prende ${target.what}?`,
		listing: listing(root),
		solution: `Il selettore ${target.right}`,
		steps: [target.why, 'Un selettore sbagliato non dà errori: prende altri elementi, oppure nessuno.'],
		solutionListing: `${target.right}\n`,
		answer: choose(rng, listingOption(target.right), kept.map((s) => listingOption(s))),
		params: { case: target.id, class: name, id, page: listing(root) }
	};
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: a piece of page, its style sheet, and the colour of one text

const sheet = (rules: readonly Regola[]) => rules.map((r) => `${r.selettore} { color: ${r.valore}; }`).join('\n') + '\n';

/** The colour of the text of the last element of the path: the value of the rule that wins, or the browser's black. */
function colourOf(rules: readonly Regola[], path: readonly Nodo[]): string {
	const won = cascata(rules, path).vince;
	return won < 0 ? 'black' : rules[won].valore;
}

function colourOptions(rng: Rng, right: string, rules: readonly Regola[]) {
	const inSheet = rules.map((r) => r.valore);
	const others = [...shuffle(rng, inSheet), 'black', ...shuffle(rng, COLOURS.filter((c) => !inSheet.includes(c)))].filter((c) => c !== right);
	return choose(rng, textOption(right), others.map((c) => textOption(c)));
}

function level4(rng: Rng): CodeBuilt {
	const name = rng.pick(SHORT_CLASSES);
	const id = rng.pick(SHORT_IDS);
	const [a, b, c] = few(rng, COLOURS, 3);
	const draw = rng.next();
	const kind = draw < 0.4 ? 'eredita' : draw < 0.8 ? 'diretta' : 'nessuna';
	const [first, second] = few(rng, ['Sabato', 'Domenica', 'Venerdì', 'Giovedì'], 2);
	const target: Nodo = { tag: 'li', testo: first };
	const other: Nodo = { tag: 'li', ...(kind === 'nessuna' ? { classi: [name] } : {}), testo: second };
	const list: Nodo = { tag: 'ul', figli: kind === 'nessuna' && rng.next() < 0.5 ? [other, target] : [target, other] };
	const main: Nodo = { tag: 'main', ...(kind === 'diretta' ? { id } : {}), figli: [{ tag: 'h2', testo: 'Concerti' }, list] };
	let rules: Regola[];
	let why: string[];
	if (kind === 'eredita') {
		const two = rng.next() < 0.6;
		rules = shuffle(rng, [{ selettore: 'main', valore: a }, ...(two ? [{ selettore: 'ul', valore: b }] : []), { selettore: 'h2', valore: c }]);
		why = two
			? [`Nessuna regola prende le voci li: il colore lo ereditano dall'elemento che le contiene.`, `Il più vicino è l'elenco ul, che ha il colore ${b}. Il colore ${a} di main arriva a ul solo se ul non ne ha uno suo; la regola di h2 riguarda il titolo.`]
			: [`Nessuna regola prende le voci li, e nemmeno l'elenco ul: il colore si eredita, da un elemento a quelli che contiene.`, `Il primo elemento sopra la voce che ha un colore è main, con ${a}. La regola di h2 riguarda solo il titolo.`];
	} else if (kind === 'diretta') {
		rules = shuffle(rng, [
			{ selettore: `#${id}`, valore: a },
			{ selettore: 'li', valore: b }
		]);
		if (rng.next() < 0.5) rules.push({ selettore: 'h2', valore: c });
		why = [`La regola con il selettore li prende la voce: il suo colore è ${b}.`, `Il selettore #${id} prende main, non la voce: il colore ${a} alla voce arriverebbe solo per eredità, e un valore ereditato perde contro qualunque regola che prende l'elemento, anche se arriva da un id.`];
	} else {
		rules = shuffle(rng, [
			{ selettore: 'h2', valore: a },
			{ selettore: `.${name}`, valore: b }
		]);
		why = [`Nessuna regola prende la voce "${first}": il selettore .${name} prende l'altra voce, h2 il titolo.`, `Nessuna regola dà un colore a ul o a main, quindi non c'è niente da ereditare: resta il nero del foglio di stile del browser. Il colore di una voce non passa a quella accanto.`];
	}
	const right = colourOf(rules, [{ tag: 'body' }, main, list, target]);
	return {
		prompt: 'Guarda quali regole prendono l’elemento e quali un elemento che lo contiene.',
		problem: `Sopra la riga vuota c'è un pezzo di pagina, sotto il suo foglio di stile. Di che colore è scritto il testo "${first}"?`,
		listing: `${rows(main).join('\n')}\n\n${sheet(rules)}`,
		solution: `${right}.`,
		steps: why,
		answer: colourOptions(rng, right, rules),
		params: { case: kind, text: first, rules: rules.map((r) => [r.selettore, r.valore]) }
	};
}

function level5(rng: Rng): CodeBuilt {
	const name = rng.pick(SHORT_CLASSES);
	const id = rng.pick(SHORT_IDS);
	const [a, b, c] = few(rng, COLOURS, 3);
	const kind = rng.pick(['id', 'classe', 'ordine', 'discendente'] as const);
	const text = rng.pick(['A presto', 'Grazie', 'Ciao']);
	const p: Nodo = { tag: 'p', ...(kind === 'id' ? { id } : {}), ...(kind !== 'discendente' ? { classi: [name] } : {}), testo: text };
	const main: Nodo = { tag: 'main', figli: [p] };
	/** The rule that must not be the last one: otherwise "the last one wins" would give the right answer too. */
	const notLast = (rules: Regola[], selector: string) => {
		const mixed = shuffle(rng, rules);
		const at = mixed.findIndex((r) => r.selettore === selector);
		if (at === mixed.length - 1) [mixed[0], mixed[at]] = [mixed[at], mixed[0]];
		return mixed;
	};
	let rules: Regola[];
	let why: string[];
	if (kind === 'id') {
		rules = notLast([{ selettore: `#${id}`, valore: a }, { selettore: `.${name}`, valore: b }, { selettore: 'p', valore: c }], `#${id}`);
		why = [`Tutte e tre le regole prendono il paragrafo. Si contano gli id dei selettori: #${id} ne ha uno, gli altri nessuno.`, `Vince #${id}, con il colore ${a}, anche se non è l'ultima regola: l'ordine conta solo tra selettori che pesano uguale.`];
	} else if (kind === 'classe') {
		rules = notLast([{ selettore: `.${name}`, valore: a }, { selettore: 'p', valore: b }, { selettore: 'main p', valore: c }], `.${name}`);
		why = [`Nessun selettore ha un id, quindi si contano le classi: .${name} ne ha una, gli altri due nessuna.`, `Vince .${name}, con il colore ${a}. I due nomi di "main p" non bastano: una classe pesa più di qualunque numero di nomi di elemento.`];
	} else if (kind === 'ordine') {
		const twice = rng.pick(['p', `.${name}`]);
		const [early, late] = [{ selettore: twice, valore: a }, { selettore: twice, valore: b }];
		// the third rule is lighter, or only reaches the paragraph by inheritance: wherever it is written, it loses
		const third = { selettore: twice === 'p' ? 'main' : 'p', valore: c };
		const at = rng.int(0, 2);
		rules = [early, late];
		rules.splice(at, 0, third);
		why = [`Le due regole con il selettore ${twice} pesano uguale: tra le due vince quella scritta più in basso, con il colore ${b}.`, twice === 'p' ? `La regola di main non prende il paragrafo: il suo colore sarebbe solo ereditato, e perde contro una regola che prende l'elemento.` : `La regola con p pesa meno, perché una classe batte un nome di elemento: non vince nemmeno se è l'ultima.`];
	} else {
		rules = [...shuffle(rng, [{ selettore: 'main p', valore: a }, { selettore: 'main', valore: c }]), { selettore: 'p', valore: b }];
		why = [`"main p" e "p" prendono tutti e due il paragrafo, senza id e senza classi: si contano i nomi di elemento, due contro uno.`, `Vince "main p", con il colore ${a}, anche se la regola con p è scritta dopo. Il colore di main sarebbe solo ereditato.`];
	}
	const right = colourOf(rules, [{ tag: 'body' }, main, p]);
	return {
		prompt: 'Trova le regole che prendono il paragrafo e decidi quale vince.',
		problem: `Sopra la riga vuota c'è un pezzo di pagina, sotto il suo foglio di stile. Di che colore è scritto il testo "${text}"?`,
		listing: `${rows(main).join('\n')}\n\n${sheet(rules)}`,
		solution: `${right}.`,
		steps: why,
		answer: colourOptions(rng, right, rules),
		params: { case: kind, text, rules: rules.map((r) => [r.selettore, r.valore]) }
	};
}

export default makeCodeGenerator(ID, 'Regole e selettori CSS', {
	1: {
		label: 'Scrivere una regola',
		constraints: ['Half the samples ask for the rule that does something to the text, half for the rule that is written well.', 'Four rules of one or two declarations; the wrong ones have the wrong property, a wrong value or one mistake of syntax.'],
		build: level1
	},
	2: {
		label: 'Che cosa prende un selettore',
		constraints: ['A page of at most 16 rows with a menu, paragraphs and a list; a selector of element, of class, descendant, or one that takes nothing.', 'The answer is the number of elements the selector takes; four different numbers.'],
		build: level2
	},
	3: {
		label: 'Scegliere il selettore',
		constraints: ['The same kind of page, with the class both on a paragraph and on items of the list.', 'Four selectors: only the right one takes the elements asked for and no others.'],
		build: level3
	},
	4: {
		label: 'Il colore ereditato',
		constraints: ['A piece of page and a style sheet of two or three rules with one declaration of colour each.', 'The text asked about is inherited from the nearest ancestor, set by a rule on the element against an inherited one, or left to the browser.'],
		build: level4
	},
	5: {
		label: 'Quale regola vince',
		constraints: ['A paragraph inside main and three rules that give it a colour, directly or by inheritance.', 'The winner is decided by an id, by a class, by the order of two equal selectors, or by the number of element names; it is never just the last rule when the weights differ.'],
		build: level5
	}
});
