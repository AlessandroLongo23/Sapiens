'use client';

import { useMemo } from 'react';
import { isUnit } from '@/lib/tools/geometria';
import { POLYGON_EXAMPLES, POLYGON_MODES, POLYGONS, poligonoRegolare, polygonBySides, type PolygonMode } from '@/lib/tools/poligoni-regolari';
import { Examples, ModeSwitch, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';
import { FigureSketch } from './FigureSketch';
import { UnitSelect } from './GeometriaTool';

const DEFAULTS = { n: '5', modo: 'lato', a: '10', b: '', u: 'cm' };

export function PoligoniRegolariTool() {
	const [state, set] = useToolState(DEFAULTS);
	const n = polygonBySides(Number(state.n)) ? Number(state.n) : 5;
	const mode = POLYGON_MODES.find((m) => m.value === state.modo)?.value ?? 'lato';
	const unit = isUnit(state.u) ? state.u : '';
	const { outcome, sketch } = useMemo(() => poligonoRegolare(n, mode, { a: state.a, b: state.b }, unit), [n, mode, state.a, state.b, unit]);
	const name = polygonBySides(n)!.name;
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToolField label="Poligono regolare">
						<select className={toolInputClass} value={String(n)} onChange={(e) => set({ n: e.target.value })}>
							{POLYGONS.map((p) => (
								<option key={p.n} value={p.n}>
									{p.name} ({p.n} lati)
								</option>
							))}
						</select>
					</ToolField>
					<ModeSwitch<PolygonMode> label="Che cosa conosci" options={POLYGON_MODES.map((m) => ({ value: m.value, label: m.label }))} value={mode} onChange={(m) => set({ modo: m, ...POLYGON_MODES.find((x) => x.value === m)!.example })} />
					<div className="grid grid-cols-2 gap-3">
						{mode !== 'apotema' && (
							<ToolField label="Lato (l)">
								<input className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={state.a} onChange={(e) => set({ a: e.target.value })} />
							</ToolField>
						)}
						{mode !== 'lato' && (
							<ToolField label="Apotema (a)">
								<input className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={state.b} onChange={(e) => set({ b: e.target.value })} />
							</ToolField>
						)}
						<UnitSelect value={unit} onChange={(u) => set({ u })} />
					</div>
					<p className="text-xs text-fg-subtle">L&apos;apotema è la distanza dal centro a un lato. Per i decimali puoi usare la virgola: 7,5.</p>
					{sketch && <FigureSketch sketch={sketch} title={`Disegno: ${name} con lato e apotema`} />}
					<Examples items={POLYGON_EXAMPLES.map((x) => ({ label: x.label, apply: () => set({ n: String(x.n), modo: x.mode, a: x.a, b: x.b }) }))} />
				</>
			}
		/>
	);
}
