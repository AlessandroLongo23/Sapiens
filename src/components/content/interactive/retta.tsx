'use client';

import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { add, FONT, FONT_MATH, FONT_SIZE, K, len, num, scale, sub, texNum, THIN, unit, v, type Frame, type V } from './kit';

/**
 * The number line of the lessons, drawn the way their TikZ figures draw it: a thin axis with TikZ's arrow tip, short
 * ticks with the numbers below, solution sets as thick tinted strokes, and endpoints with a full dot (included) or an
 * empty one (excluded) around which the lines break, so nothing white is ever painted over them. Shared by the
 * figures on integers, inequalities, statistics, √n and the solutions of a quadratic.
 */

/** One TikZ point in SVG pixels (the lessons' figures are at 1.5 × TikZ size). */
export const PT = K / 28.4528;

const RGB = { black: [0, 0, 0], blue: [0, 0, 255], orange: [255, 127.5, 0], gray: [127.5, 127.5, 127.5], green: [0, 255, 0], red: [255, 0, 0], white: [255, 255, 255] } as const;
type Colour = keyof typeof RGB;
/** An xcolor mix, as TikZ writes it: `xc('blue', 45)` is blue!45, `xc('orange', 80, 'black')` is orange!80!black. */
export function xc(c: Colour, pct: number, other: Colour = 'white') {
	const p = pct / 100;
	return '#' + RGB[c].map((x, i) => Math.round(x * p + RGB[other][i] * (1 - p)).toString(16).padStart(2, '0')).join('');
}

/** −3 with a true minus sign, 2,5 with the Italian comma. */
export const n = (x: number, digits = 2) => num(x, digits).replace('-', '−');
/** +4, −3, 0: a number with its sign, as the lessons write a directed step or a deviation. */
export const signed = (x: number, digits = 2) => (Math.abs(x) < 1e-9 ? '0' : (x > 0 ? '+' : '') + n(x, digits));
/** A signed number for KaTeX, in brackets unless `brackets` is false: (+4), (−3), and 0 bare. */
export const texSigned = (x: number, brackets = true, digits = 2) => {
	const s = Math.abs(x) < 1e-9 ? '0' : (x > 0 ? '+' : '') + texNum(x, digits);
	return brackets && s !== '0' ? `(${s})` : s;
};

export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
/** p/q in lowest terms, as TeX: an integer when it is one, with the sign in front. */
export function texFrac(p: number, q: number) {
	const s = q < 0 ? -1 : 1;
	const P = Math.round(p * s), Q = Math.round(q * s);
	const g = gcd(P, Q) || 1;
	const a = P / g, b = Q / g;
	if (b === 1) return String(a);
	return `${a < 0 ? '-' : ''}\\frac{${Math.abs(a)}}{${b}}`;
}

// ---------------------------------------------------------------- strokes

/** TikZ's default arrow tip (`->`) at `tip`, pointing along `dir`, for a line `width` pixels wide: an SVG path. */
export function tipPath(f: Frame, tip: V, dir: V, width = THIN) {
	const u = unit(dir);
	const w = v(-u.y, u.x);
	const back = (1.6 * PT + 2.2 * width) / K;
	const half = (1.3 * PT + 1.6 * width) / K;
	const at = (a: number, b: number) => f.px(add(tip, add(scale(u, -a * back), scale(w, b * half))));
	const q = (p: V) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
	return `M${q(at(1, 1))} Q${q(at(0.25, 0.2))} ${q(at(0, 0))} Q${q(at(0.25, -0.2))} ${q(at(1, -1))}`;
}

/** A straight line from A to B, with TikZ's tip at B when `arrow` (and at A too when `both`). */
export function Line({ f, from, to, width = THIN, color = '#000', dash, arrow = false, both = false, opacity }: { f: Frame; from: V; to: V; width?: number; color?: string; dash?: string; arrow?: boolean; both?: boolean; opacity?: number }) {
	const a = f.px(from), b = f.px(to);
	const d = sub(to, from);
	const long = len(d) > 1e-6;
	return (
		<g opacity={opacity} pointerEvents="none">
			<line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={width} strokeDasharray={dash} />
			{arrow && long && <path d={tipPath(f, to, d, width)} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />}
			{both && long && <path d={tipPath(f, from, scale(d, -1), width)} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />}
		</g>
	);
}

/**
 * The horizontal stretch from x0 to x1 at height y with gaps of radius `r` (TikZ cm) around the points `holes`: how the
 * lessons break the axis and the solution strokes around an empty dot.
 */
