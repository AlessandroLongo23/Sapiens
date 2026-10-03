import { createElement } from 'react';
import type { Root } from 'react-dom/client';
import type { ReadPlotBlock } from '@/lib/grafico/blocco';

/**
 * The planes of the plotter in a lesson: a ```grafico block is published as a <figure data-grafico> that carries
 * the block (see plotFigure in content/markdown.ts). One with a cover, a TikZ figure, shows the figure and a button:
 * "Prova tu" puts the plane in its place, and the cross in the plane's corner brings the figure back. One without a cover gets its
 * plane when it scrolls near. The plane is its own chunk, loaded the first time one is asked for.
 */
export function activatePlots(root: HTMLElement): () => void {
	const roots: Root[] = [];
	const undo: (() => void)[] = [];
	let stopped = false;

	const mount = async (figure: HTMLElement, into: HTMLElement, onClose?: () => void) => {
		let spec: ReadPlotBlock;
		try {
			spec = JSON.parse(figure.dataset.grafico ?? '') as ReadPlotBlock;
		} catch {
			return false;
		}
		const [{ createRoot }, { default: LessonPlot }] = await Promise.all([import('react-dom/client'), import('@/components/grafico/LessonPlot')]);
		if (stopped) return false;
		const plane = createRoot(into);
		plane.render(createElement(LessonPlot, { spec, onClose }));
		roots.push(plane);
		return true;
	};

	const observer = new IntersectionObserver(
		(entries) =>
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				observer.unobserve(entry.target);
				void mount(entry.target as HTMLElement, entry.target as HTMLElement);
			}),
		{ rootMargin: '400px 0px' }
	);

	root.querySelectorAll<HTMLElement>('figure[data-grafico]').forEach((figure) => {
		const button = figure.querySelector<HTMLButtonElement>(':scope > .plot-try');
		const cover = figure.querySelector<HTMLElement>(':scope > .plot-cover');
		const live = figure.querySelector<HTMLElement>(':scope > .plot-live');
		if (!button || !cover || !live) {
			observer.observe(figure);
			return;
		}
		let mounted = false;
		// with the plane in place its own corner button brings the figure back, and "Prova tu" is out of the way
		const show = (plane: boolean) => {
			cover.hidden = plane;
			live.hidden = !plane;
			button.hidden = plane;
			button.setAttribute('aria-expanded', String(plane));
		};
		const close = () => {
			show(false);
			button.focus();
		};
		const onClick = async () => {
			if (!mounted) {
				button.disabled = true;
				mounted = await mount(figure, live, close);
				button.disabled = false;
				if (!mounted) return;
			}
			show(true);
			// the plane is drawn a moment later: the focus goes to its cross, where the keyboard can go back from
			requestAnimationFrame(() => live.querySelector<HTMLElement>('button[aria-label="Torna alla figura"]')?.focus({ preventScroll: true }));
		};
		button.hidden = false;
		button.addEventListener('click', onClick);
		undo.push(() => {
			button.removeEventListener('click', onClick);
			show(false);
			button.hidden = true;
		});
	});

	return () => {
		stopped = true;
		observer.disconnect();
		undo.forEach((f) => f());
		// Unmounted after the current render, as React asks of a root torn down from an effect.
		const done = roots.splice(0);
		queueMicrotask(() => done.forEach((r) => r.unmount()));
	};
}
