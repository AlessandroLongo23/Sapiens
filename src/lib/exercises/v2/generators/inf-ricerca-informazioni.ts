/**
 * Cercare e valutare le informazioni in rete. Spec: specs/exercises/inf-ricerca-informazioni.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/38-inf-ricerca-informazioni.md), all multiple
 * choice: the phases of a search engine; from a question to its keywords; the search written with an operator; the
 * page a search finds; the four questions on a source; comparing and citing sources (independent sources counted,
 * the missing element of a citation, true and false statements).
 */
import { choose, makeGenerator, shuffle, textOption, type Built } from '../inf-programmi';
import { cap, list, statementLevel, take, the, type Statement } from '../inf-web2';
import type { Rng } from '../types';

export const ID = 'inf-ricerca-informazioni';

const TOPICS = ['sui vulcani', 'sui ghiacciai alpini', 'sulle api', 'sul sistema solare', 'sulla Divina Commedia', 'sui terremoti', 'sulle energie rinnovabili', 'sulla rivoluzione francese', 'sui dinosauri', 'sulla raccolta differenziata'];

// ---------------------------------------------------------------------------
// Level 1: how a search engine works

const PHASES = {
	esplorazione: 'Esplorazione',
	indicizzazione: 'Indicizzazione',
	ordinamento: 'Ordinamento',
	tu: 'Nessuna: è un lavoro che resta a te'
} as const;
type Phase = keyof typeof PHASES;

/** What is done, on pages about a topic T, and the phase it belongs to. */
const WORKS: [Phase, (T: string) => string][] = [
	['esplorazione', (T) => `Un programma apre una pagina ${T}, la legge e segue i suoi link verso altre pagine.`],
	['esplorazione', (T) => `Il crawler arriva per la prima volta a una pagina ${T} appena pubblicata, seguendo un link.`],
	['esplorazione', (T) => `Un programma automatico passa da una pagina ${T} a quelle collegate, senza fermarsi mai.`],
	['indicizzazione', (T) => `Il motore registra in un elenco, parola per parola, in quali pagine ${T} compare ciascuna.`],
	['indicizzazione', (T) => `Con le pagine ${T} già lette, il motore costruisce un elenco simile all'indice analitico di un libro.`],
	['indicizzazione', (T) => `Il motore annota, accanto a una parola, l'indirizzo di una pagina ${T} che la contiene.`],
	['ordinamento', (T) => `Tra le pagine ${T} che contengono le tue parole, il motore decide quale mostrare per prima.`],
	['ordinamento', (T) => `Il motore stima quali pagine ${T} ti saranno più utili, guardando anche quante altre pagine le linkano.`],
	['ordinamento', (T) => `Il motore mette in fila i risultati ${T}, tenendo conto della lingua e del luogo da cui cerchi.`],
	['tu', (T) => `Decidere se una pagina ${T} trovata tra i risultati dice il vero.`],
	['tu', (T) => `Scegliere le parole chiave da scrivere per trovare pagine ${T}.`],
	['tu', (T) => `Controllare chi ha scritto una pagina ${T}, e con quali prove.`]
];
const PHASE_WHY: Record<Phase, string> = {
	esplorazione: "Aprire le pagine, leggerle e seguirne i link è il lavoro del crawler: è l'esplorazione.",
	indicizzazione: "Costruire l'elenco che per ogni parola dice in quali pagine compare è l'indicizzazione: quell'elenco è l'indice.",
	ordinamento: "Mettere in ordine le pagine che contengono le tue parole, stimando quali ti saranno più utili, è l'ordinamento.",
	tu: "Il motore confronta parole e mette in ordine: scegliere le parole giuste e decidere di quali pagine fidarsi tocca a chi cerca. L'ordine dei risultati non è una classifica di verità."
};

