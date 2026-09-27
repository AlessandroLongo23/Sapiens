'use client';

import { useMemo } from 'react';
import { mcmMcd, type Which } from '@/lib/tools/mcm-mcd';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { n: '12, 18, 30' };

export function McmMcdTool({ which }: { which: Which }) {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(() => mcmMcd(state.n, which), [state.n, which]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToolField label="Numeri" hint="Da 2 a 10 numeri interi positivi, separati da una virgola o da uno spazio.">
						<input className={toolInputClass} inputMode="numeric" autoComplete="off" spellCheck={false} value={state.n} onChange={(e) => set({ n: e.target.value })} />
					</ToolField>
					<Examples items={['12, 18', '8, 12, 20', '15, 28', '36, 48, 60'].map((n) => ({ label: n, apply: () => set({ n }) }))} />
				</>
			}
		/>
	);
}

export const McmTool = () => <McmMcdTool which="mcm" />;
export const McdTool = () => <McmMcdTool which="mcd" />;
