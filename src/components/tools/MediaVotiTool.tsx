'use client';

import { useMemo } from 'react';
import { mediaVoti, votoCheServe, type GradeMode } from '@/lib/tools/media-voti';
import { Examples, ModeSwitch, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { modo: 'media', voti: '6+ 7- 5½ 7/8 8', pesi: '', obiettivo: '7', quanti: '1', peso: '' };

const MODES: { value: GradeMode; label: string }[] = [
	{ value: 'media', label: 'Media dei voti' },
	{ value: 'serve', label: 'Che voto mi serve' }
];

const AVERAGE_EXAMPLES = [
	{ voti: '6+ 7- 5½', pesi: '' },
	{ voti: '6 e mezzo 7/8 5-', pesi: '' },
	{ voti: '4 6 7', pesi: '1 1 2' }
];
const TARGET_EXAMPLES = [
	{ voti: '4 5', pesi: '', obiettivo: '6', quanti: '1' },
	{ voti: '5 5½ 6-', pesi: '', obiettivo: '6', quanti: '2' },
	{ voti: '3 4', pesi: '', obiettivo: '7', quanti: '1' }
];

export function MediaVotiTool() {
	const [state, set] = useToolState(DEFAULTS);
	const mode: GradeMode = state.modo === 'serve' ? 'serve' : 'media';
	const outcome = useMemo(
		() => (mode === 'serve' ? votoCheServe({ grades: state.voti, weights: state.pesi, target: state.obiettivo, count: state.quanti, nextWeight: state.peso }) : mediaVoti(state.voti, state.pesi)),
		[mode, state.voti, state.pesi, state.obiettivo, state.quanti, state.peso]
	);
	const weighted = state.pesi.trim() !== '';
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ModeSwitch label="Che cosa vuoi calcolare" options={MODES} value={mode} onChange={(m) => set({ modo: m })} />
					<ToolField label={mode === 'serve' ? 'I voti che hai già' : 'Voti'} hint="Separati da uno spazio: 6+ vale 6,25, 6- vale 5,75, 6½ (o 6 e mezzo) vale 6,5, 7/8 vale 7,5.">
						<input className={toolInputClass} autoComplete="off" spellCheck={false} value={state.voti} onChange={(e) => set({ voti: e.target.value })} />
					</ToolField>
					<ToolField label="Pesi (facoltativi)" hint="Uno per ogni voto, nello stesso ordine: 1 1 2, oppure 50% 100%. Lascia vuoto se i voti contano tutti uguale.">
						<input className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={state.pesi} onChange={(e) => set({ pesi: e.target.value })} />
					</ToolField>
					{mode === 'serve' && (
						<div className="grid grid-cols-2 gap-3">
							<ToolField label="Media che vuoi">
								<input className={toolInputClass} inputMode="decimal" autoComplete="off" value={state.obiettivo} onChange={(e) => set({ obiettivo: e.target.value })} />
							</ToolField>
							<ToolField label="Voti che mancano">
								<input className={toolInputClass} inputMode="numeric" autoComplete="off" value={state.quanti} onChange={(e) => set({ quanti: e.target.value })} />
							</ToolField>
							{weighted && (
								<ToolField label="Peso di ciascuno">
									<input className={toolInputClass} inputMode="decimal" autoComplete="off" placeholder="1" value={state.peso} onChange={(e) => set({ peso: e.target.value })} />
								</ToolField>
							)}
						</div>
					)}
					{mode === 'serve' ? (
						<Examples items={TARGET_EXAMPLES.map((x) => ({ label: `${x.voti} → ${x.obiettivo}`, apply: () => set(x) }))} />
					) : (
						<Examples items={AVERAGE_EXAMPLES.map((x) => ({ label: x.pesi ? `${x.voti} | ${x.pesi}` : x.voti, apply: () => set(x) }))} />
					)}
				</>
			}
		/>
	);
}
