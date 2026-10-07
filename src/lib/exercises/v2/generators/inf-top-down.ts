/**
 * Exercises of lesson 69, "Scomporre un problema: la progettazione top-down". Spec: specs/exercises/inf-top-down.md
 *
 * 1. the subproblems of a problem (text); 2. what a function receives and gives back, and how it is called (text
 * and one row of code); 3. what a program writes while its functions are still empty; 4. what a program made of
 * two functions writes; 5. which function goes in place of the empty one (options that are programs, shown by
 * their function alone); 6. write the function the main program calls (open answer, graded on what it writes and
 * on the function).
 */
import type { CodeText, Rng } from '../types';
import { choose, cppProgram, listingOption, makeCodeGenerator, needing, program, programAnswer, programOption, reader, reference, shuffle, textOption, texts, written, writtenOption, wrongPrograms, type CodeBuilt, type Program } from '../inf-codice';

export const ID = 'inf-top-down';

class TooFew extends Error {}

/**
 * A level whose numbers are drawn again when they leave too few wrong answers (two mistakes that give the same
 * output). The family is drawn once, before, so that the families keep their shares.
 */
const drawn =
	<F>(families: readonly F[], build: (rng: Rng, family: F) => CodeBuilt) =>
	(rng: Rng): CodeBuilt => {
		const family = rng.pick(families);
		for (let i = 1; ; i++) {
			try {
				return build(rng, family);
			} catch (e) {
				if (i >= 40 || !(e instanceof TooFew)) throw e;
			}
		}
	};

const some = <T>(rng: Rng, xs: readonly T[], n: number): T[] => shuffle(rng, xs).slice(0, n);

// ---------------------------------------------------------------- level 1: the subproblems

interface Problem {
	id: string;
	/** The problem, in a sentence. */
	text: string;
	/** Four subproblems, each doing one thing (none has an "e" in it). */
	subs: readonly [string, string, string, string];
	/** Pieces of other problems, which this one has no use for. */
	foreign: readonly string[];
	/** The two functions its main program calls. */
	functions: readonly [string, string];
}

export const PROBLEMS: readonly Problem[] = [
	{
		id: 'cinema',
		text: "Un programma legge l'età di ogni persona di un gruppo e scrive quanto paga il gruppo al cinema, con il biglietto ridotto per bambini e anziani.",
		subs: ["leggere un'età valida", "decidere il prezzo del biglietto dall'età", 'sommare i prezzi dei biglietti', 'scrivere il totale del gruppo'],
		foreign: ['trovare il migliore di due tempi', 'calcolare i punti di una squadra', 'calcolare la multa di un libro', 'sommare le assenze della settimana'],
		functions: ['leggi_eta', 'prezzo']
	},
	{
		id: 'gara',
		text: 'Un programma legge i due tempi di ogni atleta di una gara di corsa, scrive il tempo migliore di ciascuno e quanti atleti si qualificano.',
		subs: ['leggere un tempo valido', 'trovare il migliore di due tempi', 'decidere se un tempo vale la qualificazione', 'scrivere la riga di un atleta'],
		foreign: ["decidere il prezzo del biglietto dall'età", 'aggiungere il coperto per ogni persona', 'calcolare il costo del pullman', 'calcolare la multa di un libro'],
		functions: ['migliore', 'qualificato']
	},
	{
		id: 'gita',
		text: 'Un programma legge quanti studenti partecipano a una gita e quanti giorni dura, e scrive la quota di ciascuno tra pullman, albergo e ingressi.',
		subs: ['calcolare il costo del pullman', "calcolare il costo dell'albergo", 'dividere la spesa tra gli studenti', 'scrivere il riepilogo delle spese'],
		foreign: ['trovare il migliore di due tempi', 'calcolare i punti di una squadra', 'decidere se un tempo vale la qualificazione', 'sommare le assenze della settimana'],
		functions: ['costo_pullman', 'quota']
	},
	{
		id: 'torneo',
		text: 'Un programma legge le partite vinte e i pareggi di ogni squadra di un torneo e scrive i punti di ciascuna e il numero della squadra in testa.',
		subs: ['leggere i risultati di una squadra', 'calcolare i punti di una squadra', 'scrivere la riga della classifica', 'confrontare i punti con il massimo trovato finora'],
		foreign: ["decidere il prezzo del biglietto dall'età", "calcolare il costo dell'albergo", 'calcolare la multa di un libro', 'aggiungere il coperto per ogni persona'],
		functions: ['punti', 'stampa_riga']
	},
	{
		id: 'pizzeria',
		text: 'Un programma legge le ordinazioni di un tavolo in pizzeria e scrive il conto, con il coperto, e quanto paga ogni persona dividendo in parti uguali.',
		subs: ["leggere il prezzo di un'ordinazione", 'aggiungere il coperto per ogni persona', 'dividere il conto tra le persone', 'scrivere lo scontrino'],
		foreign: ['trovare il migliore di due tempi', 'calcolare i punti di una squadra', 'sommare le assenze della settimana', 'decidere se un tempo vale la qualificazione'],
		functions: ['coperto', 'quota']
	},
	{
		id: 'assenze',
		text: 'Un programma legge le ore di assenza di ogni studente nei giorni di una settimana e scrive un avviso per chi ha superato il limite.',
		subs: ['leggere le ore di assenza di un giorno', 'sommare le assenze della settimana', 'decidere se il limite è superato', "scrivere l'avviso per uno studente"],
		foreign: ["decidere il prezzo del biglietto dall'età", 'calcolare i punti di una squadra', 'calcolare il costo del pullman', 'aggiungere il coperto per ogni persona'],
		functions: ['assenze_settimana', 'oltre_limite']
	},
	{
		id: 'biblioteca',
		text: "Un programma legge i giorni di ritardo di ogni libro restituito in biblioteca e scrive la multa di ciascuno e l'incasso della giornata.",
		subs: ['leggere i giorni di ritardo di un libro', 'calcolare la multa di un libro', 'scrivere la ricevuta di un libro', 'sommare le multe della giornata'],
		foreign: ['trovare il migliore di due tempi', 'calcolare i punti di una squadra', "calcolare il costo dell'albergo", 'decidere se un tempo vale la qualificazione'],
		functions: ['multa', 'stampa_ricevuta']
	},
	{
		id: 'palestra',
		text: "Un programma legge l'età e i mesi di abbonamento di ogni iscritto a una palestra e scrive quanto paga ciascuno.",
		subs: ['leggere i dati di un iscritto', "decidere la tariffa mensile dall'età", 'applicare lo sconto per gli abbonamenti lunghi', 'scrivere la quota di un iscritto'],
		foreign: ['trovare il migliore di due tempi', 'calcolare i punti di una squadra', 'calcolare la multa di un libro', 'calcolare il costo del pullman'],
		functions: ['tariffa', 'sconto']
	}
];

