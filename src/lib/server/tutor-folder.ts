import 'server-only';
import { notFound, redirect } from 'next/navigation';
import { currentUser } from './auth';
import { isUuid } from './http';
import { studentSheet, studentTutors, type StudentSheet, type TutorSheet } from './tutor-agenda';
import { tutorArea } from './tutor-area';
import { TutoringError, type TutorRow } from './tutoring-admin';

/**
 * What every page of a student's folder starts from: the signed-in tutor and the student of the address. A
 * folder that is not theirs is a 404; `tutor` null means there is no profile yet (the page shows the way to it).
 */
export async function studentFolder(params: Promise<{ id: string }>): Promise<{ tutor: TutorRow; sheet: StudentSheet } | null> {
	const { tutor } = await tutorArea();
	if (!tutor) return null;
	const { id } = await params;
	if (!isUuid(id)) notFound();
	try {
		return { tutor, sheet: await studentSheet(tutor.id, id) };
	} catch (err) {
		if (err instanceof TutoringError && err.status === 404) notFound();
		throw err;
	}
}

/** What every page of "Il mio tutor" starts from: the signed-in student and the tutor of the address, or a 404. */
export async function tutorFolder(params: Promise<{ id: string }>): Promise<TutorSheet> {
	const user = await currentUser();
	if (!user) redirect('/');
	const { id } = await params;
	const sheet = isUuid(id) ? (await studentTutors(user.id)).find((t) => t.link.id === id) : undefined;
	if (!sheet) notFound();
	return sheet;
}
