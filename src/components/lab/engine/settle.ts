import { cloneAngles, type FingerAngles, type Grip } from './grasp';

/*
 * The fingers settling on something held: every so often the hand shifts its grip a little, the way nobody holds a
 * glass perfectly still. The object stays where it is; the palm slides to a new variation of the same grip (grip.ts,
 * revary) while the fingers, one after the other, lift slightly off the surface and come down again in their new
 * place: index, middle, ring, little finger, then the thumb, which holds the object meanwhile.
 */

export type HandPose = { grip: Grip; angles: FingerAngles };

export const SETTLE = {
	/** The whole settling, seconds. */
	dur: 0.8,
	/** How far a finger lifts at the knuckle (radians); the middle joint lifts 60% of it, the tip 40%. */
	lift: (12 * Math.PI) / 180,
	/** Delay between one finger and the next, as a fraction of `dur`. */
	stagger: 0.09,
	/** How long each finger takes, as a fraction of `dur`. */
	window: 0.5,
	/** Seconds between settlings while something is held, at random between the two. */
	every: [5, 12] as const
};

const minJerk = (t: number) => t * t * t * (10 - 15 * t + 6 * t * t);

/** Where finger `i` (0..3, the thumb 4) is in its own lift, 0..1, at `k` of the settling. */
function phase(i: number, k: number) {
	const start = i * SETTLE.stagger;
	return Math.min(1, Math.max(0, (k - start) / SETTLE.window));
}

/** The hand at `k` (0..1) of a settling from `a` to `b`. */
export function settlePose(a: HandPose, b: HandPose, k: number, out?: HandPose): HandPose {
	const s = minJerk(Math.min(1, Math.max(0, k)));
	const grip: Grip = out?.grip ?? { ...b.grip, p: a.grip.p.clone(), q: a.grip.q.clone() };
	grip.p.lerpVectors(a.grip.p, b.grip.p, s);
	grip.q.slerpQuaternions(a.grip.q, b.grip.q, s);
	const angles = out?.angles ?? cloneAngles(a.angles);
	for (let i = 0; i < 4; i++) {
		const u = phase(i, k);
		const e = minJerk(u);
		const up = Math.sin(Math.PI * u) * SETTLE.lift;
		const fa = a.angles.f[i];
		const fb = b.angles.f[i];
		const f = angles.f[i];
		for (let j = 0; j < 4; j++) f[j] = fa[j] + (fb[j] - fa[j]) * e;
		f[0] -= up;
		f[1] -= up * 0.6;
		f[2] -= up * 0.4;
	}
	// the thumb last, and less: it is what keeps the object while the fingers move
	const u = phase(4, k);
	const e = minJerk(u);
	const up = Math.sin(Math.PI * u) * SETTLE.lift * 0.6;
	for (let j = 0; j < 5; j++) angles.t[j] = a.angles.t[j] + (b.angles.t[j] - a.angles.t[j]) * e;
	angles.t[2] -= up;
	angles.t[3] -= up * 0.7;
	return { grip, angles };
}

/** Seconds until the next settling. */
export function nextSettle(rnd: () => number = Math.random) {
	return SETTLE.every[0] + rnd() * (SETTLE.every[1] - SETTLE.every[0]);
}