const SUBPROBLEM_KINDS = ['estraneo', 'due-cose', 'ordine'] as const;

function level1(rng: Rng, kind: (typeof SUBPROBLEM_KINDS)[number]): CodeBuilt {
	const p = rng.pick(PROBLEMS);
	if (kind === 'estraneo') {
		const foreign = rng.pick(p.foreign);
		const own = some(rng, p.subs, 3);
		return {
			prompt: 'Chiediti quali pezzi servono per arrivare a quello che il programma deve scrivere.',
			problem: `${p.text} Quale di questi non è un sottoproblema di questo problema?`,
			solution: `"${foreign}" non serve a questo programma.`,
			steps: ['Un sottoproblema è un pezzo del problema: risolverlo porta più vicino a quello che il programma deve scrivere.', `Gli altri tre pezzi servono tutti: ${own.join('; ')}.`, `"${foreign}" appartiene a un altro problema.`],
			answer: choose(
				rng,
				textOption(foreign),
				own.map((s) => textOption(s))
			),
			params: { case: kind, problem: p.id, right: foreign, others: own }
		};
	}
	if (kind === 'due-cose') {
		const [i, j] = some(rng, [0, 1, 2, 3], 2).sort((a, b) => a - b);
		const double = `${p.subs[i]} e ${p.subs[j]}`;
		const rest = p.subs.filter((_, k) => k !== i && k !== j);
		const single = [...rest, p.subs[rng.pick([i, j])]];
		return {
			prompt: 'Leggi ogni pezzo e conta le cose che fa.',
			problem: `${p.text} Nella scomposizione qualcuno ha scritto questi pezzi. Quale fa due cose, e va diviso in due sottoproblemi?`,
			solution: `"${double}": sono due cose, unite da una "e".`,
			steps: ['Un sottoproblema ben scelto fa una cosa sola.', `In "${double}" le cose sono due, e la "e" lo segnala: diventano due sottoproblemi, e due funzioni.`, 'Gli altri pezzi fanno una cosa sola ciascuno.'],
			answer: choose(
				rng,
				textOption(double),
				single.map((s) => textOption(s))
			),
			params: { case: kind, problem: p.id, right: double, parts: [p.subs[i], p.subs[j]], others: single }
		};
	}
	const [f, g] = p.functions;
	const right = `dal programma principale, con ${f} e ${g} ancora vuote`;
	const wrong = some(rng, [`da ${f}, che è la più facile, provandola da sola`, `da ${g}, e poi dalle funzioni che ${g} chiama`, 'da tutte le funzioni, lasciando il programma principale per ultimo', `dal programma principale, senza definire ${f} e ${g}`], 3);
	return {
		prompt: 'La scrittura va nello stesso verso della scomposizione.',
		problem: `${p.text} Hai deciso che il programma principale chiama le funzioni ${f} e ${g}. Con la progettazione top-down, da che cosa cominci a scrivere?`,
		solution: `Dal programma principale, con ${f} e ${g} ancora vuote.`,
		steps: ['Si parte dall\'alto: il programma principale, scritto come se le funzioni ci fossero già.', `Perché si possa eseguire, ${f} e ${g} devono esistere: le scrivi vuote, con un valore di ritorno fisso.`, 'Poi riempi una funzione alla volta, eseguendo il programma dopo ciascuna.'],
		answer: choose(
			rng,
			textOption(right),
			wrong.map((w) => textOption(w))
		),
		params: { case: kind, problem: p.id, right, others: wrong, functions: [f, g] }
	};
}

// ---------------------------------------------------------------- level 2: what a function receives and gives back

interface Signature {
	name: string;
	/** The subproblem, in the infinitive. */
	sub: string;
	receives: string;
	gives: string;
	/** The variables of the main program that hold what the function receives. */
	args: readonly string[];
}

