/**
 * Gli operatori logici. Spec: specs/exercises/inf-operatori-logici.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/58-inf-operatori-logici.md). The programs are
 * two-way selections whose condition is two comparisons joined by E or by O (v2/inf-sel.ts): two values each with
 * its threshold, one value too low or too high, one value that must be one of two, an interval. Conditions in the
 * prose are written as in the flowcharts, with E, O, NON, because a text is the same for the two languages; the
 * programs come out with `and`, `or`, `not` and `&&`, `||`, `!`.
 *
 * 1. truth tables and the value of a compound condition (text); 2. what a program with a compound condition
 * writes, and on which input it writes a given text; 3. the program of an interval; 4. the negation of a
 * condition (text); 5. build the flowchart; 6. write the program.
 */
import type { ChoiceOption, Rng } from '../types';
import { chartAnswer, choose, codeOption, codes, makeGenerator, needing, output, programAnswer, shuffle, textOption, type Built } from '../inf-programmi';
import { JOINS, MIRROR, NEG, SCENES, followed, inputChoice, interval, mistakes, named, oneOfTwo, orderOf, outside, pairOf, paramsOf, program, reading, said, say, se, show, sound, threshold, trueOrFalse, truth, tt, ttOption, withOp, writtenChoice, type Cmp, type Compound, type Op, type Sel } from '../inf-sel';

export const ID = 'inf-operatori-logici';

const plural = (value: boolean) => (value ? 'vere' : 'false');
const NOTATION = 'Le condizioni sono scritte come nei diagrammi, con E, O e NON.';

/** Any selection with two comparisons in its condition. */
function compoundOf(rng: Rng): Compound {
	const r = rng.next();
	return r < 0.3 ? pairOf(rng, ['E']) : r < 0.45 ? pairOf(rng, ['O']) : r < 0.7 ? interval(rng) : r < 0.85 ? outside(rng) : oneOfTwo(rng);
}

/** The value of an expression of E, O, NON over letters that are true or false. */
function evaluate(text: string, env: Record<string, boolean>): boolean {
	const tokens = text.match(/\(|\)|\w+/g) ?? [];
	let at = 0;
	const atom = (): boolean => {
		const t = tokens[at++];
		if (t === 'NON') return !atom();
		if (t === '(') {
			const v = or();
			at++;
			return v;
		}
		return env[t];
	};
	const and = (): boolean => {
		let v = atom();
		while (tokens[at] === 'E') {
			at++;
			v = atom() && v;
		}
		return v;
	};
	const or = (): boolean => {
		let v = and();
		while (tokens[at] === 'O') {
			at++;
			v = and() || v;
		}
		return v;
	};
	return or();
}

const TWO = ['A E B', 'A O B', 'NON A', 'NON B', 'NON A E B', 'A E NON B', 'NON A O B', 'A O NON B', 'NON (A E B)', 'NON (A O B)', 'NON A E NON B', 'NON A O NON B'];
const THREE = ['A O B E C', '(A O B) E C', 'A E B O C', 'A E (B O C)', 'NON A O B E C', 'NON (A O B) E C', 'A O NON B E C', 'A E NON B O C', 'A O B E NON C', '(A O NON B) E C'];

/** Four expressions of `pool` of which exactly one has the value asked for, or null when these values do not give them. */
function oneOfFour(rng: Rng, pool: string[], env: Record<string, boolean>, ask: boolean): { right: string; others: string[] } | null {
	const hits = pool.filter((e) => evaluate(e, env) === ask);
	const misses = pool.filter((e) => evaluate(e, env) !== ask);
	if (!hits.length || misses.length < 3) return null;
	return { right: rng.pick(hits), others: shuffle(rng, misses).slice(0, 3) };
}

const lettersSaid = (env: Record<string, boolean>) =>
	Object.entries(env)
		.map(([name, v]) => `${name} è ${trueOrFalse(v)}`)
		.join(', ');

function table(rng: Rng, three: boolean): Built {
	const names = three ? ['A', 'B', 'C'] : ['A', 'B'];
	for (;;) {
		const env = Object.fromEntries(names.map((name) => [name, rng.next() < 0.5]));
		const ask = rng.next() < 0.6;
		const four = oneOfFour(rng, three ? THREE : TWO, env, ask);
		if (!four) continue;
		// a question on the precedence has among its options an expression where the order of E and O decides
		if (three && ![four.right, ...four.others].some((e) => /^(NON )?A O/.test(e) && evaluate(e, env) !== evaluate(e.replace(/^(NON )?A O (NON )?B/, (m) => `(${m})`), env))) continue;
		return {
			prompt: NOTATION,
			problem: `${lettersSaid(env)}. Quale di queste espressioni è ${trueOrFalse(ask)}?`,
			solution: `${four.right} è ${trueOrFalse(ask)}; le altre tre sono ${plural(!ask)}.`,
			steps: [
				three ? "Prima si calcola NON, poi E, per ultimo O: senza parentesi, l'operatore E lega i suoi due lati prima di O." : 'E è vera solo quando sono veri tutti e due i lati; O è falsa solo quando sono falsi tutti e due; NON rovescia quello che ha davanti, e si calcola per primo.',
				`Metti i valori al posto delle lettere: ${four.right} è ${trueOrFalse(ask)}.`,
				`Le altre tre espressioni, calcolate allo stesso modo, sono ${plural(!ask)}.`
			],
			answer: choose(rng, ttOption(four.right), four.others.map((e) => ttOption(e))),
			params: { case: three ? 'precedenza' : 'tabella', ask, env }
		};
	}
}

