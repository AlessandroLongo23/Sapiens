/**
 * Relazioni di equivalenza e d'ordine. Spec: specs/exercises/relazioni-equivalenza-ordine.md
 *
 * Seven levels in the order of the lesson (docs/lezioni/riscritte/41-relazioni-equivalenza-ordine.md):
 * one property of a finite relation given by its pairs; the four properties together; one property of
 * a relation in N or Z given in words, with the counterexample; classes and quotient set of a finite
 * equivalence; "same remainder in the division by n"; order relations (wide or strict, total or
 * partial); the fewest pairs to add so that a relation becomes reflexive, symmetric, transitive or an
 * equivalence. Every level is multiple choice. The answer is picked first (the property holds or not,
 * the profile, the category, the pairs to add) and a relation that has it is built or searched for.
 *
 * Elements are strings: "1", "-2", "a", and "{1,2}" for a subset ("{}" is the empty set). A pair is
 * the key "a:b". The relation is written \mathcal{R}, as in the lesson.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { listTex, pickDistinct, range, shuffle, textBlock } from '../insiemi';

export const ID = 'relazioni-equivalenza-ordine';

const RN = '\\mathcal{R}';
const IN_R = `\\in ${RN}`;
const NOT_IN_R = `\\notin ${RN}`;
const REL = `\\mathrel{${RN}}`;

// ---------------------------------------------------------------------------
// Elements, pairs, relations

type E = string;
const key = (a: E, b: E) => `${a}:${b}`;
function unkey(k: string): [E, E] {
	const i = k.indexOf(':');
	return [k.slice(0, i), k.slice(i + 1)];
}

function elTex(e: E): string {
	if (e.startsWith('{')) {
		const inner = e.slice(1, -1);
		return inner ? `\\{${inner.split(',').join(', ')}\\}` : '\\emptyset';
	}
	return e;
}
const pairTex = (a: E, b: E) => `(${elTex(a)}, ${elTex(b)})`;
const setTex = (xs: E[]) => (xs.length ? `\\{${xs.map(elTex).join(', ')}\\}` : '\\emptyset');

interface Rel {
	A: E[];
	R: Set<string>;
}

const has = (r: Rel, a: E, b: E) => r.R.has(key(a, b));

/** Pairs in the order of the lesson: the loops first, then by first and second element. */
function sortedKeys(A: E[], keys: Iterable<string>): string[] {
	const idx = (e: E) => A.indexOf(e);
	return [...keys].sort((p, q) => {
		const [a, b] = unkey(p), [c, d] = unkey(q);
		const lp = a === b ? 0 : 1, lq = c === d ? 0 : 1;
		return lp - lq || idx(a) - idx(c) || idx(b) - idx(d);
	});
}

const PER_ROW = 3;

function chunk<T>(xs: T[], k: number): T[][] {
	const out: T[][] = [];
	for (let i = 0; i < xs.length; i += k) out.push(xs.slice(i, i + k));
	return out;
}

/** \mathcal{R} = \{...\}, on rows of three pairs with aligned when longer, as in example 1 of the lesson. */
function relTex(r: Rel): string {
	const ps = sortedKeys(r.A, r.R).map((k) => pairTex(...unkey(k)));
	if (ps.length === 0) return `${RN} = \\emptyset`;
	if (ps.length <= PER_ROW) return `${RN} = \\{${ps.join(',\\ ')}\\}`;
	const rows = chunk(ps, PER_ROW).map((row) => row.join(',\\ '));
	return `\\begin{aligned} ${RN} = \\{&${rows.join(', \\\\ &')}\\} \\end{aligned}`;
}

const givens = (r: Rel) => `A = ${setTex(r.A)},\\quad ${relTex(r)}`;

/** Pairs in a step: each pair its own formula, so the line wraps on a phone. */
function pairsInline(ps: [E, E][]): string {
	if (ps.length === 1) return pairTex(...ps[0]);
	const t = ps.map(([a, b]) => pairTex(a, b));
	return `${t.slice(0, -1).join('\\text{, }')} \\text{ e } ${t[t.length - 1]}`;
}

function elsInline(xs: E[]): string {
	const t = xs.map(elTex);
	if (t.length === 1) return t[0];
	return `${t.slice(0, -1).join('\\text{, }')} \\text{ e } ${t[t.length - 1]}`;
}

const LETTERS = ['a', 'b', 'c', 'd', 'e'];
const makeA = (rng: Rng, n: number, letterShare = 0.3): E[] => (rng.next() < letterShare ? LETTERS.slice(0, n) : range(1, n).map(String));

// ---------------------------------------------------------------------------
// Properties

type Prop = 'rifl' | 'sim' | 'anti' | 'trans';
const PROPS: Prop[] = ['rifl', 'sim', 'anti', 'trans'];
const PROP_NAME: Record<Prop, string> = { rifl: 'riflessiva', sim: 'simmetrica', anti: 'antisimmetrica', trans: 'transitiva' };

type Mem = (a: E, b: E) => boolean;

function holdsOn(p: Prop, A: E[], m: Mem): boolean {
	switch (p) {
		case 'rifl':
			return A.every((a) => m(a, a));
		case 'sim':
			return A.every((a) => A.every((b) => !m(a, b) || m(b, a)));
		case 'anti':
			return A.every((a) => A.every((b) => a === b || !m(a, b) || !m(b, a)));
		case 'trans':
			return A.every((a) => A.every((b) => !m(a, b) || A.every((c) => !m(b, c) || m(a, c))));
	}
}

const memOf = (r: Rel): Mem => (a, b) => has(r, a, b);
const holds = (p: Prop, r: Rel) => holdsOn(p, r.A, memOf(r));
const irrefl = (r: Rel) => r.A.every((a) => !has(r, a, a));

/** Paths a -> b -> c with a != b and b != c (a may be c). */
function paths(r: Rel): [E, E, E][] {
	const out: [E, E, E][] = [];
	for (const a of r.A) for (const b of r.A) for (const c of r.A) if (a !== b && b !== c && has(r, a, b) && has(r, b, c)) out.push([a, b, c]);
	return out;
}

const nonLoops = (r: Rel) => [...r.R].filter((k) => {
	const [a, b] = unkey(k);
	return a !== b;
});

// ---------------------------------------------------------------------------
// Closures

function reflAdd(r: Rel): string[] {
	return r.A.filter((a) => !has(r, a, a)).map((a) => key(a, a));
}
function symAdd(r: Rel): string[] {
	return [...r.R].map(unkey).filter(([a, b]) => !has(r, b, a)).map(([a, b]) => key(b, a));
}
/** Transitive closure by rounds: each round adds the shortcut of every path of the relation so far. */
function transRounds(r: Rel): string[][] {
	const cur = new Set(r.R);
	const rounds: string[][] = [];
	for (;;) {
		const add = new Set<string>();
		for (const a of r.A) for (const b of r.A) for (const c of r.A) if (cur.has(key(a, b)) && cur.has(key(b, c)) && !cur.has(key(a, c))) add.add(key(a, c));
		if (add.size === 0) return rounds;
		rounds.push([...add]);
		for (const k of add) cur.add(k);
	}
}
const withPairs = (r: Rel, ks: Iterable<string>): Rel => ({ A: r.A, R: new Set([...r.R, ...ks]) });

// ---------------------------------------------------------------------------
// Random finite relations

function randomRelation(rng: Rng, A: E[]): Rel {
	const n = A.length;
	const R = new Set<string>();
	const all = A.flatMap((a) => A.map((b) => key(a, b)));
	const base = rng.pick(['random', 'random', 'equiv', 'order', 'sym', 'diag']);
	if (base === 'random') {
		const p = rng.pick([0.2, 0.3, 0.4]);
		for (const k of all) if (rng.next() < p) R.add(k);
	} else if (base === 'equiv') {
		const cls = A.map(() => rng.int(0, n - 1));
		A.forEach((a, i) => A.forEach((b, j) => cls[i] === cls[j] && R.add(key(a, b))));
	} else if (base === 'order') {
		const perm = shuffle(rng, A);
		for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (rng.next() < 0.6) R.add(key(perm[i], perm[j]));
		for (const k of transRounds({ A, R }).flat()) R.add(k);
		const loops = rng.next();
		for (const a of A) if (loops < 0.5 || (loops < 0.7 && rng.next() < 0.5)) R.add(key(a, a));
	} else if (base === 'sym') {
		for (let i = 0; i < n; i++)
			for (let j = i + 1; j < n; j++)
				if (rng.next() < 0.35) {
					R.add(key(A[i], A[j]));
					R.add(key(A[j], A[i]));
				}
		for (const a of A) if (rng.next() < 0.5) R.add(key(a, a));
	} else {
		for (const a of A) if (rng.next() < 0.7) R.add(key(a, a));
	}
	const removes = rng.int(0, 2), adds = rng.int(0, 2);
	for (let i = 0; i < removes && R.size > 0; i++) R.delete(rng.pick([...R]));
	for (let i = 0; i < adds; i++) R.add(rng.pick(all));
	return { A, R };
}

// ---------------------------------------------------------------------------
// Claims: the "No: ..." options of levels 1 and 3

/**
 * rifl: (a, b) is not in R (a counterexample only when a = b); sim: (a, b) in R and (b, a) not;
 * anti: (a, b) and (b, a) in R with a != b; trans: (a, b), (b, c) in R and (a, c) not;
 * cappio: "there is the loop (a, a)", never a counterexample to the antisymmetric property.
 */
type Claim = { t: 'rifl' | 'sim' | 'anti'; a: E; b: E } | { t: 'trans'; a: E; b: E; c: E } | { t: 'cappio'; a: E };

function claimValid(cl: Claim, m: Mem): boolean {
	switch (cl.t) {
		case 'rifl':
			return cl.a === cl.b && !m(cl.a, cl.b);
		case 'sim':
			return m(cl.a, cl.b) && !m(cl.b, cl.a);
		case 'anti':
			return cl.a !== cl.b && m(cl.a, cl.b) && m(cl.b, cl.a);
		case 'trans':
			return m(cl.a, cl.b) && m(cl.b, cl.c) && !m(cl.a, cl.c);
		case 'cappio':
			return false;
	}
}

const claimValues = (cl: Claim): string[] => (cl.t === 'trans' ? ['trans', cl.a, cl.b, cl.c] : cl.t === 'cappio' ? ['cappio', cl.a] : [cl.t, cl.a, cl.b]);

function claimFromValues(v: string[]): Claim | null {
	if (v[0] === 'trans' && v.length === 4) return { t: 'trans', a: v[1], b: v[2], c: v[3] };
	if (v[0] === 'cappio' && v.length === 2) return { t: 'cappio', a: v[1] };
	if ((v[0] === 'rifl' || v[0] === 'sim' || v[0] === 'anti') && v.length === 3) return { t: v[0], a: v[1], b: v[2] };
	return null;
}

