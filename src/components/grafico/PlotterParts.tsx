'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Check, Copy, Pause, Play, Settings2, Trash2 } from 'lucide-react';
import { checkboxClass } from '@/components/ui/Field';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { COLOR_NAMES, PALETTE, type LineDash, type LineWidth, type PlaneSettings, type PlotRow, type SliderMode, type SliderSpec, type SliderSpeed } from '@/lib/grafico/documento';
import { readNumber, withPi } from '@/lib/grafico/assi';
import { cn } from '@/lib/utils/cn';

/** The pieces of the plotter's panel: the look of a row, a parameter's slider with its animation, the settings of the plane. */

export function IconButton({
	label,
	onClick,
	pressed,
	disabled,
	className,
	children,
	text
}: {
	label: string;
	onClick: () => void;
	pressed?: boolean;
	disabled?: boolean;
	className?: string;
	children: ReactNode;
	/** Shown beside the icon from `sm` up. */
	text?: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			aria-pressed={pressed}
			title={label}
			disabled={disabled}
			className={cn(
				'flex h-9 min-w-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2 text-sm font-medium transition-colors focus-ring disabled:opacity-35',
				pressed ? 'bg-surface-3 text-fg-strong' : 'text-fg-muted hover:bg-surface-3 hover:text-fg-strong',
				className
			)}
		>
			{children}
			{text && <span className="hidden sm:inline">{text}</span>}
		</button>
	);
}

/**
 * A part that opens and closes with its height: what is under it slides down and up, and it fades with it. It stays
 * in the page while closed, out of reach of Tab and of screen readers.
 */
export function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
	return (
		<div className={cn('grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none', open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')} inert={!open || undefined}>
			<div className="min-h-0 overflow-hidden">{children}</div>
		</div>
	);
}

/** Keeps a part in the page for the time of its way out: `mounted` while it is there, `visible` while it is open. */
export function usePresence(open: boolean, ms = 200) {
	const [kept, setKept] = useState(false);
	const [shown, setShown] = useState(false);
	useEffect(() => {
		if (open) {
			// a frame in the page still closed, so that the way in is a transition too
			const id = requestAnimationFrame(() => {
				setShown(true);
				setKept(true);
			});
			return () => cancelAnimationFrame(id);
		}
		const timer = window.setTimeout(() => {
			setShown(false);
			setKept(false);
		}, ms);
		return () => window.clearTimeout(timer);
	}, [open, ms]);
	return { mounted: open || kept, visible: open && shown };
}

/** A number typed the Italian way: applied on Enter or on leaving the field, and put back when it is not one. */
export function NumberBox({ label, value, onChange, valid = () => true, pi = false, className }: { label: string; value: number; onChange: (value: number) => void; valid?: (value: number) => boolean; /** Shows a simple fraction of π as one: 2π, π/2. */ pi?: boolean; className?: string }) {
	const shown = pi ? withPi(value) : Number(value.toPrecision(6)).toString().replace('.', ',');
	// What is being typed, tied to the value it started from: a value changed from outside replaces it.
	const [typed, setTyped] = useState<{ text: string; from: number } | null>(null);
	const draft = typed && typed.from === value ? typed.text : null;
	const commit = () => {
		if (draft === null) return;
		// π is read in every box: a window from −2π to 2π, a slider up to π
		const x = readNumber(draft);
		if (Number.isFinite(x) && valid(x)) onChange(x);
		setTyped(null);
	};
	const key = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') commit();
		else if (e.key === 'Escape') setTyped(null);
	};
	return (
		<label className={cn('flex min-w-0 flex-col gap-1 text-xs text-fg-subtle', className)}>
			{label}
			<input
				type="text"
				inputMode={pi ? 'text' : 'decimal'}
				value={draft ?? shown}
				onChange={(e) => setTyped({ text: e.target.value, from: value })}
				onBlur={commit}
				onKeyDown={key}
				className="w-full min-w-0 rounded-lg border border-edge bg-surface px-2 py-1.5 text-right font-mono text-sm text-fg tabular-nums shadow-paper outline-none transition focus:border-accent focus:ring-3 focus:ring-accent/20"
			/>
		</label>
	);
}

const WIDTHS: { value: LineWidth; label: string }[] = [
	{ value: 'thin', label: 'Sottile' },
	{ value: 'normal', label: 'Normale' },
	{ value: 'thick', label: 'Spessa' }
];
const DASHES: { value: LineDash; label: string }[] = [
	{ value: 'solid', label: 'Continua' },
	{ value: 'dashed', label: 'A tratti' },
	{ value: 'dotted', label: 'A punti' }
];

