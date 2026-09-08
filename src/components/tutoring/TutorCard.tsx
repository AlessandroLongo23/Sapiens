'use client';

import Link from 'next/link';
import { BadgeCheck, ChevronRight, MapPin, MessageCircle, Monitor } from 'lucide-react';
import { TUTORING_ROOT } from '@/lib/config/site';
import { formatRate, levelShort, subjectName, tutorDisplayName, whereLine, type TutorProfile } from '@/lib/tutoring/config';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { TutorAvatar } from './TutorAvatar';

const MAX_SUBJECTS = 3;

/** One tutor in the list: name, price, subjects (the filtered one first), levels, where, and the request button. */
export function TutorCard({ tutor, highlightSubject = '', onRequest }: { tutor: TutorProfile; highlightSubject?: string; onRequest: (tutor: TutorProfile) => void }) {
	const name = tutorDisplayName(tutor);
	const rate = formatRate(tutor.hourly_rate);
	const href = `${TUTORING_ROOT}/${tutor.slug}`;
	const ordered = highlightSubject && tutor.subjects.includes(highlightSubject) ? [highlightSubject, ...tutor.subjects.filter((s) => s !== highlightSubject)] : tutor.subjects;
	const hidden = Math.max(0, ordered.length - MAX_SUBJECTS);
	const onlineOnly = tutor.modes.includes('online') && !tutor.modes.includes('in_person');
	const Where = onlineOnly ? Monitor : MapPin;

	return (
		<article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-edge bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent-edge hover:shadow-xl hover:shadow-crimson-500/5" aria-labelledby={`tutor-${tutor.id}`}>
			<div className="absolute left-0 top-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-crimson-500 to-crimson-400 transition-transform duration-300 group-hover:scale-x-100" aria-hidden="true" />
			<div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
				<div className="flex items-start gap-4">
					<TutorAvatar tutor={tutor} size="md" />
					<div className="min-w-0 flex-1">
						<div className="flex items-start justify-between gap-3">
							<h3 id={`tutor-${tutor.id}`} className="text-lg font-bold leading-snug text-fg">
								<Link href={href} className="rounded transition-colors hover:text-accent-fg focus-ring">{name}</Link>
								{tutor.verified && (
									<span className="ml-1 inline-flex align-middle text-info-fg" title="Identità verificata">
										<BadgeCheck className="size-5" aria-hidden="true" />
										<span className="sr-only">Identità verificata</span>
									</span>
								)}
							</h3>
							{rate && (
								<p className="shrink-0 text-right">
									<span className="block text-base font-semibold text-fg">{rate}</span>
									<span className="block text-xs text-fg-subtle">indicativo</span>
								</p>
							)}
						</div>
						{tutor.headline && <p className="mt-0.5 line-clamp-2 text-sm text-fg-muted">{tutor.headline}</p>}
					</div>
				</div>
				<ul className="flex flex-wrap gap-2" aria-label="Materie">
					{ordered.slice(0, MAX_SUBJECTS).map((s) => (
						<li key={s} className={cn('rounded-full border px-2.5 py-1 text-xs font-medium', s === highlightSubject ? 'border-accent-edge bg-accent-soft text-accent-soft-fg' : 'border-edge-soft bg-surface-2 text-fg-muted')}>
							{subjectName(s)}
						</li>
					))}
					{hidden > 0 && <li className="rounded-full border border-dashed border-edge-strong px-2.5 py-1 text-xs font-medium text-fg-subtle">+{hidden}</li>}
				</ul>
				<dl className="space-y-1.5 text-sm text-fg-muted">
					<div className="flex items-center gap-2">
						<dt className="sr-only">Livelli</dt>
						<dd>{tutor.levels.map(levelShort).join(' · ')}</dd>
					</div>
					<div className="flex items-center gap-2">
						<Where className="size-4 shrink-0 text-fg-faint" aria-hidden="true" />
						<dt className="sr-only">Dove</dt>
						<dd>{whereLine(tutor)}</dd>
					</div>
				</dl>
				<div className="mt-auto flex items-center justify-between gap-3 border-t border-edge pt-4">
					<Link href={href} className="inline-flex items-center gap-1 rounded text-sm text-fg-muted transition-colors hover:text-accent-fg focus-ring">
						Vedi profilo
						<ChevronRight className="size-4" aria-hidden="true" />
					</Link>
					<Button size="sm" onClick={() => onRequest(tutor)}>
						<MessageCircle className="size-4" aria-hidden="true" />
						Chiedi aiuto
					</Button>
				</div>
			</div>
		</article>
	);
}
