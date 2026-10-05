'use client';

import { useRef, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode, type RefObject } from 'react';
import { GripHorizontal, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { DEFAULTS, EXPLORER_MAX, EXPLORER_MIN, OUTPUT_MAX, OUTPUT_MIN, SPLIT_MAX, SPLIT_MIN, saveSettings, useEditorSettings } from './settings';

/** How much an arrow key moves a handle. */
const STEP = 0.02;

/**
 * The line between two parts of the editor that gives one the room it takes from the other: dragged, moved with the
 * arrow keys, put back by a double click. `upright` is a line between a left and a right; the other lies between an
 * above and a below. The share it sets is of `box`, measured from the left or from the top; `from` is 'end' when
 * the part it sizes is the one after it.
 */
export function Handle({
	box,
	upright,
	from = 'start',
	value,
	min,
	max,
	label,
	onChange,
	onReset
}: {
	box: RefObject<HTMLDivElement | null>;
	upright: boolean;
	from?: 'start' | 'end';
	value: number;
	min: number;
	max: number;
	label: string;
	onChange: (share: number) => void;
	onReset: () => void;
}) {
	const dragging = useRef(false);
	const clamp = (share: number) => Math.min(max, Math.max(min, share));
	const drag = (event: PointerEvent<HTMLDivElement>) => {
		if (!dragging.current || !box.current) return;
		const rect = box.current.getBoundingClientRect();
		const share = upright ? (event.clientX - rect.left) / rect.width : (event.clientY - rect.top) / rect.height;
		onChange(clamp(from === 'end' ? 1 - share : share));
	};
	const keys = (event: KeyboardEvent<HTMLDivElement>) => {
		const [less, more] = upright ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];
		const move = event.key === less ? -STEP : event.key === more ? STEP : 0;
		if (!move) return;
		event.preventDefault();
		onChange(clamp(value + (from === 'end' ? -move : move)));
	};
	const Grip = upright ? GripVertical : GripHorizontal;
	return (
		<div
			role="separator"
			aria-orientation={upright ? 'vertical' : 'horizontal'}
			aria-label={label}
			aria-valuemin={Math.round(min * 100)}
			aria-valuemax={Math.round(max * 100)}
			aria-valuenow={Math.round(value * 100)}
			tabIndex={0}
			title="Trascina per cambiare lo spazio; doppio clic per rimetterlo com’era"
			// the pointer is captured, so the drag goes on over the preview of a page, which is another document
			onPointerDown={(event) => {
				dragging.current = true;
				event.currentTarget.setPointerCapture(event.pointerId);
				event.preventDefault();
			}}
			onPointerMove={drag}
			onPointerUp={() => (dragging.current = false)}
			onPointerCancel={() => (dragging.current = false)}
			onDoubleClick={onReset}
			onKeyDown={keys}
			className={cn(
				'group relative z-10 hidden shrink-0 touch-none bg-edge outline-none lg:block',
				upright ? 'w-px cursor-col-resize' : 'h-px cursor-row-resize',
				// wider than it looks: the line is one pixel, the grip around it nine
				"after:absolute after:content-['']",
				upright ? 'after:inset-y-0 after:-right-1 after:-left-1' : 'after:inset-x-0 after:-top-1 after:-bottom-1',
				'before:absolute before:bg-accent before:opacity-0 before:transition-opacity hover:before:opacity-100 focus-visible:before:opacity-100 active:before:opacity-100',
				upright ? 'before:inset-y-0 before:-right-px before:-left-px' : 'before:inset-x-0 before:-top-px before:-bottom-px'
			)}
		>
			{/* the grip says the line can be taken; the clicks are the handle's */}
			<span
				className={cn(
					'pointer-events-none absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-edge-strong bg-surface text-fg-muted shadow-sm group-hover:border-accent group-hover:text-accent-fg group-focus-visible:border-accent group-active:border-accent',
					upright ? 'h-8 w-3.5' : 'h-3.5 w-8'
				)}
			>
				<Grip className="size-3" aria-hidden="true" />
			</span>
		</div>
	);
}

/**
 * The code and what comes of it. On a wide screen they are side by side, with a handle between them. The share is
 * one of the student's settings, so every editor opens as the last was left. On a narrow screen, and in a lesson
 * (`stacked`), the two are one above the other and there is no handle.
 */
export function Split({ left, right, stacked = false, full = false }: { left: ReactNode; right: ReactNode; stacked?: boolean; /** The editor has the whole screen: the two take all its height. */ full?: boolean }) {
	const { split } = useEditorSettings();
	const box = useRef<HTMLDivElement>(null);

	if (stacked)
		return (
			<div>
				{left}
				{right}
			</div>
		);

	return (
		<div ref={box} className={cn('flex flex-col lg:flex-row', full && 'min-h-0 flex-1 max-lg:overflow-auto')} style={{ '--split': `${split * 100}%` } as CSSProperties}>
			<div className="min-w-0 lg:w-[var(--split)] lg:shrink-0">{left}</div>
			<Handle box={box} upright value={split} min={SPLIT_MIN} max={SPLIT_MAX} label="Larghezza del codice" onChange={(share) => saveSettings({ split: share })} onReset={() => saveSettings({ split: DEFAULTS.split })} />
			<div className="min-w-0 flex-1">{right}</div>
		</div>
	);
}

/**
 * A project, laid out as in an editor of programs: the list of files at the left, the code beside it with most of
 * the room, and under the code what comes of running it. Two handles: one for the width of the list, one for the
 * height of the output. Without `output` the code has the whole column. On a narrow screen the three are one above
 * the other.
 */
export function Panes({ files, editor, output, full = false }: { files: ReactNode; editor: ReactNode; output: ReactNode | null; full?: boolean }) {
	const { explorer, output: height } = useEditorSettings();
	const box = useRef<HTMLDivElement>(null);
	const column = useRef<HTMLDivElement>(null);
	return (
		<div ref={box} className={cn('flex flex-col lg:flex-row', full ? 'min-h-0 flex-1 max-lg:overflow-auto' : 'lg:h-[38rem]')} style={{ '--explorer': `${explorer * 100}%`, '--output': `${height * 100}%` } as CSSProperties}>
			<div className="max-h-44 min-w-0 overflow-auto border-b border-edge lg:max-h-none lg:w-[var(--explorer)] lg:shrink-0 lg:border-b-0">{files}</div>
			<Handle box={box} upright value={explorer} min={EXPLORER_MIN} max={EXPLORER_MAX} label="Larghezza dell’elenco dei file" onChange={(share) => saveSettings({ explorer: share })} onReset={() => saveSettings({ explorer: DEFAULTS.explorer })} />
			<div ref={column} className="flex min-w-0 flex-1 flex-col">
				<div className="min-h-0 border-b border-edge lg:flex-1 lg:border-b-0">{editor}</div>
				{output !== null && (
					<>
						<Handle box={column} upright={false} from="end" value={height} min={OUTPUT_MIN} max={OUTPUT_MAX} label="Altezza dell’uscita" onChange={(share) => saveSettings({ output: share })} onReset={() => saveSettings({ output: DEFAULTS.output })} />
						<div className="h-[16rem] min-h-0 lg:h-[var(--output)] lg:shrink-0">{output}</div>
					</>
				)}
			</div>
		</div>
	);
}
