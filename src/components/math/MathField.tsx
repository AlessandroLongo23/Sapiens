'use client';

import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';
import type { MathfieldElement, VirtualKeyboardLayout } from 'mathlive';
import { Tex } from '@/components/content/interactive/kit';
import { cn } from '@/lib/utils/cn';
import { addNameShortcuts, dressField, type KeyboardChoice, layoutsOnFocus, loadMathLive } from './mathlive';

/**
 * A formula field that reports what is written as it changes: MathLive, loaded when the field appears. Until then,
 * and on the server, the starting formula is shown as it will look. The parent chooses the keys on screen and holds
 * the choice between Sapiens's keyboard and the device's (components/math/mathlive.ts).
 */
/** What a parent can do to a field from outside. */
export interface MathFieldHandle {
	/** Replaces what is written, without reporting it as a change. */
	set: (latex: string) => void;
}

export function MathField({
	ref,
	initial,
	onChange,
	onDone,
	label,
	layouts,
	keyboard,
	onEnter,
	className
}: {
	ref?: Ref<MathFieldHandle>;
	/** The LaTeX the field starts with; later changes of this prop are ignored, the field owns its text. */
	initial: string;
	onChange: (latex: string) => void;
	/** The student has finished writing: the field lost the focus, or Enter was pressed (before `onEnter`). */
	onDone?: (latex: string) => void;
	label: string;
	layouts: VirtualKeyboardLayout[];
	keyboard: KeyboardChoice | null;
	onEnter?: () => void;
	className?: string;
}) {
	const host = useRef<HTMLDivElement>(null);
	const field = useRef<MathfieldElement | null>(null);
	const [failed, setFailed] = useState(false);
	// The handlers read the latest props through a ref: the field is made once.
	const latest = useRef({ onChange, onDone, onEnter, keyboard, layouts });
	useEffect(() => {
		latest.current = { onChange, onDone, onEnter, keyboard, layouts };
	});
	// What the field last reported, so that a value set from outside is not reported back. Before MathLive has
	// made the field, a value set from outside is what the field will start with.
	const reported = useRef(initial);
	useImperativeHandle(ref, () => ({
		set: (latex) => {
			if (field.current?.value === latex) return;
			reported.current = latex;
			field.current?.setValue(latex, { silenceNotifications: true });
		}
	}));

	useEffect(() => {
		let cancelled = false;
		let poll = 0;
		let undoLayouts = () => {};
		loadMathLive()
			.then((MathfieldElement) => {
				if (cancelled || !host.current) return;
				const mf = new MathfieldElement();
				mf.setAttribute('aria-label', label);
				mf.className = 'block w-full bg-transparent outline-none';
				mf.value = reported.current;
				// some settings exist only once the field is in the page
				host.current.replaceChildren(mf);
				dressField(mf);
				// Shown by hand: left to MathLive ("auto") the keyboard on screen opens only on touch screens, and a
				// student at a computer who asks for it would not get it.
				mf.mathVirtualKeyboardPolicy = 'manual';
				mf.menuItems = [];
				mf.smartFence = true;
				addNameShortcuts(mf);
				undoLayouts = layoutsOnFocus(mf, latest.current.layouts);

				// MathLive's production build does not always report typing with an "input" event (see OpenAnswer.tsx):
				// the value is also read on the keys, and at a slow beat while the field has the focus, which covers
				// the keyboard on screen.
				const report = () => {
					if (mf.value === reported.current) return;
					reported.current = mf.value;
					latest.current.onChange(mf.value);
				};
				const done = () => {
					report();
					latest.current.onDone?.(mf.value);
				};
				mf.addEventListener('input', report);
				mf.addEventListener('keyup', report);
				mf.addEventListener('focusin', () => {
					window.clearInterval(poll);
					poll = window.setInterval(report, 200);
					if (latest.current.keyboard === 'sapiens') window.mathVirtualKeyboard.show();
				});
				mf.addEventListener('focusout', () => {
					window.clearInterval(poll);
					done();
					// the keyboard stays while the focus goes from one formula to another
					window.setTimeout(() => !document.activeElement?.matches('math-field') && window.mathVirtualKeyboard.hide(), 0);
				});
				// Enter can arrive twice, as a key and as a line break: it counts once.
				let entered = 0;
				const enter = (e: Event) => {
					e.preventDefault();
					if (e.timeStamp - entered < 100) return;
					entered = e.timeStamp;
					done();
					latest.current.onEnter?.();
				};
				mf.addEventListener('keydown', (e) => e.key === 'Enter' && enter(e));
				mf.addEventListener('beforeinput', (e) => (e as InputEvent).inputType === 'insertLineBreak' && enter(e));
				// MathLive can believe it has the focus while the page has moved it: a tap puts it back (see OpenAnswer.tsx).
				mf.addEventListener('pointerdown', () =>
					requestAnimationFrame(() => {
						if (document.activeElement === mf) return;
						mf.blur();
						mf.focus();
					})
				);
				field.current = mf;
			})
			.catch((err) => {
				console.error('MathLive:', err);
				if (!cancelled) setFailed(true);
			});
		return () => {
			cancelled = true;
			window.clearInterval(poll);
			undoLayouts();
		};
		// Made once: the parent gives a new key to a field that must start again.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div ref={host} className={cn('min-w-0', className)}>
			{/* Replaced by the field once MathLive is here. */}
			<span className={cn('block', failed && 'text-fg-muted')}>{initial ? <Tex>{initial}</Tex> : ' '}</span>
		</div>
	);
}
