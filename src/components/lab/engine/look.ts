import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import {
	AdditiveBlending,
	BufferAttribute,
	BufferGeometry,
	CanvasTexture,
	Color,
	DirectionalLight,
	DoubleSide,
	HemisphereLight,
	Material,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
	Object3D,
	PlaneGeometry,
	Points,
	ShaderMaterial,
	SRGBColorSpace,
	Texture,
	TextureLoader,
	Vector2,
	Vector3,
	Box3,
	BackSide,
	Matrix4,
	Fog,
	Scene,
	SphereGeometry,
	type Camera
} from 'three';

/*
 * The look of the vertical slice (scripts/lab/build_banco.py): baked light on the room, the sun live, beams of sun
 * through the windows with dust in them, soft contact shadows under what can be moved, and a colour grade.
 *
 * The lightmap holds the sky and every bounce (the sun's too); the sun's direct light is a live DirectionalLight, so
 * what the student moves casts its shadow (Unity calls this mixed lighting, "baked indirect"). Cycles bakes the
 * diffuse pass without colour, E/π, and three.js multiplies a lightmap by the albedo over π: hence the π.
 */

export type Lighting = {
	sunDir: Vector3;
	sunColor: Color;
	sunStrength: number;
	lightmapScale: number;
	lightmap: string;
	/** The town outside: all its light, the sun's too, in its own lightmap, drawn unlit. */
	outside: { lightmap: string; scale: number } | null;
	/** A room with a plan of its own (build_aula.py); null for the vertical slice's room. */
	plan: Plan | null;
};

/** Floor rectangles are [minX, maxX, minZ, maxZ], three.js axes. */
export type Plan = {
	/** The room: its floor rectangle and its height. */
	room: [number, number, number, number, number];
	/** Where the student may walk. */
	walk: [number, number, number, number];
	/** Furniture to walk round. */
	obstacles: [number, number, number, number][];
	/** Worktops, with their height: where the contact shadows show. */
	benches: [number, number, number, number, number][];
	/** Where the student starts: x, z and the direction faced. */
	spawn: [number, number, number];
};

/** Tunables, for the look in development. */
export const LOOK = {
	lightmap: 0.6,
	sun: 2.4,
	outside: 0.6,
	tubes: 1.1,
	env: 1.0,
	shafts: 0.025,
	dust: 0.55
};

export function readLighting(root: Object3D): Lighting | null {
	const n = root.getObjectByName('Lighting');
	if (!n) return null;
	const d = n.userData;
	const dir = JSON.parse(d.sun_dir as string) as [number, number, number];
	return {
		sunDir: new Vector3(...dir).normalize(),
		sunColor: new Color(d.sun_color as string),
		sunStrength: Number(d.sun_strength),
		lightmapScale: Number(d.lightmap_scale),
		lightmap: d.lightmap ? String(d.lightmap) : '',
		outside: d.lightmap_ext ? { lightmap: String(d.lightmap_ext), scale: Number(d.lightmap_ext_scale) } : null,
		plan: d.room
			? {
					room: JSON.parse(d.room as string),
					walk: JSON.parse(d.walk as string),
					obstacles: JSON.parse(d.obstacles as string),
					benches: JSON.parse(d.benches as string),
					spawn: JSON.parse(d.spawn as string)
				}
			: null
	};
}

export class Look {
	readonly sun: DirectionalLight;
	private lightmapped: MeshStandardMaterial[] = [];
	private outside: MeshBasicMaterial[] = [];
	private shafts: Mesh[] = [];
	private dust: Dust | null = null;
	private blobs: { node: Object3D; mesh: Mesh; r: number; bottom: number }[] = [];
	private day = 1;
	skyMesh: Mesh | null = null;

