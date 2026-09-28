/**
 * 3D molecules in lessons: a ```molecola3d block is published as its 2D drawing plus the molecule's coordinates
 * (`data-xyz` and `data-bonds` on the figure, see chemFigure in content/markdown.ts), with an empty box beside the
 * drawing. When the figure scrolls near, the box gets a ball-and-stick model the student can turn. 3Dmol is bundled
 * (the CSP allows no script CDN) and loaded only when the first molecule comes near.
 *
 * The model turns with our own pointer handling, not 3Dmol's: a drag rotates it, a flick leaves it spinning and the
 * spin fades out. 3Dmol's handlers also zoom on the wheel, which would steal the page scroll. The spin runs only
 * while the model is on screen.
 *
 * Each model has its own WebGL context, and browsers keep about 16 per page: past that the oldest are lost. 3Dmol
 * gives a lost context back to a viewer when its box comes on screen again (resize and _handleLostContext in its
 * GLViewer), so a long lesson needs nothing more from us.
 */

/** `C 0.000 0.000 0.000; H …` → the XYZ file 3Dmol reads. */
const xyzFile = (atoms: string) => {
	const lines = atoms.split(';').map((a) => a.trim()).filter(Boolean);
	return `${lines.length}\n\n${lines.join('\n')}\n`;
};

/**
 * The `xyz` atoms joined by the `data-bonds` list (`1-2:2; 1-3:1`, from 1) in the form 3Dmol's addAtoms takes, so
 * double and triple bonds are drawn as two and three sticks. An XYZ file has no bonds: 3Dmol would guess them from
 * the distances, all single.
 */
function bondedAtoms(xyz: string, bonds: string) {
	const atoms = xyz
		.split(';')
		.map((a) => a.trim().split(/\s+/))
		.filter((a) => a.length === 4)
		.map(([elem, x, y, z], index) => ({
			elem,
			x: Number(x),
			y: Number(y),
			z: Number(z),
			index,
			bonds: [] as number[],
			bondOrder: [] as number[],
		}));
	for (const bond of bonds.split(';')) {
		const m = bond.trim().match(/^(\d+)-(\d+):(\d)$/);
		const a = m && atoms[Number(m[1]) - 1];
		const b = m && atoms[Number(m[2]) - 1];
		if (!m || !a || !b) continue;
		a.bonds.push(b.index);
		a.bondOrder.push(Number(m[3]));
		b.bonds.push(a.index);
		b.bondOrder.push(Number(m[3]));
	}
	return atoms;
}

type Quat = [number, number, number, number]; // x, y, z, w

/** Hamilton product a·b. */
const mul = ([ax, ay, az, aw]: Quat, [bx, by, bz, bw]: Quat): Quat => [
	aw * bx + ax * bw + ay * bz - az * by,
	aw * by - ax * bz + ay * bw + az * bx,
	aw * bz + ax * by - ay * bx + az * bw,
	aw * bw - ax * bx - ay * by - az * bz,
];

/** Radians per pixel of drag, as a share of the box width: a drag across the whole box is a half turn and a bit. */
const TURN_PER_WIDTH = 1.2 * Math.PI;
/** How long a flick takes to lose about two thirds of its speed. */
const FRICTION_MS = 1400;
/** Below this (radians per ms) the spin stops. */
const MIN_SPEED = 0.00005;
/** The slow turn a model starts with, until the student touches it. */
const IDLE_SPEED = 0.0004;
/** Only the last stretch of a drag counts for the flick. */
const FLICK_WINDOW_MS = 80;

interface Viewer {
	getView(): number[];
	setView(view: number[]): void;
	clear(): void;
}

