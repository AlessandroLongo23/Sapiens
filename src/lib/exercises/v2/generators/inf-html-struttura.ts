/**
 * Struttura di una pagina HTML. Spec: specs/exercises/inf-html-struttura.md
 *
 * Five levels from the lesson (docs/lezioni/informatica/riscritte/88-inf-html-struttura.md), all multiple choice on
 * real fragments of HTML: the skeleton of a page, headings and paragraphs, the parts of a page, the tree of the
 * document, comments and what a browser does with a mistake. Every page is built here as a tree and written from
 * it; the independent check reads the fragments again by itself.
 */
import type { Rng } from '../types';
import { choose, listingOption, makeCodeGenerator, shuffle, textOption, type CodeBuilt } from '../inf-codice';

export const ID = 'inf-html-struttura';

const few = <T>(rng: Rng, xs: readonly T[], n: number): T[] => shuffle(rng, xs).slice(0, n);
const tag = (name: string) => `<${name}>`;
const tagOption = (name: string) => textOption(tag(name), name);
const numberOption = (n: number) => textOption(String(n));

// ---------------------------------------------------------------------------
// The pages: who they are of, what the tab says, what the page says

const SITES = [
	{ tab: 'I Fuori Tempo', h1: 'Il gruppo della 3B', p: 'Suoniamo dal 2024.', more: 'Proviamo il martedì.' },
	{ tab: 'Torneo di scacchi', h1: 'Scacchi a scuola', p: 'Si gioca il giovedì.', more: 'Iscrizioni in 2A.' },
	{ tab: 'Il giornalino', h1: 'La voce del liceo', p: 'Esce ogni mese.', more: 'Cerchiamo disegnatori.' },
	{ tab: "L'orto della 1C", h1: 'Un orto in cortile', p: 'Raccogliamo a maggio.', more: 'Servono annaffiatoi.' },
	{ tab: 'Club del libro', h1: 'Letture del mese', p: 'Ci vediamo in biblioteca.', more: 'Porta un romanzo.' },
	{ tab: 'Coro del liceo', h1: 'Cantiamo insieme', p: 'Prove il lunedì.', more: 'Non serve esperienza.' },
	{ tab: 'Cineforum', h1: 'Un film a settimana', p: 'Proiezioni in aula video.', more: 'Ingresso libero.' },
	{ tab: 'Gita a Trieste', h1: 'La gita della 3B', p: 'Si parte alle 7.', more: 'Pranzo al sacco.' },
	{ tab: 'Squadra di volley', h1: 'Pallavolo della scuola', p: 'Allenamento in palestra.', more: 'Partita sabato.' },
	{ tab: 'Robotica', h1: 'Il club dei robot', p: 'Costruiamo un braccio.', more: 'Gara a marzo.' }
] as const;

// ---------------------------------------------------------------------------
// Level 1: the skeleton

const ROLES = [
	{ id: 'doctype', what: "dichiara che il file è scritto nell'HTML di oggi", why: 'È il doctype, la prima riga di ogni pagina: non è un tag e non si chiude.' },
	{ id: 'lingua', what: 'dice in che lingua è scritto il testo della pagina', why: "È l'attributo lang dell'elemento html: lo usano i programmi che leggono la pagina ad alta voce." },
	{ id: 'codifica', what: 'dichiara la codifica dei caratteri del file', why: "È l'elemento meta con l'attributo charset: senza, le lettere accentate possono uscire sbagliate." },
	{ id: 'scheda', what: 'dà il nome alla scheda del browser', why: "È l'elemento title, nella testa: non compare nella pagina, ma sulla scheda." }
] as const;

