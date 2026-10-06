import { Euler, Matrix4, Object3D, Quaternion, Vector3 } from 'three';
import type { Avatar, PalmFrame } from './avatar';
import { canHold, chooseGrip, cloneAngles, curled, OPEN, PINCHED, pinchGrip, RELAXED, SHAPES, type FingerAngles, type Grip, type Side } from './grasp';
import { revary, specFor, synthesize, type GripChoice } from './grip';
import { orient } from './anim';
import { nextSettle, settlePose, SETTLE, type HandPose } from './settle';

/*
 * What the hands do, between the student's intent and the arm IK (avatar.ts).
 *
 * A hand is free, follows an object (the object is moved by an animation and the hand keeps its grip on it), or
 * carries one (the hand is moved and the object hangs from its grip, placed from the solved hand every frame, so
 * the two never come apart and the wrist never takes a pose the arm cannot).
 *
 * Taking and putting down have no reach, as in most games: the object leaves where it stood and is in the hand,
 * which comes up from the side into view; put down, it is on the bench and the hand goes back down (grasp, drop).
 * A reach to each object had the hand, or the object with it, going through the bench whenever the wrist could not
 * take the pose asked. How the fingers hold each object (grip.ts) is as before.
 *
 * Using what a hand holds still moves it: those motions are planned for the palm and timed like human reaching
 * (minimum-jerk, Flash & Hogan 1985).
 */

type Motion = { from: PalmFrame; to: () => PalmFrame; t: number; dur: number; lift: number; done: () => void };

type HandState = {
	mode: 'free' | 'follow' | 'carry';
	node: Object3D | null;
	grip: Grip | null;
	/** Where the palm goes when nothing is moving it: in carry mode, usually the hold pose. */
	drive: (() => PalmFrame) | null;
	motion: Motion | null;
	/** The palm target as smoothed, so held things lag a little behind the head. */
	smooth: PalmFrame | null;
	/** The same while carrying, in the body's frame. */
	local?: PalmFrame | null;
	grasp: FingerAngles | null;
	/** The grip as chosen at the grasp, to vary it again as the fingers settle (settle.ts). */
	choice: GripChoice | null;
	settle: { a: HandPose; b: HandPose; t: number; dur?: number } | null;
	/** Seconds until the fingers settle again. */
	next: number;
	/**
	 * While a tool works (exact): the palm frame asked for this frame, and how far the palm's target is moved so that
	 * the tool's origin (its tip) is where that frame puts it.
	 */
	exact?: boolean;
	/** After `take` in carry mode: where the object stood, and how far it has come from there to the hand. */
	ease?: { p: Vector3; q: Quaternion; t: number; dur: number } | null;
	/** How fast the carried thing glides to a new pose, 1/s (13 if not given). */
	rate?: number;
	asked?: PalmFrame | null;
	fix?: Vector3;
};

const minJerk = (t: number) => t * t * t * (10 - 15 * t + 6 * t * t);
const UP = new Vector3(0, 1, 0);

export class Hands {
	private h: Record<Side, HandState> = {
		L: { mode: 'free', node: null, grip: null, drive: null, motion: null, smooth: null, grasp: null, choice: null, settle: null, next: 0 },
		R: { mode: 'free', node: null, grip: null, drive: null, motion: null, smooth: null, grasp: null, choice: null, settle: null, next: 0 }
	};

	constructor(
		private avatar: Avatar,
		private hold: (side: Side) => PalmFrame
	) {}

	held(side: Side) {
		const h = this.h[side];
		return h.mode === 'carry' ? h.node : null;
	}

	/** The palm frame of a grip on an object, in the world. */
	static gripFrame(node: Object3D, grip: Grip): PalmFrame {
		node.updateMatrixWorld(true);
		const q = node.getWorldQuaternion(new Quaternion()).multiply(grip.q);
		return { p: grip.p.clone().applyMatrix4(node.matrixWorld), q };
	}

	/** Where an object is when a palm frame holds it by `grip`. */
	static objectFrom(palm: PalmFrame, grip: Grip) {
		const q = palm.q.clone().multiply(grip.q.clone().invert());
		return { position: palm.p.clone().sub(grip.p.clone().applyQuaternion(q)), quaternion: q };
	}

