'use client';

import { useMemo } from 'react';
import { percentuale, type PercentMode } from '@/lib/tools/percentuale';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { ModeSwitch, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { modo: 'di', a: '15', b: '80', verso: 'sconto' };

const MODES: { value: PercentMode; label: string }[] = [
	{ value: 'di', label: 'Percentuale di' },
	{ value: 'quale', label: 'Che percentuale' },
	{ value: 'variazione', label: 'Variazione' },
	{ value: 'sconto', label: 'Sconto e aumento' }
];

/** What the two fields are, for each question. */
const FIELDS: Record<PercentMode, [string, string]> = {
	di: ['Percentuale (%)', 'Del numero'],
	quale: ['Parte', 'Del totale'],
	variazione: ['Valore iniziale', 'Valore finale'],
	sconto: ['Prezzo o valore', 'Percentuale (%)']
};

const isMode = (m: string): m is PercentMode => MODES.some((x) => x.value === m);

export function PercentualeTool() {
	const [state, set] = useToolState(DEFAULTS);
	const mode = isMode(state.modo) ? state.modo : 'di';
	const outcome = useMemo(() => percentuale({ mode, a: state.a, b: state.b, up: state.verso === 'aumento' }), [mode, state.a, state.b, state.verso]);
	const [first, second] = FIELDS[mode];
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ModeSwitch label="Che cosa vuoi calcolare" options={MODES} value={mode} onChange={(m) => set({ modo: m })} />
					{mode === 'sconto' && (
						<ToggleGroup
							label="Sconto o aumento"
							options={[
								{ value: 'sconto', label: 'Sconto' },
								{ value: 'aumento', label: 'Aumento' }
							]}
							value={state.verso === 'aumento' ? 'aumento' : 'sconto'}
							onChange={(v) => set({ verso: v })}
						/>
					)}
					<div className="grid grid-cols-2 gap-3">
						<ToolField label={first}>
							<input className={toolInputClass} inputMode="decimal" autoComplete="off" value={state.a} onChange={(e) => set({ a: e.target.value })} />
						</ToolField>
						<ToolField label={second}>
							<input className={toolInputClass} inputMode="decimal" autoComplete="off" value={state.b} onChange={(e) => set({ b: e.target.value })} />
						</ToolField>
					</div>
					<p className="text-xs text-fg-subtle">Per i decimali puoi usare la virgola: 12,5.</p>
				</>
			}
		/>
	);
}
