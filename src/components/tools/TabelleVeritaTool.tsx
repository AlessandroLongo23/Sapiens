'use client';

import { useMemo, useRef } from 'react';
import { tabellaVerita } from '@/lib/tools/tabelle-verita';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { p: '((p → q) ∧ ¬q) → ¬p' };

const EXAMPLES = ['(p ∨ q) ∧ ¬p', 'p ∨ ¬p', '(p ∧ q) ∨ ¬r', '¬(p ∧ q) ↔ (¬p ∨ ¬q)'];

/** The connectives, as buttons: they are hard to type on a phone. */
const SYMBOLS = [
	{ symbol: '¬', name: 'non' },
	{ symbol: '∧', name: 'e' },
	{ symbol: '∨', name: 'o' },
	{ symbol: '→', name: 'implica' },
	{ symbol: '↔', name: 'se e solo se' },
	{ symbol: '⊻', name: 'o esclusivo' },
	{ symbol: '(', name: 'parentesi aperta' },
	{ symbol: ')', name: 'parentesi chiusa' }
];

export function TabelleVeritaTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(() => tabellaVerita(state.p), [state.p]);
	const input = useRef<HTMLInputElement>(null);

	/** Puts a symbol where the cursor is, with spaces around a binary connective. */
	function insert(symbol: string) {
		const el = input.current;
		const start = el?.selectionStart ?? state.p.length;
		const end = el?.selectionEnd ?? state.p.length;
		const text = '∧∨→↔⊻'.includes(symbol) ? ` ${symbol} ` : symbol;
		const next = state.p.slice(0, start) + text + state.p.slice(end);
		set({ p: next });
		requestAnimationFrame(() => {
			el?.focus();
			el?.setSelectionRange(start + text.length, start + text.length);
		});
	}

	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToolField label="Proposizione" hint="Lettere come p, q, r (al massimo 5) e i connettivi. Dalla tastiera: ! per non, & per e, | per o, -> e <->.">
						<input ref={input} className={toolInputClass} autoComplete="off" autoCapitalize="off" spellCheck={false} value={state.p} onChange={(e) => set({ p: e.target.value })} />
					</ToolField>
					<div role="group" aria-label="Connettivi" className="flex flex-wrap gap-1.5">
						{SYMBOLS.map((s) => (
							<button
								key={s.symbol}
								type="button"
								aria-label={s.name}
								title={s.name}
								onClick={() => insert(s.symbol)}
								className="min-h-[40px] min-w-[44px] rounded-lg border border-edge bg-surface px-2 font-mono text-lg text-fg-strong shadow-paper transition-colors hover:border-edge-strong focus-ring"
							>
								{s.symbol}
							</button>
						))}
					</div>
					<Examples items={EXAMPLES.map((p) => ({ label: p, apply: () => set({ p }) }))} />
				</>
			}
		/>
	);
}
