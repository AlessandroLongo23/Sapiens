'use client';

import type { ReactNode } from 'react';
import { v, add, sub, scale, unit, len, rot, polar, lerp, INK, TINT, THIN, THICK, DASH, FONT_SIZE, FONT, FONT_MATH, type V, type Frame } from './kit';

/**
 * The physics pieces of the kit: vectors, forces, blocks, ground, springs, threads, inclines and axes, drawn like
 * the TikZ code the physics lessons use for the same things (docs/lezioni/fisica/README.md, "Figure"), so a static
 * figure and an interactive one side by side look the same. Everything is in TikZ centimetres, y upwards.
 *
 * The same components draw the exercises' scenes (src/components/content/exercises/scenes/), without interaction.
 */

// ---------------------------------------------------------------- colours

/**
 * One colour per quantity, the same in TikZ and here (a proposal waiting for Andrea: vault, Domande per Andrea).
 * Components are the vector's colour, dashed.
 */
export const QTY = {
	/** A generic vector, a displacement. TikZ `blue`. */
	vettore: INK.blue,
	/** Forces. TikZ `red`. */
	forza: INK.red,
	/** Velocities. TikZ `blue!60!black`. */
	velocita: '#000099',
	/** Accelerations. TikZ `green!50!black`. */
	accelerazione: '#008000',
	/** The resultant of a sum, and anything that has to stand out from the others. TikZ `orange!90!black`. */
	risultante: '#e67300'
} as const;

// ---------------------------------------------------------------- arrows

/** TikZ `-{Stealth}` tips, measured on the compiled SVG (pt): length, half width, and where the notch is. */
const STEALTH = {
	thin: { len: 3.585, half: 1.35, inset: 0.671 },
	thick: { len: 4.169, half: 1.576, inset: 0.668 },
	veryThick: { len: 4.754, half: 1.802, inset: 0.666 }
} as const;
const PT = 1 / 28.4528; // one TeX point in centimetres

export type Weight = keyof typeof STEALTH;
const WIDTH: Record<Weight, number> = { thin: THIN, thick: THICK, veryThick: 1.8 };

/**
 * An arrow from `from` to `to` with TikZ's Stealth tip, as `\draw[-{Stealth}, thick, red] (from) -- (to);`. The line
 * stops at the tip's notch, as TikZ shortens it. `dashed` for components and projections.
 */
export function Arrow({ f, from, to, color = '#000', weight = 'thick', dashed = false, opacity }: { f: Frame; from: V; to: V; color?: string; weight?: Weight; dashed?: boolean; opacity?: number }) {
	const d = sub(to, from);
	const L = len(d);
	if (L < 1e-6) return null;
	const u = unit(d);
	const n = v(-u.y, u.x);
	const s = STEALTH[weight];
	const tipLen = Math.min(s.len * PT, L * 0.6);
	const k = tipLen / (s.len * PT);
	const back = sub(to, scale(u, tipLen));
	const notch = sub(to, scale(u, tipLen * s.inset));
	const half = s.half * PT * k;
	return (
		<g opacity={opacity} pointerEvents="none">
			<path d={f.path([from, notch])} stroke={color} strokeWidth={WIDTH[weight]} strokeDasharray={dashed ? DASH : undefined} fill="none" />
			<path d={f.path([to, add(back, scale(n, half)), notch, sub(back, scale(n, half))], true)} fill={color} />
		</g>
	);
}

/**
 * A vector's name with the arrow above, as `$\vec F_1$`: an italic letter, an optional upright or italic subscript,
 * set off from `at` in the direction `dir` like a TikZ node. With `bare` there is no arrow (a magnitude, F₁).
 */
