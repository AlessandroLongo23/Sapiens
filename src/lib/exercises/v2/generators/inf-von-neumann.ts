/**
 * La macchina di von Neumann. Spec: specs/exercises/inf-von-neumann.md
 *
 * Five levels from the lesson (docs/lezioni/informatica/riscritte/13-inf-von-neumann.md), all multiple choice,
 * composed from interchangeable pieces: the block a component belongs to; the block that does a task in a
 * scenario; from which block to which a datum travels; a true or false statement on the stored program; the step
 * that comes right after or right before another in the journey of a datum.
 */
import type { Rng } from '../types';
import { type Built, type Level, cap, choose, makeGenerator, opt, pickDistinct, prep, textBlock } from '../inf-architettura';

export const ID = 'inf-von-neumann';

export const BLOCKS = ['CPU', 'Memoria centrale', 'Periferiche', 'Bus'] as const;
type Block = (typeof BLOCKS)[number];

const WHY: Record<Block, string> = {
	CPU: 'La CPU esegue le istruzioni del programma: fa i calcoli e i confronti e decide quale istruzione viene dopo.',
	'Memoria centrale': 'La memoria centrale conserva il programma in esecuzione e i dati su cui sta lavorando.',
	Periferiche: "Le periferiche scambiano dati con l'esterno: quelle di ingresso li portano dentro, quelle di uscita li portano fuori.",
	Bus: "Il bus trasporta i bit da un blocco all'altro: non calcola e non conserva niente.",
};

const blockChoice = (rng: Rng, right: Block) =>
	choose(
		rng,
		opt(right),
		BLOCKS.filter((b) => b !== right).map((b) => opt(b)),
	);

// ---------------------------------------------------------------------------
// Level 1: the block a component belongs to

const D = { tel: 'un telefono', tab: 'un tablet', por: 'un portatile', fis: 'un computer fisso', con: 'una console per videogiochi', oro: 'uno smartwatch' };
const ALL = Object.values(D);

interface Component {
	name: string;
	block: Block;
	devices: string[];
	why: string;
}

