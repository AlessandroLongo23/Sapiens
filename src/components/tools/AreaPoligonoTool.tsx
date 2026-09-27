'use client';

import { useMemo } from 'react';
import { Plus, X } from 'lucide-react';
import { MAX_VERTICES, areaPoligono, type Vertex } from '@/lib/tools/area-poligono';
import { Examples, ToolSheet, toolInputClass, useToolState } from './ToolSheet';
import { CartesianSketch } from './CartesianSketch';

const NAMES = 'ABCDEFGHIJKL';

/** The vertices in the address, short: "-2;1|3;-1|6;2". */
const encode = (vs: Vertex[]) => vs.map((v) => `${v.x};${v.y}`).join('|');
const decode = (s: string): Vertex[] =>
	s.split('|').map((p) => {
		const [x = '', y = ''] = p.split(';');
		return { x, y };
	});
/** The two separators of the address cannot be typed in a field. */
const clean = (s: string) => s.replace(/[;|]/g, '');

const DEFAULTS = { v: '-2;1|3;-1|6;2|4;5|0;4' };

const EXAMPLES: { label: string; v: string }[] = [
	{ label: 'triangolo', v: '0;0|4;0|1;3' },
	{ label: 'quadrilatero', v: '1;1|5;2|4;6|0;4' },
	{ label: 'in senso orario', v: '0;0|0;3|4;0' },
	{ label: 'esagono', v: '2;0|5;1|6;4|4;6|1;5|0;2' }
];

export function AreaPoligonoTool() {
	const [state, set] = useToolState(DEFAULTS);
	const vertices = useMemo(() => decode(state.v), [state.v]);
	const { outcome, plot } = useMemo(() => areaPoligono(vertices), [vertices]);
	const update = (i: number, patch: Partial<Vertex>) => set({ v: encode(vertices.map((v, j) => (j === i ? { ...v, ...patch } : v))) });
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<p className="text-sm text-fg-muted">Scrivi i vertici nell&apos;ordine in cui li incontri girando intorno al poligono.</p>
					<div className="flex flex-col gap-2">
						<div className="grid grid-cols-[2rem_1fr_1fr_2.5rem] items-center gap-2 label-mono text-fg-subtle">
							<span aria-hidden="true" />
							<span>x</span>
							<span>y</span>
							<span aria-hidden="true" />
						</div>
						{vertices.map((v, i) => (
							<div key={i} className="grid grid-cols-[2rem_1fr_1fr_2.5rem] items-center gap-2">
								<span className="font-mono text-lg text-fg-muted">{NAMES[i]}</span>
								<input aria-label={`Ascissa di ${NAMES[i]}`} className={toolInputClass} inputMode="text" autoComplete="off" spellCheck={false} value={v.x} onChange={(e) => update(i, { x: clean(e.target.value) })} />
								<input aria-label={`Ordinata di ${NAMES[i]}`} className={toolInputClass} inputMode="text" autoComplete="off" spellCheck={false} value={v.y} onChange={(e) => update(i, { y: clean(e.target.value) })} />
								<button
									type="button"
									aria-label={`Togli il vertice ${NAMES[i]}`}
									title={`Togli il vertice ${NAMES[i]}`}
									disabled={vertices.length <= 3}
									onClick={() => set({ v: encode(vertices.filter((_, j) => j !== i)) })}
									className="flex size-10 items-center justify-center rounded-lg text-fg-subtle transition-colors hover:bg-surface-3 hover:text-fg focus-ring disabled:opacity-40 disabled:hover:bg-transparent"
								>
									<X className="size-4" aria-hidden="true" />
								</button>
							</div>
						))}
					</div>
					{vertices.length < MAX_VERTICES && (
						<button type="button" onClick={() => set({ v: encode([...vertices, { x: '', y: '' }]) })} className="flex w-fit items-center gap-1.5 rounded-lg border border-edge bg-surface px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:border-edge-strong hover:text-fg focus-ring">
							<Plus className="size-4" aria-hidden="true" />
							Aggiungi il vertice {NAMES[vertices.length]}
						</button>
					)}
					<p className="text-xs text-fg-subtle">Interi, decimali con la virgola (1,5) o frazioni (2/3).</p>
					{plot && <CartesianSketch plot={plot} title="Il poligono nel piano cartesiano, con i vertici" />}
					<Examples items={EXAMPLES.map((x) => ({ label: x.label, apply: () => set({ v: x.v }) }))} />
				</>
			}
		/>
	);
}
