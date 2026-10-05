import type { ReactNode } from 'react';
import { studentFolder } from '@/lib/server/tutor-folder';
import { levelName, subjectName } from '@/lib/tutoring/config';
import { Breadcrumb } from '@/components/content/Breadcrumb';
import { PenStroke } from '@/components/content/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { NoProfile } from '@/components/tutoring/NoProfile';
import { EditStudent } from '@/components/tutoring/agenda/EditStudent';
import { FolderTabs } from '@/components/tutoring/agenda/FolderTabs';
import { Initials } from '@/components/tutoring/agenda/Paper';

/** A student's folder: who they are on the cover, and a tab for each thing the tutor does with them. */
export default async function StudentFolderLayout({ children, params }: { children: ReactNode; params: Promise<{ id: string }> }) {
	const folder = await studentFolder(params);
	if (!folder) return <NoProfile title="Prima crea il tuo profilo" />;
	const { tutor, sheet } = folder;
	const { link } = sheet;
	const base = `/studenti/${link.id}`;
	const ended = link.status === 'ended';
	const facts = [link.subject && subjectName(link.subject), link.level && levelName(link.level), link.origin === 'request' && 'ti ha trovato su Sapiens'].filter(Boolean).join(' · ');
	const open = sheet.assignments.filter((a) => a.done === false).length;
	return (
		<>
			<Breadcrumb items={[{ label: 'Studenti', path: '/studenti' }, { label: link.name }]} />
			<header className="mb-7 flex flex-wrap items-start justify-between gap-4">
				<div className="flex min-w-0 items-center gap-4 sm:gap-5">
					<Initials name={link.name} subject={link.subject} size="lg" />
					<div className="min-w-0 space-y-1.5">
						<p className="label-mono text-fg-subtle">{facts || 'Scheda dello studente'}</p>
						<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
							<h1 className="w-fit max-w-full text-3xl font-semibold leading-tight text-fg-strong sm:text-4xl">
								{link.name}
								<PenStroke className="mt-1" />
							</h1>
							{link.status === 'invited' ? <Badge tone="warn">Invito da accettare</Badge> : ended ? <Badge>Interrotto</Badge> : null}
						</div>
					</div>
				</div>
				{!ended && <EditStudent link={link} subjects={tutor.subjects} />}
			</header>
			<FolderTabs
				label="Sezioni della scheda"
				tabs={[
					{ href: base, label: 'Scheda' },
					{ href: `${base}/compiti`, label: 'Compiti', count: open },
					{ href: `${base}/lezioni`, label: 'Lezioni', count: sheet.lessons.filter((l) => l.status === 'proposed' && Date.parse(l.startsAt) > sheet.now).length },
					{ href: `${base}/progressi`, label: 'Progressi' },
					{ href: `${base}/appunti`, label: 'Appunti' },
					...(link.joined ? [{ href: `/messaggi/${link.id}`, label: 'Messaggi', count: sheet.unread }] : [])
				]}
			/>
			{children}
		</>
	);
}
