'use client';

import { useMemo } from 'react';
import { MAX_SIEVE, numeriPrimi, type PrimeMode } from '@/lib/tools/primi';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { modo: 'verifica', n: '91', fino: '100' };

export function PrimiTool() {
	const [state, set] = useToolState(DEFAULTS);
	const mode: PrimeMode = state.modo === 'elenco' ? 'elenco' : 'verifica';
	const value = mode === 'elenco' ? state.fino : state.n;
	const outcome = useMemo(() => numeriPrimi(mode, value), [mode, value]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToggleGroup
						label="Che cosa vuoi sapere"
						options={[
							{ value: 'verifica', label: 'È primo?' },
							{ value: 'elenco', label: 'Primi fino a N' }
						]}
						value={mode}
						onChange={(v) => set({ modo: v })}
					/>
					{mode === 'verifica' ? (
						<>
							<ToolField label="Numero" hint="Un numero intero positivo, fino a mille miliardi.">
								<input className={toolInputClass} inputMode="numeric" autoComplete="off" spellCheck={false} value={state.n} onChange={(e) => set({ n: e.target.value })} />
							</ToolField>
							<Examples items={['97', '91', '221', '1001'].map((n) => ({ label: n, apply: () => set({ n }) }))} />
						</>
					) : (
						<>
							<ToolField label="Fino a" hint={`Un numero intero da 2 a ${MAX_SIEVE}.`}>
								<input className={toolInputClass} inputMode="numeric" autoComplete="off" spellCheck={false} value={state.fino} onChange={(e) => set({ fino: e.target.value })} />
							</ToolField>
							<Examples items={['30', '100', '200', '1000'].map((fino) => ({ label: fino, apply: () => set({ fino }) }))} />
						</>
					)}
				</>
			}
		/>
	);
}