export const SIGNATURES: readonly Signature[] = [
	{ name: 'prezzo', sub: "decidere il prezzo del biglietto dall'età di una persona", receives: "l'età di una persona", gives: 'il prezzo del biglietto', args: ['eta'] },
	{ name: 'multa', sub: 'calcolare la multa dai giorni di ritardo di un libro', receives: 'i giorni di ritardo', gives: 'la multa', args: ['giorni'] },
	{ name: 'migliore', sub: 'trovare il migliore di due tempi', receives: 'i due tempi', gives: 'il tempo migliore', args: ['a', 'b'] },
	{ name: 'punti', sub: 'calcolare i punti di una squadra dalle partite vinte e dai pareggi', receives: 'le partite vinte e i pareggi', gives: 'i punti della squadra', args: ['vinte', 'pareggi'] },
	{ name: 'quota', sub: 'dividere la spesa tra le persone', receives: 'la spesa e il numero di persone', gives: 'la quota di ciascuno', args: ['spesa', 'persone'] },
	{ name: 'qualificato', sub: 'decidere se un tempo vale la qualificazione', receives: 'il tempo di un atleta', gives: 'vero o falso', args: ['tempo'] },
	{ name: 'tariffa', sub: "decidere la tariffa mensile dall'età di un iscritto", receives: "l'età dell'iscritto", gives: 'la tariffa mensile', args: ['eta'] },
	{ name: 'coperto', sub: 'calcolare il coperto di un tavolo dal numero di persone', receives: 'il numero di persone', gives: 'il coperto del tavolo', args: ['persone'] },
	{ name: 'sconto', sub: 'calcolare lo sconto dal totale della spesa', receives: 'il totale della spesa', gives: 'lo sconto', args: ['totale'] },
	{ name: 'oltre_limite', sub: 'decidere se le ore di assenza superano il limite', receives: 'le ore di assenza', gives: 'vero o falso', args: ['ore'] },
	{ name: 'costo_pullman', sub: 'calcolare il costo del pullman dal numero di studenti', receives: 'il numero di studenti', gives: 'il costo del pullman', args: ['studenti'] },
	{ name: 'esito', sub: "decidere l'esito di una prova dai punti ottenuti", receives: 'i punti ottenuti', gives: "l'esito della prova", args: ['punti'] }
];

const RESULTS = ['r', 'x', 'v', 'valore'] as const;
const SIGNATURE_KINDS = ['riceve', 'chiamata'] as const;

function level2(rng: Rng, kind: (typeof SIGNATURE_KINDS)[number]): CodeBuilt {
	const s = rng.pick(SIGNATURES);
	if (kind === 'riceve') {
		const right = `riceve ${s.receives} e restituisce ${s.gives}`;
		const wrong = some(rng, [`riceve ${s.gives} e restituisce ${s.receives}`, `non riceve niente e restituisce ${s.gives}`, `riceve ${s.receives} e non restituisce niente`, 'non riceve niente e non restituisce niente'], 3);
		return {
			prompt: 'Guarda che cosa ha già il programma principale e che cosa gli serve.',
			problem: `Il programma principale ha già letto ${s.receives} e userà il risultato nei suoi conti. La funzione ${s.name} risolve il sottoproblema "${s.sub}". Che cosa riceve e che cosa restituisce?`,
			solution: `${s.name} riceve ${s.receives} e restituisce ${s.gives}.`,
			steps: [`Quello che serve alla funzione e che il programma principale ha già entra dai parametri: ${s.receives}.`, `Quello che la funzione produce, e che il programma principale userà, esce con return: ${s.gives}.`, 'Una funzione che non restituisce niente lascerebbe il programma principale senza il risultato.'],
			answer: choose(
				rng,
				textOption(right),
				wrong.map((w) => textOption(w))
			),
			params: { case: kind, function: s.name, right, others: wrong }
		};
	}
	const r = rng.pick(RESULTS.filter((name) => !s.args.includes(name)));
	const args = s.args.join(', ');
	const right = `${r} = ${s.name}(${args})`;
	const wrong = some(rng, [`${s.name}(${args})`, `${s.args[0]} = ${s.name}(${r})`, `${r} = ${s.name}()`, `${s.name}(${args}) = ${r}`, `${r} = ${s.name}`], 3);
	const held = s.args.length === 1 ? `nella variabile ${s.args[0]}` : `nelle variabili ${s.args.join(' e ')}`;
	return {
		prompt: 'Guarda che cosa c\'è tra le parentesi e dove finisce il risultato.',
		problem: `La funzione ${s.name} riceve ${s.receives} e restituisce ${s.gives}. Il programma principale ha ${s.receives} ${held} e vuole il risultato nella variabile ${r}. Quale chiamata è scritta nel modo giusto? In C++ la riga finisce con il punto e virgola.`,
		solution: right,
		steps: [`Tra le parentesi vanno gli argomenti, cioè quello che la funzione riceve: ${args}.`, `Il valore restituito va raccolto con un assegnamento, con ${r} a sinistra.`, 'Una chiamata senza assegnamento butta via il risultato; senza parentesi, o senza argomenti, la funzione non riceve quello che le serve.'],
		solutionListing: right,
		answer: choose(
			rng,
			listingOption(right),
			wrong.map((w) => listingOption(w))
		),
		params: { case: kind, function: s.name, args: [...s.args], result: r, right, others: wrong }
	};
}

// ---------------------------------------------------------------- level 3: functions still empty

const EMPTY_KINDS = ['somma', 'conta', 'riga'] as const;

/** What an empty function of each theme is called, with its parameter, and the variable that adds its results up. */
const SUMS = [
	{ name: 'prezzo', x: 'eta', total: 'totale', args: [8, 15, 40, 70, 30, 66] },
	{ name: 'multa', x: 'giorni', total: 'incasso', args: [2, 5, 12, 20, 7, 30] },
	{ name: 'tariffa', x: 'eta', total: 'totale', args: [16, 25, 45, 68, 33, 19] },
	{ name: 'costo', x: 'peso', total: 'spesa', args: [1, 4, 9, 15, 22, 6] }
] as const;
const COUNTS = [
	{ name: 'qualificato', x: 'tempo', count: 'quanti' },
	{ name: 'sufficiente', x: 'voto', count: 'quanti' },
	{ name: 'oltre_limite', x: 'ore', count: 'avvisi' },
	{ name: 'valido', x: 'numero', count: 'validi' }
] as const;
const ROWS = [
	{ outer: 'stampa_riga', inner: 'esito', x: 'punti', word: 'da decidere' },
	{ outer: 'stampa_riga', inner: 'giudizio', x: 'voto', word: 'da fare' },
	{ outer: 'stampa_atleta', inner: 'medaglia', x: 'tempo', word: 'nessuna' },
	{ outer: 'stampa_libro', inner: 'stato', x: 'giorni', word: 'in regola' }
] as const;

