import { SHEET_MIN_HEIGHT, SHEET_WIDTH, STICKER_BY_ID, stickerArt, type PlacedSticker, type StickerDef } from './stickers';

/**
 * Stickers on a note's sheet: picking one up, laying it down, peeling it off.
 * Plain DOM, driven by one requestAnimationFrame loop that runs only while
 * something moves; the React wrapper (NoteStickers) owns the album and the
 * saving. Ported from the prototype linked in vault/Prodotti/Studenti/Adesivi.md.
 *
 * Coordinates are sheet px: the 792px page before the sheet is zoomed to fit
 * the screen, so a sticker lands on the same spot on every device.
 *
 * Each sticker has a local frame, its w × h box. The anchor is the corner that
 * is lowest-left on screen at the current angle, the peel corner the one
 * opposite (setCorners); held, it hangs from its centre and turns about it.
 * Laying down: the anchor touches first and the rest follows a crease that
 * runs from the anchor to the peel corner (renderBands). Peeling: the fold of
 * the flashcards' PeelSticker, from the peel corner (renderPeel).
 */

type Pt = { x: number; y: number };
const DEG = Math.PI / 180;
const V = (x: number, y: number): Pt => ({ x, y });
const add = (a: Pt, b: Pt) => V(a.x + b.x, a.y + b.y);
const sub = (a: Pt, b: Pt) => V(a.x - b.x, a.y - b.y);
const mul = (a: Pt, k: number) => V(a.x * k, a.y * k);
const dot = (a: Pt, b: Pt) => a.x * b.x + a.y * b.y;
const rotV = (a: Pt, deg: number) => {
	const r = deg * DEG, c = Math.cos(r), s = Math.sin(r);
	return V(a.x * c - a.y * s, a.x * s + a.y * c);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpV = (a: Pt, b: Pt, t: number) => V(lerp(a.x, b.x, t), lerp(a.y, b.y, t));
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutBack = (t: number) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);

/** A polygon cut by the half-plane keep·(X − m)·n ≥ 0. */
function clip(poly: Pt[], m: Pt, n: Pt, keep: 1 | -1): Pt[] {
	const out: Pt[] = [];
	const side = (p: Pt) => keep * dot(sub(p, m), n);
	for (let i = 0; i < poly.length; i++) {
		const a = poly[i], b = poly[(i + 1) % poly.length];
		const sa = side(a), sb = side(b);
		if (sa >= 0) out.push(a);
		if (sa >= 0 !== sb >= 0) out.push(lerpV(a, b, sa / (sa - sb)));
	}
	return out;
}
const rectP = (w: number, h: number) => [V(0, 0), V(w, 0), V(w, h), V(0, h)];
const area = (poly: Pt[]) => Math.abs(poly.reduce((s, p, i) => { const q = poly[(i + 1) % poly.length]; return s + p.x * q.y - q.x * p.y; }, 0)) / 2;
const polygon = (poly: Pt[]) => (poly.length < 3 ? 'polygon(0 0,0 0,0 0)' : `polygon(${poly.map((p) => `${p.x.toFixed(2)}px ${p.y.toFixed(2)}px`).join(',')})`);
const matrix = (...v: number[]) => `matrix(${v.map((x) => x.toFixed(5)).join(',')})`;
/** x ↦ x + u (n·x) + t, as a CSS matrix. */
const affine = (u: Pt, n: Pt, t: Pt) => matrix(1 + u.x * n.x, u.y * n.x, u.x * n.y, 1 + u.y * n.y, t.x, t.y);
/** A gradient along n whose stops are distances from the line through m (as in PeelSticker). */
function gradient(w: number, h: number, m: Pt, n: Pt, stops: [string, number][]) {
	const theta = Math.atan2(n.x, -n.y);
	const length = Math.abs(w * Math.sin(theta)) + Math.abs(h * Math.cos(theta));
	const start = V(w / 2 - (n.x * length) / 2, h / 2 - (n.y * length) / 2);
	const at = dot(sub(m, start), n);
	return `linear-gradient(${theta}rad, ${stops.map(([c, d]) => `${c} ${(at + d).toFixed(2)}px`).join(', ')})`;
}

// Peel poses from PeelSticker, scaled to a smaller sticker (bottom-right frame, inward is negative).
const HOVER = V(-16, -14), PRESS = V(-20, -17), STRAIN = V(-26, -22), LAST = V(-32, -27);
const GIVE = 16, COMMIT = 0.45, FLING = 0.5, S0 = 9;

type Mode = 'hand' | 'placing' | 'stuck';
type Tween = { t0: number; ms: number; fn: (u: number) => void; done?: () => void; st: Sticker; key: string };

interface Sticker {
	id: string;
	d: StickerDef;
	w: number;
	h: number;
	L: number;
	c: Pt;
	el: HTMLDivElement;
	shadows: HTMLDivElement;
	sils: HTMLDivElement[];
	face: HTMLDivElement;
	shade: HTMLDivElement;
	gloss: HTMLDivElement;
	bands: { el: HTMLDivElement; tint: HTMLDivElement }[];
	flap: HTMLDivElement;
	cue: SVGSVGElement;
	cueG: SVGGElement;
	mode: Mode;
	/** World position of the grip g (a local point): the transform is P · R(rot) · scale · flip · (x − g). */
	P: Pt;
	target: Pt;
	rot: number;
	sway: number;
	swayV: number;
	g: Pt;
	/** The flip across a line through fo (relative to g) with normal fn, from −1 to 1 as it turns over. */
	f: number;
	fn: Pt;
	fo: Pt;
	/** 0 held in the air, 1 touching the paper. */
	k: number;
	/** How far along the diagonal from the anchor it is stuck down. */
	s: number;
	/** The peel corner's pull, in PeelSticker's bottom-right frame. */
	p: Pt;
	pop: number;
	pulse: number;
	wobT0: number;
	cueO: number;
	tw: Record<string, Tween>;
	z: number;
	dirty: boolean;
	leaving: boolean;
	finishing: boolean;
	ph: 'idle' | 'pressed' | 'dragging' | 'releasing' | 'leaving';
	C: Pt;
	A: Pt;
	n: Pt;
	a0: number;
	cx: number;
	cy: number;
	press: Pt;
	v: number;
	lastT: number;
	lastProj: number;
	far: number;
	start: Pt;
	last: { x: number; y: number; t: number };
	pv: number;
	gave: boolean;
	base: Pt;
	popT: number;
	popFrom: Pt;
	lastPt: Pt | null;
}

