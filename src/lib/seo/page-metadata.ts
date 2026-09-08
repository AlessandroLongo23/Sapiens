import type { Metadata } from 'next';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, OG_IMAGE, SITE_LOCALE, SITE_NAME, absoluteUrl, isPrivatePath } from '@/lib/config/site';

export interface PageMeta {
	title?: string;
	description?: string;
	/** Canonical path. */
	path: string;
	/** Force noindex. Private paths (see site config) are noindex regardless. */
	noindex?: boolean;
	type?: 'website' | 'article';
	image?: { path: string; width: number; height: number; alt: string };
}

/**
 * Title, description, robots, self-referencing canonical, Open Graph and
 * Twitter card for one page, for Next's metadata API.
 */
export function pageMetadata({
	title = DEFAULT_TITLE,
	description = DEFAULT_DESCRIPTION,
	path,
	noindex = false,
	type = 'website',
	image = OG_IMAGE
}: PageMeta): Metadata {
	const canonical = absoluteUrl(path);
	const index = !noindex && !isPrivatePath(path);
	const imageUrl = absoluteUrl(image.path);
	return {
		title,
		description,
		robots: { index, follow: index },
		alternates: { canonical },
		openGraph: {
			siteName: SITE_NAME,
			locale: SITE_LOCALE,
			type,
			title,
			description,
			url: canonical,
			images: [{ url: imageUrl, width: image.width, height: image.height, alt: image.alt }]
		},
		twitter: { card: 'summary_large_image', title, description, images: [{ url: imageUrl, alt: image.alt }] }
	};
}

/** The 404 page: named, never indexed. */
export const NOT_FOUND_METADATA: Metadata = {
	title: `Pagina non trovata | ${SITE_NAME}`,
	description: 'L’indirizzo non corrisponde a nessuna pagina di Sapiens.',
	robots: { index: false, follow: false }
};

/**
 * Runs a page's metadata loader. When the loader ends in `notFound()`, the
 * 404 metadata is returned and the page itself renders the not-found view
 * with a real document (a not-found thrown from `generateMetadata` ships an
 * empty shell); redirects and other errors pass through.
 */
export async function metadataOr404(load: () => Promise<Metadata>): Promise<Metadata> {
	try {
		return await load();
	} catch (err) {
		const digest = (err as { digest?: unknown } | null)?.digest;
		if (typeof digest === 'string' && (digest === 'NEXT_NOT_FOUND' || digest.startsWith('NEXT_HTTP_ERROR_FALLBACK;404'))) return NOT_FOUND_METADATA;
		throw err;
	}
}