	private constructor(
		private scene: Object3D,
		private info: Lighting
	) {
		const sun = new DirectionalLight(info.sunColor, info.sunStrength);
		// the shadow map must cover the whole room: past its edge three.js takes everything as in the sun, and the
		// far corners lit up through the walls
		const center = new Vector3(0, 1.45, 1.6);
		sun.position.copy(center).addScaledVector(info.sunDir, -9);
		sun.target.position.copy(center);
		sun.castShadow = true;
		sun.shadow.mapSize.set(2048, 2048);
		const c = sun.shadow.camera;
		c.left = -3.7;
		c.right = 3.7;
		c.top = 3.7;
		c.bottom = -3.7;
		c.near = 2;
		c.far = 16;
		if (info.plan) {
			// a room with its own plan: the shadow camera is fitted round the room's box, seen along the sun
			const [x0, x1, z0, z1, h] = info.plan.room;
			const mid = new Vector3((x0 + x1) / 2, h / 2, (z0 + z1) / 2);
			sun.position.copy(mid).addScaledVector(info.sunDir, -20);
			sun.target.position.copy(mid);
			const view = new Matrix4().lookAt(sun.position, mid, new Vector3(0, 1, 0)).setPosition(sun.position).invert();
			const box = new Box3();
			for (const x of [x0, x1]) for (const y of [0, h]) for (const z of [z0, z1]) box.expandByPoint(new Vector3(x, y, z).applyMatrix4(view));
			c.left = box.min.x - 0.1;
			c.right = box.max.x + 0.1;
			c.bottom = box.min.y - 0.1;
			c.top = box.max.y + 0.1;
			c.near = Math.max(0.1, -box.max.z - 0.5);
			c.far = -box.min.z + 0.5;
			c.updateProjectionMatrix();
		}
		sun.shadow.bias = -0.0004;
		sun.shadow.normalBias = 0.006;
		sun.shadow.radius = 4;
		scene.add(sun, sun.target);
		this.sun = sun;
	}

	/** Puts the lightmap on the room and the furniture, and the sun in. */
	static async setup(scene: Scene, root: Object3D, url: string, info: Lighting) {
		const look = new Look(scene, info);
		const load = async (file: string) => {
			const t = await new TextureLoader().loadAsync(url.replace(/[^/]+$/, file));
			t.flipY = false;
			t.colorSpace = SRGBColorSpace;
			t.channel = 1;
			return t;
		};
		// a draft without baked light (build_aula.py with AULA_NOBAKE): a sky light stands in for the bounces
		if (!info.lightmap) scene.add(new HemisphereLight('#dfe8f2', '#8d8a84', 1.6));
		const [tex, extTex] = await Promise.all([info.lightmap ? load(info.lightmap) : null, info.outside ? load(info.outside.lightmap) : null]);
		const cache = new Map<Material, MeshStandardMaterial>();
		const extCache = new Map<Material, MeshBasicMaterial>();
		root.traverse((o) => {
			const m = o as Mesh;
			if (!m.isMesh) return;
			const mat = m.material as MeshStandardMaterial;
			// outside: unlit, its baked light only, faded by the haze
			if (m.userData.lm === 'ext' && extTex) {
				let b = extCache.get(mat);
				if (!b) {
					b = new MeshBasicMaterial({ color: mat.color, map: mat.map, lightMap: extTex });
					extCache.set(mat, b);
					look.outside.push(b);
				}
				m.material = b;
				m.castShadow = false;
				m.receiveShadow = false;
				m.userData.noPick = true;
				return;
			}
			// the fluorescent tubes: a bright, even glow, not a blaze (their light is in the lightmap)
			if (mat.name === 'FluorescentTube') {
				mat.emissiveIntensity = LOOK.tubes;
				m.castShadow = false;
				return;
			}
			if (!m.geometry.attributes.uv1 || !tex) return;
			let lm = cache.get(mat);
			if (!lm) {
				lm = mat.clone();
				lm.lightMap = tex;
				lm.envMapIntensity = 0;
				cache.set(mat, lm);
				look.lightmapped.push(lm);
			}
			m.material = lm;
			m.castShadow = true;
			m.receiveShadow = true;
		});
		look.tune();
		look.buildShafts(root);
		look.skyMesh = sky(info);
		scene.add(look.skyMesh);
		// the haze of the town: nothing inside the room is far enough for it
		scene.fog = new Fog('#dfe8ef', 60, 350);
		scene.background = new Color('#cfdcea');
		return look;
	}

	/** Applies LOOK, and the time of day. */
	tune() {
		const d = this.day;
		// the room's own light (the lamps and the bounce) stays; what comes from outside goes with the day
		for (const m of this.lightmapped) m.lightMapIntensity = Math.PI * this.info.lightmapScale * LOOK.lightmap * (0.55 + 0.45 * d);
		for (const m of this.outside) m.lightMapIntensity = Math.PI * (this.info.outside?.scale ?? 1) * LOOK.outside * (0.12 + 0.88 * d);
		this.sun.intensity = this.info.sunStrength * LOOK.sun * d;
		for (const s of this.shafts) (s.material as ShaderMaterial).uniforms.uStrength.value = LOOK.shafts * d;
		if (this.dust) this.dust.material.uniforms.uStrength.value = LOOK.dust * d;
		if (this.skyMesh) (this.skyMesh.material as ShaderMaterial).uniforms.uDay.value = d;
	}

