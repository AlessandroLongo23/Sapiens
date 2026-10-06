import {
	ACESFilmicToneMapping,
	NeutralToneMapping,
	Box3,
	BoxGeometry,
	Color,
	DirectionalLight,
	BackSide,
	DoubleSide,
	FrontSide,
	HalfFloatType,
	HemisphereLight,
	Material,
	Matrix4,
	MeshBasicMaterial,
	Mesh,
	MeshPhysicalMaterial,
	MeshStandardMaterial,
	Object3D,
	PCFShadowMap,
	PerspectiveCamera,
	Plane,
	PMREMGenerator,
	Raycaster,
	Scene,
	SRGBColorSpace,
	Texture,
	TextureLoader,
	Timer,
	Vector2,
	Vector3,
	WebGLRenderer,
	WebGLRenderTarget,
	type Side,
	type WebGLProgramParametersWithUniforms
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { LabOutlinePass, OCCLUDERS } from './outline';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GradedOutputPass, Look, readLighting } from './look';
import { Animator, poseOf, type Pose } from './anim';
import { LiquidBody } from './liquid';
import { Bubbles, Crystals, Faller, Flame, Grains, Steam, Stream } from './effects';
import { FirstPerson } from './fps';
import { optimizeStatic } from './optimize';
import { Avatar } from './avatar';
import { Classroom } from './classroom';
import { Hands, holdFrame, PEN_PRONATION, penHeld, toolHold } from './hands';
import { alias } from './grip';
import { canHold } from './grasp';

/**
 * Makes the glass: a clear coat that only reflects, and goes opaque at grazing angles like real glass. One side at a
 * time: a transparent double-sided material makes three.js look its shader up again twice a frame (see the glass loop).
 */
function glassMaterial(tint: Color, base: number, env: Texture | null, side: Side = FrontSide) {
	const m = new MeshPhysicalMaterial({
		color: 0x000000,
		metalness: 0,
		roughness: 0.035,
		transparent: true,
		premultipliedAlpha: true,
		depthWrite: false,
		side,
		envMap: env,
		envMapIntensity: 1.6,
		specularIntensity: 1,
		ior: 1.5
	});
	// how much of its own colour the glass lays over what is behind it: an experiment may change it (saggi.ts)
	m.userData.base = { value: base };
	m.onBeforeCompile = (s: WebGLProgramParametersWithUniforms) => {
		s.uniforms.tint = { value: tint };
		s.uniforms.base = m.userData.base;
		s.fragmentShader =
			'uniform vec3 tint;\nuniform float base;\n' +
			s.fragmentShader.replace(
				'#include <opaque_fragment>',
				`float nv = abs(dot(normalize(normal), normalize(vViewPosition)));
				float fr = pow(max(0.0, 1.0 - nv), 3.0);
				float a = clamp(base + fr * 0.5, 0.0, 0.92);
				gl_FragColor = vec4(outgoingLight + tint * a, a);`
			);
	};
	m.customProgramCacheKey = () => 'glass';
	return m;
}

/**
 * An experiment whose pieces are a file of their own (scripts/lab/build_fiamma.py): the room is loaded, the pieces
 * of the room's own kit named in `drop` are taken out, and the kit's are added, in the same coordinates.
 */
export type Kit = { url: string; drop: string[] };

/** The vessels whose contents the experiment computes; the others keep the colour in their extras. */
const DYNAMIC = new Set(['AcidBeaker', 'Beaker', 'Pipette', 'Funnel', 'ConicalFlask', 'EvapDish']);

export type Hover = { label: string; x: number; y: number } | null;

/** 'lab' is the first prototype; 'banco' the vertical slice, with baked light and a painted look (look.ts). */
export type Variant = 'lab' | 'banco';

