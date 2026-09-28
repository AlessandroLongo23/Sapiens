'use client';

import { useState } from 'react';
import { RotateCcw, StepForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { add, Caption, clamp, Controls, DASH, Drawing, Figure, frame, Handle, INK, K as SCALE, Label, lerp, num, Readout, sub, THICK, THIN, TINT, Tex, useTween, v, type V } from './kit';

/** A number for KaTeX: {,} keeps the decimal comma from being set as punctuation, with a space after it. */
const tn = (x: number, digits?: number) => num(x, digits).replace(',', '{,}');

/**
 * Lesson 100, first theorem of Euclid, the two moves of the written proof on the figures
 * `euclide-quadrato-parallelogramma` and `euclide-parallelogramma-rettangolo` (same letters, colours and scale):
 *
 * - step 4: the square ACDE keeps its base AC while the opposite side ED slides along the line DE to LG, and it
 *   becomes the parallelogram ACGL (same base, same height);
 * - step 5: with AL as its base, the parallelogram slides with its base on the line FL, from AL to AF, and its
 *   opposite side on the line CK, from CG to HK: it becomes the rectangle AHKF (congruent bases, same height AH).
 *
 * One t from 0 to 2 plays both; every intermediate shape is a parallelogram with the same area. The student moves C
 * on the semicircle on AB to change the triangle.
 */

const c = 3.1;
const ALPHA = [20, 70] as const;
const ORANGE_DARK = '#b35900'; // orange!70!black
const f = frame(-2.15, c + 0.65, -c - 0.6, 1.5 * c + 0.5);

/** The whole construction for the angle α at A (degrees). */
function geometry(alpha: number) {
	const k = (alpha * Math.PI) / 180;
	const A = v(0, 0), B = v(c, 0);
	const C = v(c * Math.cos(k) ** 2, c * Math.cos(k) * Math.sin(k));
	const E = v(-C.y, C.x); // AC turned a quarter turn, away from the triangle
	const D = add(C, E);
	const L = v(0, c), G = v(C.x, C.y + c), F = v(0, -c), H = v(C.x, 0), K = v(C.x, -c);
	return { A, B, C, D, E, F, G, H, K, L };
}

export default function EuclidePrimoTeorema({ alt }: { alt?: string }) {
	const [alpha, setAlpha] = useState((Math.acos(0.6) * 180) / Math.PI);
	const [stage, setStage] = useState(0);
	const [t, go] = useTween(0, 1300);
	const { A, B, C, D, E, F, G, H, K, L } = geometry(alpha);

	// The orange piece: ACDE → ACGL → FKHA (the rectangle AHKF).
	const u1 = clamp(t, 0, 1), u2 = clamp(t - 1, 0, 1);
	const piece = [lerp(A, F, u2), lerp(C, K, u2), lerp(lerp(D, G, u1), H, u2), lerp(lerp(E, L, u1), A, u2)];

	const next = () => {
		const s = (stage + 1) % 3;
		setStage(s);
		void go(s, s === 0 ? 1600 : 1300);
	};
	const moveC = (p: V) => {
		// C stays on the semicircle on AB: its angle at the centre is twice the angle at A.
		const beta = Math.atan2(Math.max(p.y, 0), p.x - c / 2);
		setAlpha(clamp((beta * 90) / Math.PI, ALPHA[0], ALPHA[1]));
	};

	const ln = (P: V, Q: V, w = THIN, color = '#000', dash?: string) => (
		<line x1={f.px(P).x} y1={f.px(P).y} x2={f.px(Q).x} y2={f.px(Q).y} stroke={color} strokeWidth={w} strokeDasharray={dash} />
	);
	const scale10 = 10 / c;
	const AC = Math.hypot(C.x, C.y) * scale10, AH = H.x * scale10;
	const lineDE = [E.x < G.x ? E : G, E.x < G.x ? G : E];

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* The square ACDE, which stays as a reference, and the rectangle AHKF, where the piece ends. */}
				<polygon points={f.pts(A, C, D, E)} fill={TINT.blue} stroke="#000" strokeWidth={THIN} />
				<polygon points={f.pts(A, H, K, F)} fill="none" stroke="#000" strokeWidth={THIN} />
				{ln(lineDE[0], lineDE[1], THIN, INK.gray, DASH)}
				{ln(F, L, THIN, INK.gray, DASH)}
				{ln(K, G, THIN, INK.gray, DASH)}
				<polygon points={f.pts(A, B, C)} fill="#f5f5ff" />

				<polygon points={f.pts(...piece)} fill={TINT.orange} stroke={ORANGE_DARK} strokeWidth={THICK} strokeLinejoin="round" />

				{/* The semicircle on AB where C can go. */}
				<path d={`M${f.px(B).x},${f.px(B).y} A${(c / 2) * SCALE},${(c / 2) * SCALE} 0 0 0 ${f.px(A).x},${f.px(A).y}`} fill="none" stroke={INK.gray} strokeWidth={THIN} strokeDasharray="2 3" />
				<polygon points={f.pts(A, B, C)} fill="none" stroke="#000" strokeWidth={THICK} />
				<polyline points={f.right(C, sub(A, C), sub(B, C), 0.16)} fill="none" stroke="#000" strokeWidth={THIN} />
				{t === 0 && <polyline points={f.right(E, sub(A, E), sub(D, E), 0.16)} fill="none" stroke="#000" strokeWidth={THIN} />}
				{t === 0 && <path d={`${f.tick(A, E)} ${f.tick(A, C)}`} stroke="#000" strokeWidth={THIN} />}
				{t === 2 && <polyline points={f.right(A, v(0, -1), v(1, 0), 0.16)} fill="none" stroke="#000" strokeWidth={THIN} />}
				{t >= 1 && <path d={`${f.tick(A, L, 2)} ${f.tick(A, F, 2)}`} stroke="#000" strokeWidth={THIN} />}

				<Label f={f} at={A} dir={v(-0.7, -0.7)}>A</Label>
				<Label f={f} at={B} dir={v(0.7, -0.7)}>B</Label>
				<Label f={f} at={C} dir={v(1, 0)}>C</Label>
				<Label f={f} at={D} dir={v(-0.7, 0.7)}>D</Label>
				<Label f={f} at={E} dir={v(-1, 0)}>E</Label>
				<Label f={f} at={F} dir={v(-0.7, -0.7)}>F</Label>
				<Label f={f} at={H} dir={v(0.7, -0.7)}>H</Label>
				<Label f={f} at={K} dir={v(0.7, -0.7)}>K</Label>
				<Label f={f} at={L} dir={v(-0.7, 0.7)}>L</Label>
				<Label f={f} at={G} dir={v(0.7, 0.7)}>G</Label>
				<Handle f={f} at={C} onMove={moveC} label="Vertice C, sulla semicirconferenza di diametro AB" step={0.08} />
			</Drawing>

			<Caption>
				{t === 0
					? 'Il quadrato ACDE. Al passo 4 il lato ED scorre sulla retta DE fino a LG: il quadrato diventa il parallelogramma ACGL, con la stessa base AC e la stessa altezza. Trascina C per cambiare il triangolo.'
					: t === 1
						? 'Il parallelogramma ACGL è equivalente al quadrato. Al passo 5 prendi AL come base: la base scorre sulla retta FL fino ad AF, il lato CG sulla retta CK fino a HK.'
						: t === 2
							? 'Il parallelogramma è diventato il rettangolo AHKF, con i lati AF ≅ AB e AH: il quadrato ACDE è equivalente al rettangolo AHKF.'
							: 'Il pezzo arancione cambia forma ma resta un parallelogramma con la stessa base e la stessa altezza: la sua area non cambia.'}
			</Caption>

			<Readout>
				<span>
					Con <Tex>{'\\overline{AB} = 10'}</Tex>:
				</span>
				<Tex>{`\\overline{AC}^{\\,2} = ${tn(AC * AC)}`}</Tex>
				{/* AH to three decimals, so that ten times it is the number shown, to two. */}
				<Tex>{`\\overline{AB} \\cdot \\overline{AH} = 10 \\cdot ${tn(AH, 3)} = ${tn(10 * AH)}`}</Tex>
			</Readout>

			<Button variant="secondary" size="sm" onClick={next}>
				{stage === 2 ? <RotateCcw className="size-4" aria-hidden="true" /> : <StepForward className="size-4" aria-hidden="true" />}
				{stage === 0 ? 'Passo 4: verso il parallelogramma' : stage === 1 ? 'Passo 5: verso il rettangolo' : 'Torna al quadrato'}
			</Button>

			<Controls>
				<Slider label="Angolo in A" value={Math.round(alpha)} min={ALPHA[0]} max={ALPHA[1]} step={1} unit="°" onChange={setAlpha} />
			</Controls>
		</Figure>
	);
}
