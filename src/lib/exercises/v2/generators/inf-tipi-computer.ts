/**
 * Computer, dispositivi mobili e sistemi embedded. Spec: specs/exercises/inf-tipi-computer.md
 *
 * Four levels from the lesson (docs/lezioni/informatica/riscritte/17-inf-tipi-computer.md), all multiple choice,
 * composed from interchangeable pieces: the family of computer fit for a job; which object is an embedded system
 * and which a general-purpose computer; what changes and what stays the same, true or false; the block a part of
 * an embedded system corresponds to (input, output, CPU, memory).
 */
import type { Rng } from '../types';
import { type Built, type Level, choose, makeGenerator, opt, pickDistinct, prep, textBlock } from '../inf-architettura';

export const ID = 'inf-tipi-computer';

// ---------------------------------------------------------------------------
// Level 1: the family fit for a job

export const FAMILIES = ['Supercomputer', 'Server', 'Personal computer', 'Dispositivo mobile', 'Sistema embedded'] as const;
type Family = (typeof FAMILIES)[number];

const FAMILY_WHY: Record<Family, string> = {
	Supercomputer: 'Un calcolo enorme, da dividere tra migliaia di processori che lavorano insieme: è il lavoro di un supercomputer.',
	Server: 'Un servizio offerto a molti altri computer attraverso la rete, giorno e notte: è il lavoro di un server.',
	'Personal computer': 'Un lavoro lungo di una persona, con tastiera, schermo grande e programmi da installare: serve un personal computer.',
	'Dispositivo mobile': 'Un computer di uso generale da portare con sé, a batteria, con schermo tattile e sensori: è un dispositivo mobile.',
	'Sistema embedded': 'Un compito solo, sempre lo stesso, dentro un altro oggetto: è un sistema embedded.',
};

/** Jobs, each completing "per …". */
export const JOBS: Record<Family, string[]> = {
	Supercomputer: [
		"calcolare le previsioni del tempo di tutta l'Europa",
		'simulare il clima della Terra nei prossimi cento anni',
		'simulare la nascita di una galassia',
		'studiare la forma di migliaia di proteine alla ricerca di un farmaco',
		"simulare l'aria che scorre attorno a un aereo in progetto",
		'simulare gli effetti di un terremoto su una città intera',
		'analizzare i dati di un grande esperimento di fisica',
		"simulare le correnti di tutto l'oceano Atlantico",
		'calcolare come si deforma una diga sotto la spinta di un lago',
		'simulare il traffico di una regione intera, auto per auto',
	],
	Server: [
		'rispondere a migliaia di studenti che aprono il registro elettronico',
		'conservare e consegnare la posta elettronica di tutta una scuola',
		'tenere in linea un sito web visitato giorno e notte',
		'far giocare in rete migliaia di giocatori nella stessa partita',
		'distribuire i film di un servizio di streaming',
		'conservare i file condivisi da tutti i computer di un ufficio',
		'registrare le prenotazioni dei treni fatte da tutta Italia',
		'tenere le pagine di una enciclopedia in rete a disposizione di chi le cerca',
		'ricevere e smistare i messaggi di una app di messaggistica',
		'conservare le copie di sicurezza delle foto di milioni di telefoni',
	],
	'Personal computer': [
		'scrivere una relazione lunga con tastiera e schermo grande',
		'montare il video della gita con un programma di montaggio',
		'preparare a casa una presentazione per la classe',
		'lavorare per ore a un foglio di calcolo con molte colonne',
		'scrivere e provare i tuoi primi programmi',
		'impaginare il giornalino della scuola',
		'ritoccare le foto con un programma di grafica e un mouse',
		'disegnare la pianta di una casa con un programma di disegno tecnico',
		'comporre una canzone con tastiera musicale e casse collegate',
		'scrivere la tesina e stamparla',
	],
	'Dispositivo mobile': [
		'fare una foto e mandarla agli amici mentre sei in autobus',
		'trovare la strada a piedi in una città che non conosci',
		'pagare alla cassa avvicinando il dispositivo al lettore',
		"leggere i messaggi durante l'intervallo",
		'contare i passi durante una corsa',
		'leggere un libro in treno su uno schermo da toccare',
		'fare una videochiamata da una panchina del parco',
		'ascoltare musica mentre cammini',
		'mostrare il biglietto al controllore sul treno',
		'guardare gli orari degli autobus alla fermata',
	],
	'Sistema embedded': [
		"regolare la temperatura dell'acqua in una lavatrice",
		'accendere e spegnere le luci di un semaforo',
		"decidere quando gonfiare l'airbag di un'auto",
		'tenere un forno alla temperatura scelta',
		'accendere la caldaia quando la casa si raffredda',
		'portare un ascensore al piano richiesto',
		'dare il resto in un distributore di merendine',
		'tenere stabile in volo un drone',
		'comandare i getti di inchiostro di una stampante',
		'alzare la sbarra di un parcheggio quando il biglietto è pagato',
		"evitare che le ruote di un'auto si blocchino in frenata",
		'spegnere un ferro da stiro dimenticato acceso',
	],
};

