'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';

/** Bump when the files of the scene in public/landing are exported again. */
const VERSION = 2;
/** Where the loop starts in the film, in seconds: the frames before it are the objects coming in (scripts/landing/scena.py). */
const LOOP_FROM = 40 / 30;

/**
 * The still life of the hero: the objects of the subjects, rendered together
 * (scripts/landing/scena.py). The film shows them popping in one after the other, then
 * loops with each one moving as on its card; it stops while it is off screen. Until the
 * film can play, and always with reduced motion, the picture is the still. Chrome and
 * Firefox get VP9 with alpha, Safari HEVC with alpha.
 */
export function HeroScene({ className }: { className?: string }) {
	const box = useRef<HTMLDivElement>(null);
	const film = useRef<HTMLVideoElement>(null);
	const [playing, setPlaying] = useState(false);

	// The film is asked for only where it will play, and plays only while it is on screen.
	useEffect(() => {
		const node = box.current;
		const video = film.current;
		if (!node || !video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		video.src = `/landing/scena.${safari ? 'mov' : 'webm'}?v=${VERSION}`;
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) video.play().catch(() => {});
				else video.pause();
			},
			{ threshold: 0.2 }
		);
		io.observe(node);
		return () => io.disconnect();
	}, []);

	const again = () => {
		const video = film.current;
		if (!video) return;
		video.currentTime = LOOP_FROM;
		video.play().catch(() => {});
	};

	return (
		<div ref={box} className={cn('relative aspect-[2/1] w-full', className)}>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img src={`/landing/scena.webp?v=${VERSION}`} alt="Una pila di libri, un compasso che traccia un cerchio, un pendolo di Newton, tre tasti e una beuta da cui escono bolle" width={2400} height={1200} decoding="async" className={cn('lp-poster absolute inset-0 size-full select-none', playing && 'invisible')} draggable={false} />
			<video ref={film} muted playsInline preload="auto" onPlaying={() => setPlaying(true)} onEnded={again} onError={() => setPlaying(false)} className={cn('absolute inset-0 size-full', !playing && 'opacity-0')} aria-hidden="true" />
		</div>
	);
}
