/**
 * Sequenza, selezione, iterazione e teorema di Böhm-Jacopini. Spec: specs/exercises/inf-bohm-jacopini.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/49-inf-bohm-jacopini.md): the structure of a chart,
 * the structure a task needs, a chart with one structure inside another, the theorem, and an algorithm with jumps
 * to recognise and then to build as a structured chart (v2/inf-alg.ts).
 */
import type { Rng } from '../types';
import { chartAnswer, chartOption, choose, makeGenerator, needing, output, structure, type Built } from '../inf-programmi';
import {
	byAdding,
	cheaper,
	countdown,
	delivery,
	discount,
	divisible,
	euclid,
	fee,
	fizz,
	given,
	goal,
	halvings,
	idOption,
	larger,
	mistakes,
	multiples,
	order,
	paramsOf,
	passes,
	quiz,
	rectangle,
	repeat,
	said,
	savings,
	sound,
	statementLevel,
	sumDown,
	sumTo,
	threshold,
	traceLevel,
	trip,
	units,
	unlock,
	type Algo,
	type Statement
} from '../inf-alg';

export const ID = 'inf-bohm-jacopini';

const pickOne = (rng: Rng, makers: ((rng: Rng) => Algo)[]) => rng.pick(makers)(rng);

// ---------------------------------------------------------------------------
// Level 1: the structure of a chart

const KINDS = {
	sequenza: { label: "Nessuna: c'è solo la sequenza", makers: [fee, units, rectangle, order, trip], why: 'Non ci sono rombi: i blocchi sono in fila e si eseguono tutti, una volta, dall\'alto in basso. È una sola sequenza.' },
	selezione: { label: 'Una selezione', makers: [threshold, discount, delivery, larger, divisible, cheaper, quiz], why: 'Dopo il rombo le frecce si riuniscono e si prosegue in avanti, senza tornare alla condizione: è una selezione.' },
	iterazione: { label: "Un'iterazione", makers: [countdown, sumTo, multiples, byAdding, savings, halvings, goal, repeat, unlock, sumDown], why: "Dal fondo del giro una freccia risale sopra il rombo, e la condizione viene guardata di nuovo: è un'iterazione." },
	annidata: { label: "Una selezione dentro un'iterazione", makers: [euclid, fizz, passes], why: "I rombi sono due. Dal primo parte un giro, con la freccia che risale: è un'iterazione. Il secondo sta tutto dentro il giro e i suoi rami si riuniscono prima della freccia che risale: è una selezione annidata." }
} as const;
type Kind = keyof typeof KINDS;

function level1(rng: Rng): Built {
	const names = Object.keys(KINDS) as Kind[];
	const kind = rng.pick(names);
	const a = pickOne(rng, [...KINDS[kind].makers]);
	return {
		prompt: 'Riconosci la struttura dal disegno.',
		problem: 'Oltre alla sequenza dei blocchi in fila, quali strutture di controllo ci sono in questo diagramma?',
		chart: a.source,
		solution: KINDS[kind].label,
		steps: ['Guarda dove si va dopo ogni rombo: se si prosegue in avanti è una selezione, se una freccia torna alla condizione è un\'iterazione.', KINDS[kind].why],
		answer: choose(
			rng,
			idOption(KINDS[kind].label, kind),
			names.filter((n) => n !== kind).map((n) => idOption(KINDS[n].label, n))
		),
		params: { ...paramsOf(a), case: kind }
	};
}

// ---------------------------------------------------------------------------
// Level 2: the structure a task needs

