'use client';

import { v, add, sub, scale, unit, len, FONT, FONT_MATH, FONT_SIZE, THIN, THICK, TINT, INK, type V, type Frame } from '../kit';
import { Arrow } from '../fisica';

/**
 * The pieces of the thermodynamics figures (third year, group 41: lessons 109-111), shared by the interactive
 * figures and by the exercises' scene `piano-pv`: the pressure-volume plane with numbered ticks, a transformation as
 * a sampled line between two states (straight, isothermal, adiabatic), the work as the area under it, a horizontal
 * cylinder with its piston, and bars that go above and below a zero line (Q, W, ΔU). Everything is in TikZ
 * centimetres, drawn like the TikZ figures of those lessons.
 *
 * A state is { V, p } in the figure's own units (litres and kilopascal, say: 1 kPa · 1 L = 1 J, so areas are joules).
 */

export type Stato = { V: number; p: number };

/** The plane's scales: centimetres per unit of volume and of pressure, where the axes end, and the ticks. */
export type PianoPV = {
	/** Centimetres per unit of volume, and per unit of pressure. */
	sx: number;
	sy: number;
	vMax: number;
	pMax: number;
	/** The grid's step on each axis, in the axis's units. */
	vPasso: number;
	pPasso: number;
	/** A number every so many steps (default 1). */
	vOgni?: number;
	pOgni?: number;
	vUnita: string;
	pUnita: string;
};

/** Where a state is drawn, with the origin of the axes at `o`. */
export const puntoPV = (a: PianoPV, s: Stato, o: V = v(0, 0)): V => v(o.x + s.V * a.sx, o.y + s.p * a.sy);

/** Decimals needed to write x without rounding (at most 4). */
const places = (x: number) => {
	for (let d = 0; d <= 4; d++) if (Math.abs(x * 10 ** d - Math.round(x * 10 ** d)) < 1e-6) return d;
	return 4;
};
const it = (x: number, d: number) => x.toFixed(d).replace('.', ',');

/**
 * The axes of the pressure-volume plane: a light grid, numbered ticks, and the names with their units, `V (L)` under
 * the end of the horizontal axis and `p (kPa)` above the vertical one.
 */
export function AssiPV({ f, a, o = v(0, 0), griglia = true, size = 12 }: { f: Frame; a: PianoPV; o?: V; griglia?: boolean; size?: number }) {
	const Lx = a.vMax * a.sx, Ly = a.pMax * a.sy;
	const nx = Math.floor(a.vMax / a.vPasso + 1e-9), ny = Math.floor(a.pMax / a.pPasso + 1e-9);
	const ex = a.vOgni ?? 1, ey = a.pOgni ?? 1;
	const dx = places(a.vPasso * ex), dy = places(a.pPasso * ey);
	const grid: string[] = [];
	for (let i = 1; i <= nx; i++) grid.push(f.path([v(o.x + i * a.vPasso * a.sx, o.y), v(o.x + i * a.vPasso * a.sx, o.y + Ly)]));
	for (let j = 1; j <= ny; j++) grid.push(f.path([v(o.x, o.y + j * a.pPasso * a.sy), v(o.x + Lx, o.y + j * a.pPasso * a.sy)]));
	const text = (p: V, s: string, anchor: 'start' | 'middle' | 'end', dyEm: string) => {
		const q = f.px(p);
		return (
			<text x={q.x} y={q.y} dy={dyEm} textAnchor={anchor} fontSize={size} fontFamily={FONT}>
				{s}
			</text>
		);
	};
	const endX = f.px(v(o.x + Lx + 0.4, o.y - 0.12));
	const endY = f.px(v(o.x, o.y + Ly + 0.5));
	return (
		<g pointerEvents="none">
			{griglia && <path d={grid.join(' ')} stroke="#d6d6d6" strokeWidth={0.4} fill="none" />}
			<Arrow f={f} from={v(o.x - 0.25, o.y)} to={v(o.x + Lx + 0.4, o.y)} weight="thin" />
			<Arrow f={f} from={v(o.x, o.y - 0.25)} to={v(o.x, o.y + Ly + 0.4)} weight="thin" />
			{Array.from({ length: Math.floor(nx / ex) }, (_, k) => (k + 1) * ex).map((i) => {
				const x = o.x + i * a.vPasso * a.sx;
				return (
					<g key={`x${i}`}>
						<path d={f.path([v(x, o.y + 0.07), v(x, o.y - 0.07)])} stroke="#000" strokeWidth={THIN} />
						{text(v(x, o.y - 0.12), it(i * a.vPasso, dx), 'middle', '0.8em')}
					</g>
				);
			})}
			{Array.from({ length: Math.floor(ny / ey) }, (_, k) => (k + 1) * ey).map((j) => {
				const y = o.y + j * a.pPasso * a.sy;
				return (
					<g key={`y${j}`}>
						<path d={f.path([v(o.x + 0.07, y), v(o.x - 0.07, y)])} stroke="#000" strokeWidth={THIN} />
						{text(v(o.x - 0.14, y), it(j * a.pPasso, dy), 'end', '0.35em')}
					</g>
				);
			})}
			{text(v(o.x - 0.14, o.y), '0', 'end', '0.9em')}
			<text x={endX.x} y={endX.y} dy="1.95em" textAnchor="end" fontSize={size + 2}>
				<tspan fontFamily={FONT_MATH} fontStyle="italic">V</tspan>
				<tspan fontFamily={FONT}> ({a.vUnita})</tspan>
			</text>
			<text x={endY.x} y={endY.y} textAnchor="middle" fontSize={size + 2}>
				<tspan fontFamily={FONT_MATH} fontStyle="italic">p</tspan>
				<tspan fontFamily={FONT}> ({a.pUnita})</tspan>
			</text>
		</g>
	);
}

