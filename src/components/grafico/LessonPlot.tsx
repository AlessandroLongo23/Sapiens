'use client';

import { useMemo, useState } from 'react';
import { Pause, Play, RotateCcw, X } from 'lucide-react';
import { Tex, useFrameLoop } from '@/components/content/interactive/kit';
import { Slider } from '@/components/ui/Slider';
import type { ReadPlotBlock } from '@/lib/grafico/blocco';
import type { Camera } from '@/lib/grafico/documento';
import { GREEK, definitions, readEntry, type Entry, type Scope } from '@/lib/grafico/formula';
import { cn } from '@/lib/utils/cn';
import { Plane, type PlaneCurve, type PlaneMark } from './Plane';

/**
 * The plane of a lesson (lib/grafico/blocco.ts): the plotter without its panel. The formulas are the author's and
 * are not typed; the student moves the sliders of their parameters, chooses among the formulas of a segmented
 * control, and reads the values written beside the plane, which follow the sliders. The window is the author's
 * too, so the page scrolls over the figure, unless the block lets the student move it.
 */

/** The seconds a slider takes from one end to the other when it moves by itself. */
const SWEEP = 8;

/** x as a fraction with a small denominator, when it is one. */
function fraction(x: number, maxDen: number): [number, number] | null {
	for (let den = 1; den <= maxDen; den++) {
		const num = Math.round(x * den);
		if (Math.abs(x * den - num) < 1e-9 * Math.max(1, Math.abs(x * den))) return [num, den];
	}
	return null;
}

/** A number beside the plane: with the comma when two decimals say it all (0,4; 1,25), as a simple fraction when they do not (1/3), rounded otherwise. */
function texValue(x: number): string {
	if (!Number.isFinite(x)) return '\\text{non esiste}';
	const short = Number(x.toFixed(2));
	const f = Math.abs(short - x) < 1e-9 ? null : fraction(x, 12);
	if (!f) return String(Object.is(short, -0) ? 0 : short).replace('.', '{,}');
	return `${f[0] < 0 ? '-' : ''}\\frac{${Math.abs(f[0])}}{${f[1]}}`;
}

/** The name of a parameter as a label reads it: ω for omega, s₀ for s_0. */
const plainLetter = (name: string) => name.replace(/^[a-z]+/i, (word) => GREEK[word] ?? word).replace(/_(\d)$/, (_, d: string) => '₀₁₂₃₄₅₆₇₈₉'[Number(d)]);

/** A sentence with its formulas between dollars, as the lesson writes them. */
function Sentence({ text }: { text: string }) {
	return <>{text.split('$').map((part, i) => (i % 2 ? <Tex key={i}>{part}</Tex> : part))}</>;
}

