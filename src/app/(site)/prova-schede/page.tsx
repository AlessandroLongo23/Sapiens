import type { Metadata } from 'next';
import { nodePath } from '@/lib/seo/slug';
import { getContentTree } from '@/lib/server/content';
import { cn } from '@/lib/utils/cn';
import { LevelCard, SubjectCard, type CardLayout } from '@/components/content/LibraryCovers';

export const metadata: Metadata = { title: 'Prova delle schede', robots: { index: false, follow: false } };

const LAYOUTS: { layout: CardLayout; name: string; note: string; grid: string }[] = [
	{ layout: 'stack', name: 'A · In colonna', note: 'Quella di adesso: oggetto sopra, testo sotto, tre per riga.', grid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' },
	{ layout: 'side', name: 'B · Affiancata', note: 'Testo a sinistra e oggetto grande a destra, che esce dal bordo. Due per riga.', grid: 'grid-cols-1 lg:grid-cols-2' },
	{ layout: 'row', name: 'C · Riga con l’indice', note: 'Una riga per scheda, con i primi capitoli (o le materie) in vista.', grid: 'grid-cols-1' }
];

/** A page to compare the layouts of the library's cards side by side; not linked and not indexed. */
export default async function CardLayoutsPage() {
	const tree = await getContentTree();
	const level = tree.find((node) => node.slug === 'university') ?? tree[0];
	return (
		<main className="mx-auto max-w-[1280px] space-y-20 px-6 py-12">
			{LAYOUTS.map(({ layout, name, note, grid }) => (
				<section key={layout} className="space-y-8">
					<header className="border-b border-edge-strong pb-3">
						<h2 className="text-3xl font-semibold text-fg-strong">{name}</h2>
						<p className="mt-1 text-sm text-fg-subtle">{note}</p>
					</header>
					<div className={cn('grid gap-5', grid)}>
						{tree.map((node) => (
							<LevelCard key={node.id} level={node} href={nodePath([node])} layout={layout} />
						))}
					</div>
					<div className={cn('grid gap-5', grid)}>
						{level.children.slice(0, 6).map((subject) => (
							<SubjectCard key={subject.id} level={level} subject={subject} href={nodePath([level, subject])} layout={layout} />
						))}
					</div>
				</section>
			))}
		</main>
	);
}
