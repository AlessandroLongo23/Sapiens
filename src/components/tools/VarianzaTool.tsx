'use client';

import { useMemo } from 'react';
import { varianza } from '@/lib/tools/varianza';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

/** The four delays of the bus in the lesson "Indici di variabilità": a mean with a comma, a root that is not exact. */
const DEFAULTS = { n: '3 5 6 8' };

const EXAMPLES = ['2 4 4 4 5 5 7 9', '6 7 7 7 8', '1 2 4', '-2 -1 0 1 3 4 2', '1,5; 2,5; 4'];

export function VarianzaTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(() => varianza(state.n), [state.n]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToolField label="Dati" hint="Da 2 a 100 numeri, separati da uno spazio o da un punto e virgola. Per i decimali usa la virgola: 7,5.">
						<input className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={state.n} onChange={(e) => set({ n: e.target.value })} />
					</ToolField>
					<Examples items={EXAMPLES.map((n) => ({ label: n, apply: () => set({ n }) }))} />
				</>
			}
		/>
	);
}
