/**
 * Processi, thread e multitasking. Spec: specs/exercises/processi-thread.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/20-processi-thread.md): the state of a process from
 * a situation; the state after one event; the state after a sequence of events; then the round robin on three
 * processes with a given quantum: the sequence of turns, the instant a process ends, its time in the queue.
 * Levels 1 to 4 are multiple choice, 5 and 6 have a number answer in milliseconds.
 */
import type { Rng, Sample } from '../types';
import { choose, makeGenerator, numberAnswer, opt, pw, shuffle, textBlock, withUnit, wrapText, type Built } from '../inf-so';

export const ID = 'processi-thread';

const PROGRAMS = [
	'del browser',
	'del lettore di musica',
	'di un gioco',
	'di un programma di videoscrittura',
	"di un'app di messaggi",
	'del foglio di calcolo',
	'di un programma di disegno',
	"di un'app di mappe",
	'del lettore video',
	'di un programma di fotoritocco',
	"dell'antivirus",
	"di un'app per le videochiamate",
];

export const STATES = { pronto: 'Pronto', esecuzione: 'In esecuzione', attesa: 'In attesa', terminato: 'Terminato' } as const;
type State = keyof typeof STATES;
const IN_PROSE: Record<State, string> = { pronto: 'pronto', esecuzione: 'in esecuzione', attesa: 'in attesa', terminato: 'terminato' };
const stateOpt = (s: State) => opt(STATES[s], s);
const stateChoice = (rng: Rng, s: State) =>
	choose(
		rng,
		stateOpt(s),
		shuffle(
			rng,
			(Object.keys(STATES) as State[]).filter((x) => x !== s),
		).map(stateOpt),
	);

// ---------------------------------------------------------------------------
// Level 1: the state from a situation

const SITUATIONS: [State, string, string][] = [
	['esecuzione', 'sta usando la CPU: le sue istruzioni vengono eseguite in questo momento', 'Un processo che usa la CPU è in esecuzione.'],
	['esecuzione', 'ha appena ricevuto la CPU dallo scheduler', 'Un processo che ha ricevuto la CPU è in esecuzione.'],
	['esecuzione', 'è a metà del suo quanto di tempo', 'Durante il suo quanto di tempo il processo usa la CPU: è in esecuzione.'],
	['pronto', 'potrebbe proseguire subito, ma la CPU è occupata da un altro processo', 'Al processo manca solo la CPU: è pronto.'],
	['pronto', 'ha finito il suo quanto di tempo ed è tornato in coda', 'Quando il quanto scade il processo torna in coda: è pronto.'],
	['pronto', 'è appena stato creato e aspetta il suo primo turno', 'Un processo appena creato entra nella coda dei pronti.'],
	['pronto', 'ha ricevuto i dati che aspettava, e ora gli manca solo la CPU', 'Quando il dato arriva il processo non riprende subito la CPU: torna pronto.'],
	['attesa', 'ha chiesto di leggere un file, e il disco non ha ancora risposto', "Il processo non può proseguire finché il disco non risponde: è in attesa."],
	['attesa', "non può proseguire finché l'utente non preme un tasto", "Il processo aspetta un evento, e la CPU non gli servirebbe: è in attesa."],
	['attesa', 'ha chiesto dei dati alla rete, e i dati non sono ancora arrivati', 'Il processo aspetta dei dati: è in attesa.'],
	['terminato', 'ha eseguito la sua ultima istruzione, e il sistema si è ripreso la sua memoria', "Dopo l'ultima istruzione il processo termina."],
	['terminato', 'è stato chiuso, e non riceverà più la CPU', 'Un processo chiuso è terminato: non torna in coda.'],
];