export function VecLabel({ f, at, dir = v(0, 0), name, sub: subscript, color = '#000', bare = false, size = FONT_SIZE }: { f: Frame; at: V; dir?: V; name: string; sub?: string; color?: string; bare?: boolean; size?: number }) {
	const p = f.px(add(at, scale(dir, 0.22)));
	const w = size * 0.62 * name.length + (subscript ? size * 0.42 * subscript.length : 0);
	const x0 = dir.x > 0.3 ? p.x : dir.x < -0.3 ? p.x - w : p.x - w / 2;
	const base = dir.y > 0.3 ? p.y : dir.y < -0.3 ? p.y + size * 0.95 : p.y + size * 0.35;
	const letter = size * 0.62 * name.length;
	const top = base - size * 0.82;
	// \vec over an italic letter: a short arrow, shifted right with the letter's slant.
	const ax0 = x0 + size * 0.12, ax1 = x0 + letter * 0.85 + size * 0.12;
	return (
		<g pointerEvents="none">
			<text x={x0} y={base} fontSize={size} fontStyle="italic" fontFamily={FONT_MATH} fill={color}>
				{name}
				{subscript && (
					<tspan fontSize={size * 0.7} dy={size * 0.22} fontStyle={/^\d+$/.test(subscript) ? 'normal' : 'italic'} fontFamily={/^\d+$/.test(subscript) ? FONT : FONT_MATH}>
						{subscript}
					</tspan>
				)}
			</text>
			{!bare && (
				<g stroke={color} strokeWidth={0.7} fill="none">
					<path d={`M${ax0.toFixed(2)},${top.toFixed(2)} H${ax1.toFixed(2)}`} />
					<path d={`M${(ax1 - size * 0.14).toFixed(2)},${(top - size * 0.09).toFixed(2)} L${ax1.toFixed(2)},${top.toFixed(2)} L${(ax1 - size * 0.14).toFixed(2)},${(top + size * 0.09).toFixed(2)}`} />
				</g>
			)}
		</g>
	);
}

/**
 * A vector: the arrow and, if given, its name at the tip (or at `labelAt`, 0 the tail and 1 the tip). The direction
 * of the name defaults to the arrow's own, turned a quarter to the left, so it sits beside the line.
 */
export function Vector({ f, from, to, color = QTY.vettore, weight = 'thick', name, sub: subscript, labelAt = 1, labelDir, bare, dashed }: { f: Frame; from: V; to: V; color?: string; weight?: Weight; name?: string; sub?: string; labelAt?: number; labelDir?: V; bare?: boolean; dashed?: boolean }) {
	const u = unit(sub(to, from));
	const dir = labelDir ?? (labelAt >= 0.99 ? u : v(-u.y, u.x));
	return (
		<>
			<Arrow f={f} from={from} to={to} color={color} weight={weight} dashed={dashed} />
			{name && <VecLabel f={f} at={lerp(from, to, labelAt)} dir={dir} name={name} sub={subscript} color={color} bare={bare} />}
		</>
	);
}

/**
 * The components of the vector from `o` to `p` along x and y: dashed arrows on the axes through `o` and dashed
 * projection lines from the tip, as the lessons draw them. `names` are written `v_x`, `v_y` (letter, underscore,
 * subscript) and shown as scalars, without the arrow ($v_x$), unless `vectors` asks for $\vec v_x$.
 */
export function Components({ f, o, p, color = QTY.vettore, names, vectors = false }: { f: Frame; o: V; p: V; color?: string; names?: [string, string]; vectors?: boolean }) {
	const px = v(p.x, o.y), py = v(o.x, p.y);
	const split = (n: string) => { const [name, sub] = n.split('_'); return { name, sub: sub || undefined }; };
	return (
		<>
			<path d={f.path([p, px])} stroke={color} strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.7} />
			<path d={f.path([p, py])} stroke={color} strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.7} />
			{Math.abs(p.x - o.x) > 0.05 && <Arrow f={f} from={o} to={px} color={color} weight="thick" dashed />}
			{Math.abs(p.y - o.y) > 0.05 && <Arrow f={f} from={o} to={py} color={color} weight="thick" dashed />}
			{names && Math.abs(p.x - o.x) > 0.05 && <VecLabel f={f} at={lerp(o, px, 0.5)} dir={v(0, p.y >= o.y ? -1 : 1)} {...split(names[0])} color={color} bare={!vectors} />}
			{names && Math.abs(p.y - o.y) > 0.05 && <VecLabel f={f} at={lerp(o, py, 0.5)} dir={v(p.x >= o.x ? -1 : 1, 0)} {...split(names[1])} color={color} bare={!vectors} />}
		</>
	);
}

// ---------------------------------------------------------------- axes and grids

/**
 * Cartesian axes through `o`, from x0 to x1 and y0 to y1 (centimetres), with `\draw[->]` tips and their names.
 * `grid` draws TikZ's `\draw[very thin, gray!40] ... grid` with the given step.
 */
