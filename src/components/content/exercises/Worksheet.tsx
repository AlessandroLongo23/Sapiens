import 'katex/dist/katex.min.css';
import Link from 'next/link';
import { RefreshCw } from 'lucide-react';
import type { QuestionBlock } from '@/lib/server/exercises';
import { SHEET_MAX, type SheetItem, type Worksheet as Sheet } from '@/lib/server/worksheet';
import { Html } from '@/components/ui/Html';
import { cn } from '@/lib/utils/cn';

interface Props {
	sheet: Sheet;
	/** The exercise page's path: the other sheets are `?scheda=<n>` on it. */
	path: string;
	/** At the top of the page (visitors without the path), without the rule that parts it from the path above. */
	first?: boolean;
}

/**
 * The lesson's exercises as a textbook page, to do on paper: numbered, grouped by level, the result folded under
 * each. Rendered on the server in full, so it is what a search engine reads of the exercise page.
 */
export function Worksheet({ sheet, path, first = false }: Props) {
	const next = sheet.sheet < SHEET_MAX ? sheet.sheet + 1 : 1;
	return (
		<section id="scheda" aria-labelledby="scheda-heading" className={cn('mx-4 mb-10 flex flex-col gap-6 sm:mx-6 md:mx-10', first ? 'mt-2' : 'mt-6 border-t border-edge pt-8')}>
			<header className="flex flex-wrap items-end justify-between gap-4">
				<div className="flex min-w-0 flex-col gap-1">
					<p className="label-mono text-fg-subtle">{sheet.sheet === 1 ? 'Scheda di esercizi' : `Scheda ${sheet.sheet}`}</p>
					<h2 id="scheda-heading" className="font-display text-2xl font-semibold text-fg-strong">
						{sheet.count} esercizi da fare sul quaderno
					</h2>
					<p className="max-w-xl text-fg-muted">Divisi per livello, dal più facile. Scrivi lo svolgimento per intero, poi apri il risultato sotto l&apos;esercizio per controllare.</p>
				</div>
				<Link href={`${path}?scheda=${next}#scheda`} rel="nofollow" className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-edge bg-surface px-4 text-sm font-medium text-fg shadow-paper transition-colors hover:border-edge-strong focus-ring">
					<RefreshCw className="size-4" aria-hidden="true" />
					Un&apos;altra scheda
				</Link>
			</header>

			{sheet.levels.map(({ level, name, promptHtml, items }) => (
				<section key={level} aria-labelledby={`scheda-livello-${level}`} className="flex flex-col gap-3">
					<h3 id={`scheda-livello-${level}`} className="flex flex-wrap items-baseline gap-x-2 border-b border-edge-soft pb-2 text-lg font-semibold text-fg-strong">
						<span className="label-mono text-fg-subtle">Livello {level}</span>
						{name && <span>{name}</span>}
					</h3>
					{promptHtml && <Html html={promptHtml} className="math-content font-medium text-fg" />}
					<ol className="flex flex-col">
						{items.map((item) => (
							<Exercise key={item.number} item={item} />
						))}
					</ol>
				</section>
			))}
		</section>
	);
}

function Exercise({ item }: { item: SheetItem }) {
	return (
		<li className="flex gap-3 border-b border-edge-soft py-3 last:border-b-0">
			<span className="w-7 shrink-0 pt-0.5 text-right font-mono text-sm text-fg-subtle tabular-nums" aria-hidden="true">
				{item.number}.
			</span>
			<div className="flex min-w-0 flex-1 flex-col gap-2">
				<span className="sr-only">Esercizio {item.number}.</span>
				{item.promptHtml && <Html html={item.promptHtml} className="math-content text-fg" />}
				{item.blocks.map((block, i) => (
					<SheetBlock key={i} block={block} />
				))}
				{item.optionsHtml && (
					<ol className="flex flex-wrap gap-x-6 gap-y-1 text-fg">
						{item.optionsHtml.map((html, i) => (
							<li key={i} className="flex items-baseline gap-1.5">
								<span className="font-mono text-sm text-fg-subtle">{'abcdefgh'[i]})</span>
								<Html as="span" html={html} className="math-content" />
							</li>
						))}
					</ol>
				)}
				<details className="group mt-1 text-sm">
					<summary className="w-fit cursor-pointer select-none rounded-md text-fg-subtle underline decoration-edge-strong underline-offset-4 hover:text-fg focus-ring">Risultato</summary>
					<Html html={item.answerHtml} className="math-content mt-2 break-words rounded-lg bg-surface-2 px-3 py-2 text-base text-fg-strong" />
				</details>
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
	return <Html html={block.html} className="math-content text-fg" />;
}
