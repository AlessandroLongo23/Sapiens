/**
 * Exercises for "Il DOM e gli eventi" (informatica, third year). Spec: specs/exercises/inf-dom-eventi.md
 *
 * 1. which element a selector takes, null, or how many; 2. what a script changes in the page (textContent,
 * classList); 3. what the page shows after some clicks (a counter, a limit, a class); 4. how a listener is
 * registered; 5. elements created with createElement and attached with append.
 *
 * Every level is a multiple choice. The page and its script are text: the right answer is worked out here from the
 * parameters, and the independent check builds the page, runs the script and fires the events on its own.
 */
import type { ChoiceOption, Rng } from '../types';
import { choose, listingOption, makeCodeGenerator, printedOption, shuffle, textOption, type CodeBuilt } from '../inf-codice';
import { classesOption, classSets, sayClasses as ordered, declare, drawn, fragments, listen, pick, register, rows, select, selectAll, shown, SONGS, weighted } from '../inf-g14-web';

export const ID = 'inf-dom-eventi';

const DEFER = 'Lo script è collegato alla pagina con defer: parte quando la pagina è stata costruita tutta.';
const times = (k: number) => `${k} ${k === 1 ? 'volta' : 'volte'}`;
const songs = (rng: Rng, n: number) => shuffle(rng, SONGS).slice(0, n);

// ------------------------------------------------------------------ level 1

/** An element of the small page of level 1, in the order of the document. */
interface Node {
	tag: string;
	id?: string;
	classes: string[];
	text: string;
	/** Whether it is inside the list. */
	inside: boolean;
}

const sayNode = (n: Node) => (n.tag === 'ul' ? `l'elemento ul con id ${n.id}` : `l'elemento ${n.tag} con il testo ${n.text}`);
const nodeOption = (n: Node) => textOption(sayNode(n), n.tag === 'ul' ? `ul#${n.id}` : `${n.tag}:${n.text}`);
const NOTHING = textOption('null', 'null');
const ALL = textOption('tutti gli elementi che corrispondono, insieme', 'tutti');

/** The elements a selector of these pages takes: a tag, a class or an id, alone or inside the list. */
function matching(nodes: Node[], selector: string): Node[] {
	const parts = selector.split(' ');
	const one = (n: Node, part: string) => (part[0] === '.' ? n.classes.includes(part.slice(1)) : part[0] === '#' ? n.id === part.slice(1) : n.tag === part);
	const list = nodes.find((n) => n.tag === 'ul')!;
	if (parts.length === 1) return nodes.filter((n) => one(n, parts[0]));
	return one(list, parts[0]) ? nodes.filter((n) => n.inside && one(n, parts[1])) : [];
}

const LISTS = ['scaletta', 'brani', 'elenco'] as const;
const CLASSES = ['bis', 'lento', 'nuovo', 'rock'] as const;
const NOTES = ['Sabato in palestra', 'Ingresso libero', 'Si comincia alle 21', 'Porta un amico'] as const;
const TYPOS: Record<string, string> = { scaletta: 'scalleta', brani: 'brano', elenco: 'elenchi' };

/** How a selector is read, for the steps. */
function reading(selector: string, list: string, cls: string): string {
	const parts = selector.split(' ');
	const one = (part: string) =>
		part[0] === '.'
			? `.${part.slice(1)} sceglie per classe: gli elementi che hanno ${part.slice(1)} tra le loro classi`
			: part[0] === '#'
				? `#${part.slice(1)} sceglie per id: l'elemento che ha id="${part.slice(1)}"`
				: part === list || part === cls
					? `${part}, senza cancelletto e senza punto, è il nome di un tag: gli elementi <${part}>, che nella pagina non ci sono`
					: `${part}, senza cancelletto e senza punto, sceglie per tag: gli elementi <${part}>`;
	if (parts.length === 1) return `Il selettore ${one(parts[0])}.`;
	return `Lo spazio nel selettore vuol dire "dentro": prima ${one(parts[0])}; poi, tra quelli che stanno dentro, ${one(parts[1])}.`;
}

