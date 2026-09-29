/**
 * Tabelle e grafici cartesiani (physics, first year). Spec: specs/exercises/fis-tabelle-grafici.md
 *
 * Four levels from the lesson (docs/lezioni/fisica/riscritte/10-fis-tabelle-grafici.md): reading a measured point on
 * a graph (the value of one quantity for a given value of the other); choosing the scale of an axis on squared paper
 * (the smallest step of 1, 2 or 5 times a power of ten that fits); reading a value between the points on the line
 * through them; finding the measurement to redo in a table whose points lie on a line but one. The graph is a
 * `grafico-dati` scene built from the data, on square cells, so every value to read falls on a grid line. Every answer
 * is a multiple choice with the unit in the option (the physics convention of the lessons); the wrong options are the
 * mistakes the lesson warns about: counting squares instead of values, reading the other axis, taking the next point.
 *
 * Experiments of the lesson: the spring and its elongation, the spring's length, water on a stove, a cart on a track,
 * a burning candle. Each is a straight line in cells: y = q + d·x cells with d = ±1, so the line crosses the grid at
 * every intersection and the values are exact.
 */
import type { ChoiceAnswer, Generator, Rng, Sample, SceneRef } from '../types';
import { q } from '../rational';
import { textBlock } from '../insiemi';
import { type R, type Qty, dr, decimals, fx, prose, withUnit, table, proseAndTable, numOpt, makeChoice, graphScene, js, roundTo, sigDecimals, UNITS } from '../grafici';

export const ID = 'fis-tabelle-grafici';

interface Ctx {
	id: string;
	x: Qty;
	y: Qty;
	/** What the graph shows, after "Il grafico mostra" / "La tabella riporta". */
	what: string;
	sx: string[];
	sy: string[];
	/** The line's value at x = 0, in cells, for a cell of sy. */
	q0: (rng: Rng, sy: R) => number;
	dir: 1 | -1;
	/** Points start at x = 0 (a time) or at the first weight. */
	from0: boolean;
}

const CTX: Ctx[] = [
	{
		id: 'molla',
		x: { tex: 'm', uni: 'm', unit: 'g' },
		y: { tex: '\\Delta l', uni: 'Δl', unit: 'cm' },
		what: "l'allungamento $\\Delta l$ di una molla in funzione della massa $m$ appesa",
		sx: ['10', '20', '25'],
		sy: ['0.5', '1'],
		q0: () => 0,
		dir: 1,
		from0: false,
	},
	{
		id: 'lunghezza',
		x: { tex: 'm', uni: 'm', unit: 'g' },
		y: { tex: 'L', uni: 'L', unit: 'cm' },
		what: 'la lunghezza $L$ di una molla in funzione della massa $m$ appesa',
		sx: ['10', '20', '25'],
		sy: ['0.5', '1'],
		q0: (rng) => rng.int(8, 12),
		dir: 1,
		from0: false,
	},
	{
		id: 'acqua',
		x: { tex: 't', uni: 't', unit: 'min' },
		y: { tex: 'T', uni: 'T', unit: 'C' },
		what: "la temperatura $T$ dell'acqua in una pentola sul fornello in funzione del tempo $t$",
		sx: ['0.5', '1'],
		sy: ['2', '5'],
		q0: (rng, sy) => rng.int(Math.ceil(14 / js(sy)), Math.floor(24 / js(sy))),
		dir: 1,
		from0: true,
	},
	{
		id: 'carrello',
		x: { tex: 't', uni: 't', unit: 's' },
		y: { tex: 's', uni: 's', unit: 'cm' },
		what: 'la posizione $s$ di un carrello su una rotaia in funzione del tempo $t$',
		sx: ['0.5', '1'],
		sy: ['5', '10'],
		q0: (rng) => rng.int(1, 4),
		dir: 1,
		from0: true,
	},
	{
		id: 'candela',
		x: { tex: 't', uni: 't', unit: 'min' },
		y: { tex: 'h', uni: 'h', unit: 'cm' },
		what: "l'altezza $h$ di una candela accesa in funzione del tempo $t$",
		sx: ['5', '10'],
		sy: ['0.5', '1'],
		q0: (rng) => rng.int(12, 16),
		dir: -1,
		from0: true,
	},
];