export interface BoardState {
	holding: StickerDef | null;
	placing: boolean;
	hovering: boolean;
}

export interface BoardOptions {
	initial: PlacedSticker[];
	onChange: (stickers: PlacedSticker[]) => void;
	onState: (state: BoardState) => void;
}

const vibrate = (pattern: number | number[]) => {
	try {
		navigator.vibrate?.(pattern);
	} catch {
		// Not every browser lets a page vibrate; the motion carries the feedback alone.
	}
};

export class StickerBoard {
	private all: Sticker[] = [];
	private tweens = new Set<Tween>();
	private held: Sticker | null = null;
	private active: { kind: 'place' | 'peel' | 'move'; st: Sticker; id: number } | null = null;
	private hoverSt: Sticker | null = null;
	private justStuck: Sticker | null = null;
	private gesture: { ids: number[]; a0: number; m0: Pt; rot0: number; P0: Pt } | null = null;
	private ptrs = new Map<number, Pt & { type: string }>();
	private lastType: string;
	private lastClient: Pt | null = null;
	private zTop = 1;
	private frameId = 0;
	private last = 0;
	private parts: { x: number; y: number; vx: number; vy: number; life: number; max: number; c: string; dash: boolean; r: number }[] = [];
	private ctx: CanvasRenderingContext2D | null;
	private dpr = 1;
	private coarse: boolean;
	private reduced: boolean;
	private resize: ResizeObserver;
	private gRot0 = 0;

	constructor(
		private sheet: HTMLElement,
		private layer: HTMLElement,
		private canvas: HTMLCanvasElement,
		private opts: BoardOptions
	) {
		this.coarse = matchMedia('(pointer: coarse)').matches;
		this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		this.lastType = this.coarse ? 'touch' : 'mouse';
		this.ctx = canvas.getContext('2d');
		for (const placed of opts.initial) {
			const d = STICKER_BY_ID.get(placed.sticker);
			if (!d) continue;
			const st = this.make(d, placed.id);
			st.rot = placed.r;
			this.setCorners(st);
			st.mode = 'stuck';
			st.g = st.A;
			st.P = add(V(placed.x, placed.y), rotV(sub(st.A, st.c), st.rot));
			st.z = ++this.zTop;
			this.render(st);
		}
		this.grow();
		this.resize = new ResizeObserver(() => this.sizeCanvas());
		this.resize.observe(sheet);
		this.sizeCanvas();
		sheet.addEventListener('pointerdown', this.onDown, true);
		window.addEventListener('pointermove', this.onMove);
		window.addEventListener('pointerup', this.onUp);
		window.addEventListener('pointercancel', this.onUp);
		window.addEventListener('keydown', this.onKey);
		window.addEventListener('scroll', this.onScroll, true);
		sheet.addEventListener('wheel', this.onWheel, { passive: false });
		sheet.addEventListener('gesturestart', this.onGestureStart as EventListener);
		sheet.addEventListener('gesturechange', this.onGestureChange as EventListener);
		this.emitState();
	}

	destroy() {
		cancelAnimationFrame(this.frameId);
		this.resize.disconnect();
		this.sheet.removeEventListener('pointerdown', this.onDown, true);
		window.removeEventListener('pointermove', this.onMove);
		window.removeEventListener('pointerup', this.onUp);
		window.removeEventListener('pointercancel', this.onUp);
		window.removeEventListener('keydown', this.onKey);
		window.removeEventListener('scroll', this.onScroll, true);
		this.sheet.removeEventListener('wheel', this.onWheel);
		this.sheet.removeEventListener('gesturestart', this.onGestureStart as EventListener);
		this.sheet.removeEventListener('gesturechange', this.onGestureChange as EventListener);
		this.sheet.classList.remove('is-holding');
		for (const st of this.all) st.el.remove();
	}

	/** Takes a sticker from the album into the hand, over the visible middle of the sheet (or under the mouse). */
	pick(stickerId: string) {
		const d = STICKER_BY_ID.get(stickerId);
		if (!d) return;
		if (this.held) this.putAway();
		const st = this.make(d, crypto.randomUUID());
		const r = this.sheet.getBoundingClientRect();
		const at = this.lastType === 'mouse' && this.lastClient ? this.lastClient : V((Math.max(r.left, 0) + Math.min(r.right, innerWidth)) / 2, (Math.max(r.top, 0) + Math.min(r.bottom, innerHeight)) / 2);
		st.mode = 'hand';
		st.P = this.clampPt(this.toBoard(at));
		st.target = st.P;
		st.rot = Math.random() * 16 - 8;
		st.g = st.c;
		st.k = 0;
		st.s = 0;
		st.pop = 0.6;
		st.z = 1000 + ++this.zTop;
		this.setCorners(st);
		this.tween(st, 'pop', 240, (u) => (st.pop = lerp(0.6, 1, easeOutBack(u))));
		this.tween(st, 'cue', 320, (u) => (st.cueO = 0.9 * u));
		this.held = st;
		// Typing must not go on under a sticker in hand: Q and E turn it, Escape puts it away.
		(document.activeElement as HTMLElement | null)?.blur?.();
		vibrate(4);
		this.emitState();
		this.kick();
	}

