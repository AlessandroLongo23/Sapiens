import { useCallback, useSyncExternalStore } from 'react';
import type { MathfieldElement, VirtualKeyboardLayout } from 'mathlive';

/**
 * MathLive as Sapiens uses it, for every formula field of the site (the open answers, the plotter): loaded once and
 * only where a field appears, set up for Italian, with Sapiens's keyboards on screen and the choice between them
 * and the device's own keyboard. vault/Decisioni/2026-09-30 La risposta aperta si scrive con MathLive, con la
 * tastiera di Sapiens o quella del dispositivo.md
 */

/** The way to write chosen on this device: 'sapiens' (the keyboard on screen) or 'device'. */
export type KeyboardChoice = 'sapiens' | 'device';
const KEYBOARD_KEY = 'sapiens:keyboard';
const KEYBOARD_EVENT = 'sapiens:keyboard';

export function readKeyboard(): KeyboardChoice {
	try {
		const saved = localStorage.getItem(KEYBOARD_KEY);
		if (saved === 'sapiens' || saved === 'device') return saved;
	} catch {
		// storage blocked: the default for this screen
	}
	return window.matchMedia('(pointer: coarse)').matches ? 'sapiens' : 'device';
}

export function saveKeyboard(choice: KeyboardChoice) {
	try {
		localStorage.setItem(KEYBOARD_KEY, choice);
	} catch {
		// not remembered, still used for this visit
	}
	window.dispatchEvent(new Event(KEYBOARD_EVENT));
}

/** The choice, for a page with several fields: null on the server and until the page is in the browser. */
export function useKeyboardChoice(): [KeyboardChoice | null, (choice: KeyboardChoice) => void] {
	const subscribe = useCallback((notify: () => void) => {
		window.addEventListener(KEYBOARD_EVENT, notify);
		return () => window.removeEventListener(KEYBOARD_EVENT, notify);
	}, []);
	const choice = useSyncExternalStore<KeyboardChoice | null>(subscribe, readKeyboard, () => null);
	return [choice, saveKeyboard];
}

