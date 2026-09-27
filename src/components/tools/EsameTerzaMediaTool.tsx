'use client';

import { useMemo } from 'react';
import { votoTerzaMedia } from '@/lib/tools/esame-terza-media';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { amm: '8', ita: '7', mat: '8', lin: '7', orale: '8' };

const EXAMPLES = [
	{ label: '7 | 6 7 6 7', amm: '7', ita: '6', mat: '7', lin: '6', orale: '7' },
	{ label: '6 | 5 5 6 6', amm: '6', ita: '5', mat: '5', lin: '6', orale: '6' },
	{ label: '10 | 10 9 10 10', amm: '10', ita: '10', mat: '9', lin: '10', orale: '10' }
];

const TESTS: { key: 'ita' | 'mat' | 'lin' | 'orale'; label: string }[] = [
	{ key: 'ita', label: 'Italiano' },
	{ key: 'mat', label: 'Matematica' },
	{ key: 'lin', label: 'Lingue straniere' },
	{ key: 'orale', label: 'Colloquio' }
];

export function EsameTerzaMediaTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(
		() => votoTerzaMedia({ ammissione: state.amm, italiano: state.ita, matematica: state.mat, lingue: state.lin, colloquio: state.orale }),
		[state.amm, state.ita, state.mat, state.lin, state.orale]
	);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToolField label="Voto di ammissione" hint="In decimi, senza mezzi voti: lo decide il consiglio di classe.">
						<input className={toolInputClass} inputMode="numeric" autoComplete="off" value={state.amm} onChange={(e) => set({ amm: e.target.value })} />
					</ToolField>
					<div className="grid grid-cols-2 gap-3">
						{TESTS.map((t) => (
							<ToolField key={t.key} label={t.label}>
								<input className={toolInputClass} inputMode="numeric" autoComplete="off" value={state[t.key]} onChange={(e) => set({ [t.key]: e.target.value })} />
							</ToolField>
						))}
					</div>
					<Examples items={EXAMPLES.map(({ label, ...e }) => ({ label, apply: () => set(e) }))} />
				</>
			}
		/>
	);
}
