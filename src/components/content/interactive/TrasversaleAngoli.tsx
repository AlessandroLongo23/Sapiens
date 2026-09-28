'use client';

import { useState } from 'react';
import { ArrowRightLeft, Equal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Field';
import { Slider } from '@/components/ui/Slider';
import { ButtonRow, Caption, Controls, Drawing, Figure, FONT, FONT_SIZE, Handle, Label, Readout, Tex, THICK, THIN, TINT, add, frame, polar, scale, useTween, v, type Frame, type V } from './kit';

/**
 * Lesson 60, two lines cut by a transversal: the student turns the line b around the point where t crosses it and
 * picks a pair of angles to highlight. The pair keeps its name whatever b does; its two angles are congruent (or add
 * up to 180°, for the conjugate pairs) only when b is parallel to a. Drawn like the TikZ figure: a on top, t with the
 * same slope, the eight angles numbered in the same places.
 *
 * The slope of t is a whole number of degrees and b turns by whole degrees, so every angle shown is exact.
 */

const f = frame(-0.95, 4.05, -1.2, 3.05);
const T_BLUE = '#0000b3'; // blue!70!black
const TILT = 62; // the slope of t, in degrees (the TikZ figure's is 62.03°)
const MAX_TURN = 20;
const rad = (d: number) => (d * Math.PI) / 180;
const Y_A = 1.7;
const A = v(1.8, Y_A);
const B = v(A.x - Y_A / Math.tan(rad(TILT)), 0);
const T = polar(1, rad(TILT));

type Pair = [number, number];
type Kind = { key: string; name: string; pairs: Pair[]; supplementary: boolean };
const KINDS: Kind[] = [
	{ key: 'ai', name: 'alterni interni', pairs: [[3, 5], [4, 6]], supplementary: false },
	{ key: 'ae', name: 'alterni esterni', pairs: [[1, 7], [2, 8]], supplementary: false },
	{ key: 'co', name: 'corrispondenti', pairs: [[1, 5], [2, 6], [3, 7], [4, 8]], supplementary: false },
	{ key: 'ci', name: 'coniugati interni', pairs: [[4, 5], [3, 6]], supplementary: true },
	{ key: 'ce', name: 'coniugati esterni', pairs: [[1, 8], [2, 7]], supplementary: true }
];

/**
 * The eight angles for a line b at `phi` degrees: vertex, the two directions that bound it (counterclockwise) and its
 * size. 1 to 4 at A, 5 to 8 at B, each counterclockwise from the right-hand side of the line: 1 and 5 above on the
 * right of t, 2 and 6 above on the left, 3 and 7 below on the left, 4 and 8 below on the right.
 */
function angles(phi: number) {
	const at = (P: V, line: number) => [
		{ P, from: line, to: TILT },
		{ P, from: TILT, to: line + 180 },
		{ P, from: line + 180, to: TILT + 180 },
		{ P, from: TILT + 180, to: line + 360 }
	];
	return [...at(A, 0), ...at(B, phi)].map((x) => ({ ...x, size: x.to - x.from }));
}

/** A number with a hat, like $\hat{3}$: the angle's name in the drawing. */
function HatNumber({ f, at, n }: { f: Frame; at: V; n: number }) {
	const p = f.px(at);
	const top = p.y - FONT_SIZE * 0.42;
	return (
		<g pointerEvents="none">
			<text x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={FONT_SIZE * 0.9} fontFamily={FONT} fill="#000">
				{n}
			</text>
			<path d={`M${p.x - 3} ${top - 1} L${p.x} ${top - 4} L${p.x + 3} ${top - 1}`} fill="none" stroke="#000" strokeWidth={0.8} />
		</g>
	);
}

export default function TrasversaleAngoli({ alt }: { alt?: string }) {
	const [phi, setPhi] = useState(12);
	const [kind, setKind] = useState(0);
	const [which, setWhich] = useState(0);
	const [t, go, running] = useTween(0, 700);
	const [from, setFrom] = useState<number | null>(null);

	const shown = from === null ? phi : Math.round(from * (1 - t));
	const list = angles(shown);
	const k = KINDS[kind];
	const [p, q] = k.pairs[which % k.pairs.length];
	const x = list[p - 1].size, y = list[q - 1].size;
	const parallel = shown === 0;

	const set = (d: number, snap = false) => {
		if (from !== null) void go(0, 0);
		setFrom(null);
		// Dragged, b clicks softly onto the parallel position.
		setPhi(snap && Math.abs(d) < 1.5 ? 0 : Math.max(-MAX_TURN, Math.min(MAX_TURN, Math.round(d))));
	};
	const drag = (pt: V) => {
		const d = add(pt, scale(B, -1));
		if (Math.hypot(d.x, d.y) < 0.2) return;
		let deg = (Math.atan2(d.y, d.x) * 180) / Math.PI;
		if (d.x < 0) deg = deg > 0 ? deg - 180 : deg + 180;
		set(deg, true);
	};
	const makeParallel = () => {
		setFrom(phi);
		void go(0, 0).then(() =>
			go(1).then(() => {
				setPhi(0);
				setFrom(null);
			})
		);
	};

	const ends = (P: V, dir: V, s0: number, s1: number) => {
		const a = f.px(add(P, scale(dir, s0))), b = f.px(add(P, scale(dir, s1)));
		return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
	};
	const u = polar(1, rad(shown));
	const handleAt = add(B, scale(u, 2.45));
	const labelB = add(B, scale(u, 2.72));

	const name = (n: number) => `\\hat{${n}}`;
	let caption;
	if (k.supplementary) {
		caption = parallel ? (
			<>
				<Tex>{`${name(p)} + ${name(q)} = ${x}^\\circ + ${y}^\\circ = 180^\\circ`}</Tex>: i coniugati sono supplementari, e <Tex>{'b \\parallel a'}</Tex>.
			</>
		) : (
			<>
				<Tex>{`${name(p)} + ${name(q)} = ${x}^\\circ + ${y}^\\circ = ${x + y}^\\circ`}</Tex>, non <Tex>{'180^\\circ'}</Tex>: b non è parallela ad a. Ruota b finché la somma fa <Tex>{'180^\\circ'}</Tex>.
			</>
		);
	} else {
		caption = parallel ? (
			<>
				<Tex>{'b \\parallel a'}</Tex>: <Tex>{`${name(p)}`}</Tex> e <Tex>{`${name(q)}`}</Tex> sono congruenti, <Tex>{`${x}^\\circ`}</Tex> tutti e due.
			</>
		) : (
			<>
				b non è parallela ad a: <Tex>{`${name(p)}`}</Tex> e <Tex>{`${name(q)}`}</Tex> sono ancora {k.name}, ma misurano <Tex>{`${x}^\\circ`}</Tex> e <Tex>{`${y}^\\circ`}</Tex>. Ruota b finché sono congruenti.
			</>
		);
	}

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{[p, q].map((n, i) => {
					const g = list[n - 1];
					return (
						<g key={n}>
							<path d={f.sector(g.P, polar(1, rad(g.from)), polar(1, rad(g.to)), 0.3)} fill={i ? TINT.orange : TINT.blue20} />
							<path d={f.arc(g.P, polar(1, rad(g.from)), polar(1, rad(g.to)), 0.3)} fill="none" stroke="#000" strokeWidth={THIN} />
						</g>
					);
				})}
				<line {...ends(A, v(1, 0), -2.4, 1.8)} stroke="#000" strokeWidth={THICK} />
				<line {...ends(B, u, -1.5, 2.7)} stroke="#000" strokeWidth={THICK} />
				<line {...ends(B, T, -0.85, (Y_A + 0.85 * T.y) / T.y)} stroke={T_BLUE} strokeWidth={THICK} />
				<Label f={f} at={add(A, v(1.8, 0))} dir={v(1, 0)}>a</Label>
				<Label f={f} at={labelB} dir={v(1, 0)}>b</Label>
				<Label f={f} at={add(A, scale(T, 0.85))} dir={v(0, 1)}>t</Label>
				{list.map((g, i) => (
					<HatNumber key={i} f={f} at={add(g.P, polar(0.56, rad((g.from + g.to) / 2)))} n={i + 1} />
				))}
				<Handle f={f} at={handleAt} onMove={drag} label="La retta b, che gira intorno al punto in cui la taglia t" step={0.1} />
			</Drawing>

			<Caption>{caption}</Caption>

			<Readout>
				<span>
					<Tex>{`${name(p)} = ${x}^\\circ`}</Tex>
				</span>
				<span>
					<Tex>{`${name(q)} = ${y}^\\circ`}</Tex>
				</span>
				<span>{parallel ? <Tex>{'b \\parallel a'}</Tex> : 'b non è parallela ad a'}</span>
			</Readout>

			<Controls>
				<div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Coppia di angoli da evidenziare">
					{KINDS.map((kk, i) => (
						<Chip
							key={kk.key}
							on={i === kind}
							onClick={() => {
								setKind(i);
								setWhich(0);
							}}
						>
							{kk.name}
						</Chip>
					))}
				</div>
				<Slider label="Rotazione di b" value={phi} min={-MAX_TURN} max={MAX_TURN} step={1} unit="°" onChange={(d) => set(d)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={() => setWhich((w) => (w + 1) % k.pairs.length)}>
						<ArrowRightLeft className="size-4" aria-hidden="true" />
						Altra coppia
					</Button>
					<Button variant="secondary" size="sm" onClick={makeParallel} disabled={parallel || running}>
						<Equal className="size-4" aria-hidden="true" />
						Rendi b parallela ad a
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