function level1(rng: Rng): CodeBuilt {
	const site = rng.pick(SITES);
	const rows = { doctype: '<!DOCTYPE html>', lingua: '<html lang="it">', codifica: '  <meta charset="utf-8">', scheda: `  <title>${site.tab}</title>` };
	const kind = rng.pick(['scheda', 'finestra', 'compito', 'manca'] as const);
	const two = kind === 'finestra' || rng.next() < 0.4;
	const body = [`  <h1>${site.h1}</h1>`, `  <p>${site.p}</p>`, ...(two ? [`  <p>${site.more}</p>`] : [])];
	const all = [rows.doctype, rows.lingua, '<head>', rows.codifica, rows.scheda, '</head>', '<body>', ...body, '</body>', '</html>'];
	const listing = all.join('\n') + '\n';
	const base = { tab: site.tab, h1: site.h1, texts: two ? [site.p, site.more] : [site.p] };
	if (kind === 'scheda')
		return {
			prompt: 'Cerca nella testa del documento.',
			problem: 'Quale testo compare sulla scheda del browser quando apri questa pagina?',
			listing,
			solution: `"${site.tab}", il testo di <title>.`,
			steps: ['Sulla scheda del browser compare il titolo del documento, cioè il testo tra <title> e </title>, che sta dentro <head>.', `Il testo di <h1>, "${site.h1}", è il titolo che si vede in cima alla pagina: sta nel corpo.`],
			answer: choose(rng, textOption(site.tab), [textOption(site.h1), textOption(site.p), textOption('utf-8'), textOption('it')]),
			params: { case: 'scheda', ...base }
		};
	if (kind === 'finestra')
		return {
			prompt: 'Guarda in quale elemento sta ogni testo.',
			problem: 'Quale di questi testi non compare nella finestra del browser, dove si legge la pagina?',
			listing,
			solution: `"${site.tab}": sta in <title>, dentro <head>.`,
			steps: ['Nella finestra il browser disegna solo quello che sta dentro <body>.', `"${site.tab}" è il testo di <title>, che sta nella testa: compare sulla scheda, non nella pagina.`],
			answer: choose(rng, textOption(site.tab), [textOption(site.h1), textOption(site.p), textOption(site.more)]),
			params: { case: 'finestra', ...base }
		};
	if (kind === 'compito') {
		const role = rng.pick(ROLES);
		return {
			prompt: 'Leggi le prime righe del file una alla volta.',
			problem: `Quale riga di questa pagina ${role.what}?`,
			listing,
			solution: rows[role.id].trim(),
			steps: [role.why, 'Le altre righe della testa hanno ognuna un compito diverso: doctype, lingua, codifica e titolo della scheda non si scambiano.'],
			solutionListing: rows[role.id].trim() + '\n',
			answer: choose(rng, listingOption(rows[role.id].trim(), role.id), ROLES.filter((r) => r.id !== role.id).map((r) => listingOption(rows[r.id].trim(), r.id))),
			params: { case: 'compito', role: role.id, ...base }
		};
	}
	// one row of the skeleton is left out: which one
	const gone = rng.pick(['<!DOCTYPE html>', '<head>', '</head>', '<body>', '</body>', '</html>'] as const);
	const others = few(rng, all.filter((row) => row !== gone && !row.startsWith('  <h1') && !row.startsWith('  <p')), 3);
	return {
		prompt: 'Controlla che ogni elemento aperto abbia la sua chiusura, e che ci sia la prima riga.',
		problem: 'In questo file manca una riga dello scheletro. Quale?',
		listing: all.filter((row) => row !== gone).join('\n') + '\n',
		solution: gone,
		steps: [
			'Lo scheletro è fatto così: il doctype, poi <html> che contiene <head> e <body>, ognuno con il suo tag di chiusura.',
			gone === '<!DOCTYPE html>' ? 'Qui il file comincia subito con <html>: manca il doctype, che va nella prima riga.' : `Scorrendo il file, ${gone} è l'unica riga dello scheletro che non c'è: le altre tre opzioni ci sono già.`
		],
		solutionListing: gone + '\n',
		answer: choose(rng, listingOption(gone), others.map((row) => listingOption(row.trim()))),
		params: { case: 'manca', missing: gone, ...base }
	};
}

