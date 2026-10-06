import { createElement } from 'react';
import type { Root } from 'react-dom/client';
import type { GuidedData } from '@/lib/guidato/blocco';

/**
 * The guided exercises of a lesson: a ```guidato block is published as a <section data-guidato> holding the worked
 * example whole (see guidedFigure in content/markdown.ts). Here each one is turned into an exercise: at once what
 * follows its first stop is held back (.guided-on, in globals.css), and when the section scrolls near it gets the
 * component that asks, answers and lets the text through (components/guidato/Guided.tsx), its own chunk. If that
 * cannot be loaded the section goes back to the worked example.
 */
export function activateGuided(root: HTMLElement): () => void {
	const roots: Root[] = [];
	let stopped = false;
	const sections = [...root.querySelectorAll<HTMLElement>('section[data-guidato]')];

	const mount = async (section: HTMLElement) => {
		try {
			const data = JSON.parse(section.dataset.guidato ?? '') as GuidedData;
			const host = section.querySelector<HTMLElement>(':scope > .guided-root');
			if (!host) throw new Error('no root');
			const [{ createRoot }, { default: Guided }] = await Promise.all([import('react-dom/client'), import('@/components/guidato/Guided')]);
			if (stopped) return;
			const guided = createRoot(host);
			guided.render(createElement(Guided, { data, section }));
			roots.push(guided);
		} catch {
			section.classList.remove('guided-on');
		}
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
	sections.forEach((section) => {
		section.classList.add('guided-on');
		observer.observe(section);
	});

	return () => {
		stopped = true;
		observer.disconnect();
		sections.forEach((section) => section.classList.remove('guided-on'));
		// Unmounted after the current render, as React asks of a root torn down from an effect.
		const done = roots.splice(0);
		queueMicrotask(() => done.forEach((r) => r.unmount()));
	};
}
