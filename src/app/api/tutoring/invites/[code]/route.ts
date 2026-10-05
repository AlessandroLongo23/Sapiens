import { json, readJson } from '@/lib/server/http';
import { acceptInvite, getTutorLink } from '@/lib/server/tutor-agenda';
import { withUser } from '@/lib/server/tutor-agenda-http';
import { mailAgenda } from '@/lib/server/tutoring-mail';
import { adminClient, userEmail } from '@/lib/server/tutoring-admin';

/** The student accepts a tutor's invite, choosing whether the tutor sees their exercises. */
export async function POST(request: Request, { params }: { params: Promise<{ code: string }> }) {
	const { code } = await params;
	const body = await readJson(request);
	const origin = new URL(request.url).origin;
	return withUser('invite accept', async (user) => {
		const linkId = await acceptInvite(user.id, code, body.share === true);
		const { data } = await adminClient().from('tutor_students').select('tutor_id, tutors ( user_id, first_name, contact_email )').eq('id', linkId).maybeSingle();
		const tutor = (data as unknown as { tutor_id: string; tutors: { user_id: string | null; first_name: string; contact_email: string | null } | null } | null);
		if (tutor?.tutors) {
			const link = await getTutorLink(tutor.tutor_id, linkId);
			await mailAgenda(tutor.tutors.contact_email ?? (await userEmail(tutor.tutors.user_id)), `${link.name} ha accettato il tuo invito`, `Ciao ${tutor.tutors.first_name}, ${link.name} è tra i tuoi studenti`, 'Ora puoi fissare le lezioni, assegnare esercizi e scrivervi da Sapiens.', { href: `${origin}/studenti/${linkId}`, label: 'Apri la sua scheda' });
		}
		return json({ link: linkId });
	});
}
