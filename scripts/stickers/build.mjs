#!/usr/bin/env node
/**
 * Builds the sticker catalog from stickers/ (see stickers/STILE.md):
 * checks every source SVG, turns its text into outlines with the site's fonts and KaTeX's, and writes
 *   public/stickers/<id>.svg              the files the site serves,
 *   src/lib/zaino/sticker-catalog.json    the index the site reads,
 *   stickers/foglio.html                  the proof sheet with every sticker (not committed).
 *
 *   npm run stickers              build
 *   npm run stickers -- --png     build, and take a picture of the proof sheet (stickers/foglio.png)
 *   npm run stickers -- --check   fail if the committed output is not what the sources give
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import opentype from 'opentype.js';
import sharp from 'sharp';

const ROOT = new URL('../../', import.meta.url).pathname;
const SRC = join(ROOT, 'stickers');
const OUT = join(ROOT, 'public/stickers');
const CATALOG = join(ROOT, 'src/lib/zaino/sticker-catalog.json');
const SHEET = join(SRC, 'foglio.html');
const CHECK = process.argv.includes('--check');
const SVG_NS = 'http://www.w3.org/2000/svg';

/* ------------------------------------------------------------------ fonts */

const fontCache = new Map();
function font(path) {
	if (!fontCache.has(path)) {
		const b = readFileSync(join(ROOT, 'node_modules', path));
		fontCache.set(path, opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)));
	}
	return fontCache.get(path);
}
const KATEX = (name) => `katex/dist/fonts/KaTeX_${name}.ttf`;
const FRAUNCES = (w, s) => `@fontsource/fraunces/files/fraunces-latin-${w}-${s}.woff`;
const MONO = (w) => `@fontsource/jetbrains-mono/files/jetbrains-mono-latin-${w}-normal.woff`;

/** The fonts to try for a character, in order: the family's, then KaTeX's for the maths. */
function fontsFor({ family, style, weight }) {
	const bold = weight >= 600;
	const italic = style === 'italic';
	const katex = italic ? [KATEX(bold ? 'Math-BoldItalic' : 'Math-Italic'), KATEX(bold ? 'Main-BoldItalic' : 'Main-Italic'), KATEX('Main-Regular')] : [KATEX(bold ? 'Main-Bold' : 'Main-Regular'), KATEX('Math-Italic')];
	const own = {
		serif: [FRAUNCES(bold ? 600 : 400, italic ? 'italic' : 'normal')],
		mono: [MONO(weight >= 600 ? 600 : weight >= 500 ? 500 : 400)],
		math: [],
		ams: [KATEX('AMS-Regular')]
	}[family];
	if (!own) throw new Error(`font-family "${family}" sconosciuta: usa serif, mono, math o ams`);
	return [...own, ...katex, KATEX('AMS-Regular')];
}

/** Blackboard letters live in KaTeX's AMS font as plain capitals. */
const BLACKBOARD = { ℕ: 'N', ℤ: 'Z', ℚ: 'Q', ℝ: 'R', ℂ: 'C' };
/** Negated relations are drawn as KaTeX draws them: the relation with a slash over it. */
const NEGATED = { '≠': '=', '∉': '∈' };

/** SVG path data from opentype's commands. Its own toPathData prints some floats (48.00000000000001) as NaN. */
const n2 = (v) => String(Math.round(v * 100) / 100);
function pathData(commands) {
	let d = '';
	for (const c of commands) {
		if (c.type === 'M' || c.type === 'L') d += `${c.type}${n2(c.x)} ${n2(c.y)}`;
		else if (c.type === 'Q') d += `Q${n2(c.x1)} ${n2(c.y1)} ${n2(c.x)} ${n2(c.y)}`;
		else if (c.type === 'C') d += `C${n2(c.x1)} ${n2(c.y1)} ${n2(c.x2)} ${n2(c.y2)} ${n2(c.x)} ${n2(c.y)}`;
		else if (c.type === 'Z') d += 'Z';
	}
	return d;
}

