'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Backpack, ChevronRight, CircleHelp, CreditCard, House, LibraryBig, LogIn, Mail, UserPlus, UserRound, UsersRound } from 'lucide-react';
import { CONTENT_ROOT, TUTORING_ROOT, ZAINO_ROOT } from '@/lib/config/site';
import { nodePath } from '@/lib/seo/slug';
import { useAuth } from '@/lib/state/auth';
import { isStaff } from '@/lib/auth/entitlements';
import { cn } from '@/lib/utils/cn';
import { Sheet } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { useContentTree } from './ContentTreeContext';
import { ThemeToggle } from './ThemeToggle';
import { LogoutButton, accountUrl } from './AuthButtons';

const row = (active: boolean) => cn('flex min-h-[48px] items-center gap-3 rounded-xl px-3 text-base font-medium transition-colors focus-ring', active ? 'bg-accent-soft text-accent-soft-fg' : 'text-fg hover:bg-surface-3 active:bg-surface-3');

/** The phone menu: every section of the site, the theme and the account, in one sheet. */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
	const pathname = usePathname();
	const tree = useContentTree();
	const { user, openModal } = useAuth();

	// A navigation closes the sheet; nothing else does from here.
	const shownPath = useRef(pathname);
	useEffect(() => {
		if (shownPath.current === pathname) return;
		shownPath.current = pathname;
		onClose();
	}, [pathname, onClose]);

	const links = [
		{ href: '/', label: 'Home', icon: House, active: pathname === '/' },
		{ href: CONTENT_ROOT, label: 'Materiale didattico', icon: LibraryBig, active: pathname.startsWith(CONTENT_ROOT) },
		{ href: ZAINO_ROOT, label: 'Il tuo zaino', icon: Backpack, active: pathname.startsWith(ZAINO_ROOT) },
		{ href: TUTORING_ROOT, label: 'Ripetizioni', icon: UsersRound, active: pathname.startsWith(TUTORING_ROOT) },
		{ href: '/pricing', label: 'Prezzi e abbonamenti', icon: CreditCard, active: pathname.startsWith('/pricing') },
		{ href: '/faq', label: 'Domande frequenti', icon: CircleHelp, active: pathname === '/faq' },
		{ href: '/contacts', label: 'Contatti', icon: Mail, active: pathname === '/contacts' }
	];
	const login = (register: boolean) => {
		onClose();
		openModal({ register });
	};

	return (
		<Sheet open={open} onClose={onClose} title="Menu" bodyClass="px-3 pb-3">
			<nav aria-label="Menu" className="flex flex-col gap-0.5">
				{links.map(({ href, label, icon: Icon, active }) => (
					<div key={href}>
						<Link href={href} aria-current={active ? 'page' : undefined} className={row(active)}>
							<Icon className="size-5 shrink-0" aria-hidden="true" />
							<span className="flex-1">{label}</span>
							<ChevronRight className="size-4 text-fg-faint" aria-hidden="true" />
						</Link>
						{href === CONTENT_ROOT && tree.length > 0 && (
							<ul className="mb-1 ml-8 flex flex-col border-l border-edge pl-2" aria-label="Livelli didattici">
								{tree.map((level) => {
									const levelHref = nodePath([level]);
									const active = pathname.startsWith(levelHref);
									return (
										<li key={level.id}>
											<Link href={levelHref} aria-current={active ? 'page' : undefined} className={cn('flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium', active ? 'text-accent-soft-fg' : 'text-fg-muted hover:bg-surface-3')}>
												{level.title}
											</Link>
										</li>
									);
								})}
							</ul>
						)}
					</div>
				))}
			</nav>
			<hr className="my-3 border-edge" />
			<div className="flex min-h-[48px] items-center justify-between gap-3 px-3">
				<span className="text-base font-medium text-fg">Tema chiaro o scuro</span>
				<ThemeToggle />
			</div>
			<hr className="my-3 border-edge" />
			{user ? (
				<div className="flex flex-col gap-2 px-1">
					<Link href={accountUrl(user)} className={row(pathname.startsWith(accountUrl(user)))}>
						<UserRound className="size-5 shrink-0" aria-hidden="true" />
						<span className="flex-1">{isStaff(user) ? 'Dashboard' : 'Il tuo account'}</span>
						<ChevronRight className="size-4 text-fg-faint" aria-hidden="true" />
					</Link>
					{!isStaff(user) && (
						<Link href="/richieste" className={row(pathname.startsWith('/richieste'))}>
							<Mail className="size-5 shrink-0" aria-hidden="true" />
							<span className="flex-1">Le tue richieste ai tutor</span>
							<ChevronRight className="size-4 text-fg-faint" aria-hidden="true" />
						</Link>
					)}
					<div className="px-2 pt-1">
						<LogoutButton className="min-h-[48px] w-full" />
					</div>
				</div>
			) : (
				<div className="grid grid-cols-2 gap-2 px-1">
					<Button variant="secondary" size="lg" onClick={() => login(false)}>
						<LogIn className="size-5" aria-hidden="true" />
						Accedi
					</Button>
					<Button size="lg" onClick={() => login(true)}>
						<UserPlus className="size-5" aria-hidden="true" />
						Registrati
					</Button>
				</div>
			)}
		</Sheet>
	);
}
