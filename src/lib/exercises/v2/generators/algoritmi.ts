/**
 * Il concetto di algoritmo. Spec: specs/exercises/algoritmi.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/45-algoritmi.md). The lesson comes before the
 * programming languages: its algorithms are flowcharts, which the student runs as the executor, chooses and builds
 * (v2/inf-alg.ts).
 *
 * 1. the five properties; 2. run a sequence; 3. run an algorithm that chooses or repeats; 4. algorithm, executor,
 * program; 5. the chart that solves a problem; 6. build the chart.
 */
import type { Rng } from '../types';
import { choose, makeGenerator, shuffle, type Built } from '../inf-programmi';
import { buildLevel, byAdding, countdown, discount, euclid, fee, idOption, larger, pickLevel, rectangle, sound, statementLevel, threshold, traceLevel, units, type Algo, type Statement } from '../inf-alg';

export const ID = 'algoritmi';

// ---------------------------------------------------------------------------
// Level 1: the five properties

const PROPERTIES = {
	finito: ['Finito', "I passi devono essere in numero finito e l'esecuzione deve terminare: questo passo non smette mai."],
	'non ambiguo': ['Non ambiguo', 'Ogni passo si deve capire in un modo solo: qui due esecutori farebbero due cose diverse, perché la quantità non è detta.'],
	eseguibile: ['Eseguibile', "L'esecutore deve saper fare ogni passo: questo non lo sa fare nessuno, né una persona né una macchina."],
	deterministico: ['Deterministico', 'Con gli stessi dati di ingresso il risultato deve essere sempre lo stesso: qui decide il caso, e due esecuzioni possono finire in modo diverso.'],
	generale: ['Generale', 'Un algoritmo risolve tutti i problemi dello stesso tipo: questa frase è il risultato di un caso solo, e non dice che cosa fare con altri dati.']
} as const;
type Property = keyof typeof PROPERTIES;

const BROKEN: [string, Property, string][] = [
	['f1', 'finito', 'continua a contare senza fermarti mai'],
	['f2', 'finito', 'ripeti il passo 2 per sempre'],
	['f3', 'finito', "scrivi tutti i numeri pari, uno dopo l'altro, fino all'ultimo"],
	['f4', 'finito', 'aggiungi 1 al numero e ricomincia da capo, senza mai smettere'],
	['f5', 'finito', 'scrivi tutte le cifre dopo la virgola di 1 diviso 3'],
	['f6', 'finito', 'ogni volta che arrivi in fondo torna al passo 1, sempre'],
	['a1', 'non ambiguo', "aggiungi un po' di sale"],
	['a2', 'non ambiguo', 'cuoci finché è dorato al punto giusto'],
	['a3', 'non ambiguo', 'aspetta qualche minuto'],
	['a4', 'non ambiguo', 'prendi un numero abbastanza grande'],
	['a5', 'non ambiguo', 'mescola quanto basta'],
	['a6', 'non ambiguo', "gira a destra dopo un bel pezzo di strada"],
	['e1', 'eseguibile', 'indovina il numero che ho pensato'],
	['e2', 'eseguibile', 'scrivi i numeri che usciranno domani alla lotteria'],
	['e3', 'eseguibile', "leggi nel pensiero la password dell'utente"],
	['e4', 'eseguibile', 'scrivi il numero intero più grande che esiste'],
	['e5', 'eseguibile', 'prevedi il voto che prenderai tra un anno'],
	['e6', 'eseguibile', 'dividi il totale per zero e scrivi il risultato'],
	['d1', 'deterministico', 'scegli a caso una delle due strade'],
	['d2', 'deterministico', 'tira un dado e aggiungi al totale il numero uscito'],
	['d3', 'deterministico', 'lancia una moneta: se esce testa raddoppia il numero'],
	['d4', 'deterministico', 'estrai un biglietto dal sacchetto senza guardare e usa il suo numero'],
	['d5', 'deterministico', 'apri il libro a una pagina a caso e leggi il primo numero'],
	['d6', 'deterministico', 'pesca una carta dal mazzo mescolato e somma il suo valore'],
	['g1', 'generale', 'la media di 7 e 8 è 7,5'],
	['g2', 'generale', 'il perimetro del quadrato di lato 3 è 12'],
	['g3', 'generale', 'il doppio di 21 è 42'],
	['g4', 'generale', 'il massimo comune divisore di 48 e 18 è 6'],
	['g5', 'generale', 'tra 12 e 30 il maggiore è 30'],
	['g6', 'generale', '2 ore e 15 minuti sono 135 minuti']
];

