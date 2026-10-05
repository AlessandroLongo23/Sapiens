'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { parseChartBlock, type ChartBlock } from '@/lib/diagramma/blocco';
import { buildChart, chartSvg } from '@/lib/diagramma/disegno';
import { advance, canAdvance, startRun, type Run } from '@/lib/diagramma/esecuzione';
import { showValue } from '@/lib/diagramma/espressione';

/** The pause between two blocks while the chart runs by itself. */
const PACE = 900;

/** What the last step did, in a sentence. */
function Told({ run }: { run: Run }): ReactNode {
	const name = (text: string) => <i className="font-medium text-fg-strong">{text}</i>;
	const value = (text: string) => <b className="font-semibold text-fg-strong">{text}</b>;
	if (run.error) return <span className="text-danger-fg">Il diagramma si ferma qui: {run.error}.</span>;
	const event = run.event;
	switch (event.kind) {
		case 'start':
			return <>Premi «Passo» per eseguire un blocco alla volta, oppure «Esegui».</>;
		case 'ask':
			return <>Scrivi un valore per {name(event.name)}.</>;
		case 'input':
			return (
				<>
					{name(event.name)} prende il valore {value(showValue(event.value, true))}.
				</>
			);
		case 'assign':
			return (
				<>
					{event.shown && <>Si calcola {value(event.shown)}: </>}
					{name(event.name)} prende il valore {value(showValue(event.value, true))}.
				</>
			);
		case 'output':
			return <>Scrive {value(event.text)}.</>;
		case 'cond':
			return (
				<>
					Con i valori di adesso la condizione è {value(event.shown)}: è {value(event.value ? 'vera' : 'falsa')}, si prosegue per «{event.value ? 'sì' : 'no'}».
				</>
			);
		default:
			return <>Fine: il diagramma è arrivato in fondo.</>;
	}
}

/**
 * A flowchart in a lesson (a ```diagramma block, lib/diagramma/blocco.ts), run one block at a time: the block the
 * run is on is lit, the table beside it holds the variables, and those the block reads or changes are marked, so a
 * condition shows the values that make it true or false.
 */
