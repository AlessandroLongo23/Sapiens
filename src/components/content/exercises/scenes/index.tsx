'use client';

import type { ComponentType } from 'react';
import type { SceneRef } from '@/lib/exercises/v2/types';
import BloccoForze from './BloccoForze';

/**
 * The drawings of the exercises that change with the numbers (a block on an incline at the exercise's angle): each
 * `SceneRef.type` has a component here that draws `data` with the kit of the interactive figures
 * (src/components/content/interactive/kit.tsx and fisica.tsx), still. They render on the server with the page, so
 * the printable sheet has them too. One file per type in this folder, registered below.
 */
export type SceneProps = { data: Record<string, unknown>; alt: string };

const SCENES: Record<string, ComponentType<SceneProps>> = {
	'blocco-forze': BloccoForze,
	// Physics, first year: measurement.
	// Physics, first year: graphs.
	// Physics, first year: vectors.
	// Physics, first year: forces.
};

export function SceneFigure({ scene, className }: { scene: SceneRef; className?: string }) {
	const Scene = SCENES[scene.type];
	if (!Scene) return <p className="sr-only">{scene.alt}</p>;
	return (
		<figure className={`scene-figure m-0 flex justify-center ${className ?? ''}`}>
			<Scene data={scene.data} alt={scene.alt} />
		</figure>
	);
}
