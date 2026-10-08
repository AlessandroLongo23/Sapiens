'use client';

import dynamic from 'next/dynamic';
import { use, type ReactNode } from 'react';
import { texNum } from '@/components/content/interactive/kit';
import type { LessonSceneSpec } from '@/components/sandbox/LessonScene';
import type { OrbitalPreset } from '@/components/orbitali/OrbitalFigure';
import { incline } from '@/lib/sandbox/scenes';
import { Spinner } from '@/components/ui/Spinner';
import { StageLive } from './ScrollStage';

/*
 * The tools of the scrolling landing page, one a subject: each is the piece a lesson
 * mounts (the plane with its parabola, a scene of the physics sandbox, an orbital to turn,
 * the code editor), not a picture of it. They are heavy, so each is fetched only when its
 * stage comes near the screen, and let go when it is far.
 */

const wait = () => (
	<div className="flex min-h-64 items-center justify-center text-fg-faint">
		<Spinner className="size-6" />
	</div>
);
const Plot = dynamic(() => import('../prova/Bench').then((m) => m.Plot), { ssr: false, loading: wait });
const LessonScene = dynamic(() => import('@/components/sandbox/LessonScene').then((m) => m.LessonScene), { ssr: false, loading: wait });
const OrbitalFigure = dynamic(() => import('@/components/orbitali/OrbitalFigure').then((m) => m.OrbitalFigure), { ssr: false, loading: wait });
const Workbench = dynamic(() => import('@/components/codice/Workbench').then((m) => m.Workbench), { ssr: false, loading: wait });

/** Holds its tool only while the stage it is in is on or near the screen: an orbital left turning off screen costs every other stage its frames. */
function Near({ children }: { children: ReactNode }) {
	const live = use(StageLive);
	return <div className="min-h-64">{live ? children : wait()}</div>;
}

export function PlotTool() {
	return (
		<Near>
			<Plot compact />
		</Near>
	);
}

/** The block of lesson 54 on a smooth incline: the steeper the ramp, the steeper the line of its velocity. */
const RAMP: LessonSceneSpec = {
	alt: 'Un blocco che scende lungo un piano inclinato liscio, con le forze che agiscono su di lui',
	build: (v) => ({ ...incline({ angle: v.angle, m: 2, d: 2.9, L: 3.3 }), view: { x0: -1.3, x1: 3.4, y0: -0.25, y1: 2.75 } }),
	sliders: [{ key: 'angle', label: 'Inclinazione', unit: '°', min: 10, max: 40, step: 1, value: 25 }],
	time: true,
	forceScale: 0.085,
	velocity: 0.22,
	chart: { name: 'v', unit: 'm/s', body: 0, of: (s) => Math.hypot(s.vel[0].x, s.vel[0].y) },
	caption: ({ values }) => `Senza attrito $a = g\\sin ${values.angle}^\\circ = ${texNum(9.8 * Math.sin((values.angle * Math.PI) / 180), 2)}\\,\\text{m/s}^2$, qualunque sia la massa.`
};

export function SandboxTool() {
	return (
		<Near>
			<LessonScene spec={RAMP} />
		</Near>
	);
}

const P_ORBITALS: OrbitalPreset[] = [
	{ label: 'p x', orbital: { n: 2, l: 1, m: 1, kind: 'reale' }, note: 'Due lobi lungo l’asse x. Trascina la nuvola per girarla.' },
	{ label: 'p y', orbital: { n: 2, l: 1, m: -1, kind: 'reale' }, note: 'La stessa forma, girata di un quarto di giro attorno all’asse verticale.' },
	{ label: 'p z', orbital: { n: 2, l: 1, m: 0, kind: 'reale' }, note: 'I due lobi sono lungo l’asse z, quello verticale.' },
	{ label: 'd z²', orbital: { n: 3, l: 2, m: 0, kind: 'reale' }, note: 'Un orbitale d: due lobi lungo l’asse z e un anello attorno.' }
];

export function OrbitalTool() {
	return (
		<Near>
			<div className="mx-auto max-w-[23rem] [&_p]:text-balance">
				<OrbitalFigure presets={P_ORBITALS} view="3d" nodes="scelta" />
			</div>
		</Near>
	);
}

const COUNTDOWN = `# Il conto alla rovescia del diagramma di flusso
i = 5
while i > 0:
    print(i)
    i = i - 1
print("Via!")
`;

export function EditorTool() {
	return (
		<Near>
			<Workbench compact language="python" initial={COUNTDOWN} toolbar={<span className="label-mono px-1 text-fg-subtle">Python</span>} />
		</Near>
	);
}
