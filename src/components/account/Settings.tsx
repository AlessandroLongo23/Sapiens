import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/** The title of an account section, at the top of the right column. */
export function SectionHeader({ title, lead }: { title: string; lead: ReactNode }) {
	return (
		<header className="mb-8">
			<h2 className="font-display text-2xl font-semibold text-fg-strong">{title}</h2>
			<p className="mt-2 max-w-2xl text-fg-muted">{lead}</p>
		</header>
	);
}

/** A card of related settings, with a title and a line on what it is for. */
export function SettingsGroup({ title, description, tone = 'default', children }: { title: string; description?: ReactNode; tone?: 'default' | 'danger'; children: ReactNode }) {
	return (
		<section className={cn('rounded-2xl border bg-surface shadow-paper', tone === 'danger' ? 'border-danger-edge' : 'border-edge')}>
			<header className="px-5 pt-5 sm:px-6">
				<h3 className={cn('text-base font-semibold', tone === 'danger' ? 'text-danger-fg' : 'text-fg-strong')}>{title}</h3>
				{description && <p className="mt-1 text-sm text-fg-muted">{description}</p>}
			</header>
			<div className="divide-y divide-edge-soft px-5 pb-1 sm:px-6">{children}</div>
		</section>
	);
}

/** One setting: its name and an explanation on the left, the control on the right (below it on a phone). */
export function SettingRow({ label, hint, children, htmlFor }: { label: ReactNode; hint?: ReactNode; children?: ReactNode; htmlFor?: string }) {
	const Label = htmlFor ? 'label' : 'p';
	return (
		<div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
			<div className="min-w-0">
				<Label htmlFor={htmlFor} className="block text-sm font-medium text-fg">
					{label}
				</Label>
				{hint && <p className="mt-0.5 text-sm text-fg-subtle">{hint}</p>}
			</div>
			{children && <div className="shrink-0">{children}</div>}
		</div>
	);
}

/** A form inside a group: fields stacked, the actions under them. */
export function SettingsForm({ onSubmit, children }: { onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; children: ReactNode }) {
	return (
		<form onSubmit={onSubmit} className="flex flex-col gap-4 py-4">
			{children}
		</form>
	);
}
