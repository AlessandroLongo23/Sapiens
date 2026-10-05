/**
 * Posta elettronica e altri servizi di Internet. Spec: specs/exercises/inf-servizi-internet.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/37-inf-servizi-internet.md), all multiple choice:
 * the parts of an address, read on an address made each time; the three steps of a message between two domains; the
 * field (A, Cc, Ccn) for a recipient; who receives and who sees, counted on a message with its three lists; the
 * service for a situation; true and false statements.
 */
import { choose, makeGenerator, shuffle, textOption, type Built } from '../inf-programmi';
import { NAMES, cap, list, statementLevel, take, to as toName, type Statement } from '../inf-web2';
import type { Rng } from '../types';

export const ID = 'inf-servizi-internet';

const LAST = ['rossi', 'bianchi', 'conti', 'verdi', 'ferri', 'galli', 'riva', 'costa', 'serra', 'fabbri'];
const DOMAINS = ['scuola.example', 'liceo.example', 'posta.example', 'comune.example', 'biblioteca.example', 'museo.example', 'esempio.it'];

/** A user name: anna.rossi, a.rossi or annarossi. */
function user(first: string, last: string, style: number): string {
	return style === 0 ? `${first}.${last}` : style === 1 ? `${first[0]}.${last}` : `${first}${last}`;
}

// ---------------------------------------------------------------------------
// Level 1: the parts of an address

const FATES = {
	altra: "Va a un'altra casella, oppure torna indietro con un avviso di errore",
	stessa: 'Arriva alla casella giusta: maiuscole e minuscole di solito non contano',
	corregge: "Arriva alla casella giusta: il server corregge da solo l'indirizzo",
	dominio: 'Arriva alla casella giusta: per la consegna conta solo il dominio',
	tutte: 'Arriva a tutte le caselle di quel dominio',
	nonvalido: 'Non parte: un indirizzo con le maiuscole non è valido'
} as const;
type Fate = keyof typeof FATES;
const fate = (id: Fate) => textOption(FATES[id], id);

