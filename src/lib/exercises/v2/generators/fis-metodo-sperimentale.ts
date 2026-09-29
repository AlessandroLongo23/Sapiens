/**
 * Il metodo sperimentale. Spec: specs/exercises/fis-metodo-sperimentale.md
 *
 * Four levels from the lesson (docs/lezioni/fisica/riscritte/01-fis-metodo-sperimentale.md), all multiple choice on
 * short stories with generated data: the phase of the method a sentence describes; the independent, dependent and
 * controlled variables of an experiment; which two trials of a table to compare to test one variable; whether the
 * data confirm or refute a hypothesis, given their uncertainty.
 *
 * Every story names a student, an experiment from a small set (pendulum, incline, spring, cooling tea, heated wire,
 * ice and salt, parachute, water on the stove) and numbers drawn for it; the checker reads the story back from the
 * text.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { shuffle, textBlock } from '../insiemi';
import { q } from '../rational';
import { BANNED, choose, dec, pw, t } from '../fis-grandezze';

export const ID = 'fis-metodo-sperimentale';

const NAMES = ['Giulia', 'Marco', 'Sara', 'Luca', 'Anna', 'Matteo', 'Elena', 'Davide', 'Chiara', 'Tommaso', 'Irene', 'Pietro'];
const opt = (label: string, value = label): ChoiceOption => ({ latex: t(label), values: [value] });

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	choice: ChoiceAnswer;
	params: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Level 1: the phases of the method

export const PHASES = ['Osservazione', 'Ipotesi', 'Esperimento', 'Analisi dei dati', 'Conclusione'] as const;
type Phase = (typeof PHASES)[number];

/** Five sentences per story, one per phase, in the order of PHASES; `N` is the student's name. */
function stories(rng: Rng, N: string): string[][] {
	const three = (lo: number, hi: number, stepv: number) => {
		const a = rng.int(lo, hi);
		return [a, a + stepv, a + 2 * stepv];
	};
	const [l1, l2, l3] = three(2, 4, 2).map((x) => x * 10);
	const [m1, m2, m3] = three(1, 3, 1).map((x) => x * 50);
	const [a1, a2, a3] = three(1, 3, 1).map((x) => x * 10);
	const T0 = rng.pick([70, 75, 80, 85, 90]);
	const V = rng.pick([150, 200, 250]);
	const min = rng.pick([2, 3, 5]);
	const L = rng.pick([50, 80, 100, 120]);
	const [c1, c2, c3] = three(3, 5, 2).map((x) => x * 10);
	const g = rng.pick([10, 15, 20, 25]);
	const n = rng.int(3, 6);
	const h = rng.pick([2, 3, 4, 5]);
	return [
		[
			`${N} nota che l'altalena del parco impiega sempre lo stesso tempo per andare e tornare, anche quando oscilla meno.`,
			`${N} pensa che il tempo di un'oscillazione dipenda dalla lunghezza delle catene dell'altalena.`,
			`${N} appende una pallina a fili lunghi ${pw(String(l1), 'cm')}, ${pw(String(l2), 'cm')} e ${pw(String(l3), 'cm')} e per ogni filo misura con il cronometro il tempo di $10$ oscillazioni.`,
			`${N} riporta in una tabella le lunghezze dei fili e i periodi e vede che il periodo cresce quando il filo si allunga.`,
			`${N} conclude che il periodo del pendolo dipende dalla lunghezza del filo.`,
		],
		[
			`${N} nota che un materasso si abbassa di più con due persone sopra che con una.`,
			`${N} pensa che una molla si allunghi di più quando le si appende una massa più grande.`,
			`${N} appende a una molla masse di ${pw(String(m1), 'g')}, ${pw(String(m2), 'g')} e ${pw(String(m3), 'g')} e ogni volta misura l'allungamento con un righello.`,
			`${N} disegna il grafico dell'allungamento in funzione della massa e vede che i punti stanno su una retta.`,
			`${N} conclude che l'allungamento della molla raddoppia quando la massa appesa raddoppia.`,
		],
		[
			`${N} nota che il tè in una tazza sottile si raffredda prima che in una tazza spessa.`,
			`${N} pensa che l'acqua calda si raffreddi più in fretta in un bicchiere di vetro sottile.`,
			`${N} versa ${pw(String(V), 'mL')} di acqua a $${T0}\\,^\\circ\\text{C}$ in un bicchiere sottile e in una tazza spessa e misura la temperatura ogni $${min}$ minuti.`,
			`${N} mette le temperature misurate in un grafico e vede che la curva del bicchiere sottile scende più in fretta.`,
			`${N} conclude che nel bicchiere di vetro sottile l'acqua si raffredda più in fretta.`,
		],
		[
			`${N} nota che una bicicletta lasciata andare in discesa prende più velocità quando la strada è più ripida.`,
			`${N} pensa che il tempo di discesa di una pallina dipenda dall'inclinazione del piano.`,
			`${N} fa rotolare una pallina lungo un piano lungo ${pw(String(L), 'cm')}, inclinato di $${a1}^\\circ$, $${a2}^\\circ$ e $${a3}^\\circ$, e misura ogni volta il tempo di discesa.`,
			`${N} mette i tempi in una tabella e vede che diminuiscono quando l'inclinazione aumenta.`,
			`${N} conclude che su un piano più inclinato la pallina impiega meno tempo a scendere.`,
		],
		[
			`${N} nota che d'estate i fili della luce tra un palo e l'altro pendono di più che d'inverno.`,
			`${N} pensa che un filo di metallo si allunghi quando si scalda.`,
			`${N} scalda un filo di rame a $${c1}\\,^\\circ\\text{C}$, $${c2}\\,^\\circ\\text{C}$ e $${c3}\\,^\\circ\\text{C}$ e ogni volta ne misura la lunghezza con un calibro.`,
			`${N} riporta le lunghezze in una tabella e vede che l'allungamento cresce con la temperatura.`,
			`${N} conclude che i metalli si dilatano quando si scaldano.`,
		],
		[
			`${N} nota che d'inverno sulle strade ghiacciate si sparge il sale.`,
			`${N} pensa che un cubetto di ghiaccio coperto di sale fonda prima di uno senza sale.`,
			`${N} mette in due piatti due cubetti di ghiaccio da ${pw(String(g), 'g')}, copre di sale uno dei due e misura il tempo che impiegano a fondere; ripete la prova $${n}$ volte.`,
			`${N} confronta i tempi delle $${n}$ prove in una tabella e vede che con il sale sono sempre più brevi.`,
			`${N} conclude che il sale fa fondere il ghiaccio più in fretta.`,
		],
		[
			`${N} nota che un paracadutista scende molto più piano di un sasso.`,
			`${N} pensa che un paracadute più grande faccia scendere più piano l'oggetto appeso.`,
			`${N} lascia cadere da ${pw(String(h), 'm')} un pesetto appeso a paracadute di carta di tre grandezze diverse e misura ogni volta il tempo di caduta.`,
			`${N} riporta i tempi in un grafico in funzione dell'area del paracadute e vede che crescono con l'area.`,
			`${N} conclude che con un paracadute più grande il pesetto impiega più tempo a cadere.`,
		],
	];
}

