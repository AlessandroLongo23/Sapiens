import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { isStaff } from '@/lib/auth/entitlements';
import { currentUser } from '@/lib/server/auth';
import { Shell } from '@/components/shell/Shell';
import { getMenuTree } from '@/lib/server/content';
import 'katex/dist/katex.min.css';

/**
 * Admin area: never indexed (the proxy adds X-Robots-Tag too) and only for
 * staff. The proxy already turns non-staff away; the layout checks again so
 * the pages under it never render for anyone else, whatever reaches them.
 */
export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: ReactNode }) {
	if (!isStaff(await currentUser())) redirect('/');
	return (
		<Shell tree={await getMenuTree()}>
			<div className="min-h-screen bg-page-alt text-fg">{children}</div>
		</Shell>
	);
}
