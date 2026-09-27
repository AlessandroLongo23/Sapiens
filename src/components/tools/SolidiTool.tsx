'use client';

import { useMemo } from 'react';
import { isUnit } from '@/lib/tools/geometria';
import { PRISM_BASES, SOLID_EXAMPLES, SOLIDS, isPrismBase, solido, type FieldKey, type PrismBase, type Solid } from '@/lib/tools/solidi';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Examples, ModeSwitch, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';
import { UnitSelect } from './GeometriaTool';
import { SolidSketch } from './SolidSketch';

const EMPTY: Record<FieldKey, string> = { a: '', b: '', c: '' };

/** Each solid opens on the example of its first mode, in centimetres; the prism on a triangular base. */
const DEFAULTS = Object.fromEntries(
	(Object.keys(SOLIDS) as Solid[]).map((s) => {
		const first = SOLIDS[s].modes[0];
		return [s, { modo: first.value, ...EMPTY, ...first.example, u: 'cm', base: 'triangolo' }];
	})
) as Record<Solid, { modo: string; u: string; base: string } & Record<FieldKey, string>>;

export function SolidoTool({ solid }: { solid: Solid }) {
	const [state, set] = useToolState(DEFAULTS[solid]);
	const { modes, name } = SOLIDS[solid];
	const spec = modes.find((m) => m.value === state.modo) ?? modes[0];
	const unit = isUnit(state.u) ? state.u : '';
	const base: PrismBase = isPrismBase(state.base) ? state.base : 'triangolo';
	const { outcome, sketch } = useMemo(() => solido(solid, spec.value, { a: state.a, b: state.b, c: state.c }, unit, base), [solid, spec.value, state.a, state.b, state.c, unit, base]);
	const fill = (modo: string, values: Partial<Record<FieldKey, string>>, more: { base?: PrismBase } = {}) => set({ modo, ...EMPTY, ...values, ...more });
	const baseName = PRISM_BASES.find((b) => b.value === base)?.name;
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					{solid === 'prisma' && <ToggleGroup label="Base del prisma" options={PRISM_BASES.map((b) => ({ value: b.value, label: b.label }))} value={base} onChange={(b) => set({ base: b })} />}
					{modes.length > 1 && <ModeSwitch label="Che cosa conosci" options={modes.map((m) => ({ value: m.value, label: m.label }))} value={spec.value} onChange={(m) => fill(m, modes.find((x) => x.value === m)?.example ?? {})} />}
					<div className="grid grid-cols-2 gap-3">
						{spec.fields.map((f) => (
							<ToolField key={f.key} label={f.label}>
								<input className={toolInputClass} inputMode={f.pi ? 'text' : 'decimal'} autoComplete="off" spellCheck={false} value={state[f.key]} onChange={(e) => set({ [f.key]: e.target.value })} />
							</ToolField>
						))}
						<UnitSelect value={unit} onChange={(u) => set({ u })} />
					</div>
					<p className="text-xs text-fg-subtle">{spec.hint ?? 'Per i decimali puoi usare la virgola: 7,5.'}</p>
					{sketch && <SolidSketch sketch={sketch} title={solid === 'prisma' ? `Disegno del prisma a base di ${baseName} con le misure` : `Disegno: ${name} con le misure`} />}
					<Examples items={SOLID_EXAMPLES[solid].map((x) => ({ label: x.label, apply: () => fill(x.mode, x.values, x.base ? { base: x.base } : {}) }))} />
				</>
			}
		/>
	);
}

// One named component per page, for the registry.
export const CuboTool = () => <SolidoTool solid="cubo" />;
export const ParallelepipedoTool = () => <SolidoTool solid="parallelepipedo" />;
export const PrismaTool = () => <SolidoTool solid="prisma" />;
export const PiramideTool = () => <SolidoTool solid="piramide" />;
export const CilindroTool = () => <SolidoTool solid="cilindro" />;
export const ConoTool = () => <SolidoTool solid="cono" />;
export const SferaTool = () => <SolidoTool solid="sfera" />;
