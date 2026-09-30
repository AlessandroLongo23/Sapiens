import {
	ACESFilmicToneMapping,
	BufferAttribute,
	BufferGeometry,
	Color,
	DirectionalLight,
	DoubleSide,
	HemisphereLight,
	Mesh,
	MeshPhysicalMaterial,
	MeshStandardMaterial,
	Object3D,
	PCFShadowMap,
	PerspectiveCamera,
	PlaneGeometry,
	Points,
	PointsMaterial,
	Quaternion,
	Scene,
	SkinnedMesh,
	SRGBColorSpace,
	TextureLoader,
	Timer,
	Vector3,
	WebGLRenderer
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Avatar } from './avatar';
import { Hands } from './hands';
import { lerpAngles, OPEN, SHAPES, type Side } from './grasp';
import { jitter, seeded, solveGrip, type GripResult, type GripSpec } from './grip';
import { SETTLE, settlePose, type HandPose } from './settle';

/*
 * The hands playground (/laboratorio/mani): one object, the student's arm reaching it, and a grip made of a few
 * parameters (grip.ts). The object hangs from the solved hand, as it does in the game when it is carried; the glove's
 * vertices that end up inside the object show in red.
 */

export type Pose = { name: string; variant: string; side: Side; spec: GripSpec; phi: number; up: 1 | -1; closure: number };

const EYE = new Vector3(0, 1.662, -0.092);

export class HandStage {
	readonly renderer: WebGLRenderer;
	readonly scene = new Scene();
	readonly camera = new PerspectiveCamera(35, 1, 0.01, 20);
	readonly controls: OrbitControls;
	private avatar!: Avatar;
	private objects = new Map<string, Object3D>();
	private current: Object3D | null = null;
	private pose: Pose | null = null;
	private result: GripResult | null = null;
	/** A settling being played: the hand shifts from one variation of the grip to another, the object stays. */
	private settling: { a: HandPose; b: HandPose; t: number } | null = null;
	/** After a settling the palm stays where it was and the object sits in it differently, as in the game. */
	private palmAt: GripResult['grip'] | null = null;
	private red: Points;
	private green: Points;
	private timer = new Timer();
	private raf = 0;
	private frame = 0;
	private ro: ResizeObserver;
	onResult: (r: GripResult | null) => void = () => {};

	constructor(private host: HTMLElement) {
		const r = new WebGLRenderer({ antialias: true });
		r.setPixelRatio(Math.min(2, window.devicePixelRatio));
		r.outputColorSpace = SRGBColorSpace;
		r.toneMapping = ACESFilmicToneMapping;
		r.shadowMap.enabled = true;
		r.shadowMap.type = PCFShadowMap;
		host.appendChild(r.domElement);
		this.renderer = r;
		this.scene.background = new Color('#dfe5ea');
		this.scene.add(new HemisphereLight('#ffffff', '#8c8f99', 1.6));
		const key = new DirectionalLight('#fff4e6', 2.2);
		key.position.set(1.2, 2.6, 1.4);
		key.castShadow = true;
		key.shadow.mapSize.set(1024, 1024);
		this.scene.add(key);
		const floor = new Mesh(new PlaneGeometry(6, 6).rotateX(-Math.PI / 2), new MeshStandardMaterial({ color: '#c9ced4', roughness: 0.9 }));
		floor.receiveShadow = true;
		this.scene.add(floor);
		this.controls = new OrbitControls(this.camera, r.domElement);
		this.controls.enableDamping = true;
		this.camera.position.set(0.55, 1.25, 0.55);
		this.red = new Points(new BufferGeometry(), new PointsMaterial({ color: '#ff2d3d', size: 5, sizeAttenuation: false, depthTest: false }));
		this.red.renderOrder = 10;
		this.red.frustumCulled = false;
		this.scene.add(this.red);
		this.green = new Points(new BufferGeometry(), new PointsMaterial({ color: '#19c37d', size: 8, sizeAttenuation: false, depthTest: false }));
		this.green.renderOrder = 11;
		this.green.frustumCulled = false;
		this.scene.add(this.green);
		this.ro = new ResizeObserver(() => this.resize());
		this.ro.observe(host);
		this.resize();
	}

