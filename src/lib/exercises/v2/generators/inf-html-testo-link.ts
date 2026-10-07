/**
 * Testo, link e immagini. Spec: specs/exercises/inf-html-testo-link.md
 *
 * Five levels from the lesson (docs/lezioni/informatica/riscritte/89-inf-html-testo-link.md), all multiple choice on
 * real fragments of HTML: emphasis and line breaks, where a relative link leads, the relative path to write, links
 * to other sites and to a point of the page, images. The paths are worked out by the functions the figure of the
 * lesson uses (src/lib/informatica/percorsi-sito.ts); the independent check resolves them again by itself.
 */
import type { Rng } from '../types';
import { choose, listingOption, makeCodeGenerator, shuffle, textOption, type CodeBuilt } from '../inf-codice';
import { cartellaDi, cartelle, nomeDi, relativo, risolvi } from '../../../informatica/percorsi-sito';

export const ID = 'inf-html-testo-link';

const few = <T>(rng: Rng, xs: readonly T[], n: number): T[] => shuffle(rng, xs).slice(0, n);
const numberOption = (n: number) => textOption(String(n));

// ---------------------------------------------------------------------------
// Level 1: emphasis and line breaks

/** A sentence in two rows with two words to mark and two left plain: [before, word, after] for each row. */
const MARKED = [
	{ rows: [['Suoniamo ', 'venerdì', ','], ['ingresso ', 'libero', '.']], plain: ['Suoniamo', 'ingresso'] },
	{ rows: [['Portate la ', 'merenda', ','], ['si torna ', 'tardi', '.']], plain: ['Portate', 'torna'] },
	{ rows: [['Prove di ', 'martedì', ','], ['non di ', 'giovedì', '.']], plain: ['Prove', 'non'] },
	{ rows: [['Si parte alle ', 'sette', ','], ['siate ', 'puntuali', '.']], plain: ['parte', 'siate'] },
	{ rows: [['Tema per ', 'domani', ','], ['scritto a ', 'penna', '.']], plain: ['Tema', 'scritto'] },
	{ rows: [['Palestra ', 'chiusa', ','], ['oggi in ', 'cortile', '.']], plain: ['Palestra', 'oggi'] },
	{ rows: [['Torneo di ', 'sabato', ','], ['finale ', 'domenica', '.']], plain: ['Torneo', 'finale'] },
	{ rows: [['Suoniamo solo ', 'rock', ','], ['niente ', 'cover', '.']], plain: ['Suoniamo', 'niente'] }
] as const;

const VERSES = [
	["Suona l'ultima campanella,", 'si svuota il corridoio,', 'noi restiamo qui', 'a suonare ancora.', 'Fuori è già sera.'],
	['Liceo di Borgo Alto', 'via dei Tigli 4', 'secondo piano', 'aula 14', 'suonare forte'],
	['Lunedì: matematica', 'Martedì: prove', 'Mercoledì: riposo', 'Giovedì: prove', 'Venerdì: concerto'],
	['Zaino in spalla,', 'treno delle sette,', 'panino in tasca,', 'si parte per Trieste,', 'si torna domani.']
] as const;

/** Two short words: the first plain, the second marked inside the mark of both. */
const PAIRS = [
	['da', 'oggi'],
	['solo', 'noi'],
	['alle', '18'],
	['in', '3B'],
	['non', 'ora'],
	['per', 'te'],
	['è', 'qui'],
	['a', 'casa']
] as const;

