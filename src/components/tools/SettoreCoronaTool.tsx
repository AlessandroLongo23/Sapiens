'use client';

import { useMemo } from 'react';
import { isUnit } from '@/lib/tools/geometria';
import { corona, settore, type CoronaMode, type Ring } from '@/lib/tools/settore-corona';
import { Examples, ModeSwitch, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';
import { FigureSketch } from './FigureSketch';
import { UnitSelect } from './GeometriaTool';

function Field({ label, value, onChange, text }: { label: string; value: string; onChange: (v: string) => void; text?: boolean }) {
	return (
		<ToolField label={label}>
			<input className={toolInputClass} inputMode={text ? 'text' : 'decimal'} autoComplete="off" spellCheck={false} value={value} onChange={(e) => onChange(e.target.value)} />
		</ToolField>
	);
}

// ---------------------------------------------------------------------------------------------------------------
// The circular sector.

const ANGLE_UNITS = [
	{ value: 'gradi' as const, label: 'Angolo in gradi' },
	{ value: 'radianti' as const, label: 'Angolo in radianti' }
];

const SETTORE_DEFAULTS = { r: '6', a: '60', ua: 'gradi', u: 'cm' };

const SETTORE_EXAMPLES: { label: string; values: Partial<typeof SETTORE_DEFAULTS> }[] = [
	{ label: 'r = 10, 90°', values: { r: '10', a: '90', ua: 'gradi' } },
	{ label: 'r = 4, 135°', values: { r: '4', a: '135', ua: 'gradi' } },
	{ label: 'r = 6, 2π/3', values: { r: '6', a: '2π/3', ua: 'radianti' } },
	{ label: 'r = 5, 1,2 rad', values: { r: '5', a: '1,2', ua: 'radianti' } }
];

export function SettoreTool() {
	const [state, set] = useToolState(SETTORE_DEFAULTS);
	const unit = state.ua === 'radianti' ? 'radianti' : 'gradi';
	const u = isUnit(state.u) ? state.u : '';
	const { outcome, sketch } = useMemo(() => settore({ r: state.r, a: state.a, unit, u }), [state.r, state.a, unit, u]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ModeSwitch label="Unità dell'angolo" options={ANGLE_UNITS} value={unit} onChange={(ua) => set({ ua, a: ua === 'radianti' ? 'π/3' : '60' })} />
					<div className="grid grid-cols-2 gap-3">
						<Field label="Raggio (r)" value={state.r} onChange={(r) => set({ r })} />
						<Field label={unit === 'radianti' ? 'Angolo (α, rad)' : 'Angolo (α, gradi)'} value={state.a} onChange={(a) => set({ a })} text={unit === 'radianti'} />
						<UnitSelect value={u} onChange={(v) => set({ u: v })} />
					</div>
					<p className="text-xs text-fg-subtle">{unit === 'radianti' ? 'Puoi scrivere π: π/3, 2π/3, oppure 2pi/3. Anche un numero, come 1,2.' : 'Per i decimali puoi usare la virgola: 22,5.'}</p>
					{sketch && <FigureSketch sketch={sketch} title="Disegno del settore circolare con il raggio e l'angolo" />}
					<Examples items={SETTORE_EXAMPLES.map((x) => ({ label: x.label, apply: () => set(x.values) }))} />
				</>
			}
		/>
	);
}

// ---------------------------------------------------------------------------------------------------------------
// The annulus.

const CORONA_MODES: { value: CoronaMode; label: string }[] = [
	{ value: 'raggi', label: 'Dai raggi' },
	{ value: 'diametri', label: 'Dai diametri' }
];

const CORONA_DEFAULTS = { modo: 'raggi', a: '10', b: '6', u: 'cm' };

const CORONA_EXAMPLES: { label: string; values: Partial<typeof CORONA_DEFAULTS> }[] = [
	{ label: 'R = 5, r = 3', values: { modo: 'raggi', a: '5', b: '3' } },
	{ label: 'R = 7,5, r = 2,5', values: { modo: 'raggi', a: '7,5', b: '2,5' } },
	{ label: 'D = 26, d = 10', values: { modo: 'diametri', a: '26', b: '10' } }
];

