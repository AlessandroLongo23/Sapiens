// The request limit of the public routes (src/lib/server/rate-limit.ts). Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { withinLimit, callerOf } = await jiti.import('../../src/lib/server/rate-limit.ts');

test('a caller is stopped at the limit and let in again when the window has passed', () => {
	for (let i = 0; i < 20; i++) assert.equal(withinLimit('a', 20, 60_000, 1000 + i), true);
	assert.equal(withinLimit('a', 20, 60_000, 2000), false);
	assert.equal(withinLimit('b', 20, 60_000, 2000), true);
	assert.equal(withinLimit('a', 20, 60_000, 61_001), true);
});

test('the caller is the first address of x-forwarded-for', () => {
	assert.equal(callerOf(new Request('http://x', { headers: { 'x-forwarded-for': '1.2.3.4, 10.0.0.1' } })), '1.2.3.4');
	assert.equal(callerOf(new Request('http://x')), 'unknown');
});