const ENGINE_TRUE: Statement[] = [
	{ id: 't1', text: 'Il motore consulta un indice preparato prima, non legge il web nel momento della ricerca', why: 'Leggere il web a ogni ricerca richiederebbe giorni: il motore consulta un indice che ha preparato prima.' },
	{ id: 't2', text: 'Una pagina protetta da password non compare tra i risultati', why: 'Il crawler non entra nelle pagine protette da password, come il registro elettronico: tra i risultati non compaiono.' },
	{ id: 't3', text: 'Una pagina che il crawler non ha mai raggiunto non compare tra i risultati, anche se esiste', why: "Nell'indice ci sono solo le pagine che il crawler ha letto: una pagina mai raggiunta non compare, anche se esiste." },
	{ id: 't4', text: 'Il motore trova le pagine che contengono le parole che hai scritto', why: 'Il motore confronta parole: trova le pagine che usano le parole che hai scritto.' },
	{ id: 't5', text: 'I primi risultati possono essere annunci a pagamento', why: 'I primi posti possono essere annunci a pagamento, segnati da una scritta come Sponsorizzato.' },
	{ id: 't6', text: 'Una pagina sbagliata ma molto linkata può stare sopra una pagina corretta', why: "L'ordine stima pertinenza e popolarità: una pagina sbagliata ma molto linkata può stare sopra una corretta." },
	{ id: 't7', text: "L'ordine dei risultati dipende anche dalla lingua e dal luogo da cui cerchi", why: "L'algoritmo che ordina i risultati tiene conto anche della lingua e del luogo da cui cerchi." },
	{ id: 't8', text: "L'indirizzo di un risultato dice chi pubblica la pagina, prima ancora di aprirla", why: "Nell'indirizzo di un risultato c'è il nome di dominio, che dice chi pubblica la pagina." }
];
const ENGINE_FALSE: Statement[] = [
	{ id: 'f1', text: 'Quando premi Invio il motore legge tutto il web in quel momento', why: 'Il motore non legge il web nel momento della ricerca: consulta un indice preparato prima.' },
	{ id: 'f2', text: 'Il primo risultato è sempre il più affidabile', why: "Il primo risultato non è il più affidabile: l'ordine stima pertinenza e popolarità, e in cima possono esserci annunci." },
	{ id: 'f3', text: 'Tra i risultati compaiono anche le pagine protette da password', why: 'Le pagine dietro una password, come il registro elettronico, non compaiono tra i risultati.' },
	{ id: 'f4', text: "L'ordine dei risultati è una classifica di verità", why: "L'ordine dei risultati non è una classifica di verità: dipende da una stima di pertinenza e di popolarità." },
	{ id: 'f5', text: 'Il motore trova le pagine che rispondono a quello che avevi in mente, qualunque parola usino', why: 'Il motore confronta parole: trova le pagine che usano le parole scritte, non quelle che rispondono a ciò che avevi in mente.' },
	{ id: 'f6', text: 'Un risultato segnato come Sponsorizzato sta in alto perché è il più corretto', why: 'Un risultato sponsorizzato sta in alto perché qualcuno ha pagato: è un annuncio.' },
	{ id: 'f7', text: 'Ogni pagina che esiste sul web compare tra i risultati', why: 'Compaiono solo le pagine che il crawler ha raggiunto e messo nell\'indice.' },
	{ id: 'f8', text: 'Una pagina con molti link da altre pagine dice di sicuro la verità', why: 'I link misurano la popolarità di una pagina, non la verità di quello che dice.' }
];

function level1(rng: Rng): Built {
	const prompt = 'Ragiona su come lavora un motore di ricerca.';
	if (rng.next() < 0.5) return { ...statementLevel(rng, ENGINE_TRUE, ENGINE_FALSE, 'sui motori di ricerca', prompt) };
	const work = rng.int(0, WORKS.length - 1);
	const topic = rng.int(0, TOPICS.length - 1);
	const [phase, text] = WORKS[work];
	const o = (p: Phase) => textOption(PHASES[p], p);
	return {
		prompt,
		problem: `${text(TOPICS[topic])} Di quale fase del lavoro di un motore di ricerca si tratta?`,
		solution: PHASES[phase],
		steps: [PHASE_WHY[phase], "Il motore lavora in tre fasi: esplora le pagine, costruisce l'indice, e a ogni ricerca mette in ordine le pagine che contengono le tue parole."],
		answer: choose(
			rng,
			o(phase),
			(Object.keys(PHASES) as Phase[]).filter((p) => p !== phase).map(o)
		),
		params: { case: 'fase', work, topic }
	};
}

// ---------------------------------------------------------------------------
// Level 2: from the question to the keywords

/** What you want to know, the precise keywords, vague everyday words, one word alone. */
const QUESTIONS: [string, string, string, string, string][] = [
	['q1', 'perché i ghiacciai delle Alpi si stanno riducendo', 'ritiro ghiacciai alpini cause', 'ghiaccio che sparisce in montagna', 'ghiacciai'],
	['q2', 'di quanto si è ridotta la superficie dei ghiacciai delle Alpi', 'ghiacciai alpini superficie misure', 'ghiaccio che diventa più piccolo', 'Alpi'],
	['q3', 'come nasce un terremoto', 'terremoto origine faglia placche', 'terra che trema forte', 'terremoti'],
	['q4', 'che cosa mangiano le api in inverno', 'api alimentazione inverno scorte', 'cibo degli insetti quando fa freddo', 'api'],
	['q5', 'come funziona un pannello fotovoltaico', 'pannello fotovoltaico funzionamento cella', 'cosa che fa corrente con il sole', 'energia'],
	['q6', 'quali furono le cause della rivoluzione francese', 'rivoluzione francese cause 1789', 'rivolta in Francia tanto tempo fa', 'Francia'],
	['q7', 'come avviene la fotosintesi nelle foglie', 'fotosintesi clorofilliana foglie fasi', 'piante che mangiano la luce', 'piante'],
	['q8', 'perché la Luna cambia forma durante il mese', 'fasi lunari spiegazione', 'luna strana di notte', 'Luna'],
	['q9', 'quanta plastica finisce ogni anno nel Mediterraneo', 'plastica Mediterraneo tonnellate anno', 'sporcizia buttata nel mare', 'plastica'],
	['q10', "come si calcola l'area di un trapezio", 'area trapezio formula', 'conto della figura con quattro lati', 'geometria'],
	['q11', 'perché i vulcani eruttano', 'eruzione vulcanica cause magma', 'montagna che butta fuoco', 'vulcani'],
	['q12', 'come si ricicla il vetro delle bottiglie', 'riciclo vetro processo fasi', 'bottiglie buttate che tornano nuove', 'rifiuti'],
	['q13', 'che cosa provoca le maree', 'maree cause attrazione lunare', 'mare che va su e giù', 'mare'],
	['q14', 'quanta acqua consuma una doccia di cinque minuti', 'consumo acqua doccia litri', 'acqua usata per lavarsi', 'acqua'],
	['q15', 'come si orientano gli uccelli migratori', 'uccelli migratori orientamento campo magnetico', 'uccelli che sanno la strada', 'uccelli'],
	['q16', 'quando e perché fu costruito il Colosseo', 'Colosseo costruzione anno imperatore', 'stadio antico di Roma', 'Roma']
];

