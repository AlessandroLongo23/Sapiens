'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { add, Caption, clamp, Controls, DASH, Drawing, Figure, frame, Label, num, Readout, sub, THICK, THIN, TINT, Tex, usePieceDrag, useTween, v, type V } from './kit';

/** A number for KaTeX: {,} keeps the decimal comma from being set as punctuation, with a space after it. */
const tn = (x: number, digits?: number) => num(x, digits).replace(',', '{,}');

/**
 * Lesson 98, the parallelogram: the triangle AHD slides along AB by the length of AB and lands on BKC, and the
 * parallelogram ABCD becomes the rectangle HKCD. The twin of TrapezioTriangolo, drawn like the TikZ figure
 * `parallelogramma-equivalente-rettangolo`. The slide is a translation, so the student drags the triangle along the
 * base; let go, it glides to the nearer end. The button does the whole slide either way.
 */

/** Base AB, height DH, and the angle at A in degrees. */
type Shape = { b: number; h: number; alpha: number };
const START: Shape = { b: 3.8, h: 2.1, alpha: 61 };
const RANGE = { b: [2, 3.8], h: [1, 2.2], alpha: [45, 90] } as const;

/** H must fall on AB (AH ≤ AB), or AHD and HBCD are no longer the two pieces of the parallelogram. */
const minAlpha = (s: Shape) => Math.max(RANGE.alpha[0], Math.ceil((Math.atan2(s.h, s.b) * 180) / Math.PI));
const fit = (s: Shape): Shape => ({ ...s, alpha: clamp(s.alpha, minAlpha(s), RANGE.alpha[1]) });

function geometry({ b, h, alpha }: Shape) {
	// At 90° the offset is exactly 0: the parallelogram is already a rectangle.
	const dx = alpha >= 90 ? 0 : h / Math.tan((alpha * Math.PI) / 180);
	return { A: v(0, 0), B: v(b, 0), C: v(b + dx, h), D: v(dx, h), H: v(dx, 0), K: v(b + dx, 0), dx };
}

// The widest shape: the longest base with the longest offset, AH = h at 45°.
const f = frame(-0.6, RANGE.b[1] + RANGE.h[1] + 0.6, -0.6, RANGE.h[1] + 0.45);

