import type { Extensions } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import { Placeholder } from '@tiptap/extensions';
import { mathOptions } from './math';
import type { ComponentType } from 'react';
import type { ReactNodeViewProps } from '@tiptap/react';
import { PlotBlock } from './plot-block';
import { RawBlock } from './raw-block';
import { SlashCommands, type SlashHandlers } from './slash';

/**
 * What the Simple editor understands. Everything here is loaded only when that
 * mode is opened: nothing outside SimpleEditor may import this file, or
 * ProseMirror ends up in the shell bundle.
 */
export function noteExtensions(options: {
	onMathClick: (latex: string, pos: number, block: boolean) => void;
	onEditSource: () => void;
	placeholder?: string;
		/** The slash menu, where the editor has one (the note's pages). */
	slash?: SlashHandlers;
	/** What draws a graph of the plotter in the note, where the editor has graphs. */
	plotView?: ComponentType<ReactNodeViewProps>;
}): Extensions {
	const math = mathOptions(options.onMathClick);
	return [
		StarterKit.configure({
			heading: { levels: [1, 2, 3] },
			link: {
				openOnClick: false,
				autolink: false,
				HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' }
			}
		}),
		Markdown,
		// An empty note shows what to do instead of a blank page (styled in globals.css).
		Placeholder.configure({ placeholder: options.placeholder ?? 'Scrivi qui. Premi / per titoli, elenchi e formule, oppure scrivi $x^2$ per una formula.' }),
		math.block,
		math.inline,
		RawBlock.configure({ onEditSource: options.onEditSource }),
		// before the code block of the starter kit, which would take the fence for code
		...(options.plotView ? [PlotBlock.configure({ view: options.plotView })] : []),
		...(options.slash ? [SlashCommands.configure({ handlers: options.slash })] : [])
	];
}
