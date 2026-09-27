'use client';

import { useMemo } from 'react';
import { notazioneScientifica, type ScientificMode } from '@/lib/tools/notazione-scientifica';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { modo: 'a', n: '0,000345', m: '6,02', e: '23' };

const TO_EXAMPLES = ['384 400', '0,00052', '300 000 000', '0,0020'];
const FROM_EXAMPLES = [
	{ m: '1,6', e: '-19' },
	{ m: '3', e: '8' },
	{ m: '4,56', e: '-3' },
	{ m: '25', e: '3' }
];

export function NotazioneScientificaTool() {
	const [state, set] = useToolState(DEFAULTS);
	const mode: ScientificMode = state.modo === 'da' ? 'da' : 'a';
	const outcome = useMemo(() => notazioneScientifica(mode, { n: state.n, m: state.m, e: state.e }), [mode, state.n, state.m, state.e]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToggleGroup
						label="Verso della conversione"
						options={[
							{ value: 'a', label: 'In notazione scientifica' },
							{ value: 'da', label: 'In numero decimale' }
						]}
						value={mode}
						onChange={(v) => set({ modo: v })}
					/>
					{mode === 'a' ? (
						<>
							<ToolField label="Numero" hint="Per i decimali usa la virgola: 0,000345. Gli spazi tra le migliaia vanno bene.">
								<input className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={state.n} onChange={(e) => set({ n: e.target.value })} />
							</ToolField>
							<Examples items={TO_EXAMPLES.map((n) => ({ label: n, apply: () => set({ n }) }))} />
						</>
					) : (
						<>
							<div className="grid grid-cols-[minmax(0,3fr)_auto_minmax(0,2fr)] items-end gap-2">
								<ToolField label="Numero davanti">
									<input className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={state.m} onChange={(e) => set({ m: e.target.value })} />
								</ToolField>
								<span className="pb-3 font-mono text-lg text-fg-muted" aria-hidden="true">
									· 10^
								</span>
								<ToolField label="Esponente">
									<input className={toolInputClass} autoComplete="off" spellCheck={false} value={state.e} onChange={(e) => set({ e: e.target.value })} />
								</ToolField>
							</div>
							<p className="text-xs text-fg-subtle">Per 1,6 · 10^-19 scrivi 1,6 e -19. L’esponente è un numero intero, anche negativo.</p>
							<Examples items={FROM_EXAMPLES.map((x) => ({ label: `${x.m} · 10^${x.e}`, apply: () => set(x) }))} />
						</>
					)}
				</>
			}
		/>
	);
}
