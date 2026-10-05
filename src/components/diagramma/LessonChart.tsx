'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { Check, ChevronLeft, ChevronRight, Copy, Pause, Pencil, Play, RotateCcw, Trash2, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { cn } from '@/lib/utils/cn';
import { INPUT_TYPES, parseChartBlock, type ChartBlock, type InputType, type Stmt } from '@/lib/diagramma/blocco';
import { CODE_LANGUAGES, codeOf, codeText, type CodeLanguage } from '@/lib/diagramma/codice';
import { buildChart, chartSvg } from '@/lib/diagramma/disegno';
import { advance, canAdvance, startRun, type Run } from '@/lib/diagramma/esecuzione';
import { showValue, sourceOf } from '@/lib/diagramma/espressione';
import { BLOCK_KINDS, blockAt, insertBlock, newBlock, removeBlock, replaceBlock, rewriteBlock, type BlockKind } from '@/lib/diagramma/modifica';

/** The pause between two blocks while the chart runs by itself. */
const PACE = 900;
/** The language chosen for the programs of the lessons (components/codice/LessonCode.tsx): the code of a chart opens in it. */
const LANGUAGE_KEY = 'sapiens:linguaggio';

const FIELD = 'min-h-9 w-full min-w-0 rounded-lg border border-edge-strong bg-page px-2 font-mono text-sm text-fg-strong focus-ring';
const HEADING = 'label-mono mb-1 text-fg-subtle';

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

type Picked = { kind: 'block' | 'slot'; place: string };

/** The fields of a block being changed. What is typed becomes the block as soon as it can be read; until then the chart keeps the block it had. */
function BlockForm({ stmt, onChange, onRemove }: { stmt: Stmt; onChange: (stmt: Stmt) => void; onRemove: () => void }) {
	const [first, setFirst] = useState(() => (stmt.kind === 'input' || stmt.kind === 'assign' ? stmt.name : stmt.kind === 'output' ? stmt.items.map((item) => sourceOf(item.tokens)).join(', ') : sourceOf(stmt.tokens)));
	const [second, setSecond] = useState(() => (stmt.kind === 'assign' ? sourceOf(stmt.tokens) : ''));
	const [type, setType] = useState<InputType | ''>(stmt.kind === 'input' ? (stmt.type ?? '') : '');
	const [error, setError] = useState<string | null>(null);

	const write = (a: string, b: string, t: InputType | '') => {
		const line = { input: `leggi ${a}${t ? `: ${INPUT_TYPES[t]}` : ''}`, assign: `${a} = ${b}`, output: `scrivi ${a}`, if: `se ${a}`, while: `finché ${a}` }[stmt.kind];
		const named = stmt.kind !== 'input' && stmt.kind !== 'assign' ? true : /^[\p{L}_][\p{L}\d_]*$/u.test(a.trim());
		const read = named ? rewriteBlock(stmt, line) : { stmt: null, error: 'il nome di una variabile è fatto di lettere, cifre e _, senza spazi' };
		setError(read.error);
		if (read.stmt) onChange(read.stmt);
	};
	const typed = (set: (value: string) => void, which: 'first' | 'second') => (event: { target: { value: string } }) => {
		set(event.target.value);
		write(which === 'first' ? event.target.value : first, which === 'second' ? event.target.value : second, type);
	};

	const label = { input: 'Variabile da leggere', assign: 'Variabile', output: 'Cosa scrivere', if: 'Condizione', while: 'Condizione: finché è vera si ripete' }[stmt.kind];
	return (
		<div className="flex flex-col gap-2" data-form={stmt.kind}>
			<div className={HEADING}>{BLOCK_KINDS[stmt.kind]}</div>
			<label className="flex flex-col gap-1">
				<span className="text-fg-muted">{label}</span>
				<input autoFocus value={first} onChange={typed(setFirst, 'first')} autoComplete="off" autoCapitalize="off" spellCheck={false} className={FIELD} />
			</label>
			{stmt.kind === 'assign' && (
				<label className="flex flex-col gap-1">
					<span className="text-fg-muted">Valore che prende</span>
					<input value={second} onChange={typed(setSecond, 'second')} autoComplete="off" autoCapitalize="off" spellCheck={false} className={FIELD} />
				</label>
			)}
			{stmt.kind === 'input' && (
				<label className="flex flex-col gap-1">
					<span className="text-fg-muted">Che cosa si legge</span>
					<select
						value={type}
						onChange={(event) => {
							const chosen = event.target.value as InputType | '';
							setType(chosen);
							write(first, second, chosen);
						}}
						className={cn(FIELD, 'font-sans')}
					>
						<option value="">un numero o un testo</option>
						<option value="int">un numero intero</option>
						<option value="float">un numero con la virgola</option>
						<option value="str">un testo</option>
					</select>
				</label>
			)}
			{stmt.kind === 'if' && (
				<label className="flex items-center gap-2 text-fg-muted">
					<input type="checkbox" checked={stmt.else !== null} onChange={(event) => onChange({ ...stmt, else: event.target.checked ? [] : null })} className="size-4 accent-[var(--accent)]" />
					Con il ramo «no» (altrimenti)
				</label>
			)}
			{stmt.kind === 'output' && <p className="m-0 text-xs text-fg-subtle">Un testo va tra virgolette: &quot;ciao&quot;. Più cose si separano con la virgola.</p>}
			{(stmt.kind === 'if' || stmt.kind === 'while') && <p className="m-0 text-xs text-fg-subtle">Si confronta con == != &lt; &lt;= &gt; &gt;=. Due condizioni si uniscono con E, O, NON.</p>}
			{error && (
				<p className="m-0 text-danger-fg" role="alert">
					Così non si legge: {error}.
				</p>
			)}
			<Button variant="ghost" size="sm" onClick={onRemove} className="self-start text-danger-fg">
				<Trash2 className="size-3.5" aria-hidden="true" />
				Elimina il blocco
			</Button>
		</div>
	);
}

