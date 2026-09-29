import 'katex/dist/katex.min.css';
import type { ReactNode } from 'react';
import Link from 'next/link';
import type { QuestionBlock } from '@/lib/server/exercises';
import type { SheetItem, SheetLevel, Worksheet as Sheet } from '@/lib/server/worksheet';
import { dayName } from '@/lib/exercises/sheet-day';
import { Html } from '@/components/ui/Html';
import { SceneFigure } from './scenes';
import { cn } from '@/lib/utils/cn';
import { DayNav, LevelIndex, PrintMenu, RevealAll, SheetAnswer, SheetAnswers } from './WorksheetControls';

interface Props {
	sheet: Sheet;
	/** Today in Italy: the sheet at the plain address, and the last day of the archive. */
	today: string;
	/** The worksheet page's path; past days are `?giorno=<date>` on it. */
	path: string;
	/** The lesson in plain text, for the printed copy's header. */
	lesson: { title: string; context: string };
	/** The switch to the quick path, on the card's first row. */
	modes?: ReactNode;
}

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * The lesson's sheet of the day as a textbook page, to do on paper: numbered, grouped by level from the easiest, the
 * result under each behind a sticker to peel. Rendered on the server in full, so it is what a search engine reads of
 * the exercise page. It takes the page's width (data-wide-page): the levels beside it from `lg` up, two columns of
 * exercises where there is room for them.
 */
export function Worksheet({ sheet, today, path, lesson, modes }: Props) {
	const isToday = sheet.day === today;
	const name = dayName(sheet.day);
	const href = isToday ? path : `${path}?giorno=${sheet.day}`;
	return (
		<SheetAnswers>
			<section id="scheda" aria-labelledby="scheda-heading" data-wide-page className="@container mx-4 mb-12 mt-2 flex flex-col gap-10 sm:mx-6 md:mx-10">
				<header className="grid-paper flex flex-col gap-6 rounded-2xl border border-edge bg-surface p-5 shadow-lift sm:p-7">
					{modes}
					<div className="flex flex-col gap-6 @3xl:flex-row @3xl:items-end @3xl:justify-between">
						<div className="flex min-w-0 flex-col gap-2">
							<p className="label-mono flex flex-wrap items-baseline gap-x-3 text-fg-subtle">
								{isToday ? 'La scheda di oggi' : 'Una scheda dei giorni scorsi'}
								{!isToday && (
									<Link href={path} className="rounded font-sans text-sm font-medium normal-case tracking-normal text-accent-fg underline underline-offset-4 focus-ring">
										Torna a oggi
									</Link>
								)}
							</p>
							<h2 id="scheda-heading" className="text-balance font-display text-3xl font-semibold tracking-tight text-fg-strong sm:text-4xl">
								{capital(name)}
							</h2>
							<p className="max-w-xl text-pretty leading-relaxed text-fg-muted">
								{sheet.count} esercizi in {sheet.levels.length} livelli, dal più facile. Fai lo svolgimento sul quaderno, poi stacca l&apos;adesivo sotto l&apos;esercizio per vedere la soluzione. {isToday ? 'Domani ne trovi una nuova.' : 'Con le frecce passi da un giorno all’altro.'}
							</p>
						</div>
						<div className="flex shrink-0 flex-wrap items-center gap-3">
							<DayNav day={sheet.day} today={today} path={path} />
							<PrintMenu meta={{ title: lesson.title, context: lesson.context, day: sheet.day, dayName: dayName(sheet.day, true), count: sheet.count, href }} />
						</div>
					</div>
				</header>

				<div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12 xl:gap-16">
					{/* The levels, beside the sheet as the reader goes down it. */}
					<aside className="hidden lg:block">
						<div className="sticky top-28 flex flex-col gap-6">
							<LevelIndex levels={sheet.levels.map((l) => ({ level: l.level, name: l.name }))} />
							<RevealAll className="-ml-2.5 self-start" />
						</div>
					</aside>

					<div data-sheet-content className="flex min-w-0 flex-col gap-16">
						<div data-no-print className="-mb-10 lg:hidden">
							<RevealAll className="-ml-2.5" />
						</div>
						{sheet.levels.map((level, i) => (
							<Level key={level.level} level={level} index={i} />
						))}
					</div>
				</div>
			</section>
		</SheetAnswers>
	);
}