function level1(rng: Rng): Built {
	const kind = rng.pick(['utente', 'dominio', 'stesso', 'valido', 'arriva'] as const);
	const prompt = 'Leggi un indirizzo di posta elettronica.';
	const first = rng.pick(NAMES).toLowerCase();
	const last = rng.pick(LAST);
	const [domain, domain2, domain3] = take(rng, DOMAINS, 3);
	const label = (d: string, i: number) => d.split('.').at(i)!;

	if (kind === 'utente' || kind === 'dominio') {
		const style = rng.int(0, 2);
		const name = user(first, last, style);
		const address = `${name}@${domain}`;
		const wrong =
			kind === 'utente'
				? [domain, ...shuffle(rng, [address, label(domain, 0), ...(style === 2 ? [] : [name.split('.')[1]])])]
				: [name, ...shuffle(rng, [address, label(domain, -1), label(domain, 0)])];
		const right = kind === 'utente' ? name : domain;
		return {
			prompt,
			problem: `Nell'indirizzo ${address} qual è ${kind === 'utente' ? 'il nome utente, cioè la parte che indica la casella' : 'il dominio, cioè la parte che indica il server di posta'}?`,
			solution: right,
			steps: [
				`La chiocciola divide l'indirizzo in due parti: a sinistra c'è ${name}, a destra c'è ${domain}.`,
				kind === 'utente' ? `Il nome utente è tutta la parte a sinistra, che distingue la casella dalle altre dello stesso dominio: ${name}.` : `Il dominio è tutta la parte a destra, che dice a quale server consegnare il messaggio: ${domain}.`
			],
			answer: choose(
				rng,
				textOption(right),
				wrong.map((w) => textOption(w))
			),
			params: { case: kind, address }
		};
	}

	if (kind === 'stesso') {
		const N = rng.pick(NAMES);
		const name = user(N.toLowerCase(), last, rng.int(0, 2));
		const address = `${name}@${domain}`;
		const others = take(
			rng,
			LAST.filter((l) => l !== last),
			2
		);
		const right = `${user(rng.pick(NAMES).toLowerCase(), others[0], rng.int(0, 2))}@${domain}`;
		const wrong = [`${name}@${domain2}`, `${label(domain, 0)}@${domain3}`, `${user(rng.pick(NAMES).toLowerCase(), others[1], rng.int(0, 2))}@${domain2}`];
		return {
			prompt,
			problem: `${N} ha l'indirizzo ${address}. Quale di questi indirizzi ha la casella sullo stesso server di posta?`,
			solution: right,
			steps: [
				`Il server di posta lo indica il dominio, cioè la parte a destra della chiocciola: per ${N} è ${domain}.`,
				`Solo ${right} ha lo stesso dominio. Il nome utente uguale su un altro dominio è la casella di un'altra organizzazione.`
			],
			answer: choose(
				rng,
				textOption(right),
				wrong.map((w) => textOption(w))
			),
			params: { case: kind, address, right }
		};
	}

	if (kind === 'valido') {
		const name = `${first}.${last}`;
		const right = `${name}@${domain}`;
		const broken: [string, string][] = [
			['spazio', `${first} ${last}@${domain}`],
			['senza chiocciola', `${name}.${domain}`],
			['senza dominio', `${name}@`],
			['senza nome utente', `@${domain}`],
			['due chiocciole', `${first}@${last}@${domain}`],
			['indirizzo web', `www.${domain}/${name}`]
		];
		const wrong = take(rng, broken, 3);
		return {
			prompt,
			problem: 'Quale di questi è scritto come un indirizzo di posta elettronica?',
			solution: right,
			steps: ['Un indirizzo di posta ha due parti separate da una sola chiocciola: il nome utente a sinistra e il dominio a destra, senza spazi.', `Solo ${right} è fatto così: negli altri tre manca una parte, oppure c'è uno spazio, oppure la chiocciola non è una sola.`],
			answer: choose(
				rng,
				textOption(right),
				wrong.map(([, w]) => textOption(w))
			),
			params: { case: kind, address: right, broken: wrong.map(([id]) => id) }
		};
	}

	// what happens to a message sent to an address typed a little differently
	const N = rng.pick(NAMES);
	const address = `${first}.${last}@${domain}`;
	const change = rng.pick(['punto', 'lettera', 'dominio', 'iniziali', 'maiuscole'] as const);
	const typed = {
		punto: `${first}${last}@${domain}`,
		lettera: `${first}.${last.slice(0, -1)}@${domain}`,
		dominio: `${first}.${last}@${domain2}`,
		iniziali: `${cap(first)}.${cap(last)}@${domain}`,
		maiuscole: `${first.toUpperCase()}.${last.toUpperCase()}@${domain}`
	}[change];
	const same = change === 'iniziali' || change === 'maiuscole';
	const why = { punto: 'manca il punto', lettera: 'manca una lettera del nome utente', dominio: 'il dominio è un altro', iniziali: '', maiuscole: '' }[change];
	return {
		prompt,
		problem: `${N} vuole scrivere a ${address} ma come destinatario scrive ${typed} e invia. Che cosa succede al messaggio?`,
		solution: FATES[same ? 'stessa' : 'altra'],
		steps: same
			? ['I due indirizzi hanno le stesse lettere, gli stessi punti e lo stesso dominio: cambiano solo le maiuscole.', 'In un indirizzo maiuscole e minuscole di solito non fanno differenza: il messaggio arriva alla casella giusta.']
			: [`I due indirizzi non sono uguali: in quello scritto ${why}.`, "Basta un carattere diverso per avere un altro indirizzo: se quella casella esiste il messaggio arriva a uno sconosciuto, altrimenti torna indietro con un avviso di errore. Nessuno corregge l'indirizzo al posto tuo."],
		answer: same ? choose(rng, fate('stessa'), shuffle(rng, [fate('altra'), fate('nonvalido'), fate('tutte')])) : choose(rng, fate('altra'), take(rng, [fate('corregge'), fate('dominio'), fate('tutte'), fate('stessa')], 3)),
		params: { case: kind, address, typed, change }
	};
}

// ---------------------------------------------------------------------------
// Level 2: the journey of a message

const STEPS = {
	primo: (S: string) => `A quale computer consegna il messaggio il programma di ${S}?`,
	dominio: () => 'Quale computer legge il dominio del destinatario per decidere a chi passare il messaggio?',
	aspetta: (_: string, R: string) => `Su quale computer aspetta il messaggio finché ${R} non apre la posta?`,
	lettura: (_: string, R: string) => `A quale computer si collega il programma di ${R} per leggere il messaggio?`
} as const;

