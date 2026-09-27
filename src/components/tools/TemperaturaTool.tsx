'use client';

import { useMemo } from 'react';
import { TEMP_SCALES, temperatura } from '@/lib/tools/temperatura';
import { Examples, ToolSheet, useToolState } from './ToolSheet';
import { UnitConverter } from './UnitConverter';

const DEFAULTS = { n: '100', da: 'C', a: 'F' };

const EXAMPLES = [
	{ label: '37 °C → °F', n: '37', da: 'C', a: 'F' },
	{ label: '-40 °F → °C', n: '-40', da: 'F', a: 'C' },
	{ label: '0 K → °C', n: '0', da: 'K', a: 'C' },
	{ label: '20 °C → K', n: '20', da: 'C', a: 'K' }
];

export function TemperaturaTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(() => temperatura(state.n, state.da, state.a), [state.n, state.da, state.a]);
	const unitText = TEMP_SCALES.find((s) => s.id === state.a)?.text ?? '';
	const result = outcome.ok ? outcome.copy.replace(` ${unitText}`, '') : null;
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
						units={TEMP_SCALES.map((s) => ({ value: s.id, label: `${s.text} (${s.name})` }))}
						onUnits={(da, a) => set({ da, a })}
						result={result}
						valueLabel="Temperatura"
					/>
					<p className="text-xs text-fg-subtle">Per i decimali puoi usare la virgola: 36,5. Sotto lo zero scrivi il segno meno: -10.</p>
					<Examples items={EXAMPLES.map(({ label, ...e }) => ({ label, apply: () => set(e) }))} />
				</>
			}
		/>
	);
}