function rows(rng: Rng): Built {
	const e = rng.pick(TWO);
	const n = [true, false].flatMap((A) => [true, false].map((B) => evaluate(e, { A, B }))).filter(Boolean).length;
	const label = (k: number) => (k === 1 ? 'in 1 riga' : `in ${k} righe`);
	return {
		prompt: NOTATION,
		problem: `La tabella di verità di ${tt(e)} ha quattro righe, una per ogni combinazione di A e B. In quante righe l'espressione è vera?`,
		solution: label(n),
		steps: ['Le combinazioni sono quattro: vero e vero, vero e falso, falso e vero, falso e falso.', `Calcola ${e} in ognuna delle quattro righe.`, `L'espressione è vera ${label(n)}.`],
		answer: choose(
			rng,
			textOption(label(n), String(n)),
			[1, 3, 2, 4].filter((k) => k !== n).map((k) => textOption(label(k), String(k)))
		),
		params: { case: 'righe', expression: e }
	};
}

/** A compound condition with the comparisons of a selection in place of the letters. */
const dressed = (e: string, parts: [string, string]) => e.replace(/NON ([AB])/g, 'NON ($1)').replace(/[AB]/g, (x) => parts[x === 'A' ? 0 : 1]);

function values(rng: Rng): Built {
	for (;;) {
		const s = compoundOf(rng);
		const inputs = rng.pick(s.tests);
		const env = { A: truth(s.parts[0], s.reads, inputs), B: truth(s.parts[1], s.reads, inputs) };
		const ask = rng.next() < 0.6;
		const four = oneOfFour(rng, TWO, env, ask);
		if (!four) continue;
		const given = s.reads.map((name, i) => `${name} vale ${inputs[i]}`).join(' e ');
		return {
			prompt: NOTATION,
			problem: `In un programma ${given}. Quale di queste condizioni è ${trueOrFalse(ask)}?`,
			solution: `${dressed(four.right, s.parts)} è ${trueOrFalse(ask)}; le altre tre sono ${plural(!ask)}.`,
			steps: [`Calcola prima i due confronti: ${tt(s.parts[0])} è ${trueOrFalse(env.A)}, ${tt(s.parts[1])} è ${trueOrFalse(env.B)}.`, 'Poi applica gli operatori: E vuole veri tutti e due i lati, a O ne basta uno, NON rovescia.', `${dressed(four.right, s.parts)} è ${trueOrFalse(ask)}.`],
			answer: choose(rng, ttOption(dressed(four.right, s.parts)), four.others.map((e) => ttOption(dressed(e, s.parts)))),
			params: { case: 'valori', ask, env: Object.fromEntries(s.reads.map((name, i) => [name, inputs[i]])) }
		};
	}
}

function level1(rng: Rng): Built {
	const r = rng.next();
	return r < 0.3 ? table(rng, false) : r < 0.65 ? values(rng) : r < 0.85 ? table(rng, true) : rows(rng);
}

/** A condition with E and O together and no parentheses: E is worked out first. */
function mixed(rng: Rng): Sel {
	const top = rng.int(8, 9);
	const pass = rng.int(5, 6);
	const n = rng.int(15, 25);
	const make = (cond: string, a = 'promosso', b = 'rimandato') => program(['voto', 'ore'], se(cond, [say(a)], [say(b)]));
	const cond = `voto >= ${top} O voto >= ${pass} E ore >= ${n}`;
	return {
		family: 'precedenza',
		task: '',
		reads: ['voto', 'ore'],
		source: make(cond),
		conds: [cond],
		why: `Senza parentesi E si calcola prima di O: la condizione si legge ${tt(`voto >= ${top} O (voto >= ${pass} E ore >= ${n})`)}.`,
		wrong: [make(`(voto >= ${top} O voto >= ${pass}) E ore >= ${n}`), make(cond, 'rimandato', 'promosso'), make(`voto >= ${top} E voto >= ${pass} O ore >= ${n}`)],
		tests: [
			[top, n - 1],
			[top + 1, n - rng.int(2, 9)],
			[pass, n],
			[pass, n - 1],
			[pass - 1, n],
			[top, n]
		],
		edge: [
			[top, n - 1],
			[pass, n]
		]
	};
}

