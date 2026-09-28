/*
 * A sheet crumpled into a ball, in WebGL: used when a note is deleted (NoteList).
 *
 * The folding simulation (advance, randomSource, createPaperPath) and the paper material are taken from the
 * PaperCrumple component of React Bits, https://reactbits.dev/c/micro:
 *
 *   Copyright (c) 2026 David Haz. MIT + Commons Clause License Condition v1.0.
 *   The above copyright notice and this permission notice shall be included in all copies or substantial
 *   portions of the Software. The Software may be used as part of an application, website or product; the
 *   components themselves may not be sold, sublicensed or redistributed.
 *
 * What changed: no pointer or keyboard handling. `playCrumple` crumples the sheet once, by itself, over the page
 * where it lay, and says when it is done.
 */
import * as THREE from 'three';

type Spring = { value: number; target: number; velocity: number };
const spring = (value = 0): Spring => ({ value, target: value, velocity: 0 });
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function advance(s: Spring, dt: number, duration: number, instant: boolean) {
  if (instant || duration <= 0) {
    s.value = s.target;
    s.velocity = 0;
    return false;
  }
  const omega = 8 / Math.max(0.06, duration);
  const offset = s.value - s.target;
  const term = s.velocity + omega * offset;
  const decay = Math.exp(-omega * dt);
  s.value = s.target + (offset + term * dt) * decay;
  s.velocity = (s.velocity - omega * term * dt) * decay;
  if (Math.abs(s.value - s.target) < 0.0001 && Math.abs(s.velocity) < 0.001) {
    s.value = s.target;
    s.velocity = 0;
    return false;
  }
  return true;
}

function randomSource(seed: number) {
  let value = seed | 0;
  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let n = Math.imul(value ^ (value >>> 15), 1 | value);
    n = (n + Math.imul(n ^ (n >>> 7), 61 | n)) ^ n;
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}

