/**
 * TikZ figures in lessons are compiled once, when a lesson is published
 * (scripts/lezioni/publish.mts), to static SVG files in the Supabase Storage
 * bucket `figure`, so they reach Google Images, load without the TeX engine and
 * do not depend on tikzjax.com.
 *
 * A ```tikz block starts with metadata comments, which TeX ignores:
 *
 *   % nome: diagramma-venn-unione
 *   % alt: Diagramma di Eulero-Venn con l'unione di A e B colorata
 *   % svg: diagramma-venn-unione-3f9a1c2e.svg 228x152
 *
 * `nome` and `alt` are written by the author; `svg` is written by the publish
 * script. The file name ends with a hash of the TikZ code, so a figure edited
 * after publishing no longer matches its file and falls back to TikZJax in the
 * browser until it is published again.
 */

export const FIGURE_BUCKET = 'figure';

/**
 * TeX lays figures out at 10pt text, which renders at 10px: smaller than the
 * lesson body. Figures are shown this much larger (SVG stays sharp), so their
 * letters match the body text; CSS still caps them at the column width.
 */
export const FIGURE_SCALE = 1.5;

/**
 * Part of every figure's hash: raising it after a change to scripts/figure makes
 * all figures out of date, so the next publish compiles them again.
 */
export const FIGURE_COMPILER = 2;

export interface Figure {
	name: string | null;
	alt: string | null;
	svg: { file: string; width: number; height: number } | null;
	/** Chemistry only: a molecule's 3D coordinates, `C 0.000 0.000 0.000; H …`, written by the publish script. */
	xyz: string | null;
	/** The TikZ code without the metadata lines. */
	code: string;
}

const META = /^%\s*(nome|alt|svg|xyz):\s*(.*)$/;

export function parseFigure(block: string): Figure {
	const lines = block.replace(/\r\n?/g, '\n').split('\n');
	const figure: Figure = { name: null, alt: null, svg: null, xyz: null, code: '' };
	let i = 0;
	for (; i < lines.length; i++) {
		const m = lines[i].trim().match(META);
		if (!m) break;
		const value = m[2].trim();
		if (m[1] === 'nome') figure.name = value || null;
		else if (m[1] === 'alt') figure.alt = value || null;
		else if (m[1] === 'xyz') figure.xyz = value || null;
		else {
			const s = value.match(/^(\S+\.svg)\s+(\d+)x(\d+)$/);
			if (s) figure.svg = { file: s[1], width: Number(s[2]), height: Number(s[3]) };
		}
	}
	figure.code = lines.slice(i).join('\n').trim();
	return figure;
}

/** FNV-1a, 32 bit, as 8 hex digits: enough to tell two versions of one figure apart. */
export function figureHash(code: string, compiler: string | number = FIGURE_COMPILER): string {
	const input = `${compiler}\n${code}`;
	let h = 0x811c9dc5;
	for (let i = 0; i < input.length; i++) {
		h ^= input.charCodeAt(i);
		h = Math.imul(h, 0x01000193) >>> 0;
	}
	return h.toString(16).padStart(8, '0');
}

/** `diagramma-venn-unione-3f9a1c2e.svg`: descriptive for Google Images, unique per version. */
export function figureFile(figure: Figure, compiler: string | number = FIGURE_COMPILER): string {
	const base = (figure.name ?? 'figura')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	return `${base || 'figura'}-${figureHash(figure.code, compiler)}.svg`;
}

/**
 * Chemistry figures: ```molecola, ```molecole, ```reazione and ```molecola3d blocks, drawn with RDKit by
 * scripts/chimica/pubblica_figure.py (the same `% nome`, `% alt` and `% svg` lines as TikZ, options in place of
 * the TikZ code). Their hash has its own compiler tag, which the Python script computes the same way: raising
 * CHEM_COMPILER here and there redraws them all.
 */
export const CHEM_BLOCKS = ['molecola', 'molecole', 'reazione', 'molecola3d'] as const;
export type ChemBlock = (typeof CHEM_BLOCKS)[number];
export const CHEM_COMPILER = 1;
export const chemCompiler = (kind: ChemBlock) => `chem${CHEM_COMPILER}:${kind}`;

/** The compiled chemistry drawing, if it exists and still matches the block. */
export function publishedChemSvg(kind: ChemBlock, figure: Figure): Figure['svg'] {
	return figure.svg && figure.svg.file === figureFile(figure, chemCompiler(kind)) ? figure.svg : null;
}

/** The compiled file, if it exists and still matches the code. */
export function publishedSvg(figure: Figure): Figure['svg'] {
	return figure.svg && figure.svg.file === figureFile(figure) ? figure.svg : null;
}

/** The metadata lines followed by the code, in a fixed order. */
export function serializeFigure(figure: Figure): string {
	const meta = [
		figure.name ? `% nome: ${figure.name}` : null,
		figure.alt ? `% alt: ${figure.alt}` : null,
		figure.svg ? `% svg: ${figure.svg.file} ${figure.svg.width}x${figure.svg.height}` : null,
		figure.xyz ? `% xyz: ${figure.xyz}` : null,
	].filter(Boolean);
	return [...meta, figure.code].join('\n') + '\n';
}

export function figureUrl(supabaseUrl: string, file: string): string {
	return `${supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/public/${FIGURE_BUCKET}/${file}`;
}
