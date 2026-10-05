import { createElement } from 'react';
import type { Root } from 'react-dom/client';

/**
 * The flowcharts of a lesson: a ```diagramma block is published as a <figure data-diagramma> that holds the
 * drawing and carries the block (see chartFigure in content/markdown.ts). When the figure scrolls near, the chart
 * that runs takes the drawing's place; a figure never reached keeps its drawing, which is what gets printed.
 */
export function activateCharts(root: HTMLElement): () => void {
	const roots: Root[] = [];
	let stopped = false;

	const mount = async (figure: HTMLElement) => {
		const source = figure.dataset.diagramma;
		if (!source) return;
		const [{ createRoot }, { LessonChart }] = await Promise.all([import('react-dom/client'), import('@/components/diagramma/LessonChart')]);
		if (stopped) return;
		const chart = createRoot(figure);
		chart.render(createElement(LessonChart, { source }));
		roots.push(chart);
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
	root.querySelectorAll<HTMLElement>('figure[data-diagramma]').forEach((figure) => observer.observe(figure));

	return () => {
		stopped = true;
		observer.disconnect();
		// Unmounted after the current render, as React asks of a root torn down from an effect.
		const done = roots.splice(0);
		queueMicrotask(() => done.forEach((r) => r.unmount()));
	};
}