function level1(rng: Rng): CodeBuilt {
	const kind = rng.pick(['aspetto', 'righe', 'annidato'] as const);
	if (kind === 'aspetto') {
		const s = rng.pick(MARKED);
		const tags = rng.next() < 0.5 ? (['strong', 'em'] as const) : (['em', 'strong'] as const);
		const listing = s.rows.map(([before, word, after], i) => `${i === 0 ? '<p>' : '   '}${before}<${tags[i]}>${word}</${tags[i]}>${after}${i === 1 ? '</p>' : ''}`).join('\n') + '\n';
		const ask = rng.pick([
			{ id: 'grassetto', tag: 'strong', text: 'Quale parola di questo paragrafo il browser scrive in grassetto?' },
			{ id: 'corsivo', tag: 'em', text: 'Quale parola di questo paragrafo il browser scrive in corsivo?' },
			{ id: 'importante', tag: 'strong', text: 'Quale parola di questo paragrafo è segnata come importante, da non perdere?' },
			{ id: 'enfasi', tag: 'em', text: "Su quale parola di questo paragrafo è segnata l'enfasi, cioè l'accento della voce?" }
		] as const);
		const right = s.rows[tags.indexOf(ask.tag)][1];
		const other = s.rows[1 - tags.indexOf(ask.tag)][1];
		return {
			prompt: 'Guarda quale elemento racchiude ogni parola.',
			problem: ask.text,
			listing,
			solution: `"${right}", che sta dentro <${ask.tag}>.`,
			steps: [
				ask.tag === 'strong' ? '<strong> segna l’importanza, e il browser lo scrive in grassetto.' : '<em> segna l’enfasi, e il browser lo scrive in corsivo.',
				`"${other}" sta dentro <${ask.tag === 'strong' ? 'em' : 'strong'}>, che dice un’altra cosa; le altre parole non sono dentro nessuno dei due.`
			],
			answer: choose(rng, textOption(right), [textOption(other), ...shuffle(rng, s.plain).map((w) => textOption(w))]),
			params: { case: 'aspetto', ask: ask.id, fragment: listing }
		};
	}
	if (kind === 'righe') {
		for (;;) {
			const verses = rng.pick(VERSES);
			const count = rng.int(3, 5);
			const breaks = Array.from({ length: count - 1 }, () => rng.next() < 0.5);
			const k = breaks.filter(Boolean).length;
			if (k === 0 || k === count - 1) continue;
			const listing = verses.slice(0, count).map((text, i) => `${i === 0 ? '<p>' : '   '}${text}${breaks[i] ? '<br>' : ''}${i === count - 1 ? '</p>' : ''}`).join('\n') + '\n';
			return {
				prompt: 'Conta i <br>, non gli a capo del file.',
				problem: 'In una finestra larga, su quante righe il browser scrive questo paragrafo?',
				listing,
				solution: `${k + 1}: una riga in più per ogni <br>.`,
				steps: [`Gli a capo scritti nel file contano come uno spazio: nel file le righe sono ${count}, ma il browser le mette di seguito.`, `Ogni <br> manda il testo a capo una volta. Qui i <br> sono ${k}, quindi le righe sono ${k} + 1 = ${k + 1}.`],
				answer: choose(rng, numberOption(k + 1), [count, k, 1, k + 2, count + 1].filter((n) => n !== k + 1).map(numberOption)),
				params: { case: 'righe', breaks: k, rows: count, fragment: listing }
			};
		}
	}
	const [first, second] = rng.pick(PAIRS);
	const [outer, inner] = rng.next() < 0.5 ? ['strong', 'em'] : ['em', 'strong'];
	const right = `<${outer}>${first} <${inner}>${second}</${inner}></${outer}>`;
	const wrong = [`<${outer}>${first} <${inner}>${second}</${outer}></${inner}>`, `<${outer}>${first} <${inner}>${second}</${outer}>`, `<${outer}>${first} <${inner}>${second}<${inner}><${outer}>`, `<${outer}>${first} <${inner}>${second}</${inner}>`, `<${outer}>${first} </${inner}>${second}<${inner}></${outer}>`];
	return {
		prompt: 'L’elemento aperto per ultimo si chiude per primo.',
		problem: `Quale frammento segna "${first} ${second}" con <${outer}> e, al suo interno, "${second}" con <${inner}>?`,
		solution: right,
		steps: [`<${inner}> si apre dentro <${outer}>, quindi si chiude prima di lui: </${inner}> e poi </${outer}>.`, 'Un tag di chiusura ha la barra dopo la parentesi angolare, e ogni elemento aperto ha il suo.'],
		solutionListing: right + '\n',
		answer: choose(rng, listingOption(right), few(rng, wrong, 3).map((text) => listingOption(text))),
		params: { case: 'annidato', outer, inner, words: [first, second] }
	};
}

// ---------------------------------------------------------------------------
// The sites of levels 2 and 3

