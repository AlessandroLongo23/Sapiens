// Surfaces and volumes of the solids, and area and perimeter of the regular polygons: every mode, exact forms,
// brute force against the formulas, round trips and wrong inputs.
// Run with `node --test tests/unit/tools-solidi.test.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';
import { checkReadable, stepsText } from './geometry-readability.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { solido, SOLIDS, SOLID_EXAMPLES, PRISM_BASES, cbrt, plus, valueText } = await jiti.import('../../src/lib/tools/solidi.ts');
const { poligonoRegolare, POLYGONS, POLYGON_MODES, POLYGON_EXAMPLES } = await jiti.import('../../src/lib/tools/poligoni-regolari.ts');
const { int, sqrt, mul, PI } = await jiti.import('../../src/lib/tools/geometria.ts');

/** The measures of a result, read back from the copy text: "Volume = 36π cm³ ≈ 113,10 cm³" → { Volume: 113.1 }. */
function measures(res) {
	assert.ok(res.outcome.ok, res.outcome.error);
	const out = {};
	for (const part of res.outcome.copy.split('; ')) {
		const [, name, rest] = /^(.+?) [=≈] ?(.*)$/.exec(part);
		const last = rest.includes('≈') ? rest.slice(rest.lastIndexOf('≈') + 1) : rest;
		const n = Number(last.replace(/ (mm|cm|dm|m|km)[²³]?$/, '').replace(/\s/g, '').replace(',', '.'));
		assert.ok(Number.isFinite(n), `not a number: ${part}`);
		out[name] = n;
	}
	return out;
}

// Results are rounded to two decimals, as at school.
const close = (actual, expected, what = '') => assert.ok(Math.abs(actual - expected) <= 5e-3 + 1e-9 * Math.abs(expected), `${what}: ${actual} ≠ ${expected}`);
const it = (n) => String(n).replace('.', ',');
const bad = (res, pattern) => {
	assert.equal(res.outcome.ok, false, res.outcome.copy);
	if (pattern) assert.match(res.outcome.error, pattern);
};
const readable = (outcome, where) => {
	assertReadable(outcome, where);
	checkReadable(outcome, where);
};

test('exact values: cube roots and sums that stay sums', () => {
	assert.equal(valueText(cbrt(int(343))), '7');
	assert.equal(valueText(cbrt(mul(int(27), mul(PI, mul(PI, PI))))), '3π ≈ 9,42');
	assert.equal(valueText(cbrt(int(100))), '≈ 4,64');
	assert.equal(valueText(plus(int(180), mul(int(18), sqrt(int(3)))), 'cm', 2), '(180 + 18√3) cm² ≈ 211,18 cm²');
	assert.equal(valueText(plus(int(180), int(20)), 'cm', 2), '200 cm²');
});

test('every mode opens on a correct, readable example, and every clickable example works', () => {
	for (const [solid, spec] of Object.entries(SOLIDS)) {
		for (const mode of spec.modes) {
			for (const base of solid === 'prisma' ? PRISM_BASES.map((b) => b.value) : [undefined]) {
				const res = solido(solid, mode.value, mode.example, 'cm', base);
				const where = `${solid}/${mode.value}${base ? `/${base}` : ''}`;
				readable(res.outcome, where);
				assert.ok(res.sketch && res.sketch.silhouette.length > 2, `${where} has a drawing`);
				for (const e of res.sketch.edges) assert.ok([...e.from, ...e.to].every(Number.isFinite), `${where}: finite drawing`);
				readable(solido(solid, mode.value, mode.example, '', base).outcome, `${where} without unit`);
			}
		}
		for (const ex of SOLID_EXAMPLES[solid]) readable(solido(solid, ex.mode, ex.values, 'cm', ex.base).outcome, `${solid} ${ex.label}`);
	}
	for (const p of POLYGONS)
		for (const m of POLYGON_MODES) {
			const res = poligonoRegolare(p.n, m.value, m.example, 'cm');
			readable(res.outcome, `${p.name}/${m.value}`);
			assert.ok(res.sketch.outline.length === p.n);
		}
	for (const ex of POLYGON_EXAMPLES) {
		const res = poligonoRegolare(ex.n, ex.mode, ex, 'cm');
		readable(res.outcome, ex.label);
		assert.doesNotMatch(stepsText(res.outcome) + JSON.stringify(res.outcome.steps), /Attenzione/, ex.label);
	}
});

