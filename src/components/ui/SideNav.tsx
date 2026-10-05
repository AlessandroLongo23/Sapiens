'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IconComponent } from '@/lib/utils/icons';
import { cn } from '@/lib/utils/cn';
import { Badge } from './Badge';

export interface SideNavItem {
	href: string;
	label: string;
	icon: IconComponent;
	/** What waits in this section. */
	count?: number;
	/** Current only on its exact address, not on the pages under it. */
	exact?: boolean;
}

/**
 * The sections of an area (the account, the tutor's register). From `lg` a column on the left that stays in
 * view; below, a row that scrolls sideways above the page, with the current section brought into view. The
 * current section is marked as in the site's header: the highlighter over its name.
 */
export function SideNav({ items, label }: { items: SideNavItem[]; label: string }) {
	const pathname = usePathname();
	const current = useRef<HTMLAnchorElement>(null);
	useEffect(() => {
		current.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
	}, [pathname]);
	return (
		<nav aria-label={label} className="scroll-x no-scrollbar -mx-4 px-4 max-lg:[mask-image:linear-gradient(to_right,black_calc(100%-2.5rem),transparent)] lg:sticky lg:top-24 lg:mx-0 lg:overflow-visible lg:px-0">
			<ul className="flex gap-1 max-lg:w-max max-lg:pr-8 lg:flex-col">
				{items.map(({ href, label: name, icon: Icon, count = 0, exact }) => {
					const active = pathname === href || (!exact && pathname.startsWith(`${href}/`));
					return (
						<li key={href} className="shrink-0">
							<Link
								ref={active ? current : undefined}
								href={href}
								aria-current={active ? 'page' : undefined}
								className={cn('group flex min-h-[44px] items-center gap-3 whitespace-nowrap rounded-xl px-3 text-sm font-medium transition-colors focus-ring', active ? 'text-fg-strong' : 'text-fg-muted hover:text-fg')}
							>
								<Icon className={cn('size-4 shrink-0', active ? 'text-accent-fg' : 'text-fg-subtle group-hover:text-fg-muted')} aria-hidden="true" />
								<span className="nav-mark" data-on={active || undefined}>{name}</span>
								{count > 0 && (
									<Badge tone="accent" className="lg:ml-auto">
										{count}
										<span className="sr-only"> da vedere</span>
									</Badge>
								)}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
