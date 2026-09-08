import type { ReactNode } from 'react';
import Link from 'next/link';

/** A long-form page (legal texts, FAQ): one measure, typography styles. */
export function Prose({ children }: { children: ReactNode }) {
	return <div className="prose prose-zinc mx-auto max-w-3xl px-4 py-12 prose-a:text-accent-fg prose-a:underline dark:prose-invert sm:px-6 sm:py-16">{children}</div>;
}

/** Links to the pages that usually come next, at the foot of a marketing page. */
export function RelatedLinks({ links }: { links: [string, string][] }) {
	return (
		<nav className="mt-10 flex flex-wrap gap-4 text-sm" aria-label="Pagine correlate">
			{links.map(([href, label]) => (
				<Link key={href} href={href} className="text-accent-fg underline decoration-accent-edge underline-offset-2 hover:decoration-current">
					{label}
				</Link>
			))}
		</nav>
	);
}

/** The heading of a short marketing page. */
export function MarketingHeader({ title, children }: { title: string; children: ReactNode }) {
	return (
		<header className="mb-10">
			<h1 className="mb-4 text-4xl font-bold tracking-tight text-fg-strong sm:text-5xl">{title}</h1>
			<div className="text-lg leading-relaxed text-fg-muted">{children}</div>
		</header>
	);
}
