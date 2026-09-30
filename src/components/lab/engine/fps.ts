import { MathUtils, PerspectiveCamera, Vector3 } from 'three';
import { spring, springVec, type Spring } from './spring';

/** Where the student may walk: the floor in front of the bench, inside the room (three.js coordinates). */
const BOUNDS = { minX: -2.15, maxX: 2.15, minZ: 0.5, maxZ: 3.35 };
/** The body's radius against furniture. */
const BODY_R = 0.15;

/** A rectangle of floor the body cannot enter (a bench, a cupboard), three.js x and z. */
export type Obstacle = { minX: number; maxX: number; minZ: number; maxZ: number };
const STAND = 1.62;
const CROUCH = 1.22;
const WALK = 1.3;
const RUN = 2.6;
const FOV = 60;
/**
 * How quickly the body gets going and stops (spring omegas, critically damped: 90% of the way in 3.9 / omega s).
 * Starting takes a little longer than stopping, as with a real body; stopping for an action of the hands is quicker.
 */
const MOVE = { start: 18, stop: 24, freeze: 40 };
/** Crouching and standing up: a spring with a hint of settle. */
const CROUCH_SPRING = { omega: 11, zeta: 0.85 };
const ZOOM_FOV = 20;
/** How the hands trail the head: a spring a little under critical damping, so they catch up with a hint of weight. */
const SWAY = { omega: 14, zeta: 0.72, most: 0.12 };
/** How the hands lag when the body starts or stops: seconds of velocity mismatch, at most this many meters. */
const INERTIA = { omega: 9, gain: 0.07, most: 0.035 };
/**
 * The head turns on the neck, not round the eye: the eye sits this far above and in front of the pivot, so looking
 * down at the bench brings it forward and down, as leaning over. The head takes `share` of the pitch, the eyes the rest.
 */
const NECK = { up: 0.1, forward: 0.08, share: 0.7 };
/**
 * Walking, on the camera: the head rises and falls once a step and sways side to side once a stride (two steps).
 * Meters per step, and the amplitudes at a walk (a run swings half as much again).
 */
const BOB = { step: 0.7, up: 0.011, side: 0.006 };
/** The head leans a little into a sidestep and a turn: radians per m/s and per rad/s, at most `most`. */
const ROLL = { strafe: 0.012, turn: 0.004, most: 0.025 };
/** Breathing, standing still: a slow nod, radians and meters. */
const BREATH = { hz: 0.23, pitch: 0.0022, up: 0.0015 };

/**
 * First-person controls, as in a videogame: WASD or the arrows walk, Shift runs, C crouches, the mouse looks around
 * once the pointer is locked, and Z or the middle button zooms. The two main buttons belong to the two hands. The camera never tilts past straight up or down.
 */
export class FirstPerson {
	yaw = 0;
	pitch = -0.42;
	/** The eye as it would be with the head upright: what walking moves (the camera adds the neck, see apply). */
	readonly position = new Vector3(0, STAND, 1.2);
	/** Where the body stands under the head (avatar.ts, place). */
	readonly body = new Vector3();
	/**
	 * The head's own motion (steps, leaning into a turn, breathing). It moves only the camera, and the aim follows
	 * what is seen; it can be turned off for whoever gets seasick with it, as on a projected screen.
	 */
	headMotion = true;
	private stride = 0;
	private gait: Spring = { x: 0, v: 0 };
	private roll: Spring = { x: 0, v: 0 };
	private breath = 0;
	private lastYaw = 0;
	/** The head's motion this frame, applied on top of the pose: meters up and right, radians of pitch and roll. */
	private motion = { up: 0, right: 0, pitch: 0, roll: 0 };
	locked = false;
	/** The room's floor (a scene with its own plan sets it, see scene.ts). */
	bounds = { ...BOUNDS };
	/** Furniture to walk round. */
	obstacles: Obstacle[] = [];
	/** Where reset() puts the student, and facing where. */
	home = { x: 0, z: 1.2, yaw: 0 };
	private keys = new Set<string>();
	private eye = STAND;
	private zoom = false;
	private fov = FOV;
	private vel = new Vector3();
	private acc = new Vector3();
	private eyeV = 0;
	private interact = false;
	/** While the hands are busy (taking, putting down, turning a tap): the body stays, the eyes still look round. */
	frozen = false;
	/** The mouse without the operating system's acceleration (see lock). */
	rawMouse = true;
	/** A factor on how far the view turns for a movement of the mouse. */
	sensitivity = 1;
	private combine = false;
	/**
	 * Where the hands hang from, as a view of their own: the eye's position and a yaw and pitch that trail the real
	 * ones, so what the hands carry lags behind a turn of the head and swings back (holdFrame, hands.ts).
	 */
	readonly hand = { position: new Vector3(), yaw: 0, pitch: 0 };
	private swayYaw: Spring = { x: 0, v: 0 };
	private swayPitch: Spring = { x: -0.42, v: 0 };
	private lagVel = new Vector3();
	private lagAcc = new Vector3();
	onLockChange: (locked: boolean) => void = () => {};
	/** The mouse wheel while the pointer is captured (positive: towards the user, as deltaY). */
	onWheel: (delta: number) => void = () => {};

