'use client';

import { useMemo } from 'react';
import { composizione, formulaMinima, type ComposizioneMode } from '@/lib/tools/formula-minima';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Examples, ModeSwitch, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

/** Percent composition of a formula, and the empirical and molecular formula from the percentages or the grams. */

const DEFAULTS = { modo: 'minima', e: 'C 82,63; H 17,37', u: '%', M: '58,12', f: 'Ca(OH)2' };

const MODES: { value: ComposizioneMode; label: string }[] = [
	{ value: 'minima', label: 'Dalle percentuali alla formula' },
	{ value: 'comp', label: 'Dalla formula alle percentuali' }
];

const EXAMPLES: { label: string; values: Partial<typeof DEFAULTS> }[] = [
	{ label: 'Glucosio', values: { modo: 'minima', e: 'C 40; H 6,71; O 53,29', u: '%', M: '180,18' } },
	{ label: 'Ossido di ferro', values: { modo: 'minima', e: 'Fe 69,94; O 30,06', u: '%', M: '' } },
	{ label: '2,4 g C e 0,6 g H', values: { modo: 'minima', e: 'C 2,4; H 0,6', u: 'g', M: '30' } },
	{ label: 'H2SO4', values: { modo: 'comp', f: 'H2SO4' } }
];

const input = (value: string, onChange: (v: string) => void, decimal = false) => (
	<input className={toolInputClass} inputMode={decimal ? 'decimal' : undefined} autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} value={value} onChange={(e) => onChange(e.target.value)} />
);

export function FormulaMinimaTool() {
	const [state, set] = useToolState(DEFAULTS);
	const mode: ComposizioneMode = state.modo === 'comp' ? 'comp' : 'minima';
	const outcome = useMemo(() => (mode === 'comp' ? composizione(state.f) : formulaMinima(state)), [mode, state]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ModeSwitch label="Che cosa vuoi trovare" options={MODES} value={mode} onChange={(modo) => set({ modo })} />
					{mode === 'comp' ? (
						<ToolField label="Formula chimica" hint="Maiuscole e minuscole contano: Co è il cobalto, CO il monossido di carbonio.">
							{input(state.f, (f) => set({ f }))}
						</ToolField>
					) : (
						<>
							<div className="flex flex-col gap-1.5">
								<span className="label-mono text-fg-subtle">I dati sono</span>
								<ToggleGroup
									label="I dati sono"
									options={[
										{ value: '%', label: 'Percentuali' },
										{ value: 'g', label: 'Grammi' }
									]}
									value={state.u === 'g' ? 'g' : '%'}
									onChange={(u) => set({ u })}
								/>
							</div>
							<ToolField label="Elementi e valori" hint="Ogni simbolo seguito dal suo valore, separati da punto e virgola: C 40; H 6,71; O 53,29.">
								{input(state.e, (e) => set({ e }))}
							</ToolField>
							<ToolField label="Massa molare in g/mol (se la conosci)" hint="Serve per la formula molecolare. Lasciala vuota per avere solo la formula minima.">
								{input(state.M, (M) => set({ M }), true)}
							</ToolField>
						</>
					)}
					<Examples items={EXAMPLES.map((x) => ({ label: x.label, apply: () => set(x.values) }))} />
				</>
			}
		/>
	);
}
