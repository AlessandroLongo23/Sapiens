'use client';

import { Check } from 'lucide-react';
import {
	COLOR_LABEL,
	KIND_LABEL,
	PAPER_COLORS,
	PAPER_KINDS,
	PAPER_SIZES,
	SIZE_LABEL,
	TEXT_LABEL,
	paperData,
	paperTone,
	type Paper,
	type PaperSize
} from '@/lib/zaino/paper';
import { cn } from '@/lib/utils/cn';

/** Swatch colours for the colour buttons; the paper itself is styled in globals.css. */
const SWATCH: Record<(typeof PAPER_COLORS)[number], string> = {
	tema: 'linear-gradient(135deg, var(--color-paper-50) 50%, var(--color-ink-900) 50%)',
	bianca: '#fff',
	avorio: 'oklch(0.965 0.03 85)',
	gialla: 'oklch(0.975 0.04 95)',
	azzurra: 'oklch(0.968 0.02 240)',
	verde: 'oklch(0.968 0.024 155)',
	rosa: 'oklch(0.968 0.02 10)',
	scura: 'var(--color-ink-900)'
};

/**
 * Arrow keys inside a radio group, as the pattern expects: they move the
 * choice to the neighbour and the focus with it, and only the chosen radio is
 * a Tab stop, so the panel is four stops and not eighteen.
 */
function onRadioKeys<T>(e: React.KeyboardEvent, values: readonly T[], value: T, choose: (v: T) => void) {
	const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
	if (!step) return;
	e.preventDefault();
	const next = values[(values.indexOf(value) + step + values.length) % values.length];
	choose(next);
	const group = e.currentTarget;
	requestAnimationFrame(() => group.querySelector<HTMLElement>('[aria-checked="true"]')?.focus());
}

/**
 * The paper of a note, as in Notability's Paper menu: ruling, colour, line
 * spacing and text size. Every choice applies at once and is saved on its
 * own; the samples are drawn with the same CSS as the sheet.
 */
export function PaperPanel({ paper, onChange }: { paper: Paper; onChange: (paper: Paper) => void }) {
	const set = (patch: Partial<Paper>) => onChange({ ...paper, ...patch });
	const lineWord = paper.kind === 'righe' ? 'Righe' : paper.kind === 'puntini' ? 'Puntini' : 'Quadretti';

	return (
		<div className="w-full space-y-5 p-1.5 sm:w-80">
			<fieldset>
				<legend className="label-mono mb-2 text-[11px] text-fg-subtle">Foglio</legend>
				<div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Tipo di foglio" onKeyDown={(e) => onRadioKeys(e, PAPER_KINDS, paper.kind, (kind) => set({ kind }))}>
					{PAPER_KINDS.map((kind) => {
						const on = paper.kind === kind;
						const tone = paperTone(paper.color);
						return (
							<button
								key={kind}
								type="button"
								role="radio"
								aria-checked={on}
								tabIndex={on ? 0 : -1}
								onClick={() => set({ kind })}
								className="group flex flex-col items-center gap-1.5 rounded-xl p-1 focus-ring"
							>
								<span
									{...paperData({ ...paper, kind })}
									style={{ ['--row' as string]: '9px', ['--baseline' as string]: '6px' }}
									className={cn(
										'note-paper note-lined block h-16 w-full rounded-lg bg-surface ring-1 transition',
										tone && `paper-${tone}`,
										on ? 'ring-2 ring-accent' : 'ring-edge group-hover:ring-edge-strong'
									)}
									aria-hidden="true"
								/>
								<span className={cn('text-xs', on ? 'font-semibold text-fg-strong' : 'text-fg-muted')}>{KIND_LABEL[kind]}</span>
							</button>
						);
					})}
				</div>
			</fieldset>

			<fieldset>
				<legend className="label-mono mb-2 text-[11px] text-fg-subtle">
					Colore <span className="normal-case tracking-normal text-fg-muted">· {COLOR_LABEL[paper.color]}</span>
				</legend>
				<div className="flex justify-between" role="radiogroup" aria-label="Colore della carta" onKeyDown={(e) => onRadioKeys(e, PAPER_COLORS, paper.color, (color) => set({ color }))}>
					{PAPER_COLORS.map((color) => {
						const on = paper.color === color;
						return (
							<button
								key={color}
								type="button"
								role="radio"
								aria-checked={on}
								aria-label={COLOR_LABEL[color]}
								title={COLOR_LABEL[color]}
								tabIndex={on ? 0 : -1}
								onClick={() => set({ color })}
								style={{ background: SWATCH[color] }}
								className={cn(
									'flex size-7 items-center justify-center rounded-full ring-1 ring-inset ring-edge-strong transition focus-ring-offset',
									on && 'ring-2 ring-accent ring-offset-2 ring-offset-surface'
								)}
							>
								{on && <Check className={cn('size-3.5', color === 'scura' ? 'text-paper-50' : 'text-ink-800')} strokeWidth={2.5} aria-hidden="true" />}
							</button>
						);
					})}
				</div>
			</fieldset>

			<Segmented
				legend={paper.kind === 'bianca' ? 'Righe di testo' : lineWord}
				value={paper.spacing}
				labels={SIZE_LABEL}
				onChange={(spacing) => set({ spacing })}
			/>
			<Segmented legend="Testo" value={paper.text} labels={TEXT_LABEL} onChange={(text) => set({ text })} sample />

			<p className="text-xs leading-relaxed text-fg-subtle">Ogni riga di testo occupa una riga del foglio, qualunque dimensione tu scelga.</p>
		</div>
	);
}

function Segmented({
	legend,
	value,
	labels,
	onChange,
	sample = false
}: {
	legend: string;
	value: PaperSize;
	labels: Record<PaperSize, string>;
	onChange: (value: PaperSize) => void;
	sample?: boolean;
}) {
	return (
		<fieldset>
			<legend className="label-mono mb-2 text-[11px] text-fg-subtle">{legend}</legend>
			<div className="flex rounded-xl border border-edge bg-surface-2 p-1" role="radiogroup" aria-label={legend} onKeyDown={(e) => onRadioKeys(e, PAPER_SIZES, value, onChange)}>
				{PAPER_SIZES.map((size, i) => {
					const on = value === size;
					return (
						<button
							key={size}
							type="button"
							role="radio"
							aria-checked={on}
							tabIndex={on ? 0 : -1}
							onClick={() => onChange(size)}
							className={cn(
								'flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 text-sm font-medium transition-colors focus-ring',
								on ? 'bg-surface text-fg-strong shadow-paper' : 'text-fg-muted hover:text-fg'
							)}
						>
							{sample && (
								<span className="font-display leading-none" style={{ fontSize: 11 + i * 3 }} aria-hidden="true">
									A
								</span>
							)}
							{labels[size]}
						</button>
					);
				})}
			</div>
		</fieldset>
	);
}
