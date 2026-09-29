/**
 * Grandezze scalari e grandezze vettoriali. Spec: specs/exercises/fis-scalari-vettori.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/13-fis-scalari-vettori.md): which quantity is a
 * vector (or a scalar); which vector on a grid is equal, opposite, parallel or only as long as a given one; the scale
 * of a drawing, both ways; distance travelled and displacement along a straight line; the modulus of a displacement
 * made of perpendicular stretches on a grid (Pythagoras). Every answer is a multiple choice whose options carry the
 * unit, and the distractors are the mistakes the lesson warns about: the distance for the displacement, the verso
 * forgotten, the scale turned upside down. Levels 2, 4 and 5 draw their data with the scene `vettori-piano`; the
 * displacement found goes in `solutionScene`.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SceneRef } from '../types';
import { shuffle, textBlock } from '../insiemi';
import { BANNED, boxAround, choiceOf, pq, qOpt, qty, scene, t, type SceneVec } from '../vettori';

export const ID = 'fis-scalari-vettori';

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer;
	params: Record<string, unknown>;
	scene?: SceneRef;
	solutionScene?: SceneRef;
}

// ---------------------------------------------------------------------------
// Level 1: scalar or vector

const VECTORS = ["lo spostamento di un'auto", 'la velocità di un treno', 'la forza su una porta', "l'accelerazione di una moto", 'lo spostamento di una nave', 'la forza del vento'];
const SCALARS = ['la massa di uno zaino', 'la durata di una partita', "la temperatura dell'aria", 'il volume di una bottiglia', 'la densità del ferro', 'la distanza percorsa', "l'area di un campo"];

function level1(rng: Rng): Built {
	const askVector = rng.next() < 0.5;
	const [right, others] = askVector ? [rng.pick(VECTORS), shuffle(rng, SCALARS).slice(0, 3)] : [rng.pick(SCALARS), shuffle(rng, VECTORS).slice(0, 3)];
	const opt = (s: string): ChoiceOption => ({ latex: t(s), values: [s] });
	const answer = choiceOf(rng, opt(right), others.map(opt));
	const kind = askVector ? 'vettoriale' : 'scalare';
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(`Quale di queste grandezze è ${kind}?`),
		solution: t(right),
		steps: askVector
			? [t(`Per descrivere ${right} servono modulo, direzione e verso: è vettoriale.`), t('Le altre sono scalari: basta un numero con la sua unità.')]
			: [t(`Per ${right} basta un numero con la sua unità: è scalare.`), t('Le altre sono vettoriali: servono anche direzione e verso.')],
		answer,
		params: { case: kind, right, others },
	};
}

// ---------------------------------------------------------------------------
// Level 2: equal, opposite, same direction, same modulus, on a grid

type V2 = [number, number];
const CELL = 5;
const NAMES = ['b', 'c', 'd', 'e'];
const steps = (w: V2) => {
	const h = w[0] === 0 ? '' : `${Math.abs(w[0])} ${Math.abs(w[0]) === 1 ? 'quadretto' : 'quadretti'} a ${w[0] > 0 ? 'destra' : 'sinistra'}`;
	const v = w[1] === 0 ? '' : `${Math.abs(w[1])} ${!h ? (Math.abs(w[1]) === 1 ? 'quadretto ' : 'quadretti ') : ''}${w[1] > 0 ? 'in alto' : 'in basso'}`;
	return h && v ? `${h} e ${v}` : h || v;
};
const len2 = (w: V2) => w[0] * w[0] + w[1] * w[1];
const parallel = (a: V2, b: V2) => a[0] * b[1] - a[1] * b[0] === 0;

const QUESTIONS = {
	uguale: 'è uguale ad $\\vec{a}$',
	opposto: "è l'opposto di $\\vec{a}$",
	stessoVerso: 'ha la stessa direzione e lo stesso verso di $\\vec{a}$, ma un modulo diverso',
	stessoModulo: 'ha lo stesso modulo di $\\vec{a}$, ma una direzione diversa',
} as const;
type Q2 = keyof typeof QUESTIONS;

function level2(rng: Rng): Built {
	let a: V2;
	do a = [rng.int(-2, 2), rng.int(-2, 2)];
	while (a[0] === 0 && a[1] === 0);
	const turn = rng.next() < 0.5 ? 1 : -1;
	let x: V2;
	do x = [rng.int(-4, 4), rng.int(-4, 4)];
	while (len2(x) === 0 || parallel(x, a) || len2(x) === len2(a));
	const cat: Record<string, V2> = {
		E: a,
		O: [-a[0], -a[1]],
		D: [2 * a[0], 2 * a[1]],
		V: [-2 * a[0], -2 * a[1]],
		R: [-turn * a[1], turn * a[0]],
		X: x,
	};
	const question = rng.pick(Object.keys(QUESTIONS) as Q2[]);
	const right = { uguale: 'E', opposto: 'O', stessoVerso: 'D', stessoModulo: 'R' }[question];
	const pool = { uguale: ['O', 'D', 'R', 'V', 'X'], opposto: ['E', 'V', 'R', 'D', 'X'], stessoVerso: ['E', 'O', 'V', 'R'], stessoModulo: ['E', 'O', 'D', 'V'] }[question];
	const chosen = shuffle(rng, [right, ...shuffle(rng, pool).slice(0, 3)]);
	// a in the top left cell, the others in four of the five other cells of a 3 × 2 table.
	const cells = shuffle(rng, [1, 2, 3, 4, 5]).slice(0, 4).sort((p, q) => p - q);
	const place = (w: V2, cell: number): SceneVec => {
		const cx = (cell % 3) * CELL + CELL / 2, cy = (1 - Math.floor(cell / 3)) * CELL + CELL / 2;
		const da: V2 = [Math.round(cx - w[0] / 2 - 0.01), Math.round(cy - w[1] / 2 - 0.01)];
		return { da, a: [da[0] + w[0], da[1] + w[1]] };
	};
	const vecs: SceneVec[] = [{ ...place(a, 0), nome: 'a' }];
	const named: { name: string; cat: string; w: V2 }[] = [];
	chosen.forEach((c, i) => {
		const w = cat[c];
		vecs.push({ ...place(w, cells[i]), nome: NAMES[i] });
		named.push({ name: NAMES[i], cat: c, w });
	});
	const rightName = named.find((n) => n.cat === right)!.name;
	const opt = (n: string): ChoiceOption => ({ latex: `\\vec{${n}}`, values: [n] });
	const answer: ChoiceAnswer = { kind: 'choice', options: NAMES.map(opt), correct: NAMES.indexOf(rightName) };
	const why: Record<string, string> = {
		E: 'fa gli stessi passi di $\\vec{a}$: stesso modulo, stessa direzione, stesso verso',
		O: 'fa i passi di $\\vec{a}$ al contrario: stesso modulo e stessa direzione, verso opposto',
		D: 'fa il doppio dei passi di $\\vec{a}$ nello stesso verso: stessa direzione e stesso verso, modulo doppio',
		V: 'fa il doppio dei passi di $\\vec{a}$ al contrario: stessa direzione, verso opposto, modulo doppio',
		R: 'è lungo quanto $\\vec{a}$, ma è girato di un angolo retto: stesso modulo, direzione diversa',
		X: 'ha modulo e direzione diversi da quelli di $\\vec{a}$',
	};
	const alt = `Una griglia con cinque vettori: a va di ${steps(a)}; ${named.map((n) => `${n.name} va di ${steps(n.w)}`).join('; ')}.`;
	return {
		prompt: 'Scegli il vettore.',
		problem: textBlock(`Nella figura, quale vettore ${QUESTIONS[question]}?`),
		solution: `\\vec{${rightName}}`,
		steps: [t(`$\\vec{a}$ va di ${steps(a)}.`), ...named.map((n) => t(`$\\vec{${n.name}}$ ${why[n.cat]}.`))],
		answer,
		params: { case: question, a, vectors: named.map((n) => ({ name: n.name, w: n.w })), right: rightName },
		scene: scene(alt, { u: 0.4, griglia: { x0: 0, x1: 3 * CELL, y0: 0, y1: 2 * CELL }, vettori: vecs }),
	};
}

// ---------------------------------------------------------------------------
// Level 3: the scale of a drawing

const SCALES = [2, 5, 10, 20, 25, 50, 100, 200, 500];
const WHAT = [
	{ noun: 'una forza', of: 'della forza', unit: 'N' },
	{ noun: 'uno spostamento', of: 'dello spostamento', unit: 'm' },
	{ noun: 'uno spostamento', of: 'dello spostamento', unit: 'km' },
	{ noun: 'una velocità', of: 'della velocità', unit: 'km/h' },
];

/** A number of hundredths as a decimal string: 450 → "4.5", 8750 → "87.5". */
const hund = (h: number) => {
	const s = (h / 100).toFixed(2).replace(/\.?0+$/, '');
	return s === '' ? '0' : s;
};

