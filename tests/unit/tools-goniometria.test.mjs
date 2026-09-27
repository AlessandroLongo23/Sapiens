// Sine, cosine, tangent and cotangent: exact values for the notable angles and their associates, decimals otherwise.
// Run with `node --test tests/unit/tools-goniometria.test.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { funzioniGoniometriche, exactTrig } = await jiti.import('../../src/lib/tools/goniometria.ts');
const { q } = await jiti.import('../../src/lib/exercises/v2/rational.ts');

const run = (v, u = 'gradi') => {
	const r = funzioniGoniometriche(v, u);
	assert.ok(r.outcome.ok, `${v} ${u}: ${r.outcome.error}`);
	return r;
};

/** The four values of the copy text as numbers, null where the function does not exist. */
function values(copy) {
	return copy.split('; ').map((item) => {
		if (item.endsWith('non esiste')) return null;
		const s = item.includes('≈') ? item.slice(item.lastIndexOf('≈') + 1) : item.slice(item.lastIndexOf('=') + 1);
		const t = s.trim().replace(/\s/g, '').replace(',', '.');
		const m = /^(-?)(\d+(?:\.\d+)?)\/(\d+)$/.exec(t);
		return m ? (m[1] ? -1 : 1) * (Number(m[2]) / Number(m[3])) : Number(t);
	});
}

const close = (a, b, tol, what) => assert.ok(Math.abs(a - b) <= tol, `${what}: ${a} ≠ ${b}`);

/** Checks the four values against Math, within the rounding of four decimals. */
function checkAgainstMath(copy, rad, what) {
	const [s, c, t, k] = values(copy);
	close(s, Math.sin(rad), 5e-5, `${what} sin`);
	close(c, Math.cos(rad), 5e-5, `${what} cos`);
	const tan = Math.sin(rad) / Math.cos(rad);
	const cot = Math.cos(rad) / Math.sin(rad);
	if (Math.abs(Math.cos(rad)) < 1e-12) assert.equal(t, null, `${what} tg`);
	else close(t, tan, Math.abs(tan) >= 1e4 ? 0.5 : 5e-5, `${what} tg`);
	if (Math.abs(Math.sin(rad)) < 1e-12) assert.equal(k, null, `${what} cotg`);
	else close(k, cot, Math.abs(cot) >= 1e4 ? 0.5 : 5e-5, `${what} cotg`);
}

test('the notable angles and their associates are exact', () => {
	assert.equal(run('150').outcome.copy, 'sin 150° = 1/2; cos 150° = -√3/2 ≈ -0,866; tg 150° = -√3/3 ≈ -0,5774; cotg 150° = -√3 ≈ -1,7321');
	assert.equal(run('30').outcome.copy, 'sin 30° = 1/2; cos 30° = √3/2 ≈ 0,866; tg 30° = √3/3 ≈ 0,5774; cotg 30° = √3 ≈ 1,7321');
	assert.equal(run('45').outcome.copy, 'sin 45° = √2/2 ≈ 0,7071; cos 45° = √2/2 ≈ 0,7071; tg 45° = 1; cotg 45° = 1');
	assert.equal(run('210').outcome.copy, 'sin 210° = -1/2; cos 210° = -√3/2 ≈ -0,866; tg 210° = √3/3 ≈ 0,5774; cotg 210° = √3 ≈ 1,7321');
	assert.equal(run('300').outcome.copy, 'sin 300° = -√3/2 ≈ -0,866; cos 300° = 1/2; tg 300° = -√3 ≈ -1,7321; cotg 300° = -√3/3 ≈ -0,5774');
	assert.equal(run('90').outcome.copy, 'sin 90° = 1; cos 90° = 0; tg 90° non esiste; cotg 90° = 0');
	assert.equal(run('0').outcome.copy, 'sin 0° = 0; cos 0° = 1; tg 0° = 0; cotg 0° non esiste');
	assert.equal(run('180').outcome.copy, 'sin 180° = 0; cos 180° = -1; tg 180° = 0; cotg 180° non esiste');
	assert.equal(run('-45').outcome.copy, 'sin(-45°) = -√2/2 ≈ -0,7071; cos(-45°) = √2/2 ≈ 0,7071; tg(-45°) = -1; cotg(-45°) = -1');
	assert.equal(run('5π/6', 'rad').outcome.copy, 'sin 5π/6 = 1/2; cos 5π/6 = -√3/2 ≈ -0,866; tg 5π/6 = -√3/3 ≈ -0,5774; cotg 5π/6 = -√3 ≈ -1,7321');
	assert.equal(run('3pi/2', 'rad').outcome.copy, 'sin 3π/2 = -1; cos 3π/2 = 0; tg 3π/2 non esiste; cotg 3π/2 = 0');
	assert.match(run('150').outcome.rows[1].value, /\\cos 150\^\\circ = -\\dfrac\{\\sqrt\{3\}\}\{2\}/);
});

