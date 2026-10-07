/**
 * Exercises of the lesson "Pagine responsive e accessibili" (informatica, third year).
 * Spec: specs/exercises/inf-responsive.md
 *
 * 1. relative units, as a count; 2. which rule of a style sheet with media queries holds at a width; 3. the style
 * sheet written from the phone up; 4. the size of an image that adapts; 5. whether a contrast ratio is enough;
 * 6. the fragment an accessible page needs. All multiple choice; the fragments are real HTML and CSS.
 */
import type { Rng } from '../types';
import { choose, listingOption, makeCodeGenerator, shuffle, textOption, type CodeBuilt } from '../inf-codice';

export const ID = 'inf-responsive';

/** Draws the numbers again when they leave fewer than four different options; the case is drawn once, before. */
function drawn<K>(kinds: readonly K[], build: (rng: Rng, kind: K) => CodeBuilt): (rng: Rng) => CodeBuilt {
	return (rng) => {
		const kind = rng.pick(kinds);
		for (let i = 1; ; i++) {
			try {
				return build(rng, kind);
			} catch (e) {
				if (i >= 60) throw e;
			}
		}
	};
}

const css = (selector: string, declarations: readonly string[], indent = '') => `${indent}${selector} {\n${declarations.map((d) => `${indent}  ${d};`).join('\n')}\n${indent}}\n`;
const media = (condition: string, px: number, inner: string) => `@media (${condition}: ${px}px) {\n${inner}}\n`;
const px = (n: number) => textOption(`${n} px`, String(n));
/** The whole pixels among the candidates, positive: a wrong count that gives half a pixel is not offered. */
const whole = (values: number[]) => values.filter((v) => Number.isInteger(v) && v > 0).map(px);
/** 1.5 as CSS writes it, and as the Italian text does. */
const comma = (x: number) => String(x).replace('.', ',');

// ---------------------------------------------------------------- 1. relative units

const UNITS = ['rem', 'em', 'percento', 'vw'] as const;
const TEXTS = [
	{ selector: 'h1', property: 'font-size' },
	{ selector: 'h2', property: 'font-size' },
	{ selector: '.titolo', property: 'font-size' },
	{ selector: 'main', property: 'padding' },
	{ selector: '.scheda', property: 'margin-bottom' },
	{ selector: 'nav', property: 'gap' }
] as const;
const INSIDE = [
	{ outer: '.pagina', inner: '.colonna' },
	{ outer: 'main', inner: '.foto' },
	{ outer: '.contenuto', inner: 'aside' },
	{ outer: '.schede', inner: '.scheda' }
] as const;

