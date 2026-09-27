'use client';

import { useMemo } from 'react';
import { biquadDegree, equazioneBiquadratica, type BiquadInput } from '@/lib/tools/equazioni-biquadratiche';
import { equazioneValoreAssoluto, previewValoreAssoluto } from '@/lib/tools/equazioni-valore-assoluto';
import { previewFratta, risolviEquazioneFratta } from '@/lib/tools/equazioni-fratte';
import { previewDisequazioneFratta, risolviDisequazioneFratta } from '@/lib/tools/disequazioni-fratte';
import { isRel, type Rel } from '@/lib/tools/disequazioni';
import { parseEquation } from '@/lib/tools/equazione';
import { tex } from '@/lib/tools/tex';
import { Html } from '@/components/ui/Html';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { NumberLineSketch } from './DisequazioniTool';
import { EquationField, OtherToolLink } from './EquazioniPrimoGradoTool';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

/** The typeset preview under a field, or a hint while nothing parses yet. */
function Preview({ latex, label, empty }: { latex: string | null; label: string; empty: string }) {
	const html = useMemo(() => (latex ? tex(latex, true) : ''), [latex]);
	return (
		<div aria-label={label} className="min-h-[3.25rem] overflow-x-auto rounded-xl border border-dashed border-edge bg-surface-2 px-3 py-2 text-fg-strong">
			{html ? <Html html={html} className="math-content" /> : <p className="py-1.5 text-sm text-fg-faint">{empty}</p>}
		</div>
	);
}

/** A text field for a formula, with its preview. */
function FormulaField({ label, hint, value, onChange, placeholder, latex, empty }: { label: string; hint: string; value: string; onChange: (v: string) => void; placeholder: string; latex: string | null; empty: string }) {
	return (
		<>
			<ToolField label={label} hint={hint}>
				<input className={toolInputClass} inputMode="text" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
			</ToolField>
			<Preview latex={latex} label={`Anteprima: ${label.toLowerCase()}`} empty={empty} />
		</>
	);
}

// ---------------------------------------------------------------------------
// Fractional equations

const FRATTE_DEFAULTS = { eq: 'x/(x + 1) - 1/(x - 1) = 2/(x^2 - 1)' };

export function EquazioniFratteTool() {
	const [state, set] = useToolState(FRATTE_DEFAULTS);
	const { outcome } = useMemo(() => risolviEquazioneFratta(state.eq), [state.eq]);
	const latex = useMemo(() => previewFratta(state.eq), [state.eq]);
	// No x in a denominator: the equation is for the other tools.
	const integer = useMemo(() => {
		const p = parseEquation(state.eq);
		return p.ok ? p.eq.degree : null;
	}, [state.eq]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<FormulaField
						label="Equazione"
						hint="Ogni frazione con la barra /, il denominatore tra parentesi: 3/(x - 2). Per il quadrato x^2."
						value={state.eq}
						onChange={(eq) => set({ eq })}
						placeholder="3/(x - 2) = 5/x"
						latex={latex}
						empty="Qui vedi l'equazione come l'hai scritta."
					/>
					{integer !== null && integer <= 1 && <OtherToolLink slug="equazioni-primo-grado" query={{ eq: state.eq }} label="Risolvila come equazione di primo grado" />}
					{integer === 2 && <OtherToolLink slug="equazioni-secondo-grado" query={{ modo: 'eq', eq: state.eq }} label="Risolvila come equazione di secondo grado" />}
					<Examples items={['3/(x - 2) = 5/x', 'x/(x - 2) = 2/(x - 2)', '2/x + 1/(2x) = 5/4', '(x - 1)/(x + 1) = (x + 2)/(x + 3)'].map((eq) => ({ label: eq, apply: () => set({ eq }) }))} />
				</>
			}
		/>
	);
}

// ---------------------------------------------------------------------------
// Biquadratic equations

const BIQUAD_DEFAULTS = { modo: 'coef', a: '1', b: '-3', c: '-4', eq: 'x^4 = 5x^2 - 4' };

const BIQUAD_COEFFICIENTS: { key: 'a' | 'b' | 'c'; label: string }[] = [
	{ key: 'a', label: 'a (di x⁴)' },
	{ key: 'b', label: 'b (di x²)' },
	{ key: 'c', label: 'c (termine noto)' }
];

const BIQUAD_EXAMPLES: [string, string, string][] = [
	['1', '-5', '4'],
	['1', '3', '-4'],
	['2', '0', '-8'],
	['1', '2', '5']
];

