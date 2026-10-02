import type { ReactNode } from 'react';
import { Shell } from '@/components/shell/Shell';
import { getMenuTree } from '@/lib/server/content';
import 'katex/dist/katex.min.css';

/**
 * Public content pages are rendered once and served as static HTML from
 * Vercel's edge cache, regenerated in the background every hour so lessons
 * published to the database appear without a redeploy. Vercel bills each
 * regeneration by the size of the page (Next does not render the head in a
 * stable order, so a regeneration counts as new even when nothing changed):
 * hence the hour, and the layout handing the shell the levels only (see
 * `getMenuTree`).
 */
export const revalidate = 3600;

export default async function LibraryLayout({ children }: { children: ReactNode }) {
	return <Shell tree={await getMenuTree()}>{children}</Shell>;
}
