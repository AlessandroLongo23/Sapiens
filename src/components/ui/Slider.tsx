'use client';

import { useId, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils/cn';

/** 2.5 → "2,5": Italian decimals, as many digits as the step has. */
function format(value: number, step: number) {
	const digits = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
	return value.toFixed(digits).replace('.', ',');
}

/**
 * A slider with a field beside it: drag for a feel of the quantity, type for an exact value. The field takes a comma or a
 * point, applies on Enter or on leaving it, and steps with the arrow keys; a value out of range is brought back inside it.
 * On a phone the label and the field share the first line and the slider gets the whole second one.
 */
export function Slider({
	label,
	value,
	min,
	max,
	step = 0.1,
	unit,
	onChange,
	className
}: {
	label: string;
	value: number;
	min: number;
	max: number;
	step?: number;
	unit?: string;
	onChange: (value: number) => void;
	className?: string;
}) {
	const id = useId();
	// What is being typed, tied to the value it started from: a value moved from outside (the slider, a narrower range) replaces it.
	const [typed, setTyped] = useState<{ text: string; from: number } | null>(null);
	const draft = typed && typed.from === value ? typed.text : null;
	const setDraft = (text: string | null) => setTyped(text === null ? null : { text, from: value });
	const clamp = (x: number) => Math.min(max, Math.max(min, Math.round(x / step) * step));

	const commit = () => {
		if (draft === null) return;
		const x = Number(draft.replace(',', '.').trim());
		if (draft.trim() && Number.isFinite(x)) onChange(clamp(x));
		setDraft(null);
	};
	const key = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') commit();
		else if (e.key === 'Escape') setDraft(null);
		else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
			e.preventDefault();
			onChange(clamp(value + (e.key === 'ArrowUp' ? step : -step) * (e.shiftKey ? 10 : 1)));
		}
	};
	const fill = max > min ? ((value - min) / (max - min)) * 100 : 0;

	return (
		<div className={cn('grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 sm:grid-cols-[9.5rem_1fr_auto]', className)}>
			<label htmlFor={id} className="text-sm font-medium text-fg-muted">
				{label}
			</label>
			<input
				id={id}
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				className="slider col-span-2 sm:col-span-1 sm:col-start-2 sm:row-start-1"
				style={{ '--fill': `${fill}%` } as CSSProperties}
			/>
			<div className="relative col-start-2 row-start-1 sm:col-start-3">
				<input
					type="text"
					inputMode="decimal"
					aria-label={`${label}, valore`}
					value={draft ?? format(value, step)}
					onChange={(e) => setDraft(e.target.value)}
					onBlur={commit}
					onKeyDown={key}
					className={cn(
						// fieldClass, compact: cn does not merge classes, so its w-full and padding cannot be overridden.
						'w-[4.5rem] rounded-lg border border-edge bg-surface px-2.5 py-1 text-right font-mono text-sm text-fg tabular-nums shadow-paper outline-none transition focus:border-accent focus:ring-3 focus:ring-accent/20',
						unit && 'pr-8'
					)}
				/>
				{unit && <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-fg-subtle">{unit}</span>}
			</div>
		</div>
	);
}
