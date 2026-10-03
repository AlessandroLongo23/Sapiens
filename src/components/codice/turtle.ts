/**
 * The page's side of the turtle (public/codice/turtle.py, which lists the operations): plays the operations back on a
 * canvas, one after the other, at each turtle's speed. The program has already finished in the worker; what the
 * student watches is the replay.
 *
 * Coordinates are the turtle's: origin in the middle, y up, a world of 640 × 480 unless `setup` says otherwise,
 * scaled to the canvas.
 */

type Op = [string, ...unknown[]];
type Point = [number, number];

interface Sprite {
	x: number;
	y: number;
	heading: number;
	pencolor: string;
	fillcolor: string;
	width: number;
	visible: boolean;
	shape: string;
	speed: number;
	/** Where its fill goes in the drawing: under the lines drawn after begin_fill. */
	fillAt: number;
}

type Item =
	| { kind: 'line'; owner: number; from: Point; to: Point; color: string; width: number }
	| { kind: 'fill'; owner: number; points: Point[]; color: string }
	| { kind: 'dot'; owner: number; at: Point; size: number; color: string }
	| { kind: 'text'; owner: number; at: Point; text: string; align: string; font: [string, number, string]; color: string }
	| { kind: 'stamp'; owner: number; at: Point; heading: number; shape: string; pencolor: string; fillcolor: string; width: number };

/** Python's turtle shapes, pointing up (+y is the heading). */
const SHAPES: Record<string, Point[]> = {
	classic: [[0, 0], [-5, -9], [0, -7], [5, -9]],
	arrow: [[-10, 0], [10, 0], [0, 10]],
	turtle: [[0, 16], [-2, 14], [-1, 10], [-4, 7], [-7, 9], [-9, 8], [-6, 5], [-7, 1], [-5, -3], [-8, -6], [-6, -8], [-4, -5], [0, -7], [4, -5], [6, -8], [8, -6], [5, -3], [7, 1], [6, 5], [9, 8], [7, 9], [4, 7], [1, 10], [2, 14]],
	square: [[10, -10], [10, 10], [-10, 10], [-10, -10]],
	triangle: [[10, -5.77], [0, 11.55], [-10, -5.77]],
	circle: Array.from({ length: 24 }, (_, i): Point => [10 * Math.cos((i * Math.PI) / 12), 10 * Math.sin((i * Math.PI) / 12)])
};

/** Distance in units and turn in degrees per frame at speeds 1 to 10 (0 is instant). */
const pace = (speed: number) => ({ move: 2 + 1.2 * speed * speed, turn: 3 + 1.5 * speed * speed });
/** Instant operations per frame, so a drawing of thousands of lines takes a few frames and never blocks the page. */
const PER_FRAME = 2000;

const sprite = (): Sprite => ({ x: 0, y: 0, heading: 0, pencolor: 'black', fillcolor: 'black', width: 1, visible: true, shape: 'classic', speed: 3, fillAt: -1 });

export class Stage {
	private ctx: CanvasRenderingContext2D;
	private queue: Op[] = [];
	private items: Item[] = [];
	private sprites: Sprite[] = [];
	private bg = 'white';
	private world = { width: 640, height: 480 };
	private tracer = true;
	/** The move or turn being animated: how far along it is, from 0 to 1. */
	private progress = 0;
	private frame = 0;

	constructor(
		private canvas: HTMLCanvasElement,
		/** Told when the world changes size, for the canvas's proportions, and when the replay starts or ends. */
		private onChange: (state: { width: number; height: number; playing: boolean }) => void
	) {
		this.ctx = canvas.getContext('2d')!;
	}

	push(ops: Op[]) {
		this.queue.push(...ops);
		this.play();
	}

	/** Draws everything left at once. */
	skip() {
		while (this.queue.length) this.apply(this.queue.shift()!);
		this.progress = 0;
		this.draw();
		this.stopped();
	}

	reset() {
		cancelAnimationFrame(this.frame);
		this.frame = 0;
		this.queue = [];
		this.items = [];
		this.sprites = [];
		this.bg = 'white';
		this.world = { width: 640, height: 480 };
		this.tracer = true;
		this.progress = 0;
		this.draw();
		this.stopped();
	}