export class LabScene {
	readonly renderer: WebGLRenderer;
	readonly scene = new Scene();
	readonly camera: PerspectiveCamera;
	readonly player: FirstPerson;
	readonly anim = new Animator();
	readonly nodes = new Map<string, Object3D>();
	readonly rest = new Map<string, Pose>();
	readonly liquids = new Map<string, LiquidBody>();
	readonly grains = new Map<string, Grains>();
	readonly bubbles = new Map<string, Bubbles>();
	flame!: Flame;
	lighterFlame!: Flame;
	readonly steam = new Steam();
	readonly powder = new Faller(80, 0.0009, '#141414');
	readonly drops = new Faller(40, 0.0014, '#7fb6ea', true);
	readonly stream = new Stream();
	crystals!: Crystals;
	gauzeMat: MeshStandardMaterial | null = null;
	skyMat: MeshStandardMaterial | null = null;
	lampMat: MeshStandardMaterial | null = null;
	key!: DirectionalLight;
	hemi!: HemisphereLight;
	/** The height of the gauze's underside, for the flame. */
	gauzeY = 0;
	gauzeTop = 0;
	gauzeCenter = new Vector3();
	benchY = 0.9;
	/** The worktops, as floor rectangles with their height: [minX, maxX, minZ, maxZ, y]. */
	benches: [number, number, number, number, number][] = [];
	time = 0;

	onPick: (name: string, hit: Object3D) => void = () => {};
	onHover: (h: Hover) => void = () => {};
	onUpdate: (dt: number) => void = () => {};
	onLock: (locked: boolean) => void = () => {};
	/** A mouse button (0 left, 2 right) while the mouse is captured, with what the crosshair points at. */
	onPress: (button: 0 | 2, target: Object3D | null) => void = (_b, t) => {
		if (t) this.onPick(t.name, t);
	};
	/** Q or E: the left or the right hand uses what it holds, or works what the crosshair points at. */
	onUse: (side: 'L' | 'R') => void = () => {};
	/** B, while the mouse is captured: the notebook. */
	onBook: () => void = () => {};
	/** R, while the mouse is captured: a turn of what is about to be put down. */
	onTurn: (dir?: 1 | -1) => void = () => {};
	/** The mouse wheel, while the mouse is captured. */
	onWheel: (delta: number) => void = () => {};
	/** Whether the hands are busy with something the body must keep still for (the free lab sets it). */
	handsBusy: () => boolean = () => false;
	/** Whether what the crosshair points at is highlighted (the free lab highlights only what a hand can take). */
	canHover: (o: Object3D) => boolean = () => true;
	avatar!: Avatar;
	hands!: Hands;
	/** The other people in the room, in a scene with a plan of its own (classroom.ts). */
	classroom: Classroom | null = null;
	labRoot!: Object3D;
	/** Objects in the student's hands: the crosshair looks past them. */
	readonly held = new Set<Object3D>();
	/** What hangs in front of the eyes (the notebook up): drawn over everything, so the crosshair stops on it first. */
	readonly blockers: Object3D[] = [];

	private composer: EffectComposer;
	private outline: LabOutlinePass;
	grade: GradedOutputPass | null = null;
	bloom: UnrealBloomPass | null = null;
	look: Look | null = null;
	private clock = new Timer();
	private raycaster = new Raycaster();
	private pointer = new Vector2();
	private pickable: Mesh[] = [];
	private proxies: Mesh[] = [];
	private down: { x: number; y: number; t: number } | null = null;
	private hovered: Object3D | null = null;
	private targets: Object3D[] = [];
	private raf = 0;
	private ro: ResizeObserver;
	private disposed = false;

