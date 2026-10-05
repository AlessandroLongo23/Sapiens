/**
 * Il modello client-server. Spec: specs/exercises/inf-client-server.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/34-inf-client-server.md), all multiple choice of
 * text, made of interchangeable pieces: who is the client and who the server in a service; the request, the
 * response and the four steps; the tasks of each; the way of a chat message through the server; client-server and
 * peer-to-peer situations; true and false statements.
 */
import { NAMES, cap, choose, makeGenerator, neighbourStep, oneAmong, rightLabel, statementLevel, textOption, type Built, type Item, type Statement } from '../inf-web1';
import type { Rng } from '../types';

export const ID = 'inf-client-server';

// ---------------------------------------------------------------------------
// The services of levels 1 and 2

interface Service {
	id: string;
	/** What the person does, after the name. */
	act: string;
	app: string;
	/** Whose computer the server runs on. */
	owner: string;
	request: string;
	response: string;
}

export const SERVICES: Service[] = [
	{ id: 'registro', act: "tocca «Voti» nell'app del registro elettronico, e dopo un attimo compare l'elenco", app: "l'app del registro", owner: 'della società del registro', request: 'i voti di uno studente', response: "l'elenco dei voti" },
	{ id: 'treni', act: "cerca un treno nell'app delle ferrovie, e compare l'orario", app: "l'app delle ferrovie", owner: 'delle ferrovie', request: "l'orario dei treni per una città", response: "l'elenco dei treni con gli orari" },
	{ id: 'meteo', act: "apre l'app del meteo, e compaiono le previsioni", app: "l'app del meteo", owner: 'del servizio meteo', request: 'le previsioni per una città', response: 'le previsioni dei prossimi giorni' },
	{ id: 'posta', act: "apre l'app della posta, e compaiono i messaggi nuovi", app: "l'app della posta", owner: 'del servizio di posta', request: 'i messaggi arrivati', response: "l'elenco dei messaggi nuovi" },
	{ id: 'biblioteca', act: "cerca un libro nell'app della biblioteca, e scopre se è in prestito", app: "l'app della biblioteca", owner: 'della biblioteca', request: 'la disponibilità di un libro', response: 'le copie libere di quel libro' },
	{ id: 'musica', act: "sceglie una canzone nell'app della musica, e la canzone parte", app: "l'app della musica", owner: 'del servizio di musica', request: 'una canzone', response: 'il file della canzone' },
	{ id: 'negozio', act: "apre l'app di un negozio, e compaiono le offerte del giorno", app: "l'app del negozio", owner: 'del negozio', request: 'le offerte del giorno', response: "l'elenco delle offerte" },
	{ id: 'mappe', act: "cerca una via nell'app delle mappe, e compare la cartina", app: "l'app delle mappe", owner: 'del servizio di mappe', request: 'la cartina di una zona', response: "l'immagine della cartina" },
	{ id: 'cinema', act: "apre l'app del cinema, e compaiono i film in programma", app: "l'app del cinema", owner: 'del cinema', request: 'i film in programma', response: "l'elenco dei film con gli orari" },
	{ id: 'mensa', act: "apre l'app della mensa, e compare il menu della settimana", app: "l'app della mensa", owner: 'della mensa', request: 'il menu della settimana', response: 'i piatti di ogni giorno' }
];

// ---------------------------------------------------------------------------
// Level 1: who is the client, who is the server

function level1(rng: Rng): Built {
	const role = rng.pick(['client', 'server'] as const);
	const N = rng.pick(NAMES);
	const s = rng.pick(SERVICES);
	const options = {
		client: `${cap(s.app)} sul telefono di ${N}`,
		server: `Il programma che gira su un computer ${s.owner}`,
		utente: `${N}, che tocca lo schermo`,
		tecnico: `Il tecnico che controlla i computer ${s.owner}`
	};
	const answer = choose(
		rng,
		textOption(options[role], role),
		(['client', 'server', 'utente', 'tecnico'] as const).filter((r) => r !== role).map((r) => textOption(options[r], r))
	);
	return {
		prompt: 'Riconosci i ruoli.',
		problem: `${N} ${s.act}. In questo scambio, chi è il ${role}?`,
		solution: rightLabel(answer),
		steps:
			role === 'client'
				? [`Il client è il programma che manda la richiesta e aspetta la risposta: qui è ${s.app}.`, `${N} è l'utente. Il client è il programma che manda le richieste al posto suo.`]
				: [`Il server è il programma che offre il servizio: resta in attesa, e risponde alle richieste. Qui gira su un computer ${s.owner}.`, 'Il server non è il tecnico che lo gestisce: è un programma.'],
		answer,
		params: { case: role, service: s.id, name: N }
	};
}

