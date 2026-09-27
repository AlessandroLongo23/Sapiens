'use client';

import { useMemo } from 'react';
import { circonferenza, type CircleMode } from '@/lib/tools/circonferenza';
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

type Key = 'xc' | 'yc' | 'r' | 'xp' | 'yp' | 'eq';

const MODES: { value: CircleMode; label: string; example: Partial<Record<Key, string>> }[] = [
	{ value: 'centro-raggio', label: 'Centro e raggio', example: { xc: '2', yc: '-3', r: '5' } },
	{ value: 'centro-punto', label: 'Centro e un punto', example: { xc: '1', yc: '2', xp: '4', yp: '6' } },
	{ value: 'equazione', label: "Dall'equazione", example: { eq: 'x^2 + y^2 - 4x + 2y - 4 = 0' } }
];

const DEFAULTS = { modo: 'centro-raggio', xc: '2', yc: '-3', r: '5', xp: '4', yp: '6', eq: 'x^2 + y^2 - 4x + 2y - 4 = 0' };

const EXAMPLES: { label: string; modo: CircleMode; values: Partial<Record<Key, string>> }[] = [
	{ label: 'C(0; 0) r = 3', modo: 'centro-raggio', values: { xc: '0', yc: '0', r: '3' } },
	{ label: 'C(-1; 2) P(2; 6)', modo: 'centro-punto', values: { xc: '-1', yc: '2', xp: '2', yp: '6' } },
	{ label: '2x² + 2y² - 8x + 4y - 10 = 0', modo: 'equazione', values: { eq: '2x^2 + 2y^2 - 8x + 4y - 10 = 0' } },
	{ label: 'x² + y² + 2x + 10 = 0', modo: 'equazione', values: { eq: 'x^2 + y^2 + 2x + 10 = 0' } }
];

export function CirconferenzaTool() {
	const [state, set] = useToolState(DEFAULTS);
	const mode = MODES.find((m) => m.value === state.modo) ?? MODES[0];
	const { outcome, plot } = useMemo(() => circonferenza({ mode: mode.value, xc: state.xc, yc: state.yc, r: state.r, xp: state.xp, yp: state.yp, eq: state.eq }), [mode.value, state.xc, state.yc, state.r, state.xp, state.yp, state.eq]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ModeSwitch label="Che cosa conosci" options={MODES.map((m) => ({ value: m.value, label: m.label }))} value={mode.value} onChange={(v) => set({ modo: v, ...MODES.find((m) => m.value === v)?.example })} />
					{mode.value === 'equazione' ? (
						<ToolField label="Equazione" hint="Per le potenze scrivi x^2 oppure x². Va bene anche (x - 1)^2 + (y + 2)^2 = 9.">
							<input className={toolInputClass} inputMode="text" autoComplete="off" spellCheck={false} value={state.eq} onChange={(e) => set({ eq: e.target.value })} />
						</ToolField>
					) : (
						<>
							<div className="grid grid-cols-2 gap-3">
								<NumberField label="Ascissa del centro (x)" value={state.xc} onChange={(xc) => set({ xc })} />
								<NumberField label="Ordinata del centro (y)" value={state.yc} onChange={(yc) => set({ yc })} />
							</div>
							{mode.value === 'centro-raggio' ? (
								<div className="grid grid-cols-2 gap-3">
									<NumberField label="Raggio (r)" value={state.r} onChange={(r) => set({ r })} />
								</div>
							) : (
								<div className="grid grid-cols-2 gap-3">
									<NumberField label="Ascissa di P (x)" value={state.xp} onChange={(xp) => set({ xp })} />
									<NumberField label="Ordinata di P (y)" value={state.yp} onChange={(yp) => set({ yp })} />
								</div>
							)}
							<p className="text-xs text-fg-subtle">{HINT}</p>
						</>
					)}
					{plot && <CartesianSketch plot={plot} title="La circonferenza nel piano cartesiano, con il centro C" />}
					<Examples items={EXAMPLES.map((x) => ({ label: x.label, apply: () => set({ modo: x.modo, ...x.values }) }))} />
				</>
			}
		/>
	);
}
