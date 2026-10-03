/**
 * Memoria centrale e memorie di massa. Spec: specs/exercises/memoria-storage.md
 *
 * Five levels from the lesson (docs/lezioni/informatica/riscritte/15-memoria-storage.md): which memory does a job
 * (RAM, ROM, cache, mass memory); what is lost and what is kept when the power goes; cells and addresses; capacity
 * with binary and decimal multiples, the factor always in the text; the hierarchy of memories.
 */
import type { Rng } from '../types';
import { type Built, type Level, choose, makeGenerator, nm, num, numberAnswer, opt, pickDistinct, shuffle, textBlock } from '../inf-architettura';

export const ID = 'memoria-storage';

// ---------------------------------------------------------------------------
// Level 1: which memory

export const MEMORIES = ['RAM', 'ROM', 'Cache', 'Memoria di massa'] as const;
type Memory = (typeof MEMORIES)[number];

const WHY: Record<Memory, string> = {
	RAM: 'La RAM contiene i programmi aperti e i loro dati: si legge e si scrive di continuo, ed è volatile.',
	ROM: "La ROM è la parte non volatile della memoria centrale: contiene il programma di avvio e nell'uso normale viene solo letta.",
	Cache: 'La cache è una memoria piccola e molto veloce accanto alla CPU: tiene una copia dei dati e delle istruzioni usati più di recente.',
	'Memoria di massa': 'La memoria di massa è non volatile e molto capiente: conserva i file, i programmi installati e il sistema operativo.',
};

const D = { tel: 'un telefono', tab: 'un tablet', por: 'un portatile', fis: 'un computer fisso', con: 'una console per videogiochi', oro: 'uno smartwatch' };
const ALL = Object.values(D);

export const APPS = ['del videogioco', 'della calcolatrice', 'del registro elettronico', 'del programma di videoscrittura', 'del navigatore', 'del foglio di calcolo', 'del lettore musicale', 'del programma di grafica', 'del traduttore', 'della sveglia'];

export const UNSAVED = [
	'il tema che stai scrivendo e non hai ancora salvato',
	'i dati della partita in corso, non ancora salvata',
	'il disegno a cui stai lavorando e che non hai ancora salvato',
	'i numeri appena scritti in un foglio di calcolo non ancora salvato',
	'la foto che stai ritoccando e non hai ancora salvato',
];

export const SAVED = ["il tema dopo che l'hai salvato", 'la partita dopo il salvataggio', "il disegno dopo che l'hai salvato", "il foglio di calcolo dopo che l'hai salvato", "la foto ritoccata dopo che l'hai salvata"];

export const FILES: { what: string; devices: string[] }[] = [
	{ what: 'le foto', devices: [D.tel, D.tab, D.por, D.fis] },
	{ what: 'i video', devices: [D.tel, D.tab, D.por, D.fis] },
	{ what: 'le canzoni scaricate', devices: [D.tel, D.tab, D.por, D.oro] },
	{ what: 'i documenti salvati', devices: [D.tab, D.por, D.fis] },
	{ what: 'le app installate', devices: [D.tel, D.tab, D.oro] },
	{ what: 'i giochi installati', devices: [D.con, D.por, D.fis] },
	{ what: 'il sistema operativo', devices: ALL },
];

/** Every task of level 1 with its memory: the text that follows "Quale memoria ". */
export function memoryTasks(): { memory: Memory; text: string }[] {
	const out: { memory: Memory; text: string }[] = [];
	const add = (memory: Memory, text: string) => out.push({ memory, text });
	for (const a of APPS) add('RAM', `contiene le istruzioni ${a} mentre il programma è in esecuzione`);
	for (const u of UNSAVED) add('RAM', `contiene ${u}`);
	for (const d of ALL) add('RAM', `di ${d} contiene i programmi aperti e si svuota allo spegnimento`);
	for (const d of ALL) add('ROM', `di ${d} conserva anche senza corrente le prime istruzioni da eseguire all'accensione`);
	for (const d of ALL) add('ROM', `di ${d} contiene il programma di avvio e nell'uso normale viene solo letta`);
	for (const d of ALL) add('ROM', `di ${d} fa parte della memoria centrale ma non è volatile`);
	for (const d of ALL) add('Cache', `di ${d} tiene accanto alla CPU una copia dei dati usati più di recente`);
	for (const d of ALL) add('Cache', `di ${d} è più veloce della RAM ma molto più piccola`);
	for (const a of APPS) add('Cache', `risparmia alla CPU l'attesa della RAM per le istruzioni ${a} che si ripetono di continuo`);
	for (const f of FILES) for (const d of f.devices) add('Memoria di massa', `di ${d} conserva ${f.what} anche a dispositivo spento`);
	for (const d of ALL) add('Memoria di massa', `di ${d} ha la capacità più grande`);
	for (const s of SAVED) add('Memoria di massa', `conserva ${s}`);
	for (const a of APPS) add('Memoria di massa', `è quella da cui le istruzioni ${a} vengono copiate nella RAM quando apri il programma`);
	return out;
}

