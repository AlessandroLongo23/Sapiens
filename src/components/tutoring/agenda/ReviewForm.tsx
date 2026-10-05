'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { REVIEW_LABELS } from '@/lib/tutoring/agenda';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Field';
import { useApi } from './useApi';

/** The student's review of their tutor: a vote from one to five and a few lines. Sent again, it replaces the first. */
export function ReviewForm({ linkId, tutor, review }: { linkId: string; tutor: string; review: { rating: number; body: string } | null }) {
	const { busy, error, call } = useApi();
	const [rating, setRating] = useState(review?.rating ?? 0);
	const [body, setBody] = useState(review?.body ?? '');
	const [sent, setSent] = useState(false);
	const submit = async (event: React.FormEvent) => {
		event.preventDefault();
		setSent(false);
		if (await call('review', `/api/tutoring/links/${linkId}/review`, 'POST', { rating, body })) setSent(true);
	};
	return (
		<Card className="p-5">
			<form onSubmit={submit} className="space-y-3">
				<div>
					<p className="font-semibold text-fg">{review ? `Hai già scritto di ${tutor}: puoi aggiornarla.` : `Come ti trovi con ${tutor}?`}</p>
					<p className="mt-1 text-sm text-fg-muted">Compare sul suo profilo e aiuta chi cerca un tutor. Il tuo nome non c&apos;è, ma il tutor può capire chi l&apos;ha scritta.</p>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<div role="radiogroup" aria-label="Voto" className="relative flex">
						{[1, 2, 3, 4, 5].map((n) => (
							<label key={n} className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg hover:bg-surface-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent">
								<input type="radio" name={`voto-${linkId}`} value={n} checked={rating === n} onChange={() => setRating(n)} aria-label={`${n} su 5: ${REVIEW_LABELS[n]}`} className="sr-only" />
								<Star className={`size-6 ${n <= rating ? 'fill-amber-400 text-amber-500' : 'text-fg-faint'}`} aria-hidden="true" />
							</label>
						))}
					</div>
					{rating > 0 && <span className="text-sm text-fg-muted">{REVIEW_LABELS[rating]}</span>}
				</div>
				<Textarea aria-label="Recensione" value={body} onChange={(e) => setBody(e.target.value)} rows={3} maxLength={1000} placeholder="Cosa ti è servito di più? (facoltativo)" />
				{error && <Alert tone="error">{error}</Alert>}
				{sent && <Alert tone="success">Recensione pubblicata. Grazie.</Alert>}
				<div className="flex justify-end">
					<Button type="submit" variant="secondary" size="sm" loading={busy === 'review'} disabled={rating === 0}>{review ? 'Aggiorna la recensione' : 'Pubblica la recensione'}</Button>
				</div>
			</form>
		</Card>
	);
}
