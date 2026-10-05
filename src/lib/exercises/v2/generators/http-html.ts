/**
 * Il web: ipertesti, URL e protocollo HTTP. Spec: specs/exercises/http-html.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/36-http-html.md), all multiple choice of text: the
 * words of the web; the parts of a URL built from its pieces; a link to the same site or to another one; the
 * request and the status code of the response; the count of the requests for a page; true and false statements.
 * Only names of the lesson are used (the .example domain, esempio.it).
 */
import { NAMES, breakable, choose, makeGenerator, nameOption, rightLabel, shuffle, statementLevel, textOption, type Built, type Statement } from '../inf-web1';
import type { Rng } from '../types';

export const ID = 'http-html';

const plain = (label: string) => textOption(label);

// ---------------------------------------------------------------------------
// Level 1: the words of the web

const TERMS = {
	ipertesto: 'Un ipertesto',
	link: 'Un link',
	pagina: 'Una pagina web',
	sito: 'Un sito web',
	browser: 'Il browser',
	server: 'Il server web',
	motore: 'Un motore di ricerca',
	html: 'HTML',
	url: 'Un URL',
	home: 'La home page'
} as const;
type Term = keyof typeof TERMS;

const WHY: Record<Term, string> = {
	ipertesto: "Un ipertesto è un testo che contiene collegamenti ad altri testi: ognuno lo legge nell'ordine che preferisce.",
	link: 'Un link è il collegamento su cui fai clic per aprire un altro documento.',
	pagina: 'Una pagina web è uno dei documenti del web: viaggia dal server al browser come file di testo.',
	sito: 'Un sito web è un insieme di pagine dello stesso proprietario, sotto lo stesso nome di dominio.',
	browser: 'Il browser è il programma con cui chiedi le pagine e le guardi: è il client del web, e non va confuso con il motore di ricerca.',
	server: 'Il server web è il programma che conserva le pagine di un sito e le manda ai browser che le chiedono.',
	motore: 'Un motore di ricerca è un sito, cioè una pagina tra le tante, che ti aiuta a trovare le altre: non è il browser.',
	html: 'HTML è il linguaggio in cui è scritto il file di una pagina: le parole insieme alle indicazioni che il browser legge per disegnarla.',
	url: "Un URL è l'indirizzo di una risorsa del web, diverso per ogni risorsa.",
	home: "La home page è la pagina da cui si parte: il server la manda quando nell'URL manca il percorso."
};

const DESCRIPTIONS: [Term, string][] = [
	['ipertesto', "È un testo che contiene collegamenti ad altri testi, e che ognuno legge nell'ordine che preferisce."],
	['ipertesto', "È un documento da cui si salta ad altri documenti, senza un ordine fissato dall'autore."],
	['link', "È una parola, una frase o un'immagine su cui fai clic per aprire un altro documento."],
	['link', "È il collegamento che da un punto di una pagina porta a un'altra risorsa."],
	['pagina', 'È uno dei documenti del web, e viaggia dal server al browser come un file di testo.'],
	['pagina', 'È un solo documento del web, con il suo indirizzo, che il browser disegna sullo schermo.'],
	['sito', 'È un insieme di pagine dello stesso proprietario, sotto lo stesso nome di dominio.'],
	['sito', 'È tutto quello che una scuola pubblica sul web sotto il proprio nome di dominio.'],
	['browser', 'È il programma, installato sul tuo dispositivo, con cui chiedi le pagine e le guardi.'],
	['browser', 'È il client del web: manda le richieste e disegna le pagine che riceve.'],
	['server', 'È il programma che conserva le pagine di un sito e le manda a chi le chiede.'],
	['server', 'Resta in attesa delle richieste e risponde con i file delle pagine.'],
	['motore', 'È un sito che ti aiuta a trovare le altre pagine.'],
	['motore', 'È una pagina tra le tante, a cui scrivi delle parole per farti indicare altre pagine.'],
	['html', 'È il linguaggio in cui è scritto il file di una pagina, con le indicazioni su titoli, paragrafi e immagini.'],
	['html', 'È il linguaggio delle indicazioni che il browser legge per disegnare la pagina.'],
	['url', "È l'indirizzo di una risorsa del web, quello che leggi nella barra in alto."],
	['url', "Indica una sola risorsa: se cambi una lettera, ne indica un'altra o nessuna."],
	['home', 'È la pagina da cui si parte per visitare un sito.'],
	['home', "Il server la manda quando nell'indirizzo manca il percorso."]
];