	/** How much daylight there is, 0 (night) to 1: for the time-lapse of the crystals. */
	daylight(k: number) {
		this.day = Math.max(0, Math.min(1, k));
		this.tune();
	}

	/**
	 * A beam of sun for each pane of each window: fans of soft cards along the sun's direction, bright at the window
	 * and fading into the room, drawn additively. Dust drifts inside them.
	 */
	private buildShafts(root: Object3D) {
		const panes: { o: Vector3; a: Vector3; b: Vector3 }[] = [];
		root.traverse((o) => {
			if (!/^WindowFrame/.test(o.name) || !(o as Mesh).isMesh) return;
			const box = new Box3().setFromObject(o);
			// the frame is in the plane x = const; the opening is its y (height) and z extent, split by the cross
			const x = box.max.x + 0.1;
			const y0 = box.min.y + 0.03;
			const y1 = box.max.y - 0.03;
			const z0 = box.min.z + 0.03;
			const z1 = box.max.z - 0.03;
			const ym = y1 - (y1 - y0) * 0.33;
			const zm = (z0 + z1) / 2;
			for (const [za, zb] of [
				[z0, zm - 0.02],
				[zm + 0.02, z1]
			])
				for (const [ya, yb] of [
					[y0, ym - 0.02],
					[ym + 0.02, y1]
				])
					panes.push({ o: new Vector3(x, ya, za), a: new Vector3(0, yb - ya, 0), b: new Vector3(0, 0, zb - za) });
		});
		const dir = this.info.sunDir;
		const len = 5.5;
		const mat = new ShaderMaterial({
			uniforms: { uColor: { value: this.info.sunColor.clone().lerp(new Color('#ffffff'), 0.2) }, uStrength: { value: LOOK.shafts } },
			vertexShader: /* glsl */ `
				attribute vec3 aUvw;
				varying vec3 vUvw;
				varying vec3 vN;
				varying vec3 vV;
				varying float vDist;
				void main() {
					vUvw = aUvw;
					vec4 wp = modelMatrix * vec4(position, 1.0);
					vN = normalize(mat3(modelMatrix) * normal);
					vV = normalize(cameraPosition - wp.xyz);
					vDist = distance(cameraPosition, wp.xyz);
					gl_Position = projectionMatrix * viewMatrix * wp;
				}`,
			fragmentShader: /* glsl */ `
				uniform vec3 uColor;
				uniform float uStrength;
				varying vec3 vUvw;
				varying vec3 vN;
				varying vec3 vV;
				varying float vDist;
				void main() {
					// clamped: with multisampling a varying is extrapolated past the card's edge, and the pow below of a
					// negative number is a NaN, which the bloom then spreads over the screen as black rectangles
					float along = clamp(vUvw.x, 0.0, 1.0);
					float across = clamp(vUvw.y, 0.0, 1.0);
					float edge = smoothstep(0.0, 0.25, across) * smoothstep(1.0, 0.75, across);
					float fade = pow(1.0 - along, 1.6) * smoothstep(0.0, 0.04, along);
					float facing = pow(abs(dot(vN, vV)), 0.7);
					float nearCam = smoothstep(0.15, 0.9, vDist);
					float a = uStrength * edge * fade * facing * nearCam * vUvw.z;
					gl_FragColor = vec4(uColor * a, 1.0);
				}`,
			transparent: true,
			depthWrite: false,
			blending: AdditiveBlending,
			side: DoubleSide,
			forceSinglePass: true
		});
		const K = 7;
		for (const p of panes) {
			const pos: number[] = [];
			const uvw: number[] = [];
			const nor: number[] = [];
			const idx: number[] = [];
			// cards across the pane's width and across its height, each spanning the other side and the beam's length
			for (const [span, step] of [
				[p.a, p.b],
				[p.b, p.a]
			] as [Vector3, Vector3][]) {
				for (let i = 0; i < K; i++) {
					const t = (i + 0.5) / K;
					const w = Math.sin(Math.PI * t);
					const base = p.o.clone().addScaledVector(step, t);
					const n = new Vector3().crossVectors(span, dir).normalize();
					const v0 = pos.length / 3;
					const corners = [
						[base, 0, 0],
						[base.clone().add(span), 0, 1],
						[base.clone().add(span).addScaledVector(dir, len), 1, 1],
						[base.clone().addScaledVector(dir, len), 1, 0]
					] as [Vector3, number, number][];
					for (const [c, u, v] of corners) {
						pos.push(c.x, c.y, c.z);
						uvw.push(u, v, w);
						nor.push(n.x, n.y, n.z);
					}
					idx.push(v0, v0 + 1, v0 + 2, v0, v0 + 2, v0 + 3);
				}
			}
			const g = new BufferGeometry();
			g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
			g.setAttribute('normal', new BufferAttribute(new Float32Array(nor), 3));
			g.setAttribute('aUvw', new BufferAttribute(new Float32Array(uvw), 3));
			g.setIndex(idx);
			const mesh = new Mesh(g, mat);
			mesh.renderOrder = 5;
			mesh.userData.noPick = true;
			mesh.frustumCulled = false;
			this.scene.add(mesh);
			this.shafts.push(mesh);
		}
		if (panes.length) {
			this.dust = new Dust(panes, dir, len * 0.7);
			this.scene.add(this.dust.points);
		}
	}

