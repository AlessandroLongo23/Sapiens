'use client';

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode, type RefObject } from 'react';
import { cn } from '@/lib/utils/cn';

/** Whether `ref` has come on screen: once by default, or tracking it in and out. */
export function useInView<T extends Element>(ref: RefObject<T | null>, { once = true, threshold = 0.25, margin = '0px' }: { once?: boolean; threshold?: number; margin?: string } = {}) {
	const [inView, setInView] = useState(false);
	useEffect(() => {
		const node = ref.current;
		if (!node) return;
		const io = new IntersectionObserver(
			([entry]) => {
				setInView(entry.isIntersecting);
				if (entry.isIntersecting && once) io.disconnect();
			},
			{ threshold, rootMargin: margin }
		);
		io.observe(node);
		return () => io.disconnect();
	}, [ref, once, threshold, margin]);
	return inView;
}

/**
 * Marks its element `data-in` when it comes on screen; what happens then is CSS
 * (`.lp-reveal` and the drawings that wait for `[data-in]`, in landing.css). Without
 * scripting or with reduced motion the content is simply there.
 */
export function Reveal({
	as: Tag = 'div',
	className,
	delay = 0,
	threshold = 0.25,
	bare = false,
	style,
	children,
	...rest
}: {
	style?: CSSProperties;
	as?: ElementType;
	className?: string;
	/** Seconds before the element comes in, for a group that arrives in turn. */
	delay?: number;
	threshold?: number;
	/** Only mark `data-in`: no fade of its own. */
	bare?: boolean;
	children?: ReactNode;
	[key: `data-${string}`]: string | undefined;
}) {
	const ref = useRef<HTMLElement>(null);
	const inView = useInView(ref, { threshold });
	return (
		<Tag ref={ref} data-in={inView ? '' : undefined} className={cn(!bare && 'lp-reveal', className)} style={delay ? ({ ...style, '--lp-d': `${delay}s` } as CSSProperties) : style} {...rest}>
			{children}
		</Tag>
	);
}