function level2(rng: Rng): Built {
	const s = rng.next() < 0.2 ? mixed(rng) : compoundOf(rng);
	const shown = { code: codes(s.source, s.tests[0]) };
	const reads2 = s.reads.length === 2;
	if (rng.next() < 0.5) {
		// the text that only one kind of input gives: of the two, the one with three inputs that do not give it
		const texts = shuffle(rng, [...new Set(s.tests.map((t) => output(s.source, t)![0]))]);
		const picked = texts.map((target) => ({ target, answer: inputChoice(rng, s.source, s.tests, target) })).find((x) => x.answer);
		if (picked?.answer) {
			const { target, answer } = picked;
			const right = answer.options[answer.correct].values[0].split(',').map(Number);
			return {
				prompt: 'Prova gli ingressi uno alla volta.',
				problem: `Con quale di questi ingressi il programma scrive "${target}"?${reads2 ? ' I due numeri sono scritti nell\'ordine in cui il programma li legge.' : ''}`,
				...shown,
				solution: `${right.join(' e ')}`,
				steps: [s.why, ...followed(s, right), `Con gli altri tre ingressi il programma scrive ${said(s.tests.map((t) => output(s.source, t)!).find((w) => w[0] !== target)!)}.`],
				answer,
				params: paramsOf(s, { ask: 'ingresso', target })
			};
		}
	}
	const inputs = rng.next() < 0.6 ? rng.pick(s.edge) : rng.pick(s.tests);
	const written = output(s.source, inputs)!;
	return {
		prompt: 'Calcola prima i confronti, poi la condizione intera.',
		problem: `Che cosa scrive questo programma ${reading(inputs)}?`,
		...shown,
		solution: said(written),
		steps: [s.why, ...followed(s, inputs), `Il programma scrive ${said(written)}.`],
		answer: writtenChoice(rng, s, inputs),
		params: paramsOf(s, { ask: 'scrive', tests: [inputs], input: inputs })
	};
}

/** Why the right program is the right one. */
function reasons(s: Sel, what: 'programma' | 'diagramma'): string[] {
	const here = said(output(s.source, s.edge[0])!);
	const across = s.tests.find((t) => said(output(s.source, t)!) !== here)!;
	return [s.why, `Controlla con una prova sul confine: ${reading(s.edge[0])} il ${what} giusto scrive ${here}.`, `Controlla anche un caso che va dall'altra parte: ${reading(across)} deve scrivere ${said(output(s.source, across)!)}.`];
}

const programs = (rng: Rng, s: Sel) =>
	choose(
		rng,
		codeOption(s.source, s.tests[0]),
		mistakes(rng, s).map((w) => codeOption(w, s.tests[0]))
	);

function level3(rng: Rng): Built {
	const s = rng.next() < 0.65 ? interval(rng) : outside(rng);
	return {
		prompt: 'Scegli il programma giusto.',
		problem: `Quale programma ${s.task}?`,
		solution: `Il programma con la condizione ${tt(s.conds[0])}.`,
		steps: reasons(s, 'programma'),
		solutionCode: codes(s.source, s.tests[0]),
		answer: programs(rng, s),
		params: paramsOf(s)
	};
}

const joined = (a: Cmp, j: 'E' | 'O', b: Cmp) => `${show(named(a))} ${j} ${show(named(b))}`;
const not = (c: Cmp) => withOp(c, NEG[c.op]);
/** The comparison turned round with the boundary value on the wrong side: `<` for the contrary of `>`. */
const almostNot = (c: Cmp): Cmp | null => (c.op === '==' || c.op === '!=' ? null : withOp(c, MIRROR[c.op]));

