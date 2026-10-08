'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { PenStroke } from './PageHeader';

/** The room under a title for its stroke: the gap, then the stroke. */
const GAP = 8;
const STROKE = 10;
/** On a title of several lines each stroke is this much nearer its words, so it reads as theirs and not as the next line's. */
const LIFT = '0.14em';

interface Line {
	left: number;
	top: number;
	width: number;
}

/**
 * A page's title with a pen stroke under each of its lines, as wide as the words on it. Where the
 * lines break is only known in the browser, so until it has measured them there is one stroke, as
 * wide as the title's box. A title on more lines is set looser, for the strokes between them.
 */
export function TitleStroke({ children }: { children: ReactNode }) {
	const box = useRef<HTMLSpanElement>(null);
	const words = useRef<HTMLSpanElement>(null);
	const [lines, setLines] = useState<Line[] | null>(null);
	useLayoutEffect(() => {
		const outer = box.current;
		const inner = words.current;
		if (!outer?.parentElement || !inner) return;
		const measure = () => {
			const frame = outer.getBoundingClientRect();
			// One rectangle for each line, whatever the title is made of (a formula has several on a line).
			const rows: { left: number; right: number; bottom: number }[] = [];
			for (const r of inner.getClientRects()) {
				const row = rows.find((o) => Math.abs(o.bottom - r.bottom) < r.height / 2);
				if (row) Object.assign(row, { left: Math.min(row.left, r.left), right: Math.max(row.right, r.right), bottom: Math.max(row.bottom, r.bottom) });
				else rows.push({ left: r.left, right: r.right, bottom: r.bottom });
			}
			if (rows.length === 0) return;
			// The last stroke goes at the foot of the box, and the others as far under their own line.
			const drop = frame.bottom - STROKE - rows[rows.length - 1].bottom;
			const next = rows.map((r) => ({ left: Math.round(r.left - frame.left), top: Math.round(r.bottom + drop - frame.top), width: Math.ceil(r.right - r.left) }));
			setLines((now) => (JSON.stringify(now) === JSON.stringify(next) ? now : next));
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(outer.parentElement);
		observer.observe(outer);
		return () => observer.disconnect();
	}, []);
	const many = !!lines && lines.length > 1;
	return (
		<span ref={box} className="relative block" style={many ? { paddingBottom: `calc(${GAP + STROKE}px - ${LIFT})`, lineHeight: 1.3 } : { paddingBottom: GAP + STROKE }}>
			<span ref={words}>{children}</span>
			{lines ? (
				lines.map((line, i) => (
					<span key={i} className="absolute" style={line}>
						<PenStroke className="block" />
					</span>
				))
			) : (
				<span className="absolute inset-x-0 bottom-0">
					<PenStroke className="block" />
				</span>
			)}
		</span>
	);
}
