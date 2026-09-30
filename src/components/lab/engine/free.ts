import { Box3, Color, Matrix4, Mesh, Object3D, Quaternion, Vector3 } from 'three';
import type { LabScene } from './scene';
import { canHold, SHAPES, type Side } from './grasp';
import { Hands, holdFrame, PEN_PRONATION, penHeld } from './hands';
import { ease, orient, placePoint, type Pose } from './anim';
import { Ghost } from './ghost';
import type { Contents, LiquidBody } from './liquid';

/*
 * The free lab: no steps, two hands. The left mouse button works with the left hand and the right button with the
 * right hand: on an object with an empty hand it takes it, while holding something on a surface it puts it down.
 * F uses the two things together: stir with the rod in the other hand's container, or pour one container into the
 * other. Everything moves the hands (hands.ts); objects hang from them.
 */

/** Something the student can do now, and with which input: what the prompt under the crosshair shows. */
export type Action = {
	/** A mouse button (the hand), F, or the mouse wheel. */
	input: 'L' | 'R' | 'F' | 'W';
	verb: 'grab' | 'place' | 'pour' | 'stir' | 'light' | 'turn' | 'wear' | 'scoop' | 'insert' | 'fold' | 'wait' | 'draw' | 'confirm';
	text: string;
	/** Shown, but it cannot be done (the spot is too far or taken). */
	blocked?: boolean;
};

/**
 * An action the work on top of the free lab adds (the experiment): a tool in hand used on what the crosshair points
 * at, a control to click or turn. `run` is what a press does (a blocked one says `why`), `wheel` what the wheel does.
 */
export type Use = Action & {
	run?: () => Promise<void> | void;
	wheel?: (delta: number) => void;
	why?: string;
	/** The crosshair's label while this is offered, when it is not the object's own. */
	target?: string;
	/** Hides the usual grab and put down (a hand is busy with something, as filling a pipette). */
	exclusive?: boolean;
};

export type FreeSnapshot = {
	left: string | null;
	right: string | null;
	message: { kind: 'info' | 'warn' | 'ok'; text: string } | null;
	busy: boolean;
	hint: string;
	/** What the crosshair is on: an object in reach, or the spot where the held one would go. */
	target: string | null;
	actions: Action[];
};

type Placement = { side: Side; node: Object3D; position: Vector3; quaternion: Quaternion; ok: boolean; why: string };

const CONTAINERS = new Set(['Beaker', 'AcidBeaker', 'ConicalFlask', 'CuOJar', 'EvapDish']);
const FIXED = new Set(['GasTapHandle', 'BunsenCollar']);
/** From the upright shoulder (avatar.reachOrigin): the arm, and the torso leaning over the bench up to 45°. */
export const REACH = 1.05;
/** A click (or F) given while the hands are still busy counts if the action ends within this many seconds. */
const BUFFER = 0.4;
const UP = new Vector3(0, 1, 0);

export class FreeLab {
	private busy = false;
	private message: FreeSnapshot['message'] = null;
	private msgT = 0;
	private listeners = new Set<() => void>();
	private snap: FreeSnapshot;
	private ghost = new Ghost();
	private boxes = new Map<Object3D, Box3>();
	/** The widest miss of the last pour's stream from the mouth, metres (for the tests). */
	pourMiss = 0;
	/** Per frame of the last pour, for the tests: miss, lip over the mouth, mouth radius, tilt, correction. */
	pourTrace: number[][] = [];
	/** The hand that took something last: its object is the one shown where it would go. */
	private last: Side = 'R';
	private aim: { target: string | null; actions: Action[] } = { target: null, actions: [] };
	private offered: Use[] = [];
	/** A click or F given while the hands were busy, kept for a moment: it runs as soon as they are free. */
	private queued: { input: Side | 'F'; target: Object3D | null; age: number } | null = null;
	/** The actions the work on top adds, for what the crosshair points at (null: nothing). */
	uses: (hovered: Object3D | null) => Use[] = () => [];
	/** Why an object cannot be taken now (hot, the goggles are not on), or null. */
	refuse: (o: Object3D) => string | null = () => null;

	constructor(private s: LabScene) {
		s.onPress = (button, target) => this.press(button === 0 ? 'L' : 'R', target);
		s.onCombine = () => this.combine();
		s.onWheel = (d) => this.wheel(d);
		// the body stays still while the hands work
		s.handsBusy = () => this.busy;
		s.onUpdate = (dt) => this.update(dt);
		// only what a free hand can take, or what can be used, now is highlighted
		s.canHover = (o) => this.takeable(o) !== null || (!this.busy && this.uses(o).length > 0);
		s.setTargets([]);
		s.scene.add(this.ghost.group);
		this.snap = this.build();
	}

