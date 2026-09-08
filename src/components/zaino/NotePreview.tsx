'use client';

import { useEffect, useMemo, useState } from 'react';
import type katexType from 'katex';
import { hasMath, renderNoteMarkdown } from '@/lib/content/note-markdown';
import 'katex/dist/katex.min.css';

type Katex = typeof katexType;

let katexPromise: Promise<Katex> | null = null;
/** Loaded once, the first time a note with a formula is previewed. */
const loadKatex = () => (katexPromise ??= import('katex').then((m) => m.default));

/** The note as the reader sees it. Rendered in the browser: a round trip per keystroke is worse. */
export function NotePreview({ markdown }: { markdown: string }) {
	const [katex, setKatex] = useState<Katex | null>(null);
	const needsMath = hasMath(markdown);
	useEffect(() => {
		if (needsMath && !katex) loadKatex().then(setKatex);
	}, [needsMath, katex]);
	const html = useMemo(() => renderNoteMarkdown(markdown, katex), [markdown, katex]);
	if (!markdown.trim()) return <p className="py-6 text-sm text-fg-faint">Niente da mostrare: la nota è vuota.</p>;
	return <div className="markdown-content note-body py-6" dangerouslySetInnerHTML={{ __html: html }} />;
}
