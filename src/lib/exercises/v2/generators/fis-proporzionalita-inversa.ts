/**
 * Proporzionalità inversa e quadratica (physics, first year). Spec: specs/exercises/fis-proporzionalita-inversa.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/12-fis-proporzionalita-inversa.md): the constant of an
 * inverse proportionality from a table, with the product of the units; a value predicted with the inverse
 * proportionality; a value predicted with the proportionality to the square; the law of a table among direct, linear,
 * inverse and quadratic; the law of the points of a graph (a `grafico-dati` scene). Every answer is a multiple choice;
 * the wrong options are the mistakes of the lesson: the ratio in place of the product, the direct proportion in an
 * inverse problem, the double in place of the quadruple, a falling line taken for an inverse proportionality.
 *
 * Numbers are built backwards from the constant, so every value is exact with the decimals the table shows.
 */
import type { ChoiceAnswer, Generator, Rng, Sample, SceneRef } from '../types';
import { q } from '../rational';
import { textBlock } from '../insiemi';
import { type R, type Qty, dr, decimals, fx, prose, withUnit, table, proseAndTable, numOpt, textOpt, makeChoice, graphScene, js, roundTo, sigDecimals } from '../grafici';

export const ID = 'fis-proporzionalita-inversa';

const t = (s: string) => `\\text{${s}}`;

/** At least two significant figures, and all the digits the exact value has. */
const kDec = (k: R) => Math.max(decimals(k), sigDecimals(k, 2));

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

// ---------------------------------------------------------------------------
// Inverse proportionality

interface Inverse {
	id: string;
	x: Qty;
	y: Qty;
	what: string;
	ks: string[];
	xs: string[];
	dx: number;
	dy: number;
	/** Unit of k = x·y, of the ratio y/x, and a unit that forgets a factor. */
	ku: string;
	ratioU: string;
	wrongU: string;
	story: (x1: string, y1: string, x2: string) => string;
}

const INVERSE: Inverse[] = [
	{
		id: 'siringa',
		x: { tex: 'V', uni: 'V', unit: 'cm3' },
		y: { tex: 'p', uni: 'p', unit: 'kPa' },
		what: "la pressione $p$ dell'aria chiusa in una siringa e il suo volume $V$",
		ks: ['1200', '1500', '1800', '2400', '3000', '3600'],
		xs: ['10', '12', '15', '20', '24', '25', '30', '40', '50', '60'],
		dx: 0,
		dy: 0,
		ku: 'kPa*cm3',
		ratioU: 'kPa/cm3',
		wrongU: 'kPa',
		story: (x1, y1, x2) => `L'aria chiusa in una siringa ha la pressione di ${y1} quando il volume è di ${x1}. A temperatura costante la pressione è inversamente proporzionale al volume. Quanto vale la pressione quando il volume è di ${x2}?`,
	},
	{
		id: 'rotaia',
		x: { tex: 'v', uni: 'v', unit: 'm/s' },
		y: { tex: 't', uni: 't', unit: 's' },
		what: 'il tempo $t$ che un carrello impiega a percorrere una rotaia e la sua velocità $v$',
		ks: ['1.2', '1.5', '1.8', '2.4'],
		xs: ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.8', '1', '1.2'],
		dx: 2,
		dy: 1,
		ku: 'm',
		ratioU: 's2/m',
		wrongU: 'm/s',
		story: (x1, y1, x2) => `A ${x1} un carrello percorre tutta una rotaia in ${y1}. Il tempo è inversamente proporzionale alla velocità. Quanto tempo impiega il carrello a ${x2}?`,
	},
	{
		id: 'vasca',
		x: { tex: 'Q', uni: 'Q', unit: 'L/min' },
		y: { tex: 't', uni: 't', unit: 'min' },
		what: 'il tempo $t$ per riempire una vasca e la portata $Q$ del rubinetto',
		ks: ['60', '72', '90', '120', '180', '240'],
		xs: ['2', '3', '4', '5', '6', '8', '10', '12', '15', '20'],
		dx: 0,
		dy: 1,
		ku: 'L',
		ratioU: 'min2/L',
		wrongU: 'min',
		story: (x1, y1, x2) => `Con un rubinetto che versa ${x1} una vasca si riempie in ${y1}. Il tempo è inversamente proporzionale alla portata. Quanto tempo serve con un rubinetto che versa ${x2}?`,
	},
];

