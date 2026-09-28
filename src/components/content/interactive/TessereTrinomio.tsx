'use client';

import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, sub, lerp, clamp, useTween, K, TINT, THICK, THIN, FONT, FONT_MATH, type V } from './kit';

/**
 * Algebra tiles for x² + sx + p (lesson 36): one square x², s strips x·1 and p squares 1·1, to be put together into a
 * rectangle. When they close one, its sides are x + m and x + n, with m + n = s and m·n = p; when the trinomial is
 * irreducible, no arrangement closes.
 *
 * The side x is 2,3 cm and the unit 0,6 cm, like the TikZ figure (2,4 and 0,6) but not a multiple of the unit: with
 * x = 4 units, x² + 4 would close into a 4 × 5 rectangle of units, which is arithmetic, not algebra. Tiles snap to
 * the edges of the others (and to the corner of the building area), which is the grid of lines a·x + b that this
 * kind of rectangle lives on.
 */

const X = 2.3;
const U = 0.6;
const SNAP = 0.3;
const EPS = 1e-6;

const f = frame(-0.4, 8.6, -1.7, 7.85);
const ORIGIN = v(0.9, 3.5);

type Kind = 'sq' | 'bar' | 'unit';
type Tile = { id: number; kind: Kind; at: V; vert: boolean; z: number };

const TRINOMIALS = [
	{ s: 5, p: 6, label: 'x² + 5x + 6', tex: 'x^2 + 5x + 6' },
	{ s: 7, p: 12, label: 'x² + 7x + 12', tex: 'x^2 + 7x + 12' },
	{ s: 4, p: 2, label: 'x² + 4x + 2', tex: 'x^2 + 4x + 2' },
	{ s: 0, p: 4, label: 'x² + 4', tex: 'x^2 + 4' }
];

const size = (t: { kind: Kind; vert: boolean }) => (t.kind === 'sq' ? v(X, X) : t.kind === 'unit' ? v(U, U) : t.vert ? v(U, X) : v(X, U));

/** The tiles as they come, in the tray under the building area. */
function tray(s: number, p: number): Tile[] {
	const tiles: Tile[] = [{ id: 0, kind: 'sq', at: v(0, 0), vert: false, z: 0 }];
	for (let i = 0; i < s; i++) tiles.push({ id: tiles.length, kind: 'bar', at: v(2.7 + i * 0.78, 0), vert: true, z: tiles.length });
	for (let i = 0; i < p; i++) tiles.push({ id: tiles.length, kind: 'unit', at: v((i % 6) * 0.78, -0.85 - Math.floor(i / 6) * 0.78), vert: false, z: tiles.length });
	return tiles;
}

/** The two numbers with sum s and product p, the larger first, or null. */
function split(s: number, p: number): [number, number] | null {
	for (let n = 0; n <= s / 2; n++) if (n * (s - n) === p) return [s - n, n];
	return null;
}

/**
 * Where the tiles go: x² in the corner, m strips standing to its right, n lying on top of it, the m·n units in the
 * corner between them (as in the TikZ figure). For an irreducible trinomial, the split of the strips whose corner is
 * closest to p: the units that fit go in, the corner shows the holes or the rest stays in the tray.
 */
function arrangement(tiles: Tile[], s: number, p: number) {
	const exact = split(s, p);
	let [m, n] = exact ?? [s, 0];
	if (!exact) {
		let best = Infinity;
		for (let k = 0; k <= s / 2; k++) {
			const d = Math.abs(k * (s - k) - p);
			if (d < best) [best, m, n] = [d, s - k, k];
		}
	}
	let bar = 0, unit = 0;
	const home = tray(s, p);
	const to = tiles.map((t) => {
		if (t.kind === 'sq') return { ...t, at: ORIGIN, vert: false };
		if (t.kind === 'bar') {
			const i = bar++;
			return i < m ? { ...t, at: v(ORIGIN.x + X + i * U, ORIGIN.y), vert: true } : { ...t, at: v(ORIGIN.x, ORIGIN.y + X + (i - m) * U), vert: false };
		}
		const i = unit++;
		if (i < m * n) return { ...t, at: v(ORIGIN.x + X + (i % m) * U, ORIGIN.y + X + Math.floor(i / m) * U), vert: false };
		return { ...t, at: home.find((h) => h.id === t.id)!.at, vert: false };
	});
	const holes: V[] = [];
	for (let i = p; i < m * n; i++) holes.push(v(ORIGIN.x + X + (i % m) * U, ORIGIN.y + X + Math.floor(i / m) * U));
	return { to, holes, m, n };
}

