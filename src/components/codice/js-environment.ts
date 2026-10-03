/**
 * What a JavaScript program finds around it when it runs as a program and not in a page (javascript.worker.ts, and
 * scripts/codice/verifica.mts in Node): a console that prints, prompt() that reads a line, alert() that prints, and
 * random numbers that repeat. Pure: `write` is where the text goes.
 */

/** Thrown when the program needs a line nobody has typed yet: the run stops and is repeated with it. */
export const WAIT = { name: 'Attesa' };
/** Thrown when the program has printed too much. */
export const OVERFLOW = { name: 'Troppo' };

/** A value as the console shows it: text as it is at the top, quoted inside a list or an object. */
export function format(value: unknown, depth = 0, seen: unknown[] = []): string {
	if (typeof value === 'string') return depth === 0 ? value : JSON.stringify(value);
	if (typeof value === 'bigint') return `${value}n`;
	if (typeof value === 'function') return `[Function: ${value.name || 'anonima'}]`;
	if (typeof value !== 'object' || value === null) return String(value);
	if (value instanceof Error) return `${value.name}: ${value.message}`;
	if (seen.includes(value)) return '[Circolare]';
	if (depth > 3) return Array.isArray(value) ? '[…]' : '{…}';
	const inside = [...seen, value];
	if (Array.isArray(value)) return `[${value.map((item) => format(item, depth + 1, inside)).join(', ')}]`;
	if (value instanceof Map) return `Map(${value.size}) {${[...value].map(([k, v]) => `${format(k, depth + 1, inside)} => ${format(v, depth + 1, inside)}`).join(', ')}}`;
	if (value instanceof Set) return `Set(${value.size}) {${[...value].map((v) => format(v, depth + 1, inside)).join(', ')}}`;
	if (value instanceof Date) return value.toString();
	const entries = Object.entries(value).map(([key, item]) => `${/^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key)}: ${format(item, depth + 1, inside)}`);
	const name = value.constructor && value.constructor !== Object ? `${value.constructor.name} ` : '';
	return entries.length ? `${name}{ ${entries.join(', ')} }` : `${name}{}`;
}

/** Mulberry32: random numbers that repeat for the same seed, so a program run again draws the same ones. */
export function random(seed: number): () => number {
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** `wait` is called when prompt() needs a line nobody has typed: it does not return. */
export function environment(inputs: string[], batch: boolean, write: (kind: 'out' | 'err' | 'in', text: string) => void, wait: () => never) {
	let next = 0;
	const print = (kind: 'out' | 'err') => (...values: unknown[]) => write(kind, `${values.map((v) => format(v)).join(' ')}\n`);
	const prompt = (message: unknown = '') => {
		// with no keyboard (the tests of an exercise) the question is not printed, and when the lines are over the
		// input is too, as when a visitor closes the dialog
		if (batch) return next < inputs.length ? inputs[next++] : null;
		const text = String(message);
		write('out', text && !/\s$/.test(text) ? `${text} ` : text);
		if (next < inputs.length) {
			const line = inputs[next++];
			write('in', `${line}\n`);
			return line;
		}
		return wait();
	};
	return {
		console: { log: print('out'), info: print('out'), debug: print('out'), warn: print('err'), error: print('err') },
		prompt,
		alert: (message: unknown = '') => write('out', `${String(message)}\n`),
		confirm: (message: unknown = '') => /^s/i.test(prompt(`${String(message)} (s/n)`) ?? '')
	};
}
