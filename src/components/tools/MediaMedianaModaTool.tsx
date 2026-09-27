'use client';

import { useMemo } from 'react';
import { medie, type MeanKind } from '@/lib/tools/media-mediana-moda';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { modo: 'semplice', n: '12; 7; 15; 9; 7; 20; 11; 14', p: '' };

const SIMPLE_EXAMPLES = ['3 5 3 5 8', '9 3 7 1 5', '1,5; 2,5; 4', '-3 1 0 -2 4 5 2'];
const WEIGHTED_EXAMPLES = [
	{ n: '6 8 5', p: '2 2 1' },
	{ n: '7,5 6', p: '30 70' },
	{ n: '4 6 7', p: '1 3 2' }
];

export function MediaMedianaModaTool() {
	const [state, set] = useToolState(DEFAULTS);
	const kind: MeanKind = state.modo === 'ponderata' ? 'ponderata' : 'semplice';
	const outcome = useMemo(() => medie(kind, state.n, state.p), [kind, state.n, state.p]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToggleGroup
						label="Che media vuoi calcolare"
						options={[
							{ value: 'semplice', label: 'Media, mediana, moda' },
							{ value: 'ponderata', label: 'Media ponderata' }
						]}
						value={kind}
						onChange={(v) => set({ modo: v })}
					/>
					<ToolField label={kind === 'ponderata' ? 'Valori' : 'Numeri'} hint={kind === 'ponderata' ? 'Oppure le coppie valore:peso, come 6:2 8:2 5:1, lasciando vuoti i pesi.' : 'Da 2 a 100 numeri, separati da uno spazio o da un punto e virgola. Per i decimali usa la virgola: 7,5.'}>
						<input className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={state.n} onChange={(e) => set({ n: e.target.value })} />
					</ToolField>
					{kind === 'ponderata' && (
						<ToolField label="Pesi" hint="Uno per ogni valore, nello stesso ordine.">
							<input className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={state.p} onChange={(e) => set({ p: e.target.value })} />
						</ToolField>
					)}
					{kind === 'ponderata' ? (
						<Examples items={WEIGHTED_EXAMPLES.map((x) => ({ label: `${x.n} | ${x.p}`, apply: () => set(x) }))} />
					) : (
						<Examples items={SIMPLE_EXAMPLES.map((n) => ({ label: n, apply: () => set({ n }) }))} />
					)}
				</>
			}
		/>
	);
}
