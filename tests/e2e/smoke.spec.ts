import { test, expect } from '@playwright/test';
import { EXERCISES_PATH, THEORY_PATH } from './helpers';

/** The public pages that must always answer 200 with a single h1. */
const PUBLIC_PATHS = ['/materiale', '/materiale/scuola-superiore/matematica', '/ripetizioni', '/ripetizioni/diventa-tutor', '/pricing', '/faq', '/contacts', '/terms', '/privacy', '/cookie'];

test.describe('public pages', () => {
	test('home shows content counters and one h1', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('h1')).toHaveCount(1);
		// The counters are rendered twice, beside the title on desktop and after the sketch on phones; one is hidden.
		await expect(page.getByText('Lezioni pubblicate').filter({ visible: true })).toBeVisible();
		await expect(page.getByText('Studenti Iscritti')).toHaveCount(0);
	});

	test('library and legal pages render with one h1 each', async ({ page }) => {
		for (const path of PUBLIC_PATHS) {
			const res = await page.goto(path);
			expect(res?.status(), path).toBe(200);
			await expect(page.locator('h1'), path).toHaveCount(1);
		}
	});

	test('old and database-slug URLs redirect to the title-derived ones', async ({ request }) => {
		const res = await request.get('/wiki/high_school/math', { maxRedirects: 0 });
		expect([301, 308]).toContain(res.status());
		expect(res.headers()['location']).toMatch(/\/materiale\/scuola-superiore\/matematica$/);
		const db = await request.get('/materiale/high_school/math', { maxRedirects: 0 });
		expect([301, 308]).toContain(db.status());
	});

	test('sitemap and robots exist', async ({ request }) => {
		const sitemap = await request.get('/sitemap.xml');
		expect(sitemap.status()).toBe(200);
		expect(await sitemap.text()).toContain('/materiale/scuola-superiore/matematica</loc>');
		const robots = await request.get('/robots.txt');
		expect(await robots.text()).toContain('Sitemap:');
	});

	test('signed-in areas bounce anonymous visitors', async ({ request }) => {
		for (const path of ['/subscription', '/admin', '/leads', '/dashboard', '/profile-editor', '/richieste', '/admin/tutors']) {
			const res = await request.get(path, { maxRedirects: 0 });
			expect(res.status(), path).toBe(303);
		}
		expect((await request.post('/api/chat', { data: { messages: [] } })).status()).toBe(401);
		expect((await request.post('/api/stripe/checkout', { data: { planId: 'lite' } })).status()).toBe(401);
	});
});

test.describe('runtime errors', () => {
	// `next build` cannot see these: a CSP that blocks a script, a hydration
	// mismatch, an asset that 404s or a component that throws in the browser.
	test('public pages load without console errors, uncaught exceptions or failed requests', async ({ page }) => {
		const problems: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') problems.push(`${page.url()} console: ${msg.text()}`);
		});
		page.on('pageerror', (err) => problems.push(`${page.url()} uncaught: ${err.message}`));
		page.on('requestfailed', (req) => {
			// Navigating away aborts in-flight requests; that is not a failure.
			if (req.failure()?.errorText !== 'net::ERR_ABORTED') problems.push(`${page.url()} failed: ${req.url()} (${req.failure()?.errorText})`);
		});
		page.on('response', (res) => {
			if (res.status() >= 400 && new URL(res.url()).origin === new URL(page.url()).origin) problems.push(`${page.url()} ${res.status()}: ${res.url()}`);
		});

		for (const path of ['/', ...PUBLIC_PATHS, THEORY_PATH, EXERCISES_PATH]) {
			await page.goto(path);
			await page.waitForLoadState('networkidle');
		}
		expect(problems, problems.join('\n')).toEqual([]);
	});

	test('the production policy never allows eval', async ({ request }) => {
		// next.config.ts adds 'unsafe-eval' for `next dev` only (React's dev build needs it).
		const csp = (await request.get('/')).headers()['content-security-policy'] ?? '';
		expect(csp).toContain("script-src 'self'");
		expect(csp).not.toContain("'unsafe-eval'");
	});
});

test.describe('cookie banner', () => {
	test('nothing analytics-related loads before a choice, and a choice is stored', async ({ page, context }) => {
		const requests: string[] = [];
		page.on('request', (r) => requests.push(r.url()));
		await page.goto('/');
		const banner = page.getByRole('region', { name: 'Cookie e privacy' });
		await expect(banner).toBeVisible();
		expect(requests.some((u) => /vercel-insights|_vercel\/insights|speed-insights/.test(u))).toBe(false);

		await banner.getByRole('button', { name: 'Rifiuta' }).click();
		await expect(banner).toBeHidden();
		const cookie = (await context.cookies()).find((c) => c.name === 'sapiens-cookie-consent');
		expect(cookie).toBeTruthy();
		expect(JSON.parse(decodeURIComponent(cookie!.value))).toMatchObject({ necessary: true, analytics: false });

		await page.reload();
		await expect(page.getByRole('region', { name: 'Cookie e privacy' })).toHaveCount(0);

		await page.getByRole('button', { name: 'Gestisci cookie' }).click();
		await expect(page.getByRole('region', { name: 'Cookie e privacy' })).toBeVisible();
	});
});
