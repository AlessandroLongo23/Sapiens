'use client';

import { useState } from 'react';
import { Link2, Unlink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { add, angleDeg, ButtonRow, Caption, clamp, Controls, cross, DASH, dist, Dot, Drawing, Figure, frame, Handle, K, Label, polar, Readout, scale, sub, Tex, texNum, THICK, THIN, type V, unit, v } from './kit';
import { CircleHandle, degAt, mod360, onCircle } from './CircleHandle';

/**
 * Lesson 97, "Quadrilateri inscrivibili": the four vertices slide on the circle, and Â + Ĉ stays 180°. A button
 * detaches D, which then moves anywhere (keeping ABCD convex): the sum stops being 180°, since the theorem only
 * holds for a quadrilateral inscribed in the circle. On the circle the vertices sit at whole degrees, so the angles
 * are whole numbers or halves and the sums are exact.
 */

const O = v(0, 0);
const R = 1.6;
const f = frame(-2.3, 2.3, -2.1, 2.1);
const CIRCLE = '#cc6600'; // orange!80!black
const FILL = '#ebebff'; // blue!8
/** The smallest arc, in degrees, between two consecutive vertices. */
const GAP = 8;

type Deg = { a: number; b: number; c: number };
const START: Deg = { a: 200, b: 290, c: 20 };
const START_D = 120;
const ORDER = ['a', 'b', 'c', 'd'] as const;

/** Where `deg` may go between its neighbours `prev` and `next` (counterclockwise), keeping the order and a gap. */
function between(deg: number, prev: number, next: number) {
	const lo = mod360(prev + GAP);
	const span = mod360(next - prev) - 2 * GAP;
	const off = mod360(deg - lo);
	if (off <= span) return deg;
	// Outside: to the nearer end.
	return off - span < 360 - off ? mod360(lo + span) : lo;
}

/** ABCD convex, counterclockwise, with some room at every corner. */
function convex(ps: V[]) {
	return ps.every((p, i) => {
		const q = ps[(i + 1) % 4], r = ps[(i + 2) % 4];
		return cross(sub(q, p), sub(r, q)) > 0.15 && dist(p, q) > 0.35;
	});
}

const round1 = (x: number) => Math.round(x * 10) / 10;

export default function QuadrilateroInscritto({ alt }: { alt?: string }) {
	const [deg, setDeg] = useState<Deg>(START);
	/** D on the circle (its angle) or loose in the plane (its point). */
	const [d, setD] = useState<number | V>(START_D);
	const loose = typeof d !== 'number';

	const A = onCircle(O, R, deg.a), B = onCircle(O, R, deg.b), C = onCircle(O, R, deg.c);
	const D = typeof d === 'number' ? onCircle(O, R, d) : d;
	const dDeg = typeof d === 'number' ? d : degAt(d, O);

	const move = (key: keyof Deg) => (x: number) =>
		setDeg((old) => {
			const all = { ...old, d: dDeg };
			const i = ORDER.indexOf(key);
			const next = { ...old, [key]: between(x, all[ORDER[(i + 3) % 4]], all[ORDER[(i + 1) % 4]]) };
			// A loose D must still make a convex quadrilateral.
			return !loose || convex([onCircle(O, R, next.a), onCircle(O, R, next.b), onCircle(O, R, next.c), D]) ? next : old;
		});
	const moveD = (x: number) => setD(between(x, deg.c, deg.a));
	const dragD = (p: V) => {
		let q = v(clamp(p.x, f.x0 + 0.25, f.x1 - 0.25), clamp(p.y, f.y0 + 0.25, f.y1 - 0.25));
		// Close to the circle it clicks onto it, at a whole degree, so the inscribed case can be found again by hand.
		if (Math.abs(dist(q, O) - R) < 0.05) q = onCircle(O, R, degAt(q, O));
		if (convex([A, B, C, q])) setD(q);
	};
	const toggle = () => {
		if (loose) setD(between(dDeg, deg.c, deg.a));
		// Detached a little outside the circle, so that the change shows at once.
		else setD(add(O, polar(R * 1.18, (dDeg * Math.PI) / 180)));
	};

	const angles = [angleDeg(D, A, B), angleDeg(A, B, C), angleDeg(B, C, D), angleDeg(C, D, A)].map(round1);
	const [a, b, c, dd] = angles;
	const ac = round1(a + c), bd = round1(b + dd);
	const onIt = Math.abs(dist(D, O) - R) < 1e-6;
	const ps = [A, B, C, D];
	const g = scale(add(add(A, B), add(C, D)), 1 / 4);
	const out = (p: V) => unit(sub(p, g));

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<polygon points={f.pts(...ps)} fill={FILL} />
				<polygon points={f.pts(...ps)} fill="none" stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
				<circle cx={f.px(O).x} cy={f.px(O).y} r={R * K} fill="none" stroke={CIRCLE} strokeWidth={THIN} />
				{onIt && (
					<>
						<path d={f.path([B, O, D])} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
						{/* The two central angles on the arcs BD: single on the one that contains C, double on the other. */}
						<path d={f.arc(O, sub(B, O), sub(D, O), 0.3)} fill="none" stroke="#000" strokeWidth={THIN} />
						<path d={f.arc(O, sub(D, O), sub(B, O), 0.3)} fill="none" stroke="#000" strokeWidth={THIN} />
						<path d={f.arc(O, sub(D, O), sub(B, O), 0.38)} fill="none" stroke="#000" strokeWidth={THIN} />
					</>
				)}
				<path d={f.arc(A, sub(B, A), sub(D, A), 0.35)} fill="none" stroke="#000" strokeWidth={THIN} />
				<path d={f.arc(C, sub(D, C), sub(B, C), 0.35)} fill="none" stroke="#000" strokeWidth={THIN} />
				<path d={f.arc(C, sub(D, C), sub(B, C), 0.43)} fill="none" stroke="#000" strokeWidth={THIN} />
				<Dot f={f} at={O} />
				{/* Beyond the marks at O, towards the middle of the arc BC. */}
				<Label f={f} at={add(O, scale(unit(add(unit(sub(B, O)), unit(sub(C, O)))), 0.35))} dir={unit(add(unit(sub(B, O)), unit(sub(C, O))))}>O</Label>
				{(['A', 'B', 'C', 'D'] as const).map((n, i) => (
					<Label key={n} f={f} at={ps[i]} dir={out(ps[i])}>
						{n}
					</Label>
				))}
				<CircleHandle f={f} c={O} r={R} deg={deg.a} onDeg={move('a')} label="Vertice A" />
				<CircleHandle f={f} c={O} r={R} deg={deg.b} onDeg={move('b')} label="Vertice B" />
				<CircleHandle f={f} c={O} r={R} deg={deg.c} onDeg={move('c')} label="Vertice C" />
				{typeof d === 'number' ? <CircleHandle f={f} c={O} r={R} deg={d} onDeg={moveD} label="Vertice D" /> : <Handle f={f} at={D} onMove={dragD} label="Vertice D, staccato dalla circonferenza" step={0.05} />}
			</Drawing>
			<Readout>
				<Tex>{`\\hat{A} + \\hat{C} = ${texNum(a, 1)}^\\circ + ${texNum(c, 1)}^\\circ = ${texNum(ac, 1)}^\\circ`}</Tex>
				<Tex>{`\\hat{B} + \\hat{D} = ${texNum(b, 1)}^\\circ + ${texNum(dd, 1)}^\\circ = ${texNum(bd, 1)}^\\circ`}</Tex>
			</Readout>
			<Caption>
				{!loose ? (
					<>Trascina i vertici lungo la circonferenza: gli angoli cambiano, ma gli angoli opposti restano supplementari.</>
				) : onIt ? (
					<>
						<Tex>D</Tex> è di nuovo sulla circonferenza, e le somme tornano <Tex>{'180^\\circ'}</Tex>.
					</>
				) : (
					<>
						<Tex>D</Tex> non sta sulla circonferenza: <Tex>ABCD</Tex> non è inscritto, e gli angoli opposti non sono più supplementari. Trascina <Tex>D</Tex> {dist(D, O) > R ? 'verso l’interno' : 'verso l’esterno'} e guarda le somme.
					</>
				)}
			</Caption>
			<Controls>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={toggle}>
						{loose ? <Link2 className="size-4" aria-hidden="true" /> : <Unlink className="size-4" aria-hidden="true" />}
						{loose ? 'Riporta D sulla circonferenza' : 'Stacca D dalla circonferenza'}
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