function level3(rng: Rng): Built {
	const k = rng.pick(SCALES);
	const what = rng.pick(WHAT.filter((w) => !(w.unit === 'km' && k > 50)));
	const whole = rng.next() < 0.3;
	let L10: number;
	do L10 = rng.int(10, 95);
	while ((L10 * k) % 10 !== 0 || (L10 % 10 === 0) !== whole || L10 < 20);
	const M = (L10 * k) / 10; // an integer
	const Ls = hund(L10 * 10), Ms = String(M);
	const scale = `$1\\,\\text{cm} : ${k}\\,\\text{${what.unit}}$`;
	/** Hundredths h over d as an option, only when the division is exact. */
	const exact = (h: number, d: number, unit: string) => (h % d === 0 && h / d > 0 ? [qOpt(hund(h / d), unit)] : []);
	if (rng.next() < 0.5) {
		const answer = choiceOf(
			rng,
			qOpt(Ms, what.unit),
			[
				...exact(L10 * 10, k, what.unit), // the length divided by the scale
				qOpt(String(M * 10), what.unit), // ten times
				qOpt(hund(M * 10), what.unit), // a tenth
				...exact(k * 1000, L10, what.unit), // the scale divided by the length
			],
			[qOpt(String(M + k), what.unit), qOpt(String(M * 2), what.unit)],
		);
		const noun = what.noun === 'uno spostamento' ? 'è rappresentato' : 'è rappresentata';
		return {
			prompt: 'Trova il modulo.',
			problem: textBlock(`In un disegno in scala ${scale} ${what.noun} ${noun} da una freccia lunga ${pq(Ls, 'cm')}. Quanto vale il modulo ${what.of}?`),
			solution: qty(Ms, what.unit),
			steps: [t(`Ogni centimetro vale ${k} ${what.unit}, quindi il modulo è la lunghezza per ${k}:`), `${Ls.replace('.', '{,}')} \\cdot ${k} = ${qty(Ms, what.unit)}`],
			answer,
			params: { case: 'modulo', k, L: Ls, M: Ms, unit: what.unit },
		};
	}
	const answer = choiceOf(
		rng,
		qOpt(Ls, 'cm'),
		[
			qOpt(String(M * k), 'cm'), // multiplied by the scale
			qOpt(hund(L10 * 100), 'cm'), // ten times
			qOpt(hund(L10), 'cm'), // a tenth
			...exact(k * 100, M, 'cm'), // the scale divided by the modulus
		],
		[qOpt(hund(L10 * 10 + 100), 'cm'), qOpt(hund(L10 * 20), 'cm')],
	);
	return {
		prompt: 'Trova la lunghezza.',
		problem: textBlock(`Devi disegnare ${what.noun} di ${pq(Ms, what.unit)} in scala ${scale}. Quanto è lunga la freccia?`),
		solution: qty(Ls, 'cm'),
		steps: [t(`Ogni centimetro vale ${k} ${what.unit}, quindi la lunghezza è il modulo diviso ${k}:`), `${Ms} : ${k} = ${qty(Ls, 'cm')}`],
		answer,
		params: { case: 'lunghezza', k, L: Ls, M: Ms, unit: what.unit },
	};
}