// ---------------------------------------------------------------------------
// Level 2: request, response, the four steps

export const STEPS = ['Il client manda la richiesta al server', 'Il server riceve la richiesta e la esegue', 'Il server manda la risposta al client', 'Il client riceve la risposta e la mostra sullo schermo'];

function level2(rng: Rng): Built {
	const kind = rng.pick(['richiesta', 'richiesta', 'richiesta', 'risposta', 'risposta', 'risposta', 'passo', 'passo', 'passo', 'passo'] as const);
	const N = rng.pick(NAMES);
	const s = rng.pick(SERVICES);
	const prompt = 'Segui lo scambio tra client e server.';
	if (kind === 'passo') {
		const q = neighbourStep(rng, STEPS);
		return {
			prompt,
			problem: `${N} ${s.act}. ${q.ask}`,
			solution: rightLabel(q.answer),
			steps: ['I passi sono quattro: il client manda la richiesta, il server la riceve e la esegue, il server manda la risposta, il client la riceve e la mostra.', `Subito ${q.after ? 'dopo' : 'prima'} c'è il passo ${q.right}: «${STEPS[q.right - 1]}».`],
			answer: q.answer,
			params: { case: kind, service: s.id, name: N, step: q.step, after: q.after }
		};
	}
	// direction and content: only one of the four is a message of this exchange with the name asked for
	const options = {
		'c>s:richiesta': `${cap(s.app)} chiede al server ${s.request}`,
		's>c:risposta': `Il server manda all'app ${s.response}`,
		's>c:richiesta': `Il server chiede all'app ${s.request}`,
		'c>s:risposta': `${cap(s.app)} manda al server ${s.response}`
	};
	type Key = keyof typeof options;
	const right: Key = kind === 'richiesta' ? 'c>s:richiesta' : 's>c:risposta';
	const answer = choose(
		rng,
		textOption(options[right], right),
		(Object.keys(options) as Key[]).filter((k) => k !== right).map((k) => textOption(options[k], k))
	);
	return {
		prompt,
		problem: `${N} ${s.act}. Qual è la ${kind}?`,
		solution: rightLabel(answer),
		steps:
			kind === 'richiesta'
				? ["La richiesta è il messaggio che il client manda al server: parte dall'app, non dal server.", `L'app non ha ancora i dati: li chiede. La richiesta è «${s.request}».`]
				: ['La risposta è il messaggio che il server manda indietro al client, dopo aver eseguito la richiesta.', `I dati stanno sul server: è il server a mandare ${s.response}.`],
		answer,
		params: { case: kind, service: s.id, name: N }
	};
}

// ---------------------------------------------------------------------------
// Level 3: the tasks of the client and of the server

const SERVER_TASKS: Item[] = [
	['s1', 'conservare i dati di tutti gli utenti'],
	['s2', 'controllare che chi chiede un dato abbia il permesso di vederlo'],
	['s3', 'tenere la classifica di tutti i giocatori'],
	['s4', 'decidere chi ha vinto una partita in rete'],
	['s5', 'restare acceso giorno e notte, in attesa di richieste'],
	['s6', 'eseguire le richieste di migliaia di utenti insieme'],
	['s7', 'custodire i voti di tutta la scuola in un posto solo'],
	['s8', 'tenere un messaggio finché il destinatario non lo chiede']
];
const CLIENT_TASKS: Item[] = [
	['c1', 'disegnare la scena del gioco sullo schermo'],
	['c2', 'leggere i tasti che premi'],
	['c3', 'mostrare la risposta sullo schermo'],
	['c4', 'raccogliere quello che scrivi in un modulo'],
	['c5', 'mandare la richiesta quando tocchi un pulsante'],
	['c6', 'cominciare lo scambio'],
	['c7', "disporre sullo schermo l'elenco ricevuto"],
	['c8', 'ingrandire il testo sullo schermo quando lo chiedi']
];