	/** Reach distance to an object from the upright shoulder: the controller refuses what is too far. */
	distance(side: Side, node: Object3D) {
		return node.getWorldPosition(new Vector3()).distanceTo(this.avatar.reachOrigin(side));
	}

	private move(side: Side, to: () => PalmFrame, dur: number, lift = 0) {
		const h = this.h[side];
		const from = h.smooth ?? this.avatar.palmFrame(side);
		return new Promise<void>((done) => {
			h.motion?.done();
			h.motion = { from: { p: from.p.clone(), q: from.q.clone() }, to, t: 0, dur, lift, done };
		});
	}

	/**
	 * Takes an object at once, with no reach: it is in the hand, held by a grip chosen for a comfortable wrist
	 * (`comfort`, a hand rotation), and the arm comes up from the side to the hold pose by itself (the blend from
	 * hanging, avatar.ts). False if the object has no grip.
	 */
	grasp(side: Side, node: Object3D, comfort?: Quaternion) {
		if (!canHold(node.name)) return false;
		const h = this.h[side];
		const objQ = node.getWorldQuaternion(new Quaternion());
		const want = comfort ?? this.avatar.comfort(side, node.getWorldPosition(new Vector3()));
		const solved = SHAPES[node.name] ? synthesize(node.name, this.avatar.handGeo(side), objQ, want, '', true) : null;
		// a flat thing is pinched at a corner (grasp.ts, pinchGrip)
		const geo = PINCHED[node.name] ? this.avatar.handGeo(side) : null;
		const pinched = geo ? pinchGrip(node.name, geo.chains, geo.thumb, geo.palm) : null;
		const grip = pinched?.grip ?? solved?.grip ?? chooseGrip(node.name, side, objQ, want);
		if (!grip) return false;
		h.motion?.done();
		h.motion = null;
		h.grip = grip;
		h.node = node;
		h.grasp = pinched?.angles ?? solved?.angles ?? curled(grip.curl);
		h.choice = solved?.choice ?? null;
		h.settle = null;
		h.next = nextSettle();
		h.drive = null;
		h.smooth = null;
		h.local = null;
		h.exact = false;
		h.fix?.set(0, 0, 0);
		h.ease = null;
		h.mode = 'carry';
		// closed on it from the first frame
		this.avatar.setFingers(side, h.grasp, 1e4);
		return true;
	}

	/** Puts down what a hand carries at once: the object is at its pose, and the hand lets go and goes back down. */
	drop(side: Side, position: Vector3, quaternion: Quaternion) {
		const h = this.h[side];
		if (h.node) {
			h.node.position.copy(position);
			h.node.quaternion.copy(quaternion);
			h.node.updateMatrixWorld(true);
		}
		this.rest(side);
	}

	/**
	 * A free hand comes up in front of the body, stays `dur` seconds in all and goes back down: the one gesture for
	 * working something where it stands (a tap, the goggles), with no reach to it.
	 */
	async gesture(side: Side, dur = 0.45) {
		const h = this.h[side];
		if (h.mode === 'carry') return;
		this.avatar.setFingers(side, RELAXED, 7);
		await this.move(side, () => this.hold(side), dur);
		this.rest(side);
	}

	/**
	 * A free hand goes to a place and stays there, holding nothing (on a stopcock it works), until `release`. The
	 * fingers take the pose given.
	 */
	async reach(side: Side, to: () => PalmFrame, fingers: FingerAngles = RELAXED, dur = 0.4) {
		const h = this.h[side];
		if (h.mode === 'carry') return;
		this.avatar.setFingers(side, fingers, 9);
		h.mode = 'free';
		h.drive = null;
		await this.move(side, to, dur, 0.02);
		if (h.mode !== 'free') return;
		h.mode = 'follow';
		h.drive = to;
	}

	/** Whether a hand is at a place it went to with `reach`. */
	reaching(side: Side) {
		const h = this.h[side];
		return h.mode === 'follow' && !h.node;
	}