	/** The sticker in hand goes back to the album. One that came off the page is thereby removed. */
	putAway() {
		const st = this.held;
		if (!st) return;
		if (this.active?.st === st) this.active = null;
		this.held = null;
		st.leaving = true;
		const p0 = st.pop;
		this.tween(st, 'away', 180, (u) => {
			st.pop = lerp(p0, 0.5, easeOut(u));
			st.el.style.opacity = String(1 - u);
		}, () => this.remove(st));
		this.emitState();
	}

	/* ------------------------------------------------------------ building */

	private make(d: StickerDef, id: string): Sticker {
		const el = document.createElement('div');
		el.className = 'sticker';
		el.style.width = `${d.w}px`;
		el.style.height = `${d.h}px`;
		el.style.setProperty('--r', `${d.r}px`);
		const art = stickerArt(d);
		el.innerHTML =
			'<div class="sticker-shadows"><div class="sticker-sil"></div><div class="sticker-sil"></div><div class="sticker-sil"></div></div>' +
			`<div class="sticker-face-wrap"><div class="sticker-face">${art}<div class="sticker-shade"></div><div class="sticker-gloss"></div><div class="sticker-back"></div></div></div>` +
			[0, 1, 2].map(() => `<div class="sticker-band">${art}<div class="sticker-tint"></div><div class="sticker-back"></div></div>`).join('') +
			'<div class="sticker-flap-wrap"><div class="sticker-flap"></div></div>' +
			`<svg class="sticker-cue" viewBox="0 0 ${d.w} ${d.h}" width="${d.w}" height="${d.h}" aria-hidden="true"><g><path class="halo" d="M10 0H30M26 -5L33 0L26 5"/><path class="ln dash" d="M10 0H29"/><path class="ln" d="M26 -5L33 0L26 5"/></g></svg>`;
		this.layer.appendChild(el);
		const q = <T extends Element>(s: string) => el.querySelector(s) as T;
		const qa = <T extends Element>(s: string) => Array.from(el.querySelectorAll(s)) as T[];
		const L = Math.hypot(d.w, d.h);
		const st: Sticker = {
			id, d, w: d.w, h: d.h, L, c: V(d.w / 2, d.h / 2), el,
			shadows: q('.sticker-shadows'), sils: qa('.sticker-sil'), face: q('.sticker-face'), shade: q('.sticker-shade'), gloss: q('.sticker-gloss'),
			bands: qa<HTMLDivElement>('.sticker-band').map((b) => ({ el: b, tint: b.querySelector('.sticker-tint') as HTMLDivElement })),
			flap: q('.sticker-flap'), cue: q('.sticker-cue'), cueG: q('.sticker-cue g'),
			mode: 'hand', P: V(0, 0), target: V(0, 0), rot: 0, sway: 0, swayV: 0, g: V(d.w / 2, d.h / 2), f: 1, fn: V(1, 0), fo: V(0, 0),
			k: 1, s: L, p: this.restP(), pop: 1, pulse: 0, wobT0: 0, cueO: 0, tw: {}, z: 0, dirty: true, leaving: false, finishing: false, ph: 'idle',
			C: V(d.w, 0), A: V(0, d.h), n: V(1, 0), a0: 0, cx: 1, cy: 0,
			press: V(0, 0), v: 0, lastT: 0, lastProj: 0, far: 0, start: V(0, 0), last: { x: 0, y: 0, t: 0 }, pv: 0, gave: false, base: PRESS, popT: 0, popFrom: V(0, 0), lastPt: null
		};
		this.setCorners(st);
		this.all.push(st);
		return st;
	}

	private remove(st: Sticker) {
		st.el.remove();
		this.all = this.all.filter((s) => s !== st);
		for (const t of Object.values(st.tw)) this.tweens.delete(t);
		this.emitState();
	}

	/** Anchor lowest-left on screen, peel corner top-right, for the current angle. */
	private setCorners(st: Sticker) {
		let C = st.C, best = -Infinity;
		for (const k of rectP(st.w, st.h)) {
			const r = rotV(sub(k, st.c), st.rot + st.sway);
			if (r.x - r.y > best) { best = r.x - r.y; C = k; }
		}
		if (st.cueG.getAttribute('transform') && st.C.x === C.x && st.C.y === C.y) return;
		st.C = C;
		st.A = V(st.w - C.x, st.h - C.y);
		st.n = mul(sub(st.C, st.A), 1 / st.L);
		st.a0 = dot(st.A, st.n);
		st.cx = C.x ? 1 : 0;
		st.cy = C.y ? 1 : 0;
		st.cueG.setAttribute('transform', `translate(${C.x} ${C.y}) rotate(${(Math.atan2(st.n.y, st.n.x) / DEG).toFixed(2)})`);
	}
	/** Between PeelSticker's bottom-right frame and the peel corner's (the same flip both ways). */
	private mir(st: Sticker, v: Pt) { return V(st.cx ? v.x : -v.x, st.cy ? v.y : -v.y); }
	private restP() { return this.coarse ? V(-12, -12) : V(-0.6, -0.6); }

	/* --------------------------------------------------------- transforms */

