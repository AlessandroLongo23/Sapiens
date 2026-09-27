'use client';

import { useMemo } from 'react';
import { frequenze } from '@/lib/tools/frequenze';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

/** The number of brothers and sisters of 20 students, as in the lesson "Dati, frequenze e grafici": 4, 9, 5 and 2. */
const DEFAULTS = { d: '1 0 2 1 1 3 0 1 2 1 0 1 2 1 1 0 3 2 1 2', c: '', da: '' };

const EXAMPLES = [
	{ label: 'colori', d: 'rosso blu verde blu rosso blu giallo verde blu', c: '', da: '' },
	{ label: 'altezze in classi', d: '172 158 165 181 169 174 160 155 177 163 188 170 166 172 152 183 161 176 168 179', c: '10', da: '' },
	{ label: 'voti', d: '6 7 5 6 8 6 7 4 6 9 7 6', c: '', da: '' },
	{ label: 'sport', d: 'calcio, pallavolo, calcio, basket, nuoto, calcio, pallavolo', c: '', da: '' }
];

export function FrequenzeTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(() => frequenze(state.d, state.c, state.da), [state.d, state.c, state.da]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToolField label="Dati" hint="Numeri o parole, separati da uno spazio. Le parole di più termini separale con la virgola: occhi azzurri, occhi neri.">
						<textarea className={`${toolInputClass} min-h-24 resize-y`} rows={3} autoComplete="off" spellCheck={false} value={state.d} onChange={(e) => set({ d: e.target.value })} />
					</ToolField>
					<div className="grid grid-cols-2 gap-3">
						<ToolField label="Ampiezza delle classi" hint="Facoltativa, solo per i numeri.">
							<input className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={state.c} placeholder="10" onChange={(e) => set({ c: e.target.value })} />
						</ToolField>
						{state.c.trim() && (
							<ToolField label="Prima classe da" hint="Se vuoto, un multiplo dell'ampiezza.">
								<input className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={state.da} onChange={(e) => set({ da: e.target.value })} />
							</ToolField>
						)}
					</div>
					<Examples items={EXAMPLES.map(({ label, ...x }) => ({ label, apply: () => set(x) }))} />
				</>
			}
		/>
	);
}