// ---------------------------------------------------------------------------
// Level 2: headings and paragraphs

const SENTENCES = ['Sara canta.', 'Leo suona la batteria.', 'Proviamo il martedì.', 'Marta suona la chitarra.', 'Il concerto è venerdì.', "L'ingresso è libero.", 'Dario suona il basso.', 'Suoniamo in aula magna.', 'Portate un amico.', 'Si comincia alle 18.'] as const;

/** A page, a part of it, a part of that part, a part of that one again, and another part of the page. */
const OUTLINES = [
	{ page: 'I Fuori Tempo', a: 'Strumenti', a1: 'Chitarre', a11: 'Chitarra acustica', b: 'Concerti' },
	{ page: 'La nostra scuola', a: 'Laboratori', a1: 'Informatica', a11: 'Orario del laboratorio', b: 'Palestra' },
	{ page: 'Gita a Trieste', a: 'Programma', a1: 'Primo giorno', a11: 'Mattina', b: 'Costi' },
	{ page: 'Ricette della 2A', a: 'Dolci', a1: 'Torte', a11: 'Torta di mele', b: 'Primi piatti' },
	{ page: 'Il sistema solare', a: 'Pianeti', a1: 'Giove', a11: 'Le lune di Giove', b: 'Comete' },
	{ page: 'Torneo di scacchi', a: 'Regolamento', a1: 'Tempi di gioco', a11: 'Partite lampo', b: 'Classifica' },
	{ page: 'Orto della scuola', a: 'Ortaggi', a1: 'Pomodori', a11: 'Pomodori ciliegini', b: 'Attrezzi' },
	{ page: 'Biblioteca', a: 'Romanzi', a1: 'Gialli', a11: 'Gialli italiani', b: 'Fumetti' }
] as const;

const heading = (level: number, text: string) => `<h${level}>${text}</h${level}>`;

