'use client';

import 'katex/dist/katex.min.css';
import { useMemo, useState } from 'react';
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Field';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Tex, num, texNum } from '@/components/content/interactive/kit';
import { energy, type Scene, type State } from '@/lib/sandbox/engine';
import { atwood, incline, inclineAndWeight, launch, twoThreads } from '@/lib/sandbox/scenes';
import { SceneDrawing, forceName, forceScaleOf } from './SceneDrawing';
import { TimeChart } from './TimeChart';
import { useSim } from './useSim';

/** A number the student changes, and the scene built from all of them. */
interface Param {
	key: string;
	label: string;
	unit?: string;
	min: number;
	max: number;
	step: number;
	value: number;
}
interface Preset {
	name: string;
	alt: string;
	params: Param[];
	build: (p: Record<string, number>) => Scene;
}

const MU = (key: string, label: string, value: number): Param => ({ key, label, min: 0, max: 1, step: 0.05, value });
const MASS = (key: string, label: string, value: number): Param => ({ key, label, unit: 'kg', min: 0.1, max: 4, step: 0.1, value });
const ANGLE = (key: string, label: string, value: number, min = 5, max = 70): Param => ({ key, label, unit: '°', min, max, step: 1, value });

export const PRESETS: Record<string, Preset> = {
	'piano-inclinato': {
		name: 'Piano inclinato',
		alt: 'Un blocco su un piano inclinato, con le forze che agiscono su di lui',
		params: [ANGLE('angle', 'Angolo', 30), MASS('m', 'Massa', 2), MU('muS', 'Attrito statico μₛ', 0.3), MU('muK', 'Attrito dinamico μ_d', 0.2), { key: 'v0', label: 'Velocità iniziale in salita', unit: 'm/s', min: 0, max: 4, step: 0.1, value: 0 }],
		build: (p) => incline({ angle: p.angle, m: p.m, muS: Math.max(p.muS, p.muK), muK: p.muK, v0: p.v0, d: p.v0 > 0 ? 0.6 : 2.2 })
	},
	atwood: {
		name: 'Macchina di Atwood',
		alt: 'Due blocchi appesi ai due capi di un filo che passa su una carrucola',
		params: [MASS('m1', 'Massa m₁', 1.2), MASS('m2', 'Massa m₂', 1.5)],
		build: (p) => atwood({ m1: p.m1, m2: p.m2 })
	},
	'piano-e-peso': {
		name: 'Piano inclinato e peso appeso',
		alt: 'Un blocco su un piano inclinato, legato con un filo a un blocco appeso oltre una carrucola',
		params: [ANGLE('angle', 'Angolo', 30, 10, 60), MASS('m1', 'Massa sul piano m₁', 2), MASS('m2', 'Massa appesa m₂', 1.5), MU('muS', 'Attrito statico μₛ', 0), MU('muK', 'Attrito dinamico μ_d', 0)],
		build: (p) => inclineAndWeight({ angle: p.angle, m1: p.m1, m2: p.m2, muS: Math.max(p.muS, p.muK), muK: p.muK })
	},
	'due-fili': {
		name: 'Corpo appeso a due fili',
		alt: 'Un corpo appeso al soffitto con due fili inclinati, in equilibrio',
		params: [MASS('m', 'Massa', 3), ANGLE('alpha', 'Angolo del filo 1', 30, 15, 80), ANGLE('beta', 'Angolo del filo 2', 60, 15, 80)],
		build: (p) => twoThreads({ m: p.m, alpha: p.alpha, beta: p.beta })
	},
	lancio: {
		name: 'Lancio da un tavolo',
		alt: 'Una pallina che lascia un tavolo con velocità orizzontale e cade sul pavimento',
		params: [{ key: 'h', label: 'Altezza del tavolo', unit: 'm', min: 0.3, max: 1.8, step: 0.1, value: 1.2 }, { key: 'v0', label: 'Velocità iniziale', unit: 'm/s', min: 0.5, max: 5, step: 0.1, value: 2 }, MU('mu', 'Attrito del pavimento', 0.5)],
		build: (p) => launch({ h: p.h, v0: p.v0, mu: p.mu })
	}
};

