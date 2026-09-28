'use client';

import { useMemo } from 'react';
import { Download, Plus, X } from 'lucide-react';
import { MAX_ITEMS, PAGE_INK, PRINT_INK, graficoATorta, pieSvg, splitLine, type PieModel } from '@/lib/tools/grafico-a-torta';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { cn } from '@/lib/utils/cn';
import { Examples, ResultBox, StepList, ToolField, toolInputClass, useToolState } from './ToolSheet';

/**
 * The pie chart maker. The chart is the answer, so it takes the place of honour beside the inputs, with its two
 * download buttons; the totals and the copy button sit under it, and the working (percentages, angles, the checks)
 * below everything, as in every tool.
 */

/** How a class of 25 gets to school: 36 %, 24 %, 20 %, 12 % and 8 %, angles with one decimal. */
const DEFAULTS = {
	d: 'Autobus; 9\nA piedi; 6\nAuto; 5\nBici; 3\nTreno; 2',
	t: 'Come arriviamo a scuola',
	c: '0',
	o: '0',
	m: 'righe'
};

const EXAMPLES = [
	{
		label: 'sport preferito',
		d: 'Calcio; 14\nPallavolo; 10\nBasket; 8\nNuoto; 6\nAltro; 2',
		t: 'Lo sport preferito della classe',
		o: '0'
	},
	{
		label: 'gusti di gelato',
		d: 'Cioccolato; 42\nFragola; 30\nPistacchio; 25\nLimone; 18\nNocciola; 12\nMenta; 3\nLiquirizia; 2',
		t: 'Gelati venduti in un giorno',
		o: '1'
	},
	{
		label: 'spese del mese',
		d: 'Affitto; 650\nSpesa; 320\nBollette; 140\nTrasporti; 90\nSvago; 60\nAltro; 40',
		t: 'Le spese di una famiglia in un mese',
		o: '1'
	},
	{
		label: 'ore della giornata',
		d: 'Sonno; 8\nScuola; 6\nStudio; 2,5\nSport; 1,5\nPasti; 2\nTempo libero; 4',
		t: 'La mia giornata in ore',
		o: '0'
	}
];

/** The rows of the editor, from the text of the table: one "name; value" per line. */
const toRows = (d: string) => d.split('\n').map(splitLine);
const fromRows = (rows: [string, string][]) => rows.map(([n, v]) => `${n}; ${v}`).join('\n');

/** The file name from the title: "Come arriviamo a scuola" → "come-arriviamo-a-scuola". */
function fileName(title: string): string {
	const slug = title
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 60);
	return slug || 'grafico-a-torta';
}

