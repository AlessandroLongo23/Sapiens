import { Node, type MarkdownToken } from '@tiptap/core';
import { ReactNodeViewRenderer, type ReactNodeViewProps } from '@tiptap/react';
import type { ComponentType } from 'react';

/**
 * A graph of the plotter inside a note (vault/Decisioni/2026-10-03 I grafici del plotter si salvano con nome e si
 * mettono nelle note.md). The note keeps its own copy of the graph, written in the markdown as a fenced block:
 *
 *     ```plotter
 *     <the graph, as a link to it would carry it: encodeState in lib/grafico/documento.ts>
 *     da <id of the saved graph it was loaded from> <its name>
 *     ```
 *
 * The second line is there only for a graph loaded from "I miei grafici", or saved there: "Salva" writes over that
 * one. Reading and printing draw the same block from the markdown (lib/content/note-markdown.ts).
 */

/** The fence of a graph, in a note's markdown. */
export const PLOT_FENCE = /^```plotter[ \t]*\n([A-Za-z0-9_-]*)[ \t]*\n(?:da ([0-9a-f-]{36}) ([^\n]*)\n)?```[ \t]*(?:\n|$)/;

export interface PlotBlockAttrs {
	code: string;
	from: string | null;
	name: string | null;
}

/** A graph as its fenced block. */
export const plotFence = ({ code, from, name }: PlotBlockAttrs) => `\`\`\`plotter\n${code}\n${from && name ? `da ${from} ${name.replace(/\s+/g, ' ')}\n` : ''}\`\`\``;

export interface PlotBlockOptions {
	/** What draws the block in the editor: given by the editor, so that this file stays free of the plotter. */
	view: ComponentType<ReactNodeViewProps> | null;
}

export const PlotBlock = Node.create<PlotBlockOptions>({
	name: 'plotBlock',
	group: 'block',
	atom: true,
	selectable: true,
	draggable: true,

	addOptions() {
		return { view: null };
	},

	addAttributes() {
		return {
			code: { default: '' },
			from: { default: null },
			name: { default: null }
		};
	},

	parseHTML() {
		return [{ tag: 'div[data-type="plot-block"]' }];
	},

	renderHTML({ HTMLAttributes }) {
		return ['div', { ...HTMLAttributes, 'data-type': 'plot-block' }];
	},

	markdownTokenName: 'plotBlock',

	markdownTokenizer: {
		name: 'plotBlock',
		level: 'block' as const,
		start: (src: string) => src.search(/^```plotter/m),
		tokenize: (src: string) => {
			const m = PLOT_FENCE.exec(src);
			if (!m) return undefined;
			return { type: 'plotBlock', raw: m[0], code: m[1], from: m[2] ?? null, name: m[3] ?? null };
		}
	},

	parseMarkdown: (token: MarkdownToken) => {
		const t = token as MarkdownToken & Partial<PlotBlockAttrs>;
		return { type: 'plotBlock', attrs: { code: t.code ?? '', from: t.from ?? null, name: t.name ?? null } };
	},

	renderMarkdown: (node: { attrs?: Record<string, unknown> }) => plotFence({ code: String(node.attrs?.code ?? ''), from: (node.attrs?.from as string | null) ?? null, name: (node.attrs?.name as string | null) ?? null }),

	addNodeView() {
		// The keys and the pointer inside the block are the plane's, not the text's: a drag on the plane moves the
		// plane. Only the handle in the block's heading is the editor's, and takes the block to another place.
		return ReactNodeViewRenderer(this.options.view!, {
			stopEvent: ({ event }) => {
				if (event.type.startsWith('drag') || event.type === 'drop') return false;
				return !(event.target instanceof Element && event.target.closest('[data-drag-handle]'));
			}
		});
	}
});