export function Axes({ f, o = v(0, 0), x0, x1, y0, y1, xName = 'x', yName = 'y', grid }: { f: Frame; o?: V; x0: number; x1: number; y0: number; y1: number; xName?: string; yName?: string; grid?: number }) {
	const lines: string[] = [];
	if (grid) {
		for (let x = Math.ceil(x0 / grid) * grid; x <= x1 + 1e-9; x += grid) lines.push(f.path([v(x, y0), v(x, y1)]));
		for (let y = Math.ceil(y0 / grid) * grid; y <= y1 + 1e-9; y += grid) lines.push(f.path([v(x0, y), v(x1, y)]));
	}
	return (
		<g pointerEvents="none">
			{grid && <path d={lines.join(' ')} stroke="#d6d6d6" strokeWidth={0.3} fill="none" />}
			<Arrow f={f} from={v(x0, o.y)} to={v(x1, o.y)} weight="thin" />
			<Arrow f={f} from={v(o.x, y0)} to={v(o.x, y1)} weight="thin" />
			<Name f={f} at={v(x1, o.y)} dir={v(0, -1)}>{xName}</Name>
			<Name f={f} at={v(o.x, y1)} dir={v(-1, 0)}>{yName}</Name>
		</g>
	);
}

/** A short italic name (an axis, a point), like a TikZ node with `$…$`. */
function Name({ f, at, dir, children }: { f: Frame; at: V; dir: V; children: ReactNode }) {
	const p = f.px(add(at, scale(dir, 0.2)));
	return (
		<text x={p.x} y={p.y} dy={dir.y < -0.3 ? '0.75em' : dir.y > 0.3 ? '0' : '0.35em'} textAnchor={dir.x > 0.3 ? 'start' : dir.x < -0.3 ? 'end' : 'middle'} fontSize={FONT_SIZE} fontStyle="italic" fontFamily={FONT_MATH}>
			{children}
		</text>
	);
}

// ---------------------------------------------------------------- bodies and supports

/**
 * A fixed surface: the line from `from` to `to`, thick, with short slanted ticks on its right-hand side (below, for a
 * floor drawn left to right; on the left, for a wall drawn top to bottom; above, for a ceiling drawn right to left),
 * every 0.15 cm, as the lessons draw it:
 * `\foreach \x in {0.15,0.3,...,4} \draw[thin] (\x,0) -- ++(-0.15,-0.15); \draw[thick] (0,0) -- (4,0);`.
 * (node-tikzjax drops `pattern=` fills, so the hatching is drawn line by line in TikZ too.)
 */
export function Ground({ f, from, to, step = 0.15 }: { f: Frame; from: V; to: V; step?: number }) {
	const L = len(sub(to, from));
	const u = unit(sub(to, from));
	const n = v(u.y, -u.x); // right-hand side
	const ticks: string[] = [];
	for (let s = step; s <= L + 1e-6; s += step) {
		const p = add(from, scale(u, s));
		ticks.push(f.path([p, add(p, add(scale(n, step), scale(u, -step)))]));
	}
	return (
		<g pointerEvents="none">
			<path d={ticks.join(' ')} stroke="#000" strokeWidth={THIN} fill="none" />
			<path d={f.path([from, to])} stroke="#000" strokeWidth={THICK} fill="none" />
		</g>
	);
}

/**
 * A block (a box, a crate): a `w × h` rectangle standing with the middle of its base at `at`, turned by `angle`
 * radians (to sit on an incline), as `\draw[thick, fill=blue!10]`. Its centre is at `at + h/2` along the normal.
 */
export function Block({ f, at, w = 1, h = 0.7, angle = 0, fill = TINT.blue, label }: { f: Frame; at: V; w?: number; h?: number; angle?: number; fill?: string; label?: string }) {
	const c = (x: number, y: number) => add(at, rot(v(x, y), angle));
	const centre = c(0, h / 2);
	const p = f.px(centre);
	return (
		<g pointerEvents="none">
			<path d={f.path([c(-w / 2, 0), c(w / 2, 0), c(w / 2, h), c(-w / 2, h)], true)} fill={fill} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
			{label && (
				<text x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={FONT_SIZE} fontStyle="italic" fontFamily={FONT_MATH}>
					{label}
				</text>
			)}
		</g>
	);
}

/** Where a block's centre is: `at` moved up by h/2 along the surface's normal. */
export const blockCentre = (at: V, h: number, angle = 0) => add(at, rot(v(0, h / 2), angle));

/** A ball (a point mass drawn with a size), as `\draw[thick, fill=blue!10] (at) circle (r);`. */
export function Ball({ f, at, r = 0.25, fill = TINT.blue }: { f: Frame; at: V; r?: number; fill?: string }) {
	const p = f.px(at);
	return <circle cx={p.x} cy={p.y} r={r * (f.W / (f.x1 - f.x0))} fill={fill} stroke="#000" strokeWidth={THICK} pointerEvents="none" />;
}

/**
 * A spring from `from` to `to` as TikZ's zigzag decoration
 * (`decorate, decoration={zigzag, segment length=4pt, amplitude=3pt, pre length=4pt, post length=4pt}`):
 * straight ends of 4pt and a zigzag in between. With `coils` the number of teeth stays the same as the spring
 * stretches, like a real spring; without it the teeth keep TikZ's 4pt length.
 */