	/** The hand that went somewhere with `reach` comes back and hangs again. */
	async retire(side: Side, dur = 0.3) {
		const h = this.h[side];
		if (h.mode === 'carry') return;
		h.mode = 'free';
		h.drive = null;
		await this.move(side, () => this.hold(side), dur);
		if (h.mode === 'free') this.rest(side);
	}

	/** The hand empty and on its way back down to the side. */
	private rest(side: Side) {
		const h = this.h[side];
		h.motion?.done();
		h.mode = 'free';
		h.node = null;
		h.grip = null;
		h.grasp = null;
		h.choice = null;
		h.settle = null;
		h.drive = null;
		h.smooth = null;
		h.motion = null;
		h.exact = false;
		h.fix?.set(0, 0, 0);
		h.ease = null;
		this.avatar.setTarget(side, null);
		this.avatar.setFingers(side, RELAXED, 7);
	}

	/**
	 * Only the first prototype's guided mode (experiment.ts) still reaches for an object, to follow it while an
	 * animation moves it. The grip is chosen for a comfortable wrist (`comfort`, a hand rotation),
	 * the fingers close on its surface. Resolves when the hand holds it.
	 */
	async take(side: Side, node: Object3D, mode: 'carry' | 'follow', comfort?: Quaternion) {
		if (!canHold(node.name)) return false;
		const h = this.h[side];
		const objQ = node.getWorldQuaternion(new Quaternion());
		const at = node.getWorldPosition(new Vector3());
		const want = comfort ?? this.avatar.comfort(side, at);
		// objects with a surface model get a solved grip (grip.ts), one of the saved ones and a little different each
		// time; the odd shapes a fixed hold
		const solved = SHAPES[node.name] ? synthesize(node.name, this.avatar.handGeo(side), objQ, want, '', true) : null;
		const grip = solved?.grip ?? chooseGrip(node.name, side, objQ, want);
		if (!grip) return false;
		h.grip = grip;
		h.node = node;
		h.grasp = solved?.angles ?? curled(grip.curl);
		h.choice = solved?.choice ?? null;
		h.settle = null;
		h.next = nextSettle();
		h.mode = 'free';
		const target = () => Hands.gripFrame(node, grip);
		const pre = () => {
			const g = target();
			const n = new Vector3(0, 0, 1).applyQuaternion(g.q);
			return { p: g.p.clone().addScaledVector(n, -0.075).addScaledVector(UP, 0.035), q: g.q };
		};
		const start = this.avatar.palmFrame(side);
		const dur = Math.min(0.95, Math.max(0.45, 0.35 + start.p.distanceTo(target().p) * 0.5));
		// transport, opening the hand; then close in while the fingers wrap
		this.avatar.setFingers(side, OPEN, 1 / (dur * 0.28));
		await this.move(side, pre, dur, 0.04);
		this.avatar.setFingers(side, h.grasp, 11);
		await this.move(side, target, 0.24);
		h.mode = mode;
		if (mode === 'follow') h.drive = target;
		// taken where it stood: it comes to the hand as the wrist really holds it over a moment, not at once
		else h.ease = { p: node.position.clone(), q: node.quaternion.clone(), t: 0, dur: 0.3 };
		return true;
	}

	/**
	 * While `on`, the origin of what the hand carries (a tool's tip) goes exactly where the palm frames asked of the
	 * hand put it. The wrist has limits, and where it stops short the hand comes out turned a little differently, which
	 * at the end of a long tool is centimetres: each frame the tip's miss moves the palm's target the other way.
	 */
	exact(side: Side, on: boolean) {
		this.h[side].exact = on;
	}

	/**
	 * How to turn what `side` holds so that its axis (local Y) is along `axis` with the wrist prone: of the turns about
	 * the axis, the one that puts the back of the hand most upwards.
	 */
	prone(side: Side, axis: Vector3): Quaternion {
		const a = axis.clone().normalize();
		const base = new Quaternion().setFromUnitVectors(UP, a);
		const grip = this.h[side].grip;
		if (!grip) return base;
		let best = base;
		let low = Infinity;
		for (let k = 0; k < 72; k++) {
			const q = new Quaternion().setFromAxisAngle(a, (k / 72) * Math.PI * 2).multiply(base);
			// the palm's normal, as low as it goes
			const y = new Vector3(0, 0, 1).applyQuaternion(q.clone().multiply(grip.q)).y;
			if (y < low) {
				low = y;
				best = q;
			}
		}
		return best;
	}

