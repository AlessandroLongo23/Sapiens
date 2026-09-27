'use client';

import { useMemo } from 'react';
import { SCALES, SCALE_NAMES, convertiVoto } from '@/lib/tools/conversione-voti';
import { Examples, ToolSheet, useToolState } from './ToolSheet';
import { UnitConverter } from './UnitConverter';

const DEFAULTS = { n: '7', da: '10', a: '15' };

const EXAMPLES = [
	{ label: '6 in ventesimi', n: '6', da: '10', a: '20' },
	{ label: '12/15 in decimi', n: '12', da: '15', a: '10' },
	{ label: '24/30 in decimi', n: '24', da: '30', a: '10' },
	{ label: '75/100 in decimi', n: '75', da: '100', a: '10' }
];

export function ConversioneVotiTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(() => convertiVoto(state.n, Number(state.da), Number(state.a)), [state.n, state.da, state.a]);
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
						units={SCALES.map((s) => ({ value: String(s), label: `${SCALE_NAMES[s][0].toUpperCase()}${SCALE_NAMES[s].slice(1)} (su ${s})` }))}
						onUnits={(da, a) => set({ da, a })}
						result={outcome.ok ? outcome.copy : null}
						valueLabel="Voto"
					/>
					<p className="text-xs text-fg-subtle">Per i decimali usa la virgola: 7,5.</p>
					<Examples items={EXAMPLES.map(({ label, ...e }) => ({ label, apply: () => set(e) }))} />
				</>
			}
		/>
	);
}
