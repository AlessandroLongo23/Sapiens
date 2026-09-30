'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Keyboard } from 'lucide-react';
import type { MathfieldElement, VirtualKeyboardLayout } from 'mathlive';
import { cn } from '@/lib/utils/cn';

/**
 * Where the student types an open answer (vault/Decisioni/2026-09-30 La risposta aperta si scrive con MathLive, con
 * la tastiera di Sapiens o quella del dispositivo.md): a MathLive formula field, loaded the first time an open
 * question appears. Two ways to write, remembered on this device: Sapiens's keyboard on screen, the first choice on
 * touch screens, or the device's own keyboard, where / opens a fraction and ^ an exponent. MathLive draws with the
 * KaTeX fonts the page already has, so it loads none of its own.
 */

export type OpenState = 'idle' | 'pending' | 'correct' | 'incorrect';

/** The way to write chosen on this device: 'sapiens' (the keyboard on screen) or 'device'. */
const KEYBOARD_KEY = 'sapiens:keyboard';
type KeyboardChoice = 'sapiens' | 'device';

function readKeyboard(): KeyboardChoice {
	try {
		const saved = localStorage.getItem(KEYBOARD_KEY);
		if (saved === 'sapiens' || saved === 'device') return saved;
	} catch {
		// storage blocked: the default for this screen
	}
	return window.matchMedia('(pointer: coarse)').matches ? 'sapiens' : 'device';
}

function saveKeyboard(choice: KeyboardChoice) {
	try {
		localStorage.setItem(KEYBOARD_KEY, choice);
	} catch {
		// not remembered, still used for this visit
	}
}

/** The keys a school answer needs, in one layer: digits and operations, fractions, powers and roots, the words of a solution set. */
const SAPIENS_LAYOUT: VirtualKeyboardLayout = {
	label: '123',
	tooltip: 'Tastiera di Sapiens',
	rows: [
		['[7]', '[8]', '[9]', '[/]', { insert: '\\frac{#@}{#?}', latex: '\\frac{a}{b}', tooltip: 'Frazione' }, { insert: '#@^{#?}', latex: 'x^n', tooltip: 'Potenza' }, { insert: '#@_{#?}', latex: 'x_n', tooltip: 'Pedice' }, 'x', 'y'],
		['[4]', '[5]', '[6]', '[*]', { insert: '\\sqrt{#0}', latex: '\\sqrt{x}', tooltip: 'Radice quadrata' }, { insert: '\\sqrt[#?]{#0}', latex: '\\sqrt[n]{x}', tooltip: 'Radice' }, { latex: '\\pi', tooltip: 'Pi greco' }, 'a', 'b'],
		['[1]', '[2]', '[3]', '[-]', '[(]', '[)]', { latex: '\\pm', tooltip: 'Più o meno' }, { latex: '=', tooltip: 'Uguale' }, { latex: '\\neq', tooltip: 'Diverso' }],
		['[0]', '[,]', ';', '[+]', { insert: '\\left|#0\\right|', latex: '|x|', tooltip: 'Valore assoluto' }, { latex: '\\emptyset', tooltip: 'Insieme vuoto' }, { latex: '\\mathbb{R}', tooltip: 'Numeri reali' }, { latex: '\\lor', tooltip: 'Oppure' }, '[backspace]'],
		['[left]', '[right]', { insert: '\\text{impossibile}', label: 'impossibile', class: 'small', tooltip: 'Nessuna soluzione', width: 2 }, { insert: '\\text{indeterminata}', label: 'indeterminata', class: 'small', tooltip: 'Tutti i numeri reali', width: 2 }, '[return]']
	]
};

let loaded: Promise<typeof MathfieldElement> | null = null;
/** MathLive, once per page, set up for Italian: the decimal comma, no sounds, the page's fonts. */
function loadMathLive(): Promise<typeof MathfieldElement> {
	loaded ??= import('mathlive').then(({ MathfieldElement }) => {
		MathfieldElement.decimalSeparator = ',';
		MathfieldElement.fontsDirectory = null;
		MathfieldElement.soundsDirectory = null;
		window.mathVirtualKeyboard.layouts = [SAPIENS_LAYOUT, 'alphabetic'];
		window.mathVirtualKeyboard.editToolbar = 'none';
		return MathfieldElement;
	});
	return loaded;
}

const FIELD_CLASS: Record<OpenState, string> = {
	idle: 'border-edge-strong bg-surface shadow-paper focus-within:border-inverse',
	pending: 'border-inverse bg-surface-2',
	correct: 'border-ok bg-ok-soft',
	incorrect: 'animate-nudge border-danger bg-danger-soft'
};

interface Props {
	state: OpenState;
	/** Called with the LaTeX of the answer; not while it is empty. */
	onSubmit: (latex: string) => void;
	/** The answer is on its way or answered: the field stays as it was, and the button does nothing. */
	locked: boolean;
}