	subscribe = (fn: () => void) => {
		this.listeners.add(fn);
		return () => this.listeners.delete(fn);
	};

	getSnapshot = () => this.snap;

	private emit() {
		this.snap = this.build();
		for (const fn of this.listeners) fn();
	}

	private get hands() {
		return this.s.hands;
	}

	private label(side: Side) {
		const n = this.hands.held(side);
		return n ? ((n.userData.label as string) ?? n.name) : null;
	}

	private build(): FreeSnapshot {
		const L = this.hands.held('L')?.name;
		const R = this.hands.held('R')?.name;
		let hint = 'Punta un oggetto: clic sinistro lo prende con la mano sinistra, clic destro con la destra.';
		if (L && R) {
			if ((L === 'GlassRod' && CONTAINERS.has(R)) || (R === 'GlassRod' && CONTAINERS.has(L))) hint = 'Premi F per mescolare con la bacchetta.';
			else if (CONTAINERS.has(L) && CONTAINERS.has(R)) hint = "Premi F per versare da una mano nell'altra.";
			else hint = 'Punta il banco e fai clic per appoggiare quello che hai in mano.';
		} else if (L || R) hint = "Prendi un'altra cosa con la mano libera, o punta il banco e fai clic per appoggiare.";
		return { left: this.label('L'), right: this.label('R'), message: this.message, busy: this.busy, hint, target: this.aim.target, actions: this.aim.actions };
	}

	/** The free hands that can take `o` now (in reach, not already held), or null. */
	private takeable(o: Object3D): Side[] | null {
		if (this.busy || !canHold(o.name) || FIXED.has(o.name) || this.s.held.has(o) || o.userData.fixed) return null;
		const sides = (['L', 'R'] as Side[]).filter((side) => !this.hands.held(side) && this.hands.distance(side, o) <= REACH);
		return sides.length ? sides : null;
	}

	/** An object's bounds in its own frame, from its own meshes (not the liquid or the effects added to it). */
	private localBox(o: Object3D) {
		let b = this.boxes.get(o);
		if (!b) {
			b = new Box3();
			o.updateMatrixWorld(true);
			const inv = o.matrixWorld.clone().invert();
			o.traverse((c) => {
				const m = c as Mesh;
				if (!m.isMesh || m.userData.noPick) return;
				m.geometry.computeBoundingBox();
				b!.union(m.geometry.boundingBox!.clone().applyMatrix4(new Matrix4().multiplyMatrices(inv, m.matrixWorld)));
			});
			this.boxes.set(o, b);
		}
		return b;
	}

	/** Its bounds in the world at a pose. */
	private boxAt(o: Object3D, position: Vector3, quaternion: Quaternion) {
		return this.localBox(o).clone().applyMatrix4(new Matrix4().compose(position, quaternion, new Vector3(1, 1, 1)));
	}

	/** Where the object in `side`'s hand would go on the surface the crosshair points at, and whether it can. */
	private placement(side: Side): Placement | null {
		const node = this.hands.held(side);
		if (!node) return null;
		const spot = this.s.surfaceAt([...this.s.held]);
		if (!spot) return null;
		const rest = this.s.rest.get(node.name);
		const yaw = new Quaternion().setFromAxisAngle(UP, this.s.player.yaw);
		// upright as it stood on the bench, turned with the student
		const quaternion = rest ? yaw.clone().multiply(rest.quaternion) : yaw;
		const position = spot.clone().add(new Vector3(0, rest ? rest.position.y - this.s.benchY : 0, 0));
		if (spot.distanceTo(this.s.avatar.reachOrigin(side)) > REACH) return { side, node, position, quaternion, ok: false, why: 'Troppo lontano' };
		// not into another object standing there: their footprints on the bench must not overlap
		const mine = this.boxAt(node, position, quaternion).expandByScalar(-0.003);
		for (const name of this.s.rest.keys()) {
			const o = this.s.nodes.get(name);
			if (!o || o === node || this.s.held.has(o) || !o.visible) continue;
			if (mine.intersectsBox(this.boxAt(o, o.getWorldPosition(new Vector3()), o.getWorldQuaternion(new Quaternion())))) return { side, node, position, quaternion, ok: false, why: 'Occupato' };
		}
		return { side, node, position, quaternion, ok: true, why: '' };
	}

