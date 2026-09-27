'use client';

import { useMemo } from 'react';
import { arrotondamento, MAX_FIGURES, type RoundMode } from '@/lib/tools/arrotondamento';
import { fieldClass } from '@/components/ui/Field';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { cn } from '@/lib/utils/cn';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { modo: 'posto', n: '12,3456', p: '2', k: '3' };

/** The places, by the number of decimals kept. */
const PLACE_OPTIONS: { value: string; label: string }[] = [
	{ value: '-6', label: 'Ai milioni' },
	{ value: '-5', label: 'Alle centinaia di migliaia' },
	{ value: '-4', label: 'Alle decine di migliaia' },
	{ value: '-3', label: 'Alle migliaia' },
	{ value: '-2', label: 'Alle centinaia' },
	{ value: '-1', label: 'Alle decine' },
	{ value: '0', label: 'All’unità' },
	{ value: '1', label: 'Ai decimi (1 decimale)' },
	{ value: '2', label: 'Ai centesimi (2 decimali)' },
	{ value: '3', label: 'Ai millesimi (3 decimali)' },
	{ value: '4', label: 'A 4 decimali' },
	{ value: '5', label: 'A 5 decimali' },
	{ value: '6', label: 'A 6 decimali' }
];

const PLACE_EXAMPLES = [
	{ n: '3,14159', p: '2' },
	{ n: '2,997', p: '2' },
	{ n: '1 876', p: '-2' },
	{ n: '47 350', p: '-3' }
];
const FIGURE_EXAMPLES = [
	{ n: '0,004567', k: '2' },
	{ n: '9,8067', k: '3' },
	{ n: '299 792 458', k: '3' },
	{ n: '6,674', k: '2' }
];

export function ArrotondamentoTool() {
	const [state, set] = useToolState(DEFAULTS);
	const mode: RoundMode = state.modo === 'cifre' ? 'cifre' : 'posto';
	const outcome = useMemo(() => arrotondamento(mode, { n: state.n, p: state.p, k: state.k }), [mode, state.n, state.p, state.k]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToggleGroup
						label="Come arrotondare"
						options={[
							{ value: 'posto', label: 'A una cifra' },
							{ value: 'cifre', label: 'Cifre significative' }
						]}
						value={mode}
						onChange={(v) => set({ modo: v })}
					/>
					<ToolField label="Numero" hint="Per i decimali usa la virgola: 12,3456.">
						<input className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={state.n} onChange={(e) => set({ n: e.target.value })} />
					</ToolField>
					{mode === 'posto' ? (
						<>
							<ToolField label="Arrotonda">
								<select className={cn(fieldClass, 'min-h-[48px] cursor-pointer text-base')} value={state.p} onChange={(e) => set({ p: e.target.value })}>
									{PLACE_OPTIONS.map((o) => (
										<option key={o.value} value={o.value}>
											{o.label}
										</option>
									))}
								</select>
							</ToolField>
							<Examples items={PLACE_EXAMPLES.map((x) => ({ label: `${x.n} → ${PLACE_OPTIONS.find((o) => o.value === x.p)!.label.toLowerCase()}`, apply: () => set(x) }))} />
						</>
					) : (
						<>
							<ToolField label="Cifre significative" hint={`Quante cifre tenere, da 1 a ${MAX_FIGURES}.`}>
								<input className={toolInputClass} inputMode="numeric" autoComplete="off" spellCheck={false} value={state.k} onChange={(e) => set({ k: e.target.value })} />
							</ToolField>
							<Examples items={FIGURE_EXAMPLES.map((x) => ({ label: `${x.n} → ${x.k} cifre`, apply: () => set(x) }))} />
						</>
					)}
				</>
			}
		/>
	);
}