/** x values of an inverse experiment that give y exact to its decimals, in a sensible range. */
function inverseXs(c: Inverse, k: R): R[] {
	return c.xs.map(dr).filter((x) => {
		const y = k.div(x);
		return decimals(y) <= c.dy && js(y) <= (c.id === 'siringa' ? 400 : 60) && js(y) >= (c.id === 'rotaia' ? 1 : 2);
	});
}

function level1(rng: Rng): Built {
	for (;;) {
		const c = rng.pick(INVERSE);
		const k = dr(rng.pick(c.ks));
		const pool = inverseXs(c, k);
		if (pool.length < 5) continue;
		const xs = pickDistinct(rng, pool, rng.int(4, 5)).sort((a, b) => a.compare(b));
		const rows: [string, string][] = xs.map((x) => [fx(x, c.dx), fx(k.div(x), c.dy)]);
		const kd = kDec(k);
		const ratio = k.div(xs[0]).div(xs[0]);
		const rd = sigDecimals(ratio, 2);
		const wrong = [
			numOpt(roundTo(ratio, rd), rd, c.ratioU), // the ratio in place of the product
			numOpt(k, kd, c.wrongU), // the unit with a factor forgotten
			numOpt(k.mul(q(10)), kDec(k.mul(q(10))), c.ku),
			numOpt(k.div(q(10)), kDec(k.div(q(10))), c.ku),
		];
		const y0 = k.div(xs[0]);
		return {
			prompt: 'Calcola la costante di proporzionalità.',
			problem: proseAndTable(`La tabella riporta ${c.what}, che sono inversamente proporzionali. Quanto vale la costante di proporzionalità $k = ${c.x.tex} \\cdot ${c.y.tex}$?`, table(c.x, c.y, rows)),
			solution: `k = ${withUnit(fx(k, kd), c.ku)}`,
			steps: [
				t('Il prodotto è lo stesso in ogni riga, per esempio nella prima:'),
				`k = ${withUnit(fx(xs[0], c.dx), c.x.unit)} \\cdot ${withUnit(fx(y0, c.dy), c.y.unit)} = ${withUnit(fx(k, kd), c.ku)}`,
				`${t("L'unità è il prodotto delle due unità")}${c.id === 'siringa' ? '' : c.id === 'rotaia' ? `${t(': ')} \\text{m/s} \\cdot \\text{s} = \\text{m}` : `${t(': ')} \\text{L/min} \\cdot \\text{min} = \\text{L}`}`,
			],
			choice: makeChoice(rng, numOpt(k, kd, c.ku), wrong),
			params: { ctx: c.id, k: k.toString(), xs: xs.map(String) },
		};
	}
}