function level3(rng: Rng): Built {
	const server = rng.next() < 0.5;
	const { right, answer, ids } = server ? oneAmong(rng, SERVER_TASKS, CLIENT_TASKS) : oneAmong(rng, CLIENT_TASKS, SERVER_TASKS);
	return {
		prompt: 'Dividi i compiti tra client e server.',
		problem: server ? 'Quale di questi compiti tocca al server?' : 'Quale di questi compiti tocca al client?',
		solution: rightLabel(answer),
		steps: [
			"Il client manda le richieste, mostra le risposte e raccoglie quello che l'utente scrive. Il server conserva i dati, esegue le richieste e controlla i permessi.",
			server ? `${cap(right[1])} serve a tutti gli utenti insieme: tocca al server. Gli altri tre compiti si svolgono sul dispositivo di un solo utente.` : `${cap(right[1])} si svolge sul dispositivo di un solo utente: tocca al client. Gli altri tre compiti servono a tutti gli utenti insieme, e toccano al server.`
		],
		answer,
		params: { case: server ? 'server' : 'client', ids }
	};
}

// ---------------------------------------------------------------------------
// Level 4: a chat message goes through the server

/** "a Luca", "ad Anna". */
const to = (name: string) => (/^[AEIOU]/.test(name) ? `ad ${name}` : `a ${name}`);

const WHERE = ['', ', che è nella stessa aula', ', che abita nel palazzo di fronte', ', che è in vacanza in un altro continente', ', che usa lo stesso Wi-Fi'];

function level4(rng: Rng): Built {
	const kind = rng.pick(['percorso', 'percorso', 'percorso', 'percorso', 'spento', 'spento', 'spento', 'chiede', 'chiede', 'chiede'] as const);
	const A = rng.pick(NAMES);
	const B = rng.pick(NAMES.filter((n) => n !== A));
	const prompt = 'Segui il messaggio di una chat.';
	const pick = (options: Record<string, string>) => {
		const [right, ...others] = Object.keys(options);
		return choose(
			rng,
			textOption(options[right], right),
			others.map((k) => textOption(options[k], k))
		);
	};
	if (kind === 'percorso') {
		const w = rng.int(0, WHERE.length - 1);
		const answer = pick({
			'A-server-B': `Dal telefono di ${A} al server della chat, e da lì al telefono di ${B}`,
			'A-B': `Dal telefono di ${A} direttamente al telefono di ${B}`,
			'A-B-server': `Dal telefono di ${A} al telefono di ${B}, che lo passa al server della chat`,
			'server-A-B': `Dal server della chat al telefono di ${A}, e da lì al telefono di ${B}`
		});
		return {
			prompt,
			problem: `${A} scrive in una chat ${to(B)}${WHERE[w]}. Che strada fa il messaggio?`,
			solution: rightLabel(answer),
			steps: ["I due telefoni sono entrambi client, e un client non aspetta richieste: nessuno dei due saprebbe ricevere dall'altro.", "Il messaggio va al server della chat, e il server lo consegna all'altro telefono. La distanza tra i due telefoni non conta."],
			answer,
			params: { case: kind, from: A, to: B, where: w }
		};
	}
	if (kind === 'spento') {
		const answer = pick({
			server: 'Sul server della chat',
			destinatario: `Sul telefono di ${B}`,
			router: `Sul router di casa di ${A}`,
			perso: 'Da nessuna parte: va perso'
		});
		return {
			prompt,
			problem: `${A} scrive in una chat ${to(B)}, che ha il telefono spento. Dove resta il messaggio finché ${B} non lo riaccende?`,
			solution: rightLabel(answer),
			steps: [`Il client di ${A} manda al server una richiesta: consegna questo messaggio ${to(B)}.`, `Il messaggio resta sul server, e parte appena il client di ${B} torna a chiedere se ci sono messaggi.`],
			answer,
			params: { case: kind, from: A, to: B }
		};
	}
	const answer = pick({
		'B chiede al server': `Il client di ${B} chiede al server se ci sono messaggi, e il server risponde con il messaggio`,
		'server da solo': `Il server lo manda al client di ${B} senza che nessuno abbia chiesto niente`,
		'A consegna': `Il client di ${A} lo consegna al client di ${B}`,
		'B chiede ad A': `Il client di ${B} lo chiede al client di ${A}`
	});
	return {
		prompt,
		problem: `Il messaggio che ${A} ha scritto ${to(B)} è arrivato al server della chat. Come arriva al telefono di ${B}?`,
		solution: rightLabel(answer),
		steps: ['Il server non manda niente di sua iniziativa: parla solo per rispondere.', `È il client di ${B} a fare il primo passo: chiede al server se ci sono messaggi per lui, e riceve la risposta.`],
		answer,
		params: { case: kind, from: A, to: B }
	};
}

