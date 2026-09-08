'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { TUTORING_ROOT } from '@/lib/config/site';
import { levelName, modeName, subjectName } from '@/lib/tutoring/config';
import { formatDateTime, timeLeft } from '@/lib/tutoring/time';
import type { StudentRequest } from '@/lib/server/tutoring-admin';
import { Alert } from '@/components/ui/Alert';
import { Button, LinkButton } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RequestStatusBadge } from './RequestStatusBadge';
import { Confirm, ContactLines, Quote, useRequestAction } from './RequestActions';

const tutorName = (r: StudentRequest) => `${r.tutor.first_name}${r.tutor.last_initial ? ` ${r.tutor.last_initial}.` : ''}`;
const searchAgain = (r: StudentRequest) => `${TUTORING_ROOT}?materia=${encodeURIComponent(r.subject)}&livello=${encodeURIComponent(r.level)}`;

/** The signed-in student's requests: their state, the tutor's contacts once accepted, and a way to withdraw a pending one. */
export function StudentRequests({ requests }: { requests: StudentRequest[] }) {
	const { busy, error, run } = useRequestAction();
	const [confirming, setConfirming] = useState<string | null>(null);

	if (requests.length === 0) {
		return (
			<Card tone="dashed" as="section" className="space-y-3 p-8 text-center">
				<h2 className="text-xl font-semibold text-fg">Nessuna richiesta ancora</h2>
				<p className="mx-auto max-w-md text-fg-muted">Scegli un tutor dalla lista e racconta di cosa hai bisogno.</p>
				<LinkButton href={TUTORING_ROOT} size="lg">Trova un tutor <ArrowRight className="size-4" aria-hidden="true" /></LinkButton>
			</Card>
		);
	}

	return (
		<>
			{error && <Alert tone="error" className="mb-4">{error}</Alert>}
			<ul className="space-y-4">
				{requests.map((r) => (
					<Card key={r.id} as="li" className="space-y-3 p-5" data-request={r.id}>
						<div className="flex flex-wrap items-start justify-between gap-3">
							<div>
								<h2 className="font-semibold text-fg">
									{r.tutor.published ? <Link href={`${TUTORING_ROOT}/${r.tutor.slug}`} className="transition-colors hover:text-accent-fg">{tutorName(r)}</Link> : tutorName(r)}
									<span className="font-normal text-fg-subtle"> · {subjectName(r.subject)}</span>
								</h2>
								<p className="text-sm text-fg-subtle">{levelName(r.level)} · {modeName(r.mode)} · inviata {formatDateTime(r.created_at)}</p>
							</div>
							<div className="flex items-center gap-2">
								{r.status === 'pending' && <span className="text-xs text-warn-fg">{timeLeft(r.expires_at).label}</span>}
								<RequestStatusBadge status={r.status} />
							</div>
						</div>
						{r.status === 'accepted' && r.tutor.contact ? (
							<Card tone="ok" className="space-y-2 rounded-xl p-4">
								<p className="text-sm font-medium text-fg">{r.tutor.first_name} ha accettato: contattatevi e concordate orari e prezzo.</p>
								<ContactLines phone={r.tutor.contact.phone} email={r.tutor.contact.email} />
							</Card>
						) : (
							(r.status === 'declined' || r.status === 'expired') && (
								<p className="text-sm text-fg-muted">
									{r.status === 'declined' ? 'Il tutor non può accettare in questo momento.' : 'Il tutor non ha risposto entro 48 ore.'}{' '}
									<Link href={searchAgain(r)} className="text-accent-fg hover:underline">Trova un altro tutor</Link>.
								</p>
							)
						)}
						<Quote muted>{r.message}</Quote>
						{r.status === 'pending' && (
							<div className="flex flex-wrap items-center gap-2">
								{confirming === r.id ? (
									<Confirm question="Annullare la richiesta?" confirmLabel="Sì, annulla" cancelLabel="Tieni" busy={busy === r.id} onConfirm={() => run(r.id, `/api/tutoring/requests/${r.id}/cancel`).then((ok) => ok && setConfirming(null))} onCancel={() => setConfirming(null)} />
								) : (
									<Button variant="secondary" size="sm" onClick={() => setConfirming(r.id)}>
										<X className="size-4" aria-hidden="true" />
										Annulla richiesta
									</Button>
								)}
							</div>
						)}
					</Card>
				))}
			</ul>
		</>
	);
}
