import type { ContentNode } from '$lib/utils/tree';
import { CONTENT_ROOT } from '$lib/config/site';

/**
 * Everything that turns a content node into a URL, or a URL back into a node,
 * lives here. The router, the sitemap, the breadcrumbs, the cards and the
 * redirects all import these functions; there is no second implementation.
 *
 * Public URL scheme (DECISION 2 in the brief):
 *   /materiale
 *   /materiale/superiori
 *   /materiale/superiori/matematica
 *   /materiale/superiori/matematica/insiemi-e-logica
 *   /materiale/superiori/matematica/insiemi-e-logica/prime-definizioni
 *   /materiale/superiori/matematica/insiemi-e-logica/prime-definizioni/esercizi
 *
 * Level segments come from a fixed Italian map, subject segments from the
 * subject title, chapter and lesson segments from the curated slug stored in
 * the database (already Italian, e.g. `numeri-naturali`), normalized through
 * `slugify` so they are always lowercase ASCII. To switch chapters and lessons
 * to title-derived slugs as well, change `publicSegment` only.
 */

const LEVEL_SEGMENTS: Record<string, string> = {
	middle_school: 'medie',
	high_school: 'superiori',
	university: 'universita'
};

const MATHBB: Record<string, string> = { N: 'ℕ', Z: 'ℤ', Q: 'ℚ', R: 'ℝ', C: 'ℂ' };

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
 * sitemap and aria-labels; never for URLs.
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
 * URL slug from an Italian name: lowercase, accents folded, LaTeX and symbols
 * stripped entirely. `Numeri naturali $\mathbb{N}$` → `numeri-naturali`.
 */
export function slugify(input: string | null | undefined): string {
	return (input ?? '')
		.replace(/\\\\/g, '\\')
		.replace(/\$[^$]*\$/g, ' ')
		.replace(/\\[a-zA-Z]+(\{[^}]*\})?/g, ' ')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

type SlugSource = Pick<ContentNode, 'type' | 'slug' | 'title'>;

/** The public URL segment for one node. */
export function publicSegment(node: SlugSource): string {
	switch (node.type) {
		case 'level':
			return LEVEL_SEGMENTS[node.slug] ?? slugify(node.title);
		case 'subject':
			return slugify(node.title) || slugify(node.slug);
		default:
			return slugify(node.slug) || slugify(node.title);
	}
}

/** `/materiale/superiori/matematica/...` for a chain of ancestors ending in the node itself. */
export function nodePath(ancestors: SlugSource[]): string {
	if (ancestors.length === 0) return CONTENT_ROOT;
	return CONTENT_ROOT + '/' + ancestors.map(publicSegment).join('/');
}

/** Path of a lesson sub-view (`esercizi`, `formulario`, `flashcards`); theory is the lesson page itself. */
export function subviewPath(ancestors: SlugSource[], view: SubView): string {
	const segment = SUBVIEW_SEGMENTS[view];
	return segment ? `${nodePath(ancestors)}/${segment}` : nodePath(ancestors);
}

/** The database slug path (`high_school/math/...`), still used as the key of exercise configs. */
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
