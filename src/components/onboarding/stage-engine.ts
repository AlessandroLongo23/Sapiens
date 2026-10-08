import {
	AmbientLight,
	Box3,
	CanvasTexture,
	Color,
	DirectionalLight,
	Group,
	Mesh,
	MeshBasicMaterial,
	NeutralToneMapping,
	Object3D,
	OrthographicCamera,
	PlaneGeometry,
	PMREMGenerator,
	Scene,
	SRGBColorSpace,
	Vector3,
	WebGLRenderer
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * The live objects of the onboarding. One canvas covers the window and draws every object in the page's own
 * pixels: an object sits wherever the page has an element marked `data-stage-slot="<id>"`, at that element's
 * size. When the slot moves, appears somewhere else or goes away (a new step), the object flies there on a
 * spring, or shrinks out: the backpack chosen on the first screen travels to the notebook of the next one.
 *
 * Each object leans towards the pointer, rises a little when its slot's card is under it, and hops with a spin
 * when asked (`hop`). Some have a part of their own that moves (`PARTS`). The models are the ones
 * scripts/materie/icons.py renders for the cards, exported as they stand (`glb` mode), and are shown from the
 * same side.
 */

/** The side the objects are modelled to be seen from, as two turns: about the vertical, then towards the viewer. */
export const VIEW_YAW = -Math.atan2(1, 1.35);
export const VIEW_PITCH = Math.atan2(0.95, Math.hypot(1, 1.35));

/** How much of its slot an object fills. */
const FILL = 0.82;

interface Spring {
	x: number;
	v: number;
}
const spring = (x = 0): Spring => ({ x, v: 0 });
/** One step of a damped spring towards `to`. */
function step(s: Spring, to: number, dt: number, stiffness: number, damping: number) {
	s.v += (stiffness * (to - s.x) - damping * s.v) * dt;
	s.x += s.v * dt;
}

/** The pieces the loops of scripts/materie/icons.py are made of: a stretch of the loop from 0 to 1, a soft start and stop, a spring that overshoots and settles. */
const seg = (u: number, a: number, b: number) => Math.max(0, Math.min(1, (u - a) / (b - a)));
const smooth = (x: number) => x * x * (3 - 2 * x);
const settle = (x: number, damp: number, freq: number) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.exp(-damp * x) * Math.cos(freq * x));
/** Where the loop of the subject cards is now, from 0 to 1: 75 frames at 30 a second. */
const loop = () => (performance.now() / 2500) % 1;
/** A bump that starts and ends at 0, ringing as it dies. */
const ring = (x: number) => (x <= 0 || x >= 1 ? 0 : Math.exp(-5 * x) * Math.sin(13 * x) * (1 - x) * 1.6);
/** A hop of a part, as `jump` in icons.py: it crouches, leaves the ground by `h`, lands and wobbles, turning by `spin` on the way. */
function jump(node: Object3D | undefined, rest: { y: number; ry: number } | undefined, t: number, h: number, spin = 0) {
	if (!node || !rest) return;
	let up = 0;
	let tall = 1;
	if (t > 0 && t < 0.18) tall = 1 - 0.2 * Math.sin((Math.PI * t) / 0.18);
	else if (t >= 0.18 && t < 0.7) {
		const a = (t - 0.18) / 0.52;
		up = h * 4 * a * (1 - a);
		tall = 1 + 0.1 * Math.sin(Math.PI * a);
	} else if (t >= 0.7 && t < 1) {
		const a = (t - 0.7) / 0.3;
		tall = 1 - 0.22 * Math.exp(-4.5 * a) * Math.cos(13 * a) * (1 - a);
	}
	const wide = 1 / Math.sqrt(tall);
	node.position.y = rest.y + up;
	node.scale.set(wide, tall, wide);
	node.rotation.y = rest.ry + spin * smooth(seg(t, 0.18, 0.7));
}

export type Parts = Record<string, Object3D>;
export type Rest = Record<string, { y: number; ry: number; rz: number }>;
/**
 * The loops of the subject cards (scripts/materie/icons.py), on the same curves: where each object's parts are at
 * the moment `u` of its loop, from 0 to 1. The onboarding plays them in time, the landing page along the scroll.
 */