	private scOf(st: Sticker) { return (1 + 0.035 * (1 - st.k)) * st.pop * (1 + st.pulse); }
	private flipApply(st: Sticker, v: Pt, inv = false) {
		if (st.f === 1) return v;
		const f = inv ? 1 / (Math.abs(st.f) < 0.05 ? 0.05 : st.f) : st.f;
		return add(v, mul(st.fn, dot(sub(v, st.fo), st.fn) * (f - 1)));
	}
	private toWorld(st: Sticker, lp: Pt) {
		let v = sub(lp, st.g);
		v = this.flipApply(st, v);
		v = mul(v, this.scOf(st));
		v = rotV(v, st.rot + st.sway);
		return add(v, st.P);
	}
	private toLocal(st: Sticker, wp: Pt) {
		let v = sub(wp, st.P);
		v = rotV(v, -(st.rot + st.sway));
		v = mul(v, 1 / this.scOf(st));
		v = this.flipApply(st, v, true);
		return add(v, st.g);
	}
	private hit(st: Sticker, pt: Pt, m = 0) {
		const l = this.toLocal(st, pt);
		return l.x >= -m && l.y >= -m && l.x <= st.w + m && l.y <= st.h + m;
	}
	private topStuckAt(pt: Pt) {
		return this.all.filter((s) => s.mode === 'stuck').sort((a, b) => b.z - a.z).find((s) => this.hit(s, pt));
	}
	private scale() { return this.sheet.getBoundingClientRect().width / SHEET_WIDTH || 1; }
	private toBoard(client: Pt) {
		const r = this.sheet.getBoundingClientRect(), k = r.width / SHEET_WIDTH || 1;
		return V((client.x - r.left) / k, (client.y - r.top) / k);
	}
	private clampPt(p: Pt) {
		const h = this.sheet.getBoundingClientRect().height / this.scale();
		return V(clamp(p.x, 6, SHEET_WIDTH - 6), clamp(p.y, 6, h - 6));
	}

	/* ----------------------------------------------------------- rendering */

	private render(st: Sticker) {
		const el = st.el;
		el.dataset.mode = st.mode;
		const F = st.f === 1 ? '' : affine(mul(st.fn, st.f - 1), st.fn, mul(st.fn, -(st.f - 1) * dot(st.fo, st.fn)));
		el.style.transform = `translate(${st.P.x.toFixed(2)}px,${st.P.y.toFixed(2)}px) rotate(${(st.rot + st.sway).toFixed(3)}deg) scale(${this.scOf(st).toFixed(4)}) ${F} translate(${-st.g.x}px,${-st.g.y}px)`;
		el.style.zIndex = String(st.z);
		el.classList.toggle('show-back', st.f < 0);
		if (st.mode === 'hand') this.setCorners(st);
		if (st.mode === 'stuck') this.renderPeel(st);
		else this.renderBands(st);
	}