/** How a row's curve looks: colour, weight, dash, its letter on the graph; and the row's copy and removal. */
export function RowStyle({ row, name, onChange, onDuplicate, onRemove }: { row: PlotRow; /** The function's letter, when the row has one. */ name?: string; onChange: (change: Partial<PlotRow>) => void; onDuplicate: () => void; onRemove: () => void }) {
	return (
		<div className="flex flex-col gap-3 border-t border-edge-soft bg-surface-2 px-3 py-3">
			<div role="radiogroup" aria-label="Colore della curva" className="flex flex-wrap gap-1.5">
				{PALETTE.map((color) => (
					<button
						key={color}
						type="button"
						role="radio"
						aria-checked={row.color === color}
						aria-label={COLOR_NAMES[color]}
						title={COLOR_NAMES[color]}
						onClick={() => onChange({ color })}
						className={cn('flex size-8 items-center justify-center rounded-full border-2 focus-ring', row.color === color ? 'border-fg-strong' : 'border-transparent hover:border-edge-strong')}
					>
						<span className="plot-swatch flex size-5 items-center justify-center rounded-full" style={{ backgroundColor: color }}>
							{row.color === color && <Check className="size-3 text-white" aria-hidden="true" />}
						</span>
					</button>
				))}
			</div>
			<ToggleGroup compact label="Spessore della linea" options={WIDTHS} value={row.width} onChange={(width) => onChange({ width })} />
			<ToggleGroup compact label="Tratto della linea" options={DASHES} value={row.dash} onChange={(dash) => onChange({ dash })} />
			<label className={cn('flex items-center gap-2 text-sm', name ? 'text-fg' : 'text-fg-faint')}>
				<input type="checkbox" className={checkboxClass} checked={row.label && !!name} disabled={!name} onChange={(e) => onChange({ label: e.target.checked })} />
				{name ? `Scrivi ${name} accanto alla curva` : 'Il nome accanto alla curva (serve una funzione con un nome)'}
			</label>
			<div className="flex gap-2">
				<button type="button" onClick={onDuplicate} className="flex h-9 items-center gap-1.5 rounded-lg border border-edge bg-surface px-3 text-sm font-medium text-fg-muted hover:border-edge-strong hover:text-fg-strong focus-ring">
					<Copy className="size-4" aria-hidden="true" />
					Duplica
				</button>
				<button type="button" onClick={onRemove} className="flex h-9 items-center gap-1.5 rounded-lg border border-edge bg-surface px-3 text-sm font-medium text-fg-muted hover:border-edge-strong hover:text-fg-strong focus-ring">
					<Trash2 className="size-4" aria-hidden="true" />
					Elimina
				</button>
			</div>
		</div>
	);
}

const SPEEDS: { value: SliderSpeed; label: string }[] = [
	{ value: 'slow', label: 'Lenta' },
	{ value: 'normal', label: 'Normale' },
	{ value: 'fast', label: 'Veloce' }
];
const MODES: { value: SliderMode; label: string }[] = [
	{ value: 'bounce', label: 'Avanti e indietro' },
	{ value: 'loop', label: 'In ciclo' },
	{ value: 'once', label: 'Una volta' }
];

/** A parameter: its slider, the button that sets it moving, and behind a button its range, step and way of moving. */
export function ParamSlider({ name, spec, playing, onPlay, onChange }: { name: string; spec: SliderSpec; playing: boolean; onPlay: () => void; /** `record` false while the slider is only being dragged along. */ onChange: (change: Partial<SliderSpec>) => void }) {
	const [open, setOpen] = useState(false);
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-1.5">
				<IconButton label={playing ? `Ferma ${name}` : `Anima ${name}`} onClick={onPlay} pressed={playing}>
					{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
				</IconButton>
				<Slider label={name} value={spec.value} min={spec.min} max={spec.max} step={spec.step} onChange={(value) => onChange({ value })} className="plot-slider min-w-0 flex-1" />
				<IconButton label={`Impostazioni di ${name}`} onClick={() => setOpen((o) => !o)} pressed={open}>
					<Settings2 className="size-4" aria-hidden="true" />
				</IconButton>
			</div>
			<Collapse open={open}>
				<div className="flex flex-col gap-3 rounded-xl bg-surface-2 p-3">
					<div className="grid grid-cols-3 gap-2">
						<NumberBox label="Minimo" value={spec.min} valid={(x) => x < spec.max} onChange={(min) => onChange({ min, value: Math.max(min, spec.value) })} />
						<NumberBox label="Massimo" value={spec.max} valid={(x) => x > spec.min} onChange={(max) => onChange({ max, value: Math.min(max, spec.value) })} />
						<NumberBox label="Passo" value={spec.step} valid={(x) => x > 0 && x <= spec.max - spec.min} onChange={(step) => onChange({ step })} />
					</div>
					<ToggleGroup compact label="Velocità dell’animazione" options={SPEEDS} value={spec.speed} onChange={(speed) => onChange({ speed })} />
					<ToggleGroup compact label="Come si muove" options={MODES} value={spec.mode} onChange={(mode) => onChange({ mode })} />
				</div>
			</Collapse>
		</div>
	);
}

const X_AXIS: { value: PlaneSettings['xAxis']; label: string }[] = [
	{ value: 'numbers', label: 'Numeri' },
	{ value: 'pi', label: 'Multipli di π' }
];
const GRIDS: { value: 'squares' | 'polar'; label: string }[] = [
	{ value: 'squares', label: 'Cartesiana' },
	{ value: 'polar', label: 'Polare' }
];
const ANGLES: { value: 'rad' | 'deg'; label: string }[] = [
	{ value: 'rad', label: 'Radianti' },
	{ value: 'deg', label: 'Gradi' }
];