function level1(rng: Rng): Built {
	const d = rng.int(0, DESCRIPTIONS.length - 1);
	const [term, text] = DESCRIPTIONS[d];
	const option = (t: Term) => textOption(TERMS[t], t);
	const answer = choose(
		rng,
		option(term),
		shuffle(
			rng,
			(Object.keys(TERMS) as Term[]).filter((t) => t !== term)
		).map(option)
	);
	return {
		prompt: 'Riconosci di che cosa si parla.',
		problem: `${text} Di che cosa si parla?`,
		solution: rightLabel(answer),
		steps: [WHY[term]],
		answer,
		params: { case: term, description: d, options: answer.options.map((o) => o.values[0]) }
	};
}

// ---------------------------------------------------------------------------
// The URLs of levels 2, 3 and 4

const SITES = ['scuola', 'liceo', 'museo', 'teatro', 'cinema', 'comune', 'squadra', 'palestra'];
const HOSTS = ['www', 'www', 'www', 'posta', 'orario', 'registro', 'mappe', 'blog'];
const DIRS = ['classi', 'circolari', 'foto', 'gite', '2026', '2b', 'sport', 'eventi', 'archivio', 'immagini'];
const FILES = ['orario.html', 'gita.pdf', 'logo.png', 'elenco.html', 'avviso.pdf', 'mappa.png', 'menu.html', 'gruppo.jpg', 'regole.html', 'video.mp4'];
const BAITS = ['accesso-clienti', 'area-utenti', 'login-sicuro', 'conferma-dati'];

interface Url {
	protocol: string;
	host: string;
	dirs: string[];
	file: string;
	path: string;
	text: string;
}

function url(rng: Rng): Url {
	const protocol = rng.pick(['https', 'https', 'http']);
	const host = rng.next() < 0.12 ? 'www.esempio.it' : `${rng.pick(HOSTS)}.${rng.pick(SITES)}.example`;
	const dirs = shuffle(rng, DIRS).slice(0, 2);
	const file = rng.pick(FILES);
	const path = `/${dirs.join('/')}/${file}`;
	return { protocol, host, dirs, file, path, text: `${protocol}://${host}${path}` };
}

// ---------------------------------------------------------------------------
// Level 2: the parts of a URL

const PART_ASKS = {
	protocollo: 'qual è il protocollo?',
	server: 'qual è il nome del server?',
	percorso: 'qual è il percorso della risorsa?',
	risorsa: 'come si chiama la risorsa?',
	cartella: 'qual è la cartella che contiene direttamente la risorsa?'
} as const;

function level2(rng: Rng): Built {
	const kind = rng.pick(['protocollo', 'server', 'server', 'percorso', 'percorso', 'risorsa', 'cartella'] as const);
	const u = url(rng);
	const first = u.host.split('.')[0];
	const options: Record<typeof kind, string[]> = {
		protocollo: [u.protocol, ...shuffle(rng, [first, u.file.split('.')[1], 'GET', u.host.split('.').at(-1)!])],
		server: [u.host, `${u.host}/${u.dirs[0]}`, u.path, u.file],
		percorso: [u.path, ...shuffle(rng, [u.file, `${u.host}${u.path}`, `/${u.dirs.join('/')}`, u.host])],
		risorsa: [u.file, u.dirs[1], u.host, u.protocol],
		cartella: [u.dirs[1], u.dirs[0], u.file, first]
	};
	const [right, ...others] = options[kind];
	const answer = choose(rng, nameOption(right), others.map(nameOption));
	return {
		prompt: "Separa le tre parti dell'URL.",
		problem: `Nell'URL ${u.text}, ${PART_ASKS[kind]}`,
		solution: rightLabel(answer),
		steps: [`Il protocollo è quello che sta prima di ://, cioè ${u.protocol}.`, `Il nome del server va da lì alla prima barra: ${u.host}.`, `Il resto è il percorso, ${u.path}: la risorsa ${u.file} sta nella cartella ${u.dirs[1]}, dentro la cartella ${u.dirs[0]}.`],
		answer,
		params: { case: kind, url: u.text }
	};
}

