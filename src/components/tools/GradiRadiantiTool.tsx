'use client';

import { useMemo } from 'react';
import { ANGLE_UNITS, gradiRadianti } from '@/lib/tools/gradi-radianti';
import { Examples, ToolSheet, useToolState } from './ToolSheet';
import { UnitConverter } from './UnitConverter';

const DEFAULTS = { n: '45', da: 'gradi', a: 'rad' };

const EXAMPLES = [
	{ label: '30° → rad', n: '30', da: 'gradi', a: 'rad' },
	{ label: '22° 30′ → rad', n: '22° 30′', da: 'gradi', a: 'rad' },
	{ label: '3π/4 → gradi', n: '3π/4', da: 'rad', a: 'gradi' },
	{ label: '1 rad → gradi', n: '1', da: 'rad', a: 'gradi' }
];

export function GradiRadiantiTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(() => gradiRadianti(state.n, state.da, state.a), [state.n, state.da, state.a]);
	const result = outcome.ok ? outcome.copy.replaceAll(' rad', '') : null;
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
						units={ANGLE_UNITS.map((u) => ({ value: u.id, label: u.id === 'gradi' ? 'Gradi (°)' : 'Radianti' }))}
						onUnits={(da, a) => set({ da, a })}
						result={result}
						inputMode="text"
						valueLabel="Angolo"
					/>
					<p className="text-xs text-fg-subtle">Gradi con la virgola (22,5) o in gradi, primi e secondi (22° 30′ 15″, anche 22°30&apos;15&apos;&apos;). Radianti con π (3π/4, oppure 3pi/4) o come numero decimale (1,5).</p>
					<Examples items={EXAMPLES.map(({ label, ...e }) => ({ label, apply: () => set(e) }))} />
				</>
			}
		/>
	);
}
