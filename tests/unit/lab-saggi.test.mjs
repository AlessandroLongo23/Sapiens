// The flame tests' chemistry (src/lib/lab/saggi.ts): what the loop carries, what the flame shows, what counts as seen.
// Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { ANSWERS, CLEAN, IONS, ION_ORDER, X_CHOICES, apply, dirt, emission, initial, isClean, tainted, truth, verdict } = await jiti.import('../../src/lib/lab/saggi.ts');

/** `sec` seconds in the lit flame, a sixtieth at a time. */
const burn = (s, sec) => {
	for (let i = 0; i < sec * 60; i++) apply(s, { type: 'flame', dt: 1 / 60, lit: true });
};
const clean = (s) => {
	apply(s, { type: 'acid' });
	burn(s, 12);
};
const hue = ([r, g, b]) => {
	const mx = Math.max(r, g, b);
	const mn = Math.min(r, g, b);
	const h = mx === r ? ((g - b) / (mx - mn)) % 6 : mx === g ? (b - r) / (mx - mn) + 2 : (r - g) / (mx - mn) + 4;
	return (h * 60 + 360) % 360;
};

test('a loop that has been handled burns yellow, and only acid and flame make it clean', () => {
	const s = initial(1);
	assert.equal(isClean(s), false);
	assert.equal(emission(s, 1).dominant, 'Na');
	assert.equal(verdict(s, emission(s, 1)).kind, 'dirty');
	clean(s);
	assert.equal(isClean(s), true);
	assert.equal(emission(s, 1).amount, 0);
	assert.equal(verdict(s, emission(s, 1)).kind, 'none');
});

test('each salt on a clean, wet loop gives its own colour and counts as seen', () => {
	for (const id of ION_ORDER) {
		const s = initial(1);
		clean(s);
		apply(s, { type: 'acid' });
		const ev = apply(s, { type: 'touch', sample: id });
		assert.deepEqual(ev, [{ type: 'picked', sample: id, dry: false }]);
		const em = emission(s, 1);
		assert.equal(em.dominant, id);
		em.color.forEach((c, k) => assert.ok(Math.abs(c - IONS[id].color[k]) < 1e-9));
		assert.deepEqual(verdict(s, em), { kind: 'pure', sample: id });
	}
});

test('the seven colours are far enough apart to be told by eye', () => {
	const hues = ION_ORDER.map((i) => hue(IONS[i].color)).sort((a, b) => a - b);
	for (let i = 0; i < hues.length; i++) {
		const next = i + 1 < hues.length ? hues[i + 1] : hues[0] + 360;
		assert.ok(next - hues[i] >= 14, `two colours ${Math.round(next - hues[i])}° apart`);
	}
});

test('a salt burns off in seconds, sodium more slowly; a dry loop takes a quarter', () => {
	const time = (id, wet) => {
		const s = initial(1);
		clean(s);
		if (wet) apply(s, { type: 'acid' });
		apply(s, { type: 'touch', sample: id });
		let t = 0;
		while (!isClean(s) && t < 60) {
			apply(s, { type: 'flame', dt: 0.05, lit: true });
			t += 0.05;
		}
		return t;
	};
	assert.ok(time('Li', true) > 3 && time('Li', true) < 7);
	assert.ok(time('Na', true) > time('Li', true) + 2);
	assert.ok(time('Li', false) < time('Li', true) / 3);
});

test('in an unlit flame nothing burns; in the yellow flame of a closed collar no colour is seen', () => {
	const s = initial(1);
	clean(s);
	apply(s, { type: 'acid' });
	apply(s, { type: 'touch', sample: 'Cu' });
	const before = s.loop.load.Cu;
	apply(s, { type: 'flame', dt: 5, lit: false });
	assert.equal(s.loop.load.Cu, before);
	assert.equal(emission(s, 0.2).amount, 0);
	assert.ok(emission(s, 1).amount > 0.9);
});

test('a loop that is not clean leaves what it carries in the sample, for good', () => {
	const s = initial(1);
	clean(s);
	apply(s, { type: 'acid' });
	apply(s, { type: 'touch', sample: 'Na' });
	// straight into the potassium, without cleaning
	const ev = apply(s, { type: 'touch', sample: 'K' });
	assert.deepEqual(ev[0], { type: 'tainted', sample: 'K', by: ['Na'] });
	assert.ok(s.samples.K.taint.Na > 0);
	const v = verdict(s, emission(s, 1));
	assert.equal(v.kind, 'dirty');
	assert.equal(v.by, 'Na');
	// even a clean loop now finds sodium in that sample
	clean(s);
	apply(s, { type: 'acid' });
	assert.deepEqual(apply(s, { type: 'touch', sample: 'K' }), [{ type: 'picked', sample: 'K', dry: false }]);
	assert.equal(verdict(s, emission(s, 1)).kind, 'dirty');
	assert.equal(tainted(s, 'K'), true);
});

