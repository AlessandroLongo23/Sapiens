'use client';

import { useMemo } from 'react';
import { votoMaturita } from '@/lib/tools/voto-maturita';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { credito: '36', p1: '18', p2: '17', orale: '19' };

const EXAMPLES = [
	{ label: '30 + 14 + 13 + 15', credito: '30', p1: '14', p2: '13', orale: '15' },
	{ label: '25 + 11 + 10 + 12', credito: '25', p1: '11', p2: '10', orale: '12' },
	{ label: '40 + 20 + 20 + 20', credito: '40', p1: '20', p2: '20', orale: '20' }
];

const FIELDS: { key: keyof typeof DEFAULTS; label: string; max: number }[] = [
	{ key: 'credito', label: 'Credito scolastico', max: 40 },
	{ key: 'p1', label: 'Prima prova', max: 20 },
	{ key: 'p2', label: 'Seconda prova', max: 20 },
	{ key: 'orale', label: 'Colloquio', max: 20 }
];

export function VotoMaturitaTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(
		() => votoMaturita({ credito: state.credito, scritto1: state.p1, scritto2: state.p2, orale: state.orale }),
		[state.credito, state.p1, state.p2, state.orale]
	);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<div className="grid grid-cols-2 gap-3">
						{FIELDS.map((f) => (
							<ToolField key={f.key} label={f.label} hint={`Da 0 a ${f.max}.`}>
								<input className={toolInputClass} inputMode="numeric" autoComplete="off" value={state[f.key]} onChange={(e) => set({ [f.key]: e.target.value })} />
							</ToolField>
						))}
					</div>
					<Examples items={EXAMPLES.map(({ label, ...e }) => ({ label, apply: () => set(e) }))} />
				</>
			}
		/>
	);
}