const QUANTITIES = {
	y: { name: 'altezza y', unit: 'm', of: (s: State, i: number) => s.pos[i].y },
	x: { name: 'posizione x', unit: 'm', of: (s: State, i: number) => s.pos[i].x },
	v: { name: 'velocità v', unit: 'm/s', of: (s: State, i: number) => Math.hypot(s.vel[i].x, s.vel[i].y) },
	vx: { name: 'velocità vₓ', unit: 'm/s', of: (s: State, i: number) => s.vel[i].x },
	vy: { name: 'velocità v_y', unit: 'm/s', of: (s: State, i: number) => s.vel[i].y }
} as const;
type Quantity = keyof typeof QUANTITIES;

const ENDED = { pulley: 'Un blocco è arrivato alla carrucola.', edge: 'Il blocco è arrivato in fondo al piano.', away: 'Il corpo è uscito dalla scena.' } as const;

const defaults = (preset: Preset) => Object.fromEntries(preset.params.map((p) => [p.key, p.value]));

/**
 * The physics sandbox, first slice (vault/Idee/Sandbox di fisica.md): a scene on the left, and on the right the
 * forces on the selected body and two of its quantities against time. The scene is one of a few built from sliders;
 * the editor that composes one from pieces comes later. With `locked` there is one scene and nothing to change, as
 * inside a lesson.
 */