	async load() {
		const loader = new GLTFLoader();
		loader.register((parser) => {
			parser.textureLoader = new TextureLoader(parser.options.manager);
			return { name: 'lab_img_textures' };
		});
		// the bench's pieces, and from the first lab the ones the bench does not have
		const [banco, first] = await Promise.all([loader.loadAsync('/lab/banco.glb'), loader.loadAsync('/lab/laboratorio.glb')]);
		for (const name of Object.keys(SHAPES)) {
			const n = banco.scene.getObjectByName(name) ?? first.scene.getObjectByName(name);
			if (!n) continue;
			const o = n.clone(true);
			o.position.set(0, 0, 0);
			o.quaternion.identity();
			o.traverse((c) => {
				const m = c as Mesh;
				if (!m.isMesh) return;
				const mat = m.material as MeshStandardMaterial;
				// glass shows the hand through it
				if (mat.name?.startsWith('Glass')) m.material = new MeshPhysicalMaterial({ color: '#e8f3f8', roughness: 0.1, transparent: true, opacity: 0.28, side: DoubleSide, depthWrite: false });
				m.castShadow = true;
			});
			o.visible = false;
			this.scene.add(o);
			this.objects.set(name, o);
		}
		this.avatar = await Avatar.load('/lab/avatar.glb');
		this.avatar.root.position.set(0, 0, 0.45);
		this.scene.add(this.avatar.root);
		this.avatar.root.updateMatrixWorld(true);
		return [...this.objects.keys()];
	}

	/** Solves and shows a pose. */
	set(pose: Pose) {
		const changedObject = pose.name !== this.pose?.name || pose.side !== this.pose?.side;
		this.pose = pose;
		this.settling = null;
		this.palmAt = null;
		for (const [n, o] of this.objects) o.visible = n === pose.name;
		this.current = this.objects.get(pose.name) ?? null;
		this.result = solveGrip(pose.name, pose.spec, this.avatar.handGeo(pose.side), pose.phi, pose.up);
		for (const s of ['L', 'R'] as Side[]) if (s !== pose.side) this.avatar.setTarget(s, null);
		if (this.result) this.avatar.setFingers(pose.side, lerpAngles(OPEN, this.result.angles, pose.closure), 30);
		if (changedObject) this.focus();
		this.onResult(this.result);
		this.last = this.result;
		return this.result;
	}

	/**
	 * Shows the current grip varied with seed `seedA`, fingers already closed, and returns a function that plays the
	 * settling to the variation with seed `seedB` (settle.ts, as the game does it while something is held).
	 */
	settleBetween(seedA: number, seedB: number) {
		const pose = this.pose!;
		const hand = this.avatar.handGeo(pose.side);
		const solve = (seed: number) => {
			const j = jitter(pose.spec, seeded(seed));
			return solveGrip(pose.name, j.spec, hand, pose.phi + j.dphi, pose.up)!;
		};
		const a = solve(seedA);
		const b = solve(seedB);
		this.settling = null;
		this.palmAt = null;
		this.result = a;
		this.last = a;
		this.avatar.setFingers(pose.side, a.angles, 1e4);
		return () => {
			this.settling = { a: { grip: a.grip, angles: a.angles }, b: { grip: b.grip, angles: b.angles }, t: 0 };
			this.palmAt = a.grip;
			return { a, b, dur: SETTLE.dur };
		};
	}

	/** Where the object waits for the hand: in front of the shoulder, at a comfortable reach. */
	private anchor() {
		const s = this.pose?.side === 'L' ? -1 : 1;
		return new Vector3(0.2 * s, 1.02, 0.05);
	}

	focus() {
		const a = this.anchor();
		this.controls.target.copy(a);
		this.camera.position.copy(a).add(new Vector3(0.35 * (this.pose?.side === 'L' ? -1 : 1), 0.12, 0.3));
	}

	/** Camera presets, round the line from the hand to the object: opposite the palm, from the side, above, the eyes. */
	view(which: 'front' | 'side' | 'top' | 'eye') {
		const a = this.current ? this.current.getWorldPosition(new Vector3()) : this.anchor();
		const side = this.pose?.side ?? 'R';
		const hand = this.avatar.root.getObjectByName(`Hand_${side}`)!.getWorldPosition(new Vector3());
		const away = a.clone().sub(hand).setY(0);
		if (away.lengthSq() < 1e-6) away.set(0, 0, -1);
		away.normalize();
		const across = new Vector3(0, 1, 0).cross(away).normalize();
		// centred on where the pads touch, not on the object's origin (a rod's is at its far end)
		const pts = this.current && this.result ? this.result.targets.map((p) => p.clone().applyMatrix4(this.current!.matrixWorld)) : [];
		const c = pts.length ? pts.reduce((m, p) => m.add(p), new Vector3()).divideScalar(pts.length) : a.clone().add(new Vector3(0, 0.02, 0));
		this.controls.target.copy(c);
		if (which === 'front') this.camera.position.copy(c).addScaledVector(away, 0.38).add(new Vector3(0, 0.06, 0));
		if (which === 'side') this.camera.position.copy(c).addScaledVector(across, 0.38).addScaledVector(away, 0.08);
		if (which === 'top') this.camera.position.copy(c).add(new Vector3(0, 0.4, 0)).addScaledVector(away, 0.05);
		if (which === 'eye') {
			this.camera.position.copy(EYE).add(this.avatar.root.position);
			this.controls.target.copy(c);
		}
	}

