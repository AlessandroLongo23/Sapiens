'use client';

import { useMemo } from 'react';
import { MEM_UNITS, unitaMemoria } from '@/lib/tools/unita-memoria';
import { Examples, ToolSheet, useToolState } from './ToolSheet';
import { UnitConverter } from './UnitConverter';

const DEFAULTS = { n: '500', da: 'GB', a: 'GiB' };

const EXAMPLES = [
	{ label: '1 TB → GiB', n: '1', da: 'TB', a: 'GiB' },
	{ label: '2,5 GB → MB', n: '2,5', da: 'GB', a: 'MB' },
	{ label: '1 GiB → MiB', n: '1', da: 'GiB', a: 'MiB' },
	{ label: '100 MB → bit', n: '100', da: 'MB', a: 'bit' }
];

export function UnitaMemoriaTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(() => unitaMemoria(state.n, state.da, state.a), [state.n, state.da, state.a]);
	const unit = MEM_UNITS.find((u) => u.id === state.a)?.id ?? '';
	const result = outcome.ok ? outcome.copy.slice(0, -(unit.length + 1)) : null;
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
						units={MEM_UNITS.map((u) => ({ value: u.id, label: `${u.id} (${u.name})` }))}
						onUnits={(da, a) => set({ da, a })}
						result={result}
						valueLabel="Quantità"
					/>
					<p className="text-xs text-fg-subtle">kB, MB, GB e TB contano per 1000; KiB, MiB, GiB e TiB per 1024.</p>
					<Examples items={EXAMPLES.map(({ label, ...e }) => ({ label, apply: () => set(e) }))} />
				</>
			}
		/>
	);
}