function level2(rng: Rng): Built {
	for (;;) {
		const c = rng.pick(INVERSE);
		const k = dr(rng.pick(c.ks));
		const pool = inverseXs(c, k);
		if (pool.length < 2) continue;
		const [x1, x2] = pickDistinct(rng, pool, 2);
		const y1 = k.div(x1), y2 = k.div(x2);
		const rd = (r: R) => roundTo(r, c.dy);
		const wrong = [
			numOpt(rd(y1.mul(x2).div(x1)), c.dy, c.y.unit), // direct proportion
			numOpt(rd(y1.mul(x1).mul(x1).div(x2).div(x2)), c.dy, c.y.unit), // inverse of the square
			numOpt(y1, c.dy, c.y.unit), // unchanged
			numOpt(rd(y2.mul(q(2))), c.dy, c.y.unit),
			numOpt(rd(y2.div(q(2))), c.dy, c.y.unit),
		];
		const f = x2.div(x1);
		const fTex = decimals(f) <= 2 ? fx(f, decimals(f)) : `\\dfrac{${fx(x2, c.dx)}}{${fx(x1, c.dx)}}`;
		return {
			prompt: 'Prevedi il valore.',
			problem: textBlock(c.story(prose(fx(x1, c.dx), c.x.unit), prose(fx(y1, c.dy), c.y.unit), prose(fx(x2, c.dx), c.x.unit))),
			solution: `${c.y.tex} = ${withUnit(fx(y2, c.dy), c.y.unit)}`,
			steps: [
				`k = ${fx(x1, c.dx)} \\cdot ${fx(y1, c.dy)} = ${withUnit(fx(k, kDec(k)), c.ku)}`,
				`${c.y.tex} = \\dfrac{k}{${c.x.tex}} = \\dfrac{${fx(k, kDec(k))}}{${fx(x2, c.dx)}} = ${withUnit(fx(y2, c.dy), c.y.unit)}`,
				`${t('Controllo: ')} ${c.x.tex} ${t(' è moltiplicato per ')} ${fTex}${t(', e ')} ${c.y.tex} ${t(' è diviso per lo stesso numero')}`,
			],
			choice: makeChoice(rng, numOpt(y2, c.dy, c.y.unit), wrong),
			params: { ctx: c.id, k: k.toString(), x1: x1.toString(), x2: x2.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Proportionality to the square

interface Square {
	id: string;
	x: Qty;
	y: Qty;
	ks: string[];
	xs: string[];
	dx: number;
	story: (x1: string, y1: string, x2: string) => string;
}

const SQUARE: Square[] = [
	{
		id: 'piano',
		x: { tex: 't', uni: 't', unit: 's' },
		y: { tex: 's', uni: 's', unit: 'cm' },
		ks: ['8', '10', '12', '16', '20', '24'],
		xs: ['0.5', '1', '1.5', '2', '2.5', '3'],
		dx: 1,
		story: (x1, y1, x2) => `Un carrello che parte da fermo su una rotaia inclinata percorre ${y1} in ${x1}. La distanza percorsa è proporzionale al quadrato del tempo. Quanta strada percorre il carrello in ${x2}?`,
	},
	{
		id: 'caduta',
		x: { tex: 't', uni: 't', unit: 's' },
		y: { tex: 'h', uni: 'h', unit: 'm' },
		ks: ['4.9'],
		xs: ['1', '2', '3', '4'],
		dx: 1,
		story: (x1, y1, x2) => `Un sasso lasciato cadere da fermo scende di ${y1} in ${x1}. La distanza di caduta è proporzionale al quadrato del tempo. Di quanto scende il sasso in ${x2}?`,
	},
];

function level3(rng: Rng): Built {
	for (;;) {
		const c = rng.pick(SQUARE);
		const k = dr(rng.pick(c.ks));
		const pool = c.xs.map(dr).filter((x) => decimals(k.mul(x).mul(x)) <= 1);
		if (pool.length < 2) continue;
		const [x1, x2] = pickDistinct(rng, pool, 2);
		const y1 = k.mul(x1).mul(x1), y2 = k.mul(x2).mul(x2);
		const r = x2.div(x1);
		const rd = (v: R) => roundTo(v, 1);
		const wrong = [
			numOpt(rd(y1.mul(r)), 1, c.y.unit), // proportional to the time
			numOpt(rd(y1.mul(r).mul(q(2))), 1, c.y.unit), // twice the factor
			numOpt(rd(y1.div(r).div(r)), 1, c.y.unit), // the square turned upside down
			numOpt(rd(y1.mul(r).mul(r).mul(r)), 1, c.y.unit),
			numOpt(rd(y2.mul(q(2))), 1, c.y.unit),
		];
		const rTex = decimals(r) <= 2 ? fx(r, decimals(r)) : `\\dfrac{${fx(x2, c.dx)}}{${fx(x1, c.dx)}}`;
		const r2 = r.mul(r);
		const r2Tex = decimals(r2) <= 4 ? fx(r2, decimals(r2)) : `\\left(${rTex}\\right)^2`;
		return {
			prompt: 'Prevedi il valore.',
			problem: textBlock(c.story(prose(fx(x1, c.dx), c.x.unit), prose(fx(y1, 1), c.y.unit), prose(fx(x2, c.dx), c.x.unit))),
			solution: `${c.y.tex} = ${withUnit(fx(y2, 1), c.y.unit)}`,
			steps: [
				`${t('Il tempo è moltiplicato per ')} ${rTex}${t(', quindi la distanza per ')} \\left(${rTex}\\right)^2 = ${r2Tex}`,
				`${c.y.tex} = ${fx(y1, 1)} \\cdot ${r2Tex} = ${withUnit(fx(y2, 1), c.y.unit)}`,
				`${t('Con la costante: ')} k = \\dfrac{${fx(y1, 1)}}{${fx(x1, c.dx)}^2} = ${withUnit(fx(k, kDec(k)), c.id === 'piano' ? 'cm/s2' : 'm/s2')}`,
			],
			choice: makeChoice(rng, numOpt(y2, 1, c.y.unit), wrong),
			params: { ctx: c.id, k: k.toString(), x1: x1.toString(), x2: x2.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: which law

const LAWS = { diretta: 'proporzionalità diretta', lineare: 'lineare con termine noto', inversa: 'proporzionalità inversa', quadratica: 'proporzionalità quadratica' } as const;
type Law = keyof typeof LAWS;
const LAW_KEYS = Object.keys(LAWS) as Law[];
const lawChoice = (law: Law): ChoiceAnswer => ({ kind: 'choice', options: LAW_KEYS.map((k) => textOpt(k, LAWS[k])), correct: LAW_KEYS.indexOf(law) });

const XQ: Qty = { tex: 'x', uni: 'x', unit: 's' };
const YQ: Qty = { tex: 'y', uni: 'y', unit: 'cm' };

function level4(rng: Rng): Built {
	const law = rng.pick(LAW_KEYS);
	for (;;) {
		let xs: R[], ys: R[];
		if (law === 'inversa') {
			const K = q(rng.pick([24, 36, 48, 60, 72, 120]));
			const pool = [1, 2, 3, 4, 5, 6, 8, 10, 12].map((x) => q(x)).filter((x) => decimals(K.div(x)) <= 1);
			xs = pickDistinct(rng, pool, 4).sort((a, b) => a.compare(b));
			ys = xs.map((x) => K.div(x));
		} else {
			const start = rng.int(1, 3);
			const step = rng.pick([1, 2]);
			xs = [0, 1, 2, 3].map((i) => q(start + step * i));
			const k = dr(rng.pick(['1.5', '2', '2.5', '3', '4', '6']));
			const q0 = q(rng.int(2, 20));
			ys = xs.map((x) => (law === 'diretta' ? k.mul(x) : law === 'lineare' ? k.mul(x).add(q0) : k.mul(x).mul(x).div(q(2))));
		}
		if (ys.some((y) => decimals(y) > 1)) continue;
		const rows: [string, string][] = xs.map((x, i) => [fx(x, 0), fx(ys[i], 1)]);
		const inv = (i: number) => (law === 'diretta' ? ys[i].div(xs[i]) : law === 'inversa' ? ys[i].mul(xs[i]) : law === 'quadratica' ? ys[i].div(xs[i]).div(xs[i]) : ys[1].sub(ys[0]).div(xs[1].sub(xs[0])));
		const what = law === 'diretta' ? 'y / x' : law === 'inversa' ? 'x \\cdot y' : law === 'quadratica' ? 'y / x^2' : '\\Delta y / \\Delta x';
		const c0 = inv(0);
		const cd = Math.min(3, decimals(c0));
		return {
			prompt: 'Riconosci la legge.',
			problem: proseAndTable("In un esperimento si misurano due grandezze, $x$ in secondi e $y$ in centimetri. Quale legge lega $y$ a $x$?", table(XQ, YQ, rows)),
			solution: t(LAWS[law]),
			steps: [
				law === 'diretta' ? t('Il rapporto y / x è lo stesso in ogni riga.') : `${t('I rapporti ')} y / x ${t(' cambiano: ')} ${fx(roundTo(ys[0].div(xs[0]), 2), decimals(roundTo(ys[0].div(xs[0]), 2)))}${t(', ')} ${fx(roundTo(ys[1].div(xs[1]), 2), decimals(roundTo(ys[1].div(xs[1]), 2)))}${t(', ...')}`,
				`${t('È costante ')} ${what} = ${fx(roundTo(c0, cd), cd)}${t(' in ogni riga')}`,
				t(`La legge è la ${LAWS[law]}.`.replace('la lineare', 'la dipendenza lineare').replace('La legge è la dipendenza lineare con termine noto.', 'La dipendenza è lineare, con termine noto.')),
			],
			choice: lawChoice(law),
			params: { law },
		};
	}
}

function level5(rng: Rng): Built {
	const law = rng.pick(LAW_KEYS);
	for (;;) {
		let pts: [number, number][];
		if (law === 'inversa') {
			const K = rng.pick([12, 16, 18, 24]);
			const divs = [1, 2, 3, 4, 6, 8, 9, 12].filter((d) => K % d === 0 && K / d <= 16 && d <= 12 && d >= 2);
			pts = pickDistinct(rng, divs, Math.min(5, divs.length)).sort((a, b) => a - b).map((d) => [d, K / d]);
			if (pts.length < 4) continue;
		} else if (law === 'quadratica') {
			const step = rng.pick([2, 3]);
			pts = [1, 2, 3, 4].map((i) => [i * step, i * i]);
		} else if (law === 'diretta') {
			const r = rng.pick([1, 2]);
			const step = r === 2 ? 1 : 2;
			pts = [1, 2, 3, 4, 5].map((i) => [i * step, i * step * r]);
		} else if (rng.next() < 0.5) {
			const qc = rng.int(2, 6);
			pts = [1, 2, 3, 4, 5].map((i) => [2 * i, qc + 2 * i]);
		} else {
			// a falling line: it is linear, not an inverse proportionality
			const qc = rng.int(11, 14);
			pts = [1, 2, 3, 4, 5].map((i) => [2 * i, qc - 2 * i]);
		}
		const sx = dr(rng.pick(['0.5', '1', '2']));
		const sy = dr(rng.pick(['1', '2', '5']));
		const maxY = Math.max(...pts.map((p) => p[1]));
		const cellsY = maxY + 2;
		if (cellsY > 18) continue;
		const values: [R, R][] = pts.map(([a, b]) => [sx.mul(q(a)), sy.mul(q(b))]);
		const alt = `Grafico di y in funzione di x su un foglio a quadretti, con ${pts.length} punti misurati e nessuna linea.`;
		const scene = graphScene(
			{ nome: 'x', unita: 's', passo: js(sx), celle: Math.max(8, Math.max(...pts.map((p) => p[0])) + 2), etichette: 2 },
			{ nome: 'y', unita: 'cm', passo: js(sy), celle: cellsY, etichette: 2 },
			{ punti: values.map(([a, b]) => [js(a), js(b)]) },
			alt,
		);
		const dxs = decimals(sx), dys = decimals(sy);
		const pv = (i: number) => `(${fx(values[i][0], dxs)};\\ ${fx(values[i][1], dys)})`;
		const shape =
			law === 'inversa'
				? 'I punti scendono lungo una curva, e il prodotto x \\cdot y è lo stesso per tutti'
				: law === 'quadratica'
					? 'I punti salgono lungo una curva sempre più ripida, e y / x^2 è lo stesso per tutti'
					: law === 'diretta'
						? 'I punti stanno su una retta che passa per l\'origine: y / x è lo stesso per tutti'
						: 'I punti stanno su una retta che non passa per l\'origine';
		const inv0 = law === 'inversa' ? values[0][0].mul(values[0][1]) : law === 'quadratica' ? values[0][1].div(values[0][0]).div(values[0][0]) : values[0][1].div(values[0][0]);
		const inv1 = law === 'inversa' ? values[1][0].mul(values[1][1]) : law === 'quadratica' ? values[1][1].div(values[1][0]).div(values[1][0]) : values[1][1].div(values[1][0]);
		const expr = law === 'inversa' ? 'x \\cdot y' : law === 'quadratica' ? 'y / x^2' : 'y / x';
		const r2 = (r: R) => fx(roundTo(r, 2), decimals(roundTo(r, 2)));
		return {
			prompt: 'Riconosci la legge.',
			problem: textBlock('Il grafico mostra i punti misurati di due grandezze, $x$ in secondi e $y$ in centimetri. Quale legge lega $y$ a $x$?'),
			solution: t(LAWS[law]),
			steps: [
				`${t('Due punti letti sul grafico: ')} ${pv(0)}${t(' e ')} ${pv(1)}`,
				`${expr}${t(': ')} ${r2(inv0)}${t(' e ')} ${r2(inv1)}`,
				`\\text{${shape.replace(/x \\cdot y|y \/ x\^2|y \/ x/g, (m) => `}${m}\\text{`)}.}`,
			],
			choice: lawChoice(law),
			scene,
			params: { law, sx: sx.toString(), sy: sy.toString(), pts },
		};
	}
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
	if (sample.level === 5 && !sample.scene) v.push('manca il grafico');
	return v;
}

export const fisProporzionalitaInversa: Generator = {
	id: ID,
	title: 'Proporzionalità inversa e quadratica',
	levels: {
		1: { label: 'La costante inversa con la sua unità', constraints: ['tabella di 4 o 5 righe in proporzionalità inversa', 'siringa, carrello sulla rotaia, vasca'] },
		2: { label: 'Prevedere con la proporzionalità inversa', constraints: ['una coppia di valori e un nuovo valore di x'] },
		3: { label: 'Prevedere con la proporzionalità quadratica', constraints: ['carrello sul piano inclinato, sasso che cade', 'risposta con un decimale'] },
		4: { label: 'Riconoscere la legge dalla tabella', constraints: ['diretta, lineare con termine noto, inversa, quadratica, circa un quarto ciascuna'] },
		5: { label: 'Riconoscere la legge dal grafico', constraints: ['punti su un foglio a quadretti, senza linea', 'anche la retta che scende, che non è una proporzionalità inversa'] },
	},
	generate,
	check,
};

export default fisProporzionalitaInversa;
