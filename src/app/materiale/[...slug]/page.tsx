import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { loadNodePage } from '@/lib/server/node-page';
import { getContentTree } from '@/lib/server/content';
import { metadataOr404, pageMetadata } from '@/lib/seo/page-metadata';
import { dbPath, nodePath, plainTitle } from '@/lib/seo/slug';
import { configs } from '@/lib/exercises/config';
import { courseJsonLd, learningResourceJsonLd, type JsonLd as JsonLdData } from '@/lib/seo/jsonld';
import { subjectCopy } from '@/lib/content/subject-copy';
import { countByType, type ContentNode, type NodeType } from '@/lib/utils/tree';
import { iconFor, toneFor } from '@/lib/utils/icons';
import { JsonLd } from '@/components/seo/JsonLd';
import { contentCrumbs } from '@/components/content/Breadcrumb';
import { CardGridSection, Page, PageHeader } from '@/components/content/PageHeader';
import { NodeCard } from '@/components/content/NodeCard';
import type { RowProgress } from '@/components/content/ProgressMeta';
import { SubjectGuide } from '@/components/content/SubjectGuide';
import { Latex } from '@/components/ui/Latex';
import { Stat } from '@/components/ui/Badge';

type Params = { params: Promise<{ slug: string[] }> };

/**
 * What a row can show the student's progress for, from the tree and the exercise config alone, so the cached HTML
 * stays the same for everybody: a lesson with exercises, or a chapter with lessons that have them.
 */
function rowProgress(chain: ContentNode[]): RowProgress | undefined {
	const node = chain[chain.length - 1];
	if (node.type === 'topic') return configs[dbPath(chain)] ? { kind: 'lesson', path: dbPath(chain) } : undefined;
	if (node.type !== 'chapter') return undefined;
	const lessons = node.children.map((lesson) => dbPath([...chain, lesson])).filter((path) => configs[path]);
	return lessons.length > 0 ? { kind: 'chapter', lessons } : undefined;
}

/** No params are prerendered at build; each address renders on first request and is then served from the cache (see `revalidate` in the layout). */
export function generateStaticParams() {
	return [];
}

/** Figures shown under the title, per node type. */
const STATS: Record<NodeType, { key: NodeType; label: string }[]> = {
	level: [
		{ key: 'subject', label: 'Materie' },
		{ key: 'chapter', label: 'Capitoli' },
		{ key: 'topic', label: 'Lezioni' }
	],
	subject: [
		{ key: 'chapter', label: 'Capitoli' },
		{ key: 'topic', label: 'Lezioni' }
	],
	chapter: [{ key: 'topic', label: 'Lezioni' }],
	topic: []
};

/** The section heading over the children, the eyebrow over the title, and how the children are laid out. */
const HEADINGS: Record<NodeType, { title: string; eyebrow: string; layout: 'grid' | 'list' }> = {
	level: { title: 'Materie', eyebrow: 'Livello', layout: 'grid' },
	subject: { title: 'Capitoli', eyebrow: 'Materia', layout: 'list' },
	chapter: { title: 'Lezioni', eyebrow: 'Capitolo', layout: 'list' },
	topic: { title: '', eyebrow: '', layout: 'list' }
};

export function generateMetadata({ params }: Params): Promise<Metadata> {
	return metadataOr404(async () => {
		const { seo, path } = await loadNodePage((await params).slug.join('/'), 'index');
		return pageMetadata({ title: seo.title, description: seo.description, path });
	});
}

/** Level, subject and chapter index pages. Lessons have their own route so index pages ship none of the lesson code. */
export default async function IndexPage({ params }: Params) {
	const { node, ancestors, parentLink, seo } = await loadNodePage((await params).slug.join('/'), 'index');
	const counts = countByType(node.children);
	const level = ancestors[0];
	const guide = node.type === 'subject' ? subjectCopy(level?.slug, node.slug) : null;
	const structured: JsonLdData | undefined =
		node.type === 'subject' ? courseJsonLd(node, ancestors, seo.description) : node.type === 'chapter' ? learningResourceJsonLd(node, ancestors, { description: seo.description, resourceType: 'Capitolo', free: true }) : undefined;
	const heading = HEADINGS[node.type];
	// A chapter is numbered as in its subject's contents; everything else names the level it belongs to.
	const subject = ancestors[1];
	const eyebrow =
		node.type === 'chapter' && subject
			? `${heading.eyebrow} ${String(subject.children.findIndex((c) => c.id === node.id) + 1).padStart(2, '0')} · ${plainTitle(subject.title)}`
			: level && node !== level
				? `${heading.eyebrow} · ${plainTitle(level.title)}`
				: heading.eyebrow;

	return (
		<Page tone={toneFor(node, ...ancestors)}>
			<JsonLd data={structured} />
			<PageHeader
				crumbs={contentCrumbs(ancestors)}
				icon={iconFor(node.type === 'chapter' ? ancestors[1] : node)}
				eyebrow={eyebrow}
				title={<Latex content={node.title} />}
				lead={node.description}
				stats={STATS[node.type].filter(({ key }) => counts[key] > 0).map(({ key, label }) => (
					<Stat key={key} value={counts[key]}>
						{label}
					</Stat>
				))}
			/>
			{node.children.length > 0 ? (
				<CardGridSection id="children-heading" title={heading.title} count={node.children.length} layout={heading.layout}>
					{node.children.map((child, index) => (
						<NodeCard key={child.id} node={child} index={index} href={nodePath([...ancestors, child])} progress={rowProgress([...ancestors, child])} />
					))}
				</CardGridSection>
			) : (
				<div className="flex animate-fade-in flex-col items-center justify-center py-24 text-center">
					<div className="mb-6 rounded-full bg-surface-3 p-6 ring-1 ring-edge">
						<BookOpen className="size-12 text-fg-subtle" aria-hidden="true" />
					</div>
					<h2 className="mb-2 text-xl font-semibold text-fg">Contenuti in arrivo</h2>
					<p className="mb-8 max-w-md text-fg-muted">
						Al momento non ci sono contenuti pubblicati per {plainTitle(node.title)}. Torna presto per nuovi contenuti, oppure esplora{' '}
						<Link href={parentLink.url} className="text-accent-fg hover:underline">
							{plainTitle(parentLink.label)}
						</Link>
						.
					</p>
				</div>
			)}
			{guide && level && <SubjectGuide guide={guide} subject={node} level={level} tree={await getContentTree()} />}
		</Page>
	);
}
