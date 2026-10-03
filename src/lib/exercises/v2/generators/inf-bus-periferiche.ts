/**
 * Bus e periferiche. Spec: specs/exercises/inf-bus-periferiche.md
 *
 * Five levels from the lesson (docs/lezioni/informatica/riscritte/16-inf-bus-periferiche.md): input, output or
 * both (or not a peripheral at all); which bus carries what, and in which direction; the cells an address bus of
 * n lines reaches (2^n) and the largest address; the lines needed for N cells; the memory an address bus reaches,
 * in KiB, MiB or GiB, and back.
 */
import type { Rng } from '../types';
import { type Built, type Level, choose, makeGenerator, mathOpt, nm, num, numberAnswer, opt, pow2, textBlock } from '../inf-architettura';

export const ID = 'inf-bus-periferiche';

// ---------------------------------------------------------------------------
// Level 1: input or output

export const KINDS = ['Di ingresso', 'Di uscita', 'Di ingresso e di uscita', 'Non è una periferica'] as const;
type Kind = (typeof KINDS)[number];

/** `uses` complete "Usi {name} per …"; for what is not a peripheral they complete "Mentre lavori, {name} …". */
export const DEVICES: { name: string; kind: Kind; uses: string[]; why: string }[] = [
	{ name: 'la tastiera', kind: 'Di ingresso', uses: ['scrivere un tema', 'digitare una password', 'cercare un file per nome', 'rispondere a un messaggio'], why: 'I caratteri digitati entrano nel computer.' },
	{ name: 'il mouse', kind: 'Di ingresso', uses: ['spostare il puntatore', 'selezionare un file', 'disegnare una linea', 'trascinare una foto in una cartella'], why: 'I movimenti della mano entrano nel computer.' },
	{ name: 'il microfono', kind: 'Di ingresso', uses: ['registrare un messaggio vocale', 'dettare una frase', 'parlare in una videochiamata'], why: 'Il suono entra nel computer, anche se per te la voce esce.' },
	{ name: 'la webcam', kind: 'Di ingresso', uses: ['farti vedere in una videochiamata', 'registrare un video', 'scattare una foto per il profilo'], why: "L'immagine ripresa entra nel computer." },
	{ name: 'lo scanner', kind: 'Di ingresso', uses: ['acquisire la pagina di un libro', 'copiare un disegno fatto a mano', 'acquisire una vecchia foto di carta'], why: "L'immagine del foglio entra nel computer." },
	{ name: 'il lettore di codici a barre', kind: 'Di ingresso', uses: ['leggere il prezzo di un prodotto', 'registrare un libro della biblioteca', 'controllare un biglietto'], why: 'Il codice letto entra nel computer.' },
	{ name: 'il sensore di impronte', kind: 'Di ingresso', uses: ['sbloccare il telefono', 'confermare un pagamento', 'accedere al portatile'], why: "L'immagine dell'impronta entra nel computer." },
	{ name: 'la tavoletta grafica', kind: 'Di ingresso', uses: ['disegnare a mano libera', 'ritoccare una foto con la penna', 'firmare un documento'], why: 'I movimenti della penna entrano nel computer.' },
	{ name: 'il touchpad', kind: 'Di ingresso', uses: ['spostare il puntatore', 'scorrere una pagina', 'ingrandire una foto con due dita'], why: 'I movimenti delle dita entrano nel computer.' },
	{ name: 'il ricevitore GPS', kind: 'Di ingresso', uses: ['conoscere la tua posizione', 'registrare il percorso di una corsa', 'trovare la strada con il navigatore'], why: 'Il segnale dei satelliti entra nel computer.' },
	{ name: 'la fotocamera del telefono', kind: 'Di ingresso', uses: ['scattare una foto', 'inquadrare un codice QR', 'riprendere un video'], why: "L'immagine inquadrata entra nel computer." },
	{ name: 'il sensore di temperatura', kind: 'Di ingresso', uses: ['misurare la temperatura di una stanza', "controllare l'acqua della lavatrice", 'raccogliere i dati di una stazione meteo'], why: 'La misura entra nel computer.' },
	{ name: 'il monitor', kind: 'Di uscita', uses: ['guardare un video', 'leggere una pagina web', 'vedere il grafico di un foglio di calcolo', 'rileggere il tema che hai scritto'], why: 'Le immagini escono dal computer.' },
	{ name: 'la stampante', kind: 'Di uscita', uses: ['stampare un tema', 'stampare una foto', 'stampare il biglietto del treno'], why: 'Il documento esce dal computer.' },
	{ name: 'gli altoparlanti', kind: 'Di uscita', uses: ['ascoltare una canzone', "sentire l'audio di un film", 'sentire la suoneria'], why: 'Il suono esce dal computer.' },
	{ name: 'le cuffie', kind: 'Di uscita', uses: ['ascoltare una canzone', "sentire l'audio di un videogioco", 'seguire una lezione registrata'], why: 'Il suono esce dal computer, anche se per te entra nelle orecchie.' },
	{ name: 'il proiettore', kind: 'Di uscita', uses: ['mostrare una presentazione alla classe', 'guardare un film sul muro', 'far vedere una pagina web a tutti'], why: 'Le immagini escono dal computer.' },
	{ name: 'il motorino della vibrazione', kind: 'Di uscita', uses: ['accorgerti di una notifica', 'sentire la sveglia senza suono', 'accorgerti di una chiamata in silenzioso'], why: 'Il segnale esce dal computer verso di te.' },
	{ name: 'la stampante 3D', kind: 'Di uscita', uses: ['costruire un portachiavi', 'realizzare il modello di un ponte', 'produrre un pezzo di ricambio'], why: "Il modello esce dal computer e diventa un oggetto." },
	{ name: 'le spie luminose', kind: 'Di uscita', uses: ['sapere se la batteria è carica', 'vedere che il disco sta lavorando', 'capire che il dispositivo è acceso'], why: 'Il segnale esce dal computer verso di te.' },
	{ name: 'lo schermo tattile', kind: 'Di ingresso e di uscita', uses: ['scrivere un messaggio e rileggerlo', 'scegliere una foto e guardarla', 'giocare toccando le figure che compaiono'], why: 'I tocchi entrano e le immagini escono.' },
	{ name: 'la chiavetta USB', kind: 'Di ingresso e di uscita', uses: ['salvare un file e poi riaprirlo', 'portare a scuola una presentazione e copiarne una nuova', 'copiare le foto e riguardarle su un altro computer'], why: 'Il computer vi scrive i file e poi li rilegge.' },
	{ name: 'il disco esterno', kind: 'Di ingresso e di uscita', uses: ['fare una copia dei tuoi file e recuperarla', 'salvare i video e riguardarli', 'archiviare i documenti e riaprirli'], why: 'Il computer vi scrive i file e poi li rilegge.' },
	{ name: 'la scheda di rete', kind: 'Di ingresso e di uscita', uses: ['mandare e ricevere messaggi', 'caricare e scaricare file', 'giocare in rete con altri'], why: 'I dati partono verso gli altri computer e arrivano da loro.' },
	{ name: 'le cuffie con microfono', kind: 'Di ingresso e di uscita', uses: ['parlare e ascoltare in una videochiamata', 'parlare con i compagni di squadra e sentirli', 'registrare la tua voce e riascoltarla'], why: 'La voce entra dal microfono e il suono esce dalle cuffie.' },
	{ name: 'la stampante multifunzione', kind: 'Di ingresso e di uscita', uses: ['acquisire un foglio e stamparne una copia', 'stampare un modulo e acquisirlo firmato', 'fare la scansione di un disegno e stamparlo'], why: 'Le scansioni entrano e le stampe escono.' },
	{ name: 'la scheda di memoria', kind: 'Di ingresso e di uscita', uses: ['salvare le foto e riguardarle', 'registrare un video e rivederlo', 'conservare la musica e riascoltarla'], why: 'Il computer vi scrive i file e poi li rilegge.' },
	{ name: 'il visore per la realtà virtuale', kind: 'Di ingresso e di uscita', uses: ['guardarti intorno in un mondo virtuale', 'giocare muovendo la testa', 'visitare un museo virtuale girando lo sguardo'], why: 'I movimenti della testa entrano e le immagini escono.' },
	{ name: 'il processore', kind: 'Non è una periferica', uses: ['esegue le istruzioni del programma', 'calcola la media dei voti', 'confronta due numeri', 'decide quale istruzione eseguire dopo'], why: 'Il processore è la CPU: sta al centro dello schema, non scambia dati con l\'esterno.' },
	{ name: 'la RAM', kind: 'Non è una periferica', uses: ['contiene il programma aperto', 'contiene il testo che stai scrivendo', 'contiene i dati della partita in corso', 'tiene i dati a disposizione della CPU'], why: 'La RAM è la memoria centrale: sta al centro dello schema, non scambia dati con l\'esterno.' },
	{ name: 'la cache', kind: 'Non è una periferica', uses: ['tiene una copia dei dati usati più di recente', 'evita alla CPU di aspettare la RAM', 'conserva le istruzioni che si ripetono', 'lavora accanto alla CPU'], why: 'La cache è una memoria accanto alla CPU, non una periferica.' },
	{ name: 'il bus dati', kind: 'Non è una periferica', uses: ['trasporta i valori da leggere e da scrivere', 'porta un byte dalla memoria alla CPU', 'porta un risultato dalla CPU alla memoria', 'collega la CPU alla memoria centrale'], why: 'Il bus collega i blocchi tra loro: non è una periferica.' },
];

