'use client';

import { useMemo } from 'react';
import { COLORS, DEFAULT_BANDS, TOLERANCES, bandLabel, bandRoles, colorById, colorsFor, coloriValore, nBands, valoreColori, valueBands, type BandColor } from '@/lib/tools/codice-colori';
import { RES_UNITS } from '@/lib/tools/resistenze';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { cn } from '@/lib/utils/cn';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';
import { unitSelectClass } from './GrandezzeTool';

/**
 * The colour code of resistors, both ways. Each band is picked with buttons that show the colour and its name: the
 * colour is never the only sign, for students with colour blindness or with DSA. The resistor is drawn with its bands,
 * each named beside it.
 */

const DEFAULTS = {
	modo: 'colori',
	n: '4',
	b: DEFAULT_BANDS[4].join('-'),
	v: '4,7',
	u: 'kohm',
	t: '5'
};

const EXAMPLES: { label: string; values: Partial<typeof DEFAULTS> }[] = [
	{
		label: 'marrone nero rosso oro',
		values: { modo: 'colori', n: '4', b: 'marrone-nero-rosso-oro' }
	},
	{
		label: 'rosso rosso marrone oro',
		values: { modo: 'colori', n: '4', b: 'rosso-rosso-marrone-oro' }
	},
	{
		label: '10 kΩ con 5 bande',
		values: { modo: 'valore', n: '5', v: '10', u: 'kohm', t: '1' }
	},
	{
		label: '220 Ω',
		values: { modo: 'valore', n: '4', v: '220', u: 'ohm', t: '5' }
	}
];

export function CodiceColoriTool() {
	const [state, set] = useToolState(DEFAULTS);
	const n = nBands(state.n);
	const toValue = state.modo !== 'valore';
	const stored = state.b.split('-');
	const bands = stored.length === n ? stored : DEFAULT_BANDS[n];
	const outcome = useMemo(() => (toValue ? coloriValore(n, bands) : valoreColori(n, state.v, state.u, state.t)), [toValue, n, bands, state.v, state.u, state.t]);
	const drawn: (BandColor | undefined)[] = useMemo(() => {
		if (toValue) return bands.map(colorById);
		const vb = valueBands(n, state.v, state.u, state.t);
		return typeof vb === 'string' ? [] : vb.colors;
	}, [toValue, n, bands, state.v, state.u, state.t]);
	const setBand = (i: number, id: string) => set({ b: bands.map((x, j) => (j === i ? id : x)).join('-') });

	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToggleGroup
						label="Che cosa vuoi trovare"
						options={[
							{ value: 'colori', label: 'Dai colori al valore' },
							{ value: 'valore', label: 'Dal valore ai colori' }
						]}
						value={toValue ? 'colori' : 'valore'}
						onChange={(modo) => set({ modo })}
					/>
					<ToggleGroup
						label="Quante bande"
						options={[
							{ value: '4', label: '4 bande' },
							{ value: '5', label: '5 bande' }
						]}
						value={String(n)}
						onChange={(x) => set({ n: x, b: DEFAULT_BANDS[nBands(x)].join('-') })}
					/>
					<ResistorSketch colors={drawn} n={n} />
					{toValue ? (
						bandRoles(n).map((role, i) => (
							<fieldset key={`${n}-${i}`} className="flex flex-col gap-1.5">
								<legend className="label-mono mb-1.5 text-fg-subtle">{bandLabel(n, i)}</legend>
								<div className="flex flex-wrap gap-1.5">
									{colorsFor(role, i === 0).map((c) => (
										<ColorChip key={c.id} color={c} pressed={bands[i] === c.id} onClick={() => setBand(i, c.id)} />
									))}
								</div>
							</fieldset>
						))
					) : (
						<>
							<div className="flex flex-col gap-1.5">
								<label htmlFor="cc-v" className="label-mono text-fg-subtle">
									Valore della resistenza
								</label>
								<div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-2">
									<input id="cc-v" className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={state.v} onChange={(e) => set({ v: e.target.value })} />
									<select aria-label="Unità" className={unitSelectClass} value={state.u} onChange={(e) => set({ u: e.target.value })}>
										{RES_UNITS.map((u) => (
											<option key={u.id} value={u.id}>
												{u.label}
											</option>
										))}
									</select>
								</div>
							</div>
							<ToolField label="Tolleranza">
								<select className={unitSelectClass} value={state.t} onChange={(e) => set({ t: e.target.value })}>
									{TOLERANCES.map((t) => (
										<option key={t} value={t}>
											± {t}% ({COLORS.find((c) => c.tol === t)!.name})
										</option>
									))}
								</select>
							</ToolField>
						</>
					)}
					<p className="text-xs text-fg-subtle">Tieni a destra la banda della tolleranza, di solito oro o argento: si legge da sinistra.</p>
					<Examples
						items={EXAMPLES.map((x) => ({
							label: x.label,
							apply: () => set(x.values)
						}))}
					/>
				</>
			}
		/>
	);
}