// ---------------------------------------------------------------------------
// Level 5: client-server or peer-to-peer

const CS: Item[] = [
	['k1', "l'app delle ferrovie chiede l'orario dei treni a un computer che lo conserva per tutti"],
	['k2', "l'app del registro chiede i voti al computer della società che li custodisce"],
	['k3', 'un browser chiede una pagina al computer che conserva il sito'],
	['k4', "l'app della posta chiede i messaggi nuovi al computer del servizio di posta"],
	['k5', 'un telefono chiede una canzone al computer di un servizio di musica in streaming'],
	['k6', "l'app del meteo chiede le previsioni a un computer centrale, che risponde a tutti"],
	['k7', 'in un gioco in rete un computer centrale tiene la classifica, e le console gliela chiedono'],
	['k8', 'due telefoni si scrivono in chat passando da un computer centrale, che conserva i messaggi']
];
const P2P: Item[] = [
	['p1', 'dieci computer si scambiano i pezzi di un file molto grande, e ognuno passa agli altri quelli che ha già'],
	['p2', "due portatili collegati tra loro si passano le foto: ognuno chiede file all'altro e gliene offre"],
	['p3', 'quattro computer tengono ciascuno una copia di un archivio e la offrono agli altri, senza un computer centrale'],
	['p4', 'in un programma di scambio, chi scarica un video ne offre intanto i pezzi agli altri computer'],
	['p5', 'i computer di un gruppo di amici mettono ciascuno una cartella a disposizione di tutti gli altri, alla pari'],
	['p6', 'ogni computer collegato chiede dati agli altri e nello stesso tempo ne offre, senza un centro']
];

function level5(rng: Rng): Built {
	const peer = rng.next() < 0.5;
	const { answer, ids } = peer ? oneAmong(rng, P2P, CS) : oneAmong(rng, CS, P2P);
	return {
		prompt: 'Cerca chi chiede e chi offre i dati.',
		problem: peer ? 'In quale di queste situazioni il modello è peer-to-peer?' : 'In quale di queste situazioni il modello è client-server?',
		solution: rightLabel(answer),
		steps: [
			"Nel modello client-server i dati stanno in un posto solo, e i client li chiedono. Nel modello peer-to-peer non c'è un server centrale: ogni computer chiede dati agli altri e ne offre.",
			peer ? "Qui ogni computer ha tutti e due i ruoli: è peer-to-peer. Nelle altre tre situazioni un'app chiede i dati a un servizio che li conserva." : 'Qui un programma chiede i dati a un servizio che li conserva in un posto solo: è client-server. Nelle altre tre situazioni ogni computer chiede e offre.'
		],
		answer,
		params: { case: peer ? 'peer-to-peer' : 'client-server', ids }
	};
}

// ---------------------------------------------------------------------------
// Level 6: true and false statements

