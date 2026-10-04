'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Check, Lightbulb, ListChecks, Play, RotateCcw, Square, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { tidy, type Test } from '@/lib/codice/blocco';
import { LANGUAGES, TIME_LIMIT, type Chunk, type Language, type Outcome } from './runtime';
import { retain, runtimeFor } from './runtimes';
import type { Stage } from './turtle';
import { TurtleCanvas } from './TurtleCanvas';

const Editor = dynamic(() => import('./Editor'), {
	ssr: false,
	loading: () => <p className="p-4 text-sm text-fg-subtle">Carico l&apos;editor…</p>
});

/** How a test went: `got` is what the program printed, or why it stopped. */
interface Verdict {
	passed: boolean;
	got: string;
}

/** idle: nothing running. loading: the language is downloading. running: the program runs. waiting: it asked for a line. checking: the tests run. */
type Phase = 'idle' | 'loading' | 'running' | 'waiting' | 'checking';

const STATUS: Record<Phase, string> = {
	idle: '',
	loading: 'Carico…',
	running: 'In esecuzione…',
	waiting: 'Aspetta una risposta',
	checking: 'Verifico…'
};

/** How each piece looks; images and turtle operations never reach the text (receive, below). */
const CHUNK: Record<Exclude<Chunk['kind'], 'image'>, string> = {
	out: '',
	err: 'text-danger-fg',
	in: 'font-semibold text-fg-strong',
	note: 'block font-sans text-fg-subtle italic',
	turtle: 'hidden'
};

const time = (ms: number) => (ms < 1000 ? `${Math.max(1, Math.round(ms))} ms` : `${(ms / 1000).toFixed(1).replace('.', ',')} s`);

/** What Sapiens says when a run is over; an error needs nothing, the language's own message is already there. */
function closing(outcome: Outcome, ms: number, language: Language): string | null {
	switch (outcome) {
		case 'ok':
			return `Programma finito in ${time(ms)}.`;
		case 'overflow':
			return 'Fermato: il programma ha stampato troppo. C’è forse un ciclo che non finisce?';
		case 'timeout':
			return `Fermato dopo ${TIME_LIMIT / 1000} secondi. C’è forse un ciclo che non finisce?`;
		case 'stopped':
			return 'Interrotto.';
		case 'failed':
			return `${language === 'c' || language === 'cpp' ? 'Il compilatore non si è caricato' : `${LANGUAGES[language]} non si è caricato`}. Controlla la connessione e riprova.`;
		default:
			return null;
	}
}

/** Why a test's run gave no answer to compare. */
const FAILURE: Partial<Record<Outcome, string>> = {
	overflow: 'Il programma ha stampato troppo.',
	timeout: `Fermato dopo ${TIME_LIMIT / 1000} secondi.`,
	stopped: 'Interrotto.',
	failed: 'Il linguaggio non si è caricato.'
};

/** Adds pieces to the console, joining a piece to the one before when they are of the same kind. */
function joined(chunks: Chunk[], more: Chunk[]): Chunk[] {
	const next = chunks.slice();
	for (const chunk of more) {
		const last = next[next.length - 1];
		if (last && last.kind === chunk.kind && chunk.kind !== 'note' && chunk.kind !== 'image') next[next.length - 1] = { kind: last.kind, text: last.text + chunk.text };
		else next.push(chunk);
	}
	return next;
}

/**
 * A program and its console, side by side: write, run, answer the program's questions in the console. With `tests`
 * it is an exercise: "Verifica" runs the program on each test's input and compares what it prints.
 *
 * The program runs in the browser, in the sandbox (sandbox.ts); the language is downloaded
 * at the first click in the editor or the first run, not with the page. A new `initial` or `language` needs a new `key`.
 */