const W = 360;
const H = 210;
const fmt = (n: number) => Math.round(n * 10) / 10;

/** Two circles around the same centre, the ring between them tinted, the two radii dashed with their measures. */
function RingSketch({ ring }: { ring: Ring }) {
	const [cx, cy] = [W / 2, H / 2];
	const R = 88;
	// The inner circle is never drawn smaller than a fifth of the outer one.
	const r = Math.max(R * 0.2, (R * ring.r) / ring.R);
	const circle = (k: number) => `M${fmt(cx - k)},${cy} a${fmt(k)},${fmt(k)} 0 1,0 ${fmt(2 * k)},0 a${fmt(k)},${fmt(k)} 0 1,0 ${fmt(-2 * k)},0 Z`;
	// The inner label sits over its radius when the inner circle has room for it (about 8,6 units a character at
	// this size), else outside on the left.
	const w = ring.inner.length * 8.6;
	const lx = Math.max(cx - r / 2, cx - r + 8 + w / 2);
	const inside = lx + w / 2 <= cx + r - 8;
	const label = (text: string, x: number, y: number, anchor: 'start' | 'middle' | 'end') => (
		<text x={fmt(x)} y={fmt(y)} textAnchor={anchor} fontSize={15} paintOrder="stroke" strokeWidth={4} strokeLinejoin="round" className="fill-accent stroke-surface font-medium">
			{text}
		</text>
	);
	const title = 'Disegno della corona circolare con i due raggi';
	return (
		<svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title} className="h-auto w-full max-w-md self-center text-fg">
			<title>{title}</title>
			<path d={`${circle(R)} ${circle(r)}`} fillRule="evenodd" className="fill-accent/10 stroke-current" strokeWidth={1.5} />
			<line x1={cx} y1={cy} x2={cx + R} y2={cy} className="stroke-fg-muted" strokeWidth={1.2} strokeDasharray="5 4" />
			<line x1={cx} y1={cy} x2={fmt(cx - r)} y2={cy} className="stroke-fg-muted" strokeWidth={1.2} strokeDasharray="5 4" />
			<circle cx={cx} cy={cy} r={2.5} className="fill-current" />
			{label(ring.outer, cx + R + 8, cy + 5, 'start')}
			{inside ? label(ring.inner, lx, cy - 9, 'middle') : label(ring.inner, cx - R - 8, cy + 5, 'end')}
		</svg>
	);
}

export function CoronaTool() {
	const [state, set] = useToolState(CORONA_DEFAULTS);
	const mode = state.modo === 'diametri' ? 'diametri' : 'raggi';
	const u = isUnit(state.u) ? state.u : '';
	const { outcome, ring } = useMemo(() => corona({ mode, a: state.a, b: state.b, u }), [mode, state.a, state.b, u]);
	const diam = mode === 'diametri';
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ModeSwitch label="Che cosa conosci" options={CORONA_MODES} value={mode} onChange={(modo) => set({ modo, ...(modo === 'diametri' ? { a: '20', b: '12' } : { a: '10', b: '6' }) })} />
					<div className="grid grid-cols-2 gap-3">
						<Field label={diam ? 'Diametro esterno (D)' : 'Raggio esterno (R)'} value={state.a} onChange={(a) => set({ a })} />
						<Field label={diam ? 'Diametro interno (d)' : 'Raggio interno (r)'} value={state.b} onChange={(b) => set({ b })} />
						<UnitSelect value={u} onChange={(v) => set({ u: v })} />
					</div>
					<p className="text-xs text-fg-subtle">Per i decimali puoi usare la virgola: 7,5.</p>
					{ring && <RingSketch ring={ring} />}
					<Examples items={CORONA_EXAMPLES.map((x) => ({ label: x.label, apply: () => set(x.values) }))} />
				</>
			}
		/>
	);
}
