import { BackSide, Color, FrontSide, LatheGeometry, Mesh, MeshPhysicalMaterial, Object3D, Plane, Vector2, Vector3 } from 'three';

/**
 * What a vessel holds. Volumes in mL, amounts in mol, the undissolved copper(II) oxide in grams.
 * Sulfuric acid and copper(II) sulfate are in solution; the oxide settles and stays behind in a filter.
 */
export class Contents {
	vol = 0;
	acid = 0;
	cu = 0;
	solid = 0;
	temp = 20;

	/** Takes `ml` of the solution, with its share of dissolved matter; the solid stays unless `withSolid`. */
	take(ml: number, withSolid = false): Contents {
		const out = new Contents();
		const v = Math.min(ml, this.vol);
		const f = this.vol > 0 ? v / this.vol : 0;
		out.vol = v;
		out.acid = this.acid * f;
		out.cu = this.cu * f;
		out.temp = this.temp;
		this.vol -= v;
		this.acid -= out.acid;
		this.cu -= out.cu;
		if (withSolid) {
			out.solid = this.solid * (this.vol <= 0.05 ? 1 : f);
			this.solid -= out.solid;
		}
		if (this.vol < 1e-6) {
			this.vol = 0;
			this.acid = 0;
			this.cu = 0;
		}
		return out;
	}

	add(c: Contents) {
		const v = this.vol + c.vol;
		if (v > 0) this.temp = (this.temp * this.vol + c.temp * c.vol) / v;
		this.vol = v;
		this.acid += c.acid;
		this.cu += c.cu;
		this.solid += c.solid;
	}

	/** Copper(II) concentration in mol/L. */
	get conc() {
		return this.vol > 0.01 ? this.cu / (this.vol / 1000) : 0;
	}
}

/** A lathed cavity: radius as a function of height, in the vessel's local frame (metres). */
export class Profile {
	readonly pts: [number, number][];
	private ty: Float64Array;
	private tv: Float64Array;
	readonly bottom: number;
	readonly top: number;
	total: number;

	constructor(pts: [number, number][]) {
		this.pts = pts;
		this.bottom = pts[0][1];
		this.top = pts[pts.length - 1][1];
		const n = 600;
		this.ty = new Float64Array(n + 1);
		this.tv = new Float64Array(n + 1);
		let v = 0;
		for (let i = 0; i <= n; i++) {
			const y = this.bottom + ((this.top - this.bottom) * i) / n;
			if (i > 0) {
				const y0 = this.ty[i - 1];
				const r0 = this.radiusAt(y0);
				const r1 = this.radiusAt(y);
				v += (Math.PI * (y - y0) * (r0 * r0 + r0 * r1 + r1 * r1)) / 3;
			}
			this.ty[i] = y;
			this.tv[i] = v;
		}
		this.total = v;
	}

	/**
	 * Scales the volumes so that the cavity holds `vol` (m³) below height `y`. The cavity drawn is a little inside the
	 * glass, so as not to show through it, and holds a few percent less than the glass's own; a calibrated mark
	 * modelled on the glass (the pipette's) must still read true.
	 */
	calibrate(y: number, vol: number) {
		const below = this.volumeBelow(y);
		if (below <= 0) return;
		const k = vol / below;
		for (let i = 0; i < this.tv.length; i++) this.tv[i] *= k;
		this.total *= k;
	}

	radiusAt(y: number) {
		const p = this.pts;
		if (y <= p[0][1]) return p[0][0];
		for (let i = 1; i < p.length; i++) {
			const [r1, y1] = p[i];
			const [r0, y0] = p[i - 1];
			if (y <= y1) return y1 > y0 ? r0 + ((r1 - r0) * (y - y0)) / (y1 - y0) : r1;
		}
		return p[p.length - 1][0];
	}

	/** Volume in m³ below local height y. */
	volumeBelow(y: number) {
		const { ty, tv } = this;
		if (y <= ty[0]) return 0;
		const n = ty.length - 1;
		if (y >= ty[n]) return tv[n];
		const f = ((y - ty[0]) / (ty[n] - ty[0])) * n;
		const i = Math.floor(f);
		return tv[i] + (tv[i + 1] - tv[i]) * (f - i);
	}

	/** Local height of the surface for a volume in m³. */
	heightFor(vol: number) {
		const { ty, tv } = this;
		const n = ty.length - 1;
		if (vol <= 0) return ty[0];
		if (vol >= tv[n]) return ty[n];
		let lo = 0;
		let hi = n;
		while (hi - lo > 1) {
			const mid = (lo + hi) >> 1;
			if (tv[mid] < vol) lo = mid;
			else hi = mid;
		}
		return ty[lo] + ((ty[hi] - ty[lo]) * (vol - tv[lo])) / (tv[hi] - tv[lo] || 1);
	}
}

function halton(i: number, b: number) {
	let f = 1;
	let r = 0;
	while (i > 0) {
		f /= b;
		r += f * (i % b);
		i = Math.floor(i / b);
	}
	return r;
}

const CLEAR = new Color('#a8cbe0');
const BLUE = new Color('#1f73d0');
const DEEP = new Color('#0e3f93');
const MURK = new Color('#1a1c22');