export const LOOPS: Record<string, (parts: Parts, rest: Rest, u: number) => void> = {
	// The circle is rubbed out, then the compass goes once round and draws it again, leaning the way it is going.
	math: (p, r, u) => {
		const a = smooth(seg(u, 0.3, 0.95));
		p['part-compass']?.rotation.set(-0.26 * Math.sin(Math.PI * a) ** 0.8, 2 * Math.PI * a, 0, 'YXZ');
		const circle = p['part-circle'] as Mesh | undefined;
		const all = circle?.geometry?.index?.count;
		if (circle && all) circle.geometry.setDrawRange(0, Math.floor((Math.max(1 - smooth(seg(u, 0.02, 0.26)), a) * all) / 3) * 3);
	},
	// The first ball goes up and comes down, the last one answers, the three between shiver when they are hit.
	physics: (p, r, u) => {
		const c = Math.cos(2 * Math.PI * u);
		const hit = 0.012 * Math.exp(-((Math.abs(c) / 0.12) ** 2)) * (u < 0.5 ? 1 : -1);
		for (let i = 0; i < 5; i++) {
			const swing = p[`part-swing-${i}`];
			if (swing) swing.rotation.z = i === 0 ? -0.72 * Math.max(c, 0) : i === 4 ? 0.72 * Math.max(-c, 0) : -hit;
		}
	},
	// The flask turns one way and the other, and four bubbles take turns leaving its neck: each swells, drifts up and is gone.
	chemistry: (p, r, u) => {
		const sway = Math.sin(2 * Math.PI * u);
		p['part-flask']?.rotation.set(0, 0.5 + 0.25 * sway, -0.07 * sway, 'YZX');
		for (let i = 0; i < 4; i++) {
			const bubble = p[`part-bubble-${i}`];
			if (!bubble) continue;
			const q = (u + [0.38, 0.12, 0.66, 0.9][i]) % 1;
			const s = q < 0.85 ? Math.max(Math.sin(Math.PI * q) ** 0.6, 0.001) : Math.max((1 - q) / 0.15, 0.001) * Math.sin(Math.PI * 0.85) ** 0.6;
			bubble.scale.setScalar(s);
			bubble.position.set(0.16 * Math.sin(2 * Math.PI * q + 2.1 * i) + 0.1 * (i - 1.5) * q, 2.25 + 0.85 * q, -0.05 * (i - 1.5));
		}
	},
	// The keys are typed one after the other: down fast, back up on a spring.
	'computer-science': (p, r, u) => {
		for (let i = 0; i < 3; i++) {
			const key = p[`part-key-${i}`];
			if (!key) continue;
			const a = seg(u, 0.06 + 0.24 * i, 0.5 + 0.24 * i);
			const down = smooth(seg(a, 0, 0.16)) * (1 - settle(seg(a, 0.16, 1), 5, 14));
			key.position.y = r[`part-key-${i}`].y - 0.2 * down;
			key.scale.set(1 + 0.04 * down, 1 - 0.1 * down, 1 + 0.04 * down);
		}
	},
	// The three levels of the library. The pencils hop one after the other, each with a third of a turn.
	middle_school: (p, r, u) => {
		for (let i = 0; i < 3; i++) jump(p[`part-pencil-${i}`], r[`part-pencil-${i}`], seg(u, 0.03 + 0.26 * i, 0.47 + 0.26 * i), 0.3, (Math.PI / 3) * 2);
	},
	// The pile of books breathes open from the top and settles, each book turning a little on the way.
	high_school: (p, r, u) => {
		const lift = Math.max(settle(seg(u, 0.04, 0.48), 5, 9) - settle(seg(u, 0.5, 0.96), 5.5, 11), -0.02);
		for (let i = 0; i < 4; i++) {
			const book = p[`part-book-${i}`];
			if (!book) continue;
			book.position.y = r[`part-book-${i}`].y + 0.16 * i * lift;
			book.rotation.y = r[`part-book-${i}`].ry + (i % 2 ? 0.25 : -0.25) * lift * (i / 3);
		}
	},
	// The cap is tossed with a full turn, the tassel swings on after it lands, the books under it give.
	university: (p, r, u) => {
		const a = seg(u, 0.04, 0.6);
		jump(p['part-cap'], r['part-cap'], a, 0.75, 2 * Math.PI);
		const swing = 0.9 * Math.exp(-3.2 * u) * Math.sin(6 * Math.PI * u) * (1 - u);
		p['part-tassel']?.rotation.set(swing, 0, -swing);
		for (let i = 0; i < 2; i++) p[`part-base-${i}`]?.scale.set(1, 1 - 0.06 * ring(seg(u, 0.42, 0.9)), 1);
	}
};

