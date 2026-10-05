import type { ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import { TUTORING_ROOT } from '@/lib/config/site';
import { tutorFolder } from '@/lib/server/tutor-folder';
import { subjectName } from '@/lib/tutoring/config';
import { LinkButton } from '@/components/ui/Button';
import { PenStroke } from '@/components/content/PageHeader';
import { FolderTabs } from '@/components/tutoring/agenda/FolderTabs';
import { Initials } from '@/components/tutoring/agenda/Paper';

/** A tutor's pages for their student: who they are on top, and a tab for lessons, exercises, messages and what is shared. */
export default async function MyTutorFolderLayout({ children, params }: { children: ReactNode; params: Promise<{ id: string }> }) {
	const sheet = await tutorFolder(params);
	const { link } = sheet;
	const base = `/il-mio-tutor/${link.id}`;
	const name = `${link.tutor.firstName} ${link.tutor.lastInitial}.`;
	return (
		<div data-tutor={link.tutor.slug}>
			<header className="mb-7 flex flex-wrap items-center justify-between gap-4">
				<div className="flex min-w-0 items-center gap-4 sm:gap-5">
					<Initials name={`${link.tutor.firstName} ${link.tutor.lastInitial}`} subject={link.subject} size="lg" />
					<div className="min-w-0 space-y-1.5">
						<p className="label-mono text-fg-subtle">Il mio tutor{link.subject ? ` · ${subjectName(link.subject)}` : ''}</p>
						<h1 className="w-fit max-w-full text-3xl font-semibold leading-tight text-fg-strong sm:text-4xl">
							{name}
							<PenStroke className="mt-1" />
						</h1>
					</div>
				</div>
				{link.tutor.published && (
					<LinkButton href={`${TUTORING_ROOT}/${link.tutor.slug}`} variant="secondary" size="sm">
						Il suo profilo <ExternalLink className="size-3.5" aria-hidden="true" />
					</LinkButton>
				)}
			</header>
			<FolderTabs
				label="Sezioni"
				tabs={[
					{ href: base, label: 'In breve' },
					{ href: `${base}/compiti`, label: 'Compiti', count: sheet.assignments.filter((a) => a.done === false).length },
					{ href: `${base}/lezioni`, label: 'Lezioni' },
					{ href: `${base}/messaggi`, label: 'Messaggi', count: sheet.unread },
					{ href: `${base}/condivisione`, label: 'Condivisione' }
				]}
			/>
			{children}
		</div>
	);
}
