import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/**
 * End-to-end tests against the production build served by `next start`,
 * with the Stripe sandbox and the real Supabase project (throwaway users).
 *
 *   npm run build && npm run test:e2e
 *
 * `mobile.spec.ts` runs on the iPhone and Pixel projects only; everything
 * else on desktop Chromium.
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
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] }, testIgnore: /mobile\.spec\.ts$/ },
		// The phone suite runs on an iPhone (WebKit) and a Pixel (Chromium).
		{ name: 'iphone', use: { ...devices['iPhone 14'] }, testMatch: /mobile\.spec\.ts$/ },
		{ name: 'pixel', use: { ...devices['Pixel 7'] }, testMatch: /mobile\.spec\.ts$/ }
	],
	// With E2E_BASE_URL set (a dev server, say) no server is started. A server
	// already on 4173 is never reused: one left over from an earlier build
	// serves chunk names that no longer exist and fails (or passes) for the
	// wrong build, which is exactly what the pre-push hook must not do.
	webServer: process.env.E2E_BASE_URL
		? undefined
		: {
				command: 'npm run preview',
				url: 'http://localhost:4173/robots.txt',
				reuseExistingServer: false,
				timeout: 60_000
			}
});
