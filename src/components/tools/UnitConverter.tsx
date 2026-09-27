'use client';

import { useId } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { fieldClass } from '@/components/ui/Field';
import { cn } from '@/lib/utils/cn';
import { toolInputClass } from './ToolSheet';

/**
 * The control every converter shares (equivalences, temperatures, angles, number bases): the value and its unit on
 * the first row, a button that swaps the two units, the result and its unit on the second row. The steps stay in
 * the result panel of the ToolSheet; the second row repeats the answer next to its unit, as on a calculator.
 */

export interface UnitOption {
	value: string;
	label: string;
}

export function UnitConverter({
	value,
	onValue,
	from,
	to,
	units,
	onUnits,
	result,
	inputMode = 'decimal',
	valueLabel = 'Valore',
	resultLabel = 'Risultato',
	placeholder
}: {
	value: string;
	onValue: (value: string) => void;
	from: string;
	to: string;
	units: UnitOption[];
	/** New units, from the selects or the swap button. */
	onUnits: (from: string, to: string) => void;
	/** The answer as plain text, or null when the input is not valid yet. */
	result: string | null;
	inputMode?: 'decimal' | 'numeric' | 'text';
	valueLabel?: string;
	resultLabel?: string;
	placeholder?: string;
}) {
	const id = useId();
	const selectClass = cn(fieldClass, 'min-h-[48px] cursor-pointer text-base');
	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-col gap-1.5">
				<label htmlFor={`${id}-value`} className="label-mono text-fg-subtle">
					{valueLabel}
				</label>
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
					<input
						id={`${id}-value`}
						className={toolInputClass}
						inputMode={inputMode === 'text' ? undefined : inputMode}
						autoComplete="off"
						autoCapitalize="off"
						spellCheck={false}
						placeholder={placeholder}
						value={value}
						onChange={(e) => onValue(e.target.value)}
					/>
					<select aria-label={`Unità di partenza`} className={selectClass} value={from} onChange={(e) => onUnits(e.target.value, to)}>
						{units.map((u) => (
							<option key={u.value} value={u.value}>
								{u.label}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="flex justify-center">
				<button
					type="button"
					onClick={() => onUnits(to, from)}
					aria-label="Scambia le due unità"
					title="Scambia le due unità"
					className="flex size-10 items-center justify-center rounded-full border border-edge bg-surface text-fg-muted shadow-paper transition-colors hover:border-edge-strong hover:text-fg focus-ring"
				>
					<ArrowUpDown className="size-4" aria-hidden="true" />
				</button>
			</div>

			<div className="flex flex-col gap-1.5">
				<span id={`${id}-result`} className="label-mono text-fg-subtle">
					{resultLabel}
				</span>
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
					<output aria-labelledby={`${id}-result`} className={cn(toolInputClass, 'min-h-[48px] overflow-x-auto whitespace-nowrap bg-surface-2', !result && 'text-fg-faint')}>
						{result ?? '–'}
					</output>
					<select aria-label="Unità di arrivo" className={selectClass} value={to} onChange={(e) => onUnits(from, e.target.value)}>
						{units.map((u) => (
							<option key={u.value} value={u.value}>
								{u.label}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
}
