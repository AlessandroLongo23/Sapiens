/**
 * Selezioni annidate e a più vie. Spec: specs/exercises/inf-selezione-multipla.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/59-inf-selezione-multipla.md). Every exercise is a
 * cascade (v2/inf-sel.ts): a selection in the "no" of another, for three ways (above, below or exactly zero; which
 * of two numbers is the larger; three bands of a value) or four (four bands). The site writes a cascade as an `if`
 * inside an `else`, not with `elif` / `else if`: that is the form the programs of these exercises have.
 *
 * A chart with two selections is too wide for a phone, as an option and under a question too (see CHART_SHARE):
 * the chart is asked for, in level 5, and shown with its solution; the options are programs.
 *
 * 1. follow two nested selections; 2. what a cascade on thresholds writes; 3. what a cascade with the conditions
 * in the wrong order, or with an `if` on every row, really writes; 4. the program that does what the task says;
 * 5. complete the flowchart; 6. write the program.
 */
import type { Rng } from '../types';
import { chartAnswer, choose, codeOption, codes, makeGenerator, output, programAnswer, type Built } from '../inf-programmi';
import { bands, duel, followed, mistakes, paramsOf, program, reading, said, say, sign, sound, ticket, truth, tt, writtenChoice, type Cascade } from '../inf-sel';

export const ID = 'inf-selezione-multipla';

/** A cascade of three ways on thresholds: bands with texts, or the price of a ticket. */
const threeBands = (rng: Rng): Cascade => (rng.next() < 0.7 ? bands(rng, 3) : ticket(rng));

/** Any cascade of three ways. */
function threeWays(rng: Rng): Cascade {
	const r = rng.next();
	return r < 0.5 ? threeBands(rng) : r < 0.75 ? sign(rng) : duel(rng);
}

/**
 * How often level 1 shows the chart instead of the program. Zero: a chart with two selections is about 550 px wide,
 * and on a phone the page cuts it on both sides (the options of the left branch cannot be read). To be raised
 * when the page lets a wide chart scroll from its left edge.
 */
const CHART_SHARE = 0;

const onEdge = (s: Cascade, t: number[]) => s.edge.some((e) => e.join(',') === t.join(','));

function level1(rng: Rng): Built {
	const s = rng.next() < 0.5 ? sign(rng) : duel(rng);
	const inputs = rng.pick(s.tests);
	const written = output(s.source, inputs)!;
	const chart = rng.next() < CHART_SHARE;
	const trace = followed(s, inputs);
	return {
		prompt: chart ? 'Segui il diagramma un rombo alla volta.' : 'Segui il programma una riga alla volta.',
		problem: `Che cosa scrive questo ${chart ? 'diagramma' : 'programma'} ${reading(inputs)}?`,
		...(chart ? { chart: s.source } : { code: codes(s.source, inputs) }),
		solution: said(written),
		steps: [...trace, trace.length === 1 ? 'La prima condizione è vera: la seconda selezione sta nel ramo del no e non viene nemmeno guardata.' : 'La seconda selezione sta nel ramo del no della prima: ci si arriva solo perché la prima condizione è falsa.', `Delle tre strade se ne percorre una sola: scrive ${said(written)}.`],
		answer: writtenChoice(rng, s, inputs),
		params: paramsOf(s, { tests: [inputs], input: inputs, shown: chart ? 'chart' : 'code' })
	};
}

function level2(rng: Rng): Built {
	const s = rng.next() < 0.45 ? bands(rng, 4) : threeBands(rng);
	const edge = rng.next() < 0.6;
	const inputs = rng.pick(s.tests.filter((t) => onEdge(s, t) === edge));
	const written = output(s.source, inputs)!;
	const trace = followed(s, inputs);
	return {
		prompt: 'Controlla le condizioni dall\'alto in basso.',
		problem: `Che cosa scrive questo programma ${reading(inputs)}?`,
		code: codes(s.source, inputs),
		solution: said(written),
		steps: [...trace, truth(s.conds[trace.length - 1], s.reads, inputs) ? 'Alla prima condizione vera il programma esegue il suo blocco e salta tutto il resto, senza guardare le condizioni che seguono.' : "Nessuna condizione è vera: viene eseguito il blocco dell'ultimo else.", `Il programma scrive ${said(written)}.`],
		answer: writtenChoice(
			rng,
			s,
			inputs,
			s.source,
			s.outs.map((o) => [String(o)])
		),
		params: paramsOf(s, { case: edge ? 'confine' : 'altrove', tests: [inputs], input: inputs, ways: s.outs.length })
	};
}

