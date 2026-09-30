'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Label, Tex, Handle, frame, v, clamp, THIN, DASH, type V } from '../kit';
import { Arrow } from '../fisica';
import { LIQUID, Liquid, Surface, Vessel } from './liquidi';

/**
 * Lesson "La legge di Stevino e i vasi comunicanti": a container of liquid and a pressure sensor the student drags
 * anywhere in the liquid. Three shapes (straight, widening upwards, a bottle that narrows) and three liquids (water,
 * sea water, olive oil) are buttons. The readout gives the depth h below the free surface, the hydrostatic pressure
 * d·g·h and the total pressure p0 + d·g·h in kPa, rounded like p0 = 1,01 · 10⁵ Pa of the lesson: moving the sensor sideways, or
 * changing the shape, leaves it as it is. The container is 40 cm tall, the liquid 30 cm deep, in scale.
 */

const G = 9.8;
const P0 = 101000;
const CM = 0.08; // drawing centimetres per real centimetre
const LEVEL = 30 * CM; // the free surface, 30 cm above the bottom
const TOP = 40 * CM;

type Shape = { key: string; name: string; lw: V[]; rw: V[]; walls: V[]; left: (y: number) => number; right: (y: number) => number };

const lerpX = (y: number, a: V, b: V) => a.x + ((b.x - a.x) * (y - a.y)) / (b.y - a.y);
/** A wall as a polyline from bottom to top: its x at height y. */
const along = (pts: V[]) => (y: number) => {
	for (let i = 0; i < pts.length - 1; i++) if (y <= pts[i + 1].y) return lerpX(y, pts[i], pts[i + 1]);
	return pts[pts.length - 1].x;
};

function shape(key: string, name: string, leftWall: V[], rightWall: V[]): Shape {
	return { key, name, lw: leftWall, rw: rightWall, walls: [...[...leftWall].reverse(), ...rightWall], left: along(leftWall), right: along(rightWall) };
}

const SHAPES: Shape[] = [
	shape('dritto', 'dritto', [v(0, 0), v(0, TOP)], [v(3, 0), v(3, TOP)]),
	shape('largo', 'che si allarga', [v(0.9, 0), v(0, TOP)], [v(2.1, 0), v(3, TOP)]),
	shape('stretto', 'che si stringe', [v(0, 0), v(0, 1.0), v(1.1, 1.8), v(1.1, TOP)], [v(3, 0), v(3, 1.0), v(1.9, 1.8), v(1.9, TOP)]),
];

const LIQUIDS = [
	{ key: 'acqua', name: 'acqua', d: 1000, fill: LIQUID.acqua },
	{ key: 'mare', name: 'acqua di mare', d: 1030, fill: LIQUID.acqua },
	{ key: 'olio', name: 'olio', d: 920, fill: LIQUID.olio },
] as const;

const f = frame(-0.35, 4.3, -0.3, TOP + 0.35);

/** The liquid's outline: the walls from the free surface down, across the bottom and up again. */
function liquidOutline(s: Shape): V[] {
	const below = (wall: V[]) => wall.filter((p) => p.y < LEVEL);
	return [v(s.left(LEVEL), LEVEL), ...below(s.lw).reverse(), ...below(s.rw), v(s.right(LEVEL), LEVEL)];
}

const fmt = (x: number) => {
	const s = String(Math.round(x));
	return s.length >= 5 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : s;
};

export default function PressioneProfondita({ alt }: { alt?: string }) {
	const [k, setK] = useState(0);
	const [l, setL] = useState(0);
	const [P, setP] = useState<V>(v(1.5, 1.2));
	const s = SHAPES[k];
	const liq = LIQUIDS[l];

	/** Keeps the sensor inside the liquid, a little away from the walls. */
	const place = (q: V) => {
		const y = clamp(q.y, 0.15, LEVEL - 0.1);
		return v(clamp(q.x, s.left(y) + 0.18, s.right(y) - 0.18), y);
	};
	const pickShape = (i: number) => {
		setK(i);
		const t = SHAPES[i];
		const y = clamp(P.y, 0.15, LEVEL - 0.1);
		setP(v(clamp(P.x, t.left(y) + 0.18, t.right(y) - 0.18), y));
	};

	const hCm = Math.round((LEVEL - P.y) / CM);
	const pIdro = liq.d * G * (hCm / 100);
	const X = 3.4; // the depth's dimension line

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Liquid f={f} pts={liquidOutline(s)} fill={liq.fill} />
				<Surface f={f} from={v(s.left(LEVEL), LEVEL)} to={v(s.right(LEVEL), LEVEL)} />
				<Vessel f={f} pts={s.walls} />
				{/* same depth, same pressure: the horizontal through the sensor */}
				<path d={f.path([v(Math.min(s.left(P.y), 0) - 0.1, P.y), v(X + 0.15, P.y)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.55} />
				<path d={f.path([v(s.right(LEVEL), LEVEL), v(X + 0.15, LEVEL)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.55} />
				{hCm > 1 && (
					<>
						<Arrow f={f} from={v(X, (LEVEL + P.y) / 2)} to={v(X, LEVEL)} weight="thin" />
						<Arrow f={f} from={v(X, (LEVEL + P.y) / 2)} to={v(X, P.y)} weight="thin" />
						<Label f={f} at={v(X, (LEVEL + P.y) / 2)} dir={v(1, 0)} size={14}>
							h
						</Label>
					</>
				)}
				{/* the sensor: a small capsule with its cable going up out of the liquid */}
				<path d={f.path([P, v(P.x, TOP + 0.2)])} stroke="#666" strokeWidth={THIN} fill="none" />
				<rect x={f.px(P).x - 7} y={f.px(P).y - 5} width={14} height={10} rx={3} fill="#e6e6e6" stroke="#000" strokeWidth={1.2} />
				<Handle f={f} at={P} label="Sensore di pressione" onMove={(q) => setP(place(q))} step={CM} />
			</Drawing>

			<Readout>
				<span>
					<Tex>{`h = ${hCm}\\,\\text{cm}`}</Tex>
				</span>
				<span>
					<Tex>{`d \\cdot g \\cdot h = ${fmt(pIdro)}\\,\\text{Pa}`}</Tex>
				</span>
				<span className="font-medium">
					<Tex>{`p = p_0 + d \\cdot g \\cdot h \\approx ${Math.round((P0 + pIdro) / 1000)}\\,\\text{kPa}`}</Tex>
				</span>
			</Readout>
			<Caption>
				Recipiente {s.name}, pieno di {liq.name} (<Tex>{`d = ${liq.d}\\,\\text{kg/m}^3`}</Tex>) fino a 30 cm. La pressione dipende solo da quanto il sensore è sotto la superficie libera: spostalo in orizzontale o cambia la forma del recipiente, e la lettura resta la stessa.
			</Caption>

			<Controls>
				<ButtonRow>
					{SHAPES.map((x, i) => (
						<Button key={x.key} variant={i === k ? 'primary' : 'secondary'} size="sm" aria-pressed={i === k} onClick={() => pickShape(i)}>
							{x.name}
						</Button>
					))}
				</ButtonRow>
				<ButtonRow>
					{LIQUIDS.map((x, i) => (
						<Button key={x.key} variant={i === l ? 'primary' : 'secondary'} size="sm" aria-pressed={i === l} onClick={() => setL(i)}>
							{x.name}
						</Button>
					))}
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
