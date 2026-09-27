'use client';

import { useMemo } from 'react';
import { DENSITA, ENERGIA_CINETICA, ENERGIA_POTENZIALE, MATERIALS, MOTO_FORMULE, MOTO_UNIFORME, OHM, densita, energiaCinetica, energiaPotenziale, motoAccelerato, motoUniforme, ohm } from '@/lib/tools/fisica';
import type { ProductSpec } from '@/lib/tools/grandezze';
import { ModeSwitch, ToolField, toolInputClass, useToolState } from './ToolSheet';
import { FormulaTool, type FormulaExample } from './GrandezzeTool';

/** The physics formulas, one component per page. */

const three = (spec: ProductSpec) => [spec[spec.main], ...(['p', 'a', 'b'] as const).filter((r) => r !== spec.main).map((r) => spec[r])];

// Uniform motion.
const MOTO_DEFAULTS = { trova: 'v', s: '150', us: 'km', v: '', uv: 'kmh', t: '2', ut: 'h' };
const MOTO_EXAMPLES: FormulaExample[] = [
	{ label: '100 m in 9,58 s', values: { trova: 'v', s: '100', us: 'm', t: '9,58', ut: 's', uv: 'kmh' } },
	{ label: '12 m/s per 30 s', values: { trova: 's', v: '12', uv: 'ms', t: '30', ut: 's', us: 'm' } },
	{ label: '300 km a 120 km/h', values: { trova: 't', s: '300', us: 'km', v: '120', uv: 'kmh', ut: 'h' } }
];

export function MotoUniformeTool() {
	const [state, set] = useToolState(MOTO_DEFAULTS);
	const outcome = useMemo(() => motoUniforme(state), [state]);
	return <FormulaTool quantities={three(MOTO_UNIFORME)} state={state} set={set} outcome={outcome} examples={MOTO_EXAMPLES} />;
}

// Density.
const DENSITA_DEFAULTS = { trova: 'd', m: '540', um: 'g', V: '200', uV: 'cm3', d: '', ud: 'gcm3' };
const DENSITA_EXAMPLES: FormulaExample[] = [
	{ label: '2 dm³ di ferro', values: { trova: 'm', d: '7870', ud: 'kgm3', V: '2', uV: 'dm3', um: 'kg' } },
	{ label: '1 kg di olio', values: { trova: 'V', d: '920', ud: 'kgm3', m: '1', um: 'kg', uV: 'L' } },
	{ label: '50 g in 25 mL', values: { trova: 'd', m: '50', um: 'g', V: '25', uV: 'mL', ud: 'gmL' } }
];

export function DensitaTool() {
	const [state, set] = useToolState(DENSITA_DEFAULTS);
	const outcome = useMemo(() => densita(state), [state]);
	return (
		<FormulaTool
			quantities={three(DENSITA)}
			state={state}
			set={set}
			outcome={outcome}
			examples={DENSITA_EXAMPLES}
			after={
				<div className="flex flex-col gap-1.5">
					<span className="label-mono text-fg-subtle">Densità di alcuni materiali (kg/m³)</span>
					<div className="flex flex-wrap gap-2 text-sm">
						{MATERIALS.map((m) => (
							<button
								key={m.name}
								type="button"
								title={m.note}
								onClick={() => set({ d: m.d, ud: 'kgm3', trova: state.trova === 'd' ? 'm' : state.trova })}
								className="rounded-lg border border-edge bg-surface px-2.5 py-1 text-fg-muted transition-colors hover:border-edge-strong hover:text-fg focus-ring"
							>
								{m.name} <span className="font-mono text-fg-subtle">{m.d}</span>
							</button>
						))}
					</div>
					<span className="text-xs text-fg-subtle">A 20 °C, il ghiaccio a 0 °C. Il legno cambia molto da un tipo all’altro.</span>
				</div>
			}
		/>
	);
}

// Ohm's law.
const OHM_DEFAULTS = { trova: 'I', V: '12', uV: 'V', R: '240', uR: 'ohm', I: '', uI: 'mA' };
const OHM_EXAMPLES: FormulaExample[] = [
	{ label: '230 V e 2 A', values: { trova: 'R', V: '230', uV: 'V', I: '2', uI: 'A', uR: 'ohm' } },
	{ label: '20 mA in 470 Ω', values: { trova: 'V', I: '20', uI: 'mA', R: '470', uR: 'ohm', uV: 'V' } },
	{ label: '9 V su 4,7 kΩ', values: { trova: 'I', V: '9', uV: 'V', R: '4,7', uR: 'kohm', uI: 'mA' } }
];

