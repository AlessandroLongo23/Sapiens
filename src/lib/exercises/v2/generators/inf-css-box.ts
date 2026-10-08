/**
 * Il modello a scatola. Spec: specs/exercises/inf-css-box.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/93-inf-css-box.md), all multiple choice on a real
 * CSS rule: the parts of the box, the short ways of writing them, the width of a box with `content-box` and with
 * `border-box`, the `width` that gives a box of a given size (built backwards), and block and inline elements with
 * the vertical margins that merge. Every number of an answer is worked out again by the independent check from the
 * rule shown.
 */
import type { Rng } from '../types';
import { choose, listingOption, makeCodeGenerator, shuffle, textOption, type CodeBuilt } from '../inf-codice';

export const ID = 'inf-css-box';

const SELECTORS = ['.concerto', '.scheda', '.avviso', '.biglietto', '.riquadro', '#locandina'] as const;
const COLOURS = ['teal', 'navy', 'crimson', 'darkorange', 'gray', 'purple'] as const;
const WIDTHS = [120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 360, 400] as const;
const PADDINGS = [5, 6, 8, 10, 12, 15, 16, 20, 24, 30] as const;
const BORDERS = [1, 2, 3, 4, 5, 6, 8] as const;
const MARGINS = [8, 10, 12, 16, 20, 24, 32, 40] as const;

const rule = (selector: string, declarations: readonly string[]) => `${selector} {\n${declarations.map((d) => `  ${d};\n`).join('')}}\n`;
const px = (n: number) => textOption(`${n} px`, String(n));
/** The numbers that are not the right one, positive and each once, in the order given: the first are the real mistakes. */
const numbers = (right: number, ...others: number[]) => [...new Set(others)].filter((n) => n > 0 && n !== right).map(px);

interface Box {
	selector: string;
	colour: string;
	width: number;
	padding: number;
	border: number;
	margin: number;
}
/** A box whose padding, border and margin are three different numbers. */
function box(rng: Rng): Box {
	for (;;) {
		const b = { selector: rng.pick(SELECTORS), colour: rng.pick(COLOURS), width: rng.pick(WIDTHS), padding: rng.pick(PADDINGS), border: rng.pick(BORDERS), margin: rng.pick(MARGINS) };
		if (new Set([b.padding, b.border, b.margin]).size === 3) return b;
	}
}
const declarations = (b: Box, { margin = true, sizing = '', width = `${b.width}px` } = {}) => [...(sizing ? [`box-sizing: ${sizing}`] : []), `width: ${width}`, `padding: ${b.padding}px`, `border: ${b.border}px solid ${b.colour}`, ...(margin ? [`margin: ${b.margin}px`] : [])];
const numbersOf = (b: Box) => ({ width: b.width, padding: b.padding, border: b.border, margin: b.margin });

// ---------------------------------------------------------------------------
// Level 1: the parts of the box

