import { InputRule } from '@tiptap/core';
import { BlockMath, InlineMath } from '@tiptap/extension-mathematics';

/**
 * The math nodes, with the input rules put right. The shipped ones bind
 * `$$…$$` to *inline* math and `$$$…$$$` to display, which is not the
 * convention anybody writes; notes use `$…$` inline and `$$…$$` on its own
 * line for display.
 *
 * Neither replacement uses a lookbehind: Safari only learned them in 16.4, and
 * an unsupported one throws when the module is evaluated, not when it matches.
 *
 * The markdown side of both nodes is already correct and is left alone: their
 * tokenizers run before marked's own rules, so `$a_1 \frac{x}{y}$` is claimed
 * whole and the underscore and the backslash inside it are never touched.
 */

const KATEX = { throwOnError: false, strict: 'ignore' as const, output: 'html' as const };

/** `$…$` anywhere in a line. A lone `$` before it is left to stand (prices, shell prompts). */
export const NoteInlineMath = InlineMath.extend({
	addInputRules() {
		return [
			new InputRule({
				find: /(^|[^$\\])\$([^$\n]+)\$$/,
				handler: ({ state, range, match }) => {
					const from = range.from + match[1].length;
					state.tr.replaceWith(from, range.to, this.type.create({ latex: match[2] }));
				}
			})
		];
	}
});

/** `$$…$$` closed on its own line: the whole paragraph becomes the formula. */
export const NoteBlockMath = BlockMath.extend({
	addInputRules() {
		return [
			new InputRule({
				find: /^\$\$([^$]*)\$\$$/,
				handler: ({ state, range, match }) => {
					const node = this.type.create({ latex: match[1].trim() });
					const $from = state.doc.resolve(range.from);
					// Replace the paragraph itself when the rule covers all of it, so the
					// formula is not left wrapped in an empty block.
					const whole =
						$from.depth > 0 &&
						$from.parent.isTextblock &&
						range.from === $from.start() &&
						range.to === $from.end() &&
						$from.node(-1).canReplaceWith($from.index(-1), $from.indexAfter(-1), this.type);
					const at = whole ? { from: $from.before(), to: $from.after() } : range;
					state.tr.replaceWith(at.from, at.to, node);
				}
			})
		];
	}
});

/**
 * `trust` is never enabled: that is what keeps \href and \includegraphics
 * disabled in something a student types. The MathML twin the lesson renderer
 * emits is left out here — the editor is not crawled, and it doubles the DOM
 * around every formula.
 */
export const mathOptions = (onClick: (latex: string, pos: number, block: boolean) => void) => ({
	block: NoteBlockMath.configure({
		katexOptions: KATEX,
		onClick: (node, pos) => onClick(String(node.attrs.latex ?? ''), pos, true)
	}),
	inline: NoteInlineMath.configure({
		katexOptions: KATEX,
		onClick: (node, pos) => onClick(String(node.attrs.latex ?? ''), pos, false)
	})
});
