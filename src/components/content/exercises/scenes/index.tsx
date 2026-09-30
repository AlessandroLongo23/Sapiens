'use client';

import type { ComponentType } from 'react';
import type { SceneRef } from '@/lib/exercises/v2/types';
import BloccoForze from './BloccoForze';
import Righello from './Righello';
import CilindroGraduato from './CilindroGraduato';
import Calibro from './Calibro';
import VettoriPiano from './VettoriPiano';
import Bersaglio from './Bersaglio';
import GraficoDati from './GraficoDati';
import Dinamometro from './Dinamometro';
import MollaRighello from './MollaRighello';
import PuntoForze from './PuntoForze';

/**
 * The drawings of the exercises that change with the numbers (a block on an incline at the exercise's angle): each
 * `SceneRef.type` has a component here that draws `data` with the kit of the interactive figures
 * (src/components/content/interactive/kit.tsx and fisica.tsx), still. They render on the server with the page, so
 * the printable sheet has them too. One file per type in this folder, registered below.
 */
export type SceneProps = { data: Record<string, unknown>; alt: string };

const SCENES: Record<string, ComponentType<SceneProps>> = {
	'blocco-forze': BloccoForze,
	// Physics, first year: quantities and units (group 1).
	'righello': Righello,
	'cilindro-graduato': CilindroGraduato,
	'calibro': Calibro,
	// Physics, first year: errors and uncertainty (group 2).
	'bersaglio': Bersaglio,
	// Physics, first year: graphs (group 3).
	'grafico-dati': GraficoDati,
	// Physics, first year: vectors (group 4).
	'vettori-piano': VettoriPiano,
	// Physics, first year: forces (group 5).
	'dinamometro': Dinamometro,
	'molla-righello': MollaRighello,
	'punto-forze': PuntoForze,
	// Physics, first year: equilibrium of a point (group 6).
	// Physics, first year: rigid bodies and levers (group 7).
	// Physics, first year: pressure, Pascal and Stevin (group 8).
	// Physics, first year: atmosphere and Archimedes (group 9).
	// Physics, first year: rays and mirrors (group 10).
	// Physics, first year: refraction and lenses (group 11).
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