function level3(rng: Rng, kind: (typeof EMPTY_KINDS)[number]): CodeBuilt {
	if (kind === 'somma') {
		const t = rng.pick(SUMS);
		const fixed = rng.int(4, 9);
		const args = some(rng, t.args, 3);
		const shown = program(
			`
			def ${t.name}(${t.x}):
			    return ${fixed}

			${t.total} = 0
			${t.total} = ${t.total} + ${t.name}(${args[0]})
			${t.total} = ${t.total} + ${t.name}(${args[1]})
			${t.total} = ${t.total} + ${t.name}(${args[2]})
			print(${t.total})
			`,
			cppProgram(`int ${t.total} = 0;\n${args.map((x) => `${t.total} = ${t.total} + ${t.name}(${x});`).join('\n')}\ncout << ${t.total} << endl;`, `int ${t.name}(int ${t.x}) {\n    return ${fixed};\n}`),
			() => [String(3 * fixed)]
		);
		const sum = args[0] + args[1] + args[2];
		return {
			prompt: 'La funzione è ancora vuota: guarda che cosa restituisce, qualunque argomento riceva.',
			problem: `La funzione ${t.name} è ancora vuota. Che cosa scrive questo programma?`,
			code: texts(shown),
			solution: String(3 * fixed),
			steps: [`${t.name} è vuota: non guarda il suo parametro e restituisce sempre ${fixed}.`, `Il programma principale la chiama tre volte e somma i risultati: ${fixed} + ${fixed} + ${fixed} = ${3 * fixed}.`, 'Il risultato è finto, ma dice che le tre chiamate e la somma funzionano.'],
			answer: pick(rng, writtenOption([String(3 * fixed)]), [[String(sum)], [String(fixed)], [String(2 * fixed)], [String(sum + fixed)], ['0']].map(writtenOption)),
			params: reference(shown, [[]], { ask: 'output', case: kind, fixed, args })
		};
	}
	if (kind === 'conta') {
		const t = rng.pick(COUNTS);
		const yes = rng.int(0, 1) === 1;
		const n = rng.int(3, 7);
		const first = rng.int(2, 9);
		const shown = program(
			`
			def ${t.name}(${t.x}):
			    return ${yes ? 'True' : 'False'}

			${t.count} = 0
			for i in range(1, ${n + 1}):
			    if ${t.name}(${first} * i):
			        ${t.count} = ${t.count} + 1
			print(${t.count})
			`,
			cppProgram(`int ${t.count} = 0;\nfor (int i = 1; i <= ${n}; i++) {\n    if (${t.name}(${first} * i)) {\n        ${t.count} = ${t.count} + 1;\n    }\n}\ncout << ${t.count} << endl;`, `bool ${t.name}(int ${t.x}) {\n    return ${yes ? 'true' : 'false'};\n}`),
			() => [String(yes ? n : 0)]
		);
		const out = yes ? n : 0;
		return {
			prompt: 'La funzione è ancora vuota: guarda che cosa restituisce, qualunque argomento riceva.',
			problem: `La funzione ${t.name} è ancora vuota. Che cosa scrive questo programma?`,
			code: texts(shown),
			solution: String(out),
			steps: [`${t.name} è vuota: restituisce sempre ${yes ? 'vero' : 'falso'}, qualunque sia il suo argomento.`, `Il ciclo fa ${n} giri, e la condizione della selezione è ${yes ? 'vera' : 'falsa'} a ogni giro: il contatore ${yes ? `aumenta ${n} volte` : 'non aumenta mai'}.`, `Il programma scrive ${out}.`],
			answer: pick(rng, writtenOption([String(out)]), [[String(yes ? 0 : n)], [String(yes ? n - 1 : 1)], [String(n + 1)], [String(first * n)], [String(first)]].map(writtenOption)),
			params: reference(shown, [[]], { ask: 'output', case: kind, fixed: yes, n, first })
		};
	}
	const t = rng.pick(ROWS);
	const n = rng.int(2, 3);
	const step = rng.pick([5, 10, 20]);
	const shown = program(
		`
		def ${t.inner}(${t.x}):
		    return "${t.word}"

		def ${t.outer}(n, ${t.x}):
		    print(n, ${t.inner}(${t.x}))

		for k in range(1, ${n + 1}):
		    ${t.outer}(k, ${step} * k)
		`,
		cppProgram(
			`for (int k = 1; k <= ${n}; k++) {\n    ${t.outer}(k, ${step} * k);\n}`,
			`string ${t.inner}(int ${t.x}) {\n    return "${t.word}";\n}\n\nvoid ${t.outer}(int n, int ${t.x}) {\n    cout << n << " ";\n    cout << ${t.inner}(${t.x}) << endl;\n}`,
			['string']
		),
		() => Array.from({ length: n }, (_, i) => `${i + 1} ${t.word}`)
	);
	const rows = written(shown)!;
	const numbers = Array.from({ length: n }, (_, i) => i + 1);
	return {
		prompt: 'Una delle due funzioni è già scritta, l\'altra è ancora vuota.',
		problem: `La funzione ${t.inner} è ancora vuota, ${t.outer} è già scritta. Che cosa scrive questo programma?`,
		code: texts(shown),
		solution: rows.join(', '),
		steps: [`Il ciclo chiama ${t.outer} ${n} volte, con k che va da 1 a ${n}.`, `${t.outer} scrive il suo primo parametro e quello che restituisce ${t.inner}.`, `${t.inner} è vuota e restituisce sempre "${t.word}", qualunque valore riceva.`],
		answer: pick(rng, writtenOption(rows), [numbers.map((k) => `${k} ${step * k}`), numbers.map((k) => `${step * k} ${t.word}`), [...numbers, n + 1].map((k) => `${k} ${t.word}`), [t.word], numbers.map(String)].map(writtenOption)),
		params: reference(shown, [[]], { ask: 'output', case: kind, n, step, word: t.word })
	};
}

