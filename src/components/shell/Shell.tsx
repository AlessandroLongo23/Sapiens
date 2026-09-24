'use client';

import { useEffect, useLayoutEffect, useRef, useState, ViewTransition, type ReactNode, type UIEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { APP_START } from '@/lib/config/site';
import { useAppMode } from '@/lib/hooks/use-app-mode';
import { useSearch } from '@/lib/state/search';
import { useLessonLayout } from '@/lib/state/lesson-layout';
import type { ContentNode } from '@/lib/utils/tree';
import { cn } from '@/lib/utils/cn';
import { ContentTreeProvider } from './ContentTreeContext';
import { Header } from './Header';
import { MobileTabBar } from './MobileTabBar';
import { SearchOverlay } from './SearchOverlay';
import { Footer } from './Footer';

// Pages that take the whole phone screen and bring their own chrome.
const IMMERSIVE_PATHS = [/^\/materiale\/[^/]+\/[^/]+\/[^/]+\/[^/]+/, /^\/zaino\/nota\/[^/]+/];

/**
 * The page frame: header, the scrolling area with the page and the footer,
 * and the phone tab bar. The page scrolls inside the frame, not the window.
 * On phones the header slides away while scrolling down and comes back on
 * the first scroll up, like the browser's own bar. Lesson pages take the
 * whole phone screen, and so does the note editor: no site header, footer or
 * tab bar, the page brings its own. The URL shape decides that on the server; once a lesson frame (or
 * a 404 in its place) has mounted, its word counts.
 *
 * In the installed app the footer goes (its links are in the Profilo sheet),
 * page changes fade the content (see `.page` in globals.css), and the landing
 * page, reached through a link, gives way to the app's start.
 */
export function Shell({ tree = [], children }: { tree?: ContentNode[]; children: ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const app = useAppMode();
	const searching = useSearch((s) => s.isActive);
	const frameMounted = useLessonLayout((s) => s.frameMounted);
	const scroller = useRef<HTMLDivElement>(null);
	const lastTop = useRef(0);
	const popped = useRef(false);
	const [hidden, setHidden] = useState(false);
	const [shownPath, setShownPath] = useState(pathname);
	const immersive = IMMERSIVE_PATHS.some((re) => re.test(pathname)) && frameMounted !== false;
	if (pathname !== shownPath) {
		setShownPath(pathname);
		setHidden(false);
	}

	const onScroll = (e: UIEvent<HTMLDivElement>) => {
		const top = e.currentTarget.scrollTop;
		const delta = top - lastTop.current;
		if (top < 64) setHidden(false);
		else if (delta > 8) setHidden(true);
		else if (delta < -8) setHidden(false);
		lastTop.current = top;
	};

	// A new page starts at the top; going back keeps the position the browser restored.
	useEffect(() => {
		const onPop = () => (popped.current = true);
		window.addEventListener('popstate', onPop);
		return () => window.removeEventListener('popstate', onPop);
	}, []);
	useLayoutEffect(() => {
		if (!popped.current && scroller.current) scroller.current.scrollTop = 0;
		popped.current = false;
		lastTop.current = scroller.current?.scrollTop ?? 0;
	}, [pathname]);

	useEffect(() => {
		if (app && pathname === '/') router.replace(APP_START);
	}, [app, pathname, router]);

	// The header's height, for the search overlay and the mega menu.
	useEffect(() => {
		const bar = document.getElementById('site-header-bar');
		if (!bar) return;
		const apply = () => document.documentElement.style.setProperty('--header-h', `${bar.offsetHeight}px`);
		apply();
		const ro = new ResizeObserver(apply);
		ro.observe(bar);
		return () => ro.disconnect();
	}, []);

	return (
		<ContentTreeProvider tree={tree}>
			<div className="relative z-10 flex h-dvh flex-col">
				<SearchOverlay />
				{/* While the search overlay is up the page is faded out and inert, so neither Tab nor a screen reader lands on it. */}
				<div ref={scroller} onScroll={onScroll} inert={searching || undefined} className={cn('no-scrollbar flex-1 overflow-y-auto transition-opacity duration-300 ease-out', !immersive && 'pb-tabbar md:pb-0', immersive && 'overflow-hidden', searching ? 'pointer-events-none opacity-0' : 'opacity-100')}>
					<Header hidden={hidden} immersive={immersive} />
					<main id="contenuto" tabIndex={-1} className="min-h-[calc(100dvh-var(--header-h,64px))] outline-none">
						<ViewTransition update="page" default="none">
							<div>{children}</div>
						</ViewTransition>
					</main>
					{!immersive && (
						<div className="app:max-md:hidden">
							<Footer />
						</div>
					)}
				</div>
				{!immersive && !searching && <MobileTabBar />}
			</div>
		</ContentTreeProvider>
	);
}
