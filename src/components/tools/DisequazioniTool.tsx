'use client';

import { useMemo } from 'react';
import { isRel, previewInequality, quadIneqDegree, risolviDisequazionePrimoGrado, risolviDisequazioneSecondoGrado, type NumberLine, type QuadIneqInput, type Rel } from '@/lib/tools/disequazioni';
import { tex } from '@/lib/tools/tex';
import { Html } from '@/components/ui/Html';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { OtherToolLink } from './EquazioniPrimoGradoTool';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

const HINT = 'Scrivi > e <, oppure >= e <= per maggiore o uguale e minore o uguale. 2x per 2 per x, x/2 per le frazioni, x^2 per il quadrato.';

/** The field for an inequality typed as text, with the inequality typeset under it as the student types. */
function InequalityField({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
	const preview = useMemo(() => {
		const latex = previewInequality(value);
		return latex ? tex(latex, true) : '';
	}, [value]);
	return (
		<>
			<ToolField label="Disequazione" hint={HINT}>
				<input className={toolInputClass} inputMode="text" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
			</ToolField>
			<div aria-label="Anteprima della disequazione" className="min-h-[3.25rem] overflow-x-auto rounded-xl border border-dashed border-edge bg-surface-2 px-3 py-2 text-fg-strong">
				{preview ? <Html html={preview} className="math-content" /> : <p className="py-1.5 text-sm text-fg-faint">Qui vedi la disequazione come l&apos;hai scritta.</p>}
			</div>
		</>
	);
}

const W = 320;
const H = 64;
const PAD = 16;
const AXIS_Y = 26;

/**
 * The solutions on the number line, as in the lessons: the stretches that solve the inequality drawn thick in the
 * accent colour, a full dot for an end that is included and an empty one for an end that is not. Not to scale: the
 * ends are evenly spaced.
 */
export function NumberLineSketch({ line }: { line: NumberLine }) {
	const n = line.points.length;
	const xs = line.points.map((_, i) => PAD + ((i + 1) * (W - 2 * PAD)) / (n + 1));
	const from = (k: number) => (k === 0 ? PAD : xs[k - 1]);
	const to = (k: number) => (k === n ? W - PAD : xs[k]);
	const empty = n === 0 && !line.stretches[0];
	return (
		<figure className="flex flex-col gap-1">
			<svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Le soluzioni sulla retta: ${line.caption}`} className="h-auto w-full max-w-md self-center text-fg">
				<title>{`Le soluzioni sulla retta: ${line.caption}`}</title>
				<line x1={PAD - 8} y1={AXIS_Y} x2={W - PAD + 4} y2={AXIS_Y} className="stroke-fg-muted" strokeWidth={1.2} />
				<path d={`M${W - PAD + 4},${AXIS_Y - 4} L${W - PAD + 10},${AXIS_Y} L${W - PAD + 4},${AXIS_Y + 4}`} fill="none" className="stroke-fg-muted" strokeWidth={1.2} />
				<text x={W - PAD + 2} y={AXIS_Y + 18} fontSize={12} textAnchor="middle" className="fill-current italic">
					x
				</text>
				{line.stretches.map((inSet, k) =>
					inSet ? <line key={k} x1={from(k)} y1={AXIS_Y} x2={to(k)} y2={AXIS_Y} className="stroke-accent" strokeWidth={5} strokeLinecap={k === 0 || k === n ? 'butt' : 'round'} /> : null
				)}
				{line.points.map((p, i) => {
					const near = line.stretches[i] || line.stretches[i + 1];
					return (
						<g key={i}>
							{p.inSet ? (
								<circle cx={xs[i]} cy={AXIS_Y} r={5} className="fill-accent stroke-accent" strokeWidth={1.5} />
							) : near ? (
								<circle cx={xs[i]} cy={AXIS_Y} r={5} className="fill-surface stroke-accent" strokeWidth={2} />
							) : (
								<line x1={xs[i]} y1={AXIS_Y - 5} x2={xs[i]} y2={AXIS_Y + 5} className="stroke-fg-muted" strokeWidth={1.2} />
							)}
							<text x={xs[i]} y={AXIS_Y + 24} fontSize={13} textAnchor="middle" className="fill-current">
								{p.label}
							</text>
						</g>
					);
				})}
				{empty && (
					<text x={W / 2} y={AXIS_Y - 10} fontSize={13} textAnchor="middle" className="fill-current">
						Nessuna soluzione
					</text>
				)}
			</svg>
			<figcaption className="text-center text-xs text-fg-subtle">Pallino pieno: estremo incluso. Pallino vuoto: estremo escluso.</figcaption>
		</figure>
	);
}

// ---------------------------------------------------------------------------
// First degree

const DEFAULTS_1 = { d: '3(x - 2) + 1 > 5x - 1' };

export function DisequazioniPrimoGradoTool() {
	const [state, set] = useToolState(DEFAULTS_1);
	const { outcome, line } = useMemo(() => risolviDisequazionePrimoGrado(state.d), [state.d]);
	const second = useMemo(() => quadIneqDegree({ mode: 'eq', eq: state.d }) === 2, [state.d]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<InequalityField value={state.d} onChange={(d) => set({ d })} placeholder="2x + 3 > 7" />
					{second && <OtherToolLink slug="disequazioni-secondo-grado" query={{ modo: 'eq', d: state.d }} label="Risolvila come disequazione di secondo grado" />}
					{line && <NumberLineSketch line={line} />}
					<Examples items={['2x + 3 > 7', '2 - 5x >= 17', 'x/2 - 1/3 <= x', '2(x + 1) < 2x + 1'].map((d) => ({ label: d, apply: () => set({ d }) }))} />
				</>
			}
		/>
	);
}

// ---------------------------------------------------------------------------
// Second degree

const DEFAULTS_2 = { modo: 'coef', a: '-1', b: '2', c: '3', v: '<', d: 'x^2 < 2x + 1' };

const REL_OPTIONS: { value: Rel; label: string }[] = [
	{ value: '>', label: '> 0' },
	{ value: '>=', label: '≥ 0' },
	{ value: '<', label: '< 0' },
	{ value: '<=', label: '≤ 0' }
];

const COEFFICIENTS: { key: 'a' | 'b' | 'c'; label: string }[] = [
	{ key: 'a', label: 'a (di x²)' },
	{ key: 'b', label: 'b (di x)' },
	{ key: 'c', label: 'c (termine noto)' }
];

const COEF_EXAMPLES: { label: string; values: { a: string; b: string; c: string; v: Rel } }[] = [
	{ label: 'x² − x − 6 ≤ 0', values: { a: '1', b: '-1', c: '-6', v: '<=' } },
	{ label: '2x² − 3x − 2 > 0', values: { a: '2', b: '-3', c: '-2', v: '>' } },
	{ label: 'x² − 4x + 4 > 0', values: { a: '1', b: '-4', c: '4', v: '>' } },
	{ label: 'x² + x + 1 < 0', values: { a: '1', b: '1', c: '1', v: '<' } }
];

/** "bx + c > 0" for the first-degree tool, when a is 0. */
function linearText(b: string, c: string, v: Rel): string {
	const B = b.trim() || '0';
	const C = c.trim() || '0';
	return `${B}x + ${C.startsWith('-') ? `(${C})` : C} ${v} 0`;
}

export function DisequazioniSecondoGradoTool() {
	const [state, set] = useToolState(DEFAULTS_2);
	const mode = state.modo === 'eq' ? 'eq' : 'coef';
	const rel: Rel = isRel(state.v) ? state.v : '>';
	const input: QuadIneqInput = useMemo(() => ({ mode, a: state.a, b: state.b, c: state.c, rel, eq: state.d }), [mode, state.a, state.b, state.c, rel, state.d]);
	const { outcome, line } = useMemo(() => risolviDisequazioneSecondoGrado(input), [input]);
	const degree = useMemo(() => quadIneqDegree(input), [input]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToggleGroup
						label="Come scrivi la disequazione"
						options={[
							{ value: 'coef', label: 'Coefficienti' },
							{ value: 'eq', label: 'Disequazione' }
						]}
						value={mode}
						onChange={(m) => set({ modo: m })}
					/>
					{mode === 'coef' ? (
						<>
							<p className="text-sm text-fg-muted">
								La disequazione in forma normale <span className="font-mono">ax² + bx + c</span>, poi il verso.
							</p>
							<div className="grid grid-cols-3 items-end gap-3">
								{COEFFICIENTS.map(({ key, label }) => (
									<ToolField key={key} label={label}>
										<input className={toolInputClass} inputMode="text" autoComplete="off" spellCheck={false} value={state[key]} onChange={(e) => set({ [key]: e.target.value })} />
									</ToolField>
								))}
							</div>
							<ToggleGroup label="Verso della disequazione" options={REL_OPTIONS} value={rel} onChange={(v) => set({ v })} />
							<p className="text-xs text-fg-subtle">Numeri interi, decimali con la virgola (1,5) o frazioni (2/3). Un campo vuoto vale 0.</p>
							<Examples items={COEF_EXAMPLES.map((x) => ({ label: x.label, apply: () => set(x.values) }))} />
						</>
					) : (
						<>
							<InequalityField value={state.d} onChange={(d) => set({ d })} placeholder="x^2 - 5x + 6 > 0" />
							<Examples items={['x^2 - 5x + 6 > 0', 'x^2 <= 9', 'x(x - 4) >= -4', 'x^2 < 2x + 1'].map((d) => ({ label: d, apply: () => set({ d }) }))} />
						</>
					)}
					{degree !== null && degree <= 1 && (
						<OtherToolLink slug="disequazioni-primo-grado" query={{ d: mode === 'eq' ? state.d : linearText(state.b, state.c, rel) }} label="Risolvila come disequazione di primo grado" />
					)}
					{line && <NumberLineSketch line={line} />}
				</>
			}
		/>
	);
}
