'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Caption, Controls, DASH, DOTTED, Drawing, FONT, Figure, INK, Readout, Tex, THICK, THIN, TINT, frame, num, v } from './kit';

/**
 * Lesson 26, "Aumenti e sconti successivi": the price bar of the TikZ figure (100 € is the whole bar), changed twice,
 * each change on the bar left by the one before. Under the last bar, dashed, where the naive sum of the two
 * percentages would take the price. Money is counted in cents, so every number shown is exact.
 */

const L = 3.6; // 100 €, in TikZ cm
const H = 0.55;
const f = frame(-0.25, 8.4, -0.15, 4.75);
const ROWS = [3.6, 2.2, 0.8]; // bottom of each bar
const SIZE = 13;

/** Cents as euros, the Italian way: 7200 → "72", 7225 → "72,25". */
const eur = (cents: number) => (cents % 100 === 0 ? String(cents / 100) : (cents / 100).toFixed(2).replace('.', ','));
const pct = (p: number) => (p > 0 ? `+${num(p)}%` : p < 0 ? `−${num(-p)}%` : '0%');
const texPct = (p: number) => (p > 0 ? `+${num(p)}\\%` : p < 0 ? `-${num(-p)}\\%` : '0\\%');
const tex = (s: string) => s.replace(/,/g, '{,}');

export default function ScontiSuccessivi({ alt }: { alt?: string }) {
	const [p1, setP1] = useState(-20);
	const [p2, setP2] = useState(-10);

	// In cents: 100 € = 10 000 cents; each change multiplies by (100 + p)/100.
	const c0 = 10000;
	const c1 = 100 * (100 + p1);
	const c2 = (100 + p1) * (100 + p2);
	const naive = 100 * (100 + p1 + p2);
	const total = (c2 - c0) / 100; // the total change, in percent
	const x = (cents: number) => (cents / c0) * L;
	const box = (x0: number, y0: number, x1: number, y1: number) => f.pts(v(x0, y0), v(x1, y0), v(x1, y1), v(x0, y1));

	const text = (at: [number, number], s: string, anchor: 'start' | 'middle' = 'start', color = '#000') => {
		const p = f.px(v(at[0], at[1]));
		return (
			<text x={p.x} y={p.y} dy="0.35em" textAnchor={anchor} fontFamily={FONT} fontSize={SIZE} fill={color} pointerEvents="none">
				{s}
			</text>
		);
	};

	/** A bar that was `from` cents and is `to`: the part kept, and the part added (orange) or taken away (dashed). */
	const row = (y: number, from: number, to: number, mark?: number) => {
		const keep = Math.min(from, to);
		const diff = to - from;
		const w = Math.abs(x(to) - x(from));
		return (
			<g>
				<polygon points={box(0, y, x(keep), y + H)} fill={TINT.blue} />
				{diff > 0 && <polygon points={box(x(from), y, x(to), y + H)} fill={TINT.orange} />}
				{diff < 0 && <polygon points={box(x(to), y, x(from), y + H)} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />}
				{diff !== 0 && x(from) > 0 && <polyline points={f.pts(v(x(keep), y), v(x(keep), y + H))} stroke="#000" strokeWidth={THIN} />}
				<polygon points={box(0, y, x(to), y + H)} fill="none" stroke="#000" strokeWidth={THICK} />
				{diff !== 0 && w > 1.25 && (mark === undefined || Math.abs(x(mark) - (x(from) + x(to)) / 2) > 0.75) && text([(x(from) + x(to)) / 2, y + H / 2], `${diff > 0 ? '+' : '−'}${eur(Math.abs(diff))} €`, 'middle')}
			</g>
		);
	};

	const second = p2 > 0 ? 'aumento' : 'sconto';
	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* 100 €, dotted down through the three bars. */}
				<polyline points={f.pts(v(L, ROWS[2] - 0.15), v(L, ROWS[0] + H))} stroke={INK.gray} strokeWidth={THIN} strokeDasharray={DOTTED} />

				{text([0, ROWS[0] + H + 0.3], 'prezzo iniziale: 100 €')}
				<polygon points={box(0, ROWS[0], L, ROWS[0] + H)} fill={TINT.blue} stroke="#000" strokeWidth={THICK} />

				{text([0, ROWS[1] + H + 0.3], p1 === 0 ? `nessuna variazione: ${eur(c1)} €` : `dopo ${pct(p1)}: ${eur(c1)} €`)}
				{row(ROWS[1], c0, c1)}

				{text([0, ROWS[2] + H + 0.3], p2 === 0 ? `nessuna variazione: ${eur(c2)} €` : `dopo ${pct(p2)}: ${eur(c2)} €`)}
				{row(ROWS[2], c1, c2, naive)}

				{/* Where the sum of the percentages would say the price ends. */}
				{naive !== c2 && (
					<>
						<polyline points={f.pts(v(x(naive), ROWS[2] - 0.2), v(x(naive), ROWS[2] + H + 0.1))} stroke={INK.red} strokeWidth={THICK} strokeDasharray={DASH} />
						{text([Math.min(Math.max(x(naive), 2.3), 6.1), ROWS[2] - 0.5], `somma delle percentuali: ${eur(naive)} €`, 'middle', INK.red)}
					</>
				)}
			</Drawing>

			<Caption>
				{p1 === 0 || p2 === 0 ? (
					<>Con una sola variazione non c&apos;è niente da combinare: prova a muovere tutti e due i cursori.</>
				) : (
					<>
						Il secondo {second}, del <Tex>{`${num(Math.abs(p2))}\\%`}</Tex>, si calcola su <Tex>{tex(`${eur(c1)}`)}</Tex> €, non su <Tex>100</Tex> €: la variazione totale è <Tex>{tex(texPct(total))}</Tex>, non <Tex>{texPct(p1 + p2)}</Tex>.
					</>
				)}
			</Caption>
			<Readout>
				<span>
					coefficiente complessivo: <Tex>{tex(`${num((100 + p1) / 100)} \\cdot ${num((100 + p2) / 100)} = ${num(c2 / c0, 4)}`)}</Tex>
				</span>
				<span>
					variazione totale: <Tex>{tex(texPct(total))}</Tex>
				</span>
				<span>
					somma delle percentuali: <Tex>{texPct(p1 + p2)}</Tex>
				</span>
			</Readout>
			<Controls>
				<Slider label="Prima variazione" value={p1} min={-50} max={50} step={1} unit="%" onChange={setP1} />
				<Slider label="Seconda variazione" value={p2} min={-50} max={50} step={1} unit="%" onChange={setP2} />
			</Controls>
		</Figure>
	);
}
