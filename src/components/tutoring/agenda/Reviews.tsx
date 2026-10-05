import { Star } from 'lucide-react';
import { REVIEW_LABELS, type TutorReview } from '@/lib/tutoring/agenda';

const MONTH = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' });

/** Five stars, `rating` of them full. The number is read out; the stars are for the eye. */
export function Stars({ rating, size = 'size-4' }: { rating: number; size?: string }) {
	return (
		<span className="inline-flex items-center gap-0.5" role="img" aria-label={`${rating} su 5`}>
			{[1, 2, 3, 4, 5].map((n) => <Star key={n} className={`${size} ${n <= Math.round(rating) ? 'fill-amber-400 text-amber-500' : 'text-fg-faint'}`} aria-hidden="true" />)}
		</span>
	);
}

/** The reviews of a tutor on the public profile: written by students the tutor follows on Sapiens, without names. */
export function Reviews({ reviews }: { reviews: TutorReview[] }) {
	if (reviews.length === 0) return null;
	const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
	return (
		<section aria-labelledby="recensioni" className="space-y-3">
			<div className="flex flex-wrap items-center gap-3">
				<h2 id="recensioni" className="text-lg font-semibold text-fg">Recensioni</h2>
				<p className="flex items-center gap-2 text-sm text-fg-muted">
					<Stars rating={average} />
					<span>{average.toLocaleString('it-IT', { maximumFractionDigits: 1 })} su 5, {reviews.length === 1 ? 'una recensione' : `${reviews.length} recensioni`}</span>
				</p>
			</div>
			<p className="text-sm text-fg-subtle">Le scrivono gli studenti che il tutor segue su Sapiens.</p>
			<ul className="space-y-3">
				{reviews.map((r, i) => (
					<li key={i} className="rounded-2xl border border-edge bg-surface p-4">
						<p className="flex flex-wrap items-center gap-2 text-sm">
							<Stars rating={r.rating} />
							<span className="font-medium text-fg">{REVIEW_LABELS[r.rating]}</span>
							<span className="text-fg-subtle">{MONTH.format(new Date(r.createdAt))}</span>
						</p>
						{r.body && <p className="mt-2 whitespace-pre-wrap text-sm text-fg-muted">{r.body}</p>}
					</li>
				))}
			</ul>
		</section>
	);
}
