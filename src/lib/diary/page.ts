/**
 * The student's own page of a day: free text and stickers. Private to the student: no teacher or parent reads it,
 * now or with the schools' release (vault/Prodotti/Studenti/Diario e calendario.md). Pure.
 */
import type { StickerBounds, PlacedSticker } from '@/lib/zaino/stickers';

/**
 * Stickers are saved on a page this wide and drawn at the page's real width: on a phone the distances shrink, so a
 * sticker by the right edge stays by the edge.
 */
export const DIARY_PAGE_WIDTH = 480;
export const DIARY_BOUNDS: StickerBounds = { x: [-60, DIARY_PAGE_WIDTH + 60], y: [-60, 2400] };
export const MAX_PAGE_TEXT = 4000;

export interface DiaryPage {
	text: string;
	stickers: PlacedSticker[];
}

export const EMPTY_PAGE: DiaryPage = { text: '', stickers: [] };