export type TipoTratto = 'retta' | 'isoterma' | 'adiabatica';

/**
 * The states of a transformation from A to B, sampled: a straight segment (which is an isobar when horizontal and an
 * isochore when vertical), the hyperbola p V = p_A V_A of an isotherm, or the curve p V^γ = p_A V_A^γ of an adiabat.
 * On the two curves the pressure of B is not read: the curve gives it from B's volume.
 */
export function tratto(tipo: TipoTratto, A: Stato, B: Stato, gamma = 5 / 3, n = 48): Stato[] {
	if (tipo === 'retta' || Math.abs(B.V - A.V) < 1e-12) return [A, B];
	const e = tipo === 'isoterma' ? 1 : gamma;
	return Array.from({ length: n + 1 }, (_, i) => {
		const V = A.V + ((B.V - A.V) * i) / n;
		return { V, p: A.p * (A.V / V) ** e };
	});
}

/** The first part of a sampled line, up to the fraction t of its length along the drawing (0 to 1). */
export function finoA(stati: Stato[], t: number, a: PianoPV): Stato[] {
	if (t >= 1) return stati;
	const P = stati.map((s) => puntoPV(a, s));
	const seg = P.slice(1).map((p, i) => len(sub(p, P[i])));
	let left = Math.max(0, t) * seg.reduce((x, y) => x + y, 0);
	const out: Stato[] = [stati[0]];
	for (let i = 0; i < seg.length; i++) {
		if (left >= seg[i] - 1e-12) {
			out.push(stati[i + 1]);
			left -= seg[i];
			continue;
		}
		const k = seg[i] > 0 ? left / seg[i] : 0;
		out.push({ V: stati[i].V + (stati[i + 1].V - stati[i].V) * k, p: stati[i].p + (stati[i + 1].p - stati[i].p) * k });
		break;
	}
	return out;
}

/** The work along a sampled line, with its sign: the sum of the trapezia under it (pressure unit × volume unit). */
export const lavoro = (stati: Stato[]) => stati.slice(1).reduce((w, s, i) => w + ((s.p + stati[i].p) / 2) * (s.V - stati[i].V), 0);