function level1(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const all = stories(rng, N);
	const s = rng.int(0, all.length - 1);
	const p = rng.int(0, PHASES.length - 1);
	const phase = PHASES[p];
	const others = shuffle(
		rng,
		PHASES.filter((x) => x !== phase),
	);
	const why: Record<Phase, string> = {
		Osservazione: 'Si nota un fenomeno, da cui nasce una domanda: è la fase di osservazione.',
		Ipotesi: "Si propone una risposta possibile, che le misure possono smentire: è un'ipotesi.",
		Esperimento: "Si riproduce il fenomeno cambiando una grandezza e misurando: è l'esperimento.",
		'Analisi dei dati': "Si ordinano le misure in una tabella o in un grafico e si cerca una regolarità: è l'analisi dei dati.",
		Conclusione: 'Si dice che cosa hanno mostrato i dati: è la conclusione.',
	};
	return {
		prompt: 'Scegli la fase del metodo sperimentale.',
		problem: textBlock(`${all[s][p]} Quale fase del metodo sperimentale descrive la frase?`),
		solution: t(phase),
		steps: [textBlock(why[phase])],
		choice: choose(rng, opt(phase), others.map((x) => opt(x))),
		params: { case: phase, story: s, name: N },
	};
}

// ---------------------------------------------------------------------------
// Level 2: independent, dependent and controlled variables