export const FRAMES = [(job: string) => `Quale tipo di computer è il più adatto per ${job}?`, (job: string) => `Serve un computer per ${job}. Di quale tipo sarà?`];

function level1(rng: Rng): Built {
	const family = rng.pick(FAMILIES);
	const job = rng.pick(JOBS[family]);
	const frame = rng.int(0, FRAMES.length - 1);
	return {
		prompt: 'Scegli il tipo di computer.',
		problem: textBlock(FRAMES[frame](job)),
		solution: opt(family).latex,
		steps: [textBlock(FAMILY_WHY[family])],
		answer: choose(
			rng,
			opt(family),
			pickDistinct(
				rng,
				FAMILIES.filter((f) => f !== family),
				3,
			).map((f) => opt(f)),
		),
		params: { case: family },
	};
}

// ---------------------------------------------------------------------------
// Level 2: embedded or general purpose

export const EMBEDDED = [
	'Il computer di bordo di una lavatrice',
	"La centralina dei freni di un'auto",
	'Il termostato di casa',
	'La scheda di un forno a microonde',
	'Il controllo di un ascensore',
	'La centralina di un semaforo',
	'Il telecomando del televisore',
	'La scheda di un distributore automatico',
	'Il controllo di volo di un drone',
	'La scheda di una stampante',
	'La scheda di una lavastoviglie',
	'Il computer di una bilancia elettronica',
	'La scheda di un cancello automatico',
	'Il controllo di un condizionatore',
];

export const GENERAL = ['Un portatile', 'Un computer fisso', 'Uno smartphone', 'Un tablet', 'Un server', 'Un supercomputer'];

function level2(rng: Rng): Built {
	const askEmbedded = rng.next() < 0.5;
	const right = rng.pick(askEmbedded ? EMBEDDED : GENERAL);
	const others = pickDistinct(rng, askEmbedded ? GENERAL : EMBEDDED, 3);
	return {
		prompt: askEmbedded ? 'Scegli il sistema embedded.' : 'Scegli quello che non è un sistema embedded.',
		problem: textBlock(askEmbedded ? 'Quale di questi è un sistema embedded?' : 'Quale di questi non è un sistema embedded?'),
		solution: opt(right).latex,
		steps: [
			textBlock('Un computer di uso generale esegue qualsiasi programma gli si installi. Un sistema embedded sta dentro un altro oggetto ed esegue sempre lo stesso programma, per farlo funzionare.'),
			textBlock(askEmbedded ? 'Gli altri tre eseguono i programmi che gli si caricano, grandi o piccoli che siano: non sono sistemi embedded.' : 'Gli altri tre sono chiusi dentro un oggetto e dedicati a un compito solo.'),
		],
		answer: choose(
			rng,
			opt(right),
			others.map((o) => opt(o)),
		),
		params: { case: askEmbedded ? 'embedded' : 'non-embedded' },
	};
}

// ---------------------------------------------------------------------------
// Level 3: what changes and what stays, true or false

export const TRUE_STATEMENTS = [
	'Un microcontrollore ha CPU, memoria e interfacce in un solo chip',
	'Anche un sistema embedded esegue un programma memorizzato',
	'Un supercomputer e un telefono hanno gli stessi quattro blocchi',
	'In un sistema embedded le periferiche sono sensori e attuatori',
	'Un server offre un servizio ad altri computer attraverso la rete',
	'Su un computer di uso generale si installano programmi nuovi',
	'Un supercomputer fa lavorare insieme migliaia di processori',
	'Uno smartphone è un computer di uso generale',
	'Un sistema embedded è dedicato a un compito solo',
	'La CPU di un dispositivo mobile è progettata per consumare poco',
];

