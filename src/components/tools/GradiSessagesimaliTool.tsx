'use client';

import { useMemo } from 'react';
import { gradiSessagesimali, type SessagesimaliMode } from '@/lib/tools/gradi-sessagesimali';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { modo: 'dms', g: '23', p: '15', s: '36', n: '23,26' };

const EXAMPLES: { label: string; modo: SessagesimaliMode; g?: string; p?: string; s?: string; n?: string }[] = [
	{ label: '36° 52′ 12″', modo: 'dms', g: '36', p: '52', s: '12' },
	{ label: '10° 20′', modo: 'dms', g: '10', p: '20', s: '' },
	{ label: '22,5°', modo: 'dec', n: '22,5' },
	{ label: '77,1429°', modo: 'dec', n: '77,1429' }
];

export function GradiSessagesimaliTool() {
	const [state, set] = useToolState(DEFAULTS);
	const mode: SessagesimaliMode = state.modo === 'dec' ? 'dec' : 'dms';
	const outcome = useMemo(() => gradiSessagesimali(mode, state.g, state.p, state.s, state.n), [mode, state.g, state.p, state.s, state.n]);
	const field = (key: 'g' | 'p' | 's', label: string, inputMode: 'numeric' | 'decimal') => (
		<ToolField label={label}>
			<input className={toolInputClass} inputMode={inputMode} autoComplete="off" value={state[key]} onChange={(e) => set({ [key]: e.target.value })} />
		</ToolField>
	);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToggleGroup
						label="Da che forma parti"
						options={[
							{ value: 'dms', label: 'Da ° ′ ″ a decimali' },
							{ value: 'dec', label: 'Da decimali a ° ′ ″' }
						]}
						value={mode}
						onChange={(modo) => set({ modo })}
					/>
					{mode === 'dms' ? (
						<>
							<div className="grid grid-cols-3 gap-3">
								{field('g', 'Gradi (°)', 'numeric')}
								{field('p', 'Primi (′)', 'numeric')}
								{field('s', 'Secondi (″)', 'decimal')}
							</div>
							<p className="text-xs text-fg-subtle">Primi e secondi vanno da 0 a 59. Lascia vuoto un campo che vale zero.</p>
						</>
					) : (
						<>
							<ToolField label="Gradi decimali (°)">
								<input className={toolInputClass} inputMode="decimal" autoComplete="off" value={state.n} onChange={(e) => set({ n: e.target.value })} />
							</ToolField>
							<p className="text-xs text-fg-subtle">Con la virgola: 23,26.</p>
						</>
					)}
					<Examples items={EXAMPLES.map(({ label, ...e }) => ({ label, apply: () => set({ ...e }) }))} />
				</>
			}
		/>
	);
}