function level1(rng: Rng, unit: (typeof UNITS)[number]): CodeBuilt {
	if (unit === 'rem') {
		const { selector, property } = rng.pick(TEXTS);
		const root = rng.pick([16, 16, 20] as const);
		const k = rng.pick([0.5, 0.75, 1.25, 1.5, 2, 2.5, 3] as const);
		const answer = k * root;
		return {
			prompt: 'Un rem è la grandezza del carattere della pagina.',
			problem: `Il carattere della pagina è di ${root} px. Quanti pixel vale ${property} in questa regola?`,
			listing: css(selector, [`${property}: ${k}rem`]),
			solution: `${answer} px.`,
			steps: [`1rem è la grandezza del carattere della pagina, qui ${root} px.`, `${comma(k)} · ${root} = ${answer} px.`],
			answer: choose(rng, px(answer), whole([k * 10, k * 100, k * (root === 16 ? 20 : 16), root + k, root, k * root * 2])),
			params: { case: unit, k, base: root, selector, property }
		};
	}
	if (unit === 'em') {
		const selector = rng.pick(['.bottone', '.avviso', '.etichetta', '.data', 'blockquote'] as const);
		const property = rng.pick(['padding', 'margin-top', 'border-radius'] as const);
		const size = rng.pick([12, 20, 24, 32] as const);
		const k = rng.pick([0.25, 0.5, 0.75, 1.5, 2] as const);
		const answer = k * size;
		return {
			prompt: 'Un em è la grandezza del carattere dell’elemento stesso.',
			problem: `Il carattere della pagina è di 16 px. Quanti pixel vale ${property} in questa regola?`,
			listing: css(selector, [`font-size: ${size}px`, `${property}: ${k}em`]),
			solution: `${answer} px.`,
			steps: [`1em è la grandezza del carattere dell'elemento, che la regola fissa a ${size} px.`, `${comma(k)} · ${size} = ${answer} px.`, 'I 16 px della pagina servirebbero per i rem.'],
			answer: choose(rng, px(answer), whole([k * 16, k * 10, size, k * 100, size + k * 16, answer * 2])),
			params: { case: unit, k, base: size, selector, property }
		};
	}
	const { outer, inner } = rng.pick(INSIDE);
	const percent = rng.pick([20, 25, 40, 50, 60, 75, 80] as const);
	if (unit === 'percento') {
		const width = rng.int(15, 60) * 20;
		const viewport = width + rng.int(2, 12) * 40;
		const answer = (width * percent) / 100;
		return {
			prompt: 'La percentuale si calcola sull’elemento che contiene, non sulla finestra.',
			problem: `Il viewport è largo ${viewport} px e l'elemento ${inner} sta dentro ${outer}. Quanto è largo ${inner}?`,
			listing: css(outer, [`width: ${width}px`]) + css(inner, [`width: ${percent}%`]),
			solution: `${answer} px.`,
			steps: [`Una larghezza in percentuale si riferisce all'elemento che contiene: ${outer}, largo ${width} px.`, `${percent === 80 ? "L'" : 'Il '}${percent}% di ${width} è ${width} · ${percent} : 100 = ${answer} px.`, `La larghezza del viewport qui non entra nel conto.`],
			answer: choose(rng, px(answer), whole([(viewport * percent) / 100, percent, width - percent, width - answer, (width * percent) / 10])),
			params: { case: unit, k: percent, base: width, viewport, outer, inner }
		};
	}
	const viewport = rng.pick([320, 360, 400, 480, 600, 800, 1000, 1200] as const);
	const width = rng.int(5, 14) * 20;
	const answer = (viewport * percent) / 100;
	return {
		prompt: 'Un vw è un centesimo della larghezza del viewport.',
		problem: `Il viewport è largo ${viewport} px e l'elemento ${inner} sta dentro ${outer}. Quanto è largo ${inner}?`,
		listing: css(outer, [`width: ${width}px`]) + css(inner, [`width: ${percent}vw`]),
		solution: `${answer} px.`,
		steps: [`1vw è un centesimo della larghezza del viewport: ${viewport} : 100 = ${comma(viewport / 100)} px.`, `${percent} · ${comma(viewport / 100)} = ${answer} px.`, `La larghezza di ${outer} non entra nel conto: conterebbe con il segno %.`],
		answer: choose(rng, px(answer), whole([(width * percent) / 100, percent, percent * 16, viewport - percent, width])),
		params: { case: unit, k: percent, base: viewport, viewport, width, outer, inner }
	};
}

// ---------------------------------------------------------------- 2. which rule holds

const SIZES = [
	{ selector: 'h1', property: 'font-size', values: [20, 24, 28, 32, 36, 40, 48] },
	{ selector: '.pagina', property: 'padding', values: [8, 12, 16, 24, 32, 40, 48] },
	{ selector: '.schede', property: 'gap', values: [8, 12, 16, 20, 24, 32, 40] },
	{ selector: 'main', property: 'margin', values: [0, 8, 16, 24, 32, 48, 64] }
] as const;
const LIMITS = [480, 600, 720, 800, 900, 1000, 1200] as const;
const HOLDS = ['sotto', 'mezzo', 'sopra', 'limite', 'ordine', 'base-dopo'] as const;

