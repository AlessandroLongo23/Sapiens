'use client';

import { useEffect, useRef, useState } from 'react';
import { cutFor, nodeSurfaces, referenceExtent, sampleCloud, type Orbital } from '@/lib/orbitali/idrogeno';
import { currentInk, flowFactor, flowFloor, onThemeChange, pair } from './ink';

/**
 * An orbital of the hydrogen atom as a cloud of points in three dimensions (vault/Prodotti/Studenti/Orbitali
 * atomici interattivi.md). Each point is a place where the electron could be found: where they are thick it is likely to be.
 * A real orbital stands still, with the two signs of the wave function in two colours; in a state with a definite m
 * the points turn around the z axis, faster near it, moved in the vertex shader. The cloud can be opened to see the
 * shells inside (an eighth, a wedge or a half, by the orbital's symmetry: cutFor), and the nodes can be drawn: spheres, cones and planes where the wave function is zero. Drawn with
 * three.js, loaded only when this component mounts.
 */

export const CLOUD_POINTS = 36000;

export interface OrbitalFigureProps {
	orbital: Orbital;
	/** Draws the surfaces where the wave function is zero. */
	nodes: boolean;
	/** One frame and one time scale for every level, to compare them; otherwise each cloud fills the picture. */
	sameScale: boolean;
	/** The highest level the shared frame has to hold; the sixth when not given. */
	referenceLevel?: number;
	playing: boolean;
	/** Screen pixels per Bohr radius at the nucleus, for the scale bar. */
	onScale: (pixelsPerBohr: number) => void;
	label: string;
}

const VERTEX = /* glsl */ `
	attribute float sign;
	uniform float uTime;
	uniform float uRate;
	uniform float uRhoMin;
	uniform int uCutCount;
	uniform vec3 uCutNormals[3];
	uniform float uSize;
	uniform float uPixel;
	uniform float uMinSize;
	varying float vSign;
	varying float vDepth;
	void main() {
		vec3 p = position;
		// The flow: each point turns around z at a rate that falls with the square of its distance from the axis.
		float angle = uRate * uTime / max(p.x * p.x + p.y * p.y, uRhoMin * uRhoMin);
		float c = cos(angle);
		float s = sin(angle);
		p.xy = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
		vec4 mv = modelViewMatrix * vec4(p, 1.0);
		gl_Position = projectionMatrix * mv;
		gl_PointSize = max(uMinSize, uSize * uPixel / -mv.z);
		// What is taken out stays where it is while the points flow through it: a point goes when it is on the
		// positive side of every plane of the cut.
		bool gone = uCutCount > 0;
		for (int i = 0; i < 3; i++) {
			if (i < uCutCount && dot(p, uCutNormals[i]) <= 0.0) gone = false;
		}
		if (gone) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
		vSign = sign;
		vDepth = -mv.z;
	}
`;

const FRAGMENT = /* glsl */ `
	uniform vec3 uPositive;
	uniform vec3 uNegative;
	uniform vec3 uPage;
	uniform float uNear;
	uniform float uFar;
	varying float vSign;
	varying float vDepth;
	void main() {
		// Each point is drawn as a small lit ball.
		vec2 q = gl_PointCoord * 2.0 - 1.0;
		float r2 = dot(q, q);
		if (r2 > 1.0) discard;
		vec3 normal = vec3(q.x, -q.y, sqrt(1.0 - r2));
		float light = 0.5 + 0.5 * max(dot(normal, normalize(vec3(-0.45, 0.6, 0.65))), 0.0);
		vec3 colour = (vSign > 0.0 ? uPositive : uNegative) * light;
		// Far points fade towards the page, which gives the cloud its depth.
		float far = clamp((vDepth - uNear) / (uFar - uNear), 0.0, 1.0);
		gl_FragColor = vec4(mix(colour, uPage, far * 0.6), 1.0);
	}
`;

interface Settings {
	orbital: Orbital;
	cut: boolean;
	nodes: boolean;
	sameScale: boolean;
	referenceLevel?: number;
}

/** What the component keeps of the scene to update it without rebuilding it. */
interface Stage {
	update: (settings: Settings) => void;
	setPlaying: (playing: boolean) => void;
	dispose: () => void;
}

