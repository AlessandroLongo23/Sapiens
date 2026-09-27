'use client';

import { useMemo } from 'react';
import { binomiale, type BinomialMode } from '@/lib/tools/binomiale';
import { Examples, ModeSwitch, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

/** A die thrown 10 times: at least two sixes, through the complementary event. */
const DEFAULTS = { modo: 'minimo', n: '10', p: '1/6', k: '2' };

const MODES: { value: BinomialMode; label: string }[] = [
	{ value: 'uguale', label: 'Esattamente k' },
	{ value: 'massimo', label: 'Al massimo k' },
	{ value: 'minimo', label: 'Almeno k' }
];

const EXAMPLES: { label: string; patch: Partial<typeof DEFAULTS> }[] = [
	{ label: 'dado: 3 sei su 10', patch: { modo: 'uguale', n: '10', p: '1/6', k: '3' } },
	{ label: 'moneta: almeno 1 testa su 5', patch: { modo: 'minimo', n: '5', p: '1/2', k: '1' } },
	{ label: '30%: al massimo 2 su 8', patch: { modo: 'massimo', n: '8', p: '30%', k: '2' } }
];

const isMode = (m: string): m is BinomialMode => MODES.some((x) => x.value === m);

export function BinomialeTool() {
	const [state, set] = useToolState(DEFAULTS);
	const mode = isMode(state.modo) ? state.modo : 'uguale';
	const outcome = useMemo(() => binomiale(mode, state.n, state.p, state.k), [mode, state.n, state.p, state.k]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ModeSwitch label="Quanti successi" options={MODES} value={mode} onChange={(m) => set({ modo: m })} />
					<div className="grid grid-cols-3 gap-3">
						<ToolField label="Prove (n)">
							<input className={toolInputClass} inputMode="numeric" autoComplete="off" value={state.n} onChange={(e) => set({ n: e.target.value })} />
						</ToolField>
						<ToolField label="Probabilità (p)">
							<input className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={state.p} onChange={(e) => set({ p: e.target.value })} />
						</ToolField>
						<ToolField label="Successi (k)">
							<input className={toolInputClass} inputMode="numeric" autoComplete="off" value={state.k} onChange={(e) => set({ k: e.target.value })} />
						</ToolField>
					</div>
					<p className="text-xs text-fg-subtle">La probabilità di successo in una prova: una frazione come 1/6, un decimale come 0,3 o una percentuale come 30%.</p>
					<Examples items={EXAMPLES.map((x) => ({ label: x.label, apply: () => set(x.patch) }))} />
				</>
			}
		/>
	);
}
