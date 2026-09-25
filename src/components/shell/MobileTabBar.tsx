'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Backpack, House, LibraryBig, Sun, UserRound, UsersRound } from 'lucide-react';
import { APP_LIBRARY, CONTENT_ROOT, OGGI_ROOT, TUTORING_ROOT, ZAINO_ROOT } from '@/lib/config/site';
import { useAuth } from '@/lib/state/auth';
import { useAppMode } from '@/lib/hooks/use-app-mode';
import { cn } from '@/lib/utils/cn';
import { accountUrl } from './AuthButtons';
import { MobileMenu } from './MobileMenu';

export const tabClass = (active: boolean, accent = false) =>
	cn(
		'flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-crimson-500 active:bg-surface-3',
		active || accent ? 'text-accent-fg' : 'text-fg-subtle',
		accent && 'font-semibold'
	);

/**
 * The phone's primary navigation: five always-visible destinations in the thumb zone. Lesson pages replace it with their own section bar.
 * In the installed app there is no landing page to go home to: Oggi opens the student's day (the app's start), Materiale the
 * beta's subject, and Profilo the sheet with the account, the theme and the rest of the site (the app has no menu button).
 * On the website a signed-in student has Oggi in place of Home.
 */
export function MobileTabBar() {
	const pathname = usePathname();
	const app = useAppMode();
	const [menuOpen, setMenuOpen] = useState(false);
	const closeMenu = useCallback(() => setMenuOpen(false), []);
	const { user, openModal } = useAuth();
	const account = accountUrl(user);
	const accountActive = ['/subscription', '/admin', '/richieste', '/dashboard', '/leads', '/profile-editor'].some((p) => pathname.startsWith(p));
	const oggi = { href: OGGI_ROOT, label: 'Oggi', icon: Sun, active: pathname === OGGI_ROOT || pathname.startsWith('/errori') };
	const tabs = [
		app || user ? oggi : { href: '/', label: 'Home', icon: House, active: pathname === '/' },
		{ href: app ? APP_LIBRARY : CONTENT_ROOT, label: 'Materiale', icon: LibraryBig, active: pathname.startsWith(CONTENT_ROOT) },
		{ href: ZAINO_ROOT, label: 'Zaino', icon: Backpack, active: pathname.startsWith(ZAINO_ROOT) },
		{ href: TUTORING_ROOT, label: 'Ripetizioni', icon: UsersRound, active: pathname.startsWith(TUTORING_ROOT) }
	];
	return (
		<nav aria-label="Navigazione principale" className="fixed inset-x-0 bottom-0 z-30 border-t border-edge-soft bg-surface pb-safe md:hidden">
			<ul className="grid h-tabbar grid-cols-5">
				{tabs.map(({ href, label, icon: Icon, active }) => (
					<li key={href}>
						<Link href={href} aria-current={active ? 'page' : undefined} className={tabClass(active)}>
							<Icon className="size-6" strokeWidth={active ? 2.4 : 1.8} aria-hidden="true" />
							<span className="w-full truncate px-0.5 text-center">{label}</span>
						</Link>
					</li>
				))}
				<li>
					{app ? (
						<button type="button" onClick={() => setMenuOpen(true)} aria-haspopup="dialog" aria-expanded={menuOpen} className={tabClass(accountActive || menuOpen)}>
							<UserRound className="size-6" strokeWidth={accountActive || menuOpen ? 2.4 : 1.8} aria-hidden="true" />
							<span className="w-full truncate px-0.5 text-center">Profilo</span>
						</button>
					) : user ? (
						<Link href={account} aria-current={accountActive ? 'page' : undefined} className={tabClass(accountActive)}>
							<UserRound className="size-6" strokeWidth={accountActive ? 2.4 : 1.8} aria-hidden="true" />
							<span className="w-full truncate px-0.5 text-center">Account</span>
						</Link>
					) : (
						<button type="button" onClick={() => openModal()} className={tabClass(false)}>
							<UserRound className="size-6" strokeWidth={1.8} aria-hidden="true" />
							<span className="w-full truncate px-0.5 text-center">Accedi</span>
						</button>
					)}
				</li>
			</ul>
			{app && <MobileMenu open={menuOpen} onClose={closeMenu} />}
		</nav>
	);
}