const TASKS = memoryTasks();

function level1(rng: Rng): Built {
	const memory = rng.pick(MEMORIES);
	const task = rng.pick(TASKS.filter((x) => x.memory === memory));
	return {
		prompt: 'Scegli la memoria giusta.',
		problem: textBlock(`Quale memoria ${task.text}?`),
		solution: opt(memory).latex,
		steps: [textBlock(WHY[memory])],
		answer: choose(
			rng,
			opt(memory),
			MEMORIES.filter((m) => m !== memory).map((m) => opt(m)),
		),
		params: { case: memory },
	};
}

// ---------------------------------------------------------------------------
// Level 2: lost or kept

export const LOST = [
	'Il tema scritto e non ancora salvato',
	'La partita in corso, non salvata',
	'Il numero appena digitato nella calcolatrice',
	'Il disegno non ancora salvato',
	"Il contenuto dell'accumulatore della CPU",
	'I dati tenuti nella cache',
	'Le modifiche non salvate a una foto',
	'La copia in RAM del programma aperto',
];

export const KEPT = [
	'Le foto salvate nella galleria',
	'Il programma di avvio nella ROM',
	'I file su una chiavetta USB',
	'Il sistema operativo installato sul disco',
	'Un documento salvato sul disco',
	'Le canzoni scaricate nella memoria interna',
	'Le app installate',
	'I video salvati su una scheda di memoria',
];

export const BLACKOUTS = [
	'Va via la corrente e il computer fisso si spegne.',
	'La batteria del portatile si scarica e il portatile si spegne.',
	'La batteria del telefono si scarica e il telefono si spegne.',
	'Qualcuno stacca per sbaglio la spina della console, che si spegne.',
	'Un temporale fa saltare la corrente e il computer della scuola si spegne.',
	'La batteria del tablet si scarica e il tablet si spegne.',
];

function level2(rng: Rng): Built {
	const lost = rng.next() < 0.5;
	const intro = rng.pick(BLACKOUTS);
	const right = rng.pick(lost ? LOST : KEPT);
	const others = pickDistinct(rng, lost ? KEPT : LOST, 3);
	return {
		prompt: lost ? 'Scegli che cosa va perso.' : 'Scegli che cosa si ritrova.',
		problem: textBlock(`${intro} ${lost ? 'Quale di queste cose va persa?' : 'Quale di queste cose si ritrova alla riaccensione?'}`),
		solution: opt(right).latex,
		steps: [
			textBlock('Registri, cache e RAM sono volatili: senza corrente perdono il contenuto. ROM e memorie di massa sono non volatili: lo conservano.'),
			textBlock(lost ? 'Va perso quello che stava solo in una memoria volatile; le altre tre cose sono nella ROM o in una memoria di massa.' : 'Si ritrova quello che stava nella ROM o in una memoria di massa; le altre tre cose erano solo in una memoria volatile.'),
		],
		answer: choose(
			rng,
			opt(right),
			others.map((o) => opt(o)),
		),
		params: { case: lost ? 'persa' : 'ritrovata' },
	};
}

// ---------------------------------------------------------------------------
// Level 3: cells and addresses

export const CELLS = [16, 32, 50, 64, 100, 128, 200, 250, 256, 300, 400, 500, 512, 1000, 1024, 2000, 2048, 4000, 4096, 5000, 8192, 10000, 16384, 20000, 32768, 50000, 65536, 100000, 131072, 262144, 1048576];

