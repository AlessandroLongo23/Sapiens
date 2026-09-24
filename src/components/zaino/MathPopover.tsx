'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type katexType from 'katex';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { useCoarsePointer } from '@/lib/hooks/use-media';
import { escapeHtml } from '@/lib/utils/escape';

type Katex = typeof katexType;

/** Kept out of the component: the React compiler cannot memoize a try/catch. */
function typeset(katex: Katex | null, latex: string, block: boolean): string {
	if (!katex || !latex.trim()) return '';
	try {
		return katex.renderToString(latex, { displayMode: block, throwOnError: false, strict: 'ignore', output: 'html' });
	} catch (err) {
		return `<span class="text-danger-fg">${escapeHtml(err instanceof Error ? err.message : 'Formula non valida')}</span>`;
	}
}

export interface MathTarget {
	latex: string;
	pos: number;
	block: boolean;
}

/**
 * Editing a formula opens a small editor rather than revealing the source in
 * place: showing `\frac{a}{b}` inline would put back exactly the visible syntax
 * that Simple mode exists to hide. On a touch screen it is a Sheet, which
 * already brings the focus trap and keeps clear of the home indicator.
 */
export function MathPopover({
	target,
	katex,
	onSave,
	onDelete,
	onClose
}: {
	target: MathTarget | null;
	katex: Katex | null;
	onSave: (latex: string) => void;
	onDelete: () => void;
	onClose: () => void;
}) {
	const coarse = useCoarsePointer();
	const [latex, setLatex] = useState('');
	const [shown, setShown] = useState<number | null>(null);
	const field = useRef<HTMLTextAreaElement>(null);

	if (target && shown !== target.pos) {
		setShown(target.pos);
		setLatex(target.latex);
	}

	useEffect(() => {
		if (target) field.current?.focus();
	}, [target]);

	const preview = useMemo(() => typeset(katex, latex, target?.block ?? false), [katex, latex, target?.block]);

	/*
	 * A formula is one line far more often than it is several, so Enter does what
	 * the Fine button does and Shift+Enter is the way to a new line — the reverse
	 * of a normal textarea, and the right way round for this one. Escape backs out
	 * of the popover, which the Sheet already does for itself on a touch screen.
	 */
	const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			onSave(latex);
			return;
		}
		if (e.key === 'Escape') {
			e.preventDefault();
			e.stopPropagation();
			onClose();
		}
	};

	const body = (
		<div className="space-y-3">
			<label htmlFor="math-source" className="block text-sm font-medium text-fg-muted">
				Formula in LaTeX
			</label>
			<textarea
				id="math-source"
				ref={field}
				value={latex}
				onChange={(e) => setLatex(e.target.value)}
				onKeyDown={onKeyDown}
				rows={3}
				spellCheck={false}
				aria-describedby="math-help"
				className="w-full resize-y rounded-xl border border-edge bg-surface px-3 py-2 font-mono text-base text-fg outline-none focus:border-crimson-500 focus:ring-2 focus:ring-crimson-500/30"
				placeholder="\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}"
			/>
			<p id="math-help" className="text-xs text-fg-subtle">
				Invio per confermare, Maiusc+Invio per andare a capo.
			</p>
			<div className="min-h-12 rounded-xl border border-edge-soft bg-surface-2 px-3 py-2 text-center" aria-live="polite">
				{preview ? <span dangerouslySetInnerHTML={{ __html: preview }} /> : <span className="text-sm text-fg-faint">Anteprima</span>}
			</div>
			<div className="flex gap-2">
				<Button size="sm" onClick={() => onSave(latex)}>Fine</Button>
				<Button size="sm" variant="ghost" onClick={onClose}>Annulla</Button>
				<Button size="sm" variant="ghost" onClick={onDelete} className="ml-auto text-danger-fg">Elimina</Button>
			</div>
		</div>
	);

	if (!target) return null;
	if (coarse) {
		return (
			<Sheet open onClose={onClose} title="Formula" size="auto">
				{body}
			</Sheet>
		);
	}
	return (
		<div role="dialog" aria-label="Formula" className="fixed bottom-6 left-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-edge bg-surface pt-4 shadow-2xl">
			<div className="px-4 pb-4">
				<p className="pb-2 text-sm font-semibold text-fg-strong">Formula</p>
				{body}
			</div>
		</div>
	);
}
