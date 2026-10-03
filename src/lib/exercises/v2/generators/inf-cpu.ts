/**
 * La CPU e il ciclo di esecuzione delle istruzioni. Spec: specs/exercises/inf-cpu.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/14-inf-cpu.md): the part of the CPU that does a
 * job; the accumulator at the end of a short program in the lesson's invented machine language (CARICA, SOMMA,
 * SOTTRAI, SALVA, FERMA); the program counter and the instruction register after some cycles; a cell that is
 * rewritten while the program runs; instructions per second from the clock frequency; time and cores.
 *
 * Programs are built backwards from the data, run by `run` below, and shown as a table of cells.
 */
import type { Rng } from '../types';
import { type Built, type Level, choose, makeGenerator, nm, num, numberAnswer, opt, shuffle, t, textBlock } from '../inf-architettura';

export const ID = 'inf-cpu';

// ---------------------------------------------------------------------------
// The machine

export type Op = 'CARICA' | 'SOMMA' | 'SOTTRAI' | 'SALVA' | 'FERMA';
export interface Instr {
	op: Op;
	addr?: number;
}

const show = (i: Instr) => (i.op === 'FERMA' ? 'FERMA' : `${i.op} ${i.addr}`);

interface State {
	acc: number;
	pc: number;
	ir: Instr | null;
	mem: Map<number, number>;
	/** The accumulator after each executed instruction. */
	trace: number[];
	ok: boolean;
}

/** Runs `cycles` cycles (or to FERMA) from cell `start`. With `stale`, reads see the cells as they were at the beginning. */
export function run(program: Instr[], start: number, data: Map<number, number>, cycles = Infinity, stale = false): State {
	const mem = new Map(data);
	const s: State = { acc: 0, pc: start, ir: null, mem, trace: [], ok: true };
	for (let n = 0; n < cycles; n++) {
		const i = program[s.pc - start];
		if (!i) {
			s.ok = false;
			break;
		}
		s.ir = i;
		s.pc++;
		const read = () => (stale ? data : mem).get(i.addr!) ?? 0;
		if (i.op === 'CARICA') s.acc = read();
		else if (i.op === 'SOMMA') s.acc += read();
		else if (i.op === 'SOTTRAI') s.acc -= read();
		else if (i.op === 'SALVA') mem.set(i.addr!, s.acc);
		if (s.acc < 0) s.ok = false;
		s.trace.push(s.acc);
		if (i.op === 'FERMA') break;
	}
	return s;
}

/** The memory as a table: the program from `start`, a rule, the data cells. */
function table(program: Instr[], start: number, data: Map<number, number>): string {
	const prog = program.map((i, k) => `${start + k} & ${t(show(i))}`);
	const cells = [...data.entries()].sort((a, b) => a[0] - b[0]).map(([a, v]) => `${a} & ${num(v)}`);
	// in the order of the addresses, with a rule between the program and the data
	const [first, second] = start < Math.min(...data.keys()) ? [prog, cells] : [cells, prog];
	const rows = [...first, ...second.map((r, k) => (k === 0 ? `\\hline ${r}` : r))];
	return `\\begin{array}{c|l} ${t('cella')} & ${t('contenuto')} \\\\ \\hline ${rows.join(' \\\\ ')} \\end{array}`;
}

const I = (op: Op, addr?: number): Instr => ({ op, addr });

/** Data cells from a base address: `n` cells with values, then `extra` cells that hold 0. */
function dataCells(rng: Rng, values: number[], extra: number): { base: number; data: Map<number, number> } {
	const base = rng.pick([10, 12, 16, 20, 24, 30, 32, 40, 48, 50, 60]);
	const data = new Map<number, number>();
	values.forEach((v, k) => data.set(base + k, v));
	for (let k = 0; k < extra; k++) data.set(base + values.length + k, 0);
	return { base, data };
}

// ---------------------------------------------------------------------------
// Level 1: the parts of the CPU

export const PARTS = ['Unità di controllo', 'ALU', 'Contatore di programma', 'Registro istruzioni', 'Accumulatore'] as const;
type Part = (typeof PARTS)[number];

