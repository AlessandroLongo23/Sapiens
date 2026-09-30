import { BoxGeometry, CanvasTexture, Group, Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace, type Object3D } from 'three';

/*
 * The lab notebook, in place of an instructions panel: the student raises it in front of the eyes (Q) and lowers it
 * again, as the map in Firewatch. It hangs from the camera and is drawn over the scene; its pages are a canvas
 * written in a handwriting font.
 */

export type NotebookTask = { text: string; state: 'done' | 'now' | 'todo' | 'bad' };

export type NotebookPage = {
	/** A pencil line above the title (where the work is up to). */
	kicker?: string;
	title: string;
	intro: string;
	tasks: NotebookTask[];
	/** Pencil note at the bottom of the right page: how to do the current step. */
	hint: string;
	/** Written when the work is done. */
	done: string | null;
	/** The right page's heading ('Procedimento' if not given). */
	steps?: string;
	/** Results, as a table under the intro. */
	rows?: [string, string][];
};

const W = 0.34;
const H = 0.222;
const PX = 1600;
const PY = Math.round((PX * H) / W);

export class Notebook {
	readonly group = new Group();
	private canvas: HTMLCanvasElement;
	private tex: CanvasTexture;
	private k = 0;
	open = false;
	private t = 0;
	private last = '';

	constructor(
		camera: Object3D,
		private font: string
	) {
		this.canvas = document.createElement('canvas');
		this.canvas.width = PX;
		this.canvas.height = PY;
		this.tex = new CanvasTexture(this.canvas);
		this.tex.colorSpace = SRGBColorSpace;
		this.tex.anisotropy = 4;
		const over = { depthTest: false, depthWrite: false, transparent: true };
		const cover = new Mesh(new BoxGeometry(W + 0.014, H + 0.012, 0.006), new MeshBasicMaterial({ color: '#2f6f73', ...over }));
		cover.position.z = -0.006;
		cover.renderOrder = 1000;
		// the pages bow up from the spine
		const g = new PlaneGeometry(W, H, 48, 1);
		const pos = g.attributes.position;
		for (let i = 0; i < pos.count; i++) {
			const x = pos.getX(i);
			pos.setZ(i, 0.01 * Math.sin((Math.PI * Math.abs(x)) / (W / 2)) + 0.004 * (Math.abs(x) / (W / 2)));
		}
		g.computeVertexNormals();
		const pages = new Mesh(g, new MeshBasicMaterial({ map: this.tex, color: '#f4efe6', ...over }));
		pages.renderOrder = 1001;
		this.group.add(cover, pages);
		this.group.visible = false;
		camera.add(this.group);
	}

	toggle() {
		this.open = !this.open;
	}

