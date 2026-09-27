'use client';

import { useMemo } from 'react';
import { equazioneSecondoGrado, quadraticDegree, type QuadraticInput } from '@/lib/tools/equazioni-secondo-grado';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { EquationField, OtherToolLink } from './EquazioniPrimoGradoTool';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { modo: 'coef', a: '2', b: '-4', c: '-3', eq: '(x - 1)^2 = 3 - x' };

const COEFFICIENTS: { key: 'a' | 'b' | 'c'; label: string }[] = [
	{ key: 'a', label: 'a (di x²)' },
	{ key: 'b', label: 'b (di x)' },
	{ key: 'c', label: 'c (termine noto)' }
];

const COEF_EXAMPLES: [string, string, string][] = [
	['1', '-5', '6'],
	['1', '-3', '1'],
	['2', '0', '-8'],
	['1', '2', '5']
];

/** "bx + c = 0" for the first-degree tool, when a is 0. */
function linearText(b: string, c: string): string {
	const B = b.trim() || '0';
	const C = c.trim() || '0';
	return `${B}x + ${C.startsWith('-') ? `(${C})` : C} = 0`;
}

export function EquazioniSecondoGradoTool() {
	const [state, set] = useToolState(DEFAULTS);
	const mode = state.modo === 'eq' ? 'eq' : 'coef';
	const input: QuadraticInput = useMemo(() => ({ mode, a: state.a, b: state.b, c: state.c, eq: state.eq }), [mode, state.a, state.b, state.c, state.eq]);
	const outcome = useMemo(() => equazioneSecondoGrado(input), [input]);
	const degree = useMemo(() => quadraticDegree(input), [input]);
	const firstDegree = degree !== null && degree <= 1;
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToggleGroup
						label="Come scrivi l'equazione"
						options={[
							{ value: 'coef', label: 'Coefficienti' },
							{ value: 'eq', label: 'Equazione' }
						]}
						value={mode}
						onChange={(m) => set({ modo: m })}
					/>
					{mode === 'coef' ? (
						<>
							<p className="text-sm text-fg-muted">
								L&apos;equazione in forma normale <span className="font-mono">ax² + bx + c = 0</span>.
							</p>
							<div className="grid grid-cols-3 items-end gap-3">
								{COEFFICIENTS.map(({ key, label }) => (
									<ToolField key={key} label={label}>
										<input className={toolInputClass} inputMode="text" autoComplete="off" spellCheck={false} value={state[key]} onChange={(e) => set({ [key]: e.target.value })} />
									</ToolField>
								))}
							</div>
							<p className="text-xs text-fg-subtle">Numeri interi, decimali con la virgola (1,5) o frazioni (2/3). Un campo vuoto vale 0.</p>
							<Examples items={COEF_EXAMPLES.map(([a, b, c]) => ({ label: `${a}; ${b}; ${c}`, apply: () => set({ a, b, c }) }))} />
						</>
					) : (
						<>
							<EquationField value={state.eq} onChange={(eq) => set({ eq })} placeholder="x^2 - 5x + 6 = 0" />
							<Examples items={['x^2 - 5x + 6 = 0', '3x^2 = 5', 'x(x + 2) = 3', '(x - 1)^2 = 3 - x'].map((eq) => ({ label: eq, apply: () => set({ eq }) }))} />
						</>
					)}
					{firstDegree && <OtherToolLink slug="equazioni-primo-grado" query={{ eq: mode === 'eq' ? state.eq : linearText(state.b, state.c) }} label="Risolvila come equazione di primo grado" />}
				</>
			}
		/>
	);
}
