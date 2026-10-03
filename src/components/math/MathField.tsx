'use client';

import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';
import type { MathfieldElement, VirtualKeyboardLayout } from 'mathlive';
import { Tex } from '@/components/content/interactive/kit';
import { cn } from '@/lib/utils/cn';
import { attachCompletion, Proposals, type Completer, type ProposalList } from './completion';
import { addNameShortcuts, dressField, inBrace, inEmptyBraceRow, type KeyboardChoice, layoutsOnFocus, loadMathLive } from './mathlive';
// MathLive draws with KaTeX's fonts and is told to take them from the page: without them a tall brace stays one line high.
import 'katex/dist/katex.min.css';

/**
 * A formula field that reports what is written as it changes: MathLive, loaded when the field appears. Until then,
 * and on the server, the starting formula is shown as it will look. The parent chooses the keys on screen and holds
 * the choice between Sapiens's keyboard and the device's (components/math/mathlive.ts).
 */
/** What a parent can do to a field from outside. */
export interface MathFieldHandle {
	/** Replaces what is written, without reporting it as a change. */
	set: (latex: string) => void;
	/** Writes a template where the cursor is (MathLive's notation, #? for a hole) and takes the focus, the cursor in the first hole. */
	insert: (template: string) => void;
}

export function MathField({
	ref,
	initial,
	onChange,
	onDone,
	label,
	layouts,
	shortcuts,
	completer,
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
	/** Words that become a formula as they are typed, beside the Italian function names. */
	shortcuts?: Record<string, string>;
	/** Proposals while typing, from a list of words (components/math/completion.tsx). The words are then the list's: `shortcuts` is not used. */
	completer?: Completer;
	keyboard: KeyboardChoice | null;
	onEnter?: () => void;
	className?: string;
}) {
	const host = useRef<HTMLDivElement>(null);
	const field = useRef<MathfieldElement | null>(null);
	const [failed, setFailed] = useState(false);
	const [proposals, setProposals] = useState<ProposalList | null>(null);
	const completion = useRef<ReturnType<typeof attachCompletion> | null>(null);
	// The handlers read the latest props through a ref: the field is made once.
	const latest = useRef({ onChange, onDone, onEnter, keyboard, layouts });
	useEffect(() => {
		latest.current = { onChange, onDone, onEnter, keyboard, layouts };
	});
	// What the field last reported, so that a value set from outside is not reported back. Before MathLive has
	// made the field, a value set from outside is what the field will start with.
	const reported = useRef(initial);
	// A template asked for before MathLive has made the field: written as soon as it is there.
	const waiting = useRef<string | null>(null);
	const write = (mf: MathfieldElement, template: string) => {
		mf.focus();
		mf.insert(template, { selectionMode: 'placeholder' });
		if (mf.value === reported.current) return;
		reported.current = mf.value;
		latest.current.onChange(mf.value);
	};
	useImperativeHandle(ref, () => ({
		set: (latex) => {
			if (field.current?.value === latex) return;
			reported.current = latex;
			field.current?.setValue(latex, { silenceNotifications: true });
		},
		insert: (template) => {
			if (field.current) write(field.current, template);
			else waiting.current = template;
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
				if (!completer) addNameShortcuts(mf, shortcuts);
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
					// a word left whole before the cursor becomes its formula first: "sin" is the sine
					completion.current?.leave();
					report();
					latest.current.onDone?.(mf.value);
				};
				// before the field's own keys: the arrows and Enter are the proposals' while these are open
				if (completer) completion.current = attachCompletion(mf, completer, (list) => !cancelled && setProposals(list), report);
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
					// in a brace Enter is a new row of the brace: a third piece, another condition of the system
					if (inBrace(mf)) {
						mf.executeCommand('addRowAfter');
						report();
						return;
					}
					done();
					latest.current.onEnter?.();
				};
				mf.addEventListener('keydown', (e) => e.key === 'Enter' && enter(e));
				// Backspace in an empty row of a brace takes the row away, as Enter added it. Heard on the way down,
				// before MathLive, which would only empty the cell.
				mf.addEventListener(
					'keydown',
					(e) => {
						if (e.key !== 'Backspace' || !inEmptyBraceRow(mf)) return;
						e.preventDefault();
						e.stopPropagation();
						mf.executeCommand('removeRow');
						report();
					},
					{ capture: true }
				);
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
				if (waiting.current !== null) write(mf, waiting.current);
				waiting.current = null;
			})
			.catch((err) => {
				console.error('MathLive:', err);
				if (!cancelled) setFailed(true);
			});
		return () => {
			cancelled = true;
			window.clearInterval(poll);
			undoLayouts();
			completion.current?.detach();
		};
		// Made once: the parent gives a new key to a field that must start again.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div ref={host} className={cn('min-w-0', className)}>
				{/* Replaced by the field once MathLive is here. */}
				<span className={cn('block truncate', failed && 'text-fg-muted')}>{initial ? <Tex>{initial}</Tex> : ' '}</span>
			</div>
			{proposals && <Proposals list={proposals} onPick={(i) => completion.current?.pick(i)} />}
		</>
	);
}