type Need = 'sequenza' | 'selezione' | 'iterazione';
const TASKS: [id: string, need: Need, text: (rng: Rng) => string][] = [
	['q1', 'sequenza', (r) => `leggere la base e l'altezza di un rettangolo e scriverne ${r.pick(["l'area", 'il perimetro'])}`],
	['q2', 'sequenza', (r) => `leggere un prezzo e scrivere quel prezzo con ${r.int(2, 15)} euro di spedizione in più`],
	['q3', 'sequenza', (r) => `leggere ${r.pick(['le ore e i minuti di una durata e scriverla tutta in minuti', 'i minuti e i secondi di un tempo e scriverlo tutto in secondi', 'le settimane e i giorni di un viaggio e scriverne la durata in giorni'])}`],
	['q4', 'sequenza', (r) => `leggere il numero di biglietti e scrivere il totale, a ${r.int(5, 20)} euro per biglietto`],
	['q5', 'sequenza', (r) => `leggere ${r.pick(['due', 'quattro', 'cinque'])} voti e scriverne la somma`],
	['q6', 'sequenza', (r) => `leggere un numero e scriverne il prodotto per ${r.int(2, 20)}`],
	['q7', 'sequenza', (r) => `leggere il lato di un ${r.pick(['quadrato', 'triangolo con i lati uguali', 'esagono regolare'])} e scriverne il perimetro`],
	['q8', 'sequenza', (r) => `leggere ${r.pick(['tre', 'quattro'])} numeri e scriverne ${r.pick(['la somma', 'il prodotto'])}`],
	['s1', 'selezione', (r) => `leggere un'età e scrivere "ridotto" se è minore di ${r.int(6, 16)}, "intero" in tutti gli altri casi`],
	['s2', 'selezione', (r) => `leggere un prezzo e togliere ${r.pick([5, 10])} euro solo quando supera i ${10 * r.int(3, 9)} euro`],
	['s3', 'selezione', (r) => `leggere due numeri e scrivere il ${r.pick(['maggiore', 'minore'])} dei due`],
	['s4', 'selezione', () => 'leggere un numero e scrivere "pari" oppure "dispari"'],
	['s5', 'selezione', (r) => `leggere una spesa e aggiungere la spedizione solo a chi spende meno di ${10 * r.int(2, 6)} euro`],
	['s6', 'selezione', (r) => `leggere un voto e scrivere "sufficiente" se è almeno ${r.pick([6, 18, 24, 30, 36, 60])}, "insufficiente" altrimenti`],
	['s7', 'selezione', (r) => `leggere una risposta e dare ${r.pick([1, 2, 5, 10, 20, 50])} punti solo se è quella giusta`],
	['s8', 'selezione', () => 'leggere il numero di studenti e scrivere "nessuno studente" se è zero, la quota a testa negli altri casi'],
	['i1', 'iterazione', (r) => `chiedere di nuovo ${r.pick(['il codice di sblocco', 'il codice della cassaforte', 'il numero segreto'])} ogni volta che è sbagliato, per quante volte serve`],
	['i2', 'iterazione', (r) => `scrivere tutti i numeri da ${r.int(5, 30)} a 1, uno alla volta`],
	['i3', 'iterazione', (r) => `aggiungere la paghetta ai risparmi, una settimana dopo l'altra, fino a quando bastano per ${r.pick(['le cuffie', 'la bicicletta', 'le scarpe', 'il biglietto del concerto'])}`],
	['i4', 'iterazione', () => 'leggere un numero n e sommare tutti i numeri da 1 a n'],
	['i5', 'iterazione', () => 'leggere quanti voti ci sono in una pagella e poi leggerli tutti, uno alla volta'],
	['i6', 'iterazione', () => 'togliere il minore dal maggiore di due numeri, più volte, fino a quando diventano uguali'],
	['i7', 'iterazione', (r) => `leggere un numero e scriverne i primi ${r.int(3, 12)} multipli`],
	['i8', 'iterazione', (r) => `dividere un numero per ${r.pick([2, 3, 10])} più volte, tenendo il quoziente intero, fino a quando diventa zero`]
];

const NEEDS: Record<Need | 'salto', string> = {
	sequenza: 'Nessuna: basta la sequenza',
	selezione: 'Una selezione',
	iterazione: "Un'iterazione",
	salto: 'Un salto: le tre strutture non bastano'
};
const WHY_NEED: Record<Need, string> = {
	sequenza: 'I passi si eseguono tutti, una volta sola e sempre nello stesso ordine: non c\'è niente da scegliere e niente da ripetere.',
	selezione: 'Ci sono due casi e in ognuno si fa una cosa diversa, una volta sola: serve una condizione che sceglie, cioè una selezione.',
	iterazione: 'Le stesse istruzioni devono poter essere eseguite più di una volta, e quante volte dipende dai dati: serve "finché", non "se".'
};

function level2(rng: Rng): Built {
	const need = rng.pick(['sequenza', 'selezione', 'iterazione'] as Need[]);
	const [id, , text] = rng.pick(TASKS.filter((t) => t[1] === need));
	const task = text(rng);
	return {
		prompt: 'Scegli la struttura che serve.',
		problem: `Un algoritmo deve ${task}. Oltre a mettere i passi in fila, di quale struttura di controllo ha bisogno?`,
		solution: NEEDS[need],
		steps: [WHY_NEED[need], 'Un salto non serve mai: per il teorema di Böhm-Jacopini sequenza, selezione e iterazione bastano per qualunque algoritmo.'],
		answer: choose(
			rng,
			idOption(NEEDS[need], need),
			(Object.keys(NEEDS) as (Need | 'salto')[]).filter((n) => n !== need).map((n) => idOption(NEEDS[n], n))
		),
		params: { case: need, task: id, text: task }
	};
}