test('a contaminated sample can be changed for a fresh one, and is then seen clean again', () => {
	const s = initial(1);
	clean(s);
	apply(s, { type: 'acid' });
	apply(s, { type: 'touch', sample: 'Na' });
	apply(s, { type: 'touch', sample: 'K' });
	apply(s, { type: 'replace', sample: 'K' });
	assert.equal(tainted(s, 'K'), false);
	clean(s);
	apply(s, { type: 'acid' });
	apply(s, { type: 'touch', sample: 'K' });
	assert.deepEqual(verdict(s, emission(s, 1)), { kind: 'pure', sample: 'K' });
});

test('potassium leaves the flame before sodium: behind the glass the mixture goes dark after a few seconds', () => {
	const s = initial(1);
	clean(s);
	apply(s, { type: 'acid' });
	apply(s, { type: 'touch', sample: 'Mix' });
	burn(s, 2);
	assert.equal(emission(s, 1, true).dominant, 'K');
	burn(s, 6);
	assert.ok(emission(s, 1).amount > 0.5, 'sodium still burns');
	assert.ok(emission(s, 1, true).amount < 0.1, 'nothing left behind the glass');
});

test('acid alone does not clean: what is left still colours the flame', () => {
	const s = initial(1);
	clean(s);
	apply(s, { type: 'acid' });
	apply(s, { type: 'touch', sample: 'Sr' });
	apply(s, { type: 'acid' });
	assert.equal(isClean(s), false);
	assert.ok(dirt(s.loop.load) < 0.4);
});

test('sodium hides potassium by eye; through cobalt glass sodium goes and potassium stays', () => {
	const s = initial(1);
	clean(s);
	apply(s, { type: 'acid' });
	apply(s, { type: 'touch', sample: 'Mix' });
	const eye = emission(s, 1);
	assert.equal(eye.dominant, 'Na');
	assert.ok(eye.share.K < 0.12);
	assert.deepEqual(verdict(s, eye), { kind: 'pure', sample: 'Mix' });
	const glass = emission(s, 1, true);
	assert.equal(glass.dominant, 'K');
	assert.ok(glass.share.Na < 0.1);
	assert.ok(glass.amount > 0.5);
	// sodium alone: almost nothing is left behind the glass
	const n = initial(1);
	clean(n);
	apply(n, { type: 'acid' });
	apply(n, { type: 'touch', sample: 'Na' });
	assert.ok(emission(n, 1, true).amount < 0.1);
});

test('a hot loop sizzles in the acid and comes out cool', () => {
	const s = initial(1);
	burn(s, 3);
	assert.ok(s.loop.temp > 900);
	assert.deepEqual(apply(s, { type: 'acid' }), [{ type: 'sizzle' }]);
	assert.ok(s.loop.temp <= 60);
	assert.deepEqual(apply(s, { type: 'acid' }), []);
});

test('the unknown samples follow the seed, X is a white salt and Y has sodium', () => {
	const seen = new Set();
	for (let seed = 1; seed <= 60; seed++) {
		const a = initial(seed);
		const b = initial(seed);
		assert.deepEqual(a.unknown, b.unknown);
		assert.ok(X_CHOICES.includes(a.unknown.X));
		assert.ok(['Na', 'NaK'].includes(a.unknown.Y));
		assert.equal(truth(a, 'X'), a.unknown.X);
		assert.ok(a.samples.Y.ions.Na);
		assert.equal(!!a.samples.Y.ions.K, a.unknown.Y === 'NaK');
		seen.add(a.unknown.X + a.unknown.Y);
	}
	assert.equal(seen.size, X_CHOICES.length * 2);
	assert.ok(ANSWERS.some((x) => x.id === 'NaK'));
});

test('the state is plain data: the same actions on a copy give the same state', () => {
	const acts = [{ type: 'acid' }, { type: 'flame', dt: 3, lit: true }, { type: 'acid' }, { type: 'touch', sample: 'X' }, { type: 'flame', dt: 1.5, lit: true }, { type: 'air', dt: 2 }, { type: 'touch', sample: 'Ba' }];
	const a = initial(42);
	const b = JSON.parse(JSON.stringify(initial(42)));
	for (const act of acts) {
		apply(a, act);
		apply(b, act);
	}
	assert.deepEqual(JSON.parse(JSON.stringify(a)), b);
	assert.ok(CLEAN > 0);
});
