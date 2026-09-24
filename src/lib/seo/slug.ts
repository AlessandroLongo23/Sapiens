import type { ContentNode } from '@/lib/utils/tree';
import { CONTENT_ROOT } from '@/lib/config/site';

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

/**
 * Old public path → new public path, for pages whose title was renamed or moved. Lessons come
 * before chapters: aliasTarget() takes the first match and a chapter alias also matches its
 * lessons as a prefix. The maths entries come from the reorganisation of 24 September 2026
 * (docs/lezioni/albero.md).
 */
export const PATH_ALIASES: Record<string, string> = {
	'/materiale/scuola-superiore/matematica/derivate/applicazioni-delle-derivate': '/materiale/scuola-superiore/matematica/studio-di-funzione/massimi-minimi-e-flessi',
	'/materiale/scuola-superiore/matematica/derivate/derivate-di-funzioni-elementari': '/materiale/scuola-superiore/matematica/derivate/derivate-delle-funzioni-elementari',
	'/materiale/scuola-superiore/matematica/equazioni-e-sistemi/disequazioni-di-primo-grado': '/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/disequazioni-di-primo-grado-e-intervalli',
	'/materiale/scuola-superiore/matematica/equazioni-e-sistemi/disequazioni-di-secondo-grado': '/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-di-secondo-grado',
	'/materiale/scuola-superiore/matematica/equazioni-e-sistemi/disequazioni-razionali': '/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/studio-del-segno-e-disequazioni-fratte',
	'/materiale/scuola-superiore/matematica/equazioni-e-sistemi/equazioni-di-primo-grado': '/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere',
	'/materiale/scuola-superiore/matematica/equazioni-e-sistemi/equazioni-di-secondo-grado': '/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado',
	'/materiale/scuola-superiore/matematica/equazioni-e-sistemi/sistemi-di-disequazioni': '/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/sistemi-di-disequazioni',
	'/materiale/scuola-superiore/matematica/equazioni-e-sistemi/sistemi-di-equazioni': '/materiale/scuola-superiore/matematica/sistemi-lineari/sistemi-di-due-equazioni-in-due-incognite',
	'/materiale/scuola-superiore/matematica/funzioni/composizione-di-funzioni': '/materiale/scuola-superiore/matematica/relazioni-e-funzioni/composizione-e-funzione-inversa',
	'/materiale/scuola-superiore/matematica/funzioni/definizione-di-funzione': '/materiale/scuola-superiore/matematica/relazioni-e-funzioni/definizione-di-funzione',
	'/materiale/scuola-superiore/matematica/funzioni/dominio-codominio-e-immagine': '/materiale/scuola-superiore/matematica/relazioni-e-funzioni/dominio-codominio-e-immagine',
	'/materiale/scuola-superiore/matematica/funzioni/funzioni-dispari-e-pari': '/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/funzioni-pari-e-dispari',
	'/materiale/scuola-superiore/matematica/funzioni/funzioni-esponenziali': '/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/funzione-esponenziale',
	'/materiale/scuola-superiore/matematica/funzioni/funzioni-iniettive-suriettive-e-biettive': '/materiale/scuola-superiore/matematica/relazioni-e-funzioni/funzioni-iniettive-suriettive-e-biettive',
	'/materiale/scuola-superiore/matematica/funzioni/funzioni-invertibili': '/materiale/scuola-superiore/matematica/relazioni-e-funzioni/composizione-e-funzione-inversa',
	'/materiale/scuola-superiore/matematica/funzioni/funzioni-lineari': '/materiale/scuola-superiore/matematica/relazioni-e-funzioni/proporzionalita-diretta-e-inversa',
	'/materiale/scuola-superiore/matematica/funzioni/funzioni-logaritmiche': '/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/funzione-logaritmica',
	'/materiale/scuola-superiore/matematica/funzioni/funzioni-periodiche': '/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/funzioni-periodiche',
	'/materiale/scuola-superiore/matematica/funzioni/funzioni-quadratiche': '/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/la-parabola',
	'/materiale/scuola-superiore/matematica/funzioni/funzioni-reali-di-variabile-reale': '/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/funzioni-reali-e-dominio',
	'/materiale/scuola-superiore/matematica/geometria-analitica/distanza-di-un-punto-da-una-retta': '/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/distanza-di-un-punto-da-una-retta',
	'/materiale/scuola-superiore/matematica/geometria-analitica/equazione-di-una-retta': '/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/equazione-della-retta-e-casi-particolari',
	'/materiale/scuola-superiore/matematica/geometria-analitica/equazioni-degli-assi': '/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/equazione-della-retta-e-casi-particolari',
	'/materiale/scuola-superiore/matematica/geometria-analitica/il-coefficiente-angolare': '/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/coefficiente-angolare-e-retta-per-due-punti',
	'/materiale/scuola-superiore/matematica/geometria-analitica/il-piano-cartesiano': '/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio',
	'/materiale/scuola-superiore/matematica/geometria-analitica/il-punto-medio-di-un-segmento': '/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio',
	'/materiale/scuola-superiore/matematica/geometria-analitica/intersezione-tra-due-rette': '/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/intersezione-tra-due-rette',
	'/materiale/scuola-superiore/matematica/geometria-analitica/la-distanza-tra-due-punti': '/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio',
	'/materiale/scuola-superiore/matematica/geometria-analitica/retta-parallela-all-asse-x': '/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/equazione-della-retta-e-casi-particolari',
	'/materiale/scuola-superiore/matematica/geometria-analitica/retta-parallela-all-asse-y': '/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/equazione-della-retta-e-casi-particolari',
	'/materiale/scuola-superiore/matematica/geometria-analitica/retta-passante-per-due-punti': '/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/coefficiente-angolare-e-retta-per-due-punti',
	'/materiale/scuola-superiore/matematica/geometria-analitica/retta-passante-per-l-origine-degli-assi': '/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/equazione-della-retta-e-casi-particolari',
	'/materiale/scuola-superiore/matematica/geometria-analitica/retta-passante-per-un-punto': '/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/rette-parallele-e-perpendicolari',
	'/materiale/scuola-superiore/matematica/geometria-analitica/rette-parallele-tra-loro': '/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/rette-parallele-e-perpendicolari',
	'/materiale/scuola-superiore/matematica/geometria-analitica/rette-perpendicolari-tra-loro': '/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/rette-parallele-e-perpendicolari',
	'/materiale/scuola-superiore/matematica/geometria-solida/solidi-geometrici': '/materiale/scuola-superiore/matematica/geometria-dello-spazio/poliedri',
	'/materiale/scuola-superiore/matematica/geometria-solida/superfici-e-volumi-dei-solidi-geometrici': '/materiale/scuola-superiore/matematica/geometria-dello-spazio/aree-e-volumi-dei-solidi',
	'/materiale/scuola-superiore/matematica/insiemi-e-logica/complementare-insiemistica': '/materiale/scuola-superiore/matematica/insiemi-e-logica/differenza-e-complementare',
	'/materiale/scuola-superiore/matematica/insiemi-e-logica/differenza-insiemistica': '/materiale/scuola-superiore/matematica/insiemi-e-logica/differenza-e-complementare',
	'/materiale/scuola-superiore/matematica/insiemi-e-logica/operazioni-e-relazioni-tra-insiemi': '/materiale/scuola-superiore/matematica/insiemi-e-logica/proprieta-delle-operazioni-tra-insiemi',
	'/materiale/scuola-superiore/matematica/integrali/definizione-di-integrale': '/materiale/scuola-superiore/matematica/integrali/integrale-definito',
	'/materiale/scuola-superiore/matematica/integrali/integrali-definiti': '/materiale/scuola-superiore/matematica/integrali/integrale-definito',
	'/materiale/scuola-superiore/matematica/integrali/teorema-fondamentale-del-calcolo': '/materiale/scuola-superiore/matematica/integrali/teorema-fondamentale-del-calcolo-integrale',
	'/materiale/scuola-superiore/matematica/limiti/forme-indeterminate': '/materiale/scuola-superiore/matematica/limiti/calcolo-dei-limiti-e-forme-indeterminate',
	'/materiale/scuola-superiore/matematica/monomi-e-polinomi/grado-di-un-polinomio': '/materiale/scuola-superiore/matematica/monomi-e-polinomi/polinomi-e-grado-di-un-polinomio',
	'/materiale/scuola-superiore/matematica/monomi-e-polinomi/polinomi': '/materiale/scuola-superiore/matematica/monomi-e-polinomi/polinomi-e-grado-di-un-polinomio',
	'/materiale/scuola-superiore/matematica/monomi-e-polinomi/potenza-di-un-monomio': '/materiale/scuola-superiore/matematica/monomi-e-polinomi/operazioni-tra-monomi',
	'/materiale/scuola-superiore/matematica/numeri-razionali/conversione-da-numeri-decimali-a-frazioni': '/materiale/scuola-superiore/matematica/numeri-razionali/numeri-decimali-e-frazioni',
	'/materiale/scuola-superiore/matematica/numeri-reali/espressioni-con-reali': '/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/espressioni-con-i-radicali',
	'/materiale/scuola-superiore/matematica/numeri-reali/operazione-di-radice': '/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/radicali-e-loro-proprieta',
	'/materiale/scuola-superiore/matematica/probabilita/concetti-di-probabilita': '/materiale/scuola-superiore/matematica/probabilita/eventi-e-probabilita',
	'/materiale/scuola-superiore/matematica/probabilita/leggi-della-probabilita': '/materiale/scuola-superiore/matematica/probabilita/probabilita-della-somma-e-dell-evento-contrario',
	'/materiale/scuola-superiore/matematica/trigonometria/angoli-e-lati-dei-triangoli': '/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/triangoli-e-criteri-di-congruenza',
	'/materiale/scuola-superiore/matematica/trigonometria/teorema-di-euclide': '/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide',
	'/materiale/scuola-superiore/matematica/trigonometria/teorema-di-pitagora': '/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide',
	'/materiale/scuola-superiore/matematica/trigonometria/teorema-di-talete': '/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teorema-di-talete',
	'/materiale/scuola-superiore/matematica/trigonometria/teoremi-sui-triangoli': '/materiale/scuola-superiore/matematica/trigonometria/risoluzione-dei-triangoli-rettangoli',
	'/materiale/scuola-superiore/matematica/equazioni-e-sistemi': '/materiale/scuola-superiore/matematica/equazioni-di-primo-grado',
	'/materiale/scuola-superiore/matematica/funzioni': '/materiale/scuola-superiore/matematica/relazioni-e-funzioni',
	'/materiale/scuola-superiore/matematica/geometria-analitica': '/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta',
	'/materiale/scuola-superiore/matematica/geometria-solida': '/materiale/scuola-superiore/matematica/geometria-dello-spazio',
	'/materiale/scuola-superiore/matematica/numeri-reali': '/materiale/scuola-superiore/matematica/numeri-reali-e-radicali',
};

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
/** A URL segment decoded; malformed percent-encoding stays as typed (and then matches nothing) instead of throwing. */
export function safeDecode(segment: string): string {
	try {
		return decodeURIComponent(segment);
	} catch {
		return segment;
	}
}

export function resolvePublicPath(tree: ContentNode[], segments: string[]): ResolvedPath {
	let layer = tree;
	const ancestors: ContentNode[] = [];
	let canonical = true;
	let current: ContentNode | null = null;

	for (const raw of segments) {
		const segment = safeDecode(raw).toLowerCase();
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
