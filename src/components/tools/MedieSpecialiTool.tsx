'use client';

import { useMemo } from 'react';
import { medieSpeciali, type MeanMode } from '@/lib/tools/medie-speciali';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

/**
 * The geometric, harmonic and quadratic means: one tool, three pages (one per search), each opening on its own mean
 * with an example that gives interesting steps: a cube root that simplifies, the classic average speed, a square root
 * of a sum with a negative value.
 */

const EXAMPLES: Record<MeanMode, string[]> = {
	geometrica: ['4 9', '2 8 4', '1,1 1,5 1,2', '3 5 7 11'],
	armonica: ['2 3 6', '1 2 4', '12 15 20', '0,5 2'],
	quadratica: ['4 4 8 8', '1 7', '3 4', '-1 1']
};

const DEFAULTS: Record<MeanMode, { modo: string; n: string }> = {
	geometrica: { modo: 'geometrica', n: '2 6 9' },
	armonica: { modo: 'armonica', n: '60 40' },
	quadratica: { modo: 'quadratica', n: '-4 2 6 8' }
};

const HINTS: Record<MeanMode, string> = {
	geometrica: 'Da 2 a 30 numeri maggiori di zero, separati da uno spazio. Per i decimali usa la virgola: 1,5.',
	armonica: 'Da 2 a 30 numeri maggiori di zero, separati da uno spazio. Per i decimali usa la virgola: 1,5.',
	quadratica: 'Da 2 a 30 numeri, anche negativi, separati da uno spazio. Per i decimali usa la virgola: 1,5.'
};

function MedieTool({ initial }: { initial: MeanMode }) {
	const [state, set] = useToolState(DEFAULTS[initial]);
	const mode: MeanMode = state.modo === 'armonica' || state.modo === 'quadratica' ? state.modo : 'geometrica';
	const outcome = useMemo(() => medieSpeciali(mode, state.n), [mode, state.n]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToggleGroup
						label="Che media vuoi calcolare"
						options={[
							{ value: 'geometrica', label: 'Geometrica' },
							{ value: 'armonica', label: 'Armonica' },
							{ value: 'quadratica', label: 'Quadratica' }
						]}
						value={mode}
						onChange={(v) => set({ modo: v })}
					/>
					<ToolField label="Numeri" hint={HINTS[mode]}>
						<input className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={state.n} onChange={(e) => set({ n: e.target.value })} />
					</ToolField>
					<Examples items={EXAMPLES[mode].map((n) => ({ label: n, apply: () => set({ n }) }))} />
				</>
			}
		/>
	);
}

export const MediaGeometricaTool = () => <MedieTool initial="geometrica" />;
export const MediaArmonicaTool = () => <MedieTool initial="armonica" />;
export const MediaQuadraticaTool = () => <MedieTool initial="quadratica" />;