/** Outline of one character at (x, y), and how far it moves the pen. */
function glyph(char, style, x, y) {
	if (BLACKBOARD[char]) return glyph(BLACKBOARD[char], { ...style, family: 'ams' }, x, y);
	if (NEGATED[char]) {
		const base = glyph(NEGATED[char], style, x, y);
		const slash = glyph('/', { ...style, family: 'serif', style: 'normal' }, 0, 0);
		const dx = x + (base.advance - slash.advance) / 2;
		return { d: base.d + glyph('/', { ...style, family: 'serif', style: 'normal' }, dx, y).d, advance: base.advance };
	}
	// As in KaTeX: in `math`, letters are in the maths italic, digits and signs upright.
	const order = style.family === 'math' ? (/\p{L}/u.test(char) ? [KATEX('Math-Italic'), KATEX('Main-Regular')] : [KATEX('Main-Regular')]) : fontsFor(style);
	for (const path of order) {
		const f = font(path);
		if (f.charToGlyphIndex(char) > 0 || char === ' ') {
			const g = f.charToGlyph(char);
			return { d: pathData(g.getPath(x, y, style.size).commands), advance: (g.advanceWidth * style.size) / f.unitsPerEm, f, g };
		}
	}
	throw new Error(`il carattere "${char}" (U+${char.codePointAt(0).toString(16).toUpperCase()}) non c'è in nessun font`);
}

/* --------------------------------------------------------------- checking */

const ELEMENTS = new Set(['svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text', 'tspan', 'defs', 'clipPath', 'linearGradient', 'radialGradient', 'stop']);
const TEXT_ATTRS = new Set(['x', 'y', 'dx', 'dy', 'font-family', 'font-size', 'font-style', 'font-weight', 'text-anchor', 'letter-spacing', 'fill', 'fill-opacity', 'transform', 'opacity']);
const ID = /^[a-z0-9-]{1,40}$/;

