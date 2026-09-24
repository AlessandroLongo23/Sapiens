'use client';

import type { IconComponent } from '@/lib/utils/icons';
import { cn } from '@/lib/utils/cn';

export interface ToggleOption<T extends string> {
	value: T;
	label: string;
	icon?: IconComponent;
}

/** A segmented control: one of a few options, the selected one raised. */
export function ToggleGroup<T extends string>({
	options,
	value,
	onChange,
	label,
	iconOnly = false,
	labelClass,
	compact = false
}: {
	options: ToggleOption<T>[];
	value: T;
	onChange: (value: T) => void;
	label: string;
	iconOnly?: boolean;
	/** On the label text, for hiding it at narrow widths. */
	labelClass?: string;
	/** Shorter, with a quiet selected state, for a toolbar where it must not outshout the content. */
	compact?: boolean;
}) {
	return (
		<div role="group" aria-label={label} className={cn('flex rounded-xl border border-edge', compact ? 'bg-surface-2 p-0.5' : 'bg-surface p-1')}>
			{/* Every button carries aria-label: with `labelClass` the text can be hidden at
			    narrow widths, and a button whose only label is display:none has no name. */}
			{options.map((o) => (
				<button
					key={o.value}
					type="button"
					aria-pressed={value === o.value}
					aria-label={o.label}
					title={compact ? o.label : undefined}
					onClick={() => onChange(o.value)}
					className={cn(
						'flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-sm font-medium transition-colors duration-150 focus-ring',
						compact ? 'min-h-8 px-2.5' : 'min-h-[40px] py-1.5',
						value === o.value
							? compact
								? 'bg-surface text-fg-strong shadow-paper'
								: 'bg-accent text-white shadow-sm'
							: 'text-fg-muted hover:bg-surface-3'
					)}
				>
					{o.icon && <o.icon className="size-4 shrink-0" aria-hidden="true" />}
					{!iconOnly && <span className={labelClass}>{o.label}</span>}
				</button>
			))}
		</div>
	);
}
