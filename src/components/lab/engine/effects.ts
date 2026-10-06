import {
	AdditiveBlending,
	BoxGeometry,
	CustomBlending,
	OneFactor,
	OneMinusSrcAlphaFactor,
	BufferAttribute,
	BufferGeometry,
	CircleGeometry,
	Color,
	DoubleSide,
	DynamicDrawUsage,
	Group,
	IcosahedronGeometry,
	InstancedMesh,
	LatheGeometry,
	Matrix4,
	Mesh,
	MeshBasicMaterial,
	MeshPhysicalMaterial,
	MeshStandardMaterial,
	Object3D,
	Plane,
	PointLight,
	Points,
	QuadraticBezierCurve3,
	Quaternion,
	ShaderMaterial,
	SphereGeometry,
	TubeGeometry,
	Vector2,
	Vector3
} from 'three';
import type { LiquidBody } from './liquid';

const rand = (a: number, b: number) => a + Math.random() * (b - a);

// ---------------------------------------------------------------------------------------------
// Bunsen flame
// ---------------------------------------------------------------------------------------------

const FLAME_VERT = /* glsl */ `
uniform float time;
uniform float air;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
#include <clipping_planes_pars_vertex>
void main() {
	vUv = uv;
	vec3 p = position;
	float lazy = (1.0 - air);
	float h = p.y;
	p.x += sin(h * 9.0 - time * 11.0) * 0.09 * lazy * h + sin(time * 23.0 + h * 20.0) * 0.012 * h;
	p.z += cos(h * 7.0 - time * 9.0) * 0.07 * lazy * h;
	vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
	vN = normalMatrix * normal;
	vV = -mvPosition.xyz;
	gl_Position = projectionMatrix * mvPosition;
	#include <clipping_planes_vertex>
}`;

const FLAME_FRAG = /* glsl */ `
uniform float time;
uniform float air;
uniform float power;
uniform float core;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	float h = vUv.y;
	float facing = pow(abs(dot(normalize(vN), normalize(vV))), 1.3);
	float flick = 0.86 + 0.14 * sin(time * 37.0 + h * 13.0) * sin(time * 19.0 + 1.7);
	vec3 blue = mix(vec3(0.18, 0.38, 1.0), vec3(0.45, 0.3, 0.95), h);
	vec3 yel = mix(vec3(1.0, 0.55, 0.12), vec3(1.0, 0.86, 0.5), smoothstep(0.05, 0.45, h));
	yel = mix(yel, vec3(1.0, 0.38, 0.06), smoothstep(0.6, 1.0, h));
	vec3 col = mix(yel, blue, air);
	// the lazy yellow flame stays bright higher up; the blue one is short and sharp
	float fade = smoothstep(0.0, 0.07, h) * (1.0 - smoothstep(mix(0.78, 0.55, air), 1.0, h));
	float a = facing * fade * flick * power;
	if (core > 0.5) {
		col = vec3(0.35, 0.8, 1.0);
		a = facing * smoothstep(0.0, 0.12, h) * (1.0 - smoothstep(0.7, 1.0, h)) * power * air * 1.6;
	} else {
		a *= mix(1.35, 0.5, air);
	}
	gl_FragColor = vec4(col * a, clamp(a * mix(0.75, 0.35, air), 0.0, 1.0));
}`;

function flameGeometry() {
	const pts: Vector2[] = [];
	for (let i = 0; i <= 24; i++) {
		const y = i / 24;
		const r = 0.5 * Math.pow(Math.sin(Math.min(1, y * 3.2) * Math.PI * 0.5), 0.8) * Math.pow(1 - y, 0.75);
		pts.push(new Vector2(Math.max(r, 0.0001), y));
	}
	return new LatheGeometry(pts, 24);
}

export class Flame {
	readonly group = new Group();
	readonly light: PointLight;
	/** 0 off, else the gas flow 0.15..1. */
	gas = 0;
	/** 0 closed air hole (yellow, sooty), 1 open (blue, hot). */
	air = 0.5;
	private outer: Mesh;
	private core: Mesh;
	private spread: Mesh;
	private uOuter: Record<string, { value: number }>;
	private uCore: Record<string, { value: number }>;
	private flare = 0;
	/** How much of the flame reaches the gauze (0..1), for the heat model. */
	reach = 0;
	/** How bright it is drawn: in a bright room a real flame's faintness would make it vanish. */
	boost = 1;
	/** How big it is drawn, against the one that fits under the tripod's gauze. */
	size = 1;