function level2(rng: Rng, kind: (typeof HOLDS)[number]): CodeBuilt {
	const { selector, property, values } = rng.pick(SIZES);
	const at = [0, 1, 2, 3, 4, 5, 6];
	const picked = shuffle(rng, at).slice(0, 4).sort((a, b) => a - b);
	const [v0, v1, v2] = picked.slice(0, 3).map((i) => values[i]);
	const spare = values[picked[3]];
	const i = rng.int(0, LIMITS.length - 2);
	const t1 = LIMITS[i];
	const t2 = LIMITS[rng.int(i + 1, LIMITS.length - 1)];
	const base = css(selector, [`${property}: ${v0}px`]);
	const first = media('min-width', t1, css(selector, [`${property}: ${v1}px`], '  '));
	const second = media('min-width', t2, css(selector, [`${property}: ${v2}px`], '  '));
	const some = (lo: number, hi: number) => rng.int(Math.ceil(lo / 10), Math.floor(hi / 10)) * 10;
	let sheet = base + first + second;
	let width: number, answer: number, steps: string[];
	if (kind === 'sotto') {
		width = some(320, t1 - 10);
		answer = v0;
		steps = [`${width} è meno di ${t1} e di ${t2}: nessuna delle due media query è attiva.`, `Vale solo la regola di base: ${v0} px.`];
	} else if (kind === 'mezzo') {
		width = some(t1 + 10, t2 - 10);
		answer = v1;
		steps = [`${width} è almeno ${t1}: la prima media query è attiva. È meno di ${t2}: la seconda no.`, `La regola della prima media query è scritta dopo quella di base e la batte: ${v1} px.`];
	} else if (kind === 'sopra') {
		width = some(t2 + 10, t2 + 400);
		answer = v2;
		steps = [`${width} è almeno ${t1} e almeno ${t2}: tutte e due le media query sono attive.`, `Tra le regole attive, che hanno lo stesso selettore, vince l'ultima scritta: ${v2} px.`];
	} else if (kind === 'limite') {
		const upper = rng.int(0, 1) === 1;
		width = upper ? t2 : t1;
		answer = upper ? v2 : v1;
		steps = [`min-width: ${width}px vuol dire "almeno ${width} px", e ${width} è compreso: quella media query è attiva.`, upper ? `Sono attive tutte e due, e vince l'ultima scritta: ${v2} px.` : `La seconda chiede almeno ${t2} px e non è attiva: vale la prima, ${v1} px.`];
	} else if (kind === 'ordine') {
		sheet = base + second + first;
		width = some(t2 + 10, t2 + 400);
		answer = v1;
		steps = [`${width} è almeno ${t2} e almeno ${t1}: tutte e due le media query sono attive.`, `A parità di selettore vince la regola scritta più in basso, che qui è quella di min-width: ${t1}px: ${v1} px.`, `Per avere ${v2} px sugli schermi larghi, la media query di ${t2}px andrebbe scritta per ultima.`];
	} else {
		sheet = first + second + base;
		width = some(t1 + 10, t2 + 400);
		answer = v0;
		steps = [`A ${width} px ${width >= t2 ? 'tutte e due le media query sono attive' : 'la prima media query è attiva'}, ma la regola di base è scritta dopo di loro.`, `A parità di selettore vince la regola scritta più in basso: ${v0} px, a qualunque larghezza.`];
	}
	return {
		prompt: 'Guarda quali media query sono attive a quella larghezza, e poi l’ordine delle regole.',
		problem: `Il viewport è largo ${width} px. Quanto vale ${property} per ${selector}?`,
		listing: sheet,
		solution: `${answer} px.`,
		steps,
		answer: choose(rng, px(answer), [px(v0), px(v1), px(v2), px(spare)]),
		params: { case: kind, selector, property, width }
	};
}

// ---------------------------------------------------------------- 3. from the phone up

const FLEX = ['.contenuto', '.schede', '.concerti', '.pagina', '.foto', 'nav'] as const;
const FIRST = ['direzione', 'carattere'] as const;