export function Sandbox({ preset: first = 'piano-inclinato', locked = false }: { preset?: string; locked?: boolean }) {
	const [key, setKey] = useState(first in PRESETS ? first : 'piano-inclinato');
	const preset = PRESETS[key];
	const [params, setParams] = useState(() => defaults(preset));
	const scene = useMemo(() => preset.build(params), [preset, params]);
	const [slow, setSlow] = useState<'1' | '0.25'>('1');
	const [selected, setSelected] = useState(0);
	const [forces, setForces] = useState<'all' | 'selected' | 'none'>('all');
	const [charts, setCharts] = useState<[Quantity, Quantity]>(['y', 'v']);
	const { frames, cursor, state, solution, running, done, still, forward, play, restart, seek } = useSim(scene, Number(slow));
	const body = Math.min(selected, scene.bodies.length - 1);
	// One scale for each scene, from its starting numbers: the sliders do not change it.
	const forceScale = useMemo(() => forceScaleOf(preset.build(defaults(preset))), [preset]);

	const pick = (k: string) => {
		setKey(k);
		setParams(defaults(PRESETS[k]));
		setSelected(0);
	};
	const change = (k: string, value: number) => setParams({ ...params, [k]: value });

	const sum = solution.forces[body].reduce((s, x) => ({ x: s.x + x.v.x, y: s.y + x.v.y }), { x: 0, y: 0 });
	const acc = solution.acc[body];
	const e = energy(scene, state);
	const name = scene.bodies[body].name ?? 'il corpo';
	const tidy = (x: number) => texNum(Math.abs(x) < 5e-7 ? 0 : x, 2);

	return (
		<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]" data-sandbox={key}>
			<div className="flex flex-col items-center gap-4">
				{!locked && (
					<label className="flex w-full max-w-lg flex-col gap-1 text-sm text-fg-muted">
						Scena
						<Select value={key} onChange={(ev) => pick(ev.target.value)}>
							{Object.entries(PRESETS).map(([k, p]) => <option key={k} value={k}>{p.name}</option>)}
						</Select>
					</label>
				)}
				<SceneDrawing forceScale={forceScale} scene={scene} state={state} solution={solution} selected={body} onSelect={setSelected} forces={forces} trail={frames.slice(0, cursor + 1).map((s) => s.pos[body])} label={preset.alt} />
				<p className="m-0 max-w-xl text-center text-sm text-fg-muted" aria-live="polite">
					{state.ended ? ENDED[state.ended] : still ? 'Il sistema è in equilibrio: su ogni corpo la somma delle forze è zero.' : `t = ${num(state.t, 2)} s. Clicca un corpo per vedere le sue forze e i suoi grafici.`}
				</p>
				<div className="flex w-full max-w-lg flex-col gap-3">
					<div className="flex flex-wrap items-center justify-center gap-2">
						<Button variant="secondary" size="sm" onClick={play} disabled={done || still}>
							{running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
							{running ? 'Pausa' : state.t > 0 ? 'Riprendi' : 'Avvia'}
						</Button>
						<Button variant="secondary" size="sm" onClick={() => forward(0.05)} disabled={done || still}>
							<StepForward className="size-4" aria-hidden="true" />
							Un passo
						</Button>
						<Button variant="secondary" size="sm" onClick={restart} disabled={frames.length === 1}>
							<RotateCcw className="size-4" aria-hidden="true" />
							Da capo
						</Button>
						<ToggleGroup label="Velocità del tempo" compact value={slow} onChange={setSlow} options={[{ value: '1', label: '1×' }, { value: '0.25', label: '¼×' }]} />
					</div>
					{frames.length > 1 && (
						<label className="flex items-center gap-3 text-sm text-fg-muted">
							Tempo
							<input type="range" className="w-full accent-[var(--color-accent)]" min={0} max={frames.length - 1} value={cursor} onChange={(ev) => seek(Number(ev.target.value))} aria-valuetext={`${num(state.t, 2)} secondi`} />
						</label>
					)}
					<ToggleGroup label="Forze disegnate" compact value={forces} onChange={setForces} options={[{ value: 'all', label: 'Tutte le forze' }, { value: 'selected', label: 'Solo il corpo scelto' }, { value: 'none', label: 'Nessuna' }]} />
					{!locked && preset.params.map((p) => <Slider key={p.key} label={p.label} unit={p.unit} value={params[p.key]} min={p.min} max={p.max} step={p.step} onChange={(x) => change(p.key, x)} />)}
				</div>
			</div>

			<aside className="flex flex-col gap-4" aria-label={`Forze e grafici di ${name}`}>
				<section className="rounded-2xl border border-edge bg-surface p-4">
					<h2 className="m-0 text-base font-semibold text-fg">Forze su {name}</h2>
					<ul className="m-0 mt-2 flex list-none flex-col gap-1 p-0 text-sm text-fg">
						{solution.forces[body].map((force, k) => {
							if (Math.hypot(force.v.x, force.v.y) < 5e-7) return null;
							const [letter, subscript] = forceName(force, scene);
							return (
								<li key={k} className="flex items-baseline justify-between gap-3">
									<span>
										{force.kind === 'weight' ? 'Peso' : force.kind === 'normal' ? 'Reazione del piano' : force.kind === 'tension' ? 'Tensione del filo' : force.static ? 'Attrito statico' : 'Attrito dinamico'}
									</span>
									<Tex>{`${letter}${subscript ? `_{${subscript}}` : ''} = ${tidy(Math.hypot(force.v.x, force.v.y))}\\,\\text{N}`}</Tex>
								</li>
							);
						})}
					</ul>
					<div className="mt-3 flex flex-col gap-1 border-t border-edge pt-3 text-sm text-fg">
						<Tex>{`\\textstyle\\sum F_x = ${tidy(sum.x)}\\,\\text{N} \\qquad \\sum F_y = ${tidy(sum.y)}\\,\\text{N}`}</Tex>
						<Tex>{`a = \\dfrac{\\sum F}{m} = \\dfrac{${tidy(Math.hypot(sum.x, sum.y))}}{${texNum(scene.bodies[body].m, 2)}} = ${tidy(Math.hypot(acc.x, acc.y))}\\,\\text{m/s}^2`}</Tex>
						<Tex>{`v = ${tidy(Math.hypot(state.vel[body].x, state.vel[body].y))}\\,\\text{m/s} \\qquad E_c + U = ${tidy(e.kinetic + e.potential)}\\,\\text{J}`}</Tex>
					</div>
				</section>
				{charts.map((q, k) => (
					<section key={k} className="rounded-2xl border border-edge bg-surface p-4">
						<label className="flex items-center justify-between gap-3 text-sm text-fg-muted">
							Grafico {k + 1}
							<Select className="w-auto py-1.5" value={q} onChange={(ev) => setCharts(k === 0 ? [ev.target.value as Quantity, charts[1]] : [charts[0], ev.target.value as Quantity])}>
								{Object.entries(QUANTITIES).map(([id, x]) => <option key={id} value={id}>{x.name}</option>)}
							</Select>
						</label>
						<div className="mt-2 flex justify-center">
							<TimeChart points={frames.map((s) => ({ t: s.t, y: QUANTITIES[q].of(s, body) }))} at={cursor} name={QUANTITIES[q].name} unit={QUANTITIES[q].unit} label={`${QUANTITIES[q].name} di ${name} in funzione del tempo`} />
						</div>
					</section>
				))}
			</aside>
		</div>
	);
}
