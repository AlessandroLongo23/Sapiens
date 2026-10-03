/**
 * Hardware e software. Spec: specs/exercises/hardware-software.md
 *
 * Five levels in the order of the lesson (docs/lezioni/informatica/riscritte/02-hardware-software.md), all multiple
 * choice, built from interchangeable pieces: hardware or software; system or application software; which kind of
 * software does a job (operating system, driver, firmware, application); hardware fault or software problem; a
 * true (or false) statement among four. The checker has its own tables of the pieces, written from the spec.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { pickDistinct, textBlock } from '../insiemi';
import { BANNED, NAMES, checkChoice, choose, t, textOpt } from '../inf-informazione';

export const ID = 'hardware-software';

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	choice: ChoiceAnswer;
	params: Record<string, unknown>;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const opt = (x: string) => textOpt(cap(x), x);

/** One piece of `rightPool` among three of `otherPool`. */
function oneAmongThree(rng: Rng, rightPool: readonly string[], otherPool: readonly string[]) {
	const right = rng.pick(rightPool);
	const others = pickDistinct(rng, otherPool, 3);
	return { right, choice: choose(rng, opt(right), others.map(opt)) };
}

// ---------------------------------------------------------------------------
// Level 1: hardware or software

export const HARDWARE = [
	'lo schermo',
	'la tastiera',
	'il mouse',
	'la batteria',
	'la memoria RAM',
	'la CPU',
	'la stampante',
	'la webcam',
	'il disco di un videogioco',
	'una chiavetta USB',
	"l'altoparlante",
	'la scheda video',
	'il caricatore',
	'il microfono',
];
export const SOFTWARE = [
	'il browser',
	'il sistema operativo',
	'un videogioco scaricato',
	"l'app del meteo",
	'il programma di videoscrittura',
	'il foglio di calcolo',
	'il driver della stampante',
	"l'app della fotocamera",
	"l'antivirus",
	'il firmware del router',
	"l'app del registro elettronico",
	'il programma per ritoccare le foto',
	"l'app di messaggistica",
	'il lettore musicale',
];

function level1(rng: Rng): Built {
	const findHw = rng.next() < 0.5;
	const { right, choice } = findHw ? oneAmongThree(rng, HARDWARE, SOFTWARE) : oneAmongThree(rng, SOFTWARE, HARDWARE);
	return {
		prompt: findHw ? "Riconosci l'hardware." : 'Riconosci il software.',
		problem: textBlock(findHw ? 'Quale di questi è hardware?' : 'Quale di questi è software?'),
		solution: opt(right).latex,
		steps: [
			textBlock(
				findHw
					? `${cap(right)} è un oggetto, che si può toccare: è hardware. Gli altri sono programmi: sono software.`
					: `${cap(right)} è un programma, cioè una sequenza di istruzioni: è software. Gli altri sono oggetti che si possono toccare: sono hardware.`,
			),
		],
		choice,
		params: { case: findHw ? 'hardware' : 'software', right },
	};
}

// ---------------------------------------------------------------------------
// Level 2: system or application software

export const SYSTEM = [
	'il sistema operativo del telefono',
	'il sistema operativo del portatile',
	'il sistema operativo del tablet',
	'il sistema operativo della console',
	'il sistema operativo della smart TV',
	'il driver della stampante',
	'il driver della scheda video',
	'il driver del mouse',
	'il driver dello scanner',
	'il driver della webcam',
	'il driver della scheda audio',
];
export const APPLICATION = [
	'il browser',
	'il programma di videoscrittura',
	'il foglio di calcolo',
	'un videogioco',
	"l'app del registro elettronico",
	'il programma per ritoccare le foto',
	"l'app di messaggistica",
	'il lettore musicale',
	"l'app delle mappe",
	'il programma per le presentazioni',
	"l'app del meteo",
	'il programma per montare i video',
];

function level2(rng: Rng): Built {
	const findSystem = rng.next() < 0.5;
	const { right, choice } = findSystem ? oneAmongThree(rng, SYSTEM, APPLICATION) : oneAmongThree(rng, APPLICATION, SYSTEM);
	return {
		prompt: findSystem ? 'Riconosci il software di base.' : 'Riconosci il software applicativo.',
		problem: textBlock(findSystem ? 'Quale di questi programmi è software di base?' : 'Quale di questi programmi è software applicativo?'),
		solution: opt(right).latex,
		steps: [
			textBlock(
				findSystem
					? `${cap(right)} gestisce l'hardware e lo rende utilizzabile dagli altri programmi: è software di base. Gli altri servono all'utente per fare il suo lavoro: sono software applicativo.`
					: `${cap(right)} serve all'utente per fare il suo lavoro: è software applicativo. Gli altri gestiscono l'hardware per conto degli altri programmi: sono software di base.`,
			),
		],
		choice,
		params: { case: findSystem ? 'di-base' : 'applicativo', right },
	};
}

// ---------------------------------------------------------------------------
// Level 3: which kind of software does this job

