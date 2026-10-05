/**
 * La selezione a due vie. Spec: specs/exercises/inf-selezione-due-vie.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/57-inf-selezione-due-vie.md). The selection of
 * every exercise is one of four families (v2/inf-sel.ts): a one-way selection that changes a value, a two-way
 * selection on a threshold, even or odd, the larger of two numbers. It is written once, in the language of the
 * flowcharts, and shown as a chart, as a program in Python and in C++, or left to the student to build or write.
 *
 * 1. what an `if` writes; 2. what an `if ... else` writes; 3. the program that does what the task says; 4. the
 * flowchart of a program; 5. build the flowchart; 6. write the program.
 */
import type { Rng } from '../types';
import { chartAnswer, chartOption, choose, codeOption, codes, makeGenerator, output, programAnswer, type Built } from '../inf-programmi';
import { QUESTION_WIDTH, chartWidth, chartable, fits, followed, larger, mistakes, oneWay, paramsOf, parity, program, reading, said, sound, tariff, tt, twoWay, writtenChoice, type Sel } from '../inf-sel';

export const ID = 'inf-selezione-due-vie';

/** A selection with two blocks: mostly a threshold, sometimes a remainder or the larger of two numbers. */
function twoBlocks(rng: Rng): Sel {
	const r = rng.next();
	return r < 0.3 ? twoWay(rng) : r < 0.55 ? tariff(rng) : r < 0.8 ? parity(rng) : larger(rng);
}

/** Any selection of the lesson. */
const any = (rng: Rng): Sel => (rng.next() < 0.3 ? oneWay(rng) : twoBlocks(rng));

/** A selection whose chart, and those of its mistakes, fit an option on a phone: no long texts on two branches. */
function narrow(rng: Rng): Sel {
	const r = rng.next();
	return r < 0.4 ? oneWay(rng) : r < 0.8 ? tariff(rng) : larger(rng);
}

/** The input a "che cosa scrive" is asked on: half of the times the boundary value. */
function probe(rng: Rng, s: Sel): { inputs: number[]; where: 'confine' | 'altrove' } {
	const onEdge = (t: number[]) => s.edge.some((e) => e.join(',') === t.join(','));
	if (rng.next() < 0.5) return { inputs: rng.pick(s.edge), where: 'confine' };
	return { inputs: rng.pick(s.tests.filter((t) => !onEdge(t))), where: 'altrove' };
}

function level1(rng: Rng): Built {
	const s = oneWay(rng);
	const { inputs, where } = probe(rng, s);
	const written = output(s.source, inputs)!;
	const taken = written.length > 1 || written[0] !== String(inputs[0]);
	return {
		prompt: 'Segui il programma una riga alla volta.',
		problem: `Che cosa scrive questo programma ${reading(inputs)}?`,
		code: codes(s.source, inputs),
		solution: said(written),
		steps: [...followed(s, inputs), taken ? 'Le righe del blocco vengono eseguite, una dopo l\'altra.' : 'Le righe del blocco vengono saltate.', `L'ultima riga è fuori dal blocco e viene eseguita in tutti i casi: il programma scrive ${said(written)}.`],
		answer: writtenChoice(rng, s, inputs),
		params: paramsOf(s, { case: where, tests: [inputs], input: inputs })
	};
}

function level2(rng: Rng): Built {
	const s = twoBlocks(rng);
	const { inputs, where } = probe(rng, s);
	const written = output(s.source, inputs)!;
	// a chart with a long text on each branch is wider than the column of a phone: those are shown as programs
	const chart = chartWidth(s.source) <= QUESTION_WIDTH && rng.next() < 0.6;
	const yes = followed(s, inputs).at(-1)!.endsWith('vera.');
	return {
		prompt: chart ? 'Segui il diagramma un blocco alla volta.' : 'Segui il programma una riga alla volta.',
		problem: `Che cosa scrive questo ${chart ? 'diagramma' : 'programma'} ${reading(inputs)}?`,
		...(chart ? { chart: s.source } : { code: codes(s.source, inputs) }),
		solution: said(written),
		steps: [...followed(s, inputs), yes ? (chart ? 'Si prende il ramo del sì.' : "Viene eseguito il blocco dell'if e quello dell'else viene saltato.") : chart ? 'Si prende il ramo del no.' : "Il blocco dell'if viene saltato e viene eseguito quello dell'else.", `Dei due blocchi ne viene eseguito sempre uno solo: scrive ${said(written)}.`],
		answer: writtenChoice(rng, s, inputs),
		params: paramsOf(s, { case: where, tests: [inputs], input: inputs, shown: chart ? 'chart' : 'code' })
	};
}