const PROTOCOLS = ['SMTP', 'IMAP', 'POP3', 'FTP'] as const;
/** Situations and their protocol: N is a name, d1 and d2 two domains. */
const PROTOCOL_USES: [(typeof PROTOCOLS)[number], (N: string, d1: string, d2: string) => string][] = [
	['SMTP', (N) => `${N} preme Invia: il suo programma consegna il messaggio appena scritto al server di posta del suo dominio.`],
	['SMTP', (_, d1, d2) => `Il server di posta di ${d1} passa un messaggio al server di posta di ${d2}, dove sta la casella del destinatario.`],
	['SMTP', (N, d1) => `Il messaggio di ${N} parte dal telefono verso il server di posta di ${d1}, che lo spedirà al destinatario.`],
	['IMAP', (N) => `${N} legge un messaggio dal telefono e sul computer lo ritrova segnato come già letto: i messaggi restano sul server.`],
	['IMAP', (N) => `${N} vede la stessa posta, uguale, sul telefono e sul tablet, perché i messaggi restano sul server.`],
	['IMAP', (N, d1) => `Il programma di ${N} mostra i messaggi della casella lasciandoli sul server di ${d1}, così si leggono da ogni dispositivo.`],
	['POP3', (N) => `Il programma di ${N} scarica i messaggi sul computer di casa e li toglie dal server.`],
	['POP3', (N) => `${N} ha i messaggi solo sul computer di casa: il programma li ha scaricati lì, e sul server non ci sono più.`],
	['POP3', (N, d1) => `Il programma di ${N} porta i messaggi sul suo dispositivo e, di norma, li toglie dal server di ${d1}.`]
];
const PROTOCOL_WHY = {
	SMTP: 'Qui un messaggio viene spedito: dal programma al server, o da un server a un altro. Il protocollo che serve a spedire è SMTP.',
	IMAP: 'Qui i messaggi vengono letti e restano sul server, uguali su tutti i dispositivi: è il protocollo IMAP.',
	POP3: 'Qui i messaggi vengono scaricati su un dispositivo e tolti dal server: è il protocollo POP3.',
	FTP: ''
};

function level2(rng: Rng): Built {
	const prompt = 'Segui il viaggio di un messaggio di posta.';
	const [S, R] = take(rng, NAMES, 2);
	const [d1, d2] = take(rng, DOMAINS, 2);
	if (rng.next() < 0.65) {
		const sa = `${S.toLowerCase()}.${rng.pick(LAST)}@${d1}`;
		const ra = `${R.toLowerCase()}.${rng.pick(LAST)}@${d2}`;
		const step = rng.pick(Object.keys(STEPS) as (keyof typeof STEPS)[]);
		const sender = step === 'primo' || step === 'dominio';
		const server = (d: string) => textOption(`Il server di posta di ${d}`, `server:${d}`);
		const device = (n: string) => textOption(`Il dispositivo di ${n}`, `dispositivo:${n}`);
		const right = server(sender ? d1 : d2);
		return {
			prompt,
			problem: `${S} (${sa}) scrive ${toName(R)} (${ra}). ${STEPS[step](S, R)}`,
			solution: right.latex,
			steps: [
				`Il programma di ${S} affida il messaggio al server di posta del suo dominio, ${d1}. Quel server legge il dominio del destinatario e passa il messaggio al server di ${d2}.`,
				`Lì il messaggio aspetta nella casella di ${R}, il cui programma si collega al proprio server per leggerlo. Il messaggio non va mai da un dispositivo all'altro: quello di ${R} potrebbe essere spento.`
			],
			answer: choose(rng, right, [server(sender ? d2 : d1), device(S), device(R)]),
			params: { case: 'passo', step, sender: sa, recipient: ra }
		};
	}
	const use = rng.int(0, PROTOCOL_USES.length - 1);
	const [protocol, text] = PROTOCOL_USES[use];
	return {
		prompt,
		problem: `${text(S, d1, d2)} Quale protocollo viene usato?`,
		solution: protocol,
		steps: [PROTOCOL_WHY[protocol], 'SMTP spedisce; IMAP e POP3 servono a leggere la casella, il primo lasciando i messaggi sul server, il secondo scaricandoli.'],
		answer: choose(
			rng,
			textOption(protocol),
			PROTOCOLS.filter((p) => p !== protocol).map((p) => textOption(p))
		),
		params: { case: 'protocollo', use, name: S, domains: [d1, d2] }
	};
}

