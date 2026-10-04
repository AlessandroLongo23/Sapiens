import { getSession } from '@/lib/server/auth';
import { createProgram, listPrograms, parseProgramInput, programQuota } from '@/lib/server/programmi';
import { fail, guarded, json, readJson } from '@/lib/server/http';
import type { ProgramFiles, ProgramLanguage } from '@/lib/codice/salvati';

/** The student's saved programs, the last saved first, with how many the plan allows. */
export async function GET() {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	return guarded('program list', async () => {
		const [programs, quota] = await Promise.all([listPrograms(supabase, user.id), programQuota(supabase, user)]);
		return json({ programs, quota });
	});
}

/** "Salva con nome": a new program. */
export async function POST(request: Request) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const input = parseProgramInput(await readJson(request), { title: true, program: true });
	if (typeof input === 'string') return fail(input, 400);
	return guarded('program create', async () => json({ program: await createProgram(supabase, user, input as { title: string; language: ProgramLanguage; files: ProgramFiles }) }, 201));
}
