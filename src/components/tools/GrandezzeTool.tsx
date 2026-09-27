'use client';

import type { ReactNode } from 'react';
import type { Quantity } from '@/lib/tools/grandezze';
import type { Outcome } from '@/lib/tools/types';
import { fieldClass } from '@/components/ui/Field';
import { cn } from '@/lib/utils/cn';
import { Examples, ModeSwitch, ToolSheet, toolInputClass } from './ToolSheet';

/**
 * The inputs every formula of the physics and chemistry tools shares: which quantity to find, then one row per
 * quantity with its value and its unit. The row of the unknown has no value: its unit select says in which unit to
 * give the result.
 */

const SUB: Record<string, string> = { '0': '₀', '1': '₁', '2': '₂' };
/** A symbol as plain text for a label: v_0 → v₀. */
export const symText = (sym: string) => sym.replace(/_(\d)/g, (_, d: string) => SUB[d] ?? d);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const unitSelectClass = cn(fieldClass, 'min-h-[48px] cursor-pointer text-base');

/** One quantity: its value and its unit side by side, or "da trovare" for the unknown. */
export function QuantityRow({ qt, unknown, value, unitId, onValue, onUnit }: { qt: Quantity; unknown: boolean; value: string; unitId: string; onValue: (v: string) => void; onUnit: (u: string) => void }) {
	const id = `q-${qt.key}`;
	const hasUnits = qt.units.length > 1 || qt.units[0].label !== '';
	return (
		<div className="flex flex-col gap-1.5">
			<label htmlFor={id} className="label-mono text-fg-subtle">
				{cap(qt.name)} ({symText(qt.sym)})
			</label>
			<div className={cn('grid gap-2', hasUnits && 'grid-cols-[minmax(0,3fr)_minmax(0,2fr)]')}>
				{unknown ? (
					<output id={id} className={cn(toolInputClass, 'min-h-[48px] bg-surface-2 text-base text-fg-muted')}>
						da trovare
					</output>
				) : (
					<input id={id} className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={value} onChange={(e) => onValue(e.target.value)} />
				)}
				{hasUnits && (
					<select aria-label={unknown ? `Unità del risultato: ${qt.name}` : `Unità: ${qt.name}`} className={unitSelectClass} value={qt.units.some((u) => u.id === unitId) ? unitId : qt.units[0].id} onChange={(e) => onUnit(e.target.value)} disabled={qt.units.length === 1}>
						{qt.units.map((u) => (
							<option key={u.id} value={u.id}>
								{u.label}
							</option>
						))}
					</select>
				)}
			</div>
		</div>
	);
}

export type FormulaExample = { label: string; values: Record<string, string> };

/** The whole form of a formula: the unknown to find, the rows, extra controls, the examples. */
export function FormulaTool({
	quantities,
	state,
	set,
	outcome,
	before,
	after,
	examples,
	hint = 'Per i decimali puoi usare la virgola: 12,5. Per le potenze di dieci: 3e8 oppure 3·10^8.'
}: {
	quantities: Quantity[];
	state: Record<string, string>;
	set: (patch: Record<string, string>) => void;
	outcome: Outcome;
	/** Controls above the unknown's switch (the formula of the accelerated motion). */
	before?: ReactNode;
	/** Controls under the rows (g, the table of densities). */
	after?: ReactNode;
	examples: FormulaExample[];
	hint?: string;
}) {
	const find = quantities.some((x) => x.key === state.trova) ? state.trova : quantities[0].key;
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					{before}
					<ModeSwitch label="Che cosa vuoi trovare" options={quantities.map((x) => ({ value: x.key, label: `${cap(x.name)} (${symText(x.sym)})` }))} value={find} onChange={(trova) => set({ trova })} />
					{quantities.map((qt) => (
						<QuantityRow key={qt.key} qt={qt} unknown={qt.key === find} value={state[qt.key] ?? ''} unitId={state[`u${qt.key}`] ?? ''} onValue={(v) => set({ [qt.key]: v })} onUnit={(u) => set({ [`u${qt.key}`]: u })} />
					))}
					{after}
					<p className="text-xs text-fg-subtle">{hint}</p>
					<Examples items={examples.map((x) => ({ label: x.label, apply: () => set(x.values) }))} />
				</>
			}
		/>
	);
}
