'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** On a computer the conversation pane is never empty: the most recent conversation opens by itself. On a phone the list is the page. */
export function OpenLatest({ linkId }: { linkId: string }) {
	const router = useRouter();
	useEffect(() => {
		if (window.matchMedia('(min-width: 1024px)').matches) router.replace(`/messaggi/${linkId}`);
	}, [router, linkId]);
	return null;
}
