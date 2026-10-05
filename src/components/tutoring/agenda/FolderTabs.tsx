'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { binderLabelClass, binderRowClass, binderTabClass } from '@/components/ui/binder-tabs';
import { Count } from './Paper';

export interface FolderTab {
	href: string;
	label: string;
	/** What waits on this tab. */
	count?: number;
}

/**
 * The tabs of a folder: each is a page of its own. The first is the folder's cover page, open only on its exact
 * address. On a phone the row scrolls, fading at the right edge, and the open tab is brought into view.
 */
export function FolderTabs({ tabs, label }: { tabs: FolderTab[]; label: string }) {
	const pathname = usePathname();
	const current = useRef<HTMLAnchorElement>(null);
	useEffect(() => {
		current.current?.scrollIntoView({ inline: 'center', block: 'nearest' });
	}, [pathname]);
	return (
		<nav aria-label={label} className="scroll-x no-scrollbar -mx-4 mb-8 px-4 max-sm:[mask-image:linear-gradient(to_right,black_calc(100%-2.5rem),transparent)] sm:mx-0 sm:px-0">
			<div className="min-w-max border-b border-edge-strong max-sm:pr-8">
				<div className={binderRowClass}>
					{tabs.map((tab, i) => {
						const active = i === 0 ? pathname === tab.href : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
						return (
							<Link key={tab.href} ref={active ? current : undefined} href={tab.href} aria-current={active ? 'page' : undefined} className={binderTabClass(active, 'items-center')}>
								<span className={binderLabelClass(active)}>{tab.label}</span>
								<Count n={tab.count ?? 0} label="da vedere" />
							</Link>
						);
					})}
				</div>
			</div>
		</nav>
	);
}
