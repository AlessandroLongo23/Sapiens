import type { ReactNode } from 'react';
import { Shell } from '@/components/shell/Shell';
import { LEVELS } from '@/lib/content/levels';
import 'katex/dist/katex.min.css';

/**
 * Public content pages are rendered on their first visit and then served as
 * static HTML from Vercel's cache. They have no timer: the scripts that
 * publish to the database call /api/revalidate, and each page is rendered
 * again on its next visit. Vercel bills every regeneration whose output
 * differs by a byte, and the same content does not always render to the same
 * bytes (the order of the streamed rows follows which data arrived first), so
 * a timer rewrote pages that had not changed. The header's levels are a
 * constant, and the browser fetches the rest of the tree when the level menu
 * or the search needs it.
 */
export default function LibraryLayout({ children }: { children: ReactNode }) {
	return <Shell tree={LEVELS}>{children}</Shell>;
}
