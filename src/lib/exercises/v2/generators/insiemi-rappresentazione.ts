/**
 * Rappresentazione degli insiemi. Spec: specs/exercises/insiemi-rappresentazione.md
 *
 * Five levels in the order of the lesson: from a property to the listing with the extremes in ℕ,
 * arithmetic properties (even, multiples, divisors: where 0 goes), ℤ against ℕ, conditions with a
 * calculation (sometimes the empty set), and back from the listing to a property (multiple choice).
 * Levels 1-4 have a `set` answer; the property is in params as JSON-safe strings.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SetAnswer } from '../types';
import {
	type Cond,
	type El,
	type Prop,
	assembleChoice,
	diff,
	endMistakes,
	norm,
	propElements,
	propFromJSON,
	propJSON,
	propTex,
	range,
	range2,
	sameSet,
	setOption,
	setKey,
	setTex,
	shuffle,
	textBlock,
	union,
} from '../insiemi';

export const ID = 'insiemi-rappresentazione';
const MAX_SIZE = 10;

const N = (...conds: Cond[]): Prop => ({ dom: 'N', conds });
const Z = (...conds: Cond[]): Prop => ({ dom: 'Z', conds });

/** The wrong properties a student effectively applies: extremes flipped, 0 forgotten, ℕ and ℤ swapped. */
function variants(p: Prop): Prop[] {
	const out: Prop[] = [];
	const idx = p.conds.findIndex((c) => c.t === 'range');
	if (idx >= 0) {
		const r = p.conds[idx] as Extract<Cond, { t: 'range' }>;
		const withR = (nr: Cond) => ({
			...p,
			conds: p.conds.map((c, i) => (i === idx ? nr : c)),
		});
		if (r.hi !== null) out.push(withR({ ...r, hiStrict: !r.hiStrict }));
		if (r.lo !== null) out.push(withR({ ...r, loStrict: !r.loStrict }));
		if (r.lo !== null && r.hi !== null) out.push(withR({ ...r, loStrict: !r.loStrict, hiStrict: !r.hiStrict }));
	}
	out.push({ ...p, dom: p.dom === 'N' ? 'Z' : 'N' });
	return out;
}

interface Built {
	name: string;
	prop: Prop;
	/** Wrong sets from real mistakes, most likely first. */
	wrong: El[][];
	steps: string[];
	variant: string;
}

const asEls = (xs: number[]): El[] => xs;

function stepsFor(p: Prop, els: number[]): string[] {
	const out: string[] = [];
	out.push(
		p.dom === 'N'
			? '\\text{Gli elementi si prendono da } \\mathbb{N} = \\{0, 1, 2, 3, \\dots\\}\\text{: lo } 0 \\text{ è compreso}'
			: '\\text{Gli elementi si prendono da } \\mathbb{Z}\\text{: ci sono anche i numeri negativi}',
	);
	for (const c of p.conds) {
		if (c.t === 'range') {
			if (c.lo !== null) out.push(`\\text{L'estremo } ${c.lo} \\text{ è ${c.loStrict ? 'escluso' : 'incluso'}}`);
			if (c.hi !== null) out.push(`\\text{L'estremo } ${c.hi} \\text{ è ${c.hiStrict ? 'escluso' : 'incluso'}}`);
		} else if (c.t === 'div') {
			out.push(`\\text{I divisori di } ${c.n} \\text{ dividono } ${c.n} \\text{ senza resto; lo } 0 \\text{ non è un divisore}`);
		} else if (c.t === 'pari' || c.t === 'mult') {
			const k = c.t === 'pari' ? 2 : c.k;
			const word = c.t === 'pari' ? 'pari' : `multiplo di ${k}`;
			if (p.dom === 'N')
				out.push(
					els.includes(0) ? `\\text{Anche } 0 \\text{ è ${word}, perché } 0 = ${k} \\cdot 0` : `\\text{Lo } 0 \\text{ è ${word}, ma la condizione sugli estremi lo esclude}`,
				);
		} else if (c.t === 'lin') {
			out.push(...linSteps(c, p.dom));
		} else if (c.t === 'sq') {
			const r = Math.round(Math.sqrt(c.c));
			if (c.rel === '=' && r * r === c.c)
				out.push(p.dom === 'Z' ? `${r}^2 = ${c.c} \\text{ e anche } (-${r})^2 = ${c.c}` : `${r}^2 = ${c.c}\\text{; } -${r} \\text{ non è un numero naturale}`);
		}
	}
	return out;
}

