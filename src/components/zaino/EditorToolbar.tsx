'use client';

import { useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, GripHorizontal, GripVertical, MoreHorizontal, PenLine } from 'lucide-react';
import type { IconComponent } from '@/lib/utils/icons';
import { useKeyboardInset } from '@/lib/hooks/use-keyboard';
import { useCoarsePointer, useMd, useReducedMotion } from '@/lib/hooks/use-media';
import { useNoteView, type ToolbarDock } from '@/lib/state/note-view';
import { cn } from '@/lib/utils/cn';
import { MenuItem, Popover } from './Popover';

export interface ToolbarAction {
	id: string;
	/** Italian; also the accessible name. */
	label: string;
	icon: IconComponent;
	/** Advertised on the button, e.g. 'Control+B'. */
	shortcut?: string;
	run: () => void;
	/** A toggle when present, a plain action when not: only toggles get aria-pressed. */
	isActive?: () => boolean;
	isDisabled?: () => boolean;
	/** Separates the group that starts with this action. */
	startsGroup?: boolean;
	/** Goes into the "Altro" menu when the floating bar has no room for everything. */
	secondary?: boolean;
	/** When even the rest does not fit, the lowest go into "Altro" first (default 3). */
	priority?: number;
}

const DOCK_NAME: Record<ToolbarDock, string> = { bottom: 'in basso', left: 'a sinistra', right: 'a destra' };
const shortcutText = (s: string) => s.replace('Control', 'Ctrl');

/**
 * One toolbar for both editors, fed a different action list by each.
 *
 * On phones it is fixed to the bottom edge and lifted above the keyboard. From
 * `md` up it floats over the sheet, as in Notability: centred on the bottom
 * edge, or standing up in the middle of the left or right edge. It is dragged
 * there by its grip, which snaps it to the nearest of the three places, or
 * moved with the arrow keys on the grip; it folds into a pill when not needed.
 * The place is remembered in this browser (lib/state/note-view).
 *
 * The buttons are a real `role="toolbar"` with a roving tabindex, so a
 * keyboard user is not made to Tab through fifteen buttons to reach the text.
 * `onPointerDown` is cancelled on every button, or pressing one would blur the
 * editor and drop the selection the command needs.
 */
export function EditorToolbar({ actions, label = 'Formattazione' }: { actions: ToolbarAction[]; label?: string }) {
	const md = useMd();
	return md ? <FloatingToolbar actions={actions} label={label} /> : <PhoneToolbar actions={actions} label={label} />;
}

function PhoneToolbar({ actions, label }: { actions: ToolbarAction[]; label: string }) {
	const inset = useKeyboardInset();
	return (
		<div
			style={inset ? { transform: `translateY(-${inset}px)` } : undefined}
			className="fixed inset-x-0 bottom-0 z-40 border-t border-edge-soft bg-surface/95 pb-safe backdrop-blur-sm transition-transform duration-150 motion-reduce:transition-none"
		>
			<ToolbarButtons actions={actions} label={label} orientation="horizontal" className="scroll-x no-scrollbar mx-auto h-tabbar max-w-3xl gap-1 px-2" size="phone" />
			{/* The row scrolls sideways; the fade says there is more. */}
			<span className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-surface to-transparent" aria-hidden="true" />
		</div>
	);
}

/** The places the toolbar can go, as points in the editor area it floats over. */
function anchors(w: number, h: number): Record<ToolbarDock, { x: number; y: number }> {
	return { bottom: { x: w / 2, y: h - 36 }, left: { x: 36, y: h / 2 }, right: { x: w - 36, y: h / 2 } };
}

