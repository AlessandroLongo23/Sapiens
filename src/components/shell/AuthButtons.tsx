'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/state/auth';
import { isStaff } from '@/lib/auth/entitlements';
import { Button, buttonClass } from '@/components/ui/Button';

/** Where "Account" goes: staff to the admin area, everyone else to their subscription. */
export const accountUrl = (user: Parameters<typeof isStaff>[0]) => (isStaff(user) ? '/admin' : '/subscription');

/**
 * Public pages are cached without any user data, so the logged-in state
 * comes from the cookie session read in the browser after hydration.
 */
export function LoginButton() {
	const { user, openModal } = useAuth();
	if (user) {
		return (
			<Link href={accountUrl(user)} className={buttonClass('secondary', 'sm', 'no-underline')}>
				{isStaff(user) ? 'Dashboard' : 'Account'}
				<Home className="size-4" aria-hidden="true" />
			</Link>
		);
	}
	return (
		<Button variant="secondary" size="sm" onClick={() => openModal()}>
			Accedi
			<LogIn className="size-4" aria-hidden="true" />
		</Button>
	);
}

export function LogoutButton({ className }: { className?: string }) {
	const signOut = useAuth((s) => s.signOut);
	const [busy, setBusy] = useState(false);
	const logout = async () => {
		setBusy(true);
		try {
			await signOut();
		} finally {
			// Full reload: every cached page state is dropped with the session.
			window.location.assign(window.location.origin + '/');
		}
	};
	return (
		<Button variant="secondary" size="sm" onClick={logout} loading={busy} className={className}>
			{busy ? 'Uscendo…' : 'Esci'}
			{!busy && <LogOut className="size-4" aria-hidden="true" />}
		</Button>
	);
}