function level3(rng: Rng, kind: (typeof FIRST)[number]): CodeBuilt {
	const limit = rng.int(10, 20) * 50;
	let selector: string, property: string, narrow: string, wide: string, said: string;
	if (kind === 'direzione') {
		selector = rng.pick(FLEX);
		property = 'flex-direction';
		[narrow, wide] = ['column', 'row'];
		said = `Gli elementi di ${selector}, che è già un contenitore flex, devono stare in colonna sugli schermi più stretti di ${limit} px e in riga da ${limit} px in su.`;
	} else {
		selector = rng.pick(['h1', 'h2', 'p', '.titolo', 'body', '.avviso'] as const);
		property = 'font-size';
		const small = rng.pick([14, 16, 18, 20] as const);
		[narrow, wide] = [`${small}px`, `${small + rng.pick([2, 4, 8] as const)}px`];
		said = `Il testo di ${selector} deve essere di ${narrow.replace('px', ' px')} sugli schermi più stretti di ${limit} px e di ${wide.replace('px', ' px')} da ${limit} px in su.`;
	}
	const rule = (value: string, indent = '') => css(selector, [`${property}: ${value}`], indent);
	const right = rule(narrow) + media('min-width', limit, rule(wide, '  '));
	const wrong = [rule(narrow) + media('max-width', limit, rule(wide, '  ')), rule(wide) + media('min-width', limit, rule(narrow, '  ')), media('min-width', limit, rule(wide, '  ')) + rule(narrow)];
	return {
		prompt: 'Prima la regola per lo schermo stretto, poi la media query che la corregge.',
		problem: `${said} Quale foglio di stile lo fa?`,
		solution: `La regola di base con ${narrow}, e sotto la media query min-width: ${limit}px con ${wide}.`,
		steps: [`Fuori dalle media query sta la regola per lo schermo più stretto: ${property}: ${narrow}.`, `"Da ${limit} px in su" si scrive min-width: ${limit}px. Con max-width la regola varrebbe sugli schermi stretti.`, 'La media query va dopo la regola di base: a parità di selettore vince la regola scritta più in basso.'],
		solutionListing: right,
		answer: choose(rng, listingOption(right), wrong.map((text) => listingOption(text))),
		params: { case: kind, selector, property, limit, narrow, wide }
	};
}

// ---------------------------------------------------------------- 4. images that adapt

const SHAPES = [
	[2, 1],
	[3, 2],
	[4, 3],
	[5, 4],
	[1, 1]
] as const;
const IMAGES = ['stretta', 'larga', 'allargata', 'niente'] as const;
const PICTURES = ['Una fotografia', 'Una locandina', 'Un’illustrazione', 'La copertina di un disco'] as const;
const COLUMNS = ['.colonna', 'main', '.scheda', 'article', 'aside'] as const;

function level4(rng: Rng, kind: (typeof IMAGES)[number]): CodeBuilt {
	const [a, b] = rng.pick(SHAPES);
	const unit = rng.int(4, 12) * 20;
	const other = rng.int(2, 14) * 20;
	const [w, h] = [a * unit, b * unit];
	const narrower = kind === 'stretta' || kind === 'niente';
	if (other === unit || (narrower ? other >= unit : other <= unit)) throw new Error('the column must be narrower, or wider');
	const column = a * other;
	const selector = rng.pick(COLUMNS);
	const picture = rng.pick(PICTURES);
	const declarations = { stretta: ['max-width: 100%', 'height: auto'], larga: ['max-width: 100%', 'height: auto'], allargata: ['width: 100%', 'height: auto'], niente: ['height: auto'] }[kind];
	const follows = kind === 'stretta' || kind === 'allargata';
	const [shownW, shownH] = follows ? [column, b * other] : [w, h];
	const asksWidth = rng.int(0, 1) === 0;
	const answer = asksWidth ? shownW : shownH;
	const why = {
		stretta: [`L'immagine è larga ${w} px e la colonna ${column}: max-width: 100% la ferma alla larghezza della colonna, ${column} px.`, `Con height: auto l'altezza segue la proporzione: ${column} · ${h} : ${w} = ${b * other} px.`],
		larga: [`max-width: 100% è un tetto: l'immagine non può superare i ${column} px della colonna, e con i suoi ${w} px non li supera.`, `Resta com'è: ${w} × ${h} pixel.`],
		allargata: [`width: 100% non è un tetto: dice all'immagine di essere larga quanto la colonna, ${column} px, anche se il file è largo ${w}.`, `Con height: auto l'altezza segue la proporzione: ${column} · ${h} : ${w} = ${b * other} px.`],
		niente: [`Nessuna dichiarazione parla della larghezza: l'immagine resta larga come il file, ${w} px, ed esce dalla colonna di ${column} px.`, `height: auto lascia l'altezza in proporzione alla larghezza: ${h} px.`]
	}[kind];
	const guesses = asksWidth ? [w, column, h, b * other, column / 2, w - column] : [h, b * other, column, h - Math.abs(w - column), w, (b * other) / 2];
	return {
		prompt: 'Guarda se la regola mette un tetto alla larghezza, la fissa, o non ne parla.',
		problem: `${picture} di ${w} × ${h} pixel sta dentro ${selector}. Quanto è ${asksWidth ? 'larga' : 'alta'} sulla pagina?`,
		listing: css(selector, [`width: ${column}px`]) + css('img', declarations),
		solution: `${answer} px.`,
		steps: why,
		answer: choose(rng, px(answer), whole(guesses)),
		params: { case: kind, w, h, column, selector, asks: asksWidth ? 'larghezza' : 'altezza' }
	};
}

