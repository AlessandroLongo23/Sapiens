'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Inbox, LayoutDashboard, UserPen } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const LINKS = [
	{ href: '/dashboard', label: 'Riepilogo', icon: LayoutDashboard },
	{ href: '/leads', label: 'Richieste', icon: Inbox },
	{ href: '/profile-editor', label: 'Profilo', icon: UserPen }
];

/** The tutor area's sections; before a profile exists, only the editor. */
export function TutorNav({ hasProfile }: { hasProfile: boolean }) {
	const pathname = usePathname();
	const links = hasProfile ? LINKS : [{ href: '/profile-editor', label: 'Crea il profilo', icon: UserPen }];
	return (
		<nav aria-label="Area tutor" className="flex gap-1 rounded-xl border border-edge bg-surface p-1">
			{links.map(({ href, label, icon: Icon }) => {
				const active = pathname === href;
				return (
					<Link key={href} href={href} aria-current={active ? 'page' : undefined} className={cn('inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors', active ? 'bg-accent text-white' : 'text-fg-muted hover:bg-surface-3')}>
						<Icon className="size-4" aria-hidden="true" />
						{label}
					</Link>
				);
			})}
		</nav>
	);
}