function level3(rng: Rng): Built {
	const s = rng.next() < 0.5 ? bands(rng, 4) : threeBands(rng);
	const r = rng.next();
	const kind = r < 0.4 ? 'ordine' : r < 0.8 ? 'tanti-if' : 'giusto';
	const shown = kind === 'giusto' ? s.source : s.bugs[kind];
	const differs = s.tests.filter((t) => said(output(shown, t)!) !== said(output(s.source, t)!));
	const inputs = rng.pick(differs.length ? differs : s.tests);
	const written = output(shown, inputs)!;
	const meant = output(s.source, inputs)!;
	// the conditions in the order the program shown has them, for the explanation
	const first = (kind === 'ordine' ? [...s.conds].reverse() : s.conds).find((c) => truth(c, s.reads, inputs));
	const steps =
		kind === 'tanti-if'
			? ['Qui ogni if è una selezione a sé: non ci sono else, quindi le condizioni vengono controllate tutte, una dopo l\'altra.', `Con ${s.reads[0]} che vale ${inputs[0]} sono vere ${written.length} condizioni, e il programma esegue il blocco di ognuna.`, `Scrive ${said(written)}, mentre doveva scrivere solo ${said(meant)}: serve una cascata, in cui ogni selezione sta nell'else di quella prima.`]
			: kind === 'ordine'
				? ['Le condizioni si controllano dall\'alto in basso e conta la prima che risulta vera.', `Con ${s.reads[0]} che vale ${inputs[0]} la prima condizione vera è ${tt(first ?? s.conds[0])}: il programma scrive ${said(written)} e salta il resto.`, `Doveva scrivere ${said(meant)}: le soglie vanno messe in ordine, dalla più alta alla più bassa con >=, dalla più bassa alla più alta con <.`]
				: ['Le condizioni si controllano dall\'alto in basso e conta la prima che risulta vera.', first ? `Con ${s.reads[0]} che vale ${inputs[0]} la prima condizione vera è ${tt(first)}.` : `Con ${s.reads[0]} che vale ${inputs[0]} nessuna condizione è vera: si esegue l'ultimo else.`, `Le soglie sono in ordine e il programma fa quello che deve: scrive ${said(written)}.`];
	return {
		prompt: 'Segui il programma così com\'è scritto, non come dovrebbe essere.',
		problem: `Chi ha scritto questo programma voleva che facesse così: ${s.task}. Che cosa scrive davvero ${reading(inputs)}?`,
		code: codes(shown, inputs),
		solution: said(written),
		steps,
		answer: writtenChoice(rng, s, inputs, shown, [meant, ...Object.values(s.bugs).map((b) => output(b, inputs)!), ...s.outs.map((o) => [String(o)])]),
		params: paramsOf(s, { case: kind, source: shown, intended: s.source, tests: [inputs], input: inputs })
	};
}

/** Why the right program is the right one. */
function reasons(s: Cascade, what: 'programma' | 'diagramma'): string[] {
	const edge = s.edge[0];
	return [s.why, `La seconda selezione va nel ramo del no della prima (${what === 'programma' ? "nel blocco dell'else" : 'a destra del primo rombo'}): così delle tre strade se ne percorre sempre una sola.`, `Controlla con una prova: ${reading(edge)} il ${what} giusto scrive ${said(output(s.source, edge)!)}.`];
}

const programs = (rng: Rng, s: Cascade) =>
	choose(
		rng,
		codeOption(s.source, s.tests[0]),
		mistakes(rng, s).map((w) => codeOption(w, s.tests[0]))
	);

function level4(rng: Rng): Built {
	const s = threeWays(rng);
	return {
		prompt: 'Scegli il programma giusto.',
		problem: `Quale programma ${s.task}?`,
		solution: `Il programma che controlla prima ${tt(s.conds[0])} e poi, nell'else, ${tt(s.conds[1])}.`,
		steps: reasons(s, 'programma'),
		solutionCode: codes(s.source, s.tests[0]),
		answer: programs(rng, s),
		params: paramsOf(s)
	};
}

function level5(rng: Rng): Built {
	const s = threeWays(rng);
	// the first test goes down the "no" of the first selection, where the chart to start from is still empty
	const tests = [...s.tests.filter((t) => !truth(s.conds[0], s.reads, t)), ...s.tests.filter((t) => truth(s.conds[0], s.reads, t))];
	const start = program(s.reads, [`se ${s.conds[0]}`, `    ${say(s.outs[0])}`, 'altrimenti']);
	return {
		prompt: 'Completa il diagramma di flusso.',
		problem: `Completa il diagramma di un algoritmo che ${s.task}. Il primo rombo c'è già: metti una seconda selezione nel ramo del no.`,
		solution: `Nel ramo del no del primo rombo, una seconda selezione che chiede ${tt(s.conds[1])}.`,
		steps: reasons(s, 'diagramma'),
		solutionChart: s.source,
		answer: chartAnswer(s.source, tests, start),
		// two selections one beside the other do not fit an option on a phone: the choice is among programs
		choice: programs(rng, s),
		params: paramsOf(s, { tests })
	};
}

function level6(rng: Rng): Built {
	const s = threeWays(rng);
	return {
		prompt: 'Scrivi il programma.',
		problem: `Scrivi un programma che ${s.task}. Le letture ci sono già.`,
		solution: `Un programma che controlla prima ${tt(s.conds[0])} e poi, nell'else, ${tt(s.conds[1])}.`,
		steps: reasons(s, 'programma'),
		solutionCode: codes(s.source, s.tests[0]),
		answer: programAnswer(s.source, s.tests, program(s.reads, [])),
		choice: programs(rng, s),
		params: paramsOf(s)
	};
}

export default makeGenerator(ID, 'Selezioni annidate e a più vie', {
	1: { label: 'Due selezioni annidate', constraints: ['three ways, shown as a program (as a chart when the page can show it)', 'four different outputs'], build: level1, check: sound },
	2: { label: 'Una cascata con le soglie', constraints: ['three or four bands, shown as a program', 'the input is a threshold more than half of the times'], build: level2, check: sound },
	3: { label: "L'ordine delle condizioni", constraints: ['a cascade with the conditions in the wrong order, or with separate ifs, or right', 'the input shows the mistake'], build: level3, check: sound },
	4: { label: 'Dalla consegna alla cascata', constraints: ['four programs of three ways that write different things on the tests', 'at most 9 rows of at most 34 columns'], build: level4, check: sound },
	5: { label: 'Completare il diagramma con due selezioni', constraints: ['graded by running the chart on the three ways and on the boundary values'], build: level5, check: sound },
	6: { label: 'Scrivere una cascata', constraints: ['graded by running the program on the three ways and on the boundary values'], build: level6, check: sound }
});
