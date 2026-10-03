'use client';

import { useEffect, useRef, useState } from 'react';
import { FastForward } from 'lucide-react';
import { Stage } from './turtle';

/** The turtle's canvas, as wide as the console and in the proportions of the turtle's world; `onStage` gets the player. */
export function TurtleCanvas({ onStage }: { onStage: (stage: Stage | null) => void }) {
	const canvas = useRef<HTMLCanvasElement>(null);
	const stage = useRef<Stage | null>(null);
	const [state, setState] = useState({ width: 640, height: 480, playing: false });

	useEffect(() => {
		const node = canvas.current!;
		const player = new Stage(node, (next) => setState((now) => (now.width === next.width && now.height === next.height && now.playing === next.playing ? now : next)));
		stage.current = player;
		player.resize();
		const observer = new ResizeObserver(() => player.resize());
		observer.observe(node);
		onStage(player);
		return () => {
			observer.disconnect();
			player.dispose();
			stage.current = null;
			onStage(null);
		};
	}, [onStage]);

	return (
		<div className="relative mb-3 font-sans">
			<canvas
				ref={canvas}
				role="img"
				aria-label="Il disegno della tartaruga"
				style={{ aspectRatio: `${state.width} / ${state.height}` }}
				className="block w-full rounded-lg border border-edge shadow-paper"
			/>
			{state.playing && (
				<button
					type="button"
					onClick={() => stage.current?.skip()}
					className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-lg border border-edge bg-surface/90 px-2 py-1 text-xs font-medium text-fg-muted shadow-paper hover:text-fg focus-ring"
				>
					<FastForward className="size-3.5" aria-hidden="true" />
					Salta
				</button>
			)}
		</div>
	);
}