	/** What the crosshair offers now: highlight, the ghost of what would be put down, and the prompt's actions. */
	private aimAt() {
		const actions: Action[] = [];
		let target: string | null = null;
		const L = this.hands.held('L');
		const R = this.hands.held('R');
		const hovered = this.s.hoveredObject();
		this.ghost.hide();
		this.offered = [];
		if (!this.busy && this.s.player.locked) {
			const uses = this.uses(hovered);
			this.offered = uses;
			const exclusive = uses.some((u) => u.exclusive);
			const sides = hovered && !exclusive ? this.takeable(hovered)?.filter((side) => !uses.some((u) => u.input === side)) : null;
			if (uses.length) target = uses.find((u) => u.target)?.target ?? (hovered ? ((hovered.userData.label as string) ?? hovered.name) : null);
			for (const u of uses) actions.push({ input: u.input, verb: u.verb, text: u.text, blocked: u.blocked });
			if (hovered && sides?.length) {
				target = (hovered.userData.label as string) ?? hovered.name;
				for (const side of sides) actions.push({ input: side, verb: 'grab', text: sides.length === 2 ? (side === 'L' ? 'Prendi con la sinistra' : 'Prendi con la destra') : 'Prendi' });
			} else if ((L || R) && !uses.length) {
				const order: Side[] = this.last === 'L' ? ['L', 'R'] : ['R', 'L'];
				const places = order.map((side) => this.placement(side)).filter((p): p is Placement => !!p);
				if (places.length) {
					const shown = places[0];
					this.ghost.show(shown.node, shown.position, shown.quaternion, shown.ok);
					target = (shown.node.userData.label as string) ?? shown.node.name;
					for (const p of places.sort((a, b) => (a.side === 'L' ? -1 : 1) - (b.side === 'L' ? -1 : 1)))
						actions.push({ input: p.side, verb: 'place', text: p.ok ? (places.length === 2 ? `Posa ${p.side === 'L' ? 'la sinistra' : 'la destra'}` : 'Posa') : p.why, blocked: !p.ok });
				}
			}
			if (L && R && !uses.some((u) => u.input === 'F')) {
				const rod = L.name === 'GlassRod' || R.name === 'GlassRod';
				if (rod && (CONTAINERS.has(L.name) || CONTAINERS.has(R.name))) actions.push({ input: 'F', verb: 'stir', text: 'Mescola' });
				else if (CONTAINERS.has(L.name) && CONTAINERS.has(R.name)) actions.push({ input: 'F', verb: 'pour', text: 'Versa' });
			}
		}
		const next = { target, actions };
		if (JSON.stringify(next) !== JSON.stringify(this.aim)) {
			this.aim = next;
			this.emit();
		}
	}

	say(kind: 'info' | 'warn' | 'ok', text: string) {
		this.message = { kind, text };
		this.msgT = kind === 'warn' ? 8 : 6;
		this.emit();
	}

	/** The hold pose; with an offset (two hands working together) it follows the gaze fully, so the work is in view. */
	hold(side: Side, offset?: Vector3, pen = penHeld(this.hands.held(side))) {
		const p = this.s.player;
		return holdFrame(side, p.hand, p.hand.yaw, p.hand.pitch, offset, offset ? 1 : 0.6, pen ? PEN_PRONATION : 0);
	}

	// ---------------------------------------------------------------------------------------------

	/** Runs what the work on top offers for this input, if anything: true when it took the input. */
	private use(input: Action['input']) {
		const u = this.offered.find((x) => x.input === input);
		if (!u) return false;
		if (u.blocked) {
			if (u.why) this.say('info', u.why);
			return true;
		}
		if (u.run) {
			const r = u.run();
			if (r instanceof Promise) void this.run(() => r);
		}
		return true;
	}

	private wheel(delta: number) {
		if (this.busy) return;
		this.offered.find((x) => x.input === 'W')?.wheel?.(delta);
	}

	private press(side: Side, target: Object3D | null) {
		if (this.busy) {
			this.queued = { input: side, target, age: 0 };
			return;
		}
		if (this.use(side)) return;
		const other: Side = side === 'L' ? 'R' : 'L';
		const hand = side === 'L' ? 'sinistra' : 'destra';
		const held = this.hands.held(side);
		if (!held) {
			if (!target) return;
			if (!canHold(target.name) || FIXED.has(target.name)) return this.say('info', `${target.userData.label ?? target.name}: non si prende in mano.`);
			if (this.hands.held(other) === target || target.userData.fixed) return;
			if (this.hands.distance(side, target) > REACH) return this.say('info', 'Non ci arrivi: avvicinati al banco.');
			const no = this.refuse(target);
			if (no) return this.say('warn', no);
			this.last = side;
			void this.run(() => this.grab(side, target));
			return;
		}
		const at = this.placement(side);
		if (!at) return this.say('info', `Per appoggiare quello che hai nella mano ${hand}, punta un piano: il banco, la reticella.`);
		if (!at.ok) return this.say('info', at.why === 'Occupato' ? "Lì c'è già qualcosa." : 'Lì non ci arrivi: appoggia più vicino.');
		void this.run(() => this.putDown(side, held, at));
	}

