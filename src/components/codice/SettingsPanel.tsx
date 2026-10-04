'use client';

import { useState, type ReactNode } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { cn } from '@/lib/utils/cn';
import { DEFAULTS, SIZE_MAX, SIZE_MIN, TABS, THEMES, saveSettings, useEditorSettings, type EditorSettings, type ThemeId } from './settings';
import { themeSample } from './theme';

function Row({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
	return (
		<div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-edge py-3 last:border-b-0">
			<div className="min-w-0">
				<p className="m-0 text-sm font-medium text-fg-strong">{label}</p>
				{hint && <p className="m-0 text-sm text-fg-muted">{hint}</p>}
			</div>
			{children}
		</div>
	);
}

const YES_NO = [
	{ value: 'yes', label: 'Sì' },
	{ value: 'no', label: 'No' }
] as const;

function Flag({ name, label, hint }: { name: 'minimap' | 'wrap' | 'numbers' | 'pairs'; label: string; hint?: string }) {
	const settings = useEditorSettings();
	return (
		<Row label={label} hint={hint}>
			<ToggleGroup compact label={label} value={settings[name] ? 'yes' : 'no'} onChange={(value) => saveSettings({ [name]: value === 'yes' })} options={[...YES_NO]} />
		</Row>
	);
}

/** A theme as a button: a line of code in its colours, for the site's theme of now (the colours are variables). */
function Theme({ id, chosen }: { id: ThemeId; chosen: boolean }) {
	const { light, dark } = themeSample(id);
	const piece = (name: keyof typeof light, text: string) => (
		<span className="text-(--l) dark:text-(--d)" style={{ '--l': light[name], '--d': dark[name] } as React.CSSProperties}>
			{text}
		</span>
	);
	return (
		<button type="button" role="radio" aria-checked={chosen} onClick={() => saveSettings({ theme: id })} className={cn('min-w-0 rounded-lg border px-3 py-2 text-left focus-ring', chosen ? 'border-accent bg-surface-2' : 'border-edge hover:bg-surface-2')}>
			<span className="block text-sm font-medium text-fg-strong">{THEMES[id]}</span>
			<span className="mt-1 block overflow-hidden font-mono text-[0.8125rem] whitespace-nowrap" aria-hidden="true">
				{piece('storage', 'def ')}
				{piece('function', 'area')}
				{piece('fg', '(')}
				{piece('variable', 'r')}
				{piece('fg', '): ')}
				{piece('keyword', 'return ')}
				{piece('number', '3.14')}
				{piece('fg', ' * ')}
				{piece('variable', 'r')}
				{piece('comment', '  # cerchio')}
			</span>
		</button>
	);
}

/**
 * The size of the text: a whole number between SIZE_MIN and SIZE_MAX, typed or stepped. What is typed is taken when
 * it is such a number; anything else (half a number, one out of range, nothing) is put right on leaving the field.
 */
function Size({ value }: { value: number }) {
	// what is in the field while it is being typed; null when it shows the setting
	const [typed, setTyped] = useState<string | null>(null);
	const step = (by: number) => saveSettings({ size: Math.min(SIZE_MAX, Math.max(SIZE_MIN, value + by)) });
	const BUTTON = 'flex size-9 items-center justify-center rounded-lg border border-edge-strong bg-surface text-fg-strong hover:bg-surface-3 focus-ring disabled:cursor-not-allowed disabled:border-edge disabled:text-fg-faint disabled:hover:bg-surface';
	return (
		<div className="flex items-center gap-1.5">
			<button type="button" onClick={() => step(-1)} disabled={value <= SIZE_MIN} aria-label="Testo più piccolo" className={BUTTON}>
				<Minus className="size-4" aria-hidden="true" />
			</button>
			<input
				type="number"
				inputMode="numeric"
				min={SIZE_MIN}
				max={SIZE_MAX}
				step={1}
				aria-label="Dimensione del testo in pixel"
				value={typed ?? value}
				onChange={(event) => {
					const text = event.target.value;
					setTyped(text);
					const size = Number(text);
					if (/^\d+$/.test(text) && size >= SIZE_MIN && size <= SIZE_MAX) saveSettings({ size });
				}}
				onBlur={() => {
					const size = Math.round(Number(typed));
					if (typed !== null && Number.isFinite(size) && typed.trim() !== '') saveSettings({ size: Math.min(SIZE_MAX, Math.max(SIZE_MIN, size)) });
					setTyped(null);
				}}
				className="h-9 w-16 rounded-lg border border-edge-strong bg-surface px-2 text-center text-sm text-fg-strong tabular-nums focus-ring max-sm:text-base"
			/>
			<button type="button" onClick={() => step(1)} disabled={value >= SIZE_MAX} aria-label="Testo più grande" className={BUTTON}>
				<Plus className="size-4" aria-hidden="true" />
			</button>
		</div>
	);
}

/**
 * The settings of the code editor (settings.ts), shown in the place of the output while the gear in the bar is on.
 * Every change is taken at once by the editor beside it, and kept on the device for every editor of the site.
 */
export function SettingsPanel({ className }: { className?: string }) {
	const settings = useEditorSettings();
	const changed = (Object.keys(DEFAULTS) as (keyof EditorSettings)[]).some((name) => settings[name] !== DEFAULTS[name]);
	return (
		<div className={cn('overflow-auto bg-surface-2 px-4 py-3', className)} role="region" aria-label="Impostazioni dell’editor">
			<div className="flex items-center justify-between gap-2">
				<h2 className="m-0 text-base font-semibold text-fg-strong">Impostazioni dell’editor</h2>
				{changed && (
					<Button variant="ghost" size="sm" onClick={() => saveSettings(DEFAULTS)}>
						<RotateCcw className="size-3.5" aria-hidden="true" />
						Ripristina
					</Button>
				)}
			</div>
			<p className="mt-1 mb-2 text-sm text-fg-muted">Valgono per tutti gli editor del sito, su questo dispositivo.</p>

			<div className="border-b border-edge py-3">
				<p className="m-0 mb-2 text-sm font-medium text-fg-strong">Colori del codice</p>
				<div role="radiogroup" aria-label="Colori del codice" className="grid gap-2">
					{(Object.keys(THEMES) as ThemeId[]).map((id) => (
						<Theme key={id} id={id} chosen={settings.theme === id} />
					))}
				</div>
			</div>
			<Row label="Dimensione del testo" hint={`In pixel, da ${SIZE_MIN} a ${SIZE_MAX}.`}>
				<Size value={settings.size} />
			</Row>
			<Row label="Larghezza del rientro" hint="Quanti spazi vale un rientro, anche nel codice già scritto.">
				<ToggleGroup compact label="Larghezza del rientro" value={String(settings.tab)} onChange={(tab) => saveSettings({ tab: Number(tab) as EditorSettings['tab'] })} options={TABS.map((n) => ({ value: String(n), label: String(n) }))} />
			</Row>
			<Flag name="minimap" label="Minimappa" hint="Il programma in piccolo lungo il bordo del codice." />
			<Flag name="numbers" label="Numeri di riga" />
			<Flag name="wrap" label="A capo automatico" hint="Le righe lunghe continuano sotto e non scorrono di lato." />
			<Flag name="pairs" label="Chiudi parentesi e virgolette" hint="Scrivendo ( compare anche )." />
		</div>
	);
}
