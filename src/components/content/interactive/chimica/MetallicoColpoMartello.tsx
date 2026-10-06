'use client';

import { Hammer, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, frame, v, useTween, K, THICK, FONT, type V } from '../kit';

/**
 * Lesson 66 (Il legame metallico): a metal and an ionic crystal side by side, four layers each. A slider slides the
 * two upper layers of both solids by up to one position, and "Colpisci" plays the whole move. In the metal the cations
 * stay in the electron sea, whose electrons follow them, and the piece ends with another shape. In the ionic crystal
 * each ion of the sliding block ends in front of an ion of the same sign: red arrows show the repulsion and the two
 * blocks come apart.
 *
 * Metal cations orange!25; in the ionic crystal cations violet!25 and small, anions green!25 and large, as in the TikZ
 * figures of lessons 65 and 66. Every particle carries its sign.
 */

const COLS = 5, ROWS = 4, GAP = 0.58;
const XM = 0.35, XI = 4.15, Y0 = 0.3;
const f = frame(0, 7.6, -0.05, 3.15);

/** Electrons of the metal: the cell (column, row) they sit above, and whether they belong to the sliding block. */
const ELECTRONS: { c: number; r: number; dx: number; dy: number }[] = [];
for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) ELECTRONS.push({ c, r, dx: 0.5 + 0.12 * Math.sin(3.1 * c + 1.7 * r), dy: 0.5 + 0.12 * Math.cos(2.3 * c + 4.1 * r) });

function Particle({ at, r, fill, sign, size }: { at: V; r: number; fill: string; sign: string; size: number }) {
	const p = f.px(at);
	return (
		<g>
			<circle cx={p.x} cy={p.y} r={r * K} fill={fill} stroke="#000" strokeWidth={THICK} />
			<text x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={size} fontFamily={FONT} fill="#000">
				{sign}
			</text>
		</g>
	);
}

export default function MetallicoColpoMartello({ alt }: { alt?: string }) {
	const [s, go, running] = useTween(0, 1100);
	const shift = s * GAP;
	// the ionic blocks come apart once like charges face each other
	const lift = Math.max(0, s - 0.6) * 0.75;
	const repel = s > 0.75;

	const ionic = s < 0.25 ? 'i due blocchi si attraggono' : s <= 0.75 ? 'attrazione quasi annullata' : 'cariche uguali di fronte: i blocchi si respingono';
	const caption =
		s === 0
			? 'Sposta il cursore, o premi «Colpisci», per far scorrere i due strati superiori di una posizione.'
			: s < 0.75
				? 'Nel metallo gli elettroni seguono i cationi e continuano a tenerli insieme. Nel cristallo ionico ogni ione che scorre si sta allontanando dallo ione di segno opposto che aveva sotto.'
				: 'Il metallo ha cambiato forma ed è ancora intero. Nel cristallo ionico ogni ione ha davanti uno ione dello stesso segno: la repulsione stacca i due blocchi, e il cristallo si spacca.';

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* the metal */}
				{ELECTRONS.map((e, i) => {
					// the electrons between the fixed block and the sliding one move by half
					const k = e.r >= 2 ? 1 : e.r === 1 ? 0.5 : 0;
					// the last column's electron goes to the left of the first cation: the sea surrounds the piece
					const col = e.c === COLS - 1 ? -1 : e.c;
					const p = f.px(v(XM + (col + e.dx) * GAP + k * shift, Y0 + (e.r + e.dy) * GAP));
					return <circle key={i} cx={p.x} cy={p.y} r={2.8} fill="#0000ff" />;
				})}
				{Array.from({ length: ROWS * COLS }, (_, i) => {
					const c = i % COLS, r = Math.floor(i / COLS);
					return <Particle key={i} at={v(XM + c * GAP + (r >= 2 ? shift : 0), Y0 + r * GAP)} r={0.2} fill="#ffdfbf" sign="+" size={12} />;
				})}
				{/* the ionic crystal */}
				{Array.from({ length: ROWS * COLS }, (_, i) => {
					const c = i % COLS, r = Math.floor(i / COLS);
					const cation = (c + r) % 2 === 1;
					return (
						<Particle
							key={i}
							at={v(XI + c * GAP + (r >= 2 ? shift : 0), Y0 + r * GAP + (r >= 2 ? lift : 0))}
							r={cation ? 0.17 : 0.25}
							fill={cation ? '#dfbfdf' : '#bfffbf'}
							sign={cation ? '+' : '−'}
							size={cation ? 11 : 13}
						/>
					);
				})}
				{repel &&
					Array.from({ length: COLS - 1 }, (_, c) => {
						const x = XI + (c + 1) * GAP;
						const a = f.px(v(x, Y0 + GAP + 0.3));
						const b = f.px(v(x, Y0 + 2 * GAP + lift - 0.3));
						return (
							<g key={c} stroke="#ff0000" strokeWidth={1.6} fill="none">
								<path d={`M${a.x},${a.y} L${b.x},${b.y}`} />
								<path d={`M${a.x - 3},${a.y - 5} L${a.x},${a.y} L${a.x + 3},${a.y - 5}`} />
								<path d={`M${b.x - 3},${b.y + 5} L${b.x},${b.y} L${b.x + 3},${b.y + 5}`} />
							</g>
						);
					})}
				{(
					[
						[XM + 2 * GAP, 'metallo'],
						[XI + 2 * GAP, 'cristallo ionico'],
					] as const
				).map(([x, name]) => {
					const p = f.px(v(x + GAP / 2, 2.95));
					return (
						<text key={name} x={p.x} y={p.y} textAnchor="middle" fontSize={14} fontFamily={FONT} fill="#000">
							{name}
						</text>
					);
				})}
			</Drawing>
			<Readout>
				<span>metallo: i cationi restano immersi negli elettroni</span>
				<span>cristallo ionico: {ionic}</span>
			</Readout>
			<Caption>{caption}</Caption>
			<Controls>
				<Slider label="Scorrimento dei due strati superiori (%)" value={Math.round(s * 100)} min={0} max={100} step={5} onChange={(x) => void go(x / 100, 0)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={running || s >= 1} onClick={() => void go(1)}>
						<Hammer className="size-4" aria-hidden="true" />
						Colpisci
					</Button>
					<Button variant="secondary" size="sm" disabled={running || s === 0} onClick={() => void go(0, 0)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Rimetti a posto
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
