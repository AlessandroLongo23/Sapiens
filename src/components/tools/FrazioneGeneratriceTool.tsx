'use client';

import { useMemo } from 'react';
import { frazioneGeneratrice } from '@/lib/tools/frazione-generatrice';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { n: '2,3(18)' };

export function FrazioneGeneratriceTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(() => frazioneGeneratrice(state.n), [state.n]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToolField label="Numero decimale" hint="Scrivi il periodo tra parentesi: 0,1(6) vuol dire 0,1666… con il 6 che si ripete. Senza parentesi il numero è limitato.">
						<input className={toolInputClass} autoComplete="off" autoCapitalize="off" spellCheck={false} value={state.n} onChange={(e) => set({ n: e.target.value })} />
					</ToolField>
					<Examples items={['0,(3)', '0,1(6)', '1,(45)', '0,75'].map((n) => ({ label: n, apply: () => set({ n }) }))} />
				</>
			}
		/>
	);
}
