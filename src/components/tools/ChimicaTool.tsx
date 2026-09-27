'use client';

import { useMemo } from 'react';
import { DILUIZIONE, MOLARITA, MOLI_GIVEN, diluizione, massaMolare, molarita, moli, type MoliMode } from '@/lib/tools/chimica';
import { Examples, ModeSwitch, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';
import { FormulaTool, type FormulaExample, QuantityRow } from './GrandezzeTool';

/** The chemistry tools, one component per page. */

const FORMULA_HINT = 'Maiuscole e minuscole contano: Co è il cobalto, CO il monossido di carbonio. Per gli idrati usa il punto: CuSO4·5H2O oppure CuSO4.5H2O.';

function FormulaField({ value, onChange }: { value: string; onChange: (f: string) => void }) {
	return (
		<ToolField label="Formula chimica" hint={FORMULA_HINT}>
			<input className={toolInputClass} autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} value={value} onChange={(e) => onChange(e.target.value)} />
		</ToolField>
	);
}

// Molar mass.
const MM_DEFAULTS = { f: 'Ca(OH)2' };

export function MassaMolareTool() {
	const [state, set] = useToolState(MM_DEFAULTS);
	const outcome = useMemo(() => massaMolare(state.f), [state.f]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<FormulaField value={state.f} onChange={(f) => set({ f })} />
					<Examples items={['H2O', 'NaCl', 'C6H12O6', 'CuSO4·5H2O', 'Al2(SO4)3'].map((f) => ({ label: f, apply: () => set({ f }) }))} />
				</>
			}
		/>
	);
}

// Grams, moles and particles.
const MOLI_DEFAULTS = { f: 'H2O', da: 'g', x: '36', u: 'g' };
const MOLI_MODES: { value: MoliMode; label: string }[] = [
	{ value: 'g', label: 'Da grammi a moli' },
	{ value: 'mol', label: 'Da moli a grammi' },
	{ value: 'N', label: 'Da particelle a moli' }
];
const MOLI_EXAMPLES: FormulaExample[] = [
	{ label: '36 g di H2O', values: { f: 'H2O', da: 'g', x: '36', u: 'g' } },
	{ label: '0,25 mol di NaCl', values: { f: 'NaCl', da: 'mol', x: '0,25', u: 'mol' } },
	{ label: '1 kg di CaCO3', values: { f: 'CaCO3', da: 'g', x: '1', u: 'kg' } },
	{ label: '3,011e23 atomi di Fe', values: { f: 'Fe', da: 'N', x: '3,011e23', u: 'n' } }
];

export function MoliTool() {
	const [state, set] = useToolState(MOLI_DEFAULTS);
	const mode: MoliMode = state.da === 'mol' || state.da === 'N' ? state.da : 'g';
	const outcome = useMemo(() => moli({ ...state, da: mode }), [state, mode]);
	const given = MOLI_GIVEN[mode];
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ModeSwitch label="Che cosa conosci" options={MOLI_MODES} value={mode} onChange={(da) => set({ da, u: MOLI_GIVEN[da].units[0].id })} />
					<FormulaField value={state.f} onChange={(f) => set({ f })} />
					<QuantityRow qt={given} unknown={false} value={state.x} unitId={state.u} onValue={(x) => set({ x })} onUnit={(u) => set({ u })} />
					<p className="text-xs text-fg-subtle">Per i numeri molto grandi usa le potenze di dieci: 3,011e23 oppure 3,011·10^23.</p>
					<Examples items={MOLI_EXAMPLES.map((x) => ({ label: x.label, apply: () => set(x.values) }))} />
				</>
			}
		/>
	);
}

// Molarity.
const MOLARITA_DEFAULTS = { trova: 'M', n: '0,5', un: 'mol', V: '250', uV: 'mL', M: '', uM: 'M' };
const MOLARITA_EXAMPLES: FormulaExample[] = [
	{ label: '0,1 mol in 500 mL', values: { trova: 'M', n: '0,1', un: 'mol', V: '500', uV: 'mL', uM: 'M' } },
	{ label: 'Moli in 2 L a 0,5 M', values: { trova: 'n', M: '0,5', uM: 'M', V: '2', uV: 'L', un: 'mol' } },
	{ label: 'Volume per 0,2 mol a 0,8 M', values: { trova: 'V', n: '0,2', un: 'mol', M: '0,8', uM: 'M', uV: 'mL' } }
];

export function MolaritaTool() {
	const [state, set] = useToolState(MOLARITA_DEFAULTS);
	const outcome = useMemo(() => molarita(state), [state]);
	return <FormulaTool quantities={[MOLARITA.a, MOLARITA.p, MOLARITA.b]} state={state} set={set} outcome={outcome} examples={MOLARITA_EXAMPLES} hint="Per i decimali puoi usare la virgola: 0,5. La molarità si scrive anche M: 0,5 M vuol dire 0,5 mol/L." />;
}

// Dilution.
const DILUIZIONE_DEFAULTS = { trova: 'V2', M1: '2', uM1: 'M', V1: '50', uV1: 'mL', M2: '0,5', uM2: 'M', V2: '', uV2: 'mL' };
const DILUIZIONE_EXAMPLES: FormulaExample[] = [
	{ label: 'Da 1 M a 0,1 M, 1 L finale', values: { trova: 'V1', M1: '1', uM1: 'M', M2: '0,1', uM2: 'M', V2: '1', uV2: 'L', uV1: 'mL' } },
	{ label: '10 mL di 6 M in 250 mL', values: { trova: 'M2', M1: '6', uM1: 'M', V1: '10', uV1: 'mL', V2: '250', uV2: 'mL', uM2: 'M' } },
	{ label: '100 mL da 3 M a 1 M', values: { trova: 'V2', M1: '3', uM1: 'M', V1: '100', uV1: 'mL', M2: '1', uM2: 'M', uV2: 'mL' } }
];

export function DiluizioneTool() {
	const [state, set] = useToolState(DILUIZIONE_DEFAULTS);
	const outcome = useMemo(() => diluizione(state), [state]);
	return <FormulaTool quantities={DILUIZIONE} state={state} set={set} outcome={outcome} examples={DILUIZIONE_EXAMPLES} hint="Per i decimali puoi usare la virgola: 0,5. I due volumi possono avere unità diverse." />;
}
