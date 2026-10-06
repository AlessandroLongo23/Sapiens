import { MathUtils, PerspectiveCamera, Vector3 } from 'three';
import { spring, springVec, type Spring } from './spring';
import { PAD, padKind, setDevice } from './pad';

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
/**
 * A controller's sticks: nothing inside `dead` (a stick at rest is never exactly at zero), then the push squared, so
 * a small push aims finely; the view turns at most `yaw` and `pitch` rad/s. The d-pad stands for the mouse wheel:
 * a press is a small nudge, and held it runs from `slow` to `fast` wheel units a second (a mouse's notch is 100).
 */
const STICK = { dead: 0.14, yaw: 2.8, pitch: 2.0 };
const DPAD = { nudge: 12, slow: 120, fast: 520, ramp: 1.2 };
/** Breathing, standing still: a slow nod, radians and meters. */
const BREATH = { hz: 0.23, pitch: 0.0022, up: 0.0015 };

/**
 * First-person controls, as in a videogame: WASD or the arrows walk, Shift runs, C crouches, the mouse looks around
 * once the pointer is locked, and Z or the middle button zooms. The two main buttons belong to the two hands, which
 * take and put down; Q and E use the left and the right hand. The camera never tilts past straight up or down.
 *
 * A controller does the same (pad.ts): the left stick walks and the right one looks, the triggers take and put down,
 * the bumpers use. A browser does not capture the mouse for a controller's button, so with one the game is entered
 * and paused without the capture: `locked` then means "playing", by either way in.
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
	/** A field of view the work asks for while there is something small to watch (a flame's colour), or null. */
	watch: number | null = null;
	private fov = FOV;
	private vel = new Vector3();
	private acc = new Vector3();
	private eyeV = 0;
	/** Presses of Q and E not yet taken: the left and the right hand's use key. */
	private used: ('L' | 'R')[] = [];
	/** While the hands are busy (taking, putting down, turning a tap): the body stays, the eyes still look round. */
	frozen = false;
	/** The mouse without the operating system's acceleration (see lock). */
	rawMouse = true;
	/** A factor on how far the view turns for a movement of the mouse. */
	sensitivity = 1;
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
	/** B, or the controller's Share or View: the notebook. */
	onBook: () => void = () => {};
	/**
	 * While the notebook is up: the mouse is a cursor again and the keys write, but the game is not paused (`locked`
	 * stays true). `suspend` sets it and takes the mouse back when the notebook goes.
	 */
	suspended = false;
	private resuming: ReturnType<typeof setTimeout> | null = null;
	/** The mouse wheel while the pointer is captured (positive: towards the user, as deltaY). */
	onWheel: (delta: number) => void = () => {};
	/** R while the pointer is captured: turns what is about to be put down. */
	onTurn: (dir?: 1 | -1) => void = () => {};
	/** A controller's trigger: the left (0) or the right (2) hand takes or puts down, as the mouse buttons. */
	onPadPress: (button: 0 | 2) => void = () => {};
	/** Whether a controller's button may enter the game (not while it loads). */
	canEnter = true;
	/** A factor on how fast the sticks turn the view. */
	padSensitivity = 1;
	/** Playing through the controller, without the mouse captured. */
	private padPlay = false;
	private padDown: boolean[] = [];
	private padHeld = 0;
	private padMove = { fwd: 0, side: 0, run: false, crouch: false, zoom: false };

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
		if (document.pointerLockElement === this.el) return;
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
		if (document.pointerLockElement === this.el) document.exitPointerLock();
		else if (this.padPlay) this.padLeave();
	}

	/** The notebook comes up (the mouse is let go, the game goes on) or goes away (the mouse is captured again). */
	suspend(on: boolean) {
		if (on === this.suspended) return;
		this.suspended = on;
		this.keys.clear();
		this.zoom = false;
		if (this.resuming) clearTimeout(this.resuming);
		this.resuming = null;
		if (on) {
			if (document.pointerLockElement === this.el) document.exitPointerLock();
			return;
		}
		if (this.padPlay) return;
		// asked for inside the key or the click that closed the notebook; if the browser refuses, the game pauses
		this.lock();
		this.resuming = setTimeout(() => {
			this.resuming = null;
			this.sync();
		}, 700);
	}

	/** Into the game from a controller's button. */
	private padEnter() {
		this.padPlay = true;
		if (this.locked) return;
		this.locked = true;
		this.onLockChange(true);
	}

	private padLeave() {
		this.padPlay = false;
		this.sync();
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
		if (this.typing(e) || e.metaKey || e.ctrlKey || this.suspended) return;
		setDevice('keys');
		// Esc frees a captured mouse by itself; playing from the controller there is none to free
		if (e.code === 'Escape' && this.padPlay && document.pointerLockElement !== this.el) return this.padLeave();
		this.keys.add(e.code);
		if ((e.code === 'KeyQ' || e.code === 'KeyE') && !e.repeat && this.locked) this.used.push(e.code === 'KeyQ' ? 'L' : 'R');
		if (e.code === 'KeyR' && this.locked) this.onTurn();
		if (e.code === 'KeyB' && !e.repeat && this.locked) this.onBook();
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

	/** The mouse's capture changed. Losing it (Esc) pauses, also for whoever plays with the controller. */
	private onLock = () => {
		// the notebook came up again before the mouse was captured: it stays a cursor
		if (this.suspended && document.pointerLockElement === this.el) return void document.exitPointerLock();
		if (document.pointerLockElement !== this.el) this.padPlay = false;
		this.sync();
	};

	private sync() {
		// while the notebook is up, and for a moment after as the mouse is captured again, the game is still on
		if (this.suspended || (this.resuming && document.pointerLockElement !== this.el)) return;
		const was = this.locked;
		const captured = document.pointerLockElement === this.el;
		this.locked = captured || this.padPlay;
		if (!this.locked) this.zoom = false;
		if (this.locked !== was) this.onLockChange(this.locked);
	}

	private onMouseMove = (e: MouseEvent) => {
		if (document.pointerLockElement !== this.el) return;
		if (e.movementX || e.movementY) setDevice('keys');
		// slower when zoomed, so aiming at a mark stays precise
		const k = 0.0022 * this.sensitivity * (this.fov / FOV);
		this.yaw -= e.movementX * k;
		this.pitch = MathUtils.clamp(this.pitch - e.movementY * k, -1.45, 1.45);
	};

	private onMouseDown = (e: MouseEvent) => {
		setDevice('keys');
		if (e.button === 1 && this.locked) this.zoom = true;
	};

	private onMouseUp = (e: MouseEvent) => {
		if (e.button === 1) this.zoom = false;
	};

	private onContextMenu = (e: Event) => e.preventDefault();

	/** The last wheel events' sizes, and whether what arrives now is the trackpad's momentum (see coasting). */
	private wheelLog: number[] = [];
	private wheelT = 0;
	private coast = false;

	/**
	 * A trackpad keeps sending wheel events after the fingers have left it, smaller and smaller, for about a second:
	 * the system's momentum. What the wheel sets here (a flame, the pipette's filler) must stop with the fingers, so
	 * those are told apart and dropped. Momentum is a steady run of events that only shrink; fingers on the pad, or a
	 * mouse wheel's notches, do not shrink five times in a row. It ends when an event is larger than the one before,
	 * or after a pause: a new gesture.
	 */
	private coasting(delta: number, now: number) {
		const size = Math.abs(delta);
		const last = this.wheelLog.at(-1) ?? 0;
		if (now - this.wheelT > 100) {
			this.wheelLog = [];
			this.coast = false;
		} else if (size > last) this.coast = false;
		this.wheelT = now;
		this.wheelLog.push(size);
		if (this.wheelLog.length > 5) this.wheelLog.shift();
		const l = this.wheelLog;
		if (l.length === 5 && l[0] > l[4] && l.every((v, i) => i === 0 || v <= l[i - 1])) this.coast = true;
		return this.coast;
	}

	private onWheelEvent = (e: WheelEvent) => {
		if (!this.locked) return;
		e.preventDefault();
		// lines (Firefox) as pixels
		const delta = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY;
		if (this.coasting(delta, e.timeStamp)) return;
		setDevice('keys');
		this.onWheel(delta);
	};

	/** The first connected controller, preferring one the browser maps to the standard layout. */
	private gamepad() {
		const all = typeof navigator !== 'undefined' && navigator.getGamepads ? [...navigator.getGamepads()].filter((g): g is Gamepad => !!g && g.connected) : [];
		return all.find((g) => g.mapping === 'standard') ?? all[0] ?? null;
	}

	/** Reads the controller: the sticks into the walk and the view, the buttons into the same calls the keys make. */
	private pad(dt: number) {
		const m = this.padMove;
		const g = this.gamepad();
		if (!g) {
			if (this.padPlay) this.padLeave();
			m.fwd = m.side = 0;
			m.run = m.crouch = m.zoom = false;
			this.padDown = [];
			return;
		}
		const down = g.buttons.map((b, i) => (i === PAD.l2 || i === PAD.r2 ? b.value > (this.padDown[i] ? 0.3 : 0.55) || (b.pressed && b.value === 0) : b.pressed));
		const hit = (i: number) => down[i] && !this.padDown[i];
		const stick = (x = 0, y = 0) => {
			const r = Math.hypot(x, y);
			if (r < STICK.dead) return [0, 0];
			const k = Math.min(1, (r - STICK.dead) / (1 - STICK.dead)) / r;
			return [x * k, y * k];
		};
		const [mx, my] = stick(g.axes[0], g.axes[1]);
		const [lx, ly] = stick(g.axes[2], g.axes[3]);
		if (down.some(Boolean) || mx || my || lx || ly) setDevice(padKind(g.id));
		if (!this.locked) {
			// cross (A) or Options enters and resumes
			if (this.canEnter && (hit(PAD.south) || hit(PAD.start))) this.padEnter();
			m.fwd = m.side = 0;
			m.run = m.crouch = m.zoom = false;
			this.padDown = down;
			return;
		}
		// the notebook reads the controller itself (quaderno/Quaderno.tsx)
		if (this.suspended) {
			m.fwd = m.side = 0;
			m.run = m.crouch = m.zoom = false;
			this.padDown = down;
			return;
		}
		if (hit(PAD.start)) {
			this.padDown = down;
			this.unlock();
			return;
		}
		if (hit(PAD.select)) this.onBook();
		m.fwd = -my;
		m.side = mx;
		m.run = down[PAD.l3];
		m.crouch = down[PAD.east];
		m.zoom = down[PAD.north] || down[PAD.r3];
		const aim = Math.hypot(lx, ly);
		if (aim > 0) {
			// the push squared; slower when zoomed, as the mouse
			const k = aim * this.padSensitivity * (this.fov / FOV) * dt;
			this.yaw -= lx * k * STICK.yaw;
			this.pitch = MathUtils.clamp(this.pitch - ly * k * STICK.pitch, -1.45, 1.45);
		}
		if (hit(PAD.l1)) this.used.push('L');
		if (hit(PAD.r1)) this.used.push('R');
		if (hit(PAD.l2)) this.onPadPress(0);
		if (hit(PAD.r2)) this.onPadPress(2);
		if (hit(PAD.west) || hit(PAD.right)) this.onTurn(1);
		if (hit(PAD.left)) this.onTurn(-1);
		// up is the wheel pushed away (negative, as deltaY)
		const wheel = (down[PAD.down] ? 1 : 0) - (down[PAD.up] ? 1 : 0);
		if (wheel) {
			if (hit(PAD.up) || hit(PAD.down)) {
				this.padHeld = 0;
				this.onWheel(wheel * DPAD.nudge);
			} else {
				this.padHeld += dt;
				// a tap is only the nudge: the run starts after a moment
				if (this.padHeld > 0.22) this.onWheel(wheel * MathUtils.lerp(DPAD.slow, DPAD.fast, Math.min(1, (this.padHeld - 0.22) / DPAD.ramp)) * dt);
			}
		}
		this.padDown = down;
	}

	update(dt: number) {
		const k = this.keys;
		this.pad(dt);
		const pm = this.padMove;
		// the stick's push sets the pace, the keys are all or nothing
		const fwd = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0) + pm.fwd;
		const side = (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0) + pm.side;
		const speed = k.has('ShiftLeft') || k.has('ShiftRight') || pm.run ? RUN : WALK;
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
			spring(e, k.has('KeyC') || pm.crouch ? CROUCH : STAND, CROUCH_SPRING.omega, CROUCH_SPRING.zeta, dt);
			this.eye = e.x;
			this.eyeV = e.v;
		}
		this.position.y = this.eye;
		const fov = this.zoom || k.has('KeyZ') || pm.zoom ? ZOOM_FOV : (this.watch ?? FOV);
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

	/** The hands whose use key (Q the left, E the right) was pressed since the last call, in order. */
	takeUses() {
		const u = this.used;
		this.used = [];
		return u;
	}

	dispose() {
		this.unlock();
		if (this.resuming) clearTimeout(this.resuming);
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
