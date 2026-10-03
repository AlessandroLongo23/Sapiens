/**
 * Grafici per rappresentare i dati. Spec: specs/exercises/inf-grafici-dati.md
 *
 * Four levels from the lesson (docs/lezioni/informatica/riscritte/27-inf-grafici-dati.md): series, categories and
 * legend of a column chart made from a generated table; the chart that fits a situation; the defect of a chart
 * chosen badly; what a vertical axis that does not start from zero does to two columns. The situations are built
 * from interchangeable pieces (who, which data, how many, to do what); `params` names the pieces, and the checker
 * rebuilds the answer from its own table of pieces.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { type Cell, NAMES, block, choose, commonViolations, numberChoice, pickDistinct, sheet, textOpt, ttIn, wrapOpt } from '../inf-foglio-dati';

export const ID = 'inf-grafici-dati';

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: Sample['answer'];
	params: Record<string, unknown>;
}

const para = (text: string): string => block([text]);

// ---------------------------------------------------------------------------
// Level 1: series, categories, legend

interface TableTheme {
	cat: string;
	cats: string[];
	/** Categories with an order (months, days) are taken as a run; the others are drawn. */
	ordered: boolean;
	series: string[];
	what: string;
	minCats: number;
	maxCats: number;
}

const TABLES: TableTheme[] = [
	{ cat: 'Mese', cats: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu'], ordered: true, series: ['1A', '1B', '1C'], what: 'i libri presi in prestito in biblioteca da alcune classi', minCats: 3, maxCats: 5 },
	{ cat: 'Giorno', cats: ['lun', 'mar', 'mer', 'gio', 'ven'], ordered: true, series: ['Mensa', 'Bar', 'Forno'], what: 'i panini venduti in una scuola', minCats: 3, maxCats: 5 },
	{ cat: 'Sport', cats: ['calcio', 'nuoto', 'tennis', 'basket', 'danza', 'judo'], ordered: false, series: ['Maschi', 'Femmine'], what: 'gli iscritti ai corsi di un centro sportivo', minCats: 3, maxCats: 5 },
	{ cat: 'Città', cats: ['Roma', 'Bari', 'Pisa', 'Lecce', 'Parma'], ordered: false, series: ['Estate', 'Inverno'], what: 'i giorni di pioggia in alcune città', minCats: 3, maxCats: 4 },
	{ cat: 'Gusto', cats: ['limone', 'fragola', 'cacao', 'crema', 'menta'], ordered: false, series: ['Sabato', 'Domenica'], what: 'i gelati venduti in un fine settimana', minCats: 3, maxCats: 5 },
];

type Ask1 = 'serie' | 'categorie' | 'colonne' | 'legenda' | 'asse' | 'altezza';
const ASK1: Ask1[] = ['serie', 'categorie', 'colonne', 'legenda', 'asse', 'altezza'];

function level1(rng: Rng): Built {
	const th = rng.int(0, TABLES.length - 1);
	const T = TABLES[th];
	const nc = rng.int(T.minCats, T.maxCats);
	const ns = Math.min(T.series.length, rng.int(2, 3));
	const start = rng.int(0, T.cats.length - nc);
	const cats = T.ordered ? T.cats.slice(start, start + nc) : pickDistinct(rng, T.cats, nc);
	const series = T.series.slice(0, ns);
	// all the numbers different, so that a column of the chart is one cell of the table
	const values = pickDistinct(
		rng,
		Array.from({ length: 28 }, (_, i) => i + 3),
		nc * ns,
	);
	const rows: Cell[][] = cats.map((c, i) => [c, ...series.map((_, j) => values[i * ns + j])]);
	const header = [T.cat, ...series];
	const last = `${'ABCD'[ns]}${nc + 1}`;
	const head = [
		`Il foglio contiene ${T.what}.`,
		sheet(header, rows),
		`Con le celle da ${ttIn('A1')} a ${ttIn(last)} si crea un grafico a colonne: la colonna ${ttIn('A')} dà le categorie e ogni altra colonna del foglio è una serie di dati.`,
	];
	const ask = rng.pick(ASK1);
	const list = (xs: (string | number)[]) => xs.join(', ');
	const num = (v: number, question: string, steps: string[], mistakes: number[]): Built => ({
		prompt: 'Leggi come è fatto il grafico.',
		problem: block([...head, question]),
		solution: String(v),
		steps: steps.map(para),
		answer: { kind: 'number', value: String(v) },
		params: { case: ask, theme: th, mistakes },
	});
	if (ask === 'serie') return num(ns, 'Quante serie di dati ha il grafico?', [`Ogni colonna di numeri del foglio è una serie: ${list(series)}. Le serie sono $${ns}$.`], [nc, ns * nc, ns + 1, nc + 1]);
	if (ask === 'categorie') return num(nc, "Quante categorie ci sono sull'asse orizzontale?", [`Le categorie sono le etichette della colonna ${ttIn('A')}, sotto l'intestazione: ${list(cats)}. Sono $${nc}$.`], [ns, nc + 1, ns * nc, ns + 1]);
	if (ask === 'colonne')
		return num(
			ns * nc,
			'Quante colonne vengono disegnate in tutto nel grafico?',
			[`Per ogni categoria il grafico disegna una colonna per ogni serie: $${ns}$ colonne affiancate.`, `Le categorie sono $${nc}$: in tutto $${nc} \\cdot ${ns} = ${ns * nc}$ colonne.`],
			[nc, ns, nc + ns, (nc + 1) * (ns + 1), (nc + 1) * ns],
		);
	if (ask === 'altezza') {
		const i = rng.int(0, nc - 1);
		const j = rng.int(0, ns - 1);
		const v = rows[i][j + 1] as number;
		const other = [rows[(i + 1) % nc][j + 1], rows[i][((j + 1) % ns) + 1], rows[(i + nc - 1) % nc][j + 1], ...values] as number[];
		return num(
			v,
			`A quale valore arriva, sull'asse verticale, la colonna della serie ${series[j]} per la categoria ${cats[i]}?`,
			[`La serie ${series[j]} è la colonna ${ttIn('ABCD'[j + 1])} del foglio; la categoria ${cats[i]} è nella riga $${i + 2}$.`, `La colonna del grafico è alta quanto il numero della cella ${ttIn(`${'ABCD'[j + 1]}${i + 2}`)}: $${v}$.`],
			other,
		);
	}
	const right = ask === 'legenda' ? list(series) : list(cats);
	const wrong = [ask === 'legenda' ? list(cats) : list(series), list(rows.map((r) => r[1])), list(rows[0].slice(1)), T.cat];
	return {
		prompt: 'Leggi come è fatto il grafico.',
		problem: block([...head, ask === 'legenda' ? 'Quali nomi compaiono nella legenda del grafico?' : "Quali etichette compaiono lungo l'asse orizzontale?"]),
		solution: wrapOpt(right).latex,
		steps: [
			para(
				ask === 'legenda'
					? `La legenda dice quale colore corrisponde a quale serie: riporta i nomi delle serie, cioè le intestazioni delle colonne di numeri, ${right}.`
					: `Sull'asse orizzontale ci sono le categorie, cioè le etichette della colonna ${ttIn('A')}: ${right}.`,
			),
		],
		answer: choose(
			rng,
			wrapOpt(right),
			wrong.map((x) => wrapOpt(x)),
		),
		params: { case: ask, theme: th },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the chart that fits

export const CHARTS = ['colonne', 'linee', 'torta', 'dispersione'] as const;
type Chart = (typeof CHARTS)[number];
const chartName = (c: Chart): string => `Grafico a ${c}`;

interface Piece {
	id: string;
	/** The data, with `#` where the number goes. */
	text: string;
	ns: number[];
}

const DATA: Record<Chart, Piece[]> = {
	colonne: [
		{ id: 'c1', text: 'il numero di iscritti a # corsi pomeridiani della scuola', ns: [4, 5, 6] },
		{ id: 'c2', text: 'i punti finali delle # squadre di un torneo', ns: [4, 5, 6, 8] },
		{ id: 'c3', text: 'i libri presi in prestito in un mese da # classi', ns: [4, 5, 6] },
		{ id: 'c4', text: 'le calorie di # merendine diverse', ns: [4, 5, 6] },
		{ id: 'c5', text: "l'altezza di # montagne italiane", ns: [4, 5, 6] },
		{ id: 'c6', text: 'il prezzo dello stesso zaino in # negozi', ns: [3, 4, 5] },
		{ id: 'c7', text: 'il numero di abitanti di # città della regione', ns: [4, 5, 6] },
		{ id: 'c8', text: 'i gol segnati in una stagione da # giocatori', ns: [4, 5, 6] },
	],
	linee: [
		{ id: 'l1', text: 'la temperatura esterna misurata ogni ora per # ore', ns: [12, 24, 48] },
		{ id: 'l2', text: "l'altezza di una pianta misurata ogni settimana per # settimane", ns: [8, 10, 12] },
		{ id: 'l3', text: 'il numero di visitatori di un museo in ognuno degli ultimi # mesi', ns: [12, 18, 24] },
		{ id: 'l4', text: 'il prezzo della benzina rilevato ogni lunedì per # settimane', ns: [10, 20, 30] },
		{ id: 'l5', text: 'i passi contati dal telefono in ognuno degli ultimi # giorni', ns: [14, 30, 60] },
		{ id: 'l6', text: 'il livello di un fiume misurato ogni giorno per # giorni', ns: [15, 30, 60] },
		{ id: 'l7', text: 'gli iscritti alla scuola in ognuno degli ultimi # anni', ns: [10, 15, 20] },
		{ id: 'l8', text: "la carica della batteria del telefono letta ogni mezz'ora per # ore", ns: [6, 8, 12] },
	],
	torta: [
		{ id: 't1', text: 'la paghetta del mese divisa in # voci di spesa', ns: [3, 4, 5] },
		{ id: 't2', text: 'gli studenti della classe divisi tra # mezzi per venire a scuola', ns: [3, 4, 5] },
		{ id: 't3', text: 'le $24$ ore di una giornata divise tra # attività', ns: [3, 4, 5] },
		{ id: 't4', text: "i voti dell'elezione dei rappresentanti divisi tra # candidati", ns: [3, 4] },
		{ id: 't5', text: 'la memoria occupata del telefono divisa tra # tipi di file', ns: [3, 4, 5] },
		{ id: 't6', text: 'il costo di una gita diviso tra # voci di spesa', ns: [3, 4] },
	],
	dispersione: [
		{ id: 'd1', text: 'le ore di studio e il voto della verifica di # compagni', ns: [15, 20, 25] },
		{ id: 'd2', text: "l'altezza e il numero di scarpe di # persone", ns: [20, 30, 40] },
		{ id: 'd3', text: 'la potenza e il consumo di # modelli di auto', ns: [15, 20, 30] },
		{ id: 'd4', text: 'la temperatura e il numero di gelati venduti in # giorni diversi', ns: [20, 30, 40] },
		{ id: 'd5', text: "la massa appesa e l'allungamento di una molla in # prove", ns: [8, 10, 12] },
		{ id: 'd6', text: 'la superficie e il prezzo di # appartamenti', ns: [20, 30, 50] },
	],
};

const PURPOSES: Record<Chart, string[]> = {
	colonne: ['Vuole confrontare i valori tra loro.', "Vuole far vedere a colpo d'occhio chi ha il valore più grande e chi il più piccolo."],
	linee: ['Vuole mostrare come cambia il valore con il passare del tempo.', "Vuole far vedere l'andamento nel tempo: quando sale e quando scende."],
	torta: ['Vuole mostrare quanto pesa ogni parte sul totale.', 'Vuole far vedere che parte del totale spetta a ogni voce.'],
	dispersione: ['Vuole capire se le due grandezze sono legate tra loro.', "Vuole vedere se, quando cresce una grandezza, cresce anche l'altra."],
};

const WHY: Record<Chart, string> = {
	colonne: "I dati sono valori di categorie diverse, da confrontare tra loro: l'altezza delle colonne li confronta a colpo d'occhio.",
	linee: "I dati sono misure della stessa grandezza in momenti successivi: la linea che unisce i punti mostra l'andamento nel tempo.",
	torta: "I dati sono le parti di un totale, e sono poche: le fette della torta mostrano quanto pesa ciascuna sull'intero.",
	dispersione: 'Per ogni caso ci sono due grandezze misurate: ogni caso diventa un punto, e la nuvola di punti mostra se le due grandezze sono legate.',
};

const fill = (p: Piece, n: number): string => p.text.replace('#', `$${n}$`);

function level2(rng: Rng): Built {
	const chart = rng.pick(CHARTS);
	const piece = rng.pick(DATA[chart]);
	const n = rng.pick(piece.ns);
	const purpose = rng.int(0, PURPOSES[chart].length - 1);
	const name = rng.pick(NAMES);
	return {
		prompt: 'Scegli il grafico più adatto.',
		problem: block([`${name} ha raccolto in un foglio di calcolo ${fill(piece, n)}. ${PURPOSES[chart][purpose]} Quale grafico è il più adatto?`]),
		solution: textOpt(chartName(chart)).latex,
		steps: [para(WHY[chart]), para(`Il grafico più adatto è il grafico a ${chart}.`)],
		answer: choose(
			rng,
			textOpt(chartName(chart)),
			CHARTS.filter((c) => c !== chart).map((c) => textOpt(chartName(c))),
		),
		params: { case: chart, data: piece.id, n, purpose, name },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the defect of a chart

export const DEFECTS = {
	'non-totale': 'Torta, ma i dati non sono parti di un totale',
	'troppe-fette': 'Torta con troppe fette',
	'senza-ordine': 'Linea tra categorie senza ordine',
	nessuno: 'Nessun difetto',
} as const;
type Defect = keyof typeof DEFECTS;

interface Case3 extends Piece {
	chart: Chart;
}

const CASES3: Record<Defect, Case3[]> = {
	'non-totale': [
		{ id: 'n1', chart: 'torta', text: "la temperatura massima di # città in un giorno d'estate", ns: [3, 4, 5] },
		{ id: 'n2', chart: 'torta', text: "l'altezza di # compagni di classe", ns: [3, 4, 5] },
		{ id: 'n3', chart: 'torta', text: 'il prezzo di # modelli di telefono', ns: [3, 4, 5] },
		{ id: 'n4', chart: 'torta', text: 'il voto medio di # classi nella stessa verifica', ns: [3, 4, 5] },
		{ id: 'n5', chart: 'torta', text: 'la velocità massima di # automobili', ns: [3, 4, 5] },
		{ id: 'n6', chart: 'torta', text: 'la durata della batteria di # telefoni', ns: [3, 4, 5] },
	],
	'troppe-fette': [
		{ id: 'f1', chart: 'torta', text: 'le vendite di una gelateria divise tra # gusti', ns: [14, 18, 24] },
		{ id: 'f2', chart: 'torta', text: 'gli studenti di una scuola divisi tra le sue # classi', ns: [15, 20, 30] },
		{ id: 'f3', chart: 'torta', text: "la spesa dell'anno di una famiglia divisa tra # voci", ns: [12, 16, 20] },
		{ id: 'f4', chart: 'torta', text: 'gli abitanti di una provincia divisi tra i suoi # comuni', ns: [25, 40, 60] },
		{ id: 'f5', chart: 'torta', text: 'i libri di una biblioteca divisi tra # generi', ns: [12, 15, 18] },
	],
	'senza-ordine': [
		{ id: 's1', chart: 'linee', text: 'il numero di studenti che preferiscono ciascuno di # sport', ns: [4, 5, 6] },
		{ id: 's2', chart: 'linee', text: 'i punti finali delle # squadre di un torneo', ns: [4, 5, 6] },
		{ id: 's3', chart: 'linee', text: 'il numero di abitanti di # città', ns: [4, 5, 6] },
		{ id: 's4', chart: 'linee', text: 'i gelati venduti in un giorno per ciascuno di # gusti', ns: [4, 5, 6] },
		{ id: 's5', chart: 'linee', text: 'il prezzo dello stesso zaino in # negozi', ns: [4, 5, 6] },
		{ id: 's6', chart: 'linee', text: 'le calorie di # merendine diverse', ns: [4, 5, 6] },
	],
	nessuno: [
		{ id: 'k1', chart: 'torta', text: 'gli studenti di una classe divisi tra # mezzi per venire a scuola', ns: [3, 4, 5] },
		{ id: 'k2', chart: 'linee', text: 'la temperatura esterna misurata ogni ora per # ore', ns: [12, 24, 48] },
		{ id: 'k3', chart: 'colonne', text: 'i punti finali delle # squadre di un torneo', ns: [4, 5, 6] },
		{ id: 'k4', chart: 'torta', text: 'la paghetta del mese divisa in # voci di spesa', ns: [3, 4, 5] },
		{ id: 'k5', chart: 'linee', text: 'gli iscritti alla scuola in ognuno degli ultimi # anni', ns: [10, 15, 20] },
		{ id: 'k6', chart: 'colonne', text: 'il prezzo di # modelli di telefono', ns: [3, 4, 5] },
		{ id: 'k7', chart: 'colonne', text: "la temperatura massima di # città in un giorno d'estate", ns: [3, 4, 5] },
		{ id: 'k8', chart: 'linee', text: 'il livello di un fiume misurato ogni giorno per # giorni', ns: [15, 30, 60] },
	],
};

const WHY3: Record<Defect, string> = {
	'non-totale': "Una torta mostra come un totale si divide in parti. Questi valori non sono parti di un totale: sommarli non ha senso, e le fette non dicono niente. Servono le colonne.",
	'troppe-fette': 'I dati sono parti di un totale, ma le fette sono troppe: diventano sottili e non si distinguono. Meglio un grafico a colonne, oppure riunire le voci piccole in una sola.',
	'senza-ordine': "Una linea unisce punti che vengono uno dopo l'altro, di solito nel tempo. Queste categorie non hanno un ordine: la linea suggerisce un andamento che non esiste. Servono le colonne.",
	nessuno: 'Il grafico scelto è quello adatto a questi dati: non ha nessuno dei tre difetti.',
};

function level3(rng: Rng): Built {
	const r = rng.next();
	const defect: Defect = r < 0.25 ? 'non-totale' : r < 0.5 ? 'troppe-fette' : r < 0.75 ? 'senza-ordine' : 'nessuno';
	const piece = rng.pick(CASES3[defect]);
	const n = rng.pick(piece.ns);
	const name = rng.pick(NAMES);
	const right = wrapOpt(DEFECTS[defect], defect);
	return {
		prompt: 'Trova il difetto del grafico.',
		problem: block([`${name} ha rappresentato con un grafico a ${piece.chart} ${fill(piece, n)}. Qual è il difetto del grafico?`]),
		solution: right.latex,
		steps: [para(WHY3[defect])],
		answer: choose(
			rng,
			right,
			(Object.keys(DEFECTS) as Defect[]).filter((d) => d !== defect).map((d) => wrapOpt(DEFECTS[d], d)),
		),
		params: { case: defect, data: piece.id, n, chart: piece.chart, name },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the axis that does not start from zero

interface Context {
	id: string;
	what: string;
	x: string;
	y: string;
}

const CONTEXTS: Context[] = [
	{ id: 'squadre', what: 'i punti di due squadre', x: 'Rossi', y: 'Blu' },
	{ id: 'palestre', what: 'gli iscritti di due palestre', x: 'Olimpia', y: 'Atlas' },
	{ id: 'negozi', what: 'le vendite di due negozi, in migliaia di euro', x: 'Centro', y: 'Porto' },
	{ id: 'musei', what: 'i visitatori di due musei in un giorno', x: 'Civico', y: 'Navale' },
	{ id: 'canali', what: 'le visualizzazioni di due video, in migliaia', x: 'Alfa', y: 'Beta' },
	{ id: 'classi', what: 'i libri letti in un anno da due classi', x: '1A', y: '1B' },
];

function level4(rng: Rng): Built {
	const C = rng.pick(CONTEXTS);
	const v1 = rng.pick([40, 50, 60, 80, 100, 120, 200, 400, 500]);
	const p = rng.pick([5, 10, 20, 25, 50]);
	const k = rng.pick([2, 3, 4, 5, 6]);
	const v2 = v1 + (v1 * p) / 100;
	const d = (v2 - v1) / (k - 1);
	if (!Number.isInteger(v2) || !Number.isInteger(d)) throw new Error('retry');
	const a = v1 - d;
	if (a <= 0) throw new Error('retry');
	// which of the two is larger changes from one exercise to the next
	const [small, big] = rng.next() < 0.5 ? [C.x, C.y] : [C.y, C.x];
	const head = `Un grafico a colonne confronta ${C.what}: ${small} ha $${v1}$ e ${big} ha $${v2}$. L'asse verticale non parte da zero, ma da $${a}$.`;
	const apparent = rng.next() < 0.6;
	if (apparent)
		return {
			prompt: "Leggi il grafico con l'asse tagliato.",
			problem: block([`${head} Sul grafico, quante volte la colonna di ${big} è alta rispetto a quella di ${small}?`]),
			solution: String(k),
			steps: [
				para(`L'altezza disegnata di una colonna è il valore meno il punto da cui parte l'asse. ${small}: $${v1} - ${a} = ${d}$. ${big}: $${v2} - ${a} = ${v2 - a}$.`),
				para(`Rapporto tra le altezze: $${v2 - a} : ${d} = ${k}$. La colonna di ${big} appare alta $${k}$ volte l'altra, anche se il suo valore è più grande solo del $${p}\\%$.`),
			],
			answer: { kind: 'number', value: String(k) },
			params: { case: 'apparente', context: C.id, mistakes: [1, k + 1, k - 1, v2 - v1, p] },
		};
	return {
		prompt: "Leggi il grafico con l'asse tagliato.",
		problem: block([`${head} Sul grafico la colonna di ${big} è alta $${k}$ volte quella di ${small}. Di quale percentuale il valore di ${big} supera davvero quello di ${small}?`]),
		solution: String(p),
		steps: [
			para(`Contano i valori, non le altezze disegnate. La differenza è $${v2} - ${v1} = ${v2 - v1}$.`),
			para(`Rispetto al valore di ${small}: $${v2 - v1} : ${v1} = ${p}\\%$. L'asse tagliato fa sembrare enorme una differenza del $${p}\\%$.`),
		],
		answer: { kind: 'number', value: String(p) },
		params: { case: 'reale', context: C.id, mistakes: [(k - 1) * 100, k * 100, v2 - v1, k, (100 * (v2 - v1)) / v2] },
	};
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4 };

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 300; attempt++) {
		let b: Built;
		try {
			b = make(rng);
		} catch (e) {
			if ((e as Error).message === 'retry' || (e as Error).message.startsWith('choose:')) continue;
			throw e;
		}
		const sample: Sample = { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: b.params };
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	if (sample.answer.kind !== 'number') throw new Error(`${ID}: unexpected answer`);
	return numberChoice(rng, Number(sample.answer.value), (sample.params.mistakes as number[]) ?? []);
}

function check(sample: Sample): string[] {
	const ch = sample.answer.kind === 'choice' ? sample.answer : sample.choice;
	const v = commonViolations(sample.problem, sample.steps, sample.solution, ch);
	if (sample.answer.kind !== 'choice' && sample.answer.kind !== 'number') v.push('la risposta deve essere una scelta o un numero');
	if (sample.answer.kind === 'number' && !/^\d+$/.test(sample.answer.value)) v.push('il numero deve essere un intero non negativo');
	return v;
}

export const infGraficiDati: Generator = {
	id: ID,
	title: 'Grafici per rappresentare i dati',
	levels: {
		1: { label: 'Serie, categorie e legenda', constraints: ['tabella con 3-5 categorie e 2-3 serie, numeri tutti diversi; quante serie, categorie o colonne, che cosa dicono legenda e asse orizzontale, il valore di una colonna'] },
		2: { label: 'Il grafico giusto', constraints: ['una situazione composta da dati, quantità e scopo; colonne, linee, torta o dispersione, circa 1 su 4 ciascuno'] },
		3: { label: 'Il grafico sbagliato', constraints: ['un grafico già scelto: torta su dati che non sono parti di un totale, torta con almeno 12 fette, linea tra categorie senza ordine, oppure nessun difetto'] },
		4: { label: "L'asse tagliato", constraints: ["due colonne con asse che non parte da zero: quante volte una appare alta rispetto all'altra (intero da 2 a 6), o di quale percentuale la supera davvero"] },
	},
	generate,
	check,
	toChoice,
};

export default infGraficiDati;
