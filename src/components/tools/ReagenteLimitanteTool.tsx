'use client';

import { useMemo } from 'react';
import { AMOUNT_KEYS, AMOUNT_UNITS, reagenteLimitante, reagentsOf } from '@/lib/tools/reagente-limitante';
import { cn } from '@/lib/utils/cn';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';
import { unitSelectClass } from './GrandezzeTool';

/** The limiting reagent of a balanced reaction, with the products and the excess. */

const DEFAULTS = { r: '2H2 + O2 -> 2H2O', a: '10', ua: 'g', b: '64', ub: 'g', c: '', uc: 'g', d: '', ud: 'g' };

const EXAMPLES: { label: string; values: Partial<typeof DEFAULTS> }[] = [
	{ label: '10 g H2 e 64 g O2', values: { r: '2H2 + O2 -> 2H2O', a: '10', ua: 'g', b: '64', ub: 'g' } },
	{ label: 'Ammoniaca', values: { r: 'N2 + 3H2 -> 2NH3', a: '28', ua: 'g', b: '10', ub: 'g' } },
	{ label: 'Ossido di ferro', values: { r: '4Fe + 3O2 -> 2Fe2O3', a: '1', ua: 'mol', b: '1', ub: 'mol' } },
	{ label: 'Metano', values: { r: 'CH4 + 2O2 -> CO2 + 2H2O', a: '16', ua: 'g', b: '48', ub: 'g' } }
];

export function ReagenteLimitanteTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(() => reagenteLimitante(state), [state]);
	const reagents = useMemo(() => reagentsOf(state.r), [state.r]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToolField label="Reazione bilanciata" hint="Con i coefficienti e una freccia: 2H2 + O2 -> 2H2O. Lo strumento controlla il bilanciamento ma non lo fa.">
						<input className={toolInputClass} autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} value={state.r} onChange={(e) => set({ r: e.target.value })} />
					</ToolField>
					{reagents?.map((name, i) => {
						const key = AMOUNT_KEYS[i];
						const unitKey = `u${key}` as const;
						return (
							<div key={key} className="flex flex-col gap-1.5">
								<label htmlFor={`q-${key}`} className="label-mono text-fg-subtle">
									Quantità di {name}
								</label>
								<div className={cn('grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-2')}>
									<input id={`q-${key}`} className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={state[key]} onChange={(e) => set({ [key]: e.target.value })} />
									<select aria-label={`Unità: ${name}`} className={unitSelectClass} value={state[unitKey]} onChange={(e) => set({ [unitKey]: e.target.value })}>
										{AMOUNT_UNITS.map((u) => (
											<option key={u.id} value={u.id}>
												{u.label}
											</option>
										))}
									</select>
								</div>
							</div>
						);
					})}
					<Examples items={EXAMPLES.map((x) => ({ label: x.label, apply: () => set(x.values) }))} />
				</>
			}
		/>
	);
}
