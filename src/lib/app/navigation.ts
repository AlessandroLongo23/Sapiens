import { APP_START, CONTENT_ROOT, TUTORING_ROOT, ZAINO_ROOT } from '@/lib/config/site';

/** The pages the app's tabs open. They have no back arrow: the tab bar is the way out. */
const TAB_ROOTS = new Set([APP_START, CONTENT_ROOT, ZAINO_ROOT, TUTORING_ROOT]);

/** Path prefixes that are not pages of their own, skipped when going up. */
const NOT_PAGES = new Set(['/zaino/nota']);

export const isAppTabRoot = (pathname: string): boolean => TAB_ROOTS.has(pathname);

/**
 * Where "up" leads from a page: the nearest ancestor path that is a page
 * (a lesson goes to its chapter, a tutor profile to the tutor list). Pages
 * with no ancestor, like the FAQ, go to the app's start.
 */
export function parentPath(pathname: string): string {
	const parts = pathname.split('/').filter(Boolean);
	while (parts.length > 1) {
		parts.pop();
		const path = `/${parts.join('/')}`;
		if (!NOT_PAGES.has(path)) return path;
	}
	return APP_START;
}

/**
 * How many pages deep the student went inside the app since it opened. The
 * back arrow goes back in history while there is some (so it returns to the
 * search results or the list the student came from), and up to the parent
 * page once there is none (an app opened from a link or a notification).
 * Kept by Boot, which lives in the root layout and so sees every navigation.
 */
let depth = 0;
export const appHistory = {
	forward: () => void (depth += 1),
	back: () => void (depth = Math.max(0, depth - 1)),
	canGoBack: () => depth > 0
};
