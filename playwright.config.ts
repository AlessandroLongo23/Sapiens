import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/**
 * End-to-end tests against the production build served by `vite preview`,
 * with the Stripe sandbox and the real Supabase project (throwaway users).
 *
 *   npm run build && npm run test:e2e
 *
 * `.env` must hold the sandbox Stripe key (never a live one: the suite
 * refuses to start otherwise), the matching CLI webhook secret, and the
 * Supabase service role key used to create and delete test users.
 * `global-setup.ts` starts `stripe listen` so webhooks reach the local server.
 */
export default defineConfig({
	testDir: 'tests/e2e',
	timeout: 180_000,
	expect: { timeout: 15_000 },
	fullyParallel: false,
	workers: 1,
	retries: 0,
	reporter: [['list']],
	globalSetup: './tests/e2e/global-setup.ts',
	globalTeardown: './tests/e2e/global-teardown.ts',
	use: {
		baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:4173',
		locale: 'it-IT',
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure'
	},
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	webServer: {
		command: 'npm run preview -- --port 4173',
		url: 'http://localhost:4173/robots.txt',
		reuseExistingServer: true,
		timeout: 60_000,
		// Cookies on localhost are shared by every local project; Node's 16 KB header limit is too small.
		env: { NODE_OPTIONS: '--max-http-header-size=131072' }
	}
});
