'use client';

import { useRef, useState } from 'react';
import { Bold, Braces, Code, Eye, Heading1, Heading2, Heading3, Italic, List, ListOrdered, PenLine, Quote, Sigma } from 'lucide-react';
import { applyEdit, continueList, indent, toggleLinePrefix, toggleWrap, type Edit } from '@/lib/zaino/textarea';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { EditorToolbar, type ToolbarAction } from './EditorToolbar';
import { NotePreview } from './NotePreview';

/**
 * The Obsidian-like mode: the markdown source, exactly as it is stored. A
 * plain textarea on purpose — it inherits the phone's own text engine
 * (selection handles, autocorrect, dictation, swipe typing), which a
 * contenteditable editor has to reimplement and gets wrong on iOS. It is also
 * the safety valve: whatever the WYSIWYG serializer does to a document, this
 * is where the student can see it and put it right.
 */
export function AdvancedEditor({ value, onChange }: { value: string; onChange: (markdown: string) => void }) {
	const area = useRef<HTMLTextAreaElement>(null);
	const [pane, setPane] = useState<'write' | 'preview'>('write');

	const edit = (make: (text: string, start: number, end: number) => Edit | null) => {
		const el = area.current;
		if (!el) return;
		const next = make(el.value, el.selectionStart, el.selectionEnd);
		if (!next) return;
		applyEdit(el, next);
		onChange(next.text);
	};

	const wrap = (pair: string) => edit((t, s, e) => toggleWrap(t, s, e, pair));
	const prefix = (p: string) => edit((t, s, e) => toggleLinePrefix(t, s, e, p));

	const actions: ToolbarAction[] = [
		{ id: 'bold', label: 'Grassetto', icon: Bold, shortcut: 'Control+B', run: () => wrap('**') },
		{ id: 'italic', label: 'Corsivo', icon: Italic, shortcut: 'Control+I', run: () => wrap('*') },
		{ id: 'ul', label: 'Elenco puntato', icon: List, startsGroup: true, run: () => prefix('- ') },
		{ id: 'ol', label: 'Elenco numerato', icon: ListOrdered, run: () => prefix('1. ') },
		{ id: 'h1', label: 'Titolo', icon: Heading1, startsGroup: true, run: () => prefix('# ') },
		{ id: 'h2', label: 'Sottotitolo', icon: Heading2, run: () => prefix('## ') },
		{ id: 'h3', label: 'Paragrafo', icon: Heading3, run: () => prefix('### ') },
		{ id: 'quote', label: 'Citazione', icon: Quote, startsGroup: true, run: () => prefix('> ') },
		{ id: 'code', label: 'Codice', icon: Code, run: () => wrap('`') },
		{ id: 'fence', label: 'Blocco di codice', icon: Braces, run: () => wrap('\n```\n') },
		{ id: 'math', label: 'Formula', icon: Sigma, startsGroup: true, run: () => wrap('$') }
	];

	const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		const mod = e.metaKey || e.ctrlKey;
		if (mod && e.key.toLowerCase() === 'b') {
			e.preventDefault();
			return wrap('**');
		}
		if (mod && e.key.toLowerCase() === 'i') {
			e.preventDefault();
			return wrap('*');
		}
		if (e.key === 'Enter' && !mod) {
			const el = e.currentTarget;
			const next = continueList(el.value, el.selectionStart, el.selectionEnd);
			if (!next) return;
			e.preventDefault();
			applyEdit(el, next);
			onChange(next.text);
			return;
		}
		if (e.key === 'Tab') {
			const el = e.currentTarget;
			const next = indent(el.value, el.selectionStart, el.selectionEnd, e.shiftKey);
			// No list and no multi-line selection: Tab moves the focus, or the
			// textarea becomes a keyboard trap.
			if (!next) return;
			e.preventDefault();
			applyEdit(el, next);
			onChange(next.text);
		}
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<EditorToolbar actions={actions} />

			{/* Below lg the preview replaces the text; from lg up the two sit side by side. */}
			<div className="shrink-0 border-b border-edge-soft px-4 py-2 lg:hidden">
				<ToggleGroup
					label="Scrittura o anteprima"
					value={pane}
					onChange={setPane}
					options={[
						{ value: 'write', label: 'Scrivi', icon: PenLine },
						{ value: 'preview', label: 'Anteprima', icon: Eye }
					]}
				/>
			</div>

			<div className="flex min-h-0 flex-1 lg:divide-x lg:divide-edge">
				<div className={`min-h-0 flex-1 overflow-y-auto ${pane === 'preview' ? 'hidden lg:block' : ''}`}>
					<label htmlFor="note-source" className="sr-only">
						Testo della nota in markdown. Scrivi ### per un titolo, - per un elenco, $ attorno a una formula. Tab rientra dentro un elenco.
					</label>
					<textarea
						id="note-source"
						ref={area}
						value={value}
						onChange={(e) => onChange(e.target.value)}
						onKeyDown={onKeyDown}
						spellCheck
						className="mx-auto block h-full min-h-[55vh] w-full max-w-3xl resize-none border-0 bg-transparent px-4 pb-24 pt-6 font-mono text-base leading-relaxed text-fg caret-crimson-500 outline-none ring-0 placeholder:text-fg-faint focus:ring-0 lg:pb-10"
						placeholder="# Titolo della nota&#10;&#10;Scrivi qui. Usa ## per i sottotitoli, - per un elenco e $x^2$ per una formula."
					/>
				</div>
				<div className={`min-h-0 flex-1 overflow-y-auto ${pane === 'write' ? 'hidden lg:block' : ''}`}>
					<div className="mx-auto max-w-3xl px-4 pb-24 lg:pb-10">
						<NotePreview markdown={value} />
					</div>
				</div>
			</div>
		</div>
	);
}