export function Spring({ f, from, to, coils, amplitude = 3 * PT, color = '#000' }: { f: Frame; from: V; to: V; coils?: number; amplitude?: number; color?: string }) {
	const d = sub(to, from);
	const L = len(d);
	if (L < 1e-6) return null;
	const u = unit(d);
	const n = v(-u.y, u.x);
	const end = Math.min(4 * PT, L / 4);
	const body = L - 2 * end;
	const teeth = coils ?? Math.max(2, Math.round(body / (4 * PT)));
	const pts: V[] = [from, add(from, scale(u, end))];
	for (let i = 0; i < teeth; i++) {
		const s = end + (body * (i + 0.25)) / teeth;
		const t = end + (body * (i + 0.75)) / teeth;
		pts.push(add(add(from, scale(u, s)), scale(n, amplitude)), add(add(from, scale(u, t)), scale(n, -amplitude)));
	}
	pts.push(add(from, scale(u, L - end)), to);
	return <path d={f.path(pts)} stroke={color} strokeWidth={THIN} fill="none" strokeLinejoin="round" pointerEvents="none" />;
}

/** A thread (a rope, a string), thin and straight, as `\draw (from) -- (to);`. */
export function Thread({ f, from, to }: { f: Frame; from: V; to: V }) {
	return <path d={f.path([from, to])} stroke="#000" strokeWidth={THIN} fill="none" pointerEvents="none" />;
}

/**
 * An inclined plane: the right triangle with its right angle at `corner` and its foot `base` centimetres to the
 * `side` of it (left: the slope rises to the right), at `angle` radians, with the angle marked at the foot; the base sits on hatched ground.
 * `inclineEnds` and `onIncline` give the points of its slope.
 */
export function Incline({ f, corner, base, angle, side = 'left', fill = TINT.gray, ground = true }: { f: Frame; corner: V; base: number; angle: number; side?: 'left' | 'right'; fill?: string; ground?: boolean }) {
	const s = side === 'left' ? -1 : 1;
	const foot = add(corner, v(s * base, 0));
	const top = add(corner, v(0, base * Math.tan(angle)));
	return (
		<g pointerEvents="none">
			{ground && <Ground f={f} from={v(Math.min(foot.x, corner.x) - 0.3, corner.y)} to={v(Math.max(foot.x, corner.x) + 0.3, corner.y)} />}
			<path d={f.path([corner, foot, top], true)} fill={fill} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
			<path d={s < 0 ? f.arc(foot, v(1, 0), sub(top, foot), 0.6) : f.arc(foot, sub(top, foot), v(-1, 0), 0.6)} stroke="#000" strokeWidth={THIN} fill="none" />
		</g>
	);
}

/** The two ends of an incline's slope, for placing a block on it: the foot and the top. */
export function inclineEnds(corner: V, base: number, angle: number, side: 'left' | 'right' = 'left') {
	const s = side === 'left' ? -1 : 1;
	return { foot: add(corner, v(s * base, 0)), top: add(corner, v(0, base * Math.tan(angle))) };
}

/** A point on the slope from the foot, `d` centimetres up, and the slope's angle as a rotation for Block. */
export function onIncline(corner: V, base: number, angle: number, d: number, side: 'left' | 'right' = 'left') {
	const { foot, top } = inclineEnds(corner, base, angle, side);
	const u = unit(sub(top, foot));
	return { at: add(foot, scale(u, d)), rotation: side === 'left' ? angle : -angle };
}

/** A pulley at `at`: a circle of radius r with its axle, as `\draw[thick, fill=gray!20] (at) circle (r); \fill (at) circle (1pt);`. */
export function Pulley({ f, at, r = 0.3 }: { f: Frame; at: V; r?: number }) {
	const p = f.px(at);
	const R = r * (f.W / (f.x1 - f.x0));
	return (
		<g pointerEvents="none">
			<circle cx={p.x} cy={p.y} r={R} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
			<circle cx={p.x} cy={p.y} r={1.5} fill="#000" />
		</g>
	);
}

/** A point where forces act, drawn as a small filled dot (1.5pt), like the lessons' point masses. */
export function Point({ f, at, r = 2.25 }: { f: Frame; at: V; r?: number }) {
	const p = f.px(at);
	return <circle cx={p.x} cy={p.y} r={r} fill="#000" pointerEvents="none" />;
}

/** A direction at `angle` radians from the x axis, `length` long: handy for forces given by modulus and angle. */
export const along = (from: V, angle: number, length: number) => add(from, polar(length, angle));