/** The keys a school answer needs, in one layer: digits and operations, fractions, powers and roots, the words of a solution set. */
export const ANSWER_LAYOUT: VirtualKeyboardLayout = {
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

const fn = (name: string, tooltip: string) => ({ insert: `\\${name}\\left(#0\\right)`, latex: `\\${name}`, tooltip, width: 1.5 as const, class: 'small' });
/** A key of the functions' layer, as wide as the names beside it. */
const wide = <T extends object>(key: T) => ({ ...key, width: 1.5 as const });

/**
 * What the plotter writes for the student, with the holes left to fill: a brace, a sum, an integral. Each is reached
 * three ways: its word typed in a formula ("tratti"), the menu of the panel, a key of the keyboard on screen. The
 * words are among those of the plotter's proposals (lib/grafico/comandi.ts), where the same formulas are: a test
 * keeps the two in step.
 *
 * A limit of MathLive shapes them: of two holes above and below a sign the upper one comes first, so the lower
 * bound is written already, with its usual value.
 */
export interface PlotTemplate {
	/** Typed in a formula, it becomes the template. */
	word: string;
	title: string;
	about: string;
	/** MathLive's own notation: #? is a hole. */
	insert: string;
	/** An example, for the menu. */
	preview: string;
}
export const PLOT_TEMPLATES: PlotTemplate[] = [
	{ word: 'tratti', title: 'Funzione a tratti', about: 'Un valore e la sua condizione per riga. Invio aggiunge una riga.', insert: '\\begin{cases}#? & #?\\\\ #? & #?\\end{cases}', preview: '\\begin{cases}x^2 & x<1\\\\ 2-x & x\\ge 1\\end{cases}' },
	{ word: 'sistema', title: 'Sistema di disequazioni', about: 'Una disequazione per riga: si colora dove valgono tutte.', insert: '\\begin{cases}#?\\\\ #?\\end{cases}', preview: '\\begin{cases}y\\le x+2\\\\ y>x^2\\end{cases}' },
	{ word: 'somma', title: 'Somma', about: 'L’indice parte dal numero sotto e arriva a quello sopra.', insert: '\\sum_{n=1}^{#?}#?', preview: '\\sum_{n=1}^{5}x^n' },
	{ word: 'prodotto', title: 'Prodotto', about: 'Come la somma, con i fattori.', insert: '\\prod_{n=1}^{#?}#?', preview: '\\prod_{n=1}^{3}(x-n)' },
	{ word: 'integrale', title: 'Integrale', about: 'Con i due estremi: con la x sopra è una funzione integrale.', insert: '\\int_{0}^{#?}#?\\,dx', preview: '\\int_{0}^{x}t^2\\,dt' },
		{ word: 'successione', title: 'Successione per ricorrenza', about: 'Ogni termine dal precedente. Il valore da cui parte va in un’altra riga: a_0 = 1.', insert: 'a_{n+1}=#?', preview: 'a_{n+1}=2a_n+1' },
	{ word: 'derivata', title: 'Derivata', about: 'Di una formula. Per una funzione con un nome basta l’apice: f′(x).', insert: '\\frac{d}{dx}\\left(#?\\right)', preview: '\\frac{d}{dx}\\left(x^3\\right)' }
];
const template = (word: string) => PLOT_TEMPLATES.find((t) => t.word === word)!;



/** The keys of the plotter: the letters of a formula with digits and operations, and a second layer with the functions. */
export const PLOT_LAYOUTS: VirtualKeyboardLayout[] = [
	{
		label: '123',
		tooltip: 'Numeri e operazioni',
		rows: [
			['x', 'y', '[7]', '[8]', '[9]', '[/]', { insert: '\\frac{#@}{#?}', latex: '\\frac{a}{b}', tooltip: 'Frazione' }, { insert: '#@^{2}', latex: 'x^2', tooltip: 'Quadrato' }, { insert: '#@^{#?}', latex: 'x^n', tooltip: 'Potenza' }],
			['a', 'b', '[4]', '[5]', '[6]', '[*]', { insert: '\\sqrt{#0}', latex: '\\sqrt{x}', tooltip: 'Radice quadrata' }, { insert: '\\sqrt[#?]{#0}', latex: '\\sqrt[n]{x}', tooltip: 'Radice' }, { insert: '\\left|#0\\right|', latex: '|x|', tooltip: 'Valore assoluto' }],
			['c', 't', '[1]', '[2]', '[3]', '[-]', '[(]', '[)]', { latex: '=', tooltip: 'Uguale' }],
			[{ latex: '\\pi', tooltip: 'Pi greco' }, { latex: 'e', tooltip: 'Numero di Nepero' }, '[0]', '[,]', { latex: '<', tooltip: 'Minore' }, '[+]', { latex: '>', tooltip: 'Maggiore' }, { latex: '\\le', tooltip: 'Minore o uguale' }, { latex: '\\ge', tooltip: 'Maggiore o uguale' }],
			['n', { insert: '#@_{#?}', latex: 'a_n', tooltip: 'Pedice: il termine di una successione' }, 'r', { latex: '\\theta', tooltip: 'Theta: l’angolo di una curva polare, r = 2θ' }, { latex: ';', tooltip: 'Separa le due coordinate: (cos t; sin t)' }, '[left]', '[right]', '[backspace]', '[return]']
		]
	},
	{
		label: 'f(x)',
		tooltip: 'Funzioni',
		rows: [
			[fn('sin', 'Seno'), fn('cos', 'Coseno'), fn('tan', 'Tangente'), wide({ insert: 'e^{#0}', latex: 'e^x', tooltip: 'Esponenziale' }), wide({ insert: '#@^{#?}', latex: 'a^x', tooltip: 'Potenza' })],
			[fn('arcsin', 'Arcoseno'), fn('arccos', 'Arcocoseno'), fn('arctan', 'Arcotangente'), fn('ln', 'Logaritmo naturale'), fn('log', 'Logaritmo in base 10')],
			[
				wide({ insert: '\\frac{1}{#0}', latex: '\\frac{1}{x}', tooltip: 'Reciproco' }),
				wide({ insert: '\\log_{#?}\\left(#0\\right)', latex: '\\log_a', tooltip: 'Logaritmo in base a' }),
				wide({ insert: template('somma').insert, latex: '\\sum', tooltip: 'Somma' }),
				wide({ insert: template('integrale').insert, latex: '\\int', tooltip: 'Integrale con i due estremi' }),
				wide({ insert: template('derivata').insert, latex: '\\frac{d}{dx}', tooltip: 'Derivata di una formula' }),
				wide({ insert: template('sistema').insert, label: '{ ≤', tooltip: 'Sistema: una disequazione per riga' })
			],
			[
				'x',
				'[(]',
				'[)]',
				{ insert: template('tratti').insert, label: '{ ⋮', tooltip: 'Funzione a tratti: un valore e la sua condizione per riga' },
				{ insert: '\\left\\lbrace #0\\right\\rbrace', label: '{ }', tooltip: 'Dominio: x² {0 < x < 2}' },
				'[left]',
				'[right]',
				'[backspace]',
				'[return]'
			]
		]
	}
];

/** Function names typed letter by letter become the function: "sen" as the Italian books write it, "tg" for the tangent. */
const NAME_SHORTCUTS: Record<string, string> = {
	sen: '\\sin',
	tg: '\\tan',
	cotg: '\\cot',
	arcsen: '\\arcsin',
	arctg: '\\arctan'
};

let loaded: Promise<typeof MathfieldElement> | null = null;
/** MathLive, once per page, set up for Italian: the decimal comma, no sounds, the page's fonts. */
export function loadMathLive(): Promise<typeof MathfieldElement> {
	loaded ??= import('mathlive').then(({ MathfieldElement }) => {
		MathfieldElement.decimalSeparator = ',';
		MathfieldElement.fontsDirectory = null;
		MathfieldElement.soundsDirectory = null;
		window.mathVirtualKeyboard.layouts = [ANSWER_LAYOUT, 'alphabetic'];
		window.mathVirtualKeyboard.editToolbar = 'none';
		return MathfieldElement;
	});
	return loaded;
}

/**
 * The keyboard on screen is one for the page: a field shows its own keys when it takes the focus. Returns the
 * function that undoes it.
 */
export function layoutsOnFocus(field: MathfieldElement, layouts: VirtualKeyboardLayout[]) {
	const apply = () => {
		window.mathVirtualKeyboard.layouts = [...layouts, 'alphabetic'];
	};
	field.addEventListener('focusin', apply);
	return () => field.removeEventListener('focusin', apply);
}

/** The shortcuts for the Italian function names, added to MathLive's own, with those of the page that holds the field. */
export function addNameShortcuts(field: MathfieldElement, more: Record<string, string> = {}) {
	field.inlineShortcuts = { ...field.inlineShortcuts, ...NAME_SHORTCUTS, ...more };
}

/**
 * Whether the cursor is in a row of a brace (a function in pieces, a system). MathLive has no public question for
 * it: this reads its model, and where a later version moves it the answer is no, which only gives Enter its usual
 * meaning back.
 */
export function inBrace(field: MathfieldElement): boolean {
	return /cases$/.test(modelOf(field)?.parentEnvironment?.environmentName ?? '');
}

/** Whether the cursor is in a row of a brace with nothing written in it, and the brace has other rows: Backspace there takes the row away. */
export function inEmptyBraceRow(field: MathfieldElement): boolean {
	try {
		const model = modelOf(field);
		if (!model || !inBrace(field)) return false;
		const atom = model.at(model.position);
		const array = atom.parent;
		if (!Array.isArray(atom.parentBranch) || !array?.getCell || !(array.rowCount > 1)) return false;
		for (let col = 0; col < array.colCount; col++) if ((array.getCell(atom.parentBranch[0], col) ?? []).some((a) => a.type !== 'first' && a.type !== 'placeholder')) return false;
		return true;
	} catch {
		return false;
	}
}

interface InnerAtom {
	type: string;
	parent?: { getCell?: (row: number, col: number) => InnerAtom[] | undefined; rowCount: number; colCount: number };
	parentBranch?: unknown;
}
interface InnerModel {
	parentEnvironment?: { environmentName?: string };
	position: number;
	at: (offset: number) => InnerAtom;
}
const modelOf = (field: MathfieldElement) => (field as unknown as { _mathfield?: { model?: InnerModel } })._mathfield?.model;

/**
 * What the page's variables cannot reach inside a field. With a dead key waiting for its letter (^ on many
 * keyboards) MathLive paints the text being composed yellow, and under a dark system theme it sets that colour on
 * an inner element: here it is a thin underline in the page's ink, as a text field shows it. Call it once the field
 * is in the page.
 */
export function dressField(field: MathfieldElement) {
	const root = field.shadowRoot;
	if (!root || root.querySelector('style[data-sapiens]')) return;
	const style = document.createElement('style');
	style.dataset.sapiens = '';
	style.textContent = '.ML__composition { background: transparent !important; color: inherit !important; text-decoration: underline var(--fg-subtle) !important; }';
	root.append(style);
}
