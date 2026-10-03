/**
 * Funzioni del sistema operativo. Spec: specs/exercises/inf-funzioni-so.md
 *
 * Four levels from the lesson (docs/lezioni/informatica/riscritte/18-inf-funzioni-so.md), all multiple choice, made
 * of interchangeable pieces: tasks of the operating system and of applications; situations and the function they
 * show; the layers a request crosses; true and false statements about the kernel and the system.
 */
import type { Rng } from '../types';
import { NAMES, cap, choose, makeGenerator, opt, shuffle, statementLevel, textBlock, wrapText, type Built, type Statement } from '../inf-so';

export const ID = 'inf-funzioni-so';

// ---------------------------------------------------------------------------
// Level 1: tasks of the operating system, tasks of applications

const OS_TASKS: [string, string][] = [
	['o1', 'decidere quale programma usa la CPU'],
	['o2', 'assegnare la RAM ai programmi aperti'],
	['o3', 'ricordare in quale punto del disco sta ogni file'],
	['o4', 'far dialogare i programmi con la stampante'],
	['o5', 'impedire a un programma di leggere la memoria di un altro'],
	['o6', 'caricare un programma nella RAM quando lo apri'],
	['o7', 'tradurre le richieste dei programmi nei comandi di una periferica'],
	['o8', 'controllare chi può aprire un file'],
	['o9', 'riprendersi la memoria di un programma che è stato chiuso'],
	['o10', 'passare i tocchi sullo schermo al programma giusto'],
	['o11', 'organizzare i file in cartelle'],
	['o12', 'far avanzare a turno i programmi aperti'],
];
const APP_TASKS: [string, string][] = [
	['a1', "correggere gli errori di ortografia di un tema"],
	['a2', 'calcolare la media dei voti in una tabella'],
	['a3', 'ritoccare i colori di una foto'],
	['a4', 'mostrare una pagina web'],
	['a5', 'montare un video delle vacanze'],
	['a6', 'impaginare le slide di una presentazione'],
	['a7', 'gestire le mosse di una partita a scacchi'],
	['a8', "tradurre un testo dall'inglese all'italiano"],
	['a9', 'disegnare il grafico di una funzione'],
	['a10', 'calcolare il percorso più breve su una mappa'],
	['a11', 'riconoscere il titolo di una canzone'],
	['a12', 'tenere il punteggio di un videogioco'],
];