interface Setup {
	what: string; // "un pendolo"
	dep: string; // the measured quantity
	vars: [string, string, string]; // the three quantities that can change
	values: [string, string, string]; // how each one is changed, for the story
}

function setups(rng: Rng): Setup[] {
	const lens = rng.pick([[30, 60, 90], [40, 80, 120], [25, 50, 100]]);
	const masses = rng.pick([[50, 100, 200], [100, 200, 300], [20, 40, 80]]);
	const amps = rng.pick([[5, 10, 15], [4, 8, 12], [6, 9, 12]]);
	const angs = rng.pick([[10, 20, 30], [15, 25, 35], [5, 10, 15]]);
	const pl = rng.pick([[50, 100, 150], [60, 90, 120]]);
	const ms = rng.pick([[200, 400, 600], [250, 500, 750], [300, 600, 900]]);
	const t0 = rng.pick([[15, 25, 35], [20, 30, 40], [10, 20, 30]]);
	const cm = (xs: number[]) => `${pw(String(xs[0]), 'cm')}, ${pw(String(xs[1]), 'cm')} e ${pw(String(xs[2]), 'cm')}`;
	const g = (xs: number[]) => `${pw(String(xs[0]), 'g')}, ${pw(String(xs[1]), 'g')} e ${pw(String(xs[2]), 'g')}`;
	const deg = (xs: number[]) => `$${xs[0]}^\\circ$, $${xs[1]}^\\circ$ e $${xs[2]}^\\circ$`;
	const cel = (xs: number[]) => `$${xs[0]}\\,^\\circ\\text{C}$, $${xs[1]}\\,^\\circ\\text{C}$ e $${xs[2]}\\,^\\circ\\text{C}$`;
	return [
		{ what: 'un pendolo', dep: 'il periodo', vars: ['la lunghezza del filo', 'la massa della pallina', "l'ampiezza dell'oscillazione"], values: [`usa fili lunghi ${cm(lens)}`, `appende palline di ${g(masses)}`, `lo fa partire con ampiezze di ${deg(amps)}`] },
		{ what: 'una pallina che rotola su un piano inclinato', dep: 'il tempo di discesa', vars: ["l'inclinazione del piano", 'la lunghezza del piano', 'la massa della pallina'], values: [`inclina il piano di ${deg(angs)}`, `usa piani lunghi ${cm(pl)}`, `fa rotolare palline di ${g(masses)}`] },
		{ what: "l'acqua scaldata sul fornello", dep: "il tempo per arrivare all'ebollizione", vars: ["la massa d'acqua", "la temperatura iniziale dell'acqua", 'la fiamma del fornello'], values: [`scalda ${g(ms)} di acqua`, `parte da acqua a ${cel(t0)}`, 'usa la fiamma bassa, media e alta'] },
		{ what: 'un paracadute di carta', dep: 'il tempo di caduta', vars: ["l'area del paracadute", 'la massa del pesetto appeso', "l'altezza da cui cade"], values: ['usa paracadute piccoli, medi e grandi', `appende pesetti di ${g(masses.map((x) => x / 10))}`, `lo lascia cadere da ${cm([100, 150, 200])}`] },
		{ what: 'una molla', dep: "l'allungamento della molla", vars: ['la massa appesa', 'la lunghezza della molla', 'lo spessore del filo della molla'], values: [`appende masse di ${g(masses)}`, `usa molle lunghe ${cm(lens.map((x) => x / 5))}`, 'usa molle di filo sottile, medio e grosso'] },
	];
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "da" joined to the article: la massa → dalla massa, l'area → dall'area, il periodo → dal periodo. */
export function da(x: string): string {
	for (const [art, joined] of [["l'", "dall'"], ['la ', 'dalla '], ['lo ', 'dallo '], ['il ', 'dal '], ['le ', 'dalle '], ['gli ', 'dagli '], ['i ', 'dai ']] as const)
		if (x.startsWith(art)) return joined + x.slice(art.length);
	return `da ${x}`;
}

function level2(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const all = setups(rng);
	const s = rng.int(0, all.length - 1);
	const S = all[s];
	const i = rng.int(0, 2);
	const indep = S.vars[i];
	const controls = S.vars.filter((_, j) => j !== i) as [string, string];
	const ask = rng.pick(['indipendente', 'dipendente', 'costanti'] as const);
	const order = shuffle(rng, [...S.vars]);
	const story = `${N} studia ${S.what}; le grandezze che può cambiare sono ${order[0]}, ${order[1]} e ${order[2]}. Vuole sapere se ${S.dep} dipende ${da(indep)}: ${S.values[i]} e ogni volta misura ${S.dep}.`;
	const both = (a: string, b: string) => `${a} e ${b}`;
	let question: string;
	let right: ChoiceOption;
	let others: ChoiceOption[];
	let step: string;
	if (ask === 'indipendente') {
		question = 'Qual è la variabile indipendente?';
		right = opt(cap(indep), indep);
		others = shuffle(rng, [S.dep, ...controls]).map((x) => opt(cap(x), x));
		step = `${cap(indep)} è la grandezza che ${N} sceglie e cambia: è la variabile indipendente.`;
	} else if (ask === 'dipendente') {
		question = 'Qual è la variabile dipendente?';
		right = opt(cap(S.dep), S.dep);
		others = shuffle(rng, [indep, ...controls]).map((x) => opt(cap(x), x));
		step = `${cap(S.dep)} è la grandezza che ${N} misura per vedere come risponde: è la variabile dipendente.`;
	} else {
		question = 'Quali grandezze deve tenere costanti?';
		right = opt(cap(both(controls[0], controls[1])), [...controls].sort().join('+'));
		others = [
			[indep, controls[0]],
			[S.dep, controls[1]],
			[indep, S.dep],
			[controls[0], S.dep],
			[indep, controls[1]],
		].map(([a, b]) => opt(cap(both(a, b)), [a, b].sort().join('+')));
		step = `Deve cambiare solo ${indep}: le altre due grandezze che possono influire, ${both(controls[0], controls[1])}, restano costanti.`;
	}
	// A long option goes on more lines, at most 24 characters each (the answer button on a phone is 252 px wide).
	const wrap = (o: ChoiceOption): ChoiceOption => {
		const label = (o.latex.match(/^\\text\{(.*)\}$/) ?? [])[1] ?? '';
		if (label.length <= 24) return o;
		const lines: string[] = [];
		for (const w of label.split(' ')) {
			const last = lines.at(-1);
			if (last !== undefined && last.length + 1 + w.length <= 24) lines[lines.length - 1] = `${last} ${w}`;
			else lines.push(w);
		}
		return { ...o, latex: `\\begin{gathered} ${lines.map(t).join(' \\\\ ')} \\end{gathered}` };
	};
	return {
		prompt: 'Riconosci le variabili dell\'esperimento.',
		problem: textBlock(`${story} ${question}`),
		solution: right.latex,
		steps: [textBlock(step)],
		choice: (() => {
			const c = choose(rng, right, others);
			return { ...c, options: c.options.map(wrap) };
		})(),
		params: { case: ask, setup: s, indep: i, name: N },
	};
}

// ---------------------------------------------------------------------------
// Level 3: which two trials to compare

interface Table {
	what: string;
	depName: string;
	dep: [string, string]; // symbol, unit
	a: { name: string; sym: string; unit: string; vals: [number, number]; digits: number };
	b: { name: string; sym: string; unit: string; vals: [number, number]; digits: number };
	fixed: string;
	measure: (a: number, b: number) => number; // the dependent quantity, before the noise
	depDigits: number;
}

function tables(rng: Rng): Table[] {
	const L = rng.pick([[0.25, 1], [0.5, 1], [0.4, 0.9], [0.3, 1.2]]) as [number, number];
	const m = rng.pick([[50, 100], [100, 200], [50, 200]]) as [number, number];
	const ang = rng.pick([[10, 20], [15, 30], [20, 40]]) as [number, number];
	const mw = rng.pick([[200, 400], [300, 600], [250, 500]]) as [number, number];
	const T0 = rng.pick([[15, 30], [20, 40], [10, 25]]) as [number, number];
	const pend = (Lm: number) => 2 * Math.PI * Math.sqrt(Lm / 9.8);
	return [
		{
			what: 'un pendolo, con ampiezza sempre di $10^\\circ$',
			depName: 'il periodo',
			dep: ['T', 's'],
			a: { name: 'la massa della pallina', sym: 'm', unit: 'g', vals: m, digits: 0 },
			b: { name: 'la lunghezza del filo', sym: 'L', unit: 'm', vals: L, digits: 2 },
			fixed: '',
			measure: (_a, b) => pend(b),
			depDigits: 2,
		},
		{
			what: 'una pallina che rotola lungo un piano lungo $1{,}00\\,\\text{m}$',
			depName: 'il tempo di discesa',
			dep: ['t', 's'],
			a: { name: 'la massa della pallina', sym: 'm', unit: 'g', vals: m, digits: 0 },
			b: { name: "l'inclinazione del piano", sym: '\\alpha', unit: '°', vals: ang, digits: 0 },
			fixed: '',
			measure: (_a, b) => Math.sqrt((2 * 1 * 7) / (5 * 9.8 * Math.sin((b * Math.PI) / 180))),
			depDigits: 2,
		},
		{
			what: "dell'acqua scaldata sullo stesso fornello",
			depName: "il tempo per arrivare all'ebollizione",
			dep: ['t', 's'],
			a: { name: "la massa d'acqua", sym: 'm', unit: 'g', vals: mw, digits: 0 },
			b: { name: "la temperatura iniziale dell'acqua", sym: 'T_0', unit: '°C', vals: T0, digits: 0 },
			fixed: '',
			measure: (a, b) => (a * 4.186 * (100 - b)) / 800,
			depDigits: 0,
		},
	];
}

const fmtNum = (x: number, digits: number) => dec(q(Math.round(x * 10 ** digits), 10 ** digits), digits);
const fmtUnit = (x: number, digits: number, unit: string) => (unit === '°' ? `${fmtNum(x, digits)}^\\circ` : unit === '°C' ? `${fmtNum(x, digits)}\\,^\\circ\\text{C}` : `${fmtNum(x, digits)}\\,\\text{${unit}}`);

function level3(rng: Rng): Built {
	const all = tables(rng);
	const s = rng.int(0, all.length - 1);
	const T = all[s];
	const N = rng.pick(NAMES);
	// Which of the two quantities the question is about: A, or B.
	const askA = rng.next() < 0.5;
	const X = askA ? T.a : T.b;
	const combos = shuffle(rng, [
		[0, 0],
		[0, 1],
		[1, 0],
		[1, 1],
	]);
	const rows = combos.map(([i, j]) => {
		const a = T.a.vals[i];
		const b = T.b.vals[j];
		const noise = 1 + (rng.next() - 0.5) * 0.01;
		return { i, j, a, b, y: T.measure(a, b) * noise };
	});
	const head = `\\text{prova} & ${T.a.sym} & ${T.b.sym} & ${T.dep[0]}`;
	const body = rows.map((r, k) => `${k + 1} & ${fmtUnit(r.a, T.a.digits, T.a.unit)} & ${fmtUnit(r.b, T.b.digits, T.b.unit)} & ${fmtUnit(r.y, T.depDigits, T.dep[1])}`).join(' \\\\ ');
	const table = `\\begin{array}{c|c|c|c} ${head} \\\\ \\hline ${body} \\end{array}`;
	const pairs: [number, number][] = [];
	for (let x = 0; x < 4; x++) for (let y = x + 1; y < 4; y++) pairs.push([x, y]);
	const kind = ([x, y]: [number, number]) => {
		const da = rows[x].i !== rows[y].i;
		const db = rows[x].j !== rows[y].j;
		return da && db ? 'entrambe' : (askA ? da : db) ? 'giusta' : 'altra';
	};
	const good = pairs.filter((p) => kind(p) === 'giusta');
	const bad = shuffle(
		rng,
		pairs.filter((p) => kind(p) !== 'giusta'),
	);
	const right = rng.pick(good);
	const label = ([x, y]: [number, number]) => opt(`prove ${x + 1} e ${y + 1}`, `${x + 1}-${y + 1}`);
	const Y = askA ? T.b : T.a;
	return {
		prompt: 'Scegli le prove da confrontare.',
		problem: textBlock(`${N} ha fatto quattro prove con ${T.what}. Quali due prove deve confrontare per sapere se ${T.depName} dipende ${da(X.name)}?`, 46, [table]),
		solution: label(right).latex,
		steps: [
			textBlock(`Servono due prove in cui cambia solo ${X.name}, cioè con lo stesso valore di $${Y.sym}$ e valori diversi di $${X.sym}$.`),
			textBlock(`Le prove ${right[0] + 1} e ${right[1] + 1} hanno lo stesso valore di $${Y.sym}$ e valori diversi di $${X.sym}$.`),
		],
		choice: choose(rng, label(right), bad.map(label)),
		params: { case: askA ? 'a' : 'b', table: s, name: N },
	};
}

// ---------------------------------------------------------------------------
// Level 4: do the data confirm the hypothesis?

interface Test {
	dep: string; // what is measured, "il periodo di un pendolo"
	indep: string; // "la massa della pallina"
	/** The experiment in a sentence, ending with the three measures. */
	story: (measures: string) => string;
	depends: boolean; // what nature does
	truth: number[]; // the three values nature gives, before rounding
	unit: string;
	digits: number;
}

const list3 = (xs: string[]) => `${xs[0]}, ${xs[1]} e ${xs[2]}`;

function tests(rng: Rng): Test[] {
	const g3 = (xs: number[], u: string) => list3(xs.map((x) => pw(String(x), u)));
	const period = (cm: number) => 2 * Math.PI * Math.sqrt(cm / 100 / 9.8);
	const mp = rng.pick([[50, 100, 200], [100, 200, 300]]);
	const lp = rng.pick([[25, 50, 100], [30, 60, 120], [40, 80, 160]]);
	const mb = rng.pick([[20, 50, 100], [30, 60, 90]]);
	const mm = rng.pick([[50, 100, 150], [100, 200, 300]]);
	const c = rng.pick([0.02, 0.03, 0.04]); // centimetres per gram
	const tc = rng.pick([[10, 20, 30], [15, 25, 35]]);
	const t0 = rng.int(6, 9) * 40; // so that three quarters and half of it are whole seconds
	const roll = Math.sqrt((2 * 1 * 7) / (5 * 9.8 * Math.sin((20 * Math.PI) / 180)));
	return [
		{ dep: 'il periodo di un pendolo', indep: 'la massa della pallina', story: (y) => `Con un filo lungo $1{,}00\\,\\text{m}$ appende palline di ${g3(mp, 'g')} e misura periodi di ${y}`, depends: false, truth: [period(100), period(100), period(100)], unit: 's', digits: 2 },
		{ dep: 'il periodo di un pendolo', indep: 'la lunghezza del filo', story: (y) => `Con una pallina di $100\\,\\text{g}$ usa fili lunghi ${g3(lp, 'cm')} e misura periodi di ${y}`, depends: true, truth: lp.map(period), unit: 's', digits: 2 },
		{ dep: 'il tempo di discesa di una pallina lungo un piano inclinato', indep: 'la massa della pallina', story: (y) => `Su un piano lungo $1{,}00\\,\\text{m}$ e inclinato di $20^\\circ$ fa rotolare palline di ${g3(mb, 'g')} e misura tempi di discesa di ${y}`, depends: false, truth: [roll, roll, roll], unit: 's', digits: 2 },
		{ dep: "l'allungamento di una molla", indep: 'la massa appesa', story: (y) => `Appende alla molla masse di ${g3(mm, 'g')} e misura allungamenti di ${y}`, depends: true, truth: mm.map((m) => c * m), unit: 'cm', digits: 1 },
		{ dep: 'il tempo che un cubetto di ghiaccio impiega a fondere', indep: "la temperatura dell'acqua in cui si trova", story: (y) => `Mette cubetti di ghiaccio da $20\\,\\text{g}$ in acqua a ${list3(tc.map((x) => `$${x}\\,^\\circ\\text{C}$`))} e misura tempi di fusione di ${y}`, depends: true, truth: [t0, t0 * 0.75, t0 * 0.5], unit: 's', digits: 0 },
	];
}

export const VERDICTS = ['I dati confermano l\'ipotesi', 'I dati smentiscono l\'ipotesi', 'I dati la dimostrano per sempre', 'I dati non dicono niente'] as const;

function level4(rng: Rng): Built {
	const all = tests(rng);
	const s = rng.int(0, all.length - 1);
	const T = all[s];
	const N = rng.pick(NAMES);
	const claimDepends = rng.next() < 0.5;
	const unitStep = 10 ** -T.digits;
	// the measures in units of the last digit: nature's values, a small noise when they do not change
	const base = T.truth.map((y) => Math.round(y / unitStep));
	const gap = Math.min(...[1, 2].map((k) => Math.abs(base[k] - base[k - 1])));
	// the uncertainty: 1 to 3 units of the last digit (5 or 10 s for whole seconds), at most a fifth of the gaps
	const choices = (T.digits === 0 ? [5, 10] : [1, 2, 3]).filter((k) => !T.depends || 5 * k <= gap);
	const uk = rng.pick(choices);
	const u = uk * unitStep;
	const lo = -Math.floor(uk / 2);
	const hi = Math.ceil(uk / 2);
	const ys = T.depends ? base.map((y) => y * unitStep) : base.map((y, k) => (y + (k === 0 ? 0 : rng.int(lo, hi))) * unitStep);
	const f = (y: number) => pw(fmtNum(y, T.digits), T.unit);
	const hyp = `${T.dep} ${claimDepends ? '' : 'non '}dipenda ${da(T.indep)}`;
	const agree = claimDepends === T.depends;
	const right = VERDICTS[agree ? 0 : 1];
	const others = [VERDICTS[agree ? 1 : 0], VERDICTS[2], VERDICTS[3]];
	const spreadTxt = T.depends ? `Le misure differiscono tra loro molto più dell'incertezza: ${T.dep} cambia con ${T.indep}.` : `Le misure differiscono tra loro al massimo di ${f(Math.max(...ys) - Math.min(...ys))}, non più dell'incertezza: per le misure sono uguali.`;
	return {
		prompt: "Decidi che cosa dicono i dati sull'ipotesi.",
		problem: textBlock(`${N} controlla l'ipotesi che ${hyp}. ${T.story(list3(ys.map(f)))}, con un'incertezza di ${f(u)}. Che cosa dicono i dati?`),
		solution: t(right),
		steps: [textBlock(spreadTxt), textBlock(agree ? "È quello che dice l'ipotesi: i dati la confermano, anche se non la dimostrano per sempre." : "L'ipotesi dice il contrario: i dati la smentiscono.")],
		choice: choose(
			rng,
			opt(right),
			others.map((x) => opt(x)),
		),
		params: { case: agree ? 'conferma' : 'smentita', test: s, claimDepends, name: N },
	};
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4 };

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 200; attempt++) {
		const b = make(rng);
		const sample: Sample = {
			generatorId: ID,
			level,
			seed: rng.seed,
			prompt: b.prompt,
			problem: b.problem,
			solution: b.solution,
			steps: b.steps,
			answer: b.choice,
			params: b.params,
		};
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test(sample.problem + sample.steps.join(' ') + sample.solution)) v.push('parole vietate');
	if (sample.answer.kind !== 'choice') return ['la risposta deve essere una scelta'];
	const ch = sample.answer;
	if (ch.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni ripetute');
	if (!(ch.correct >= 0 && ch.correct < ch.options.length)) v.push('opzione giusta fuori dai limiti');
	return v;
}

export const fisMetodoSperimentale: Generator = {
	id: ID,
	title: 'Il metodo sperimentale',
	levels: {
		1: { label: 'Le fasi del metodo', constraints: ['una frase di un esperimento, la sua fase tra osservazione, ipotesi, esperimento, analisi dei dati, conclusione'] },
		2: { label: 'Le variabili', constraints: ['variabile indipendente, dipendente, grandezze da tenere costanti, circa 1 su 3 ciascuna'] },
		3: { label: 'Le prove da confrontare', constraints: ['quattro prove con due grandezze a due valori, la coppia in cui cambia solo quella chiesta'] },
		4: { label: "I dati e l'ipotesi", constraints: ["misure con incertezza: conferma o smentita, differenze entro l'incertezza o oltre cinque volte"] },
	},
	generate,
	check,
};

export default fisMetodoSperimentale;
