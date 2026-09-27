import { getSession } from '@/lib/server/auth';
import { exportAccount } from '@/lib/server/account';
import { fail, guarded } from '@/lib/server/http';
import { romeDate } from '@/lib/stripe/config';

/** The signed-in student's data as a JSON file to download. */
export async function GET() {
	return guarded('account export', async () => {
		const { supabase, user } = await getSession();
		if (!user) return fail('Accedi per scaricare i tuoi dati.', 401);
		const data = await exportAccount(supabase, user);
		const day = romeDate();
		return new Response(JSON.stringify(data, null, 2), {
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Content-Disposition': `attachment; filename="sapiens-dati-${day}.json"`,
				'Cache-Control': 'private, no-store'
			}
		});
	});
}