	/** The thumb pushes down on what is under it (a tool's button), or lets it come back. */
	press(side: Side, on: boolean) {
		const h = this.h[side];
		if (!h.grasp) return;
		const a = cloneAngles(h.grasp);
		if (on) {
			a.t[2] += 0.16;
			a.t[3] += 0.12;
		}
		this.avatar.setFingers(side, a, 25);
	}

	/**
	 * How to turn what `side` holds so that its axis (local Y) is along `axis`, to work with its origin at `at`.
	 *
	 * With `face`, the direction its local Z must look (a spatula's scoop opens one way), the tool's turn is given, and
	 * the fingers take it again where round it the wrist is comfortable there (they settle into the new grip in `dur`
	 * seconds, while the hand moves; with the palm kept still, that rolls the tool over between the fingers). Without
	 * it, the turn about the axis is the one the wrist finds most comfortable with the grip it has.
	 */
	aim(side: Side, axis: Vector3, at: Vector3, face?: Vector3, dur: number = SETTLE.dur): Quaternion {
		const h = this.h[side];
		const a = axis.clone().normalize();
		const base = new Quaternion().setFromUnitVectors(UP, a);
		const grip = h.grip;
		if (!h.node || !grip) return base;
		const comfort = (q: Quaternion) => this.avatar.comfort(side, grip.p.clone().applyQuaternion(q).add(at));
		if (face) {
			const q = orient(a, face);
			const again = SHAPES[h.node.name] ? synthesize(h.node.name, this.avatar.handGeo(side), q, comfort(q)) : null;
			// only if the hand has to move round it: the same place is the grip it has
			const same = again?.choice && h.choice && Math.abs(again.choice.phi - h.choice.phi) < 1e-6 && again.choice.up === h.choice.up;
			if (again && h.grasp && !same) {
				// a settling under way ends where it was going
				const from = h.settle ? h.settle.b : { grip, angles: h.grasp };
				h.settle = { a: from, b: { grip: again.grip, angles: again.angles }, t: 0, dur };
				h.choice = again.choice ?? h.choice;
			}
			return q;
		}
		let best = base;
		let cost = Infinity;
		for (let k = 0; k < 36; k++) {
			const q = new Quaternion().setFromAxisAngle(a, (k / 36) * Math.PI * 2).multiply(base);
			const c = q.clone().multiply(grip.q).angleTo(comfort(q));
			if (c < cost) {
				cost = c;
				best = q;
			}
		}
		return best;
	}

	/** Moves what a hand carries so that its palm reaches `to` (a frame or a changing one). */
	carry(side: Side, to: () => PalmFrame, dur: number, lift = 0) {
		return this.move(side, to, dur, lift);
	}

	/** In carry mode, keep the palm following `drive` (the hold pose if null). */
	drive(side: Side, drive: (() => PalmFrame) | null, rate = 13) {
		this.h[side].drive = drive;
		this.h[side].rate = rate;
	}

	/** Where a hand holds what it carries, in the object's frame. */
	gripOf(side: Side) {
		return this.h[side].grip;
	}

	/** The palm frame that puts the held object at `position`/`quaternion`. */
	palmFor(side: Side, position: Vector3, quaternion: Quaternion): PalmFrame {
		const grip = this.h[side].grip!;
		return { p: grip.p.clone().applyQuaternion(quaternion).add(position), q: quaternion.clone().multiply(grip.q) };
	}

	/**
	 * Leaves a carried object at a pose as part of using it (the thermometer in the beaker, the paper in the funnel),
	 * lets go and takes the hand back; putting down on the bench is drop. The hand may not reach the pose exactly
	 * (the wrist has limits), so for the last centimetres the object leaves the hand and settles on the surface by
	 * itself: it never ends tilted into the bench.
	 */
	async place(side: Side, position: Vector3, quaternion: Quaternion) {
		const h = this.h[side];
		const at = this.palmFor(side, position, quaternion);
		const above = { p: at.p.clone().addScaledVector(UP, 0.06), q: at.q };
		const d = this.avatar.palmFrame(side).p.distanceTo(above.p);
		await this.move(side, () => above, Math.min(0.9, 0.35 + d * 0.5), 0.03);
		await this.move(side, () => at, 0.22);
		if (h.node) this.settle(h.node, position, quaternion, 0.14);
		h.mode = 'free';
		await this.release(side);
	}