export const COMPONENTS: Component[] = [
	{ name: 'il processore', block: 'CPU', devices: ALL, why: 'Il processore è il componente che esegue le istruzioni: è la CPU.' },
	{ name: 'il microprocessore', block: 'CPU', devices: ALL, why: 'Il microprocessore è il componente che esegue le istruzioni: è la CPU.' },
	{ name: 'il chip che esegue le istruzioni dei programmi', block: 'CPU', devices: ALL, why: 'Il componente che esegue le istruzioni è la CPU.' },
	{ name: 'la RAM', block: 'Memoria centrale', devices: ALL, why: 'RAM è il nome con cui sullo schermo trovi indicata la memoria centrale.' },
	{ name: 'la memoria RAM', block: 'Memoria centrale', devices: ALL, why: 'RAM è il nome con cui sullo schermo trovi indicata la memoria centrale.' },
	{ name: 'la memoria in cui stanno i programmi aperti in questo momento', block: 'Memoria centrale', devices: ALL, why: 'I programmi in esecuzione stanno nella memoria centrale.' },
	{ name: 'le piste di metallo che collegano il processore alla RAM', block: 'Bus', devices: ALL, why: 'I collegamenti su cui i bit viaggiano tra i blocchi sono il bus.' },
	{ name: 'i collegamenti su cui i dati viaggiano tra il processore e la RAM', block: 'Bus', devices: ALL, why: 'I collegamenti su cui i bit viaggiano tra i blocchi sono il bus.' },
	{ name: 'i collegamenti che portano i dati dalla RAM allo schermo', block: 'Bus', devices: [D.tel, D.tab, D.por], why: 'I collegamenti su cui i bit viaggiano tra i blocchi sono il bus.' },
	{ name: 'i collegamenti che portano i dati dal microfono alla RAM', block: 'Bus', devices: [D.tel, D.tab, D.por, D.oro], why: 'I collegamenti su cui i bit viaggiano tra i blocchi sono il bus.' },
	{ name: 'la tastiera', block: 'Periferiche', devices: [D.por, D.fis], why: 'La tastiera porta dentro i caratteri digitati: è una periferica di ingresso.' },
	{ name: 'il mouse', block: 'Periferiche', devices: [D.por, D.fis], why: 'Il mouse porta dentro i movimenti della mano: è una periferica di ingresso.' },
	{ name: 'lo schermo', block: 'Periferiche', devices: [D.tel, D.tab, D.por, D.fis, D.oro], why: "Lo schermo porta all'esterno le immagini: è una periferica di uscita." },
	{ name: 'il microfono', block: 'Periferiche', devices: [D.tel, D.tab, D.por, D.oro], why: 'Il microfono porta dentro i suoni: è una periferica di ingresso.' },
	{ name: "l'altoparlante", block: 'Periferiche', devices: [D.tel, D.tab, D.por, D.oro], why: "L'altoparlante porta all'esterno i suoni: è una periferica di uscita." },
	{ name: 'la fotocamera', block: 'Periferiche', devices: [D.tel, D.tab], why: 'La fotocamera porta dentro le immagini: è una periferica di ingresso.' },
	{ name: 'la webcam', block: 'Periferiche', devices: [D.por, D.fis], why: 'La webcam porta dentro le immagini: è una periferica di ingresso.' },
	{ name: 'la stampante', block: 'Periferiche', devices: [D.por, D.fis], why: "La stampante porta all'esterno i documenti: è una periferica di uscita." },
	{ name: 'il controller', block: 'Periferiche', devices: [D.con], why: 'Il controller porta dentro i tasti premuti: è una periferica di ingresso.' },
	{ name: 'le cuffie', block: 'Periferiche', devices: [D.tel, D.por, D.con], why: "Le cuffie portano all'esterno i suoni: sono una periferica di uscita." },
	{ name: 'il sensore di impronte', block: 'Periferiche', devices: [D.tel, D.por], why: "Il sensore porta dentro l'immagine dell'impronta: è una periferica di ingresso." },
	{ name: 'il touchpad', block: 'Periferiche', devices: [D.por], why: 'Il touchpad porta dentro i movimenti delle dita: è una periferica di ingresso.' },
	{ name: 'lo scanner', block: 'Periferiche', devices: [D.por, D.fis], why: "Lo scanner porta dentro l'immagine di un foglio: è una periferica di ingresso." },
	{ name: 'il proiettore', block: 'Periferiche', devices: [D.por, D.fis], why: "Il proiettore porta all'esterno le immagini: è una periferica di uscita." },
	{ name: 'il ricevitore GPS', block: 'Periferiche', devices: [D.tel, D.oro], why: 'Il ricevitore GPS porta dentro il segnale dei satelliti: è una periferica di ingresso.' },
	{ name: 'la tavoletta grafica', block: 'Periferiche', devices: [D.por, D.fis], why: 'La tavoletta grafica porta dentro i movimenti della penna: è una periferica di ingresso.' },
	{ name: 'il monitor', block: 'Periferiche', devices: [D.fis, D.con], why: "Il monitor porta all'esterno le immagini: è una periferica di uscita." },
	{ name: 'il disco', block: 'Periferiche', devices: [D.por, D.fis, D.con], why: 'Il disco è una memoria di massa: nello schema sta tra le periferiche, non nella memoria centrale.' },
	{ name: 'la chiavetta USB', block: 'Periferiche', devices: [D.por, D.fis], why: 'La chiavetta è una memoria di massa: nello schema sta tra le periferiche, non nella memoria centrale.' },
	{ name: 'la memoria interna in cui restano le foto', block: 'Periferiche', devices: [D.tel, D.tab], why: 'La memoria in cui restano i file è una memoria di massa: nello schema sta tra le periferiche, non nella memoria centrale.' },
];

/** "la chiavetta USB di un portatile" reads better as "collegata a". */
const ATTACHED = new Set(['la stampante', 'la chiavetta USB', 'le cuffie', 'lo scanner', 'il proiettore', 'la tavoletta grafica', 'il monitor']);

function level1(rng: Rng): Built {
	const block = rng.pick(BLOCKS);
	const c = rng.pick(COMPONENTS.filter((x) => x.block === block));
	const device = rng.pick(c.devices);
	const plural = /^(le|i|gli) /.test(c.name);
	const link = ATTACHED.has(c.name) ? (plural ? 'collegate a' : c.name.startsWith('la ') ? 'collegata a' : 'collegato a') : 'di';
	const verb = plural ? 'appartengono' : 'appartiene';
	return {
		prompt: 'Scegli il blocco della macchina di von Neumann.',
		problem: textBlock(`A quale blocco della macchina di von Neumann ${verb} ${c.name} ${link} ${device}?`),
		solution: opt(block).latex,
		steps: [textBlock(c.why), textBlock(WHY[block])],
		answer: blockChoice(rng, block),
		params: { case: block, component: c.name, device },
	};
}