export function OrbitalCloud({ orbital, cut, nodes, sameScale, referenceLevel, playing, onScale, label }: OrbitalFigureProps & { cut: boolean }) {
	const [ready, setReady] = useState(false);
	const [failed, setFailed] = useState(false);
	const box = useRef<HTMLDivElement>(null);
	const stage = useRef<Stage | null>(null);
	const scale = useRef(onScale);
	useEffect(() => {
		scale.current = onScale;
	});

	useEffect(() => {
		let cancelled = false;
		let made: Stage | null = null;
		(async () => {
			try {
				const node = box.current;
				if (!node) return;
				made = await buildStage(node, (px) => scale.current(px));
				if (cancelled) return made.dispose();
				stage.current = made;
				setReady(true);
			} catch {
				setFailed(true);
			}
		})();
		return () => {
			cancelled = true;
			stage.current = null;
			made?.dispose();
		};
	}, []);

	useEffect(() => {
		if (ready) stage.current?.update({ orbital, cut, nodes, sameScale, referenceLevel });
	}, [ready, orbital, cut, nodes, sameScale, referenceLevel]);
	useEffect(() => {
		if (ready) stage.current?.setPlaying(playing);
	}, [ready, playing]);

	return (
		<>
			<div
				ref={box}
				role="img"
				tabIndex={0}
				aria-label={`${label} Trascina per ruotare la nuvola, o usa le frecce.`}
				className="relative aspect-[4/3] w-full cursor-grab touch-none outline-none focus-visible:ring-2 focus-visible:ring-accent active:cursor-grabbing"
			/>
			{!ready && <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-fg-subtle">{failed ? 'Questo dispositivo non riesce a disegnare la figura in tre dimensioni: prova la sezione.' : 'Carico la figura…'}</p>}
		</>
	);
}

/** Builds the three.js scene in `node` and returns the handles to change it. */
async function buildStage(node: HTMLDivElement, onScale: (pixelsPerBohr: number) => void): Promise<Stage> {
	const THREE = await import('three');
	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.domElement.style.display = 'block';
	renderer.domElement.setAttribute('aria-hidden', 'true');
	node.appendChild(renderer.domElement);

	const FOV = 32;
	const half = THREE.MathUtils.degToRad(FOV / 2);
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(FOV, 4 / 3, 0.1, 5000);
	// The student turns `turn`; inside it the orbital's z axis is set upright.
	const turn = new THREE.Group();
	const upright = new THREE.Group();
	upright.rotation.x = -Math.PI / 2;
	turn.add(upright);
	scene.add(turn);
	turn.rotation.set(0.32, -0.6, 0);

	const uniforms = {
		uTime: { value: 0 },
		uRate: { value: 0 },
		uRhoMin: { value: 1 },
		uCutCount: { value: 0 },
		uCutNormals: { value: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()] },
		uSize: { value: 1 },
		uPixel: { value: 1 },
		uMinSize: { value: 1.5 },
		uNear: { value: 1 },
		uFar: { value: 2 },
		uPositive: { value: new THREE.Color() },
		uNegative: { value: new THREE.Color() },
		uPage: { value: new THREE.Color() }
	};
	const material = new THREE.ShaderMaterial({ uniforms, vertexShader: VERTEX, fragmentShader: FRAGMENT });
	const geometry = new THREE.BufferGeometry();
	const points = new THREE.Points(geometry, material);
	points.frustumCulled = false;
	upright.add(points);

	// The z axis and the nucleus.
	const lineMaterial = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.45 });
	const axis = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 0, 1)]), lineMaterial);
	upright.add(axis);
	const nucleusMaterial = new THREE.MeshBasicMaterial();
	const nucleus = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), nucleusMaterial);
	upright.add(nucleus);

	// The nodes: pale surfaces with an outline, drawn after the points and without hiding them.
	const nodeGroup = new THREE.Group();
	upright.add(nodeGroup);
	const surfaceMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.13, depthWrite: false, side: THREE.DoubleSide });
	const outlineMaterial = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.7 });
	const unitCircle = new THREE.BufferGeometry().setFromPoints(Array.from({ length: 96 }, (_, i) => new THREE.Vector3(Math.cos((i / 96) * 2 * Math.PI), Math.sin((i / 96) * 2 * Math.PI), 0)));
	const unitSquare = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1, -1, 0), new THREE.Vector3(1, -1, 0), new THREE.Vector3(1, 1, 0), new THREE.Vector3(-1, 1, 0)]);
	const X = new THREE.Vector3(1, 0, 0);
	const Z = new THREE.Vector3(0, 0, 1);
	const made: { dispose: () => void }[] = [];
	const keep = <T extends { dispose: () => void }>(g: T): T => {
		made.push(g);
		return g;
	};

	const buildNodes = (orbital: Orbital, reach: number) => {
		nodeGroup.clear();
		made.splice(0).forEach((g) => g.dispose());
		const { spheres, cones, planes } = nodeSurfaces(orbital);
		for (const r of spheres) {
			nodeGroup.add(new THREE.Mesh(keep(new THREE.SphereGeometry(r, 48, 24)), surfaceMaterial));
			// Three great circles, so the sphere reads as one even where the cloud covers it.
			for (const [axisOfTurn, angle] of [
				[X, 0],
				[X, Math.PI / 2],
				[new THREE.Vector3(0, 1, 0), Math.PI / 2]
			] as const) {
				const ring = new THREE.LineLoop(unitCircle, outlineMaterial);
				ring.scale.setScalar(r);
				ring.quaternion.setFromAxisAngle(axisOfTurn, angle);
				nodeGroup.add(ring);
			}
		}
		for (const theta of cones) {
			if (Math.abs(theta - Math.PI / 2) < 1e-6) {
				// The cone at 90° is the plane z = 0.
				nodeGroup.add(new THREE.Mesh(keep(new THREE.CircleGeometry(reach, 64)), surfaceMaterial));
				const rim = new THREE.LineLoop(unitCircle, outlineMaterial);
				rim.scale.setScalar(reach);
				nodeGroup.add(rim);
				continue;
			}
			const up = theta < Math.PI / 2;
			const height = reach * Math.abs(Math.cos(theta));
			const radius = reach * Math.sin(theta);
			// three's cone has its apex at +height/2 on y: turned onto z and moved so that the apex is the nucleus.
			const cone = new THREE.Mesh(keep(new THREE.ConeGeometry(radius, height, 64, 1, true)), surfaceMaterial);
			cone.rotation.x = up ? -Math.PI / 2 : Math.PI / 2;
			cone.position.z = up ? height / 2 : -height / 2;
			nodeGroup.add(cone);
			const rim = new THREE.LineLoop(unitCircle, outlineMaterial);
			rim.scale.setScalar(radius);
			rim.position.z = up ? height : -height;
			nodeGroup.add(rim);
		}
		for (const phi of planes) {
			// A plane through the z axis, at the azimuth φ.
			const q = new THREE.Quaternion().setFromAxisAngle(Z, phi).multiply(new THREE.Quaternion().setFromAxisAngle(X, Math.PI / 2));
			const sheet = new THREE.Mesh(keep(new THREE.PlaneGeometry(2 * reach, 2 * reach)), surfaceMaterial);
			sheet.quaternion.copy(q);
			nodeGroup.add(sheet);
			const edge = new THREE.LineLoop(unitSquare, outlineMaterial);
			edge.scale.setScalar(reach);
			edge.quaternion.copy(q);
			nodeGroup.add(edge);
		}
	};

	let settings: Settings | null = null;
	let extent = 1;
	let frameExtent = 1;
	let playing = true;

	const paint = () => {
		const ink = currentInk();
		const [first, second] = pair(ink, settings?.orbital.kind ?? 'reale');
		uniforms.uPositive.value.setRGB(...first);
		uniforms.uNegative.value.setRGB(...second);
		uniforms.uPage.value.setRGB(...ink.page);
		for (const m of [lineMaterial, nucleusMaterial, surfaceMaterial, outlineMaterial]) m.color.setRGB(...ink.line);
	};

	const frame = () => {
		const width = node.clientWidth;
		const height = node.clientHeight;
		if (!width || !height) return;
		renderer.setSize(width, height, false);
		renderer.domElement.style.width = '100%';
		renderer.domElement.style.height = '100%';
		camera.aspect = width / height;
		// Far enough for the whole frame, on the shorter side of the picture.
		const distance = (frameExtent * 1.32) / Math.sin(half) / Math.min(1, camera.aspect);
		camera.position.set(0, 0, distance);
		camera.near = Math.max(0.1, distance - frameExtent * 1.6);
		camera.far = distance + frameExtent * 1.6;
		camera.updateProjectionMatrix();
		uniforms.uPixel.value = renderer.domElement.height / (2 * Math.tan(half));
		uniforms.uMinSize.value = 1.5 * renderer.getPixelRatio();
		uniforms.uNear.value = distance - extent;
		uniforms.uFar.value = distance + extent;
		onScale(height / (2 * Math.tan(half)) / distance);
	};

	const update = (next: Settings) => {
		const before = settings;
		settings = next;
		const { orbital } = next;
		if (!before || before.orbital !== orbital) {
			const cloud = sampleCloud(orbital, CLOUD_POINTS);
			extent = cloud.extent;
			geometry.setAttribute('position', new THREE.BufferAttribute(cloud.positions, 3));
			geometry.setAttribute('sign', new THREE.BufferAttribute(cloud.signs, 1));
			// A ball about a fiftieth of the cloud: the same look from 1s to 6h.
			uniforms.uSize.value = extent * 0.018;
			uniforms.uRhoMin.value = flowFloor(orbital.n);
			nucleus.scale.setScalar(extent * 0.012);
			buildNodes(orbital, extent * 1.02);
		}
		frameExtent = next.sameScale ? referenceExtent(next.referenceLevel) : extent;
		axis.scale.setScalar(frameExtent * 1.08);
		uniforms.uRate.value = orbital.kind === 'complesso' ? flowFactor(orbital.n, next.sameScale) * orbital.m : 0;
		const normals = next.cut ? cutFor(orbital).normals : [];
		uniforms.uCutCount.value = normals.length;
		normals.forEach((normal, i) => uniforms.uCutNormals.value[i].set(...normal));
		nodeGroup.visible = next.nodes;
		paint();
		frame();
	};

	// Dragging turns the cloud; the arrows do the same from the keyboard.
	let drag: { x: number; y: number } | null = null;
	const rotate = (dx: number, dy: number) => {
		turn.rotation.y += dx;
		turn.rotation.x = Math.min(Math.PI / 2, Math.max(-Math.PI / 2, turn.rotation.x + dy));
	};
	const down = (e: PointerEvent) => {
		drag = { x: e.clientX, y: e.clientY };
		node.setPointerCapture(e.pointerId);
	};
	const move = (e: PointerEvent) => {
		if (!drag) return;
		rotate((e.clientX - drag.x) * 0.008, (e.clientY - drag.y) * 0.008);
		drag = { x: e.clientX, y: e.clientY };
	};
	const up = () => (drag = null);
	const key = (e: KeyboardEvent) => {
		const step = { ArrowLeft: [-0.12, 0], ArrowRight: [0.12, 0], ArrowUp: [0, -0.12], ArrowDown: [0, 0.12] }[e.key];
		if (!step) return;
		e.preventDefault();
		rotate(step[0], step[1]);
	};
	node.addEventListener('pointerdown', down);
	node.addEventListener('pointermove', move);
	node.addEventListener('pointerup', up);
	node.addEventListener('pointercancel', up);
	node.addEventListener('keydown', key);

	const resize = new ResizeObserver(frame);
	resize.observe(node);
	const stopTheme = onThemeChange(paint);

	let raf = 0;
	let last = performance.now();
	const tick = (now: number) => {
		raf = requestAnimationFrame(tick);
		if (playing) uniforms.uTime.value += Math.min(0.1, (now - last) / 1000);
		last = now;
		renderer.render(scene, camera);
	};
	raf = requestAnimationFrame(tick);

	return {
		update,
		setPlaying: (value) => (playing = value),
		dispose: () => {
			cancelAnimationFrame(raf);
			resize.disconnect();
			stopTheme();
			node.removeEventListener('pointerdown', down);
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerup', up);
			node.removeEventListener('pointercancel', up);
			node.removeEventListener('keydown', key);
			made.forEach((g) => g.dispose());
			for (const g of [geometry, unitCircle, unitSquare]) g.dispose();
			for (const m of [material, lineMaterial, nucleusMaterial, surfaceMaterial, outlineMaterial]) m.dispose();
			renderer.dispose();
			renderer.domElement.remove();
		}
	};
}
