'use client';

import { lazy, Suspense, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Info, Keyboard, RotateCcw } from 'lucide-react';
import { ANSWER_LAYOUT, loadMathLive, useKeyboardChoice } from '@/components/math/mathlive';
import { Button } from '@/components/ui/Button';
import { judgeSliders, type GuidedData, type PageStop } from '@/lib/guidato/blocco';
import { cn } from '@/lib/utils/cn';

/**
 * A guided exercise of a lesson, in the browser (lib/guidato/blocco.ts). The worked example is already in the page,
 * typeset by the server; this component only decides how much of it shows, and puts under each question what the
 * student answers with. A stop lets the rest through when it is answered right, when the student asks to be shown
 * the step, or when the student goes on without answering; in the last case it stays open, to come back to.
 *
 * Nothing is saved to the account: the lesson is free and the exercise is not part of the progress. Where the
 * student got to is remembered for the visit, in this tab, so that a reload does not start it again.
 */

/** `open`: waiting, the rest hidden. `skipped`: still unanswered, the rest shown. */
type Status = 'open' | 'correct' | 'shown' | 'skipped';
type Message = { html: string } | { text: string; hint?: string };

const WRONG = 'Non è la risposta giusta. Ricontrolla i conti e riprova, oppure fatti mostrare il passaggio.';
const WRONG_SLIDER = 'Non è ancora al posto giusto. Muovi il cursore e riprova, oppure fatti mostrare il passaggio.';
const TOO_MANY = 'Hai fatto molti tentativi in poco tempo. Aspetta un minuto e riprova, oppure fatti mostrare il passaggio.';
/** Wrong answers at one stop after which showing the step is put forward: by then the student is guessing. */
const NUDGE_AFTER = 3;
const UNREACHABLE = 'Non riesco a controllare la risposta in questo momento. Riprova tra poco, oppure fatti mostrare il passaggio.';
const LAYOUTS = [ANSWER_LAYOUT];

const LessonPlot = lazy(() => import('@/components/grafico/LessonPlot'));
const MathField = lazy(() => import('@/components/math/MathField').then((m) => ({ default: m.MathField })));

const storageKey = (name: string) => `sapiens:guidato:${location.pathname}:${name}`;

function remembered(name: string, stops: number): Status[] {
	const fresh = Array.from({ length: stops }, (): Status => 'open');
	try {
		const saved: unknown = JSON.parse(sessionStorage.getItem(storageKey(name)) ?? 'null');
		if (Array.isArray(saved) && saved.length === stops && saved.every((s) => s === 'open' || s === 'correct' || s === 'shown' || s === 'skipped')) return saved as Status[];
	} catch {
		// storage blocked or its content not ours: the exercise starts from the beginning
	}
	return fresh;
}

function remember(name: string, status: Status[]) {
	try {
		if (status.every((s) => s === 'open')) sessionStorage.removeItem(storageKey(name));
		else sessionStorage.setItem(storageKey(name), JSON.stringify(status));
	} catch {
		// not remembered, still good for this page
	}
}

