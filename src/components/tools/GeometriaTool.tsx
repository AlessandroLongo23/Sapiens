'use client';

import { useMemo } from 'react';
import { FIGURE_EXAMPLES, FIGURES, UNITS, figura, isUnit, type FieldKey, type Figure } from '@/lib/tools/geometria';
import { Examples, ModeSwitch, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';
import { FigureSketch } from './FigureSketch';

const EMPTY: Record<FieldKey, string> = { a: '', b: '', c: '', d: '', e: '' };

/** Each figure opens on the example of its first mode, in centimetres. Built once, so the object stays the same. */
const DEFAULTS = Object.fromEntries(
	(Object.keys(FIGURES) as Figure[]).map((f) => {
		const first = FIGURES[f].modes[0];
		return [f, { modo: first.value, ...EMPTY, ...first.example, u: 'cm' }];
	})
) as Record<Figure, { modo: string; u: string } & Record<FieldKey, string>>;

/** Unit select, shared with the Pythagorean theorem. */
export function UnitSelect({ value, onChange }: { value: string; onChange: (u: string) => void }) {
	return (
		<ToolField label="Unità di misura">
			<select className={toolInputClass} value={value} onChange={(e) => onChange(e.target.value)}>
				<option value="">nessuna</option>
				{UNITS.map((u) => (
					<option key={u} value={u}>
						{u}
					</option>
				))}
			</select>
		</ToolField>
	);
}

export function GeometriaTool({ figure }: { figure: Figure }) {
	const [state, set] = useToolState(DEFAULTS[figure]);
	const { modes, name } = FIGURES[figure];
	const spec = modes.find((m) => m.value === state.modo) ?? modes[0];
	const unit = isUnit(state.u) ? state.u : '';
	const { outcome, sketch } = useMemo(() => figura(figure, spec.value, { a: state.a, b: state.b, c: state.c, d: state.d, e: state.e }, unit), [figure, spec.value, state.a, state.b, state.c, state.d, state.e, unit]);
	const fill = (modo: string, values: Partial<Record<FieldKey, string>>) => set({ modo, ...EMPTY, ...values });
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					{modes.length > 1 && <ModeSwitch label="Che cosa conosci" options={modes.map((m) => ({ value: m.value, label: m.label }))} value={spec.value} onChange={(m) => fill(m, modes.find((x) => x.value === m)?.example ?? {})} />}
					<div className="grid grid-cols-2 gap-3">
						{spec.fields.map((f) => (
							<ToolField key={f.key} label={f.label}>
								<input
									className={toolInputClass}
									inputMode={f.pi ? 'text' : 'decimal'}
									autoComplete="off"
									spellCheck={false}
									placeholder={f.optional ? 'facoltativo' : undefined}
									value={state[f.key]}
									onChange={(e) => set({ [f.key]: e.target.value })}
								/>
							</ToolField>
						))}
						<UnitSelect value={unit} onChange={(u) => set({ u })} />
					</div>
					<p className="text-xs text-fg-subtle">{spec.hint ?? 'Per i decimali puoi usare la virgola: 7,5.'}</p>
					{sketch && <FigureSketch sketch={sketch} title={`Disegno del ${name} con le misure`} />}
					<Examples items={FIGURE_EXAMPLES[figure].map((x) => ({ label: x.label, apply: () => fill(x.mode, x.values) }))} />
				</>
			}
		/>
	);
}

// One named component per page, for the registry.
export const QuadratoTool = () => <GeometriaTool figure="quadrato" />;
export const RettangoloTool = () => <GeometriaTool figure="rettangolo" />;
export const TriangoloTool = () => <GeometriaTool figure="triangolo" />;
export const TrapezioTool = () => <GeometriaTool figure="trapezio" />;
export const RomboTool = () => <GeometriaTool figure="rombo" />;
export const ParallelogrammaTool = () => <GeometriaTool figure="parallelogramma" />;
export const CerchioTool = () => <GeometriaTool figure="cerchio" />;
