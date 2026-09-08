'use client';

import { useState } from 'react';
import { Check, Clock, Inbox, X } from 'lucide-react';
import { levelName, modeName, subjectName } from '@/lib/tutoring/config';
import { formatDateTime, timeLeft } from '@/lib/tutoring/time';
import type { InboxRequest } from '@/lib/server/tutoring-admin';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RequestStatusBadge } from './RequestStatusBadge';
import { Confirm, ContactLines, Quote, useRequestAction } from './RequestActions';

const who = (r: InboxRequest) => (r.requester === 'parent' ? 'Un genitore' : 'Uno studente');
const meta = (r: InboxRequest, when: string) => `${levelName(r.level)} · ${modeName(r.mode)} · ${when}`;

function Section({ id, icon: Icon, color, title, count, children }: { id: string; icon: typeof Clock; color: string; title: string; count: number; children: React.ReactNode }) {
	return (
		<section className="mb-10" aria-labelledby={id}>
			<h2 id={id} className="mb-3 flex items-center gap-2 text-lg font-semibold text-fg">
				<Icon className={`size-5 ${color}`} aria-hidden="true" />
				{title}
				<span className="text-sm font-normal text-fg-subtle">({count})</span>
			</h2>
			{children}
		</section>
	);
}

/** The tutor's requests: answer the pending ones, keep the contacts of the accepted ones. */
export function TutorInbox({ requests, published }: { requests: InboxRequest[]; published: boolean }) {
	const { busy, error, run } = useRequestAction();
	const [declining, setDeclining] = useState<string | null>(null);
	const pending = requests.filter((r) => r.status === 'pending');
	const accepted = requests.filter((r) => r.status === 'accepted');
	const archived = requests.filter((r) => r.status !== 'pending' && r.status !== 'accepted');
	const respond = (id: string, action: 'accept' | 'decline') => run(id, `/api/tutoring/requests/${id}/respond`, { action }).then((ok) => ok && setDeclining(null));

	return (
		<>
			{error && <Alert tone="error" className="mb-4">{error}</Alert>}
			<Section id="in-attesa" icon={Clock} color="text-amber-500" title="In attesa di risposta" count={pending.length}>
				{pending.length === 0 ? (
					<Card tone="dashed" className="p-6 text-sm text-fg-muted">Nessuna richiesta in attesa. {!published && 'Il profilo non è ancora pubblico: le richieste arrivano dopo la pubblicazione.'}</Card>
				) : (
					<ul className="space-y-4">
						{pending.map((r) => {
							const left = timeLeft(r.expires_at);
							return (
								<Card key={r.id} as="li" className="space-y-4 border-warn-edge p-5" data-request={r.id}>
									<div className="flex flex-wrap items-start justify-between gap-3">
										<div>
											<p className="font-semibold text-fg">{who(r)} · {subjectName(r.subject)}</p>
											<p className="text-sm text-fg-subtle">{meta(r, `ricevuta ${formatDateTime(r.created_at)}`)}</p>
										</div>
										<span className={`text-sm font-medium ${left.expired ? 'text-danger-fg' : 'text-warn-fg'}`}>{left.label}</span>
									</div>
									<Quote>{r.message}</Quote>
									<p className="text-xs text-fg-subtle">Nome e telefono compaiono qui, e ti arrivano via email, quando accetti.</p>
									<div className="flex flex-wrap items-center gap-2">
										{declining === r.id ? (
											<Confirm question="Confermi il rifiuto? Lo studente viene avvisato, senza motivazione." confirmLabel="Sì, rifiuta" busy={busy === r.id} onConfirm={() => respond(r.id, 'decline')} onCancel={() => setDeclining(null)} />
										) : (
											<>
												<Button size="sm" loading={busy === r.id} onClick={() => respond(r.id, 'accept')}>
													{busy !== r.id && <Check className="size-4" aria-hidden="true" />}
													Accetta
												</Button>
												<Button variant="secondary" size="sm" disabled={busy === r.id} onClick={() => setDeclining(r.id)}>
													<X className="size-4" aria-hidden="true" />
													Rifiuta
												</Button>
											</>
										)}
									</div>
								</Card>
							);
						})}
					</ul>
				)}
			</Section>
			<Section id="accettate" icon={Check} color="text-emerald-500" title="Accettate" count={accepted.length}>
				{accepted.length === 0 ? (
					<p className="text-sm text-fg-subtle">Ancora nessuna.</p>
				) : (
					<ul className="space-y-4">
						{accepted.map((r) => (
							<Card key={r.id} as="li" className="space-y-3 border-ok-edge p-5" data-request={r.id}>
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div>
										<p className="font-semibold text-fg">{r.contact?.name} · {subjectName(r.subject)}</p>
										<p className="text-sm text-fg-subtle">{meta(r, `accettata ${r.responded_at ? formatDateTime(r.responded_at) : ''}`)}</p>
									</div>
									<RequestStatusBadge status={r.status} />
								</div>
								{r.contact && <ContactLines phone={r.contact.phone} email={r.contact.email} />}
								<Quote muted>{r.message}</Quote>
							</Card>
						))}
					</ul>
				)}
			</Section>
			{archived.length > 0 && (
				<Section id="archivio" icon={Inbox} color="text-fg-faint" title="Archivio" count={archived.length}>
					<ul className="space-y-2">
						{archived.map((r) => (
							<Card key={r.id} as="li" className="flex flex-wrap items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm" data-request={r.id}>
								<div className="min-w-0">
									<p className="text-fg-muted">{who(r)} · {subjectName(r.subject)} · {formatDateTime(r.created_at)}</p>
									<p className="truncate text-xs text-fg-subtle" title={r.message}>{r.message}</p>
								</div>
								<RequestStatusBadge status={r.status} />
							</Card>
						))}
					</ul>
				</Section>
			)}
		</>
	);
}
