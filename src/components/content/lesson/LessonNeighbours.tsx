import Link from 'next/link';
import type { LessonLink } from '@/lib/content/prerequisites';
import { Latex } from '@/components/ui/Latex';
import { cn } from '@/lib/utils/cn';

/** Lessons as a wrapping row: a filled dot and a link when written, a hollow dot and plain text when still to come (as in the level menu). */
function LinkRow({ links }: { links: LessonLink[] }) {
	return (
		<ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
			{links.map((l) => (
				<li key={l.url} className="flex min-w-0 items-center gap-2 text-sm">
					<span className={cn('size-1.5 shrink-0 rounded-full', l.written ? 'bg-tint' : 'border border-fg-subtle')} aria-hidden="true" />
					{l.written ? (
						<Link href={l.url} className="font-medium text-fg underline decoration-edge-strong underline-offset-4 transition-colors hover:text-accent-fg hover:decoration-current">
							<Latex content={l.title} />
						</Link>
					) : (
						<span className="text-fg-subtle" title="In arrivo">
							<Latex content={l.title} />
							<span className="sr-only"> (in arrivo)</span>
						</span>
					)}
				</li>
			))}
		</ul>
	);
}

/** Above the theory: the lessons this one builds on. */
export function LessonNeeds({ links }: { links: LessonLink[] }) {
	if (!links.length) return null;
	return (
		<aside className="mt-5 rounded-xl border border-edge-soft bg-surface-2 px-4 py-3" aria-labelledby="lesson-needs">
			<h2 id="lesson-needs" className="label-mono text-fg-subtle">
				Prima di cominciare
			</h2>
			<p className="mt-1 text-sm text-fg-muted">{links.length === 1 ? 'Per seguire questa lezione ti serve:' : 'Per seguire questa lezione ti servono:'}</p>
			<LinkRow links={links} />
		</aside>
	);
}

/** Below the theory: the lessons that build on this one. */
export function LessonUsedIn({ links }: { links: LessonLink[] }) {
	if (!links.length) return null;
	return (
		<section className="mx-4 mb-6 border-t border-edge pt-5 sm:mx-6 md:mx-10" aria-labelledby="lesson-used-in">
			<h2 id="lesson-used-in" className="label-mono text-fg-subtle">
				Dove si usa
			</h2>
			<p className="mt-1 text-sm text-fg-muted">Quello che hai imparato qui serve in:</p>
			<LinkRow links={links} />
		</section>
	);
}