const SITES = [
	['index.html', 'contatti.html', 'concerti/date.html', 'concerti/scaletta.html', 'concerti/natale/foto.html', 'img/logo.png', 'img/palco.jpg'],
	['index.html', 'orario.html', 'classi/3b.html', 'classi/2a.html', 'classi/gite/trieste.html', 'foto/gita.jpg', 'foto/aula.png'],
	['index.html', 'regole.html', 'tornei/maggio.html', 'tornei/finale/tabellone.html', 'pezzi/re.png', 'pezzi/torre.png'],
	['index.html', 'ricette/dolci.html', 'ricette/primi.html', 'ricette/torte/mele.html', 'immagini/torta.jpg', 'note/forno.html'],
	['index.html', 'chi-siamo.html', 'squadre/under16.html', 'squadre/partite/sabato.html', 'squadre/partite/finale.html', 'media/coppa.jpg'],
	['index.html', 'storia.html', 'orto/semina.html', 'orto/raccolto.html', 'orto/attrezzi/zappa.html', 'foto/serra.jpg'],
	['index.html', 'prestiti.html', 'libri/gialli.html', 'libri/fumetti.html', 'libri/autori/elenco.html', 'copertine/giallo.png', 'copertine/manga.png'],
	['index.html', 'coro/prove.html', 'coro/brani.html', 'coro/voci/soprani.html', 'coro/voci/bassi.html', 'audio/saluto.html', 'img/coro.jpg'],
	['index.html', 'film/lista.html', 'film/orari.html', 'film/schede/primo.html', 'locandine/primo.jpg', 'locandine/secondo.jpg']
] as const;

const isPage = (file: string) => file.endsWith('.html');
const up = (folder: string) => folder.split('/').slice(0, -1).join('/');
const join = (...parts: string[]) => parts.filter(Boolean).join('/');

/** A page and a file of a site, with the relative path from the one to the other; `shape` is how the path is made. */
function pair(rng: Rng) {
	const site = rng.pick(SITES);
	const want = rng.pick(['accanto', 'giu', 'su', 'su-giu', 'due-su'] as const);
	const shape = (href: string) => {
		const ups = href.split('/').filter((piece) => piece === '..').length;
		const downs = href.split('/').length - 1 - ups;
		return ups === 0 ? (downs === 0 ? 'accanto' : 'giu') : ups >= 2 ? 'due-su' : downs === 0 ? 'su' : 'su-giu';
	};
	const pairs = site.filter(isPage).flatMap((from) => site.filter((to) => to !== from).map((to) => ({ site, from, to, href: relativo(from, to) })));
	const fitting = pairs.filter((p) => shape(p.href) === want);
	const chosen = rng.pick(fitting.length ? fitting : pairs);
	return { ...chosen, shape: shape(chosen.href) };
}

const LINK_TEXT: Record<string, string> = { html: 'Apri la pagina', png: "Guarda l'immagine", jpg: 'Guarda la foto' };

function level2(rng: Rng): CodeBuilt {
	for (;;) {
		const { site, from, to, href, shape } = pair(rng);
		const here = cartellaDi(from);
		const bare = href.replace(/^(\.\.\/)+/, '');
		// where a student lands who reads the path in another way
		const wrong = [join(here, bare), bare, join(up(here), bare), join(here, nomeDi(to)), nomeDi(to), join(from.replace(/\.html$/, ''), bare), join(up(cartellaDi(to)), nomeDi(to)), ...shuffle(rng, cartelle(site)).map((folder) => join(folder, nomeDi(to)))].filter((path) => path !== to && path !== from);
		if (new Set(wrong).size < 3) continue;
		const listing = `<a href="${href}">\n  ${LINK_TEXT[to.split('.').pop()!]}</a>\n`;
		const ups = href.split('/').filter((piece) => piece === '..').length;
		const after = here.split('/').filter(Boolean).slice(0, -ups || undefined).join('/');
		return {
			prompt: 'Parti dalla cartella della pagina e leggi il percorso un pezzo alla volta.',
			problem: `La pagina ${from} di un sito contiene questo link. Quale file apre?`,
			listing,
			solution: to,
			steps: [
				here ? `La pagina sta nella cartella ${here}: il percorso relativo parte da lì.` : 'La pagina sta nella radice del sito: il percorso relativo parte da lì.',
				ups ? `Ogni .. sale di una cartella: ${ups === 1 ? 'qui ce n’è uno' : `qui sono ${ups}`}, e si arriva ${after ? `in ${after}` : 'nella radice del sito'}.` : 'Nel percorso non c’è nessun "..": non si sale, si resta nella cartella della pagina o si scende.',
				`Da lì ${bare.includes('/') ? `si entra in ${cartellaDi(bare)} e si prende ${nomeDi(bare)}` : `si prende ${bare}`}: il file è ${to}.`
			],
			answer: choose(rng, textOption(to), wrong.map((path) => textOption(path))),
			params: { case: shape, page: from, href, fragment: listing }
		};
	}
}

