'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CreditCard, KeyRound, ShieldCheck, SlidersHorizontal, UserRound } from 'lucide-react';
import { ACCOUNT_ROOT } from '@/lib/config/site';
import { cn } from '@/lib/utils/cn';

export const ACCOUNT_SECTIONS = [
	{ href: ACCOUNT_ROOT, label: 'Profilo', icon: UserRound },
	{ href: `${ACCOUNT_ROOT}/accesso`, label: 'Accesso e sicurezza', icon: KeyRound },
	{ href: `${ACCOUNT_ROOT}/preferenze`, label: 'Preferenze', icon: SlidersHorizontal },
	{ href: `${ACCOUNT_ROOT}/abbonamento`, label: 'Abbonamento', icon: CreditCard },
	{ href: `${ACCOUNT_ROOT}/dati`, label: 'Privacy e dati', icon: ShieldCheck }
];

/**
 * The account's sections. From `lg` a column on the left that stays in view;
 * below, a row that scrolls sideways above the section.
 */
export function AccountNav() {
	const pathname = usePathname();
	const current = useRef<HTMLAnchorElement>(null);
	// On a phone the row may start with the current section out of view: bring it in.
	useEffect(() => {
		current.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
	}, [pathname]);
	return (
		<nav aria-label="Sezioni dell'account" className="-mx-4 overflow-x-auto px-4 lg:sticky lg:top-24 lg:mx-0 lg:overflow-visible lg:px-0">
			<ul className="flex gap-1 lg:flex-col">
				{ACCOUNT_SECTIONS.map(({ href, label, icon: Icon }) => {
					const active = pathname === href;
					return (
						<li key={href} className="shrink-0">
							<Link
								ref={active ? current : undefined}
								href={href}
								aria-current={active ? 'page' : undefined}
								className={cn(
									'flex min-h-[44px] items-center gap-3 whitespace-nowrap rounded-xl px-3 text-sm font-medium transition-colors focus-ring',
									active ? 'bg-accent-soft text-accent-soft-fg' : 'text-fg-muted hover:bg-surface-3 hover:text-fg'
								)}
							>
								<Icon className="size-4 shrink-0" aria-hidden="true" />
								{label}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
