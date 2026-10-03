'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { MousePointer2 } from 'lucide-react';
import { readNumber } from '@/lib/grafico/assi';
import { cn } from '@/lib/utils/cn';
import { CLIPS, GROUPS, toolOf, type Ask, type ToolId } from './geometry';

/** A dot of a tool's picture: full for what the tool makes, hollow for what it starts from. */
const Dot = ({ x, y, hollow = false }: { x: number; y: number; hollow?: boolean }) => <circle cx={x} cy={y} r={2} fill={hollow ? 'var(--surface, #fff)' : 'currentColor'} stroke="currentColor" strokeWidth={1.2} />;

/** The pictures of the tools, drawn on a square of 24: lines for the objects, dots for the points. */
const PICTURES: Record<Exclude<ToolId, 'move'>, ReactNode> = {
	point: <circle cx={12} cy={12} r={3.2} fill="currentColor" />,
	meet: (
		<>
			<path d="M3 19L21 5M4 6L20 18" />
			<Dot x={12.2} y={12.1} />
		</>
	),
	midpoint: (
		<>
			<path d="M4 18L20 6" />
			<Dot x={4} y={18} hollow />
			<Dot x={20} y={6} hollow />
			<Dot x={12} y={12} />
		</>
	),
	centre: (
		<>
			<path d="M3 19H21L9 4Z" strokeLinejoin="round" />
			<Dot x={11} y={14} />
		</>
	),
	line: (
		<>
			<path d="M2 20L22 4" />
			<Dot x={8} y={15.2} hollow />
			<Dot x={16} y={8.8} hollow />
		</>
	),
	segment: (
		<>
			<path d="M5 18L19 6" />
			<Dot x={5} y={18} hollow />
			<Dot x={19} y={6} hollow />
		</>
	),
	ray: (
		<>
			<path d="M5 18L22 3.4" />
			<Dot x={5} y={18} hollow />
			<Dot x={14} y={10.3} hollow />
		</>
	),
	vector: (
		<>
			<path d="M5 18L19 6M12.5 6.5L19 6L17.6 12.4" strokeLinejoin="round" />
			<Dot x={5} y={18} hollow />
		</>
	),
	parallel: (
		<>
			<path d="M2 15L16 3" opacity={0.55} />
			<path d="M8 21L22 9" />
			<Dot x={15} y={15} hollow />
		</>
	),
	perpendicular: (
		<>
			<path d="M2 18H22" opacity={0.55} />
			<path d="M12 3V21" />
			<path d="M12 14.5H15.5V18" strokeWidth={1} />
			<Dot x={12} y={7} hollow />
		</>
	),
	bisector: (
		<>
			<path d="M4 15H20" opacity={0.55} />
			<path d="M12 3V21" />
			<Dot x={4} y={15} hollow />
			<Dot x={20} y={15} hollow />
		</>
	),
	anglebisector: (
		<>
			<path d="M21 19H4L16 4" opacity={0.55} strokeLinejoin="round" />
			<path d="M4 19L22 9.5" />
			<Dot x={4} y={19} hollow />
		</>
	),
	tangent: (
		<>
			<circle cx={10} cy={14} r={6.5} opacity={0.55} />
			<path d="M4 4.5L22 13" />
			<Dot x={12.8} y={8.2} hollow />
		</>
	),
	circle: (
		<>
			<circle cx={12} cy={12} r={8} />
			<Dot x={12} y={12} hollow />
			<Dot x={17.7} y={6.4} hollow />
		</>
	),
	circler: (
		<>
			<circle cx={12} cy={12} r={8} />
			<path d="M12 12H20" strokeWidth={1} />
			<Dot x={12} y={12} hollow />
		</>
	),
	compass: (
		<>
			<circle cx={14} cy={10} r={7} />
			<path d="M14 10H21" strokeWidth={1} strokeDasharray="2 2" />
			<Dot x={14} y={10} hollow />
			<path d="M2.5 21H9.5" opacity={0.55} />
			<Dot x={2.5} y={21} hollow />
			<Dot x={9.5} y={21} hollow />
		</>
	),
	circle3: (
		<>
			<circle cx={12} cy={12} r={8} />
			<Dot x={5.1} y={8} hollow />
			<Dot x={18.9} y={8} hollow />
			<Dot x={12} y={20} hollow />
		</>
	),
	polygon: (
		<>
			<path d="M4 15L9 4L20 7L18 19L8 20Z" strokeLinejoin="round" fill="currentColor" fillOpacity={0.12} />
			<Dot x={4} y={15} hollow />
			<Dot x={9} y={4} hollow />
			<Dot x={20} y={7} hollow />
			<Dot x={18} y={19} hollow />
			<Dot x={8} y={20} hollow />
		</>
	),
	distance: (
		<>
			<path d="M4 17L20 7" strokeDasharray="2.5 2.5" />
			<Dot x={4} y={17} hollow />
			<Dot x={20} y={7} hollow />
			<path d="M9 8.5L11 11.7M12.2 6.5L14.2 9.7" strokeWidth={1} />
		</>
	),
	angle: (
		<>
			<path d="M21 19H4L17 4" strokeLinejoin="round" />
			<path d="M12 19A8 8 0 0 0 9.2 13" strokeWidth={1.2} />
		</>
	),
	slope: (
		<>
			<path d="M2 20L22 5" />
			<path d="M7 16.3H15V10.3" strokeWidth={1} strokeDasharray="2 2" />
		</>
	)
};

