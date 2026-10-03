import { createElement } from 'react';
import type { Root } from 'react-dom/client';
import type { CodeBlock } from '@/lib/codice/blocco';

/**
 * The programs of a lesson: a ```codice block is published as a <figure data-codice> that carries the block and
 * shows the program as text (see codeFigure in content/markdown.ts). When the figure scrolls near, the editor takes
 * the text's place. The editor is its own chunk, loaded the first time one is needed; the language itself is
 * downloaded only when the student clicks in the editor or runs the program.
 */
export function activateCode(root: HTMLElement): () => void {
	const roots: Root[] = [];
	let stopped = false;

	const mount = async (figure: HTMLElement) => {
		let block: CodeBlock;
		try {
			block = JSON.parse(figure.dataset.codice ?? '') as CodeBlock;
		} catch {
			return;
		}
		const [{ createRoot }, { LessonCode }] = await Promise.all([import('react-dom/client'), import('@/components/codice/LessonCode')]);
		if (stopped) return;
		const editor = createRoot(figure);
		editor.render(createElement(LessonCode, { block }));
		roots.push(editor);
	};

	const observer = new IntersectionObserver(
		(entries) =>
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				observer.unobserve(entry.target);
				void mount(entry.target as HTMLElement);
			}),
		{ rootMargin: '400px 0px' }
	);
	root.querySelectorAll<HTMLElement>('figure[data-codice]').forEach((figure) => observer.observe(figure));

	return () => {
		stopped = true;
		observer.disconnect();
		// Unmounted after the current render, as React asks of a root torn down from an effect.
		const done = roots.splice(0);
		queueMicrotask(() => done.forEach((r) => r.unmount()));
	};
}
