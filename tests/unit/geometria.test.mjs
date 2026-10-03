// The geometry of the plotter: objects built from other objects, where they meet, their equations.
// Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { canMeet, circleEquation, construct, fromFunction, fromImplicit, intersections, lineEquation, pointAt, polygonArea, polygonPerimeter, project, reach, tangents, texAngle, texNumber, texRoot } = await jiti.import('../../src/lib/grafico/geometria.ts');

const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps, `${a} ≠ ${b}`);
const P = (x, y) => ({ kind: 'point', x, y });
/** A little plane: objects by number, builds on top of them. */
const plane = (objects) => {
	const get = (id) => (objects[id].type ? construct(objects[id], get) : objects[id]);
	return get;
};

test('a line, a segment and their relatives from two points', () => {
	const get = plane([P(0, 1), P(2, 5), { type: 'line', of: [0, 1] }, { type: 'segment', of: [0, 1] }, { type: 'midpoint', of: [0, 1] }, { type: 'bisector', of: [0, 1] }, P(3, 0), { type: 'parallel', of: [2, 6] }, { type: 'perpendicular', of: [2, 6] }]);
	assert.equal(lineEquation(get(2)), 'y=2x+1');
	assert.equal(get(3).segment, true);
	assert.deepEqual(get(4), P(1, 3));
	assert.equal(lineEquation(get(5)), 'y=-\\frac{1}{2}x+\\frac{7}{2}');
	assert.equal(lineEquation(get(7)), 'y=2x-6');
	assert.equal(lineEquation(get(8)), 'y=-\\frac{1}{2}x+\\frac{3}{2}');
	// a vertical line, a horizontal one
	assert.equal(lineEquation(construct({ type: 'line', of: [0, 1] }, plane([P(3, 0), P(3, 4)]))), 'x=3');
	assert.equal(lineEquation(construct({ type: 'line', of: [0, 1] }, plane([P(0, 2), P(5, 2)]))), 'y=2');
	assert.equal(construct({ type: 'line', of: [0, 1] }, plane([P(1, 1), P(1, 1)])).kind, 'none');
});

test('circles: from the centre and a point, through three points', () => {
	const get = plane([P(2, 1), P(5, 5), { type: 'circle', of: [0, 1] }, P(0, 0), P(4, 0), P(0, 2), { type: 'circle3', of: [3, 4, 5] }, P(1, 1), P(2, 2), { type: 'circle3', of: [3, 7, 8] }]);
	const c = get(2);
	close(c.circle.r, 5);
	assert.equal(circleEquation(c.circle), 'x^2+y^2-4x-2y-20=0');
	const d = get(6);
	close(d.circle.c.x, 2);
	close(d.circle.c.y, 1);
	assert.equal(texRoot(d.circle.r ** 2), '\\sqrt{5}');
	assert.equal(circleEquation(d.circle), 'x^2+y^2-4x-2y=0');
	assert.match(get(9).why, /allineati/);
});

test('a formula is a line, a circle or a conic when it is one', () => {
	const line = fromFunction((x) => 2 * x + 1);
	assert.equal(line.kind, 'line');
	assert.equal(lineEquation(line), 'y=2x+1');
	assert.equal(lineEquation(fromImplicit((x, y) => 2 * x + 3 * y - 6)), 'y=-\\frac{2}{3}x+2');
	assert.equal(lineEquation(fromImplicit((x) => x - 4)), 'x=4');
	const circle = fromImplicit((x, y) => x * x + y * y - 2 * x - 3);
	close(circle.circle.r, 2);
	close(circle.circle.c.x, 1);
	const parabola = fromFunction((x) => x * x - 1);
	assert.equal(parabola.kind, 'conic');
	assert.equal(parabola.circle, undefined);
	assert.equal(fromFunction(Math.sin).kind, 'curve');
	assert.equal(fromImplicit((x, y) => Math.sin(x) - y * y * y), null);
	assert.equal(fromImplicit((x, y) => 1 / x - y), null);
});

