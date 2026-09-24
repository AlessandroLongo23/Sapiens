import type { Metadata } from 'next';
import { LibraryBig } from 'lucide-react';
import { CONTENT_ROOT, SITE_NAME } from '@/lib/config/site';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { nodePath } from '@/lib/seo/slug';
import { getContentTree } from '@/lib/server/content';
import { countByType } from '@/lib/utils/tree';
import { HOME_CRUMB, LIBRARY_CRUMB } from '@/components/content/Breadcrumb';
import { CardGridSection, Page, PageHeader } from '@/components/content/PageHeader';
import { NodeCard } from '@/components/content/NodeCard';
import { Stat } from '@/components/ui/Badge';

const description = (c: Record<string, number>) =>
	`Materiale didattico gratuito per scuola media, scuola superiore e università: ${c.subject} materie, ${c.chapter} capitoli e ${c.topic} lezioni con teoria, formulari ed esercizi.`;

export async function generateMetadata(): Promise<Metadata> {
	const counts = countByType(await getContentTree());
	return pageMetadata({ title: `Materiale didattico: medie, superiori, università | ${SITE_NAME}`, description: description(counts), path: CONTENT_ROOT });
}

export default async function LibraryPage() {
	const tree = await getContentTree();
	const counts = countByType(tree);
	return (
		<Page>
			<PageHeader
				crumbs={[HOME_CRUMB, LIBRARY_CRUMB]}
				icon={LibraryBig}
				eyebrow="Biblioteca"
				title="Materiale didattico"
				lead="Teoria, formulari ed esercizi organizzati per livello scolastico, materia e capitolo. Scegli il tuo livello per iniziare."
				stats={
					<>
						<Stat value={counts.subject}>Materie</Stat>
						<Stat value={counts.chapter}>Capitoli</Stat>
						<Stat value={counts.topic}>Lezioni</Stat>
					</>
				}
			/>
			{tree.length > 0 && (
				<CardGridSection id="livelli-heading" title="Livelli didattici" count={tree.length}>
					{tree.map((node) => (
						<NodeCard key={node.id} node={node} href={nodePath([node])} />
					))}
				</CardGridSection>
			)}
		</Page>
	);
}
