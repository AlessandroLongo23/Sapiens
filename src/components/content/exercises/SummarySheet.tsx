'use client';

import type { ReactNode } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Sheet } from '@/components/ui/Sheet';

const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Props {
	open: boolean;
	correct: number;
	total: number;
	/** Whether the run passed its level or opened the one it was jumping to. */
	passed: boolean;
	/** What the run means on the path: "Livello 3 superato", "Ti servivano 8 risposte giuste". */
	title: string;
	detail: string;
	/** The buttons: what to do next, easiest to reach first. */
	actions: ReactNode;
	onClose: () => void;
}

/** End of a run: the score ring, what it means for the path, and what to do next. A sheet on phones, a centred card on wider screens. */
export function SummarySheet({ open, correct, total, passed, title, detail, actions, onClose }: Props) {
	const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
	const wrong = Math.max(0, total - correct);
	const ring = passed ? 'stroke-ok' : percent >= 50 ? 'stroke-warn' : 'stroke-accent';

	return (
		<Sheet open={open} onClose={onClose} title={title} hideTitle align="center" width="sm" footer={<div className="flex flex-col gap-2">{actions}</div>}>
			<div className="flex flex-col items-center gap-4 pt-1 text-center">
				<p className="label-mono text-fg-subtle">Riepilogo della prova</p>
				<div className="relative size-32" role="img" aria-label={`${correct} risposte corrette su ${total}, ${percent} per cento`}>
					<svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
						<circle cx="50" cy="50" r={RADIUS} className="fill-none stroke-surface-4" strokeWidth="8" />
						<circle cx="50" cy="50" r={RADIUS} className={`fill-none transition-[stroke-dashoffset] duration-700 ease-out ${ring}`} strokeWidth="8" strokeLinecap="round" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)} />
					</svg>
					<div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
						<span className="font-display text-4xl font-medium leading-none tracking-tight text-fg-strong tabular-nums">
							{correct}
							<span className="text-xl text-fg-subtle">/{total}</span>
						</span>
						<span className="label-mono mt-1.5 text-fg-subtle">{percent}%</span>
					</div>
				</div>
				<div className="flex flex-col gap-1">
					<p className="font-display text-2xl font-semibold text-fg-strong" aria-hidden="true">
						{title}
					</p>
					<p className="text-balance text-fg-muted">{detail}</p>
				</div>
				<dl className="flex items-center justify-center gap-6 pb-2 text-base font-semibold">
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
				</dl>
			</div>
		</Sheet>
	);
}