export const KINDS = ['Il sistema operativo', 'Un driver', 'Il firmware', 'Un programma applicativo'] as const;
type Kind = 'sistema-operativo' | 'driver' | 'firmware' | 'applicativo';
const KIND_IDS: Kind[] = ['sistema-operativo', 'driver', 'firmware', 'applicativo'];

function level3(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const k = rng.int(0, 3);
	const kind = KIND_IDS[k];
	const second = rng.next() < 0.5;
	let job: string;
	let why: string;
	if (kind === 'driver') {
		const p = rng.pick(['la stampante', 'la webcam', 'lo scanner', 'la scheda video', 'il mouse da gioco', 'la tavoletta grafica']);
		job = second ? `Spiega al sistema operativo quali comandi capisce ${p} di ${N}.` : `Permette al sistema operativo di usare ${p} di ${N}.`;
		why = 'Il programma che fa da tramite tra il sistema operativo e una periferica precisa è un driver.';
	} else if (kind === 'firmware') {
		const d = rng.pick(['della lavatrice', 'del telecomando', 'del router', 'della scheda madre', 'della stampante', 'della smart TV', 'del forno a microonde', "dell'auto"]);
		job = second
			? `Chi ha costruito il dispositivo lo ha scritto in un chip di memoria ${d} di ${N}, e lì resta anche a dispositivo spento.`
			: `È registrato in modo permanente in un chip ${d} di ${N} ed è il primo programma che parte all'accensione.`;
		why = 'Il software registrato in modo permanente in un chip del dispositivo, da chi lo ha costruito, è il firmware.';
	} else if (kind === 'sistema-operativo') {
		const d = rng.pick(['del telefono', 'del portatile', 'del tablet', 'della console']);
		job = second ? `Organizza i file e le cartelle ${d} di ${N} e mostra finestre e icone.` : `Parte all'accensione ${d} di ${N} e resta in esecuzione: assegna la CPU e la memoria agli altri programmi.`;
		why = 'Il programma che gestisce CPU, memoria e file per tutti gli altri programmi è il sistema operativo.';
	} else {
		const task = rng.pick([
			'scrivere un tema',
			'calcolare la media dei voti',
			'navigare sul web',
			'ritoccare una foto',
			'montare un video',
			'ascoltare la musica',
			'preparare una presentazione',
			'guardare i voti sul registro',
			'giocare con gli amici',
			'mandare messaggi',
		]);
		job = second ? `${N} lo apre quando deve ${task}.` : `${N} lo usa per ${task}.`;
		why = "Un programma che serve all'utente per fare il suo lavoro è software applicativo.";
	}
	const others = KINDS.filter((_, i) => i !== k).map((x) => textOpt(x));
	return {
		prompt: 'Riconosci il tipo di software.',
		problem: textBlock(`${job} Che tipo di software è?`),
		solution: t(KINDS[k]),
		steps: [textBlock(why)],
		choice: choose(rng, textOpt(KINDS[k]), others),
		params: { case: kind, name: N },
	};
}

// ---------------------------------------------------------------------------
// Level 4: hardware fault or software problem

export const HW_PROBLEMS = [
	'lo schermo ha una crepa',
	'la batteria non tiene più la carica',
	'un tasto della tastiera si è rotto',
	'la ventola fa rumore perché è consumata',
	'la porta USB è piegata',
	'il cavo del caricatore è spezzato',
	"l'altoparlante gracchia dopo una caduta",
	'il vetro della fotocamera è graffiato',
];
export const SW_PROBLEMS = [
	"un'app si chiude da sola dopo l'aggiornamento",
	'manca il driver della stampante nuova',
	'un gioco si blocca sempre al terzo livello',
	'il browser non apre un sito finché non lo aggiorni',
	'il programma non apre i file del nuovo formato',
	'il sistema operativo va aggiornato per sicurezza',
	"l'app del registro mostra la media sbagliata",
	'un programma ha un errore nei calcoli',
];

function level4(rng: Rng): Built {
	const findHw = rng.next() < 0.5;
	const { right, choice } = findHw ? oneAmongThree(rng, HW_PROBLEMS, SW_PROBLEMS) : oneAmongThree(rng, SW_PROBLEMS, HW_PROBLEMS);
	return {
		prompt: findHw ? "Trova il guasto dell'hardware." : 'Trova il problema del software.',
		problem: textBlock(findHw ? "Quale di questi problemi è un guasto dell'hardware, che nessun aggiornamento ripara?" : 'Quale di questi problemi è del software, e si risolve senza riparare o sostituire pezzi?'),
		solution: opt(right).latex,
		steps: [
			textBlock(
				findHw
					? `“${cap(right)}” riguarda un oggetto che si è rotto o consumato: è un guasto dell'hardware, e il pezzo va riparato o sostituito. Gli altri sono errori o mancanze di un programma: si risolvono installando o aggiornando software.`
					: `“${cap(right)}” riguarda un programma: si risolve installando o aggiornando software. Gli altri sono oggetti rotti o consumati: guasti dell'hardware, da riparare o sostituire.`,
			),
		],
		choice,
		params: { case: findHw ? 'hardware' : 'software', right },
	};
}

// ---------------------------------------------------------------------------
// Level 5: true and false statements

