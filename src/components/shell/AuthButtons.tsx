'use client';

import { useState } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/state/auth';
import { isStaff } from '@/lib/auth/entitlements';
import { ACCOUNT_ROOT } from '@/lib/config/site';
import { Button } from '@/components/ui/Button';

/** Where "Account" goes: staff to the admin area, everyone else to their account page. */
export const accountUrl = (user: Parameters<typeof isStaff>[0]) => (isStaff(user) ? '/admin' : ACCOUNT_ROOT);

/**
 * For visitors; once signed in the header shows the account menu instead.
 * Public pages are cached without any user data, so the logged-in state
 * comes from the cookie session read in the browser after hydration.
 */
export function LoginButton() {
	const openModal = useAuth((s) => s.openModal);
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