	/**
	 * Held or being laid down. The part already stuck (up to the crease at
	 * distance s from the anchor) is flat; the rest rises in three bands at
	 * growing angles, a gentle curve. Each band is the sticker foreshortened
	 * along the diagonal; its shadow is the same band pushed along the light by
	 * its height, and the shadows are blurred together so the bands leave no seams.
	 */
	private renderBands(st: Sticker) {
		const { w, h, L, n } = st;
		const R = rectP(w, h);
		const k = st.k, s = clamp(st.s, 0, L), prog = s / L;
		const a = 22 * DEG * lerp(0.3, 1, k) * (1 - 0.5 * prog);
		const angles = [0.45 * a, a, 1.5 * a];
		const widths = [0.16 * L, 0.28 * L, Infinity];
		const Lv = rotV(V(0.28, 0.62), -(st.rot + st.sway));
		st.face.style.clipPath = s <= 0.5 ? 'polygon(0 0,0 0,0 0)' : polygon(clip(R, add(st.A, mul(n, s + 0.4)), n, -1));
		st.shade.style.backgroundImage = 'none';
		let d0 = s, P0 = s, H = 20 * (1 - k);
		for (let i = 0; i < 3; i++) {
			const c = Math.cos(angles[i]), sn = Math.sin(angles[i]), b = widths[i];
			let poly = clip(R, add(st.A, mul(n, d0 - 0.6)), n, 1);
			if (isFinite(b)) poly = clip(poly, add(st.A, mul(n, d0 + b)), n, -1);
			const cp = polygon(poly);
			const u = mul(n, c - 1), t = mul(n, P0 - d0 * c - (c - 1) * st.a0);
			st.bands[i].el.style.clipPath = cp;
			st.bands[i].el.style.transform = affine(u, n, t);
			st.sils[i].style.clipPath = cp;
			st.sils[i].style.transform = affine(add(u, mul(Lv, sn)), n, add(t, mul(Lv, H - d0 * sn - sn * st.a0)));
			st.bands[i].tint.style.background =
				i === 0
					? gradient(w, h, add(st.A, mul(n, d0)), n, [['rgba(20,24,40,.16)', 0], ['rgba(20,24,40,0)', Math.min(b, 30)]])
					: i === 1 ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.14)';
			if (isFinite(b)) { P0 += b * c; H += b * sn; d0 += b; }
		}
		st.shadows.style.filter = `blur(${(1.5 + 4 * (1 - k)).toFixed(2)}px)`;
		st.cue.style.opacity = st.cueO.toFixed(3);
	}

	/** Stuck down: PeelSticker's fold, from the peel corner. */
	private renderPeel(st: Sticker) {
		const { w, h } = st;
		const q = this.mir(st, st.p);
		const len = Math.hypot(q.x, q.y) || 0.001;
		const n = V(-q.x / len, -q.y / len);
		const m = add(st.C, mul(q, 0.5));
		const back = (d: number) => V(m.x - n.x * d, m.y - n.y * d);
		st.face.style.clipPath = polygon(clip(rectP(w, h), back(0.5), n, -1));
		st.shade.style.backgroundImage = gradient(w, h, m, n, [['transparent', -Math.min(22, len)], ['rgba(0,0,0,.26)', 0]]);
		const kk = 2 * dot(m, n);
		st.flap.style.transform = matrix(1 - 2 * n.x * n.x, -2 * n.x * n.y, -2 * n.x * n.y, 1 - 2 * n.y * n.y, kk * n.x, kk * n.y);
		st.flap.style.clipPath = polygon(clip(rectP(w, h), back(1), n, 1));
		st.flap.style.backgroundImage = gradient(w, h, m, n, [['rgba(0,0,0,.16)', 0], ['rgba(255,255,255,.9)', 5], ['rgba(255,255,255,0)', 26], ['rgba(0,0,0,.05)', Math.max(60, len)]]);
	}
	private peeled(st: Sticker, p: Pt) {
		const q = this.mir(st, p), len = Math.hypot(q.x, q.y) || 0.001;
		const n = V(-q.x / len, -q.y / len);
		return 1 - area(clip(rectP(st.w, st.h), add(st.C, mul(q, 0.5)), n, -1)) / (st.w * st.h);
	}

	/* -------------------------------------------------------------- tweens */

	private tween(st: Sticker, key: string, ms: number, fn: (u: number) => void, done?: () => void) {
		if (st.tw[key]) this.tweens.delete(st.tw[key]);
		const t: Tween = { t0: performance.now(), ms: Math.max(1, ms), fn, done, st, key };
		this.tweens.add(t);
		st.tw[key] = t;
		this.kick();
	}
	private cancel(st: Sticker, key: string) {
		const t = st.tw[key];
		if (t) { this.tweens.delete(t); delete st.tw[key]; }
	}

	private kick() {
		if (this.frameId) return;
		this.last = performance.now();
		this.frameId = requestAnimationFrame(this.frame);
	}

	private frame = (now: number) => {
		this.frameId = 0;
		const dt = Math.min(40, now - this.last);
		this.last = now;
		for (const t of [...this.tweens]) {
			const u = Math.min(1, (now - t.t0) / t.ms);
			t.fn(u);
			t.st.dirty = true;
			if (u >= 1) {
				this.tweens.delete(t);
				if (t.st.tw[t.key] === t) delete t.st.tw[t.key];
				t.done?.();
			}
		}
		const held = this.held;
		if (held && held.mode === 'hand' && !held.leaving && !held.tw.flip) this.stepHand(held, dt);
		let wobbling = false;
		for (const st of this.all) {
			if (st.wobT0) {
				const t = now - st.wobT0;
				if (t > 900) { st.wobT0 = 0; st.pulse = 0; }
				else { st.pulse = 0.045 * Math.sin((t / 190) * Math.PI * 2) * Math.exp(-t / 260); wobbling = true; }
				st.dirty = true;
			}
			if (st.mode !== 'stuck' || st.dirty) { this.render(st); st.dirty = false; }
		}
		const drew = this.drawParts(dt);
		if (this.tweens.size || this.held || this.active || wobbling || drew) this.frameId = requestAnimationFrame(this.frame);
	};

	/** The held sticker follows the pointer with a little lag, and its sway springs back to rest. */
	private stepHand(st: Sticker, dt: number) {
		const dtN = dt / 16.667;
		st.P = lerpV(st.P, st.target, 1 - Math.pow(1 - 0.42, dtN));
		st.swayV += (-st.sway * 0.12 - st.swayV * 0.2) * dtN;
		st.sway += st.swayV * dtN;
	}

	/* --------------------------------------------------------------- flows */

	private startPlacing(st: Sticker, pt: Pt, id: number) {
		// The anchor corner of the moment goes down where it is now: bake the sway and the flip into the pose.
		this.cancel(st, 'flip');
		this.cancel(st, 'k');
		const c0 = this.toWorld(st, st.c);
		st.rot += st.sway;
		st.sway = 0; st.swayV = 0; st.f = 1; st.wobT0 = 0; st.pulse = 0;
		st.P = c0; st.g = st.c;
		this.setCorners(st);
		st.P = this.toWorld(st, st.A);
		st.g = st.A;
		st.target = st.P;
		st.mode = 'placing'; st.finishing = false; st.press = pt; st.s = S0; st.v = 0; st.lastT = performance.now(); st.lastProj = 0; st.cueO = 0.9; st.far = 0;
		this.tween(st, 'k', 110, (u) => (st.k = easeOut(u)));
		this.active = { kind: 'place', st, id };
		vibrate(6);
		this.emitState();
	}
	private updatePlacing(st: Sticker, pt: Pt) {
		const proj = dot(rotV(sub(pt, st.press), -st.rot), st.n);
		const now = performance.now(), dt = Math.max(1, now - st.lastT);
		st.v = 0.7 * st.v + 0.3 * ((proj - st.lastProj) / dt);
		st.lastProj = proj;
		st.lastT = now;
		st.far = Math.max(st.far, Math.hypot(pt.x - st.press.x, pt.y - st.press.y));
		st.s = Math.max(st.s, S0 + proj);
		st.cueO = 0.9 * Math.max(0, 1 - st.s / (st.L * 0.35));
		if (st.s >= st.L + 6) this.complete(st);
	}
	private endPlacing(st: Sticker) {
		const from = st.s;
		if (st.far < 5) {
			// A click: it smooths itself down, slower than a flick so the gesture still shows.
			st.finishing = true;
			this.tween(st, 's', 360, (u) => (st.s = lerp(from, st.L, easeInOut(u))), () => this.complete(st));
		} else if (from / st.L >= 0.55 || st.v > 0.45) {
			st.finishing = true;
			this.tween(st, 's', clamp((st.L - from) / 1.1, 80, 240), (u) => (st.s = lerp(from, st.L, easeOut(u))), () => this.complete(st));
		} else this.backToHand(st);
	}
	private backToHand(st: Sticker) {
		st.mode = 'hand';
		st.finishing = false;
		st.P = this.toWorld(st, st.c);
		st.g = st.c;
		const s0 = st.s, k0 = st.k;
		this.cancel(st, 's');
		this.tween(st, 'k', 170, (u) => { st.k = k0 * (1 - easeOut(u)); st.s = lerp(s0, 0, easeOut(u)); });
		st.cueO = 0.9;
		st.target = this.lastType === 'mouse' && this.lastClient ? this.clampPt(this.toBoard(this.lastClient)) : st.P;
		vibrate(4);
		this.emitState();
	}
	private complete(st: Sticker) {
		this.cancel(st, 's');
		this.cancel(st, 'k');
		st.mode = 'stuck'; st.k = 1; st.s = st.L; st.finishing = false; st.p = this.restP(); st.cueO = 0; st.ph = 'idle';
		st.z = ++this.zTop;
		st.dirty = true;
		if (this.held === st) this.held = null;
		if (this.active?.st === st) this.active = null;
		this.justStuck = st;
		const n = st.n;
		this.tween(st, 'gloss', 560, (u) => {
			const t = lerp(-30, st.L + 30, easeOut(u));
			st.gloss.style.backgroundImage = gradient(st.w, st.h, add(st.A, mul(n, t)), n, [['rgba(255,255,255,0)', -24], ['rgba(255,255,255,.5)', 0], ['rgba(255,255,255,0)', 24]]);
		}, () => (st.gloss.style.backgroundImage = 'none'));
		this.sparkle(st);
		vibrate(12);
		this.changed();
		this.emitState();
	}

	private startPeel(st: Sticker, pt: Pt, id: number) {
		st.ph = 'pressed'; st.lastPt = null; st.start = pt; st.last = { x: pt.x, y: pt.y, t: performance.now() }; st.pv = 0; st.gave = false; st.base = PRESS;
		const from = st.p;
		this.tween(st, 'p', 420, (u) => (st.p = u < 0.3 ? lerpV(from, PRESS, easeInOut(u / 0.3)) : lerpV(PRESS, STRAIN, easeOut((u - 0.3) / 0.7))));
		st.z = ++this.zTop;
		this.active = { kind: 'peel', st, id };
		this.emitState();
	}
	private updatePeel(st: Sticker, pt: Pt) {
		const raw = this.mir(st, rotV(sub(pt, st.start), -st.rot));
		st.lastPt = pt;
		if (st.ph === 'pressed') {
			if (Math.hypot(raw.x, raw.y) < 5) return;
			st.ph = 'dragging';
			this.cancel(st, 'p');
		}
		if (st.ph !== 'dragging') return;
		const d = V(Math.min(8, raw.x), Math.min(8, raw.y));
		const pull = Math.hypot(d.x, d.y);
		const now = performance.now(), dt = Math.max(1, now - st.last.t);
		const step = this.mir(st, rotV(V(pt.x - st.last.x, pt.y - st.last.y), -st.rot));
		const along = Math.hypot(st.p.x, st.p.y) || 1;
		st.pv = 0.8 * st.pv + (0.2 * dot(step, V(st.p.x / along, st.p.y / along))) / dt;
		st.last = { x: pt.x, y: pt.y, t: now };
		// Below GIVE the glue holds and the corner follows at under half the pull; past it, one to one.
		if (!st.gave && pull >= GIVE) { st.gave = true; st.popT = now; st.popFrom = st.p; vibrate(8); }
		const target = st.gave ? add(st.base, d) : add(st.base, mul(d, 0.45));
		const tg = V(Math.min(-1, target.x), Math.min(-1, target.y));
		st.p = st.gave && now - st.popT < 90 ? lerpV(st.popFrom, tg, easeOut((now - st.popT) / 90)) : tg;
		st.dirty = true;
		this.kick();
		if (this.peeled(st, st.p) >= 0.97) this.detach(st);
	}
	private endPeel(st: Sticker) {
		if (st.ph === 'pressed') {
			// A click: the corner strains against the glue a moment, then the whole sticker comes off.
			st.ph = 'releasing';
			const from = st.p;
			this.tween(st, 'p', 170, (u) => (st.p = lerpV(from, LAST, easeInOut(u))), () => this.finishPeel(st, 420));
			return;
		}
		if (st.ph !== 'dragging') return;
		if (this.peeled(st, st.p) >= COMMIT || st.pv >= FLING) this.finishPeel(st);
		else this.stickBack(st);
	}
	private stickBack(st: Sticker) {
		st.ph = 'idle';
		const from = st.p, rest = this.hoverSt === st ? HOVER : this.restP(), over = mul(rest, 0.55);
		this.tween(st, 'p', 260, (u) => (st.p = u < 0.7 ? lerpV(from, over, easeOut(u / 0.7)) : lerpV(over, rest, easeInOut((u - 0.7) / 0.3))));
		this.emitState();
	}
	private finishPeel(st: Sticker, ms = 220) {
		st.ph = 'leaving';
		const from = st.p, len = Math.hypot(from.x, from.y) || 1, v = V(from.x / len, from.y / len);
		const reach = 2 * Math.max(...[V(-st.w, -st.h), V(-st.w, 0), V(0, -st.h)].map((c) => dot(c, v))) + 6;
		const to = mul(v, reach);
		this.tween(st, 'p', ms, (u) => (st.p = lerpV(from, to, easeOut(u))), () => this.detach(st));
	}
	/**
	 * Off the page and into the hand. The flap is the sticker's back folded over
	 * the crease; the mirror across the crease runs from −1 to 1, so the fold
	 * opens back the way it came and the face comes up where the sticker was,
	 * while it travels to the pointer and lifts off the paper.
	 */
	private detach(st: Sticker) {
		this.cancel(st, 'p');
		const q = this.mir(st, st.p), len = Math.hypot(q.x, q.y) || 1;
		const n = V(-q.x / len, -q.y / len);
		const m = add(st.C, mul(q, 0.5));
		const from = this.toWorld(st, st.c);
		const pulled = st.lastPt ?? from;
		if (this.held && this.held !== st) this.putAway();
		st.mode = 'hand'; st.ph = 'idle'; st.P = from; st.g = st.c; st.fn = n; st.fo = sub(m, st.c);
		st.f = this.reduced ? 1 : -1; st.k = 1; st.s = st.L; st.cueO = 0; st.p = this.restP();
		st.target = this.clampPt(this.lastType === 'mouse' && this.lastClient ? this.toBoard(this.lastClient) : pulled);
		st.z = 1000 + ++this.zTop;
		this.held = st;
		if (this.active?.st === st) this.active = null;
		if (this.hoverSt === st) this.hoverSt = null;
		this.tween(st, 'flip', this.reduced ? 1 : 340, (u) => {
			const e = easeInOut(u);
			if (!this.reduced) st.f = lerp(-1, 1, e);
			st.P = lerpV(from, st.target, e);
			st.k = 1 - e;
			st.s = st.L * (1 - e);
		}, () => {
			st.f = 1;
			if (!this.reduced) { st.wobT0 = performance.now(); st.swayV += 3.2; }
			this.tween(st, 'cue', 400, (u) => (st.cueO = 0.9 * u));
		});
		vibrate([6, 30, 6]);
		this.changed();
		this.emitState();
	}

	/* -------------------------------------------------------------- input */

	private board(e: PointerEvent) { return this.toBoard(V(e.clientX, e.clientY)); }

	private onDown = (e: PointerEvent) => {
		this.lastType = e.pointerType;
		const pt = this.board(e);
		this.ptrs.set(e.pointerId, { ...pt, type: e.pointerType });
		const held = this.held;
		if (!held) {
			if (this.active || (e.pointerType === 'mouse' && e.button !== 0)) return;
			const st = this.topStuckAt(pt);
			if (!st) return; // not ours: the text gets the click
			e.preventDefault();
			e.stopPropagation();
			this.justStuck = null;
			this.startPeel(st, pt, e.pointerId);
			return;
		}
		e.preventDefault();
		e.stopPropagation();
		if (e.pointerType !== 'mouse' && this.ptrs.size >= 2 && this.startGesture()) return;
		if (this.active || this.gesture) return;
		if (e.pointerType === 'mouse' && e.button !== 0) return;
		if (held.mode !== 'hand' || held.leaving) return;
		if (e.pointerType === 'mouse' || this.hit(held, pt, 14)) this.startPlacing(held, pt, e.pointerId);
		else {
			// A touch on the paper, away from the sticker: a tap moves it there, a drag scrolls the note.
			this.active = { kind: 'move', st: held, id: e.pointerId };
		}
	};

	private onMove = (e: PointerEvent) => {
		const pt = this.board(e);
		if (this.ptrs.has(e.pointerId)) this.ptrs.set(e.pointerId, { ...pt, type: e.pointerType });
		if (e.pointerType === 'mouse') { this.lastClient = V(e.clientX, e.clientY); this.lastType = 'mouse'; }
		if (this.gesture) { this.updateGesture(); return; }
		const a = this.active;
		if (a && a.id === e.pointerId) {
			if (a.kind === 'place') this.updatePlacing(a.st, pt);
			else if (a.kind === 'peel') this.updatePeel(a.st, pt);
			return;
		}
		if (e.pointerType !== 'mouse') return;
		if (this.held && this.held.mode === 'hand' && !this.held.leaving) this.held.target = this.clampPt(pt);
		else this.updateHover(pt);
	};

	private onUp = (e: PointerEvent) => {
		this.ptrs.delete(e.pointerId);
		if (this.gesture) {
			if (this.gesture.ids.includes(e.pointerId)) this.gesture = null;
			return;
		}
		const a = this.active;
		if (!a || a.id !== e.pointerId) return;
		this.active = null;
		if (a.kind === 'move' && e.type === 'pointerup' && this.held === a.st) a.st.target = this.clampPt(this.board(e));
		else if (a.kind === 'place' && a.st.mode === 'placing') this.endPlacing(a.st);
		else if (a.kind === 'peel') this.endPeel(a.st);
		this.emitState();
	};

	private onKey = (e: KeyboardEvent) => {
		const held = this.held;
		if (!held) return;
		if (e.key === 'Escape') { e.preventDefault(); this.putAway(); }
		else if (held.mode === 'hand' && (e.key === 'q' || e.key === 'Q')) { e.preventDefault(); held.rot -= 7.5; this.kick(); }
		else if (held.mode === 'hand' && (e.key === 'e' || e.key === 'E')) { e.preventDefault(); held.rot += 7.5; this.kick(); }
	};

	/** The page scrolls under a held sticker: it stays under the mouse. */
	private onScroll = () => {
		if (this.held?.mode === 'hand' && this.lastType === 'mouse' && this.lastClient) this.held.target = this.clampPt(this.toBoard(this.lastClient));
	};

	private onWheel = (e: WheelEvent) => {
		const held = this.held;
		if (!held || held.mode !== 'hand') return;
		e.preventDefault();
		let dy = e.deltaY * (e.deltaMode === 1 ? 16 : 1);
		if (!dy && e.shiftKey) dy = e.deltaX;
		held.rot += clamp(dy * 0.12, -12, 12);
		this.kick();
	};

	// Safari on the Mac: the trackpad's two-finger rotation. Ignored while fingers are on a touch screen.
	private onGestureStart = (e: Event & { rotation?: number }) => {
		if (!this.held || this.ptrs.size) return;
		e.preventDefault();
		this.gRot0 = this.held.rot;
	};
	private onGestureChange = (e: Event & { rotation?: number }) => {
		if (!this.held || this.ptrs.size || this.held.mode !== 'hand') return;
		e.preventDefault();
		this.held.rot = this.gRot0 + (e.rotation ?? 0);
		this.kick();
	};

	private startGesture() {
		const touches = [...this.ptrs.entries()].filter(([, p]) => p.type !== 'mouse');
		const held = this.held;
		if (touches.length < 2 || !held || held.finishing) return false;
		if (held.mode === 'placing') this.backToHand(held);
		const [[ia, a], [ib, b]] = touches;
		this.gesture = { ids: [ia, ib], a0: Math.atan2(b.y - a.y, b.x - a.x) / DEG, m0: mul(add(a, b), 0.5), rot0: held.rot, P0: held.target };
		this.active = null;
		return true;
	}
	private updateGesture() {
		const g = this.gesture, held = this.held;
		if (!g || !held) return;
		const a = this.ptrs.get(g.ids[0]), b = this.ptrs.get(g.ids[1]);
		if (!a || !b) return;
		let da = Math.atan2(b.y - a.y, b.x - a.x) / DEG - g.a0;
		da = ((da + 540) % 360) - 180;
		held.rot = g.rot0 + da;
		held.target = this.clampPt(add(g.P0, sub(mul(add(a, b), 0.5), g.m0)));
		this.kick();
	}

	private updateHover(pt: Pt) {
		let st = this.active ? undefined : this.topStuckAt(pt);
		if (st && st === this.justStuck) st = undefined;
		else if (st !== this.justStuck) this.justStuck = null;
		if ((st ?? null) === this.hoverSt) return;
		const old = this.hoverSt;
		if (old && old.ph === 'idle') {
			const from = old.p;
			this.tween(old, 'p', 260, (u) => (old.p = lerpV(from, this.restP(), easeOut(u))));
		}
		this.hoverSt = st ?? null;
		if (st && !this.reduced) {
			const from = st.p;
			this.tween(st, 'p', 220, (u) => (st.p = lerpV(from, HOVER, easeOut(u))));
		}
		this.emitState();
	}

	/* ------------------------------------------------------------ outputs */

	private emitState() {
		this.sheet.classList.toggle('is-holding', !!this.held);
		this.sheet.dataset.stickerCursor = this.held ? (this.held.mode === 'placing' || this.lastType !== 'mouse' ? 'grabbing' : 'none') : this.active ? 'grabbing' : '';
		this.opts.onState({ holding: this.held?.d ?? null, placing: this.held?.mode === 'placing', hovering: !!this.hoverSt });
		this.kick();
	}

	/** The stuck stickers as saved: centre on the sheet and rotation. */
	private changed() {
		const out: PlacedSticker[] = this.all
			.filter((s) => s.mode === 'stuck')
			.sort((a, b) => a.z - b.z)
			.map((s) => {
				const c = this.toWorld(s, s.c);
				const r = ((((s.rot + 180) % 360) + 360) % 360) - 180;
				return { id: s.id, sticker: s.d.id, x: Math.round(c.x * 10) / 10, y: Math.round(c.y * 10) / 10, r: Math.round(r * 10) / 10 };
			});
		this.grow();
		this.opts.onChange(out);
	}

	/** The sheet is at least an A4 page, and long enough for its lowest sticker. */
	private grow() {
		let bottom = 0;
		for (const s of this.all) if (s.mode === 'stuck') bottom = Math.max(bottom, this.toWorld(s, s.c).y + s.L / 2);
		this.sheet.style.minHeight = `${Math.max(SHEET_MIN_HEIGHT, Math.ceil(bottom + 44))}px`;
	}

	private sizeCanvas() {
		this.dpr = Math.min(1.5, window.devicePixelRatio || 1);
		const h = this.sheet.getBoundingClientRect().height / this.scale();
		this.canvas.width = Math.round(SHEET_WIDTH * this.dpr);
		this.canvas.height = Math.round(h * this.dpr);
		this.ctx?.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
	}

	/** A light spray of pen flecks from the last edges to go down. */
	private sparkle(st: Sticker) {
		if (this.reduced) return;
		const cols = ['#1b1e27', '#c0352f', '#4f7fc0', st.d.accent];
		for (let i = 0; i < 16; i++) {
			const t = 0.5 + 0.5 * Math.random();
			const horizontal = Math.random() < 0.5;
			const lp = horizontal ? V(lerp(st.A.x, st.C.x, t), st.C.y) : V(st.C.x, lerp(st.A.y, st.C.y, t));
			const nl = horizontal ? V(0, st.cy ? 1 : -1) : V(st.cx ? 1 : -1, 0);
			const wp = this.toWorld(st, lp);
			const nw = rotV(nl, st.rot);
			const ang = Math.atan2(nw.y, nw.x) + (Math.random() - 0.5) * 1.4;
			const sp = 0.05 + Math.random() * 0.14;
			this.parts.push({ x: wp.x, y: wp.y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 0, max: 380 + Math.random() * 280, c: cols[i % cols.length], dash: Math.random() < 0.5, r: 1 + Math.random() * 1.3 });
		}
	}
	/** Draws the flecks; false once there is nothing left to clear. */
	private drawParts(dt: number) {
		const ctx = this.ctx;
		if (!ctx) return false;
		if (!this.parts.length) return false;
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (let i = this.parts.length - 1; i >= 0; i--) {
			const p = this.parts[i];
			p.life += dt;
			if (p.life >= p.max) { this.parts.splice(i, 1); continue; }
			const drag = Math.pow(0.92, dt / 16.67);
			p.vx *= drag; p.vy *= drag; p.x += p.vx * dt; p.y += p.vy * dt;
			ctx.globalAlpha = 1 - Math.pow(p.life / p.max, 2);
			ctx.strokeStyle = ctx.fillStyle = p.c;
			if (p.dash) {
				const l = Math.hypot(p.vx, p.vy) || 1;
				ctx.lineWidth = 1.3;
				ctx.lineCap = 'round';
				ctx.beginPath();
				ctx.moveTo(p.x, p.y);
				ctx.lineTo(p.x - (p.vx / l) * 5, p.y - (p.vy / l) * 5);
				ctx.stroke();
			} else {
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fill();
			}
		}
		ctx.globalAlpha = 1;
		if (!this.parts.length) ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		return true;
	}
}
