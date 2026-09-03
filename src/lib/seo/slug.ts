import type { ContentNode } from '$lib/utils/tree';
import { CONTENT_ROOT } from '$lib/config/site';

/**
 * Everything that turns a content node into a URL, or a URL back into a node,
 * lives here. The router, the sitemap, the breadcrumbs, the cards and the
 * redirects all import these functions; there is no second implementation.
 *
 * One convention for every node type: the URL segment is the node's title,
 * slugified. What the student reads on the page is what appears in the URL,
 * and what people type in a search engine ("analisi matematica 1") matches.
 *
 *   /materiale
 *   /materiale/scuola-superiore
 *   /materiale/scuola-superiore/matematica
 *   /materiale/scuola-superiore/matematica/insiemi-e-logica
 *   /materiale/scuola-superiore/matematica/insiemi-e-logica/prime-definizioni
 *   /materiale/scuola-superiore/matematica/insiemi-e-logica/prime-definizioni/esercizi
 *   /materiale/universita/analisi-matematica-1/limiti/definizione-di-limite-di-funzione
 *
 * The database `slug` column stays an internal, stable key: exercise configs
 * are keyed by it, and a URL written with database slugs still resolves and
 * is redirected (301) to the title-derived one. Renaming a title moves the
 * page: add the old path to PATH_ALIASES below so old links keep working.
 */

/** Old public path → new public path, for pages whose title was renamed. */
export const PATH_ALIASES: Record<string, string> = {};

const MATHBB: Record<string, string> = { N: 'ℕ', Z: 'ℤ', Q: 'ℚ', R: 'ℝ', C: 'ℂ' };

/**
 * Blackboard-bold set symbols in slugs: the letter is kept when the title
 * does not already name the set (`Operazioni in ℕ` → `operazioni-in-n`), and
 * dropped when it does (`Numeri naturali ℕ` → `numeri-naturali`).
 */
const SET_SYMBOLS: Record<string, { letter: string; name: RegExp }> = {
	'ℕ': { letter: 'n', name: /naturali/i },
	'ℤ': { letter: 'z', name: /interi|relativi/i },
	'ℚ': { letter: 'q', name: /razionali/i },
	'ℝ': { letter: 'r', name: /reali/i },
	'ℂ': { letter: 'c', name: /complessi/i }
};

const ROMAN: Record<string, string> = { i: '1', ii: '2', iii: '3', iv: '4', v: '5', vi: '6' };

export type SubView = 'theory' | 'exercises' | 'formulary' | 'flashcards';

/** Old English sub-view segments (from the /wiki scheme) mapped to the public ones. */
export const SUBVIEW_SEGMENTS: Record<SubView, string> = {
	theory: '',
	exercises: 'esercizi',
	formulary: 'formulario',
	flashcards: 'flashcards'
};

/**
 * Plain-text form of a title that may contain LaTeX.
 * `Numeri naturali \mathbb{N}` → `Numeri naturali ℕ`.
 * Used for <title>, meta descriptions, breadcrumb labels in JSON-LD, the
 * sitemap and aria-labels.
 */
export function plainTitle(title: string | null | undefined): string {
	if (!title) return '';
	let t = title.replace(/\\\\/g, '\\');
	t = t.replace(/\$\$?([^$]*)\$\$?/g, (_m, inner: string) => inner);
	t = t.replace(/\\mathbb\{([A-Z])\}/g, (_m, l: string) => MATHBB[l] ?? l);
	t = t.replace(/\\(?:text|mathrm|mathbf|mathit|operatorname)\{([^}]*)\}/g, '$1');
	t = t.replace(/\\sqrt\{([^}]*)\}/g, '√$1');
	t = t.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2');
	t = t.replace(/\\[a-zA-Z]+\s*/g, '');
	t = t.replace(/[{}]/g, '');
	return t.replace(/\s+/g, ' ').trim();
}

/**
 * URL slug from a title: LaTeX resolved to text, parentheticals dropped,
 * accents folded, apostrophes and every other symbol turned into hyphens,
 * a trailing roman numeral written as a digit.
 *
 *   `Struttura dell'atomo`               → `struttura-dell-atomo`
 *   `Analisi matematica I`               → `analisi-matematica-1`
 *   `Triangoli (classificazione e proprietà)` → `triangoli`
 *   `Operazioni in $\mathbb{N}$`         → `operazioni-in-n`
 */