/** Drag, flick and idle turn for one viewer. `pause` stops the spin while the drawing is shown, `resume` restarts it. */
function turnable(box: HTMLElement, viewer: Viewer, reducedMotion: boolean) {
	// Angular velocity in view space: axis (x, y) scaled by radians per ms. A drag to the right turns around +y.
	let vx = 0;
	let vy = reducedMotion ? 0 : IDLE_SPEED;
	let idle = !reducedMotion;
	let frame = 0;
	let last = 0;
	let dragging = false;
	let samples: { t: number; x: number; y: number }[] = [];

	/** Turns the model by `angle` radians around the view-space axis (ax, ay, 0). */
	const rotate = (ax: number, ay: number, angle: number) => {
		const len = Math.hypot(ax, ay);
		if (!len || !angle) return;
		const s = Math.sin(angle / 2) / len;
		const view = viewer.getView();
		const q = mul([ax * s, ay * s, 0, Math.cos(angle / 2)], view.slice(4, 8) as Quat);
		viewer.setView([...view.slice(0, 4), ...q, ...view.slice(8)]);
	};

	const tick = (now: number) => {
		const dt = Math.min(now - last, 50);
		last = now;
		if (!idle) {
			const decay = Math.exp(-dt / FRICTION_MS);
			vx *= decay;
			vy *= decay;
		}
		const speed = Math.hypot(vx, vy);
		if (speed < MIN_SPEED) {
			frame = 0;
			return;
		}
		rotate(vx, vy, speed * dt);
		frame = requestAnimationFrame(tick);
	};
	const start = () => {
		if (frame || dragging) return;
		last = performance.now();
		frame = requestAnimationFrame(tick);
	};
	const stop = () => {
		cancelAnimationFrame(frame);
		frame = 0;
	};

	const onDown = (e: PointerEvent) => {
		if (e.button !== 0) return;
		stop();
		idle = false;
		dragging = true;
		samples = [{ t: e.timeStamp, x: e.clientX, y: e.clientY }];
		box.setPointerCapture(e.pointerId);
		box.style.cursor = 'grabbing';
	};
	const onMove = (e: PointerEvent) => {
		if (!dragging) return;
		const prev = samples[samples.length - 1];
		const dx = e.clientX - prev.x;
		const dy = e.clientY - prev.y;
		rotate(dy, dx, (Math.hypot(dx, dy) * TURN_PER_WIDTH) / box.clientWidth);
		samples.push({ t: e.timeStamp, x: e.clientX, y: e.clientY });
		samples = samples.filter((p) => e.timeStamp - p.t <= FLICK_WINDOW_MS);
	};
	const onUp = (e: PointerEvent) => {
		if (!dragging) return;
		dragging = false;
		box.style.cursor = '';
		const first = samples[0];
		const lastSample = samples[samples.length - 1];
		const dt = lastSample.t - first.t;
		// A pause before letting go means the student meant to stop it there.
		if (reducedMotion || samples.length < 2 || !dt || e.timeStamp - lastSample.t > FLICK_WINDOW_MS) return;
		const perPx = TURN_PER_WIDTH / box.clientWidth;
		vx = ((lastSample.y - first.y) / dt) * perPx;
		vy = ((lastSample.x - first.x) / dt) * perPx;
		start();
	};

	box.addEventListener('pointerdown', onDown);
	box.addEventListener('pointermove', onMove);
	box.addEventListener('pointerup', onUp);
	box.addEventListener('pointercancel', onUp);
	start();
	return { pause: stop, resume: start };
}

type Vec = { x: number; y: number; z: number };
type Atom = Vec & { index: number; bonds: number[]; bondOrder: number[] };
/** What showMultipleBond needs from a 3Dmol GLModel: its atoms and where it puts the sticks of a multiple bond. */
interface SideBonds {
	selectedAtoms(sel: object): Atom[];
	getSideBondV(atom: Atom, atom2: Atom, i: number): Vec;
}

const sub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const cross = (a: Vec, b: Vec): Vec => ({ x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x });
const unit = (a: Vec): Vec => {
	const l = Math.hypot(a.x, a.y, a.z);
	return { x: a.x / l, y: a.y / l, z: a.z / l };
};

/**
 * Turns the model so its first double or triple bond lies across the screen with its sticks one above the other.
 * 3Dmol sets the sticks apart along a side direction of its own choosing: for CO₂ that direction ended up pointing
 * at the viewer, and the turn around the vertical axis kept it in the horizontal plane, so the two sticks always
 * covered each other. With the sticks stacked vertically, the idle turn never lines them up.
 */
function showMultipleBond(viewer: Viewer, model: SideBonds) {
	const atoms = model.selectedAtoms({});
	for (const atom of atoms)
		for (let i = 0; i < atom.bonds.length; i++) {
			const other = atoms.find((a) => a.index === atom.bonds[i]);
			const order = atom.bondOrder[i];
			// 3Dmol draws each bond from its lower-index atom, and the side direction depends on that order.
			if (!other || atom.index > other.index || order < 2 || order > 3) continue;
			const along = unit(sub(other, atom));
			let side = unit(model.getSideBondV(atom, other, i));
			// A triple bond's outer sticks are set apart across that direction, not along it.
			if (order === 3) side = unit(cross(side, along));
			const normal = cross(along, side);
			// The rotation taking along, side, normal to the screen's x, y, z, as a quaternion (x, y, z, w).
			const m = [
				[along.x, along.y, along.z],
				[side.x, side.y, side.z],
				[normal.x, normal.y, normal.z],
			];
			const w = Math.sqrt(Math.max(0, 1 + m[0][0] + m[1][1] + m[2][2])) / 2;
			const q: Quat =
				w > 1e-3
					? [(m[2][1] - m[1][2]) / (4 * w), (m[0][2] - m[2][0]) / (4 * w), (m[1][0] - m[0][1]) / (4 * w), w]
					: quatFromMatrix(m);
			const view = viewer.getView();
			viewer.setView([...view.slice(0, 4), ...q, ...view.slice(8)]);
			return;
		}
}

