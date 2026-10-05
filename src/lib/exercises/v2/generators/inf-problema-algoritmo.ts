/**
 * Dal problema all'algoritmo. Spec: specs/exercises/inf-problema-algoritmo.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/46-inf-problema-algoritmo.md), in the order of its
 * phases: the analysis (inputs, outputs, constraints), the expected result of a test case worked out by hand, the
 * test case that finds a mistake, the chart of a problem, a problem that needs a loop, and the chart to build
 * (v2/inf-alg.ts).
 */
import type { Rng } from '../types';
import { choose, makeGenerator, output, shuffle, textOption, type Built } from '../inf-programmi';
import { buildLevel, byAdding, cheaper, delivery, discount, fee, firstTest, given, idOption, multiples, paramsOf, pickLevel, said, savings, sound, sumTo, threshold, trip, writtenChoice, type Algo } from '../inf-alg';

export const ID = 'inf-problema-algoritmo';

// ---------------------------------------------------------------------------
// Level 1: the analysis of a problem

interface Problem {
	id: string;
	text: string;
	/** The data, each with its article, as it is said in a list. */
	ins: string[];
	out: string;
	/** A value worked out on the way. */
	mid: string;
	constraint: string;
}

const PROBLEMS: Problem[] = [
	{ id: 'gita', text: 'Una classe va in gita: il costo del pullman si divide tra gli studenti, e in più ognuno paga il proprio biglietto del museo. Si vuole sapere quanto paga ognuno.', ins: ['il costo del pullman', 'il prezzo del biglietto', 'il numero di studenti'], out: 'la quota a testa', mid: 'la parte del pullman che tocca a ognuno', constraint: 'il numero di studenti deve essere maggiore di zero' },
	{ id: 'cuffie', text: 'Vuoi comprare un paio di cuffie e ogni settimana metti da parte la stessa somma. Vuoi sapere tra quante settimane avrai abbastanza soldi.', ins: ['il prezzo delle cuffie', 'la somma messa da parte ogni settimana'], out: 'il numero di settimane', mid: 'i risparmi accumulati fino a quel momento', constraint: 'la somma messa da parte ogni settimana deve essere maggiore di zero' },
	{ id: 'velocita', text: 'Dopo un giro in bicicletta vuoi sapere a quale velocità media sei andato.', ins: ['la distanza percorsa', 'il tempo impiegato'], out: 'la velocità media', mid: 'il tempo trasformato in ore', constraint: 'il tempo impiegato deve essere maggiore di zero' },
	{ id: 'saldo', text: 'Un negozio fa i saldi: di un oggetto si conoscono il prezzo pieno e la percentuale di sconto, e si vuole sapere quanto si paga.', ins: ['il prezzo pieno', 'la percentuale di sconto'], out: 'il prezzo finale', mid: 'il risparmio in euro', constraint: 'la percentuale di sconto deve essere compresa tra 0 e 100' },
	{ id: 'pizza', text: 'Un gruppo di amici aggiunge 5 euro di mancia al conto della pizzeria e divide il totale in parti uguali. Si vuole sapere quanto paga ognuno.', ins: ['il conto della pizzeria', 'il numero di amici'], out: 'la parte di ognuno', mid: 'il conto con la mancia aggiunta', constraint: 'il numero di amici deve essere maggiore di zero' },
	{ id: 'palestra', text: "In una palestra si può pagare ogni ingresso oppure fare l'abbonamento del mese. Sapendo quante volte pensi di andarci, vuoi sapere quale delle due scelte costa meno.", ins: ['il numero di ingressi previsti', 'il prezzo di un ingresso', "il prezzo dell'abbonamento"], out: 'la scelta più conveniente', mid: 'il costo degli ingressi singoli', constraint: 'il numero di ingressi previsti non può essere negativo' },
	{ id: 'benzina', text: "Prima di un viaggio in auto di andata e ritorno vuoi sapere quanti litri di benzina serviranno.", ins: ['i chilometri della sola andata', "i chilometri che l'auto fa con un litro"], out: 'i litri di benzina necessari', mid: 'i chilometri di andata e ritorno', constraint: "i chilometri che l'auto fa con un litro devono essere maggiori di zero" },
	{ id: 'media', text: 'In una materia hai preso tre voti e vuoi sapere la loro media.', ins: ['il primo voto', 'il secondo voto', 'il terzo voto'], out: 'la media', mid: 'la somma dei tre voti', constraint: 'i voti devono essere compresi tra 1 e 10' },
	{ id: 'vernice', text: "Devi dipingere una parete rettangolare e vuoi sapere quanti barattoli di vernice comprare.", ins: ['la base della parete', "l'altezza della parete", 'i metri quadrati che copre un barattolo'], out: 'il numero di barattoli', mid: "l'area della parete", constraint: 'i metri quadrati che copre un barattolo devono essere maggiori di zero' },
	{ id: 'ricetta', text: 'Una ricetta è scritta per un certo numero di persone, e tu devi cucinare per un numero diverso. Vuoi sapere quanta farina usare.', ins: ['la farina della ricetta', 'le persone previste dalla ricetta', 'le persone a tavola'], out: 'la farina da usare', mid: 'la farina per una persona sola', constraint: 'le persone previste dalla ricetta devono essere più di zero' },
	{ id: 'fotocopie', text: 'In cartoleria le fotocopie costano un tanto a pagina. Vuoi sapere quanto spendi per fotocopiare un fascicolo per tutta la classe.', ins: ['le pagine del fascicolo', 'il numero di copie', 'il prezzo di una pagina'], out: 'la spesa totale', mid: 'il numero totale di pagine da stampare', constraint: 'il numero di copie non può essere negativo' },
	{ id: 'treno', text: "Devi prendere un treno e vuoi sapere a che ora uscire di casa per arrivare in stazione dieci minuti prima della partenza.", ins: ["l'ora di partenza del treno", 'i minuti che servono per arrivare in stazione'], out: "l'ora in cui uscire di casa", mid: 'i minuti totali di anticipo', constraint: 'i minuti che servono per arrivare in stazione non possono essere negativi' }
];

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const list = (xs: string[]) => (xs.length === 1 ? xs[0] : `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}`);

