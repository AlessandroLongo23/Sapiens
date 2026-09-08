'use client';

import type { IconComponent } from '@/lib/utils/icons';
import { cn } from '@/lib/utils/cn';

export interface ToggleOption<T extends string> {
	value: T;
	label: string;
	icon?: IconComponent;
}

/** A segmented control: one of a few options, the selected one raised. */
export function ToggleGroup<T extends string>({ options, value, onChange, label, iconOnly = false, labelClass }: { options: ToggleOption<T>[]; value: T; onChange: (value: T) => void; label: string; iconOnly?: boolean; /** On the label text, for hiding it at narrow widths. */ labelClass?: string }) {
	return (
		<div role="group" aria-label={label} className="flex rounded-xl border border-edge bg-surface p-1">
			{/* Every button carries aria-label: with `labelClass` the text can be hidden at
			    narrow widths, and a button whose only label is display:none has no name. */}
			{options.map((o) => (
				<button
					key={o.value}
					type="button"
					aria-pressed={value === o.value}
					aria-label={o.label}
					onClick={() => onChange(o.value)}
					className={cn(
						'flex min-h-[40px] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-1.5 text-sm font-medium transition-colors duration-150 focus-ring',
						value === o.value ? 'bg-accent text-white shadow-sm' : 'text-fg-muted hover:bg-surface-3'
					)}
				>
					{o.icon && <o.icon className="size-4 shrink-0" aria-hidden="true" />}
					{!iconOnly && <span className={labelClass}>{o.label}</span>}
				</button>
			))}
		</div>
	);
}
