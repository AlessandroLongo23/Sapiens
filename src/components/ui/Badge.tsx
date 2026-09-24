import type { ReactNode } from 'react';
import type { IconComponent } from '@/lib/utils/icons';
import { cn } from '@/lib/utils/cn';

export type BadgeTone = 'neutral' | 'ok' | 'warn' | 'danger' | 'info' | 'accent';

const TONES: Record<BadgeTone, string> = {
	neutral: 'bg-surface-3 text-fg-muted border-edge',
	ok: 'bg-ok-soft text-ok-fg border-ok-edge',
	warn: 'bg-warn-soft text-warn-fg border-warn-edge',
	danger: 'bg-danger-soft text-danger-fg border-danger-edge',
	info: 'bg-info-soft text-info-fg border-info-edge',
	accent: 'bg-accent-soft text-accent-soft-fg border-accent-edge'
};

/** A small pill: a status, a tag, a count. */
export function Badge({ tone = 'neutral', icon: Icon, className, children }: { tone?: BadgeTone; icon?: IconComponent; className?: string; children: ReactNode }) {
	return (
		<span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium', TONES[tone], className)}>
			{Icon && <Icon className="size-3.5" aria-hidden="true" />}
			{children}
		</span>
	);
}

/** A figure with its label, as shown under page titles: a big serif number over a small mono caption. */
export function Stat({ value, children }: { value: ReactNode; children: ReactNode }) {
	return (
		<span className="flex flex-col gap-1 border-l border-edge-strong pl-4 first:border-l-0 first:pl-0">
			<span className="font-display text-4xl font-medium leading-none tracking-tight text-fg-strong tabular-nums">{value}</span>
			<span className="label-mono text-fg-subtle">{children}</span>
		</span>
	);
}