const ROLES = {
	ingresso: ['Tra i dati di ingresso', "È un valore che si conosce prima di cominciare e che arriva da fuori: un dato di ingresso, che l'algoritmo legge."],
	uscita: ['Tra i dati di uscita', "È il valore che il problema chiede di trovare: un dato di uscita, che l'algoritmo scrive alla fine. Un dato di uscita non si legge."],
	intermedio: ['Tra i valori intermedi', "Non arriva da fuori e non è la risposta: è un valore che l'algoritmo calcola strada facendo."],
	vincolo: ['Tra i vincoli', 'È una condizione che i dati devono rispettare perché il problema abbia senso: un vincolo.']
} as const;
type Role = keyof typeof ROLES;

function level1(rng: Rng): Built {
	const p = rng.pick(PROBLEMS);
	const kind = rng.pick(['ruolo', 'ruolo', 'ingresso', 'ingresso', 'uscita', 'vincolo'] as const);
	if (kind === 'ruolo') {
		const role = rng.pick(['ingresso', 'uscita', 'intermedio', 'vincolo'] as Role[]);
		const which = role === 'ingresso' ? rng.int(0, p.ins.length - 1) : 0;
		const piece = role === 'ingresso' ? p.ins[which] : role === 'uscita' ? p.out : role === 'intermedio' ? p.mid : p.constraint;
		return {
			prompt: "Fai l'analisi del problema.",
			problem: `${p.text} Nell'analisi di questo problema, dove va scritto «${piece}»?`,
			solution: ROLES[role][0],
			steps: ["L'analisi risponde a tre domande: che cosa conosco prima di cominciare, che cosa devo trovare, quali condizioni devono rispettare i dati.", ROLES[role][1]],
			answer: choose(
				rng,
				idOption(ROLES[role][0], role),
				(Object.keys(ROLES) as Role[]).filter((r) => r !== role).map((r) => idOption(ROLES[r][0], r))
			),
			params: { case: 'ruolo', problem: p.id, role, which }
		};
	}
	if (kind === 'ingresso') {
		const others = shuffle<[string, string]>(rng, [
			['con uscita', cap(list([...p.ins, p.out]))],
			['solo uscita', cap(p.out)],
			['incompleti', cap(list(p.ins.slice(0, -1)))],
			['con intermedio', cap(list([...p.ins.slice(0, -1), p.mid]))],
			['uscita al posto di uno', cap(list([p.out, ...p.ins.slice(1)]))]
		]).slice(0, 3);
		return {
			prompt: "Fai l'analisi del problema.",
			problem: `${p.text} Quali sono i dati di ingresso?`,
			solution: cap(list(p.ins)),
			steps: ['I dati di ingresso sono i valori che conosci prima di cominciare e che arrivano da fuori.', `Qui sono ${list(p.ins)}. Quello che si deve trovare, cioè ${p.out}, è un dato di uscita: e un dato di uscita non si legge.`],
			answer: choose(
				rng,
				idOption(cap(list(p.ins)), 'giusti'),
				others.map(([id, text]) => idOption(text, id))
			),
			params: { case: 'ingresso', problem: p.id, ids: others.map(([id]) => id) }
		};
	}
	if (kind === 'uscita') {
		const others = shuffle<[string, string]>(rng, [...p.ins.map((x, i): [string, string] => [`ingresso ${i}`, cap(x)]), ['intermedio', cap(p.mid)], ['tutti', cap(list(p.ins))]]).slice(0, 3);
		return {
			prompt: "Fai l'analisi del problema.",
			problem: `${p.text} Qual è il dato di uscita?`,
			solution: cap(p.out),
			steps: ['Il dato di uscita è il valore che il problema chiede di trovare.', `Qui è ${p.out}: gli altri valori si conoscono prima di cominciare, oppure si calcolano strada facendo.`],
			answer: choose(
				rng,
				idOption(cap(p.out), 'uscita'),
				others.map(([id, text]) => idOption(text, id))
			),
			params: { case: 'uscita', problem: p.id, ids: others.map(([id]) => id) }
		};
	}
	return {
		prompt: "Fai l'analisi del problema.",
		problem: `${p.text} Quale vincolo va scritto nell'analisi?`,
		solution: cap(p.constraint),
		steps: ['Un vincolo è una condizione che i dati di ingresso devono rispettare perché il problema abbia senso.', `Qui ${p.constraint}: con un valore diverso il conto non si può fare, oppure non vuol dire niente.`],
		answer: choose(rng, idOption(cap(p.constraint), 'vincolo'), [
			idOption(`Bisogna conoscere in anticipo ${p.out}`, 'uscita nota'),
			idOption('I dati di ingresso devono essere numeri pari', 'pari'),
			idOption('Nessuno: qualunque valore va bene', 'nessuno')
		]),
		params: { case: 'vincolo', problem: p.id }
	};
}