	/** Runs an action with the hands, one at a time. */
	async run(fn: () => Promise<void>) {
		if (this.busy) return;
		this.busy = true;
		this.ghost.hide();
		this.emit();
		try {
			await fn();
		} finally {
			this.busy = false;
			this.emit();
		}
	}

	private async grab(side: Side, node: Object3D) {
		// anything leaning in the object (a thermometer) stays with it; the object leaves its host
		if (node.parent !== this.s.labRoot) this.s.labRoot.attach(node);
		this.s.held.add(node);
		// the grip that is comfortable once it is held in front of the body
		const ok = await this.hands.take(side, node, 'carry', this.hold(side, undefined, penHeld(node)).q);
		if (!ok) {
			this.s.held.delete(node);
			return;
		}
		await this.hands.carry(side, () => this.hold(side), 0.55, 0.06);
		this.hands.drive(side, null);
	}

	private async putDown(side: Side, node: Object3D, at: Placement) {
		await this.hands.place(side, at.position, at.quaternion);
		this.s.held.delete(node);
	}

	private update(dt: number) {
		const q = this.queued;
		if (q && ((q.age += dt) > BUFFER || !this.s.player.locked)) this.queued = null;
		else if (q && !this.busy) {
			this.queued = null;
			// the crosshair has moved on since: what the hands do next is decided on what it points at now
			this.aimAt();
			if (q.input === 'F') this.combine();
			else this.press(q.input, q.target);
		}
		this.aimAt();
		if (this.msgT > 0 && (this.msgT -= dt) <= 0) {
			this.message = null;
			this.emit();
		}
	}

	// ---------------------------------------------------------------------------------------------
	// the two hands together

	private combine() {
		if (this.busy) {
			this.queued = { input: 'F', target: null, age: 0 };
			return;
		}
		if (this.use('F')) return;
		const L = this.hands.held('L');
		const R = this.hands.held('R');
		if (!L || !R) return this.say('info', 'Per usare due cose insieme ti serve qualcosa in tutte e due le mani.');
		const rod: Side | null = L.name === 'GlassRod' ? 'L' : R.name === 'GlassRod' ? 'R' : null;
		if (rod) {
			const cup: Side = rod === 'L' ? 'R' : 'L';
			if (!CONTAINERS.has(this.hands.held(cup)!.name)) return this.say('info', 'Con la bacchetta si mescola dentro un recipiente.');
			void this.run(() => this.stir(rod, this.hands.held(cup)!));
			return;
		}
		if (CONTAINERS.has(L.name) && CONTAINERS.has(R.name)) {
			const fromSide: Side = (this.s.liquids.get(R.name)?.contents.vol ?? 0) > 0.05 ? 'R' : 'L';
			void this.run(async () => void (await this.pour(fromSide, this.hands.held(fromSide === 'R' ? 'L' : 'R')!)));
			return;
		}
		this.say('info', `${this.label('L')} e ${this.label('R')} non si usano insieme.`);
	}

