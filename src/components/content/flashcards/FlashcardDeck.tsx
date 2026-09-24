'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, RotateCcw, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Html } from '@/components/ui/Html';
import { Button, LinkButton } from '@/components/ui/Button';

export interface FlashcardView {
	id: string;
	frontHtml: string;
	backHtml: string;
}

interface Props {
	cards: FlashcardView[];
	exercisesHref: string | null;
	nextHref: string | null;
}

type Verdict = 'known' | 'again';

const CARD_BODY = 'markdown-content math-content w-full break-words text-center [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_p]:my-2';

/**
 * A review round over the lesson's cards, in lesson order: the question, then
 * the answer under it, then "La sapevo" or "Da ripassare". At the end the
 * missed cards can be reviewed again on their own, until none is left.
 * Nothing is saved yet: progress per card id comes with student accounts.
 */
export function FlashcardDeck({ cards, exercisesHref, nextHref }: Props) {
	const [round, setRound] = useState(cards);
	const [index, setIndex] = useState(0);
	const [revealed, setRevealed] = useState(false);
	const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({});
	const heading = useRef<HTMLDivElement>(null);
	const answer = useRef<HTMLDivElement>(null);
	const card = round[index] ?? null;
	const done = !card;
	const again = round.filter((c) => verdicts[c.id] === 'again');

	const start = (next: FlashcardView[]) => {
		setRound(next);
		setIndex(0);
		setRevealed(false);
		setVerdicts({});
	};

	const judge = (verdict: Verdict) => {
		if (!card) return;
		setVerdicts((v) => ({ ...v, [card.id]: verdict }));
		setRevealed(false);
		setIndex((i) => i + 1);
	};

	// The question takes the focus as each card appears, the answer when it is revealed.
	useEffect(() => {
		(revealed ? answer : heading).current?.focus({ preventScroll: true });
	}, [index, revealed, round]);

	// Space or Enter on the card reveals it; once revealed, 1 and 2 answer.
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (done || e.altKey || e.ctrlKey || e.metaKey) return;
			const target = e.target as HTMLElement | null;
			if (target?.closest('input, textarea, [contenteditable="true"]')) return;
			if (!revealed && (e.key === ' ' || e.key === 'Enter') && !target?.closest('button, a')) {
				e.preventDefault();
				setRevealed(true);
			} else if (revealed && e.key === '1') judge('again');
			else if (revealed && e.key === '2') judge('known');
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	if (done) {
		const known = round.length - again.length;
		return (
			<div className="flex h-full min-h-[60dvh] w-full flex-col items-center justify-center p-4 sm:p-6">
				<div className="w-full max-w-md animate-rise-in rounded-3xl border border-edge-soft bg-surface p-6 text-center shadow-xl sm:p-8">
					<h2 ref={heading} tabIndex={-1} className="mb-2 text-2xl font-bold tracking-tight text-fg-strong outline-none">
						{again.length === 0 ? 'Le sapevi tutte' : `Ne sapevi ${known} su ${round.length}`}
					</h2>
					<p className="mb-6 leading-relaxed text-fg-subtle">
						{again.length === 0
							? round.length < cards.length
								? 'Anche quelle da ripassare, adesso sono a posto.'
								: 'Mettile alla prova con gli esercizi, dove servono anche i conti.'
							: again.length === 1
								? 'Una carta da ripassare: riguardala adesso, finché è fresca.'
								: `${again.length} carte da ripassare: riguardale adesso, finché sono fresche.`}
					</p>
					<div className="flex flex-col gap-3">
						{again.length > 0 && (
							<Button onClick={() => start(again)} size="lg" className="w-full">
								<Undo2 className="size-5" aria-hidden="true" />
								Ripassa {again.length === 1 ? 'la carta' : `le ${again.length} carte`}
							</Button>
						)}
						<Button onClick={() => start(cards)} variant="secondary" size="lg" className="w-full">
							<RotateCcw className="size-5" aria-hidden="true" />
							Ricomincia da capo
						</Button>
						{exercisesHref && (
							<LinkButton href={exercisesHref} variant="secondary" size="lg" className="w-full">
								Vai agli esercizi
							</LinkButton>
						)}
						{nextHref && (
							<LinkButton href={nextHref} variant="ghost" size="lg" className="w-full">
								Lezione successiva
								<ArrowRight className="size-5" aria-hidden="true" />
							</LinkButton>
						)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div id="flashcard" className="flex h-full w-full flex-col items-center gap-5 p-4 sm:p-8 md:px-10">
			<div className="flex w-full max-w-2xl items-center gap-3">
				<div className="flex flex-1 gap-1" role="progressbar" aria-label="Carte ripassate" aria-valuemin={0} aria-valuemax={round.length} aria-valuenow={index} aria-valuetext={`Carta ${index + 1} di ${round.length}`}>
					{round.map((c, i) => (
						<div key={c.id} className={cn('h-2 flex-1 rounded-full transition-colors duration-300', i < index ? (verdicts[c.id] === 'known' ? 'bg-ok' : 'bg-danger') : i === index ? 'bg-fg-faint' : 'bg-surface-4')} />
					))}
				</div>
				<span className="shrink-0 text-sm font-medium tabular-nums text-fg-subtle" aria-hidden="true">
					{index + 1}/{round.length}
				</span>
			</div>

			<div key={`${card.id}-${round.length}`} className="flex w-full max-w-2xl flex-1 animate-fade-in flex-col">
				<div className="flex min-h-[18rem] flex-col overflow-hidden rounded-3xl border border-edge-soft bg-surface shadow-lg">
					<div ref={heading} tabIndex={-1} className="flex flex-1 flex-col items-center justify-center px-5 py-8 text-lg font-semibold text-fg-strong outline-none sm:px-10 sm:text-xl">
						<span className="sr-only">Domanda {index + 1} di {round.length}. </span>
						<Html html={card.frontHtml} className={CARD_BODY} />
					</div>
					{revealed ? (
						<div ref={answer} tabIndex={-1} className="flex flex-1 animate-fade-in flex-col items-center justify-center border-t border-dashed border-edge bg-surface-2 px-5 py-8 text-base text-fg outline-none sm:px-10 sm:text-lg">
							<span className="sr-only">Risposta. </span>
							<Html html={card.backHtml} className={CARD_BODY} />
						</div>
					) : (
						<button type="button" onClick={() => setRevealed(true)} className="flex min-h-[56px] items-center justify-center border-t border-edge-soft bg-surface-2 px-5 py-4 font-semibold text-fg transition-colors hover:bg-surface-3 focus-ring">
							Mostra la risposta
						</button>
					)}
				</div>

				{revealed && (
					<div className="mt-4 grid grid-cols-2 gap-3" role="group" aria-label="Com'è andata">
						<button type="button" onClick={() => judge('again')} className="flex min-h-[56px] items-center justify-center gap-2 rounded-xl border-2 border-danger/40 bg-danger/10 px-4 py-3 font-semibold text-fg-strong transition-colors hover:bg-danger/20 focus-ring">
							<Undo2 className="size-5 text-danger" aria-hidden="true" />
							Da ripassare
						</button>
						<button type="button" onClick={() => judge('known')} className="flex min-h-[56px] items-center justify-center gap-2 rounded-xl border-2 border-ok/40 bg-ok/10 px-4 py-3 font-semibold text-fg-strong transition-colors hover:bg-ok/20 focus-ring">
							<Check className="size-5 text-ok" aria-hidden="true" />
							La sapevo
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