function level1(rng: Rng): CodeBuilt {
	const b = box(rng);
	const rows = shuffle(rng, declarations(b));
	const listing = rule(b.selector, rows);
	const draw = rng.next();
	if (draw < 0.4) {
		// which declaration to change
		const ask = rng.pick([
			{ id: 'padding', what: 'allontanare il testo dalla cornice', right: 'padding', why: 'Lo spazio tra il contenuto e il bordo è il padding.' },
			{ id: 'margin', what: 'allontanare il riquadro dagli elementi che ha intorno', right: 'margin', why: 'Lo spazio fuori dal bordo, tra il riquadro e gli altri elementi, è il margine.' },
			{ id: 'border', what: 'rendere più spessa la cornice', right: 'border', why: 'La cornice è il bordo: il primo dei suoi tre valori è lo spessore.' }
		]);
		const row = (property: string) => rows.find((d) => d.startsWith(`${property}:`))!;
		return {
			prompt: 'Ricorda l’ordine delle parti: contenuto, padding, bordo, margine.',
			problem: `Quale dichiarazione di questa regola va cambiata per ${ask.what}?`,
			listing,
			solution: `${row(ask.right)};`,
			steps: [ask.why, 'Dal centro verso l’esterno una scatola è fatta di contenuto, padding, bordo e margine; width è la larghezza del contenuto.'],
			answer: choose(rng, listingOption(`${row(ask.right)};`), ['width', 'padding', 'border', 'margin'].filter((p) => p !== ask.right).map((p) => listingOption(`${row(p)};`))),
			params: { case: 'dichiarazione', ask: ask.id, ...numbersOf(b), selector: b.selector }
		};
	}
	const ask = rng.pick([
		{ id: 'padding', what: 'Quanti pixel di spazio ci sono tra il testo e il bordo, su ogni lato?', right: b.padding, why: `Tra il contenuto e il bordo c'è il padding: ${b.padding} px. Il margine sta fuori dal bordo.` },
		{ id: 'margin', what: 'Quanti pixel di spazio restano, su ogni lato, tra il bordo del riquadro e gli elementi vicini?', right: b.margin, why: `Fuori dal bordo c'è il margine: ${b.margin} px. Il padding sta dentro il bordo.` },
		{ id: 'border', what: 'Quanti pixel è spessa la cornice del riquadro?', right: b.border, why: `La cornice è il bordo, e il primo dei suoi tre valori è lo spessore: ${b.border} px.` }
	]);
	return {
		prompt: 'Ricorda l’ordine delle parti: contenuto, padding, bordo, margine.',
		problem: ask.what,
		listing,
		solution: `${ask.right} px.`,
		steps: [ask.why, 'Dal centro verso l’esterno una scatola è fatta di contenuto, padding, bordo e margine.'],
		answer: choose(rng, px(ask.right), numbers(ask.right, b.padding, b.margin, b.border, b.padding + b.margin, b.padding + b.border, b.width)),
		params: { case: 'misura', ask: ask.id, ...numbersOf(b), selector: b.selector }
	};
}

// ---------------------------------------------------------------------------
// Level 2: the short ways of writing

const SIDES = [
	{ id: 'top', name: 'sopra', vertical: true },
	{ id: 'bottom', name: 'sotto', vertical: true },
	{ id: 'left', name: 'a sinistra', vertical: false },
	{ id: 'right', name: 'a destra', vertical: false }
] as const;
const LINES = [
	{ style: 'solid', name: 'una linea continua' },
	{ style: 'dashed', name: 'una linea tratteggiata' },
	{ style: 'dotted', name: 'una linea a puntini' },
	{ style: '', name: 'nessuna linea: il bordo non si vede' }
] as const;

function level2(rng: Rng): CodeBuilt {
	const selector = rng.pick(SELECTORS);
	if (rng.next() < 0.6) {
		const property = rng.pick(['padding', 'margin'] as const);
		const [v, h] = shuffle(rng, property === 'padding' ? PADDINGS : MARGINS).slice(0, 2);
		const side = rng.pick(SIDES);
		const right = side.vertical ? v : h;
		return {
			prompt: 'Guarda in che ordine sono scritti i due valori.',
			problem: `Quanto vale ${property === 'padding' ? 'il padding' : 'il margine'} ${side.name} con questa regola?`,
			listing: rule(selector, [`${property}: ${v}px ${h}px`]),
			solution: `${right} px.`,
			steps: [`Il primo valore, ${v}px, vale per i lati sopra e sotto; il secondo, ${h}px, per i lati a sinistra e a destra.`, `Il lato ${side.name} prende quindi ${right} px.`],
			answer: choose(rng, px(right), numbers(right, side.vertical ? h : v, v + h, 2 * right, Math.abs(v - h), 2 * (side.vertical ? h : v))),
			params: { case: 'due-valori', property, side: side.id, values: [v, h], selector }
		};
	}
	const line = rng.pick(LINES);
	const width = rng.pick(BORDERS);
	const colour = rng.pick(COLOURS);
	const declaration = `border: ${width}px ${line.style ? `${line.style} ` : ''}${colour}`;
	return {
		prompt: 'Leggi i valori del bordo uno alla volta.',
		problem: 'Che cosa disegna il browser intorno all’elemento con questa regola?',
		listing: rule(selector, [declaration]),
		solution: `${line.name[0].toUpperCase()}${line.name.slice(1)}.`,
		steps: line.style
			? [`Dei tre valori del bordo quello in mezzo è lo stile della linea: ${line.style}.`, 'solid è la linea continua, dashed quella tratteggiata, dotted quella a puntini.']
			: ['Tra lo spessore e il colore manca lo stile della linea.', 'Finché non lo scrivi, lo stile è "nessuna linea", e un bordo senza linea non si vede: servono tutti e tre i valori.'],
		answer: choose(rng, textOption(line.name, line.style || 'none'), LINES.filter((l) => l !== line).map((l) => textOption(l.name, l.style || 'none'))),
		params: { case: 'linea', declaration, selector }
	};
}