export function EquazioniBiquadraticheTool() {
	const [state, set] = useToolState(BIQUAD_DEFAULTS);
	const mode = state.modo === 'eq' ? 'eq' : 'coef';
	const input: BiquadInput = useMemo(() => ({ mode, a: state.a, b: state.b, c: state.c, eq: state.eq }), [mode, state.a, state.b, state.c, state.eq]);
	const outcome = useMemo(() => equazioneBiquadratica(input), [input]);
	const degree = useMemo(() => biquadDegree(input), [input]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToggleGroup
						label="Come scrivi l'equazione"
						options={[
							{ value: 'coef', label: 'Coefficienti' },
							{ value: 'eq', label: 'Equazione' }
						]}
						value={mode}
						onChange={(m) => set({ modo: m })}
					/>
					{mode === 'coef' ? (
						<>
							<p className="text-sm text-fg-muted">
								L&apos;equazione nella forma <span className="font-mono">ax⁴ + bx² + c = 0</span>.
							</p>
							<div className="grid grid-cols-3 items-end gap-3">
								{BIQUAD_COEFFICIENTS.map(({ key, label }) => (
									<ToolField key={key} label={label}>
										<input className={toolInputClass} inputMode="text" autoComplete="off" spellCheck={false} value={state[key]} onChange={(e) => set({ [key]: e.target.value })} />
									</ToolField>
								))}
							</div>
							<p className="text-xs text-fg-subtle">Numeri interi, decimali con la virgola (1,5) o frazioni (2/3). Un campo vuoto vale 0.</p>
							<Examples items={BIQUAD_EXAMPLES.map(([a, b, c]) => ({ label: `${a}; ${b}; ${c}`, apply: () => set({ a, b, c }) }))} />
						</>
					) : (
						<>
							<EquationField value={state.eq} onChange={(eq) => set({ eq })} placeholder="x^4 - 5x^2 + 4 = 0" />
							<Examples items={['x^4 - 5x^2 + 4 = 0', 'x^4 = 3x^2', '4x^4 - 17x^2 + 4 = 0', 'x^4 + 3x^2 = 4'].map((eq) => ({ label: eq, apply: () => set({ eq }) }))} />
						</>
					)}
					{degree === 2 && <OtherToolLink slug="equazioni-secondo-grado" query={mode === 'eq' ? { modo: 'eq', eq: state.eq } : { a: state.b, b: '0', c: state.c }} label="Risolvila come equazione di secondo grado" />}
				</>
			}
		/>
	);
}

// ---------------------------------------------------------------------------
// Absolute value

const ASSOLUTO_DEFAULTS = { eq: '|2x - 3| = x + 1' };

export function EquazioniValoreAssolutoTool() {
	const [state, set] = useToolState(ASSOLUTO_DEFAULTS);
	const outcome = useMemo(() => equazioneValoreAssoluto(state.eq), [state.eq]);
	const latex = useMemo(() => previewValoreAssoluto(state.eq), [state.eq]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<FormulaField
						label="Equazione"
						hint="Il valore assoluto tra due barre verticali: |2x - 3|. Sulla tastiera del telefono la barra | sta tra i simboli."
						value={state.eq}
						onChange={(eq) => set({ eq })}
						placeholder="|2x - 3| = 5"
						latex={latex}
						empty="Qui vedi l'equazione come l'hai scritta."
					/>
					<Examples items={['|2x - 3| = 5', '|3 - x| = 2x', '|x - 1| = 1 - x', '|x + 2| = -3'].map((eq) => ({ label: eq, apply: () => set({ eq }) }))} />
				</>
			}
		/>
	);
}

// ---------------------------------------------------------------------------
// Fractional inequalities

const DISEQ_DEFAULTS = { n: 'x^2 - 2x - 3', d: 'x - 2', v: '>=' };

const REL_OPTIONS: { value: Rel; label: string }[] = [
	{ value: '>', label: '> 0' },
	{ value: '>=', label: '≥ 0' },
	{ value: '<', label: '< 0' },
	{ value: '<=', label: '≤ 0' }
];

const DISEQ_EXAMPLES: { label: string; values: { n: string; d: string; v: Rel } }[] = [
	{ label: '(x − 1)/(x + 2) ≥ 0', values: { n: 'x - 1', d: 'x + 2', v: '>=' } },
	{ label: '(4 − x²)/x > 0', values: { n: '4 - x^2', d: 'x', v: '>' } },
	{ label: '(x + 2)/(x(x − 1)) ≥ 0', values: { n: 'x + 2', d: 'x(x - 1)', v: '>=' } },
	{ label: '(x − 3)²/(x² − 5x + 4) < 0', values: { n: '(x - 3)^2', d: 'x^2 - 5x + 4', v: '<' } }
];

export function DisequazioniFratteTool() {
	const [state, set] = useToolState(DISEQ_DEFAULTS);
	const rel: Rel = isRel(state.v) ? state.v : '>';
	const input = useMemo(() => ({ n: state.n, d: state.d, rel }), [state.n, state.d, rel]);
	const { outcome, line } = useMemo(() => risolviDisequazioneFratta(input), [input]);
	const latex = useMemo(() => previewDisequazioneFratta(input), [input]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<div className="grid gap-3 sm:grid-cols-2">
						<ToolField label="Numeratore">
							<input className={toolInputClass} inputMode="text" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder="x - 1" value={state.n} onChange={(e) => set({ n: e.target.value })} />
						</ToolField>
						<ToolField label="Denominatore">
							<input className={toolInputClass} inputMode="text" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder="x + 2" value={state.d} onChange={(e) => set({ d: e.target.value })} />
						</ToolField>
					</div>
					<ToggleGroup label="Verso della disequazione" options={REL_OPTIONS} value={rel} onChange={(v) => set({ v })} />
					<p className="text-xs text-fg-subtle">Primo o secondo grado: x^2 per il quadrato, 2x per 2 per x. Un prodotto come x(x - 1) ha una riga per fattore.</p>
					<Preview latex={latex} label="Anteprima della disequazione" empty="Qui vedi la disequazione come l'hai scritta." />
					{line && <NumberLineSketch line={line} />}
					<Examples items={DISEQ_EXAMPLES.map((x) => ({ label: x.label, apply: () => set(x.values) }))} />
				</>
			}
		/>
	);
}