export const TRUE_STATEMENTS = [
	'un programma è una sequenza di istruzioni',
	'il firmware è software',
	"senza software l'hardware non fa niente",
	'la memoria RAM è hardware',
	'il sistema operativo è software di base',
	'un driver è un programma',
	'il software si può copiare senza perderlo',
	'il browser è software applicativo',
	'il freeware è gratis ma non si può modificare',
	'il software libero si può studiare e modificare',
	'una foto è un dato, non un programma',
];
export const FALSE_STATEMENTS = [
	'la CPU è software perché non si vede',
	'il firmware è un pezzo di hardware',
	'un driver è un componente della stampante',
	'il software si consuma con gli anni',
	'il sistema operativo è software applicativo',
	'ogni programma gratuito è software libero',
	'un videogioco è software di base',
	"le app comandano l'hardware senza il sistema operativo",
	'uno schermo crepato si ripara con un aggiornamento',
	'il software di base è fatto di programmi semplici',
	'il disco di un videogioco è software',
	'una foto salvata nel telefono è un programma',
];

/** Why each false statement is false, in the words of the lesson. */
const CORRECTIONS: Record<string, string> = {
	'la CPU è software perché non si vede': 'la CPU è un oggetto, anche se sta dentro la scocca: è hardware',
	'il firmware è un pezzo di hardware': 'il chip è hardware, ma il firmware è il programma scritto nel chip: è software',
	'un driver è un componente della stampante': 'il driver è un programma installato sul computer, non un pezzo della periferica',
	'il software si consuma con gli anni': "un programma esegue sempre le stesse istruzioni: a consumarsi è l'hardware",
	'il sistema operativo è software applicativo': "il sistema operativo gestisce l'hardware per gli altri programmi: è software di base",
	'ogni programma gratuito è software libero': 'un programma gratuito che non si può studiare né modificare è freeware, non software libero',
	'un videogioco è software di base': "un videogioco serve all'utente per giocare: è software applicativo",
	"le app comandano l'hardware senza il sistema operativo": "le app chiedono al sistema operativo, che comanda l'hardware per loro",
	'uno schermo crepato si ripara con un aggiornamento': "uno schermo crepato è un guasto dell'hardware: va riparato o sostituito",
	'il software di base è fatto di programmi semplici': '“di base” indica lo strato che sta sotto gli altri programmi, non la difficoltà',
	'il disco di un videogioco è software': 'il disco è un oggetto, quindi hardware; software è il gioco registrato sopra',
	'una foto salvata nel telefono è un programma': 'una foto non contiene istruzioni da eseguire: è un dato',
};

function level5(rng: Rng): Built {
	const findTrue = rng.next() < 0.5;
	const { right, choice } = findTrue ? oneAmongThree(rng, TRUE_STATEMENTS, FALSE_STATEMENTS) : oneAmongThree(rng, FALSE_STATEMENTS, TRUE_STATEMENTS);
	const wrong = choice.options.filter((_, i) => i !== choice.correct).map((o) => o.values[0]);
	const steps = findTrue ? wrong.map((w) => textBlock(`“${cap(w)}” è falsa: ${CORRECTIONS[w]}.`)) : [textBlock(`“${cap(right)}” è falsa: ${CORRECTIONS[right]}.`)];
	return {
		prompt: findTrue ? "Trova l'affermazione vera." : "Trova l'affermazione falsa.",
		problem: textBlock(findTrue ? 'Quale di queste affermazioni è vera?' : 'Quale di queste affermazioni è falsa?'),
		solution: opt(right).latex,
		steps: findTrue ? [...steps, textBlock(`Resta vera “${cap(right)}”.`)] : [...steps, textBlock('Le altre tre affermazioni sono vere.')],
		choice,
		params: { case: findTrue ? 'vera' : 'falsa', right },
	};
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 200; attempt++) {
		const b = make(rng);
		const sample: Sample = { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.choice, params: b.params };
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test(sample.problem + sample.steps.join(' ') + sample.solution)) v.push('parole vietate');
	if (sample.answer.kind !== 'choice') return [...v, 'la risposta deve essere una scelta'];
	checkChoice(sample.answer, v);
	return v;
}

export const hardwareSoftware: Generator = {
	id: ID,
	title: 'Hardware e software',
	levels: {
		1: { label: 'Hardware o software', constraints: ['un componente hardware tra tre programmi, o un programma tra tre componenti'] },
		2: { label: 'Software di base o applicativo', constraints: ['un sistema operativo o un driver tra tre programmi applicativi, o il contrario'] },
		3: { label: 'Sistema operativo, driver, firmware, applicazione', constraints: ['la descrizione di un lavoro, quattro tipi di software, circa 1 su 4 ciascuno'] },
		4: { label: 'Guasto hardware o problema software', constraints: ["un guasto dell'hardware tra tre problemi del software, o il contrario"] },
		5: { label: 'Vero o falso su hardware e software', constraints: ["un'affermazione vera tra tre false, o una falsa tra tre vere"] },
	},
	generate,
	check,
};

export default hardwareSoftware;
