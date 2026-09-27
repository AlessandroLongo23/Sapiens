'use client';

import { useMemo } from 'react';
import { operazioniBinarie, type BinOp } from '@/lib/tools/operazioni-binarie';
import { Examples, ModeSwitch, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { op: 'somma', a: '101101', b: '11011' };

const OPS: { value: BinOp; label: string }[] = [
	{ value: 'somma', label: 'Somma' },
	{ value: 'sottrazione', label: 'Sottrazione' },
	{ value: 'moltiplicazione', label: 'Moltiplicazione' }
];

const EXAMPLES: Record<BinOp, [string, string][]> = {
	somma: [
		['1011', '110'],
		['1111', '1'],
		['101101', '11011']
	],
	sottrazione: [
		['1101', '111'],
		['10000', '1'],
		['110010', '1011']
	],
	moltiplicazione: [
		['1011', '101'],
		['111', '11'],
		['1101', '1001']
	]
};

const SIGN: Record<BinOp, string> = { somma: '+', sottrazione: '−', moltiplicazione: '×' };

export function OperazioniBinarieTool() {
	const [state, set] = useToolState(DEFAULTS);
	const op: BinOp = OPS.some((o) => o.value === state.op) ? (state.op as BinOp) : 'somma';
	const outcome = useMemo(() => operazioniBinarie(state.a, state.b, op), [state.a, state.b, op]);
	const field = (key: 'a' | 'b', label: string) => (
		<ToolField label={label}>
			<input className={toolInputClass} inputMode="numeric" autoComplete="off" spellCheck={false} value={state[key]} onChange={(e) => set({ [key]: e.target.value })} />
		</ToolField>
	);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ModeSwitch label="Operazione" options={OPS} value={op} onChange={(o) => set({ op: o, a: EXAMPLES[o][0][0], b: EXAMPLES[o][0][1] })} />
					<div className="grid grid-cols-2 gap-3">
						{field('a', 'Primo numero (a)')}
						{field('b', 'Secondo numero (b)')}
					</div>
					<p className="text-xs text-fg-subtle">Solo le cifre 0 e 1, numeri senza segno. Fino a {op === 'moltiplicazione' ? 16 : 32} bit.</p>
					<Examples items={EXAMPLES[op].map(([a, b]) => ({ label: `${a} ${SIGN[op]} ${b}`, apply: () => set({ a, b }) }))} />
				</>
			}
		/>
	);
}
