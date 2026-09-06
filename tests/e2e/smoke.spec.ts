import { test, expect } from '@playwright/test';

test.describe('public pages', () => {
	test('home shows content counters and one h1', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('h1')).toHaveCount(1);
		await expect(page.getByText('Lezioni pubblicate')).toBeVisible();
		await expect(page.getByText('Studenti Iscritti')).toHaveCount(0);
	});

	test('library and legal pages render with one h1 each', async ({ page }) => {
		for (const path of ['/materiale', '/materiale/scuola-superiore/matematica', '/pricing', '/faq', '/contacts', '/terms', '/privacy', '/cookie']) {
			const res = await page.goto(path);
			expect(res?.status(), path).toBe(200);
			await expect(page.locator('h1'), path).toHaveCount(1);
		}
	});

	test('old and database-slug URLs redirect to the title-derived ones', async ({ request }) => {
		const res = await request.get('/wiki/high_school/math', { maxRedirects: 0 });
		expect(res.status()).toBe(301);
		expect(res.headers()['location']).toBe('/materiale/scuola-superiore/matematica');
		const db = await request.get('/materiale/high_school/math', { maxRedirects: 0 });
		expect(db.status()).toBe(301);
	});

	test('sitemap and robots exist', async ({ request }) => {
		const sitemap = await request.get('/sitemap.xml');
		expect(sitemap.status()).toBe(200);
		expect(await sitemap.text()).toContain('/materiale/scuola-superiore/matematica</loc>');
		const robots = await request.get('/robots.txt');
		expect(await robots.text()).toContain('Sitemap:');
	});

	test('signed-in areas bounce anonymous visitors', async ({ request }) => {
		for (const path of ['/subscription', '/home', '/admin']) {
			const res = await request.get(path, { maxRedirects: 0 });
			expect(res.status(), path).toBe(303);
		}
		expect((await request.post('/api/chat', { data: { messages: [] } })).status()).toBe(401);
		expect((await request.post('/api/stripe/checkout', { data: { planId: 'lite' } })).status()).toBe(401);
	});
});

test.describe('cookie banner', () => {
	test('nothing analytics-related loads before a choice, and a choice is stored', async ({ page, context }) => {
		const requests: string[] = [];
		page.on('request', (r) => requests.push(r.url()));
		await page.goto('/');
		const banner = page.getByRole('dialog', { name: 'Cookie e privacy' });
		await expect(banner).toBeVisible();
		expect(requests.some((u) => /vercel-insights|_vercel\/insights|speed-insights/.test(u))).toBe(false);

		await banner.getByRole('button', { name: 'Rifiuta' }).click();
		await expect(banner).toBeHidden();
		const cookie = (await context.cookies()).find((c) => c.name === 'sapiens-cookie-consent');
		expect(cookie).toBeTruthy();
		expect(JSON.parse(decodeURIComponent(cookie!.value))).toMatchObject({ necessary: true, analytics: false });

		await page.reload();
		await expect(page.getByRole('dialog', { name: 'Cookie e privacy' })).toHaveCount(0);

		await page.getByRole('button', { name: 'Gestisci cookie' }).click();
		await expect(page.getByRole('dialog', { name: 'Cookie e privacy' })).toBeVisible();
	});
});