	private settling: { node: Object3D; p0: Vector3; q0: Quaternion; p1: Vector3; q1: Quaternion; t: number; dur: number }[] = [];

	/** Moves a free object to a pose over `dur` seconds, easing in. */
	private settle(node: Object3D, p: Vector3, q: Quaternion, dur: number) {
		this.settling.push({ node, p0: node.position.clone(), q0: node.quaternion.clone(), p1: p.clone(), q1: q.clone(), t: 0, dur });
	}

	/** Opens the hand, leaves the object where it is and brings the arm back. */
	async release(side: Side) {
		const h = this.h[side];
		const from = h.smooth ?? this.avatar.palmFrame(side);
		h.mode = 'free';
		h.drive = null;
		this.avatar.setFingers(side, OPEN, 18);
		const n = new Vector3(0, 0, 1).applyQuaternion(from.q);
		const back = { p: from.p.clone().addScaledVector(n, -0.07).addScaledVector(UP, 0.05), q: from.q.clone() };
		await this.move(side, () => from, 0.12);
		await this.move(side, () => back, 0.28);
		h.node = null;
		h.grip = null;
		h.grasp = null;
		h.choice = null;
		h.settle = null;
		h.smooth = null;
		h.motion = null;
		h.exact = false;
		h.fix?.set(0, 0, 0);
		h.ease = null;
		this.avatar.setTarget(side, null);
		this.avatar.setFingers(side, RELAXED, 7);
	}



	/** Whether held things settle in the hand now and then (settle.ts). */
	settleHeld = true;

	/**
	 * The fingers settling on what a hand carries: now and then, while it is only being held, the grip moves to a
	 * new variation of itself. The palm keeps its place and the object shifts in it, so the fingers never leave its
	 * surface by more than their lift.
	 */
	private settleStep(side: Side, dt: number) {
		const h = this.h[side];
		if (h.mode !== 'carry' || !h.node || !h.grip || !h.grasp) return;
		if (h.settle) {
			const st = h.settle;
			st.t += dt;
			const dur = st.dur ?? SETTLE.dur;
			const now = settlePose(st.a, st.b, st.t / dur);
			h.grip = now.grip;
			this.avatar.setFingers(side, now.angles, 1e4);
			if (st.t >= dur) {
				h.grip = st.b.grip;
				h.grasp = st.b.angles;
				h.settle = null;
				h.next = nextSettle();
			}
			return;
		}
		// only while simply held: not while the hand pours, stirs or moves
		if (!this.settleHeld || !h.choice || h.drive || h.motion || h.exact) return;
		h.next -= dt;
		if (h.next > 0) return;
		const r = revary(h.choice, this.avatar.handGeo(side));
		if (!r) {
			h.next = nextSettle();
			return;
		}
		h.settle = { a: { grip: h.grip, angles: h.grasp }, b: { grip: r.grip, angles: r.angles }, t: 0 };
	}

	private dt = 0;

