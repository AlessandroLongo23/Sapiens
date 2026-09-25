import type { ReactNode } from 'react';
import Link from 'next/link';
import { Backpack, Home, LibraryBig, UsersRound } from 'lucide-react';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { CONTENT_ROOT, TUTORING_ROOT, ZAINO_ROOT } from '@/lib/config/site';
import { nodePath } from '@/lib/seo/slug';
import { iconFor, type IconComponent } from '@/lib/utils/icons';
import { cn } from '@/lib/utils/cn';
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

/**
 * The trail, in the monospaced labels of the notebook, with the matching BreadcrumbList structured data.
 * Home is only in the data: the logo leads there. On an index page the title under the trail names the
 * current page, so `hideCurrent` leaves it out and `tail` (the page's eyebrow) takes its place, in the
 * subject's colour. `aside` sits at the right end of the row. The installed app hides the steps on phones
 * (its header has a back arrow) and keeps the data, the tail and the aside.
 */
export function Breadcrumb({ items, tail, aside, hideCurrent = false }: { items: BreadcrumbItem[]; tail?: ReactNode; aside?: ReactNode; hideCurrent?: boolean }) {
	const shown = items.filter((item, index) => item !== HOME_CRUMB && !(hideCurrent && index === items.length - 1));
	return (
		<>
			<JsonLd data={breadcrumbJsonLd(items.filter((i) => i.path).map((i) => ({ name: i.label, path: i.path! })))} />
			<div className={cn('mb-5 flex min-h-7 items-center justify-between gap-4', !aside && !tail && 'app:max-md:hidden')}>
				<nav aria-label="Percorso" className="min-w-0">
					<ol className="label-mono flex flex-wrap items-center gap-x-2 gap-y-1">
						{shown.map((item, index) => {
							const current = !hideCurrent && index === shown.length - 1;
							return (
								<li key={index} className="flex items-center gap-2 app:max-md:hidden">
									{item.path && !current ? (
										<Link href={item.path} className="rounded text-fg-subtle underline-offset-4 transition-colors hover:text-tint-fg hover:underline focus-ring">
											<Latex content={item.label} />
										</Link>
									) : (
										<span className="text-fg" aria-current="page">
											<Latex content={item.label} />
										</span>
									)}
									{(index < shown.length - 1 || tail) && (
										<span className="select-none text-fg-faint" aria-hidden="true">
											/
										</span>
									)}
								</li>
							);
						})}
						{tail && <li className="text-tint-fg">{tail}</li>}
					</ol>
				</nav>
				{aside && <div className="ml-auto shrink-0">{aside}</div>}
			</div>
		</>
	);
}