function level2(rng: Rng): CodeBuilt {
	const kind = rng.pick(['paragrafi', 'livello', 'regole'] as const);
	if (kind === 'paragrafi') {
		for (;;) {
			const count = rng.int(2, 3);
			const sizes = Array.from({ length: count }, () => rng.int(1, 3));
			const lines = sizes.reduce((a, b) => a + b, 0);
			if (lines === count || lines > 6) continue;
			const words = few(rng, SENTENCES, lines);
			let at = 0;
			const rows = sizes.flatMap((size) => {
				const mine = words.slice(at, (at += size));
				return mine.map((text, i) => `${i === 0 ? '<p>' : '   '}${text}${i === size - 1 ? '</p>' : ''}`);
			});
			return {
				prompt: 'Conta gli elementi, non le righe del file.',
				problem: 'Quanti paragrafi staccati mostra il browser per questo frammento?',
				listing: rows.join('\n') + '\n',
				solution: `${count}: uno per ogni elemento <p>.`,
				steps: [`Un paragrafo è quello che sta tra <p> e </p>: qui gli elementi <p> sono ${count}.`, `Le righe di testo nel file sono ${lines}, ma gli a capo scritti nel file per il browser valgono come uno spazio.`],
				answer: choose(
					rng,
					numberOption(count),
					[lines, count + 1, count - 1, lines + 1, 1, lines - 1].filter((n) => n > 0 && n !== count).map(numberOption)
				),
				params: { case: 'paragrafi', count, lines, fragment: rows.join('\n') + '\n' }
			};
		}
	}
	const o = rng.pick(OUTLINES);
	if (kind === 'livello') {
		const depth = rng.pick([2, 3, 4] as const);
		const shown = [heading(1, o.page), heading(2, o.a), ...(depth === 4 || (depth === 2 && rng.next() < 0.5) ? [heading(3, o.a1)] : [])];
		const [text, relation] = depth === 2 ? [o.b, `un'altra parte della pagina, come "${o.a}"`] : depth === 3 ? [o.a1, `una parte di "${o.a}"`] : [o.a11, `una parte di "${o.a1}"`];
		return {
			prompt: 'Chiediti di che cosa è il titolo, non quanto deve essere grande.',
			problem: `Il titolo "${text}" è ${relation}. Quale tag va al posto di ?? nell'ultima riga?`,
			listing: [...shown, `<??>${text}</??>`].join('\n') + '\n',
			solution: tag(`h${depth}`),
			steps: [
				depth === 2 ? `"${text}" è una parte della pagina allo stesso livello di "${o.a}", che è un <h2>: è un <h2> anche lui.` : `"${text}" sta dentro una parte che ha per titolo un <h${depth - 1}>: il suo titolo è di un livello più interno, <h${depth}>.`,
				'Scendendo non si salta un livello, e <h1> è uno solo: il titolo di tutta la pagina.'
			],
			answer: choose(rng, tagOption(`h${depth}`), [1, 2, 3, 4, 5].filter((n) => n !== depth).map((n) => tagOption(`h${n}`))),
			params: { case: 'livello', depth, text, fragment: [...shown, `<??>${text}</??>`].join('\n') + '\n' }
		};
	}
	// four pages of headings: one keeps the two rules
	const texts = [o.page, o.a, o.a1, o.b];
	const page = (levels: number[]) => levels.map((level, i) => heading(level, texts[i])).join('\n') + '\n';
	const right = rng.pick([
		[1, 2, 3, 2],
		[1, 2, 2, 2],
		[1, 2, 3, 3]
	]);
	const wrong = few(
		rng,
		[
			[1, 1, 2, 2],
			[1, 3, 3, 2],
			[1, 2, 4, 2],
			[1, 2, 3, 1],
			[1, 3, 4, 2]
		],
		3
	);
	return {
		prompt: 'Controlla due cose: quanti <h1> ci sono, e se scendendo si salta un livello.',
		problem: 'Quale di queste pagine rispetta le regole dei titoli?',
		solution: `La pagina con un solo <h1> e i livelli ${right.join(', ')}.`,
		steps: ['Una pagina ha un solo <h1>, il titolo di tutta la pagina.', 'Scendendo non si salta un livello: sotto un <h2> viene un <h3>, non un <h4>, e sotto <h1> viene <h2>. Risalire di più livelli invece si può.'],
		solutionListing: page(right),
		answer: choose(rng, listingOption(page(right)), wrong.map((levels) => listingOption(page(levels)))),
		params: { case: 'regole', levels: right, texts }
	};
}

// ---------------------------------------------------------------------------
// The page of levels 3 and 4, as a tree

interface El {
	tag: string;
	text?: string;
	href?: string;
	kids?: El[];
}

const LINKS = [
	['Date', 'date.html'],
	['Foto', 'foto.html'],
	['Video', 'video.html'],
	['Contatti', 'contatti.html'],
	['Storia', 'storia.html']
] as const;
const FOOTERS = ['Pagina della 3B.', 'Scritta dalla 2A.', 'A cura della 1C.', 'Liceo di Borgo Alto.', 'Aggiornata a maggio.'] as const;
const SECTIONS = [
	['Chi siamo', 'Quattro amici.'],
	['Le prove', 'Ogni martedì.'],
	['Il concerto', 'Venerdì alle 18.'],
	['Come iscriversi', 'Scrivi a Sara.'],
	['Dove siamo', 'In aula magna.'],
	['Novità', 'Nuovo brano!']
] as const;

function rowsOf(el: El, indent = 0): string[] {
	const pad = ' '.repeat(indent);
	const open = `<${el.tag}${el.href ? ` href="${el.href}"` : ''}>`;
	if (!el.kids) return [`${pad}${open}${el.text ?? ''}</${el.tag}>`];
	return [pad + open, ...el.kids.flatMap((kid) => rowsOf(kid, indent + 2)), `${pad}</${el.tag}>`];
}

