'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { ChevronDown, CreditCard, GraduationCap, LayoutDashboard, LogOut, Mail, Presentation, UserRound } from 'lucide-react';
import { useAuth } from '@/lib/state/auth';
import { isStaff } from '@/lib/auth/entitlements';
import { ACCOUNT_ROOT } from '@/lib/config/site';
import { cn } from '@/lib/utils/cn';
import { displayName } from '@/lib/auth/display-name';

function initials(name: string): string {
	const words = name.split(/[\s._-]+/).filter(Boolean);
	return ((words[0]?.[0] ?? '') + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase() || '?';
}

/** The picture from a Google sign-in, if any; otherwise the initials on the accent tint. */
export function Avatar({ user, name, className }: { user: User; name: string; className?: string }) {
	const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
	const src = typeof meta.avatar_url === 'string' ? meta.avatar_url : typeof meta.picture === 'string' ? meta.picture : null;
	const [broken, setBroken] = useState(false);
	return (
		<span className={cn('grid shrink-0 place-items-center overflow-hidden rounded-full bg-accent-soft font-semibold text-accent-soft-fg', className)} aria-hidden="true">
			{src && !broken ? (
				// eslint-disable-next-line @next/next/no-img-element
				<img src={src} alt="" referrerPolicy="no-referrer" className="size-full object-cover" onError={() => setBroken(true)} />
			) : (
				initials(name)
			)}
		</span>
	);
}

const item = 'flex min-h-[40px] w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-fg transition-colors hover:bg-surface-3 focus-visible:bg-surface-3 focus-visible:outline-none';

/**
 * The signed-in user's avatar in the header, opening the account menu: who is
 * signed in, the pages about their account and the way out. The dashboard is
 * there only for staff. It follows the menu button pattern: arrows move
 * between the items, Escape and a click outside close it and focus goes back
 * to the avatar; choosing a link closes it too.
 */
export function AccountMenu() {
	const user = useAuth((s) => s.user);
	const signOut = useAuth((s) => s.signOut);
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const [busy, setBusy] = useState(false);
	const root = useRef<HTMLDivElement>(null);
	const button = useRef<HTMLButtonElement>(null);
	const menu = useRef<HTMLDivElement>(null);
	const id = useId();

	useEffect(() => {
		if (!open) return;
		const onDown = (e: PointerEvent) => {
			if (!root.current?.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener('pointerdown', onDown);
		return () => document.removeEventListener('pointerdown', onDown);
	}, [open]);

	if (!user) return null;
	const name = displayName(user);
	const staff = isStaff(user);

	const items = () => Array.from(menu.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
	const focusItem = (i: number) => {
		const all = items();
		all[(i + all.length) % all.length]?.focus();
	};
	const openWith = (i: number) => {
		setOpen(true);
		requestAnimationFrame(() => focusItem(i));
	};
	const close = (refocus: boolean) => {
		setOpen(false);
		if (refocus) button.current?.focus();
	};
	const onMenuKey = (e: KeyboardEvent) => {
		const all = items();
		const at = all.indexOf(document.activeElement as HTMLElement);
		if (e.key === 'ArrowDown') focusItem(at + 1);
		else if (e.key === 'ArrowUp') focusItem(at - 1);
		else if (e.key === 'Home') focusItem(0);
		else if (e.key === 'End') focusItem(-1);
		else if (e.key === 'Escape') close(true);
		else if (e.key === 'Tab') setOpen(false);
		else return;
		e.preventDefault();
	};
	const logout = async () => {
		setBusy(true);
		try {
			await signOut();
		} finally {
			// Full reload: every cached page state is dropped with the session.
			window.location.assign(window.location.origin + '/');
		}
	};

	const links = [
		...(staff ? [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard }] : []),
		{ href: ACCOUNT_ROOT, label: 'Il tuo account', icon: UserRound },
		{ href: `${ACCOUNT_ROOT}/abbonamento`, label: 'Abbonamento', icon: CreditCard },
		{ href: '/richieste', label: 'Richieste ai tutor', icon: Mail },
		{ href: '/il-mio-tutor', label: 'Il mio tutor', icon: GraduationCap },
		// For who gives lessons: without a profile yet, the page invites to create one.
		{ href: '/dashboard', label: 'Area tutor', icon: Presentation }
	];

	return (
		<div ref={root} className="relative">
			<button
				ref={button}
				type="button"
				// From the keyboard (Enter, Space) focus goes to the first item; a mouse click leaves it on the avatar.
				onClick={(e) => (open ? close(false) : e.detail === 0 ? openWith(0) : setOpen(true))}
				onKeyDown={(e) => {
					if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
						e.preventDefault();
						openWith(e.key === 'ArrowDown' ? 0 : -1);
					}
				}}
				aria-haspopup="menu"
				aria-expanded={open}
				aria-controls={open ? id : undefined}
				aria-label={`Account di ${name}`}
				className={cn('flex items-center gap-1 rounded-full p-0.5 pr-1.5 transition-colors hover:bg-surface-3 focus-ring-offset', open && 'bg-surface-3')}
			>
				<Avatar user={user} name={name} className="size-9 text-sm" />
				<ChevronDown className={cn('size-3.5 text-fg-subtle transition-transform', open && 'rotate-180')} aria-hidden="true" />
			</button>
			{open && (
				<div
					ref={menu}
					id={id}
					role="menu"
					aria-label="Account"
					onKeyDown={onMenuKey}
					className="absolute right-0 top-full z-40 mt-2 w-72 origin-top-right animate-fade-in rounded-2xl border border-edge bg-surface p-1.5 shadow-lift"
				>
					<div className="flex items-center gap-3 px-3 pb-3 pt-2.5">
						<Avatar user={user} name={name} className="size-10 text-base" />
						<div className="min-w-0">
							<p className="truncate text-sm font-semibold text-fg-strong">{name}</p>
							{user.email && <p className="truncate text-xs text-fg-subtle">{user.email}</p>}
						</div>
					</div>
					<hr className="mx-1.5 mb-1.5 border-edge" />
					{links.map(({ href, label, icon: Icon }) => (
						<Link key={href} href={href} role="menuitem" tabIndex={-1} aria-current={pathname === href ? 'page' : undefined} onClick={() => setOpen(false)} className={item}>
							<Icon className="size-4 shrink-0 text-fg-subtle" aria-hidden="true" />
							{label}
						</Link>
					))}
					<hr className="mx-1.5 my-1.5 border-edge" />
					<button type="button" role="menuitem" tabIndex={-1} onClick={logout} disabled={busy} className={item}>
						<LogOut className="size-4 shrink-0 text-fg-subtle" aria-hidden="true" />
						{busy ? 'Uscendo…' : 'Esci'}
					</button>
				</div>
			)}
		</div>
	);
}
