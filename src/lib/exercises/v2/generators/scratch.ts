/**
 * La programmazione a blocchi. Spec: specs/exercises/scratch.md
 *
 * Five levels from the lesson (docs/lezioni/informatica/riscritte/50-scratch.md). The site has no environment with
 * blocks: as in the lesson, a program made of blocks is said in words and its algorithm is a flowchart, with the
 * counter of "ripeti N volte" in sight and the condition of "ripeti fino a quando" turned round (v2/inf-alg.ts).
 *
 * 1. blocks, syntax errors and logic errors; 2. "ripeti N volte" as a chart; 3. a logic error that the blocks do
 * not prevent; 4. from the blocks to the chart; 5. build the chart of a program made of blocks.
 */
import type { Rng } from '../types';
import { chartAnswer, chartOption, choose, makeGenerator, needing, output, shuffle, structure, textOption, type Built } from '../inf-programmi';
import { countdown, firstTest, given, goal, idOption, mistakes, multiples, paramsOf, quiz, repeat, said, savings, sound, statementLevel, sumDown, sumTo, unlock, writtenChoice, type Algo, type Statement } from '../inf-alg';

export const ID = 'scratch';

// ---------------------------------------------------------------------------
// Level 1: blocks, syntax errors, logic errors

const TRUE: Statement[] = [
	['t1', 'In un programma a blocchi le istruzioni sono pezzi già pronti, da trascinare e incastrare.', 'Nella programmazione a blocchi ogni blocco è un\'istruzione già scritta, da trascinare e agganciare alle altre.'],
	['t2', 'In un programma a blocchi non possono esserci errori di sintassi.', "Non c'è niente da battere, quindi niente da battere male: quello che si riesce a comporre è sempre un programma che parte."],
	['t3', 'Un programma a blocchi può contenere errori logici.', 'I blocchi impediscono gli errori di scrittura, non quelli di ragionamento.'],
	['t4', 'La forma di un blocco dice dove il blocco può stare.', 'La forma fa il lavoro che in un linguaggio testuale fanno le regole di scrittura: un pezzo che non ha la forma giusta non si aggancia.'],
	['t5', "Un blocco a forma di C tiene dentro di sé le istruzioni di una selezione o di un'iterazione.", 'Il blocco a C contiene altri blocchi, come fa il rientro sotto "se" e sotto "finché".'],
	['t6', 'Una condizione, con i lati a punta, entra solo in un foro della stessa forma.', 'Una condizione entra nel foro a punta del blocco "se", non nel foro tondo dei numeri.'],
	['t7', "Un programma a blocchi si legge dall'alto in basso.", "I blocchi agganciati sotto quello di avvio si eseguono in ordine, dall'alto in basso."],
	['t8', 'Un programma a blocchi può avere più pile, ognuna con il suo blocco di avvio.', 'Ogni pila parte quando succede la cosa scritta sul suo blocco di avvio; un diagramma di flusso ha invece un solo inizio.'],
	['t9', "Una pila di blocchi, uno sotto l'altro, è una sequenza.", 'La pila è la sequenza; la selezione e l\'iterazione sono i blocchi a forma di C.'],
	['t10', 'Il blocco "ripeti 4 volte" conta i giri da solo.', 'Nel blocco il conto non si vede; in un diagramma di flusso si scrive, con una variabile che cresce di uno a ogni giro.'],
	['t11', 'Quando un programma diventa lungo, i blocchi sono più scomodi di un linguaggio testuale.', 'Una pila di centinaia di blocchi non sta sullo schermo, e trascinare è più lento che scrivere.'],
	['t12', 'Un errore logico si trova eseguendo il programma un passo alla volta e confrontando con quello che ci si aspetta.', 'Un errore logico non ferma il programma: si vede solo confrontando quello che fa con quello che doveva fare.']
];

