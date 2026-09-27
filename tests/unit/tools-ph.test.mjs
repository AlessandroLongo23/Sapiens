// pH and pOH at 25 °C: from [H⁺] or [OH⁻], from pH or pOH, from strong acids and bases. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { ph, sci } = await jiti.import('../../src/lib/tools/ph.ts');
const { q } = await jiti.import('../../src/lib/tools/grandezze.ts');

const ok = (o) => {
	assert.ok(o.ok, o.error);
	assertReadable(o);
	return o;
};
const run = (modo, x, k = '1') => ok(ph({ modo, x, k }));
const row = (o, label) => o.rows.find((r) => r.label === label)?.value;
/** "$\\approx 2{,}60$" → 2.6; "$2{,}5 \\cdot 10^{-3}\\ \\text{mol/L}$" → 0.0025. */
function num(value) {
	const m = /\$(?:\\approx )?(-?\d+)(?:\{,\}(\d+))?(?: \\cdot 10\^\{(-?\d+)\})?/.exec(value);
	assert.ok(m, `not a number: ${value}`);
	return Number(`${m[1]}.${m[2] ?? '0'}`) * 10 ** Number(m[3] ?? 0);
}

test('scientific notation', () => {
	assert.equal(sci(q(1, 400)).tex, '2{,}5 \\cdot 10^{-3}');
	assert.equal(sci(q(1, 400)).exact, true);
	assert.equal(sci(q(4, 10n ** 12n)).tex, '4 \\cdot 10^{-12}');
	assert.equal(sci(q(2)).tex, '2');
	assert.deepEqual(sci(q(1, 3)), { tex: '3{,}33 \\cdot 10^{-1}', text: '3,33 · 10^-1', exact: false });
	assert.equal(sci(q(9999, 1000000)).tex, '9{,}999 \\cdot 10^{-3}');
	assert.equal(sci(q(99999, 10000000)).tex, '1{,}00 \\cdot 10^{-2}');
});

test('from the concentration of H⁺', () => {
	const o = run('H', '2,5e-3');
	assert.equal(row(o, 'pH'), '$\\approx 2{,}60$');
	assert.equal(row(o, 'pOH'), '$\\approx 11{,}40$');
	assert.equal(row(o, 'Concentrazione di OH⁻'), '$4 \\cdot 10^{-12}\\ \\text{mol/L}$');
	assert.equal(row(o, 'La soluzione è'), 'acida');
	assert.equal(o.copy, 'pH ≈ 2,60');
	assert.match(JSON.stringify(o.steps), /0\{,\}40 - 3/);
	const exact = run('H', '0,001');
	assert.equal(row(exact, 'pH'), '$3$');
	assert.equal(exact.copy, 'pH = 3');
	assert.equal(row(run('H', '2,5·10^-3'), 'pH'), '$\\approx 2{,}60$');
	assert.equal(row(run('H', '1e-7'), 'La soluzione è'), 'neutra');
	assert.equal(row(run('H', '1'), 'pH'), '$0$');
	// A pH of 7,00 after rounding that is still on one side.
	const near = run('H', '1,01e-7');
	assert.equal(row(near, 'pH'), '$\\approx 7{,}00$');
	assert.equal(row(near, 'La soluzione è'), 'quasi neutra, appena acida');
	assert.equal(row(run('H', '9,9e-8'), 'La soluzione è'), 'quasi neutra, appena basica');
	assert.equal(row(run('H', '1e-9'), 'La soluzione è'), 'basica');
});

test('from the concentration of OH⁻', () => {
	const o = run('OH', '1e-4');
	assert.equal(row(o, 'pOH'), '$4$');
	assert.equal(row(o, 'pH'), '$10$');
	assert.equal(row(o, 'Concentrazione di H⁺'), '$1 \\cdot 10^{-10}\\ \\text{mol/L}$');
	assert.equal(row(o, 'La soluzione è'), 'basica');
	const r = run('OH', '3e-5');
	assert.equal(row(r, 'pOH'), '$\\approx 4{,}52$');
	assert.equal(row(r, 'pH'), '$\\approx 9{,}48$');
	assert.equal(row(r, 'Concentrazione di H⁺'), '$\\approx 3{,}33 \\cdot 10^{-10}\\ \\text{mol/L}$');
});