/** The multiple choice of `choose`, or `TooFew` where fewer than three wrong options are left. */
function pick(rng: Rng, right: Parameters<typeof choose>[1], others: Parameters<typeof choose>[2]) {
	const keys = new Set(others.map((o) => o.values.join('|')));
	keys.delete(right.values.join('|'));
	if (keys.size < 3) throw new TooFew(`${ID}: only ${keys.size} wrong options`);
	return choose(rng, right, others);
}

// ---------------------------------------------------------------- level 4: a program made of two functions

const PAIRS = [
	{ id: 'cinema', inner: 'prezzo', x: 'eta', outer: 'coppia', cut: [10, 12, 14], low: [4, 5, 6], high: [8, 9, 10], what: 'il prezzo di due biglietti' },
	{ id: 'palestra', inner: 'tariffa', x: 'eta', outer: 'famiglia', cut: [16, 18, 25], low: [15, 20, 25], high: [30, 35, 40], what: 'la tariffa di due iscritti' },
	{ id: 'spedizione', inner: 'costo', x: 'peso', outer: 'due_pacchi', cut: [3, 5, 8], low: [2, 3, 4], high: [6, 7, 9], what: 'il costo di due pacchi' },
	{ id: 'sosta', inner: 'sosta', x: 'ore', outer: 'due_auto', cut: [2, 3, 4], low: [1, 2, 3], high: [5, 6, 8], what: 'la sosta di due auto' }
] as const;

/** The mistakes of level 4: each changes one row of the right program. */
type Slip = 'giusto' | 'rami' | 'confine' | 'senza' | 'doppio' | 'fisso';

function pairProgram(t: (typeof PAIRS)[number], cut: number, low: number, high: number, calls: number[][], slip: Slip): Program {
	const cmp = slip === 'confine' ? '<=' : '<';
	const [first, second] = slip === 'rami' ? [high, low] : slip === 'fisso' ? [high, high] : [low, high];
	const sum = slip === 'senza' ? 'a + b' : slip === 'doppio' ? `${t.inner}(a) + ${t.inner}(a)` : `${t.inner}(a) + ${t.inner}(b)`;
	const inner = (x: number) => ((slip === 'confine' ? x <= cut : x < cut) ? first : second);
	const outer = (a: number, b: number) => (slip === 'senza' ? a + b : slip === 'doppio' ? 2 * inner(a) : inner(a) + inner(b));
	return program(
		`
		def ${t.inner}(${t.x}):
		    if ${t.x} ${cmp} ${cut}:
		        return ${first}
		    return ${second}

		def ${t.outer}(a, b):
		    return ${sum}

		${calls.map(([a, b]) => `print(${t.outer}(${a}, ${b}))`).join('\n\t\t')}
		`,
		cppProgram(calls.map(([a, b]) => `cout << ${t.outer}(${a}, ${b}) << endl;`).join('\n'), `int ${t.inner}(int ${t.x}) {\n    if (${t.x} ${cmp} ${cut}) {\n        return ${first};\n    }\n    return ${second};\n}\n\nint ${t.outer}(int a, int b) {\n    return ${sum};\n}`),
		() => calls.map(([a, b]) => String(outer(a, b)))
	);
}

function level4(rng: Rng, t: (typeof PAIRS)[number]): CodeBuilt {
	const cut = rng.pick(t.cut);
	const low = rng.pick(t.low);
	const high = rng.pick(t.high);
	// one pair with a value on each side of the boundary, one with a value exactly on it
	const calls = [
		[cut - rng.int(1, 2), cut + rng.int(1, 9)],
		[cut, cut + rng.int(1, 9)]
	];
	if (rng.int(0, 1) === 1) calls.reverse();
	const shown = pairProgram(t, cut, low, high, calls, 'giusto');
	const rows = written(shown)!;
	const others = wrongPrograms(
		shown,
		(['rami', 'confine', 'senza', 'doppio', 'fisso'] as const).map((slip) => pairProgram(t, cut, low, high, calls, slip)),
		[[]]
	).map((p) => written(p)!);
	const [a, b] = calls[0];
	const value = (x: number) => (x < cut ? low : high);
	return {
		prompt: 'Segui ogni chiamata: una funzione ne chiama un\'altra.',
		problem: 'Che cosa scrive questo programma?',
		code: texts(shown),
		solution: rows.join(', '),
		steps: [
			`${t.outer}(${a}, ${b}) chiama ${t.inner} due volte: ${t.inner}(${a}) restituisce ${value(a)} e ${t.inner}(${b}) restituisce ${value(b)}, quindi la prima riga scritta è ${rows[0]}.`,
			`Nella condizione c'è il segno <: con ${t.x} uguale a ${cut} la condizione è falsa, e la funzione restituisce ${high}.`,
			`La seconda riga scritta è ${rows[1]}.`
		],
		answer: pick(rng, writtenOption(rows), others.map(writtenOption)),
		params: reference(shown, [[]], { ask: 'output', case: t.id, cut, low, high, calls })
	};
}

// ---------------------------------------------------------------- levels 5 and 6: the function that is missing

/** A rule in three bands: the first up to a boundary (inclusive or not), the last above another, the rest between. */
interface Bands {
	id: string;
	name: string;
	x: string;
	/** Whether the first band ends before `a` (`x < a`) or holds it (`x <= a`). */
	strict: boolean;
	a: readonly number[];
	b: readonly number[];
	/** Where the program is from, and the rule in words. */
	where: string;
	rule: (a: number, b: number, p: number, q: number, r: number) => string;
}