/** A page with its parts; `full` asks for all four. At most 18 rows. */
function page(rng: Rng, full: boolean): El {
	for (;;) {
		const site = rng.pick(SITES);
		const header: El = { tag: 'header', kids: [{ tag: 'h1', text: site.tab }] };
		const nav: El = { tag: 'nav', kids: few(rng, LINKS, full ? 2 : rng.int(2, 3)).map(([text, href]) => ({ tag: 'a', text, href })) };
		const [title, sentence] = rng.pick(SECTIONS);
		const main: El = { tag: 'main', kids: [{ tag: 'h2', text: title }, { tag: 'p', text: sentence }, ...(!full && rng.next() < 0.4 ? [{ tag: 'p', text: rng.pick(SITES).more }] : [])] };
		const footer: El = { tag: 'footer', kids: [{ tag: 'p', text: rng.pick(FOOTERS) }] };
		const body: El = { tag: 'body', kids: [header, ...(full || rng.next() < 0.7 ? [nav] : []), main, ...(full || rng.next() < 0.7 ? [footer] : [])] };
		const rows = rowsOf(body);
		const texts = rows.map((row) => row.trim()).filter((row) => row.startsWith('<p>'));
		if (rows.length <= 18 && new Set(texts).size === texts.length) return body;
	}
}

// ---------------------------------------------------------------------------
// Level 3: the parts of a page

const PARTS = {
	header: { holds: "l'intestazione, con il titolo della pagina", near: ['head', 'main', 'footer', 'section'] },
	nav: { holds: 'il menu, cioè i link per muoversi nel sito', near: ['main', 'header', 'footer', 'head'] },
	main: { holds: 'il contenuto proprio di questa pagina', near: ['header', 'footer', 'nav', 'head'] },
	footer: { holds: 'il piè di pagina', near: ['header', 'main', 'nav', 'head'] }
} as const;

function level3(rng: Rng): CodeBuilt {
	if (rng.next() < 0.55) {
		const body = page(rng, true);
		const part = rng.pick(['header', 'nav', 'main', 'footer'] as const);
		const listing =
			rowsOf(body)
				.map((row) => row.replace(`<${part}>`, '<???>').replace(`</${part}>`, '</???>'))
				.join('\n') + '\n';
		return {
			prompt: 'Guarda che cosa contiene la parte senza nome.',
			problem: 'In questa pagina il nome di un elemento è stato sostituito con ???. Quale elemento è?',
			listing,
			solution: tag(part),
			steps: [`La parte senza nome contiene ${PARTS[part].holds}: è <${part}>.`, part === 'header' ? '<head> è un altro elemento: la testa del documento, che sta fuori da <body> e non si vede.' : 'Gli elementi semantici dicono che cosa contiene una parte; nessuno di loro ne cambia l’aspetto.'],
			answer: choose(rng, tagOption(part), few(rng, PARTS[part].near, 3).map(tagOption)),
			params: { case: 'quale', part, fragment: listing }
		};
	}
	// where the heading of the page goes
	const site = rng.pick(SITES.filter((one) => one.h1.length <= 21));
	const title = `  <title>${site.tab}</title>`;
	const h1 = `<h1>${site.h1}</h1>`;
	const right = ['<head>', title, '</head>', '<body>', '  <header>', `    ${h1}`, '  </header>', '</body>'];
	const wrong = [
		['<head>', title, `  ${h1}`, '</head>', '<body>', '  <header>', '  </header>', '</body>'],
		['<header>', title, '</header>', '<body>', '  <head>', `    ${h1}`, '  </head>', '</body>'],
		['<head>', title, '  <header>', `    ${h1}`, '  </header>', '</head>', '<body>', '</body>'],
		['<head>', title, '</head>', '<header>', `  ${h1}`, '</header>', '<body>', '</body>']
	];
	const text = (rows: string[]) => rows.join('\n') + '\n';
	return {
		prompt: 'Distingui la testa del documento dall’intestazione della pagina.',
		problem: 'In quale di queste pagine il titolo <h1> e il titolo <title> stanno al posto giusto?',
		solution: 'La pagina con <title> dentro <head> e con <h1> dentro <header>, che sta dentro <body>.',
		steps: ['<head> è la testa del documento: contiene <title> e non si vede nella pagina.', '<header> è l’intestazione che il lettore vede: sta dentro <body>, e contiene il titolo <h1>.', 'Tutto quello che si deve vedere sta dentro <body>.'],
		solutionListing: text(right),
		answer: choose(rng, listingOption(text(right)), few(rng, wrong, 3).map((rows) => listingOption(text(rows)))),
		params: { case: 'posto', tab: site.tab, h1: site.h1 }
	};
}

