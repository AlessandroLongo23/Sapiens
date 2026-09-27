'use client';

import { useMemo } from 'react';
import { logaritmo } from '@/lib/tools/logaritmi';
import { equazioneEsponenziale, previewEsponenziale } from '@/lib/tools/equazioni-esponenziali';
import { equazioneLogaritmica, previewLogaritmica } from '@/lib/tools/equazioni-logaritmiche';
import { tex } from '@/lib/tools/tex';
import { Html } from '@/components/ui/Html';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

/** The three tools on logarithms and exponentials: the logarithm of a number, exponential and logarithmic equations. */

const NUMBER_HINT = 'Numeri interi, decimali con la virgola (0,25), frazioni (1/2), radici (√2 oppure sqrt(2)), la e.';

export function LogaritmoTool() {
	const [state, set] = useToolState({ base: '4', arg: '8' });
	const outcome = useMemo(() => logaritmo(state.base, state.arg), [state.base, state.arg]);
	const examples = [
		{ base: '2', arg: '32' },
		{ base: '1/2', arg: '8' },
		{ base: '9', arg: '√3' },
		{ base: '3', arg: '5' }
	];
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<div className="grid grid-cols-2 gap-3">
						<ToolField label="Base">
							<input className={toolInputClass} inputMode="text" autoComplete="off" autoCapitalize="off" spellCheck={false} value={state.base} onChange={(e) => set({ base: e.target.value })} />
						</ToolField>
						<ToolField label="Argomento">
							<input className={toolInputClass} inputMode="text" autoComplete="off" autoCapitalize="off" spellCheck={false} value={state.arg} onChange={(e) => set({ arg: e.target.value })} />
						</ToolField>
					</div>
					<p className="text-xs text-fg-subtle">{NUMBER_HINT}</p>
					<Examples items={examples.map((x) => ({ label: `log_${x.base.includes('/') ? `(${x.base})` : x.base} ${x.arg}`, apply: () => set(x) }))} />
				</>
			}
		/>
	);
}

/** The field for an equation, with the equation typeset under it as the student types. */
function EquationInput({ value, onChange, placeholder, hint, preview }: { value: string; onChange: (value: string) => void; placeholder: string; hint: string; preview: (input: string) => string | null }) {
	const latex = useMemo(() => preview(value), [preview, value]);
	const html = useMemo(() => (latex ? tex(latex, true) : ''), [latex]);
	return (
		<>
			<ToolField label="Equazione" hint={hint}>
				<input className={toolInputClass} inputMode="text" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
			</ToolField>
			<div aria-label="Anteprima dell'equazione" className="min-h-[3.25rem] overflow-x-auto rounded-xl border border-dashed border-edge bg-surface-2 px-3 py-2 text-fg-strong">
				{html ? <Html html={html} className="math-content" /> : <p className="py-1.5 text-sm text-fg-faint">Qui vedi l&apos;equazione come l&apos;hai scritta.</p>}
			</div>
		</>
	);
}

export function EquazioniEsponenzialiTool() {
	const [state, set] = useToolState({ eq: '4^(x - 1) = 8' });
	const outcome = useMemo(() => equazioneEsponenziale(state.eq), [state.eq]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<EquationInput
						value={state.eq}
						onChange={(eq) => set({ eq })}
						placeholder="2^(x + 1) = 8"
						hint="Scrivi ^ per l'esponente e mettilo tra parentesi se ha più termini: 2^(x + 1). Per le frazioni: (1/2)^x."
						preview={previewEsponenziale}
					/>
					<Examples items={['2^(x + 1) = 8', '9^x = 27', '3^x = 5', '2^(3x) = 4^(x + 1)'].map((eq) => ({ label: eq, apply: () => set({ eq }) }))} />
				</>
			}
		/>
	);
}

export function EquazioniLogaritmicheTool() {
	const [state, set] = useToolState({ eq: 'log_2(3x - 1) = log_2(x + 5)' });
	const outcome = useMemo(() => equazioneLogaritmica(state.eq), [state.eq]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<EquationInput
						value={state.eq}
						onChange={(eq) => set({ eq })}
						placeholder="log_2(x + 1) = 3"
						hint="Scrivi log_2(…) per la base 2, log(…) per la base 10, ln(…) per il logaritmo naturale."
						preview={previewLogaritmica}
					/>
					<Examples items={['log_2(x + 1) = 3', 'log_3(2x - 1) = 2', 'log(x - 3) = log(2x + 1)', 'ln(x) = 2'].map((eq) => ({ label: eq, apply: () => set({ eq }) }))} />
				</>
			}
		/>
	);
}
