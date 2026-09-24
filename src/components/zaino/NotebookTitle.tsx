import type { NotebookColor } from '@/lib/zaino/config';

/**
 * The head of a quaderno's page. Lighter than PageHeader on purpose: this is a
 * working list a student opens several times a day, and the section landing at
 * /zaino already carries the full header. The spine says which quaderno this is
 * without a second look at the title.
 */
export function NotebookTitle({ title, color }: { title: string; color: NotebookColor }) {
	return (
		<header data-notebook={color} className="mb-8 flex items-center gap-4">
			<span className="h-10 w-2 shrink-0 rounded-full bg-tint sm:h-12" aria-hidden="true" />
			<div className="min-w-0">
				<p className="label-mono text-tint-fg">Quaderno</p>
				<h1 className="truncate text-4xl font-semibold leading-tight text-fg-strong sm:text-5xl">{title}</h1>
			</div>
		</header>
	);
}
