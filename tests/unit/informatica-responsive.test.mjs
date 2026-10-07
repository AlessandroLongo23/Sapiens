// The contrast ratio and the media queries of the lesson on responsive pages (src/lib/informatica/responsive.ts).
// The expected ratios are worked out by hand from the WCAG 2.2 definitions. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { leggiColore, scriviColore, luminanza, contrasto, supera, scriviRapporto, vale, valori, SOGLIE } = await jiti.import('../../src/lib/informatica/responsive.ts');

const near = (a, b, eps = 0.005) => assert.ok(Math.abs(a - b) < eps, `${a} is not ${b}`);

test('colours are read and written', () => {
	assert.deepEqual(leggiColore('#ffffff'), [255, 255, 255]);
	assert.deepEqual(leggiColore('1a2B3c'), [26, 43, 60]);
	assert.deepEqual(leggiColore('#f80'), [255, 136, 0]);
	assert.equal(leggiColore('#12345'), null);
	assert.equal(leggiColore('rosso'), null);
	assert.equal(scriviColore([255, 136, 0]), '#ff8800');
});

test('relative luminance: black, white, the three primaries', () => {
	assert.equal(luminanza([0, 0, 0]), 0);
	near(luminanza([255, 255, 255]), 1, 1e-9);
	near(luminanza([255, 0, 0]), 0.2126, 1e-9);
	near(luminanza([0, 255, 0]), 0.7152, 1e-9);
	near(luminanza([0, 0, 255]), 0.0722, 1e-9);
	// mid grey #808080: ((128/255 + 0.055) / 1.055) ^ 2.4 = 0.21586
	near(luminanza([128, 128, 128]), 0.21586, 1e-4);
});

test('contrast ratio on known pairs', () => {
	near(contrasto([0, 0, 0], [255, 255, 255]), 21, 1e-9);
	near(contrasto([255, 255, 255], [0, 0, 0]), 21, 1e-9);
	assert.equal(contrasto([18, 52, 86], [18, 52, 86]), 1);
	// #777777 on white is the well-known pair just under 4.5: (1.05) / (0.18448 + 0.05) = 4.478
	near(contrasto([119, 119, 119], [255, 255, 255]), 4.478);
	// #767676 on white is the lightest grey that passes: 4.54
	near(contrasto([118, 118, 118], [255, 255, 255]), 4.542);
	// pure red on white: 1.05 / 0.2626 = 3.998
	near(contrasto([255, 0, 0], [255, 255, 255]), 3.998);
	// pure yellow on white: 1.05 / (0.9278 + 0.05) = 1.074
	near(contrasto([255, 255, 0], [255, 255, 255]), 1.074);
});

test('thresholds of level AA', () => {
	assert.deepEqual(SOGLIE.AA, { normale: 4.5, grande: 3 });
	assert.deepEqual(supera(4.5), { normale: true, grande: true });
	assert.deepEqual(supera(4.49), { normale: false, grande: true });
	assert.deepEqual(supera(2.99), { normale: false, grande: false });
	assert.deepEqual(supera(contrasto([119, 119, 119], [255, 255, 255])), { normale: false, grande: true });
});

test('a ratio is written cut, never rounded up over a threshold', () => {
	assert.equal(scriviRapporto(4.499), '4,49');
	assert.equal(scriviRapporto(21), '21,00');
	assert.equal(scriviRapporto(4.5), '4,50');
	assert.equal(scriviRapporto(1), '1,00');
});

test('media queries include their limit', () => {
	assert.equal(vale({ tipo: 'min-width', px: 600 }, 600), true);
	assert.equal(vale({ tipo: 'min-width', px: 600 }, 599), false);
	assert.equal(vale({ tipo: 'max-width', px: 599 }, 599), true);
	assert.equal(vale({ tipo: 'max-width', px: 599 }, 600), false);
});

test('the last declaration that holds wins', () => {
	const foglio = [
		{ selettore: '.contenuto', proprieta: 'flex-direction', valore: 'column' },
		{ selettore: '.contenuto', proprieta: 'flex-direction', valore: 'row', quando: { tipo: 'min-width', px: 600 } },
		{ selettore: '.concerti', proprieta: 'flex-direction', valore: 'column' },
		{ selettore: '.concerti', proprieta: 'flex-direction', valore: 'row', quando: { tipo: 'min-width', px: 900 } }
	];
	assert.equal(valori(foglio, 400).get('.contenuto|flex-direction'), 'column');
	assert.equal(valori(foglio, 600).get('.contenuto|flex-direction'), 'row');
	assert.equal(valori(foglio, 899).get('.concerti|flex-direction'), 'column');
	assert.equal(valori(foglio, 900).get('.concerti|flex-direction'), 'row');
	// the base rule written after the media query wins at every width: the mistake the lesson warns about
	const rovesciato = [foglio[1], foglio[0]];
	assert.equal(valori(rovesciato, 800).get('.contenuto|flex-direction'), 'column');
});
