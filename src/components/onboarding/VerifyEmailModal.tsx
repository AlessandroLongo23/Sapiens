'use client';

import { X } from 'lucide-react';
import { useAuth } from '@/lib/state/auth';
import { Modal } from '@/components/ui/Modal';
import { VerifyEmail } from './VerifyEmail';

/** Opened by an action that needs a confirmed email (`openVerify(next)`): once the code is in, the action goes on. */
export function VerifyEmailModal() {
	const { verifyOpen, closeVerify, user } = useAuth();
	return (
		<Modal open={verifyOpen} onClose={() => closeVerify()} blur="sm" className="w-full rounded-t-3xl border border-edge bg-surface pb-safe shadow-2xl sm:max-w-[420px] sm:rounded-3xl sm:pb-0">
			<div className="relative px-5 pb-6 pt-8 sm:px-6 sm:pb-8 sm:pt-10" role="dialog" aria-modal="true" aria-labelledby="verify-title">
				<button type="button" onClick={() => closeVerify()} className="absolute right-4 top-4 rounded-full p-2 text-fg-faint transition-colors hover:bg-surface-3 hover:text-fg-muted focus-ring" aria-label="Chiudi">
					<X className="size-5" aria-hidden="true" />
				</button>
				<h2 id="verify-title" className="text-2xl font-bold tracking-tight text-fg-strong">
					Conferma la tua email
				</h2>
				<p className="mb-6 mt-2 text-sm text-fg-subtle">Per questo passo dobbiamo sapere che l’indirizzo {user?.email} è tuo. Ti mandiamo un codice: ci vuole un minuto.</p>
				<VerifyEmail email={user?.email ?? ''} onVerified={() => closeVerify(true)} />
			</div>
		</Modal>
	);
}
