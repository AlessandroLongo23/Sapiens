'use client';

import { Eye, EyeOff } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useApi } from './useApi';

/** The student's choice: whether the tutor sees their exercises. Off until they say so, and back off whenever they want. */
export function ConsentToggle({ linkId, shared, tutor }: { linkId: string; shared: boolean; tutor: string }) {
	const { busy, error, call } = useApi();
	const Icon = shared ? Eye : EyeOff;
	return (
		<Card tone={shared ? 'ok' : 'default'} className="space-y-3 p-5">
			<div className="flex items-start gap-3">
				<Icon className="mt-0.5 size-5 shrink-0 text-fg-muted" aria-hidden="true" />
				<div className="min-w-0 flex-1">
					<p className="font-semibold text-fg">{shared ? `${tutor} vede i tuoi progressi` : `${tutor} non vede i tuoi progressi`}</p>
					<p className="mt-1 text-sm text-fg-muted">
						{shared ? 'Vede quali lezioni hai fatto, i livelli superati e i giorni in cui hai studiato. Non vede le note, il diario né le singole risposte.' : 'Se li condividi, vede quali lezioni hai fatto, i livelli superati e i giorni in cui hai studiato, e sa se un compito è fatto. Mai le note né il diario.'}
					</p>
				</div>
			</div>
			{error && <Alert tone="error">{error}</Alert>}
			<Button variant={shared ? 'secondary' : 'primary'} size="sm" loading={busy === 'consent'} onClick={() => call('consent', `/api/tutoring/links/${linkId}`, 'PATCH', { share: !shared })}>
				{shared ? 'Smetti di condividere' : 'Condividi i progressi'}
			</Button>
		</Card>
	);
}