	/**
	 * Stirs with the rod in a container: one in the other hand comes to the middle first, one standing on the bench
	 * stays. The rod comes down the axis of a cone, then swings out along it: the apex is where the fingers hold the
	 * rod, and stays still, the base a circle in the liquid near the bottom. The cone leans towards the rod's hand and
	 * is as wide as the container lets it be at every height (the narrowest place may be the bottom, the middle or a
	 * neck), and keeps clear of a thermometer standing in it (stirCone).
	 */
	async stir(rodSide: Side, cup: Object3D, turns = 3) {
		const h = this.hands;
		const rod = h.held(rodSide)!;
		const cupSide: Side | null = h.held('L') === cup ? 'L' : h.held('R') === cup ? 'R' : null;
		const lq = this.s.liquids.get(cup.name);
		if (cupSide) {
			const cupSign = cupSide === 'R' ? 1 : -1;
			// in front of the chest, upright, wherever the eyes look: a place where both hands work comfortably
			const cupAt = () => {
				const yaw = new Quaternion().setFromAxisAngle(UP, this.s.player.yaw);
				const o = Hands.objectFrom(this.hold(cupSide), h.gripOf(cupSide)!);
				const upright = new Quaternion().setFromUnitVectors(UP.clone().applyQuaternion(o.quaternion), UP).multiply(o.quaternion);
				const at = this.s.camera.position.clone().add(new Vector3(cupSign * 0.02, -0.38, -0.4).applyQuaternion(yaw));
				return h.palmFor(cupSide, at, upright);
			};
			await h.carry(cupSide, cupAt, 0.45);
			h.drive(cupSide, cupAt);
		}
		// the side of the container the rod hand is on, in the container's frame: the cone leans that way, as a rod held
		// like a pen does
		const yaw = this.s.player.yaw;
		const toHand = new Vector3(Math.cos(yaw), 0, -Math.sin(yaw))
			.multiplyScalar(rodSide === 'R' ? 0.95 : -0.95)
			.add(new Vector3(Math.sin(yaw), 0, Math.cos(yaw)).multiplyScalar(0.3))
			.applyQuaternion(cup.getWorldQuaternion(new Quaternion()).invert())
			.setY(0)
			.normalize();
		const cone = stirCone(cup, lq, SHAPES[rod.name]?.radius(0) ?? 0.003, Math.max(0.08, h.gripOf(rodSide)?.p.y ?? 0.15), toHand);
		const { c, A, r: width } = cone;
		// the rod keeps the turn about its own axis it has in the hand, so the wrist does not have to roll to stir
		const roll = new Vector3(0, 0, 1).applyQuaternion(rod.getWorldQuaternion(new Quaternion()));
		const toward = () => roll;
		// the rod's pose for its tip at a point of the container's frame, pointing at `top` (the apex, or along the cone)
		const pose = (tip: Vector3, top: Vector3): Pose => {
			cup.updateMatrixWorld(true);
			const t = tip.clone().applyMatrix4(cup.matrixWorld);
			const a = top.clone().applyMatrix4(cup.matrixWorld);
			return { position: t, quaternion: orient(a.sub(t), toward()) };
		};
		// down the cone's axis: the tip on the line from the apex to the middle of the bottom
		const axis = (y: number) => {
			const k = (A.y - y) / (A.y - cone.bottom);
			return pose(new Vector3(A.x + (c.x - A.x) * k, y, A.z + (c.z - A.z) * k), A);
		};
		const onCone = (phi: number, r: number) => pose(cone.tip(phi, r), A);
		// the arm does not always reach the pose (the wrist has limits): where the tip really is, against where it
		// should be, moves the hand's target every frame, as for pouring
		const fix = new Vector3();
		let want: Pose | null = null;
		const palm = (p: Pose) => {
			want = p;
			const f = h.palmFor(rodSide, p.position, p.quaternion);
			f.p.add(fix);
			return f;
		};
		// and if the rod as it really is comes near the glass anywhere along it, the circle narrows until it does not
		const rodR = SHAPES[rod.name]?.radius(0) ?? 0.003;
		let narrow = 1;
		const correct = (dt: number, down = false) => {
			if (!want) return;
			rod.updateMatrixWorld(true);
			cup.updateMatrixWorld(true);
			const tip = new Vector3().applyMatrix4(rod.matrixWorld);
			// sideways; up and down only while the tip stays at the bottom: as the rod moves down the hand lags behind, and
			// making up for that would overshoot
			const err = want.position.clone().sub(tip);
			if (!down) err.setY(0);
			fix.addScaledVector(err, 1 - Math.exp(-dt * 8));
			if (fix.length() > 0.05) fix.setLength(0.05);
			if (!lq) return;
			const inv = cup.matrixWorld.clone().invert();
			const a = tip.applyMatrix4(inv);
			const b = new Vector3(0, 0.2, 0).applyMatrix4(rod.matrixWorld).applyMatrix4(inv);
			let clear = Infinity;
			const near = new Vector3();
			for (let i = 0; i <= 20; i++) {
				const p = a.clone().lerp(b, i / 20);
				if (p.y < lq.profile.bottom || p.y > lq.profile.top) continue;
				const c = lq.profile.radiusAt(p.y) - Math.hypot(p.x, p.z) - rodR;
				if (c < clear) {
					clear = c;
					near.copy(p);
				}
			}
			const keep = 0.003;
			if (clear >= keep) {
				// room again: the circle opens back
				if (clear > keep + 0.002) narrow += (1 - narrow) * (1 - Math.exp(-dt * 2));
				return;
			}
			// the circle narrows (not below 60%), and the hand moves the rod away from that side of the glass
			narrow = Math.max(0.6, narrow * Math.exp(-dt * 6));
			const away = new Vector3(-near.x, 0, -near.z).normalize().transformDirection(cup.matrixWorld).setY(0).normalize();
			fix.addScaledVector(away, (keep - clear) * Math.min(1, dt * 30));
		};
		// above the mouth, then down the cone's axis, guided and corrected all the way
		const high = cone.top + 0.03;
		await h.carry(rodSide, () => palm(axis(high)), 0.55, 0.03);
		let y = high;
		h.drive(rodSide, () => palm(axis(y)));
		await this.s.anim.run(0.45, (k, dt) => {
			y = high + (cone.bottom - high) * k;
			correct(dt);
		});
		let phi = 0;
		let r = 0;
		h.drive(rodSide, () => palm(onCone(phi, r)));
		// the cone opens slowly enough for the correction to keep up with it
		await this.s.anim.run(0.6, (k, dt) => {
			r = width * k * narrow;
			correct(dt, true);
		}, ease.inOut);
		const grains = this.s.grains.get(cup.name);
		// the hand's rhythm: half a second to get going, 1.3 turns a second, half a second to stop; the liquid is
		// dragged round by the rod (effects.ts, Grains.drive)
		const speed = Math.PI * 2 * 1.3;
		const ramp = 0.5;
		const cruise = Math.max(0, (turns * Math.PI * 2) / speed - ramp);
		const total = cruise + 2 * ramp;
		let t = 0;
		await this.s.anim.until((dt) => {
			t = Math.min(total, t + dt);
			const w = speed * Math.min(1, t / ramp, (total - t) / ramp);
			phi += w * dt;
			r = width * narrow;
			grains?.drive(w);
			correct(dt, true);
			return t >= total;
		});
		await this.s.anim.run(0.3, (k, dt) => {
			r = width * narrow * (1 - k);
			correct(dt);
		}, ease.inOut);
		y = cone.bottom;
		h.drive(rodSide, () => palm(axis(y)));
		await this.s.anim.run(0.4, (k, dt) => {
			y = cone.bottom + (high + 0.01 - cone.bottom) * k;
			correct(dt);
		});
		h.drive(rodSide, null);
		if (cupSide) h.drive(cupSide, null);
		this.say('ok', lq && lq.contents.vol > 0 ? 'Mescolato.' : 'Hai mescolato un recipiente vuoto.');
	}