function level1(rng: Rng): Built {
	const kind = rng.pick(KINDS);
	const d = rng.pick(DEVICES.filter((x) => x.kind === kind));
	const use = rng.pick(d.uses);
	const plural = /^(le|gli|i) /.test(d.name);
	const text = kind === 'Non è una periferica' ? `Mentre lavori al computer, ${d.name} ${use}. Che tipo di periferica è ${d.name}?` : `Usi ${d.name} per ${use}. Che tipo di periferica ${plural ? 'sono' : 'è'} ${d.name}?`;
	return {
		prompt: 'Scegli il tipo di periferica.',
		problem: textBlock(text),
		solution: opt(kind).latex,
		steps: [textBlock(d.why), textBlock('Il verso si guarda dal computer: di ingresso se i dati entrano, di uscita se escono.')],
		answer: choose(
			rng,
			opt(kind),
			KINDS.filter((k) => k !== kind).map((k) => opt(k)),
		),
		params: { case: kind, device: d.name },
	};
}

// ---------------------------------------------------------------------------
// Level 2: which bus, which direction

export const ROUTES = ['Bus dati, verso la CPU', 'Bus dati, dalla CPU', 'Bus indirizzi, dalla CPU', 'Bus di controllo, dalla CPU'] as const;

export const INPUTS = [
	{ from: 'dalla tastiera', what: 'il codice del tasto premuto' },
	{ from: 'dal mouse', what: 'il numero che misura lo spostamento' },
	{ from: 'dal microfono', what: 'il valore di un campione del suono' },
	{ from: 'dal sensore di temperatura', what: 'il valore della temperatura' },
];
export const OUTPUTS = [
	{ to: 'alla stampante', what: 'il codice di un carattere da stampare' },
	{ to: 'allo schermo', what: 'il valore del colore di un pixel' },
	{ to: "all'altoparlante", what: 'il valore di un campione del suono' },
];