	constructor(
		private container: HTMLElement,
		readonly variant: Variant = 'lab'
	) {
		const r = new WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
		r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		r.outputColorSpace = SRGBColorSpace;
		r.toneMapping = variant === 'banco' ? NeutralToneMapping : ACESFilmicToneMapping;
		r.toneMappingExposure = variant === 'banco' ? 1.1 : 1.0;
		r.shadowMap.enabled = true;
		r.shadowMap.type = PCFShadowMap;
		// once a frame (frame()): left automatic, every render of the scene redraws it, the outline's too
		r.shadowMap.autoUpdate = false;
		r.localClippingEnabled = true;
		container.appendChild(r.domElement);
		r.domElement.style.display = 'block';
		r.domElement.style.touchAction = 'none';
		this.renderer = r;

		// the scene never moves: left to recompute its own matrix it would force every object's every frame
		this.scene.matrixAutoUpdate = false;
		// as far as the town outside the windows goes (its ground reaches 285 m, and the haze is full at 350): at 40 m the
		// far plane cut the roofs across the street. The depth's precision is set by the near plane, not by this
		this.camera = new PerspectiveCamera(60, 1, 0.01, 400);
		// in the scene, so what hangs from it (the notebook) is drawn
		this.scene.add(this.camera);
		this.player = new FirstPerson(this.camera, r.domElement);
		this.player.onWheel = (d) => this.onWheel(d);
		this.player.onTurn = (dir) => this.onTurn(dir);
		this.player.onBook = () => this.onBook();
		this.player.onPadPress = (button) => this.press(button);
		this.player.onLockChange = (locked) => {
			this.onLock(locked);
			if (!locked) this.setHovered(null);
		};

		const pmrem = new PMREMGenerator(r);
		this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
		this.scene.environmentIntensity = 0.55;
		this.scene.background = new Color('#dfe3e6');

		const w = container.clientWidth || 800;
		const h = container.clientHeight || 600;
		const rt = new WebGLRenderTarget(w, h, { type: HalfFloatType, samples: 4 });
		this.composer = new EffectComposer(r, rt);
		this.composer.addPass(new RenderPass(this.scene, this.camera));
		this.outline = new LabOutlinePass(new Vector2(w, h), this.scene, this.camera);
		this.outline.edgeStrength = 4;
		this.outline.edgeGlow = 0.4;
		this.outline.edgeThickness = 1.5;
		this.outline.visibleEdgeColor.set('#ff4d5e');
		this.outline.hiddenEdgeColor.set('#a33a45');
		this.composer.addPass(this.outline);
		if (variant === 'banco') {
			// a thin, soft white line on what the crosshair points at, no pulsing red
			this.outline.visibleEdgeColor.set('#fff6e6');
			this.outline.hiddenEdgeColor.set('#000000');
			this.outline.edgeGlow = 0;
			this.outline.edgeThickness = 1;
			this.outline.edgeStrength = 2.2;
			this.bloom = new UnrealBloomPass(new Vector2(w, h), 0.25, 0.55, 0.9);
			// a NaN pixel from any material stays one pixel: left in, each level of the blur widens it into a black rectangle
			const highPass = this.bloom.materialHighPassFilter;
			highPass.fragmentShader = highPass.fragmentShader.replace(
				'gl_FragColor = mix( outputColor, texel, alpha );',
				`vec4 kept = mix( outputColor, texel, alpha );
				gl_FragColor = any( isnan( kept ) ) || any( isinf( kept ) ) ? outputColor : kept;`
			);
			this.composer.addPass(this.bloom);
			// tone mapping, sRGB and the grade in one pass (look.ts)
			this.grade = new GradedOutputPass();
			this.composer.addPass(this.grade);
		} else this.composer.addPass(new OutputPass());

		this.ro = new ResizeObserver(() => this.resize());
		this.ro.observe(container);
		this.resize();

		const el = r.domElement;
		el.addEventListener('pointerdown', this.onPointerDown);
		el.addEventListener('pointerup', this.onPointerUp);
	}