function level3(rng: Rng): Built {
	const n = rng.pick(CELLS);
	const kind = rng.pick(['ultimo', 'quante', 'byte', 'bit'] as const);
	if (kind === 'ultimo') {
		const { answer, distractors } = numberAnswer(n - 1, [n, n + 1, n - 2]);
		return {
			prompt: "Trova l'indirizzo dell'ultima cella.",
			problem: textBlock(`Una memoria ha ${nm(n)} celle, con gli indirizzi che partono da $0$. Qual è l'indirizzo dell'ultima cella?`),
			solution: num(n - 1),
			steps: [textBlock(`Gli indirizzi partono da $0$: con ${nm(n)} celle vanno da $0$ a $${num(n)} - 1 = ${num(n - 1)}$.`)],
			answer,
			params: { case: kind, distractors },
		};
	}
	if (kind === 'quante') {
		const { answer, distractors } = numberAnswer(n, [n - 1, n - 2, n + 1]);
		return {
			prompt: 'Trova il numero delle celle.',
			problem: textBlock(`Gli indirizzi delle celle di una memoria vanno da $0$ a ${nm(n - 1)}. Quante celle ha la memoria?`),
			solution: num(n),
			steps: [textBlock(`Anche lo $0$ è un indirizzo: le celle sono $${num(n - 1)} + 1 = ${num(n)}$.`)],
			answer,
			params: { case: kind, distractors },
		};
	}
	if (kind === 'byte') {
		const { answer, distractors } = numberAnswer(n, [n - 1, 8 * n, n + 1]);
		return {
			prompt: 'Trova la capacità della memoria in byte.',
			problem: textBlock(`Una memoria ha celle da $1$ byte, con indirizzi da $0$ a ${nm(n - 1)}. Qual è la sua capacità in byte?`),
			solution: `${num(n)}\\,\\text{B}`,
			steps: [textBlock(`Le celle sono $${num(n - 1)} + 1 = ${num(n)}$.`), textBlock(`Ogni cella contiene $1$ byte: la capacità è ${nm(n)} byte.`)],
			answer,
			params: { case: kind, distractors },
		};
	}
	const { answer, distractors } = numberAnswer(8 * n, [n, 8 * (n - 1), n % 8 === 0 ? n / 8 : 10 * n, 8 * n - 1]);
	return {
		prompt: 'Trova quanti bit contiene la memoria.',
		problem: textBlock(`Una memoria ha ${nm(n)} celle da $1$ byte. Quanti bit contiene in tutto?`),
		solution: num(8 * n),
		steps: [textBlock(`Un byte sono $8$ bit: $${num(n)} \\cdot 8 = ${num(8 * n)}$ bit.`)],
		answer,
		params: { case: kind, distractors },
	};
}

// ---------------------------------------------------------------------------
// Level 4: capacity with the multiples

const KS = [2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 48, 64, 100, 128, 256, 512];
export const MEDIA = ['Una chiavetta USB', 'Un SSD', 'Una scheda di memoria', 'Un disco magnetico'];