test('from pH and pOH', () => {
	const o = run('pH', '3,7');
	assert.equal(row(o, 'Concentrazione di H⁺'), '$\\approx 2{,}00 \\cdot 10^{-4}\\ \\text{mol/L}$');
	assert.equal(row(o, 'Concentrazione di OH⁻'), '$\\approx 5{,}01 \\cdot 10^{-11}\\ \\text{mol/L}$');
	assert.equal(row(o, 'pOH'), '$10{,}3$');
	assert.equal(o.copy, '[H⁺] ≈ 2,00 · 10^-4 mol/L');
	assert.match(JSON.stringify(o.steps), /10\^\{0\{,\}3\} \\\\cdot 10\^\{-4\}/);
	const seven = run('pH', '7');
	assert.equal(row(seven, 'La soluzione è'), 'neutra');
	assert.equal(row(seven, 'Concentrazione di H⁺'), '$1 \\cdot 10^{-7}\\ \\text{mol/L}$');
	const p = run('pOH', '4,2');
	assert.equal(row(p, 'pH'), '$9{,}8$');
	assert.equal(row(p, 'La soluzione è'), 'basica');
	assert.equal(row(run('pH', '-0,5'), 'Concentrazione di H⁺'), '$\\approx 3{,}16\\ \\text{mol/L}$');
	assert.equal(row(run('pH', '0'), 'Concentrazione di H⁺'), '$1\\ \\text{mol/L}$');
});

test('strong acids and bases', () => {
	const a = run('acido', '0,01');
	assert.equal(row(a, 'pH'), '$2$');
	assert.match(JSON.stringify(a.steps), /si dissocia del tutto/);
	assert.equal(row(run('acido', '0,05', '2'), 'pH'), '$1$');
	assert.equal(row(run('acido', '0,002'), 'pH'), '$\\approx 2{,}70$');
	const b = run('base', '0,005', '2');
	assert.equal(row(b, 'pH'), '$12$');
	assert.equal(row(b, 'pOH'), '$2$');
	assert.equal(row(run('base', '0,1'), 'pH'), '$13$');
	const neg = run('acido', '2');
	assert.equal(row(neg, 'pH'), '$\\approx -0{,}30$');
	assert.match(JSON.stringify(neg.steps), /negativo/);
	// Too dilute: water counts, and the tool says so.
	const dilute = ph({ modo: 'acido', x: '1e-8', k: '1' });
	assert.equal(dilute.ok, false);
	assert.match(dilute.error, /diluita/);
	assertReadable(dilute);
	assert.equal(ph({ modo: 'base', x: '5e-7', k: '2' }).ok, true);
});

test('inputs that are not right', () => {
	const bad = [
		['H', ''],
		['H', 'abc'],
		['H', '0'],
		['H', '-0,001'],
		['H', '20'],
		['H', '1e-16'],
		['OH', '0'],
		['pH', ''],
		['pH', '16'],
		['pH', '-2'],
		['pH', '3,12345'],
		['acido', '0'],
		['base', '1e-7']
	];
	for (const [modo, x] of bad) {
		const o = ph({ modo, x, k: '1' });
		assert.equal(o.ok, false, `${modo} ${x}`);
		assertReadable(o);
	}
	// An unknown mode falls back to [H⁺].
	assert.equal(ph({ modo: 'boh', x: '1e-3', k: '1' }).copy, 'pH = 3');
});

test('brute force: pH + pOH = 14, [H⁺][OH⁻] = Kw, and the round trip', () => {
	for (let i = 0; i < 400; i++) {
		const mant = (1 + Math.floor(Math.random() * 90)) / 10;
		const e = -1 - Math.floor(Math.random() * 13);
		const x = mant * 10 ** e;
		const modo = Math.random() < 0.5 ? 'H' : 'OH';
		const o = run(modo, `${String(mant).replace('.', ',')}e${e}`);
		const pH = num(row(o, 'pH'));
		const pOH = num(row(o, 'pOH'));
		assert.ok(Math.abs(pH + pOH - 14) < 1e-9, `${x}: ${pH} + ${pOH}`);
		const exact = -Math.log10(x);
		const mine = modo === 'H' ? pH : pOH;
		assert.ok(Math.abs(mine - exact) <= 0.005 + 1e-9, `${modo} ${x}: ${mine} vs ${exact}`);
		const cH = num(row(o, 'Concentrazione di H⁺'));
		const cOH = num(row(o, 'Concentrazione di OH⁻'));
		assert.ok(Math.abs((cH * cOH) / 1e-14 - 1) < 0.01, `${x}: ${cH} · ${cOH}`);
		// Back from the pH: the same concentration, to the precision of two decimals of log.
		const back = run('pH', row(o, 'pH').replace(/\$|\\approx /g, '').replace('{,}', ','));
		const again = num(row(back, 'Concentrazione di H⁺'));
		assert.ok(Math.abs(Math.log10(again) - Math.log10(cH)) <= 0.008, `${x}: ${again} vs ${cH}`);
	}
});
