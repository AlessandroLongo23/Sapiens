'use client';

import { useMemo } from 'react';
import { BIT_SIZES, complementoADue, type Direction } from '@/lib/tools/complemento-a-due';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Examples, ModeSwitch, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { modo: 'dec', n: '-14', bit: '8' };

const MODES: { value: Direction; label: string }[] = [
	{ value: 'dec', label: 'Da decimale a binario' },
	{ value: 'bin', label: 'Da binario a decimale' }
];

const EXAMPLES: Record<Direction, { label: string; n: string; bit?: string }[]> = {
	dec: [
		{ label: '-1 su 8 bit', n: '-1', bit: '8' },
		{ label: '-100 su 8 bit', n: '-100', bit: '8' },
		{ label: '-128 su 8 bit', n: '-128', bit: '8' },
		{ label: '-1000 su 16 bit', n: '-1000', bit: '16' }
	],
	bin: [
		{ label: '1111 0010', n: '1111 0010' },
		{ label: '1000 0000', n: '1000 0000' },
		{ label: '0111 1111', n: '0111 1111' },
		{ label: '1111 1100 0001 1000', n: '1111 1100 0001 1000' }
	]
};

export function ComplementoADueTool() {
	const [state, set] = useToolState(DEFAULTS);
	const mode: Direction = state.modo === 'bin' ? 'bin' : 'dec';
	const bits = Number(state.bit);
	const outcome = useMemo(() => complementoADue(state.n, mode, bits), [state.n, mode, bits]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ModeSwitch
						label="Che cosa vuoi convertire"
						options={MODES}
						value={mode}
						onChange={(m) => set({ modo: m, n: m === 'bin' ? '1111 0010' : '-14' })}
					/>
					<ToolField
						label={mode === 'dec' ? 'Numero decimale' : 'Bit in complemento a due'}
						hint={mode === 'dec' ? 'Un numero intero, con il segno meno se è negativo.' : 'Scrivi tutti i bit, anche gli zeri a sinistra: il primo è il segno. Al massimo 32.'}
					>
						<input
							className={toolInputClass}
							inputMode={mode === 'dec' ? 'text' : 'numeric'}
							autoComplete="off"
							spellCheck={false}
							value={state.n}
							onChange={(e) => set({ n: e.target.value })}
						/>
					</ToolField>
					{mode === 'dec' && (
						<ToggleGroup label="Numero di bit" options={BIT_SIZES.map((b) => ({ value: String(b), label: `${b} bit` }))} value={String(bits)} onChange={(bit) => set({ bit })} />
					)}
					<Examples items={EXAMPLES[mode].map(({ label, ...e }) => ({ label, apply: () => set(e) }))} />
				</>
			}
		/>
	);
}
