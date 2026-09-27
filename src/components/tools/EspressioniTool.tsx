'use client';

import { useMemo } from 'react';
import { espressione, expressionPreview, MAX_CHARS } from '@/lib/tools/espressioni';
import { tex } from '@/lib/tools/tex';
import { Html } from '@/components/ui/Html';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { e: '{[(2/3 + 1/6) : 5/4 - 1/3]^2 + 1/2} * 3' };

const EXAMPLES = ['2 + 3 * (4 - 1)^2', '[20 - (3 + 2) * 2] : 5', '1/2 + 2/3 - 0,5', '(-2)^3 - 2^2 : (-4)'];

export function EspressioniTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(() => espressione(state.e), [state.e]);
	const preview = useMemo(() => {
		const latex = expressionPreview(state.e);
		return latex === null ? null : tex(latex, true);
	}, [state.e]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToolField label="Espressione" hint="Frazioni come 3/4, decimali con la virgola, * o x per moltiplicare, : o / per dividere, ^ per le potenze, parentesi ( ) [ ] { }.">
						<input className={toolInputClass} autoComplete="off" autoCapitalize="off" spellCheck={false} maxLength={MAX_CHARS} value={state.e} onChange={(e) => set({ e: e.target.value })} />
					</ToolField>
					<div aria-live="polite" className="min-h-[4rem] overflow-x-auto rounded-xl border border-dashed border-edge bg-surface-2 px-3 py-1">
						{preview ? (
							<Html html={preview} className="math-content text-fg-strong" aria-label="Come è stata letta l'espressione" />
						) : (
							<p className="py-4 text-center text-sm text-fg-faint">Qui vedi l&apos;espressione come l&apos;ha letta il calcolatore.</p>
						)}
					</div>
					<Examples items={EXAMPLES.map((e) => ({ label: e, apply: () => set({ e }) }))} />
				</>
			}
		/>
	);
}