const FALSE: Statement[] = [
	['x1', 'Un programma a blocchi che parte è di sicuro un programma giusto.', 'Un programma che parte non è un programma giusto: può contenere un errore logico e fare un\'altra cosa.'],
	['x2', 'I blocchi impediscono gli errori di ragionamento.', 'I blocchi impediscono gli errori di scrittura; quelli di ragionamento, gli errori logici, restano possibili.'],
	['x3', 'In un programma a blocchi ogni istruzione si batte sulla tastiera, lettera per lettera.', 'Le istruzioni sono pezzi già pronti: si trascinano, non si battono.'],
	['x4', "Un'istruzione si può incastrare nel foro di una condizione.", "Un'istruzione non entra in nessun foro: la forma lo impedisce."],
	['x5', 'Sequenza, selezione e iterazione esistono solo nei linguaggi testuali, non nei blocchi.', 'I blocchi sono un altro modo di scrivere le stesse tre strutture.'],
	['x6', 'Un programma a blocchi può avere una sola pila.', 'Può avere più pile, ognuna con il suo blocco di avvio.'],
	['x7', 'Il blocco di avvio si aggancia in fondo alla pila, sotto gli altri blocchi.', 'Il blocco di avvio sta in cima, senza niente sopra.'],
	['x8', "Un errore di sintassi è un errore nel ragionamento dell'algoritmo.", 'Un errore di sintassi è un errore nel modo di scrivere le istruzioni; quello di ragionamento è un errore logico.'],
	['x9', 'Il blocco "ripeti fino a quando" dice quando si resta nel giro, come il rombo di un ciclo.', 'Il blocco "ripeti fino a quando" dice quando si esce; il rombo di un ciclo chiede quando si resta: le due condizioni sono una il contrario dell\'altra.'],
	['x10', 'I programmi che si usano ogni giorno sono scritti quasi tutti con i blocchi.', 'Sono scritti in linguaggi testuali: i blocchi vanno bene per cominciare.'],
	['x11', 'Passando dai blocchi a un linguaggio testuale bisogna imparare da capo variabili e strutture.', 'Variabili, sequenza, selezione e iterazione sono le stesse: cambia solo il modo di scriverle.'],
	['x12', 'Se tutti i blocchi si incastrano, il personaggio fa per forza quello che volevi.', 'Tutto può incastrarsi alla perfezione e il personaggio fare un\'altra cosa: è un errore logico.']
];

type Fault = 'logico' | 'sintassi';
const SITUATIONS: [id: string, fault: Fault, text: (rng: Rng) => string][] = [
	['l1', 'logico', (r) => `In un programma a blocchi che deve disegnare un quadrato, nel blocco "ruota" metti ${r.pick([45, 60, 80, 100, 120])} gradi al posto di 90`],
	['l2', 'logico', (r) => `In un programma a blocchi metti il blocco "dì fatto" dentro la C di "ripeti ${r.int(3, 9)} volte", invece che sotto`],
	['l3', 'logico', (r) => `In un conto alla rovescia a blocchi metti il blocco che toglie ${r.int(1, 3)} al numero prima del blocco che lo dice`],
	['l4', 'logico', (r) => `In un programma a blocchi che deve disegnare un quadrato usi "ripeti ${r.pick([3, 5, 6, 8])} volte" al posto di "ripeti 4 volte"`],
	['l5', 'logico', () => 'In un blocco "se … allora … altrimenti" metti nello spazio di "allora" i blocchi che dovevano stare in quello di "altrimenti"'],
	['l6', 'logico', (r) => `In un quiz a blocchi il blocco "cambia punti di ${r.pick([5, 10, 20])}" finisce sotto il blocco "se" invece che al suo interno`],
	['s1', 'sintassi', () => 'In un linguaggio testuale dimentichi di chiudere una parentesi'],
	['s2', 'sintassi', (r) => `In un linguaggio testuale batti "${r.pick(['scrvi', 'legi', 'finhcé', 'altirmenti', 'ripti'])}" al posto del nome di un'istruzione`],
	['s3', 'sintassi', () => 'In un linguaggio testuale dimentichi le virgolette che chiudono un testo'],
	['s4', 'sintassi', (r) => `Nel rombo di un diagramma di questo sito batti "${r.pick(['i', 'n', 'p'])} = ${r.int(2, 9)}", con un solo uguale, per chiedere se i due valori sono uguali`],
	['s5', 'sintassi', (r) => `In un linguaggio testuale lasci una riga a metà: dopo "${r.pick(['totale', 'somma', 'punti'])} =" non scrivi niente`]
];

