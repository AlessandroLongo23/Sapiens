// The tutor agenda's pure parts: Rome's clock, weekly repetition, the checks on what a form sends.
// Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const a = await jiti.import('../../src/lib/tutoring/agenda.ts');

test('a time in Rome becomes the right instant, in winter and in summer', () => {
	assert.equal(a.romeInstant('2026-01-15', '16:00').toISOString(), '2026-01-15T15:00:00.000Z');
	assert.equal(a.romeInstant('2026-07-15', '16:00').toISOString(), '2026-07-15T14:00:00.000Z');
	assert.equal(a.romeInstant('2026-10-05', '00:00').toISOString(), '2026-10-04T22:00:00.000Z');
});

test('the hour holds on the days the clocks change', () => {
	// 25 October 2026: back to winter time at 03:00. 29 March 2026: forward at 02:00.
	assert.equal(a.romeInstant('2026-10-25', '09:00').toISOString(), '2026-10-25T08:00:00.000Z');
	assert.equal(a.romeInstant('2026-10-24', '23:30').toISOString(), '2026-10-24T21:30:00.000Z');
	assert.equal(a.romeInstant('2026-03-29', '09:00').toISOString(), '2026-03-29T07:00:00.000Z');
});

test('an instant reads back as the day and time in Rome', () => {
	assert.deepEqual(a.romeParts('2026-07-15T22:30:00.000Z'), { day: '2026-07-16', time: '00:30' });
	for (const [day, time] of [['2026-02-28', '23:45'], ['2026-08-01', '07:05'], ['2026-10-25', '18:00']]) assert.deepEqual(a.romeParts(a.romeInstant(day, time)), { day, time });
});

test('a lesson says when it is, start to end', () => {
	assert.equal(a.lessonWhen({ startsAt: '2026-10-08T14:00:00.000Z', durationMin: 90 }), 'giovedì 8 ottobre, 16:00-17:30');
	assert.equal(a.durationLabel(45), '45 min');
	assert.equal(a.durationLabel(120), '2 h');
	assert.equal(a.durationLabel(90), '1 h 30 min');
});

test('weekdays count from Monday, and a week starts on it', () => {
	assert.equal(a.weekdayOf('2026-10-05'), 0);
	assert.equal(a.weekdayOf('2026-10-11'), 6);
	assert.equal(a.mondayOf('2026-10-08'), '2026-10-05');
	assert.equal(a.mondayOf('2026-11-01'), '2026-10-26');
});

test('a weekly lesson repeats until the month ends, not beyond', () => {
	assert.deepEqual(a.weeklyUntilMonthEnd('2026-10-05'), ['2026-10-05', '2026-10-12', '2026-10-19', '2026-10-26']);
	assert.deepEqual(a.weeklyUntilMonthEnd('2026-10-01'), ['2026-10-01', '2026-10-08', '2026-10-15', '2026-10-22', '2026-10-29']);
	assert.deepEqual(a.weeklyUntilMonthEnd('2026-10-28'), ['2026-10-28']);
});

test('a lesson is held once it is confirmed and over', () => {
	const now = Date.parse('2026-10-08T15:00:00Z');
	assert.equal(a.isHeld({ startsAt: '2026-10-08T14:00:00Z', durationMin: 60, status: 'confirmed' }, now), true);
	assert.equal(a.isHeld({ startsAt: '2026-10-08T14:30:00Z', durationMin: 60, status: 'confirmed' }, now), false);
	assert.equal(a.isHeld({ startsAt: '2026-10-01T14:00:00Z', durationMin: 60, status: 'cancelled' }, now), false);
	assert.equal(a.isHeld({ startsAt: '2026-10-01T14:00:00Z', durationMin: 60, status: 'proposed' }, now), false);
});

test('a student needs a name; subject and level are checked when given', () => {
	const subjects = new Set(['matematica']);
	assert.deepEqual(a.parseLinkInput({ name: '  Giulia  ', subject: 'matematica', level: 'high_school' }, subjects), { name: 'Giulia', subject: 'matematica', level: 'high_school' });
	assert.deepEqual(a.parseLinkInput({ name: 'Giulia', subject: '', level: '' }, subjects), { name: 'Giulia', subject: null, level: null });
	assert.equal(typeof a.parseLinkInput({ name: ' ' }, subjects), 'string');
	assert.equal(typeof a.parseLinkInput({ name: 'G', subject: 'latino' }, subjects), 'string');
	assert.equal(typeof a.parseLinkInput({ name: 'G', level: 'asilo' }, subjects), 'string');
	assert.equal(a.parseLinkInput({ name: 'x'.repeat(200) }, subjects).name.length, 80);
});

