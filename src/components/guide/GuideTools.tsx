'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { NotePreview } from '@/components/zaino/NotePreview';
import { cn } from '@/lib/utils/cn';

/** Copies an example, to paste it into a note. */
export function CopyButton({ text, className }: { text: string; className?: string }) {
	const [copied, setCopied] = useState(false);
	return (
		<button
			type="button"
			onClick={async () => {
				try {
					await navigator.clipboard.writeText(text);
					setCopied(true);
					setTimeout(() => setCopied(false), 1500);
				} catch {
					// No clipboard (an old browser, or permission refused): the text can still be selected by hand.
				}
			}}
			aria-label={copied ? 'Copiato' : `Copia ${text}`}
			title={copied ? 'Copiato' : 'Copia'}
			className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg text-fg-subtle transition-colors hover:bg-surface-3 hover:text-fg focus-ring', className)}
		>
			{copied ? <Check className="size-4 text-ok-fg" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
		</button>
	);
}

const START = `## Prova qui

La formula dell'area del cerchio è $A = \\pi r^2$.

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

- cambia il testo a sinistra
- l'anteprima si aggiorna mentre scrivi`;

/**
 * A scrap of note to try things on: Markdown and formulas on the left, drawn
 * on the right by the same renderer as the notes, so what works here works
 * in a note.
 */
export function Playground() {
	const [text, setText] = useState(START);
	return (
		<div className="grid overflow-hidden rounded-2xl border border-edge bg-surface md:grid-cols-2">
			<div className="flex flex-col border-b border-edge md:border-b-0 md:border-r">
				<label htmlFor="guide-playground" className="label-mono border-b border-edge-soft px-4 py-2 text-[11px] text-fg-subtle">
					Scrivi
				</label>
				<textarea
					id="guide-playground"
					value={text}
					onChange={(e) => setText(e.target.value)}
					spellCheck={false}
					rows={11}
					className="min-h-64 flex-1 resize-y bg-transparent px-4 py-3 font-mono text-sm leading-6 text-fg outline-none focus-visible:bg-surface-2"
				/>
			</div>
			<div className="flex min-w-0 flex-col">
				<p className="label-mono border-b border-edge-soft px-4 py-2 text-[11px] text-fg-subtle" aria-hidden="true">
					Risultato
				</p>
				<div className="min-w-0 overflow-x-auto px-4 [--row:1.5rem]" aria-label="Risultato">
					<NotePreview markdown={text} />
				</div>
			</div>
		</div>
	);
}