function level2(rng: Rng): Built {
	const q = rng.int(0, QUESTIONS.length - 1);
	const [id, want, good, vague, one] = QUESTIONS[q];
	const wrong = take(
		rng,
		[
			textOption(`${want}?`, 'frase'),
			textOption(`vorrei sapere ${want}`, 'cortese'),
			textOption(vague, 'vaga'),
			textOption(one, 'generica'),
			textOption(`${one} ricerca per la scuola`, 'compito')
		],
		3
	);
	return {
		prompt: 'Passa dalla domanda alle parole chiave.',
		problem: `Per una ricerca vuoi sapere ${want}. Che cosa conviene scrivere nel motore?`,
		solution: good,
		steps: [
			'Il motore confronta parole: conviene scrivere quelle che compaiono nella pagina che vorresti trovare, cioè i nomi e i termini precisi che userebbe chi conosce l\'argomento.',
			`Con «${good}» tieni i termini precisi e togli il resto. La frase intera porta pagine generiche, le parole di tutti i giorni non sono quelle di chi ne scrive con competenza, e una parola sola è troppo poco.`
		],
		answer: choose(rng, textOption(good, 'precise'), wrong),
		params: { case: 'parole', question: id, wrong: wrong.map((o) => o.values[0]) }
	};
}

// ---------------------------------------------------------------------------
// Level 3: the search written with an operator

/** The kind of text and the words remembered of it. */
const QUOTES: [string, string, string, string][] = [
	['una poesia', "m'illumino d'immenso", "m'illumino", "d'immenso"],
	['una poesia', 'nel mezzo del cammin', 'mezzo', 'cammin'],
	['un proverbio', 'chi dorme non piglia pesci', 'dorme', 'pesci'],
	['un articolo', 'ritiro dei ghiacciai alpini', 'ritiro', 'alpini'],
	['un discorso', 'un piccolo passo per un uomo', 'passo', 'uomo'],
	['un regolamento', 'cambio di campo obbligatorio', 'cambio', 'obbligatorio'],
	['una canzone popolare', 'quel mazzolin di fiori', 'mazzolin', 'fiori'],
	['un libro', 'quel ramo del lago', 'ramo', 'lago'],
	['un proverbio', 'tra il dire e il fare', 'dire', 'fare'],
	['una filastrocca', 'trenta giorni ha novembre', 'trenta', 'novembre']
];
/** The word searched, a word that helps, the word to leave out, "about what", "of what the unwanted results are". */
const MINUS: [string, string, string, string, string][] = [
	['mercurio', 'pianeta', 'metallo', 'sul pianeta Mercurio', 'del metallo'],
	['giaguaro', 'animale', 'auto', "sul giaguaro, l'animale", 'di automobili'],
	['venere', 'pianeta', 'dea', 'sul pianeta Venere', 'della dea'],
	['pesca', 'frutto', 'sport', 'sulla pesca, il frutto', 'dello sport'],
	['delfino', 'animale', 'nuoto', "sul delfino, l'animale", 'dello stile di nuoto'],
	['saturno', 'pianeta', 'mitologia', 'sul pianeta Saturno', 'di mitologia'],
	['calcio', 'minerale', 'sport', 'sul calcio, il minerale', 'dello sport'],
	['puma', 'animale', 'scarpe', "sul puma, l'animale", 'di scarpe'],
	['ariete', 'animale', 'oroscopo', "sull'ariete, l'animale", 'di oroscopi'],
	['lira', 'strumento', 'moneta', 'sulla lira, lo strumento musicale', 'della vecchia moneta'],
	['marte', 'pianeta', 'dio', 'sul pianeta Marte', 'del dio romano'],
	['riso', 'cereale', 'risate', 'sul riso, il cereale', 'di risate']
];
const SITES: [string, string][] = [
	['universita.example', "dell'università"],
	['scuola.example', 'della scuola'],
	['comune.example', 'del comune'],
	['museo.example', 'del museo'],
	['biblioteca.example', 'della biblioteca']
];
const SUBJECTS = ['ghiacciai alpini', 'orario lezioni', 'borse di studio', 'raccolta differenziata', 'mostra dinosauri', 'corso di nuoto', 'energie rinnovabili', 'sistema solare', 'gita scolastica', 'torneo pallavolo', 'storia del quartiere', 'menu mensa'];
const PAIRS: [string, string][] = [
	['ghiacciaio', 'nevaio'],
	['automobile', 'macchina'],
	['medico', 'dottore'],
	['bici', 'bicicletta'],
	['insegnante', 'docente'],
	['tv', 'televisione'],
	['pc', 'computer'],
	['foto', 'fotografia'],
	['aereo', 'aeroplano'],
	['moto', 'motocicletta'],
	['frigo', 'frigorifero'],
	['metro', 'metropolitana']
];

