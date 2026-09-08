import { Node, type MarkdownToken } from '@tiptap/core';
import { FROZEN, frozenAt, frozenStart, type FrozenKind } from './analyse';

/**
 * A block the Simple editor cannot model, kept exactly as it was written.
 *
 * This exists because of a real data-loss path: marked emits a `table` token
 * with no `tokens` array, and the markdown manager's parse fallback returns
 * null for those — so a table pasted from a textbook would disappear from the
 * document and then from the next save. Raw HTML and footnote definitions come
 * back mangled instead of missing. The tokenizer below runs before marked's
 * own block rules, so those constructs never reach them, and `renderMarkdown`
 * hands the source back byte for byte.
 */

const TITLE: Record<FrozenKind, string> = {
	table: 'Tabella',
	footnote: 'Nota a piè di pagina',
	html: 'Blocco HTML'
};

/** Lucide's `lock` path, inlined: this file is not React and must not import a component. */
const LOCK = 'M5 11h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z M7 11V7a5 5 0 0 1 10 0v4';

export interface RawBlockOptions {
	/** Sends the student to the source editor, where the block can be changed. */
	onEditSource: () => void;
}

export const RawBlock = Node.create<RawBlockOptions>({
	name: 'rawBlock',
	group: 'block',
	atom: true,
	selectable: true,
	draggable: false,

	addOptions() {
		return { onEditSource: () => {} };
	},

	addAttributes() {
		return {
			markdown: { default: '' },
			kind: { default: 'html' as FrozenKind }
		};
	},

	parseHTML() {
		return [{ tag: 'div[data-type="raw-block"]' }];
	},

	renderHTML({ HTMLAttributes }) {
		return ['div', { ...HTMLAttributes, 'data-type': 'raw-block' }];
	},

	markdownTokenName: 'rawBlock',

	markdownTokenizer: {
		name: 'rawBlock',
		level: 'block' as const,
		// -1 when there is none, the way the shipped math tokenizer reports it.
		start: (src: string) => frozenStart(src),
		tokenize: (src: string) => {
			const hit = frozenAt(src);
			if (!hit) return undefined;
			return { type: 'rawBlock', raw: hit.raw, markdown: hit.raw.replace(/\n+$/, ''), kind: hit.kind };
		}
	},

	parseMarkdown: (token: MarkdownToken) => {
		const raw = token as MarkdownToken & { markdown?: string; kind?: FrozenKind };
		return { type: 'rawBlock', attrs: { markdown: raw.markdown ?? '', kind: raw.kind ?? 'html' } };
	},

	/** Byte for byte: the whole point of the node. */
	renderMarkdown: (node: { attrs?: Record<string, unknown> }) => String(node.attrs?.markdown ?? ''),

	/**
	 * A plain DOM node view, not a React one: a portal per block would be a lot
	 * of machinery for a read-only card, and the rest of this codebase reaches
	 * for the DOM directly in the same situation (see LessonBody).
	 */
	addNodeView() {
		return ({ node }) => {
			const kind = (node.attrs.kind ?? 'html') as FrozenKind;
			const wrapper = document.createElement('div');
			wrapper.setAttribute('data-type', 'raw-block');
			wrapper.setAttribute('role', 'group');
			wrapper.setAttribute('aria-label', `Blocco non modificabile: ${TITLE[kind].toLowerCase()}`);
			wrapper.className = 'my-4 overflow-hidden rounded-2xl border border-edge bg-surface-2';

			const header = document.createElement('div');
			header.className = 'flex items-center gap-2 border-b border-edge-soft px-3 py-2 text-xs font-medium text-fg-subtle';
			header.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5" aria-hidden="true"><path d="${LOCK}"/></svg>`;
			const label = document.createElement('span');
			label.textContent = TITLE[kind];
			header.appendChild(label);

			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'ml-auto rounded px-1 font-semibold text-accent-fg underline underline-offset-2';
			button.textContent = 'Modifica in Avanzata';
			button.addEventListener('click', () => this.options.onEditSource());
			header.appendChild(button);

			const body = document.createElement('pre');
			body.className = 'scroll-x px-3 py-2 font-mono text-sm leading-relaxed text-fg-muted';
			body.textContent = String(node.attrs.markdown ?? '');

			wrapper.append(header, body);
			// The card is a single atom: ProseMirror must not try to edit inside it.
			return { dom: wrapper, contentDOM: undefined, ignoreMutation: () => true };
		};
	}
});

/** Re-exported so a caller needs one import to know what this node covers. */
export { FROZEN };