const BANDS: readonly Bands[] = [
	{ id: 'cinema', name: 'prezzo', x: 'eta', strict: true, a: [6, 10, 12, 14], b: [60, 65, 70], where: 'che calcola quanto paga un gruppo al cinema', rule: (a, b, p, q, r) => `chi ha meno di ${a} anni paga ${p} euro, chi ne ha più di ${b} paga ${q} euro, tutti gli altri ${r} euro` },
	{ id: 'palestra', name: 'tariffa', x: 'eta', strict: true, a: [14, 16, 18], b: [55, 60, 65], where: 'che calcola le quote di una palestra', rule: (a, b, p, q, r) => `chi ha meno di ${a} anni paga ${p} euro al mese, chi ne ha più di ${b} paga ${q} euro, tutti gli altri ${r} euro` },
	{ id: 'biblioteca', name: 'multa', x: 'giorni', strict: false, a: [3, 5, 7], b: [14, 20, 30], where: 'che calcola le multe di una biblioteca', rule: (a, b, p, q, r) => `fino a ${a} giorni di ritardo la multa è di ${p} euro, oltre i ${b} giorni è di ${q} euro, negli altri casi di ${r} euro` },
	{ id: 'spedizione', name: 'costo', x: 'peso', strict: false, a: [2, 3, 5], b: [10, 15, 20], where: 'che calcola il costo delle spedizioni', rule: (a, b, p, q, r) => `un pacco fino a ${a} chili costa ${p} euro, uno oltre i ${b} chili costa ${q} euro, gli altri ${r} euro` },
	{ id: 'sosta', name: 'sosta', x: 'ore', strict: false, a: [1, 2, 3], b: [6, 8, 10], where: 'che calcola il prezzo di un parcheggio', rule: (a, b, p, q, r) => `fino a ${a} ore la sosta costa ${p} euro, oltre le ${b} ore costa ${q} euro, negli altri casi ${r} euro` }
];

/** One way of writing the function of a rule: the two comparisons and the three values, or one value for all. */
interface BandCode {
	first: '<' | '<=' | '>' | '>=';
	second: '<' | '<=' | '>' | '>=';
	values: [number, number, number];
	flat?: boolean;
}

const holds = (op: BandCode['first'], x: number, k: number) => (op === '<' ? x < k : op === '<=' ? x <= k : op === '>' ? x > k : x >= k);
const bandValue = (c: BandCode, a: number, b: number, x: number) => (c.flat ? c.values[2] : holds(c.first, x, a) ? c.values[0] : holds(c.second, x, b) ? c.values[1] : c.values[2]);

const bandShown = (t: Bands, a: number, b: number, c: BandCode): CodeText =>
	c.flat
		? { python: `def ${t.name}(${t.x}):\n    return ${c.values[2]}\n`, cpp: `int ${t.name}(int ${t.x}) {\n    return ${c.values[2]};\n}\n` }
		: {
				python: `def ${t.name}(${t.x}):\n    if ${t.x} ${c.first} ${a}:\n        return ${c.values[0]}\n    elif ${t.x} ${c.second} ${b}:\n        return ${c.values[1]}\n    else:\n        return ${c.values[2]}\n`,
				cpp: `int ${t.name}(int ${t.x}) {\n    if (${t.x} ${c.first} ${a}) {\n        return ${c.values[0]};\n    } else if (${t.x} ${c.second} ${b}) {\n        return ${c.values[1]};\n    } else {\n        return ${c.values[2]};\n    }\n}\n`
			};

/** The right function of a rule and the mistakes a student makes writing it, each a different one. */
function bandCodes(t: Bands, p: number, q: number, r: number): { right: BandCode; wrong: BandCode[] } {
	const first = t.strict ? '<' : '<=';
	const right: BandCode = { first, second: '>', values: [p, q, r] };
	return {
		right,
		wrong: [
			{ ...right, first: t.strict ? '<=' : '<' },
			{ ...right, second: '>=' },
			{ ...right, values: [q, p, r] },
			{ ...right, values: [p, r, q] },
			{ ...right, first: '>', second: '<' },
			{ ...right, flat: true }
		]
	};
}

/** The numbers of a rule: the two boundaries and three different values. */
function bandNumbers(rng: Rng, t: Bands) {
	const a = rng.pick(t.a);
	const b = rng.pick(t.b);
	const [p, q, r] = some(rng, [2, 3, 4, 5, 6, 7, 8, 9, 10, 12], 3);
	return { a, b, p, q, r };
}

/** The function tried on the values around its two boundaries, one row written for each. */
function bandTried(t: Bands, a: number, b: number, c: BandCode, values: number[]): Program {
	const shown = bandShown(t, a, b, c);
	return program(`${shown.python}\n${values.map((x) => `print(${t.name}(${x}))`).join('\n')}\n`, cppProgram(values.map((x) => `cout << ${t.name}(${x}) << endl;`).join('\n'), shown.cpp), () => values.map((x) => String(bandValue(c, a, b, x))));
}

function level5(rng: Rng, t: Bands): CodeBuilt {
	const { a, b, p, q, r } = bandNumbers(rng, t);
	const { right, wrong } = bandCodes(t, p, q, r);
	const values = [a - 1, a, a + 1, b, b + 1];
	const whole = bandTried(t, a, b, right, values);
	const candidates = wrong.map((c) => ({ code: c, whole: bandTried(t, a, b, c, values) }));
	const kept = wrongPrograms(
		whole,
		candidates.map((c) => c.whole),
		[[]]
	);
	if (kept.length < 3) throw new TooFew(`${ID}: only ${kept.length} wrong functions`);
	const option = (prog: Program) => programOption(prog, bandShown(t, a, b, prog === whole ? right : candidates.find((c) => c.whole === prog)!.code));
	const cmp = t.strict ? '<' : '<=';
	return {
		prompt: 'Controlla i confini delle fasce e il valore di ogni ramo.',
		problem: `In un programma ${t.where} la funzione ${t.name}(${t.x}) è ancora vuota. La regola: ${t.rule(a, b, p, q, r)}. Quale funzione va messa al posto di quella vuota?`,
		solution: `La funzione con ${t.x} ${cmp} ${a} nel primo ramo, ${t.x} > ${b} nel secondo, e i valori ${p}, ${q} e ${r} in quest'ordine.`,
		steps: [`Il primo ramo è per ${t.strict ? `chi sta sotto ${a}, ${a} escluso` : `chi arriva fino a ${a}, ${a} compreso`}: la condizione è ${t.x} ${cmp} ${a}, e il valore ${p}.`, `Il secondo ramo è per chi supera ${b}: ${t.x} > ${b}, con il valore ${q}. A tutti gli altri resta ${r}.`, 'Una funzione che restituisce lo stesso valore per tutti è ancora quella vuota.'],
		solutionCode: bandShown(t, a, b, right),
		answer: choose(
			rng,
			option(whole),
			kept.map((k) => option(k))
		),
		params: reference(whole, [[]], { case: t.id, strict: t.strict, a, b, values: [p, q, r], tried: values })
	};
}