export default function Guided({ data, section }: { data: GuidedData; section: HTMLElement }) {
	const [status, setStatus] = useState<Status[]>(() => remembered(data.name, data.stops.length));
	// a new run gives every stop a new field
	const [run, setRun] = useState(0);
	const stopElements = useMemo(() => [...section.querySelectorAll<HTMLElement>(':scope > .guided-body > .guided-stop')], [section]);
	const end = useMemo(() => section.querySelector<HTMLElement>(':scope > .guided-body > .guided-end'), [section]);
	/** Where the reader is taken once the page has changed: the answer of a stop, or the text after it. */
	const moved = useRef<{ stop: number; to: Status } | null>(null);

	// The page follows the state: what comes after an open stop waits, and an answer shows once its stop is settled.
	useLayoutEffect(() => {
		let waiting = false;
		let n = 0;
		for (const element of section.querySelectorAll<HTMLElement>(':scope > .guided-body > *')) {
			element.classList.toggle('guided-wait', waiting);
			if (!element.classList.contains('guided-stop')) continue;
			const state = status[n++] ?? 'open';
			element.setAttribute('data-state', state);
			element.querySelector('.guided-answer')?.classList.toggle('guided-wait', state !== 'correct' && state !== 'shown');
			const verdict = element.querySelector('.guided-verdict');
			if (verdict) verdict.textContent = state === 'correct' ? 'Giusto. ' : '';
			if (state === 'open') waiting = true;
		}
		section.setAttribute('data-ready', '');
	}, [section, status]);

	// Taken away, the component leaves the worked example as it was published.
	useEffect(
		() => () => {
			section.removeAttribute('data-ready');
			section.querySelectorAll('.guided-wait').forEach((element) => element.classList.remove('guided-wait'));
			section.querySelectorAll('.guided-verdict').forEach((element) => (element.textContent = ''));
		},
		[section]
	);

	// What has just appeared takes the focus, which is how a screen reader comes to read it, and comes into view.
	useEffect(() => {
		const move = moved.current;
		moved.current = null;
		if (!move) return;
		const stop = stopElements[move.stop];
		const target = move.to === 'open' ? section : move.to === 'skipped' ? (stop?.nextElementSibling as HTMLElement | null) : stop?.querySelector<HTMLElement>('.guided-answer');
		if (!target) return;
		target.focus({ preventScroll: true });
		target.scrollIntoView({ block: move.to === 'open' ? 'start' : 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
	}, [status, section, stopElements]);

	const settle = (stop: number, to: Status) => {
		moved.current = { stop, to };
		setStatus((old) => {
			const next = old.map((s, i) => (i === stop ? to : s));
			remember(data.name, next);
			return next;
		});
	};
	const restart = () => {
		moved.current = { stop: 0, to: 'open' };
		const next = data.stops.map((): Status => 'open');
		remember(data.name, next);
		setStatus(next);
		setRun((r) => r + 1);
	};

	const firstOpen = status.indexOf('open');
	const pending = status.filter((s) => s === 'skipped').length;

	return (
		<>
			{data.stops.map((stop, i) => {
				const live = stopElements[i]?.querySelector<HTMLElement>(':scope > .guided-live');
				// a stop still behind an open one has nothing to show, and loads nothing
				if (!live || (firstOpen >= 0 && i > firstOpen)) return null;
				return createPortal(<Stop key={`${run}:${i}`} stop={stop} status={status[i]} section={section} onSettle={(to) => settle(i, to)} />, live, `${run}:${i}`);
			})}
			{end &&
				firstOpen < 0 &&
				createPortal(
					<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-edge pt-3 text-sm text-fg-subtle">
						<span>{pending === 0 ? 'Sei arrivato in fondo all’esercizio guidato.' : pending === 1 ? 'Sei arrivato in fondo. Una domanda è rimasta in sospeso: puoi tornarci.' : `Sei arrivato in fondo. ${pending} domande sono rimaste in sospeso: puoi tornarci.`}</span>
						<Button variant="ghost" size="sm" onClick={restart}>
							<RotateCcw className="size-4" aria-hidden="true" />
							Ricomincia
						</Button>
					</div>,
					end
				)}
		</>
	);
}

interface StopProps<S extends PageStop = PageStop> {
	stop: S;
	status: Status;
	section: HTMLElement;
	onSettle: (to: Status) => void;
}

function Stop({ stop, ...rest }: StopProps) {
	if (stop.kind === 'write') return <WriteStop stop={stop} {...rest} />;
	if (stop.kind === 'choice') return <ChoiceStop stop={stop} {...rest} />;
	return <SliderStop stop={stop} {...rest} />;
}

const settled = (status: Status) => status === 'correct' || status === 'shown';

/** What a wrong answer gets back. Always in the page, so that a screen reader hears it arrive. */
function Feedback({ message, attempt }: { message: Message | null; attempt: number }) {
	return (
		<div role="status" aria-live="polite">
			{message && (
				<div key={attempt} className="mt-3 flex items-start gap-2.5 rounded-lg border border-warn-edge bg-warn-soft px-3 py-2 text-fg">
					<Info className="mt-1 size-4 shrink-0 text-warn-fg" aria-hidden="true" />
					<div className="min-w-0">
						{'html' in message ? <span dangerouslySetInnerHTML={{ __html: message.html }} /> : message.text}
						{'hint' in message && message.hint && <div className="mt-1" dangerouslySetInnerHTML={{ __html: message.hint }} />}
					</div>
				</div>
			)}
		</div>
	);
}

/** The three ways out of a stop. Going on leaves it open: the button is not offered twice. */
function Actions({ status, busy = false, mistakes = 0, onConfirm, onSettle }: { status: Status; busy?: boolean; mistakes?: number; onConfirm: () => void; onSettle: (to: Status) => void }) {
	const nudge = mistakes >= NUDGE_AFTER;
	return (
		<>
			<div role="status" aria-live="polite">
				{nudge && <div className="mt-3 text-sm font-medium text-fg">Vuoi vedere come si fa? Puoi farti mostrare il passaggio e andare avanti.</div>}
			</div>
			<div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
				<Button variant={nudge ? 'secondary' : 'inverse'} onClick={onConfirm} loading={busy}>
					Conferma
				</Button>
				<Button variant={nudge ? 'inverse' : 'secondary'} onClick={() => onSettle('shown')}>
					Mostra il passaggio
				</Button>
				{status === 'open' && (
					<Button variant="link" className="min-h-[44px] px-1 text-sm font-medium" onClick={() => onSettle('skipped')}>
						Vai avanti senza rispondere
					</Button>
				)}
			</div>
			{status === 'skipped' && <div className="mt-2 text-sm text-fg-subtle">Hai lasciato questa domanda in sospeso: puoi rispondere quando vuoi.</div>}
		</>
	);
}

/** The message of a stop, how many it has had, and how many of them answered a wrong answer (`wrong`). */
function useFeedback(): [Message | null, number, (message: Message | null, wrong?: boolean) => void, number] {
	const [state, setState] = useState<{ message: Message | null; attempt: number; mistakes: number }>({ message: null, attempt: 0, mistakes: 0 });
	const set = useCallback(
		(message: Message | null, wrong = false) => setState((old) => ({ message, attempt: old.attempt + 1, mistakes: old.mistakes + (wrong ? 1 : 0) })),
		[]
	);
	return [state.message, state.attempt, set, state.mistakes];
}

function WriteStop({ stop, status, section, onSettle }: StopProps<Extract<PageStop, { kind: 'write' }>>) {
	const [keyboard, setKeyboard] = useKeyboardChoice();
	const box = useRef<HTMLDivElement>(null);
	const latex = useRef('');
	const [busy, setBusy] = useState(false);
	const [wrong, setWrong] = useState(false);
	const [message, attempt, setMessage, mistakes] = useFeedback();
	const field = () => box.current?.querySelector<HTMLElement & { value?: string }>('math-field');

	// The keyboard on screen covers the bottom of the page: the section makes room under itself, and the field
	// with its buttons comes above the keys.
	useEffect(() => {
		let detach = () => {};
		let cancelled = false;
		void loadMathLive().then(() => {
			const kb = window.mathVirtualKeyboard;
			if (cancelled || !kb) return;
			const onGeometry = () => {
				const height = kb.visible ? kb.boundingRect.height : 0;
				const mine = box.current?.contains(document.activeElement) ?? false;
				if (!height) section.style.removeProperty('--guided-keyboard');
				else if (mine && box.current) {
					section.style.setProperty('--guided-keyboard', `${height}px`);
					box.current.style.scrollMarginBottom = `${height + 16}px`;
					requestAnimationFrame(() => box.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
				}
			};
			kb.addEventListener('geometrychange', onGeometry);
			detach = () => kb.removeEventListener('geometrychange', onGeometry);
		});
		return () => {
			cancelled = true;
			detach();
			section.style.removeProperty('--guided-keyboard');
		};
	}, [section]);

	if (settled(status)) return null;

	const confirm = async () => {
		// read from the field itself: MathLive does not always report what was typed last (see OpenAnswer.tsx)
		const value = (field()?.value ?? latex.current).trim();
		if (busy) return;
		if (!value) return field()?.focus();
		setBusy(true);
		try {
			const response = await fetch('/api/lezioni/guidato', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ answer: stop.answer, grading: stop.grading, errors: stop.errors.map((e) => e.answer), latex: value })
			});
			if (response.status === 429) return setMessage({ text: TOO_MANY });
			if (!response.ok) throw new Error(String(response.status));
			const verdict = (await response.json()) as { correct: boolean; message?: string; error?: number };
			if (verdict.correct) {
				window.mathVirtualKeyboard?.hide();
				return onSettle('correct');
			}
			const foreseen = verdict.error === undefined ? undefined : stop.errors[verdict.error];
			setWrong(true);
			setMessage(foreseen ? { html: foreseen.html } : { text: verdict.message ?? WRONG, hint: stop.hint }, true);
		} catch {
			setMessage({ text: UNREACHABLE });
		} finally {
			setBusy(false);
		}
	};
	const switchKeyboard = () => {
		const next = keyboard === 'sapiens' ? 'device' : 'sapiens';
		setKeyboard(next);
		field()?.focus();
		if (next === 'sapiens') window.mathVirtualKeyboard?.show();
		else window.mathVirtualKeyboard?.hide();
	};

	return (
		<div ref={box}>
			<div className={cn('flex min-h-[56px] w-full max-w-md items-center rounded-xl border transition-[background-color,border-color] duration-200', wrong ? 'animate-nudge border-warn bg-warn-soft' : 'border-edge-strong bg-surface shadow-paper focus-within:border-inverse')}>
				<Suspense fallback={<span className="block flex-1 px-4 py-3 text-fg-faint">Carico il campo…</span>}>
					<MathField
						initial=""
						label="La tua risposta"
						layouts={LAYOUTS}
						keyboard={keyboard}
						onChange={(value) => {
							latex.current = value;
							setWrong(false);
						}}
						onEnter={() => void confirm()}
						className="flex-1 px-4 py-3 text-xl text-fg-strong"
					/>
				</Suspense>
				{keyboard && (
					<button
						type="button"
						onClick={switchKeyboard}
						aria-pressed={keyboard === 'sapiens'}
						aria-label={keyboard === 'sapiens' ? 'Usa la tastiera del dispositivo' : 'Usa la tastiera di Sapiens'}
						title={keyboard === 'sapiens' ? 'Tastiera del dispositivo' : 'Tastiera di Sapiens'}
						className={cn('mr-2 flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors focus-ring', keyboard === 'sapiens' ? 'bg-surface-3 text-fg-strong' : 'text-fg-subtle hover:bg-surface-3')}
					>
						<Keyboard className="size-5" aria-hidden="true" />
					</button>
				)}
			</div>
			<Feedback message={message} attempt={attempt} />
			<Actions status={status} busy={busy} mistakes={mistakes} onConfirm={() => void confirm()} onSettle={onSettle} />
		</div>
	);
}

