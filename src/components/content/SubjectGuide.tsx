import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ContentNode } from '@/lib/utils/tree';
import type { SubjectGuideContent } from '@/lib/content/subject-copy';
import { nodePath, plainTitle, slugify } from '@/lib/seo/slug';
import { levelLong } from '@/lib/seo/meta';

const linkClass = 'inline-flex items-center gap-1.5 rounded text-accent-fg hover:underline focus-ring';

/** Editorial copy for a subject, then links to the other subjects at the level and the same subject at the other levels. */
export function SubjectGuide({ guide, subject, level, tree }: { guide: SubjectGuideContent; subject: ContentNode; level: ContentNode; tree: ContentNode[] }) {
	const family = slugify(subject.title).split('-')[0];
	const siblings = level.children.filter((s) => s.id !== subject.id);
	const otherLevels = tree
		.filter((l) => l.id !== level.id)
		.map((l) => ({ level: l, subject: l.children.find((s) => s.slug === subject.slug) ?? l.children.find((s) => slugify(s.title).split('-')[0] === family) ?? null }));

	return (
		<section className="mt-16 max-w-3xl" aria-labelledby="guida-heading">
			{guide.sections.map((section, index) => (
				<div key={section.heading}>
					<h2 id={index === 0 ? 'guida-heading' : undefined} className={`mb-4 text-2xl font-semibold text-fg ${index ? 'mt-10' : ''}`}>
						{section.heading}
					</h2>
					{section.paragraphs.map((p) => (
						<p key={p.slice(0, 40)} className="mb-4 leading-relaxed text-fg-muted">
							{p}
						</p>
					))}
				</div>
			))}
			<nav className="mt-10 border-t border-edge pt-6" aria-label="Collegamenti correlati">
				<h2 className="mb-3 text-lg font-semibold text-fg">Continua a esplorare</h2>
				<ul className="space-y-2 text-fg-muted">
					{siblings.map((s) => (
						<li key={s.id}>
							<Link href={nodePath([level, s])} className={linkClass}>
								{plainTitle(s.title)} per {levelLong(level)}
								<ArrowRight className="size-4" aria-hidden="true" />
							</Link>
						</li>
					))}
					{otherLevels.map(({ level: l, subject: s }) => (
						<li key={l.id}>
							<Link href={s ? nodePath([l, s]) : nodePath([l])} className={linkClass}>
								{s ? `${plainTitle(s.title)} per ${levelLong(l)}` : `Tutto il materiale per ${levelLong(l)}`}
								<ArrowRight className="size-4" aria-hidden="true" />
							</Link>
						</li>
					))}
					<li>
						<Link href="/pricing" className={linkClass}>
							Piani Premium: esercizi, flashcard e lezioni individuali
							<ArrowRight className="size-4" aria-hidden="true" />
						</Link>
					</li>
				</ul>
			</nav>
		</section>
	);
}