export default function ParallelogrammaRettangolo({ alt }: { alt?: string }) {
	const [shape, setShape] = useState(START);
	const { A, B, C, D, H, K, dx } = geometry(shape);
	const [t, go] = useTween(0, 1100);
	// Where the triangle is while it is dragged: pointer events can come faster than renders.
	const pos = useRef(0);
	pos.current = t;

	const drag = usePieceDrag(
		f,
		(d) => {
			pos.current = clamp(pos.current + d.x / shape.b, 0, 1);
			void go(pos.current, 0);
		},
		() => void go(pos.current > 0.5 ? 1 : 0, 450)
	);
	const toggle = () => void go(t > 0.5 ? 0 : 1);
	const key = (e: KeyboardEvent) => {
		if (e.key !== 'Enter' && e.key !== ' ') return;
		e.preventDefault();
		toggle();
	};

	const set = (k: keyof Shape) => (x: number) => setShape((s) => fit({ ...s, [k]: x }));

	// The moving triangle: AHD shifted along AB.
	const shift = v(t * shape.b, 0);
	const [tA, tH, tD] = [A, H, D].map((p) => add(p, shift));
	const flat = dx < 1e-9;
	const done = t === 1;
	const line = (P: V, Q: V, w: number, dash?: string) => (
		<line x1={f.px(P).x} y1={f.px(P).y} x2={f.px(Q).x} y2={f.px(Q).y} stroke="#000" strokeWidth={w} strokeDasharray={dash} pointerEvents="none" />
	);
	// The outline is thick where it is the outline of the whole figure: ABCD at the start, HKCD at the end.
	const lerpW = (from: number, to: number) => from + (to - from) * t;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* The two places of the triangle, dashed as in the figure. */}
				{!flat && <polygon points={f.pts(B, K, C)} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />}
				{!flat && <polygon points={f.pts(A, H, D)} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />}
				{!flat && <polyline points={f.right(K, v(-1, 0), v(0, 1))} fill="none" stroke="#000" strokeWidth={THIN} />}
				{!flat && <path d={f.arc(B, v(1, 0), sub(C, B), 0.35)} fill="none" stroke="#000" strokeWidth={THIN} />}
				{!flat && <path d={f.tick(K, C, 2)} stroke="#000" strokeWidth={THIN} />}

				{/* HBCD stays where it is. */}
				<polygon points={f.pts(H, B, C, D)} fill={TINT.blue} />
				{line(H, B, THICK)}
				{line(B, C, lerpW(THICK, THIN))}
				{line(C, D, THICK)}
				{line(D, H, lerpW(THIN, THICK))}
				{!flat && <path d={f.tick(B, C)} stroke="#000" strokeWidth={THIN} />}

				{!flat && (
					<g
						role="button"
						tabIndex={0}
						aria-label={done ? 'Triangolo AHD, ora su BKC: premi Invio per riportarlo indietro' : 'Triangolo AHD: premi Invio per farlo scorrere fino a BKC'}
						onKeyDown={key}
						className="outline-none focus-visible:[&>polygon]:stroke-[var(--accent)]"
					>
						<polygon points={f.pts(tA, tH, tD)} fill={TINT.orange} stroke="transparent" strokeWidth={2} {...drag} />
						{line(tA, tH, THICK)}
						{line(tA, tD, THICK)}
						{line(tH, tD, lerpW(THIN, THICK))}
						<polyline points={f.right(tH, v(1, 0), v(0, 1))} fill="none" stroke="#000" strokeWidth={THIN} pointerEvents="none" />
						<path d={f.arc(tA, v(1, 0), sub(tD, tA), 0.35)} fill="none" stroke="#000" strokeWidth={THIN} pointerEvents="none" />
						<path d={f.tick(tA, tD)} stroke="#000" strokeWidth={THIN} pointerEvents="none" />
						<path d={f.tick(tH, tD, 2)} stroke="#000" strokeWidth={THIN} pointerEvents="none" />
					</g>
				)}

				<Label f={f} at={A} dir={v(-0.7, -0.7)}>A</Label>
				<Label f={f} at={B} dir={v(flat ? 0.7 : 0, -1)}>B</Label>
				<Label f={f} at={C} dir={v(0.7, 0.7)}>C</Label>
				<Label f={f} at={D} dir={v(-0.7, 0.7)}>D</Label>
				{!flat && <Label f={f} at={H} dir={v(0, -1)}>H</Label>}
				{!flat && <Label f={f} at={K} dir={v(0, -1)}>K</Label>}
			</Drawing>

			<Caption>
				{flat
					? "Con l'angolo in A di 90° il parallelogramma è già un rettangolo: H coincide con A, K con B, e i due triangoli sono schiacciati su un segmento."
					: done
						? 'Il triangolo AHD è sopra BKC: il parallelogramma ABCD è diventato il rettangolo HKCD, con la stessa base e la stessa altezza.'
						: 'Trascina il triangolo arancione lungo la base: scorre fino a BKC.'}
			</Caption>

			<Readout>
				<Tex>{`\\overline{AB} = ${tn(shape.b)}`}</Tex>
				<Tex>{`\\overline{DH} = ${tn(shape.h)}`}</Tex>
				<Tex>{`\\text{area} = ${tn(shape.b)} \\cdot ${tn(shape.h)} = ${tn(shape.b * shape.h)}`}</Tex>
			</Readout>

			<Button variant="secondary" size="sm" onClick={toggle} disabled={flat}>
				{t > 0.5 && !flat ? <ArrowLeft className="size-4" aria-hidden="true" /> : <ArrowRight className="size-4" aria-hidden="true" />}
				{t > 0.5 && !flat ? 'Torna al parallelogramma' : 'Trasforma in rettangolo'}
			</Button>

			<Controls>
				<Slider label="Base AB" value={shape.b} min={RANGE.b[0]} max={RANGE.b[1]} onChange={set('b')} />
				<Slider label="Altezza DH" value={shape.h} min={RANGE.h[0]} max={RANGE.h[1]} onChange={set('h')} />
				<Slider label="Angolo in A" value={shape.alpha} min={minAlpha(shape)} max={RANGE.alpha[1]} step={1} unit="°" onChange={set('alpha')} />
			</Controls>
		</Figure>
	);
}