// ---------------------------------------------------------------- 5. contrast

const CONTRAST = ['grande-basta', 'grande-no', 'normale-basta', 'normale-no'] as const;
const LARGE: readonly (readonly [number, boolean])[] = [
	[24, false],
	[28, false],
	[32, false],
	[20, true],
	[22, true],
	[24, true]
];
const NORMAL: readonly (readonly [number, boolean])[] = [
	[14, false],
	[16, false],
	[18, false],
	[20, false],
	[14, true],
	[16, true]
];
const WRITTEN = ['Il titolo di una pagina', 'Il giorno di un concerto', 'Il testo di un bottone', 'Il testo di una didascalia', 'Il nome di una voce del menu', 'Un avviso'] as const;

function level5(rng: Rng, kind: (typeof CONTRAST)[number]): CodeBuilt {
	const large = kind.startsWith('grande');
	const enough = kind.endsWith('basta');
	const [size, bold] = rng.pick(large ? LARGE : NORMAL);
	const limit = large ? 3 : 4.5;
	// in tenths, so that the ratio is the number written
	const tenths = enough ? rng.int(limit * 10, rng.pick([limit * 10 + 12, 120] as const)) : rng.int(Math.max(11, limit * 10 - 15), limit * 10 - 1);
	const ratio = comma(tenths / 10);
	const what = rng.pick(WRITTEN);
	const option = (isLarge: boolean, isEnough: boolean) => textOption(`È un testo ${isLarge ? 'grande' : 'normale'}, e il contrasto ${isEnough ? 'basta' : 'non basta'}`, `${isLarge ? 'grande' : 'normale'}-${isEnough ? 'basta' : 'no'}`);
	return {
		prompt: 'Decidi prima se il testo è grande o normale: la soglia cambia.',
		problem: `${what} è scritto a ${size} px${bold ? ', in grassetto' : ', non in grassetto'}. Tra il suo colore e quello dello sfondo il rapporto di contrasto è ${ratio} : 1. Va bene?`,
		solution: `${option(large, enough).latex}.`,
		steps: [
			`Un testo è grande da 24 px in su, oppure da circa 19 px in su se è in grassetto: ${size} px${bold ? ' in grassetto' : ''} è un testo ${large ? 'grande' : 'normale'}.`,
			`Per un testo ${large ? 'grande' : 'normale'} serve un rapporto di almeno ${comma(limit)} : 1.`,
			`${ratio} ${tenths / 10 === limit ? 'è proprio' : enough ? 'è più di' : 'è meno di'} ${comma(limit)}: il contrasto ${enough ? 'basta' : 'non basta'}.`
		],
		answer: choose(rng, option(large, enough), [option(large, !enough), option(!large, enough), option(!large, !enough)]),
		params: { case: kind, size, bold, ratio: tenths / 10, what }
	};
}

// ---------------------------------------------------------------- 6. an accessible page

