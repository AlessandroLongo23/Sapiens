'use client';

import { MotoCircolareFigura } from './MotoCircolare';

/** Lesson 47 (Il moto circolare uniforme): the angle swept in radians, the arc, ω and v = ωr. See MotoCircolare.tsx. */
export default function MotoCircolareRadianti({ alt }: { alt?: string }) {
	return <MotoCircolareFigura alt={alt} mode="radianti" />;
}