export function pieces(x0: number, x1: number, holes: number[], r: number): [number, number][] {
	const out: [number, number][] = [];
	let from = x0;
	for (const h of [...holes].sort((a, b) => a - b)) {
		if (h + r <= from || h - r >= x1) continue;
		if (h - r > from) out.push([from, h - r]);
		from = Math.max(from, h + r);
	}
	if (from < x1) out.push([from, x1]);
	return out;
}

/** An axis (or any horizontal stroke) from x0 to x1 at height y, broken around `holes`, with the arrow at x1. */
export function HLine({ f, x0, x1, y = 0, holes = [], gap = 0.13, width = THIN, color = '#000', arrow = false, dash }: { f: Frame; x0: number; x1: number; y?: number; holes?: number[]; gap?: number; width?: number; color?: string; arrow?: boolean; dash?: string }) {
	const parts = pieces(x0, x1, holes, gap);
	return (
		<>
			{parts.map(([a, b], i) => (
				<Line key={i} f={f} from={v(a, y)} to={v(b, y)} width={width} color={color} dash={dash} arrow={arrow && i === parts.length - 1 && b === x1} />
			))}
		</>
	);
}

/** A tick across the axis at x, `h` cm each side, as `\draw (x,-0.08) -- (x,0.08)`. */
export function Tick({ f, x, y = 0, h = 0.08, width = THIN, color = '#000' }: { f: Frame; x: number; y?: number; h?: number; width?: number; color?: string }) {
	return <Line f={f} from={v(x, y - h)} to={v(x, y + h)} width={width} color={color} />;
}

/** Text at a point, upright (numbers, words) unless `italic` (a letter in math italic), like a TikZ node. */
export function Text({ f, at, anchor = 'middle', baseline = 'middle', size = FONT_SIZE, italic = false, color = '#000', children, weight }: { f: Frame; at: V; anchor?: 'start' | 'middle' | 'end'; baseline?: 'top' | 'middle' | 'bottom'; size?: number; italic?: boolean; color?: string; children: ReactNode; weight?: number }) {
	const p = f.px(at);
	const dy = baseline === 'top' ? '0.75em' : baseline === 'bottom' ? '0' : '0.35em';
	return (
		<text x={p.x} y={p.y} dy={dy} textAnchor={anchor} fontSize={size} fontStyle={italic ? 'italic' : 'normal'} fontFamily={italic ? FONT_MATH : FONT} fontWeight={weight} fill={color} pointerEvents="none">
			{children}
		</text>
	);
}

/** An endpoint: `\filldraw[thick] circle (2.5pt)` when included, `\draw[thick] circle (2.5pt)` when excluded. */
export function EndDot({ f, at, filled, r = 2.5, color = '#000' }: { f: Frame; at: V; filled: boolean; r?: number; color?: string }) {
	const p = f.px(at);
	return <circle cx={p.x} cy={p.y} r={r * PT} fill={filled ? color : 'none'} stroke={color} strokeWidth={1.2} pointerEvents="none" />;
}

// ---------------------------------------------------------------- interaction

/**
 * Something the student drags along the line: a weight, an endpoint, a step. Like the kit's Handle, but it draws
 * whatever it is given and can also be tapped (a click that does not move it, or Enter and Space): the endpoints of the
 * system of inequalities switch between full and empty that way. The arrows move it by `step` cm (ten times with Shift).
 */
export function Grip({ f, at, onMove, onTap, onEnd, label, hint, step = 0.1, target = 16, ring = 9, color = '#000', children }: { f: Frame; at: V; onMove: (p: V) => void; onTap?: () => void; onEnd?: () => void; label: string; hint?: string; step?: number; target?: number; ring?: number; color?: string; children: ReactNode }) {
	const p = f.px(at);
	const [active, setActive] = useState(false);
	const start = useRef<{ x: number; y: number; moved: boolean } | null>(null);
	const down = (e: PointerEvent<SVGGElement>) => {
		e.preventDefault();
		e.stopPropagation();
		e.currentTarget.setPointerCapture(e.pointerId);
		start.current = { x: e.clientX, y: e.clientY, moved: false };
		setActive(true);
	};
	const move = (e: PointerEvent<SVGGElement>) => {
		const s = start.current;
		if (!s) return;
		if (!s.moved && Math.hypot(e.clientX - s.x, e.clientY - s.y) < 4) return;
		s.moved = true;
		const svg = e.currentTarget.ownerSVGElement;
		if (svg) onMove(f.toTikz(e, svg));
	};
	const up = () => {
		const s = start.current;
		start.current = null;
		setActive(false);
		if (s && !s.moved) onTap?.();
		onEnd?.();
	};
	const key = (e: KeyboardEvent<SVGGElement>) => {
		if ((e.key === 'Enter' || e.key === ' ') && onTap) {
			e.preventDefault();
			onTap();
			return;
		}
		const d = { ArrowLeft: v(-1, 0), ArrowRight: v(1, 0), ArrowUp: v(0, 1), ArrowDown: v(0, -1) }[e.key];
		if (!d) return;
		e.preventDefault();
		onMove(add(at, scale(d, step * (e.shiftKey ? 10 : 1))));
		onEnd?.();
	};
	return (
		<g
			role="button"
			tabIndex={0}
			aria-label={`${label}: ${hint ?? 'trascinalo, oppure usa le frecce'}`}
			className="group cursor-grab outline-none active:cursor-grabbing"
			style={{ touchAction: 'none' }}
			onPointerDown={down}
			onPointerMove={move}
			onPointerUp={up}
			onPointerCancel={up}
			onKeyDown={key}
		>
			<circle cx={p.x} cy={p.y} r={target} fill="transparent" />
			<circle cx={p.x} cy={p.y} r={ring} fill="none" stroke={color} strokeWidth={1} className={active ? 'opacity-60' : 'opacity-0 transition-opacity group-hover:opacity-40 group-focus-visible:opacity-80'} />
			{children}
		</g>
	);
}