	constructor(clip: Plane[], private spreadAt: () => number | null) {
		const make = (core: number) => {
			const u = { time: { value: 0 }, air: { value: 0.5 }, power: { value: 1 }, core: { value: core } };
			const m = new ShaderMaterial({
				uniforms: u,
				vertexShader: FLAME_VERT,
				fragmentShader: FLAME_FRAG,
				transparent: true,
				depthWrite: false,
				blending: CustomBlending,
				blendSrc: OneFactor,
				blendDst: OneMinusSrcAlphaFactor,
				side: DoubleSide,
				// additive: the faces' order does not matter, and one pass keeps three.js from recompiling it twice a frame
				forceSinglePass: true,
				clipping: true,
				clippingPlanes: clip
			});
			const mesh = new Mesh(flameGeometry(), m);
			mesh.renderOrder = 5;
			mesh.userData.noPick = true;
			return { mesh, u };
		};
		const o = make(0);
		const c = make(1);
		this.outer = o.mesh;
		this.uOuter = o.u;
		this.core = c.mesh;
		this.uCore = c.u;
		this.group.add(this.outer, this.core);
		this.light = new PointLight(0xffa040, 0, 1.2, 2);
		this.light.position.set(0, 0.04, 0);
		this.group.add(this.light);
		// the glow of the flame spreading under the gauze
		this.spread = new Mesh(
			new CircleGeometry(0.05, 32),
			new MeshBasicMaterial({ color: 0x5577ff, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false, side: DoubleSide, forceSinglePass: true })
		);
		this.spread.rotation.x = -Math.PI / 2;
		this.spread.renderOrder = 5;
		this.spread.userData.noPick = true;
		this.group.add(this.spread);
		this.group.visible = false;
	}

	ignite() {
		this.flare = 1;
	}

	update(t: number, dt: number) {
		const on = this.gas > 0.01;
		this.group.visible = on;
		if (!on) {
			this.light.intensity = 0;
			this.reach = 0;
			return;
		}
		this.flare = Math.max(0, this.flare - dt * 2.5);
		const g = this.gas;
		const a = this.air;
		const H = (0.035 + 0.1 * (1 - a) + 0.035 * a) * (0.45 + 0.55 * g) * (1 + this.flare * 0.6) * this.size;
		const W = (0.011 + 0.02 * (1 - a)) * (0.6 + 0.4 * g) * (1 + this.flare * 0.8) * this.size;
		this.outer.scale.set(W, H, W);
		this.core.scale.set(W * 0.55, H * 0.36 * (0.6 + 0.4 * a), W * 0.55);
		for (const u of [this.uOuter, this.uCore]) {
			u.time.value = t;
			u.air.value = a;
			u.power.value = (0.8 + 0.2 * g + this.flare) * this.boost;
		}
		this.light.color.setRGB(1 - 0.55 * a, 0.62 - 0.1 * a, 0.25 + 0.75 * a);
		this.light.intensity = (0.05 + 0.1 * (1 - a)) * g * (1 + this.flare * 3);
		const top = this.group.getWorldPosition(_v).y + H;
		const gauze = this.spreadAt();
		if (gauze !== null) {
			const over = Math.max(0, top - gauze);
			this.reach = Math.min(1, over / 0.02);
			this.spread.position.y = gauze - this.group.getWorldPosition(_v).y - 0.001;
			(this.spread.material as MeshBasicMaterial).opacity = this.reach * (0.12 + 0.2 * (1 - a));
			(this.spread.material as MeshBasicMaterial).color.setRGB(0.3 + 0.7 * (1 - a), 0.35 + 0.2 * (1 - a), 1 - 0.8 * (1 - a));
			this.spread.scale.setScalar(0.5 + 0.6 * g);
		} else {
			// no gauze over it: nothing for the flame to spread under (hidden, or the outline of the burner would draw it)
			this.reach = 0;
			this.spread.visible = false;
		}
	}
}

