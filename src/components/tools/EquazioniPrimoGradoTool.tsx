'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { equazionePrimoGrado } from '@/lib/tools/equazioni-primo-grado';
import { parseEquation } from '@/lib/tools/equazione';
import { TOOLS_ROOT } from '@/lib/tools/registry';
import { tex } from '@/lib/tools/tex';
import { Html } from '@/components/ui/Html';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const DEFAULTS = { eq: '3(x - 2) + 1 = x/2 + 4' };

const HINT = 'Scrivi 2x per 2 per x, x/2 per le frazioni, x^2 per il quadrato. Per i decimali usa la virgola: 0,5x.';

/**
 * The field for an equation typed as text, with the equation typeset under it as the student types, so a missing
 * bracket shows at once. Shared by the two equation tools.
 */
export function EquationField({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
	const parsed = useMemo(() => parseEquation(value), [value]);
	const latex = parsed.ok ? parsed.eq.latex : parsed.latex;
	const preview = useMemo(() => (latex ? tex(latex, true) : ''), [latex]);
	return (
		<>
			<ToolField label="Equazione" hint={HINT}>
				<input className={toolInputClass} inputMode="text" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
			</ToolField>
			<div aria-label="Anteprima dell'equazione" className="min-h-[3.25rem] overflow-x-auto rounded-xl border border-dashed border-edge bg-surface-2 px-3 py-2 text-fg-strong">
				{preview ? <Html html={preview} className="math-content" /> : <p className="py-1.5 text-sm text-fg-faint">Qui vedi l&apos;equazione come l&apos;hai scritta.</p>}
			</div>
		</>
	);
}

/** A link to the other equation tool, with the same equation already filled in. */
export function OtherToolLink({ slug, query, label }: { slug: string; query: Record<string, string>; label: string }) {
	return (
		<Link href={`${TOOLS_ROOT}/${slug}?${new URLSearchParams(query).toString()}`} className="inline-flex items-center gap-1.5 self-start rounded-full border border-accent-edge bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent-soft-fg transition-colors hover:border-accent focus-ring">
			{label}
			<ArrowRight className="size-4" aria-hidden="true" />
		</Link>
	);
}

export function EquazioniPrimoGradoTool() {
	const [state, set] = useToolState(DEFAULTS);
	const outcome = useMemo(() => equazionePrimoGrado(state.eq), [state.eq]);
	const degree = useMemo(() => {
		const parsed = parseEquation(state.eq);
		return parsed.ok ? parsed.eq.degree : null;
	}, [state.eq]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<EquationField value={state.eq} onChange={(eq) => set({ eq })} placeholder="2x + 3 = 7" />
					{degree === 2 && <OtherToolLink slug="equazioni-secondo-grado" query={{ modo: 'eq', eq: state.eq }} label="Risolvila come equazione di secondo grado" />}
					<Examples items={['2x + 3 = 7', 'x/2 + 1/3 = x - 1', '2(x + 1) = 2x + 5', '0,5x - 1 = 3(x - 2)'].map((eq) => ({ label: eq, apply: () => set({ eq }) }))} />
				</>
			}
		/>
	);
}
