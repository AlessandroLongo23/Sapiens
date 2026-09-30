import { Euler, Matrix4, Object3D, Quaternion, Vector3 } from 'three';
import type { Avatar, PalmFrame } from './avatar';
import { canHold, chooseGrip, curled, OPEN, RELAXED, SHAPES, type FingerAngles, type Grip, type Side } from './grasp';
import { revary, specFor, synthesize, type GripChoice } from './grip';
import { nextSettle, settlePose, SETTLE, type HandPose } from './settle';

/*
 * What the hands do, between the student's intent and the arm IK (avatar.ts).
 *
 * A hand is free, follows an object (the object is moved by an animation and the hand keeps its grip on it), or
 * carries one (the hand is moved and the object hangs from its grip, placed from the solved hand every frame, so
 * the two never come apart and the wrist never takes a pose the arm cannot).
 *
 * Motions are planned for the palm and timed like human reaching (minimum-jerk, Flash & Hogan 1985): the hand opens
 * wide on the way, largest about two thirds into the transport, stops a few centimetres off the object, then closes
 * in as the fingers wrap (Jeannerod's transport and grasp components).
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
	settle: { a: HandPose; b: HandPose; t: number } | null;
	/** Seconds until the fingers settle again. */
	next: number;
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
	 * Reaches for an object and takes it: the grip is chosen for a comfortable wrist (`comfort`, a hand rotation),
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
		return true;
	}

	/** Moves what a hand carries so that its palm reaches `to` (a frame or a changing one). */
	carry(side: Side, to: () => PalmFrame, dur: number, lift = 0) {
		return this.move(side, to, dur, lift);
	}

	/** In carry mode, keep the palm following `drive` (the hold pose if null). */
	drive(side: Side, drive: (() => PalmFrame) | null) {
		this.h[side].drive = drive;
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
	 * Sets a carried object down at a pose, lets go and takes the hand back. The hand may not reach the pose exactly
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
			const now = settlePose(st.a, st.b, st.t / SETTLE.dur);
			h.grip = now.grip;
			this.avatar.setFingers(side, now.angles, 1e4);
			if (st.t >= SETTLE.dur) {
				h.grip = st.b.grip;
				h.grasp = st.b.angles;
				h.settle = null;
				h.next = nextSettle();
			}
			return;
		}
		// only while simply held: not while the hand pours, stirs or moves
		if (!this.settleHeld || !h.choice || h.drive || h.motion) return;
		h.next -= dt;
		if (h.next > 0) return;
		const r = revary(h.choice, this.avatar.handGeo(side));
		if (!r) {
			h.next = nextSettle();
			return;
		}
		h.settle = { a: { grip: h.grip, angles: h.grasp }, b: { grip: r.grip, angles: r.angles }, t: 0 };
	}

	/** Sets the palm targets for the IK; call before the avatar solves. */
	update(dt: number) {
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
					const a = 1 - Math.exp(-dt * 13);
					h.local = { p: h.local.p.lerp(local.p, a), q: h.local.q.slerp(local.q, a) };
				}
				h.smooth = { p: h.local.p.clone().applyMatrix4(body.matrixWorld), q: bq.multiply(h.local.q) };
				target = h.smooth;
			} else if (h.smooth) target = h.smooth;
			if (target) this.avatar.setTarget(side, target);
		}
	}

	/** Places what the hands carry where the solved hands are; call after the avatar solves. */
	after() {
		for (const side of ['L', 'R'] as Side[]) {
			const h = this.h[side];
			if (h.mode !== 'carry' || !h.node || !h.grip) continue;
			const o = Hands.objectFrom(this.avatar.palmFrame(side), h.grip);
			h.node.position.copy(o.position);
			h.node.quaternion.copy(o.quaternion);
			h.node.updateMatrixWorld(true);
		}
	}
}

/** How far the forearm turns the palm down when it carries something held like a pen. */
export const PEN_PRONATION = (65 * Math.PI) / 180;

/** Whether an object is held like a pen. */
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
