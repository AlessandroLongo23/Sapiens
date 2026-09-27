'use client';

import { useMemo } from 'react';
import { potenza } from '@/lib/tools/potenze';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { base: '2/3', esp: '-2' };

const EXAMPLES: { base: string; esp: string }[] = [
	{ base: '2', esp: '10' },
	{ base: '-3', esp: '4' },
	{ base: '1,5', esp: '3' },
	{ base: '5', esp: '-2' }
];

export function PotenzeTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(() => potenza(state.base, state.esp), [state.base, state.esp]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<div className="grid grid-cols-2 gap-3">
						<ToolField label="Base">
							<input className={toolInputClass} inputMode="text" autoComplete="off" spellCheck={false} value={state.base} onChange={(e) => set({ base: e.target.value })} />
						</ToolField>
						<ToolField label="Esponente">
							<input className={toolInputClass} inputMode="text" autoComplete="off" spellCheck={false} value={state.esp} onChange={(e) => set({ esp: e.target.value })} />
						</ToolField>
					</div>
					<p className="text-xs text-fg-subtle">La base può essere un intero, un decimale con la virgola (1,5) o una frazione (2/3); l&apos;esponente un intero, anche negativo o zero.</p>
					<Examples items={EXAMPLES.map((x) => ({ label: `${x.base}^${x.esp}`, apply: () => set(x) }))} />
				</>
			}
		/>
	);
}
