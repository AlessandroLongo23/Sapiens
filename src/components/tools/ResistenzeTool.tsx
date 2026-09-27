'use client';

import { useMemo } from 'react';
import { Minus, Plus } from 'lucide-react';
import { MAX_RESISTORS, RES_UNITS, resName, resistenze, resistorLabel } from '@/lib/tools/resistenze';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { cn } from '@/lib/utils/cn';
import { Examples, ToolSheet, toolInputClass, useToolState } from './ToolSheet';
import { unitSelectClass } from './GrandezzeTool';

/**
 * Resistors in series and in parallel: one row per resistor, with its value and its unit, and the circuit drawn under
 * them. The values and units are kept in the address as lists separated by semicolons.
 */

const DEFAULTS = {
	modo: 'parallelo',
	r: '220;330;470',
	u: 'ohm;ohm;ohm',
	metodo: 'prodotto'
};

const EXAMPLES: { label: string; values: Partial<typeof DEFAULTS> }[] = [
	{
		label: '6 Ω e 3 Ω in parallelo',
		values: { modo: 'parallelo', r: '6;3', u: 'ohm;ohm' }
	},
	{
		label: '4,7 kΩ e 10 kΩ in parallelo',
		values: { modo: 'parallelo', r: '4,7;10', u: 'kohm;kohm' }
	},
	{
		label: '100 Ω, 220 Ω e 1 kΩ in serie',
		values: { modo: 'serie', r: '100;220;1', u: 'ohm;ohm;kohm' }
	},
	{
		label: 'Tre da 1 kΩ in parallelo',
		values: { modo: 'parallelo', r: '1;1;1', u: 'kohm;kohm;kohm' }
	}
];

export function ResistenzeTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(() => resistenze(state), [state]);
	const values = state.r.split(';');
	const units = values.map((_, i) => state.u.split(';')[i] || 'ohm');
	const parallel = state.modo === 'parallelo';

	const update = (vs: string[], us: string[]) => set({ r: vs.join(';'), u: us.join(';') });
	const setValue = (i: number, x: string) =>
		update(
			values.map((v, j) => (j === i ? x.replace(/;/g, '') : v)),
			units
		);
	const setUnit = (i: number, x: string) =>
		update(
			values,
			units.map((v, j) => (j === i ? x : v))
		);
	const remove = (i: number) =>
		update(
			values.filter((_, j) => j !== i),
			units.filter((_, j) => j !== i)
		);
	const add = () => update([...values, ''], [...units, units[units.length - 1] ?? 'ohm']);

	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToggleGroup
						label="Come sono collegate"
						options={[
							{ value: 'serie', label: 'In serie' },
							{ value: 'parallelo', label: 'In parallelo' }
						]}
						value={parallel ? 'parallelo' : 'serie'}
						onChange={(modo) => set({ modo })}
					/>
					{values.map((v, i) => (
						<div key={i} className="flex flex-col gap-1.5">
							<label htmlFor={`r-${i}`} className="label-mono text-fg-subtle">
								Resistenza {resName(i)}
							</label>
							<div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)_auto] gap-2">
								<input id={`r-${i}`} className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={v} onChange={(e) => setValue(i, e.target.value)} />
								<select aria-label={`Unità di ${resName(i)}`} className={unitSelectClass} value={units[i]} onChange={(e) => setUnit(i, e.target.value)}>
									{RES_UNITS.map((u) => (
										<option key={u.id} value={u.id}>
											{u.label}
										</option>
									))}
								</select>
								<button
									type="button"
									onClick={() => remove(i)}
									disabled={values.length <= 2}
									aria-label={`Togli ${resName(i)}`}
									title={`Togli ${resName(i)}`}
									className="flex size-12 items-center justify-center rounded-xl border border-edge bg-surface text-fg-subtle transition-colors hover:text-fg focus-ring disabled:opacity-40"
								>
									<Minus className="size-4" aria-hidden="true" />
								</button>
							</div>
						</div>
					))}
					{values.length < MAX_RESISTORS && (
						<button
							type="button"
							onClick={add}
							className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-dashed border-edge-strong px-3 text-sm font-medium text-fg-muted transition-colors hover:text-fg focus-ring"
						>
							<Plus className="size-4" aria-hidden="true" />
							Aggiungi una resistenza
						</button>
					)}
					{parallel && values.length === 2 && (
						<div className="flex flex-col gap-1.5">
							<span className="label-mono text-fg-subtle">Con due resistenze, il metodo</span>
							<ToggleGroup
								label="Metodo per due resistenze in parallelo"
								options={[
									{ value: 'prodotto', label: 'Prodotto / somma' },
									{ value: 'inversi', label: 'Somma degli inversi' }
								]}
								value={state.metodo === 'inversi' ? 'inversi' : 'prodotto'}
								onChange={(metodo) => set({ metodo })}
							/>
						</div>
					)}
					<CircuitSketch values={state.r} units={state.u} parallel={parallel} />
					<p className="text-xs text-fg-subtle">Per i decimali usa la virgola: 4,7 con kΩ vale 4700 Ω.</p>
					<Examples
						items={EXAMPLES.map((x) => ({
							label: x.label,
							apply: () => set(x.values)
						}))}
					/>
				</>
			}
		/>
	);
}

