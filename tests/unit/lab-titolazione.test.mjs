// The titration's chemistry (src/lib/lab/titolazione.ts): the burette, the flasks, the end point, the readings.
// Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const T = await jiti.import('../../src/lib/lab/titolazione.ts');
const { BURETTE, C_BASE, DROP, SAMPLE, apply, atEndPoint, beyond, concentration, concordant, emptyLevel, equivalence, fullLevel, inBurette, initial, look, onScale, pH, quality, readsRight, roundReading } = T;

const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps, `${a} is not ${b}`);
/** A burette filled, primed and brought to `level`, and flask 1 with its sample and two drops of indicator. */
const ready = (seed = 3, level = 0) => {
	const s = initial(seed);
	apply(s, { type: 'fill', ml: 99 });
	apply(s, { type: 'run', ml: level - s.burette.level, into: 'waste' });
	apply(s, { type: 'sample', flask: 1, ml: SAMPLE });
	apply(s, { type: 'indicator', flask: 1, drops: 2 });
	return s;
};
const swirl = (s, sec = 3, flask = 1) => {
	for (let i = 0; i < sec * 60; i++) apply(s, { type: 'mix', flask, dt: 1 / 60, swirl: true });
};

test('the unknown is the same for a seed and takes between 13 and 18.6 mL of base', () => {
	for (let seed = 1; seed < 400; seed++) {
		const s = initial(seed);
		assert.equal(s.cAcid, initial(seed).cAcid);
		const v = (s.cAcid * SAMPLE) / C_BASE;
		assert.ok(v >= 13 - 1e-9 && v <= 18.6, `seed ${seed}: ${v} mL`);
	}
	assert.ok(new Set(Array.from({ length: 60 }, (_, i) => initial(i + 1).cAcid)).size > 20);
});

test('the burette starts empty, fills no further than its brim and empties no further than its stopcock', () => {
	const s = initial(1);
	near(inBurette(s), 0);
	assert.equal(onScale(s), false);
	const [filled] = apply(s, { type: 'fill', ml: 10 });
	near(filled.ml, 10);
	near(inBurette(s), 10);
	const [more] = apply(s, { type: 'fill', ml: 99 });
	near(s.burette.level, fullLevel);
	near(more.ml, emptyLevel - fullLevel - 10);
	assert.equal(onScale(s), false, 'above the zero there is no scale');
	const [ran] = apply(s, { type: 'run', ml: 999, into: 'waste' });
	near(s.burette.level, emptyLevel);
	near(ran.ml, emptyLevel - fullLevel);
});

test('the air in the tip goes first: the level falls and nothing comes out', () => {
	const s = initial(1);
	apply(s, { type: 'fill', ml: 99 });
	const first = apply(s, { type: 'run', ml: 0.1, into: 'waste' });
	near(first[0].delivered, 0);
	near(s.waste, 0);
	const second = apply(s, { type: 'run', ml: 0.5, into: 'waste' });
	near(second[0].delivered, 0.6 - BURETTE.air);
	assert.equal(second.at(-1).type, 'primed');
	near(s.burette.air, 0);
	near(s.waste, 0.6 - BURETTE.air);
	// and from then on what leaves the scale is what arrives
	const third = apply(s, { type: 'run', ml: 2, into: 'waste' });
	near(third[0].delivered, 2);
	assert.equal(third.length, 1);
});

test('a sample is 25 mL of the unknown, colourless whatever is done to it before the base', () => {
	const s = ready();
	const f = s.flasks[1];
	near(f.acid, (s.cAcid * 25) / 1000);
	near(equivalence(f), (s.cAcid * 25) / C_BASE);
	assert.deepEqual(look(f), { pink: 0, cloud: 0 });
	assert.ok(pH(f) < 1.5 && pH(f) > 1);
	assert.equal(atEndPoint(f), false);
});

test('base that has just fallen is a pink cloud, which swirling takes away while acid is left', () => {
	const s = ready();
	const f = s.flasks[1];
	apply(s, { type: 'run', ml: 2, into: 1 });
	assert.ok(look(f).cloud > 0.9);
	assert.equal(look(f).pink, 0);
	assert.equal(atEndPoint(f), false, 'a cloud is not the end point');
	swirl(s, 1.5);
	assert.ok(look(f).cloud < 0.01, `cloud ${look(f).cloud}`);
	assert.equal(look(f).pink, 0);
	near(f.base + f.fresh, (2 * C_BASE) / 1000);
});