export function slugify(input: string | null | undefined): string {
	let s = plainTitle(input);
	s = s.replace(/\([^)]*\)/g, ' ');
	s = s.replace(/[ℕℤℚℝℂ]/g, (symbol) => {
		const set = SET_SYMBOLS[symbol];
		return set && !set.name.test(s) ? ` ${set.letter} ` : ' ';
	});
	s = s
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	return s.replace(/-(i{1,3}|iv|vi?)$/, (_m, numeral: string) => '-' + ROMAN[numeral]);
}

type SlugSource = Pick<ContentNode, 'type' | 'slug' | 'title'>;

/** The public URL segment for one node: its title, slugified (database slug as a last resort). */
export function publicSegment(node: SlugSource): string {
	return slugify(node.title) || slugify(node.slug);
}

/** `/materiale/scuola-superiore/matematica/...` for a chain of ancestors ending in the node itself. */
export function nodePath(ancestors: SlugSource[]): string {
	if (ancestors.length === 0) return CONTENT_ROOT;
	return CONTENT_ROOT + '/' + ancestors.map(publicSegment).join('/');
}

/** Path of a lesson sub-view (`esercizi`, `formulario`, `flashcards`); theory is the lesson page itself. */
export function subviewPath(ancestors: SlugSource[], view: SubView): string {
	const segment = SUBVIEW_SEGMENTS[view];
	return segment ? `${nodePath(ancestors)}/${segment}` : nodePath(ancestors);
}

/** The database slug path (`high_school/math/...`), the key of exercise configs. */
export function dbPath(ancestors: Pick<ContentNode, 'slug'>[]): string {
	return ancestors.map((n) => n.slug).join('/');
}

export interface ResolvedPath {
	node: ContentNode | null;
	ancestors: ContentNode[];
	/** False when a segment matched only through the database slug; the caller should 301 to `nodePath(ancestors)`. */
	canonical: boolean;
}

/**
 * Resolve public URL segments to a node. Each segment is matched against the
 * public segment first and the raw database slug second, so old-style or
 * hand-typed paths still resolve (and can then be redirected).
 */
export function resolvePublicPath(tree: ContentNode[], segments: string[]): ResolvedPath {
	let layer = tree;
	const ancestors: ContentNode[] = [];
	let canonical = true;
	let current: ContentNode | null = null;

	for (const raw of segments) {
		const segment = decodeURIComponent(raw).toLowerCase();
		let match = layer.find((n) => publicSegment(n) === segment) ?? null;
		if (!match) {
			match = layer.find((n) => n.slug.toLowerCase() === segment) ?? null;
			if (match) canonical = false;
		}
		if (!match) return { node: null, ancestors, canonical };
		current = match;
		ancestors.push(match);
		layer = match.children;
	}

	return { node: current, ancestors, canonical };
}

/**
 * Translate an old `/wiki/...` path (database slugs, English sub-views) into
 * the new public path, or null when it does not correspond to any node.
 */
export function oldWikiPathToNew(tree: ContentNode[], pathname: string): string | null {
	const parts = pathname.split('/').filter(Boolean);
	if (parts[0] !== 'wiki') return null;
	const segments = parts.slice(1);
	if (segments.length === 0) return CONTENT_ROOT;

	const last = segments[segments.length - 1];
	const view = (Object.keys(SUBVIEW_SEGMENTS) as SubView[]).find((v) => v === last);
	const nodeSegments = view ? segments.slice(0, -1) : segments;

	let layer = tree;
	const ancestors: ContentNode[] = [];
	for (const segment of nodeSegments) {
		const match = layer.find((n) => n.slug === segment) ?? layer.find((n) => publicSegment(n) === segment.toLowerCase());
		if (!match) return null;
		ancestors.push(match);
		layer = match.children;
	}

	if (view && ancestors[ancestors.length - 1]?.type === 'topic') {
		return subviewPath(ancestors, view);
	}
	return nodePath(ancestors);
}

/**
 * Where a renamed page now lives, for the redirect hook. Matches the exact
 * path and any sub-view beneath it.
 */
export function aliasTarget(pathname: string): string | null {
	const clean = pathname.replace(/\/+$/, '');
	for (const [from, to] of Object.entries(PATH_ALIASES)) {
		if (clean === from) return to;
		if (clean.startsWith(from + '/')) return to + clean.slice(from.length);
	}
	return null;
}
