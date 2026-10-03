'use client';

import { useEffect, useRef } from 'react';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { bracketMatching, indentOnInput, indentUnit } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { EditorView, drawSelection, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from '@codemirror/view';
import type { Language } from './runtime';
import { vscodeTheme } from './theme';

/**
 * The code editor: CodeMirror with VS Code's colours (theme.ts), for Python, C or C++ (four spaces, Tab indents, Esc then Tab leaves the
 * field). It keeps its own text: `initial` is read once, so a different program means a new `key`. Mod-Enter runs.
 */
export default function Editor({ initial, language, label, onChange, onRun }: { initial: string; language: Language; label: string; onChange: (code: string) => void; onRun: () => void }) {
	const host = useRef<HTMLDivElement>(null);
	const handlers = useRef({ onChange, onRun });
	useEffect(() => {
		handlers.current = { onChange, onRun };
	});

	useEffect(() => {
		const view = new EditorView({
			parent: host.current!,
			state: EditorState.create({
				doc: initial,
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
					lineNumbers(),
					history(),
					drawSelection(),
					indentOnInput(),
					bracketMatching(),
					closeBrackets(),
					highlightActiveLine(),
					highlightActiveLineGutter(),
					language === 'python' ? python() : cpp(),
					indentUnit.of('    '),
					EditorState.tabSize.of(4),
					vscodeTheme,
					EditorView.contentAttributes.of({ 'aria-label': label, autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false' }),
					EditorView.updateListener.of((update) => {
						if (update.docChanged) handlers.current.onChange(update.state.doc.toString());
					})
				]
			})
		});
		return () => view.destroy();
		// `initial`, `language` and `label` are read when the editor is made
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <div ref={host} className="h-full min-h-0 overflow-auto" />;
}