	/**
	 * Pours from one hand's container into another: the one in the other hand, which comes to the middle, or one
	 * standing on the bench (a funnel, a dish on the gauze). The pouring one goes over it and tips towards it by
	 * turning the forearm; liquid flows only once its tilted surface rises above the lip, with the pose the wrist
	 * actually reaches. `keep` stops it with that much left (a pipette's drop, a beaker's sediment); `receive`
	 * takes what flows, when the receiver is not a plain vessel.
	 */
	async pour(fromSide: Side, to: Object3D, opts: { keep?: number; receive?: (c: Contents) => void; mouth?: { y: number; r: number } } = {}): Promise<number> {
		const h = this.hands;
		const toSide: Side | null = h.held('L') === to ? 'L' : h.held('R') === to ? 'R' : null;
		const from = h.held(fromSide)!;
		const src = this.s.liquids.get(from.name);
		const dst = this.s.liquids.get(to.name);
		if (!src || src.contents.vol <= 0.05) {
			this.say('info', 'Non c’è niente da versare.');
			return 0;
		}
		if (!dst) {
			this.say('info', 'Lì dentro non si versa.');
			return 0;
		}
		const keep = opts.keep ?? 0.02;
		if (toSide) {
			const toSign = toSide === 'R' ? 1 : -1;
			const toAt = () => this.hold(toSide, new Vector3(toSign * 0.04, -0.17, -0.4));
			await h.carry(toSide, toAt, 0.45);
			h.drive(toSide, toAt);
		}
		// the lip: the rim point towards the other container
		const shape = SHAPES[from.name];
		const top = shape ? shape.y1 : src.profile.top;
		const rimR = shape ? shape.radius(top - 0.002) : src.profile.radiusAt(src.profile.top);
		const q0 = from.getWorldQuaternion(new Quaternion());
		// into one held in the other hand, towards it; into one on the bench, sideways towards the other hand, which the
		// forearm does by turning (tipping away from the body would need a wrist flexion the arm does not have)
		const yaw = this.s.player.yaw;
		const dirW = toSide
			? to.getWorldPosition(new Vector3()).sub(from.getWorldPosition(new Vector3())).setY(0).normalize()
			: new Vector3(Math.cos(yaw), 0, -Math.sin(yaw)).multiplyScalar(fromSide === 'R' ? -1 : 1);
		const lipLocal = dirW.clone().applyQuaternion(q0.clone().invert()).setY(0).normalize().multiplyScalar(rimR).setY(top);
		const axis = new Vector3().crossVectors(UP, dirW).normalize();
		let tilt = 0;
		// the hands do not reach the pose exactly (the wrists have limits), so where the stream lands is measured every
		// frame and this correction moves the pose until it lands in the other container's mouth
		const aim = new Vector3();
		const pose = (): Pose => {
			const q = new Quaternion().setFromAxisAngle(axis, tilt).multiply(q0);
			const rim = to
				.getWorldPosition(new Vector3())
				.add(new Vector3(0, mouthY + 0.015 + 0.035 * (1 - Math.min(1, tilt / 1.2)), 0))
				.addScaledVector(dirW, -0.012)
				.add(aim);
			return { position: placePoint(rim, lipLocal, q), quaternion: q };
		};
		const toShape = SHAPES[to.name];
		const mouthY = opts.mouth?.y ?? (toShape && toShape.y1 > 0.01 ? toShape.y1 : dst.profile.top);
		const mouthR = opts.mouth?.r ?? (toShape && toShape.y1 > 0.01 ? toShape.radius(mouthY - 0.002) : dst.profile.radiusAt(dst.profile.top));
		const mouth = new Vector3();
		const land = new Vector3();
		let rate = 0;
		let stuck = 0;
		let total = 0;
		this.pourMiss = 0;
		this.pourTrace = [];
		const palm = () => {
			const p = pose();
			return h.palmFor(fromSide, p.position, p.quaternion);
		};
		await h.carry(fromSide, palm, 0.55, 0.04);
		h.drive(fromSide, palm);
		const color = new Color();
		const lip = new Vector3();
		const max = (115 * Math.PI) / 180;
		await this.s.anim.until((dt) => {
			from.updateMatrixWorld(true);
			to.updateMatrixWorld(true);
			lip.copy(lipLocal).applyMatrix4(from.matrixWorld);
			// where the stream would land (effects.ts: it leaves the lip along dirW) against the middle of the mouth
			mouth.set(0, mouthY, 0).applyMatrix4(to.matrixWorld);
			const out = Math.min(0.02, 0.004 + rate * 0.002);
			land.copy(lip).addScaledVector(dirW, out * 1.6);
			const miss = Math.hypot(mouth.x - land.x, mouth.z - land.z);
			const k = 1 - Math.exp(-dt * 6);
			aim.x += (mouth.x - land.x) * k;
			aim.z += (mouth.z - land.z) * k;
			if (lip.y < mouth.y + 0.008) aim.y += (mouth.y + 0.008 - lip.y) * k;
			if (aim.length() > 0.12) aim.setLength(0.12);
			// it pours only into the mouth: until the stream would land inside, the tilt waits
			const inside = miss < mouthR * 0.7 && lip.y > mouth.y;
			if (process.env.NODE_ENV !== 'production') this.pourTrace.push([miss, lip.y - mouth.y, mouthR, tilt, aim.length()].map((v) => Math.round(v * 1000) / 1000));
			const head = src.level() - lip.y;
			let flow = 0;
			if (!inside && head > -0.0004) {
				stuck += dt;
				rate = 0;
				this.s.stream.set(null, dirW, 0, 0, color, 0);
				return stuck > 4;
			}
			if (flow === 0 && head > -0.0004) {
				this.pourMiss = Math.max(this.pourMiss, miss);
				flow = Math.min(Math.max(0, src.contents.vol - keep), (head + 0.0004) * 2600 * dt);
				flow = Math.min(flow, Math.max(0, dst.capacity * 0.95 - dst.contents.vol));
				if (flow > 0) {
					total += flow;
					const c = src.contents.take(flow, true);
					if (opts.receive) opts.receive(c);
					else dst.contents.add(c);
				}
			}
			rate = flow / Math.max(dt, 1e-4);
			tilt = Math.min(max, tilt + (flow > 0 ? 0.16 : 0.8) * dt);
			color.copy(src.material.color);
			this.s.stream.set(flow > 0 ? lip : null, dirW, dst.level(), flow / dt, color, src.material.opacity);
			return src.contents.vol <= keep + 0.001 || tilt >= max || dst.contents.vol >= dst.capacity * 0.95;
		});
		this.s.stream.set(null, dirW, 0, 0, color, 0);
		const back = tilt;
		await this.s.anim.run(0.5, (k) => (tilt = back * (1 - k)), ease.inOut);
		h.drive(fromSide, null);
		if (toSide) h.drive(toSide, null);
		if (total < 0.05) this.say('info', 'Da qui non riesci a versarci dentro: avvicinati.');
		else if (!opts.receive) this.say('ok', dst.contents.vol >= dst.capacity * 0.95 ? 'Il recipiente è pieno.' : 'Versato.');
		return total;
	}
}

