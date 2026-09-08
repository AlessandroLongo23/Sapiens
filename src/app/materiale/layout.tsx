import type { ReactNode } from 'react';
import { Shell } from '@/components/shell/Shell';
import { getMenuTree } from '@/lib/server/content';
import 'katex/dist/katex.min.css';

/**
 * Public content pages are rendered once and served as static HTML from
 * Vercel's edge cache, regenerated in the background every 10 minutes so
 * edits made in the admin area appear without a redeploy. The tree shipped
 * to the browser is slimmed to what cards, navigation and the menu read.
 */
export const revalidate = 600;

export default async function LibraryLayout({ children }: { children: ReactNode }) {
	return <Shell tree={await getMenuTree()}>{children}</Shell>;
}