const _v = new Vector3();

// ---------------------------------------------------------------------------------------------
// The coloured flame of a salt on a wire loop
// ---------------------------------------------------------------------------------------------

const PLUME_VERT = /* glsl */ `
uniform float time;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
void main() {
	vUv = uv;
	vec3 p = position;
	float h = p.y;
	// it leans and licks as it rises, more towards the top
	p.x += (sin(h * 7.0 - time * 9.0) * 0.16 + sin(time * 21.0 + h * 17.0) * 0.05) * h;
	p.z += cos(h * 6.0 - time * 7.5) * 0.13 * h;
	vec4 mv = modelViewMatrix * vec4(p, 1.0);
	vN = normalMatrix * normal;
	vV = -mv.xyz;
	gl_Position = projectionMatrix * mv;
}`;

const PLUME_FRAG = /* glsl */ `
uniform float time;
uniform float power;
uniform vec3 tint;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
void main() {
	float h = vUv.y;
	float facing = pow(abs(dot(normalize(vN), normalize(vV))), 1.15);
	float flick = 0.82 + 0.18 * sin(time * 31.0 + h * 11.0) * sin(time * 17.0 + 0.9);
	float fade = smoothstep(0.0, 0.1, h) * (1.0 - smoothstep(0.45, 1.0, h));
	// brighter and a little paler where it leaves the wire
	vec3 col = mix(tint, vec3(1.0), 0.07 * (1.0 - smoothstep(0.0, 0.3, h)) * facing);
	float a = facing * fade * flick * power;
	gl_FragColor = vec4(col * a, clamp(a * 0.55, 0.0, 1.0));
}`;

/**
 * What a salt on a wire gives the flame: a coloured tongue that rises from the wire, and its light on what is near.
 * The owner puts `group` where the wire is and sets `color` and `amount` (0 nothing, 1 the whole flame coloured).
 */
export class Plume {
	readonly group = new Group();
	readonly light: PointLight;
	readonly color = new Color('#ffffff');
	/** The colour of its light on what is near, when that is not the colour drawn (seen through a filter). */
	glow: Color | null = null;
	amount = 0;
	/** How bright it is drawn (as the burner's flame: brighter in a bright room). */
	boost = 1;
	private shown = 0;
	private mesh: Mesh;
	private inner: Mesh;
	private u: { time: { value: number }; power: { value: number }; tint: { value: Color } }[] = [];

	constructor() {
		const make = () => {
			const u = { time: { value: 0 }, power: { value: 0 }, tint: { value: new Color() } };
			this.u.push(u);
			const m = new ShaderMaterial({ uniforms: u, vertexShader: PLUME_VERT, fragmentShader: PLUME_FRAG, transparent: true, depthWrite: false, blending: CustomBlending, blendSrc: OneFactor, blendDst: OneMinusSrcAlphaFactor, side: DoubleSide, forceSinglePass: true });
			const mesh = new Mesh(flameGeometry(), m);
			mesh.renderOrder = 6;
			mesh.userData.noPick = true;
			mesh.raycast = () => {};
			return mesh;
		};
		this.mesh = make();
		this.inner = make();
		this.group.add(this.mesh, this.inner);
		this.light = new PointLight(0xffffff, 0, 0.7, 2);
		this.light.position.set(0, 0.03, 0);
		this.group.add(this.light);
		this.group.visible = false;
	}

	update(t: number, dt: number) {
		// it flares up quickly and dies down a little more slowly
		this.shown += (this.amount - this.shown) * (1 - Math.exp(-dt * (this.amount > this.shown ? 9 : 4)));
		const k = this.shown;
		this.group.visible = k > 0.01;
		if (!this.group.visible) {
			this.light.intensity = 0;
			return;
		}
		// tall enough to be read from where the student stands, even for a weak colour (potassium's)
		const H = 0.055 + 0.075 * k;
		const W = 0.02 + 0.018 * k;
		this.mesh.scale.set(W, H, W);
		this.inner.scale.set(W * 0.55, H * 0.7, W * 0.55);
		this.u.forEach((u, i) => {
			u.time.value = t + i * 3.1;
			// not so bright that the colour washes out: a red pushed past white turns pink
			u.power.value = (i === 0 ? 0.85 : 0.45) * Math.min(1, k * 2.4) * this.boost;
			u.tint.value.copy(this.color);
		});
		// a faint tint on the burner and the bench round it: a flame this small does not light a room
		this.light.color.copy(this.glow ?? this.color);
		this.light.intensity = 0.035 * k;
	}
}

