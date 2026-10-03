import { BufferAttribute, type BufferGeometry, Matrix4, Mesh, type Material, type Object3D, Sphere } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/*
 * The scene as loaded is a tree of a few hundred small meshes, and every one of them costs a draw call, a matrix
 * update and a pass through three.js's sorting each frame, most of them for things that never move: the room, the
 * town, the shelf, the decor on the bench. Once the page has read what it needs from them, the static ones are merged
 * by material and frozen (their matrices are computed once), and tiny meshes stop casting live shadows.
 *
 * What moves or is looked up by name stays as it was: what the student can take (`userData.pick`) with its parts,
 * the parts that turn (the collar, the tap, the clock's hands), and glass and liquids, which are transparent and must
 * be sorted one by one.
 */

/**
 * Parts whose own transform changes while the page runs, inside objects that otherwise stand still; and the notebook,
 * which the crosshair must find on the bench and which leaves it while it is read.
 */
const MOVING_PARTS = new Set(['BunsenCollar', 'GasTapHandle', 'ThermoColumn', 'ClockHour', 'ClockMinute', 'ClockSecond', 'FilterPaper', 'CuOLid', 'Notebook']);
/** Kept whole: looked up by name or material after loading, or a surface to put things on that is small anyway. */
const KEEP_WHOLE = new Set(['Tripod', 'Lighting', 'HeatMat']);
/** Below this radius a mesh does not shape a visible shadow: labels, graduations, small caps. */
const TINY_CASTER = 0.012;

/**
 * The same geometry with every attribute as plain floats. A compressed model (meshopt, scripts/lab/compress.py) keeps
 * positions and normals as 16-bit integers; baking a transform into those would clip and lose precision.
 */
function toFloat(g: BufferGeometry) {
	for (const [name, a] of Object.entries(g.attributes)) {
		if (a.array instanceof Float32Array && !a.normalized) continue;
		const out = new Float32Array(a.count * a.itemSize);
		for (let i = 0; i < a.count; i++) for (let k = 0; k < a.itemSize; k++) out[i * a.itemSize + k] = a.getComponent(i, k);
		g.setAttribute(name, new BufferAttribute(out, a.itemSize));
	}
	return g;
}

export type OptimizeReport = { merged: number; into: number; frozen: number; casters: number };

/**
 * Merges and freezes the static part of the lab. `known` is every object that came from the model (not what the page
 * added to it later, like the flame, which animates).
 */
export function optimizeStatic(root: Object3D, known: Set<Object3D>): OptimizeReport {
	root.updateMatrixWorld(true);
	const report: OptimizeReport = { merged: 0, into: 0, frozen: 0, casters: 0 };

	// what moves: the pickable objects with everything under them, and the moving parts with everything under them
	const moving = new Set<Object3D>();
	const markTree = (o: Object3D) => o.traverse((c) => moving.add(c));
	root.traverse((o) => {
		if (o !== root && (o.userData.pick || MOVING_PARTS.has(o.name))) markTree(o);
	});
	const kept = new Set<Object3D>();
	for (const c of root.children) if (KEEP_WHOLE.has(c.name)) c.traverse((x) => kept.add(x));

	// tiny meshes do not cast live shadows; the sun's shape on the bench comes from the walls and the window frames
	const sphere = new Sphere();
	root.traverse((o) => {
		const m = o as Mesh;
		if (!m.isMesh || !m.castShadow) return;
		if (!m.geometry.boundingSphere) m.geometry.computeBoundingSphere();
		sphere.copy(m.geometry.boundingSphere!).applyMatrix4(m.matrixWorld);
		if (sphere.radius < TINY_CASTER) m.castShadow = false;
	});

	// static, opaque meshes of the model, grouped by what makes them one draw
	const groups = new Map<string, Mesh[]>();
	const inv = root.matrixWorld.clone().invert();
	root.traverse((o) => {
		const m = o as Mesh;
		if (!m.isMesh || !known.has(m) || moving.has(m) || kept.has(m)) return;
		const mat = m.material as Material;
		if (Array.isArray(m.material) || mat.transparent || m.userData.glass || m.userData.noMerge) return;
		if ((m as unknown as { isSkinnedMesh?: boolean }).isSkinnedMesh || (m as unknown as { isInstancedMesh?: boolean }).isInstancedMesh) return;
		if (Object.keys(m.geometry.morphAttributes).length || !m.visible) return;
		// a mirrored transform would turn the faces inside out once baked into the vertices
		if (m.matrixWorld.determinant() < 0) return;
		const attrs = Object.keys(m.geometry.attributes)
			.sort()
			.map((k) => `${k}${m.geometry.attributes[k].itemSize}`)
			.join(',');
		const key = `${mat.uuid}|${m.castShadow}|${m.receiveShadow}|${m.renderOrder}|${attrs}|${m.userData.lm ?? ''}|${m.userData.noPick ? 1 : 0}`;
		let g = groups.get(key);
		if (!g) groups.set(key, (g = []));
		g.push(m);
	});

	const local = new Matrix4();
	for (const meshes of groups.values()) {
		if (meshes.length < 2) continue;
		const geos: BufferGeometry[] = meshes.map((m) => {
			const g = toFloat(m.geometry.clone());
			if (!g.index) {
				const n = g.attributes.position.count;
				const idx = new (n > 65535 ? Uint32Array : Uint16Array)(n);
				for (let i = 0; i < n; i++) idx[i] = i;
				g.setIndex(new BufferAttribute(idx, 1));
			}
			// groups would split the draw again; every mesh here has one material
			g.clearGroups();
			return g.applyMatrix4(local.multiplyMatrices(inv, m.matrixWorld));
		});
		const merged = mergeGeometries(geos, false);
		for (const g of geos) g.dispose();
		if (!merged) continue;
		const first = meshes[0];
		const out = new Mesh(merged, first.material);
		out.name = `Merged ${(first.material as Material).name || first.name}`;
		out.castShadow = first.castShadow;
		out.receiveShadow = first.receiveShadow;
		out.renderOrder = first.renderOrder;
		out.userData = { merged: meshes.length, lm: first.userData.lm, noPick: first.userData.noPick };
		// the town is far past any reach: nothing to put down there, and its thousands of triangles would slow the rays
		if (first.userData.lm === 'ext') out.raycast = () => {};
		root.add(out);
		for (const m of meshes) m.removeFromParent();
		report.merged += meshes.length;
		report.into++;
	}

	// freeze: static objects compute their matrices once; whole static branches are skipped by the scene's update. The
	// root itself too: an object that recomputes its own matrix marks it changed, and that forces its whole subtree.
	root.matrixAutoUpdate = false;
	root.updateMatrixWorld(true);
	const hasMoving = (o: Object3D): boolean => {
		let found = false;
		o.traverse((c) => {
			if (moving.has(c) || !known.has(c)) found = true;
		});
		return found;
	};
	root.traverse((o) => {
		if (o === root || moving.has(o) || !(known.has(o) || o.userData.merged)) return;
		o.matrixAutoUpdate = false;
		report.frozen++;
	});
	for (const c of root.children) if (!hasMoving(c) || c.userData.merged) c.matrixWorldAutoUpdate = false;

	root.traverse((o) => {
		if ((o as Mesh).isMesh && (o as Mesh).castShadow) report.casters++;
	});
	return report;
}
