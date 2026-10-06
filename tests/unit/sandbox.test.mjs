// The physics sandbox engine against the closed laws of the school's models: incline, Atwood, connected bodies,
// a body on two threads, a launch from a table, friction that stops a body. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { solve, initial, advance, energy } = await jiti.import('../../src/lib/sandbox/engine.ts');
const { incline, atwood, inclineAndWeight, twoThreads, launch } = await jiti.import('../../src/lib/sandbox/scenes.ts');

const G = 9.8;
const rad = (d) => (d * Math.PI) / 180;
const close = (a, b, what = '', tol = 1e-6) => assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), `${what}: ${a} vs ${b}`);
const mod = (v) => Math.hypot(v.x, v.y);
const force = (sol, i, kind, n = 0) => sol.forces[i].filter((f) => f.kind === kind)[n];

test('incline without friction: a = g sin θ, N = m g cos θ', () => {
	for (const angle of [10, 30, 45, 70]) {
		const scene = incline({ angle, m: 2 });
		const sol = solve(scene, initial(scene));
		close(mod(sol.acc[0]), G * Math.sin(rad(angle)), `a at ${angle}`);
		close(mod(force(sol, 0, 'normal').v), 2 * G * Math.cos(rad(angle)), `N at ${angle}`);
	}
});

test('incline with friction: held while tan θ ≤ μs, then a = g (sin θ − μk cos θ)', () => {
	const held = incline({ angle: 20, m: 2, muS: 0.5, muK: 0.4 });
	const sol = solve(held, initial(held));
	close(mod(sol.acc[0]), 0, 'held');
	const f = force(sol, 0, 'friction');
	assert.equal(f.static, true);
	close(mod(f.v), 2 * G * Math.sin(rad(20)), 'static friction');
	assert.ok(f.v.x > 0 && f.v.y > 0, 'friction points up the slope');

	const slides = incline({ angle: 40, m: 2, muS: 0.5, muK: 0.4 });
	const s2 = solve(slides, initial(slides));
	close(mod(s2.acc[0]), G * (Math.sin(rad(40)) - 0.4 * Math.cos(rad(40))), 'sliding');
	assert.equal(force(s2, 0, 'friction').static, false);
});

test('incline: the motion follows s = a t² / 2 exactly', () => {
	const scene = incline({ angle: 30, m: 1.5, muK: 0.2, muS: 0.2, d: 2.5 });
	const a = G * (Math.sin(rad(30)) - 0.2 * Math.cos(rad(30)));
	const start = initial(scene);
	const st = advance(scene, start, 0.8);
	close(mod({ x: st.pos[0].x - start.pos[0].x, y: st.pos[0].y - start.pos[0].y }), (a * 0.64) / 2, 's', 1e-9);
	close(mod(st.vel[0]), a * 0.8, 'v', 1e-9);
});

test('a block pushed up a rough incline stops at v0² / 2a and stays if tan θ ≤ μs', () => {
	const scene = incline({ angle: 20, m: 1, muS: 0.5, muK: 0.4, d: 0.5, v0: 3 });
	const a = G * (Math.sin(rad(20)) + 0.4 * Math.cos(rad(20)));
	const start = initial(scene);
	const st = advance(scene, start, 2);
	close(mod({ x: st.pos[0].x - start.pos[0].x, y: st.pos[0].y - start.pos[0].y }), 9 / (2 * a), 'distance', 1e-9);
	close(mod(st.vel[0]), 0, 'at rest');
	assert.equal(force(solve(scene, st), 0, 'friction').static, true);
});