	dispose() {
		cancelAnimationFrame(this.frame);
	}

	/** Matches the canvas's pixels to its size on screen. */
	resize() {
		const ratio = window.devicePixelRatio || 1;
		const { width } = this.canvas.getBoundingClientRect();
		this.canvas.width = Math.round(width * ratio);
		this.canvas.height = Math.round(((width * this.world.height) / this.world.width) * ratio);
		this.draw();
	}

	private play() {
		if (this.frame) return;
		this.onChange({ ...this.world, playing: true });
		const tick = () => {
			this.frame = 0;
			this.advance();
			this.draw();
			if (this.queue.length) this.frame = requestAnimationFrame(tick);
			else this.stopped();
		};
		this.frame = requestAnimationFrame(tick);
	}

	private stopped() {
		this.onChange({ ...this.world, playing: false });
	}

	/** One frame of the replay: instant operations as they come, moves and turns for the time a frame gives them. */
	private advance() {
		let time = 1;
		let instant = 0;
		while (this.queue.length && instant < PER_FRAME) {
			const op = this.queue[0];
			const cost = this.cost(op);
			if (cost === 0) {
				this.apply(this.queue.shift()!);
				instant++;
				continue;
			}
			const left = (1 - this.progress) * cost;
			if (left > time) {
				this.progress += time / cost;
				return;
			}
			time -= left;
			this.progress = 0;
			this.apply(this.queue.shift()!);
		}
	}

	/** How many frames an operation takes at its turtle's speed. */
	private cost(op: Op): number {
		if (!this.tracer || (op[0] !== 'move' && op[0] !== 'turn')) return 0;
		const t = this.sprites[op[1] as number];
		if (!t || t.speed === 0) return 0;
		const { move, turn } = pace(t.speed);
		if (op[0] === 'move') return Math.hypot((op[2] as number) - t.x, (op[3] as number) - t.y) / move;
		const delta = Math.abs(((((op[2] as number) - t.heading) % 360) + 540) % 360 - 180);
		return delta / turn;
	}

	private apply(op: Op) {
		const [name, ...a] = op;
		if (name === 'bg') this.bg = a[0] as string;
		else if (name === 'size') {
			this.world = { width: Math.max(50, a[0] as number), height: Math.max(50, a[1] as number) };
			this.onChange({ ...this.world, playing: true });
		} else if (name === 'tracer') this.tracer = a[0] as boolean;
		if (typeof a[0] !== 'number' || name === 'size') return;
		const id = a[0];
		if (name === 'new') {
			this.sprites[id] = sprite();
			return;
		}
		const t = (this.sprites[id] ??= sprite());
		switch (name) {
			case 'move': {
				const [x, y, down] = a.slice(1) as [number, number, boolean];
				if (down) this.items.push({ kind: 'line', owner: id, from: [t.x, t.y], to: [x, y], color: t.pencolor, width: t.width });
				t.x = x;
				t.y = y;
				break;
			}
			case 'turn':
				t.heading = a[1] as number;
				break;
			case 'pen':
				[t.pencolor, t.fillcolor, t.width] = a.slice(1) as [string, string, number];
				break;
			case 'show':
				t.visible = a[1] as boolean;
				break;
			case 'shape':
				t.shape = a[1] as string;
				break;
			case 'speed':
				t.speed = a[1] as number;
				break;
			case 'fillstart':
				t.fillAt = this.items.length;
				break;
			case 'fill':
				this.items.splice(t.fillAt < 0 ? this.items.length : t.fillAt, 0, { kind: 'fill', owner: id, color: a[1] as string, points: a[2] as Point[] });
				t.fillAt = -1;
				break;
			case 'dot':
				this.items.push({ kind: 'dot', owner: id, at: [a[1] as number, a[2] as number], size: a[3] as number, color: a[4] as string });
				break;
			case 'write':
				this.items.push({ kind: 'text', owner: id, at: [a[1] as number, a[2] as number], text: a[3] as string, align: a[4] as string, font: a[5] as [string, number, string], color: a[6] as string });
				break;
			case 'stamp': {
				const [x, y, heading, shape, pencolor, fillcolor, width] = a.slice(1) as [number, number, number, string, string, string, number];
				this.items.push({ kind: 'stamp', owner: id, at: [x, y], heading, shape, pencolor, fillcolor, width });
				break;
			}
			case 'clear':
				this.items = this.items.filter((item) => item.owner !== id);
				break;
		}
	}