// ---------------------------------------------------------------------------
// Level 4: distance and displacement along a line

const MOVERS = [
	{ who: 'Un ciclista', verb: 'percorre', unit: 'km', road: 'lungo una strada dritta' },
	{ who: "Un'auto", verb: 'percorre', unit: 'km', road: 'lungo una strada dritta' },
	{ who: 'Un cane', verb: 'corre per', unit: 'm', road: 'lungo una spiaggia dritta' },
	{ who: 'Una barca', verb: 'naviga per', unit: 'km', road: 'lungo un canale dritto' },
];

function level4(rng: Rng): Built {
	const m = rng.pick(MOVERS);
	const n = rng.next() < 0.65 ? 2 : 3;
	const first = rng.next() < 0.5 ? 1 : -1;
	let legs: number[];
	for (;;) {
		legs = Array.from({ length: n }, () => rng.int(2, 12));
		const signed = legs.map((l, i) => l * first * (i % 2 ? -1 : 1));
		const pos = signed.reduce<number[]>((acc, s) => [...acc, acc[acc.length - 1] + s], [0]);
		const net = pos[pos.length - 1];
		if (net !== 0 && Math.max(...pos) - Math.min(...pos) <= 14) break;
	}
	const signed = legs.map((l, i) => l * first * (i % 2 ? -1 : 1));
	const pos = signed.reduce<number[]>((acc, s) => [...acc, acc[acc.length - 1] + s], [0]);
	const net = pos[pos.length - 1];
	const dist = legs.reduce((s, l) => s + l, 0);
	const dir = (s: number) => (s > 0 ? 'est' : 'ovest');
	const told = legs.map((l, i) => `${pq(String(l), m.unit)} verso ${dir(signed[i])}`);
	const route = n === 2 ? `${told[0]}, poi ${told[1]}` : `${told[0]}, poi ${told[1]} e infine ${told[2]}`;
	const askDisplacement = rng.next() < 0.5;
	const vecs: SceneVec[] = signed.map((s, i) => ({ da: [pos[i], 2 * (n - i)], a: [pos[i + 1], 2 * (n - i)], sopra: true, etichetta: `${legs[i]} ${m.unit}` }));
	const box = boxAround([...pos.map((p) => [p, 0] as [number, number]), [0, 2 * n]], 1);
	const u = Math.max(...pos) - Math.min(...pos) > 10 ? 0.3 : 0.4;
	const alt = `Una retta orientata da ovest a est con la partenza A; sopra, uno sotto l'altro, i tratti del percorso: ${legs.map((l, i) => `${l} ${m.unit} verso ${dir(signed[i])}`).join(', ')}.`;
	const sc = scene(alt, { u, griglia: box, vettori: vecs, punti: [{ at: [0, 0], nome: 'A' }] });
	const solSc = scene(`${alt} Lo spostamento va da A a B, ${Math.abs(net)} ${m.unit} verso ${dir(net)}.`, {
		u,
		griglia: box,
		vettori: [...vecs, { da: [0, 0], a: [net, 0], sopra: true, colore: 'risultante', etichetta: `${Math.abs(net)} ${m.unit}` }],
		punti: [{ at: [0, 0], nome: 'A' }, { at: [net, 0], nome: 'B' }],
	});
	const problem = textBlock(`${m.who} ${m.verb} ${route}, ${m.road}. Quanto vale ${askDisplacement ? 'lo spostamento' : 'la distanza percorsa'}?`);
	const sumTex = legs.join(' + ');
	const netTex = signed.map((s, i) => (i === 0 ? String(Math.abs(s)) : `${s * first > 0 ? '+' : '-'} ${Math.abs(s)}`)).join(' ');
	if (askDisplacement) {
		const o = (x: number, d: string) => qOpt(String(x), m.unit, `verso ${d}`);
		const answer = choiceOf(rng, o(Math.abs(net), dir(net)), [
			o(Math.abs(net), dir(-net)), // the verso of the other stretch
			o(dist, dir(net)), // the distance
			o(dist, dir(-net)),
			o(legs[0], dir(signed[0])),
		]);
		return {
			prompt: 'Trova lo spostamento.',
			problem,
			solution: `${qty(String(Math.abs(net)), m.unit)}\\ \\text{verso ${dir(net)}}`,
			steps: [t(`Lo spostamento va dalla partenza all'arrivo. Con il verso positivo a ${dir(signed[0])}:`), `${netTex} = ${Math.abs(net)}`, t(`L'arrivo è a ${Math.abs(net)} ${m.unit} ${net * first > 0 ? `verso ${dir(signed[0])}` : `verso ${dir(-signed[0])}`} dalla partenza: modulo ${Math.abs(net)} ${m.unit}, verso ${dir(net)}.`)],
			answer,
			params: { case: 'spostamento', legs: signed, unit: m.unit },
			scene: sc,
			solutionScene: solSc,
		};
	}
	const answer = choiceOf(rng, qOpt(String(dist), m.unit), [qOpt(String(Math.abs(net)), m.unit), qOpt(String(Math.max(...legs) - Math.min(...legs)), m.unit), qOpt(String(Math.max(...legs)), m.unit), qOpt(String(dist + legs[0]), m.unit)].filter((o) => o.values[0] !== '0'));
	return {
		prompt: 'Trova la distanza percorsa.',
		problem,
		solution: qty(String(dist), m.unit),
		steps: [t('La distanza percorsa è la lunghezza di tutta la strada: si sommano i tratti, senza segni.'), `${sumTex} = ${qty(String(dist), m.unit)}`],
		answer,
		params: { case: 'distanza', legs: signed, unit: m.unit },
		scene: sc,
		solutionScene: solSc,
	};
}

