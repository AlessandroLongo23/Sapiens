'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Tex, num } from '@/components/content/interactive/kit';
import type { Scene, Solution, State } from '@/lib/sandbox/engine';
import { ForceRows } from './panels';
import { SceneDrawing, forceScaleOf } from './SceneDrawing';
import { TimeChart } from './TimeChart';
import { usePreview, useSim } from './useSim';

/** What a figure reads to write its numbers and its caption: the scene, the instant shown and the forces at it. */
export interface Moment {
	scene: Scene;
	state: State;
	solution: Solution;
	/** The numbers of the sliders and of the choices. */
	values: Record<string, number>;
	/** Stopped by itself: at rest for good, or at the end of its run. */
	ended: boolean;
}
export interface SceneSlider {
	key: string;
	label: string;
	unit?: string;
	min: number;
	max: number;
	step: number;
	value: number;
}
/** A choice between a few named cases, each a number (0, 1, …) the scene is built from. */
export interface SceneChoice {
	key: string;
	label: string;
	options: string[];
	value: number;
}
export interface LessonSceneSpec {
	alt?: string;
	build: (values: Record<string, number>) => Scene;
	sliders?: SceneSlider[];
	choices?: SceneChoice[];
	/** Centimetres of arrow per newton, the same for every value of the sliders. Without it, the scale that fits the scene the figure opens with. */
	forceScale?: number;
	/** Centimetres of arrow per m/s for the velocity of each body, drawn in blue beside it; without it, no velocities. */
	velocity?: number;
	/** The clock: start, pause, back to the start, and the cursor of time. Without it the scene is a still. */
	time?: boolean;
	/** The list of the forces on the chosen body, beside the scene. */
	forces?: boolean;
	/** One quantity against time, beside the scene. */
	chart?: { name: string; unit: string; of: (state: State, body: number, values: Record<string, number>) => number; body?: number };
	/** Numbers under the list of forces, as TeX. */
	readouts?: (m: Moment) => string[];
	/** What is happening, in a sentence; formulas between dollars. */
	caption?: (m: Moment) => string;
	/** What to try; formulas between dollars. */
	question?: string;
}


function Sentence({ text }: { text: string }): ReactNode {
	return <>{text.split('$').map((part, i) => (i % 2 ? <Tex key={i}>{part}</Tex> : part))}</>;
}

/**
 * A scene of the physics sandbox inside a lesson: fixed, with only the pieces the lesson asks for. The scene and its
 * numbers sit side by side in the text column and one under the other on a phone; the sliders change the few
 * quantities the lesson varies, and the scene starts again from its beginning.
 */
export function LessonScene({ spec }: { spec: LessonSceneSpec }) {
	const [values, setValues] = useState(() => Object.fromEntries([...(spec.sliders ?? []), ...(spec.choices ?? [])].map((x) => [x.key, x.value])));
	const { build } = spec;
	const scene = useMemo(() => build(values), [build, values]);
	const sim = useSim(scene);
	const ahead = usePreview(scene, !!spec.chart);
	const [forceScale] = useState(() => spec.forceScale ?? forceScaleOf(scene));
	const [selected, setSelected] = useState(spec.chart?.body ?? 0);
	const body = Math.min(selected, scene.bodies.length - 1);
	const moment: Moment = { scene, state: sim.state, solution: sim.solution, values, ended: sim.done || (sim.still && sim.state.t > 0) };
	const side = spec.forces || spec.chart || spec.readouts;
	const set = (key: string, value: number) => setValues({ ...values, [key]: value });

	return (
		<div className="@container w-full">
			<div className="flex flex-col items-center gap-4">
				<div className="flex w-full flex-col items-center gap-4 @[34rem]:flex-row @[34rem]:items-start @[34rem]:justify-center">
					<SceneDrawing scene={scene} state={sim.state} solution={sim.solution} selected={scene.bodies.length > 1 && spec.forces ? body : -1} onSelect={setSelected} forceScale={forceScale} velocityScale={spec.velocity ?? 0} forces={sim.state.ended ? 'none' : 'all'} trail={[]} label={spec.alt ?? ''} maxW={6.8} maxH={5.6} />
					{side && (
						<div className="flex w-full max-w-60 shrink-0 flex-col gap-3 text-sm text-fg @[34rem]:w-60">
							{spec.forces && (
								<div className="flex flex-col gap-1.5">
									{scene.bodies.length > 1 && <ToggleGroup label="Corpo" compact value={String(body)} onChange={(i) => setSelected(Number(i))} options={scene.bodies.map((b, i) => ({ value: String(i), label: b.name ?? String(i + 1) }))} />}
									<ForceRows forces={sim.solution.forces[body]} scene={scene} lower />
								</div>
							)}
							{spec.readouts && (
								<div className={`flex flex-col gap-1 ${spec.forces ? 'border-t border-edge pt-2' : ''}`}>
									{spec.readouts(moment).map((tex, k) => <Tex key={k}>{tex}</Tex>)}
								</div>
							)}
							{spec.chart && (
								<div className="flex justify-center">
									<TimeChart w={3.8} h={2.2} ahead={ahead?.map((s) => ({ t: s.t, y: spec.chart!.of(s, spec.chart!.body ?? body, values) }))} points={sim.frames.map((s) => ({ t: s.t, y: spec.chart!.of(s, spec.chart!.body ?? body, values) }))} at={sim.cursor} name={spec.chart.name} unit={spec.chart.unit} label={`${spec.chart.name} in funzione del tempo`} />
								</div>
							)}
						</div>
					)}
				</div>

				{spec.caption && (
					<div className="max-w-xl text-center text-sm text-fg-muted" aria-live="polite">
						<Sentence text={spec.caption(moment)} />
					</div>
				)}

				<div className="flex w-full max-w-lg flex-col gap-3">
					{spec.time && (
						<div className="flex items-center gap-2">
							<Button variant="secondary" size="sm" onClick={sim.play} disabled={sim.done || sim.still}>
								{sim.running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
								{sim.running ? 'Pausa' : sim.state.t > 0 ? 'Riprendi' : 'Avvia'}
							</Button>
							<Button variant="secondary" size="sm" onClick={sim.restart} disabled={sim.frames.length === 1} aria-label="Da capo" title="Da capo">
								<RotateCcw className="size-4" aria-hidden="true" />
							</Button>
							<input type="range" className="min-w-0 flex-1 accent-[var(--color-accent)]" min={0} max={Math.max(1, sim.frames.length - 1)} value={sim.cursor} disabled={sim.frames.length === 1} onChange={(ev) => sim.seek(Number(ev.target.value))} aria-label="Tempo" aria-valuetext={`${num(sim.state.t, 2)} secondi`} />
							<span className="w-14 shrink-0 text-right text-sm tabular-nums text-fg-muted">{num(sim.state.t, 2)} s</span>
						</div>
					)}
					{spec.choices?.map((c) => <ToggleGroup key={c.key} label={c.label} compact value={String(values[c.key])} onChange={(x) => set(c.key, Number(x))} options={c.options.map((label, i) => ({ value: String(i), label }))} />)}
					{spec.sliders?.map((s) => <Slider key={s.key} label={s.label} unit={s.unit} value={values[s.key]} min={s.min} max={s.max} step={s.step} onChange={(x) => set(s.key, x)} />)}
				</div>

				{spec.question && (
					<div className="max-w-xl text-center text-sm text-fg-muted">
						<Sentence text={spec.question} />
					</div>
				)}
			</div>
		</div>
	);
}
