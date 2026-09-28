'use client';

import { useState } from 'react';
import { Diameter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { add, ButtonRow, Caption, Controls, cross, Dot, Drawing, Figure, frame, K, Label, num, polar, Readout, scale, sub, Tex, texNum, THIN, unit, v } from './kit';
import { CircleHandle, mod360, onCircle } from './CircleHandle';

/**
 * Lesson 96, "Angoli al centro e alla circonferenza": V, A and B slide on the circle. The angle AVB insists on the
 * arc AB that does not contain V, and is half the central angle that contains that arc: convex when V is on the
 * major arc, flat when AB is a diameter (and then AVB is right), concave when V is on the minor arc, as in the
 * lesson's example 5. Points sit at whole degrees, so every measure shown is exact (a whole number or a half).
 */

const O = v(0, 0);
const R = 1.7;
const f = frame(-2.45, 2.45, -2.2, 2.3);
const ARC = '#0000b3'; // blue!70!black
const VERY_THICK = 1.8; // very thick, 1.2pt
/** How close, in degrees, two of the three points may come. */
const GAP = 3;

type Pts = { a: number; b: number; v: number };
const START: Pts = { a: 215, b: 325, v: 100 };

const apart = (x: number, y: number) => Math.min(mod360(x - y), mod360(y - x));
const valid = (p: Pts) => apart(p.a, p.b) >= GAP && apart(p.a, p.v) >= GAP && apart(p.b, p.v) >= GAP;

/** The arc AB without V, counterclockwise from `from` to `to`, and its measure in degrees. */
function geometry(p: Pts) {
	const d = mod360(p.b - p.a);
	const vInside = mod360(p.v - p.a) < d;
	return vInside ? { from: p.b, to: p.a, m: 360 - d } : { from: p.a, to: p.b, m: d };
}

export default function AngoloAllaCirconferenza({ alt }: { alt?: string }) {
	const [p, setP] = useState<Pts>(START);

	/** Moves one point; one that would land on another skips past it, and A or B snap to the diameter when near it. */
	const move = (key: keyof Pts) => (deg: number) =>
		setP((old) => {
			const delta = mod360(deg - old[key]);
			const dir = delta === 0 ? 0 : delta <= 180 ? 1 : -1;
			let next = { ...old, [key]: deg };
			// The snap only pulls towards the diameter, so the arrows can still leave it one degree at a time.
			const off = (q: Pts) => Math.abs(mod360(q.b - q.a) - 180);
			if (key !== 'v' && off(next) <= 2 && off(next) < off(old)) {
				const snapped = { ...next, [key]: mod360((key === 'a' ? next.b : next.a) + 180) };
				if (valid(snapped)) next = snapped;
			}
			for (let s = 1; !valid(next) && dir && s <= 2 * GAP + 1; s++) next = { ...old, [key]: mod360(deg + s * dir) };
			return valid(next) ? next : old;
		});

	const diameter = () =>
		setP((old) => {
			const b = mod360(old.a + 180);
			const moved = { ...old, b };
			return valid(moved) ? moved : { ...moved, v: mod360(old.a + 90) };
		});

	const { from, to, m } = geometry(p);
	const A = onCircle(O, R, p.a), B = onCircle(O, R, p.b), P = onCircle(O, R, p.v);
	const S = onCircle(O, R, from), E = onCircle(O, R, to);
	const half = m / 2;
	const flat = m === 180;
	const concave = m > 180;
	// The middle of the arc AB without V: the central angle opens towards it.
	const midDir = polar(1, ((from + m / 2) * Math.PI) / 180);
	// The mark at V goes counterclockwise from one side to the other, the short way.
	const [va, vb] = cross(sub(A, P), sub(B, P)) > 0 ? [sub(A, P), sub(B, P)] : [sub(B, P), sub(A, P)];
	const vBis = unit(add(unit(sub(A, P)), unit(sub(B, P))));

	const caption = flat ? (
		<>
			<Tex>{'AB'}</Tex> è un diametro: l&apos;angolo al centro è piatto, e l&apos;angolo in <Tex>V</Tex> è retto dovunque sia <Tex>V</Tex>.
		</>
	) : concave ? (
		<>
			<Tex>V</Tex> sta sull&apos;arco minore <Tex>AB</Tex>: l&apos;angolo in <Tex>V</Tex> insiste sull&apos;arco maggiore, e l&apos;angolo al centro corrispondente è quello concavo. Sull&apos;altro arco l&apos;angolo in <Tex>V</Tex> misurerebbe <Tex>{`${texNum((360 - m) / 2, 1)}^\\circ`}</Tex>.
		</>
	) : (
		<>
			Trascina <Tex>V</Tex> lungo la circonferenza: finché resta sull&apos;arco maggiore l&apos;angolo in <Tex>V</Tex> non cambia. Con <Tex>A</Tex> e <Tex>B</Tex> cambi l&apos;arco.
		</>
	);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<circle cx={f.px(O).x} cy={f.px(O).y} r={R * K} fill="none" stroke="#000" strokeWidth={1.2} />
				<path d={f.arc(O, sub(S, O), sub(E, O), R)} fill="none" stroke={ARC} strokeWidth={VERY_THICK} />
				{flat ? <path d={f.path([A, B])} stroke="#000" strokeWidth={THIN} /> : <path d={f.path([A, O, B])} fill="none" stroke="#000" strokeWidth={THIN} />}
				<path d={f.path([A, P, B])} fill="none" stroke={ARC} strokeWidth={THIN} />
				<path d={f.arc(O, sub(S, O), sub(E, O), 0.32)} fill="none" stroke="#000" strokeWidth={THIN} />
				{flat ? <polyline points={f.right(P, va, vb, 0.2)} fill="none" stroke="#000" strokeWidth={THIN} /> : <path d={f.arc(P, va, vb, 0.45)} fill="none" stroke="#000" strokeWidth={THIN} />}

				<Label f={f} at={add(O, scale(midDir, 0.42))} dir={midDir} upright size={12.75}>{`${num(m, 1)}°`}</Label>
				{!flat && <Label f={f} at={add(P, scale(vBis, 0.62))} dir={vBis} upright size={12.75}>{`${num(half, 1)}°`}</Label>}

				<Dot f={f} at={O} />
				<Label f={f} at={O} dir={flat ? v(0, midDir.y > 0 ? -1 : 1) : scale(midDir, -1)}>O</Label>
				<Label f={f} at={A} dir={unit(A)}>A</Label>
				<Label f={f} at={B} dir={unit(B)}>B</Label>
				<Label f={f} at={P} dir={unit(P)}>V</Label>
				<CircleHandle f={f} c={O} r={R} deg={p.a} onDeg={move('a')} label="Punto A" />
				<CircleHandle f={f} c={O} r={R} deg={p.b} onDeg={move('b')} label="Punto B" />
				<CircleHandle f={f} c={O} r={R} deg={p.v} onDeg={move('v')} label="Punto V" color={ARC} />
			</Drawing>
			<Readout>
				<Tex>{`\\widehat{AOB} = ${texNum(m, 1)}^\\circ${concave ? '\\ \\text{(concavo)}' : flat ? '\\ \\text{(piatto)}' : ''}`}</Tex>
				<Tex>{`\\widehat{AVB} = \\tfrac{1}{2}\\cdot ${texNum(m, 1)}^\\circ = ${texNum(half, 1)}^\\circ`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>
			<Controls>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={diameter} disabled={flat}>
						<Diameter className="size-4" aria-hidden="true" />
						Porta B all&apos;estremo del diametro
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