const overlap = (a: Tile, b: Tile) => {
	const sa = size(a), sb = size(b);
	return a.at.x < b.at.x + sb.x - EPS && b.at.x < a.at.x + sa.x - EPS && a.at.y < b.at.y + sb.y - EPS && b.at.y < a.at.y + sa.y - EPS;
};

/** A length a·x + b (a = 0, 1, 2), written the way the lesson writes the sides, or null if it is not one. */
function side(w: number) {
	for (let a = 0; a <= 2; a++) {
		const b = Math.round((w - a * X) / U);
		if (b >= 0 && Math.abs(a * X + b * U - w) < 1e-4) return a === 0 ? String(b) : `${a === 1 ? '' : a}x${b ? ` + ${b}` : ''}`;
	}
	return null;
}

/** The tiles all together form one rectangle, with no gaps and no overlaps. */
function check(tiles: Tile[]) {
	if (tiles.some((a, i) => tiles.some((b, j) => j > i && overlap(a, b)))) return { overlap: true as const };
	const x0 = Math.min(...tiles.map((t) => t.at.x)), y0 = Math.min(...tiles.map((t) => t.at.y));
	const x1 = Math.max(...tiles.map((t) => t.at.x + size(t).x)), y1 = Math.max(...tiles.map((t) => t.at.y + size(t).y));
	const area = tiles.reduce((a, t) => a + size(t).x * size(t).y, 0);
	if (Math.abs((x1 - x0) * (y1 - y0) - area) > 1e-4) return null;
	const w = side(x1 - x0), h = side(y1 - y0);
	return w && h ? { x0, y0, x1, y1, w, h } : null;
}

/** Moves a tile so that its edges that are close to another tile's edge (or to the corner of the area) lie on it. */
function snap(t: Tile, others: Tile[]): V {
	const s = size(t);
	// Only the tiles it touches or almost touches: a tile far away must not pull it.
	const near = others.filter((o) => {
		const so = size(o);
		return t.at.x < o.at.x + so.x + SNAP && o.at.x < t.at.x + s.x + SNAP && t.at.y < o.at.y + so.y + SNAP && o.at.y < t.at.y + s.y + SNAP;
	});
	const xs = [ORIGIN.x, ...near.flatMap((o) => [o.at.x, o.at.x + size(o).x])];
	const ys = [ORIGIN.y, ...near.flatMap((o) => [o.at.y, o.at.y + size(o).y])];
	const best = (p: number, len: number, lines: number[]) => {
		let d = SNAP, out = p;
		for (const c of lines) for (const edge of [p, p + len]) if (Math.abs(c - edge) < d) [d, out] = [Math.abs(c - edge), p + c - edge];
		return out;
	};
	return v(clamp(best(t.at.x, s.x, xs), f.x0, f.x1 - s.x), clamp(best(t.at.y, s.y, ys), f.y0, f.y1 - s.y));
}

const NAME: Record<Kind, string> = { sq: 'Quadrato x²', bar: 'Striscia x', unit: 'Quadratino 1' };

