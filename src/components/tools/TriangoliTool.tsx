'use client';

import { useMemo } from 'react';
import { isUnit } from '@/lib/tools/geometria';
import { QUALSIASI_MODES, RETTANGOLO_MODES, triangoloQualsiasi, triangoloRettangolo, type Pt, type SketchLabel, type TriangleSketch } from '@/lib/tools/triangoli';
import { cn } from '@/lib/utils/cn';
import { Examples, ModeSwitch, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';
import { UnitSelect } from './GeometriaTool';

/** Inputs of the angles accept degrees and primes, so they are text fields. */
const isAngleField = (label: string) => label.startsWith('Angolo');

const RIGHT_DEFAULTS = { modo: RETTANGOLO_MODES[0].value as string, x: RETTANGOLO_MODES[0].example[0], y: RETTANGOLO_MODES[0].example[1], u: 'cm' };

const RIGHT_EXAMPLES = [
	{ label: 'a = 10, b = 5', modo: 'ipotenusa-cateto', x: '10', y: '5' },
	{ label: 'a = 12, β = 30°', modo: 'ipotenusa-angolo', x: '12', y: '30' },
	{ label: 'b = 5, β = 40°', modo: 'cateto-opposto', x: '5', y: '40' },
	{ label: 'b = 9, γ = 60°', modo: 'cateto-adiacente', x: '9', y: '60' }
];

export function TriangoloRettangoloTool() {
	const [state, set] = useToolState(RIGHT_DEFAULTS);
	const spec = RETTANGOLO_MODES.find((m) => m.value === state.modo) ?? RETTANGOLO_MODES[0];
	const unit = isUnit(state.u) ? state.u : '';
	const { outcome, sketch } = useMemo(() => triangoloRettangolo(spec.value, state.x, state.y, unit), [spec.value, state.x, state.y, unit]);
	const values = [state.x, state.y];
	const keys = ['x', 'y'] as const;
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ModeSwitch
						label="Che cosa conosci"
						options={RETTANGOLO_MODES.map((m) => ({ value: m.value, label: m.label }))}
						value={spec.value}
						onChange={(m) => {
							const next = RETTANGOLO_MODES.find((x) => x.value === m)!;
							set({ modo: m, x: next.example[0], y: next.example[1] });
						}}
					/>
					<div className="grid grid-cols-2 gap-3">
						{spec.fields.map((label, i) => (
							<ToolField key={label} label={label}>
								<input
									className={toolInputClass}
									inputMode={isAngleField(label) ? 'text' : 'decimal'}
									autoComplete="off"
									spellCheck={false}
									value={values[i]}
									onChange={(e) => set({ [keys[i]]: e.target.value })}
								/>
							</ToolField>
						))}
						<UnitSelect value={unit} onChange={(u) => set({ u })} />
					</div>
					<p className="text-xs text-fg-subtle">L&apos;angolo retto è in A: a è l&apos;ipotenusa, b e c i cateti, β è opposto a b. Gli angoli in gradi: 36,87 oppure 36° 52′.</p>
					{sketch && <TriangleDrawing sketch={sketch} title="Disegno del triangolo rettangolo con le misure" />}
					<Examples items={RIGHT_EXAMPLES.map(({ label, ...e }) => ({ label, apply: () => set(e) }))} />
				</>
			}
		/>
	);
}

const ANY_DEFAULTS = { modo: QUALSIASI_MODES[0].value as string, x: QUALSIASI_MODES[0].example[0], y: QUALSIASI_MODES[0].example[1], z: QUALSIASI_MODES[0].example[2], u: 'cm' };

const ANY_EXAMPLES = [
	{ label: 'b = 5, c = 8, α = 60°', modo: 'lal', x: '5', y: '8', z: '60' },
	{ label: 'a = 10, β = 45°, γ = 105°', modo: 'ala', x: '10', y: '45', z: '105' },
	{ label: 'a = 6, b = 8, α = 40°', modo: 'lla', x: '6', y: '8', z: '40' },
	{ label: 'lati 4, 5, 6', modo: 'lll', x: '4', y: '5', z: '6' }
];