/** What the open level asks for: a function with its mistakes, the program that reads and calls it, the runs. */
interface Missing {
	family: 'fasce' | 'migliore' | 'sconto';
	name: string;
	params: string[];
	/** What the program reads, and what the function must give back, as the exercise says it. */
	reads: string;
	gives: string;
	hint: string;
	right: { shown: CodeText; of: (...xs: number[]) => number };
	wrong: { shown: CodeText; of: (...xs: number[]) => number }[];
	tests: string[][];
	extra: Record<string, unknown>;
}

const MISSING = ['fasce', 'migliore', 'sconto'] as const;

function missing(rng: Rng, family: Missing['family']): Missing {
	if (family === 'fasce') {
		const t = rng.pick(BANDS);
		const { a, b, p, q, r } = bandNumbers(rng, t);
		const { right, wrong } = bandCodes(t, p, q, r);
		const made = (c: BandCode) => ({ shown: bandShown(t, a, b, c), of: (x: number) => bandValue(c, a, b, x) });
		return {
			family,
			name: t.name,
			params: [t.x],
			reads: `un numero intero, ${t.x}`,
			gives: `il valore di questa regola: ${t.rule(a, b, p, q, r)}`,
			hint: `Nel corpo serve una selezione a tre vie: prima ${t.x} ${t.strict ? '<' : '<='} ${a}, poi ${t.x} > ${b}, poi tutti gli altri.`,
			right: made(right),
			wrong: wrong.map(made),
			tests: [[String(a - 1)], [String(a)], [String(a + 1)], [String(b)], [String(b + 1)]],
			extra: { theme: t.id, strict: t.strict, a, b, values: [p, q, r] }
		};
	}
	if (family === 'migliore') {
		const lower = rng.int(0, 1) === 0;
		const name = lower ? 'migliore' : 'record';
		const cmp = lower ? '<' : '>';
		const made = (python: string[], cpp: string[], of: (a: number, b: number) => number) => ({ shown: { python: `def ${name}(a, b):\n${python.map((row) => `    ${row}`).join('\n')}\n`, cpp: `int ${name}(int a, int b) {\n${cpp.map((row) => `    ${row}`).join('\n')}\n}\n` }, of: of as (...xs: number[]) => number });
		const best = (a: number, b: number) => (lower ? Math.min(a, b) : Math.max(a, b));
		const worst = (a: number, b: number) => (lower ? Math.max(a, b) : Math.min(a, b));
		const tests: string[][] = [];
		while (tests.length < 3) {
			const x = rng.int(40, 99);
			const y = rng.int(40, 99);
			// the first run has the better value first, the second has it second: a function that gives back one parameter fails one of the two
			const pair = tests.length === 0 ? [best(x, y), worst(x, y)] : tests.length === 1 ? [worst(x, y), best(x, y)] : [x, y];
			if (x !== y && !tests.some((t) => t.includes(String(x)) || t.includes(String(y)))) tests.push(pair.map(String));
		}
		return {
			family,
			name,
			params: ['a', 'b'],
			reads: lower ? 'i tempi in secondi di due prove di un atleta, a e b' : 'i punteggi di due partite di un giocatore, a e b',
			gives: lower ? 'il tempo migliore, cioè il più basso dei due' : 'il punteggio record, cioè il più alto dei due',
			hint: `Nel corpo serve una selezione che confronta a e b con il segno ${cmp}.`,
			right: made([`if a ${cmp} b:`, '    return a', 'return b'], [`if (a ${cmp} b) {`, '    return a;', '}', 'return b;'], best),
			wrong: [
				made([`if a ${cmp} b:`, '    return b', 'return a'], [`if (a ${cmp} b) {`, '    return b;', '}', 'return a;'], worst),
				made(['return a'], ['return a;'], (a) => a),
				made(['return b'], ['return b;'], (_, b) => b),
				made(['return a + b'], ['return a + b;'], (a, b) => a + b),
				made([`if a ${cmp} b:`, '    return a', 'return a + b'], [`if (a ${cmp} b) {`, '    return a;', '}', 'return a + b;'], (a, b) => (best(a, b) === a ? a : a + b))
			],
			tests,
			extra: { lower }
		};
	}
	const least = rng.int(3, 6);
	const off = rng.int(2, 9);
	const made = (python: string[], cpp: string[], of: (prezzo: number, posti: number) => number) => ({
		shown: { python: `def spesa(prezzo, posti):\n${python.map((row) => `    ${row}`).join('\n')}\n`, cpp: `int spesa(int prezzo, int posti) {\n${cpp.map((row) => `    ${row}`).join('\n')}\n}\n` },
		of: of as (...xs: number[]) => number
	});
	const body = (cond: string | null, then: string) => ({
		python: ['totale = prezzo * posti', ...(cond ? [`if ${cond}:`, `    ${then}`] : [then]), 'return totale'],
		cpp: ['int totale = prezzo * posti;', ...(cond ? [`if (${cond}) {`, `    ${then};`, '}'] : [`${then};`]), 'return totale;']
	});
	const variant = (cond: string | null, then: string, of: (prezzo: number, posti: number) => number) => made(body(cond, then).python, body(cond, then).cpp, of);
	const tests: string[][] = [];
	for (const posti of [least - 1, least, least + 1]) {
		let prezzo = rng.int(5, 12);
		while (tests.some((t) => t[0] === String(prezzo))) prezzo = rng.int(5, 12);
		tests.push([String(prezzo), String(posti)]);
	}
	return {
		family,
		name: 'spesa',
		params: ['prezzo', 'posti'],
		reads: 'il prezzo di un biglietto e il numero di posti che prenoti',
		gives: `la spesa totale: il prezzo per il numero dei posti, con ${off} euro di sconto quando i posti sono almeno ${least}`,
		hint: `Calcola il totale in una variabile locale, togli ${off} quando posti >= ${least}, poi restituiscilo.`,
		right: variant(`posti >= ${least}`, `totale = totale - ${off}`, (p, n) => p * n - (n >= least ? off : 0)),
		wrong: [
			variant(`posti > ${least}`, `totale = totale - ${off}`, (p, n) => p * n - (n > least ? off : 0)),
			variant(null, `totale = totale - ${off}`, (p, n) => p * n - off),
			variant(`posti >= ${least}`, `totale = totale + ${off}`, (p, n) => p * n + (n >= least ? off : 0)),
			variant(`posti < ${least}`, `totale = totale - ${off}`, (p, n) => p * n - (n < least ? off : 0)),
			variant(`posti >= ${least}`, `totale = ${off}`, (p, n) => (n >= least ? off : p * n))
		],
		tests,
		extra: { least, off }
	};
}

