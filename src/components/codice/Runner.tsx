'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Field';
import { cn } from '@/lib/utils/cn';
import { EXAMPLES } from './examples';
import { Python, TIME_LIMIT, type Chunk, type Outcome } from './python';
import type { Stage } from './turtle';
import { TurtleCanvas } from './TurtleCanvas';

const Editor = dynamic(() => import('./Editor'), {
	ssr: false,
	loading: () => <p className="p-4 text-sm text-fg-subtle">Carico l&apos;editor…</p>
});

/** idle: nothing running. loading: Python is downloading. running: the program runs. waiting: it asked for a line. */
type Phase = 'idle' | 'loading' | 'running' | 'waiting';

const STATUS: Record<Phase, string> = {
	idle: '',
	loading: 'Carico Python…',
	running: 'In esecuzione…',
	waiting: 'Aspetta una risposta'
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

/** What Sapiens says when a run is over; an error needs nothing, Python's own message is already there. */
function closing(outcome: Outcome, ms: number): string | null {
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
			return 'Python non si è caricato. Controlla la connessione e riprova.';
		default:
			return null;
	}
}

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
 * A Python program and its console, side by side: write, run, answer the program's questions in the console.
 * The program runs in the browser (python.worker.ts); Python is downloaded at the first click in the editor or the
 * first run, not with the page.
 */
export function Runner() {
	const [example, setExample] = useState(0);
	/** Counts the programs loaded in the editor, which reads its text only when it is made. */
	const [loaded, setLoaded] = useState(0);
	const [phase, setPhase] = useState<Phase>('idle');
	const [chunks, setChunks] = useState<Chunk[]>([]);
	/** What the worker is doing before the program starts, like loading numpy. */
	const [status, setStatus] = useState('');
	/** The program used the turtle: its canvas is at the top of the console. */
	const [drawing, setDrawing] = useState(false);

	const code = useRef(EXAMPLES[0].code);
	const python = useRef<Python | null>(null);
	/** The lines typed at the program's `input()` in this run, and the seed that makes each rerun repeat the first. */
	const inputs = useRef<string[]>([]);
	const seed = useRef(0);
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

	const runtime = () => (python.current ??= new Python());

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

	/** A new program, or a new run: an empty console and no drawing. */
	const clear = () => {
		pending.current = [];
		strokes.current = [];
		setChunks([]);
		setDrawing(false);
	};

	const settle = (next: Phase) => {
		waiting.current = next === 'waiting';
		setStatus('');
		setPhase(next);
	};

	const execute = async () => {
		const mine = ++turn.current;
		const py = runtime();
		settle(py.ready ? 'running' : 'loading');
		void py.load().then((ok) => {
			if (ok && mine === turn.current) setPhase((now) => (now === 'loading' ? 'running' : now));
		});
		const { outcome, ms } = await py.run(code.current, inputs.current, seed.current, {
			onChunk: receive,
			onStatus: (text) => mine === turn.current && setStatus(text),
			onStart: () => mine === turn.current && setStatus('')
		});
		if (mine !== turn.current) return;
		const note = closing(outcome, ms);
		if (note) pending.current.push({ kind: 'note', text: note });
		// the last lines and the end of the run reach the screen together
		flush();
		settle(outcome === 'input' ? 'waiting' : 'idle');
	};

	const run = () => {
		inputs.current = [];
		seed.current = Math.floor(Math.random() * 2 ** 31);
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

	/** Ends the run from outside the worker: the program was waiting for a line, so nothing is running there. */
	const close = (note: string) => {
		turn.current++;
		pending.current.push({ kind: 'note', text: note });
		flush();
		settle('idle');
	};

	const stop = () => {
		if (waiting.current) close('Interrotto.');
		else python.current?.stop();
	};

	const edit = (text: string) => {
		code.current = text;
		// the lines typed so far answered the old program
		if (waiting.current) close('Hai cambiato il programma: eseguilo di nuovo.');
	};

	const choose = (index: number) => {
		if (phase !== 'idle') stop();
		code.current = EXAMPLES[index].code;
		clear();
		setExample(index);
		setLoaded((n) => n + 1);
	};

	useEffect(() => {
		const node = log.current;
		if (node) node.scrollTop = node.scrollHeight;
	}, [chunks, phase]);

	useEffect(
		() => () => {
			cancelAnimationFrame(frame.current);
			python.current?.dispose();
		},
		[]
	);

	return (
		<section className="overflow-hidden rounded-2xl border border-edge bg-surface shadow-paper" aria-label="Editor di Python">
			<div className="flex flex-wrap items-center gap-2 border-b border-edge px-3 py-2">
				<div className="w-56 max-w-full">
					<Select aria-label="Esempio" value={example} onChange={(e) => choose(Number(e.target.value))} className="py-1.5 text-sm">
						{EXAMPLES.map(({ title }, i) => (
							<option key={title} value={i}>
								{title}
							</option>
						))}
					</Select>
				</div>
				<p className="ml-auto text-sm text-fg-subtle" role="status">
					{status || STATUS[phase]}
				</p>
				{phase !== 'idle' && (
					<Button variant="secondary" size="sm" onClick={stop}>
						<Square className="size-3.5" aria-hidden="true" />
						Ferma
					</Button>
				)}
				<Button size="sm" onClick={run} disabled={phase === 'loading' || phase === 'running'} title="Ctrl+Invio, o ⌘+Invio sul Mac">
					<Play className="size-3.5" aria-hidden="true" />
					Esegui
				</Button>
			</div>
			<div className="grid lg:grid-cols-2">
				<div className="h-[20rem] border-b border-edge lg:h-[32rem] lg:border-r lg:border-b-0" onFocus={() => void runtime().load()}>
					<Editor key={loaded} initial={EXAMPLES[example].code} label="Programma" onChange={edit} onRun={run} />
				</div>
				<div
					ref={log}
					role="log"
					aria-label="Console"
					className="h-[16rem] overflow-auto bg-surface-2 px-4 py-3 font-mono text-[0.9375rem] leading-[1.65] break-words whitespace-pre-wrap text-fg lg:h-[32rem]"
					onClick={() => field.current?.focus()}
				>
					{drawing && <TurtleCanvas onStage={attach} />}
					{chunks.length === 0 && !drawing && phase === 'idle' && <span className="font-sans text-fg-faint">Quello che il programma stampa compare qui.</span>}
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
				</div>
			</div>
		</section>
	);
}