export function OhmTool() {
	const [state, set] = useToolState(OHM_DEFAULTS);
	const outcome = useMemo(() => ohm(state), [state]);
	return <FormulaTool quantities={three(OHM)} state={state} set={set} outcome={outcome} examples={OHM_EXAMPLES} />;
}

// Kinetic energy.
const K_DEFAULTS = { trova: 'K', K: '', uK: 'J', m: '1200', um: 'kg', v: '90', uv: 'kmh' };
const K_EXAMPLES: FormulaExample[] = [
	{ label: 'Pallone da 450 g a 20 m/s', values: { trova: 'K', m: '450', um: 'g', v: '20', uv: 'ms', uK: 'J' } },
	{ label: 'Velocità: 2 kg e 100 J', values: { trova: 'v', m: '2', um: 'kg', K: '100', uK: 'J', uv: 'ms' } },
	{ label: 'Massa: 36 km/h e 5 kJ', values: { trova: 'm', v: '36', uv: 'kmh', K: '5', uK: 'kJ', um: 'kg' } }
];

export function EnergiaCineticaTool() {
	const [state, set] = useToolState(K_DEFAULTS);
	const outcome = useMemo(() => energiaCinetica(state), [state]);
	return <FormulaTool quantities={ENERGIA_CINETICA} state={state} set={set} outcome={outcome} examples={K_EXAMPLES} />;
}

// Gravitational potential energy.
const U_DEFAULTS = { trova: 'U', U: '', uU: 'J', m: '500', um: 'g', h: '80', uh: 'cm', g: '9,8' };
const U_EXAMPLES: FormulaExample[] = [
	{ label: '60 kg a 3 m', values: { trova: 'U', m: '60', um: 'kg', h: '3', uh: 'm', uU: 'J' } },
	{ label: 'Altezza: 2 kg e 196 J', values: { trova: 'h', m: '2', um: 'kg', U: '196', uU: 'J', uh: 'm' } },
	{ label: 'Sulla Luna', values: { trova: 'U', m: '60', um: 'kg', h: '3', uh: 'm', g: '1,62', uU: 'J' } }
];

export function EnergiaPotenzialeTool() {
	const [state, set] = useToolState(U_DEFAULTS);
	const outcome = useMemo(() => energiaPotenziale(state), [state]);
	return (
		<FormulaTool
			quantities={ENERGIA_POTENZIALE}
			state={state}
			set={set}
			outcome={outcome}
			examples={U_EXAMPLES}
			after={
				<ToolField label="Accelerazione di gravità (g), in m/s²" hint="Sulla Terra 9,8 m/s², come nei libri; alcuni usano 9,81. Sulla Luna 1,62.">
					<input className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={state.g} onChange={(e) => set({ g: e.target.value })} />
				</ToolField>
			}
		/>
	);
}

// Uniformly accelerated motion.
const MRUA_DEFAULTS = { f: 's', trova: 's', v0: '36', uv0: 'kmh', v: '', uv: 'ms', a: '2', ua: 'ms2', t: '5', ut: 's', s: '', us: 'm' };
const MRUA_EXAMPLES: FormulaExample[] = [
	{ label: 'Da 0 a 100 km/h in 8 s', values: { f: 'v', trova: 'a', v0: '0', uv0: 'kmh', v: '100', uv: 'kmh', t: '8', ut: 's' } },
	{ label: 'Frenata da 90 km/h', values: { f: 'v2', trova: 's', v0: '90', uv0: 'kmh', v: '0', uv: 'kmh', a: '-5', us: 'm' } },
	{ label: 'Tempo per 50 m', values: { f: 's', trova: 't', v0: '5', uv0: 'ms', a: '2', s: '50', us: 'm', ut: 's' } }
];

export function MotoAcceleratoTool() {
	const [state, set] = useToolState(MRUA_DEFAULTS);
	const formula = MOTO_FORMULE.find((x) => x.id === state.f) ?? MOTO_FORMULE[1];
	const trova = formula.vars.some((x) => x.key === state.trova) ? state.trova : formula.vars[0].key;
	const outcome = useMemo(() => motoAccelerato({ ...state, f: formula.id, trova }), [state, formula.id, trova]);
	return (
		<FormulaTool
			quantities={formula.vars}
			state={{ ...state, trova }}
			set={set}
			outcome={outcome}
			examples={MRUA_EXAMPLES}
			hint="Per i decimali puoi usare la virgola: 12,5. In frenata l’accelerazione è negativa: scrivi il segno meno, -5."
			before={<ModeSwitch label="Quale formula" options={MOTO_FORMULE.map((x) => ({ value: x.id, label: x.label }))} value={formula.id} onChange={(f) => set({ f })} />}
		/>
	);
}
