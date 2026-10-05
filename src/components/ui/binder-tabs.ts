import { cn } from '@/lib/utils/cn';

/**
 * The tabs of a binder, shared by every row of tabs on the site (a subject's years, a student's folder). The
 * row sits on a strong rule; the chosen tab is open towards what is under it, the others close on the rule.
 */
export const binderRowClass = '-mb-px flex items-end gap-1';

export function binderTabClass(active: boolean, className = ''): string {
	return cn(
		'group flex items-baseline gap-2 whitespace-nowrap rounded-t-lg border px-3 transition-colors focus-ring sm:px-3.5',
		active ? 'border-edge-strong border-b-page-alt bg-page-alt pb-2.5 pt-2.5' : 'border-edge border-b-edge-strong bg-surface-2 py-1.5 hover:bg-tint-soft',
		className
	);
}

/** The words on a tab, in the serif. */
export const binderLabelClass = (active: boolean) => cn('font-display text-lg font-semibold', active ? 'text-tint-fg' : 'text-fg-muted group-hover:text-tint-fg');
