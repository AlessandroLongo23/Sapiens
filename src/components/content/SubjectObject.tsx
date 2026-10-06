'use client';

import { useEffect, useRef, useState } from 'react';

/** Bump when the files in public/materie are exported again: a browser holding an old still would show it under a new film. */
const VERSION = 9;

/**
 * The object on a card of the library: a still, and a short film of it moving, which
 * starts and ends on the still. The film is fetched the first time the
 * card is under a mouse and plays while it stays there; when the mouse leaves, the loop
 * runs to its end and the still comes back, so the object never jumps. Chrome and
 * Firefox get VP9 with alpha, Safari HEVC with alpha (see scripts/materie/export.py).
 */
export function SubjectObject({ id, className }: { id: string; className?: string }) {
	const box = useRef<HTMLSpanElement>(null);
	const film = useRef<HTMLVideoElement>(null);
	const over = useRef(false);
	const [src, setSrc] = useState<string | null>(null);
	const [playing, setPlaying] = useState(false);

	const play = () => {
		const v = film.current;
		if (!v || !over.current) return;
		v.loop = true;
		v.play().then(() => setPlaying(true), () => {});
	};

	useEffect(() => {
		const card = box.current?.closest('.subject-card');
		if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const enter = (e: Event) => {
			if ((e as PointerEvent).pointerType !== 'mouse') return;
			over.current = true;
			const safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
			setSrc(`/materie/${id}.${safari ? 'mov' : 'webm'}?v=${VERSION}`);
			play();
		};
		const leave = () => {
			over.current = false;
			if (film.current) film.current.loop = false;
		};
		card.addEventListener('pointerenter', enter);
		card.addEventListener('pointerleave', leave);
		return () => {
			card.removeEventListener('pointerenter', enter);
			card.removeEventListener('pointerleave', leave);
		};
	}, [id]);

	const end = () => {
		const v = film.current;
		if (!v) return;
		v.currentTime = 0;
		if (over.current) play();
		else setPlaying(false);
	};

	return (
		<span ref={box} className={`relative block ${className ?? ''}`}>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img src={`/materie/${id}.webp?v=${VERSION}`} alt="" width={480} height={480} loading="lazy" decoding="async" className="size-full" style={{ opacity: playing ? 0 : 1 }} />
			{src && <video ref={film} src={src} muted playsInline preload="auto" onCanPlay={play} onEnded={end} className="absolute inset-0 size-full" style={{ opacity: playing ? 1 : 0 }} />}
		</span>
	);
}