/** The work of an isotherm from A to the volume V, exactly: p_A V_A ln(V / V_A). */
export const lavoroIsoterma = (A: Stato, V: number) => A.p * A.V * Math.log(V / A.V);

/** The outline of the region between a sampled line and the volume axis, as a closed path. */
export function areaSotto(f: Frame, a: PianoPV, stati: Stato[], o: V = v(0, 0)): string {
	if (stati.length < 2) return '';
	const first = stati[0], last = stati[stati.length - 1];
	return f.path([v(o.x + first.V * a.sx, o.y), ...stati.map((s) => puntoPV(a, s, o)), v(o.x + last.V * a.sx, o.y)], true);
}

/** A sampled line as an open path. */
export const lineaPV = (f: Frame, a: PianoPV, stati: Stato[], o: V = v(0, 0)) => f.path(stati.map((s) => puntoPV(a, s, o)));

/** The arrowhead that gives a transformation its direction, at the fraction `at` of its drawn length. */
export function Verso({ f, a, stati, o = v(0, 0), color = '#000', at = 0.5 }: { f: Frame; a: PianoPV; stati: Stato[]; o?: V; color?: string; at?: number }) {
	const part = finoA(stati, at, a);
	if (part.length < 2) return null;
	const M = puntoPV(a, part[part.length - 1], o);
	const before = puntoPV(a, part[part.length - 2], o);
	const all = stati.map((s) => puntoPV(a, s, o));
	const total = all.slice(1).reduce((x, p, i) => x + len(sub(p, all[i])), 0);
	if (total < 0.5) return null;
	const u = unit(sub(M, before));
	return <Arrow f={f} from={sub(M, scale(u, 0.22))} to={add(M, scale(u, 0.12))} color={color} />;
}

/** A state's dot with its name, set off in the direction `dir`. */
export function PuntoStato({ f, at, nome, dir = v(0.7, 0.7), color = '#000' }: { f: Frame; at: V; nome?: string; dir?: V; color?: string }) {
	const p = f.px(at);
	const q = f.px(add(at, scale(dir, 0.24)));
	return (
		<g pointerEvents="none">
			<circle cx={p.x} cy={p.y} r={2.6} fill={color} />
			{nome && (
				<text x={q.x} y={q.y} dy={dir.y > 0.3 ? '0' : dir.y < -0.3 ? '0.75em' : '0.35em'} textAnchor={dir.x > 0.3 ? 'start' : dir.x < -0.3 ? 'end' : 'middle'} fontSize={FONT_SIZE} fontStyle="italic" fontFamily={FONT_MATH} fill={color}>
					{nome}
				</text>
			)}
		</g>
	);
}

// ---------------------------------------------------------------- cylinder and piston

const frac = (x: number) => x - Math.floor(x);
/** Fixed places for the gas's dots, as fractions of the gas column (x) and of the cylinder's height (y). */
const DOTS = Array.from({ length: 22 }, (_, i) => v(frac(Math.sin(i * 12.9898 + 1) * 43758.5453) * 0.9 + 0.05, frac(Math.sin(i * 78.233 + 2) * 12543.853) * 0.78 + 0.11));

/** A tint between blue!10 (cold, k = 0) and red!15 (hot, k = 1), for a gas drawn at its temperature. */
export function tintaTemperatura(k: number): string {
	const t = Math.min(1, Math.max(0, k));
	const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
	// blue!10 = (230, 230, 255), red!15 = (255, 217, 217)
	return `rgb(${mix(230, 255)}, ${mix(230, 217)}, ${mix(255, 217)})`;
}

/**
 * A cylinder lying on its side, closed at `x0` on the left, with the gas up to the piston's face at `x`: walls
 * `lunghezza` long, half height `r`, the piston with its rod and handle, and the gas's dots, which crowd together as
 * the piston moves in. With `fermo` two pegs block the piston (a transformation at constant volume).
 */