// ---------------------------------------------------------------------------
// Level 3: A, Cc or Ccn

/** What is sent and to whom: the message, "to the main recipient", the main recipient, "of the main recipient". */
const MAILS: [string, string, string, string][] = [
	['la relazione di laboratorio', 'alla professoressa di scienze', 'la professoressa', 'della professoressa'],
	["la giustificazione di un'assenza", 'alla segreteria della scuola', 'la segreteria', 'della segreteria'],
	['la candidatura per uno stage', "al responsabile di un'azienda", 'il responsabile', 'del responsabile'],
	['la richiesta di un certificato', "all'ufficio del comune", "l'ufficio", "dell'ufficio"],
	['la presentazione del gruppo', 'al professore di storia', 'il professore', 'del professore'],
	["l'iscrizione a un corso di nuoto", 'alla responsabile della piscina', 'la responsabile', 'della responsabile']
];
/** Who is kept informed: the person, "informed" agreed, "of the person". */
const INFORMED: [string, string, string][] = [
	['il compagno di gruppo', 'informato', 'del compagno'],
	['la rappresentante di classe', 'informata', 'della rappresentante'],
	['il coordinatore di classe', 'informato', 'del coordinatore'],
	['sua madre', 'informata', 'di sua madre'],
	["l'allenatore", 'informato', "dell'allenatore"]
];
const GROUPS = ['di classi diverse', 'di tre scuole diverse', 'iscritte a un corso', 'del quartiere'];
const EVENTS = ['a un torneo di pallavolo', 'alla festa di fine anno', 'a una raccolta di libri usati', 'a un concerto della scuola'];
const FIELDS = ['A', 'Cc', 'Ccn', 'Oggetto'] as const;
const FIELD_WHY = {
	A: 'In A vanno i destinatari a cui il messaggio è rivolto: chi deve leggere e rispondere.',
	Cc: 'In Cc va chi deve essere informato, senza dover rispondere.',
	Ccn: 'In Ccn vanno i destinatari che gli altri non devono vedere: ognuno riceve il messaggio senza conoscere gli indirizzi degli altri.'
};

function level3(rng: Rng): Built {
	const field = rng.pick(['A', 'Cc', 'Ccn'] as const);
	const N = rng.pick(NAMES);
	const m = rng.int(0, MAILS.length - 1);
	const [what, toMain, main, ofMain] = MAILS[m];
	let problem: string;
	let pieces: Record<string, unknown>;
	if (field === 'A') {
		problem = `${N} manda ${what} ${toMain}: è ${main} che deve leggere e rispondere. In quale campo va l'indirizzo ${ofMain}?`;
		pieces = { mail: m };
	} else if (field === 'Cc') {
		const i = rng.int(0, INFORMED.length - 1);
		const [who, informed, ofWho] = INFORMED[i];
		problem = `${N} manda ${what} ${toMain}, e vuole che anche ${who} ne sia ${informed}, senza dover rispondere. In quale campo va l'indirizzo ${ofWho}?`;
		pieces = { mail: m, informed: i };
	} else {
		const k = rng.int(12, 40);
		const group = rng.int(0, GROUPS.length - 1);
		const event = rng.int(0, EVENTS.length - 1);
		problem = `${N} invita ${k} persone ${GROUPS[group]} ${EVENTS[event]}: non si conoscono tra loro, e nessuno deve vedere gli indirizzi degli altri. In quale campo vanno i ${k} indirizzi?`;
		pieces = { people: k, group, event };
	}
	return {
		prompt: 'Scegli il campo giusto per un destinatario.',
		problem,
		solution: field,
		steps: [FIELD_WHY[field], "Il campo Oggetto non contiene indirizzi: dice in una riga l'argomento del messaggio."],
		answer: choose(
			rng,
			textOption(field),
			FIELDS.filter((f) => f !== field).map((f) => textOption(f))
		),
		params: { case: field, name: N, ...pieces }
	};
}

// ---------------------------------------------------------------------------
// Level 4: who receives, who sees, who gets the reply

const people = (n: number) => textOption(n === 1 ? '1 persona' : `${n} persone`, String(n));