export default function LessonPlot({ spec, onClose }: { spec: ReadPlotBlock; /** Given, the plane covers a figure: a button in its corner brings the figure back. */ onClose?: () => void }) {
	const start = useMemo(() => Object.fromEntries(spec.sliders.map((s) => [s.name, s.value])), [spec]);
	const [values, setValues] = useState<Record<string, number>>(start);
	const [chosen, setChosen] = useState(0);
	const [playing, setPlaying] = useState<{ name: string; dir: 1 | -1; at: number } | null>(null);

	const { x0, x1, y0, y1 } = spec.window;
	const shape = spec.shape ?? (x1 - x0) / (y1 - y0);
	// the drawing has the block's shape, so the window is the block's whatever the width of the page
	const home: Camera = useMemo(() => ({ cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, span: x1 - x0, stretch: (x1 - x0) / (y1 - y0) / shape }), [x0, x1, y0, y1, shape]);
	const [camera, setCamera] = useState(home);

	useFrameLoop(playing !== null, (dt) => {
		if (!playing) return;
		const s = spec.sliders.find((slider) => slider.name === playing.name)!;
		let at = playing.at + (playing.dir * (s.max - s.min) * dt) / SWEEP;
		let dir = playing.dir;
		if (at > s.max || at < s.min) {
			dir = dir === 1 ? -1 : 1;
			at = Math.min(s.max, Math.max(s.min, at));
		}
		setPlaying({ name: s.name, dir, at });
		const value = Number((s.min + Math.round((at - s.min) / s.step) * s.step).toFixed(8));
		setValues((v) => (v[s.name] === value ? v : { ...v, [s.name]: value }));
	});

	const rows = useMemo(
		() =>
			spec.rows.map((row) => {
				const option = row.options?.[Math.min(chosen, row.options.length - 1)];
				return option ? { ...row, json: option.json, color: option.color ?? row.color } : row;
			}),
		[spec, chosen]
	);
	const { entries, defs } = useMemo(() => {
		const defs = definitions(rows.map((r) => r.json));
		return { defs, entries: rows.map((r): Entry => readEntry(r.json, defs)) };
	}, [rows]);

	const { curves, marks } = useMemo(() => {
		const curves: PlaneCurve[] = [];
		const marks: PlaneMark[] = [];
		rows.forEach((row, i) => {
			const entry = entries[i];
			// one scope for all the evaluations of a curve: the sampling calls it thousands of times a frame
			const scope: Scope = { x: 0, y: 0, t: 0, theta: 0, ...values };
			const look = { id: String(i), color: row.color, width: row.width, dash: row.dash };
			if (entry.kind === 'function') curves.push({ ...look, label: row.label ? entry.name : undefined, f: (x) => ((scope.x = x), entry.f(scope)) });
			else if (entry.kind === 'implicit') curves.push({ ...look, implicit: (x, y) => ((scope.x = x), (scope.y = y), entry.f(scope)) });
			else if (entry.kind === 'inequality') curves.push({ ...look, strict: entry.strict, region: (x, y) => ((scope.x = x), (scope.y = y), entry.f(scope)) });
			else if (entry.kind === 'point') {
				// a point whose coordinates have no value here (a vertex with a = 0) is not on the plane
				const at = { x: entry.x(scope), y: entry.y(scope) };
				if (Number.isFinite(at.x) && Number.isFinite(at.y)) marks.push({ id: `point${i}`, at, color: row.color, name: entry.name });
			}
			else if (entry.kind === 'polar' || entry.kind === 'parametric') {
				// what is left has no drawing: an empty row, one that is not read, a name for the other rows
				const [t0, t1] = [row.t0 ?? 0, row.t1 ?? 2 * Math.PI];
				if (entry.kind === 'polar') {
					const r = (theta: number) => ((scope.theta = theta), entry.r(scope));
					curves.push({ ...look, parametric: { t0, t1, x: (theta) => r(theta) * Math.cos(theta), y: (theta) => r(theta) * Math.sin(theta) } });
				} else curves.push({ ...look, parametric: { t0, t1, x: (t) => ((scope.t = t), entry.x(scope)), y: (t) => ((scope.t = t), entry.y(scope)) } });
			}
		});
		return { curves, marks };
	}, [rows, entries, values]);

	const readout = useMemo(
		() =>
			spec.values.map((value) => {
				const entry = readEntry(value.json, defs);
				const scope: Scope = { x: 0, y: 0, t: 0, theta: 0, ...values };
				if (entry.kind === 'point') {
					const [x, y] = [entry.x(scope), entry.y(scope)];
					return Number.isFinite(x) && Number.isFinite(y) ? `${value.label}=\\left(${texValue(x)};\\,${texValue(y)}\\right)` : `${value.label}\\text{ non esiste}`;
				}
				return `${value.label}=${entry.kind === 'function' ? texValue(entry.f(scope)) : '\\text{?}'}`;
			}),
		[spec, defs, values]
	);

	const options = spec.rows.find((r) => r.options)?.options;
	const moved = spec.sliders.some((s) => values[s.name] !== s.value) || chosen !== 0 || camera !== home;
	const reset = () => {
		setPlaying(null);
		setValues(start);
		setChosen(0);
		setCamera(home);
	};

	return (
		<div className="flex w-full flex-col items-center gap-4">
			<div className="relative w-full max-w-[36rem] overflow-hidden rounded-xl border border-edge bg-surface" style={{ aspectRatio: shape }}>
				<Plane
					camera={camera}
					onCamera={spec.free ? setCamera : undefined}
					home={home}
					wheel="ctrl"
					curves={curves}
					marks={marks}
					look={{ grid: true, axes: true, numbers: true, xAxis: 'numbers', xName: spec.axes?.[0], yName: spec.axes?.[1] }}
					label={spec.alt}
				/>
				{/* in the corners of the drawing, so that nothing under the plane moves when they change */}
				<button
					type="button"
					onClick={reset}
					disabled={!moved}
					title="Riporta i cursori e la finestra all’inizio"
					className="absolute bottom-2 left-2 flex h-8 items-center gap-1.5 rounded-lg border border-edge-strong bg-surface px-2.5 text-sm font-medium text-fg-strong shadow-paper transition-colors hover:bg-surface-3 focus-ring disabled:cursor-not-allowed disabled:border-edge disabled:text-fg-faint disabled:shadow-none disabled:hover:bg-surface"
				>
					<RotateCcw className="size-3.5" aria-hidden="true" />
					Reset
				</button>
				{onClose && (
					<button type="button" onClick={onClose} aria-label="Torna alla figura" title="Torna alla figura" className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-lg border border-edge-strong bg-surface text-fg-muted shadow-paper transition-colors hover:bg-surface-3 hover:text-fg-strong focus-ring">
						<X className="size-4" aria-hidden="true" />
					</button>
				)}
			</div>

			{options && (
				<div role="group" aria-label="Scegli la formula" className="flex flex-wrap justify-center gap-1 rounded-xl border border-edge bg-surface-2 p-1">
					{options.map((o, i) => (
						<button key={i} type="button" aria-pressed={chosen === i} onClick={() => setChosen(i)} className={cn('min-h-9 rounded-lg px-3 text-sm transition-colors focus-ring', chosen === i ? 'bg-surface text-fg-strong shadow-paper' : 'text-fg-muted hover:text-fg-strong')}>
							<Tex>{o.label}</Tex>
						</button>
					))}
				</div>
			)}

			{readout.length > 0 && (
				<div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-fg" aria-live="polite">
					{readout.map((tex, i) => (
						<Tex key={i}>{tex}</Tex>
					))}
				</div>
			)}

			{spec.sliders.length > 0 && (
				<div className="flex w-full max-w-lg flex-col gap-3">
					{spec.sliders.map((s) => {
						const on = playing?.name === s.name;
						const name = plainLetter(s.name);
						return (
							<div key={s.name} className="flex items-center gap-2">
								<Slider
									label={name}
									value={values[s.name]}
									min={s.min}
									max={s.max}
									step={s.step}
									onChange={(value) => {
										// a slider dragged while it moves goes on from where it is left
										if (on) setPlaying({ ...playing, at: value });
										setValues((v) => ({ ...v, [s.name]: value }));
									}}
									className="min-w-0 flex-1"
								/>
								{s.play && (
									<button
										type="button"
										aria-label={on ? `Ferma ${name}` : `Anima ${name}`}
										title={on ? `Ferma ${name}` : `Anima ${name}`}
										aria-pressed={on}
										onClick={() => setPlaying(on ? null : { name: s.name, dir: 1, at: values[s.name] })}
										className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors focus-ring', on ? 'bg-surface-3 text-fg-strong' : 'text-fg-muted hover:bg-surface-3 hover:text-fg-strong')}
									>
										{on ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
									</button>
								)}
							</div>
						);
					})}
				</div>
			)}

			{spec.question && (
				<div className="max-w-xl text-center text-sm text-fg-muted">
					<Sentence text={spec.question} />
				</div>
			)}

		</div>
	);
}
