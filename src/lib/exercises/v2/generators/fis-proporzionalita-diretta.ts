/**
 * Proporzionalità diretta e dipendenza lineare (physics, first year). Spec: specs/exercises/fis-proporzionalita-diretta.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/11-fis-proporzionalita-diretta.md): the constant of a
 * direct proportionality from a table, with its unit; a value predicted from one pair; the slope of a line through the
 * origin read on a graph (a `grafico-dati` scene), with its unit; the kind of link in a table (direct, linear with a
 * constant term, neither); the constant term of a linear dependence, with its meaning (the spring's length with no
 * weights, the water's temperature at the start). Every answer is a multiple choice; the wrong options are the
 * mistakes of the lesson: the ratio turned upside down (and its unit), the unit of the ratio inverted, counting squares
 * instead of values, the first measured value taken for the constant term.
 *
 * Numbers are built backwards: the constant first (two or three significant figures, as the lesson's examples), then
 * the values, exact to the decimals the table shows.
 */
import type { ChoiceAnswer, Generator, Rng, Sample, SceneRef } from '../types';
import { q } from '../rational';
import { textBlock } from '../insiemi';
import { type R, type Qty, dr, decimals, fx, prose, withUnit, table, proseAndTable, numOpt, textOpt, makeChoice, graphScene, js, roundTo, sigDecimals, UNITS } from '../grafici';

export const ID = 'fis-proporzionalita-diretta';

const t = (s: string) => `\\text{${s}}`;

// ---------------------------------------------------------------------------
// Experiments with a direct proportionality

interface Direct {
	id: string;
	x: Qty;
	y: Qty;
	/** "La tabella riporta …": the two quantities. */
	what: string;
	ks: string[];
	/** Unit of k = y/x and of its inverse. */
	ku: string;
	kInv: string;
	/** Possible x values (decimal strings), all giving y with one decimal for every k. */
	xs: string[];
	dx: number;
	/** For level 2: the sentence with the known pair and the question. */
	story: (x1: string, y1: string, x2: string) => string;
}

const DIRECT: Direct[] = [
	{
		id: 'molla',
		x: { tex: 'm', uni: 'm', unit: 'g' },
		y: { tex: '\\Delta l', uni: 'Δl', unit: 'cm' },
		what: "l'allungamento $\\Delta l$ di una molla e la massa $m$ appesa",
		ks: ['0.02', '0.025', '0.03', '0.04', '0.05', '0.06', '0.08'],
		ku: 'cm/g',
		kInv: 'g/cm',
		xs: ['40', '80', '120', '160', '200', '240', '280'],
		dx: 0,
		story: (x1, y1, x2) => `Una molla si allunga di ${y1} quando le si appendono ${x1}. L'allungamento è direttamente proporzionale alla massa appesa. Di quanto si allunga la molla con ${x2}?`,
	},
	{
		id: 'cilindri',
		x: { tex: 'V', uni: 'V', unit: 'cm3' },
		y: { tex: 'm', uni: 'm', unit: 'g' },
		what: 'la massa $m$ e il volume $V$ di cilindri di uno stesso materiale',
		ks: ['2.7', '7.9', '8.9', '11.3'],
		ku: 'g/cm3',
		kInv: 'cm3/g',
		xs: ['5', '10', '15', '20', '25', '30'],
		dx: 1,
		story: (x1, y1, x2) => `Un cilindro di metallo con il volume di ${x1} ha una massa di ${y1}. Per cilindri dello stesso metallo la massa è direttamente proporzionale al volume. Quanto vale la massa di un cilindro dello stesso metallo con il volume di ${x2}?`,
	},
	{
		id: 'rubinetto',
		x: { tex: 't', uni: 't', unit: 'min' },
		y: { tex: 'V', uni: 'V', unit: 'L' },
		what: "il volume $V$ d'acqua versato da un rubinetto e il tempo $t$",
		ks: ['1.5', '2.5', '3.5', '4.5', '6', '7.5', '12'],
		ku: 'L/min',
		kInv: 'min/L',
		xs: ['2', '4', '6', '8', '10', '12'],
		dx: 0,
		story: (x1, y1, x2) => `In ${x1} un rubinetto versa ${y1} d'acqua. Il volume versato è direttamente proporzionale al tempo. Quanta acqua versa lo stesso rubinetto in ${x2}?`,
	},
	{
		id: 'carrello',
		x: { tex: 't', uni: 't', unit: 's' },
		y: { tex: 's', uni: 's', unit: 'cm' },
		what: 'la distanza $s$ percorsa da un carrello a velocità costante e il tempo $t$',
		ks: ['12', '15', '18', '24', '25', '32', '40'],
		ku: 'cm/s',
		kInv: 's/cm',
		xs: ['0.5', '1', '1.5', '2', '2.5', '3', '3.5'],
		dx: 1,
		story: (x1, y1, x2) => `Un carrello a velocità costante percorre ${y1} in ${x1}. La distanza è direttamente proporzionale al tempo. Quanta strada percorre il carrello in ${x2}?`,
	},
];