function level3(rng: Rng): Built {
	const op = rng.pick(['frase', 'meno', 'sito', 'formato', 'oppure'] as const);
	const prompt = "Scrivi la ricerca con l'operatore giusto.";
	let problem: string;
	let right: string;
	let wrong: string[];
	let why: string;
	let need: Record<string, unknown>;
	if (op === 'frase') {
		const [kind, phrase] = rng.pick(QUOTES);
		problem = `Di ${kind} ricordi solo le parole «${phrase}», e vuoi le pagine che le contengono proprio così, nello stesso ordine. Che cosa scrivi nel motore?`;
		right = `"${phrase}"`;
		wrong = [phrase, phrase.split(' ').join(' OR '), ...shuffle(rng, [`site:${phrase}`, `-"${phrase}"`])];
		why = 'Le virgolette chiedono le pagine con quella frase esatta, parole nello stesso ordine. Senza virgolette il motore cerca le parole anche lontane tra loro.';
		need = { phrase };
	} else if (op === 'meno') {
		const [word, help, out, about, ofOut] = rng.pick(MINUS);
		problem = `Cerchi notizie ${about}, ma molti risultati parlano ${ofOut}. Che cosa scrivi per togliere le pagine che contengono la parola «${out}»?`;
		right = `${word} ${help} -${out}`;
		wrong = take(rng, [`${word} ${help} - ${out}`, `${word} ${help} "${out}"`, `${word} ${help} OR ${out}`, `${word} ${help} non ${out}`, `-${word} ${help} ${out}`], 3);
		why = 'Il meno, attaccato alla parola senza spazio, toglie le pagine che la contengono. Staccato dalla parola non funziona, e le virgolette farebbero il contrario: chiederebbero proprio quella parola.';
		need = { words: [word, help], exclude: out };
	} else if (op === 'sito') {
		const [domain, of] = rng.pick(SITES);
		const subject = rng.pick(SUBJECTS);
		problem = `Cerchi le parole ${subject}, ma solo tra le pagine del sito ${of}, che ha il dominio ${domain}: che cosa scrivi nel motore?`;
		right = `${subject} site:${domain}`;
		wrong = take(rng, [`${subject} ${domain}`, `${subject} "${domain}"`, `${subject} filetype:${domain}`, `${subject} -${domain}`, `${subject} site: ${domain}`], 3);
		why = "L'operatore site: seguito dal dominio, senza spazio, limita la ricerca alle pagine di quel sito. Il dominio scritto da solo è una parola come le altre.";
		need = { words: subject.split(' '), site: domain };
	} else if (op === 'formato') {
		const subject = rng.pick(SUBJECTS);
		problem = `Cerchi le parole ${subject}, ma vuoi solo documenti in formato PDF. Che cosa scrivi nel motore?`;
		right = `${subject} filetype:pdf`;
		wrong = take(rng, [`${subject} pdf`, `${subject} site:pdf`, `${subject} "pdf"`, `${subject} -pdf`, `${subject} OR pdf`], 3);
		why = "L'operatore filetype: seguito dall'estensione limita la ricerca ai file di quel formato. La parola pdf da sola cerca le pagine che la contengono, di qualunque formato.";
		need = { words: subject.split(' '), filetype: 'pdf' };
	} else {
		const [a, b] = rng.pick(PAIRS);
		problem = `Vuoi le pagine che contengono la parola «${a}» oppure la parola «${b}»: ti basta una delle due. Che cosa scrivi nel motore?`;
		right = `${a} OR ${b}`;
		wrong = take(rng, [`"${a} ${b}"`, `${a} -${b}`, `${a} ${b}`, `${a} site:${b}`, `${a} filetype:${b}`], 3);
		why = "OR, scritto tra le due parole, chiede le pagine con l'una o con l'altra. Le due parole senza niente in mezzo devono comparire tutte e due; tra virgolette anche attaccate, in quell'ordine.";
		need = { either: [a, b] };
	}
	return {
		prompt,
		problem,
		solution: right,
		steps: [why, `La ricerca da scrivere è: ${right}`],
		answer: choose(
			rng,
			textOption(right),
			wrong.map((w) => textOption(w))
		),
		params: { case: op, ...need, wrong }
	};
}

// ---------------------------------------------------------------------------
// Level 4: the page a search finds

/** A page as an option: where it is, what kind of file, the words it has and the ones it is said not to have. */
interface Page {
	pdf?: boolean;
	site?: string;
	has: string[];
	lacks?: string[];
	apart?: boolean;
}
const q = (w: string) => `«${w}»`;
const pageText = (p: Page) => `${p.pdf ? 'Un file PDF' : 'Una pagina'}${p.site ? ` di ${p.site}` : ''} con ${list(p.has.map(q))}${p.apart ? ' in punti diversi' : ''}${p.lacks?.length ? `, senza ${list(p.lacks.map(q))}` : ''}`;
const WORDS = ['ghiacciai', 'orari', 'iscrizioni', 'dinosauri', 'concerti', 'vulcani', 'terremoti', 'api'];

