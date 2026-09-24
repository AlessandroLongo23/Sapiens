/**
 * Sottoinsiemi e uguaglianza. Spec: specs/exercises/sottoinsiemi-ugualianza.md
 *
 * Five levels in the order of the lesson: checking an inclusion (true or false), ∈ against ⊆
 * (the most frequent mistake), strict inclusion ⊂ against ⊆, proper subsets and counting
 * subsets, equality of sets described in different ways. Sets named in the problem are kept in
 * params in the order they are shown, since at level 3 the order is part of the trap.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, NumberAnswer, Rng, Sample } from '../types';
import {
	type El,
	type Prop,
	type Stmt,
	assembleChoice,
	diff,
	elTex,
	evalStmt,
	has,
	norm,
	numberChoice,
	pickDistinct,
	propElements,
	propFromJSON,
	propJSON,
	propTex,
	range,
	range2,
	sameSet,
	setOption,
	setTex,
	shuffle,
	stmtOption,
	stmtTex,
	subsetEq,
	textBlock,
	tokEl,
	tokSet,
	trueFalse,
} from '../insiemi';

export const ID = 'sottoinsiemi-ugualianza';
const PROMPT = 'Scegli la risposta corretta.';
const LETTERS = 'abcdefghilmnoprstuvz'.split('');

const parse = (x: string): El => (/^-?\d+$/.test(x) ? Number(x) : x);
const strs = (xs: readonly El[]) => xs.map(String);
/** A set as the problem shows it, in the given order. */
const shown = (xs: readonly El[]) => setTex(xs, true);

function pickUniverse(rng: Rng): El[] {
	return rng.next() < 0.7 ? range(1, 12) : LETTERS;
}

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer | NumberAnswer;
	params: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Reasons, for the steps

function witness(l: El[], r: El[]): El | undefined {
	return l.find((x) => !has(r, x));
}

function reason(s: Stmt, sets: Record<string, El[]>): string {
	const t = evalStmt(s, sets);
	const head = `${stmtTex(s)}\\text{ è ${t ? 'vera' : 'falsa'}: }`;
	const num = {
		N: '\\mathbb{N}',
		Z: '\\mathbb{Z}',
		Q: '\\mathbb{Q}',
	} as Record<string, string>;
	if (s.l in num && s.r in num) {
		if (s.l === s.r) return head + (s.op === 'sub' ? '\\text{nessun insieme è incluso strettamente in sé stesso}' : '\\text{ogni insieme è incluso in sé stesso}');
		const small = s.l === 'N' || (s.l === 'Z' && s.r === 'Q') ? s.l : s.r;
		const big = small === s.l ? s.r : s.l;
		const w = small === 'N' ? '-1' : '\\frac{1}{2}';
		const extra = `${w} \\in ${num[big]} \\text{ ma } ${w} \\notin ${num[small]}`;
		if (!t) return head + extra;
		const every = `\\text{ogni numero di } ${num[small]} \\text{ sta in } ${num[big]}`;
		return head + (s.op === 'sub' ? `${every}\\text{, e } ${extra}` : every);
	}
	const val = (tok: string): El[] | null => (tok.startsWith('s:') ? (tok.length > 2 ? tok.slice(2).split(',').map(parse) : []) : (sets[tok] ?? null));
	if (s.op === 'in' || s.op === 'notin') {
		if (s.l.startsWith('s:')) return head + `\\text{gli elementi di } ${s.r} \\text{ sono numeri o lettere, non insiemi}`;
		const e = parse(s.l.slice(2));
		return head + `${elTex(e)} \\text{ ${has(sets[s.r], e) ? 'è' : 'non è'} un elemento di } ${s.r}`;
	}
	const L = val(s.l)!,
		R = val(s.r)!;
	if (s.l === s.r) return head + (s.op === 'sub' ? '\\text{un insieme non è mai incluso strettamente in sé stesso}' : '\\text{ogni insieme è incluso in sé stesso}');
	const lt = s.l.startsWith('s:') ? stmtTex({ op: 'eq', l: s.l, r: s.l }).split(' = ')[0] : s.l;
	const rt = s.r.startsWith('s:') ? stmtTex({ op: 'eq', l: s.r, r: s.r }).split(' = ')[0] : s.r;
	if (L.length === 0 && (s.op === 'subeq' || s.op === 'sub')) return head + `\\text{l'insieme vuoto è incluso in ogni insieme}`;
	const wl = witness(L, R),
		wr = witness(R, L);
	switch (s.op) {
		case 'subeq':
		case 'nsubeq':
			return head + (wl === undefined ? `\\text{ogni elemento di } ${lt} \\text{ sta in } ${rt}` : `${wl} \\in ${lt} \\text{ ma } ${wl} \\notin ${rt}`);
		case 'sub':
			if (wl !== undefined) return head + `${wl} \\in ${lt} \\text{ ma } ${wl} \\notin ${rt}`;
			return head + (wr === undefined ? `\\text{i due insiemi sono uguali}` : `${lt} \\subseteq ${rt} \\text{ e } ${wr} \\in ${rt} \\text{ ma } ${wr} \\notin ${lt}`);
		case 'eq':
		case 'neq':
			if (wl !== undefined) return head + `${wl} \\in ${lt} \\text{ ma } ${wl} \\notin ${rt}`;
			if (wr !== undefined) return head + `${wr} \\in ${rt} \\text{ ma } ${wr} \\notin ${lt}`;
			return head + '\\text{hanno gli stessi elementi, in un altro ordine}';
	}
}