const TRUE: Statement[] = [
	{ id: 't1', text: 'Il client è un programma, non la persona che lo usa', why: "Il client è il programma che manda le richieste: la persona è l'utente." },
	{ id: 't2', text: 'A cominciare lo scambio è sempre il client', why: 'Il server aspetta, e parla solo per rispondere: a cominciare è sempre il client.' },
	{ id: 't3', text: 'Lo stesso computer può fare da client in uno scambio e da server in un altro', why: 'Client e server sono ruoli dei programmi: una macchina può farli entrambi.' },
	{ id: 't4', text: 'Un server porta avanti insieme le richieste di molti client', why: 'Un server riceve richieste da migliaia di client e le porta avanti in parallelo.' },
	{ id: 't5', text: 'Se il server si ferma, il servizio si ferma per tutti gli utenti', why: 'I dati stanno in un posto solo: se il server si ferma, il servizio si ferma per tutti.' },
	{ id: 't6', text: 'Se cambi telefono ritrovi i tuoi dati, perché stanno sul server', why: 'I dati stanno sul server, non sul telefono: cambiando telefono li ritrovi.' },
	{ id: 't7', text: 'È il server a decidere chi può vedere un dato', why: 'È il server a controllare i permessi, cioè chi può vedere che cosa.' },
	{ id: 't8', text: 'In una rete peer-to-peer ogni computer fa sia da client sia da server', why: 'Nel modello peer-to-peer ogni computer chiede dati agli altri e ne offre a sua volta.' },
	{ id: 't9', text: 'Una rete peer-to-peer continua a funzionare se uno dei computer si spegne', why: 'In una rete peer-to-peer nessun computer è indispensabile.' },
	{ id: 't10', text: 'Puoi scrivere in chat a chi ha il telefono spento', why: 'Il messaggio aspetta sul server finché il client del destinatario non torna a chiedere.' },
	{ id: 't11', text: 'Quando troppe richieste arrivano insieme, il server risponde lentamente', why: 'La capacità di un server ha un limite: con troppe richieste insieme è sovraccarico.' },
	{ id: 't12', text: 'Senza rete il client non riceve risposte dal server', why: "Senza rete il client non raggiunge il server: l'app resta vuota, o mostra l'ultima cosa scaricata." }
];
const FALSE: Statement[] = [
	{ id: 'f1', text: "Il client è la persona che usa l'app", why: "La persona è l'utente: il client è il programma che manda le richieste al posto suo." },
	{ id: 'f2', text: 'Il server manda dati ai client di sua iniziativa', why: 'Il server non manda niente di sua iniziativa: aspetta, e parla solo per rispondere.' },
	{ id: 'f3', text: 'Un server è per forza una macchina molto grande', why: 'Il server è un ruolo: non è per forza una macchina grande.' },
	{ id: 'f4', text: 'Un server risponde a un client alla volta, e gli altri aspettano', why: 'Un server porta avanti in parallelo le richieste di migliaia di client.' },
	{ id: 'f5', text: 'I voti del registro elettronico sono conservati sul tuo telefono', why: 'I voti stanno sul server del registro: il telefono li chiede ogni volta.' },
	{ id: 'f6', text: 'In una chat il messaggio va dal tuo telefono a quello del destinatario senza passare da altri computer', why: 'In una chat il messaggio passa dal server: i due telefoni sono entrambi client.' },
	{ id: 'f7', text: 'Due telefoni nella stessa stanza si scambiano i messaggi di una chat senza il server', why: 'La distanza tra i due client non conta: il messaggio passa comunque dal server.' },
	{ id: 'f8', text: 'In una rete peer-to-peer un server centrale conserva tutti i dati', why: "Nel modello peer-to-peer non c'è un server centrale." },
	{ id: 'f9', text: 'Un computer che fa da server non può mai fare da client', why: 'Lo stesso computer può fare da server in uno scambio e da client in un altro.' },
	{ id: 'f10', text: 'Se il server si ferma, i client continuano a ricevere i dati aggiornati', why: 'Se il server si ferma, il servizio si ferma per tutti.' },
	{ id: 'f11', text: 'Il server è il tecnico che gestisce i computer del servizio', why: 'Il server è un programma, non il tecnico che lo gestisce.' },
	{ id: 'f12', text: 'In una rete peer-to-peer qualcuno garantisce che ogni dato sia sempre disponibile', why: 'In una rete peer-to-peer nessuno garantisce che un dato sia sempre disponibile.' }
];

export default makeGenerator(ID, 'Il modello client-server', {
	1: { label: 'Chi è il client, chi è il server', constraints: ['un servizio e una persona: il client o il server, tra app, programma del servizio, utente e tecnico'], build: level1 },
	2: { label: 'Richiesta e risposta', constraints: ['la richiesta, la risposta (3 su 10 ciascuna) o il passo vicino tra i quattro dello scambio (4 su 10)'], build: level2 },
	3: { label: 'I compiti del client e del server', constraints: ['un compito del server tra tre del client, o il contrario'], build: level3 },
	4: { label: 'Un messaggio passa dal server', constraints: ['la strada di un messaggio (4 su 10), dove aspetta, chi fa il primo passo (3 su 10 ciascuno)'], build: level4 },
	5: { label: 'Client-server o peer-to-peer', constraints: ['una situazione peer-to-peer tra tre client-server, o il contrario'], build: level5 },
	6: { label: 'Vero o falso sul client-server', constraints: ["l'affermazione vera tra tre false, o la falsa tra tre vere"], build: (rng) => statementLevel(rng, TRUE, FALSE, 'sul modello client-server', 'Ripensa ai due ruoli.') }
});
