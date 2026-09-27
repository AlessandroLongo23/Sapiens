'use client';

import { useMemo } from 'react';
import { mediaUniversitaria, votoLaurea, type LaureaMode } from '@/lib/tools/media-universitaria';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { cn } from '@/lib/utils/cn';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const EXAMS_HINT = 'Un esame per riga: il voto e i CFU, per esempio 28 9. Il 30 e lode si scrive 30L. Gli esami senza voto (idoneità) non contano.';
const LODE_HINT = 'Di solito vale 30. Alcuni atenei la contano 31, 32 o 33.';

function ExamsField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	return (
		<ToolField label="Esami" hint={EXAMS_HINT}>
			<textarea className={cn(toolInputClass, 'min-h-[9rem] resize-y leading-snug')} rows={6} autoComplete="off" spellCheck={false} value={value} onChange={(e) => onChange(e.target.value)} />
		</ToolField>
	);
}

function LodeField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	return (
		<ToolField label="Valore della lode" hint={LODE_HINT}>
			<input className={toolInputClass} inputMode="decimal" autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
		</ToolField>
	);
}

const MEAN_DEFAULTS = { esami: '28 9\n30L 6\n25 12\n27 6\n30 9\n24 6', lode: '30' };

const MEAN_EXAMPLES = [
	{ label: '3 esami', esami: '26 6\n29 12\n23 9', lode: '30' },
	{ label: 'lode = 33', esami: '30L 6\n28 12\n30L 9\n27 6', lode: '33' },
	{ label: 'CFU diversi', esami: '18 12\n30 3\n27 6', lode: '30' }
];

export function MediaPonderataUniversitariaTool() {
	const [state, set] = useToolState(MEAN_DEFAULTS);
	const outcome = useMemo(() => mediaUniversitaria(state.esami, state.lode), [state.esami, state.lode]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ExamsField value={state.esami} onChange={(v) => set({ esami: v })} />
					<LodeField value={state.lode} onChange={(v) => set({ lode: v })} />
					<Examples items={MEAN_EXAMPLES.map(({ label, ...e }) => ({ label, apply: () => set(e) }))} />
				</>
			}
		/>
	);
}

const LAUREA_DEFAULTS = { modo: 'esami', esami: '28 9\n30L 6\n25 12\n27 6\n30 9\n24 6', lode: '30', media: '27,5', tesi: '5' };

const LAUREA_EXAMPLES = [
	{ label: 'media 27 + 4', modo: 'media', media: '27', tesi: '4' },
	{ label: 'media 29,5 + 6', modo: 'media', media: '29,5', tesi: '6' },
	{ label: 'media 24,8 + 3', modo: 'media', media: '24,8', tesi: '3' }
];

export function VotoLaureaTool() {
	const [state, set] = useToolState(LAUREA_DEFAULTS);
	const mode: LaureaMode = state.modo === 'media' ? 'media' : 'esami';
	const outcome = useMemo(
		() => votoLaurea({ modo: mode, esami: state.esami, lode: state.lode, media: state.media, tesi: state.tesi }),
		[mode, state.esami, state.lode, state.media, state.tesi]
	);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToggleGroup
						label="Da dove parti"
						options={[
							{ value: 'esami', label: 'Dagli esami' },
							{ value: 'media', label: 'Dalla media' }
						]}
						value={mode}
						onChange={(v) => set({ modo: v })}
					/>
					{mode === 'esami' ? (
						<>
							<ExamsField value={state.esami} onChange={(v) => set({ esami: v })} />
							<LodeField value={state.lode} onChange={(v) => set({ lode: v })} />
						</>
					) : (
						<ToolField label="Media ponderata in trentesimi" hint="Per esempio 27,5. La trovi nel libretto online.">
							<input className={toolInputClass} inputMode="decimal" autoComplete="off" value={state.media} onChange={(e) => set({ media: e.target.value })} />
						</ToolField>
					)}
					<ToolField label="Punti della tesi e bonus" hint="Li decide il tuo ateneo, di solito da 0 a 8. Lascia vuoto se non li sai.">
						<input className={toolInputClass} inputMode="decimal" autoComplete="off" value={state.tesi} onChange={(e) => set({ tesi: e.target.value })} />
					</ToolField>
					<Examples items={LAUREA_EXAMPLES.map(({ label, ...e }) => ({ label, apply: () => set(e) }))} />
				</>
			}
		/>
	);
}