function level1(rng: Rng): Built {
	const P = rng.pick(PROGRAMS);
	const k = rng.int(0, SITUATIONS.length - 1);
	const [state, text, why] = SITUATIONS[k];
	return {
		prompt: 'Riconosci lo stato del processo.',
		problem: textBlock(`Il processo ${P} ${text}. In quale stato si trova?`),
		solution: wrapText(STATES[state]),
		steps: [textBlock(why)],
		answer: stateChoice(rng, state),
		params: { case: state, situation: k },
	};
}

// ---------------------------------------------------------------------------
// Levels 2 and 3: events and transitions

type EventKind = 'cpu' | 'quanto' | 'richiesta' | 'arrivo' | 'fine';
export const TRANSITIONS: Record<EventKind, [State, State]> = {
	cpu: ['pronto', 'esecuzione'],
	quanto: ['esecuzione', 'pronto'],
	richiesta: ['esecuzione', 'attesa'],
	arrivo: ['attesa', 'pronto'],
	fine: ['esecuzione', 'terminato'],
};
const EVENTS: Record<EventKind, string[]> = {
	cpu: ['lo scheduler gli assegna la CPU', 'arriva il suo turno e riceve la CPU'],
	quanto: ['il suo quanto di tempo scade', 'viene interrotto perché il quanto è scaduto'],
	richiesta: ['chiede di leggere un file dal disco', "si mette ad aspettare un tasto dall'utente", 'chiede dei dati alla rete'],
	arrivo: ["l'operazione che aspettava viene completata", 'i dati che aspettava arrivano'],
	fine: ['esegue la sua ultima istruzione'],
};
const WHY_EVENT: Record<EventKind, string> = {
	cpu: 'riceve la CPU, quindi passa da pronto a in esecuzione',
	quanto: 'il quanto scade, quindi torna in coda: da in esecuzione a pronto',
	richiesta: "deve aspettare l'esito di una richiesta, quindi passa da in esecuzione a in attesa",
	arrivo: 'quello che aspettava è arrivato, quindi passa da in attesa a pronto, e non subito in esecuzione',
	fine: "dopo l'ultima istruzione il processo termina",
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function level2(rng: Rng): Built {
	const P = rng.pick(PROGRAMS);
	const kind = rng.pick(Object.keys(EVENTS) as EventKind[]);
	const [from, to] = TRANSITIONS[kind];
	const text = rng.pick(EVENTS[kind]);
	return {
		prompt: 'Trova lo stato del processo dopo un evento.',
		problem: textBlock(`Il processo ${P} è ${IN_PROSE[from]}. Poi ${text}. In quale stato si trova ora?`),
		solution: wrapText(STATES[to]),
		steps: [textBlock(`${cap(WHY_EVENT[kind])}.`)],
		answer: stateChoice(rng, to),
		params: { case: kind, from, to },
	};
}

function level3(rng: Rng): Built {
	const P = rng.pick(PROGRAMS);
	const length = rng.int(3, 5);
	let state: State = 'pronto';
	const kinds: EventKind[] = [];
	const texts: string[] = [];
	const trail: string[] = ['creato: pronto'];
	for (let i = 0; i < length; i++) {
		const last = i === length - 1;
		const possible = (Object.keys(TRANSITIONS) as EventKind[]).filter((k) => TRANSITIONS[k][0] === state && (last || k !== 'fine'));
		const kind = rng.pick(possible);
		state = TRANSITIONS[kind][1];
		kinds.push(kind);
		texts.push(rng.pick(EVENTS[kind]));
		trail.push(`${texts[i]}: ${IN_PROSE[state]}`);
	}
	return {
		prompt: 'Segui gli stati del processo, un evento alla volta.',
		problem: textBlock(`Il processo ${P} viene creato. Poi, nell'ordine: ${texts.join('; ')}. In quale stato si trova alla fine?`),
		solution: wrapText(STATES[state]),
		steps: [textBlock('Un processo appena creato è pronto. Poi si segue un evento alla volta.'), textBlock(`${cap(trail.join('; '))}.`)],
		answer: stateChoice(rng, state),
		params: { case: state, events: kinds },
	};
}

// ---------------------------------------------------------------------------
// Levels 4, 5 and 6: round robin

interface Turn {
	p: number; // index of the process, from 0
	start: number;
	end: number;
}

/** Round robin on processes that are all in the queue at 0, in order; with `full`, the mistake of counting a whole quantum for every turn. */
export function roundRobin(bursts: number[], q: number, full = false): { turns: Turn[]; ends: number[] } {
	const left = [...bursts];
	const queue = bursts.map((_, i) => i);
	const turns: Turn[] = [];
	const ends = bursts.map(() => 0);
	let now = 0;
	while (queue.length) {
		const p = queue.shift()!;
		const used = Math.min(q, left[p]);
		turns.push({ p, start: now, end: now + (full ? q : used) });
		now += full ? q : used;
		left[p] -= used;
		if (left[p] > 0) queue.push(p);
		else ends[p] = now;
	}
	return { turns, ends };
}

const P = (i: number) => `P_${i + 1}`;
const ms = (x: number) => pw(x, 'ms');

function drawProcesses(rng: Rng): { bursts: number[]; q: number } {
	for (;;) {
		const q = rng.int(2, 5);
		const bursts = [0, 1, 2].map(() => rng.int(1, 12));
		const { turns } = roundRobin(bursts, q);
		if (turns.length >= 4 && turns.length <= 8 && bursts.some((b) => b > q)) return { bursts, q };
	}
}

function rrProblem(bursts: number[], q: number, question: string): string {
	const rows = bursts.map((b, i) => `${P(i)} & ${withUnit(b, 'ms')}`).join(' \\\\ ');
	const table = `\\begin{array}{c|c} \\text{processo} & \\text{tempo di CPU} \\\\ \\hline ${rows} \\end{array}`;
	return textBlock(`Tre processi sono nella coda dei pronti, nell'ordine della tabella, dall'istante $0$. Lo scheduler usa il round robin con un quanto di ${ms(q)}. ${question}`, 46, [table]);
}

function rrSteps(bursts: number[], q: number): string[] {
	const left = [...bursts];
	return roundRobin(bursts, q).turns.map((turn) => {
		left[turn.p] -= turn.end - turn.start;
		return textBlock(`$${P(turn.p)}$ lavora da $${turn.start}$ a $${turn.end}$ ${left[turn.p] > 0 ? `e gli restano ${ms(left[turn.p])}` : 'e finisce'}.`);
	});
}

function rrCheck(sample: Sample): string[] {
	const { bursts, q } = sample.params as { bursts: number[]; q: number };
	const v: string[] = [];
	if (bursts.length !== 3 || bursts.some((b) => b < 1 || b > 12)) v.push('tre processi con tempi da 1 a 12 ms');
	if (q < 2 || q > 5) v.push('quanto da 2 a 5 ms');
	if (!bursts.some((b) => b > q)) v.push('almeno un processo deve chiedere più di un quanto');
	const n = roundRobin(bursts, q).turns.length;
	if (n < 4 || n > 8) v.push('da 4 a 8 turni');
	return v;
}

function level4(rng: Rng): Built {
	const { bursts, q } = drawProcesses(rng);
	const right = roundRobin(bursts, q).turns.map((x) => x.p);
	const seq = (xs: number[]) => ({ latex: xs.map(P).join(',\\ '), values: [xs.map((x) => x + 1).join('-')] });
	const cycle = right.map((_, i) => i % 3);
	const merged = right.filter((p, i) => i === 0 || right[i - 1] !== p);
	const wrong = [cycle, merged, [0, 1, 2], right.slice(0, -1), ...[q + 1, q - 1, q + 2].filter((x) => x >= 1).map((x) => roundRobin(bursts, x).turns.map((y) => y.p)), [...right, right[right.length - 1]]];
	return {
		prompt: 'Trova la sequenza dei turni del round robin.',
		problem: rrProblem(bursts, q, 'Qual è la sequenza dei turni?'),
		solution: seq(right).latex,
		steps: [...rrSteps(bursts, q), textBlock('Chi non ha finito torna in fondo alla coda; chi ha finito non rientra.')],
		answer: choose(
			rng,
			seq(right),
			wrong.filter((w) => w.length <= 8).map(seq),
		),
		params: { case: `${right.length} turni`, bursts, q },
	};
}

function level5(rng: Rng): Built {
	const { bursts, q } = drawProcesses(rng);
	const k = rng.int(0, 2);
	const { ends } = roundRobin(bursts, q);
	const full = roundRobin(bursts, q, true).ends[k];
	const fcfs = bursts.slice(0, k + 1).reduce((a, b) => a + b, 0);
	const e = ends[k];
	const { answer, params } = numberAnswer(e, [full, fcfs, bursts[k], ...shuffle(rng, [e + q, e - q, e + 1, e - 1, e + 2])], 'ms');
	return {
		prompt: "Trova l'istante in cui finisce il processo.",
		problem: rrProblem(bursts, q, `A quale istante finisce $${P(k)}$?`),
		solution: withUnit(e, 'ms'),
		steps: [...rrSteps(bursts, q), textBlock(`$${P(k)}$ finisce all'istante ${ms(e)}.`)],
		answer,
		params: { ...params, bursts, q, k: k + 1 },
	};
}

function level6(rng: Rng): Built {
	const { bursts, q } = drawProcesses(rng);
	const k = rng.int(0, 2);
	const { ends, turns } = roundRobin(bursts, q);
	const e = ends[k];
	const wait = e - bursts[k];
	if (wait === 0) throw new Error('no wait');
	const fcfs = bursts.slice(0, k).reduce((a, b) => a + b, 0);
	const first = turns.find((x) => x.p === k)!.start;
	const full = roundRobin(bursts, q, true).ends[k] - bursts[k];
	const { answer, params } = numberAnswer(wait, [e, fcfs, first, full, ...shuffle(rng, [wait + q, wait - q, wait + 1, wait - 1, wait + 2])], 'ms');
	return {
		prompt: 'Trova il tempo che il processo passa in coda.',
		problem: rrProblem(bursts, q, `Per quanto tempo in tutto $${P(k)}$ resta in coda, pronto, senza usare la CPU?`),
		solution: withUnit(wait, 'ms'),
		steps: [...rrSteps(bursts, q), textBlock(`$${P(k)}$ finisce all'istante ${ms(e)} e ha usato la CPU per ${ms(bursts[k])}: è rimasto in coda per $${e} - ${bursts[k]} = ${wait}\\,\\text{ms}$.`)],
		answer,
		params: { ...params, bursts, q, k: k + 1 },
	};
}

export default makeGenerator(ID, 'Processi, thread e multitasking', {
	1: { label: 'Lo stato di un processo', constraints: ['una situazione: pronto, in esecuzione, in attesa o terminato'], make: level1 },
	2: { label: 'Uno stato, un evento', constraints: ['uno stato di partenza e un evento possibile da quello stato: lo stato di arrivo'], make: level2 },
	3: { label: 'Una sequenza di eventi', constraints: ['un processo appena creato e da 3 a 5 eventi possibili, la fine solo come ultimo'], make: level3 },
	4: { label: 'I turni del round robin', constraints: ['tre processi da 1 a 12 ms, quanto da 2 a 5 ms, da 4 a 8 turni, almeno un processo oltre il quanto'], make: level4, check: rrCheck },
	5: { label: "L'istante di fine", constraints: ['gli stessi vincoli del livello 4; si chiede la fine di uno dei tre processi'], make: level5, check: rrCheck },
	6: { label: 'Il tempo in coda', constraints: ['gli stessi vincoli del livello 4; tempo in coda = fine meno tempo di CPU, maggiore di zero'], make: level6, check: rrCheck },
});