function level2(rng: Rng): Built {
	const route = rng.int(0, 3);
	const a = rng.int(100, 4000);
	let v = rng.int(0, 255);
	if (v === a) v = 7;
	const read = route === 0 ? true : route === 1 ? false : rng.next() < 0.5;
	const memory = `La CPU ${read ? `legge la cella di indirizzo $${a}$, che contiene il numero $${v}$` : `scrive il numero $${v}$ nella cella di indirizzo $${a}$`}.`;
	let text: string;
	let why: string;
	if (route === 2) {
		text = `${memory} Su quale bus viaggia il numero $${a}$, e in quale verso?`;
		why = `$${a}$ è l'indirizzo della cella: viaggia sul bus indirizzi, e gli indirizzi partono sempre dalla CPU.`;
	} else if (route === 3) {
		text = `${memory} Su quale bus viaggia il segnale che dice che è una ${read ? 'lettura' : 'scrittura'}, e in quale verso?`;
		why = 'I comandi che coordinano lo scambio viaggiano sul bus di controllo, e questo comando parte dalla CPU.';
	} else if (rng.next() < 0.6) {
		text = `${memory} Su quale bus viaggia il numero $${v}$, e in quale verso?`;
		why = `$${v}$ è il contenuto, cioè il dato: viaggia sul bus dati, ${read ? 'verso la CPU perché è una lettura' : 'dalla CPU perché è una scrittura'}.`;
	} else if (read) {
		const p = rng.pick(INPUTS);
		text = `La CPU legge ${p.from} ${p.what}, che è $${v}$. Su quale bus viaggia il numero $${v}$, e in quale verso?`;
		why = `$${v}$ è un dato che arriva da una periferica di ingresso: viaggia sul bus dati, verso la CPU.`;
	} else {
		const p = rng.pick(OUTPUTS);
		text = `La CPU manda ${p.to} ${p.what}, che è $${v}$. Su quale bus viaggia il numero $${v}$, e in quale verso?`;
		why = `$${v}$ è un dato che va a una periferica di uscita: viaggia sul bus dati, dalla CPU.`;
	}
	return {
		prompt: 'Scegli il bus e il verso.',
		problem: textBlock(text),
		solution: opt(ROUTES[route]).latex,
		steps: [textBlock(why)],
		answer: choose(
			rng,
			opt(ROUTES[route]),
			ROUTES.filter((_, k) => k !== route).map((r) => opt(r)),
		),
		params: { case: ['dati-in', 'dati-out', 'indirizzi', 'controllo'][route] },
	};
}