	async load(url: string, onProgress: (f: number) => void, kit?: Kit) {
		const loader = new GLTFLoader();
		// a compressed scene (scripts/lab/compress.py) has meshopt geometry
		loader.setMeshoptDecoder(MeshoptDecoder);
		// decode the embedded textures through <img>: the site's CSP lets blob: URLs load as images but not be fetched
		loader.register((parser) => {
			parser.textureLoader = new TextureLoader(parser.options.manager);
			return { name: 'lab_img_textures' };
		});
		const [gltf, extra] = await Promise.all([
			loader.loadAsync(url, (e) => {
				if (e.total) onProgress(e.loaded / e.total);
			}),
			kit ? loader.loadAsync(kit.url) : null
		]);
		const root = gltf.scene;
		if (kit && extra) {
			for (const name of kit.drop) root.getObjectByName(name)?.removeFromParent();
			for (const o of [...extra.scene.children]) root.add(o);
		}
		this.labRoot = root;
		this.scene.add(root);
		root.updateMatrixWorld(true);

		const lighting = readLighting(root);
		if (lighting) {
			this.look = await Look.setup(this.scene, root, url, lighting);
			this.key = this.look.sun;
		} else this.lights();

		const glassTint = new Color('#dcebf2');
		const amberTint = new Color('#6a3208');
		const cobaltTint = new Color('#1a2fb8');
		const glasses: Mesh[] = [];
		root.traverse((o) => {
			this.nodes.set(o.name, o);
			const m = o as Mesh;
			if (!m.isMesh) return;
			const mat = m.material as MeshStandardMaterial;
			const name = mat.name || '';
			if (name.startsWith('Glass')) {
				glasses.push(m);
				m.renderOrder = 2;
				m.castShadow = false;
				m.receiveShadow = false;
			} else {
				if (!m.geometry.attributes.uv1) {
					m.castShadow = !/^(Floor|Wall|Ceiling|Lamp|Window|Tile|Bench(Carcass|Plinth|Doors))/.test(m.name) && name !== 'Sky';
					m.receiveShadow = true;
				}
				if (name === 'FilterPaper') mat.side = DoubleSide;
			}
			if (name === 'GauzeCeramic') this.gauzeMat = mat;
			if (name === 'Sky') this.skyMat = mat;
			if (name === 'LampPanel') this.lampMat = mat;
		});

		// the glass reflects the lab itself: capture it once from the middle of the bench
		for (const g of glasses) g.visible = false;
		// the capture's own render of the room needs the sun's shadows too (they are drawn once a frame, see frame())
		this.renderer.shadowMap.needsUpdate = true;
		const env = new PMREMGenerator(this.renderer).fromScene(this.scene, 0.02, 0.05, 20, { position: new Vector3(0, 1.1, 0), size: 256 }).texture;
		// with baked light, what is not in the lightmap is lit by the lit room itself
		if (this.look) {
			this.scene.environment = env;
			this.scene.environmentIntensity = 1;
		}
		// each piece of glass is two meshes, its inside faces and then its outside ones: all the insides are drawn before
		// all the outsides (renderOrder), as three.js would do per object, without marking the material changed twice a
		// frame
		const glassMats = new Map<string, [MeshPhysicalMaterial, MeshPhysicalMaterial]>();
		for (const g of glasses) {
			g.visible = true;
			const name = (g.material as Material).name;
			if (!glassMats.has(name)) {
				const make = (side: Side) =>
					name === 'GlassAmber' ? glassMaterial(amberTint, 0.32, env, side) : name === 'GlassCobalt' ? glassMaterial(cobaltTint, 0.42, env, side) : glassMaterial(glassTint, name === 'GlassLens' ? 0.1 : 0.045, env, side);
				glassMats.set(name, [make(BackSide), make(FrontSide)]);
			}
			const [backMat, frontMat] = glassMats.get(name)!;
			g.userData.glass = true;
			g.material = frontMat;
			const back = new Mesh(g.geometry, backMat);
			back.name = g.name + 'Back';
			back.renderOrder = g.renderOrder - 0.01;
			back.userData.glass = true;
			back.userData.noPick = true;
			back.raycast = () => {};
			// fixed to its glass: no local matrix to recompute, but its world one must be computed once
			back.matrixAutoUpdate = false;
			g.add(back);
			back.matrixWorld.copy(g.matrixWorld);
		}

		// pieces the student can pick
		root.traverse((o) => {
			const m = o as Mesh;
			if (!m.isMesh) return;
			let p: Object3D | null = m;
			while (p && !p.userData.label) p = p.parent;
			if (p) {
				m.userData.owner = p;
				this.pickable.push(m);
			}
		});

		// a kit's piece held as one of the room's is (its `like` extra)
		for (const o of this.nodes.values()) if (typeof o.userData.like === 'string') alias(o.name, o.userData.like);

		// the liquids
		root.traverse((o) => {
			if (!o.userData.inner) return;
			const inner = JSON.parse(o.userData.inner) as [number, number][];
			const lq = new LiquidBody(o, inner, DYNAMIC.has(o.name) ? undefined : o.userData.liquid);
			// the pipette delivers 25 mL when the meniscus sits on its mark
			if (o.name === 'Pipette' && o.userData.mark) lq.profile.calibrate(Number(o.userData.mark), 25e-6);
			this.liquids.set(o.name, lq);
			if (o.userData.fill) lq.contents.vol = o.userData.fill;
		});

		// thin or hollow tools get an invisible box to click; it lives outside the scene so the outline never draws it
		const hidden = new MeshBasicMaterial({ visible: false });
		// and so do the flat ones: a watch glass with its salt, a card
		const flat = [...this.nodes.values()].filter((o) => o.userData.sample || o.userData.thin).map((o) => o.name);
		for (const name of ['Pipette', 'GlassRod', 'Thermometer', 'Spatula', 'Lighter', 'FilterPaper', 'Goggles', 'GasTap', 'Bunsen', 'WireLoop', 'CobaltGlass', ...flat]) {
			const node = this.nodes.get(name);
			if (!node) continue;
			// the liquid meshes were just added and have no world matrix yet: without this they count as sitting at the origin
			node.updateWorldMatrix(true, true);
			const inv = node.matrixWorld.clone().invert();
			const box = new Box3();
			// its own meshes: a part with a name of its own (a burette's stopcock) has its own box
			const own = (c: Object3D) => {
				for (let p: Object3D | null = c; p && p !== node; p = p.parent) if (p.userData.label) return false;
				return true;
			};
			node.traverse((c) => {
				const m = c as Mesh;
				if (!m.isMesh || !own(m)) return;
				m.geometry.computeBoundingBox();
				box.union(m.geometry.boundingBox!.clone().applyMatrix4(new Matrix4().multiplyMatrices(inv, m.matrixWorld)));
			});
			const size = box.getSize(new Vector3()).max(new Vector3(0.024, 0.024, 0.024));
			const proxy = new Mesh(new BoxGeometry(size.x, size.y, size.z), hidden);
			proxy.matrixAutoUpdate = false;
			proxy.userData.owner = node;
			proxy.userData.offset = new Matrix4().makeTranslation(box.getCenter(new Vector3()));
			this.proxies.push(proxy);
		}

		for (const name of ['Pipette', 'Beaker', 'AcidBeaker', 'Goggles', 'Thermometer', 'GlassRod', 'Spatula', 'Lighter', 'FilterPaper', 'Funnel', 'ConicalFlask', 'EvapDish', 'CuOJar', 'CuOLid', 'WireLoop', 'CobaltGlass']) {
			const n = this.nodes.get(name);
			if (n) this.rest.set(name, poseOf(n));
		}
		// and a kit's own pieces, whatever they are called
		for (const o of this.nodes.values()) if (o.userData.pick && o.parent === root && canHold(o.name) && !this.rest.has(o.name)) this.rest.set(o.name, poseOf(o));
		for (const o of [...this.nodes.values()]) if (o.userData.startHidden) o.visible = false;

		// gauze and flame
		const gz = this.nodes.get('GauzeCeramic');
		const wire = this.nodes.get('GauzeWire');
		if (gz && wire) {
			const b = new Box3().setFromObject(gz);
			const bw = new Box3().setFromObject(wire);
			this.gauzeTop = b.max.y;
			this.gauzeY = bw.min.y;
			b.getCenter(this.gauzeCenter);
		}
		const bench = this.nodes.get('BenchTop');
		if (bench) {
			const b = new Box3().setFromObject(bench);
			this.benchY = b.max.y;
			this.benches = [[b.min.x, b.max.x, b.min.z, b.max.z, b.max.y]];
		}
		// a room with its own plan lists every worktop
		if (lighting?.plan?.benches.length) this.benches = lighting.plan.benches;
		// under a gauze the flame is cut where it meets it and spreads; without one (no tripod on the bench) it is free
		const gauze = !!(gz && wire);
		const clip = gauze ? [new Plane(new Vector3(0, -1, 0), this.gauzeY + 0.0005)] : [];
		this.flame = new Flame(clip, () => (gauze ? this.gauzeY : null));
		if (this.look) this.flame.boost = 2.4;
		this.nodes.get('FlameAnchor')?.add(this.flame.group);
		this.lighterFlame = new Flame([], () => null);
		this.lighterFlame.air = 0;
		this.scene.add(this.lighterFlame.group);

		const beaker = this.liquids.get('Beaker');
		if (beaker) {
			this.grains.set('Beaker', new Grains(beaker));
			this.bubbles.set('Beaker', new Bubbles(beaker));
		}
		const dish = this.liquids.get('EvapDish');
		const dishNode = this.nodes.get('EvapDish');
		if (dish && dishNode) {
			this.bubbles.set('EvapDish', new Bubbles(dish));
			this.crystals = new Crystals(dishNode, dish);
		}
		this.scene.add(this.steam.points, this.powder.mesh, this.drops.mesh, this.stream.mesh);
		if (this.look) {
			const movable = [...this.nodes.values()].filter((o) => (o.userData.pick || o.userData.blob) && !o.userData.noBlob && o.parent === root);
			this.look.addBlobs(movable, this.benchY);
		}
		// what never moves is merged by material and frozen (optimize.ts), once everything above has read it
		const report = optimizeStatic(root, new Set(this.nodes.values()));
		// the crosshair only looks at what is still in the scene
		this.pickable = this.pickable.filter((m) => m.parent);
		if (process.env.NODE_ENV !== 'production') console.info('lab: merged', report.merged, 'meshes into', report.into, '· frozen', report.frozen, '· shadow casters', report.casters);
		this.avatar = await Avatar.load(url.replace(/[^/]+$/, 'avatar.glb'));
		this.scene.add(this.avatar.root);
		// what can hide part of an object in reach, for the outline's depth (outline.ts)
		for (const o of [...this.nodes.values()].filter((n) => n.userData.pick)) o.traverse((c) => c.layers.enable(OCCLUDERS));
		this.avatar.root.traverse((c) => c.layers.enable(OCCLUDERS));
		this.hands = new Hands(this.avatar, (side) =>
			toolHold(holdFrame(side, this.player.hand, this.player.hand.yaw, this.player.hand.pitch, undefined, 0.6, penHeld(this.hands.held(side)) ? PEN_PRONATION : 0), side, this.hands.held(side), this.hands.gripOf(side), this.player.hand.yaw)
		);
		// a room with its own plan (build_aula.py): where to walk and start, and the other people in it
		const plan = lighting?.plan;
		if (plan) {
			const [wx0, wx1, wz0, wz1] = plan.walk;
			this.player.bounds = { minX: wx0, maxX: wx1, minZ: wz0, maxZ: wz1 };
			this.player.obstacles = plan.obstacles.map(([minX, maxX, minZ, maxZ]) => ({ minX, maxX, minZ, maxZ }));
			const [x, z, yaw] = plan.spawn;
			this.player.home = { x, z, yaw };
			this.player.reset();
			this.classroom = await Classroom.create(this.scene, root, url.replace(/[^/]+$/, 'avatar.glb'), url.replace(/[^/]+$/, 'avatar-kit.glb'));
		}
		this.renderer.compile(this.scene, this.camera);
	}

