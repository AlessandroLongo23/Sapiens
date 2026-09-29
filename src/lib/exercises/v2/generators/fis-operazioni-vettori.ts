/**
 * Somma e differenza di vettori. Spec: specs/exercises/fis-operazioni-vettori.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/14-fis-operazioni-vettori.md): two forces on the same
 * line (modulus and verso of the resultant); a vector times a number (modulus and verso); two perpendicular forces
 * (Pythagoras); the sum of two vectors drawn on a grid; their difference; the sum of three forces drawn on a grid.
 * Every answer is a multiple choice whose options carry the unit, with the mistakes the lesson warns about: the
 * moduli added, the verso of the smaller force, the minus sign put in the modulus, the sum for the difference. The
 * numbers are built backwards from Pythagorean triples, so every modulus is exact. The scene draws the given
 * vectors; the resultant goes in `solutionScene`.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { BANNED, boxAround, choiceOf, pq, qOpt, qty, scene, t, type SceneVec } from '../vettori';

export const ID = 'fis-operazioni-vettori';

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer;
	params: Record<string, unknown>;
	scene: SceneRef;
	solutionScene: SceneRef;
}

type V2 = [number, number];
const add = (a: V2, b: V2): V2 => [a[0] + b[0], a[1] + b[1]];
const sub = (a: V2, b: V2): V2 => [a[0] - b[0], a[1] - b[1]];
const n2 = (a: V2) => a[0] * a[0] + a[1] * a[1];
const isqrt = (x: number) => {
	const r = Math.round(Math.sqrt(x));
	return r * r === x ? r : null;
};
const fmt = (x: number) => String(Math.round(x * 100) / 100);

// ---------------------------------------------------------------------------
// Level 1: two forces on the same line

function level1(rng: Rng): Built {
	let F1: number, F2: number;
	do {
		F1 = rng.int(5, 60);
		F2 = rng.int(3, 60);
	} while (F1 === F2 || (F1 % 10 === 0 && F2 % 10 === 0) || 4 * Math.min(F1, F2) < Math.max(F1, F2) || (Math.abs(F1 - F2) * 5 < Math.max(F1, F2)));
	const same = rng.next() < 0.3;
	const d1 = rng.next() < 0.5 ? 1 : -1;
	const d2 = same ? d1 : -d1;
	const word = (d: number) => (d > 0 ? 'destra' : 'sinistra');
	const R = F1 * d1 + F2 * d2;
	const o = (x: number, d: number) => qOpt(String(x), 'N', `verso ${word(d)}`);
	const answer = same
		? choiceOf(rng, o(F1 + F2, d1), [o(F1 + F2, -d1), o(Math.abs(F1 - F2), d1), o(Math.abs(F1 - F2), -d1)])
		: choiceOf(rng, o(Math.abs(R), R), [o(Math.abs(R), -R), o(F1 + F2, R), o(F1 + F2, -R), o(Math.min(F1, F2), R)]);
	const scale = 3.2 / Math.max(F1, F2, Math.abs(R));
	const vec = (F: number, d: number, y: number): SceneVec => ({ da: [0, y], a: [F * d, y], colore: 'forza', etichetta: `${F} N`, sopra: true });
	// Rows 1.4 cm apart: coordinates are in newton, so a row is 1.4 / scale newton.
	const row = 1.2 / scale;
	const given = [vec(F1, d1, row), vec(F2, d2, 0)];
	const alt = `Due forze sulla stessa retta orizzontale, disegnate una sotto l'altra: F1 di ${F1} N verso ${word(d1)}, F2 di ${F2} N verso ${word(d2)}.`;
	return {
		prompt: 'Trova la risultante.',
		problem: textBlock(`Su una cassa agiscono due forze lungo la stessa retta orizzontale: $\\vec{F}_1$ di ${pq(String(F1), 'N')} verso ${word(d1)} e $\\vec{F}_2$ di ${pq(String(F2), 'N')} verso ${word(d2)}. Quanto vale la forza risultante?`),
		solution: `${qty(String(Math.abs(R)), 'N')}\\ \\text{verso ${word(R)}}`,
		steps: same
			? [t('Le due forze hanno lo stesso verso: i moduli si sommano.'), `${F1} + ${F2} = ${qty(String(F1 + F2), 'N')}`, t(`La risultante ha il verso comune, verso ${word(d1)}.`)]
			: [t(`Con il verso positivo a ${word(d1)} le forze sono $+${F1}$ e $-${F2}$:`), `${F1} - ${F2} = ${R * d1 > 0 ? '' : '-'}${Math.abs(R)}`, t(`La risultante ha modulo ${Math.abs(R)} N e il verso della forza maggiore, verso ${word(R)}.`)],
		answer,
		params: { case: same ? 'stesso verso' : 'versi opposti', F1: F1 * d1, F2: F2 * d2 },
		scene: scene(alt, { u: scale, vettori: given }),
		solutionScene: scene(`${alt} Sotto, la risultante di ${Math.abs(R)} N verso ${word(R)}.`, { u: scale, vettori: [...given, { da: [0, -row], a: [R, -row], colore: 'risultante', etichetta: `${Math.abs(R)} N`, sopra: true }] }),
	};
}

// ---------------------------------------------------------------------------
// Level 2: a vector times a number

const AXES = [
	{ pos: 'est', neg: 'ovest', dir: [1, 0] as V2 },
	{ pos: 'nord', neg: 'sud', dir: [0, 1] as V2 },
	{ pos: "l'alto", neg: 'il basso', dir: [0, 1] as V2 },
	{ pos: 'destra', neg: 'sinistra', dir: [1, 0] as V2 },
];
const K = [-3, -2, -1, -0.5, 0.5, 2, 3, 4, -1.5, 1.5, 2.5, -2.5];

function level2(rng: Rng): Built {
	const ax = rng.pick(AXES);
	const up = rng.next() < 0.5;
	const k = rng.pick(K);
	const half = !Number.isInteger(k);
	let a: number;
	do a = rng.int(2, 20);
	while (half && a % 2 !== 0);
	const unit = rng.pick(['m', 'km', 'N']);
	const what = unit === 'N' ? 'una forza' : 'uno spostamento';
	const word = (s: boolean) => (s ? ax.pos : ax.neg);
	const verso = (s: boolean) => `verso ${word(s)}`;
	const M = Math.abs(k) * a;
	const resUp = k > 0 ? up : !up;
	const kTex = k === -1 ? '-' : String(k).replace('.', '{,}');
	const o = (x: number, s: boolean) => qOpt(fmt(x), unit, verso(s));
	const mistakes: ChoiceOption[] = [o(M, !resUp)];
	if (k < 0) mistakes.push(qOpt(fmt(-M), unit, verso(up))); // the minus sign in the modulus
	if (Number.isInteger(a / Math.abs(k)) || Number.isInteger((10 * a) / Math.abs(k))) mistakes.push(o(a / Math.abs(k), resUp)); // divided
	mistakes.push(o(a + Math.abs(k), resUp), o(M, resUp === up ? !up : up));
	const answer = choiceOf(rng, o(M, resUp), mistakes, [o(M + a, resUp), o(M * 2, !resUp)]);
	const color = unit === 'N' ? 'forza' : 'vettore';
	const d = ax.dir;
	const sg = up ? 1 : -1;
	const scale = 2.6 / Math.max(a, M);
	const aVec: SceneVec = { da: [0, 0], a: [d[0] * sg * a, d[1] * sg * a], nome: 'a', colore: color, etichetta: `${a} ${unit}` };
	const off: V2 = d[0] ? [0, -1.1 / scale] : [1.6 / scale, 0];
	const alt = `Il vettore a, ${a} ${unit} ${verso(up)}.`;
	return {
		prompt: 'Trova il vettore.',
		problem: textBlock(`Il vettore $\\vec{a}$ è ${what} di ${pq(String(a), unit)} ${verso(up)}. Quanto vale il vettore $${kTex}\\vec{a}$?`),
		solution: `${qty(fmt(M), unit)}\\ \\text{${verso(resUp)}}`,
		steps: [
			t('Il modulo è il modulo di a per il valore assoluto del numero:'),
			`|${String(k).replace('.', '{,}')}| \\cdot ${a} = ${qty(fmt(M), unit)}`,
			t(k > 0 ? `Il numero è positivo: il verso è quello di a, ${verso(up)}.` : `Il numero è negativo: il verso è opposto a quello di a, ${verso(resUp)}.`),
		],
		answer,
		params: { case: k < 0 ? 'negativo' : 'positivo', a, k, unit, up, axis: ax.pos },
		scene: scene(alt, { u: scale, vettori: [aVec] }),
		solutionScene: scene(`${alt} Accanto, il vettore ${fmt(k)} a, ${fmt(M)} ${unit} ${verso(resUp)}.`, {
			u: scale,
			vettori: [aVec, { da: off, a: [off[0] + d[0] * sg * k * a, off[1] + d[1] * sg * k * a], colore: 'risultante', etichetta: `${fmt(M)} ${unit}` }],
		}),
	};
}

// ---------------------------------------------------------------------------
// Level 3: two perpendicular forces

const TRIPLES: [number, number, number][] = [
	[3, 4, 5],
	[4, 3, 5],
	[5, 12, 13],
	[12, 5, 13],
	[8, 15, 17],
	[15, 8, 17],
	[20, 21, 29],
	[21, 20, 29],
];

function level3(rng: Rng): Built {
	const [p, q, c] = rng.pick(TRIPLES);
	const s = rng.pick(p * 10 > 99 || q * 10 > 99 ? [1, 2, 3] : [1, 2, 3, 5, 10]);
	const F1 = p * s, F2 = q * s, R = c * s;
	const hx = rng.next() < 0.5 ? 1 : -1, vy = rng.next() < 0.5 ? 1 : -1;
	const xFirst = rng.next() < 0.5;
	const [h, v] = xFirst ? [F1, F2] : [F2, F1];
	const answer = choiceOf(rng, qOpt(String(R), 'N'), [qOpt(String(F1 + F2), 'N'), qOpt(String(Math.abs(F1 - F2)), 'N'), ...(F1 * F1 + F2 * F2 < 10000 ? [qOpt(String(F1 * F1 + F2 * F2), 'N')] : [])], [qOpt(String(R + s), 'N'), qOpt(String(R - s), 'N')]);
	const scale = 2.8 / Math.max(h, v);
	const e = (x: number) => ({ 1: 'est', [-1]: 'ovest' })[x];
	const nn = (y: number) => ({ 1: 'nord', [-1]: 'sud' })[y];
	const f1: SceneVec = xFirst ? { da: [0, 0], a: [hx * F1, 0], colore: 'forza', etichetta: `${F1} N` } : { da: [0, 0], a: [0, vy * F1], colore: 'forza', etichetta: `${F1} N` };
	const f2: SceneVec = xFirst ? { da: [0, 0], a: [0, vy * F2], colore: 'forza', etichetta: `${F2} N` } : { da: [0, 0], a: [hx * F2, 0], colore: 'forza', etichetta: `${F2} N` };
	const d1 = xFirst ? e(hx) : nn(vy), d2 = xFirst ? nn(vy) : e(hx);
	const alt = `Due forze applicate allo stesso punto: F1 di ${F1} N verso ${d1}, F2 di ${F2} N verso ${d2}.`;
	return {
		prompt: 'Trova il modulo della risultante.',
		problem: textBlock(`Due corde tirano lo stesso anello: $\\vec{F}_1$ di ${pq(String(F1), 'N')} verso ${d1} e $\\vec{F}_2$ di ${pq(String(F2), 'N')} verso ${d2}. Quanto vale il modulo della forza risultante?`),
		solution: `R = ${qty(String(R), 'N')}`,
		steps: [t('Le due forze sono perpendicolari: la risultante è la diagonale del rettangolo che formano.'), `R = \\sqrt{${F1}^2 + ${F2}^2} = \\sqrt{${F1 * F1 + F2 * F2}} = ${qty(String(R), 'N')}`],
		answer,
		params: { case: 'perpendicolari', F1, F2, d1, d2 },
		scene: scene(alt, { u: scale, vettori: [f1, f2] }),
		solutionScene: scene(`${alt} La risultante R, di ${R} N, è la diagonale del rettangolo.`, { u: scale, vettori: [f1, f2, { da: [0, 0], a: add(f1.a, f2.a), colore: 'risultante', etichetta: `${R} N` }] }),
	};
}

// ---------------------------------------------------------------------------
// Levels 4-6: vectors on a grid

const GRID_TRIPLES: [number, number, number][] = [
	[3, 4, 5],
	[4, 3, 5],
	[6, 8, 10],
	[8, 6, 10],
	[5, 12, 13],
	[12, 5, 13],
	[0, 5, 5],
	[5, 0, 5],
];
const EACH = [
	{ e: 1, unit: 'N' },
	{ e: 2, unit: 'N' },
	{ e: 5, unit: 'N' },
	{ e: 10, unit: 'N' },
	{ e: 1, unit: 'm' },
	{ e: 2, unit: 'm' },
	{ e: 10, unit: 'm' },
];
const signedTriple = (rng: Rng, max: number): V2 => {
	for (;;) {
		const [p, q] = rng.pick(GRID_TRIPLES.filter((tr) => tr[0] <= max && tr[1] <= max));
		const w: V2 = [p * (rng.next() < 0.5 ? 1 : -1), q * (rng.next() < 0.5 ? 1 : -1)];
		return w;
	}
};
const parallel = (a: V2, b: V2) => a[0] * b[1] - a[1] * b[0] === 0;
const angleBetween = (a: V2, b: V2) => (Math.acos(Math.max(-1, Math.min(1, (a[0] * b[0] + a[1] * b[1]) / Math.sqrt(n2(a) * n2(b))))) * 180) / Math.PI;
/** Integer options only: a value that is not a whole number of units is left out. */
const intOpts = (xs: (number | null)[], unit: string) => xs.filter((x): x is number => x !== null && x > 0 && Number.isInteger(x)).map((x) => qOpt(String(x), unit));