const OUTCOMES = {
	logico: "Il programma parte, ma fa un'altra cosa: è un errore logico",
	sintassi: 'Il programma non parte finché non correggi: è un errore di scrittura, cioè di sintassi',
	niente: 'Niente: il programma fa lo stesso quello che doveva',
	incastro: 'Il pezzo sbagliato viene rifiutato e il programma si corregge da solo'
} as const;

function level1(rng: Rng): Built {
	if (rng.next() < 0.55) return statementLevel(rng, TRUE, FALSE, 'Ricorda come funzionano i blocchi.');
	const fault = rng.pick(['logico', 'logico', 'sintassi'] as Fault[]);
	const [id, , text] = rng.pick(SITUATIONS.filter((s) => s[1] === fault));
	const situation = text(rng);
	return {
		prompt: 'Distingui gli errori di sintassi dagli errori logici.',
		problem: `${situation}. Che cosa succede?`,
		solution: OUTCOMES[fault],
		steps:
			fault === 'logico'
				? ['Tutti i pezzi hanno la forma giusta, quindi si incastrano e il programma parte.', "Quello che fa, però, non è quello che volevi: è un errore logico, e i blocchi non lo impediscono. Si trova eseguendo un passo alla volta e confrontando con quello che ti aspettavi."]
				: ['Qui c\'è qualcosa da battere sulla tastiera, quindi si può battere male.', 'Un errore nel modo di scrivere le istruzioni è un errore di sintassi: finché c\'è, il programma non parte. Con i blocchi veri non può succedere, perché non c\'è niente da battere.'],
		answer: choose(
			rng,
			idOption(OUTCOMES[fault], fault),
			(Object.keys(OUTCOMES) as (keyof typeof OUTCOMES)[]).filter((o) => o !== fault).map((o) => idOption(OUTCOMES[o], o))
		),
		params: { case: fault === 'logico' ? 'errore logico' : 'errore di sintassi', situation: id, text: situation }
	};
}

// ---------------------------------------------------------------------------
// Level 2: "ripeti N volte" with the counter in sight

function level2(rng: Rng): Built {
	const a = repeat(rng);
	const written = output(a.source, [])!;
	const n = Number(a.k.n);
	const move = written[0];
	const ask = rng.pick(['mossa', 'righe', 'blocco'] as const);
	const base = { chart: a.source, params: paramsOf(a, { ask }) };
	if (ask === 'mossa')
		return {
			...base,
			prompt: 'Conta i giri del ciclo.',
			problem: `Questo diagramma è un programma a blocchi con un "ripeti", riscritto con il contatore in vista. Quante volte scrive "${move}"?`,
			solution: `${n} volte`,
			steps: [`Il contatore i parte da 1 e cresce di uno a ogni giro; si resta nel giro finché i ≤ ${n}.`, `I giri sono ${n}: il blocco che scrive "${move}" viene eseguito ${n} volte.`],
			answer: choose(
				rng,
				textOption(`${n} volte`, String(n)),
				[n - 1, n + 1, 2 * n, 1, 2 * n + 1].map((x) => textOption(`${x} volte`, String(x)))
			)
		};
	if (ask === 'righe')
		return {
			...base,
			prompt: 'Conta le righe scritte.',
			problem: 'Questo diagramma è un programma a blocchi con un "ripeti", riscritto con il contatore in vista. Quante righe scrive in tutto, dall\'inizio alla fine?',
			solution: `${2 * n + 1} righe`,
			steps: [`I giri sono ${n}, perché i va da 1 a ${n}, e a ogni giro si scrivono due righe: ${2 * n} in tutto.`, `Dopo il giro si scrive "fatto", una volta sola: le righe sono ${2 * n + 1}.`],
			answer: choose(
				rng,
				textOption(`${2 * n + 1} righe`, String(2 * n + 1)),
				[2 * n, 2 * n + 2, n + 1, 3 * n, 2 * n - 1].map((x) => textOption(`${x} righe`, String(x)))
			)
		};
	return {
		...base,
		prompt: 'Riconosci il blocco "ripeti" nel diagramma.',
		problem: 'Questo diagramma è un programma a blocchi riscritto con il contatore in vista. Quale blocco "ripeti" c\'era nel programma a blocchi?',
		solution: `ripeti ${n} volte`,
		steps: [`Nel diagramma il conto dei giri si vede: i parte da 1, cresce di uno a ogni giro e si resta nel giro finché i ≤ ${n}.`, `I giri sono ${n}: il blocco era "ripeti ${n} volte", che il conto lo tiene da solo.`],
		answer: choose(
			rng,
			textOption(`ripeti ${n} volte`, String(n)),
			[n - 1, n + 1, 2 * n, 1].map((x) => textOption(`ripeti ${x} volte`, String(x)))
		)
	};
}