/** What moves inside an object besides the object itself: `e` is how excited it is (0 at rest, 1 under the pointer or just chosen). */
const PARTS: Record<string, (parts: Parts, rest: Rest, t: number, e: number) => void> = {
	student: (p, r, t, e) => {
		const pocket = p['part-pocket'];
		if (pocket) pocket.scale.setScalar(1 + 0.1 * e * Math.abs(Math.sin(t * 9)));
	},
	parent: (p, r, t, e) => {
		const roof = p['part-roof'];
		if (!roof) return;
		roof.position.y = r['part-roof'].y + 0.32 * e;
		roof.rotation.y = r['part-roof'].ry + 0.14 * e;
	},
	tutor: (p, r, t, e) => {
		for (let i = 0; i < 7; i++) p[`part-ray-${i}`]?.scale.setScalar(1 + (0.05 + 0.2 * e) * Math.sin(t * 5 - i * 0.7));
		p['part-lamp']?.scale.setScalar(1 + 0.05 * e);
	},
	school: (p, r, t, e) => {
		const flag = p['part-flag'];
		if (flag) flag.rotation.y = r['part-flag'].ry + (0.18 + 0.4 * e) * Math.sin(t * (3 + 4 * e));
		const hand = p['part-hand'];
		if (hand) hand.rotation.z = r['part-hand'].rz - t * (0.5 + 5 * e);
	},
	email: (p, r, t, e) => {
		const card = p['part-card'];
		if (card) card.position.y = r['part-card'].y + 0.12 * Math.sin(t * 1.6) + 0.18 * e;
	},
	math: (p, r) => LOOPS.math(p, r, loop()),
	physics: (p, r) => LOOPS.physics(p, r, loop()),
	chemistry: (p, r) => LOOPS.chemistry(p, r, loop()),
	'computer-science': (p, r) => LOOPS['computer-science'](p, r, loop()),
	middle_school: (p, r) => LOOPS.middle_school(p, r, loop()),
	high_school: (p, r) => LOOPS.high_school(p, r, loop()),
	university: (p, r) => LOOPS.university(p, r, loop())
};

interface Actor {
	id: string;
	/** Position and size on the page. */
	root: Group;
	/** Leans towards the pointer. */
	lean: Group;
	/** Turns about the object's own vertical, and squashes. */
	turn: Group;
	shadow: Mesh;
	parts: Parts;
	rest: Rest;
	loaded: boolean;
	placed: boolean;
	x: Spring;
	y: Spring;
	size: Spring;
	yaw: Spring;
	pitch: Spring;
	lift: Spring;
	excite: Spring;
	/** Height of a hop in progress and its speed, and the spin that goes with it. */
	hop: Spring;
	spin: Spring;
	spinTo: number;
	phase: number;
}

export interface Stage {
	/** A hop with a full turn, for the object that has just been chosen or has something to celebrate. */
	hop: (id: string) => void;
	destroy: () => void;
}

let softShadow: CanvasTexture | null = null;
export function shadowTexture() {
	if (softShadow) return softShadow;
	const size = 128;
	const canvas = document.createElement('canvas');
	canvas.width = canvas.height = size;
	const ctx = canvas.getContext('2d')!;
	const fade = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
	fade.addColorStop(0, 'rgba(0,0,0,0.5)');
	fade.addColorStop(0.5, 'rgba(0,0,0,0.16)');
	fade.addColorStop(1, 'rgba(0,0,0,0)');
	ctx.fillStyle = fade;
	ctx.fillRect(0, 0, size, size);
	softShadow = new CanvasTexture(canvas);
	return softShadow;
}

/** The room and the lamps every live object is seen in; the caller disposes of what it returns. */
export function lightScene(scene: Scene, renderer: WebGLRenderer): PMREMGenerator {
	renderer.outputColorSpace = SRGBColorSpace;
	renderer.toneMapping = NeutralToneMapping;
	renderer.toneMappingExposure = 1.08;
	const pmrem = new PMREMGenerator(renderer);
	scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
	scene.environmentIntensity = 0.55;
	scene.add(new AmbientLight(0xffffff, 0.55));
	const light = (x: number, y: number, z: number, intensity: number, color = 0xffffff) => {
		const l = new DirectionalLight(color, intensity);
		l.position.set(x, y, z);
		scene.add(l);
	};
	light(-0.7, 1.2, 1.0, 2.4);
	light(1.0, 0.2, 0.6, 0.7, 0xe6f0ff);
	light(0.3, 0.8, -1.0, 1.1);
	return pmrem;
}