	constructor(
		private camera: PerspectiveCamera,
		private el: HTMLElement
	) {
		camera.fov = FOV;
		window.addEventListener('keydown', this.onKeyDown);
		window.addEventListener('keyup', this.onKeyUp);
		window.addEventListener('blur', this.onBlur);
		document.addEventListener('pointerlockchange', this.onLock);
		document.addEventListener('mousemove', this.onMouseMove);
		el.addEventListener('mousedown', this.onMouseDown);
		el.addEventListener('mouseup', this.onMouseUp);
		el.addEventListener('contextmenu', this.onContextMenu);
		el.addEventListener('wheel', this.onWheelEvent, { passive: false });
		this.apply();
	}

	lock() {
		if (this.locked) return;
		const el = this.el as HTMLElement & { requestPointerLock(o?: { unadjustedMovement?: boolean }): Promise<void> | undefined };
		const plain = () => el.requestPointerLock?.()?.catch?.(() => {});
		if (!this.rawMouse) return void plain();
		// the mouse as it moves, without the system's acceleration: the same gesture always turns the head the same;
		// where the browser cannot, the usual lock
		try {
			const r = el.requestPointerLock({ unadjustedMovement: true });
			r?.catch?.(plain);
		} catch {
			plain();
		}
	}

	unlock() {
		if (this.locked) document.exitPointerLock();
	}

	/** Back to the starting spot, facing the bench. */
	reset() {
		this.position.set(this.home.x, this.eye, this.home.z);
		this.yaw = this.home.yaw;
		this.pitch = -0.42;
		this.vel.set(0, 0, 0);
		this.acc.set(0, 0, 0);
		this.settleHands();
	}

	/** Turns the view so the crosshair lands on a point (the eye moves with the neck, so a few passes). */
	lookAt(t: Vector3) {
		for (let i = 0; i < 4; i++) {
			const c = this.camera.position;
			const dx = t.x - c.x;
			const dy = t.y - c.y;
			const dz = t.z - c.z;
			this.yaw = Math.atan2(-dx, -dz);
			this.pitch = MathUtils.clamp(Math.atan2(dy, Math.hypot(dx, dz)), -1.45, 1.45);
			this.apply();
		}
	}

	/** The hands exactly where the view is, with no lag left (after a jump of the view). */
	settleHands() {
		this.swayYaw = { x: this.yaw, v: 0 };
		this.swayPitch = { x: this.pitch, v: 0 };
		this.lagVel.copy(this.vel);
		this.lagAcc.set(0, 0, 0);
	}

	private typing(e: KeyboardEvent) {
		const t = e.target as HTMLElement | null;
		return !!t && (t.tagName === 'INPUT' && (t as HTMLInputElement).type !== 'range' || t.tagName === 'TEXTAREA' || t.isContentEditable);
	}

	private onKeyDown = (e: KeyboardEvent) => {
		if (this.typing(e) || e.metaKey || e.ctrlKey) return;
		this.keys.add(e.code);
		if (e.code === 'KeyE' && !e.repeat) this.interact = true;
		if (e.code === 'KeyF' && !e.repeat) this.combine = true;
		// the arrows would otherwise move a focused slider or scroll the page
		if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
	};

	private onKeyUp = (e: KeyboardEvent) => {
		this.keys.delete(e.code);
	};

	private onBlur = () => {
		this.keys.clear();
		this.zoom = false;
	};

	private onLock = () => {
		this.locked = document.pointerLockElement === this.el;
		if (!this.locked) this.zoom = false;
		this.onLockChange(this.locked);
	};