	start() {
		this.timer.connect(document);
		const loop = (t: number) => {
			this.raf = requestAnimationFrame(loop);
			this.timer.update(t);
			this.step(Math.min(0.05, this.timer.getDelta()));
		};
		this.raf = requestAnimationFrame(loop);
	}

	private step(dt: number) {
		const pose = this.pose;
		const obj = this.current;
		if (pose && obj && this.result) {
			// the hand goes to the grip on the object where it waits, then the object hangs from the solved hand
			let grip = this.result.grip;
			if (this.settling) {
				const st = this.settling;
				st.t += dt;
				const now = settlePose(st.a, st.b, st.t / SETTLE.dur);
				grip = now.grip;
				this.avatar.setFingers(pose.side, now.angles, 1e4);
				if (st.t >= SETTLE.dur) {
					this.settling = null;
					this.result = { ...this.result, grip: st.b.grip, angles: st.b.angles };
				}
			}
			const at = this.anchor();
			// the palm goes where the grip puts it on the waiting object; while it settles it stays, and the object moves in it
			const palm = this.palmAt ?? grip;
			const target = { p: palm.p.clone().add(at), q: palm.q.clone() };
			this.avatar.setTarget(pose.side, target);
			this.avatar.update(dt);
			const o = Hands.objectFrom(this.avatar.palmFrame(pose.side), grip);
			obj.position.copy(o.position);
			obj.quaternion.copy(o.quaternion);
			obj.updateMatrixWorld(true);
			if (++this.frame % 6 === 0) this.markInside(pose, obj);
			const t = this.result.targets.flatMap((p) => p.clone().applyMatrix4(obj.matrixWorld).toArray());
			this.green.geometry.setAttribute('position', new BufferAttribute(new Float32Array(t), 3));
		} else if (this.avatar) this.avatar.update(dt);
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
	}

	/** The glove's skinned vertices inside the object's surface model, as red points. */
	private markInside(pose: Pose, obj: Object3D) {
		const shape = SHAPES[pose.name];
		const glove = this.avatar.root.getObjectByName(`AvatarGlove_${pose.side}`) as SkinnedMesh | undefined;
		if (!shape || !glove) return;
		const inv = obj.matrixWorld.clone().invert();
		const v = new Vector3();
		const w = new Vector3();
		const out: number[] = [];
		const n = glove.geometry.attributes.position.count;
		for (let i = 0; i < n; i++) {
			glove.getVertexPosition(i, v);
			v.applyMatrix4(glove.matrixWorld);
			w.copy(v).applyMatrix4(inv);
			if (w.y < shape.y0 || w.y > shape.y1) continue;
			if (shape.radius(w.y) - Math.hypot(w.x, w.z) > 0.001) out.push(v.x, v.y, v.z);
		}
		this.red.geometry.setAttribute('position', new BufferAttribute(new Float32Array(out), 3));
		this.red.geometry.computeBoundingSphere();
		this.inside = out.length / 3;
	}

	inside = 0;
	last: GripResult | null = null;

	/** The object's rotation in the world, for picking where round it the hand goes. */
	objectQ() {
		return this.current?.quaternion.clone() ?? new Quaternion();
	}

	private resize() {
		const w = this.host.clientWidth;
		const h = this.host.clientHeight;
		if (!w || !h) return;
		this.renderer.setSize(w, h);
		this.camera.aspect = w / h;
		this.camera.updateProjectionMatrix();
	}

	dispose() {
		cancelAnimationFrame(this.raf);
		this.ro.disconnect();
		this.timer.dispose();
		this.controls.dispose();
		this.renderer.dispose();
		this.renderer.domElement.remove();
	}
}
