import type { ReactNode } from 'react';
import { Shell } from '@/components/shell/Shell';
import { LEVELS } from '@/lib/content/levels';

/**
 * Marketing, tutoring and account pages. The layout reads nothing: the header
 * draws the levels from a constant, so a page with static content is built
 * once per deployment and never regenerated. The pages under here that show
 * data set their own caching.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
	return <Shell tree={LEVELS}>{children}</Shell>;
}