function level1(rng: Rng, kind: 'primo' | 'null' | 'quanti'): CodeBuilt {
	const list = rng.pick(LISTS);
	const cls = rng.pick(CLASSES);
	const titles = songs(rng, rng.int(3, 4));
	const marked = titles.map(() => rng.int(0, 1) === 1);
	if (!marked.some(Boolean)) marked[rng.int(1, titles.length - 1)] = true;
	const noted = rng.int(0, 1) === 1;
	const note: Node = { tag: 'p', classes: [noted ? cls : 'nota'], text: rng.pick(NOTES), inside: false };
	const head: Node = { tag: 'h1', classes: [], text: 'I Fuori Tempo', inside: false };
	const ul: Node = { tag: 'ul', id: list, classes: [], text: '', inside: false };
	const items: Node[] = titles.map((text, i) => ({ tag: 'li', classes: marked[i] ? [cls] : [], text, inside: true }));
	const nodes = [head, note, ul, ...items];
	const html = rows('<h1>I Fuori Tempo</h1>', `<p class="${note.classes[0]}">${note.text}</p>`, `<ul id="${list}">`, ...items.map((n) => `    <li${n.classes.length ? ` class="${cls}"` : ''}>${n.text}</li>`), '</ul>');
	const firstMarked = nodes.find((n) => n.classes.includes(cls))!;

	if (kind === 'quanti') {
		const selector = rng.int(0, 4) === 0 ? rng.pick([cls, `#${cls}`, `.${list}`]) : rng.pick(['li', `.${cls}`, `#${list} li`, `#${list} .${cls}`, 'p', `ul .${cls}`]);
		const script = rows(selectAll('voci', selector), 'console.log(voci.length);');
		const count = matching(nodes, selector).length;
		const numbers = [count === 1 ? 2 : 1, items.length, matching(nodes, `.${cls}`).length, matching(nodes, `ul .${cls}`).length, 0, count + 1, nodes.length];
		return {
			prompt: "Leggi il selettore un pezzo alla volta e conta gli elementi dell'HTML che gli corrispondono.",
			problem: 'Sopra il nome del file c\'è un pezzo della pagina, sotto il suo script. Che cosa scrive la console?',
			listing: shown(html, script),
			solution: String(count),
			steps: [reading(selector, list, cls), `querySelectorAll restituisce tutti gli elementi che corrispondono, e length dice quanti sono: ${count}.`],
			answer: pick(
				rng,
				textOption(String(count)),
				numbers.map((n) => textOption(String(n)))
			),
			params: { case: kind, selector, html, script }
		};
	}

	const [selector, expected, slip] =
		kind === 'primo'
			? [rng.pick(['li', `.${cls}`, `#${list} li`, `#${list} .${cls}`, 'p', `ul .${cls}`, `#${list}`, 'ul']), undefined, '']
			: rng.pick<[string, Node, string]>([
					[list, ul, `Nella pagina ${list} è un id: davanti ci voleva il cancelletto.`],
					[cls, firstMarked, `Nella pagina ${cls} è una classe: davanti ci voleva il punto.`],
					[`#${cls}`, firstMarked, `Nella pagina ${cls} è una classe, non un id: ci voleva il punto.`],
					[`.${list}`, ul, `Nella pagina ${list} è un id, non una classe: ci voleva il cancelletto.`],
					[`#${list} p`, note, "Il paragrafo sta fuori dall'elenco, non dentro."],
					['h2', head, 'Nella pagina il titolo è un h1: di h2 non ce ne sono.'],
					[`#${TYPOS[list]}`, ul, `Nella pagina l'id è ${list}: nel selettore il nome è scritto in modo diverso.`],
					[`#${list} #${cls}`, items.find((n) => n.classes.length)!, `Nella pagina ${cls} è una classe, non un id: ci voleva il punto.`]
				]);
	const found = matching(nodes, selector);
	const script = rows(declare('scelto', 'document.querySelector', `"${selector}"`));
	const right = found.length ? nodeOption(found[0]) : NOTHING;
	const others: ChoiceOption[] = [];
	if (found.length > 1) others.push(nodeOption(found[found.length - 1]), ALL);
	if (expected) others.push(nodeOption(expected));
	others.push(...shuffle(rng, [found.length ? NOTHING : ALL, nodeOption(items[0]), nodeOption(items[items.length - 1]), nodeOption(note), nodeOption(ul)]));
	return {
		prompt: "Leggi il selettore un pezzo alla volta, poi scorri l'HTML dall'alto.",
		problem: "Sopra il nome del file c'è un pezzo della pagina, sotto il suo script. Che cosa c'è nella costante scelto?",
		listing: shown(html, script),
		solution: found.length ? `${sayNode(found[0])[0].toUpperCase()}${sayNode(found[0]).slice(1)}.` : 'null: nessun elemento corrisponde al selettore.',
		steps: [
			reading(selector, list, cls),
			found.length
				? `querySelector restituisce un elemento solo, il primo che corrisponde scorrendo la pagina dall'alto: ${sayNode(found[0])}.`
				: `${slip} Nessun elemento corrisponde, e querySelector restituisce null: alla prima riga che prova a usare quell'elemento lo script si fermerebbe con un errore.`
		],
		answer: pick(rng, right, others),
		params: { case: kind, selector, html, script }
	};
}

// ------------------------------------------------------------------ level 2

type Method = 'add' | 'remove' | 'toggle';
const METHODS: readonly Method[] = ['add', 'remove', 'toggle'];

function apply(classes: string[], method: Method, name: string): string[] {
	const has = classes.includes(name);
	if (method === 'add') return has ? classes : [...classes, name];
	if (method === 'remove') return classes.filter((c) => c !== name);
	return has ? classes.filter((c) => c !== name) : [...classes, name];
}

