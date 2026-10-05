import { fail, isUuid, json, readJson } from '@/lib/server/http';
import { readMessages, sendMessage } from '@/lib/server/tutor-agenda';
import { withTutor, withUser } from '@/lib/server/tutor-agenda-http';

type Params = { params: Promise<{ linkId: string }> };

/** The conversation between a tutor and a student. `as=tutor` reads and writes from the tutor's side. */
export async function GET(request: Request, { params }: Params) {
	const { linkId } = await params;
	if (!isUuid(linkId)) return fail('Conversazione non trovata.', 404);
	if (new URL(request.url).searchParams.get('as') === 'tutor') return withTutor('messages read', async (tutor) => json({ messages: await readMessages({ tutorId: tutor.id }, linkId) }));
	return withUser('messages read', async (user) => json({ messages: await readMessages({ userId: user.id }, linkId) }));
}

export async function POST(request: Request, { params }: Params) {
	const { linkId } = await params;
	if (!isUuid(linkId)) return fail('Conversazione non trovata.', 404);
	const body = await readJson(request);
	if (body.as === 'tutor') return withTutor('message send', async (tutor) => json({ message: await sendMessage({ tutorId: tutor.id }, linkId, body.body) }, 201));
	return withUser('message send', async (user) => json({ message: await sendMessage({ userId: user.id }, linkId, body.body) }, 201));
}