/** One true (or false) statement and three of the other kind, all different. */
function pickStatements(rng: Rng, pool: Stmt[], sets: Record<string, El[]>, want: boolean, trivial: (s: Stmt) => boolean = () => false): ChoiceAnswer | null {
	// a trivial statement (A ⊆ A) is the answer only when nothing else is
	const right = shuffle(
		rng,
		pool.filter((s) => evalStmt(s, sets) === want),
	).sort((x, y) => Number(trivial(x)) - Number(trivial(y)));
	const wrong = shuffle(
		rng,
		pool.filter((s) => evalStmt(s, sets) !== want),
	);
	if (!right.length) return null;
	return assembleChoice(rng, stmtOption(right[0]), wrong.map(stmtOption));
}

const stmtsOf = (ch: ChoiceAnswer): Stmt[] => ch.options.map((o) => ({ op: o.values[0], l: o.values[1], r: o.values[2] }) as Stmt);

// ---------------------------------------------------------------------------
// Construction

function build(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1: {
			const U = pickUniverse(rng);
			const u = rng.next();
			const kind = u < 0.35 ? 'incluso' : u < 0.5 ? 'uguali' : u < 0.85 ? 'un elemento fuori' : 'al contrario';
			const B = norm(pickDistinct(rng, U, rng.int(4, 6)));
			let A: El[];
			let Bshown: El[] = B;
			if (kind === 'incluso') A = norm(pickDistinct(rng, B, rng.int(2, B.length - 1)));
			else if (kind === 'uguali') {
				A = B;
				do Bshown = shuffle(rng, B);
				while (Bshown.every((x, i) => x === B[i]));
			} else if (kind === 'un elemento fuori') {
				const out = rng.pick(diff(U, B));
				A = norm([...pickDistinct(rng, B, rng.int(1, 3)), out]);
			} else {
				A = norm([...B, ...pickDistinct(rng, diff(U, B), rng.int(1, 2))]);
			}
			const truth = subsetEq(A, B);
			const steps: string[] = [];
			const miss = witness(A, B);
			if (miss === undefined) {
				steps.push(`\\text{Si controllano tutti gli elementi di } A\\text{: } ${A.map((x) => `${x} \\in B`).join(',\\ ')}`);
				steps.push(`\\text{Ogni elemento di } A \\text{ sta in } B\\text{, quindi } A \\subseteq B`);
			} else {
				steps.push(`${miss} \\in A \\text{ ma } ${miss} \\notin B`);
				steps.push(`\\text{Basta un elemento di } A \\text{ fuori da } B\\text{: } A \\not\\subseteq B`);
			}
			return {
				prompt: 'Vero o falso?',
				problem: `\\begin{array}{l} A = ${shown(A)} \\qquad B = ${shown(Bshown)} \\\\ A \\subseteq B \\end{array}`,
				solution: truth ? '\\text{Vero: } A \\subseteq B' : '\\text{Falso: } A \\not\\subseteq B',
				steps,
				answer: trueFalse(truth),
				params: { A: strs(A), B: strs(Bshown), case: kind },
			};
		}
		case 2: {
			const ask = rng.int(0, 1) ? 'vera' : 'falsa';
			const B = norm(pickDistinct(rng, range(1, 12), rng.int(3, 5)));
			const out = diff(range(1, 12), B);
			const [e1, e2] = pickDistinct(rng, B, 2);
			const f = rng.pick(out);
			const sets = { B };
			const pool: Stmt[] = [
				// traps first: they are what the level is about
				{ op: 'subeq', l: tokSet([e1]), r: 'B' },
				{ op: 'in', l: tokSet([e1]), r: 'B' },
				{ op: 'subeq', l: tokSet([]), r: 'B' },
				{ op: 'in', l: tokSet([]), r: 'B' },
				{ op: 'in', l: tokEl(e2), r: 'B' },
				{ op: 'notin', l: tokEl(e2), r: 'B' },
				{ op: 'subeq', l: tokSet([f]), r: 'B' },
				{ op: 'in', l: tokEl(f), r: 'B' },
				{ op: 'subeq', l: tokSet([e2, f]), r: 'B' },
				{ op: 'subeq', l: tokSet([e1, e2]), r: 'B' },
				{ op: 'subeq', l: 'B', r: 'B' },
			];
			const ch = pickStatements(rng, pool, sets, ask === 'vera');
			if (!ch) return null;
			const st = stmtsOf(ch);
			return {
				prompt: PROMPT,
				problem: `\\begin{array}{l} B = ${setTex(B)} \\\\ \\text{Quale affermazione è ${ask}?} \\end{array}`,
				solution: stmtTex(st[ch.correct]),
				steps: ['\\text{Il simbolo } \\in \\text{ lega un elemento a un insieme; } \\subseteq \\text{ lega due insiemi}', ...st.map((s) => reason(s, sets))],
				answer: ch,
				params: { ask, sets: { B: strs(B) } },
			};
		}
		case 3: {
			const ask = rng.int(0, 1) ? 'vera' : 'falsa';
			const U = pickUniverse(rng);
			const u = rng.next();
			const kind = u < 0.5 ? 'stretta' : u < 0.8 ? 'uguali' : 'al contrario';
			const B = norm(pickDistinct(rng, U, rng.int(3, 5)));
			let A: El[], Ashown: El[];
			if (kind === 'stretta') A = norm(pickDistinct(rng, B, rng.int(1, B.length - 1)));
			else if (kind === 'uguali') A = B;
			else A = norm([...B, ...pickDistinct(rng, diff(U, B), rng.int(1, 2))]);
			Ashown = A;
			if (kind === 'uguali') {
				do Ashown = shuffle(rng, B);
				while (Ashown.every((x, i) => x === B[i]));
			}
			const sets = { A, B };
			const pool: Stmt[] = [];
			for (const [l, r] of [
				['A', 'B'],
				['B', 'A'],
			] as const)
				for (const op of ['subeq', 'sub'] as const) pool.push({ op, l, r });
			pool.push({ op: 'eq', l: 'A', r: 'B' });
			pool.push({ op: 'subeq', l: 'A', r: 'A' }, { op: 'sub', l: 'A', r: 'A' });
			// at most one statement about the number sets
			if (rng.next() < 0.4) {
				const [l, r] = rng.pick([
					['N', 'Z'],
					['Z', 'N'],
					['Z', 'Q'],
					['Q', 'Z'],
					['N', 'N'],
					['Q', 'Q'],
				]);
				pool.push({ op: l === r ? 'sub' : rng.pick(['sub', 'subeq']), l, r });
			}
			const ch = pickStatements(rng, pool, sets, ask === 'vera', (x) => x.l === x.r);
			if (!ch) return null;
			const st = stmtsOf(ch);
			if (st.filter((s) => s.l.length === 1 && 'NZQ'.includes(s.l)).length > 1) return null;
			return {
				prompt: PROMPT,
				problem: `\\begin{array}{l} A = ${shown(Ashown)} \\qquad B = ${shown(B)} \\\\ \\text{Quale affermazione è ${ask}?} \\end{array}`,
				solution: stmtTex(st[ch.correct]),
				steps: ['\\text{Con } \\subseteq \\text{ i due insiemi possono coincidere, con } \\subset \\text{ no}', ...st.map((s) => reason(s, sets))],
				answer: ch,
				params: { ask, sets: { A: strs(Ashown), B: strs(B) }, case: kind },
			};
		}
		case 4: {
			const u = rng.next();
			const U = pickUniverse(rng);
			if (u < 0.35) {
				const n = rng.int(2, 3);
				const A = norm(pickDistinct(rng, U, n));
				const subs = subsetsBySize(A);
				const value = 2 ** n;
				return {
					prompt: 'Quanti sottoinsiemi ha questo insieme?',
					problem: `A = ${setTex(A)}`,
					solution: `\\text{${value} sottoinsiemi}`,
					steps: [
						...subs.map((ss, k) => `\\text{con } ${k} \\text{ element${k === 1 ? 'o' : 'i'}: } ${ss.map((s) => setTex(s)).join(',\\ ')}`),
						`\\text{In tutto } ${subs.map((ss) => ss.length).join(' + ')} = ${value}\\text{, compresi } \\emptyset \\text{ e } A \\text{ stesso}`,
					],
					answer: { kind: 'number', value: String(value) },
					params: {
						variant: 'tutti',
						A: strs(A),
						mistakes: strs([value - 1, value - 2, n, 2 * n]),
					},
				};
			}
			if (u < 0.65) {
				const n = rng.int(3, 4);
				const k = rng.int(1, n - 1);
				const A = norm(pickDistinct(rng, U, n));
				const list = subsetsBySize(A)[k];
				const value = list.length;
				return {
					prompt: `Quanti sottoinsiemi di A hanno ${k === 1 ? 'un elemento' : `${k} elementi`}?`,
					problem: `A = ${setTex(A)}`,
					solution: `\\text{${value} sottoinsiemi}`,
					steps: [`\\text{I sottoinsiemi con } ${k} \\text{ element${k === 1 ? 'o' : 'i'} sono } ${list.map((s) => setTex(s)).join(',\\ ')}`, `\\text{Sono } ${value}`],
					answer: { kind: 'number', value: String(value) },
					params: {
						variant: 'con k elementi',
						A: strs(A),
						k: String(k),
						mistakes: strs([k, n, 2 ** n, value + 1]),
					},
				};
			}
			const n = rng.int(3, 4);
			const A = norm(pickDistinct(rng, U, n));
			const out = pickDistinct(rng, diff(U, A), 2);
			const good = norm(pickDistinct(rng, A, rng.int(1, n - 1)));
			const opt = setOption;
			const cands: ChoiceOption[] = [
				opt(A), // improper: always among the options
				...shuffle(rng, [opt([...pickDistinct(rng, A, rng.int(1, n - 1)), out[0]]), opt([...A, out[1]]), opt([out[0]]), opt(out)]),
			];
			const ch = assembleChoice(rng, opt(good), cands);
			if (!ch) return null;
			const steps = ch.options.map((o) => {
				const xs = o.values.map(parse);
				const w = witness(xs, A);
				if (w !== undefined) return `${o.latex}\\text{: non è un sottoinsieme, } ${w} \\notin A`;
				if (sameSet(xs, A)) return `${o.latex}\\text{: è } A \\text{ stesso, un sottoinsieme improprio}`;
				return `${o.latex}\\text{: è un sottoinsieme proprio}`;
			});
			return {
				prompt: 'Quale di questi insiemi è un sottoinsieme proprio di A?',
				problem: `A = ${setTex(A)}`,
				solution: ch.options[ch.correct].latex,
				steps: ['\\text{I sottoinsiemi impropri di } A \\text{ sono } \\emptyset \\text{ e } A\\text{; gli altri sono propri}', ...steps],
				answer: ch,
				params: { variant: 'proprio', A: strs(A) },
			};
		}
		case 5: {
			const u = rng.next();
			let desc: string, truth: El[], variant: string, wrong: El[][];
			let k = 0;
			const extra: Record<string, unknown> = {};
			if (u < 0.4) {
				const [w, other] = rng.pick(WORD_PAIRS);
				truth = norm(w.split(''));
				variant = 'parola';
				extra.word = w;
				desc = textBlock(`Sia $A$ l'insieme delle lettere della parola “${w}”.`);
				const otherSet = norm(other.split(''));
				const pool = diff(LETTERS, truth);
				wrong = [otherSet, norm([...truth.slice(0, -1), rng.pick(pool)]), truth.slice(1), norm([...truth, rng.pick(pool)])];
			} else {
				let prop: Prop;
				if (u < 0.7) {
					k = rng.int(1, 5);
					prop = { dom: 'Z', conds: [{ t: 'sq', rel: '=', c: k * k }] };
					wrong = [[k], [k * k], [-k * k, k * k], [-k, 0, k]];
					variant = 'quadrato';
				} else {
					const n = rng.int(3, 7);
					prop = { dom: 'N', conds: [range2(null, false, n, true)] };
					wrong = [range(1, n - 1), range(1, n), range(0, n)];
					variant = 'naturali';
				}
				truth = propElements(prop);
				extra.prop = propJSON(prop);
				desc = `A = ${propTex(prop)}`;
			}
			const ch = assembleChoice(rng, setOption(truth), wrong.map(setOption));
			if (!ch) return null;
			const steps = [
				variant === 'parola'
					? `\\text{Le lettere ripetute contano una volta: } A = ${setTex(truth)}`
					: variant === 'quadrato'
						? `${k}^2 = ${k * k} \\text{ e anche } (-${k})^2 = ${k * k}\\text{: } A = ${setTex(truth)}`
						: `\\text{Lo } 0 \\text{ è un numero naturale: } A = ${setTex(truth)}`,
				...ch.options
					.filter((_, i) => i !== ch.correct)
					.map((o) => {
						const xs = o.values.map(parse);
						const w = witness(xs, truth),
							m = witness(truth, xs);
						return w !== undefined ? `${o.latex} \\neq A\\text{: } ${w} \\notin A` : `${o.latex} \\neq A\\text{: } ${m} \\in A \\text{ ma non sta in } ${o.latex}`;
					}),
			];
			return {
				prompt: 'Quale di questi insiemi è uguale ad A?',
				problem: desc,
				solution: `A = ${setTex(truth)}`,
				steps,
				answer: ch,
				params: { variant, ...extra },
			};
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

/** Pairs of words: the first has repeated letters; the second looks alike but has other letters. */
export const WORD_PAIRS: [string, string][] = [
	['casa', 'caro'],
	['sacca', 'sale'],
	['mamma', 'male'],
	['cocco', 'cosa'],
	['sasso', 'sano'],
	['nonna', 'naso'],
	['babbo', 'bar'],
	['pappa', 'pane'],
	['tetto', 'tela'],
	['ballo', 'bello'],
	['gatto', 'gatti'],
	['rossa', 'rotta'],
	['palla', 'pala'],
	['sella', 'sole'],
	['torre', 'treno'],
];

/** Subsets grouped by size, each group in the order of the lesson: {a, b}, {a, c}, {b, c}. */
function subsetsBySize(A: El[]): El[][][] {
	const combos = (from: number, k: number): El[][] => (k === 0 ? [[]] : A.slice(from).flatMap((x, i) => combos(from + i + 1, k - 1).map((rest) => [x, ...rest])));
	return range(0, A.length).map((k) => combos(0, k));
}

// ---------------------------------------------------------------------------
// Check and choice

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params as Record<string, unknown>;
	const a = sample.answer;
	const sets = Object.fromEntries(Object.entries((p.sets ?? {}) as Record<string, string[]>).map(([k, xs]) => [k, xs.map(parse)]));
	switch (sample.level) {
		case 1: {
			const A = (p.A as string[]).map(parse),
				B = (p.B as string[]).map(parse);
			if (a.kind !== 'choice' || a.correct !== (subsetEq(A, B) ? 0 : 1)) v.push('vero o falso sbagliato');
			break;
		}
		case 2:
		case 3: {
			if (a.kind !== 'choice' || a.options.length !== 4) return ['servono 4 affermazioni'];
			const want = p.ask === 'vera';
			const t = stmtsOf(a).map((s) => evalStmt(s, sets) === want);
			if (t.filter(Boolean).length !== 1 || !t[a.correct]) v.push('non c’è una sola affermazione giusta');
			break;
		}
		case 4: {
			const A = (p.A as string[]).map(parse);
			if (p.variant === 'proprio') {
				if (a.kind !== 'choice') return ['serve una scelta'];
				const t = a.options.map((o) => {
					const xs = o.values.map(parse);
					return xs.length > 0 && subsetEq(xs, A) && !sameSet(xs, A);
				});
				if (t.filter(Boolean).length !== 1 || !t[a.correct]) v.push('non c’è un solo sottoinsieme proprio');
				if (a.options.some((o) => o.values.length === 0)) v.push('l’insieme vuoto non va tra le opzioni');
			} else {
				const k = p.variant === 'tutti' ? null : Number(p.k);
				const all = subsetsBySize(A);
				const value = k === null ? all.reduce((s, x) => s + x.length, 0) : all[k].length;
				if (a.kind !== 'number' || Number(a.value) !== value) v.push('conteggio sbagliato');
				if (A.length > 4) v.push('A troppo grande');
			}
			break;
		}
		case 5: {
			if (a.kind !== 'choice') return ['serve una scelta'];
			const truth = p.variant === 'parola' ? norm(String(p.word).split('')) : propElements(propFromJSON(p.prop));
			const t = a.options.map((o) => sameSet(o.values.map(parse), truth));
			if (t.filter(Boolean).length !== 1 || !t[a.correct]) v.push('non c’è un solo insieme uguale ad A');
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	if (sample.answer.kind !== 'number') throw new Error(`${ID}: no choice for ${sample.answer.kind}`);
	return numberChoice(rng, Number(sample.answer.value), ((sample.params.mistakes ?? []) as string[]).map(Number));
}

export const sottoinsiemiUgualianza: Generator = {
	id: ID,
	title: 'Sottoinsiemi e uguaglianza',
	levels: {
		1: {
			label: 'Controllare un’inclusione',
			constraints: ['vero o falso su A ⊆ B, A e B elencati', 'circa metà vere: incluso o uguale in un altro ordine; metà false: un elemento fuori, oppure B ⊆ A'],
		},
		2: {
			label: 'Appartenenza o inclusione',
			constraints: ['∈ tra elemento e insieme, ⊆ tra insiemi', 'trappole: {2} ∈ B, ∅ ∈ B, ∅ ⊆ B'],
		},
		3: {
			label: 'Inclusione stretta',
			constraints: ['A ⊂ B, A = B scritti in un altro ordine, oppure B ⊂ A', '⊆ e ⊂ tra A e B nei due versi, A = B, A ⊆ A e A ⊂ A; a volte ℕ, ℤ, ℚ'],
		},
		4: {
			label: 'Sottoinsiemi propri e impropri',
			constraints: ['quanti sottoinsiemi ha un insieme di 2 o 3 elementi', 'quanti sottoinsiemi con k elementi', 'quale è un sottoinsieme proprio (∅ mai tra le opzioni)'],
		},
		5: {
			label: 'Uguaglianza tra insiemi',
			constraints: ['A dato con le lettere di una parola o con una proprietà', 'una sola opzione con gli stessi elementi'],
		},
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 1000; attempt++) {
			const b = build(rng, level);
			if (!b) continue;
			const sample: Sample = { generatorId: ID, level, seed: rng.seed, ...b };
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default sottoinsiemiUgualianza;
