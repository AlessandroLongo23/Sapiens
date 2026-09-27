'use client';

import { useMemo } from 'react';
import { radice, type RootIndex } from '@/lib/tools/radici';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { n: '72', indice: 'quadrata' };

const EXAMPLES: Record<RootIndex, string[]> = { 2: ['144', '50', '180', '7'], 3: ['216', '54', '-40', '100'] };

export function RadiceTool() {
	const [state, set] = useToolState(DEFAULTS);
	const index: RootIndex = state.indice === 'cubica' ? 3 : 2;
	const outcome = useMemo(() => radice(state.n, index), [state.n, index]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToggleGroup
						label="Quale radice"
						options={[
							{ value: 'quadrata', label: 'Quadrata' },
							{ value: 'cubica', label: 'Cubica' }
						]}
						value={index === 3 ? 'cubica' : 'quadrata'}
						onChange={(v) => set({ indice: v })}
					/>
					<ToolField label="Numero" hint={index === 2 ? 'Un numero intero positivo, fino a mille miliardi.' : 'Un numero intero, anche negativo, fino a mille miliardi.'}>
						<input className={toolInputClass} inputMode={index === 2 ? 'numeric' : 'text'} autoComplete="off" spellCheck={false} value={state.n} onChange={(e) => set({ n: e.target.value })} />
					</ToolField>
					<Examples items={EXAMPLES[index].map((n) => ({ label: n, apply: () => set({ n }) }))} />
				</>
			}
		/>
	);
}