// ---------------------------------------------------------------------------
// Level 3: from lines to cells

function level3(rng: Rng): Built {
	const kind = rng.pick(['celle', 'ultimo', 'aggiunta'] as const);
	if (kind === 'aggiunta') {
		const n = rng.int(3, 16);
		const d = rng.pick([1, 2]);
		const cells = 2 ** n;
		const more = cells * 2 ** d;
		const { answer, distractors } = numberAnswer(more, [cells + d, d === 1 ? cells + 2 : cells * 2, cells + 2 ** d, cells * 8]);
		return {
			prompt: 'Calcola le celle indirizzabili con il bus più largo.',
			problem: textBlock(`Un bus indirizzi con $${n}$ linee può indirizzare ${nm(cells)} celle. Quante celle può indirizzare se gli si ${d === 1 ? 'aggiunge $1$ linea' : 'aggiungono $2$ linee'}?`),
			solution: num(more),
			steps: [textBlock('Ogni linea in più raddoppia le celle indirizzabili.'), textBlock(d === 1 ? `$${num(cells)} \\cdot 2 = ${num(more)}$, cioè $${pow2(n + 1)}$.` : `Con due linee in più si raddoppia due volte: $${num(cells)} \\cdot 2 \\cdot 2 = ${num(more)}$, cioè $${pow2(n + 2)}$.`)],
			answer,
			params: { case: kind, distractors },
		};
	}
	const n = rng.int(2, 20);
	const cells = 2 ** n;
	if (kind === 'celle') {
		const { answer, distractors } = numberAnswer(cells, [2 * n, n * n, cells - 1, cells / 2, cells * 2]);
		return {
			prompt: 'Calcola le celle indirizzabili.',
			problem: textBlock(`Un bus indirizzi ha $${n}$ linee. Quante celle di memoria può indirizzare al massimo?`),
			solution: `${pow2(n)} = ${num(cells)}`,
			steps: [textBlock(`Con $${n}$ linee gli indirizzi hanno $${n}$ bit, e con $${n}$ bit si scrivono $${pow2(n)}$ numeri diversi.`), textBlock(`$${pow2(n)} = ${num(cells)}$ celle.`)],
			answer,
			params: { case: kind, distractors },
		};
	}
	const { answer, distractors } = numberAnswer(cells - 1, [cells, n, cells / 2, cells / 2 - 1]);
	return {
		prompt: "Trova l'indirizzo più grande.",
		problem: textBlock(`Un bus indirizzi ha $${n}$ linee. Qual è l'indirizzo più grande che può trasportare?`),
		solution: `${pow2(n)} - 1 = ${num(cells - 1)}`,
		steps: [textBlock(`Con $${n}$ linee gli indirizzi sono $${pow2(n)} = ${num(cells)}$.`), textBlock(`Partono da $0$, quindi il più grande è $${num(cells)} - 1 = ${num(cells - 1)}$.`)],
		answer,
		params: { case: kind, distractors },
	};
}

