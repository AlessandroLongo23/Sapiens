import type { ReactNode } from 'react';
import { tutorArea } from '@/lib/server/tutor-area';
import { FolderTabs } from '@/components/tutoring/agenda/FolderTabs';
import { AreaHeader } from '@/components/tutoring/agenda/Paper';

/** The profile's two pages: what the public reads, and the hours of the week. Before a profile exists, only the first. */
export default async function ProfileLayout({ children }: { children: ReactNode }) {
	const { tutor } = await tutorArea();
	return (
		<>
			{tutor && (
				<>
					<AreaHeader eyebrow="Come ti vedono gli studenti" title="Profilo" />
					<FolderTabs label="Sezioni del profilo" tabs={[{ href: '/profile-editor', label: 'Presentazione' }, { href: '/profile-editor/orari', label: 'Orari liberi' }]} />
				</>
			)}
			{children}
		</>
	);
}