export const FALSE_STATEMENTS: { text: string; why: string }[] = [
	{ text: 'Un sistema embedded non ha una CPU', why: 'Ogni computer ha una CPU: in un sistema embedded sta dentro il microcontrollore.' },
	{ text: 'Un supercomputer non ha memoria centrale', why: 'Ogni computer, di qualunque taglia, ha CPU, memoria centrale, periferiche e bus.' },
	{ text: 'Un microcontrollore non ha memoria', why: 'Un microcontrollore contiene CPU, memoria e interfacce in un solo chip.' },
	{ text: 'Uno smartphone non è un computer', why: 'Uno smartphone ha CPU, memoria e periferiche ed esegue i programmi che installi: è un computer di uso generale.' },
	{ text: 'Un sistema embedded non ha periferiche', why: 'Le periferiche di un sistema embedded sono i sensori e gli attuatori.' },
	{ text: 'Un server è una periferica di ingresso', why: 'Un server è un computer completo, che offre un servizio ad altri computer.' },
	{ text: 'Su una lavatrice si installano i programmi che si vogliono', why: 'Il programma di un sistema embedded è messo in fabbrica e resta sempre quello.' },
	{ text: 'Solo i computer con tastiera e schermo hanno periferiche', why: 'Anche sensori, motori e schede di rete sono periferiche.' },
	{ text: 'Un server deve avere per forza tastiera e schermo', why: 'Un server di solito non ha né tastiera né schermo: ci si collega da un altro computer.' },
	{ text: 'Un microcontrollore è più potente di un supercomputer', why: 'Il microcontrollore è il computer più piccolo e meno potente; il supercomputer il più potente.' },
	{ text: 'Uno smartphone è un sistema embedded perché è piccolo', why: 'Conta che cosa può eseguire, non la taglia: sullo smartphone installi i programmi che vuoi.' },
	{ text: 'Un sistema embedded non esegue nessun programma', why: 'Anche un sistema embedded esegue un programma memorizzato, sempre lo stesso.' },
];

