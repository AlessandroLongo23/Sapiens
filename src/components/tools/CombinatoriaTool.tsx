'use client';

import { useMemo } from 'react';
import { combinatoria, fattoriale, type ComboMode } from '@/lib/tools/combinatoria';
import { Examples, ModeSwitch, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

/** The factorial page: one number. */
export function FattorialeTool() {
	const [state, set] = useToolState({ n: '10' });
	const outcome = useMemo(() => fattoriale(state.n), [state.n]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToolField label="Numero (n)" hint="Un numero intero da 0 a 400.">
						<input className={toolInputClass} inputMode="numeric" autoComplete="off" spellCheck={false} value={state.n} onChange={(e) => set({ n: e.target.value })} />
					</ToolField>
					<Examples items={['0', '5', '7', '20', '52'].map((n) => ({ label: `${n}!`, apply: () => set({ n }) }))} />
				</>
			}
		/>
	);
}

/** The Superenalotto: 90 numbers, 6 drawn. */
const DEFAULTS = { modo: 'comb', n: '90', k: '6', r: 'MATEMATICA' };

const MODES: { value: ComboMode; label: string }[] = [
	{ value: 'perm', label: 'Permutazioni' },
	{ value: 'permrip', label: 'Permutazioni con ripetizione' },
	{ value: 'disp', label: 'Disposizioni' },
	{ value: 'disprip', label: 'Disposizioni con ripetizione' },
	{ value: 'comb', label: 'Combinazioni' },
	{ value: 'combrip', label: 'Combinazioni con ripetizione' }
];

const EXAMPLES: Record<ComboMode, { label: string; patch: Partial<typeof DEFAULTS> }[]> = {
	perm: [
		{ label: '5 libri in fila', patch: { n: '5' } },
		{ label: '8 corridori', patch: { n: '8' } }
	],
	permrip: [
		{ label: 'MATEMATICA', patch: { r: 'MATEMATICA' } },
		{ label: 'ANNA', patch: { r: 'ANNA' } },
		{ label: '3 2 2', patch: { r: '3 2 2' } }
	],
	disp: [
		{ label: 'podio: 8 e 3', patch: { n: '8', k: '3' } },
		{ label: '7 e 3', patch: { n: '7', k: '3' } }
	],
	disprip: [
		{ label: 'PIN: 10 e 4', patch: { n: '10', k: '4' } },
		{ label: 'schedina: 3 e 14', patch: { n: '3', k: '14' } }
	],
	comb: [
		{ label: 'Superenalotto: 90 e 6', patch: { n: '90', k: '6' } },
		{ label: '10 e 3', patch: { n: '10', k: '3' } },
		{ label: '10 e 8', patch: { n: '10', k: '8' } }
	],
	combrip: [
		{ label: 'gelato: 4 gusti e 3 palline', patch: { n: '4', k: '3' } },
		{ label: '6 e 2', patch: { n: '6', k: '2' } }
	]
};

const isMode = (m: string): m is ComboMode => MODES.some((x) => x.value === m);

export function CombinatoriaTool() {
	const [state, set] = useToolState(DEFAULTS);
	const mode = isMode(state.modo) ? state.modo : 'comb';
	const outcome = useMemo(() => combinatoria(mode, state.n, state.k, state.r), [mode, state.n, state.k, state.r]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ModeSwitch label="Che cosa vuoi calcolare" options={MODES} value={mode} onChange={(m) => set({ modo: m })} />
					{mode === 'permrip' ? (
						<ToolField label="Parola, o quante volte si ripete ogni oggetto" hint="Una parola per contarne gli anagrammi, oppure numeri come 3 2 2: tre oggetti uguali, poi due, poi altri due.">
							<input className={toolInputClass} autoComplete="off" spellCheck={false} value={state.r} onChange={(e) => set({ r: e.target.value })} />
						</ToolField>
					) : (
						<div className="grid grid-cols-2 gap-3">
							<ToolField label="Oggetti (n)">
								<input className={toolInputClass} inputMode="numeric" autoComplete="off" value={state.n} onChange={(e) => set({ n: e.target.value })} />
							</ToolField>
							{mode !== 'perm' && (
								<ToolField label="Classe (k)">
									<input className={toolInputClass} inputMode="numeric" autoComplete="off" value={state.k} onChange={(e) => set({ k: e.target.value })} />
								</ToolField>
							)}
						</div>
					)}
					{mode !== 'perm' && mode !== 'permrip' && <p className="text-xs text-fg-subtle">La classe k è quanti oggetti scegli, o quanti posti riempi.</p>}
					<Examples items={EXAMPLES[mode].map((x) => ({ label: x.label, apply: () => set(x.patch) }))} />
				</>
			}
		/>
	);
}
