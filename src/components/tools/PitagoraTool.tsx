'use client';

import { useMemo } from 'react';
import { isUnit } from '@/lib/tools/geometria';
import { pitagora, type PitagoraMode } from '@/lib/tools/pitagora';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';
import { FigureSketch } from './FigureSketch';
import { UnitSelect } from './GeometriaTool';

const DEFAULTS = { modo: 'ipotenusa', a: '6', b: '8', u: 'cm' };

const FIELDS: Record<PitagoraMode, [string, string]> = {
	ipotenusa: ['Cateto (c₁)', 'Cateto (c₂)'],
	cateto: ['Ipotenusa (i)', 'Cateto noto (c₁)']
};

const EXAMPLES: { label: string; modo: PitagoraMode; a: string; b: string }[] = [
	{ label: 'cateti 5 e 12', modo: 'ipotenusa', a: '5', b: '12' },
	{ label: 'cateti 4 e 4', modo: 'ipotenusa', a: '4', b: '4' },
	{ label: 'i = 25, c = 7', modo: 'cateto', a: '25', b: '7' },
	{ label: 'i = 6, c = 3', modo: 'cateto', a: '6', b: '3' }
];

export function PitagoraTool() {
	const [state, set] = useToolState(DEFAULTS);
	const mode: PitagoraMode = state.modo === 'cateto' ? 'cateto' : 'ipotenusa';
	const unit = isUnit(state.u) ? state.u : '';
	const { outcome, sketch } = useMemo(() => pitagora({ mode, a: state.a, b: state.b, unit }), [mode, state.a, state.b, unit]);
	const [first, second] = FIELDS[mode];
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToggleGroup
						label="Che cosa vuoi trovare"
						options={[
							{ value: 'ipotenusa', label: "Trova l'ipotenusa" },
							{ value: 'cateto', label: 'Trova un cateto' }
						]}
						value={mode}
						onChange={(m) => set(m === 'cateto' ? { modo: m, a: '13', b: '5' } : { modo: m, a: '6', b: '8' })}
					/>
					<div className="grid grid-cols-2 gap-3">
						<ToolField label={first}>
							<input className={toolInputClass} inputMode="decimal" autoComplete="off" value={state.a} onChange={(e) => set({ a: e.target.value })} />
						</ToolField>
						<ToolField label={second}>
							<input className={toolInputClass} inputMode="decimal" autoComplete="off" value={state.b} onChange={(e) => set({ b: e.target.value })} />
						</ToolField>
						<UnitSelect value={unit} onChange={(u) => set({ u })} />
					</div>
					<p className="text-xs text-fg-subtle">Per i decimali puoi usare la virgola: 7,5.</p>
					{sketch && <FigureSketch sketch={sketch} title="Disegno del triangolo rettangolo con le misure" />}
					<Examples items={EXAMPLES.map((x) => ({ label: x.label, apply: () => set({ modo: x.modo, a: x.a, b: x.b }) }))} />
				</>
			}
		/>
	);
}
