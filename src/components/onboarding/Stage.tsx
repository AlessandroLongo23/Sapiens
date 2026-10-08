'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import type { Stage as StageHandle } from './stage-engine';

/** Bump when the files in public/onboarding are exported again. */
const VERSION = 7;

/** The objects the stage can draw, by the name a slot asks for: the model, and the still shown where the stage cannot run. */
export const OBJECTS = {
	student: 'onboarding-student',
	parent: 'onboarding-parent',
	tutor: 'onboarding-tutor',
	teacher: 'onboarding-teacher',
	school: 'onboarding-school',
	email: 'onboarding-email',
	middle_school: 'level-middle_school',
	high_school: 'level-high_school',
	university: 'level-university',
	math: 'high_school-math',
	physics: 'high_school-physics',
	chemistry: 'high_school-chemistry',
	'computer-science': 'high_school-computer-science'
} as const;
export type ObjectId = keyof typeof OBJECTS;

/** The stills of the levels and of the subjects are the ones of the library's cards. */
const stillOf = (id: ObjectId) => `${OBJECTS[id].startsWith('onboarding') ? '/onboarding' : '/materie'}/${OBJECTS[id]}.webp`;

const StageContext = createContext<{ live: boolean; hop: (id: ObjectId) => void }>({ live: false, hop: () => {} });
export const useStage = () => useContext(StageContext);

/**
 * The canvas over the page where the objects live (./stage-engine.ts), and what the steps need from it. The three.js
 * code is fetched after the first paint; with reduced motion, or without WebGL, there is no canvas and every
 * slot shows its still.
 */
export function StageProvider({ children }: { children: ReactNode }) {
	const canvas = useRef<HTMLCanvasElement>(null);
	const stage = useRef<StageHandle | null>(null);
	const [live, setLive] = useState(false);

	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		let gone = false;
		import('./stage-engine')
			.then(({ createStage }) => {
				if (gone || !canvas.current) return;
				const models = Object.fromEntries(Object.entries(OBJECTS).map(([id, file]) => [id, `/onboarding/${file}.glb?v=${VERSION}`]));
				stage.current = createStage(canvas.current, models);
				setLive(true);
			})
			.catch((err) => console.warn('stage unavailable, showing stills:', err));
		return () => {
			gone = true;
			stage.current?.destroy();
			stage.current = null;
		};
	}, []);

	const value = useMemo(() => ({ live, hop: (id: ObjectId) => stage.current?.hop(id) }), [live]);
	return (
		<StageContext.Provider value={value}>
			{children}
			<canvas ref={canvas} className="pointer-events-none fixed inset-0 z-20 size-full" aria-hidden="true" />
		</StageContext.Provider>
	);
}

/** Where an object stands: the stage draws it over this box, at this size. */
export function Slot({ id, className }: { id: ObjectId; className?: string }) {
	const { live } = useStage();
	return (
		<span data-stage-slot={id} className={cn('block aspect-square select-none', className)}>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			{!live && <img src={`${stillOf(id)}?v=${VERSION}`} alt="" width={480} height={480} decoding="async" draggable={false} className="size-full" />}
		</span>
	);
}