const sayClasses = (given: string[], order: string[]) => {
	const said = ordered(given, order);
	return said.length === 0 ? 'nessuna classe' : said.length === 1 ? `la classe ${said[0]}` : `le classi ${said.join(' e ')}`;
};

function sayOp(before: string[], method: Method, name: string): string {
	const has = before.includes(name);
	if (method === 'add') return has ? `add("${name}") non cambia niente, perché ${name} c'è già` : `add("${name}") aggiunge ${name}`;
	if (method === 'remove') return has ? `remove("${name}") toglie ${name}` : `remove("${name}") non cambia niente, perché ${name} non c'è`;
	return has ? `toggle("${name}") toglie ${name}, perché c'è` : `toggle("${name}") aggiunge ${name}, perché non c'è`;
}

function classes(rng: Rng): CodeBuilt {
	const base = 'brano';
	const extra = rng.pick(['bis', 'top'] as const);
	const titles = songs(rng, 3);
	const initial = titles.map(() => (rng.int(0, 1) === 1 ? [base, extra] : [base]));
	const target = rng.int(0, 2);
	const other = (target + rng.int(1, 2)) % 3;
	const op = () => ({ method: rng.pick(METHODS), name: rng.pick([base, extra, extra]) });
	const order = [base, extra];
	let mine = [op(), op()];
	// two rows that are not the same row twice, and at least one of them changes something
	const idle = (ops: typeof mine) => {
		const middle = apply(initial[target], ops[0].method, ops[0].name);
		return (ops[0].method === ops[1].method && ops[0].name === ops[1].name) || (middle.length === initial[target].length && apply(middle, ops[1].method, ops[1].name).length === middle.length);
	};
	while (idle(mine)) mine = [op(), op()];
	const ops = [
		{ index: target, ...mine[0] },
		{ index: target, ...mine[1] }
	];
	ops.splice(rng.int(0, 2), 0, { index: other, ...op() });
	const html = rows('<ul id="scaletta">', ...titles.map((t, i) => `    <li class="${initial[i].join(' ')}">${t}</li>`), '</ul>');
	const script = rows(selectAll('brani', 'li'), ...ops.map((o) => `brani[${o.index}].classList.${o.method}("${o.name}");`));
	const middle = apply(initial[target], mine[0].method, mine[0].name);
	const final = apply(middle, mine[1].method, mine[1].name);
	const key = (c: string[]) => [...c].sort().join(' ');
	return {
		prompt: 'Trova le righe che toccano quella voce e seguile in ordine.',
		problem: `${DEFER} Alla fine, quali classi ha la voce ${titles[target]}?`,
		listing: shown(html, script),
		solution: `${sayClasses(final, order)[0].toUpperCase()}${sayClasses(final, order).slice(1)}.`,
		steps: [
			`Gli indici partono da 0: brani[${target}] è la voce ${titles[target]}, che all'inizio ha ${sayClasses(initial[target], order)}. La riga con brani[${other}] riguarda un'altra voce.`,
			`Prima ${sayOp(initial[target], mine[0].method, mine[0].name)}; poi ${sayOp(middle, mine[1].method, mine[1].name)}.`,
			final.length ? `Alla fine la voce ha ${sayClasses(final, order)}.` : 'Alla fine la voce non ha più nessuna classe.'
		],
		answer: choose(
			rng,
			classesOption(final, order),
			classSets(base, extra)
				.filter((c) => key(c) !== key(final))
				.map((c) => classesOption(c, order))
		),
		params: { case: 'classi', html, script, read: { what: 'classes', selector: 'li', index: target } }
	};
}

function replacing(rng: Rng): CodeBuilt {
	const n = rng.int(3, 4);
	const all = songs(rng, n + 1);
	const titles = all.slice(0, n);
	const fresh = all[n];
	const index = rng.int(1, n - 1);
	const html = rows('<ul id="scaletta">', ...titles.map((t) => `    <li>${t}</li>`), '</ul>');
	const script = rows(selectAll('brani', 'li'), `brani[${index}].textContent = "${fresh}";`);
	const put = (i: number) => titles.map((t, k) => (k === i ? fresh : t));
	const right = put(index);
	return {
		prompt: 'Conta le voci a partire da 0.',
		problem: `${DEFER} Com'è l'elenco nella pagina alla fine?`,
		listing: shown(html, script),
		solution: right.join(', '),
		steps: [
			`brani contiene le ${n} voci dell'elenco, in ordine, e gli indici partono da 0: brani[${index}] è la voce ${titles[index]}, non ${titles[index - 1]}.`,
			`Assegnare un testo a textContent sostituisce il testo dell'elemento: al posto di ${titles[index]} si legge ${fresh}. Le altre voci non cambiano, e non se ne aggiunge nessuna.`
		],
		answer: pick(rng, printedOption(right), [printedOption(put(index - 1)), printedOption([...titles, fresh]), printedOption(titles), ...(index + 1 < n ? [printedOption(put(index + 1))] : []), printedOption([fresh, ...titles])]),
		params: { case: 'sostituisce', html, script, read: { what: 'list', selector: 'li' } }
	};
}

