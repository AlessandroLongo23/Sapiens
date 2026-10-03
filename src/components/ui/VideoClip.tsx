'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/** The clip that is playing: starting another one stops it, so a page of clips moves in one place at a time. */
let playing: HTMLVideoElement | null = null;

/**
 * A short silent film that shows how something is done, with Sapiens's own controls in place of the browser's: a
 * round button to play and to stop, and a thin line that fills as the film goes on, to drag or to click. The film
 * loads when it is first played; until then the picture is its poster. A click anywhere on the film plays or stops it.
 */
export function VideoClip({
	sources,
	poster,
	label,
	width,
	height,
	className,
	videoClassName
}: {
	/** The same film in more than one format, the first the browser can play is used. */
	sources: { src: string; type: string }[];
	poster: string;
	/** What the film shows, for who cannot see it: "Filmato: retta per due punti". */
	label: string;
	width: number;
	height: number;
	className?: string;
	videoClassName?: string;
}) {
	const video = useRef<HTMLVideoElement>(null);
	const bar = useRef<HTMLDivElement>(null);
	const fill = useRef<HTMLDivElement>(null);
	const [on, setOn] = useState(false);
	/** Where the film is, on the line and for who reads the page by ear. */
	const show = (at: number) => {
		if (fill.current) fill.current.style.width = `${at * 100}%`;
		bar.current?.setAttribute('aria-valuenow', String(Math.round(at * 100)));
	};

	// The line follows the film frame by frame while it plays: a state for it would draw the whole clip again each time.
	useEffect(() => {
		if (!on) return;
		let id = 0;
		const tick = () => {
			const v = video.current;
			if (v?.duration) show(v.currentTime / v.duration);
			id = requestAnimationFrame(tick);
		};
		id = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(id);
	}, [on]);

	const toggle = () => {
		const v = video.current;
		if (!v) return;
		if (v.paused) void v.play().catch(() => {});
		else v.pause();
	};
	const seek = (clientX: number) => {
		const v = video.current;
		const box = bar.current?.getBoundingClientRect();
		if (!v || !box || !v.duration) return;
		const at = Math.min(1, Math.max(0, (clientX - box.left) / box.width));
		v.currentTime = at * v.duration;
		show(at);
	};

	return (
		<div className={cn('group relative overflow-hidden', className)}>
			<video
				ref={video}
				className={cn('block h-auto w-full cursor-pointer', videoClassName)}
				width={width}
				height={height}
				poster={poster}
				loop
				muted
				playsInline
				preload="none"
				aria-label={label}
				onClick={toggle}
				onPlay={(e) => {
					if (playing && playing !== e.currentTarget) playing.pause();
					playing = e.currentTarget;
					setOn(true);
				}}
				onPause={(e) => {
					if (playing === e.currentTarget) playing = null;
					setOn(false);
				}}
			>
				{sources.map((s) => (
					<source key={s.type} src={s.src} type={s.type} />
				))}
			</video>

			{/* in the middle while the film is still; once it plays it steps aside, and comes back under the pointer or the focus */}
			<button
				type="button"
				onClick={toggle}
				aria-label={on ? `Ferma. ${label}` : `Riproduci. ${label}`}
				className={cn(
					'absolute top-1/2 left-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-edge-strong bg-surface text-fg-strong shadow-lift transition-[opacity,scale] duration-200 hover:bg-surface-3 focus-ring active:scale-95 motion-reduce:transition-none',
					on && 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100 pointer-coarse:group-hover:opacity-0'
				)}
			>
				{on ? <Pause className="size-5" aria-hidden="true" /> : <Play className="size-5 translate-x-px" aria-hidden="true" />}
			</button>

			{/* a wide strip to press, a thin line to see */}
			<div
				ref={bar}
				role="slider"
				tabIndex={0}
				aria-label="Posizione nel filmato"
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={0}
				className={cn('absolute inset-x-0 bottom-0 flex h-4 cursor-pointer touch-none items-end outline-none transition-opacity duration-200 motion-reduce:transition-none', on ? 'opacity-100' : 'opacity-0 focus-visible:opacity-100')}
				onPointerDown={(e) => {
					e.currentTarget.setPointerCapture(e.pointerId);
					seek(e.clientX);
				}}
				onPointerMove={(e) => e.buttons === 1 && seek(e.clientX)}
				onKeyDown={(e) => {
					const v = video.current;
					if (!v || !v.duration || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
					e.preventDefault();
					v.currentTime = Math.min(v.duration, Math.max(0, v.currentTime + (e.key === 'ArrowLeft' ? -0.5 : 0.5)));
					show(v.currentTime / v.duration);
				}}
			>
				<div className="h-1 w-full bg-edge-strong/60 transition-[height] group-hover:h-1.5 group-focus-within:h-1.5">
					<div ref={fill} className="h-full w-0 bg-accent" />
				</div>
			</div>
		</div>
	);
}