function check(el, file) {
	const name = el.localName;
	if (!ELEMENTS.has(name)) throw new Error(`${file}: elemento <${name}> non ammesso`);
	for (const a of Array.from(el.attributes)) {
		if (/^on/i.test(a.name)) throw new Error(`${file}: attributo ${a.name} non ammesso`);
		if (/href$/i.test(a.name) && !a.value.startsWith('#')) throw new Error(`${file}: collegamento esterno non ammesso`);
		if (/url\((?!#)/.test(a.value)) throw new Error(`${file}: url esterno non ammesso`);
		if ((name === 'text' || name === 'tspan') && !TEXT_ATTRS.has(a.name)) throw new Error(`${file}: attributo ${a.name} non ammesso su <${name}>`);
	}
	for (const c of Array.from(el.childNodes)) if (c.nodeType === 1) check(c, file);
}

/* ------------------------------------------------------------------- text */

const num = (v, d = 0) => (v == null || v === '' ? d : Number(v));

/** Replaces a <text> with paths, one per run of the same fill. */
function outline(text, file) {
	const base = {
		family: text.getAttribute('font-family') || 'serif',
		style: text.getAttribute('font-style') || 'normal',
		weight: num(text.getAttribute('font-weight'), 400),
		size: num(text.getAttribute('font-size'), NaN),
		fill: text.getAttribute('fill'),
		fillOpacity: text.getAttribute('fill-opacity')
	};
	if (!Number.isFinite(base.size)) throw new Error(`${file}: un <text> senza font-size`);
	const spacing = num(text.getAttribute('letter-spacing'));

	// The runs, with SVG's default whitespace handling: newlines out, spaces collapsed, ends trimmed.
	const runs = [];
	for (const node of Array.from(text.childNodes)) {
		if (node.nodeType === 3) runs.push({ style: base, dx: 0, dy: 0, chars: node.data });
		else if (node.nodeType === 1 && node.localName === 'tspan') {
			if (Array.from(node.childNodes).some((c) => c.nodeType === 1)) throw new Error(`${file}: <tspan> dentro <tspan> non ammesso`);
			runs.push({
				style: {
					family: node.getAttribute('font-family') || base.family,
					style: node.getAttribute('font-style') || base.style,
					weight: num(node.getAttribute('font-weight'), base.weight),
					size: num(node.getAttribute('font-size'), base.size),
					fill: node.getAttribute('fill') ?? base.fill,
					fillOpacity: node.getAttribute('fill-opacity') ?? base.fillOpacity
				},
				dx: num(node.getAttribute('dx')),
				dy: num(node.getAttribute('dy')),
				chars: node.textContent
			});
		}
	}
	let prevSpace = true;
	for (const r of runs) {
		let out = '';
		for (const c of r.chars.replace(/[\r\n]/g, '').replace(/\t/g, ' ')) {
			if (c === ' ' && prevSpace) continue;
			out += c;
			prevSpace = c === ' ';
		}
		r.chars = out;
	}
	for (let i = runs.length - 1; i >= 0; i--) {
		const trimmed = runs[i].chars.replace(/ +$/, '');
		const done = trimmed.length > 0;
		runs[i].chars = trimmed;
		if (done) break;
	}

	// Lay the runs out from 0, then move the whole line by its anchor.
	let x = 0, y = 0;
	const parts = [];
	for (const r of runs) {
		x += r.dx;
		y += r.dy;
		let d = '', prev = null;
		for (const c of r.chars) {
			const g = glyph(c, r.style, 0, 0);
			if (prev && g.f && prev.f === g.f) x += (g.f.getKerningValue(prev.g, g.g) * r.style.size) / g.f.unitsPerEm;
			d += glyph(c, r.style, x, y).d;
			x += g.advance + spacing;
			prev = g;
		}
		if (d) parts.push({ d, style: r.style });
	}
	const anchor = text.getAttribute('text-anchor') || 'start';
	const shift = anchor === 'middle' ? -x / 2 : anchor === 'end' ? -x : 0;
	const tx = num(text.getAttribute('x')) + shift, ty = num(text.getAttribute('y'));

	const doc = text.ownerDocument;
	const g = doc.createElementNS(SVG_NS, 'g');
	const transform = [text.getAttribute('transform'), `translate(${+tx.toFixed(2)} ${+ty.toFixed(2)})`].filter(Boolean).join(' ');
	g.setAttribute('transform', transform);
	if (text.getAttribute('opacity')) g.setAttribute('opacity', text.getAttribute('opacity'));
	for (const p of parts) {
		const path = doc.createElementNS(SVG_NS, 'path');
		path.setAttribute('d', p.d);
		if (p.style.fill) path.setAttribute('fill', p.style.fill);
		if (p.style.fillOpacity) path.setAttribute('fill-opacity', p.style.fillOpacity);
		g.appendChild(path);
	}
	text.parentNode.replaceChild(g, text);
}

/* -------------------------------------------------------------- die-cut */

/** Pixels per sticker px when the outline is traced. */
const CUT_SCALE = 4;

/** Squared Euclidean distance to the nearest set pixel, per row then per column (Felzenszwalb and Huttenlocher, 2012). */
function distance(set, W, H) {
	const INF = 1e12;
	const f = new Float64Array(Math.max(W, H)), d = new Float64Array(Math.max(W, H)), v = new Int32Array(Math.max(W, H)), z = new Float64Array(Math.max(W, H) + 1);
	const line = (n) => {
		let k = 0;
		v[0] = 0; z[0] = -INF; z[1] = INF;
		for (let q = 1; q < n; q++) {
			let s2 = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
			while (s2 <= z[k]) { k--; s2 = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]); }
			k++; v[k] = q; z[k] = s2; z[k + 1] = INF;
		}
		k = 0;
		for (let q = 0; q < n; q++) { while (z[k + 1] < q) k++; d[q] = (q - v[k]) * (q - v[k]) + f[v[k]]; }
	};
	const out = new Float64Array(W * H);
	for (let i = 0; i < W * H; i++) out[i] = set[i] ? 0 : INF;
	for (let x = 0; x < W; x++) { for (let y = 0; y < H; y++) f[y] = out[y * W + x]; line(H); for (let y = 0; y < H; y++) out[y * W + x] = d[y]; }
	for (let y = 0; y < H; y++) { for (let x = 0; x < W; x++) f[x] = out[y * W + x]; line(W); for (let x = 0; x < W; x++) out[y * W + x] = d[x]; }
	return out;
}

/** Closed outlines of a binary image, by marching squares on cell corners; points in pixels. */
function contours(inside, W, H) {
	const at = (x, y) => (x >= 0 && y >= 0 && x < W && y < H ? inside[y * W + x] : 0);
	const segs = new Map();
	const key = (p) => `${p[0]},${p[1]}`;
	const add = (a, b) => segs.set(key(a), { a, b });
	for (let y = -1; y < H; y++)
		for (let x = -1; x < W; x++) {
			const c = (at(x, y) << 3) | (at(x + 1, y) << 2) | (at(x + 1, y + 1) << 1) | at(x, y + 1);
			const T = [x + 1, y + 0.5], R = [x + 1.5, y + 1], B = [x + 1, y + 1.5], L = [x + 0.5, y + 1];
			// Each edge keeps the inside on its right, so every loop runs the same way round.
			switch (c) {
				case 1: add(B, L); break; case 2: add(R, B); break; case 3: add(R, L); break; case 4: add(T, R); break;
				case 5: add(T, L); add(B, R); break; case 6: add(T, B); break; case 7: add(T, L); break; case 8: add(L, T); break;
				case 9: add(B, T); break; case 10: add(L, B); add(R, T); break; case 11: add(R, T); break; case 12: add(L, R); break;
				case 13: add(B, R); break; case 14: add(L, B); break;
			}
		}
	const loops = [];
	while (segs.size) {
		const [k0, first] = segs.entries().next().value;
		segs.delete(k0);
		const loop = [first.a];
		let p = first.b;
		while (key(p) !== k0) { loop.push(p); const next = segs.get(key(p)); if (!next) break; segs.delete(key(p)); p = next.b; }
		if (loop.length > 8) loops.push(loop);
	}
	return loops;
}

/** Fewer points on a closed line, none further than eps from it (Ramer, Douglas and Peucker). */
function simplify(pts, eps) {
	const keep = new Uint8Array(pts.length);
	const rdp = (i, j) => {
		const [ax, ay] = pts[i], [bx, by] = pts[j];
		const len = Math.hypot(bx - ax, by - ay) || 1;
		let best = -1, far = 0;
		for (let k = i + 1; k < j; k++) {
			const dd = Math.abs((bx - ax) * (ay - pts[k][1]) - (ax - pts[k][0]) * (by - ay)) / len;
			if (dd > far) { far = dd; best = k; }
		}
		if (far > eps) { keep[best] = 1; rdp(i, best); rdp(best, j); }
	};
	const half = Math.floor(pts.length / 2);
	keep[0] = keep[half] = 1;
	rdp(0, half);
	rdp(half, pts.length - 1);
	keep[pts.length - 1] = 1;
	return pts.filter((_, i) => keep[i]);
}

/** A closed line through the points as a smooth curve (Catmull-Rom as cubic Béziers). */
function smooth(pts, k) {
	const n = pts.length, P = (i) => pts[(i + n) % n], f = (v) => +(v / k).toFixed(2);
	let d = `M${f(P(0)[0])} ${f(P(0)[1])}`;
	for (let i = 0; i < n; i++) {
		const [p0, p1, p2, p3] = [P(i - 1), P(i), P(i + 1), P(i + 2)];
		d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
	}
	return d + 'Z';
}

/**
 * The die-cut outline of a sticker drawn with `data-cut`: everything the artwork paints, grown by
 * `margin` px, its holes filled, traced and smoothed. Returned in the coordinates of the finished
 * sticker, which is the artwork moved by `margin` on each side.
 */
async function cutOutline(art, w, h, margin, file) {
	const W = Math.round((w + 2 * margin) * CUT_SCALE), H = Math.round((h + 2 * margin) * CUT_SCALE);
	const svg = `<svg xmlns="${SVG_NS}" width="${W}" height="${H}" viewBox="${-margin} ${-margin} ${w + 2 * margin} ${h + 2 * margin}">${art}</svg>`;
	const alpha = await sharp(Buffer.from(svg)).ensureAlpha().extractChannel(3).raw().toBuffer();
	const painted = new Uint8Array(W * H);
	for (let i = 0; i < W * H; i++) painted[i] = alpha[i] > 24 ? 1 : 0;
	const d2 = distance(painted, W, H), r2 = (margin * CUT_SCALE) ** 2;
	const grown = new Uint8Array(W * H);
	for (let i = 0; i < W * H; i++) grown[i] = d2[i] <= r2 ? 1 : 0;
	// Holes: whatever the outside cannot reach from the border is part of the sticker.
	const outside = new Uint8Array(W * H), stack = [];
	for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
	for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
	while (stack.length) {
		const i = stack.pop();
		if (outside[i] || grown[i]) continue;
		outside[i] = 1;
		const x = i % W;
		if (x > 0) stack.push(i - 1);
		if (x < W - 1) stack.push(i + 1);
		if (i >= W) stack.push(i - W);
		if (i < W * (H - 1)) stack.push(i + W);
	}
	const inside = new Uint8Array(W * H);
	for (let i = 0; i < W * H; i++) inside[i] = outside[i] ? 0 : 1;
	const loops = contours(inside, W, H);
	if (loops.length !== 1) throw new Error(`${file}: la sagoma ha ${loops.length} pezzi separati: aumenta data-cut o avvicina le parti`);
	return smooth(simplify(loops[0], 0.9), CUT_SCALE);
}

/* ------------------------------------------------------------------ build */

const packs = JSON.parse(readFileSync(join(SRC, 'packs.json'), 'utf8'));
const stickers = [];
const files = new Map();
const seen = new Set();

for (const pack of packs) {
	const dir = join(SRC, pack.id);
	if (!existsSync(dir)) throw new Error(`pacchetto ${pack.id}: manca la cartella stickers/${pack.id}`);
	// In the pack's `order` first (a chapter pack follows the book), then the rest by name.
	const rank = (name) => { const i = (pack.order ?? []).indexOf(name.slice(0, -4)); return i < 0 ? Infinity : i; };
	for (const name of readdirSync(dir).filter((f) => f.endsWith('.svg')).sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))) {
		const file = `stickers/${pack.id}/${name}`;
		const id = name.slice(0, -4);
		if (!ID.test(id)) throw new Error(`${file}: il nome del file deve essere in minuscolo con trattini`);
		if (seen.has(id)) throw new Error(`${file}: l'id "${id}" c'è già in un altro pacchetto`);
		seen.add(id);

		const doc = new DOMParser({ onError: (level, msg) => { throw new Error(`${file}: ${msg}`); } }).parseFromString(readFileSync(join(dir, name), 'utf8'), 'image/svg+xml');
		const svg = doc.documentElement;
		check(svg, file);
		const [vx, vy, w, h] = (svg.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number);
		if (vx !== 0 || vy !== 0 || !(w >= 56 && w <= 150 && h >= 40 && h <= 150)) throw new Error(`${file}: viewBox deve essere "0 0 L A" con lati tra 56 e 150 (altezza da 40)`);
		const cut = svg.hasAttribute('data-cut') ? Number(svg.getAttribute('data-cut')) : null;
		const meta = { name: svg.getAttribute('data-name'), radius: cut === null ? Number(svg.getAttribute('data-radius')) : 0, accent: svg.getAttribute('data-accent'), cover: svg.getAttribute('data-cover') || undefined };
		if (!meta.name) throw new Error(`${file}: manca data-name`);
		if (cut !== null && !(cut >= 4 && cut <= 14)) throw new Error(`${file}: data-cut tra 4 e 14`);
		if (cut === null && !(meta.radius >= 8 && meta.radius <= 30)) throw new Error(`${file}: data-radius tra 8 e 30`);
		if (!/^#[0-9a-f]{6}$/i.test(meta.accent || '')) throw new Error(`${file}: data-accent deve essere un colore #rrggbb`);
		if (meta.cover && !/^[a-z0-9_-]+(\/[a-z0-9_-]+){0,4}$/.test(meta.cover)) throw new Error(`${file}: data-cover non valido`);

		for (const t of Array.from(svg.getElementsByTagName('text'))) outline(t, file);
		for (const a of ['data-name', 'data-radius', 'data-accent', 'data-cover', 'data-cut']) svg.removeAttribute(a);
		let body, ow = w, oh = h;
		if (cut === null) {
			svg.setAttribute('width', String(w));
			svg.setAttribute('height', String(h));
			body = new XMLSerializer().serializeToString(doc).replace(/>\s+</g, '><').trim() + '\n';
		} else {
			// Die-cut: the white outline, then the artwork on it; the file is as big as the finished sticker.
			const art = Array.from(svg.childNodes).map((c) => new XMLSerializer().serializeToString(c)).join('').replace(/>\s+</g, '><').trim();
			const outline = await cutOutline(art, w, h, cut, file);
			ow = w + 2 * cut - 8;
			oh = h + 2 * cut - 8;
			body = `<svg xmlns="${SVG_NS}" viewBox="0 0 ${w + 2 * cut} ${h + 2 * cut}" width="${w + 2 * cut}" height="${h + 2 * cut}"><path d="${outline}" fill="#fff"/><g transform="translate(${cut} ${cut})">${art}</g></svg>\n`;
		}
		if (body.includes('NaN')) throw new Error(`${file}: il file generato contiene NaN`);
		const v = createHash('sha1').update(body).digest('hex').slice(0, 8);
		files.set(`${id}.svg`, body);
		stickers.push({ id, name: meta.name, pack: pack.id, w: ow + 8, h: oh + 8, r: meta.radius, accent: meta.accent.toLowerCase(), ...(cut !== null ? { cut: true } : {}), ...(meta.cover ? { cover: meta.cover } : {}), v });
	}
}

