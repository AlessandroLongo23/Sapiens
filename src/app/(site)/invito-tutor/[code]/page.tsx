import type { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { TUTORING_ROOT } from '@/lib/config/site';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { currentUser } from '@/lib/server/auth';
import { inviteByCode } from '@/lib/server/tutor-agenda';
import { subjectName } from '@/lib/tutoring/config';
import { Card } from '@/components/ui/Card';
import { AcceptInvite } from '@/components/tutoring/agenda/AcceptInvite';

export const metadata: Metadata = pageMetadata({ title: 'Invito del tuo tutor | Sapiens', path: '/invito-tutor', noindex: true });

/** A tutor's invite, opened by the student: who it is from, what accepting means, and the choice on progress. */
export default async function TutorInvitePage({ params }: { params: Promise<{ code: string }> }) {
	const { code } = await params;
	const user = await currentUser();
	const invite = await inviteByCode(code, user?.id ?? null);
	return (
		<div className="min-h-screen bg-page-alt">
			<div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
				{!invite ? (
					<Card tone="dashed" className="space-y-3 p-8 text-center">
						<h1 className="text-2xl font-bold text-fg">Questo invito non è più valido</h1>
						<p className="text-fg-muted">È già stato usato, oppure il tutor lo ha ritirato. Chiedigli di mandartene un altro.</p>
						<Link href="/il-mio-tutor" className="inline-block text-sm font-medium text-accent-fg hover:underline">Vai alla pagina del tuo tutor</Link>
					</Card>
				) : (
					<Card className="space-y-5 p-6 sm:p-8">
						<div className="flex items-start gap-4">
							<span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-soft-fg"><GraduationCap className="size-6" aria-hidden="true" /></span>
							<div className="min-w-0">
								<h1 className="text-2xl font-bold text-fg">{invite.tutor.firstName} {invite.tutor.lastInitial}. ti invita su Sapiens</h1>
								<p className="mt-1 text-fg-muted">
									{invite.subject ? `Per le lezioni di ${subjectName(invite.subject)}. ` : ''}
									{invite.tutor.headline}
								</p>
								{invite.tutor.published && <Link href={`${TUTORING_ROOT}/${invite.tutor.slug}`} className="mt-1 inline-block text-sm text-accent-fg hover:underline">Guarda il suo profilo</Link>}
							</div>
						</div>
						<ul className="list-disc space-y-1.5 pl-5 text-sm text-fg-muted">
							<li>Vedi le lezioni fissate con il tutor e puoi chiederne di nuove.</li>
							<li>Gli esercizi che ti assegna compaiono nel tuo diario.</li>
							<li>Vi scrivete da Sapiens, senza scambiarvi altri contatti.</li>
						</ul>
						{invite.own ? <p className="rounded-xl border border-edge bg-surface-2 p-4 text-sm text-fg-muted">Questo è un invito che hai creato tu: mandalo allo studente, che lo apre dal suo account.</p> : <AcceptInvite code={code} tutor={invite.tutor.firstName} signedIn={!!user} />}
					</Card>
				)}
			</div>
		</div>
	);
}