// ---------------------------------------------------------------------------
// Level 3: the same site or another one

function level3(rng: Rng): Built {
	const other = rng.next() < 0.5;
	const site = rng.pick(SITES);
	const host = `www.${site}.example`;
	const here = `https://${host}/${rng.pick(DIRS)}/${rng.pick(FILES)}`;
	// every link has a path of its own, so that only the server name tells the two kinds apart
	const paths: string[] = [];
	while (paths.length < 6) {
		const p = `/${rng.pick(DIRS)}/${rng.pick(FILES)}`;
		if (!paths.includes(p) && !here.endsWith(p)) paths.push(p);
	}
	const pages = paths.slice(0, 3).map((p) => `https://${host}${p}`);
	const elsewhere = [`${site}.esempio.it`, `www.${site}.example.${rng.pick(BAITS)}.example`, `www.${rng.pick(SITES.filter((s) => s !== site))}.example`].map((h, i) => `https://${h}${paths[3 + i]}`);
	const [right, wrong] = other ? [rng.pick(elsewhere), pages] : [pages[0], elsewhere];
	const answer = choose(rng, nameOption(right), wrong.map(nameOption));
	const rightHost = right.split('/')[2];
	return {
		prompt: 'Confronta il nome del server.',
		problem: other ? `Sei sulla pagina ${here}. Quale di questi link porta su un altro sito?` : `Sei sulla pagina ${here}. Quale di questi link porta a un'altra pagina dello stesso sito?`,
		solution: rightLabel(answer),
		steps: other
			? [`Il nome del server della pagina in cui sei è ${host}.`, `In tre link il nome del server è lo stesso e cambia solo il percorso: sono altre pagine dello stesso sito.`, `Nel quarto il nome del server è ${rightHost}, registrato da qualcun altro: è un altro sito.`]
			: [`Il nome del server della pagina in cui sei è ${host}.`, 'Un link porta nello stesso sito quando il nome del server è lo stesso, anche se il percorso cambia.', 'Negli altri tre il nome del server è diverso, anche quando gli somiglia: li ha registrati qualcun altro.'],
		answer,
		params: { case: other ? 'altro' : 'stesso', here, links: answer.options.map((o) => o.values[0]) }
	};
}

// ---------------------------------------------------------------------------
// Level 4: requests and status codes

