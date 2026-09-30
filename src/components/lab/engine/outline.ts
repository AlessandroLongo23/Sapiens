import type { Camera, Object3D, Scene, Vector2, WebGLRenderer, WebGLRenderTarget } from 'three';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

/*
 * three.js's OutlinePass, cheaper. To outline what the crosshair is on it draws the whole scene once more for depth
 * (so the hidden part of the edge can be told apart), then walks every object of the scene twice to hide and show
 * them. With a room full of people that doubled the frame whenever the student pointed at something.
 *
 * Here the depth pass sees only what can stand between the eyes and something within reach (layer OCCLUDERS: the
 * things on the bench, the student's own arms), and the pass that draws the selected objects picks them with a layer
 * of their own, without touching anything else.
 */

/** What can hide part of an object in reach: set by the scene on the bench's objects and the student's arms. */
export const OCCLUDERS = 5;
const SELECTED = 6;

export class LabOutlinePass extends OutlinePass {
	private camera: Camera;
	private savedMask = 0;
	private tagged: Object3D[] = [];

	constructor(resolution: Vector2, scene: Scene, camera: Camera) {
		super(resolution, scene, camera);
		this.camera = camera;
	}

	render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget, deltaTime: number, maskActive: boolean) {
		if (!this.selectedObjects.length) return super.render(renderer, writeBuffer, readBuffer, deltaTime, maskActive);
		this.savedMask = this.camera.layers.mask;
		this.camera.layers.set(OCCLUDERS);
		try {
			super.render(renderer, writeBuffer, readBuffer, deltaTime, maskActive);
		} finally {
			this.camera.layers.mask = this.savedMask;
		}
	}

	/** Called by the pass around drawing the selected objects alone: a layer switch, not a walk over the scene. */
	_changeVisibilityOfNonSelectedObjects(visible: boolean) {
		if (!visible) {
			this.tagged = [];
			for (const o of this.selectedObjects)
				o.traverse((c) => {
					c.layers.enable(SELECTED);
					this.tagged.push(c);
				});
			this.camera.layers.set(SELECTED);
		} else {
			for (const c of this.tagged) c.layers.disable(SELECTED);
			this.tagged = [];
			this.camera.layers.set(OCCLUDERS);
		}
	}
}
