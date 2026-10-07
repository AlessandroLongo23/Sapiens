/**
 * Shared pieces of the generators of the lessons on JavaScript in the page (informatica, third year, lessons 96-98:
 * inf-script-client, inf-dom-eventi, inf-validazione-moduli).
 *
 * Nothing runs JavaScript while an exercise is generated: a level writes its fragment as text and works out the
 * right answer from its own parameters. The independent check reads the fragment with a small interpreter of its
 * own (scripts/exercises/checkers/_inf_g14.py) and compares.
 *
 * What a sample carries in `params`: `case` for the shares; `html` and `script`, the two parts of the fragment shown,
 * where the level has them; what the check needs to fire the events and to read the page afterwards.
 */
import { choose, SHOWN_WIDTH, textOption, type CodeBuilt } from './inf-codice';
import type { ChoiceOption, Rng } from './types';

/** A level whose numbers are drawn again when they leave too few different wrong answers; the case is drawn once. */
export class TooFew extends Error {}

export const drawn =
	<F>(cases: readonly F[], build: (rng: Rng, kind: F) => CodeBuilt) =>
	(rng: Rng): CodeBuilt => {
		const kind = rng.pick(cases);
		for (let i = 1; ; i++) {
			try {
				return build(rng, kind);
			} catch (e) {
				if (i >= 40 || !(e instanceof TooFew)) throw e;
			}
		}
	};

/** The multiple choice of `choose`, or `TooFew` where fewer than three wrong options differ from the right one. */
export function pick(rng: Rng, right: ChoiceOption, others: ChoiceOption[]) {
	const keys = new Set(others.map((o) => o.values.join('|')));
	keys.delete(right.values.join('|'));
	if (keys.size < 3) throw new TooFew(`only ${keys.size} wrong options`);
	return choose(rng, right, others);
}

/** One of `cases` with the given weights: `weighted(rng, { conto: 4, testo: 3 })`. */
export function weighted<K extends string>(rng: Rng, weights: Record<K, number>): K {
	const all: K[] = [];
	for (const key of Object.keys(weights) as K[]) for (let i = 0; i < weights[key]; i++) all.push(key);
	return rng.pick(all);
}

/** The script stops: the option that says so, the same in every level. */
export const STOPS = textOption('Niente: lo script si ferma con un errore', 'errore');

/**
 * A declaration whose value is one call, on as few rows as fit the width: `const x = f(arg);`, then the call on a
 * row of its own, then the argument on a row of its own.
 */
export function declare(name: string, call: string, arg: string, indent = '', width = SHOWN_WIDTH): string {
	const one = `${indent}const ${name} = ${call}(${arg});`;
	if (one.length <= width) return one;
	const two = `${indent}    ${call}(${arg});`;
	if (two.length <= width) return `${indent}const ${name} =\n${two}`;
	return `${indent}const ${name} = ${call}(\n${indent}    ${arg}\n${indent});`;
}

export const select = (name: string, selector: string, indent = '') => declare(name, 'document.querySelector', `"${selector}"`, indent);
export const selectAll = (name: string, selector: string, indent = '') => declare(name, 'document.querySelectorAll', `"${selector}"`, indent);

/** A listener registered on the element a selector finds, on two rows. */
export const listen = (selector: string, event: string, fn: string) => `document.querySelector("${selector}")\n    .addEventListener("${event}", ${fn});`;
/** A listener registered on an element that has a name, with the two arguments on a row of their own. */
export const register = (target: string, first: string, second: string) => `${target}.addEventListener(\n    ${first}, ${second}\n);`;

/** The fragment a level shows for a page and its script: the HTML, an empty row, the name of the file, the script. */
export const shown = (html: string, script: string, file = 'script.js') => `${html.trimEnd()}\n\n// ${file}\n${script.trimEnd()}\n`;

/** A field of a form with what is written in it, on one row when it fits. */
export function field(id: string, value: string, extra = ''): string {
	const one = `<input id="${id}"${extra} value="${value}">`;
	return one.length <= SHOWN_WIDTH ? one : `<input id="${id}"${extra}\n    value="${value}">`;
}

/** Rows joined into a text that ends with a line break. */
export const rows = (...lines: (string | false | null | undefined)[]) => lines.filter((line): line is string => typeof line === 'string').join('\n') + '\n';

/**
 * The classes of an element as an option: the names in alphabetical order are its value, and the label says them in
 * the order of `order` (the order they have in the HTML).
 */
export function classesOption(classes: readonly string[], order: readonly string[] = []): ChoiceOption {
	const said = sayClasses(classes, order);
	return textOption(said.length === 0 ? 'nessuna classe' : said.length === 1 ? `solo ${said[0]}` : said.join(' e '), [...said].sort().join(' '));
}

/** The classes of an element without repetitions, in the order of `order`. */
export const sayClasses = (classes: readonly string[], order: readonly string[] = []) => [...new Set(classes)].sort((a, b) => order.indexOf(a) - order.indexOf(b));

/** The four sets of classes an element can have out of two names. */
export const classSets = (a: string, b: string): string[][] => [[a, b], [a], [b], []];

/** The songs of the band, each short enough for a row of a list with a class. */
export const SONGS = ['Controtempo', 'Ricreazione', 'Ultima ora', 'Intervallo', 'Zaino pieno', 'Banco tre', 'Fuori sede', 'Assenza'] as const;

/** A level of fragments has no program in the two languages. */
export const fragments = (sample: { params: Record<string, unknown> }) => (sample.params.program ? ['a level of fragments has no program'] : []);