function level4(rng: Rng): Built {
	const kind = rng.pick(['kib', 'mib', 'celle', 'file'] as const);
	if (kind === 'kib' || kind === 'mib') {
		const k = rng.pick(KS);
		const n = 1024 * k;
		const [small, big] = kind === 'kib' ? ['B', 'KiB'] : ['KiB', 'MiB'];
		const { answer, distractors } = numberAnswer(k, [Math.floor(n / 1000), 8 * k, 2 * k, k + 1]);
		const text =
			kind === 'kib'
				? `Una memoria ha ${nm(n)} celle da $1$ byte. Qual è la sua capacità in KiB? Ricorda che $1\\,\\text{KiB} = 1024\\,\\text{B}$.`
				: `Una RAM ha una capacità di $${num(n)}\\,\\text{KiB}$. Quanti MiB sono? Ricorda che $1\\,\\text{MiB} = 1024\\,\\text{KiB}$.`;
		return {
			prompt: `Scrivi la capacità in ${big}.`,
			problem: textBlock(text),
			solution: `${k}\\,\\text{${big}}`,
			steps: [
				...(kind === 'kib' ? [textBlock(`Con celle da $1$ byte la capacità è $${num(n)}\\,\\text{B}$.`)] : []),
				textBlock(`Si divide per il fattore: $${num(n)} : 1024 = ${k}$, quindi $${k}\\,\\text{${big}}$.`),
				textBlock(`Il fattore è $1024$, non $1000$: ${big} è un multiplo binario di ${small === 'B' ? 'byte' : small}.`),
			],
			answer,
			params: { case: kind, distractors },
		};
	}
	if (kind === 'celle') {
		const k = rng.pick(KS);
		const n = 1024 * k;
		const { answer, distractors } = numberAnswer(n, [1000 * k, 8 * n, n - 1]);
		return {
			prompt: 'Trova il numero delle celle.',
			problem: textBlock(`Una memoria ha una capacità di $${k}\\,\\text{KiB}$ e celle da $1$ byte. Quante celle ha? Ricorda che $1\\,\\text{KiB} = 1024\\,\\text{B}$.`),
			solution: num(n),
			steps: [textBlock(`La capacità in byte: $${k} \\cdot 1024 = ${num(n)}\\,\\text{B}$.`), textBlock(`Con celle da $1$ byte le celle sono tante quanti i byte: ${nm(n)}.`)],
			answer,
			params: { case: kind, distractors },
		};
	}
	const c = rng.pick([4, 8, 16, 32, 64, 128, 256, 500]);
	const s = rng.pick([2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500]);
	if ((c * 1000) % s !== 0) return level4(rng);
	const n = (c * 1000) / s;
	const what = s <= 10 ? rng.pick(['Quante foto', 'Quante canzoni']) : s <= 50 ? 'Quante presentazioni' : 'Quanti video';
	const medium = rng.pick(MEDIA);
	const { answer, distractors } = numberAnswer(n, [Math.floor((c * 1024) / s), c * s, n * 10, n / 10].filter(Number.isInteger));
	return {
		prompt: 'Calcola quanti file ci stanno.',
		problem: textBlock(`${medium} ha una capacità di $${c}\\,\\text{GB}$. ${what} da $${s}\\,\\text{MB}$ può contenere al massimo? Ricorda che $1\\,\\text{GB} = 1000\\,\\text{MB}$.`),
		solution: num(n),
		steps: [
			textBlock(`La capacità nella stessa unità dei file: $${c}\\,\\text{GB} = ${c} \\cdot 1000\\,\\text{MB} = ${num(c * 1000)}\\,\\text{MB}$.`),
			textBlock(`Si divide per la dimensione di un file: $${num(c * 1000)} : ${s} = ${num(n)}$.`),
		],
		answer,
		params: { case: kind, distractors },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the hierarchy

/** From the fastest and dearest per byte to the slowest and cheapest. */
export const HIERARCHY = ['registri', 'cache', 'RAM', 'SSD', 'disco magnetico'] as const;
/** For capacity the two mass memories are not compared with each other: only the disk is used. */
const CAPACITY = ['registri', 'cache', 'RAM', 'disco magnetico'] as const;

type Criterion = 'veloce' | 'lenta' | 'cara' | 'economica' | 'capiente' | 'piccola';
const ORDER_TEXT: Record<Criterion, string> = {
	veloce: 'dalla più veloce alla più lenta',
	lenta: 'dalla più lenta alla più veloce',
	cara: 'da quella che costa di più per ogni byte a quella che costa di meno',
	economica: 'da quella che costa di meno per ogni byte a quella che costa di più',
	capiente: 'dalla più capiente alla meno capiente',
	piccola: 'dalla meno capiente alla più capiente',
};
const BEST_TEXT: Record<Criterion, string> = {
	veloce: 'è la più veloce',
	lenta: 'è la più lenta',
	cara: 'costa di più per ogni byte',
	economica: 'costa di meno per ogni byte',
	capiente: 'ha la capacità più grande',
	piccola: 'ha la capacità più piccola',
};
/** True when the criterion lists the memories from the top of the hierarchy down. */
const TOP_DOWN: Record<Criterion, boolean> = { veloce: true, lenta: false, cara: true, economica: false, capiente: false, piccola: true };

const list = (xs: readonly string[]) => xs.join(', ');

function permutations<T>(xs: readonly T[]): T[][] {
	if (xs.length <= 1) return [[...xs]];
	return xs.flatMap((x, i) => permutations([...xs.slice(0, i), ...xs.slice(i + 1)]).map((p) => [x, ...p]));
}

function level5(rng: Rng): Built {
	const criterion = rng.pick(['veloce', 'lenta', 'cara', 'economica', 'capiente', 'piccola'] as const);
	const pool = criterion === 'capiente' || criterion === 'piccola' ? CAPACITY : HIERARCHY;
	const kind = rng.pick(['ordine', 'ordine', 'estremo'] as const);
	const why =
		"Nella gerarchia delle memorie, dall'alto in basso: registri, cache, RAM, SSD, disco magnetico. Scendendo la velocità diminuisce, il costo di ogni byte diminuisce e la capacità aumenta.";
	if (kind === 'estremo') {
		const items = pickDistinct(rng, pool, 4);
		const sorted = [...items].sort((a, b) => pool.indexOf(a as never) - pool.indexOf(b as never));
		const right = TOP_DOWN[criterion] ? sorted[0] : sorted[3];
		return {
			prompt: 'Scegli la memoria giusta.',
			problem: textBlock(`Quale di queste memorie ${BEST_TEXT[criterion]}?`),
			solution: opt(right).latex,
			steps: [textBlock(why), textBlock(`Tra le quattro, ${TOP_DOWN[criterion] ? 'la più in alto' : 'la più in basso'} nella gerarchia è: ${right}.`)],
			answer: choose(
				rng,
				opt(right),
				items.filter((x) => x !== right).map((x) => opt(x)),
			),
			params: { case: 'estremo', criterion },
		};
	}
	const size = rng.pick([3, 3, 4]);
	const shown = pickDistinct(rng, pool, size);
	const sorted = [...shown].sort((a, b) => pool.indexOf(a as never) - pool.indexOf(b as never));
	const right = TOP_DOWN[criterion] ? sorted : [...sorted].reverse();
	// the items are listed in an order that is neither the answer nor its reverse
	const reversed = [...right].reverse();
	let listed = shown;
	for (let k = 0; k < 20 && (list(listed) === list(right) || list(listed) === list(reversed)); k++) listed = shuffle(rng, shown);
	if (list(listed) === list(right) || list(listed) === list(reversed)) return level5(rng);
	const wrong = [reversed, listed, ...shuffle(rng, permutations(shown))];
	return {
		prompt: "Scegli l'ordine giusto.",
		problem: textBlock(`Metti in ordine queste memorie ${ORDER_TEXT[criterion]}: ${list(listed)}.`),
		solution: opt(list(right)).latex,
		steps: [textBlock(why), textBlock(`L'ordine chiesto è: ${list(right)}.`)],
		answer: choose(
			rng,
			opt(list(right)),
			wrong.map((w) => opt(list(w))),
		),
		params: { case: 'ordine', criterion },
	};
}

const LEVELS: Record<number, Level> = {
	1: { label: 'Quale memoria per quale uso', constraints: ['un compito o un contenuto, la memoria tra RAM, ROM, cache e memoria di massa, un quarto dei casi ciascuna'], make: level1 },
	2: { label: 'Che cosa si perde senza corrente', constraints: ["metà: l'unica cosa persa tra tre conservate; metà: l'unica conservata tra tre perse"], make: level2 },
	3: { label: 'Celle e indirizzi', constraints: ['ultimo indirizzo, numero di celle, capacità in byte, numero di bit; celle da 1 byte, indirizzi da 0'], make: level3 },
	4: { label: 'Capacità con i multipli', constraints: ['byte in KiB, KiB in MiB, KiB in celle, file da S MB in C GB; il fattore (1024 o 1000) è nel testo'], make: level4 },
	5: { label: 'La gerarchia delle memorie', constraints: ['ordinare tre o quattro memorie per velocità, costo per byte o capacità, o scegliere la prima di quattro; SSD e disco magnetico non si confrontano per capacità'], make: level5 },
};

export const memoriaStorage = makeGenerator(ID, 'Memoria centrale e memorie di massa', LEVELS);

export default memoriaStorage;
