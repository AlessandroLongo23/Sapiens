'use client';

import { useMemo } from 'react';
import { divisionePolinomi, parsePolynomial, regolaRuffini } from '@/lib/tools/polinomi';
import { prodottiNotevoli } from '@/lib/tools/prodotti-notevoli';
import { scomposizionePolinomi } from '@/lib/tools/scomposizione-polinomi';
import { tex } from '@/lib/tools/tex';
import { Html } from '@/components/ui/Html';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

/**
 * The polynomial tools: special products, division in column, Ruffini's rule, factoring. One engine for the
 * polynomials (src/lib/tools/polinomi.ts), one component per page.
 */

const HINT = 'Scrivi 2x per 2 per x, x^2 per il quadrato, 1/2 x per le frazioni. Per i decimali usa la virgola: 0,5x.';

/** A polynomial typed as text, typeset under the field as the student types, so a missing bracket shows at once. */
function PolyField({ label, value, onChange, placeholder, hint = HINT }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; hint?: string }) {
	const latex = useMemo(() => parsePolynomial(value).latex ?? null, [value]);
	const preview = useMemo(() => (latex ? tex(latex, true) : ''), [latex]);
	return (
		<>
			<ToolField label={label} hint={hint}>
				<input className={toolInputClass} inputMode="text" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
			</ToolField>
			<div aria-label={`Anteprima: ${label.toLowerCase()}`} className="min-h-[3.25rem] overflow-x-auto rounded-xl border border-dashed border-edge bg-surface-2 px-3 py-2 text-fg-strong">
				{preview ? <Html html={preview} className="math-content" /> : <p className="py-1.5 text-sm text-fg-faint">Qui vedi il polinomio come l&apos;hai scritto.</p>}
			</div>
		</>
	);
}

const PRODUCT = { p: '(2x - 3)^2' };

export function ProdottiNotevoliTool() {
	const [state, set] = useToolState(PRODUCT);
	const outcome = useMemo(() => prodottiNotevoli(state.p), [state.p]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<PolyField label="Prodotto notevole" value={state.p} onChange={(p) => set({ p })} placeholder="(2x - 3)^2" hint="Le parentesi con i monomi e l'esponente: (x + 4)^2, (x - 1)^3, (2x + 1)(2x - 1). Usa la lettera x." />
					<Examples items={['(x + 5)(x - 5)', '(x - 2)^3', '(x^2 + x - 1)^2', '(1/2 x + 4)^2'].map((p) => ({ label: p, apply: () => set({ p }) }))} />
				</>
			}
		/>
	);
}

const DIVISION = { a: 'x^4 - 3x^2 + 2x - 5', b: 'x^2 + x - 1' };

export function DivisionePolinomiTool() {
	const [state, set] = useToolState(DIVISION);
	const outcome = useMemo(() => divisionePolinomi(state.a, state.b), [state.a, state.b]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<PolyField label="Dividendo" value={state.a} onChange={(a) => set({ a })} placeholder="x^3 - 2x + 5" />
					<PolyField label="Divisore" value={state.b} onChange={(b) => set({ b })} placeholder="x - 2" hint="Un polinomio con la x, di grado non più alto del dividendo." />
					<Examples
						items={[
							['6x^3 - 5x^2 + 4', '2x - 3'],
							['x^3 - 8', 'x - 2'],
							['2x^4 + x^3 - x + 1', 'x^2 + 1'],
							['x^3 + 2x^2 - x', '3x + 1']
						].map(([a, b]) => ({ label: `(${a}) : (${b})`, apply: () => set({ a, b }) }))}
					/>
				</>
			}
		/>
	);
}

const RUFFINI = { a: '2x^3 - 7x^2 + 5', b: 'x - 3' };

export function RuffiniTool() {
	const [state, set] = useToolState(RUFFINI);
	const outcome = useMemo(() => regolaRuffini(state.a, state.b), [state.a, state.b]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<PolyField label="Dividendo" value={state.a} onChange={(a) => set({ a })} placeholder="x^3 - 2x + 5" />
					<PolyField label="Divisore" value={state.b} onChange={(b) => set({ b })} placeholder="x - 2" hint="Un binomio della forma x - a, come x - 2 o x + 3." />
					<Examples
						items={[
							['x^3 - 6x^2 + 11x - 6', 'x - 1'],
							['x^4 - 16', 'x + 2'],
							['3x^3 + 2x - 1', 'x + 1'],
							['x^3 - 8', 'x - 1/2']
						].map(([a, b]) => ({ label: `(${a}) : (${b})`, apply: () => set({ a, b }) }))}
					/>
				</>
			}
		/>
	);
}

const FACTORING = { p: 'x^3 - 2x^2 - 5x + 6' };

export function ScomposizionePolinomiTool() {
	const [state, set] = useToolState(FACTORING);
	const outcome = useMemo(() => scomposizionePolinomi(state.p), [state.p]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<PolyField label="Polinomio" value={state.p} onChange={(p) => set({ p })} placeholder="x^2 - 5x + 6" />
					<Examples items={['3x^3 - 12x', 'x^4 - 16', '4x^2 - 12x + 9', '6x^3 + 7x^2 - x - 2'].map((p) => ({ label: p, apply: () => set({ p }) }))} />
				</>
			}
		/>
	);
}