function ChoiceStop({ stop, status, onSettle }: StopProps<Extract<PageStop, { kind: 'choice' }>>) {
	const name = useId();
	const [picked, setPicked] = useState<number | null>(null);
	const [tried, setTried] = useState<number[]>([]);
	const [message, attempt, setMessage, mistakes] = useFeedback();
	if (settled(status)) return null;

	const confirm = () => {
		if (picked === null) return setMessage({ text: 'Scegli una delle risposte, poi conferma.' });
		const option = stop.options[picked];
		if (option.right) return onSettle('correct');
		setTried((old) => (old.includes(picked) ? old : [...old, picked]));
		setMessage(option.message ? { html: option.message } : { text: WRONG }, true);
	};

	return (
		<div>
			<fieldset className="flex flex-col gap-2">
				<legend className="sr-only">Scegli una risposta</legend>
				{stop.options.map((option, i) => (
					<label
						key={i}
						className={cn(
							'flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border bg-surface px-3 py-2 text-fg transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-crimson-500',
							picked === i ? 'border-inverse shadow-paper' : 'border-edge-strong hover:bg-surface-3',
							tried.includes(i) && picked !== i && 'text-fg-subtle'
						)}
					>
						<input type="radio" name={name} checked={picked === i} onChange={() => setPicked(i)} className="size-4 shrink-0" />
						<span className="min-w-0" dangerouslySetInnerHTML={{ __html: option.html }} />
						{tried.includes(i) && <span className="sr-only"> (già provata: non è questa)</span>}
					</label>
				))}
			</fieldset>
			<Feedback message={message} attempt={attempt} />
			<Actions status={status} mistakes={mistakes} onConfirm={confirm} onSettle={onSettle} />
		</div>
	);
}