	/** Sets the palm targets for the IK; call before the avatar solves. */
	update(dt: number) {
		this.dt = dt;
		this.settleStep('L', dt);
		this.settleStep('R', dt);
		this.settling = this.settling.filter((st) => {
			st.t += dt;
			const k = minJerk(Math.min(1, st.t / st.dur));
			st.node.position.lerpVectors(st.p0, st.p1, k);
			st.node.quaternion.slerpQuaternions(st.q0, st.q1, k);
			st.node.updateMatrixWorld(true);
			return st.t < st.dur;
		});
		for (const side of ['L', 'R'] as Side[]) {
			const h = this.h[side];
			let target: PalmFrame | null = null;
			if (h.motion || h.mode !== 'carry') h.local = null;
			if (h.motion) {
				const m = h.motion;
				m.t += dt;
				const k = Math.min(1, m.t / m.dur);
				const s = minJerk(k);
				const to = m.to();
				target = { p: m.from.p.clone().lerp(to.p, s).addScaledVector(UP, Math.sin(Math.PI * k) * m.lift), q: m.from.q.clone().slerp(to.q, s) };
				h.smooth = target;
				if (k >= 1) {
					h.motion = null;
					m.done();
				}
			} else if (h.mode === 'follow' && h.drive) {
				target = h.drive();
				h.smooth = target;
			} else if (h.mode === 'carry') {
				const want = (h.drive ?? (() => this.hold(side)))();
				// eased in the body's frame, so a change of hold pose glides but walking leaves nothing behind (the trailing
				// of the head's turns is in the hold pose itself: fps.ts, swing)
				const body = this.avatar.root;
				const inv = body.matrixWorld.clone().invert();
				const bq = body.getWorldQuaternion(new Quaternion());
				const local = { p: want.p.clone().applyMatrix4(inv), q: bq.clone().invert().multiply(want.q) };
				if (!h.local) h.local = h.smooth ? { p: h.smooth.p.clone().applyMatrix4(inv), q: bq.clone().invert().multiply(h.smooth.q) } : local;
				else {
					const a = 1 - Math.exp(-dt * (h.rate ?? 13));
					h.local = { p: h.local.p.lerp(local.p, a), q: h.local.q.slerp(local.q, a) };
				}
				h.smooth = { p: h.local.p.clone().applyMatrix4(body.matrixWorld), q: bq.multiply(h.local.q) };
				target = h.smooth;
			} else if (h.smooth) target = h.smooth;
			h.asked = target;
			// the correction of a tool at work (exact), which fades once the work is over
			if (target && h.fix && h.fix.lengthSq() > 1e-10) target = { p: target.p.clone().add(h.fix), q: target.q };
			if (target) this.avatar.setTarget(side, target);
		}
	}

	/** Places what the hands carry where the solved hands are; call after the avatar solves. */
	after() {
		for (const side of ['L', 'R'] as Side[]) {
			const h = this.h[side];
			if (h.mode !== 'carry' || !h.node || !h.grip) continue;
			const o = Hands.objectFrom(this.avatar.palmFrame(side), h.grip);
			const fix = (h.fix ??= new Vector3());
			if (h.exact && h.asked) {
				fix.addScaledVector(Hands.objectFrom(h.asked, h.grip).position.sub(o.position), 1 - Math.exp(-this.dt * 25));
				if (fix.length() > 0.12) fix.setLength(0.12);
			} else fix.multiplyScalar(Math.exp(-this.dt * 6));
			h.node.position.copy(o.position);
			h.node.quaternion.copy(o.quaternion);
			if (h.ease) {
				const k = minJerk(Math.min(1, (h.ease.t += this.dt) / h.ease.dur));
				h.node.position.lerpVectors(h.ease.p, o.position, k);
				h.node.quaternion.slerpQuaternions(h.ease.q, o.quaternion, k);
				if (k >= 1) h.ease = null;
			}
			h.node.updateMatrixWorld(true);
		}
	}
}

/** How far the forearm turns the palm down when it carries something held like a pen. */
export const PEN_PRONATION = (65 * Math.PI) / 180;

/** Whether an object is held like a pen. */
/**
 * How a tool with a button points while it is only held, in the student's own terms and for the right hand (the left
 * mirrors it): its axis from the nozzle back to the body, and where the button looks. The nozzle up and ahead, the
 * button up and towards the student, who sees the thumb on it.
 */
const BUTTON_HOLD = { axis: new Vector3(0.26, -0.75, 0.61), face: new Vector3(-0.37, 0.5, 0.78) };

/**
 * The hold pose for what the hand holds: `frame` as it is, or, for a tool with a button, turned round the tool so
 * that the tool points as BUTTON_HOLD says whatever the grip on it is.
 */
