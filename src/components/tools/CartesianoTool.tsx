'use client';

import { useMemo } from 'react';
import { distanza, parabola, puntoMedio, retta, type RettaMode } from '@/lib/tools/cartesiano';
import { Examples, ModeSwitch, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';
import { CartesianSketch } from './CartesianSketch';

const HINT = 'Interi, decimali con la virgola (1,5) o frazioni (2/3).';

function NumberField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
	return (
		<ToolField label={label}>
			<input className={toolInputClass} inputMode="text" autoComplete="off" spellCheck={false} value={value} onChange={(e) => onChange(e.target.value)} />
		</ToolField>
	);
}

/** The two coordinates of a point, side by side. */
function PointFields({ name, x, y, onChange }: { name: string; x: string; y: string; onChange: (x: string, y: string) => void }) {
	return (
		<div className="grid grid-cols-2 gap-3">
			<NumberField label={`Ascissa di ${name} (x)`} value={x} onChange={(v) => onChange(v, y)} />
			<NumberField label={`Ordinata di ${name} (y)`} value={y} onChange={(v) => onChange(x, v)} />
		</div>
	);
}

type Four = { xa: string; ya: string; xb: string; yb: string };
const four = (s: string): Four => {
	const [xa, ya, xb, yb] = s.split(' ');
	return { xa, ya, xb, yb };
};
const pointsLabel = (p: Four) => `A(${p.xa}; ${p.ya}) B(${p.xb}; ${p.yb})`;

// ---------------------------------------------------------------------------------------------------------------

const DISTANZA_DEFAULTS = { xa: '-2', ya: '1', xb: '4', yb: '4' };
const DISTANZA_EXAMPLES = ['1 2 4 6', '-3 5 2 -1', '0 0 3 3', '1/2 1/3 -1 1'].map(four);

const MEDIO_DEFAULTS = { xa: '-3', ya: '2', xb: '5', yb: '7' };
const MEDIO_EXAMPLES = ['2 4 6 8', '-1 3 4 -2', '1/2 1 3/2 -1', '1,5 2 -2,5 3'].map(four);

function PointsTool({ which }: { which: 'distanza' | 'medio' }) {
	const [state, set] = useToolState(which === 'distanza' ? DISTANZA_DEFAULTS : MEDIO_DEFAULTS);
	const { outcome, plot } = useMemo(() => (which === 'distanza' ? distanza(state) : puntoMedio(state)), [which, state]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<PointFields name="A" x={state.xa} y={state.ya} onChange={(xa, ya) => set({ xa, ya })} />
					<PointFields name="B" x={state.xb} y={state.yb} onChange={(xb, yb) => set({ xb, yb })} />
					<p className="text-xs text-fg-subtle">{HINT}</p>
					{plot && <CartesianSketch plot={plot} title={which === 'distanza' ? 'I punti A e B nel piano cartesiano, con il segmento AB' : 'Il segmento AB nel piano cartesiano, con il punto medio M'} />}
					<Examples items={(which === 'distanza' ? DISTANZA_EXAMPLES : MEDIO_EXAMPLES).map((p) => ({ label: pointsLabel(p), apply: () => set(p) }))} />
				</>
			}
		/>
	);
}

export const DistanzaTool = () => <PointsTool which="distanza" />;
export const PuntoMedioTool = () => <PointsTool which="medio" />;

// ---------------------------------------------------------------------------------------------------------------

const RETTA_MODES: { value: RettaMode; label: string; example: Partial<Record<'xa' | 'ya' | 'xb' | 'yb' | 'm' | 'r', string>> }[] = [
	{ value: 'punti', label: 'Due punti', example: { xa: '1', ya: '1', xb: '4', yb: '3' } },
	{ value: 'pendenza', label: 'Punto e pendenza', example: { xa: '2', ya: '-1', m: '1/2' } },
	{ value: 'parallela', label: 'Parallela', example: { xa: '1', ya: '4', r: '2x + y - 3 = 0' } },
	{ value: 'perpendicolare', label: 'Perpendicolare', example: { xa: '3', ya: '1', r: '3x - 2y + 6 = 0' } }
];

const RETTA_DEFAULTS = { modo: 'punti', xa: '1', ya: '1', xb: '4', yb: '3', m: '1/2', r: '3x - 2y + 6 = 0' };