test('Atwood: a = (m2 − m1) g / (m1 + m2), T = 2 m1 m2 g / (m1 + m2)', () => {
	for (const [m1, m2] of [[1.2, 1.5], [0.5, 2], [1, 1], [2, 0.3]]) {
		const scene = atwood({ m1, m2 });
		const sol = solve(scene, initial(scene));
		const a = ((m2 - m1) * G) / (m1 + m2);
		close(sol.acc[1].y, -a, `a for ${m1}, ${m2}`);
		close(sol.acc[0].y, a, `a of m1 for ${m1}, ${m2}`);
		close(sol.tensions[0], (2 * m1 * m2 * G) / (m1 + m2), `T for ${m1}, ${m2}`);
	}
	const scene = atwood({ m1: 1.2, m2: 1.5 });
	const start = initial(scene);
	const st = advance(scene, start, 0.6);
	const a = (0.3 * G) / 2.7;
	close(start.pos[1].y - st.pos[1].y, (a * 0.36) / 2, 'descent', 1e-9);
	close(st.pos[0].y - start.pos[0].y, (a * 0.36) / 2, 'rise', 1e-9);
});

test('a block on an incline pulled by a hanging one', () => {
	const m1 = 2, m2 = 1.5, th = rad(30);
	const free = inclineAndWeight({ angle: 30, m1, m2 });
	const s1 = solve(free, initial(free));
	const a = (G * (m2 - m1 * Math.sin(th))) / (m1 + m2);
	close(mod(s1.acc[0]), a, 'a');
	close(-s1.acc[1].y, a, 'a of the hanging block');
	close(s1.tensions[0], m2 * (G - a), 'T');

	const mu = 0.2;
	const rough = inclineAndWeight({ angle: 30, m1, m2, muS: mu, muK: mu });
	const s2 = solve(rough, initial(rough));
	const a2 = (G * (m2 - m1 * Math.sin(th) - mu * m1 * Math.cos(th))) / (m1 + m2);
	close(mod(s2.acc[0]), a2, 'a with friction');
	close(s2.tensions[0], m2 * (G - a2), 'T with friction');

	const held = inclineAndWeight({ angle: 30, m1, m2: 1.1, muS: 0.3, muK: 0.2 });
	const s3 = solve(held, initial(held));
	close(mod(s3.acc[0]), 0, 'held by static friction');
	close(s3.tensions[0], 1.1 * G, 'T when held');
});

test('a body on two threads: T1 = m g cos β / sin(α + β), T2 = m g cos α / sin(α + β)', () => {
	for (const [alpha, beta] of [[30, 60], [45, 45], [20, 70], [50, 35]]) {
		const scene = twoThreads({ m: 3, alpha, beta });
		const sol = solve(scene, initial(scene));
		const s = Math.sin(rad(alpha + beta));
		close(mod(sol.acc[0]), 0, 'at rest');
		close(sol.tensions[0], (3 * G * Math.cos(rad(beta))) / s, `T1 at ${alpha}, ${beta}`);
		close(sol.tensions[1], (3 * G * Math.cos(rad(alpha))) / s, `T2 at ${alpha}, ${beta}`);
		const still = advance(scene, initial(scene), 1);
		close(still.pos[0].y, scene.bodies[0].pos.y, 'it stays where it is', 1e-9);
	}
});

test('launch from a table: t = √(2h/g), range v0 t, then friction stops the ball', () => {
	const h = 1.2, v0 = 2, mu = 0.5;
	const scene = launch({ h, v0, mu });
	const tEdge = 0.4 / v0;
	const tFall = Math.sqrt((2 * h) / G);
	const before = advance(scene, initial(scene), tEdge + tFall - 0.01);
	assert.ok(before.pos[0].y > 0.08 + 1e-4, 'still in the air');
	close(before.vel[0].x, v0, 'horizontal velocity in flight');
	const after = advance(scene, initial(scene), tEdge + tFall + 1e-6);
	close(after.pos[0].y, 0.08, 'on the floor', 1e-6);
	close(after.pos[0].x, v0 * tFall, 'range', 1e-4);
	const rest = advance(scene, initial(scene), tEdge + tFall + 2);
	close(rest.vel[0].x, 0, 'at rest');
	close(rest.pos[0].x, v0 * tFall + (v0 * v0) / (2 * mu * G), 'stopping distance', 1e-6);
});