	/** A flat place to set something down where the crosshair points (the bench, the gauze), or null. */
	surfaceAt(exclude: Object3D[]): Vector3 | null {
		this.raycaster.setFromCamera(this.pointer.set(0, 0), this.camera);
		this.raycaster.far = 1.8;
		const skip = (o: Object3D) => {
			for (let p: Object3D | null = o; p; p = p.parent) if (exclude.includes(p)) return true;
			return false;
		};
		const hits = this.raycaster.intersectObject(this.labRoot, true);
		for (const h of hits) {
			const m = h.object as Mesh;
			if (!m.isMesh || !m.visible || m.userData.noPick || m.userData.glass || skip(m) || !h.face) continue;
			const n = h.face.normal.clone().transformDirection(m.matrixWorld);
			return n.y > 0.7 ? h.point : null;
		}
		return null;
	}

	private lights() {
		this.hemi = new HemisphereLight(0xffffff, 0x8d8a84, 0.9);
		this.scene.add(this.hemi);
		const key = new DirectionalLight(0xfff6ea, 2.3);
		key.position.set(-0.7, 2.75, 1.1);
		key.target.position.set(0.05, 0.9, 0);
		key.castShadow = true;
		key.shadow.mapSize.set(2048, 2048);
		const s = key.shadow.camera;
		s.left = -1.5;
		s.right = 1.5;
		s.top = 1.2;
		s.bottom = -1.2;
		s.near = 0.5;
		s.far = 5;
		key.shadow.bias = -0.0004;
		key.shadow.normalBias = 0.01;
		key.shadow.radius = 3;
		this.scene.add(key, key.target);
		this.key = key;
		const win = new DirectionalLight(0xdfeefc, 0.7);
		win.position.set(0.2, 2.1, -1.5);
		win.target.position.set(0, 0.9, 0.2);
		this.scene.add(win, win.target);
	}