export function Cilindro({ f, x0, x, y, r = 0.5, lunghezza, fill = TINT.blue, fermo = false }: { f: Frame; x0: number; x: number; y: number; r?: number; lunghezza: number; fill?: string; fermo?: boolean }) {
	const end = x0 + lunghezza;
	const rod = Math.min(0.9, Math.max(0.35, end + 0.55 - x));
	return (
		<g pointerEvents="none">
			<path d={f.path([v(x0, y - r), v(x, y - r), v(x, y + r), v(x0, y + r)], true)} fill={fill} />
			{DOTS.map((d, i) => {
				const q = f.px(v(x0 + d.x * (x - x0), y - r + d.y * 2 * r));
				return <circle key={i} cx={q.x} cy={q.y} r={1.5} fill={INK.blue} opacity={0.55} />;
			})}
			<path d={f.path([v(end, y + r), v(x0, y + r), v(x0, y - r), v(end, y - r)])} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
			<path d={f.path([v(x, y - r + 0.03), v(x + 0.16, y - r + 0.03), v(x + 0.16, y + r - 0.03), v(x, y + r - 0.03)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
			<path d={f.path([v(x + 0.16, y - 0.07), v(x + 0.16 + rod, y - 0.07), v(x + 0.16 + rod, y + 0.07), v(x + 0.16, y + 0.07)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THIN} />
			{fermo && (
				<>
					<path d={f.path([v(x + 0.19, y + r), v(x + 0.19, y + r - 0.2), v(x + 0.3, y + r - 0.2), v(x + 0.3, y + r)], true)} fill="#000" />
					<path d={f.path([v(x + 0.19, y - r), v(x + 0.19, y - r + 0.2), v(x + 0.3, y - r + 0.2), v(x + 0.3, y - r)], true)} fill="#000" />
				</>
			)}
		</g>
	);
}

// ---------------------------------------------------------------- signed bars

export type BarraSegno = { nome: string; delta?: boolean; value: number; fill: string };
export const BARRA_W = 0.46;
export const BARRA_GAP = 0.3;
export const barreLarghezza = (n: number) => n * BARRA_W + (n - 1) * BARRA_GAP;

/**
 * Bars that stand on a zero line when positive and hang from it when negative: the heat, the work and the change of
 * internal energy of a transformation. `at` is the left end of the zero line, `scale` centimetres per unit, `max` the
 * largest value a bar can take (the names sit under the lowest reach of the bars). A name with `delta` is written
 * with an upright Δ before the italic letter.
 */
export function BarreSegno({ f, at, bars, scale: k, max }: { f: Frame; at: V; bars: BarraSegno[]; scale: number; max: number }) {
	const right = at.x + barreLarghezza(bars.length);
	return (
		<g pointerEvents="none">
			{bars.map((b, i) => {
				const x = at.x + i * (BARRA_W + BARRA_GAP);
				const h = Math.min(max, Math.abs(b.value)) * k;
				const top = f.px(v(x, at.y + (b.value >= 0 ? h : 0)));
				const bottom = f.px(v(x + BARRA_W, at.y - (b.value >= 0 ? 0 : h)));
				const name = f.px(v(x + BARRA_W / 2, at.y - max * k - 0.12));
				return (
					<g key={i}>
						{h > 0.004 && <rect x={top.x} y={top.y} width={bottom.x - top.x} height={bottom.y - top.y} fill={b.fill} stroke="#000" strokeWidth={THIN} />}
						<text x={name.x} y={name.y} dy="0.75em" textAnchor="middle" fontSize={FONT_SIZE * 0.9}>
							{b.delta && <tspan fontFamily={FONT}>Δ</tspan>}
							<tspan fontFamily={FONT_MATH} fontStyle="italic">{b.nome}</tspan>
						</text>
					</g>
				);
			})}
			<path d={f.path([v(at.x - 0.12, at.y), v(right + 0.12, at.y)])} stroke="#000" strokeWidth={THICK} fill="none" />
			<text x={f.px(v(at.x - 0.18, at.y)).x} y={f.px(v(at.x - 0.18, at.y)).y} dy="0.35em" textAnchor="end" fontSize={11} fontFamily={FONT}>
				0
			</text>
		</g>
	);
}