	/** The turtle in the middle of an animated move or turn: where it is now, and the stretch of line drawn so far. */
	private moving(): { id: number; x: number; y: number; heading: number; line?: [Point, Point] } | null {
		const op = this.queue[0];
		if (!op || this.progress === 0) return null;
		const id = op[1] as number;
		const t = this.sprites[id];
		if (!t) return null;
		if (op[0] === 'move') {
			const x = t.x + ((op[2] as number) - t.x) * this.progress;
			const y = t.y + ((op[3] as number) - t.y) * this.progress;
			return { id, x, y, heading: t.heading, line: op[4] ? [[t.x, t.y], [x, y]] : undefined };
		}
		const delta = ((((op[2] as number) - t.heading) % 360) + 540) % 360 - 180;
		return { id, x: t.x, y: t.y, heading: t.heading + delta * this.progress };
	}

	private draw() {
		const { ctx, canvas, world } = this;
		const scale = canvas.width / world.width;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.fillStyle = this.bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		// turtle coordinates: origin in the middle, y up
		ctx.setTransform(scale, 0, 0, -scale, canvas.width / 2, canvas.height / 2);
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		for (const item of this.items) this.item(item);
		const now = this.moving();
		if (now?.line) {
			const t = this.sprites[now.id];
			this.item({ kind: 'line', owner: now.id, from: now.line[0], to: now.line[1], color: t.pencolor, width: t.width });
		}
		this.sprites.forEach((t, id) => {
			if (!t.visible) return;
			const at = now?.id === id ? now : t;
			this.shape(t.shape, at.x, at.y, at.heading, t.pencolor, t.fillcolor, 1);
		});
	}

	private item(item: Item) {
		const { ctx } = this;
		switch (item.kind) {
			case 'line':
				ctx.strokeStyle = item.color;
				ctx.lineWidth = item.width;
				ctx.beginPath();
				ctx.moveTo(...item.from);
				ctx.lineTo(...item.to);
				ctx.stroke();
				break;
			case 'fill':
				ctx.fillStyle = item.color;
				ctx.beginPath();
				item.points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
				ctx.closePath();
				// Tk fills a crossing polygon by the even-odd rule: a five-pointed star keeps its middle empty
				ctx.fill('evenodd');
				break;
			case 'dot':
				ctx.fillStyle = item.color;
				ctx.beginPath();
				ctx.arc(item.at[0], item.at[1], item.size / 2, 0, 2 * Math.PI);
				ctx.fill();
				break;
			case 'text': {
				const [family, size, style] = item.font;
				ctx.save();
				ctx.translate(...item.at);
				ctx.scale(1, -1);
				ctx.fillStyle = item.color;
				ctx.font = `${style.includes('italic') ? 'italic ' : ''}${style.includes('bold') ? 'bold ' : ''}${size * 1.33}px ${family}, sans-serif`;
				ctx.textAlign = item.align === 'center' ? 'center' : item.align === 'right' ? 'right' : 'left';
				ctx.textBaseline = 'bottom';
				ctx.fillText(item.text, 0, 0);
				ctx.restore();
				break;
			}
			case 'stamp':
				this.shape(item.shape, item.at[0], item.at[1], item.heading, item.pencolor, item.fillcolor, item.width);
				break;
		}
	}

	private shape(name: string, x: number, y: number, heading: number, pencolor: string, fillcolor: string, width: number) {
		const { ctx } = this;
		const points = SHAPES[name] ?? SHAPES.classic;
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(((heading - 90) * Math.PI) / 180);
		ctx.beginPath();
		points.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
		ctx.closePath();
		ctx.fillStyle = fillcolor;
		ctx.fill();
		ctx.strokeStyle = pencolor;
		ctx.lineWidth = width;
		ctx.stroke();
		ctx.restore();
	}
}