	setTargets(names: string[]) {
		this.targets = names.map((n) => this.nodes.get(n)).filter((o): o is Object3D => !!o);
		this.syncOutline();
	}

	private syncOutline() {
		const sel = [...this.targets];
		if (this.hovered && !sel.includes(this.hovered)) sel.push(this.hovered);
		this.outline.selectedObjects = sel;
	}

	/** Back to the starting spot in front of the bench. */
	respawn() {
		this.player.reset();
	}

	worldOf(name: string) {
		const n = this.nodes.get(name);
		return n ? n.getWorldPosition(new Vector3()) : new Vector3();
	}

	/** What the crosshair, in the middle of the screen, points at. */
	private pick(): Object3D | null {
		this.raycaster.setFromCamera(this.pointer.set(0, 0), this.camera);
		this.raycaster.far = 2.2;
		const shown = this.blockers.filter((b) => b.visible);
		if (shown.length && this.raycaster.intersectObjects(shown, true).length) return null;
		for (const p of this.proxies) {
			const owner = p.userData.owner as Object3D;
			p.matrixWorld.multiplyMatrices(owner.matrixWorld, p.userData.offset as Matrix4);
		}
		const hits = this.raycaster.intersectObjects([...this.pickable, ...this.proxies], false);
		for (const h of hits) {
			if (!h.object.visible) continue;
			let owner = (h.object.userData.owner as Object3D) ?? null;
			// a part that became one with another object (the paper in the funnel) picks that one
			if (owner?.userData.partOf) owner = this.nodes.get(owner.userData.partOf as string) ?? owner;
			if (owner && this.held.has(owner)) continue;
			// a hidden object is not there (the goggles once worn): its click box is outside the scene and stays visible
			let hidden = false;
			for (let p: Object3D | null = owner; p && !hidden; p = p.parent) hidden = !p.visible;
			if (hidden) continue;
			return owner;
		}
		return null;
	}