// ---------------------------------------------------------------------------
// Level 2: the expected result of a test case, worked out by hand before running anything

const pickOne = (rng: Rng, makers: ((rng: Rng) => Algo)[]) => rng.pick(makers)(rng);

function level2(rng: Rng): Built {
	const a = pickOne(rng, [trip, fee, delivery, discount, cheaper, savings]);
	const inputs = rng.pick(a.tests);
	const written = output(a.source, inputs)!;
	return {
		prompt: 'Calcola a mano il risultato atteso.',
		problem: `${a.story} Un algoritmo ${a.task}. Prima di eseguirlo, calcola a mano il risultato atteso di questo caso di prova: che cosa deve scrivere ${given(inputs)}?`,
		solution: `Deve scrivere ${said(written)}.`,
		steps: ['Il risultato atteso si calcola a mano, prima di eseguire: solo così il confronto prova qualcosa.', a.idea, `${cap(given(inputs))} il risultato atteso è ${said(written)}.`],
		// an algorithm that writes nothing is not an expected result
		answer: writtenChoice(
			rng,
			a.source,
			inputs,
			a.wrong.map(([, s]) => s).filter((s) => output(s, inputs)?.length)
		),
		params: paramsOf(a, { inputs, tests: firstTest(a, inputs) })
	};
}