// ---------------------------------------------------------------------------
// Level 5: the modulus of a displacement on a grid

const TRIPLES: [number, number, number][] = [
	[3, 4, 5],
	[4, 3, 5],
	[6, 8, 10],
	[8, 6, 10],
	[5, 12, 13],
	[12, 5, 13],
	[9, 12, 15],
	[12, 9, 15],
];
const BLOCKS = [
	{ intro: 'In una città con le strade a scacchiera ogni isolato è lungo', each: 100, unit: 'm', who: 'Luca', word: ['isolato', 'isolati'] },
	{ intro: 'In una città con le strade a scacchiera ogni isolato è lungo', each: 200, unit: 'm', who: 'Sara', word: ['isolato', 'isolati'] },
	{ intro: 'Su un campo diviso in quadrati ogni quadrato è largo', each: 10, unit: 'm', who: 'Un robot', word: ['quadrato', 'quadrati'] },
	{ intro: 'Su una mappa a quadretti ogni quadretto vale', each: 1, unit: 'km', who: 'Un escursionista', word: ['quadretto', 'quadretti'] },
];
const CARD: Record<string, string> = { '1,0': 'est', '-1,0': 'ovest', '0,1': 'nord', '0,-1': 'sud' };

function level5(rng: Rng): Built {
	const [p, q, c] = rng.pick(TRIPLES.filter((tr) => tr[0] <= 12 && tr[1] <= 12));
	const dx = p * (rng.next() < 0.5 ? 1 : -1), dy = q * (rng.next() < 0.5 ? 1 : -1);
	const b = rng.pick(BLOCKS);
	const xFirst = rng.next() < 0.5;
	let legs: V2[];
	if (rng.next() < 0.5) legs = xFirst ? [[dx, 0], [0, dy]] : [[0, dy], [dx, 0]];
	else {
		// Past the end and back: three stretches.
		const e = rng.int(1, 3);
		legs = xFirst ? [[dx + Math.sign(dx) * e, 0], [0, dy], [-Math.sign(dx) * e, 0]] : [[0, dy + Math.sign(dy) * e], [dx, 0], [0, -Math.sign(dy) * e]];
	}
	const lens = legs.map((l) => Math.abs(l[0]) + Math.abs(l[1]));
	const pts: V2[] = legs.reduce<V2[]>((acc, l) => [...acc, [acc[acc.length - 1][0] + l[0], acc[acc.length - 1][1] + l[1]]], [[0, 0]]);
	const card = (l: V2) => CARD[`${Math.sign(l[0])},${Math.sign(l[1])}`];
	const told = legs.map((l, i) => `${lens[i]} ${lens[i] === 1 ? b.word[0] : b.word[1]} verso ${card(l)}`);
	const route = told.length === 2 ? `${told[0]} e poi ${told[1]}` : `${told[0]}, poi ${told[1]} e infine ${told[2]}`;
	const dist = lens.reduce((s, l) => s + l, 0);
	const S = c * b.each;
	const each = (x: number) => String(x * b.each);
	const answer = choiceOf(rng, qOpt(each(c), b.unit), [
		qOpt(each(dist), b.unit), // the distance travelled
		qOpt(each(p + q), b.unit), // the two sides added
		qOpt(each(Math.abs(p - q)), b.unit),
		qOpt(each(Math.max(p, q)), b.unit),
		qOpt(each(c + 1), b.unit),
	].filter((o) => o.values[0] !== '0'));
	const vecs: SceneVec[] = legs.map((l, i) => ({ da: pts[i], a: pts[i + 1], etichetta: `${lens[i]}` }));
	const box = boxAround(pts, 1);
	const u = box.x1 - box.x0 > 12 || box.y1 - box.y0 > 12 ? 0.3 : 0.4;
	const alt = `Una griglia: da A il percorso va di ${told.join(', poi ')}, fino a B.`;
	const punti = [{ at: [0, 0] as V2, nome: 'A' }, { at: pts[pts.length - 1], nome: 'B' }];
	return {
		prompt: 'Trova il modulo dello spostamento.',
		problem: textBlock(`${b.intro} ${pq(String(b.each), b.unit)}. ${b.who} parte da $A$ e va per ${route}, fino a $B$. Quanto vale il modulo dello spostamento da $A$ a $B$?`),
		solution: `s = ${qty(String(S), b.unit)}`,
		steps: [
			t(`Da A a B ci sono ${p} ${b.word[1]} in orizzontale e ${q} in verticale:`),
			t(`lo spostamento è l'ipotenusa di un triangolo rettangolo con questi cateti.`),
			`\\sqrt{${p}^2 + ${q}^2} = \\sqrt{${p * p + q * q}} = ${c}`,
			`s = ${c} \\cdot ${b.each}\\,\\text{${b.unit}} = ${qty(String(S), b.unit)}`,
			t(`La strada fatta è più lunga: ${dist} ${b.word[1]}, cioè ${dist * b.each} ${b.unit}.`),
		],
		answer,
		params: { case: legs.length === 2 ? 'due tratti' : 'tre tratti', legs, each: b.each, unit: b.unit },
		scene: scene(alt, { u, griglia: box, vettori: vecs, punti }),
		solutionScene: scene(`${alt} Lo spostamento va in linea retta da A a B.`, { u, griglia: box, vettori: [...vecs, { da: [0, 0], a: pts[pts.length - 1], nome: 's', colore: 'risultante' }], punti }),
	};
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 1000; attempt++) {
		let b: Built;
		try {
			b = make(rng);
		} catch {
			continue;
		}
		const sample: Sample = { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: b.params };
		if (b.scene) sample.scene = b.scene;
		if (b.solutionScene) sample.solutionScene = b.solutionScene;
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test([sample.problem, sample.solution, ...sample.steps].join(' '))) v.push('parole vietate');
	const a = sample.answer;
	if (a.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
	if (a.options.length !== 4 || new Set(a.options.map((o) => o.latex)).size !== 4) v.push('servono quattro opzioni diverse');
	if (!(a.correct >= 0 && a.correct < a.options.length)) v.push('opzione giusta fuori posto');
	if (sample.level !== 1 && sample.level !== 3 && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisScalariVettori: Generator = {
	id: ID,
	title: 'Grandezze scalari e grandezze vettoriali',
	levels: {
		1: { label: 'Scalare o vettoriale', constraints: ['una grandezza vettoriale fra tre scalari, o il contrario'] },
		2: { label: 'Vettori uguali e opposti', constraints: ['cinque vettori sulla griglia: uguale, opposto, stessa direzione e verso, stesso modulo'] },
		3: { label: 'La scala di un disegno', constraints: ['dalla lunghezza della freccia al modulo, o dal modulo alla lunghezza', 'risultati esatti'] },
		4: { label: 'Distanza e spostamento su una retta', constraints: ['due o tre tratti in versi alternati', 'spostamento con modulo e verso, mai nullo'] },
		5: { label: 'Lo spostamento sulla griglia', constraints: ['due o tre tratti perpendicolari', 'modulo dello spostamento da una terna pitagorica'] },
	},
	generate,
	check,
};

export default fisScalariVettori;
