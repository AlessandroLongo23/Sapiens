import Link from 'next/link';
import { Backpack, Home, LibraryBig, UsersRound } from 'lucide-react';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { CONTENT_ROOT, TUTORING_ROOT, ZAINO_ROOT } from '@/lib/config/site';
import { nodePath } from '@/lib/seo/slug';
import { iconFor, type IconComponent } from '@/lib/utils/icons';
import type { ContentNode } from '@/lib/utils/tree';
import { Latex } from '@/components/ui/Latex';
import { JsonLd } from '@/components/seo/JsonLd';

export interface BreadcrumbItem {
	label: string;
	/** Path of the page. The last item is the current page and is never a link. */
	path?: string;
	icon?: IconComponent;
}

export const HOME_CRUMB: BreadcrumbItem = { label: 'Home', path: '/', icon: Home };
export const LIBRARY_CRUMB: BreadcrumbItem = { label: 'Materiale didattico', path: CONTENT_ROOT, icon: LibraryBig };
export const TUTORING_CRUMB: BreadcrumbItem = { label: 'Ripetizioni', path: TUTORING_ROOT, icon: UsersRound };
export const ZAINO_CRUMB: BreadcrumbItem = { label: 'Zaino', path: ZAINO_ROOT, icon: Backpack };

/** Home › Materiale › …ancestors, for a content page. */
export const contentCrumbs = (ancestors: ContentNode[]): BreadcrumbItem[] => [
	HOME_CRUMB,
	LIBRARY_CRUMB,
	...ancestors.map((n, i) => ({ label: n.title, path: nodePath(ancestors.slice(0, i + 1)), icon: iconFor(n) }))
];

/** Linked trail with the matching BreadcrumbList structured data. The installed app hides the trail on phones (its header has a back arrow) and keeps the data. */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
	return (
		<>
			<JsonLd data={breadcrumbJsonLd(items.filter((i) => i.path).map((i) => ({ name: i.label, path: i.path! })))} />
			<nav aria-label="Percorso" className="mb-8 app:max-md:hidden">
				<ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
					{items.map((item, index) => {
						const last = index === items.length - 1;
						// Only the first step keeps its icon: a trail of icons reads as noise.
						const inner = (
							<>
								{index === 0 && item.icon && <item.icon className="size-4" aria-hidden="true" />}
								<Latex content={item.label} />
							</>
						);
						return (
							<li key={index} className="flex items-center gap-2">
								{item.path && !last ? (
									<Link href={item.path} className="flex items-center gap-1.5 rounded text-fg-subtle underline-offset-4 transition-colors hover:text-fg hover:underline focus-ring">
										{inner}
									</Link>
								) : (
									<span className="flex items-center gap-1.5 font-medium text-fg" aria-current="page">
										{inner}
									</span>
								)}
								{!last && <span className="select-none text-fg-faint" aria-hidden="true">/</span>}
							</li>
						);
					})}
				</ol>
			</nav>
		</>
	);
}