// ---------------------------------------------------------------------------
// Scenarios, shared by levels 2, 3 and 5

export interface Scenario {
	use: string;
	app: string;
	dato: string;
	calc: string;
	calcInf: string;
	in: string;
	inDev: string;
	out: string;
	outDev: string;
}

export const SCENARIOS: Scenario[] = [
	{ use: 'Giochi a un videogioco su una console', app: 'del videogioco', dato: 'il punteggio della partita', calc: 'somma i punti appena fatti al punteggio', calcInf: 'sommare i punti appena fatti al punteggio', in: 'il tasto premuto', inDev: 'il controller', out: "l'immagine della partita", outDev: 'lo schermo' },
	{ use: 'Usi la calcolatrice del telefono', app: 'della calcolatrice', dato: 'il numero appena digitato', calc: 'moltiplica i due numeri digitati', calcInf: 'moltiplicare i due numeri digitati', in: 'le cifre toccate', inDev: 'lo schermo tattile', out: 'il risultato', outDev: 'lo schermo' },
	{ use: 'Apri il registro elettronico sul portatile', app: 'del registro elettronico', dato: "l'elenco dei voti", calc: 'calcola la media dei voti', calcInf: 'calcolare la media dei voti', in: 'la password digitata', inDev: 'la tastiera', out: 'la pagina dei voti', outDev: 'lo schermo' },
	{ use: 'Ascolti una canzone sul telefono', app: 'del lettore musicale', dato: 'il brano in riproduzione', calc: 'trasforma i bit del brano nei valori del suono', calcInf: 'trasformare i bit del brano nei valori del suono', in: 'il tocco sul tasto di pausa', inDev: 'lo schermo tattile', out: 'il suono della canzone', outDev: 'gli auricolari' },
	{ use: 'Scrivi un tema con un programma di videoscrittura', app: 'del programma di videoscrittura', dato: 'il testo del tema', calc: 'conta le parole del testo', calcInf: 'contare le parole del testo', in: 'le lettere digitate', inDev: 'la tastiera', out: 'la pagina del tema', outDev: 'la stampante' },
	{ use: 'Scatti una foto con il telefono', app: "dell'app della fotocamera", dato: 'i pixel della foto', calc: 'schiarisce i pixel della foto', calcInf: 'schiarire i pixel della foto', in: "l'immagine inquadrata", inDev: 'la fotocamera', out: 'la foto', outDev: 'lo schermo' },
	{ use: 'Registri un messaggio vocale con il telefono', app: "dell'app dei messaggi", dato: 'il suono registrato', calc: 'comprime il suono registrato', calcInf: 'comprimere il suono registrato', in: 'la tua voce', inDev: 'il microfono', out: 'il messaggio da riascoltare', outDev: "l'altoparlante" },
	{ use: 'Segui il navigatore sul telefono', app: 'del navigatore', dato: 'la posizione attuale', calc: 'calcola la distanza dalla destinazione', calcInf: 'calcolare la distanza dalla destinazione', in: 'il segnale dei satelliti', inDev: 'il ricevitore GPS', out: 'la mappa con il percorso', outDev: 'lo schermo' },
	{ use: 'Usi un foglio di calcolo sul computer fisso', app: 'del foglio di calcolo', dato: 'i numeri della tabella', calc: 'somma i numeri di una colonna', calcInf: 'sommare i numeri di una colonna', in: 'i numeri digitati', inDev: 'la tastiera', out: 'il grafico', outDev: 'il monitor' },
	{ use: 'Disegni con un programma di grafica sul computer fisso', app: 'del programma di grafica', dato: 'il disegno in lavorazione', calc: 'calcola il colore di ogni pixel del disegno', calcInf: 'calcolare il colore di ogni pixel del disegno', in: 'i movimenti della mano', inDev: 'il mouse', out: 'il disegno', outDev: 'il monitor' },
	{ use: 'Usi un traduttore sul telefono', app: 'del traduttore', dato: 'la frase da tradurre', calc: 'cerca nel dizionario le parole della frase', calcInf: 'cercare nel dizionario le parole della frase', in: 'la frase dettata', inDev: 'il microfono', out: 'la traduzione', outDev: 'lo schermo' },
	{ use: 'Imposti la sveglia sul telefono', app: 'della sveglia', dato: "l'ora della sveglia", calc: "confronta l'ora attuale con l'ora della sveglia", calcInf: "confrontare l'ora attuale con l'ora della sveglia", in: "l'ora scelta", inDev: 'lo schermo tattile', out: 'la suoneria', outDev: "l'altoparlante" },
	{ use: 'Cammini con un orologio contapassi al polso', app: 'del contapassi', dato: 'il numero dei passi', calc: 'aggiunge un passo al conteggio', calcInf: 'aggiungere un passo al conteggio', in: 'il movimento del polso', inDev: 'il sensore di movimento', out: 'il totale dei passi di oggi', outDev: "lo schermo dell'orologio" },
];

