import { Euler, Matrix4, Mesh, MeshDepthMaterial, Object3D, Quaternion, RGBADepthPacking, SkinnedMesh, Sphere, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { cloneAngles, RELAXED, type Chain, type FingerAngles, type Side } from './grasp';
import type { HandGeo } from './grip';

/*
 * The student's body in first person (scripts/lab/build_avatar.py): a lab coat, and arms and gloved hands that are
 * one continuous skinned mesh each, on a skeleton whose joints all flex about their local X axis.
 *
 * Each frame the arms solve towards a palm target (a point and a hand rotation, see grasp.ts) the way VR arm IK does
 * it (after VRArmIK, github.com/dabeschte/VRArmIK):
 * - the torso leans over the bench (up to 45°) and the collarbone shrugs forward when a reach is long or high;
 * - the elbow's swivel round the shoulder–wrist line comes from where the hand is relative to the shoulder (low and
 *   close: tucked in; high or across the body: out to the side) and from the hand's roll (palm down: out), smoothed;
 * - the upper arm and forearm are set as a hinge; the wrist's roll is split between the forearm's twist bone (60%)
 *   and the wrist (40%), so the skin does not collapse;
 * - the wrist is held within its anatomical range (flexion 73°, extension 65°, radial 19°, ulnar 33°; normal values
 *   in Ryu et al., J Hand Surg 1991).
 * Fingers take the angles given by the hand's controller (hands.ts), smoothed.
 */

/** Eyes in the avatar's frame; the camera sits there. */
const EYE = new Vector3(0, 1.662, -0.092);
const D = Math.PI / 180;
const FINGER_NAMES = ['Index', 'Middle', 'Ring', 'Pinky'];

export type PalmFrame = { p: Vector3; q: Quaternion };

const _q = new Quaternion();
const _q2 = new Quaternion();
const _v = new Vector3();
const _m = new Matrix4();
const UP = new Vector3(0, 1, 0);

const SKINNED_DEPTH = new MeshDepthMaterial({ depthPacking: RGBADepthPacking });

function worldPos(o: Object3D, out = new Vector3()) {
	return o.getWorldPosition(out);
}

/*
 * Matrices: a world position or rotation read (getWorldPosition, getWorldQuaternion) brings the chain above it up to
 * date by itself, so the solver updates one bone when it turns it, not its whole subtree: forcing the subtree
 * recomputed the fingers ten times a frame for every person. The fingers' matrices are computed once, when the scene
 * is drawn.
 */
function setWorldQuat(o: Object3D, q: Quaternion) {
	o.parent!.getWorldQuaternion(_q2);
	o.quaternion.copy(_q2.invert().multiply(q));
	o.updateWorldMatrix(false, false);
}

function basis(x: Vector3, y: Vector3, z: Vector3) {
	return new Quaternion().setFromRotationMatrix(_m.makeBasis(x, y, z));
}

/** The twist of `q` about the local Y axis, in radians. */
function twistY(q: Quaternion) {
	return 2 * Math.atan2(q.y, q.w);
}

type Arm = {
	side: Side;
	sign: number;
	shoulder: Object3D;
	upper: Object3D;
	fore: Object3D;
	twist: Object3D;
	hand: Object3D;
	fingers: Object3D[][];
	thumb: Object3D[];
	chains: Chain[];
	thumbChain: Chain;
	a: number;
	b: number;
	/** Palm centre in the hand bone's frame. */
	palm: Vector3;
	/** The glove's vertices that move with the hand bone (palm and back of the hand), in its frame. */
	palmVerts: Vector3[];
	/** The hand's rest rotation relative to the twist bone. */
	handRest: Quaternion;
	rest: Map<Object3D, Quaternion>;
	target: PalmFrame | null;
	weight: number;
	want: number;
	swivel: number;
	angles: FingerAngles;
	goal: FingerAngles;
	fingerRate: number;
	/** How far the hand still is from its target, after limits. */
	miss: number;
};

export class Avatar {
	readonly root: Object3D;
	private spine: Object3D;
	private spineRest: Quaternion;
	private lean = 0;
	private arms: Record<Side, Arm>;
	/** The shoulders standing upright, in the body's frame: where reach is measured from. */
	private reachLocal: Record<Side, Vector3>;

	private constructor(root: Object3D) {
		this.root = root;
		root.traverse((o) => {
			const m = o as Mesh;
			if (!m.isMesh) return;
			m.castShadow = true;
			m.receiveShadow = true;
			m.userData.noPick = true;
			m.frustumCulled = false;
			// in first person only the arms show: the head is round the camera, and the chest and legs would fill the view
			// when leaning over the bench (games hide them too)
			if (/^Avatar(Body|Head|Hair|Eyes|Neck|Coat|Buttons|Pocket|Legs|Shoes)/.test(m.name)) m.visible = false;
			if ((m as SkinnedMesh).isSkinnedMesh) {
				(m as SkinnedMesh).normalizeSkinWeights();
				// their own shadow material: three.js draws every caster with one depth material, and switching it between
				// skinned and rigid meshes makes it look its shader up again each time, for every person in the room
				m.customDepthMaterial = SKINNED_DEPTH;
			}
		});
		root.updateMatrixWorld(true);
		this.spine = this.node('Spine');
		this.spineRest = this.spine.quaternion.clone();
		this.arms = { L: this.arm('L'), R: this.arm('R') };
		const inv = root.matrixWorld.clone().invert();
		this.reachLocal = { L: worldPos(this.arms.L.upper).applyMatrix4(inv), R: worldPos(this.arms.R.upper).applyMatrix4(inv) };
	}

	static async load(url: string) {
		const gltf = await new GLTFLoader().loadAsync(url);
		return new Avatar(gltf.scene);
	}

	/** The body as loaded, to make many people from (fromTemplate) with one download and one parse. */
	static async template(url: string) {
		return (await new GLTFLoader().loadAsync(url)).scene;
	}

	static fromTemplate(template: Object3D) {
		return new Avatar(cloneSkinned(template));
	}

	/**
	 * Someone else in the room: the whole body shows (the old head stays hidden, a kit head takes its place), and the
	 * meshes are culled against a sphere that holds any reach, so the people behind the camera are not drawn.
	 */
	showBody() {
		const reach = new Sphere(new Vector3(0, 1.0, 0), 1.25);
		this.root.traverse((o) => {
			const m = o as Mesh;
			if (!m.isMesh || m.name === 'KitHead') return;
			m.visible = m.name !== 'AvatarHead';
			if ((m as SkinnedMesh).isSkinnedMesh) {
				(m as SkinnedMesh).boundingSphere = reach.clone();
				m.frustumCulled = true;
			}
		});
	}

	private node(name: string) {
		const n = this.root.getObjectByName(name);
		if (!n) throw new Error(`avatar: no ${name}`);
		return n;
	}

	private arm(side: Side): Arm {
		const n = (s: string) => this.node(`${s}_${side}`);
		const shoulder = n('Shoulder');
		const upper = n('UpperArm');
		const fore = n('ForeArm');
		const twist = n('ForeArmTwist');
		const hand = n('Hand');
		const fingers = FINGER_NAMES.map((f) => [1, 2, 3].map((i) => n(`${f}${i}`)));
		const thumb = [1, 2, 3].map((i) => n(`Thumb${i}`));
		const rest = new Map<Object3D, Quaternion>();
		for (const o of [shoulder, upper, fore, twist, hand, ...fingers.flat(), ...thumb]) rest.set(o, o.quaternion.clone());
		const verts = this.gloveVerts(side, [hand, ...fingers.flat(), ...thumb]);
		const chain = (bones: Object3D[]): Chain => ({
			pos: bones.map((b) => b.position.clone()),
			rot: bones.map((b) => b.quaternion.clone()),
			tip: bones[2].position.length() * 0.8,
			verts: verts ? bones.map((b) => verts.get(b) ?? []) : undefined
		});
		const middle1 = fingers[1][0].position.clone();
		// the thumb's palmar abduction turns it out of the palm's plane, towards the palm's normal (the hand's +Z):
		// about the axis thumb × normal, in the thumb's first bone
		const thumbChain = chain(thumb);
		const nLocal = new Vector3(0, 0, 1).applyQuaternion(thumb[0].quaternion.clone().invert());
		thumbChain.abd = new Vector3(0, 1, 0).cross(nLocal).normalize();
		const palmVerts = verts?.get(hand) ?? [];
		// the ball of the thumb is part of the palm the object rests against: its vertices, in the hand's frame
		const t1 = thumb[0];
		const base = new Matrix4().compose(t1.position, t1.quaternion, new Vector3(1, 1, 1));
		const contact = [...palmVerts, ...(verts?.get(t1) ?? []).map((v) => v.clone().applyMatrix4(base))];
		// the palm point is on the palm's real surface: the most palmar glove vertices in the middle of the hand
		const palm = middle1.clone().multiplyScalar(0.6).add(new Vector3(0, 0, 0.017));
		const band = palmVerts.filter((v) => v.y > middle1.y * 0.3 && v.y < middle1.y * 0.9).map((v) => v.z);
		if (band.length > 10) {
			band.sort((a, b) => a - b);
			palm.z = band[Math.floor(band.length * 0.9)];
		}
		return {
			side,
			sign: side === 'R' ? 1 : -1,
			shoulder,
			upper,
			fore,
			twist,
			hand,
			fingers,
			thumb,
			chains: fingers.map(chain),
			thumbChain,
			a: worldPos(upper).distanceTo(worldPos(fore)),
			b: worldPos(fore).distanceTo(worldPos(hand)),
			palm,
			palmVerts: contact,
			handRest: hand.quaternion.clone(),
			rest,
			target: null,
			weight: 0,
			want: 0,
			swivel: 20 * D,
			angles: cloneAngles(RELAXED),
			goal: cloneAngles(RELAXED),
			fingerRate: 14,
			miss: 0
		};
	}

	// ---------------------------------------------------------------------------------------------
	// what the controller uses

	/**
	 * The glove's vertices by the bone that moves them most (weight over one half), in that bone's frame at rest:
	 * boneInverse · bindMatrix · v.
	 */
	private gloveVerts(side: Side, bones: Object3D[]) {
		const glove = this.root.getObjectByName(`AvatarGlove_${side}`) as SkinnedMesh | undefined;
		if (!glove?.isSkinnedMesh) return null;
		const g = glove.geometry;
		const pos = g.attributes.position;
		const si = g.attributes.skinIndex;
		const sw = g.attributes.skinWeight;
		const sk = glove.skeleton;
		const want = new Set(bones);
		const out = new Map<Object3D, Vector3[]>();
		for (let i = 0; i < pos.count; i++) {
			let j = -1;
			let best = 0;
			for (let k = 0; k < 4; k++) {
				const wt = sw.getComponent(i, k);
				if (wt > best) {
					best = wt;
					j = si.getComponent(i, k);
				}
			}
			const bone = sk.bones[j];
			if (!bone || !want.has(bone)) continue;
			const v = new Vector3().fromBufferAttribute(pos, i).applyMatrix4(glove.bindMatrix).applyMatrix4(sk.boneInverses[j]);
			if (!out.has(bone)) out.set(bone, []);
			out.get(bone)!.push(v);
		}
		return out;
	}

	/** What the grip solver needs of a hand (grip.ts). */
	handGeo(side: Side): HandGeo {
		const arm = this.arms[side];
		return { side, chains: arm.chains, thumb: arm.thumbChain, palm: arm.palm.clone(), palmVerts: arm.palmVerts };
	}

	/** Palm vertices of a hand, in the hand bone's frame. */
	palmVerts(side: Side) {
		return this.arms[side].palmVerts;
	}

	/** Palm target for a hand, or null to let the arm hang. */
	setTarget(side: Side, target: PalmFrame | null) {
		const arm = this.arms[side];
		if (target) {
			arm.target = { p: target.p.clone(), q: target.q.clone() };
			arm.want = 1;
		} else arm.want = 0;
	}

	/** Finger angles to move towards; `rate` is how fast (1/s). */
	setFingers(side: Side, goal: FingerAngles, rate = 14) {
		const arm = this.arms[side];
		arm.goal = cloneAngles(goal);
		arm.fingerRate = rate;
	}

	/** The palm centre in the hand bone's frame. */
	palmOffset(side: Side) {
		return this.arms[side].palm.clone();
	}

	/** Where the palm is now, as solved (to start a motion from where the hand is). */
	palmFrame(side: Side): PalmFrame {
		const arm = this.arms[side];
		arm.hand.updateWorldMatrix(true, false);
		const q = arm.hand.getWorldQuaternion(new Quaternion());
		return { p: arm.palm.clone().applyMatrix4(arm.hand.matrixWorld), q };
	}

	chains(side: Side) {
		return { fingers: this.arms[side].chains, thumb: this.arms[side].thumbChain };
	}

	shoulder(side: Side) {
		return worldPos(this.arms[side].upper);
	}

	/**
	 * Where a reach is measured from: the shoulder as it is with the body upright. The real shoulder moves as the torso
	 * leans, and a reach measured from it would change with where the student looks.
	 */
	reachOrigin(side: Side) {
		return this.reachLocal[side].clone().applyMatrix4(this.root.matrixWorld);
	}

	/** How far the hand ended from its target (metres), after the arm's length and the wrist's limits. */
	miss(side: Side) {
		return this.arms[side].miss;
	}

	/** Body axes: right, up, forward. */
	axes() {
		const q = this.root.quaternion;
		return { right: new Vector3(1, 0, 0).applyQuaternion(q), up: UP.clone(), forward: new Vector3(0, 0, -1).applyQuaternion(q) };
	}

	/**
	 * A comfortable hand for reaching point `p`: fingers along the reach and a little down, palm turned to the body's
	 * middle, and more towards the floor the lower the point is.
	 */
	comfort(side: Side, p: Vector3) {
		const { right, forward } = this.axes();
		const s = this.shoulder(side);
		const flat = p.clone().sub(s).setY(0);
		if (flat.lengthSq() < 1e-6) flat.copy(forward);
		flat.normalize();
		const low = Math.min(0.85, Math.max(0, (s.y - p.y - 0.2) / 0.45));
		const F = flat.multiplyScalar(0.9).add(new Vector3(0, -0.25 - 0.4 * low, 0)).normalize();
		const N = right.clone().multiplyScalar(-this.arms[side].sign * (1 - low)).add(new Vector3(0, -low, 0));
		const z = N.addScaledVector(F, -N.dot(F)).normalize();
		return basis(new Vector3().crossVectors(F, z), F, z);
	}

	/** Stands the body under the eye (as it would be with the head upright), facing where it looks. */
	place(eye: Vector3, yaw: number) {
		const r = this.root;
		r.rotation.set(0, yaw, 0);
		r.position.copy(eye).sub(_v.copy(EYE).applyAxisAngle(UP, yaw));
		r.updateWorldMatrix(false, false);
	}

	// ---------------------------------------------------------------------------------------------
	// solving

	update(dt: number) {
		const arms = Object.values(this.arms);
		for (const arm of arms) {
			for (const [o, q] of arm.rest) o.quaternion.copy(q);
			arm.weight += (arm.want - arm.weight) * (1 - Math.exp(-dt * 10));
			if (arm.want === 0 && arm.weight < 0.005) {
				arm.weight = 0;
				arm.target = null;
			}
		}
		this.leanOver(dt);
		for (const arm of arms) {
			this.idle(arm);
			if (arm.target && arm.weight > 0.001) this.reach(arm, dt);
			this.fingers(arm, dt);
		}
	}

	/** Bend at the waist when a hand has to reach further than the arm, up to 45° (leaning over a bench). */
	private leanOver(dt: number) {
		this.spine.quaternion.copy(this.spineRest);
		let need = 0;
		for (const arm of Object.values(this.arms)) {
			if (!arm.target || arm.weight < 0.01) continue;
			const wrist = arm.target.p.clone().sub(arm.palm.clone().applyQuaternion(arm.target.q));
			const d = wrist.distanceTo(worldPos(arm.upper));
			need = Math.max(need, (d - 0.9 * (arm.a + arm.b)) * arm.weight);
		}
		const want = Math.min(45 * D, Math.max(0, need / 0.45));
		this.lean += (want - this.lean) * (1 - Math.exp(-dt * 6));
		if (this.lean > 0.001) {
			const { right } = this.axes();
			const wq = this.spine.getWorldQuaternion(new Quaternion());
			setWorldQuat(this.spine, _q.setFromAxisAngle(right, -this.lean).multiply(wq));
		}
	}

	/** Arms hang with the elbow slightly bent. */
	private idle(arm: Arm) {
		arm.fore.quaternion.multiply(_q.setFromAxisAngle(new Vector3(1, 0, 0), 12 * D));
	}

	private reach(arm: Arm, dt: number) {
		const idleQ = [arm.shoulder, arm.upper, arm.fore, arm.twist, arm.hand].map((o) => o.quaternion.clone());
		const t = arm.target!;
		const { right, up, forward } = this.axes();
		const L = arm.a + arm.b;
		let wrist = t.p.clone().sub(arm.palm.clone().applyQuaternion(t.q));

		// collarbone: forward and up for long or high reaches
		{
			const s0 = worldPos(arm.upper);
			const v = wrist.clone().sub(s0);
			const prot = Math.min(14 * D, Math.max(0, (v.length() / L - 0.7) * 40 * D));
			const elev = Math.min(18 * D, Math.max(-4 * D, (v.dot(up) / L) * 22 * D));
			const d0 = s0.clone().sub(worldPos(arm.shoulder)).normalize();
			const d1 = d0.clone().addScaledVector(forward, Math.sin(prot)).addScaledVector(up, Math.sin(elev)).normalize();
			setWorldQuat(arm.shoulder, new Quaternion().setFromUnitVectors(d0, d1).multiply(arm.shoulder.getWorldQuaternion(new Quaternion())));
		}

		const S = worldPos(arm.upper);
		const toT = wrist.clone().sub(S);
		const dist = toT.length();
		const d = Math.min(Math.max(dist, 0.08), L * 0.9995);
		const dir = toT.normalize();
		if (dist > d) wrist = S.clone().addScaledVector(dir, d);

		// elbow swivel: 0 is straight down, positive is out to the side
		const hp = wrist.clone().sub(S).divideScalar(L);
		const x = hp.dot(right) * arm.sign;
		const y = hp.dot(up);
		const z = hp.dot(forward);
		const N = new Vector3(0, 0, 1).applyQuaternion(t.q);
		let sw = 18 * D + 55 * D * Math.max(0, y + 0.1) - 25 * D * Math.max(0, 0.45 - z) * Math.max(0, -y) + 45 * D * Math.max(0, -x);
		sw += 28 * D * Math.max(0, -N.y) - 18 * D * Math.max(0, N.y);
		sw = Math.min(95 * D, Math.max(-8 * D, sw));
		arm.swivel += (sw - arm.swivel) * (1 - Math.exp(-dt / 0.09));

		let u = new Vector3(0, -1, 0).addScaledVector(dir, dir.y);
		if (u.lengthSq() < 1e-4) {
			const back = forward.clone().negate();
			u = back.addScaledVector(dir, -back.dot(dir));
		}
		u.normalize();
		const out = right.clone().multiplyScalar(arm.sign);
		out.addScaledVector(dir, -out.dot(dir)).addScaledVector(u, -out.dot(u)).normalize();
		const e = u.clone().multiplyScalar(Math.cos(arm.swivel)).addScaledVector(out, Math.sin(arm.swivel));
		const along = (arm.a * arm.a - arm.b * arm.b + d * d) / (2 * d);
		const h = Math.sqrt(Math.max(0, arm.a * arm.a - along * along));
		const E = S.clone().addScaledVector(dir, along).addScaledVector(e, h);

		// the upper arm and the forearm as a hinge: local Y along the bone, the forearm bends towards local Z
		const Yu = E.clone().sub(S).normalize();
		const Yf = wrist.clone().sub(E).normalize();
		let Zu = Yf.clone().addScaledVector(Yu, -Yf.dot(Yu));
		if (Zu.lengthSq() < 1e-6) {
			const ne = e.clone().negate();
			Zu = ne.addScaledVector(Yu, -ne.dot(Yu));
		}
		Zu.normalize();
		const X = new Vector3().crossVectors(Yu, Zu);
		setWorldQuat(arm.upper, basis(X, Yu, Zu));
		setWorldQuat(arm.fore, basis(X, Yf, new Vector3().crossVectors(X, Yf)));

		// the wrist's roll: 60% in the forearm's twist bone, the rest in the wrist; then the wrist's limits
		const foreQ = arm.fore.getWorldQuaternion(new Quaternion());
		const rel = foreQ.invert().multiply(t.q).multiply(arm.handRest.clone().invert());
		let tw = twistY(rel);
		if (tw > Math.PI) tw -= 2 * Math.PI;
		if (tw < -Math.PI) tw += 2 * Math.PI;
		tw = Math.min(100 * D, Math.max(-90 * D, tw));
		arm.twist.quaternion.copy(arm.rest.get(arm.twist)!).multiply(_q.setFromAxisAngle(new Vector3(0, 1, 0), tw * 0.6));
		arm.twist.updateWorldMatrix(false, false);
		const local = arm.twist.getWorldQuaternion(new Quaternion()).invert().multiply(t.q);
		const delta = arm.handRest.clone().invert().multiply(local);
		const eu = new Euler().setFromQuaternion(delta, 'YXZ');
		const dev = arm.sign > 0 ? [-19 * D, 33 * D] : [-33 * D, 19 * D];
		eu.y = Math.min(35 * D, Math.max(-35 * D, eu.y));
		eu.x = Math.min(73 * D, Math.max(-65 * D, eu.x));
		eu.z = Math.min(dev[1], Math.max(dev[0], eu.z));
		arm.hand.quaternion.copy(arm.handRest).multiply(new Quaternion().setFromEuler(eu));
		arm.hand.updateWorldMatrix(false, false);
		arm.miss = arm.palm.clone().applyMatrix4(arm.hand.matrixWorld).distanceTo(t.p);

		// blend in from hanging
		if (arm.weight < 0.999) {
			const bones = [arm.shoulder, arm.upper, arm.fore, arm.twist, arm.hand];
			bones.forEach((o, i) => o.quaternion.copy(idleQ[i].slerp(o.quaternion.clone(), arm.weight)));
			arm.hand.updateWorldMatrix(true, false);
		}
	}

	private fingers(arm: Arm, dt: number) {
		const k = 1 - Math.exp(-dt * arm.fingerRate);
		const a = arm.angles;
		const g = arm.goal;
		for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) a.f[i][j] += (g.f[i][j] - a.f[i][j]) * k;
		for (let j = 0; j < 5; j++) a.t[j] += (g.t[j] - a.t[j]) * k;
		const X = new Vector3(1, 0, 0);
		const Y = new Vector3(0, 1, 0);
		const Z = new Vector3(0, 0, 1);
		arm.fingers.forEach((chain, i) => {
			chain.forEach((b, j) => {
				b.quaternion.copy(arm.rest.get(b)!);
				if (j === 0) b.quaternion.multiply(_q.setFromAxisAngle(Z, a.f[i][3]));
				b.quaternion.multiply(_q.setFromAxisAngle(X, a.f[i][j]));
			});
		});
		arm.thumb.forEach((b, j) => {
			b.quaternion.copy(arm.rest.get(b)!);
			if (j === 0) {
				b.quaternion.multiply(_q.setFromAxisAngle(Y, a.t[0]));
				if (arm.thumbChain.abd) b.quaternion.multiply(_q.setFromAxisAngle(arm.thumbChain.abd, a.t[4]));
			}
			b.quaternion.multiply(_q.setFromAxisAngle(X, a.t[j + 1]));
		});
	}
}
