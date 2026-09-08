'use client';

import { useEffect, useState } from 'react';

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** Counts up to `target` when it mounts. */
export function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
	const [value, setValue] = useState(0);
	useEffect(() => {
		// Reduced motion: the count lands on the first frame.
		const length = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : duration;
		let frame = 0;
		const start = performance.now();
		const tick = (now: number) => {
			const t = length === 0 ? 1 : Math.min(1, (now - start) / length);
			setValue(Math.round(easeInOut(t) * target));
			if (t < 1) frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [target, duration]);
	return <span className="tabular-nums">{value}</span>;
}
