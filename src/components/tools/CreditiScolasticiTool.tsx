'use client';

import { useMemo } from 'react';
import { creditiScolastici, YEARS } from '@/lib/tools/crediti-scolastici';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { m3: '7,4', m4: '8', m5: '8,5', c3: '9', c4: '8', c5: '9' };

const EMPTY = { m3: '', m4: '', m5: '', c3: '', c4: '', c5: '' };
const EXAMPLES = [
	{ label: 'Solo il terzo anno: 6,8', ...EMPTY, m3: '6,8' },
	{ label: '7,5 · 7,8 · 8,2', ...EMPTY, m3: '7,5', m4: '7,8', m5: '8,2' },
	{ label: 'Tutti 10 con 10 in condotta', m3: '10', m4: '10', m5: '10', c3: '10', c4: '10', c5: '10' }
];

type Key = keyof typeof DEFAULTS;

export function CreditiScolasticiTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(
		() =>
			creditiScolastici({
				3: { media: state.m3, condotta: state.c3 },
				4: { media: state.m4, condotta: state.c4 },
				5: { media: state.m5, condotta: state.c5 }
			}),
		[state.m3, state.m4, state.m5, state.c3, state.c4, state.c5]
	);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<p className="text-sm text-fg-muted">La media dei voti dello scrutinio finale di ogni anno e, se lo conosci, il voto di comportamento. Lascia vuoti gli anni che non hai ancora fatto.</p>
					{YEARS.map(({ year, name }) => {
						const m = `m${year}` as Key;
						const c = `c${year}` as Key;
						return (
							<fieldset key={year} className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-3">
								<legend className="sr-only">{`${name[0].toUpperCase()}${name.slice(1)} anno`}</legend>
								<ToolField label={`Media ${name} anno`}>
									<input className={toolInputClass} inputMode="decimal" autoComplete="off" placeholder="7,4" value={state[m]} onChange={(e) => set({ [m]: e.target.value })} />
								</ToolField>
								<ToolField label="Comportamento">
									<input className={toolInputClass} inputMode="numeric" autoComplete="off" placeholder="9" value={state[c]} onChange={(e) => set({ [c]: e.target.value })} />
								</ToolField>
							</fieldset>
						);
					})}
					<Examples items={EXAMPLES.map(({ label, ...e }) => ({ label, apply: () => set(e) }))} />
				</>
			}
		/>
	);
}
