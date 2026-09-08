'use client';

import { useState } from 'react';
import { BadgeCheck, ExternalLink } from 'lucide-react';
import { TUTORING_ROOT } from '@/lib/config/site';
import { levelShort, modeName, subjectName } from '@/lib/tutoring/config';
import { formatDateTime } from '@/lib/tutoring/time';
import type { TutorRow, TutorStatus } from '@/lib/server/tutoring-admin';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Alert } from '@/components/ui/Alert';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useRequestAction } from '@/components/tutoring/RequestActions';

type Filter = 'pending' | 'published' | 'suspended' | 'all';

const FILTERS: [Filter, string][] = [['pending', 'In revisione'], ['published', 'Pubblicati'], ['suspended', 'Sospesi'], ['all', 'Tutti']];
const STATUS: Record<TutorStatus, { label: string; tone: BadgeTone }> = {
	draft: { label: 'Bozza', tone: 'neutral' },
	pending: { label: 'In revisione', tone: 'warn' },
	published: { label: 'Pubblicato', tone: 'ok' },
	suspended: { label: 'Sospeso', tone: 'danger' }
};

/** Staff review of tutor profiles: publish, suspend, mark verified. */
export function TutorReviewList({ tutors }: { tutors: TutorRow[] }) {
	const [filter, setFilter] = useState<Filter>('pending');
	const { busy, error, run } = useRequestAction();
	const shown = filter === 'all' ? tutors : tutors.filter((t) => t.status === filter || (filter === 'pending' && t.status === 'draft'));
	const counts: Record<Filter, number> = {
		pending: tutors.filter((t) => t.status === 'pending' || t.status === 'draft').length,
		published: tutors.filter((t) => t.status === 'published').length,
		suspended: tutors.filter((t) => t.status === 'suspended').length,
		all: tutors.length
	};
	const review = (t: TutorRow, patch: { status?: TutorStatus; verified?: boolean }) => run(t.id, `/api/admin/tutors/${t.id}`, patch);

	return (
		<>
			<header className="mb-6 flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-fg">Tutor</h1>
					<p className="mt-1 text-fg-muted">Pubblica i profili in revisione, sospendi quelli che non vanno, segna l&apos;identità verificata.</p>
				</div>
				<ToggleGroup label="Filtra per stato" options={FILTERS.map(([id, label]) => ({ value: id, label: `${label} (${counts[id]})` }))} value={filter} onChange={setFilter} />
			</header>
			{error && <Alert tone="error" className="mb-4">{error}</Alert>}
			{shown.length === 0 ? (
				<Card tone="dashed" className="p-8 text-center text-fg-muted">Nessun tutor in questo stato.</Card>
			) : (
				<ul className="space-y-3">
					{shown.map((t) => (
						<Card key={t.id} as="li" className="grid gap-4 p-5 lg:grid-cols-[1fr_auto]" data-tutor={t.slug}>
							<div className="min-w-0 space-y-2">
								<div className="flex flex-wrap items-center gap-2">
									<h2 className="font-semibold text-fg">{t.first_name} {t.last_name}</h2>
									<Badge tone={STATUS[t.status].tone}>{STATUS[t.status].label}</Badge>
									{t.verified && <span className="inline-flex items-center gap-1 text-xs text-info-fg"><BadgeCheck className="size-3.5" aria-hidden="true" /> verificato</span>}
									{t.status === 'published' && (
										<a href={`${TUTORING_ROOT}/${t.slug}`} className="inline-flex items-center gap-1 text-xs text-fg-subtle hover:text-accent-fg" target="_blank" rel="noopener">profilo <ExternalLink className="size-3" aria-hidden="true" /></a>
									)}
								</div>
								<p className="text-sm text-fg-muted">{t.headline}</p>
								<p className="text-xs text-fg-subtle">
									{t.subjects.map(subjectName).join(', ')} · {t.levels.map(levelShort).join(', ')} · {t.modes.map(modeName).join(', ')}{t.city ? ` a ${t.city}` : ''}
									{t.hourly_rate != null ? ` · ${t.hourly_rate} €/h` : ''} · {t.education ?? 'formazione non indicata'}
								</p>
								<p className="text-xs text-fg-subtle">{t.contact_email ?? 'nessuna email'} · {t.contact_phone ?? 'nessun telefono'} · creato {formatDateTime(t.created_at)}</p>
								<details className="text-sm text-fg-muted">
									<summary className="cursor-pointer text-fg-subtle">Presentazione completa</summary>
									<p className="mt-2 whitespace-pre-wrap">{t.bio}</p>
								</details>
							</div>
							<div className="flex flex-wrap items-start gap-2 lg:flex-col">
								{t.status !== 'published' && <Button size="sm" loading={busy === t.id} onClick={() => review(t, { status: 'published' })}>Pubblica</Button>}
								{t.status === 'published' && <Button variant="secondary" size="sm" disabled={busy === t.id} onClick={() => review(t, { status: 'suspended' })}>Sospendi</Button>}
								{t.status === 'suspended' && <Button variant="secondary" size="sm" disabled={busy === t.id} onClick={() => review(t, { status: 'pending' })}>Rimetti in revisione</Button>}
								<Button variant="secondary" size="sm" disabled={busy === t.id} onClick={() => review(t, { verified: !t.verified })}>
									<BadgeCheck className="size-4" aria-hidden="true" />
									{t.verified ? 'Togli verifica' : 'Segna verificato'}
								</Button>
							</div>
						</Card>
					))}
				</ul>
			)}
		</>
	);
}