function counting(rng: Rng): CodeBuilt {
	const n = rng.int(3, 4);
	const titles = songs(rng, n);
	const marked = titles.map(() => rng.int(0, 1) === 1);
	if (marked.every(Boolean)) marked[rng.int(0, n - 1)] = false;
	if (!marked.some(Boolean)) marked[rng.int(0, n - 1)] = true;
	const selector = rng.pick(['li', '.bis', '#scaletta li', '#scaletta .bis', '.bis']);
	const label = selector.includes('.bis') ? 'Bis' : 'Brani';
	const html = rows(`<p>${label}: <span id="quanti">?</span></p>`, '<ul id="scaletta">', ...titles.map((t, i) => `    <li${marked[i] ? ' class="bis"' : ''}>${t}</li>`), '</ul>');
	const script = rows(selectAll('brani', selector), select('quanti', '#quanti'), 'quanti.textContent = brani.length;');
	const bis = marked.filter(Boolean).length;
	const count = selector.includes('.bis') ? bis : n;
	return {
		prompt: 'Conta gli elementi che corrispondono al selettore.',
		problem: `${DEFER} Che cosa si legge nella pagina dopo "${label}:"?`,
		listing: shown(html, script),
		solution: String(count),
		steps: [
			`querySelectorAll("${selector}") restituisce ${selector.includes('.bis') ? 'le voci che hanno la classe bis' : "tutte le voci dell'elenco"}: sono ${count}, e brani.length vale ${count}.`,
			`L'ultima riga mette quel numero nell'elemento con id quanti, al posto del punto interrogativo. Il file HTML resta com'era: cambia la pagina che vedi.`
		],
		answer: pick(
			rng,
			textOption(String(count)),
			[count === n ? bis : n, '?', count + 1, count - 1, 'brani.length'].map((x) => textOption(String(x)))
		),
		params: { case: 'conta', html, script, read: { what: 'text', selector: '#quanti' } }
	};
}

const level2 = (rng: Rng, kind: 'classi' | 'sostituisce' | 'conta') => (kind === 'classi' ? classes(rng) : kind === 'sostituisce' ? replacing(rng) : counting(rng));

// ------------------------------------------------------------------ level 3

function counter(rng: Rng, limited: boolean): CodeBuilt {
	const t = limited
		? rng.pick([
				{ button: 'piu', label: 'Uno in più', out: 'biglietti', n: 'n', fn: 'aggiungi', up: true },
				{ button: 'meno', label: 'Uno in meno', out: 'biglietti', n: 'n', fn: 'togli', up: false }
			])
		: rng.pick([
				{ button: 'vota', label: 'Mi piace', out: 'voti', n: 'quanti', fn: 'vota', up: true },
				{ button: 'piu', label: 'Aggiungi', out: 'biglietti', n: 'n', fn: 'aggiungi', up: true }
			]);
	let start: number;
	let step = 1;
	let k: number;
	let limit = 0;
	let right: number;
	let others: number[];
	let body: string[];
	if (!limited) {
		start = rng.pick([0, 0, 5, 10]);
		step = rng.pick([1, 1, 2, 5]);
		k = rng.int(2, 6);
		right = start + step * k;
		others = [start + step * (k - 1), k, start + step, step * k, start + step * (k + 1), start, start + k];
		body = [`    ${t.n} = ${t.n} + ${step};`];
	} else if (t.up) {
		start = rng.int(0, 2);
		limit = rng.int(3, 5);
		k = rng.int(0, 1) === 0 ? rng.int(limit - start + 1, limit - start + 3) : rng.int(1, limit - start);
		right = Math.min(start + k, limit);
		others = [start + k, limit, limit + 1, k, right - 1, limit - 1, start];
		body = [`    if (${t.n} < ${limit}) {`, `        ${t.n} = ${t.n} + 1;`, '    }'];
	} else {
		start = rng.int(2, 5);
		k = rng.int(0, 1) === 0 ? rng.int(start + 1, start + 3) : rng.int(1, start);
		right = Math.max(start - k, 0);
		others = [start - k, 0, start, k, 1, right + 1, k - start];
		body = [`    if (${t.n} > 0) {`, `        ${t.n} = ${t.n} - 1;`, '    }'];
	}
	const html = rows(`<button id="${t.button}">${t.label}</button>`, `<p id="${t.out}">${start}</p>`);
	const script = rows(select(t.out, `#${t.out}`), `let ${t.n} = ${start};`, '', `function ${t.fn}() {`, ...body, `    ${t.out}.textContent = ${t.n};`, '}', '', listen(`#${t.button}`, 'click', t.fn));
	const bound = limited && right !== (t.up ? start + k : start - k);
	return {
		prompt: 'Segui la variabile un clic alla volta.',
		problem: `${DEFER} Premi il bottone ${times(k)}. Che cosa si legge nell'elemento con id ${t.out}?`,
		listing: shown(html, script),
		solution: String(right),
		steps: [
			`Lo script registra ${t.fn} sul clic del bottone e finisce. La variabile ${t.n} sta fuori dalla funzione, quindi il suo valore resta tra un clic e il successivo.`,
			limited
				? `A ogni clic ${t.n} ${t.up ? 'cresce' : 'cala'} di 1, ma solo finché la condizione ${t.up ? `${t.n} < ${limit}` : `${t.n} > 0`} è vera: ${bound ? `arrivata a ${right} non cambia più, e gli altri clic la lasciano com'è` : `dopo ${k} clic vale ${right}, e la condizione non ha ancora fermato nessun clic`}.`
				: `A ogni clic ${t.n} cresce di ${step}: da ${start}, dopo ${k} clic, vale ${start === 0 ? '' : `${start} + `}${step} * ${k} = ${right}.`,
			`L'ultima riga della funzione scrive ${t.n} nella pagina: si legge ${right}.`
		],
		answer: pick(
			rng,
			textOption(String(right)),
			others.map((n) => textOption(String(n)))
		),
		params: { case: limited ? 'limite' : 'conta', html, script, clicks: { selector: `#${t.button}`, times: k }, read: { what: 'text', selector: `#${t.out}` } }
	};
}

