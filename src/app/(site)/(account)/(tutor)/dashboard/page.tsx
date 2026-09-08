import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, CheckCircle2, Clock, Inbox, ShieldAlert, UserPen } from 'lucide-react';
import { TUTORING_ROOT } from '@/lib/config/site';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { subjectName } from '@/lib/tutoring/config';
import { tutorArea } from '@/lib/server/tutor-area';
import { listTutorInbox, type TutorStatus } from '@/lib/server/tutoring-admin';
import type { IconComponent } from '@/lib/utils/icons';
import { Badge } from '@/components/ui/Badge';
import { Card, type CardTone } from '@/components/ui/Card';
import { LinkButton } from '@/components/ui/Button';
import { NoProfile } from '@/components/tutoring/NoProfile';

export const metadata: Metadata = pageMetadata({ title: 'Area tutor | Sapiens', path: '/dashboard' });

const STATUS: Record<TutorStatus, { icon: IconComponent; title: string; text: string; tone: CardTone }> = {
	draft: { icon: Clock, title: 'Bozza', text: 'Completa il profilo per inviarlo in revisione.', tone: 'default' },
	pending: { icon: Clock, title: 'In revisione', text: 'Controlliamo il profilo e ti avvisiamo via email quando è pubblico. Nel frattempo puoi ancora modificarlo.', tone: 'warn' },
	published: { icon: CheckCircle2, title: 'Pubblicato', text: 'Il profilo è visibile nella lista dei tutor. Le richieste degli studenti arrivano qui e via email.', tone: 'ok' },
	suspended: { icon: ShieldAlert, title: 'Sospeso', text: 'Il profilo non è visibile. Scrivici dalla pagina contatti per chiarire.', tone: 'danger' }
};

export default async function TutorDashboardPage() {
	const { tutor } = await tutorArea();
	if (!tutor) return <NoProfile title="Non hai ancora un profilo tutor" text="Racconta cosa insegni, a chi e dove: bastano cinque minuti. Il profilo va in revisione e poi compare nella lista." />;
	const inbox = await listTutorInbox(tutor.id);
	const pending = inbox.filter((r) => r.status === 'pending').length;
	const accepted = inbox.filter((r) => r.status === 'accepted').length;
	const status = STATUS[tutor.status];

	return (
		<>
			<h1 className="mb-6 text-3xl font-bold text-fg">Ciao {tutor.first_name}</h1>
			<div className="grid gap-5 lg:grid-cols-3">
				<Card as="section" tone={status.tone} className="p-6 lg:col-span-2" aria-labelledby="stato">
					<div className="flex items-start gap-3">
						<status.icon className="size-6 shrink-0 text-fg" aria-hidden="true" />
						<div className="space-y-1">
							<h2 id="stato" className="flex items-center gap-2 text-lg font-semibold text-fg">
								Profilo: {status.title}
								{tutor.verified && <Badge tone="info" icon={BadgeCheck}>Identità verificata</Badge>}
							</h2>
							<p className="text-sm text-fg-muted">{status.text}</p>
							{tutor.status === 'published' && (
								<Link href={`${TUTORING_ROOT}/${tutor.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-accent-fg hover:underline">
									Vedi il profilo pubblico <ArrowRight className="size-3.5" aria-hidden="true" />
								</Link>
							)}
						</div>
					</div>
				</Card>
				<Card as="section" className="p-6" aria-labelledby="richieste">
					<h2 id="richieste" className="mb-3 flex items-center gap-2 text-sm font-medium text-fg-subtle"><Inbox className="size-4" aria-hidden="true" /> Richieste</h2>
					<dl className="grid grid-cols-2 gap-4">
						{[['In attesa', pending], ['Accettate', accepted]].map(([label, n]) => (
							<div key={label}>
								<dt className="text-xs text-fg-subtle">{label}</dt>
								<dd className="text-3xl font-bold text-fg">{n}</dd>
							</div>
						))}
					</dl>
					<Link href="/leads" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-fg hover:underline">Apri le richieste <ArrowRight className="size-3.5" aria-hidden="true" /></Link>
				</Card>
				<Card as="section" className="p-6 lg:col-span-3" aria-labelledby="profilo">
					<div className="flex flex-wrap items-start justify-between gap-4">
						<div className="space-y-2">
							<h2 id="profilo" className="text-lg font-semibold text-fg">{tutor.first_name} {tutor.last_name.charAt(0)}. · {tutor.headline}</h2>
							<ul className="flex flex-wrap gap-2">
								{tutor.subjects.map((s) => <li key={s}><Badge>{subjectName(s)}</Badge></li>)}
							</ul>
						</div>
						<LinkButton href="/profile-editor" variant="secondary" size="sm">
							<UserPen className="size-4" aria-hidden="true" />
							Modifica il profilo
						</LinkButton>
					</div>
				</Card>
			</div>
		</>
	);
}