export function toolHold(frame: PalmFrame, side: Side, node: Object3D | null | undefined, grip: Grip | null, yaw: number): PalmFrame {
	if (!node || !grip) return frame;
	if (PINCHED[node.name]) {
		// a flat thing pinched at a corner: its face to the eyes, the corner held low and to the hand's side
		const m = side === 'L' ? -1 : 1;
		const yq0 = new Quaternion().setFromAxisAngle(UP, yaw);
		const d = (v: Vector3) => new Vector3(v.x * m, v.y, v.z).applyQuaternion(yq0).normalize();
		const a = d(PLATE_HOLD.away);
		const u = d(PLATE_HOLD.up);
		u.addScaledVector(a, -u.dot(a)).normalize();
		return { p: frame.p, q: orient(a, u.clone().sub(new Vector3().crossVectors(a, u))).multiply(grip.q) };
	}
	const hold = SHAPES[node.name]?.button ? BUTTON_HOLD : node.name === 'Spatula' ? (node.userData.full ? SPATULA_HOLD.full : SPATULA_HOLD.empty) : null;
	if (!hold) return frame;
	const mirror = side === 'L' ? -1 : 1;
	const yq = new Quaternion().setFromAxisAngle(UP, yaw);
	const dir = (v: Vector3) => new Vector3(v.x * mirror, v.y, v.z).applyQuaternion(yq);
	return { p: frame.p, q: orient(dir(hold.axis), dir(hold.face)).multiply(grip.q) };
}

/**
 * How a flat thing pinched at a corner is held while it is only held, for the right hand: where its far face looks
 * (away from the student and down: the near face is tilted up to the eyes), and where it goes on from the corner held
 * (up and towards the middle).
 */
const PLATE_HOLD = { away: new Vector3(0.12, -0.42, -1), up: new Vector3(-1, 1, 0) };

/**
 * How the spatula lies while it is only held, in the same terms: its axis from the scoop back to the handle, and
 * where its local Z looks (the scoop opens the other way, upwards). The scoop ahead and towards the middle, in line
 * with the forearm, the palm up. Full, it is level, the scoop a touch higher than the handle, or the powder would
 * slide off; empty, the scoop hangs a little.
 */
export const SPATULA_AXIS = { out: 0.5, back: 0.9 };
const SPATULA_HOLD = {
	empty: { axis: new Vector3(SPATULA_AXIS.out, 0.3, SPATULA_AXIS.back), face: new Vector3(0, -1, 0) },
	full: { axis: new Vector3(SPATULA_AXIS.out, -0.06, SPATULA_AXIS.back), face: new Vector3(0, -1, 0) }
};

export function penHeld(node: Object3D | null | undefined) {
	return !!node && specFor(node.name)?.type === 'tripod';
}

/** A hand rotation from fingers direction and palm normal. */
export function frameFrom(F: Vector3, N: Vector3): Quaternion {
	const y = F.clone().normalize();
	const z = N.clone().addScaledVector(y, -N.dot(y)).normalize();
	const x = new Vector3().crossVectors(y, z);
	return new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(x, y, z));
}

/**
 * The hold pose in front of the body: palm low and to the side, fingers forward and a little inwards, palm facing the
 * middle, thumb up: the neutral, half-turned forearm a person holds a glass with. It follows the gaze, but only a
 * little up or down.
 */
export function holdFrame(side: Side, camera: { position: Vector3 }, yaw: number, pitch: number, offset?: Vector3, follow = 0.6, pronate = 0): PalmFrame {
	const sign = side === 'R' ? 1 : -1;
	const frame = new Quaternion().setFromEuler(new Euler(Math.max(-0.9, Math.min(0.25, pitch)) * follow, yaw, 0, 'YXZ'));
	const p = camera.position.clone().add((offset ?? new Vector3(sign * 0.15, -0.23, -0.36)).clone().applyQuaternion(frame));
	const yq = new Quaternion().setFromAxisAngle(UP, yaw);
	const F = new Vector3(-sign * 0.28, 0.04, -1).normalize().applyQuaternion(yq);
	const N = sign > 0 ? new Vector3().crossVectors(UP, F) : new Vector3().crossVectors(F, UP);
	// a pronated forearm turns the palm towards the floor: what is held like a pen then points down
	if (pronate) N.multiplyScalar(Math.cos(pronate)).addScaledVector(UP, -Math.sin(pronate));
	return { p, q: frameFrom(F, N) };
}