function level4(rng: Rng): Built {
	const kind = rng.pick(['ricevono', 'nascosto', 'rispondi', 'tutti'] as const);
	let a = rng.int(1, 3);
	let c = rng.int(1, 3);
	if (a + c < 3) [a, c] = rng.next() < 0.5 ? [2, 1] : [1, 2];
	const n = rng.int(1, 3);
	const names = shuffle(rng, NAMES);
	const M = names[0];
	const to = names.slice(1, 1 + a);
	const cc = names.slice(1 + a, 1 + a + c);
	const ccn = names.slice(1 + a + c, 1 + a + c + n);
	const message = `${M} manda un messaggio: in A mette ${list(to)}, in Cc mette ${list(cc)} e in Ccn mette ${list(ccn)}.`;
	const params = { case: kind, from: M, to, cc, ccn };
	const prompt = 'Ragiona su chi riceve un messaggio e chi vede gli indirizzi.';

	if (kind === 'ricevono') {
		const right = a + c + n;
		return {
			prompt,
			problem: `${message} Quante persone ricevono il messaggio?`,
			solution: `${right} persone`,
			steps: ['Il messaggio arriva a tutti gli indirizzi dei tre campi: A, Cc e Ccn.', `In tutto sono ${a} + ${c} + ${n} = ${right} persone. Chi sta in Ccn riceve come gli altri: cambia solo che il suo indirizzo resta nascosto.`],
			answer: choose(rng, people(right), [people(a + c), ...shuffle(rng, [people(right + 1), people(a), people(right - 1), people(c + n)])]),
			params
		};
	}
	if (kind === 'nascosto') {
		const right = rng.pick(ccn);
		return {
			prompt,
			problem: `${message} Quale di questi destinatari resta nascosto agli altri?`,
			solution: right,
			steps: ['Gli indirizzi scritti in A e in Cc li vedono tutti quelli che ricevono il messaggio.', `Resta nascosto solo chi sta in Ccn, la copia conoscenza nascosta: qui ${right}.`],
			answer: choose(
				rng,
				textOption(right),
				take(rng, [...to, ...cc], 3).map((x) => textOption(x))
			),
			params
		};
	}
	const P = rng.pick([...to, ...cc]);
	const all = kind === 'tutti';
	const right = all ? a + c : 1;
	return {
		prompt,
		problem: `${message} ${P} preme ${all ? 'Rispondi a tutti' : 'Rispondi'}. Quante persone ricevono la sua risposta?`,
		solution: right === 1 ? '1 persona' : `${right} persone`,
		steps: all
			? [`Rispondi a tutti scrive al mittente, ${M}, e a chi era in A e in Cc, tranne ${P} che sta rispondendo: 1 + ${a + c - 1} = ${right} persone.`, `Chi era in Ccn non riceve la risposta: ${P} non vede quegli indirizzi.`]
			: [`Rispondi scrive solo al mittente del messaggio, cioè ${toName(M)}.`, 'Per scrivere anche a chi era in A e in Cc serve Rispondi a tutti.'],
		answer: choose(rng, people(right), all ? [people(a + c + n), people(1), people(a + c - 1), people(a + c + n + 1)] : [people(a + c), people(a + c + n), people(a + c - 1), people(a + c + 1)]),
		params: { ...params, who: P }
	};
}

// ---------------------------------------------------------------------------
// Level 5: the service for a situation; synchronous or asynchronous

const SERVICES = {
	posta: 'La posta elettronica',
	chat: 'La messaggistica istantanea',
	video: 'La videochiamata',
	streaming: 'Lo streaming',
	download: 'Lo scaricamento del file (download)',
	ftp: 'Il trasferimento di file su un server'
} as const;
type Service = keyof typeof SERVICES;

