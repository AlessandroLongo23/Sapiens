'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { appHistory, isAppTabRoot, parentPath } from '@/lib/app/navigation';
import { useAppMode } from '@/lib/hooks/use-app-mode';

/** The installed app's back arrow, in place of the logo on every page but the tabs' own. */
export function AppBackButton() {
	const app = useAppMode();
	const pathname = usePathname();
	const router = useRouter();
	if (!app || isAppTabRoot(pathname)) return null;
	const back = () => (appHistory.canGoBack() ? router.back() : router.push(parentPath(pathname)));
	return (
		<button type="button" onClick={back} className="-ml-1 flex size-[44px] shrink-0 items-center justify-center rounded-xl text-fg-muted active:bg-surface-3 focus-ring md:hidden" aria-label="Indietro">
			<ArrowLeft className="size-6" aria-hidden="true" />
		</button>
	);
}