/** Level 1 wording (the pairs are listed): "manca", "c'è", "ci sono". */
function claimTexList(cl: Claim): string {
	switch (cl.t) {
		case 'rifl':
			return `\\text{No: manca } ${pairTex(cl.a, cl.b)}`;
		case 'sim':
			return `\\text{No: c'è } ${pairTex(cl.a, cl.b)}\\text{, manca } ${pairTex(cl.b, cl.a)}`;
		case 'anti':
			return `\\text{No: ci sono } ${pairTex(cl.a, cl.b)} \\text{ e } ${pairTex(cl.b, cl.a)}`;
		case 'cappio':
			return `\\text{No: c'è il cappio } ${pairTex(cl.a, cl.a)}`;
		case 'trans':
			return `\\begin{gathered} \\text{No: ci sono } ${pairTex(cl.a, cl.b)} \\text{ e } ${pairTex(cl.b, cl.c)}\\text{,} \\\\ \\text{manca } ${pairTex(cl.a, cl.c)} \\end{gathered}`;
	}
}

/** Level 3 wording (the relation is a rule): membership with ∈ and ∉. */
function claimTexRule(cl: Claim): string {
	switch (cl.t) {
		case 'rifl':
			return `\\text{No: } ${pairTex(cl.a, cl.b)} ${NOT_IN_R}`;
		case 'sim':
			return `\\begin{gathered} \\text{No: } ${pairTex(cl.a, cl.b)} ${IN_R}\\text{,} \\\\ ${pairTex(cl.b, cl.a)} ${NOT_IN_R} \\end{gathered}`;
		case 'anti':
			return `\\begin{gathered} \\text{No: } ${pairTex(cl.a, cl.b)} ${IN_R}\\text{,} \\\\ ${pairTex(cl.b, cl.a)} ${IN_R} \\end{gathered}`;
		case 'cappio':
			return `\\text{No: } ${pairTex(cl.a, cl.a)} ${IN_R}`;
		case 'trans':
			return `\\begin{gathered} \\text{No: } ${pairTex(cl.a, cl.b)} ${IN_R}\\text{, } ${pairTex(cl.b, cl.c)} ${IN_R}\\text{,} \\\\ ${pairTex(cl.a, cl.c)} ${NOT_IN_R} \\end{gathered}`;
	}
}

const SI: ChoiceOption = { latex: '\\text{Sì}', values: ['si'] };

/** Every claim of the form of property p on the elements of pool. */
function claimsFor(p: Prop, pool: E[], withLoops: boolean): Claim[] {
	const out: Claim[] = [];
	for (const a of pool)
		for (const b of pool) {
			if (p === 'rifl') out.push({ t: 'rifl', a, b });
			else if (a !== b && p !== 'trans') out.push({ t: p, a, b });
			if (p === 'trans' && a !== b) for (const c of pool) if (b !== c) out.push({ t: 'trans', a, b, c });
		}
	if (p === 'anti' && withLoops) for (const a of pool) out.push({ t: 'cappio', a });
	return out;
}

/** Wrong claims a student could pick: part of what they say is true, or they point at the wrong pair. */
function plausibleWrong(cl: Claim, m: Mem): boolean {
	if (claimValid(cl, m)) return false;
	switch (cl.t) {
		case 'rifl':
			return cl.a === cl.b ? m(cl.a, cl.a) : !m(cl.a, cl.b);
		case 'sim':
			return m(cl.b, cl.a);
		case 'anti':
			// one of the two pairs is not there, or neither is (a slip in the computation)
			return !(m(cl.a, cl.b) && m(cl.b, cl.a));
		case 'cappio':
			return m(cl.a, cl.a);
		case 'trans': {
			const facts = [m(cl.a, cl.b), m(cl.b, cl.c), !m(cl.a, cl.c)].filter(Boolean).length;
			return facts === 2;
		}
	}
}

const claimSize = (cl: Claim, num: boolean): number => {
	if (!num) return 0;
	const xs = cl.t === 'trans' ? [cl.a, cl.b, cl.c] : cl.t === 'cappio' ? [cl.a] : [cl.a, cl.b];
	return xs.reduce((s, x) => s + Math.abs(Number(x)), 0);
};

/** Random pick among the claims with the smallest numbers (all of them when the elements are not numbers). */
function pickSmall(rng: Rng, cls: Claim[], num: boolean, k: number, slack: number): Claim[] {
	if (k <= 0 || cls.length < k) return [];
	const sorted = [...cls].sort((x, y) => claimSize(x, num) - claimSize(y, num));
	const limit = claimSize(sorted[Math.min(sorted.length - 1, k - 1)], num) + slack;
	return pickDistinct(rng, sorted.filter((c) => claimSize(c, num) <= limit), k);
}

interface PropQuestion {
	holds: boolean;
	/** The counterexample shown as the right answer, when the property fails. */
	witness: Claim | null;
	choice: ChoiceAnswer;
}

/** "Sì" plus three "No: ..." options, exactly one of them right. */
function propQuestion(rng: Rng, p: Prop, pool: E[], m: Mem, tex: (c: Claim) => string, num: boolean, withLoops: boolean, preferBack: boolean): PropQuestion | null {
	const truth = holdsOn(p, pool, m);
	const cands = claimsFor(p, pool, withLoops);
	let witness: Claim | null = null;
	if (!truth) {
		let valid = cands.filter((c) => claimValid(c, m));
		if (valid.length === 0) return null;
		if (p === 'trans' && preferBack) {
			const back = valid.filter((c) => c.t === 'trans' && c.a === c.c);
			if (back.length && rng.next() < 0.5) valid = back;
		}
		witness = pickSmall(rng, valid, num, 1, num ? 3 : 0)[0];
	}
	const wrong = cands.filter((c) => plausibleWrong(c, m));
	// A mix of kinds: for the reflexive property both a loop that is there and a pair that is not a loop.
	const need = truth ? 3 : 2;
	let picked: Claim[] = [];
	if (p === 'rifl' || p === 'anti') {
		const g1 = wrong.filter((c) => (p === 'rifl' ? c.t === 'rifl' && c.a === c.b : c.t === 'anti'));
		const g2 = wrong.filter((c) => !g1.includes(c));
		const n1 = Math.min(g1.length, rng.int(1, need - 1));
		const first = pickSmall(rng, g1, num, n1, num ? 4 : 0);
		const second = pickSmall(rng, g2, num, Math.min(g2.length, need - first.length), num ? 4 : 0);
		picked = [...first, ...second];
		if (picked.length < need) picked = [...picked, ...pickSmall(rng, wrong.filter((c) => !picked.includes(c)), num, need - picked.length, 6)];
	} else picked = pickSmall(rng, wrong, num, need, num ? 4 : 0);
	if (picked.length < need) return null;
	const correct: ChoiceOption = witness ? { latex: tex(witness), values: claimValues(witness) } : SI;
	const opts: ChoiceOption[] = [correct, ...(witness ? [SI] : []), ...picked.map((c) => ({ latex: tex(c), values: claimValues(c) }))];
	if (new Set(opts.map((o) => o.values.join('|'))).size !== 4) return null;
	const order = shuffle(rng, [0, 1, 2, 3]);
	return { holds: truth, witness, choice: { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) } };
}

// ---------------------------------------------------------------------------
// Steps on a finite relation

function propStep(p: Prop, r: Rel): string {
	switch (p) {
		case 'rifl': {
			const missing = r.A.filter((a) => !has(r, a, a));
			if (!missing.length) return `\\text{Riflessiva: sì, ci sono tutti i cappi } ${pairsInline(r.A.map((a) => [a, a]))}\\text{.}`;
			if (missing.length === 1) return `\\text{Riflessiva: no, manca il cappio } ${pairTex(missing[0], missing[0])}\\text{: basta un cappio mancante.}`;
			return `\\text{Riflessiva: no, mancano i cappi } ${pairsInline(missing.map((a) => [a, a]))}\\text{.}`;
		}
		case 'sim': {
			const bad = [...r.R].map(unkey).filter(([a, b]) => !has(r, b, a));
			if (!bad.length) {
				const nl = nonLoops(r);
				return nl.length ? `\\text{Simmetrica: sì, ogni freccia tra elementi diversi ha quella di ritorno.}` : `\\text{Simmetrica: sì, ci sono solo cappi, e un cappio è il ritorno di sé stesso.}`;
			}
			const [a, b] = bad[0];
			return `\\text{Simmetrica: no, } ${pairTex(a, b)} ${IN_R} \\text{ ma } ${pairTex(b, a)} ${NOT_IN_R}\\text{.}`;
		}
		case 'anti': {
			const bad = [...r.R].map(unkey).filter(([a, b]) => a !== b && has(r, b, a));
			if (!bad.length) return `\\text{Antisimmetrica: sì, nessuna freccia tra elementi diversi ha quella di ritorno${r.A.some((a) => has(r, a, a)) ? ' (i cappi sono ammessi)' : ''}.}`;
			const [a, b] = bad[0];
			return `\\text{Antisimmetrica: no, ci sono } ${pairTex(a, b)} \\text{ e } ${pairTex(b, a)} \\text{ con } ${elTex(a)} \\neq ${elTex(b)}\\text{.}`;
		}
		case 'trans': {
			const ps = paths(r);
			const bad = ps.filter(([a, , c]) => !has(r, a, c));
			if (!bad.length) {
				if (!ps.length) return `\\text{Transitiva: sì, non ci sono due frecce di fila tra elementi diversi, quindi nessuna scorciatoia da controllare.}`;
				return `\\text{Transitiva: sì, ogni percorso di due frecce ha la scorciatoia (${ps.length === 1 ? 'il percorso è' : 'i percorsi sono'} } ${ps.slice(0, 4).map(([a, b, c]) => `${elTex(a)} \\to ${elTex(b)} \\to ${elTex(c)}`).join('\\text{, }')}${ps.length > 4 ? '\\text{, …}' : ''}\\text{).}`;
			}
			const [a, b, c] = bad.find(([x, , z]) => x === z) ?? bad[0];
			return `\\text{Transitiva: no, ci sono } ${pairTex(a, b)} \\text{ e } ${pairTex(b, c)} \\text{ ma manca } ${pairTex(a, c)}\\text{.}${a === c ? '\\text{ Il percorso torna indietro: serve il cappio.}' : ''}`;
		}
	}
}