const SERVICE_USES: [Service, (N: string) => string][] = [
	['posta', (N) => `${N} deve chiedere un certificato alla segreteria: serve un messaggio scritto che resti e si possa ritrovare tra un mese.`],
	['posta', (N) => `${N} deve scrivere a un'azienda di cui conosce solo l'indirizzo con la chiocciola, senza sapere quale app usa.`],
	['posta', (N) => `${N} si iscrive a un sito, che manda la conferma scritta alla sua casella, dove resterà finché non la legge.`],
	['chat', (N) => `${N} deve fissare in pochi minuti l'ora dell'allenamento con dieci compagni, che usano tutti la stessa app.`],
	['chat', (N) => `${N} scrive due righe al gruppo della classe, che le riceve sul telefono in pochi istanti.`],
	['chat', (N) => `${N} avvisa con un messaggio breve un'amica, che usa la sua stessa app, di un ritardo di dieci minuti.`],
	['video', (N) => `${N} segue una lezione a distanza: vede e sente l'insegnante in tempo reale e può fare domande.`],
	['video', (N) => `${N} parla con i nonni, che abitano lontano, vedendoli sullo schermo mentre rispondono.`],
	['video', (N) => `${N} ripassa con due compagni collegati insieme: si vedono e si parlano in tempo reale.`],
	['streaming', (N) => `${N} guarda una partita in diretta: il video parte subito, mentre i dati stanno ancora arrivando.`],
	['streaming', (N) => `${N} ascolta una canzone da una piattaforma senza aspettare di avere tutto il file.`],
	['streaming', (N) => `${N} guarda una serie: quando la connessione rallenta a lungo, il video si blocca o perde qualità.`],
	['download', (N) => `${N} vuole vedere un film in treno, dove non c'è connessione: prima di partire aspetta che il file arrivi tutto sul tablet.`],
	['download', (N) => `${N} vuole avere una canzone sul telefono per ascoltarla anche senza connessione.`],
	['download', (N) => `${N} aspetta che il file di un libro arrivi per intero sul computer, e poi lo apre senza rete.`],
	['ftp', (N) => `${N} ha preparato le pagine di un sito e deve copiarle dal suo computer al server che lo pubblica.`],
	['ftp', (N) => `${N} gestisce il sito della scuola e deve caricare sul server le immagini nuove.`],
	['ftp', (N) => `${N} aggiorna un sito: copia sul server i file delle pagine che ha corretto sul suo computer.`]
];
const SERVICE_WHY: Record<Service, string> = {
	posta: 'Serve un messaggio scritto che aspetta nella casella e resta: è la posta elettronica, che arriva a qualunque indirizzo, di qualunque servizio.',
	chat: 'Servono messaggi brevi consegnati in pochi istanti a persone che usano la stessa app: è la messaggistica istantanea.',
	video: 'Voce e video viaggiano in tempo reale tra persone collegate insieme: è una videochiamata.',
	streaming: 'Il contenuto si guarda o si ascolta mentre i dati arrivano, senza avere tutto il file: è lo streaming.',
	download: 'Si aspetta che il file arrivi tutto, e poi lo si ha sul dispositivo anche senza connessione: è scaricare il file.',
	ftp: 'Dei file vengono copiati da un computer al server di un sito: è il trasferimento di file, che ha un protocollo apposito.'
};

const SYNC: [string, string][] = [
	['s1', 'Una telefonata'],
	['s2', 'Una videochiamata con i nonni'],
	['s3', 'Una lezione a distanza in diretta'],
	['s4', 'Un colloquio in videochiamata'],
	['s5', "Una chiamata vocale dall'app di messaggistica"],
	['s6', 'Una riunione in videoconferenza']
];
const ASYNC: [string, string][] = [
	['a1', 'Una mail alla segreteria'],
	['a2', 'Un messaggio lasciato nella chat della classe, letto più tardi'],
	['a3', "Un messaggio vocale registrato, che l'altro ascolta dopo"],
	['a4', 'Un invito a un torneo spedito per posta elettronica'],
	['a5', 'Un commento lasciato sotto un video'],
	['a6', 'Una mail a cui rispondi il giorno dopo']
];