test('cube: every measure from the edge, and back to the edge from the others', () => {
	for (let i = 1; i <= 40; i++) {
		const l = i / 2;
		const m = measures(solido('cubo', 'spigolo', { a: it(l) }));
		close(m['Area laterale'], 4 * l * l, 'A_l');
		close(m['Area totale'], 6 * l * l, 'A_t');
		close(m.Volume, l ** 3, 'V');
		close(m.Diagonale, l * Math.sqrt(3), 'd');
		close(measures(solido('cubo', 'volume', { a: it(l ** 3) })).Spigolo, l, 'l from V');
		close(measures(solido('cubo', 'area', { a: it(6 * l * l) })).Spigolo, l, 'l from A_t');
		close(measures(solido('cubo', 'diagonale', { a: it(l) })).Spigolo, l / Math.sqrt(3), 'l from d');
	}
	const r = solido('cubo', 'spigolo', { a: '5' }, 'cm').outcome;
	assert.equal(r.copy, 'Area laterale = 100 cm²; Area totale = 150 cm²; Volume = 125 cm³; Diagonale = 5√3 cm ≈ 8,66 cm');
	assert.deepEqual(r.steps[3].math, ['V = l^3', '= 5^3', '= \\hl{125\\,\\text{cm}^3}']);
	// A volume that is not a cube: the edge is a decimal, and the steps say so.
	const v = solido('cubo', 'volume', { a: '100' }, 'cm').outcome;
	assert.match(v.rows[0].value, /\\approx 4\{,\}64/);
	assert.match(stepsText(v) + v.steps[0].then, /arrotondato/);
	assert.equal(solido('cubo', 'volume', { a: '343' }).outcome.steps[0].math.includes('= \\sqrt[3]{7^3}'), true);
});

test('rectangular box: three dimensions, volume and diagonal back to the height', () => {
	for (let a = 1; a <= 9; a++)
		for (let b = 1; b <= 9; b += 2)
			for (let c = 1; c <= 9; c += 2) {
				const m = measures(solido('parallelepipedo', 'dimensioni', { a: it(a), b: it(b), c: it(c) }));
				close(m['Area laterale'], 2 * (a + b) * c, 'A_l');
				close(m['Area totale'], 2 * (a * b + b * c + a * c), 'A_t');
				close(m.Volume, a * b * c, 'V');
				close(m.Diagonale, Math.hypot(a, b, c), 'd');
				close(measures(solido('parallelepipedo', 'volume', { a: it(a), b: it(b), c: it(a * b * c) })).Altezza, c, 'c from V');
				close(measures(solido('parallelepipedo', 'diagonale', { a: it(a), b: it(b), c: it(Math.round(Math.hypot(a, b, c) * 1e4) / 1e4) })).Altezza, c, 'c from d');
			}
	assert.match(stepsText(solido('parallelepipedo', 'dimensioni', { a: '4', b: '4', c: '4' }).outcome) + JSON.stringify(solido('parallelepipedo', 'dimensioni', { a: '4', b: '4', c: '4' }).outcome.steps), /cubo/);
	bad(solido('parallelepipedo', 'diagonale', { a: '3', b: '4', c: '5' }), /diagonale è troppo corta/);
	bad(solido('parallelepipedo', 'diagonale', { a: '3', b: '4', c: '4' }));
	const steps = solido('parallelepipedo', 'dimensioni', { a: '8', b: '6', c: '5' }).outcome.steps;
	assert.equal(steps.length, 6);
	assert.ok(steps[0].group, 'six steps are grouped');
});

test('right prism: square, triangular and hexagonal base', () => {
	const area = { quadrato: (l) => l * l, triangolo: (l) => (l * l * Math.sqrt(3)) / 4, esagono: (l) => (3 * Math.sqrt(3) * l * l) / 2 };
	const sides = { quadrato: 4, triangolo: 3, esagono: 6 };
	for (const base of Object.keys(area))
		for (let l = 1; l <= 12; l++)
			for (let h = 1; h <= 15; h += 2) {
				const m = measures(solido('prisma', 'lati', { a: it(l), b: it(h) }, '', base));
				const Ab = area[base](l);
				close(m['Area di base'], Ab, `${base} A_b`);
				close(m['Area laterale'], sides[base] * l * h, `${base} A_l`);
				close(m['Area totale'], sides[base] * l * h + 2 * Ab, `${base} A_t`);
				close(m.Volume, Ab * h, `${base} V`);
				close(measures(solido('prisma', 'volume', { a: it(l), b: it(Math.round(Ab * h * 1e4) / 1e4) }, '', base)).Altezza, h, `${base} h from V`);
			}
	const tri = solido('prisma', 'lati', { a: '6', b: '10' }, 'cm', 'triangolo').outcome;
	assert.equal(tri.rows[2].value, '$A_t = \\left(180 + 18\\sqrt{3}\\right)\\,\\text{cm}^2$ $\\approx 211{,}18\\,\\text{cm}^2$');
	assert.match(stepsText(solido('prisma', 'lati', { a: '5', b: '5' }, '', 'quadrato').outcome) + JSON.stringify(solido('prisma', 'lati', { a: '5', b: '5' }, '', 'quadrato').outcome.steps), /cubo/);
});