function level3(rng: Rng): Built {
	if (rng.next() < 0.5) {
		const right = rng.pick(TRUE_STATEMENTS);
		const wrong = pickDistinct(rng, FALSE_STATEMENTS, 3);
		return {
			prompt: "Scegli l'affermazione vera.",
			problem: textBlock('Quale di queste affermazioni sui tipi di computer è vera?'),
			solution: opt(right).latex,
			steps: [textBlock(`Vera: ${right.charAt(0).toLowerCase()}${right.slice(1)}.`), ...wrong.map((w) => textBlock(w.why))],
			answer: choose(
				rng,
				opt(right),
				wrong.map((w) => opt(w.text)),
			),
			params: { case: 'vera' },
		};
	}
	const right = rng.pick(FALSE_STATEMENTS);
	return {
		prompt: "Scegli l'affermazione falsa.",
		problem: textBlock('Quale di queste affermazioni sui tipi di computer è falsa?'),
		solution: opt(right.text).latex,
		steps: [textBlock(right.why), textBlock('Le altre tre affermazioni sono vere.')],
		answer: choose(
			rng,
			opt(right.text),
			pickDistinct(rng, TRUE_STATEMENTS, 3).map((o) => opt(o)),
		),
		params: { case: 'falsa' },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the blocks of an embedded system

export const ROLES = ['Periferica di ingresso', 'Periferica di uscita', 'CPU', 'Memoria'] as const;

export const SYSTEMS: { where: string; inputs: string[]; outputs: string[] }[] = [
	{ where: 'una lavatrice', inputs: ["il sensore di temperatura dell'acqua", 'la manopola dei programmi', "il sensore del livello dell'acqua"], outputs: ['il motore del cestello', "la resistenza che scalda l'acqua", 'la spia di fine lavaggio'] },
	{ where: 'un semaforo', inputs: ['il pulsante per i pedoni', 'il sensore che rileva le auto in attesa'], outputs: ['le lampade rossa, gialla e verde', 'il segnale acustico per i pedoni'] },
	{ where: 'un termostato', inputs: ['il sensore di temperatura della stanza', 'i tasti per scegliere la temperatura'], outputs: ["l'interruttore che accende la caldaia", 'il piccolo schermo con la temperatura'] },
	{ where: "l'impianto dei freni di un'auto", inputs: ['i sensori di velocità delle ruote', 'il sensore del pedale del freno'], outputs: ['le valvole che regolano la frenata', 'la spia sul cruscotto'] },
	{ where: 'un forno a microonde', inputs: ['il tastierino del tempo di cottura', 'il sensore dello sportello'], outputs: ['il generatore di microonde', 'il motore del piatto', 'il segnale acustico di fine cottura'] },
	{ where: 'un ascensore', inputs: ['i pulsanti dei piani', 'il sensore delle porte'], outputs: ['il motore della cabina', 'il display del piano'] },
	{ where: 'un distributore di merendine', inputs: ['la gettoniera che riconosce le monete', 'il tastierino per scegliere il prodotto'], outputs: ['il motore che fa cadere il prodotto', 'il display del credito'] },
	{ where: 'un drone', inputs: ["il giroscopio che misura l'inclinazione", 'il ricevitore dei comandi del radiocomando'], outputs: ['i motori delle eliche', 'le luci di posizione'] },
	{ where: 'un cancello automatico', inputs: ['il ricevitore del telecomando', 'la fotocellula che rileva un ostacolo'], outputs: ['il motore che apre il cancello', 'il lampeggiante'] },
	{ where: 'una lavastoviglie', inputs: ["il sensore che misura la temperatura dell'acqua", 'i tasti del programma'], outputs: ["la pompa dell'acqua", 'la resistenza che asciuga i piatti'] },
	{ where: 'una stampante', inputs: ['il sensore che rileva la carta', 'i tasti del pannello'], outputs: ['il motore che trascina il foglio', "le testine che spruzzano l'inchiostro"] },
	{ where: 'un condizionatore', inputs: ["il sensore di temperatura dell'aria", 'il ricevitore del telecomando'], outputs: ['il compressore', 'la ventola'] },
	{ where: 'un frigorifero', inputs: ['il sensore della temperatura interna', 'il sensore della porta aperta'], outputs: ['il compressore', 'il segnale acustico della porta aperta'] },
	{ where: 'una bilancia elettronica', inputs: ['il sensore di peso', 'il tasto per azzerare'], outputs: ['il display del peso'] },
	{ where: 'un robot aspirapolvere', inputs: ['i sensori di urto', 'il sensore che rileva i gradini'], outputs: ['i motori delle ruote', 'il motore della spazzola'] },
	{ where: 'una serra automatica', inputs: ["il sensore di umidità del terreno", 'il sensore di luce'], outputs: ["la pompa dell'irrigazione", 'il motore che apre le finestre'] },
	{ where: 'una sveglia digitale', inputs: ["i tasti per regolare l'ora"], outputs: ["il display dell'ora", 'il cicalino'] },
];

export const CPU_PART = 'la parte del microcontrollore che esegue le istruzioni';
export const MEMORY_PART = 'la parte del microcontrollore che conserva il programma';

function level4(rng: Rng): Built {
	const u = rng.next();
	const role = u < 0.35 ? 0 : u < 0.7 ? 1 : u < 0.85 ? 2 : 3;
	const s = rng.pick(SYSTEMS);
	const part = role === 0 ? rng.pick(s.inputs) : role === 1 ? rng.pick(s.outputs) : role === 2 ? CPU_PART : MEMORY_PART;
	const plural = /^(le|i|gli) /.test(part);
	const why = [
		'Porta dentro il microcontrollore un dato: una misura o un comando di chi usa il dispositivo. È una periferica di ingresso.',
		"Riceve un comando dal microcontrollore e lo trasforma in un'azione o in un segnale: è un attuatore, cioè una periferica di uscita.",
		'Chi esegue le istruzioni è la CPU, che nel microcontrollore sta nello stesso chip della memoria.',
		'Il programma e i dati stanno nella memoria, che nel microcontrollore sta nello stesso chip della CPU.',
	][role];
	return {
		prompt: 'Scegli a quale parte dello schema corrisponde.',
		problem: textBlock(`Nel sistema embedded ${prep('di', s.where)}, a quale parte dello schema di von Neumann ${plural ? 'corrispondono' : 'corrisponde'} ${part}?`),
		solution: opt(ROLES[role]).latex,
		steps: [textBlock(why)],
		answer: choose(
			rng,
			opt(ROLES[role]),
			ROLES.filter((_, k) => k !== role).map((r) => opt(r)),
		),
		params: { case: ROLES[role] },
	};
}

const LEVELS: Record<number, Level> = {
	1: { label: 'Quale computer per quale lavoro', constraints: ['un lavoro e il tipo di computer adatto tra supercomputer, server, personal computer, dispositivo mobile, sistema embedded; un quinto dei casi ciascuno'], make: level1 },
	2: { label: 'Embedded o no', constraints: ['metà: il sistema embedded tra tre computer che non lo sono; metà: quello che non è un sistema embedded tra tre che lo sono'], make: level2 },
	3: { label: 'Che cosa cambia e che cosa resta', constraints: ["l'affermazione vera tra tre false, o la falsa tra tre vere, metà ciascuna"], make: level3 },
	4: { label: 'I blocchi in un sistema embedded', constraints: ['un sensore, un attuatore o una parte del microcontrollore di diciassette oggetti: periferica di ingresso, di uscita, CPU o memoria'], make: level4 },
};

export const infTipiComputer = makeGenerator(ID, 'Computer, dispositivi mobili e sistemi embedded', LEVELS);

export default infTipiComputer;