	/** What is highlighted now. */
	hoveredObject() {
		return this.hovered;
	}

	/** What the crosshair is on, whether or not a hand can do anything with it (what is held is looked through). */
	under() {
		return this.pick();
	}

	private setHovered(o: Object3D | null) {
		if (o === this.hovered) return;
		this.hovered = o;
		this.syncOutline();
		const w = this.container.clientWidth;
		const h = this.container.clientHeight;
		this.onHover(o ? { label: o.userData.label as string, x: w / 2, y: h / 2 } : null);
	}

	private press(button: 0 | 2) {
		this.onPress(button, this.pick());
	}

	private onPointerDown = (e: PointerEvent) => {
		this.down = { x: e.clientX, y: e.clientY, t: performance.now() };
	};

	/** A click on the scene captures the mouse; once captured, a click uses what the crosshair points at. */
	private onPointerUp = (e: PointerEvent) => {
		if (!this.down || (e.button !== 0 && e.button !== 2)) return;
		this.down = null;
		if (this.player.locked) this.press(e.button);
		else if (e.button === 0) this.player.lock();
	};

	/**
	 * Dynamic resolution: the pixel ratio follows how long frames take. Above 22 ms (under about 45 fps) it steps down,
	 * to 0.75 at the least; once frames keep up with the display for three seconds it steps back up, to the screen's
	 * own ratio (2 at most). A fast computer never sees it; a slow one gets a softer image, not a stutter.
	 */
	dynamicResolution = true;
	/** The highest pixel ratio (the menu's "Leggera" graphics set it to 1). */
	maxRatio = 2;

