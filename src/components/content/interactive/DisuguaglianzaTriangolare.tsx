'use client';

import { useState } from 'react';
import { Link2, Unlink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ButtonRow, Caption, Controls, DASH, Dot, Drawing, Figure, Handle, INK, Label, Readout, Tex, THICK, THIN, TINT, add, ang, clamp, dist, frame, num, polar, sub, useTween, v, type V } from './kit';

/**
 * Lesson 59, the triangle inequality: the base AB and two sides hinged at A and B that swing on their arcs. The
 * student sets the three lengths and tries to close the triangle, by dragging the free ends or with the button, which
 * takes the two ends as close as they can get: onto the same point when a triangle exists, flat on the line AB with
 * the gap between them when it does not. That closest pose moves continuously with the lengths, so the limit case
 * (a = b + c) is reached by sliding, and the sides are seen lying down on the base.
 *
 * Names as in the lesson: a = BC (the side from B), b = AC (the side from A), c = AB (the base).
 */

/** Centimetres per unit of length: the TikZ figure draws 8 as 4 cm; here AB up to 12 must fit on a phone. */
const S = 0.32;
/** The base goes up to 12 (the lesson's 5, 7, 12), the two sides up to 10, so every pose fits the drawing. */
const MAX_C = 12;
const MAX_SIDE = 10;
const f = frame(-3.45, 3.45, -0.75, 3.45);
const ROD = '#000099'; // blue!60!black
const ARC = INK.gray;

type Sides = { a: number; b: number; c: number };
type Pose = { tA: number; tB: number };

const ends = ({ c }: Sides) => ({ A: v((-c * S) / 2, 0), B: v((c * S) / 2, 0) });

/** The two ends as close as they get: the vertex C when it exists, else both sides flat on the line AB. */
function closest({ a, b, c }: Sides): Pose {
	const x = (b * b - a * a + c * c) / (2 * c); // from A, along AB
	const y2 = b * b - x * x;
	if (y2 >= 0) {
		const y = Math.sqrt(y2);
		return { tA: Math.atan2(y, x), tB: Math.atan2(y, x - c) };
	}
	if (c > a + b) return { tA: 0, tB: Math.PI };
	if (b > a + c) return { tA: 0, tB: 0 };
	return { tA: Math.PI, tB: Math.PI };
}

/** The angle of a side of length r hinged at P towards the pointer, kept above AB and inside the drawing. */
function swing(P: V, r: number, pointer: V) {
	const d = sub(pointer, P);
	let t = d.y >= 0 ? ang(d) : d.x >= 0 ? 0 : Math.PI;
	const lo = Math.acos(clamp((f.x1 - 0.15 - P.x) / r, -1, 1)); // the end stays left of the right edge
	const hi = Math.acos(clamp((f.x0 + 0.15 - P.x) / r, -1, 1)); // and right of the left edge
	t = clamp(t, lo, hi);
	// Not above the top either.
	const top = (f.y1 - 0.25) / r;
	if (top < 1 && Math.sin(t) > top) t = t < Math.PI / 2 ? Math.asin(top) : Math.PI - Math.asin(top);
	return t;
}

const OPEN: Pose = { tA: (65 * Math.PI) / 180, tB: (115 * Math.PI) / 180 };
const PRESETS: { label: string; sides: Sides }[] = [
	{ label: '3, 4, 8', sides: { a: 4, b: 3, c: 8 } },
	{ label: '5, 7, 12', sides: { a: 7, b: 5, c: 12 } },
	{ label: '6, 8, 10', sides: { a: 8, b: 6, c: 10 } }
];