	/** Soft dark ellipses under the pieces that move, the contact shadow the lightmap cannot have. */
	addBlobs(nodes: Object3D[], benchY: number) {
		const size = 128;
		const cv = document.createElement('canvas');
		cv.width = cv.height = size;
		const ctx = cv.getContext('2d')!;
		const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
		g.addColorStop(0, 'rgba(0,0,0,0.55)');
		g.addColorStop(0.45, 'rgba(0,0,0,0.3)');
		g.addColorStop(1, 'rgba(0,0,0,0)');
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, size, size);
		const tex = new CanvasTexture(cv);
		for (const node of nodes) {
			const box = new Box3().setFromObject(node);
			const s = box.getSize(new Vector3());
			const r = Math.max(0.03, Math.max(s.x, s.z) * 0.75);
			const mesh = new Mesh(
				new PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
				new MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, color: '#2a2440' })
			);
			mesh.userData.noPick = true;
			mesh.renderOrder = 1;
			this.scene.add(mesh);
			const bottom = box.min.y - node.getWorldPosition(new Vector3()).y;
			this.blobs.push({ node, mesh, r, bottom });
		}
		this.benchY = benchY;
	}

	private benchY = 0.9;
	private _v = new Vector3();
	private get benches() {
		return this.info.plan?.benches ?? null;
	}

	setViewport(h: number) {
		this.dust?.setViewport(h);
	}

	update(dt: number, time: number, camera: Camera) {
		for (const b of this.blobs) {
			const p = b.node.getWorldPosition(this._v);
			const h = p.y + b.bottom - this.benchY;
			const onBench = this.benches ? this.benches.some(([x0, x1, z0, z1]) => p.x > x0 && p.x < x1 && p.z > z0 && p.z < z1) : p.x > -1.36 && p.x < 1.36 && p.z > -0.43 && p.z < 0.39;
			const k = onBench ? Math.max(0, 1 - h / 0.18) : 0;
			b.mesh.visible = k > 0.01;
			b.mesh.position.set(p.x, this.benchY + 0.0008, p.z);
			const s = b.r * (1 + h * 2.5);
			b.mesh.scale.set(s, 1, s);
			(b.mesh.material as MeshBasicMaterial).opacity = k;
		}
		this.dust?.update(dt, time, camera);
	}
}

/**
 * The sky: a dome with a gradient from a pale horizon to a blue zenith, soft clouds and the sun's glow. It is not
 * fogged and draws behind everything.
 */