/** The left side a·x + b of a condition, in LaTeX. */
function condLhs(c: Extract<Cond, { t: 'lin' }>): string {
	return (c.a === 1 ? 'x' : `${c.a}x`) + (c.b === 0 ? '' : c.b > 0 ? ` + ${c.b}` : ` - ${-c.b}`);
}

function linSteps(c: Extract<Cond, { t: 'lin' }>, dom: 'N' | 'Z'): string[] {
	const expr = (x: number) => c.a * x + c.b;
	const lhs = (x: number) => (c.a === 1 ? `${x}` : `${c.a} \\cdot ${x}`) + (c.b === 0 ? '' : c.b > 0 ? ` + ${c.b}` : ` - ${-c.b}`);
	const rel = { '<': '<', '<=': '\\le', '=': '=', '>': '>', '>=': '\\ge' }[c.rel];
	if (c.rel === '=') {
		const x = (c.c - c.b) / c.a;
		const xs = Number.isInteger(x) ? `${x}` : `\\frac{${c.c - c.b}}{${c.a}}`;
		const ok = Number.isInteger(x) && (dom === 'Z' || x >= 0);
		return [
			`\\text{L'unico numero che soddisfa l'uguaglianza è } x = ${xs}`,
			ok ? `${xs} \\in \\mathbb{${dom}}` : `${xs} \\notin \\mathbb{${dom}}\\text{: nessun elemento soddisfa la condizione}`,
		];
	}
	// Try 0, 1, 2, ... until the condition fails (a > 0, so the expression grows), as in the lesson.
	const holds = (v: number) => (c.rel === '<' ? v < c.c : v <= c.c);
	const ok: number[] = [];
	while (ok.length < 40 && holds(expr(ok.length))) ok.push(ok.length);
	const x = ok.length;
	const e = condLhs(c);
	const out: string[] = [];
	if (ok.length === 1) out.push(`x = 0\\text{: } ${lhs(0)} = ${expr(0)} ${rel} ${c.c}`);
	else if (ok.length > 1) out.push(`\\text{per } x = ${ok.join(', ')} \\text{ il valore di } ${e} \\text{ è } ${ok.map(expr).join(', ')}\\text{, tutti } ${rel} ${c.c}`);
	out.push(`\\text{per } x = ${x} \\text{ è } ${lhs(x)} = ${expr(x)}\\text{, che non è } ${rel} ${c.c}\\text{; per } x \\text{ più grandi il valore cresce ancora}`);
	return out;
}