// ---------------------------------------------------------------------------------------------
// Steam
// ---------------------------------------------------------------------------------------------

const STEAM_VERT = /* glsl */ `
attribute float aSize;
attribute float aAlpha;
uniform float uViewportH;
varying float vAlpha;
void main() {
	vec4 mv = modelViewMatrix * vec4(position, 1.0);
	gl_PointSize = aSize * projectionMatrix[1][1] * uViewportH * 0.5 / -mv.z;
	vAlpha = aAlpha;
	gl_Position = projectionMatrix * mv;
}`;

const STEAM_FRAG = /* glsl */ `
varying float vAlpha;
void main() {
	float d = length(gl_PointCoord - 0.5);
	float a = smoothstep(0.5, 0.0, d) * vAlpha;
	gl_FragColor = vec4(vec3(0.93, 0.94, 0.95), a);
}`;

export class Steam {
	readonly points: Points;
	private pos: Float32Array;
	private vel: Float32Array;
	private age: Float32Array;
	private life: Float32Array;
	private size: Float32Array;
	private alpha: Float32Array;
	private acc = 0;
	readonly uniforms = { uViewportH: { value: 800 } };
	/** Particles per second. */
	rate = 0;
	source = new Vector3();
	radius = 0.02;

	constructor(private n = 160) {
		const g = new BufferGeometry();
		this.pos = new Float32Array(n * 3);
		this.vel = new Float32Array(n * 3);
		this.age = new Float32Array(n).fill(1);
		this.life = new Float32Array(n).fill(1);
		this.size = new Float32Array(n);
		this.alpha = new Float32Array(n);
		g.setAttribute('position', new BufferAttribute(this.pos, 3).setUsage(DynamicDrawUsage));
		g.setAttribute('aSize', new BufferAttribute(this.size, 1).setUsage(DynamicDrawUsage));
		g.setAttribute('aAlpha', new BufferAttribute(this.alpha, 1).setUsage(DynamicDrawUsage));
		const m = new ShaderMaterial({ uniforms: this.uniforms, vertexShader: STEAM_VERT, fragmentShader: STEAM_FRAG, transparent: true, depthWrite: false });
		this.points = new Points(g, m);
		this.points.frustumCulled = false;
		this.points.renderOrder = 4;
		this.points.userData.noPick = true;
	}

	update(dt: number) {
		this.acc += this.rate * dt;
		for (let i = 0; i < this.n; i++) {
			if (this.age[i] >= this.life[i]) {
				if (this.acc >= 1) {
					this.acc -= 1;
					const a = Math.random() * Math.PI * 2;
					const r = Math.sqrt(Math.random()) * this.radius;
					this.pos[i * 3] = this.source.x + Math.cos(a) * r;
					this.pos[i * 3 + 1] = this.source.y;
					this.pos[i * 3 + 2] = this.source.z + Math.sin(a) * r;
					this.vel[i * 3] = rand(-0.01, 0.01);
					this.vel[i * 3 + 1] = rand(0.05, 0.1);
					this.vel[i * 3 + 2] = rand(-0.01, 0.01);
					this.age[i] = 0;
					this.life[i] = rand(1.6, 3.2);
				} else {
					this.alpha[i] = 0;
					continue;
				}
			}
			this.age[i] += dt;
			const k = this.age[i] / this.life[i];
			this.vel[i * 3] += rand(-0.02, 0.02) * dt;
			this.vel[i * 3 + 2] += rand(-0.02, 0.02) * dt;
			this.pos[i * 3] += this.vel[i * 3] * dt;
			this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt;
			this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
			this.size[i] = 0.012 + 0.07 * k;
			this.alpha[i] = Math.sin(Math.PI * Math.min(1, k * 1.3)) * 0.34 * (1 - k);
		}
		this.acc = Math.min(this.acc, 5);
		const g = this.points.geometry;
		g.attributes.position.needsUpdate = true;
		g.attributes.aSize.needsUpdate = true;
		g.attributes.aAlpha.needsUpdate = true;
	}
}