/** The situations: N is the name. */
const SITUATIONS: [number, (N: string) => string][] = [
	[200, (N) => `${N} fa clic su un link, e la pagina compare senza problemi.`],
	[200, (N) => `${N} apre la home page di un sito, che arriva completa.`],
	[200, (N) => `Il browser di ${N} chiede un'immagine della pagina, e il server gliela manda.`],
	[301, (N) => `${N} apre il vecchio indirizzo di una pagina che è stata spostata: il server indica dove si trova adesso, e il browser ci va da solo.`],
	[301, (N) => `Un sito ha cambiato nome: quando ${N} chiede un vecchio indirizzo, il server risponde che la risorsa ora sta a un altro URL.`],
	[301, (N) => `${N} segue un link a una circolare che la scuola ha trasferito in un'altra cartella, e il server rimanda il browser al nuovo URL.`],
	[403, (N) => `${N} prova ad aprire una pagina riservata ai professori, senza averne il permesso.`],
	[403, (N) => `${N} chiede un file che esiste, ma che il server lascia vedere solo a chi è autorizzato.`],
	[403, (N) => `${N} scrive l'URL dell'area della segreteria: la pagina c'è, ma ${N} non ha il permesso di vederla.`],
	[404, (N) => `${N} scrive a mano un URL e sbaglia il nome della pagina.`],
	[404, (N) => `${N} fa clic su un link vecchio, verso una pagina che è stata cancellata.`],
	[404, (N) => `${N} chiede un percorso a cui il server non ha niente.`],
	[500, (N) => `L'URL che ${N} ha scritto è giusto, ma il programma del server si blocca mentre prepara la pagina.`],
	[500, (N) => `${N} apre una pagina che esiste, ma il sito ha un guasto e il server non riesce a preparare la risposta.`],
	[500, (N) => `La richiesta di ${N} è corretta, ma sul server qualcosa va storto mentre la esegue.`]
];
const CODE_WHY: Record<number, string> = {
	200: 'È andato tutto bene: il server risponde 200 e manda la risorsa.',
	301: 'La risorsa è stata spostata a un altro URL: il server risponde 301, e il browser va da solo al nuovo indirizzo.',
	403: "La risorsa c'è, ma chi la chiede non ha il permesso di vederla: il server risponde 403.",
	404: 'Il server funziona e ha capito la richiesta, ma a quel percorso non ha niente: risponde 404.',
	500: "La richiesta era corretta e l'errore è del server: risponde 500."
};
const FIRST_DIGIT: Record<number, string> = {
	2: 'È un successo: la richiesta è andata bene',
	3: 'Il server rimanda il browser altrove',
	4: 'È sbagliata la richiesta',
	5: 'Il guasto è del server'
};
/** Codes the lesson does not name, read from their first digit. */
const OTHER_CODES = [201, 202, 204, 206, 302, 303, 307, 308, 400, 401, 405, 410, 429, 501, 502, 503, 504];

function level4(rng: Rng): Built {
	const kind = rng.pick(['situazione', 'situazione', 'situazione', 'situazione', 'situazione', 'cifra', 'cifra', 'richiesta', 'richiesta', 'richiesta'] as const);
	const prompt = 'Una richiesta, una risposta con il suo codice.';
	if (kind === 'situazione') {
		const N = rng.pick(NAMES);
		const s = rng.int(0, SITUATIONS.length - 1);
		const [code, text] = SITUATIONS[s];
		const answer = choose(
			rng,
			plain(String(code)),
			shuffle(
				rng,
				[200, 301, 403, 404, 500].filter((c) => c !== code)
			).map((c) => plain(String(c)))
		);
		return {
			prompt,
			problem: `${text(N)} Con quale codice di stato risponde il server?`,
			solution: rightLabel(answer),
			steps: [CODE_WHY[code], 'La prima cifra dice il tipo di risposta: 2 successo, 3 la risorsa è altrove, 4 è sbagliata la richiesta, 5 il guasto è del server.'],
			answer,
			params: { case: kind, situation: s, name: N, options: answer.options.map((o) => o.values[0]) }
		};
	}
	if (kind === 'cifra') {
		const code = rng.pick(OTHER_CODES);
		const digit = Math.floor(code / 100);
		const answer = choose(
			rng,
			textOption(FIRST_DIGIT[digit], String(digit)),
			[2, 3, 4, 5].filter((d) => d !== digit).map((d) => textOption(FIRST_DIGIT[d], String(d)))
		);
		return {
			prompt,
			problem: `Una risposta HTTP ha codice ${code}, che non hai mai incontrato. Che cosa ti dice la sua prima cifra?`,
			solution: rightLabel(answer),
			steps: ['La prima cifra di un codice di stato dice il tipo di risposta: 2 successo, 3 la risorsa è altrove, 4 è sbagliata la richiesta, 5 il guasto è del server.', `${code} comincia con ${digit}.`],
			answer,
			params: { case: kind, code }
		};
	}
	const u = url(rng);
	const answer = choose(rng, plain(`GET ${u.path}`), shuffle(rng, [`POST ${u.path}`, `GET ${u.host}`, `200 ${u.path}`, `GET ${u.protocol}`]).map(plain));
	return {
		prompt,
		problem: `Fai clic su un link che porta a ${u.text}. Quale richiesta manda il browser al server ${u.host}?`,
		solution: rightLabel(answer),
		steps: ['La richiesta dice che cosa fare e su quale risorsa: per chiedere una risorsa comincia con GET, seguito dal percorso.', `Il percorso è quello che nell'URL viene dopo il nome del server: ${u.path}.`, 'POST serve a consegnare i dati di un modulo, e 200 è un codice di stato: sta nella risposta.'],
		answer,
		params: { case: kind, url: u.text }
	};
}

