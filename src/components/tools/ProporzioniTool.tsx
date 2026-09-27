'use client';

import { useMemo } from 'react';
import { proporzione } from '@/lib/tools/proporzioni';
import { Examples, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { a: '4', b: '6', c: 'x', d: '15' };

const TERMS = [
	{ key: 'a', label: 'Primo termine', after: ':' },
	{ key: 'b', label: 'Secondo termine', after: '=' },
	{ key: 'c', label: 'Terzo termine', after: ':' },
	{ key: 'd', label: 'Quarto termine', after: '' }
] as const;

const EXAMPLES = [
	{ a: '3', b: '5', c: '9', d: 'x' },
	{ a: 'x', b: '8', c: '15', d: '24' },
	{ a: '2,5', b: 'x', c: '1/3', d: '4' },
	{ a: '7', b: '2', c: 'x', d: '3' }
];

export function ProporzioniTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(() => proporzione(state), [state]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<div role="group" aria-label="Proporzione" className="flex flex-col gap-1.5">
						<span className="label-mono text-fg-subtle">Proporzione</span>
						<div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5">
							{TERMS.map((t) => (
								<div key={t.key} className="contents">
									<input
										aria-label={t.label}
										className={`${toolInputClass} px-1.5 text-center`}
										inputMode="text"
										autoComplete="off"
										spellCheck={false}
										value={state[t.key]}
										onChange={(e) => set({ [t.key]: e.target.value })}
									/>
									{t.after && (
										<span className="font-mono text-lg text-fg-muted" aria-hidden="true">
											{t.after}
										</span>
									)}
								</div>
							))}
						</div>
						<span className="text-xs text-fg-subtle">Lascia vuoto o scrivi x nel termine da trovare. Puoi usare decimali con la virgola (2,5) e frazioni (1/3).</span>
					</div>
					<Examples items={EXAMPLES.map((x) => ({ label: `${x.a} : ${x.b} = ${x.c} : ${x.d}`, apply: () => set(x) }))} />
				</>
			}
		/>
	);
}