const ACCESS = ['alt', 'titoli', 'label', 'tastiera'] as const;
const PHOTOS = [
	['palco.jpg', 'Il gruppo sul palco'],
	['locandina.png', 'La locandina'],
	['sara.jpg', 'Sara al microfono'],
	['sala.jpg', 'La sala prove'],
	['logo.png', 'Il logo del gruppo'],
	['pubblico.jpg', 'Il pubblico in palestra'],
	['leo.jpg', 'Leo alla batteria'],
	['disco.png', 'La copertina del disco'],
	['prove.jpg', 'Il gruppo in sala prove'],
	['dario.jpg', 'Dario con il basso'],
	['strumenti.jpg', 'Gli strumenti sul palco'],
	['marta.jpg', 'Marta con la chitarra']
] as const;
const SECTIONS = [
	['Concerti', 'Foto'],
	['Il gruppo', 'Contatti'],
	['Date', 'Biglietti'],
	['Musica', 'Video'],
	['Storia', 'Notizie'],
	['Prove', 'Testi'],
	['Canzoni', 'Album'],
	['Eventi', 'Stampa']
] as const;
const FIELDS = [
	['email', 'Email', 'email'],
	['nome', 'Nome', 'text'],
	['classe', 'Classe', 'text'],
	['tel', 'Telefono', 'tel'],
	['eta', 'Età', 'number'],
	['citta', 'Città', 'text']
] as const;
const ACTIONS = ['Iscriviti', 'Invia', 'Prenota', 'Ascolta', 'Compra', 'Vota', 'Accedi', 'Scarica'] as const;
const LINKS = [
	['foto.html', 'Foto'],
	['date.html', 'Date'],
	['gruppo.html', 'Gruppo'],
	['video.html', 'Video'],
	['testi.html', 'Testi'],
	['soci.html', 'Soci']
] as const;

function level6(rng: Rng, kind: (typeof ACCESS)[number]): CodeBuilt {
	let problem: string, right: string, wrong: string[], steps: string[], data: Record<string, unknown>;
	if (kind === 'alt') {
		const [file, shows] = rng.pick(PHOTOS);
		const img = (rest: string) => `<img src="${file}"${rest}>\n`;
		problem = `Nella pagina c'è l'immagine ${file}. Chi la vede la descrive così: "${shows}". Quale frammento dice che cosa c'è anche a chi la pagina se la fa leggere?`;
		right = img(`\n  alt="${shows}"`);
		wrong = [img(''), img(`\n  alt="${file}"`), img(`\n  title="${shows}"`), img('\n  alt=""'), img('\n  alt="immagine"')];
		steps = ['Il lettore di schermo legge al posto dell’immagine il testo dell’attributo alt.', 'Il testo deve dire che cosa mostra l’immagine: il nome del file o la parola "immagine" non lo dicono.', 'Un alt vuoto dice che l’immagine è solo decorativa, e viene saltata.'];
		data = { file, shows };
	} else if (kind === 'titoli') {
		const [first, second] = rng.pick(SECTIONS);
		const nested = rng.int(0, 1) === 1;
		const page = (...levels: [string, string, string]) => `<${levels[0]}>I Fuori Tempo</${levels[0]}>\n<${levels[1]}>${first}</${levels[1]}>\n<${levels[2]}>${second}</${levels[2]}>\n`;
		problem = nested ? `La pagina ha il titolo "I Fuori Tempo", una sezione "${first}" e, dentro quella sezione, una parte "${second}". Quale sequenza di titoli è giusta?` : `La pagina ha il titolo "I Fuori Tempo" e due sezioni dello stesso livello, "${first}" e "${second}". Quale sequenza di titoli è giusta?`;
		right = nested ? page('h1', 'h2', 'h3') : page('h1', 'h2', 'h2');
		wrong = nested ? [page('h1', 'h2', 'h4'), page('h1', 'h2', 'h2'), page('h1', 'h3', 'h4'), page('h1', 'h1', 'h2'), page('h2', 'h3', 'h4')] : [page('h1', 'h3', 'h3'), page('h1', 'h1', 'h1'), page('h1', 'h2', 'h3'), page('h2', 'h1', 'h1'), page('h1', 'h4', 'h4')];
		steps = ['Il titolo della pagina è l’unico h1.', nested ? 'Una sezione della pagina ha un h2, e una parte dentro quella sezione un h3.' : 'Due sezioni dello stesso livello hanno tutte e due un h2.', 'I livelli non si saltano: la grandezza di un titolo si cambia nel CSS.'];
		data = { first, second, nested };
	} else if (kind === 'label') {
		const [id, text, type] = rng.pick(FIELDS);
		// the same word with a capital letter: an id is matched letter by letter
		const other = id.charAt(0).toUpperCase() + id.slice(1);
		problem = `Un modulo ha il campo "${text}". Quale frammento collega l'etichetta al campo, così che chi ascolta la pagina sappia che cosa scriverci?`;
		right = `<label for="${id}">${text}</label>\n<input id="${id}" type="${type}">\n`;
		wrong = [`<label>${text}</label>\n<input id="${id}" type="${type}">\n`, `<label for="${other}">${text}</label>\n<input id="${id}" type="${type}">\n`, `<p>${text}</p>\n<input id="${id}" type="${type}">\n`, `<label for="${id}">${text}</label>\n<input name="${id}" type="${type}">\n`, `<input id="${id}" type="${type}"\n  placeholder="${text}">\n`];
		steps = ['L’etichetta di un campo è un elemento label.', `Il valore di for deve essere uguale all'id del campo, lettera per lettera: qui "${id}".`, 'for cerca un id, non un name; un paragrafo accanto al campo non è collegato a niente.'];
		data = { id, text };
	} else {
		const button = rng.int(0, 1) === 1;
		if (button) {
			const text = rng.pick(ACTIONS);
			problem = `Nella pagina serve un pulsante "${text}". Quale frammento si raggiunge con il tasto Tab senza aggiungere altro?`;
			right = `<button>${text}</button>\n`;
			wrong = [`<div class="btn">${text}</div>\n`, `<span class="btn">${text}</span>\n`, `<p class="btn">${text}</p>\n`, `<b>${text}</b>\n`];
			steps = ['Il tasto Tab si ferma da solo su link, bottoni e campi dei moduli.', 'button è un bottone vero: prende il fuoco e si attiva dalla tastiera.', 'div, span, p e b restano fuori dal giro del tasto Tab, anche se il CSS li disegna come un bottone.'];
			data = { button, text };
		} else {
			const [file, text] = rng.pick(LINKS);
			problem = `Nel menu serve un collegamento "${text}" alla pagina ${file}. Quale frammento si raggiunge con il tasto Tab senza aggiungere altro?`;
			right = `<a href="${file}">${text}</a>\n`;
			wrong = [`<span class="link">${text}</span>\n`, `<a>${text}</a>\n`, `<div class="link">${text}</div>\n`, `<u>${text}</u>\n`];
			steps = ['Il tasto Tab si ferma da solo su link, bottoni e campi dei moduli.', 'Un elemento a è un link, e prende il fuoco, solo se ha href.', 'span, div e u restano fuori dal giro del tasto Tab, anche se il CSS li disegna come un link.'];
			data = { button, text, file };
		}
	}
	// two mistakes are always offered, the third is drawn among the others
	const third = rng.int(2, wrong.length - 1);
	return {
		prompt: 'Pensa a chi la pagina la ascolta, o la usa senza mouse.',
		problem,
		solution: 'Il frammento che usa l’elemento giusto con i suoi attributi.',
		steps,
		solutionListing: right,
		answer: choose(
			rng,
			listingOption(right),
			[wrong[0], wrong[1], wrong[third]].map((text) => listingOption(text))
		),
		params: { case: kind, ...data, third }
	};
}

