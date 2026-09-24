/**
 * The stickers a student can put on a note, and the sheet they go on. Shared
 * by the server (validation) and the browser (the sticker board), so pure.
 * The artwork is static markup from this file, never user input: the board
 * injects it with innerHTML.
 */

/** The note's sheet: 36 squares of 22px, laid out at this width on every screen. */
export const SHEET_WIDTH = 792;
/** An A4 page at that width; the sheet grows past it with the text and the stickers. */
export const SHEET_MIN_HEIGHT = 1120;
export const MAX_STICKERS = 60;
/** Pages in one note (see ./pages); a sticker names the page it is on. */
export const MAX_PAGES = 60;

export interface StickerDef {
	id: string;
	name: string;
	/** Outer size in sheet px, white die-cut border included. */
	w: number;
	h: number;
	r: number;
	/** Colour of the flecks when it goes down. */
	accent: string;
	/** Inner artwork, drawn in a (w − 8) × (h − 8) box. */
	svg: string;
}

/** One sticker on one note: its centre on its page and its rotation in degrees. */
export interface PlacedSticker {
	id: string;
	sticker: string;
	x: number;
	y: number;
	r: number;
	/** The page it is stuck on, from 0; missing on stickers saved before notes had pages. */
	page?: number;
}

const INK = '#1b1e27';
const RED = '#c0352f';
const PAPER = '#fbfaf6';
const GRID = '#4f7fc0';
const LIGHT = '#fbfaf6';
const SERIF = "Fraunces, Georgia, 'Times New Roman', serif";
const MONO = "'JetBrains Mono', Menlo, monospace";

const grid = (w: number, h: number, s: number) => {
	let d = '';
	for (let x = s; x < w; x += s) d += `M${x} 0V${h}`;
	for (let y = s; y < h; y += s) d += `M0 ${y}H${w}`;
	return d;
};
const text = (x: number, y: number, body: string, attrs: string) => `<text x="${x}" y="${y}" ${attrs}>${body}</text>`;

function def(id: string, name: string, w: number, h: number, r: number, accent: string, draw: (w: number, h: number) => string): StickerDef {
	return { id, name, w, h, r, accent, svg: draw(w - 8, h - 8) };
}