export function OpenAnswer({ state, onSubmit, locked }: Props) {
	const host = useRef<HTMLDivElement>(null);
	const field = useRef<MathfieldElement | null>(null);
	const [keyboard, setKeyboard] = useState<KeyboardChoice | null>(null);
	const [failed, setFailed] = useState(false);
	// The handlers read the latest props through a ref: the field is made once.
	const latest = useRef({ onSubmit, locked });
	useEffect(() => {
		latest.current = { onSubmit, locked };
	});

	// Always enabled: MathLive's production build does not always report typing with an "input" event, so a
	// button waiting for it could stay off. An empty answer takes the student back to the field instead.
	const submit = () => {
		const mf = field.current;
		const value = mf?.value.trim() ?? '';
		if (!mf || latest.current.locked) return;
		if (!value) return mf.focus();
		window.mathVirtualKeyboard?.hide();
		latest.current.onSubmit(value);
	};

	useEffect(() => {
		let cancelled = false;
		loadMathLive()
			.then((MathfieldElement) => {
				if (cancelled || !host.current) return;
				const choice = readKeyboard();
				setKeyboard(choice);
				const mf = new MathfieldElement();
				mf.setAttribute('aria-label', 'La tua risposta');
				mf.className = 'block w-full min-h-[56px] bg-transparent px-4 py-3 text-xl text-fg-strong outline-none sm:text-2xl';
				// some settings exist only once the field is in the page
				host.current.replaceChildren(mf);
				mf.mathVirtualKeyboardPolicy = choice === 'sapiens' ? 'auto' : 'manual';
				mf.menuItems = [];
				mf.smartFence = true;
				// Enter, from the device's keyboard or the return key on screen, gives the answer.
				mf.addEventListener('keydown', (e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						submit();
					}
				});
				mf.addEventListener('beforeinput', (e) => {
					if ((e as InputEvent).inputType === 'insertLineBreak') {
						e.preventDefault();
						submit();
					}
				});
				field.current = mf;
				// on a phone the keyboard would cover the question: the student taps the field when ready
				if (!window.matchMedia('(pointer: coarse)').matches) mf.focus();
			})
			.catch((err) => {
				console.error('MathLive:', err);
				if (!cancelled) setFailed(true);
			});
		return () => {
			cancelled = true;
			window.mathVirtualKeyboard?.hide();
		};
		// Made once per question: the parent gives each question its own key.
	}, []);

	// The keyboard on screen covers the bottom of the page: the page makes room for it and the field comes into view.
	useEffect(() => {
		const kb = typeof window === 'undefined' ? null : window.mathVirtualKeyboard;
		if (!kb) return;
		const onGeometry = () => {
			const height = kb.visible ? kb.boundingRect.height : 0;
			if (height) document.documentElement.style.setProperty('--math-keyboard', `${height}px`);
			else document.documentElement.style.removeProperty('--math-keyboard');
			if (height) requestAnimationFrame(() => host.current?.scrollIntoView({ block: 'end', behavior: 'smooth' }));
		};
		kb.addEventListener('geometrychange', onGeometry);
		return () => {
			kb.removeEventListener('geometrychange', onGeometry);
			document.documentElement.style.removeProperty('--math-keyboard');
		};
	}, []);

	// Answered: the field keeps what was written and takes no more input.
	useEffect(() => {
		if (field.current) field.current.readOnly = locked;
	}, [locked]);

	const switchKeyboard = () => {
		const next: KeyboardChoice = keyboard === 'sapiens' ? 'device' : 'sapiens';
		setKeyboard(next);
		saveKeyboard(next);
		const mf = field.current;
		if (!mf) return;
		mf.mathVirtualKeyboardPolicy = next === 'sapiens' ? 'auto' : 'manual';
		mf.focus();
		if (next === 'sapiens') window.mathVirtualKeyboard.show();
		else window.mathVirtualKeyboard.hide();
	};

	if (failed) {
		return (
			<p role="alert" className="text-center text-sm text-danger-fg">
				Il campo per scrivere la risposta non si è caricato. Ricarica la pagina.
			</p>
		);
	}

	return (
		<div className="flex w-full flex-col gap-3">
			<div className={cn('flex min-h-[64px] w-full items-center rounded-xl border transition-[background-color,border-color] duration-200', FIELD_CLASS[state])}>
				<div ref={host} className="min-w-0 flex-1">
					<span className="block px-4 py-3 text-fg-faint">Carico il campo…</span>
				</div>
				{keyboard && !locked && (
					<button
						type="button"
						onClick={switchKeyboard}
						aria-pressed={keyboard === 'sapiens'}
						aria-label={keyboard === 'sapiens' ? 'Usa la tastiera del dispositivo' : 'Usa la tastiera di Sapiens'}
						title={keyboard === 'sapiens' ? 'Tastiera del dispositivo' : 'Tastiera di Sapiens'}
						className={cn('mr-2 flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors focus-ring', keyboard === 'sapiens' ? 'bg-surface-3 text-fg-strong' : 'text-fg-subtle hover:bg-surface-3')}
					>
						<Keyboard className="size-5" aria-hidden="true" />
					</button>
				)}
			</div>
			{!locked && (
				<button
					type="button"
					onClick={submit}
					className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-inverse px-6 py-4 font-semibold text-inverse-fg shadow-key transition-[transform,opacity] duration-150 hover:opacity-90 active:translate-y-px disabled:opacity-40 focus-ring-offset"
				>
					Conferma
					<ArrowRight className="size-5" aria-hidden="true" />
				</button>
			)}
		</div>
	);
}