export function TriangoloQualsiasiTool() {
	const [state, set] = useToolState(ANY_DEFAULTS);
	const spec = QUALSIASI_MODES.find((m) => m.value === state.modo) ?? QUALSIASI_MODES[0];
	const unit = isUnit(state.u) ? state.u : '';
	const { outcome, sketch } = useMemo(() => triangoloQualsiasi(spec.value, state.x, state.y, state.z, unit), [spec.value, state.x, state.y, state.z, unit]);
	const values = [state.x, state.y, state.z];
	const keys = ['x', 'y', 'z'] as const;
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ModeSwitch
						label="Che cosa conosci"
						options={QUALSIASI_MODES.map((m) => ({ value: m.value, label: m.label }))}
						value={spec.value}
						onChange={(m) => {
							const next = QUALSIASI_MODES.find((x) => x.value === m)!;
							set({ modo: m, x: next.example[0], y: next.example[1], z: next.example[2] });
						}}
					/>
					<div className="grid grid-cols-2 gap-3">
						{spec.fields.map((label, i) => (
							<ToolField key={label} label={label}>
								<input
									className={toolInputClass}
									inputMode={isAngleField(label) ? 'text' : 'decimal'}
									autoComplete="off"
									spellCheck={false}
									value={values[i]}
									onChange={(e) => set({ [keys[i]]: e.target.value })}
								/>
							</ToolField>
						))}
						<UnitSelect value={unit} onChange={(u) => set({ u })} />
					</div>
					<p className="text-xs text-fg-subtle">{spec.hint} Il lato a è opposto al vertice A e all&apos;angolo α, e così via.</p>
					{sketch && <TriangleDrawing sketch={sketch} title="Disegno del triangolo con le misure" />}
					<Examples items={ANY_EXAMPLES.map(({ label, ...e }) => ({ label, apply: () => set(e) }))} />
				</>
			}
		/>
	);
}

// ---------------------------------------------------------------------------------------------------------------

const W = 250;
const H = 170;
const PX = 110;
const PY = 34;
/** The longest side of the drawing is at most this many times the shortest, as in FigureSketch. */
const MAX_RATIO = 3.5;

type V = [number, number];
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1]];
const unitV = (a: V): V => {
	const l = Math.hypot(a[0], a[1]) || 1;
	return [a[0] / l, a[1] / l];
};
const fmt = (n: number) => Math.round(n * 10) / 10;

type Anchor = 'start' | 'middle' | 'end';
type Box = [number, number, number, number];
/** The rough box of a 15px label: about 8 units a character, 15 high, above the baseline. */
function box(x: number, y: number, anchor: Anchor, chars: number): Box {
	const w = chars * 8;
	const left = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
	return [left, y - 13, left + w, y + 3];
}
const overlaps = (a: Box, b: Box) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];

/**
 * A triangle drawn to scale, unless it is very long and thin: then the short side is stretched, as on the board, so
 * the labels stay readable. The vertices are named,
 * each side with its measure outside it, each angle with an arc and its measure next to the vertex name. Given
 * measures in the accent colour, found ones in the muted ink and in italics, so colour is not the only signal.
 */
