'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { hasMath } from '@/lib/content/note-markdown';
import type { FirstPage } from '@/lib/zaino/config';
import { SHEET_WIDTH } from '@/lib/zaino/stickers';
import { StaticPage, useKatex } from './StaticPage';
import 'katex/dist/katex.min.css';

/**
 * The first page of a note, the real sheet (paper, text, formulas, stickers) shrunk to the width of its card: the
 * card is as wide as its column, so the scale is measured, not fixed as in the page thumbnails of the editor.
 */
export function FirstPageThumb({ page }: { page: FirstPage }) {
	const box = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(0);
	const katex = useKatex(hasMath(page.markdown));

	useLayoutEffect(() => {
		const node = box.current;
		if (!node) return;
		const measure = () => setScale(node.getBoundingClientRect().width / SHEET_WIDTH);
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	return (
		<div ref={box} className="absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true" inert>
			{scale > 0 && (
				<div className="pointer-events-none origin-top-left" style={{ zoom: scale }}>
					<StaticPage markdown={page.markdown} stickers={page.stickers} paper={page.paper} katex={katex} className="shadow-none" />
				</div>
			)}
		</div>
	);
}