test('a pendulum keeps its energy and its length', () => {
	const scene = {
		g: G,
		bodies: [{ id: 'm', m: 1, r: 0.05, pos: { x: 0.6, y: 1.2 } }],
		surfaces: [],
		pulleys: [],
		ropes: [{ id: 'filo', from: { body: 'm' }, to: { point: { x: 0, y: 2 } } }],
		view: { x0: -2, x1: 2, y0: 0, y1: 2.2 }
	};
	const e0 = energy(scene, initial(scene));
	const st = advance(scene, initial(scene), 3);
	const e1 = energy(scene, st);
	close(Math.hypot(st.pos[0].x, st.pos[0].y - 2), 1, 'length', 1e-9);
	close(e1.kinetic + e1.potential, e0.kinetic + e0.potential, 'energy', 2e-3);
});

test('Atwood to the end: the heavy block lands, the rope goes slack and taut again without blowing up', () => {
	const scene = atwood({ m1: 0.5, m2: 2 });
	let st = initial(scene);
	for (let i = 0; i < 300 && !st.ended; i++) st = advance(scene, st, 1 / 60);
	assert.ok(st.pos.every((p) => Number.isFinite(p.x + p.y) && p.y > 0 && p.y < 3));
});

test('the weight lands, the rope goes slack and the block goes on until friction stops it', async () => {
	const { cartAndWeight } = await jiti.import('../../src/lib/sandbox/scenes.ts');
	const scene = cartAndWeight({ m1: 4, m2: 2, muS: 0.35, muK: 0.25 });
	const s0 = solve(scene, initial(scene));
	close(mod(s0.acc[0]), ((2 - 0.25 * 4) / 6) * G, 'a of example 3');
	close(s0.tensions[0], 2 * (G - mod(s0.acc[0])), 'T of example 3');
	const drop = scene.bodies[1].pos.y - scene.bodies[1].r;
	const tLand = Math.sqrt((2 * drop) / mod(s0.acc[0]));
	const just = advance(scene, initial(scene), tLand + 0.01);
	close(solve(scene, just).tensions[0], 0, 'slack after the landing');
	close(just.vel[0].x, mod(s0.acc[0]) * tLand - 0.25 * G * 0.01, 'the block keeps its speed', 1e-6);
	const rest = advance(scene, initial(scene), tLand + 2);
	close(mod(rest.vel[0]), 0, 'stopped by friction');

	const stuck = cartAndWeight({ m1: 4, m2: 1.3, muS: 0.35, muK: 0.25 });
	const s1 = solve(stuck, initial(stuck));
	close(mod(s1.acc[0]), 0, 'under 1,4 kg it does not start');
	close(s1.tensions[0], 1.3 * G, 'T equals the weight');
});

test('a block that comes back to the foot of the incline ends its run there, still moving', () => {
	const scene = incline({ angle: 30, m: 2, muS: 0.4, muK: 0.3, d: 0.3, v0: 5, L: 3.3 });
	let st = initial(scene);
	for (let i = 0; i < 600 && !st.ended; i++) st = advance(scene, st, 1 / 60);
	assert.equal(st.ended, 'edge');
	assert.ok(mod(st.vel[0]) > 1, 'it arrives with its speed');
});