export function TriangleDrawing({ sketch, title }: { sketch: TriangleSketch; title: string }) {
	const pts: Pt[] = [sketch.A, sketch.B, sketch.C];
	const xs = pts.map((p) => p[0]);
	const ys = pts.map((p) => p[1]);
	const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
	const w = maxX - minX || 1;
	const h = maxY - minY || 1;
	const s = Math.min(W / w, H / h);
	const sx = Math.min(W / w, Math.max(s, H / MAX_RATIO / w));
	const sy = Math.min(H / h, Math.max(s, W / MAX_RATIO / h));
	const ox = PX + (W - w * sx) / 2;
	const oy = PY + (H - h * sy) / 2;
	const map = (p: Pt): V => [ox + (p[0] - minX) * sx, oy + (maxY - p[1]) * sy];
	const [A, B, C] = pts.map(map);
	const center: V = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
	const vertices: { name: 'A' | 'B' | 'C'; at: V; others: [V, V] }[] = [
		{ name: 'A', at: A, others: [B, C] },
		{ name: 'B', at: B, others: [C, A] },
		{ name: 'C', at: C, others: [A, B] }
	];
	const sides: { label: SketchLabel; from: V; to: V }[] = [
		{ label: sketch.sides.a, from: B, to: C },
		{ label: sketch.sides.b, from: C, to: A },
		{ label: sketch.sides.c, from: A, to: B }
	];
	const style = (l: SketchLabel) => (l.given ? 'fill-accent font-medium' : 'fill-fg-muted italic');

	// The vertex names with their angles, outside each corner.
	const vertexLabels = vertices.map(({ name, at }) => {
		const out = unitV(sub(at, center));
		const p: V = [at[0] + out[0] * 12, at[1] + out[1] * 12];
		const anchor: Anchor = out[0] > 0.3 ? 'start' : out[0] < -0.3 ? 'end' : 'middle';
		const angle = sketch.angles[name];
		const y = p[1] + (out[1] > 0.3 ? 13 : out[1] < -0.3 ? -2 : 5);
		return { name, angle, x: p[0], y, anchor, box: box(p[0], y, anchor, name.length + (angle ? angle.text.length + 1 : 0)) };
	});
	// Each side's measure outside its middle, moved further out while it would cover a vertex label.
	const sideLabels = sides.map(({ label, from, to }) => {
		const mid: V = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
		const dir = unitV(sub(to, from));
		let n: V = [-dir[1], dir[0]];
		const away = sub(mid, center);
		if (n[0] * away[0] + n[1] * away[1] < 0) n = [-n[0], -n[1]];
		const anchor: Anchor = n[0] > 0.35 ? 'start' : n[0] < -0.35 ? 'end' : 'middle';
		const dy = n[1] > 0.35 ? 12 : n[1] < -0.35 ? -3 : 5;
		const at = (k: number) => ({ x: mid[0] + n[0] * k, y: mid[1] + n[1] * k + dy });
		const free = [9, 18, 27, 36].map(at).find((p) => p.y > 14 && p.y < H + 2 * PY - 4 && !vertexLabels.some((v) => overlaps(box(p.x, p.y, anchor, label.text.length), v.box)));
		return { label, ...(free ?? at(9)), anchor };
	});

	return (
		<svg viewBox={`0 0 ${W + 2 * PX} ${H + 2 * PY}`} role="img" aria-label={title} className="h-auto w-full max-w-md self-center text-fg">
			<title>{title}</title>
			<polygon points={[A, B, C].map((p) => `${fmt(p[0])},${fmt(p[1])}`).join(' ')} className="fill-accent/10 stroke-current" strokeWidth={1.5} strokeLinejoin="round" />
			{vertices.map(({ name, at, others }) => {
				const u = unitV(sub(others[0], at));
				const v = unitV(sub(others[1], at));
				if (sketch.right === name) {
					const k = 11;
					const d = `M${fmt(at[0] + u[0] * k)},${fmt(at[1] + u[1] * k)} L${fmt(at[0] + (u[0] + v[0]) * k)},${fmt(at[1] + (u[1] + v[1]) * k)} L${fmt(at[0] + v[0] * k)},${fmt(at[1] + v[1] * k)}`;
					return <path key={name} d={d} fill="none" className="stroke-fg-muted" strokeWidth={1} />;
				}
				const r = 18;
				const sweep = u[0] * v[1] - u[1] * v[0] > 0 ? 1 : 0;
				const d = `M${fmt(at[0] + u[0] * r)},${fmt(at[1] + u[1] * r)} A${r},${r} 0 0 ${sweep} ${fmt(at[0] + v[0] * r)},${fmt(at[1] + v[1] * r)}`;
				return <path key={name} d={d} fill="none" className="stroke-accent" strokeWidth={1.2} />;
			})}
			{sideLabels.map(({ label, x, y, anchor }, i) => (
				<text key={i} x={fmt(x)} y={fmt(y)} textAnchor={anchor} fontSize={15} paintOrder="stroke" strokeWidth={4} strokeLinejoin="round" className={cn('stroke-surface', style(label))}>
					{label.text}
				</text>
			))}
			{vertexLabels.map(({ name, angle, x, y, anchor }) => (
				<text key={name} x={fmt(x)} y={fmt(y)} textAnchor={anchor} fontSize={15} paintOrder="stroke" strokeWidth={4} strokeLinejoin="round" className="stroke-surface">
					<tspan className="fill-fg font-semibold">{name}</tspan>
					{angle && <tspan className={style(angle)}>{` ${angle.text}`}</tspan>}
				</text>
			))}
		</svg>
	);
}