function Chart({ block }: { block: ChartBlock }) {
	const chart = useMemo(() => buildChart(block.program), [block]);
	// every state of the run so far: the last one is shown, and "Indietro" drops it
	const [runs, setRuns] = useState<Run[]>(() => [startRun()]);
	const [typed, setTyped] = useState('');
	const [playing, setPlaying] = useState(false);
	const field = useRef<HTMLInputElement>(null);
	const run = runs[runs.length - 1];
	const moving = playing && canAdvance(run) && !run.waiting;

	const step = () => {
		const next = advance(chart, run, typed);
		if (next === run) return;
		setRuns([...runs, next]);
		// the field of the next "leggi" opens with the value the lesson suggests
		setTyped(next.waiting ? (block.inputs[next.asked] ?? '') : '');
	};

	const back = () => {
		if (runs.length < 2) return;
		const before = runs[runs.length - 2];
		setPlaying(false);
		setRuns(runs.slice(0, -1));
		setTyped(before.waiting ? (block.inputs[before.asked] ?? '') : '');
	};

	const restart = () => {
		setPlaying(false);
		setRuns([startRun()]);
		setTyped('');
	};

	useEffect(() => {
		if (!moving) return;
		const timer = setTimeout(step, PACE);
		return () => clearTimeout(timer);
	});

	useEffect(() => {
		if (run.waiting) field.current?.focus({ preventScroll: true });
	}, [run.waiting, run.at]);

	const answer = (event: FormEvent) => {
		event.preventDefault();
		step();
	};

	const names = Object.keys(run.variables);
	const svg = chartSvg(chart, block.alt, { at: run.at, taken: run.taken, wrong: Boolean(run.error) });

	return (
		<section className="not-prose overflow-hidden rounded-xl border border-edge bg-surface shadow-paper" aria-label="Diagramma di flusso da eseguire">
			<div className="flex flex-wrap items-center gap-1.5 border-b border-edge px-3 py-2 print:hidden">
				<Button variant="primary" size="sm" onClick={() => setPlaying(!playing)} disabled={!canAdvance(run)} aria-pressed={playing}>
					{moving ? <Pause className="size-3.5" aria-hidden="true" /> : <Play className="size-3.5" aria-hidden="true" />}
					{moving ? 'Pausa' : 'Esegui'}
				</Button>
				<Button variant="secondary" size="sm" onClick={back} disabled={runs.length < 2}>
					<ChevronLeft className="size-3.5" aria-hidden="true" />
					Indietro
				</Button>
				<Button variant="secondary" size="sm" onClick={step} disabled={!canAdvance(run) || (run.waiting && !typed.trim())}>
					Passo
					<ChevronRight className="size-3.5" aria-hidden="true" />
				</Button>
				<Button variant="ghost" size="sm" onClick={restart} disabled={runs.length < 2} className="ml-auto">
					<RotateCcw className="size-3.5" aria-hidden="true" />
					<span className="max-sm:sr-only">Ricomincia</span>
				</Button>
			</div>
			<div className="grid gap-x-4 md:grid-cols-[minmax(0,1fr)_15rem]">
				<div className="flex justify-center overflow-x-auto px-2 py-3" dangerouslySetInnerHTML={{ __html: svg }} />
				<div className="flex flex-col gap-3 border-edge p-3 text-sm max-md:order-first max-md:border-b md:border-l print:hidden">
					<div className="min-h-10 text-fg-muted" role="status" data-told>
						<Told run={run} />
					</div>
					{run.waiting && run.event.kind === 'ask' && (
						<form onSubmit={answer} className="flex items-center gap-2">
							<label className="flex min-w-0 flex-1 items-center gap-2">
								<i className="font-medium text-fg-strong">{run.event.name}</i>
								<span aria-hidden="true">=</span>
								<input
									ref={field}
									value={typed}
									onChange={(e) => setTyped(e.target.value)}
									aria-label={`Valore di ${run.event.name}`}
									autoComplete="off"
									className="min-h-9 w-full min-w-0 rounded-lg border border-edge-strong bg-page px-2 font-mono text-sm text-fg-strong focus-ring"
								/>
							</label>
							<Button type="submit" variant="secondary" size="sm" disabled={!typed.trim()}>
								Invio
							</Button>
						</form>
					)}
					<div>
						<div className="label-mono mb-1 text-fg-subtle">Variabili</div>
						{names.length ? (
							<div className="overflow-hidden rounded-lg border border-edge" role="table" aria-label="Variabili" data-variables>
								{names.map((name) => {
									const read = run.reads.includes(name);
									const written = run.written === name;
									return (
										<div
											key={name}
											role="row"
											data-variable={name}
											data-marked={written ? 'written' : read ? 'read' : undefined}
											className={cn('flex items-baseline justify-between gap-3 border-t border-edge-soft px-2 py-1 first:border-t-0', written ? 'bg-accent-soft' : read && 'bg-warn-soft')}
										>
											<span role="rowheader" className="italic text-fg-strong">
												{name}
											</span>
											<span role="cell" className={cn('min-w-0 break-words text-right font-mono text-fg-strong', written && 'font-semibold')}>
												{showValue(run.variables[name], true)}
											</span>
										</div>
									);
								})}
							</div>
						) : (
							<div className="text-fg-subtle">Ancora nessuna.</div>
						)}
					</div>
					<div>
						<div className="label-mono mb-1 text-fg-subtle">Uscita</div>
						{run.output.length ? (
							<pre className="m-0 max-h-40 overflow-auto rounded-lg bg-surface-2 px-2 py-1.5 font-mono text-sm text-fg-strong" data-output>
								{run.output.join('\n')}
							</pre>
						) : (
							<div className="text-fg-subtle">Ancora niente.</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

export function LessonChart({ source }: { source: string }) {
	const block = useMemo(() => parseChartBlock(source).block, [source]);
	return block ? <Chart block={block} /> : null;
}