function build(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1: {
			const u = rng.next();
			let prop: Prop, variant: string;
			if (u < 0.25) {
				prop = N(range2(null, false, rng.int(3, 10), true));
				variant = 'x<n';
			} else if (u < 0.45) {
				prop = N(range2(null, false, rng.int(2, 8), false));
				variant = 'x<=n';
			} else {
				const lo = rng.int(0, 8);
				prop = N(range2(lo, rng.int(0, 1) === 1, lo + rng.int(3, 6), rng.int(0, 1) === 1));
				variant = 'a<x<b';
			}
			const els = propElements(prop);
			const wrong = variants(prop)
				.filter((v) => v.dom === 'N')
				.map((v) => asEls(propElements(v)));
			if (els.includes(0)) wrong.unshift(asEls(els.filter((x) => x !== 0)));
			return { name: 'A', prop, wrong, steps: stepsFor(prop, els), variant };
		}
		case 2: {
			const u = rng.next();
			let prop: Prop, variant: string;
			const wrong: El[][] = [];
			if (u < 0.35) {
				const par = rng.int(0, 1) === 1 ? 'pari' : 'dispari';
				const n = rng.int(8, 16);
				const form = rng.int(0, 2);
				const bound = form === 0 ? range2(null, false, n, false) : form === 1 ? range2(1, false, n, false) : range2(rng.int(1, 4), true, n, true);
				prop = N({ t: par }, bound);
				variant = par;
				wrong.push(propElements(N({ t: par === 'pari' ? 'dispari' : 'pari' }, bound)));
			} else if (u < 0.7) {
				const k = rng.int(3, 6);
				const n = k * rng.int(4, 7) + rng.pick([0, 0, 1, 2]);
				const form = rng.int(0, 2);
				const bound = form === 0 ? range2(null, false, n, false) : form === 1 ? range2(1, false, n, false) : range2(null, false, n, true);
				prop = N({ t: 'mult', k }, bound);
				variant = 'multipli';
			} else {
				const n = rng.pick([6, 8, 10, 12, 15, 16, 18, 20, 24, 28, 30, 36]);
				prop = N({ t: 'div', n });
				variant = 'divisori';
				const d = propElements(prop);
				wrong.push(
					union(d, [0]),
					d.filter((x) => x !== n),
					d.filter((x) => x !== 1 && x !== n),
					range(1, n).filter((x) => n % x === 0 && x < n),
				);
			}
			const els = propElements(prop);
			if (els.includes(0)) wrong.unshift(els.filter((x) => x !== 0));
			else if (variant === 'pari' || variant === 'multipli') wrong.unshift(union(els, [0])); // 0 is even and a multiple of k
			wrong.push(
				...variants(prop)
					.filter((v) => v.dom === 'N')
					.map((v) => propElements(v)),
			);
			return { name: 'A', prop, wrong, steps: stepsFor(prop, els), variant };
		}
		case 3: {
			const u = rng.next();
			let prop: Prop, variant: string;
			const wrong: El[][] = [];
			if (u < 0.5) {
				const lo = rng.int(-6, -1),
					hi = rng.int(0, 5);
				prop = Z(range2(lo, rng.int(0, 1) === 1, hi, rng.int(0, 1) === 1));
				variant = 'Z intervallo';
			} else if (u < 0.85) {
				const k = rng.int(1, 6);
				prop = {
					dom: rng.int(0, 1) ? 'Z' : 'N',
					conds: [{ t: 'sq', rel: '=', c: k * k }],
				};
				variant = `quadrato in ${prop.dom}`;
				wrong.push([-k], [k * k], prop.dom === 'Z' ? [0, k] : [-k * k, k * k]);
			} else {
				const lo = rng.int(-5, -1),
					hi = rng.int(2, 6);
				prop = N(range2(lo, rng.int(0, 1) === 1, hi, rng.int(0, 1) === 1));
				variant = 'N con estremo negativo';
			}
			const els = propElements(prop);
			const vs = variants(prop);
			// the other domain first: it is the mistake this level is about
			wrong.unshift(...vs.filter((v) => v.dom !== prop.dom).map((v) => propElements(v)));
			wrong.push(...vs.filter((v) => v.dom === prop.dom).map((v) => propElements(v)));
			return { name: 'A', prop, wrong, steps: stepsFor(prop, els), variant };
		}
		case 4: {
			const u = rng.next();
			let prop: Prop, variant: string;
			const wrong: El[][] = [];
			if (u < 0.65) {
				const a = rng.int(1, 4);
				const b = rng.int(-4, 9);
				const rel = rng.int(0, 2) ? '<' : '<=';
				const size = rng.int(1, 6);
				// the largest element is size - 1: a·(size - 1) + b rel c and a·size + b fails
				const c = rel === '<' ? a * (size - 1) + b + rng.int(1, a) : a * (size - 1) + b + rng.int(0, a - 1);
				if (c < 1) return null;
				prop = N({ t: 'lin', a, b, rel, c });
				variant = 'disuguaglianza';
				wrong.push(propElements(N({ t: 'lin', a, b, rel: rel === '<' ? '<=' : '<', c })));
			} else {
				const a = rng.pick([1, 1, 2, 3]);
				const empty = rng.next() < 0.45;
				let b: number, c: number;
				if (a === 1) {
					b = rng.int(2, 12);
					c = empty ? rng.int(1, b - 1) : rng.int(b, b + 9);
				} else {
					b = 0;
					c = empty ? a * rng.int(1, 6) + rng.int(1, a - 1) : a * rng.int(1, 8);
				}
				prop = N({ t: 'lin', a, b, rel: '=', c });
				variant = empty ? 'equazione vuota' : 'equazione';
				const x = (c - b) / a;
				if (empty) {
					wrong.push(
						Number.isInteger(x) ? [x] : [`${c - b}/${a}`],
						[0],
						[Math.floor(x)].filter((v) => v >= 0),
					);
				} else wrong.push([c], [x + 1], [0, x]);
			}
			const els = propElements(prop);
			if (els.length > MAX_SIZE) return null;
			if (els.includes(0)) wrong.unshift(els.filter((x) => x !== 0));
			return { name: 'A', prop, wrong, steps: stepsFor(prop, els), variant };
		}
		default:
			return null;
	}
}