test('where lines and conics meet', () => {
	const r = fromFunction((x) => x + 1);
	const s = fromFunction((x) => -x + 3);
	const [meet] = intersections(r, s);
	close(meet.x, 1);
	close(meet.y, 2);
	assert.deepEqual(intersections(r, fromFunction((x) => x - 5)), []);
	// a line and a parabola, in the order of the line
	const points = intersections(fromFunction((x) => x), fromFunction((x) => x * x - 2));
	assert.equal(points.length, 2);
	close(points[0].x, -1);
	close(points[1].x, 2);
	// a tangent touches
	const touch = intersections(fromFunction(() => -1), fromFunction((x) => x * x - 1));
	close(touch[0].x, 0);
	close(touch[1].x, 0);
	// two circles meet on their radical axis
	const c1 = fromImplicit((x, y) => x * x + y * y - 4);
	const c2 = fromImplicit((x, y) => (x - 2) ** 2 + y * y - 4);
	const both = intersections(c1, c2);
	assert.equal(both.length, 2);
	close(both[0].x, 1);
	close(Math.abs(both[0].y), Math.sqrt(3));
	assert.equal(canMeet(c1, c2), true);
	// a circle and a parabola are a quartic: not yet
	assert.equal(canMeet(c1, fromFunction((x) => x * x)), false);
	// a segment stops at its ends
	const segment = construct({ type: 'segment', of: [0, 1] }, plane([P(0, 0), P(1, 1)]));
	assert.equal(intersections(segment, fromFunction(() => 2)).length, 0);
	assert.equal(intersections(segment, fromFunction(() => 0.5)).length, 1);
});

test('a point on an object stays on it, and a meeting point follows its objects', () => {
	const circle = fromImplicit((x, y) => x * x + y * y - 25);
	const at = project(circle, { x: 6, y: 8 });
	const on = pointAt(circle, at);
	close(on.x, 3);
	close(on.y, 4);
	const line = fromFunction((x) => 2 * x);
	const t = project(line, { x: 5, y: 0 });
	const foot = pointAt(line, t);
	close(foot.x, 1);
	close(foot.y, 2);
	close(pointAt(fromFunction(Math.sin), 1).y, Math.sin(1));
	// on a parabola written as a function the point goes by its x
	const parabola = fromFunction((x) => x * x - 4);
	close(pointAt(parabola, project(parabola, { x: 2, y: 0.3 })).y, 0);
	const get = plane([circle, line, { type: 'meet', of: [1, 0], index: 1 }, { type: 'on', of: [0], at: Math.PI / 2 }]);
	close(get(2).x, Math.sqrt(5));
	close(get(3).y, 5);
	// what depends on something missing says so
	assert.equal(plane([{ kind: 'none', why: 'x' }, P(0, 0), { type: 'line', of: [0, 1] }])(2).kind, 'none');
});

test('distances between points and lines', () => {
	const r = fromFunction((x) => (3 * x) / 4);
	const get = plane([P(0, 0), P(3, 4), r, P(4, -2), fromFunction((x) => (3 * x) / 4 + 5), fromFunction((x) => x), { type: 'distance', of: [0, 1] }, { type: 'distance', of: [3, 2] }, { type: 'distance', of: [2, 4] }, { type: 'distance', of: [2, 5] }]);
	close(get(6).value, 5);
	close(get(7).value, 4);
	close(get(8).value, 4);
	assert.match(get(9).why, /si incontrano/);
});

test('how near the pointer is, in pixels', () => {
	const line = fromFunction(() => 1);
	close(reach(line, { x: 3, y: 1.5 }, 40, 40), 20);
	const circle = fromImplicit((x, y) => x * x + y * y - 4);
	close(reach(circle, { x: 2.1, y: 0 }, 40, 40), 4, 0.2);
	close(reach({ kind: 'point', x: 1, y: 1 }, { x: 1, y: 2 }, 40, 20), 20);
	const segment = { kind: 'line', p: { x: 0, y: 0 }, d: { x: 1, y: 0 }, segment: true };
	close(reach(segment, { x: 2, y: 0 }, 40, 40), 40);
});

test('numbers as the school writes them', () => {
	assert.equal(texNumber(2), '2');
	assert.equal(texNumber(-0.75), '-\\frac{3}{4}');
	assert.equal(texNumber(Math.PI), '3{,}142');
	assert.equal(texRoot(25), '5');
	assert.equal(texRoot(13), '\\sqrt{13}');
	assert.equal(texRoot(4.5), '\\frac{3\\sqrt{2}}{2}');
	assert.equal(texRoot(8), '2\\sqrt{2}');
	assert.equal(texRoot(Math.PI), '1{,}772');
});

test('rays, vectors and what stops at an end', () => {
	const get = plane([P(0, 0), P(2, 2), { type: 'ray', of: [0, 1] }, { type: 'vector', of: [0, 1] }]);
	assert.equal(get(2).ray, true);
	assert.equal(get(3).arrow, true);
	// a ray meets what is ahead of it, not what is behind
	assert.equal(intersections(get(2), fromImplicit((x) => x - 5)).length, 1);
	assert.equal(intersections(get(2), fromImplicit((x) => x + 1)).length, 0);
	close(reach(get(2), { x: -3, y: -4 }, 10, 10), 50);
	close(project(get(2), { x: -3, y: -3 }), 0);
});