// ---------------------------------------------------------------------------
// Level 2: the block that does a task

export const TASKS: { block: Block; text: (s: Scenario) => string }[] = [
	{ block: 'CPU', text: (s) => `esegue le istruzioni ${s.app}` },
	{ block: 'CPU', text: (s) => s.calc },
	{ block: 'CPU', text: (s) => `decide quale istruzione ${s.app} va eseguita dopo` },
	{ block: 'Memoria centrale', text: (s) => `conserva le istruzioni ${s.app} mentre il programma è in esecuzione` },
	{ block: 'Memoria centrale', text: (s) => `conserva ${s.dato} mentre il programma lavora` },
	{ block: 'Memoria centrale', text: (s) => `tiene ${s.dato} a disposizione della CPU` },
	{ block: 'Periferiche', text: (s) => `riceve dall'esterno ${s.in}` },
	{ block: 'Periferiche', text: (s) => `porta all'esterno ${s.out}` },
	{ block: 'Bus', text: (s) => `trasporta ${s.dato} dalla memoria centrale alla CPU` },
	{ block: 'Bus', text: (s) => `trasporta ${s.out} dalla memoria centrale ${prep('a', s.outDev)}` },
	{ block: 'Bus', text: (s) => `trasporta ${s.in} ${prep('da', s.inDev)} alla memoria centrale` },
];

function level2(rng: Rng): Built {
	const block = rng.pick(BLOCKS);
	const s = rng.int(0, SCENARIOS.length - 1);
	const S = SCENARIOS[s];
	const pool = TASKS.map((task, k) => ({ task, k })).filter((x) => x.task.block === block);
	const { task, k } = rng.pick(pool);
	return {
		prompt: 'Scegli il blocco che svolge il compito.',
		problem: textBlock(`${S.use}. Quale blocco della macchina di von Neumann ${task.text(S)}?`),
		solution: opt(block).latex,
		steps: [textBlock(WHY[block])],
		answer: blockChoice(rng, block),
		params: { case: block, scenario: s, task: k },
	};
}

// ---------------------------------------------------------------------------
// Level 3: from which block to which a datum travels

export const MOVES = ['Da una periferica alla memoria centrale', 'Dalla memoria centrale alla CPU', 'Dalla CPU alla memoria centrale', 'Dalla memoria centrale a una periferica'] as const;

export const TRIPS: { move: number; text: (s: Scenario) => string; why: string }[] = [
	{ move: 0, text: (s) => `${cap(s.inDev)} ha appena ricevuto ${s.in}. Qual è il primo viaggio di questo dato sul bus?`, why: 'Un dato che entra da una periferica di ingresso viene scritto prima di tutto nella memoria centrale.' },
	{ move: 0, text: (s) => `Dopo che ${s.inDev} ha ricevuto ${s.in}, da dove a dove viaggia per prima cosa questo dato?`, why: 'Un dato che entra da una periferica di ingresso viene scritto prima di tutto nella memoria centrale.' },
	{ move: 1, text: (s) => `La CPU sta per eseguire un'istruzione che usa ${s.dato}. Da dove a dove viaggia questo dato prima del calcolo?`, why: 'Prima di eseguire un calcolo la CPU preleva dalla memoria centrale i dati che le servono.' },
	{ move: 1, text: (s) => `La CPU deve ${s.calcInf}. Da dove a dove viaggiano, prima del calcolo, i dati che le servono?`, why: 'Prima di eseguire un calcolo la CPU preleva dalla memoria centrale i dati che le servono.' },
	{ move: 2, text: (s) => `La CPU ha appena finito di ${s.calcInf}. Da dove a dove viaggia il risultato subito dopo il calcolo?`, why: 'Il risultato di un calcolo esce dalla CPU e viene scritto nella memoria centrale.' },
	{ move: 2, text: (s) => `La CPU ha eseguito un'istruzione che cambia ${s.dato}. Da dove a dove viaggia il valore nuovo subito dopo?`, why: 'Il risultato di un calcolo esce dalla CPU e viene scritto nella memoria centrale.' },
	{ move: 3, text: (s) => `Ora ${s.out} deve uscire dal computer. Qual è il suo ultimo viaggio sul bus?`, why: "Per uscire, un risultato passa dalla memoria centrale a una periferica di uscita, che lo porta all'esterno." },
	{ move: 3, text: (s) => `Tra un istante ${s.outDev} porterà all'esterno ${s.out}. Qual è l'ultimo viaggio sul bus prima che succeda?`, why: "Per uscire, un risultato passa dalla memoria centrale a una periferica di uscita, che lo porta all'esterno." },
];