export function Workbench({
	language,
	initial,
	tests,
	solution,
	toolbar,
	compact = false,
	onEdit
}: {
	language: Language;
	initial: string;
	tests?: Test[];
	/** A program that passes the tests, behind a button. */
	solution?: string | null;
	/** At the left of the bar, before the buttons: the tool page puts its menus here. */
	toolbar?: ReactNode;
	/** For a program inside a lesson: the console under the editor, each as tall as what it holds. */
	compact?: boolean;
	onEdit?: (code: string) => void;
}) {
	/** The program put in the editor, which reads its text only when it is made: the starting one, or the solution. */
	const [loaded, setLoaded] = useState({ text: initial, count: 0 });
	const [phase, setPhase] = useState<Phase>('idle');
	const [chunks, setChunks] = useState<Chunk[]>([]);
	/** What is happening before the program starts, like loading numpy or compiling. */
	const [status, setStatus] = useState('');
	/** The program used the turtle: its canvas is at the top of the console. */
	const [drawing, setDrawing] = useState(false);
	const [verdicts, setVerdicts] = useState<Verdict[] | null>(null);
	const [edited, setEdited] = useState(false);

	const code = useRef(initial);
	/** The lines typed at the program's input in this run, and what makes each rerun repeat the first. */
	const inputs = useRef<string[]>([]);
	const seed = useRef(0);
	const clock = useRef(0);
	/** Counts the runs, so the end of one that was replaced or stopped is not written in the console of the next. */
	const turn = useRef(0);
	const waiting = useRef(false);
	const pending = useRef<Chunk[]>([]);
	const frame = useRef(0);
	const log = useRef<HTMLDivElement>(null);
	const field = useRef<HTMLInputElement>(null);
	const stage = useRef<Stage | null>(null);
	/** Every turtle operation of this run, so a canvas made again (React mounts twice in development) draws them all. */
	const strokes = useRef<Parameters<Stage['push']>[0]>([]);

	const flush = useCallback(() => {
		cancelAnimationFrame(frame.current);
		frame.current = 0;
		const more = pending.current;
		pending.current = [];
		if (more.length) setChunks((shown) => joined(shown, more));
	}, []);

	// A program can print thousands of lines in a moment: they reach the screen once per frame.
	const append = useCallback(
		(chunk: Chunk) => {
			pending.current.push(chunk);
			if (!frame.current) frame.current = requestAnimationFrame(flush);
		},
		[flush]
	);

	const receive = useCallback(
		(chunk: Chunk) => {
			if (chunk.kind !== 'turtle') return append(chunk);
			const ops = JSON.parse(chunk.text);
			strokes.current.push(...ops);
			if (stage.current) stage.current.push(ops);
			else setDrawing(true);
		},
		[append]
	);

	const attach = useCallback((player: Stage | null) => {
		stage.current = player;
		if (player && strokes.current.length) player.push(strokes.current);
	}, []);

	/** A new run: an empty console and no drawing. */
	const clear = () => {
		pending.current = [];
		strokes.current = [];
		setChunks([]);
		setDrawing(false);
		setVerdicts(null);
	};

	const settle = (next: Phase) => {
		waiting.current = next === 'waiting';
		setStatus('');
		setPhase(next);
	};

	const execute = async () => {
		const mine = ++turn.current;
		const runtime = runtimeFor(language);
		settle(runtime.ready ? 'running' : 'loading');
		void runtime.load().then((ok) => {
			if (ok && mine === turn.current) setPhase((now) => (now === 'loading' ? 'running' : now));
		});
		const { outcome, ms } = await runtime.run(
			{ language, source: code.current, inputs: inputs.current, seed: seed.current, clock: clock.current },
			{
				onChunk: receive,
				onStatus: (text) => mine === turn.current && setStatus(text),
				onStart: () => mine === turn.current && setStatus('')
			}
		);
		if (mine !== turn.current) return;
		const note = closing(outcome, ms, language);
		if (note) pending.current.push({ kind: 'note', text: note });
		// the last lines and the end of the run reach the screen together
		flush();
		settle(outcome === 'input' ? 'waiting' : 'idle');
	};

	const run = () => {
		inputs.current = [];
		seed.current = Math.floor(Math.random() * 2 ** 31);
		clock.current = Date.now();
		clear();
		void execute();
	};

	const answer = (event: FormEvent) => {
		event.preventDefault();
		const line = field.current?.value ?? '';
		append({ kind: 'in', text: `${line}\n` });
		inputs.current = [...inputs.current, line];
		void execute();
	};

	/** Runs the program once per test, with the test's lines as its input and no keyboard. */
	const check = async () => {
		if (!tests) return;
		const mine = ++turn.current;
		const runtime = runtimeFor(language);
		clear();
		settle('checking');
		const results: Verdict[] = [];
		for (const test of tests) {
			let printed = '';
			let errors = '';
			const { outcome } = await runtime.run(
				{ language, source: code.current, inputs: test.input === '' ? [] : test.input.replace(/\n$/, '').split('\n'), seed: 1, clock: Date.now(), batch: true },
				{
					onChunk: ({ kind, text }) => {
						if (kind === 'out') printed += text;
						else if (kind === 'err') errors += text;
					},
					onStatus: (text) => mine === turn.current && setStatus(text),
					onStart: () => mine === turn.current && setStatus('')
				}
			);
			if (mine !== turn.current) return;
			const failure = FAILURE[outcome] ?? (outcome === 'error' ? tidy(errors) || 'Il programma si è fermato con un errore.' : null);
			results.push(failure ? { passed: false, got: failure } : { passed: tidy(printed) === tidy(test.output), got: tidy(printed) });
			setVerdicts([...results]);
			// a program that does not compile, or never ends, fails every test the same way
			if (outcome === 'stopped' || outcome === 'failed' || outcome === 'timeout') break;
		}
		settle('idle');
	};

	/** Ends the run from outside the worker: the program was waiting for a line, so nothing is running there. */
	const close = (note: string) => {
		turn.current++;
		pending.current.push({ kind: 'note', text: note });
		flush();
		settle('idle');
	};

	const stop = () => {
		if (waiting.current) close('Interrotto.');
		else runtimeFor(language).stop();
	};

	const edit = (text: string) => {
		code.current = text;
		setEdited(text !== initial);
		onEdit?.(text);
		// the lines typed so far answered the old program
		if (waiting.current) close('Hai cambiato il programma: eseguilo di nuovo.');
	};

	const put = (text: string) => {
		if (phase !== 'idle') stop();
		code.current = text;
		setEdited(text !== initial);
		onEdit?.(text);
		clear();
		setLoaded(({ count }) => ({ text, count: count + 1 }));
	};

	useEffect(() => {
		const node = log.current;
		// a run is followed at its last line, the tests are read from the first
		if (node) node.scrollTop = verdicts ? 0 : node.scrollHeight;
	}, [chunks, phase, verdicts]);

	useEffect(() => {
		const release = retain();
		return () => {
			cancelAnimationFrame(frame.current);
			// a counter, not a node: the run in flight must find it changed
			// eslint-disable-next-line react-hooks/exhaustive-deps
			turn.current++;
			release();
		};
	}, []);

	const busy = phase === 'loading' || phase === 'running' || phase === 'checking';

	const passed = verdicts?.filter((v) => v.passed).length ?? 0;

	return (
		<section className="not-prose overflow-hidden rounded-2xl border border-edge bg-surface shadow-paper" aria-label={`Editor di ${LANGUAGES[language]}`}>
			<div className="relative flex flex-wrap items-center gap-2 border-b border-edge px-3 py-2">
				{toolbar ?? <span className="label-mono px-1 text-fg-subtle">{LANGUAGES[language]}</span>}
				<p className="ml-auto text-sm text-fg-subtle" role="status">
					{status || STATUS[phase]}
				</p>
				{edited && phase === 'idle' && (
					<Button variant="ghost" size="sm" onClick={() => put(initial)} title="Rimetti il programma di partenza">
						<RotateCcw className="size-3.5" aria-hidden="true" />
						<span className="max-sm:sr-only">Ripristina</span>
					</Button>
				)}
				{solution && phase === 'idle' && loaded.text !== solution && (
					<Button variant="ghost" size="sm" onClick={() => put(solution)} title="Metti la soluzione nell’editor">
						<Lightbulb className="size-3.5" aria-hidden="true" />
						<span className="max-sm:sr-only">Soluzione</span>
					</Button>
				)}
				{phase !== 'idle' && (
					<Button variant="secondary" size="sm" onClick={stop}>
						<Square className="size-3.5" aria-hidden="true" />
						Ferma
					</Button>
				)}
				<Button variant={tests ? 'secondary' : 'primary'} size="sm" onClick={run} disabled={busy} title="Ctrl+Invio, o ⌘+Invio sul Mac">
					<Play className="size-3.5" aria-hidden="true" />
					Esegui
				</Button>
				{tests && (
					<Button size="sm" onClick={check} disabled={busy}>
						<ListChecks className="size-3.5" aria-hidden="true" />
						Verifica
					</Button>
				)}
			</div>
			<div className={cn('grid', !compact && 'lg:grid-cols-2')}>
				<div className={cn('border-b border-edge', compact ? 'max-h-[26rem] overflow-auto' : 'h-[20rem] lg:h-[32rem] lg:border-r lg:border-b-0')} onFocus={() => void runtimeFor(language).load()}>
					<Editor key={loaded.count} initial={loaded.text} language={language} label="Programma" minimap={!compact} onChange={edit} onRun={run} />
				</div>
				<div
					ref={log}
					role="log"
					aria-label="Console"
					className={cn('overflow-auto bg-surface-2 px-4 py-3 font-mono text-[0.9375rem] leading-[1.65] break-words whitespace-pre-wrap text-fg', compact ? 'max-h-[26rem] min-h-[4.5rem]' : 'h-[16rem] lg:h-[32rem]')}
					onClick={() => field.current?.focus()}
				>
					{drawing && <TurtleCanvas onStage={attach} />}
					{chunks.length === 0 && !drawing && !verdicts && phase === 'idle' && (
						<span className="font-sans text-fg-faint">{tests ? 'Esegui per provare il programma, Verifica per controllarlo sulle prove.' : 'Quello che il programma stampa compare qui.'}</span>
					)}
					{chunks.map((chunk, i) =>
						chunk.kind === 'image' ? (
							// eslint-disable-next-line @next/next/no-img-element -- a figure made in the browser, as a data URL
							<img key={i} src={`data:image/png;base64,${chunk.text}`} alt="Grafico disegnato dal programma" className="my-2 block max-w-full rounded-lg border border-edge bg-white" />
						) : (
							<span key={i} className={cn(CHUNK[chunk.kind])}>
								{chunk.text}
							</span>
						)
					)}
					{phase === 'waiting' && (
						<form className="inline" onSubmit={answer}>
							<input
								ref={field}
								autoFocus
								aria-label="Risposta al programma"
								autoCapitalize="off"
								autoCorrect="off"
								autoComplete="off"
								spellCheck={false}
								enterKeyHint="send"
								className="w-48 max-w-full border-0 border-b border-edge-strong bg-transparent p-0 font-semibold text-fg-strong outline-none focus:border-accent focus:ring-0 max-sm:text-base"
							/>
						</form>
					)}
					{verdicts && tests && (
						<div className="font-sans whitespace-normal" aria-label="Esito delle prove">
							{phase === 'idle' && (
								<p className={cn('m-0! mb-3! font-semibold', passed === tests.length ? 'text-ok-fg' : 'text-fg-strong')}>
									{passed === tests.length ? `Tutte le ${tests.length} prove superate.` : passed === 1 ? `1 prova superata su ${tests.length}.` : `${passed} prove superate su ${tests.length}.`}
								</p>
							)}
							{/* not a list element: the lesson's own list styles would number it */}
							<div role="list" className="flex flex-col gap-2">
								{verdicts.map((verdict, i) => (
									<div role="listitem" key={i} className={cn('rounded-lg border px-3 py-2', verdict.passed ? 'border-ok-edge bg-ok-soft' : 'border-danger-edge bg-danger-soft')}>
										<p className={cn('m-0! flex items-center gap-1.5 text-sm font-semibold', verdict.passed ? 'text-ok-fg' : 'text-danger-fg')}>
											{verdict.passed ? <Check className="size-4" aria-hidden="true" /> : <X className="size-4" aria-hidden="true" />}
											Prova {i + 1}: {verdict.passed ? 'superata' : 'non superata'}
										</p>
										{!verdict.passed && (
											<dl className="m-0! mt-2! grid gap-x-3 gap-y-1 text-sm sm:grid-cols-[auto_1fr] [&>dd]:m-0 [&>dt]:m-0">
												{tests[i].input !== '' && (
													<>
														<dt className="text-fg-subtle">Ingresso</dt>
														<dd className="font-mono whitespace-pre-wrap text-fg">{tests[i].input.trimEnd()}</dd>
													</>
												)}
												<dt className="text-fg-subtle">Atteso</dt>
												<dd className="font-mono whitespace-pre-wrap text-fg">{tidy(tests[i].output)}</dd>
												<dt className="text-fg-subtle">Ottenuto</dt>
												<dd className="font-mono whitespace-pre-wrap text-fg">{verdict.got || '(niente)'}</dd>
											</dl>
										)}
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
