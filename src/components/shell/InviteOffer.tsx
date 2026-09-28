'use client';

import { useEffect, useState } from 'react';
import { Gift, X } from 'lucide-react';
import { useAuth } from '@/lib/state/auth';
import { REFERRAL, normalizeCode } from '@/lib/referrals/config';
import { TRIAL_DAYS } from '@/lib/stripe/config';
import { Button } from '@/components/ui/Button';

/**
 * The offer of an invite link (`?invito=CODE`): nothing is stored when the link is opened. Only if the visitor
 * chooses "Usa l'invito" is the code kept, in a cookie that lasts a few hours, and the sign-up form opens; the form
 * sends the code with the new account (vault/Decisioni/2026-09-28 L'invito si salva solo dopo Usa l'invito.md).
 * Shown only to visitors without an account, and only for a code that exists.
 */
export function InviteOffer() {
	const { ready, user, openModal } = useAuth();
	const [code, setCode] = useState<string | null>(null);

	useEffect(() => {
		if (!ready || user) return;
		const found = normalizeCode(new URL(window.location.href).searchParams.get(REFERRAL.param));
		if (!found) return;
		let live = true;
		fetch(`/api/inviti/codice?code=${found}`)
			.then((r) => (r.ok ? r.json() : null))
			.then((body) => live && body?.valid && setCode(found))
			.catch(() => {});
		return () => {
			live = false;
		};
	}, [ready, user]);

	if (!code || user) return null;

	const accept = () => {
		const secure = window.location.protocol === 'https:' ? '; Secure' : '';
		document.cookie = `${REFERRAL.cookie}=${code}; Max-Age=${REFERRAL.cookieHours * 3600}; Path=/; SameSite=Lax${secure}`;
		setCode(null);
		openModal({ register: true, next: () => window.location.reload() });
	};

	return (
		<div className="fixed inset-x-3 top-20 z-40 md:inset-x-auto md:left-1/2 md:w-[min(28rem,calc(100vw-3rem))] md:-translate-x-1/2" role="dialog" aria-labelledby="invite-offer-title">
			<div className="relative rounded-2xl border border-edge bg-surface p-5 shadow-2xl">
				<button type="button" onClick={() => setCode(null)} className="absolute right-3 top-3 rounded-full p-1.5 text-fg-faint transition-colors hover:bg-surface-3 hover:text-fg-muted focus-ring" aria-label="Chiudi">
					<X className="size-4" aria-hidden="true" />
				</button>
				<div className="flex items-start gap-3 pr-6">
					<Gift className="mt-0.5 size-5 shrink-0 text-accent-fg" aria-hidden="true" />
					<div>
						<h2 id="invite-offer-title" className="font-semibold text-fg-strong">
							Hai un invito
						</h2>
						<p className="mt-1 text-sm text-fg-muted">
							Se crei un account con questo invito, la prova di Studio dura {REFERRAL.trialDays} giorni invece di {TRIAL_DAYS}, senza carta.
						</p>
					</div>
				</div>
				<div className="mt-4 flex flex-wrap justify-end gap-2">
					<Button size="sm" variant="ghost" onClick={() => setCode(null)}>
						No, grazie
					</Button>
					<Button size="sm" onClick={accept}>
						Usa l&apos;invito
					</Button>
				</div>
			</div>
		</div>
	);
}