function hiding(rng: Rng): CodeBuilt {
	const method = weighted(rng, { toggle: 3, remove: 1, add: 1 });
	const initial = rng.int(0, 2) === 0 ? ['brani'] : ['brani', 'nascosto'];
	const k = rng.int(1, 5);
	const html = rows('<button id="mostra">Scaletta</button>', `<ul id="scaletta" class="${initial.join(' ')}">`, `    <li>${rng.pick(SONGS)}</li>`, '</ul>');
	const script = rows(select('scaletta', '#scaletta'), '', 'function mostra() {', `    scaletta.classList.${method}("nascosto");`, '}', '', listen('#mostra', 'click', 'mostra'));
	let final = initial;
	for (let i = 0; i < k; i++) final = apply(final, method, 'nascosto');
	const key = (c: string[]) => [...c].sort().join(' ');
	const hidden = initial.includes('nascosto');
	const order = ['brani', 'nascosto'];
	return {
		prompt: 'Segui le classi dell\'elenco un clic alla volta.',
		problem: `${DEFER} Premi il bottone ${times(k)}. Alla fine, quali classi ha l'elenco con id scaletta?`,
		listing: shown(html, script),
		solution: `${sayClasses(final, order)[0].toUpperCase()}${sayClasses(final, order).slice(1)}.`,
		steps: [
			`All'inizio l'elenco ha ${sayClasses(initial, order)}. A ogni clic il browser chiama mostra, che lavora solo sulla classe nascosto: brani resta dov'è.`,
			method === 'toggle'
				? `toggle toglie nascosto se c'è e la aggiunge se non c'è: a ogni clic la situazione si rovescia. Dopo un numero ${k % 2 ? 'dispari' : 'pari'} di clic nascosto ${hidden === (k % 2 === 0) ? "c'è" : "non c'è"}.`
				: method === 'remove'
					? hidden
						? 'remove toglie nascosto al primo clic; i clic successivi non cambiano niente.'
						: "remove non cambia niente, perché nascosto non c'è: nemmeno dopo più clic."
					: hidden
						? "add non cambia niente, perché nascosto c'è già: nemmeno dopo più clic."
						: 'add aggiunge nascosto al primo clic; i clic successivi non cambiano niente.',
			final.length ? `Alla fine l'elenco ha ${sayClasses(final, order)}.` : "Alla fine l'elenco non ha più nessuna classe."
		],
		answer: choose(
			rng,
			classesOption(final, order),
			classSets('brani', 'nascosto')
				.filter((c) => key(c) !== key(final))
				.map((c) => classesOption(c, order))
		),
		params: { case: 'classe', method, html, script, clicks: { selector: '#mostra', times: k }, read: { what: 'classes', selector: '#scaletta', index: 0 } }
	};
}

const level3 = (rng: Rng, kind: 'conta' | 'limite' | 'classe') => (kind === 'classe' ? hiding(rng) : counter(rng, kind === 'limite'));

// ------------------------------------------------------------------ level 4

interface Setup {
	id: string;
	html: string;
	element: 'bottone' | 'campo';
	event: 'click' | 'input';
	fn: string;
	typo: string;
}

