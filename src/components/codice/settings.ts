import { useSyncExternalStore } from 'react';

/**
 * How the code editor looks and behaves, chosen by the student and kept on the device: every editor of the site
 * reads it, the tool's and the lessons'. The view that changes it is SettingsPanel.tsx.
 */

export const THEMES = { modern: 'Modern', github: 'GitHub', one: 'One', solarized: 'Solarized' } as const;
export type ThemeId = keyof typeof THEMES;
/** The size of the code's text, in pixels: a whole number between these two. */
export const SIZE_MIN = 10;
export const SIZE_MAX = 28;
export const TABS = [2, 4, 8] as const;

export interface EditorSettings {
	theme: ThemeId;
	size: number;
	/** How many spaces an indentation is, and how wide a tab character is drawn. */
	tab: (typeof TABS)[number];
	minimap: boolean;
	/** Long lines go on to the next line and do not scroll sideways. */
	wrap: boolean;
	numbers: boolean;
	/** Typing an open bracket or quote writes the closing one too. */
	pairs: boolean;
	/** The share of the width the code takes beside its output, from 0 to 1. */
	split: number;
	/** In a project: the share of the width the list of files takes, and the share of the height the output takes under the code. */
	explorer: number;
	output: number;
}

/**
 * A program with its indentation made `to` spaces wide. The width it has is read from the text itself: the largest
 * number of spaces that every indented line is a multiple of. A text indented with tabs, or by one space, or not at
 * all, is left as it is.
 */
export function reindent(text: string, to: number): string {
	const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
	let unit = 0;
	for (const line of text.split('\n')) {
		const spaces = /^ +(?=\S)/.exec(line)?.[0].length ?? 0;
		if (spaces) unit = gcd(spaces, unit);
	}
	if (unit < 2 || unit === to) return text;
	return text.replace(/^ +(?=\S)/gm, (spaces) => ' '.repeat((spaces.length / unit) * to));
}

export const DEFAULTS: EditorSettings = { theme: 'modern', size: 15, tab: 4, minimap: true, wrap: false, numbers: true, pairs: true, split: 0.5, explorer: 0.2, output: 0.34 };
/** The code and its output each keep at least this share of the width. */
export const SPLIT_MIN = 0.25;
export const SPLIT_MAX = 0.75;
export const EXPLORER_MIN = 0.12;
export const EXPLORER_MAX = 0.4;
export const OUTPUT_MIN = 0.12;
export const OUTPUT_MAX = 0.75;

const KEY = 'sapiens:editor';
const EVENT = 'sapiens:editor';

/** What was stored, read back: anything that is not a value of today's settings is the default. */
function read(): EditorSettings {
	let stored: Partial<Record<keyof EditorSettings, unknown>> = {};
	try {
		const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? '{}');
		if (parsed && typeof parsed === 'object') stored = parsed;
	} catch {
		// nothing stored, or storage is off
	}
	const flag = (name: 'minimap' | 'wrap' | 'numbers' | 'pairs') => (typeof stored[name] === 'boolean' ? stored[name] : DEFAULTS[name]);
	const share = (name: 'split' | 'explorer' | 'output', min: number, max: number) => {
		const value = stored[name];
		return typeof value === 'number' && value >= min && value <= max ? value : DEFAULTS[name];
	};
	return {
		theme: typeof stored.theme === 'string' && Object.hasOwn(THEMES, stored.theme) ? (stored.theme as ThemeId) : DEFAULTS.theme,
		size: typeof stored.size === 'number' && Number.isInteger(stored.size) && stored.size >= SIZE_MIN && stored.size <= SIZE_MAX ? stored.size : DEFAULTS.size,
		tab: TABS.find((n) => n === stored.tab) ?? DEFAULTS.tab,
		minimap: flag('minimap'),
		wrap: flag('wrap'),
		numbers: flag('numbers'),
		pairs: flag('pairs'),
		split: share('split', SPLIT_MIN, SPLIT_MAX),
		explorer: share('explorer', EXPLORER_MIN, EXPLORER_MAX),
		output: share('output', OUTPUT_MIN, OUTPUT_MAX)
	};
}

/** One object until something changes: useSyncExternalStore compares what it is given. */
let current: EditorSettings | null = null;
const snapshot = () => (current ??= read());

function subscribe(notify: () => void) {
	const changed = () => {
		current = null;
		notify();
	};
	window.addEventListener(EVENT, notify);
	// another tab of the site changed them
	window.addEventListener('storage', changed);
	return () => {
		window.removeEventListener(EVENT, notify);
		window.removeEventListener('storage', changed);
	};
}

export function saveSettings(change: Partial<EditorSettings>) {
	current = { ...snapshot(), ...change };
	try {
		localStorage.setItem(KEY, JSON.stringify(current));
	} catch {
		// not remembered, still used on this page
	}
	window.dispatchEvent(new Event(EVENT));
}

export const useEditorSettings = () => useSyncExternalStore(subscribe, snapshot, () => DEFAULTS);