/** Steps for one property, with the witness of the right option. */
function oneProp(p: Prop, r: Rel, witness: Claim | null): string[] {
	const name = PROP_NAME[p];
	if (!witness) {
		const s = propStep(p, r).replace(/^\\text\{[A-Za-z]+: sì, /, '\\text{');
		const first = s.replace(/^\\text\{(.)/, (_, ch: string) => `\\text{${ch.toUpperCase()}`);
		return [first, `\\text{Quindi } ${RN} \\text{ è ${name}.}`];
	}
	const cl = witness;
	switch (cl.t) {
		case 'rifl':
			return [`\\text{Nel diagramma manca il cappio su } ${elTex(cl.a)}\\text{: la coppia } ${pairTex(cl.a, cl.a)} \\text{ non sta in } ${RN}\\text{.}`, `\\text{Basta un cappio mancante: } ${RN} \\text{ non è riflessiva.}`];
		case 'sim':
			return [`${pairTex(cl.a, cl.b)} ${IN_R}\\text{, ma la freccia di ritorno } ${pairTex(cl.b, cl.a)} \\text{ manca.}`, `\\text{Quindi } ${RN} \\text{ non è simmetrica.}`];
		case 'anti':
			return [`${pairTex(cl.a, cl.b)} \\text{ e } ${pairTex(cl.b, cl.a)} \\text{ stanno tutte e due in } ${RN}\\text{, e } ${elTex(cl.a)} \\neq ${elTex(cl.b)}\\text{.}`, `\\text{Quindi } ${RN} \\text{ non è antisimmetrica.}`];
		case 'trans':
			return [
				`\\text{C'è il percorso } ${elTex(cl.a)} \\to ${elTex(cl.b)} \\to ${elTex(cl.c)}\\text{: } ${pairTex(cl.a, cl.b)} ${IN_R} \\text{ e } ${pairTex(cl.b, cl.c)} ${IN_R}\\text{.}`,
				cl.a === cl.c
					? `\\text{Il percorso torna al punto di partenza, quindi la scorciatoia è il cappio } ${pairTex(cl.a, cl.a)}\\text{, che manca.}`
					: `\\text{La scorciatoia } ${pairTex(cl.a, cl.c)} \\text{ manca.}`,
				`\\text{Quindi } ${RN} \\text{ non è transitiva.}`,
			];
		case 'cappio':
			return [];
	}
}

// ---------------------------------------------------------------------------
// Level 1: one property of a finite relation

interface Built1 {
	r: Rel;
	p: Prop;
	q: PropQuestion;
}

function build1(rng: Rng): Built1 {
	const p = rng.pick(PROPS);
	const want = rng.next() < 0.5;
	for (let t = 0; t < 4000; t++) {
		const n = rng.int(3, 4);
		const r = randomRelation(rng, makeA(rng, n));
		if (r.R.size < 3 || r.R.size > 8) continue;
		if (holds(p, r) !== want) continue;
		const nl = nonLoops(r).length;
		if (nl === 0) continue;
		if (p === 'trans' && want && paths(r).length === 0) continue;
		if (p === 'rifl' && !want && !r.A.some((a) => has(r, a, a)) && rng.next() < 0.7) continue;
		if (p === 'sim' && want && nl < 2) continue;
		const q = propQuestion(rng, p, r.A, memOf(r), claimTexList, false, true, true);
		if (q) return { r, p, q };
	}
	throw new Error(`${ID}: level 1 not built`);
}

// ---------------------------------------------------------------------------
// Level 2: the four properties

const CODES: Record<Prop, string> = { rifl: 'R', sim: 'S', anti: 'A', trans: 'T' };
type Profile = Record<Prop, boolean>;
const profileOf = (r: Rel): Profile => ({ rifl: holds('rifl', r), sim: holds('sim', r), anti: holds('anti', r), trans: holds('trans', r) });
const profileKey = (pr: Profile) => PROPS.filter((p) => pr[p]).map((p) => CODES[p]).join('');

const PROFILES: [string, number][] = [
	['RST', 2], ['RAT', 2], ['RT', 2], ['RS', 2], ['RA', 2], ['R', 2], ['ST', 2], ['S', 2], ['AT', 2], ['A', 2], ['T', 2], ['', 2], ['SAT', 1], ['RSAT', 1],
];

function profileOption(k: string): ChoiceOption {
	const names = PROPS.filter((p) => k.includes(CODES[p])).map((p) => PROP_NAME[p]);
	const values = k ? k.split('') : ['nessuna'];
	if (!names.length) return { latex: '\\text{nessuna delle quattro}', values };
	if (names.length <= 2) return { latex: `\\text{${names.join(', ')}}`, values };
	return { latex: `\\begin{gathered} \\text{${names.slice(0, 2).join(', ')},} \\\\ \\text{${names.slice(2).join(', ')}} \\end{gathered}`, values };
}

function profileDistractors(rng: Rng, r: Rel, pr: Profile): string[] {
	const flip = (...ps: Prop[]) => {
		const q = { ...pr };
		for (const p of ps) q[p] = !q[p];
		return profileKey(q);
	};
	const first: string[] = [];
	const bad = paths(r).filter(([a, , c]) => !has(r, a, c));
	if (!pr.trans && bad.some(([a, , c]) => a === c)) first.push(flip('trans'));
	if (!pr.rifl && r.A.filter((a) => !has(r, a, a)).length === 1) first.push(flip('rifl'));
	if (pr.sim !== pr.anti) first.push(flip('sim', 'anti'));
	if (pr.sim && pr.anti) first.push(flip('anti'), flip('sim'));
	const singles = shuffle(rng, PROPS).map((p) => flip(p));
	const doubles = shuffle(rng, [flip('rifl', 'trans'), flip('sim', 'trans'), flip('rifl', 'sim'), flip('anti', 'trans')]);
	const out: string[] = [];
	for (const k of [...first, ...singles, ...doubles]) if (k !== profileKey(pr) && !out.includes(k)) out.push(k);
	return out.slice(0, 3);
}

function build2(rng: Rng): { r: Rel; pr: Profile } {
	const bag = PROFILES.flatMap(([k, w]) => Array(w).fill(k) as string[]);
	const target = rng.pick(bag);
	for (let t = 0; t < 20000; t++) {
		const n = target === 'SAT' ? 4 : rng.int(3, 4);
		const r = randomRelation(rng, makeA(rng, n));
		if (r.R.size < 3 || r.R.size > 9) continue;
		const pr = profileOf(r);
		if (profileKey(pr) !== target) continue;
		if (target !== 'SAT' && target !== 'RSAT' && nonLoops(r).length === 0) continue;
		return { r, pr };
	}
	throw new Error(`${ID}: level 2 profile ${target} not built`);
}

// ---------------------------------------------------------------------------
// Level 3: relations in N and Z given in words

type Dom = 'N' | 'N0' | 'Z' | 'Z0';
const DOM_INTRO: Record<Dom, string> = {
	N: 'In $\\mathbb{N}$',
	Z: 'In $\\mathbb{Z}$',
	N0: 'Tra i naturali diversi da zero',
	Z0: 'Tra gli interi diversi da zero',
};
const DOM_POOL: Record<Dom, number[]> = {
	N: range(0, 12),
	N0: range(1, 12),
	Z: range(-6, 6),
	Z0: range(-6, 6).filter((x) => x !== 0),
};
/** Where the truth of a property is checked, pair by pair (the pools are inside). */
const DOM_WINDOW: Record<Dom, number[]> = {
	N: range(0, 24),
	N0: range(1, 24),
	Z: range(-12, 12),
	Z0: range(-12, 12).filter((x) => x !== 0),
};

interface WordRel {
	code: string;
	dom: Dom;
	/** The condition, prose with inline $...$. */
	cond: string;
	mem: (a: number, b: number) => boolean;
	/** Why (a, b) is or is not in R, as a formula. */
	fact: (a: number, b: number) => string;
	/** Why a property holds, prose with inline $...$. */
	why: Partial<Record<Prop, string>>;
}

const p0 = (x: number) => (x < 0 ? `(${x})` : String(x));
const falseIf = (tex: string, truth: boolean) => (truth ? tex : `${tex} \\text{ è falso}`);
const mod = (a: number, n: number) => ((a % n) + n) % n;

function wordRels(): WordRel[] {
	const rels: WordRel[] = [
		{
			code: 'prodotto-positivo', dom: 'Z', cond: '$a \\cdot b > 0$',
			mem: (a, b) => a * b > 0,
			fact: (a, b) => `${p0(a)} \\cdot ${p0(b)} = ${a * b} ${a * b > 0 ? '>' : '\\leq'} 0`,
			why: {
				sim: 'Simmetrica: sì, perché $a \\cdot b = b \\cdot a$.',
				trans: 'Transitiva: sì. Se $a \\cdot b > 0$ e $b \\cdot c > 0$, allora $a$ ha lo stesso segno di $b$ e $b$ lo stesso segno di $c$, quindi $a$ e $c$ hanno lo stesso segno e $a \\cdot c > 0$.',
			},
		},
		{
			code: 'somma-pari', dom: 'N', cond: '$a + b$ è pari',
			mem: (a, b) => (a + b) % 2 === 0,
			fact: (a, b) => `${a} + ${b} = ${a + b} \\text{ è ${(a + b) % 2 === 0 ? 'pari' : 'dispari'}}`,
			why: {
				rifl: 'Riflessiva: sì, perché $a + a = 2a$ è sempre pari.',
				sim: 'Simmetrica: sì, perché $a + b = b + a$.',
				trans: 'Transitiva: sì. Se $a + b$ e $b + c$ sono pari, è pari anche la loro somma $a + 2b + c$; togliendo il numero pari $2b$ resta $a + c$, che quindi è pari.',
			},
		},
		{
			code: 'somma-dispari', dom: 'N', cond: '$a + b$ è dispari',
			mem: (a, b) => (a + b) % 2 === 1,
			fact: (a, b) => `${a} + ${b} = ${a + b} \\text{ è ${(a + b) % 2 === 0 ? 'pari' : 'dispari'}}`,
			why: { sim: 'Simmetrica: sì, perché $a + b = b + a$.' },
		},
		{
			code: 'prodotto-pari', dom: 'N', cond: '$a \\cdot b$ è pari',
			mem: (a, b) => (a * b) % 2 === 0,
			fact: (a, b) => `${a} \\cdot ${b} = ${a * b} \\text{ è ${(a * b) % 2 === 0 ? 'pari' : 'dispari'}}`,
			why: { sim: 'Simmetrica: sì, perché $a \\cdot b = b \\cdot a$.' },
		},
		{
			code: 'prodotto-non-negativo', dom: 'Z', cond: '$a \\cdot b \\geq 0$',
			mem: (a, b) => a * b >= 0,
			fact: (a, b) => `${p0(a)} \\cdot ${p0(b)} = ${a * b} ${a * b >= 0 ? '\\geq' : '<'} 0`,
			why: { rifl: 'Riflessiva: sì, perché $a \\cdot a \\geq 0$ per ogni intero $a$.', sim: 'Simmetrica: sì, perché $a \\cdot b = b \\cdot a$.' },
		},
		{
			code: 'prodotto-negativo', dom: 'Z', cond: '$a \\cdot b < 0$',
			mem: (a, b) => a * b < 0,
			fact: (a, b) => `${p0(a)} \\cdot ${p0(b)} = ${a * b} ${a * b < 0 ? '<' : '\\geq'} 0`,
			why: { sim: 'Simmetrica: sì, perché $a \\cdot b = b \\cdot a$.' },
		},
		{
			code: 'minore', dom: 'N', cond: '$a < b$',
			mem: (a, b) => a < b,
			fact: (a, b) => falseIf(`${a} < ${b}`, a < b),
			why: {
				anti: 'Antisimmetrica: sì, perché $a < b$ e $b < a$ non valgono mai insieme.',
				trans: 'Transitiva: sì, da $a < b$ e $b < c$ segue $a < c$.',
			},
		},
		{
			code: 'minore-uguale', dom: 'N', cond: '$a \\leq b$',
			mem: (a, b) => a <= b,
			fact: (a, b) => falseIf(`${a} \\leq ${b}`, a <= b),
			why: {
				rifl: 'Riflessiva: sì, perché $a \\leq a$ per ogni $a$.',
				anti: 'Antisimmetrica: sì, se $a \\leq b$ e $b \\leq a$, allora $a = b$.',
				trans: 'Transitiva: sì, da $a \\leq b$ e $b \\leq c$ segue $a \\leq c$.',
			},
		},
		{
			code: 'maggiore', dom: 'N', cond: '$a > b$',
			mem: (a, b) => a > b,
			fact: (a, b) => falseIf(`${a} > ${b}`, a > b),
			why: {
				anti: 'Antisimmetrica: sì, perché $a > b$ e $b > a$ non valgono mai insieme.',
				trans: 'Transitiva: sì, da $a > b$ e $b > c$ segue $a > c$.',
			},
		},
		{
			code: 'maggiore-uguale', dom: 'N', cond: '$a \\geq b$',
			mem: (a, b) => a >= b,
			fact: (a, b) => falseIf(`${a} \\geq ${b}`, a >= b),
			why: {
				rifl: 'Riflessiva: sì, perché $a \\geq a$ per ogni $a$.',
				anti: 'Antisimmetrica: sì, se $a \\geq b$ e $b \\geq a$, allora $a = b$.',
				trans: 'Transitiva: sì, da $a \\geq b$ e $b \\geq c$ segue $a \\geq c$.',
			},
		},
		{
			code: 'diverso', dom: 'N', cond: '$a \\neq b$',
			mem: (a, b) => a !== b,
			fact: (a, b) => falseIf(`${a} \\neq ${b}`, a !== b),
			why: { sim: 'Simmetrica: sì, da $a \\neq b$ segue $b \\neq a$.' },
		},
		{
			code: 'ultima-cifra', dom: 'N', cond: '$a$ e $b$ hanno la stessa ultima cifra',
			mem: (a, b) => a % 10 === b % 10,
			fact: (a, b) =>
				a % 10 === b % 10
					? `${a} \\text{ e } ${b} \\text{ finiscono tutti e due con } ${a % 10}`
					: `${a} \\text{ finisce con } ${a % 10}\\text{, } ${b} \\text{ con } ${b % 10}`,
			why: {
				rifl: 'Riflessiva: sì, ogni numero ha la stessa ultima cifra di sé stesso.',
				sim: 'Simmetrica: sì, se $a$ ha la stessa ultima cifra di $b$, anche $b$ ha la stessa ultima cifra di $a$.',
				trans: 'Transitiva: sì, se $a$ e $b$ finiscono con la stessa cifra, e $b$ e $c$ anche, allora $a$ e $c$ finiscono con la stessa cifra.',
			},
		},
		{
			code: 'valore-assoluto', dom: 'Z', cond: '$|a| = |b|$',
			mem: (a, b) => Math.abs(a) === Math.abs(b),
			fact: (a, b) => `|${a}| = ${Math.abs(a)}\\text{, } |${b}| = ${Math.abs(b)}`,
			why: {
				rifl: 'Riflessiva: sì, $|a| = |a|$ per ogni $a$.',
				sim: 'Simmetrica: sì, da $|a| = |b|$ segue $|b| = |a|$.',
				trans: 'Transitiva: sì, da $|a| = |b|$ e $|b| = |c|$ segue $|a| = |c|$.',
			},
		},
		{
			code: 'divisore-n', dom: 'N0', cond: '$a$ è un divisore di $b$',
			mem: (a, b) => b % a === 0,
			fact: (a, b) => (b % a === 0 ? `${b} = ${a} \\cdot ${b / a}` : `\\text{non c'è un naturale } q \\text{ con } ${b} = ${a} \\cdot q`),
			why: {
				rifl: 'Riflessiva: sì, perché $a = a \\cdot 1$.',
				anti: 'Antisimmetrica: sì. Se $b = a \\cdot q$ e $a = b \\cdot p$, allora $a = a \\cdot q \\cdot p$, quindi $q \\cdot p = 1$: tra i naturali $q = p = 1$, e $a = b$.',
				trans: 'Transitiva: sì. Se $b = a \\cdot q$ e $c = b \\cdot p$, allora $c = a \\cdot (q \\cdot p)$.',
			},
		},
		{
			code: 'divisore-z', dom: 'Z0', cond: '$a$ è un divisore di $b$',
			mem: (a, b) => b % a === 0,
			fact: (a, b) => (b % a === 0 ? `${b} = ${p0(a)} \\cdot ${p0(b / a)}` : `\\text{non c'è un intero } q \\text{ con } ${b} = ${p0(a)} \\cdot q`),
			why: {
				rifl: 'Riflessiva: sì, perché $a = a \\cdot 1$.',
				trans: 'Transitiva: sì. Se $b = a \\cdot q$ e $c = b \\cdot p$, allora $c = a \\cdot (q \\cdot p)$.',
			},
		},
		{
			code: 'multiplo-n', dom: 'N0', cond: '$a$ è un multiplo di $b$',
			mem: (a, b) => a % b === 0,
			fact: (a, b) => (a % b === 0 ? `${a} = ${b} \\cdot ${a / b}` : `\\text{non c'è un naturale } q \\text{ con } ${a} = ${b} \\cdot q`),
			why: {
				rifl: 'Riflessiva: sì, perché $a = a \\cdot 1$.',
				anti: 'Antisimmetrica: sì. Se $a = b \\cdot q$ e $b = a \\cdot p$, allora $q \\cdot p = 1$: tra i naturali $q = p = 1$, e $a = b$.',
				trans: 'Transitiva: sì. Se $a = b \\cdot q$ e $b = c \\cdot p$, allora $a = c \\cdot (p \\cdot q)$.',
			},
		},
	];
	for (const k of [2, 3])
		rels.push({
			code: `volte-${k}`, dom: 'N', cond: `$b = ${k}a$`,
			mem: (a, b) => b === k * a,
			fact: (a, b) => (b === k * a ? `${b} = ${k} \\cdot ${a}` : `${b} \\neq ${k} \\cdot ${a}`),
			why: { anti: `Antisimmetrica: sì. Se $b = ${k}a$ e $a = ${k}b$, allora $a = ${k * k}a$, quindi $a = 0$ e anche $b = 0$: i due elementi sono lo stesso.` },
		});
	for (const k of [1, 2, 3])
		rels.push({
			code: `vicini-${k}`, dom: 'N', cond: `$a$ e $b$ differiscono al massimo di $${k}$`,
			mem: (a, b) => Math.abs(a - b) <= k,
			fact: (a, b) => {
				const [hi, lo] = a >= b ? [a, b] : [b, a];
				return `${hi} - ${lo} = ${hi - lo} ${hi - lo <= k ? '\\leq' : '>'} ${k}`;
			},
			why: {
				rifl: 'Riflessiva: sì, ogni numero differisce da sé stesso di $0$.',
				sim: 'Simmetrica: sì, la differenza tra $a$ e $b$ è la stessa che tra $b$ e $a$.',
			},
		});
	for (const t of [6, 8, 10, 12])
		rels.push({
			code: `somma-${t}`, dom: 'N', cond: `$a + b = ${t}$`,
			mem: (a, b) => a + b === t,
			fact: (a, b) => `${a} + ${b} = ${a + b}${a + b === t ? '' : ` \\neq ${t}`}`,
			why: { sim: 'Simmetrica: sì, perché $a + b = b + a$.' },
		});
	for (const n of [2, 3, 4, 5])
		rels.push({
			code: `resto-${n}`, dom: 'N', cond: `$a$ e $b$ hanno lo stesso resto nella divisione per $${n}$`,
			mem: (a, b) => a % n === b % n,
			fact: (a, b) => `\\text{i resti di } ${a} \\text{ e } ${b} \\text{ nella divisione per } ${n} \\text{ sono } ${a % n} \\text{ e } ${b % n}`,
			why: {
				rifl: 'Riflessiva: sì, ogni numero ha lo stesso resto di sé stesso.',
				sim: 'Simmetrica: sì, se $a$ ha lo stesso resto di $b$, anche $b$ ha lo stesso resto di $a$.',
				trans: 'Transitiva: sì, se $a$ ha lo stesso resto di $b$ e $b$ lo stesso di $c$, allora $a$ e $c$ hanno lo stesso resto.',
			},
		});
	return rels;
}

export const WORD_RELS = wordRels();
const wordRel = (code: string) => WORD_RELS.find((w) => w.code === code);
const numMem = (w: WordRel): Mem => (a, b) => w.mem(Number(a), Number(b));

const truthCache = new Map<string, boolean>();
function wordTruth(w: WordRel, p: Prop): boolean {
	const k = `${w.code}/${p}`;
	let v = truthCache.get(k);
	if (v === undefined) {
		v = holdsOn(p, DOM_WINDOW[w.dom].map(String), numMem(w));
		truthCache.set(k, v);
	}
	return v;
}

const wordProblem = (w: WordRel) => textBlock(`${DOM_INTRO[w.dom]} considera la relazione $a ${REL} b$ se ${w.cond}.`);

function build3(rng: Rng): { w: WordRel; p: Prop; q: PropQuestion } {
	const p = rng.pick(PROPS);
	const want = rng.next() < 0.5;
	const cands = WORD_RELS.filter((w) => wordTruth(w, p) === want);
	for (let t = 0; t < 50; t++) {
		const w = rng.pick(cands);
		const q = propQuestion(rng, p, DOM_POOL[w.dom].map(String), numMem(w), claimTexRule, true, true, false);
		if (q) return { w, p, q };
	}
	throw new Error(`${ID}: level 3 not built`);
}

function factStep(w: WordRel, a: E, b: E): string {
	const inIt = w.mem(Number(a), Number(b));
	return `${pairTex(a, b)} ${inIt ? IN_R : NOT_IN_R} \\text{, perché } ${w.fact(Number(a), Number(b))}`;
}

function wordSteps(w: WordRel, p: Prop, q: PropQuestion): string[] {
	const name = PROP_NAME[p];
	if (!q.witness) return [`\\text{${w.why[p]}}`, `\\text{Quindi } ${RN} \\text{ è ${name}.}`];
	const cl = q.witness;
	const out: string[] = ['\\text{Per dire che una proprietà non vale basta un controesempio.}'];
	if (cl.t === 'rifl') out.push(factStep(w, cl.a, cl.a) + '\\text{.}');
	else if (cl.t === 'sim') out.push(factStep(w, cl.a, cl.b) + '\\text{;}', factStep(w, cl.b, cl.a) + '\\text{.}');
	else if (cl.t === 'anti') out.push(factStep(w, cl.a, cl.b) + '\\text{;}', factStep(w, cl.b, cl.a) + '\\text{;}', `\\text{ma } ${cl.a} \\neq ${cl.b}\\text{.}`);
	else if (cl.t === 'trans') out.push(factStep(w, cl.a, cl.b) + '\\text{;}', factStep(w, cl.b, cl.c) + '\\text{;}', factStep(w, cl.a, cl.c) + '\\text{.}');
	out.push(`\\text{Quindi } ${RN} \\text{ non è ${name}.}`);
	return out;
}

// ---------------------------------------------------------------------------
// Level 4: classes and quotient set of a finite equivalence

const PARTITIONS: number[][] = [[2, 1], [3], [2, 1, 1], [2, 2], [3, 1], [2, 1, 1, 1], [2, 2, 1], [3, 1, 1]];

function classesOf(r: Rel): E[][] {
	const out: E[][] = [];
	const seen = new Set<E>();
	for (const a of r.A) {
		if (seen.has(a)) continue;
		const cls = r.A.filter((x) => has(r, x, a));
		cls.forEach((x) => seen.add(x));
		out.push(cls);
	}
	return out;
}

function relFromClasses(A: E[], classes: E[][]): Rel {
	const R = new Set<string>();
	for (const c of classes) for (const a of c) for (const b of c) R.add(key(a, b));
	return { A, R };
}

const sortBy = (A: E[], xs: E[]) => [...xs].sort((a, b) => A.indexOf(a) - A.indexOf(b));
/** Classes sorted inside and by their first element. */
const canonPartition = (A: E[], cls: E[][]) => cls.map((c) => sortBy(A, c)).sort((x, y) => A.indexOf(x[0]) - A.indexOf(y[0]));
const partitionTex = (A: E[], cls: E[][]) => `\\{${canonPartition(A, cls).map((c) => setTex(c)).join(',\\ ')}\\}`;
const partitionOption = (A: E[], cls: E[][]): ChoiceOption => ({ latex: partitionTex(A, cls), values: ['Q', ...canonPartition(A, cls).map((c) => c.join(','))] });
const elementsOption = (A: E[], xs: E[], tag = 'C'): ChoiceOption => ({ latex: setTex(sortBy(A, xs)), values: [tag, ...sortBy(A, xs)] });

function assemble4(rng: Rng, correct: ChoiceOption, cands: ChoiceOption[]): ChoiceAnswer | null {
	const opts = [correct];
	for (const o of cands) if (opts.length < 4 && !opts.some((x) => x.values.join('|') === o.values.join('|'))) opts.push(o);
	if (opts.length < 4) return null;
	const order = shuffle(rng, [0, 1, 2, 3]);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

interface Built4 {
	r: Rel;
	classes: E[][];
	ask: 'quoziente' | 'classe';
	k: E;
	choice: ChoiceAnswer;
}

function build4(rng: Rng): Built4 {
	for (;;) {
		const sizes = rng.pick(PARTITIONS);
		const n = sizes.reduce((s, x) => s + x, 0);
		const A = makeA(rng, n);
		const perm = shuffle(rng, A);
		const classes: E[][] = [];
		let at = 0;
		for (const s of sizes) {
			classes.push(sortBy(A, perm.slice(at, at + s)));
			at += s;
		}
		const r = relFromClasses(A, classes);
		if (r.R.size > 11) continue;
		const big = classes.filter((c) => c.length >= 2);
		const ask = rng.next() < 0.6 ? 'quoziente' : 'classe';
		if (ask === 'quoziente') {
			const cands: ChoiceOption[] = [elementsOption(A, A, 'E')];
			const moves: E[][][] = [];
			if (classes.length >= 2) {
				const [i, j] = pickDistinct(rng, range(0, classes.length - 1), 2);
				moves.push(classes.filter((_, t) => t !== i && t !== j).concat([[...classes[i], ...classes[j]]]));
			}
			if (big.length) {
				const c = rng.pick(big);
				const x = rng.pick(c);
				moves.push(classes.filter((d) => d !== c).concat([[x], c.filter((y) => y !== x)]));
				if (classes.length >= 2) {
					const other = rng.pick(classes.filter((d) => d !== c));
					moves.push(classes.filter((d) => d !== c && d !== other).concat([c.filter((y) => y !== x), [...other, x]]));
				}
			}
			moves.push(A.map((a) => [a]));
			for (const m of shuffle(rng, moves)) cands.push(partitionOption(A, m));
			const choice = assemble4(rng, partitionOption(A, classes), cands);
			if (choice) return { r, classes, ask, k: A[0], choice };
		} else {
			const cls = big.length && rng.next() < 0.85 ? rng.pick(big) : rng.pick(classes);
			const k = rng.pick(cls);
			const others = classes.filter((c) => c !== cls);
			const cands: ChoiceOption[] = [];
			if (cls.length >= 2) cands.push(elementsOption(A, [k]), elementsOption(A, cls.filter((x) => x !== k)));
			if (others.length) cands.push(elementsOption(A, [...cls, ...rng.pick(others)]), elementsOption(A, rng.pick(others)));
			cands.push(elementsOption(A, A));
			const choice = assemble4(rng, elementsOption(A, cls), shuffle(rng, cands));
			if (choice) return { r, classes, ask, k, choice };
		}
	}
}

function steps4(b: Built4): string[] {
	const out: string[] = [];
	const A = b.r.A;
	const cls = canonPartition(A, b.classes);
	if (b.ask === 'classe') {
		const c = cls.find((x) => x.includes(b.k))!;
		out.push(`\\text{Le coppie con secondo elemento } ${elTex(b.k)} \\text{ sono } ${pairsInline(c.map((x) => [x, b.k]))}\\text{.}`);
		out.push(`\\text{La classe contiene ${c.length === 1 ? 'solo ' : ''}gli elementi in relazione con } ${elTex(b.k)}\\text{, compreso } ${elTex(b.k)} \\text{ stesso: } [${elTex(b.k)}] = ${setTex(c)}\\text{.}`);
		return out;
	}
	for (const c of cls) {
		const a = c[0];
		out.push(
			c.length === 1
				? `${elTex(a)} \\text{ è in relazione solo con sé stesso: } [${elTex(a)}] = ${setTex(c)}\\text{.}`
				: `${elTex(a)} \\text{ è in relazione con } ${elsInline(c)}\\text{: } [${elTex(a)}] = ${setTex(c)}\\text{.}`,
		);
	}
	out.push(`\\text{Ogni elemento sta in una sola classe. L'insieme quoziente ha per elementi le classi: } A/${RN} = ${partitionTex(A, b.classes)}\\text{.}`);
	return out;
}

// ---------------------------------------------------------------------------
// Level 5: same remainder in the division by n

type Variant5 = 'classe' | 'appartiene' | 'quante' | 'rappresentante';

interface Built5 {
	variant: Variant5;
	n: number;
	m: number;
	k: number;
	choice: ChoiceAnswer;
}

const numSetOption = (xs: number[]): ChoiceOption => {
	const s = [...new Set(xs)].sort((a, b) => a - b).map(String);
	return { latex: s.length > 6 ? listTex(s, true) : `\\{${s.join(', ')}\\}`, values: ['C', ...s] };
};
const classOption = (c: number): ChoiceOption => ({ latex: `[${c}]`, values: ['r', String(c)] });
const countOption = (c: number): ChoiceOption => ({ latex: String(c), values: ['n', String(c)] });
const INFINITE: ChoiceOption = { latex: '\\text{infinite}', values: ['inf'] };
const numberOption = (x: number): ChoiceOption => ({ latex: String(x), values: ['x', String(x)] });

function build5(rng: Rng): Built5 {
	const u = rng.next();
	const variant: Variant5 = u < 0.4 ? 'classe' : u < 0.6 ? 'appartiene' : u < 0.75 ? 'quante' : 'rappresentante';
	for (;;) {
		if (variant === 'classe') {
			const n = rng.int(2, 5);
			const m = rng.int(10, 15);
			const k = rng.next() < 0.7 ? rng.int(n, Math.min(m, 3 * n + 2)) : rng.int(0, n - 1);
			const inA = (f: (x: number) => boolean) => range(0, m).filter(f);
			const cls = inA((x) => x % n === k % n);
			const cands: ChoiceOption[] = [];
			if (k >= n) cands.push(numSetOption(inA((x) => x >= k && x % n === k % n)));
			cands.push(numSetOption(inA((x) => x % n === (k + 1) % n)));
			if (k >= 2) cands.push(numSetOption(inA((x) => x > 0 && x % k === 0)));
			cands.push(numSetOption(inA((x) => x % n === 0)));
			cands.push(numSetOption(cls.filter((x) => x !== k)));
			const choice = assemble4(rng, numSetOption(cls), cands.filter((o) => o.values.length > 1));
			if (choice) return { variant, n, m, k, choice };
		} else if (variant === 'appartiene') {
			const n = rng.int(4, 5);
			const k = rng.int(20, 79);
			const r = k % n, q = Math.floor(k / n);
			if (q % n === r) continue;
			const others = shuffle(rng, range(0, n - 1).filter((c) => c !== r && c !== q % n));
			const choice = assemble4(rng, classOption(r), [classOption(q), ...others.map(classOption)]);
			if (choice) return { variant, n, m: 0, k, choice };
		} else if (variant === 'quante') {
			const n = rng.int(2, 5);
			const choice = assemble4(rng, countOption(n), shuffle(rng, [INFINITE, countOption(n + 1), countOption(n - 1)]));
			if (choice) return { variant, n, m: 0, k: 0, choice };
		} else {
			const n = rng.int(2, 5);
			const r = rng.int(0, n - 1);
			const x = n * rng.int(3, 15) + r;
			const cands = shuffle(rng, [x + 1, x - 1, x + 2, x + n + 1, n * r + 10 * (r + 1), 10 * r + (r + 1)]).filter((y) => y > 0 && y !== x && mod(y, n) !== r);
			const choice = assemble4(rng, numberOption(x), cands.map(numberOption));
			if (choice) return { variant, n, m: 0, k: r, choice };
		}
	}
}

function problem5(b: Built5): { prompt: string; problem: string } {
	const cond = `$a ${REL} b$ se $a$ e $b$ hanno lo stesso resto nella divisione per $${b.n}$`;
	switch (b.variant) {
		case 'classe':
			return {
				prompt: 'Trova la classe di equivalenza indicata.',
				problem: textBlock(`In $A = \\{0, 1, 2, \\ldots, ${b.m}\\}$ considera la relazione ${cond}.`, 46, [`[${b.k}] = \\ ?`]),
			};
		case 'appartiene':
			return {
				prompt: 'Trova la classe di equivalenza a cui appartiene il numero.',
				problem: textBlock(`In $\\mathbb{N}$ considera la relazione ${cond}.`, 46, [`${b.k} \\in \\ ?`]),
			};
		case 'quante':
			return {
				prompt: "Quanti elementi ha l'insieme quoziente?",
				problem: textBlock(`In $\\mathbb{N}$ considera la relazione ${cond}.`, 46, [`|\\mathbb{N}/${RN}| = \\ ?`]),
			};
		case 'rappresentante':
			return {
				prompt: 'Quale numero è un rappresentante della classe indicata?',
				problem: textBlock(`In $\\mathbb{N}$ considera la relazione ${cond}.`, 46, [`\\ ? \\in [${b.k}]`]),
			};
	}
}

const division = (x: number, n: number) => `${x} = ${n} \\cdot ${Math.floor(x / n)}${x % n ? ` + ${x % n}` : ''}`;

function steps5(b: Built5): string[] {
	const n = b.n;
	switch (b.variant) {
		case 'classe': {
			const r = b.k % n;
			const cls = range(0, b.m).filter((x) => x % n === r);
			return [
				b.k >= n ? `${division(b.k, n)}\\text{: il resto di } ${b.k} \\text{ è } ${r}\\text{.}` : `${b.k} < ${n}\\text{: il resto di } ${b.k} \\text{ è } ${b.k} \\text{ stesso.}`,
				`\\text{La classe contiene tutti gli elementi di } A \\text{ con resto } ${r}\\text{, anche quelli minori di } ${b.k}\\text{: si parte da } ${r} \\text{ e si aggiunge } ${n} \\text{ ogni volta.}`,
				`[${b.k}] = ${`\\{${cls.join(', ')}\\}`}`,
			];
		}
		case 'appartiene': {
			const r = b.k % n;
			return [
				`${division(b.k, n)}\\text{: il resto è } ${r}\\text{.}`,
				`\\text{La classe si riconosce dal resto, non dal quoziente } ${Math.floor(b.k / n)}\\text{: } ${b.k} \\in [${r}]\\text{.}`,
			];
		}
		case 'quante':
			return [
				`\\text{Nella divisione per } ${n} \\text{ il resto può essere solo } ${elsInline(range(0, n - 1).map(String))}\\text{.}`,
				`\\text{Le classi sono } ${elsInline(range(0, n - 1).map((c) => `[${c}]`))}\\text{: nomi come } [${n}] \\text{ o } [${2 * n}] \\text{ indicano classi già contate.}`,
				`|\\mathbb{N}/${RN}| = ${n}`,
			];
		case 'rappresentante': {
			const x = Number(b.choice.options[b.choice.correct].values[1]);
			const others = b.choice.options.filter((_, i) => i !== b.choice.correct).map((o) => Number(o.values[1]));
			return [
				`\\text{Un rappresentante di } [${b.k}] \\text{ è un numero che diviso per } ${n} \\text{ dà resto } ${b.k}\\text{.}`,
				...others.map((y) => `${division(y, n)}\\text{: resto } ${y % n}\\text{, no.}`),
				`${division(x, n)}\\text{: resto } ${b.k}\\text{, quindi } ${x} \\in [${b.k}]\\text{.}`,
			];
		}
	}
}

// ---------------------------------------------------------------------------
// Level 6: order relations

type Cat = 'LT' | 'LP' | 'ST' | 'SP' | 'NO';
const CATS: Cat[] = ['LT', 'LP', 'ST', 'SP', 'NO'];
const CAT_TEX: Record<Cat, string> = {
	LT: '\\text{ordine largo totale}',
	LP: '\\text{ordine largo parziale}',
	ST: '\\text{ordine stretto totale}',
	SP: '\\text{ordine stretto parziale}',
	NO: '\\text{non è una relazione d\'ordine}',
};

function totalOn(r: Rel): boolean {
	return r.A.every((a) => r.A.every((b) => a === b || has(r, a, b) || has(r, b, a)));
}

function categoryOf(r: Rel): Cat {
	if (!holds('anti', r) || !holds('trans', r)) return 'NO';
	const wide = holds('rifl', r), strict = irrefl(r);
	if (!wide && !strict) return 'NO';
	return `${wide ? 'L' : 'S'}${totalOn(r) ? 'T' : 'P'}` as Cat;
}

type Rule6 = 'le' | 'lt' | 'ge' | 'gt' | 'div' | 'divs' | 'sube' | 'sub' | 'absle';
const RULE_TEXT: Record<Rule6, string> = {
	le: `$a ${REL} b$ se $a \\leq b$`,
	lt: `$a ${REL} b$ se $a < b$`,
	ge: `$a ${REL} b$ se $a \\geq b$`,
	gt: `$a ${REL} b$ se $a > b$`,
	div: `$a ${REL} b$ se $a$ è un divisore di $b$`,
	divs: `$a ${REL} b$ se $a$ è un divisore di $b$ e $a \\neq b$`,
	sube: `$X ${REL} Y$ se $X \\subseteq Y$`,
	sub: `$X ${REL} Y$ se $X \\subset Y$`,
	absle: `$a ${REL} b$ se $|a| \\leq |b|$`,
};

const subsetEls = (e: E) => (e.length > 2 ? e.slice(1, -1).split(',') : []);
function ruleMem(rule: Rule6, a: E, b: E): boolean {
	if (rule === 'sube' || rule === 'sub') {
		const x = subsetEls(a), y = subsetEls(b);
		const inc = x.every((v) => y.includes(v));
		return rule === 'sube' ? inc : inc && x.length < y.length;
	}
	const x = Number(a), y = Number(b);
	switch (rule) {
		case 'le':
			return x <= y;
		case 'lt':
			return x < y;
		case 'ge':
			return x >= y;
		case 'gt':
			return x > y;
		case 'div':
			return y % x === 0;
		case 'divs':
			return y % x === 0 && x !== y;
		case 'absle':
			return Math.abs(x) <= Math.abs(y);
	}
	return false;
}

function relFromRule(rule: Rule6, A: E[]): Rel {
	const R = new Set<string>();
	for (const a of A) for (const b of A) if (ruleMem(rule, a, b)) R.add(key(a, b));
	return { A, R };
}

const numsA = (xs: number[]) => [...xs].sort((a, b) => a - b).map(String);
const CHAINS = [[1, 2, 4, 8], [1, 3, 9], [1, 2, 4], [2, 4, 8, 16], [1, 5, 25], [1, 3, 9, 27], [3, 6, 12]];
const DIVISOR_SETS = [[1, 2, 3, 6], [1, 2, 5, 10], [1, 3, 5, 15], [1, 2, 7, 14], [1, 2, 3, 4, 6], [2, 3, 6, 12], [1, 2, 4, 5, 10], [1, 2, 3, 9], [2, 4, 6, 12]];
const SUB_CHAINS = [['{}', '{1}', '{1,2}'], ['{1}', '{1,2}', '{1,2,3}'], ['{}', '{2}', '{1,2}'], ['{}', '{1}', '{1,2}', '{1,2,3}']];
const SUB_PARTIAL = [['{}', '{1}', '{2}', '{1,2}'], ['{1}', '{2}', '{1,2}'], ['{}', '{1}', '{2}'], ['{1}', '{2}', '{3}', '{1,2}']];
const SIGNED = [[-2, -1, 1, 2], [-3, -1, 1, 3], [-2, 1, 2, 4], [-1, 1, 2, 3], [-4, -2, 2, 4]];

function randomNums(rng: Rng): E[] {
	return numsA(pickDistinct(rng, range(1, 12), rng.int(3, 5)));
}

/** A random order on A: a strict one, closed under transitivity, with or without the loops. */
function randomOrder(rng: Rng, A: E[], total: boolean, wide: boolean): Rel {
	const perm = shuffle(rng, A);
	const R = new Set<string>();
	for (let i = 0; i < A.length; i++) for (let j = i + 1; j < A.length; j++) if (total || rng.next() < 0.5) R.add(key(perm[i], perm[j]));
	for (const k of transRounds({ A, R }).flat()) R.add(k);
	if (wide) for (const a of A) R.add(key(a, a));
	return { A, R };
}

interface Built6 {
	r: Rel;
	cat: Cat;
	rule: Rule6 | null;
	choice: ChoiceAnswer;
}

function build6(rng: Rng): Built6 {
	const cat = rng.pick(CATS);
	for (;;) {
		let r: Rel;
		let rule: Rule6 | null = null;
		if (rng.next() < 0.5) {
			// A rule on a small set, as in the lesson.
			let A: E[];
			const u = rng.int(0, 2);
			if (cat === 'LT' || cat === 'ST') {
				const wide = cat === 'LT';
				if (u === 0) {
					rule = rng.pick(wide ? (['le', 'ge'] as Rule6[]) : (['lt', 'gt'] as Rule6[]));
					A = randomNums(rng);
				} else if (u === 1) {
					rule = wide ? 'div' : 'divs';
					A = numsA(rng.pick(CHAINS));
				} else {
					rule = wide ? 'sube' : 'sub';
					A = rng.pick(SUB_CHAINS);
				}
			} else if (cat === 'LP' || cat === 'SP') {
				const wide = cat === 'LP';
				if (u < 2) {
					rule = wide ? 'div' : 'divs';
					A = numsA(rng.pick(DIVISOR_SETS));
				} else {
					rule = wide ? 'sube' : 'sub';
					A = rng.pick(SUB_PARTIAL);
				}
			} else {
				rule = rng.pick(['div', 'absle'] as Rule6[]);
				A = numsA(rng.pick(SIGNED));
			}
			r = relFromRule(rule, A);
		} else {
			const A = makeA(rng, rng.int(3, 4));
			if (cat !== 'NO') r = randomOrder(rng, A, cat[1] === 'T', cat[0] === 'L');
			else {
				const base = randomOrder(rng, A, rng.next() < 0.5, rng.next() < 0.6);
				const R = new Set(base.R);
				const nl = nonLoops(base);
				const u = rng.int(0, 2);
				if (u === 0 && nl.length) {
					const [a, b] = unkey(rng.pick(nl));
					R.add(key(b, a));
				} else if (u === 1) {
					const short = paths(base).map(([a, , c]) => key(a, c)).filter((k) => !unkey(k).every((x, i, xs) => x === xs[0]));
					if (!short.length) continue;
					R.delete(rng.pick(short));
				} else {
					const a = rng.pick(A);
					if (R.has(key(a, a))) R.delete(key(a, a));
					else R.add(key(a, a));
				}
				r = { A, R };
			}
		}
		if (categoryOf(r) !== cat || r.R.size > 10 || r.R.size < 2) continue;
		// Three of the other four categories: the one farthest from the answer is left out.
		const far: Record<Cat, Cat | null> = { LT: 'SP', SP: 'LT', LP: 'ST', ST: 'LP', NO: null };
		const drop = far[cat] ?? rng.pick(CATS.filter((c) => c !== cat));
		const shown = CATS.filter((c) => c !== drop);
		const choice: ChoiceAnswer = { kind: 'choice', options: shown.map((c) => ({ latex: CAT_TEX[c], values: [c] })), correct: shown.indexOf(cat) };
		return { r, cat, rule, choice };
	}
}

function problem6(b: Built6): string {
	if (!b.rule) return givens(b.r);
	return `\\begin{array}{l} A = ${setTex(b.r.A)} \\\\ \\text{${RULE_TEXT[b.rule]}} \\end{array}`;
}

function steps6(b: Built6): string[] {
	const r = b.r;
	const out: string[] = [];
	if (b.rule) out.push(`\\text{Le coppie di } ${RN} \\text{ sono } ${pairsInline(sortedKeys(r.A, r.R).map(unkey))}\\text{.}`);
	const loops = r.A.filter((a) => has(r, a, a));
	if (loops.length === r.A.length) out.push(`\\text{C'è il cappio su ogni elemento: } ${RN} \\text{ è riflessiva.}`);
	else if (!loops.length) out.push(`\\text{Non c'è nessun cappio: } ${RN} \\text{ è antiriflessiva.}`);
	else {
		const miss = r.A.find((a) => !has(r, a, a))!;
		out.push(`\\text{C'è il cappio } ${pairTex(loops[0], loops[0])} \\text{ ma manca } ${pairTex(miss, miss)}\\text{: } ${RN} \\text{ non è né riflessiva né antiriflessiva.}`);
	}
	out.push(propStep('anti', r));
	out.push(propStep('trans', r));
	if (b.cat === 'NO') {
		out.push(`\\text{Quindi } ${RN} \\text{ non è una relazione d'ordine.}`);
		return out;
	}
	const kind = b.cat[0] === 'L' ? 'largo' : 'stretto';
	const pair = r.A.flatMap((a) => r.A.map((c) => [a, c] as [E, E])).find(([a, c]) => a !== c && !has(r, a, c) && !has(r, c, a));
	if (pair) out.push(`${elTex(pair[0])} \\text{ e } ${elTex(pair[1])} \\text{ non sono confrontabili: nessuna delle due coppie } ${pairTex(pair[0], pair[1])} \\text{ e } ${pairTex(pair[1], pair[0])} \\text{ sta in } ${RN}\\text{.}`);
	else out.push(`\\text{Due elementi diversi sono sempre confrontabili: l'ordine è totale.}`);
	out.push(`\\text{Quindi } ${RN} \\text{ è una relazione d'ordine ${kind} ${pair ? 'parziale' : 'totale'}.}`);
	return out;
}

// ---------------------------------------------------------------------------
// Level 7: the fewest pairs to add

type Target = 'rifl' | 'sim' | 'trans' | 'equiv';
const TARGET_WORD: Record<Target, string> = { rifl: 'riflessiva', sim: 'simmetrica', trans: 'transitiva', equiv: 'di equivalenza' };

function additions(r: Rel, t: Target): string[] {
	if (t === 'rifl') return reflAdd(r);
	if (t === 'sim') return symAdd(r);
	if (t === 'trans') return transRounds(r).flat();
	const rs = withPairs(r, [...reflAdd(r), ...symAdd(r)]);
	return [...reflAdd(r), ...symAdd(r), ...transRounds(rs).flat()].filter((k, i, xs) => xs.indexOf(k) === i);
}

function pairsOption(A: E[], ks: string[]): ChoiceOption {
	const s = sortedKeys(A, new Set(ks));
	const items = s.map((k) => pairTex(...unkey(k)));
	const rows = chunk(items, 3).map((r) => r.join(', '));
	const latex = rows.length === 1 ? `\\{${rows[0]}\\}` : `\\begin{gathered} \\Big\\{${rows.join(', \\\\ ')}\\Big\\} \\end{gathered}`;
	return { latex, values: ['P', ...s] };
}

interface Built7 {
	r: Rel;
	target: Target;
	add: string[];
	choice: ChoiceAnswer;
}

function build7(rng: Rng): Built7 {
	const u = rng.next();
	const target: Target = u < 0.15 ? 'rifl' : u < 0.4 ? 'sim' : u < 0.7 ? 'trans' : 'equiv';
	for (;;) {
		const A = makeA(rng, rng.int(3, 4));
		const r = randomRelation(rng, A);
		if (r.R.size < 2 || r.R.size > 6) continue;
		const add = additions(r, target);
		if (add.length < 1 || add.length > (target === 'rifl' ? 4 : 5)) continue;
		if (target === 'trans' && nonLoops(r).length < 2) continue;
		if (target !== 'rifl' && nonLoops(r).length === 0) continue;
		const all = A.flatMap((a) => A.map((b) => key(a, b)));
		const minus = (xs: string[], ys: string[]) => xs.filter((k) => !ys.includes(k));
		const uniq = (xs: string[]) => xs.filter((k, i) => xs.indexOf(k) === i);
		const cands: string[][] = [];
		const cappi = add.filter((k) => unkey(k)[0] === unkey(k)[1]);
		if (target === 'rifl') {
			if (add.length >= 2) cands.push(add.filter((k) => k !== rng.pick(add)));
			if (symAdd(r).length) cands.push(uniq([...add, ...symAdd(r)]), symAdd(r));
		} else if (target === 'sim') {
			if (reflAdd(r).length) cands.push(uniq([...add, ...reflAdd(r)]));
			if (add.length >= 2) cands.push(add.filter((k) => k !== rng.pick(add)));
			const eq = additions(r, 'equiv');
			cands.push(eq);
		} else if (target === 'trans') {
			const rounds = transRounds(r);
			if (rounds.length > 1) cands.push(rounds[0]);
			if (cappi.length) cands.push(minus(add, cappi));
			if (symAdd(r).length) cands.push(symAdd(r), uniq([...add, ...symAdd(r)]));
		} else {
			cands.push(uniq([...reflAdd(r), ...symAdd(r)]));
			if (reflAdd(r).length) cands.push(minus(add, reflAdd(r)));
			const tr = transRounds(r).flat();
			if (tr.length) cands.push(tr);
		}
		if (add.length >= 2) cands.push(add.filter((k) => k !== rng.pick(add)));
		const extra = minus(minus(all, [...r.R]), add);
		if (extra.length) cands.push([...add, rng.pick(extra)]);
		const options = cands.filter((c) => c.length > 0 && c.length <= 6).map((c) => pairsOption(A, c));
		const choice = assemble4(rng, pairsOption(A, add), options);
		if (choice) return { r, target, add: sortedKeys(A, new Set(add)), choice };
	}
}

function steps7(b: Built7): string[] {
	const r = b.r;
	const out: string[] = [];
	const cappiStep = (rr: Rel) => {
		const m = reflAdd(rr).map(unkey);
		if (m.length) out.push(`\\text{Per la riflessiva ${m.length === 1 ? 'manca il cappio' : 'mancano i cappi'} } ${pairsInline(m)}\\text{.}`);
		else out.push(`\\text{I cappi ci sono già tutti.}`);
	};
	const symStep = (rr: Rel) => {
		const m = sortedKeys(rr.A, symAdd(rr)).map(unkey);
		if (m.length) out.push(`\\text{Per la simmetrica serve il ritorno di ogni freccia: } ${pairsInline(m)}\\text{.}`);
		else out.push(`\\text{Ogni freccia ha già il ritorno.}`);
	};
	const transStep = (rr: Rel) => {
		const rounds = transRounds(rr);
		let cur = rr;
		rounds.forEach((unsorted, i) => {
			const round = sortedKeys(rr.A, unsorted);
			const why = round.map((k) => {
				const [a, c] = unkey(k);
				const b = cur.A.find((x) => has(cur, a, x) && has(cur, x, c))!;
				return `${elTex(a)} \\to ${elTex(b)} \\to ${elTex(c)}`;
			});
			out.push(
				`\\text{${i === 0 ? 'Percorsi' : 'Con le coppie nuove, altri percorsi'} senza scorciatoia: } ${why.join('\\text{, }')}\\text{; servono } ${pairsInline(round.map(unkey))}\\text{.}`,
			);
			cur = withPairs(cur, round);
		});
		if (!rounds.length) out.push(`\\text{Ogni percorso di due frecce ha già la scorciatoia.}`);
		else if (rounds.length) out.push(`\\text{Ora ogni percorso di due frecce ha la scorciatoia.}`);
	};
	if (b.target === 'rifl') cappiStep(r);
	else if (b.target === 'sim') symStep(r);
	else if (b.target === 'trans') {
		out.push(`\\text{Per ogni percorso } a \\to b \\to c \\text{ serve la scorciatoia } (a, c)\\text{; se } c = a \\text{, la scorciatoia è un cappio.}`);
		transStep(r);
	} else {
		cappiStep(r);
		symStep(r);
		transStep(withPairs(r, [...reflAdd(r), ...symAdd(r)]));
	}
	out.push(`\\text{Le coppie da aggiungere sono } ${pairsInline(b.add.map(unkey))}\\text{: nessuna si può togliere.}`);
	return out;
}

// ---------------------------------------------------------------------------
// Assemble

const choiceSolution = (ch: ChoiceAnswer) => ch.options[ch.correct].latex;

function assemble(rng: Rng, level: number): Sample {
	const base = { generatorId: ID, level, seed: rng.seed };
	const rParams = (r: Rel) => ({ A: r.A, R: sortedKeys(r.A, r.R) });
	switch (level) {
		case 1: {
			const b = build1(rng);
			const name = PROP_NAME[b.p];
			return {
				...base,
				prompt: `Stabilisci se la relazione nell'insieme A è ${name}.`,
				problem: givens(b.r),
				solution: b.q.witness ? `${RN} \\text{ non è ${name}}` : `${RN} \\text{ è ${name}}`,
				steps: oneProp(b.p, b.r, b.q.witness),
				answer: b.q.choice,
				params: { ...rParams(b.r), prop: b.p, case: `${b.p}-${b.q.holds ? 'si' : 'no'}` },
			};
		}
		case 2: {
			const { r, pr } = build2(rng);
			const k = profileKey(pr);
			const cands = profileDistractors(rng, r, pr);
			const opts = [profileOption(k), ...cands.map(profileOption)];
			const order = shuffle(rng, [0, 1, 2, 3]);
			const choice: ChoiceAnswer = { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
			return {
				...base,
				prompt: 'Quali proprietà ha la relazione tra riflessiva, simmetrica, antisimmetrica e transitiva? Scegli l\'elenco completo.',
				problem: givens(r),
				solution: k ? `${RN} \\text{ è ${PROPS.filter((p) => pr[p]).map((p) => PROP_NAME[p]).join(', ')}}` : `${RN} \\text{ non ha nessuna delle quattro proprietà}`,
				steps: [...PROPS.map((p) => propStep(p, r))],
				answer: choice,
				params: { ...rParams(r), profile: k, case: k || 'nessuna' },
			};
		}
		case 3: {
			const { w, p, q } = build3(rng);
			const name = PROP_NAME[p];
			return {
				...base,
				prompt: `Stabilisci se la relazione è ${name}. Se non lo è, scegli un controesempio.`,
				problem: wordProblem(w),
				solution: q.witness ? `${RN} \\text{ non è ${name}}` : `${RN} \\text{ è ${name}}`,
				steps: wordSteps(w, p, q),
				answer: q.choice,
				params: { rel: w.code, dom: w.dom, prop: p, case: `${p}-${q.holds ? 'si' : 'no'}` },
			};
		}
		case 4: {
			const b = build4(rng);
			const quot = b.ask === 'quoziente';
			return {
				...base,
				prompt: quot ? "La relazione nell'insieme A è di equivalenza. Trova l'insieme quoziente." : "La relazione nell'insieme A è di equivalenza. Trova la classe di equivalenza indicata.",
				problem: `\\begin{array}{l} ${givens(b.r)} \\\\ ${quot ? `A/${RN}` : `[${elTex(b.k)}]`} = \\ ? \\end{array}`,
				solution: `${quot ? `A/${RN}` : `[${elTex(b.k)}]`} = ${choiceSolution(b.choice)}`,
				steps: steps4(b),
				answer: b.choice,
				params: { ...rParams(b.r), ask: b.ask, k: b.k, classes: canonPartition(b.r.A, b.classes), case: b.ask },
			};
		}
		case 5: {
			const b = build5(rng);
			const { prompt, problem } = problem5(b);
			const sol = choiceSolution(b.choice);
			const solution =
				b.variant === 'classe' ? `[${b.k}] = ${sol}` : b.variant === 'appartiene' ? `${b.k} \\in ${sol}` : b.variant === 'quante' ? `|\\mathbb{N}/${RN}| = ${sol}` : `${sol} \\in [${b.k}]`;
			return {
				...base,
				prompt,
				problem,
				solution,
				steps: steps5(b),
				answer: b.choice,
				params: { variant: b.variant, n: String(b.n), m: String(b.m), k: String(b.k), case: b.variant },
			};
		}
		case 6: {
			const b = build6(rng);
			return {
				...base,
				prompt: "Stabilisci se la relazione nell'insieme A è d'ordine: largo o stretto, totale o parziale.",
				problem: problem6(b),
				solution: b.cat === 'NO' ? `${RN} \\text{ non è una relazione d'ordine}` : `${RN} \\text{ è un } ${CAT_TEX[b.cat]}`,
				steps: steps6(b),
				answer: b.choice,
				params: { ...rParams(b.r), rule: b.rule, source: b.rule ? 'regola' : 'elenco', case: b.cat },
			};
		}
		case 7: {
			const b = build7(rng);
			return {
				...base,
				prompt: `Aggiungi alla relazione il minor numero possibile di coppie perché diventi ${TARGET_WORD[b.target]}. Quali coppie aggiungi?`,
				problem: givens(b.r),
				solution: `\\text{Si aggiungono } ${choiceSolution(b.choice)}`,
				steps: steps7(b),
				answer: b.choice,
				params: { ...rParams(b.r), target: b.target, add: b.add, case: b.target },
			};
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Checks

function relFromParams(p: Record<string, unknown>): Rel | null {
	if (!Array.isArray(p.A) || !Array.isArray(p.R)) return null;
	return { A: p.A as E[], R: new Set(p.R as string[]) };
}

/** Is this option right, recomputed from params? null if the option cannot be read. */
function optionRight(sample: Sample, o: ChoiceOption): boolean | null {
	const p = sample.params;
	const v = o.values;
	switch (sample.level) {
		case 1:
		case 3: {
			const prop = p.prop as Prop;
			let m: Mem, pool: E[];
			if (sample.level === 1) {
				const r = relFromParams(p);
				if (!r) return null;
				m = memOf(r);
				pool = r.A;
			} else {
				const w = wordRel(String(p.rel));
				if (!w) return null;
				m = numMem(w);
				pool = DOM_WINDOW[w.dom].map(String);
			}
			if (v[0] === 'si') return holdsOn(prop, pool, m);
			const cl = claimFromValues(v);
			if (!cl) return null;
			const kind = cl.t === 'cappio' ? 'anti' : cl.t;
			if (kind !== prop) return null;
			return claimValid(cl, m);
		}
		case 2: {
			const r = relFromParams(p);
			if (!r) return null;
			const k = profileKey(profileOf(r));
			return (v[0] === 'nessuna' ? '' : v.join('')) === k;
		}
		case 4: {
			const r = relFromParams(p);
			if (!r) return null;
			if (p.ask === 'quoziente') return v[0] === 'Q' && JSON.stringify(v.slice(1)) === JSON.stringify(canonPartition(r.A, classesOf(r)).map((c) => c.join(',')));
			const k = String(p.k);
			return v[0] === 'C' && JSON.stringify(v.slice(1)) === JSON.stringify(sortBy(r.A, r.A.filter((x) => has(r, x, k))));
		}
		case 5: {
			const n = Number(p.n), m = Number(p.m), k = Number(p.k);
			switch (p.variant) {
				case 'classe':
					return v[0] === 'C' && v.slice(1).join(',') === range(0, m).filter((x) => x % n === k % n).join(',');
				case 'appartiene':
					return v[0] === 'r' && mod(Number(v[1]), n) === k % n;
				case 'quante':
					return v[0] === 'n' && Number(v[1]) === n;
				case 'rappresentante':
					return v[0] === 'x' && mod(Number(v[1]), n) === k;
			}
			return null;
		}
		case 6: {
			const r = relFromParams(p);
			if (!r) return null;
			return v[0] === categoryOf(r);
		}
		case 7: {
			const r = relFromParams(p);
			if (!r) return null;
			const add = sortedKeys(r.A, new Set(additions(r, p.target as Target)));
			return v[0] === 'P' && v.slice(1).join('|') === add.join('|');
		}
	}
	return null;
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const ans = sample.answer;
	if (!sample.steps.length) v.push('nessun passaggio');
	if (ans.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
	if (ans.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(ans.options.map((o) => o.values.join('|'))).size !== ans.options.length) v.push('opzioni ripetute');
	if (new Set(ans.options.map((o) => o.latex)).size !== ans.options.length) v.push('opzioni con lo stesso testo');
	const right = ans.options.map((o) => optionRight(sample, o));
	if (right.some((x) => x === null)) v.push('opzione non leggibile');
	if (right.filter((x) => x === true).length !== 1) v.push(`opzioni giuste: ${right.filter((x) => x === true).length}`);
	if (right[ans.correct] !== true) v.push("l'opzione indicata come giusta non lo è");
	const r = relFromParams(p);
	switch (sample.level) {
		case 1:
			if (!r || r.A.length < 3 || r.A.length > 4 || r.R.size < 3 || r.R.size > 8) v.push('insieme di 3-4 elementi, relazione di 3-8 coppie');
			break;
		case 2:
			if (!r || r.A.length < 3 || r.A.length > 4 || r.R.size < 3 || r.R.size > 9) v.push('insieme di 3-4 elementi, relazione di 3-9 coppie');
			break;
		case 3: {
			const w = wordRel(String(p.rel));
			if (!w || !w.why) v.push('relazione sconosciuta');
			else if (wordTruth(w, p.prop as Prop) && !w.why[p.prop as Prop]) v.push('manca la giustificazione');
			break;
		}
		case 4:
			if (!r || !PROPS.every((q) => q === 'anti' || holds(q, r)) || r.R.size > 11) v.push('la relazione deve essere di equivalenza, al massimo 11 coppie');
			break;
		case 6:
			if (!r || r.R.size > 10) v.push('al massimo 10 coppie');
			else if (p.rule && sortedKeys(r.A, relFromRule(p.rule as Rule6, r.A).R).join('|') !== (p.R as string[]).join('|')) v.push('coppie diverse dalla regola');
			if (p.case !== (r ? categoryOf(r) : null)) v.push('categoria sbagliata');
			break;
		case 7:
			if (!r || r.R.size > 6) v.push('al massimo 6 coppie');
			break;
	}
	return v;
}

export const relazioniEquivalenzaOrdine: Generator = {
	id: ID,
	title: "Relazioni di equivalenza e d'ordine",
	levels: {
		1: { label: 'Una proprietà di una relazione data con le coppie', constraints: ['A di 3-4 elementi, 3-8 coppie', 'riflessiva, simmetrica, antisimmetrica o transitiva, sì o no metà e metà', 'il "no" si risponde con la coppia mancante o il controesempio'] },
		2: { label: 'Le quattro proprietà insieme', constraints: ['A di 3-4 elementi, 3-9 coppie', "si sceglie l'elenco completo delle proprietà", 'i profili possibili con la stessa frequenza'] },
		3: { label: 'Relazioni in ℕ e ℤ date a parole', constraints: ['29 relazioni: prodotti, somme, <, ≤, divisibilità, ultima cifra, |a| = |b|, stesso resto', 'il controesempio con numeri piccoli'] },
		4: { label: 'Classi di equivalenza e insieme quoziente', constraints: ['relazione di equivalenza su 3-5 elementi, al massimo 11 coppie', "l'insieme quoziente o la classe di un elemento"] },
		5: { label: 'Stesso resto nella divisione per n', constraints: ['n da 2 a 5', 'la classe [k] in {0, ..., m}, a quale classe appartiene k, quante classi, un rappresentante'] },
		6: { label: "Relazioni d'ordine: largo o stretto, totale o parziale", constraints: ['regole della lezione (≤, <, divisore, ⊆, ⊂) o elenchi di coppie', 'le cinque risposte con la stessa frequenza'] },
		7: { label: 'Le coppie da aggiungere', constraints: ['riflessiva, simmetrica, transitiva o di equivalenza', 'da 1 a 5 coppie da aggiungere'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 200; attempt++) {
			const sample = assemble(rng, level);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice: (sample: Sample): ChoiceAnswer => {
		if (sample.answer.kind !== 'choice') throw new Error(`${ID}: every level is multiple choice`);
		return sample.answer;
	},
};

export default relazioniEquivalenzaOrdine;