function level4(rng: Rng): Built {
	const kind = rng.pick(['meno', 'frase', 'sito', 'formato', 'due', 'oppure'] as const);
	let query: string;
	let pages: Page[]; // the right one first
	let why: string;
	const [d, d2] = take(
		rng,
		SITES.map((s) => s[0]),
		2
	);
	const [k, k2] = take(rng, WORDS, 2);
	if (kind === 'meno') {
		const [a, x, b] = rng.pick(MINUS);
		query = `${a} -${b}`;
		pages = [
			{ has: [a], lacks: [b] },
			{ has: [a, b] },
			{ has: [b], lacks: [a] },
			{ has: [x], lacks: [a] }
		];
		why = `La ricerca chiede le pagine con «${a}» e, con il meno, toglie quelle che contengono «${b}».`;
	} else if (kind === 'frase') {
		const [, phrase, w1, w2] = rng.pick(QUOTES);
		query = `"${phrase}"`;
		pages = [{ has: [phrase] }, { has: [w2, w1], apart: true }, { has: [w1], lacks: [w2] }, { has: [w2], lacks: [w1] }];
		why = 'Le virgolette chiedono la frase esatta, con le parole in quell\'ordine: non basta che la pagina contenga alcune di quelle parole, sparse nel testo.';
	} else if (kind === 'sito') {
		query = `${k} site:${d}`;
		pages = [
			{ site: d, has: [k] },
			{ site: d2, has: [k] },
			{ site: d, has: [k2], lacks: [k] },
			{ site: d2, has: [k, d.split('.')[0]] }
		];
		why = `La ricerca chiede la parola «${k}» e, con site:, solo le pagine del sito ${d}. Una pagina di un altro sito che nomina quel sito non conta.`;
	} else if (kind === 'formato') {
		query = `${k} filetype:pdf`;
		pages = [
			{ pdf: true, has: [k] },
			{ has: [k] },
			{ pdf: true, has: [k2], lacks: [k] },
			{ has: [k, 'pdf'] }
		];
		why = `La ricerca chiede la parola «${k}» e, con filetype:, solo i file in formato PDF. Una pagina che contiene la parola «pdf» non è un file PDF.`;
	} else if (kind === 'due') {
		const [a, , b] = rng.pick(MINUS);
		query = `${a} -${b} site:${d}`;
		pages = [
			{ site: d, has: [a], lacks: [b] },
			{ site: d, has: [a, b] },
			{ site: d2, has: [a], lacks: [b] },
			{ site: d, has: [b], lacks: [a] }
		];
		why = `Le condizioni valgono tutte insieme: la pagina deve contenere «${a}», non contenere «${b}» e stare sul sito ${d}.`;
	} else {
		const [a, b] = rng.pick(PAIRS);
		query = `${a} OR ${b}`;
		pages = [{ has: [k], lacks: [a, b] }, { has: [a], lacks: [b] }, { has: [b], lacks: [a] }, { has: [a, b] }];
		why = `OR chiede le pagine con «${a}» oppure con «${b}»: basta una delle due, e vanno bene anche tutte e due. Non viene trovata solo la pagina che non ha nessuna delle due.`;
	}
	const options = pages.map((p) => textOption(pageText(p)));
	return {
		prompt: 'Leggi una ricerca scritta con gli operatori.',
		problem: `Quale di queste ${kind === 'oppure' ? 'non viene' : 'viene'} trovata dalla ricerca «${query}»?`,
		solution: pageText(pages[0]),
		steps: [why, `${kind === 'oppure' ? 'Non viene trovata' : 'Viene trovata'}: ${pageText(pages[0]).charAt(0).toLowerCase() + pageText(pages[0]).slice(1)}.`],
		answer: choose(rng, options[0], options.slice(1)),
		params: { case: kind, query, pages: pages.map(pageText) }
	};
}

// ---------------------------------------------------------------------------
// Level 5: the four questions on a source

