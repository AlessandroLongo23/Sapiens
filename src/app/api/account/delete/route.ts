import { currentUser } from '@/lib/server/auth';
import { AccountError, deleteAccount } from '@/lib/server/account';
import { fail, guarded, json, readJson } from '@/lib/server/http';

/** Deletes the signed-in account; the body repeats the account's email, as typed by the student to confirm. */
export async function POST(request: Request) {
	return guarded('account delete', async () => {
		const user = await currentUser();
		if (!user) return fail('Accedi per eliminare il tuo account.', 401);
		const { email } = await readJson(request);
		if (typeof email !== 'string' || email.trim().toLowerCase() !== user.email?.toLowerCase()) return fail("L'email non corrisponde a quella dell'account.", 400);
		try {
			await deleteAccount(user);
		} catch (err) {
			if (err instanceof AccountError) return fail(err.message, err.status);
			throw err;
		}
		return json({ ok: true });
	});
}
