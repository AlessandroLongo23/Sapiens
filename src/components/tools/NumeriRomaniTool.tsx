'use client';

import { useMemo } from 'react';
import { numeriRomani } from '@/lib/tools/numeri-romani';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { n: '1994' };

export function NumeriRomaniTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(() => numeriRomani(state.n), [state.n]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToolField label="Numero arabo o romano" hint="Un numero da 1 a 3999, oppure un numero romano come MCMXCIV: il verso della conversione si sceglie da solo.">
						<input className={toolInputClass} autoComplete="off" autoCapitalize="characters" spellCheck={false} value={state.n} onChange={(e) => set({ n: e.target.value })} />
					</ToolField>
					<Examples items={['2026', '49', 'XLII', 'MCMLXXXIV'].map((n) => ({ label: n, apply: () => set({ n }) }))} />
				</>
			}
		/>
	);
}
