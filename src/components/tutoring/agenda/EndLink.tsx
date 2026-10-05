'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Side } from '@/lib/tutoring/agenda';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { useApi } from './useApi';

/** Either side closes the link, after a confirmation: lessons to come are cancelled, open assignments withdrawn. */
export function EndLink({ linkId, side, name }: { linkId: string; side: Side; /** The other side. */ name: string }) {
	const router = useRouter();
	const { busy, error, call } = useApi();
	const [asking, setAsking] = useState(false);
	const end = async () => {
		const done = await call('end', side === 'tutor' ? `/api/tutoring/students/${linkId}` : `/api/tutoring/links/${linkId}`, 'DELETE');
		if (done) router.push(side === 'tutor' ? '/studenti' : '/il-mio-tutor');
	};
	return (
		<div className="space-y-2">
			{error && <Alert tone="error">{error}</Alert>}
			{asking ? (
				<div className="flex flex-wrap items-center gap-2">
					<span className="text-sm text-fg-muted">{side === 'tutor' ? `Interrompi le lezioni con ${name}? Quelle in programma si annullano e i compiti aperti si ritirano.` : `Interrompi le lezioni con ${name}? Quelle in programma si annullano e non vedrà più i tuoi progressi.`}</span>
					<Button variant="inverse" size="sm" loading={busy === 'end'} onClick={end}>Sì, interrompi</Button>
					<Button variant="ghost" size="sm" onClick={() => setAsking(false)}>No</Button>
				</div>
			) : (
				<Button variant="ghost" size="sm" onClick={() => setAsking(true)}>{side === 'tutor' ? 'Interrompi le lezioni con questo studente' : 'Interrompi le lezioni con questo tutor'}</Button>
			)}
		</div>
	);
}