/** The program of the chart in Python or in C++, with the line of the block the run is on lit. */
function Code({ program, inputs, at }: { program: Stmt[]; inputs: string[]; at: Stmt | null }) {
	const [language, setLanguage] = useState<CodeLanguage>(() => {
		try {
			return localStorage.getItem(LANGUAGE_KEY) === 'cpp' ? 'cpp' : 'python';
		} catch {
			return 'python';
		}
	});
	const [copied, setCopied] = useState(false);
	const lines = useMemo(() => codeOf(program, language, inputs), [program, language, inputs]);
	// the lit line is kept in sight inside the box of the code, without moving the page
	const box = useRef<HTMLPreElement>(null);
	useEffect(() => {
		const pre = box.current;
		const lit = pre?.querySelector<HTMLElement>('[data-on]');
		if (!pre || !lit) return;
		const top = lit.offsetTop - pre.offsetTop;
		if (top < pre.scrollTop || top + lit.offsetHeight > pre.scrollTop + pre.clientHeight) pre.scrollTop = top - pre.clientHeight / 2;
	}, [at, lines]);
	const copy = () => {
		void navigator.clipboard
			?.writeText(codeText(lines))
			.then(() => {
				setCopied(true);
				setTimeout(() => setCopied(false), 1500);
			})
			.catch(() => {});
	};
	return (
		<div data-code={language}>
			<div className="mb-1 flex items-center gap-2">
				<div className={cn(HEADING, 'mb-0 mr-auto')}>Codice</div>
				<ToggleGroup label="Linguaggio del codice" compact value={language} onChange={setLanguage} options={(Object.keys(CODE_LANGUAGES) as CodeLanguage[]).map((value) => ({ value, label: CODE_LANGUAGES[value] }))} />
				<Button variant="ghost" size="sm" onClick={copy} title="Copia il codice" aria-label="Copia il codice" className="px-2">
					{copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
				</Button>
			</div>
			<pre ref={box} className="relative m-0 max-h-80 overflow-auto rounded-lg bg-surface-2 py-1.5 font-mono text-[13px] leading-5 text-fg-strong [font-variant-ligatures:none]">
				{lines.length ? (
					lines.map((line, i) => (
						<span key={i} data-on={at !== null && line.stmt === at ? '' : undefined} className={cn('block min-w-max border-l-2 px-2', at !== null && line.stmt === at ? 'border-accent bg-accent-soft' : 'border-transparent')}>
							{line.text || ' '}
						</span>
					))
				) : (
					<span className="block px-2 font-sans text-fg-subtle">Il programma è ancora vuoto.</span>
				)}
			</pre>
		</div>
	);
}

/**
 * A flowchart in a lesson (a ```diagramma block, lib/diagramma/blocco.ts).
 *
 * It runs one block at a time: the block the run is on is lit, the table beside it holds the variables, and those
 * the block reads or changes are marked, so a condition shows the values that make it true or false.
 *
 * With "Modifica" it is changed: a block is added in a gap, and a block that is picked is rewritten or removed.
 * The chart is its program (lib/diagramma/modifica.ts), so the code beside it follows every change.
 */
function Chart({ block }: { block: ChartBlock }) {
	// the programs the chart has been, the last one being what is shown: "Annulla" drops it
	const [programs, setPrograms] = useState<{ program: Stmt[]; by: string }[]>(() => [{ program: block.program, by: '' }]);
	const [editing, setEditing] = useState(block.edit);
	const [picked, setPicked] = useState<Picked | null>(null);
	// every state of the run so far: the last one is shown, and "Indietro" drops it
	const [runs, setRuns] = useState<Run[]>(() => [startRun()]);
	const [typed, setTyped] = useState('');
	const [playing, setPlaying] = useState(false);
	const field = useRef<HTMLInputElement>(null);

	const program = programs[programs.length - 1].program;
	const chart = useMemo(() => buildChart(program, editing), [program, editing]);
	const run = runs[runs.length - 1];
	const moving = !editing && playing && canAdvance(run) && !run.waiting;
	const pickedBlock = picked?.kind === 'block' ? blockAt(program, picked.place) : null;

	const rest = () => {
		setPlaying(false);
		setRuns([startRun()]);
		setTyped('');
	};

	/** A change to the chart. Typing in the fields of one block is one change, not one for each letter. */
	const change = (next: Stmt[], by: string) => {
		const last = programs[programs.length - 1];
		setPrograms(by && last.by === by ? [...programs.slice(0, -1), { program: next, by }] : [...programs, { program: next, by }]);
		rest();
	};

	const step = () => {
		const next = advance(chart, run, typed);
		if (next === run) return;
		// a value that "leggi" does not take is asked again: nothing has happened
		if (next.refused) return setRuns([...runs.slice(0, -1), next]);
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

	const toggleEditing = () => {
		setEditing(!editing);
		setPicked(null);
		rest();
	};

	const pick = (target: EventTarget) => {
		if (!editing || !(target instanceof Element)) return false;
		const slot = target.closest('[data-slot]')?.getAttribute('data-slot');
		const place = target.closest('[data-place]')?.getAttribute('data-place');
		if (slot) setPicked({ kind: 'slot', place: slot });
		else if (place) setPicked({ kind: 'block', place });
		return Boolean(slot || place);
	};
	const clicked = (event: MouseEvent) => void pick(event.target);
	const pressed = (event: KeyboardEvent) => {
		if ((event.key === 'Enter' || event.key === ' ') && pick(event.target)) event.preventDefault();
	};

	const add = (kind: BlockKind) => {
		if (picked?.kind !== 'slot') return;
		change(insertBlock(program, picked.place, newBlock(kind, program)), '');
		// the new block sits where the gap was, and opens to be written
		setPicked({ kind: 'block', place: picked.place });
	};

	const remove = () => {
		if (!picked) return;
		change(removeBlock(program, picked.place), '');
		setPicked(null);
	};

	const undo = () => {
		if (programs.length < 2) return;
		setPrograms(programs.slice(0, -1));
		setPicked(null);
		rest();
	};

	const restore = () => {
		setPrograms([{ program: block.program, by: '' }]);
		setPicked(null);
		rest();
	};

	const names = Object.keys(run.variables);
	const svg = chartSvg(chart, block.alt, editing ? { picked } : { at: run.at, taken: run.taken, wrong: Boolean(run.error) });

	return (
		<section className="not-prose overflow-hidden rounded-xl border border-edge bg-surface shadow-paper" aria-label={editing ? 'Diagramma di flusso da modificare' : 'Diagramma di flusso da eseguire'} data-editing={editing || undefined}>
			<div className="flex flex-wrap items-center gap-1.5 border-b border-edge px-3 py-2 print:hidden">
				{editing ? (
					<>
						<Button variant="secondary" size="sm" onClick={undo} disabled={programs.length < 2}>
							<Undo2 className="size-3.5" aria-hidden="true" />
							Annulla
						</Button>
						<Button variant="ghost" size="sm" onClick={restore} disabled={programs.length < 2}>
							<RotateCcw className="size-3.5" aria-hidden="true" />
							<span className="max-sm:sr-only">Ripristina</span>
						</Button>
					</>
				) : (
					<>
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
						<Button variant="ghost" size="sm" onClick={rest} disabled={runs.length < 2}>
							<RotateCcw className="size-3.5" aria-hidden="true" />
							<span className="max-sm:sr-only">Ricomincia</span>
						</Button>
					</>
				)}
				<Button variant={editing ? 'primary' : 'ghost'} size="sm" onClick={toggleEditing} aria-pressed={editing} className="ml-auto">
					{editing ? <Play className="size-3.5" aria-hidden="true" /> : <Pencil className="size-3.5" aria-hidden="true" />}
					{editing ? 'Prova il diagramma' : 'Modifica'}
				</Button>
			</div>
			<div className="grid gap-x-4 md:grid-cols-[minmax(0,1fr)_19rem]">
				{/* The drawing is ours (lib/diagramma/disegno.ts), with every text of the chart escaped. */}
				<div className="flex justify-center overflow-x-auto px-2 py-3" onClick={clicked} onKeyDown={pressed} dangerouslySetInnerHTML={{ __html: svg }} />
				<div className="flex min-w-0 flex-col gap-3 border-edge p-3 text-sm max-md:order-first max-md:border-b md:border-l print:hidden">
					{editing ? (
						<div className="min-h-10" data-edit>
							{pickedBlock && picked ? (
								<BlockForm key={picked.place} stmt={pickedBlock} onChange={(stmt) => change(replaceBlock(program, picked.place, stmt), picked.place)} onRemove={remove} />
							) : picked?.kind === 'slot' ? (
								<div className="flex flex-col gap-2">
									<div className={HEADING}>Aggiungi qui</div>
									<div className="flex flex-wrap gap-1.5">
										{(Object.keys(BLOCK_KINDS) as BlockKind[]).map((kind) => (
											<Button key={kind} variant="secondary" size="sm" onClick={() => add(kind)}>
												{BLOCK_KINDS[kind]}
											</Button>
										))}
									</div>
								</div>
							) : (
								<p className="m-0 text-fg-muted">Tocca un «+» per aggiungere un blocco in quel punto, o un blocco per cambiarlo. Il codice qui sotto segue il diagramma.</p>
							)}
						</div>
					) : (
						<>
							<div className="min-h-10 text-fg-muted" role="status" data-told>
								<Told run={run} />
							</div>
							{run.waiting && run.event.kind === 'ask' && (
								<form onSubmit={answer} className="flex flex-wrap items-center gap-2">
									<label className="flex min-w-0 flex-1 items-center gap-2">
										<i className="font-medium text-fg-strong">{run.event.name}</i>
										<span aria-hidden="true">=</span>
										<input ref={field} value={typed} onChange={(e) => setTyped(e.target.value)} aria-label={`Valore di ${run.event.name}`} autoComplete="off" className={FIELD} />
									</label>
									<Button type="submit" variant="secondary" size="sm" disabled={!typed.trim()}>
										Invio
									</Button>
									{run.refused && (
										<p className="m-0 w-full text-danger-fg" role="alert">
											{run.refused}.
										</p>
									)}
								</form>
							)}
							<div>
								<div className={HEADING}>Variabili</div>
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
								<div className={HEADING}>Uscita</div>
								{run.output.length ? (
									<pre className="m-0 max-h-40 overflow-auto rounded-lg bg-surface-2 px-2 py-1.5 font-mono text-sm text-fg-strong" data-output>
										{run.output.join('\n')}
									</pre>
								) : (
									<div className="text-fg-subtle">Ancora niente.</div>
								)}
							</div>
						</>
					)}
					<Code program={program} inputs={block.inputs} at={editing ? pickedBlock : chart.nodes[run.at].stmt} />
				</div>
			</div>
		</section>
	);
}

export function LessonChart({ source }: { source: string }) {
	const block = useMemo(() => parseChartBlock(source).block, [source]);
	return block ? <Chart block={block} /> : null;
}