function level5(rng: Rng): Built {
	const prompt = 'Scegli il servizio adatto.';
	if (rng.next() < 0.6) {
		const use = rng.int(0, SERVICE_USES.length - 1);
		const [service, text] = SERVICE_USES[use];
		const N = rng.pick(NAMES);
		// scaricare un file and copying files to a server are too close to stand as each other's wrong option
		const banned: Service | null = service === 'download' ? 'ftp' : service === 'ftp' ? 'download' : null;
		const others = take(
			rng,
			(Object.keys(SERVICES) as Service[]).filter((s) => s !== service && s !== banned),
			3
		);
		const o = (s: Service) => textOption(SERVICES[s], s);
		return {
			prompt,
			problem: `${text(N)} Di quale servizio si tratta?`,
			solution: SERVICES[service],
			steps: [SERVICE_WHY[service], 'Sono servizi diversi che usano la stessa rete, ognuno con i suoi programmi e il suo protocollo.'],
			answer: choose(rng, o(service), others.map(o)),
			params: { case: 'servizio', use, name: N, others }
		};
	}
	const wantSync = rng.next() < 0.5;
	const [rights, wrongs] = wantSync ? [SYNC, ASYNC] : [ASYNC, SYNC];
	const right = rng.pick(rights);
	const others = take(rng, wrongs, 3);
	const o = ([id, text]: [string, string]) => textOption(text, id);
	return {
		prompt,
		problem: `Quale di queste comunicazioni è ${wantSync ? 'sincrona' : 'asincrona'}?`,
		solution: right[1],
		steps: [
			'Una comunicazione è sincrona quando le persone sono collegate insieme e si rispondono in tempo reale; è asincrona quando il messaggio aspetta, e chi scrive e chi legge non devono esserci nello stesso momento.',
			wantSync ? `${right[1]} avviene in tempo reale: è sincrona. Nelle altre tre il messaggio aspetta di essere letto o ascoltato.` : `${right[1]}: il messaggio aspetta chi lo riceve, quindi è asincrona. Nelle altre tre le persone sono collegate nello stesso momento.`
		],
		answer: choose(rng, o(right), others.map(o)),
		params: { case: wantSync ? 'sincrona' : 'asincrona', ids: [right[0], ...others.map((x) => x[0])] }
	};
}

// ---------------------------------------------------------------------------
// Level 6: true and false statements

