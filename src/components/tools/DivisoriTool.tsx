'use client';

import { useMemo } from 'react';
import { divisori } from '@/lib/tools/divisori';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { n: '360' };

export function DivisoriTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(() => divisori(state.n), [state.n]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToolField label="Numero" hint="Un numero intero positivo, fino a un miliardo.">
						<input className={toolInputClass} inputMode="numeric" autoComplete="off" spellCheck={false} value={state.n} onChange={(e) => set({ n: e.target.value })} />
					</ToolField>
					<Examples items={['36', '28', '97', '1000'].map((n) => ({ label: n, apply: () => set({ n }) }))} />
				</>
			}
		/>
	);
}