	private onMouseMove = (e: MouseEvent) => {
		if (!this.locked) return;
		// slower when zoomed, so aiming at a mark stays precise
		const k = 0.0022 * this.sensitivity * (this.fov / FOV);
		this.yaw -= e.movementX * k;
		this.pitch = MathUtils.clamp(this.pitch - e.movementY * k, -1.45, 1.45);
	};

	private onMouseDown = (e: MouseEvent) => {
		if (e.button === 1 && this.locked) this.zoom = true;
	};

	private onMouseUp = (e: MouseEvent) => {
		if (e.button === 1) this.zoom = false;
	};

	private onContextMenu = (e: Event) => e.preventDefault();

	private onWheelEvent = (e: WheelEvent) => {
		if (!this.locked) return;
		e.preventDefault();
		// lines (Firefox) as pixels
		this.onWheel(e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY);
	};

	update(dt: number) {
		const k = this.keys;
		const fwd = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0);
		const side = (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0);
		const speed = k.has('ShiftLeft') || k.has('ShiftRight') ? RUN : WALK;
		const sin = Math.sin(this.yaw);
		const cos = Math.cos(this.yaw);
		// forward is -Z at yaw 0
		const want = new Vector3(-sin * fwd + cos * side, 0, -cos * fwd - sin * side);
		if (want.lengthSq() > 1) want.normalize();
		want.multiplyScalar(this.frozen ? 0 : speed);
		// a spring, so starting and stopping ease in as well as out
		const speeding = want.lengthSq() >= this.vel.lengthSq() - 1e-4;
		springVec(this.vel, this.acc, want, this.frozen ? MOVE.freeze : speeding ? MOVE.start : MOVE.stop, 1, dt);
		this.position.addScaledVector(this.vel, dt);
		this.collide();
		if (this.frozen) this.eyeV = 0;
		else {
			const e: Spring = { x: this.eye, v: this.eyeV };
			spring(e, k.has('KeyC') ? CROUCH : STAND, CROUCH_SPRING.omega, CROUCH_SPRING.zeta, dt);
			this.eye = e.x;
			this.eyeV = e.v;
		}
		this.position.y = this.eye;
		const fov = this.zoom || k.has('KeyZ') ? ZOOM_FOV : FOV;
		this.fov += (fov - this.fov) * (1 - Math.exp(-dt * 12));
		this.walkMotion(dt);
		this.apply();
		this.swing(dt);
	}

	/** Steps, leaning and breathing; eased in and out, so starting to walk does not snap the head. */
	private walkMotion(dt: number) {
		const m = this.motion;
		const on = this.headMotion ? 1 : 0;
		const sp = Math.hypot(this.vel.x, this.vel.z);
		// the step's phase advances with the distance walked: a half turn per step
		this.stride = (this.stride + (sp * dt * Math.PI) / BOB.step) % (2 * Math.PI);
		spring(this.gait, on * Math.min(1.5, sp / WALK), 10, 1, dt);
		const g = Math.max(0, this.gait.x);
		m.up = -BOB.up * g * 0.5 * (1 - Math.cos(2 * this.stride));
		m.right = BOB.side * g * Math.sin(this.stride);
		// leaning: into a sidestep, and a little into a turn of the head
		const right = Math.cos(this.yaw) * this.vel.x - Math.sin(this.yaw) * this.vel.z;
		const turn = dt > 0 ? MathUtils.clamp((this.yaw - this.lastYaw) / dt, -6, 6) : 0;
		this.lastYaw = this.yaw;
		const lean = MathUtils.clamp(-right * ROLL.strafe + turn * ROLL.turn, -ROLL.most, ROLL.most);
		m.roll = spring(this.roll, on * lean, 8, 1, dt);
		this.breath += dt;
		const b = Math.sin(2 * Math.PI * BREATH.hz * this.breath) * on;
		m.pitch = BREATH.pitch * b;
		m.up += BREATH.up * b;
	}

	/** The hands' own view: trailing the head's turns, and the body's starts and stops. */
	private swing(dt: number) {
		const h = this.hand;
		// a jump (a test, a reset) is not a turn of the head
		if (Math.abs(this.yaw - this.swayYaw.x) > 0.6 || Math.abs(this.pitch - this.swayPitch.x) > 0.6) this.settleHands();
		spring(this.swayYaw, this.yaw, SWAY.omega, SWAY.zeta, dt);
		spring(this.swayPitch, this.pitch, SWAY.omega, SWAY.zeta, dt);
		// a fast turn does not pile up lag: past the limit the hands are dragged along
		for (const [sp, to] of [[this.swayYaw, this.yaw], [this.swayPitch, this.pitch]] as const) {
			const lag = sp.x - to;
			if (Math.abs(lag) > SWAY.most) {
				sp.x = to + Math.sign(lag) * SWAY.most;
				sp.v = 0;
			}
		}
		h.yaw = this.swayYaw.x;
		h.pitch = this.swayPitch.x;
		springVec(this.lagVel, this.lagAcc, this.vel, INERTIA.omega, 1, dt);
		const shift = this.lagVel.clone().sub(this.vel).multiplyScalar(INERTIA.gain);
		if (shift.length() > INERTIA.most) shift.setLength(INERTIA.most);
		// the hands ride the steps less than the head does, so in view they bob against it
		const m = this.motion;
		shift.y -= 0.35 * m.up;
		shift.x -= 0.35 * m.right * Math.cos(this.yaw);
		shift.z += 0.35 * m.right * Math.sin(this.yaw);
		h.position.copy(this.camera.position).add(shift);
	}

	/** Keeps the body on the floor and out of the furniture: pushed out of each rectangle it overlaps, so it slides along. */
	private collide() {
		const p = this.position;
		const b = this.bounds;
		p.x = MathUtils.clamp(p.x, b.minX, b.maxX);
		p.z = MathUtils.clamp(p.z, b.minZ, b.maxZ);
		for (const o of this.obstacles) {
			const cx = MathUtils.clamp(p.x, o.minX, o.maxX);
			const cz = MathUtils.clamp(p.z, o.minZ, o.maxZ);
			const dx = p.x - cx;
			const dz = p.z - cz;
			const d2 = dx * dx + dz * dz;
			if (d2 >= BODY_R * BODY_R) continue;
			if (d2 > 1e-8) {
				const d = Math.sqrt(d2);
				p.x = cx + (dx / d) * BODY_R;
				p.z = cz + (dz / d) * BODY_R;
			} else {
				// inside: out through the nearest side
				const out = [p.x - o.minX, o.maxX - p.x, p.z - o.minZ, o.maxZ - p.z];
				const i = out.indexOf(Math.min(...out));
				if (i === 0) p.x = o.minX - BODY_R;
				else if (i === 1) p.x = o.maxX + BODY_R;
				else if (i === 2) p.z = o.minZ - BODY_R;
				else p.z = o.maxZ + BODY_R;
			}
		}
	}

	private apply() {
		const c = this.camera;
		const th = this.pitch * NECK.share;
		const fwd = NECK.forward * Math.cos(th) - NECK.up * Math.sin(th) - NECK.forward;
		const up = NECK.up * Math.cos(th) + NECK.forward * Math.sin(th) - NECK.up;
		const m = this.motion;
		const sin = Math.sin(this.yaw);
		const cos = Math.cos(this.yaw);
		// the body carries the steps; the head's lean and breath stay on the head
		this.body.set(this.position.x + cos * m.right, this.position.y + m.up, this.position.z - sin * m.right);
		c.position.set(this.body.x - sin * fwd, this.body.y + up, this.body.z - cos * fwd);
		c.rotation.set(this.pitch + m.pitch, this.yaw, m.roll, 'YXZ');
		if (Math.abs(c.fov - this.fov) > 0.01) {
			c.fov = this.fov;
			c.updateProjectionMatrix();
		}
	}

	/** True once after each press of F. */
	takeCombine() {
		const c = this.combine;
		this.combine = false;
		return c;
	}

	/** True once after each press of E. */
	takeInteract() {
		const i = this.interact;
		this.interact = false;
		return i;
	}

	dispose() {
		this.unlock();
		window.removeEventListener('keydown', this.onKeyDown);
		window.removeEventListener('keyup', this.onKeyUp);
		window.removeEventListener('blur', this.onBlur);
		document.removeEventListener('pointerlockchange', this.onLock);
		document.removeEventListener('mousemove', this.onMouseMove);
		this.el.removeEventListener('mousedown', this.onMouseDown);
		this.el.removeEventListener('mouseup', this.onMouseUp);
		this.el.removeEventListener('contextmenu', this.onContextMenu);
		this.el.removeEventListener('wheel', this.onWheelEvent);
	}
}
