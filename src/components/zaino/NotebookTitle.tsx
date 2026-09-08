import type { NotebookColor } from '@/lib/zaino/config';
import { cn } from '@/lib/utils/cn';

/** The spine colours, mirrored from the shelf so a quaderno is recognisable inside it. */
const SPINE: Record<NotebookColor, string> = {
	zinc: 'bg-zinc-400 dark:bg-zinc-500',
	crimson: 'bg-crimson-500',
	amber: 'bg-amber-500',
	teal: 'bg-teal-500',
	sky: 'bg-sky-500',
	indigo: 'bg-indigo-500'
};

/**
 * The head of a quaderno's page. Lighter than PageHeader on purpose: this is a
 * working list a student opens several times a day, and the section landing at
 * /zaino already carries the full header. The spine says which quaderno this is
 * without a second look at the title.
 */
export function NotebookTitle({ title, color }: { title: string; color: NotebookColor }) {
	return (
		<header className="mb-6 flex items-center gap-3.5">
			<span className={cn('h-9 w-1.5 shrink-0 rounded-full sm:h-11', SPINE[color])} aria-hidden="true" />
			<h1 className="min-w-0 truncate text-3xl font-bold tracking-tight text-fg-strong sm:text-4xl">{title}</h1>
		</header>
	);
}