const RETTA_EXAMPLES: { label: string; modo: RettaMode; values: Partial<typeof RETTA_DEFAULTS> }[] = [
	{ label: 'A(-1; 3) B(2; -3)', modo: 'punti', values: { xa: '-1', ya: '3', xb: '2', yb: '-3' } },
	{ label: 'A(2; 5) B(2; -1)', modo: 'punti', values: { xa: '2', ya: '5', xb: '2', yb: '-1' } },
	{ label: 'P(0; 2) m = -3', modo: 'pendenza', values: { xa: '0', ya: '2', m: '-3' } },
	{ label: 'P(4; 1) ⊥ y = 2x + 1', modo: 'perpendicolare', values: { xa: '4', ya: '1', r: 'y = 2x + 1' } }
];

export function RettaTool() {
	const [state, set] = useToolState(RETTA_DEFAULTS);
	const mode = RETTA_MODES.find((m) => m.value === state.modo) ?? RETTA_MODES[0];
	const { outcome, plot } = useMemo(() => retta({ mode: mode.value, xa: state.xa, ya: state.ya, xb: state.xb, yb: state.yb, m: state.m, r: state.r }), [mode.value, state.xa, state.ya, state.xb, state.yb, state.m, state.r]);
	const pName = mode.value === 'punti' ? 'A' : 'P';
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ModeSwitch label="Che cosa conosci" options={RETTA_MODES.map((m) => ({ value: m.value, label: m.label }))} value={mode.value} onChange={(v) => set({ modo: v, ...RETTA_MODES.find((m) => m.value === v)?.example })} />
					<PointFields name={pName} x={state.xa} y={state.ya} onChange={(xa, ya) => set({ xa, ya })} />
					{mode.value === 'punti' && <PointFields name="B" x={state.xb} y={state.yb} onChange={(xb, yb) => set({ xb, yb })} />}
					{mode.value === 'pendenza' && <NumberField label="Coefficiente angolare (m)" value={state.m} onChange={(m) => set({ m })} />}
					{(mode.value === 'parallela' || mode.value === 'perpendicolare') && (
						<ToolField label="Retta r" hint="Per esempio y = 2x + 1 oppure 3x - 2y + 6 = 0.">
							<input className={toolInputClass} inputMode="text" autoComplete="off" spellCheck={false} value={state.r} onChange={(e) => set({ r: e.target.value })} />
						</ToolField>
					)}
					<p className="text-xs text-fg-subtle">{HINT}</p>
					{plot && <CartesianSketch plot={plot} title="La retta nel piano cartesiano, con i punti dati" />}
					<Examples items={RETTA_EXAMPLES.map((x) => ({ label: x.label, apply: () => set({ modo: x.modo, ...x.values }) }))} />
				</>
			}
		/>
	);
}

// ---------------------------------------------------------------------------------------------------------------

const PARABOLA_DEFAULTS = { a: '1', b: '-4', c: '3' };
const PARABOLA_EXAMPLES: [string, string, string][] = [
	['-1', '2', '3'],
	['1', '2', '5'],
	['1/2', '-1', '-4'],
	['2', '0', '-1']
];

export function ParabolaTool() {
	const [state, set] = useToolState(PARABOLA_DEFAULTS);
	const { outcome, plot } = useMemo(() => parabola(state), [state]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<p className="text-sm text-fg-muted">
						La parabola <span className="font-mono">y = ax² + bx + c</span>.
					</p>
					<div className="grid grid-cols-3 items-end gap-3">
						<NumberField label="a (di x²)" value={state.a} onChange={(a) => set({ a })} />
						<NumberField label="b (di x)" value={state.b} onChange={(b) => set({ b })} />
						<NumberField label="c (termine noto)" value={state.c} onChange={(c) => set({ c })} />
					</div>
					<p className="text-xs text-fg-subtle">{HINT} Un campo vuoto vale 0, tranne a.</p>
					{plot && <CartesianSketch plot={plot} title="La parabola nel piano cartesiano, con il vertice, il fuoco e la direttrice" />}
					<Examples items={PARABOLA_EXAMPLES.map(([a, b, c]) => ({ label: `${a}; ${b}; ${c}`, apply: () => set({ a, b, c }) }))} />
				</>
			}
		/>
	);
}