function level4(rng: Rng): Built {
	const prompt = NOTATION;
	if (rng.next() < 0.25) {
		const scene = rng.pick(SCENES);
		const k = threshold(rng, scene);
		const op: Op = rng.next() < 0.15 ? '==' : orderOf(rng, rng.pick(['up', 'down'] as const));
		const cond = (o: Op) => `${scene.v} ${o} ${k}`;
		const others: Op[] = op === '==' ? ['<', '>', '<=', '>='] : [MIRROR[op], NEG[MIRROR[op]], '!=', '=='];
		return {
			prompt,
			problem: `Quale condizione è il contrario di ${tt(cond(op))}, cioè è vera esattamente quando questa è falsa?`,
			solution: cond(NEG[op]),
			steps: [`Chiediti che cosa succede sul valore di confine, ${k}: lì ${tt(cond(op))} è ${trueOrFalse(truth(cond(op), [scene.v], [k]))}, quindi il suo contrario deve essere ${trueOrFalse(!truth(cond(op), [scene.v], [k]))}.`, `Il contrario di ${tt(op)} è ${tt(NEG[op])}: la condizione è ${tt(cond(NEG[op]))}.`],
			answer: choose(rng, ttOption(cond(NEG[op])), others.map((o) => ttOption(cond(o)))),
			params: { case: 'confronto', original: cond(op), names: [scene.v] }
		};
	}
	const s = compoundOf(rng);
	const [a, b] = s.cmps;
	const other = s.join === 'E' ? 'O' : 'E';
	const original = s.conds[0];
	const right = joined(not(a), other, not(b));
	const near = [almostNot(a), almostNot(b)];
	const candidates = [joined(not(a), s.join, not(b)), ...(near[0] && near[1] ? [joined(near[0], other, near[1])] : []), joined(a, other, b), joined(not(a), other, b), joined(a, other, not(b))];
	// the grid of the independent check: around every number of the condition
	const same = (x: string, y: string) => s.tests.every((t) => truth(x, s.reads, t) === truth(y, s.reads, t));
	const wrong = candidates.filter((c) => !same(c, right));
	return {
		prompt,
		problem: `Quale condizione è la negazione di ${tt(original)}, cioè è vera esattamente quando questa è falsa?`,
		solution: right,
		steps: [
			`Per le leggi di De Morgan si nega ogni confronto e si scambia ${s.join} con ${other}.`,
			`Il contrario di ${tt(show(a))} è ${tt(show(named(not(a))))}; il contrario di ${tt(show(b))} è ${tt(show(named(not(b))))}.`,
			`Con ${JOINS[other]} al posto di ${s.join}: ${tt(right)}.`
		],
		answer: choose(rng, ttOption(right), [wrong[0], ...shuffle(rng, wrong.slice(1))].map((c) => ttOption(c))),
		params: { case: s.join === 'E' ? 'e' : 'o', original, names: s.reads }
	};
}

function level5(rng: Rng): Built {
	const s = compoundOf(rng);
	return {
		prompt: 'Costruisci il diagramma di flusso.',
		problem: `Costruisci il diagramma di un algoritmo che ${s.task}. Usa una selezione sola, con una condizione composta.`,
		solution: `Un diagramma con un rombo che chiede ${tt(s.conds[0])}.`,
		steps: reasons(s, 'diagramma'),
		solutionChart: s.source,
		answer: needing(chartAnswer(s.source, s.tests), 'selezione'),
		// a rhombus with two comparisons is too wide for an option on a phone: the choice is among programs
		choice: programs(rng, s),
		params: paramsOf(s)
	};
}

function level6(rng: Rng): Built {
	const s = compoundOf(rng);
	return {
		prompt: 'Scrivi il programma.',
		problem: `Scrivi un programma che ${s.task}. Le letture ci sono già.`,
		solution: `Un programma con una selezione sulla condizione ${tt(s.conds[0])}.`,
		steps: reasons(s, 'programma'),
		solutionCode: codes(s.source, s.tests[0]),
		answer: needing(programAnswer(s.source, s.tests, program(s.reads, [])), 'selezione'),
		choice: programs(rng, s),
		params: paramsOf(s)
	};
}

/** An option that is a text must not be mistaken for the right one: here only that the four differ, the values are checked in Python. */
const texts = (options: ChoiceOption[]) => (options.every((o) => o.text) ? [] : ['an option without its text']);

export default makeGenerator(ID, 'Gli operatori logici', {
	1: { label: 'Tabelle di verità', constraints: ['four expressions or conditions, exactly one with the value asked for'], build: level1, check: (s) => (s.answer.kind === 'choice' ? texts(s.answer.options) : ['not a choice']) },
	2: { label: 'Che cosa scrive con E, O, NON', constraints: ['a two-way selection with a compound condition, shown as a program', 'the input is a boundary value more than half of the times'], build: level2, check: sound },
	3: { label: 'Dentro o fuori da un intervallo', constraints: ['four programs that write different things on the tests', 'rows of at most 34 columns'], build: level3, check: sound },
	4: { label: 'Negare una condizione', constraints: ['four conditions, exactly one true where the original is false and only there'], build: level4, check: (s) => (s.answer.kind === 'choice' ? texts(s.answer.options) : ['not a choice']) },
	5: { label: 'Costruire il diagramma di una condizione composta', constraints: ['graded by running the chart on the four combinations and on the boundary values'], build: level5, check: sound },
	6: { label: 'Scrivere una condizione composta', constraints: ['graded by running the program on the four combinations and on the boundary values'], build: level6, check: sound }
});