// ---------------------------------------------------------------------------
// Level 3: how wide a box is, with width on the content

function level3(rng: Rng): CodeBuilt {
	const b = box(rng);
	const edge = b.width + 2 * b.padding + 2 * b.border;
	const all = edge + 2 * b.margin;
	const once = b.width + b.padding + b.border;
	if (rng.next() < 0.6) {
		const noise = rng.next() < 0.5;
		return {
			prompt: 'Fai il conto a partire dalle dichiarazioni della regola.',
			problem: 'Quanto è largo questo riquadro, dal bordo sinistro al bordo destro?',
			listing: rule(b.selector, declarations(b, { margin: noise })),
			solution: `${edge} px.`,
			steps: [
				`width è la larghezza del solo contenuto: ${b.width} px. Padding e bordo si aggiungono su tutti e due i lati.`,
				`$${b.width} + 2 \\cdot ${b.padding} + 2 \\cdot ${b.border} = ${edge}$ pixel.${noise ? ' Il margine sta fuori dal bordo e qui non conta.' : ''}`
			],
			answer: choose(rng, px(edge), numbers(edge, once, b.width, b.width + 2 * b.padding, ...(noise ? [all] : []), b.width + 2 * b.border, once + b.padding)),
			params: { case: 'bordo', ...numbersOf(b), shown: noise ? ['width', 'padding', 'border', 'margin'] : ['width', 'padding', 'border'], selector: b.selector }
		};
	}
	return {
		prompt: 'Fai il conto a partire dalle dichiarazioni della regola.',
		problem: 'Quanto spazio occupa in larghezza questo riquadro, margini compresi?',
		listing: rule(b.selector, declarations(b)),
		solution: `${all} px.`,
		steps: [`Fino al bordo il riquadro è largo $${b.width} + 2 \\cdot ${b.padding} + 2 \\cdot ${b.border} = ${edge}$ pixel.`, `Con i due margini occupa $${edge} + 2 \\cdot ${b.margin} = ${all}$ pixel.`],
		answer: choose(rng, px(all), numbers(all, edge, once + b.margin, b.width + 2 * b.margin, b.width, edge + b.margin)),
		params: { case: 'spazio', ...numbersOf(b), shown: ['width', 'padding', 'border', 'margin'], selector: b.selector }
	};
}

// ---------------------------------------------------------------------------
// Level 4: box-sizing

function level4(rng: Rng): CodeBuilt {
	const b = box(rng);
	const around = 2 * b.padding + 2 * b.border;
	const draw = rng.next();
	const kind = draw < 0.3 ? 'scatola' : draw < 0.7 ? 'contenuto' : 'senza';
	const sizing = kind === 'senza' ? '' : 'border-box';
	const right = kind === 'contenuto' ? b.width - around : b.width;
	return {
		prompt: 'Guarda se nella regola c’è box-sizing: dice che cosa misura width.',
		problem: kind === 'scatola' ? 'Quanto è largo questo riquadro, dal bordo sinistro al bordo destro?' : 'Quanto è largo il contenuto di questo riquadro?',
		listing: rule(b.selector, declarations(b, { margin: false, sizing })),
		solution: `${right} px.`,
		steps:
			kind === 'scatola'
				? [`Con box-sizing: border-box width misura la scatola fino al bordo: padding e bordo ci stanno dentro.`, `Il riquadro è largo ${b.width} px, senza aggiungere niente.`]
				: kind === 'contenuto'
					? [`Con box-sizing: border-box i ${b.width} px di width comprendono padding e bordo, e al contenuto resta quello che avanza.`, `$${b.width} - 2 \\cdot ${b.padding} - 2 \\cdot ${b.border} = ${right}$ pixel.`]
					: ['Nella regola non c’è box-sizing, quindi vale il modo di partenza: width misura il contenuto.', `Il contenuto è largo ${b.width} px; padding e bordo si aggiungono intorno.`],
		answer: choose(rng, px(right), numbers(right, b.width, b.width - around, b.width + around, b.width - b.padding - b.border, b.width + b.padding + b.border)),
		params: { case: kind, ...numbersOf(b), sizing: sizing || 'content-box', selector: b.selector }
	};
}

