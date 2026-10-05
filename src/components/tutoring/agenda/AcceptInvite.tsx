'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/state/auth';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { CheckboxRow } from '@/components/ui/Field';
import { useApi } from './useApi';

/** Accepts a tutor's invite: after signing in if needed, and with the choice on sharing progress made here. */
export function AcceptInvite({ code, tutor, signedIn }: { code: string; tutor: string; signedIn: boolean }) {
	const router = useRouter();
	const { user, openModal } = useAuth();
	const { busy, error, call } = useApi();
	const [share, setShare] = useState(false);
	const accept = async () => {
		const done = await call<{ link: string }>('accept', `/api/tutoring/invites/${code}`, 'POST', { share });
		if (done) router.push(`/il-mio-tutor/${done.link}`);
	};
	const known = signedIn || !!user;
	return (
		<div className="space-y-4">
			<CheckboxRow checked={share} onChange={(e) => setShare(e.target.checked)}>
				<span className="font-medium text-fg">Condividi i miei progressi con {tutor}</span>
				<span className="mt-0.5 block">Vede quali lezioni hai fatto, i livelli superati e i giorni in cui hai studiato. Mai le note né il diario. Puoi cambiare idea quando vuoi.</span>
			</CheckboxRow>
			{error && <Alert tone="error">{error}</Alert>}
			{known ? (
				<Button size="lg" className="w-full" loading={busy === 'accept'} onClick={accept}>Accetta l&apos;invito</Button>
			) : (
				<>
					<Button size="lg" className="w-full" onClick={() => openModal({ register: true, next: () => router.refresh() })}>Accedi o registrati per accettare</Button>
					<p className="text-center text-xs text-fg-subtle">L&apos;account è gratuito. Dopo l&apos;accesso torni su questa pagina.</p>
				</>
			)}
		</div>
	);
}
