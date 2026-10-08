'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * A figure of a lesson, the SVG its TikZ was compiled to, put in the page so it can be
 * drawn when its lesson comes on stage: every line gets its length (`--len`), which
 * landing.css turns into a dash that runs out, and what is filled (letters, arrow heads,
 * coloured areas) is marked to appear after the lines. A dashed line keeps its dashes and
 * appears with the letters. Until the script runs, and where the stage is not pinned, the
 * figure is whole. Black on white as TeX draws it, it is turned over in the dark theme like
 * the lessons' figures.
 */
export function TikzFigure({ svg, alt, width, className }: { svg: string; alt: string; width: number; className?: string }) {
	const box = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const root = box.current?.querySelector('svg');
		if (!root) return;
		for (const el of root.querySelectorAll<SVGGeometryElement>('path, line, polyline, polygon, rect, circle, ellipse')) {
			if (el.closest('defs, clipPath')) continue;
			const style = getComputedStyle(el);
			const line = style.fill === 'none' && style.stroke !== 'none' && style.strokeDasharray === 'none';
			if (line) {
				el.style.setProperty('--len', String(Math.ceil(el.getTotalLength()) + 1));
				el.dataset.line = '';
			} else el.dataset.ink = '';
		}
		for (const el of root.querySelectorAll<SVGElement>('use, text')) el.dataset.ink = '';
	}, [svg]);
	return <div ref={box} role="img" aria-label={alt} className={cn('lp-tikz mx-auto max-w-full dark:invert dark:hue-rotate-180 [&>svg]:h-auto [&>svg]:w-full', className)} style={{ width }} dangerouslySetInnerHTML={{ __html: svg }} />;
}
