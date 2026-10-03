/**
 * Informazione, dati e codici. Spec: specs/exercises/inf-informazione-dati.md
 *
 * Six levels in the order of the lesson (docs/lezioni/informatica/riscritte/01-inf-informazione-dati.md): data and
 * information; encoding a word with a table of 2-bit code words; decoding a sequence with a table of 3-bit code
 * words; how many sequences n bits give; how many bits N things need; analog or digital.
 *
 * Levels 1, 2, 3 and 6 are multiple choices built from interchangeable pieces (topics, code tables, words,
 * objects); levels 4 and 5 have a number as the answer, built backwards from the exponent, and a choice whose
 * distractors are the mistakes of the lesson (2n for 2^n, one bit per thing, the power before).
 */
import type { Answer, ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { pickDistinct, shuffle, textBlock } from '../insiemi';
import { q } from '../rational';
import { BANNED, NAMES, checkChoice, choose, int, numOpt, t, textOpt } from '../inf-informazione';

export const ID = 'inf-informazione-dati';

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: Answer;
	params: Record<string, unknown>;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------------------------------------------------------------------------
// Level 1: data and information

interface Topic {
	id: string;
	dato: string; // the bare value, written between “ ”
	info: string; // a sentence that gives it a meaning
}

function topics(rng: Rng, N: string): Topic[] {
	const febbre = rng.pick(['37,5', '38', '38,5', '39']);
	const voto = rng.int(4, 9);
	const materia = rng.pick(['storia', 'inglese', 'scienze', 'matematica']);
	const ora = rng.pick(['7:45', '14:30', '16:10', '18:25']);
	const binario = rng.int(11, 24);
	const prezzo = rng.pick(['2,80', '3,50', '4,50', '5,20']);
	const [data, giorno] = rng.pick([
		['03/10', '3 ottobre'],
		['15/11', '15 novembre'],
		['21/01', '21 gennaio'],
		['09/05', '9 maggio'],
	]);
	const nota = rng.pick(['MI', 'RE', 'LA', 'SOL']);
	const colore = rng.pick(['rosso', 'verde', 'giallo']);
	const altezza = rng.int(150, 190);
	const passi = rng.int(500, 999) * 10;
	const pagina = rng.int(30, 140);
	return [
		{ id: 'febbre', dato: febbre, info: `La temperatura di ${N} è di ${febbre} gradi` },
		{ id: 'voto', dato: String(voto), info: `${N} ha preso ${voto} in ${materia}` },
		{ id: 'ora', dato: ora, info: `Il treno di ${N} parte alle ${ora}` },
		{ id: 'binario', dato: String(binario), info: `Il treno parte dal binario ${binario}` },
		{ id: 'prezzo', dato: prezzo, info: `Il panino costa ${prezzo} euro` },
		{ id: 'data', dato: data, info: `La verifica è il ${giorno}` },
		{ id: 'nota', dato: nota, info: `La prossima nota da suonare è un ${nota}` },
		{ id: 'colore', dato: colore, info: `Il semaforo è ${colore}` },
		{ id: 'altezza', dato: String(altezza), info: `L'altezza di ${N} è di ${altezza} centimetri` },
		{ id: 'passi', dato: String(passi), info: `Oggi ${N} ha fatto ${passi} passi` },
		{ id: 'pagina', dato: String(pagina), info: `I compiti sono a pagina ${pagina}` },
	];
}

interface Process {
	sys: string;
	input: string;
	op: string;
	opNoun: string;
	out: string;
}

function processes(N: string): Process[] {
	return [
		{ sys: 'Il registro elettronico', input: `i voti di ${N} in matematica`, op: 'calcola la media', opNoun: 'il calcolo della media', out: `la media di ${N}` },
		{ sys: "L'app contapassi", input: `i passi fatti da ${N} in ogni giorno della settimana`, op: 'li somma', opNoun: 'la somma dei passi', out: 'il totale dei passi della settimana' },
		{ sys: 'La cassa del supermercato', input: `i prezzi dei prodotti comprati da ${N}`, op: 'li somma', opNoun: 'la somma dei prezzi', out: 'il totale da pagare' },
		{ sys: 'La stazione meteo', input: 'le temperature misurate ogni ora', op: 'cerca la più alta', opNoun: 'la ricerca della temperatura più alta', out: 'la temperatura massima della giornata' },
		{ sys: 'Il cronometro della pista', input: `i tempi dei giri di ${N}`, op: 'cerca il più basso', opNoun: 'la ricerca del tempo più basso', out: `il giro più veloce di ${N}` },
		{ sys: 'Il sito del torneo', input: 'i punti fatti da ogni squadra nelle partite', op: 'li somma e ordina le squadre', opNoun: 'la somma dei punti con il riordino delle squadre', out: 'la classifica del torneo' },
		{ sys: "L'app della biblioteca", input: `le date dei prestiti di ${N}`, op: "conta quelli di quest'anno", opNoun: 'il conteggio dei prestiti', out: `il numero di libri presi da ${N} quest'anno` },
		{ sys: 'Il registro elettronico', input: `le presenze di ${N} giorno per giorno`, op: 'conta i giorni in cui manca', opNoun: 'il conteggio dei giorni di assenza', out: `il numero di assenze di ${N}` },
	];
}

export const ROLES = ['I dati in ingresso', "L'elaborazione", "L'informazione ottenuta", 'Il codice'] as const;

function level1(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const u = rng.next();
	if (u < 0.6) {
		const findInfo = u < 0.3;
		const [right, ...rest] = shuffle(rng, topics(rng, N));
		const dato = (x: Topic) => textOpt(`“${x.dato}”`, `dato:${x.id}`);
		const info = (x: Topic) => textOpt(x.info, `info:${x.id}`);
		const choice = findInfo ? choose(rng, info(right), rest.map(dato)) : choose(rng, dato(right), rest.map(info));
		return {
			prompt: findInfo ? "Riconosci l'informazione." : 'Riconosci il dato.',
			problem: textBlock(findInfo ? "Quale di queste è un'informazione, e non soltanto un dato?" : "Quale di questi è soltanto un dato, e non un'informazione?"),
			solution: choice.options[choice.correct].latex,
			steps: [
				textBlock(
					findInfo
						? `La frase dice a che cosa si riferisce il valore “${right.dato}”: è un'informazione. Le altre opzioni sono valori da soli, senza significato: sono dati.`
						: `“${right.dato}” è un valore da solo: non si sa a che cosa si riferisce, quindi è soltanto un dato. Le altre opzioni dicono a che cosa si riferisce il loro valore: sono informazioni.`,
				),
			],
			answer: choice,
			params: { case: findInfo ? 'trova-informazione' : 'trova-dato', topic: right.id, name: N },
		};
	}
	const all = processes(N);
	const s = rng.int(0, all.length - 1);
	const P = all[s];
	const role = rng.int(0, 2);
	const question = [`Che cosa sono ${P.input} per questa operazione?`, `Che cos'è ${P.opNoun}?`, `Che cos'è ${P.out}?`][role];
	const why = [
		`${cap(P.input)} sono i valori da cui si parte: sono i dati in ingresso.`,
		`${cap(P.opNoun)} è l'operazione che dai dati ricava qualcosa di nuovo: è l'elaborazione.`,
		`${cap(P.out)} è quello che si viene a sapere alla fine, e che prima non si leggeva da nessuna parte: è l'informazione ottenuta.`,
	][role];
	const others = ROLES.filter((_, i) => i !== role).map((x) => textOpt(x));
	return {
		prompt: 'Riconosci dati, elaborazione e informazione.',
		problem: textBlock(`${P.sys} prende ${P.input}, ${P.op} e mostra ${P.out}. ${question}`),
		solution: t(ROLES[role]),
		steps: [textBlock(why)],
		answer: choose(rng, textOpt(ROLES[role]), others),
		params: { case: 'ruolo', process: s, role, name: N },
	};
}

// ---------------------------------------------------------------------------
// Levels 2 and 3: encoding and decoding with a table

const SETS2: { letters: string; words: string[] }[] = [
	{ letters: 'ACOS', words: ['CASA', 'COSA', 'CASO', 'OSSA', 'ASSO', 'SACCO', 'CASSA', 'SASSO', 'COCCO', 'CACAO', 'OCA', 'OSSO'] },
	{ letters: 'AELM', words: ['MELA', 'LAMA', 'MALE', 'LAME', 'MAMMA', 'MELMA', 'LEMMA', 'ALA', 'MELE'] },
	{ letters: 'ANOT', words: ['NOTA', 'TANA', 'NATO', 'ANNO', 'OTTO', 'TONO', 'NONNA', 'TONNO', 'TANTO', 'NONNO'] },
];

const SETS3: { letters: string; words: string[] }[] = [
	{ letters: 'AELMRT', words: ['MARE', 'TELA', 'META', 'RAME', 'ARTE', 'TEMA', 'MELA', 'ALTA', 'TERRA', 'MERLA', 'TRAMA', 'MALTA', 'LATTE', 'ALTRE', 'MARTE', 'REALE'] },
	{ letters: 'AINOPS', words: ['PINO', 'NASO', 'OASI', 'SPIA', 'POSA', 'PISA', 'PASSO', 'SPINA', 'PIANO', 'NONNA', 'PANNA', 'SONNO', 'PASSI', 'SOSIA'] },
	{ letters: 'CEIORS', words: ['ROSE', 'CERO', 'RISO', 'ORSO', 'ORCO', 'CERI', 'CORSO', 'CROCE', 'SERIO', 'CORSE', 'ROSSO', 'RICCO', 'SIERO'] },
];

const bits = (k: number, n: number) => k.toString(2).padStart(n, '0');

/** A random code: each letter gets a different word of `n` bits. */
function makeCode(rng: Rng, letters: string, n: number): Record<string, string> {
	const words = pickDistinct(
		rng,
		Array.from({ length: 2 ** n }, (_, k) => bits(k, n)),
		letters.length,
	);
	return Object.fromEntries([...letters].map((l, i) => [l, words[i]]));
}

const tableTex = (letters: string, code: Record<string, string>) =>
	`\\begin{array}{${[...letters].map(() => 'c').join('|')}} ${[...letters].map((l) => t(l)).join(' & ')} \\\\ \\hline ${[...letters].map((l) => code[l]).join(' & ')} \\end{array}`;

const encode = (word: string, code: Record<string, string>) => [...word].map((l) => code[l]).join('');
const seqOpt = (s: string): ChoiceOption => ({ latex: s, values: [s] });

function level2(rng: Rng): Built {
	const S = rng.pick(SETS2);
	const code = makeCode(rng, S.letters, 2);
	const word = rng.pick(S.words);
	const right = encode(word, code);
	const flip = (b: string) => [...b].reverse().join('');
	// each letter with the code of the next column; the bits of each group read backwards; one letter wrong
	const next: Record<string, string> = Object.fromEntries([...S.letters].map((l, i) => [l, code[S.letters[(i + 1) % S.letters.length]]]));
	const reversed: Record<string, string> = Object.fromEntries([...S.letters].map((l) => [l, flip(code[l])]));
	const at = rng.int(0, word.length - 1);
	const other = rng.pick([...S.letters].filter((l) => l !== word[at]));
	const oneWrong = [...word].map((l, i) => code[i === at ? other : l]).join('');
	const sameLength = shuffle(
		rng,
		S.words.filter((w) => w.length === word.length && w !== word),
	).map((w) => encode(w, code));
	const others = [oneWrong, ...shuffle(rng, [encode(word, next), encode(word, reversed)]), ...sameLength, flip(right)];
	return {
		prompt: 'Codifica la parola con il codice della tabella.',
		problem: textBlock(`Un codice binario associa a ogni lettera una sequenza di 2 bit, come nella tabella. Qual è la codifica della parola ${word}?`, 46, [tableTex(S.letters, code)]),
		solution: right,
		steps: [textBlock(`Sostituisci ogni lettera con la sua sequenza: ${[...word].map((l) => `${l} diventa ${code[l]}`).join(', ')}.`), textBlock(`Scrivi le sequenze una dopo l'altra, nell'ordine delle lettere: $${right}$.`)],
		answer: choose(rng, seqOpt(right), others.map(seqOpt)),
		params: { case: 'codifica', letters: S.letters, code, word },
	};
}

function level3(rng: Rng): Built {
	const S = rng.pick(SETS3);
	const code = makeCode(rng, S.letters, 3);
	const word = rng.pick(S.words);
	const seq = encode(word, code);
	const groups = [...word].map((l) => code[l]);
	const at = rng.int(0, word.length - 1);
	const near = shuffle(
		rng,
		[...S.letters].filter((l) => l !== word[at]),
	).map((l) => word.slice(0, at) + l + word.slice(at + 1));
	const sameLength = shuffle(
		rng,
		S.words.filter((w) => w.length === word.length && w !== word),
	);
	// one string with a letter read from the wrong column, then real words of the same length
	const others = [near[0], ...sameLength, ...near.slice(1)];
	const wordOpt = (w: string): ChoiceOption => ({ latex: t(w), values: [w] });
	return {
		prompt: 'Decodifica la sequenza con il codice della tabella.',
		problem: textBlock(`Un codice binario associa a ogni lettera una sequenza di 3 bit, come nella tabella. Quale parola è scritta nella sequenza $${seq}$?`, 46, [tableTex(S.letters, code)]),
		solution: t(word),
		steps: [
			textBlock(`Le parole del codice sono lunghe 3 bit: dividi la sequenza in gruppi di 3 a partire da sinistra, $${groups.join('\\ ')}$.`),
			textBlock(`Leggi la tabella al contrario: ${groups.map((g, i) => `${g} è ${word[i]}`).join(', ')}. La parola è ${word}.`),
		],
		answer: choose(rng, wordOpt(word), others.map(wordOpt)),
		params: { case: 'decodifica', letters: S.letters, code, word, sequence: seq },
	};
}

// ---------------------------------------------------------------------------
// Level 4: how many sequences with n bits

const THINGS = ['simboli', 'colori', 'lettere', 'tasti', 'segnali', 'comandi', 'livelli', 'messaggi'];

function level4(rng: Rng): Built {
	const u = rng.next();
	if (u < 0.3) {
		const n = rng.int(2, 12);
		const v = 2 ** n;
		const meanings = rng.next() < 0.5;
		return {
			prompt: 'Conta le sequenze.',
			problem: textBlock(meanings ? `Un codice binario ha parole di ${n} bit. Quante cose diverse può rappresentare al massimo?` : `Quante sequenze diverse si possono scrivere con ${n} bit?`),
			solution: `2^{${n}} = ${int(v)}`,
			steps: [textBlock(`Con $n$ bit le sequenze sono $2^n$: ogni bit in più le raddoppia.`), `2^{${n}} = ${int(v)}`],
			answer: { kind: 'number', value: String(v) },
			params: { case: 'sequenze', n, value: String(v), mistakes: [2 * n, n * n, 2 ** (n - 1), 2 ** (n + 1)].map(String) },
		};
	}
	if (u < 0.7) {
		const n = rng.int(3, 7);
		const k = rng.int(2 ** (n - 1) + 1, 2 ** n - 1);
		const thing = rng.pick(THINGS);
		const v = 2 ** n - k;
		return {
			prompt: 'Conta le sequenze che restano libere.',
			problem: textBlock(`Un codice binario con parole di ${n} bit è usato per rappresentare ${k} ${thing}. Quante sequenze restano senza significato?`),
			solution: `2^{${n}} - ${k} = ${v}`,
			steps: [textBlock(`Con ${n} bit le sequenze sono $2^{${n}} = ${2 ** n}$.`), textBlock(`Ne sono usate ${k}: ne restano $${2 ** n} - ${k} = ${v}$.`)],
			answer: { kind: 'number', value: String(v) },
			params: { case: 'libere', n, k, thing, value: String(v), mistakes: [2 ** n, Math.abs(2 * n - k), 2 ** (n + 1) - k, k - 2 ** (n - 1)].map(String) },
		};
	}
	const n = rng.int(2, 9);
	const d = rng.int(1, 3);
	const x = 2 ** n;
	const v = 2 ** (n + d);
	return {
		prompt: 'Conta le sequenze dopo aver aggiunto dei bit.',
		problem: textBlock(`Con ${n} bit si scrivono ${x} sequenze diverse. Quante se ne scrivono con ${n + d} bit?`),
		solution: `${x} \\cdot ${d === 1 ? '2' : `2^{${d}}`} = ${int(v)}`,
		steps: [
			textBlock(d === 1 ? 'Un bit in più raddoppia il numero di sequenze.' : `I bit in più sono ${d}, e ognuno raddoppia il numero di sequenze: si moltiplica per $2^{${d}} = ${2 ** d}$.`),
			`${x} \\cdot ${2 ** d} = ${int(v)}`,
		],
		answer: { kind: 'number', value: String(v) },
		params: { case: 'bit-in-piu', n, d, value: String(v), mistakes: [x + 2 * d, x + d, x * 2 * d, x * d, x * 2, x * x].map(String) },
	};
}

// ---------------------------------------------------------------------------
// Level 5: how many bits for N things

const COUNTED = [
	'colori di una tavolozza',
	'livelli di un videogioco',
	'studenti di una scuola',
	'canali di un televisore',
	'prodotti di un distributore',
	'libri di una biblioteca',
	'armadietti di una palestra',
	'personaggi di un videogioco',
	'canzoni di una playlist',
	'posti di un teatro',
	'giocatori di un torneo',
];

function level5(rng: Rng): Built {
	const u = rng.next();
	const kind = u < 0.25 ? 'potenza' : u < 0.4 ? 'potenza-piu-uno' : 'generico';
	let N: number;
	if (kind === 'potenza') N = 2 ** rng.int(2, 10);
	else if (kind === 'potenza-piu-uno') N = 2 ** rng.int(2, 9) + 1;
	else {
		for (;;) {
			const e = rng.int(3, 10);
			N = rng.int(2 ** (e - 1) + 2, 2 ** e - 1);
			if (N <= 1000) break;
		}
	}
	let n = 0;
	while (2 ** n < N) n++;
	const thing = rng.pick(COUNTED);
	const below = 2 ** (n - 1);
	const steps =
		kind === 'potenza'
			? [textBlock(`Cerca la più piccola potenza di due maggiore o uguale a ${N}: $2^{${n}} = ${int(N)}$, proprio ${N}.`), textBlock(`Servono ${n} bit: quando il numero di cose è una potenza di due, l'esponente è la risposta.`)]
			: [textBlock(`Cerca la più piccola potenza di due maggiore o uguale a ${N}: $2^{${n - 1}} = ${below}$ non basta, $2^{${n}} = ${int(2 ** n)}$ sì.`), textBlock(2 ** n - N === 1 ? `Servono ${n} bit, e una sola sequenza resta libera: $${int(2 ** n)} - ${N} = 1$.` : `Servono ${n} bit, e $${int(2 ** n)} - ${N} = ${2 ** n - N}$ sequenze restano libere.`)];
	return {
		prompt: 'Trova quanti bit servono.',
		problem: textBlock(`Un codice binario deve distinguere ${N} ${thing}, con parole tutte della stessa lunghezza. Quanti bit servono, come minimo, per ogni parola?`),
		solution: String(n),
		steps,
		answer: { kind: 'number', value: String(n) },
		params: { case: kind, N, thing, value: String(n), mistakes: (kind === 'potenza' ? [n + 1, N, n - 1, Math.ceil(N / 2)] : [n - 1, N, Math.ceil(N / 2), n + 1]).map(String) },
	};
}

// ---------------------------------------------------------------------------
// Level 6: analog or digital

export const ANALOG = ['un termometro a mercurio', 'un orologio a lancette', 'un disco in vinile', "una bilancia con l'ago", 'un tachimetro a lancetta', 'una musicassetta', 'una meridiana', 'una fotografia su pellicola', "l'indicatore del carburante a lancetta"];
export const DIGITAL = [
	'un termometro con il display a cifre',
	'un orologio che mostra le ore con i numeri',
	'un file musicale',
	'una bilancia che scrive il peso in cifre',
	'un contapassi',
	'una foto scattata con il telefono',
	'un interruttore della luce',
	'un pallottoliere',
	'un contachilometri a cifre',
];

function level6(rng: Rng): Built {
	const findAnalog = rng.next() < 0.5;
	const [rightPool, otherPool] = findAnalog ? [ANALOG, DIGITAL] : [DIGITAL, ANALOG];
	const right = rng.pick(rightPool);
	const others = pickDistinct(rng, otherPool, 3);
	const opt = (x: string) => textOpt(cap(x), x);
	return {
		prompt: findAnalog ? 'Riconosci la rappresentazione analogica.' : 'Riconosci la rappresentazione digitale.',
		problem: textBlock(findAnalog ? "Quale di questi oggetti rappresenta l'informazione in modo analogico?" : "Quale di questi oggetti rappresenta l'informazione in modo digitale?"),
		solution: opt(right).latex,
		steps: [
			textBlock(
				findAnalog
					? `${cap(right)} varia con continuità e può assumere tutti i valori di un intervallo: è una rappresentazione analogica. Gli altri usano un numero finito di valori distinti: sono digitali.`
					: `${cap(right)} usa un numero finito di valori distinti: è una rappresentazione digitale. Gli altri variano con continuità: sono analogici.`,
			),
		],
		answer: choose(rng, opt(right), others.map(opt)),
		params: { case: findAnalog ? 'analogica' : 'digitale', right },
	};
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 200; attempt++) {
		let b: Built;
		try {
			b = make(rng);
		} catch {
			continue; // not enough distinct options for this draw
		}
		const sample: Sample = { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: b.params };
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const v = Number(sample.params.value);
	const mistakes = (sample.params.mistakes as string[]).map(Number);
	const cands = [...mistakes];
	for (let d = 1; d < 12; d++) cands.push(v + d, v - d);
	return choose(
		rng,
		numOpt(q(v)),
		cands.filter((x) => Number.isInteger(x) && x > 0 && x !== v).map((x) => numOpt(q(x))),
	);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test(sample.problem + sample.steps.join(' ') + sample.solution)) v.push('parole vietate');
	const a = sample.answer;
	if (sample.level === 4 || sample.level === 5) {
		if (a.kind !== 'number' || !/^[1-9]\d*$/.test(a.value)) v.push('la risposta deve essere un numero naturale positivo');
	} else if (a.kind !== 'choice') v.push('la risposta deve essere una scelta');
	if (a.kind === 'choice') checkChoice(a, v);
	checkChoice(sample.choice, v);
	if (sample.level === 2 || sample.level === 3) {
		const code = sample.params.code as Record<string, string>;
		const n = sample.level;
		const words = Object.values(code);
		if (new Set(words).size !== words.length) v.push('due lettere con la stessa sequenza');
		if (words.some((w) => !new RegExp(`^[01]{${n}}$`).test(w))) v.push(`le parole del codice devono avere ${n} bit`);
		if ([...(sample.params.word as string)].some((l) => !(l in code))) v.push('una lettera della parola non è nella tabella');
	}
	if (sample.level === 5 && Number(sample.params.N) > 1024) v.push('troppe cose');
	return v;
}

export const infInformazioneDati: Generator = {
	id: ID,
	title: 'Informazione, dati e codici',
	levels: {
		1: { label: 'Dati e informazioni', constraints: ["trovare l'informazione tra tre dati, il dato tra tre informazioni, o il ruolo (dati, elaborazione, informazione) in un'operazione"] },
		2: { label: 'Codificare con una tabella', constraints: ['quattro lettere, parole del codice di 2 bit tutte diverse, una parola di 3-5 lettere'] },
		3: { label: 'Decodificare una sequenza', constraints: ['sei lettere, parole del codice di 3 bit tutte diverse, una parola di 4 o 5 lettere'] },
		4: { label: 'Quante sequenze con n bit', constraints: ['2^n con n da 2 a 12; sequenze libere con n da 3 a 7; bit aggiunti da 1 a 3'] },
		5: { label: 'Quanti bit servono', constraints: ['N da 4 a 1024; circa 1 su 4 potenze di due esatte, circa 1 su 7 una potenza di due più uno'] },
		6: { label: 'Analogico o digitale', constraints: ['una rappresentazione analogica tra tre digitali, o una digitale tra tre analogiche'] },
	},
	generate,
	check,
	toChoice,
};

export default infInformazioneDati;
