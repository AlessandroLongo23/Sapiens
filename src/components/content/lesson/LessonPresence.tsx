'use client';

import { useLayoutEffect } from 'react';
import { useLessonLayout } from '@/lib/state/lesson-layout';

/**
 * Tells the shell whether a full-screen frame is on screen (a lesson, the note
 * editor). The shell guesses from the URL on the server; a page that mounts one
 * of these settles it, so a 404 under a full-screen address gets the site
 * header and tab bar back.
 */
function usePresence(present: boolean) {
	const setFrameMounted = useLessonLayout((s) => s.setFrameMounted);
	useLayoutEffect(() => {
		setFrameMounted(present);
		return () => setFrameMounted(null);
	}, [present, setFrameMounted]);
}

export function ImmersiveFrame() {
	usePresence(true);
	return null;
}

export function NoImmersiveFrame() {
	usePresence(false);
	return null;
}
