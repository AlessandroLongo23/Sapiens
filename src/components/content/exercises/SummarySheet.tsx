'use client';

import { useEffect, type CSSProperties, type ReactNode } from 'react';
import { CheckCircle2, Timer, XCircle } from 'lucide-react';
import { Sheet } from '@/components/ui/Sheet';
import { useReducedMotion } from '@/lib/hooks/use-media';

const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** When the stamp lands, in ms after the sheet opens: after the ring has filled (see `.score-stamp`). */
const STAMP_LANDS = 1450;

/**
 * A number rolled up from zero, one wheel per digit, as on a numbering stamp. A tens wheel that turns makes the units
 * wheel go all the way round, so 10 rolls through every digit and does not sit still at 0.
 */
function Rolling({ value }: { value: number }) {
	const tens = Math.floor(value / 10);
	const units = value % 10;
	const wheel = (to: number, length: number) => (
		<span className="score-wheel">
			<span className="score-strip" style={{ '--n': to } as CSSProperties}>
				{Array.from({ length }, (_, i) => (
					<span key={i}>{i % 10}</span>
				))}
			</span>
		</span>
	);
	return (
		<>
			{tens > 0 && wheel(tens, 10)}
			{wheel(tens > 0 ? units + 10 : units, tens > 0 ? 20 : 10)}
		</>
	);
}

/** A run's time as the summary says it: "45 s", "3 min 40 s". */
function duration(ms: number) {
	const seconds = Math.max(1, Math.round(ms / 1000));
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return m === 0 ? `${s} s` : s === 0 ? `${m} min` : `${m} min ${s} s`;
}

interface Props {
	open: boolean;
	correct: number;
	total: number;
	/** The time spent answering, in ms, without the time on another tab or reading a solution. */
	activeMs?: number;
	/** Whether the run passed its level, counted as a repetition, or opened the level it was jumping to. */
	passed: boolean;
	/** The word on the stamp when it passed: "Superato", or "Fatta" for a repetition that is not the last. */
	stamp?: string;
	/** What the run means on the path: "Livello 3 superato", "Ti servivano 8 risposte giuste". */
	title: string;
	detail: string;
	/** The buttons: what to do next, easiest to reach first. */
	actions: ReactNode;
	onClose: () => void;
}

/**
 * End of a run: the score ring, what it means for the path, and what to do next. A sheet on phones, a centred card
 * on wider screens. The mistakes are not here: a button in `actions` opens them on the whole page (RunReview).
 */
export function SummarySheet({ open, correct, total, activeMs, passed, stamp = 'Superato', title, detail, actions, onClose }: Props) {
	const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
	const wrong = Math.max(0, total - correct);
	const ring = passed ? 'stroke-ok' : percent >= 50 ? 'stroke-warn' : 'stroke-accent';
	const still = useReducedMotion();

	// The stamp is felt as well as seen, where the phone can do it.
	useEffect(() => {
		if (!open || !passed || still) return;
		const timer = setTimeout(() => {
			try {
				navigator.vibrate?.(12);
			} catch {
				// Not every browser lets a page vibrate.
			}
		}, STAMP_LANDS);
		return () => clearTimeout(timer);
	}, [open, passed, still]);

	return (
		<Sheet open={open} onClose={onClose} title={title} hideTitle align="center" width="sm" footer={<div className="flex flex-col gap-2">{actions}</div>}>
			<div className="flex flex-col items-center gap-4 pt-1 text-center">
				<p className="label-mono text-fg-subtle">Riepilogo della prova</p>
				<div className="relative size-32" role="img" aria-label={`${correct} risposte corrette su ${total}, ${percent} per cento`}>
					<svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
						<circle cx="50" cy="50" r={RADIUS} className="fill-none stroke-surface-4" strokeWidth="8" />
						<circle cx="50" cy="50" r={RADIUS} className={`score-ring fill-none ${ring}`} style={{ '--full': CIRCUMFERENCE } as CSSProperties} strokeWidth="8" strokeLinecap="round" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)} />
					</svg>
					<div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
						<span className="font-display text-4xl font-medium leading-none tracking-tight text-fg-strong tabular-nums">
							<Rolling value={correct} />
							<span className="text-xl text-fg-subtle">/{total}</span>
						</span>
						<span className="label-mono mt-1.5 text-fg-subtle">{percent}%</span>
					</div>
					{passed && (
						<span className="score-stamp" aria-hidden="true">
							{stamp}
						</span>
					)}
				</div>
				<div className="flex flex-col gap-1">
					<p className="font-display text-2xl font-semibold text-fg-strong" aria-hidden="true">
						{title}
					</p>
					<p className="text-balance text-fg-muted">{detail}</p>
				</div>
				<dl className="score-after flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pb-2 text-base font-semibold">
					<div className="flex items-center gap-2 text-ok-fg">
						<CheckCircle2 className="size-5" aria-hidden="true" />
						<dd>{correct}</dd>
						<dt className="font-medium">{correct === 1 ? 'corretta' : 'corrette'}</dt>
					</div>
					<div className="flex items-center gap-2 text-danger-fg">
						<XCircle className="size-5" aria-hidden="true" />
						<dd>{wrong}</dd>
						<dt className="font-medium">{wrong === 1 ? 'sbagliata' : 'sbagliate'}</dt>
					</div>
					{!!activeMs && (
						<div className="flex items-center gap-2 text-fg-muted">
							<Timer className="size-5" aria-hidden="true" />
							<dt className="sr-only">Tempo</dt>
							<dd className="tabular-nums">{duration(activeMs)}</dd>
						</div>
					)}
				</dl>
			</div>
		</Sheet>
	);
}