// ---------------------------------------------------------------------------
// Level 4: the tree of the document

interface Placed {
	el: El;
	parent: Placed | null;
}
function placed(el: El, parent: Placed | null = null): Placed[] {
	const me = { el, parent };
	return [me, ...(el.kids ?? []).flatMap((kid) => placed(kid, me))];
}
/** An element as a question names it, and as the check finds it again: its tag, and its text when the tag is of more than one. */
const key = (p: Placed) => (p.el.tag === 'p' || p.el.tag === 'a' ? `${p.el.tag}:${p.el.text}` : p.el.tag);
const named = (p: Placed) => (p.el.tag === 'p' ? `il paragrafo "${p.el.text}"` : p.el.tag === 'a' ? `il link "${p.el.text}"` : `<${p.el.tag}>`);
const elementOption = (p: Placed) => textOption(named(p), key(p));
const withArticle = (p: Placed) => (p.el.tag === 'p' || p.el.tag === 'a' ? named(p).replace(/^il /, 'del ') : `di <${p.el.tag}>`);

function level4(rng: Rng): CodeBuilt {
	for (;;) {
		const body = page(rng, false);
		const all = placed(body);
		const listing = rowsOf(body).join('\n') + '\n';
		const kind = rng.pick(['genitore', 'figli', 'fratello'] as const);
		const inside = (p: Placed) => all.filter((q) => q.parent === p);
		if (kind === 'genitore') {
			const target = rng.pick(all.filter((p) => p.parent && p.parent.parent));
			const parent = target.parent!;
			const others = shuffle(rng, [parent.parent!, ...inside(parent).filter((p) => p !== target), ...inside(target), ...all.filter((p) => p.el.kids && p !== parent && p !== parent.parent)]).filter((p) => p !== target);
			if (new Set(others.map(key)).size < 3) continue;
			return {
				prompt: 'Il genitore è l’elemento che lo contiene direttamente.',
				problem: `Nell'albero di questa pagina, qual è il genitore ${withArticle(target)}?`,
				listing,
				solution: named(parent),
				steps: [`${named(target).replace(/^./, (c) => c.toUpperCase())} è scritto tra <${parent.el.tag}> e </${parent.el.tag}>, senza altri elementi in mezzo: è figlio di <${parent.el.tag}>.`, `<${parent.parent!.el.tag}> lo contiene, ma non direttamente: tra i due c'è <${parent.el.tag}>.`],
				answer: choose(rng, elementOption(parent), others.map(elementOption)),
				params: { case: 'genitore', target: key(target), fragment: listing }
			};
		}
		if (kind === 'figli') {
			const target = rng.pick(all.filter((p) => p.el.kids));
			const kids = inside(target).length;
			const below = all.filter((p) => p !== target && (function up(q: Placed | null): boolean { return q !== null && (q === target || up(q.parent)); })(p.parent)).length;
			return {
				prompt: 'Conta solo gli elementi scritti direttamente al suo interno.',
				problem: `Nell'albero di questa pagina, quanti figli ha <${target.el.tag}>?`,
				listing,
				solution: `${kids}: ${inside(target).map(named).join(', ')}.`,
				steps: [`I figli di <${target.el.tag}> sono gli elementi che contiene direttamente: ${inside(target).map(named).join(', ')}.`, below > kids ? `Gli elementi che stanno dentro i suoi figli non sono figli suoi: in tutto ne contiene ${below}, ma i figli sono ${kids}.` : 'I suoi figli non contengono altri elementi, quindi non c’è altro da contare.'],
				answer: choose(rng, numberOption(kids), [below, kids + 1, kids - 1, below + 1, kids + 2, all.length].filter((n) => n >= 0 && n !== kids).map(numberOption)),
				params: { case: 'figli', target: key(target), fragment: listing }
			};
		}
		const target = rng.pick(all.filter((p) => p.parent && inside(p.parent).length > 1));
		const parent = target.parent!;
		const brother = rng.pick(inside(parent).filter((p) => p !== target));
		const brothers = new Set(inside(parent));
		const others = shuffle(rng, all.filter((p) => !brothers.has(p) && p.el.tag !== 'body')).sort((a, b) => Number(b === parent || b.parent === target) - Number(a === parent || a.parent === target));
		if (new Set(others.map(key)).size < 3) continue;
		return {
			prompt: 'Due fratelli hanno lo stesso genitore.',
			problem: `Nell'albero di questa pagina, quale di questi elementi è un fratello ${withArticle(target)}?`,
			listing,
			solution: named(brother),
			steps: [`Il genitore ${withArticle(target)} è <${parent.el.tag}>.`, `${named(brother)} è figlio di <${parent.el.tag}> anche lui: i due sono fratelli. Gli altri hanno un altro genitore, oppure sono il genitore o un figlio.`],
			answer: choose(rng, elementOption(brother), others.map(elementOption)),
			params: { case: 'fratello', target: key(target), fragment: listing }
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: comments, and what a browser does with a mistake

const INVENTED = ['titolo', 'paragrafo', 'capitolo', 'grande', 'testo', 'sezione', 'riga', 'blocco'] as const;
const CONTAINERS = ['main', 'section', 'body'] as const;

function level5(rng: Rng): CodeBuilt {
	const kind = rng.pick(['commento', 'aperto', 'sconosciuto'] as const);
	if (kind === 'commento') {
		for (;;) {
			const count = rng.int(3, 5);
			const words = few(rng, SENTENCES.filter((text) => text.length <= 21), count);
			const open = rng.next() < 0.3; // a comment that never ends
			const hidden = words.map(() => rng.next() < 0.4);
			const from = open ? rng.int(1, count - 1) : count;
			const rows = words.flatMap((text, i) => {
				const p = `<p>${text}</p>`;
				if (i === from) return ['<!-- da rivedere', p];
				if (i > from) return [p];
				return [hidden[i] ? `<!-- ${p} -->` : p];
			});
			const visible = words.filter((_, i) => i < from && !hidden[i]).length;
			const inComments = words.filter((_, i) => i < from && hidden[i]).length;
			if (visible === count || visible === 0 || (!open && inComments === 0)) continue;
			return {
				prompt: 'Trova dove comincia e dove finisce ogni commento.',
				problem: 'Quanti paragrafi mostra il browser per questo frammento?',
				listing: rows.join('\n') + '\n',
				solution: `${visible}: gli altri stanno dentro un commento.`,
				steps: [
					'Il browser salta tutto quello che sta tra <!-- e -->, anche se dentro ci sono dei tag.',
					open ? 'L’ultimo commento si apre e non si chiude più: sparisce tutto quello che lo segue, fino alla fine del file.' : `Gli elementi <p> scritti nel file sono ${count}, ma ${inComments === 1 ? 'uno è' : `${inComments} sono`} dentro un commento.`
				],
				answer: choose(rng, numberOption(visible), [count, count - inComments, visible + 1, inComments, visible - 1, count + 1, 0].filter((n) => n >= 0 && n !== visible).map(numberOption)),
				params: { case: 'commento', open, fragment: rows.join('\n') + '\n' }
			};
		}
	}
	if (kind === 'aperto') {
		const container = rng.pick(CONTAINERS);
		const [first, second] = few(rng, SECTIONS, 2);
		const words = few(rng, SENTENCES, 3);
		const after = rng.int(1, 2); // the paragraphs after the heading left open
		const paragraphs = [...words.slice(0, after), second[1]];
		const rows = [`<${container}>`, `  <h2>${first[0]}`, ...words.slice(0, after).map((text) => `  <p>${text}</p>`), `  <h2>${second[0]}</h2>`, `  <p>${second[1]}</p>`, `</${container}>`];
		const target = rng.next() < 0.65 ? rng.int(0, after - 1) : after;
		const caught = target < after;
		return {
			prompt: 'Segui il file dall’alto e tieni a mente quali elementi sono ancora aperti.',
			problem: `In questo frammento manca un tag di chiusura. Nell'albero che il browser costruisce, di quale elemento è figlio il paragrafo "${paragraphs[target]}"?`,
			listing: rows.join('\n') + '\n',
			solution: caught ? '<h2>: il titolo è rimasto aperto.' : `<${container}>: il titolo aperto è stato chiuso dal titolo successivo.`,
			steps: [
				`Dopo "${first[0]}" manca </h2>: il titolo resta aperto, e i paragrafi che seguono diventano suoi figli.`,
				caught ? 'Un tag di apertura aggiunge un figlio all’ultimo elemento ancora aperto, che qui è <h2>: il paragrafo viene scritto come un titolo.' : `Un titolo non può stare dentro un altro titolo: quando arriva il secondo <h2> il browser chiude il primo. Il paragrafo che viene dopo è di nuovo figlio di <${container}>.`
			],
			answer: choose(rng, tagOption(caught ? 'h2' : container), [tagOption(caught ? container : 'h2'), tagOption('p'), tagOption(container === 'body' ? 'html' : 'body'), tagOption('h1')]),
			params: { case: 'aperto', target: paragraphs[target], fragment: rows.join('\n') + '\n' }
		};
	}
	const name = rng.pick(INVENTED);
	const [title, sentence] = rng.pick(SECTIONS);
	return {
		prompt: 'Il browser non si ferma mai davanti a un errore.',
		problem: `In HTML il tag <${name}> non esiste. Come mostra il browser il testo "${title}" di questo frammento?`,
		listing: `<${name}>${title}</${name}>\n<p>${sentence}</p>\n`,
		solution: 'Come testo normale, senza nessun avviso.',
		steps: [`Il browser tiene <${name}> come un elemento che non conosce: non gli dà nessun aspetto e nessun significato.`, 'Il testo al suo interno viene mostrato come testo normale, e la pagina non segnala errori: per trovarli serve un validatore.'],
		answer: choose(rng, textOption('come testo normale, senza avvisi', 'normale'), [textOption('grande e in grassetto, come un titolo', 'titolo'), textOption('non lo mostra', 'niente'), textOption('al suo posto mette un messaggio di errore', 'errore')]),
		params: { case: 'sconosciuto', tag: name, text: title, fragment: `<${name}>${title}</${name}>\n<p>${sentence}</p>\n` }
	};
}

export default makeCodeGenerator(ID, 'Struttura di una pagina HTML', {
	1: { label: 'Lo scheletro della pagina', constraints: ['a whole skeleton shown, of at most 12 rows', 'the text of title differs from every text of the body'], build: level1 },
	2: { label: 'Titoli e paragrafi', constraints: ['paragraphs written on more rows than they are', 'one h1 and no level skipped going down in the right option'], build: level2 },
	3: { label: 'Le parti della pagina', constraints: ['a page with header, nav, main and footer', 'h1 in header in body, title in head'], build: level3 },
	4: { label: "L'albero del documento", constraints: ['a page of at most 18 rows', 'the answer is read from the tree of the fragment'], build: level4 },
	5: { label: 'Commenti ed errori', constraints: ['comments, a heading left open, a tag that does not exist', 'the answer is what a browser builds'], build: level5 }
});