/** A line in cells and its scales. */
interface Setup {
	ctx: Ctx;
	sx: R;
	sy: R;
	qc: number;
	/** The x cells of the measured points. */
	xcs: number[];
	cellsX: number;
	cellsY: number;
}

function setup(rng: Rng): Setup {
	const ctx = rng.pick(CTX);
	const sx = dr(rng.pick(ctx.sx));
	const sy = dr(rng.pick(ctx.sy));
	const qc = ctx.q0(rng, sy);
	const xcs = ctx.from0 ? [0, 2, 4, 6, 8, 10] : [2, 4, 6, 8, 10];
	const ycs = xcs.map((x) => qc + ctx.dir * x);
	return { ctx, sx, sy, qc, xcs, cellsX: 12, cellsY: Math.max(...ycs) + 2 };
}

const yc = (s: Setup, xc: number) => s.qc + s.ctx.dir * xc;
const X = (s: Setup, xc: number) => s.sx.mul(q(xc));
const Y = (s: Setup, ycell: number) => s.sy.mul(q(ycell));
const dX = (s: Setup) => decimals(s.sx);
const dY = (s: Setup) => decimals(s.sy);

function scene(s: Setup, points: [R, R][], line: boolean, alt: string): SceneRef {
	const { ctx } = s;
	return graphScene(
		{ nome: ctx.x.uni, unita: UNITS[ctx.x.unit].uni, passo: js(s.sx), celle: s.cellsX, etichette: 2 },
		{ nome: ctx.y.uni, unita: UNITS[ctx.y.unit].uni, passo: js(s.sy), celle: s.cellsY, etichette: 2 },
		{
			punti: points.map(([a, b]) => [js(a), js(b)]),
			...(line ? { linea: { tipo: 'retta', m: js(s.sy.div(s.sx)) * ctx.dir, q: js(Y(s, s.qc)) } } : {}),
		},
		alt,
	);
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

const t = (s: string) => `\\text{${s}}`;

// ---------------------------------------------------------------------------
// Level 1: a measured point

function level1(rng: Rng): Built {
	const s = setup(rng);
	const { ctx } = s;
	const pts = s.xcs.filter((x) => x > 0);
	const xc = rng.pick(pts);
	const ycell = yc(s, xc);
	const vx = X(s, xc), vy = Y(s, ycell);
	const all: [R, R][] = s.xcs.map((x) => [X(s, x), Y(s, yc(s, x))]);
	const alt = `Grafico di ${ctx.y.uni} in funzione di ${ctx.x.uni} su un foglio a quadretti, con ${all.length} punti misurati.`;
	const neighbour = pts.includes(xc + 2) ? xc + 2 : xc - 2;
	const other = pts.includes(xc - 2) ? xc - 2 : xc + 4;
	if (rng.next() < 0.5) {
		const right = numOpt(vy, dY(s), ctx.y.unit);
		const wrong = [
			numOpt(q(ycell), 0, ctx.y.unit), // the squares counted, not their value
			numOpt(Y(s, yc(s, neighbour)), dY(s), ctx.y.unit), // the next point
			numOpt(vx, dX(s), ctx.y.unit), // the other coordinate
			numOpt(Y(s, yc(s, other)), dY(s), ctx.y.unit),
			numOpt(vy.add(s.sy), dY(s), ctx.y.unit),
		].filter((o) => !o.values[0].startsWith('-') && o.values[0] !== '0');
		return {
			prompt: 'Leggi il valore sul grafico.',
			problem: proseLines(`Il grafico mostra ${ctx.what}. Quanto vale $${ctx.y.tex}$ nel punto misurato con $${ctx.x.tex}$ uguale a ${prose(fx(vx, dX(s)), ctx.x.unit)}?`),
			solution: `${ctx.y.tex} = ${withUnit(fx(vy, dY(s)), ctx.y.unit)}`,
			steps: [
				`${t('Sull\'asse orizzontale un quadretto vale ')} ${withUnit(fx(s.sx, dX(s)), ctx.x.unit)}${t(': il punto è a ')} ${xc} ${t(' quadretti')}`,
				`${t('Il punto è ')} ${ycell} ${t(' quadretti sopra l\'asse, e un quadretto vale ')} ${withUnit(fx(s.sy, dY(s)), ctx.y.unit)}`,
				`${ctx.y.tex} = ${ycell} \\cdot ${fx(s.sy, dY(s))} = ${withUnit(fx(vy, dY(s)), ctx.y.unit)}`,
			],
			choice: makeChoice(rng, right, wrong),
			scene: scene(s, all, false, alt),
			params: { ctx: ctx.id, mode: 'y', xc, sx: s.sx.toString(), sy: s.sy.toString(), qc: s.qc },
		};
	}
	const right = numOpt(vx, dX(s), ctx.x.unit);
	const wrong = [
		numOpt(q(xc), 0, ctx.x.unit),
		numOpt(X(s, neighbour), dX(s), ctx.x.unit),
		numOpt(vy, dY(s), ctx.x.unit),
		numOpt(X(s, other), dX(s), ctx.x.unit),
		numOpt(vx.add(s.sx), dX(s), ctx.x.unit),
	];
	return {
		prompt: 'Leggi il valore sul grafico.',
		problem: proseLines(`Il grafico mostra ${ctx.what}. Per quale valore di $${ctx.x.tex}$ è stato misurato $${ctx.y.tex}$ uguale a ${prose(fx(vy, dY(s)), ctx.y.unit)}?`),
		solution: `${ctx.x.tex} = ${withUnit(fx(vx, dX(s)), ctx.x.unit)}`,
		steps: [
			`${t('Sull\'asse verticale un quadretto vale ')} ${withUnit(fx(s.sy, dY(s)), ctx.y.unit)}${t(': il punto è a ')} ${ycell} ${t(' quadretti')}`,
			`${t('Il punto è ')} ${xc} ${t(' quadretti a destra dell\'origine, e un quadretto vale ')} ${withUnit(fx(s.sx, dX(s)), ctx.x.unit)}`,
			`${ctx.x.tex} = ${xc} \\cdot ${fx(s.sx, dX(s))} = ${withUnit(fx(vx, dX(s)), ctx.x.unit)}`,
		],
		choice: makeChoice(rng, right, wrong),
		scene: scene(s, all, false, alt),
		params: { ctx: ctx.id, mode: 'x', xc, sx: s.sx.toString(), sy: s.sy.toString(), qc: s.qc },
	};
}

/** Prose alone, wrapped. */
const proseLines = (text: string) => textBlock(text);

// ---------------------------------------------------------------------------
// Level 2: the scale of an axis

/** The steps 1, 2, 5 times a power of ten, from 0.01 to 5000. */
const SERIES: R[] = [-2, -1, 0, 1, 2, 3].flatMap((e) => [1, 2, 5].map((m) => (e < 0 ? q(m, 10 ** -e) : q(m * 10 ** e))));

/** The size of the measurement error: a fifth of a square. The table's values have its decimals. */
const errStep = (s: Setup) => s.sy.div(q(5));
const dMeas = (s: Setup) => decimals(errStep(s));

/** Measured values: the line's value plus an error of at most a fifth of a square. */
function measured(rng: Rng, s: Setup): [R, R][] {
	const e = errStep(s);
	return s.xcs.map((xc) => [X(s, xc), Y(s, yc(s, xc)).add(e.mul(q(rng.int(-1, 1))))]);
}

function level2(rng: Rng): Built {
	for (;;) {
		const s = setup(rng);
		const { ctx } = s;
		const data = measured(rng, s);
		const dy = dMeas(s);
		const axis = rng.next() < 0.5 ? 'y' : 'x';
		const qty = axis === 'y' ? ctx.y : ctx.x;
		const values = data.map(([a, b]) => (axis === 'y' ? b : a));
		const M = values.reduce((a, b) => (b.compare(a) > 0 ? b : a));
		const N = rng.int(8, 20);
		const idx = SERIES.findIndex((st) => M.compare(st.mul(q(N))) <= 0);
		if (idx < 1 || idx + 2 >= SERIES.length) continue;
		const right = SERIES[idx], prev = SERIES[idx - 1], next = SERIES[idx + 1], next2 = SERIES[idx + 2];
		// the step that fills the sheet exactly: M / N rounded up to two significant figures
		const raw = M.div(q(N));
		const d2 = Math.max(0, 1 - Math.floor(Math.log10(js(raw))));
		let awk = raw.mul(q(10 ** d2));
		awk = q(Math.ceil(awk.num / awk.den - 1e-12), 10 ** d2);
		const awkOk = awk.compare(right) < 0 && awk.compare(prev) > 0 && !SERIES.some((st) => st.equals(awk));
		const dec = (r: R) => decimals(r);
		const opt = (r: R) => numOpt(r, dec(r), qty.unit);
		const wrong = [opt(prev), opt(next), awkOk ? opt(awk) : opt(next2), opt(next2)];
		const rows: [string, string][] = data.map(([a, b]) => [fx(a, dX(s)), fx(b, dy)]);
		const where = axis === 'y' ? 'verticale' : 'orizzontale';
		const fill = M.div(right);
		return {
			prompt: 'Scegli la scala.',
			problem: proseAndTable(
				`La tabella riporta ${ctx.what}. Devi disegnare il grafico su un foglio a quadretti, e sull'asse ${where}, quello di $${qty.tex}$, hai $${N}$ quadretti. Quanto conviene far valere un quadretto?`,
				table(ctx.x, ctx.y, rows),
			),
			solution: `${t('un quadretto vale ')} ${withUnit(fx(right, dec(right)), qty.unit)}`,
			steps: [
				`${t('Il valore più grande di ')} ${qty.tex} ${t(' è ')} ${withUnit(fx(M, axis === 'y' ? dy : dX(s)), qty.unit)}`,
				`${fx(M, axis === 'y' ? dy : dX(s))} : ${N} \\approx ${fx(roundTo(raw, sigDecimals(raw, 2)), sigDecimals(raw, 2))}`,
				`${t('Il passo comodo (1, 2 o 5 per una potenza di 10) subito sopra è ')} ${withUnit(fx(right, dec(right)), qty.unit)}`,
				`${t('Con ')} ${withUnit(fx(prev, dec(prev)), qty.unit)} ${t(' servirebbero più di ')} ${N} ${t(' quadretti; con ')} ${withUnit(fx(right, dec(right)), qty.unit)} ${t(' ne servono circa ')} ${fx(roundTo(fill, 1), decimals(roundTo(fill, 1)))}`,
			],
			choice: makeChoice(rng, opt(right), wrong),
			params: { ctx: ctx.id, axis, N, awk: awkOk ? awk.toString() : null },
		};
	}
}


// ---------------------------------------------------------------------------
// Level 3: reading between the points

function level3(rng: Rng): Built {
	const s = setup(rng);
	const { ctx } = s;
	const all: [R, R][] = s.xcs.map((x) => [X(s, x), Y(s, yc(s, x))]);
	const lo = s.xcs[0], hi = s.xcs[s.xcs.length - 1];
	const odd = Array.from({ length: hi - lo - 1 }, (_, i) => lo + 1 + i).filter((x) => x % 2 === 1);
	const xc = rng.pick(odd);
	const ycell = yc(s, xc);
	const vx = X(s, xc), vy = Y(s, ycell);
	const alt = `Grafico di ${ctx.y.uni} in funzione di ${ctx.x.uni} su un foglio a quadretti, con ${all.length} punti misurati e la retta che passa tra i punti.`;
	const sc = scene(s, all, true, alt);
	const first = all.find(([a]) => a.sign() > 0)!;
	if (rng.next() < 0.5) {
		// the proportion with the first point, as if the line went through the origin
		const prop = first[1].mul(vx).div(first[0]);
		const wrong = [
			numOpt(Y(s, yc(s, xc - 1)), dY(s), ctx.y.unit),
			numOpt(Y(s, yc(s, xc + 1)), dY(s), ctx.y.unit),
			numOpt(q(ycell), 0, ctx.y.unit),
			...(decimals(prop) <= dY(s) && s.qc !== 0 ? [numOpt(prop, dY(s), ctx.y.unit)] : []),
			numOpt(vy.add(s.sy.mul(q(2))), dY(s), ctx.y.unit),
			numOpt(vy.add(s.sy.mul(q(3))), dY(s), ctx.y.unit),
		];
		return {
			prompt: 'Leggi il valore sul grafico.',
			problem: proseLines(`Il grafico mostra ${ctx.what}, con la retta che passa tra i punti. Leggi sulla retta quanto vale $${ctx.y.tex}$ quando $${ctx.x.tex}$ vale ${prose(fx(vx, dX(s)), ctx.x.unit)}.`),
			solution: `${ctx.y.tex} = ${withUnit(fx(vy, dY(s)), ctx.y.unit)}`,
			steps: [
				`${fx(vx, dX(s))} : ${fx(s.sx, dX(s))} = ${xc} ${t(' quadretti sull\'asse orizzontale, tra due punti misurati')}`,
				`${t('Lì la retta è a ')} ${ycell} ${t(' quadretti di altezza')}`,
				`${ctx.y.tex} = ${ycell} \\cdot ${fx(s.sy, dY(s))} = ${withUnit(fx(vy, dY(s)), ctx.y.unit)}`,
			],
			choice: makeChoice(rng, numOpt(vy, dY(s), ctx.y.unit), wrong),
			scene: sc,
			params: { ctx: ctx.id, mode: 'y', xc, sx: s.sx.toString(), sy: s.sy.toString(), qc: s.qc },
		};
	}
	const wrong = [
		numOpt(X(s, xc - 1), dX(s), ctx.x.unit),
		numOpt(X(s, xc + 1), dX(s), ctx.x.unit),
		numOpt(q(xc), 0, ctx.x.unit),
		numOpt(vx.add(s.sx.mul(q(2))), dX(s), ctx.x.unit),
		numOpt(vx.add(s.sx.mul(q(3))), dX(s), ctx.x.unit),
	];
	return {
		prompt: 'Leggi il valore sul grafico.',
		problem: proseLines(`Il grafico mostra ${ctx.what}, con la retta che passa tra i punti. Leggi sulla retta per quale valore di $${ctx.x.tex}$ si ha $${ctx.y.tex}$ uguale a ${prose(fx(vy, dY(s)), ctx.y.unit)}.`),
		solution: `${ctx.x.tex} = ${withUnit(fx(vx, dX(s)), ctx.x.unit)}`,
		steps: [
			`${fx(vy, dY(s))} : ${fx(s.sy, dY(s))} = ${ycell} ${t(' quadretti sull\'asse verticale')}`,
			`${t('La retta è a quell\'altezza a ')} ${xc} ${t(' quadretti dall\'asse verticale, tra due punti misurati')}`,
			`${ctx.x.tex} = ${xc} \\cdot ${fx(s.sx, dX(s))} = ${withUnit(fx(vx, dX(s)), ctx.x.unit)}`,
		],
		choice: makeChoice(rng, numOpt(vx, dX(s), ctx.x.unit), wrong),
		scene: sc,
		params: { ctx: ctx.id, mode: 'x', xc, sx: s.sx.toString(), sy: s.sy.toString(), qc: s.qc },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the measurement to redo

function level4(rng: Rng): Built {
	const s = setup(rng);
	const { ctx } = s;
	const data = measured(rng, s);
	const dy = dMeas(s);
	const candidates = data.map((_, i) => i).filter((i) => data[i][0].sign() > 0);
	const bad = rng.pick(candidates);
	const shift = s.sy.mul(q(rng.pick([2, 3]) * rng.pick([1, -1])));
	const moved = data[bad][1].add(shift);
	if (moved.sign() <= 0 || js(moved) > js(Y(s, s.cellsY))) return level4(rng);
	data[bad] = [data[bad][0], moved];
	const rows: [string, string][] = data.map(([a, b]) => [fx(a, dX(s)), fx(b, dy)]);
	const others = candidates.filter((i) => i !== bad);
	// four options: the bad row and three others, in the table's order
	const shown = [bad, ...rngPick(rng, others, 3)].sort((a, b) => a - b);
	const opt = (i: number) => ({ latex: `${ctx.x.tex} = ${withUnit(fx(data[i][0], dX(s)), ctx.x.unit)}`, values: [String(i)] });
	const choice: ChoiceAnswer = { kind: 'choice', options: shown.map(opt), correct: shown.indexOf(bad) };
	const alt = `Grafico di ${ctx.y.uni} in funzione di ${ctx.x.uni} con i ${data.length} punti della tabella.`;
	const exact = Y(s, yc(s, s.xcs[bad]));
	return {
		prompt: 'Trova la misura sbagliata.',
		problem: proseAndTable(`La tabella riporta ${ctx.what}, e il grafico ne mostra i punti. Tutti i punti stanno vicini a una retta, tranne uno. Quale misura va rifatta?`, table(ctx.x, ctx.y, rows)),
		solution: `${t('la misura con ')} ${ctx.x.tex} = ${withUnit(fx(data[bad][0], dX(s)), ctx.x.unit)}`,
		steps: [
			s.qc === 0
				? t("Gli altri punti stanno vicini a una retta che passa per l'origine,")
				: `${t('Gli altri punti stanno vicini a una retta che vale ')} ${withUnit(fx(Y(s, s.qc), dY(s)), ctx.y.unit)} ${t(' per ')} ${ctx.x.tex} = 0`,
			`${t('e cambia di ')} ${withUnit(fx(s.sy.mul(q(2)), dY(s)), ctx.y.unit)} ${t(' ogni ')} ${withUnit(fx(s.sx.mul(q(2)), dX(s)), ctx.x.unit)}`,
			`${t('Per ')} ${ctx.x.tex} = ${withUnit(fx(data[bad][0], dX(s)), ctx.x.unit)} ${t(' la retta dà circa ')} ${withUnit(fx(exact, dY(s)), ctx.y.unit)}${t(', la tabella ')} ${withUnit(fx(moved, dy), ctx.y.unit)}`,
			t('La differenza è molto più grande di quella degli altri punti: quella misura va rifatta.'),
		],
		choice,
		scene: scene(s, data, false, alt),
		params: { ctx: ctx.id, bad, sx: s.sx.toString(), sy: s.sy.toString(), qc: s.qc },
	};
}

function rngPick<T>(rng: Rng, xs: T[], k: number): T[] {
	const pool = [...xs];
	const out: T[] = [];
	while (out.length < k && pool.length) out.push(pool.splice(rng.int(0, pool.length - 1), 1)[0]);
	return out;
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4 };

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
	if (ch.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni ripetute');
	if (ch.correct < 0 || ch.correct >= ch.options.length) v.push('opzione giusta fuori posto');
	if ([1, 3].includes(sample.level) && !sample.scene) v.push('manca il grafico');
	return v;
}

export const fisTabelleGrafici: Generator = {
	id: ID,
	title: 'Tabelle e grafici cartesiani',
	levels: {
		1: { label: 'Leggere un punto del grafico', constraints: ['un punto misurato su un foglio a quadretti; si chiede y dato x o x dato y', 'molla, lunghezza della molla, acqua sul fornello, carrello, candela'] },
		2: { label: 'Scegliere la scala di un asse', constraints: ['tabella di misure e numero di quadretti da 8 a 20', 'risposta: il passo 1, 2 o 5 per una potenza di 10 più piccolo che fa stare i dati'] },
		3: { label: 'Leggere tra i punti sulla retta', constraints: ['grafico con la retta tra i punti; un valore a metà tra due punti misurati', 'si chiede y dato x o x dato y'] },
		4: { label: 'La misura da rifare', constraints: ['tabella e grafico; tutti i punti su una retta tranne uno, spostato di 2 o 3 quadretti', 'quattro opzioni tra le righe della tabella'] },
	},
	generate,
	check,
};

export default fisTabelleGrafici;
