'use client';

import { texNum } from '../kit';
import { LessonScene, type LessonSceneSpec } from '@/components/sandbox/LessonScene';
import { cartAndWeight } from '@/lib/sandbox/scenes';

/**
 * Lesson 55 (Corpi collegati e tensione dei fili), after example 3: the block of 4,0 kg on the table and the weight
 * that hangs from the pulley, as a scene of the physics sandbox. Without friction and with 1,0 kg it is example 2
 * (a = 1,96 m/s², T = 7,84 N); with friction (μs = 0,35, μd = 0,25) and 2,0 kg it is example 3 (1,63 m/s², 16,33 N),
 * and under 1,4 kg the weight does not move the block. The graph is the speed of the block.
 */
const SPEC: LessonSceneSpec = {
	build: (v) => cartAndWeight({ m1: 4, m2: v.m2, muS: v.attrito ? 0.35 : 0, muK: v.attrito ? 0.25 : 0 }),
	sliders: [{ key: 'm2', label: 'Massa del pesetto m₂', unit: 'kg', min: 0.5, max: 3, step: 0.1, value: 2 }],
	choices: [{ key: 'attrito', label: 'Attrito sul tavolo', options: ['Tavolo liscio', 'Con attrito'], value: 1 }],
	time: true,
	forces: true,
	forceScale: 0.043,
	chart: { name: 'v', unit: 'm/s', body: 0, of: (s, i) => Math.hypot(s.vel[i].x, s.vel[i].y) },
	readouts: ({ solution }) => [`a = ${texNum(Math.hypot(solution.acc[0].x, solution.acc[0].y), 2)}\\,\\text{m/s}^2`],
	caption: ({ solution, state, values, ended }) => {
		const T = solution.tensions[0];
		const P2 = values.m2 * 9.8;
		if (state.ended) return 'Il blocco è arrivato alla carrucola.';
		if (ended || T === 0) return 'Il pesetto ha toccato terra: il filo non tira più.';
		if (Math.hypot(solution.acc[0].x, solution.acc[0].y) < 1e-7) return `Il sistema non parte: il peso del pesetto, $${texNum(P2, 1)}\\,\\text{N}$, non supera l'attrito statico massimo, $13{,}7\\,\\text{N}$. La tensione è uguale al peso del pesetto.`;
		return `Il filo tira il pesetto con $${texNum(T, 2)}\\,\\text{N}$, meno del suo peso, $${texNum(P2, 1)}\\,\\text{N}$: la differenza lo accelera.`;
	},
	question: 'Con l\'attrito, abbassa $m_2$ finché il sistema non parte più: a quale massa succede? Controlla con $m_2 > \\mu_s\\,m_1$.'
};

export default function ScenaCarrelloPesetto({ alt }: { alt?: string }) {
	return <LessonScene spec={{ ...SPEC, alt }} />;
}