function sky(info: Lighting) {
	const toSun = info.sunDir.clone().negate();
	const m = new ShaderMaterial({
		uniforms: { uSun: { value: toSun }, uDay: { value: 1 } },
		vertexShader: /* glsl */ `
			varying vec3 vDir;
			void main() {
				vDir = normalize(position);
				vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				gl_Position = p.xyww;
			}`,
		fragmentShader: /* glsl */ `
			uniform vec3 uSun;
			uniform float uDay;
			varying vec3 vDir;
			float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
			float noise(vec2 p) {
				vec2 i = floor(p), f = fract(p);
				vec2 u = f * f * (3.0 - 2.0 * f);
				return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
			}
			float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
			void main() {
				vec3 d = normalize(vDir);
				float h = clamp(d.y, 0.0, 1.0);
				vec3 horizon = vec3(0.90, 0.93, 0.95);
				vec3 zenith = vec3(0.47, 0.66, 0.86);
				vec3 c = mix(horizon, zenith, pow(h, 0.55));
				// soft clouds on a plane above
				vec2 uv = d.xz / max(0.08, d.y) * 0.6;
				float cl = smoothstep(0.52, 0.8, fbm(uv * 1.3 + 3.0)) * smoothstep(0.02, 0.2, d.y);
				c = mix(c, vec3(0.98, 0.98, 0.97), cl * 0.75);
				float s = max(0.0, dot(d, normalize(uSun)));
				c += vec3(1.0, 0.95, 0.85) * (pow(s, 400.0) * 1.5 + pow(s, 12.0) * 0.12);
				// towards night: a deep blue, lighter at the horizon where the town glows
				vec3 night = mix(vec3(0.16, 0.18, 0.28), vec3(0.03, 0.05, 0.12), pow(h, 0.5));
				c = mix(night, c, uDay);
				gl_FragColor = vec4(c, 1.0);
			}`,
		side: BackSide,
		depthWrite: false,
		fog: false
	});
	const mesh = new Mesh(new SphereGeometry(400, 32, 16), m);
	mesh.renderOrder = -10;
	mesh.frustumCulled = false;
	mesh.userData.noPick = true;
	return mesh;
}

/** Specks of dust drifting in the beams: they only live inside them, in the beams' own coordinates. */
class Dust {
	readonly points: Points;
	readonly material: ShaderMaterial;
	private p: Float32Array;
	private seed: Float32Array;
	private pane: Uint16Array;
	private n = 420;

	constructor(
		private panes: { o: Vector3; a: Vector3; b: Vector3 }[],
		private dir: Vector3,
		private len: number
	) {
		const n = this.n;
		this.p = new Float32Array(n * 3);
		this.seed = new Float32Array(n);
		this.pane = new Uint16Array(n);
		for (let i = 0; i < n; i++) {
			this.pane[i] = Math.floor(Math.random() * panes.length);
			this.p[i * 3] = Math.random();
			this.p[i * 3 + 1] = Math.random();
			this.p[i * 3 + 2] = Math.random();
			this.seed[i] = Math.random();
		}
		const g = new BufferGeometry();
		g.setAttribute('position', new BufferAttribute(new Float32Array(n * 3), 3));
		g.setAttribute('aSeed', new BufferAttribute(this.seed, 1));
		g.setAttribute('aAlong', new BufferAttribute(new Float32Array(n), 1));
		this.material = new ShaderMaterial({
			uniforms: { uTime: { value: 0 }, uStrength: { value: LOOK.dust }, uScale: { value: new Vector2(1, 900) } },
			vertexShader: /* glsl */ `
				attribute float aSeed;
				attribute float aAlong;
				uniform float uTime;
				uniform vec2 uScale;
				varying float vA;
				void main() {
					vec4 mv = modelViewMatrix * vec4(position, 1.0);
					gl_Position = projectionMatrix * mv;
					float d = -mv.z;
					gl_PointSize = clamp(uScale.y * 0.0022 * (0.6 + aSeed) / d, 1.0, 9.0);
					float tw = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed * 1.7) + aSeed * 40.0);
					vA = tw * pow(1.0 - aAlong, 1.2) * smoothstep(0.25, 0.8, d);
				}`,
			fragmentShader: /* glsl */ `
				uniform float uStrength;
				varying float vA;
				void main() {
					float r = length(gl_PointCoord - 0.5);
					float a = smoothstep(0.5, 0.0, r) * vA * uStrength;
					gl_FragColor = vec4(vec3(1.0, 0.9, 0.75) * a, 1.0);
				}`,
			transparent: true,
			depthWrite: false,
			blending: AdditiveBlending
		});
		this.points = new Points(g, this.material);
		this.points.frustumCulled = false;
		this.points.userData.noPick = true;
		this.points.renderOrder = 6;
	}