// ---------------------------------------------------------------------------------------------
// Falling particles: powder from the spatula, drops from the funnel
// ---------------------------------------------------------------------------------------------

type Fall = { p: Vector3; v: Vector3; floor: number; alive: boolean };

export class Faller {
	readonly mesh: InstancedMesh;
	private items: Fall[] = [];
	private m = new Matrix4();

	constructor(n: number, radius: number, color: string, transparent = false) {
		const mat = new MeshStandardMaterial({ color, roughness: transparent ? 0.1 : 1, transparent, opacity: transparent ? 0.6 : 1 });
		this.mesh = new InstancedMesh(new IcosahedronGeometry(radius, 1), mat, n);
		this.mesh.instanceMatrix.setUsage(DynamicDrawUsage);
		this.mesh.frustumCulled = false;
		this.mesh.userData.noPick = true;
		this.mesh.count = 0;
		for (let i = 0; i < n; i++) this.items.push({ p: new Vector3(), v: new Vector3(), floor: 0, alive: false });
	}

	spawn(p: Vector3, v: Vector3, floor: number) {
		const it = this.items.find((x) => !x.alive);
		if (!it) return;
		it.p.copy(p);
		it.v.copy(v);
		it.floor = floor;
		it.alive = true;
	}

	update(dt: number) {
		let n = 0;
		for (const it of this.items) {
			if (!it.alive) continue;
			it.v.y -= 9.8 * dt;
			it.p.addScaledVector(it.v, dt);
			if (it.p.y < it.floor) {
				it.alive = false;
				continue;
			}
			this.m.makeTranslation(it.p.x, it.p.y, it.p.z);
			this.mesh.setMatrixAt(n++, this.m);
		}
		this.mesh.count = n;
		this.mesh.instanceMatrix.needsUpdate = true;
	}
}

// ---------------------------------------------------------------------------------------------
// Grains of copper(II) oxide inside a vessel: they settle, and swirl when the liquid is stirred
// ---------------------------------------------------------------------------------------------

export class Grains {
	readonly mesh: InstancedMesh;
	private th: Float32Array;
	private rr: Float32Array;
	private hh: Float32Array;
	private lift: Float32Array;
	private sc: Float32Array;
	private m = new Matrix4();
	private q = new Quaternion();
	private s = new Vector3();
	private p = new Vector3();
	/** Stirring, 0..1: how fast the liquid turns, for the chemistry (dissolving, the reaction) and the murk. */
	swirl = 0;
	grams = 0;
	/** The liquid's turning, rad/s about the vessel's axis: it follows what drives it and slows down by itself. */
	spin = 0;
	private driven = 0;
	private driveT = 0;

	constructor(private liquid: LiquidBody, private max = 420) {
		this.mesh = new InstancedMesh(new IcosahedronGeometry(0.0009, 0), new MeshStandardMaterial({ color: '#111', roughness: 1 }), max);
		this.mesh.instanceMatrix.setUsage(DynamicDrawUsage);
		this.mesh.frustumCulled = false;
		this.mesh.userData.noPick = true;
		this.mesh.count = 0;
		liquid.node.add(this.mesh);
		this.th = new Float32Array(max);
		this.rr = new Float32Array(max);
		this.hh = new Float32Array(max);
		this.lift = new Float32Array(max);
		this.sc = new Float32Array(max);
		for (let i = 0; i < max; i++) {
			this.th[i] = Math.random() * Math.PI * 2;
			this.rr[i] = Math.sqrt(Math.random()) * 0.85;
			this.hh[i] = Math.random();
			this.sc[i] = rand(0.6, 1.5);
		}
	}

	/**
	 * A rod circling in the liquid at `omega` rad/s drags it round: the liquid gathers speed over a second or so and,
	 * once the rod stops, slows down over a few (call every frame the rod moves).
	 */
	drive(omega: number) {
		this.driven = omega;
		this.driveT = 0.12;
	}

