'use client';

import { Fragment, useMemo } from 'react';
import { previewLinear, sistema2x2, sistema3x3, type Method2, type Method3 } from '@/lib/tools/sistemi-lineari';
import { tex } from '@/lib/tools/tex';
import { Html } from '@/components/ui/Html';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';

/** A coefficient cell: narrower padding and centred, so four fit on a phone. */
const cellClass = `${toolInputClass.replace('px-3.5', 'px-1.5')} text-center`;

const ORDINALS = ['prima', 'seconda', 'terza'];
const VARS_2 = ['x', 'y'];
const VARS_3 = ['x', 'y', 'z'];

const HINT = 'Scrivi 2x per 2 per x, x/2 per le frazioni. Per i decimali usa la virgola: 0,5y.';

/** The coefficients in a grid, one row per equation: [a] x + [b] y = [c]. */
function CoefficientGrid({ vars, keys, state, set }: { vars: string[]; keys: string[][]; state: Record<string, string>; set: (patch: Record<string, string>) => void }) {
	const cols = vars.length === 2 ? 'grid-cols-[1fr_auto_1fr_auto_1fr]' : 'grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]';
	return (
		<div className="flex flex-col gap-2">
			<p className="text-sm text-fg-muted">Il sistema in forma normale: i coefficienti delle incognite e il termine noto di ogni equazione.</p>
			<div className={`grid ${cols} items-center gap-x-1.5 gap-y-2`}>
				{keys.map((row, i) => (
					<Fragment key={i}>
						{row.map((k, j) => (
							<Fragment key={k}>
								<input
									className={cellClass}
									inputMode="text"
									autoComplete="off"
									spellCheck={false}
									aria-label={j < vars.length ? `Coefficiente di ${vars[j]} nella ${ORDINALS[i]} equazione` : `Termine noto della ${ORDINALS[i]} equazione`}
									value={state[k]}
									onChange={(e) => set({ [k]: e.target.value })}
								/>
								{j < vars.length && (
									<span className="font-mono text-base text-fg-muted" aria-hidden="true">
										{vars[j]} {j === vars.length - 1 ? '=' : '+'}
									</span>
								)}
							</Fragment>
						))}
					</Fragment>
				))}
			</div>
			<p className="text-xs text-fg-subtle">Numeri interi, decimali con la virgola (1,5) o frazioni (2/3). Un campo vuoto vale 0, un meno va nel campo: −2.</p>
		</div>
	);
}

/** The equations typed in full, with the system typeset under them as the student types. */
function EquationFields({ vars, keys, state, set }: { vars: string[]; keys: string[]; state: Record<string, string>; set: (patch: Record<string, string>) => void }) {
	const texts = keys.map((k) => state[k]).join('\n');
	const preview = useMemo(() => {
		const lines = texts.split('\n').map((t) => previewLinear(t, vars));
		return lines.some(Boolean) ? tex(`\\begin{cases} ${lines.map((l) => l ?? '\\ldots').join(' \\\\ ')} \\end{cases}`, true) : '';
	}, [texts, vars]);
	return (
		<>
			{keys.map((k, i) => (
				<ToolField key={k} label={`${ORDINALS[i][0].toUpperCase()}${ORDINALS[i].slice(1)} equazione`} hint={i === keys.length - 1 ? HINT : undefined}>
					<input className={toolInputClass} inputMode="text" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} value={state[k]} onChange={(e) => set({ [k]: e.target.value })} />
				</ToolField>
			))}
			<div aria-label="Anteprima del sistema" className="min-h-[3.25rem] overflow-x-auto rounded-xl border border-dashed border-edge bg-surface-2 px-3 py-2 text-fg-strong">
				{preview ? <Html html={preview} className="math-content" /> : <p className="py-1.5 text-sm text-fg-faint">Qui vedi il sistema come l&apos;hai scritto.</p>}
			</div>
		</>
	);
}

const MODE_OPTIONS = [
	{ value: 'coef' as const, label: 'Coefficienti' },
	{ value: 'eq' as const, label: 'Equazioni' }
];

// ---------------------------------------------------------------------------
// Two equations

const DEFAULTS_2 = { modo: 'coef', metodo: 'sostituzione', a1: '2', b1: '1', c1: '7', a2: '3', b2: '-2', c2: '0', e1: '3(x - 1) = 2y + 1', e2: 'x/2 + y/3 = 1' };

const KEYS_2 = [
	['a1', 'b1', 'c1'],
	['a2', 'b2', 'c2']
];

const METHODS_2: { value: Method2; label: string }[] = [
	{ value: 'sostituzione', label: 'Sostituzione' },
	{ value: 'riduzione', label: 'Riduzione' },
	{ value: 'cramer', label: 'Cramer' }
];

const EXAMPLES_2: { label: string; values: Record<string, string> }[] = [
	{ label: 'x + y = 5; 2x + 3y = 12', values: { a1: '1', b1: '1', c1: '5', a2: '2', b2: '3', c2: '12' } },
	{ label: '3x + 4y = 2; 2x − 5y = 9', values: { a1: '3', b1: '4', c1: '2', a2: '2', b2: '-5', c2: '9' } },
	{ label: '2x − 4y = 3; x − 2y = 1', values: { a1: '2', b1: '-4', c1: '3', a2: '1', b2: '-2', c2: '1' } },
	{ label: '2x − 4y = 2; x − 2y = 1', values: { a1: '2', b1: '-4', c1: '2', a2: '1', b2: '-2', c2: '1' } }
];

