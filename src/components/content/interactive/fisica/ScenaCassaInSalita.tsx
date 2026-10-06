'use client';

import { texNum as num } from '../kit';
import { LessonScene, type LessonSceneSpec } from '@/components/sandbox/LessonScene';
import { incline } from '@/lib/sandbox/scenes';
import type { State } from '@/lib/sandbox/engine';

/**
 * Lesson 54 (Il moto sul piano inclinato), after example 5: the crate thrown at 5,0 m/s up a ramp with μd = 0,30,
 * as a scene of the physics sandbox with the graph of its velocity along the ramp, positive uphill. At 25° with
 * μs = 0,50 it stops after 1,84 m and stays, as in the example; with μs = 0,40, or on a steeper ramp, it comes back
 * down more slowly than it went up, and the graph bends where friction turns.
 */
const START = 0.3;
const angleOf = (v: Record<string, number>) => (v.angle * Math.PI) / 180;
const muS = (v: Record<string, number>) => (v.muS ? 0.4 : 0.5);

/** Metres along the ramp from where the crate started, and its velocity along the ramp, positive uphill. */
const along = (s: State, a: number) => s.pos[0].x * Math.cos(a) + s.pos[0].y * Math.sin(a) - START;
const uphill = (s: State, a: number) => s.vel[0].x * Math.cos(a) + s.vel[0].y * Math.sin(a);

const SPEC: LessonSceneSpec = {
	// One window for every inclination, so the drawing keeps its size while the slider moves.
	build: (v) => ({ ...incline({ angle: v.angle, m: 2, muS: muS(v), muK: 0.3, d: START, v0: 5, L: 3.3 }), view: { x0: -0.7, x1: 3.4, y0: -0.25, y1: 2.75 } }),
	sliders: [{ key: 'angle', label: 'Inclinazione della rampa', unit: '°', min: 15, max: 40, step: 1, value: 25 }],
	choices: [{ key: 'muS', label: 'Attrito statico', options: ['μₛ = 0,50', 'μₛ = 0,40'], value: 0 }],
	time: true,
	forceScale: 0.085,
	velocity: 0.22,
	chart: { name: 'v', unit: 'm/s', body: 0, of: (s, _, v) => uphill(s, angleOf(v)) },
	caption: ({ state, solution, values, ended }) => {
		const a = angleOf(values);
		const d = along(state, a);
		const friction = solution.forces[0].find((f) => f.kind === 'friction');
		if (state.t === 0) return "La cassa parte a $5{,}0\\,\\text{m/s}$ verso la cima. Guarda da che parte punta l'attrito $\\vec{F}_d$ mentre sale.";
		if (state.ended) return 'La cassa è tornata in fondo alla rampa: ha impiegato più tempo a scendere che a salire.';
		if (ended && friction?.static) return `La cassa si è fermata dopo $${num(d, 2)}\\,\\text{m}$ e resta lì: $\\tan ${values.angle}^\\circ = ${num(Math.tan(a), 3)}$ non supera $\\mu_s$, e l'attrito statico la tiene.`;
		if (uphill(state, a) > 0) return "In salita l'attrito punta verso il basso, come la componente del peso: le due si sommano e la cassa rallenta in fretta.";
		return "La cassa riscende: l'attrito ora punta verso l'alto e si sottrae alla componente del peso, e l'accelerazione è più piccola che in salita.";
	},
	question: "Con $\\mu_s = 0{,}50$ aumenta l'inclinazione finché la cassa riscende: a quale angolo succede? Nel grafico, la pendenza della discesa è uguale a quella della salita?"
};

export default function ScenaCassaInSalita({ alt }: { alt?: string }) {
	return <LessonScene spec={{ ...SPEC, alt }} />;
}
