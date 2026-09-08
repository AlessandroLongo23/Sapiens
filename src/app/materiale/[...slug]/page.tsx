import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, FileText, Layers } from 'lucide-react';
import { loadNodePage } from '@/lib/server/node-page';
import { getContentTree } from '@/lib/server/content';
import { metadataOr404, pageMetadata } from '@/lib/seo/page-metadata';
import { nodePath, plainTitle } from '@/lib/seo/slug';
import { courseJsonLd, learningResourceJsonLd, type JsonLd as JsonLdData } from '@/lib/seo/jsonld';
import { subjectCopy } from '@/lib/content/subject-copy';
import { countByType, type NodeType } from '@/lib/utils/tree';
import { iconFor, type IconComponent } from '@/lib/utils/icons';
import { JsonLd } from '@/components/seo/JsonLd';
import { contentCrumbs } from '@/components/content/Breadcrumb';
import { CardGridSection, Page, PageHeader } from '@/components/content/PageHeader';
import { NodeCard } from '@/components/content/NodeCard';
import { SubjectGuide } from '@/components/content/SubjectGuide';
import { Latex } from '@/components/ui/Latex';
import { Stat } from '@/components/ui/Badge';

type Params = { params: Promise<{ slug: string[] }> };

/** No params are prerendered at build; each address renders on first request and is then served from the cache (see `revalidate` in the layout). */
export function generateStaticParams() {
	return [];
}

/** Figures shown under the title, per node type. */
const STATS: Record<NodeType, { key: NodeType; label: string; icon: IconComponent; color: string }[]> = {
	level: [
		{ key: 'subject', label: 'Materie', icon: BookOpen, color: 'text-rose-500' },
		{ key: 'chapter', label: 'Capitoli', icon: Layers, color: 'text-teal-500' },
		{ key: 'topic', label: 'Lezioni', icon: FileText, color: 'text-indigo-500' }
	],
	subject: [
		{ key: 'chapter', label: 'Capitoli', icon: Layers, color: 'text-teal-500' },
		{ key: 'topic', label: 'Lezioni', icon: FileText, color: 'text-indigo-500' }
	],
	chapter: [{ key: 'topic', label: 'Lezioni', icon: FileText, color: 'text-indigo-500' }],
	topic: []
};

const HEADINGS: Record<NodeType, { title: string; icon: IconComponent; color: string }> = {
	level: { title: 'Materie disponibili', icon: BookOpen, color: 'text-rose-500' },
	subject: { title: 'Capitoli disponibili', icon: Layers, color: 'text-teal-500' },
	chapter: { title: 'Lezioni disponibili', icon: FileText, color: 'text-indigo-500' },
	topic: { title: '', icon: FileText, color: '' }
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

	return (
		<Page>
			<JsonLd data={structured} />
			<PageHeader
				crumbs={contentCrumbs(ancestors)}
				icon={iconFor(node)}
				title={<Latex content={node.title} />}
				lead={node.description}
				stats={STATS[node.type].filter(({ key }) => counts[key] > 0).map(({ key, label, icon, color }) => (
					<Stat key={key} icon={icon} color={color}>
						{counts[key]} {label}
					</Stat>
				))}
			/>
			{node.children.length > 0 ? (
				<CardGridSection id="children-heading" icon={heading.icon} color={heading.color} title={heading.title}>
					{node.children.map((child) => (
						<NodeCard key={child.id} node={child} href={nodePath([...ancestors, child])} />
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
