'use client';

import { useRef, useState } from 'react';
import type { IconComponent } from '@/lib/utils/icons';
import { useKeyboardInset } from '@/lib/hooks/use-keyboard';
import { cn } from '@/lib/utils/cn';

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
}

/**
 * One toolbar for both editors, fed a different action list by each. It is a
 * real `role="toolbar"` with a roving tabindex: one button is tabbable and the
 * arrows move between them, so a keyboard user is not made to Tab through
 * thirteen buttons to reach the text. (ToggleGroup stays `role="group"` with
 * every button tabbable, which is right for three options and wrong for these.)
 *
 * On phones it is fixed to the bottom edge and lifted above the keyboard;
 * `onPointerDown` is cancelled on every button, or tapping one would blur the
 * editor, dismiss the keyboard and drop the selection the command needs.
 */
export function EditorToolbar({ actions, label = 'Formattazione' }: { actions: ToolbarAction[]; label?: string }) {
	const inset = useKeyboardInset();
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
	 * The one tabbable button, worked out during render rather than in an effect.
	 * It has to be an enabled one: Annulla leads the list and is disabled until
	 * there is something to undo, so a plain "first button" rule would leave the
	 * toolbar unreachable by Tab on every freshly opened note.
	 */
	const clamped = Math.min(focused, Math.max(0, actions.length - 1));
	const tabbable = enabled(clamped) ? clamped : step(clamped, 1);

	const move = (to: number) => {
		setFocused(to);
		buttons.current[to]?.focus();
	};

	const onKeyDown = (e: React.KeyboardEvent, index: number) => {
		const keys: Record<string, number> = {
			ArrowRight: step(index, 1),
			ArrowLeft: step(index, -1),
			Home: enabled(0) ? 0 : step(0, 1),
			End: enabled(actions.length - 1) ? actions.length - 1 : step(actions.length - 1, -1)
		};
		if (!(e.key in keys)) return;
		e.preventDefault();
		move(keys[e.key]);
	};

	return (
		<div
			role="toolbar"
			aria-orientation="horizontal"
			aria-label={label}
			style={inset ? { transform: `translateY(-${inset}px)` } : undefined}
			className="fixed inset-x-0 bottom-0 z-40 border-t border-edge-soft bg-surface/95 pb-safe backdrop-blur-sm transition-transform duration-150 motion-reduce:transition-none lg:static lg:z-auto lg:transform-none lg:border-b lg:border-t-0 lg:bg-transparent lg:pb-0 lg:backdrop-blur-none"
		>
			<div className="scroll-x no-scrollbar mx-auto flex h-tabbar max-w-3xl items-center gap-1 px-2 lg:h-11 lg:justify-start lg:overflow-visible lg:px-0">
				{actions.map((action, i) => {
					const active = action.isActive?.() ?? false;
					const disabled = action.isDisabled?.() ?? false;
					return (
						<span key={action.id} className="flex shrink-0 items-center">
							{action.startsGroup && i > 0 && <span className="mx-1 h-5 w-px shrink-0 bg-edge" aria-hidden="true" />}
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
								title={action.shortcut ? `${action.label} (${action.shortcut.replace('Control', 'Ctrl')})` : action.label}
								onPointerDown={(e) => e.preventDefault()}
								onFocus={() => setFocused(i)}
								onKeyDown={(e) => onKeyDown(e, i)}
								onClick={action.run}
								className={cn(
									'flex size-11 shrink-0 items-center justify-center rounded-xl transition duration-150 active:scale-90 focus-ring disabled:opacity-40 disabled:active:scale-100 lg:size-9 lg:rounded-lg',
									active ? 'bg-accent-soft text-accent-soft-fg' : 'text-fg-muted hover:bg-surface-3 hover:text-fg'
								)}
							>
								<action.icon className="size-5 lg:size-4" aria-hidden="true" />
							</button>
						</span>
					);
				})}
			</div>
			{/* Phones scroll the row sideways; the fade says there is more. */}
			<span className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-surface to-transparent lg:hidden" aria-hidden="true" />
		</div>
	);
}
