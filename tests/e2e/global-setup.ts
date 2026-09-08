import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

/**
 * Refuses live Stripe keys, then starts `stripe listen` so the sandbox
 * forwards webhook events to the local server. The process id is kept in
 * a file for the teardown.
 */
export default async function globalSetup() {
	const key = process.env.STRIPE_SECRET_KEY ?? '';
	if (/_live_/.test(key)) {
		throw new Error('STRIPE_SECRET_KEY is a live key: the e2e suite only runs against a sandbox.');
	}
	if (!key) throw new Error('STRIPE_SECRET_KEY (sandbox) is missing from .env');
	if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing from .env');

	if (process.env.E2E_SKIP_STRIPE_LISTEN === '1') return;

	const base = process.env.E2E_BASE_URL ?? 'http://localhost:4173';
	const child = spawn('stripe', ['listen', '--api-key', key, '--forward-to', `${base.replace(/\/$/, '')}/api/stripe/webhook`], {
		stdio: ['ignore', 'pipe', 'pipe'],
		detached: true
	});

	await new Promise<void>((resolve, reject) => {
		const timer = setTimeout(() => reject(new Error('stripe listen did not become ready in 30 s')), 30_000);
		const onData = (chunk: Buffer) => {
			if (/Ready!/.test(chunk.toString())) {
				clearTimeout(timer);
				resolve();
			}
		};
		child.stdout?.on('data', onData);
		child.stderr?.on('data', onData);
		child.on('error', (err: NodeJS.ErrnoException) => {
			clearTimeout(timer);
			reject(new Error(err.code === 'ENOENT' ? 'The Stripe CLI is not installed (`brew install stripe/stripe-cli/stripe`); set E2E_SKIP_STRIPE_LISTEN=1 to run without webhooks.' : `stripe listen failed: ${err.message}`));
		});
		child.on('exit', (code) => {
			clearTimeout(timer);
			reject(new Error(`stripe listen exited with code ${code}`));
		});
	});

	child.unref();
	writeFileSync('tests/e2e/.stripe-listen.pid', String(child.pid));
}
