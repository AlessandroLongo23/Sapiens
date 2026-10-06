'use client';

import { texNum } from '../kit';
import { LessonScene, type LessonSceneSpec } from '@/components/sandbox/LessonScene';
import { lampAndWall } from '@/lib/sandbox/scenes';

/**
 * Lesson 20 (L'equilibrio del punto materiale), after example 4: the lamp of 20 N held by a thread to the ceiling and
 * a horizontal one to the wall, as a still scene of the physics sandbox. The student changes the angle of the first
 * thread with the vertical and reads the two tensions; at 30° they are the example's, 23,09 N and 11,55 N.
 */
const SPEC: LessonSceneSpec = {
	build: (v) => lampAndWall({ P: 20, angle: v.angle }),
	sliders: [{ key: 'angle', label: 'Angolo con la verticale', unit: '°', min: 5, max: 60, step: 1, value: 30 }],
	forces: true,
	// 40 N, the tension at 60°, is 2,4 cm: inside the thread at every angle.
	forceScale: 0.06,
	readouts: ({ solution, values }) => {
		const a = (values.angle * Math.PI) / 180;
		const T = solution.tensions[0];
		return [`T_y = T\\cos ${values.angle}^\\circ = ${texNum(T * Math.cos(a), 2)}\\,\\text{N}`, `T_x = T\\sin ${values.angle}^\\circ = ${texNum(T * Math.sin(a), 2)}\\,\\text{N}`];
	},
	question: 'Cambia l\'angolo: quale delle due componenti di $\\vec{T}$ non cambia mai, e perché? Che cosa succede alla tensione $F$ del filo orizzontale quando il primo filo è quasi verticale?'
};

export default function ScenaLampadaDueFili({ alt }: { alt?: string }) {
	return <LessonScene spec={{ ...SPEC, alt }} />;
}