const PART_WHY: Record<Part, string> = {
	'Unità di controllo': "L'unità di controllo dirige il lavoro: preleva l'istruzione, la decodifica e comanda le altre parti. Non fa calcoli.",
	ALU: 'La ALU fa i calcoli e i confronti.',
	'Contatore di programma': "Il contatore di programma contiene l'indirizzo della prossima istruzione da prelevare.",
	'Registro istruzioni': "Il registro istruzioni contiene l'istruzione che la CPU sta eseguendo.",
	Accumulatore: "L'accumulatore contiene il numero su cui la CPU sta lavorando, e riceve il risultato dei calcoli.",
};

function level1(rng: Rng): Built {
	const part = rng.pick(PARTS);
	const a = rng.int(10, 39);
	const p = rng.int(0, 9);
	let op: Op;
	let question: string;
	if (part === 'ALU') {
		op = rng.pick(['SOMMA', 'SOTTRAI'] as const);
		question = `La CPU esegue l'istruzione ${op} ${a}. Quale parte della CPU calcola la ${op === 'SOMMA' ? 'somma' : 'differenza'}?`;
	} else if (part === 'Registro istruzioni') {
		op = rng.pick(['CARICA', 'SOMMA', 'SOTTRAI', 'SALVA'] as const);
		question = rng.pick([`Quale parte della CPU contiene l'istruzione ${op} ${a} mentre la CPU la esegue?`, `La CPU ha appena prelevato dalla memoria l'istruzione ${op} ${a}. In quale parte della CPU è stata copiata?`]);
	} else if (part === 'Contatore di programma') {
		op = rng.pick(['CARICA', 'SOMMA', 'SOTTRAI', 'SALVA'] as const);
		question = rng.pick([
			`L'istruzione ${op} ${a} si trova nella cella $${p}$. Quale parte della CPU contiene il numero $${p + 1}$ mentre la CPU la esegue?`,
			`La CPU esegue l'istruzione ${op} ${a}. Quale parte della CPU contiene l'indirizzo dell'istruzione da prelevare subito dopo?`,
		]);
	} else if (part === 'Accumulatore') {
		op = rng.pick(['CARICA', 'SOMMA', 'SOTTRAI', 'SALVA'] as const);
		question =
			op === 'CARICA'
				? `La CPU ha appena eseguito l'istruzione CARICA ${a}. Quale parte della CPU contiene ora una copia del numero della cella $${a}$?`
				: op === 'SALVA'
					? `La CPU esegue l'istruzione SALVA ${a}. Da quale parte della CPU viene il numero che finisce nella cella $${a}$?`
					: `La CPU ha appena eseguito l'istruzione ${op} ${a}. Quale parte della CPU contiene ora il risultato del calcolo?`;
	} else {
		op = rng.pick(['CARICA', 'SOMMA', 'SOTTRAI', 'SALVA'] as const);
		question = rng.pick([
			`L'istruzione ${op} ${a} è nel registro istruzioni. Quale parte della CPU la esamina per riconoscere l'operazione e l'indirizzo?`,
			`La CPU esegue l'istruzione ${op} ${a}. Quale parte della CPU manda i comandi alle altre parti?`,
			`La CPU ha finito di eseguire l'istruzione ${op} ${a}. Quale parte della CPU fa partire il prelievo dell'istruzione successiva?`,
		]);
	}
	const others = shuffle(
		rng,
		PARTS.filter((x) => x !== part),
	).slice(0, 3);
	return {
		prompt: 'Scegli la parte della CPU.',
		problem: textBlock(question),
		solution: opt(part).latex,
		steps: [textBlock(PART_WHY[part])],
		answer: choose(
			rng,
			opt(part),
			others.map((x) => opt(x)),
		),
		params: { case: part, op, addr: a },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the accumulator at the end

type Shape = 'somma' | 'sottrai' | 'somma-somma' | 'somma-sottrai' | 'sottrai-somma';
const SHAPES: Record<Shape, Op[]> = {
	somma: ['SOMMA'],
	sottrai: ['SOTTRAI'],
	'somma-somma': ['SOMMA', 'SOMMA'],
	'somma-sottrai': ['SOMMA', 'SOTTRAI'],
	'sottrai-somma': ['SOTTRAI', 'SOMMA'],
};

/** CARICA, one or two operations on the following cells in a shuffled order, SALVA, FERMA. */
function straight(rng: Rng, shape: Shape): { program: Instr[]; base: number; data: Map<number, number> } {
	const ops = SHAPES[shape];
	const values = Array.from({ length: ops.length + 1 }, () => rng.int(2, 60));
	const { base, data } = dataCells(rng, values, 1);
	const order = shuffle(
		rng,
		values.map((_, k) => base + k),
	);
	const program = [I('CARICA', order[0]), ...ops.map((op, k) => I(op, order[k + 1])), I('SALVA', base + values.length), I('FERMA')];
	return { program, base, data };
}

function level2(rng: Rng): Built {
	const shape = rng.pick(Object.keys(SHAPES) as Shape[]);
	const { program, data } = straight(rng, shape);
	const end = run(program, 0, data);
	if (!end.ok) return level2(rng);
	const acc = end.acc;
	const values = [...data.values()];
	const first = end.trace[0];
	const before = end.trace[end.trace.length - 4] ?? first; // before the last calculation
	const { answer, distractors } = numberAnswer(acc, [
		0, // "SALVA empties the accumulator"
		program.length > 4 ? end.trace[1] : first, // the last calculation forgotten
		first,
		values.reduce((a, b) => a + b, 0), // everything added
		before,
		Math.abs(2 * first - acc), // sum and difference swapped
	]);
	const names = { CARICA: 'copia', SOMMA: 'somma', SOTTRAI: 'sottrae' } as const;
	const steps: string[] = [];
	let prev = 0;
	program.forEach((i, k) => {
		const v = data.get(i.addr ?? -1) ?? 0;
		if (i.op === 'CARICA') steps.push(textBlock(`CARICA ${i.addr} ${names.CARICA} nell'accumulatore il contenuto della cella $${i.addr}$: $${v}$.`));
		else if (i.op === 'SOMMA') steps.push(textBlock(`SOMMA ${i.addr} somma il contenuto della cella $${i.addr}$: $${prev} + ${v} = ${end.trace[k]}$.`));
		else if (i.op === 'SOTTRAI') steps.push(textBlock(`SOTTRAI ${i.addr} sottrae il contenuto della cella $${i.addr}$: $${prev} - ${v} = ${end.trace[k]}$.`));
		else if (i.op === 'SALVA') steps.push(textBlock(`SALVA ${i.addr} copia $${acc}$ nella cella $${i.addr}$: l'accumulatore resta $${acc}$.`));
		prev = end.trace[k];
	});
	return {
		prompt: "Segui il programma e trova il contenuto dell'accumulatore.",
		problem: textBlock("La memoria contiene questo programma, che parte dalla cella $0$, e i suoi dati. Quale numero c'è nell'accumulatore quando il programma si ferma?", [table(program, 0, data)]),
		solution: num(acc),
		steps,
		answer,
		params: { case: shape, distractors },
	};
}

// ---------------------------------------------------------------------------
// Level 3: program counter and instruction register

function level3(rng: Rng): Built {
	const shape = rng.pick(['somma-somma', 'somma-sottrai', 'sottrai-somma'] as const);
	const { program, data } = straight(rng, shape); // five instructions
	const start = rng.pick([0, 0, 4, 8, 20, 100]);
	const base = Math.min(...data.keys());
	// keep the data away from the program
	if (start <= base + data.size - 1 && base <= start + program.length - 1) return level3(rng);
	if (!run(program, start, data).ok) return level3(rng);
	const kind = rng.pick(['pc-dopo', 'pc-durante', 'ir'] as const);
	const intro = `La memoria contiene questo programma, che parte dalla cella $${start}$, e i suoi dati.`;
	const tab = [table(program, start, data)];
	if (kind === 'pc-dopo') {
		const k = rng.int(1, 4);
		const pc = start + k;
		const { answer, distractors } = numberAnswer(pc, [pc - 1, k, pc + 1, program[k - 1].addr ?? pc + 2]);
		return {
			prompt: 'Trova il contenuto del contatore di programma.',
			problem: textBlock(`${intro} La CPU ha completato ${k === 1 ? 'il primo ciclo' : `i primi $${k}$ cicli`} di esecuzione. Quale numero c'è nel contatore di programma?`, tab),
			solution: num(pc),
			steps: [textBlock(`Il contatore di programma parte da $${start}$ e aumenta di $1$ a ogni prelievo.`), textBlock(`Dopo $${k}$ ${k === 1 ? 'prelievo' : 'prelievi'} contiene $${start} + ${k} = ${pc}$, l'indirizzo della prossima istruzione.`)],
			answer,
			params: { case: kind, distractors },
		};
	}
	if (kind === 'pc-durante') {
		const p = start + rng.int(0, 3);
		const { answer, distractors } = numberAnswer(p + 1, [p, p + 2, program[p - start].addr ?? p + 3]);
		return {
			prompt: 'Trova il contenuto del contatore di programma.',
			problem: textBlock(`${intro} La CPU sta eseguendo l'istruzione della cella $${p}$. Quale numero c'è nel contatore di programma?`, tab),
			solution: num(p + 1),
			steps: [textBlock('Il contatore di programma aumenta di $1$ già nella fase di prelievo.'), textBlock(`Durante l'esecuzione dell'istruzione della cella $${p}$ contiene $${p} + 1 = ${p + 1}$.`)],
			answer,
			params: { case: kind, distractors },
		};
	}
	const k = rng.int(1, 4);
	const right = program[k - 1];
	const next = program[k];
	const rest = shuffle(
		rng,
		program.filter((i) => i !== right && i !== next),
	);
	return {
		prompt: 'Trova il contenuto del registro istruzioni.',
		problem: textBlock(`${intro} La CPU ha completato ${k === 1 ? 'il primo ciclo' : `i primi $${k}$ cicli`} di esecuzione. Quale istruzione c'è nel registro istruzioni?`, tab),
		solution: t(show(right)),
		steps: [
			textBlock(`In $${k}$ ${k === 1 ? 'ciclo la CPU ha prelevato ed eseguito l\'istruzione della cella' : 'cicli la CPU ha prelevato ed eseguito le istruzioni dalla cella'} $${start}$${k === 1 ? '' : ` alla cella $${start + k - 1}$`}.`),
			textBlock(`Il registro istruzioni contiene l'ultima prelevata, quella della cella $${start + k - 1}$. Quella della cella $${start + k}$ non è ancora stata prelevata.`),
		],
		answer: choose(
			rng,
			opt(show(right)),
			[next, ...rest].map((i) => opt(show(i))),
		),
		params: { case: kind },
	};
}

// ---------------------------------------------------------------------------
// Level 4: a cell rewritten while the program runs

type Rewrite = 'raddoppia' | 'scambia' | 'copia' | 'differenza';

function rewriting(rng: Rng, form: Rewrite): { program: Instr[]; data: Map<number, number>; ask: number[] } {
	const x = rng.int(2, 40);
	const y = rng.int(2, 40);
	const { base, data } = dataCells(rng, [x, y], 1);
	const [X, Y, Z] = [base, base + 1, base + 2];
	switch (form) {
		case 'raddoppia': // X becomes x + y, then Z = 2(x + y)
			return { program: [I('CARICA', X), I('SOMMA', Y), I('SALVA', X), I('SOMMA', X), I('SALVA', Z), I('FERMA')], data, ask: [Z] };
		case 'scambia': // Y becomes x + y, then Z = x + (x + y) + y - x = x + 2y
			return { program: [I('CARICA', X), I('SOMMA', Y), I('SALVA', Y), I('SOMMA', Y), I('SOTTRAI', X), I('SALVA', Z), I('FERMA')], data, ask: [Z] };
		case 'copia': // Y becomes x, then Z = 2x
			return { program: [I('CARICA', X), I('SALVA', Y), I('SOMMA', Y), I('SALVA', Z), I('FERMA')], data, ask: [Z, Y] };
		default: // X becomes x - y, then Z = y + (x - y)
			return { program: [I('CARICA', X), I('SOTTRAI', Y), I('SALVA', X), I('CARICA', Y), I('SOMMA', X), I('SALVA', Z), I('FERMA')], data, ask: [Z, X] };
	}
}

function level4(rng: Rng): Built {
	const form = rng.pick(['raddoppia', 'scambia', 'copia', 'differenza'] as const);
	const { program, data, ask } = rewriting(rng, form);
	const end = run(program, 0, data);
	const stale = run(program, 0, data, Infinity, true);
	const cell = rng.pick(ask);
	const value = end.mem.get(cell)!;
	const wrong = stale.mem.get(cell)!;
	if (!end.ok || !stale.ok || (value === wrong && cell === ask[0])) return level4(rng);
	const { answer, distractors } = numberAnswer(value, [wrong, data.get(cell)!, end.acc, [...data.values()].reduce((a, b) => a + b, 0), 0]);
	const steps: string[] = [];
	const mem = new Map(data);
	let acc = 0;
	for (const i of program) {
		if (i.op === 'FERMA') break;
		const v = mem.get(i.addr!)!;
		if (i.op === 'CARICA') {
			acc = v;
			steps.push(textBlock(`CARICA ${i.addr}: la cella $${i.addr}$ contiene ora $${v}$, e l'accumulatore diventa $${acc}$.`));
		} else if (i.op === 'SOMMA') {
			steps.push(textBlock(`SOMMA ${i.addr}: la cella $${i.addr}$ contiene ora $${v}$, e l'accumulatore diventa $${acc} + ${v} = ${acc + v}$.`));
			acc += v;
		} else if (i.op === 'SOTTRAI') {
			steps.push(textBlock(`SOTTRAI ${i.addr}: la cella $${i.addr}$ contiene ora $${v}$, e l'accumulatore diventa $${acc} - ${v} = ${acc - v}$.`));
			acc -= v;
		} else {
			mem.set(i.addr!, acc);
			steps.push(textBlock(`SALVA ${i.addr}: nella cella $${i.addr}$ viene scritto $${acc}$, al posto di $${v}$.`));
		}
	}
	steps.push(textBlock(`Alla fine la cella $${cell}$ contiene $${value}$.`));
	return {
		prompt: 'Segui il programma e trova il contenuto della cella.',
		problem: textBlock(`La memoria contiene questo programma, che parte dalla cella $0$, e i suoi dati. Quale numero c'è nella cella $${cell}$ quando il programma si ferma?`, [table(program, 0, data)]),
		solution: num(value),
		steps,
		answer,
		params: { case: form, cell, distractors },
	};
}

// ---------------------------------------------------------------------------
// Level 5: instructions per second

export const HZ = { kHz: 1000, MHz: 1_000_000, GHz: 1_000_000_000 } as const;
type Unit = keyof typeof HZ;

function level5(rng: Rng): Built {
	const unit = rng.pick(['kHz', 'MHz', 'GHz'] as const) as Unit;
	const v = unit === 'GHz' ? rng.int(1, 5) : rng.pick([1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 32, 40, 50]);
	const c = rng.pick([2, 4, 5, 8, 10]);
	const f = v * HZ[unit];
	const n = f / c;
	if (!Number.isInteger(n)) return level5(rng);
	const { answer, distractors } = numberAnswer(n, [f, n / 1000, n * 10, n / 10, n * 2].filter(Number.isInteger));
	return {
		prompt: 'Calcola quante istruzioni al secondo esegue la CPU.',
		problem: textBlock(`Una CPU ha un clock di $${v}\\,\\text{${unit}}$ e impiega $${c}$ impulsi di clock per ogni istruzione. Quante istruzioni esegue in un secondo? Ricorda che $1\\,\\text{${unit}} = ${num(HZ[unit])}\\,\\text{Hz}$.`),
		solution: num(n),
		steps: [
			textBlock(`La frequenza in hertz: $${v}\\,\\text{${unit}} = ${num(f)}\\,\\text{Hz}$, cioè ${nm(f)} impulsi al secondo.`),
			textBlock(`Ogni istruzione usa $${c}$ impulsi: $${num(f)} : ${c} = ${num(n)}$ istruzioni al secondo.`),
		],
		answer,
		params: { case: unit, distractors },
	};
}

// ---------------------------------------------------------------------------
// Level 6: time and cores

function level6(rng: Rng): Built {
	const rate = rng.pick([1, 2, 4, 5, 8, 25]) * 10 ** rng.int(2, 6);
	if (rng.next() < 0.5) {
		const s = rng.pick([2, 3, 4, 5, 6, 8, 12, 15, 20, 30, 40, 60]);
		const total = rate * s;
		const { answer, distractors } = numberAnswer(s, [s * 10, s % 10 === 0 ? s / 10 : s * 100, s * 2, s + 1]);
		return {
			prompt: 'Calcola il tempo che serve alla CPU.',
			problem: textBlock(`Una CPU esegue ${nm(rate)} istruzioni al secondo. Quanti secondi impiega per eseguire ${nm(total)} istruzioni?`),
			solution: `${s}\\,\\text{s}`,
			steps: [textBlock('Il tempo è il numero di istruzioni diviso per le istruzioni eseguite in un secondo.'), textBlock(`$${num(total)} : ${num(rate)} = ${s}$ secondi.`)],
			answer,
			params: { case: 'tempo', distractors },
		};
	}
	const cores = rng.pick([2, 4, 6, 8]);
	const s = rng.pick([1, 2, 3, 5, 10]);
	const total = cores * rate * s;
	const { answer, distractors } = numberAnswer(total, [rate * s, cores * rate === total ? cores * rate * 10 : cores * rate, rate * (s + cores), total * 10]);
	const when = s === 1 ? 'in un secondo' : `in $${s}$ secondi`;
	return {
		prompt: 'Calcola quante istruzioni esegue al massimo la CPU.',
		problem: textBlock(`Una CPU ha $${cores}$ core, e ogni core esegue ${nm(rate)} istruzioni al secondo. Quante istruzioni può eseguire al massimo la CPU ${when}?`),
		solution: num(total),
		steps: [
			textBlock(`In un secondo i $${cores}$ core insieme eseguono $${cores} \\cdot ${num(rate)} = ${num(cores * rate)}$ istruzioni.`),
			...(s === 1 ? [] : [textBlock(`In $${s}$ secondi: $${s} \\cdot ${num(cores * rate)} = ${num(total)}$ istruzioni.`)]),
			textBlock('È un massimo: si raggiunge se c\'è lavoro per tutti i core.'),
		],
		answer,
		params: { case: 'core', distractors },
	};
}

const LEVELS: Record<number, Level> = {
	1: { label: 'Le parti della CPU', constraints: ["un'istruzione del linguaggio della lezione e un compito: unità di controllo, ALU, contatore di programma, registro istruzioni o accumulatore"], make: level1 },
	2: { label: "L'accumulatore alla fine", constraints: ['CARICA, una o due operazioni tra SOMMA e SOTTRAI, SALVA, FERMA; dati da 2 a 60, accumulatore mai negativo'], make: level2 },
	3: { label: 'Contatore di programma e registro istruzioni', constraints: ['un programma di cinque istruzioni che parte dalla cella 0, 4, 8, 20 o 100; il contatore dopo k cicli o durante una istruzione, il registro istruzioni dopo k cicli'], make: level3 },
	4: { label: 'Una cella che cambia', constraints: ['un programma che scrive in una cella e poi la rilegge; si chiede il contenuto finale di una cella scritta'], make: level4 },
	5: { label: 'Istruzioni al secondo', constraints: ['frequenza in kHz, MHz o GHz con il fattore nel testo, 2, 4, 5, 8 o 10 impulsi per istruzione, risultato intero'], make: level5 },
	6: { label: 'Tempo e core', constraints: ['metà: i secondi per eseguire un numero di istruzioni; metà: le istruzioni al massimo con 2, 4, 6 o 8 core'], make: level6 },
};

export const infCpu = makeGenerator(ID, 'La CPU e il ciclo di esecuzione delle istruzioni', LEVELS);

export default infCpu;