// ---------------------------------------------------------------------------
// Level 4: the theorem

const TRUE: Statement[] = [
	['t1', 'Qualunque algoritmo si può riscrivere usando soltanto sequenza, selezione e iterazione.', 'È quello che dice il teorema di Böhm-Jacopini: le tre strutture sono sufficienti per qualunque algoritmo.'],
	['t2', 'Dei salti si può sempre fare a meno.', 'Il teorema dice che dei salti si può sempre fare a meno: ogni algoritmo con i salti ne ha uno equivalente senza.'],
	['t3', 'Due algoritmi sono equivalenti quando, con gli stessi dati di ingresso, danno gli stessi risultati.', 'Equivalente vuol dire proprio questo: stessi dati di ingresso, stessi risultati.'],
	['t4', "Riscrivere un algoritmo senza salti può richiedere di ripetere un'istruzione o di aggiungere una variabile.", 'Il teorema garantisce che la riscrittura esiste, non che sia più corta: nel codice di sblocco la riga "leggi pin" compare due volte.'],
	['t5', 'In ognuna delle tre strutture si entra da un punto solo e si esce da un punto solo.', "È la proprietà che le tre strutture hanno in comune, e che permette di metterne una dentro l'altra."],
	['t6', "Una selezione intera si può mettere dentro il giro di un'iterazione.", "Vista da fuori una struttura intera si comporta come una singola istruzione: può stare dovunque possa stare un'istruzione. Si chiama annidamento."],
	['t7', 'Un algoritmo strutturato può avere mille righe.', 'Il teorema parla dei modi di combinare le istruzioni, non di quante ne servono.'],
	['t8', 'Un algoritmo può essere fatto di una sola sequenza, senza selezioni e senza iterazioni.', 'Non ogni algoritmo deve usare tutte e tre le strutture: la media di due voti è una sola sequenza.'],
	['t9', 'Selezione e iterazione cominciano tutte e due con una condizione.', 'Per questo si confondono: la differenza è dove si va dopo.'],
	['t10', "Finito il giro di un'iterazione si torna alla condizione.", "È quello che distingue l'iterazione dalla selezione: dopo il giro la condizione viene guardata di nuovo."],
	['t11', 'La programmazione strutturata usa solo le tre strutture, una dopo l\'altra o una dentro l\'altra, senza salti.', 'È il modo di scrivere algoritmi e programmi che viene dal teorema.'],
	['t12', "Il ciclo for è un modo più comodo di scrivere un'iterazione, non una quarta struttura.", 'Sufficienti non vuol dire uniche: i linguaggi offrono altre scritture, ma tutto quello che fanno si può fare con le tre strutture.']
];

const FALSE: Statement[] = [
	['x1', 'Il teorema di Böhm-Jacopini dice che ogni algoritmo deve usare tutte e tre le strutture.', 'Il teorema dice che le tre strutture bastano, non che servono sempre tutte: la media di due voti è una sola sequenza.'],
	['x2', 'Il teorema di Böhm-Jacopini dice che a un algoritmo bastano tre istruzioni.', 'Tre sono i modi di combinare le istruzioni, non le istruzioni: un algoritmo strutturato può avere mille righe.'],
	['x3', "Un algoritmo riscritto senza salti è sempre più corto dell'algoritmo di partenza.", "La riscrittura esiste sempre, ma può essere più lunga: a volte bisogna ripetere un'istruzione o aggiungere una variabile."],
	['x4', 'Certi algoritmi si possono scrivere solo con i salti.', 'Dei salti si può sempre fare a meno: è il teorema di Böhm-Jacopini.'],
	['x5', 'Finito il ramo di una selezione si torna alla condizione.', "Dopo il ramo di una selezione si prosegue in avanti, e la condizione non viene più guardata: si torna alla condizione nell'iterazione."],
	['x6', 'In un diagramma di flusso un rombo indica sempre una selezione.', "Anche l'iterazione comincia con un rombo: conta dove si va dopo."],
	['x7', "Una selezione non può stare dentro un'iterazione.", "Una struttura intera può stare dovunque possa stare un'istruzione, anche dentro un giro."],
	['x8', "In una selezione si eseguono tutti e due i rami, uno dopo l'altro.", 'A ogni esecuzione si percorre un ramo solo, quello scelto dalla condizione.'],
	['x9', 'Due algoritmi sono equivalenti solo se hanno gli stessi passi, nello stesso ordine.', 'Sono equivalenti quando danno gli stessi risultati con gli stessi dati, anche se sono scritti in modo diverso.'],
	['x10', 'Per ripetere più volte un gruppo di istruzioni basta una selezione.', 'Le istruzioni di una selezione si eseguono al più una volta: per ripeterle serve "finché".'],
	['x11', 'In una struttura di controllo si può entrare da più punti diversi.', 'In ognuna delle tre strutture si entra da un punto solo e si esce da un punto solo.'],
	['x12', 'Il teorema di Böhm-Jacopini vieta ai linguaggi di programmazione di avere altre scritture, come il ciclo for.', 'Il teorema dice che le tre strutture sono sufficienti, non che sono le uniche scritture possibili.']
];