function save(blob: Blob, name: string) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = name;
	document.body.append(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** The chart in fixed colours on white, as an SVG file or drawn on a canvas at twice the size for a sharp PNG. */
async function download(chart: PieModel, title: string, donut: boolean, kind: 'svg' | 'png') {
	const { svg, width, height } = pieSvg(chart, {
		title,
		donut,
		ink: PRINT_INK
	});
	const name = `${fileName(title)}.${kind}`;
	if (kind === 'svg') {
		save(
			new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${svg}`], {
				type: 'image/svg+xml'
			}),
			name
		);
		return;
	}
	const img = new Image();
	img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
	await img.decode();
	const scale = 2;
	const canvas = document.createElement('canvas');
	canvas.width = width * scale;
	canvas.height = height * scale;
	const ctx = canvas.getContext('2d');
	if (!ctx) return;
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	canvas.toBlob((blob) => blob && save(blob, name), 'image/png');
}

const buttonClass =
	'flex items-center gap-1.5 rounded-lg border border-edge bg-surface px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:border-edge-strong hover:text-fg focus-ring';

export function GraficoTortaTool() {
	const [state, set] = useToolState(DEFAULTS);
	const donut = state.c === '1';
	const { outcome, chart } = useMemo(() => graficoATorta(state.d, state.o === '1'), [state.d, state.o]);
	const figure = useMemo(() => (chart ? pieSvg(chart, { title: state.t, donut, ink: PAGE_INK }).svg : ''), [chart, state.t, donut]);
	const rows = useMemo(() => toRows(state.d), [state.d]);
	const update = (i: number, j: 0 | 1, value: string) =>
		set({
			d: fromRows(rows.map((r, k) => (k === i ? (j === 0 ? [value, r[1]] : [r[0], value]) : r)))
		});

	return (
		<section aria-label="Strumento" className="relative overflow-hidden rounded-2xl border border-edge bg-surface shadow-paper">
			<div className="grid-paper pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
			<div className="relative flex flex-col gap-6 p-4 sm:p-6">
				<div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
					<div className="flex min-w-0 flex-col gap-4">
						<ToolField label="Titolo" hint="Facoltativo: compare sopra il grafico e nei file scaricati.">
							<input className={cn(toolInputClass, 'font-sans text-base')} autoComplete="off" maxLength={80} value={state.t} onChange={(e) => set({ t: e.target.value })} />
						</ToolField>
						<ToggleGroup
							label="Come scrivere i dati"
							value={state.m === 'tabella' ? 'tabella' : 'righe'}
							onChange={(m) => set({ m })}
							options={[
								{ value: 'righe', label: 'Voce per voce' },
								{ value: 'tabella', label: 'Incolla una tabella' }
							]}
						/>
						{state.m === 'tabella' ? (
							<ToolField
								label="Tabella"
								hint="Una voce per riga: il nome e il valore separati da punto e virgola, due punti o tabulazione. Puoi incollare due colonne di un foglio di calcolo o la tabella delle frequenze."
							>
								<textarea className={cn(toolInputClass, 'min-h-40 resize-y text-base')} rows={7} autoComplete="off" spellCheck={false} value={state.d} onChange={(e) => set({ d: e.target.value })} />
							</ToolField>
						) : (
							<div className="flex flex-col gap-2">
								<div className="grid grid-cols-[minmax(0,1fr)_6.5rem_2.5rem] items-center gap-2 label-mono text-fg-subtle">
									<span>Voce</span>
									<span>Valore</span>
									<span aria-hidden="true" />
								</div>
								{rows.map(([name, value], i) => (
									<div key={i} className="grid grid-cols-[minmax(0,1fr)_6.5rem_2.5rem] items-center gap-2">
										<input
											aria-label={`Nome della voce ${i + 1}`}
											className={cn(toolInputClass, 'font-sans text-base')}
											autoComplete="off"
											maxLength={40}
											value={name}
											onChange={(e) => update(i, 0, e.target.value.replace(/[\t\n]/g, ' '))}
										/>
										<input
											aria-label={`Valore della voce ${i + 1}`}
											className={toolInputClass}
											inputMode="decimal"
											autoComplete="off"
											spellCheck={false}
											value={value}
											onChange={(e) => update(i, 1, e.target.value.replace(/[;\t\n]/g, ''))}
										/>
										<button
											type="button"
											aria-label={`Togli la voce ${i + 1}`}
											title={`Togli la voce ${i + 1}`}
											disabled={rows.length <= 1}
											onClick={() => set({ d: fromRows(rows.filter((_, k) => k !== i)) })}
											className="flex size-10 items-center justify-center rounded-lg text-fg-subtle transition-colors hover:bg-surface-3 hover:text-fg focus-ring disabled:opacity-40 disabled:hover:bg-transparent"
										>
											<X className="size-4" aria-hidden="true" />
										</button>
									</div>
								))}
								{rows.length < MAX_ITEMS && (
									<button type="button" onClick={() => set({ d: fromRows([...rows, ['', '']]) })} className={cn(buttonClass, 'w-fit')}>
										<Plus className="size-4" aria-hidden="true" />
										Aggiungi una voce
									</button>
								)}
								<p className="text-xs text-fg-subtle">Da una a {MAX_ITEMS} voci. Valori positivi, anche decimali con la virgola: 2,5.</p>
							</div>
						)}
						<div className="grid gap-3 sm:grid-cols-2">
							<ToggleGroup
								label="Forma"
								value={donut ? '1' : '0'}
								onChange={(c) => set({ c })}
								options={[
									{ value: '0', label: 'Torta' },
									{ value: '1', label: 'Ciambella' }
								]}
							/>
							<ToggleGroup
								label="Ordine degli spicchi"
								value={state.o === '1' ? '1' : '0'}
								onChange={(o) => set({ o })}
								options={[
									{ value: '0', label: 'Come i dati' },
									{ value: '1', label: 'Dal più grande' }
								]}
							/>
						</div>
						<Examples
							items={EXAMPLES.map(({ label, ...x }) => ({
								label,
								apply: () => set(x)
							}))}
						/>
					</div>
					<div className="flex min-w-0 flex-col gap-4">
						{chart && (
							<figure className="flex flex-col gap-3 rounded-xl border border-edge bg-surface p-3 shadow-paper sm:p-4">
								<div className="mx-auto w-full max-w-[500px] [&>svg]:h-auto [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: figure }} />
								<figcaption className="flex flex-wrap items-center justify-end gap-2">
									<button type="button" className={buttonClass} onClick={() => void download(chart, state.t, donut, 'png')}>
										<Download className="size-4" aria-hidden="true" />
										Scarica PNG
									</button>
									<button type="button" className={buttonClass} onClick={() => void download(chart, state.t, donut, 'svg')}>
										<Download className="size-4" aria-hidden="true" />
										Scarica SVG
									</button>
								</figcaption>
							</figure>
						)}
						<ResultBox outcome={outcome} />
					</div>
				</div>
				{outcome.ok && <StepList steps={outcome.steps} />}
			</div>
		</section>
	);
}
