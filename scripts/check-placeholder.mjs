#!/usr/bin/env node
/**
 * Fails when placeholder text ("lorem ipsum") appears in the source tree, in
 * the build output, or in the content database.
 *
 * Runs after `vite build` (see package.json) so a deployment cannot ship
 * filler text again. Set SKIP_PLACEHOLDER_DB=1 to skip the database check.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const ROOT = process.cwd();
const PATTERN = /lorem\s+ipsum/i;
const SCAN_DIRS = ['src', 'static', '.svelte-kit/output', 'build', '.vercel/output'];
const SKIP_DIRS = new Set(['node_modules', '.git', 'android', 'sapiens backup']);
const TEXT_EXT = /\.(svelte|ts|js|mjs|cjs|json|md|html|css|txt|xml|svx)$/i;

const hits = [];

function scan(dir) {
	if (!existsSync(dir)) return;
	for (const entry of readdirSync(dir)) {
		if (SKIP_DIRS.has(entry)) continue;
		const full = join(dir, entry);
		const stats = statSync(full);
		if (stats.isDirectory()) {
			scan(full);
		} else if (TEXT_EXT.test(entry) || !entry.includes('.')) {
			if (stats.size > 20_000_000) continue;
			const text = readFileSync(full, 'utf8');
			const match = text.match(PATTERN);
			if (match) hits.push(`${relative(ROOT, full)}: "${match[0]}"`);
		}
	}
}

for (const dir of SCAN_DIRS) scan(join(ROOT, dir));

async function scanDatabase() {
	const url = process.env.PUBLIC_SUPABASE_URL;
	const key = process.env.PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !key) {
		console.log('check-placeholder: PUBLIC_SUPABASE_URL not set, database not checked');
		return;
	}
	const endpoint = `${url.replace(/\/$/, '')}/rest/v1/content_nodes?select=id,slug,title,description,theory,formulary`;
	const res = await fetch(endpoint, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
	if (!res.ok) {
		console.warn(`check-placeholder: database query failed (${res.status}), skipping`);
		return;
	}
	const rows = await res.json();
	for (const row of rows) {
		for (const field of ['title', 'description', 'theory', 'formulary']) {
			const value = row[field];
			if (typeof value === 'string' && PATTERN.test(value)) {
				hits.push(`content_nodes ${row.slug} (${row.id}) field "${field}"`);
			}
		}
	}
	console.log(`check-placeholder: ${rows.length} content nodes checked`);
}

if (process.env.SKIP_PLACEHOLDER_DB !== '1') {
	try {
		await scanDatabase();
	} catch (err) {
		console.warn('check-placeholder: database check skipped:', err?.message ?? err);
	}
}

if (hits.length) {
	console.error('\ncheck-placeholder: placeholder text found:\n');
	for (const hit of hits) console.error('  ' + hit);
	console.error('\nRemove the placeholder text (render nothing when copy is missing).');
	process.exit(1);
}

console.log('check-placeholder: no placeholder text found');
