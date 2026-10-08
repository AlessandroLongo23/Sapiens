import { Box3, Color, Group, Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry, Scene, Vector3, WebGLRenderer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { LOOPS, VIEW_PITCH, VIEW_YAW, lightScene, shadowTexture, type Parts, type Rest } from '@/components/onboarding/stage-engine';

/** Radians either side of the pose of the subject's card. */
const TURN = 0.8;
/** How much wider than the object, in all its poses, the picture is. */
const MARGIN = 1.2;

const smooth = (x: number) => x * x * (3 - 2 * x);
/** For each object, the moment of its own loop shown at the fraction p of the scroll. */
const MOMENT: Record<string, (p: number) => number> = {
	// the circle goes from nothing to whole
	math: (p) => 0.27 + 0.68 * smooth(p),
	physics: (p) => (0.25 + 2 * p) % 1,
	chemistry: (p) => 0.98 * p,
	'computer-science': (p) => 0.02 + 0.96 * p
};

export interface Turn {
	/** Draws the object as it is at the fraction `p` of the scroll, at `size` pixels a side. */
	draw: (p: number, size: number) => void;
	destroy: () => void;
}

/**
 * The object of a subject, drawn live on `canvas`: half a turn about the vertical while it does what it does on
 * its card, both placed by one number, the fraction scrolled. The model, the loops and the lamps are those of the
 * onboarding (stage-engine.ts). It draws only when asked: the scroll asks. Throws where WebGL is missing.
 */
export function createTurn(canvas: HTMLCanvasElement, id: string, url: string): Turn {
	const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
	const scene = new Scene();
	const pmrem = lightScene(scene, renderer);
	const camera = new OrthographicCamera(-1, 1, 1, -1, -100, 100);
	const view = new Group();
	const turn = new Group();
	view.rotation.set(VIEW_PITCH, VIEW_YAW, 0);
	view.add(turn);
	scene.add(view);
	const parts: Parts = {};
	const rest: Rest = {};
	let loaded = false;
	let alive = true;
	let last = { p: 0, size: 0 };

	const pose = (p: number) => {
		LOOPS[id]?.(parts, rest, MOMENT[id]?.(p) ?? p);
		turn.rotation.y = TURN * (2 * p - 1);
	};
	const draw = (p: number, size: number) => {
		last = { p, size };
		if (!loaded || !size) return;
		if (canvas.width !== size) renderer.setSize(size, size, false);
		pose(p);
		renderer.render(scene, camera);
	};

	new GLTFLoader().load(url, (gltf) => {
		if (!alive) return;
		const model = gltf.scene;
		const box = new Box3().setFromObject(model);
		const centre = box.getCenter(new Vector3());
		model.position.set(-centre.x, -box.min.y, -centre.z);
		turn.add(model);
		model.traverse((node) => {
			if (!node.name.startsWith('part-')) return;
			parts[node.name] = node;
			rest[node.name] = { y: node.position.y, ry: node.rotation.y, rz: node.rotation.z };
		});
		// One camera for the whole turn: it holds the object in every pose, so nothing is cut and nothing jumps.
		const seen = new Box3();
		for (let k = 0; k <= 12; k++) {
			pose(k / 12);
			scene.updateMatrixWorld(true);
			seen.union(new Box3().setFromObject(turn, true));
		}
		const half = (Math.max(seen.max.x - seen.min.x, seen.max.y - seen.min.y) * MARGIN) / 2;
		const cx = (seen.max.x + seen.min.x) / 2;
		const cy = (seen.max.y + seen.min.y) / 2;
		camera.left = cx - half;
		camera.right = cx + half;
		camera.top = cy + half;
		camera.bottom = cy - half;
		camera.updateProjectionMatrix();
		const footprint = Math.max(box.max.x - box.min.x, box.max.z - box.min.z);
		const shadow = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: shadowTexture(), color: new Color(0x1c2340), transparent: true, depthWrite: false, opacity: 0.34 }));
		shadow.rotation.x = -Math.PI / 2;
		shadow.scale.set(footprint * 1.45, footprint * 1.45, 1);
		shadow.position.set(footprint * 0.12, 0.005, footprint * 0.1);
		view.add(shadow);
		loaded = true;
		draw(last.p, last.size);
	});

	return {
		draw,
		destroy() {
			alive = false;
			pmrem.dispose();
			renderer.dispose();
		}
	};
}