const button = (id: string, label: string, fn: string, typo: string): Setup => ({ id, html: `<button id="${id}">${label}</button>`, element: 'bottone', event: 'click', fn, typo });
const input = (id: string, fn: string, typo: string): Setup => ({ id, html: `<input id="${id}">`, element: 'campo', event: 'input', fn, typo });

const SETUPS: Setup[] = [
	button('mostra', 'Scaletta', 'mostra', 'mostro'),
	button('mostra', 'Scaletta', 'apri', 'mostro'),
	button('vota', 'Mi piace', 'vota', 'voto'),
	button('vota', 'Mi piace', 'conta', 'voto'),
	button('bis', 'Un bis', 'aggiungi', 'biss'),
	button('bis', 'Un bis', 'chiedi', 'biss'),
	button('chiudi', 'Chiudi', 'chiudi', 'chiude'),
	button('chiudi', 'Chiudi', 'ferma', 'chiude'),
	button('piu', 'Uno in più', 'aggiungi', 'pui'),
	button('meno', 'Uno in meno', 'togli', 'memo'),
	button('entra', 'Entra', 'entra', 'entro'),
	button('entra', 'Entra', 'prossimo', 'entro'),
	input('nome', 'aggiorna', 'nomi'),
	input('nome', 'controlla', 'nomi'),
	input('email', 'aggiorna', 'emial'),
	input('email', 'controlla', 'emial'),
	input('posti', 'aggiorna', 'posto'),
	input('posti', 'ricalcola', 'posto')
];

const fnBody = (fn: string) => [`function ${fn}() {`, '    console.log("chiamata");', '}'];

function which(rng: Rng): CodeBuilt {
	const s = rng.pick(SETUPS);
	const script = rows(select(s.element, `#${s.id}`), '', ...fnBody(s.fn));
	const ev = `"${s.event}"`;
	const right = register(s.element, ev, s.fn);
	const wrong = shuffle(rng, [
		{ kind: 'parentesi', text: register(s.element, ev, `${s.fn}()`) },
		{ kind: 'scambiati', text: register(s.element, s.fn, ev) },
		{ kind: 'on', text: register(s.element, `"on${s.event}"`, s.fn) },
		{ kind: 'virgolette', text: register(s.element, ev, `"${s.fn}"`) },
		{ kind: 'rovescio', text: register(s.fn, ev, s.element) }
	]).slice(0, 3);
	return {
		prompt: 'Guarda su che cosa è chiamata addEventListener e i suoi due argomenti, in ordine.',
		problem: `${DEFER} Quale istruzione, aggiunta in fondo allo script, fa chiamare ${s.fn} ${s.event === 'click' ? 'a ogni clic sul bottone' : 'ogni volta che qualcuno scrive un carattere nel campo'}?`,
		listing: shown(s.html, script),
		solution: `L'istruzione con ${s.element}.addEventListener, il nome dell'evento "${s.event}" e poi ${s.fn}, senza parentesi.`,
		steps: [
			`addEventListener si chiama sull'elemento che riceve l'evento, qui ${s.element}. Il primo argomento è il nome dell'evento tra virgolette, "${s.event}", senza "on" davanti.`,
			`Il secondo argomento è la funzione, scritta con il solo nome: ${s.fn}. Con le parentesi, ${s.fn}(), verrebbe chiamata subito, una volta, e al browser non arriverebbe una funzione; tra virgolette sarebbe un testo.`
		],
		solutionListing: rows(right),
		answer: choose(
			rng,
			listingOption(right),
			wrong.map((w) => listingOption(w.text))
		),
		params: { case: 'quale', html: s.html, script, event: { selector: `#${s.id}`, type: s.event }, fn: s.fn, wrong: wrong.map((w) => w.kind) }
	};
}

type Outcome = 'funziona' | 'subito' | 'errore' | 'mai';

