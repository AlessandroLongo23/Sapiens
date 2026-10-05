import { readsOf } from './blocco';
import type { Chart } from './disegno';
import { ChartError, evaluate, namesOf, readValue, showExpression, showValue, textOf, type Value } from './espressione';

/**
 * A flowchart run one block at a time. A `Run` is the whole state after a step, and `advance` returns the next one
 * without touching it, so going back a step is keeping the runs already made.
 */

/** What the last step did, for the line that explains it. */
export type Event =
	| { kind: 'start' }
	| { kind: 'assign'; name: string; shown: string; value: Value }
	| { kind: 'ask'; name: string }
	| { kind: 'input'; name: string; value: Value }
	| { kind: 'output'; text: string }
	| { kind: 'cond'; shown: string; value: boolean }
	| { kind: 'end' };

export type Run = {
	/** The block the run is on: the one just carried out, or the "leggi" that waits for its value. */
	at: number;
	/** The line walked to get here, as `from-branch`. */
	taken: string | null;
	waiting: boolean;
	done: boolean;
	error: string | null;
	variables: Record<string, Value>;
	reads: string[];
	written: string | null;
	output: string[];
	event: Event;
	/** How many values "leggi" has taken so far. */
	asked: number;
	steps: number;
};

/** A loop that never ends is stopped here. */
export const MAX_STEPS = 2000;

export function startRun(): Run {
	return { at: 0, taken: null, waiting: false, done: false, error: null, variables: {}, reads: [], written: null, output: [], event: { kind: 'start' }, asked: 0, steps: 0 };
}

export const canAdvance = (run: Run) => !run.done && !run.error;

/** The next state. On a "leggi" that waits, `typed` is what the student wrote. */
export function advance(chart: Chart, run: Run, typed = ''): Run {
	if (!canAdvance(run)) return run;
	const here = chart.nodes[run.at];
	if (run.waiting) {
		if (here.stmt?.kind !== 'input' || !typed.trim()) return run;
		const value = readValue(typed);
		return { ...run, waiting: false, variables: { ...run.variables, [here.stmt.name]: value }, written: here.stmt.name, event: { kind: 'input', name: here.stmt.name, value }, asked: run.asked + 1 };
	}
	const branch = here.shape === 'decision' ? (run.event.kind === 'cond' && run.event.value ? 'yes' : 'no') : 'next';
	const node = chart.nodes[here[branch]!];
	const next: Run = { ...run, at: node.id, taken: `${here.id}-${branch}`, reads: [], written: null, steps: run.steps + 1 };
	const stmt = node.stmt;
	if (!stmt) return { ...next, done: true, event: { kind: 'end' } };
	if (next.steps > MAX_STEPS) return { ...next, error: `dopo ${MAX_STEPS} passi il programma non è ancora finito: forse il ciclo non termina` };
	try {
		const reads = readsOf(stmt);
		switch (stmt.kind) {
			case 'input':
				return { ...next, waiting: true, event: { kind: 'ask', name: stmt.name } };
			case 'assign': {
				const value = evaluate(stmt.expr, run.variables);
				const shown = namesOf(stmt.tokens).length || stmt.tokens.length > 1 ? textOf(showExpression(stmt.tokens, run.variables)) : '';
				return { ...next, reads, written: stmt.name, variables: { ...run.variables, [stmt.name]: value }, event: { kind: 'assign', name: stmt.name, shown, value } };
			}
			case 'output': {
				const text = stmt.items.map((item) => showValue(evaluate(item.expr, run.variables))).join(' ');
				return { ...next, reads, output: [...run.output, text], event: { kind: 'output', text } };
			}
			default: {
				const value = evaluate(stmt.cond, run.variables);
				if (typeof value !== 'boolean') throw new ChartError('la condizione deve essere vera o falsa');
				return { ...next, reads, event: { kind: 'cond', shown: textOf(showExpression(stmt.tokens, run.variables)), value } };
			}
		}
	} catch (e) {
		if (!(e instanceof ChartError)) throw e;
		return { ...next, reads: readsOf(stmt), error: e.message };
	}
}

/** The whole run with the given answers to "leggi", for the tests and for checking a lesson's chart. */
export function runAll(chart: Chart, inputs: string[]): Run {
	let run = startRun();
	while (canAdvance(run)) {
		if (run.waiting && run.asked >= inputs.length) return { ...run, error: 'mancano dei valori da leggere' };
		const next = advance(chart, run, run.waiting ? inputs[run.asked] : '');
		if (next === run) return { ...run, error: 'un valore da leggere è vuoto' };
		run = next;
	}
	return run;
}
