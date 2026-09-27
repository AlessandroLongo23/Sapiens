'use client';

import { useMemo } from 'react';
import { frazioni, type FracOp } from '@/lib/tools/frazioni';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { cn } from '@/lib/utils/cn';
import { Examples, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { op: 'piu', an: '3', ad: '4', bn: '5', bd: '6' };

const OPS: { value: FracOp; label: string }[] = [
	{ value: 'piu', label: '+' },
	{ value: 'meno', label: '−' },
	{ value: 'per', label: '×' },
	{ value: 'diviso', label: ':' },
	{ value: 'semplifica', label: 'Semplifica' }
];

const SIGN: Record<FracOp, string> = { piu: '+', meno: '−', per: '×', diviso: ':', semplifica: '' };

const isOp = (o: string): o is FracOp => OPS.some((x) => x.value === o);

/** A fraction to fill in: numerator over denominator, with the fraction line between them. */
function FractionInput({ label, n, d, onN, onD }: { label: string; n: string; d: string; onN: (v: string) => void; onD: (v: string) => void }) {
	const field = cn(toolInputClass, 'px-2 text-center');
	return (
		<div role="group" aria-label={label} className="flex w-24 flex-col gap-1.5 sm:w-28">
			{/* No inputMode: the numeric keypad of iOS has no minus sign, and negatives are allowed. */}
			<input aria-label={`${label}, numeratore`} className={field} autoComplete="off" spellCheck={false} value={n} onChange={(e) => onN(e.target.value)} />
			<div className="h-0.5 rounded-full bg-fg-strong" aria-hidden="true" />
			<input aria-label={`${label}, denominatore`} className={field} autoComplete="off" spellCheck={false} placeholder="1" value={d} onChange={(e) => onD(e.target.value)} />
		</div>
	);
}

export function FrazioniTool() {
	const [state, set] = useToolState(DEFAULTS);
	const op = isOp(state.op) ? state.op : 'piu';
	const outcome = useMemo(() => frazioni({ op, an: state.an, ad: state.ad, bn: state.bn, bd: state.bd }), [op, state.an, state.ad, state.bn, state.bd]);
	const one = op === 'semplifica';
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToggleGroup label="Operazione" options={OPS} value={op} onChange={(v) => set({ op: v })} />
					<div className="flex items-center justify-center gap-3 py-2 sm:gap-4">
						<FractionInput label={one ? 'Frazione' : 'Prima frazione'} n={state.an} d={state.ad} onN={(an) => set({ an })} onD={(ad) => set({ ad })} />
						{!one && (
							<>
								<span className="font-mono text-3xl text-fg-strong" aria-hidden="true">
									{SIGN[op]}
								</span>
								<FractionInput label="Seconda frazione" n={state.bn} d={state.bd} onN={(bn) => set({ bn })} onD={(bd) => set({ bd })} />
							</>
						)}
					</div>
					<p className="text-xs text-fg-subtle">Numeri interi, anche negativi. Per un numero intero lascia vuoto il denominatore.</p>
					<Examples
						items={[
							{ label: '3/4 + 5/6', apply: () => set({ op: 'piu', an: '3', ad: '4', bn: '5', bd: '6' }) },
							{ label: '2/3 − 5/8', apply: () => set({ op: 'meno', an: '2', ad: '3', bn: '5', bd: '8' }) },
							{ label: '4/9 × 15/8', apply: () => set({ op: 'per', an: '4', ad: '9', bn: '15', bd: '8' }) },
							{ label: '3/4 : 9/10', apply: () => set({ op: 'diviso', an: '3', ad: '4', bn: '9', bd: '10' }) },
							{ label: '84/36', apply: () => set({ op: 'semplifica', an: '84', ad: '36' }) }
						]}
					/>
				</>
			}
		/>
	);
}
