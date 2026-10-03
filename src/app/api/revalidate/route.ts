import { createHash, timingSafeEqual } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { CONTENT_ROOT } from '@/lib/config/site';
import { fail, json } from '@/lib/server/http';
import { TOOLS, TOOLS_ROOT } from '@/lib/tools/registry';

const digest = (value: string) => createHash('sha256').update(value).digest();

/**
 * Marks the pages that read the content tree as stale, so each is rendered
 * again on its next visit: the library, the tools with a page of their own
 * (they link to lessons), the home page (its counts) and the sitemap. The
 * scripts that write to `content_nodes` call it when they finish
 * (scripts/revalidate.mjs), with `Authorization: Bearer REVALIDATE_SECRET`.
 * These pages have no timer: Vercel bills every regeneration whose output
 * differs by a byte, and the same content does not always render to the same
 * bytes.
 */
export async function POST(request: Request) {
	const secret = process.env.REVALIDATE_SECRET;
	if (!secret) return fail('REVALIDATE_SECRET non è configurato.', 503);
	const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
	if (!timingSafeEqual(digest(token), digest(secret))) return fail('Non autorizzato.', 401);
	revalidatePath(CONTENT_ROOT, 'layout');
	// The calculators under `[slug]` wait for a deploy (see their page).
	for (const tool of TOOLS) if (tool.ownPage) revalidatePath(`${TOOLS_ROOT}/${tool.slug}`);
	revalidatePath('/');
	revalidatePath('/sitemap.xml');
	return json({ ok: true });
}