test('standing, the cloud stays for seconds; and near the end point it stays longer even when swirled', () => {
	const far = ready();
	apply(far, { type: 'run', ml: 1, into: 1 });
	for (let i = 0; i < 60; i++) apply(far, { type: 'mix', flask: 1, dt: 1 / 60, swirl: false });
	assert.ok(look(far.flasks[1]).cloud > 0.5, 'a second standing does not mix it');
	const time = (s) => {
		let t = 0;
		while (look(s.flasks[1]).cloud > 0.05 && t < 20) {
			apply(s, { type: 'mix', flask: 1, dt: 1 / 60, swirl: true });
			t += 1 / 60;
		}
		return t;
	};
	const early = ready();
	apply(early, { type: 'run', ml: 0.2, into: 1 });
	const late = ready();
	apply(late, { type: 'run', ml: equivalence(late.flasks[1]) - 0.4, into: 1 });
	swirl(late, 6);
	apply(late, { type: 'run', ml: 0.2, into: 1 });
	const te = time(early);
	const tl = time(late);
	assert.ok(tl > te * 2.5, `early ${te.toFixed(2)} s, late ${tl.toFixed(2)} s`);
});

test('one drop past the equivalence is a pale pink that stays; more is fuchsia', () => {
	const s = ready();
	const f = s.flasks[1];
	const eq = equivalence(f);
	apply(s, { type: 'run', ml: eq - 0.02, into: 1 });
	swirl(s, 8);
	assert.equal(look(f).pink, 0);
	assert.equal(atEndPoint(f), false);
	apply(s, { type: 'run', ml: DROP, into: 1 });
	assert.equal(atEndPoint(f), false, 'not before it is mixed');
	swirl(s, 8);
	assert.equal(atEndPoint(f), true);
	const pale = look(f).pink;
	assert.ok(pale > 0.05 && pale < 0.3, `pale ${pale}`);
	assert.equal(quality(f), 'drop');
	assert.ok(pH(f) > 8.2, `pH ${pH(f)}`);
	apply(s, { type: 'run', ml: 0.5, into: 1 });
	swirl(s, 8);
	assert.ok(look(f).pink > 0.8);
	assert.equal(quality(f), 'over');
	apply(s, { type: 'run', ml: 1, into: 1 });
	assert.equal(quality(f), 'far');
	near(beyond(f), 0.03 + 1.5, 1e-6);
});

test('without indicator nothing shows, and it is never an end point', () => {
	const s = ready();
	s.flasks[1].drops = 0;
	apply(s, { type: 'run', ml: 20, into: 1 });
	swirl(s, 5);
	assert.deepEqual(look(s.flasks[1]), { pink: 0, cloud: 0 });
	assert.equal(atEndPoint(s.flasks[1]), false);
	apply(s, { type: 'indicator', flask: 1, drops: 1 });
	assert.ok(look(s.flasks[1]).pink > 0.4, 'one drop colours it, less than two');
	assert.ok(look(s.flasks[1]).pink < 0.6);
});

test('the titre read off the burette gives back the unknown', () => {
	for (const seed of [1, 2, 7, 40, 311]) {
		const s = ready(seed, 0.35);
		const f = s.flasks[1];
		const vi = roundReading(s.burette.level);
		// by drops from 0.3 mL before, as a careful student
		apply(s, { type: 'run', ml: equivalence(f) - 0.3, into: 1 });
		swirl(s, 6);
		while (!atEndPoint(f)) {
			apply(s, { type: 'run', ml: DROP, into: 1 });
			swirl(s, 6);
		}
		const vf = roundReading(s.burette.level);
		assert.ok(readsRight(vf, s.burette.level));
		const c = concentration(vf - vi);
		assert.ok(Math.abs(c - s.cAcid) / s.cAcid < 0.006, `seed ${seed}: ${c} against ${s.cAcid}`);
		assert.equal(quality(f), 'drop');
	}
});

test('readings: half a division either way counts, a whole one does not; titres agree within 0.2 mL', () => {
	assert.equal(readsRight(12.35, 12.37), true);
	assert.equal(readsRight(12.4, 12.37), true);
	assert.equal(readsRight(12.3, 12.37), false);
	assert.equal(readsRight(12.45, 12.37), false);
	near(roundReading(12.37), 12.35, 1e-9);
	assert.equal(concordant(15.2, 15.4), true);
	assert.equal(concordant(15.2, 15.45), false);
	near(concentration(15), 0.06);
});

test('the same actions give the same state', () => {
	const run = () => {
		const s = ready(9, 1.2);
		apply(s, { type: 'run', ml: 7.3, into: 1 });
		swirl(s, 0.7);
		apply(s, { type: 'run', ml: 3.1, into: 1 });
		for (let i = 0; i < 40; i++) apply(s, { type: 'mix', flask: 1, dt: 1 / 60, swirl: false });
		return JSON.stringify(s);
	};
	assert.equal(run(), run());
	assert.deepEqual(JSON.parse(run()), JSON.parse(JSON.stringify(JSON.parse(run()))));
});