function happens(rng: Rng, outcome: Outcome): CodeBuilt {
	const s = rng.pick(SETUPS);
	const slip = rng.pick(['senza-cancelletto', 'nome-diverso', 'punto'] as const);
	const selector = outcome !== 'errore' ? `#${s.id}` : slip === 'senza-cancelletto' ? s.id : slip === 'punto' ? `.${s.id}` : `#${s.typo}`;
	const script = rows(...fnBody(s.fn), '', select(s.element, selector), register(s.element, `"${outcome === 'mai' ? 'on' : ''}${s.event}"`, outcome === 'subito' ? `${s.fn}()` : s.fn));
	const click = s.event === 'click';
	const options: Record<Outcome, ChoiceOption> = {
		funziona: textOption(click ? `A ogni clic sul bottone viene chiamata ${s.fn}.` : `A ogni carattere scritto nel campo viene chiamata ${s.fn}.`, 'funziona'),
		subito: textOption(`${s.fn} viene chiamata subito, una volta sola; poi ${click ? 'il bottone' : 'il campo'} non fa niente.`, 'subito'),
		errore: textOption(`Lo script si ferma con un errore, e ${s.fn} non viene mai chiamata.`, 'errore'),
		mai: textOption(`Non c'è nessun errore, ma ${s.fn} non viene mai chiamata.`, 'mai')
	};
	const steps: Record<Outcome, string[]> = {
		funziona: [
			`querySelector("#${s.id}") trova ${click ? 'il bottone' : 'il campo'}, perché l'id nell'HTML è proprio ${s.id}.`,
			`addEventListener riceve il nome dell'evento, "${s.event}", e la funzione ${s.fn} senza parentesi: il browser la chiamerà a ogni ${click ? 'clic' : 'carattere scritto'}.`
		],
		subito: [
			`Con le parentesi, ${s.fn}() chiama la funzione subito, mentre lo script parte: è lì che viene eseguita, una volta.`,
			`Ad addEventListener arriva il valore che ${s.fn} restituisce, che non è una funzione: non c'è nessun errore, ma al browser non resta niente da chiamare.`
		],
		errore: [
			slip === 'senza-cancelletto'
				? `Nel selettore manca il cancelletto: "${s.id}" cerca un tag con quel nome, che nella pagina non c'è.`
				: slip === 'punto'
					? `Il selettore ".${s.id}" cerca una classe, ma nell'HTML ${s.id} è un id: ci voleva il cancelletto.`
					: `Il selettore cerca l'id ${s.typo}, ma nell'HTML l'id è ${s.id}: il nome è scritto in modo diverso.`,
			`querySelector restituisce null, e la riga dopo prova a chiamare addEventListener su null: lo script si ferma con l'errore "Cannot read properties of null", prima di registrare la funzione.`
		],
		mai: [`Il nome dell'evento è "${s.event}", senza "on" davanti. Per il browser "on${s.event}" è il nome di un altro evento, che non succede mai.`, `La registrazione riesce, senza errori, ma nessun ${click ? 'clic' : 'carattere scritto'} farà chiamare ${s.fn}.`]
	};
	const all: Outcome[] = ['funziona', 'subito', 'errore', 'mai'];
	return {
		prompt: 'Controlla il selettore, il nome dell\'evento e come è scritta la funzione.',
		problem: `${DEFER} Poi ${click ? 'premi il bottone due volte' : 'scrivi due caratteri nel campo'}: che cosa succede?`,
		listing: shown(s.html, script),
		solution: options[outcome].latex,
		steps: steps[outcome],
		answer: choose(
			rng,
			options[outcome],
			all.filter((o) => o !== outcome).map((o) => options[o])
		),
		params: { case: outcome, html: s.html, script, event: { selector: `#${s.id}`, type: s.event }, fn: s.fn, ...(outcome === 'errore' ? { slip } : {}) }
	};
}

function level4(rng: Rng): CodeBuilt {
	const kind = weighted(rng, { quale: 8, funziona: 3, subito: 3, errore: 3, mai: 3 });
	return kind === 'quale' ? which(rng) : happens(rng, kind);
}

// ------------------------------------------------------------------ level 5