// ---------------------------------------------------------------- formulas in the drawing

/** A piece of a formula set in the drawing: text, a fraction [numerator, denominator], or x̄. */
export type Item = string | [number, number] | { xbar: true };

const cw = (c: string) => (c === ' ' ? 0.28 : /[=+−<>≈]/.test(c) ? 0.78 : /[,.]/.test(c) ? 0.28 : 0.5);
const tw = (s: string) => [...s].reduce((w, c) => w + cw(c), 0);
const iw = (it: Item) => (it === '−' || it === '+' ? 0.62 : typeof it === 'string' ? tw(it) : Array.isArray(it) ? Math.max(tw(String(it[0])), tw(String(it[1]))) + 0.3 : 0.55);

/** p/q in lowest terms as formula items: a whole number, or a fraction with its sign in front (`signed` writes +). */
export function fracItems(p: number, q: number, sign: 'auto' | 'signed' = 'auto'): Item[] {
	const s = Math.sign(p) * Math.sign(q);
	const P = Math.abs(Math.round(p)), Q = Math.abs(Math.round(q));
	const g = gcd(P, Q) || 1;
	const lead = s < 0 ? '−' : sign === 'signed' && s > 0 ? '+' : '';
	if (Q / g === 1) return [lead + String(P / g)];
	return lead ? [lead, [P / g, Q / g]] : [[P / g, Q / g]];
}

/**
 * A row of numbers, signs, fractions and x̄, set like a TikZ math node at `at` (its middle, start or end), with the
 * fraction bars on the line through `at`. Widths are estimated in ems of Latin Modern, close enough to centre.
 */
export function Formula({ f, at, items, anchor = 'middle', size = 14, color = '#000' }: { f: Frame; at: V; items: Item[]; anchor?: 'start' | 'middle' | 'end'; size?: number; color?: string }) {
	const p = f.px(at);
	const ws = items.map((it) => iw(it) * size);
	const total = ws.reduce((s, w) => s + w, 0);
	const left = p.x - (anchor === 'middle' ? total / 2 : anchor === 'end' ? total : 0);
	const starts = ws.map((_, i) => left + ws.slice(0, i).reduce((a, w) => a + w, 0));
	const small = size * 0.8;
	const common = { fontFamily: FONT, fill: color, textAnchor: 'middle' as const };
	return (
		<g pointerEvents="none">
			{items.map((it, i) => {
				const cx = starts[i] + ws[i] / 2;
				if (typeof it === 'string')
					return (
						<text key={i} x={cx} y={p.y} dy="0.35em" fontSize={size} {...common}>
							{it}
						</text>
					);
				if (Array.isArray(it))
					return (
						<g key={i}>
							<text x={cx} y={p.y - 2} fontSize={small} {...common}>
								{it[0]}
							</text>
							<line x1={cx - ws[i] / 2 + 1.5} x2={cx + ws[i] / 2 - 1.5} y1={p.y + 0.5} y2={p.y + 0.5} stroke={color} strokeWidth={0.6} />
							<text x={cx} y={p.y + 1.5} dy="0.8em" fontSize={small} {...common}>
								{it[1]}
							</text>
						</g>
					);
				return (
					<g key={i}>
						<text x={cx} y={p.y} dy="0.35em" fontSize={size} {...common} fontFamily={FONT_MATH} fontStyle="italic">
							x
						</text>
						<line x1={cx - size * 0.12} x2={cx + size * 0.3} y1={p.y - size * 0.2} y2={p.y - size * 0.2} stroke={color} strokeWidth={0.7} />
					</g>
				);
			})}
		</g>
	);
}
