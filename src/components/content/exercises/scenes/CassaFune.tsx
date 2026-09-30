'use client';

import { Drawing, Label, frame, v, add, scale, polar, FONT_SIZE, FONT_MATH, THIN, DASH, type V } from '@/components/content/interactive/kit';
import { Arrow, Block, Ground, Thread, Vector, QTY } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * A crate on a horizontal floor pulled by a force (lesson 59, Il lavoro di una forza; group 17). The force leaves the
 * middle of the crate's right side at `angolo` degrees above the horizontal (0 when it is horizontal), along a rope, and is labelled
 * `forza` ('F = 40 N'); the angle is marked and written `testoAngolo` ('30°') when given. Under the floor the
 * displacement, to the right, labelled `spostamento` ('s = 5,0 m'). The arrows are not to scale: the scene shows the
 * data, the work is the student's.
 *
 *   { type: 'cassa-fune', data: { angolo: 30, testoAngolo: '30°', forza: 'F = 50 N', spostamento: 's = 8,0 m' } }
 */

const BW = 1.1, BH = 0.7;
const FL = 1.5; // force arrow, cm
const ROPE = 2.2; // rope, cm from where it is tied
/** Points rounded to 1/10000 cm: the page renders on the server too, and sine and cosine may differ in the last bit there. */
const rd = (p: V) => v(Math.round(p.x * 1e4) / 1e4, Math.round(p.y * 1e4) / 1e4);

/** "F = 50 N" with the letter in italics and the rest upright. */
function Named({ text }: { text: string }) {
	const m = /^(\S+) = (.*)$/.exec(text);
	if (!m) return <>{text}</>;
	return (
		<>
			<tspan fontStyle="italic" fontFamily={FONT_MATH}>
				{m[1]}
			</tspan>
			{` = ${m[2]}`}
		</>
	);
}

export default function CassaFune({ data, alt }: SceneProps) {
	const deg = Math.min(85, Math.max(0, Number(data.angolo ?? 0)));
	const a = (deg * Math.PI) / 180;
	const u = rd(polar(1, a));
	const at = v(BW / 2, BH / 2); // the rope is tied to the middle of the crate's right side
	const tip = rd(add(at, scale(u, FL)));
	const hand = rd(add(at, scale(u, ROPE)));
	const s0 = v(-BW / 2, -0.55), s1 = v(2.6, -0.55);
	const f = frame(-1.7, Math.max(3.4, hand.x + 0.4, deg < 5 ? tip.x + 0.4 : 0), -1.05, Math.max(1.5, hand.y + 0.35));
	const labelDir = deg < 5 ? v(0, 1) : rd(v(-Math.sin(a), Math.cos(a)));

	return (
		<Drawing f={f} label={alt}>
			<Ground f={f} from={v(-1.6, 0)} to={v(f.x1 - 0.1, 0)} />
			<Block f={f} at={v(0, 0)} w={BW} h={BH} />
			<Thread f={f} from={at} to={hand} />
			<circle cx={f.px(hand).x} cy={f.px(hand).y} r={2.2} fill="#000" />
			{deg > 0 && (
				<>
					<path d={f.path([at, add(at, v(0.95, 0))])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
					<path d={f.arc(at, v(1, 0), u, 0.55)} stroke="#000" strokeWidth={THIN} fill="none" />
				</>
			)}
			{deg > 0 && typeof data.testoAngolo === 'string' && (
				<Label f={f} at={rd(add(at, polar(0.82, Math.max(a / 2, 0.16))))} dir={v(0.6, 0)} upright size={FONT_SIZE * 0.8}>
					{data.testoAngolo}
				</Label>
			)}
			<Vector f={f} from={at} to={tip} color={QTY.forza} />
			{typeof data.forza === 'string' && (
				<Label f={f} at={rd(add(at, scale(u, FL / 2)))} dir={labelDir} upright size={FONT_SIZE * 0.85} color={QTY.forza}>
					<Named text={data.forza} />
				</Label>
			)}
			<Arrow f={f} from={s0} to={s1} color={QTY.vettore} />
			{typeof data.spostamento === 'string' && (
				<Label f={f} at={v((s0.x + s1.x) / 2, s0.y)} dir={v(0, -1)} upright size={FONT_SIZE * 0.85} color={QTY.vettore}>
					<Named text={data.spostamento} />
				</Label>
			)}
		</Drawing>
	);
}