function level5(rng: Rng, kind: 'ciclo' | 'clic' | 'senza'): CodeBuilt {
	const looped = kind === 'ciclo' || (kind === 'senza' && rng.int(0, 1) === 0);
	const attached = kind !== 'senza';
	const prefix = rng.pick(['Bis ', 'Brano ', 'Extra '] as const);
	const list = looped ? rng.pick(['scaletta', 'brani'] as const) : 'brani';
	const m = looped ? rng.int(1, 3) : rng.int(0, 1);
	const ask = m === 0 || rng.int(0, 1) === 0 ? 'quanti' : 'ultimo';
	const titles = songs(rng, m);
	const create = ['const voce =', '    document.createElement("li");'];
	let html: string;
	let script: string;
	let added: number;
	let last: number;
	let counterName: string;
	let clicks: { selector: string; times: number } | undefined;
	let how: string;
	if (looped) {
		const from = rng.int(0, 1);
		added = rng.int(2, 4);
		last = from + added - 1;
		counterName = 'i';
		html = rows(`<ul id="${list}">`, ...titles.map((t) => `    <li>${t}</li>`), '</ul>');
		script = rows(select(list, `#${list}`), `for (let i = ${from}; i ${from === 1 ? `<= ${last}` : `< ${last + 1}`}; i++) {`, ...create.map((r) => `    ${r}`), `    voce.textContent = "${prefix}" + i;`, attached && `    ${list}.append(voce);`, '}');
		how = `Il ciclo fa ${added} giri, con i che vale ${Array.from({ length: added }, (_, j) => from + j).join(', ')}`;
	} else {
		added = rng.int(2, 5);
		last = added;
		counterName = 'n';
		clicks = { selector: '#bis', times: added };
		html = rows(m ? `<ul id="${list}"><li>${titles[0]}</li></ul>` : `<ul id="${list}"></ul>`, '<button id="bis">Un bis</button>');
		script = rows(select(list, `#${list}`), 'let n = 0;', '', 'function aggiungi() {', '    n = n + 1;', ...create.map((r) => `    ${r}`), `    voce.textContent = "${prefix}" + n;`, attached && `    ${list}.append(voce);`, '}', '', listen('#bis', 'click', 'aggiungi'));
		how = `A ogni clic il browser chiama aggiungi: in ${added} clic n arriva a ${added}`;
	}
	const count = attached ? m + added : m;
	const lastText = attached ? `${prefix}${last}` : titles[m - 1];
	const right = ask === 'quanti' ? textOption(String(count)) : textOption(lastText);
	const others =
		ask === 'quanti'
			? [attached ? added : m + added, attached ? m : added, m + added + 1, m + added - 1, 0, 1, m + 1].map((n) => textOption(String(n)))
			: [attached ? titles[m - 1] : `${prefix}${last}`, `${prefix}${last - 1}`, `${prefix}${last + 1}`, `${prefix}${counterName}`, prefix.trim(), ...(m > 1 ? [titles[0]] : [])].map((t) => textOption(t));
	const before = `${clicks ? `Premi il bottone ${times(clicks.times)}. ` : ''}`;
	return {
		prompt: 'Cerca nello script i tre passi: creare la voce, darle un testo, attaccarla.',
		problem: `${DEFER} ${before}Alla fine, ${ask === 'quanti' ? "quante voci ha l'elenco nella pagina?" : "qual è il testo dell'ultima voce dell'elenco nella pagina?"}`,
		listing: shown(html, script),
		solution: ask === 'quanti' ? String(count) : lastText,
		steps: attached
			? [
					`createElement crea una voce nuova, ancora staccata dalla pagina; textContent le dà il testo; ${list}.append la attacca in fondo all'elenco, e solo allora si vede.`,
					`${how}. Le voci nuove sono ${added}, e l'ultima ha il testo "${prefix}${last}", perché + attacca il numero al testo.`,
					ask !== 'quanti' ? `L'ultima voce dell'elenco è quindi ${lastText}.` : m === 0 ? `Nell'HTML l'elenco è vuoto: alla fine le voci sono ${count}.` : `Con ${m === 1 ? 'la voce già scritta' : `le ${m} voci già scritte`} nell'HTML fanno ${m} + ${added} = ${count}.`
				]
			: [
					`createElement crea ogni volta una voce nuova e textContent le dà il testo, ma nello script manca la riga con append: nessuno attacca le voci all'elenco.`,
					`Una voce creata e non attaccata resta fuori dall'albero della pagina, e non si vede. ${ask === 'quanti' ? `L'elenco ha ancora ${m === 0 ? 'zero voci' : m === 1 ? "la sola voce scritta nell'HTML" : `le ${m} voci scritte nell'HTML`}.` : `L'ultima voce resta ${lastText}.`}`
				],
		answer: pick(rng, right, others),
		params: { case: kind, ask, html, script, ...(clicks ? { clicks } : {}), read: { what: ask === 'quanti' ? 'count' : 'last', selector: `#${list} li` } }
	};
}

export default makeCodeGenerator(ID, 'Il DOM e gli eventi', {
	1: { label: 'Quale elemento prende il selettore', constraints: ['a page of six or seven elements', 'querySelector with a selector of tag, class, id or descendant', 'querySelectorAll and length'], build: drawn(['primo', 'primo', 'primo', 'primo', 'primo', 'primo', 'primo', 'primo', 'null', 'null', 'null', 'null', 'null', 'quanti', 'quanti', 'quanti', 'quanti', 'quanti', 'quanti', 'quanti'] as const, level1), check: fragments },
	2: { label: 'Che cosa cambia nella pagina', constraints: ['a list of three or four items', 'textContent or classList, run once'], build: drawn(['classi', 'classi', 'sostituisce', 'conta'] as const, level2), check: fragments },
	3: { label: 'Dopo il clic', constraints: ['one listener of click', 'a counter, a counter with a limit, or a class', 'from 1 to 7 clicks'], build: drawn(['conta', 'conta', 'conta', 'limite', 'limite', 'limite', 'limite', 'classe', 'classe', 'classe'] as const, level3), check: fragments },
	4: { label: 'Registrare un ascoltatore', constraints: ['which instruction registers the function', 'or what a registration written with one mistake does'], build: level4, check: fragments },
	5: { label: 'Creare elementi', constraints: ['createElement, textContent and append in a loop or at each click', 'the case without append'], build: drawn(['ciclo', 'ciclo', 'ciclo', 'ciclo', 'ciclo', 'ciclo', 'ciclo', 'clic', 'clic', 'clic', 'clic', 'clic', 'clic', 'clic', 'senza', 'senza', 'senza', 'senza', 'senza', 'senza'] as const, level5), check: fragments }
});
