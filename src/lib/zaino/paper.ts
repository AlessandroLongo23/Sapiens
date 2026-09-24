/**
 * The paper a note is written on: ruling, colour, how far apart the lines are
 * and how big the text is. One setting per note, as in Notability, saved in
 * `notes.paper` apart from the text so changing it never bumps the version.
 *
 * Pure and isomorphic: the server validates with it, the editor, the page
 * thumbnails and the print copy style themselves with it.
 */
import type { CSSProperties } from 'react';

export const PAPER_KINDS = ['quadretti', 'righe', 'puntini', 'bianca'] as const;
export const PAPER_COLORS = ['tema', 'bianca', 'avorio', 'gialla', 'azzurra', 'verde', 'rosa', 'scura'] as const;
export const PAPER_SIZES = ['piccola', 'media', 'grande'] as const;

export type PaperKind = (typeof PAPER_KINDS)[number];
export type PaperColor = (typeof PAPER_COLORS)[number];
export type PaperSize = (typeof PAPER_SIZES)[number];

export interface Paper {
	kind: PaperKind;
	color: PaperColor;
	/** Distance between the lines: one line of text is always one row. */
	spacing: PaperSize;
	text: PaperSize;
}

/** What every note had before paper could be chosen: squares of 24px, 16px text, the theme's paper. */
export const DEFAULT_PAPER: Paper = { kind: 'quadretti', color: 'tema', spacing: 'media', text: 'media' };

export const KIND_LABEL: Record<PaperKind, string> = { quadretti: 'Quadretti', righe: 'Righe', puntini: 'Puntini', bianca: 'Bianca' };
export const COLOR_LABEL: Record<PaperColor, string> = {
	tema: 'Come il tema',
	bianca: 'Bianca',
	avorio: 'Avorio',
	gialla: 'Gialla',
	azzurra: 'Azzurra',
	verde: 'Verde',
	rosa: 'Rosa',
	scura: 'Scura'
};
export const SIZE_LABEL: Record<PaperSize, string> = { piccola: 'Piccoli', media: 'Medi', grande: 'Grandi' };
export const TEXT_LABEL: Record<PaperSize, string> = { piccola: 'Piccolo', media: 'Medio', grande: 'Grande' };

/** Row height in px per spacing, and body text size per text size. */
const ROW: Record<PaperSize, number> = { piccola: 20, media: 24, grande: 28 };
const FONT: Record<PaperSize, number> = { piccola: 14, media: 16, grande: 18 };

const pick = <T extends string>(list: readonly T[], value: unknown, fallback: T): T => (list.includes(value as T) ? (value as T) : fallback);

/** A stored or requested setting, with anything unknown replaced by the default. */
export function readPaper(value: unknown): Paper {
	const v = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
	return {
		kind: pick(PAPER_KINDS, v.kind, DEFAULT_PAPER.kind),
		color: pick(PAPER_COLORS, v.color, DEFAULT_PAPER.color),
		spacing: pick(PAPER_SIZES, v.spacing, DEFAULT_PAPER.spacing),
		text: pick(PAPER_SIZES, v.text, DEFAULT_PAPER.text)
	};
}

/** A request body's paper, or the reason it was refused. Strict, unlike readPaper. */
export function parsePaper(value: unknown): Paper | string {
	if (!value || typeof value !== 'object') return 'Impostazioni della carta non valide.';
	const v = value as Record<string, unknown>;
	if (!PAPER_KINDS.includes(v.kind as PaperKind)) return 'Tipo di carta non valido.';
	if (!PAPER_COLORS.includes(v.color as PaperColor)) return 'Colore della carta non valido.';
	if (!PAPER_SIZES.includes(v.spacing as PaperSize) || !PAPER_SIZES.includes(v.text as PaperSize)) return 'Dimensione non valida.';
	return readPaper(v);
}

/**
 * The custom properties the ruled-paper CSS in globals.css reads. The line is
 * drawn where body text has its baseline: half the row plus a share of the
 * font size, measured in the browser for Inter (0.375em) and JetBrains Mono
 * (0.3125em), and rounded because the browser snaps the text to whole pixels.
 * The headings' own offsets are in em, so they follow the text size.
 */
export function paperStyle(paper: Paper): CSSProperties {
	const row = ROW[paper.spacing];
	const fs = FONT[paper.text];
	return {
		'--row': `${row}px`,
		'--fs': `${fs}px`,
		'--baseline': `${Math.round(row / 2 + 0.375 * fs)}px`,
		'--baseline-mono': `${Math.round(row / 2 + 0.3125 * fs)}px`
	} as CSSProperties;
}

/** The attributes that pick the ruling and the colour in CSS. */
export const paperData = (paper: Paper) => ({ 'data-paper': paper.kind, 'data-paper-color': paper.color });

/** Light papers carry the light theme's ink even in the dark theme, and the dark paper the dark one. */
export function paperTone(color: PaperColor): 'light' | 'dark' | null {
	if (color === 'tema') return null;
	return color === 'scura' ? 'dark' : 'light';
}