export function Sistemi2x2Tool() {
	const [state, set] = useToolState(DEFAULTS_2);
	const mode = state.modo === 'eq' ? 'eq' : 'coef';
	const method: Method2 = state.metodo === 'riduzione' || state.metodo === 'cramer' ? state.metodo : 'sostituzione';
	const outcome = useMemo(
		() => sistema2x2({ mode, method, coef: [state.a1, state.b1, state.c1, state.a2, state.b2, state.c2], eqs: [state.e1, state.e2] }),
		[mode, method, state.a1, state.b1, state.c1, state.a2, state.b2, state.c2, state.e1, state.e2]
	);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToggleGroup label="Come scrivi il sistema" options={MODE_OPTIONS} value={mode} onChange={(m) => set({ modo: m })} />
					<ToggleGroup label="Metodo" options={METHODS_2} value={method} onChange={(m) => set({ metodo: m })} />
					{mode === 'coef' ? (
						<>
							<CoefficientGrid vars={VARS_2} keys={KEYS_2} state={state} set={set} />
							<Examples items={EXAMPLES_2.map((x) => ({ label: x.label, apply: () => set(x.values) }))} />
						</>
					) : (
						<>
							<EquationFields vars={VARS_2} keys={['e1', 'e2']} state={state} set={set} />
							<Examples
								items={[
									['x + y = 5', '2x + 3y = 12'],
									['y = 2x - 1', 'y = 4 - x'],
									['3(x - 1) = 2y + 1', 'x/2 + y/3 = 1']
								].map(([e1, e2]) => ({ label: `${e1}; ${e2}`, apply: () => set({ e1, e2 }) }))}
							/>
						</>
					)}
				</>
			}
		/>
	);
}

// ---------------------------------------------------------------------------
// Three equations

const DEFAULTS_3 = {
	modo: 'coef',
	metodo: 'cramer',
	a1: '1',
	b1: '2',
	c1: '-1',
	d1: '-1',
	a2: '2',
	b2: '-1',
	c2: '1',
	d2: '6',
	a3: '1',
	b3: '1',
	c3: '2',
	d3: '3',
	e1: 'x + y + z = 6',
	e2: '2x - y + z = 3',
	e3: 'x + 2y - z = 2'
};

const KEYS_3 = [
	['a1', 'b1', 'c1', 'd1'],
	['a2', 'b2', 'c2', 'd2'],
	['a3', 'b3', 'c3', 'd3']
];

const METHODS_3: { value: Method3; label: string }[] = [
	{ value: 'cramer', label: 'Cramer' },
	{ value: 'riduzione', label: 'Riduzione' }
];

const EXAMPLES_3: { label: string; rows: string[][] }[] = [
	{
		label: 'Soluzione (1; 2; 3)',
		rows: [
			['1', '1', '1', '6'],
			['2', '-1', '1', '3'],
			['1', '2', '-1', '2']
		]
	},
	{
		label: 'Con le frazioni',
		rows: [
			['2', '1', '-1', '1'],
			['1', '-3', '2', '0'],
			['3', '2', '1', '4']
		]
	},
	{
		label: 'Impossibile',
		rows: [
			['1', '1', '1', '1'],
			['1', '1', '1', '2'],
			['1', '-1', '0', '0']
		]
	},
	{
		label: 'Indeterminato',
		rows: [
			['1', '1', '1', '1'],
			['2', '2', '2', '2'],
			['1', '-1', '0', '0']
		]
	}
];

export function Sistemi3x3Tool() {
	const [state, set] = useToolState(DEFAULTS_3);
	const mode = state.modo === 'eq' ? 'eq' : 'coef';
	const method: Method3 = state.metodo === 'riduzione' ? 'riduzione' : 'cramer';
	const coef = KEYS_3.flat().map((k) => state[k as keyof typeof DEFAULTS_3]);
	const coefKey = coef.join('|');
	const outcome = useMemo(
		() => sistema3x3({ mode, method, coef: coefKey.split('|'), eqs: [state.e1, state.e2, state.e3] }),
		[mode, method, coefKey, state.e1, state.e2, state.e3]
	);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToggleGroup label="Come scrivi il sistema" options={MODE_OPTIONS} value={mode} onChange={(m) => set({ modo: m })} />
					<ToggleGroup label="Metodo" options={METHODS_3} value={method} onChange={(m) => set({ metodo: m })} />
					{mode === 'coef' ? (
						<>
							<CoefficientGrid vars={VARS_3} keys={KEYS_3} state={state} set={set} />
							<Examples items={EXAMPLES_3.map((x) => ({ label: x.label, apply: () => set(Object.fromEntries(KEYS_3.flatMap((row, i) => row.map((k, j) => [k, x.rows[i][j]])))) }))} />
						</>
					) : (
						<>
							<EquationFields vars={VARS_3} keys={['e1', 'e2', 'e3']} state={state} set={set} />
							<Examples
								items={[
									{ label: 'Soluzione (1; 2; 3)', eqs: ['x + y + z = 6', '2x - y + z = 3', 'x + 2y - z = 2'] },
									{ label: 'Con le parentesi', eqs: ['2(x - y) + z = 3', 'x + y = z + 1', 'x/2 + y = 2'] }
								].map((x) => ({ label: x.label, apply: () => set({ e1: x.eqs[0], e2: x.eqs[1], e3: x.eqs[2] }) }))}
							/>
						</>
					)}
				</>
			}
		/>
	);
}