// ---------------------------------------------------------------------------
// Level 3: the test case that finds the mistake

/** A chart with the mistake on the edge, and four cases of which only the one on the edge shows it. */
function level3(rng: Rng): Built {
	const a = pickOne(rng, [threshold, discount, delivery, savings]);
	const buggy = a.wrong.find(([name]) => name === 'confine')![1];
	const differs = (x: number) => output(buggy, [x])?.join() !== output(a.source, [x])!.join();
	// the edge: the threshold of a selection, a price the savings reach exactly
	const base = a.family === 'risparmio' ? Number(a.k.w) : Number(a.k.t);
	const edge = a.family === 'risparmio' ? base * rng.int(3, 7) : base;
	const far = a.family === 'risparmio' ? [edge - rng.int(1, base - 1), edge + rng.int(1, base - 1), edge + base + rng.int(1, base - 1), edge - base - rng.int(1, base - 1)] : [edge + rng.int(2, 9), edge - rng.int(2, Math.min(9, edge - 1)), edge + rng.int(10, 30), edge + 1, edge - 1];
	const others = shuffle(
		rng,
		[...new Set(far)].filter((x) => x > 0 && !differs(x))
	).slice(0, 3);
	if (!differs(edge) || others.length < 3) throw new Error(`${ID}: no test cases for ${a.family}`);
	const cases = [edge, ...others];
	return {
		prompt: "Trova il caso di prova che scopre l'errore.",
		problem: `${a.story} Il diagramma dovrebbe essere un algoritmo che ${a.task}, ma contiene un errore. Con quale di questi valori in ingresso te ne accorgi?`,
		chart: buggy,
		solution: `Con ${edge}: il risultato atteso è ${said(output(a.source, [edge])!)}, e il diagramma scrive ${said(output(buggy, [edge])!)}.`,
		steps: ['Per ogni caso calcola a mano il risultato atteso, poi esegui il diagramma e confronta.', `Con ${edge} il risultato atteso è ${said(output(a.source, [edge])!)}, mentre il diagramma scrive ${said(output(buggy, [edge])!)}. Negli altri tre casi il diagramma scrive quello che deve.`, "L'errore è nella condizione del rombo, e si vede solo sul confine: i valori sul confine sono quelli da provare sempre."],
		answer: choose(
			rng,
			textOption(String(edge)),
			others.map((x) => textOption(String(x)))
		),
		params: { case: a.family, family: a.family, structure: a.structure, k: a.k, source: buggy, tests: cases.map((x) => [x]), edge }
	};
}

// ---------------------------------------------------------------------------
// Levels 4 to 6: the chart of a problem

const PLAIN = [trip, fee, delivery, discount, cheaper];
const LOOPS = [savings, sumTo, multiples, byAdding];

export default makeGenerator(ID, "Dal problema all'algoritmo", {
	1: { label: 'Dati di ingresso e di uscita', constraints: ['a problem in words and one of its data, or its inputs, its output, its constraint', 'four different options'], build: level1 },
	2: { label: 'Il risultato atteso', constraints: ['a problem in words and a test case, no chart', 'the distractors are what a mistaken algorithm would write'], build: level2, check: sound },
	3: { label: "Il caso di prova che trova l'errore", constraints: ['a chart with the mistake on the edge', 'of the four inputs only one makes it write something else than expected'], build: level3, check: sound },
	4: { label: 'Dal problema al diagramma', constraints: ['a sequence or a selection', 'four charts that write different things on the tests'], build: (rng) => pickLevel(rng, pickOne(rng, PLAIN), ['confine']), check: sound },
	5: { label: 'Un problema con una ripetizione', constraints: ['a loop', 'four charts that write different things on the tests'], build: (rng) => pickLevel(rng, pickOne(rng, LOOPS), ['confine', 'selezione']), check: sound },
	6: { label: 'Costruire il diagramma di un problema', constraints: ['graded by running the chart on at least two tests'], build: (rng) => buildLevel(rng, pickOne(rng, [...PLAIN, savings]), ['confine']), check: sound }
});