export default function DisuguaglianzaTriangolare({ alt }: { alt?: string }) {
	const [sides, setSides] = useState<Sides>(PRESETS[0].sides);
	const [pose, setPose] = useState<Pose>(OPEN);
	/** The ends are held together (or as close as they get): the pose follows the lengths. */
	const [joined, setJoined] = useState(false);
	const [anim, setAnim] = useState<{ from: Pose; to: Pose; join: boolean } | null>(null);
	const [t, go, running] = useTween(0, 900);

	const { a, b, c } = sides;
	const { A, B } = ends(sides);
	const shown: Pose = anim ? { tA: anim.from.tA + (anim.to.tA - anim.from.tA) * t, tB: anim.from.tB + (anim.to.tB - anim.from.tB) * t } : joined ? closest(sides) : pose;
	const PA = add(A, polar(b * S, shown.tA));
	const PB = add(B, polar(a * S, shown.tB));

	const exists = a < b + c && b < a + c && c < a + b;
	const flat = !exists && a <= b + c && b <= a + c && c <= a + b; // one side equals the sum of the other two
	const settled = joined && !anim;
	const together = settled && (exists || flat);
	const gap = dist(PA, PB) / S;

	const animate = (to: Pose, join: boolean) => {
		const from = shown;
		setAnim({ from, to, join });
		setJoined(false);
		void go(0, 0).then(() =>
			go(1).then(() => {
				setPose(to);
				setJoined(join);
				setAnim(null);
			})
		);
	};
	const stop = () => {
		if (anim) void go(0, 0);
		setAnim(null);
	};

	const drag = (which: 'A' | 'B') => (p: V) => {
		stop();
		const next = which === 'A' ? { ...shown, tA: swing(A, b * S, p) } : { ...shown, tB: swing(B, a * S, p) };
		const C = closest(sides);
		const qa = add(A, polar(b * S, next.tA));
		const qb = add(B, polar(a * S, next.tB));
		// The ends click together when they come close and a triangle (or the flat limit) is there to close.
		if ((exists || flat) && dist(qa, qb) < 0.22) {
			setPose(C);
			setJoined(true);
			return;
		}
		setPose(next);
		setJoined(false);
	};

	const change = (key: keyof Sides) => (x: number) => {
		stop();
		setSides((s) => ({ ...s, [key]: x }));
	};
	const preset = (s: Sides) => {
		stop();
		setSides(s);
		setJoined(false);
		setPose(OPEN);
	};

	// The three inequalities, with the numbers, each one true or false.
	const rows: [string, number, number, number, string][] = [
		['a < b + c', a, b, c, 'a'],
		['b < a + c', b, a, c, 'b'],
		['c < a + b', c, a, b, 'c']
	];
	const longest = Math.max(a, b, c);
	const sumOthers = a + b + c - longest;
	const others = longest === c ? [a, b] : longest === a ? [b, c] : [a, c];
	const sumText = `${num(others[0])} + ${num(others[1])}`;

	let caption: string;
	if (together && exists) caption = `I due lati si chiudono nel triangolo ABC: il lato più lungo, ${num(longest)}, è minore della somma degli altri due, ${sumText} = ${num(sumOthers)}.`;
	else if (together && flat) caption = `${num(longest)} = ${sumText}: i due lati si chiudono solo distesi su una retta, con A, B, C allineati. Il triangolo non esiste.`;
	else if (settled) caption = `${num(longest)} è maggiore di ${sumText} = ${num(sumOthers)}: anche distesi sulla retta AB i due lati non si toccano, e restano a ${num(gap)} di distanza. Il triangolo non esiste.`;
	else caption = 'Trascina gli estremi dei due lati blu sui loro archi, o premi «Chiudi il triangolo». Cambia le lunghezze con i cursori.';

	const C = together ? PA : null;
	const tri = together && exists;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* Where the free ends can go: two half circles, dashed like the arcs of the TikZ figure. */}
				<path d={f.arc(A, v(1, 0), v(-1, 0.0001), b * S)} fill="none" stroke={ARC} strokeWidth={THIN} strokeDasharray={DASH} />
				<path d={f.arc(B, v(1, 0), v(-1, 0.0001), a * S)} fill="none" stroke={ARC} strokeWidth={THIN} strokeDasharray={DASH} />
				{tri && <polygon points={f.pts(A, B, PA)} fill={TINT.blue} />}

				<line {...seg(A, B)} stroke="#000" strokeWidth={THICK} />
				{/* The gap the two sides cannot close, when they lie flat. */}
				{settled && !exists && !flat && <line {...seg(PA, PB)} stroke={INK.red} strokeWidth={2.4} />}
				<line {...seg(A, PA)} stroke={ROD} strokeWidth={THICK * 1.4} strokeLinecap="round" />
				<line {...seg(B, PB)} stroke={ROD} strokeWidth={THICK * 1.4} strokeLinecap="round" />

				<Dot f={f} at={A} />
				<Dot f={f} at={B} />
				<Label f={f} at={A} dir={v(0, -1)}>A</Label>
				<Label f={f} at={B} dir={v(0, -1)}>B</Label>
				{C && !flat && <Label f={f} at={C} dir={v(0, 1)}>C</Label>}
				<Label f={f} at={v(0, 0)} dir={v(0, -1)} upright>{num(c)}</Label>
				<Label f={f} at={sideMid(A, PA)} dir={normal(A, PA, B)} upright color={ROD}>{num(b)}</Label>
				<Label f={f} at={sideMid(B, PB)} dir={normal(B, PB, A)} upright color={ROD}>{num(a)}</Label>
				{settled && !exists && !flat && (
					<Label f={f} at={add(sideMid(PA, PB), v(0, 0.42))} dir={v(0, 1)} upright color={INK.red}>{`manca ${num(gap)}`}</Label>
				)}

				<Handle f={f} at={PA} onMove={drag('A')} label={`Estremo del lato lungo ${num(b)} che parte da A`} color={ROD} step={0.15} />
				<Handle f={f} at={PB} onMove={drag('B')} label={`Estremo del lato lungo ${num(a)} che parte da B`} color={ROD} step={0.15} />
			</Drawing>

			<Caption>{caption}</Caption>

			<Readout>
				{rows.map(([name, x, y, z, key]) => {
					const ok = x < y + z;
					return (
						<span key={key}>
							<Tex>{name}</Tex>: <Tex>{`${num(x)} ${ok ? '<' : x === y + z ? '=' : '>'} ${num(y)} + ${num(z)}`}</Tex> {ok ? 'vera' : 'falsa'}
						</span>
					);
				})}
			</Readout>

			<ButtonRow>
				{settled ? (
					<Button variant="secondary" size="sm" onClick={() => animate(OPEN, false)} disabled={running}>
						<Unlink className="size-4" aria-hidden="true" />
						Apri i lati
					</Button>
				) : (
					<Button variant="secondary" size="sm" onClick={() => animate(closest(sides), true)} disabled={running}>
						<Link2 className="size-4" aria-hidden="true" />
						Chiudi il triangolo
					</Button>
				)}
			</ButtonRow>

			<Controls>
				<Slider label="Lato AB (c)" value={c} min={1} max={MAX_C} step={0.5} onChange={change('c')} />
				<Slider label="Lato da A (b)" value={b} min={1} max={MAX_SIDE} step={0.5} onChange={change('b')} />
				<Slider label="Lato da B (a)" value={a} min={1} max={MAX_SIDE} step={0.5} onChange={change('a')} />
				<div className="flex flex-wrap items-center justify-center gap-2 text-sm text-fg-muted">
					<span>Gli esempi della lezione:</span>
					{PRESETS.map((p) => (
						<Button key={p.label} variant="secondary" size="sm" onClick={() => preset(p.sides)}>
							{p.label}
						</Button>
					))}
				</div>
			</Controls>
		</Figure>
	);

	function seg(P: V, Q: V) {
		const p = f.px(P), q = f.px(Q);
		return { x1: p.x, y1: p.y, x2: q.x, y2: q.y };
	}
}

const sideMid = (P: V, Q: V) => v((P.x + Q.x) / 2, (P.y + Q.y) / 2);
/** The side of PQ away from R, as a direction for its label. */
function normal(P: V, Q: V, R: V) {
	const d = sub(Q, P);
	const l = Math.hypot(d.x, d.y) || 1;
	let n = v(-d.y / l, d.x / l);
	const m = sideMid(P, Q);
	if ((R.x - m.x) * n.x + (R.y - m.y) * n.y > 0) n = v(-n.x, -n.y);
	// A side lying on AB keeps its number above the line, where the base's number is not.
	if (Math.abs(d.y) < 1e-9) n = v(0, 1);
	return n;
}