	update(dt: number) {
		// the liquid follows the rod at about two thirds of its speed; left alone it slows down
		this.driveT -= dt;
		const want = this.driveT > 0 ? this.driven * 0.65 : 0;
		const rate = this.driveT > 0 ? 1.6 : 0.55;
		this.spin += (want - this.spin) * (1 - Math.exp(-dt * rate));
		this.swirl = Math.max(this.swirl * Math.exp(-dt * 0.8), Math.min(1, Math.abs(this.spin) / 5));
		const n = Math.min(this.max, Math.round(this.grams * 260));
		this.mesh.count = n;
		this.mesh.visible = n > 0;
		if (!n) return;
		const prof = this.liquid.profile;
		// on the bottom, or on the bed of what has settled there
		const y0 = Math.max(prof.bottom, this.liquid.bedTop());
		const top = Math.max(y0 + 0.002, this.liquid.localLevel());
		for (let i = 0; i < n; i++) {
			// the middle turns a little faster than near the wall, where the glass holds it back
			this.th[i] += dt * this.spin * (1.15 - 0.35 * this.rr[i]);
			const target = this.swirl * this.hh[i];
			this.lift[i] += (target - this.lift[i]) * Math.min(1, dt * (target > this.lift[i] ? 4 : 1.2));
			const y = y0 + 0.0008 + this.lift[i] * (top - y0 - 0.002);
			const R = prof.radiusAt(y) * this.rr[i];
			this.p.set(Math.cos(this.th[i]) * R, y, Math.sin(this.th[i]) * R);
			this.s.setScalar(this.sc[i]);
			this.q.setFromAxisAngle(_up, this.th[i] * 3);
			this.m.compose(this.p, this.q, this.s);
			this.mesh.setMatrixAt(i, this.m);
		}
		this.mesh.instanceMatrix.needsUpdate = true;
	}
}

const _up = new Vector3(0, 1, 0);

// ---------------------------------------------------------------------------------------------
// Bubbles of a boiling liquid
// ---------------------------------------------------------------------------------------------

export class Bubbles {
	readonly mesh: InstancedMesh;
	private ps: Vector3[] = [];
	private sp: number[] = [];
	private m = new Matrix4();
	rate = 0;
	private acc = 0;

	constructor(private liquid: LiquidBody, private max = 70) {
		this.mesh = new InstancedMesh(new SphereGeometry(0.0011, 8, 6), new MeshStandardMaterial({ color: '#ffffff', roughness: 0.1, transparent: true, opacity: 0.7 }), max);
		this.mesh.instanceMatrix.setUsage(DynamicDrawUsage);
		this.mesh.frustumCulled = false;
		this.mesh.userData.noPick = true;
		this.mesh.count = 0;
		liquid.node.add(this.mesh);
	}

	update(dt: number) {
		const prof = this.liquid.profile;
		const top = this.liquid.localLevel();
		this.acc += this.rate * dt;
		while (this.acc >= 1 && this.ps.length < this.max) {
			this.acc -= 1;
			const a = Math.random() * Math.PI * 2;
			const r = Math.sqrt(Math.random()) * prof.radiusAt(prof.bottom + 0.002) * 0.8;
			this.ps.push(new Vector3(Math.cos(a) * r, prof.bottom + 0.001, Math.sin(a) * r));
			this.sp.push(rand(0.03, 0.07));
		}
		this.acc = Math.min(this.acc, 3);
		let n = 0;
		for (let i = this.ps.length - 1; i >= 0; i--) {
			const p = this.ps[i];
			p.y += this.sp[i] * dt;
			p.x += rand(-0.002, 0.002) * dt * 10;
			if (p.y > top - 0.0005) {
				this.ps.splice(i, 1);
				this.sp.splice(i, 1);
				continue;
			}
			const s = 0.6 + ((p.y - prof.bottom) / Math.max(0.005, top - prof.bottom)) * 0.9;
			this.m.makeScale(s, s, s).setPosition(p);
			this.mesh.setMatrixAt(n++, this.m);
		}
		this.mesh.count = n;
		this.mesh.visible = n > 0;
		this.mesh.instanceMatrix.needsUpdate = true;
	}
}