const ASKS = { chi: 'Chi scrive?', quando: 'Quando?', prove: 'Con quali prove?', perche: 'Perché?' } as const;
type Ask = keyof typeof ASKS;
const FLAWS: [Ask, string][] = [
	['chi', 'non porta il nome di nessun autore, e il sito non dice a chi appartiene'],
	['chi', 'è firmata solo con un soprannome, e sul sito non c\'è modo di sapere chi c\'è dietro'],
	['chi', "porta la firma di un cantante famoso, che di quell'argomento non si è mai occupato"],
	['quando', 'riporta dei numeri senza dire a quale anno si riferiscono'],
	['quando', 'non ha nessuna data, né di pubblicazione né di aggiornamento'],
	['quando', 'presenta come attuali dei dati di quindici anni fa'],
	['prove', 'fa affermazioni forti senza citare nessuna fonte'],
	['prove', 'ripete «lo dicono gli scienziati» senza dire quali, né dove'],
	['prove', 'mostra un grafico senza dire da dove vengono i dati'],
	['perche', 'sta sul sito di un negozio e finisce invitando a comprare un prodotto di cui parla bene'],
	['perche', 'ha un titolo fatto per stupire, e il testo sotto dice molto meno'],
	['perche', 'promette un segreto che «non ve lo dicono», ed è fatta per essere condivisa']
];
const ASK_WHY: Record<Ask, string> = {
	chi: 'Manca chi scrive, o chi scrive non è competente su quell\'argomento: lo scopre la domanda «Chi scrive?». Un sito che non dice a chi appartiene ti chiede di credere a uno sconosciuto.',
	quando: 'Il problema è la data: lo scopre la domanda «Quando?». Un dato che cambia nel tempo, se è vecchio o senza anno, è un dato che non puoi usare.',
	prove: 'Mancano le prove: lo scopre la domanda «Con quali prove?». Una pagina seria dice da dove vengono le sue affermazioni e ti permette di controllare.',
	perche: 'Il problema è lo scopo: lo scopre la domanda «Perché?». Chi vende non ha interesse a raccontare i difetti, e un titolo fatto per essere cliccato promette più di quello che il testo dice.'
};

const GOOD: [string, string][] = [
	['g1', "L'autore è indicato con il nome ed è competente sull'argomento"],
	['g2', 'La pagina porta la data dell\'ultimo aggiornamento, ed è recente'],
	['g3', 'I dati sono citati con la loro origine, e puoi andare a controllare'],
	['g4', 'Lo scopo è informare, e la pagina non vende niente'],
	['g5', "Un'altra fonte, indipendente, dice la stessa cosa"],
	['g6', 'La pagina rimanda alla fonte primaria dei suoi numeri']
];
const BAD: [string, string][] = [
	['b1', 'La grafica è curata e professionale'],
	['b2', "Accanto all'indirizzo c'è il lucchetto"],
	['b3', 'È il primo risultato del motore di ricerca'],
	['b4', 'Ha migliaia di condivisioni'],
	['b5', 'Il sito ha un nome che suona ufficiale'],
	['b6', 'Molti siti riportano la stessa frase con le stesse parole'],
	['b7', 'Il testo è scritto con un tono molto sicuro']
];

function level5(rng: Rng): Built {
	const prompt = 'Valuta una fonte.';
	if (rng.next() < 0.6) {
		const flaw = rng.int(0, FLAWS.length - 1);
		const topic = rng.int(0, TOPICS.length - 1);
		const [ask, text] = FLAWS[flaw];
		const o = (a: Ask) => textOption(ASKS[a], a);
		return {
			prompt,
			problem: `Una pagina ${TOPICS[topic]} ${text}. Quale delle quattro domande sulla fonte fa scoprire il problema?`,
			solution: ASKS[ask],
			steps: [ASK_WHY[ask], 'Le quattro domande sono: chi scrive, quando, con quali prove, perché.'],
			answer: choose(
				rng,
				o(ask),
				(Object.keys(ASKS) as Ask[]).filter((a) => a !== ask).map(o)
			),
			params: { case: 'domanda', flaw, topic }
		};
	}
	const wantGood = rng.next() < 0.5;
	const [rights, wrongs] = wantGood ? [GOOD, BAD] : [BAD, GOOD];
	const right = rng.pick(rights);
	const others = take(rng, wrongs, 3);
	const o = ([id, text]: [string, string]) => textOption(text, id);
	return {
		prompt,
		problem: wantGood ? 'Quale di questi è un buon motivo per fidarti di una pagina?' : 'Quale di questi non è un buon motivo per fidarti di una pagina?',
		solution: right[1],
		steps: [
			'Una fonte si valuta da chi scrive, da quando, dalle prove che porta e dallo scopo, e si confronta con altre fonti indipendenti.',
			"La grafica curata, il nome che suona ufficiale, il lucchetto, la posizione tra i risultati, il tono sicuro e il numero di condivisioni o di copie non dicono se il contenuto è vero: il lucchetto, per esempio, indica solo che la connessione è cifrata."
		],
		answer: choose(rng, o(right), others.map(o)),
		params: { case: wantGood ? 'motivo' : 'non motivo', ids: [right[0], ...others.map((x) => x[0])] }
	};
}

// ---------------------------------------------------------------------------
// Level 6: comparing and citing sources

const FACTS = ['quanti abitanti ha una città', 'la superficie di un ghiacciaio', "l'altezza di una montagna", 'quante specie di api vivono in Italia', "la data di un'eruzione", 'quanta plastica finisce in mare ogni anno'];
const ORIGINS = ['un comunicato', 'un vecchio articolo', 'un post', "una voce di un'enciclopedia in rete"];
const sources = (n: number) => textOption(n === 1 ? '1 fonte' : `${n} fonti`, String(n));