/** The general conversion, for rotations near half a turn where the short one divides by almost zero. */
function quatFromMatrix(m: number[][]): Quat {
	if (m[0][0] > m[1][1] && m[0][0] > m[2][2]) {
		const s = Math.sqrt(1 + m[0][0] - m[1][1] - m[2][2]) * 2;
		return [s / 4, (m[0][1] + m[1][0]) / s, (m[0][2] + m[2][0]) / s, (m[2][1] - m[1][2]) / s];
	}
	if (m[1][1] > m[2][2]) {
		const s = Math.sqrt(1 + m[1][1] - m[0][0] - m[2][2]) * 2;
		return [(m[0][1] + m[1][0]) / s, s / 4, (m[1][2] + m[2][1]) / s, (m[0][2] - m[2][0]) / s];
	}
	const s = Math.sqrt(1 + m[2][2] - m[0][0] - m[1][1]) * 2;
	return [(m[0][2] + m[2][0]) / s, (m[1][2] + m[2][1]) / s, s / 4, (m[1][0] - m[0][1]) / s];
}

/** Starts turning only after the model is built; before that, the figure's box stays empty. */
async function build(figure: HTMLElement, box: HTMLElement, reducedMotion: boolean) {
	const $3Dmol = await import('3dmol');
	// nomouse: the drag is ours (see turnable). The 1×1 grid makes 3Dmol draw on the page's canvas: without it,
	// it draws on a shared offscreen canvas and copies the frame over, and the copy loses the transparency, so
	// the box shows white on any page background. No fog: it fades the far atoms to white.
	const viewer = $3Dmol.createViewer(box, { backgroundAlpha: 0, nomouse: true, rows: 1, cols: 1, row: 0, col: 0 });
	viewer.enableFog(false);
	const { xyz = '', bonds } = figure.dataset;
	const model = viewer.addModel(bonds ? undefined : xyzFile(xyz), bonds ? undefined : 'xyz');
	if (bonds) model.addAtoms(bondedAtoms(xyz, bonds));
	// 3Dmol draws a double bond as two sticks 0.4 times as thick as a single one, set apart by as much as one is
	// thick (a third: 0.25, three sticks): at this radius the gap is a few pixels and the pair reads as one stick.
	// Thicker sticks open the gap, and the pair stays within the atoms.
	viewer.setStyle({}, { stick: { radius: 0.14, doubleBondScaling: 0.6, tripleBondScaling: 0.45 }, sphere: { scale: 0.26 } });
	viewer.zoomTo();
	// zoomTo leaves a wide margin around a small molecule: bring it closer.
	viewer.zoom(1.8);
	showMultipleBond(viewer, model as unknown as SideBonds);
	viewer.render();
	return { viewer, motion: turnable(box, viewer, reducedMotion) };
}

export function activate3dModels(root: HTMLElement): () => void {
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const models = new Map<HTMLElement, Awaited<ReturnType<typeof build>>>();
	const onScreen = new Set<HTMLElement>();
	let stopped = false;

	// Pauses the spin of a model that leaves the screen and restarts it when it comes back.
	const visible = new IntersectionObserver((entries) =>
		entries.forEach(({ target, isIntersecting }) => {
			const box = target as HTMLElement;
			if (isIntersecting) onScreen.add(box);
			else onScreen.delete(box);
			const motion = models.get(box)?.motion;
			if (isIntersecting) motion?.resume();
			else motion?.pause();
		})
	);
	// Builds a model once its figure is within 400px of the screen, so it is ready when it arrives.
	const near = new IntersectionObserver(
		(entries) =>
			entries.forEach(async ({ target, isIntersecting }) => {
				if (!isIntersecting) return;
				near.unobserve(target);
				const figure = target as HTMLElement;
				const box = figure.querySelector<HTMLElement>('.chem-3d-box');
				if (!box) return;
				try {
					const model = await build(figure, box, reducedMotion);
					if (stopped) return model.viewer.clear();
					models.set(box, model);
					if (!onScreen.has(box)) model.motion.pause();
				} catch {
					box.textContent = 'Il modello 3D non si è caricato.';
					box.className = 'flex size-[220px] items-center justify-center text-center text-sm text-fg-muted';
				}
			}),
		{ rootMargin: '400px 0px' }
	);
	root.querySelectorAll<HTMLElement>('figure[data-xyz]').forEach((figure) => {
		near.observe(figure);
		const box = figure.querySelector('.chem-3d-box');
		if (box) visible.observe(box);
	});
	return () => {
		stopped = true;
		near.disconnect();
		visible.disconnect();
		for (const m of models.values()) {
			m.motion.pause();
			m.viewer.clear();
		}
	};
}