// ---------------------------------------------------------------------------
// Level 4: from cells to lines

const ROUND = [20, 30, 50, 60, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 8000, 10000, 15000, 20000, 30000, 40000, 50000, 60000, 70000, 100000, 200000, 250000, 300000, 500000, 700000, 1000000];

function level4(rng: Rng): Built {
	const exact = rng.next() < 0.4;
	const cells = exact ? 2 ** rng.int(3, 20) : rng.pick(ROUND);
	let n = 0;
	while (2 ** n < cells) n++;
	const { answer, distractors } = numberAnswer(n, exact ? [n - 1, n + 1, n + 2] : [n - 1, n + 1, n - 2]);
	return {
		prompt: 'Trova quante linee servono al bus indirizzi.',
		problem: textBlock(`Una memoria ha ${nm(cells)} celle. Quante linee deve avere, come minimo, il bus indirizzi per indirizzarle tutte?`),
		solution: `${n}`,
		steps: exact
			? [textBlock(`Serve il più piccolo numero di linee con cui le celle indirizzabili sono almeno ${nm(cells)}.`), textBlock(`$${pow2(n)} = ${num(cells)}$: con $${n}$ linee gli indirizzi vanno da $0$ a ${nm(cells - 1)}, uno per cella.`)]
			: [
					textBlock(`Serve il più piccolo numero di linee con cui le celle indirizzabili sono almeno ${nm(cells)}.`),
					textBlock(`$${pow2(n - 1)} = ${num(2 ** (n - 1))}$ non arriva a ${nm(cells)}, mentre $${pow2(n)} = ${num(2 ** n)}$ lo supera: servono $${n}$ linee.`),
				],
		answer,
		params: { case: exact ? 'potenza' : 'non-potenza', distractors },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the memory an address bus reaches

const UNITS = ['KiB', 'MiB', 'GiB'] as const;
const FACTORS = '$2^{10}\\,\\text{B} = 1\\,\\text{KiB}$, $2^{20}\\,\\text{B} = 1\\,\\text{MiB}$, $2^{30}\\,\\text{B} = 1\\,\\text{GiB}$';
const size = (k: number, unit: string) => mathOpt(`${k}\\,\\text{${unit}}`, `${k} ${unit}`);

function level5(rng: Rng): Built {
	const n = rng.int(10, 39);
	const u = Math.floor(n / 10) - 1;
	const r = n % 10;
	const k = 2 ** r;
	const unit = UNITS[u];
	const split = r === 0 ? `$${pow2(n)}\\,\\text{B} = 1\\,\\text{${unit}}$` : `$${pow2(n)} = ${pow2(r)} \\cdot ${pow2(n - r)}$, e $${pow2(n - r)}\\,\\text{B} = 1\\,\\text{${unit}}$`;
	if (rng.next() < 0.5) {
		const others = [size(k, UNITS[(u + 1) % 3]), size(k, UNITS[(u + 2) % 3]), size(n, unit), size(k * 2, unit), size(k === 1 ? 4 : k / 2, unit)];
		return {
			prompt: 'Calcola la memoria indirizzabile.',
			problem: textBlock(`Un bus indirizzi ha $${n}$ linee, e le celle sono da $1$ byte. Quanta memoria può indirizzare al massimo? Ricorda che ${FACTORS}.`),
			solution: `${pow2(n)}\\,\\text{B} = ${k}\\,\\text{${unit}}`,
			steps: [textBlock(`Le celle indirizzabili sono $${pow2(n)}$, da $1$ byte ciascuna: la memoria è $${pow2(n)}\\,\\text{B}$.`), textBlock(`${split}: la memoria è $${k}\\,\\text{${unit}}$.`)],
			answer: choose(rng, size(k, unit), [others[rng.int(0, 1)], others[2], others[3], others[4]]),
			params: { case: 'memoria' },
		};
	}
	const { answer, distractors } = numberAnswer(n, [n - r === n ? n + 10 : n - r, r === 0 ? n - 10 : r, n + 1, n - 1]);
	return {
		prompt: 'Trova quante linee servono al bus indirizzi.',
		problem: textBlock(`Una memoria da $${k}\\,\\text{${unit}}$ ha celle da $1$ byte. Quante linee deve avere il bus indirizzi per indirizzarle tutte? Ricorda che ${FACTORS}.`),
		solution: `${n}`,
		steps: [
			textBlock(r === 0 ? `$1\\,\\text{${unit}} = ${pow2(n)}\\,\\text{B}$: le celle sono $${pow2(n)}$.` : `$${k} = ${pow2(r)}$ e $1\\,\\text{${unit}} = ${pow2(n - r)}\\,\\text{B}$: le celle sono $${pow2(r)} \\cdot ${pow2(n - r)} = ${pow2(n)}$.`),
			textBlock(`Per $${pow2(n)}$ celle servono $${n}$ linee.`),
		],
		answer,
		params: { case: 'linee', distractors },
	};
}

const LEVELS: Record<number, Level> = {
	1: { label: 'Ingresso o uscita', constraints: ['una periferica con un uso: di ingresso, di uscita, tutte e due, oppure non è una periferica; un quarto dei casi ciascuna'], make: level1 },
	2: { label: 'Quale bus e in quale verso', constraints: ["una lettura o una scrittura con indirizzo e contenuto diversi: il bus e il verso dell'indirizzo, del dato o del comando"], make: level2 },
	3: { label: 'Dalle linee alle celle', constraints: ["n linee da 2 a 20: le celle 2^n, l'indirizzo più grande 2^n - 1, oppure le celle dopo una o due linee in più"], make: level3 },
	4: { label: 'Dalle celle alle linee', constraints: ['il minimo n con 2^n ≥ N; N potenza di due (4 casi su 10) o numero tondo'], make: level4 },
	5: { label: 'La memoria indirizzabile', constraints: ['n linee da 10 a 39 e celle da 1 byte: la memoria in KiB, MiB o GiB, oppure le linee per una memoria data; i fattori sono nel testo'], make: level5 },
};

export const infBusPeriferiche = makeGenerator(ID, 'Bus e periferiche', LEVELS);

export default infBusPeriferiche;