export interface WindowBounds {
	x0: number;
	x1: number;
	y0: number;
	y1: number;
}

/** The settings of the plane: what is drawn, how the x axis is marked, the unit of the angles, the window in numbers. */
export function PlaneSettingsPanel({
	settings,
	onChange,
	bounds,
	onBounds,
	square,
	onSquare
}: {
	settings: PlaneSettings;
	onChange: (change: Partial<PlaneSettings>) => void;
	bounds: WindowBounds;
	onBounds: (bounds: WindowBounds) => void;
	/** Whether the two axes have the same scale now. */
	square: boolean;
	onSquare: () => void;
}) {
	const check = (key: 'grid' | 'axes' | 'numbers', label: string) => (
		<label className="flex items-center gap-2 text-sm text-fg">
			<input type="checkbox" className={checkboxClass} checked={settings[key]} onChange={(e) => onChange({ [key]: e.target.checked })} />
			{label}
		</label>
	);
	return (
		<div className="flex flex-col gap-4">
			<fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
				<legend className="label-mono mb-2 p-0 text-fg-subtle">Sul piano</legend>
				{check('grid', 'Griglia')}
				<Collapse open={settings.grid}>
					<div className="pb-1 pl-6">
						<ToggleGroup compact label="Tipo di griglia" options={GRIDS} value={settings.polar ? 'polar' : 'squares'} onChange={(v) => onChange({ polar: v === 'polar' })} />
					</div>
				</Collapse>
				{check('axes', 'Assi')}
				{check('numbers', 'Numeri sugli assi')}
			</fieldset>
			<div className="flex flex-col gap-2">
				<p className="label-mono m-0 text-fg-subtle">Angoli</p>
				<ToggleGroup compact label="Unità degli angoli" options={ANGLES} value={settings.degrees ? 'deg' : 'rad'} onChange={(v) => onChange({ degrees: v === 'deg' })} />
			</div>
			{!settings.degrees && !(settings.grid && settings.polar) && (
				<div className="flex flex-col gap-2">
					<p className="label-mono m-0 text-fg-subtle">Asse x</p>
					<ToggleGroup compact label="Segni sull’asse x" options={X_AXIS} value={settings.xAxis} onChange={(xAxis) => onChange({ xAxis })} />
				</div>
			)}
			<div className="flex flex-col gap-2">
				<p className="label-mono m-0 text-fg-subtle">Finestra</p>
				<div className="grid grid-cols-2 gap-2">
					<NumberBox label="x minimo" value={bounds.x0} valid={(x) => x < bounds.x1} onChange={(x0) => onBounds({ ...bounds, x0 })} />
					<NumberBox label="x massimo" value={bounds.x1} valid={(x) => x > bounds.x0} onChange={(x1) => onBounds({ ...bounds, x1 })} />
					<NumberBox label="y minimo" value={bounds.y0} valid={(y) => y < bounds.y1} onChange={(y0) => onBounds({ ...bounds, y0 })} />
					<NumberBox label="y massimo" value={bounds.y1} valid={(y) => y > bounds.y0} onChange={(y1) => onBounds({ ...bounds, y1 })} />
				</div>
				<button type="button" onClick={onSquare} disabled={square} className="h-9 rounded-lg border border-edge bg-surface px-3 text-sm font-medium text-fg-muted hover:border-edge-strong hover:text-fg-strong focus-ring disabled:opacity-40">
					Stessa scala sui due assi
				</button>
			</div>
		</div>
	);
}

/** A panel that opens over the plane from a button of the bar, and closes on Escape or on a press outside it. It comes and goes with a short fade. */
export function Popover({ title, onClose, anchor, visible, children }: { title: string; onClose: () => void; /** The button that opened it: a press there is the button's business. */ anchor: string; /** False on its way in and out. */ visible: boolean; children: ReactNode }) {
	const panel = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!visible) return;
		const outside = (e: PointerEvent) => {
			const target = e.target as HTMLElement;
			if (panel.current?.contains(target) || target.closest(`[data-popover="${anchor}"]`)) return;
			onClose();
		};
		const escape = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && onClose();
		document.addEventListener('pointerdown', outside);
		document.addEventListener('keydown', escape);
		return () => {
			document.removeEventListener('pointerdown', outside);
			document.removeEventListener('keydown', escape);
		};
	}, [onClose, anchor, visible]);
	return (
		<div
			ref={panel}
			role="dialog"
			aria-label={title}
			inert={!visible || undefined}
			className={cn(
				'absolute top-2 right-2 z-20 flex max-h-[calc(100%-1rem)] w-[min(21rem,calc(100%-1rem))] origin-top-right flex-col overflow-y-auto rounded-xl border border-edge-strong bg-surface p-4 shadow-lift transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none',
				visible ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none -translate-y-1.5 scale-[0.97] opacity-0'
			)}
		>
			<p className="mt-0 mb-3 font-display text-lg font-semibold text-fg-strong">{title}</p>
			{children}
		</div>
	);
}
