'use client';

import { useMemo } from 'react';
import { scomposizione } from '@/lib/tools/scomposizione';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { n: '360' };

export function ScomposizioneTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(() => scomposizione(state.n), [state.n]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToolField label="Numero" hint="Un numero intero positivo, fino a mille miliardi.">
						<input className={toolInputClass} inputMode="numeric" autoComplete="off" spellCheck={false} value={state.n} onChange={(e) => set({ n: e.target.value })} />
					</ToolField>
					<Examples items={['84', '1001', '97', '2520'].map((n) => ({ label: n, apply: () => set({ n }) }))} />
				</>
			}
		/>
	);
}