const PRECISE: [string, string][] = [
	['p1', 'aggiungi 1 al totale'],
	['p2', 'dividi il primo numero per 2'],
	['p3', 'scrivi il risultato'],
	['p4', 'leggi il prezzo e chiamalo p'],
	['p5', 'se il voto è almeno 6 scrivi "promosso"'],
	['p6', 'togli b da a'],
	['p7', "moltiplica la base per l'altezza"],
	['p8', 'finché n è maggiore di zero, togli 1 a n'],
	['p9', 'tra 200 metri gira a destra'],
	['p10', 'alla rotonda prendi la seconda uscita'],
	['p11', 'leggi due numeri e chiamali a e b'],
	['p12', 'calcola a più b e chiama il risultato s']
];

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

const FAULT: Record<Exclude<Property, 'generale'>, string> = {
	finito: "fa sì che l'esecuzione non termini",
	'non ambiguo': 'è ambiguo',
	eseguibile: 'non è eseguibile',
	deterministico: "rende l'elenco non deterministico"
};

function level1(rng: Rng): Built {
	const names = Object.keys(PROPERTIES) as Property[];
	if (rng.next() < 0.6) {
		const [id, property, text] = rng.pick(BROKEN);
		const others = shuffle(
			rng,
			names.filter((p) => p !== property)
		).slice(0, 3);
		return {
			prompt: 'Riconosci la proprietà che manca.',
			problem: property === 'generale' ? `Al posto di un elenco di passi c'è scritto soltanto: «${text}». Quale proprietà di un algoritmo manca?` : `In un elenco di istruzioni c'è questo passo: «${text}». Quale proprietà di un algoritmo non è rispettata?`,
			solution: PROPERTIES[property][0],
			steps: ["Rileggi il passo chiedendoti se si può eseguire senza decidere niente di testa propria, se si sa fare, se finisce e se dà sempre lo stesso risultato.", PROPERTIES[property][1]],
			answer: choose(
				rng,
				idOption(PROPERTIES[property][0], property),
				others.map((p) => idOption(PROPERTIES[p][0], p))
			),
			params: { case: 'manca', step: id, property }
		};
	}
	const property = rng.pick(names.filter((p) => p !== 'generale')) as Exclude<Property, 'generale'>;
	const bad = rng.pick(BROKEN.filter((b) => b[1] === property));
	const good = shuffle(rng, PRECISE).slice(0, 3);
	return {
		prompt: 'Trova il passo che non va.',
		problem: `Quale di questi passi ${FAULT[property]}?`,
		solution: cap(bad[2]),
		steps: [PROPERTIES[property][1], "Gli altri tre passi dicono con precisione che cosa fare, si sanno eseguire, finiscono e danno sempre lo stesso risultato."],
		answer: choose(
			rng,
			idOption(cap(bad[2]), bad[0]),
			good.map(([id, text]) => idOption(cap(text), id))
		),
		params: { case: 'passo', property, ids: [bad[0], ...good.map((g) => g[0])] }
	};
}

// ---------------------------------------------------------------------------
// Level 4: algorithm, executor, program

const TRUE: Statement[] = [
	['t1', 'Un programma è un algoritmo scritto in un linguaggio di programmazione.', "Un programma è un algoritmo scritto in un linguaggio di programmazione: l'algoritmo è l'idea, il programma una delle sue scritture."],
	['t2', 'Lo stesso algoritmo si può tradurre in programmi diversi, in linguaggi diversi.', "L'algoritmo è uno, i programmi possono essere tanti: uno per ogni linguaggio in cui lo si traduce."],
	['t3', 'Un algoritmo si può eseguire anche a mano, senza un computer.', "Un algoritmo non ha bisogno del computer: quello di Euclide è stato eseguito a mano per più di duemila anni."],
	['t4', "All'esecutore non serve capire perché l'algoritmo funziona: gli basta saper fare ogni passo.", "All'esecutore serve soltanto saper fare ogni singolo passo, non capire perché l'algoritmo funziona."],
	['t5', "L'esecutore di un algoritmo può essere una persona oppure una macchina.", "L'esecutore è chi esegue i passi: una persona oppure una macchina."],
	['t6', "I dati di ingresso sono i valori da cui l'algoritmo parte.", "I dati di ingresso sono i valori da cui l'algoritmo parte, quelli di uscita i valori che produce."],
	['t7', 'Un algoritmo si può esprimere a parole, con un diagramma di flusso o in pseudocodice.', "L'algoritmo è l'idea, e si può esprimere a parole, con un diagramma o in pseudocodice."],
	['t8', 'Con una ripetizione, pochi passi scritti possono diventare molti passi eseguiti.', 'Un gruppo di passi ripetuto finché serve viene eseguito molte volte, anche se è scritto una volta sola.'],
	['t9', "Conviene trovare prima l'algoritmo, con carta e penna, e tradurlo in un programma solo dopo.", "Prima si trova l'algoritmo, con carta e penna, e poi lo si traduce: così non si cerca insieme che cosa fare e come scriverlo."],
	['t10', 'In un algoritmo con una ripetizione, il numero di passi eseguiti può dipendere dai dati.', "Quanti giri fa una ripetizione dipende dai dati: è questo che rende l'algoritmo generale."],
	['t11', 'Un algoritmo è garantito solo per i dati per cui è stato scritto.', "Un algoritmo vale per i dati per cui è stato scritto: quello di Euclide con le sottrazioni, per esempio, con uno zero non termina."],
	['t12', 'Per un computer i passi devono essere più piccoli di quelli che si darebbero a una persona.', "Un algoritmo si scrive pensando a chi lo eseguirà, e per un computer i passi devono essere molto più piccoli."]
];