// ---------------------------------------------------------------------------
// Level 5: from the listing to a property

interface Built5 {
	E: number[];
	options: Prop[];
	correct: number;
	variant: string;
}

function build5(rng: Rng): Built5 | null {
	const u = rng.next();
	let good: Prop;
	let cands: Prop[];
	let variant: string;
	if (u < 0.3) {
		const k = rng.int(2, 6),
			m = rng.int(4, 6);
		const n = k * m;
		good = N({ t: 'mult', k }, range2(1, false, n, false));
		cands = [
			N({ t: 'mult', k }, range2(null, false, n, false)),
			N({ t: 'mult', k }, range2(1, false, n, true)),
			N({ t: 'mult', k: k === 2 ? 4 : 2 * k }, range2(1, false, n, false)),
			N({ t: 'mult', k }, range2(1, false, n + k, false)),
		];
		variant = 'multipli';
	} else if (u < 0.5) {
		const par = rng.int(0, 1) ? 'pari' : 'dispari';
		const lo = rng.int(0, 5),
			hi = lo + rng.int(7, 12);
		good = N({ t: par }, range2(lo, true, hi, true));
		cands = [
			N({ t: par === 'pari' ? 'dispari' : 'pari' }, range2(lo, true, hi, true)),
			N({ t: par }, range2(lo, false, hi, false)),
			N({ t: par }, range2(null, false, hi, true)),
			N({ t: par }, range2(lo, true, hi + 2, true)),
		];
		variant = par;
	} else if (u < 0.7) {
		const lo = rng.int(-5, -1),
			hi = rng.int(0, 4);
		good = Z(range2(lo, true, hi, false));
		cands = [N(range2(lo, true, hi, false)), Z(range2(lo, false, hi, false)), Z(range2(lo, true, hi, true)), Z(range2(lo, true, hi + 1, false))];
		variant = 'interi';
	} else if (u < 0.85) {
		const k = rng.int(1, 5);
		good = Z({ t: 'sq', rel: '=', c: k * k });
		cands = [N({ t: 'sq', rel: '=', c: k * k }), Z({ t: 'sq', rel: '=', c: k }), Z({ t: 'sq', rel: '<=', c: k * k }), Z(range2(-k, false, k, false))];
		variant = 'quadrato';
	} else {
		const n = rng.pick([6, 8, 10, 12, 15, 18, 20]);
		good = N({ t: 'div', n });
		cands = [
			N(range2(1, false, n, false)),
			N({ t: 'div', n: 2 * n }),
			N({ t: 'mult', k: rng.pick([2, 3].filter((k) => n % k === 0)) }, range2(1, false, n, false)),
			N(range2(null, false, n, false)),
		];
		variant = 'divisori';
	}
	const E = propElements(good);
	if (E.length < 2 || E.length > MAX_SIZE) return null;
	const seen = new Set([setKey(E)]);
	const wrong = shuffle(rng, cands).filter((c) => {
		const k = setKey(propElements(c));
		if (seen.has(k)) return false; // same elements as E or as another option
		seen.add(k);
		return true;
	});
	const ch = assembleChoice(rng, propOption(good), wrong.map(propOption));
	if (!ch) return null;
	return {
		E,
		options: ch.options.map((o) => propFromJSON(JSON.parse(o.values[0]))),
		correct: ch.correct,
		variant,
	};
}