/** The circuit as in the books: resistors as rectangles, in a row (series) or on rungs between two rails (parallel). */
function CircuitSketch({ values, units, parallel }: { values: string; units: string; parallel: boolean }) {
	const us = units.split(';');
	const labels = values.split(';').map((v, i) => ({
		name: resName(i),
		value: resistorLabel(v, us[i] ?? 'ohm')
	}));
	const n = labels.length;
	const title = `Schema del circuito: ${n} resistenze ${parallel ? 'in parallelo' : 'in serie'}`;
	const rw = 44;
	const rh = 16;
	const text = 'fill-fg-muted text-[11px]';
	if (!parallel) {
		const step = 76;
		const w = 40 + n * step;
		const y = 40;
		return (
			<svg viewBox={`0 0 ${w} 80`} role="img" aria-label={title} className="h-auto w-full max-w-xl self-center text-fg" fill="none" stroke="currentColor" strokeWidth={1.5}>
				<title>{title}</title>
				<path d={`M8,${y} H${w - 8}`} />
				<circle cx={8} cy={y} r={3} className="fill-surface" />
				<circle cx={w - 8} cy={y} r={3} className="fill-surface" />
				{labels.map((l, i) => {
					const cx = 20 + step / 2 + i * step;
					return (
						<g key={i}>
							<rect x={cx - rw / 2} y={y - rh / 2} width={rw} height={rh} rx={2} className="fill-surface" />
							<rect x={cx - rw / 2} y={y - rh / 2} width={rw} height={rh} rx={2} className="fill-accent/10" />
							<text x={cx} y={y - 16} textAnchor="middle" stroke="none" className={cn(text, 'fill-fg')}>
								{l.name}
							</text>
							<text x={cx} y={y + 24} textAnchor="middle" stroke="none" className={text}>
								{l.value}
							</text>
						</g>
					);
				})}
			</svg>
		);
	}
	const rung = 40;
	const top = 24;
	const last = top + (n - 1) * rung;
	const h = last + 20;
	const w = 280;
	const left = 36;
	const right = w - 36;
	const mid = (top + last) / 2;
	return (
		<svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={title} className="h-auto w-full max-w-sm self-center text-fg" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<title>{title}</title>
			<path d={`M${left},${top} V${last} M${right},${top} V${last}`} />
			<path d={`M8,${mid} H${left} M${right},${mid} H${w - 8}`} />
			<circle cx={8} cy={mid} r={3} className="fill-surface" />
			<circle cx={w - 8} cy={mid} r={3} className="fill-surface" />
			{labels.map((l, i) => {
				const y = top + i * rung;
				const cx = w / 2;
				return (
					<g key={i}>
						<path d={`M${left},${y} H${right}`} />
						<circle cx={left} cy={y} r={2.2} stroke="none" className="fill-current" />
						<circle cx={right} cy={y} r={2.2} stroke="none" className="fill-current" />
						<rect x={cx - rw / 2} y={y - rh / 2} width={rw} height={rh} rx={2} className="fill-surface" />
						<rect x={cx - rw / 2} y={y - rh / 2} width={rw} height={rh} rx={2} className="fill-accent/10" />
						<text x={cx - rw / 2 - 6} y={y - 5} textAnchor="end" stroke="none" className={cn(text, 'fill-fg')}>
							{l.name}
						</text>
						<text x={cx + rw / 2 + 6} y={y - 5} textAnchor="start" stroke="none" className={text}>
							{l.value}
						</text>
					</g>
				);
			})}
		</svg>
	);
}