test('square pyramid: height, apothem and lateral edge by Pythagoras, in every direction', () => {
	for (let l = 2; l <= 20; l += 2)
		for (let h = 1; h <= 15; h++) {
			const a = Math.hypot(h, l / 2);
			const s = Math.hypot(a, l / 2);
			const m = measures(solido('piramide', 'altezza', { a: it(l), b: it(h) }));
			close(m.Apotema, a, 'a');
			close(m['Spigolo laterale'], s, 's');
			close(m['Area laterale'], 2 * l * a, 'A_l');
			close(m['Area totale'], 2 * l * a + l * l, 'A_t');
			close(m.Volume, (l * l * h) / 3, 'V');
			if (Number.isInteger(a)) {
				close(measures(solido('piramide', 'apotema', { a: it(l), b: it(a) })).Altezza, h, 'h from a');
				close(measures(solido('piramide', 'altezza-apotema', { a: it(h), b: it(a) }))['Lato di base'], l, 'l from h and a');
			}
			if (Number.isInteger(s)) close(measures(solido('piramide', 'spigolo', { a: it(l), b: it(s) })).Altezza, h, 'h from s');
		}
	const r = solido('piramide', 'altezza', { a: '12', b: '8' }, 'cm').outcome;
	assert.equal(r.copy, 'Apotema = 10 cm; Spigolo laterale = 2√34 cm ≈ 11,66 cm; Area laterale = 240 cm²; Area totale = 384 cm²; Volume = 384 cm³');
	assert.deepEqual(r.steps[1].math, ['a = \\sqrt{h^2 + \\left(\\dfrac{l}{2}\\right)^2}', '= \\sqrt{8^2 + 6^2}', '= \\sqrt{64 + 36}', '= \\sqrt{100}', '= \\hl{10\\,\\text{cm}}']);
	assert.ok(r.steps[0].group && r.steps.length > 5);
	bad(solido('piramide', 'apotema', { a: '10', b: '5' }), /metà lato/);
	bad(solido('piramide', 'apotema', { a: '10', b: '4' }), /metà lato/);
	// Lateral edge equal to half the diagonal of the base: a flat pyramid.
	bad(solido('piramide', 'spigolo', { a: '6', b: '4' }), /metà diagonale/);
	bad(solido('piramide', 'spigolo', { a: '2', b: '1,4142' }), /metà diagonale/);
	bad(solido('piramide', 'altezza-apotema', { a: '13', b: '12' }), /più lungo dell'altezza/);
});

test('cylinder: radius or diameter and height, volume back to the height, with π exact', () => {
	for (let r = 1; r <= 15; r++)
		for (let h = 1; h <= 15; h += 2) {
			const m = measures(solido('cilindro', 'raggio', { a: it(r), b: it(h) }));
			close(m['Area di base'], Math.PI * r * r, 'A_b');
			close(m['Area laterale'], 2 * Math.PI * r * h, 'A_l');
			close(m['Area totale'], 2 * Math.PI * r * (h + r), 'A_t');
			close(m.Volume, Math.PI * r * r * h, 'V');
			close(measures(solido('cilindro', 'diametro', { a: it(2 * r), b: it(h) })).Volume, Math.PI * r * r * h, 'V from d');
			close(measures(solido('cilindro', 'volume', { a: it(r), b: `${r * r * h}π` })).Altezza, h, 'h from V with π');
			close(measures(solido('cilindro', 'volume', { a: it(r), b: it(Math.round(Math.PI * r * r * h * 1e4) / 1e4) })).Altezza, h, 'h from decimal V');
		}
	assert.equal(solido('cilindro', 'raggio', { a: '3', b: '10' }, 'cm').outcome.copy, 'Area di base = 9π cm² ≈ 28,27 cm²; Area laterale = 60π cm² ≈ 188,50 cm²; Area totale = 78π cm² ≈ 245,04 cm²; Volume = 90π cm³ ≈ 282,74 cm³');
	assert.equal(measures(solido('cilindro', 'volume', { a: '5', b: '300pi' })).Altezza, 12);
	assert.equal(solido('cilindro', 'volume', { a: '5', b: '500' }).outcome.rows[0].value, '$h = \\dfrac{20}{\\pi}$ $\\approx 6{,}37$');
});

test('cone: apothem by Pythagoras, height from the apothem or the volume', () => {
	for (let r = 1; r <= 12; r++)
		for (let h = 1; h <= 12; h++) {
			const a = Math.hypot(r, h);
			const m = measures(solido('cono', 'altezza', { a: it(r), b: it(h) }));
			close(m.Apotema, a, 'a');
			close(m['Area laterale'], Math.PI * r * a, 'A_l');
			close(m['Area totale'], Math.PI * r * (a + r), 'A_t');
			close(m.Volume, (Math.PI * r * r * h) / 3, 'V');
			if (Number.isInteger(a)) close(measures(solido('cono', 'apotema', { a: it(r), b: it(a) })).Altezza, h, 'h from a');
			if ((r * r * h) % 3 === 0) {
				const V = measures(solido('cono', 'volume', { a: it(r), b: `${(r * r * h) / 3}π` }));
				close(V.Altezza, h, 'h from V');
				close(V.Apotema, a, 'a from V');
			}
		}
	// The lateral area with a radical apothem, and a total area that stays a sum.
	const r = solido('cono', 'altezza', { a: '5', b: '10' }).outcome;
	assert.match(r.copy, /Area laterale = 25√5π ≈ 175,62/);
	assert.match(r.copy, /Area totale = 25√5π \+ 25π ≈ 254,16/);
	bad(solido('cono', 'apotema', { a: '5', b: '5' }), /più lungo del raggio/);
	bad(solido('cono', 'apotema', { a: '5', b: '3' }), /più lungo del raggio/);
});

test('sphere: from radius, diameter, surface and volume', () => {
	for (let i = 1; i <= 40; i++) {
		const r = i / 2;
		const m = measures(solido('sfera', 'raggio', { a: it(r) }));
		close(m['Superficie sferica'], 4 * Math.PI * r * r, 'S');
		close(m.Volume, (4 / 3) * Math.PI * r ** 3, 'V');
		close(measures(solido('sfera', 'diametro', { a: it(2 * r) })).Raggio, r, 'r from d');
		close(measures(solido('sfera', 'superficie', { a: `${it(4 * r * r)}π` })).Raggio, r, 'r from S');
		close(measures(solido('sfera', 'superficie', { a: it(Math.round(4 * Math.PI * r * r * 1e4) / 1e4) })).Raggio, r, 'r from decimal S');
		close(measures(solido('sfera', 'volume', { a: it(Math.round(((4 / 3) * Math.PI * r ** 3) * 1e4) / 1e4) })).Raggio, r, 'r from decimal V');
	}
	for (let r = 1; r <= 20; r++) {
		const V = solido('sfera', 'volume', { a: `${(4 * r ** 3) / 3}π` }).outcome;
		if (Number.isInteger((4 * r ** 3) / 3)) assert.equal(V.rows[0].value, `$r = ${r}$`, `r = ${r} exact from V`);
	}
	assert.equal(solido('sfera', 'raggio', { a: '6' }, 'cm').outcome.copy, 'Superficie sferica = 144π cm² ≈ 452,39 cm²; Volume = 288π cm³ ≈ 904,78 cm³');
	assert.match(solido('sfera', 'diametro', { a: '10' }).outcome.copy, /Volume = 500π\/3 ≈ 523,60/);
	assert.match(JSON.stringify(solido('sfera', 'volume', { a: '1000' }).outcome.steps), /arrotondato/);
});

test('wrong inputs give a sentence that says what to write', () => {
	bad(solido('cubo', 'spigolo', { a: '' }), /Scrivi lo spigolo/);
	bad(solido('cubo', 'spigolo', { a: '0' }), /maggiore di zero/);
	bad(solido('cubo', 'spigolo', { a: '-3' }), /maggiore di zero/);
	bad(solido('cubo', 'spigolo', { a: 'abc' }), /scrivi un numero/);
	bad(solido('cubo', 'spigolo', { a: '200000' }), /100 000/);
	bad(solido('cubo', 'volume', { a: '2000000000' }), /1 000 000 000/);
	bad(solido('cubo', 'spigolo', { a: '1,23456' }), /quattro cifre/);
	bad(solido('cilindro', 'raggio', { a: '3', b: '10π' }), /scrivi un numero/);
	bad(solido('parallelepipedo', 'dimensioni', { a: '3', b: '', c: '5' }), /larghezza/);
	// Large but valid measures fall back to decimals, never to an error or a wrong exact value.
	const big = measures(solido('cubo', 'spigolo', { a: '99999,9999' }));
	close(big.Volume / 1e15, 99999.9999 ** 3 / 1e15, 'large V');
	const sphere = measures(solido('sfera', 'raggio', { a: '12345,6789' }));
	assert.ok(Math.abs(sphere.Volume / ((4 / 3) * Math.PI * 12345.6789 ** 3) - 1) < 1e-9);
	for (const bigSolid of ['parallelepipedo', 'prisma', 'piramide', 'cono']) {
		const spec = SOLIDS[bigSolid].modes[0];
		const vals = Object.fromEntries(spec.fields.map((f) => [f.key, '87654,3219']));
		assert.ok(solido(bigSolid, spec.value, vals).outcome.ok, bigSolid);
	}
});

test('regular polygons: the fixed number, the apothem, the exact triangle, square and hexagon', () => {
	const fixed = Object.fromEntries(POLYGONS.map((p) => [p.n, Number(p.f.replace(',', '.'))]));
	for (const p of POLYGONS) {
		// The books' fixed numbers, checked against 1 / (2 tan(180°/n)).
		assert.ok(Math.abs(fixed[p.n] - 1 / (2 * Math.tan(Math.PI / p.n))) < 6e-4, `f of ${p.name}`);
		for (let l = 1; l <= 30; l++) {
			const m = measures(poligonoRegolare(p.n, 'lato', { a: it(l) }));
			close(m['2p'], p.n * l, '2p');
			const exact = [3, 4, 6].includes(p.n);
			const a = exact ? l / (2 * Math.tan(Math.PI / p.n)) : Math.round(l * fixed[p.n] * 100) / 100;
			close(m.a, a, `a ${p.name} l = ${l}`);
			close(m.A, exact ? (p.n * l * a) / 2 : Math.round(((p.n * l * a) / 2) * 100) / 100, `A ${p.name}`);
			const back = measures(poligonoRegolare(p.n, 'apotema', { b: it(Math.round(l * (exact ? 1 / (2 * Math.tan(Math.PI / p.n)) : fixed[p.n]) * 1e4) / 1e4) }));
			assert.ok(Math.abs(back.l - l) <= 0.01 + 1e-9, `l from a ${p.name}: ${back.l} ≠ ${l}`);
			const both = measures(poligonoRegolare(p.n, 'lato-apotema', { a: it(l), b: it(3) }));
			close(both.A, (p.n * l * 3) / 2, 'A from l and a');
		}
	}
	assert.equal(poligonoRegolare(5, 'lato', { a: '10' }, 'cm').outcome.copy, '2p = 50 cm; a ≈ 6,88 cm; A ≈ 172,00 cm²');
	assert.equal(poligonoRegolare(6, 'lato', { a: '4' }, 'cm').outcome.copy, '2p = 24 cm; a = 2√3 cm ≈ 3,46 cm; A = 24√3 cm² ≈ 41,57 cm²');
	assert.equal(poligonoRegolare(3, 'apotema', { b: '3' }).outcome.copy, 'l = 6√3 ≈ 10,39; 2p = 18√3 ≈ 31,18; A = 27√3 ≈ 46,77');
	assert.match(JSON.stringify(poligonoRegolare(8, 'lato', { a: '5' }).outcome.steps), /dell'ottagono/);
	// Data that do not belong to that polygon are computed, with a warning.
	assert.match(JSON.stringify(poligonoRegolare(5, 'lato-apotema', { a: '10', b: '3' }).outcome.steps), /Attenzione/);
	assert.equal(poligonoRegolare(11, 'lato', { a: '5' }).outcome.ok, false);
	assert.match(poligonoRegolare(5, 'lato', { a: '' }).outcome.error, /Scrivi il lato/);
	assert.match(poligonoRegolare(5, 'apotema', { b: '0' }).outcome.error, /maggiore di zero/);
});
