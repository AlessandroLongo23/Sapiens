import type { ReactNode } from 'react';
import { Shell } from '@/components/shell/Shell';
import { getMenuTree } from '@/lib/server/content';

/**
 * Marketing, tutoring and account pages. They carry the content tree only for
 * the header's level menu, which is the same on every page of the site; the
 * pages under here that need fresh data set their own dynamic rendering.
 */
export const revalidate = 600;

export default async function SiteLayout({ children }: { children: ReactNode }) {
	return <Shell tree={await getMenuTree()}>{children}</Shell>;
}