function ToolPicture({ id }: { id: ToolId }) {
	if (id === 'move') return <MousePointer2 className="size-4" aria-hidden="true" />;
	return (
		<svg viewBox="0 0 24 24" className="size-6 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" aria-hidden="true">
			{PICTURES[id]}
		</svg>
	);
}

/** The height the card of a tool can reach, in pixels: its film and four lines of text. */
const TIP_HEIGHT = 310;

/**
 * The tools of geometry, on the plane: a column on its left edge, a strip along the top on a narrow screen. Each
 * button is a group and shows the tool of the group used last; a click takes that tool and opens the list of the
 * others. The tool in hand stays pressed until another is chosen. With the mouse on a tool, or the focus, a card
 * says what the tool does and shows a short film of it at work.
 */
export function GeometryBar({ tool, onChoose }: { tool: ToolId; onChoose: (tool: ToolId) => void }) {
	const box = useRef<HTMLDivElement>(null);
	const list = useRef<HTMLDivElement>(null);
	/** The tool each group shows, where it is not the one in hand. */
	const [last, setLast] = useState<Record<number, ToolId>>({});
	const [open, setOpen] = useState<{ group: number; at: number } | null>(null);
	const [tip, setTip] = useState<{ id: ToolId; top: number; left: number } | null>(null);
	const wait = useRef(0);

	const show = (id: ToolId, button: HTMLElement, delay: number) => {
		window.clearTimeout(wait.current);
		wait.current = window.setTimeout(() => {
			const frame = box.current?.getBoundingClientRect();
			const room = box.current?.parentElement?.clientHeight ?? 600;
			if (!frame) return;
			// beside what is open, level with its tool, and never below the foot of the plane
			const edge = Math.max(frame.right, list.current?.getBoundingClientRect().right ?? 0);
			setTip({ id, left: edge - frame.left + 8, top: Math.max(0, Math.min(button.getBoundingClientRect().top - frame.top, room - TIP_HEIGHT - 16)) });
		}, delay);
	};
	const hide = () => {
		window.clearTimeout(wait.current);
		setTip(null);
	};
	useEffect(() => () => window.clearTimeout(wait.current), []);
	// the list of a group closes on a press outside the bar
	useEffect(() => {
		if (!open) return;
		const outside = (e: PointerEvent) => !box.current?.contains(e.target as Node) && setOpen(null);
		document.addEventListener('pointerdown', outside);
		return () => document.removeEventListener('pointerdown', outside);
	}, [open]);

	const take = (id: ToolId, group: number) => {
		hide();
		setLast((l) => ({ ...l, [group]: id }));
		onChoose(id);
	};
	/** What the mouse and the focus do to a tool's card: it is for a mouse, a finger has no hover. */
	const card = (id: ToolId) => ({
		'aria-describedby': tip?.id === id ? 'tool-tip' : undefined,
		onPointerEnter: (e: React.PointerEvent<HTMLButtonElement>) => e.pointerType === 'mouse' && show(id, e.currentTarget, tip ? 80 : 450),
		onPointerLeave: hide,
		onFocus: (e: React.FocusEvent<HTMLButtonElement>) => e.currentTarget.matches(':focus-visible') && show(id, e.currentTarget, 0),
		onBlur: hide
	});
	const shown = tip && toolOf(tip.id);

	return (
		<div ref={box} className="absolute top-2 left-2 z-10 max-h-[calc(100%-1rem)] max-lg:right-14 max-lg:max-w-[calc(100%-1rem)]">
			<div role="toolbar" aria-label="Strumenti di geometria" className="flex max-h-[inherit] flex-col overflow-y-auto rounded-xl border border-edge-strong bg-surface p-0.5 shadow-paper max-lg:w-fit max-lg:max-w-full max-lg:flex-row max-lg:overflow-x-auto max-lg:overflow-y-hidden">
				{GROUPS.map((group, g) => {
					const id = group.tools.includes(tool) ? tool : (last[g] ?? group.tools[0]);
					const many = group.tools.length > 1;
					return (
						<button
							key={group.name}
							type="button"
							aria-label={many ? `${toolOf(id).name}. Altri strumenti: ${group.name}` : toolOf(id).name}
							aria-pressed={tool === id}
							aria-haspopup={many ? 'menu' : undefined}
							aria-expanded={many ? open?.group === g : undefined}
							onClick={(e) => {
								take(id, g);
								const frame = box.current?.getBoundingClientRect();
								const at = e.currentTarget.getBoundingClientRect();
								// on a wide screen the list is beside its button, on a narrow one under it
								setOpen(many && open?.group !== g && frame ? { group: g, at: window.matchMedia('(min-width: 64rem)').matches ? at.top - frame.top : at.left - frame.left } : null);
							}}
							{...card(id)}
							className={cn('relative flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors focus-ring', tool === id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:bg-surface-3 hover:text-fg-strong')}
						>
							<ToolPicture id={id} />
							{/* a corner says there are more tools behind this one */}
							{many && <span className="absolute right-0.5 bottom-0.5 border-[3px] border-transparent border-r-current border-b-current opacity-60" aria-hidden="true" />}
						</button>
					);
				})}
			</div>

			{open && (
				<div
					ref={list}
					role="menu"
					aria-label={GROUPS[open.group].name}
					className="absolute z-20 flex w-64 flex-col rounded-xl border border-edge-strong bg-surface p-1 shadow-lift max-lg:top-full max-lg:left-[min(var(--at),calc(100%-16rem))] max-lg:mt-1 lg:top-[var(--at)] lg:left-full lg:ml-1"
					style={{ '--at': `${open.at}px` } as React.CSSProperties}
				>
					{GROUPS[open.group].tools.map((id) => (
						<button
							key={id}
							type="button"
							role="menuitemradio"
							aria-checked={tool === id}
							onClick={() => {
								take(id, open.group);
								setOpen(null);
							}}
							{...card(id)}
							className={cn('flex min-h-10 items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm leading-tight focus-ring', tool === id ? 'bg-surface-3 font-medium text-fg-strong' : 'text-fg-muted hover:bg-surface-3 hover:text-fg-strong')}
						>
							<ToolPicture id={id} />
							{toolOf(id).name}
						</button>
					))}
				</div>
			)}

			{shown && (
				<div id="tool-tip" role="tooltip" className="pointer-events-none absolute z-30 w-72 overflow-hidden rounded-xl border border-edge-strong bg-surface shadow-lift max-lg:hidden" style={{ top: tip.top, left: tip.left }}>
					{/* the film is the plane itself, so in the dark theme it is turned like the plane */}
					<video key={shown.clip} className="plot-clip block aspect-[8/5] w-full bg-white" width={CLIPS.width} height={CLIPS.height} poster={`${CLIPS.path}/${shown.clip}.jpg`} autoPlay loop muted playsInline preload="auto" aria-hidden="true">
						<source src={`${CLIPS.path}/${shown.clip}.webm`} type="video/webm" />
						<source src={`${CLIPS.path}/${shown.clip}.mp4`} type="video/mp4" />
					</video>
					<div className="border-t border-edge px-3 py-2.5">
						<p className="m-0 text-sm font-medium text-fg-strong">{shown.name}</p>
						<p className="mt-0.5 mb-0 text-sm text-fg-muted">{shown.about}</p>
					</div>
				</div>
			)}
		</div>
	);
}

/**
 * What the tool in hand is waiting for, at the foot of the plane. Where it waits for a number (a radius) or for a
 * choice (which centre of the triangle), the field or the buttons are here.
 */
export function ToolHint({ name, hint, ask, onAnswer }: { name: string; hint: string; ask: Ask | null; /** False when the answer cannot be used. */ onAnswer: (value: number) => boolean }) {
	const [text, setText] = useState('');
	const [wrong, setWrong] = useState(false);
	const submit = () => {
		const value = readNumber(text);
		const taken = value !== null && onAnswer(value);
		setWrong(!taken);
		if (taken) setText('');
	};
	return (
		<div role="status" className={cn('absolute bottom-2 left-2 z-10 flex max-w-[calc(100%-4.5rem)] flex-wrap items-center gap-x-2 gap-y-1.5 rounded-lg border border-edge-strong bg-surface px-2.5 py-1.5 text-sm text-fg-muted shadow-paper', !ask && 'pointer-events-none')}>
			<span>
				<span className="font-medium text-fg-strong">{name}.</span> {hint}
			</span>
			{ask?.kind === 'number' && (
				<form
					className="flex items-center gap-1.5"
					onSubmit={(e) => {
						e.preventDefault();
						submit();
					}}
				>
					<input
						autoFocus
						type="text"
						inputMode="decimal"
						aria-label={ask.label}
						aria-invalid={wrong}
						placeholder={ask.label}
						value={text}
						onChange={(e) => {
							setText(e.target.value);
							setWrong(false);
						}}
						className={cn('h-8 w-24 rounded-md border bg-surface px-2 text-sm text-fg-strong focus-ring', wrong ? 'border-danger' : 'border-edge-strong')}
					/>
					<button type="submit" className="h-8 rounded-md bg-accent px-2.5 text-sm font-medium text-accent-fg focus-ring">
						Disegna
					</button>
				</form>
			)}
			{ask?.kind === 'choice' && (
				<span className="flex flex-wrap gap-1">
					{ask.options.map((option, index) => (
						<button key={option} type="button" autoFocus={index === 0} onClick={() => onAnswer(index)} className="h-8 rounded-md border border-edge-strong bg-surface px-2.5 text-sm font-medium text-fg-strong hover:bg-surface-3 focus-ring">
							{option}
						</button>
					))}
				</span>
			)}
			{!ask && <span className="max-sm:hidden">Esc per lasciare.</span>}
		</div>
	);
}