const AUTHORS = ['M. Verdi', 'L. Neri', 'G. Riva', 'A. Costa', 'S. Galli', 'P. Ferri'];
const CITED: [string, string, string][] = [
	['Il ritiro dei ghiacciai alpini', 'Università di Esempio', 'https://universita.example/ghiacciai'],
	["Le api e l'inverno", 'Museo di Scienze di Esempio', 'https://museo.example/api'],
	['Come nasce un terremoto', 'Osservatorio di Esempio', 'https://osservatorio.example/terremoti'],
	['La raccolta differenziata in città', 'Comune di Esempio', 'https://comune.example/rifiuti'],
	['Le fasi della Luna', 'Planetario di Esempio', 'https://planetario.example/luna'],
	['Storia della biblioteca', 'Biblioteca di Esempio', 'https://biblioteca.example/storia'],
	['Le eruzioni del Novecento', 'Istituto di Esempio', 'https://istituto.example/eruzioni'],
	['Quanta acqua consumiamo', 'Agenzia di Esempio', 'https://agenzia.example/acqua']
];
const MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio'];
const PARTS = {
	autore: "L'autore",
	titolo: 'Il titolo della pagina',
	sito: 'Il nome del sito',
	indirizzo: "L'indirizzo della pagina",
	data: 'La data di consultazione'
} as const;
type Part = keyof typeof PARTS;
const PART_WHY: Record<Part, string> = {
	autore: "Manca l'autore: senza sapere chi scrive, chi legge non può valutare la fonte.",
	titolo: 'Manca il titolo della pagina, che dice di che cosa parla il documento citato.',
	sito: 'Manca il nome del sito, cioè chi pubblica la pagina.',
	indirizzo: "Manca l'indirizzo: senza quello chi legge non può aprire la pagina e controllare.",
	data: 'Manca la data in cui la pagina è stata consultata: serve perché le pagine cambiano.'
};

const SOURCE_TRUE: Statement[] = [
	{ id: 't1', text: 'Dieci siti che riportano la stessa frase con le stesse parole valgono come una fonte sola', why: 'Dieci siti con la stessa frase quasi sempre l\'hanno copiata da un\'unica origine: sono una fonte sola.' },
	{ id: 't2', text: "Due fonti sono indipendenti se sono arrivate all'informazione ognuna per conto suo", why: "Due fonti indipendenti sono arrivate all'informazione ognuna per conto suo, senza copiarsi." },
	{ id: 't3', text: 'La fonte primaria è chi ha fatto la misura o scritto il documento originale', why: 'La fonte primaria è quella da cui un dato nasce: chi ha fatto la misura o scritto il documento originale.' },
	{ id: 't4', text: "Per sapere chi c'è dietro un sito conviene cercarne il nome in un'altra scheda", why: "Per sapere chi c'è dietro un sito si esce dalla pagina e si cerca che cosa ne dicono gli altri." },
	{ id: 't5', text: "Di una voce di un'enciclopedia collaborativa conviene aprire le note e controllare le fonti", why: "La parte più utile di una voce di un'enciclopedia collaborativa sono le note, che portano alle fonti: si controllano e si citano quelle." },
	{ id: 't6', text: 'Un assistente artificiale può scrivere un dato inventato con lo stesso tono sicuro di uno corretto', why: 'Un assistente artificiale scrive con lo stesso tono sicuro i dati corretti e quelli inventati: va controllato come ogni fonte senza autore.' },
	{ id: 't7', text: "Nella citazione di una pagina web si scrive anche la data in cui l'hai consultata", why: 'Nella citazione di una pagina web si scrive la data di consultazione, perché le pagine cambiano.' },
	{ id: 't8', text: 'Incollare un paragrafo senza virgolette e senza fonte è plagio, anche se la pagina è libera da leggere', why: 'Copiare un paragrafo senza virgolette e senza fonte è plagio, anche quando la pagina è liberamente leggibile.' },
	{ id: 't9', text: 'Due numeri diversi possono essere entrambi corretti, ciascuno per il suo anno', why: 'Un dato che cambia nel tempo ha un valore per ogni anno: due numeri diversi possono essere entrambi corretti.' }
];
const SOURCE_FALSE: Statement[] = [
	{ id: 'f1', text: "Se dieci siti riportano la stessa frase, l'informazione è confermata dieci volte", why: 'Dieci copie della stessa frase sono una fonte sola: dieci copie di un errore restano un errore.' },
	{ id: 'f2', text: 'Per fidarsi di un sito basta leggere la sua pagina Chi siamo', why: 'La pagina Chi siamo l\'ha scritta il sito stesso: conviene cercare che cosa ne dicono gli altri.' },
	{ id: 'f3', text: 'Se un assistente artificiale risponde con tono sicuro, il dato è di sicuro corretto', why: 'Il tono sicuro di un assistente artificiale non garantisce niente: la risposta può contenere dati inventati.' },
	{ id: 'f4', text: 'Una pagina liberamente leggibile si può copiare nella ricerca senza citarla', why: 'Anche una pagina liberamente leggibile va citata: copiarla senza fonte è plagio.' },
	{ id: 'f5', text: 'In una citazione la data di consultazione non serve, perché le pagine non cambiano', why: 'Le pagine cambiano: per questo nella citazione si scrive la data di consultazione.' },
	{ id: 'f6', text: "Di una voce di un'enciclopedia collaborativa non serve guardare le note", why: "Le note di una voce sono la sua parte più utile: portano alle fonti da controllare e da citare." },
	{ id: 'f7', text: "Per un'informazione che conta basta una sola fonte, se è scritta bene", why: "Per un'informazione che conta nessuna fonte basta da sola: se ne cerca almeno un'altra, indipendente." },
	{ id: 'f8', text: 'Se tre pagine danno tre numeri diversi, due sono per forza sbagliati', why: 'Numeri diversi possono essere corretti ciascuno per il suo anno: prima di scegliere si guardano le date e l\'origine.' },
	{ id: 'f9', text: 'Due siti che hanno copiato lo stesso testo sono due fonti indipendenti', why: 'Due siti che hanno copiato lo stesso testo non sono indipendenti: contano come una fonte sola.' }
];

