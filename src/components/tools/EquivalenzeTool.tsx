'use client';

import { useMemo } from 'react';
import { DEFAULT_UNITS, QUANTITIES, QUANTITY_IDS, equivalenza, type Quantity } from '@/lib/tools/equivalenze';
import { Examples, ModeSwitch, ToolSheet, useToolState } from './ToolSheet';
import { UnitConverter } from './UnitConverter';

const DEFAULTS = { modo: 'lunghezza', n: '3,5', da: 'km', a: 'm' };

const MODES: { value: Quantity; label: string }[] = [
	{ value: 'lunghezza', label: 'Lunghezza' },
	{ value: 'massa', label: 'Massa' },
	{ value: 'capacita', label: 'Capacità' },
	{ value: 'superficie', label: 'Superficie' },
	{ value: 'volume', label: 'Volume' },
	{ value: 'tempo', label: 'Tempo' }
];

const isQuantity = (m: string): m is Quantity => (QUANTITY_IDS as string[]).includes(m);

const EXAMPLES: { label: string; modo: Quantity; n: string; da: string; a: string }[] = [
	{ label: '250 cm → m', modo: 'lunghezza', n: '250', da: 'cm', a: 'm' },
	{ label: '1,2 q → kg', modo: 'massa', n: '1,2', da: 'q', a: 'kg' },
	{ label: '3 ha → m²', modo: 'superficie', n: '3', da: 'ha', a: 'm2' },
	{ label: '2,5 dm³ → l', modo: 'volume', n: '2,5', da: 'dm3', a: 'l' }
];

export function EquivalenzeTool() {
	const [state, set] = useToolState(DEFAULTS);
	const quantity = isQuantity(state.modo) ? state.modo : 'lunghezza';
	const units = QUANTITIES[quantity].units;
	const has = (id: string) => units.some((u) => u.id === id);
	const [defFrom, defTo] = DEFAULT_UNITS[quantity];
	const from = has(state.da) ? state.da : defFrom;
	const to = has(state.a) ? state.a : defTo;
	const outcome = useMemo(() => equivalenza({ quantity, value: state.n, from, to }), [quantity, state.n, from, to]);
	const unitText = units.find((u) => u.id === to)?.text ?? '';
	const result = outcome.ok ? outcome.copy.replace(new RegExp(` ${unitText}$`), '') : null;
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ModeSwitch
						label="Grandezza"
						options={MODES}
						value={quantity}
						onChange={(m) => {
							const [da, a] = DEFAULT_UNITS[m];
							set({ modo: m, da, a });
						}}
					/>
					<UnitConverter
						value={state.n}
						onValue={(n) => set({ n })}
						from={from}
						to={to}
						units={units.map((u) => ({ value: u.id, label: u.alias || u.id === 'q' || u.id === 't' ? `${u.text} (${u.name})` : u.text }))}
						onUnits={(da, a) => set({ da, a })}
						result={result}
						valueLabel="Misura"
					/>
					<p className="text-xs text-fg-subtle">Per i decimali puoi usare la virgola: 3,5.</p>
					<Examples items={EXAMPLES.map(({ label, ...e }) => ({ label, apply: () => set(e) }))} />
				</>
			}
		/>
	);
}
