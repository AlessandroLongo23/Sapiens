/**
 * Avvio del computer e interfacce utente. Spec: specs/exercises/inf-avvio-interfacce.md
 *
 * Five levels from the lesson (docs/lezioni/informatica/riscritte/19-inf-avvio-interfacce.md), all multiple choice,
 * made of interchangeable pieces: the phase of the boot a sentence describes; the order of the phases; true and
 * false statements about the boot; the elements of the two interfaces; the features of the command line and of the
 * graphical interface.
 */
import type { Rng } from '../types';
import { NAMES, cap, choose, makeGenerator, opt, shuffle, statementLevel, textBlock, wrapText, type Built, type Statement } from '../inf-so';

export const ID = 'inf-avvio-interfacce';

// ---------------------------------------------------------------------------
// Level 1: the phase a sentence describes

export const PHASES = ["L'avvio del firmware", "L'autodiagnosi (POST)", 'La ricerca del disco di avvio', 'Il caricamento del nucleo', "L'avvio di servizi e interfaccia"] as const;
const phaseOpt = (i: number) => opt(PHASES[i], String(i));
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

interface Device {
	il: string;
	del: string;
	sul: string;
}
const DEVICES: Device[] = [
	{ il: 'il portatile', del: 'del portatile', sul: 'sul portatile' },
	{ il: 'il computer fisso', del: 'del computer fisso', sul: 'sul computer fisso' },
	{ il: 'il telefono', del: 'del telefono', sul: 'sul telefono' },
	{ il: 'il tablet', del: 'del tablet', sul: 'sul tablet' },
	{ il: 'la console', del: 'della console', sul: 'sulla console' },
];

/** Two sentences per phase, in the order of PHASES. */
const SENTENCES: ((N: string, D: Device) => string)[][] = [
	[
		(N, D) => `${cap(D.sul)} di ${N} arriva la corrente, e la CPU comincia a eseguire il programma registrato in un chip della scheda madre.`,
		(N, D) => `Appena ${N} accende ${D.il}, parte un programma che non sta sul disco, ma in una memoria non volatile della scheda madre.`,
	],
	[
		(N, D) => `Un programma controlla che la RAM e gli altri componenti ${D.del} di ${N} rispondano, prima di proseguire.`,
		(N, D) => `${cap(D.il)} di ${N} si ferma subito dopo l'accensione: il controllo dei componenti ha trovato un guasto nella RAM.`,
	],
	[
		(N, D) => `Il firmware ${D.del} di ${N} esamina le memorie di massa, in un ordine fissato, finché ne trova una con un sistema operativo.`,
		(N, D) => `${cap(D.il)} di ${N} si ferma con un messaggio: nessuna memoria di massa contiene un sistema operativo.`,
	],
	[
		(N, D) => `Un piccolo programma, che sta all'inizio della memoria di massa ${D.del} di ${N}, copia il nucleo nella RAM.`,
		(N, D) => `Il bootloader ${D.del} di ${N} passa il controllo al nucleo, che ha appena copiato nella RAM.`,
	],
	[
		(N, D) => `Il nucleo ${D.del} di ${N} carica i driver e fa partire i programmi di servizio.`,
		(N, D) => `${cap(D.sul)} di ${N} compare la schermata in cui scrivere la password: il sistema è pronto.`,
	],
];
const WHY_PHASE = [
	"All'accensione la CPU esegue il firmware, il programma che sta in una memoria non volatile della scheda madre: è la prima fase.",
	"Il controllo dei componenti all'accensione è l'autodiagnosi, o POST: è la seconda fase.",
	'Il firmware cerca una memoria di massa che contenga un sistema operativo: è la ricerca del dispositivo di avvio, la terza fase.',
	'Il bootloader copia il nucleo nella RAM e gli passa il controllo: è il caricamento del nucleo, la quarta fase.',
	"Con il nucleo in memoria partono driver e servizi e compare l'interfaccia: è l'ultima fase.",
];