function SliderStop({ stop, status, onSettle }: StopProps<Extract<PageStop, { kind: 'slider' }>>) {
	const values = useRef<Record<string, number>>({});
	const onValues = useCallback((now: Record<string, number>) => {
		values.current = now;
	}, []);
	const [message, attempt, setMessage, mistakes] = useFeedback();
	// Found settled when the page is opened again, or shown on request: the sliders are where the answer wants them.
	const [found] = useState(settled(status));
	const answered = found || status === 'shown';
	const spec = useMemo(() => {
		if (!answered) return stop.plot;
		const at = Object.fromEntries(stop.expected.map((c) => [c.name, c.value]));
		return { ...stop.plot, sliders: stop.plot.sliders.map((s) => ({ ...s, value: at[s.name] ?? s.value })) };
	}, [stop, answered]);

	const confirm = () => {
		const verdict = judgeSliders(stop, values.current);
		if (verdict.correct) return onSettle('correct');
		const foreseen = verdict.error === undefined ? undefined : stop.errors[verdict.error];
		setMessage(foreseen ? { html: foreseen.html } : { text: WRONG_SLIDER, hint: stop.hint }, true);
	};

	return (
		<div>
			<Suspense fallback={<Waiting>Carico il piano…</Waiting>}>
				<LessonPlot key={answered ? 'answer' : 'try'} spec={spec} onValues={onValues} />
			</Suspense>
			{!settled(status) && (
				<>
					<Feedback message={message} attempt={attempt} />
					<Actions status={status} mistakes={mistakes} onConfirm={confirm} onSettle={onSettle} />
				</>
			)}
		</div>
	);
}

function Waiting({ children }: { children: ReactNode }) {
	return <div className="py-6 text-center text-sm text-fg-faint">{children}</div>;
}
