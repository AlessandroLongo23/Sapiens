/**
 * Regressione e correlazione. Spec: specs/exercises/regressione-correlazione.md
 *
 * Seven levels in the order of the lesson: the covariance of four or five pairs, the slope of the regression
 * line from the data, the line from the indices, an estimate with the line, r from the indices, r from the
 * data rounded to the hundredth, what a value of r says. The data are built backwards from the deviations
 * (integers with sum zero) and integer means, so every index is a finite decimal; the levels on the indices
 * start from m or r and compute the covariance from it.
 * The wrong options are the mistakes the lesson warns about: the standard deviation where the variance goes
 * (and the other way round), a covariance not divided by n or with the signs of the products lost, q with the
 * wrong sign, an estimate without q, r read as a cause.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import { buildChoice, weighted } from '../razionali';
import { textBlock } from '../insiemi';
import { type Mistake, canChoose, choiceFromParams, choiceViolations, dec, finite, fixed, isum, numberChoice, paren, roundTo, signed, sqrt100, t } from '../bivariata';

export const ID = 'regressione-correlazione';

const NUM_WORD: Record<number, string> = { 4: 'quattro', 5: 'cinque' };

// ---------------------------------------------------------------------------
// Pairs of data

interface PairCtx {
	key: string;
	intro: (w: string) => string;
	x: [number, number];
	y: [number, number];
	/** The sign the covariance must have for the story to make sense. */
	sign?: 1 | -1;
}

const PAIR_CTX: PairCtx[] = [
	{ key: 'studio', intro: (w) => `Di ${w} studenti si conoscono le ore di studio $x$ in una settimana e il voto $y$ della verifica.`, x: [1, 12], y: [3, 10], sign: 1 },
	{ key: 'auto', intro: (w) => `Di ${w} auto usate dello stesso modello si conoscono gli anni $x$ e il prezzo $y$ in migliaia di euro.`, x: [1, 12], y: [2, 20], sign: -1 },
	{ key: 'gol', intro: (w) => `Di ${w} giocatori si conoscono gli allenamenti $x$ fatti in un mese e i gol $y$ segnati.`, x: [2, 16], y: [0, 12], sign: 1 },
	{ key: 'dati', intro: (w) => `Sono date ${w} coppie di valori di due caratteri $x$ e $y$.`, x: [0, 12], y: [0, 20] },
];

interface Pairs {
	ctx: PairCtx;
	n: number;
	xs: number[];
	ys: number[];
	dx: number[];
	dy: number[];
	mx: number;
	my: number;
	/** Sum of the products of the deviations, of the squares of dx, of the squares of dy. */
	P: number;
	A: number;
	B: number;
}

/** n integers in [-m, m] with sum 0 (the last one balances the others), or null. */
function deviations(rng: Rng, n: number, m: number): number[] | null {
	const d = Array.from({ length: n - 1 }, () => rng.int(-m, m));
	const last = -isum(d);
	if (Math.abs(last) > m) return null;
	d.splice(rng.int(0, n - 1), 0, last);
	return d;
}

function pairs(rng: Rng, n: number): Pairs | null {
	const ctx = rng.pick(PAIR_CTX);
	const dx = deviations(rng, n, 5), dy = deviations(rng, n, 4);
	if (!dx || !dy) return null;
	if (new Set(dx).size !== n || new Set(dy).size < 3) return null;
	const order = dx.map((_, i) => i).sort((a, b) => dx[a] - dx[b]);
	const sx = order.map((i) => dx[i]), sy = order.map((i) => dy[i]);
	const P = isum(sx.map((d, i) => d * sy[i]));
	if (P === 0 || (ctx.sign && Math.sign(P) !== ctx.sign)) return null;
	const loX = ctx.x[0] - Math.min(...sx), hiX = ctx.x[1] - Math.max(...sx);
	const loY = ctx.y[0] - Math.min(...sy), hiY = ctx.y[1] - Math.max(...sy);
	if (loX > hiX || loY > hiY) return null;
	const mx = rng.int(loX, hiX), my = rng.int(loY, hiY);
	return { ctx, n, xs: sx.map((d) => mx + d), ys: sy.map((d) => my + d), dx: sx, dy: sy, mx, my, P, A: isum(sx.map((d) => d * d)), B: isum(sy.map((d) => d * d)) };
}