/** k with at least two significant figures, as the lesson writes it: 0{,}040, 2{,}7, 6{,}0, 11{,}3. */
function kDecimals(k: R): number {
	return Math.max(decimals(k), sigDecimals(k, 2));
}

function pickDistinct<T>(rng: Rng, xs: readonly T[], n: number): T[] {
	const pool = [...xs];
	const out: T[] = [];
	while (out.length < n && pool.length) out.push(pool.splice(rng.int(0, pool.length - 1), 1)[0]);
	return out;
}

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	choice: ChoiceAnswer;
	scene?: SceneRef;
	params: Record<string, unknown>;
}

/** The wrong constants: the ratio upside down with its unit, the unit upside down, a decimal slip. */
function kMistakes(k: R, c: Direct) {
	const inv = q(1).div(k);
	const di = sigDecimals(inv, 2);
	return [numOpt(roundTo(inv, di), di, c.kInv), numOpt(k, kDecimals(k), c.kInv), numOpt(k.mul(q(10)), kDecimals(k.mul(q(10))), c.ku), numOpt(k.div(q(10)), kDecimals(k.div(q(10))), c.ku)];
}

// ---------------------------------------------------------------------------
// Level 1: the constant from a table

function level1(rng: Rng): Built {
	const c = rng.pick(DIRECT);
	const k = dr(rng.pick(c.ks));
	const xs = pickDistinct(rng, c.xs, rng.int(4, 5)).map(dr).sort((a, b) => a.compare(b));
	const rows: [string, string][] = xs.map((x) => [fx(x, c.dx), fx(k.mul(x), 1)]);
	const kd = kDecimals(k);
	const [x0, y0] = [xs[0], k.mul(xs[0])];
	return {
		prompt: 'Calcola la costante di proporzionalità.',
		problem: proseAndTable(`La tabella riporta ${c.what}, che sono direttamente proporzionali. Quanto vale la costante di proporzionalità $k = ${c.y.tex} / ${c.x.tex}$?`, table(c.x, c.y, rows)),
		solution: `k = ${withUnit(fx(k, kd), c.ku)}`,
		steps: [
			`${t('Il rapporto è lo stesso in ogni riga, per esempio nella prima:')}`,
			`k = \\dfrac{${withUnit(fx(y0, 1), c.y.unit)}}{${withUnit(fx(x0, c.dx), c.x.unit)}} = ${withUnit(fx(k, kd), c.ku)}`,
			`${t("L'unità è quella di ")} ${c.y.tex} ${t(' divisa per quella di ')} ${c.x.tex}${t(': ')} ${UNITS[c.ku].tex}`,
		],
		choice: makeChoice(rng, numOpt(k, kd, c.ku), kMistakes(k, c)),
		params: { ctx: c.id, k: k.toString(), xs: xs.map(String) },
	};
}

// ---------------------------------------------------------------------------
// Level 2: predicting a value

