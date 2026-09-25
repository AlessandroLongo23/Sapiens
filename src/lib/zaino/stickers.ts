/**
 * The stickers a student can put on a note or a cover, and the sheet they go on. Shared
 * by the server (validation) and the browser (the sticker board), so pure. The artwork
 * is in public/stickers, built from stickers/ by `npm run stickers` (stickers/STILE.md),
 * and the catalog is the index that build writes.
 */
import catalog from './sticker-catalog.json';

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
	/** The pack it belongs to, as listed in stickers/packs.json. */
	pack: string;
	/** Outer size in sheet px, white die-cut border included: the artwork is (w − 8) × (h − 8). */
	w: number;
	h: number;
	r: number;
	/** Colour of the flecks when it goes down. */
	accent: string;
	/** The page whose cover has it stuck on from the start. */
	cover?: string;
	/** Die-cut: the file is the whole sticker, white outline included, shaped like its drawing; r is 0. */
	cut?: boolean;
	/** A hash of the file, so a redrawn sticker is not served from a cache. */
	v: string;
}

export interface StickerPack {
	id: string;
	name: string;
	subject?: string;
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
	/** How much bigger or smaller than its drawing, from MIN_SIZE to MAX_SIZE; missing is 1. */
	s?: number;
}

/** How far a student can shrink or enlarge a sticker. */
export const MIN_SIZE = 0.6;
export const MAX_SIZE = 1.8;

export const STICKER_PACKS: StickerPack[] = catalog.packs;
export const STICKERS: StickerDef[] = catalog.stickers;

export const STICKER_BY_ID = new Map(STICKERS.map((s) => [s.id, s]));

export const stickerUrl = (d: StickerDef) => `/stickers/${d.id}.svg?v=${d.v}`;

/** The sticker: artwork on a white border, or for a die-cut one the file as it is. */
export const stickerArt = (d: StickerDef) =>
	d.cut
		? `<div class="sticker-art is-cut"><img src="${stickerUrl(d)}" width="${d.w}" height="${d.h}" alt="" draggable="false" decoding="async"></div>`
		: `<div class="sticker-art"><img src="${stickerUrl(d)}" width="${d.w - 8}" height="${d.h - 8}" alt="" draggable="false" decoding="async"></div>`;

const STICKER_ID = /^[a-z0-9-]{1,40}$/;
const finite = (v: unknown, min: number, max: number) => typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max;

/** Where a centre may be: on a note, the sheet and a little off it, as a sticker on paper can hang. */
export interface StickerBounds {
	x: [number, number];
	y: [number, number];
}
const SHEET_BOUNDS: StickerBounds = { x: [-100, SHEET_WIDTH + 100], y: [-100, 100_000] };

/**
 * The band of squared paper at the top of an index page of the material, where a student sticks stickers as on a
 * notebook's cover (see CoverStickers). x is measured from the middle of the page, so a sticker keeps
 * its place against the centred title on any wide screen; y from the top of the band.
 */
export const COVER_WIDTH = 1280;
export const COVER_HEIGHT = 480;
export const COVER_BOUNDS: StickerBounds = { x: [-COVER_WIDTH / 2 - 100, COVER_WIDTH / 2 + 100], y: [-100, COVER_HEIGHT + 100] };

/** Where the stickers a cover comes with are stuck: on the right of the title, where the page's icon used to be. */
const COVER_SLOTS = [
	{ x: 450, y: 118, r: 7 },
	{ x: 300, y: 212, r: -9 }
];
/** What fills the slots a page's own stickers leave free. */
const COVER_GENERIC = ['pi', 'infinito'];

/**
 * What a cover comes with, until the student changes it: stickers already stuck on show that they can
 * be peeled off and others put on. First the page's own (a chapter's sticker on its chapter), then the
 * generic ones.
 */
export function coverDefaults(page: string): PlacedSticker[] {
	const own = STICKERS.filter((s) => s.cover === page).map((s) => s.id);
	const ids = [...own, ...COVER_GENERIC.filter((id) => !own.includes(id))].slice(0, COVER_SLOTS.length);
	return ids.map((id, i) => ({ id: `cover-${id}`, sticker: id, ...COVER_SLOTS[i] }));
}

/** A request body's sticker list, or the reason it was refused. */
export function parseStickers(value: unknown, bounds: StickerBounds = SHEET_BOUNDS): PlacedSticker[] | string {
	if (!Array.isArray(value)) return 'Adesivi non validi.';
	if (value.length > MAX_STICKERS) return `Al massimo ${MAX_STICKERS} adesivi.`;
	const out: PlacedSticker[] = [];
	for (const item of value) {
		if (!item || typeof item !== 'object') return 'Adesivi non validi.';
		const { id, sticker, x, y, r, page, s } = item as Record<string, unknown>;
		if (typeof id !== 'string' || !STICKER_ID.test(id)) return 'Adesivi non validi.';
		if (typeof sticker !== 'string' || !STICKER_BY_ID.has(sticker)) return 'Adesivo sconosciuto.';
		if (!finite(x, ...bounds.x) || !finite(y, ...bounds.y) || !finite(r, -360, 360)) return 'Posizione dell’adesivo non valida.';
		if (page !== undefined && !(Number.isInteger(page) && (page as number) >= 0 && (page as number) < MAX_PAGES)) return 'Pagina dell’adesivo non valida.';
		const placed: PlacedSticker = { id, sticker, x: Math.round((x as number) * 10) / 10, y: Math.round((y as number) * 10) / 10, r: Math.round((r as number) * 10) / 10 };
		if (page) placed.page = page as number;
		if (s !== undefined) {
			if (!finite(s, MIN_SIZE, MAX_SIZE)) return 'Dimensione dell’adesivo non valida.';
			if (Math.abs((s as number) - 1) > 0.005) placed.s = Math.round((s as number) * 100) / 100;
		}
		out.push(placed);
	}
	return out;
}