/** Starts the stage on `canvas`, with the models it may be asked for (`id` to file). Throws where WebGL is missing. */
export function createStage(canvas: HTMLCanvasElement, models: Record<string, string>): Stage {
	const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
	const scene = new Scene();
	const pmrem = lightScene(scene, renderer);

	const camera = new OrthographicCamera(0, 1, 0, -1, -4000, 4000);
	camera.position.z = 1000;
	const loader = new GLTFLoader();
	const actors = new Map<string, Actor>();
	const pointer = { x: -1e5, y: -1e5, seen: false };
	let width = 0;
	let height = 0;
	let frame = 0;
	let last = performance.now();
	let alive = true;

	const resize = () => {
		width = window.innerWidth;
		height = window.innerHeight;
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
		renderer.setSize(width, height, false);
		camera.right = width;
		camera.bottom = -height;
		camera.updateProjectionMatrix();
	};

	function actorOf(id: string): Actor | null {
		const known = actors.get(id);
		if (known) return known;
		const url = models[id];
		if (!url) return null;
		const root = new Group();
		const lean = new Group();
		const view = new Group();
		const turn = new Group();
		view.rotation.set(VIEW_PITCH, VIEW_YAW, 0);
		root.add(lean);
		lean.add(view);
		view.add(turn);
		root.visible = false;
		scene.add(root);
		const shadow = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: shadowTexture(), color: new Color(0x1c2340), transparent: true, depthWrite: false, opacity: 0.5 }));
		shadow.rotation.x = -Math.PI / 2;
		view.add(shadow);
		const actor: Actor = { id, root, lean, turn, shadow, parts: {}, rest: {}, loaded: false, placed: false, x: spring(), y: spring(), size: spring(), yaw: spring(), pitch: spring(), lift: spring(), excite: spring(), hop: spring(), spin: spring(), spinTo: 0, phase: actors.size * 1.7 };
		actors.set(id, actor);
		loader.load(url, (gltf) => {
			if (!alive) return;
			const model = gltf.scene;
			turn.add(model);
			// Stand it on the origin of `turn`, centred on its vertical, one unit across as the viewer sees it.
			const box = new Box3().setFromObject(model);
			const centre = box.getCenter(new Vector3());
			model.position.set(-centre.x, -box.min.y, -centre.z);
			root.updateMatrixWorld(true);
			const seen = new Box3().setFromObject(turn);
			const span = Math.max(seen.max.x - seen.min.x, seen.max.y - seen.min.y);
			const unit = 1 / span;
			view.scale.setScalar(unit);
			view.position.set((-(seen.max.x + seen.min.x) / 2) * unit, (-(seen.max.y + seen.min.y) / 2) * unit, 0);
			const footprint = Math.max(box.max.x - box.min.x, box.max.z - box.min.z);
			shadow.scale.set(footprint * 1.45, footprint * 1.45, 1);
			shadow.position.set(footprint * 0.12, 0.005, footprint * 0.1);
			model.traverse((node) => {
				if (!node.name.startsWith('part-')) return;
				actor.parts[node.name] = node;
				actor.rest[node.name] = { y: node.position.y, ry: node.rotation.y, rz: node.rotation.z };
			});
			actor.loaded = true;
		});
		return actor;
	}

	const onPointer = (e: PointerEvent) => {
		if (e.pointerType !== 'mouse') return;
		pointer.x = e.clientX;
		pointer.y = e.clientY;
		pointer.seen = true;
	};

	function tick(now: number) {
		if (!alive) return;
		frame = requestAnimationFrame(tick);
		const dt = Math.min((now - last) / 1000, 1 / 30);
		last = now;
		const t = now / 1000;

		const slots = new Map<string, HTMLElement>();
		for (const el of document.querySelectorAll<HTMLElement>('[data-stage-slot]')) {
			const id = el.dataset.stageSlot!;
			if (!slots.has(id) && el.offsetParent !== null) slots.set(id, el);
		}
		for (const id of slots.keys()) actorOf(id);

		let drawn = false;
		for (const actor of actors.values()) {
			const slot = slots.get(actor.id);
			let size = 0;
			let hovered = false;
			if (slot && actor.loaded) {
				const rect = slot.getBoundingClientRect();
				size = Math.min(rect.width, rect.height) * FILL;
				const cx = rect.left + rect.width / 2;
				const cy = rect.top + rect.height / 2;
				if (!actor.placed) {
					// Its first appearance: it grows where it is, it does not fly in from a corner.
					actor.x.x = cx;
					actor.y.x = cy;
					actor.placed = true;
				}
				step(actor.x, cx, dt, 150, 19);
				step(actor.y, cy, dt, 150, 19);
				hovered = pointer.seen && !!slot.closest('[data-stage-hover]')?.matches(':hover');
			}
			step(actor.size, size, dt, size ? 190 : 320, size ? 17 : 34);
			if (actor.size.x < 0.5 && !size) {
				actor.root.visible = false;
				actor.placed = false;
				continue;
			}
			actor.root.visible = true;
			drawn = true;

			// Towards the pointer: more when it is near.
			const dx = pointer.seen ? pointer.x - actor.x.x : 0;
			const dy = pointer.seen ? pointer.y - actor.y.x : 0;
			const near = 1 / (1 + Math.hypot(dx, dy) / 520);
			step(actor.yaw, Math.max(-1, Math.min(1, dx / 380)) * 0.5 * near + 0.07 * Math.sin(t * 0.8 + actor.phase), dt, 60, 12);
			step(actor.pitch, Math.max(-1, Math.min(1, dy / 380)) * 0.22 * near, dt, 60, 12);
			step(actor.lift, hovered ? 1 : 0, dt, 260, 20);
			step(actor.excite, hovered || actor.hop.x > 2 ? 1 : 0, dt, 90, 14);

			// A hop: gravity pulls it back to the ground, where it squashes for a moment.
			if (actor.hop.x > 0 || actor.hop.v > 0) {
				actor.hop.v -= 2600 * dt;
				actor.hop.x += actor.hop.v * dt;
				if (actor.hop.x <= 0) {
					actor.hop.x = 0;
					actor.hop.v = 0;
				}
			}
			step(actor.spin, actor.spinTo, dt, 70, 13);

			const speed = Math.hypot(actor.x.v, actor.y.v);
			const flying = Math.min(speed / 2200, 0.22);
			const scale = Math.max(actor.size.x, 0.001) * (1 + 0.07 * actor.lift.x + flying);
			const bob = 2.2 * Math.sin(t * 1.3 + actor.phase);
			const high = actor.hop.x * (actor.size.x / 160);
			actor.root.position.set(actor.x.x, -(actor.y.x - 5 * actor.lift.x + bob - high), 0);
			actor.root.scale.setScalar(scale);
			actor.lean.rotation.set(actor.pitch.x * 0.6, 0, -actor.x.v / 9000);
			actor.turn.rotation.y = actor.yaw.x + actor.spin.x;
			const stretch = 1 + Math.max(-0.12, Math.min(0.12, actor.hop.v / 9000));
			actor.turn.scale.set(1 / Math.sqrt(stretch), stretch, 1 / Math.sqrt(stretch));
			const air = Math.min(actor.hop.x / 120, 1);
			(actor.shadow.material as MeshBasicMaterial).opacity = 0.34 * (1 - 0.6 * air) * Math.min(actor.size.x / 60, 1);
			PARTS[actor.id]?.(actor.parts, actor.rest, t, actor.excite.x);
		}
		// Nothing on stage: one last empty frame, then no more drawing until a slot comes back.
		if (drawn || canvas.dataset.empty !== '1') renderer.render(scene, camera);
		canvas.dataset.empty = drawn ? '0' : '1';
	}

	resize();
	window.addEventListener('resize', resize);
	window.addEventListener('pointermove', onPointer, { passive: true });
	frame = requestAnimationFrame(tick);

	return {
		hop(id) {
			const actor = actors.get(id);
			if (!actor) return;
			actor.hop.x = Math.max(actor.hop.x, 0.01);
			actor.hop.v = 620;
			actor.spinTo += Math.PI * 2;
		},
		destroy() {
			alive = false;
			cancelAnimationFrame(frame);
			window.removeEventListener('resize', resize);
			window.removeEventListener('pointermove', onPointer);
			pmrem.dispose();
			renderer.dispose();
		}
	};
}
