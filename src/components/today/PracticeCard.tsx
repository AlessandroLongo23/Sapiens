import Link from 'next/link';
import { Check, Play } from 'lucide-react';
import type { PracticeState } from '@/lib/server/exercises';
import { PRACTICE_LENGTH } from '@/lib/exercises/practice';
import { CONTENT_ROOT } from '@/lib/config/site';
import { Button } from '@/components/ui/Button';

interface Props {
	practice: PracticeState;
	/** Starts or takes up the practice. */
	onStart: () => void;
	starting: boolean;
	/** A Free account with no questions left today. */
	blocked: boolean;
	error: string | null;
}

/** Today's practice: what it is, and the one button that starts it, takes it up, or says it is done. */
export function PracticeCard({ practice, onStart, starting, blocked, error }: Props) {
	const done = practice.state === 'done';
	return (
		<section aria-labelledby="practice-title" className="flex flex-col gap-4 rounded-2xl border border-inverse bg-surface p-5 shadow-lift sm:p-6">
			<div className="flex items-start justify-between gap-4">
				<div className="flex min-w-0 flex-col gap-1">
					<h2 id="practice-title" className="label-mono text-accent-fg">
						Pratica di oggi
					</h2>
					<p className="text-lg font-semibold text-fg-strong">
						{practice.state === 'none'
							? 'Parte dalle lezioni che hai cominciato'
							: practice.state === 'done'
								? `Fatta: ${practice.correct} giuste su ${practice.length}`
								: practice.state === 'doing'
									? `A metà: ${practice.answered} di ${practice.length}`
									: `${PRACTICE_LENGTH} domande dalle tue lezioni`}
					</p>
					<p className="text-sm text-fg-muted">
						{practice.state === 'none'
							? 'Fai una prova in una lezione: da domani la pratica te la ripropone insieme ai tuoi errori.'
							: done
								? 'Domani ne trovi una nuova.'
								: blocked
									? "Hai usato la sessione gratuita di oggi: domani la trovi qui, oppure passa a Studio."
									: 'Un po’ di quello che hai già fatto, gli errori da ripassare, un passo avanti. Circa tre minuti.'}
					</p>
				</div>
				{done && (
					<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ok text-white" aria-hidden="true">
						<Check className="size-5" strokeWidth={3} />
					</span>
				)}
			</div>
			{error && (
				<p role="alert" className="text-sm text-danger-fg">
					{error}
				</p>
			)}
			{practice.state === 'none' ? (
				<Link href={CONTENT_ROOT} className="flex min-h-[48px] items-center justify-center rounded-xl border border-edge-strong bg-surface px-6 font-semibold text-fg shadow-paper transition-colors hover:bg-surface-2 focus-ring">
					Scegli una lezione
				</Link>
			) : (
				!done && (
					<Button size="lg" className="w-full" onClick={onStart} loading={starting} disabled={blocked}>
						<Play className="size-4 fill-current" aria-hidden="true" />
						{practice.state === 'doing' ? 'Riprendi la pratica' : 'Inizia la pratica'}
					</Button>
				)
			)}
		</section>
	);
}
