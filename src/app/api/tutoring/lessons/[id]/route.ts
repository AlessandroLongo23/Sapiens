import { lessonWhen } from '@/lib/tutoring/agenda';
import { fail, isUuid, json, readJson } from '@/lib/server/http';
import { cancelLesson, respondToProposal } from '@/lib/server/tutor-agenda';
import { withTutor, withUser } from '@/lib/server/tutor-agenda-http';
import { userEmail } from '@/lib/server/tutoring-admin';
import { mailAgenda } from '@/lib/server/tutoring-mail';

/** The tutor accepts or declines a proposal; either side cancels a lesson to come. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	if (!isUuid(id)) return fail('Lezione non trovata.', 404);
	const body = await readJson(request);
	const origin = new URL(request.url).origin;
	if (body.action === 'accept' || body.action === 'decline') {
		const accept = body.action === 'accept';
		return withTutor('proposal answer', async (tutor) => {
			const { lesson, studentId } = await respondToProposal(tutor, id, accept);
			await mailAgenda(
				await userEmail(studentId),
				accept ? `${tutor.first_name} ha confermato la lezione` : `${tutor.first_name} non può fare lezione a quell'ora`,
				accept ? 'Lezione confermata' : 'Proposta non accettata',
				accept ? `La lezione di ${lessonWhen(lesson)} è confermata: la trovi anche nel diario.` : `${tutor.first_name} non è libero ${lessonWhen(lesson)}. Proponi un altro orario.`,
				{ href: `${origin}/il-mio-tutor`, label: 'Apri la pagina del tuo tutor' }
			);
			return json({ status: lesson.status });
		});
	}
	if (body.action !== 'cancel') return fail('Azione non valida.', 400);
	if (body.as === 'tutor') {
		return withTutor('lesson cancel', async (tutor) => {
			await cancelLesson({ tutorId: tutor.id }, id, body.series === true);
			return json({ status: 'cancelled' });
		});
	}
	return withUser('lesson cancel', async (user) => {
		await cancelLesson({ userId: user.id }, id);
		return json({ status: 'cancelled' });
	});
}