for (const pack of packs) for (const id of pack.order ?? []) if (!stickers.some((s) => s.id === id && s.pack === pack.id)) throw new Error(`packs.json: "${id}" nell'ordine di ${pack.id} non esiste`);
const catalog = JSON.stringify({ packs: packs.map(({ order: _order, ...p }) => p), stickers }, null, '\t') + '\n';

if (CHECK) {
	const stale = [];
	if (!existsSync(CATALOG) || readFileSync(CATALOG, 'utf8') !== catalog) stale.push('src/lib/zaino/sticker-catalog.json');
	for (const [name, body] of files) if (!existsSync(join(OUT, name)) || readFileSync(join(OUT, name), 'utf8') !== body) stale.push(`public/stickers/${name}`);
	if (existsSync(OUT)) for (const name of readdirSync(OUT)) if (!files.has(name)) stale.push(`public/stickers/${name} (da togliere)`);
	if (stale.length) {
		console.error(`Adesivi non aggiornati, lancia npm run stickers:\n  ${stale.join('\n  ')}`);
		process.exit(1);
	}
	console.log(`${stickers.length} adesivi aggiornati.`);
	process.exit(0);
}

mkdirSync(OUT, { recursive: true });
for (const name of readdirSync(OUT)) if (!files.has(name)) rmSync(join(OUT, name));
for (const [name, body] of files) writeFileSync(join(OUT, name), body);
writeFileSync(CATALOG, catalog);