// ---------------------------------------------------------------------------
// Level 5: how many requests for a page

function level5(rng: Rng): Built {
	const images = rng.int(2, 9);
	const videos = rng.int(0, 2);
	const links = rng.int(3, 30);
	const requests = 1 + images + videos;
	const n = (k: number) => textOption(`${k} richieste`.replace(/^1 richieste$/, '1 richiesta'), String(k));
	const answer = choose(rng, n(requests), [images + videos, requests + links, images + videos + links, 1, links].map(n));
	const videoText = videos === 0 ? '' : videos === 1 ? ', un video' : `, ${videos} video`;
	return {
		prompt: 'Conta i file che il browser deve chiedere.',
		problem: `Una pagina contiene del testo, ${images} fotografie${videoText} e ${links} link ad altre pagine. Quante richieste HTTP manda il browser per mostrarla?`,
		solution: rightLabel(answer),
		steps: [
			'Una richiesta è per il file della pagina, che contiene il testo.',
			`Le immagini e i video sono file separati, e il browser li chiede uno per uno: in tutto 1 + ${images}${videos ? ` + ${videos}` : ''} = ${requests} richieste.`,
			'I link non contano: una pagina collegata viene chiesta solo quando ci fai clic.'
		],
		answer,
		params: { images, videos, links, case: videos ? 'con video' : 'senza video' }
	};
}

// ---------------------------------------------------------------------------
// Level 6: true and false statements

