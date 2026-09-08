'use client';

import { ArrowRight, BookOpen, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { Sheet } from '@/components/ui/Sheet';
import { Button, LinkButton } from '@/components/ui/Button';

/** One line of encouragement per score band. */
const MESSAGES = [
	['Ripassa la teoria', 'Rileggi i concetti chiave'],
	['Ci sei quasi', 'Riprova con calma'],
	['Continua ad allenarti', 'Stai migliorando'],
	['Ottimo lavoro', 'Vai avanti così'],
	['Perfetto', 'Eccellente', 'Tutto corretto']
];

const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Props {
	open: boolean;
	correct: number;
	total: number;
	theoryHref: string;
	nextHref: string | null;
	onRetry: () => void;
	onClose: () => void;
}

/** End of an exercise session: the score ring, and what to do next. A sheet on phones, a centred card on wider screens. */
export function SummarySheet({ open, correct, total, theoryHref, nextHref, onRetry, onClose }: Props) {
	const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
	const wrong = Math.max(0, total - correct);
	const band = percent < 25 ? 0 : percent < 50 ? 1 : percent < 75 ? 2 : percent < 100 ? 3 : 4;
	const message = MESSAGES[band][correct % MESSAGES[band].length];
	const ring = percent >= 75 ? 'stroke-green-500' : percent >= 50 ? 'stroke-amber-500' : 'stroke-crimson-500';

	return (
		<Sheet
			open={open}
			onClose={onClose}
			title={message}
			align="center"
			bodyClass="px-5 pb-3"
			footer={
				<div className="flex flex-col gap-2">
					<Button size="lg" className="w-full" onClick={onRetry}>
						<RotateCcw className="size-5" aria-hidden="true" />
						Riprova con nuovi esercizi
					</Button>
					<div className={`grid gap-2 ${nextHref ? 'grid-cols-2' : 'grid-cols-1'}`}>
						<LinkButton href={theoryHref} variant="secondary" size="lg">
							<BookOpen className="size-4 shrink-0" aria-hidden="true" />
							Torna alla teoria
						</LinkButton>
						{nextHref && (
							<LinkButton href={nextHref} variant="secondary" size="lg">
								Prossima lezione
								<ArrowRight className="size-4 shrink-0" aria-hidden="true" />
							</LinkButton>
						)}
					</div>
				</div>
			}
		>
			<div className="flex flex-col items-center gap-4 pt-1 text-center">
				<p className="text-sm text-fg-muted">Ecco il riepilogo della tua sessione</p>
				<div className="relative size-32" role="img" aria-label={`${correct} risposte corrette su ${total}, ${percent} per cento`}>
					<svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
						<circle cx="50" cy="50" r={RADIUS} className="fill-none stroke-surface-4" strokeWidth="8" />
						<circle cx="50" cy="50" r={RADIUS} className={`fill-none transition-[stroke-dashoffset] duration-700 ease-out ${ring}`} strokeWidth="8" strokeLinecap="round" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)} />
					</svg>
					<div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
						<span className="text-3xl font-bold leading-none text-fg-strong">
							{correct}
							<span className="text-lg text-fg-subtle">/{total}</span>
						</span>
						<span className="mt-1 text-xs font-medium text-fg-subtle">{percent}%</span>
					</div>
				</div>
				<dl className="flex items-center justify-center gap-6 text-base font-semibold">
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