	update(dt: number, time: number, camera: Camera) {
		const pos = this.points.geometry.attributes.position as BufferAttribute;
		const along = this.points.geometry.attributes.aAlong as BufferAttribute;
		const q = new Vector3();
		for (let i = 0; i < this.n; i++) {
			const s = this.seed[i];
			// slow drift, mostly down and along the air currents
			this.p[i * 3] += dt * 0.01 * Math.sin(time * 0.3 + s * 20);
			this.p[i * 3 + 1] += dt * (0.012 * Math.sin(time * 0.23 + s * 11) - 0.004);
			this.p[i * 3 + 2] += dt * 0.012 * Math.cos(time * 0.27 + s * 7);
			for (let k = 0; k < 3; k++) {
				const v = this.p[i * 3 + k];
				if (v < 0 || v > 1) this.p[i * 3 + k] = v - Math.floor(v);
			}
			const pn = this.panes[this.pane[i]];
			q.copy(pn.o)
				.addScaledVector(pn.a, this.p[i * 3 + 1])
				.addScaledVector(pn.b, this.p[i * 3 + 2])
				.addScaledVector(this.dir, this.p[i * 3] * this.len);
			pos.setXYZ(i, q.x, q.y, q.z);
			along.setX(i, this.p[i * 3]);
		}
		pos.needsUpdate = true;
		along.needsUpdate = true;
		this.material.uniforms.uTime.value = time;
		void camera;
	}

	setViewport(h: number) {
		this.material.uniforms.uScale.value.y = h;
	}
}

/** The grade, after tone mapping: no pure blacks (a lift to a cool violet), warm highlights, a vignette, a little grain. */
export const GradeShader = {
	uniforms: {
		tDiffuse: { value: null as Texture | null },
		uTime: { value: 0 },
		uLift: { value: new Color('#3a4a63') },
		uLiftAmount: { value: 0.22 },
		uWarm: { value: new Color('#fffaf2') }
	},
	vertexShader: /* glsl */ `
		varying vec2 vUv;
		void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
	fragmentShader: /* glsl */ `
		uniform sampler2D tDiffuse;
		uniform float uTime;
		uniform vec3 uLift;
		uniform float uLiftAmount;
		uniform vec3 uWarm;
		varying vec2 vUv;
		float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
		void main() {
			vec3 c = texture2D(tDiffuse, vUv).rgb;
			float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
			c = mix(uLift * uLiftAmount, vec3(1.0), c);
			c = mix(c, c * uWarm * 1.04, smoothstep(0.45, 1.0, l));
			float g = dot(c, vec3(0.2126, 0.7152, 0.0722));
			c = mix(vec3(g), c, 1.08);
			vec2 d = vUv - 0.5;
			float v = smoothstep(0.35, 0.85, length(d * vec2(1.25, 1.0)));
			c *= mix(1.0, 0.8, v);
			c += (hash(vUv * 1000.0 + uTime) - 0.5) * 0.018;
			gl_FragColor = vec4(c, 1.0);
		}`
};

/**
 * three.js's output pass (tone mapping, sRGB) with the grade of GradeShader done in the same pass, on the same pixel:
 * one full-screen pass and one intermediate buffer fewer, which on a school computer's GPU is a few milliseconds.
 */
export class GradedOutputPass extends OutputPass {
	constructor() {
		super();
		const src = GradeShader.fragmentShader;
		const body = src.slice(src.indexOf('vec3 c = texture2D(tDiffuse, vUv).rgb;') + 'vec3 c = texture2D(tDiffuse, vUv).rgb;'.length, src.lastIndexOf('gl_FragColor = vec4(c, 1.0);'));
		const g = GradeShader.uniforms;
		Object.assign(this.uniforms, { uTime: { value: 0 }, uLift: { value: g.uLift.value.clone() }, uLiftAmount: { value: g.uLiftAmount.value }, uWarm: { value: g.uWarm.value.clone() } });
		const fs = this.material.fragmentShader;
		const end = fs.lastIndexOf('}');
		this.material.fragmentShader =
			fs.slice(0, fs.indexOf('void main()')).replace('varying vec2 vUv;', 'varying vec2 vUv;\nuniform float uTime;\nuniform vec3 uLift;\nuniform float uLiftAmount;\nuniform vec3 uWarm;\nfloat hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }') +
			fs.slice(fs.indexOf('void main()'), end) +
			`\t{\n\t\tvec3 c = gl_FragColor.rgb;${body}\t\tgl_FragColor = vec4(c, 1.0);\n\t}\n}`;
	}
}

