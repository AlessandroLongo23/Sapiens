'use client';

import { useMemo } from 'react';
import { calcoloAssenze, type AssenzeMode } from '@/lib/tools/assenze';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { modo: 'settimana', ore: '27', giorni: '5', fatte: '60' };

const EXAMPLES = [
	{ label: '27 ore, 60 assenze', modo: 'settimana', ore: '27', giorni: '5', fatte: '60' },
	{ label: '30 ore in 6 giorni', modo: 'settimana', ore: '30', giorni: '6', fatte: '' },
	{ label: '1056 ore, 250 assenze', modo: 'anno', ore: '1056', giorni: '5', fatte: '250' },
	{ label: '32 ore, 280 assenze', modo: 'settimana', ore: '32', giorni: '5', fatte: '280' }
];

export function AssenzeTool() {
	const [state, set] = useToolState(DEFAULTS);
	const mode: AssenzeMode = state.modo === 'anno' ? 'anno' : 'settimana';
	const days = state.giorni === '6' ? '6' : '5';
	const outcome = useMemo(() => calcoloAssenze({ modo: mode, ore: state.ore, giorni: days, fatte: state.fatte }), [mode, state.ore, days, state.fatte]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToggleGroup
						label="Che cosa conosci"
						options={[
							{ value: 'settimana', label: 'Ore a settimana' },
							{ value: 'anno', label: 'Monte ore annuale' }
						]}
						value={mode}
						onChange={(v) => set({ modo: v })}
					/>
					<div className="grid grid-cols-2 gap-3">
						<ToolField label={mode === 'anno' ? 'Monte ore annuale' : 'Ore a settimana'} hint={mode === 'anno' ? 'Lo trovi sul sito o sul registro della scuola.' : 'Si contano 33 settimane di lezione.'}>
							<input className={toolInputClass} inputMode="numeric" autoComplete="off" value={state.ore} onChange={(e) => set({ ore: e.target.value })} />
						</ToolField>
						<ToolField label="Ore di assenza fatte" hint="Lascia vuoto se non ne hai.">
							<input className={toolInputClass} inputMode="decimal" autoComplete="off" value={state.fatte} onChange={(e) => set({ fatte: e.target.value })} />
						</ToolField>
					</div>
					<div className="flex flex-col gap-1.5">
						<span className="label-mono text-fg-subtle">Giorni di scuola a settimana</span>
						<ToggleGroup
							label="Giorni di scuola a settimana"
							options={[
								{ value: '5', label: '5 giorni' },
								{ value: '6', label: '6 giorni' }
							]}
							value={days}
							onChange={(v) => set({ giorni: v })}
						/>
					</div>
					<Examples items={EXAMPLES.map(({ label, ...e }) => ({ label, apply: () => set(e) }))} />
				</>
			}
		/>
	);
}