function level2(rng: Rng): Built {
	const c = rng.pick(DIRECT);
	const k = dr(rng.pick(c.ks));
	const [x1, x2] = pickDistinct(rng, c.xs, 2).map(dr);
	const y1 = k.mul(x1), y2 = k.mul(x2);
	const ratio = x2.div(x1);
	const r1 = (r: R) => roundTo(r, 1);
	const wrong = [
		numOpt(r1(y1.mul(x1).div(x2)), 1, c.y.unit), // inverse proportion
		...(x2.compare(x1) > 0 ? [numOpt(r1(k.mul(x2.sub(x1))), 1, c.y.unit)] : []), // only the change
		numOpt(r1(y2.mul(q(10))), 1, c.y.unit),
		numOpt(r1(y1.add(y2)), 1, c.y.unit),
		numOpt(r1(y2.div(q(10))), 1, c.y.unit),
	];
	const ratioTex = decimals(ratio) <= 3 ? fx(ratio, decimals(ratio)) : `\\dfrac{${fx(x2, c.dx)}}{${fx(x1, c.dx)}}`;
	return {
		prompt: 'Prevedi il valore.',
		problem: textBlock(c.story(prose(fx(x1, c.dx), c.x.unit), prose(fx(y1, 1), c.y.unit), prose(fx(x2, c.dx), c.x.unit))),
		solution: `${c.y.tex} = ${withUnit(fx(y2, 1), c.y.unit)}`,
		steps: [
			`${t('La costante è ')} k = \\dfrac{${fx(y1, 1)}}{${fx(x1, c.dx)}} = ${withUnit(fx(k, kDecimals(k)), c.ku)}`,
			`${c.y.tex} = ${fx(k, kDecimals(k))}\\ ${UNITS[c.ku].tex} \\cdot ${withUnit(fx(x2, c.dx), c.x.unit)} = ${withUnit(fx(y2, 1), c.y.unit)}`,
			`${t('Controllo: ')} ${c.x.tex} ${t(' è moltiplicato per ')} ${ratioTex}${t(', e anche ')} ${c.y.tex}${t(': ')} ${fx(y1, 1)} \\cdot ${ratioTex} = ${fx(y2, 1)}`,
		],
		choice: makeChoice(rng, numOpt(y2, 1, c.y.unit), wrong),
		params: { ctx: c.id, k: k.toString(), x1: x1.toString(), x2: x2.toString() },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the slope on a graph

/** Plausible slopes: a spring, a solid's density, a tap, a cart. */
const KRANGE: Record<string, [number, number]> = { molla: [0.01, 0.2], cilindri: [0.5, 20], rubinetto: [0.5, 20], carrello: [5, 100] };

/** Scales of the squares for the graph of each experiment. */
const SCALES: Record<string, { sx: string[]; sy: string[] }> = {
	molla: { sx: ['10', '20', '25'], sy: ['0.5', '1'] },
	cilindri: { sx: ['1', '2', '5'], sy: ['5', '10', '20'] },
	rubinetto: { sx: ['0.5', '1', '2'], sy: ['1', '2', '5'] },
	carrello: { sx: ['0.2', '0.5', '1'], sy: ['2', '5', '10'] },
};

function level3(rng: Rng): Built {
	for (;;) {
		const c = rng.pick(DIRECT);
		const sx = dr(rng.pick(SCALES[c.id].sx)), sy = dr(rng.pick(SCALES[c.id].sy));
		const xe = rng.pick([8, 10]);
		const ye = rng.int(4, 12);
		if (ye === xe) continue;
		const k = sy.mul(q(ye)).div(sx.mul(q(xe)));
		if (decimals(k) > 4) continue;
		const [lo, hi] = KRANGE[c.id];
		if (js(k) < lo || js(k) > hi) continue;
		const cellsY = Math.ceil((ye * 12) / xe) + 1;
		if (cellsY > 18) continue;
		const pts: [R, R][] = [2, 4, 6, 8, 10].map((xc) => [sx.mul(q(xc)), k.mul(sx.mul(q(xc)))]);
		const alt = `Grafico di ${c.y.uni} in funzione di ${c.x.uni} su un foglio a quadretti, con cinque punti misurati e la retta per l'origine che passa tra i punti.`;
		const scene = graphScene(
			{ nome: c.x.uni, unita: UNITS[c.x.unit].uni, passo: js(sx), celle: 12, etichette: 2 },
			{ nome: c.y.uni, unita: UNITS[c.y.unit].uni, passo: js(sy), celle: cellsY, etichette: 2 },
			{ punti: pts.map(([a, b]) => [js(a), js(b)]), linea: { tipo: 'retta', m: js(k), q: 0 } },
			alt,
		);
		const kd = kDecimals(k);
		const X = sx.mul(q(xe)), Y = sy.mul(q(ye));
		const dxs = decimals(sx), dys = decimals(sy);
		const cells = q(ye, xe);
		const inv = q(1).div(k);
		const di = sigDecimals(inv, 2);
		const wrong = [
			numOpt(roundTo(inv, di), di, c.kInv),
			...(decimals(cells) <= 3 && !cells.equals(k) ? [numOpt(cells, decimals(cells), c.ku)] : []), // squares counted
			numOpt(k, kd, c.kInv),
			numOpt(k.mul(q(10)), decimals(k.mul(q(10))), c.ku),
			numOpt(k.div(q(10)), decimals(k.div(q(10))), c.ku),
		];
		return {
			prompt: 'Calcola la pendenza.',
			problem: textBlock(`Il grafico mostra ${c.what}, con la retta che passa tra i punti. Calcola la pendenza della retta, con la sua unità di misura.`),
			solution: `k = ${withUnit(fx(k, kd), c.ku)}`,
			steps: [
				`${t("La retta passa per l'origine e per il punto con ")} ${c.x.tex} = ${withUnit(fx(X, dxs), c.x.unit)}${t(' e ')} ${c.y.tex} = ${withUnit(fx(Y, dys), c.y.unit)}`,
				`${t('(')}${xe} ${t(' quadretti da ')} ${withUnit(fx(sx, dxs), c.x.unit)}${t(' e ')} ${ye} ${t(' da ')} ${withUnit(fx(sy, dys), c.y.unit)}${t(')')}`,
				`k = \\dfrac{\\Delta ${c.y.tex.replace('\\Delta ', '')}}{\\Delta ${c.x.tex}} = \\dfrac{${withUnit(fx(Y, dys), c.y.unit)}}{${withUnit(fx(X, dxs), c.x.unit)}} = ${withUnit(fx(k, kd), c.ku)}`,
			],
			choice: makeChoice(rng, numOpt(k, kd, c.ku), wrong),
			scene,
			params: { ctx: c.id, sx: sx.toString(), sy: sy.toString(), xe, ye },
		};
	}
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: linear dependence

interface Linear {
	id: string;
	x: Qty;
	y: Qty;
	what: string;
	/** Unit of the slope. */
	mu: string;
	/** Constant term (y at x = 0), slope, x values; y values have `dy` decimals. */
	q0: (rng: Rng) => R;
	ms: string[];
	xs: string[][];
	dx: number;
	dy: number;
	/** Level 5: the question about the constant term. */
	ask: string;
	/** The proportional version, for level 4. */
	direct: boolean;
}

const LINEAR: Linear[] = [
	{
		id: 'lunghezza',
		x: { tex: 'm', uni: 'm', unit: 'g' },
		y: { tex: 'L', uni: 'L', unit: 'cm' },
		what: 'la lunghezza $L$ di una molla e la massa $m$ appesa',
		mu: 'cm/g',
		q0: (rng) => q(rng.int(80, 150), 10),
		ms: ['0.02', '0.03', '0.04', '0.05', '0.06'],
		xs: [['100', '150', '200', '250', '300'], ['60', '80', '100', '120', '140']],
		dx: 0,
		dy: 1,
		ask: 'Quanto è lunga la molla senza pesetti appesi?',
		direct: false,
	},
	{
		id: 'acqua',
		x: { tex: 't', uni: 't', unit: 'min' },
		y: { tex: 'T', uni: 'T', unit: 'C' },
		what: "la temperatura $T$ dell'acqua in una pentola sul fornello e il tempo $t$",
		mu: 'C/min',
		q0: (rng) => q(rng.int(12, 25)),
		ms: ['2', '2.5', '3', '3.5', '4', '5', '6'],
		xs: [['2', '3', '4', '5'], ['3', '4', '5', '6', '7']],
		dx: 0,
		dy: 1,
		ask: "Qual era la temperatura dell'acqua all'inizio, per $t = 0$?",
		direct: false,
	},
	{
		id: 'carrello',
		x: { tex: 't', uni: 't', unit: 's' },
		y: { tex: 's', uni: 's', unit: 'cm' },
		what: 'la posizione $s$ di un carrello su una rotaia e il tempo $t$',
		mu: 'cm/s',
		q0: (rng) => q(5 * rng.int(2, 12)),
		ms: ['12', '15', '18', '20', '24', '25', '30'],
		xs: [['1', '1.5', '2', '2.5'], ['1.5', '2', '2.5', '3', '3.5']],
		dx: 1,
		dy: 1,
		ask: 'In quale posizione si trovava il carrello per $t = 0$?',
		direct: true,
	},
	{
		id: 'vasca',
		x: { tex: 't', uni: 't', unit: 'min' },
		y: { tex: 'V', uni: 'V', unit: 'L' },
		what: "il volume $V$ d'acqua in una vasca che si riempie e il tempo $t$",
		mu: 'L/min',
		q0: (rng) => q(rng.int(5, 40)),
		ms: ['1.5', '2', '2.5', '3', '4'],
		xs: [['3', '5', '7', '9'], ['2', '3', '4', '5', '6']],
		dx: 0,
		dy: 1,
		ask: "Quanta acqua c'era nella vasca all'inizio, per $t = 0$?",
		direct: true,
	},
];

const KINDS = { diretta: 'proporzionalità diretta', lineare: 'lineare con termine noto', nessuna: 'nessuna delle due' } as const;
type Kind = keyof typeof KINDS;

function level4(rng: Rng): Built {
	const kind = rng.pick(['diretta', 'lineare', 'nessuna'] as Kind[]);
	const c = rng.pick(LINEAR.filter((l) => kind !== 'diretta' || l.direct));
	const m = dr(rng.pick(c.ms));
	const xs = rng.pick(c.xs).map(dr);
	let q0 = kind === 'diretta' ? q(0) : c.q0(rng);
	let ys: R[];
	if (kind === 'nessuna') {
		// a curve: the increments grow by the same amount each step, like a proportionality to the square
		const bend = roundTo(m.mul(xs[1].sub(xs[0])).div(q(2)), 1);
		ys = xs.map((x, i) => q0.add(m.mul(x)).add(bend.mul(q(i * i))));
	} else ys = xs.map((x) => q0.add(m.mul(x)));
	if (kind === 'diretta') q0 = q(0);
	const rows: [string, string][] = xs.map((x, i) => [fx(x, c.dx), fx(ys[i], c.dy)]);
	const opts = (['diretta', 'lineare', 'nessuna'] as Kind[]).map((k) => textOpt(k, KINDS[k]));
	const right = opts.findIndex((o) => o.values[0] === kind);
	const order = [0, 1, 2];
	const choice: ChoiceAnswer = { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(right) };
	const ratio = (i: number) => ys[i].div(xs[i]);
	const r3 = (r: R) => fx(roundTo(r, 3), decimals(roundTo(r, 3)));
	const steps =
		kind === 'diretta'
			? [`${t('Il rapporto ')} ${c.y.tex} / ${c.x.tex} ${t(' è lo stesso in ogni riga: ')} ${withUnit(r3(ratio(0)), c.mu)}`, t('Le grandezze sono direttamente proporzionali: il grafico è una retta per l\'origine.')]
			: kind === 'lineare'
				? [
						`${t('I rapporti ')} ${c.y.tex} / ${c.x.tex} ${t(' cambiano: ')} ${r3(ratio(0))}${t(', ')} ${r3(ratio(1))}${t(', ...')}`,
						`${t('Le variazioni invece sono costanti: ')} \\dfrac{\\Delta ${c.y.tex}}{\\Delta ${c.x.tex}} = ${withUnit(fx(m, decimals(m)), c.mu)}`,
						t('La dipendenza è lineare, con un termine noto diverso da zero.'),
					]
				: [
						`${t('I rapporti ')} ${c.y.tex} / ${c.x.tex} ${t(' cambiano: ')} ${r3(ratio(0))}${t(', ')} ${r3(ratio(1))}${t(', ...')}`,
						`${t('Anche le variazioni cambiano: ')} ${fx(ys[1].sub(ys[0]), c.dy)}${t(', ')} ${fx(ys[2].sub(ys[1]), c.dy)}${t(', ...')}`,
						t('Il grafico non è una retta: né proporzionalità diretta né dipendenza lineare.'),
					];
	return {
		prompt: 'Riconosci il legame.',
		problem: proseAndTable(`La tabella riporta ${c.what}. Che legame c'è tra le due grandezze?`, table(c.x, c.y, rows)),
		solution: t(KINDS[kind]),
		steps,
		choice,
		params: { ctx: c.id, kind, m: m.toString(), q: q0.toString() },
	};
}

function level5(rng: Rng): Built {
	const c = rng.pick(LINEAR);
	const m = dr(rng.pick(c.ms));
	const xs = rng.pick(c.xs).map(dr);
	const q0 = c.q0(rng);
	const ys = xs.map((x) => q0.add(m.mul(x)));
	const rows: [string, string][] = xs.map((x, i) => [fx(x, c.dx), fx(ys[i], c.dy)]);
	const dxStep = xs[1].sub(xs[0]);
	const dyStep = ys[1].sub(ys[0]);
	const md = decimals(m);
	const wrong = [
		numOpt(ys[0], c.dy, c.y.unit), // the first measured value
		numOpt(ys[0].sub(dyStep), c.dy, c.y.unit), // one row back, as if x went to zero in one step
		...(decimals(m) <= c.dy ? [numOpt(m, c.dy, c.y.unit)] : []), // the slope, taken for the constant term
		numOpt(roundTo(ys[0].sub(m), c.dy), c.dy, c.y.unit), // the slope subtracted once
		numOpt(q0.add(dyStep), c.dy, c.y.unit),
		numOpt(q0.sub(dyStep), c.dy, c.y.unit),
		numOpt(q0.add(dyStep.mul(q(2))), c.dy, c.y.unit),
	];
	return {
		prompt: 'Trova il termine noto.',
		problem: proseAndTable(`La tabella riporta ${c.what}, che sono in dipendenza lineare. ${c.ask}`, table(c.x, c.y, rows)),
		solution: `${c.y.tex}_0 = ${withUnit(fx(q0, c.dy), c.y.unit)}`,
		steps: [
			`${t('Pendenza: ')} m = \\dfrac{${fx(dyStep, c.dy)}\\ ${UNITS[c.y.unit].tex}}{${fx(dxStep, c.dx)}\\ ${UNITS[c.x.unit].tex}} = ${withUnit(fx(m, md), c.mu)}`,
			`${t('Con la prima riga: ')} ${c.y.tex}_0 = ${fx(ys[0], c.dy)} - ${fx(m, md)} \\cdot ${fx(xs[0], c.dx)} = ${withUnit(fx(q0, c.dy), c.y.unit)}`,
			`${t('Il termine noto è il valore di ')} ${c.y.tex} ${t(' per ')} ${c.x.tex} = 0${t(', che la tabella non riporta')}`,
		],
		choice: makeChoice(rng, numOpt(q0, c.dy, c.y.unit), wrong),
		params: { ctx: c.id, m: m.toString(), q: q0.toString() },
	};
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 200; attempt++) {
		let b: Built;
		try {
			b = make(rng);
		} catch (e) {
			// too few distinct wrong options for these numbers: draw again
			if (/distinct options/.test((e as Error).message)) continue;
			throw e;
		}
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
			...(b.scene ? { scene: b.scene } : {}),
		};
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (/—|piuttosto che/.test(sample.problem + sample.steps.join(' ') + sample.solution)) v.push('parole vietate');
	if (sample.answer.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
	const ch = sample.answer;
	if (ch.options.length !== (sample.level === 4 ? 3 : 4)) v.push('numero di opzioni');
	if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni ripetute');
	if (sample.level === 3 && !sample.scene) v.push('manca il grafico');
	return v;
}

export const fisProporzionalitaDiretta: Generator = {
	id: ID,
	title: 'Proporzionalità diretta e dipendenza lineare',
	levels: {
		1: { label: 'La costante con la sua unità', constraints: ['tabella di 4 o 5 righe in proporzionalità diretta', 'molla, cilindri di metallo, rubinetto, carrello'] },
		2: { label: 'Prevedere un valore', constraints: ['una coppia di valori e un nuovo valore di x', 'risposta con un decimale'] },
		3: { label: 'La pendenza dal grafico', constraints: ['retta per l\'origine su un foglio a quadretti', 'pendenza con la sua unità'] },
		4: { label: 'Riconoscere il legame', constraints: ['tabella: proporzionalità diretta, lineare con termine noto, nessuna delle due', 'circa un terzo ciascuno'] },
		5: { label: 'Il termine noto', constraints: ['tabella lineare senza la riga x = 0', 'il termine noto con il suo significato'] },
	},
	generate,
	check,
};

export default fisProporzionalitaDiretta;
