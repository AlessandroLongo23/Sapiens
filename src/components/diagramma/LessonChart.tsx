'use client';

import { useEffect, useMemo, useRef, useState, type FocusEvent, type FormEvent, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronLeft, ChevronRight, Copy, Pause, Pencil, Play, RotateCcw, Trash2, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { cn } from '@/lib/utils/cn';
import { INPUT_TYPES, parseChartBlock, parseProgram, programText, type ChartBlock, type InputType, type Stmt } from '@/lib/diagramma/blocco';
import { CODE_LANGUAGES, codeOf, codeText, type CodeLanguage } from '@/lib/diagramma/codice';
import { blockSvg, buildChart, chartSvg, type ChartNode, type Shape } from '@/lib/diagramma/disegno';
import { advance, canAdvance, startRun, type Run } from '@/lib/diagramma/esecuzione';
import { showValue, sourceOf, textOf } from '@/lib/diagramma/espressione';
import { BLOCK_KINDS, blockAt, insertBlock, moveBlock, newBlock, removeBlock, replaceBlock, rewriteBlock, type BlockKind } from '@/lib/diagramma/modifica';

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

/** The blocks to pick from, drawn as the chart draws them. */
const KINDS: Record<BlockKind, { shape: Shape; text: string }> = {
	input: { shape: 'data', text: 'leggi' },
	output: { shape: 'data', text: 'scrivi' },
	assign: { shape: 'action', text: 'assegna' },
	if: { shape: 'decision', text: 'selezione' },
	while: { shape: 'decision', text: 'ciclo' }
};

/** A field of a block being written: the text of the block itself, with a line under it and nothing around. */
const WRITE = 'min-w-0 appearance-none rounded-none border-0 border-b-2 border-fg-faint bg-transparent p-0 text-center text-sm leading-5 text-fg-strong shadow-none !outline-none !ring-0 focus:border-accent';

/**
 * A block being written, in its place on the chart: the fields stand where its text was. What is typed becomes the
 * block as soon as it can be read; until then the chart keeps the block it had, and a line under it says why.
 */
function BlockEditor({ stmt, node, onChange, onDone }: { stmt: Stmt; node: ChartNode; onChange: (stmt: Stmt) => void; onDone: () => void }) {
	const [first, setFirst] = useState(() => (stmt.kind === 'input' || stmt.kind === 'assign' ? stmt.name : stmt.kind === 'output' ? stmt.items.map((item) => sourceOf(item.tokens)).join(', ') : sourceOf(stmt.tokens)));
	const [second, setSecond] = useState(() => (stmt.kind === 'assign' ? sourceOf(stmt.tokens) : ''));
	const [type, setType] = useState<InputType | ''>(stmt.kind === 'input' ? (stmt.type ?? '') : '');
	const [error, setError] = useState<string | null>(null);
	const box = useRef<HTMLDivElement>(null);

	// the block opens with its text taken, so that typing writes over what a new block starts with
	useEffect(() => {
		const field = box.current?.querySelector('input');
		field?.focus({ preventScroll: true });
		field?.select();
	}, []);

	const write = (a: string, b: string, t: InputType | '') => {
		const line = { input: `leggi ${a}${t ? `: ${INPUT_TYPES[t]}` : ''}`, assign: `${a} = ${b}`, output: `scrivi ${a}`, if: `se ${a}`, while: `finché ${a}` }[stmt.kind];
		const named = stmt.kind !== 'input' && stmt.kind !== 'assign' ? true : /^[\p{L}_][\p{L}\d_]*$/u.test(a.trim());
		const read = named ? rewriteBlock(stmt, line) : { stmt: null, error: 'il nome di una variabile è fatto di lettere, cifre e _, senza spazi' };
		setError(read.error);
		if (read.stmt) onChange(read.stmt);
	};
	const field = (value: string, set: (value: string) => void, which: 'first' | 'second', label: string) => (
		<input
			value={value}
			onChange={(event) => {
				set(event.target.value);
				write(which === 'first' ? event.target.value : first, which === 'second' ? event.target.value : second, type);
			}}
			aria-label={label}
			autoComplete="off"
			autoCapitalize="off"
			spellCheck={false}
			className={cn(WRITE, stmt.kind === 'input' || (stmt.kind === 'assign' && which === 'first') ? 'italic' : '')}
			style={{ width: `${Math.max(value.length, 2) + 0.5}ch` }}
		/>
	);
	const pressed = (event: KeyboardEvent) => {
		if (event.key !== 'Enter' && event.key !== 'Escape') return;
		event.preventDefault();
		event.stopPropagation();
		onDone();
	};
	const left = (event: FocusEvent) => {
		if (!box.current?.contains(event.relatedTarget)) onDone();
	};

	return (
		<div ref={box} data-editor={stmt.kind} onKeyDown={pressed} onBlur={left} onPointerDown={(event) => event.stopPropagation()} className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: node.x, top: node.y + node.h / 2 }}>
			<div className="flex items-baseline gap-1 whitespace-nowrap text-sm text-fg-strong">
				{stmt.kind === 'input' && <span>leggi</span>}
				{stmt.kind === 'output' && <span>scrivi</span>}
				{field(first, setFirst, 'first', { input: 'Variabile da leggere', assign: 'Variabile', output: 'Cosa scrivere', if: 'Condizione', while: 'Condizione' }[stmt.kind])}
				{stmt.kind === 'assign' && <span aria-hidden="true">←</span>}
				{stmt.kind === 'assign' && field(second, setSecond, 'second', 'Valore che prende')}
				{(stmt.kind === 'if' || stmt.kind === 'while') && <span aria-hidden="true">?</span>}
			</div>
			{(error || stmt.kind === 'input' || stmt.kind === 'if') && (
				<div className="absolute left-1/2 flex w-max max-w-64 -translate-x-1/2 flex-col gap-1 rounded-lg border border-edge bg-surface px-2 py-1.5 text-xs text-fg-muted shadow-paper" style={{ top: `calc(50% + ${node.h / 2 + 8}px)` }}>
					{stmt.kind === 'input' && (
						<label className="flex items-center gap-1.5">
							si legge
							<select
								value={type}
								onChange={(event) => {
									const chosen = event.target.value as InputType | '';
									setType(chosen);
									write(first, second, chosen);
								}}
								aria-label="Che cosa si legge"
								className="rounded border border-edge-strong bg-page px-1 py-0.5 text-xs text-fg-strong"
							>
								<option value="">un numero o un testo</option>
								<option value="int">un numero intero</option>
								<option value="float">un numero con la virgola</option>
								<option value="str">un testo</option>
							</select>
						</label>
					)}
					{stmt.kind === 'if' && (
						<label className="flex items-center gap-1.5">
							<input type="checkbox" checked={stmt.else !== null} onChange={(event) => onChange({ ...stmt, else: event.target.checked ? [] : null })} className="size-3.5" style={{ accentColor: 'var(--accent)' }} />
							con il ramo «no»
						</label>
					)}
					{error && (
						<span className="whitespace-normal text-danger-fg" role="alert">
							Così non si legge: {error}.
						</span>
					)}
				</div>
			)}
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

/** What is being carried over the chart: a new block of a kind, or the block of the chart that was at `from`. */
type Carried = { kind: BlockKind; from?: string; html: string };

/**
 * A flowchart in a lesson (a ```diagramma block, lib/diagramma/blocco.ts).
 *
 * It runs one block at a time: the block the run is on is lit, the table beside it holds the variables, and those
 * the block reads or changes are marked, so a condition shows the values that make it true or false.
 *
 * With "Modifica" it is changed by hand: a block is carried from the row of blocks onto a line, which lights up
 * where the block would go, and is dropped there; a block of the chart is carried to another line the same way.
 * A click in a block writes in it, and the bin at its corner takes it away. The chart is its program
 * (lib/diagramma/modifica.ts), so the code beside it follows every change.
 */
function Chart({ block, onProgram, below = false }: { block: ChartBlock; /** Told the lines of the chart's program, at first and after every change. */ onProgram?: (text: string) => void; /** The column with the code goes under the chart, where the chart has little room beside it. */ below?: boolean }) {
	// the programs the chart has been, the last one being what is shown: "Annulla" drops it
	const [programs, setPrograms] = useState<{ program: Stmt[]; by: string }[]>(() => [{ program: block.program, by: '' }]);
	const [editing, setEditing] = useState(block.edit);
	/** The place of the block being written. */
	const [written, setWritten] = useState<string | null>(null);
	/** The block under the pointer, which shows its bin. */
	const [hover, setHover] = useState<string | null>(null);
	/** A block chosen with a tap from the row, waiting for the gap it goes in: the way without carrying. */
	const [armed, setArmed] = useState<BlockKind | null>(null);
	const [carried, setCarried] = useState<Carried | null>(null);
	const [hot, setHot] = useState<string | null>(null);
	// every state of the run so far: the last one is shown, and "Indietro" drops it
	const [runs, setRuns] = useState<Run[]>(() => [startRun()]);
	const [typed, setTyped] = useState('');
	const [playing, setPlaying] = useState(false);
	const field = useRef<HTMLInputElement>(null);
	const stage = useRef<HTMLDivElement>(null);
	const ghost = useRef<HTMLDivElement>(null);
	const release = useRef<(() => void) | null>(null);

	const program = programs[programs.length - 1].program;
	const chart = useMemo(() => buildChart(program, editing), [program, editing]);
	const run = runs[runs.length - 1];
	const moving = !editing && playing && canAdvance(run) && !run.waiting;
	const writtenBlock = written !== null ? blockAt(program, written) : null;
	const writtenNode = written !== null ? chart.nodes.find((node) => node.place === written) : undefined;
	const binned = editing && !carried ? chart.nodes.find((node) => node.place !== undefined && node.place === (written ?? hover)) : undefined;

	const rest = () => {
		setPlaying(false);
		setRuns([startRun()]);
		setTyped('');
	};

	/** A change to the chart. Typing in one block is one change, not one for each letter. */
	const change = (next: Stmt[], by: string) => {
		if (next === program) return;
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

	useEffect(() => {
		onProgram?.(programText(program));
		// told when the chart changes, not when who listens is made again
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [program]);

	// a block still being carried when the chart goes away is let go
	useEffect(() => () => release.current?.(), []);

	const answer = (event: FormEvent) => {
		event.preventDefault();
		step();
	};

	const calm = () => {
		setWritten(null);
		setHover(null);
		setArmed(null);
	};

	const toggleEditing = () => {
		setEditing(!editing);
		calm();
		rest();
	};

	/** A new block of `kind` in the gap at `place`, open to be written. */
	const put = (kind: BlockKind, place: string) => {
		change(insertBlock(program, place, newBlock(kind, program)), '');
		setArmed(null);
		setWritten(place);
	};

	/** The gap nearest to a point of the screen, when it is near enough to be the one meant. */
	const gapAt = (x: number, y: number): string | null => {
		const box = stage.current?.getBoundingClientRect();
		if (!box) return null;
		let best: string | null = null;
		let least = Infinity;
		for (const slot of chart.slots) {
			const dx = Math.abs(x - box.left - slot.x);
			const dy = Math.abs(y - box.top - slot.y);
			if (dx > 90 || dy > 30 || dx / 2 + dy >= least) continue;
			least = dx / 2 + dy;
			best = slot.place;
		}
		return best;
	};

	/**
	 * A press on a block. If the pointer then moves, the block is carried until it is let go, over a gap or not; if
	 * it does not, the press was a click, and `clicked` says what a click does.
	 */
	const hold = (event: PointerEvent, what: Carried, clicked: () => void) => {
		if (event.button !== 0) return;
		const from = { x: event.clientX, y: event.clientY };
		let carrying = false;
		let over: string | null = null;
		const move = (e: globalThis.PointerEvent) => {
			if (!carrying && Math.hypot(e.clientX - from.x, e.clientY - from.y) < 6) return;
			if (!carrying) {
				carrying = true;
				setWritten(null);
				setArmed(null);
				setCarried(what);
			}
			if (ghost.current) ghost.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
			const now = gapAt(e.clientX, e.clientY);
			if (now !== over) setHot((over = now));
			e.preventDefault();
		};
		const end = () => {
			window.removeEventListener('pointermove', move);
			window.removeEventListener('pointerup', up);
			window.removeEventListener('pointercancel', end);
			release.current = null;
			setCarried(null);
			setHot(null);
		};
		const up = () => {
			end();
			if (!carrying) return clicked();
			if (over === null) return;
			if (what.from === undefined) put(what.kind, over);
			else change(moveBlock(program, what.from, over), '');
		};
		window.addEventListener('pointermove', move, { passive: false });
		window.addEventListener('pointerup', up);
		window.addEventListener('pointercancel', end);
		release.current = end;
	};

	const placeUnder = (target: EventTarget) => (target instanceof Element ? (target.closest('[data-place]')?.getAttribute('data-place') ?? null) : null);
	const gapUnder = (target: EventTarget) => (target instanceof Element ? (target.closest('[data-slot]')?.getAttribute('data-slot') ?? null) : null);

	const pressedOn = (event: PointerEvent) => {
		const place = editing ? placeUnder(event.target) : null;
		const node = place !== null ? chart.nodes.find((n) => n.place === place) : undefined;
		if (place === null || !node?.stmt) return;
		hold(event, { kind: node.stmt.kind, from: place, html: blockSvg(node.shape, textOf(node.label)) }, () => setWritten(place));
	};
	const clickedOn = (event: MouseEvent) => {
		const gap = editing && armed ? gapUnder(event.target) : null;
		if (gap !== null && armed) put(armed, gap);
	};
	const keyOn = (event: KeyboardEvent) => {
		if (!editing || (event.key !== 'Enter' && event.key !== ' ')) return;
		const gap = armed ? gapUnder(event.target) : null;
		const place = placeUnder(event.target);
		if (gap !== null && armed) put(armed, gap);
		else if (place !== null) setWritten(place);
		else return;
		event.preventDefault();
	};
	const movedOn = (event: PointerEvent) => {
		if (!editing || carried || !(event.target instanceof Element) || event.target.closest('[data-bin]')) return;
		const place = placeUnder(event.target);
		if (place !== hover) setHover(place);
	};

	const remove = (place: string) => {
		change(removeBlock(program, place), '');
		setWritten(null);
		setHover(null);
	};

	const undo = () => {
		if (programs.length < 2) return;
		setPrograms(programs.slice(0, -1));
		calm();
		rest();
	};

	const restore = () => {
		setPrograms([{ program: block.program, by: '' }]);
		calm();
		rest();
	};

	const names = Object.keys(run.variables);
	const svg = chartSvg(chart, block.alt, editing ? { picked: carried?.from ?? written, writing: written, gaps: Boolean(carried || armed), hot } : { at: run.at, taken: run.taken, wrong: Boolean(run.error) });

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
			<div className={cn('grid gap-x-4', !below && 'md:grid-cols-[minmax(0,1fr)_19rem]')}>
				<div className="min-w-0">
					{editing && (
						<div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-b border-edge-soft bg-surface-2 px-2 py-2 print:hidden" role="group" aria-label="Blocchi da aggiungere">
							{(Object.keys(KINDS) as BlockKind[]).map((kind) => {
								const html = blockSvg(KINDS[kind].shape, KINDS[kind].text);
								return (
									<button
										key={kind}
										type="button"
										data-block={kind}
										aria-pressed={armed === kind}
										aria-label={`Blocco ${BLOCK_KINDS[kind]}`}
										title={`${BLOCK_KINDS[kind]}: trascinalo su una freccia`}
										onPointerDown={(event) => hold(event, { kind, html }, () => {})}
										onClick={() => setArmed(armed === kind ? null : kind)}
										className={cn('cursor-grab touch-none rounded-lg p-0.5 focus-ring', armed === kind ? 'bg-accent-soft ring-2 ring-accent' : 'hover:bg-surface-3')}
										style={{ zoom: 0.85 }}
										dangerouslySetInnerHTML={{ __html: html }}
									/>
								);
							})}
						</div>
					)}
					<div className="overflow-x-auto px-2 py-3">
						<div ref={stage} className="relative mx-auto" style={{ width: chart.width, height: chart.height }} onPointerDown={pressedOn} onClick={clickedOn} onKeyDown={keyOn} onPointerMove={movedOn} onPointerLeave={() => setHover(null)}>
							{/* The drawing is ours (lib/diagramma/disegno.ts), with every text of the chart escaped. */}
							<div dangerouslySetInnerHTML={{ __html: svg }} />
							{editing && writtenBlock && writtenNode && written !== null && <BlockEditor key={written} stmt={writtenBlock} node={writtenNode} onChange={(stmt) => change(replaceBlock(program, written, stmt), written)} onDone={() => setWritten(null)} />}
							{binned?.place !== undefined && (
								<button
									type="button"
									data-bin
									// the bin is pressed while a block is being written: it must not take the focus first, which would close the block
									onPointerDown={(event) => (event.stopPropagation(), event.preventDefault())}
									onClick={() => remove(binned.place!)}
									aria-label={`Elimina il blocco ${textOf(binned.label)}`}
									title="Elimina il blocco"
									className="absolute z-20 flex size-6 items-center justify-center rounded-full border border-edge-strong bg-surface text-fg-muted shadow-paper hover:border-danger hover:text-danger-fg focus-ring"
									style={{ left: binned.x + binned.w / 2 - 8, top: binned.y - 14 }}
								>
									<Trash2 className="size-3.5" aria-hidden="true" />
								</button>
							)}
						</div>
					</div>
				</div>
				<div className={cn('flex min-w-0 flex-col gap-3 border-edge p-3 text-sm print:hidden', below ? 'border-t' : 'max-md:order-first max-md:border-b md:border-l')}>
					{editing ? (
						<p className="m-0 text-fg-muted" data-edit>
							{armed ? <>Ora tocca il «+» sulla freccia dove va il blocco.</> : <>Trascina un blocco su una freccia: si accende il punto dove andrà. Clicca dentro un blocco per scriverlo; il cestino al suo angolo lo toglie.</>}
						</p>
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
											const changed = run.written === name;
											return (
												<div
													key={name}
													role="row"
													data-variable={name}
													data-marked={changed ? 'written' : read ? 'read' : undefined}
													className={cn('flex items-baseline justify-between gap-3 border-t border-edge-soft px-2 py-1 first:border-t-0', changed ? 'bg-accent-soft' : read && 'bg-warn-soft')}
												>
													<span role="rowheader" className="italic text-fg-strong">
														{name}
													</span>
													<span role="cell" className={cn('min-w-0 break-words text-right font-mono text-fg-strong', changed && 'font-semibold')}>
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
					{block.code && <Code program={program} inputs={block.inputs} at={editing ? writtenBlock : chart.nodes[run.at].stmt} />}
				</div>
			</div>
			{/* The block being carried follows the pointer over the whole page: it hangs from the body, where no box of the lesson clips or shifts it. */}
			{carried &&
				createPortal(
					<div ref={ghost} data-carried={carried.kind} className="pointer-events-none fixed left-0 top-0 z-[100] opacity-85 drop-shadow-lg" style={{ transform: 'translate(-200px, -200px)' }} dangerouslySetInnerHTML={{ __html: carried.html }} />,
					document.body
				)}
		</section>
	);
}

export function LessonChart({ source }: { source: string }) {
	const block = useMemo(() => parseChartBlock(source).block, [source]);
	return block ? <Chart block={block} /> : null;
}

/**
 * A flowchart built as the answer to an exercise: it opens ready to be changed, from `start`, and `onProgram` is
 * told the lines of its program at every change, for who hands it in.
 */
export function ChartBuilder({ start, code = true, onProgram }: { start: string; /** Whether the program of the chart is shown beside it. */ code?: boolean; onProgram: (text: string) => void }) {
	const block = useMemo<ChartBlock>(() => ({ name: 'esercizio', alt: 'Il diagramma di flusso che stai costruendo', inputs: [], program: parseProgram(start, true).program, edit: true, code }), [start, code]);
	return <Chart block={block} onProgram={onProgram} below />;
}
