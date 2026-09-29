'use client';

import { Drawing, frame, v, THICK, THIN, TINT, FONT, DASH } from '@/components/content/interactive/kit';
import type { SceneProps } from '.';

/**
 * A ruler in millimetres with an object lying on it, from the tick `inizio` to the tick `fine` (millimetres from the
 * ruler's zero), as the lesson "Gli strumenti di misura" draws it (righello-lettura-differenza). Only the stretch of
 * the ruler around the object is drawn, from a whole centimetre, at a scale that keeps it under 7,4 cm; the
 * centimetres are numbered. The scene draws the data: the student reads the two ends.
 *
 *   { type: 'righello', data: { inizio: 20, fine: 74 } }
 */
export default function Righello({ data, alt }: SceneProps) {
	const inizio = Math.max(0, Math.round(Number(data.inizio ?? 0)));
	const fine = Math.max(inizio + 1, Math.round(Number(data.fine ?? 50)));
	const from = inizio < 4 ? 0 : Math.floor((inizio - 4) / 10) * 10;
	const to = Math.ceil((fine + 5) / 10) * 10;
	const mm = Math.min(0.2, 7.4 / (to - from));
	const X = (m: number) => 0.3 + (m - from) * mm;
	const f = frame(0, X(to) + 0.3, -0.1, 1.65);
	const ticks: string[] = [];
	const labels: { x: number; t: string }[] = [];
	for (let m = from; m <= to; m++) {
		const L = m % 10 === 0 ? 0.38 : m % 5 === 0 ? 0.26 : 0.15;
		ticks.push(f.path([v(X(m), 0.9), v(X(m), 0.9 - L)]));
		if (m % 10 === 0) labels.push({ x: X(m), t: String(m / 10) });
	}
	const text = (x: number, y: number, t: string) => {
		const p = f.px(v(x, y));
		return (
			<text key={`${x}`} x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={13} fontFamily={FONT}>
				{t}
			</text>
		);
	};
	return (
		<Drawing f={f} label={alt}>
			<path d={f.path([v(X(from) - 0.3, 0), v(X(to) + 0.3, 0), v(X(to) + 0.3, 0.9), v(X(from) - 0.3, 0.9)], true)} fill={TINT.yellow} stroke="#000" strokeWidth={THICK} />
			<path d={ticks.join(' ')} stroke="#000" strokeWidth={THIN} fill="none" />
			{labels.map((l) => text(l.x, 0.22, l.t))}
			<path d={f.path([v(X(inizio), 0.9), v(X(inizio), 1.4), v(X(fine), 1.4), v(X(fine), 0.9)], true)} fill={TINT.orange} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
			<path d={[f.path([v(X(inizio), 1.4), v(X(inizio), 1.6)]), f.path([v(X(fine), 1.4), v(X(fine), 1.6)])].join(' ')} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
		</Drawing>
	);
}
