'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';

/** Bump when the films in public/landing/film are recorded again (scripts/landing/film-*.mjs). */
const VERSION = 3;

/**
 * The film of a tool, over the still of its tile (`[data-tile]`). Under a mouse it plays while the pointer or the
 * focus is on the tile, and goes back to the still when it leaves; on a touch screen, where nothing hovers, it plays
 * while the tile is nearly all on screen. The film is asked for the first time it plays. With reduced motion there
 * is only the still.
 */
export function TileFilm({ name, className }: { name: string; className?: string }) {
	const film = useRef<HTMLVideoElement>(null);
	const [playing, setPlaying] = useState(false);

	useEffect(() => {
		const video = film.current;
		const tile = video?.closest('[data-tile]');
		if (!video || !tile || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const play = () => void video.play().catch(() => {});
		const stop = () => {
			video.pause();
			setPlaying(false);
		};
		if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
			// The still is the film's poster, not always its first frame: leaving rewinds, so the next visit starts from the beginning.
			const leave = () => {
				stop();
				if (video.readyState > 0) video.currentTime = 0;
			};
			tile.addEventListener('pointerenter', play);
			tile.addEventListener('pointerleave', leave);
			tile.addEventListener('focusin', play);
			tile.addEventListener('focusout', leave);
			return () => {
				tile.removeEventListener('pointerenter', play);
				tile.removeEventListener('pointerleave', leave);
				tile.removeEventListener('focusin', play);
				tile.removeEventListener('focusout', leave);
			};
		}
		const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : stop()), { threshold: 0.85 });
		io.observe(tile);
		return () => io.disconnect();
	}, []);

	return (
		<video ref={film} muted loop playsInline preload="none" onPlaying={() => setPlaying(true)} onError={() => setPlaying(false)} className={cn('absolute inset-0 size-full transition-opacity duration-200', className, !playing && 'opacity-0')} aria-hidden="true">
			<source src={`/landing/film/${name}.webm?v=${VERSION}`} type="video/webm" />
			<source src={`/landing/film/${name}.mp4?v=${VERSION}`} type="video/mp4" />
		</video>
	);
}
