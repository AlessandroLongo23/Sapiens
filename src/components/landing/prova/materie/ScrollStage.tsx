'use client';

import { createContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import type { Turn } from './turn';

/** Bump when the models in public/onboarding are exported again. */
const VERSION = 6;
/** The layout that pins the stage: a wide screen, and nobody asking for less motion (the same query as landing.css). */
const PINNED = '(min-width: 64rem) and (prefers-reduced-motion: no-preference)';

/** Whether the stage a tool is in is on or near the screen: a tool mounts only then (tools.tsx). */
export const StageLive = createContext(false);

const unit = (x: number) => Math.max(0, Math.min(1, x));
/** From 0 at `a` to 1 at `b`, eased at both ends. */
const ease = (a: number, b: number, x: number) => {
	const t = unit((x - a) / (b - a));
	return t * t * (3 - 2 * t);
};

/**
 * One subject of the scrolling landing page. On a wide screen the stage is a few screens
 * tall and its content stays pinned while the page scrolls through it; the fraction
 * scrolled, p from 0 to 1, places three things, each with a transform and nothing else:
 * the object, which slides in from its side, grows, and leaves over the top; the lesson,
 * which comes up from below and goes on up; the tool, which follows it and stays. The
 * object is the subject's model drawn live (turn.ts), turned and moved by p: where there is
 * no WebGL the still of its card stands in. Nothing fades and nothing lags behind
 * the scroll: the page arrives and leaves by scrolling, as any page does.
 *
 * On a phone, and with reduced motion, nothing is pinned: object, lesson and tool follow
 * one another down the page, and the object only turns as it crosses the screen.
 */
export function ScrollStage({ tone, side, model, label, head, lesson, tool }: { tone: string; side: 'left' | 'right'; model: string; label: string; head: ReactNode; lesson: ReactNode; tool: ReactNode }) {
	const root = useRef<HTMLElement>(null);
	const picture = useRef<HTMLDivElement>(null);
	const canvas = useRef<HTMLCanvasElement>(null);
	const slides = useRef<HTMLDivElement>(null);
	const first = useRef<HTMLDivElement>(null);
	const second = useRef<HTMLDivElement>(null);
	/** What the page shows of the stage, changed only when it changes: the scroll itself never renders. */
	const [state, setState] = useState({ pinned: false, phase: 'lesson' as 'lesson' | 'tool', drawn: false, live: false });
	const [still, setStill] = useState(false);

	useEffect(() => {
		const stage = root.current;
		const box = picture.current;
		const cv = canvas.current;
		const frame = slides.current;
		const a = first.current;
		const b = second.current;
		if (!stage || !box || !cv || !frame || !a || !b) return;
		let scroller: HTMLElement | null = stage.parentElement;
		while (scroller && !/(auto|scroll)/.test(getComputedStyle(scroller).overflowY)) scroller = scroller.parentElement;
		const pinned = window.matchMedia(PINNED);
		const dir = side === 'left' ? -1 : 1;
		let turn: Turn | null = null;
		let asked = false;
		let gone = false;
		let p = 0;
		let queued = 0;
		let shown = { pinned: false, phase: 'lesson' as 'lesson' | 'tool', drawn: false, live: false };

		const draw = (at: number) => turn?.draw(at, Math.round(Math.min(box.clientWidth, 640) * Math.min(window.devicePixelRatio || 1, 2)));
		/** Fetches three.js and the model when the stage comes near, not before. */
		const load = () => {
			if (asked) return;
			asked = true;
			import('./turn')
				.then(({ createTurn }) => {
					if (gone) return;
					turn = createTurn(cv, model, `/onboarding/high_school-${model}.glb?v=${VERSION}`);
					draw(p);
				})
				.catch(() => setStill(true));
		};

		const place = () => {
			queued = 0;
			const port = scroller?.getBoundingClientRect();
			const top = port?.top ?? 0;
			const height = scroller?.clientHeight ?? window.innerHeight;
			const rect = stage.getBoundingClientRect();
			const near = rect.top < top + height * 1.5 && rect.bottom > top - height * 0.5;
			const next = { ...shown, pinned: pinned.matches, live: near };
			if (near) load();
			if (pinned.matches) {
				// how far the stage has scrolled under the header, over the room it has to scroll
				const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64;
				p = unit((top + header - rect.top) / Math.max(1, rect.height - (height - header)));
				const come = ease(0, 0.16, p);
				const go = ease(0.86, 1, p);
				box.style.transform = `translate3d(${((1 - come) * dir * 125).toFixed(2)}%, ${(-go * 135).toFixed(2)}%, 0) rotate(${((1 - come) * dir * 16).toFixed(2)}deg) scale(${(0.62 + 0.38 * come + 0.06 * p).toFixed(4)})`;
				// the lesson comes up from under the frame and goes on up; the tool follows it and stays
				const tall = frame.clientHeight;
				a.style.transform = `translate3d(0, ${Math.round((1 - ease(0.02, 0.14, p)) * tall - ease(0.42, 0.56, p) * (tall + 40))}px, 0)`;
				b.style.transform = `translate3d(0, ${Math.round((1 - ease(0.44, 0.58, p)) * (tall + 40))}px, 0)`;
				next.phase = p < 0.5 ? 'lesson' : 'tool';
				if (p > 0.1) next.drawn = true;
				else if (p < 0.01) next.drawn = false;
			} else {
				// in the flow: how far the object has crossed the screen, from entering at the bottom to leaving at the top
				const own = box.getBoundingClientRect();
				p = unit((top + height - own.top) / (height + own.height));
				box.style.transform = `scale(${(0.84 + 0.26 * p).toFixed(4)})`;
				a.style.transform = b.style.transform = '';
				next.drawn = true;
			}
			draw(p);
			if (next.pinned !== shown.pinned || next.phase !== shown.phase || next.drawn !== shown.drawn || next.live !== shown.live) setState((shown = next));
		};
		const ask = () => {
			if (!queued) queued = requestAnimationFrame(place);
		};

		ask();
		const listener = scroller ?? window;
		listener.addEventListener('scroll', ask, { passive: true });
		window.addEventListener('resize', ask);
		pinned.addEventListener('change', ask);
		return () => {
			listener.removeEventListener('scroll', ask);
			window.removeEventListener('resize', ask);
			pinned.removeEventListener('change', ask);
			cancelAnimationFrame(queued);
			gone = true;
			turn?.destroy();
		};
	}, [model, side]);

	const { pinned, phase, drawn, live } = state;
	return (
		<section ref={root} data-subject={tone} data-side={side} data-drawn={drawn ? '' : undefined} className="lp-stage">
			<div className="lp-stage-pin">
				<div className="lp-stage-halo" aria-hidden="true">
					<span className="grid-paper absolute inset-0 [--grid:color-mix(in_oklab,var(--tint)_16%,transparent)]" />
				</div>
				<div ref={picture} className="lp-stage-object">
					<canvas ref={canvas} role="img" aria-label={label} hidden={still} />
					{/* eslint-disable-next-line @next/next/no-img-element */}
					{still && <img src={`/materie/high_school-${model}.webp`} alt={label} width={480} height={480} className="size-full" />}
				</div>
				<div className="lp-stage-words">
					<div className="lp-stage-head">{head}</div>
					<div ref={slides} className="lp-stage-slides">
						<div ref={first} className="lp-slide" inert={pinned && phase !== 'lesson' ? true : undefined}>
							{lesson}
						</div>
						<div ref={second} className="lp-slide" inert={pinned && phase !== 'tool' ? true : undefined}>
							<StageLive value={live}>{tool}</StageLive>
						</div>
					</div>
					<ol className="lp-stage-rail label-mono" aria-hidden="true">
						<li className={cn(phase === 'lesson' && 'is-on')}>La lezione</li>
						<li className={cn(phase === 'tool' && 'is-on')}>Lo strumento</li>
					</ol>
				</div>
			</div>
		</section>
	);
}