/** Why the right program is the right one: where its condition comes from, and a run on the boundary value. */
function reasons(s: Sel, what: 'programma' | 'diagramma'): string[] {
	const edge = s.edge[0];
	return [
		s.why,
		`Controlla con una prova: ${reading(edge)} il ${what} giusto scrive ${said(output(s.source, edge)!)}.`,
		what === 'programma' ? 'Poi controlla quali righe stanno nel blocco, e quindi dipendono dalla condizione, e quali ne sono fuori.' : 'Poi controlla quali blocchi stanno su un ramo del rombo e quali dopo il punto in cui i rami si riuniscono.'
	];
}

function level3(rng: Rng): Built {
	const s = any(rng);
	return {
		prompt: 'Scegli il programma giusto.',
		problem: `Quale programma ${s.task}?`,
		solution: `Il programma con la condizione ${tt(s.conds[0])} e ogni istruzione nel suo blocco.`,
		steps: reasons(s, 'programma'),
		solutionCode: codes(s.source, s.tests[0]),
		answer: choose(
			rng,
			codeOption(s.source, s.tests[0]),
			mistakes(rng, s).map((w) => codeOption(w, s.tests[0]))
		),
		params: paramsOf(s)
	};
}

function level4(rng: Rng): Built {
	const s = narrow(rng);
	const oneBlock = s.family === 'una-via';
	return {
		prompt: 'Riconosci nel diagramma le righe del programma.',
		problem: 'Quale diagramma di flusso corrisponde a questo programma?',
		code: codes(s.source, s.tests[0]),
		solution: `Il diagramma con ${tt(s.conds[0])} nel rombo e le istruzioni sugli stessi rami.`,
		steps: [
			`La riga dell'if diventa un rombo con la stessa condizione, ${tt(s.conds[0])}.`,
			oneBlock ? 'Le righe del blocco stanno sul ramo del sì; il ramo del no è vuoto e scende dritto.' : "Il blocco dell'if sta sul ramo del sì, quello dell'else sul ramo del no.",
			oneBlock ? "La riga che viene dopo il blocco sta sotto il punto in cui i due rami si riuniscono: viene eseguita in tutti i casi." : 'I due rami si riuniscono prima della fine: a ogni esecuzione se ne percorre uno solo.'
		],
		solutionChart: s.source,
		answer: choose(rng, chartOption(s.source), mistakes(rng, s, 3, fits).map(chartOption)),
		params: paramsOf(s)
	};
}

function level5(rng: Rng): Built {
	const s = any(rng);
	return {
		prompt: 'Costruisci il diagramma di flusso.',
		problem: `Costruisci il diagramma di un algoritmo che ${s.task}.`,
		solution: `Un diagramma con la lettura, un rombo con la condizione ${tt(s.conds[0])} e le istruzioni sui rami giusti.`,
		steps: reasons(s, 'diagramma'),
		solutionChart: s.source,
		answer: chartAnswer(s.source, s.tests),
		// four charts where they fit a phone, four programs where the texts on the branches make the charts too wide
		choice: chartable(s)
			? choose(rng, chartOption(s.source), mistakes(rng, s, 3, fits).map(chartOption))
			: choose(
					rng,
					codeOption(s.source, s.tests[0]),
					mistakes(rng, s).map((w) => codeOption(w, s.tests[0]))
				),
		params: paramsOf(s)
	};
}

function level6(rng: Rng): Built {
	const s = any(rng);
	return {
		prompt: 'Scrivi il programma.',
		problem: `Scrivi un programma che ${s.task}. Le letture ci sono già.`,
		solution: `Un programma con la selezione sulla condizione ${tt(s.conds[0])}.`,
		steps: reasons(s, 'programma'),
		solutionCode: codes(s.source, s.tests[0]),
		answer: programAnswer(s.source, s.tests, program(s.reads, [])),
		choice: choose(
			rng,
			codeOption(s.source, s.tests[0]),
			mistakes(rng, s).map((w) => codeOption(w, s.tests[0]))
		),
		params: paramsOf(s)
	};
}

export default makeGenerator(ID, 'La selezione a due vie', {
	1: { label: 'Che cosa scrive un if', constraints: ['a one-way selection', 'the input is the boundary value half of the times', 'four different outputs'], build: level1, check: sound },
	2: { label: 'Che cosa scrive un if-else', constraints: ['a two-way selection, shown as a program or as a chart', 'the input is the boundary value half of the times'], build: level2, check: sound },
	3: { label: 'Dalla consegna al programma', constraints: ['four programs that write different things on the tests', 'rows of at most 34 columns'], build: level3, check: sound },
	4: { label: 'Dal programma al diagramma', constraints: ['four charts that write different things on the tests'], build: level4, check: sound },
	5: { label: 'Costruire il diagramma di una selezione', constraints: ['graded by running the chart on both branches and on the boundary value'], build: level5, check: sound },
	6: { label: 'Scrivere una selezione', constraints: ['graded by running the program on both branches and on the boundary value'], build: level6, check: sound }
});
