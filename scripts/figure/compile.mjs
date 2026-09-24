/**
 * TikZ → static SVG, in Node, with the TeX engine of TikZJax (node-tikzjax).
 *
 * node-tikzjax writes letters as <text> in the Computer Modern fonts, loaded by
 * a stylesheet. An SVG shown through <img> cannot load stylesheets, so every
 * <text> is replaced by the outline of its glyphs, read from the BaKoMa fonts
 * shipped with node-tikzjax (their licence allows embedding in SVG without
 * notice). The result needs no font, no script and no network.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import * as ntz from 'node-tikzjax';
import opentype from 'opentype.js';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';

const require = createRequire(import.meta.url);
const FONTS = join(dirname(require.resolve('node-tikzjax/package.json')), 'css/bakoma/ttf');
const tex2svg = typeof ntz.default === 'function' ? ntz.default : ntz.default.default;

const fonts = new Map();
function font(name) {
	if (!fonts.has(name)) {
		const buf = readFileSync(join(FONTS, `${name}.ttf`));
		fonts.set(name, opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)));
	}
	return fonts.get(name);
}

function inherited(el, attr) {
	for (let n = el; n && n.getAttribute; n = n.parentNode) if (n.hasAttribute(attr)) return n.getAttribute(attr);
	return null;
}

export function textToPaths(svg) {
	const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
	for (const t of Array.from(doc.getElementsByTagName('text'))) {
		const family = inherited(t, 'font-family');
		if (!family) throw new Error(`text without font-family: ${t.textContent}`);
		const size = Number(inherited(t, 'font-size') ?? 10);
		const x = Number(t.getAttribute('x') ?? 0);
		const y = Number(t.getAttribute('y') ?? 0);
		const p = doc.createElement('path');
		p.setAttribute('d', font(family).getPath(t.textContent, x, y, size, { kerning: false }).toPathData(2));
		for (const a of Array.from(t.attributes)) if (!['x', 'y', 'font-family', 'font-size'].includes(a.name)) p.setAttribute(a.name, a.value);
		if (!p.hasAttribute('stroke')) p.setAttribute('stroke', 'none');
		t.parentNode.replaceChild(p, t);
	}
	for (const el of Array.from(doc.getElementsByTagName('*'))) {
		el.removeAttribute('font-family');
		el.removeAttribute('font-size');
	}
	return new XMLSerializer().serializeToString(doc);
}

/**
 * TeX's bounding box ends at the middle of the outermost strokes, so the outer half of a
 * border (the universe rectangle) would be clipped. Every side gets this much room.
 */
const PAD = 1;

function pad(svg) {
	const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
	const root = doc.documentElement;
	const [x, y, w, h] = root.getAttribute('viewBox').split(/[\s,]+/).map(Number);
	const scale = Number(root.getAttribute('width')) / w;
	root.setAttribute('viewBox', [x - PAD, y - PAD, w + 2 * PAD, h + 2 * PAD].map((n) => +n.toFixed(3)).join(' '));
	root.setAttribute('width', ((w + 2 * PAD) * scale).toFixed(3));
	root.setAttribute('height', ((h + 2 * PAD) * scale).toFixed(3));
	return new XMLSerializer().serializeToString(doc);
}

/** Compiles one tikzpicture. Calls must not overlap: node-tikzjax keeps one TeX engine. */
export async function compileFigure(code) {
	const raw = await tex2svg(`\\begin{document}\n${code}\n\\end{document}`);
	const svg = pad(textToPaths(raw));
	const m = svg.match(/<svg[^>]*\swidth="([\d.]+)"[^>]*\sheight="([\d.]+)"/);
	if (!m) throw new Error('compiled SVG has no width/height');
	return { svg, width: Math.round(Number(m[1])), height: Math.round(Number(m[2])) };
}