export const STICKERS: StickerDef[] = [
	def('pi', 'π', 104, 104, 22, '#e8b53e', (w, h) =>
		`<rect width="${w}" height="${h}" fill="#e8b53e"/><path d="${grid(w, h, 12)}" stroke="${INK}" stroke-opacity=".08"/>` +
		text(w / 2, 62, 'π', `text-anchor="middle" font-family="${SERIF}" font-style="italic" font-weight="600" font-size="64" fill="${INK}"`) +
		text(w / 2, 84, '3,14159…', `text-anchor="middle" font-family="${MONO}" font-size="9" fill="${INK}" fill-opacity=".72"`)
	),
	def('parabola', 'Parabola', 132, 100, 14, RED, (w, h) =>
		`<rect width="${w}" height="${h}" fill="${PAPER}"/><path d="${grid(w, h, 11)}" stroke="${GRID}" stroke-opacity=".3"/>` +
		`<path d="M8 74H116M62 8V86" stroke="${INK}" stroke-opacity=".55" stroke-width="1.2"/>` +
		`<path d="M22 14Q62 134 102 14" fill="none" stroke="${RED}" stroke-width="2.6" stroke-linecap="round"/><circle cx="62" cy="74" r="3" fill="${RED}"/>` +
		text(116, 88, 'y = x²', `text-anchor="end" font-family="${SERIF}" font-style="italic" font-size="12" fill="${INK}"`)
	),
	def('eulero', 'Eulero', 156, 72, 14, GRID, (w, h) =>
		`<rect width="${w}" height="${h}" fill="#1f2a44"/>` +
		text(10, 15, 'EULERO', `font-family="${MONO}" font-size="7" letter-spacing="1" fill="${LIGHT}" fill-opacity=".55"`) +
		`<text x="${w / 2}" y="43" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="24" fill="${LIGHT}">e<tspan dy="-10" font-size="14">iπ</tspan><tspan dy="10"> + 1 = 0</tspan></text>`
	),
	def('pitagora', 'Pitagora', 112, 112, 16, '#2f7a57', (w, h) =>
		`<rect width="${w}" height="${h}" fill="#2f7a57"/>` +
		`<path d="M24 80H82L24 36Z" fill="none" stroke="${LIGHT}" stroke-width="2.4" stroke-linejoin="round"/><path d="M24 72H32V80" fill="none" stroke="${LIGHT}" stroke-width="1.4"/>` +
		text(53, 96, '4', `text-anchor="middle" font-family="${SERIF}" font-size="14" fill="${LIGHT}"`) +
		text(13, 63, '3', `text-anchor="middle" font-family="${SERIF}" font-size="14" fill="${LIGHT}"`) +
		text(60, 51, '5', `text-anchor="middle" font-family="${SERIF}" font-size="14" fill="${LIGHT}"`) +
		text(96, 17, 'a²+b²=c²', `text-anchor="end" font-family="${MONO}" font-size="7.5" fill="${LIGHT}" fill-opacity=".75"`)
	),
	def('aurea', 'Sezione aurea', 144, 92, 12, RED, (w, h) =>
		`<rect width="${w}" height="${h}" fill="${PAPER}"/><g transform="translate(1 1)" fill="none">` +
		`<path d="M0 0H134V82H0Z M82 0V82 M82 52H134 M104 52V82 M82 60H104 M90 52V60" stroke="${INK}" stroke-opacity=".4"/>` +
		`<path d="M0 82A82 82 0 0 1 82 0A52 52 0 0 1 134 52A30 30 0 0 1 104 82A22 22 0 0 1 82 60A8 8 0 0 1 90 52" stroke="${RED}" stroke-width="2.4" stroke-linecap="round"/></g>` +
		text(50, 66, 'φ', `font-family="${SERIF}" font-style="italic" font-size="18" fill="${INK}"`)
	),
	def('infinito', 'Infinito', 104, 70, 30, '#2b64a8', (w, h) =>
		`<rect width="${w}" height="${h}" fill="#2b64a8"/>` +
		`<path d="M48 29C38 14 16 14 16 29C16 44 38 44 48 29C58 14 80 14 80 29C80 44 58 44 48 29Z" fill="none" stroke="${LIGHT}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` +
		text(48, 55, 'x → ∞', `text-anchor="middle" font-family="${MONO}" font-size="8" fill="${LIGHT}" fill-opacity=".72"`)
	),
	def('radice', 'Radice di 2', 118, 80, 12, RED, (w, h) =>
		`<rect width="${w}" height="${h}" fill="${PAPER}"/><rect x="5" y="5" width="${w - 10}" height="${h - 10}" rx="7" fill="none" stroke="${RED}" stroke-width="1.4" stroke-dasharray="3 2.5"/>` +
		text(w / 2, 39, '√2 ∉ ℚ', `text-anchor="middle" font-family="${SERIF}" font-size="22" fill="${RED}"`) +
		text(w / 2, 55, 'IRRAZIONALE', `text-anchor="middle" font-family="${MONO}" font-size="7.5" letter-spacing="1.2" fill="${RED}"`)
	),
	def('completato', 'Completato', 150, 64, 12, '#b3302f', (w, h) =>
		`<rect width="${w}" height="${h}" fill="#b3302f"/><path d="M14 29L21 36L35 19" fill="none" stroke="${LIGHT}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>` +
		text(45, 22, 'CAPITOLO 4', `font-family="${MONO}" font-size="7.5" letter-spacing="1.2" fill="#fbe9e6" fill-opacity=".85"`) +
		text(45, 41, 'completato', `font-family="${SERIF}" font-style="italic" font-size="17" fill="${LIGHT}"`)
	)
];

export const STICKER_BY_ID = new Map(STICKERS.map((s) => [s.id, s]));

/** The die-cut sticker: artwork on a white border. */
export const stickerArt = (d: StickerDef) =>
	`<div class="sticker-art"><svg viewBox="0 0 ${d.w - 8} ${d.h - 8}" width="${d.w - 8}" height="${d.h - 8}" aria-hidden="true">${d.svg}</svg></div>`;

const STICKER_ID = /^[a-z0-9-]{1,40}$/;
const finite = (v: unknown, min: number, max: number) => typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max;

/** A request body's sticker list, or the reason it was refused. */
export function parseStickers(value: unknown): PlacedSticker[] | string {
	if (!Array.isArray(value)) return 'Adesivi non validi.';
	if (value.length > MAX_STICKERS) return `Al massimo ${MAX_STICKERS} adesivi per nota.`;
	const out: PlacedSticker[] = [];
	for (const item of value) {
		if (!item || typeof item !== 'object') return 'Adesivi non validi.';
		const { id, sticker, x, y, r, page } = item as Record<string, unknown>;
		if (typeof id !== 'string' || !STICKER_ID.test(id)) return 'Adesivi non validi.';
		if (typeof sticker !== 'string' || !STICKER_BY_ID.has(sticker)) return 'Adesivo sconosciuto.';
		// Centres may hang a little off the sheet, as a sticker on paper can.
		if (!finite(x, -100, SHEET_WIDTH + 100) || !finite(y, -100, 100_000) || !finite(r, -360, 360)) return 'Posizione dell’adesivo non valida.';
		if (page !== undefined && !(Number.isInteger(page) && (page as number) >= 0 && (page as number) < MAX_PAGES)) return 'Pagina dell’adesivo non valida.';
		const placed: PlacedSticker = { id, sticker, x: Math.round((x as number) * 10) / 10, y: Math.round((y as number) * 10) / 10, r: Math.round((r as number) * 10) / 10 };
		if (page) placed.page = page as number;
		out.push(placed);
	}
	return out;
}