function level1(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const d = rng.int(0, DEVICES.length - 1);
	const p = rng.int(0, PHASES.length - 1);
	const k = rng.int(0, 1);
	const others = shuffle(
		rng,
		[0, 1, 2, 3, 4].filter((x) => x !== p),
	);
	return {
		prompt: "Riconosci la fase dell'avvio.",
		problem: textBlock(`${SENTENCES[p][k](N, DEVICES[d])} Quale fase dell'avvio descrive la frase?`),
		solution: wrapText(PHASES[p]),
		steps: [textBlock(WHY_PHASE[p])],
		answer: choose(rng, phaseOpt(p), others.map(phaseOpt)),
		params: { case: String(p), sentence: k, device: d, name: N },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the order of the phases

export const SHORT = ['firmware', 'autodiagnosi', 'ricerca del disco', 'nucleo', 'interfaccia'] as const;
const OF_PHASE = ["dell'avvio del firmware", "dell'autodiagnosi (POST)", 'della ricerca del disco di avvio', 'del caricamento del nucleo', "dell'avvio di servizi e interfaccia"];
const ORDER_STEP = "Le fasi dell'avvio, nell'ordine: avvio del firmware, autodiagnosi, ricerca del disco di avvio, caricamento del nucleo, avvio di servizi e interfaccia.";

function level2(rng: Rng): Built {
	const D = rng.pick(DEVICES);
	const r = rng.next();
	const prompt = "Metti in ordine le fasi dell'avvio.";
	if (r < 0.5) {
		const after = r < 0.25;
		const p = after ? rng.int(0, 3) : rng.int(1, 4);
		const right = after ? p + 1 : p - 1;
		const others = shuffle(
			rng,
			[0, 1, 2, 3, 4].filter((x) => x !== p && x !== right),
		);
		return {
			prompt,
			problem: textBlock(`Durante l'avvio ${D.del}, quale fase viene subito ${after ? `dopo ${lower(PHASES[p])}` : `prima ${OF_PHASE[p]}`}?`),
			solution: wrapText(PHASES[right]),
			steps: [textBlock(ORDER_STEP), textBlock(`Subito ${after ? `dopo ${lower(PHASES[p])}` : `prima ${OF_PHASE[p]}`} c'è ${lower(PHASES[right])}.`)],
			answer: choose(rng, phaseOpt(right), others.map(phaseOpt)),
			params: { case: after ? 'dopo' : 'prima', phase: p },
		};
	}
	const size = rng.int(3, 4);
	const subset = shuffle(rng, [0, 1, 2, 3, 4])
		.slice(0, size)
		.sort((a, b) => a - b);
	const seq = (xs: number[]) => opt(cap(xs.map((i) => SHORT[i]).join(', ')), xs.join('-'));
	const swapped = [...subset];
	const at = rng.int(0, size - 2);
	[swapped[at], swapped[at + 1]] = [swapped[at + 1], swapped[at]];
	const wrong = [swapped, [...subset].reverse()];
	for (let i = 0; i < 12; i++) wrong.push(shuffle(rng, subset));
	return {
		prompt,
		problem: textBlock(`Quale elenco mette queste fasi dell'avvio ${D.del} nell'ordine in cui avvengono?`),
		solution: seq(subset).latex,
		steps: [textBlock(ORDER_STEP)],
		answer: choose(rng, seq(subset), wrong.map(seq)),
		params: { case: 'sequenza', subset },
	};
}

// ---------------------------------------------------------------------------
// Level 3: true and false statements about the boot

const TRUE: Statement[] = [
	{ id: 't1', text: 'Il firmware sta in una memoria non volatile della scheda madre', why: 'Il firmware sta in un chip di memoria non volatile della scheda madre: così è disponibile appena arriva la corrente.' },
	{ id: 't2', text: 'A ogni accensione il nucleo viene copiato di nuovo nella RAM', why: 'La RAM è volatile: a ogni accensione il nucleo va copiato di nuovo dalla memoria di massa.' },
	{ id: 't3', text: 'Il bootloader copia il nucleo nella RAM', why: 'Copiare il nucleo nella RAM e passargli il controllo è il compito del bootloader.' },
	{ id: 't4', text: "L'autodiagnosi viene prima del caricamento del nucleo", why: "L'autodiagnosi è la seconda fase, il caricamento del nucleo la quarta." },
	{ id: 't5', text: 'Installando un altro sistema operativo il firmware resta lo stesso', why: 'Il firmware sta sulla scheda madre e non cambia quando si installa un altro sistema operativo.' },
	{ id: 't6', text: 'Durante la sospensione la RAM resta alimentata', why: 'Nella sospensione la RAM resta alimentata e conserva i programmi aperti: per questo il risveglio è rapido.' },
	{ id: 't7', text: 'Anche un telefono ha un firmware e un bootloader', why: 'Un telefono si avvia come un computer: firmware, bootloader, nucleo.' },
	{ id: 't8', text: 'A computer spento il sistema operativo sta nella memoria di massa', why: 'La memoria di massa conserva i dati senza corrente: il sistema operativo sta lì.' },
	{ id: 't9', text: 'Con il riavvio la procedura riparte dal firmware', why: 'Il riavvio chiude il sistema e ripete tutto, a partire dal firmware.' },
	{ id: 't10', text: 'Il firmware cerca il sistema operativo nelle memorie di massa', why: 'Nella terza fase il firmware esamina le memorie di massa per trovare un sistema operativo.' },
];
const FALSE: Statement[] = [
	{ id: 'f1', text: 'Il firmware sta nella memoria di massa, insieme al sistema operativo', why: 'Il firmware non sta nella memoria di massa, ma in un chip della scheda madre.' },
	{ id: 'f2', text: 'A computer spento il sistema operativo resta nella RAM', why: 'La RAM è volatile: a computer spento è vuota, e il sistema operativo sta nella memoria di massa.' },
	{ id: 'f3', text: 'Il bootloader controlla che la RAM funzioni', why: "Il controllo dei componenti è l'autodiagnosi, che fa il firmware; il bootloader carica il nucleo." },
	{ id: 'f4', text: "L'autodiagnosi viene dopo la schermata di accesso", why: "L'autodiagnosi è la seconda fase, la schermata di accesso arriva alla fine." },
	{ id: 'f5', text: 'Il firmware e il sistema operativo sono lo stesso programma', why: 'Firmware e sistema operativo sono programmi diversi, in memorie diverse.' },
	{ id: 'f6', text: "Il risveglio dalla sospensione ripete tutte le fasi dell'avvio", why: 'Dopo la sospensione il sistema è ancora nella RAM: non serve un nuovo avvio.' },
	{ id: 'f7', text: 'Il nucleo viene caricato prima che parta il firmware', why: 'Il firmware parte per primo; il nucleo viene caricato dopo, dal bootloader.' },
	{ id: 'f8', text: 'Togliendo il disco, il firmware non parte più', why: 'Il firmware parte anche senza disco: si ferma quando non trova un sistema operativo da caricare.' },
	{ id: 'f9', text: 'I telefoni si accendono senza una procedura di avvio', why: 'Anche i telefoni hanno una procedura di avvio.' },
	{ id: 'f10', text: 'La schermata di accesso compare prima che il nucleo sia nella RAM', why: "La schermata di accesso la mostra il sistema operativo, quando il nucleo è già nella RAM." },
];

// ---------------------------------------------------------------------------
// Level 4: the elements of the two interfaces

/** Two fixed descriptions per element, and one that names a person. */
export const ELEMENTS: Record<string, { label: string; cli: boolean; descriptions: string[]; named: (N: string) => string }> = {
	prompt: { label: 'Il prompt', cli: true, descriptions: ['la scritta con cui il sistema segnala che è pronto a ricevere un comando', "quello che il sistema mostra all'inizio della riga, prima che tu scriva"], named: (N) => `la scritta che dice a ${N} che il sistema è pronto a ricevere un comando` },
	nome: { label: 'Il nome del comando', cli: true, descriptions: ['la parte della riga che dice quale operazione eseguire', 'nella riga mkdir Storia, la parola mkdir'], named: (N) => `la parola mkdir nella riga mkdir Storia scritta da ${N}` },
	argomento: { label: "L'argomento", cli: true, descriptions: ['la parte della riga che dice su che cosa deve agire il comando', 'nella riga cd Documenti, la parola Documenti'], named: (N) => `la parola Documenti nella riga cd Documenti scritta da ${N}` },
	interprete: { label: "L'interprete dei comandi", cli: true, descriptions: ['il programma che legge la riga scritta e la esegue', 'il programma che in inglese si chiama shell'], named: (N) => `il programma che legge la riga scritta da ${N} e la esegue` },
	finestra: { label: 'La finestra', cli: false, descriptions: ['il riquadro dello schermo in cui lavora un programma', 'il riquadro che puoi spostare, allargare o chiudere'], named: (N) => `il riquadro in cui ${N} vede lavorare il programma di disegno` },
	icona: { label: "L'icona", cli: false, descriptions: ['il piccolo disegno che rappresenta un file, una cartella o un programma', 'il piccolo disegno su cui fai doppio clic per aprire un programma'], named: (N) => `il piccolo disegno che ${N} tocca per avviare un gioco` },
	menu: { label: 'Il menu', cli: false, descriptions: ["l'elenco di comandi tra cui scegliere", "l'elenco che si apre e mostra le operazioni disponibili"], named: (N) => `l'elenco da cui ${N} sceglie il comando per salvare` },
	puntatore: { label: 'Il puntatore', cli: false, descriptions: ['la freccia che si sposta sullo schermo quando muovi il mouse', 'la freccia che indica il punto in cui agirà il clic'], named: (N) => `la freccia che ${N} sposta sullo schermo con il mouse` },
};

function level4(rng: Rng): Built {
	const keys = Object.keys(ELEMENTS);
	const key = rng.pick(keys);
	const E = ELEMENTS[key];
	const d = rng.int(0, E.descriptions.length);
	const description = d < E.descriptions.length ? E.descriptions[d] : E.named(rng.pick(NAMES));
	const others = shuffle(
		rng,
		keys.filter((k) => k !== key),
	);
	const o = (k: string) => opt(ELEMENTS[k].label, k);
	return {
		prompt: "Riconosci l'elemento dell'interfaccia.",
		problem: textBlock(`Nell'interfaccia ${E.cli ? 'a riga di comando' : 'grafica'}, come si chiama ${description}?`),
		solution: wrapText(E.label),
		steps: [textBlock(`${E.label} è ${E.descriptions[0]}.`)],
		answer: choose(rng, o(key), others.map(o)),
		params: { case: key, description: d },
	};
}

// ---------------------------------------------------------------------------
// Level 5: features of the command line and of the graphical interface

const CLI: [string, string][] = [
	['c1', 'I comandi si scrivono con la tastiera'],
	['c2', 'Bisogna ricordare i nomi dei comandi'],
	['c3', 'Una sola riga può agire su centinaia di file'],
	['c4', 'Usa poche risorse del computer'],
	['c5', 'Con un carattere sbagliato il comando non parte'],
	['c6', 'Il sistema risponde con righe di testo'],
	['c7', 'Chi amministra i server la usa ogni giorno'],
	['c8', 'Il sistema mostra un prompt quando è pronto'],
];
const GUI: [string, string][] = [
	['g1', 'I comandi si danno su oggetti disegnati sullo schermo'],
	['g2', 'I comandi disponibili sono in vista nei menu'],
	['g3', 'Si impara a usarla senza studiare i comandi'],
	['g4', 'Usa più risorse, per disegnare finestre e icone'],
	['g5', 'Ripetere una operazione su molti file è lento'],
	['g6', 'Ogni programma lavora dentro una finestra'],
	['g7', 'File e cartelle sono rappresentati da icone'],
	['g8', 'Sui telefoni si usa con le dita'],
];

function level5(rng: Rng): Built {
	const cli = rng.next() < 0.5;
	const [rights, wrongs] = cli ? [CLI, GUI] : [GUI, CLI];
	const right = rng.pick(rights);
	const others = shuffle(rng, wrongs).slice(0, 3);
	const o = ([id, text]: [string, string]) => opt(text, id);
	const [mine, other] = cli ? ['a riga di comando', 'grafica'] : ['grafica', 'a riga di comando'];
	return {
		prompt: 'Distingui le due interfacce.',
		problem: textBlock(`Quale di queste è una caratteristica dell'interfaccia ${mine}?`),
		solution: wrapText(right[1]),
		steps: [
			textBlock(cli ? "Nell'interfaccia a riga di comando si scrivono i comandi, uno per riga, e il sistema risponde con del testo." : "Nell'interfaccia grafica si agisce su finestre, icone e menu disegnati sullo schermo."),
			textBlock(`Le altre tre sono caratteristiche dell'interfaccia ${other}.`),
		],
		answer: choose(rng, o(right), others.map(o)),
		params: { case: cli ? 'riga di comando' : 'grafica', ids: [right[0], ...others.map((x) => x[0])] },
	};
}

export default makeGenerator(ID, 'Avvio del computer e interfacce utente', {
	1: { label: "Le fasi dell'avvio", constraints: ['una frase su un dispositivo, con un nome di persona: la fase tra le cinque della lezione'], make: level1 },
	2: { label: "L'ordine delle fasi", constraints: ['la fase subito dopo o subito prima (circa 1 su 4 ciascuna), oppure tre o quattro fasi da mettere in ordine'], make: level2 },
	3: { label: "Vero o falso sull'avvio", constraints: ["l'affermazione vera tra tre false, o la falsa tra tre vere, circa metà ciascuno"], make: (rng) => statementLevel(rng, TRUE, FALSE, "sull'avvio") },
	4: { label: "Gli elementi dell'interfaccia", constraints: ['una descrizione, in un caso su tre con un nome di persona: prompt, nome del comando, argomento, interprete, finestra, icona, menu, puntatore'], make: level4 },
	5: { label: 'Riga di comando o grafica', constraints: ["una caratteristica di un'interfaccia tra tre dell'altra, circa metà ciascuna"], make: level5 },
});
