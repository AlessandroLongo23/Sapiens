import { Group, Matrix4, Mesh, MeshBasicMaterial, type Object3D, type Quaternion, type Vector3 } from 'three';

/*
 * Where a held object would be set down: a see-through copy of it on the surface the crosshair points at, pale when
 * it can go there, red when the spot is too far or taken. Built once per object, from its meshes; liquids, grains and
 * other effects are left out.
 */

export class Ghost {
	readonly group = new Group();
	private copies = new Map<Object3D, Group>();
	private ok = new MeshBasicMaterial({ color: '#e8f4ff', transparent: true, opacity: 0.32, depthWrite: false });
	private bad = new MeshBasicMaterial({ color: '#ff5a5f', transparent: true, opacity: 0.36, depthWrite: false });
	private current: Group | null = null;

	constructor() {
		this.group.visible = false;
		this.group.renderOrder = 8;
	}

	/** The object's own meshes, sharing their geometry, placed as they are in the object's frame. */
	private copy(node: Object3D) {
		let g = this.copies.get(node);
		if (g) return g;
		g = new Group();
		node.updateMatrixWorld(true);
		const inv = node.matrixWorld.clone().invert();
		node.traverse((o) => {
			const m = o as Mesh;
			// only the object's own surfaces: not the liquid, the grains or anything the page added to it
			if (!m.isMesh || !m.visible || m.userData.noPick || (m as unknown as { isInstancedMesh?: boolean }).isInstancedMesh) return;
			const c = new Mesh(m.geometry, this.ok);
			new Matrix4().multiplyMatrices(inv, m.matrixWorld).decompose(c.position, c.quaternion, c.scale);
			c.renderOrder = 8;
			g!.add(c);
		});
		this.copies.set(node, g);
		return g;
	}

	show(node: Object3D, position: Vector3, quaternion: Quaternion, ok: boolean) {
		const g = this.copy(node);
		if (this.current !== g) {
			if (this.current) this.group.remove(this.current);
			this.group.add(g);
			this.current = g;
		}
		const mat = ok ? this.ok : this.bad;
		for (const c of g.children) (c as Mesh).material = mat;
		this.group.position.copy(position);
		this.group.quaternion.copy(quaternion);
		this.group.visible = true;
	}

	hide() {
		this.group.visible = false;
	}
}
