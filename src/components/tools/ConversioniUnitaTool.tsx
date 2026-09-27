'use client';

import { useMemo } from 'react';
import { CONV_QUANTITIES, conversione, type ConvQuantity } from '@/lib/tools/conversioni-unita';
import { Examples, ToolSheet, useToolState } from './ToolSheet';
import { UnitConverter } from './UnitConverter';

/**
 * The converters by a factor, one page each: speed, energy, power (and its kW ↔ CV page), pressure, inches and
 * centimetres. One engine, src/lib/tools/conversioni-unita.ts; each page picks its units, example and hint.
 */

interface Example {
	label: string;
	n: string;
	da: string;
	a: string;
}

function ConverterTool({
	quantity,
	only,
	defaults,
	examples,
	hint,
	valueLabel,
	inputMode = 'decimal'
}: {
	quantity: ConvQuantity;
	/** The units this page offers, when not all of them. */
	only?: string[];
	defaults: { n: string; da: string; a: string };
	examples: Example[];
	hint: string;
	valueLabel: string;
	inputMode?: 'decimal' | 'text';
}) {
	const [state, set] = useToolState(defaults);
	const units = CONV_QUANTITIES[quantity].units.filter((u) => !only || only.includes(u.id));
	const has = (id: string) => units.some((u) => u.id === id);
	const from = has(state.da) ? state.da : defaults.da;
	const to = has(state.a) ? state.a : defaults.a;
	const outcome = useMemo(() => conversione({ quantity, value: state.n, from, to }), [quantity, state.n, from, to]);
	const unitText = units.find((u) => u.id === to)?.text ?? '';
	const result = outcome.ok ? outcome.copy.slice(0, -(unitText.length + 1)) : null;
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<UnitConverter
						value={state.n}
						onValue={(n) => set({ n })}
						from={from}
						to={to}
						units={units.map((u) => ({ value: u.id, label: `${u.text} (${u.name})` }))}
						onUnits={(da, a) => set({ da, a })}
						result={result}
						valueLabel={valueLabel}
						inputMode={inputMode}
					/>
					<p className="text-xs text-fg-subtle">{hint}</p>
					<Examples items={examples.map(({ label, ...e }) => ({ label, apply: () => set(e) }))} />
				</>
			}
		/>
	);
}

const DECIMALS = 'Per i decimali puoi usare la virgola: 3,5.';

export function VelocitaTool() {
	return (
		<ConverterTool
			quantity="velocita"
			defaults={{ n: '90', da: 'km/h', a: 'm/s' }}
			valueLabel="Velocità"
			hint={DECIMALS}
			examples={[
				{ label: '100 km/h → m/s', n: '100', da: 'km/h', a: 'm/s' },
				{ label: '10 m/s → km/h', n: '10', da: 'm/s', a: 'km/h' },
				{ label: '30 nodi → km/h', n: '30', da: 'kn', a: 'km/h' },
				{ label: '65 mph → km/h', n: '65', da: 'mph', a: 'km/h' }
			]}
		/>
	);
}

export function EnergiaTool() {
	return (
		<ConverterTool
			quantity="energia"
			defaults={{ n: '250', da: 'kcal', a: 'kJ' }}
			valueLabel="Energia"
			hint={DECIMALS}
			examples={[
				{ label: '1 kWh → J', n: '1', da: 'kWh', a: 'J' },
				{ label: '500 J → cal', n: '500', da: 'J', a: 'cal' },
				{ label: '2000 kcal → kWh', n: '2000', da: 'kcal', a: 'kWh' },
				{ label: '1 eV → J', n: '1', da: 'eV', a: 'J' }
			]}
		/>
	);
}

export function PotenzaTool() {
	return (
		<ConverterTool
			quantity="potenza"
			defaults={{ n: '100', da: 'CV', a: 'kW' }}
			valueLabel="Potenza"
			hint="CV è il cavallo vapore metrico, usato in Italia; HP è il cavallo britannico, un po' più grande."
			examples={[
				{ label: '1 kW → CV', n: '1', da: 'kW', a: 'CV' },
				{ label: '150 HP → kW', n: '150', da: 'HP', a: 'kW' },
				{ label: '300 HP → CV', n: '300', da: 'HP', a: 'CV' },
				{ label: '1500 W → kW', n: '1500', da: 'W', a: 'kW' }
			]}
		/>
	);
}

export function KwCvTool() {
	return (
		<ConverterTool
			quantity="potenza"
			only={['kW', 'CV']}
			defaults={{ n: '110', da: 'kW', a: 'CV' }}
			valueLabel="Potenza"
			hint="Sul libretto dell'auto la potenza è in kW: qui trovi i cavalli vapore (CV) corrispondenti."
			examples={[
				{ label: '100 CV → kW', n: '100', da: 'CV', a: 'kW' },
				{ label: '1 kW → CV', n: '1', da: 'kW', a: 'CV' },
				{ label: '55 kW → CV', n: '55', da: 'kW', a: 'CV' },
				{ label: '11 kW → CV', n: '11', da: 'kW', a: 'CV' }
			]}
		/>
	);
}

export function PressioneTool() {
	return (
		<ConverterTool
			quantity="pressione"
			defaults={{ n: '2,5', da: 'bar', a: 'atm' }}
			valueLabel="Pressione"
			hint={DECIMALS}
			examples={[
				{ label: '1 atm → mmHg', n: '1', da: 'atm', a: 'mmHg' },
				{ label: '1013 hPa → atm', n: '1013', da: 'hPa', a: 'atm' },
				{ label: '32 psi → bar', n: '32', da: 'psi', a: 'bar' },
				{ label: '750 mmHg → hPa', n: '750', da: 'mmHg', a: 'hPa' }
			]}
		/>
	);
}

export function PolliciTool() {
	return (
		<ConverterTool
			quantity="lunghezza"
			defaults={{ n: '55', da: 'in', a: 'cm' }}
			valueLabel="Lunghezza"
			inputMode="text"
			hint={`Per i decimali puoi usare la virgola: 15,6. Piedi e pollici si scrivono così: 5'11".`}
			examples={[
				{ label: '32 pollici → cm', n: '32', da: 'in', a: 'cm' },
				{ label: '15,6 pollici → cm', n: '15,6', da: 'in', a: 'cm' },
				{ label: `5'11" → cm`, n: `5'11"`, da: 'in', a: 'cm' },
				{ label: '175 cm → piedi', n: '175', da: 'cm', a: 'ft' }
			]}
		/>
	);
}
