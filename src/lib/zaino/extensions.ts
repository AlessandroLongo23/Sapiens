import type { Extensions } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import { Placeholder } from '@tiptap/extensions';
import { mathOptions } from './math';
import { RawBlock } from './raw-block';

/**
 * What the Simple editor understands. Everything here is loaded only when that
 * mode is opened: nothing outside SimpleEditor may import this file, or
 * ProseMirror ends up in the shell bundle.
 */
export function noteExtensions(options: {
	onMathClick: (latex: string, pos: number, block: boolean) => void;
	onEditSource: () => void;
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
		Placeholder.configure({ placeholder: 'Scrivi qui. Usa la barra sopra, oppure $x^2$ per una formula.' }),
		math.block,
		math.inline,
		RawBlock.configure({ onEditSource: options.onEditSource })
	];
}