function level3(rng: Rng): Built {
	const s = rng.int(0, SCENARIOS.length - 1);
	const k = rng.int(0, TRIPS.length - 1);
	const trip = TRIPS[k];
	const right = MOVES[trip.move];
	return {
		prompt: 'Scegli da dove a dove viaggia il dato.',
		problem: textBlock(`${SCENARIOS[s].use}. ${trip.text(SCENARIOS[s])}`),
		solution: opt(right).latex,
		steps: [textBlock(trip.why), textBlock('Ogni viaggio da un blocco a un altro passa dal bus.')],
		answer: choose(
			rng,
			opt(right),
			MOVES.filter((m) => m !== right).map((m) => opt(m)),
		),
		params: { case: `viaggio-${trip.move + 1}`, scenario: s, trip: k },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the stored program, true or false

export const TRUE_STATEMENTS = [
	'Programmi e dati stanno nella stessa memoria',
	'Le istruzioni sono scritte in memoria come sequenze di bit',
	'Per cambiare lavoro si carica in memoria un altro programma',
	'La CPU prende le istruzioni dalla memoria centrale',
	'Lo stesso computer può eseguire programmi diversi',
	'Un programma si può copiare come qualsiasi altro dato',
	'Un programma va in memoria centrale prima di essere eseguito',
	"I bit di una cella possono essere un dato o un'istruzione",
];

export const FALSE_STATEMENTS: { text: string; why: string }[] = [
	{ text: 'Per cambiare programma si spostano i cavi dei circuiti', why: 'Con il programma memorizzato i circuiti non si toccano: si carica in memoria un altro programma.' },
	{ text: 'Le istruzioni stanno nella CPU, i dati nella memoria', why: 'Istruzioni e dati stanno tutti e due nella memoria centrale: la CPU va a prendere le istruzioni lì.' },
	{ text: 'Programmi e dati stanno in due memorie separate', why: 'Nella macchina di von Neumann programmi e dati stanno nella stessa memoria.' },
	{ text: 'Un computer esegue solo il programma con cui è costruito', why: 'Lo stesso computer esegue programmi diversi: si carica in memoria quello che serve.' },
	{ text: 'Le istruzioni sono scritte con lettere, i dati con bit', why: 'Anche le istruzioni sono scritte in memoria come sequenze di bit.' },
	{ text: 'Il bus conserva il programma mentre la CPU lo esegue', why: 'Il bus trasporta i bit e non conserva niente: il programma in esecuzione sta nella memoria centrale.' },
	{ text: 'Le periferiche eseguono le istruzioni del programma', why: "Le istruzioni le esegue la CPU: le periferiche scambiano dati con l'esterno." },
	{ text: 'La CPU esegue un programma anche se non è in memoria', why: 'La CPU prende le istruzioni dalla memoria centrale: un programma va caricato lì prima di essere eseguito.' },
	{ text: 'La memoria centrale contiene solo dati, mai istruzioni', why: 'La memoria centrale contiene sia le istruzioni del programma sia i dati.' },
	{ text: 'Un programma non si può copiare, perché non è un dato', why: 'Un programma memorizzato è una sequenza di bit come gli altri dati: si può copiare.' },
];

function level4(rng: Rng): Built {
	const wantTrue = rng.next() < 0.5;
	if (wantTrue) {
		const right = rng.pick(TRUE_STATEMENTS);
		const wrong = pickDistinct(rng, FALSE_STATEMENTS, 3);
		return {
			prompt: "Scegli l'affermazione vera.",
			problem: textBlock('Quale di queste affermazioni sulla macchina di von Neumann è vera?'),
			solution: opt(right).latex,
			steps: [textBlock(`Vera: ${right.charAt(0).toLowerCase()}${right.slice(1)}. È l'idea del programma memorizzato.`), ...wrong.map((w) => textBlock(w.why))],
			answer: choose(
				rng,
				opt(right),
				wrong.map((w) => opt(w.text)),
			),
			params: { case: 'vera' },
		};
	}
	const right = rng.pick(FALSE_STATEMENTS);
	const others = pickDistinct(rng, TRUE_STATEMENTS, 3);
	return {
		prompt: "Scegli l'affermazione falsa.",
		problem: textBlock('Quale di queste affermazioni sulla macchina di von Neumann è falsa?'),
		solution: opt(right.text).latex,
		steps: [textBlock(right.why), textBlock('Le altre tre affermazioni sono vere.')],
		answer: choose(
			rng,
			opt(right.text),
			others.map((o) => opt(o)),
		),
		params: { case: 'falsa' },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the step right after, or right before

export const STEP_OPTIONS = [
	'Una periferica di ingresso riceve il dato',
	'Il dato viene scritto nella memoria centrale',
	'La CPU preleva istruzione e dati dalla memoria',
	"La CPU esegue l'istruzione",
	'Il risultato viene scritto nella memoria centrale',
	'Una periferica di uscita porta fuori il risultato',
] as const;

export const STEP_TEXTS: ((s: Scenario) => string)[] = [
	(s) => `${s.inDev} riceve ${s.in}`,
	(s) => `il bus porta ${s.in} nella memoria centrale`,
	() => "la CPU preleva dalla memoria centrale l'istruzione da eseguire e i dati che le servono",
	(s) => `la CPU ${s.calc}`,
	() => 'il bus porta il risultato del calcolo nella memoria centrale',
	(s) => `${s.outDev} porta all'esterno ${s.out}`,
];

function level5(rng: Rng): Built {
	const s = rng.int(0, SCENARIOS.length - 1);
	const after = rng.next() < 0.5;
	const k = after ? rng.int(0, 4) : rng.int(1, 5);
	const target = after ? k + 1 : k - 1;
	// After step 5 the CPU may also fetch the next instruction, and before step 3 it may have stored a result: those two are not offered as wrong answers.
	// "The datum is written in memory" and "the result is written in memory" are too close to be offered against each other.
	const banned = [after && k === 4 ? 2 : !after && k === 2 ? 4 : -1, target === 4 ? 1 : target === 1 ? 4 : -1];
	const others = pickDistinct(
		rng,
		[0, 1, 2, 3, 4, 5].filter((i) => i !== k && i !== target && !banned.includes(i)),
		3,
	);
	const question = after ? 'Che cosa succede subito dopo?' : 'Che cosa è successo subito prima?';
	return {
		prompt: 'Scegli il passo giusto nel viaggio del dato.',
		problem: textBlock(`${SCENARIOS[s].use}. A un certo punto ${STEP_TEXTS[k](SCENARIOS[s])}. ${question}`),
		solution: opt(STEP_OPTIONS[target]).latex,
		steps: [
			textBlock('I passi sono sei: ingresso, scrittura del dato in memoria, prelievo di istruzione e dati, esecuzione, scrittura del risultato in memoria, uscita.'),
			textBlock(`Quello descritto è il passo ${k + 1}: ${after ? 'subito dopo viene' : 'subito prima viene'} il passo ${target + 1}.`),
		],
		answer: choose(
			rng,
			opt(STEP_OPTIONS[target]),
			others.map((i) => opt(STEP_OPTIONS[i])),
		),
		params: { case: after ? 'dopo' : 'prima', scenario: s, step: k + 1 },
	};
}

const LEVELS: Record<number, Level> = {
	1: { label: 'A quale blocco appartiene', constraints: ['un componente di un dispositivo, il suo blocco tra CPU, memoria centrale, periferiche e bus; le memorie di massa tra le periferiche'], make: level1 },
	2: { label: 'Il compito di ogni blocco', constraints: ['tredici situazioni, undici compiti: il blocco che li svolge, un quarto dei casi per blocco'], make: level2 },
	3: { label: 'Il viaggio di un dato', constraints: ['da quale blocco a quale blocco viaggia un dato: ingresso, prelievo, risultato, uscita'], make: level3 },
	4: { label: 'Il programma memorizzato', constraints: ["l'affermazione vera tra tre false, o la falsa tra tre vere, metà ciascuna"], make: level4 },
	5: { label: "L'ordine dei passi", constraints: ['il passo subito dopo o subito prima di un passo descritto, tra i sei del viaggio di un dato'], make: level5 },
};

export const infVonNeumann = makeGenerator(ID, 'La macchina di von Neumann', LEVELS);

export default infVonNeumann;