// ---------------------------------------------------------------------------
// Level 5: the width to write, from the size the box must have

function level5(rng: Rng): CodeBuilt {
	const b = box(rng);
	const around = 2 * b.padding + 2 * b.border;
	const border = rng.next() < 0.3;
	// built backwards: the box must be as wide as a round number, and the width to write follows
	const wanted = rng.pick([200, 240, 260, 300, 320, 360, 400]);
	const answer = border ? wanted : wanted - around;
	const width = (n: number) => textOption(`${n}px`, String(n));
	const others = [...new Set([wanted, wanted - around, wanted - b.padding - b.border, wanted + around, wanted - 2 * b.padding])].filter((n) => n > 0 && n !== answer);
	return {
		prompt: 'Guarda prima che cosa misura width in questa regola.',
		problem: `Il riquadro deve essere largo ${wanted} px dal bordo sinistro al bordo destro. Che valore va scritto al posto del punto interrogativo?`,
		listing: rule(b.selector, declarations(b, { margin: false, sizing: border ? 'border-box' : '', width: '?' })),
		solution: `${answer}px.`,
		steps: border
			? ['Con box-sizing: border-box width misura già la scatola fino al bordo.', `Basta scrivere la larghezza voluta: ${answer}px. Padding e bordo ci stanno dentro.`]
			: [`Senza box-sizing width misura il contenuto, e padding e bordo si aggiungono due volte ciascuno: $2 \\cdot ${b.padding} + 2 \\cdot ${b.border} = ${around}$ pixel.`, `Al contenuto restano $${wanted} - ${around} = ${answer}$ pixel: si scrive ${answer}px.`],
		answer: choose(rng, width(answer), others.map(width)),
		params: { case: border ? 'border-box' : 'content-box', total: wanted, padding: b.padding, border: b.border, selector: b.selector }
	};
}

// ---------------------------------------------------------------------------
// Level 6: block and inline elements, and the vertical margins that merge

const BLOCKS = ['h1', 'h2', 'p', 'ul', 'li', 'div', 'header', 'nav', 'main', 'footer'] as const;
const INLINES = ['a', 'em', 'strong', 'span'] as const;
const tag = (name: string) => listingOption(`<${name}>`, name);