function createPaperPath(
  rest: Float32Array,
  triangles: number[],
  shortSide: number,
  density: number,
  sharpness: number,
  depth: number,
  seed: number
) {
  const count = rest.length / 3;
  const points = Float64Array.from(rest);
  const previous = Float64Array.from(rest);
  const before = Float64Array.from(rest);
  const edges: number[] = [];
  const hinges: number[] = [];
  const adjacency = new Map<number, { a: number; b: number; opposite: number }>();
  const random = randomSource(seed);
  const guides = Array.from({ length: density }, () => {
    const angle = random() * Math.PI * 2;
    return { x: Math.cos(angle), y: Math.sin(angle), phase: random() * Math.PI * 2, weight: random() * 0.6 + 0.4 };
  });
  for (let t = 0; t < triangles.length; t += 3) {
    for (let k = 0; k < 3; k++) {
      const a = triangles[t + k],
        b = triangles[t + ((k + 1) % 3)],
        opposite = triangles[t + ((k + 2) % 3)];
      const key = Math.min(a, b) * count + Math.max(a, b);
      const other = adjacency.get(key);
      if (!other) {
        adjacency.set(key, { a, b, opposite });
        const length = Math.hypot(rest[a * 3] - rest[b * 3], rest[a * 3 + 1] - rest[b * 3 + 1]);
        edges.push(a * 3, b * 3, length);
      } else {
        const c = other.opposite * 3,
          d = opposite * 3;
        const length = Math.hypot(rest[c] - rest[d], rest[c + 1] - rest[d + 1]);
        const mx = (rest[c] + rest[d]) * 0.5,
          my = (rest[c + 1] + rest[d + 1]) * 0.5;
        let weakness = 0;
        for (const guide of guides) {
          const distance = Math.abs(Math.sin(((mx * guide.x + my * guide.y) / shortSide) * 4 + guide.phase));
          weakness = Math.max(weakness, Math.exp(-distance * distance * 80) * guide.weight);
        }
        hinges.push(c, d, length, 0.12 + (1 - weakness) * 0.75);
      }
    }
  }
  const spacing = Math.sqrt((shortSide * shortSide) / count);
  const thickness = shortSide * 0.008;
  const samples: Float32Array[] = [rest.slice()];
  const frameCount = 64;
  const stepsPerFrame = 3;
  const totalSteps = frameCount * stepsPerFrame;
  let initialRadius = 0;
  for (let i = 0; i < rest.length; i += 3)
    initialRadius = Math.max(initialRadius, Math.hypot(rest[i] / 0.94, rest[i + 1] / 1.02));
  initialRadius *= 1.02;

  function constrain(list: number[], stride: number, stiffness: number, reverse: boolean) {
    for (let n = 0; n < list.length; n += stride) {
      const edge = reverse ? list.length - stride - n : n;
      const a = list[edge],
        b = list[edge + 1];
      const dx = points[b] - points[a],
        dy = points[b + 1] - points[a + 1],
        dz = points[b + 2] - points[a + 2];
      const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (length < 0.000001) continue;
      const weight = stride === 4 ? list[edge + 3] : 1;
      const amount = (1 - list[edge + 2] / length) * 0.5 * stiffness * weight;
      points[a] += dx * amount;
      points[b] -= dx * amount;
      points[a + 1] += dy * amount;
      points[b + 1] -= dy * amount;
      points[a + 2] += dz * amount;
      points[b + 2] -= dz * amount;
    }
  }

  function separateLayers() {
    const margin = thickness * 2;
    for (let t = 0; t < triangles.length; t += 3) {
      const a = triangles[t] * 3,
        b = triangles[t + 1] * 3,
        c = triangles[t + 2] * 3;
      const ax = points[a],
        ay = points[a + 1],
        az = points[a + 2];
      const bx = points[b] - ax,
        by = points[b + 1] - ay,
        bz = points[b + 2] - az;
      const cx = points[c] - ax,
        cy = points[c + 1] - ay,
        cz = points[c + 2] - az;
      let nx = by * cz - bz * cy,
        ny = bz * cx - bx * cz,
        nz = bx * cy - by * cx;
      const length = Math.hypot(nx, ny, nz);
      if (length < 0.0000001) continue;
      nx /= length;
      ny /= length;
      nz /= length;
      const minX = Math.min(ax, points[b], points[c]) - margin;
      const maxX = Math.max(ax, points[b], points[c]) + margin;
      const minY = Math.min(ay, points[b + 1], points[c + 1]) - margin;
      const maxY = Math.max(ay, points[b + 1], points[c + 1]) + margin;
      const minZ = Math.min(az, points[b + 2], points[c + 2]) - margin;
      const maxZ = Math.max(az, points[b + 2], points[c + 2]) + margin;
      const bb = bx * bx + by * by + bz * bz,
        cc = cx * cx + cy * cy + cz * cz;
      const bc = bx * cx + by * cy + bz * cz;
      const determinant = bb * cc - bc * bc;
      if (determinant < 0.0000000001) continue;
      for (let p = 0; p < points.length; p += 3) {
        if (p === a || p === b || p === c) continue;
        if (
          points[p] < minX ||
          points[p] > maxX ||
          points[p + 1] < minY ||
          points[p + 1] > maxY ||
          points[p + 2] < minZ ||
          points[p + 2] > maxZ
        )
          continue;
        const rx = rest[p] - (rest[a] + rest[b] + rest[c]) / 3;
        const ry = rest[p + 1] - (rest[a + 1] + rest[b + 1] + rest[c + 1]) / 3;
        if (rx * rx + ry * ry < spacing * spacing * 6) continue;
        const dx = points[p] - ax,
          dy = points[p + 1] - ay,
          dz = points[p + 2] - az;
        const distance = dx * nx + dy * ny + dz * nz;
        const previousDistance =
          (before[p] - before[a]) * nx + (before[p + 1] - before[a + 1]) * ny + (before[p + 2] - before[a + 2]) * nz;
        const side = previousDistance >= 0 ? 1 : -1;
        if (distance * side >= thickness || Math.abs(distance) > margin) continue;
        const pb = dx * bx + dy * by + dz * bz,
          pc = dx * cx + dy * cy + dz * cz;
        const u = (cc * pb - bc * pc) / determinant;
        const v = (bb * pc - bc * pb) / determinant;
        if (u < 0 || v < 0 || u + v > 1) continue;
        const w = 1 - u - v;
        const correction = (thickness * side - distance) / (1 + w * w + u * u + v * v);
        for (let axis = 0; axis < 3; axis++) {
          const normal = axis === 0 ? nx : axis === 1 ? ny : nz;
          const movement = normal * correction;
          points[p + axis] += movement;
          points[a + axis] -= movement * w;
          points[b + axis] -= movement * u;
          points[c + axis] -= movement * v;
        }
      }
    }
  }

  for (let step = 1; step <= totalSteps; step++) {
    const progress = step / totalSteps;
    const compression = progress * progress * (3 - 2 * progress);
    const radius = initialRadius * (1 - compression) + shortSide * (0.19 - depth * 0.025) * compression;
    before.set(points);
    for (let i = 0; i < points.length; i += 3) {
      const x = rest[i] / shortSide,
        y = rest[i + 1] / shortSide;
      let buckle = 0;
      for (const guide of guides) buckle += Math.sin((x * guide.x + y * guide.y) * 5 + guide.phase) * guide.weight;
      for (let axis = 0; axis < 3; axis++) {
        const velocity = (points[i + axis] - previous[i + axis]) * 0.55;
        previous[i + axis] = points[i + axis];
        points[i + axis] += clamp(velocity, -spacing * 0.15, spacing * 0.15);
      }
      points[i + 2] += (buckle / density) * shortSide * 0.0007 * Math.sin(progress * Math.PI);
    }
    for (let pass = 0; pass < 18; pass++) {
      constrain(hinges, 4, 0.45 * (1 - sharpness * 0.4), pass % 2 === 0);
      for (let i = 0; i < points.length; i += 3) {
        const x = points[i] / 0.94,
          y = points[i + 1] / 1.02,
          z = points[i + 2] / 0.86;
        const distance = Math.hypot(x, y, z);
        if (distance > radius) {
          const push = (1 - radius / distance) * 0.55;
          points[i] -= points[i] * push;
          points[i + 1] -= points[i + 1] * push;
          points[i + 2] -= points[i + 2] * push;
        }
      }
      constrain(edges, 3, 1, pass % 2 !== 0);
      if (pass === 8 || pass === 17) separateLayers();
    }
    for (let h = 0; h < hinges.length; h += 4) {
      const a = hinges[h],
        b = hinges[h + 1];
      const length = Math.hypot(points[a] - points[b], points[a + 1] - points[b + 1], points[a + 2] - points[b + 2]);
      if (length < hinges[h + 2] * 0.86) hinges[h + 2] += (length - hinges[h + 2]) * 0.12;
    }
    if (step % stepsPerFrame === 0) samples.push(Float32Array.from(points));
  }
  const folded = Float64Array.from(points);
  for (let step = 1; step <= 80; step++) {
    const t = step / 80;
    const unfold = t * t * (3 - 2 * t);
    for (let pass = 0; pass < 12; pass++) {
      for (let i = 0; i < points.length; i++) {
        const target = folded[i] + (rest[i] - folded[i]) * unfold;
        points[i] += (target - points[i]) * (i % 3 === 2 ? 0.04 : 0.22);
      }
      constrain(hinges, 4, 0.7, pass % 2 === 0);
      constrain(edges, 3, 1, pass % 2 !== 0);
    }
  }
  const creased = Float32Array.from(points);
  return { samples, creased };
}