// The proof sheet: every sticker, pack by pack, die-cut on squared paper, at full size and at 60 px.
const card = (s, scale) =>
	`<figure><div class="st${s.cut ? ' cut' : ''}" style="width:${s.w * scale}px;height:${s.h * scale}px;border-radius:${s.r * scale}px;padding:${s.cut ? 0 : 4 * scale}px"><img src="../public/stickers/${s.id}.svg?v=${s.v}" style="border-radius:${Math.max(0, s.r - 4) * scale}px"></div>${scale === 1 ? `<figcaption>${s.name}<br><code>${s.id}</code>${s.cover ? `<br><small>${s.cover}</small>` : ''}</figcaption>` : ''}</figure>`;
const sheet = `<!doctype html><meta charset="utf-8"><title>Foglio degli adesivi</title>
<style>
body{margin:0;padding:32px;font:13px/1.4 system-ui,sans-serif;color:#1b1e27;background:#fbfaf6 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22'%3E%3Cpath d='M22 0V22H0' fill='none' stroke='%234f7fc0' stroke-opacity='.18'/%3E%3C/svg%3E")}
h1{font:600 28px Georgia,serif;margin:0 0 4px}h2{font:600 20px Georgia,serif;margin:36px 0 12px}
.row{display:flex;flex-wrap:wrap;gap:28px;align-items:flex-end}.small{gap:16px;margin-top:16px}
figure{margin:0;text-align:center}figcaption{margin-top:8px;color:#555}code{font-size:11px;color:#888}small{color:#b3302f}
.st{background:#fff;box-sizing:border-box;filter:drop-shadow(0 .6px .5px rgb(30 18 8/.38)) drop-shadow(0 1px 2px rgb(30 18 8/.12));transform:rotate(-2deg)}
.st img{display:block;width:100%;height:100%}.st.cut{background:none}
</style>
<h1>Foglio degli adesivi</h1><p>${stickers.length} adesivi, generati da stickers/ il ${new Date().toLocaleDateString('it-IT')}.</p>
${packs
	.map((p) => {
		const own = stickers.filter((s) => s.pack === p.id);
		return `<h2>${p.name} (${own.length})</h2><div class="row">${own.map((s) => card(s, 1)).join('')}</div><div class="row small">${own.map((s) => card(s, 60 / Math.max(s.w, s.h))).join('')}</div>`;
	})
	.join('\n')}`;
writeFileSync(SHEET, sheet);
console.log(`${stickers.length} adesivi in ${packs.length} pacchetti. Foglio di prova: stickers/foglio.html`);

// --png: a picture of the sheet too, for a look without a browser.
if (process.argv.includes('--png')) {
	const { chromium } = await import('playwright');
	const browser = await chromium.launch();
	const page = await browser.newPage({ viewport: { width: 1100, height: 800 }, deviceScaleFactor: 2 });
	await page.goto(`file://${SHEET}`);
	await page.waitForLoadState('load');
	await page.screenshot({ path: join(SRC, 'foglio.png'), fullPage: true });
	await browser.close();
	console.log('Foto del foglio: stickers/foglio.png');
}
