import { BufferAttribute, BufferGeometry, Color, Matrix4, Mesh, MeshStandardMaterial, type Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/*
 * The people's heads (scripts/lab/avatar_kit.py): one mesh per option of each slot, in the avatar's rest frame, each
 * tagged with the role that gives it its colour. A person's record picks one option per slot; the chosen pieces are
 * coloured in their vertices and merged into one mesh, hung from the Head bone: one draw (and one shadow draw) per
 * head, whatever it wears.
 */

export const SKIN = ['#f5d5bf', '#ecbf9c', '#dca47c', '#c68a60', '#a66b45', '#875034', '#693c25', '#48291b'];
export const HAIR_COLOURS = ['#211a17', '#43291d', '#6e4226', '#a8683a', '#d4ab68', '#8f8b86', '#b0472f'];
export const ACCENTS = ['#d9543f', '#3f6fb5', '#e0a93b', '#4f9a6b', '#8a5bb5', '#e27aa2', '#2f3440', '#e9e4da'];

export const OPTIONS = {
	eyes: ['ovali', 'tondi', 'piccoli'],
	brows: ['morbide', 'dritte', 'arcuate'],
	nose: ['bottone', 'lungo', 'piccolo'],
	mouth: ['sorriso', 'neutra', 'aperta'],
	hair: ['corti', 'rasati', 'ricci', 'afro', 'caschetto', 'lunghi', 'coda', 'chignon'],
	hat: ['berretto', 'cappellino', 'hijab', 'turbante'],
	beard: ['barba', 'baffi', 'pizzetto'],
	glasses: ['tonde', 'rettangolari']
} as const;

/** What a person looks like: the record the account's editor will write. */
export type AvatarLook = {
	skin: number;
	hair: (typeof OPTIONS.hair)[number] | null;
	hairColour: number;
	eyes: (typeof OPTIONS.eyes)[number];
	brows: (typeof OPTIONS.brows)[number];
	nose: (typeof OPTIONS.nose)[number];
	mouth: (typeof OPTIONS.mouth)[number];
	hat?: { style: (typeof OPTIONS.hat)[number]; colour: string };
	beard?: (typeof OPTIONS.beard)[number];
	glasses?: { style: (typeof OPTIONS.glasses)[number]; colour: string };
};

/** Hats whose edge leaves hair showing: the hairstyles have a version cut to sit under them. */
const HAIR_UNDER = new Set(['berretto', 'cappellino']);

const FIXED: Record<string, string> = { dark: '#231b18', mouth: '#7a3a31', white: '#fbf8f2' };

export class AvatarKit {
	private constructor(private parts: Map<string, Mesh>) {}

	static async load(url: string) {
		const loader = new GLTFLoader();
		loader.setMeshoptDecoder(MeshoptDecoder);
		const gltf = await loader.loadAsync(url);
		gltf.scene.updateMatrixWorld(true);
		const parts = new Map<string, Mesh>();
		gltf.scene.traverse((o) => {
			const m = o as Mesh;
			if (m.isMesh) parts.set(m.name, m);
		});
		return new AvatarKit(parts);
	}

	/** The pieces a look is made of, with their colours. */
	private pieces(look: AvatarLook): [string, string][] {
		const skin = SKIN[look.skin % SKIN.length];
		const hair = HAIR_COLOURS[look.hairColour % HAIR_COLOURS.length];
		const out: [string, string][] = [
			['KitHead_tondo', skin],
			['KitNeck', skin],
			['KitEars', skin],
			[`KitNose_${look.nose}`, skin],
			[`KitEyes_${look.eyes}`, FIXED.dark],
			[`KitEyeLights_${look.eyes}`, FIXED.white],
			[`KitBrows_${look.brows}`, hair],
			[`KitMouth_${look.mouth}`, FIXED.mouth]
		];
		const hat = look.hat?.style;
		if (look.hair && (!hat || HAIR_UNDER.has(hat))) out.push([`KitHair_${look.hair}${hat ? '_' + hat : ''}`, hair]);
		if (look.hat) out.push([`KitHat_${look.hat.style}`, look.hat.colour]);
		if (look.beard) out.push([`KitBeard_${look.beard}`, hair]);
		if (look.glasses) out.push([`KitGlasses_${look.glasses.style}`, look.glasses.colour]);
		return out;
	}

	/** One mesh for the whole head, in the avatar's rest frame, coloured in its vertices. */
	head(look: AvatarLook, material: MeshStandardMaterial) {
		const geos: BufferGeometry[] = [];
		const c = new Color();
		for (const [name, colour] of this.pieces(look)) {
			const part = this.parts.get(name);
			if (!part) continue;
			const src = part.geometry;
			const g = new BufferGeometry();
			// plain floats: the compressed kit stores positions and normals as normalised integers
			for (const key of ['position', 'normal'] as const) {
				const a = src.getAttribute(key);
				const arr = new Float32Array(a.count * 3);
				for (let i = 0; i < a.count; i++) {
					arr[i * 3] = a.getX(i);
					arr[i * 3 + 1] = a.getY(i);
					arr[i * 3 + 2] = a.getZ(i);
				}
				g.setAttribute(key, new BufferAttribute(arr, 3));
			}
			if (src.index) g.setIndex(new BufferAttribute(new Uint32Array(src.index.array), 1));
			g.applyMatrix4(part.matrixWorld);
			c.set(colour);
			const n = g.getAttribute('position').count;
			const col = new Float32Array(n * 3);
			for (let i = 0; i < n; i++) col.set([c.r, c.g, c.b], i * 3);
			g.setAttribute('color', new BufferAttribute(col, 3));
			geos.push(g);
		}
		const merged = mergeGeometries(geos, false)!;
		for (const g of geos) g.dispose();
		const mesh = new Mesh(merged, material);
		mesh.name = 'KitHead';
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh.userData.noPick = true;
		return mesh;
	}
}

/** The material every head shares: matte clay, colours from the vertices. */
export function headMaterial() {
	return new MeshStandardMaterial({ vertexColors: true, roughness: 0.66, metalness: 0 });
}

/**
 * Hangs a head on an avatar in its rest pose: the head's geometry is moved into the Head bone's frame, so it follows
 * the bone from then on. The old head (AvatarHead) is hidden.
 */
export function wearHead(root: Object3D, head: Mesh) {
	root.updateMatrixWorld(true);
	const bone = root.getObjectByName('Head');
	if (!bone) throw new Error('avatar: no Head bone');
	const rel = new Matrix4().copy(root.matrixWorld).invert().multiply(bone.matrixWorld);
	head.geometry.applyMatrix4(rel.invert());
	head.geometry.computeBoundingSphere();
	bone.add(head);
	const old = root.getObjectByName('AvatarHead');
	if (old) old.visible = false;
}

/** A small, repeatable random generator (mulberry32). */
export function rng(seed: number) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** A plausible look for a classmate, from a seed. */
export function randomLook(seed: number): AvatarLook {
	const r = rng(seed * 7919 + 13);
	const pick = <T>(xs: readonly T[]) => xs[Math.floor(r() * xs.length)];
	const look: AvatarLook = {
		skin: Math.floor(r() * SKIN.length),
		hair: pick(OPTIONS.hair),
		hairColour: r() < 0.8 ? Math.floor(r() * 3) : Math.floor(r() * HAIR_COLOURS.length),
		eyes: pick(OPTIONS.eyes),
		brows: pick(OPTIONS.brows),
		nose: pick(OPTIONS.nose),
		mouth: r() < 0.7 ? 'sorriso' : pick(OPTIONS.mouth)
	};
	const h = r();
	if (h < 0.08) {
		look.hat = { style: 'hijab', colour: pick(ACCENTS) };
		look.hair = null;
	} else if (h < 0.16) look.hat = { style: pick(['berretto', 'cappellino'] as const), colour: pick(ACCENTS) };
	if (r() < 0.25) look.glasses = { style: pick(OPTIONS.glasses), colour: pick(['#2f3440', '#c9a45c', '#8a5b3c']) };
	return look;
}