/** A level: a stamp with its number and a heading that reads from across the page, then its exercises. */
function Level({ level, index }: { level: SheetLevel; index: number }) {
	const { level: n, name, promptHtml, items } = level;
	const title = name ?? `Livello ${n}`;
	return (
		<section id={`livello-${n}`} data-level={n} data-sheet-level data-level-label={name ? `Livello ${n} · ${name}` : `Livello ${n}`} aria-labelledby={`livello-${n}-titolo`} className="scroll-mt-28">
			<header data-sheet-level-head className="flex items-start gap-4 border-b-2 border-fg-strong/80 pb-4 sm:gap-5">
				<span
					data-no-print
					className={cn(
						'flex size-12 shrink-0 items-center justify-center rounded-2xl border border-inverse bg-inverse font-display text-xl font-medium tabular-nums text-inverse-fg shadow-key sm:size-14 sm:text-2xl',
						index % 2 === 0 ? '-rotate-3' : 'rotate-2'
					)}
					aria-hidden="true"
				>
					{n}
				</span>
				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<p className="label-mono text-fg-subtle">
						Livello {n} · {items.length === 1 ? '1 esercizio' : `${items.length} esercizi`}
					</p>
					<h3 id={`livello-${n}-titolo`} className="text-pretty font-display text-2xl font-semibold leading-tight tracking-tight text-fg-strong sm:text-[1.75rem]">
						{title}
					</h3>
					{promptHtml && <Html html={promptHtml} className="math-content mt-1 text-fg-muted" />}
				</div>
			</header>
			<ol data-sheet-items className="grid gap-x-12 @4xl:grid-cols-2">
				{items.map((item) => (
					<Exercise key={item.number} item={item} />
				))}
			</ol>
		</section>
	);
}

function Exercise({ item }: { item: SheetItem }) {
	return (
		<li data-sheet-item data-number={item.number} className="flex gap-4 border-b border-edge-soft py-6">
			<span data-sheet-num className="mt-px flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md bg-surface-3 px-1.5 font-mono text-sm font-medium tabular-nums text-fg-strong" aria-hidden="true">
				{item.number}
			</span>
			<div className="flex min-w-0 flex-1 flex-col gap-3">
				<span className="sr-only">Esercizio {item.number}.</span>
				{item.promptHtml && <Html html={item.promptHtml} className="math-content text-fg" />}
				{item.blocks.map((block, i) => (
					<SheetBlock key={i} block={block} />
				))}
				{item.optionsHtml && (
					<ol data-sheet-options className="grid gap-x-6 gap-y-2 text-fg" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${item.optionWidth}rem), 1fr))` }}>
						{item.optionsHtml.map((html, i) => (
							<li key={i} className="flex items-baseline gap-2">
								<span className="font-mono text-sm text-fg-subtle">{'abcdefgh'[i]})</span>
								<Html as="span" html={html} className="math-content min-w-0" />
							</li>
						))}
					</ol>
				)}
				<SheetAnswer number={item.number} html={item.answerHtml} />
			</div>
		</li>
	);
}

/** A block of the problem, set as on a printed page: left-aligned, at the size of the text around it. */
function SheetBlock({ block }: { block: QuestionBlock }) {
	if (block.kind === 'givens')
		return (
			<p className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
				{block.items.map((html, i) => (
					<Html key={i} as="span" html={html} className="math-content whitespace-nowrap" />
				))}
			</p>
		);
	if (block.kind === 'math') return <Html html={block.html} className="math-content scroll-x py-0.5 text-lg" />;
	if (block.kind === 'figure') return <Html html={block.html} />;
	if (block.kind === 'scene') return <SceneFigure scene={block.scene} className="justify-start" />;
	return <Html html={block.html} className="math-content text-fg" />;
}