function gridVectors(rng: Rng, count: number, target: V2): V2[] | null {
	const vs: V2[] = [];
	let left = target;
	for (let i = 0; i < count - 1; i++) {
		let w: V2;
		let tries = 0;
		do w = [rng.int(-5, 5), rng.int(-5, 5)];
		while ((w[0] === 0 || w[1] === 0 || vs.some((u) => parallel(u, w)) || Math.abs(left[0] - w[0]) > 5 || Math.abs(left[1] - w[1]) > 5) && ++tries < 200);
		if (tries >= 200) return null;
		vs.push(w);
		left = sub(left, w);
	}
	if (left[0] === 0 || left[1] === 0 || vs.some((u) => parallel(u, left))) return null;
	vs.push(left);
	// Arrows well apart, from each other and from the result, so every name has room.
	const all: V2[] = [...vs, target, ...vs.map((w): V2 => [-w[0], -w[1]])];
	for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) if (!(i < vs.length && j === i + vs.length + 1) && angleBetween(all[i], all[j]) < 18) return null;
	return vs;
}

function gridLevel(rng: Rng, kind: 'somma' | 'differenza' | 'tre'): Built {
	const { e, unit } = rng.pick(kind === 'tre' ? EACH.filter((x) => x.unit === 'N') : EACH);
	const force = unit === 'N';
	const target = signedTriple(rng, 8);
	const c = isqrt(n2(target))!;
	let vs: V2[] | null = null;
	let names: string[];
	if (kind === 'tre') {
		names = ['1', '2', '3'];
		while (!vs) vs = gridVectors(rng, 3, target);
	} else {
		names = ['a', 'b'];
		// For a difference, a - b = target: build a + (-b) = target and turn the second round.
		while (!vs) vs = gridVectors(rng, 2, target);
		if (kind === 'differenza') vs = [vs[0], [-vs[1][0], -vs[1][1]]];
	}
	const V = vs;
	const letter = (i: number) => (kind === 'tre' ? `F_{${names[i]}` : names[i]);
	const color = force ? 'forza' : 'vettore';
	const given: SceneVec[] = V.map((w, i) => (kind === 'tre' ? { da: [0, 0], a: w, nome: 'F', sub: names[i], colore: color } : { da: [0, 0], a: w, nome: names[i], colore: color }));
	const R = kind === 'differenza' ? sub(V[0], V[1]) : V.reduce(add, [0, 0]);
	const box = boxAround([[0, 0], ...V], 1);
	const u = Math.max(box.x1 - box.x0, box.y1 - box.y0) > 11 ? 0.3 : 0.38;
	const other = kind === 'differenza' ? add(V[0], V[1]) : kind === 'somma' ? sub(V[0], V[1]) : add(V[0], V[1]);
	const moduli = V.map((w) => Math.sqrt(n2(w)));
	const sumModuli = moduli.reduce((s, x) => s + x, 0);
	const answer = choiceOf(
		rng,
		qOpt(String(c * e), unit),
		intOpts([(Math.abs(R[0]) + Math.abs(R[1])) * e, isqrt(n2(other)) !== null ? isqrt(n2(other))! * e : null, Math.abs(sumModuli - Math.round(sumModuli)) < 1e-9 ? Math.round(sumModuli) * e : null, Math.max(Math.abs(R[0]), Math.abs(R[1])) * e], unit),
		intOpts([(c + 1) * e, (c + 2) * e, (c - 1) * e], unit),
	);
	const what = kind === 'tre' ? 'Tre forze sono applicate allo stesso punto.' : force ? 'Due forze sono applicate allo stesso punto.' : 'Due spostamenti partono dallo stesso punto.';
	const expr = kind === 'tre' ? '\\vec{F}_1 + \\vec{F}_2 + \\vec{F}_3' : kind === 'somma' ? '\\vec{a} + \\vec{b}' : '\\vec{a} - \\vec{b}';
	const steps = [
		t('Le componenti in quadretti, contate sulla griglia:'),
		...V.map((w, i) => (kind === 'tre' ? `F_{${names[i]}x} = ${w[0]} \\qquad F_{${names[i]}y} = ${w[1]}` : `${letter(i)}_x = ${w[0]} \\qquad ${letter(i)}_y = ${w[1]}`)),
		t(kind === 'differenza' ? 'Le componenti della differenza sono le differenze:' : 'Le componenti della somma sono le somme:'),
		`${kind === 'differenza' ? 'd' : kind === 'tre' ? 'R' : 's'}_x = ${R[0]} \\qquad ${kind === 'differenza' ? 'd' : kind === 'tre' ? 'R' : 's'}_y = ${R[1]}`,
		t(`Il modulo, con il teorema di Pitagora, in quadretti e poi in ${unit}:`),
		`\\sqrt{${R[0] < 0 ? `(${R[0]})` : R[0]}^2 + ${R[1] < 0 ? `(${R[1]})` : R[1]}^2} = \\sqrt{${n2(R)}} = ${c}`,
		`${c} \\cdot ${e}\\,\\text{${unit}} = ${qty(String(c * e), unit)}`,
	];
	const altV = V.map((w, i) => `${kind === 'tre' ? `F${names[i]}` : names[i]} va di ${w[0]} quadretti in orizzontale e ${w[1]} in verticale`).join('; ');
	const alt = `Una griglia con ${V.length} vettori che partono dallo stesso punto: ${altV}.`;
	const solVecs: SceneVec[] =
		kind === 'differenza'
			? [...given, { da: V[0], a: R.map((x, i) => x + V[0][i]) as V2, nome: 'b', meno: true, colore: color, tratteggiato: true }, { da: [0, 0], a: R, nome: 'd', colore: 'risultante' }]
			: kind === 'somma'
				? [...given, { da: V[0], a: R, colore: color, tratteggiato: true }, { da: [0, 0], a: R, nome: 's', colore: 'risultante' }]
				: [...given, { da: [0, 0], a: R, nome: 'R', colore: 'risultante' }];
	const solBox = boxAround([[0, 0], ...solVecs.flatMap((w) => [w.da, w.a])], 1);
	return {
		prompt: 'Trova il modulo.',
		problem: textBlock(`${what} Nella figura ogni quadretto vale ${pq(String(e), unit)}. Quanto vale il modulo di $${expr}$?`),
		solution: `|${expr}| = ${qty(String(c * e), unit)}`,
		steps,
		answer,
		params: { case: kind === 'tre' ? 'tre forze' : kind, vectors: V, e, unit },
		scene: scene(alt, { u, griglia: box, vettori: given }),
		solutionScene: scene(`${alt} In arancione il risultato, ${c * e} ${unit}.`, { u, griglia: solBox, vettori: solVecs }),
	};
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = {
	1: level1,
	2: level2,
	3: level3,
	4: (rng) => gridLevel(rng, 'somma'),
	5: (rng) => gridLevel(rng, 'differenza'),
	6: (rng) => gridLevel(rng, 'tre'),
};

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
		const sample: Sample = { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: b.params, scene: b.scene, solutionScene: b.solutionScene };
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
	if (!sample.scene || !sample.solutionScene) v.push('manca la scena');
	return v;
}

export const fisOperazioniVettori: Generator = {
	id: ID,
	title: 'Somma e differenza di vettori',
	levels: {
		1: { label: 'Vettori sulla stessa retta', constraints: ['due forze orizzontali, stesso verso o versi opposti', 'risultante con modulo e verso'] },
		2: { label: 'Il prodotto per un numero', constraints: ['k da -3 a 4, anche con un mezzo', 'modulo e verso di k per a'] },
		3: { label: 'Vettori perpendicolari', constraints: ['due forze perpendicolari da una terna pitagorica', 'modulo della risultante'] },
		4: { label: 'La somma sulla griglia', constraints: ['due vettori dallo stesso punto, componenti intere', 'modulo della somma da una terna pitagorica'] },
		5: { label: 'La differenza sulla griglia', constraints: ['due vettori dallo stesso punto', 'modulo della differenza da una terna pitagorica'] },
		6: { label: 'Tre forze sulla griglia', constraints: ['tre forze dallo stesso punto', 'modulo della risultante da una terna pitagorica'] },
	},
	generate,
	check,
};

export default fisOperazioniVettori;