/** A colour button: the swatch and the name, always both. */
function ColorChip({ color, pressed, onClick }: { color: BandColor; pressed: boolean; onClick: () => void }) {
	return (
		<button
			type="button"
			aria-pressed={pressed}
			onClick={onClick}
			className={cn(
				'flex min-h-[40px] items-center gap-2 rounded-lg border px-2.5 py-1 text-sm transition-colors focus-ring',
				pressed ? 'border-accent bg-accent/10 font-semibold text-fg-strong shadow-[inset_0_-2px_0_var(--accent)]' : 'border-edge bg-surface text-fg-muted hover:border-edge-strong hover:text-fg'
			)}
		>
			<span className="size-4 shrink-0 rounded-full border border-black/30" style={{ backgroundColor: color.hex }} aria-hidden="true" />
			{color.name}
		</button>
	);
}

/** The resistor with its bands, each named above or below it, alternating so the names never overlap. */
function ResistorSketch({ colors, n }: { colors: (BandColor | undefined)[]; n: 4 | 5 }) {
	const xs = n === 4 ? [114, 142, 170, 250] : [108, 130, 152, 174, 250];
	// Names alternate above and below; on each side they are pushed apart so the longest ("arancione") never overlap.
	const lx = [...xs];
	for (const side of [0, 1]) {
		const idx = xs.map((_, i) => i).filter((i) => i % 2 === side);
		for (let k = 1; k < idx.length; k++) lx[idx[k]] = Math.max(lx[idx[k]], lx[idx[k - 1]] + 68);
	}
	const named = colors.filter(Boolean).map((c) => c!.name);
	const title = named.length ? `Resistenza con le bande: ${named.join(', ')}` : 'Resistenza: scrivi un valore valido per vedere le bande';
	return (
		<svg viewBox="0 0 360 150" role="img" aria-label={title} className="h-auto w-full max-w-md self-center text-fg">
			<title>{title}</title>
			<path d="M8,75 H80 M280,75 H352" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
			<rect x={80} y={52} width={200} height={46} rx={20} fill="#e9dcc0" stroke="currentColor" strokeWidth={1.5} />
			{xs.map((x, i) => {
				const c = colors[i];
				const up = i % 2 === 0;
				return (
					<g key={i}>
						<rect x={x - 7} y={53} width={14} height={44} fill={c?.hex ?? 'transparent'} stroke={c ? 'rgba(0,0,0,0.35)' : 'currentColor'} strokeDasharray={c ? undefined : '3 3'} strokeWidth={1} />
						{c && (
							<>
								<path d={up ? `M${x},52 L${lx[i]},38` : `M${x},98 L${lx[i]},112`} stroke="currentColor" strokeWidth={1} className="text-fg-muted" />
								<text x={lx[i]} y={up ? 28 : 124} textAnchor="middle" dominantBaseline="middle" className="fill-fg text-[13px] font-medium">
									{c.name}
								</text>
							</>
						)}
					</g>
				);
			})}
		</svg>
	);
}