function FloatingToolbar({ actions, label }: { actions: ToolbarAction[]; label: string }) {
	const { dock, collapsed, setDock, setCollapsed } = useNoteView();
	const inset = useKeyboardInset();
	const coarse = useCoarsePointer();
	const reduced = useReducedMotion();
	const bar = useRef<HTMLDivElement>(null);
	const [drag, setDrag] = useState<{ x: number; y: number; dx: number; dy: number; w: number; h: number; length: number; near: ToolbarDock } | null>(null);
	const [announce, setAnnounce] = useState('');
	// Room along the bar's axis in the area it floats over, measured.
	const [room, setRoom] = useState(Infinity);
	const [more, setMore] = useState(false);
	// Where the bar was on screen before a change of place, for the glide to the new one.
	const from = useRef<DOMRect | null>(null);

	const vertical = dock !== 'bottom';

	useLayoutEffect(() => {
		const box = bar.current?.offsetParent as HTMLElement | null;
		if (!box) return;
		const measure = () => setRoom((vertical ? box.clientHeight : box.clientWidth) - 32);
		const observer = new ResizeObserver(measure);
		observer.observe(box);
		measure();
		return () => observer.disconnect();
	}, [vertical]);

	/*
	 * The length the bar needs, worked out from its parts rather than measured,
	 * so moving actions into "Altro" cannot make it look roomy again and flip
	 * back. Without room for everything, the secondary actions go into "Altro",
	 * then the last of the others; only a bar of four that still does not fit scrolls.
	 */
	const button = coarse ? 46 : 34;
	const length = (list: ToolbarAction[], extra: number) => list.length * button + list.filter((a, i) => a.startsGroup && i > 0).length * 11 + button * (2 + extra) + 16;
	// With a margin: the estimate must err towards "Altro", never towards a bar that scrolls.
	const compact = length(actions, 0) * 1.1 > room;
	let shown = compact ? actions.filter((a) => !a.secondary) : actions;
	// Still too long: the least needed of the others follow them into "Altro", until the bar fits.
	while (compact && shown.length > 4 && length(shown, 1) * 1.1 > room) {
		const least = shown.reduce((low, a) => ((a.priority ?? 3) < (low.priority ?? 3) ? a : low), shown[shown.length - 1]);
		shown = shown.filter((a) => a !== least);
	}
	const hidden = compact ? actions.filter((a) => !shown.includes(a)) : [];
	const tight = compact && length(shown, 1) * 1.1 > room;

	useLayoutEffect(() => {
		const el = bar.current;
		const before = from.current;
		from.current = null;
		if (!el || !before || reduced) return;
		const after = el.getBoundingClientRect();
		const dx = before.left + before.width / 2 - (after.left + after.width / 2);
		const dy = before.top + before.height / 2 - (after.top + after.height / 2);
		el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(0.96)`, opacity: 0.85 }, { transform: 'none', opacity: 1 }], {
			duration: 260,
			easing: 'cubic-bezier(0.2, 0.9, 0.3, 1.05)'
		});
	}, [dock, collapsed, reduced]);

	const moveTo = (next: ToolbarDock) => {
		from.current = bar.current?.getBoundingClientRect() ?? null;
		setDock(next);
		setAnnounce(`Barra degli strumenti ${DOCK_NAME[next]}.`);
	};

	const area = () => bar.current?.offsetParent?.getBoundingClientRect() ?? null;

	const onGripDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
		if (e.button !== 0) return;
		const box = area();
		const rect = bar.current?.getBoundingClientRect();
		if (!box || !rect) return;
		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);
		setDrag({
			x: rect.left - box.left,
			y: rect.top - box.top,
			dx: e.clientX - rect.left,
			dy: e.clientY - rect.top,
			w: box.width,
			h: box.height,
			length: Math.max(rect.width, rect.height),
			near: dock
		});
	};
	const onGripMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
		if (!drag) return;
		const box = area();
		if (!box) return;
		const px = e.clientX - box.left;
		const py = e.clientY - box.top;
		const points = anchors(box.width, box.height);
		let near: ToolbarDock = 'bottom';
		let best = Infinity;
		for (const d of Object.keys(points) as ToolbarDock[]) {
			const dist = Math.hypot(points[d].x - px, points[d].y - py);
			if (dist < best) [best, near] = [dist, d];
		}
		setDrag({ ...drag, x: px - drag.dx, y: py - drag.dy, near });
	};
	const onGripUp = () => {
		if (!drag) return;
		const near = drag.near;
		from.current = bar.current?.getBoundingClientRect() ?? null;
		setDrag(null);
		if (near !== dock) {
			setDock(near);
			setAnnounce(`Barra degli strumenti ${DOCK_NAME[near]}.`);
		}
	};
	const onGripKey = (e: React.KeyboardEvent) => {
		const next: Partial<Record<string, ToolbarDock>> = { ArrowLeft: 'left', ArrowRight: 'right', ArrowDown: 'bottom' };
		const target = next[e.key];
		if (!target) return;
		e.preventDefault();
		if (target !== dock) moveTo(target);
	};

	const place = cn(
		'absolute z-30',
		dock === 'bottom' && 'bottom-4 left-1/2 -translate-x-1/2',
		dock === 'left' && 'left-4 top-1/2 -translate-y-1/2',
		dock === 'right' && 'right-4 top-1/2 -translate-y-1/2'
	);
	const lift = dock === 'bottom' && inset ? { marginBottom: inset } : undefined;
	const Grip = vertical ? GripHorizontal : GripVertical;
	const Fold = dock === 'bottom' ? ChevronDown : dock === 'left' ? ChevronLeft : ChevronRight;

	const grip = (
		<button
			type="button"
			aria-label={`Sposta la barra degli strumenti, ora ${DOCK_NAME[dock]}. Frecce sinistra, destra e giù per cambiare lato.`}
			data-tip="Trascina per spostare"
			onPointerDown={onGripDown}
			onPointerMove={onGripMove}
			onPointerUp={onGripUp}
			onPointerCancel={() => setDrag(null)}
			onKeyDown={onGripKey}
			className={cn(
				'tb-tip flex shrink-0 touch-none items-center justify-center rounded-lg text-fg-faint transition-colors hover:bg-surface-3 hover:text-fg-muted focus-ring',
				drag ? 'cursor-grabbing' : 'cursor-grab',
				vertical ? 'h-6 w-9' : 'h-9 w-6'
			)}
		>
			<Grip className="size-4" aria-hidden="true" />
		</button>
	);

	return (
		<>
			<p className="sr-only" role="status" aria-live="polite">
				{announce}
			</p>

			{/* While dragging, the three places it can go, the nearest one lit. */}
			{drag &&
				(['bottom', 'left', 'right'] as ToolbarDock[]).map((d) => {
					const p = anchors(drag.w, drag.h)[d];
					const long = Math.min(drag.length, (d === 'bottom' ? drag.w : drag.h) - 32);
					const w = d === 'bottom' ? long : 52;
					const h = d === 'bottom' ? 52 : long;
					return (
						<div
							key={d}
							aria-hidden="true"
							style={{ left: p.x - w / 2 + (d === 'left' ? -10 : d === 'right' ? 10 : 0), top: p.y - h / 2 + (d === 'bottom' ? 10 : 0), width: w, height: h }}
							className={cn(
								'pointer-events-none absolute z-20 rounded-2xl border-2 border-dashed transition-colors duration-150',
								drag.near === d ? 'border-accent bg-accent-soft/70' : 'border-edge-strong bg-surface/40'
							)}
						/>
					);
				})}

			<div
				ref={bar}
				data-dock={dock}
				style={drag ? { left: drag.x, top: drag.y, transform: 'none' } : lift}
				className={cn(
					drag ? 'absolute z-40 cursor-grabbing opacity-95 shadow-2xl' : place,
					// w-max: centred with left 50%, a shrink-to-fit bar would be capped at half the area and spill.
					'flex w-max items-center gap-0.5 rounded-2xl border border-edge bg-surface/95 p-1 shadow-lift backdrop-blur-md',
					vertical ? 'flex-col' : 'flex-row',
					tight && !drag && !more && (vertical ? 'no-scrollbar max-h-[calc(100%-2rem)] overflow-y-auto [&_.tb-tip]:after:hidden' : 'no-scrollbar max-w-[calc(100%-2rem)] overflow-x-auto [&_.tb-tip]:after:hidden'),
					drag && '[&_.tb-tip]:after:hidden'
				)}
			>
				{collapsed ? (
					<>
						{grip}
						<button
							type="button"
							onClick={() => {
								from.current = bar.current?.getBoundingClientRect() ?? null;
								setCollapsed(false);
							}}
							aria-expanded={false}
							aria-label="Mostra la barra degli strumenti"
							className={cn(
								'flex items-center justify-center gap-2 rounded-xl text-sm font-medium text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg focus-ring',
								vertical ? 'size-9' : 'h-9 px-3'
							)}
						>
							<PenLine className="size-4" aria-hidden="true" />
							{!vertical && <span>Strumenti</span>}
						</button>
					</>
				) : (
					<>
						{grip}
						<ToolbarButtons actions={shown} label={label} orientation={vertical ? 'vertical' : 'horizontal'} className={vertical ? 'flex-col gap-0.5' : 'gap-0.5'} size={coarse ? 'touch' : 'desk'} />
						{hidden.length > 0 && (
							<div className="relative shrink-0">
								<button
									type="button"
									onClick={() => setMore(!more)}
									aria-haspopup="menu"
									aria-expanded={more}
									aria-label="Altri strumenti"
									data-tip="Altro"
									onPointerDown={(e) => e.preventDefault()}
									className={cn(
										'tb-tip flex items-center justify-center text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg focus-ring',
										coarse ? 'size-11 rounded-xl' : 'size-8 rounded-lg',
										more && 'bg-surface-3 text-fg'
									)}
								>
									<MoreHorizontal className="size-[17px]" aria-hidden="true" />
								</button>
								<Popover
									open={more}
									onClose={() => setMore(false)}
									label="Altri strumenti"
									role="menu"
									className="w-64"
									placement={dock === 'bottom' ? 'top-center' : dock === 'left' ? 'right-end' : 'left-end'}
								>
									{hidden.map((a) => (
										<MenuItem
											key={a.id}
											icon={a.icon}
											hint={a.shortcut ? a.shortcut.replace('Control', 'Ctrl').replace('+Shift', ' Maiusc').replace('+', ' ') : undefined}
											disabled={a.isDisabled?.()}
											onSelect={() => {
												setMore(false);
												a.run();
											}}
										>
											{a.label}
										</MenuItem>
									))}
								</Popover>
							</div>
						)}
						<span className={cn('shrink-0 bg-edge', vertical ? 'mx-auto my-1 h-px w-5' : 'mx-1 h-5 w-px')} aria-hidden="true" />
						<button
							type="button"
							onClick={() => {
								from.current = bar.current?.getBoundingClientRect() ?? null;
								setCollapsed(true);
							}}
							aria-expanded={true}
							aria-label="Riduci la barra degli strumenti"
							data-tip="Riduci"
							className={cn('tb-tip flex shrink-0 items-center justify-center rounded-lg text-fg-subtle transition-colors hover:bg-surface-3 hover:text-fg focus-ring', coarse ? 'size-11' : 'size-8')}
						>
							<Fold className="size-4" aria-hidden="true" />
						</button>
					</>
				)}
			</div>
		</>
	);
}

function ToolbarButtons({
	actions,
	label,
	orientation,
	className,
	size
}: {
	actions: ToolbarAction[];
	label: string;
	orientation: 'horizontal' | 'vertical';
	className?: string;
	size: 'phone' | 'touch' | 'desk';
}) {
	const [focused, setFocused] = useState(0);
	const buttons = useRef<(HTMLButtonElement | null)[]>([]);

	const enabled = (i: number) => !(actions[i]?.isDisabled?.() ?? false);
	/** The next enabled button in a direction, wrapping; `from` if there is none. */
	const step = (from: number, dir: 1 | -1) => {
		let i = from;
		for (let n = 0; n < actions.length; n++) {
			i = (i + dir + actions.length) % actions.length;
			if (enabled(i)) return i;
		}
		return from;
	};

	/*
	 * The one tabbable button, worked out during render. It has to be an enabled
	 * one: Annulla leads the list and is disabled until there is something to
	 * undo, so a plain "first button" rule would leave the toolbar unreachable.
	 */
	const clamped = Math.min(focused, Math.max(0, actions.length - 1));
	const tabbable = enabled(clamped) ? clamped : step(clamped, 1);

	const onKeyDown = (e: React.KeyboardEvent, index: number) => {
		const [next, prev] = orientation === 'vertical' ? ['ArrowDown', 'ArrowUp'] : ['ArrowRight', 'ArrowLeft'];
		const keys: Record<string, number> = {
			[next]: step(index, 1),
			[prev]: step(index, -1),
			Home: enabled(0) ? 0 : step(0, 1),
			End: enabled(actions.length - 1) ? actions.length - 1 : step(actions.length - 1, -1)
		};
		if (!(e.key in keys)) return;
		e.preventDefault();
		setFocused(keys[e.key]);
		buttons.current[keys[e.key]]?.focus();
	};

	const vertical = orientation === 'vertical';
	return (
		<div role="toolbar" aria-orientation={orientation} aria-label={label} className={cn('flex items-center', className)}>
			{actions.map((action, i) => {
				const active = action.isActive?.() ?? false;
				const disabled = action.isDisabled?.() ?? false;
				const tip = action.shortcut ? `${action.label} · ${shortcutText(action.shortcut)}` : action.label;
				return (
					<span key={action.id} className={cn('flex shrink-0 items-center', vertical && 'flex-col')}>
						{action.startsGroup && i > 0 && <span className={cn('shrink-0 bg-edge', vertical ? 'my-1 h-px w-5' : 'mx-1 h-5 w-px')} aria-hidden="true" />}
						<button
							ref={(el) => {
								buttons.current[i] = el;
							}}
							type="button"
							tabIndex={i === tabbable ? 0 : -1}
							disabled={disabled}
							aria-label={action.label}
							aria-pressed={action.isActive ? active : undefined}
							aria-keyshortcuts={action.shortcut}
							title={size === 'phone' ? tip : undefined}
							data-tip={size === 'phone' ? undefined : tip}
							onPointerDown={(e) => e.preventDefault()}
							onFocus={() => setFocused(i)}
							onKeyDown={(e) => onKeyDown(e, i)}
							onClick={action.run}
							className={cn(
								'flex shrink-0 items-center justify-center transition duration-150 active:scale-90 focus-ring disabled:opacity-35 disabled:active:scale-100',
								size === 'phone' && 'size-11 rounded-xl',
								size === 'touch' && 'size-11 rounded-xl',
								size === 'desk' && 'size-8 rounded-lg',
								size !== 'phone' && 'tb-tip',
								active ? 'bg-accent-soft text-accent-soft-fg' : 'text-fg-muted hover:bg-surface-3 hover:text-fg'
							)}
						>
							<action.icon className={size === 'phone' ? 'size-5' : 'size-[17px]'} aria-hidden="true" />
						</button>
					</span>
				);
			})}
		</div>
	);
}
