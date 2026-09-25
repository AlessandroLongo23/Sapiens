import { getSession } from '@/lib/server/auth';
import { lessonProgress } from '@/lib/server/exercises';
import { fail, guarded, json } from '@/lib/server/http';

/**
 * The signed-in student's progress on every lesson started: `{ lessons: { [dbPath]: { passed, total } } }`. Asked
 * once by the pages of the material, which are cached for everybody and add the badges in the browser.
 */
export async function GET() {
	const { user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	return guarded('exercise progress', async () => {
		const response = json({ lessons: await lessonProgress(user.id) });
		response.headers.set('Cache-Control', 'private, no-store');
		return response;
	});
}