function level6(rng: Rng): Built {
	const prompt = 'Confronta e cita le fonti.';
	const r = rng.next();
	if (r < 0.35) {
		const k = rng.int(3, 9);
		const m = rng.int(1, 3);
		const fact = rng.int(0, FACTS.length - 1);
		const origin = rng.int(0, ORIGINS.length - 1);
		const right = m + 1;
		return {
			prompt,
			problem: `Cerchi ${FACTS[fact]}. Trovi il dato su ${k} siti che riportano la stessa frase con le stesse parole, copiata da ${ORIGINS[origin]}, e su ${m === 1 ? 'un altro sito, che ha' : `altri ${m} siti, ognuno dei quali ha`} raccolto il dato per conto suo. Quante fonti indipendenti hai?`,
			solution: `${right} fonti`,
			steps: [`${cap(the(k))} ${k} siti con la stessa frase l'hanno copiata da un'unica origine: contano come una fonte sola.`, `A questa si ${m === 1 ? 'aggiunge il sito che ha' : `aggiungono i ${m} siti che hanno`} raccolto il dato per conto ${m === 1 ? 'suo' : 'loro'}: 1 + ${m} = ${right} fonti indipendenti.`],
			answer: choose(rng, sources(right), [sources(k + m), ...shuffle(rng, [sources(k), sources(m), sources(k + 1), sources(k + m + 1)])]),
			params: { case: 'indipendenti', copies: k, others: m, fact, origin }
		};
	}
	if (r < 0.6) {
		const missing = rng.pick(Object.keys(PARTS) as Part[]);
		const author = rng.pick(AUTHORS);
		const page = rng.int(0, CITED.length - 1);
		const [title, site, url] = CITED[page];
		const date = `consultato il ${rng.int(2, 28)} ${rng.pick(MONTHS)} 2026`;
		const pieces: [Part, string][] = [
			['autore', author],
			['titolo', `"${title}"`],
			['sito', site],
			['indirizzo', url],
			['data', date]
		];
		const citation = `${pieces
			.filter(([p]) => p !== missing)
			.map(([, text]) => text)
			.join(', ')}.`;
		const o = (p: Part) => textOption(PARTS[p], p);
		return {
			prompt,
			problem: `Questa è la citazione di una pagina web: «${citation}» Quale elemento manca?`,
			solution: PARTS[missing],
			steps: ["La citazione di una pagina web ha cinque elementi: l'autore o l'ente, il titolo, il nome del sito, l'indirizzo e la data in cui l'hai consultata.", PART_WHY[missing]],
			answer: choose(
				rng,
				o(missing),
				take(
					rng,
					(Object.keys(PARTS) as Part[]).filter((p) => p !== missing),
					3
				).map(o)
			),
			params: { case: 'citazione', missing, author, page, date }
		};
	}
	return statementLevel(rng, SOURCE_TRUE, SOURCE_FALSE, 'sulle fonti', prompt);
}

export default makeGenerator(ID, 'Cercare e valutare le informazioni in rete', {
	1: { label: 'Come lavora un motore di ricerca', constraints: ["la fase di un lavoro descritto su un argomento (esplorazione, indicizzazione, ordinamento, oppure un lavoro che resta a chi cerca), circa metà; l'affermazione vera tra tre false o la falsa tra tre vere, circa metà"], build: level1 },
	2: { label: 'Dalla domanda alle parole chiave', constraints: ['una domanda tra sedici: le parole chiave precise contro tre tra la frase intera, la richiesta cortese, le parole vaghe, la parola sola, le parole sul compito'], build: level2 },
	3: { label: 'Scrivere la ricerca con un operatore', constraints: ['un bisogno e quattro ricerche scritte: virgolette, meno, site:, filetype:, OR, un quinto ciascuno; le sbagliate usano un altro operatore o lo scrivono male'], build: level3 },
	4: { label: 'Che cosa trova una ricerca', constraints: ['una ricerca con uno o due operatori e quattro pagine descritte: una sola viene trovata (con OR, una sola non viene trovata)'], build: level4 },
	5: { label: 'Le quattro domande su una fonte', constraints: ['il difetto di una pagina e la domanda che lo scopre (circa 6 su 10); un buon motivo per fidarsi tra tre che non lo sono, o il contrario'], build: level5 },
	6: { label: 'Confrontare e citare le fonti', constraints: ["le fonti indipendenti contate (circa 35 su 100), l'elemento che manca in una citazione (circa 25 su 100), vero o falso sulle fonti"], build: level6 }
});
