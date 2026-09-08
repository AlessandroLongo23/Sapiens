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
	{ name: 'Stripe secret or restricted key', re: /\b(sk|rk|rkcs)_(live|test)_[A-Za-z0-9]{16,}/ },
	{ name: 'Stripe webhook secret', re: /\bwhsec_[A-Za-z0-9]{16,}/ },
	{ name: 'Supabase access token', re: /\bsbp_[A-Za-z0-9]{20,}/ },
	{ name: 'Supabase secret key', re: /\bsb_secret_[A-Za-z0-9_-]{20,}/ },
	{ name: 'OpenAI key', re: /\bsk-(proj-)?[A-Za-z0-9_-]{32,}/ },
	{ name: 'Resend key', re: /\bre_[A-Za-z0-9]{8,}_[A-Za-z0-9]{16,}/ },
	// Any JWT whose payload carries a privileged role (the base64 payload is decoded, not pattern-matched).
	{ name: 'Supabase service role JWT', re: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/g, check: jwtHasPrivilegedRole }
];

function jwtHasPrivilegedRole(token) {
	try {
		const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'));
		return payload.role === 'service_role' || payload.role === 'supabase_admin';
	} catch {
		return false;
	}
}
const SCAN = ['src', 'public', 'scripts', '.env.example', '.next/server'];
const SKIP_DIRS = new Set(['node_modules', '.git', 'android']);
const TEXT_EXT = /\.(tsx|ts|js|mjs|cjs|json|md|html|css|txt|xml|example)$/i;

const hits = [];

function scanFile(full) {
	const stats = statSync(full);
	if (stats.size > 20_000_000) return;
	const text = readFileSync(full, 'utf8');
	for (const { name, re, check } of PATTERNS) {
		const matches = re.global ? text.match(re) ?? [] : [text.match(re)?.[0]].filter(Boolean);
		const match = matches.find((m) => !check || check(m));
		if (match) hits.push(`${relative(ROOT, full)}: ${name} ("${match.slice(0, 12)}…")`);
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