function level6(rng: Rng): CodeBuilt {
	const draw = rng.next();
	if (draw < 0.3) {
		const [a, b] = shuffle(rng, [10, 12, 15, 16, 20, 24, 25, 30, 32, 36, 40, 45, 50]).slice(0, 2);
		const bigger = Math.max(a, b);
		const same = rng.next() < 0.4;
		const [first, second] = same ? ['p', 'p'] : [rng.pick(['h1', 'h2', 'ul'] as const), rng.pick(['p', 'div'] as const)];
		return {
			prompt: 'Guarda quali due margini si incontrano tra i due blocchi.',
			problem: same ? 'Due paragrafi p stanno uno sotto l’altro. Con questa regola, quanti pixel di spazio ci sono tra i due?' : `Un elemento ${second} sta subito sotto un elemento ${first}. Con queste regole, quanti pixel di spazio ci sono tra i due?`,
			listing: same ? rule('p', shuffle(rng, [`margin-bottom: ${a}px`, `margin-top: ${b}px`])) : `${first} { margin-bottom: ${a}px; }\n${second} { margin-top: ${b}px; }\n`,
			solution: `${bigger} px.`,
			steps: [`Tra i due blocchi si incontrano il margine inferiore di quello sopra, ${a} px, e il margine superiore di quello sotto, ${b} px.`, `I due margini si fondono, e resta il più grande: ${bigger} px, non ${a + b}.`],
			answer: choose(rng, px(bigger), numbers(bigger, a + b, Math.min(a, b), Math.abs(a - b), 2 * bigger, 2 * Math.min(a, b))),
			params: { case: 'margini', first, second, bottom: a, top: b }
		};
	}
	if (draw < 0.55) {
		const right = rng.pick(BLOCKS);
		const others = shuffle(rng, INLINES).slice(0, 3);
		return {
			prompt: 'Pensa a come si dispone l’elemento in una pagina senza foglio di stile.',
			problem: 'Quale di questi elementi, senza regole CSS, comincia su una riga nuova e occupa tutta la larghezza disponibile?',
			solution: `<${right}>`,
			steps: [`<${right}> è un elemento di blocco: comincia su una riga nuova e, senza una larghezza, occupa tutta quella disponibile.`, `${others.map((t) => `<${t}>`).join(', ')} sono elementi in linea: stanno dentro la riga di testo, larghi quanto il loro contenuto.`],
			answer: choose(rng, tag(right), others.map(tag)),
			params: { case: 'blocco', tags: [right, ...others] }
		};
	}
	const right = rng.pick(INLINES);
	const others = shuffle(rng, BLOCKS).slice(0, 3);
	const width = rng.pick([120, 160, 200, 240]);
	const onWidth = draw < 0.8;
	return {
		prompt: 'Pensa a come si dispone l’elemento in una pagina senza foglio di stile.',
		problem: onWidth ? `Su quale di questi elementi la dichiarazione width: ${width}px non ha effetto, se display non viene cambiato?` : 'Quale di questi elementi, senza regole CSS, resta dentro la riga di testo, largo quanto il suo contenuto?',
		solution: `<${right}>`,
		steps: [
			`<${right}> è un elemento in linea: sta dentro la riga di testo ed è largo quanto il suo contenuto.${onWidth ? ' Su un elemento in linea width e height non hanno effetto.' : ''}`,
			`${others.map((t) => `<${t}>`).join(', ')} sono elementi di blocco${onWidth ? ', e prendono la larghezza che gli dai' : ': cominciano su una riga nuova'}.`
		],
		answer: choose(rng, tag(right), others.map(tag)),
		params: { case: onWidth ? 'larghezza' : 'linea', tags: [right, ...others], ...(onWidth ? { width } : {}) }
	};
}

export default makeCodeGenerator(ID, 'Il modello a scatola', {
	1: {
		label: 'Le parti della scatola',
		constraints: ['A rule with width, padding, border and margin, the last three different numbers, in any order.', 'The question asks for one of the three measures, or for the declaration to change to get an effect.'],
		build: level1
	},
	2: {
		label: 'Scritture brevi',
		constraints: ['padding or margin with two different values, and the value of one side; or a border and the line it draws, also without a style.'],
		build: level2
	},
	3: {
		label: 'Quanto è larga una scatola',
		constraints: ['width on the content: the width up to the border is width + 2 padding + 2 border, the room taken adds 2 margin.', 'The first wrong number adds padding and border once.'],
		build: level3
	},
	4: {
		label: 'Con border-box',
		constraints: ['The same rule with box-sizing: border-box, or without it: the width up to the border, or the width of the content.'],
		build: level4
	},
	5: {
		label: 'Trovare la width',
		constraints: ['Built backwards: the box must be a given number of pixels wide up to the border, and the width to write is asked for.', 'Without box-sizing it is the size less 2 padding and 2 border; with border-box it is the size itself.'],
		build: level5
	},
	6: {
		label: 'Blocchi, righe e margini',
		constraints: ['One block element among three inline ones, or one inline among three blocks; or two blocks one under the other and the space between them, the larger of the two margins.'],
		build: level6
	}
});