const pairsTable = (d: Pairs) => `\\begin{array}{c|${'c'.repeat(d.n)}} x & ${d.xs.join(' & ')} \\\\ \\hline y & ${d.ys.join(' & ')} \\end{array}`;
const pairsProblem = (d: Pairs) => textBlock(d.ctx.intro(NUM_WORD[d.n]), 46, [pairsTable(d)]);
const pairsParams = (d: Pairs) => ({ context: d.ctx.key, xs: d.xs.map(String), ys: d.ys.map(String) });
const list = (xs: number[]) => xs.join(', \\ ');
const plusList = (xs: number[]) => xs.map((x, i) => (i === 0 ? `${x}` : x < 0 ? ` - ${-x}` : ` + ${x}`)).join('');

function meanSteps(d: Pairs): string[] {
	return [
		`\\bar{x} = \\frac{${isum(d.xs)}}{${d.n}} = ${d.mx}, \\quad \\bar{y} = \\frac{${isum(d.ys)}}{${d.n}} = ${d.my}`,
		`${t('Scarti di ')} x${t(': ')} ${list(d.dx)}`,
		`${t('Scarti di ')} y${t(': ')} ${list(d.dy)}`,
	];
}

interface Built {
	prompt: string;
	problem: string;
	steps: string[];
	solution: string;
	answer: Sample['answer'];
	params: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Level 1: covariance

function level1(rng: Rng): Built | null {
	const d = pairs(rng, rng.pick([4, 5]));
	if (!d) return null;
	const prods = d.dx.map((a, i) => a * d.dy[i]);
	const cov = q(d.P, d.n);
	const mistakes: Mistake[] = [
		{ value: q(d.P), why: 'non diviso per n' },
		{ value: q(isum(prods.map(Math.abs)), d.n), why: 'segni dei prodotti persi' },
		{ value: cov.neg(), why: 'segno' },
		{ value: q(isum(d.xs.map((x, i) => x * d.ys[i])), d.n), why: 'senza togliere il prodotto delle medie' },
	];
	return {
		prompt: 'Calcola la covarianza.',
		problem: pairsProblem(d),
		steps: [...meanSteps(d), `${t('Prodotti degli scarti: ')} ${list(prods)}`, `\\sigma_{xy} = \\frac{${plusList(prods)}}{${d.n}} = \\frac{${d.P}}{${d.n}} = ${dec(cov)}`],
		solution: `\\sigma_{xy} = ${dec(cov)}`,
		answer: { kind: 'number', value: cov.toString() },
		params: { ...pairsParams(d), case: `${d.n} coppie`, ...numberChoice(cov, mistakes) },
	};
}

// ---------------------------------------------------------------------------
// Level 2: slope of the regression line from the data

function level2(rng: Rng): Built | null {
	const d = pairs(rng, rng.pick([4, 5]));
	if (!d) return null;
	const m = q(d.P, d.A);
	if (!finite(m, 2) || m.equals(q(1)) || m.equals(q(-1))) return null;
	const cov = q(d.P, d.n), vx = q(d.A, d.n);
	const mistakes: Mistake[] = [
		{ value: cov, why: 'covarianza' },
		{ value: q(d.P, d.B), why: 'diviso per la varianza di y' },
		{ value: q(d.A, d.P), why: 'rapporto rovesciato' },
		{ value: m.neg(), why: 'segno' },
	];
	const prods = d.dx.map((a, i) => a * d.dy[i]);
	return {
		prompt: 'Calcola il coefficiente angolare della retta di regressione di y rispetto a x.',
		problem: pairsProblem(d),
		steps: [
			...meanSteps(d),
			`${t('Somma dei prodotti degli scarti: ')} ${plusList(prods)} = ${d.P}`,
			`${t('Somma dei quadrati degli scarti di ')} x${t(': ')} ${d.dx.map((a) => a * a).join(' + ')} = ${d.A}`,
			`\\sigma_{xy} = \\frac{${d.P}}{${d.n}} = ${dec(cov)}, \\quad \\sigma_x^2 = \\frac{${d.A}}{${d.n}} = ${dec(vx)}`,
			`m = \\frac{\\sigma_{xy}}{\\sigma_x^2} = \\frac{${dec(cov)}}{${dec(vx)}} = ${dec(m)}`,
		],
		solution: `m = ${dec(m)}`,
		answer: { kind: 'number', value: m.toString() },
		params: { ...pairsParams(d), case: `${d.n} coppie`, ...numberChoice(m, mistakes) },
	};
}

// ---------------------------------------------------------------------------
// Levels 3 and 4: the line from the indices, and an estimate

const SLOPES = [q(1, 4), q(1, 2), q(3, 4), q(3, 2), q(2), q(5, 2), q(3), q(2, 5), q(3, 5), q(4, 5), q(6, 5)];
const INDEX_INTRO = 'Di due caratteri $x$ e $y$ si conoscono questi indici.';

/** y = mx + q as the lesson writes it. */
function lineTex(m: Rational, k: Rational): string {
	const mt = m.equals(q(1)) ? '' : m.equals(q(-1)) ? '-' : dec(m);
	return `y = ${mt}x${k.sign() === 0 ? '' : signed(k)}`;
}
const lineOpt = (m: Rational, k: Rational): ChoiceOption => ({ latex: lineTex(m, k), values: [m.toString(), k.toString()] });

function level3(rng: Rng, c: 'm positivo' | 'm negativo'): Built | null {
	const m = c === 'm positivo' ? rng.pick(SLOPES) : rng.pick(SLOPES).neg();
	const sx = rng.int(2, 5), mx = rng.int(2, 12), my = rng.int(5, 40);
	const cov = m.mul(q(sx * sx));
	const k = q(my).sub(m.mul(q(mx)));
	if (k.sign() === 0 || k.equals(m)) return null;
	const mBad = cov.div(q(sx));
	const cands = [
		lineOpt(mBad, q(my).sub(mBad.mul(q(mx)))), // divided by σx
		lineOpt(m, q(my).add(m.mul(q(mx)))), // q = ȳ + m x̄
		lineOpt(k, m), // m and q swapped
		lineOpt(m, q(my)), // q = ȳ
	].filter((o) => o.values.every((v) => finite(Rational.parse(v), 2)));
	const answer = buildChoice(rng, lineOpt(m, k), cands, (i) => lineOpt(m, k.add(q(i + 1))));
	return {
		prompt: 'Scegli la retta di regressione di y rispetto a x.',
		problem: textBlock(INDEX_INTRO, 46, [`\\bar{x} = ${mx} \\qquad \\bar{y} = ${my}`, `\\sigma_x = ${sx} \\qquad \\sigma_{xy} = ${dec(cov)}`]),
		steps: [
			`${t('Per ')} m ${t(' serve la varianza: ')} \\sigma_x^2 = ${sx}^2 = ${sx * sx}`,
			`m = \\frac{\\sigma_{xy}}{\\sigma_x^2} = \\frac{${dec(cov)}}{${sx * sx}} = ${dec(m)}`,
			`q = \\bar{y} - m\\bar{x} = ${my} - ${paren(m)} \\cdot ${mx} = ${dec(k)}`,
			lineTex(m, k),
		],
		solution: lineTex(m, k),
		answer,
		params: { mx: String(mx), my: String(my), sx: String(sx), cov: cov.toString(), case: c },
	};
}

function level4(rng: Rng, c: 'm positivo' | 'm negativo'): Built | null {
	const m = c === 'm positivo' ? rng.pick(SLOPES) : rng.pick(SLOPES).neg();
	const vx = rng.pick([4, 5, 8, 10, 16, 20, 25]), mx = rng.int(4, 20), my = rng.int(10, 60);
	const cov = m.mul(q(vx));
	const k = q(my).sub(m.mul(q(mx)));
	const x0 = mx + rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
	const est = m.mul(q(x0)).add(k);
	if (k.sign() === 0 || est.sign() <= 0) return null;
	const mistakes: Mistake[] = [
		{ value: m.mul(q(x0)), why: 'senza q' },
		{ value: q(my).add(m.mul(q(x0))), why: 'q uguale alla media' },
		{ value: m.mul(q(x0)).add(q(my).add(m.mul(q(mx)))), why: 'segno di q' },
		{ value: q(my), why: 'la media di y' },
	];
	return {
		prompt: `Stima il valore di y per x = ${x0} con la retta di regressione di y rispetto a x.`,
		problem: textBlock(INDEX_INTRO, 46, [`\\bar{x} = ${mx} \\qquad \\bar{y} = ${my}`, `\\sigma_x^2 = ${vx} \\qquad \\sigma_{xy} = ${dec(cov)}`]),
		steps: [
			`m = \\frac{\\sigma_{xy}}{\\sigma_x^2} = \\frac{${dec(cov)}}{${vx}} = ${dec(m)}`,
			`q = \\bar{y} - m\\bar{x} = ${my} - ${paren(m)} \\cdot ${mx} = ${dec(k)}`,
			`${t('La retta è ')} ${lineTex(m, k)}`,
			`${t('Per ')} x = ${x0}${t(': ')} y = ${paren(m)} \\cdot ${x0}${signed(k)} = ${dec(est)}`,
		],
		solution: `y = ${dec(est)}`,
		answer: { kind: 'number', value: est.toString() },
		params: { mx: String(mx), my: String(my), vx: String(vx), cov: cov.toString(), x0: String(x0), case: c, ...numberChoice(est, mistakes) },
	};
}

// ---------------------------------------------------------------------------
// Level 5: r from the indices

const RS = [q(9, 10), q(4, 5), q(3, 4), q(7, 10), q(3, 5), q(1, 2), q(2, 5), q(3, 10), q(1, 4)];

function level5(rng: Rng, c: 'scarti' | 'varianze'): Built | null {
	const r = rng.int(0, 1) ? rng.pick(RS) : rng.pick(RS).neg();
	const sx = rng.int(2, 6), sy = rng.int(2, 6);
	if (sx === sy) return null;
	const cov = r.mul(q(sx * sy));
	if (!finite(cov, 1)) return null;
	const mistakes: Mistake[] = [
		{ value: cov.div(q(c === 'varianze' ? sx * sx * sy * sy : sx * sx)), why: c === 'varianze' ? 'varianze senza radice' : 'diviso per la varianza di x' },
		{ value: cov.div(q(sx + sy)), why: 'somma al posto del prodotto' },
		{ value: r.neg(), why: 'segno' },
	];
	const givens = c === 'scarti' ? `\\sigma_x = ${sx} \\qquad \\sigma_y = ${sy}` : `\\sigma_x^2 = ${sx * sx} \\qquad \\sigma_y^2 = ${sy * sy}`;
	const roots = c === 'varianze' ? [`${t('Servono gli scarti quadratici medi: ')} \\sigma_x = \\sqrt{${sx * sx}} = ${sx}, \\quad \\sigma_y = \\sqrt{${sy * sy}} = ${sy}`] : [];
	return {
		prompt: 'Calcola il coefficiente di correlazione lineare.',
		problem: textBlock(INDEX_INTRO, 46, [givens, `\\sigma_{xy} = ${dec(cov)}`]),
		steps: [...roots, `r = \\frac{\\sigma_{xy}}{\\sigma_x \\cdot \\sigma_y} = \\frac{${dec(cov)}}{${sx} \\cdot ${sy}} = \\frac{${dec(cov)}}{${sx * sy}} = ${dec(r)}`],
		solution: `r = ${dec(r)}`,
		answer: { kind: 'number', value: r.toString() },
		params: { sx: String(sx), sy: String(sy), cov: cov.toString(), case: c, ...numberChoice(r, mistakes, { min: q(-1), max: q(1) }) },
	};
}

// ---------------------------------------------------------------------------
// Level 6: r from the data, rounded to the hundredth

function level6(rng: Rng): Built | null {
	const d = pairs(rng, rng.pick([4, 5]));
	if (!d) return null;
	const r2 = q(d.P * d.P, d.A * d.B);
	const { round, trunc } = sqrt100(r2);
	if (round < 20 || round > 98) return null;
	if (q(round * round, 10000).equals(r2)) return null;
	const s = Math.sign(d.P);
	const right = q(s * round, 100);
	const cov = q(d.P, d.n), vx = q(d.A, d.n), vy = q(d.B, d.n);
	const mistakes: Mistake[] = [
		{ value: roundTo(cov.div(vx.mul(vy)), 2), why: 'varianze senza radice' },
		{ value: right.neg(), why: 'segno' },
		...(trunc !== round ? [{ value: q(s * trunc, 100), why: 'troncato' }] : []),
		{ value: roundTo(q(d.P, d.A), 2), why: 'coefficiente angolare' },
	];
	const prods = d.dx.map((a, i) => a * d.dy[i]);
	return {
		prompt: 'Calcola il coefficiente di correlazione lineare, arrotondato al centesimo.',
		problem: pairsProblem(d),
		steps: [
			...meanSteps(d),
			`${t('Somma dei prodotti: ')} ${plusList(prods)} = ${d.P}`,
			`${t('Somme dei quadrati: ')} ${d.dx.map((a) => a * a).join(' + ')} = ${d.A}, \\quad ${d.dy.map((a) => a * a).join(' + ')} = ${d.B}`,
			`\\sigma_{xy} = \\frac{${d.P}}{${d.n}} = ${dec(cov)}, \\quad \\sigma_x^2 = \\frac{${d.A}}{${d.n}} = ${dec(vx)}, \\quad \\sigma_y^2 = \\frac{${d.B}}{${d.n}} = ${dec(vy)}`,
			`r = \\frac{${dec(cov)}}{\\sqrt{${dec(vx)} \\cdot ${dec(vy)}}} = \\frac{${dec(cov)}}{\\sqrt{${dec(vx.mul(vy))}}} \\approx ${fixed(right, 2)}`,
		],
		solution: `r \\approx ${fixed(right, 2)}`,
		answer: { kind: 'number', value: right.toString() },
		params: { ...pairsParams(d), case: s > 0 ? 'positivo' : 'negativo', ...numberChoice(right, mistakes, { digits: 2, min: q(-1), max: q(1) }) },
	};
}

// ---------------------------------------------------------------------------
// Level 7: what a value of r says

type L7Case = 'positiva' | 'negativa' | 'nulla';
const L7_CTX: Record<L7Case, string[]> = {
	positiva: [
		'Per alcuni giorni si registrano la temperatura massima $x$ e i gelati $y$ venduti da un chiosco.',
		'Per un gruppo di persone si registrano la statura $x$ e il numero di scarpe $y$.',
	],
	negativa: [
		'Per alcune auto usate dello stesso modello si registrano gli anni $x$ e il prezzo $y$.',
		'Per alcuni giorni si registrano la temperatura massima $x$ e le cioccolate calde $y$ vendute da un bar.',
	],
	nulla: ['Per un gruppo di studenti si registrano il numero di scarpe $x$ e il voto $y$ di italiano.', 'Per un gruppo di studenti si registrano la statura $x$ e il voto $y$ di storia.'],
};
const two = (a: string, b: string) => `\\begin{gathered} ${a} \\\\ ${b} \\end{gathered}`;
const L7_OPT: Record<string, ChoiceOption> = {
	cresce: { latex: two(`${t('Al crescere di ')} x`, `y ${t(' in genere cresce')}`), values: ['cresce'] },
	diminuisce: { latex: two(`${t('Al crescere di ')} x`, `y ${t(' in genere diminuisce')}`), values: ['diminuisce'] },
	nessuno: { latex: two(`${t('Tra ')} x ${t(' e ')} y ${t(' non c’è')}`, t('un legame lineare')), values: ['nessun legame lineare'] },
	causa: { latex: `x ${t(' è la causa di ')} y`, values: ['causa'] },
};

function level7(rng: Rng, c: L7Case): Built | null {
	const mag = c === 'nulla' ? rng.int(0, 9) : rng.int(80, 98);
	const r = q(c === 'negativa' || (c === 'nulla' && rng.int(0, 1)) ? -mag : mag, 100);
	const key = c === 'positiva' ? 'cresce' : c === 'negativa' ? 'diminuisce' : 'nessuno';
	const answer = buildChoice(rng, L7_OPT[key], Object.values(L7_OPT));
	const first =
		c === 'nulla'
			? `r ${t(' è vicino a zero: i punti non si dispongono lungo una retta.')}`
			: `r ${t(` è ${c === 'positiva' ? 'positivo' : 'negativo'} e vicino a `)} ${c === 'positiva' ? '1' : '-1'}${t(`: la nuvola ${c === 'positiva' ? 'sale' : 'scende'} e i punti sono vicini a una retta.`)}`;
	return {
		prompt: 'Che cosa dice questo valore del coefficiente di correlazione lineare?',
		problem: textBlock(rng.pick(L7_CTX[c]), 46, [`r = ${fixed(r, 2)}`]),
		steps: [first, `r ${t(' dice come i due caratteri variano insieme, non che uno è la causa dell’altro.')}`],
		solution: L7_OPT[key].latex,
		answer,
		params: { r: r.toString(), case: c },
	};
}

// ---------------------------------------------------------------------------

/** Cases with a fixed share: drawn once per exercise, before the retries, so a case that is rejected more often keeps its share. */
const CASES: Record<number, [string, number][]> = {
	3: [
		['m positivo', 60],
		['m negativo', 40],
	],
	4: [
		['m positivo', 60],
		['m negativo', 40],
	],
	5: [
		['scarti', 50],
		['varianze', 50],
	],
	7: [
		['positiva', 35],
		['negativa', 35],
		['nulla', 30],
	],
};

function build(rng: Rng, level: number, c: string): Built | null {
	switch (level) {
		case 1:
			return level1(rng);
		case 2:
			return level2(rng);
		case 3:
			return level3(rng, c as 'm positivo' | 'm negativo');
		case 4:
			return level4(rng, c as 'm positivo' | 'm negativo');
		case 5:
			return level5(rng, c as 'scarti' | 'varianze');
		case 6:
			return level6(rng);
		case 7:
			return level7(rng, c as L7Case);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Checks

const R = (s: unknown) => Rational.parse(String(s));

function check(sample: Sample): string[] {
	const v = choiceViolations(sample);
	const p = sample.params;
	const ans = sample.answer;
	const num = ans.kind === 'number' ? R(ans.value) : null;
	const right = ans.kind === 'choice' ? ans.options[ans.correct] : null;
	let P = 0, A = 0, B = 0, n = 0;
	if (Array.isArray(p.xs)) {
		const xs = (p.xs as string[]).map(Number), ys = (p.ys as string[]).map(Number);
		n = xs.length;
		if ((n !== 4 && n !== 5) || isum(xs) % n !== 0 || isum(ys) % n !== 0) v.push('servono 4 o 5 coppie con medie intere');
		const mx = isum(xs) / n, my = isum(ys) / n;
		P = isum(xs.map((x, i) => (x - mx) * (ys[i] - my)));
		A = isum(xs.map((x) => (x - mx) ** 2));
		B = isum(ys.map((y) => (y - my) ** 2));
		if (P === 0 || A === 0 || B === 0) v.push('covarianza o varianza nulla');
	}
	switch (sample.level) {
		case 1:
			if (!num?.equals(q(P, n))) v.push('covarianza sbagliata');
			break;
		case 2:
			if (!num?.equals(q(P, A)) || !finite(q(P, A), 2)) v.push('coefficiente angolare sbagliato');
			break;
		case 3: {
			const m = R(p.cov).div(R(p.sx).mul(R(p.sx)));
			const k = R(p.my).sub(m.mul(R(p.mx)));
			if (!right || right.values.join() !== [m, k].map(String).join()) v.push('retta sbagliata');
			if ((p.case === 'm positivo') !== m.sign() > 0) v.push('caso sbagliato');
			break;
		}
		case 4: {
			const m = R(p.cov).div(R(p.vx));
			const est = R(p.my).add(m.mul(R(p.x0).sub(R(p.mx))));
			if (!num?.equals(est) || !finite(est, 2)) v.push('stima sbagliata');
			break;
		}
		case 5: {
			const r = R(p.cov).div(R(p.sx).mul(R(p.sy)));
			if (!num?.equals(r) || r.abs().compare(q(1)) >= 0) v.push('r sbagliato');
			break;
		}
		case 6: {
			const { round } = sqrt100(q(P * P, A * B));
			if (!num?.equals(q(Math.sign(P) * round, 100))) v.push('r arrotondato sbagliato');
			if (q(round * round, 10000).equals(q(P * P, A * B))) v.push('r esatto');
			break;
		}
		case 7: {
			const r = R(p.r);
			const want = r.compare(q(4, 5)) >= 0 ? 'cresce' : r.compare(q(-4, 5)) <= 0 ? 'diminuisce' : r.abs().compare(q(1, 10)) < 0 ? 'nessun legame lineare' : null;
			if (!right || right.values[0] !== want) v.push('affermazione sbagliata');
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

export const regressioneCorrelazione: Generator = {
	id: ID,
	title: 'Regressione e correlazione',
	levels: {
		1: { label: 'Covarianza', constraints: ['4 o 5 coppie di interi con medie intere', 'covarianza diversa da zero'] },
		2: { label: 'Coefficiente angolare dai dati', constraints: ['4 o 5 coppie di interi con medie intere', 'm con al massimo due decimali, diverso da 1 e da -1'] },
		3: { label: 'Retta dagli indici', constraints: ['dati media di x, media di y, scarto quadratico medio di x e covarianza', 'm e q con al massimo due decimali, q diverso da zero'] },
		4: { label: 'Stima con la retta', constraints: ['dati le medie, la varianza di x e la covarianza', 'x a non più di 4 dalla media, stima positiva'] },
		5: { label: 'Correlazione dagli indici', constraints: ['dati gli scarti quadratici medi oppure le varianze (quadrati perfetti)', 'r esatto, con uno o due decimali'] },
		6: { label: 'Correlazione dai dati', constraints: ['4 o 5 coppie di interi con medie intere', 'r non esatto, tra 0,20 e 0,98 in valore assoluto, arrotondato al centesimo'] },
		7: { label: 'Leggere r', constraints: ['r tra 0,80 e 0,98, tra -0,98 e -0,80, oppure tra -0,09 e 0,09', 'quattro affermazioni fisse, una giusta'] },
	},
	generate(rng: Rng, level: number): Sample {
		const c = CASES[level] ? weighted(rng, CASES[level]) : '';
		for (let attempt = 0; attempt < 50_000; attempt++) {
			let b: Built | null;
			try {
				b = build(rng, level, c);
			} catch (e) {
				if (/unknown level/.test(String(e))) throw e;
				b = null; // fewer than four distinct options: draw again
			}
			if (!b) continue;
			const sample: Sample = { generatorId: ID, level, seed: rng.seed, ...b };
			if (check(sample).length > 0) continue;
			if (!canChoose(sample)) continue;
			return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice: choiceFromParams,
};

export default regressioneCorrelazione;
