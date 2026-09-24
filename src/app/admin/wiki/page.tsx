import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, PenLine, Sigma } from 'lucide-react';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { getContentTree } from '@/lib/server/content';
import { nodePath, plainTitle, subviewPath, dbPath } from '@/lib/seo/slug';
import { countByType, type ContentNode } from '@/lib/utils/tree';
import { configs } from '@/lib/exercises/config';
import { Stat } from '@/components/ui/Badge';
import { Latex } from '@/components/ui/Latex';

export const metadata: Metadata = pageMetadata({ title: 'Wiki | Admin | Sapiens', path: '/admin/wiki' });

const link = 'rounded text-accent-fg hover:underline focus-ring';

/** One lesson row: the title and which of its sections exist. */
function Lesson({ chain }: { chain: ContentNode[] }) {
	const node = chain[chain.length - 1];
	const exercises = !!configs[dbPath(chain)];
	return (
		<li className="flex flex-wrap items-center gap-x-3 gap-y-1 py-1.5 text-sm">
			<Link href={nodePath(chain)} className={link}><Latex content={node.title} /></Link>
			<span className="flex items-center gap-2 text-xs text-fg-subtle">
				<span className={node.has_theory ? 'text-ok-fg' : ''} title="Teoria"><BookOpen className="size-3.5" aria-hidden="true" /></span>
				{exercises && <Link href={subviewPath(chain, 'exercises')} className="text-ok-fg" title="Esercizi"><PenLine className="size-3.5" aria-hidden="true" /></Link>}
				{node.has_formulary && <Link href={subviewPath(chain, 'formulary')} className="text-ok-fg" title="Formulario"><Sigma className="size-3.5" aria-hidden="true" /></Link>}
			</span>
		</li>
	);
}

/** The whole library as an outline, straight from the database, with a link to every public page. */
export default async function AdminWikiPage() {
	const tree = await getContentTree();
	const counts = countByType(tree);
	const withTheory = tree.flatMap((l) => l.children.flatMap((s) => s.children.flatMap((c) => c.children))).filter((t) => t.has_theory).length;
	return (
		<div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
			<header className="mb-8">
				<h1 className="mb-2 text-3xl font-bold text-fg">Wiki</h1>
				<p className="mb-4 text-fg-muted">Livelli, materie, capitoli e lezioni pubblicati nel database, con le sezioni già scritte in verde.</p>
				<div className="flex flex-wrap gap-x-6 gap-y-4">
					<Stat value={counts.subject}>Materie</Stat>
					<Stat value={counts.chapter}>Capitoli</Stat>
					<Stat value={counts.topic}>Lezioni</Stat>
					<Stat value={withTheory}>Con teoria</Stat>
				</div>
			</header>
			{tree.map((level) => (
				<section key={level.id} className="mb-10" aria-labelledby={`level-${level.id}`}>
					<h2 id={`level-${level.id}`} className="mb-3 text-2xl font-semibold text-fg">
						<Link href={nodePath([level])} className={link}>{level.title}</Link>
					</h2>
					<div className="grid gap-4 md:grid-cols-2">
						{level.children.map((subject) => (
							<div key={subject.id} className="rounded-2xl border border-edge bg-surface p-4">
								<h3 className="mb-2 font-semibold text-fg">
									<Link href={nodePath([level, subject])} className={link}>{plainTitle(subject.title)}</Link>
								</h3>
								{subject.children.map((chapter) => (
									<details key={chapter.id} className="group">
										<summary className="cursor-pointer list-none py-1 text-sm text-fg-muted marker:hidden">
											<Link href={nodePath([level, subject, chapter])} className={link}><Latex content={chapter.title} /></Link>
											<span className="ml-2 text-xs text-fg-subtle">{chapter.children.length} lezioni</span>
										</summary>
										<ul className="ml-3 border-l border-edge pl-3">
											{chapter.children.map((topic) => <Lesson key={topic.id} chain={[level, subject, chapter, topic]} />)}
										</ul>
									</details>
								))}
							</div>
						))}
					</div>
				</section>
			))}
		</div>
	);
}