function level3(rng: Rng): CodeBuilt {
	for (;;) {
		const { site, from, to, href, shape } = pair(rng);
		const here = cartellaDi(from);
		const bare = href.replace(/^(\.\.\/)+/, '');
		const attribute = isPage(to) ? 'href' : 'src';
		const written = (path: string) => `${attribute}="${path}"`;
		const candidates = [to, `../${href}`, href.replace(/^\.\.\//, ''), nomeDi(to), join(here, to), href.replace(/\//g, '\\'), `../${nomeDi(to)}`, bare, `../../${bare}`];
		const wrong = [...new Set(candidates)].filter((path) => {
			const lands = risolvi(site, from, path);
			return path !== href && written(path).length <= 34 && !(lands.tipo === 'file' && lands.percorso === to);
		});
		if (wrong.length < 3 || written(href).length > 34) continue;
		const listing = site.join('\n') + '\n';
		const ups = href.split('/').filter((piece) => piece === '..').length;
		return {
			prompt: 'Conta le cartelle da cui devi uscire, poi quelle in cui devi entrare.',
			problem: `Questi sono i file di un sito. Nella pagina ${from} serve ${isPage(to) ? 'un link alla pagina' : "l'immagine"} ${to}. Quale attributo è scritto bene, con un percorso relativo?`,
			listing,
			solution: written(href),
			steps: [
				here ? `Si parte da ${here}, la cartella della pagina ${nomeDi(from)}.` : `Si parte dalla radice del sito, dove sta ${nomeDi(from)}.`,
				ups ? `Il file non sta in ${here} né in una sua cartella: si esce da ${ups === 1 ? 'una cartella' : `${ups} cartelle`}, con ${'../'.repeat(ups)}` : 'Il file sta nella cartella della pagina o più in basso: non si sale, quindi nessun ../',
				`Poi si scrive quello che resta del percorso: ${bare}. In tutto: ${href}.`
			],
			solutionListing: written(href) + '\n',
			answer: choose(rng, listingOption(written(href), href), few(rng, wrong, 3).map((path) => listingOption(written(path), path))),
			params: { case: shape, page: from, file: to, fragment: listing }
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: other sites, and a point of the page

const DOMAINS = ['liceo.example', 'coro.example', 'gita.example', 'orto.example', 'club.example', 'museo.example'] as const;
const PAGES = ['date.html', 'foto.html', 'news.html', 'orari.html', 'mappa.html'] as const;
const POINTS = [
	['date', 'h2', 'Le date'],
	['luogo', 'p', 'In aula magna.'],
	['contatti', 'h2', 'Contatti'],
	['scaletta', 'h2', 'La scaletta'],
	['prezzi', 'p', 'Ingresso libero.'],
	['foto', 'h2', 'Le foto'],
	['storia', 'h2', 'La nostra storia'],
	['orari', 'p', 'Dalle 18 alle 20.']
] as const;

function level4(rng: Rng): CodeBuilt {
	const kind = rng.pick(['esterno', 'ancora', 'arrivo'] as const);
	if (kind === 'esterno') {
		const domain = rng.pick(DOMAINS);
		const page = rng.pick(PAGES);
		const right = `https://${domain}/${page}`;
		const wrong = [`${domain}/${page}`, `www.${domain}/${page}`, `https//${domain}/${page}`, `../${domain}/${page}`, `https:${domain}/${page}`, `/${domain}/${page}`];
		return {
			prompt: 'Un altro sito si raggiunge solo con un indirizzo assoluto.',
			problem: `In una pagina del tuo sito vuoi un link alla pagina ${page} del sito ${domain}. Che cosa scrivi in href?`,
			solution: right,
			steps: ['Per un file di un altro sito serve un indirizzo assoluto: il protocollo con i due punti e le due barre, il nome del server, il percorso.', `Senza https:// il browser legge ${domain} come il nome di una cartella del tuo sito, e cerca il file lì dentro.`],
			solutionListing: right + '\n',
			answer: choose(rng, listingOption(right), few(rng, wrong, 3).map((text) => listingOption(text))),
			params: { case: 'esterno', domain, page }
		};
	}
	const points = few(rng, POINTS, 3);
	const listing = points.map(([id, tag, text]) => `<${tag} id="${id}">${text}</${tag}>`).join('\n') + '\n';
	const [id, tag, text] = rng.pick(points);
	if (kind === 'ancora') {
		const right = `href="#${id}"`;
		const wrong = [`href="${id}"`, `href=".${id}"`, `href="#${tag}"`, `href="${id}.html"`, `href="#${id[0].toUpperCase()}${id.slice(1)}"`, `id="#${id}"`];
		return {
			prompt: 'Il punto di arrivo si indica con il suo id.',
			problem: `Questi elementi stanno in fondo a una pagina lunga. Quale attributo di un link della stessa pagina porta a "${text}"?`,
			listing,
			solution: right,
			steps: [`"${text}" è l'elemento con id="${id}".`, `Un link a un punto della pagina ha in href il cancelletto seguito da quell'id, scritto uguale: #${id}. Senza cancelletto il browser cercherebbe un file con quel nome.`],
			solutionListing: right + '\n',
			answer: choose(rng, listingOption(right), few(rng, wrong, 3).map((w) => listingOption(w))),
			params: { case: 'ancora', id, text, fragment: listing }
		};
	}
	const others = points.filter((p) => p[0] !== id).map((p) => textOption(p[2]));
	return {
		prompt: 'Cerca l’elemento che ha quel nome nel suo id.',
		problem: `Nella stessa pagina di questi elementi c'è il link <a href="#${id}">Vai</a>. A quale elemento porta?`,
		listing,
		solution: `A "${text}", l'elemento con id="${id}".`,
		steps: [`Il cancelletto dice che la destinazione è un punto di questa pagina: l'elemento con id="${id}".`, `È ${tag === 'p' ? 'il paragrafo' : 'il titolo'} "${text}". Il tag dell'elemento non conta: conta solo l'id.`],
		answer: choose(rng, textOption(text), [...others, textOption(`alla pagina ${id}.html`, 'pagina'), textOption("all'inizio della pagina", 'inizio')]),
		params: { case: 'arrivo', id, fragment: listing }
	};
}

// ---------------------------------------------------------------------------
// Level 5: images

const IMAGES = [
	['img/palco.jpg', 'Il gruppo sul palco', 'Il gruppo'],
	['img/logo.png', 'Il logo: un disco', 'Il logo'],
	['foto/gita.jpg', 'La 3B a Trieste', 'La gita'],
	['foto/orto.jpg', "L'orto a maggio", "L'orto"],
	['img/coppa.png', 'La coppa del torneo', 'La coppa'],
	['img/mappa.png', 'La mappa della scuola', 'La mappa'],
	['foto/coro.jpg', 'Il coro in aula magna', 'Il coro'],
	['img/torta.jpg', 'Una torta di mele', 'La torta']
] as const;
/** The sides of a picture, as a ratio: width to height. */
const RATIOS = [
	[2, 1],
	[3, 2],
	[4, 3],
	[1, 1],
	[3, 1],
	[5, 4],
	[2, 3],
	[3, 4]
] as const;

function level5(rng: Rng): CodeBuilt {
	const kind = rng.pick(['alt', 'misure', 'scritta'] as const);
	const [src, alt, text] = rng.pick(IMAGES);
	const name = nomeDi(src);
	if (kind === 'alt') {
		const listing = `<img src="${src}"\n     alt="${alt}">\n`;
		const who = rng.pick(['manca', 'voce'] as const);
		return {
			prompt: 'Uno degli attributi dice che cosa mettere al posto dell’immagine.',
			problem: who === 'manca' ? `Il file ${src} è stato cancellato dal sito. Che cosa mostra il browser al posto di questa immagine?` : 'Un programma legge ad alta voce la pagina a chi non vede lo schermo. Che cosa dice quando arriva a questa immagine?',
			listing,
			solution: `"${alt}", il testo di alt.`,
			steps: ['alt è il testo alternativo: prende il posto dell’immagine ogni volta che l’immagine non c’è o non si può vedere.', `Qui alt vale "${alt}". Il valore di src è solo il percorso del file.`],
			answer: choose(rng, textOption(alt), [textOption(src), textOption(name), textOption('niente: resta uno spazio vuoto', 'niente'), textOption('la parola "img"', 'img')]),
			params: { case: 'alt', who, fragment: listing }
		};
	}
	if (kind === 'misure') {
		for (;;) {
			const [a, b] = rng.pick(RATIOS);
			const unit = rng.pick([100, 150, 200, 300, 400]);
			const [fileW, fileH] = [a * unit, b * unit];
			const small = rng.pick([20, 25, 30, 40, 50, 60]);
			if (small >= unit) continue;
			const side = rng.pick(['width', 'height'] as const);
			const given = side === 'width' ? a * small : b * small;
			const right = side === 'width' ? b * small : a * small;
			const listing = `<img src="${src}"\n     alt="${alt}"\n     ${side}="${given}">\n`;
			const [asked, other] = side === 'width' ? ['alta', fileH] : ['larga', fileW];
			const mine = side === 'width' ? fileW : fileH;
			const wrong = [other, given, other - (mine - given), Math.round((given * mine) / other), given * 2, Math.round(other / 2)].filter((n) => n > 0 && n !== right);
			if (new Set(wrong).size < 3) continue;
			return {
				prompt: 'Con una misura sola il browser tiene le proporzioni del file.',
				problem: `Il file ${name} è largo ${fileW} pixel e alto ${fileH}. Con questo tag, quanti pixel viene ${asked} l'immagine nella pagina?`,
				listing,
				solution: `${right} pixel.`,
				steps: [
					`Il tag dà solo ${side}: l'altra misura la calcola il browser, tenendo le proporzioni del file.`,
					side === 'width' ? `Nel file l'altezza è ${fileH} : ${fileW} della larghezza, cioè ${b} : ${a}. Con una larghezza di ${given} pixel l'altezza è ${given} · ${b} : ${a} = ${right} pixel.` : `Nel file la larghezza è ${fileW} : ${fileH} dell'altezza, cioè ${a} : ${b}. Con un'altezza di ${given} pixel la larghezza è ${given} · ${a} : ${b} = ${right} pixel.`
				],
				answer: choose(rng, numberOption(right), wrong.map(numberOption)),
				params: { case: 'misure', file: [fileW, fileH], side, given, fragment: listing }
			};
		}
	}
	const short = name;
	const right = `<img src="${short}"\n     alt="${text}">\n`;
	const wrong = [`<img href="${short}"\n     alt="${text}">\n`, `<img src="${short}">\n`, `<img alt="${text}">\n  ${short}\n</img>\n`, `<image src="${short}"\n       alt="${text}">\n`, `<img src="${text}"\n     alt="${short}">\n`, `<img>${short}</img>\n`];
	return {
		prompt: 'Servono due attributi: dove sta il file, e che cosa dire al suo posto.',
		problem: `Quale tag mette nella pagina l'immagine ${short}, con il testo alternativo "${text}"?`,
		solution: 'Il tag <img> con src per il file e alt per il testo alternativo, senza tag di chiusura.',
		steps: ['L’elemento si chiama img, e il file si indica con src: href è dei link.', 'alt porta il testo alternativo, e non va lasciato fuori.', '<img> non ha contenuto: il nome del file non si scrive tra due tag, e il tag di chiusura non c’è.'],
		solutionListing: right,
		answer: choose(rng, listingOption(right), few(rng, wrong, 3).map((w) => listingOption(w))),
		params: { case: 'scritta', src: short, alt: text }
	};
}

export default makeCodeGenerator(ID, 'Testo, link e immagini', {
	1: { label: 'Enfasi e a capo', constraints: ['one word in em and one in strong', 'a paragraph with fewer br than rows', 'one fragment nested well'], build: level1 },
	2: { label: 'Dove porta un link', constraints: ['a page of a site and a relative path written in it', 'the right option is the file the path leads to'], build: level2 },
	3: { label: 'Scrivere un percorso relativo', constraints: ['the files of a site, a page and a file to reach', 'only the right path leads to the file'], build: level3 },
	4: { label: 'Altri siti e punti della pagina', constraints: ['an absolute address has protocol, server and path', 'a link to a point is # and the id'], build: level4 },
	5: { label: 'Le immagini', constraints: ['src and alt', 'one side given: the other keeps the ratio of the file, a whole number'], build: level5 }
});