const propOption = (p: Prop): ChoiceOption => ({
	latex: propTex(p),
	values: [JSON.stringify(propJSON(p))],
});

// ---------------------------------------------------------------------------
// Sample

function assemble(level: number, seed: number, b: Built): Sample {
	const els = propElements(b.prop);
	const answer: SetAnswer = {
		kind: 'set',
		values: els.map(String),
		latex: `${b.name} = ${setTex(els)}`,
	};
	return {
		generatorId: ID,
		level,
		seed,
		prompt: "Scrivi l'insieme elencando i suoi elementi.",
		problem: `${b.name} = ${propTex(b.prop)}`,
		solution: `${b.name} = ${setTex(els)}`,
		steps: [...b.steps, `${b.name} = ${setTex(els)}`],
		answer,
		params: {
			prop: propJSON(b.prop),
			variant: b.variant,
			wrong: b.wrong.map((w) => norm(w).map(String)),
		},
	};
}

function assemble5(seed: number, b: Built5): Sample {
	const good = b.options[b.correct];
	const choice: ChoiceAnswer = {
		kind: 'choice',
		options: b.options.map(propOption),
		correct: b.correct,
	};
	const steps = b.options.map((p, i) => {
		const els = propElements(p);
		return `${propTex(p)} = ${setTex(els)}${i === b.correct ? '\\text{: sono proprio gli elementi di } E' : `\\text{: } ${describeDiff(els, b.E)}`}`;
	});
	return {
		generatorId: ID,
		level: 5,
		seed,
		prompt: 'Scegli la risposta corretta.',
		problem: textBlock('Quale proprietà caratteristica descrive $E$?', 46, [`E = ${setTex(b.E)}`]),
		solution: `E = ${propTex(good)}`,
		steps,
		answer: choice,
		params: { E: b.E.map(String), variant: b.variant },
	};
}

/** Why a wrong property is wrong, in LaTeX: which elements enter and which are missing. */
function describeDiff(els: number[], E: number[]): string {
	const extra = diff(els, E),
		missing = diff(E, els);
	const parts: string[] = [];
	const list = (xs: El[]) => (xs.length > 5 ? `${xs.slice(0, 3).join(', ')}, \\dots` : xs.join(', '));
	if (extra.length) parts.push(`\\text{${extra.length === 1 ? 'entra anche' : 'entrano anche'} } ${list(extra)}`);
	if (missing.length) parts.push(`\\text{${parts.length ? ' e ' : ''}${missing.length === 1 ? 'manca' : 'mancano'} } ${list(missing)}`);
	return parts.join('');
}

// ---------------------------------------------------------------------------
// Check and choice

