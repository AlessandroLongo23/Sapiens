'use client';

import { useMemo } from 'react';
import { PH_MODES, ph, type PhMode } from '@/lib/tools/ph';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Examples, ModeSwitch, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

/** pH and pOH from a concentration, from the other p, or from the molarity of a strong acid or base. */

const DEFAULTS = { modo: 'H', x: '2,5e-3', k: '1' };

const MODES: { value: PhMode; label: string }[] = [
	{ value: 'H', label: 'Da [H⁺]' },
	{ value: 'OH', label: 'Da [OH⁻]' },
	{ value: 'pH', label: 'Dal pH' },
	{ value: 'pOH', label: 'Dal pOH' },
	{ value: 'acido', label: 'Acido forte' },
	{ value: 'base', label: 'Base forte' }
];

const FIELD: Record<PhMode, string> = {
	H: 'Concentrazione di H⁺ (mol/L)',
	OH: 'Concentrazione di OH⁻ (mol/L)',
	pH: 'pH',
	pOH: 'pOH',
	acido: 'Molarità dell’acido, C (mol/L)',
	base: 'Molarità della base, C (mol/L)'
};

const EXAMPLES: { label: string; values: typeof DEFAULTS }[] = [
	{ label: '[H⁺] = 2,5·10⁻³', values: { modo: 'H', x: '2,5e-3', k: '1' } },
	{ label: 'HCl 0,01 M', values: { modo: 'acido', x: '0,01', k: '1' } },
	{ label: 'Ca(OH)₂ 0,005 M', values: { modo: 'base', x: '0,005', k: '2' } },
	{ label: 'pH 3,7', values: { modo: 'pH', x: '3,7', k: '1' } }
];

export function PhTool() {
	const [state, set] = useToolState(DEFAULTS);
	const mode: PhMode = (PH_MODES as string[]).includes(state.modo) ? (state.modo as PhMode) : 'H';
	const outcome = useMemo(() => ph({ ...state, modo: mode }), [state, mode]);
	const strong = mode === 'acido' || mode === 'base';
	const byP = mode === 'pH' || mode === 'pOH';
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ModeSwitch label="Che cosa conosci" options={MODES} value={mode} onChange={(modo) => set({ modo })} />
					<ToolField label={FIELD[mode]} hint={byP ? 'Per i decimali puoi usare la virgola: 3,7.' : 'Per le potenze di dieci scrivi 2,5e-3 oppure 2,5·10^-3.'}>
						<input className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={state.x} onChange={(e) => set({ x: e.target.value })} />
					</ToolField>
					{strong && (
						<div className="flex flex-col gap-1.5">
							<span className="label-mono text-fg-subtle">{mode === 'acido' ? 'Ioni H⁺ per molecola' : 'Ioni OH⁻ per unità'}</span>
							<ToggleGroup
								label={mode === 'acido' ? 'Ioni H⁺ per molecola' : 'Ioni OH⁻ per unità'}
								options={[
									{ value: '1', label: mode === 'acido' ? '1: HCl, HNO₃' : '1: NaOH, KOH' },
									{ value: '2', label: mode === 'acido' ? '2: H₂SO₄' : '2: Ca(OH)₂' }
								]}
								value={state.k === '2' ? '2' : '1'}
								onChange={(k) => set({ k })}
							/>
						</div>
					)}
					<p className="text-xs text-fg-subtle">A 25 °C, con il prodotto ionico dell’acqua Kw = 10⁻¹⁴.</p>
					<Examples items={EXAMPLES.map((x) => ({ label: x.label, apply: () => set(x.values) }))} />
				</>
			}
		/>
	);
}