// ---------------------------------------------------------------------------
// Level 3: a logic error

const BUGS: [maker: (rng: Rng) => Algo, bug: string, hint: string][] = [
	[countdown, 'ordine scambiato', "Nel giro due blocchi sono nell'ordine sbagliato: il numero viene cambiato prima di essere scritto."],
	[goal, 'ordine scambiato', "Nel giro due blocchi sono nell'ordine sbagliato: i passi vengono scritti prima di essere aumentati."],
	[goal, 'parola nel giro', 'Il blocco che scrive "fatto" è finito dentro il giro, e viene eseguito a ogni giro.'],
	[quiz, 'scrive nel ramo', 'Il blocco che scrive i punti è finito dentro il ramo "sì": quando la risposta è sbagliata non viene eseguito.'],
	[quiz, 'sempre', 'Manca la selezione: i punti aumentano in tutti i casi.'],
	[multiples, 'parte da zero', "Il contatore parte da 0 invece che da 1, e c'è un giro in più."],
	[sumTo, 'somma che parte da uno', 'La somma parte da 1 invece che da 0.'],
	[savings, 'settimane che partono da uno', 'Il contatore delle settimane parte da 1 invece che da 0.']
];

function level3(rng: Rng): Built {
	const [maker, bug, hint] = rng.pick(BUGS);
	const a = maker(rng);
	const buggy = a.wrong.find(([name]) => name === bug)![1];
	const shows = (t: number[]) => {
		const w = output(buggy, t);
		return w !== null && w.length <= 9 && w.join() !== output(a.source, t)!.join();
	};
	const inputs = shuffle(rng, a.tests).find(shows);
	if (!inputs) throw new Error(`${ID}: the mistake ${bug} of ${a.family} never shows`);
	const written = output(buggy, inputs)!;
	const meant = output(a.source, inputs)!;
	return {
		prompt: 'Trova che cosa fa davvero il programma.',
		problem: `${a.story ? `${a.story} ` : ''}Questo diagramma dovrebbe essere un algoritmo che ${a.task}. Si esegue senza fermarsi, ma contiene un errore logico. Che cosa scrive ${given(inputs)}?`,
		chart: buggy,
		solution: written.length ? `Scrive ${said(written)}.` : 'Non scrive niente.',
		steps: ['Un errore logico non ferma il programma: si trova eseguendo un blocco alla volta e confrontando con quello che ti aspetti.', hint, `${given(inputs)[0].toUpperCase()}${given(inputs).slice(1)} ci si aspetta ${said(meant)}; il diagramma invece ${written.length ? `scrive ${said(written)}` : 'non scrive niente'}.`],
		answer: writtenChoice(
			rng,
			buggy,
			inputs,
			a.wrong.filter(([name]) => name !== bug).map(([, s]) => s),
			[meant]
		),
		params: { case: a.family, family: a.family, structure: a.structure, k: a.k, source: buggy, bug, inputs, tests: [inputs, ...firstTest(a, inputs).slice(1, 2)] }
	};
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: from the blocks to the chart

const BLOCKS = [repeat, goal, quiz, unlock, savings, sumDown];
/** The mistakes of who turns blocks into a chart: the condition for leaving kept as it is, a count that is one off, a block out of place. */
const FROM_BLOCKS = ['condizione di uscita', 'un giro in meno', 'scrive nel ramo', 'parola nel giro', 'selezione', 'un giro in più'];

const how = (a: Algo) =>
	a.family === 'ripeti'
		? 'Il blocco "ripeti N volte" conta i giri da solo; nel diagramma il conto si scrive: una variabile parte da 1, cresce di uno a ogni giro, e si resta nel giro finché non supera N.'
		: a.structure === 'iterazione'
			? 'Il blocco "ripeti fino a quando" dice quando si esce dal giro, mentre il rombo di un ciclo chiede quando si resta: la condizione va scritta al contrario.'
			: 'Il blocco "se … allora" è una selezione con un ramo solo: i blocchi dentro la C vanno sul ramo "sì", quelli sotto la C dopo la selezione.';

const words = 'Nel diagramma "chiedi" diventa "leggi", "dì" diventa "scrivi", "porta a" e "cambia di" diventano un rettangolo.';

function level4(rng: Rng): Built {
	const a = rng.pick(BLOCKS)(rng);
	return {
		prompt: 'Passa dai blocchi al diagramma.',
		problem: `Un programma a blocchi è fatto così, dall'alto in basso; tra parentesi ci sono i blocchi dentro una C: ${a.blocks}. Quale diagramma di flusso fa la stessa cosa?`,
		solution: 'Il diagramma con gli stessi passi nello stesso ordine, e con dentro il giro o il ramo i blocchi che stavano dentro la C.',
		steps: [words, how(a), a.idea],
		solutionChart: a.source,
		answer: choose(rng, chartOption(a.source), mistakes(a, FROM_BLOCKS).map(chartOption)),
		params: paramsOf(a, { blocks: a.blocks })
	};
}

function level5(rng: Rng): Built {
	// the "ripeti" reads how many times, as every other program of this level reads something
	const a = rng.pick([(r: Rng) => repeat(r, true), ...BLOCKS.slice(1)])(rng);
	const first = a.tests[0];
	return {
		prompt: 'Costruisci il diagramma di flusso.',
		problem: `Un programma a blocchi è fatto così, dall'alto in basso; tra parentesi ci sono i blocchi dentro una C: ${a.blocks}. Costruisci il diagramma di flusso che fa la stessa cosa.`,
		solution: 'Un diagramma con gli stessi passi nello stesso ordine, e con dentro il giro o il ramo i blocchi che stavano dentro la C.',
		steps: [words, how(a), `Poi prova il diagramma: ${first.length ? `${given(first)} deve scrivere` : 'eseguito, deve scrivere'} ${said(output(a.source, first)!)}.`],
		solutionChart: a.source,
		answer: needing(chartAnswer(a.source, a.tests), ...structure(a.source)),
		choice: choose(rng, chartOption(a.source), mistakes(a, FROM_BLOCKS).map(chartOption)),
		params: paramsOf(a, { blocks: a.blocks })
	};
}

export default makeGenerator(ID, 'La programmazione a blocchi', {
	1: { label: 'Blocchi ed errori', constraints: ['a true statement among three false ones or the other way round, or a mistake to tell apart: of syntax or of logic', 'four different options'], build: level1 },
	2: { label: 'Il "ripeti" con il contatore', constraints: ['a loop with a counter from 1 to N, N from 3 to 9', 'how many turns, how many lines written, or which block it was'], build: level2, check: sound },
	3: { label: 'Un errore logico', constraints: ['a chart with a mistake that does not stop it', 'on the inputs asked it writes something else than what was meant, which is among the options'], build: level3, check: sound },
	4: { label: 'Dai blocchi al diagramma', constraints: ['a program made of blocks, in words', 'four charts that write different things on the tests'], build: level4, check: sound },
	5: { label: 'Costruire il diagramma di un programma a blocchi', constraints: ['graded by running the chart on at least two tests'], build: level5, check: sound }
});