function check(sample: Sample): string[] {
	const v: string[] = [];
	if (sample.level === 5) {
		const a = sample.answer;
		if (a.kind !== 'choice' || a.options.length !== 4) return ['livello 5: servono 4 opzioni'];
		const E = (sample.params.E as string[]).map(Number);
		const hits = a.options.map((o) => sameSet(propElements(propFromJSON(JSON.parse(o.values[0]))), E));
		if (hits.filter(Boolean).length !== 1 || !hits[a.correct]) v.push('non c’è esattamente una proprietà giusta');
		if (E.length < 2 || E.length > MAX_SIZE) v.push('E troppo piccolo o troppo grande');
		return v;
	}
	const prop = propFromJSON(sample.params.prop);
	const els = propElements(prop);
	const a = sample.answer;
	if (a.kind !== 'set' || a.values.join(',') !== els.map(String).join(',')) v.push('risposta diversa dagli elementi');
	if (els.length > MAX_SIZE) v.push('troppi elementi');
	const conds = prop.conds.map((c) => c.t);
	switch (sample.level) {
		case 1:
			if (prop.dom !== 'N' || conds.join() !== 'range' || els.length === 0) v.push('livello 1: solo estremi in N, insieme non vuoto');
			break;
		case 2:
			if (prop.dom !== 'N' || !conds.some((t) => ['pari', 'dispari', 'mult', 'div'].includes(t)) || els.length === 0) v.push('livello 2: pari, dispari, multipli o divisori in N');
			break;
		case 3:
			if (sameSet(propElements({ ...prop, dom: 'N' }), propElements({ ...prop, dom: 'Z' }))) v.push('livello 3: N e Z devono dare insiemi diversi');
			break;
		case 4:
			if (prop.dom !== 'N' || conds.join() !== 'lin') v.push('livello 4: una condizione con un calcolo');
			break;
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	if (sample.answer.kind !== 'set') throw new Error(`${ID}: no choice for ${sample.answer.kind}`);
	const truth: El[] = sample.answer.values.map(Number);
	const wrong = ((sample.params.wrong ?? []) as string[][]).map((w) => w.map((x) => (/^-?\d+$/.test(x) ? Number(x) : x)));
	const nums = truth as number[];
	const min = sample.params.prop && (sample.params.prop as { dom: string }).dom === 'Z' ? -Infinity : 0;
	const cands: El[][] = [...wrong.filter((w) => w.length <= 12), ...endMistakes(nums, min), [0], [1], [0, 1]];
	const ch = assembleChoice(rng, setOption(truth), cands.map(setOption));
	if (!ch) throw new Error(`${ID}: not enough distractors for seed ${sample.seed}`);
	return ch;
}

export const insiemiRappresentazione: Generator = {
	id: ID,
	title: 'Rappresentazione degli insiemi',
	levels: {
		1: {
			label: 'Dalla proprietà all’elenco: gli estremi',
			constraints: ['x ∈ ℕ con x < n, x ≤ n oppure a < x < b con ogni estremo incluso o escluso', 'da 1 a 10 elementi'],
		},
		2: {
			label: 'Pari, dispari, multipli, divisori',
			constraints: ['in ℕ, con o senza lo 0 tra gli elementi', 'divisori: lo 0 non è un divisore'],
		},
		3: {
			label: 'ℕ oppure ℤ',
			constraints: ['intervalli in ℤ con estremo negativo, x² = k² in ℕ o in ℤ, intervalli in ℕ con estremo negativo', 'ℕ e ℤ danno insiemi diversi'],
		},
		4: {
			label: 'Condizioni con un calcolo',
			constraints: ['ax + b < c o ≤ c, x + a = b, ax = c in ℕ', 'circa 45 equazioni su 100 danno l’insieme vuoto'],
		},
		5: {
			label: 'Dall’elenco alla proprietà',
			constraints: ['quattro proprietà, una sola dà esattamente E', 'distrattori: 0 dimenticato, estremi, ℕ al posto di ℤ, pari e dispari'],
		},
	},
	generate(rng: Rng, level: number): Sample {
		if (!this.levels[level]) throw new Error(`${ID}: unknown level ${level}`);
		for (let attempt = 0; attempt < 1000; attempt++) {
			let sample: Sample;
			if (level === 5) {
				const b = build5(rng);
				if (!b) continue;
				sample = assemble5(rng.seed, b);
			} else {
				const b = build(rng, level);
				if (!b) continue;
				sample = assemble(level, rng.seed, b);
			}
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default insiemiRappresentazione;