/** A level of text and fragments has no program. */
const worded = (sample: { params: Record<string, unknown> }) => (sample.params.program ? ['a level of fragments has no program'] : []);

export default makeCodeGenerator(ID, 'Pagine responsive e accessibili', {
	1: { label: 'Unità relative', constraints: ['rem, em, % and vw turned into whole pixels', 'the number that does not count is given too'], build: drawn(UNITS, level1), check: worded },
	2: { label: 'Quale regola è attiva', constraints: ['a base rule and two media queries with min-width', 'the last rule that holds wins'], build: drawn(HOLDS, level2), check: worded },
	3: { label: 'Prima il telefono', constraints: ['four style sheets as options', 'base rule first, then min-width'], build: drawn(FIRST, level3), check: worded },
	4: { label: 'Immagini che si adattano', constraints: ['an image and a column of whole pixels, same proportion', 'max-width is a ceiling, width is not'], build: drawn(IMAGES, level4), check: worded },
	5: { label: 'Il contrasto', constraints: ['a ratio with one decimal', '4,5 for normal text, 3 for large text'], build: drawn(CONTRAST, level5), check: worded },
	6: { label: 'Una pagina accessibile', constraints: ['four fragments as options', 'one uses the right element with its attributes'], build: drawn(ACCESS, level6), check: worded }
});
