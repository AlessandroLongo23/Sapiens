'use client';

import { useMemo } from 'react';
import { interesse, type Regime, type Unknown } from '@/lib/tools/interesse';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { ModeSwitch, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { tipo: 'composto', cerca: 'montante', c: '1000', m: '1159,27', r: '3', anni: '5', mesi: '0' };

const UNKNOWNS: { value: Unknown; label: string }[] = [
	{ value: 'montante', label: 'Montante' },
	{ value: 'capitale', label: 'Capitale' },
	{ value: 'tasso', label: 'Tasso' }
];

export function InteresseTool() {
	const [state, set] = useToolState(DEFAULTS);
	const regime: Regime = state.tipo === 'semplice' ? 'semplice' : 'composto';
	const cerca: Unknown = UNKNOWNS.some((u) => u.value === state.cerca) ? (state.cerca as Unknown) : 'montante';
	const outcome = useMemo(
		() => interesse({ regime, cerca, c: state.c, m: state.m, r: state.r, anni: state.anni, mesi: state.mesi }),
		[regime, cerca, state.c, state.m, state.r, state.anni, state.mesi]
	);
	const money = (key: 'c' | 'm', label: string) => (
		<ToolField label={label}>
			<input className={toolInputClass} inputMode="decimal" autoComplete="off" value={state[key]} onChange={(e) => set({ [key]: e.target.value })} />
		</ToolField>
	);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToggleGroup
						label="Tipo di interesse"
						options={[
							{ value: 'semplice', label: 'Semplice' },
							{ value: 'composto', label: 'Composto' }
						]}
						value={regime}
						onChange={(tipo) => set({ tipo })}
					/>
					<ModeSwitch label="Che cosa cerchi" options={UNKNOWNS} value={cerca} onChange={(c) => set({ cerca: c })} />
					<div className="grid grid-cols-2 gap-3">
						{cerca !== 'capitale' && money('c', 'Capitale (€)')}
						{cerca !== 'montante' && money('m', 'Montante (€)')}
						{cerca !== 'tasso' && (
							<ToolField label="Tasso annuo (%)">
								<input className={toolInputClass} inputMode="decimal" autoComplete="off" value={state.r} onChange={(e) => set({ r: e.target.value })} />
							</ToolField>
						)}
					</div>
					<div className="grid grid-cols-2 gap-3">
						<ToolField label="Anni">
							<input className={toolInputClass} inputMode="numeric" autoComplete="off" value={state.anni} onChange={(e) => set({ anni: e.target.value })} />
						</ToolField>
						<ToolField label="Mesi">
							<input className={toolInputClass} inputMode="numeric" autoComplete="off" value={state.mesi} onChange={(e) => set({ mesi: e.target.value })} />
						</ToolField>
					</div>
					<p className="text-xs text-fg-subtle">Gli importi in euro con al massimo due decimali: 1500,50. I mesi da 0 a 11.</p>
				</>
			}
		/>
	);
}
