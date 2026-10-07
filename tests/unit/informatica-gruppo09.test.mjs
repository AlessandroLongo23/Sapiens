// The frames of the tiny video and the glyph of the figures of lessons 85 and 86 (src/lib/informatica/fotogrammi.ts,
// glifi.ts): counts worked out by hand. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { ALTEZZA, LARGHEZZA, TAGLIO, differenza, filmato, scritti } = await jiti.import('../../src/lib/informatica/fotogrammi.ts');
const { ALTA, ERRE, ERRE_BITMAP, LARGA, dentro, ingrandisci, poligoni, punti, rasterizza, tracciato } = await jiti.import('../../src/lib/informatica/glifi.ts');

test('the video: ten frames of 16 × 9, the ball moves 8 pixels, the car 2, the cut changes everything', () => {
	const frames = filmato();
	assert.equal(frames.length, 10);
	for (const f of frames) assert.deepEqual([f.length, f[0].length], [ALTEZZA, LARGHEZZA]);
	const changed = frames.map((f, i) => differenza(i ? frames[i - 1] : null, f).quanti);
	assert.deepEqual(changed, [144, 8, 8, 8, 8, 8, 144, 2, 2, 2]);
	assert.equal(TAGLIO, 6);
	assert.deepEqual(scritti(frames), [144, 152, 160, 168, 176, 184, 328, 330, 332, 334]);
});

test('the difference of a frame with itself is nothing, and its mask has the shape of the frame', () => {
	const [first] = filmato();
	const same = differenza(first, first);
	assert.equal(same.quanti, 0);
	assert.equal(same.cambiato.length, ALTEZZA);
	assert.ok(same.cambiato.every((row) => row.length === LARGHEZZA && row.every((x) => x === false)));
});

test('the R: 19 points, a hole in the bowl, and a path that closes twice', () => {
	assert.equal(punti(ERRE), 19);
	assert.equal(tracciato(ERRE).split('Z').length - 1, 2);
	const shapes = poligoni(ERRE);
	assert.equal(dentro(shapes, 1.8, 5), true, 'the stem is ink');
	assert.equal(dentro(shapes, 4, 3.5), false, 'the hole of the bowl is paper');
	assert.equal(dentro(shapes, 7.8, 9.5), false, 'outside the letter');
});

test('pixels from the outline grow with the size, a bitmap only repeats its own', () => {
	for (const k of [1, 2, 4, 8]) {
		const grid = rasterizza(ERRE, k);
		assert.deepEqual([grid.length, grid[0].length], [ALTA * k, LARGA * k]);
		const big = ingrandisci(ERRE_BITMAP, k);
		assert.deepEqual([big.length, big[0].length], [ALTA * k, LARGA * k]);
		// every pixel of the drawing has become a square of k × k
		const black = ERRE_BITMAP.join('').split('#').length - 1;
		assert.equal(big.flat().filter(Boolean).length, black * k * k);
	}
	assert.equal(ERRE_BITMAP.length, ALTA);
	assert.ok(ERRE_BITMAP.every((row) => row.length === LARGA));
	// the outline at 8 times covers about the same share of the box as at 4 times
	const share = (k) => rasterizza(ERRE, k).flat().filter(Boolean).length / (LARGA * ALTA * k * k);
	assert.ok(Math.abs(share(8) - share(4)) < 0.01);
});
