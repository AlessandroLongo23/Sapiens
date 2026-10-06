'use client';

import { Drawing, frame, v, K, DASH, THICK, THIN, TINT } from '@/components/content/interactive/kit';
import { Words } from '@/components/content/interactive/fisica/calore';
import type { SceneProps } from '.';

/**
 * A box of two equal halves with `sinistra` molecules in the left one and `destra` in the right one (lesson 119): the
 * macrostate of the exercise, drawn like the interactive figure `molecole-due-meta-microstati`. The places are worked
 * out from the counts alone (a grid with a fixed offset per molecule), so the server and the browser draw the same.
 *
 *   { type: 'scatola-molecole', data: { sinistra: 3, destra: 5 } }
 */
const W = 5.4, H = 2.2;
const f = frame(-0.2, W + 0.2, -0.55, H + 0.15);

/** A number in [0, 1) that depends only on i and k: the fractional part of a large sine, rounded for the hydration. */
const jitter = (i: number, k: number) => {
	const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
	return Math.round((x - Math.floor(x)) * 1000) / 1000;
};

function places(count: number, x0: number) {
	const w = W / 2;
	const cols = Math.max(1, Math.ceil(Math.sqrt((count * w) / H)));
	const rows = Math.max(1, Math.ceil(count / cols));
	return Array.from({ length: count }, (_, i) => {
		const cx = (i % cols) + 0.5, cy = Math.floor(i / cols) + 0.5;
		return v(x0 + (cx / cols) * w + (jitter(i, 1) - 0.5) * (w / cols) * 0.45, (cy / rows) * H + (jitter(i, 2) - 0.5) * (H / rows) * 0.45);
	});
}

export default function ScatolaMolecole({ data, alt }: SceneProps) {
	const n = (x: unknown) => (typeof x === 'number' && x >= 0 && x <= 60 ? Math.round(x) : 0);
	const left = n(data.sinistra), right = n(data.destra);
	const a = f.px(v(0, H));
	return (
		<Drawing f={f} label={alt}>
			<rect x={a.x} y={a.y} width={W * K} height={H * K} fill={TINT.blue} stroke="#000" strokeWidth={THICK} />
			<path d={f.path([v(W / 2, 0), v(W / 2, H)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
			{[...places(left, 0), ...places(right, W / 2)].map((p, i) => {
				const c = f.px(p);
				return <circle key={i} cx={c.x} cy={c.y} r={0.09 * K} fill="#000099" />;
			})}
			<Words f={f} at={v(W / 4, -0.3)} size={12}>
				sinistra
			</Words>
			<Words f={f} at={v((3 * W) / 4, -0.3)} size={12}>
				destra
			</Words>
		</Drawing>
	);
}