/**
 * The cone a rod stirs in, in the container's frame. Its apex `A` is where the fingers hold the rod, `L` from the tip;
 * its base a circle of radius `r` round `c` near the bottom. The apex leans towards the hand (`toHand`) as far as the
 * container lets the rod through, up to 35° (a rod is held like a pen, not upright); then the circle is as wide as it
 * can be. At no height may the rod come nearer the wall than its radius and a margin, and a thermometer standing in
 * the container is kept clear of, the cone moving to its other side.
 */
export function stirCone(cup: Object3D, lq: LiquidBody | undefined, rodR: number, L: number, toHand: Vector3) {
	const prof = lq?.profile;
	const bottom = (prof?.bottom ?? 0) + rodR + 0.003;
	const top = prof?.top ?? 0.07;
	const wall = (y: number) => (prof ? prof.radiusAt(y) : 0.02);
	// the arm does not hold the rod perfectly: the stirring puts the tip right, and what is left is a small error in
	// its tilt, which shows more the higher up the rod. Two millimetres spare at the tip, two more every ten
	// centimetres above it (a flask's neck is far from the tip)
	const margin = (above: number) => 0.002 + 0.02 * Math.max(0, above);
	const th = cup.children.find((o) => o.name === 'Thermometer');
	let seg: [Vector3, Vector3] | null = null;
	const c = new Vector3();
	if (th) {
		cup.updateMatrixWorld(true);
		const inv = cup.matrixWorld.clone().invert();
		const a = th.getWorldPosition(new Vector3()).applyMatrix4(inv);
		const b = new Vector3(0, 0.25, 0).applyMatrix4(th.matrixWorld).applyMatrix4(inv);
		seg = [a, b];
		const away = new Vector3(-a.x, 0, -a.z);
		if (away.lengthSq() > 1e-8) c.copy(away.normalize().multiplyScalar(0.006));
	}
	const apexAt = (d: number) => new Vector3(c.x + toHand.x * d, bottom + Math.sqrt(L * L - d * d), c.z + toHand.z * d);
	// the tip for the apex `A` at angle `phi` of a circle `r` round `c`, `L` from the apex
	const tipFor = (A: Vector3, phi: number, r: number) => {
		const x = c.x + r * Math.cos(phi);
		const z = c.z + r * Math.sin(phi);
		const hz = Math.hypot(x - A.x, z - A.z);
		return new Vector3(x, A.y - Math.sqrt(Math.max(0, L * L - hz * hz)), z);
	};
	const fits = (d: number, r: number) => {
		const A = apexAt(d);
		for (let k = 0; k < 16; k++) {
			const tip = tipFor(A, (k / 16) * Math.PI * 2, r);
			for (let i = 0; i <= 24; i++) {
				const y = tip.y + ((top - tip.y) * i) / 24;
				const p = tip.clone().lerp(A, (y - tip.y) / (A.y - tip.y));
				if (Math.hypot(p.x, p.z) > wall(y) - rodR - margin(y - tip.y)) return false;
			}
			if (seg && segDistance(tip, A, seg[0], seg[1]) < rodR + 0.0035 + margin(0.03)) return false;
		}
		return true;
	};
	const most = (ok: (x: number) => boolean, max: number) => {
		if (ok(max)) return max;
		let lo = 0;
		let hi = max;
		for (let i = 0; i < 14; i++) {
			const mid = (lo + hi) / 2;
			if (ok(mid)) lo = mid;
			else hi = mid;
		}
		return lo;
	};
	// the stirring first: a circle three quarters as wide as the container allows; then as much lean towards the hand
	// as leaves room for it; then the circle as wide as that lean allows
	const full = most((x) => fits(0, x), Math.min(0.03, L * 0.5));
	const d = most((x) => fits(x, full * 0.75), L * Math.sin((35 * Math.PI) / 180));
	const r = most((x) => fits(d, x), Math.min(0.03, L * 0.5));
	const A = apexAt(d);
	return { c, A, r, L, top, bottom, tip: (phi: number, rr: number) => tipFor(A, phi, rr) };
}

/** The shortest distance between two segments. */
function segDistance(p1: Vector3, q1: Vector3, p2: Vector3, q2: Vector3) {
	let best = Infinity;
	const a = new Vector3();
	const b = new Vector3();
	// sampled: the segments are short and this runs once per stir
	for (let i = 0; i <= 20; i++) {
		a.lerpVectors(p1, q1, i / 20);
		for (let j = 0; j <= 20; j++) best = Math.min(best, a.distanceTo(b.lerpVectors(p2, q2, j / 20)));
	}
	return best;
}