test('the editor: pieces snap, follow their surface, and a scene survives its link', async () => {
	const E = await jiti.import('../../src/lib/sandbox/edit.ts');
	let { scene, sel } = E.addPiece(E.EMPTY, 'incline');
	const ramp = sel.id;
	({ scene, sel } = E.addPiece(scene, 'block'));
	const m = sel.id;
	// dropped a little above the middle of the ramp, the block sits on it
	const s = scene.surfaces[0];
	const mid = { x: (s.a.x + s.b.x) / 2, y: (s.a.y + s.b.y) / 2 };
	scene = E.moveBody(scene, m, { x: mid.x - 0.1, y: mid.y + 0.3 });
	const sol = solve(scene, initial(scene));
	close(mod(sol.acc[0]), G * Math.sin(rad(30)), 'it slides as on a 30° incline');
	// steeper ramp: the block stays on it
	scene = E.setIncline(scene, ramp, 45, 2.4);
	close(mod(solve(scene, initial(scene)).acc[0]), G * Math.sin(rad(45)), 'it follows the ramp when the ramp turns');
	scene = E.moveSurface(scene, ramp, { x: 1, y: 0.5 });
	close(mod(solve(scene, initial(scene)).acc[0]), G * Math.sin(rad(45)), 'and when the ramp moves');

	// Atwood built by hand: two blocks, a pulley, a rope tied body, pulley, body
	let a = E.EMPTY;
	a = E.addPiece(a, 'pulley').scene;
	a = E.addPiece(a, 'block').scene;
	a = E.addPiece(a, 'block').scene;
	const c = a.pulleys[0];
	a = E.moveBody(a, a.bodies[0].id, { x: c.at.x - c.r, y: 1.5 });
	a = E.moveBody(a, a.bodies[1].id, { x: c.at.x + c.r, y: 1.5 });
	a = { ...a, bodies: a.bodies.map((b, i) => ({ ...b, m: i ? 1.5 : 1.2 })) };
	const p1 = E.target(a, a.bodies[0].pos), viaC = E.target(a, c.at), p2 = E.target(a, a.bodies[1].pos);
	assert.equal(viaC.pulley, c.id);
	a = E.addRope(a, p1.end, p2.end, viaC.pulley).scene;
	const sa = solve(a, initial(a));
	close(sa.tensions[0], (2 * 1.2 * 1.5 * G) / 2.7, 'the tension of Atwood', 1e-3);
	// the other way round the rope turns the other way, and it is the same machine
	const back = E.addRope({ ...a, ropes: [] }, p2.end, p1.end, c.id).scene;
	close(solve(back, initial(back)).tensions[0], sa.tensions[0], 'tied from the other end');

	const again = E.decode(E.encode(a));
	assert.ok(again);
	close(solve(again, initial(again)).tensions[0], sa.tensions[0], 'through the link');
	assert.equal(E.decode('not a scene'), null);
	assert.equal(E.remove(a, { type: 'body', id: a.bodies[0].id }).ropes.length, 0);
});

test('an endless floor: a body thrown lands on it past its ends and stays on it', async () => {
	const E = await jiti.import('../../src/lib/sandbox/edit.ts');
	let scene = E.addPiece(E.EMPTY, 'floor').scene;
	assert.equal(scene.surfaces[0].endless, true);
	scene = E.addPiece(scene, 'block').scene;
	const id = scene.bodies[0].id;
	// it starts in the air and flies to the left, well past the end of the stretch the floor was drawn with
	scene = { ...scene, bodies: scene.bodies.map((b) => ({ ...b, pos: { x: -2, y: 1 }, vel: { x: -5, y: 3 } })) };
	const end = advance(scene, initial(scene), 1.5);
	assert.ok(end.pos[0].x < scene.surfaces[0].a.x, 'it is past the end');
	close(end.pos[0].y, scene.bodies[0].r, 'it rests on the floor');
	close(end.vel[0].y, 0, 'and does not fall');
	close(end.vel[0].x, -5, 'it slides on at the speed it had');
	// cut back to its ends, the same floor lets it fall
	const cut = E.setEndless(scene, scene.surfaces[0].id, false);
	assert.ok(advance(cut, initial(cut), 1.5).pos[0].y < 0, 'a limited floor ends');
	// a body dropped past the ends snaps onto the endless floor
	const far = E.moveBody(scene, id, { x: -2.6, y: 0.2 });
	close(far.bodies[0].pos.y, scene.bodies[0].r, 'snaps past the end');
});