// ---------------------------------------------------------------------------------------------
// The stream of a pour
// ---------------------------------------------------------------------------------------------

export class Stream {
	readonly mesh: Mesh;
	readonly material: MeshPhysicalMaterial;
	constructor() {
		this.material = new MeshPhysicalMaterial({ color: '#dfeaf1', transparent: true, opacity: 0.6, roughness: 0.05 });
		this.mesh = new Mesh(new BufferGeometry(), this.material);
		this.mesh.renderOrder = 1;
		this.mesh.frustumCulled = false;
		this.mesh.userData.noPick = true;
		this.mesh.visible = false;
	}

	set(from: Vector3 | null, dir: Vector3, to: number, rate: number, color: Color, opacity: number) {
		if (!from || rate <= 0.01) {
			this.mesh.visible = false;
			return;
		}
		const out = Math.min(0.02, 0.004 + rate * 0.002);
		const ctrl = from.clone().addScaledVector(dir, out);
		ctrl.y -= 0.003;
		const end = new Vector3(from.x + dir.x * out * 1.6, to, from.z + dir.z * out * 1.6);
		const curve = new QuadraticBezierCurve3(from, ctrl, end);
		const r = Math.min(0.0028, 0.0007 + Math.sqrt(rate) * 0.0006);
		this.mesh.geometry.dispose();
		this.mesh.geometry = new TubeGeometry(curve, 16, r, 8, false);
		this.material.color.copy(color);
		this.material.opacity = Math.max(0.45, opacity);
		this.mesh.visible = true;
	}
}

// ---------------------------------------------------------------------------------------------
// Crystals of copper(II) sulfate pentahydrate
// ---------------------------------------------------------------------------------------------

function crystalGeometry() {
	const g = new BoxGeometry(1, 0.42, 0.62);
	const shear = new Matrix4().set(1, 0.45, 0.2, 0, 0, 1, 0, 0, 0.18, 0, 1, 0, 0, 0, 0, 1);
	g.applyMatrix4(shear);
	return g;
}

export class Crystals {
	readonly mesh: InstancedMesh;
	private items: { p: Vector3; q: Quaternion; s: number; start: number }[] = [];
	private m = new Matrix4();
	private v = new Vector3();

	constructor(host: Object3D, liquid: LiquidBody, n = 46) {
		const mat = new MeshPhysicalMaterial({ color: '#1766d6', roughness: 0.06, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, sheen: 0.3, sheenColor: new Color('#7fc0ff'), emissive: new Color('#08306e'), emissiveIntensity: 0.25 });
		this.mesh = new InstancedMesh(crystalGeometry(), mat, n);
		this.mesh.userData.noPick = true;
		this.mesh.castShadow = true;
		this.mesh.frustumCulled = false;
		this.mesh.count = 0;
		const prof = liquid.profile;
		for (let i = 0; i < n; i++) {
			const a = Math.random() * Math.PI * 2;
			const rho = Math.sqrt(Math.random()) * 0.034;
			let y = prof.bottom;
			while (y < prof.top && prof.radiusAt(y) < rho) y += 0.0002;
			const q = new Quaternion().setFromAxisAngle(_up, Math.random() * Math.PI * 2);
			q.multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), rand(-0.3, 0.3)));
			this.items.push({ p: new Vector3(Math.cos(a) * rho, y + 0.0008, Math.sin(a) * rho), q, s: rand(0.004, 0.0115), start: Math.random() * 0.45 });
		}
		host.add(this.mesh);
	}

	/** Growth 0..1; `quality` scales the crystals (small and many when evaporated too far). */
	set(growth: number, quality = 1) {
		let n = 0;
		for (const it of this.items) {
			const k = Math.max(0, Math.min(1, (growth - it.start) / (1 - it.start)));
			if (k <= 0) continue;
			const s = it.s * Math.pow(k, 0.6) * (0.55 + 0.45 * quality);
			this.v.set(s, s, s);
			this.m.compose(it.p, it.q, this.v);
			this.mesh.setMatrixAt(n++, this.m);
		}
		this.mesh.count = n;
		this.mesh.instanceMatrix.needsUpdate = true;
	}
}
