'use client';

import { useEffect, useRef, useState } from 'react';
import { useLessonLayout } from '@/lib/state/lesson-layout';
import { useAISidebar } from '@/lib/state/ai-sidebar';
import { useReducedMotion } from '@/lib/hooks/use-media';
import { textSelection, type SelectionReport } from '@/lib/utils/text-selection';
import { copyAsTex, formulaTaps, paintFormulas, rangeToText, snapToFormulas } from '@/lib/utils/formulas';
import { processTikzWhenVisible } from '@/lib/utils/tikzjax';
import { activate3dModels } from '@/lib/utils/molecule3d';
import type { Prompt } from '@/lib/data/prompts';
import { FloatingMenu, type MenuPosition } from './FloatingMenu';

/** Wide tables scroll sideways inside their own box instead of pushing the page wider than a phone screen. */
function prepareTables(container: HTMLElement) {
	container.querySelectorAll<HTMLTableElement>('table').forEach((table) => {
		const columns = table.querySelector('tr')?.children.length;
		if (columns) table.style.setProperty('--col-count', String(columns));
		if (table.parentElement?.classList.contains('table-scroll')) return;
		const wrap = document.createElement('div');
		wrap.className = 'table-scroll scroll-x';
		table.parentNode?.insertBefore(wrap, table);
		wrap.appendChild(table);
	});
}

/** Animated GIFs load once they scroll near; a tap toggles them to full width. */
function lazyGifs(container: HTMLElement): () => void {
	const observer = new IntersectionObserver(
		(entries) =>
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				const img = entry.target as HTMLImageElement;
				img.src = img.dataset.src ?? img.src;
				img.classList.remove('lazy-gif');
				observer.unobserve(img);
			}),
		{ rootMargin: '50px 0px', threshold: 0.1 }
	);
	container.querySelectorAll('.lazy-gif').forEach((gif) => observer.observe(gif));
	const onClick = (e: Event) => {
		const img = e.target as HTMLImageElement;
		if (!img.classList.contains('markdown-gif')) return;
		const expanded = img.style.width === '100%';
		container.querySelectorAll<HTMLImageElement>('.markdown-gif').forEach((g) => (g.style.width = g.style.maxWidth = ''));
		if (!expanded) img.style.width = img.style.maxWidth = '100%';
	};
	container.addEventListener('click', onClick);
	return () => {
		observer.disconnect();
		container.removeEventListener('click', onClick);
	};
}

/**
 * The lesson text. The HTML arrives typeset from the server; here the tables
 * get their scroll boxes, GIFs load lazily, TikZ compiles when it scrolls
 * into view, the section under the sticky header is tracked for the table
 * of contents, and a text selection offers the assistant's actions.
 */
export function LessonBody({ html }: { html: string }) {
	const container = useRef<HTMLDivElement>(null);
	const scrollY = useLessonLayout((s) => s.scrollY);
	const targetSection = useLessonLayout((s) => s.targetSection);
	const activeSection = useLessonLayout((s) => s.activeSection);
	const setActiveSection = useLessonLayout((s) => s.setActiveSection);
	const jumpTo = useLessonLayout((s) => s.jumpTo);
	const reducedMotion = useReducedMotion();
	const setPendingPrompt = useAISidebar((s) => s.setPendingPrompt);
	const assistant = useAISidebar((s) => s.available);
	const [menu, setMenu] = useState<MenuPosition | null>(null);
	const selected = useRef('');

	useEffect(() => {
		const el = container.current;
		if (!el) return;
		prepareTables(el);
		const stopGifs = lazyGifs(el);
		const stopTikz = processTikzWhenVisible(el);
		const stop3d = activate3dModels(el);
		return () => {
			stopGifs();
			stopTikz();
			stop3d();
		};
	}, [html]);

	// Jump requested by the table of contents.
	useEffect(() => {
		if (!targetSection) return;
		const section = container.current?.querySelector(`#${CSS.escape(targetSection)}`);
		section?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
		if (section) setActiveSection(targetSection);
		jumpTo('');
	}, [targetSection, setActiveSection, jumpTo, reducedMotion]);

	// The lesson scrolls in the frame, not here: the section being read is the last heading that has passed under the sticky header.
	useEffect(() => {
		const frame = requestAnimationFrame(() => {
			let current = '';
			for (const heading of container.current?.querySelectorAll('h2[id], h3[id], h4[id]') ?? []) {
				if (heading.getBoundingClientRect().top <= 140) current = heading.id;
				else break;
			}
			if (current && current !== activeSection) setActiveSection(current);
		});
		return () => cancelAnimationFrame(frame);
	}, [scrollY, activeSection, setActiveSection]);

	// Text selection → the assistant's actions. Formulas ride along as whole
	// objects: lit as one block while the drag runs through them, taken entire
	// on a click, and read back as the LaTeX they were written in.
	useEffect(() => {
		const el = container.current;
		if (!el) return;
		const onSelect = (r: SelectionReport) => {
			selected.current = r.text;
			// A page without an assistant (the formulary, the exercises) still
			// selects and copies formulas whole; there is just nobody to ask.
			if (!assistant) return;
			// Mouse: above the selection. Finger: below its last line, clear of the OS callout.
			setMenu(r.touch ? { x: r.left + r.width / 2, y: r.bottom + 12, touch: true } : { x: r.left + r.width / 2, y: r.top - 10, touch: false });
		};
		const hide = () => setMenu(null);
		const { destroy } = textSelection(el, {
			onSelect,
			onDeselect: hide,
			onRange: (range) => paintFormulas(el, range),
			settle: (selection) => snapToFormulas(selection, el),
			read: rangeToText
		});
		const stopTaps = formulaTaps(el);
		const stopCopy = copyAsTex(el);
		// Escape lets go of a picked formula without having to find blank space to click.
		const onKey = (e: KeyboardEvent) => {
			if (e.key !== 'Escape') return;
			window.getSelection()?.removeAllRanges();
			setMenu(null);
		};
		window.addEventListener('scroll', hide, true);
		window.addEventListener('keydown', onKey);
		return () => {
			destroy();
			stopTaps();
			stopCopy();
			window.removeEventListener('scroll', hide, true);
			window.removeEventListener('keydown', onKey);
		};
	}, [assistant]);

	const choose = (prompt: Prompt) => {
		if (selected.current) setPendingPrompt(prompt, selected.current);
		setMenu(null);
		selected.current = '';
	};

	return (
		<div className="markdown-content h-full w-full">
			<div ref={container} id="content-container" className="content mx-auto max-w-4xl" dangerouslySetInnerHTML={{ __html: html }} />
			<FloatingMenu position={menu} onSelect={choose} />
		</div>
	);
}