const FALSE: Statement[] = [
	['x1', 'Algoritmo e programma sono due parole per la stessa cosa.', "L'algoritmo è l'idea; il programma è una sua scrittura in un linguaggio di programmazione."],
	['x2', "Un algoritmo esiste solo se c'è un computer che lo esegue.", 'Un algoritmo si può eseguire anche a mano: il computer non è necessario.'],
	['x3', "Per eseguire un algoritmo bisogna aver capito perché funziona.", "All'esecutore basta saper fare ogni passo."],
	['x4', 'Ogni algoritmo ha un solo programma possibile.', 'Lo stesso algoritmo dà programmi diversi in linguaggi diversi.'],
	['x5', "I dati di uscita sono i valori che l'algoritmo riceve prima di cominciare.", "Quelli sono i dati di ingresso; i dati di uscita sono i valori che l'algoritmo produce."],
	['x6', 'Con gli stessi dati di ingresso, un algoritmo può dare ogni volta un risultato diverso.', 'Un algoritmo è deterministico: con gli stessi dati dà sempre gli stessi risultati.'],
	['x7', 'Qualunque elenco di istruzioni è un algoritmo.', 'Un elenco di istruzioni è un algoritmo solo se è finito, non ambiguo, eseguibile, deterministico e generale.'],
	['x8', 'Un algoritmo può avere infiniti passi, purché ognuno sia chiaro.', "I passi sono in numero finito, e l'esecuzione prima o poi termina."],
	['x9', "Conviene scrivere subito il programma: l'algoritmo viene fuori da solo.", "Chi scrive subito il programma cerca insieme che cosa fare e come scriverlo, e di solito si ferma a metà: prima viene l'algoritmo."],
	['x10', 'In un algoritmo i passi si eseguono sempre tutti, una volta ciascuno, in fila.', 'Un algoritmo può scegliere tra due strade e può ripetere un gruppo di passi.'],
	['x11', 'Un algoritmo risolve un caso solo: per altri dati ne serve un altro.', 'Un algoritmo è generale: risolve tutti i problemi dello stesso tipo.'],
	['x12', "Un computer esegue un algoritmo scritto in italiano così com'è.", 'Un computer esegue un programma, cioè un algoritmo scritto in un linguaggio di programmazione.']
];

// ---------------------------------------------------------------------------
// Levels with a chart

const pickOne = (rng: Rng, makers: ((rng: Rng) => Algo)[]) => rng.pick(makers)(rng);

function level2(rng: Rng): Built {
	return traceLevel(rng, pickOne(rng, [fee, units, rectangle]));
}

function level3(rng: Rng): Built {
	const a = pickOne(rng, [threshold, discount, larger, countdown, byAdding, euclid]);
	// for a selection any of its tests, so that the edge comes up; for a loop the first, which has a few turns
	return traceLevel(rng, a, a.structure === 'selezione' ? rng.pick(a.tests) : a.tests[0]);
}

const CHOSEN = [fee, units, rectangle, larger, discount];

export default makeGenerator(ID, 'Il concetto di algoritmo', {
	1: { label: 'Le proprietà di un algoritmo', constraints: ['a step that breaks one property, or one such step among three precise ones', 'four different options'], build: level1 },
	2: { label: 'Eseguire un algoritmo', constraints: ['a sequence shown as a chart', 'the inputs are in the question', 'four different outputs'], build: level2, check: sound },
	3: { label: 'Un algoritmo che sceglie o ripete', constraints: ['a selection or a loop shown as a chart', 'at most 9 lines written'], build: level3, check: sound },
	4: { label: 'Algoritmo, esecutore, programma', constraints: ['one true statement among three false ones, or the other way round'], build: (rng) => statementLevel(rng, TRUE, FALSE, 'Distingui algoritmo, esecutore e programma.') },
	5: { label: 'Scegliere il diagramma giusto', constraints: ['four charts that write different things on the tests', 'each at most 332 px wide'], build: (rng) => pickLevel(rng, pickOne(rng, CHOSEN)), check: sound },
	6: { label: 'Costruire il diagramma', constraints: ['graded by running the chart on at least two tests'], build: (rng) => buildLevel(rng, pickOne(rng, CHOSEN)), check: sound }
});