test('a lesson needs a real day, a time, a sane length and a mode', () => {
	const ok = { day: '2026-10-08', time: '16:00', durationMin: 60, mode: 'online' };
	const subjects = new Set(['matematica', 'fisica']);
	assert.deepEqual(a.parseLessonInput(ok, subjects), { ...ok, place: '', note: '', repeat: false, subject: null, hourlyRate: null });
	assert.equal(a.parseLessonInput({ ...ok, repeat: true }, subjects).repeat, true);
	assert.equal(a.parseLessonInput({ ...ok, repeat: 'yes' }, subjects).repeat, false);
	// The lesson's own subject and price: both optional, both checked.
	assert.deepEqual([a.parseLessonInput({ ...ok, subject: 'fisica', hourlyRate: '17.5' }, subjects).subject, a.parseLessonInput({ ...ok, subject: 'fisica', hourlyRate: '17.5' }, subjects).hourlyRate], ['fisica', 17.5]);
	assert.equal(a.parseLessonInput({ ...ok, hourlyRate: '' }, subjects).hourlyRate, null);
	for (const bad of [{ subject: 'latino' }, { hourlyRate: -1 }, { hourlyRate: 'tanto' }, { hourlyRate: 9999 }]) assert.equal(typeof a.parseLessonInput({ ...ok, ...bad }, subjects), 'string', JSON.stringify(bad));
	assert.equal(a.lessonFee({ durationMin: 90, hourlyRate: 20 }), 30);
	assert.equal(a.lessonFee({ durationMin: 60, hourlyRate: null }), 0);
	for (const bad of [{ day: '2026-13-40' }, { day: '8 ottobre' }, { time: '25:00' }, { time: '9:00' }, { durationMin: 5 }, { durationMin: 1000 }, { durationMin: 'x' }, { mode: 'telefono' }]) assert.equal(typeof a.parseLessonInput({ ...ok, ...bad }, subjects), 'string', JSON.stringify(bad));
});

test('an assignment needs a lesson and a day; the level is optional', () => {
	assert.deepEqual(a.parseAssignmentInput({ lessonPath: 'high_school/math/x', level: '2', due: '2026-10-10' }), { lessonPath: 'high_school/math/x', level: 2, due: '2026-10-10', note: '' });
	assert.equal(a.parseAssignmentInput({ lessonPath: 'high_school/math/x', level: '', due: '2026-10-10' }).level, null);
	assert.equal(typeof a.parseAssignmentInput({ lessonPath: '', due: '2026-10-10' }), 'string');
	assert.equal(typeof a.parseAssignmentInput({ lessonPath: 'x', level: 0, due: '2026-10-10' }), 'string');
	assert.equal(typeof a.parseAssignmentInput({ lessonPath: 'x', due: 'domani' }), 'string');
});

test('free hours are sorted, and overlapping stretches of a day are merged', () => {
	assert.deepEqual(
		a.parseSlots([
			{ weekday: 3, start: '15:00', end: '17:00' },
			{ weekday: 0, start: '16:00', end: '18:00' },
			{ weekday: 0, start: '15:00', end: '16:30' },
			{ weekday: 3, start: '17:00', end: '19:00' },
			{ weekday: 3, start: '09:00', end: '10:00' }
		]),
		[
			{ weekday: 0, start: '15:00', end: '18:00' },
			{ weekday: 3, start: '09:00', end: '10:00' },
			{ weekday: 3, start: '15:00', end: '19:00' }
		]
	);
	assert.deepEqual(a.parseSlots([]), []);
	assert.equal(typeof a.parseSlots('lunedì'), 'string');
	assert.equal(typeof a.parseSlots([{ weekday: 7, start: '15:00', end: '16:00' }]), 'string');
	assert.equal(typeof a.parseSlots([{ weekday: 1, start: '16:00', end: '15:00' }]), 'string');
	assert.equal(typeof a.parseSlots(Array(40).fill({ weekday: 1, start: '15:00', end: '16:00' })), 'string');
	assert.deepEqual(a.slotsByDay([{ weekday: 2, start: '15:00', end: '16:00' }]).map((d) => d.length), [0, 0, 1, 0, 0, 0, 0]);
});

test('a review is a whole vote from one to five', () => {
	assert.deepEqual(a.parseReview({ rating: 4, body: ' Brava ' }), { rating: 4, body: 'Brava' });
	for (const rating of [0, 6, 2.5, 'cinque', undefined]) assert.equal(typeof a.parseReview({ rating }), 'string');
});

test('a month page is whole weeks from Monday, and months shift across years', () => {
	const feb = a.monthGrid('2026-02');
	assert.equal(feb[0], '2026-01-26');
	assert.equal(feb.at(-1), '2026-03-01');
	assert.equal(feb.length % 7, 0);
	// A month that starts on Monday and ends on Sunday shows nothing else.
	assert.deepEqual([a.monthGrid('2027-02')[0], a.monthGrid('2027-02').at(-1), a.monthGrid('2027-02').length], ['2027-02-01', '2027-02-28', 28]);
	assert.equal(a.shiftMonth('2026-01', -1), '2025-12');
	assert.equal(a.shiftMonth('2026-12', 1), '2027-01');
});