/** The program that reads the numbers, calls the function and writes what it gives back. */
function reading(m: Missing, f: Missing['right']): Program {
	const call = `${m.name}(${m.params.join(', ')})`;
	return program(`${f.shown.python}\n${m.params.map((x) => `${x} = int(input())`).join('\n')}\nprint(${call})\n`, cppProgram(`int ${m.params.join(', ')};\n${m.params.map((x) => `cin >> ${x};`).join('\n')}\ncout << ${call} << endl;`, f.shown.cpp), (input) => {
		const next = reader(input);
		return [String(f.of(...m.params.map(() => Number(next()))))];
	});
}

function level6(rng: Rng, family: Missing['family']): CodeBuilt {
	const m = missing(rng, family);
	const solution = reading(m, m.right);
	const others = m.wrong.map((f) => ({ f, whole: reading(m, f) }));
	const kept = wrongPrograms(
		solution,
		others.map((o) => o.whole),
		m.tests
	);
	if (kept.length < 3 || new Set(m.tests.map((t) => written(solution, t)![0])).size < 2) throw new TooFew(`${ID}: only ${kept.length} wrong functions for ${family}`);
	const call = `${m.name}(${m.params.join(', ')})`;
	const start = {
		python: `# scrivi qui la funzione ${m.name}\n\n${m.params.map((x) => `${x} = int(input())`).join('\n')}\n# scrivi qui chiamata e stampa\n`,
		cpp: cppProgram(`int ${m.params.join(', ')};\n${m.params.map((x) => `cin >> ${x};`).join('\n')}\n// scrivi qui chiamata e stampa`, `// scrivi qui la funzione ${m.name}\n`)
	};
	return {
		prompt: 'Scrivi la funzione che manca.',
		problem: `Il programma principale legge ${m.reads}, uno per riga, poi deve chiamare la funzione ${call} e scrivere quello che restituisce. La lettura c'è già. Scrivi la funzione ${m.name}, che restituisce ${m.gives}, poi chiamala e scrivi il risultato.`,
		solution: `Una funzione ${call} definita prima del programma principale, che restituisce il risultato con return.`,
		steps: [`Sopra il programma principale definisci la funzione ${m.name} con ${m.params.length === 1 ? `il parametro ${m.params[0]}` : `i parametri ${m.params.join(' e ')}`}.`, m.hint, `La funzione non scrive niente: restituisce il risultato. Dopo la lettura il programma principale chiama ${call} e scrive quello che riceve.`],
		solutionCode: texts(solution),
		answer: needing(programAnswer(solution, start, m.tests), 'funzione'),
		choice: choose(
			rng,
			programOption(solution, m.right.shown),
			kept.map((k) => programOption(k, others.find((o) => o.whole === k)!.f.shown))
		),
		params: reference(solution, m.tests, { case: family, ...m.extra })
	};
}

/** The levels of words have no program to run. */
const worded = (sample: { params: Record<string, unknown> }) => (sample.params.program ? ['a level of words has no program'] : []);

export default makeCodeGenerator(ID, 'Scomporre un problema: la progettazione top-down', {
	1: { label: 'Riconoscere i sottoproblemi', constraints: ['a problem in a sentence and four pieces', 'one right piece'], build: drawn(SUBPROBLEM_KINDS, level1), check: worded },
	2: { label: 'Che cosa riceve e restituisce', constraints: ['a subproblem and its function', 'in words, or one row of code'], build: drawn(SIGNATURE_KINDS, level2), check: worded },
	3: { label: 'Funzioni ancora vuote', constraints: ['a main program with functions that give back a fixed value', 'four different outputs'], build: drawn(EMPTY_KINDS, level3) },
	4: { label: 'Seguire il programma scomposto', constraints: ['two functions, one calls the other', 'a value exactly on the boundary'], build: drawn(PAIRS, level4) },
	5: { label: 'Riempire la funzione vuota', constraints: ['a rule in three bands', 'four functions shown alone'], build: drawn(BANDS, level5) },
	6: { label: 'Scrivere la funzione che manca', constraints: ['the reading is given', 'graded by running it', 'needs a function of its own'], build: drawn(MISSING, level6) }
});