// ---------------------------------------------------------------------------
// Levels 5 and 6: an algorithm with jumps, and its structured chart

const JUMPS = [sumDown, countdown, unlock, goal, multiples];
/** The mistakes of who takes the jumps away: the condition for leaving kept as it is, a selection for the loop. */
const UNJUMP = ['condizione di uscita', 'selezione', 'ordine scambiato', 'parola nel giro'];

const jumpSteps = (a: Algo) => [
	'I passi con "vai al passo" sono un\'iterazione scritta con due salti: quello che torna indietro è la freccia che risale, quello in avanti è il rombo.',
	'Il salto in avanti dice quando si esce dal giro, mentre "finché" vuole sapere quando si resta: la condizione va scritta al contrario.',
	`I due algoritmi devono essere equivalenti: ${a.tests[0].length ? `${given(a.tests[0])} devono scrivere tutti e due ${said(output(a.source, a.tests[0])!)}` : `devono scrivere tutti e due ${said(output(a.source, [])!)}`}.`
];

function level5(rng: Rng): Built {
	const a = pickOne(rng, JUMPS);
	return {
		prompt: 'Togli i salti.',
		problem: `Questo algoritmo è scritto con i salti. ${a.jumps} Quale diagramma strutturato è equivalente, cioè scrive gli stessi risultati con gli stessi dati?`,
		solution: 'Il diagramma con un\'iterazione, che resta nel giro finché la condizione del salto in avanti è falsa.',
		steps: jumpSteps(a),
		solutionChart: a.source,
		answer: choose(rng, chartOption(a.source), mistakes(a, UNJUMP).map(chartOption)),
		params: paramsOf(a, { jumps: a.jumps })
	};
}

function level6(rng: Rng): Built {
	const a = pickOne(rng, JUMPS);
	return {
		prompt: 'Costruisci il diagramma strutturato.',
		problem: `Questo algoritmo è scritto con i salti. ${a.jumps} Costruisci il diagramma strutturato equivalente: deve scrivere gli stessi risultati con gli stessi dati.`,
		solution: 'Un diagramma con un\'iterazione al posto dei due salti, e la condizione scritta al contrario di quella del salto in avanti.',
		steps: jumpSteps(a),
		solutionChart: a.source,
		answer: needing(chartAnswer(a.source, a.tests), ...structure(a.source)),
		choice: choose(rng, chartOption(a.source), mistakes(a, UNJUMP).map(chartOption)),
		params: paramsOf(a, { jumps: a.jumps })
	};
}

function level3(rng: Rng): Built {
	const a = pickOne(rng, [fizz, passes, euclid]);
	// for Euclid not the pair of equal numbers, where the loop is never entered
	return traceLevel(rng, a, rng.pick(a.family === 'euclide' ? [a.tests[0], a.tests[2]] : a.tests));
}

export default makeGenerator(ID, 'Sequenza, selezione, iterazione e teorema di Böhm-Jacopini', {
	1: { label: 'Riconoscere la struttura', constraints: ['a chart: a sequence, a selection, a loop, or a selection inside a loop', 'the four in equal shares'], build: level1, check: sound },
	2: { label: 'Selezione o iterazione?', constraints: ['a task in words and the structure it needs', 'a jump is never the answer'], build: level2 },
	3: { label: 'Una struttura dentro l\'altra', constraints: ['a chart with a selection inside a loop', 'at most 9 lines written'], build: level3, check: sound },
	4: { label: 'Il teorema di Böhm-Jacopini', constraints: ['one true statement among three false ones, or the other way round'], build: (rng) => statementLevel(rng, TRUE, FALSE, 'Ricorda che cosa dice il teorema, e che cosa non dice.') },
	5: { label: 'Togliere i salti', constraints: ['an algorithm with two jumps, as numbered steps', 'four charts that write different things on the tests'], build: level5, check: sound },
	6: { label: 'Costruire il diagramma senza salti', constraints: ['graded by running the chart on at least two tests'], build: level6, check: sound }
});