export default function TessereTrinomio({ alt }: { alt?: string }) {
	const [which, setWhich] = useState(0);
	const tri = TRINOMIALS[which];
	const [tiles, setTiles] = useState(() => tray(tri.s, tri.p));
	const [anim, setAnim] = useState<{ from: Tile[]; to: Tile[] } | null>(null);
	const [holes, setHoles] = useState<V[]>([]);
	const [shown, setShown] = useState(false);
	const [t, go, running] = useTween(0, 1200);
	const svg = useRef<SVGSVGElement>(null);
	const drag = useRef<{ id: number; offset: V; start: V; moved: boolean } | null>(null);

	const choose = (i: number) => {
		setWhich(i);
		setTiles(tray(TRINOMIALS[i].s, TRINOMIALS[i].p));
		setHoles([]);
		setShown(false);
		setAnim(null);
	};

	const place = (id: number, change: (t: Tile) => Tile) =>
		setTiles((ts) => {
			const top = Math.max(...ts.map((x) => x.z)) + 1;
			const moved = { ...change(ts.find((x) => x.id === id)!), z: top };
			const others = ts.filter((x) => x.id !== id);
			const snapped = { ...moved, at: snap(moved, others) };
			return ts.map((x) => (x.id === id ? snapped : x));
		});
	const turn = (tile: Tile) => {
		const s0 = size(tile), s1 = size({ ...tile, vert: !tile.vert });
		const c = v(tile.at.x + s0.x / 2, tile.at.y + s0.y / 2);
		return { ...tile, vert: !tile.vert, at: v(c.x - s1.x / 2, c.y - s1.y / 2) };
	};
	const edited = () => {
		setHoles([]);
		setShown(false);
	};

	// The dragged tile is raised to the top, which moves its node in the SVG and would drop a pointer capture: the
	// drag listens on the window instead, until the pointer is released.
	const down = (tile: Tile) => (e: PointerEvent<SVGGElement>) => {
		const box = svg.current;
		if (anim || !box || drag.current) return;
		e.preventDefault();
		const id = e.pointerId;
		const p0 = f.toTikz(e, box);
		const d = { id: tile.id, offset: sub(p0, tile.at), start: p0, moved: false };
		drag.current = d;
		const move = (ev: globalThis.PointerEvent) => {
			if (ev.pointerId !== id) return;
			const p = f.toTikz(ev, box);
			if (!d.moved && Math.hypot(p.x - d.start.x, p.y - d.start.y) < 0.12) return;
			d.moved = true;
			place(d.id, (x) => ({ ...x, at: sub(p, d.offset) }));
			edited();
		};
		const up = (ev: globalThis.PointerEvent) => {
			if (ev.pointerId !== id) return;
			window.removeEventListener('pointermove', move);
			window.removeEventListener('pointerup', up);
			window.removeEventListener('pointercancel', up);
			drag.current = null;
			// A tap on a strip turns it.
			if (!d.moved && tile.kind === 'bar') {
				place(d.id, turn);
				edited();
			}
		};
		window.addEventListener('pointermove', move);
		window.addEventListener('pointerup', up);
		window.addEventListener('pointercancel', up);
	};
	const key = (tile: Tile) => (e: KeyboardEvent<SVGGElement>) => {
		if (anim) return;
		const step = e.shiftKey ? 1.2 : 0.3;
		const d = { ArrowLeft: v(-step, 0), ArrowRight: v(step, 0), ArrowUp: v(0, step), ArrowDown: v(0, -step) }[e.key];
		if (d) {
			e.preventDefault();
			place(tile.id, (x) => ({ ...x, at: v(x.at.x + d.x, x.at.y + d.y) }));
			edited();
		} else if ((e.key === 'Enter' || e.key === ' ' || e.key === 'r') && tile.kind === 'bar') {
			e.preventDefault();
			place(tile.id, turn);
			edited();
		}
	};

	const solve = async () => {
		const { to, holes: h } = arrangement(tiles, tri.s, tri.p);
		setAnim({ from: tiles, to });
		await go(0, 0);
		await go(1);
		setTiles(to);
		setAnim(null);
		setHoles(h);
		setShown(true);
	};

	const done = anim ? null : check(tiles);
	const exact = split(tri.s, tri.p);

	let caption: ReactNode = 'Trascina le tessere e componi un rettangolo che le usi tutte. Tocca una striscia per girarla.';
	if (done && 'overlap' in done) caption = 'Due tessere si sovrappongono: spostane una.';
	else if (done) caption = <>Il rettangolo è chiuso. I lati sono <Tex>{done.w}</Tex> e <Tex>{done.h}</Tex>, quindi <Tex>{`${tri.tex} = (${done.w})(${done.h})`}</Tex>.</>;
	else if (shown && !exact) {
		const corners = [...new Set(Array.from({ length: Math.floor(tri.s / 2) + 1 }, (_, k) => k * (tri.s - k)))].sort((a, b) => a - b);
		caption =
			tri.s === 0 ? (
				<>Senza strisce il quadrato si può allargare solo con i quadratini, ma una fila di quadratini non è mai lunga esattamente <Tex>x</Tex>: il rettangolo non si chiude, e <Tex>{tri.tex}</Tex> è irriducibile.</>
			) : (
				<>Dividendo le {tri.s} strisce in due gruppi, l&apos;angolo in alto a destra vuole {corners.join(', ').replace(/, (\d+)$/, ' o $1')} quadratini, mai {tri.p}: il rettangolo non si chiude, e <Tex>{tri.tex}</Tex> è irriducibile.</>
			);
	}

	// Where each tile is drawn: its centre and its turn, eased between two arrangements while the solution plays.
	const drawn = (anim ? anim.to : tiles).map((tile) => {
		if (!anim) {
			const s = size(tile);
			return { tile, c: v(tile.at.x + s.x / 2, tile.at.y + s.y / 2), turn: tile.vert ? 90 : 0 };
		}
		const a = anim.from.find((x) => x.id === tile.id)!;
		const sa = size(a), sb = size(tile);
		const c = lerp(v(a.at.x + sa.x / 2, a.at.y + sa.y / 2), v(tile.at.x + sb.x / 2, tile.at.y + sb.y / 2), t);
		return { tile, c, turn: (a.vert ? 90 : 0) + ((tile.vert ? 90 : 0) - (a.vert ? 90 : 0)) * t };
	});
	drawn.sort((a, b) => a.tile.z - b.tile.z);

	return (
		<Figure>
			<Drawing f={f} label={alt} svgRef={svg}>
				{/* The corner where the rectangle starts. */}
				<path d={f.path([v(ORIGIN.x, ORIGIN.y + 0.6), ORIGIN, v(ORIGIN.x + 0.6, ORIGIN.y)])} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray="2 2.5" />
				{!anim && tiles.every((q) => q.at.y < 2.75) && (
					<Label f={f} at={v(ORIGIN.x + 0.15, ORIGIN.y + 0.35)} dir={v(1, 0)} upright size={13} color="#808080">
						costruisci qui il rettangolo
					</Label>
				)}
				<path d={f.path([v(f.x0, 2.75), v(f.x1, 2.75)])} stroke="#000" strokeWidth={THIN} strokeOpacity={0.35} />
				{holes.map((h, i) => {
					const q = f.px(v(h.x, h.y + U));
					return <rect key={i} x={q.x} y={q.y} width={U * K} height={U * K} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray="3 3" />;
				})}
				{drawn.map(({ tile, c, turn: angle }) => {
					const base = size({ kind: tile.kind, vert: false });
					const p = f.px(c);
					const w = base.x * K, h = base.y * K;
					const label = tile.kind === 'sq' ? 'x²' : tile.kind === 'bar' ? 'x' : '1';
					return (
						<g
							key={tile.id}
							transform={`translate(${p.x.toFixed(2)},${p.y.toFixed(2)}) rotate(${(-angle).toFixed(2)})`}
							role="button"
							tabIndex={0}
							aria-label={`${NAME[tile.kind]}${tile.kind === 'bar' ? (tile.vert ? ', in piedi' : ', sdraiata') : ''}: trascinala o usa le frecce${tile.kind === 'bar' ? '; Invio la gira' : ''}`}
							className="group cursor-grab outline-none active:cursor-grabbing"
							style={{ touchAction: 'none' }}
							onPointerDown={down(tile)}
							onKeyDown={key(tile)}
						>
							<rect x={-w / 2} y={-h / 2} width={w} height={h} fill={tile.kind === 'sq' ? TINT.blue : tile.kind === 'bar' ? TINT.orange : TINT.yellow} stroke="#000" strokeWidth={THICK} className="group-focus-visible:[stroke-width:3]" />
							<text
								x={0}
								y={0}
								dy="0.35em"
								textAnchor="middle"
								transform={`rotate(${angle.toFixed(2)})`}
								fontSize={tile.kind === 'unit' ? 11 : 15}
								fontStyle={tile.kind === 'unit' ? 'normal' : 'italic'}
								fontFamily={tile.kind === 'unit' ? FONT : FONT_MATH}
								pointerEvents="none"
							>
								{label}
							</text>
						</g>
					);
				})}
				{done && !('overlap' in done) && (
					<>
						<path d={f.path([v(done.x0, done.y0), v(done.x1, done.y0), v(done.x1, done.y1), v(done.x0, done.y1)], true)} fill="none" stroke="#000" strokeWidth={THICK * 2} pointerEvents="none" />
						<Label f={f} at={v((done.x0 + done.x1) / 2, done.y0)} dir={v(0, -1)}>{done.w}</Label>
						<Label f={f} at={done.x1 < 6.5 ? v(done.x1, (done.y0 + done.y1) / 2) : v(done.x0, (done.y0 + done.y1) / 2)} dir={done.x1 < 6.5 ? v(1, 0) : v(-1, 0)}>
							{done.h}
						</Label>
					</>
				)}
			</Drawing>

			<Readout>
				<span className="text-base">
					<Tex>{tri.tex}</Tex>
				</span>
				<span>
					1 quadrato, {tri.s} {tri.s === 1 ? 'striscia' : 'strisce'}, {tri.p} quadratini
				</span>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<ToggleGroup label="Trinomio" value={String(which)} onChange={(x) => choose(Number(x))} options={TRINOMIALS.map((x, i) => ({ value: String(i), label: x.label }))} />
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={running || (!!done && !('overlap' in done))} onClick={solve}>
						<Sparkles className="size-4" aria-hidden="true" />
						{exact ? 'Mostra la soluzione' : 'Mostra un tentativo'}
					</Button>
					<Button variant="secondary" size="sm" disabled={running} onClick={() => choose(which)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Rimetti a posto
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