/**
 * The liquid in a vessel, drawn as the whole cavity cut by a horizontal plane at the surface. The back faces
 * showing through the cut are painted flat, which reads as the surface; this works with the vessel tilted too.
 * For a tilted vessel the surface height comes from a cloud of points that fill the cavity evenly.
 */
export class LiquidBody {
	readonly contents = new Contents();
	readonly profile: Profile;
	readonly mesh: Mesh;
	readonly material: MeshPhysicalMaterial;
	/** The inside faces seen through the cut, drawn flat: they read as the surface. */
	private back: Mesh;
	private backMaterial: MeshPhysicalMaterial;
	readonly plane = new Plane(new Vector3(0, -1, 0), 0);
	/** Undissolved solid stirred up, 0..1: turns the liquid murky. */
	murk = 0;
	/** A fixed colour, for the bottles on the shelf. */
	fixed: Color | null = null;
	private samples: Float32Array;
	private ys: Float32Array;

	constructor(
		readonly node: Object3D,
		inner: [number, number][],
		fixed?: string
	) {
		const pts = inner.map(([r, y]) => [Math.max(r, 0), y] as [number, number]);
		if (pts[0][0] > 0) pts.unshift([0, pts[0][1]]);
		this.profile = new Profile(pts);
		const lathe = [...pts, [0, pts[pts.length - 1][1]] as [number, number]].map(([r, y]) => new Vector2(r, y));
		const geo = new LatheGeometry(lathe, 40);
		// Two meshes, not one double-sided: three.js draws a transparent double-sided material in two passes and marks it
		// changed for each, which makes it look its shader program up again twice a frame for every liquid. The inside
		// faces come first (same order, lower id). They are lit like the rest: with the faces flipped for a back side,
		// GL counts them as front-facing, so a shader branch on gl_FrontFacing never saw them even before.
		const props = { color: CLEAR, transparent: true, opacity: 0.3, roughness: 0.08, metalness: 0, clippingPlanes: [this.plane], depthWrite: true };
		this.backMaterial = new MeshPhysicalMaterial({ ...props, side: BackSide });
		this.back = new Mesh(geo, this.backMaterial);
		this.back.name = node.name + 'LiquidSurface';
		this.back.renderOrder = 1;
		this.back.userData.noPick = true;
		this.back.visible = false;
		this.back.raycast = () => {};
		node.add(this.back);
		this.material = new MeshPhysicalMaterial({ ...props, side: FrontSide });
		this.mesh = new Mesh(geo, this.material);
		this.mesh.name = node.name + 'Liquid';
		this.mesh.renderOrder = 1;
		this.mesh.userData.noPick = true;
		this.mesh.visible = false;
		node.add(this.mesh);
		if (fixed) this.fixed = new Color(fixed);
		// the point cloud for tilted levels
		const N = 2048;
		this.samples = new Float32Array(N * 3);
		this.ys = new Float32Array(N);
		for (let i = 0; i < N; i++) {
			const y = this.profile.heightFor(halton(i + 1, 2) * this.profile.total);
			const r = this.profile.radiusAt(y) * Math.sqrt(halton(i + 1, 3));
			const a = 2 * Math.PI * halton(i + 1, 5);
			this.samples[i * 3] = r * Math.cos(a);
			this.samples[i * 3 + 1] = y;
			this.samples[i * 3 + 2] = r * Math.sin(a);
		}
	}

	get capacity() {
		return this.profile.total * 1e6;
	}

	/** World height of the surface. */
	level(): number {
		const e = this.node.matrixWorld.elements;
		const vol = this.contents.vol * 1e-6;
		if (e[5] > 0.99999) return e[13] + this.profile.heightFor(vol);
		const s = this.samples;
		const ys = this.ys;
		const N = ys.length;
		for (let i = 0; i < N; i++) {
			const x = s[i * 3];
			const y = s[i * 3 + 1];
			const z = s[i * 3 + 2];
			ys[i] = e[1] * x + e[5] * y + e[9] * z + e[13];
		}
		ys.sort();
		const f = vol / this.profile.total;
		if (f >= 1) return ys[N - 1];
		return ys[Math.max(0, Math.min(N - 1, Math.floor(f * N)))];
	}

	/** Local height of the surface when upright. */
	localLevel() {
		return this.profile.heightFor(this.contents.vol * 1e-6);
	}

	update() {
		const c = this.contents;
		const show = c.vol > 0.02;
		this.mesh.visible = show;
		this.back.visible = show;
		if (!show) return;
		this.node.updateWorldMatrix(true, false);
		this.plane.constant = this.level();
		const m = this.material;
		if (this.fixed) {
			m.color.copy(this.fixed);
			m.opacity = this.fixed.getHSL({ h: 0, s: 0, l: 0 }).s > 0.3 ? 0.78 : 0.22;
		} else {
			const t = 1 - Math.exp(-c.conc * 2.4);
			m.color.copy(CLEAR).lerp(BLUE, Math.min(1, t * 1.25));
			if (c.conc > 1.2) m.color.lerp(DEEP, Math.min(1, (c.conc - 1.2) / 2));
			m.opacity = 0.26 + 0.52 * t;
			if (this.murk > 0) {
				m.color.lerp(MURK, this.murk * 0.85);
				m.opacity = Math.min(0.97, m.opacity + this.murk * 0.6);
			}
		}
		this.backMaterial.color.copy(m.color);
		this.backMaterial.opacity = m.opacity;
	}
}
