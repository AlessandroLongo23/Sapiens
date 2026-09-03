#!/usr/bin/env node
/**
 * Fails when something that looks like a live credential is committed to the
 * source tree or shipped in the build output: Stripe keys and webhook secrets,
 * Supabase service-role or access tokens, Vercel tokens. Runs after
 * `vite build` (see package.json). Environment files are gitignored and are
 * not scanned; `.env.example` is, since it is committed.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const PATTERNS = [
	{ name: 'Stripe secret or restricted key', re: /\b[sr]k_(live|test)_[A-Za-z0-9]{16,}/ },
	{ name: 'Stripe webhook secret', re: /\bwhsec_[A-Za-z0-9]{16,}/ },
	{ name: 'Supabase access token', re: /\bsbp_[A-Za-z0-9]{20,}/ },
	{ name: 'Supabase service role JWT', re: /eyJ[A-Za-z0-9_-]{20,}\.eyJ[A-Za-z0-9_-]*service_role[A-Za-z0-9_-]*\./ }
];
const SCAN = ['src', 'static', 'scripts', '.env.example', '.svelte-kit/output', '.vercel/output'];
const SKIP_DIRS = new Set(['node_modules', '.git', 'android', 'sapiens backup']);
const TEXT_EXT = /\.(svelte|ts|js|mjs|cjs|json|md|html|css|txt|xml|svx|example)$/i;

const hits = [];

function scanFile(full) {
	const stats = statSync(full);
	if (stats.size > 20_000_000) return;
	const text = readFileSync(full, 'utf8');
	for (const { name, re } of PATTERNS) {
		const match = text.match(re);
		if (match) hits.push(`${relative(ROOT, full)}: ${name} ("${match[0].slice(0, 12)}…")`);
	}
}

function scan(path) {
	if (!existsSync(path)) return;
	const stats = statSync(path);
	if (stats.isFile()) return scanFile(path);
	for (const entry of readdirSync(path)) {
		if (SKIP_DIRS.has(entry)) continue;
		const full = join(path, entry);
		if (statSync(full).isDirectory()) scan(full);
		else if (TEXT_EXT.test(entry) || !entry.includes('.')) scanFile(full);
	}
}

for (const target of SCAN) scan(join(ROOT, target));

if (hits.length) {
	console.error('\ncheck-secrets: credentials found in the tree or the build:\n');
	for (const hit of hits) console.error('  ' + hit);
	console.error('\nMove them to the environment (Vercel: sensitive variables) and roll the exposed key.');
	process.exit(1);
}

console.log('check-secrets: no credentials in source or build output');