const TRUE: Statement[] = [
	{ id: 't1', text: 'Con la webmail leggi la posta dal browser, senza installare niente', why: 'La webmail è il sito del servizio di posta: si apre nel browser e non richiede di installare niente.' },
	{ id: 't2', text: 'Webmail e client di posta mostrano la stessa casella, che sta sul server', why: 'La casella sta sul server: la webmail e il client di posta sono due modi di arrivare alla stessa casella.' },
	{ id: 't3', text: 'Un messaggio di posta aspetta nella casella anche se il destinatario ha il dispositivo spento', why: 'Il messaggio viene affidato a un server sempre acceso e aspetta nella casella finché il destinatario non lo legge.' },
	{ id: 't4', text: 'Nella cartella dello spam può finire per errore un messaggio vero', why: 'Il servizio riconosce lo spam da solo, e ogni tanto sbaglia: nella cartella può finire un messaggio vero.' },
	{ id: 't5', text: 'Un video troppo grande per un allegato si carica nel cloud e si manda il link', why: 'Gli allegati hanno un limite di dimensione: un file grande si carica nel cloud e nel messaggio si scrive il link.' },
	{ id: 't6', text: 'Nello streaming la riproduzione comincia mentre i dati stanno ancora arrivando', why: 'Lo streaming riproduce il contenuto mentre i dati arrivano, senza attendere tutto il file.' },
	{ id: 't7', text: 'Un file scaricato si può aprire anche senza connessione', why: 'Scaricare vuol dire aspettare che il file arrivi tutto: poi sta sul dispositivo, anche senza connessione.' },
	{ id: 't8', text: 'In una chiamata via Internet un pezzetto di voce perso non viene aspettato', why: 'In una chiamata conta arrivare in tempo: un pezzetto perso è un istante di voce che salta, e non lo si aspetta.' },
	{ id: 't9', text: 'Una pagina web può non aprirsi mentre la posta funziona, perché sono servizi diversi', why: 'Web e posta sono servizi diversi sulla stessa rete: il server di uno può avere un problema mentre l\'altro funziona.' },
	{ id: 't10', text: 'Una mail si può scrivere a un indirizzo di qualunque servizio di posta', why: 'Una mail si può scrivere a qualunque indirizzo, di qualunque servizio: i server di posta si passano i messaggi.' },
	{ id: 't11', text: 'Inoltra manda il messaggio, allegati compresi, a chi non lo aveva ricevuto', why: 'Inoltra manda il messaggio, con i suoi allegati, a qualcuno che non lo aveva ricevuto.' },
	{ id: 't12', text: 'Un oggetto preciso fa capire di che cosa parla la mail prima di aprirla', why: "L'oggetto dice in una riga l'argomento: chi riceve molte mail capisce da lì di che cosa si tratta." }
];
const FALSE: Statement[] = [
	{ id: 'f1', text: 'La webmail e il client di posta leggono due caselle diverse', why: 'Webmail e client di posta leggono la stessa casella, che sta sul server.' },
	{ id: 'f2', text: 'Un messaggio di posta arriva solo se il destinatario è collegato in quel momento', why: 'La posta è asincrona: il messaggio aspetta nella casella, anche se il destinatario non è collegato.' },
	{ id: 'f3', text: 'Tutto quello che finisce nella cartella dello spam è di sicuro pubblicità', why: 'Nella cartella dello spam ogni tanto finisce per errore anche un messaggio vero.' },
	{ id: 'f4', text: 'Un allegato può avere qualunque dimensione', why: 'Gli allegati hanno un limite di dimensione, che dipende dal servizio.' },
	{ id: 'f5', text: 'Per guardare un video in streaming bisogna prima scaricare tutto il file', why: 'Nello streaming il video si guarda mentre i dati arrivano, senza avere tutto il file.' },
	{ id: 'f6', text: 'Un contenuto visto in streaming resta sul dispositivo anche senza connessione', why: 'Resta sul dispositivo un file scaricato; lo streaming ha bisogno della connessione mentre guardi.' },
	{ id: 'f7', text: 'Internet e il web sono la stessa cosa', why: 'Internet è la rete; il web è uno dei servizi che la usano, come la posta e lo streaming.' },
	{ id: 'f8', text: 'Se una pagina web non si apre, di sicuro non funziona nemmeno la posta', why: 'Web e posta sono servizi diversi: una pagina può non aprirsi mentre i messaggi arrivano.' },
	{ id: 'f9', text: 'Con la messaggistica istantanea di solito si scrive anche a chi usa un\'altra app', why: 'Nella messaggistica istantanea di solito i due devono usare la stessa app; è la mail che arriva a qualunque indirizzo.' },
	{ id: 'f10', text: 'Rispondi a tutti scrive solo al mittente', why: 'Solo al mittente scrive Rispondi; Rispondi a tutti scrive anche a chi era in A e in Cc.' },
	{ id: 'f11', text: 'Un messaggio di posta va direttamente al computer del destinatario, senza passare da un server', why: 'Il messaggio passa dai server di posta e aspetta nella casella: non va direttamente al computer del destinatario.' },
	{ id: 'f12', text: "L'oggetto di una mail si può lasciare vuoto, perché conta solo il testo", why: "L'oggetto non si lascia mai vuoto: dice di che cosa parla il messaggio e permette di ritrovarlo." }
];

export default makeGenerator(ID, 'Posta elettronica e altri servizi di Internet', {
	1: { label: 'Le parti di un indirizzo', constraints: ['un indirizzo composto ogni volta: il nome utente, il dominio, la casella sullo stesso server, la scrittura valida, che cosa succede se lo scrivi diverso; un quinto ciascuno'], build: level1 },
	2: { label: 'Il viaggio di un messaggio', constraints: ['due persone su due domini diversi: il computer di un passo del viaggio (circa 65 su 100), oppure il protocollo di una situazione'], build: level2 },
	3: { label: 'A, Cc o Ccn', constraints: ['una situazione con un destinatario: il campo tra A, Cc, Ccn e Oggetto; A, Cc e Ccn giusti un terzo ciascuno'], build: level3 },
	4: { label: 'Chi riceve e chi vede', constraints: ['un messaggio con da 1 a 3 persone in A, in Cc e in Ccn, almeno 3 tra A e Cc: quanti ricevono, chi resta nascosto, quanti ricevono la risposta con Rispondi e con Rispondi a tutti'], build: level4 },
	5: { label: 'Quale servizio usare', constraints: ['il servizio di una situazione (circa 6 su 10), oppure la comunicazione sincrona tra tre asincrone o il contrario'], build: level5 },
	6: { label: 'Vero o falso sui servizi di rete', constraints: ["l'affermazione vera tra tre false, o la falsa tra tre vere, circa metà ciascuno"], build: (rng) => statementLevel(rng, TRUE, FALSE, 'sui servizi di Internet', 'Ragiona sui servizi di Internet.') }
});
