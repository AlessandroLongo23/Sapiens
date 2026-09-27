'use client';

import { useMemo } from 'react';
import { CODE_BASES, ascii, type CodeBase } from '@/lib/tools/ascii';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Examples, ModeSwitch, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { modo: 'testo', t: 'Ciao!', c: '83 97 112 105 101 110 115', base: 'dec' };

type Mode = 'testo' | 'codici';

const MODES: { value: Mode; label: string }[] = [
	{ value: 'testo', label: 'Da testo a codici' },
	{ value: 'codici', label: 'Da codici a testo' }
];

const TEXT_EXAMPLES = ['A', 'Sapiens', 'x + 1 = 2', 'perché'];
const CODE_EXAMPLES: { label: string; c: string; base: CodeBase }[] = [
	{ label: '72 105', c: '72 105', base: 'dec' },
	{ label: '01001111 01001011', c: '01001111 01001011', base: 'bin' },
	{ label: '53 4F 53', c: '53 4F 53', base: 'hex' }
];

export function AsciiTool() {
	const [state, set] = useToolState(DEFAULTS);
	const mode: Mode = state.modo === 'codici' ? 'codici' : 'testo';
	const base = (CODE_BASES.find((b) => b.value === state.base)?.value ?? 'dec') as CodeBase;
	const outcome = useMemo(() => ascii(mode === 'codici' ? state.c : state.t, mode, base), [mode, state.c, state.t, base]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ModeSwitch label="Che cosa vuoi convertire" options={MODES} value={mode} onChange={(m) => set({ modo: m })} />
					{mode === 'testo' ? (
						<ToolField label="Testo" hint="Una parola o una frase, fino a 40 caratteri.">
							<input className={toolInputClass} autoComplete="off" spellCheck={false} value={state.t} onChange={(e) => set({ t: e.target.value })} />
						</ToolField>
					) : (
						<>
							<ToggleGroup label="Base dei codici" options={CODE_BASES} value={base} onChange={(b) => set({ base: b })} />
							<ToolField label="Codici" hint="Separati da uno spazio. I codici ASCII vanno da 0 a 127.">
								<input
									className={toolInputClass}
									inputMode={base === 'hex' ? 'text' : 'numeric'}
									autoComplete="off"
									spellCheck={false}
									value={state.c}
									onChange={(e) => set({ c: e.target.value })}
								/>
							</ToolField>
						</>
					)}
					{mode === 'testo' ? (
						<Examples items={TEXT_EXAMPLES.map((t) => ({ label: t, apply: () => set({ t }) }))} />
					) : (
						<Examples items={CODE_EXAMPLES.map(({ label, ...e }) => ({ label, apply: () => set(e) }))} />
					)}
				</>
			}
		/>
	);
}