const TRUE: Statement[] = [
	{ id: 't1', text: 'Con HTTPS i dati viaggiano cifrati tra il browser e il server', why: 'Con HTTPS i dati vengono cifrati: solo il browser e il server possono leggerli.' },
	{ id: 't2', text: 'Anche un sito costruito per rubare le password può avere il lucchetto', why: 'Il lucchetto dice che la connessione è protetta, non che il sito è onesto.' },
	{ id: 't3', text: 'Una password si scrive solo in una pagina il cui URL comincia con https', why: "Con HTTP i dati viaggiano in chiaro: una password si scrive solo dove l'URL comincia con https." },
	{ id: 't4', text: 'Le immagini di una pagina sono file separati, che il browser chiede uno per uno', why: 'Le immagini non stanno dentro il file della pagina: il browser le chiede una per una.' },
	{ id: 't5', text: 'Il web è uno dei servizi che usano Internet', why: 'Il web non è Internet: è uno dei servizi che la usano.' },
	{ id: 't6', text: 'Il motore di ricerca è un sito, non un programma installato sul dispositivo', why: 'Il motore di ricerca è un sito; il programma installato sul dispositivo è il browser.' },
	{ id: 't7', text: 'Nel percorso di un URL le maiuscole possono contare', why: 'Nel percorso spesso contano anche le maiuscole: due scritture diverse possono essere due file.' },
	{ id: 't8', text: "Quando nell'URL manca il percorso, il server manda la home page", why: 'Quando il percorso manca, il server manda la home page del sito.' },
	{ id: 't9', text: 'Con HTTP, chi controlla una delle reti attraversate può leggere i dati', why: 'Con HTTP richieste e risposte viaggiano in chiaro, e chi controlla una rete può leggerle.' },
	{ id: 't10', text: 'Con HTTPS il server dimostra con un certificato che il nome di dominio è suo', why: 'Con HTTPS il server dimostra al browser, con un certificato, di essere quello a cui appartiene il nome di dominio.' },
	{ id: 't11', text: 'Una pagina collegata da un link viene chiesta solo quando fai clic', why: 'I link non fanno partire richieste: la pagina collegata viene chiesta solo quando fai clic.' },
	{ id: 't12', text: 'Il browser è il client del web', why: 'Il browser manda le richieste e mostra le risposte: è il client del web.' }
];
const FALSE: Statement[] = [
	{ id: 'f1', text: 'Il lucchetto garantisce che il sito è onesto', why: 'Il lucchetto non dice niente su chi ha registrato il nome: anche un sito truffa può averlo.' },
	{ id: 'f2', text: 'Il browser e il motore di ricerca sono la stessa cosa', why: 'Il browser è un programma sul tuo dispositivo; il motore di ricerca è un sito.' },
	{ id: 'f3', text: 'Il web e Internet sono la stessa cosa', why: 'Il web è uno dei servizi che usano Internet.' },
	{ id: 'f4', text: 'Con HTTP i dati viaggiano cifrati', why: 'Con HTTP i dati viaggiano in chiaro: è HTTPS che li cifra.' },
	{ id: 'f5', text: 'Le immagini stanno dentro il file HTML della pagina', why: "Le immagini sono file separati: nel file della pagina c'è solo l'indirizzo a cui si trovano." },
	{ id: 'f6', text: "Un sito con https nell'URL non può essere una truffa", why: 'Anche un sito costruito per rubare le password può avere https e il lucchetto.' },
	{ id: 'f7', text: 'Se sbagli una lettera di un URL, il browser apre lo stesso la pagina che volevi', why: "Un URL si scrive esatto: una lettera diversa indica un'altra risorsa, o nessuna." },
	{ id: 'f8', text: 'Per mostrare una pagina il browser chiede subito anche tutte le pagine collegate dai link', why: 'Una pagina collegata viene chiesta solo quando fai clic sul link.' },
	{ id: 'f9', text: 'Il codice 404 vuol dire che il server è guasto', why: 'Con 404 il server funziona: a quel percorso non ha niente. Il guasto del server è 500.' },
	{ id: 'f10', text: 'HTTPS dice chi ha registrato il nome di dominio del sito', why: 'HTTPS garantisce che parli con il server di quel nome, ma non dice chi ha registrato il nome.' },
	{ id: 'f11', text: 'Il server web è il programma con cui guardi le pagine sul tuo dispositivo', why: 'Le pagine si guardano con il browser: il server web le conserva e le manda.' },
	{ id: 'f12', text: 'In una pagina con URL che comincia con http una password viaggia protetta', why: 'Con HTTP la password viaggia in chiaro, e chi controlla una delle reti può leggerla.' }
];

export default makeGenerator(ID, 'Il web: ipertesti, URL e protocollo HTTP', {
	1: { label: 'Le parole del web', constraints: ['una descrizione: ipertesto, link, pagina, sito, browser, server web, motore di ricerca, HTML, URL o home page'], build: (rng) => breakable(level1(rng)) },
	2: { label: 'Le parti di un URL', constraints: ['un URL con protocollo, nome del server e percorso di due cartelle: si chiede una delle parti, la risorsa o la cartella'], build: (rng) => breakable(level2(rng)) },
	3: { label: 'Stesso sito o un altro sito', constraints: ['il link con un altro nome del server tra tre dello stesso sito, o il contrario, metà ciascuno'], build: (rng) => breakable(level3(rng)) },
	4: { label: 'Richieste e codici di stato', constraints: ['il codice di una situazione (5 su 10), la richiesta GET di un URL (3 su 10), la prima cifra di un codice (2 su 10)'], build: (rng) => breakable(level4(rng)) },
	5: { label: 'Quante richieste per una pagina', constraints: ['richieste = 1 + immagini + video; i link non contano'], build: (rng) => breakable(level5(rng)) },
	6: { label: 'Vero o falso sul web', constraints: ["l'affermazione vera tra tre false, o la falsa tra tre vere"], build: (rng) => statementLevel(rng, TRUE, FALSE, 'sul web', 'Ripensa a browser, URL e HTTPS.') }
});
