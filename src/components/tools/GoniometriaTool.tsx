'use client';

import { useMemo } from 'react';
import { funzioniGoniometriche, type CircleDrawing, type TrigUnit } from '@/lib/tools/goniometria';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { n: '150', u: 'gradi' };

const EXAMPLES: { label: string; n: string; u: TrigUnit }[] = [
	{ label: '210°', n: '210', u: 'gradi' },
	{ label: '-45°', n: '-45', u: 'gradi' },
	{ label: '5π/3', n: '5π/3', u: 'rad' },
	{ label: '40°', n: '40', u: 'gradi' }
];

export function SenoCosenoTool() {
	const [state, set] = useToolState(DEFAULTS);
	const unit: TrigUnit = state.u === 'rad' ? 'rad' : 'gradi';
	const { outcome, circle } = useMemo(() => funzioniGoniometriche(state.n, unit), [state.n, unit]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToggleGroup
						label="Unità di misura dell'angolo"
						options={[
							{ value: 'gradi', label: 'Gradi' },
							{ value: 'rad', label: 'Radianti' }
						]}
						value={unit}
						onChange={(u) => set(u === 'rad' ? { u, n: '5π/6' } : { u, n: '150' })}
					/>
					<ToolField label={unit === 'rad' ? 'Angolo in radianti' : 'Angolo in gradi'}>
						<input className={toolInputClass} inputMode="text" autoComplete="off" spellCheck={false} value={state.n} onChange={(e) => set({ n: e.target.value })} />
					</ToolField>
					<p className="text-xs text-fg-subtle">
						{unit === 'rad' ? 'Con π (5π/6, oppure 5pi/6) o come numero decimale (1,2).' : 'Anche con la virgola (22,5), negativo (-45) o in gradi e primi (22° 30′).'}
					</p>
					{circle && <UnitCircle circle={circle} />}
					<Examples items={EXAMPLES.map((x) => ({ label: x.label, apply: () => set({ n: x.n, u: x.u }) }))} />
				</>
			}
		/>
	);
}

const R = 88;
const CX = 130;
const CY = 120;
const fmt = (n: number) => Math.round(n * 10) / 10;

/**
 * The unit circle: the angle from the positive x axis, the point P, and its projections on the axes. The cosine is
 * the segment on the x axis, the sine the vertical segment from there to P, both named, so colour is not the only
 * signal.
 */
export function UnitCircle({ circle }: { circle: CircleDrawing }) {
	const { turn, cos, sin } = circle;
	const P = [CX + R * cos, CY - R * sin];
	const H = [CX + R * cos, CY];
	const r = 20;
	const large = turn > Math.PI ? 1 : 0;
	const arcEnd = [CX + r * Math.cos(turn), CY - r * Math.sin(turn)];
	// A tiny angle (or a full turn) has no arc to draw.
	const arc = turn > 0.02 ? `M${CX + r},${CY} A${r},${r} 0 ${large} 0 ${fmt(arcEnd[0])},${fmt(arcEnd[1])}` : '';
	const onAxis = Math.abs(sin) < 1e-9 || Math.abs(cos) < 1e-9;
	// Labels just outside the segments, on the side away from the centre.
	const cosLabelY = sin >= 0 ? CY + 16 : CY - 7;
	const sinLabelX = cos >= 0 ? H[0] + 6 : H[0] - 6;
	return (
		<svg viewBox="0 0 260 240" role="img" aria-label="La circonferenza goniometrica con l'angolo, il seno e il coseno" className="h-auto w-full max-w-[18rem] self-center text-fg">
			<title>La circonferenza goniometrica con l&apos;angolo, il seno e il coseno</title>
			<line x1={CX - R - 20} y1={CY} x2={CX + R + 20} y2={CY} className="stroke-fg-muted" strokeWidth={1} />
			<line x1={CX} y1={CY + R + 20} x2={CX} y2={CY - R - 20} className="stroke-fg-muted" strokeWidth={1} />
			<text x={CX + R + 22} y={CY + 4} fontSize={13} className="fill-fg-muted italic">
				x
			</text>
			<text x={CX + 6} y={CY - R - 12} fontSize={13} className="fill-fg-muted italic">
				y
			</text>
			<circle cx={CX} cy={CY} r={R} className="fill-accent/5 stroke-current" strokeWidth={1.5} />
			{arc && <path d={arc} fill="none" className="stroke-accent" strokeWidth={1.5} />}
			{turn > 0.35 && (
				<text
					x={fmt(CX + 32 * Math.cos(turn / 2))}
					y={fmt(CY - 32 * Math.sin(turn / 2) + 5)}
					textAnchor="middle"
					fontSize={14}
					paintOrder="stroke"
					strokeWidth={4}
					className="stroke-surface fill-accent italic"
				>
					α
				</text>
			)}
			{!onAxis && (
				<>
					<line x1={fmt(P[0])} y1={fmt(P[1])} x2={CX} y2={fmt(P[1])} className="stroke-fg-muted" strokeWidth={1} strokeDasharray="4 4" />
					<line x1={fmt(H[0])} y1={CY} x2={fmt(P[0])} y2={fmt(P[1])} className="stroke-accent" strokeWidth={3} />
					<text
						x={fmt(sinLabelX)}
						y={fmt((CY + P[1]) / 2 + 4)}
						textAnchor={cos >= 0 ? 'start' : 'end'}
						fontSize={13}
						paintOrder="stroke"
						strokeWidth={4}
						className="stroke-surface fill-accent font-medium"
					>
						sin
					</text>
				</>
			)}
			<line x1={CX} y1={CY} x2={fmt(P[0])} y2={fmt(P[1])} className="stroke-current" strokeWidth={1.5} />
			{Math.abs(cos) > 1e-9 && (
				<>
					<line x1={CX} y1={CY} x2={fmt(H[0])} y2={CY} className="stroke-accent" strokeWidth={3} strokeDasharray={onAxis ? undefined : '7 3'} />
					<text x={fmt((CX + H[0]) / 2)} y={cosLabelY} textAnchor="middle" fontSize={13} paintOrder="stroke" strokeWidth={4} className="stroke-surface fill-accent font-medium">
						cos
					</text>
				</>
			)}
			{Math.abs(cos) < 1e-9 && (
				<>
					<line x1={CX} y1={CY} x2={CX} y2={fmt(P[1])} className="stroke-accent" strokeWidth={3} />
					<text x={CX + 6} y={fmt((CY + P[1]) / 2 + 4)} fontSize={13} paintOrder="stroke" strokeWidth={4} className="stroke-surface fill-accent font-medium">
						sin
					</text>
				</>
			)}
			<circle cx={fmt(P[0])} cy={fmt(P[1])} r={3.5} className="fill-current" />
			<text
				x={fmt(P[0] + (cos >= 0 ? 7 : -7))}
				y={fmt(P[1] + (sin >= 0 ? -7 : 16))}
				textAnchor={cos >= 0 ? 'start' : 'end'}
				fontSize={14}
				paintOrder="stroke"
				strokeWidth={4}
				className="stroke-surface fill-fg font-semibold"
			>
				P
			</text>
			<text x={CX - 6} y={CY + 15} textAnchor="end" fontSize={12} className="fill-fg-muted">
				O
			</text>
		</svg>
	);
}
