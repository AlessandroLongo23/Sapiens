import type { Action } from './free';

/*
 * The controller. The browser's Gamepad API gives buttons and sticks in one standard order, the same for a
 * PlayStation and an Xbox controller, so the game reads them once (fps.ts); only what the buttons are called differs.
 * The device shown on screen is the last one used, as in a game: touch a stick and the prompts show the controller's
 * buttons, press a key or click and they show the keyboard's again.
 *
 * The layout keeps the game's rule, a side of the controller per hand: the triggers take and put down (L2 the left
 * hand, R2 the right), the bumpers use (L1, R1). The left stick walks, the right one looks; the d-pad up and down is
 * the mouse wheel; square (X on an Xbox) and the d-pad left and right turn what is about to be put down.
 */

export type Device = 'keys' | 'playstation' | 'xbox';

/** The standard mapping's button indices (w3c.github.io/gamepad, "standard gamepad"). */
export const PAD = { south: 0, east: 1, west: 2, north: 3, l1: 4, r1: 5, l2: 6, r2: 7, select: 8, start: 9, l3: 10, r3: 11, up: 12, down: 13, left: 14, right: 15 } as const;

/** Sony's controllers by name or by USB vendor (054c); anything else is labelled as an Xbox one, the commonest on a PC. */
export function padKind(id: string): Exclude<Device, 'keys'> {
	if (/xbox|045e|xinput/i.test(id)) return 'xbox';
	return /054c|dualshock|dualsense|playstation|\bps[345]\b|wireless controller/i.test(id) ? 'playstation' : 'xbox';
}

let device: Device = 'keys';
const listeners = new Set<() => void>();

export const getDevice = () => device;
export const serverDevice = (): Device => 'keys';

export function setDevice(d: Device) {
	if (d === device) return;
	device = d;
	for (const fn of listeners) fn();
}

export function onDevice(fn: () => void) {
	listeners.add(fn);
	return () => void listeners.delete(fn);
}

/** What an input is called on a controller: a short name, or a face button's symbol (drawn in hud.tsx). */
export const PAD_NAMES: Record<Exclude<Device, 'keys'>, Record<Action['input'], string>> = {
	playstation: { L: 'L2', R: 'R2', Q: 'L1', E: 'R1', W: 'dpad', KeyR: 'square' },
	xbox: { L: 'LT', R: 'RT', Q: 'LB', E: 'RB', W: 'dpad', KeyR: 'X' }
};

const PHRASES: Record<string, [keys: string, pad: (d: Exclude<Device, 'keys'>) => string]> = {
	Q: ['Q', (d) => PAD_NAMES[d].Q],
	E: ['E', (d) => PAD_NAMES[d].E],
	L: ['clic sinistro', (d) => PAD_NAMES[d].L],
	R: ['clic destro', (d) => PAD_NAMES[d].R],
	clic: ['fai clic', () => 'premi il grilletto'],
	'clic con': ['fai clic con', () => 'premi il grilletto di'],
	'clic con la': ['fai clic con la', () => 'premi il grilletto della'],
	'gira su': ['gira la rotella in avanti', () => 'tieni premuta la croce direzionale in su'],
	'gira giù': ['gira la rotella verso di te', () => 'tieni premuta la croce direzionale in giù'],
	gira: ['gira la rotella', () => 'usa la croce direzionale, su e giù'],
	'con la rotella': ['con la rotella', () => 'con la croce direzionale'],
	su: ['rotella in avanti', () => 'croce direzionale in su'],
	giù: ['rotella verso di te', () => 'croce direzionale in giù']
};

/**
 * A text that names inputs, for the device in use. The inputs are written in braces: {Q} and {E} the hands' use
 * keys, {L} and {R} the buttons that take and put down, {clic}, {gira}… the phrases above. A capital first letter in
 * the braces gives one in the text.
 */
export function tell(text: string, d: Device = device) {
	return text.replace(/\{([^}]+)\}/g, (all, key: string) => {
		const lower = key[0].toLowerCase() + key.slice(1);
		const p = PHRASES[key] ?? PHRASES[lower];
		if (!p) return all;
		const out = d === 'keys' ? p[0] : p[1](d);
		return PHRASES[key] ? out : out[0].toUpperCase() + out.slice(1);
	});
}