export interface CrumpleOptions {
	/** The sheet's size on screen, in CSS pixels. The canvas is this plus `pad` on every side. */
	width: number;
	height: number;
	pad: number;
	/** How far it goes into a ball, 0 to 1. */
	amount?: number;
	/** Seconds to crumple. */
	duration?: number;
	seed?: number;
	/** The colour of the back of the sheet, as `#rrggbb`: the page's own paper, so a dark page is dark on both sides. */
	backColor?: string;
}

/**
 * Lays the picture `src` (the sheet as it looked) on `canvas`, flat and unlit so the first frame is the page itself;
 * `play` then crumples it, the light coming on with the folds. Everything slow (the folding simulation, the texture,
 * the shaders) happens here, before `ready`, so `play` starts on the next frame. `dispose` frees the GPU.
 * Throws when there is no WebGL: the caller deletes without the animation.
 */
export function prepareCrumple(canvas: HTMLCanvasElement, src: string, options: CrumpleOptions): { ready: Promise<void>; play: () => Promise<void>; dispose: () => void } {
	const { width: paperWidth, height: paperHeight, pad } = options;
	const target = clamp(options.amount ?? 0.85, 0, 1);
	const duration = options.duration ?? 0.55;
	const seed = options.seed ?? 7;
	const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });

	const aspect = paperHeight / paperWidth;
	const shortSide = Math.min(1, aspect);
	const resolution = 16;
	const columns = Math.max(8, Math.round(resolution / Math.max(1, aspect)));
	const rows = Math.max(8, Math.round(resolution * Math.min(1, aspect)));
	const rng = randomSource(seed);
	const sharpness = 0.6;
	const count = (columns + 1) * (rows + 1);
	const original = new Float32Array(count * 3);
	const positions = new Float32Array(count * 3);
	const uvs = new Float32Array(count * 2);
	const indices: number[] = [];
	for (let row = 0; row <= rows; row++) {
		for (let col = 0; col <= columns; col++) {
			const index = row * (columns + 1) + col;
			const u = (col + (col > 0 && col < columns ? (rng() - 0.5) * 0.5 : 0)) / columns;
			const v = (row + (row > 0 && row < rows ? (rng() - 0.5) * 0.5 : 0)) / rows;
			original[index * 3] = u - 0.5;
			original[index * 3 + 1] = (v - 0.5) * aspect;
			uvs[index * 2] = u;
			uvs[index * 2 + 1] = v;
			if (col < columns && row < rows) {
				const a = index,
					b = index + 1,
					c = index + columns + 1,
					d = c + 1;
				if (rng() > 0.5) indices.push(a, b, d, a, d, c);
				else indices.push(a, b, c, b, d, c);
			}
		}
	}
	const path = createPaperPath(original, indices, shortSide, 6, sharpness, 0.65, seed);

	const renderPositions = new Float32Array(indices.length * 3);
	const renderNormals = new Float32Array(indices.length * 3);
	const renderUvs = new Float32Array(indices.length * 2);
	const faceNormals = new Float32Array(indices.length);
	const incidentFaces: number[][] = Array.from({ length: count }, () => []);
	for (let i = 0; i < indices.length; i++) {
		renderUvs[i * 2] = uvs[indices[i] * 2];
		renderUvs[i * 2 + 1] = uvs[indices[i] * 2 + 1];
		incidentFaces[indices[i]].push(Math.floor(i / 3) * 3);
	}
	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute(renderPositions, 3).setUsage(THREE.DynamicDrawUsage));
	geometry.setAttribute('normal', new THREE.BufferAttribute(renderNormals, 3).setUsage(THREE.DynamicDrawUsage));
	geometry.setAttribute('uv', new THREE.BufferAttribute(renderUvs, 2));

	// Paper grain for the light to catch once the sheet is folded.
	const grainData = new Uint8Array(128 * 128 * 4);
	for (let i = 0; i < grainData.length; i += 4) {
		const value = 100 + Math.floor(rng() * 155);
		grainData[i] = grainData[i + 1] = grainData[i + 2] = value;
		grainData[i + 3] = 255;
	}
	const grain = new THREE.DataTexture(grainData, 128, 128);
	grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
	grain.repeat.set(5, 5 * aspect);
	grain.magFilter = grain.minFilter = THREE.LinearFilter;
	grain.needsUpdate = true;

	const materialOptions = { roughness: 0.92, metalness: 0, bumpMap: grain, bumpScale: 0.08 * 0.32, alphaTest: 0.04, alphaToCoverage: true };
	const front = new THREE.MeshStandardMaterial({ ...materialOptions, side: THREE.FrontSide });
	const back = new THREE.MeshStandardMaterial({ ...materialOptions, side: THREE.BackSide, color: options.backColor ?? '#f4f0e8' });
	// Unlit while flat (the picture exactly as the page was), lit as it folds.
	const lighting = { value: 0 };
	for (const material of [front, back]) {
		material.onBeforeCompile = (shader) => {
			shader.uniforms.paperLighting = lighting;
			shader.fragmentShader = 'uniform float paperLighting;\n' + shader.fragmentShader;
			shader.fragmentShader = shader.fragmentShader.replace(
				'#include <map_fragment>',
				`#include <map_fragment>
				#ifdef USE_MAP
					${material === back ? 'diffuseColor.rgb = diffuse;' : ''}
				#endif`
			);
			shader.fragmentShader = shader.fragmentShader.replace(
				'#include <opaque_fragment>',
				`outgoingLight = mix(diffuseColor.rgb, outgoingLight, paperLighting);
				#include <opaque_fragment>`
			);
		};
		material.customProgramCacheKey = () => (material === back ? 'paper-stock' : 'paper-print');
	}

	// The folds shade each other: the depth pass skips the transparent corners of the picture as the colour pass does.
	const depthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, alphaTest: 0.04, side: THREE.DoubleSide });
	depthMaterial.onBeforeCompile = (shader) => {
		shader.fragmentShader = shader.fragmentShader.replace(
			'#include <map_fragment>',
			`#include <map_fragment>
			#ifdef USE_MAP
				if (vMapUv.x < 0.0 || vMapUv.x > 1.0 || vMapUv.y < 0.0 || vMapUv.y > 1.0) discard;
			#endif`
		);
	};
	const sheet = new THREE.Group();
	const frontMesh = new THREE.Mesh(geometry, front);
	const backMesh = new THREE.Mesh(geometry, back);
	frontMesh.castShadow = frontMesh.receiveShadow = backMesh.receiveShadow = true;
	frontMesh.customDepthMaterial = depthMaterial;
	sheet.add(frontMesh, backMesh);
	const scene = new THREE.Scene();
	scene.add(sheet);
	scene.add(new THREE.HemisphereLight(0xffffff, 0xa4a0b0, 1.35));
	const light = new THREE.DirectionalLight(0xfffaf0, 1.8);
	light.castShadow = true;
	light.shadow.mapSize.set(1024, 1024);
	light.shadow.bias = -0.0002;
	light.shadow.normalBias = 0.6;
	light.shadow.radius = 3;
	scene.add(light, light.target);
	// A table under the sheet that only takes its shadow.
	const floorGeometry = new THREE.PlaneGeometry(1, 1);
	const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.16, depthWrite: false });
	const floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.receiveShadow = true;
	scene.add(floor);

	// One unit at z = 0 is one CSS pixel: the flat sheet covers the page exactly.
	const viewWidth = paperWidth + pad * 2;
	const viewHeight = paperHeight + pad * 2;
	const camera = new THREE.PerspectiveCamera(35, viewWidth / viewHeight, 0.1, 10000);
	camera.position.z = viewHeight / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
	camera.updateProjectionMatrix();
	sheet.scale.setScalar(paperWidth);
	const reach = Math.max(viewWidth, viewHeight);
	const angle = THREE.MathUtils.degToRad(-35);
	light.position.set(Math.sin(angle) * reach, Math.cos(angle) * reach, reach * 4);
	light.shadow.camera.left = light.shadow.camera.bottom = -reach;
	light.shadow.camera.right = light.shadow.camera.top = reach;
	light.shadow.camera.near = 1;
	light.shadow.camera.far = reach * 6;
	light.shadow.camera.updateProjectionMatrix();
	floor.scale.set(viewWidth * 4, viewHeight * 4, 1);
	floor.position.z = -paperWidth * shortSide * 0.12;
	renderer.setClearColor(0x000000, 0);
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
	renderer.setSize(viewWidth, viewHeight, false);

	const amount = spring();
	function deform() {
		const fold = clamp(amount.value, 0, 1);
		const frame = fold * (path.samples.length - 1);
		const lower = Math.floor(frame);
		const upper = Math.min(lower + 1, path.samples.length - 1);
		const mix = frame - lower;
		const from = path.samples[lower];
		const to = path.samples[upper];
		for (let i = 0; i < positions.length; i++) positions[i] = from[i] + (to[i] - from[i]) * mix;
		for (let face = 0; face < indices.length; face += 3) {
			const a = indices[face] * 3,
				b = indices[face + 1] * 3,
				c = indices[face + 2] * 3;
			const bx = positions[b] - positions[a],
				by = positions[b + 1] - positions[a + 1],
				bz = positions[b + 2] - positions[a + 2];
			const cx = positions[c] - positions[a],
				cy = positions[c + 1] - positions[a + 1],
				cz = positions[c + 2] - positions[a + 2];
			const nx = by * cz - bz * cy,
				ny = bz * cx - bx * cz,
				nz = bx * cy - by * cx;
			const length = Math.hypot(nx, ny, nz) || 1;
			faceNormals[face] = nx / length;
			faceNormals[face + 1] = ny / length;
			faceNormals[face + 2] = nz / length;
		}
		for (let i = 0; i < indices.length; i++) {
			const source = indices[i] * 3;
			const face = Math.floor(i / 3) * 3;
			let nx = 0,
				ny = 0,
				nz = 0;
			for (const neighbor of incidentFaces[indices[i]]) {
				const dot = faceNormals[face] * faceNormals[neighbor] + faceNormals[face + 1] * faceNormals[neighbor + 1] + faceNormals[face + 2] * faceNormals[neighbor + 2];
				const weight = THREE.MathUtils.smoothstep(dot, 0.88 - (1 - sharpness) * 0.18, 0.98);
				nx += faceNormals[neighbor] * weight;
				ny += faceNormals[neighbor + 1] * weight;
				nz += faceNormals[neighbor + 2] * weight;
			}
			const length = Math.hypot(nx, ny, nz) || 1;
			renderPositions[i * 3] = positions[source];
			renderPositions[i * 3 + 1] = positions[source + 1];
			renderPositions[i * 3 + 2] = positions[source + 2];
			renderNormals[i * 3] = nx / length;
			renderNormals[i * 3 + 1] = ny / length;
			renderNormals[i * 3 + 2] = nz / length;
		}
		geometry.attributes.position.needsUpdate = true;
		geometry.attributes.normal.needsUpdate = true;
		geometry.computeBoundingSphere();
		geometry.computeBoundingBox();
		lighting.value = THREE.MathUtils.smoothstep(fold, 0, 0.4);
	}

	const corner = new THREE.Vector3();
	function placeFloor() {
		const bounds = geometry.boundingBox;
		if (!bounds) return;
		sheet.updateMatrixWorld(true);
		let backZ = Infinity;
		for (let i = 0; i < 8; i++) {
			corner.set(i & 1 ? bounds.max.x : bounds.min.x, i & 2 ? bounds.max.y : bounds.min.y, i & 4 ? bounds.max.z : bounds.min.z);
			backZ = Math.min(backZ, corner.applyMatrix4(sheet.matrixWorld).z);
		}
		floor.position.z = backZ - paperWidth * shortSide * 0.08;
	}

	let frame = 0;
	let disposed = false;
	let texture: THREE.Texture | null = null;
	// Ready: the picture is on the sheet and the first frame, flat, has been drawn (which also compiles the shaders).
	const ready = new Promise<void>((resolve, reject) => {
		new THREE.TextureLoader().load(
			src,
			(loaded) => {
				if (disposed) return loaded.dispose();
				texture = loaded;
				loaded.colorSpace = THREE.SRGBColorSpace;
				loaded.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
				front.map = back.map = depthMaterial.map = loaded;
				front.needsUpdate = back.needsUpdate = depthMaterial.needsUpdate = true;
				deform();
				placeFloor();
				renderer.render(scene, camera);
				resolve();
			},
			undefined,
			() => reject(new Error('The page could not be loaded as a texture.'))
		);
	});

	// Play: fold it into a ball; settles once the ball is made.
	const play = () =>
		new Promise<void>((resolve) => {
			amount.target = target;
			let last = 0;
			const step = (time: number) => {
				if (disposed) return resolve();
				const dt = last ? Math.min(0.04, (time - last) / 1000) : 1 / 60;
				last = time;
				const moving = advance(amount, dt, duration, false);
				deform();
				placeFloor();
				renderer.render(scene, camera);
				if (moving) frame = requestAnimationFrame(step);
				else resolve();
			};
			frame = requestAnimationFrame(step);
		});

	const dispose = () => {
		disposed = true;
		cancelAnimationFrame(frame);
		geometry.dispose();
		front.dispose();
		back.dispose();
		depthMaterial.dispose();
		floorGeometry.dispose();
		floorMaterial.dispose();
		light.shadow.dispose();
		grain.dispose();
		texture?.dispose();
		renderer.dispose();
	};
	return { ready, play, dispose };
}