function level1(rng: Rng): Built {
	const isOs = rng.next() < 0.5;
	const [rights, wrongs] = isOs ? [OS_TASKS, APP_TASKS] : [APP_TASKS, OS_TASKS];
	const right = rng.pick(rights);
	const others = shuffle(rng, wrongs).slice(0, 3);
	const o = ([id, text]: [string, string]) => opt(cap(text), id);
	const step = isOs
		? `${cap(right[1])} vuol dire gestire una risorsa per conto di tutti i programmi: è un compito del sistema operativo. Le altre tre attività servono a chi usa il computer per fare un lavoro: le svolgono le applicazioni.`
		: `${cap(right[1])} serve a chi usa il computer per fare un lavoro: lo fa un'applicazione. Le altre tre attività gestiscono risorse per conto di tutti i programmi: sono compiti del sistema operativo.`;
	return {
		prompt: 'Distingui i compiti del sistema operativo da quelli delle applicazioni.',
		problem: textBlock(isOs ? 'Quale di queste attività è un compito del sistema operativo?' : 'Quale di queste attività non è un compito del sistema operativo?'),
		solution: wrapText(cap(right[1])),
		steps: [textBlock(step)],
		answer: choose(rng, o(right), others.map(o)),
		params: { case: isOs ? 'compito' : 'non compito', ids: [right[0], ...others.map((x) => x[0])] },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the function a situation shows

export const FUNCTIONS = {
	processi: 'Gestione dei processi',
	memoria: 'Gestione della memoria',
	file: 'Gestione dei file',
	periferiche: 'Gestione delle periferiche',
	interfaccia: 'Interfaccia utente',
} as const;
type Fn = keyof typeof FUNCTIONS;

const WHY: Record<Fn, string> = {
	processi: 'Si parla di chi usa la CPU e per quanto tempo: è la gestione dei processi.',
	memoria: 'Si parla dello spazio nella RAM assegnato ai programmi: è la gestione della memoria.',
	file: 'Si parla di dati conservati nella memoria di massa, in file e cartelle: è la gestione dei file.',
	periferiche: 'Si parla del dialogo con un dispositivo, attraverso il suo driver: è la gestione delle periferiche.',
	interfaccia: "Si parla di come la persona dà gli ordini e vede le risposte: è l'interfaccia utente.",
};

/** The situations: N is the name, k a number of programs. */
const SITUATIONS: [Fn, (N: string, k: number) => string][] = [
	['processi', (N) => `${N} ascolta la musica mentre scrive un messaggio: i due programmi avanzano a turno sulla stessa CPU.`],
	['processi', (N) => `Un gioco si blocca e ${N} lo chiude: il sistema gli toglie la CPU, e gli altri programmi proseguono.`],
	['processi', (N, k) => `${N} avvia ${k} programmi: il sistema decide in che ordine e per quanto tempo ciascuno usa la CPU.`],
	['processi', (N) => `Mentre ${N} guarda un video, il controllo degli aggiornamenti riceve la CPU a brevi turni e il video non si ferma.`],
	['memoria', (N) => `${N} apre un gioco: il sistema gli riserva una parte della RAM.`],
	['memoria', (N) => `${N} chiude il browser: lo spazio che occupava nella RAM torna disponibile per gli altri programmi.`],
	['memoria', (N) => `Sul telefono di ${N} un programma prova a leggere i dati che un altro tiene nella RAM, e il sistema lo ferma.`],
	['memoria', (N, k) => `${N} ha ${k} programmi aperti e la RAM è quasi piena: il sistema decide a quale programma togliere spazio.`],
	['file', (N) => `${N} salva un tema: il sistema sceglie in quale punto del disco scriverlo e ne registra il nome.`],
	['file', (N) => `${N} crea una cartella sul disco per raccogliere le foto delle vacanze.`],
	['file', (N) => `${N} cerca un documento per nome, e il sistema ritrova il punto del disco in cui è registrato.`],
	['file', (N) => `${N} cancella un video, e lo spazio che occupava sul disco torna libero.`],
	['periferiche', (N) => `${N} collega una stampante nuova, e il sistema installa il driver adatto a quel modello.`],
	['periferiche', (N) => `${N} collega delle cuffie senza fili, e il sistema manda lì il suono di tutti i programmi.`],
	['periferiche', (N) => `${N} chiede una stampa: il sistema traduce la richiesta nei comandi di quel modello di stampante.`],
	['periferiche', (N) => `${N} collega una tavoletta grafica: grazie al driver, tutti i programmi ne ricevono i segnali.`],
	['interfaccia', (N) => `Il sistema mostra a ${N} le icone dei programmi installati, da toccare per avviarli.`],
	['interfaccia', (N) => `${N} scrive un comando in una finestra di testo, e il sistema risponde con una riga di testo.`],
	['interfaccia', (N) => `${N} riduce a icona una finestra e ne porta un'altra in primo piano.`],
	['interfaccia', (N) => `${N} sceglie una voce da un menu per dare un ordine al sistema.`],
];

function level2(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const s = rng.int(0, SITUATIONS.length - 1);
	const [fn, text] = SITUATIONS[s];
	const others = shuffle(
		rng,
		(Object.keys(FUNCTIONS) as Fn[]).filter((f) => f !== fn),
	);
	return {
		prompt: 'Riconosci la funzione del sistema operativo.',
		problem: textBlock(`${text(N, rng.int(4, 9))} Quale funzione del sistema operativo descrive la situazione?`),
		solution: wrapText(FUNCTIONS[fn]),
		steps: [textBlock(WHY[fn])],
		answer: choose(
			rng,
			opt(FUNCTIONS[fn], fn),
			others.map((f) => opt(FUNCTIONS[f], f)),
		),
		params: { case: fn, situation: s, name: N },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the layers

export const LAYERS = ["L'hardware", 'Il sistema operativo', 'Le applicazioni', "L'utente"] as const; // from the bottom
const layerOpt = (i: number) => opt(LAYERS[i], String(i));

const REQUESTS: [string, string][] = [
	['un programma di videoscrittura', 'stampare una relazione'],
	['un gioco', 'disegnare una scena sullo schermo'],
	['il browser', 'scaricare una pagina dalla rete'],
	['il lettore di musica', 'far uscire un brano dalle casse'],
	['un programma di fotoritocco', 'leggere una foto dal disco'],
	["un'app di messaggi", 'registrare un vocale con il microfono'],
	["un'app per le videochiamate", 'accendere la videocamera'],
	['un programma di disegno', "salvare un'immagine sul disco"],
	['un foglio di calcolo', 'stampare una tabella'],
	["un'app di mappe", 'leggere la posizione dal ricevitore GPS'],
];
const ROUTES: [string, string][] = [
	['a-s-h', 'Applicazione, sistema operativo, hardware'],
	['a-h-s', 'Applicazione, hardware, sistema operativo'],
	['s-a-h', 'Sistema operativo, applicazione, hardware'],
	['h-s-a', 'Hardware, sistema operativo, applicazione'],
	['a-h', 'Applicazione e subito hardware'],
];
/** What each layer does, from the bottom. */
const ROLES: string[][] = [
	['esegue fisicamente le istruzioni', 'è fatto di componenti che si possono toccare', 'sta più in basso di tutti'],
	['comanda le periferiche attraverso i driver', 'riceve le chiamate di sistema', 'assegna la CPU e la memoria ai programmi'],
	['chiede le risorse con le chiamate di sistema', "serve all'utente per scrivere, giocare o navigare", "sta tra l'utente e il sistema operativo"],
	['sta più in alto di tutti', "dà gli ordini attraverso l'interfaccia", "usa le applicazioni senza conoscere l'hardware"],
];
const OF_LAYER = ["dell'hardware", 'del sistema operativo', 'delle applicazioni', "dell'utente"];

function level3(rng: Rng): Built {
	const r = rng.next();
	const prompt = 'Ragiona sul modello a strati.';
	if (r < 0.6) {
		const N = rng.pick(NAMES);
		const k = rng.int(0, REQUESTS.length - 1);
		const [app, action] = REQUESTS[k];
		const o = ([id, text]: [string, string]) => opt(text, id);
		return {
			prompt,
			problem: textBlock(`${N} usa ${app} per ${action}. Nel modello a strati, per quali strati passa la richiesta, nell'ordine?`),
			solution: wrapText(ROUTES[0][1]),
			steps: [textBlock("Un'applicazione non comanda l'hardware: fa la richiesta al sistema operativo con una chiamata di sistema."), textBlock("Il nucleo, con il driver giusto, comanda il dispositivo: la richiesta passa dall'applicazione al sistema operativo e da lì all'hardware.")],
			answer: choose(rng, o(ROUTES[0]), shuffle(rng, ROUTES.slice(1)).map(o)),
			params: { case: 'percorso', request: k, name: N },
		};
	}
	if (r < 0.75) {
		const above = rng.next() < 0.5;
		const i = above ? rng.int(0, 2) : rng.int(1, 3);
		const right = above ? i + 1 : i - 1;
		const name = LAYERS[i].charAt(0).toLowerCase() + LAYERS[i].slice(1);
		return {
			prompt,
			problem: textBlock(`Nel modello a strati, quale strato sta subito ${above ? 'sopra' : 'sotto'} ${name}?`),
			solution: wrapText(LAYERS[right]),
			steps: [textBlock("Dal basso verso l'alto gli strati sono: hardware, sistema operativo, applicazioni, utente."), textBlock(`Subito ${above ? 'sopra' : 'sotto'} ${name} c'è ${LAYERS[right].charAt(0).toLowerCase() + LAYERS[right].slice(1)}.`)],
			answer: choose(rng, layerOpt(right), shuffle(rng, [0, 1, 2, 3].filter((x) => x !== right)).map(layerOpt)),
			params: { case: 'vicino', layer: i, above },
		};
	}
	const i = rng.int(0, 3);
	const role = rng.pick(ROLES[i]);
	return {
		prompt,
		problem: textBlock(`Nel modello a strati, quale strato ${role}?`),
		solution: wrapText(LAYERS[i]),
		steps: [textBlock(`Lo strato che ${role} è quello ${OF_LAYER[i]}.`), textBlock("Dal basso verso l'alto gli strati sono: hardware, sistema operativo, applicazioni, utente.")],
		answer: choose(rng, layerOpt(i), shuffle(rng, [0, 1, 2, 3].filter((x) => x !== i)).map(layerOpt)),
		params: { case: 'ruolo', layer: i },
	};
}

// ---------------------------------------------------------------------------
// Level 4: true and false statements

const TRUE: Statement[] = [
	{ id: 't1', text: 'Il sistema operativo è software di base', why: 'Il sistema operativo è software di base: gestisce il computer per conto delle applicazioni.' },
	{ id: 't2', text: 'Il nucleo resta in memoria finché il computer è acceso', why: "Il nucleo viene caricato all'avvio e resta in memoria finché il computer è acceso." },
	{ id: 't3', text: 'Un driver è scritto per un modello preciso di periferica', why: 'Un driver traduce le richieste nei comandi di un modello preciso di periferica.' },
	{ id: 't4', text: 'Le applicazioni chiedono le risorse al nucleo con le chiamate di sistema', why: 'Le applicazioni non usano le risorse da sole: le chiedono al nucleo con le chiamate di sistema.' },
	{ id: 't5', text: 'Sullo stesso computer si può installare un altro sistema operativo', why: 'Il sistema operativo è software: sullo stesso computer se ne può installare un altro.' },
	{ id: 't6', text: 'Anche un telefono ha un sistema operativo', why: 'Telefoni, tablet e console hanno un sistema operativo, come i computer.' },
	{ id: 't7', text: 'Il file system è la parte del sistema che gestisce i file', why: 'La gestione dei file è il compito del file system.' },
	{ id: 't8', text: 'Il nucleo è il solo software che comanda direttamente le periferiche', why: "Il nucleo, attraverso i driver, è il solo software che comanda direttamente l'hardware." },
	{ id: 't9', text: 'Un sistema operativo può funzionare senza interfaccia grafica', why: "L'interfaccia può essere a riga di comando: molti server non hanno una grafica." },
	{ id: 't10', text: 'Un programma già installato su un computer nuovo può essere una applicazione', why: 'Browser e calcolatrice sono applicazioni anche quando si trovano già installati.' },
	{ id: 't11', text: 'Nel modello a strati ogni strato comunica solo con quelli vicini', why: 'Nel modello a strati ogni strato usa quello sotto e serve quello sopra: comunica solo con i vicini.' },
	{ id: 't12', text: 'Il sistema operativo tiene separata la memoria dei diversi programmi', why: 'La gestione della memoria impedisce a un processo di leggere la memoria di un altro.' },
];
const FALSE: Statement[] = [
	{ id: 'f1', text: "Il sistema operativo è un componente dell'hardware", why: "Il sistema operativo è software, non hardware: si installa, si aggiorna e si può sostituire." },
	{ id: 'f2', text: 'Il nucleo è la parte del sistema operativo che si vede sullo schermo', why: "Sullo schermo si vede l'interfaccia; il nucleo lavora senza mostrare niente." },
	{ id: 'f3', text: 'Una applicazione comanda la stampante senza passare dal sistema operativo', why: "Un'applicazione non comanda la stampante: lo chiede al sistema operativo, che usa il driver." },
	{ id: 'f4', text: 'Il browser fa parte del nucleo', why: 'Il browser è una applicazione: non fa parte del nucleo.' },
	{ id: 'f5', text: 'Uno stesso driver funziona con qualunque modello di periferica', why: 'Ogni driver è scritto per un modello preciso di periferica.' },
	{ id: 'f6', text: 'I telefoni non hanno un sistema operativo', why: 'Anche i telefoni hanno un sistema operativo.' },
	{ id: 'f7', text: 'Il sistema operativo serve solo a mostrare icone e finestre', why: "Icone e finestre sono solo l'interfaccia: il sistema gestisce anche processi, memoria, file e periferiche." },
	{ id: 'f8', text: 'Per cambiare sistema operativo bisogna cambiare la CPU', why: "Il sistema operativo si sostituisce lasciando lo stesso hardware." },
	{ id: 'f9', text: 'Ogni programma già installato fa parte del sistema operativo', why: 'Molti programmi già installati, come il browser, sono applicazioni.' },
	{ id: 'f10', text: 'Il nucleo viene caricato in memoria solo quando si apre una applicazione', why: "Il nucleo viene caricato all'avvio, prima di qualunque applicazione." },
	{ id: 'f11', text: "Nel modello a strati l'utente comunica direttamente con l'hardware", why: "L'utente usa le applicazioni e l'interfaccia: tra lui e l'hardware c'è il sistema operativo." },
	{ id: 'f12', text: 'La gestione dei file decide quale programma usa la CPU', why: 'Chi usa la CPU lo decide la gestione dei processi, non quella dei file.' },
];

export default makeGenerator(ID, 'Funzioni del sistema operativo', {
	1: { label: 'I compiti del sistema operativo', constraints: ['un compito del sistema operativo tra tre di applicazioni, o il contrario, circa metà ciascuno'], make: level1 },
	2: { label: 'Le cinque funzioni', constraints: ['una situazione con un nome di persona: la funzione tra processi, memoria, file, periferiche, interfaccia'], make: level2 },
	3: { label: 'Il modello a strati', constraints: ['il percorso di una richiesta (circa 6 su 10), lo strato vicino, lo strato che fa una certa cosa'], make: level3 },
	4: { label: 'Vero o falso sul sistema operativo', constraints: ["l'affermazione vera tra tre false, o la falsa tra tre vere, circa metà ciascuno"], make: (rng) => statementLevel(rng, TRUE, FALSE, 'sul sistema operativo') },
});
