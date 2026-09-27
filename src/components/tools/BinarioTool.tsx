'use client';

import { useMemo } from 'react';
import { BASES, convertiBase } from '@/lib/tools/binario';
import { Examples, ToolSheet, useToolState } from './ToolSheet';
import { UnitConverter } from './UnitConverter';

const DEFAULTS = { n: '156', da: '10', a: '2' };

const EXAMPLES = [
	{ label: '25 → binario', n: '25', da: '10', a: '2' },
	{ label: '101101₂ → decimale', n: '101101', da: '2', a: '10' },
	{ label: '11110101₂ → esadecimale', n: '11110101', da: '2', a: '16' },
	{ label: 'FF₁₆ → decimale', n: 'FF', da: '16', a: '10' }
];

export function BinarioTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(() => convertiBase(state.n, Number(state.da), Number(state.a)), [state.n, state.da, state.a]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<UnitConverter
						value={state.n}
						onValue={(n) => set({ n })}
						from={state.da}
						to={state.a}
						units={BASES.map((b) => ({ value: String(b.id), label: `${b.name[0].toUpperCase()}${b.name.slice(1)} (${b.id})` }))}
						onUnits={(da, a) => set({ da, a })}
						result={outcome.ok ? outcome.copy : null}
						inputMode={state.da === '16' ? 'text' : 'numeric'}
						valueLabel="Numero"
					/>
					<p className="text-xs text-fg-subtle">Numeri interi da 0 a 2^53. In base 16 usa le lettere da A a F.</p>
					<Examples items={EXAMPLES.map(({ label, ...e }) => ({ label, apply: () => set(e) }))} />
				</>
			}
		/>
	);
}