test('the steps reduce to the first quadrant with the signs of the quadrant', () => {
	const text = (o) => o.steps.flatMap((s) => [s.say, ...(s.math ?? []), s.then ?? '']).join(' ');
	const t150 = text(run('150').outcome);
	assert.match(t150, /secondo quadrante/);
	assert.match(t150, /150\^\\circ = 180\^\\circ - \\hl\{30\^\\circ\}/);
	assert.match(t150, /\\cos\(180\^\\circ - \\beta\) = -\\cos \\beta/);
	assert.match(t150, /moltiplica sopra e sotto/);
	const t210 = text(run('210').outcome);
	assert.match(t210, /terzo quadrante/);
	assert.match(t210, /\\sin\(180\^\\circ \+ \\beta\) = -\\sin \\beta/);
	assert.match(text(run('315').outcome), /\\cos\(360\^\\circ - \\beta\) = \\cos \\beta/);
	assert.match(text(run('750').outcome), /750\^\\circ - 2 \\cdot 360\^\\circ = \\hl\{30\^\\circ\}/);
	assert.match(text(run('-3π/4', 'rad').outcome), /-\\dfrac\{3\\pi\}\{4\} \+ 2\\pi = \\hl\{\\dfrac\{5\\pi\}\{4\}\}/);
	assert.match(text(run('90').outcome), /semiasse positivo delle \$y\$/);
	assert.match(text(run('40').outcome), /calcolatrice in modalità DEG/);
	assert.match(text(run('1', 'rad').outcome), /calcolatrice in modalità RAD/);
});

test('every angle agrees with Math.sin and Math.cos', () => {
	for (let d = -720; d <= 720; d += 7.5) {
		const v = String(d).replace('.', ',');
		checkAgainstMath(run(v).outcome.copy, (d * Math.PI) / 180, `${v}°`);
	}
	for (let d = -400; d <= 400; d += 13.37) {
		const v = d.toFixed(2).replace('.', ',');
		checkAgainstMath(run(v).outcome.copy, (Number(d.toFixed(2)) * Math.PI) / 180, `${v}°`);
	}
	for (let n = -25; n <= 25; n++)
		for (const den of [1, 2, 3, 4, 6, 12]) {
			const v = `${n}π/${den}`;
			checkAgainstMath(run(v, 'rad').outcome.copy, (n / den) * Math.PI, v);
		}
	for (let x = -8; x <= 8; x += 0.3) {
		const v = x.toFixed(1).replace('.', ',');
		checkAgainstMath(run(v, 'rad').outcome.copy, Number(x.toFixed(1)), `${v} rad`);
	}
	// Close to a right angle the tangent is huge; it is still right to the unit.
	checkAgainstMath(run('89,9999').outcome.copy, (89.9999 * Math.PI) / 180, '89,9999°');
	checkAgainstMath(run('1,5708', 'rad').outcome.copy, 1.5708, '1,5708 rad');
});

test('exact exactly on multiples of 30° and 45°', () => {
	for (let d = -720; d <= 720; d += 15) {
		const e = exactTrig(q(d));
		const notable = d % 30 === 0 || d % 45 === 0;
		assert.equal(!!e, notable, `${d}`);
		if (e) {
			close(e.sin.x, Math.sin((d * Math.PI) / 180), 1e-12, `${d} sin`);
			close(e.cos.x, Math.cos((d * Math.PI) / 180), 1e-12, `${d} cos`);
		}
		const rows = run(String(d))
			.outcome.rows.map((r) => r.value)
			.join(' ');
		assert.equal(/\$\\sin[^$]* \\approx/.test(rows), !notable, `${d}: ${rows}`);
	}
});

test('the drawing of the unit circle', () => {
	const { circle } = run('150');
	assert.ok(Math.abs(circle.turn - (5 * Math.PI) / 6) < 1e-12);
	assert.ok(Math.abs(circle.cos + Math.sqrt(3) / 2) < 1e-12);
	const neg = run('-90').circle;
	assert.ok(Math.abs(neg.turn - (3 * Math.PI) / 2) < 1e-12);
	for (let d = -1000; d <= 1000; d += 37) {
		const t = run(String(d)).circle.turn;
		assert.ok(t >= 0 && t < 2 * Math.PI, `${d}: ${t}`);
	}
});

test('every string typesets and every sentence is short', () => {
	for (const v of [
		'150',
		'30',
		'45',
		'60',
		'90',
		'120',
		'135',
		'180',
		'210',
		'225',
		'240',
		'270',
		'300',
		'315',
		'330',
		'0',
		'360',
		'-30',
		'-150',
		'750',
		'40',
		'22,5',
		"22° 30' 15''",
		'-100',
		'89,9999'
	])
		assertReadable(run(v).outcome, v);
	for (const v of ['π/6', '5π/6', '-3π/4', '3π/2', '7π/3', '0', '1', '-2,5', '7', 'π/8', '11π/6']) assertReadable(run(v, 'rad').outcome, `${v} rad`);
	for (const v of ['', 'abc', '1e9']) assertReadable(funzioniGoniometriche(v, 'gradi').outcome, v);
});

test('wrong input', () => {
	assert.equal(funzioniGoniometriche('', 'gradi').outcome.ok, false);
	assert.equal(funzioniGoniometriche('abc', 'gradi').outcome.ok, false);
	assert.equal(funzioniGoniometriche('π/0', 'rad').outcome.ok, false);
	assert.equal(funzioniGoniometriche('30', 'giri').outcome.ok, false);
	assert.equal(funzioniGoniometriche('9999999', 'gradi').outcome.ok, false);
	assert.equal(funzioniGoniometriche('1,1234567', 'gradi').outcome.ok, false);
	assert.equal(funzioniGoniometriche('99999', 'rad').outcome.ok, false);
	assert.match(funzioniGoniometriche('abc', 'rad').outcome.error, /per esempio/);
});
