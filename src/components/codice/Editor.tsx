'use client';

import { useEffect, useRef } from 'react';
import { reindent, useEditorSettings, type EditorSettings } from './settings';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { cpp } from '@codemirror/lang-cpp';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { bracketMatching, indentOnInput, indentUnit } from '@codemirror/language';
import { Compartment, EditorState, type Extension } from '@codemirror/state';
import { EditorView, drawSelection, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from '@codemirror/view';
import { showMinimap } from '@replit/codemirror-minimap';
import type { FileKind } from '@/lib/codice/progetto';
import type { Language } from './runtime';

/** What the editor colours: a language of the programs, or the kind of a file of a project. */
export type Syntax = Language | Exclude<FileKind, 'image'>;

const SYNTAX: Record<Syntax, () => Extension> = { python, c: cpp, cpp, header: cpp, javascript: () => javascript(), json: () => javascript(), html: () => html(), css, markdown: () => [], text: () => [] };
import { editorLook, textSize, themeColors } from './theme';

/** The narrowest window the minimap is shown in. */
const MINIMAP_FROM = '(min-width: 640px)';

/** What the student's settings (settings.ts) make of the editor; `minimap` says whether this editor may have one. */
function tuned(settings: EditorSettings, minimap: boolean): Extension {
	return [
		themeColors(settings.theme),
		textSize(settings.size),
		indentUnit.of(' '.repeat(settings.tab)),
		EditorState.tabSize.of(settings.tab),
		settings.numbers ? [lineNumbers(), highlightActiveLineGutter()] : [],
		settings.wrap ? EditorView.lineWrapping : [],
		settings.pairs ? closeBrackets() : [],
		minimap && settings.minimap && window.matchMedia(MINIMAP_FROM).matches ? showMinimap.of({ create: () => ({ dom: document.createElement('div') }), displayText: 'blocks', showOverlay: 'always' }) : []
	];
}

/**
 * The code editor: CodeMirror for a program or a file of a web page (Tab indents, Esc then Tab leaves the field).
 * The colours, the size of the text, the width of an indentation and the rest of settings.ts are the student's, and
 * an editor already open takes a change at once, the indentation of its lines included. With `minimap` the whole program is drawn small along the right
 * edge, as in VS Code, where there is room for it (not on a phone) and unless the student turned it off. It keeps
 * its own text: `initial` is read once, so a different program means a new `key`. Mod-Enter runs.
 */
export default function Editor({
	initial,
	language,
	label,
	minimap = false,
	onChange,
	onRun
}: {
	initial: string;
	language: Syntax;
	label: string;
	minimap?: boolean;
	onChange: (code: string) => void;
	onRun: () => void;
}) {
	const host = useRef<HTMLDivElement>(null);
	const settings = useEditorSettings();
	const view = useRef<EditorView | null>(null);
	const tuning = useRef(new Compartment());
	const made = useRef(settings);
	const handlers = useRef({ onChange, onRun });
	useEffect(() => {
		handlers.current = { onChange, onRun };
	});

	useEffect(() => {
		const editor = new EditorView({
			parent: host.current!,
			state: EditorState.create({
				// the program is shown with the student's width of indentation, whatever it was written with
				doc: reindent(initial, made.current.tab),
				extensions: [
					keymap.of([
						{
							key: 'Mod-Enter',
							run: () => {
								handlers.current.onRun();
								return true;
							}
						},
						...closeBracketsKeymap,
						...defaultKeymap,
						...historyKeymap,
						indentWithTab
					]),
					history(),
					drawSelection(),
					indentOnInput(),
					bracketMatching(),
					highlightActiveLine(),
					SYNTAX[language](),
					editorLook,
					tuning.current.of(tuned(made.current, minimap)),
					EditorView.contentAttributes.of({ 'aria-label': label, autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false' }),
					EditorView.updateListener.of((update) => {
						if (update.docChanged) handlers.current.onChange(update.state.doc.toString());
					})
				]
			})
		});
		view.current = editor;
		return () => {
			view.current = null;
			editor.destroy();
		};
		// `initial`, `language`, `label` and `minimap` are read when the editor is made
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// a setting changed: the editor that is open takes it, with its text and its history
	useEffect(() => {
		const editor = view.current;
		const before = made.current;
		made.current = settings;
		if (!editor) return;
		editor.dispatch({ effects: tuning.current.reconfigure(tuned(settings, minimap)) });
		// a new width of indentation is given to the lines already written, each change in its place so the cursor stays
		if (before.tab !== settings.tab) {
			const text = editor.state.doc.toString();
			const next = reindent(text, settings.tab);
			if (next !== text) {
				const was = text.split('\n');
				const now = next.split('\n');
				const changes = [];
				let at = 0;
				for (let i = 0; i < was.length; i++) {
					const from = was[i].length - was[i].trimStart().length;
					const to = now[i].length - now[i].trimStart().length;
					if (from !== to) changes.push({ from: at, to: at + from, insert: ' '.repeat(to) });
					at += was[i].length + 1;
				}
				editor.dispatch({ changes });
			}
		}
	}, [settings, minimap]);

	return <div ref={host} className="h-full min-h-0 overflow-auto" />;
}