test('the bisectors of an angle', () => {
	const get = plane([P(4, 0), P(0, 0), P(0, 3), { type: 'anglebisector', of: [0, 1, 2] }, fromFunction((x) => x), fromFunction((x) => -x + 2), { type: 'anglebisector', of: [4, 5], index: 0 }, { type: 'anglebisector', of: [4, 5], index: 1 }]);
	assert.equal(lineEquation(get(3)), 'y=x');
	// two lines have two bisectors, at right angles, through their common point
	assert.equal(lineEquation(get(6)), 'y=1');
	assert.equal(lineEquation(get(7)), 'x=1');
});

test('circles from a radius', () => {
	const get = plane([P(1, 2), { type: 'circler', of: [0], at: 3 }, P(0, 0), P(3, 4), { type: 'compass', of: [2, 3, 0] }, { type: 'circler', of: [0], at: 0 }]);
	assert.equal(circleEquation(get(1).circle), 'x^2+y^2-2x-4y-4=0');
	close(get(4).circle.r, 5);
	close(get(4).circle.c.y, 2);
	assert.equal(get(5).kind, 'none');
});

test('tangents to a conic and to a curve', () => {
	const circle = fromImplicit((x, y) => x * x + y * y - 25);
	// from outside there are two, and each touches once
	const two = tangents({ x: 7, y: 1 }, circle);
	assert.equal(two.length, 2);
	for (const t of two) {
		const touch = intersections(t, circle);
		close(touch[0].x, touch[1].x, 1e-6);
	}
	// at a point of the circle there is one, at right angles to the radius
	const [one] = tangents({ x: 3, y: 4 }, circle);
	assert.equal(lineEquation(one), 'y=-\\frac{3}{4}x+\\frac{25}{4}');
	assert.equal(tangents({ x: 1, y: 1 }, circle).length, 0);
	// a parabola written as a function
	const parabola = fromFunction((x) => x * x);
	assert.equal(lineEquation(tangents({ x: 1, y: 1 }, parabola)[0]), 'y=2x-1');
	assert.deepEqual(tangents({ x: 0, y: -1 }, parabola).map(lineEquation).sort(), ['y=-2x-1', 'y=2x-1']);
	// a curve that is no conic: the tangent where it has the x of the point
	const [sine] = tangents({ x: 0, y: 5 }, fromFunction(Math.sin));
	close(sine.d.y / sine.d.x, 1, 1e-6);
	close(sine.p.y, 0);
	const get = plane([P(0, -1), parabola, { type: 'tangent', of: [0, 1], index: 1 }, P(0, 1), { type: 'tangent', of: [3, 1] }]);
	assert.equal(get(2).kind, 'line');
	assert.match(get(4).why, /dentro/);
});

test('polygons, angles and slopes', () => {
	const get = plane([P(0, 0), P(4, 0), P(4, 3), { type: 'polygon', of: [0, 1, 2] }, { type: 'angle', of: [1, 0, 2] }, { type: 'angle', of: [0, 1, 2] }, fromFunction((x) => x), fromFunction(() => 1), { type: 'angle', of: [6, 7] }, { type: 'slope', of: [6] }, fromImplicit((x) => x - 2), { type: 'slope', of: [10] }]);
	close(polygonArea(get(3).points), 6);
	close(polygonPerimeter(get(3).points), 12);
	close(get(4).value, Math.atan(3 / 4));
	close(get(5).value, Math.PI / 2);
	close(get(8).value, Math.PI / 4);
	close(get(8).vertex.x, 1);
	close(get(9).value, 1);
	assert.match(get(11).why, /verticale/);
	close(reach(get(3), { x: 2, y: -1 }, 10, 10), 10);
	assert.equal(texAngle(Math.PI / 4, true), '45^\\circ');
	assert.equal(texAngle(Math.PI / 4, false), '\\frac{\\pi}{4}');
	assert.equal(texAngle((2 * Math.PI) / 3, false), '\\frac{2\\pi}{3}');
	assert.equal(texAngle(1, true), '57{,}3^\\circ');
});

test('the four centres of a triangle', () => {
	const tri = [P(0, 0), P(6, 0), P(0, 8)];
	const centre = (index) => construct({ type: 'centre', of: [0, 1, 2], index }, plane(tri));
	assert.deepEqual([centre(0).x, centre(0).y], [2, 8 / 3]);
	assert.deepEqual([centre(1).x, centre(1).y], [3, 4]);
	close(centre(2).x, 2);
	close(centre(2).y, 2);
	// in a right triangle the heights meet at the right angle
	close(centre(3).x, 0);
	close(centre(3).y, 0);
	assert.match(construct({ type: 'centre', of: [0, 1, 2], index: 0 }, plane([P(0, 0), P(1, 1), P(2, 2)])).why, /allineati/);
});
