#!/usr/bin/env node
/**
 * Tells the site that `content_nodes` changed, so the cached pages that read
 * it are rendered again on their next visit (src/app/api/revalidate). The
 * scripts that publish call `revalidateSite()` when they have written; after
 * a change made by hand (scripts/db.mjs, the Supabase dashboard) run it:
 *
 *   node --env-file=.env scripts/revalidate.mjs
 *
 * Needs REVALIDATE_SECRET, the same value as on Vercel. REVALIDATE_URL
 * points it at another deployment (default: production).
 */
import { pathToFileURL } from 'node:url';

const PRODUCTION = 'https://sapiens-edu.vercel.app';

/** Never throws: the content is already written, and a deploy refreshes the pages too. Returns whether the site answered. */
export async function revalidateSite() {
	const secret = process.env.REVALIDATE_SECRET;
	const site = (process.env.REVALIDATE_URL ?? PRODUCTION).replace(/\/$/, '');
	if (!secret) {
		console.log('\nPagine non aggiornate: manca REVALIDATE_SECRET. Il sito mostrerà le modifiche dopo il prossimo deploy.');
		return false;
	}
	try {
		const res = await fetch(`${site}/api/revalidate`, { method: 'POST', headers: { Authorization: `Bearer ${secret}` } });
		if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`);
		console.log(`\nPagine da rigenerare alla prossima visita su ${site}.`);
		return true;
	} catch (err) {
		console.log(`\nPagine non aggiornate su ${site}: ${err instanceof Error ? err.message : err}. Riprova con: node --env-file=.env scripts/revalidate.mjs`);
		return false;
	}
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exitCode = (await revalidateSite()) ? 0 : 1;