	/** Redraws the pages if they changed. */
	draw(p: NotebookPage) {
		const key = JSON.stringify(p);
		if (key === this.last) return;
		this.last = key;
		const c = this.canvas.getContext('2d')!;
		const f = (size: number, weight = 500) => `${weight} ${size}px ${this.font}`;
		// paper, rules, margin, the fold
		c.fillStyle = '#f6efdf';
		c.fillRect(0, 0, PX, PY);
		const half = PX / 2;
		c.strokeStyle = 'rgba(96, 140, 190, 0.28)';
		c.lineWidth = 2;
		for (let y = 150; y < PY - 30; y += 52) {
			c.beginPath();
			c.moveTo(20, y);
			c.lineTo(PX - 20, y);
			c.stroke();
		}
		c.strokeStyle = 'rgba(214, 90, 90, 0.35)';
		for (const x of [90, half + 90]) {
			c.beginPath();
			c.moveTo(x, 0);
			c.lineTo(x, PY);
			c.stroke();
		}
		const fold = c.createLinearGradient(half - 60, 0, half + 60, 0);
		fold.addColorStop(0, 'rgba(0,0,0,0)');
		fold.addColorStop(0.5, 'rgba(60,40,20,0.18)');
		fold.addColorStop(1, 'rgba(0,0,0,0)');
		c.fillStyle = fold;
		c.fillRect(half - 60, 0, 120, PY);

		const ink = '#27386b';
		const pencil = '#6b6b70';
		// left page: title and what the work is about
		if (p.kicker) {
			c.fillStyle = pencil;
			c.font = f(36);
			c.fillText(p.kicker, 110, 56);
		}
		c.fillStyle = ink;
		c.font = f(64, 700);
		c.fillText(p.title, 110, 118);
		c.font = f(40);
		let ly = 196 + 52 * wrap(c, p.intro, 110, 196, half - 170, 52);
		if (p.rows) {
			ly += 30;
			c.font = f(38);
			for (const [k, v] of p.rows) {
				c.fillStyle = ink;
				c.fillText(k, 110, ly);
				c.font = f(38, 700);
				const w = c.measureText(v).width;
				c.fillText(v, half - 60 - w, ly);
				c.font = f(38);
				ly += 52;
			}
		}
		if (p.done) {
			c.fillStyle = '#1f6b4a';
			c.font = f(44, 700);
			c.fillText('Fatto!', 110, PY - 290);
			c.font = f(38);
			wrap(c, p.done, 110, PY - 238, half - 170, 52);
		}
		// right page: the steps, ticked in ink
		const x0 = half + 110;
		c.fillStyle = ink;
		c.font = f(50, 700);
		c.fillText(p.steps ?? 'Procedimento', x0, 110);
		let y = 196;
		p.tasks.forEach((t, i) => {
			c.strokeStyle = t.state === 'todo' ? 'rgba(39,56,107,0.45)' : ink;
			c.lineWidth = 3;
			c.strokeRect(x0, y - 30, 30, 30);
			if (t.state === 'bad') {
				c.strokeStyle = '#b3313f';
				c.lineWidth = 6;
				c.beginPath();
				c.moveTo(x0 + 4, y - 26);
				c.lineTo(x0 + 28, y - 2);
				c.moveTo(x0 + 28, y - 26);
				c.lineTo(x0 + 4, y - 2);
				c.stroke();
			}
			if (t.state === 'done') {
				c.strokeStyle = '#1f6b4a';
				c.lineWidth = 6;
				c.beginPath();
				c.moveTo(x0 + 4, y - 16);
				c.lineTo(x0 + 13, y - 4);
				c.lineTo(x0 + 36, y - 40);
				c.stroke();
			}
			c.fillStyle = t.state === 'todo' ? 'rgba(39,56,107,0.55)' : ink;
			c.font = f(40, t.state === 'now' ? 700 : 500);
			const lines = wrap(c, `${i + 1}. ${t.text}`, x0 + 48, y, half - 210, 50);
			if (t.state === 'done') {
				c.strokeStyle = 'rgba(39,56,107,0.5)';
				c.lineWidth = 2.5;
				c.beginPath();
				c.moveTo(x0 + 48, y - 12);
				c.lineTo(x0 + 48 + Math.min(half - 210, c.measureText(`${i + 1}. ${t.text}`).width), y - 12);
				c.stroke();
			}
			y += 52 * lines + 12;
		});
		if (p.hint && !p.done) {
			c.fillStyle = pencil;
			c.font = f(36);
			wrap(c, p.hint, x0, Math.max(y + 40, PY - 170), half - 170, 46);
		}
		this.tex.needsUpdate = true;
	}

	update(dt: number) {
		this.t += dt;
		const target = this.open ? 1 : 0;
		this.k += (target - this.k) * Math.min(1, dt * 9);
		if (Math.abs(this.k - target) < 0.001) this.k = target;
		this.group.visible = this.k > 0.01;
		if (!this.group.visible) return;
		const s = this.k * this.k * (3 - 2 * this.k);
		const bob = Math.sin(this.t * 1.3) * 0.0025;
		this.group.position.set(0, -0.44 + (0.44 - 0.055) * s + bob, -0.33);
		this.group.rotation.set(-1.1 * (1 - s) - 0.2, 0, 0.03 * Math.sin(this.t * 0.7));
	}
}

function wrap(c: CanvasRenderingContext2D, text: string, x: number, y: number, max: number, lh: number) {
	const words = text.split(' ');
	let line = '';
	let n = 0;
	for (const w of words) {
		const test = line ? `${line} ${w}` : w;
		if (c.measureText(test).width > max && line) {
			c.fillText(line, x, y + n * lh);
			n++;
			line = w;
		} else line = test;
	}
	if (line) {
		c.fillText(line, x, y + n * lh);
		n++;
	}
	return n;
}
