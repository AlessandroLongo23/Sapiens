import { parser } from '@lezer/javascript';
import { GUARD } from './web-assemble';

/**
 * A page's script runs on the page's own thread: a loop that never ends would freeze the tab, and nothing can stop
 * it from outside. So every loop of the script is given a first line that calls the guard (GUARD, a function
 * of the preview: pagina.ts), which throws when the script has been running without a pause for too long. Nothing is added
 * between lines, so an error still says the line the student wrote.
 *
 * A script that cannot be read is returned as it is: it does not run at all.
 */

const LOOPS = new Set(['ForStatement', 'WhileStatement', 'DoStatement']);

export function guardLoops(source: string): string {
	const edits: { at: number; text: string }[] = [];
	let broken = false;
	parser.parse(source).iterate({
		enter(node) {
			if (node.type.isError) broken = true;
			if (!LOOPS.has(node.name)) return;
			// `do` body `while (…)`; `for (…)` body; `while (…)` body
			const body = node.name === 'DoStatement' ? node.node.firstChild?.nextSibling : node.node.lastChild;
			if (!body) return;
			if (body.name === 'Block') edits.push({ at: body.from + 1, text: `${GUARD}();` });
			else edits.push({ at: body.from, text: `{${GUARD}();` }, { at: body.to, text: '}' });
		}
	});
	if (broken) return source;
	let out = source;
	// from the end, so the places before stay where they are; at one place the closing brace comes first
	for (const { at, text } of edits.sort((a, b) => b.at - a.at || (a.text === '}' ? 1 : -1))) out = out.slice(0, at) + text + out.slice(at);
	return out;
}

/** The same for the scripts written inside the page's HTML. */
export const guardInline = (html: string) => html.replace(/(<script\b(?![^>]*\bsrc\s*=)[^>]*>)([\s\S]*?)(<\/script>)/gi, (_, open: string, code: string, close: string) => open + guardLoops(code) + close);