	/** The menu's graphics setting: automatic adapts, high stays sharp, light draws at one pixel per CSS pixel. */
	setQuality(q: 'auto' | 'alta' | 'leggera') {
		this.dynamicResolution = q !== 'alta';
		this.maxRatio = q === 'leggera' ? 1 : 2;
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.maxRatio));
		this.resize();
	}
	private frameMs = 16.7;
	private resT = 0;
	private resGood = 0;

	private adaptResolution(interval: number) {
		if (!this.dynamicResolution || interval > 0.25) return;
		this.frameMs += (interval * 1000 - this.frameMs) * 0.05;
		this.resT += interval;
		if (this.resT < 1) return;
		this.resT = 0;
		const max = Math.min(window.devicePixelRatio, this.maxRatio);
		const now = this.renderer.getPixelRatio();
		let next = now;
		if (this.frameMs > 22) {
			next = Math.max(0.75, now * Math.max(0.7, Math.sqrt(18 / this.frameMs)));
			this.resGood = 0;
		} else if (this.frameMs < 17.8 && ++this.resGood >= 3) {
			next = Math.min(max, now + 0.15);
			this.resGood = 0;
		}
		if (Math.abs(next - now) > 0.01) {
			this.renderer.setPixelRatio(next);
			this.resize();
		}
	}

	private resize() {
		const w = this.container.clientWidth;
		const h = this.container.clientHeight;
		if (!w || !h) return;
		this.renderer.setSize(w, h);
		this.composer.setSize(w, h);
		this.composer.setPixelRatio(this.renderer.getPixelRatio());
		this.camera.aspect = w / h;
		this.camera.updateProjectionMatrix();
		this.steam.uniforms.uViewportH.value = h * this.renderer.getPixelRatio();
		this.look?.setViewport(h * this.renderer.getPixelRatio());
	}

	start() {
		this.clock.connect(document);
		const loop = (t: number) => {
			if (this.disposed) return;
			this.raf = requestAnimationFrame(loop);
			this.clock.update(t);
			this.frame();
		};
		this.raf = requestAnimationFrame(loop);
	}

	private frame() {
		const interval = this.clock.getDelta();
		this.adaptResolution(interval);
		const dt = Math.min(0.05, interval);
		this.time += dt;
		this.anim.update(dt);
		this.player.frozen = this.handsBusy();
		this.player.update(dt);
		this.onUpdate(dt);
		// the body first: the hands' targets are eased in its frame
		this.avatar.place(this.player.body, this.player.yaw);
		this.hands.update(dt);
		this.avatar.update(dt);
		this.classroom?.update(dt);
		this.hands.after();
		if (this.player.locked) {
			const t = this.pick();
			this.setHovered(t && this.canHover(t) ? t : null);
		}
		for (const side of this.player.takeUses()) this.onUse(side);
		// pulse the outline of what to do next
		if (!this.look) this.outline.edgeStrength = 2.5 + 2.5 * (0.5 + 0.5 * Math.sin(this.time * 4));
		this.look?.update(dt, this.time, this.camera);
		if (this.grade) this.grade.uniforms.uTime.value = this.time % 100;
		this.flame.update(this.time, dt);
		this.lighterFlame.update(this.time, dt);
		this.steam.update(dt);
		this.powder.update(dt);
		this.drops.update(dt);
		for (const g of this.grains.values()) g.update(dt);
		for (const b of this.bubbles.values()) b.update(dt);
		for (const l of this.liquids.values()) l.update();
		this.renderer.shadowMap.needsUpdate = true;
		this.composer.render();
	}

	dispose() {
		this.disposed = true;
		cancelAnimationFrame(this.raf);
		this.ro.disconnect();
		this.clock.dispose();
		this.player.dispose();
		this.composer.dispose();
		this.renderer.dispose();
		this.renderer.domElement.remove();
	}
}
